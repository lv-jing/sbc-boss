import React from 'react';
import { Alert } from 'antd';
import { FormattedMessage } from 'react-intl';

export default class Tips extends React.Component<any, any> {
  render() {
    return (
      <Alert
        message={<FormattedMessage id="Product.brandsTip" />}
        type="info"
        // style={{ marginBottom:  }}
      />
    );
  }
}
