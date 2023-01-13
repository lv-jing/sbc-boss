import { Relax } from 'plume2';
import * as React from 'react';
import { fromJS } from 'immutable';
import { Form, Button, Icon, message, Input } from 'antd';

import {
  noop,
  Tips,
  Const,
  ValidConst,
  QMMethod,
  QMUpload,
  history,
  OneAuthWrapper
} from 'qmkit';

const formItemLayout = {
  labelCol: {
    span: 6,
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    span: 18,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

const FILE_MAX_SIZE = 2 * 1024 * 1024;

/**
 * 增票资质
 */
@Relax
export default class InvoiceSet extends React.Component<any, any> {
  _invoiceSetForm: any;

  props: {
    type?: string;
    relaxProps?: {
      setValue: Function;
      onInvoiceFormChange: Function;
      invoiceForm: any;
      showSwitch: boolean;
      showInvoiceForm: boolean;
      saveInvoice: Function;
    };
  };

  static relaxProps = {
    setValue: noop,
    onInvoiceFormChange: noop,
    invoiceForm: 'invoiceForm',
    showSwitch: 'showSwitch',
    showInvoiceForm: 'showInvoiceForm',
    saveInvoice: noop
  };

  constructor(props) {
    super(props);
    this._invoiceSetForm = Form.create()(InvoiceSetForm);
  }

  render() {
    let InvoiceSetForm = this._invoiceSetForm;

    return (
      <div>
        <div>
          <div style={{ paddingBottom: 10, color: '#999999' }}>
            只可保存一条增票资质。
          </div>

          <InvoiceSetForm
            ref="_invoiceSetForm"
            type={this.props.type}
            {...{ relaxProps: this.props.relaxProps }}
          />
        </div>
      </div>
    );
  }
}

class InvoiceSetForm extends React.Component<any, any> {
  render() {
    const {
      form: { getFieldDecorator },
      relaxProps: { onInvoiceFormChange, invoiceForm, saveInvoice }
    } = this.props;

    let businessLicenseImg = invoiceForm.get('businessLicenseImg')
      ? invoiceForm.get('businessLicenseImg').toJS()
      : null;
    let taxpayerIdentificationImg = invoiceForm.get('taxpayerIdentificationImg')
      ? invoiceForm.get('taxpayerIdentificationImg').toJS()
      : null;

    return (
      <Form>
        <table>
          <tbody>
            <tr>
              <td>
                <Form.Item
                  {...formItemLayout}
                  label="单位全称："
                  hasFeedback={true}
                >
                  {getFieldDecorator('companyName', {
                    initialValue: invoiceForm.get('companyName'),
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '请填写单位全称'
                      },
                      {
                        validator: (rule, value, callback) => {
                          QMMethod.validatorMinAndMax(
                            rule,
                            value,
                            callback,
                            '单位全称',
                            1,
                            50
                          );
                        }
                      }
                    ]
                  })(
                    <Input
                      onChange={(e) =>
                        onInvoiceFormChange({
                          field: 'companyName',
                          value: (e.target as any).value
                        })
                      }
                    />
                  )}
                </Form.Item>
              </td>
              <td>
                <Form.Item
                  {...formItemLayout}
                  label="纳税人识别号："
                  hasFeedback={true}
                >
                  {getFieldDecorator('taxpayerNumber', {
                    initialValue: invoiceForm.get('taxpayerNumber'),
                    rules: [
                      {
                        required: true,
                        message: '请填写纳税人识别号'
                      },
                      {
                        pattern: ValidConst.tax,
                        message: '请输入正确的纳税人识别号且必须15-20字符'
                      }
                    ]
                  })(
                    <Input
                      onChange={(e) =>
                        onInvoiceFormChange({
                          field: 'taxpayerNumber',
                          value: (e.target as any).value
                        })
                      }
                    />
                  )}
                </Form.Item>
              </td>
            </tr>
            <tr>
              <td>
                <Form.Item
                  {...formItemLayout}
                  label="注册电话："
                  hasFeedback={true}
                >
                  {getFieldDecorator('companyPhone', {
                    initialValue: invoiceForm.get('companyPhone'),
                    rules: [
                      {
                        required: true,
                        message: '请填写注册电话'
                      },
                      {
                        pattern: ValidConst.telephone,
                        message: '请输入正确的注册电话'
                      }
                    ]
                  })(
                    <Input
                      onChange={(e) =>
                        onInvoiceFormChange({
                          field: 'companyPhone',
                          value: (e.target as any).value
                        })
                      }
                    />
                  )}
                </Form.Item>
              </td>
              <td>
                <Form.Item
                  {...formItemLayout}
                  label="注册地址："
                  hasFeedback={true}
                >
                  {getFieldDecorator('companyAddress', {
                    initialValue: invoiceForm.get('companyAddress'),
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '请填写注册地址'
                      },
                      {
                        validator: (rule, value, callback) => {
                          QMMethod.validatorMinAndMax(
                            rule,
                            value,
                            callback,
                            '注册地址',
                            5,
                            60
                          );
                        }
                      }
                    ]
                  })(
                    <Input
                      onChange={(e) =>
                        onInvoiceFormChange({
                          field: 'companyAddress',
                          value: (e.target as any).value
                        })
                      }
                    />
                  )}
                </Form.Item>
              </td>
            </tr>
            <tr>
              <td>
                <Form.Item
                  {...formItemLayout}
                  label="银行基本户号："
                  hasFeedback={true}
                >
                  {getFieldDecorator('bankNo', {
                    initialValue: invoiceForm.get('bankNo'),
                    rules: [
                      {
                        required: true,
                        message: '请填写银行基本户号'
                      },
                      {
                        pattern: ValidConst.bankNumber,
                        message: '请输入正确的银行基本户号且必须为1-30位数字'
                      }
                    ]
                  })(
                    <Input
                      onChange={(e) =>
                        onInvoiceFormChange({
                          field: 'bankNo',
                          value: (e.target as any).value
                        })
                      }
                    />
                  )}
                </Form.Item>
              </td>
              <td>
                <Form.Item
                  {...formItemLayout}
                  label="开户银行："
                  required={true}
                  hasFeedback={true}
                >
                  {getFieldDecorator('bankName', {
                    initialValue: invoiceForm.get('bankName'),
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '请填写开户银行'
                      },
                      {
                        validator: (rule, value, callback) => {
                          QMMethod.validatorMinAndMax(
                            rule,
                            value,
                            callback,
                            '开户银行',
                            1,
                            50
                          );
                        }
                      }
                    ]
                  })(
                    <Input
                      onChange={(e) =>
                        onInvoiceFormChange({
                          field: 'bankName',
                          value: (e.target as any).value
                        })
                      }
                    />
                  )}
                </Form.Item>
              </td>
            </tr>
            <tr>
              <td>
                <Form.Item
                  {...formItemLayout}
                  label="营业执照复印件："
                  required={true}
                  hasFeedback={true}
                >
                  {getFieldDecorator('businessLicenseImg', {
                    initialValue: businessLicenseImg,
                    rules: [
                      {
                        validator: (_rule, _value, callback) => {
                          if (!businessLicenseImg) {
                            callback('请上传营业执照复印件');
                            return;
                          }

                          callback();
                        }
                      }
                    ]
                  })(
                    <div>
                      <QMUpload
                        name="uploadFile"
                        style={styles.box}
                        onChange={({ file, fileList }) =>
                          this._editImages(file, fileList, 'businessLicenseImg')
                        }
                        action={
                          Const.HOST + '/uploadResource?resourceType=IMAGE'
                        }
                        fileList={businessLicenseImg}
                        listType={'picture-card'}
                        accept={'.jpg,.png,.gif,.jpeg'}
                        beforeUpload={this._checkUploadFile}
                      >
                        {!businessLicenseImg ||
                        businessLicenseImg.length < 1 ? (
                          <Icon type="plus" style={styles.plus} />
                        ) : null}
                      </QMUpload>
                      <Tips title="仅支持JPG，GIF，PNG，JPEG图片文件，且需小于2M，最多上传1张" />
                    </div>
                  )}
                </Form.Item>
              </td>
              <td>
                <Form.Item
                  {...formItemLayout}
                  label="一般纳税人认证资格复印件："
                  required={true}
                  hasFeedback={true}
                >
                  {getFieldDecorator('taxpayerIdentificationImg', {
                    initialValue: taxpayerIdentificationImg,
                    rules: [
                      {
                        validator: (_rule, _value, callback) => {
                          if (!taxpayerIdentificationImg) {
                            callback('请上传一般纳税人认证资格复印件');
                            return;
                          }

                          callback();
                        }
                      }
                    ]
                  })(
                    <div>
                      <QMUpload
                        name="uploadFile"
                        style={styles.box}
                        onChange={({ file, fileList }) =>
                          this._editImages(
                            file,
                            fileList,
                            'taxpayerIdentificationImg'
                          )
                        }
                        action={
                          Const.HOST + '/uploadResource?resourceType=IMAGE'
                        }
                        fileList={taxpayerIdentificationImg}
                        listType={'picture-card'}
                        accept={'.jpg,.png,.gif,.jpeg'}
                        beforeUpload={this._checkUploadFile}
                      >
                        {!taxpayerIdentificationImg ||
                        taxpayerIdentificationImg.length < 1 ? (
                          <Icon type="plus" style={styles.plus} />
                        ) : null}
                      </QMUpload>
                      <Tips title="仅支持JPG，GIF，PNG，JPEG图片文件，且需小于2M，最多上传1张" />
                    </div>
                  )}
                </Form.Item>
              </td>
            </tr>
          </tbody>
        </table>
        <OneAuthWrapper
          functionName={
            'f_customer_detail_edit,f_enterprise_customer_detail_edit'
          }
        >
          <div
            className={this.props.type === 'modal' ? 'btn-wrap' : 'bar-button'}
          >
            <Button
              type="primary"
              onClick={() => saveInvoice(this.props.form)}
              style={{ marginRight: 10 }}
            >
              保存
            </Button>
            {!this.props.type && (
              <Button onClick={this._cancel} style={{ marginLeft: 10 }}>
                取消
              </Button>
            )}
          </div>
        </OneAuthWrapper>
      </Form>
    );
  }

  /**
   * 改变图片
   */
  _editImages = (file, fileList, field) => {
    if (file.status == 'error') {
      message.error('上传失败');
    }

    if (file.status == 'done') {
      if (field == 'businessLicenseImg') {
        this.props.form.setFields({ businessLicenseImg: { errors: null } });
      } else if (field == 'taxpayerIdentificationImg') {
        this.props.form.setFields({
          taxpayerIdentificationImg: { errors: null }
        });
      }
    }

    const { onInvoiceFormChange } = this.props.relaxProps;
    onInvoiceFormChange({
      field: field,
      value: fileList.length > 0 ? fromJS(fileList) : null
    });
  };

  /**
   * 检查文件格式
   */
  _checkUploadFile = (file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif') ||
      fileName.endsWith('.jpeg')
    ) {
      if (file.size < FILE_MAX_SIZE) {
        return true;
      } else {
        message.error('文件大小必须小于2M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };

  _cancel = () => {
    history.push('/customer-list');
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
  }
};
