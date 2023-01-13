import React, { Component } from "react";
import Immutable from "immutable";
// import { msg, log } from "@qianmi/x-site-kit";
import * as D2cLinkApi from "../../common/d2c-link-api";
import { Radio, Input, Table, Pagination } from "antd";
// import { spawn } from "child_process";
import { MarketingTypeItem } from "../../common/linkConfig";

const NoDataPanel = () => {
  return <div>暂无数据</div>;
};

interface ItemProps {
  icon: string;
  name: string;
  key: string;
  color: string;
  specs: "single" | "more";
  hasRadio: boolean;
  active: boolean;
  onSelect(): void;
  disabledTip: React.ReactNode;
  disabled: boolean;
  pageType: string;
}

class MarketingItem extends Component<ItemProps, any> {
  render() {
    const {
      active,
      key,
      name,
      color,
      icon,
      specs,
      hasRadio,
      disabled,
      disabledTip,
      pageType,
    } = this.props;
    let radioItem = hasRadio ? (
      <span className="marketing-radio flex-1">
        <input
          type="radio"
          name="marketing-type"
          checked={active}
          disabled={disabled}
          onChange={disabled ? e => {} : this.props.onSelect}
        />
      </span>
    ) : (
      <span className="marketing-radio" />
    );

    return (
      <li
        className="_li"
        style={{ backgroundColor: active ? "#ededed" : "" }}
        onClick={disabled ? e => {} : this.props.onSelect}
      >
        <div
          className="li-left"
          style={{ cursor: disabled ? "not-allowed" : "pointer" }}
        >
          {radioItem}
          <i
            className={"x-site-new-qIcon marketing-icon " + icon}
            style={{ backgroundColor: color }}
          />
          <span className="marketing-name">{name}</span>
        </div>
        {disabled && disabledTip}
        {this.props.children}
      </li>
    );
  }
}

class DisabledTip extends Component<any, any> {
  render() {
    let { getPermissions, pageType } = this.props;
    let tipType = {
      "group-buy-center": {
        url: "https://app.1000.com/#/mc/app/groupon",
        title: "多人拼团",
      },
      salesman: {
        url: "https://app.1000.com/#/mc/app/salesman",
        title: "推广达人",
      },
    };

    const { title, url } = tipType[pageType];
    return (
      <span className="disabled-tip">
        <span className="no-open-group">
          您尚未开启{title}，<a href={url} target="_blank">
            立即前往
          </a>
        </span>
        <i
          onClick={getPermissions}
          className="x-site-new-qIcon huanyihuan refresh"
        />
      </span>
    );
  }
}

interface ItemDetailProps {}
class MarketingItemDetail extends Component<ItemDetailProps, any> {
  render() {
    return <div />;
  }
}

class MarketingPageItem extends Component<any, any> {
  render() {
    let { name, startTime, endTime, status, id, active, type } = this.props;
    let statusType = {
      MC_RUN: "进行中",
      MC_WAIT: "未开始",
    };
    return (
      <li style={{ backgroundColor: active ? "#f9f9f9" : "#" }}>
        <label>
          <span className="flex-1" style={{ textAlign: "center" }}>
            <input
              type="radio"
              name={type}
              value={id}
              checked={active}
              onChange={e => this.props.onSelect(e.target.value)}
            />
          </span>
          <span className="flex-2" style={{ overflow: "hidden" }}>
            {name}
          </span>
          <span className="flex-6">{startTime + "~" + endTime}</span>
          <span className="flex-2">{statusType[status] || "进行中"}</span>
        </label>
      </li>
    );
  }
}

export default class LinkPageMarketing extends React.Component<any, any> {
  constructor(props) {
    super(props);
    let { pageType } = props.chooseData.toJS();
    this.state = {
      activeMarketType: "",
      activeType: pageType || "", //当前选中的页面类型
      activeCode: null, // 当前选中的pageCode(活动id)
      hasRadio: true,
      markingList: [],
      isOpenSaleman: false,
      isOpenGroup: true,
      // 分页相关
      total: 0,
      pageNum: 0,
      pageSize: 10,
      loading: true,
    };
  }

