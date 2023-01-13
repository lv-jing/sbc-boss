import { IOptions, Store } from 'plume2';
import { fromJS } from 'immutable';
import { IMap } from 'typings/globalType';
import { message } from 'antd';
import update from 'immutability-helper';
import CateActor from './actor/cate-actor';

import {
  addCate,
  deleteCate,
  editCate,
  getCateList,
  dragSort,
  isOnlyPlatform
} from './webapi';
import { Const } from 'qmkit';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [new CateActor()];
  }

  /**
   * 初始化
   */
  init = async () => {
    const { res } = (await getCateList()) as any;
    this.transaction(() => {
      this.dispatch('cate: init', fromJS(res.context));
    });
  };

  /**
   * 刷新需要延迟一下
   */
  refresh = () => {
    setTimeout(() => {
      this.init();
    }, 1000);
  };

  /**
   * 显示添加框
   */
  showModal = (isAdd) => {
    this.dispatch('cate: modal', isAdd);
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
  editFormData = (formData: IMap) => {
    this.dispatch('cate: editFormData', formData);
  };

  /**
   * 添加优惠券分类
   */
  doAdd = async () => {
    const couponCateList = this.state().get('couponCateList');
    const formData = this.state()
      .get('formData')
      .toJS();
    let result: any;
    if (formData.couponCateId == null) {
      if (couponCateList.size >= 30) {
        message.error('您只能添加30个优惠券分类');
        return;
      }
      result = await addCate(formData.couponCateName);
    } else {
      result = await editCate(formData);
    }
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      this.refresh();
      // 关闭弹框
      this.showModal(false);
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 删除优惠券分类
   */
  doDelete = async (couponCateId: string) => {
    let result: any = await deleteCate(couponCateId);
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      this.refresh();
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 更改是否平台可用
   * @returns {Promise<void>}
   */
  editFlag = async (couponCateId) => {
    const { res } = (await isOnlyPlatform(couponCateId)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      this.refresh();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 拖拽排序
   * @param dragIndex  拖拽排序源
   * @param hoverIndex 拖拽排序目标位置
   * @returns {Promise<void>}
   */
  cateSort = async (dragIndex, hoverIndex) => {
    let couponCateList = this.state()
      .get('couponCateList')
      .toJS();
    //拖拽排序
    const dragRow = couponCateList[dragIndex];
    //拖拽排序后的列表
    let sortList = update(couponCateList, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]]
    });

    let paramList = [];
    for (let index in sortList) {
      paramList.push({
        couponCateId: sortList[index].couponCateId,
        cateSort: Number(index) + 1
      });
    }

    const { res } = (await dragSort(paramList)) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.refresh();
    } else {
      message.error(res.message);
    }
  };
}
