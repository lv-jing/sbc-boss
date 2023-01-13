import React from 'react';
import { Button } from 'antd';
import { Relax } from 'plume2';
import { AuthWrapper, history, noop } from 'qmkit';
import { IList, IMap } from 'typings/globalType';

@Relax
export default class CouponButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      checkedIds: IList;
      exportModalData: IMap;
      onAdd: Function;
      onBatchDelete: Function;
      onExportModalHide: Function;
      onExportModalShow: Function;
    };
  };

  static relaxProps = {
    checkedIds: 'checkedIds',
    exportModalData: 'exportModalData',
    onAdd: noop,
    onBatchDelete: noop,
    onExportModalHide: noop,
    onExportModalShow: noop
  };

  render() {
    return (
      <div className="handle-bar">
        <AuthWrapper functionName={'f_points_coupon_add'}>
          <Button
            type="primary"
            onClick={() => {
              history.push({
                pathname: '/points-coupon-add'
              });
            }}
          >
            新增
          </Button>
        </AuthWrapper>
      </div>
    );
  }
}
