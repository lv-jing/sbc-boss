import { Action, Actor, IMap } from 'plume2';

export const platformType = {
  MALL: 'MALL',
  SUPPLIER: 'SUPPLIER',
  PLATFORM: 'PLATFORM',
  PROVIDER: 'PROVIDER'
};

/**
 * 菜单actor
 */
export default class BossMenuActor extends Actor {
  defaultState() {
    return {
      allMenus: [], // 扁平无层级的菜单
      bossMenus: [], // 有层级关系的菜单
      objInfo: {}, // 当前选中节点(菜单/功能/权限)
      edit: false, // 新增false,编辑true
      menuVisible: false, // 菜单弹出框是否展示
      funcVisible: false, // 功能弹出框是否展示
      authVisible: false, // 权限弹出框是否展示
      currPlatform: platformType.SUPPLIER //当前需要管理权限的端(商家/平台BOSS)
    };
  }

  /**设置无层级菜单*/
  @Action('authority:allMenus')
  allMenus(state: IMap, menus) {
    return state.set('allMenus', menus);
  }

  /**设置有层级关系的菜单*/
  @Action('authority:bossMenus')
  bossMenus(state: IMap, menus) {
    return state.set('bossMenus', menus);
  }

  /**将所有弹出框置为不可见*/
  @Action('authority:initModelVisible')
  initModelVisible(state: IMap) {
    return state
      .set('menuVisible', false)
      .set('funcVisible', false)
      .set('authVisible', false);
  }

  /**根据key设置value*/
  @Action('authority:setKeyVal')
  setKeyVal(state: IMap, { key, value }) {
    return state.set(key, value);
  }
}
