import React from 'react';

export default class HelpDoc extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={styles.container}>
        <h1>微信分享参数设置帮助文档</h1>
        <br />
        <p>
          1、获得微信公众号分享的能力，需准备一个符合要求的公众号，认证后的的订阅号和服务号都支持微信公众号分享，如果您还需使用微信公众号支付、微信授权登录等功能，请务必使用服务号；
        </p>
        <br />
        <p>2、在开发-基本配置：根据提示操作，获取开发者密码(AppSecret)</p>
        <br />
        <p>
          <img src={require('./imgs/wxHelp-01.png')} />
        </p>
        <br />
        <p>
          3、进入微信公众平台，在开发-基本配置-IP白名单中添加您服务器的IP地址
        </p>
        <br />
        <p>
          <img src={require('./imgs/wxHelp-02.png')} />
        </p>
        <br />
        <p>
          4、在设置-公众号设置-功能设置：根据提示操作，设置JS接口安全域名、网页授权域名
        </p>
        <br />
        <p>
          <img src={require('./imgs/wxHelp-03.png')} />
        </p>
        <br />
        <p>
          设置JS接口安全域名、网页授权域名需要在域名指向的web服务器根目录下放置该公众号的验证文件，如之前未上传，需下载文件并上传（如有疑问，可联系开发处理）
        </p>
        <p>
          <img src={require('./imgs/wxHelp-04.png')} />
        </p>
        <br />
        <p>
          <img src={require('./imgs/wxHelp-05.png')} />
        </p>
        <br />
        <p>5、将AppID、AppSecret正确配置在后台，即可开通微信公众号分享功能</p>
        <br />
        <p>
          2、获得App端微信分享能力，您需要将您App创建在您微信开放平台的移动应用中
        </p>
        <br />
        <p>
          <img src={require('./imgs/wxHelp-06.png')} />
        </p>
        <br />
        <p>获取该应用的AppID、AppSecret,交给开发人员进行配置。</p>
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
