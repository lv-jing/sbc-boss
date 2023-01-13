import * as React from 'react';
import { List } from 'immutable';
import { Row, Col } from 'antd';
import { noop } from 'qmkit';
import UEditor from '../../../web_modules/qmkit/ueditor/Ueditor';
import styled from "styled-components";
import {Relax} from "plume2";
import { IMap } from 'typings/globalType';

const GreyText = styled.p`
  color: #999999;
`;

@Relax
export default class SettingUEditor extends React.Component<any, any> {
  props: {
    relaxProps?: {
      chooseImgs: List<any>;
      imgType: number;
      refDetailEditor: Function;
      setVisible: Function;
      isIntroFilled: boolean;
      growthValueConfig:IMap;
    };
  };

  static relaxProps = {
    chooseImgs: 'chooseImgs',
    imgType: 'imgType',
    refDetailEditor: noop,
    setVisible: noop,
    isIntroFilled: 'isIntroFilled',
    growthValueConfig:'growthValueConfig'
  };

  render() {
    const { growthValueConfig,isIntroFilled,chooseImgs,imgType,refDetailEditor } = this.props.relaxProps;

    return (
      <div>
        <Row style={{ marginTop: 30 }}>
          <Col span={2} style={{ marginLeft: '2%' }}>
            <div
              style={{
                marginRight: 20,
                fontSize: 14,
                textAlign: 'right',
                color: 'rgba(0, 0, 0, 0.85)'
              }}
            >
                <span
                  style={{
                    marginRight: 4,
                    fontFamily: 'SimSun',
                    lineHeight: 1,
                    color: '#f5222d'
                  }}>*</span>成长值说明:
            </div>
          </Col>
          <Col span={20}>
            <UEditor
              ref={(UEditor) => {
                refDetailEditor(
                  (UEditor && UEditor.editor) || {}
                );
              }}
              id="remark"
              height="320"
              content={growthValueConfig.get('remark')}
              insertImg={() => this._handleClick()}
              chooseImgs={chooseImgs.toJS()}
              imgType={imgType}
            />
            {!isIntroFilled ? (
              <div style={{ color: '#f5222d' }}>请填写成长值说明</div>
            ) : null}
            <GreyText>请编辑成长值规则介绍，用于前端成长值规则说明</GreyText>
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
