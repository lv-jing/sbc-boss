import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import ListActor from './actor/list-actor';
import LoadingActor from './actor/loading-actor';
import FormActor from './actor/form-actor';
import { message } from 'antd';
import SortActor from './actor/sort-actor';
import RatioActor from './actor/ratio-actor';
import RecordActor from './actor/record-actor';
import { Const } from 'qmkit';
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
      new FormActor(),
      new SortActor(),
      new RatioActor(),
      new RecordActor(),
    ];
  }

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    this.dispatch('loading:start');
    const key = this.state().get('key');
    if (key == '1') {
      //查询评价设置
      const { res } = await webapi.fetchEvaluateRatio();
      if (res.code === Const.SUCCESS_CODE) {
        this.transaction(() => {
          this.dispatch('loading:end');
          this.dispatch('init:ratio', fromJS(res.context.evaluateRatioVO));
        });
      } else {
        this.dispatch('loading:end');
        message.error(res.message);
      }
    } else {
      //分页查询评价列表
      const query = this.state()
        .get('form')
        .toJS();
      const sortedInfo = this.state()
        .get('sortedInfo')
        .toJS();
      let sorterOrder = 'DESC';
      const sortType = sortedInfo.order;
      if (sortType == 'ascend') {
        sorterOrder = 'ASC';
      }
      const { res } = await webapi.fetchStoreEvaluateList({
        ...query,
        pageNum,
        pageSize,
        sortColumn: sortedInfo.columnKey,
        sortRole: sorterOrder,
      });

      if (res.code === Const.SUCCESS_CODE) {
        this.transaction(() => {
          this.dispatch('loading:end');
          this.dispatch('listActor:init', res.context.storeEvaluateSumVOPage);
          this.dispatch('list:currentPage', pageNum && pageNum + 1);

        });
      } else {
        this.dispatch('loading:end');
        message.error(res.message);
      }
    }

  };

  editRatio = async () => {
    const ratio = this.state().get('ratio').toJS();
    const goodsRatio = ratio.goodsRatio;
    const serverRatio = ratio.serverRatio;
    const logisticsRatio = ratio.logisticsRatio;
    const total = parseFloat(goodsRatio) + parseFloat(serverRatio) + parseFloat(logisticsRatio);
    if (total > parseFloat('1') || total < parseFloat('1')) {
      message.error('系数总合不为1');
      return;
    }
    const { res } = await webapi.editEvaluateRatio(ratio);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('保存评价设置成功');
    } else {
      message.error(res.message);
    }
  }


  setSortedInfo = (sortColumn, sorterOrder) => {
    this.dispatch('flow:setSortedInfo', {
      columnKey: sortColumn,
      order: sorterOrder
    });
  }

  onFormChange = ({ field, value }) => {
    this.dispatch('form:field', { field, value });
  };

  onSearch = () => {
    this.init({ pageNum: 0, pageSize: 10 });
  };

  /**
   * 搜索条件表单的变更
   */
  changeRatioInfo = ({ key, value }) => {
    this.dispatch('ratio:field', { key, value });
  };

	/**
	 * 显示服务评价弹框
	 */
  serviceModal = (isAdd) => {
    this.dispatch('service: modal', isAdd);
  };
	/**
	 * 初始化服务评价记录
	 */
  initStoreEvaluate = async ({ pageNum, pageSize, scoreCycle, storeId } = { pageNum: 0, pageSize: 10, scoreCycle: 2, storeId: 0 }) => {
    //近180天评分
    const param = {} as any;
    param.scoreCycle = scoreCycle;
    param.storeId = storeId;
    const { res: storeEvaluateNum } = await webapi.fetchStoreEvaluateNum(param);
    if (storeEvaluateNum.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch(
          'storeEvaluateNum:init',
          storeEvaluateNum.context
        );

      });
    } else {
      message.error(storeEvaluateNum.message);
    }

    const { res: storeEvaluateSum } = await webapi.fetchStoreEvaluateSumInfo(param);
    if (storeEvaluateSum.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch(
          'storeEvaluateNumInfo:init',
          storeEvaluateSum.context.storeEvaluateSumVO
        );
      });
    } else {
      message.error(storeEvaluateSum.message);
    }
    //评价历史记录
    const { res } = await webapi.fetchStoreEvaluateHistoryList({
      storeId,
      pageNum,
      pageSize
    });
    if (res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('storeEvaluateList:init', res.context.storeEvaluateVOPage);
        this.dispatch('storeEvaluateList:currentPage', pageNum && pageNum + 1);
      });
    } else {
      message.error(res.message);
    }
  }

	/**
	 * 显示服务评价记录
	 * @param storeId
	 * @returns {Promise<void>}
	 */
  showStoreEvaluateModal = async (storeId) => {
    this.transaction(() => {
      this.dispatch('storeId:init', storeId);
      this.dispatch('scoreCycle:init', 2);
      this.initStoreEvaluate({ pageNum: 0, pageSize: 10, scoreCycle: this.state().get('scoreCycle'), storeId: storeId });
      this.dispatch('service: modal', true);

    });
  }

	/**
	 * 切换时间
	 * @param scoreCycle
	 * @returns {Promise<void>}
	 */
  changeScoreCycle = async (scoreCycle, storeId) => {
    this.dispatch('storeId:init', storeId);
    this.dispatch('scoreCycle:init', scoreCycle);
    this.transaction(() => {
      this.initStoreEvaluate({ pageNum: 0, pageSize: 10, scoreCycle: this.state().get('scoreCycle'), storeId: storeId });
      this.dispatch('service: modal', true);

    });
  }
}
