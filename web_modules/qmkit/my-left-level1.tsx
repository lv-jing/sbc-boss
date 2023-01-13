import React from 'react';

import { Layout, Menu } from 'antd';
import { fromJS } from 'immutable';
import { history, cache, util } from 'qmkit';

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
      firstActive: 0,
      allGradeMenus: allGradeMenus
    };
  }

  render() {
    // 当前渲染的页面对应的路由
    const path = this.props.matchedPath;
    const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
    if (!loginInfo) {
      return null;
    }

    // 一级菜单选中索引
    let firstActive =
      sessionStorage.getItem(cache.FIRST_ACTIVE) || this.state.firstActive;

    // 循环全部菜单，找到与当前页面 url 匹配的菜单，选中
    this.state.allGradeMenus.forEach((level1, index1) => {
      if (level1.get('children')) {
        level1.get('children').forEach((level2) => {
          if (level2.get('children')) {
            level2.get('children').forEach((level3) => {
              if (level3.get('url') === path) {
                firstActive = index1;
                return true;
              }
            });
          } else {
            if (level2.get('url') === path) {
              firstActive = index1;
            }
          }
        });
      } else {
        if (level1.get('url') === path) {
          firstActive = index1;
        }
      }
    });

    // 选中的一级菜单key
    let level1SelectKeys = [firstActive.toString()];
    // 账户管理不属于任何菜单,特殊处理
    if (path == '/account-manage') {
      level1SelectKeys = [];
    }

    return (
      <Sider width={124} className="leftHeader" style={styles.navSider}>
        <Menu
          // style={styles.navMenu}
          //style={{ width: '100 %', backgroundColor: '#fff' }}
          inlineIndent={16}
          theme="light"
          mode="inline"
          selectedKeys={level1SelectKeys}
        >
          {/*头部一级菜单*/}
          {this.state.allGradeMenus.toJS().map((v, i) => {
            return (
              <Menu.Item
                key={i.toString()}
                style={styles.navItem}
                onClick={() => this._goFirstMenu(i)}
              >
                {/* <a onClick={() => this._goFirstMenu(i)} style={styles.navItem}>
                  <img
                    style={styles.menuIcon}
                    src={util.requireLocalSrc(`icon/${v.icon}`)}
                  />
                  {v.title}
                </a> */}
                <i className={"icon iconfont " + (v.icon && v.icon.startsWith('icon') ? v.icon : 'iconStore')} style={{fontSize:30 }}></i>
                <span style={{display: 'block',lineHeight:'16px',whiteSpace:'initial'}}>{v.title}</span>
              </Menu.Item>
            );
          })}
        </Menu>
      </Sider>
    );
  }

  // /**
  //  * 一级菜单的点击事件
  //  * @param i
  //  */
  _goFirstMenu = (i) => {
    // 缓存中记录当前选中的一级菜单
    sessionStorage.setItem(cache.FIRST_ACTIVE, i);
    this.setState({ firstActive: i });
    this.props.onFirstActiveChange(); //让父级告诉兄弟组件,选中的一级菜单变化了

    const menus = this.state.allGradeMenus;
    let url = '';
    if (menus.getIn([i, 'url'])) {
      //如果一级菜单本身就有url,则直接跳转该url
      url = menus.getIn([i, 'url']);
    } else {
      //查找一级菜单下面的第一个url(即 一级菜单的url默认为其子集中的第一个url)
      const secMenus = menus.get(i).get('children');
      if (secMenus && secMenus.size > 0) {
        secMenus.some((secMenu) => {
          if (secMenu.get('url')) {
            url = secMenu.get('url');
            return true;
          } else {
            const thiMenus = secMenu.get('children');
            if (thiMenus && thiMenus.size > 0) {
              return thiMenus.some((thiMenu) => {
                if (thiMenu.get('url')) {
                  url = thiMenu.get('url');
                  return true;
                }
                return false;
              });
            }
          }
          return false;
        });
      }
    }
    history.push(url);
  };
}

const styles = {
  logoBg: {
    width: 140,
    height: 44,
    backgroundColor: '#ffffff7d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoImg: {
    display: 'block',
    width: 120,
    maxHeight: 40
  },
  menuIcon: {
    width: 16,
    height: 16,
    marginRight: 8
  },
  navItem: {
    textAlign: 'center',
    height:'auto',
    marginBottom:0,
    paddingTop:10,
    paddingBottom:10,
    lineHeight: '32px',
    // display: 'flex',
    // flexDirection: 'row',
    // alignItems: 'center',
    // overflow: 'hidden'
    // color: '#F56C1D'
  },
  navSider: {
    paddingTop: 13,
    backgroundColor: '#fff',
    borderRight: '1px solid #eaeaea',
  },
} as any;
