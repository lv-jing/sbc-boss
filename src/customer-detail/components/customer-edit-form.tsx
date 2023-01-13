import React from 'react';
import { Form, Input, Select, Row, Col, Switch, Button } from 'antd';
import styled from 'styled-components';
import {
  AreaSelect,
  ValidConst,
  noop,
  QMMethod,
  AuthWrapper,
  FindBusiness
} from 'qmkit';
import { IMap, Relax, Store } from 'plume2';
import { fromJS } from 'immutable';
import { history, checkMenu } from 'qmkit';
import PropTypes from 'prop-types';
const FormItem = Form.Item;

const Option = Select.Option;
const formItemLayoutDetail = {
  labelCol: {
    span: 6,
    xs: { span: 24 },
    sm: { span: 2 }
  },
  wrapperCol: {
    span: 8,
    xs: { span: 7 },
    sm: { span: 7 }
  }
};

const formItemLayoutCrmDetail = {
  labelCol: {
    span: 6,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 18,
    xs: { span: 24 },
    sm: { span: 18 }
  }
};
const GreyBg = styled.div`
  background: #f5f5f5;
  padding: 15px;
  color: #333333;
  margin-bottom: 20px;

  span {
    width: 100px;
    text-align: right;
    color: #666666;
    display: inline-block;
    margin: 5px 0;
  }
`;

class CustomerInfoForm extends React.Component<any, any> {
  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  props: {
    crmFlag: boolean; //是否是crm页面引用
    form: any;
  };

