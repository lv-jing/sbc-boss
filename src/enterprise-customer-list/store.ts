import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import ListActor from './actor/list-actor';
import LoadingActor from './actor/loading-actor';
import FormActor from './actor/form-actor';
import SelectedActor from './actor/selected-customer-actor';
import EmployeeActor from './actor/employee-actor';
import { fromJS, List } from 'immutable';
import { message } from 'antd';
import EditActor from './actor/edit-actor';
import CustomerLevelActor from './actor/customer-level-actor';
import VisibleActor from './actor/visible-actor';
import RejectActor from './actor/reject-actor';
import ForbidActor from './actor/forbid-actor';
import { Const, QMMethod, VASConst } from 'qmkit';
import TabKeyActor from './actor/tab-key-actor';
import EnterpriseSettingActor from './actor/enterprise-setting-actor';
import PicActor from './actor/pic-actor';
import { IList } from 'typings/globalType';

type TList = List<any>;

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [
      new ListActor(),
      new LoadingActor(),
      new FormActor(),
      new SelectedActor(),
      new EmployeeActor(),
      new CustomerLevelActor(),
      new EditActor(),
      new VisibleActor(),
      new RejectActor(),
      new ForbidActor(),
      new TabKeyActor(),
      new EnterpriseSettingActor(),
      new PicActor()
    ];
  }

  /**
   * 初始化
   *
   * @memberof AppStore
   */
  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const checkIEP = await QMMethod.fetchVASStatus(VASConst.IEP);
    if (!checkIEP) {
      return null;
    }
    const key = this.state().get('key');
    if (key == 1) {
      this.initCustomerList({ pageNum, pageSize });
    } else if (key == 2) {
      this.initIepSetting();
    }
  };

  /**
   * 初始化企业购设置信息
   *
   * @memberof AppStore
   */
  initIepSetting = async () => {
    const { res } = await webapi.getIepSetting();
    this.initImg({ pageNum: 0, cateId: -1, successCount: 0 });
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('enterprise: setting: info', res.context.iepSettingVO);
    }
  };

  /**
   * 切换tab页签
   *
   * @memberof AppStore
   */
  changeTabKey = (key) => {
    if (key == 1) {
      this.initCustomerList();
    } else if (key == 2) {
      this.initIepSetting();
    }
    this.dispatch('enterprise: tab: key', key);
  };

  /**
   * 初始化企业会员列表
   *
   * @memberof AppStore
   */
  initCustomerList = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 }
  ) => {
    this.dispatch('enterprise: loading:start');
    const query = this.state()
      .get('form')
      .toJS();
    if (query.enterpriseCheckState === '-1') {
      query.enterpriseCheckState = null;
    }
    const { res } = await webapi.fetchCustomerList({
      ...query,
      pageNum,
      pageSize
    });
    const { res: resLevel } = await webapi.fetchAllCustomerLevel();
    let empArr;
    const { res: resEmployee } = await webapi.fetchAllEmployee();
    empArr = resEmployee;

    if (res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('enterprise: loading:end');
        this.dispatch('enterprise: listActor:init', res.context);
        this.dispatch('enterprise: list:currentPage', pageNum && pageNum + 1);
        this.dispatch('enterprise: employee:init', fromJS(empArr));
        this.dispatch(
          'enterprise: customerLevel:init',
          fromJS(resLevel.context.customerLevelVOList)
        );
        this.dispatch('enterprise: select:init', []);
      });
    } else {
      this.dispatch('enterprise: loading:end');
      message.error(res.message);
    }
  };

  //tab-list 切换
  onTabChange = (index: number) => {
    this.dispatch('enterprise: form:enterpriseCheckState', index);
    this.init();
  };

  onFormChange = ({ field, value }) => {
    //如果是省市区级联
    if (field == 'area') {
      this.transaction(() => {
        ['provinceId', 'cityId', 'areaId'].forEach((v, index) => {
          this.dispatch('enterprise: form:field', {
            field: v,
            value: value[index]
          });
        });
      });
      return;
    }
    this.dispatch('enterprise: form:field', { field, value });
  };

  onSearch = () => {
    this.init({ pageNum: 0, pageSize: 10 });
  };

  onSelect = (list) => {
    this.dispatch('enterprise: select:init', list);
  };

  /**
   * 新增
   */
  onAdd = async () => {
    this.dispatch('enterprise: modal:show');
  };

  //取消
  onCancel = () => {
    this.transaction(() => {
      this.dispatch('enterprise: edit', false);
      this.dispatch('enterprise: modal:hide');
    });
  };

  onSave = async (customerForm) => {
    if (this.state().get('onSubmit')) {
      this.dispatch('enterprise: modal:submit', false);
      //保存
      const { res } = await webapi.saveCustomer(customerForm);
      if (res.code === Const.SUCCESS_CODE) {
        message.success(res.message);
        this.dispatch('enterprise: modal:hide');
        this.init();
      } else {
        this.dispatch('enterprise: modal:submit', true);
        message.error(res.message);
      }
    }
  };
  /**
   * 批量删除
   * @returns {Promise<void>}
   */
  onBatchDelete = async () => {
    const selected = this.state().get('selected') as TList;
    if (selected.isEmpty()) {
      message.error('请选择要操作的行');
      return;
    }
    const { res } = await webapi.batchDelete(selected.toJS());
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 单个删除
   * @param customerId
   * @returns {Promise<void>}
   */
  onDelete = async (customerId) => {
    const { res } = await webapi.batchDelete([customerId]);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    } else {
      message.error(res.message);
    }
  };
  /**
   * 批量禁用或启用会员
   * @param customerId
   * @returns {Promise<void>}
   */
  onBatchAudit = async (customerStatus) => {
    const selected = this.state().get('selected');
    if (selected.isEmpty()) {
      message.error('请选择要操作的行');
      return;
    }

    const { res } = await webapi.batchAudit(
      customerStatus,
      selected.toJS(),
      null
    );
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 禁用或启用会员
   * @param customerId
   * @returns {Promise<void>}
   */
  onCheckStatus = async (customerId, customerStatus, forbidReason) => {
    const { res } = await webapi.batchAudit(
      customerStatus,
      [customerId],
      forbidReason
    );
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    } else {
      message.error(res.message);
    }
  };

  //审核客户状态，审核/驳回
  onCustomerStatus = async (
    customerId,
    enterpriseCheckState,
    enterpriseCheckReason
  ) => {
    const { res } = await webapi.checkEnterpriseCustomer(
      enterpriseCheckState,
      customerId,
      enterpriseCheckReason
    );
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 控制驳回窗口显示
   * @param visible
   */
  setRejectModalVisible = (customerId, visible) => {
    this.transaction(() => {
      this.dispatch('enterprise: reject:setRejectCustomerId', customerId);
      this.dispatch('enterprise: reject:setRejectModalVisible', visible);
    });
  };
  /**
   * 控制禁用窗口显示
   * @param visible
   */
  setForbidModalVisible = (customerId, visible) => {
    this.transaction(() => {
      this.dispatch('enterprise: forbid:setForbidCustomerId', customerId);
      this.dispatch('enterprise: forbid:setForbidModalVisible', visible);
    });
  };

  /**
   * 判断用户是否拥有crm权限
   */
  getCRMConfig = async () => {
    const {
      res: {
        context: { crmFlag }
      }
    } = await webapi.getCrmConfig();

    this.dispatch('enterprise: setCRMFlag', crmFlag);
  };

  /**
   * 修改企业购设置信息
   *
   * @memberof AppStore
   */
  modifyEnterpriseSetting = ({ field, value }) => {
    this.dispatch('enterprise: setting: info: modify', { field, value });
  };

  /**
   * 将editor ref对象存储到actor中
   */
  refEditor = (editor) => {
    this.dispatch('enterprise: setting: regEditor', editor);
  };

  initImg = async (
    { pageNum, cateId, successCount } = {
      pageNum: 0,
      cateId: null,
      successCount: 0
    }
  ) => {
    const cateList: any = await webapi.getImgCates();
    const cateListIm = this.state().get('cateAllList');
    if (cateId == -1) {
      cateId = fromJS(cateList.res)
        .filter((item) => item.get('isDefault') == 1)
        .get(0)
        .get('cateId');
    }
    cateId = cateId ? cateId : this.state().get('cateId');
    const imageList: any = await webapi.fetchImages({
      pageNum,
      pageSize: 15,
      resourceName: this.state().get('searchName'),
      cateIds: this._getCateIdsList(cateListIm, cateId),
      resourceType: 0
    });
    if (imageList.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        if (cateId) {
          this.dispatch(
            'enterprise: modal: cateIds',
            List.of(cateId.toString())
          );
          this.dispatch('enterprise: modal: cateId', cateId.toString());
        }
        this.dispatch('enterprise: modal: imgCates', fromJS(cateList.res));
        if (successCount > 0) {
          //表示上传成功之后需要选中这些图片
          this.dispatch(
            'enterprise: modal: chooseImgs',
            fromJS(imageList.res.context)
              .get('content')
              .slice(0, successCount)
          );
        }
        this.dispatch('enterprise: modal: imgs', fromJS(imageList.res.context));
        this.dispatch(
          'enterprise: modal: page',
          fromJS({ currentPage: pageNum + 1 })
        );
      });
    } else {
      message.error(imageList.res.message);
    }
  };

  /**
   * 根据分类id,找寻自己+所有子类List
   */
  _getCateIdsList = (cateListIm, cateId) => {
    let cateIdList = new Array();
    if (cateId) {
      cateIdList.push(cateId);
      const secondCateList = cateListIm.filter(
        (item) => item.get('cateParentId') == cateId
      ); //找第二层子节点
      if (secondCateList && secondCateList.size > 0) {
        cateIdList = cateIdList.concat(
          secondCateList.map((item) => item.get('cateId')).toJS()
        );
        const thirdCateList = cateListIm.filter(
          (item) =>
            secondCateList.filter(
              (sec) => item.get('cateParentId') == sec.get('cateId')
            ).size > 0
        ); //找第三层子节点
        if (thirdCateList && thirdCateList.size > 0) {
          cateIdList = cateIdList.concat(
            thirdCateList.map((item) => item.get('cateId')).toJS()
          );
        }
      }
    }
    return cateIdList;
  };

  editCateId = async (value: string) => {
    this.dispatch('enterprise: modal: cateId', value);
  };

  /**
   * 修改选中分类
   * @param value
   * @returns {Promise<void>}
   */
  editDefaultCateId = async (value: string) => {
    this.dispatch('enterprise: modal: cateIds', List.of(value));
  };

  setVisible = async (maxCount: number, imgType: number, skuId: string) => {
    if (!this.state().get('modalVisible')) {
      this.initImg({ pageNum: 0, cateId: '', successCount: 0 });
    }
    if (maxCount) {
      //取消时候, 该值为0, 不重置, 防止页面渲染太快, 看到数量变化不友好
      this.dispatch('enterprise: modal: maxCount', maxCount);
    }
    this.dispatch('enterprise: modal: visible', { imgType, skuId });
  };

  /**
   * 清除选中的图片集合
   */
  cleanChooseImgs = () => {
    this.dispatch('enterprise: modal: cleanChooseImg');
  };

  search = async (imageName: string) => {
    this.dispatch('enterprise: modal: search', imageName);
  };

  /**
   * 点击搜索保存搜索内容
   * @param {string} searchName
   * @returns {Promise<void>}
   */
  saveSearchName = async (searchName: string) => {
    this.dispatch('enterprise: modal: searchName', searchName);
  };

  /**
   * 修改商品图片
   */
  editImages = (images: IList) => {
    this.dispatch('enterprise: imageActor: editImages', images);
  };

  /**
   * 点击图片
   * @param {any} check
   * @param {any} img
   */
  chooseImg = ({ check, img, chooseCount }) => {
    this.dispatch('enterprise: modal: chooseImg', { check, img, chooseCount });
  };

  /**
   * 确定选择以上图片
   */
  beSureImages = () => {
    const chooseImgs = this.state().get('chooseImgs');
    const imgType = this.state().get('imgType');
    if (imgType === 0) {
      let images = this.state().get('images');
      images = images.concat(chooseImgs);
      this.dispatch('enterprise: imageActor: editImages', images);
    } else if (imgType === 1) {
      const skuId = this.state().get('skuId');
      this.dispatch('enterprise: goodsSpecActor: editGoodsItem', {
        id: skuId,
        key: 'images',
        value: chooseImgs
      });
    } else {
      this.state()
        .get('regEditor')
        .execCommand('insertimage', (chooseImgs || fromJS([])).toJS());
    }
  };

  /**
   * 存储企业购信息
   *
   * @memberof AppStore
   */
  saveIepSetting = async () => {
    const editor = this.state().get('regEditor');
    const registerContent = editor.getContent ? editor.getContent() : '';
    if (!registerContent || !registerContent.trim()) {
      message.error('企业会员注册协议不能为空');
      return;
    }

    let setting = this.state()
      .get('setting')
      .toJS();
    setting = {
      ...setting,
      enterpriseCustomerRegisterContent: registerContent
    };
    const { res } = (await webapi.modifyIepSetting(setting)) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('保存成功');
    } else {
      message.error(res.message);
    }
  };
}
