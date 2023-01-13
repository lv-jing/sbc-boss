import React from 'react';
import { Layout } from 'antd';
import {
  routeWithSubRoutes,
  MyHeader,
  MyLeftLevel1,
  MyLeftMenu,
  Fetch,
  Const
} from 'qmkit';
const { Content } = Layout;
import { routes } from './router';

export default class Main extends React.Component<any, any> {
  _menu: any;
  constructor(props) {
    super(props);
    this.state = {
      // 当前浏览器地址匹配的路由path
      matchedPath: ''
    };
  }
  handlePathMatched = (path) => {
    this.setState({
      matchedPath: path
    });
  };
  componentWillMount() {
    Fetch('/baseConfig').then((resIco: any) => {
      if (resIco.res.code == Const.SUCCESS_CODE) {
        const ico = (resIco.res.context as any).pcIco
          ? JSON.parse((resIco.res.context as any).pcIco)
          : null;
        // if (ico) {
        //   const linkEle = document.getElementById('icoLink') as any;
        //   linkEle.href = ico[0].url;
        //   linkEle.type = 'image/x-icon';
        // }
      }
    });
  }
  componentDidUpdate() {
    // 加一层判断，避免报错影响子组件渲染
    if (document.getElementById('page-content')) {
      document.getElementById('page-content').scrollTop = 0;
    }
  }
  render() {
    return (
      <div>
        <Layout>
          {/*头部*/}
          <MyHeader />
          <Layout className="ant-layout-has-sider">
            {/*左侧一级菜单*/}
            <MyLeftLevel1
              matchedPath={this.state.matchedPath}
              onFirstActiveChange={this._onFirstActiveChange}
            />

            {/*左侧二三级菜单*/}
            <MyLeftMenu
              matchedPath={this.state.matchedPath}
              ref={(menu) => (this._menu = menu)}
            />
            {/*右侧主操作区域*/}
            <Content>
              <div style={styles.wrapper} id="page-content">
                {routeWithSubRoutes(routes, this.handlePathMatched)}
                {/* <div style={styles.copyright}>
                  © 2017-2020 南京万米信息技术有限公司 版本号：
                  {Const.COPY_VERSION}
                </div> */}
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }

  /**
   * 头部的一级菜单刷新后,初始化左侧菜单的展开菜单状态
   * @private
   */
  _onFirstActiveChange = () => {
    this._menu._openKeysChange(['0']);
  };
}

const styles = {
  wrapper: {
    backgroundColor: '#f5f5f5',
    height: 'calc(100vh - 64px)',
    position: 'relative',
    overflowY: 'auto'
  },
  copyright: {
    height: 48,
    lineHeight: '60px',
    textAlign: 'center',
    color: '#999'
  }
} as any;
