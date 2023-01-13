import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { noop } from 'qmkit';
import { IMap } from 'typings/globalType';
import CouponEditForm from './coupon-edit-Form';

const EditFormWrapper = Form.create()(CouponEditForm) as any;

@Relax
export default class CouponEditModal extends React.Component<any, any> {
  _form;

  props: {
    relaxProps?: {
      couponVisible: boolean;
      formData: IMap;
      editCouponFormData: Function;
      onCouponSave: Function;
      closeCouponModal: Function;
    };
  };

  static relaxProps = {
    couponVisible: 'couponVisible',
    formData: 'formData',
    editCouponFormData: noop,
    onCouponSave: noop,
    closeCouponModal: noop
  };

  render() {
    const { couponVisible } = this.props.relaxProps;
    return (
       <Modal  maskClosable={false}
        title={'编辑'}
        width={600}
         
        visible={couponVisible}
        onCancel={this._onCancel}
        onOk={this._onOk}
      >
        <EditFormWrapper
          ref={(form) => (this._form = form)}
          relaxProps={this.props.relaxProps}
        />
      </Modal>
    );
  }

  /**
   * 提交表单
   */
  _onOk = () => {
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs) => {
      if (!errs) {
        //无任何表单验证错误,则提交
        const { onCouponSave } = this.props.relaxProps;
        onCouponSave();
      }
    });
  };

  /**
   * 关闭弹框
   */
  _onCancel = () => {
    const { closeCouponModal } = this.props.relaxProps;
    closeCouponModal();
  };
}
