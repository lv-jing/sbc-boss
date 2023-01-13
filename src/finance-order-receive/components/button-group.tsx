import React from 'react';
import { Relax } from 'plume2';
import { Button, Popconfirm, Menu } from 'antd';
import { AuthWrapper, noop } from 'qmkit';
import { List } from 'immutable';

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onBatchConfirm: Function;
      onBatchDestory: Function;
      selected: List<string>;
    };
  };

  static relaxProps = {
    onBatchDelete: noop,
    selected: [],
    onBatchConfirm: noop,
    onBatchDestory: noop,
    onAdd: noop
  };

  render() {
    const { onBatchConfirm } = this.props.relaxProps;

    return (
      <div className="handle-bar">
        <AuthWrapper functionName="fOrderDetail003">
          <Popconfirm
            title="确定批量确认收款？"
            onConfirm={() => {
              onBatchConfirm();
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button type="primary">批量确认</Button>
          </Popconfirm>
        </AuthWrapper>
      </div>
    );
  }
  _menu = () => {
    const { onBatchDestory, onBatchConfirm } = this.props.relaxProps;
    return (
      <Menu>
        <Menu.Item>
          <Popconfirm
            title="确定批量确认收款？"
            onConfirm={() => {
              onBatchConfirm();
            }}
            okText="确定"
            cancelText="取消"
          >
            <a href="javascript:void(0);">批量确认</a>
          </Popconfirm>
        </Menu.Item>
        <Menu.Item>
          <Popconfirm
            title="确定批量作废收款记录？"
            onConfirm={() => {
              onBatchDestory();
            }}
            okText="确定"
            cancelText="取消"
          >
            <a href="javascript:void(0);">批量作废</a>
          </Popconfirm>
        </Menu.Item>
      </Menu>
    );
  };
}
