import * as React from "react";
import * as Immutable from "immutable";
import { msg } from "plume2";
// import { log, msg } from "@qianmi/x-site-kit";
import "./link-choose-dialog.less";
import LinkPageStore from "./link-page/link-page-store";
import LinkPageProducts from "./link-page/link-page-products";
import LinkPageRechargeableCard from "./link-page/link-page-rechargeableCard";
import LinkPageTimingCard from "./link-page/link-page-timingCard";
import LinkPageProjects from "./link-page/link-page-projects";
import LinkPagePromotion from "./link-page/link-page-promotion";
import LinkPageProjectCategory from "./link-page/link-page-projectCategory";
import LinkPageClassification from "./link-page/link-page-classification";
import LinkPageArticles from "./link-page/link-page-articles";
import LinkPageWebpage from "./link-page/link-page-webpage";
import LinkPageMarketing from "./link-page/link-page-marketing";
import LinkPageUser from "./link-page/link-page-user";
import LinkPageCustom from "./link-page/link-page-custom";
import LinkTarget from "./link-page/link-target";
import { Tabs } from "antd";
const TabPane = Tabs.TabPane;

export interface IProps {
  option: any;
  currentVal: any;
  platform: string;
  saveChooseValue(...args);
  otherInfo: any;
  linkKey: string;
  linkInfo: any;
  systemConfig: any;
  http: any;
  marketingType: any;
  PageService: any;
  linkEdit: any;
  userPageList: any;
  apiHost: string;
  systemCode: string;
  visible: boolean;
  target: boolean;
}

