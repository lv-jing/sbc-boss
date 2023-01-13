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

  setData = (field, value) => {
    this.dispatch('set:state', { field, value });
  };

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

  init = async (key) => {
    await this.initList(key);

    this.getlevelList();
    this.getCustomerList();

    const { res } = await webapi.crmFlag();
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('crmFlag:init', res.context.crmFlag);
      if (res.context.crmFlag) {
        this.rfmGroupSearch(' ');
      }
    }
  };

  initList = async (key) => {
    this.setState({
      pageNum: 0,
      pageSize: 10,
      total: 0
    });
    if (key === 'task') {
      await this.getTaskList();
    } else if (key === 'notice') {
      await this.getNoticeList();
    }
  };

  getTaskList = async (params?) => {
    let pageNum = 0;
    let name = null;
    let pageSize;
    if (params) {
      pageNum = params.pageNum;
      name = params.name;
      pageSize = params.pageSize;
    }
    const { res } = (await webapi.taskListPage({
      pageNum: pageNum || 0,
      pageSize: pageSize || 10,
      name
    })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('set:state', {
        field: 'taskList',
        value: res.context.messageSendVOPage.content
      });
      this.dispatch('set:state', {
        field: 'total',
        value: res.context.messageSendVOPage.total
      });
      this.dispatch('set:state', {
        field: 'pageNum',
        value: pageNum + 1
      });
    } else {
      message.error(res.message);
    }
  };

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
      this.dispatch('set:state', {
        field: 'noticeList',
        value: res.context.messageSendNodeVOPage.content
      });
      this.dispatch('set:state', {
        field: 'total',
        value: res.context.messageSendNodeVOPage.total
      });
      this.dispatch('set:state', {
        field: 'pageNum',
        value: pageNum + 1
      });
    } else {
      message.error(res.message);
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

  changeTab = async (value) => {
    this.setState({
      pageNum: 0,
      pageSize: 10,
      total: 0,
      templateType: value
    });
  };

  //创建推送任务
  createPushTasks = async (values) => {
    const {
      name,
      title,
      content,
      sendType,
      sendTime,
      customerLevel,
      rfmGroup,
      sendTimeType
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
    let receiveValue = [];
    if (sendType === 1) {
      receiveValue = customerLevel;
    } else if (sendType === 3) {
      receiveValue = rfmGroup;
    } else if (sendType === 4) {
      const customerList = this.state()
        .get('selectedCustomerList')
        .toJS();
      receiveValue = customerList.map((v) => v.customerId);
    }

    let imgUrl;
    const url = this.state().get('imageDefaultUrl');
    if (url && !url.isEmpty()) {
      imgUrl =
        this.state().get('imageDefaultUrl') &&
        this.state()
          .get('imageDefaultUrl')
          .toJS()[0].url;
    }

    let params: any = {
      name: name,
      title: title,
      content: content,
      imgUrl: imgUrl,
      sendType: sendType,
      joinIds: receiveValue,
      routeParams: dataInfo
        ? JSON.stringify(dataInfo).replace(/\"/g, "'")
        : null,
      sendTime:
        sendTimeType === 0
          ? moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          : moment(sendTime).format('YYYY-MM-DD HH:mm:ss'),
      sendTimeType: sendTimeType,
      messageType: 0
    };

    if (this.state().get('ifEdit')) {
      const messageId = this.state().get('taskId');
      const { res } = (await webapi.pushSendModify({
        ...params,
        messageId
      })) as any;
      if (res.code === Const.SUCCESS_CODE) {
        message.success('修改成功');
        this.setData('sendModalVisible', false);
        this.clearPushModal();
        this.getTaskList();
      } else {
        message.error(res.message);
      }
    } else {
      let { res } = await webapi.pushSendAdd(params);
      if (res.code === Const.SUCCESS_CODE) {
        message.success('新增成功');
        this.setData('sendModalVisible', false);
        this.clearPushModal();
        this.getTaskList();
      } else {
        message.error(res.message);
      }
    }
  };

  editNodeModal = async (values) => {
    const {
      // id,
      // nodeCode,
      // nodeContent,
      nodeName,
      nodeTitle
      // status
    } = values;
    let nodeId = this.state().get('nodeId');

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

    let nodeContent =
      this.state().get('nodeContent') &&
      this.state()
        .get('nodeContent')
        .toJS();

    let params: any = {
      id: nodeId,
      nodeContent: nodeContent && nodeContent.join(''),
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
      let messageSendNodeVO = res.context.messageSendNodeVO;
      let nodeContent = res.context.messageSendNodeVO.nodeContent;
      this.setData('uPushNodeForm', messageSendNodeVO);
      this.setData('nodeContent', nodeContent && nodeContent.split(/({.*?})/));
    }
  };
  //清除初始化通知节点弹窗
  clearNodeModal = () => {
    this.setState({
      uPushSendForm: {
        id: null,
        nodeCode: 0,
        nodeContent: null,
        nodeName: '',
        nodeTitle: '',
        status: ''
      },
      nodeId: false,
      nodeContent: null
    });
  };

  initPushTaskForm = async (taskId?) => {
    if (taskId) {
      this.setData('taskId', taskId);
      this.setData('ifEdit', true);
      const { res } = (await webapi.pushSendDetail(taskId)) as any;
      if (res.code === Const.SUCCESS_CODE) {
        let messageSendVO = res.context.messageSendVO;
        let imageDefaultUrl = messageSendVO.imgUrl && [
          {
            uid: 1,
            name: '1',
            size: 1,
            status: 'done',
            url: messageSendVO.imgUrl
          }
        ];
        let routeParams =
          messageSendVO.routeParams &&
          messageSendVO.routeParams.replace(/\'/g, '\\"').replace(/\\/g, '');
        let dataInfo = JSON.parse(routeParams)
          ? JSON.parse(routeParams)
          : { linkKey: 'goodsList', info: {} };
        this.setData('uPushSendForm', messageSendVO);
        this.setData('imageDefaultUrl', imageDefaultUrl);
        this.setData('dataInfo', dataInfo);
        if (messageSendVO.sendType === 1 && messageSendVO.scopeVOList) {
          let levels = messageSendVO.scopeVOList.map((v) => v.joinId);
          this.setData('customerLevel', levels);
          this.getCustomerTotal({ customerLevel: levels });
        } else if (messageSendVO.sendType === 3 && messageSendVO.scopeVOList) {
          let groups = messageSendVO.scopeVOList.map((v) => v.joinId);
          this.setData('rfmGroup', groups);
          this.getCustomerTotal({ rfmGroup: groups });
        } else if (messageSendVO.sendType === 4 && messageSendVO.scopeVOList) {
          this.setData(
            'selectedCustomerList',
            messageSendVO.scopeVOList.map((item) => {
              let { receiveAccount, receiveName, joinId } = item;
              return {
                customerAccount: receiveAccount,
                customerName: receiveName,
                customerId: joinId
              };
            })
          );
          this.setData('customerTotal', messageSendVO.scopeVOList.length);
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
      uPushSendForm: {
        // 消息内容
        content: '',
        // 消息封面图片
        imgUrl: '',
        // 消息名称
        name: '',
        // 消息接受人 0:全部会员 1:按会员等级 2:按标签 3:按人群 4:指定会员
        sendType: 0,
        sendTimeType: 0,
        // 等级、标签、人群ID。逗号分割
        joinIds: '',
        // 点击消息跳转的页面路由
        routeParams: '',
        // 消息标题
        title: '',
        // 推送时间
        pushTime: null,
        //消息类型
        messageType: 0
      },
      imageDefaultUrl: null,
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
    const sendType = this.state()
      .get('uPushSendForm')
      .get('sendType');
    if (sendType === 0) {
      const {
        res: { code, context }
      } = (await webapi.customerPage({
        pageNum: 0,
        pageSize: 1
      })) as any;
      if (code === Const.SUCCESS_CODE) {
        this.setData('customerTotal', context.total);
      }
    } else if (sendType === 1 && customerLevel) {
      const {
        res: { code, context }
      } = (await webapi.customerQuery({
        levelIds: customerLevel
      })) as any;
      if (code === Const.SUCCESS_CODE) {
        this.setData('customerTotal', context);
      }
    } else if (sendType === 3 && rfmGroup) {
      const { res } = (await webapi.customerTotal(rfmGroup)) as any;
      if (res.code === Const.SUCCESS_CODE) {
        this.setData('customerTotal', res.context);
      }
    }
  };

  changeSwitch = async (id, nodeName) => {
    const { res } = (await webapi.changeSwitch(id)) as any;
    let params = {
      nodeName: nodeName,
      pageNum: this.state().get('pageNum') - 1
    };
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      await this.getNoticeList(params);
    } else {
      message.error(res.message);
    }
  };

  deleteTask = async (id, name) => {
    const { res } = (await webapi.taskDelete(id)) as any;
    let params = {
      name: name,
      pageNum: this.state().get('pageNum') - 1
    };
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      await this.getTaskList(params);
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
