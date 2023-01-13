import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class SearchActor extends Actor {
  defaultState() {
    return {
      inviteSearchSelect: fromJS({
        '0': '受邀人账号',
        '1': '受邀人名称',
        checked: '0'
      }),
      distributionSearchSelect: fromJS({
        '0': '邀请人账号',
        '1': '邀请人名称',
        checked: '0'
      }),
      inviteSearchText: '',
      distributionSearchText: '',
      filterCustomerData: fromJS([]),
      filterDistributionCustomerData: fromJS([]),
      searchParams: fromJS({
        invitedNewCustomerId: '',
        requestCustomerId: '',
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
        rewardRecordedEndTime: '',
        //奖励是否入账,默认是
        isRewardRecorded: '1',
        //是否分销员
        isDistributor: ''
      })
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
  @Action('invite:new:searchKind')
  searchKind(state: IMap, { kind, value }) {
    if (kind == 'invite') {
      return state.setIn(['inviteSearchSelect', 'checked'], value);
    } else {
      return state.setIn(['distributionSearchSelect', 'checked'], value);
    }
  }

  @Action('invite:new:filterCustomer')
  filterCustomers(state, res) {
    const filterCustomerData = res.map((v) => {
      return {
        key: v.customerId,
        value: v.customerName + '  ' + this._hideAccount(v.customerAccount)
      };
    });
    return state.set('filterCustomerData', fromJS(filterCustomerData));
  }

  @Action('invite:new:filterDistributionCustomer')
  filterDistributionCustomer(state, res) {
    const filterDistributionCustomerData = res.map((v) => {
      return {
        key: v.customerId,
        value: v.customerName + '  ' + this._hideAccount(v.customerAccount)
      };
    });
    return state.set(
      'filterDistributionCustomerData',
      fromJS(filterDistributionCustomerData)
    );
  }

  @Action('invite:new:customerFilterValue')
  customerFilterValue(state, value) {
    return state.set('inviteSearchText', value);
  }

  /**
   * 填充搜索字段
   * @param state
   * @param param1
   */
  @Action('invite:new:searchParams')
  searchParams(state, { field, value }) {
    return state.setIn(['searchParams', field], value);
  }

  @Action('invite:new:empty')
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
          rewardRecordedEndTime: '',
          //是否分销员(空：全部，1：是，0：否)
          isDistributor: ''
        })
      );
  }

  /**
   * 更新输入框的值
   * @param state
   * @param value
   */
  @Action('invite:new:distributionFilterValue')
  distributionFilterValue(state, value) {
    return state.set('distributionSearchText', value);
  }

  _hideAccount = (account) => {
    return account && account.length > 0
      ? account.substring(0, 3) + '****' + account.substring(7, account.length)
      : '';
  };
}
