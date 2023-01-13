import React from 'react';
import { Relax } from 'plume2';
import { Modal, Alert, Form } from 'antd';
import GroupForm from './group-form';
import { noop } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const WrapperForm = Form.create({})(GroupForm as any);

@Relax
export default class GroupModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      modalType: any;
      modalVisible: boolean;
      toggleModal: Function;
      saveGroup: Function;
      toggleUpdate: Function;
      clearAreaIds: Function;
      clearArr: Function;
      clearForm: Function;
    };
  };

  static relaxProps = {
    form: {},
    modalType: 'modalType',
    modalVisible: 'modalVisible',
    toggleModal: noop,
    saveGroup: noop,
    toggleUpdate: noop,
    clearAreaIds: noop,
    clearArr: noop,
    clearForm: noop
  };

  render() {
    const { modalVisible, modalType } = this.props.relaxProps;
    return (
      <Modal
        maskClosable={false}
        title={modalType === 1 ? '新增自定义人群' : '编辑自定义人群'}
        visible={modalVisible}
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
        width={900}
        destroyOnClose={true}
      >
        <Alert
          message={
            <div>
              <p>
                请先选择您想设置的条件，再设置具体规则，同时满足所有条件的会员将会被归类入该人群，若某一条件的规则为多选，则满足其中一个规则即为满足该条件；
              </p>
              <p>
                所选择的统计时间范围不包含当天，消费次数和金额以付款成功的金额为准；
              </p>
            </div>
          }
          type="info"
        />
        <WrapperForm ref={(form) => (this._form = form)} />
      </Modal>
    );
  }

  /**
   * 提交
   */
  _handleSubmit = () => {
    this.props.relaxProps.toggleUpdate();
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs) => {
      if (!errs) {
        this.props.relaxProps.saveGroup();
      }
    });
  };

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const {
      clearAreaIds,
      toggleModal,
      clearArr,
      clearForm
    } = this.props.relaxProps;
    clearAreaIds();
    clearArr();
    clearForm();
    toggleModal();
  };
}
