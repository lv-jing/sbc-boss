import { IOptions, Store } from 'plume2';
import CustomerGroup from './actor/customer-group';
import * as webapi from './webapi';
import { Const } from 'qmkit';
import { message } from 'antd';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  init = async () => {
    const { res } = (await webapi.rfmGroupList()) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('init', {
        topList: res.context.rfmGroupStatisticsListResponse,
        selectedAreaIds: []
      });
    }
    this.getTagList();
    this.getLevalList();
  };

  bindActor() {
    return [new CustomerGroup()];
  }

  onTabChange = async ({
    key,
    pageNum,
    pageSize
  }: {
    key: string;
    pageNum?: number;
    pageSize?: number;
  }) => {
    this.dispatch('tab: change', key);
    if (+key === 1) {
      const { res } = (await webapi.rfmGroupList()) as any;
      if (res.code === Const.SUCCESS_CODE) {
        this.dispatch(
          'init:topList',
          res.context.rfmGroupStatisticsListResponse
        );
      }
    } else {
      const { res } = (await webapi.crmCustomerGroup({
        pageNum,
        pageSize
      })) as any;
      if (res.code === Const.SUCCESS_CODE) {
        this.dispatch('set:state', {
          field: 'currentPage',
          value: pageNum + 1
        });
        this.dispatch(
          'init:crmGroupList',
          res.context.customGroupPageResponse.content
        );
        this.dispatch('set:state', {
          field: 'total',
          value: res.context.customGroupPageResponse.total
        });
      }
    }
  };

  toggleModal = () => {
    this.dispatch('form:clear');
    this.dispatch('toggle: form: modal');
  };

  /**
   * 存储区域Id
   */
  areaIdsSave = (ids, labels) => {
    let regionList = [];
    ids.map((id, index) => {
      regionList.push({ regionId: id, regionName: labels[index] });
    });
    this.dispatch('set:state', { field: 'areaIds', value: ids });
    this.dispatch('form:field', {
      field: 'regionList',
      value: regionList
    });
  };

  onFormChange = ({ field, value }) => {
    this.dispatch('form:field', { field, value });
  };

  temp = (item, str1, str2) => {
    let form = this.state().get('form');

    const a = form.get(str1);
    const b = form.get(str2);

    if (item.ifChecked) {
      if (
        (a === undefined || a === null || a === '') &&
        (b === undefined || b === null || b === '')
      ) {
        message.error(`请输入${item.name}`);
        return false;
      } else if (a && b && +a > +b) {
        this.onFormChange({ field: str1, value: b });
        this.onFormChange({ field: str2, value: a });
      }
    }
    return true;
  };

  saveGroup = async () => {
    const arr = this.state()
      .get('arr')
      .toJS();

    let flag = arr.some((item) => {
      if (item.ifChecked) {
        return true;
      }
      return false;
    });

    if (!flag) {
      message.error('至少设置一个条件');
      return;
    }

    if (!this.temp(arr[21], 'gtAge', 'ltAge')) {
      return;
    }

    if (!this.temp(arr[22], 'gtAdmissionTime', 'ltAdmissionTime')) {
      return;
    }

    if (!this.temp(arr[1], 'gtTradeCount', 'ltTradeCount')) {
      return;
    }

    if (!this.temp(arr[2], 'gtTradeAmount', 'ltTradeAmount')) {
      return;
    }

    if (!this.temp(arr[3], 'gtAvgTradeAmount', 'ltAvgTradeAmount')) {
      return;
    }

    if (!this.temp(arr[5], 'gtCustomerGrowth', 'ltCustomerGrowth')) {
      return;
    }

    if (!this.temp(arr[6], 'gtPoint', 'ltPoint')) {
      return;
    }

    if (!this.temp(arr[7], 'gtBalance', 'ltBalance')) {
      return;
    }

    const groupForm = this.state()
      .get('form')
      .toJS();

    let fun = '';
    let param = '';
    if (this.state().get('modalType') === 1) {
      fun = 'addCrmCumtomGroup';
      param = groupForm;
    } else {
      fun = 'modifyCouponActivity';
      const id = this.state().get('selectedId');
      param = {
        ...groupForm,
        id
      };
    }
    const { res } = await webapi[fun](param);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.toggleModal();
      this.clearArr();
      this.clearForm();
      this.clearAreaIds();
      this.onTabChange({ key: '2' });
    } else if (res.code === 'K-200303' || res.code === 'K-200304') {
      message.error(res.message);
      const funs = this.state().get('formFunctions');
      funs.setFields({
        customerTag: { value: [], error: [new Error('请选择会员标签')] }
      });
      this.getTagList();
    } else {
      message.error(res.message);
    }
  };

  getTagList = async () => {
    const { res } = (await webapi.customerTagList({
      pageNum: 0,
      pageSize: 50
    })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('init:tagList', res.context.customerTagVOList);
    }
  };

  toggleUpdate = () => {
    this.dispatch('toggle:update');
  };

  getLevalList = async () => {
    const { res } = (await webapi.customerLevelList()) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('set:state', {
        field: 'levalList',
        value: res.context.customerLevelVOList
      });
    }
  };

  getCustomGroup = async (id) => {
    this.dispatch('init:selectedId', id);
    const { res } = (await webapi.fetchCustomGroupById(id)) as any;
    if (res.code === Const.SUCCESS_CODE) {
      const { customGroupDetail } = res.context;
      this.dispatch('init:form', customGroupDetail);

      const { regionList, customerTag, customerLevel } = customGroupDetail;
      let arr = this.state()
        .get('arr')
        .toJS();
      if (regionList && regionList.length) {
        arr[18].ifChecked = true;
        const areaIds = regionList.map((item) => item.regionId);
        this.dispatch('set:state', {
          field: 'areaIds',
          value: areaIds
        });
      }
      if (customerTag && customerTag.length) {
        arr[19].ifChecked = true;
      }
      for (let i = 0; i < 23; i++) {
        let field = null;
        if (arr[i].field.length > 1) {
          if (
            customGroupDetail[arr[i].field[0]] != undefined &&
            customGroupDetail[arr[i].field[1]] == undefined
          ) {
            field = customGroupDetail[arr[i].field[0]];
          } else if (
            customGroupDetail[arr[i].field[0]] == undefined &&
            customGroupDetail[arr[i].field[1]] != undefined
          ) {
            field = customGroupDetail[arr[i].field[1]];
          } else if (
            customGroupDetail[arr[i].field[0]] != undefined &&
            customGroupDetail[arr[i].field[1]] != undefined
          ) {
            field =
              customGroupDetail[arr[i].field[0]] ||
              customGroupDetail[arr[i].field[1]];
          }
        } else {
          field = customGroupDetail[arr[i].field[0]];
        }
        if (field !== null && field !== undefined && field !== '') {
          arr[i].ifChecked = true;
        }
      }
      if (!(customerLevel && customerLevel.length)) {
        arr[4].ifChecked = false;
      }
      this.setArr({ field: 'arr', value: arr });
    }
  };

  deleteCustomGroup = async (id) => {
    const { res } = (await webapi.deleteCustomGroup(id)) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.onTabChange({ key: '2' });
    } else {
      message.error(res.message);
    }
  };

  openModal = (modalType) => {
    this.toggleModal();
    this.dispatch('change:modalType', modalType);
  };

  clearAreaIds = () => {
    this.dispatch('set:state', { field: 'areaIds', value: [] });
  };

  setArr = ({ field, value }) => {
    this.dispatch('set:state:im', { field, value });
  };

  clearForm = () => {
    this.dispatch('set:state:im', {
      field: 'form',
      value: {
        groupName: null,
        regionList: [],
        lastTradeTime: null,
        tradeCountTime: null,
        gender: null,
        ltAge: null,
        gtAge: null,
        ltAdmissionTime: null,
        gtAdmissionTime: null,
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
      }
    });
  };

  clearArr = () => {
    this.dispatch('set:state:im', {
      field: 'arr',
      value: [
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
          field: ['area']
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
      ]
    });
  };

  setData = (field, value) => {
    this.dispatch('set:state', { field, value });
  };

  setDataIm = (field, value) => {
    this.dispatch('set:state:im', { field, value });
  };

  /**
   * 短信发送弹窗
   * @param groupId
   */
  setSmsModal = async () => {
    await this.getPassedSignList();
    await this.getSignList();
    await this.getSalePassedTemplateList();
    let sendModalVisible = this.state().get('sendModalVisible');
    if (sendModalVisible == false) {
      this.setData('sendModalVisible', true);
    } else {
      this.setData('sendModalVisible', false);
    }
  };

  setGroupSmsInfo = async (groupData) => {
    this.dispatch('set:state', {
      field: 'sendGroupId',
      value: groupData.groupId
    });
    this.dispatch('set:state', {
      field: 'sendGroupName',
      value: groupData.sendGroupName
    });
    this.dispatch('set:state', {
      field: 'sendGroupCustomerNum',
      value: groupData.customerNum
    });
    this.dispatch('set:state', {
      field: 'sendGroupType',
      value: groupData.sendGroupType
    });
  };

  getPassedSignList = async () => {
    const { res } = (await webapi.smsSignPage({
      reviewStatus: 1,
      pageNum: 0,
      pageSize: 100
    })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('set:state:im', {
        field: 'passedSignList',
        value: res.context.smsSignVOPage.content
      });
    }
  };

  getSignList = async (pageNum?: number, pageSize?: number) => {
    const { res } = (await webapi.smsSignPage({
      pageNum: pageNum || 0,
      pageSize: pageSize || 10
    })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('set:state', {
        field: 'signatureList',
        value: res.context.smsSignVOPage.content
      });
      this.dispatch('set:state', {
        field: 'total',
        value: res.context.smsSignVOPage.total
      });
      this.dispatch('set:state', {
        field: 'pageNum',
        value: pageNum + 1
      });
    }
  };

  getSalePassedTemplateList = async () => {
    const { res } = (await webapi.smsTemplatePage({
      templateType: 2,
      reviewStatus: 1,
      pageNum: 0,
      pageSize: 100
    })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('set:state:im', {
        field: 'salePassedTemplateList',
        value: res.context.smsTemplateVOPage.content
      });
    }
  };

  //@ts-ignore
  setState = (params) => {
    const keys = Object.keys(params);
    for (let key of keys) {
      this.setData(key, params[key]);
    }
  };

  //@ts-ignore
  setStateIm = (params) => {
    const keys = Object.keys(params);
    for (let key of keys) {
      this.setDataIm(key, params[key]);
    }
  };

  smsSend = async (values) => {
    const { context, manualAdd, templateCode, signId } = values;

    let smsNum = this.state().get('smsNum');
    let total = this.state().get('sendGroupCustomerNum');
    let sendGroupType = this.state().get('sendGroupType');
    let sendGroupId = this.state().get('sendGroupId');

    if (total === 0) {
      message.error('该人群人数为零，请重新选择人群！');
      return;
    }

    let receiveValue = sendGroupType + '_' + sendGroupId;

    let params: any = {
      context,
      receiveType: 2,
      sendType: 0,
      manualAdd,
      receiveValue: receiveValue,
      templateCode,
      signId,
      rowCount: smsNum * total
    };
    const { res } = (await webapi.smsSendAdd(params)) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('短信发送成功');
      this.setData('sendModalVisible', false);
      this.clearSendModal();
      this.init();
    } else {
      message.error(res.message);
      this.setData('templateCode', '');
    }
  };

  clearSendModal = () => {
    this.setStateIm({
      ifManualAdd: false,
      customerTotal: 0,
      customerLevel: [],
      rfmGroup: [],
      sendForm: {
        signId: null,
        templateCode: null,
        context: '',
        manualAdd: null,
        receiveType: 0,
        receiveValue: [],
        receiveValueList: [],
        sendTime: null,
        sendType: 0
      },
      selectedCustomerList: [],
      smsNum: 1,
      ifEdit: false
    });
  };
}
