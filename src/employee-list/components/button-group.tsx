import React from 'react';
import { Relax } from 'plume2';
import { Button, Modal, Dropdown, Menu, Icon, message, Checkbox } from 'antd';
import { AuthWrapper, noop, history, cache, RCi18n } from 'qmkit';
import { List } from 'immutable';
import { checkMenu } from '../../../web_modules/qmkit/checkAuth';
import { IMap, IList } from 'typings/globalType';
import { FormattedMessage } from 'react-intl';

const confirm = Modal.confirm;

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onBatchDelete: Function;
      onBatchEnable: Function;
      toggleAdjustModal: Function;
      toggleConnectModal: Function;
      onBatchDissmiss: Function;
      switchModal: Function;
      selected: List<string>;
      onAdd: Function;
      onBatchSetEmployee: Function;
      hide: boolean;
      toggleHide: Function;
      onBatchActivateAccount: Function;
      onFormChange: Function;
      searchForm: IMap
    };
  };

  static relaxProps = {
    onBatchDelete: noop,
    selected: 'selected',
    onBatchEnable: noop,
    switchModal: noop,
    onAdd: noop,
    toggleAdjustModal: noop,
    toggleConnectModal: noop,
    onBatchDissmiss: noop,
    onBatchSetEmployee: noop,
    hide: 'hide',
    toggleHide: noop,
    onBatchActivateAccount: noop,
    onFormChange: noop,
    searchForm: 'searchForm'
  };

  render() {
    const { onAdd, toggleHide, onFormChange, searchForm } = this.props.relaxProps;

    return (
      <div
        // className="handle-bar"
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <div>
          <AuthWrapper functionName={'updateEmployee'}>
            <Button type='primary' onClick={() => onAdd()}>
              Add
            </Button>
          </AuthWrapper>

          {checkMenu('enableDisableEmployee,deleteEmployee') && (
            <Dropdown
              overlay={this._menu()}
              getPopupContainer={() => document.getElementById('page-content')}
            >
              <Button style={{ marginLeft: 10 }}>
                <FormattedMessage id='Setting.BatchOperation' />
                <Icon type='down' />
              </Button>
            </Dropdown>
          )}
        </div>

        {/* <div style={styles.box}>
          <Checkbox id='hide-employee' checked={searchForm.get('isHiddenDimission')} onChange={(e) => {
            toggleHide((e.target as any).checked ? '1' : '0');
            onFormChange({
              field: 'isHiddenDimission',
              value: (e.target as any).checked ? 1 : 0
            });
          }}>
            <FormattedMessage id='Setting.isHiddenDimission' />
          </Checkbox>
        </div> */}
      </div>
    );
  }

  _menu = () => {
    return (
      <Menu>
        <Menu.Item key={0}>
          <AuthWrapper functionName={'enableDisableEmployee'}>
            <a href='javascript:;' onClick={() => this._batchEnable()}>
              <FormattedMessage id='Setting.BatchEnable' />
            </a>
          </AuthWrapper>
        </Menu.Item>

        <Menu.Item key={1}>
          <AuthWrapper functionName={'enableDisableEmployee'}>
            <a href='javascript:;' onClick={() => this._batchDisable()}>
              <FormattedMessage id='Setting.BatchDeactivation' />
            </a>
          </AuthWrapper>
        </Menu.Item>

        <Menu.Item key={2}>
          <AuthWrapper functionName={'deleteEmployee'}>
            <a href='javascript:;' onClick={() => this._batchDelete()}>
              <FormattedMessage id='Setting.BatchDelete' />
            </a>
          </AuthWrapper>
        </Menu.Item>

        <Menu.Item key={3}>
          <AuthWrapper functionName={'f_batch_ajust_department'}>
            <a href='javascript:;' onClick={() => this._batchAdjust()}>
              <FormattedMessage id='Setting.AdjustmentDepartment' />
            </a>
          </AuthWrapper>
        </Menu.Item>

        <Menu.Item key={4}>
          <AuthWrapper functionName={'f_batch_set_employee'}>
            <a href='javascript:;' onClick={() => this._batchSetEmployee()}>
              <FormattedMessage id='Setting.BatchSalesman' />
            </a>
          </AuthWrapper>
        </Menu.Item>

        <Menu.Item key={5}>
          <AuthWrapper functionName={'f_batch_employee_dismiss'}>
            <a href='javascript:;' onClick={() => this._batchSetLeave()}>
              <FormattedMessage id='Setting.BatchResignation' />
            </a>
          </AuthWrapper>
        </Menu.Item>

        <Menu.Item key={6}>
          <AuthWrapper functionName={'f_batch_employee_active'}>
            <a href='javascript:;' onClick={() => this._batchActive()}>
              <FormattedMessage id='Setting.MemberAccountActivation' />
            </a>
          </AuthWrapper>
        </Menu.Item>

        <Menu.Item key={7}>
          <AuthWrapper functionName={'f_batch_employee_connect'}>
            <a href='javascript:;' onClick={() => this._batchConnect()}>
              <FormattedMessage id='Setting.ClerkHandover' />
            </a>
          </AuthWrapper>
        </Menu.Item>
        <Menu.Item key={8}>
          <a
            href='javascript:;'
            onClick={() => {
              history.push({
                pathname: '/employee-import'
              });
            }}
          >
            <FormattedMessage id='Setting.BulkImport' />
          </a>
        </Menu.Item>
      </Menu>
    );
  };

  _batchEnable = () => {
    const { onBatchEnable, selected } = this.props.relaxProps;
    if (selected.isEmpty()) {
      message.error(RCi18n({ id: 'Setting.PleaseOperate' }));
      return;
    }
    this.showConfirm(RCi18n({ id: 'Setting.BatchEnable' }), RCi18n({ id: 'Setting.Areemployee' }), onBatchEnable);
  };

  _batchDisable = () => {
    const { switchModal, selected } = this.props.relaxProps;
    if (selected.isEmpty()) {
      message.error(RCi18n({ id: 'Setting.PleaseOperate' }));
      return;
    }
    switchModal('');
  };

  _batchDelete = () => {
    const { onBatchDelete, selected } = this.props.relaxProps;
    if (selected.isEmpty()) {
      message.error(RCi18n({ id: 'Setting.PleaseOperate' }));
      return;
    }
    this.showConfirm(
      RCi18n({ id: 'Setting.BatchDelete' }),
      RCi18n({ id: 'Setting.AreDeletion' }),
      onBatchDelete
    );
  };

  _batchAdjust = () => {
    const { toggleAdjustModal, selected } = this.props.relaxProps;
    if (selected.isEmpty()) {
      message.error(RCi18n({ id: 'Setting.PleaseOperate' }));
      return;
    } else {
      toggleAdjustModal();
    }
  };

  _batchConnect = () => {
    const { toggleConnectModal, selected } = this.props.relaxProps;
    if (selected.isEmpty()) {
      message.error(RCi18n({ id: 'Setting.PleaseOperate' }));
      return;
    } else {
      toggleConnectModal();
    }
  };

  _batchSetEmployee = () => {
    const { onBatchSetEmployee, selected } = this.props.relaxProps;
    if (selected.isEmpty()) {
      message.error(RCi18n({ id: 'Setting.PleaseOperate' }));
      return;
    }
    this.showConfirm(
      RCi18n({ id: 'Setting.BatchSalesman' }),
      RCi18n({ id: 'Setting.AreOperators' }),
      onBatchSetEmployee
    );
  };

  _batchSetLeave = () => {
    const { onBatchDissmiss, selected } = this.props.relaxProps;
    if (selected.isEmpty()) {
      message.error(RCi18n({ id: 'Setting.PleaseOperate' }));
      return;
    }
    this.showConfirm(
      RCi18n({ id: 'Setting.BatchResignation' }),
    RCi18n({ id: 'Setting.AreAdvance' }),
      onBatchDissmiss
    );
  };

  _batchActive = () => {
    const { onBatchActivateAccount, selected } = this.props.relaxProps;
    if (selected.isEmpty()) {
      message.error(RCi18n({ id: 'Setting.PleaseOperate' }));
      return;
    }
    this.showConfirm(
      RCi18n({ id: 'Setting.MemberAccountActivation' }),
      RCi18n({ id: 'Setting.AreActivate' }),
      onBatchActivateAccount
    );
  };

  showConfirm(title: string, content: string, onOk: Function) {
    confirm({
      title: title,
      content: content,
      onOk() {
        onOk();
      }
    });
  }
}

const styles = {
  box: {
    padding: 10,
    paddingLeft: 20
  }
};
