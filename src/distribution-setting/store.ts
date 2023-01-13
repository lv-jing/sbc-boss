import { Store, IOptions } from 'plume2';
import * as webapi from './webapi';
import { fromJS, List } from 'immutable';
import { IList } from 'typings/globalType';
import { message } from 'antd';
import SettingActor from './actor/setting-actor';
import PicActor from './actor/pic-actor';
import { Const, QMMethod } from 'qmkit';
import moment from 'moment';

export default class AppStore extends Store {
  saveMultistageFunc = QMMethod.onceFunc(() => {
    this.saveMultistage();
  }, 1500);

  recruitEditor;
  inviteEditor;
  activeEditor;
  performanceEditor;
  levelEditor;
  recruitForm;
  constructor(props: IOptions) {
    super(props);
    // debug
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new SettingActor(), new PicActor()];
  }

  /**
   * 初始化
   */
  init = async () => {
    this.initImg({ pageNum: 0, cateId: -1, successCount: 0 });
    const { res } = (await webapi.querySetting()) as any;
    const {
      distributionSetting: setting,
      couponInfos,
      couponInfoCounts,
      goodsInfos,
      brands,
      cates,
      distributorLevels
    } = res.context;
    // 1.基础设置
    let basic = {} as any;
    basic.distributorName = setting.distributorName;
    basic.shopOpenFlag = setting.shopOpenFlag == 1;
    basic.shopName = setting.shopName;
    basic.shopShareImg = setting.shopShareImg
      ? [{ uid: 1, status: 'done', url: setting.shopShareImg }]
      : [];
    basic.registerLimitType = setting.registerLimitType;
    basic.baseLimitType = setting.baseLimitType;
    basic.commissionPriorityType = setting.commissionPriorityType;
    basic.goodsAuditFlag = setting.goodsAuditFlag == 1;
    basic.performanceDesc = setting.performanceDesc;
    // 2.分销员招募设置
    let recruit = {} as any;
    recruit.applyFlag = setting.applyFlag == 1;
    recruit.applyType = setting.applyType;
    recruit.buyRecruitEnterImg = setting.buyRecruitEnterImg
      ? [{ uid: 1, status: 'done', url: setting.buyRecruitEnterImg }]
      : [];
    recruit.inviteRecruitEnterImg = setting.inviteRecruitEnterImg
      ? [{ uid: 1, status: 'done', url: setting.inviteRecruitEnterImg }]
      : [];
    recruit.inviteRecruitImg = setting.inviteRecruitImg
      ? [{ uid: 1, status: 'done', url: setting.inviteRecruitImg }]
      : [];
    recruit.recruitImg = setting.recruitImg
      ? [{ uid: 1, status: 'done', url: setting.recruitImg }]
      : [];
    recruit.recruitShareImg = setting.recruitShareImg
      ? [{ uid: 1, status: 'done', url: setting.recruitShareImg }]
      : [];
    recruit.recruitDesc = setting.recruitDesc;
    recruit.inviteCount = setting.inviteCount;
    recruit.limitType = setting.limitType;
    recruit.goodsInfoIds = goodsInfos.map((item) => item.goodsInfoId);
    recruit.goodsRows = goodsInfos.map((sku) => {
      sku.brandName = '';
      sku.cateName = '';
      const cate = cates.find((item) => item.cateId == sku.cateId);
      const brand = brands.find((item) => item.brandId == sku.brandId);
      sku.brandName = brand ? brand.brandName : '';
      sku.cateName = cate ? cate.cateName : '';
      return sku;
    });
    // 3.奖励模式设置
    let reward = {} as any;
    reward.commissionFlag = setting.commissionFlag == 1;
    reward.inviteFlag = setting.inviteFlag == 1;
    reward.inviteImg = setting.inviteImg
      ? [{ uid: 1, status: 'done', url: setting.inviteImg }]
      : [];
    reward.inviteShareImg = setting.inviteShareImg
      ? [{ uid: 1, status: 'done', url: setting.inviteShareImg }]
      : [];
    //邀新入口海报
    reward.inviteEnterImg = setting.inviteEnterImg
      ? [{ uid: 1, status: 'done', url: setting.inviteEnterImg }]
      : [];
    reward.inviteDesc = setting.inviteDesc;
    reward.rewardLimitType = setting.rewardLimitType;
    reward.rewardCashFlag = setting.rewardCashFlag == 1;
    reward.rewardCashCount = setting.rewardCashCount;
    reward.rewardCash = setting.rewardCash;
    reward.rewardCashType = setting.rewardCashType;
    reward.rewardCouponFlag = setting.rewardCouponFlag == 1;
    reward.rewardCouponCount = setting.rewardCouponCount;
    reward.couponCountMap = setting.couponCountMap;
    // 奖励模式设置--优惠券列表
    reward.coupons = couponInfoCounts.map((item) => {
      let coupon = {} as any;
      const couponInfo = couponInfos.find(
        (info) => info.couponId == item.couponId
      );
      // 优惠券基础信息
      coupon.couponId = item.couponId;
      coupon.totalCount = item.count;
      coupon.couponName = couponInfo.couponName;
      // 面值
      coupon.denominationStr =
        couponInfo.fullBuyType == 0
          ? `满0减${couponInfo.denomination}`
          : `满${couponInfo.fullBuyPrice}减${couponInfo.denomination}`;
      // 有效期
      if (couponInfo.rangeDayType == 0) {
        // 按起止时间
        let startTime = moment(couponInfo.startTime)
          .format(Const.DAY_FORMAT)
          .toString();
        let endTime = moment(couponInfo.endTime)
          .format(Const.DAY_FORMAT)
          .toString();
        coupon.validity = `${startTime}至${endTime}`;
      } else {
        // 按N天有效
        coupon.validity = `领取当天${couponInfo.effectiveDays}日内有效`;
      }
      return coupon;
    });

    // 4.多级分销设置
    let multistage = {} as any;
    multistage.commissionUnhookType = setting.commissionUnhookType;
    multistage.distributorLevelDesc = setting.distributorLevelDesc;
    multistage.distributorLevels = distributorLevels.map((item) => {
      item.salesFlag = item.salesFlag == 1;
      item.recordFlag = item.recordFlag == 1;
      item.inviteFlag = item.inviteFlag == 1;
      item.mockId = item.distributorLevelId;
      item.commissionRate = item.commissionRate * 100;
      item.percentageRate = item.percentageRate * 100;
      if (item.sort == 1) {
        item.distributorLevelName = basic.distributorName;
      }
      return item;
    });

    this.dispatch('setting:init', {
      openFlag: setting.openFlag,
      basic: fromJS(basic),
      recruit: fromJS(recruit),
      reward: fromJS(reward),
      multistage: fromJS(multistage)
    });
  };

  /**
   * 保存分销设置开关
   */
  saveOpenFlag = async (openFlag) => {
    const { res } = await webapi.saveOpenFlag({ openFlag: openFlag ? 1 : 0 });
    if (res.code == Const.SUCCESS_CODE) {
      message.success('修改成功');
    }
  };

  /**
   * 保存基础设置
   */
  saveBasic = async () => {
    let params = this.state()
      .get('basic')
      .toJS();
    params.openFlag = this.state().get('openFlag') ? 1 : 0;
    params.shopOpenFlag = params.shopOpenFlag ? 1 : 0;
    params.shopShareImg = this.getImageUrl(params.shopShareImg);
    params.goodsAuditFlag = params.goodsAuditFlag ? 1 : 0;
    params.performanceDesc =
      this.performanceEditor && this.performanceEditor.getContent
        ? this.performanceEditor.getContent()
        : '';
    const { res } = await webapi.saveBasic(params);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('修改成功');
    }
  };

  /**
   * 保存分销员招募
   */
  saveRecruit = async () => {
    let params = this.state()
      .get('recruit')
      .toJS();
    params.openFlag = this.state().get('openFlag') ? 1 : 0;
    params.applyFlag = params.applyFlag ? 1 : 0;
    params.recruitDesc =
      this.recruitEditor && this.recruitEditor.getContent
        ? this.recruitEditor.getContent()
        : '';
    if (params.applyFlag === 0) {
      // 关闭申请入口，使用之前的规则说明
      params.recruitDesc = this.state().getIn(['recruit', 'recruitDesc']);
    }
    this.fieldsValue(['recruit', 'recruitDesc'], params.recruitDesc);
    if (
      this.recruitEditor &&
      this.recruitEditor.getContent &&
      this.recruitEditor.getContentLength(true) > 1000
    ) {
      return;
    }
    params.recruitImg = this.getImageUrl(params.recruitImg);
    params.recruitShareImg = this.getImageUrl(params.recruitShareImg);
    //邀请招募入口海报
    params.inviteRecruitEnterImg = this.getImageUrl(
      params.inviteRecruitEnterImg
    );
    //邀请招募落地海报
    params.inviteRecruitImg = this.getImageUrl(params.inviteRecruitImg);
    //购买商品招募入口海报
    params.buyRecruitEnterImg = this.getImageUrl(params.buyRecruitEnterImg);
    const { res } = await webapi.saveRecruit(params);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('修改成功');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 保存奖励模式
   */
  saveReward = async () => {
    let params = this.state()
      .get('reward')
      .toJS();
    params.openFlag = this.state().get('openFlag') ? 1 : 0;
    params.commissionFlag = params.commissionFlag ? 1 : 0;
    params.inviteFlag = params.inviteFlag ? 1 : 0;
    params.rewardCashFlag = params.rewardCashFlag ? 1 : 0;
    params.rewardCouponFlag = params.rewardCouponFlag ? 1 : 0;
    params.inviteDesc =
      this.inviteEditor && this.inviteEditor.getContent
        ? this.inviteEditor.getContent()
        : '';
    if (params.inviteFlag === 0) {
      // 关闭邀新奖励，使用之前的规则说明
      params.inviteDesc = this.state().getIn(['reward', 'inviteDesc']);
    }
    this.fieldsValue(['reward', 'inviteDesc'], params.inviteDesc);
    this.fieldsValue(['reward', 'performanceDesc'], params.performanceDesc);
    //分销业绩说明字数限制
    if (
      this.performanceEditor &&
      this.performanceEditor.getContent &&
      this.performanceEditor.getContentLength(true) > 1000
    ) {
      return;
    }
    //业务规则字数限制
    if (
      this.inviteEditor &&
      this.inviteEditor.getContent &&
      this.inviteEditor.getContentLength(true) > 500
    ) {
      return;
    }

    params.inviteImg = this.getImageUrl(params.inviteImg);
    params.inviteShareImg = this.getImageUrl(params.inviteShareImg);
    params.chooseCoupons = this.state()
      .getIn(['reward', 'coupons'])
      .toJS()
      .map((item) => {
        return {
          couponId: item.couponId,
          count: item.totalCount
        };
      });
    //邀新入口海报
    params.inviteEnterImg = this.getImageUrl(params.inviteEnterImg);
    const { res } = await webapi.saveReward(params);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('修改成功');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 保存多级分销
   */
  saveMultistage = async () => {
    let params = this.state()
      .get('multistage')
      .toJS();
    params.distributorLevelDesc = this.levelEditor.getContent();
    this.fieldsValue(
      ['multistage', 'distributorLevelDesc'],
      params.distributorLevelDesc
    );
    params.distributorLevels.map((item) => {
      item.salesFlag = item.salesFlag ? 1 : 0;
      item.recordFlag = item.recordFlag ? 1 : 0;
      item.inviteFlag = item.inviteFlag ? 1 : 0;
      item.commissionRate = item.commissionRate / 100;
      item.percentageRate = item.percentageRate / 100;
      return item;
    });
    const { res } = await webapi.saveMultistage(params);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('修改成功');
      this.init();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 删除分销员等级
   */
  deleteDistributorLevel = async (levelId) => {
    const { res } = await webapi.deleteDistributorLevel(levelId);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('删除成功');
      this.removeDistributorLevel();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 招募规则editor设置
   */
  setRecruitEditor = (editor) => {
    this.recruitEditor = editor;
  };

  /**
   * 邀新规则editor设置
   */
  setInviteEditor = (editor) => {
    this.inviteEditor = editor;
  };

  /**
   * 分销业绩规则说明editor设置
   */
  setPerformanceEditor = (editor) => {
    this.performanceEditor = editor;
  };

  /**
   * 分销员等级规则editor设置
   */
  setLevelEditor = (editor) => {
    this.levelEditor = editor;
  };

  /**
   * 修改分销员等级值
   */
  changeDistributorLevelValue = (index, key, value) => {
    this.dispatch('change:distributor:level:value', { index, key, value });
  };

  /**
   * 新增分销员等级
   */
  addDistributorLevel = () => {
    this.dispatch('add:distributor:level');
  };

  /**
   * 删除分销员等级
   */
  removeDistributorLevel = () => {
    this.dispatch('remove:distributor:level');
  };

  /**
   * 删除选中的商品
   */
  deleteSelectedSku = async (id) => {
    this.dispatch('setting:delete:sku', id);
    await this.recruitForm.setFieldsValue({
      goodsInfoIds: this.state()
        .getIn(['recruit', 'goodsInfoIds'])
        .toJS()
    });
    this.recruitForm.validateFields(['goodsInfoIds']);
  };

  /**
   * 存储键值
   */
  fieldsValue = (field, value) => {
    this.dispatch('setting:fields:value', { field, value });
  };

  /**
   * 批量选择优惠券
   */
  onChosenCoupons = (coupons) => {
    this.dispatch('setting:choose:coupons', fromJS(coupons));
  };

  /**
   * 修改优惠券总张数
   * @param index 修改的优惠券的索引位置
   * @param totalCount 优惠券总张数
   */
  changeCouponTotalCount = (index, totalCount) => {
    this.dispatch('setting:coupon:count', { index, totalCount });
  };

  /**
   * 删除优惠券
   */
  onDelCoupon = (couonId) => {
    this.dispatch('setting:del:coupon', couonId);
  };

  /**
   * 选择商品弹框的关闭按钮
   */
  onCancelBackFun = () => {
    this.dispatch('setting:fields:value', {
      field: ['recruit', 'goodsModalVisible'],
      value: false
    });
  };

  /**
   * 点击完成，保存用户选择的商品信息
   */
  onOkBackFun = async (skuIds, rows) => {
    //保存商品信息
    this.dispatch('setting:fields:value', {
      field: ['recruit', 'goodsInfoIds'],
      value: skuIds
    });
    this.dispatch('setting:fields:value', {
      field: ['recruit', 'goodsRows'],
      value: rows
    });
    //关闭弹窗
    this.dispatch('setting:fields:value', {
      field: ['recruit', 'goodsModalVisible'],
      value: false
    });
    await this.recruitForm.setFieldsValue({ goodsInfoIds: skuIds });
    this.recruitForm.validateFields(['goodsInfoIds']);
  };

  setRecruitForm = (form) => {
    this.recruitForm = form;
  };

  /****************************************************
   ********* 以下代码为富文本框内，选择图片相关代码 **********
   ******* 目前boss相关页面都冗余了这些，可以考虑抽组件 ******
   ****************************************************/
  setVisible = async (maxCount: number, imgType: number, skuId: string) => {
    if (!this.state().get('visible')) {
      this.initImg({ pageNum: 0, cateId: '', successCount: 0 });
    }
    if (maxCount) {
      //取消时候, 该值为0, 不重置, 防止页面渲染太快, 看到数量变化不友好
      this.dispatch('modal: maxCount', maxCount);
    }
    this.dispatch('modal: visible', { imgType, skuId });
  };

  initImg = async (
    { pageNum, cateId, successCount } = {
      pageNum: 0,
      cateId: null,
      successCount: 0
    }
  ) => {
    const cateList: any = await webapi.getImgCates();
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
      imageName: this.state().get('searchName'),
      cateId
    });
    if (imageList.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        if (cateId) {
          this.dispatch('modal: cateIds', List.of(cateId.toString()));
          this.dispatch('modal: cateId', cateId.toString());
        }
        this.dispatch('modal: imgCates', fromJS(cateList.res));
        if (successCount > 0) {
          //表示上传成功之后需要选中这些图片
          this.dispatch(
            'modal: chooseImgs',
            fromJS(imageList.res.context)
              .get('content')
              .slice(0, successCount)
          );
        }
        this.dispatch('modal: imgs', fromJS(imageList.res.context));
        this.dispatch('modal: page', fromJS({ currentPage: pageNum + 1 }));
      });
    } else {
      message.error(imageList.res.message);
    }
  };

  setActiveEditor = (editorName) => {
    if (editorName == 'recruit') {
      this.activeEditor = this.recruitEditor;
    }
    if (editorName == 'invite') {
      this.activeEditor = this.inviteEditor;
    }
    if (editorName == 'performance') {
      this.activeEditor = this.performanceEditor;
    }
    if (editorName == 'level') {
      this.activeEditor = this.levelEditor;
    }
  };

  /**
   * 点击搜索保存搜索内容
   * @param {string} searchName
   * @returns {Promise<void>}
   */
  saveSearchName = async (searchName: string) => {
    this.dispatch('modal: searchName', searchName);
  };

  editCateId = async (value: string) => {
    this.dispatch('modal: cateId', value);
  };

  /**
   * 修改选中分类
   * @param value
   * @returns {Promise<void>}
   */
  editDefaultCateId = async (value: string) => {
    this.dispatch('modal: cateIds', List.of(value));
  };

  search = async (imageName: string) => {
    this.dispatch('modal: search', imageName);
  };

  /**
   * 修改商品图片
   */
  editImages = (images: IList) => {
    this.dispatch('imageActor: editImages', images);
  };

  /**
   * 点击图片
   * @param {any} check
   * @param {any} img
   */
  chooseImg = ({ check, img, chooseCount }) => {
    this.dispatch('modal: chooseImg', { check, img, chooseCount });
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
      this.dispatch('imageActor: editImages', images);
    } else if (imgType === 1) {
      const skuId = this.state().get('skuId');
      this.dispatch('goodsSpecActor: editGoodsItem', {
        id: skuId,
        key: 'images',
        value: chooseImgs
      });
    } else {
      this.activeEditor.execCommand(
        'insertimage',
        (chooseImgs || fromJS([])).toJS()
      );
    }
  };

  /**
   * 清除选中的图片集合
   */
  cleanChooseImgs = () => {
    this.dispatch('modal: cleanChooseImg');
  };

  /**
   * 从file对象中获取图片url
   */
  getImageUrl = (file) => {
    if (file[0]) {
      if (file[0].url) {
        return file[0].url;
      }
      if (file[0].response) {
        return file[0].response[0];
      }
    } else {
      return '';
    }
  };
}
