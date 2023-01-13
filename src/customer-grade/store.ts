import { IOptions, Store } from 'plume2';
import { fromJS } from 'immutable';
import { IList, IMap } from 'typings/globalType';
import GradeActor from './actor/grade-actor';
import { message } from 'antd';
import { Const } from 'qmkit';

import { addGrade, deleteGrade, editGrade, getEquitiesList, getGradeList } from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [new GradeActor()];
  }

  /**
   * 初始化
   */
  init = async () => {
    const { res } = (await getGradeList()) as any;
    if (res.code = Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('grade: init', fromJS(res.context.customerLevelVOList));
      });
      if (res.context.customerLevelVOList.length > 0) {
        this.dispatch('grade: lastData', res.context.customerLevelVOList[res.context.customerLevelVOList.length - 1].customerLevelId);
        this.dispatch('grade: firstData', res.context.customerLevelVOList[0].customerLevelId);
      }
    }

  };

  queryEquities = async () => {
    const { res } = (await getEquitiesList()) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('grade: equities', fromJS(res.context.customerLevelRightsVOList));
    }
  }


  /**
   * 刷新需要延迟一下
   */
  refresh = () => {
    setTimeout(() => {
      this.init();
    }, 1000);
  };


  deleteGrade = async (customerId) => {
    let result: any = await deleteGrade(customerId);
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.refresh();
    } else {
      message.error(result.res.message);
    }

  }

  /**
   * 显示添加框
   */
  modal = (isAdd: boolean) => {
    this.dispatch('grade: modal', isAdd);
  };

  /**
   * 显示修改弹窗
   */
  showEditModal = (formData: any, isAdd: boolean) => {
    let rightsTypes = formData.customerLevelRightsVOS.filter(item => item.rightsType != 5).map(item => item.rightsType);
    this.dispatch("grade: rightsType", fromJS(rightsTypes))
    let rightsIds = formData.customerLevelRightsVOS.map((value) => {
      return value.rightsId + "";
    })
    formData = fromJS({ ...formData, rightsIds })
    this.transaction(() => {
      this.dispatch('grade: editFormData', formData);
      this.dispatch('grade: modal', isAdd);
    });
  };

  /**
   * 修改form信息
   */
  editFormData = (formData: IMap) => {
    let typeIndex: any;
    if (formData.has("rightsIds")) {
      //得到所有的权益列表
      let equities = this.state().get("equities").toJS();
      //得到所有当前有的类型
      let rightsType = this.state().get("rightsType").toJS();
      //原来值
      let newData = formData.get("rightsIds").toJS();
      //新的值
      let oldData = this.state().getIn(["formData", "rightsIds"]) && this.state().getIn(["formData", "rightsIds"]).toJS() || [];
      //如果是减少操作 不判断。
      if (newData.length > oldData.length) {
        //得到新加的那个唯一值
        let difference = newData.concat(oldData).filter(v => !newData.includes(v) || !oldData.includes(v));
        //type
        typeIndex = equities.find(item => {
          return item.rightsId == difference
        }) && equities.find(item => {
          return item.rightsId == difference
        }).rightsType;
        if (rightsType.findIndex(item => {
          return item == typeIndex
        }) != -1) {
          message.error("同一权益类型仅可选择一项权益")
          return false;
        }
      }
      //根据得到的值。过滤出现在有哪些type
      if (typeIndex != 5) {
        let rightsTypes = equities.filter(item => {
          return newData.includes(item.rightsId.toString())
        }).map(item => {
          if (item.rightsType != 5) {
            return item.rightsType
          }
        })
        this.dispatch("grade: rightsType", fromJS(rightsTypes))
      }
    }

    this.dispatch('grade: editFormData', formData);


  };

  /**
   * 修改商品图片
   */
  editImages = (images: IList) => {
    this.dispatch('grade: editImages', images);
  };

  /**
   * 点击保存
   */
  onSave = async () => {
    const formData: IMap = this.state().get('formData');
    let result: any;
    if (this.state().get('isAdd')) {
      result = await addGrade(formData);
    } else {
      result = await editGrade(formData);
    }
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      this.refresh();
      this.modal(false);
    } else {
      message.error(result.res.message);
    }
  }

}
