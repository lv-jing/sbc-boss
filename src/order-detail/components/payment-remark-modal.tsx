import React from 'react';
import { Form, Modal, Tabs } from 'antd';
import ReactJson from 'react-json-view';
import { FormattedMessage } from 'react-intl';

export default class PaymentRemark extends React.Component<any, any> {
  render() {
    const { visible, requestPayload, responsePayload, onClose } = this.props;
    const requestJson = JSON.parse(requestPayload || '{}');
    const responseJson = JSON.parse(responsePayload || '{}');
    return (
      <Modal
        visible={visible}
        width={1050}
        title={<FormattedMessage id="Order.payload" />}
        footer={null}
        onCancel={onClose}
      >
        <Tabs>
          <Tabs.TabPane key="1" tab={<FormattedMessage id="Order.request" />}>
            <ReactJson
              src={requestJson}
              enableClipboard={false}
              displayObjectSize={false}
              displayDataTypes={false}
              style={{ wordBreak: 'break-all' }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key="2" tab={<FormattedMessage id="Order.response" />}>
            <ReactJson
              src={responseJson}
              enableClipboard={false}
              displayObjectSize={false}
              displayDataTypes={false}
              style={{ wordBreak: 'break-all' }}
            />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    );
  }
}
