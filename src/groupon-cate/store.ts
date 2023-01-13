import { IOptions, Store } from 'plume2';
import { IMap } from 'typings/globalType';
import { message } from 'antd';
import update from 'immutability-helper';
import { Const } from 'qmkit';

import { addCate, deleteCate, editCate, getCateList, dragSort } from './webapi';
import CateActor from './actor/cate-actor';

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
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('cate: init', res.context.grouponCateVOList);
      });
    }
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
   * 添加拼团分类
   */
  doAdd = async () => {
    const grouponCateList = this.state().get('grouponCateList');
    const formData = this.state()
      .get('formData')
      .toJS();
    let result: any;
    if (formData.grouponCateId == null) {
      if (grouponCateList.size >= 30) {
        message.error('您只能添加30个拼团分类');
        return;
      }
      let params = { grouponCateName: formData.grouponCateName };
      result = await addCate(params);
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
   * 删除拼团分类
   */
  doDelete = async (grouponCateId: string) => {
    let params = { grouponCateId: grouponCateId };
    let result: any = await deleteCate(params);
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      this.refresh();
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 拖拽排序
   * @param dragIndex  拖拽排序源
   * @param hoverIndex 拖拽排序目标位置
   * @returns {Promise<void>}
   */
  cateSort = async (dragIndex, hoverIndex) => {
    let grouponCateList = this.state()
      .get('grouponCateList')
      .toJS();
    //拖拽排序
    const dragRow = grouponCateList[dragIndex];
    //拖拽排序后的列表
    let sortList = update(grouponCateList, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]]
    });

    let paramList = [];
    for (let index in sortList) {
      paramList.push({
        grouponCateId: sortList[index].grouponCateId,
        cateSort: Number(index) + 1
      });
    }

    let params = { grouponCateSortVOList: paramList };
    const { res } = (await dragSort(params)) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.refresh();
    } else {
      message.error(res.message);
    }
  };
}
