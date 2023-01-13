import React, { Component } from 'react';
import { Relax } from 'plume2';
import { Button, Form, Input, Modal, Select, DatePicker, message } from 'antd';
import {
  ExportModal,
  Headline,
  noop,
  Const,
  checkAuth,
  AuthWrapper
} from 'qmkit';
import { IList, IMap } from 'typings/globalType';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const RangePicker = DatePicker.RangePicker;

/**
 * 订单查询头
 */
@Relax
export default class SearchHead extends Component<any, any> {
  props: {
    relaxProps?: {
      onSearch: Function;
      onBatchAudit: Function;
      onBatchReceive: Function;
      onSearchFormChange: Function;
      selected: IList;
      exportModalData: IMap;
      onExportModalChange: Function;
      onExportModalHide: Function;
      onExportByParams: Function;
      onExportByIds: Function;
      tab: IMap;
    };
  };

  static relaxProps = {
    onSearch: noop,
    onBatchAudit: noop,
    onBatchReceive: noop,
    onSearchFormChange: noop,
    selected: 'selected',
    exportModalData: 'exportModalData',
    onExportModalChange: noop,
    onExportModalHide: noop,
    onExportByParams: noop,
    onExportByIds: noop,
    tab: 'tab'
  };

  constructor(props) {
    super(props);

    this.state = {
      goodsOptions: 'skuName',
      buyerOptions: 'buyerName',
      consigneeOptions: 'consigneeName',
      supplierOptions: 'supplierName',
      supplierOptionsValue: '',
      rid: '',
      tid: '',
      skuName: '',
      skuNo: '',
      buyerName: '',
      buyerAccount: '',
      consigneeName: '',
      consigneePhone: '',
      beginTime: '',
      endTime: ''
    };
  }

  render() {
    const { exportModalData, onExportModalHide } = this.props.relaxProps;

    // const batchMenu = (
    //   <Menu>
    //     {checkAuth('rolf006') && (
    //       <Menu.Item>
    //         <a href="javascript:;" onClick={() => this._handleBatchExport()}>
    //           批量导出
    //         </a>
    //       </Menu.Item>
    //     )}
    //   </Menu>
    // );

    return (
      <div>
        <Headline title="退单列表" />

        <div>
          <Form
            className="filter-content"
            layout="inline"
            style={{ marginRight: 10 }}
          >
            <FormItem>
              <Input
                addonBefore="退单编号"
                onChange={(e) => {
                  this.setState(
                    { rid: (e.target as any).value },
                    this._paramChanged
                  );
                }}
              />
            </FormItem>
            <FormItem>
              <Input
                addonBefore="订单编号"
                onChange={(e) => {
                  this.setState(
                    { tid: (e.target as any).value },
                    this._paramChanged
                  );
                }}
              />
            </FormItem>
            {/*商品名称、sku编码*/}
            <FormItem>
              <Input
                addonBefore={this._renderGoodsOptionSelect()}
                onChange={(e) => {
                  if (this.state.goodsOptions === 'skuName') {
                    this.setState(
                      {
                        skuName: (e.target as any).value,
                        skuNo: ''
                      },
                      this._paramChanged
                    );
                  } else if (this.state.goodsOptions === 'skuNo') {
                    this.setState(
                      {
                        skuName: '',
                        skuNo: (e.target as any).value
                      },
                      this._paramChanged
                    );
                  }
                }}
              />
            </FormItem>
            <FormItem>
              <Input
                addonBefore={this._renderSupplierOptionSelect()}
                onChange={(e) => {
                  if (this.state.supplierOptions === 'supplierName') {
                    this.setState(
                      {
                        supplierName: (e.target as any).value,
                        supplierCode: null
                      },
                      this._paramChanged
                    );
                  } else {
                    this.setState(
                      {
                        supplierCode: (e.target as any).value,
                        supplierName: null
                      },
                      this._paramChanged
                    );
                  }
                }}
              />
            </FormItem>
            {/*客户名称、客户账号*/}
            <FormItem>
              <Input
                addonBefore={this._renderBuyerOptionSelect()}
                onChange={(e) => {
                  if (this.state.buyerOptions === 'buyerName') {
                    this.setState(
                      {
                        buyerName: (e.target as any).value,
                        buyerAccount: ''
                      },
                      this._paramChanged
                    );
                  } else if (this.state.buyerOptions === 'buyerAccount') {
                    this.setState(
                      {
                        buyerName: '',
                        buyerAccount: (e.target as any).value
                      },
                      this._paramChanged
                    );
                  }
                }}
              />
            </FormItem>
            {/*收件人、收件人手机*/}
            <FormItem>
              <Input
                addonBefore={this._renderConsigneeOptionSelect()}
                onChange={(e) => {
                  if (this.state.consigneeOptions === 'consigneeName') {
                    this.setState(
                      {
                        consigneeName: (e.target as any).value,
                        consigneePhone: ''
                      },
                      this._paramChanged
                    );
                  } else if (this.state.consigneeOptions === 'consigneePhone') {
                    this.setState(
                      {
                        consigneeName: '',
                        consigneePhone: (e.target as any).value
                      },
                      this._paramChanged
                    );
                  }
                }}
              />
            </FormItem>
            <FormItem>
              <RangePicker
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                onChange={(e) => {
                  let beginTime = '';
                  let endTime = '';
                  if (e.length > 0) {
                    beginTime = e[0].format(Const.DAY_FORMAT);
                    endTime = e[1].format(Const.DAY_FORMAT);
                  }
                  this.setState(
                    { beginTime: beginTime, endTime: endTime },
                    this._paramChanged
                  );
                }}
              />
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                icon="search"
                onClick={() => {
                  this.props.relaxProps.onSearch(this.state);
                }}
                htmlType="submit"
              >
                搜索
              </Button>
            </FormItem>
          </Form>
          <AuthWrapper functionName={'rolf006'}>
            {/* <div className="handle-bar">
              <Dropdown
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                overlay={batchMenu}
                placement="bottomLeft"
              >
                <Button>
                  批量操作 <Icon type="down" />
                </Button>
              </Dropdown>
            </div> */}
            <Button onClick={() => this._handleBatchExport()}>批量导出</Button>
          </AuthWrapper>
        </div>
        <ExportModal
          data={exportModalData}
          onHide={onExportModalHide}
          handleByParams={exportModalData.get('exportByParams')}
          handleByIds={exportModalData.get('exportByIds')}
        />
      </div>
    );
  }

