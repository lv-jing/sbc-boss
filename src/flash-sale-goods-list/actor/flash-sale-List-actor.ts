import { Action, Actor } from 'plume2';
import { fromJS } from 'immutable';

export default class FlashSaleListActor extends Actor {
  defaultState() {
    return {
      //活动日期，如：2019-06-12
      activityDate: '',
      //活动时间，如：13:00
      activityTime: '',
      //参与商家总数
      storeSum: '',
      //参与商品总数
      goodsSum: '',
      // 数据总条数
      total: 0,
      // 每页显示条数
      pageSize: 10,
      // 当前页的数据列表
      dataList: [],
      // 当前页码
      current: 1,
      // 数据是否正在加载中
      loading: true
    };
  }

  @Action('list-init')
  setInitParam(state, context) {
    const { activityDate, activityTime, storeSum, goodsSum } = context;
    return state
      .set('activityDate', activityDate)
      .set('activityTime', activityTime)
      .set('storeSum', storeSum)
      .set('goodsSum', goodsSum);
  }

  @Action('list-dataList')
  setDataList(state, result) {
    return state
      .set('dataList', fromJS(result).get('content'))
      .set('total', fromJS(result).get('total'));
  }

  @Action('list-load')
  setLoad(state, flag) {
    return state.set('loading', flag);
  }
}
