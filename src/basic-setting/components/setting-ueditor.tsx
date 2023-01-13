import * as React from 'react';
import { Relax } from 'plume2';
import { IMap } from 'typings/globalType';
import { noop, UEditor, RCi18n } from 'qmkit';
import { List } from 'immutable';
import { Row, Col } from 'antd';

@Relax
export default class SettingUeditor extends React.Component<any, any> {
  props: {
    relaxProps?: {
      settings: IMap;
      chooseImgs: List<any>;
      imgType: number;
      refEditor: Function;
      setVisible: Function;
    };
  };

  static relaxProps = {
    chooseImgs: 'chooseImgs',
    imgType: 'imgType',
    settings: 'settings',
    refEditor: noop,
    setVisible: noop
  };

  render() {
    const { settings, refEditor, chooseImgs, imgType } = this.props.relaxProps;
    return (
      <div>
        <Row>
          <Col span={3}>
            <div
              style={{
                fontSize: 14,
                textAlign: 'left',
                color: 'rgba(0, 0, 0, 0.85)'
              }}
            >
              {`${RCi18n({ id: 'Setting.Member registration agreement' })}:`}
            </div>
          </Col>
          <Col span={19}>
            <UEditor
              ref={(UEditor) => {
                refEditor((UEditor && UEditor.editor) || {});
              }}
              id="reg"
              height="320"
              content={settings.get('registerContent')}
              insertImg={() => this._handleClick()}
              chooseImgs={chooseImgs.toJS()}
              imgType={imgType}
            />
          </Col>
        </Row>
      </div>
    );
  }

  /**
   * 调用图片库弹框
   * @private
   */
  _handleClick = () => {
    this.props.relaxProps.setVisible(10, 2);
  };
}
