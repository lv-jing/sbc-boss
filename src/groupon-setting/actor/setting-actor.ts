import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class FormActor extends Actor {
  defaultState() {
    return {
      // 拼团设置(开启or关闭)
      grouponFlag: false,
      //拼团广告
      grouponPosters:fromJS([]),    
      //拼团规则
      rule:'',
      // 其它交互相关信息
      loading: true,
      spuModal:false,      
      num:0,
      activeKey:'1'
    };
  }

  constructor() {
    super();
  }

  /**
   * 初始化
   */
  @Action('loading:end')
  init(state: IMap) {
    return state.set('loading', false);
  }

  /**
   * 删除选择的sku
   */
  @Action('setting:delete:sku')
  deleteSelectSku(state, skuId) {
    let goodsRows = state.getIn(['recruit', 'goodsRows']);
    let goodsInfoIds = state.getIn(['recruit', 'goodsInfoIds']);
    goodsInfoIds = goodsInfoIds.splice(
      goodsInfoIds.findIndex((item) => item == skuId),
      1
    );
    goodsRows = goodsRows.delete(
      goodsRows.findIndex((row) => row.get('goodsInfoId') == skuId)
    );
    return state.update('recruit', (recruit) =>
      recruit.set('goodsRows', goodsRows).set('goodsInfoIds', goodsInfoIds)
    );
  }

  /**
   * 键值设置
   */
  @Action('setting:fields:value')
  fieldsValue(state, { field, value }) {
    return state.setIn(field, fromJS(value));
  }

  /**
   * 选择优惠券
   */
  @Action('setting:choose:coupons')
  onChosenCoupons(state, coupons) {
    coupons = coupons.map((coupon) => {
      if (!coupon.get('totalCount')) coupon = coupon.set('totalCount', 1);
      return coupon;
    });
    return state.setIn(['reward', 'coupons'], coupons);
  }

  /**
   * 删除优惠券
   */
  @Action('setting:del:coupon')
  onDelCoupon(state, couponId) {
    return state.updateIn(['reward', 'coupons'], (coupons) =>
      coupons.filter((coupon) => coupon.get('couponId') != couponId)
    );
  }

  /**
   * 修改优惠券总张数
   * @param index 修改的优惠券的索引位置
   * @param totalCount 优惠券总张数
   */
  @Action('setting:coupon:count')
  changeCouponTotalCount(state, { index, totalCount }) {
    return state.setIn(['reward', 'coupons', index, 'totalCount'], totalCount);
  }

  @Action('setting:toggleSpuModal')
  toggleSpuModal(state){
    return state.set('spuModal',!state.get('spuModal'))
  }

  @Action('setting:spuList')
  setSpuList(state,result){
    return state.set('spuList',fromJS(result))
  }

  @Action('setting :saveRule')
  saveRule(state,value){
    return state.set('rule',value)
  }

  @Action('settting :changeSwitch')
  changeSwitch(state,value){
    return state.set('grouponFlag',value)
  }

  @Action('setting :num')
  setNum(state,num){
    return state.set('num',num)
  }

  @Action('settting :rule')
  setRule(state,rule){
    return state.set('rule',rule)
  }

  @Action('setting :changeKey')
  changeKey(state,value){
    return state.set('activeKey',value)
  }
}
