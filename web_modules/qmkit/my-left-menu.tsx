import React from 'react';
import { Route } from 'react-router-dom';

import { Layout, Menu } from 'antd';
import { fromJS } from 'immutable';

import { history, cache } from 'qmkit';

const { SubMenu } = Menu;
const { Sider } = Layout;

export default class NavLayout extends React.PureComponent<any, any> {
  constructor(props) {
    super(props);
    // 1.登陆后获取的菜单信息列表
    const allGradeMenus = fromJS(
      JSON.parse(sessionStorage.getItem(cache.LOGIN_MENUS)) || []
    );
    // 2.初始化信息
    this.state = {
      allGradeMenus: allGradeMenus,
      // 二级菜单展开状态
      level2OpenedKeys: Object.keys(Array.from({ length: allGradeMenus.size })),
      // 是否第一次加载(区分 点击展开收缩菜单 与 第一次加载的展开菜单)
      firstInitFlag: true
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.matchedPath != nextProps.matchedPath) {
      // 如果链接改变,恢复为第一次加载
      this.setState({ firstInitFlag: true });
      this.setState({
        level2OpenedKeys: Object.keys(Array.from({ length: this.state.allGradeMenus.size })),
      });

    }
  }

  render() {
    // 当前渲染的页面对应的路由
    const path = this.props.matchedPath;
    const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
    if (!loginInfo) {
      return null;
    }

    // 账户管理特殊处理左侧菜单的显示
    if (path == '/account-manage') {
      return (
        <Sider width={136} className="leftSideNav">
          <Menu
            mode="inline"
            // theme="dark"
            style={{ height: '100%' }}
            inlineIndent={10}
          >
            <SubMenu
              key={'001'}
              title={
                <div className="leftNavItem">
                  {/*<img
                    style={styles.menuIcon}
                    src={require('./images/icon/1496720672998.jpg')}
                  />*/}
                  <span>账户管理</span>
                </div>
              }
            />
          </Menu>
        </Sider>
      );
    }

    // 一级菜单选中索引
    let firstActive = sessionStorage.getItem(cache.FIRST_ACTIVE) || 0;
    // 二级菜单选中索引
    let secondActive = sessionStorage.getItem(cache.SECOND_ACTIVE) || 0;
    // 三级菜单选中索引
    let thirdActive = sessionStorage.getItem(cache.THIRD_ACTIVE) || 0;

    // 循环全部菜单，找到与当前页面 url 匹配的菜单，选中
    this.state.allGradeMenus.forEach((level1, index1) => {
      if (level1.get('children')) {
        level1.get('children').forEach((level2, index2) => {
          if (level2.get('children')) {
            level2.get('children').forEach((level3, index3) => {
              if (level3.get('url') === path) {
                firstActive = index1;
                secondActive = index2;
                thirdActive = index3;
                this._setMenuSession(firstActive, secondActive, thirdActive);
                return true;
              }
            });
          } else {
            if (level2.get('url') === path) {
              firstActive = index1;
              secondActive = index2;
              this._setMenuSession(firstActive, secondActive, '');
            }
          }
        });
      } else {
        if (level1.get('url') === path) {
          firstActive = index1;
          this._setMenuSession(firstActive, '', '');
        }
      }
    });

    // 展开的二级菜单
    let level2OpenedKeys = this.state.level2OpenedKeys;
    if (
      this.state.firstInitFlag &&
      level2OpenedKeys.length == 1 &&
      level2OpenedKeys[0] == '0' &&
      secondActive != 0
    ) {
      //展开的只有第1个菜单,并且当前选中的菜单不是第1个 --> 则默认展开选中的菜单(解决刷新页面时,未展开选中菜单)
      level2OpenedKeys = [secondActive.toString()];
    }
    // 选中的三级菜单key
    const level3SelectKeys = [secondActive + '_' + thirdActive];
    // 选中的一级菜单详情
    const currFirstMenu = this.state.allGradeMenus.get(firstActive);

    if (
      currFirstMenu.get('children') &&
      currFirstMenu.get('children').size > 0
    ) {
      return (
        <Sider width={200} className="leftSideNav">
          <Menu
            mode="inline"
            // theme="dark"
            inlineIndent={10}
            openKeys={level2OpenedKeys}
            selectedKeys={level3SelectKeys}
            onOpenChange={this._openKeysChange}
            style={{ height: '100%' }}
          >
            {currFirstMenu
              .get('children')
              .toJS()
              .map((item, index) => {
                return (
                  <SubMenu
                    key={index}
                    title={
                      <div className="leftNavItem">
                        {/*<img
                          style={styles.menuIcon}
                          src={util.requireLocalSrc(`icon/${item.icon}`)}
                        />*/}
                        <span>{item.title}</span>
                      </div>
                    }
                  >
                    {item.children &&
                      item.children.map((v, i) => {
                        return this._renderThirdMenu(v, index, i);
                      })}
                  </SubMenu>
                );
              })}
          </Menu>
        </Sider>
      );
    } else {
      return null;
    }
  }

  /**
   * 修改展开状态的二级菜单
   * @param openKeys
   * @private
   */
  _openKeysChange = (openKeys) => {
    this.setState({ level2OpenedKeys: openKeys, firstInitFlag: false });
  };

  /**
   * 渲染三级菜单
   * @param v 三级菜单信息
   * @param index 二级菜单下标
   * @param i 三级菜单下标
   */
  _renderThirdMenu = (v, index, i) => {
    return (
      <Menu.Item key={index + '_' + i} style={{ paddingLeft: 40 }}>
        <Route
          path={v.url}
          children={() => (
            <a
              href="javascript:;"
              onClick={() => this._goThirdMenu(v.url, index, i)}
            >
              {v.title}
            </a>
          )}
        />
      </Menu.Item>
    );
  };

  /**
   * 记录当前选中的菜单
   */
  _setMenuSession = (first, second, third) => {
    sessionStorage.setItem(cache.FIRST_ACTIVE, first);
    sessionStorage.setItem(cache.SECOND_ACTIVE, second);
    sessionStorage.setItem(cache.THIRD_ACTIVE, third);
  };

  /**
   * 三级菜单的点击事件
   * @param url
   * @param i
   * @private
   */
  _goThirdMenu = (url, index, i) => {
    sessionStorage.setItem(cache.SECOND_ACTIVE, index);
    // 缓存中记录当前选中的三级菜单
    sessionStorage.setItem(cache.THIRD_ACTIVE, i);
    history.push(url);
  };
}

// const styles = {
//   menuIcon: {
//     width: 20,
//     height: 20,
//     marginRight: 5
//   },
// } as any;
