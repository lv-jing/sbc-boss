import { IOptions, Store } from 'plume2';
import { message } from 'antd';
import * as webapi from './webapi';
import LoadingActor from './actor/loading-actor';
import LevelActor from './actor/level-actor';
import VisibleActor from './actor/visible-actor';
import EditActor from './actor/edit-actor';
import { Const } from 'qmkit';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [
      new LoadingActor(),
      new LevelActor(),
      new VisibleActor(),
      new EditActor()
    ];
  }

  init = ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    this.dispatch('loading:start');
    //const query = this.state().get('form').toJS()
    webapi.fetchCustomerLevel({ pageNum, pageSize }).then(({ res }) => {
      if (res.code === Const.SUCCESS_CODE) {
        this.transaction(() => {
          this.dispatch('loading:end');
          this.dispatch('level:init', res.context);
          this.dispatch('level:currentPage', pageNum && pageNum + 1);
        });
      } else {
        this.dispatch('loading:end');
        message.error(res.message);
      }
    });
  };

  onCreate = () => {
    this.dispatch('modal:show');
  };

  onCancel = () => {
    this.transaction(() => {
      this.dispatch('edit', false);
      this.dispatch('modal:hide');
    });
  };

  onSave = async ({ customerLevelName, customerLevelDiscount }) => {
    //更新
    if (this.state().get('edit')) {
      const customerLevelId = this.state().getIn([
        'customerLevel',
        'customerLevelId'
      ]);

      const { res } = await webapi.updateCustomerLevel({
        customerLevelDiscount,
        customerLevelId,
        customerLevelName
      });

      //取消编辑状态
      this.dispatch('edit', false);

      if (res.code === Const.SUCCESS_CODE) {
        message.success(res.message);
        this.dispatch('modal:hide');
        this.init();
      } else {
        message.error(res.message);
      }
      return;
    }

    //保存
    const { res } = await webapi.saveCustomerLevel({
      customerLevelDiscount,
      customerLevelName
    });
    if (res.code === Const.SUCCESS_CODE) {
      message.success(res.message);
      this.dispatch('modal:hide');
      this.init();
    } else {
      message.error(res.message);
    }
  };

  onEdit = (id: number) => {
    const level = this.state()
      .get('dataList')
      .filter((v) => v.get('customerLevelId') == id)
      .first();

    this.transaction(() => {
      this.dispatch('edit', true);
      this.dispatch('edit:init', level);
      this.dispatch('modal:show');
    });
  };

  onDelete = async (customerLevelId: string) => {
    const { res } = await webapi.deleteCustomerLevel(customerLevelId);

    if (res.code === Const.SUCCESS_CODE) {
      message.success(res.message);
      this.dispatch('modal:hide');
      this.init();
    } else {
      message.error(res.message);
    }
  };
}
