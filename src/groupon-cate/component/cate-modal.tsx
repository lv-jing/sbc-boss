import * as React from 'react';
import { Modal, Form, Input } from 'antd';
import { Relax } from 'plume2';
import { noop, QMMethod } from 'qmkit';
import { IMap } from 'typings/globalType';
import { Map } from 'immutable';
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
export default class CateModal extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(CateModalForm as any);
  }

  props: {
    relaxProps?: {
      modalVisible: boolean;
      formData: IMap;
      isAdd: boolean;
      doAdd: Function;
      editFormData: Function;
      showModal: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalVisible: 'modalVisible',
    // 类目信息
    formData: 'formData',
    //是否是新增分类操作
    isAdd: 'isAdd',
    // 添加类目
    doAdd: noop,
    // 修改类目
    editFormData: noop,
    // 关闭弹窗
    showModal: noop
  };

  render() {
    const { modalVisible, isAdd } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    
    if (!modalVisible) {
      return null;
    }
    
    return (
       <Modal  maskClosable={false}
        title={isAdd ? '新增拼团分类' : '编辑拼团分类'}
         
        visible={modalVisible}
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
        const { doAdd, formData } = this.props.relaxProps;
        //提交
        if (formData.get('grouponCateName')) {
          doAdd();
        }
      } else {
        this.setState({});
      }
    });
  };

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { showModal } = this.props.relaxProps;
    showModal();
  };
}

class CateModalForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      formData: IMap;

      closeModal: Function;
      editFormData: Function;
    };
    form;
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { formData } = this.props.relaxProps;
    const grouponCateName = formData.get('grouponCateName');
    const { getFieldDecorator } = this.props.form;

    return (
      <Form className="login-form">
        <FormItem {...formItemLayout} label="分类名称" hasFeedback>
          {getFieldDecorator('grouponCateName', {
            rules: [
              { required: true, whitespace: true, message: '请填写分类名称' },
              { max: 10, message: '最多10字符' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '分类名称');
                }
              }
            ],
            initialValue: grouponCateName,
            onChange: this._changeCateName
          })(<Input placeholder="请填写分类名称" />)}
        </FormItem>
      </Form>
    );
  }

  /**
   * 修改分类名称
   */
  _changeCateName = (e) => {
    const { editFormData } = this.props.relaxProps;
    editFormData(Map({ grouponCateName: e.target.value }));
  };
}
