import { Actor, Action, IMap } from 'plume2';
import {fromJS} from 'immutable';

export default class FormActor extends Actor {
  defaultState() {
    return {
      configs: [
        {
          configType: 'supplier_goods_audit',
          checkSorts: '商品审核',
          explain:
            '商家商品审核开关，默认打开，打开时，商家新增商品需经过平台审核通过才能销售，关闭时，商家上架商品后即可销售'
        },
        {
          configType: 'boss_goods_audit',
          checkSorts: '自营商品审核',
          explain:
            '自营商家商品审核开关，商品审核开关打开时，可另外控制自营商家商品审核开关'
        },
        {
          configType: 'order_audit',
          checkSorts: '订单审核',
          explain:
            '订单审核开关，默认打开，打开则所有客户自行提交的订单需要商家审核'
        },
        {
          configType: 'customer_info_audit',
          checkSorts: '客户信息完善',
          explain:
            '开关默认关闭，客户注册完成后，是否需要完善客户信息，该功能开启后，才可选择客户是否需要审核'
        },
        {
          configType: 'customer_audit',
          checkSorts: '客户审核',
          explain:
            '客户审核开关，默认关闭，打开则所有自行注册的客户都需要平台审核，关闭则客户注册后无需进行审核'
        },
        {
          configType: 'ticket_aduit',
          checkSorts: '增专资质审核开关',
          explain:
            '开启后客户提交的增票资质需要审核，关闭后客户提交的增票资质自动审核通过'
        }
      ],
      goodsListConfigs: [
        {
          configType: 'pc_goods_image_switch',
          checkSorts: 'PC商城商品列表默认展示',
          explain:
            '小图列表，商品展示更精简；大图列表，商品展示更精美'
        },
        {
          configType: 'pc_goods_spec_switch',
          checkSorts: 'PC商城商品列表展示维度',
          explain:
            '单规格维度展示，点击直接加购该SKU；多规格维度展示，点击需选择SKU后再加购'
        },
        {
          configType: 'mobile_goods_image_switch',
          checkSorts: '移动商城商品列表默认展示',
          explain:
            '小图列表，商品展示更精简；大图列表，商品展示更精美'
        },
        {
          configType: 'mobile_goods_spec_switch',
          checkSorts: '移动商城商品列表展示维度',
          explain:
            '单规格维度展示，点击直接加购该SKU；多规格维度展示，点击需选择SKU后再加购'
        }
      ],
      // 商品评价开关
      goodsEvaluateConfig:{
        configType: 'goods_evaluate_setting',
        status: 0,
        checkSorts: '商品评价展示',
        explain: '控制会员是否可查看商品评价'
      },
      userConfigs: null,
      settings: {}
    };
  }

  @Action('check-manage:init')
  init(state: IMap, configs) {
    return state.set(
      'configs',
      state
        .get('configs')
        .map((config) =>
          config.merge(
            configs.find((c) => c.get('configType') == config.get('configType'))
          )
        )
    )
      .set(
        'goodsListConfigs',
        state
          .get('goodsListConfigs')
          .map((config) =>
            config.merge(
              configs.find((c) => c.get('configType') == config.get('configType'))
            )
          )
      )
      .set('userConfigs', configs.filter(config => config.get('configType') == 'user_audit'))
      .set('settings', fromJS(JSON.parse(configs.find(item => item.get('configType') == "applet_share_setting").get("context"))))
      ;
  }

  @Action('check-manage:check')
  check(state: IMap, { type, key, checked }) {
    return state.setIn(
      [
        type,
        state.get(type).findIndex((c) => c.get('configType') == key),
        'status'
      ],
      checked ? 1 : 0
    );
  }

  /**
   * 初始化商品评价开关
   */
  @Action('goods-evaluate-setting:init')
  initEvaluateStatus(state: IMap, goodsSetListIm) {
    const evaluateConfigIm = goodsSetListIm.find(s => s.get('configType') == state.getIn(['goodsEvaluateConfig', 'configType']));
    return state.setIn(['goodsEvaluateConfig', 'status'], evaluateConfigIm.get('status'));
  }

  /**
   * 设置商品评价开关
   */
  @Action('goods-evaluate-setting:edit')
  editEvaluateStatus(state: IMap, status) {
    return state.setIn(['goodsEvaluateConfig', 'status'], status);
  }
}
