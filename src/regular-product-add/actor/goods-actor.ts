import { Action, Actor } from 'plume2';
import { IList, IMap } from 'typings/globalType';
import { treeNesting } from '../../../web_modules/qmkit/utils/utils';

export default class GoodsActor extends Actor {
  defaultState() {
    return {
      // 平台类目信息
      cateList: [],
      sourceCateList: [],
      // 店铺分类信息
      storeCateList: [],
      sourceStoreCateList: [],
      sourceGoodCateList: [],
      // 品牌信息
      brandList: [],
      // 商品信息
      goods: {
        // 分类编号
        cateId: '',
        // 品牌编号
        brandId: '',
        // 商品名称
        goodsName: '',
        // SPU编码
        goodsNo: '',
        internalGoodsNo: '',
        promotions: 'autoship',
        // 计量单位
        goodsUnit: '',
        // 上下架状态
        addedFlag: 1,
        // 商品详情
        goodsDetail: '',
        // 市场价
        mktPrice: '',
        // 成本价
        costPrice: '',
        goodsSubTitle: '',
        //商品视频
        goodsVideo: '',
        //是否允许独立设价
        allowPriceSet: 0,
        saleType: 0,
        saleableFlag: 1,
        displayFlag: 1,
        subscriptionStatus: 1,
        subscriptionPrice: '',
        goodsId: null,
        defaultPurchaseType: null,
        defaultFrequencyId: null,
        resource: 1 //商品来源
      },
      // 是否编辑商品
      isEditGoods: false,
      //保存状态loading
      saveLoading: false,
      detailEditor: {},
      tabDetailEditor: {},
      editor: 'detail',
      // 当前处于基础信息tab还是价格tab：main | price
      activeTabKey: 'main',
      // 平台类目是否禁用，默认是，如果是新增商品，改成false
      cateDisabled: true,
      goodsTabs: [],
      //正在进行或将要进行的抢购商品
      flashsaleGoods: [],
      goodsDetailTab: [],
      nextType: '',
      getGoodsCate: '',
      filtersTotal: '',
      saveSuccessful: false,
      getGoodsId: '',
      taggingTotal: '',
      goodsTaggingRelList: null,
      productFilter: null,
      oldGoodsDetailTabContent: '',
      resourceCates: [],
      purchaseTypeList: [],
      frequencyList: '',
      goodsDescriptionDetailList: []
    };
  }

  /**
   * 初始化分类
   * @param state
   * @param dataList
   */
  @Action('goodsActor: initCateList')
  initCateList(state, dataList: IList) {
    // 改变数据形态，变为层级结构
    const newDataList = treeNesting(dataList,'cateParentId','cateId')
    return state.set('cateList', newDataList).set('sourceCateList', dataList);
  }

  /**
   * 初始化店铺分类
   * @param state
   * @param dataList
   */
  @Action('goodsActor: initStoreCateList')
  initStoreCateList(state, dataList: IList) {
    // 改变数据形态，变为层级结构
    const newDataList = treeNesting(dataList,'cateParentId','cateId')
    return state.set('storeCateList', newDataList).set('sourceStoreCateList', dataList);
  }

  /**
   * 初始化品牌
   * @param state
   * @param brandList
   */
  @Action('goodsActor: initBrandList')
  initBrandList(state, brandList: IList) {
    return state.set('brandList', brandList);
  }

  @Action('goodsActor: isEditGoods')
  isEditGoods(state, isEditGoods) {
    return state.set('isEditGoods', isEditGoods);
  }

  @Action('goodsActor: tabChange')
  tabChange(state, activeKey) {
    return state.set('activeTabKey', activeKey);
  }

  @Action('goodsActor: detailEditor')
  detailEditor(state, obj) {
    // return state.set('detailEditor', detailEditor);
    return state.set(obj.ref, obj.detailEditor);
  }

  @Action('goodsActor: tabDetailEditor')
  tabDetailEditor(state, data) {
    return state.set(data.tab, data);
  }

  @Action('goodsActor: goodsTabs')
  goodsTabs(state, goodsTabs) {
    return state.set('goodsTabs', goodsTabs);
  }

