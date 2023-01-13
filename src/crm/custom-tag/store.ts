import { IOptions, Store } from 'plume2';

import { fromJS } from 'immutable';
import { Const } from 'qmkit';
import { message } from 'antd';
import * as webapi from './webapi';
import TagActor from './actor/tag-list-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new TagActor()];
  }

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const name = this.state()
      .get('name');
    const { res } = await webapi.tagList({
      name,
      pageNum,
      pageSize
    });
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
    } else {
      if (res.context.customerTagVOPage) {
        const { content, total } = res.context.customerTagVOPage;
        this.dispatch('init', { tagList: fromJS(content), total: total, pageNum: pageNum && pageNum + 1 })
      }
    }
  };

  search = () => {
    this.init({ pageNum: 0, pageSize: 10 });
  };

  onFormFieldChange = (key, value) => {
    this.dispatch('form: field', { key, value });
  };

  onCancel = () => {
    this.setVisible(false);
    this.setTagObj({ name: '' })
  }

  onSave = async (values) => {
    const edit = this.state().get('edit');
    if (edit) {
      values = fromJS(values);
      const tagObj = this.state().get('tagObj');
      const params = tagObj.merge(values).toJS();
      const { res } = await webapi.eidtTag(params);
      if (res.code == Const.SUCCESS_CODE) {
        message.success('编辑成功');
        this.init();
        this.onCancel();
      } else {
        message.error(res.message);
      }
    } else {
      const { res } = await webapi.addTag(values);
      if (res.code == Const.SUCCESS_CODE) {
        message.success('新增成功');
        this.init();
        this.onCancel();
      } else {
        message.error(res.message);
      }
    }

  }

  setEdit = (edit) => {
    this.dispatch('tag: edit', edit);
  }

  setVisible = (visible) => {
    this.dispatch('tag: visible', visible);
  }

  setTagObj = (tagObj) => {
    this.dispatch('tag: tagObj', fromJS(tagObj));
  }
  /**
   * 删除优惠券
   */
  deleteTag = async (id) => {
    const { res } = await webapi.deleteTag(id);
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
      return;
    }
    message.success('删除成功');
    //刷新页面
    this.init();
  };
}