  componentWillMount() {
    this.setState({
      newAccountVisible: false
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const onFormChange = (this._store as any).onFormChange;
    const updateEnterpriseInfo = (this._store as any).updateEnterpriseInfo;
    const employee = this._store.state().get('employee');
    const customerLevels = this._store.state().get('customerLevels');
    const customerForm = this._store.state().get('customerForm');
    const customerBean = this._store.state().get('customerBean');
    const isIepInfo =
      (customerForm.get('enterpriseCheckState') &&
        customerForm.get('enterpriseCheckState') != 0) ||
      false;
    const enterpriseInfo = customerForm.get('enterpriseInfo') || fromJS({});

    const area = customerForm.get('provinceId')
      ? [
          customerForm.get('provinceId').toString(),
          customerForm.get('cityId')
            ? customerForm.get('cityId').toString()
            : null,
          customerForm.get('areaId')
            ? customerForm.get('areaId').toString()
            : null
        ]
      : [];

    const formItemLayout = this.props.crmFlag
      ? formItemLayoutCrmDetail
      : formItemLayoutDetail;
    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label="客户名称"
          required={true}
          hasFeedback={true}
        >
          {getFieldDecorator('customerName', {
            initialValue: customerForm.get('customerName'),
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorTrimMinAndMax(
                    rule,
                    value,
                    callback,
                    '客户名称',
                    2,
                    15
                  );
                }
              }
            ]
          })(
            <Input
              onChange={(e) =>
                onFormChange({
                  field: 'customerName',
                  value: (e.target as any).value
                })
              }
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="所在地区">
          {getFieldDecorator('area', {
            initialValue: area
          })(
            <AreaSelect
              getPopupContainer={() => document.getElementById('page-content')}
              onChange={(value) =>
                onFormChange({ field: 'area', value: value })
              }
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="详细地址">
          {getFieldDecorator('customerAddress', {
            initialValue: customerForm.get('customerAddress'),
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorMinAndMax(
                    rule,
                    value,
                    callback,
                    '详细地址',
                    5,
                    60
                  );
                }
              }
            ]
          })(
            <Input
              onChange={(e) =>
                onFormChange({
                  field: 'customerAddress',
                  value: (e.target as any).value
                })
              }
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={'联系人'}
          required={true}
          hasFeedback={true}
        >
          {getFieldDecorator('contactName', {
            initialValue: customerForm.get('contactName'),
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorTrimMinAndMax(
                    rule,
                    value,
                    callback,
                    '联系人',
                    2,
                    15
                  );
                }
              }
            ]
          })(
            <Input
              onChange={(e) =>
                onFormChange({
                  field: 'contactName',
                  value: (e.target as any).value
                })
              }
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={'联系方式'} hasFeedback={true}>
          {getFieldDecorator('contactPhone', {
            initialValue: customerForm.get('contactPhone'),
            rules: [
              { required: true, message: '请填写联系方式' },
              { pattern: ValidConst.phone, message: '请输入正确的联系方式' }
            ]
          })(
            <Input
              onChange={(e) =>
                onFormChange({
                  field: 'contactPhone',
                  value: (e.target as any).value
                })
              }
            />
          )}
        </FormItem>

        {customerBean.get('customerType') == 0 && (
          <FormItem {...formItemLayout} label="平台客户等级">
            {getFieldDecorator('customerLevelId', {
              initialValue:
                customerForm.get('customerLevelId') != ''
                  ? customerForm.get('customerLevelId')
                  : null,
              rules: [{ required: true, message: '请选择平台客户等级' }]
            })(
              <Select
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                onChange={(value) =>
                  onFormChange({ field: 'customerLevelId', value: value })
                }
              >
                <Option value={null}>请选择</Option>
                {customerLevels.map((v) => (
                  <Option
                    key={v.get('customerLevelId')}
                    value={v.get('customerLevelId')}
                  >
                    {v.get('customerLevelName')}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        )}

        {customerBean.get('customerType') == 0 && (
          <FormItem {...formItemLayout} label="业务员">
            {getFieldDecorator('employeeId', {
              initialValue:
                customerForm.get('employeeId') != ''
                  ? customerForm.get('employeeId')
                  : null,
              rules: [{ required: true, message: '请选择业务员' }]
            })(
              <Select
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                onChange={(value) =>
                  onFormChange({ field: 'employeeId', value: value })
                }
              >
                <Option value={null}>请选择</Option>
                {employee.map((v) => (
                  <Option key={v.get('employeeId')} value={v.get('employeeId')}>
                    {v.get('employeeName')}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        )}

        {isIepInfo && (
          <FormItem {...formItemLayout} label="公司性质">
            {getFieldDecorator('businessNatureType', {
              initialValue: enterpriseInfo.get('businessNatureType'),
              rules: [{ required: true, message: '请选择公司性质' }],
              onChange: (e) =>
                updateEnterpriseInfo({ field: 'businessNatureType', value: e })
            })(
              <Select dropdownStyle={{ zIndex: 1053 }}>
                <Option value={null}>请选择</Option>
                {FindBusiness.getBusinessNatures().map((v) => (
                  <Option key={v.get('value')} value={v.get('value')}>
                    {v.get('label')}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        )}

        {isIepInfo && (
          <FormItem {...formItemLayout} label={'公司名称'} hasFeedback={true}>
            {getFieldDecorator('enterpriseName', {
              initialValue: enterpriseInfo.get('enterpriseName'),
              rules: [
                {
                  required: true,
                  message: '请按营业执照填写',
                  whitespace: true
                },
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorMinAndMax(
                      rule,
                      value,
                      callback,
                      '公司名称',
                      2,
                      60
                    );
                  }
                },
                {
                  pattern: ValidConst.companyName,
                  message: '公司名称只能由中文、英文、数字及“_”、“-”、()、（）'
                }
              ],
              onChange: (e) =>
                updateEnterpriseInfo({
                  field: 'enterpriseName',
                  value: e.target.value
                })
            })(<Input />)}
          </FormItem>
        )}

        {isIepInfo && (
          <FormItem
            {...formItemLayout}
            label={'统一社会信用代码'}
            hasFeedback={true}
          >
            {getFieldDecorator('socialCreditCode', {
              initialValue: enterpriseInfo.get('socialCreditCode'),
              rules: [
                {
                  required: true,
                  message: '即纳税人识别号（税号）',
                  whitespace: true
                },
                {
                  pattern: ValidConst.socialCreditCode,
                  message: '请填写正确的统一社会信用代码且必须8-30字符'
                }
              ],
              onChange: (e) =>
                updateEnterpriseInfo({
                  field: 'socialCreditCode',
                  value: e.target.value
                })
            })(<Input />)}
          </FormItem>
        )}

        <FormItem {...formItemLayout} label={'账号'} hasFeedback={false}>
          {getFieldDecorator('customerAccount', {
            initialValue: customerForm
              .get('customerAccount')
              .replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
            rules: [{ required: true }]
          })(
            <Input
              disabled={true}
              onChange={(e) =>
                onFormChange({
                  field: 'customerAccount',
                  value: (e.target as any).value
                })
              }
            />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label={'重置账号'}>
          <Switch
            checkedChildren="开"
            unCheckedChildren="关"
            defaultChecked={false}
            onChange={this._handleSwitchOnChange}
          />
          &nbsp;
          <span style={styles.grey}>
            保存后将发送新的账号密码到新的手机号，密码为随机生成的6位数字。
          </span>
        </FormItem>

        {this.state.newAccountVisible && (
          <FormItem {...formItemLayout} label={'新的账号'} hasFeedback={true}>
            {getFieldDecorator('customerAccountForReset', {
              initialValue: '',
              rules: [
                { required: true, message: '请输入新的账号' },
                { pattern: ValidConst.phone, message: '请输入正确的联系方式' }
              ]
            })(
              <Input
                onChange={(e) =>
                  onFormChange({
                    field: 'customerAccountForReset',
                    value: (e.target as any).value
                  })
                }
              />
            )}
          </FormItem>
        )}
      </Form>
    );
  }

  /**
   * 新账号input根据switch的状态变化而显示
   *
   * @param value
   * @private
   */
  _handleSwitchOnChange = (value) => {
    this.setState({ newAccountVisible: value });
    const onFormChange = (this._store as any).onFormChange;
    onFormChange({ field: 'passReset', value: value });
  };
}

const WrapperForm = Form.create()(CustomerInfoForm as any);

@Relax
export default class CustomerEditForm extends React.Component<any, any> {
  _form;

  props: {
    form?: any;
    relaxProps?: {
      setValue?: Function;
      customerBean?: IMap;
      saveCustomer?: Function;
    };
    closeModal?: Function;
    type?: string;
    crmFlag?: boolean; //是否是crm页面引用
  };

  static relaxProps = {
    setValue: noop,
    customerBean: 'customerBean',
    saveCustomer: noop,
    type: 'type',
    closeModal: noop,
    crmFlag: 'crmFlag'
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.relaxProps.setValue('refreshCustomerForm', this.refresh);
    this.props.relaxProps.setValue('customerValidForm', this.props.form);
  }

  render() {
    const { saveCustomer, customerBean } = this.props.relaxProps;

    let checkState;
    switch (customerBean.get('checkState')) {
      case 0:
        checkState = '审核中';
        break;
      case 1:
        checkState = '已审核';
        break;
      case 2:
        checkState = '审核未通过';
        break;
      default:
        checkState = '';
    }

    // @ts-ignore
    return (
      <div>
        {!this.props.type && (
          <GreyBg>
            <Row>
              <Col span={6}>
                <p>审核状态：</p>
                <p>{checkState}</p>
              </Col>
              <Col span={6}>
                <p>账号状态：</p>
                <p>
                  {customerBean.get('customerStatus') == 0 ? '启用' : '禁用'}
                </p>
              </Col>
              <Col span={6}>
                <p>客户类型：</p>
                <p>
                  {customerBean.get('customerType') == 1
                    ? '商家客户'
                    : '平台客户'}
                </p>
              </Col>
              <Col span={6}>
                <p>分销员：</p>
                <p>{customerBean.get('isDistributor') == 1 ? '是' : '否'}</p>
              </Col>
              {customerBean.get('checkState') == 2 && (
                <Col span={8}>
                  <div style={styles.context}>
                    <span>审核驳回原因：</span>
                    <div
                      style={{
                        width: '60%',
                        wordBreak: 'break-all',
                        marginTop: 5
                      }}
                    >
                      {customerBean.get('rejectReason')}
                    </div>
                  </div>
                </Col>
              )}
              {customerBean.get('customerStatus') == 1 && (
                <Col span={8}>
                  <div style={styles.context}>
                    <span>禁用原因：</span>
                    <div
                      style={{
                        width: '60%',
                        wordBreak: 'break-all',
                        marginTop: 5
                      }}
                    >
                      {customerBean.get('forbidReason')}
                    </div>
                  </div>
                </Col>
              )}
              {customerBean.get('customerType') == 1 && (
                <Col span={8}>
                  <span>所属商家：</span> {customerBean.get('supplierName')}
                </Col>
              )}
            </Row>
          </GreyBg>
        )}
        <div>
          <WrapperForm
            ref={(form) => (this._form = form)}
            crmFlag={this.props.crmFlag}
          />

          {checkMenu(
            'f_customer_detail_edit,f_enterprise_customer_detail_edit'
          ) && (
            <div
              className={
                this.props.type === 'modal' ? 'modal-button' : 'bar-button'
              }
            >
              <Button
                type="primary"
                onClick={() =>
                  saveCustomer(
                    this._form,
                    this.props.type,
                    this.props.closeModal
                  )
                }
                style={{ marginRight: 10 }}
              >
                保存
              </Button>
              <Button onClick={this._cancel} style={{ marginLeft: 10 }}>
                取消
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  refresh = () => {
    this.setState({});
  };

  _cancel = () => {
    const { type, closeModal } = this.props;
    if (type && type === 'modal') {
      closeModal();
    } else {
      history.push('/customer-list');
    }
  };
}

const styles = {
  grey: {
    color: '#999999'
  },
  context: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  } as any
};