  static displayName = "LinkPageMarketing";

  props: {
    apiHost: string;
    marketingType: MarketingTypeItem[];
    chooseData: any;
    changeSelect: Function;
  };

  static defaultProps = {
    apiHost: "",
    marketingType: [],
    chooseData: Immutable.Map(), //选择的对象
    changeSelect: () => {},
  };

  async componentDidMount() {
    await Promise.all([this.getIsOpenGroup(), this.getIsOpenSalesman()]);
    await this.getCompatible();
  }
  /**
   * 渲染出所有的可选商品列表，若 ID 和之前用户所选的 ID 一致，则改商品默认显示勾选状态 isChoose
   */
  render() {
    let { marketingType } = this.props;
    let {
      activeType,
      hasRadio,
      markingList,
      activeCode,
      isOpenSaleman,
      isOpenGroup,
      total,
      loading,
    } = this.state;

    return (
      <div className="page-marketing">
        <ul className="page-marketing-list">
          {marketingType.map((item, index) => (
            <MarketingItem
              key={item.pageType}
              specs={item.specs}
              icon={item.icon}
              color={item.color}
              name={item.name}
              hasRadio={hasRadio}
              disabled={
                item.pageType === "group-buy-center"
                  ? isOpenGroup
                  : item.pageType === "salesman"
                    ? isOpenSaleman
                    : false
              }
              pageType={item.pageType}
              disabledTip={
                <DisabledTip
                  pageType={item.pageType}
                  getPermissions={() => {
                    if (item.pageType === "salesman") {
                      this.getIsOpenSalesman();
                    }
                    if (item.pageType === "group-buy-center") {
                      this.getIsOpenGroup();
                    }
                  }}
                />
              }
              active={item.pageType === activeType}
              onSelect={() => this.handleSelectType(item)}
            >
              {this.getMarketingItemDetail(item)}
            </MarketingItem>
          ))}
        </ul>
      </div>
    );
  }
  /**
   * 获取选择的营销类型，对应的相应详情列表页面
   */
  getMarketingItemDetail = (item: MarketingTypeItem) => {
    const {
      activeType,
      hasRadio,
      markingList,
      activeCode,
      isOpenSaleman,
      total,
      pageNum,
      pageSize,
      isOpenGroup,
      loading,
    } = this.state;
    const isActive = item.pageType === activeType;
    if (item.specs === "single") return null;
    if (item.pageType === "salesman") {
      let salesmanList = this.getSalemanList().map((data, index) => {
        const isActive = data.id === activeCode;
        return (
          <li
            key={index}
            className="saleman-li"
            style={{ backgroundColor: isActive ? "#f9f9f9" : "" }}
          >
            <label>
              <input
                type="radio"
                name={item.pageType}
                value={data.id}
                checked={isActive}
                onChange={e => {
                  this.handleSelectPageCode(data.id, item.pageType);
                }}
              />
              <span className="name">{data.name}</span>
            </label>
          </li>
        );
      });
      return (
        <div
          className="marketing-table"
          style={{ display: isActive ? "block" : "none" }}
        >
          <ul className="saleman-ul">{salesmanList}</ul>
        </div>
      );
    }
    return (
      <div
        className="marketing-table"
        style={{ display: isActive ? "block" : "none" }}
      >
        <div className="page-table">
          <p className="table-header">
            <span className="flex-1" />
            <span className="flex-2">活动名称</span>
            <span className="flex-6">活动时间</span>
            <span className="flex-2">活动状态</span>
          </p>
          <ul className="table-main">
            {markingList.map((data, index) => {
              return (
                <MarketingPageItem
                  key={data.id}
                  type={item.pageType}
                  id={data.id}
                  name={data.name}
                  startTime={data.startTime}
                  endTime={data.endTime}
                  status={data.status}
                  active={data.id === activeCode}
                  onSelect={value => {
                    this.handleSelectPageCode(value, item.pageType);
                  }}
                />
              );
            })}
            {markingList.length === 0 && (
              <li
                style={{
                  textAlign: "center",
                  color: "#999",
                }}
              >
                暂无页面
              </li>
            )}
          </ul>
        </div>
        <div className="link-pagination">
          <Pagination
            showQuickJumper
            current={pageNum + 1}
            total={total}
            pageSizeOptions={["3", "5", "10", "20"]}
            showTotal={() => `共${total} 条`}
            pageSize={pageSize}
            showSizeChanger
            onShowSizeChange={this.onShowSizeChange}
            onChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  };

  getSalemanList = () => {
    return [
      {
        name: "推广员中心",
        pageType: "salesman",
        id: "",
      },
      {
        name: "招募海报",
        pageType: "salesman",
        id: "recruit",
      },
    ];
  };

  /**
   * 切换营销类型
   */
  handleSelectType = (item: MarketingTypeItem) => {
    const { pageNum, pageSize, activeType } = this.state;
    if (activeType === item.pageType) return;
    const hasRadio = item.specs === "single";

    this.setState({
      activeType: item.pageType,
      activeMarketType: item.interfaceUrl,
      hasRadio,
      pageNum: 0,
    });
    hasRadio && this.props.changeSelect({ pageType: item.pageType });
    item.interfaceUrl &&
      this._fetchMarkingList({
        marketType: item.interfaceUrl,
        pageNum: 0,
        pageSize,
      });
  };

  /**
   * 切换营销子页面id
   */
  handleSelectPageCode = (pageCode, pageType) => {
    this.setState({ activeCode: pageCode });
    this.props.changeSelect({ pageType: pageType, pageCode });
  };

  /**
   * 为老页面的的页面下大转盘转移到营销tab这下
   */
  getCompatible = async () => {
    const { pageNum, pageSize } = this.state;
    let { chooseData, marketingType } = this.props;
    let { pageType, pageCode, link } = this.props.chooseData.toJS();

    if (!pageType) return;
    let { interfaceUrl } = marketingType.find(
      item => item.pageType === pageType,
    ) || { interfaceUrl: "" };
    if (!interfaceUrl) return;

    await this._fetchMarkingList({
      marketType: interfaceUrl,
      pageNum,
      pageSize,
    });
    this.setState({
      activeType: pageType,
      activeMarketType: interfaceUrl,
      activeCode: pageCode,
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const { activeMarketType } = this.state;
    this.setState({ pageNum: 0, pageSize });
    this._fetchMarkingList({
      pageNum: 0,
      pageSize,
      marketType: activeMarketType,
    });
  };

  handlePageChange = (pageNum: number) => {
    const { pageSize, activeMarketType } = this.state;
    this.setState({
      pageNum: pageNum - 1,
    });
    this._fetchMarkingList({
      marketType: activeMarketType,
      pageNum: pageNum - 1,
      pageSize,
    });
  };

  /**
   * 初始化获取活动列表
   */
  async _fetchMarkingList({ marketType, pageNum, pageSize }) {
    if (!marketType) return;
    if (marketType === "SALESMAN") return;
    const api_host = this.props.apiHost;
    const data = await D2cLinkApi.getMarkingList({
      api_host,
      url: "/marketing/list",
      typeEnum: marketType,
      pageNum,
      pageSize,
    });

    this.setState({ markingList: data.dataList, total: data.totalCount });
  }
  /**
   * 获取多人拼团是否开通
   */
  async getIsOpenGroup() {
    const data = await D2cLinkApi.getIsOpenGroup({
      url: "/groupon/settings",
    });

    this.setState({
      isOpenGroup: data.openStatus !== "Y",
    });
  }
  /**
   * 获取推广达人是否开通
   */
  async getIsOpenSalesman() {
    const api_host = this.props.apiHost;
    const data = await D2cLinkApi.getMarkingList({
      api_host,
      url: "/salesman/settings",
      typeEnum: "SALESMAN",
    });
    this.setState({
      isOpenSaleman: (data && data.isOpen !== "Y") || data === null,
      markingList: [],
    });
  }
}
