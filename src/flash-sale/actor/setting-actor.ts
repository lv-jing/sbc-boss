import { Action, Actor, IMap } from 'plume2';
import { IList } from 'typings/globalType';

export default class SettingActor extends Actor {
  defaultState() {
    return {
      settingList: [],
      storeCount: 0,
      flashSaleStatus: false
    };
  }

  /**
   * 初始化
   */
  @Action('setting: init')
  init(state: IMap, settingList: IList) {
    return state.set('settingList', settingList);
  }

  /**
   * 初始化
   */
  @Action('setting: storeCount')
  storeCount(state: IMap, storeCount: number) {
    return state.set('storeCount', storeCount);
  }

  /**
   * 修改表单内容
   */
  @Action('setting: modifyStatus')
  modifyStatus(state: IMap, { index, status }) {
    return state.setIn(['settingList', index, 'status'], status);
  }

  /**
   * 修改表单内容
   */
  @Action('setting: changeFlashSaleStatus')
  changeFlashSaleStatus(state: IMap, flashSaleStatus: boolean){
    return state.set('flashSaleStatus', flashSaleStatus);
  }
}
