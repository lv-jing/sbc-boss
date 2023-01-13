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
  DatePicker,
  Empty,
  Spin,
  Checkbox,
  AutoComplete
} from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './../webapi';
import { Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { Const, Headline, history, cache, RCi18n } from 'qmkit';
import _, { divide } from 'lodash';
import {
  getCountryList,
  getStateList,
  getCityList,
  searchCity,
  getAddressFieldList
} from './webapi';
import { getAddressConfig, FORM_FIELD_MAP } from '../member-detail';
import { spawn } from 'child_process';

const { TextArea } = Input;

const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

const { Column } = Table;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

class BasicEdit extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      storeId:
        JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).storeId || '',
      editable: false,
      customer: {},
      fieldList: [],
      countryList: [],
      stateList: [],
      cityList: [],
      cityType: 1, //1: free text + search box, 2: drop down
      stateEnable: false,
      dropDownCityList: [],
      currentBirthDay: '2020-01-01',
      clinicList: [],
      currentForm: {},
      loading: false,
      objectFetching: false,
      initCityName: '',
      initPreferChannel: []
    };
    this.searchCity = _.debounce(this.searchCity, 500);
  }
  componentDidMount() {
    this.getBasicDetails();
    this.getAddressCon();
    // this.getDict();
    // this.getClinicList();
  }

  getAddressCon = async () => {
    const fields = await getAddressConfig(this.props.customerId);
    const countries = await getCountryList();
    this.setState({
      fieldList: fields,
      countryList: countries
    });
  };

  getDict = async () => {
    const addressTypeList = await getAddressFieldList();
    const countryList = await getCountryList();
    const stateList = await getStateList();
    let cityType = 2;
    let stateEnable = false;
    let cityList = [];
    if (
      addressTypeList.length > 0 &&
      addressTypeList.findIndex((fd) => fd.fieldName === 'City') > -1
    ) {
      cityType =
        addressTypeList.find((fd) => fd.fieldName === 'City')
          .inputDropDownBoxFlag === 1
          ? 2
          : 1;
    }
    if (
      addressTypeList.length > 0 &&
      addressTypeList.findIndex((fd) => fd.fieldName === 'State') > -1
    ) {
      stateEnable =
        addressTypeList.find((fd) => fd.fieldName === 'State').enableFlag === 1;
    }
    if (cityType === 2) {
      cityList = await getCityList();
    }
    this.setState({
      countryList: countryList,
      stateList: stateList,
      cityType: cityType,
      dropDownCityList: cityList,
      stateEnable: stateEnable
    });
  };

  searchCity = (txt: string) => {
    searchCity(txt).then((data) => {
      this.setState({
        cityList: data.res.context.systemCityVO
      });
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
  getBasicDetails = () => {
    this.setState({ loading: true });
    webapi
      .getBasicDetails(this.props.customerId)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            loading: false,
            customer: {
              ...res.context,
              customerAccount: this.props.customerAccount
            }
          });
        }
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  };

  onFormChange = ({ field, value }) => {
    let data = this.state.basicForm;
    data[field] = value;
    this.setState({
      basicForm: data
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const { customer } = this.state;
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        //this.saveBasicInfomation();
        this.setState({ loading: true });
        const params = {
          ...fieldsValue,
          birthDay: fieldsValue.birthDay.format('YYYY-MM-DD'),
          customerDetailId: customer.customerDetailId,
          communicationEmail:
            fieldsValue['preferredMethods'].indexOf('communicationEmail') > -1
              ? 1
              : 0,
          communicationPhone:
            fieldsValue['preferredMethods'].indexOf('communicationPhone') > -1
              ? 1
              : 0,
          communicationPrint:
            fieldsValue['preferredMethods'].indexOf('communicationPrint') > -1
              ? 1
              : 0,
          preferredMethods: undefined,
          createTime: undefined
        };
        webapi
          .basicDetailsUpdate(params)
          .then((data) => {
            const res = data.res;
            if (res.code === Const.SUCCESS_CODE) {
              message.success(RCi18n({ id: 'PetOwner.OperateSuccessfully' }));
              history.go(-1);
            }
          })
          .catch(() => {
            this.setState({ loading: false });
          });
      }
    });
  };

  saveBasicInfomation = () => {
    const { basicForm, currentForm } = this.state;
    let params = {
      birthDay: basicForm.birthDay
        ? basicForm.birthDay
        : this.state.currentBirthDay,
      cityId: basicForm.cityId ? basicForm.cityId : currentForm.cityId,
      clinicsVOS: basicForm.selectedClinics,
      // contactMethod: basicForm.preferredMethods,
      contactPhone: basicForm.contactPhone,
      countryId: basicForm.countryId
        ? basicForm.countryId
        : currentForm.countryId,
      customerDetailId: currentForm.customerDetailId,
      defaultClinics: basicForm.defaultClinics,
      email: basicForm.email,
      firstName: basicForm.firstName,
      address1: basicForm.address1,
      address2: basicForm.address2,
      lastName: basicForm.lastName,
      postalCode: basicForm.postalCode,
      reference: basicForm.reference,
      communicationPhone:
        JSON.stringify(basicForm.preferredMethods).indexOf('Phone') > -1
          ? 1
          : 0,
      communicationEmail:
        JSON.stringify(basicForm.preferredMethods).indexOf('Email') > -1
          ? 1
          : 0,
      communicationPrint:
        JSON.stringify(basicForm.preferredMethods).indexOf('Print') > -1 ? 1 : 0
    };

    webapi.basicDetailsUpdate(params).then((data) => {
      const res = data.res;
      if (res.code === Const.SUCCESS_CODE) {
        message.success(RCi18n({ id: 'PetOwner.OperateSuccessfully' }));
      }
    });
  };

  getClinicList = () => {
    webapi
      .fetchClinicList({
        enabled: true,
        storeId: 123456858
      })
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            loading: false,
            clinicList: res.context
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
  //手机校验
  comparePhone = (rule, value, callback) => {
    const { form } = this.props;
    let reg = /^[0-9+-\s\(\)]{6,20}$/;
    if (!reg.test(form.getFieldValue('contactPhone'))) {
      callback('Please enter the correct phone');
    } else {
      callback();
    }
  };

  compareZip = (rule, value, callback) => {
    const { form } = this.props;
    let reg = /^[0-9]{3,10}$/;
    if (!reg.test(form.getFieldValue('postalCode'))) {
      callback('Please enter the correct Postal Code');
    } else {
      callback();
    }
  };

  compareEmail = (rule, value, callback) => {
    const { form } = this.props;
    let reg =
      /^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$/;
    if (!reg.test(form.getFieldValue('email'))) {
      callback('Please enter the correct email');
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
    webapi.queryCityListByName(params).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        this.setState({
          cityArr: res.context.systemCityVO,
          objectFetching: false
        });
      }
    });
  };
  getCityNameById = (id) => {
    let params = {
      id: [id]
    };
    webapi.queryCityById(params).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        if (
          res.context &&
          res.context.systemCityVO &&
          res.context.systemCityVO[0] &&
          res.context.systemCityVO[0].cityName
        ) {
          this.setState({
            initCityName: res.context.systemCityVO[0].cityName
          });
        }
      }
    });
  };

  render() {
    const {
      customer,
      countryList,
      stateList,
      cityList,
      editable,
      clinicList,
      objectFetching,
      initCityName,
      initPreferChannel
    } = this.state;
    const options = [
      {
        label: 'Phone',
        value: 'communicationPhone'
      },
      {
        label: 'Email',
        value: 'communicationEmail'
      },
      {
        label: 'Message',
        value: 'communicationPrint'
      }
    ];
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
      <div>
        <Spin spinning={this.state.loading}>
          <div className="container petowner-noedit-form">
            <Headline title={RCi18n({ id: 'PetOwner.BasicInformation' })} />
            <Form {...formItemLayout}>
              <Row gutter={16}>
                <Col span={12}>
                  <FormItem label={RCi18n({ id: 'PetOwner.ConsumerAccount' })}>
                    {editable ? (
                      getFieldDecorator('customerAccount', {
                        initialValue: customer.customerAccount
                      })(<Input disabled={true} />)
                    ) : (
                      <span>{customer.customerAccount}</span>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label={RCi18n({ id: 'PetOwner.RegistrationDate' })}>
                    {editable ? (
                      getFieldDecorator('createTime', {
                        initialValue: moment(customer.createTime, 'YYYY-MM-DD')
                      })(
                        <DatePicker
                          style={{ width: '100%' }}
                          format="YYYY-MM-DD"
                          disabled={true}
                        />
                      )
                    ) : (
                      <span>
                        {customer.createTime
                          ? moment(customer.createTime, 'YYYY-MM-DD').format(
                              'YYYY-MM-DD'
                            )
                          : ''}
                      </span>
                    )}
                  </FormItem>
                </Col>
                {this.state.fieldList.map((field, idx) => (
                  <Col key={idx} span={12}>
                    <FormItem
                      label={RCi18n({ id: `PetOwner.${field.fieldName}` })}
                    >
                      <span>
                        {field.fieldName === 'Country'
                          ? customer.countryId
                            ? this.state.countryList.find(
                                (c) => c.id === customer.countryId
                              )?.name
                            : customer.country
                          : customer[FORM_FIELD_MAP[field.fieldName]]}
                      </span>
                    </FormItem>
                  </Col>
                ))}
                <Col span={12}>
                  <FormItem label={RCi18n({ id: 'PetOwner.BirthDate' })}>
                    {editable ? (
                      getFieldDecorator('birthDay', {
                        rules: [
                          {
                            required: true,
                            message: 'Please input Birth Date!'
                          }
                        ],
                        initialValue: customer.birthDay
                          ? moment(customer.birthDay, 'YYYY-MM-DD')
                          : null
                      })(
                        <DatePicker
                          style={{ width: '100%' }}
                          format="YYYY-MM-DD"
                          disabledDate={(current) => {
                            return current && current > moment().endOf('day');
                          }}
                        />
                      )
                    ) : (
                      <span>
                        {customer.birthDay
                          ? moment(customer.birthDay, 'YYYY-MM-DD').format(
                              'YYYY-MM-DD'
                            )
                          : ''}
                      </span>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label={RCi18n({ id: 'PetOwner.Email' })}>
                    {editable ? (
                      getFieldDecorator('email', {
                        initialValue: customer.email,
                        rules: [
                          { required: true, message: 'Please input Email!' },
                          { validator: this.compareEmail },
                          { max: 50, message: 'Exceed maximum length!' }
                        ]
                      })(<Input disabled />)
                    ) : (
                      <span>{customer.email}</span>
                    )}
                  </FormItem>
                </Col>

                <Col span={12}>
                  <FormItem label={RCi18n({ id: 'PetOwner.PreferChannel' })}>
                    {editable ? (
                      getFieldDecorator('preferredMethods', {
                        rules: [
                          {
                            required: true,
                            message:
                              'Please Select Preferred methods of communication!'
                          }
                        ],
                        initialValue: [
                          'communicationPhone',
                          'communicationEmail',
                          'communicationPrint'
                        ].reduce((prev, curr) => {
                          if (+customer[curr]) {
                            prev.push(curr);
                          }
                          return prev;
                        }, [])
                      })(<Checkbox.Group options={options} />)
                    ) : (
                      <span>
                        {['Email', 'Phone', 'Print']
                          .reduce((prev, curr) => {
                            if (+customer[`communication${curr}`]) {
                              prev.push(
                                curr === 'Print'
                                  ? RCi18n({ id: 'PetOwner.Message' })
                                  : RCi18n({ id: `PetOwner.${curr}` })
                              );
                            }
                            return prev;
                          }, [])
                          .join(' ')}
                      </span>
                    )}
                  </FormItem>
                </Col>

                <Col span={24}>
                  <FormItem
                    label={RCi18n({ id: 'PetOwner.Consent' })}
                    labelCol={{ sm: { span: 4 } }}
                    wrapperCol={{ sm: { span: 18 } }}
                  >
                    {customer.userConsentList &&
                    customer.userConsentList.length > 0
                      ? customer.userConsentList.map((consent, idx) => (
                          <div
                            key={idx}
                            dangerouslySetInnerHTML={{
                              __html: consent.consentTitle
                            }}
                          ></div>
                        ))
                      : null}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
          <div className="bar-button">
            {editable && (
              <Button
                type="primary"
                onClick={this.handleSubmit}
                style={{ marginRight: '20px' }}
              >
                <FormattedMessage id="PetOwner.Save" />
              </Button>
            )}

            <Button
              onClick={() => {
                history.go(-1);
              }}
            >
              <FormattedMessage id="PetOwner.Cancel" />
            </Button>
          </div>
        </Spin>
      </div>
    );
  }
}
export default Form.create<any>()(BasicEdit);
