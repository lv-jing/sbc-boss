import React from 'react';
import { IMap, Relax } from 'plume2';
import { Button } from 'antd';
import {AuthWrapper, checkAuth, ExportModal, noop} from 'qmkit';
import { fromJS } from 'immutable';
import { message } from 'antd';


@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onAdd: Function;
      onExportByParams: Function;
      onExportByIds: Function;
      onExportModalChange: Function;
      onExportModalHide: Function;
      exportModalData: IMap;
    };
  };

  static relaxProps = {
    onAdd: noop,
    onExportByParams: noop,
    onExportByIds: noop,
    onExportModalChange: noop,
    onExportModalHide: noop,
    exportModalData: 'exportModalData'
  };

  render() {
    const { onAdd,exportModalData, onExportModalHide } = this.props.relaxProps;
    return (
      <div className="handle-bar">
        <AuthWrapper functionName={'f_distribution_customer_1'}>
          <Button type="primary" onClick={() => onAdd()}>
            新增分销员
          </Button>
        </AuthWrapper>
          {/*分销员导出权限*/}
        <AuthWrapper functionName={'f_distribution_customer_5'}>
          <Button onClick={() => this._handleBatchExport()}>批量导出</Button>
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
    const haveAuth = checkAuth('f_distribution_customer_5');
    if (haveAuth) {
      const { onExportByParams, onExportByIds } = this.props.relaxProps;
      this.props.relaxProps.onExportModalChange({
        visible: true,
        byIdsTitle: '导出选中的分销员',
        byParamsTitle: '导出筛选出的分销员',
        exportByParams: onExportByParams,
        exportByIds: onExportByIds
      });
    } else {
      message.error('此功能您没有权限访问');
    }
  }
}
