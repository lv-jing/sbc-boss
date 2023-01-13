import * as React from 'react';
import { Modal, Select, Table } from 'antd';
import { Relax } from 'plume2';
import moment from 'moment';
import { noop, DataGrid, SelectGroup, Const } from 'qmkit';
import { List } from 'immutable';
import { FormattedMessage } from 'react-intl';

type TList = List<any>;
const Column = Table.Column;
const Option = Select.Option;

@Relax
export default class SeeRecord extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
  }

  props: {
    relaxProps?: {
      serviceModalVisible: boolean;
      serviceModal: Function;
      storeEvaluateNumList: TList;
      evaluateCount: number;
      compositeScore: number;
      storeTotal: number;
      storeDataList: TList;
      storePageSize: number;
      storeCurrentPage: number;
      initStoreEvaluate: Function;
      storeCycle: number;
      storeId: number;
      changeScoreCycle: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    serviceModalVisible: 'serviceModalVisible',
    // 关闭弹窗
    serviceModal: noop,
    storeEvaluateNumList: 'storeEvaluateNumList',
    evaluateCount: 'evaluateCount',
    compositeScore: 'compositeScore',
    storeTotal: 'storeTotal',
    storeDataList: 'storeDataList',
    storePageSize: 'storePageSize',
    storeCurrentPage: 'storeCurrentPage',
    initStoreEvaluate: noop,
    scoreCycle: 'scoreCycle',
    storeId: 'storeId',
    changeScoreCycle: noop
  };

  render() {
    const {
      serviceModalVisible,
      storeEvaluateNumList,
      evaluateCount,
      compositeScore,
      storeDataList,
      storeTotal,
      storePageSize,
      storeCurrentPage,
      initStoreEvaluate,
      scoreCycle,
      storeId,
      changeScoreCycle
    } = this.props.relaxProps as any;
    if (!serviceModalVisible) {
      return null;
    }
    console.log(storeDataList, storeEvaluateNumList);
    return (
      <Modal
        maskClosable={false}
        title={
          <div>
            <div style={{ float: 'left' }}>
              <FormattedMessage id="Store.details" />{' '}
            </div>
            <div style={{ fontSize: '13px', color: 'grey' }}>
              <FormattedMessage id="Store.evaluation" />
            </div>
          </div>
        }
        visible={serviceModalVisible}
        width={920}
        onCancel={this._handleModelCancel}
        footer={null}
      >
        <div className="see-service-record">
          <div className="up-content">
            <div className="personal">
              <FormattedMessage id="Store.people" />：{evaluateCount}
            </div>
            <div className="score">
              {<FormattedMessage id="Store.OverallRating" />}：
              {compositeScore ? compositeScore.toFixed(2) : '-'}
            </div>
            <div className="select">
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label={<FormattedMessage id="Store.TimeLimit" />}
                style={{ width: 80 }}
                onChange={(value) => changeScoreCycle(value, storeId)}
                value={scoreCycle + ''}
              >
                <Option value="2">Nearly 180 days</Option>
                <Option value="1">Nearly 90 days</Option>
                <Option value="0">Nearly 30 days</Option>
              </SelectGroup>
            </div>
          </div>
          <div className="center-table">
            <DataGrid dataSource={storeEvaluateNumList} pagination={false}>
              <Column
                title={<FormattedMessage id="Store.EvaluationDetails" />}
                key="numType"
                dataIndex="numType"
                render={(value) => {
                  if (value == 0) {
                    return <FormattedMessage id="Store.CommodityRating" />;
                  } else if (value == 1) {
                    return <FormattedMessage id="Store.ServiceScore" />;
                  } else {
                    return <FormattedMessage id="Store.LogisticsScore" />;
                  }
                }}
              />

              <Column
                title="4-5 points"
                dataIndex="excellentNum"
                key="excellentNum"
              />
              <Column title="3 points" dataIndex="mediumNum" key="mediumNum" />
              <Column
                title="1-2 points"
                dataIndex="differenceNum"
                key="differenceNum"
              />
              <Column
                title={<FormattedMessage id="Store.EvenlySplit" />}
                dataIndex="sumCompositeScore"
                key="sumCompositeScore"
                render={(text) => parseFloat(text).toFixed(2)}
              />
            </DataGrid>
          </div>
          <div className="down-table">
            <label className="evalu-title">
              Evaluation history（{storeTotal}）
            </label>
            <DataGrid
              dataSource={storeDataList}
              pagination={{
                current: storeCurrentPage,
                pageSize: storePageSize,
                total: storeTotal,
                onChange: (pageNum, pageSize) => {
                  initStoreEvaluate({
                    pageNum: pageNum - 1,
                    pageSize: pageSize,
                    storeId: storeId,
                    scoreCycle: scoreCycle
                  });
                }
              }}
            >
              <Column
                title={<FormattedMessage id="Store.MemberName" />}
                dataIndex="customerName"
                key="customerName"
              />
              <Column
                title={<FormattedMessage id="Store.orderNumber" />}
                dataIndex="orderNo"
                key="orderNo"
              />
              <Column
                title={<FormattedMessage id="Store.EvaluationTime" />}
                dataIndex="createTime"
                key="createTime"
                render={(text) => moment(text).format(Const.TIME_FORMAT)}
              />
              <Column
                title={<FormattedMessage id="Store.CommodityRating" />}
                dataIndex="goodsScore"
                key="goodsScore"
              />
              <Column
                title={<FormattedMessage id="Store.ServiceScore" />}
                dataIndex="serverScore"
                key="serverScore"
              />
              <Column
                title={<FormattedMessage id="Store.LogisticsScore" />}
                dataIndex="logisticsScore"
                key="logisticsScore"
              />
              <Column
                title={<FormattedMessage id="Store.comprehensive" />}
                dataIndex="compositeScore"
                key="compositeScore"
                render={(text) => parseFloat(text).toFixed(2)}
              />
            </DataGrid>
          </div>
        </div>
      </Modal>
    );
  }

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { serviceModal } = this.props.relaxProps;
    serviceModal(false);
  };
}
