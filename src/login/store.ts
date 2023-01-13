import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS } from 'immutable';
import { history, util, cache, Const } from 'qmkit';
import * as webapi from './webapi';
import FormActor from './actor/form-actor';

export default class AppStore extends Store {
  bindActor() {
    return [new FormActor()];
  }

  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }

  //;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;;;;
  init = async () => {
    webapi.getSiteInfo().then((resIco: any) => {
      if (resIco.res.code == Const.SUCCESS_CODE) {
        //logo
        const logo = JSON.parse((resIco.res.context as any).pcLogo);
        const url = logo && logo[0].url;
        this.dispatch('login:logo', url);
        this.dispatch('login:refresh',true)
        sessionStorage.setItem(cache.SITE_LOGO, url); //放入缓存,以便登陆后获取
        //icon
        const ico = (resIco.res.context as any).pcIco
          ? JSON.parse((resIco.res.context as any).pcIco)
          : null;
        if (ico) {
          const linkEle = document.getElementById('icoLink') as any;
          linkEle.href = ico[0].url;
          linkEle.type = 'image/x-icon';
        }
      }
    });
  };

  /**
   * 账户密码登录;
   */
  login = async (form, failedCallback) => {
    const account = form.account;
    const password = form.password;
    const isRemember = form.isRemember;
    let base64 = new util.Base64();
    const { res } = await webapi.login(
      base64.urlEncode(account),
      base64.urlEncode(password)
    );
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
      if (failedCallback) {
        failedCallback();
      }
      return;
    }
    //debugger
    if (isRemember) {
      localStorage.setItem(cache.LOGIN_DATA, JSON.stringify(res.context));
    }

    (window as any).token = res.context.token;
    sessionStorage.setItem(cache.LOGIN_DATA, JSON.stringify(res.context));

    const { res:qrCode }=(await webapi.fetchMiniProgramQrcode()) as any;
    if (qrCode.code == Const.SUCCESS_CODE && qrCode.context ) {
      //获取小程序码的地址，保存到本地
      localStorage.setItem(cache.MINI_QRCODE, qrCode.context);
    }

    // 获取登录人拥有的菜单
    const menusRes = (await webapi.fetchMenus()) as any;
    if (menusRes.res.code === Const.SUCCESS_CODE) {
      let dataList = fromJS(menusRes.res.context);

      // 主页菜单不在权限中配置，写死第一个
      // dataList = dataList.insert(
      //   0,
      //   fromJS({
      //     id: 'menu_a',
      //     pid: 'menu_0',
      //     realId: -1,
      //     title: 'Home',
      //     grade: 1,
      //     icon: '1505551659667.jpg',
      //     authNm: '',
      //     url: '/',
      //     reqType: '',
      //     authRemark: '',
      //     isMenuUrl: null,
      //     sort: 0
      //   })
      // );

      const allGradeMenus = this._getChildren(
        dataList.filter((item) => item.get('grade') == 1),
        dataList
      );
      sessionStorage.setItem(
        cache.LOGIN_MENUS,
        JSON.stringify(allGradeMenus.toJS())
      );
      const functionsRes = (await webapi.fetchFunctions()) as any;
      sessionStorage.setItem(
        cache.LOGIN_FUNCTIONS,
        JSON.stringify(functionsRes.res.context)
      );

      const config = (await webapi.getSiteInfo()) as any;
      sessionStorage.setItem(
        cache.SYSTEM_BASE_CONFIG,
        JSON.stringify(config.res.context)
      );

      sessionStorage.setItem(cache.SYSTEM_GET_CONFIG, '€'); //货币符号
      sessionStorage.setItem(cache.SYSTEM_GET_CONFIG_NAME, '€'); //货币名称

      history.push('/supplier-list');
    } else {
      message.error(menusRes.res.message);
      if (failedCallback) {
        failedCallback();
      }
    }
  };

  /**
   * 获取子菜单
   * @param list
   * @private
   */
  _getChildren = (list, dataList) => {
    return list.map((data) => {
      const children = dataList.filter(
        (item) => item.get('pid') == data.get('id')
      );
      if (!children.isEmpty()) {
        data = data.set('children', this._getChildren(children, dataList));
      }
      return data;
    });
  };

  /**
   *  输入
   */
  onInput = (param) => {
    this.dispatch('login:input', param);
  };
}
