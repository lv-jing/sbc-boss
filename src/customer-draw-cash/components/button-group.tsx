import React from 'react';
import {IMap, Relax} from 'plume2';
import {Button, message} from 'antd';
import {AuthWrapper, checkAuth, ExportModal, noop} from 'qmkit';
import { fromJS } from 'immutable';

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onBatchAudit: Function;
      onExportByParams: Function;
      onExportByIds: Function;
      onExportModalChange: Function;
      onExportModalHide: Function;
      exportModalData: IMap;
    };
  };

  static relaxProps = {
    onBatchAudit: noop,
    onExportByParams: noop,
    onExportByIds: noop,
    onExportModalChange: noop,
    onExportModalHide: noop,
    exportModalData: 'exportModalData'
  };

  render() {
    const { onBatchAudit,exportModalData, onExportModalHide  } = this.props.relaxProps;
    return (
      <div className="handle-bar">
        <AuthWrapper functionName="f_audit_pass_batch">
          <Button type="primary" onClick={() => onBatchAudit(2)}>
            批量审核
          </Button>
        </AuthWrapper>
        <AuthWrapper functionName="f_customer_draw_cash_export">
          <Button onClick={() => this._handleBatchExport()}>
            批量导出
          </Button>
        </AuthWrapper>
        <ExportModal
            data={exportModalData}
            onHide={onExportModalHide}
            handleByParams={exportModalData.get('exportByParams')}
            handleByIds={exportModalData.get('exportByIds')}
            alertInfo = {fromJS({'message':'操作说明:','description':'为保证效率,每次最多支持' +
                  '导出1000条记录，如需导出更多，请更换筛选条件后再次导出'})}
            alertVisible = {true}
        />
      </div>
    );
  }

  async _handleBatchExport() {
    // 校验是否有导出权限
    const haveAuth = checkAuth('f_customer_draw_cash_export');
    if (haveAuth) {
      const { onExportByParams, onExportByIds } = this.props.relaxProps;
      this.props.relaxProps.onExportModalChange({
        visible: true,
        byIdsTitle: '导出选中的会员提现记录',
        byParamsTitle: '导出筛选出的会员提现记录',
        exportByParams: onExportByParams,
        exportByIds: onExportByIds
      });
    } else {
      message.error('此功能您没有权限访问');
    }
  }
}
