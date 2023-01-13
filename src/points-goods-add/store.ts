import { IOptions, Store } from 'plume2';
import PointsGoodsActor from './actor/points-goods-actor';
import { Const, history } from 'qmkit';
import { message } from 'antd';
import { fromJS } from 'immutable';
import { addPointsGoods, getCateList } from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [new PointsGoodsActor()];
  }

  /**
   * 初始化
   */
  init = async () => {
    const { res } = (await getCateList()) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('new:cate:init', fromJS(res.context.pointsGoodsCateVOList));
    } else {
      message.error(message);
    }
  };

  /**
   * 存储键值
   */
  fieldsValue = ({ field, value }) => {
    this.dispatch('goods: info: field: value', {
      field,
      value
    });
  };

  /**
   * 修改时间区间
   */
  changeDateRange = ({ startTime, endTime }) => {
    this.dispatch('goods: info: date: range', {
      startTime,
      endTime
    });
  };

  /**
   * 点击完成，保存用户选择的商品信息
   * @param skuIds
   * @param rows
   */
  onOkBackFun = (skuIds, rows) => {
    //保存商品信息
    this.dispatch('goods: info: field: value', {
      field: 'chooseSkuIds',
      value: skuIds
    });
    this.dispatch('goods: info: field: value', {
      field: 'goodsRows',
      value: rows
    });
    //关闭弹窗
    this.dispatch('goods: info: field: value', {
      field: 'goodsModalVisible',
      value: false
    });
  };

  /**
   * 删除选中的商品
   */
  deleteSelectedSku = (id) => {
    this.dispatch('delete: selected: sku', id);
  };

  /**
   * 选择商品弹框的关闭按钮
   */
  onCancelBackFun = () => {
    this.dispatch('goods: info: field: value', {
      field: 'goodsModalVisible',
      value: false
    });
  };

  /**
   * 变更商品各个字段信息
   * @param field
   * @param value
   */
  onGoodsChange = ({ goodsInfoId, field, value }) => {
    this.dispatch('modalActor: change:goods', { goodsInfoId, field, value });
  };

  /**
   * 输入框输入监听
   * @param params
   */
  onCateInputChange = ({ goodsInfoId, field, value }) => {
    const { cateList } = this.state().toJS();
    cateList.map((v) => {
      if (v.cateName == value) {
        const value = v.cateId;
        this.dispatch('modalActor: change:goods', {
          goodsInfoId,
          field,
          value
        });
      }
    });
  };

  doAdd = async () => {
    let result: any;
    let pointsGoods = new Array();
    const { goodsRows, startTime, endTime } = this.state().toJS();
    if (goodsRows.length == 0){
      message.error('请添加商品');
      return;
    }
    goodsRows.map((goods) => {
      pointsGoods.push({
        goodsId: goods.goodsId,
        goodsInfoId: goods.goodsInfoId,
        settlementPrice: goods.settlementPrice,
        stock: goods.convertStock,
        points: goods.convertPoints,
        cateId: goods.cateId,
        recommendFlag: goods.recommendFlag
      });
    });
    result = await addPointsGoods({
      pointsGoodsAddRequestList: pointsGoods,
      beginTime: startTime,
      endTime: endTime
    });
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      history.push('/points-goods-list');
    } else {
      message.error(result.res.message);
    }
  };

}
