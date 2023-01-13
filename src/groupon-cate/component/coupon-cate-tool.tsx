import * as React from 'react';
import { Relax, IMap } from 'plume2';
import { Button, message } from 'antd';
import { AuthWrapper, noop } from 'qmkit';

@Relax
export default class CouponCateTool extends React.Component<any, any> {
  props: {
    relaxProps?: {
      grouponCateList: IMap;
      showModal: Function;
    };
  };

  static relaxProps = {
    //拼团分类列表
    grouponCateList: 'grouponCateList',
    // 展示关闭弹框
    showModal: noop
  };

  render() {
    const { grouponCateList } = this.props.relaxProps;
    return (
      <div className="handle-bar">
        <AuthWrapper functionName={'f_groupon_cate_editor'}>
          {grouponCateList.count() < 30 && (
            <Button type="primary" onClick={this._showModal}>
              新增拼团分类
            </Button>
          )}
        </AuthWrapper>
      </div>
    );
  }

  /**
   * 显示新增拼团分类弹框
   */
  _showModal = () => {
    const { showModal, grouponCateList } = this.props.relaxProps;
    if (grouponCateList.count() >= 30) {
      message.error('您只能添加30个拼团分类');
    } else {
      showModal(true);
    }
  };
}
