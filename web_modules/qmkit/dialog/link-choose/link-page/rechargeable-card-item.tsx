/**
 * 链接单个商品组件
 * GoodListItem
 */
import * as React from "react";

const image =
  "//wanmi-x-site.oss-cn-shanghai.aliyuncs.com/x-site/public/images/recharge-card.png";
export interface RechargeableCardItemProps {
  item: {
    validityFlag: string;
    rechargeableCardName: string;
    price: string;
    presentPrice: string;
    validityDays: string;
  };
  active: boolean;
  onSelect?();
}
export default class RechargeableCardItem extends React.Component<any, any> {
  static defaultProps = {
    src:
      "//wanmi-x-site.oss-cn-shanghai.aliyuncs.com/x-site/public/img/dialog/img.png",
  };

  render() {
    const { item, active, onSelect } = this.props;
    const {
      validityFlag,
      rechargeableCardName,
      price,
      validityDays,
      presentPrice,
    } = item;
    const validity = validityFlag == "0" ? `${validityDays}天有效` : "永久有效";
    const preferential = `充${price}送${presentPrice ? presentPrice : 0}`;
    return (
      <li
        className={`good-list-item ${active ? "page_p_active" : ""}`}
        onClick={onSelect}
      >
        <img src={image} alt={rechargeableCardName} />
        <span className="title" style={{ height: "auto" }}>
          {rechargeableCardName}
        </span>
        <div className="sku">
          <span>{preferential}</span>
        </div>
        <div className="sku">
          <span>{validity}</span>
        </div>
        <span className="price">价格：{`￥${Number(price).toFixed(2)}`}</span>
      </li>
    );
  }
}
