import React from 'react';
import {
  Form,
  Card,
  Avatar,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Select,
  message,
  Table,
  Row,
  Col,
  Breadcrumb,
  Modal,
  Empty,
  Icon,
  Tooltip
} from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import * as webapi from './webapi';
import { Tabs, Spin } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Headline, BreadCrumb, history, Const, cache, RCi18n } from 'qmkit';
import OrderInformation from './component/order-information';
import SubscribInformation from './component/subscrib-information';
import PrescribInformation from './component/prescrib-information';
import DeliveryList from './component/delivery-list';
import DeliveryItem from './component/delivery-item';
import PaymentList from './component/payment-list';
import FeedbackList from './component/feedback-list';
import BenefitsList from './component/benefits-list';
import {
  getAddressInputTypeSetting,
  getAddressFieldList,
  getCountryList,
  getTaggingList
} from './component/webapi';

import './index.less';
import json from 'web_modules/qmkit/json';

const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const { Column } = Table;
const { confirm } = Modal;

const dogImg = require('./img/dog.png');
const catImg = require('./img/cat.png');

export const FORM_FIELD_MAP = {
  'First name': 'firstName',
  'Last name': 'lastName',
  Country: 'countryId',
  Region: 'area',
  State: 'province',
  City: 'city',
  Address1: 'address1',
  Address2: 'address2',
  'Phone number': 'contactPhone',
  'Postal code': 'postCode',
  Entrance: 'entrance',
  Apartment: 'apartment',
  Comment: 'rfc'
};

export async function getPetsBreedListByType(type: string) {
  return await webapi
    .querySysDictionary({
      type: type
    })
    .then((data) => {
      return data.res.context?.sysDictionaryVOS ?? [];
    })
    .catch(() => {
      return [];
    });
}

export async function getAddressConfig(customerId: string) {
  let fields = [];
  const addressInputType = await getAddressInputTypeSetting(customerId);
  if (addressInputType) {
    fields = await getAddressFieldList(addressInputType, customerId);
  }
  return fields;
}

const calcPetAge = (dateStr: string) => {
  const birthday = moment(dateStr, 'YYYY-MM-DD');
  const diffMonth = moment().diff(birthday, 'months');
  if (diffMonth <= 1) {
    return `${diffMonth} month`;
  } else if (diffMonth < 12) {
    return `${diffMonth} months`;
  } else {
    const diffYear = Math.floor(diffMonth / 12);
    const diffMonthAfterYear = diffMonth % 12;
    return `${diffYear} ${diffYear > 1 ? 'years' : 'year'} ${
      diffMonthAfterYear === 0
        ? ''
        : `${diffMonthAfterYear} ${diffMonthAfterYear > 1 ? 'months' : 'month'}`
    }`;
  }
};

const calcPetOwnerAge = (dateStr: string) => {
  const birthday = moment(dateStr, 'YYYY-MM-DD');
  const diffYear = moment().diff(birthday, 'years');
  return diffYear > 1 ? `${diffYear} years old` : `${diffYear} year old`;
};

