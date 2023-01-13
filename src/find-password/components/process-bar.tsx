import React from 'react';
import { Relax } from 'plume2';

@Relax
export default class ProcessBar extends React.Component<any, any> {
  props: {
    relaxProps?: {
      current: number;
    };
  };

  static relaxProps = {
    current: 'current'
  };

  render() {
    const { current } = this.props.relaxProps;

    return (
      <div className={`process-bar process-0${current + 1}`}>
        <div className="process-item item-01">
          <i>1</i>Input email
        </div>
        <span className="process-line" />
        <div className="process-item item-02">
          <i>2</i>Verification
        </div>
        <span className="process-line" />
        <div className="process-item item-03">
          <i>3</i>Set password
        </div>
        <span className="process-line" />
        <div className="process-item item-04">
          <i>4</i>Completed
        </div>
      </div>
    );
  }
}