  @Action('goodsActor:getGoodsCate')
  getGoodsCate(state, getGoodsCate) {
    const newDataList = treeNesting(getGoodsCate,'cateParentId','cateId')
    return state.set('getGoodsCate', newDataList).set('sourceGoodCateList', getGoodsCate);
  }

  @Action('goodsActor:filtersTotal')
  filtersTotal(state, filtersTotal) {
    return state.set('filtersTotal', filtersTotal);
  }

  @Action('goodsActor:taggingTotal')
  taggingTotal(state, taggingTotal) {
    return state.set('taggingTotal', taggingTotal);
  }

  @Action('goodsActor:saveSuccessful')
  saveSuccessful(state, saveSuccessful) {
    return state.set('saveSuccessful', saveSuccessful);
  }

  @Action('goodsActor:getGoodsId')
  getGoodsId(state, getGoodsId) {
    return state.set('getGoodsId', getGoodsId);
  }

  /**
   * 修改商品信息
   * @param state
   * @param data
   */

  @Action('goodsActor: editGoods')
  editGoods(state, data: IMap) {
    return state.update('goods', (goods) => goods.merge(data));
  }

  @Action('goodsActor: goodsDetailTabContentOld')
  saveOldGoodsDetailTabContent(state, data) {
    return state.set('oldGoodsDetailTabContent', data);
  }

  @Action('goodsActor:randomGoodsNo')
  randomGoodsNo(state, prefix) {
    let number = new Date(sessionStorage.getItem('defaultLocalDateTime')).getTime().toString().slice(4, 10) + Math.random().toString().slice(2, 5);
    return state.update('goods', (goods) => goods.set('goodsNo', 'P' + number).set('internalGoodsNo', prefix + '_P' + number));
  }

  /**
   * 修改商品信息
   * @param state
   * @param saveLoading
   */
  @Action('goodsActor: saveLoading')
  saveLoading(state, saveLoading: boolean) {
    return state.set('saveLoading', saveLoading);
  }

  /**
   * 是否禁用平台类目选择
   * @param state
   * @param disableCate
   */
  @Action('goodsActor: disableCate')
  disableCate(state, disableCate: boolean) {
    return state.set('cateDisabled', disableCate);
  }

  @Action('goodsActor: editor')
  editEditor(state, editor) {
    return state.set('editor', editor);
  }
  @Action('priceActor:setAlonePrice')
  toggleSetAlonePrice(state, result) {
    return state.setIn(['goods', 'allowPriceSet'], result);
  }

  @Action('priceActor:goodsId')
  updateGoodsId(state, result) {
    return state.setIn(['goods', 'goodsId'], result);
  }
  @Action('goodsActor:flashsaleGoods')
  setFlashsaleGoods(state, context) {
    return state.set('flashsaleGoods', context);
  }
  @Action('goodsActor: setGoodsDetailTab')
  setGoodsDetailTab(state, dataList) {
    return state.set('goodsDetailTab', dataList);
  }

  @Action('product:nextType')
  activeTabKey(state, dataList) {
    return state.set('activeTabKey', dataList);
  }

  @Action('product:goodsTaggingRelList')
  goodsTaggingRelList(state, goodsTaggingRelList) {
    return state.set('goodsTaggingRelList', goodsTaggingRelList);
  }

  @Action('product:productFilter')
  productFilter(state, productFilter) {
    return state.set('productFilter', productFilter);
  }

  @Action('goodsActor:resourceCates')
  resourceCates(state, resourceCates) {
    return state.set('resourceCates', resourceCates);
  }
  @Action('goodsActor:purchaseTypeList')
  purchaseTypeList(state, purchaseTypeList) {
    return state.set('purchaseTypeList', purchaseTypeList);
  }
  @Action('goodsActor:frequencyList')
  frequencyList(state, params) {
    const frequencyList = params;
    return state.set('frequencyList', frequencyList);
  }
  @Action('goodsActor:descriptionTab')
  goodsDescriptionTab(state, tabList) {
    return state.set('goodsDescriptionDetailList', tabList);
  }
}

//1 fgs（text）  2、weshare 3、  salsify
