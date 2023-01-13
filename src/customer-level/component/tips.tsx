import React from 'react';
import { Alert } from 'antd';

export default class Tips extends React.Component<any, any> {
  render() {
    return (
      <div style={{ marginBottom: 20 }}>
        <Alert
          message="操作提示"
          description={
            <div>
              <p>
                1、平台可设置客户等级，商家可自行编辑等级特权以及关联的客户；
              </p>
              <p>
                2、平台对等级的操作将会使商家客户等级策略变动或者失效，请勿随意变动；
              </p>
            </div>
          }
          type="info"
        />
      </div>
    );
  }
}
