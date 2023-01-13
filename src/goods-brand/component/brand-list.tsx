import * as React from 'react';
import { Relax } from 'plume2';
import { AuthWrapper, DataGrid, noop } from 'qmkit';
import { List, fromJS, Map } from 'immutable';
import { Modal, Tooltip,Table } from 'antd';
import { FormattedMessage } from 'react-intl';

declare type IList = List<any>;
// const { Column } = DataGrid;

const Column = Table.Column;
const confirm = Modal.confirm;

const styles = {
  edit: {
    paddingRight: 10
  },
  img: {
    display: 'block',
    width: 120,
    height: 50,
    padding: 5,
  },
  supplier: {
    width: '460px',
    display: 'inline-block',
    textAlign: 'left',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    margin: '0'
  }
} as any;

@Relax
export default class BrandList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      dataList: IList;
      doDelete: Function;
      showEditModal: Function;
      pageSize: number;
      pageNum: number;
      total: number;
      init: Function;
      loading: any
    };
  };

  static relaxProps = {
    // 品牌列表
    dataList: 'dataList',
    // 删除品牌
    doDelete: noop,
    // 显示修改弹窗
    showEditModal: noop,
    pageSize: 'pageSize',
    pageNum: 'pageNum',
    total: 'total',
    init: noop,
    loading:'loading'
  };

  render() {
    const { dataList, init, pageSize, pageNum, total,loading } = this.props.relaxProps;
    return (
      <DataGrid
        loading={loading}
        dataSource={dataList.toJS()}
        rowKey="brandId"
        pagination={{
          pageSize,
          total,
          current: pageNum + 1,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize: pageSize });
          }
        }}
      >
        <Column
          title={<FormattedMessage id="Product.brandName" />}
          dataIndex="brandName"
          key="brandName"
          width={100}
        />
        <Column
          title={<FormattedMessage id="Product.brandAlias" />}
          dataIndex="nickName"
          key="nickName"
          render={(nickName) => nickName || '-'}
          width={100}
        />
        <Column
          title={<FormattedMessage id="Product.BrandLogo" />}
          dataIndex="logo"
          key="logo"
          render={(logo) =>
            logo ? <img src={logo} style={styles.img} alt=""/> : '-'
          }
          width={180}
        />
        <Column
          className="supplier"
          title={<FormattedMessage id="Product.supplierNames" />}
          dataIndex="supplierNames"
          key="supplierNames"
          width={480}
          render={(supplierNames) =>
            supplierNames ? (
              <Tooltip placement="top" title={supplierNames}>
                <div style={styles.supplier}>{supplierNames}</div>
              </Tooltip>
            ) : (
              '-'
            )
          }
        />
      </DataGrid>
    );
  }

  /**
   * 显示修改弹窗
   */
  _showEditModal = (
    brandId: string,
    brandName: string,
    nickName: string,
    logo: string
  ) => {
    const { showEditModal } = this.props.relaxProps;
    showEditModal(Map({ brandId, brandName, nickName, logo }));
  };

  /**
   * 删除品牌
   */
  _delete = (brandId: string) => {
    const { doDelete } = this.props.relaxProps;
    confirm({
      title: 'Tips',
      content: 'Are you sure you want to delete this brand？',
      onOk() {
        doDelete(brandId);
      }
    });
  };
}
