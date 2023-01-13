import { Store, Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';
import * as webapi from './webapi';
import { Const } from 'qmkit';
import { message } from 'antd';

export default class AppStore extends Store {
  bindActor() {
    return [new OrderSettingActor()];
  }

  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }

  //;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;;;;

  /**
   * 初始化查询
   */
  init = async () => {
    const { res } = await webapi.queryOrderSettings();
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
    }
    this.dispatch('order-setting:init', res.context);
  };

  /**
   * 修改设置状态
   */
  editStatusByConigType = (configType: string, status: number) => {
    let configs = this.state().get('configs');
    let index = configs.findIndex((val) => val.get('configType') == configType);
    this.dispatch('order-setting:status', {
      index: index,
      status: status ? 1 : 0
    });
  };

  /**
   * 修改天数/小时
   */
  editDaysByConfigType = (configType: string, timeType: string, time) => {
    let configs = this.state().get('configs');
    let index = configs.findIndex((val) => val.get('configType') == configType);
    if (timeType == 'day') {
      this.dispatch('order-setting:day', {
        index: index,
        day: time ? time : 1
      });
    } else if (timeType == 'hour') {
      this.dispatch('order-setting:hour', {
        index: index,
        hour: time ? time : 1
      });
    }
  };

  /**
   * 保存配置
   */
  saveEditConfigs = async () => {
    const configs = this.state().get('configs');
    const { res } = await webapi.editOrderSettings(configs);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('保存订单设置成功');
    } else {
      message.error(res.message);
    }
  };
}

class OrderSettingActor extends Actor {
  defaultState() {
    return {
      //当前选中的会员
      configs: []
    };
  }

  /**
   *
   * @param state 初始化设置
   * @param configs
   */
  @Action('order-setting:init')
  initOrderSetting(state: IMap, configs) {
    return state.set('configs', fromJS(configs));
  }

  /**
   * 编辑设置
   * @param state
   * @param configs
   */
  @Action('order-setting:status')
  editStatus(state: IMap, { index, status }) {
    return state.updateIn(['configs', index, 'status'], () => status);
  }

  /**
   * 编辑设置天数
   * @param state
   * @param param1
   */
  @Action('order-setting:day')
  editDay(state: IMap, { index, day }) {
    return state.updateIn(
      ['configs', index, 'context'],
      () => JSON.stringify({ day: day }) as any
    );
  }

  /**
   * 编辑设置小时
   * @param state
   * @param param1
   */
  @Action('order-setting:hour')
  editHour(state: IMap, { index, hour }) {
    return state.updateIn(
      ['configs', index, 'context'],
      () => JSON.stringify({ hour: hour }) as any
    );
  }
}
