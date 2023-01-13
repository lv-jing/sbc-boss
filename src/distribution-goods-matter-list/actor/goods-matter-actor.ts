import { Action, Actor } from 'plume2';
import { IMap } from '../../../typings/globalType';
import { fromJS } from 'immutable';

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
        sortRole: 'desc'
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
      showUrl: ''
    };
  }

  //设置搜索条件
  @Action('form: field')
  formFiledChange(state, { key, value }) {
    return state.setIn(['form', key], value);
  }

  //初始化
  @Action('init')
  init(state, { goodsMatterList, total, pageNum }) {
    return state
      .set('goodsMatterList', goodsMatterList)
      .set('total', total)
      .set('pageNum', pageNum);
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
}
