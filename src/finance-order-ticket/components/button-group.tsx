import React from 'react';
import { Relax } from 'plume2';
import { Button, Popconfirm, Dropdown, Icon, Menu } from 'antd';
import { noop, ExportModal } from 'qmkit';

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onBatchConfirm: Function;
      onShow: Function;
      exportModalData: any;
      onHideExportModal: Function;
      onExportByParams: Function;
      onExportByIds: Function;
      onExportModalChange: Function;
    };
  };

  static relaxProps = {
    onBatchConfirm: noop,
    onShow: noop,
    exportModalData: 'exportModalData',
    onHideExportModal: noop,
    onExportByParams: noop,
    onExportByIds: noop,
    onExportModalChange: noop
  };

  render() {
    const {
      onShow,
      onHideExportModal,
      exportModalData
    } = this.props.relaxProps;

    return (
      <div className="handle-bar">
        <Button type="primary" onClick={() => onShow()}>
          新增
        </Button>
        <Dropdown
          overlay={this._menu()}
          getPopupContainer={() => document.getElementById('page-content')}
        >
          <Button>
            批量操作<Icon type="down" />
          </Button>
        </Dropdown>
        <ExportModal
          data={exportModalData}
          onHide={onHideExportModal}
          handleByParams={exportModalData.get('exportByParams')}
          handleByIds={exportModalData.get('exportByIds')}
        />
      </div>
    );
  }
  _menu = () => {
    const { onBatchConfirm } = this.props.relaxProps;
    return (
      <Menu>
        <Menu.Item>
          <Popconfirm
            title={'是否要批量开票'}
            onConfirm={() => {
              onBatchConfirm();
            }}
            okText="确定"
            cancelText="取消"
          >
            <a href="javascript:void(0);">批量开票</a>
          </Popconfirm>
        </Menu.Item>
        <Menu.Item>
          <a href="javascript:;" onClick={() => this._handleBatchExport()}>
            批量导出
          </a>
        </Menu.Item>
      </Menu>
    );
  };

  _handleBatchExport() {
    const {
      onExportByParams,
      onExportByIds,
      onExportModalChange
    } = this.props.relaxProps;
    onExportModalChange({
      visible: true,
      byParamsTitle: '导出筛选出的收款明细',
      byIdsTitle: '导出选中的收款明细',
      exportByParams: onExportByParams,
      exportByIds: onExportByIds
    });
  }
}
