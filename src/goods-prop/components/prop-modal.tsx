import { Modal, Form } from 'antd';
import { Relax } from 'plume2';
import * as React from 'react';
import { noop } from 'qmkit';
import PropForm from './prop-form';
import { IMap, IList } from 'typings/globalType';

const DetailForm = Form.create()(PropForm) as any;

@Relax
export default class PropModal extends React.Component {
  _form: any;
  props: {
    history?: any;
    relaxProps?: {
      modalTitle: string;
      modalVisible: boolean;
      editVisible: Function;
      onSubmit: Function;
      initDetailList: Function;
      oneProp: IMap;
      deleteList: IList;
      propName: string;
      deleteDetail: Function;
      onFormFieldChange: Function;
    };
  };

  static relaxProps = {
    modalTitle: 'modalTitle',
    modalVisible: 'modalVisible',
    editVisible: noop,
    onSubmit: noop,
    initDetailList: noop,
    oneProp: 'oneProp',
    deleteList: 'deleteList',
    propName: 'propName',
    deleteDetail: noop,
    onFormFieldChange: noop
  };

  render() {
    const {
      modalTitle,
      modalVisible,
      editVisible,
      onSubmit,
      initDetailList,
      oneProp,
      deleteList,
      propName,
      deleteDetail,
      onFormFieldChange
    } = this.props.relaxProps;
    if (!modalVisible) {
      return null;
    }
    return (
      <div>
         <Modal  maskClosable={false}
          title={modalTitle}
          visible={modalVisible}
          onOk={() => {
            this._form.validateFields(async (err) => {
              if (!err) {
                let param = {
                  modalTitle: modalTitle,
                  oneProp: oneProp.toJS(),
                  propName: propName,
                  deleteList: deleteList.toJS()
                };
                onSubmit(param);
              } else {
                this.setState({});
              }
            });
          }}
          onCancel={() => {
            initDetailList({});
            editVisible(false);
            deleteDetail([]);
            onFormFieldChange({ key: 'propName', value: '' });
          }}
          okText="确认"
          cancelText="取消"
        >
          {/**
           * 将父组件的prop传给子组件，包括form
           */}
          <DetailForm
            ref={(form) => (this._form = form)}
            {...this.props.relaxProps}
          />
        </Modal>
      </div>
    );
  }
}
