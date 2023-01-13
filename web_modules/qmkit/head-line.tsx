import React from 'react';
import { FormattedMessage } from 'react-intl';

export default class Headline extends React.PureComponent<any, any> {
  props: {
    children?: any;
    state?: any;
    title?: any;
    number?: string;
    //禁止显示line
    lineDisable?: Boolean;
    smallTitle?: string;
    extra?: any;
  };

  render() {
    return (
      <div className={this.props.lineDisable ? 'headlinewithnoline' : 'headline'}>
        <h3>
          {this.props.title}
          {(this.props.number || +this.props.number === 0 ) && <small>(<FormattedMessage id="Order.total" />{` ${+this.props.number}`})</small>}
          {this.props.smallTitle && <small>{this.props.smallTitle}</small>}
        </h3>
        {this.props.children}
        <span style={{ color: '#F56C1D', fontSize: 14 }}>{this.props.state}</span>
        {this.props.extra && <div style={{ position: 'absolute', right: 50 }}>{this.props.extra}</div>}
      </div>
    );
  }
}
