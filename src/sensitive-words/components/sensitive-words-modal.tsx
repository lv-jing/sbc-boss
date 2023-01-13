import * as React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input } from 'antd';
import { Relax } from 'plume2';
import { Map } from 'immutable';
import { IMap } from 'typings/globalType';
import {noop, Tips} from 'qmkit';
import Store from '../store';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const FormItem = Form.Item;
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

@Relax
export default class SensitiveWordsModal extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(SensitiveWordsModalForm as any);
  }

  props: {
    relaxProps?: {
      visible: boolean;
      closeModal: Function;
      formData: IMap;
      editFormData: Function;
      onSave: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    visible: 'visible',
    // 添加敏感词
    onSave: noop,
    // 修改form数据
    editFormData: noop,
    // form数据
    formData: 'formData',
    // 关闭弹框
    closeModal: noop
  };

  render() {
    const { visible, formData } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    if (!visible) {
      return null;
    }
    return (
       <Modal  maskClosable={false}
        title={formData.get('sensitiveId') ? '编辑' : '新增'}
         
        visible={visible}
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
      >
        <WrapperForm
          ref={(form) => (this._form = form)}
          relaxProps={this.props.relaxProps}
        />
      </Modal>
    );
  }

  /**
   * 提交
   */
  _handleSubmit = () => {
    const form = this._form as WrappedFormUtils;

    form.validateFields(null, (errs) => {
      if (!errs) {
        //提交
        const { onSave, formData } = this.props.relaxProps;
        if (formData.get('sensitiveWords')) {
          onSave();
        }
      }
    });
  };

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { closeModal } = this.props.relaxProps;
    closeModal();
  };
}

class SensitiveWordsModalForm extends React.Component<any, any> {
  _store: Store;

  props: {
    relaxProps?: {
      visible: boolean;
      images: any;
      closeModal: Function;
      formData: IMap;
      editFormData: Function;
    };
    form;
  };

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const {
      sensitiveWords,
      sensitiveId
    } = this.props.relaxProps.formData.toJS();
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form errorFeedback">
        <FormItem {...formItemLayout} label="敏感词">
          {sensitiveId
            ? getFieldDecorator('sensitiveWords', {
                rules: [
                  { required: true, whitespace: true, message: '请输入敏感词' },
                  {
                    max: 30,
                    message: '最多30字符'
                  }
                ],
                onChange: this._changeSensitiveWords,
                initialValue: sensitiveWords
              })(<Input />)
            : getFieldDecorator('sensitiveWords', {
                rules: [
                  { required: true, whitespace: true, message: '请输入敏感词' }
                ],
                onChange: this._changeSensitiveWords,
                initialValue: sensitiveWords
              })(<Input.TextArea rows={10} cols={35}/>)}
          {
            !sensitiveId && <Tips title="添加多个时请换行进行添加，一次最多支持添加100个" />
          }
        </FormItem>
      </Form>
    );
  }

  /**
   * 修改品牌名称
   */
  _changeSensitiveWords = (e) => {
    const { editFormData } = this.props.relaxProps;
    editFormData(Map({ sensitiveWords: e.target.value }));
  };
}
