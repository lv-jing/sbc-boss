import { Actor, Action, IMap } from 'plume2';
import { Map, fromJS } from 'immutable';
import { IList } from 'typings/globalType';

export default class CateActor extends Actor {
  defaultState() {
    return {
      // 分类集合
      cates: [],
      // 一级类目数量
      firstCount: 0,
      // 二级类目数量
      secondCount: 0,
      // 三级类目数量
      thirdCount: 0,
      // 平台全部分类集合
      allCates: [],
      // 弹框是否显示
      modalVisible: false,
      // 表单内容
      formData: {
        // 是否使用上级类目扣率 0: 否  1: 是
        isParentCateRate: 0
      },
      childFlag: false,
      goodsFlag: false,
      images: [],
      isAdd: true,
      // 上级类目扣率
      parentRate: 0
    };
  }

  /**
   * 初始化
   */
  @Action('cate: init')
  init(state: IMap, cates: IList) {
    const firstCount = cates.count((f) => f.get('cateGrade') == 1);
    const secondCount = cates.count((f) => f.get('cateGrade') == 2);
    const thirdCount = cates.count((f) => f.get('cateGrade') == 3);
    // 改变数据形态，变为层级结构
    const newDataList = cates
      .filter((item) => item.get('cateParentId') == 0)
      .map((data) => {
        const children = cates
          .filter((item) => item.get('cateParentId') == data.get('cateId'))
          .map((childrenData) => {
            const lastChildren = cates
              .filter(
                (item) => item.get('cateParentId') == childrenData.get('cateId')
              )
              .sort((c1, c2) => {
                return c1.get('sort') - c2.get('sort');
              });
            if (!lastChildren.isEmpty()) {
              childrenData = childrenData.set('children', lastChildren);
            }
            return childrenData;
          })
          .sort((c1, c2) => {
            return c1.get('sort') - c2.get('sort');
          });
        if (!children.isEmpty()) {
          data = data.set('children', children);
        }
        return data;
      })
      .sort((c1, c2) => {
        return c1.get('sort') - c2.get('sort');
      });
    return state
      .set('cates', newDataList)
      .set('allCates', cates)
      .set('firstCount', firstCount)
      .set('secondCount', secondCount)
      .set('thirdCount', thirdCount);
  }

  /**
   * 修改表单内容
   */
  @Action('cate: editFormData')
  editCateInfo(state: IMap, data: IMap) {
    return state.update('formData', (formData) => formData.merge(data));
  }

  /**
   * 显示弹窗
   */
  @Action('cate: modal')
  show(state: IMap, isAdd) {
    const visible = !state.get('modalVisible');
    if (!visible) {
      state = state
        .set(
          'formData',
          Map({
            isParentCateRate: 0
          })
        )
        .set('images', fromJS([]))
        .set('parentRate', 0);
    }

    state = state.set('isAdd', isAdd);

    return state.set('modalVisible', visible);
  }

  /**
   * 检测子类
   */
  @Action('cateActor: child')
  child(state, flag: boolean) {
    return state.set('childFlag', flag);
  }

  /**
   * 检测商品关联
   */
  @Action('cateActor: goods')
  image(state, flag: boolean) {
    return state.set('goodsFlag', flag);
  }

  @Action('cateActor: editImages')
  editImages(state, images) {
    return state.set('images', images);
  }

  /**
   * 存储父级分类扣率
   * @param state
   * @param rate
   */
  @Action('cate: rate')
  setParentRate(state: IMap, rate: number) {
    return state.set('parentRate', rate);
  }

  /**
   * 是否使用父级分类扣率
   * @param state
   */
  @Action('cate: rate: use')
  useParentRateF(state: IMap, num: number) {
    return state.setIn(['formData', 'isParentCateRate'], num);
  }
}