  _renderGoodsOptionSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => {
          if (val === 'skuName') {
            this.setState(
              {
                skuName: this.state.skuNo,
                skuNo: '',
                goodsOptions: val
              },
              this._paramChanged
            );
          } else if (val === 'skuNo') {
            this.setState(
              {
                skuName: '',
                skuNo: this.state.skuName,
                goodsOptions: val
              },
              this._paramChanged
            );
          }
        }}
        value={this.state.goodsOptions}
        style={{ width: 100 }}
      >
        <Option value="skuName">商品名称</Option>
        <Option value="skuNo">SKU编码</Option>
      </Select>
    );
  };

  _renderBuyerOptionSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => {
          if (val === 'buyerName') {
            this.setState(
              {
                buyerName: this.state.buyerAccount,
                buyerAccount: '',
                buyerOptions: val
              },
              this._paramChanged
            );
          } else if (val === 'buyerAccount') {
            this.setState(
              {
                buyerName: '',
                buyerAccount: this.state.buyerName,
                buyerOptions: val
              },
              this._paramChanged
            );
          }
        }}
        value={this.state.buyerOptions}
        style={{ width: 100 }}
      >
        <Option value="buyerName">客户名称</Option>
        <Option value="buyerAccount">客户账号</Option>
      </Select>
    );
  };

  _renderConsigneeOptionSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => {
          if (val === 'consigneeName') {
            this.setState(
              {
                consigneeName: this.state.consigneePhone,
                consigneePhone: '',
                consigneeOptions: val
              },
              this._paramChanged
            );
          } else if (val === 'consigneePhone') {
            this.setState(
              {
                consigneeName: '',
                consigneePhone: this.state.consigneeName,
                consigneeOptions: val
              },
              this._paramChanged
            );
          }
        }}
        value={this.state.consigneeOptions}
        style={{ minWidth: 100 }}
      >
        <Option value="consigneeName">收件人</Option>
        <Option value="consigneePhone">收件人手机</Option>
      </Select>
    );
  };

  // 搜索条件变化，更新store的form参数
  _paramChanged() {
    // console.log(this.props.relaxProps);
    this.props.relaxProps.onSearchFormChange(this.state);
  }

  _handleBatchAudit() {
    const { selected, onBatchAudit } = this.props.relaxProps;
    if (selected.count() === 0) {
      message.error('请选择退单');
      return;
    }
    confirm({
      title: '批量审核',
      content: (
        <div>
          <div>您确定要批量通过已选择退单？</div>
          <div style={{ color: 'gray' }}>请先确保您已仔细查看过已选退单</div>
        </div>
      ),
      onOk() {
        return onBatchAudit(selected.toArray());
      },
      onCancel() {}
    });
  }

  _handleBatchReceive() {
    const { selected, onBatchReceive } = this.props.relaxProps;
    if (selected.count() === 0) {
      message.error('请选择退单');
      return;
    }
    confirm({
      title: '批量收货',
      content: (
        <div>
          <div>您确定要批量收货已选择退单？</div>
          <div style={{ color: 'gray' }}>请先确保您已仔细查看过已选退单</div>
        </div>
      ),
      onOk() {
        return onBatchReceive(selected.toArray());
      },
      onCancel() {}
    });
  }

  async _handleBatchExport() {
    // 校验是否有导出退单权限, rolf006 为导出退单权限的功能编号
    const haveAuth = checkAuth('rolf006');
    if (haveAuth) {
      const { onExportByParams, onExportByIds } = this.props.relaxProps;
      this.props.relaxProps.onExportModalChange({
        visible: true,
        byParamsTitle: '导出筛选出的订单',
        byIdsTitle: '导出选中的订单',
        exportByParams: onExportByParams,
        exportByIds: onExportByIds
      });
    } else {
      message.error('此功能您没有权限访问');
    }
  }

  _renderSupplierOptionSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(value) => {
          if (value === 'supplierName') {
            this.setState({
              supplierOptions: value,
              supplierName: this.state.supplierCode,
              supplierCode: null
            });
          } else {
            this.setState({
              supplierOptions: value,
              supplierCode: this.state.supplierName,
              supplierName: null
            });
          }
        }}
        value={this.state.supplierOptions}
      >
        <Option value="supplierName">商家名称</Option>
        <Option value="supplierCode">商家编码</Option>
      </Select>
    );
  };
}
