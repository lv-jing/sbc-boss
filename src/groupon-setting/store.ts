import { Store, IOptions } from 'plume2';
import * as webapi from './webapi';
import { fromJS, List } from 'immutable';
import { IList } from 'typings/globalType';
import { message } from 'antd';
import SettingActor from './actor/setting-actor';
import PicActor from './actor/pic-actor';
import { Const, checkAuth } from 'qmkit';

export default class AppStore extends Store {
  ruleEditor;
  activeEditor;
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
    //是否有查看设置的权限
    const haveAuth = checkAuth('f_fetch_groupon_setting');
    if (!haveAuth) {
      this.dispatch('loading:end');
      return;
    } else {
      //获取拼团设置
      const { res } = await webapi.queryGrouponSetting();
      if (res.code == Const.SUCCESS_CODE) {
        if (res.context.grouponSettingVO != null) {
          //开关初始化
          this.dispatch(
            'settting :changeSwitch',
            res.context.grouponSettingVO.goodsAuditFlag ? true : false
          );
          //广告初始化
          this.dispatch(
            'settting :poster',
            res.context.grouponSettingVO.advert
          );
          //规则初始化
          this.dispatch('settting :rule', res.context.grouponSettingVO.rule);
        }
      }
      //获取图片分类
      this.initImg({ pageNum: 0, cateId: -1, successCount: 0 });
    }
    //查询参团商家数
    // const result = await webapi.querySupplierNum() as any;
    // this.dispatch('setting :num',result.res)
  };

  /**
   * 拼团规则editor设置
   */
  setRuleEditor = (editor) => {
    this.ruleEditor = editor;
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
  onOkBackFun = async (_skuIds, rows) => {
    if (rows) {
      //配置目标商品链接
      let targetImg = this.state().get('targetImg');
      let chooseImgs = this.state().get('chooseImgs');
      //已存在，做修改。
      chooseImgs = chooseImgs.map((poster) => {
        if (poster.get('resourceId') == targetImg.get('resourceId')) {
          poster = poster
            .set('artworkUrl', targetImg.get('artworkUrl'))
            .set('linkGoodsInfoId', rows.get('goodsInfoId'));
        }
        return poster;
      });
      this.dispatch('setting: chooseImgs', chooseImgs);
    }
    //关闭弹窗
    this.toggleSpuModal();
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
    //this.toggleModal();
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
          this.dispatch('modal: cateIds', List.of(cateId.toString()));
          this.dispatch('modal: cateId', cateId.toString());
        }
        this.dispatch('modal: imgCates', fromJS(cateList.res));
        if (successCount > 0) {
          //   //表示上传成功之后需要选中这些图片
          //   this.dispatch(
          //     'modal: chooseImgs',
          //     fromJS(imageList.res.context)
          //       .get('content')
          //       .slice(0, successCount)
          //   );
        }
        this.dispatch('modal: imgs', fromJS(imageList.res.context));
        this.dispatch('modal: page', fromJS({ currentPage: pageNum + 1 }));
        this.dispatch('loading:end');
      });
    } else {
      message.error(imageList.res.message);
    }
  };

  initSpuList = async ({ pageNum }) => {
    const { res } = await webapi.getValidSpus({
      ...pageNum
    });
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('setting:spuList', res.context.grouponSettingGoodsVOList);
    }
  };

  setActiveEditor = (editorName) => {
    if (editorName == 'rule') {
      this.activeEditor = this.ruleEditor;
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
    //广告选择，一张一张地添加
    this.dispatch('modal: chooseImg', { check, img, chooseCount });
  };

  chooseRuleImg = ({ ruleChecked, img, chooseCount }) => {
    this.dispatch('modal: chooseRuleImg', { ruleChecked, img, chooseCount });
  };

  /**
   * 确定选择以上图片
   */
  beSureImages = () => {
    const chooseRuleImgs = this.state()
      .get('imgs')
      .filter((f) => f.get('ruleChecked') == true);
    this.activeEditor.execCommand('insertimage', chooseRuleImgs.toJS());
    //清空选择状态
    this.dispatch('setting :chooseRuleImgs');
    //弹窗关闭
    this.toggleModal();
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

  toggleModal = () => {
    this.dispatch('modal:toggleVisible');
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

  addLink = (img) => {
    //存储目标对象
    this.dispatch('setting:targetImg', img);
    //弹出拼团spu弹框
    this.dispatch('setting:toggleSpuModal');
  };

  /**
   * 删除广告
   */
  deleteItem = (img) => {
    this.dispatch('setting :deleteImg', img);
  };

  /**
   * 添加链接弹框显示隐藏
   */
  toggleSpuModal = () => {
    this.dispatch('setting:toggleSpuModal');
  };

  /**
   * 确认选中图片
   */
  confirmChoose = () => {
    //未选中任何图片，直接关闭弹框
    if (
      this.state()
        .get('imgs')
        .find((img) => img.get('checked') == true)
    ) {
      //添加到选中的图片里
      this.dispatch('setting :confirmChoose');
      //不保留选中状态
      this.dispatch('setting :clearChecked');
    }
    this.toggleModal();
  };

  cancelImgChoose = () => {
    if (this.state().get('activeKey') == '2') {
      //取消选中
      this.dispatch('setting: cancelImgChoose');
    } else {
      //规则展示的图片的选中全部置为false,防止重复添加
      this.dispatch('setting :chooseRuleImgs');
    }
    this.toggleModal();
  };

  /**
   * 保存拼团规则
   */
  savePosterRule = (value) => {
    this.dispatch('setting :saveRule', value);
  };

  /**
   * 保存规则
   */
  confirmRule = async () => {
    const rule =
      this.ruleEditor && this.ruleEditor.getContent
        ? this.ruleEditor.getContent()
        : '';
    const { res } = await webapi.saveRule({
      rule: rule
    });
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 打开or关闭设置开关
   */
  changeSwitch = (value) => {
    this.dispatch('settting :changeSwitch', value);
  };

  /**
   * 保存设置开关
   */
  saveAudit = async () => {
    //获取开关
    const grouponFlag = this.state().get('grouponFlag');
    const { res } = await webapi.saveAudit(grouponFlag);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 保存拼团广告设置
   */
  savePoster = async () => {
    const chooseImgs = this.state().get('chooseImgs');
    //扁平化一下
    let params = new Array();
    chooseImgs.map((choose) => {
      params.push({
        artworkUrl: choose.get('artworkUrl'),
        resourceId: choose.get('resourceId'),
        linkGoodsInfoId: choose.get('linkGoodsInfoId')
      });
    });
    const { res } = await webapi.savePoster({
      poster: JSON.stringify(params)
    });
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
    } else {
      message.error(res.message);
    }
  };

  /**
   * dragIndex:排序源，hoverIndex：目标源
   */
  imgSort = (dragIndex, hoverIndex) => {
    this.dispatch('setting :imgSort', {
      dragIndex: dragIndex,
      hoverIndex: hoverIndex
    });
  };

  /**
   * 鼠标悬停和离开效果
   */
  toggleOperate = (data, hover) => {
    let chooseImgs = this.state().get('chooseImgs');
    chooseImgs = chooseImgs.map((img) => {
      if (img.get('resourceId') == data.resourceId) {
        img = img.set('hover', hover);
      }
      return img;
    });
    this.dispatch('setting: chooseImgs', chooseImgs);
  };

  /**
   * 改变tab值
   */
  changeActiveKey = (key) => {
    this.dispatch('setting :changeKey', key);
  };
}
