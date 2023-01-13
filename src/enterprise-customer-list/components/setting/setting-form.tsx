import React from 'react';
import { Row, Col, Icon, Button, Input, Form, Switch } from 'antd';

import { IList } from 'typings/globalType';
import {
  Const,
  Tips,
  QMUpload,
  AuthWrapper,
  isSystem,
  UEditor,
  noop,
  QMMethod,
  ValidConst
} from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { message } from 'antd';
import styled from 'styled-components';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
    xs: { span: 6 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 14,
    xs: { span: 14 },
    sm: { span: 18 }
  }
};

const GreyText = styled.span`
  color: #999999;
  margin-left: 5px;
`;

export default class settingForm extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      setting: any;
      chooseImgs: IList;
      imgType: number;

      setVisible: Function;
      modifyEnterpriseSetting: Function;
      refEditor: Function;
      saveIepSetting: Function;
    };
  };

  static relaxProps = {
    setting: 'setting',
    chooseImgs: 'chooseImgs',
    imgType: 'imgType',

    setVisible: noop,
    modifyEnterpriseSetting: noop,
    refEditor: noop,
    saveIepSetting: noop
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { setting, refEditor, chooseImgs, imgType } = this.props.relaxProps;

    let enterpriseCustomerName = {
      initialValue: setting.get('enterpriseCustomerName')
    };

    let enterprisePriceName = {
      initialValue: setting.get('enterprisePriceName')
    };

    const enterpriseCustomerLogo = setting.get('enterpriseCustomerLogo');
    const customerLogoImage = enterpriseCustomerLogo
      ? JSON.parse(enterpriseCustomerLogo)
      : [];

    return (
      <Form
        style={{
          paddingBottom: 50
        }}
        onSubmit={isSystem(this._handleSubmit)}
      >
        <Row>
          <Col span={19}>
            <FormItem
              {...formItemLayout}
              label="企业会员名称"
              hasFeedback
              required={true}
            >
              {getFieldDecorator('enterpriseCustomerName', {
                ...enterpriseCustomerName,
                rules: [
                  { required: true, message: '请填写企业会员名称' },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorTrimMinAndMax(
                        rule,
                        value,
                        callback,
                        '企业会员名称',
                        2,
                        8
                      );
                    }
                  },
                  {
                    pattern: ValidConst.noChar,
                    message: '企业会员名称只允许输入中英文和数字'
                  }
                ]
              })(
                <Input
                  style={{ width: 400 }}
                  size="large"
                  placeholder="用于前端展示的企业会员名称"
                  onChange={(e) => {
                    this._modify({
                      field: 'enterpriseCustomerName',
                      value: e.target.value
                    });
                  }}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={19}>
            <FormItem
              {...formItemLayout}
              label="企业价名称"
              hasFeedback
              required={true}
            >
              {getFieldDecorator('enterprisePriceName', {
                ...enterprisePriceName,
                rules: [
                  { required: true, message: '请填写企业价名称' },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorTrimMinAndMax(
                        rule,
                        value,
                        callback,
                        '企业价名称',
                        2,
                        10
                      );
                    }
                  },
                  {
                    pattern: ValidConst.noChar,
                    message: '企业价名称只允许输入中英文和数字'
                  }
                ]
              })(
                <Input
                  style={{ width: 400 }}
                  size="large"
                  placeholder="用于前端展示的企业会员价名称"
                  onChange={(e) => {
                    this._modify({
                      field: 'enterprisePriceName',
                      value: e.target.value
                    });
                  }}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={19} className="customerLogo">
            <FormItem
              required={false}
              {...formItemLayout}
              label="企业会员logo"
              hasFeedback
            >
              <QMUpload
                style={styles.box}
                action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                listType="picture-card"
                name="uploadFile"
                onChange={this._editLogo}
                fileList={customerLogoImage}
                accept={'.png'}
                beforeUpload={this._checkUploadFile.bind(this, 10)}
              >
                {customerLogoImage.length >= 1 ? null : (
                  <div>
                    <Icon type="plus" style={styles.plus} />
                  </div>
                )}
              </QMUpload>
              {getFieldDecorator('enterpriseCustomerLogo', {
                initialValue: enterpriseCustomerLogo
              })(<Input type="hidden" />)}
              <Tips title="用于展示前端企业会员身份标识，仅限png，建议尺寸32*32px，大小不超过10kb" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={19}>
            <FormItem {...formItemLayout} required={true} label="企业会员审核">
              {getFieldDecorator('enterpriseCustomerAuditFlag', {
                initialValue: setting.get('enterpriseCustomerAuditFlag') == 1
              })(
                <Switch
                  checked={setting.get('enterpriseCustomerAuditFlag') == 1}
                  onChange={(e) => {
                    this._modify({
                      field: 'enterpriseCustomerAuditFlag',
                      value: e ? 1 : 0
                    });
                    this.props.form.resetFields();
                  }}
                />
              )}
              <GreyText>
                审核开关打开: 企业会员注册后需平台审核; 审核开关关闭:
                企业会员注册后无需审核, 直接注册成功;
              </GreyText>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={19}>
            <FormItem
              {...formItemLayout}
              required={true}
              label="企业购商品审核"
            >
              {getFieldDecorator('enterpriseGoodsAuditFlag', {
                initialValue: setting.get('enterpriseGoodsAuditFlag') == 1
              })(
                <Switch
                  checked={setting.get('enterpriseGoodsAuditFlag') == 1}
                  onChange={(e) => {
                    this._modify({
                      field: 'enterpriseGoodsAuditFlag',
                      value: e ? 1 : 0
                    });
                    this.props.form.resetFields();
                  }}
                />
              )}
              <GreyText>
                开关打开: 商家新增企业购商品需平台审核; 开关关闭:
                商家新增企业购商品无需平台审核;
              </GreyText>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={19}>
            <FormItem
              {...formItemLayout}
              required={true}
              label="企业会员注册协议"
            >
              <UEditor
                ref={(UEditor) => {
                  refEditor((UEditor && UEditor.editor) || {});
                }}
                id="reg"
                height="320"
                content={setting.get('enterpriseCustomerRegisterContent')}
                insertImg={() => this._handleClick()}
                chooseImgs={chooseImgs.toJS()}
                imgType={imgType}
              />
            </FormItem>
          </Col>
        </Row>

        <AuthWrapper functionName="f_basicSetting_1">
          <div className="bar-button">
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </div>
        </AuthWrapper>
      </Form>
    );
  }

  _handleSubmit = (e) => {
    e.preventDefault();
    const form = this.props.form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      if (!errs) {
        this.props.relaxProps.saveIepSetting(values);
      }
    });
  };

  /**
   * 编辑editLogo
   * @param file
   * @param fileList
   * @private
   */
  _editLogo = ({ file, fileList }) => {
    //当所有图片都被删除时
    if (JSON.stringify(fileList).length == 2) {
      this._modify({ field: 'enterpriseCustomerLogo', value: '' });
      return;
    }

    if (file.status == 'error') {
      message.error('上传失败');
      return;
    }

    fileList = this._buildFileList(fileList);
    this._modify({
      field: 'enterpriseCustomerLogo',
      value: JSON.stringify(fileList)
    });
  };

  /**
   * 检查文件格式
   */
  _checkUploadFile = (size: number, file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：png
    if (fileName.endsWith('.png') || fileName.endsWith('.jpg')) {
      if (file.size <= size * 1024) {
        return true;
      } else {
        message.error('文件大小不能超过' + size + 'kb');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };

  _buildFileList = (fileList: Array<any>): Array<any> => {
    return fileList.map((file) => {
      return {
        uid: file.uid,
        status: file.status,
        url: file.response ? file.response[0] : file.url
      };
    });
  };

  /**
   * 调用图片库弹框
   * @private
   */
  _handleClick = () => {
    this.props.relaxProps.setVisible(10, 2);
  };

  /**
   * 修改设置信息
   *
   * @memberof settingForm
   */
  _modify = ({ field, value }) => {
    this.props.relaxProps.modifyEnterpriseSetting({ field, value });
  };
}

const styles = {
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  },
  alertBox: {
    marginLeft: 10
  },
  toolBox: {
    marginLeft: 10,
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  } as any
};
