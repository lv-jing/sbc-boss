import React from 'react';
import {
  Form,
  Input,
  Select,
  Spin,
  Row,
  Col,
  Button,
  message,
  AutoComplete,
  Modal,
  Alert,
  Radio
} from 'antd';
import { FormattedMessage } from 'react-intl';
import { FormComponentProps } from 'antd/lib/form';
import { Headline, cache, Const, RCi18n } from 'qmkit';
import {
  getAddressInputTypeSetting,
  getAddressFieldList,
  getCountryList,
  getStateList,
  getCityList,
  searchCity,
  getIsAddressValidation,
  validateAddress,
  getRegionListByCityId,
  getAddressListByDadata,
  validateAddressScope
} from './webapi';
import { updateAddress, addAddress } from '../webapi';
import _ from 'lodash';

const { Option } = Select;

type TDelivery = {
  deliveryAddressId?: string;
  firstName?: string;
  lastName?: string;
  consigneeNumber?: string;
  postCode?: string;
  countryId?: number;
  province?: string;
  city?: string;
  address1?: string;
  address2?: string;
  rfc?: string;
  isDefaltAddress?: number;
};

interface Iprop extends FormComponentProps {
  delivery: TDelivery;
  customerId: string;
  addressType: string;
  backToDetail?: Function;
}

export const FORM_FIELD_MAP = {
  'First name': 'firstName',
  'Last name': 'lastName',
  Country: 'countryId',
  Region: 'area',
  State: 'province',
  City: 'city',
  Address1: 'address1',
  Address2: 'address2',
  'Phone number': 'consigneeNumber',
  'Postal code': 'postCode',
  Entrance: 'entrance',
  Apartment: 'apartment',
  Comment: 'rfc'
};

