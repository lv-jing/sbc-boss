import * as React from 'react';
import { Relax } from 'plume2';
import { Button, Modal, message } from 'antd';
import { IList } from 'typings/globalType';
import { withRouter } from 'react-router';
import { AuthWrapper, noop } from 'qmkit';

const confirm = Modal.confirm;

@withRouter
@Relax
export default class Tool extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      tabIndex: string;
      spuCheckedFunc: Function;
      selectedSpuKeys: IList;
    };
  };

  static relaxProps = {
    tabIndex: 'tabIndex',
    spuCheckedFunc: noop,
    selectedSpuKeys: 'selectedSpuKeys'
  };

  render() {
    const tabIndex = this.props.relaxProps.tabIndex;
    if (tabIndex != '1' && tabIndex != '2') {
      return null;
    }
    return (
      <div className="handle-bar">
        <AuthWrapper functionName="f_goods_audit">
          <Button onClick={this._spuCheckedFunc}>批量审核</Button>
        </AuthWrapper>
      </div>
    );
  }

  _spuCheckedFunc = () => {
    const { spuCheckedFunc, selectedSpuKeys } = this.props.relaxProps;
    if (selectedSpuKeys.count() < 1) {
      message.error('至少选择一条商品');
      return;
    }
    confirm({
      title: '提示',
      content: '是否确定批量审核选中的商品？',
      onOk() {
        spuCheckedFunc();
      }
    });
  };
}
