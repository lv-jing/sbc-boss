import { Action, Actor, IMap } from 'plume2';

export default class AppShareActor extends Actor {
  defaultState() {
    return {
      // 加载状态
      loading: true,
      // app分享开关
      enabled: false,
      // app分享标题
      title: '',
      // app分享描述
      desc: '',
      // app图标
      icon: [],
      // ios下载包地址
      iosUrl: '',
      // android下载包地址
      androidUrl: '',
      // app下载页面链接
      downloadUrl: '',
      // app下载二维码
      downloadImg: [],
      // app分享页背景图
      shareImg: []
    };
  }

  /**
   * 初始化
   */
  @Action('init')
  init(state: IMap, params) {
    return state.merge(params).set('loading', false);
  }

  /**
   * 修改表单数据
   */
  @Action('form:field:change')
  formFieldChange(state: IMap, { key, value }) {
    return state.set(key, value);
  }
}
