import React from 'react';
import { IMap, Relax } from 'plume2';
import { Button, Input, Form, Switch } from 'antd';
import { QMMethod, noop, ValidConst, AuthWrapper, isSystem } from 'qmkit';
import styled from 'styled-components';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 4,
    xs: { span: 6 },
    sm: { span: 5 }
  },
  wrapperCol: {
    span: 14,
    xs: { span: 14 },
    sm: { span: 19 }
  }
};

const GreyText = styled.span`
  color: #999999;
  margin-left: 5px;
`;

@Relax
export default class InfoForm extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      appUpgrade: IMap;
      //改变升级配置基本信息
      onChange: Function;
      onSaveSetting: Function;
    };
  };

  static relaxProps = {
    appUpgrade: 'appUpgrade',
    onChange: noop,
    onSaveSetting: noop
  };

  componentDidMount() {
    this.setState({});
  }

  render() {
    const { appUpgrade, onChange } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form
        style={{ paddingBottom: 50, maxWidth: 900 }}
        onSubmit={isSystem(this._handleSubmit)}
      >
        <FormItem
          {...formItemLayout}
          label="App强制更新"
          hasFeedback
          required={true}
        >
          {getFieldDecorator('forceUpdateFlag')(
            <Switch
              checkedChildren="开"
              unCheckedChildren="关"
              checked={appUpgrade.get('forceUpdateFlag') == 1}
              onChange={(e) =>
                onChange({
                  field: 'forceUpdateFlag',
                  value: e.valueOf() ? 1 : 0
                })
              }
            />
          )}
          <GreyText>开启后App必须完成更新才可进行使用</GreyText>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="最新版本号"
          hasFeedback
          required={true}
        >
          {getFieldDecorator('latestVersion', {
            initialValue: appUpgrade.get('latestVersion'),
            rules: [
              { required: true, message: '请填写最新版本号' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorMinAndMax(
                    rule,
                    value,
                    callback,
                    '最新版本号',
                    1,
                    20
                  );
                }
              }
            ]
          })(
            <Input
              placeholder="请填写更新后版本号"
              onChange={(e: any) =>
                onChange({
                  field: 'latestVersion',
                  value: e.target.value
                })
              }
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Android下载地址"
          hasFeedback
          required={true}
        >
          {getFieldDecorator('androidAddress', {
            initialValue: appUpgrade.get('androidAddress'),
            rules: [
              { required: true, message: '请填写Android下载地址' },
              { validator: this.checkWebsite }
            ]
          })(
            <Input
              placeholder="请填写Android应用下载地址"
              onChange={(e: any) =>
                onChange({
                  field: 'androidAddress',
                  value: e.target.value
                })
              }
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="IOS下载地址"
          hasFeedback
          required={true}
        >
          {getFieldDecorator('appAddress', {
            initialValue: appUpgrade.get('appAddress'),
            rules: [
              { required: true, message: '请填写IOS下载地址' },
              { validator: this.checkWebsite }
            ]
          })(
            <Input
              placeholder="请填写IOS下载地址"
              onChange={(e: any) =>
                onChange({
                  field: 'appAddress',
                  value: e.target.value
                })
              }
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="更新描述"
          hasFeedback
          required={true}
        >
          {getFieldDecorator('upgradeDesc', {
            initialValue: appUpgrade.get('upgradeDesc'),
            rules: [
              { required: true, message: '请填写更新描述' },
              { max: 500, message: '最多可输入500个字符' }
            ]
          })(
            <Input.TextArea
              style={{ height: 100 }}
              placeholder="限制500个字"
              onChange={(e: any) =>
                onChange({
                  field: 'upgradeDesc',
                  value: e.target.value
                })
              }
            />
          )}
        </FormItem>

        <AuthWrapper functionName={'f_check_update_edit'}>
          <div className="bar-button">
            <Button type="primary" onClick={isSystem(this._handleSubmit)}>
              保存
            </Button>
          </div>
        </AuthWrapper>
      </Form>
    );
  }

  /**
   * 提交
   * @param e
   * @private
   */
  _handleSubmit = () => {
    const { appUpgrade } = this.props.relaxProps;
    const form = this.props.form;
    form.validateFields(null, (errs) => {
      //如果校验通过
      if (!errs) {
        this.props.relaxProps.onSaveSetting(appUpgrade);
      } else {
        this.setState({});
      }
    });
  };

  /**
   * 校验网址
   * @param rule
   * @param value
   * @param callback
   */
  checkWebsite = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }

    // const pcWebsiteReg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
    if (!ValidConst.url.test(value)) {
      callback(new Error('请输入正确的网址'));
      return;
    }

    if (value.length > 100) {
      callback(new Error('下载地址限制100个字符'));
      return;
    }

    callback();
  };
}
