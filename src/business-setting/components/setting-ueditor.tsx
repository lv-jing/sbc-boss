import React from 'react';
import { Row, Col } from 'antd';
import { noop, UEditor } from 'qmkit';
import { Relax } from 'plume2';
import { List } from 'immutable';

@Relax
export default class settingUEditor extends React.Component<any, any> {
  props: {
    relaxProps?: {
      refDetailEditor: Function;
      businessContent: string;
      openModal: Function;
      chooseImgs: List<any>;
      imgType: number;
      setVisible: Function;
      editEditor: Function;
      refRegisterEditor: Function;
      registerContent: string;
      refEnterEditor: Function;
      enterContent: string;
    };
  };

  static relaxProps = {
    refDetailEditor: noop,
    businessContent: 'businessContent',
    openModal: noop,
    chooseImgs: 'chooseImgs',
    imgType: 'imgType',
    setVisible: noop,
    editEditor: noop,
    refRegisterEditor: noop,
    registerContent: 'registerContent',
    refEnterEditor: noop,
    enterContent: 'enterContent'
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
                  this.props.relaxProps.refDetailEditor(
                    (UEditor && UEditor.editor) || {}
                  );
                }}
                id="business"
                height="320"
                content={this.props.relaxProps.businessContent}
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
                供应商注册协议:
              </div>
            </Col>
            <Col span={20}>
              <UEditor
                ref={(RegisterEditor) => {
                  if (RegisterEditor && RegisterEditor.editor) {
                    this.props.relaxProps.refRegisterEditor(
                      RegisterEditor.editor
                    );
                  }
                }}
                id="registerEditor"
                height="320"
                content={this.props.relaxProps.registerContent}
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
                供应商入驻协议:
              </div>
            </Col>
            <Col span={20}>
              <Row>
                <Col span={24}>
                  <div>
                    <UEditor
                      ref={(EnterEditor) => {
                        this.props.relaxProps.refEnterEditor(
                          (EnterEditor && EnterEditor.editor) || {}
                        );
                      }}
                      id="enterEditor"
                      height="320"
                      content={this.props.relaxProps.enterContent}
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
    this.props.relaxProps.editEditor('business');
    this.props.relaxProps.setVisible(10, 2);
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
