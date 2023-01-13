import React from 'react';
import PropTypes from 'prop-types';
import { UEditor, AuthWrapper, checkAuth } from 'qmkit';
import { Form, message, Button } from 'antd';
import Store from '../store';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 21
  }
};

const formTailLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21, offset: 3 }
};

export default class RecruitSetting extends React.Component<any, any> {
  _store: Store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const store = this._store as any;
    const rule = store.state().get('rule');
    return (
      <Form
        className="login-form"
        style={{ paddingBottom: 50 }}
        onSubmit={this._handleSubmit}
      >
        <FormItem {...formItemLayout} label="规则说明">
          <UEditor
            ref={(UEditor) => {
              store.setRuleEditor((UEditor && UEditor.editor) || {});
            }}
            id="rule-desc"
            key="rule-desc"
            height="320"
            content={rule}
            // onContentChange={(val) => {
            //   savePosterRule(val)
            // }}
            insertImg={() => {
              store.setVisible(1, 2);
              //store.toggleModal();
              store.setActiveEditor('rule');
            }}
            chooseImgs={[]}
            imgType={store.state().get('imgType')}
            maximumWords={1000}
          />
        </FormItem>
        <div className="bar-button">
          <AuthWrapper functionName="f_edit_groupon_rule">
            <FormItem {...formTailLayout} style={{ paddingTop: 5 }}>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </FormItem>
          </AuthWrapper>
        </div>
      </Form>
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
        this._store.fieldsValue(['recruit', key], []);
        this.props.form.setFieldsValue({ [key]: null });
        break;
      default:
        let response = fileList[0].response;
        this.props.form.setFieldsValue({
          [key]: response ? response[0] : ''
        });
        this._store.fieldsValue(['recruit', key], fileList);
    }
  };

  /**
   * 保存拼团规则设置
   */
  _handleSubmit = (e) => {
    if (!checkAuth('f_edit_groupon_rule')) {
      return;
    }
    e.preventDefault();
    const form = this.props.form as WrappedFormUtils;
    form.validateFields(null, (errs) => {
      if (!errs) {
        this._store.confirmRule();
      }
    });
  };
}
