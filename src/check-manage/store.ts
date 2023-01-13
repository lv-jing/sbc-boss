import { IOptions, Store } from 'plume2';
import { fromJS } from 'immutable';
import { message } from 'antd';
import { Const } from 'qmkit';
import CheckManageActor from './actor/check-manage-actor';
import * as webapi from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
  }

  bindActor() {
    return [new CheckManageActor()];
  }

  init = async () => {
    const { res } = await webapi.listAll();
    const goodsSetList = await webapi.queryGoodsSettings();
    this.transaction(() => {
      this.dispatch('check-manage:init', fromJS((res as any).context));
      this.dispatch(
        'goods-evaluate-setting:init',
        fromJS(goodsSetList.res.context)
      );
    });
  };

  switchChange = async (type, key, checked) => {
    this.dispatch('check-manage:check', { type, key, checked });

    let result: any;

    if (key == 'supplier_goods_audit') {
      if (checked) {
        result = await webapi.openGoodsAudit();
      } else {
        result = await webapi.closeGoodsAudit();
      }
    } else if (key == 'boss_goods_audit') {
      if (checked) {
        result = await webapi.openSelfGoodsAudit();
      } else {
        result = await webapi.closeSelfGoodsAudit();
      }
    } else if (key == 'order_audit') {
      if (checked) {
        result = await webapi.openOrderAudit();
      } else {
        result = await webapi.closeOrderAudit();
      }
    } else if (key == 'customer_audit') {
      if (checked) {
        result = await webapi.openCustomerAudit();
      } else {
        result = await webapi.closeCustomerAudit();
      }
    } else if (key == 'ticket_aduit') {
      const status = checked ? 1 : 0;
      result = await webapi.saveInvoiceStatus(status);
    } else if (key == 'customer_info_audit') {
      if (checked) {
        result = await webapi.openCustomerInfoAudit();
      } else {
        result = await webapi.closeCustomerInfoAudit();
      }
    } else if (key == 'user_audit') {
      //打开用户设置
      if (checked) {
        result = await webapi.openUserAudit();
      } else {
        result = await webapi.closeUserAudit();
      }
    } else if (key == 'pc_goods_image_switch') {
      result = await webapi.setImgDisplayForPc(checked);
    } else if (key == 'pc_goods_spec_switch') {
      result = await webapi.setSpecDisplayForPc(checked);
    } else if (key == 'mobile_goods_image_switch') {
      result = await webapi.setImgDisplayForMobile(checked);
    } else if (key == 'mobile_goods_spec_switch') {
      result = await webapi.setSpecDisplayForMobile(checked);
    }
    if (result) {
      const { code, message: msg } = result.res;
      if (code == Const.SUCCESS_CODE) {
        message.success('操作成功');
      } else {
        message.error(msg);
      }
    }

    this.init();
  };

  /**
   * 修改商品评价开关
   * @param flag 开关状态
   */
  editGoodsEvaluateSetting = async (flag) => {
    const status = flag ? 1 : 0;
    this.dispatch('goods-evaluate-setting:edit', status);
    const { res } = await webapi.editGoodsEvaluate(status);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('修改成功!');
    } else {
      this.dispatch('goods-evaluate-setting:edit', flag ? 0 : 1);
      message.error('修改失败!');
    }
  };

  editShareSetting = async (values) => {
    const { res } = await webapi.editSetting({
      context: JSON.stringify(values)
    });
    if (res.code == Const.SUCCESS_CODE) {
      message.success('修改成功!');
    } else {
      message.error('修改失败!');
    }
  };
}
