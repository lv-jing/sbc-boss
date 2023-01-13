import { Actor, Action, IMap } from 'plume2';
import { fromJS, List } from 'immutable';

export default class SearchActor extends Actor {
  defaultState() {
    return {
      inviteSearchSelect: fromJS({
        '0': '受邀人账号',
        '1': '受邀人名称',
        checked: '0'
      }),
      distributionSearchSelect: fromJS({
        '0': '分销员账号',
        '1': '分销员名称',
        checked: '0'
      }),
      inviteSearchText: '',
      distributionSearchText: '',
      filterCustomerData: fromJS([]),
      filterDistributionCustomerData: fromJS([]),
      searchParams: fromJS({
        //分销员ID
        distributionId: '',
        //分销员等级ID
        distributorLevelId: '',
        pageNum: 0,
        //加入起始时间
        createStartTime: '',
        //加入结束时间
        createEndTime: '',
        //排序规则，默认降序
        sortRole: 'desc',
        //排序内容，默认创建时间
        sortColumn: 'createTime'
      }),
      distributorLevelIds: List()
    };
  }

  @Action('customerLevel:init')
  init(state: IMap, res) {
    return state.set('customerLevels', res);
  }

  /**
   * 检索类型，名称or账号，分销员or受邀人
   * @param state
   * @param param1
   */
  @Action('distribution:commission:searchKind')
  searchKind(state: IMap, value) {
    return state.setIn(['distributionSearchSelect', 'checked'], value);
  }

  @Action('distribution:commission:filterDistributionCustomer')
  filterDistributionCustomer(state, res) {
    const filterDistributionCustomerData = res.map((v) => {
      return {
        key: v.distributionId,
        value: v.customerName + '  ' + v.customerAccount
      };
    });
    return state.set(
      'filterDistributionCustomerData',
      fromJS(filterDistributionCustomerData)
    );
  }

  @Action('distribution:commission:distributionFilterValue')
  customerFilterValue(state, value) {
    return state.set('distributionSearchText', value);
  }

  /**
   * 填充搜索字段
   * @param state
   * @param param1
   */
  @Action('distribution:commission:searchParams')
  searchParams(state, { field, value }) {
    return state.setIn(['searchParams', field], value);
  }

  @Action('distribution:commission:empty')
  empty(state) {
    return state
      .set('inviteSearchText', '')
      .set('distributionSearchText', '')
      .set(
        'searchParams',
        fromJS({
          invitedNewCustomerId: '',
          distributionId: '',
          //首次下单开始时间
          firstOrderStartTime: '',
          //首次下单结束时间
          firstOrderEndTime: '',
          //首次订单完成开始时间
          orderFinishStartTime: '',
          //首次订单完成结束时间
          orderFinishEndTime: '',
          //订单编号
          orderCode: '',
          //首次奖励入账开始时间
          rewardRecordedStartTime: '',
          //首次奖励入账结束时间
          rewardRecordedEndTime: ''
        })
      );
  }

  /**
   * 排序换页或者换排序时切换
   * @param state
   * @param param1
   */
  @Action('commission:searchParams')
  searchPaginationParams(state, { pageNum, sortName, sortOrder }) {
    return state
      .setIn(['searchParams', 'pageNum'], pageNum)
      .setIn(['searchParams', 'sortColumn'], sortName)
      .setIn(['searchParams', 'sortRole'], sortOrder);
  }

  /**
   * 设置分销员等级列表
   * @param {IMap} state
   * @param data
   * @returns {Map<string, V>}
   */
  @Action('search:distributor:level:list')
  setDistributorLevelList(state: IMap, data) {
    return state.set('distributorLevelIds', fromJS(data));
  }
}
