import * as React from 'react';
import * as Immutable from 'immutable';
import { msg } from 'plume2';
import StoreItem from './store-item';
import * as D2cLinkApi from '../../common/d2c-link-api';
import { Input, Pagination, Button, Form } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
const Search = Input.Search;
const FormItem = Form.Item;
export default class LinkPageProducts extends React.Component<any, any> {
  props: {
    apiHost: string;
    chooseData: any;
    info: string;
    src: string;
    systemCode: string;
    changeSelect: Function;
  };

  constructor(props) {
    super(props);
    this.state = {
      goodList: [],
      searchValue: '',
      chosenId: '',
      pageSize: 6,
      total: 1 //总页数
    };
  }

  static defaultProps = {
    chooseData: Immutable.Map(), //选择的对象
    textValPath: [], //req 对应组件配置的属性路径，由用户配置
    placeholder: '',
    textVal: '', //由用户配置自动生成的．
    info: '', //需要提取的信息...关键字以逗号间隔..
    src: '',
    apiHost: '',
    systemCode: '',
    changeSelect: () => {}
  };

  componentDidMount() {
    this._fetchGoodsList({
      pageNum: 0,
      timingCardName: '',
      pageSize: this.state.pageSize
    });
    msg.on('clear:chosenId', this.chosenId);
    this._getLinkInfo(); //获取老数据
    this.props.changeSelect(this.props.chooseData.toJS());
  }

  componentWillUnmount() {
    msg.off('clear:chosenId', this.chosenId);
  }

  // componentWillReceiveProps(nextProps) {
  //   let { chosenId } = this.state;
  //   if (!nextProps.chooseData) return;
  //   let skuId = nextProps.chooseData.get("skuId");
  //   if (skuId !== chosenId) {
  //     this.setState({
  //       chosenId: skuId,
  //     });
  //   }
  // }
  /**
   * 渲染出所有的可选商品列表，若 ID 和之前用户所选的 ID 一致，则改商品默认显示勾选状态isChoose
   */

  render() {
    let { goodList, total } = this.state;
    return (
      <div className="link-page-products">
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore="店铺名称"
              placeholder="请输入店铺名称"
              onChange={(e: any) => {
                this.setState({ searchValue: e.target.value });
              }}
            />
          </FormItem>

          <FormItem>
            <Button
              type="primary"
              icon="search"
              onClick={() => {
                this._search();
              }}
              htmlType="submit"
            >
              搜索
            </Button>
          </FormItem>
        </Form>

        {goodList.length > 0 ? (
          <Scrollbars autoHeight autoHeightMax={350}>
            <div className="products_list">
              <ul>
                {goodList.map((item, index) => {
                  return (
                    <StoreItem
                      key={item.storeId}
                      item={item}
                      active={this.state.chosenId === item.storeId}
                      onSelect={() => this._chosen(index)}
                    />
                  );
                })}
              </ul>
            </div>
          </Scrollbars>
        ) : (
          <div className="noGoodsClassify">
            <i className="x-site-new-qIcon information" />
            暂无店铺
          </div>
        )}
        <div className="link-pagination">
          <Pagination
            showQuickJumper
            defaultCurrent={1}
            total={total}
            pageSizeOptions={['6', '10', '20']}
            showTotal={() => `共${total} 条`}
            defaultPageSize={this.state.pageSize}
            onShowSizeChange={this.onShowSizeChange}
            showSizeChanger
            onChange={this.onPageChange}
          />
        </div>
      </div>
    );
  }
  /**
   * 关键词搜索商品
   */
  _search = () => {
    let { searchValue, pageSize } = this.state;
    let type = {
      pageNum: 0,
      keywords: searchValue,
      pageSize: pageSize
    };
    this._fetchGoodsList(type);
  };

  chosenId = () => {
    this.setState({ chosenId: 0 });
  };

  _getLinkInfo = () => {
    let { chooseData } = this.props;
    if (!chooseData) return;
    this.setState({ chosenId: chooseData.get('storeId') });
  };
  /**
   * 点击快速跳转某页面触发，重新调接口
   */
  onShowSizeChange = (current, pageSize) => {
    this.setState({ pageSize });
    let { searchValue } = this.state;
    this._fetchGoodsList({
      pageNum: current - 1,
      keywords: searchValue,
      pageSize: pageSize
    });
  };
  /**
   * 点击分页触发，重新调接口
   */
  onPageChange = (pageNumber) => {
    let { searchValue } = this.state;
    let type = {
      pageNum: pageNumber - 1,
      keywords: searchValue,
      pageSize: this.state.pageSize
    };
    this._fetchGoodsList(type);
  };
  /**
   * 选择某一商品时
   */
  _chosen = (index) => {
    this.setState({
      index,
      chosenId: this.state.goodList[index].storeId
    });
    this.props.changeSelect(this.state.goodList[index]);
  };

  /**
   * 获取商品列表
   */
  async _fetchGoodsList(type) {
    let systemCode = 'd2cStore';
    let api_host = this.props.apiHost;

    let url = '/xsite/storeList';
    let data = await D2cLinkApi.getStoreList(api_host, url, type);

    if (data) {
      // log("查询数据店铺返回值 ", data);
      let _rawData;
      let total = 0;
      if (data.content) {
        _rawData = data.content;
        total = data.totalElements;
      }
      this.setState({
        goodList: _rawData,
        total
      });
    }
  }
}
