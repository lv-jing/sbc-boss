import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS } from 'immutable';
import ModalActor from './actor/modal-actor';
import ConfirmActor from './actor/confirm-actor';
import * as webapi from './webapi';
import { Const } from 'qmkit';

export default class AppStore extends Store {
  bindActor() {
    return [new ModalActor(), new ConfirmActor()];
  }

  /**
   * 打款弹窗
   */
  FightmoneyModal = (params: {}) => {
    //打款金额清空
    this.transaction(() => {
      this.dispatch('modalActor: FightmoneyModal');
      //弹框内容
      this.dispatch('modalActor:content', fromJS(params));
    });
  };

  /**
   * 关闭打款弹框
   */
  closeMoenyModal = () => {
    this.dispatch('modalActor: FightmoneyModal');
  };

  /**
   * 店铺收款账户明细
   */
  init = async (id) => {
    const { res: storeInfo } = await webapi.getStoreInfo(id);
    if (storeInfo.code == Const.SUCCESS_CODE) {
      this.dispatch('confirm:store', fromJS(storeInfo.context));
    } else {
      message.error(storeInfo.message);
    }
    const { res } = await webapi.getSingleAccountDetail(
      this.state()
        .get('storeInfo')
        .get('companyInfoId')
    );
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('confirm:detail', fromJS(res.context));
    }
  };

  /**
   * 商家打款
   * @returns {Promise<void>}
   */
  remitPrice = async () => {
    const modalContent = this.state().get('modalContent');
    const { res } = await webapi.remitMoney({
      accountId: modalContent.get('accountId'),
      remitPrice: modalContent.get('remitPrice')
    });
    if (res.code == Const.SUCCESS_CODE) {
      message.success('打款成功！');
      this.init(
        this.state()
          .get('storeInfo')
          .get('storeId')
      );
      //关闭弹框
      this.dispatch('modalActor: FightmoneyModal');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 打款金额
   */
  changeRemitPrice = (value) => {
    this.dispatch('modal:remitPrice', value);
  };

  /**
   * 入驻时间以及显示那种类别的页面
   * @param time
   * @param {string} kind
   */
  enterTime = (time: any, kind: string) => {
    this.transaction(() => {
      this.dispatch('confirm:applyEnterTime', time);
      this.dispatch('confirm:kind', kind);
    });
  };
}
