import React from 'react';

export default class MiniInterfaceDoc extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={styles.container}>
        <h2>小程序参数设置帮助文档</h2>
        <p>获取路径：微信公众平台——登录小程序账号——开发——开发设置——AppID(小程序ID)，如下图所示：</p>
        <img src={require('./imgs/help.png')} alt="" />
      </div>
    );
  }
}

const styles = {
  container: {
    overflow: 'auto',
    padding: 20,
    height: 'calc(100vh)'
  }
} as any;
