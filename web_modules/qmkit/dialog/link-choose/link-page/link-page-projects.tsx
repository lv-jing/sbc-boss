import * as React from "react";
import * as Immutable from "immutable";
import { outputGenerate } from 'qmkit';
import {msg} from 'plume2';
// import { msg, log } from "@qianmi/x-site-kit";
import ProjectItem from "./project-item";
import * as D2cLinkApi from "../../common/d2c-link-api";
import { Input, Pagination, Select } from "antd";
import { Scrollbars } from "react-custom-scrollbars";
const { Option } = Select;
const Search = Input.Search;
export default class LinkPageProjects extends React.Component<any, any> {
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
      projectList: [],
      cateList: [],
      cateListAntd: [],
      value: undefined,
      dataRules: "",
      searchValue: "",
      chosenId: "",
      pageSize: 6,
      total: 1, //总页数
      data: [],
      storeValue: undefined,
      fetching: false,
      searchByStore: "",
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
    this._fetchGoodsList({});
    msg.on("clear:chosenId", this.chosenId);
    this._fetchCateList();
    this._getLinkInfo(); //获取老数据
  }

  componentWillUnmount() {
    msg.off("clear:chosenId", this.chosenId);
  }

  /**
   * 渲染出所有的可选商品列表，若 ID 和之前用户所选的 ID 一致，则改商品默认显示勾选状态isChoose
   */
  render() {
    let { projectList, cateList, value, total } = this.state;
    const storeId = (window as any).storeId;

    return (
      <div className="link-page-products">
        <div className="link-tree">
          <Select
            style={storeId ? { width: 350 } : { width: 250 }}
            value={value}
            placeholder="您可输入分类名称搜索"
            size="large"
            allowClear
            showSearch
            onChange={this.onChange}
          >
            {cateList.map(cate => (
              <Option key={cate.projectCateId} value={cate.projectCateId}>
                {cate.projectCateName}
              </Option>
            ))}
          </Select>
        </div>
        <div className="link-search">
          <Search
            placeholder="请输入服务名称搜索"
            onSearch={value => this._search(value)}
            style={{ width: 350 }}
            size="large"
          />
        </div>
        {projectList.length > 0 ? (
          <Scrollbars autoHeight autoHeightMax={350}>
            <div className="products_list">
              <ul>
                {projectList.map((item, index) => {
                  return (
                    <ProjectItem
                      key={item.projectId}
                      item={item}
                      active={this.state.chosenId === item.projectId}
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
            暂无服务
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
   * 关键词搜索服务
   */
  _search = serchValue => {
    let { value } = this.state;
    this.setState({ searchValue: serchValue });
    this._fetchGoodsList({ projectCateId: value, projectName: serchValue });
  };

  onChange = value => {
    let { searchValue } = this.state;
    this.setState({ value });
    this._fetchGoodsList({ projectCateId: value, projectName: searchValue });
  };

  chosenId = () => {
    this.setState({ chosenId: 0 });
  };

  _getLinkInfo = () => {
    let { chooseData } = this.props;
    if (!chooseData) return;
    this.setState({ chosenId: chooseData.get("projectId") });
  };

  /**
   * 点击快速跳转某页面触发，重新调接口
   */
  onShowSizeChange = (current, pageSize) => {
    this.setState({ pageSize });
    let { dataRules, searchValue, storeValue } = this.state;
    this._fetchGoodsList(
      storeValue
        ? {
            pageNum: current - 1,
            q: searchValue,
            type: 1,
            catName: dataRules,
            pageSize: pageSize,
            searchByStore: storeValue,
          }
        : {
            pageNum: current - 1,
            q: searchValue,
            type: 1,
            catName: dataRules,
            pageSize: pageSize,
          },
    );
  };
  /**
   * 点击分页触发，重新调接口
   */
  onPageChange = pageNumber => {
    let { value, searchValue } = this.state;
    this._fetchGoodsList({ projectCateId: value, projectName: searchValue });
  };
  /**
   * 选择某一服务时
   */
  _chosen = index => {
    this.setState({ index, chosenId: this.state.projectList[index].projectId });
    this.props.changeSelect(this.state.projectList[index]);
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

  /**
   * 获取服务列表
   */
  async _fetchGoodsList(type) {
    let api_host = this.props.apiHost;

    let url = "/xsite/project-page";
    let data = await D2cLinkApi.getProjectList(api_host, url, type);

    if (data) {
      // log("查询数据GoodsList返回值 ", data);
      let total = data.total;
      // const { info } = this.props;
      let projectList = data.content.map(item => {
        // item = outputGenerate.extraLinkInfo({ info, originObj: item });
        return item;
      });
      this.setState({
        projectList,
        total,
      });
    }
  }
}
