import * as React from 'react';
import { IMap, Relax } from 'plume2';
import { Input, Button, Form, Select, message } from 'antd';
import {
  noop,
  InputGroupCompact,
  SelectGroup,
  AuthWrapper,
  ExportModal,
  checkAuth
} from 'qmkit';
import { fromJS } from 'immutable';

const FormItem = Form.Item;
const Option = Select.Option;

const OPTION_TYPE = {
  0: 'customerAccount',
  1: 'customerName'
};

@Relax
export default class Search extends React.Component<any, any> {
  props: {
    relaxProps?: {
      form: any;
      setFormField: Function;
      changeCustomerAccountOrNameOption: Function;
      init: Function;
      checkSwapInputGroupCompact: Function;

      onExportByParams: Function;
      onExportByIds: Function;
      onExportModalChange: Function;
      onExportModalHide: Function;
      exportModalData: IMap;
    };
  };

  static relaxProps = {
    // 搜索项
    form: 'form',
    setFormField: noop,
    changeCustomerAccountOrNameOption: noop,
    init: noop,
    checkSwapInputGroupCompact: noop,

    onExportByParams: noop,
    onExportByIds: noop,
    onExportModalChange: noop,
    onExportModalHide: noop,
    exportModalData: 'exportModalData'
  };

  render() {
    const {
      form,
      setFormField,
      exportModalData,
      onExportModalHide
    } = this.props.relaxProps;
    const {
      customerAccount,
      customerName,
      distributor,
      startAccountBalance,
      endAccountBalance,
      startBlockedBalance,
      endBlockedBalance,
      startWithdrawAmount,
      endWithdrawAmount
    } = form.toJS();

    const searchText = customerAccount || customerName;
    return (
      <div>
        <Form className="filter-content" layout="inline">
          {/*会员账号、会员名称搜索*/}
          <FormItem>
            <Input
              addonBefore={this._buildOptions()}
              value={searchText}
              onChange={(e: any) => this._setField(e.target.value)}
            />
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="是否分销员"
              value={distributor}
              onChange={(e) => setFormField('distributor', e.valueOf())}
            >
              <Option key="-1" value="-1">
                全部
              </Option>
              <Option key="1" value="1">
                是
              </Option>
              <Option key="0" value="0">
                否
              </Option>
            </SelectGroup>
          </FormItem>

          <FormItem>
            <InputGroupCompact
              title="账户余额"
              precision={2}
              startMin={0}
              start={startAccountBalance}
              onStartChange={(val) => setFormField('startAccountBalance', val)}
              endMin={0}
              end={endAccountBalance}
              onEndChange={(val) => setFormField('endAccountBalance', val)}
            />
          </FormItem>

          <FormItem>
            <InputGroupCompact
              title="冻结余额"
              precision={2}
              startMin={0}
              start={startBlockedBalance}
              onStartChange={(val) => setFormField('startBlockedBalance', val)}
              endMin={0}
              end={endBlockedBalance}
              onEndChange={(val) => setFormField('endBlockedBalance', val)}
            />
          </FormItem>

          <FormItem>
            <InputGroupCompact
              title="可提现余额"
              precision={2}
              startMin={0}
              start={startWithdrawAmount}
              onStartChange={(val) => setFormField('startWithdrawAmount', val)}
              endMin={0}
              end={endWithdrawAmount}
              onEndChange={(val) => setFormField('endWithdrawAmount', val)}
            />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              icon="search"
              onClick={() => this._search()}
              htmlType="submit"
            >
              搜索
            </Button>
          </FormItem>
        </Form>
        <div className="handle-bar">
          {/*导出权限*/}
          <AuthWrapper functionName={'f_funds_export'}>
            <Button type="primary" onClick={() => this._handleBatchExport()}>
              批量导出
            </Button>
          </AuthWrapper>
        </div>
        <ExportModal
          data={exportModalData}
          onHide={onExportModalHide}
          handleByParams={exportModalData.get('exportByParams')}
          handleByIds={exportModalData.get('exportByIds')}
          alertInfo={fromJS({
            message: '操作说明:',
            description:
              '为保证效率,每次最多支持' +
              '导出1000条记录，如需导出更多，请更换筛选条件后再次导出'
          })}
          alertVisible={true}
        />
      </div>
    );
  }

  async _handleBatchExport() {
    // 校验是否有导出权限
    const haveAuth = checkAuth('f_funds_export');
    if (haveAuth) {
      const { onExportByParams, onExportByIds } = this.props.relaxProps;
      this.props.relaxProps.onExportModalChange({
        visible: true,
        byParamsTitle: '导出筛选出的会员资金记录',
        byIdsTitle: '导出选中的会员资金记录',
        exportByParams: onExportByParams,
        exportByIds: onExportByIds
      });
    } else {
      message.error('此功能您没有权限访问');
    }
  }

  /**
   * 构建Option结构
   */
  _buildOptions = () => {
    const { form } = this.props.relaxProps;
    return (
      <Select
        value={form.get('optType')}
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => this._changeCustomerAccountOrNameOption(val)}
      >
        <Option value="0">会员账号</Option>
        <Option value="1">会员名称</Option>
      </Select>
    );
  };

  /**
   * 更改搜索项(会员账号、会员名称)
   */
  _changeCustomerAccountOrNameOption = (val) => {
    this.props.relaxProps.changeCustomerAccountOrNameOption(val);
  };

  /**
   * 搜索项设置搜索信息
   */
  _setField = (val) => {
    const { setFormField, form } = this.props.relaxProps;
    setFormField(OPTION_TYPE[form.get('optType')], val);
  };

  /**
   * 搜索
   * @private
   */
  _search = () => {
    const { checkSwapInputGroupCompact, init } = this.props.relaxProps;
    checkSwapInputGroupCompact();
    init();
  };
}
