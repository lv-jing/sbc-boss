import React from 'react';
import { Icon } from 'antd';

export default class Tips extends React.PureComponent<any, any> {
  props: { title?: string };

  render() {
    return (
      <div className="tips">
        <div className="tips-content">
          <Icon type="exclamation-circle" />
          <span style={{ marginLeft: 10 }}>{this.props.title}</span>
        </div>
      </div>
    );
  }
}
