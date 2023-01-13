import React from 'react';
import { Relax } from 'plume2';
import { Button } from 'antd';
import { noop } from 'qmkit';

@Relax
export default class Toolbar extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onCreate: Function;
    };
  };

  static relaxProps = {
    onCreate: noop
  };

  render() {
    const { onCreate } = this.props.relaxProps;

    return (
      <div className="handle-bar">
        <Button type="primary" onClick={() => onCreate()}>
          新增等级
        </Button>
      </div>
    );
  }
}
