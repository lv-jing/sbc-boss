/**
 * 链接单个商品组件
 * GoodListItem
 */
import * as React from "react";
const image =
  "//wanmi-x-site.oss-cn-shanghai.aliyuncs.com/x-site/public/images/time-card.png";
export interface TimingCardItemProps {
  item: {
    validityDays: string;
    timingCardName: string;
    price: string;
    validityFlag: string;
    timingCardProjectVOList: any;
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
      validityDays,
      timingCardName,
      price,
      validityFlag,
      timingCardProjectVOList,
    } = item;
    const validity = validityFlag == "0" ? `${validityDays}天有效` : "永久有效";
    const length = timingCardProjectVOList.length;
    const project = timingCardProjectVOList[0];
    const projectDesc =
      project && `${project.projectName}*${project.projectNum}`;
    return (
      <li
        className={`good-list-item ${active ? "page_p_active" : ""}`}
        onClick={onSelect}
      >
        <img src={image} alt={timingCardName} />
        <span className="title" style={{ height: "auto" }}>
          {timingCardName}
        </span>
        {project && (
          <div className="sku">
            <span>{length > 1 ? `${projectDesc}...` : projectDesc}</span>
          </div>
        )}
        <div className="sku">
          <span>{validity}</span>
        </div>
        <span className="price">价格：{`￥${Number(price).toFixed(2)}`}</span>
      </li>
    );
  }
}
