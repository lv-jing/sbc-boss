import React from 'react';
import PropTypes from 'prop-types';
import { Relax } from 'plume2';
import { noop, AuthWrapper } from 'qmkit';
import { Switch, message, Button, Alert, Form } from 'antd';
import Store from '../store';
import { checkAuth } from 'qmkit';
@Relax
export default class GoodsSetting extends React.Component<any, any> {
  _store: Store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  static relaxProps = {
    changeSwitch: noop,
    grouponFlag: 'grouponFlag',
    saveAudit: noop
  };

  render() {
    const { changeSwitch } = this.props.relaxProps;
    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          {/* <p>当前有{num}个商家参与</p> */}
          <Alert
            message=""
            description={
              <div>
                <p>1、拼团倒计时为24小时，超过后拼团失败;</p>
                <p>
                  2、拼团商品审核开关，开启后拼团商品需通过平台审核后才可生效;
                </p>
                <p>3、切换审核开关仅对切换后添加活动生效;</p>
              </div>
            }
            type="info"
          />
        </div>
        <label>拼团商品审核：</label>
        <Switch
          checkedChildren="开"
          unCheckedChildren="关"
          checked={this.props.relaxProps.grouponFlag}
          onChange={(value) => changeSwitch(value)}
        />
        <div className="bar-button">
          <AuthWrapper functionName="f_edit_groupon_switch">
            <div style={{ paddingTop: 5 }}>
              <Button type="primary" onClick={this._handleSubmit}>
                保存
              </Button>
            </div>
          </AuthWrapper>
        </div>
      </div>
    );
  }

  /**
   * 检查文件格式
   */
  _beforeUpload(file, size) {
    const isSupportImage =
      file.type === 'image/jpeg' ||
      file.type === 'image/gif' ||
      file.type == 'image/png';
    if (!isSupportImage) {
      message.error('只能上传jpg, png, gif类型的图片');
    }
    const isLt = file.size / 1024 < size;
    if (!isLt) {
      message.error(`图片大小不能超过${size}KB!`);
    }
    return isSupportImage && isLt;
  }

  /**
   * 改变图片
   */
  onImgChange = (key, { file, fileList }) => {
    switch (file.status) {
      case 'error':
        message.error('上传失败');
        break;
      case 'removed':
        this._store.fieldsValue(['basic', key], []);
        this.props.form.setFieldsValue({ [key]: null });
        break;
      default:
        let response = fileList[0].response;
        this.props.form.setFieldsValue({
          [key]: response ? response[0] : ''
        });
        this._store.fieldsValue(['basic', key], fileList);
    }
  };

  /**
   * 提交
   */
  _handleSubmit = () => {
    const { saveAudit } = this.props.relaxProps;
    if (!checkAuth('f_edit_groupon_poster')) {
      return;
    }
    saveAudit();
  };
}
