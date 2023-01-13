import * as React from 'react';
import { fromJS, Set } from 'immutable';

import { Const, DataGrid, noop, SelectGroup } from 'qmkit';

import RelatedForm from './related-form';
import * as webapi from '../webapi';
import { Select, Table } from 'antd';
import { Relax } from 'plume2';

const { Option } = Select;

const Column = Table.Column;
let recommendationNumber = 1;
/**
 * 商品添加
 */

@Relax
export default class GoodsGrid extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      selectedRows: props.selectedRows ? props.selectedRows : fromJS([]),
      selectedRowKeys: props.selectedSkuIds ? props.selectedSkuIds : [],
      total: 0,
      goodsInfoPage: {},
      searchParams: props.searchParams ? props.searchParams : {},
      showValidGood: props.showValidGood,
      content: []
    };
  }

  props: {
    relaxProps?: {
      productTooltip: any;
      goodsId: any;
    };
  };

  static relaxProps = {
    productTooltip: 'productTooltip',
    goodsId: 'goodsId'
  };

  componentDidMount() {
    this.init(this.props.searchParams ? this.props.searchParams : {});
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.setState({
        searchParams: nextProps.searchParams ? nextProps.searchParams : {},
        goodsInfoPage: nextProps.productTooltip
      });
      this.init(nextProps.searchParams ? nextProps.searchParams : {});
    }
    this.setState({
      selectedRows: nextProps.selectedRows ? nextProps.selectedRows : fromJS([]),
      selectedRowKeys: nextProps.selectedSkuIds ? nextProps.selectedSkuIds : []
    });
  }

  render() {
    const { loading, goodsInfoPage, selectedRowKeys, selectedRows, showValidGood } = this.state;
    const { rowChangeBackFun, visible } = this.props;

    return (
      <div className="content">
        <RelatedForm form={this.props.form} searchBackFun={(res) => this.searchBackFun(res)} />
        <DataGrid
          loading={loading}
          rowKey={(record) => record.goodsId}
          dataSource={goodsInfoPage.content}
          isScroll={false}
          pagination={{
            total: goodsInfoPage.totalElements,
            current: goodsInfoPage.number + 1,
            pageSize: goodsInfoPage.size,
            onChange: (pageNum, pageSize) => {
              const param = {
                pageNum: --pageNum,
                pageSize: pageSize
              };
              this._pageSearch(param);
            }
          }}
          rowSelection={{
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys: any[], selectedTableRows: any[]) => {
              const sRows = fromJS(selectedRows).filter((f) => f);
              let rows = (sRows.isEmpty() ? Set([]) : sRows.toSet()).concat(fromJS(selectedTableRows).toSet()).toList();
              rows = selectedRowKeys.map((key) => rows.filter((row) => row.get('goodsId') == key).first()).filter((f) => f);
              this.setState({
                selectedRows: rows,
                selectedRowKeys
              });
              rowChangeBackFun(selectedRowKeys, fromJS(rows));
            },
            getCheckboxProps: (record) => {
              return { defaultChecked: record.selectedFlag, disabled: record.selectedFlag };
            }
          }}
        >
          <Column
            title="Image"
            dataIndex="Image"
            key="Image"
            render={(rowInfo, i) => {
              if (i) {
                return <img src={i.goodsImg} width="20" />;
              } else {
                return '-';
              }
            }}
          />

          <Column
            title="SPU"
            dataIndex="goodsNo"
            key="goodsNo"
            //ellipsis
          />

          <Column title="Product name" dataIndex="goodsName" key="goodsName" width="200px" />

          <Column title="Sales category" key="storeCateName" dataIndex="storeCateName" />

          <Column title="Product category" key="goodsCateName" dataIndex="goodsCateName" />
          <Column title="Brand" key="brandName" dataIndex="brandName" />
        </DataGrid>
      </div>
    );
  }

  _pageSearch = ({ pageNum, pageSize }) => {
    const params = this.state.searchParams;
    this.init({ ...params, pageNum, pageSize });
    this.setState({
      pageNum,
      pageSize
    });
  };

  init = async (params) => {
    const { goodsId } = this.props.relaxProps;
    if (!params.pageNum) {
      params.pageNum = 0;
    }
    if (!params.pageSize) {
      params.pageSize = 10;
    }
    // params.goodsName = "Baby"
    params.goodsId = goodsId;
    this.setState({
      loading: true
    });

    let { res } = await webapi.fetchproductTooltip({ ...params });

    if ((res as any).code == Const.SUCCESS_CODE) {
      res = (res as any).context.goods;
      // let arr = res.content;
      // let a = arr;
      // let b = this.state.selectedRows.toJS();
      //
      // b.reduce((pre, cur) => {
      //   let target = pre.find((ee) => ee.goodsInfoId == cur.goodsInfoId);
      //   if (target) {
      //     Object.assign(target, cur);
      //   } else {
      //     pre.concat(arr);
      //   }
      //   return pre;
      // }, a);

      this.setState({
        goodsInfoPage: res,
        loading: false
      });
    }
  };

  /**
   * 搜索条件点击搜索的回调事件
   * @param searchParams
   */
  searchBackFun = (searchParams) => {
    if (this.props.searchParams) {
      searchParams = { ...searchParams, ...this.props.searchParams };
    }
    this.setState({ searchParams: searchParams });
    this.init(searchParams);
  };
}