class DeliveryItem extends React.Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      storeId:
        JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).storeId || '',
      loading: false,
      formFieldList: [],
      countryList: [],
      stateList: [],
      cityList: [],
      searchCityList: [],
      regionList: [],
      addressInputType: '',
      isAddressValidation: false,
      validationModalVisisble: false,
      validationSuccess: false,
      checkedAddress: 0,
      fields: {},
      suggestionAddress: {},
      searchAddressList: [],
      dadataAddress: {} //用来验证俄罗斯地址是不是在配送范围
    };
    this.searchCity = _.debounce(this.searchCity, 500);
    this.searchAddress = _.debounce(this.searchAddress, 200);
  }

  componentDidMount() {
    this.getDics();
  }

  getDics = async () => {
    this.setState({ loading: true });
    const addressInputType = await getAddressInputTypeSetting('request from delivery-item');
    let fields = [];
    let states = [];
    let cities = [];
    let regions = [];
    let isAddressValidation = false;
    if (addressInputType) {
      fields = await getAddressFieldList(addressInputType);
    }
    const countries = await getCountryList();
    if (
      fields.find(
        (ad) => ad.fieldName === 'City' && ad.inputDropDownBoxFlag === 1
      )
    ) {
      cities = await getCityList();
      if (
        fields.find(
          (ad) => ad.fieldName === 'Region' && ad.inputDropDownBoxFlag === 1
        ) &&
        this.props.delivery.city
      ) {
        const regionRes = await getRegionListByCityId(
          (cities.find((ci) => ci.cityName === this.props.delivery.city) || {})[
            'id'
          ] || 0
        );
        if (regionRes.res.code === Const.SUCCESS_CODE) {
          regions = regionRes.res.context.systemRegions.map((r) => ({
            id: r.id,
            name: r.regionName
          }));
        }
      }
    }
    if (
      fields.find(
        (ad) => ad.fieldName === 'State' && ad.inputDropDownBoxFlag === 1
      )
    ) {
      states = await getStateList();
    }
    //MANUALLY类型的地址才去获取是否进行验证的配置
    if (addressInputType === 'MANUALLY') {
      isAddressValidation = await getIsAddressValidation();
    }
    this.setState({
      loading: false,
      addressInputType: addressInputType,
      formFieldList: fields,
      countryList: countries,
      stateList: states.map((t) => ({ id: t.id, name: t.stateName })),
      cityList: cities,
      regionList: regions,
      isAddressValidation: isAddressValidation
    });
  };

  validateAddress = () => {
    if (this.state.isAddressValidation) {
      this.props.form.validateFields((err, fields) => {
        if (!err) {
          this.setState({ loading: true });
          validateAddress({
            ...fields,
            deliveryAddress: [fields.address1, fields.address2].join('')
          })
            .then((data) => {
              if (data.res.code === Const.SUCCESS_CODE) {
                this.setState({
                  loading: false,
                  validationModalVisisble: true,
                  fields: fields,
                  checkedAddress: 1,
                  suggestionAddress: data.res.context.suggestionAddress,
                  validationSuccess: data.res.context.validationResult
                });
              } else {
                this.setState({
                  loading: false
                });
              }
            })
            .catch(() => {
              this.setState({
                loading: false
              });
            });
        }
      });
    } else {
      this.saveAddress();
    }
  };

  onChangeCheckedAddress = (checkedAddress: number) => {
    this.setState({
      checkedAddress: checkedAddress
    });
  };

  onCancelSuggestionModal = () => {
    this.setState({
      checkedAddress: 0,
      validationModalVisisble: false
    });
  };

  getRegionListByCity = (type: number, city: any) => {
    let cityId = 0;
    if (type === 1) {
      cityId =
        (this.state.cityList.find((ci) => ci.cityName === city) || {})['id'] ||
        0;
    } else {
      cityId =
        (this.state.searchCityList.find((ci) => ci.cityName === city) || {})[
          'id'
        ] || 0;
    }
    getRegionListByCityId(cityId).then((data) => {
      if (data.res.code === Const.SUCCESS_CODE) {
        this.setState({
          regionList: data.res.context.systemRegions.map((r) => ({
            id: r.id,
            name: r.regionName
          }))
        });
      }
    });
    if (this.props.form.getFieldValue('region')) {
      this.props.form.setFieldsValue({ region: '' });
    }
  };

  backToCustomerDetail = () => {
    const {
      backToDetail,
      form: { resetFields }
    } = this.props;
    resetFields();
    backToDetail();
  };

  saveAddress = async () => {
    const { delivery } = this.props;
    const {
      checkedAddress,
      suggestionAddress,
      dadataAddress,
      addressInputType
    } = this.state;
    const sugAddr =
      checkedAddress === 1
        ? {
            province: suggestionAddress.provinceCode,
            city: suggestionAddress.city,
            address1: suggestionAddress.address1,
            address2: suggestionAddress.address2,
            postCode: suggestionAddress.postalCode
          }
        : {};
    this.props.form.validateFields(async (err, fields) => {
      if (!err) {
        this.setState({ loading: true });
        const handlerFunc = delivery.deliveryAddressId
          ? updateAddress
          : addAddress;
        const rFields = { ...fields, ...sugAddr };
        //俄罗斯地址修改了才去调是否在配送范围的验证
        if (
          addressInputType === 'AUTOMATICALLY' &&
          delivery.address1 !== fields.address1
        ) {
          const validStatus = await validateAddressScope({
            regionFias: dadataAddress.provinceId || null,
            areaFias: dadataAddress.areaId || null,
            cityFias: dadataAddress.cityId || null,
            settlementFias: dadataAddress.settlementId || null,
            postalCode: dadataAddress.postCode || null
          });
          if (!validStatus) {
            this.props.form.setFields({
              address1: {
                value: fields['address1'],
                errors: [
                  new Error(RCi18n({ id: 'PetOwner.addressWithinAlert' }))
                ]
              }
            });
            this.setState({ loading: false });
            return;
          }
        }
        //俄罗斯地址验证地址是否齐全
        if (
          addressInputType === 'AUTOMATICALLY' &&
          delivery.address1 === fields.address1 &&
          (!delivery.street ||
            !delivery.postCode ||
            !delivery.house ||
            !delivery.city)
        ) {
          const errTip = !delivery.street
            ? new Error(RCi18n({ id: 'PetOwner.AddressStreetTip' }))
            : !delivery.postCode
            ? new Error(RCi18n({ id: 'PetOwner.AddressPostCodeTip' }))
            : !delivery.house
            ? new Error(RCi18n({ id: 'PetOwner.AddressHouseTip' }))
            : new Error(RCi18n({ id: 'PetOwner.AddressCityTip' }));
          this.props.form.setFields({
            address1: {
              value: fields['address1'],
              errors: [errTip]
            }
          });
          this.setState({ loading: false });
          return;
        }
        handlerFunc({
          ...delivery,
          ...rFields,
          ...(dadataAddress.unrestrictedValue
            ? {
                country: dadataAddress.countryCode || '',
                countryId: (this.state.countryList[0] ?? {}).id ?? '',
                province: dadataAddress.province || '',
                provinceId: null,
                city: dadataAddress.city || '',
                cityId: null,
                area: dadataAddress.area || '',
                housing: dadataAddress.block || '',
                house: dadataAddress.house || '',
                settlement: dadataAddress.settlement || '',
                street: dadataAddress.street || '',
                postCode: rFields.postCode || dadataAddress.postCode
              }
            : {
                country: (this.state.countryList[0] ?? {}).value ?? '',
                countryId: (this.state.countryList[0] ?? {}).id ?? '',
                provinceId: rFields.province
                  ? (this.state.stateList.find(
                      (st) => st.name === rFields.province
                    ) ?? {})['id']
                  : null
              }),
          customerId: this.props.customerId,
          consigneeName: rFields.firstName + ' ' + rFields.lastName,
          deliveryAddress: [rFields.address1, rFields.address2].join(''),
          isDefaltAddress: delivery.isDefaltAddress || 0,
          type: this.props.addressType.toUpperCase()
        })
          .then((data) => {
            message.success(data.res.message);
            this.setState({ loading: false, validationModalVisisble: false });
            this.backToCustomerDetail();
          })
          .catch(() => {
            this.setState({ loading: false });
          });
      }
    });
  };

  searchCity = (txt: string) => {
    txt.trim() !== '' &&
      searchCity(txt).then((data) => {
        if (data.res.code === Const.SUCCESS_CODE) {
          this.setState({
            searchCityList: data.res.context.systemCityVO
          });
        }
      });
  };

  searchAddress = (txt: string) => {
    getAddressListByDadata(txt).then((data) => {
      if (data.res.code === Const.SUCCESS_CODE) {
        this.setState({
          searchAddressList: data.res.context.addressList
        });
      }
    });
  };

  onSelectRuAddress = (val: string) => {
    const address = this.state.searchAddressList.find(
      (addr) => addr.unrestrictedValue === val
    );
    if (address) {
      this.setState({
        dadataAddress: address
      });
      this.props.form.setFieldsValue({
        postCode: address.postCode || '',
        entrance: address.entrance || '',
        apartment: address.flat || ''
      });
    }
  };

  onCheckRuAddress = () => {
    const address1 = this.props.form.getFieldValue('address1');
    const address = this.state.searchAddressList.find(
      (addr) => addr.unrestrictedValue === address1
    );
    if (!address) {
      this.props.form.setFieldsValue({
        address1: this.props.delivery.address1
      });
    }
  };

  renderField = (field: any) => {
    if (field.fieldName === 'Address1') {
      if (field.inputSearchBoxFlag === 1) {
        return (
          <AutoComplete
            dataSource={this.state.searchAddressList.map(
              (addr) => addr.unrestrictedValue
            )}
            onSearch={this.searchAddress}
            onSelect={this.onSelectRuAddress}
            onBlur={this.onCheckRuAddress}
          />
          // <Select showSearch filterOption={false} onSearch={this.searchAddress} onChange={this.onSelectRuAddress}>
          //   {this.state.searchAddressList.map((item, idx) => (
          //     <Option value={item.unrestrictedValue} key={idx}>
          //       {item.unrestrictedValue}
          //     </Option>
          //   ))}
          // </Select>
        );
      } else {
        return <Input />;
      }
    }
    if (field.fieldName === 'City') {
      if (field.inputDropDownBoxFlag === 1) {
        return (
          <Select
            showSearch
            onChange={(val) => this.getRegionListByCity(1, val)}
          >
            {this.state.cityList.map((city, idx) => (
              <Option value={city.cityName} key={idx}>
                {city.cityName}
              </Option>
            ))}
          </Select>
        );
      } else if (
        field.inputSearchBoxFlag === 1 &&
        field.inputFreeTextFlag === 1
      ) {
        return (
          <AutoComplete
            dataSource={this.state.searchCityList.map((city) => city.cityName)}
            onSearch={this.searchCity}
            onChange={(val) => this.getRegionListByCity(2, val)}
          />
        );
      } else if (field.inputSearchBoxFlag === 1) {
        return (
          <Select
            showSearch
            onSearch={this.searchCity}
            onChange={(val) => this.getRegionListByCity(2, val)}
          >
            {this.state.searchCityList.map((city, idx) => (
              <Option value={city.cityName} key={idx}>
                {city.cityName}
              </Option>
            ))}
          </Select>
        );
      } else {
        return <Input />;
      }
    }
    const optionList =
      field.fieldName === 'Country'
        ? this.state.countryList
        : field.fieldName === 'State'
        ? this.state.stateList
        : field.fieldName === 'Region'
        ? this.state.regionList
        : [];
    if (field.inputDropDownBoxFlag === 1) {
      return (
        <Select showSearch>
          {optionList.map((item, idx) => (
            <Option
              value={field.fieldName === 'Country' ? item.id : item.name}
              key={idx}
            >
              {item.name}
            </Option>
          ))}
        </Select>
      );
    }
    if (field.inputFreeTextFlag === 1) {
      return <Input />;
    }
    return null;
  };

  //手机校验
  comparePhone = (rule, value, callback) => {
    if (!/^[0-9+-\\(\\)\s]{6,25}$/.test(value)) {
      callback(RCi18n({ id: 'PetOwner.theCorrectPhone' }));
    } else {
      callback();
    }
  };

  compareZip = (rule, value, callback) => {
    if (!/^[0-9]{3,10}$/.test(value)) {
      callback(RCi18n({ id: 'PetOwner.theCorrectPostCode' }));
    } else {
      callback();
    }
  };

  //俄罗斯address1校验
  ruAddress1Validator = (rule, value, callback) => {
    const address = this.state.searchAddressList.find(
      (addr) => addr.unrestrictedValue === value
    );
    if (address && !address.street) {
      callback(RCi18n({ id: 'PetOwner.AddressStreetTip' }));
    } else if (address && !address.postCode) {
      callback(RCi18n({ id: 'PetOwner.AddressPostCodeTip' }));
    } else if (address && !address.house) {
      callback(RCi18n({ id: 'PetOwner.AddressHouseTip' }));
    } else if (address && !address.city) {
      callback(RCi18n({ id: 'PetOwner.AddressCityTip' }));
    } else {
      callback();
    }
  };

  render() {
    const { delivery, addressType } = this.props;
    const { fields, suggestionAddress, checkedAddress, validationSuccess } =
      this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = (col: number) => ({
      labelCol: {
        xs: { span: 24 },
        sm: { span: col === 1 ? 8 : 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: col === 1 ? 12 : 18 }
      }
    });
    return (
      <div>
        <Spin spinning={this.state.loading}>
          <div className="container">
            <Headline
              title={
                delivery.deliveryAddressId
                  ? addressType === 'delivery'
                    ? RCi18n({ id: 'PetOwner.EditDeliveryInformation' })
                    : RCi18n({ id: 'PetOwner.EditBillingInformation' })
                  : addressType === 'delivery'
                  ? RCi18n({ id: 'PetOwner.AddDeliveryInformation' })
                  : RCi18n({ id: 'PetOwner.AddBillingInformation' })
              }
            />
            <Form>
              <Row>
                {this.state.formFieldList.map((field, colIdx) => (
                  <Col span={12 * field.occupancyNum} key={colIdx}>
                    <Form.Item
                      {...formItemLayout(field.occupancyNum)}
                      label={RCi18n({ id: `PetOwner.${field.fieldName}` })}
                    >
                      {getFieldDecorator(`${FORM_FIELD_MAP[field.fieldName]}`, {
                        initialValue: delivery[FORM_FIELD_MAP[field.fieldName]],
                        rules: [
                          {
                            required: field.requiredFlag === 1,
                            message: RCi18n({
                              id: 'PetOwner.ThisFieldIsRequired'
                            })
                          },
                          field.fieldName != 'Country'
                            ? {
                                max: field.maxLength,
                                message: RCi18n({
                                  id: 'PetOwner.ExceedMaximumLength'
                                })
                              }
                            : undefined,
                          {
                            validator:
                              field.fieldName === 'Phone number' &&
                              field.requiredFlag === 1
                                ? this.comparePhone
                                : (rule, value, callback) => callback()
                          },
                          {
                            validator:
                              field.fieldName === 'Postal code' &&
                              field.requiredFlag === 1
                                ? this.compareZip
                                : (rule, value, callback) => callback()
                          },
                          {
                            validator:
                              field.fieldName === 'Address1' &&
                              field.inputSearchBoxFlag === 1
                                ? this.ruAddress1Validator
                                : (rule, value, callback) => callback()
                          }
                        ].filter((r) => !!r)
                      })(this.renderField(field))}
                    </Form.Item>
                  </Col>
                ))}
              </Row>
            </Form>
          </div>
          <div className="bar-button">
            <Button
              type="primary"
              disabled={this.state.formFieldList.length === 0}
              onClick={() => this.validateAddress()}
            >
              <FormattedMessage id="PetOwner.Save" />
            </Button>
            <Button
              onClick={this.backToCustomerDetail}
              style={{ marginLeft: '20px' }}
            >
              <FormattedMessage id="PetOwner.Cancel" />
            </Button>
          </div>
          <Modal
            width={920}
            title={RCi18n({ id: 'PetOwner.verifyYourAddress' })}
            visible={this.state.validationModalVisisble}
            confirmLoading={this.state.loading}
            onCancel={this.onCancelSuggestionModal}
            onOk={this.saveAddress}
          >
            <Alert
              type="warning"
              message={RCi18n({ id: 'PetOwner.verifyAddressAlert' })}
            />
            <Row gutter={32} style={{ marginTop: 20 }}>
              <Col span={12}>
                <Radio
                  disabled={!validationSuccess}
                  checked={checkedAddress === 0}
                  onClick={() => this.onChangeCheckedAddress(0)}
                >
                  <span className="text-highlight">
                    <FormattedMessage id="PetOwner.originalAddress" />
                  </span>
                  <br />
                  <span style={{ paddingLeft: 26, wordBreak: 'break-word' }}>
                    {[
                      [fields.address1, fields.address2].join(''),
                      fields.city,
                      fields.state,
                      fields.postCode
                    ]
                      .filter((fd) => !!fd)
                      .join(',')}
                  </span>
                </Radio>
                <div style={{ paddingLeft: 10 }}>
                  <Button type="link" onClick={this.onCancelSuggestionModal}>
                    <FormattedMessage id="PetOwner.Edit" />
                  </Button>
                </div>
              </Col>
              <Col span={12}>
                <Radio
                  checked={checkedAddress === 1}
                  onClick={() => this.onChangeCheckedAddress(1)}
                >
                  <span className="text-highlight">
                    <FormattedMessage id="PetOwner.suggestAddress" />
                  </span>
                  <br />
                  <span style={{ paddingLeft: 26, wordBreak: 'break-word' }}>
                    {[
                      [
                        suggestionAddress.address1,
                        suggestionAddress.address2
                      ].join(''),
                      suggestionAddress.city,
                      suggestionAddress.provinceCode,
                      suggestionAddress.postalCode
                    ]
                      .filter((fd) => !!fd)
                      .join(',')}
                  </span>
                </Radio>
              </Col>
            </Row>
          </Modal>
        </Spin>
      </div>
    );
  }
}

export default Form.create<Iprop>()(DeliveryItem);
