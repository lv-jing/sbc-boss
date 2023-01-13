import React from 'react';
import { Button } from 'antd';
import { Relax } from 'plume2';
import {AuthWrapper, history} from 'qmkit';
import { IList } from 'typings/globalType';

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      checkedIds: IList;
    };
  };

  static relaxProps = {
    checkedIds: 'checkedIds',
  };

  render() {
    return (
      <div className="handle-bar">
        <AuthWrapper functionName={'f_points_goods_add'}>
        <Button
          type="primary"
          onClick={() => {
            history.push({
              pathname: '/points-goods-add'
            });
          }}
        >
          添加商品
        </Button>
        </AuthWrapper>
        <AuthWrapper functionName={'f_points_goods_add'}>
        <Button
          onClick={() => {
            history.push({
              pathname: '/points-goods-import'
            });
          }}
        >
          导入商品
        </Button>
        </AuthWrapper>
      </div>
    );
  }
}
