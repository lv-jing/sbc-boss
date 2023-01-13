import { Action, Actor } from 'plume2';
import { fromJS } from 'immutable';

export default class AddSignature extends Actor {
  defaultState() {
    return {
      involveThirdInterest: 0,
      remark: '',
      signSource: null,
      smsSignName: '',
      smsSignFileInfoList: [],
      ifEdit: false,
      // 表单内容
      formData: {},
      // 上传的logo图片
      images: [],
      signDetail: null,
      imageUrl: [],
      imageUrl2: []
    };
  }

  @Action('init:form')
  formFiledChange(
    state,
    {
      involveThirdInterest,
      remark,
      signSource,
      smsSignName,
      smsSignFileInfoList
    }
  ) {
    return state
      .set('involveThirdInterest', involveThirdInterest)
      .set('remark', remark)
      .set('signSource', signSource)
      .set('smsSignName', smsSignName)
      .set('smsSignFileInfoList', fromJS(smsSignFileInfoList));
  }

  @Action('set:state')
  setState(state, { field, value }) {
    return state.set(field, fromJS(value));
  }
}
