import { Actor, Action, IMap } from 'plume2';

export default class FormActor extends Actor {
  //数据源
  defaultState() {
    return {
      //供应商provider自定义富文本编辑器
      businessEditor: {},
      //商家自定义富文本编辑器
      supplierEditor:{},
      businessBanner: '',
      supplierBanner: '',
      //供应商provider自定义内容
      businessContent: '',
      //商家自定义内容
      supplierContent: '',
      businessConfigId: '',
      //选中的标签页（1:商家 2:供应商provider),默认1
      tabKey:'1'
    };
  }

  constructor() {
    super();
  }

  @Action('FormActor: businessEditor')
  setEditor(state: IMap, businessEditor) {
    return state.set('businessEditor', businessEditor);
  }

  @Action('FormActor: supplierEditor')
  setSupEditor(state: IMap, supplierEditor) {
    return state.set('supplierEditor', supplierEditor);
  }

  @Action('FormActor: businessBanner')
  setBanner(state: IMap, businessBanner: string) {
    return state.set('businessBanner', businessBanner);
  }

  @Action('FormActor: supplierBanner')
  setSupplierBanner(state: IMap, supplierBanner: string) {
    return state.set('supplierBanner', supplierBanner);
  }

  @Action('FormActor: businessContent')
  setContent(state: IMap, businessContent: string) {
    return state.set('businessContent', businessContent);
  }

  @Action('FormActor: supplierContent')
  setSupplierContent(state: IMap, supplierContent: string) {
    return state.set('supplierContent', supplierContent);
  }

  @Action('FormActor: businessConfigId')
  setbusinessConfigId(state: IMap, businessConfigId: number) {
    return state.set('businessConfigId', businessConfigId);
  }

  @Action('setting: changeTab')
  changeTab(state,key){
    return state.set('tabKey',key);
  }
}