export default class LinkChooseDialog extends React.Component<IProps, any> {
  static defaultProps = {
    systemCode: "",
    linkKey: "", //之前选择的 链接类型  必须要传过来的. 如果为空, 默认第一次.
    linkInfo: Immutable.Map(), //之前选择的 链接信息
    otherInfo: {}, //参考:dialog-edit-group-props-unit  weixin-edit-bar-controller 中传入的值 , ..
    option: {},
    saveChooseValue: () => { },
    visible: true,
    target: false,
  };
  constructor(props) {
    super(props);
    let { linkKey, linkEdit, target } = props;

    this.state = {
      target: target,
      activeKey: linkKey || linkEdit[0].linkKey,
      dataSelect: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    let { linkKey, linkInfo, target } = nextProps;
    let { activeKey } = this.state;
    if (linkKey !== activeKey) {
      this.setState({ activeKey: linkKey, target });
      return;
    }
    // 不同商品的target不同
    if (!Immutable.is(linkInfo, this.props.linkInfo)) {
      this.setState({ target });
    }
  }

  componentDidMount() {
    msg.on("getLinkChooseValue", this._getChooseValue);
    //this.compatibleMarketingPages();
  }
  componentWillUnmount() {
    msg.off("getLinkChooseValue", this._getChooseValue);
  }

  getLinkPage = item => {
    let {
      linkEdit,
      apiHost,
      PageService,
      platform,
      userPageList,
      marketingType,
      linkInfo,
      linkKey,
      systemCode,
      visible,
    } = this.props;
    const pages = {
      storeList: (
        <LinkPageStore
          apiHost={apiHost}
          chooseData={linkInfo}
          info={item.info}
          src={item.src}
          systemCode={systemCode}
          changeSelect={this.changeSelect}
        />
      ),
      goodsList: (
        <LinkPageProducts
          apiHost={apiHost}
          chooseData={linkInfo}
          info={item.info}
          src={item.src}
          systemCode={systemCode}
          changeSelect={this.changeSelect}
        />
      ),
      promotionList: (
        <LinkPagePromotion
          apiHost={apiHost}
          chooseData={linkInfo}
          info={item.info}
          src={item.src}
          systemCode={systemCode}
          changeSelect={this.changeSelect}
        />
      ),
      timingCardList: (
        <LinkPageTimingCard
          apiHost={apiHost}
          chooseData={linkInfo}
          info={item.info}
          src={item.src}
          systemCode={systemCode}
          changeSelect={this.changeSelect}
        />
      ),
      rechargeableCardList: (
        <LinkPageRechargeableCard
          apiHost={apiHost}
          chooseData={linkInfo}
          info={item.info}
          src={item.src}
          systemCode={systemCode}
          changeSelect={this.changeSelect}
        />
      ),
      projectList: (
        <LinkPageProjects
          apiHost={apiHost}
          chooseData={linkInfo}
          info={item.info}
          src={item.src}
          systemCode={systemCode}
          changeSelect={this.changeSelect}
        />
      ),
      projectCategoryList: (
        <LinkPageProjectCategory
          apiHost={apiHost}
          chooseData={linkInfo}
          src={item.src}
          changeSelect={this.changeSelect}
        />
      ),
      categoryList: (
        <LinkPageClassification
          apiHost={apiHost}
          chooseData={linkInfo}
          systemCode={systemCode}
          src={item.src}
          changeSelect={this.changeSelect}
        />
      ),
      articlesList: (
        <LinkPageArticles
          chooseData={linkInfo}
          apiHost={apiHost}
          src={item.src}
          info={item.info}
          changeSelect={this.changeSelect}
        />
      ),
      pageList: (
        <LinkPageWebpage
          apiHost={apiHost}
          excludePageTypes={item.excludePageTypes}
          platform={platform}
          PageService={PageService}
          chooseData={linkInfo}
          changeSelect={this.changeSelect}
        />
      ),
      marketingList: (
        <LinkPageMarketing
          marketingType={marketingType}
          apiHost={apiHost}
          chooseData={linkInfo}
          changeSelect={this.changeSelect}
        />
      ),
      userpageList: (
        <LinkPageUser
          userPageList={userPageList}
          chooseData={linkInfo}
          changeSelect={this.changeSelect}
        />
      ),
      custom: (
        <LinkPageCustom
          {...this.props}
          chooseData={linkInfo}
          changeSelect={this.changeSelect}
        />
      ),
    };
    return pages[item.linkKey];
  };

  render() {
    let {
      linkEdit,
      apiHost,
      PageService,
      platform,
      userPageList,
      marketingType,
      linkInfo,
      linkKey,
      systemCode,
      visible,
      option: { includeType },
    } = this.props;

    const { activeKey, linkEditData, target } = this.state;

    if (includeType && includeType.length > 0) {
      linkEdit = linkEdit.filter(item => includeType.includes(item.linkKey));
    }

    const activeLinkKey = activeKey || linkEdit[0].linkKey;
    const tabTitles = linkEdit.map((item, index) => {
      return (
        <TabPane tab={item.title} key={item.linkKey}>
          {item.linkKey === activeLinkKey && this.getLinkPage(item)}
        </TabPane>
      );
    });

    return (
      <div className="link-edit-content-dialog">
        {visible && (
          <div className="link-edit-title ">
            <Tabs
              onChange={this.changeTab}
              activeKey={activeLinkKey}
              size="small"
            >
              {tabTitles}
            </Tabs>
            <LinkTarget
              platform={platform}
              target={target}
              onChange={this.handleChangeTarget}
            />
          </div>
        )}
      </div>
    );
  }
  changeTab = activeKey => {
    this.setState({ activeKey });
  };
  compatibleMarketingPages = () => {
    const { linkKey, linkInfo } = this.props;
    // 兼容处理: 幸运大转盘 从 常用功能移 到 营销页面
    if (linkKey === "pageList" && linkInfo.get("pageType") === "roulette") {
      this.setState({ activeKey: "marketingList" });
    }
    let linkList = [
      "salesman/recruit",
      "group-buy-center",
      "getcoupon",
      "gift-card-center",
      "integral-goods",
    ];
    if (linkKey === "userpageList" && linkList.includes(linkInfo.get("path"))) {
      this.setState({ activeKey: "marketingList" });
    }
  };

  changeSelect = data => {
    this.setState({ dataSelect: data });
  };
  /**
   * 选择是否新标签页打开
   */
  handleChangeTarget = (isChecked: boolean) => {
    this.setState({ target: isChecked });
  };

  /**
   *　确认 链接选择
   */
  _getChooseValue = () => {
    msg.emit("clear:chosenId");
    const { activeKey, target, dataSelect } = this.state;
    if (dataSelect && dataSelect.then) {
      // 返回 promise
      const result = {
        type: "link",
        linkKey: activeKey || "goodsList",
        info: "",
        target,
      };
      this.props.saveChooseValue({
        promise: dataSelect,
        result,
        key: "info",
      });
      return;
    }
    if (dataSelect) {
      let result = {
        type: "link",
        linkKey: activeKey || "goodsList",
        info: dataSelect,
        target,
      };
      // log("所选中link的对象为:", result);
      this.props.saveChooseValue(result);
    }
  };
}
