import * as React from 'react';
import { IMap, Relax } from 'plume2';
import { Input, Button, Form, Select, DatePicker, message } from 'antd';
import {
  SelectGroup,
  noop,
  Const,
  AuthWrapper,
  ExportModal,
  checkAuth
} from 'qmkit';
import { fromJS } from 'immutable';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

@Relax
export default class Search extends React.Component<any, any> {
  props: {
    relaxProps?: {
      form: any;
      setFormField: Function;
      changeOption: Function;
      init: Function;

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
    changeOption: noop,
    init: noop,

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
      init,
      exportModalData,
      onExportModalHide
    } = this.props.relaxProps;
    const { businessId, fundsType } = form.toJS();
    return (
      <div>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="账务类型"
              onChange={(e) => setFormField('fundsType', e.valueOf())}
              value={fundsType.toString()}
            >
              <Option key="0" value="0">
                全部
              </Option>
              <Option key="1" value="1">
                分销佣金
              </Option>
              <Option key="2" value="2">
                佣金提现
              </Option>
              <Option key="3" value="3">
                邀新奖励
              </Option>
              <Option key="4" value="4">
                佣金提成
              </Option>
              <Option key="5" value="5">
                余额支付
              </Option>
              <Option key="6" value="6">
                余额支付退款
              </Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <Input
              addonBefore="业务编号"
              value={businessId}
              onChange={(e: any) => setFormField('businessId', e.target.value)}
            />
          </FormItem>
          <FormItem>
            <RangePicker
              placeholder={['入账开始时间', '入账结束时间']}
              getCalendarContainer={() =>
                document.getElementById('page-content')
              }
              onChange={(e) => {
                let startTime = '';
                let endTime = '';
                if (e.length > 0) {
                  startTime = e[0].format(Const.DAY_FORMAT);
                  endTime = e[1].format(Const.DAY_FORMAT);
                }
                setFormField('startTime', startTime);
                setFormField('endTime', endTime);
              }}
            />
          </FormItem>

          <FormItem>
            <Button
              type="primary"
              icon="search"
              onClick={() => init()}
              htmlType="submit"
            >
              搜索
            </Button>
          </FormItem>
        </Form>
        <div className="handle-bar">
          {/*导出权限*/}
          <AuthWrapper functionName={'f_funds_detail_export'}>
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
    const haveAuth = checkAuth('f_funds_detail_export');
    if (haveAuth) {
      const { onExportByParams, onExportByIds } = this.props.relaxProps;
      this.props.relaxProps.onExportModalChange({
        visible: true,
        byParamsTitle: '导出筛选出的会员资金明细记录',
        byIdsTitle: '导出选中的会员资金明细记录',
        exportByParams: onExportByParams,
        exportByIds: onExportByIds
      });
    } else {
      message.error('此功能您没有权限访问');
    }
  }
}
