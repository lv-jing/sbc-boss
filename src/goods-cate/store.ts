import { IOptions, Store } from 'plume2';
import { fromJS, Map } from 'immutable';
import { IList, IMap } from 'typings/globalType';
import { message } from 'antd';
import update from 'immutability-helper';
import CateActor from './actor/cate-actor';

import {
  addCate,
  chkChild,
  chkGoods,
  deleteCate,
  editCate,
  getCateList,
  dragSort
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
  modal = (isAdd) => {
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
   * 添加品牌
   */
  doAdd = async () => {
    const formData = this.state().get('formData');
    let result: any;
    if (formData.get('cateId')) {
      result = await editCate(formData);
    } else {
      result = await addCate(formData);
    }
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      this.refresh();
      // 关闭弹框
      this.modal(false);
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 删除品牌
   */
  doDelete = async (cateId: string) => {
    let result: any = await deleteCate(cateId);
    if (result.res.code === Const.SUCCESS_CODE) {
      // 刷新
      this.refresh();
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 检测商品分类是否有子类
   */
  validChild = async (cateId: string) => {
    const result: any = await chkChild(Map({ cateId: cateId }));
    if (result.res.context.context == 0) {
      this.dispatch('cateActor: child', false);
    } else if (result.res.context.context == 1) {
      this.dispatch('cateActor: child', true);
    }
  };

  /**
   * 检测商品分类是否有子类商品
   */
  validGoods = async (cateId: string) => {
    const result: any = await chkGoods(Map({ cateId: cateId }));
    if (result.res.context.context == 0) {
      this.dispatch('cateActor: goods', false);
    } else if (result.res.context.context == 1) {
      this.dispatch('cateActor: goods', true);
    }
  };

  /**
   * 修改商品图片
   */
  editImages = (images: IList) => {
    this.dispatch('cateActor: editImages', images);
  };

  /**
   * 设置父级类目扣率
   */
  setParentRate = (rate: number) => {
    this.dispatch('cate: rate', rate);
  };

  /**
   * 是否使用父级类目扣率
   */
  useParentRateF = (flag?: number) => {
    let useParentRate =
      this.state().getIn(['formData', 'isParentCateRate']) == 0 ? 1 : 0;
    if (flag === 0 || flag === 1) {
      useParentRate = flag;
    }
    this.dispatch('cate: rate: use', useParentRate);
  };

  /**
   * 拖拽排序
   * @param catePath 分类树形结构的父级路径
   * @param dragIndex  拖拽排序源
   * @param hoverIndex 拖拽排序目标位置
   * @returns {Promise<void>}
   */
  cateSort = async (catePath, dragIndex, hoverIndex) => {
    let cates = this.state()
      .get('cates')
      .toJS();
    //cateIds: 0|245|246|
    let cateIds = catePath.split('|');
    //拖拽排序后的列表
    let sortList: any;
    //三级分类的拖拽排序
    if (cateIds.length == 4) {
      //二级分类集合
      let secondLevel: any;
      for (let i = 0; i < cates.length; i++) {
        if (cates[i].cateId == cateIds[1]) {
          secondLevel = cates[i].children;
        }
      }
      //三级分类集合
      let thirdLevel: any;
      for (let i = 0; i < secondLevel.length; i++) {
        if (secondLevel[i].cateId == cateIds[2]) {
          thirdLevel = secondLevel[i].children;
        }
      }
      const dragRow = thirdLevel[dragIndex];
      sortList = update(thirdLevel, {
        $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]]
      });
    } else if (cateIds.length == 3) {
      //二级分类的拖拽排序
      //二级分类集合
      let secondLevel: any;
      for (let i = 0; i < cates.length; i++) {
        if (cates[i].cateId == cateIds[1]) {
          secondLevel = cates[i].children;
        }
      }
      const dragRow = secondLevel[dragIndex];
      sortList = update(secondLevel, {
        $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]]
      });
    } else if (cateIds.length == 2) {
      //一级分类的拖拽排序
      const dragRow = cates[dragIndex];
      sortList = update(cates, {
        $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]]
      });
    }

    let paramList = [];
    for (let index in sortList) {
      paramList.push({
        cateId: sortList[index].cateId,
        cateSort: Number(index) + 1
      });
    }
    console.log('sortList ===========>', sortList);

    const { res } = (await dragSort(paramList)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    } else {
      message.error(res.message);
    }
  };
}
