/**
 * @desc
 * @使用场景
 * @链接到页面
 * @author  of1814
 * @company qianmi.com
 * @Date    16/4/21
 **/

import * as React from "react";
import * as Immutable from "immutable";
import * as D2cLinkApi from "../../common/d2c-link-api";
import {Pagination, Input, Button, Form} from "antd";
import moment from "moment";
const FormItem = Form.Item;
declare let window: any;

export interface PageInfo {
  key: string;
  pageType: string;
  pageCode: string | number;
  title: string;
  changeSelect: Function;
  [prop: string]: any;
}

export interface IState {
  activeKey: string;
  pageList: PageInfo[];
  totalCount: number;
  pageSize: number;
  title: string;
}

// 自定义生成key规则:
const createKey = ({ pageType, pageCode }) => pageType + "/" + pageCode;

export default class LinkPageWebpage extends React.Component<any, IState> {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: createKey(props.chooseData.toJS()) || "",
      pageList: [],
      totalCount: 0,
      pageSize: 3,
      title: "",
    };
  }

  static defaultProps = {
    chooseData: Immutable.Map(), //选择的对象
    placeholder: "",
    excludePageTypes: [],
    changeSelect: () => {},
  };

  componentDidMount() {
    this.fetchPageList({
      pageNo: 0,
      pageSize: this.state.pageSize,
    });
    this.props.changeSelect(this.props.chooseData.toJS());
  }

  render() {
    const { pageList, activeKey, totalCount, title } = this.state;
    const { isShow } = this.props;
    pageList;

    return (
      <div className="webpages">
        <div className="page-content">
          <Form className="filter-content" layout="inline">
            <FormItem>
              <Input
                addonBefore="页面名称"
                placeholder="请输入页面名称"
                onChange={(e: any) => {
                  this.setState({ title: e.target.value }); //获取筛选值
                }}
              />
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                icon="search"
                onClick={() => {
                  this.onSearch(title);
                }}
              >
                搜索
              </Button>
            </FormItem>
          </Form>
          <div className="page-table">
            <p className="table-header">
              <span className="flex-1" />
              <span className="flex-4">页面名称</span>
              <span className="flex-4">发布时间</span>
              <span className="flex-2">页面类型</span>
            </p>
            <ul className="table-main">
              {pageList.map((item, index) => {
                let { title, updateTime, pageType, pageCode } = item;
                let isActiveKey = pageType + "/" + pageCode === activeKey;
                const pageTypeName = getPageTypeName(pageType);
                updateTime = moment(updateTime).format("YYYY-MM-DD HH:mm:ss");
                return (
                  <li key={index}>
                    <label>
                      <span className="flex-1" style={{ textAlign: "center" }}>
                        <input
                          type="radio"
                          checked={isActiveKey}
                          name="webpage"
                          value={pageType + "/" + pageCode}
                          onChange={this.changeVal.bind(this, item)}
                        />
                      </span>
                      <span className="flex-4">{title}</span>
                      <span className="flex-4">{updateTime}</span>
                      <span className="flex-2" style={{ color: "#45BE89" }}>
                        {pageTypeName}
                      </span>
                    </label>
                  </li>
                );
              })}
              {pageList.length === 0 && (
                <li className="no-data-panel">暂无页面</li>
              )}
            </ul>
          </div>
          <div className="link-pagination">
            {totalCount > 0 && (
              <Pagination
                showQuickJumper
                defaultCurrent={1}
                total={totalCount}
                pageSizeOptions={["3", "5", "10", "20"]}
                defaultPageSize={this.state.pageSize}
                showTotal={() => `共${totalCount} 条`}
                showSizeChanger
                onShowSizeChange={this.onShowSizeChange}
                onChange={this.onPageChange}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  onPageChange = pageNumber => {
    let data = {
      pageNo: pageNumber - 1,
      pageSize: this.state.pageSize,
    };
    this.fetchPageList(data);
  };

  onShowSizeChange = (current, pageSize) => {
    this.setState({ pageSize });
    this.fetchPageList({ pageNo: current - 1, pageSize: pageSize });
  };

  /**
   * 改变文本数值时显示效果(文章)
   */
  changeVal = item => {
    let { pageType, pageCode } = item;
    this.setState({ activeKey: createKey({ pageType, pageCode }) });
    this.props.changeSelect(item);
  };

  onSearch = (title) => {
    let data = {
      pageNo: 0,
      pageSize: this.state.pageSize,
      title: title,
    };
    this.fetchPageList(data);
  };
  /**
   * 获取所有的页面列表
   */
  fetchPageList = async data => {
    const { platform, PageService, excludePageTypes } = this.props;
    let { pageSize, title } = this.state;
    const storeId = window.storeId;
    const context = await D2cLinkApi.getPageList(
      storeId
        ? {
            excludePageTypeList: excludePageTypes,
            platform,
            title,
            storeId,
            ...data,
          }
        : {
            excludePageTypeList: excludePageTypes,
            platform,
            title,
            ...data,
          },
    );

    let totalCount = context.totalCount;
    let pageInfoList = context.pageInfoList;

    const canSelectPage = data =>
      excludePageTypes.indexOf(data.pageType) === -1;
    const insertInfo = item => ({
      ...item,
      key: createKey(item), // 生产唯一id
    });
    const availablePageList = pageInfoList
      .filter(canSelectPage)
      .map(insertInfo);

    this.setState({ pageList: availablePageList, totalCount: totalCount });
  };
}

/**
 * 获取pageType 对应的页面类型名称
 * TODO: 应该在线获取,暂时满足条件
 */
function getPageTypeName(pageType: string) {
  const TYPELIST = {
    index: "首页",
    goodsList: "列表页",
    goodsInfo: "详情页",
    article: "文章页",
    custom: "海报页",
    poster: "海报页",
    classify: "分类页",
    service: "客服页",
  };
  return TYPELIST[pageType];
}
