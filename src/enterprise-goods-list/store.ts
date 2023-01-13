import { Store, IOptions } from 'plume2';
import { fromJS } from 'immutable';
import GoodsActor from './actor/goods-actor';
import FormActor from './actor/form-actor';
import { message } from 'antd';
import { Const } from 'qmkit';
import {
  goodsList,
  getCateList,
  getBrandList,
  checkEnterPriseGoods,
  batchCheckEnterpriseGoods,
  refuseCheckEnterpriseGoods,
  queryStoreByName,
  getIepSetting
} from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [new GoodsActor(), new FormActor()];
  }

  /**
   * 企业购商品初始化
   * @param {number} pageNum
   * @param {number} pageSize
   * @returns {Promise<void>}
   */
  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const searchForm = this.state()
      .get('form')
      .toJS();
    //已审核通过的
    const { res } = (await goodsList({
      ...searchForm,
      pageSize,
      pageNum
    })) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('init', {
        data: res.context,
        pageNum: pageNum
      });
    } else {
      message.error(res.message);
    }

    const response = (await getIepSetting()) as any;

    if (response && response.res && response.res.code === Const.SUCCESS_CODE) {
      this.dispatch('setting: info', response.res.context.iepSettingVO);
    } else {
      message.error(response.res.message);
    }

    const cates: any = await getCateList();
    const brands: any = await getBrandList();
    this.transaction(() => {
      this.dispatch('cateActor: init', fromJS(cates.res.context));
      this.dispatch('brandActor: init', fromJS(brands.res.context));
    });
  };

  /**
   * 搜索条件表单的变更
   * @param {any} key
   * @param {any} value
   */
  onFormFieldChange = ({ key, value }) => {
    this.dispatch('form:field', { key, value });
  };

  /**
   * 根据店铺名称查询店铺
   * @param storeName
   * @returns {Promise<void>}
   */
  queryStoreByName = async (storeName) => {
    this.onFormFieldChange({ key: 'storeName', value: storeName });
    const { res } = (await queryStoreByName(storeName)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('form: store: info', res.context);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 带着搜索条件的分页点击查询
   */
  onSearch = async () => {
    this.init({ pageNum: 0, pageSize: 10 });
  };

  /**
   * tab页签切换事件
   * @param val
   * @returns {Promise<void>}
   */
  onTabChange = async (val) => {
    // 清空搜索条件
    this.onFormFieldChange({ key: 'enterPriseAuditState', value: val });
    this.init({ pageNum: 0, pageSize: 10 });
  };

  /**
   * 更改排序信息
   * @param columnKey
   * @param order
   */
  setSortedInfo = (columnKey, order) => {
    this.dispatch('form: sort', {
      columnKey: columnKey,
      order: order
    });
  };

  /**
   * 多选选中的skuId
   */
  onSelectChange = (selectedRowKeys: number[]) => {
    this.dispatch('goods: sku: checked', fromJS(selectedRowKeys));
  };

  /**
   * 企业购商品审核通过(单个)
   * @param goodsInfoId
   * @returns {Promise<void>}
   */
  onChecked = async (goodsInfoId) => {
    const { res } = (await checkEnterPriseGoods(goodsInfoId)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.switchShowModal(false);
      this.init({ pageNum: 0, pageSize: 10 });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 批量审核企业购商品
   * @returns {Promise<void>}
   */
  onBatchChecked = async (goodsInfoIds) => {
    const { res } = (await batchCheckEnterpriseGoods(goodsInfoIds)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.dispatch('goods: sku: checked', []);
      this.switchShowModal(false);
      this.init({ pageNum: 0, pageSize: 10 });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 驳回企业购商品
   * @param goodsInfoId
   * @returns {Promise<void>}
   */
  onRefuseFunc = async (goodsInfoId) => {
    const forbidReason = this.state().get('forbidReason');
    const { res } = (await refuseCheckEnterpriseGoods({
      goodsInfoId: goodsInfoId,
      enterpriseAuditState: 3,
      enterPriseGoodsAuditReason: forbidReason
    })) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.switchShowModal(false);
      this.init({ pageNum: 0, pageSize: 10 });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 数值变更
   */
  onFieldChange = (field, value) => {
    this.dispatch('goods: field: change', { field, value });
  };

  /**
   * 显示/关闭驳回理由框
   */
  switchShowModal = (flag: boolean) => {
    this.dispatch('goodsActor: switchShowModal', flag);
  };
}
