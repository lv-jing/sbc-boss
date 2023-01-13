/**
 * 链接单个商品组件
 * GoodListItem
 */
import * as React from "react";
export default class SelectList extends React.Component<any, any> {
  static defaultProps = {
    src:
      "//wanmi-x-site.oss-cn-shanghai.aliyuncs.com/x-site/public/img/dialog/img.png",
    visible: false,
  };
  constructor(props) {
    super(props);
  }
  render() {
    let {
      visible,
      getCategoryKey,
      cheekCategory,
      cateList,
      close,
    } = this.props;

    let _li = getCategoryKey.map((item, index) => {
      let spliceName = [];
      item.map((_li, key) => {
        spliceName.push(_li.label);
      });
      return (
        <li
          style={{ cursor: "pointer" }}
          key={index}
          onClick={cheekCategory.bind(this, item)}
        >
          {spliceName.join("|")}
        </li>
      );
    });
    return (
      <div className="select-list">
        <p className="select-list-title">
          <span>匹配到</span>
          <span className="num">{getCategoryKey.length}</span>
          <span>个类目</span>
          <span className="shut-down" onClick={close}>
            关闭返回类目
          </span>
        </p>
        <ul>{visible && _li}</ul>
      </div>
    );
  }
}
