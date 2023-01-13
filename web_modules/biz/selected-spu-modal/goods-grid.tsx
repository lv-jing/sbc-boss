import * as React from 'react';
import {  fromJS } from 'immutable';
import moment from 'moment';
import { DataGrid, Const } from 'qmkit';

import SearchForm from './search-form';
import * as webapi from './webapi';

const { Column } = DataGrid;

/**
 * 商品添加
 */
export default class GoodsGrid extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      selectedRows: props.selectedRows
        ? props.selectedRows
        : fromJS([]),
      selectedRowKeys: props.selectedSkuIds
        ? props.selectedSkuIds        
        : [],
      total: 0,
      spuInfoPage:fromJS({}),      
      searchParams: {},
      showValidGood: props.showValidGood
    };
  }

  componentDidMount() {    
    this.init({});
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.init({});
    }
    this.setState({
      selectedRows: nextProps.selectedRows
        ? nextProps.selectedRows
        : fromJS([]),
      selectedRowKeys: nextProps.selectedSkuIds ? nextProps.selectedSkuIds : []
    });
  }

  render() {
    const {
      loading,
      spuInfoPage,
      selectedRowKeys,      
    } = this.state;
    const { rowChangeBackFun, visible } = this.props;
    return (
      !this.state.loading?<div className="content">        
        {/*search*/}
        <SearchForm searchBackFun={this.searchBackFun} visible={visible} />
        
        <DataGrid
          loading={loading}
          rowKey={(record) => record.goodsInfoId}
          dataSource={spuInfoPage.get('grouponSettingGoodsVOList').toJS()}
          pagination={{
            total: spuInfoPage.get('total'),
            current: spuInfoPage.get('number') + 1,
            pageSize: 10,
            onChange: (pageNum, pageSize) => {
              const param = {
                pageNum: pageNum-1,    
                pageSize:pageSize           
              };
             this._pageSearch(param);
            }
          }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys: any[], selectedTableRows: any[]) => {   
              // const sRows = fromJS(selectedRows).filter((f) => f);
              // let rows = (sRows.isEmpty() ? Set([]) : sRows.toSet())
              //   .concat(fromJS(selectedTableRows).toSet())
              //   .toList();
              // rows = selectedRowKeys
              //   .map((key) =>
              //     rows.filter((row) => row.get('goodsId') == key).first()
              //   )
              //   .filter((f) => f);
              // this.setState({
              //   selectedRows: rows,
              //   selectedRowKeys
              // });
              rowChangeBackFun(selectedRowKeys, fromJS(selectedTableRows));
            },
            getCheckboxProps: (record) => ({
              disabled: record.addedFlag === 0
            })
          }}
        >
          <Column
            title="商品图片"
            dataIndex="goodsImg"
            key="goodsImg"
            width="15%"
            render={(text) => {
              return (
                 <div>
                   <img style={{width:40,height:40}} src={text?text:require('./none.png')}/>
                 </div>   
              )
            }}
          />

          <Column
            title="商品名称"
            dataIndex="goodsName"
            key="goodsName"
            width="25%"
          />       

          <Column
            title="SPU编码"
            dataIndex="goodsNo"
            key="goodsNo"
            width="25%"
          />     

          <Column
            title="拼团价"
            key="grouponPrice"
            dataIndex="grouponPrice"
            width="20%"
            render={(text) => {
              return  text?'￥'+text.toFixed(2):'￥0.00';
            }}
          />

          <Column
            title="活动时间"
            key="activityTime"
            dataIndex="activityTime"
            width="35%"
            render={(_text,rowInfo:any) => {
            return(
            <div>
              <span >
              {moment(rowInfo.startTime).format(Const.TIME_FORMAT)}
              ～{moment(rowInfo.endTime).format(Const.TIME_FORMAT)}
              </span>
            </div>
            )
            }}
          /> 
        </DataGrid>
      </div>:null
    );
  }

  _pageSearch = ({ pageNum }) => {
    const params = this.state.searchParams;
    this.init({ ...params, pageNum });
    this.setState({
      pageNum      
    });
  };

  init = async (params) => {    
    if (!params.pageNum) {
      params.pageNum = 0;
    }
    if (!params.pageSize) {
      params.pageSize = 10;
    }    
    let { res } = await webapi.getValidSpus({
      ...params
    });

    if ((res as any).code == Const.SUCCESS_CODE) {      
      res = (res as any).context;
      this.setState({
        spuInfoPage: fromJS(res),
        loading: false
      });
    }
  };

  /**
   * 搜索条件点击搜索的回调事件
   * @param searchParams
   */
  searchBackFun = (searchParams) => {
    this.setState({ searchParams: searchParams });
    this.init(searchParams);
  };
}
