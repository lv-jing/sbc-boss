/**
 * 链接单个服务组件
 * ProjectItem
 */
import * as React from "react";

const defaultImg =
  "https://wanmi-x-site.oss-cn-shanghai.aliyuncs.com/x-site/public/images/goods_map.png";

export interface ProjectItemProps {
  item: {
    minPrice: number;
    maxPrice: number;
    projectName: string;
    projectImg: string;
  };
  active: boolean;
  onSelect?();
}
export default class ProjectItem extends React.Component<
  ProjectItemProps,
  any
> {
  static defaultProps = {
    src:
      "//wanmi-x-site.oss-cn-shanghai.aliyuncs.com/x-site/public/img/dialog/img.png",
  };

  render() {
    const { item, active, onSelect } = this.props;
    const img = item.projectImg.split(",")[0];
    return (
      <li
        className={`good-list-item ${active ? "page_p_active" : ""}`}
        onClick={onSelect}
      >
        <img src={img ? img : defaultImg} alt={item.projectName} />
        <span className="title">{item.projectName}</span>
        <div className="sku" />
        <span className="price">{this._getPrice(item)}</span>
      </li>
    );
  }

  _getPrice = project => {
    if (
      project.moreFlag &&
      project.minPrice !== null &&
      project.maxPrice !== null
    ) {
      if (project.minPrice === project.maxPrice) {
        return "￥" + project.minPrice.toFixed(2);
      } else {
        return `￥${project.minPrice.toFixed(2)}~￥${project.maxPrice.toFixed(
          2,
        )}`;
      }
    } else {
      return "￥" + project.projectPrice.toFixed(2);
    }
  };
}
