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
  labelCol: { span: 12 },
  wrapperCol: { span: 12 }
};

class DeliveryInfomation extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      customerAccount: '',
      clinicsVOS: [],
      deliveryForm: {
        firstName: '',
        lastName: '',
        consigneeNumber: '',
        postCode: '',
        cityId: '',
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
    const { deliveryForm, clinicsVOS } = this.state;
    let params = {
      address1: deliveryForm.address1,
      address2: deliveryForm.address2,
      cityId: deliveryForm.cityId,
      city: deliveryForm.city,
      province: deliveryForm.state,
      consigneeName: deliveryForm.firstName + ' ' + deliveryForm.lastName,
      consigneeNumber: deliveryForm.consigneeNumber,
      countryId: deliveryForm.countryId,
      customerId: deliveryForm.customerId,
      deliveryAddress: deliveryForm.address1 + deliveryForm.address2,
      deliveryAddressId: deliveryForm.deliveryAddressId,
      employeeId: deliveryForm.employeeId,
      firstName: deliveryForm.firstName,
      isDefaltAddress: this.state.isDefault ? 1 : 0,
      lastName: deliveryForm.lastName,
      postCode: deliveryForm.postCode,
      rfc: deliveryForm.rfc,
      type: deliveryForm.type,
      clinicsVOS: clinicsVOS
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
        clinics.push(array[index].clinicsId.toString());
      }
    }
    return clinics;
  };

  getAddressList = () => {
    webapi
      .getAddressListByType(this.props.customerId, 'DELIVERY')
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          let addressList = res.context.customerDeliveryAddressVOList;
          this.setState({
            loading: false
          });
          if (addressList && addressList.length > 0) {
            let deliveryForm = this.state.deliveryForm;
            if (this.state.currentId) {
              deliveryForm = addressList.find((item) => {
                return item.deliveryAddressId === this.state.currentId;
              });
            } else {
              deliveryForm = addressList[0];
            }

            let clinicsVOS = this.getSelectedClinic(res.context.clinicsVOS);

            this.setState(
              {
                customerAccount: res.context.customerAccount,
                currentId: deliveryForm.deliveryAddressId,
                clinicsVOS: res.context.clinicsVOS
                  ? res.context.clinicsVOS
                  : [],
                addressList: addressList,
                deliveryForm: deliveryForm,
                title: deliveryForm.consigneeName,
                isDefault: deliveryForm.isDefaltAddress === 1 ? true : false
                // loading: false
              },
              () => {
                this.props.form.setFieldsValue({
                  customerAccount: res.context.customerAccount,
                  clinicsVOS: clinicsVOS,
                  firstName: deliveryForm.firstName,
                  lastName: deliveryForm.lastName,
                  consigneeNumber: deliveryForm.consigneeNumber,
                  postCode: deliveryForm.postCode,
                  city: deliveryForm.city,
                  countryId: deliveryForm.countryId,
                  address1: deliveryForm.address1,
                  address2: deliveryForm.address2,
                  rfc: deliveryForm.rfc,
                  state: deliveryForm.province
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
    let data = this.state.deliveryForm;
    data[field] = value;
    this.setState({
      basicForm: data
    });
  };

  delAddress = () => {
    webapi
      .delAddress(this.state.deliveryForm.deliveryAddressId)
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
    let deliveryForm = addressList.find((item) => {
      return item.deliveryAddressId === id;
    });

    this.setState(
      {
        currentId: id,
        deliveryForm: deliveryForm,
        title: deliveryForm.consigneeName,
        isDefault: deliveryForm.isDefaltAddress === 1 ? true : false
      },
      () => {
        this.props.form.setFieldsValue({
          firstName: deliveryForm.firstName,
          lastName: deliveryForm.lastName,
          consigneeNumber: deliveryForm.consigneeNumber,
          postCode: deliveryForm.postCode,
          city: deliveryForm.city,
          countryId: deliveryForm.countryId,
          address1: deliveryForm.address1,
          address2: deliveryForm.address2,
          rfc: deliveryForm.rfc,
          state: deliveryForm.province
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
          message.error(RCi18n({ id: 'PetOwner.Unsuccessful' }));
        }
      })
      .catch((err) => {
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
    const {
      countryArr,
      cityArr,
      clinicList,
      storeId,
      stateList,
      deliveryForm
    } = this.state;
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
                      onClick={() => this.switchAddress(item.deliveryAddressId)}
                      style={{
                        cursor: 'pointer',
                        color:
                          item.deliveryAddressId === this.state.currentId
                            ? '#e2001a'
                            : ''
                      }}
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
              extra={
                <div
                  style={{
                    display:
                      this.props.customerType === 'Guest' ? 'none' : 'block'
                  }}
                >
                  <Checkbox
                    checked={this.state.isDefault}
                    onChange={() => this.clickDefault()}
                  >
                    <FormattedMessage id="PetOwner.SetDefaultDeliveryAddress" />
                  </Checkbox>
                </div>
              }
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
                      {deliveryForm.firstName}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label={RCi18n({ id: 'PetOwner.Last name' })}>
                      {deliveryForm.lastName}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label={RCi18n({ id: 'PetOwner.Phone number' })}>
                      {deliveryForm.consigneeNumber}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label={RCi18n({ id: 'PetOwner.Postal code' })}>
                      {deliveryForm.postCode}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label={RCi18n({ id: 'PetOwner.Country' })}>
                      {(countryArr.find(
                        (t) => t.id === deliveryForm.countryId
                      ) || {})['name'] || ''}
                    </FormItem>
                  </Col>
                  {storeId.toString() === '123457910' ? (
                    <Col span={12}>
                      <FormItem label={RCi18n({ id: 'PetOwner.State' })}>
                        {deliveryForm.province}
                      </FormItem>
                    </Col>
                  ) : null}

                  <Col span={12}>
                    <FormItem label={RCi18n({ id: 'PetOwner.City' })}>
                      {deliveryForm.city}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label={RCi18n({ id: 'PetOwner.Address1' })}>
                      {deliveryForm.address1}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label={RCi18n({ id: 'PetOwner.Address2' })}>
                      {deliveryForm.address2}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label={RCi18n({ id: 'PetOwner.Reference' })}>
                      {deliveryForm.rfc}
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
export default Form.create()(DeliveryInfomation);
