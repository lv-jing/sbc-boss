import React from 'react';
import { Store } from 'plume2';
import PropTypes from 'prop-types';
import { DatePicker, Form, Input, Select, message, Icon } from 'antd';
import { Tips, QMUpload, Const } from 'qmkit';
const FormItem = Form.Item;

const FILE_MAX_SIZE = 5 * 1024 * 1024;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

export default class EditForm extends React.Component<any, any> {
  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this.state = {
      confirmDirty: false,
      account: [],
      images: []
    };
    this._store = ctx['_plume$Store'];
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const _state = this._store.state();
    const offlineAccounts = _state.get('offlineAccounts');

    let accountId = {};
    let createTime = {};
    let comment = {};

    return (
      <Form>
        <FormItem {...formItemLayout} label="收款账户">
          {getFieldDecorator('accountId', {
            ...accountId,
            rules: [{ required: true, message: '请选择收款账户' }]
          })(
            <Select dropdownStyle={{ zIndex: 1053 }}>
              {this._renderBank(offlineAccounts)}
            </Select>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="收款日期">
          {getFieldDecorator('createTime', {
            ...createTime,
            rules: [{ required: true, message: '请选择收款日期' }]
          })(
            <DatePicker
              format={'YYYY-MM-DD 00:00:00'}
              disabledDate={this.disabledDate}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="附件信息">
          {getFieldDecorator('encloses', {
            rules: [
              {
                required: true,
                message: '请选择附件'
              }
            ]
          })(<Input type="hidden" />)}
          <QMUpload
            name="uploadFile"
            style={styles.box}
            onChange={this._editImages}
            action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
            fileList={this.state.images}
            listType={'picture-card'}
            accept={'.jpg,.jpeg,.png,.gif'}
            beforeUpload={this._checkUploadFile}
          >
            {this.state.images.length < 1 ? (
              <Icon type="plus" style={styles.plus} />
            ) : null}
          </QMUpload>
          <Tips title="上传订单付款凭证，如汇款单等；仅支持jpg、jpeg、png、gif格式，最多上传1张，大小不超过5M 。" />
        </FormItem>

        <FormItem {...formItemLayout} label="备注">
          {getFieldDecorator('comment', {
            ...comment,
            rules: [{ validator: this.checkComment }]
          })(<Input.TextArea />)}
        </FormItem>
      </Form>
    );
  }

  _renderBank(offlineAccounts) {
    return offlineAccounts.map((offlineAccount) => {
      return (
        <Option
          value={offlineAccount.get('accountId').toString()}
          key={offlineAccount.get('accountId')}
        >
          {this._renderBankName(offlineAccount)}
        </Option>
      );
    });
  }

  /**
   * 渲染银行名称
   * @param offlineAccount
   * @returns {string}
   * @private
   */
  _renderBankName(offlineAccount) {
    return `${offlineAccount.get('bankName')} ${offlineAccount.get('bankNo')}`;
  }

  checkComment = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }

    if (value.length > 100) {
      callback(new Error('备注请填写小于100字符'));
      return;
    }
    callback();
  };

  /**
   * 改变图片
   */
  _editImages = ({ file, fileList }) => {
    if (file.status == 'error') {
      message.error('上传失败');
    }
    // 规避有时没有生成缩略图导致页面图片展示不了的问题
    this.setState({ images: fileList });
    if (fileList[0]) {
      if (fileList[0].status == 'done') {
        this.props.form.setFieldsValue({
          encloses: fileList[0].response[0]
        });
      }
    } else {
      this.setState({ images: [] });
      this.props.form.setFieldsValue({ encloses: null });
    }
  };

  /**
   * 检查文件格式
   */
  _checkUploadFile = (file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= FILE_MAX_SIZE) {
        return true;
      } else {
        message.error('文件大小不能超过5M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };

  disabledDate(current) {
    // Can not select days before today and today
    return current && current.valueOf() > Date.now();
  }
}

const styles = {
  selectRoles: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
} as any;
