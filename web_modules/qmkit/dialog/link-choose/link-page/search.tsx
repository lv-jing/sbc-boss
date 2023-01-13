/**
 * 链接单个商品组件
 * GoodListItem
 */
import * as React from "react";
import { Input, Cascader, Row, Col } from "antd";
const Search = Input.Search;
export default class ClassificationSearch extends React.Component<any, any> {
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let { onSearch, visible } = this.props;
    return (
      <div className="link-search">
        <span className="link-search-title">类目搜索：</span>
        <Search
          placeholder="请输入商品类目关键词"
          onSearch={onSearch}
          style={{
            width: 256,
            display: "inline-block",
            marginTop: 30,
            marginBottom: 25,
          }}
          size="large"
        />
      </div>
    );
  }
}
