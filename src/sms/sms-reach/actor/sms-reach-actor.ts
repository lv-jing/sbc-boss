import { Action, Actor } from 'plume2';
import { fromJS } from 'immutable';

export default class SMSReachActor extends Actor {
  defaultState() {
    return {
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前页
      pageNum: 1,
      //任务列表
      taskList: [],
      //营销类短信模板列表
      templateList: [],
      //验证码类短信模板列表
      //短信签名列表
      signatureList: [],
      interfaceFormData: {
        accessKeyId: '',
        accessKeySecret: '',
        status: 0
      },
      interfaceModalVisible: false,
      sendModalVisible: false,
      levelList: [],
      smsSettingList: [],
      settingId: '',
      salePassedTemplateList: [],
      passedSignList: [],
      templateType: 2,
      rfmGroupList: [],
      customerList: [],
      contactPhoneList: [],
      ifEdit: false,
      taskId: '',
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
      ifManualAdd: false,
      customerTotal: 0,
      customerLevel: [],
      rfmGroup: [],
      ifModify: true,
      smsNum: 1,
      syncModalVisible: false,
      syncType: 1,
      formFunctions: null,
      manualCustomer: 0
    };
  }

  @Action('form:field')
  formFiledChange(state, { field, value }) {
    return state.setIn(['sendForm', field], fromJS(value));
  }

  @Action('set:state')
  setState(state, { field, value }) {
    return state.set(field, fromJS(value));
  }
}
