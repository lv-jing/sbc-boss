import { Actor, Action, IMap } from 'plume2';
import { List, fromJS } from 'immutable';

declare type IList = List<any>;

export default class GoodsActor extends Actor {
  defaultState() {
    return {
      // 商品分页数据
      goodsInfoList: [],
      // 选中的商品
      selectedSkuKeys: [],
      // 企业购商品总数
      totalCount: 0,
      // 当前的分页条数
      pageSize: 10,
      // 当前页
      pageNum: 0,
      // 商家信息
      companyInfoList: [],
      // 商品SKU的规格值全部数据
      goodsInfoSpecDetails: [],
      // 分类列表
      goodsCateList: [],
      // 品牌列表
      goodsBrandList: [],
      // 品牌
      brandList: [],
      // 商品分类
      cateList: [],

      // 驳回企业购理由弹出框是否显示
      modalVisible: false,
      // 驳回企业购商品标识
      forbidGoodsInfoId: '',
      // 驳回企业购原因
      forbidReason: '',
      // 企业购设置
      enterpriseSetting: ''
    };
  }

  /**
   * 初始化企业购商品列表
   * @param {IMap} state
   * @param data
   * @returns {Map<string, any>}
   */
  @Action('init')
  init(state: IMap, { data, pageNum }) {
    return state
      .set('goodsInfoList', fromJS(data.goodsInfoPage.content))
      .set('totalCount', data.goodsInfoPage.total)
      .set('goodsInfoSpecDetails', fromJS(data.goodsInfoSpecDetails))
      .set('companyInfoList', fromJS(data.companyInfoList))
      .set('goodsCateList', fromJS(data.cates))
      .set('goodsBrandList', fromJS(data.brands))
      .set('pageNum', pageNum)
      .set('selectedSkuKeys', List());
  }

  /**
   * 设置企业购设置信息
   * @param state
   * @param key
   */
  @Action('setting: info')
  detail(state: IMap, setting) {
    return state.set('enterpriseSetting', fromJS(setting));
  }

  /**
   * 页面初始化加载品牌列表
   * @param state
   * @param {IList} brandList
   * @returns {any}
   */
  @Action('brandActor: init')
  initBrand(state, brandList: IList) {
    return state.set('brandList', brandList);
  }

  /**
   * 页面初始化加载分类列表
   * @param state
   * @param {IList} cateList
   * @returns {any}
   */
  @Action('cateActor: init')
  initCate(state, cateList: IList) {
    return state.set('cateList', cateList);
  }

  /**
   * 多选选中的skuId
   * @param {IMap} state
   * @param {IList} selectedKeys
   * @returns {Map<string, any>}
   */
  @Action('goods: sku: checked')
  onSelectChange(state: IMap, selectedKeys: IList) {
    return state.set('selectedSkuKeys', selectedKeys);
  }

  /**
   * 数值变化
   * @param state
   * @param param1
   */
  @Action('goods: field: change')
  onFieldChange(state: IMap, { field, value }) {
    return state.set(field, value);
  }

  /**
   * 显示/关闭弹窗
   */
  @Action('goodsActor: switchShowModal')
  switchShow(state, flag: boolean) {
    if (flag) {
      return state.set('modalVisible', flag);
    } else {
      return state
        .set('modalVisible', flag)
        .set('forbidGoodsInfoId', '')
        .set('forbidReason', '');
    }
  }
}
