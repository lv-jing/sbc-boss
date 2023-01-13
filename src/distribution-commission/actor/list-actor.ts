import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

interface ICustomerResponse {
  recordList: Array<any>;
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
      statistics:fromJS({
        //佣金总额
        commissionTotal:'',
        //分销佣金
        commission:'',
        //未入账分销佣金
        commissionNotRecorded:'',        
        //邀新奖金
        rewardCash:'',
        //未入账邀新奖金
        rewardCashNotRecorded:''
      })
    };
  }

  /**
   * 列表初始化
   * @param state 
   * @param res 
   */
  @Action('distribution:commission:init')
  init(state: IMap, res: ICustomerResponse) {
    const { recordList, total } = res;

    return state.withMutations((state) => {
      state.set('total', total).set('dataList', fromJS(recordList));
    });
  }

  /**
   * 切页
   * @param state 
   * @param current 
   */
  @Action('distribution:commission:currentPage')
  currentPage(state: IMap, current) {
    return state.set('currentPage', current);
  }

  /**
   * 佣金总额统计数据
   * @param state 
   * @param result 
   */
  @Action('distribution:commission:statistics')
  statistics(state,result){ 
     return state.update('statistics',(statistics)=>statistics.merge(fromJS(result)))
  }
}
