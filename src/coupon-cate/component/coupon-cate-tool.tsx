import * as React from 'react';
import { Relax, IMap } from 'plume2';
import { Button, message } from 'antd';
import { AuthWrapper, noop } from 'qmkit';

@Relax
export default class CouponCateTool extends React.Component<any, any> {
  props: {
    relaxProps?: {
      couponCateList: IMap;
      showModal: Function;
    };
  };

  static relaxProps = {
    //优惠券分类列表
    couponCateList: 'couponCateList',
    // 展示关闭弹框
    showModal: noop
  };

  render() {
    const { couponCateList } = this.props.relaxProps;
    return (
      <div className="handle-bar">
        <AuthWrapper functionName={'f_coupon_cate_editor'}>
          {couponCateList.count() < 30 && (
            <Button type="primary" onClick={this._showModal}>
              新增优惠券分类
            </Button>
          )}
        </AuthWrapper>
      </div>
    );
  }

  /**
   * 显示新增优惠券分类弹框
   */
  _showModal = () => {
    const { showModal, couponCateList } = this.props.relaxProps;
    if (couponCateList.count() >= 30) {
      message.error('您只能添加30个优惠券分类');
    } else {
      showModal(true);
    }
  };
}