export default class CustomerDetails extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      displayPage: 'detail',
      customerId: this.props.match.params.id ? this.props.match.params.id : '',
      customerAccount: this.props.match.params.account
        ? this.props.match.params.account
        : '',
      activeKey: 'order',
      loading: false,
      tagList: [],
      basic: {},
      memberShip: {},
      petOwnerTag: [],
      pets: [],
      delivery: {},
      addressType: 'delivery',
      startDate: moment().subtract(3, 'months').format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      fieldList: [],
      countryList: [],
      showElem: false
    };
  }
  componentDidMount() {
    this.getBasicInformation();
    this.getMemberShip();
    this.getPetsList();
    //this.getTagList();
    this.getAddressCon();
    if (this.props.location.query && this.props.location.query.hash) {
      document
        .getElementById('page-content')
        .scrollTo(
          0,
          document.getElementById(this.props.location.query.hash).offsetTop + 40
        );
    }
  }

  getBasicInformation = () => {
    this.setState({ loading: true });
    webapi
      .getBasicDetails(this.state.customerId)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            loading: false,
            basic: {
              ...res.context,
              customerAccount: this.state.customerAccount
            },
            petOwnerTag: res.context.segmentList
              ? res.context.segmentList.map((t) => t.name)
              : []
          });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };
  getMemberShip = () => {
    this.setState({ loading: true });
    webapi
      .getMemberShipDetails(this.state.customerId)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            loading: false,
            memberShip: { ...res.context }
          });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };
  getAddressCon = async () => {
    const fileds = await getAddressConfig(this.state.customerId);
    const countries = await getCountryList();
    this.setState({
      fieldList: fileds,
      countryList: countries
    });
  };

  getPetsList = async () => {
    const { customerAccount } = this.state;
    const [dogBreedList, catBreedList] = await Promise.all([
      getPetsBreedListByType('dogBreed'),
      getPetsBreedListByType('catBreed')
    ]);
    const pets = await webapi
      .petsByConsumer({ consumerAccount: customerAccount })
      .then((data) => {
        return (data.res.context?.context ?? []).map((pet) => ({
          ...pet,
          petsBreedName: pet.isPurebred
            ? ((pet.petsType === 'dog' ? dogBreedList : catBreedList).find(
                (breed) =>
                  breed.value === pet.petsBreed ||
                  breed.valueEn === pet.petsBreed
              ) ?? {})['name'] ?? pet.petsBreed
            : webapi.getMixedBreedDisplayName()
        }));
      });
    this.setState({
      pets: pets
    });
  };

  getTagList = () => {
    getTaggingList().then((data) => {
      this.setState({
        tagList: data.res.context.segmentList
      });
    });
  };

  setPetOwnerTagging = (values) => {
    const { tagList } = this.state;
    webapi
      .setTagging({
        relationId: this.state.customerId,
        segmentIdList: tagList
          .filter(
            (tag) => values.indexOf(tag.name) > -1 && tag.segmentType == 0
          )
          .map((tag) => tag.id),
        segmentType: 0
      })
      .then(() => {});
    this.setState({
      petOwnerTag: values
    });
  };

  clickTabs = (key) => {
    this.setState({
      activeKey: key
    });
  };
  showConfirm(id) {
    const that = this;
    confirm({
      title: RCi18n({ id: 'PetOwner.DeleteThisItem' }),
      onOk() {
        return that.removeConsumer(id);
      },
      onCancel() {}
    });
  }

  removeConsumer = (constomerId) => {
    this.setState({
      loading: true
    });
    let customerIds = [];
    customerIds.push(constomerId);
    let params = {
      customerIds: customerIds,
      userId: sessionStorage.getItem('employeeId')
        ? sessionStorage.getItem('employeeId')
        : ''
    };
    webapi
      .delCustomer(params)
      .then((data) => {
        if (data.res.code === Const.SUCCESS_CODE) {
          message.success(RCi18n({ id: 'PetOwner.OperateSuccessfully' }));
          history.push('/customer-list');
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };

  handleDeletePet = (petsId: string) => {
    this.setState({ loading: true });
    webapi
      .delPets({ petsIds: [petsId] })
      .then((data) => {
        message.success(data.res.message);
        this.setState(
          {
            loading: false
          },
          () => {
            this.getPetsList();
          }
        );
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  };

  handleChangeDateRange = (dates, dateStrs) => {
    this.setState({
      startDate: dateStrs[0],
      endDate: dateStrs[1]
    });
  };
  handleChangeshowElem = () => {
    this.setState((state) => ({
      showElem: !state.showElem
    }));
  };
  openDeliveryPage = (addressType, delivery) => {
    this.setState({
      displayPage: 'delivery',
      addressType: addressType,
      delivery: delivery
    });
  };

  backToDetail = () => {
    this.changeDisplayPage('detail');
  };

  changeDisplayPage = (page: string) => {
    this.setState(
      {
        displayPage: page
      },
      () => {
        document.getElementById('page-content').scrollTop = 0;
      }
    );
  };

  render() {
    const {
      displayPage,
      basic,
      memberShip,
      pets,
      delivery,
      addressType,
      startDate,
      endDate
    } = this.state;

    if (displayPage === 'delivery') {
      return (
        <div>
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  this.backToDetail();
                }}
              >
                <FormattedMessage id="PetOwner.petOwnerDetail" />
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {addressType === 'delivery'
                ? RCi18n({ id: 'Order.deliveryInformation' })
                : RCi18n({ id: 'Subscription.Billing information' })}
            </Breadcrumb.Item>
          </BreadCrumb>
          <DeliveryItem
            customerId={this.state.customerId}
            delivery={delivery}
            addressType={addressType}
            backToDetail={this.backToDetail}
          />
        </div>
      );
    }

    let isClubMember = memberShip && memberShip.isClubMember;

    return (
      <>
        <div>
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>
              <FormattedMessage id="PetOwner.petOwnerDetail" />
            </Breadcrumb.Item>
          </BreadCrumb>
          {/*导航面包屑*/}
          <Spin spinning={this.state.loading}>
            <div className="detail-container">
              <Headline
                title={RCi18n({ id: 'PetOwner.BasicInformation' })}
                extra={
                  <>
                    <Link
                      to={`/edit-petowner/${this.state.customerId}/${this.state.customerAccount}`}
                    >
                      <i className="iconfont iconDetails"></i>{' '}
                      <FormattedMessage id="PetOwner.Detail" />
                    </Link>
                    {/* <Link
                      to={`/pet-owner-activity/${this.state.customerId}`}
                      style={{ marginLeft: '20px' }}
                    >
                      <i className="iconfont iconfenxiang"></i>{' '}
                      <FormattedMessage id="Home.Overview" />
                    </Link> */}
                  </>
                }
              />
              <div style={{ margin: '20px 0' }}>
                <Row className="text-tip">
                  <Col span={4}>
                    <Icon type="user" /> <FormattedMessage id="PetOwner.Name" />
                  </Col>
                  <Col span={4}>
                    <Icon type="calendar" />{' '}
                    <FormattedMessage id="PetOwner.Age" />
                  </Col>
                  <Col
                    span={16}
                    className="text-align-right"
                    style={{ padding: '0 35px' }}
                  >
                    {/* <Popconfirm placement="topRight" title="Are you sure to remove this item?" onConfirm={() => this.removeConsumer(this.state.customerId)} okText="Confirm" cancelText="Cancel">
                      <Button type="link">
                        <FormattedMessage id="consumer.removeConsumer" />
                      </Button>
                    </Popconfirm> */}
                  </Col>
                </Row>
                <Row className="text-highlight" style={{ marginTop: 5 }}>
                  <Col span={4}>
                    <div style={{ paddingLeft: 19 }}>{basic.customerName}</div>
                  </Col>
                  <Col span={4}>
                    <div style={{ paddingLeft: 19 }}>
                      {basic.birthDay ? calcPetOwnerAge(basic.birthDay) : ''}
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="basic-info-detail">
                <Row>
                  <Col span={18}>
                    <Row type="flex" align="middle">
                      <Col span={4} className="text-tip">
                        <FormattedMessage id="PetOwner.RegistrationDate" />
                      </Col>
                      <Col span={8} className="text-highlight">
                        {basic.createTime
                          ? moment(basic.createTime, 'YYYY-MM-DD').format(
                              'YYYY-MM-DD'
                            )
                          : ''}
                      </Col>
                      <Col span={4} className="text-tip">
                        <FormattedMessage id="PetOwner.emailAddress" />
                      </Col>
                      <Col span={8} className="text-highlight">
                        {basic.email}
                      </Col>
                      <Col span={4} className="text-tip">
                        <FormattedMessage id="PetOwner.PreferChannel" />
                      </Col>
                      <Col span={8} className="text-highlight">
                        {['Email', 'Phone', 'Print']
                          .reduce((prev, curr) => {
                            if (+basic[`communication${curr}`]) {
                              prev.push(
                                curr === 'Print'
                                  ? RCi18n({ id: 'PetOwner.Message' })
                                  : RCi18n({ id: `PetOwner.${curr}` })
                              );
                            }
                            return prev;
                          }, [])
                          .join(' ')}
                      </Col>

                      {this.state.fieldList.map((field, idx) => (
                        <>
                          <Col
                            key={`label${idx * Math.random()}`}
                            span={4}
                            className="text-tip"
                          >
                            {RCi18n({ id: `PetOwner.${field.fieldName}` })}
                          </Col>
                          <Col
                            key={`field${idx * Math.random()}`}
                            span={8}
                            className="text-highlight"
                          >
                            {field.fieldName === 'Country'
                              ? basic.countryId
                                ? this.state.countryList.find(
                                    (c) => c.id === basic.countryId
                                  )?.name
                                : basic.country
                              : basic[FORM_FIELD_MAP[field.fieldName]]}
                          </Col>
                        </>
                      ))}
                    </Row>
                  </Col>
                </Row>

                {/* <Row>
                  <Col span={3} className="text-tip">
                    Consent
                  </Col>
                  <Col span={20} className="text-highlight">
                    {basic.userConsentList && basic.userConsentList.length > 0 ? basic.userConsentList.map((consent, idx) => <div key={idx} dangerouslySetInnerHTML={{ __html: consent.consentTitle }}></div>) : null}
                  </Col>
                </Row> */}
              </div>
            </div>
            {isClubMember ? (
              <div className="detail-container">
                <Headline
                  title={<FormattedMessage id="PetOwner.Membership" />}
                />
                <Row>
                  <Col span={24}>
                    <div className="Membership-info-detail">
                      <Row type="flex" align="middle">
                        <Col span={13}>
                          <i
                            className="iconfont iconhuangguan1"
                            style={{
                              fontSize: '20px',
                              marginRight: '20px',
                              color: 'var(--primary-color)'
                            }}
                          />
                          <FormattedMessage id="PetOwner.ClubMember" />
                        </Col>
                        <Col span={11}>
                          <div
                            style={{
                              position: 'absolute',
                              right: '20px',
                              top: '-10px'
                            }}
                          >
                            <span
                              onClick={this.handleChangeshowElem}
                              style={{
                                cursor: 'pointer',
                                color: 'var(--primary-color)'
                              }}
                            >
                              <FormattedMessage id="PetOwner.more" />{' '}
                              <i
                                style={{ fontSize: '12px', marginLeft: '-2px' }}
                              >
                                <Icon
                                  type={this.state.showElem ? 'down' : 'up'}
                                />
                              </i>
                            </span>
                          </div>
                        </Col>
                      </Row>
                      <div
                        className={`${
                          this.state.showElem ? '' : 'hide'
                        } word-style`}
                      >
                        <Row gutter={16}>
                          <Col span={12} className="text-tip">
                            <div className="Membership-info-box">
                              <span className="Membership-info-box-label">
                                <FormattedMessage id="PetOwner.AdmissionDate" />
                                :
                              </span>
                              <span className="Membership-info-box-text">
                                {memberShip.admissionDate
                                  ? moment(
                                      memberShip.admissionDate,
                                      'YYYY-MM-DD'
                                    ).format('YYYY-MM-DD')
                                  : ''}
                              </span>
                            </div>
                          </Col>
                          <Col span={12} className="text-tip">
                            <div className="Membership-info-box">
                              <span className="Membership-info-box-label">
                                <FormattedMessage id="PetOwner.SubscriptionNo" />
                                :
                              </span>
                              <span
                                className="Membership-info-box-text"
                                style={{
                                  color: 'var(--primary-color)',
                                  textDecoration: 'underline'
                                }}
                              >
                                {memberShip.subscriptionNo}
                              </span>
                            </div>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={24} className="text-tip">
                            <FormattedMessage id="PetOwner.ClubLoyaltyProgram" />
                            {/*<span>{memberShip.clubLoyaltyProgram}</span>*/}
                          </Col>
                          <Col span={12} className="text-tip">
                            <div className="Membership-info-box">
                              <span className="Membership-info-box-label">
                                <FormattedMessage id="PetOwner.WelcomeBox" />:
                              </span>
                              <span
                                className="Membership-info-box-text"
                                style={{ color: '#585858', fontSize: 16 }}
                              >
                                {memberShip.welcomeBox}
                              </span>
                            </div>
                          </Col>
                          <Col span={12} className="text-tip">
                            <div className="Membership-info-box">
                              <span className="Membership-info-box-label">
                                <FormattedMessage id="PetOwner.ConsumptionGift" />
                                :
                              </span>
                              <span
                                className="Membership-info-box-text"
                                style={{
                                  color: 'var(--primary-color)',
                                  textDecoration: 'underline'
                                }}
                              >
                                {memberShip.consumptionGift}
                              </span>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            ) : null}
            <div className="detail-container">
              <Headline title="Tagging" />
              <Row>
                <Col span={12}>
                  <div className="text-highlight">
                    <FormattedMessage id="PetOwner.TagName" />
                  </div>
                  <div>
                    {/* <Select
                      style={{ width: '100%' }}
                      value={this.state.petOwnerTag}
                      mode="multiple"
                      onChange={this.setPetOwnerTagging}
                      getPopupContainer={(trigger: any) => trigger.parentNode}
                    >
                      {this.state.tagList
                        .filter((item) => item.segmentType == 0)
                        .map((v, idx) => (
                          <Option value={v.name} key={v.id}>
                            {v.name}
                          </Option>
                        ))}
                    </Select> */}
                    {this.state.petOwnerTag && this.state.petOwnerTag.join(',')}
                  </div>
                </Col>
              </Row>
            </div>
            <div className="detail-container" id="pets-list">
              <Headline title={RCi18n({ id: 'PetOwner.PetInformation' })} />
              <Row gutter={16}>
                {pets.map((pet, idx) => (
                  <Col key={idx} span={8} style={{ margin: '10px 0' }}>
                    <Card bodyStyle={{ padding: '10px 20px' }}>
                      <div className="text-align-right">
                        {/* <Popconfirm placement="topRight" title="Are you sure to remove this item?" onConfirm={() => {}} okText="Confirm" cancelText="Cancel">
                          <Button type="link">
                            <span className="iconfont iconDelete"></span> Delete
                          </Button>
                        </Popconfirm> */}
                        <Link
                          to={`/edit-pet/${this.state.customerId}/${this.state.customerAccount}/${pet.petsId}`}
                        >
                          <span className="iconfont iconDetails"></span>{' '}
                          <FormattedMessage id="PetOwner.Detail" />
                        </Link>
                      </div>
                      <Row gutter={10}>
                        <Col span={6}>
                          <Avatar
                            size={70}
                            src={
                              pet.petsImg && pet.petsImg.startsWith('http')
                                ? pet.petsImg
                                : pet.petsType === 'dog'
                                ? dogImg
                                : catImg
                            }
                          />
                        </Col>
                        <Col span={18}>
                          <Row>
                            <Col span={24}>
                              <div className="text-highlight">
                                {pet.petsName}
                              </div>
                            </Col>
                          </Row>
                          <Row className="text-tip">
                            <Col span={12}>
                              <FormattedMessage id="PetOwner.Age" />
                            </Col>
                            <Col span={12}>
                              <FormattedMessage id="PetOwner.Breed" />
                            </Col>
                          </Row>
                          <Row style={{ fontSize: 16 }}>
                            <Col span={12}>
                              {pet.birthOfPets
                                ? calcPetAge(pet.birthOfPets)
                                : ''}
                            </Col>
                            <Col span={12}>
                              {pet.petsBreed && (
                                <Tooltip title={pet.petsBreedName}>
                                  <div
                                    style={{
                                      whiteSpace: 'nowrap',
                                      textOverflow: 'ellipsis',
                                      overflow: 'hidden'
                                    }}
                                  >
                                    {pet.petsBreedName}
                                  </div>
                                </Tooltip>
                              )}
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
                {pets.length === 0 && (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </Row>
            </div>
            <div className="container">
              <Headline
                title={RCi18n({ id: 'PetOwner.OtherInformation' })}
                extra={
                  <RangePicker
                    style={{
                      display:
                        ['order', 'subscrib', 'benefit'].indexOf(
                          this.state.activeKey
                        ) > -1
                          ? 'block'
                          : 'none'
                    }}
                    allowClear={false}
                    value={[
                      moment(startDate, 'YYYY-MM-DD'),
                      moment(endDate, 'YYYY-MM-DD')
                    ]}
                    onChange={this.handleChangeDateRange}
                    getCalendarContainer={() =>
                      document.getElementById('page-content')
                    }
                  />
                }
              />
              <Tabs activeKey={this.state.activeKey} onChange={this.clickTabs}>
                <TabPane
                  tab={RCi18n({ id: 'PetOwner.OrderInformation' })}
                  key="order"
                >
                  <OrderInformation
                    startDate={startDate}
                    endDate={endDate}
                    customerId={this.state.customerId}
                  />
                </TabPane>
                <TabPane
                  tab={RCi18n({ id: 'PetOwner.SubscriptionInformation' })}
                  key="subscrib"
                >
                  <SubscribInformation
                    startDate={startDate}
                    endDate={endDate}
                    customerAccount={this.state.customerAccount}
                  />
                </TabPane>
                <TabPane
                  tab={RCi18n({ id: 'PetOwner.PrescriberInformation' })}
                  key="prescrib"
                >
                  <PrescribInformation
                    customerAccount={this.state.customerAccount}
                  />
                </TabPane>
                <TabPane
                  tab={RCi18n({ id: 'PetOwner.DeliveryInformation' })}
                  key="delivery"
                >
                  {displayPage === 'detail' && (
                    <DeliveryList
                      customerId={this.state.customerId}
                      type="DELIVERY"
                      onEdit={(record) =>
                        this.openDeliveryPage('delivery', record)
                      }
                    />
                  )}
                </TabPane>
                <TabPane
                  tab={RCi18n({ id: 'PetOwner.BillingInfomation' })}
                  key="billing"
                >
                  {displayPage === 'detail' && (
                    <DeliveryList
                      customerId={this.state.customerId}
                      type="BILLING"
                      onEdit={(record) =>
                        this.openDeliveryPage('billing', record)
                      }
                    />
                  )}
                </TabPane>
                <TabPane
                  tab={RCi18n({ id: 'PetOwner.PaymentMethods' })}
                  key="payment"
                >
                  <PaymentList
                    customerId={this.state.customerId}
                    customerAccount={this.state.customerAccount}
                  />
                </TabPane>
                <TabPane
                  tab={RCi18n({ id: 'PetOwner.Feedback' })}
                  key="feedback"
                >
                  <FeedbackList customerId={this.state.customerId} />
                </TabPane>
                {/* {isClubMember ? (
                  <TabPane
                    tab={<FormattedMessage id="PetOwner.Benefit" />}
                    key="benefit"
                  >
                    <BenefitsList
                      startDate={startDate}
                      endDate={endDate}
                      customerAccount={this.state.customerAccount}
                    />
                  </TabPane>
                ) : null} */}
              </Tabs>
            </div>
          </Spin>
        </div>
      </>
    );
  }
}
