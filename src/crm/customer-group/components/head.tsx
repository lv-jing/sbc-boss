import React from 'react';
import { IMap, Relax } from 'plume2';
import { List } from 'immutable';
type TList = List<IMap>;

@Relax
export default class Head extends React.Component<any, any> {
  props: {
    relaxProps?: {
      topList: TList;
    };
  };

  static relaxProps = {
    topList: 'topList'
  };

  render() {
    const { topList } = this.props.relaxProps;

    return (
      <div className="head">
        {topList.slice(0, 4).map((item, index) => this.headItem(item, index))}
      </div>
    );
  }

  headItem = (item, index) => {
    return (
      <div className="head-item" key={index}>
        <div className={`item-title-${index} head-title`}>
          <img
            src={require(`../../../images/crm-${index + 1}.png`)}
            className="logo"
          />
          <p>{item.get('groupName')}</p>
        </div>
        <div className="numbers">
          <div className="item">
            <p className="sub-title">会员人数</p>
            <p className="sub-num">{item.get('customerNum')}</p>
          </div>
          <div className="item">
            <p className="sub-title">昨日访问</p>
            <p className="sub-num">{item.get('uvNum')}</p>
          </div>
          <div className="item">
            <p className="sub-title">昨日成交</p>
            <p className="sub-num">{item.get('tradeNum')}</p>
          </div>
        </div>
        {/* <div className="actions">
          <a>人群分析</a>
          <a className="msg">短信发送</a>
        </div> */}
      </div>
    );
  };
}
