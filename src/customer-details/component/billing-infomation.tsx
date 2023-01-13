import React from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  message,
  Table,
  Row,
  Col,
  Radio,
  Menu,
  Card,
  Checkbox,
  Empty,
  Spin,
  Popconfirm,
  AutoComplete
} from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './../webapi';
import { Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';
import { addressList } from '@/order-add-old/webapi';
import { Const, RCi18n } from 'qmkit';
import _ from 'lodash';

import '../index.less';

const { TextArea } = Input;

const { SubMenu } = Menu;
const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

const { Column } = Table;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

class BillingInfomation extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      customerAccount: '',
      clinicsVOS: [],

      billingForm: {
        firstName: '',
        lastName: '',
        consigneeNumber: '',
        postCode: '',
        city: '',
        state: '',
        countryId: '',
        address1: '',
        address2: '',
        rfc: '',
        deliveryAddressId: ''
      },
      title: '',
      countryArr: [],
      cityArr: [],
      // customerId:this.props.match.params.id ? this.props.match.params.id : '',
      addressList: [],
      isDefault: false,
      clinicList: [],
      currentId: '',
      loading: true,
      objectFetching: false,
      initCityName: '',
      storeId: '',
      stateList: ''
    };
  }
  componentDidMount() {
    // let loginInfo = JSON.parse(sessionStorage.getItem('s2b-supplier@login'));
    // let storeId = loginInfo ? loginInfo.storeId : '';
    // if (storeId.toString() === '123457910') {
    //   this.setState({ storeId });
    //   this.getStateList();
    // }

    this.getDict();
    this.getAddressList();
    // this.getClinicList();
  }

  getDict = () => {
    if (JSON.parse(sessionStorage.getItem('dict-country'))) {
      let countryArr = JSON.parse(sessionStorage.getItem('dict-country'));
      this.setState({
        countryArr: countryArr
      });
    } else {
      this.querySysDictionary('country');
    }
  };
  querySysDictionary = (type: String) => {
    webapi
      .querySysDictionary({
        type: type
      })
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          if (type === 'country') {
            this.setState({
              countryArr: res.context.sysDictionaryVOS
            });
            sessionStorage.setItem(
              'dict-country',
              JSON.stringify(res.context.sysDictionaryVOS)
            );
          }
        } else {
          message.error(RCi18n({ id: 'PetOwner.Unsuccessful' }));
        }
      })
      .catch((err) => {
        message.error(RCi18n({ id: 'PetOwner.Unsuccessful' }));
      });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        this.saveDeliveryAddress();
      }
    });
  };

  saveDeliveryAddress = () => {
    const { billingForm } = this.state;
    let params = {
      address1: billingForm.address1,
      address2: billingForm.address2,
      cityId: billingForm.cityId,
      city: billingForm.city,
      province: billingForm.state,
      consigneeName: billingForm.firstName + ' ' + billingForm.lastName,
      consigneeNumber: billingForm.consigneeNumber,
      countryId: billingForm.countryId,
      customerId: billingForm.customerId,
      deliveryAddress: billingForm.address1 + billingForm.address2,
      deliveryAddressId: billingForm.deliveryAddressId,
      employeeId: billingForm.employeeId,
      firstName: billingForm.firstName,
      isDefaltAddress: this.state.isDefault ? 1 : 0,
      lastName: billingForm.lastName,
      postCode: billingForm.postCode,
      rfc: billingForm.rfc,
      type: billingForm.type
    };
    webapi
      .updateAddress(params)
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          this.getAddressList();
          message.success(RCi18n({ id: 'PetOwner.OperateSuccessfully' }));
        } else {
          message.error(RCi18n({ id: 'PetOwner.Unsuccessful' }));
        }
      })
      .catch((err) => {
        message.error(RCi18n({ id: 'PetOwner.Unsuccessful' }));
      });
  };

  getSelectedClinic = (array) => {
    let clinics = [];
    if (array && array.length > 0) {
      for (let index = 0; index < array.length; index++) {
        clinics.push(array[index].clinicsId);
      }
    }
    return clinics;
  };

  getAddressList = () => {
    webapi
      .getAddressListByType(this.props.customerId, 'BILLING')
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          this.setState({
            loading: false
          });
          let addressList = res.context.customerDeliveryAddressVOList;
          if (addressList && addressList.length > 0) {
            let billingForm = this.state.billingForm;
            if (this.state.currentId) {
              billingForm = addressList.find((item) => {
                return item.deliveryAddressId === this.state.currentId;
              });
            } else {
              billingForm = addressList[0];
            }

            let clinicsVOS = this.getSelectedClinic(res.context.clinicsVOS);

            this.setState(
              {
                customerAccount: res.context.customerAccount,
                currentId: billingForm.deliveryAddressId,
                clinicsVOS: res.context.clinicsVOS
                  ? res.context.clinicsVOS
                  : [],
                addressList: addressList,
                billingForm: billingForm,
                title: billingForm.consigneeName,
                isDefault: billingForm.isDefaltAddress === 1 ? true : false
                // loading: false
              },
              () => {
                this.props.form.setFieldsValue({
                  customerAccount: res.context.customerAccount,
                  clinicsVOS: clinicsVOS,
                  firstName: billingForm.firstName,
                  lastName: billingForm.lastName,
                  consigneeNumber: billingForm.consigneeNumber,
                  postCode: billingForm.postCode,
                  city: billingForm.city,
                  countryId: billingForm.countryId,
                  address1: billingForm.address1,
                  address2: billingForm.address2,
                  rfc: billingForm.rfc,
                  state: billingForm.province
                });
              }
            );
          } else {
            this.setState({
              loading: false
            });
          }
        } else {
          this.setState({
            loading: false
          });
          message.error(RCi18n({ id: 'PetOwner.Unsuccessful' }));
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(RCi18n({ id: 'PetOwner.Unsuccessful' }));
      });
  };

  onFormChange = ({ field, value }) => {
    let data = this.state.billingForm;
    data[field] = value;
    this.setState({
      basicForm: data
    });
  };

  delAddress = () => {
    webapi
      .delAddress(this.state.billingForm.deliveryAddressId)
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          message.success(RCi18n({ id: 'PetOwner.OperateSuccessfully' }));
          this.getAddressList();
        } else {
          message.error(RCi18n({ id: 'PetOwner.Unsuccessful' }));
        }
      })
      .catch((err) => {
        message.error(RCi18n({ id: 'PetOwner.Unsuccessful' }));
      });
  };
  clickDefault = () => {
    let isDefault = !this.state.isDefault;
    this.setState({
      isDefault: isDefault
    });
  };
  getClinicList = () => {
    webapi
      .fetchClinicList({
        pageNum: 0,
        pageSize: 1000
      })
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          this.setState({
            loading: false,
            clinicList: res.context.content
          });
        } else {
          this.setState({
            loading: false
          });
          message.error(RCi18n({ id: 'PetOwner.Unsuccessful' }));
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(RCi18n({ id: 'PetOwner.Unsuccessful' }));
      });
  };

  onClinicChange = (clinics) => {
    this.setState({
      clinicsVOS: clinics
    });
  };

  switchAddress = (id) => {
    const { addressList } = this.state;
    let billingForm = addressList.find((item) => {
      return item.deliveryAddressId === id;
    });

    this.setState(
      {
        currentId: id,
        billingForm: billingForm,
        title: billingForm.consigneeName,
        isDefault: billingForm.isDefaltAddress === 1 ? true : false
      },
      () => {
        this.props.form.setFieldsValue({
          firstName: billingForm.firstName,
          lastName: billingForm.lastName,
          consigneeNumber: billingForm.consigneeNumber,
          postCode: billingForm.postCode,
          countryId: billingForm.countryId,
          city: billingForm.city,
          address1: billingForm.address1,
          address2: billingForm.address2,
          rfc: billingForm.rfc,
          state: billingForm.province
        });
      }
    );
  };

  //手机校验
  comparePhone = (rule, value, callback) => {
    let reg = /^[0-9+-\s\(\)]{6,20}$/;
    if (!reg.test(value)) {
      callback(RCi18n({ id: 'PetOwner.theCorrectPhone' }));
    } else {
      callback();
    }
  };

  compareZip = (rule, value, callback) => {
    let reg = /^[0-9]{3,10}$/;
    if (!reg.test(value)) {
      callback(RCi18n({ id: 'PetOwner.theCorrectPostCode' }));
    } else {
      callback();
    }
  };
  getCityList = (value) => {
    let params = {
      cityName: value,
      pageSize: 30,
      pageNum: 0
    };
    webapi
      .queryCityListByName(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            cityArr: res.context.systemCityVO,
            objectFetching: false
          });
        } else {
          this.setState({
            loading: false
          });
          message.error(RCi18n({ id: 'PetOwner.Unsuccessful' }));
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(RCi18n({ id: 'PetOwner.Unsuccessful' }));
      });
  };

  getStateList = () => {
    webapi.queryStateList().then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        let stateList = res.context.systemStates;
        this.setState({
          stateList
        });
      }
    });
  };

  render() {
    const { countryArr, cityArr, clinicList, storeId, stateList, billingForm } =
      this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Spin spinning={this.state.loading}>
        <Row>
          <Col span={3}>
            <h3>
              <FormattedMessage id="PetOwner.AllAddress" />({' '}
              {this.state.addressList.length} )
            </h3>
            <ul>
              {this.state.addressList
                ? this.state.addressList.map((item) => (
                    <li
                      key={item.deliveryAddressId}
                      style={{
                        cursor: 'pointer',
                        color:
                          item.deliveryAddressId === this.state.currentId
                            ? '#e2001a'
                            : ''
                      }}
                      onClick={() => this.switchAddress(item.deliveryAddressId)}
                    >
                      {item.consigneeName}
                    </li>
                  ))
                : null}
            </ul>
          </Col>
          <Col span={20}>
            {this.state.addressList.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : null}
            <Card
              title={this.state.title}
              style={{
                display: this.state.addressList.length === 0 ? 'none' : 'block'
              }}
            >
              <Form
                {...formItemLayout}
                onSubmit={this.handleSubmit}
                className="petowner-noedit-form"
              >
                <Row gutter={16}>
                  <Col
                    span={12}
                    style={{
                      display:
                        this.props.customerType !== 'Guest' ? 'none' : 'block'
                    }}
                  >
                    <FormItem
                      label={RCi18n({ id: 'PetOwner.ConsumerAccount' })}
                    >
                      {this.state.customerAccount}
                    </FormItem>
                  </Col>
                  {/* <Col
                    span={12}
                    style={{
                      display: this.props.customerType !== 'Guest' ? 'none' : 'block'
                    }}
                  >
                    <FormItem label="Selected Prescriber">
                      {getFieldDecorator('clinicsVOS', {
                        rules: [
                          {
                            required: true,
                            message: 'Please Select Prescriber!'
                          }
                        ]
                      })(
                        <Select
                          mode="tags"
                          disabled={this.props.customerType === 'Guest'}
                          placeholder="Please select"
                          style={{ width: '100%' }}
                          onChange={(value, Option) => {
                            let clinics = [];
                            for (let i = 0; i < Option.length; i++) {
                              let clinic = {
                                clinicsId: Option[i].props.value,
                                clinicsName: Option[i].props.children
                              };
                              clinics.push(clinic);
                            }

                            this.onClinicChange(clinics);
                          }}
                        >
       
                          {clinicList
                            ? clinicList.map((item) => (
                              <Option value={item.prescriberId.toString()} key={item.prescriberId}>
                                {item.prescriberId + ',' + item.prescriberName}
                              </Option>
                            ))
                            : null}
                        </Select>
                      )}
                    </FormItem>
                  </Col> */}
                  <Col span={12}>
                    <FormItem label={RCi18n({ id: 'PetOwner.First name' })}>
                      {billingForm.firstName}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label={RCi18n({ id: 'PetOwner.Last name' })}>
                      {billingForm.lastName}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label={RCi18n({ id: 'PetOwner.Phone number' })}>
                      {billingForm.consigneeNumber}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label={RCi18n({ id: 'PetOwner.Postal code' })}>
                      {billingForm.postCode}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label={RCi18n({ id: 'PetOwner.Country' })}>
                      {(countryArr.find(
                        (t) => t.id === billingForm.countryId
                      ) || {})['name'] || ''}
                    </FormItem>
                  </Col>
                  {storeId.toString() === '123457910' ? (
                    <Col span={12}>
                      <FormItem label={RCi18n({ id: 'PetOwner.State' })}>
                        {billingForm.province}
                      </FormItem>
                    </Col>
                  ) : null}

                  <Col span={12}>
                    <FormItem label={RCi18n({ id: 'PetOwner.City' })}>
                      {billingForm.city}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label={RCi18n({ id: 'PetOwner.Address1' })}>
                      {billingForm.address1}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label={RCi18n({ id: 'PetOwner.Address2' })}>
                      {billingForm.address2}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label={RCi18n({ id: 'PetOwner.Reference' })}>
                      {billingForm.rfc}
                    </FormItem>
                  </Col>

                  <Col span={24}>
                    <FormItem>
                      {/* <Button
                        type="primary"
                        htmlType="submit"
                        style={{
                          marginRight: '20px',
                          display: this.props.customerType === 'Guest' ? 'none' : null
                        }}
                      >
                        Save
                      </Button> */}

                      {/* <Button
                        style={{
                          marginRight: '20px',
                          display:
                            this.props.customerType === 'Guest' ? 'none' : null
                        }}
                        onClick={() => this.delAddress()}
                      >
                        Delete
                      </Button> */}

                      {/* <Popconfirm placement="topRight" title="Are you sure to delete this item?" onConfirm={() => this.delAddress()} okText="Confirm" cancelText="Cancel">
                        <Button
                          style={{
                            marginRight: '20px',
                            display: this.props.customerType === 'Guest' ? 'none' : null
                          }}
                        >
                          <FormattedMessage id="delete" />
                        </Button>
                      </Popconfirm> */}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </Spin>
    );
  }
}
export default Form.create()(BillingInfomation);
