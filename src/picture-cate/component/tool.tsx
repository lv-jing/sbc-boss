import * as React from 'react';
import { Relax } from 'plume2';
import { Button } from 'antd';
import { noop } from 'qmkit';

@Relax
export default class Tool extends React.Component<any, any> {
  props: {
    relaxProps?: {
      showAddModal: Function;
    };
  };

  static relaxProps = {
    showAddModal: noop
  };

  render() {
    return (
      <div className="handle-bar">
        <Button type="primary" onClick={this._showCateModal}>
          新增一级分类
        </Button>
      </div>
    );
  }

  /**
   * 显示品牌弹框
   */
  _showCateModal = () => {
    const { showAddModal } = this.props.relaxProps;
    showAddModal();
  };
}
