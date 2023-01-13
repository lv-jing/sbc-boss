import * as React from "react";
import * as Immutable from "immutable";
// import { outputGenerate } from "@qianmi/x-site-core";
import * as D2cLinkApi from "../../common/d2c-link-api";
// import * as D2pLinkApi from "../../common/d2p-link-api";
import { exchangeCateList } from "./util";
import Category from "./category";
import ClassificationSearch from "./search";
import SelectList from "./select-list";

export default class LinkPageClassification extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      cateList: [],
      visible: false,
      getCategoryKey: "",
      selectKey: [],
    };
  }

  static displayName = "LinkPageClassification";
  props: {
    apiHost: string;
    chooseData: any;
    systemCode: string;
    changeSelect: Function;
    src: string;
  };

  static defaultProps = {
    apiHost: "",
    chooseData: Immutable.Map(), //选择的对象
    systemCode: "",
    changeSelect: () => {},
    src: "",
  };

  componentDidMount() {
    this._fetchCateList();
    this.props.changeSelect(this.props.chooseData.toJS());
  }
  componentWillMount() {
    this.categoryFilter(this.props.chooseData);
  }

  render() {
    let { cateList, visible, getCategoryKey, selectKey } = this.state;

    return (
      <div className="link-page-classification">
        <ClassificationSearch
          visible={visible}
          onSearch={value => {
            this._search(value);
          }}
        />
        {visible && (
          <SelectList
            visible={visible}
            cateList={cateList}
            close={this.close}
            getCategoryKey={getCategoryKey}
            cheekCategory={this.cheekCategory}
          />
        )}
        {!visible && (
          <Category
            cateList={cateList}
            selectKey={selectKey}
            changeSelect={this.handChangeSelect}
          />
        )}
      </div>
    );
  }
  handChangeSelect = ({ selectedKeys, cateInfo, selectedNames }) => {
    this.props.changeSelect({
      selectedKeys,
      cataId: cateInfo.key,
      name: cateInfo.label,
      pathName: selectedNames,
    });
  };
  _search = value => {
    if (!value) return;
    let { cateList } = this.state;
    let arr = [];
    cateList.forEach(list => {
      if (list.label.includes(value)) {
        arr.push(list.key);
      }
    });
    let getCategoryKey = this.getCategoryKey(arr);
    this.setState({ visible: true, getCategoryKey });
  };
  close = () => {
    this.setState({ visible: false });
  };
  cheekCategory = item => {
    let spliceKey = [];
    item.map(value => {
      return spliceKey.push(value.key);
    });
    this.setState({
      visible: false,
      selectKey: [...spliceKey],
    });
  };
  getCategoryKey = arr => {
    let CategoryKey = [];
    arr.map(key => {
      CategoryKey.push(this.getCateKey(key));
    });
    return CategoryKey;
  };
  categoryFilter = chooseData => {
    if (chooseData.get("key")) {
      //  老数据里是有key的
      let keyList = chooseData.get("key").split("-");
      this.setState({
        selectKey: keyList,
      });
    } else if (chooseData.get("selectedKeys")) {
      //为新数据特殊做了一层selectedKeys
      let selectedKeys = chooseData.get("selectedKeys");
      this.setState({
        selectKey: selectedKeys.toJS().slice(1),
      });
    }
  };
  /**
   * 递归分类数据 获取单选后分类的所有父元素name，字符串拼接
   */
  getCateKey = (id: string): any => {
    if (id === undefined) return;
    let list = [];
    const getKey = id => {
      const { pid, label, key } = this.getCateInfo(id);
      list.unshift({ key: key, label: label });
      if (pid !== "0") getKey(pid);
    };
    getKey(id);
    return list;
  };

  /**
   * 获取某个分类的详细信息
   */
  getCateInfo = (id: string): { pid: string; key: string; label: string } => {
    let { cateList } = this.state;
    let { pid, key, label } = cateList.find(item => item.key === id);
    return { pid, key, label };
  };
  async _fetchCateList() {
    let api_host = this.props.apiHost;
    let data;
    let url = "/xsite/goodsCatesForXsite";
    data = await D2cLinkApi.getCateList({ api_host, url });
    this.setState({ cateList: exchangeCateList(data) });
    //   let api_host = this.props.apiHost;
    //   let systemCode = this.props.systemCode;
    //   let url = this.props.src;
    //   let data;
    //   if (systemCode === "d2cStore") {
    //     data = await D2cLinkApi.getCateList({ api_host, url });
    //   } else if (systemCode === "d2p") {
    //     data = await D2pLinkApi.getCateList({ api_host, url });
    //   }
    //   this.setState({ cateList: exchangeCateList(data) });
    // }
  }
}
