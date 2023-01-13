import React from 'react';
import { Row, Col } from 'antd';
import { noop, UEditor } from 'qmkit';
import { Relax } from 'plume2';
import { List } from 'immutable';

@Relax
export default class settingSupUEditor extends React.Component<any, any> {
  props: {
    relaxProps?: {
      refSupDetailEditor: Function;
      supplierContent: string;
      openModal: Function;
      chooseImgs: List<any>;
      imgType: number;
      setVisible: Function;
      editEditor: Function;
      refSupRegisterEditor: Function;
      supplierRegisterContent: string;
      refSupEnterEditor: Function;
      supplierEnterContent: string;
    };
  };

  static relaxProps = {
    refSupDetailEditor: noop,
    supplierContent: 'supplierContent',
    openModal: noop,
    chooseImgs: 'chooseImgs',
    imgType: 'imgType',
    setVisible: noop,
    editEditor: noop,
    refSupRegisterEditor: noop,
    supplierRegisterContent: 'supplierRegisterContent',
    refSupEnterEditor: noop,
    supplierEnterContent: 'supplierEnterContent'
  };
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div style={{ marginBottom: 30 }}>
          <Row>
            <Col span={4}>
              <div
                style={{
                  marginRight: 10,
                  fontSize: 14,
                  textAlign: 'right',
                  color: 'rgba(0, 0, 0, 0.85)'
                }}
              >
                自定义区:
              </div>
            </Col>
            <Col span={20}>
              <UEditor
                ref={(UEditor) => {
                  this.props.relaxProps.refSupDetailEditor(
                    (UEditor && UEditor.editor) || {}
                  );
                }}
                id="supplier"
                height="320"
                content={this.props.relaxProps.supplierContent}
                insertImg={() => this._handleClick()}
                chooseImgs={this.props.relaxProps.chooseImgs.toJS()}
                imgType={this.props.relaxProps.imgType}
              />
            </Col>
          </Row>
        </div>
        <div style={{ marginBottom: 30 }}>
          <Row>
            <Col span={4}>
              <div
                style={{
                  marginRight: 10,
                  fontSize: 14,
                  textAlign: 'right',
                  color: 'rgba(0, 0, 0, 0.85)'
                }}
              >
                商家注册协议:
              </div>
            </Col>
            <Col span={20}>
              <UEditor
                ref={(RegisterEditor) => {
                  if (RegisterEditor && RegisterEditor.editor) {
                    this.props.relaxProps.refSupRegisterEditor(
                      RegisterEditor.editor
                    );
                  }
                }}
                id="supplierRegisterEditor"
                height="320"
                content={this.props.relaxProps.supplierRegisterContent}
                insertImg={() => this._registerClick()}
                chooseImgs={this.props.relaxProps.chooseImgs.toJS()}
                imgType={this.props.relaxProps.imgType}
              />
              {/*<Button onClick={() => {this._protocol(Const.REGISTER_TITLE)}}>编辑商家注册协议</Button>*/}
            </Col>
          </Row>
        </div>
        <div style={{ marginBottom: 30 }}>
          <Row>
            <Col span={4}>
              <div
                style={{
                  marginRight: 10,
                  fontSize: 14,
                  textAlign: 'right',
                  color: 'rgba(0, 0, 0, 0.85)'
                }}
              >
                商家入驻协议:
              </div>
            </Col>
            <Col span={20}>
              <Row>
                <Col span={24}>
                  <div>
                    <UEditor
                      ref={(EnterEditor) => {
                        this.props.relaxProps.refSupEnterEditor(
                          (EnterEditor && EnterEditor.editor) || {}
                        );
                      }}
                      id="supplierEnterEditor"
                      height="320"
                      content={this.props.relaxProps.supplierEnterContent}
                      insertImg={() => this._enterClick()}
                      chooseImgs={this.props.relaxProps.chooseImgs.toJS()}
                      imgType={this.props.relaxProps.imgType}
                    />
                    {/*<Button onClick={() =>{this._protocol(Const.ENTER_TITLE)}}>编辑商家入驻协议</Button>*/}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  _protocol = (title) => {
    const { openModal } = this.props.relaxProps;
    openModal(title);
  };
  /**
   * 调用图片库弹框
   * @private
   */
  _handleClick = () => {
    this.props.relaxProps.editEditor('supplier');
    this.props.relaxProps.setVisible(10, 2);
  };

  _registerClick = () => {
    this.props.relaxProps.editEditor('registerSupEditor');
    this.props.relaxProps.setVisible(10, 2);
  };

  _enterClick = () => {
    this.props.relaxProps.editEditor('enterSupEditor');
    this.props.relaxProps.setVisible(10, 2);
  };
}
