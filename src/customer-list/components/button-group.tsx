import React from 'react';
import { Relax } from 'plume2';
import { Button, Modal } from 'antd';
import { AuthWrapper, noop } from 'qmkit';

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onBatchDelete: Function;
      onBatchAudit: Function;
      onAdd: Function;
    };
  };

  static relaxProps = {
    onBatchDelete: noop,
    onBatchAudit: noop,
    onAdd: noop
  };

  render() {
    const { onBatchAudit, onAdd } = this.props.relaxProps;
    return (
      <div className="handle-bar">
        <AuthWrapper functionName={'f_customer_1'}>
          <Button type="primary" onClick={() => onAdd()}>
            新增
          </Button>
        </AuthWrapper>
        <AuthWrapper functionName={'f_customer_4'}>
          <Button onClick={() => onBatchAudit(0)}>批量启用</Button>
        </AuthWrapper>
      </div>
    );
  }

  /**
   * 批量禁用确认提示
   * @private
   */
  _showBatchAudit = (status) => {
    const { onBatchAudit } = this.props.relaxProps;
    const confirm = Modal.confirm;
    confirm({
      title: '账号禁用',
      content: '是否确认禁用已选账号？禁用后该客户将无法登录！',
      onOk() {
        onBatchAudit(status);
      }
    });
  };

  /**
   * 批量删除确认提示
   * @private
   */
  _showBatchDelete = () => {
    const { onBatchDelete } = this.props.relaxProps;
    const confirm = Modal.confirm;
    confirm({
      title: '客户删除',
      content: '是否确认删除已选客户和他的账号？删除将无法恢复！',
      onOk() {
        onBatchDelete();
      }
    });
  };
}
