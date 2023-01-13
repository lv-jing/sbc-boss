import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS, Map } from 'immutable';
import { Const } from 'qmkit';
import * as webApi from './webapi';
import ListActor from './actor/list-actor';
import TableKeyActor from './actor/table-key-actor';
import CateActor from './actor/cate-actor';
import { IMap } from '../../typings/globalType';
import update from 'immutability-helper';
import SettingActor from './actor/setting-actor';

export default class AppStore extends Store {
  bindActor() {
    return [
      new ListActor(),
      new TableKeyActor(),
      new CateActor(),
      new SettingActor()
    ];
  }

  /**
   * 初始化方法
   */
  init = async () => {
    this.initSetting();
    this.getStoreCount();
  };

  initCate = async () => {
    const { res } = (await webApi.getCateList()) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('cate: init', fromJS(res.context.flashSaleCateVOList));
    } else {
      message.error(message);
    }
  };

  initSetting = async () => {
    const { res } = (await webApi.getSettingList()) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch(
        'setting: init',
        fromJS(res.context.flashSaleSettingVOList)
      );
    } else {
      message.error(message);
    }
  };

  getSettingListById = async (id) => {
    let param = { id: id };
    const { res } = (await webApi.getSettingListById(param)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch(
        'setting: changeFlashSaleStatus',
        res.context.flashSaleSettingVOList[0].isFlashSale
      );
    } else {
      message.error(message);
    }
  };

  getStoreCount = async () => {
    const { res } = (await webApi.getStoreCount()) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('setting: storeCount', fromJS(res.context.storeCount));
    } else {
      message.error(message);
    }
  };

  /**
   * 查询即将开场
   */
  getSoonList = async () => {
    // 设置loading开始状态
    this.dispatch('info:setLoading', true);
    const param = this.state()
      .get('searchData')
      .toJS();
    const { res: listRes } = await webApi.getSoonList(param);
    if (listRes.code === Const.SUCCESS_CODE) {
      // 3.格式化返回结构
      // 设置分页数据
      this.dispatch(
        'info:setListData',
        listRes.context.flashSaleActivityVOList
      );
       // 设置loading结束状态
       this.dispatch('info:setLoading', false);
    } else {
      message.error(listRes.message);
      this.dispatch('info:setLoading', false);
    }
  };

  /**
   * 查询进行中
   */
  getSaleList = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 }
  ) => {
    // 设置loading开始状态
    this.dispatch('info:setLoading', true);
    const param = { pageNum, pageSize };
    const { res: pageRes } = await webApi.getSaleList(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      // 3.格式化返回结构
      let flashSaleActivityVOPage = pageRes.context.flashSaleActivityVOPage;
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('info:setLoading', false);
        // 设置分页数据
        this.dispatch('info:setPageData', flashSaleActivityVOPage);
        // 设置当前页码
        this.dispatch('info:setCurrent', pageNum + 1);
      });
    } else {
      message.error(pageRes.message);
      this.dispatch('info:setLoading', false);
    }
  };

  /**
   * 查询已结束
   */
  getEndList = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    // 设置loading开始状态
    this.dispatch('info:setLoading', true);
    const param = this.state()
      .get('searchData')
      .toJS();
    param.pageNum = pageNum;
    param.pageSize = pageSize;
    const { res: pageRes } = await webApi.getEndList(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      // 3.格式化返回结构
      let flashSaleActivityVOPage = pageRes.context.flashSaleActivityVOPage;
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('info:setLoading', false);
        // 设置分页数据
        this.dispatch('info:setPageData', flashSaleActivityVOPage);
        // 设置当前页码
        this.dispatch('info:setCurrent', pageNum + 1);
      });
    } else {
      message.error(pageRes.message);
      this.dispatch('info:setLoading', false);
    }
  };

  /**
   * 设置搜索项信息并查询分页数据
   */
  onSearch = async () => {
    const activityKey = this.state().get('activityKey');
    if (activityKey == 0) {
      this.getSoonList();
    } else if (activityKey == 2) {
      this.getEndList();
    }
  };

  changeStartTime = (startTime, timeValue) => {
    this.dispatch('info:setSearchData', {
      searchData: fromJS(startTime),
      timeValue
    });
  };

  /**
   * 更改场次状态
   */
  modifyStatus = (index, status) => {
    if (status == 1) {
      const checkedList = this.state()
        .get('settingList')
        .filter((item) => item.get('status') == 1);
      if (checkedList.size >= 12) {
        message.error('最多选择12个场次');
        return;
      }
    }
    this.dispatch('setting: modifyStatus', { index, status });
  };

  /**
   * 保存设置
   */
  saveSetting = async () => {
    const settingList = this.state().get('settingList');
    const result = await webApi.modifyList(settingList);
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      await this.initSetting();
    } else {
      message.error(result.res.message);
    }
  };

  //tab-list 切换
  onTabChange = (index: number) => {
    this.dispatch('change:key', index);
    this.changeStartTime(fromJS({}), null);
    if (index == 0) {
      this.initSetting();
      this.getStoreCount();
    } else if (index == 1) {
      this.initCate();
    } else if (index == 2) {
      this.getSoonList();
    }
  };

  //tab-list 切换
  onActivityTabChange = (index: number) => {
    this.dispatch('change:activityKey', index);
    this.changeStartTime(fromJS({}), null);
    if (index == 0) {
      this.getSoonList();
    } else if (index == 1) {
      this.getSaleList();
    } else if (index == 2) {
      this.getEndList();
    }
  };

  /**
   * 显示添加框
   */
  modal = (isAdd) => {
    this.transaction(() => {
      this.dispatch('cate: modal', isAdd);
      this.dispatch('cate: editFormData', Map({ cateName: null }));
    });
  };

  /**
   * 显示修改弹窗
   */
  showEditModal = (formData: IMap, isAdd: boolean) => {
    this.transaction(() => {
      this.dispatch('cate: editFormData', formData);
      this.dispatch('cate: modal', isAdd);
    });
  };

  /**
   * 修改form信息
   */
  editCateFormData = (formData: IMap) => {
    this.dispatch('cate: editFormData', formData);
  };

  /**
   * 拖拽排序
   * @param dragIndex  拖拽排序源
   * @param hoverIndex 拖拽排序目标位置
   * @returns {Promise<void>}
   */
  cateSort = async (dragIndex, hoverIndex) => {
    let couponCateList = this.state()
      .get('cateList')
      .toJS();
    //拖拽排序
    const dragRow = couponCateList[dragIndex];
    //拖拽排序后的列表
    let sortList = update(couponCateList, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragRow]
      ]
    });
    let cateIdList = [];
    for (let index in sortList) {
      cateIdList.push(sortList[index].cateId);
    }
    const { res } = (await webApi.dragSort({ cateIdList: cateIdList })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.refresh();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 删除商品分类
   */
  deleteCate = async (couponCateId) => {
    let result: any = await webApi.deleteCate(couponCateId);
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      this.refresh();
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 刷新需要延迟一下
   */
  refresh = () => {
    setTimeout(() => {
      this.initCate();
    }, 1000);
  };

  doAdd = async () => {
    let result: any;
    const formData = this.state().get('formData');
    let params = { ...formData.toJS() };
    if (this.state().get('isAdd')) {
      result = await webApi.addCate(params);
    } else {
      result = await webApi.modifyCate(params);
    }
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      this.refresh();
      this.modal(false);
    } else {
      message.error(result.res.message);
    }
  };
}
