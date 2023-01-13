import * as React from "react";
// import { log, msg } from "@qianmi/x-site-kit";
import { Map } from "immutable";
import { Relax, msg } from "plume2";
import { Modal } from "antd";
import getLinkConfig from "../common/linkConfig";
export default class LinkChoose extends React.Component<any, any> {
  state: {
    visible: boolean;
    option: any;
    linkDialog?: any;
    dataInfo?: any; //选中的对接值
    otherInfo?: any;
    changeVal?: any;
  };
  props: {
    PageService: {
      getPageList(...args);
    };
    platform: string;
    systemCode: string;
    apiHost: string;
    onChooseImage?(...args): Promise<any>;
  };
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      linkDialog: "",
      dataInfo: Map(),
      option: {},
      changeVal: () => { },
    };
  }
  chooseValue: any = "";
  componentDidMount() {
    msg.on("edit:chooseLink", this.chooseLink);
  }
  componentWillUnmount() {
    msg.off("edit:chooseLink", this.chooseLink);
  }
  render() {
    let { visible, option, dataInfo, otherInfo, linkDialog } = this.state;
    let LinkDialog = linkDialog;
    let { systemCode } = this.props;
    let {
      linkEdit = [],
      userPageList = [],
      marketingType = [],
    } = this.getConfigData();
    return visible && (
      <Modal
        className="xsite-media-dialog-wm"
        title=""
        style={{ top: 140 }}
        width={984}
        visible={visible}
        okText="确认"
        cancelText="取消"
        onOk={this.confirm}
        onCancel={this.closeModal}
      >
        <LinkDialog
          {...this.props}
          linkKey={dataInfo.get("linkKey")}
          linkInfo={dataInfo.get("info")}
          target={dataInfo.get("target")}
          dataInfo={dataInfo}
          option={option}
          visible={visible}
          systemCode={systemCode}
          otherInfo={otherInfo}
          linkEdit={linkEdit}
          userPageList={userPageList}
          marketingType={marketingType}
          saveChooseValue={this._saveChooseValue}
        />
      </Modal>
    );
  }

  //拿到当前店铺场景
  getConfigData = () => {
    const { systemCode, platform } = this.props;
    return getLinkConfig({ systemCode, platform });
  };

  /**
   * 弹出超级链接选择框, 供用户选择超级链接.
   * currentVal:最终生成的链接值 [可以不传了]
   * __data_info:之前选择后生成的对象 immutable
   * option: 可选信息
   * otherInfo: 编辑时传入的信息
   * initiator 弹出框使用者 当事件发起人是 富文本编辑器的时候 关闭弹出框 取消重置微信编辑框的位置
   */
  private chooseLink = async ({
    currentVal,
    __data_info,
    otherInfo,
    option,
    initiator,
    changeVal,
  }) => {
    // log("选择链接:");
    this.chooseValue = currentVal;
    const dialog = await import(/* webpackChunkName: "dialog-link" */ "./link-choose-dialog");
    let linkList = [
      "salesman/recruit",
      "group-buy-center",
      "getcoupon",
      "gift-card-center",
      "integral-goods",
    ];
    let linkMap = {
      "/salesman/recruit": "sales-man",
      "/group-buy-center": "group-buy-center",
      "/getcoupon": "getcoupon",
      "/gift-card-center": "gift-card-center",
      "/integral-goods": "integral-goods",
    };
    if (
      __data_info &&
      __data_info.get("linkKey") &&
      __data_info.get("info").get("pageType") === "roulette"
    ) {
      __data_info = __data_info.set("linkKey", "marketingList");
    } else if (
      __data_info &&
      __data_info.get("linkKey") === "userpageList" &&
      linkList.includes(__data_info.getIn(["info", "path"]))
    ) {
      __data_info = __data_info.set("linkKey", "marketingList");
      let link = __data_info.getIn(["info", "link"]);
      __data_info = __data_info.setIn(["info", "pageType"], linkMap[link]);
    }
    if (
      option &&
      __data_info &&
      option.includeType &&
      !option.includeType.includes(__data_info.get("linkKey"))
    ) {
      // 容错处理，tab下指定option下没有的tab，默认指向商品
      __data_info = __data_info.set("linkKey", option.includeType[0]);
    }
    this.setState({
      type: "link",
      currentVal,
      linkDialog: dialog.default,
      dataInfo: __data_info || Map(),
      otherInfo,
      option,
      initiator,
      changeVal,
      visible: true,
    });
  };

  /**
   * 图片或者链接选中后返回回来的值
   * @param chooseValue
   * @private
   */
  private _saveChooseValue = chooseValue => {
    this.chooseValue = chooseValue;
  };

  confirm = () => {
    msg.emit("getLinkChooseValue");
    const chooseValue = this.chooseValue;
    const { promise, result, key } = chooseValue;

    //返回回来的包含promise,预期是{promise, result, key}
    // [].toString.call(promise) === "[object Promise]"
    if (promise && promise.then) {
      return promise.then(data => {
        result[key] = data; // 最终结果放入result 的 key 对应的 value
        // log("选择后的对象为:", data);
        this.state.changeVal(result);
        this.closeModal();
      });
    }

    // normal
    // log("选择后的对象为:", chooseValue);
    this.state.changeVal(chooseValue);
    this.closeModal();
  };

  closeModal = () => {
    this.setState({
      visible: false,
    });
  };
}
