import React from 'react';

import { Relax, Store } from 'plume2';
import { noop } from 'qmkit';

@Relax
export default class Setting extends React.Component<any, any> {
  _store: Store;

  static relaxProps = {
    setData: noop,
    initUmengSetting: noop
  };

  render() {
    const { setData, initUmengSetting } = this.props.relaxProps;

    return (
      <div className="sms-app-push">
        <div className="a-title">
          <img src={require('../img/u-icon.png')} alt="" />
          <span>友盟App Push</span>
        </div>
        <div className="set-box">
          <div
            className="app-set"
            onClick={() => {
              initUmengSetting();
              setData('isPushModal', true);
            }}
          >
            设置
          </div>
        </div>
      </div>
    );
  }
}
