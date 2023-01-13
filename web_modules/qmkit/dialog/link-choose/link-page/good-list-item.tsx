/**
 * 链接单个商品组件
 * GoodListItem
 */
import * as React from "react";

export interface GoodsItemProps {
  item: {
    specs: string;
    name: string;
    price: string;
    image: string;
  };
  active: boolean;
  onSelect?();
}
export default class GoodsItem extends React.Component<any, any> {
  static defaultProps = {
    src:
      "//wanmi-x-site.oss-cn-shanghai.aliyuncs.com/x-site/public/img/dialog/img.png",
  };

  render() {
    const { item, active, onSelect } = this.props;
    const { specs, price, name, image } = item;
    return (
      <li
        className={`good-list-item ${active ? "page_p_active" : ""}`}
        onClick={onSelect}
      >
        <img src={image || '//img.1000.com/qm-a-img/prod/default.jpeg'} alt={name} />
        <span className="title">{name}</span>
        <div className="sku">
          <span>规格：</span>
          <ul>
            {specs.map((value, index) => {
              return <li key={index}>{value.valKey}</li>;
            })}
          </ul>
        </div>
        <span className="price">价格：{price}</span>
      </li>
    );
  }
}
