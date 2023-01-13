import * as React from 'react';
import { Relax } from 'plume2';
import { history } from 'qmkit';
import { Button } from 'antd';

@Relax
export default class Foot extends React.Component<any, any> {
  props: {
    relaxProps?: {
      //开始时间
      beginTime: string;
      //结束时间
      endTime: string;
      //明细种类
      kind: string;
    };
  };

  static relaxProps = {
    beginTime: 'beginTime',
    endTime: 'endTime',
    kind: 'kind'
  };

  render() {
    return (
      <div className="bar-button">
        <Button
          type="primary"
          style={{ marginRight: 10 }}
          onClick={this._goBack}
        >
          返回
        </Button>
      </div>
    );
  }

  _goBack = () => {
    history.push({
      pathname: '/finance-manage-check',
      state: { kind: this.props.relaxProps.kind }
    });
  };
}
