import { IOptions, Store } from 'plume2';
import sensitiveActor from './actor/sensitive-actor';
import * as webapi from './webapi';
import { Const } from 'qmkit';
import { fromJS } from 'immutable';
import { List } from 'immutable';
import { IMap } from 'typings/globalType';

import { message } from 'antd';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new sensitiveActor()];
  }

  /**
   * 初始化列表信息
   * @param {any} pageParams
   * @param {number} pageNum
   * @param {number} pageSize
   * @returns {Promise<void>}
   */
  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    let param: any = {
      likeSensitiveWords: this.state().get('likeSensitiveWords')
    };
    this.dispatch('loading:start');
    const { res } = await webapi.fetchSensitiveWordsList({
      ...param,
      pageNum,
      pageSize
    });
    if (res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('list:init', res.context);
        this.dispatch('current', pageNum && pageNum + 1);
        this.dispatch('sensitiveActor:select', List());
      });
    } else {
      message.error(res.message);
      if (res.code === 'K-110001') {
        this.dispatch('loading:end');
      }
    }
  };
  /**
   * 修改查询条件
   * @param searchParam
   */
  onFormChange = (likeSensitiveWords) => {
    this.dispatch('sensitiveActor: editSearchData', likeSensitiveWords);
  };

  /**
   * 查询
   * @returns {Promise<void>}
   */
  onSearch = async () => {
    this.init();
  };
  /**
   * 删除
   * @returns {Promise<void>}
   */
  onDelete = async (id) => {
    const { res } = await webapi.deleteSensitiveWords(id);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    }
  };

  /**
   * 复选框选中设置值
   * @param list
   */
  onSelect = (list) => {
    this.dispatch('sensitiveActor:select', list);
  };
  /**
   * 打开添加的弹窗
   */
  onAdd = () => {
    this.dispatch('edit:init', fromJS({}));
    this.dispatch('modal:show');
  };
  /**
   * 关闭弹窗
   */
  closeModal = () => {
    this.dispatch('modal:hide');
  };

  /**
   * 修改添加/编辑的表单信息
   */
  editFormData = (formData: IMap) => {
    this.dispatch('sensitiveActor: editFormData', formData);
  };

  /**
   * 取消编辑
   */
  onCancel = () => {
    this.transaction(() => {
      this.dispatch('edit', false);
      this.dispatch('modal:hide');
    });
  };
  /**
   * 调整到编辑modal
   * @param {string} id
   */
  onEdit = async (id: Number) => {
    const sensitiveWords = this.state()
      .get('dataList')
      .find((v) => v.get('sensitiveId') == id);
    this.transaction(() => {
      this.dispatch('edit:init', sensitiveWords);
      this.dispatch('modal:show');
    });
  };
  /**
   * 保存
   * @returns {Promise<void>}
   */
  onSave = async () => {
    const formData = this.state().get('formData');
    let result: any;
    if (formData.get('sensitiveId')) {
      result = await webapi.editSensitiveWords(formData);
    } else {
      result = await webapi.addSensitiveWords(formData);
    }
    if (result.res.code === Const.SUCCESS_CODE) {
      if (formData.get('sensitiveId')) {
        message.success('操作成功');
      } else {
        message.success('添加成功，共添加' + result.res.context + '个敏感词');
      }
      // 刷新
      this.refresh();
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 批量删除
   * @param employeeIds
   * @returns {Promise<void>}
   */
  onBatchDelete = async () => {
    const selected = this.state().get('selected');
    if (selected.isEmpty()) {
      message.error('请选择要操作的行');
      return;
    }
    let param = { sensitiveIdList: selected.toJS() };
    const { res } = await webapi.deleteSensitiveWordsByIds(param);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 页面刷新
   */
  refresh = () => {
    this.dispatch('modal:hide');
    this.dispatch('sensitiveActor: editFormData', { sensitiveWords: '' });
    this.init({ pageNum: 0, pageSize: 10 });
  };
}
