import { IOptions, Store } from 'plume2';
import PushActor from './actor/push-actor';
import * as webapi from './webapi';
import { Const } from 'qmkit';
import { message } from 'antd';
import moment from 'moment';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new PushActor()];
  }

  onFormNodeChange = ({ field, value }) => {
    this.dispatch('formNode:field', { field, value });
  };

  onFormFieldChange = ({ field, value }) => {
    this.dispatch('form:field', { field, value });
  };

  //@ts-ignore
  setState = (params) => {
    const keys = Object.keys(params);
    for (let key of keys) {
      this.setData(key, params[key]);
    }
  };

  setData = (field, value) => {
    this.dispatch('set:state', { field, value });
  };

  init = async (key) => {
    await this.initUmengSetting();

    this.initList(key);

    this.getlevelList();
    this.getCustomerList();
    const { res } = await webapi.crmFlag();
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('crmFlag:init', res.context.crmFlag);
      if (res.context.crmFlag) {
        this.rfmGroupSearch('');
      }
    }
  };

  // 初始化友盟设置
  initUmengSetting = async () => {
    const { res } = (await webapi.getConfig()) as any;
    if (res.code === Const.SUCCESS_CODE) {
      const {
        id,
        androidKeyId,
        androidMsgSecret,
        androidKeySecret,
        iosKeyId,
        iosKeySecret
      } = res.context.umengPushConfigVO;
      this.setData('uPushForm', {
        id,
        androidKeyId,
        androidMsgSecret,
        androidKeySecret,
        iosKeyId,
        iosKeySecret
      });
    } else {
      message.error(res.message);
    }
  };

  initList = async (key) => {
    this.setState({
      pageNum: 0,
      pageSize: 10,
      total: 0
    });
    if (key === 'push') {
      await this.getPushList();
    } else if (key === 'notice') {
      await this.getNoticeList();
    }
  };

  // 初始化推送任务列表
  getPushList = async (params?) => {
    let pageNum = 0;
    let msgName = null;
    let pageSize;
    if (params) {
      pageNum = params.pageNum;
      msgName = params.msgName;
      pageSize = params.pageSize;
    }
    const { res } = (await webapi.pushListPage({
      pageNum: pageNum || 0,
      pageSize: pageSize || 10,
      msgName
    })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('data:push:init', res);
    }
  };

  // 初始化通知内推送列表
  getNoticeList = async (params?) => {
    let pageNum = 0;
    let nodeName = null;
    let pageSize;
    if (params) {
      pageNum = params.pageNum;
      nodeName = params.nodeName;
      pageSize = params.pageSize;
    }
    const { res } = (await webapi.noticeListPage({
      pageNum: pageNum || 0,
      pageSize: pageSize || 10,
      nodeName
    })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('data:notice:init', res);
    }
  };

  // 通知节点开关
  changeSwitch = async ({ id, index, flag }) => {
    flag = flag == true ? 1 : 0;
    const { res } = await webapi.changeSwitch(id, flag);
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('change:data', { index: index, value: flag });
      message.success('操作成功');
    }
  };

  // 保存设置
  saveSetting = async (value) => {
    const { res } = (await webapi.UmengpushconfigAdd(value)) as any;
    if (res.code === Const.SUCCESS_CODE) {
      const {
        id,
        androidKeyId,
        androidMsgSecret,
        androidKeySecret,
        iosKeyId,
        iosKeySecret
      } = res.context.umengPushConfigVO;
      this.setData('uPushForm', {
        id,
        androidKeyId,
        androidMsgSecret,
        androidKeySecret,
        iosKeyId,
        iosKeySecret
      });
      message.success('设置成功');
      this.setData('isPushModal', false);
    } else {
      message.error(res.message);
    }
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

  // 等级列表
  getlevelList = async () => {
    const { res } = (await webapi.customerLevelList()) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('set:state', {
        field: 'levelList',
        value: res.context.customerLevelVOList
      });
    }
  };

  // crm人群
  getRFMGroupList = async () => {
    const { res } = (await webapi.rfmGroupList()) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('set:state', {
        field: 'rfmGroupList',
        value: res.context
      });
    }
  };

  // 会员列表
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

  changeTab = async (value) => {
    this.setState({
      pageNum: 0,
      pageSize: 10,
      total: 0,
      templateType: value
    });
  };

  editNodeModal = async (values) => {
    const {
      // id,
      // nodeCode,
      // nodeContext,
      nodeName,
      nodeTitle
      // status
    } = values;

    let p = 0;
    for (let i in values) {
      if (i !== 'nodeName' && i !== 'nodeTitle') {
        p = p + values[i].length;
      }
    }
    if (p > 100) {
      message.error('消息内容最多可输入100字，请调整后重新提交');
      return;
    }

    let nodeId = this.state().get('nodeId');
    let nodeContext =
      this.state().get('nodeContext') &&
      this.state()
        .get('nodeContext')
        .toJS();

    // if(nodeContext && nodeContext.join('').length > 100){
    //   message.error('消息内容最多可输入100字，请调整后重新提交');
    //   return
    // }

    let params: any = {
      id: nodeId,
      nodeContext: nodeContext && nodeContext.join(''),
      nodeName,
      nodeTitle
    };

    if (nodeId) {
      const { res } = (await webapi.modifyPushNode({
        ...params
      })) as any;
      if (res.code === Const.SUCCESS_CODE) {
        message.success('修改成功');
        this.setData('nodeModalVisible', false);
        this.clearNodeModal();
        this.getNoticeList();
      } else {
        message.error(res.message);
      }
    }
  };
  // 初始化通知节点弹窗
  initNodeForm = async (nodeId) => {
    this.setData('nodeId', nodeId);
    const { res } = (await webapi.pushNodeDetail(nodeId)) as any;
    if (res.code === Const.SUCCESS_CODE) {
      let pushSendNodeVO = res.context.pushSendNodeVO;
      let nodeContext = pushSendNodeVO.nodeContext;
      this.setData('uPushNodeForm', pushSendNodeVO);
      this.setData('nodeContext', nodeContext && nodeContext.split(/({.*?})/));
    }
  };
  //清除初始化通知节点弹窗
  clearNodeModal = () => {
    this.setState({
      uPushSendForm: {
        id: null,
        nodeCode: 0,
        nodeContext: null,
        nodeName: '',
        nodeTitle: '',
        status: ''
      },
      nodeId: false,
      nodeContext: null
    });
  };

  //创建推送任务
  createPushTasks = async (values) => {
    const {
      msgName,
      msgTitle,
      msgContext,
      msgRecipient,
      pushTime,
      customerLevel,
      rfmGroup
    } = values;

    let dataInfo =
      this.state().get('dataInfo') &&
      this.state()
        .get('dataInfo')
        .toJS();
    if (
      !(
        dataInfo.info.name !== undefined ||
        dataInfo.info.storeName !== undefined ||
        dataInfo.info.pathName !== undefined ||
        dataInfo.info.title !== undefined ||
        (dataInfo.info.goodsInfo &&
          dataInfo.info.goodsInfo.goodsInfoName !== undefined) ||
        (dataInfo.info.goods && dataInfo.info.goods.goodsName !== undefined) ||
        dataInfo.info.marketingName !== undefined
      )
    ) {
      dataInfo = null;
    }

    let customerTotal = this.state().get('customerTotal');
    if (customerTotal === 0) {
      message.error('接收人数不能为零，请至少选择一个接收人');
      return;
    }

    let receiveValue = null;
    if (msgRecipient === 1) {
      receiveValue = customerLevel.join(',');
    } else if (msgRecipient === 3) {
      receiveValue = rfmGroup.join(',');
    } else if (msgRecipient === 4) {
      const customerList = this.state()
        .get('selectedCustomerList')
        .toJS();
      receiveValue = customerList
        .map((item) => {
          return item.customerId;
        })
        .join(',');
    }

    let imageUrl;
    const url = this.state().get('imageUrl');
    if (url && !url.isEmpty()) {
      imageUrl =
        this.state().get('imageUrl') &&
        this.state()
          .get('imageUrl')
          .toJS()[0].url;
    }

    let params: any = {
      msgName: msgName,
      msgTitle: msgTitle,
      msgContext: msgContext,
      msgImg: imageUrl,
      msgRecipient: msgRecipient,
      msgRecipientDetail: receiveValue,
      msgRouter: dataInfo ? JSON.stringify(dataInfo).replace(/\"/g, "'") : null,
      pushTime: pushTime && moment(pushTime).format('YYYY-MM-DD HH:mm:ss')
    };

    if (this.state().get('ifEdit')) {
      const id = this.state().get('taskId');
      const { res } = (await webapi.pushSendModify({
        ...params,
        id
      })) as any;
      if (res.code === Const.SUCCESS_CODE) {
        message.success('修改成功');
        this.setData('sendModalVisible', false);
        this.clearPushModal();
        this.getPushList();
      } else {
        message.error(res.message);
      }
    } else {
      let { res } = await webapi.pushSendAdd(params);
      if (res.code === Const.SUCCESS_CODE) {
        message.success('新增成功');
        this.setData('sendModalVisible', false);
        this.clearPushModal();
        this.getPushList();
      } else {
        message.error(res.message);
      }
    }
  };

  initPushTaskForm = async (taskId?) => {
    if (taskId) {
      this.setData('taskId', taskId);
      this.setData('ifEdit', true);
      const { res } = (await webapi.pushSendDetail(taskId)) as any;
      if (res.code === Const.SUCCESS_CODE) {
        let pushSendVO = res.context.pushSendVO;
        let imageUrl = pushSendVO.msgImg && [
          {
            uid: 1,
            name: '1',
            size: 1,
            status: 'done',
            url: pushSendVO.msgImg
          }
        ];
        let msgRouter =
          pushSendVO.msgRouter &&
          pushSendVO.msgRouter.replace(/\'/g, '\\"').replace(/\\/g, '');
        let dataInfo = JSON.parse(msgRouter)
          ? JSON.parse(msgRouter)
          : { linkKey: 'goodsList', info: {} };
        this.setData('pushType', pushSendVO.pushTime ? 1 : 0);
        this.setData('uPushSendForm', pushSendVO);
        this.setData('imageUrl', imageUrl);
        this.setData('dataInfo', dataInfo);
        let msgRecipient = pushSendVO.msgRecipient;
        let msgRecipientDetail = pushSendVO.msgRecipientDetail;
        let msgRecipientValue =
          msgRecipientDetail && msgRecipientDetail.split(',');
        if (msgRecipient === 1 && msgRecipientDetail) {
          this.setData('customerLevel', msgRecipientValue);
          this.getCustomerTotal({ customerLevel: msgRecipientValue });
        } else if (msgRecipient === 3 && msgRecipientDetail) {
          this.setData('rfmGroup', msgRecipientValue);
          this.getCustomerTotal({ rfmGroup: msgRecipientValue });
        } else if (msgRecipient === 4 && msgRecipientDetail) {
          this.setData(
            'selectedCustomerList',
            msgRecipientValue.map((item, k) => {
              return {
                customerAccount: pushSendVO.accountList[k],
                customerName: pushSendVO.msgRecipientNames[k],
                customerId: item
              };
            })
          );
          this.setData('customerTotal', msgRecipientValue.length);
        } else {
          this.getCustomerTotal();
        }
      }
    } else {
      this.getCustomerTotal();
    }
  };

  clearPushModal = () => {
    this.setState({
      customerTotal: 0,
      customerLevel: [],
      rfmGroup: [],
      pushType: 0,
      uPushSendForm: {
        expectedSendCount: 0,
        msgContext: '',
        msgImg: '',
        msgName: '',
        msgRecipient: 0,
        msgRecipientDetail: '',
        msgRouter: '',
        msgTitle: '',
        pushType: 0,
        pushTime: null
      },
      imageUrl: null,
      selectedCustomerList: [],
      ifEdit: false,
      dataInfo: {
        linkKey: 'goodsList',
        info: {}
      }
    });
  };

  getCustomerTotal = async (params?) => {
    let customerLevel = '';
    let rfmGroup = '';
    this.setData('customerTotal', 0);
    if (params) {
      customerLevel = params.customerLevel;
      rfmGroup = params.rfmGroup;
    }
    const msgRecipient = this.state()
      .get('uPushSendForm')
      .get('msgRecipient');
    if (msgRecipient === 0) {
      const {
        res: { code, context }
      } = (await webapi.customerPage({
        pageNum: 0,
        pageSize: 1
      })) as any;
      if (code === Const.SUCCESS_CODE) {
        this.setData('customerTotal', context.total);
      }
    } else if (msgRecipient === 1 && customerLevel) {
      const {
        res: { code, context }
      } = (await webapi.customerQuery({
        levelIds: customerLevel
      })) as any;
      if (code === Const.SUCCESS_CODE) {
        this.setData('customerTotal', context);
      }
    } else if (msgRecipient === 3 && rfmGroup) {
      const { res } = (await webapi.customerTotal(rfmGroup)) as any;
      if (res.code === Const.SUCCESS_CODE) {
        this.setData('customerTotal', res.context);
      }
    }
  };

  deleteTask = async (id) => {
    const { res } = (await webapi.pushSendDelete(id)) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('删除成功');
      await this.getPushList();
    } else {
      message.error(res.message);
    }
  };

  onDataChange = (pathArray, newVal, platFormValueMap) => {
    let param = {
      linkKey: platFormValueMap.linkKey,
      info: null
    };
    if (platFormValueMap.linkKey === 'goodsList') {
      param.info = {
        skuId: platFormValueMap.info.skuId,
        name: platFormValueMap.info.name
      };
    } else if (platFormValueMap.linkKey === 'storeList') {
      param.info = {
        storeId: platFormValueMap.info.storeId,
        storeName: platFormValueMap.info.storeName
      };
    } else if (platFormValueMap.linkKey === 'categoryList') {
      param.info = {
        selectedKeys: platFormValueMap.info.selectedKeys,
        pathName: platFormValueMap.info.pathName,
        cateId: platFormValueMap.info.cataId,
        cateName: platFormValueMap.info.name
      };
    } else if (platFormValueMap.linkKey === 'pageList') {
      param.info = {
        _id: platFormValueMap.info._id,
        title: platFormValueMap.info.title,
        pageCode: platFormValueMap.info.pageCode,
        pageType: platFormValueMap.info.pageType
      };
    } else if (platFormValueMap.linkKey === 'userpageList') {
      param.info = {
        key: platFormValueMap.info.key,
        title: platFormValueMap.info.title,
        wechatPath: platFormValueMap.info.wechatPath,
        appPath: platFormValueMap.info.appPath
      };
    } else if (platFormValueMap.linkKey === 'promotionList') {
      let cateKey = platFormValueMap.info.cateKey;
      if (cateKey === 'groupon') {
        param.info = {
          goodsInfo: {
            goodsInfoName: platFormValueMap.info.goodsInfo.goodsInfoName
          },
          grouponActivityId: platFormValueMap.info.grouponActivityId,
          goodsInfoId: platFormValueMap.info.goodsInfoId,
          cateKey: cateKey
        };
      } else if (cateKey === 'flash') {
        param.info = {
          goods: {
            goodsName: platFormValueMap.info.goods.goodsName
          },
          goodsInfoId: platFormValueMap.info.goodsInfoId,
          id: platFormValueMap.info.id,
          cateKey: cateKey
        };
      } else {
        param.info = {
          marketingName: platFormValueMap.info.marketingName,
          marketingId: platFormValueMap.info.marketingId,
          cateKey: cateKey
        };
      }
    }
    this.setData('dataInfo', param);
    // console.log(param);
    // console.log(platFormValueMap);
  };

  rfmGroupSearch = async (name) => {
    const { res } = (await webapi.rfmGroupSearch({
      groupName: name,
      limit: 10
    })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('set:state', {
        field: 'rfmGroupList',
        value: res.context
      });
    }
  };
}
