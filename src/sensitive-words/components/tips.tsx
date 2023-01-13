import React from 'react';
import { Alert } from 'antd';

export default class Tips extends React.Component<any, any> {
  render() {
    return (
      <Alert
        message=""
        description={
          <div>
            <p>
              敏感词库设置后可以过滤提交内容中的敏感词汇，并进行提示
            </p>
          </div>
        }
        type="info"
      />
    );
  }
}
