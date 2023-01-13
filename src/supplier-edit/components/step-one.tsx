import React from 'react';
import { IMap, Relax } from 'plume2';
import { Row, Col, Form, Input, Button, Switch } from 'antd';
import styled from 'styled-components';
import { noop, ValidConst, QMMethod, AreaSelect } from 'qmkit';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 5 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 16 }
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
  .reason {
    padding-left: 100px;
    position: relative;
    word-break: break-all;
    span {
      position: absolute;
      left: 0;
      top: -5px;
    }
  }
`;

const GreyText = styled.span`
  color: #999999;
  margin-left: 5px;
`;

// 审核状态 0、待审核 1、已审核 2、审核未通过
const AUDIT_STATE = {
  0: '待审核',
  1: '已审核',
  2: '审核未通过'
};

// 店铺状态 0、开启 1、关店
const STORE_STATE = {
  0: '开启',
  1: '关店'
};

// 账户状态  0：启用   1：禁用
const ACCOUNT_STATE = {
  0: '启用',
  1: '禁用'
};

@Relax
export default class StepOne extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      company: IMap;
      onChange: Function; //改变商家基本信息
      onSaveStoreInfo: Function;
    };
  };

  static relaxProps = {
    company: 'company',
    onChange: noop,
    onSaveStoreInfo: noop
  };

  componentDidMount() {
    this.setState({});
  }

  render() {
    const { company, onChange } = this.props.relaxProps;
    const storeInfo = company.get('storeInfo');
    const { getFieldDecorator } = this.props.form;
    const area = storeInfo.get('provinceId')
      ? [
          storeInfo.get('provinceId').toString(),
          storeInfo.get('cityId') ? storeInfo.get('cityId').toString() : null,
          storeInfo.get('areaId') ? storeInfo.get('areaId').toString() : null
        ]
      : [];

    return (
      <div>
        <GreyBg>
          <Row>
            <Col span={8}>
              <span>审核状态：</span>{' '}
              {storeInfo.get('auditState') != null
                ? AUDIT_STATE[storeInfo.get('auditState')]
                : '-'}
            </Col>
            <Col span={8}>
              <span>账号状态：</span>{' '}
              {storeInfo.get('accountState') != null
                ? ACCOUNT_STATE[storeInfo.get('accountState')]
                : '-'}
            </Col>
            <Col span={8}>
              <span>店铺状态：</span>{' '}
              {storeInfo.get('storeState') != null
                ? STORE_STATE[storeInfo.get('storeState')]
                : '-'}
            </Col>
            {storeInfo.get('auditState') != null &&
            storeInfo.get('auditState') == 2 ? (
              <Col span={24}>
                <p className="reason">
                  <span>审核驳回原因：</span>
                  {storeInfo.get('auditReason')
                    ? storeInfo.get('auditReason')
                    : '-'}
                </p>
              </Col>
            ) : null}
            {storeInfo.get('accountState') != null &&
            storeInfo.get('accountState') == 1 ? (
              <Col span={24}>
                <p className="reason">
                  <span>账号禁用原因：</span>
                  {storeInfo.get('accountDisableReason')
                    ? storeInfo.get('accountDisableReason')
                    : '-'}
                </p>
              </Col>
            ) : null}
            {storeInfo.get('storeState') != null &&
            storeInfo.get('storeState') == 1 ? (
              <Col span={24}>
                <p className="reason">
                  <span>店铺关闭原因：</span>{' '}
                  {storeInfo.get('storeClosedReason')
                    ? storeInfo.get('storeClosedReason')
                    : '-'}
                </p>
              </Col>
            ) : null}
          </Row>
        </GreyBg>
        <div style={{ width: 600 }}>
          <Form>
            <FormItem {...formItemLayout} required={true} label="商家编号">
              {getFieldDecorator('supplierCode', {
                initialValue: storeInfo.get('supplierCode')
              })(<Input disabled={true} />)}
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="商家名称">
              {getFieldDecorator('supplierName', {
                initialValue: storeInfo.get('supplierName'),
                rules: [
                  { required: true, message: '请填写商家名称' },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorTrimMinAndMax(
                        rule,
                        value,
                        callback,
                        '商家名称',
                        1,
                        20
                      );
                    }
                  }
                ]
              })(
                <Input
                  onChange={(e: any) =>
                    onChange({
                      field: 'supplierName',
                      value: e.target.value
                    })
                  }
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="店铺名称">
              {getFieldDecorator('storeName', {
                initialValue: storeInfo.get('storeName'),
                rules: [
                  { required: true, message: '请填写店铺名称' },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorTrimMinAndMax(
                        rule,
                        value,
                        callback,
                        '店铺名称',
                        1,
                        20
                      );
                    }
                  }
                ]
              })(
                <Input
                  onChange={(e: any) =>
                    onChange({
                      field: 'storeName',
                      value: e.target.value
                    })
                  }
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="联系人">
              {getFieldDecorator('contactPerson', {
                initialValue: storeInfo.get('contactPerson'),
                rules: [
                  { required: true, message: '请填写联系人' },
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
                  onChange={(e: any) =>
                    onChange({
                      field: 'contactPerson',
                      value: e.target.value
                    })
                  }
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="联系方式">
              {getFieldDecorator('contactMobile', {
                initialValue: storeInfo.get('contactMobile'),
                rules: [
                  { required: true, message: '请填写联系方式' },
                  { pattern: ValidConst.phone, message: '请输入正确的联系方式' }
                ]
              })(
                <Input
                  onChange={(e: any) =>
                    onChange({
                      field: 'contactMobile',
                      value: e.target.value
                    })
                  }
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="联系邮箱">
              {getFieldDecorator('contactEmail', {
                initialValue: storeInfo.get('contactEmail'),
                rules: [
                  { required: true, message: '请填写联系邮箱' },
                  {
                    pattern: ValidConst.email,
                    message: '请输入正确的联系邮箱'
                  },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorTrimMinAndMax(
                        rule,
                        value,
                        callback,
                        '联系邮箱',
                        1,
                        100
                      );
                    }
                  }
                ]
              })(
                <Input
                  onChange={(e: any) =>
                    onChange({
                      field: 'contactEmail',
                      value: e.target.value
                    })
                  }
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="所在地区">
              {getFieldDecorator('area', {
                initialValue: area,
                rules: [{ required: true, message: '请选择所在地区' }]
              })(
                <AreaSelect
                  getPopupContainer={() =>
                    document.getElementById('page-content')
                  }
                  onChange={(value) =>
                    onChange({ field: 'area', value: value })
                  }
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="详细地址">
              {getFieldDecorator('addressDetail', {
                initialValue: storeInfo.get('addressDetail'),
                rules: [
                  { required: true, message: '请填写详细地址' },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorTrimMinAndMax(
                        rule,
                        value,
                        callback,
                        '详细地址',
                        1,
                        60
                      );
                    }
                  }
                ]
              })(
                <Input
                  onChange={(e) =>
                    onChange({
                      field: 'addressDetail',
                      value: (e.target as any).value
                    })
                  }
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="商家账号">
              {getFieldDecorator('accountName', {
                initialValue: storeInfo.get('accountName'),
                rules: [
                  { required: true, message: '请填写商家账号' },
                  { pattern: ValidConst.phone, message: '请输入正确的商家账号' }
                ]
              })(
                <Input
                  onChange={(e: any) =>
                    onChange({
                      field: 'accountName',
                      value: e.target.value
                    })
                  }
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="重置密码">
              {getFieldDecorator('isResetPwd')(
                <Switch
                  checked={storeInfo.get('isResetPwd')}
                  onChange={(e) =>
                    onChange({
                      field: 'isResetPwd',
                      value: e.valueOf()
                    })
                  }
                />
              )}
              <GreyText>保存后将会发送新的账号密码至客户新的手机号</GreyText>
            </FormItem>
            {storeInfo.get('isResetPwd') ? (
              <div>
                <FormItem {...formItemLayout} required={true} label="登录密码">
                  {getFieldDecorator('accountPassword', {
                    rules: [
                      { required: true, message: '请输入密码' },
                      {
                        pattern: ValidConst.password,
                        message: '密码为6-16位字母或数字密码'
                      }
                    ]
                  })(
                    <Input
                      type="password"
                      onChange={(e: any) =>
                        onChange({
                          field: 'accountPassword',
                          value: e.target.value
                        })
                      }
                    />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} required={true} label="确认密码">
                  {getFieldDecorator('accountPasswordConfirm', {
                    rules: [
                      { required: true, message: '请输入确认密码' },
                      { validator: this.checkConfirmPassword }
                    ]
                  })(
                    <Input
                      type="password"
                      onChange={(e: any) =>
                        onChange({
                          field: 'accountPasswordConfirm',
                          value: e.target.value
                        })
                      }
                    />
                  )}
                </FormItem>
              </div>
            ) : null}
            <div className="bar-button">
              <Button type="primary" onClick={this._onSave}>
                保存
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }

  /**
   * 确认密码
   * @param rule
   * @param value
   * @param callback
   */
  checkConfirmPassword = (_rule, value, callback) => {
    if (value != this.props.form.getFieldValue('accountPassword')) {
      callback(new Error('重复密码不一致'));
      return;
    }

    callback();
  };

  /**
   * 保存商家基本信息
   */
  _onSave = () => {
    const form = this.props.form;
    const { onSaveStoreInfo, company } = this.props.relaxProps;
    form.validateFields(null, (errs) => {
      //如果校验通过
      if (!errs) {
        onSaveStoreInfo(company.get('storeInfo'));
      } else {
        this.setState({});
      }
    });
  };
}
