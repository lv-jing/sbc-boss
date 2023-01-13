import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class SettingActor extends Actor {
  defaultState() {
    return {
      //加载状态，默认为true
      loading:true,
      growthValueConfig: {
        status: 0,
        rule: '',
        remark: '',
        growthValueConfigId: ''
      }
    };
  }

  @Action('growth-value-setting:init')
  init(state: IMap, info) {
    return state.set('growthValueConfig', fromJS(info))
                .set('loading',false);
  }

  @Action('growth-value-setting: edit')
  edit(state, { field, value }) {
    return state.setIn(['growthValueConfig', field], value);
  }

}
