import { Actor, Action } from 'plume2';
import { List } from 'immutable';
import { IMap } from 'typings/globalType';

declare type IList = List<any>;

export default class CateResourceActor extends Actor {
  defaultState() {
    return {
      cateIds: [],
      cateId: [],
      videoCateIds: [],
      videoCateId: [],
      // 扁平的分类列表信息
      resCateAllList: [],
      // 父子结构的分类列表信息
      resCateList: [],
      // 添加分类弹框是否显示
      visible: false,
      // 添加分类-分类表单内容
      formData: {},
      // tree是否展开
      expandedKeys: []
    };
  }

  /**
   * 初始化
   */
  @Action('cateActor: init')
  init(state, cateList: IList) {
    // 改变数据形态，变为层级结构
    const newDataList = cateList
      .filter((item) => item.get('cateParentId') == 0)
      .map((data) => {
        const children = cateList
          .filter((item) => item.get('cateParentId') == data.get('cateId'))
          .map((childrenData) => {
            const lastChildren = cateList.filter(
              (item) => item.get('cateParentId') == childrenData.get('cateId')
            );
            if (!lastChildren.isEmpty()) {
              childrenData = childrenData.set('children', lastChildren);
            }
            return childrenData;
          });

        if (!children.isEmpty()) {
          data = data.set('children', children);
        }
        return data;
      });

    return state
      .set('resCateList', newDataList)
      .set('resCateAllList', cateList);
  }

  /**
   * 显示/关闭弹窗
   */
  @Action('cateActor: showCateModal')
  show(state, needClear: boolean) {
    return state.set('visible', needClear);
  }

  /**
   * 修改表单内容
   */
  @Action('cateActor: editFormData')
  editFormData(state, data: IMap) {
    return state.update('formData', (formData) => formData.merge(data));
  }

  /**
   * 设置需要展开的分类
   */
  @Action('cateActor: editExpandedKeys')
  editExpandedKeys(state, cateIds) {
    return state.set('expandedKeys', cateIds);
  }

  /**
   * 设置当前选中分类
   */
  @Action('cateActor: editCateId')
  editChangeCateId(state, cateId) {
    return state.set('cateId', cateId);
  }

  /**
   * 素材分类选中
   * @param state
   * @param cateIds
   */
  @Action('cateActor: cateIds')
  editCateIds(state, cateIds) {
    return state.set('cateIds', cateIds);
  }

  /**
   * 素材分类选择
   * @param state
   * @param cateId
   */
  @Action('cateActor: cateId')
  editCateId(state, cateId) {
    return state.set('cateId', cateId);
  }

  /**
   * 视频分类选择
   * @param state
   * @param cateIds
   */
  @Action('cateActor: videoCateIds')
  editVideoCateIds(state, cateIds) {
    return state.set('videoCateIds', cateIds);
  }

  /**
   * 设置当前选中视频分类
   */
  @Action('cateActor: videoCateId')
  editChangeVideoCateId(state, cateId) {
    return state.set('videoCateId', cateId);
  }

}
