/**
 * @desc
 *
 * @使用场景
 * @链接到文章
 * @author  of1814
 * @company qianmi.com
 * @Date    16/4/18
 **/

/**
 * 旧的文章页
 */
import React from "react";
import Immutable from "immutable";

import { outputGenerate } from "qmkit";
import * as D2pLinkApi from "../../common/d2p-link-api";
import { Pagination } from "antd";
export default class LinkPageArticles extends React.Component<any, any> {
  static defaultProps = {
    chooseData: Immutable.Map(), //选择的对象
    textValPath: [], //req 对应组件配置的属性路径，由用户配置
    placeholder: "",
    textVal: "", //由用户配置自动生成的．
    src: "",
    changeSelect: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      pageSize: 10,
      searchWord: "",
      currentAid:
        (props.chooseData.get("item") &&
          props.chooseData.get("item").get("articlesId")) ||
        "",
      articleList: [],
      iTotalDisplayRecords: 0,
    };
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.chooseData !== this.props.chooseData) {
  //     this.setState({
  //       currentAid:
  //         nextProps.chooseData && nextProps.chooseData.get("articlesId"),
  //     });
  //   }
  // }

  componentDidMount() {
    this._getArticlesList();
  }

  render() {
    const { articleList, currentAid, currentPage, pageSize } = this.state;

    let content = (
      <div className="noGoodsClassify">
        <i className="x-site-new-qIcon information" />暂无文章
      </div>
    );
    if (articleList.length > 0) {
      let pageList = articleList.map((item, index) => {
        let activeClassName = currentAid === item.id ? "active" : "";
        return (
          <li
            key={item.id}
            className={"page_p_common " + activeClassName}
            onClick={this._changeVal.bind(this, item, index)}
          >
            {item.title}
          </li>
        );
      });
      content = (
        <div className="articles-content">
          <div className="articles_list">
            <ul className="list_right articles_right">{pageList}</ul>
          </div>
          <div className="link-pagination">
            <Pagination
              showSizeChanger
              onChange={this.handerChange}
              onShowSizeChange={this.onShowSizeChange}
              defaultCurrent={currentPage}
              total={pageSize}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="page-articles">
        <div>
          <input
            className="input1"
            placeholder="请输入文章标题"
            onChange={e => {
              this._search(e);
            }}
          />
          <span onClick={this._search} className="search" />
        </div>
        {content}
      </div>
    );
  }

  /**
   * 改变文本数值时显示效果(文章)
   */
  _changeVal = (item, index) => {
    if (item.id === this.state.currentAid) return;
    this.setState({
      currentAid: item.id,
      index: index,
    });
    this.props.changeSelect({ item });
  };

  /**
   * 关键字查询
   */
  _search = e => {
    let keyword = e.target.value;
    this.setState({ searchWord: keyword });

    this._getArticlesList(keyword, this.state.currentPage, this.state.pageSize);
  };

  /**
   * 获取所有的文章列表
   */
  _getArticlesList = async (searchWord = "", pageNo = 0, pageSize = 10) => {
    const { src, info } = this.props;
    let data = await this._getAllArticlesList({
      src: src,
      title: searchWord,
      pageNo,
      pageSize,
    });
    let iTotalDisplayRecords, articleList;
    if (data.data.iTotalDisplayRecords) {
      iTotalDisplayRecords = data.data.iTotalDisplayRecords;
    } else if (data.data.totalcount) {
      iTotalDisplayRecords = data.data.totalcount;
    }
    if (data.data.aaData) {
      articleList = data.data.aaData;
    } else if (data.data.datalist) {
      articleList = data.data.datalist;
    }

    articleList = articleList.map(item => {
      return outputGenerate.extraLinkInfo({
        info: info,
        originObj: item,
      });
    });

    this.setState({ iTotalDisplayRecords, articleList });
  };

  _getAllArticlesList = async ({
    src,
    title,
    pageNo,
    pageSize,
  }: {
    src: string;
    title?: string;
    pageNo?: number;
    pageSize?: number;
  }) => {
    let iDisplayLength = pageSize || 10;
    let iDisplayStart = (pageNo || 0) * iDisplayLength;

    let { http, apiHost } = this.props;
    return await D2pLinkApi.getArticleList(apiHost, src, {
      iDisplayStart,
      iDisplayLength,
      title,
    });
  };
  onShowSizeChange = (current, pageSize) => {
    this.setState({ pageSize });
    let { searchWord, currentPage } = this.state;
    this._getArticlesList(searchWord, currentPage, pageSize);
  };
  handerChange = page => {
    this.setState({ pageNo: page });
    let { searchWord, pageSize } = this.state;
    this._getArticlesList(searchWord, page, pageSize);
  };
}
