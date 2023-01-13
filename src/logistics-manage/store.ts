import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import { message } from 'antd';
import VisibleActor from './actor/visible-actor';
import ExpActor from './actor/exp-actor';
import { Const } from 'qmkit';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new ExpActor(), new VisibleActor()];
  }

  init = async () => {
    const { res } = await webapi.fetchAllExpress();
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('exp:init', res.context);
    } else {
      message.error(res.message);
    }
  };
  /**
   * 添加公司时弹出*/
  onAdd = () => {
    const checkedNumber = this.state().get('allExpressList').size;
    if (checkedNumber == 100 || checkedNumber > 100) {
      message.error('最多可设置100个物流公司');
    } else {
      this.dispatch('visible:addShow');
    }
  };

  /**
   * 弹框消失*/
  onCancel = () => {
    this.dispatch('visible:hide');
  };

  /**
   * 删除物流公司
   * 参数（ID）
   * 删除以后重新init获取最新的list*/
  onDelete = async (id: number) => {
    const { res } = await webapi.deleteCompany(id);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('删除成功！');
      this.init();
    } else {
      message.error(res.message);
    }
  };

  /**选中一个或多个快递公司
   * 参数为List*/
  onChecked = async (index: number, checked: number) => {
    this.dispatch('exp:checked', {
      index,
      checked
    });
  };

  changeId = async (id) => {
    this.dispatch('visible:changeId', id);
  };

  changeName = async (name) => {
    this.dispatch('visible:changeName', name);
  };

  confirmAdd = async (form) => {
    /**
     * 去中间的空格*/
    const expressName = form.expressName.replace(/\s/g, '').trim();
    const expressCode = form.expressCode.replace(/\s/g, '').trim();
    const regex = /^[A-Za-z0-9]{1,50}$/;

    /**
     * 正则表达式特殊字符校验*/
    if (!regex.test(expressCode)) {
      message.error('物流代码不允许特殊字符，请重新输入！');
      return false;
    }

    /**
     * 前台做check，
     * 不得与已有的物流公司代码重复*/
    const repeatCode = this.state()
      .get('allExpressList')
      .filter((v) => v.get('expressCode') == expressCode)
      .map((v) => v.get('expressCode'))
      .toJS();
    if (repeatCode.length != 0) {
      message.error('该公司已存在，不能重复添加！');
      return false;
    }

    /**
     * 校验完毕，一切就绪，调用后台*/
    const { res } = await webapi.addCompany(expressName, expressCode);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('添加成功!');
      this.init();
      this.onCancel();
    } else {
      message.error(res.message);
    }
  };
}
