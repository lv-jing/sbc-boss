import { Modal } from 'antd';
import { Relax } from 'plume2';
import * as React from 'react';
import { noop, UEditor, Const } from 'qmkit';
import { List } from 'immutable';
@Relax
export default class ProtocolModal extends React.Component {
  _aaa: any;
  props: {
    history?: any;
    relaxProps?: {
      modalTitle: string;
      modalVisible: boolean;
      registerContent: string;
      enterContent: string;
      refRegisterEditor: Function;
      refEnterEditor: Function;
      setModalCancel: Function;
      setModalSubmit: Function;
      editEditor: Function;
      setVisible: Function;
      chooseImgs: List<any>;
      imgType: number;
    };
  };

  static relaxProps = {
    modalTitle: 'modalTitle',
    modalVisible: 'modalVisible',
    refRegisterEditor: noop,
    refEnterEditor: noop,
    registerContent: 'registerContent',
    enterContent: 'enterContent',
    setModalCancel: noop,
    setModalSubmit: noop,
    editEditor: noop,
    setVisible: noop,
    chooseImgs: 'chooseImgs',
    imgType: 'number'
  };

  render() {
    const {
      modalTitle,
      modalVisible,
      refRegisterEditor,
      refEnterEditor,
      enterContent,
      registerContent,
      chooseImgs,
      imgType
    } = this.props.relaxProps;
    return (
      <div>
        {modalVisible ? (
           <Modal  maskClosable={false}
            width={800}
            title={modalTitle}
            visible={modalVisible}
            onOk={() => {
              this._onOk(modalTitle);
            }}
            onCancel={() => {
              this._onCancel(modalTitle);
            }}
            okText="确认"
            cancelText="取消"
          >
            {modalTitle == Const.REGISTER_TITLE ? (
              <UEditor
                ref={(RegisterEditor) => {
                  this._aaa = RegisterEditor.editor;
                  if (RegisterEditor && RegisterEditor.editor) {
                    refRegisterEditor(RegisterEditor.editor);
                  }
                }}
                id="registerEditor"
                height="1000"
                content={registerContent}
                insertImg={() => this._registerClick()}
                chooseImgs={chooseImgs.toJS()}
                imgType={imgType}
              />
            ) : (
              <UEditor
                ref={(EnterEditor) => {
                  refEnterEditor((EnterEditor && EnterEditor.editor) || {});
                }}
                id="enterEditor"
                height="1000"
                content={enterContent}
                insertImg={() => this._enterClick()}
                chooseImgs={chooseImgs.toJS()}
                imgType={imgType}
              />
            )}
          </Modal>
        ) : null}
      </div>
    );
  }
  _onOk = (title) => {
    const { setModalSubmit } = this.props.relaxProps;
    setModalSubmit(title);
    this._onCancel(title);
  };
  _onCancel = (title) => {
    const { setModalCancel } = this.props.relaxProps;
    setModalCancel(title);
  };
  _registerClick = () => {
    this.props.relaxProps.editEditor('registerEditor');
    this.props.relaxProps.setVisible(10, 2);
  };

  _enterClick = () => {
    this.props.relaxProps.editEditor('enterEditor');
    this.props.relaxProps.setVisible(10, 2);
  };
}
