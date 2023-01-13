import React from 'react';
import { Relax } from 'plume2';
import { Tabs } from 'antd';
import { AuthWrapper, noop } from 'qmkit';
import ButtonGroup from './button-group';
import InfoList from './info-list';
import EditModal from './edit-modal';
import SearchForm from './search-form';
import CateTool from './cate-tool';
import CateList from './cate-list';
import CateModal from './cate-modal';
import CouponList from './coupon-list';
import CouponSearchForm from './coupon-search-form';
import CouponButtonGroup from './coupon-button-group';
import CouponEditModal from './coupon-edit-modal';

@Relax
export default class TabDataGrid extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      onTabChange: Function;
      key: 'key';
    };
  };

  static relaxProps = {
    onTabChange: noop,
    key: 'key'
  };

  render() {
    const { onTabChange, key } = this.props.relaxProps;

    return (
      <Tabs onChange={(key) => onTabChange(key)} activeKey={key}>
        <Tabs.TabPane tab="积分商品列表" key="0" className="resetTable">
          {/* 搜索项区域 */}
          <SearchForm form={this.props.form} />

          {/* 操作按钮区域 */}
          <ButtonGroup />

          {/* 数据列表区域 */}
          <AuthWrapper functionName={'f_points_goods_list'}>
            <InfoList />
          </AuthWrapper>

          {/* 编辑弹框 */}
          <EditModal />
        </Tabs.TabPane>

        <Tabs.TabPane tab="积分商品分类" key="1">
          {/*工具条*/}
          <CateTool />
          {/*列表*/}
          <AuthWrapper functionName={'f_points_goods_cate_list'}>
            <CateList />
          </AuthWrapper>
          {/*弹框*/}
          <CateModal />
        </Tabs.TabPane>
        <Tabs.TabPane tab="积分兑换券" key="2">
          {/* 搜索项区域 */}
          <CouponSearchForm form={this.props.form} />

          {/* 操作按钮区域 */}
          <CouponButtonGroup />

          {/* 数据列表区域 */}
          <AuthWrapper functionName={'f_points_coupon_list'}>
            <CouponList />
          </AuthWrapper>

          {/* 编辑弹框 */}
          <CouponEditModal />
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
