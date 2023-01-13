import { Action, Actor } from 'plume2';

export default class TagActor extends Actor {
  defaultState() {
    return {
      name: '',
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前页
      pageNum: 1,
      tagList: [],
      visible: false,
      edit: false,
      tagObj: { name: '' }
    };
  }


  @Action('form: field')
  formFiledChange(state, { key, value }) {
    return state.set(key, value);
  }

  @Action('tag: visible')
  setVisible(state, visible: boolean) {
    return state.set('visible', visible);
  }

  @Action('tag: tagObj')
  setTagObj(state, tagObj: any) {
    return state.set('tagObj', tagObj);
  }

  @Action('tag: edit')
  setEdit(state, edit: boolean) {
    return state.set('edit', edit);
  }

  @Action('init')
  init(state, { tagList, total, pageNum }) {
    return state
      .set('tagList', tagList)
      .set('total', total)
      .set('pageNum', pageNum);
  }
}
