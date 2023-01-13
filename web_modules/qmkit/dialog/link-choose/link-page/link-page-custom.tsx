/**
 * @使用场景
 * @链接到自定义
 **/

import * as React from "react";
import * as Immutable from "immutable";
export default class LinkPageCustom extends React.Component<any, any> {
  props: {
    chooseData: any;
    changeSelect: Function;
  };
  static defaultProps = {
    chooseData: Immutable.Map(), //选择的对象
    changeSelect: () => {},
  };
  constructor(props) {
    super(props);
    this.state = {
      value: props.chooseData.get("content") || "",
    };
  }
  render() {
    let { value } = this.state;

    return (
      <div className="page-custom">
        <input
          onChange={this.handleChange}
          className="search"
          autoComplete="off"
          id="link_page_custom_input"
          value={value}
          placeholder="输入链接地址,外部链接请加上http://或https://"
        />
      </div>
    );
  }
  handleChange = e => {
    this.setState({ value: e.target.value });
    this.props.changeSelect({ content: e.target.value });
  };
}
