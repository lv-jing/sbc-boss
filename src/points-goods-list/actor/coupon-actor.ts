import { Actor, Action } from 'plume2';
import { fromJS } from 'immutable';
import { IMap } from 'typings/globalType';

interface IPageResponse {
	content: Array<any>;
	size: number;
	totalElements: number;
}

export default class CouponActor extends Actor {
  defaultState() {
    return {
      // 数据总条数
      couponTotal: 0,
      // 每页显示条数
      couponPageSize: 10,
      // 当前页的数据列表
      couponList: [],
      // 当前页码
      couponCurrent: 1,
      // 数据是否正在加载中
      couponLoading: true,
      // 搜索项信息
      couponSearchData: {},
      // 弹框是否展示
      couponVisible: false,
      // 新增/编辑的表单信息
      formData: {},
    };
  }

  /**
   * 设置分页数据
   */
  @Action('coupon:setPageData')
  setPageData(state: IMap, res: IPageResponse) {
    const { content, size, totalElements } = res;
    return state.withMutations((state) => {
      state
        .set('couponTotal', totalElements)
        .set('couponPageSize', size)
        .set('couponList', fromJS(content));
    });
  }

  /**
   * 设置当前页码
   */
  @Action('coupon:setCurrent')
  setCurrent(state: IMap, current) {
    return state.set('couponCurrent', current);
  }

  /**
   * 设置loading状态
   */
  @Action('coupon:setLoading')
  setLoading(state: IMap, loading) {
    return state.set('couponLoading', loading);
  }

  /**
   * 设置新增/编辑弹框是否展示
   */
  @Action('coupon:setVisible')
  setVisible(state: IMap, visible) {
    return state.set('couponVisible', visible);
  }

  /**
   * 设置新增/编辑的表单信息
   */
  @Action('coupon:setFormData')
  setFormData(state: IMap, data: IMap) {
    return state.set('formData', data);
  }

  /**
   * 修改新增/编辑的表单字段值
   */
  @Action('coupon:editFormData')
  editFormData(state: IMap, { key, value }) {
    return state.setIn(['formData', key], value);
  }

  /**
   * 修改搜索项信息
   */
  @Action('coupon:setSearchData')
  setSearchData(state: IMap, couponSearchData) {
    return state.set('couponSearchData', couponSearchData);
  }

}
