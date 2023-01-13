import React from 'react';
import { IMap, Relax } from 'plume2';
import { Tabs } from 'antd';
import { noop } from 'qmkit';
import DrawCashList from './draw-cash-list';

@Relax
export default class TabDataGrid extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onTabChange: Function;
      form: IMap;
      total: number;
      waitAuditTotal: number;
      finishTotal: number;
      drawCashFailedTotal: number;
      auditNotPassTotal: number;
      canceledTotal: number;
    };
  };

  static relaxProps = {
    onTabChange: noop,
    form: 'form',
    total: 'total',
    waitAuditTotal: 'waitAuditTotal',
    finishTotal: 'finishTotal',
    drawCashFailedTotal: 'drawCashFailedTotal',
    auditNotPassTotal: 'auditNotPassTotal',
    canceledTotal: 'canceledTotal'
  };

  render() {
    const {
      onTabChange,
      form,
      total,
      waitAuditTotal,
      finishTotal,
      drawCashFailedTotal,
      auditNotPassTotal,
      canceledTotal
    } = this.props.relaxProps;
    const key = form.get('checkState');
    const totalCount = total ? total : '0';

    //待审核
    const waitAuditText = '待审核(' + waitAuditTotal + ')';
    //已完成
    const finishText = '已完成(' + finishTotal + ')';
    //提现失败
    const drawCashFiledText = '提现失败(' + drawCashFailedTotal + ')';
    //审核未通过
    const auditNoPassText = '审核未通过(' + auditNotPassTotal + ')';
    // 已取消
    const cancelText = '已取消(' + canceledTotal + ')';
    return (
      <Tabs
        onChange={(key) => onTabChange(key)}
        activeKey={key}
        tabBarExtraContent={
          <div>
            共<span style={{ color: '#F56C1D' }}>{totalCount}</span>条
          </div>
        }
      >
        <Tabs.TabPane tab={waitAuditText} key="0">
          <DrawCashList />
        </Tabs.TabPane>

        <Tabs.TabPane tab={finishText} key="1">
          <DrawCashList />
        </Tabs.TabPane>

        <Tabs.TabPane tab={drawCashFiledText} key="2">
          <DrawCashList />
        </Tabs.TabPane>

        <Tabs.TabPane tab={auditNoPassText} key="3">
          <DrawCashList />
        </Tabs.TabPane>

        <Tabs.TabPane tab={cancelText} key="4">
          <DrawCashList />
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
