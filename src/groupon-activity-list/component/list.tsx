import * as React from 'react';
import { Relax } from 'plume2';
import { Const, DataGrid, noop, AuthWrapper } from 'qmkit';
import { List } from 'immutable';
import moment from 'moment';
import { Link } from 'react-router-dom';

declare type IList = List<any>;
const { Column } = DataGrid;

const AUDIT_STATUS = {
  0: '即将开始',
  1: '进行中',
  2: '已结束',
  3: '待审核',
  4: '审核不通过'
};

@Relax
export default class GrouponActivityList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      form: any;
      dataList: IList;
      pageSize: number;
      pageNum: number;
      total: number;
      init: Function;
      onSelect: Function;
      selected: IList;
      onFieldChange: Function;
      switchShowModal: Function;
      setSticky: Function;
    };
  };

  static relaxProps = {
    // 搜索项
    form: 'form',
    dataList: 'dataList',
    pageSize: 'pageSize',
    pageNum: 'pageNum',
    total: 'total',
    init: noop,
    selected: 'selected',
    onSelect: noop,
    switchShowModal: noop,
    onFieldChange: noop,
    setSticky: noop
  };

  render() {
    const {
      form,
      dataList,
      init,
      pageSize,
      pageNum,
      total,
      selected,
      onSelect,
      switchShowModal,
      onFieldChange,
      setSticky
    } = this.props.relaxProps;
    const { tabType } = form.toJS();
    return (
      <DataGrid
        dataSource={dataList.toJS()}
        rowKey="grouponActivityId"
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selected.toJS(),
          onChange: (selectedRowKeys) => {
            onSelect(selectedRowKeys);
          }
        }}
        pagination={{
          pageSize,
          total,
          current: pageNum + 1,
          onChange: (currentPage, pageSize) => {
            init({ pageNum: currentPage - 1, pageSize: pageSize });
          }
        }}
      >
        <Column title="店铺名称" dataIndex="supplierName" key="supplierName" />
        <Column title="商品名称" dataIndex="goodsName" key="goodsName" />
        <Column
          title="拼团分类"
          key="grouponCateName"
          dataIndex="grouponCateName"
        />
        <Column title="拼团人数" dataIndex="grouponNum" key="grouponNum" />
        {(tabType == '0' || tabType == '1' || tabType == '2') && (
          <Column
            title="已成团"
            key="alreadyGrouponNum"
            dataIndex="alreadyGrouponNum"
          />
        )}
        <Column title="拼团价" dataIndex="grouponPrice" key="grouponPrice" />

        {tabType != '3' && tabType != '4' && (
          <Column
            title="是否精选"
            key="sticky"
            render={(rowInfo) => {
              return (
                <a
                  href="javascript:void(0);"
                  onClick={() => {
                    setSticky(rowInfo.grouponActivityId, !rowInfo.sticky);
                  }}
                >
                  {rowInfo.sticky ? '是' : '否'}
                </a>
              );
            }}
          />
        )}
        <Column
          title="活动开始时间"
          dataIndex="startTime"
          key="startTime"
          render={(rowInfo) => {
            return (
              <div>
                <p>
                  {rowInfo ? moment(rowInfo).format(Const.TIME_FORMAT) : '-'}
                </p>
              </div>
            );
          }}
        />

        <Column
          title="活动结束时间"
          dataIndex="endTime"
          key="endTime"
          render={(rowInfo) => {
            return (
              <div>
                <p>
                  {rowInfo ? moment(rowInfo).format(Const.TIME_FORMAT) : '-'}
                </p>
              </div>
            );
          }}
        />
        <Column
          title="状态"
          key="tabType"
          render={(_rowInfo) => AUDIT_STATUS[tabType]}
        />
        {tabType == '4' && (
          <Column
            title="驳回原因"
            dataIndex="auditFailReason"
            key="auditFailReason"
          />
        )}
        <Column
          title="操作"
          key="option"
          render={(rowInfo) => {
            return (
              <div>
                {tabType == '3' && (
                  <AuthWrapper functionName="f_groupon-activity-refuse">
                    <a
                      href="javascript:void(0);"
                      onClick={() => {
                        onFieldChange(
                          'grouponActivityId',
                          rowInfo.grouponActivityId
                        );
                        switchShowModal(true);
                      }}
                    >
                      驳回
                    </a>
                  </AuthWrapper>
                )}
                &nbsp;
                <AuthWrapper functionName="f_groupon-activity-detail">
                  <Link to={`/groupon-detail/${rowInfo.grouponActivityId}`}>
                    查看
                  </Link>
                </AuthWrapper>
              </div>
            );
          }}
        />
      </DataGrid>
    );
  }
}
