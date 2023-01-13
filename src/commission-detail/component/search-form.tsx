import React from 'react';
import { Relax, IMap } from 'plume2';
import { Form, Row, Col, Input, Button, DatePicker, message } from 'antd';
import { noop, Const, AuthWrapper, ExportModal, checkAuth } from 'qmkit';
import { fromJS } from 'immutable';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
@Relax
export default class GeneralCommissionDetail extends React.Component<any, any> {
  props: {
    relaxProps?: {
      generalCommissionDetail: IMap;
      form?: any;
      setFormField: Function;
      init: Function;

      onExportByParams: Function;
      onExportByIds: Function;
      onExportModalChange: Function;
      onExportModalHide: Function;
      exportModalData: IMap;
    };
  };

  static relaxProps = {
    generalCommissionDetail: 'generalCommissionDetail',
    setFormField: noop,
    init: noop,
    form: 'form',

    onExportByParams: noop,
    onExportByIds: noop,
    onExportModalChange: noop,
    onExportModalHide: noop,
    exportModalData: 'exportModalData'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      setFormField,
      form,
      init,
      generalCommissionDetail,
      exportModalData,
      onExportModalHide
    } = this.props.relaxProps;
    //佣金总额
    const commissionTotal = generalCommissionDetail.get('commissionTotal');
    //分销佣金总额
    const commission = generalCommissionDetail.get('commission');
    //邀新奖金总额
    const rewardCash = generalCommissionDetail.get('rewardCash');
    //未入账分销佣金总额
    const commissionNotRecorded = generalCommissionDetail.get(
      'commissionNotRecorded'
    );
    //未入账邀新奖金总额
    const rewardCashNotRecorded = generalCommissionDetail.get(
      'rewardCashNotRecorded'
    );
    //分销员名称
    const customerName = generalCommissionDetail.get('customerName');
    //分销员账号
    const customerAccount = generalCommissionDetail.get('customerAccount');
    return (
      <div style={styles.content}>
        <div>
          <div style={styles.static}>
            <p style={{ marginLeft: 5 }}>
              分销员:{customerName}
              <span style={{ marginLeft: 10 }}>{customerAccount}</span>
            </p>

            <Row>
              <Col span={4}>
                <p style={styles.nav}>佣金总额</p>
                <p style={styles.num}>
                  {commissionTotal
                    ? '￥' + commissionTotal.toFixed(2)
                    : '￥0.00'}
                </p>
              </Col>
              <Col span={5}>
                <p style={styles.nav}>分销佣金总额</p>
                <p style={styles.num}>
                  {commission ? '￥' + commission.toFixed(2) : '￥0.00'}
                </p>
              </Col>
              <Col span={5}>
                <p style={styles.nav}>邀新奖金总额</p>
                <p style={styles.num}>
                  {rewardCash ? '￥' + rewardCash.toFixed(2) : '￥0.00'}
                </p>
              </Col>
              <Col span={5}>
                <p style={styles.nav}>未入账分销佣金总额</p>
                <p style={styles.num}>
                  {commissionNotRecorded
                    ? '￥' + commissionNotRecorded.toFixed(2)
                    : '￥0.00'}
                </p>
              </Col>
              <Col span={5}>
                <p style={styles.nav}>未入账邀新奖金总额</p>
                <p style={styles.num}>
                  {rewardCashNotRecorded
                    ? '￥' + rewardCashNotRecorded.toFixed(2)
                    : '￥0.00'}
                </p>
              </Col>
            </Row>
          </div>
          <Form className="filter-content" layout="inline">
            <FormItem>
              <Input
                value={form.get('businessId')}
                addonBefore="订单编号"
                onChange={(e) => setFormField('businessId', e.target.value)}
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
              <Button type="primary" onClick={() => init()} htmlType="submit">
                搜索
              </Button>
            </FormItem>
          </Form>
        </div>
        <div className="handle-bar">
          {/*导出权限*/}
          <AuthWrapper functionName={'f_commission_detail_export'}>
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
    const haveAuth = checkAuth('f_commission_detail_export');
    if (haveAuth) {
      const { onExportByParams, onExportByIds } = this.props.relaxProps;
      this.props.relaxProps.onExportModalChange({
        visible: true,
        byParamsTitle: '导出筛选出的佣金明细记录',
        byIdsTitle: '导出选中的佣金明细记录',
        exportByParams: onExportByParams,
        exportByIds: onExportByIds
      });
    } else {
      message.error('此功能您没有权限访问');
    }
  }
}

const styles = {
  content: {
    background: '#ffffff',
    padding: 10
  },
  title: {
    fontSize: 18,
    marginBottom: 30,
    display: 'block',
    color: '#333333'
  } as any,
  h4: {
    fontSize: 14,
    color: '#333333'
  },
  nav: {
    fontSize: 14,
    color: '#666666',
    padding: 5
  },
  num: {
    color: '#F56C1D',
    fontSize: 16,
    padding: 5
  },
  static: {
    background: '#fafafa',
    padding: 10,
    marginBottom: 16
  },
  box: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20
  } as any,
  item: {
    color: '#666',
    fontSize: 14,
    display: 'block',
    padding: 5,
    marginRight: 20
  },
  itemCur: {
    color: '#F56C1D',
    fontSize: 14,
    borderBottom: '2px solid #F56C1D',
    padding: 5,
    marginRight: 20
  }
};
