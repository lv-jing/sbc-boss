import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

interface ICustomerResponse {
  content: Array<any>;
  size: number;
  totalElements: number;
}

export default class ListActor extends Actor {
  defaultState() {
    return {
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前的敏感词列表
      dataList: [],
	    //当前页
      current: 1,
	    loading: true,
	    visible: false,
	    // 搜索项信息
	    likeSensitiveWords: '',
	    formData:{},
	    selected: [],
    };
  }

	/**
	 * 初始化列表
	 * @param {IMap} state
	 * @param {ICustomerResponse} res
	 * @returns {Map<K, V>}
	 */
  @Action('list:init')
  init(state: IMap, res: ICustomerResponse) {
    const { content, size, totalElements } = res;
    return state.withMutations((state) => {
      state
        .set('total', totalElements)
        .set('pageSize', size)
        .set('dataList', fromJS(content));
    });
  }

	/**
	 * 设置当前页
	 * @param {IMap} state
	 * @param current
	 * @returns {Map<string, V>}
	 */
  @Action('current')
  current(state: IMap, current) {
    return state.set('current', current);
  }

	/**
	 * 显示loading
	 * @param {IMap} state
	 * @returns {Map<string, boolean>}
	 */
	@Action('loading:start')
	start(state: IMap) {
		return state.set('loading', true);
	}

	/**
	 * 关闭loading
	 * @param {IMap} state
	 * @returns {Map<string, boolean>}
	 */
	@Action('loading:end')
	end(state: IMap) {
		return state.set('loading', false);
	}

	/**
	 * 显示modal
	 * @param {IMap} state
	 * @returns {Map<string, boolean>}
	 */
	@Action('modal:show')
	show(state: IMap) {
		return state.set('visible', true);
	}

	/**
	 * 隐藏modal
	 * @param {IMap} state
	 * @returns {Map<string, boolean>}
	 */
	@Action('modal:hide')
	hide(state: IMap) {
		return state.set('visible', false);
	}

	/**
	 * 修改表单内容
	 */
	@Action('sensitiveActor: editFormData')
	editFormData(state, data: IMap) {
		return state.update('formData', (formData) => formData.merge(data));
	}

	/**
	 * 编辑modal 初始化
	 * @param {IMap} state
	 * @param res
	 * @returns {Map<string, V>}
	 */
	@Action('edit:init')
	editInit(state: IMap, res) {
		return state.set('formData', res);
	}

	/**
	 * 搜索项
	 * @param state
	 * @param {IMap} data
	 */
	@Action('sensitiveActor: editSearchData')
	editSearchData(state: IMap, likeSensitiveWords) {
		return state.set("likeSensitiveWords", likeSensitiveWords);
	}

	/**
	 * 选中复选框
	 * @param {IMap} state
	 * @param list
	 * @returns {Map<string, V>}
	 */
	@Action('sensitiveActor:select')
	selectIds(state: IMap, list) {
		return state.set('selected', fromJS(list));
	}
}
