import React from 'react';
import { Row, Col, Icon, Button, Input, Form, Tooltip } from 'antd';

import PropTypes from 'prop-types';
import { Const, Tips, QMUpload, AuthWrapper, isSystem, RCi18n } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { message } from 'antd';
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

export default class settingForm extends React.Component<any, any> {
  form;

  _store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const _state = this._store.state();
    const settingForm = _state.get('settings');

    let pcWebsite = {
      initialValue: settingForm.get('pcWebsite')
    };
    let mobileWebsite = {
      initialValue: settingForm.get('mobileWebsite')
    };
    let supplierWebsite = {
      initialValue: settingForm.get('supplierWebsite')
    };

    const pcIco = settingForm.get('pcIco');
    const pcIcoImage = pcIco ? JSON.parse(pcIco) : [];
    const pcLogo = settingForm.get('pcLogo');
    const pcLogoImage = pcLogo ? JSON.parse(pcLogo) : [];
    const pcBanner = settingForm.get('pcBanner');
    const pcBannerImage = pcBanner ? JSON.parse(pcBanner) : [];
    return (
      <Form
        style={{ paddingBottom: 50, maxWidth: 900 }}
        onSubmit={isSystem(this._handleSubmit)}
      >
        <Row>
          <Col span={20}>
            <FormItem
              {...formItemLayout}
              label={RCi18n({ id: 'Setting.MallURL' })}
              hasFeedback
              required={true}
            >
              {getFieldDecorator('pcWebsite', {
                ...pcWebsite,
                rules: [
                  {
                    required: true,
                    message: `${RCi18n({
                      id: 'Setting.Please fill in the PC-side mall URL'
                    })}`
                  },
                  { validator: this.checkWebsite }
                ]
              })(<Input size="large" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <div style={styles.toolBox}>
              <Tooltip
                placement="right"
                title={RCi18n({ id: 'Setting.ClientPCSideOrderEntry' })}
              >
                <Icon style={{ color: '#999' }} type="exclamation-circle" />
              </Tooltip>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={20}>
            <FormItem
              {...formItemLayout}
              label={RCi18n({ id: 'Setting.Mobile mall URL' })}
              hasFeedback
              required={true}
            >
              {getFieldDecorator('mobileWebsite', {
                ...mobileWebsite,
                rules: [
                  {
                    required: true,
                    message: `${RCi18n({
                      id: 'Setting.Please fill in the mobile terminal mall URL'
                    })}`
                  },
                  { validator: this.checkWebsite }
                ]
              })(<Input size="large" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <div style={styles.toolBox}>
              <Tooltip
                placement="right"
                title={RCi18n({ id: 'Setting.ClientMobileOrderEntry' })}
              >
                <Icon style={{ color: '#999' }} type="exclamation-circle" />
              </Tooltip>
            </div>
          </Col>
        </Row>
        {/*zhanghao update 新增商家后台登录网址*/}
        <Row>
          <Col span={20}>
            <FormItem
              {...formItemLayout}
              label={RCi18n({ id: 'Setting.Merchant background login URL' })}
              hasFeedback
              required={false}
            >
              {getFieldDecorator('supplierWebsite', {
                ...supplierWebsite,
                rules: [
                  {
                    required: false,
                    message: `${RCi18n({
                      id: 'Setting.Please fill in the merchant backstage login URL'
                    })}`
                  },
                  { validator: this.checkWebsite }
                ]
              })(<Input size="large" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <div style={styles.toolBox}>
              <Tooltip
                placement="right"
                title={RCi18n({
                  id: 'Setting.Merchant background login address'
                })}
              >
                <Icon style={{ color: '#999' }} type="exclamation-circle" />
              </Tooltip>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={20}>
            <FormItem
              required={false}
              {...formItemLayout}
              label={RCi18n({ id: 'Setting.Mall web icon' })}
              hasFeedback
            >
              <div className="clearfix logoImg">
                <QMUpload
                  style={styles.box}
                  action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                  listType="picture-card"
                  name="uploadFile"
                  onChange={this._editIco}
                  fileList={pcIcoImage}
                  accept={'.ico'}
                  beforeUpload={this._checkIcoFile.bind(this, 10)}
                >
                  {pcIcoImage.length >= 1 ? null : (
                    <div>
                      <Icon type="plus" style={styles.plus} />
                    </div>
                  )}
                </QMUpload>
                {getFieldDecorator('pcIco', {
                  initialValue: pcIco
                })(<Input type="hidden" />)}
              </div>
              <Tips title={RCi18n({ id: 'Setting.MallWebIconHint' })} />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={20}>
            <FormItem
              required={false}
              {...formItemLayout}
              label={RCi18n({ id: 'Setting.Mall logo' })}
              hasFeedback
            >
              <div className="clearfix logoImg">
                <QMUpload
                  style={styles.box}
                  action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                  listType="picture-card"
                  name="uploadFile"
                  onChange={this._editPcLogo}
                  fileList={pcLogoImage}
                  accept={'.jpg,.jpeg,.png,.gif'}
                  beforeUpload={this._checkUploadFile.bind(this, 1)}
                >
                  {pcLogoImage.length >= 1 ? null : (
                    <div>
                      <Icon type="plus" style={styles.plus} />
                    </div>
                  )}
                </QMUpload>
                {getFieldDecorator('pcLogo', {
                  initialValue: pcLogo
                })(<Input type="hidden" />)}
              </div>
              <Tips title={RCi18n({ id: 'Setting.MallLogoHint' })} />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={20}>
            <FormItem
              {...formItemLayout}
              required={false}
              label={RCi18n({ id: 'Setting.PC mall login page banner' })}
              hasFeedback
            >
              <Row>
                <Col span={24}>
                  <div className="clearfix bannerImg">
                    <QMUpload
                      style={styles.box}
                      action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                      listType="picture-card"
                      name="uploadFile"
                      onChange={this._editPcBanners}
                      fileList={pcBannerImage}
                      accept={'.jpg,.jpeg,.png,.gif'}
                      beforeUpload={this._checkUploadFile.bind(this, 2)}
                    >
                      {pcBannerImage.length >= 5 ? null : (
                        <div>
                          <Icon type="plus" style={styles.plus} />
                        </div>
                      )}
                    </QMUpload>
                    {getFieldDecorator('pcBanner', {
                      initialValue: pcBanner
                    })(<Input type="hidden" />)}
                  </div>
                </Col>
              </Row>
              <Tips
                title={RCi18n({ id: 'Setting.PCMallLoginPageBannerHint' })}
              />
            </FormItem>
          </Col>
        </Row>

        <AuthWrapper functionName="f_basicSetting_1">
          <div className="bar-button">
            <Button type="primary" htmlType="submit">
              {RCi18n({ id: 'Setting.save' })}
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
        (this._store as any).editSetting(values);
      }
    });
  };

  /**
   * 编辑editIco
   * @param file
   * @param fileList
   * @private
   */
  _editIco = ({ file, fileList }) => {
    //当所有图片都被删除时
    if (JSON.stringify(fileList).length == 2) {
      this._store.settingFormChange('pcIco', '');
      return;
    }

    if (file.status == 'error') {
      message.error(RCi18n({ id: 'Setting.uploadfailed' }));
      return;
    }

    fileList = this._buildFileList(fileList);
    this._store.settingFormChange('pcIco', JSON.stringify(fileList));
  };

  /**
   * 编辑pcLogo
   * @param file
   * @param fileList
   * @private
   */
  _editPcLogo = ({ file, fileList }) => {
    //当所有图片都被删除时
    if (JSON.stringify(fileList).length == 2) {
      this._store.settingFormChange('pcLogo', '');
      return;
    }

    if (file.status == 'error') {
      message.error(RCi18n({ id: 'Setting.uploadfailed' }));
      return;
    }

    fileList = this._buildFileList(fileList);
    this._store.settingFormChange('pcLogo', JSON.stringify(fileList));
  };

  /**
   * 编辑pcBanners
   * @param file
   * @param fileList
   * @private
   */
  _editPcBanners = ({ file, fileList }) => {
    //当所有图片都被删除时
    if (JSON.stringify(fileList).length == 2) {
      this._store.settingFormChange('pcBanner', '');
      return;
    }

    if (file.status == 'error') {
      message.error(RCi18n({ id: 'Setting.uploadfailed' }));
      return;
    }

    fileList = this._buildFileList(fileList);
    this._store.settingFormChange('pcBanner', JSON.stringify(fileList));
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

    const pcWebsiteReg =
      /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
    if (!pcWebsiteReg.test(value)) {
      callback(
        new Error(RCi18n({ id: 'Setting.Please enter the correct URL' }))
      );
      return;
    }

    callback();
  };

  /**
   * 检查文件格式
   */
  _checkUploadFile = (size: number, file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= size * 1024 * 1024) {
        return true;
      } else {
        message.error(
          `${RCi18n({ id: 'Setting.File size cannot exceed' })}` + size + 'M'
        );
        return false;
      }
    } else {
      message.error(`${RCi18n({ id: 'Setting.File format error' })}`);
      return false;
    }
  };

  _checkIcoFile = (size: number, file) => {
    let fileName = file.name;
    fileName = fileName.toLowerCase();
    // 支持的图片格式：.ico
    if (fileName.endsWith('.ico')) {
      if (file.size <= 1024 * size) {
        return true;
      } else {
        message.error(
          `${RCi18n({ id: 'Setting.File size cannot exceed' })}` + size + 'kb'
        );
        return false;
      }
    } else {
      message.error(`${RCi18n({ id: 'Setting.File format error' })}`);
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
