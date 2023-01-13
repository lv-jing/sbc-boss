import { IOptions, Store } from 'plume2';
import { Const } from 'qmkit';
import * as webapi from './webapi';
import ListActor from './actor/list-actor';
import LoadingActor from './actor/loading-actor';
import FormActor from './actor/form-actor';
import { message } from 'antd';

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
    ];
  }

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    this.dispatch('loading:start');
    const query = this.state()
      .get('form')
      .toJS();

    const isShow = this.state().getIn(['form', 'isShow']);
    if (isShow == '-1') {
        query.isShow = null;
    }

    const { res } = await webapi.fetchGoodsEvaluateList({
      ...query,
      pageNum,
      pageSize
    });

    if (res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('listActor:init', res.context.goodsEvaluateVOPage);
        this.dispatch('list:currentPage', pageNum && pageNum + 1);
      });
    } else {
      this.dispatch('loading:end');
      message.error(res.message);
    }
  };

  onFormChange = ({ field, value }) => {
    this.dispatch('form:field', { field, value });
  };

  onSearch = () => {
    this.init({ pageNum: 0, pageSize: 10 });
  };

  /**
   * 查看
   */
  modal = (isAdd) => {
    this.dispatch('cate: modal', isAdd);
  };

  /**
   * arrow点击
   */
  arrow = (state) => {
    this.dispatch('change: arrow', state);
  };


	goodsEvaluateDetail = async(evaluateId,isShow) =>{
		const { res } = await webapi.fetchGoodsEvaluateDetail({
			evaluateId:evaluateId
		});
		if (res.code === Const.SUCCESS_CODE) {
			this.dispatch('goodsEvaluate: init',res.context.goodsEvaluateVO);
			this.dispatch('cate: modal', isShow);
			// this.dispatch('evaluate: field', { 'isShow', true });
			this.onFormFieldChange('isShow',res.context.goodsEvaluateVO.isShow);
			this.onFormFieldChange('isAnswer',res.context.goodsEvaluateVO.isAnswer);
			this.onFormFieldChange('evaluateId',evaluateId);
			this.onFormFieldChange('evaluateAnswer',res.context.goodsEvaluateVO.evaluateAnswer);
		} else {
			message.error(res.message);
		}
	}

	onFormFieldChange = (key, value) => {
		this.dispatch('evaluate: field', { key, value });
	};

	/**
	 * 保存评价回复
	 * @returns {Promise<void>}
	 */
	saveAnswer= async (evaluateId,evaluateAnswer,isShow, isAnswer) =>{
		const { res } = await webapi.saveGoodsEvaluateAnswer({
			evaluateId:evaluateId,
			evaluateAnswer:evaluateAnswer,
			isShow:isShow,
      isAnswer:isAnswer
		});
		if (res.code === Const.SUCCESS_CODE) {
			this.dispatch('cate: modal', false);
			this.init({ pageNum: 0, pageSize: 10 });
			message.success('Operation succeeded');
		} else {
			message.error(res.message);
		}
	};
}
