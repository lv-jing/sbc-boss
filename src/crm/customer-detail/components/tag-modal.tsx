import React from 'react';
import { Relax } from 'plume2';
import PropTypes from 'prop-types';
import { Modal, Form } from 'antd';
import { noop } from 'qmkit';
import TagForm from './tag-form';

const WrapperForm = Form.create({})(TagForm as any);

@Relax
export default class TagModal extends React.Component<any, any> {
  _form;
  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  props: {
    relaxProps?: {
      tagModalVisible: boolean;
      toggleTagModal: Function;
      customerId: string;
      initBaseInfo: Function;
      updateTag: Function;
    };
  };

  static relaxProps = {
    toggleTagModal: noop,
    tagModalVisible: 'tagModalVisible',
    customerId: 'customerId',
    initBaseInfo: noop,
    updateTag: noop
  };
  constructor(props) {
    super(props);
  }

  render() {
    const { tagModalVisible } = this.props.relaxProps;
    return (
       <Modal  maskClosable={false}
        title={'设置会员标签'}
         
        visible={tagModalVisible}
        onCancel={this._handleModelCancel}
        footer={null}
        width={500}
        destroyOnClose={true}
      >
        <WrapperForm ref={(form) => (this._form = form)} />
      </Modal>
    );
  }

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    this.props.relaxProps.toggleTagModal();
    this._form.validateFields(null, (errs) => {
      if (!errs) {
        this.props.relaxProps.updateTag(this._form);
      }
    });
  };
}
