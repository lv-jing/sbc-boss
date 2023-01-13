import { message } from 'antd';
import { fromJS } from 'immutable';
import { Store } from 'plume2';

import { Const } from 'qmkit';

import * as webapi from './webapi';
import BossMenuActor from './actor/boss-menu-actor';

export default class AppStore extends Store {
  bindActor() {
    return [new BossMenuActor()];
  }

  constructor(props) {
    super(props);
    (window as any)._store = this;
  }

  /**
   * 初始化加载菜单/功能/权限数据
   */
  init = async () => {
    const { res: menusRes } = (await webapi.fetchBossMenus(
      this.state().get('currPlatform')
    )) as any;
    const bossMenus = fromJS(menusRes.context);
    const allGradeMenus = this._getChildren(
      bossMenus.filter((item) => item.get('grade') == 1),
      bossMenus
    );

    this.transaction(() => {
      this.dispatch('authority:allMenus', bossMenus);
      this.dispatch('authority:bossMenus', allGradeMenus);
      this.dispatch('authority:initModelVisible');
    });
  };

  /**
   * 更改当前需要管理权限的端
   */
  changePlatformType = (type) => {
    // 1.更改端
    this.dispatch('authority:setKeyVal', { key: 'currPlatform', value: type });
    // 2.重新查询菜单/功能/权限
    this.init().then(() => {
      // 3.清空选中节点
      this.dispatch('authority:setKeyVal', {
        key: 'objInfo',
        value: fromJS({})
      });
    });
  };

  /**
   * 获取子菜单与权限
   * @param list
   * @private
   */
  _getChildren = (list, dataList) => {
    return list.map((data) => {
      const children = dataList.filter(
        (item) => item.get('pid') == data.get('id')
      );
      if (!children.isEmpty()) {
        data = data.set('children', this._getChildren(children, dataList));
      }
      return data;
    });
  };

  /**
   * 切换选中的节点(菜单/功能/权限 或 取消选中)
   */
  changeSelectedNode = (objInfo) => {
    this.dispatch('authority:setKeyVal', { key: 'objInfo', value: objInfo });
  };

  /**
   * 打开新增/编辑框(根据visibleModel判断展示哪个弹出框)
   */
  showModel = (visibleModel, edit) => {
    this.transaction(() => {
      this.dispatch('authority:setKeyVal', { key: visibleModel, value: true });
      this.dispatch('authority:setKeyVal', { key: 'edit', value: edit });
    });
  };

  /**
   * 根据参数取消,关闭不同的弹框
   */
  onCancel = (key) => {
    this.dispatch('authority:setKeyVal', { key, value: false });
  };

  /**
   * 根据当前节点类型逻辑删除节点
   */
  deleteIt = (visibleModel, id) => {
    if (visibleModel == 'menuVisible') {
      this._deleteMenu(id);
    } else if (visibleModel == 'funcVisible') {
      this._deleteFunc(id);
    } else if (visibleModel == 'authVisible') {
      this._deleteAuth(id);
    }
  };

  /**
   * 新增/编辑菜单
   */
  onSaveMenu = (params) => {
    const objInfo = this.state().get('objInfo');
    params['systemTypeCd'] = this.state().get('currPlatform');
    //如果是编辑状态
    if (this.state().get('edit')) {
      params['menuId'] = objInfo.get('realId');
      webapi.updateMenu(params).then((res) => {
        this.messageByResult(res.res);
      });
    } else {
      params['parentMenuId'] = objInfo.get('realId') || 0;
      webapi.insertMenu(params).then((res) => {
        this.messageByResult(res.res);
      });
    }
  };

  /**
   * 删除某个菜单
   */
  _deleteMenu = (menuId) => {
    webapi.deleteMenu(menuId).then((res) => {
      this.messageByResult(res.res);
    });
  };

  /**
   * 新增/编辑功能
   */
  onSaveFunc = (params) => {
    const objInfo = this.state().get('objInfo');
    params['systemTypeCd'] = this.state().get('currPlatform');
    //如果是编辑状态
    if (this.state().get('edit')) {
      params['functionId'] = objInfo.get('realId');
      webapi.updateFunc(params).then((res) => {
        this.messageByResult(res.res);
      });
    } else {
      params['menuId'] = objInfo.get('realId');
      webapi.insertFunc(params).then((res) => {
        this.messageByResult(res.res);
      });
    }
  };

  /**
   * 删除某个功能
   */
  _deleteFunc = (funcId) => {
    webapi.deleteFunc(funcId).then((res) => {
      this.messageByResult(res.res);
    });
  };

  /**
   * 新增/编辑权限
   */
  onSaveAuth = (params) => {
    const objInfo = this.state().get('objInfo');
    params['systemTypeCd'] = this.state().get('currPlatform');
    //如果是编辑状态
    if (this.state().get('edit')) {
      params['authorityId'] = objInfo.get('realId');
      webapi.updateAuth(params).then((res) => {
        this.messageByResult(res.res);
      });
    } else {
      params['functionId'] = objInfo.get('realId');
      webapi.insertAuth(params).then((res) => {
        this.messageByResult(res.res);
      });
    }
  };

  /**
   * 删除某个权限
   */
  _deleteAuth = (authId) => {
    webapi.deleteAuth(authId).then((res) => {
      this.messageByResult(res.res);
    });
  };

  /**
   * 根据处理请求的返回值判断是否提示"操作成功"
   * @param res
   */
  messageByResult(res) {
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 重新查询菜单/功能/权限
      this.init().then(() => {
        // 若当前有选中节点,则根据刷新选中节点的数据
        let objInfo = this.state().get('objInfo');
        if (objInfo && objInfo.get('id')) {
          const allMenus = this.state().get('allMenus');
          objInfo =
            allMenus.find((menu) => menu.get('id') == objInfo.get('id')) ||
            fromJS({});
          this.changeSelectedNode(objInfo);
        }
      });
    } else {
      message.error(res.message);
    }
  }
}
