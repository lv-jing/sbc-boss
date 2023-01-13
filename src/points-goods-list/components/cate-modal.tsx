import * as React from 'react';
import { Form, Modal } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { Relax } from 'plume2';
import { noop } from 'qmkit';
import { IMap } from 'typings/globalType';
import CateModalForm from './cate-modal-form';

const WrapperCateForm = Form.create()(CateModalForm) as any;

@Relax
export default class CateModal extends React.Component<any, any> {
  _form;

  props: {
    relaxProps?: {
      modalVisible: boolean;
      isAdd: boolean;
      modal: Function;
      formData: IMap;
      editCateFormData: Function;
      doAdd: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalVisible: 'modalVisible',
    //是否是新增分类操作
    isAdd: 'isAdd',
    modal: noop, // 关闭弹窗
    formData: 'formData',
    editCateFormData: noop, //修改from表单数据
    doAdd: noop
  };

  render() {
    const { modalVisible, isAdd } = this.props.relaxProps;
    if (!modalVisible) {
      return null;
    }
    return (
       <Modal  maskClosable={false}
        title={isAdd ? '新增' : '编辑'}
         
        visible={modalVisible}
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
        width={900}
      >
        <WrapperCateForm
          ref={(form) => (this._form = form)}
          relaxProps={this.props.relaxProps}
        />
      </Modal>
    );
  }

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    this.props.relaxProps.modal();
  };

  /**
   * 提交
   */
  _handleSubmit = () => {
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs) => {
      if (!errs) {
        this.props.relaxProps.doAdd();
      } else {
        this.setState({});
      }
    });
  };
}
