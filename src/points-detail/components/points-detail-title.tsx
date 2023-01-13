import React, { Component } from 'react';
import { Relax, IMap } from 'plume2';

//默认头像
const headerImage = require('../../../web_modules/qmkit/images/head_icon.png');
@Relax
class pointsDetailTitle extends Component {
  props: {
    relaxProps?: {
      customerInfo: IMap;
    };
  };

  static relaxProps = {
    customerInfo: 'customerInfo'
  };

  render() {
    const { customerInfo } = this.props.relaxProps;
    return (
      <div
        className="pointsTitle"
        style={{ justifyContent: 'flex-start', textAlign: 'left' }}
      >
        <div>
          <img
            style={{ borderRadius: 25 }}
            width="50px"
            height="50px"
            src={customerInfo.get('headImg')?customerInfo.get('headImg'):headerImage}
            alt=""
          />
        </div>
        <div style={{ marginLeft: 20 }}>
          <p>{customerInfo.get('customerName')}</p>
          <p style={{ fontSize: 12 }}>
            账号:{customerInfo.get('customerAccount')}
          </p>
          <div>
            <span>
              积分余额:<strong>{customerInfo.get('pointsAvailable')}</strong>
            </span>
            <span style={{ marginLeft: 50 }}>
              累计使用: <strong>{customerInfo.get('pointsUsed')}</strong>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default pointsDetailTitle;
