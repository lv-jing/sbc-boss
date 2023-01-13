import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import ListActor from './actor/list-actor';
import LoadingActor from './actor/loading-actor';
import { message } from 'antd';
import SearchActor from './actor/search-actor';
import { Const, util, QMMethod } from 'qmkit';
import { fromJS } from 'immutable';
import ExportActor from './actor/export-actor';

export default class AppStore extends Store {
  // 搜索条件缓存
  searchCache = {} as any;

  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [
      new ListActor(),
      new LoadingActor(),
      new SearchActor(),
      new ExportActor()
    ];
  }

  init = async (params?: { customerId; customerAccount }) => {
    const pageNum = 0;
    const pageSize = 10;
    if (params && params.customerId) {
      this.dispatch(
        'invite:new:distributionFilterValue',
        params.customerAccount
      );
      this.dispatch('invite:new:searchParams', {
        field: 'requestCustomerId',
        value: params.customerId
      });
    }
    if (this.state().get('loading')) {
      this.dispatch('loading:start');
    }
    const query = this.state()
      .get('searchParams')
      .toJS();
    this.searchCache = query;
    const { res } = await webapi.fetchInviteNewRecordList({
      ...query,
      pageNum,
      pageSize
    });
    if (res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('invite:new:currentPage', pageNum + 1);
        this.dispatch('invite:new:init', res.context);
      });
    } else {
      if (this.state().get('loading')) {
        this.dispatch('loading:end');
      }
      message.error(res.message);
    }
  };

  //tab-list 切换
  onTabChange = (index: number) => {
    //所有搜索框和搜索条件清空
    //this.dispatch('invite:new:empty');
    this.dispatch('invite:new:searchParams', {
      field: 'isRewardRecorded',
      value: index
    });
    this.init();
  };

  /**
   * 点击搜索，都是从第一页开始
   */
  onSearch = () => {
    this.init();
  };

  /**
   * 检索种类
   */
  setSearchKind = ({ kind, value }) => {
    //搜索框内容清空
    this.dispatch('invite:new:distributionFilterValue', '');
    this.dispatch('invite:new:searchKind', { kind, value });
  };

  /**
   * 根据受邀人名称或账号联想查询
   */
  searchCustomers = async (value) => {
    //autoComplete文本框值改变
    this.dispatch('invite:new:customerFilterValue', value);
    //空值不查询(不直接判boolean行，防止是0)
    if (value != undefined) {
      //根据受邀人账号联想
      if (
        this.state()
          .get('inviteSearchSelect')
          .get('checked') == '0'
      ) {
        const { res } = await webapi.filterCustomer({
          customerAccount: value,
          pageNum: 0,
          pageSize: 5
        });
        if (res.code == Const.SUCCESS_CODE) {
          this.dispatch(
            'invite:new:filterCustomer',
            res.context.detailResponseList
          );
        }
      } else {
        //根据受邀人名称联想
        const { res } = await webapi.filterCustomer({
          customerName: value,
          pageNum: 0,
          pageSize: 5
        });
        if (res.code == Const.SUCCESS_CODE) {
          this.dispatch(
            'invite:new:filterCustomer',
            res.context.detailResponseList
          );
        }
      }
    } else {
      //为空时候，要将受邀人Id清掉
      this.dispatch('invite:new:searchParams', {
        field: 'invitedNewCustomerId',
        value: value
      });
    }
  };

  /**
   * 根据分销员名称或账号联想查询
   */
  searchDistributionCustomers = async (value) => {
    //autoComplete文本框值改变
    this.dispatch('invite:new:distributionFilterValue', value);
    if (value != undefined) {
      //根据分销员账号联想
      if (
        this.state()
          .get('distributionSearchSelect')
          .get('checked') == '0'
      ) {
        const { res } = await webapi.filterCustomer({
          customerAccount: value,
          pageNum: 0,
          pageSize: 5
        });
        if (res.code == Const.SUCCESS_CODE) {
          this.dispatch(
            'invite:new:filterDistributionCustomer',
            res.context.detailResponseList
          );
        }
      } else {
        //根据分销人名称联想
        const { res } = await webapi.filterCustomer({
          customerName: value,
          pageNum: 0,
          pageSize: 5
        });
        if (res.code == Const.SUCCESS_CODE) {
          this.dispatch(
            'invite:new:filterDistributionCustomer',
            res.context.detailResponseList
          );
        }
      }
    } else {
      //为空值时候，之前存放的分销员ID清空
      this.dispatch('invite:new:searchParams', {
        field: 'requestCustomerId',
        value: value
      });
    }
  };

  /**
   * 根据选中的受邀人信息过滤出其customerId,并存放
   */
  saveCustomerFilter = (value) => {
    const filterCustomerData = this.state().get('filterCustomerData');
    const customerId = filterCustomerData
      .filter((v) => v.get('value') == value)
      .get(0)
      .get('key');
    //存放最终检错所需的参数
    this.dispatch('invite:new:searchParams', {
      field: 'invitedNewCustomerId',
      value: customerId
    });
  };

  /**
   * 根据选中的分销员信息过滤出其requestCustomerId,并存放
   */
  saveDistributionCustomerFilter = (value) => {
    const filterCustomerData = this.state().get(
      'filterDistributionCustomerData'
    );
    const requestCustomerId = filterCustomerData
      .filter((v) => v.get('value') == value)
      .get(0)
      .get('key');
    //存放最终检错所需的参数
    this.dispatch('invite:new:searchParams', {
      field: 'requestCustomerId',
      value: requestCustomerId
    });
  };

  /**
   * 保存检索需要的参数
   */
  saveSearchParams = ({ field, value }) => {
    this.dispatch('invite:new:searchParams', {
      field: field,
      value: value
    });
  };

  /**
   * 选中
   */
  onSelect = (list) => {
    this.dispatch('select:init', list);
  };

  /**
   * 隐藏导出modal
   */
  onExportModalHide = () => {
    this.dispatch('list:export-modal:hide');
  };

  /**
   * 线上导出modal
   * @param status
   */
  onExportModalChange = (status) => {
    this.dispatch('list:export-modal:change', fromJS(status));
  };

  /**
   * 按选中的编号导出
   * @returns {Promise<T>}
   */
  onExportByIds = () => {
    const selected = this.state().get('selected');
    if (selected.isEmpty()) {
      message.error('请选择要导出的邀新记录');
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }
    let params = this.state()
      .get('searchParams')
      .toJS();

    // 入账状态
    const key = params.isRewardRecorded;
    if (key === '1') {
      params.isRewardRecorded = 'YES';
    } else if (key === '0') {
      params.isRewardRecorded = 'NO';
    }
    return this._onExport({
      recordIdList: selected.toJS(),
      isRewardRecorded: params.isRewardRecorded
    });
  };

  /**
   * 按搜索条件导出
   * @returns {Promise<T>}
   */
  onExportByParams = () => {
    // 搜索条件
    let params = this.searchCache;

    // 入账状态
    const key = params.isRewardRecorded;
    if (key === '1') {
      params.isRewardRecorded = 'YES';
    } else if (key === '0') {
      params.isRewardRecorded = 'NO';
    }
    params = QMMethod.trimValueDeep(params);
    return this._onExport(params);
  };

  _onExport = (params: {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 参数加密
        let base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          let result = JSON.stringify({ ...params, token: token });
          let encrypted = base64.urlEncode(result);

          // 新窗口下载
          const exportHref =
            Const.HOST + `/distribution-invite-new/export/params/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }

        resolve();
      }, 500);
    });
  };

  onFormChange = () => {};
}
