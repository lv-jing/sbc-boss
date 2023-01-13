import * as React from "react";
import * as Immutable from "immutable";
import { outputGenerate } from "@qianmi/x-site-core";
import * as D2cLinkApi from "../../common/d2c-link-api";
import { Input } from "antd";
const Search = Input.Search;
import "./projectCategory.less";

export default class LinkPageClassification extends React.Component<any, any> {
  constructor(props) {
    super(props);
    const projectCateId =
      props.chooseData && props.chooseData.get("projectCateId");
    this.state = {
      cateList: [],
      cateId: projectCateId ? projectCateId : "",
      keyword: "",
    };
  }

  static displayName = "LinkPageClassification";
  props: {
    apiHost: string;
    chooseData: any;
    changeSelect: Function;
    src: string;
  };

  static defaultProps = {
    apiHost: "",
    chooseData: Immutable.Map(), //选择的对象
    changeSelect: () => {},
    src: "",
  };

  componentDidMount() {
    this._fetchCateList();
  }

  render() {
    let { cateList, cateId, keyword } = this.state;

    return (
      <div className="project-category">
        <div className="wrapper">
          <div className="content">
            <Search
              placeholder="输入名称／拼音字母"
              style={{ width: 220 }}
              onChange={e => {
                this.handleSearch(e.target.value);
              }}
            />
            <ul>
              {cateList &&
                cateList
                  .filter(cate => cate.projectCateName.includes(keyword))
                  .map(cate => {
                    return (
                      <li
                        key={cate.projectCateId}
                        onClick={() => this.handleSelectCate(cate)}
                        style={{
                          background:
                            cate.projectCateId === cateId ? "#f7f7f7" : "",
                        }}
                      >
                        <span className="text">{cate.projectCateName}</span>
                      </li>
                    );
                  })}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  /**
   * 选择分类
   */
  handleSelectCate = cate => {
    this.setState({
      cateId: cate.projectCateId,
    });
    this.props.changeSelect(cate);
  };

  /**
   * 修改搜索条件
   */
  handleSearch = keyword => {
    this.setState({
      keyword,
    });
  };

  /**
   * 初始化获取分类列表
   */
  async _fetchCateList() {
    let api_host = this.props.apiHost;
    let data;
    let url = "/xsite/simple-project-cate";
    data = await D2cLinkApi.getProjectCateList({ api_host, url });
    this.setState({ cateList: data });
  }
}
