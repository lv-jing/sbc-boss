import * as React from 'react';
import { Relax } from 'plume2';
import { FormattedMessage } from 'react-intl';
import { Alert } from 'antd';

export default class AlertInfo extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Alert
        message={
          !this.props.message ? (
            <div>
              <p>
                <FormattedMessage id="Product.operationInstruction" />：
              </p>
              <p>
                1、
                <FormattedMessage id="Product.operationInstructionFirst" />
              </p>
              <p>
                2、
                <FormattedMessage id="Product.operationInstructionSecond" />
              </p>
              <p>
                3、
                <FormattedMessage id="Product.operationInstructionThird" />
              </p>
              <p>
                4、
                <FormattedMessage id="Product.settheSalescategory" />
              </p>
            </div>
          ) : (
            this.props.message
          )
        }
        type="info"
      />
    );
  }
}
