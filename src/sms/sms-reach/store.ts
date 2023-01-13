import { message } from 'antd';
import { IOptions, Store } from 'plume2';
import SMSReachActor from './actor/sms-reach-actor';
import * as webapi from './webapi';
import { Const } from 'qmkit';
import moment from 'moment';
export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new SMSReachActor()];
  }

  onFormFieldChange = ({ field, value }) => {
    this.dispatch('form:field', { field, value });
  };

  setData = (field, value) => {
    this.dispatch('set:state', { field, value });
  };

  init = (key) => {
    this.getSMSSettingList();
    this.initList(key);

    this.getlevelList();
    this.getCustomerList();
    this.getRFMGroupList();
  };

  getTaskList = async (params?) => {
    let pageNum = 0;
    let status = null;
    if (params) {
      pageNum = params.pageNum;
      status = params.status;
    }
    const { res } = (await webapi.smsSendPage({
      pageNum: pageNum,
      pageSize: 10,
      status
    })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('set:state', {
        field: 'taskList',
        value: res.context.smsSendVOPage.content
      });
      this.dispatch('set:state', {
        field: 'total',
        value: res.context.smsSendVOPage.total
      });
      this.dispatch('set:state', {
        field: 'pageNum',
        value: pageNum + 1
      });
    }
  };

  getlevelList = async () => {
    const { res } = (await webapi.customerLevelList()) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('set:state', {
        field: 'levelList',
        value: res.context.customerLevelVOList
      });
    }
  };

  getRFMGroupList = async () => {
    const { res } = (await webapi.rfmGroupList()) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('set:state', {
        field: 'rfmGroupList',
        value: res.context
      });
    }
  };

  getCustomerList = async (customerAccount?) => {
    const { res } = (await webapi.customerList({
      pageNum: 0,
      pageSize: 10,
      delFlag: 0,
      customerAccount
    })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('set:state', {
        field: 'customerList',
        value: res.context.detailResponseList
      });
    }
  };

  initList = (key) => {
    this.setState({
      pageNum: 0,
      pageSize: 10,
      total: 0
    });
    if (key === 'template') {
      this.getTemplateList();
    } else if (key === 'sign') {
      this.getSignList();
    } else if (key === 'task') {
      this.getTaskList();
    }
  };

  changeTab = async (value) => {
    this.setState({
      pageNum: 0,
      pageSize: 10,
      total: 0,
      templateType: value
    });
    this.getTemplateList();
  };

  getTemplateList = async (
    templateCode?,
    templateName?,
    reviewStatus?,
    pageNum?,
    pageSize?
  ) => {
    const templateType = this.state().get('templateType');
    const { res } = (await webapi.smsTemplatePage({
      templateCode,
      templateName,
      reviewStatus,
      templateType,
      pageNum: pageNum || 0,
      pageSize: pageSize || 10
    })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('set:state', {
        field: 'templateList',
        value: res.context.smsTemplateVOPage.content
      });
      this.dispatch('set:state', {
        field: 'total',
        value: res.context.smsTemplateVOPage.total
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
      this.dispatch('set:state', {
        field: 'salePassedTemplateList',
        value: res.context.smsTemplateVOPage.content
      });
    }
  };

  getPassedSignList = async () => {
    const { res } = (await webapi.smsSignPage({
      reviewStatus: 1,
      pageNum: 0,
      pageSize: 100
    })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('set:state', {
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

  deleteTemplate = async (id) => {
    const { res } = (await webapi.smsTemplateDelete(id)) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('删除成功');
      this.getTemplateList();
    } else {
      message.error(res.message);
    }
  };

  deleteSign = async (id) => {
    const { res } = (await webapi.smsSignDelete(id)) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('删除成功');
      this.getSignList();
    } else {
      message.error(res.message);
    }
  };

  getSMSSettingList = async () => {
    const { res } = (await webapi.smsSettingList({
      pageNum: 0,
      pageSize: 100
    })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('set:state', {
        field: 'smsSettingList',
        value: res.context.smsSettingVOList
      });
    }
  };

  updateSetting = async (value) => {
    const id = this.state().get('settingId');
    const { res } = (await webapi.smsSettingModify({
      ...value,
      status: +value.status,
      id
    })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('修改成功');
      this.setData('interfaceModalVisible', false);
      this.getSMSSettingList();
    } else {
      message.error(res.message);
    }
  };

  onFormChange = ({ field, value }) => {
    this.dispatch('form:field', { field, value });
  };

  smsSend = async (values) => {
    const {
      context,
      receiveType,
      sendType,
      customerLevel,
      rfmGroup,
      manualAdd,
      sendTime,
      templateCode,
      signId
    } = values;

    let smsNum = this.state().get('smsNum');
    let customerTotal = this.state().get('customerTotal');
    let manualCustomer = this.state().get('manualCustomer');
    let total = customerTotal + manualCustomer;

    if (total === 0) {
      message.error('接收人数不能为零，请至少选择一个号码');
      return;
    }

    let receiveValue = null;
    if (receiveType === 1) {
      receiveValue = customerLevel.join(',');
    } else if (receiveType === 2) {
      receiveValue = rfmGroup.join(',');
    } else if (receiveType === 3) {
      const customerList = this.state()
        .get('selectedCustomerList')
        .toJS();
      receiveValue = customerList
        .map((item) => {
          return item.customerAccount + ':' + item.customerName;
        })
        .join(',');
    }

    let params: any = {
      context,
      receiveType,
      sendType,
      manualAdd,
      receiveValue,
      templateCode,
      signId,
      rowCount: smsNum * total
    };
    if (sendType === 1) {
      params = {
        ...params,
        sendTime: moment(sendTime).format('YYYY-MM-DD HH:mm:ss')
      };
    }

    if (this.state().get('ifEdit')) {
      const id = this.state().get('taskId');
      const sendForm = this.state()
        .get('sendForm')
        .toJS();
      const { res } = (await webapi.smsSendUpdate({
        ...sendForm,
        ...params,
        id
      })) as any;
      if (res.code === Const.SUCCESS_CODE) {
        message.success('修改成功');
        this.setData('sendModalVisible', false);
        this.clearSendModal();
        this.getTaskList();
      } else {
        message.error(res.message);
      }
    } else {
      const { res } = (await webapi.smsSendAdd(params)) as any;
      if (res.code === Const.SUCCESS_CODE) {
        message.success('新增成功');
        this.setData('sendModalVisible', false);
        this.clearSendModal();
        this.getTaskList();
      } else {
        message.error(res.message);
        this.setData('templateCode', '');
      }
    }
  };

  clearSendModal = () => {
    this.setState({
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

  initSendSettingForm = async (taskId?) => {
    this.getPassedSignList();
    this.getSalePassedTemplateList();
    if (taskId) {
      this.setData('taskId', taskId);
      this.setData('ifEdit', true);
      const {
        res: {
          code,
          context: { smsSendVO }
        }
      } = (await webapi.smsSendDetail(taskId)) as any;
      if (code === Const.SUCCESS_CODE) {
        this.setData('sendForm', smsSendVO);
        const { receiveType, receiveValueList, receiveValue } = smsSendVO;
        if (receiveType === 1 && receiveValue) {
          this.setData('customerLevel', receiveValue.split(','));
        } else if (receiveType === 2 && receiveValue) {
          this.setData('rfmGroup', receiveValue.split(','));
        } else if (receiveType === 3 && receiveValueList) {
          this.setData(
            'selectedCustomerList',
            receiveValueList.map((item) => {
              let { account, name } = item;
              return { customerAccount: account, customerName: name };
            })
          );
        }
        this.setData('ifManualAdd', smsSendVO.manualAdd !== null);

        let smsNum = this.getLength(smsSendVO.context);
        this.setData('smsNum', smsNum);
        let manualCustomer =
          smsSendVO.manualAdd && smsSendVO.manualAdd.length > 0
            ? smsSendVO.manualAdd.match(/([0-9]+;?)/g).length
            : 0;
        this.setData(
          'customerTotal',
          smsSendVO.rowCount / smsNum - manualCustomer
        );
        this.setData('manualCustomer', manualCustomer);
      }
    } else {
      this.getCustomerTotal();
    }
  };

  getLength = (context) => {
    return context.length <= 70 ? 1 : Math.ceil(context.length / 67);
  };

  syncHistoryTemplate = async (templateCodeList) => {
    const { res } = (await webapi.smsTemplateSyncHistory({
      templateCodeList: templateCodeList.split(';')
    })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('同步历史模板成功');
      this.setData('syncModalVisible', false);
      this.getTemplateList();
    }
  };

  syncHistorySign = async (signNameList) => {
    const { res } = (await webapi.smsSignSyncHistory({
      signNameList: signNameList.split(';')
    })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('同步历史签名成功');
      this.setData('syncModalVisible', false);
      this.getSignList();
    }
  };

  syncSign = async () => {
    const { res } = (await webapi.smsSignSync()) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('同步签名成功');
      this.getSignList();
    } else {
      message.error(res.message);
    }
  };

  syncTemplate = async () => {
    const { res } = (await webapi.smsTemplateSync()) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('同步模板成功');
      this.getTemplateList();
    } else {
      message.error(res.message);
    }
  };

  //@ts-ignore
  setState = (params) => {
    const keys = Object.keys(params);
    for (let key of keys) {
      this.setData(key, params[key]);
    }
  };

  getCustomerTotal = async (params?) => {
    let customerLevel = '';
    let rfmGroup = '';
    this.setData('customerTotal', 0);
    if (params) {
      customerLevel = params.customerLevel;
      rfmGroup = params.rfmGroup;
    }
    const receiveType = this.state()
      .get('sendForm')
      .get('receiveType');
    if (receiveType === 0) {
      const {
        res: { code, context }
      } = (await webapi.customerPage({
        pageNum: 0,
        pageSize: 1
      })) as any;
      if (code === Const.SUCCESS_CODE) {
        this.setData('customerTotal', context.total);
      }
    } else if (receiveType === 1 && customerLevel) {
      const {
        res: { code, context }
      } = (await webapi.customerQuery({
        levelIds: customerLevel
      })) as any;
      if (code === Const.SUCCESS_CODE) {
        this.setData('customerTotal', context);
      }
    } else if (receiveType === 2 && rfmGroup) {
      const { res } = (await webapi.customerTotal(rfmGroup)) as any;
      if (res.code === Const.SUCCESS_CODE) {
        this.setData('customerTotal', res.context);
      }
    }
  };

  submitTemplate = async (id) => {
    const { res } = (await webapi.smsTemplateUpload(id)) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('提交备案成功');
      this.getTemplateList();
    } else {
      message.error(res.message);
      const funs = this.state().get('formFunctions');
      funs.setFields({
        signId: { value: [], error: [new Error('请选择签名')] },
        tempalateCode: { value: [], error: [new Error('请选择模板')] }
      });
    }
  };

  deleteTask = async (id) => {
    const { res } = (await webapi.smsSendDelete(id)) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('删除成功');
      this.getTaskList();
    } else {
      message.error(res.message);
    }
  };

  changeOpenFlag = async (id, openFlag) => {
    const { res } = (await webapi.changeOpenFlag({
      id: id,
      openFlag: openFlag
    })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      if (openFlag) {
        message.success('开启成功');
      } else {
        message.success('关闭成功');
      }
      const pageNum = this.state().get('pageNum');
      this.getTemplateList(null, null, null, pageNum - 1, null);
    } else {
      message.error(res.message);
    }
  };
}
