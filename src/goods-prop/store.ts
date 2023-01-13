import { IOptions, Store } from 'plume2';
import { message } from 'antd';
import { fromJS } from 'immutable';
import PropActor from './actor/prop-actor';
import ModalActor from './actor/modal-actor';
import FormActor from './actor/form-actor';
import DetailActor from './actor/detail-actor';
import {
  addProp,
  deleteProp,
  eidtProp,
  getPropList,
  setIndex,
  setSort
} from './webapi';
import { Const } from 'qmkit';

const MODAL_TITILE_ADD = '新增属性';
const MODAL_TITILE_EDIT = '编辑属性';
export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [
      new PropActor(),
      new ModalActor(),
      new FormActor(),
      new DetailActor()
    ];
  }

  /**
   * 初始化
   */
  init = async (params) => {
    const { res } = (await getPropList(params)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('propActor: init', fromJS(res.context));
    }
  };

  /**
   * 拖拽排序
   */
  propSort = async (sortList) => {
    let goodsPropRequest = {} as any;
    goodsPropRequest.goodsProps = sortList;
    for (let index in sortList) {
      sortList[index].sort = Number(index) + 1;
    }
    const { res } = (await setSort(goodsPropRequest)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.dispatch('propActor: init', fromJS(sortList));
    } else {
      message.error(res.message);
    }
  };

  /**
   * 编辑索引
   * @returns {Promise<void>}
   */
  editIndex = async (goodsProp, checked) => {
    if (checked) {
      goodsProp.indexFlag = 1;
    } else {
      goodsProp.indexFlag = 0;
    }
    const { res } = (await setIndex(goodsProp)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
    } else {
      message.error(res.message);
    }
    this.init(goodsProp.cateId);
  };
  /**
   * 删除属性
   * @param prop
   * @returns {Promise<void>}
   */
  deleteProp = async (prop) => {
    const { propId, cateId } = prop;
    const { res } = (await deleteProp(propId)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
    } else {
      message.error(res.message);
    }
    this.init(cateId);
  };

  /**
   * 弹窗开关状态
   * @param {boolean} status
   * @returns {Promise<void>}
   */
  editVisible = async (status: boolean) => {
    this.dispatch('modalActor: isVisible', status);
  };

  /**
   * 弹窗标题
   * @param {string} title
   * @returns {Promise<void>}
   */
  eidtTitle = async (title: string) => {
    this.dispatch('modalActor: chooseTitle', title);
  };

  /**
   * 提交
   * @param {string} title
   * @returns {Promise<void>}
   */
  onSubmit = async (param) => {
    if (param.modalTitle == MODAL_TITILE_ADD) {
      const { lastPropId, goodsProps, goodsPropDetails } = param.oneProp;
      param.oneProp.propName = param.propName;
      for (let index in goodsPropDetails) {
        goodsPropDetails[index].detailId = null;
      }
      let goodsPropRequest = {
        lastPropId: lastPropId,
        goodsProp: param.oneProp,
        goodsProps: goodsProps
      };
      const { res } = (await addProp(goodsPropRequest)) as any;
      if (res.code == Const.SUCCESS_CODE) {
        message.success('操作成功');
      } else {
        message.error(res.message);
        return false;
      }
      this.editVisible(false);
      this.init(param.oneProp.cateId);
      this.initDetailList({});
      this.deleteDetail([]);
    }
    if (param.modalTitle == MODAL_TITILE_EDIT) {
      let { goodsPropDetails } = param.oneProp;
      let { deleteList } = param;
      for (let index in goodsPropDetails) {
        if (!Number.isInteger(goodsPropDetails[index].detailId)) {
          goodsPropDetails[index].detailId = null;
        }
      }

	    for (let index in deleteList) {
		    if (!Number.isInteger(deleteList[index].detailId)) {
			    deleteList.pop(deleteList[index]);
		    }
	    }

      let allList = goodsPropDetails.concat(deleteList);

      let editFlag = false;
      for (let prop of allList) {
        if (prop.delFlag == 0) {
          editFlag = true;
          break;
        }
      }
      if (!editFlag) {
        message.error('属性值不能为空');
        return false;
      }
      let goodsProp = param.oneProp;
      goodsProp.goodsPropDetails = allList;
      goodsProp.propName = param.propName;
      const { res } = (await eidtProp(goodsProp)) as any;
      if (res.code == Const.SUCCESS_CODE) {
        message.success('操作成功');
      } else {
        message.error(res.message);
        return false;
      }
      this.editVisible(false);
      this.init(goodsProp.cateId);
      this.initDetailList({});
      this.deleteDetail([]);
    }
  };

  /**
   * 表单元素
   * @param {any} key
   * @param {any} value
   */
  onFormFieldChange = async ({ key, value }) => {
    this.dispatch('form:field', { key, value });
  };

  /**
   * 初始化属性值
   * @param initDetailList
   */
  initDetailList = async (oneProp) => {
    this.dispatch('detail:init', fromJS(oneProp));
  };

  /**
   * 得到删除的属性值
   * @param deleteList
   */
  deleteDetail = async (deleteList) => {
    this.dispatch('detail:delete', fromJS(deleteList));
  };

  /**
   * 检查新增
   * @param addStatus
   */
  checkAddStatus = async (addStatus: boolean) => {
    this.dispatch('detail:checkAdd', addStatus);
  };
}
