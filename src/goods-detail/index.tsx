import React from 'react';
import { Breadcrumb, Button } from 'antd';
import { StoreProvider } from 'plume2';

import { AuthWrapper, Const, Headline, BreadCrumb } from 'qmkit';
import Tab from './components/tab';
import AppStore from './store';

import ForbidModal from './components/audit-forbid-modal';
import RejectModal from './components/audit-reject-modal';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsDetail extends React.Component<any, any> {
  store: AppStore;

  componentWillMount() {
    const { gid } = this.props.match.params;
    this.store.init(gid);
  }

  render() {
    const { gid } = this.props.match.params;
    const auditStatus = this.store.state().getIn(['goods', 'auditStatus']);
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>商品详情</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container">
          <Headline title="商品详情">
            <s>{this._getState(gid)}</s>
            {auditStatus == 0 && (
              <div className="rightBtn">
                <AuthWrapper functionName="f_goods_audit">
                  <Button
                    type="primary"
                    loading={this.store.state().get('saveLoading')}
                    onClick={() => this._handleAuditPass(gid)}
                  >
                    审核
                  </Button>
                  <Button
                    loading={this.store.state().get('saveLoading')}
                    style={{ marginLeft: 10 }}
                    onClick={() => this._handleAuditReject(gid)}
                  >
                    驳回
                  </Button>
                </AuthWrapper>
              </div>
            )}
            {auditStatus == 1 && (
              <div className="rightBtn">
                <AuthWrapper functionName="f_goods_2">
                  <Button
                    type="primary"
                    loading={this.store.state().get('saveLoading')}
                    onClick={() => this._handleAuditForbid(gid)}
                  >
                    禁售
                  </Button>
                </AuthWrapper>
              </div>
            )}
          </Headline>
          <Tab />
        </div>
        <ForbidModal />
        <RejectModal />
      </div>
    );
  }

  /**
   * 展示商品状态
   * @param t_gid
   * @returns {any}
   * @private
   */
  _getState(t_gid) {
    // 已保存的才有这种状态
    if (t_gid) {
      const auditStatus = this.store.state().getIn(['goods', 'auditStatus']);
      return Const.goodsState[auditStatus];
    }

    return null;
  }

  _handleAuditPass = (gid: string) => {
    if (gid) {
      this.store.handleAuditPass();
    } else {
      console.error('商品编号不可为空');
    }
  };

  _handleAuditReject = (gid: string) => {
    if (gid) {
      this.store.modalRejectShow();
    } else {
      console.error('商品编号不可为空');
    }
  };

  _handleAuditForbid = (gid: string) => {
    if (gid) {
      this.store.modalForbidShow();
    } else {
      console.error('商品编号不可为空');
    }
  };
}
