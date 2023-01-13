import { Store, IOptions } from 'plume2';
import * as webapi from './webapi';
import loadingActor from './actor/loading-actor';
import listActor from './actor/list-actor';
import editActor from './actor/edit-actor';
import visibleActor from './actor/visible-actor';
import GateWaysActor from './actor/gateways-actor';
import { fromJS } from 'immutable';
import { message } from 'antd';
import { Const } from 'qmkit';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [
      new loadingActor(),
      new listActor(),
      new editActor(),
      new visibleActor(),
      new GateWaysActor()
    ];
  }

  /**
   * 初始化在线支付
   */
  init = async () => {
    const gateWaysJson = (await webapi.getTradeGateWays()) as any;

    let gateWaysList = '';
    if ((gateWaysJson.res.code = Const.SUCCESS_CODE)) {
      // 只展示单一支付
      gateWaysList = gateWaysJson.res.context.filter((i) => i.type == 0);
    }

    if (gateWaysList) {
      this.dispatch('gateWays:init', gateWaysList);
    }
  };

  /**
   * 初始化线下支付
   */
  initOffLineAccounts = async () => {
    this.dispatch('loading:start');

    const { res } = await webapi.fetchAllOfflineAccounts();

    this.transaction(() => {
      this.dispatch('loading:end');
      this.dispatch('list:init', fromJS(res));
    });
  };

  onAdd = () => {
    this.dispatch('modal:show');
  };

  onCancel = () => {
    this.transaction(() => {
      this.dispatch('edit', false);
      this.dispatch('modal:hide');
    });
  };

  onEdit = (id: string) => {
    const account = this.state()
      .get('dataList')
      .find((account) => account.get('accountId') == id);

    this.transaction(() => {
      this.dispatch('edit', true);
      this.dispatch('edit:init', account);
      this.dispatch('modal:show');
    });
  };

  // 保存
  onSave = async (params) => {
    if (this.state().get('edit')) {
      params.accountId = this.state().getIn(['accountForm', 'accountId']);
      const { res } = await webapi.editOfflineAccount(params);

      if (res.code === Const.SUCCESS_CODE) {
        message.success('操作成功');
        this.transaction(() => {
          this.dispatch('modal:hide');
          this.dispatch('edit', false);
        });
        this.initOffLineAccounts();
      } else {
        message.error(res.message);
      }
      return;
    }

    const { res: saveRes } = await webapi.saveOfflineAccount(params);
    if (saveRes.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.dispatch('modal:hide');
      this.initOffLineAccounts();
    } else {
      message.error(saveRes.message);
    }
  };

  // 删除账户
  onDelete = async (id) => {
    const { res } = await webapi.deleteOfflineAccount(id);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.initOffLineAccounts();
    } else {
      message.error(res.message);
    }
  };

  // 启用
  onEnable = async (id) => {
    const { res } = await webapi.enableOfflineAccount(id);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.initOffLineAccounts();
    } else {
      message.error(res.message);
    }
  };

  // 禁用
  onDisable = async (id) => {
    const { res } = await webapi.disableOfflineAccount(id);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.initOffLineAccounts();
    } else {
      message.error(res.message);
    }
  };

  onEditChannel = async (gatewayId) => {
    const { res } = await webapi.getChannelsByGateWaysId(gatewayId);
    if (res.code === Const.SUCCESS_CODE) {
      let channelJson = res.context;
      let channelValue = {};
      channelJson['channelItemList'].forEach((value) => {
        channelValue[value['code']] = value;
      });
      channelJson['channelItemList'] = channelValue;
      if (gatewayId == 1) {
        this.dispatch('modal:channel_show', fromJS(channelJson));
      } else if (gatewayId == 2) {
        this.dispatch('modal:union_b2b_show', fromJS(channelJson));
      } else if (gatewayId == 3) {
        this.dispatch('modal:wx_pay_show', fromJS(channelJson));
      } else if (gatewayId == 4) {
        this.dispatch('modal:alipay_show', fromJS(channelJson));
      } else if (gatewayId == 5) {
        this.dispatch('modal:balance_show', fromJS(channelJson));
      }
    }
  };

  onCancelChannel = () => {
    this.transaction(() => {
      this.dispatch('modal:channel_hide');
    });
  };

  onSaveChannel = async () => {
    let channelJson = this.state()
      .get('channelJson')
      .toJS();
    let channelItems = [];
    let checkedWxChannel = false;
    for (let item in channelJson['channelItemList']) {
      if (
        (item === 'wx' || item === 'wx_pub' || item === 'wx_pub_qr') &&
        channelJson['channelItemList'][item]['isOpen'] == 1
      ) {
        checkedWxChannel = true;
      }
      channelItems.push(channelJson['channelItemList'][item]);
    }
    channelJson['channelItemList'] = channelItems;

    //ping++与支付宝、微信互斥
    const gatewaysList = this.state().get('gateways');
    let flag = false;
    if (channelJson['name'] == 'ALIPAY') {
      // apiKey 接口必传参数，该字段对支付宝没有实际意义
      channelJson['payGatewayConfig']['apiKey'] = 1;
      if (channelJson['isOpen'] == 1) {
        gatewaysList.map((val) => {
          if (val['name'] == 'PING' && val['isOpen'] == 1) {
            flag = true;
          }
        });

        if (flag) {
          message.error('支付宝支付与聚合支付不可同时开启');
          return;
        }
      }
    } else if (channelJson['name'] == 'PING' && channelJson['isOpen'] == 1) {
      gatewaysList.map((val) => {
        if (
          (val['name'] == 'ALIPAY' && val['isOpen'] == 1) ||
          (val['name'] == 'WECHAT' && val['isOpen'] == 1)
        ) {
          flag = true;
        }
      });

      if (flag) {
        message.error('聚合支付与支付宝支付或是微信支付不可同时开启');
        return;
      }
    } else if (channelJson['name'] == 'WECHAT' && channelJson['isOpen'] == 1) {
      gatewaysList.map((val) => {
        if (val['name'] == 'PING' && val['isOpen'] == 1) {
          flag = true;
        }
      });
      if (flag) {
        message.error('微信支付与聚合支付不可同时开启');
        return;
      }
    }

    if (checkedWxChannel) {
      if (!channelJson['payGatewayConfig']['secret']) {
        message.error('您选择了微信相关支付渠道，微信公众号App ID 不能为空');
        return;
      }
      if (!channelJson['payGatewayConfig']['appId2']) {
        message.error('您选择了微信相关支付渠道，微信Secret Key 不能为空');
        return;
      }
    }

    const { res } = await webapi.saveGateWaysDetails(channelJson);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.dispatch('modal:channel_hide');
      this.dispatch('modal:union_b2b_hide');
      this.dispatch('modal:wx_pay_hide');
      this.dispatch('modal:alipay_hide');
      this.dispatch('modal:balance_hide');
      this.init();
    } else {
      message.error(res.message);
    }
  };

  onFormValueChange = (key, value) => {
    let keyPath = key.split('.');
    keyPath.unshift('channelJson');
    let valueJson = { key: keyPath, value: value };
    this.dispatch('gateWays:formValue', valueJson);
  };
  //银联b2b弹窗关闭
  onCancelUnionB2b = () => {
    this.transaction(() => {
      this.dispatch('modal:union_b2b_hide');
    });
  };

  //微信支付配置弹窗关闭
  onCancelWxPayModal = () => {
    this.transaction(() => {
      this.dispatch('modal:wx_pay_hide');
    });
  };

  //支付宝配置弹窗关闭
  onCancelaliPayModal = () => {
    this.transaction(() => {
      this.dispatch('modal:alipay_hide');
    });
  };

  //月支付弹窗关闭
  onCancelBalance = () => {
    this.transaction(() => {
      this.dispatch('modal:balance_hide');
    });
  };
}
