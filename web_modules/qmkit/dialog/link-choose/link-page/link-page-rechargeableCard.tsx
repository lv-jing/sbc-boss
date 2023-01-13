import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Immutable from "immutable";
import { outputGenerate } from "@qianmi/x-site-core";
import QMImg from "qm-ui/lib/QMImg";
import {msg} from 'plume2';
// import { msg, log, optimizeImage } from "@qianmi/x-site-kit";
import RechargeableCardItem from "./rechargeable-card-item";
import * as D2cLinkApi from "../../common/d2c-link-api";
import * as D2pLinkApi from "../../common/d2p-link-api";
import { exchangeCateList } from "./util";
import { TreeSelect, Input, Pagination, Select, Spin } from "antd";
import { Scrollbars } from "react-custom-scrollbars";
const { Option } = Select;
const Search = Input.Search;
const TreeNode = TreeSelect.TreeNode;
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
      searchValue: "",
      chosenId: "",
      pageSize: 6,
      total: 1, //总页数
    };
  }

  static defaultProps = {
    chooseData: Immutable.Map(), //选择的对象
    textValPath: [], //req 对应组件配置的属性路径，由用户配置
    placeholder: "",
    textVal: "", //由用户配置自动生成的．
    info: "", //需要提取的信息...关键字以逗号间隔..
    src: "",
    apiHost: "",
    systemCode: "",
    changeSelect: () => {},
  };

  componentDidMount() {
    this._fetchGoodsList({
      pageNum: 0,
      rechargeableCardName: "",
      pageSize: this.state.pageSize,
    });
    msg.on("clear:chosenId", this.chosenId);
    this._getLinkInfo(); //获取老数据
  }

  componentWillUnmount() {
    msg.off("clear:chosenId", this.chosenId);
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
    let {
      goodList,
      value,
      total,
      searchValue,
    } = this.state;
    const storeId = (window as any).storeId;
    return (
      <div className="link-page-products">
        <div className="link-tree">
          <Search
            placeholder="请输入充值卡名称"
            onSearch={value => this._search(value)}
            style={storeId ? { width: 350 } : { width: 250 }}
            size="large"
          />
        </div>
        {goodList.length > 0 ? (
          <Scrollbars autoHeight autoHeightMax={350}>
            <div className="products_list">
              <ul>
                {goodList.map((item, index) => {
                  return (
                    <RechargeableCardItem
                      key={item.rechargeableCardId}
                      item={item}
                      active={this.state.chosenId === item.rechargeableCardId}
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
            暂无充值卡
          </div>
        )}
        <div className="link-pagination">
          <Pagination
            showQuickJumper
            defaultCurrent={1}
            total={total}
            pageSizeOptions={["6", "10", "20"]}
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
  _search = value => {
    this.setState({ searchValue: value });
    let type = {
      pageNum: 0,
      rechargeableCardName: value,
      pageSize: this.state.pageSize,
    };
    this._fetchGoodsList(type);
  };

  chosenId = () => {
    this.setState({ chosenId: 0 });
  };

  _getLinkInfo = () => {
    let { chooseData } = this.props;
    if (!chooseData) return;
    this.setState({ chosenId: chooseData.get("rechargeableCardId") });
  };
  /**
   * 点击快速跳转某页面触发，重新调接口
   */
  onShowSizeChange = (current, pageSize) => {
    this.setState({ pageSize });
    let { searchValue } = this.state;
    this._fetchGoodsList({
      pageNum: current - 1,
      rechargeableCardName: searchValue,
      pageSize: pageSize,
    });
  };
  /**
   * 点击分页触发，重新调接口
   */
  onPageChange = pageNumber => {
    let { searchValue } = this.state;
    let type = {
      pageNum: pageNumber - 1,
      rechargeableCardName: searchValue,
      pageSize: this.state.pageSize,
    };
    this._fetchGoodsList(type);
  };
  /**
   * 选择某一商品时
   */
  _chosen = index => {
    this.setState({ index, chosenId: this.state.goodList[index].rechargeableCardId });
    this.props.changeSelect(this.state.goodList[index]);
  };

  /**
   * 获取商品列表
   */
  async _fetchGoodsList(type) {
    let systemCode = "d2cStore";
    let api_host = this.props.apiHost;

    let url = "/xsite/rechargeable-card-page";
    let data = await D2cLinkApi.getRechargeableCardList(api_host, url, type);

    if (data) {
      // log("查询数据充值卡返回值 ", data);
      let _rawData;
      let total = 0;
      if (data.content) {
        _rawData = data.content;
        total = data.totalElements;
      }
      this.setState({
        goodList: _rawData,
        total,
      });
    }
  }

}
