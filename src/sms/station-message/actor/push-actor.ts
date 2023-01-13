import { Action, Actor } from 'plume2';
import { fromJS } from 'immutable';

export default class PushActor extends Actor {
  defaultState() {
    return {
      crmFlag: false,
      isPushModal: false,

      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前页
      pageNum: 1,
      //发送任务列表
      taskList: [],
      //通知类站内信列表
      noticeList: [],

      // 发送时间类型
      pushType: 0,
      taskId: '',
      imageDefaultUrl: null,
      // 创建推送任务弹窗
      sendModalVisible: false,
      // 创建消息推送
      uPushSendForm: {
        messageId: null,
        // 消息内容
        content: '',
        // 消息封面图片
        imgUrl: '',
        // 消息名称
        name: '',
        // 消息接受人 0:全部会员 1:按会员等级 2:按标签 3:按人群 4:指定会员
        sendType: 0,
        // 等级、标签、人群ID。逗号分割
        joinIds: [],
        // 消息标题
        title: '',
        routeParams: '',
        // 推送时间
        sendTime: null,
        sendTimeType: 0,
        messageType: 0
      },

      // 通知类推送弹窗
      nodeModalVisible: false,
      //通知类推送id
      nodeId: '',
      // 用于拼接nodeContent 必须用这个拼接参数
      nodeContent: '',
      // 通知类推送表单
      uPushNodeForm: {
        id: null,
        // 节点code
        nodeCode: 0,
        // 通知内容
        nodeContent: null,
        // 节点名称
        nodeName: '',
        // 节点标题
        nodeTitle: '',
        // 状态
        status: ''
      },

      sendFormData: {
        customerLevel: []
      },
      interfaceModalVisible: false,
      levelList: [],
      settingId: '',
      rfmGroupList: [],
      customerList: [],
      contactPhoneList: [],
      ifEdit: false,

      selectedCustomerList: [],
      // 手动添加
      customerTotal: 0,
      customerLevel: [],
      rfmGroup: [],
      ifModify: true,

      linkHrefPath: [],
      dataInfo: {
        // 商品
        linkKey: 'goodsList',
        info: {}

        // 店铺
        // linkKey: 'storeList',
        // info: {}

        // 促销
        // linkKey: 'promotionList',
        // info: {}

        //类目
        // linkKey: "categoryList",
        // info: {selectedKeys: ["0", "571", "632", "674"]},

        //页面
        // linkKey: "pageList",
        // info: {_id: "5bd94b545358be6fd60de225"},

        // 常用功能
        // linkKey: "userpageList",
        // info: {key: "myHome"},
      }
    };
  }

  @Action('form:field')
  formFiledChange(state, { field, value }) {
    return state.setIn(['uPushSendForm', field], fromJS(value));
  }

  @Action('nodeForm:field')
  formNodeFiledChange(state, { field, value }) {
    return state.setIn(['uPushNodeForm', field], fromJS(value));
  }

  @Action('set:state')
  setState(state, { field, value }) {
    if (field == 'uPushNodeForm') {
      return state.update('uPushNodeForm', (uPushNodeForm) =>
        uPushNodeForm.merge(fromJS(value))
      );
    } else if (field == 'uPushSendForm') {
      return state.update('uPushSendForm', (uPushSendForm) =>
        uPushSendForm.merge(fromJS(value))
      );
    } else if (field == 'dataInfo') {
      return state.update('dataInfo', (dataInfo) =>
        dataInfo.merge(fromJS(value))
      );
    } else {
      return state.set(field, fromJS(value));
    }
  }

  @Action('crmFlag:init')
  crmFlagInit(state, data) {
    return state.set('crmFlag', data);
  }
}
