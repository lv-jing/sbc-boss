import React, { Component } from 'react';
import { Relax, IMap } from 'plume2';

@Relax
class pointsTitle extends Component {
  props: {
    relaxProps?: {
      ponitsNumberDetails: IMap;
    };
  };

  static relaxProps = {
    ponitsNumberDetails: 'ponitsNumberDetails'
  };

  render() {
    const { ponitsNumberDetails } = this.props.relaxProps;

    return (
      <div className="pointsTitle">
        <div>
          <p>已发放积分数</p>
          <p style={{ fontSize: 12, color: '#999' }}>历史累计发放积分数</p>
          <strong>{ponitsNumberDetails.get('pointsIssueStatictics')}</strong>
        </div>
        <div>
          <p>未使用积分数</p>
          <p style={{ fontSize: 12, color: '#999' }}>
            会员账户累计还未使用的积分总数
          </p>
          <strong>{ponitsNumberDetails.get('pointsAvailableStatictics')}</strong>
        </div>
      </div>
    );
  }
}

export default pointsTitle;
