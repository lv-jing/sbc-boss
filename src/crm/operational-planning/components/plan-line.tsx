import React from 'react';


export default class PlanLine extends React.Component<any, any> {
  props: {
    textDetail: string;
  };
  render() {
    return (
      <div style={{ width: '100%', height: 30, background: 'rgb(245, 245, 245)' }}>
        <div style={{ width: 3, background: '#F56C1D', height: 30, float: 'left' }} />
        <div style={{ lineHeight: '30px', textIndent: '1em' }}>
          {this.props.textDetail}
        </div>
      </div>
    );
  }
}
