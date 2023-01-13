import React from 'react';

import { Button, Dropdown, Menu, Icon, message, Modal } from 'antd';
import { noop, AuthWrapper } from 'qmkit';
import { Relax } from 'plume2';
import { IList, IMap } from 'typings/globalType';

const confirm = Modal.confirm;

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      changeSettleStatus: Function;
      checkedSettleIds: IList;
      queryParams: IMap;
      bulkExport: Function;
    };
  };

  static relaxProps = {
    changeSettleStatus: noop,
    checkedSettleIds: 'checkedSettleIds',
    queryParams: 'queryParams',
    bulkExport: noop
  };

  render() {
    return (
      <div className="handle-bar">
        {/*当前Dropdown不支持disabled属性*/}
        <AuthWrapper functionName="m_billing_details_2">
          <Dropdown
            overlay={this._menu()}
            getPopupContainer={() => document.getElementById('page-content')}
          >
            <Button>
              批量操作<Icon type="down" />
            </Button>
          </Dropdown>
        </AuthWrapper>
      </div>
    );
  }

  _menu = () => {
    const { queryParams, bulkExport } = this.props.relaxProps;
    const settleStatus = queryParams.get('settleStatus');
    return (
      <Menu>
        {(settleStatus == 0 || settleStatus == 2) && (
          <Menu.Item>
            <a onClick={() => this._handleBatchOption(1)}>设为已结算</a>
          </Menu.Item>
        )}
        <Menu.Item>
          <a onClick={() => bulkExport()}>批量导出</a>
        </Menu.Item>
      </Menu>
    );
  };

  /**
   * 批量操作
   * @param status
   * @private
   */
  _handleBatchOption = (status) => {
    const { changeSettleStatus, checkedSettleIds } = this.props.relaxProps;
    if (checkedSettleIds && checkedSettleIds.size != 0) {
      confirm({
        title: '提示',
        content:
          status == 1
            ? '确定要将该条结算记录设置为"已结算"吗？'
            : '确定要将该条结算记录设置为"暂不处理"吗？',
        onOk() {
          changeSettleStatus(checkedSettleIds.toJS(), status);
        }
      });
    } else {
      message.error('您未勾选任何记录');
    }
  };
}
