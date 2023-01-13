import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Button, Form, Input, DatePicker, Select, Menu, Dropdown, Icon, Tabs, message, Spin, Row, Col } from 'antd';
import './index.less';
import { AuthWrapper, BreadCrumb, Headline, SelectGroup, Const, RCi18n, cache  } from 'qmkit';
import List from './components/list-new';
import { FormattedMessage } from 'react-intl';
import * as webapi from './webapi';
import StoreSelection from '../common-components/store-selection';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group

export default class SubscriptionList extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      searchForm: {
        storeId: '',
        subscriptionOption: 'Subscription Number',
        number: '',
        consumerOption: 'Pet Owner Name',
        consumer: '',
        productOption: 'Product Name',
        product: '',
        frequency: '',
        recipientOption: 'Receiver',
        recipient: '',
        prescriberOption: 'Auditor Name',
        prescriber: '',
        frequencyOption: 'autoship',
        phoneNumber: 'Phone number',
        phone: '',
      },
      subscriptionOption: ['Subscription Number', 'Order Number'],
      consumerOption: ['Pet Owner Name', 'Pet Owner Account'],
      productOption: ['Product Name', 'SKU Code'],
      recipientOption: ['Receiver', 'Receiver Phone'],
      prescriberOption: ['Auditor Name', 'Auditor ID'],
      frequencyOption: ['autoship', 'club'],
      phoneNumber: ['Phone number', 'Delivery address phone number'],
      frequencyList: [],
      frequencyListClub: [],
      activeKey: 'all',
      subscriptionList: [],
      searchParams: {},
      loading: true,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      isPrescriber: false,
      prescriberList: [],
      prescriberIds: [],
      subscriptionType: '',
      subscriptionPlanType: '',

      subscriptionPlanTypeListClone: [
        { value: 'Cat', name: RCi18n({ id: 'Order.cat' }) },
        { value: 'Dog', name: RCi18n({ id: 'Order.dog' }) },
        { value: 'Cat_Dog', name: RCi18n({ id: 'Order.Cat&Dog' }) },
        { value: 'SmartFeeder', name: RCi18n({ id: 'Order.smartFeeder' }) }
      ],
      subscriptionTypeList: [
        { value: 'ContractProduct', name: RCi18n({ id: 'Order.contractProduct' }) },
        { value: 'Club', name: RCi18n({ id: 'Order.club' }) },
        { value: 'Autoship', name: RCi18n({ id: 'Order.autoship' }) },
        { value: 'Autoship_Club', name: RCi18n({ id: 'Order.Autoship&Club' }) }
      ],
    };
  }

  componentDidMount() {
    // this.querySysDictionary('Frequency_day');
    // this.querySysDictionary('Frequency_day_club');
    if (sessionStorage.getItem('s2b-supplier@employee')) {
      let employee = JSON.parse(sessionStorage.getItem('s2b-supplier@employee'));
      if (employee.roleName && employee.roleName.indexOf('Prescriber') !== -1) {
        const { searchForm } = this.state;
        let prescriberList = employee.prescribers;
        let isPrescriber = true;
        let prescriberIds = [];
        for (let i = 0; i < prescriberList.length; i++) {
          if (prescriberList[i].id) {
            prescriberIds.push(prescriberList[i].id);
          }
        }
        searchForm.prescriberOption = 'Auditor ID';
        searchForm.prescriber = 'all';
        this.setState(
          {
            searchForm: searchForm,
            prescriberList: prescriberList,
            isPrescriber: isPrescriber,
            prescriberIds: prescriberIds
          },
          () => {
            this.onSearch();
          }
        );
      } else {
        this.onSearch();
      }
    } else {
      this.onSearch();
    }
    //
  }

  onFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    if (field === 'frequencyOption') {
      data['frequency'] = '';
    }
    this.setState({
      searchForm: data
    });
  };

  onSearch = () => {
    const { searchForm, activeKey, subscriptionType, subscriptionPlanType } = this.state;
    let prescriberType = JSON.parse(sessionStorage.getItem('PrescriberType')) ? JSON.parse(sessionStorage.getItem('PrescriberType')).value : null;
    let param = {
      storeId: searchForm.storeId,
      orderNumber: searchForm.subscriptionOption === 'Order Number' ? searchForm.number : '',
      subscriptionNumber: searchForm.subscriptionOption === 'Subscription Number' ? searchForm.number : '',
      consumerName: searchForm.consumerOption === 'Pet Owner Name' ? searchForm.consumer : '',
      consumerAccount: searchForm.consumerOption === 'Pet Owner Account' ? searchForm.consumer : '',
      productName: searchForm.productOption === 'Product Name' ? searchForm.product : '',
      skuCode: searchForm.productOption === 'SKU Code' ? searchForm.product : '',
      recipient: searchForm.recipientOption === 'Recipient' ? searchForm.recipient : '',
      recipientPhone: searchForm.recipientOption === 'Recipient Phone' ? searchForm.recipient : '',
      prescriberId://'s2b-employee@data'
        JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).clinicsIds != null ? prescriberType : searchForm.prescriberOption === 'Auditor ID' ? searchForm.prescriber : '',
      prescriberName: searchForm.prescriberOption === 'Auditor Name' ? searchForm.prescriber : '',
      frequency: searchForm.frequency,
      status: activeKey,
      subscriptionType,
      subscriptionPlanType,
      phoneNum: searchForm.phoneNumber === 'Phone number' ? searchForm.phone : '',
      consigneeNumber: searchForm.phoneNumber === 'Delivery address phone number' ? searchForm.phone : '',
    };
    this.setState(
      () => {
        return {
          searchParams: {
            storeId: param.storeId,
            customerAccount: param.consumerAccount ? param.consumerAccount : '',
            customerName: param.consumerName ? param.consumerName : '',
            subscribeId: param.subscriptionNumber,
            cycleTypeId: param.frequency,
            subscribeStatus: param.status === 'all' ? '' : param.status,
            consigneeName: param.recipient ? param.recipient : '',
            // consigneeNumber: param.recipientPhone ? param.recipientPhone : '',
            orderCode: param.orderNumber ? param.orderNumber : '',
            skuNo: param.skuCode ? param.skuCode : '',
            goodsName: param.productName ? param.productName : '',
            prescriberId: param.prescriberId ? param.prescriberId : '',
            prescriberName: param.prescriberName ? param.prescriberName : '',
            subscriptionType,
            subscriptionPlanType,
            phoneNum: param.phoneNum ? param.phoneNum : '',
            consigneeNumber: param.consigneeNumber ? param.consigneeNumber : '',
          }
        };
      },
      () => this.getSubscriptionList(this.state.searchParams)
    );
  };
  //查询frequency

  querySysDictionary = (type: String) => {
    webapi
      .querySysDictionary({
        type: type
      })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          if (type === 'Frequency_day') {
            let frequencyList = [...res.context.sysDictionaryVOS];
            this.setState(
              {
                frequencyList: frequencyList
              },
              () => this.querySysDictionary('Frequency_week')
            );
          }
          if (type === 'Frequency_day_club') {
            let frequencyList = [...res.context.sysDictionaryVOS];
            this.setState(
              {
                frequencyListClub: frequencyList
              },
              () => this.querySysDictionary('Frequency_week_club')
            );
          }
          if (type === 'Frequency_week') {
            let frequencyList = [...this.state.frequencyList, ...res.context.sysDictionaryVOS];
            this.setState(
              {
                frequencyList: frequencyList
              },
              () => this.querySysDictionary('Frequency_month')
            );
          }
          if (type === 'Frequency_week_club') {
            let frequencyList = [...this.state.frequencyListClub, ...res.context.sysDictionaryVOS];
            this.setState(
              {
                frequencyListClub: frequencyList
              },
              () => this.querySysDictionary('Frequency_month_club')
            );
          }
          if (type === 'Frequency_month') {
            let frequencyList = [...this.state.frequencyList, ...res.context.sysDictionaryVOS];
            this.setState({
              frequencyList: frequencyList
            });
          }
          if (type === 'Frequency_month_club') {
            let frequencyList = [...this.state.frequencyListClub, ...res.context.sysDictionaryVOS];
            this.setState({
              frequencyListClub: frequencyList
            });
          }
        }
      })
      .catch((err) => { });
  };
  //todo
  _handleBatchExport = () => { };
  onTabChange = (key) => {
    this.setState(
      {
        activeKey: key
      },
      () => this.onSearch()
    );
  };
  getSubscriptionList = (param?) => {
    if (this.state.isPrescriber && param.prescriberId === 'all') {
      param.prescriberId = '';
      param.prescriberIds = this.state.prescriberIds;
    }
    let params = Object.assign({ pageSize: 10, pageNum: 0 }, param);

    this.setState({
      loading: true
    });
    webapi
      .getSubscriptionList(params)
      .then((data) => {
        let { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let pagination = {
            current: 1,
            pageSize: 10,
            total: res.context.total
          };
          this.setState(() => {
            return {
              subscriptionList: res.context.subscriptionResponses,
              loading: false,
              pagination: pagination
            };
          });
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

  getSubsrciptionPlanType = (subsriptionType) => {
    const { subscriptionPlanTypeListClone } = this.state;
    let newSubscriptionPlanTypeList = [];
    if (subsriptionType) {
      if (subsriptionType === 'ContractProduct') {
        newSubscriptionPlanTypeList = subscriptionPlanTypeListClone.filter((item) => item.value === 'SmartFeeder');
      } else if (subsriptionType.indexOf('Club') >= 0) {
        newSubscriptionPlanTypeList = subscriptionPlanTypeListClone.filter((item) => item.value === 'Cat_Dog' || item.value === 'Dog' || item.value === 'Cat');
      }
    } else {
      this.setState({
        subscriptionPlanType: ''
      })
    }
    this.setState({
      subscriptionPlanTypeList: newSubscriptionPlanTypeList
    });
  };

  render() {
    const { searchForm, subscriptionOption, productOption, consumerOption,phoneNumber,
      recipientOption, frequencyOption, frequencyList, frequencyListClub, activeKey,
      prescriberOption, prescriberList, subscriptionType,
      subscriptionPlanType, subscriptionTypeList, subscriptionPlanTypeList } = this.state;
    // 将frequencyListClub和frequencyList存起来，以便导出页面使用
    sessionStorage.setItem('frequencyList', JSON.stringify((frequencyList || []).map(item => ({ value: item.id, name: item.name }))));
    sessionStorage.setItem('frequencyListClub', JSON.stringify((frequencyListClub || []).map(item => ({ value: item.id, name: item.name }))));
    const menu = (
      <Menu>
        <Menu.Item>
          <AuthWrapper functionName="f_subscription_export_1">
            <Link to="/batch-export/subscription-list" >
              <FormattedMessage id="Subscription.batchExport" />
            </Link>
          </AuthWrapper>
        </Menu.Item>
      </Menu>
    );
    let prescriberType = JSON.parse(sessionStorage.getItem('PrescriberType')) ? JSON.parse(sessionStorage.getItem('PrescriberType')).value : null;

    const clinicsIds = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)) ? JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).clinicsIds : null;

    return (
      
        <div className="order-con">
          <BreadCrumb />
          <div className="container-search">
            <Headline title={<FormattedMessage id="Subscription.SubscriptionList" />} />
            <Form className="filter-content" layout="inline">
              <Row>
                <Col span={8}>
                  <FormItem>
                    <StoreSelection
                      formItemStyle={styles.formItemStyle}
                      labelStyle={styles.label}
                      wrapperStyle={styles.newWrapper}
                      onChange={(value) => {
                        this.onFormChange({
                          field: 'storeId',
                          value
                        });
                      }}
                    />
                  </FormItem>
                </Col>

                <Col span={8}>
                  <FormItem>
                    <Input
                      addonBefore={
                        <Select
                          style={styles.label}
                          defaultValue={searchForm.subscriptionOption}
                          onChange={(value) => {
                            value = value === '' ? null : value;
                            this.onFormChange({
                              field: 'subscriptionOption',
                              value
                            });
                          }}
                        >
                          {subscriptionOption.map((item) => (
                            <Option value={item} key={item}>
                              <FormattedMessage id={`Subscription.${item}`} />
                            </Option>
                          ))}
                        </Select>
                      }
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'number',
                          value
                        });
                      }}
                    />
                  </FormItem>
                </Col>

                <Col span={8}>
                  <FormItem>
                    <Input
                      addonBefore={
                        <Select
                          style={styles.label}
                          defaultValue={searchForm.productOption}
                          onChange={(value) => {
                            value = value === '' ? null : value;
                            this.onFormChange({
                              field: 'productOption',
                              value
                            });
                          }}
                        >
                          {productOption.map((item) => (
                            <Option value={item} key={item}>
                              <FormattedMessage id={`Subscription.${item}`} />
                            </Option>
                          ))}
                        </Select>
                      }
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'product',
                          value
                        });
                      }}
                    />
                  </FormItem>
                </Col>

                {/* <Col span={8}>
                  <FormItem>
                    <InputGroup compact style={styles.formItemStyle}>
                      <Select
                        style={styles.label}
                        defaultValue={searchForm.frequencyOption}
                        onChange={(value) => {
                          value = value === '' ? null : value;
                          this.onFormChange({
                            field: 'frequencyOption',
                            value
                          });
                        }}
                      >
                        {frequencyOption.map((item) => (
                          <Option value={item} key={item}>
                            {RCi18n({ id: 'Subscription.Frequency' })} ({RCi18n({ id: `Order.${item}` })})
                          </Option>
                        ))}
                      </Select>
                      <Select
                        style={styles.newWrapper}
                        allowClear
                        value={searchForm.frequency}
                        // disabled={orderType !== 'SUBSCRIPTION' && orderType !== 'MIXED_ORDER'}
                        getPopupContainer={(trigger: any) => trigger.parentNode}
                        onChange={(value) => {
                          this.onFormChange({
                            field: 'frequency',
                            value
                          });
                        }}
                      >
                        {(searchForm.frequencyOption === 'autoship' ? frequencyList : frequencyListClub).map((item, index) => (
                          <Option value={item.id} key={index}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </InputGroup>
                  </FormItem>
                </Col> */}


                {/* <Col span={8}>
                  <FormItem>
                    <SelectGroup
                      defaultValue=""
                      label={<p style={{ width: 110 }}><FormattedMessage id="Subscription.Frequency" /></p>}
                      style={{ width: 180 }}
                      onChange={(value) => {
                        value = value === '' ? null : value;
                        this.onFormChange({
                          field: 'frequency',
                          value
                        });
                      }}
                    >
                      <Option value="">
                        <FormattedMessage id="Subscription.all" />
                      </Option>
                      {frequencyList &&
                        frequencyList.map((item, index) => (
                          <Option value={item.id} key={index}>
                            {item.name}
                          </Option>
                        ))}
                    </SelectGroup>
                  </FormItem>
                </Col> */}

                <Col span={8}>
                  <FormItem>
                    <Input
                      addonBefore={
                        <Select
                          style={styles.label}
                          defaultValue={searchForm.consumerOption}
                          onChange={(value) => {
                            value = value === '' ? null : value;
                            this.onFormChange({
                              field: 'consumerOption',
                              value
                            });
                          }}
                        >
                          {consumerOption.map((item) => (
                            <Option value={item} key={item}>
                              <FormattedMessage id={`Subscription.${item}`} />
                            </Option>
                          ))}
                        </Select>
                      }
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'consumer',
                          value
                        });
                      }}
                    />
                  </FormItem>
                </Col>

                <Col span={8}>
                  {/* todo */}
                  {this.state.isPrescriber ? (
                    <FormItem>
                      <SelectGroup
                        disabled={JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).clinicsIds ? true : false}
                        value={clinicsIds ? prescriberType : searchForm.prescriber}
                        // value={searchForm.prescriber}
                        label={<p style={styles.label}><FormattedMessage id="Subscription.Prescriber" /></p>}
                        onChange={(value) => {
                          value = value === '' ? null : value;
                          this.onFormChange({
                            field: 'prescriber',
                            value
                          });
                        }}
                      >
                        <Option value="all"><FormattedMessage id="Subscription.all" /></Option>
                        {prescriberList &&
                          prescriberList.map((item: any, index: any) => (
                            <Option value={item.id} key={index}>
                              {item.prescriberName}
                            </Option>
                          ))}
                      </SelectGroup>
                    </FormItem>
                  ) : (
                    <FormItem>
                      <Input
                        addonBefore={
                          <Select
                            style={styles.label}
                            defaultValue={searchForm.prescriberOption}
                            onChange={(value) => {
                              value = value === '' ? null : value;
                              this.onFormChange({
                                field: 'prescriberOption',
                                value
                              });
                            }}
                          >
                            {prescriberOption.map((item) => (
                              <Option value={item} key={item}>
                                <FormattedMessage id={`Subscription.${item}`} />
                              </Option>
                            ))}
                          </Select>
                        }
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          this.onFormChange({
                            field: 'prescriber',
                            value
                          });
                        }}
                      />
                    </FormItem>
                  )}
                </Col>

                <Col span={8}>
                  <FormItem>
                    <InputGroup compact style={styles.formItemStyle}>
                      <Input style={styles.leftLabel} disabled defaultValue={RCi18n({ id: 'Order.subscriptionType' })} />
                      <Select
                        style={styles.newWrapper}
                        dropdownMatchSelectWidth={false}
                        allowClear
                        value={subscriptionType}
                        // disabled={orderType !== 'SUBSCRIPTION' && orderType !== 'MIXED_ORDER'}
                        getPopupContainer={(trigger: any) => trigger.parentNode}
                        onChange={(value: any) => {
                          this.setState({
                            subscriptionType: value
                          }, () => {
                            this.getSubsrciptionPlanType(value);
                          });
                        }}
                      >
                        {subscriptionTypeList &&
                          subscriptionTypeList.map((item, index) => (
                            <Option value={item.value} title={item.name} key={index}>
                              {item.name}
                            </Option>
                          ))}
                      </Select>
                    </InputGroup>
                  </FormItem>
                </Col>

                <Col span={8}>
                  <FormItem>
                    <InputGroup compact style={styles.formItemStyle}>
                      <Input style={styles.leftLabel} title={RCi18n({ id: 'Order.subscriptionPlanType' })} disabled defaultValue={RCi18n({ id: 'Order.subscriptionPlanType' })} />
                      <Select
                        style={styles.newWrapper}
                        allowClear
                        value={subscriptionPlanType}
                        // disabled={orderType !== 'SUBSCRIPTION' && orderType !== 'MIXED_ORDER'}
                        getPopupContainer={(trigger: any) => trigger.parentNode}
                        onChange={(value) => {
                          this.setState({
                            subscriptionPlanType: value
                          });
                        }}
                      >
                        {subscriptionPlanTypeList &&
                          subscriptionPlanTypeList.map((item, index) => (
                            <Option value={item.value} title={item.name} key={index}>
                              {item.name}
                            </Option>
                          ))}
                      </Select>
                    </InputGroup>
                  </FormItem>
                </Col>

                {/* 根据电话号码搜索 */}
                <Col span={8}>
                  <FormItem>
                    <Input
                      addonBefore={
                        <Select
                          style={styles.label}
                          defaultValue={searchForm.phoneNumber}
                          onChange={(value:any) => {
                            value = value === '' ? null : value;
                            this.onFormChange({
                              field: 'phoneNumber',
                              value
                            });
                          }}
                        >
                          {phoneNumber.map((item: any) => (
                            <Option value={item} key={item}>
                              <FormattedMessage id={`Subscription.${item}`} />
                            </Option>
                          ))}
                        </Select>
                      }
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'phone',
                          value
                        });
                      }}
                    />
                  </FormItem>
                </Col>

                <Col span={24} style={{ textAlign: 'center' }}>
                  <FormItem>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon="search"
                      shape="round"
                      onClick={(e) => {
                        e.preventDefault();
                        this.onSearch();
                      }}
                    >
                      <span className="portal_search_text">
                        <FormattedMessage id="Subscription.search" />
                      </span>
                    </Button>
                  </FormItem>
                </Col>
              </Row>

              {/* <FormItem>
                  <Input
                    addonBefore={
                      <Select
                        style={{ width: 140 }}
                        defaultValue={searchForm.recipientOption}
                        onChange={(value) => {
                          value = value === '' ? null : value;
                          this.onFormChange({
                            field: 'recipientOption',
                            value
                          });
                        }}
                      >
                        {recipientOption.map((item) => (
                          <Option value={item} key={item}>
                            {item}
                          </Option>
                        ))}
                      </Select>
                    }
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'recipient',
                        value
                      });
                    }}
                  />
                </FormItem> */}
            </Form>
            {/* <div className="handle-bar">
              <Dropdown
                overlay={menu}
                placement="bottomLeft"
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
              >
                <Button>
                  <FormattedMessage id="order.bulkOperations" />{' '}
                  <Icon type="down" />
                </Button>
              </Dropdown>
            </div> */}
          </div>
          <div className="container">
            <Spin spinning={this.state.loading}>
              <Tabs
                onChange={(key) => {
                  this.onTabChange(key);
                }}
                activeKey={activeKey}
              >
                <Tabs.TabPane tab={<FormattedMessage id="Subscription.all" />} key="all">
                  <List data={this.state.subscriptionList} pagination={this.state.pagination} searchParams={this.state.searchParams} />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<FormattedMessage id="Subscription.Active" />} key="0">
                  <List data={this.state.subscriptionList} pagination={this.state.pagination} searchParams={this.state.searchParams} />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<FormattedMessage id="Subscription.Inactive" />} key="2">
                  <List data={this.state.subscriptionList} pagination={this.state.pagination} searchParams={this.state.searchParams} />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<FormattedMessage id="Subscription.Pause" />} key="1">
                  <List data={this.state.subscriptionList} pagination={this.state.pagination} searchParams={this.state.searchParams} />
                </Tabs.TabPane>
              </Tabs>
            </Spin>
          </div>
        </div>
      
    );
  }
}


const styles = {
  label: {
    width: 170,
  },
  wrapper: {
    width: 157
  },
  formItemStyle: {
    width: 375
  },

  leftLabel: {
    width: 170,
    textAlign: 'left',
    color: 'rgba(0, 0, 0, 0.65)',
    backgroundColor: '#fff',
    cursor: 'default',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  newWrapper: {
    width: 185
  }
} as any;
