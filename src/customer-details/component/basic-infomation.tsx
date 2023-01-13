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
  AutoComplete,
  TreeSelect
} from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './../webapi';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { Const, RCi18n } from 'qmkit';
import _ from 'lodash';

const { TextArea } = Input;

const FormItem = Form.Item;
const Option = Select.Option;
const { TreeNode } = TreeSelect;

class BasicInfomation extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      basicForm: {
        firstName: '',
        lastName: '',
        birthDay: '',
        email: '',
        contactPhone: '',
        postalCode: '',
        city: '',
        state: '',
        countryId: '',
        address1: '',
        address2: '',
        preferredMethods: '',
        reference: '',
        selectedClinics: [],
        defaultClinicsId: '',
        defaultClinics: {
          clinicsId: 0,
          clinicsName: ''
        },
        selectedBind: []
      },
      countryArr: [],
      cityArr: [],
      currentBirthDay: '2020-01-01',
      clinicList: [],
      currentForm: {},
      loading: true,
      objectFetching: false,
      initCityName: '',
      initPreferChannel: [],
      storeId: '',
      stateList: [],
      taggingList: []
    };
  }
  componentDidMount() {
    let loginInfo = JSON.parse(sessionStorage.getItem('s2b-supplier@login'));
    let storeId = loginInfo ? loginInfo.storeId : '';
    this.setState({ storeId });
    if (storeId.toString() === '123457910') {
      this.getStateList();
    }
    this.getDict();
    this.getBasicDetails();
    this.getClinicList();
    this.getTaggingList();
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
        if (res.code === Const.SUCCESS_CODE) {
          // if (type === 'city') {
          //   this.setState({
          //     cityArr: res.context.sysDictionaryVOS
          //   });
          //   sessionStorage.setItem(
          //     'dict-city',
          //     JSON.stringify(res.context.sysDictionaryVOS)
          //   );
          // }
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
    webapi
      .getBasicDetails(this.props.customerId)
      .then((data) => {
        const { res } = data;
        if (res.code && res.code === Const.SUCCESS_CODE) {
          let resObj = res.context;
          let clinicsVOS = this.getSelectedClinic(resObj.clinicsVOS);
          let defaultClinicsId = null;
          if (resObj.defaultClinics && resObj.defaultClinics.clinicsId) {
            defaultClinicsId = resObj.defaultClinics.clinicsId;
          }
          let selectedBind = [];
          if (resObj.segmentList) {
            for (let i = 0; i < resObj.segmentList.length; i++) {
              const element = resObj.segmentList[i].id;
              selectedBind.push(element);
            }
          }

          let basicForm = {
            firstName: resObj.firstName,
            lastName: resObj.lastName,
            birthDay: resObj.birthDay
              ? resObj.birthDay
              : this.state.currentBirthDay,
            email: resObj.email,
            contactPhone: resObj.contactPhone,
            postalCode: resObj.postalCode,
            cityId: resObj.cityId,
            city: resObj.city,
            state: resObj.province,
            countryId: resObj.countryId,
            address1: resObj.address1,
            address2: resObj.address2,
            communicationPhone: resObj.communicationPhone,
            communicationEmail: resObj.communicationEmail,
            reference: resObj.reference,
            selectedClinics: resObj.clinicsVOS,
            defaultClinicsId: defaultClinicsId,
            defaultClinics: resObj.defaultClinics,
            preferredMethods: [],
            selectedBind: selectedBind
          };

          let initPreferChannel = [];
          if (+basicForm.communicationPhone) {
            initPreferChannel.push('Phone');
          }
          if (+basicForm.communicationEmail) {
            initPreferChannel.push('Email');
          }
          basicForm.preferredMethods = initPreferChannel;

          this.setState(
            {
              currentBirthDay: resObj.birthDay
                ? resObj.birthDay
                : this.state.currentBirthDay,
              basicForm: basicForm,
              currentForm: resObj,
              initPreferChannel: initPreferChannel
            },
            () => {
              this.props.form.setFieldsValue({
                selectedClinics: clinicsVOS,
                defaultClinicsId: defaultClinicsId
              });
              this.setState({
                loading: false
              });
            }
          );
        }
      })
      .catch((err) => {
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
    this.props.form.validateFields((err) => {
      if (!err) {
        this.saveBasicInfomation();
        this.bindTagging();
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
      city: basicForm.city ? basicForm.city : currentForm.city,
      clinicsVOS: basicForm.selectedClinics,
      province: basicForm.state,
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
        JSON.stringify(basicForm.preferredMethods).indexOf('Email') > -1 ? 1 : 0
    };

    webapi
      .basicDetailsUpdate(params)
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(RCi18n({ id: 'PetOwner.OperateSuccessfully' }));
        } else {
          message.error(RCi18n({ id: 'PetOwner.Unsuccessful' }));
        }
      })
      .catch((err) => {
        message.error(RCi18n({ id: 'PetOwner.Unsuccessful' }));
      });
  };

  getClinicList = () => {
    webapi
      .fetchClinicList({
        enabled: true,
        storeId: this.state.storeId
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
  //手机校验
  comparePhone = (rule, value, callback) => {
    const { form } = this.props;
    let reg = /^[0-9+-\s\(\)]{6,20}$/;
    if (!reg.test(form.getFieldValue('contactPhone'))) {
      callback(RCi18n({ id: 'PetOwner.theCorrectPhone' }));
    } else {
      callback();
    }
  };

  compareZip = (rule, value, callback) => {
    const { form } = this.props;
    let reg = /^[0-9]{3,10}$/;
    if (!reg.test(form.getFieldValue('postalCode'))) {
      callback(RCi18n({ id: 'PetOwner.theCorrectPostCode' }));
    } else {
      callback();
    }
  };

  compareEmail = (rule, value, callback) => {
    const { form } = this.props;
    let reg =
      /^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$/;
    if (!reg.test(form.getFieldValue('email'))) {
      callback(RCi18n({ id: 'PetOwner.theCorrectEmail' }));
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

  loopTagging = (taggingTotalTree) => {
    return (
      taggingTotalTree &&
      taggingTotalTree.map((item, index) => {
        return <TreeNode key={index} value={item.id} title={item.name} />;
      })
    );
  };
  getTaggingList = () => {
    let params = {
      pageNum: 0,
      pageSize: 1000,
      segmentType: 0,
      isPublished: 1
    };
    webapi
      .getTaggingList(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let taggingList = res.context.segmentList;
          this.setState({
            taggingList
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(RCi18n({ id: 'PetOwner.Unsuccessful' }));
      });
  };
  bindTagging = () => {
    const { basicForm, currentForm } = this.state;
    let params = {
      relationId: currentForm.customerId,
      segmentType: 0,
      segmentIdList: basicForm.selectedBind
    };
    webapi
      .bindTagging(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(RCi18n({ id: 'PetOwner.Unsuccessful' }));
      });
  };

  render() {
    const {
      countryArr,
      cityArr,
      clinicList,
      loading,
      initPreferChannel,
      storeId,
      stateList,
      basicForm,
      taggingList
    } = this.state;
    const options = [
      {
        label: 'Phone',
        value: 'Phone'
      },
      {
        label: 'Email',
        value: 'Email'
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
        <Spin spinning={loading}>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem label={RCi18n({ id: 'PetOwner.FirstName' })}>
                  {getFieldDecorator('firstName', {
                    rules: [
                      {
                        required: true,
                        message: RCi18n({ id: 'PetOwner.ThisFieldIsRequired' })
                      },
                      {
                        max: 50,
                        message: RCi18n({ id: 'PetOwner.ExceedMaximumLength' })
                      }
                    ],
                    initialValue: basicForm.firstName
                  })(
                    <Input
                      style={{ width: '100%' }}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'firstName',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={RCi18n({ id: 'PetOwner.LastName' })}>
                  {getFieldDecorator('lastName', {
                    rules: [
                      {
                        required: true,
                        message: RCi18n({ id: 'PetOwner.ThisFieldIsRequired' })
                      },
                      {
                        max: 50,
                        message: RCi18n({ id: 'PetOwner.ExceedMaximumLength' })
                      }
                    ],
                    initialValue: basicForm.lastName
                  })(
                    <Input
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'lastName',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={RCi18n({ id: 'PetOwner.BirthDate' })}>
                  {getFieldDecorator('birthDay', {
                    rules: [
                      {
                        required: true,
                        message: RCi18n({ id: 'PetOwner.ThisFieldIsRequired' })
                      }
                    ],
                    initialValue: moment(
                      new Date(this.state.currentBirthDay),
                      'YYYY-MM-DD'
                    )
                  })(
                    <DatePicker
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD"
                      getPopupContainer={(trigger: any) => trigger.parentNode}
                      disabledDate={(current) => {
                        return current && current > moment().endOf('day');
                      }}
                      onChange={(date, dateString) => {
                        const value = dateString;
                        this.onFormChange({
                          field: 'birthDay',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={RCi18n({ id: 'PetOwner.Email' })}>
                  {getFieldDecorator('email', {
                    rules: [
                      {
                        required: true,
                        message: RCi18n({ id: 'PetOwner.ThisFieldIsRequired' })
                      },
                      { validator: this.compareEmail },
                      {
                        max: 50,
                        message: RCi18n({ id: 'PetOwner.ExceedMaximumLength' })
                      }
                    ],
                    initialValue: basicForm.email
                  })(
                    <Input
                      disabled
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'email',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={RCi18n({ id: 'PetOwner.PhoneNumber' })}>
                  {getFieldDecorator('contactPhone', {
                    rules: [
                      {
                        required: true,
                        message: RCi18n({ id: 'PetOwner.ThisFieldIsRequired' })
                      },
                      { validator: this.comparePhone }
                    ],
                    initialValue: basicForm.contactPhone
                  })(
                    <Input
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'contactPhone',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem label={RCi18n({ id: 'PetOwner.Postal code' })}>
                  {getFieldDecorator('postalCode', {
                    rules: [
                      {
                        required: true,
                        message: RCi18n({ id: 'PetOwner.ThisFieldIsRequired' })
                      },
                      { validator: this.compareZip }
                    ],
                    initialValue: basicForm.postalCode
                  })(
                    <Input
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'postalCode',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem label={RCi18n({ id: 'PetOwner.Country' })}>
                  {getFieldDecorator('country', {
                    rules: [
                      {
                        required: true,
                        message: RCi18n({ id: 'PetOwner.ThisFieldIsRequired' })
                      }
                    ],
                    initialValue: basicForm.countryId
                  })(
                    <Select
                      optionFilterProp="children"
                      getPopupContainer={(trigger: any) => trigger.parentNode}
                      onChange={(value) => {
                        this.onFormChange({
                          field: 'countryId',
                          value: value ? value : ''
                        });
                      }}
                    >
                      {countryArr
                        ? countryArr.map((item, index) => (
                            <Option value={item.id} key={index}>
                              {item.name}
                            </Option>
                          ))
                        : null}
                    </Select>
                  )}
                </FormItem>
              </Col>

              {storeId.toString() === '123457910' ? (
                <Col span={12}>
                  <FormItem label={RCi18n({ id: 'PetOwner.State' })}>
                    {getFieldDecorator('state', {
                      rules: [
                        {
                          required: true,
                          message: RCi18n({
                            id: 'PetOwner.ThisFieldIsRequired'
                          })
                        }
                      ],
                      initialValue: basicForm.state
                    })(
                      <Select
                        showSearch
                        getPopupContainer={(trigger: any) => trigger.parentNode}
                        optionFilterProp="children"
                        onChange={(value) => {
                          this.onFormChange({
                            field: 'state',
                            value: value ? value : ''
                          });
                        }}
                      >
                        {stateList
                          ? stateList.map((item, index) => (
                              <Option value={item.stateName} key={index}>
                                {item.stateName}
                              </Option>
                            ))
                          : null}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              ) : null}

              <Col span={12}>
                <FormItem label={RCi18n({ id: 'PetOwner.City' })}>
                  {getFieldDecorator('city', {
                    rules: [
                      {
                        required: true,
                        message: RCi18n({ id: 'PetOwner.ThisFieldIsRequired' })
                      }
                    ],
                    initialValue: basicForm.city ? [basicForm.city] : []
                  })(
                    <AutoComplete
                      placeholder={RCi18n({ id: 'PetOwner.PleaseInputCity' })}
                      getPopupContainer={(trigger: any) => trigger.parentNode}
                      onSearch={_.debounce(this.getCityList, 500)}
                      onChange={(value) => {
                        this.onFormChange({
                          field: 'city',
                          value: value ? value : ''
                        });
                      }}
                    >
                      {cityArr &&
                        cityArr.map((item, index) => (
                          <Option value={item.cityName} key={index}>
                            {item.cityName}
                          </Option>
                        ))}
                    </AutoComplete>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label={RCi18n({ id: 'PetOwner.Address1' })}>
                  {getFieldDecorator('address1', {
                    rules: [
                      {
                        required: true,
                        message: RCi18n({ id: 'PetOwner.ThisFieldIsRequired' })
                      },
                      {
                        max: 200,
                        message: RCi18n({ id: 'PetOwner.ExceedMaximumLength' })
                      }
                    ],
                    initialValue: basicForm.address1
                  })(
                    <TextArea
                      autoSize={{ minRows: 3, maxRows: 3 }}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'address1',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={RCi18n({ id: 'PetOwner.Address2' })}>
                  {getFieldDecorator('address2', {
                    rules: [
                      {
                        max: 200,
                        message: RCi18n({ id: 'PetOwner.ExceedMaximumLength' })
                      }
                    ],
                    initialValue: basicForm.address2
                  })(
                    <TextArea
                      autoSize={{ minRows: 3, maxRows: 3 }}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'address2',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem label={RCi18n({ id: 'PetOwner.PreferChannel' })}>
                  {getFieldDecorator('preferredMethods', {
                    rules: [
                      {
                        required: true,
                        message: RCi18n({
                          id: 'PetOwner.SelectPreferredMethods'
                        })
                      }
                    ],
                    initialValue: initPreferChannel
                  })(
                    <Checkbox.Group
                      options={options}
                      onChange={(value) => {
                        this.onFormChange({
                          field: 'preferredMethods',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem label={RCi18n({ id: 'PetOwner.Reference' })}>
                  {getFieldDecorator('reference', {
                    rules: [
                      {
                        max: 200,
                        message: RCi18n({ id: 'PetOwner.ExceedMaximumLength' })
                      }
                    ],
                    initialValue: basicForm.reference
                  })(
                    <Input
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'reference',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label={RCi18n({ id: 'PetOwner.DefaultPrescriberName' })}
                >
                  {getFieldDecorator(
                    'defaultClinicsId',
                    {}
                  )(
                    <Select
                      showSearch
                      getPopupContainer={(trigger: any) => trigger.parentNode}
                      placeholder={RCi18n({
                        id: 'PetOwner.PleaseSelectPrescriber'
                      })}
                      style={{ width: '100%' }}
                      onChange={(value, Option) => {
                        let tempArr = Option.props.children.split(',');
                        let clinic = {
                          clinicsId: tempArr[0],
                          clinicsName: tempArr[1]
                        };

                        this.onFormChange({
                          field: 'defaultClinics',
                          value: clinic
                        });
                      }}
                    >
                      {clinicList
                        ? clinicList.map((item, index) => (
                            <Option
                              value={item.prescriberId.toString()}
                              key={index}
                            >
                              {item.prescriberId + ',' + item.prescriberName}
                            </Option>
                          ))
                        : null}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={RCi18n({ id: 'PetOwner.SelectedPrescriber' })}>
                  {getFieldDecorator(
                    'selectedClinics',
                    {}
                  )(
                    <Select
                      mode="multiple"
                      getPopupContainer={(trigger: any) => trigger.parentNode}
                      placeholder={RCi18n({
                        id: 'PetOwner.PleaseSelectPrescriber'
                      })}
                      style={{ width: '100%' }}
                      onChange={(value, Option) => {
                        let clinics = [];
                        for (let i = 0; i < Option.length; i++) {
                          let tempArr = Option[i].props.children.split(',');
                          let clinic = {
                            clinicsId: tempArr[0],
                            clinicsName: tempArr[1]
                          };
                          clinics.push(clinic);
                        }

                        this.onFormChange({
                          field: 'selectedClinics',
                          value: clinics
                        });
                      }}
                    >
                      {/* {
                      clinicList.map((item) => (
                        <Option value={item.clinicsId} key={item.clinicsId}>{item.clinicsName}</Option>
                      ))} */}
                      {clinicList
                        ? clinicList.map((item, index) => (
                            <Option
                              value={item.prescriberId.toString()}
                              key={index}
                            >
                              {item.prescriberId + ',' + item.prescriberName}
                            </Option>
                          ))
                        : null}
                    </Select>
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={RCi18n({ id: 'Menu.Pet owner tagging' })}
                >
                  {getFieldDecorator('selectedBind', {
                    rules: [
                      {
                        required: false,
                        message: 'Please select product tagging'
                      }
                    ],
                    initialValue: basicForm.selectedBind
                  })(
                    <TreeSelect
                      getPopupContainer={(trigger: any) => trigger.parentNode}
                      treeCheckable={true}
                      showCheckedStrategy={(TreeSelect as any).SHOW_ALL}
                      // treeCheckStrictly={true}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      showSearch={false}
                      onChange={(value) =>
                        this.onFormChange({
                          field: 'selectedBind',
                          value
                        })
                      }
                    >
                      {this.loopTagging(taggingList)}
                    </TreeSelect>
                  )}
                </FormItem>
              </Col>

              <Col span={24}>
                <FormItem>
                  {/* <Button type="primary" htmlType="submit" loading={loading}>
                    {RCi18n({ id: 'PetOwner.Save' })}
                  </Button> */}

                  <Button style={{ marginLeft: '20px' }}>
                    <Link to="/customer-list">
                      {RCi18n({ id: 'PetOwner.Cancel' })}
                    </Link>
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Spin>
      </div>
    );
  }
}
export default Form.create()(BasicInfomation);
