import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import ListActor from './actor/list-actor';
import LoadingActor from './actor/loading-actor';
import { message } from 'antd';
import SearchActor from './actor/search-actor';
import { Const, util } from 'qmkit';
import ExportActor from './actor/export-actor';
import SelectedActor from './actor/selected-actor';
import { fromJS } from 'immutable';

export default class AppStore extends Store {
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
      new ExportActor(),
      new SelectedActor()
    ];
  }

  initDistributorLevelBaseInfo = async () => {
    const list: any = await webapi.getDistributorLevelBaseInfo();
    if (list.res.code === Const.SUCCESS_CODE) {
      this.dispatch('search:distributor:level:list', list.res.context.list);
    }
  };

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    this.dispatch('loading:start');
    const query = this.state()
      .get('searchParams')
      .toJS();
    const { res } = await webapi.fetchDistributionCommissionList({
      ...query,
      pageNum,
      pageSize
    });
    if (res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('distribution:commission:currentPage', pageNum + 1);
        this.dispatch('distribution:commission:init', res.context);
      });
    } else {
      this.dispatch('loading:end');
      message.error(res.message);
    }
  };

  getStatistics = async () => {
    const { res } = await webapi.getStatistics();
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('distribution:commission:statistics', res.context);
    }
  };

  //tab-list 切换
  onTabChange = (index: number) => {
    //所有搜索框和搜索条件清空
    this.dispatch('distribution:commission:empty');
    this.dispatch('distribution:commission:searchParams', {
      field: 'isRewardRecorded',
      value: index
    });
    this.init();
  };

  /**
   * 点击搜索，都是从第一页开始
   */
  onSearch = () => {
    //排序方式和页码都复位
    this.transaction(() => {
      this.dispatch('distribution:commission:searchParams', {
        field: 'sortRole',
        value: 'desc'
      });
      this.dispatch('distribution:commission:searchParams', {
        field: 'sortColumn',
        value: 'createTime'
      });
    });
    this.init({ pageNum: 0, pageSize: 10 });
  };

  /**
   * 检索种类
   */
  setSearchKind = (value) => {
    //搜索框内容清空
    this.dispatch('distribution:commission:distributionFilterValue', '');
    this.dispatch('distribution:commission:searchKind', value);
  };

  /**
   * 根据分销员名称或账号联想查询
   */
  searchDistributionCustomers = async (value) => {
    //autoComplete文本框值改变
    this.dispatch('distribution:commission:distributionFilterValue', value);
    if (value != undefined) {
      //根据分销员账号联想
      if (
        this.state()
          .get('distributionSearchSelect')
          .get('checked') == '0'
      ) {
        const { res } = await webapi.filterDistributionCustomer({
          customerAccount: value,
          pageNum: 0,
          pageSize: 5
        });
        if (res.code == Const.SUCCESS_CODE) {
          this.dispatch(
            'distribution:commission:filterDistributionCustomer',
            res.context.distributionCustomerVOPage.content
          );
        }
      } else {
        //根据分销员名称联想
        const { res } = await webapi.filterDistributionCustomer({
          customerName: value,
          pageNum: 0,
          pageSize: 5
        });
        if (res.code == Const.SUCCESS_CODE) {
          this.dispatch(
            'distribution:commission:filterDistributionCustomer',
            res.context.distributionCustomerVOPage.content
          );
        }
      }
    } else {
      //value清空时，存储的distributionId要清空
      this.dispatch('distribution:commission:searchParams', {
        field: 'distributionId',
        value: value
      });
    }
  };

  /**
   * 根据选中的分销员信息过滤出其distributionId,并存放
   */
  saveDistributionCustomerFilter = (value) => {
    this.dispatch('distribution:commission:distributionFilterValue', value);
    const filterCustomerData = this.state().get(
      'filterDistributionCustomerData'
    );
    const distributionId = filterCustomerData
      .filter((v) => v.get('value') == value)
      .get(0)
      .get('key');
    //存放最终检错所需的参数
    this.dispatch('distribution:commission:searchParams', {
      field: 'distributionId',
      value: distributionId
    });
  };

  /**
   * 保存检索需要的参数
   */
  saveSearchParams = ({ field, value }) => {
    this.dispatch('distribution:commission:searchParams', {
      field: field,
      value: value
    });
  };

  /**
   * 分页处理
   * @param pageNum
   * @param pageSize
   * @returns {Promise<void>}
   */
  onPagination = async (pageNum, sortName, sortOrder) => {
    //改变查询参数
    this.dispatch('commission:searchParams', { pageNum, sortName, sortOrder });
    if (pageNum == 1) {
      this.init();
    } else {
      this.dispatch('loading:start');
      const query = this.state()
        .get('searchParams')
        .toJS();
      const { res } = await webapi.fetchDistributionCommissionList({
        ...query,
        pageNum: pageNum - 1
      });
      if (res.code === Const.SUCCESS_CODE) {
        this.transaction(() => {
          this.dispatch('loading:end');
          this.dispatch('distribution:commission:currentPage', pageNum);
          this.dispatch('distribution:commission:init', res.context);
        });
      } else {
        this.dispatch('loading:end');
        message.error(res.message);
      }
    }
  };

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
      message.error('请选择要导出的分销员佣金记录');
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }
    return this._onExport({ distributionIdList: selected.toJS() });
  };

  /**
   * 按搜索条件导出
   * @returns {Promise<T>}
   */
  onExportByParams = () => {
    // 搜索条件
    let params = this.state()
      .get('searchParams')
      .toJS();
    params.sortRole = 'desc';
    params.sortColumn = 'createTime';
    return this._onExport(params);
  };

  /**
   * 导出
   * @param params
   * @private
   */
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
            Const.HOST + `/distribution-commission/export/params/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }

        resolve();
      }, 500);
    });
  };
}
