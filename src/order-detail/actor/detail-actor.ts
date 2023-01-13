import { Actor, Action, IMap } from 'plume2';
import { Map } from 'immutable';

export default class DetailActor extends Actor {
  defaultState() {
    return {
      detail: {},
      // 表单内容
      formData: {},
      modalVisible: false,
      sellerRemarkVisible: true,
      // 卖家备注修改
      remedySellerRemark: '',
      //拒绝订单
      orderRejectModalVisible: false,
      isFetchingLogistics: false,
      isSavingShipment: false
    };
  }

  @Action('detail:init')
  init(state: IMap, res: Object) {
    return state.update('detail', (detail) => detail.merge(res));
  }

  @Action('detail-actor:changeDeliverNum')
  changeDeliverNum(state: IMap, { skuId, isGift, num }) {
    return state.update('detail', (detail) => {
      if (isGift) {
        return detail.setIn(
          [
            'gifts',
            detail.get('gifts').findIndex((item) => skuId == item.get('skuId')),
            'deliveringNum'
          ],
          num
        );
      } else {
        return detail.setIn(
          [
            'tradeItems',
            detail
              .get('tradeItems')
              .findIndex((item) => skuId == item.get('skuId')),
            'deliveringNum'
          ],
          num
        );
      }
    });
  }

  /**
   * 显示发货modal
   */
  @Action('detail-actor:showDelivery')
  show(state, needClear: boolean) {
    if (needClear) {
      state = state.set('formData', Map());
    }
    return state.set('modalVisible', true);
  }

  /**
   * 关闭发货modal
   * @param state
   */
  @Action('detail-actor:hideDelivery')
  hide(state) {
    return state.set('modalVisible', false);
  }

  /**
   * 显示驳回弹框
   * @param state
   */
  @Action('detail-actor:reject:show')
  showRejectModal(state: IMap) {
    return state.set('orderRejectModalVisible', true);
  }

  /**
   *关闭驳回弹框
   * @param state
   */
  @Action('detail-actor:reject:hide')
  hideRejectModal(state: IMap) {
    return state.set('orderRejectModalVisible', false);
  }

  /**
   * 显示/取消卖家备注修改
   * @param state
   * @returns {Map<string, boolean>}
   */
  @Action('detail-actor:setSellerRemarkVisible')
  setSellerRemarkVisible(state: IMap, param: boolean) {
    return state
      .set('sellerRemarkVisible', param)
      .set('remedySellerRemark', '');
  }

  /**
   * 修改卖家备注
   * @param state
   * @param param
   * @returns {Map<string, boolean>}
   */
  @Action('detail-actor:remedySellerRemark')
  remedySellerRemark(state: IMap, param: boolean) {
    return state.set('remedySellerRemark', param);
  }

  /**
   * 加载物流方式
   * @param state
   * @param isFetching
   * @returns
   */
  @Action('detail-actor:setIsFetchingLogistics')
  setIsFetchingLogistics(state: IMap, isFetching: boolean) {
    return state.set('isFetchingLogistics', isFetching);
  }

  /**
   * 保存物流设置
   * @param state
   * @param isSaving
   * @returns
   */
  @Action('detail-actor:setIsSavingShipment')
  setIsSavingShipment(state: IMap, isSaving: boolean) {
    return state.set('isSavingShipment', isSaving);
  }
}
