import { Store, IOptions } from 'plume2';
import { message } from 'antd';

import { Const } from 'qmkit';
import FundsDetailActor from './actor/search-actor';
import {
  getPageList,
  batchCheck,
  batchSetSticky,
  refuse,
  queryStoreByName,
  getGrouponCateList
} from './webapi';
import SelectedActor from './actor/selected-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [new FundsDetailActor(), new SelectedActor()];
  }

  getGrouponCateList = async () => {
    const list: any = await getGrouponCateList();
    if (list.res.code === Const.SUCCESS_CODE) {
      this.dispatch('set:group:cate:list', list.res.context.grouponCateVOList);
    }
  };

  /**
   * 初始化拼团活动列表
   */
  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    this.dispatch('select:init', []);
    const params = this.state()
      .get('form')
      .toJS();
    const pageList: any = await getPageList({
      ...params,
      pageSize,
      pageNum
    });
    if (pageList.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch(
          'group:list:init',
          pageList.res.context.grouponActivityVOPage
        );
      });
    } else {
      message.error(pageList.res.message);
    }
  };

  /**
   * 设置form参数
   */
  setFormField = (field, value) => {
    this.dispatch('group:list:form:field', { field, value });
  };

  /**
   * 切换tab
   */
  changeTab = (tabType) => {
    this.setFormField('tabType', tabType);
    this.init();
  };

  onSelect = (list) => {
    this.dispatch('select:init', list);
  };

  /**
   * 根据店铺名称查询店铺
   * @param storeName
   * @returns {Promise<void>}
   */
  queryStoreByName = async (storeName) => {
    this.setFormField('storeName', storeName);
    const { res } = (await queryStoreByName(storeName)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('form: store: info', res.context);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 批量审核
   * @returns {Promise<void>}
   */
  onBatchChecked = async (ids) => {
    const { res } = (await batchCheck(ids)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.switchShowModal(false);
      this.init({ pageNum: 0, pageSize: 10 });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 批量设置精选
   * @param ids
   * @returns {Promise<void>}
   */
  batchSetSticky = async (ids) => {
    const { res } = (await batchSetSticky(ids, true)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.switchShowModal(false);
      this.init({ pageNum: 0, pageSize: 10 });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 单个设置精选
   * @param id
   * @param sticky
   * @returns {Promise<void>}
   */
  setSticky = async (id, sticky) => {
    const ids = [id];
    const { res } = (await batchSetSticky(ids, sticky)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init({ pageNum: 0, pageSize: 10 });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 显示/关闭禁售理由框
   */
  switchShowModal = (flag: boolean) => {
    this.dispatch('groupon: switchShowModal', flag);
  };

  /**
   * 数值变更
   */
  onFieldChange = (field, value) => {
    this.dispatch('groupon: field: change', { field, value });
  };

  /**
   * 驳回
   * @param goodsInfoId
   * @returns {Promise<void>}
   */
  onRefuseFunc = async (grouponActivityId) => {
    const forbidReason = this.state().get('forbidReason');
    const { res } = (await refuse(grouponActivityId, forbidReason)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.switchShowModal(false);
      this.init({ pageNum: 0, pageSize: 10 });
    } else {
      message.error(res.message);
    }
  };
}
