import { Action, Actor, IMap } from 'plume2';
import { List, fromJS } from 'immutable';

declare type IList = List<any>;

export default class GoodsMatterActor extends Actor {
  defaultState() {
    return {
      //素材标题数据
      head: {
        skuImageUrl: '',
        skuName: '',
        skuNo: '',
        skuSpe: ''
      },
      //联动标题
      postTitleSource: [{ title: '发布者账号' }, { title: '发布者名称' }],
      //列表页字段排序规则
      sortedInfo: { order: 'desc', columnKey: 'updateTime' },
      form: {
        //商品skuid
        goodsInfoId: null,
        //发布者id
        operatorId: null,
        //分享次数范围（小）
        recommendNumMin: null,
        //分享次数范围（大）
        recommendNumMax: null,
        //排序
        sortColumn: 'updateTime',
        sortRole: 'desc',
        // 商品搜索项类型 0: 商品名称 1: SKU编码
        optGoodsType: '0',
        //素材类型
        matterType: null
      },
      postTitle: {
        //选择的下拉标题
        chooseTitle: '0',
        //模糊查询的数据源
        postTitleData: [],
        text: ''
      },
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前页
      pageNum: 1,
      goodsMatterList: [],
      //展示的图片
      showUrl: '',
      // 店铺名称模糊搜结果
      storeMap: {},
      // 品牌
      brandList: [],
      // 商品分类
      cateList: [],
      // 商家信息
      companyInfoList: [],
      // 商品SKU的规格值全部数据
      goodsInfoSpecDetails: []
    };
  }

  //设置搜索条件
  @Action('form: field')
  formFiledChange(state, { key, value }) {
    return state.setIn(['form', key], value);
  }

  //初始化
  @Action('init')
  init(
    state,
    { goodsMatterList, total, pageNum, goodsInfoSpecDetails, companyInfoList }
  ) {
    return state
      .set('goodsMatterList', goodsMatterList)
      .set('total', total)
      .set('pageNum', pageNum)
      .set('goodsInfoSpecDetails', fromJS(goodsInfoSpecDetails))
      .set('companyInfoList', fromJS(companyInfoList));
  }

  //下拉框内容设置
  @Action('postTitle: change')
  fieldTitleChange(state, { key, value }) {
    if (key == 'chooseTitle') {
      state = state
        .setIn(['postTitle', 'postTitleData'], fromJS([]))
        .setIn(['form', 'operatorId'], null);
    }
    return state.setIn(['postTitle', key], value);
  }

  @Action('show: image')
  showImage(state, url) {
    return state.set('showUrl', url);
  }

  //初始化页面头部信息
  @Action('init: head')
  initHead(state, info) {
    return state
      .set('head', info)
      .setIn(['form', 'goodsInfoId'], info.get('goodsInfoId'));
  }

  /**
   * 设置排序规则
   * @param {IMap} state
   * @param data
   * @returns {Map<string, V>}
   */
  @Action('sort: set')
  setSortedInfo(state: IMap, data) {
    if (!data.columnKey) {
      state = state
        .setIn(['form', 'sortColumn'], 'updateTime')
        .setIn(['form', 'sortRole'], 'desc');
    } else {
      state = state
        .setIn(['form', 'sortColumn'], data.columnKey)
        .setIn(['form', 'sortRole'], data.order === 'ascend' ? 'asc' : 'desc');
    }
    return state.set(
      'sortedInfo',
      fromJS({ columnKey: data.columnKey, order: data.order })
    );
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
   * 店铺名称模糊搜结果
   * @param {IMap} state
   * @param storeMap
   * @returns {Map<string, any>}
   */
  @Action('form: store: info')
  storeMap(state: IMap, storeMap) {
    return state.set('storeMap', fromJS(storeMap));
  }
}
