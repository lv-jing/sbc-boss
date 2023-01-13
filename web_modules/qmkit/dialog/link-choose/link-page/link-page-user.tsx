/**
 * @使用场景
 * @链接到常用功能
 **/

import * as React from "react";
import * as Immutable from "immutable";
import { outputGenerate } from "@qianmi/x-site-core";
import { Scrollbars } from "react-custom-scrollbars";
export default class LinkPageUser extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      userPageList: props.userPageList || [],
      activeValue: "",
    };
  }

  props: {
    chooseData: any;
    changeSelect(...args);
    userPageList: any[];
  };

  static defaultProps = {
    chooseData: Immutable.Map(), //选择的对象
    changeSelect: () => {},
  };

  // userPageList
  componentDidMount() {
    this.getPageUser();
    this.props.changeSelect(this.props.chooseData.toJS());
  }
  render() {
    const { userPageList, activeValue } = this.state;
    if (userPageList && userPageList.length > 0) {
      let pageList = userPageList.map((item, index) => {
        return (
          <li
            key={index}
            onClick={this._changeVal.bind(this, item)}
            className={`${item.key === activeValue ? "page_p_active" : ""}`}
            data-index={index}
          >
            <span
              style={{ fontSize: "20px" }}
              className={"x-site-new-qIcon page_p_qIcon " + item.icon}
            />
            <br />
            <span>{item.title}</span>
          </li>
        );
      });
      return (
        <div className="page-user">
          <Scrollbars autoHeight autoHeightMax={460}>
            <ul>{pageList}</ul>
          </Scrollbars>
        </div>
      );
    } else {
      return (
        <div className="page-user">
          <i className="x-site-new-qIcon information" />暂无常用功能
        </div>
      );
    }
  }
  getPageUser = () => {
    let { chooseData } = this.props;
    if (!chooseData) return;
    this.setState({ activeValue: chooseData.get("key") });
  };
  _changeVal = item => {
    this.setState({ activeValue: item.key });
    this.props.changeSelect(item);
  };
}
