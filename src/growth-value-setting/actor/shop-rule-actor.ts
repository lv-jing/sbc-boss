import { Actor, Action, IMap } from 'plume2';
import { Map } from 'immutable';
import { IList } from 'typings/globalType';

export default class ShopRuleActor extends Actor {
  defaultState() {
    return {
      // 分类集合
      cates: [],
      // 平台全部分类集合
      allCates: [],
      // 弹框是否显示
      modalVisible: false,
      // 表单内容
      formData: {
        // 是否使用上级成长值获取比例 0: 否  1: 是
        isParentGrowthValueRate: 0
      },
      // 上级成长值获取比例
      parentRate: 0
    };
  }

  /**
   * 初始化
   */
  @Action('growth-value-shop-rule: init')
  init(state: IMap, cates: IList) {
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
  }

  /**
   * 修改表单内容
   */
  @Action('growth-value-shop-rule: editFormData')
  editCateInfo(state: IMap, data: IMap) {
    return state.update('formData', (formData) => formData.merge(data));
  }

  /**
   * 显示弹窗
   */
  @Action('growth-value-shop-rule: modal')
  show(state: IMap) {
    const visible = !state.get('modalVisible');
    if (!visible) {
      state = state
        .set(
          'formData',
          Map({
            isParentGrowthValueRate: 0
          })
        )
        .set('parentRate', 0);
    }

    return state.set('modalVisible', visible);
  }

  /**
   * 存储父级成长值获取比例
   * @param state
   * @param rate
   */
  @Action('growth-value-shop-rule: rate')
  setParentRate(state: IMap, rate: number) {
    return state.set('parentRate', rate);
  }

  /**
   * 是否使用父级成长值获取比例
   * @param state
   */
  @Action('growth-value-shop-rule: rate: use')
  useParentRateF(state: IMap, num: number) {
    return state.setIn(['formData', 'isParentGrowthValueRate'], num);
  }
}
