import * as React from 'react';
import { Relax } from 'plume2';
import { Button, Modal, message } from 'antd';
import { IList } from 'typings/globalType';
import { withRouter } from 'react-router';
import { noop, AuthWrapper, history } from 'qmkit';

const confirm = Modal.confirm;

@withRouter
@Relax
export default class Tool extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      spuDelete: Function;
      selectedSpuKeys: IList;
    };
  };

  static relaxProps = {
    spuDelete: noop,
    selectedSpuKeys: 'selectedSpuKeys'
  };

  render() {
    return (
      <div className="handle-bar">
        <AuthWrapper functionName="f_goods_library_add">
          <Button
            type="primary"
            onClick={() => {
              history.push({
                pathname: '/goods-library-add'
              });
            }}
          >
            新增商品库商品
          </Button>
        </AuthWrapper>
        <AuthWrapper functionName="f_goods_library_import">
          <Button
            onClick={() => {
              history.push({
                pathname: '/goods-library-import'
              });
            }}
          >
            批量导入
          </Button>
        </AuthWrapper>
      </div>
    );
  }

  _delGoods = () => {
    const { spuDelete, selectedSpuKeys } = this.props.relaxProps;
    if (selectedSpuKeys.count() < 1) {
      message.error('至少选择一条商品');
      return;
    }
    confirm({
      title: '提示',
      content: '您确认要删除这些商品吗？',
      onOk() {
        spuDelete();
      }
    });
  };
}
