/**
 * 链接分类类目
 */
import * as React from "react";
import { Input, Row, Col } from "antd";
const Search = Input.Search;
import "./category.less";

export interface CategoryProps {
  cateList: any[];
  selectKey: any[];
  changeSelect({
    selectedKeys,
    selectedNames,
    cateInfo,
  }: {
    selectedKeys: string[];
    selectedNames: string;
    cateInfo: any;
  });
}
export default class Category extends React.Component<CategoryProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: ["0", ...this.getRealKey(props.selectKey)],
      keywordList: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    let { selectKey } = nextProps;
    if (selectKey !== this.props.selectKey) {
      selectKey = this.getRealKey(selectKey);
      if (selectKey[0] && selectKey[0] == "0") {
        this.setState({
          selectedKeys: [...selectKey],
        });
      } else {
        this.setState({
          selectedKeys: ["0", ...selectKey],
        });
      }
    }
  }
  getRealKey = selectKey => {
    if (this.props.cateList.includes(selectKey[selectKey.length - 1])) {
      return [];
    }
    return selectKey;
  };
  render() {
    const { cateList } = this.props;
    let { inputVal, selectedKeys, keywordList } = this.state;
    let _Row = [];
    const storeId = (window as any).storeId;
    const catePath = storeId ? [1, 2] : [1, 2, 3];
    const businessCode = (window as any).businessCode;
    _Row = catePath.map((level, index) => {
      let _li = cateList
        .filter(
          item =>
            item.depth === level &&
            item.pid === selectedKeys[level - 1] &&
            (!keywordList[level] ||
              item.label.includes(keywordList[level]) ||
              item.pinyin.includes(keywordList[level]) ||
              item.simplePinyin.includes(keywordList[level])),
        )
        .map((data, index) => {
          return (
            <li
              onClick={() => {
                this.handleSelectCate(data);
              }}
              style={{
                background: data.key === selectedKeys[level] ? "#f7f7f7" : "",
              }}
            >
              <span className="text">{data.label}</span>
              {this.hasSubMenu(data).length !== 0 && (
                <span
                  style={{ position: "absolute", right: "20px", top: "2px" }}
                >
                  >
                </span>
              )}
            </li>
          );
        });

      return (
        <Col span={businessCode == 1 ? 12 : 8}>
          <div className="category">
            <Search
              placeholder="输入名称／拼音字母"
              style={{ width: 193 }}
              onChange={e => {
                this.handleSearch(e.target.value, level);
              }}
            />
            <ul>{_li}</ul>
          </div>
        </Col>
      );
    });
    return (
      <div>
        {cateList.length > 0 ? (
          <div className="classification-content" style={{ width: businessCode == 1 ? 450 : 660 }}>
            <p className="currently-selected">
              <span>您当前选择的是：</span>
              <span>{this.getMenuName().join("/")}</span>
            </p>
            <div className="selected-box">
              <Row>{_Row}</Row>
            </div>
          </div>
        ) : (
          <div className="noGoodsClassify">
            <i className="x-site-new-qIcon information" />
            暂无分类
          </div>
        )}
      </div>
    );
  }

  getMenuName = (selectedKeys = this.state.selectedKeys) => {
    const { cateList } = this.props;
    //const { selectedKeys } = this.state;
    const labels = selectedKeys.slice(1).map(key => {
      const data = cateList.find(item => key === item.key);
      return data ? data.label : "";
    });
    return labels;
  };

  hasSubMenu = item => {
    let { cateList } = this.props;
    let arrList = [];
    for (var i = 0; i < cateList.length; i++) {
      if (cateList[i].pid === item.key) {
        arrList.push(cateList[i]);
      }
    }
    return arrList;
  };

  handleSelectCate = data => {
    let { selectedKeys } = this.state;
    let { cateList } = this.props;
    const level = data.depth;
    let temp = selectedKeys.slice(0, level + 1);
    temp[level] = data.key;
    this.setState({ selectedKeys: temp });
    const selectedNames = this.getMenuName(temp).join(",");
    this.props.changeSelect({
      selectedKeys: temp,
      selectedNames: selectedNames,
      cateInfo: data,
    });
  };

  handleSearch = (value, level) => {
    let { keywordList } = this.state;
    const temp = [...keywordList];
    temp[level] = value;
    this.setState({ keywordList: temp });
  };
}
