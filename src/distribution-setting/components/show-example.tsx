import React from 'react';
import { Popover, Icon } from 'antd';

export default class ShowExample extends React.Component<any, any> {

  render() {
    return (
      <Popover
        getPopupContainer={() => document.getElementById('page-content')}
        content={
          <div style={{ width: 240, height: 350 }}>
            <img src={this.props.img} alt="" style={{ width: 240, height: 298 }} />
          </div>
        }
        placement="right"
      >
        <Icon
          type="question-circle-o"
          style={{ marginLeft: 10, color: '#F56C1D' }}
        />
      </Popover>
    );
  }
}
