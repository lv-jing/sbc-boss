import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class CustomerGroup extends Actor {
  defaultState() {
    return {
      formFunctions: null,
      modalType: 0,
      topList: [],
      crmGroupList: [],
      queryTab: 1,
      areaIds: [],
      areaNames: [],
      selectedAreaIds: [],
      modalVisible: false,
      tagList: [],
      form: {
        groupName: null,
        regionList: [],
        lastTradeTime: null,
        tradeCountTime: null,
        gtTradeCount: null,
        ltTradeCount: null,
        tradeAmountTime: null,
        gtTradeAmount: null,
        ltTradeAmount: null,
        avgTradeAmountTime: null,
        gtAvgTradeAmount: null,
        ltAvgTradeAmount: null,
        gtCustomerGrowth: null,
        ltCustomerGrowth: null,
        gtPoint: null,
        ltPoint: null,
        gtBalance: null,
        ltBalance: null,
        customerLevel: [],
        customerTag: []
      },
      selectedId: '',
      levalList: [],
      ifUpdate: false,
      pageSize: 10,
      currentPage: 0,
      total: 0,
      arr: [
        {
          id: 0,
          name: '最近一次消费',
          ifChecked: false,
          field: ['lastTradeTime']
        },
        {
          id: 1,
          name: '累计消费次数',
          ifChecked: false,
          field: ['tradeCountTime', 'gtTradeCount', 'ltTradeCount']
        },
        {
          id: 2,
          name: '累计消费金额',
          ifChecked: false,
          field: ['tradeAmountTime', 'gtTradeAmount', 'ltTradeAmount']
        },
        {
          id: 3,
          name: '笔单价',
          ifChecked: false,
          field: ['avgTradeAmountTime', 'gtAvgTradeAmount', 'ltAvgTradeAmount']
        },
        { id: 4, name: '会员等级', ifChecked: false, field: ['customerLevel'] },
        {
          id: 5,
          name: '会员成长值',
          ifChecked: false,
          field: ['gtCustomerGrowth', 'ltCustomerGrowth']
        },
        {
          id: 6,
          name: '会员积分',
          ifChecked: false,
          field: ['gtPoint', 'ltPoint']
        },
        {
          id: 7,
          name: '会员余额',
          ifChecked: false,
          field: ['gtBalance', 'ltBalance']
        },

        {
          id: 8,
          name: '最近无访问',
          ifChecked: false,
          field: ['noRecentFlowTime']
        },
        {
          id: 9,
          name: '最近有访问',
          ifChecked: false,
          field: ['recentFlowTime']
        },
        {
          id: 10,
          name: '最近无收藏',
          ifChecked: false,
          field: ['noRecentFavoriteTime']
        },
        {
          id: 11,
          name: '最近有收藏',
          ifChecked: false,
          field: ['recentFavoriteTime']
        },
        {
          id: 12,
          name: '最近无加购',
          ifChecked: false,
          field: ['noRecentCartTime']
        },
        {
          id: 13,
          name: '最近有加购',
          ifChecked: false,
          field: ['recentCartTime']
        },
        {
          id: 14,
          name: '最近无下单',
          ifChecked: false,
          field: ['noRecentTradeTime']
        },
        {
          id: 15,
          name: '最近有下单',
          ifChecked: false,
          field: ['recentTradeTime']
        },
        {
          id: 16,
          name: '最近无付款',
          ifChecked: false,
          field: ['noRecentPayTradeTime']
        },
        {
          id: 17,
          name: '最近有付款',
          ifChecked: false,
          field: ['recentPayTradeTime']
        },
        {
          id: 18,
          name: '所在地区',
          ifChecked: false,
          field: ['regionList']
        },
        {
          id: 19,
          name: '会员标签',
          ifChecked: false,
          field: ['customerTag']
        },
        {
          id: 20,
          name: '性别',
          ifChecked: false,
          field: ['gender']
        },
        {
          id: 21,
          name: '年龄',
          ifChecked: false,
          field: ['gtAge', 'ltAge']
        },
        {
          id: 22,
          name: '入会时间',
          ifChecked: false,
          field: ['gtAdmissionTime', 'ltAdmissionTime']
        }
      ],
      sendModalVisible: false,
      sendForm: {
        signId: null,
        templateCode: null,
        context: '',
        manualAdd: null,
        receiveType: 2,
        receiveValue: [],
        receiveValueList: [],
        sendTime: null,
        sendType: 0
      },
      passedSignList: [],
      salePassedTemplateList: [],
      ifModify: true,
      smsNum: 1,
      sendGroupId: null,
      sendGroupName: '',
      sendGroupCustomerNum: 0,
      sendGroupType: 0
    };
  }

  @Action('init')
  init(state: IMap, data) {
    return state
      .set('modalVisible', false)
      .set('topList', fromJS(data.topList))
      .set('selectedAreaIds', data.selectedAreaIds);
  }

  @Action('init:topList')
  initTopList(state: IMap, data) {
    return state.set('topList', fromJS(data));
  }

  @Action('set:state')
  initState(state: IMap, { field, value }) {
    return state.set(field, value);
  }

  @Action('set:state:im')
  initState2(state: IMap, { field, value }) {
    return state.set(field, fromJS(value));
  }

  @Action('toggle:update')
  toggleUpdate(state: IMap) {
    return state.set('ifUpdate', !state.get('ifUpdate'));
  }

  @Action('init:crmGroupList')
  initCrmGroupList(state, data) {
    return state.set('crmGroupList', data);
  }

  @Action('toggle: form: modal')
  toggleFormModel(state) {
    return state.set('modalVisible', !state.get('modalVisible'));
  }

  @Action('form:field')
  changeField(state: IMap, { field, value }) {
    return state.setIn(['form', field], fromJS(value));
  }

  @Action('init:tagList')
  initTagList(state: IMap, tagList) {
    return state.set('tagList', tagList);
  }

  @Action('init:form')
  initForm(state: IMap, data) {
    return state.mergeIn(['form'], data);
  }

  @Action('init:selectedId')
  initselectedId(state: IMap, data) {
    return state.set('selectedId', data);
  }

  @Action('change:modalType')
  changeModalType(state: IMap, type) {
    return state.set('modalType', type);
  }

  @Action('set:state')
  setState(state, { field, value }) {
    return state.set(field, value);
  }

  @Action('set:state:im')
  setStateIm(state, { field, value }) {
    return state.set(field, fromJS(value));
  }
}
