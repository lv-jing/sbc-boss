import React from 'react';
import { Relax } from 'plume2';

import { UEditor, noop, isSystem } from 'qmkit';
import { Button } from 'antd';

@Relax
export default class AboutUsContext extends React.Component<any, any> {
  props: {
    relaxProps?: {
      // 关于我们内容
      context: string;
      imgType: number;

      // 关于我们, 列/值 设置
      fieldsValue: Function;
      // 上传图片弹框
      setVisible: Function;
      refEditor: Function;
      saveAboutUs: Function;
    };
  };

  static relaxProps = {
    context: 'context',
    imgType: 'imgType',

    fieldsValue: noop,
    setVisible: noop,
    refEditor: noop,
    saveAboutUs: noop
  };

  render() {
    const {
      context,
      imgType,

      refEditor,
      setVisible,
      saveAboutUs
    } = this.props.relaxProps;
    return (
      <div className="container">
        <UEditor
          key="about-us"
          ref={(UEditor) => {
            refEditor((UEditor && UEditor.editor) || {});
          }}
          id="about-us"
          height="640"
          content={context}
          insertImg={() => setVisible(1, 2)}
          chooseImgs={[]}
          imgType={imgType}
        />
        <div className="bar-button" key="button">
          <Button
            type="primary"
            htmlType="submit"
            onClick={isSystem(() => saveAboutUs())}
          >
            保存
          </Button>
        </div>
      </div>
    );
  }
}
