import * as React from 'react';
import {Relax} from 'plume2';
import {AuthWrapper, DataGrid, noop, isSystem} from 'qmkit';
import {Modal} from 'antd';
import {IList} from 'typings/globalType';

const confirm = Modal.confirm;
const {Column} = DataGrid;


@Relax
export default class CustomerGrowValueList extends React.Component<any, any> {

  props: {
    relaxProps?: {
      gradeList: IList;
      lastData:any;
      showEditModal: Function;
      deleteGrade: Function;

    };
  };

  static relaxProps = {
    gradeList: 'gradeList',
    showEditModal: noop,
    deleteGrade: noop,
    lastData:"lastData"

  };


  render() {
    const {gradeList,lastData } = this.props.relaxProps;

    return (
      <DataGrid
        rowKey={(record) => record.customerLevelId}
        dataSource={gradeList.toJS()}
        pagination={false}
      >
        <Column
          title="等级名称"
          key="customerLevelName"
          dataIndex="customerLevelName"
          // render={(cateName) => (cateName ? cateName : '-')}
        />

        <Column
          title="等级徽章"
          key="rankBadgeImg"
          dataIndex="rankBadgeImg"
          render={(rankBadgeImg) =>
            rankBadgeImg ? (
              <img
                src={rankBadgeImg}
                style={{ width: 40, height: 40, display: 'inline-block' }}
              />
            ) : (
              '-'
            )}
        />
        <Column
          title="所需成长值"
          key="growthValue"
          dataIndex="growthValue"
        />
        <Column
          title="折扣率"
          key="customerLevelDiscount"
          dataIndex="customerLevelDiscount"
          render={(customerLevelDiscount) => (customerLevelDiscount ? customerLevelDiscount.toFixed(2) : '-')}
        />



        <Column
          title="操作"
          key="goodsId"
          render={(rowInfo) => {
            return (
              <div>
                <div>
                  <AuthWrapper functionName="f_customer_level_1">
                  <a
                      href="javascript:void(0);"
                      onClick={this._showEditModal.bind( this,rowInfo)}
                    >
                      编辑
                    </a>
                  </AuthWrapper>
                  {
                    rowInfo.customerLevelId ==lastData && gradeList.toJS().length >1 &&
                    <AuthWrapper functionName="f_customer_level_2">
                      <a
                        href="javascript:void(0);"
                        style={{ marginLeft: 10 }}
                        onClick={isSystem(() => {
                         this._delete(rowInfo.customerLevelId)
                        })}
                      >
                        删除
                      </a>
                    </AuthWrapper>
                  }
                </div>

              </div>
            )
          }}
        />

      </DataGrid>
    )
  }



  /**
   * 删除
   */
  _delete = (customerLevelId) => {
    const { deleteGrade } = this.props.relaxProps;
    confirm({
      title: '确定要删除当前等级吗？',
      onOk() {
        deleteGrade(customerLevelId);
      }
    });
  };
  /**
   * 显示修改弹窗
   */
  _showEditModal = (rowInfo :object) => {
    const { showEditModal } = this.props.relaxProps;
    showEditModal(rowInfo, false);
  };


}
