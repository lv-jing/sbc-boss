import { Action, Actor } from 'plume2';
import { fromJS } from 'immutable';

export default class PushActor extends Actor {
  defaultState() {
    return {
      crmFlag: false,
      pushPage: {
        //当前的数据总数
        total: 0,
        //当前的分页条数
        pageSize: 10,
        //当前页
        pageNum: 1
      },

      noticePage: {
        //当前的数据总数
        total: 0,
        //当前的分页条数
        pageSize: 10,
        //当前页
        pageNum: 1
      },

      //推送任务列表
      pushList: [],
      //通知类列表
      noticeList: [],
      // 友盟设置弹窗是否显示
      isPushModal: false,
      // 友盟push接口设置参数
      uPushForm: {
        id: null,
        androidKeyId: null,
        androidMsgSecret: null,
        androidKeySecret: null,
        iosKeyId: null,
        iosKeySecret: null
      },

      // 发送时间类型
      pushType: 0,
      imageUrl: null,
      // 创建推送任务弹窗
      sendModalVisible: false,
      //消息推送id
      taskId: '',
      // 创建消息推送
      uPushSendForm: {
        // 预计发送人数
        expectedSendCount: 0,
        // 消息内容
        msgContext: '',
        // 消息封面图片
        msgImg: '',
        // 消息名称
        msgName: '',
        // 消息接受人 0:全部会员 1:按会员等级 2:按标签 3:按人群 4:指定会员
        msgRecipient: 0,
        // 等级、标签、人群ID。逗号分割
        msgRecipientDetail: '',
        // 点击消息跳转的页面路由
        msgRouter: '',
        // 消息标题
        msgTitle: '',
        // 推送时间
        pushTime: null
      },

      // 通知类推送弹窗
      nodeModalVisible: false,
      //通知类推送id
      nodeId: '',
      // 用于拼接nodeContext 必须用这个拼接参数
      nodeContext: '',
      // 通知类推送表单
      uPushNodeForm: {
        id: null,
        // 节点code
        nodeCode: 0,
        // 通知内容
        nodeContext: null,
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
  //
  // @Action('set:state')
  // setState(state, { field, value }) {
  //   return state.set(field, fromJS(value));
  // }

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

  @Action('change:data')
  changeDate(state, { index, value }) {
    return state.updateIn(['noticeList', index, 'status'], () => value);
  }

  @Action('data:push:init')
  pushListInit(state, res) {
    return state
      .setIn(['pushPage', 'total'], res.context.pushSendVOPage.total)
      .setIn(['pushPage', 'pageSize'], res.context.pushSendVOPage.size)
      .setIn(['pushPage', 'pageNum'], res.context.pushSendVOPage.number + 1)
      .set('pushList', fromJS(res.context.pushSendVOPage.content));
  }

  @Action('data:notice:init')
  noticeListInit(state, res) {
    return state
      .setIn(['noticePage', 'total'], res.context.pushSendNodeVOPage.total)
      .setIn(['noticePage', 'pageSize'], res.context.pushSendNodeVOPage.size)
      .setIn(
        ['noticePage', 'pageNum'],
        res.context.pushSendNodeVOPage.number + 1
      )
      .set('noticeList', fromJS(res.context.pushSendNodeVOPage.content));
  }

  
  @Action('crmFlag:init')
  crmFlagInit(state, data) {
   return state.set('crmFlag', data);
  }
}
