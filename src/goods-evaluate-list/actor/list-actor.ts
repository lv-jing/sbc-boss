import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

interface IGoodsEvaluateResponse {
    content: Array<any>;
    total: number;
}

export default class ListActor extends Actor {
  defaultState() {
    return {
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前的客户列表
      dataList: [],
      //当前页
      currentPage: 1,
      // 弹框是否显示
      modalVisible: false,
      arrowVisible: false,
	    goodsEvaluate:{},
	    goodsEditEvaluate:{
		    isShow:1,
        isAnswer: 0,
		    evaluateId:''
	    }
    };
  }

  @Action('listActor:init')
  init(state: IMap, res: IGoodsEvaluateResponse) {
    const { content, total } = res;

    return state.withMutations(state => {
      state.set('total', total).set('dataList', fromJS(content));
    });
  }

  @Action('list:currentPage')
  currentPage(state: IMap, current) {
    return state.set('currentPage', current);
  }

  /**
   * 显示弹窗
   */
  @Action('cate: modal')
  show(state: IMap, visible) {
    return state.set('modalVisible', visible);
  }

  /**
   * 查看 arrow
   */
  @Action('change: arrow')
  arrow(state: IMap, visible) {
    return state.set('arrowVisible', visible);
  }
	@Action('goodsEvaluate: init')
	setGoodsEvaluate(state: IMap, content) {
		return state.set('goodsEvaluate', content);
	}

	@Action('evaluate: field')
	goodsEvaluateFiledChange(state, { key, value }) {
		return state.setIn(['goodsEditEvaluate', key], value);
	}
}
