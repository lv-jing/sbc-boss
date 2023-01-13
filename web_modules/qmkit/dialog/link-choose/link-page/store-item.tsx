/**
 * 链接单个商品组件
 * GoodListItem
 */
import * as React from "react";
const defaultImg =
  "https://wanmi-x-site.oss-cn-shanghai.aliyuncs.com/x-site/public/images/goods_map.png";
export interface TimingCardItemProps {
  item: {
    storeId: string;
    storeName: string;
    storeSign: string;
    supplierName: string;
    companyInfo: any;
  };
  active: boolean;
  onSelect?();
}
export default class TimingCardCardItem extends React.Component<any, any> {
  static defaultProps = {
    src:
      "//wanmi-x-site.oss-cn-shanghai.aliyuncs.com/x-site/public/img/dialog/img.png",
  };

  render() {
    const { item, active, onSelect } = this.props;
    const {
      storeId, storeName, storeSign, supplierName, companyInfo
    } = item;
    return (
      <li
        className={`good-list-item ${active ? "page_p_active" : ""}`}
        onClick={onSelect}
      >
        <img src={storeSign ? storeSign : defaultImg} alt={storeName} />
        <span className="title" style={{ height: "auto" }}>
          {`店铺名称：${storeName}`}
        </span>
        <div className="sku">
          <span>{`商家编号：${companyInfo.companyCode}`}</span>
        </div>
        <span className="price">{`商家名称：${supplierName}`}</span>
      </li>
    );
  }
}
