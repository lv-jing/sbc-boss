import { IOptions, Store } from 'plume2';
import {message, Modal} from 'antd';
import SettingActor from "./actor/setting-actor";
import { fromJS, List } from 'immutable';
import ShopRuleActor from "./actor/shop-rule-actor";
import {IList, IMap} from "../../typings/globalType";
import {Const,checkAuth} from "qmkit";
import * as webapi from './webapi';
import BasicRuleActor from "./actor/basic-rule-actor";
import PicActor from "./actor/pic-actor";

const warning = Modal.warning;

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [
      new SettingActor(),
      new BasicRuleActor(),
      new ShopRuleActor(),
      new PicActor()
    ];
  }

  init = async () => {
    const result :any = await Promise.all([
      webapi.fetchGrowthValueConfig(),
      webapi.listBasicRules()
    ]);
    if (
      result[0].res.code == Const.SUCCESS_CODE &&
      result[1].res.code == Const.SUCCESS_CODE
    ) {
      this.dispatch('growth-value-setting:init', result[0].res.context);

      let data = fromJS(result[1].res.context);
      data = data.map(v=>{
        if(v.get('configType') == 'growth_value_basic_rule_share_goods'){
          v = v.set('valueName','分享商品详情页获得成长值');
        }else if(v.get('configType') == 'growth_value_basic_rule_comment_goods'){
          v = v.set('valueName','对已购买商品完成提交评论获得成长值');
        }else{
          v = v.set('valueName','获得成长值');
        }

        v.set('rule',result[0].res.context.rule);
        return v;
      });

      this.dispatch('growth-value-basic-rule:init',data);
      this.dispatch('growth-value-origin-basic-rule:init',data);
    }
    await this.initCate();
  };

  /**
   * 同步积分规则
   * @returns {Promise<void>}
   */
  synchronizePointsRule = async () => {
    const result :any = await Promise.all([
      webapi.getCateList(),
      webapi.listPointsBasicRules()
    ]);
    if (
      result[0].res.code == Const.SUCCESS_CODE &&
      result[1].res.code == Const.SUCCESS_CODE
    ) {
      //购物规则
      let shopRules = fromJS(result[0].res.context);
      shopRules.forEach(cate => {
        cate.growthValueRate = cate.pointsRate;
        cate.isParentGrowthValueRate = cate.isParentPointsRate;
      });
      this.dispatch('growth-value-shop-rule: init', shopRules);
      //基础规则
      let pointsRule = result[1].res.context;
      let basicRules = this.state().get('basicRules').toJS();
      const rule = this.state().get('growthValueConfig').get('rule');
      pointsRule.forEach((one,i) => {
        basicRules[i].context = one.context;
        basicRules[i].status = one.status;
        basicRules[i].rule = rule;
      });
      this.dispatch('growth-value-basic-rule:init',basicRules);
    }
  }

  userDefinedRule = () => {
    let originalBasicRules = this.state().get('originalBasicRules')
    this.dispatch('growth-value-basic-rule:init',originalBasicRules);
  }

  initCate = async() => {
     const cateList: any = await webapi.getCateList();
      if (cateList.res.code == Const.SUCCESS_CODE) {
        this.dispatch('growth-value-shop-rule: init', fromJS(cateList.res.context));
      } else {
        message.error(cateList.res.message);
      }
  }

  /**
   * 成长值开关切换
   * 开启后，若已有会员获取成长值不允许关闭，弹框提示，若无会员获取成长值，可直接关闭
   */
  switchChange = async (checked) => {
    const growthValueConfig = this.state().get('growthValueConfig');

    let result : any;
    if (checked) {
      result = await webapi.openGrowthValue(growthValueConfig.get('growthValueConfigId'));
    } else {
      result = await webapi.closeGrowthValue(growthValueConfig.get('growthValueConfigId'));
    }

    if (result) {
      const { code, message: msg } = result.res;
      if (code == Const.SUCCESS_CODE) {
        this.onChange({field: 'status', value: checked ? 1 : 0});
        message.success('操作成功');
      } else if (code == 'K-010301'){
        warning({
          title: '已有会员获取成长值',
          content: '不可关闭',
          okText: '确定'
        });
      } else{
        message.error(msg);
      }
    }
  };

  /**
   * 修改积分设置字段
   */
  onChange = ({ field, value }) => {
    this.dispatch('growth-value-setting: edit', { field, value });
  };

  /**
   * 修改基础规则开启状态
   */
  editStatusByConfigType = (index: number, status: number) => {
    this.dispatch('growth-value-basic-rule:status', {
      index: index,
      status: status ? 1 : 0
    });
  };

  /**
   * 保存基础获取规则
   */
  saveBasicRules = async () => {
    const haveAuth = checkAuth('f_growth_value_setting_edit');
    if(haveAuth){
      const introEditor = this.state().get('introEditor');
      let growthValueConfig = this.state().get('growthValueConfig').toJS();;
      growthValueConfig.remark = introEditor.getContent() ? introEditor.getContent() : '';

      if(!growthValueConfig.remark){
        this.dispatch('growth-value-basic-rule: isIntroFilled', false);
        return;
      }
      this.dispatch('growth-value-basic-rule: isIntroFilled', true);

      const result :any = await Promise.all([
        webapi.editBasicRules(this.state().get('basicRules'), growthValueConfig.rule),
        webapi.savePointsConfig(growthValueConfig)
      ]);
      if (
        result[0].res.code == Const.SUCCESS_CODE &&
        result[1].res.code == Const.SUCCESS_CODE
      ) {
        message.success('保存成长值设置成功');
      }
    }else{
      message.error('此功能您没有操作权限！');
    }

  };

  refDetailEditor = (editor) => {
    this.dispatch('growth-value-basic-rule: introEditor', editor);
  };

  /**
   * 修改成长值规则
   */
  editContextByConfigType = (index: number, contextType: string, value) => {
    if(!value){
      value = "";
    }

    this.dispatch('growth-value-basic-rule:context', {
      index: index,
      type: contextType,
      value: value
    });
  };

  /**
   * 是否使用父级类目成长值获取比例
   */
  useParentRateF = (flag?: number) => {
    let useParentRate =
      this.state().getIn(['formData', 'isParentGrowthValueRate']) == 0 ? 1 : 0;
    if (flag === 0 || flag === 1) {
      useParentRate = flag;
    }
    this.dispatch('growth-value-shop-rule: rate: use', useParentRate);
  };

  /**
   * 设置父级类目成长值获取比例
   */
  setParentRate = (rate: number) => {
    this.dispatch('growth-value-shop-rule: rate', rate);
  };

  /**
   * 关闭修改弹窗
   */
  modal = () => {
    this.dispatch('growth-value-shop-rule: modal');
  };

  /**
   * 显示修改弹窗
   */
  showEditModal = (formData: IMap) => {
    this.transaction(() => {
      this.dispatch('growth-value-shop-rule: editFormData', formData);
      this.dispatch('growth-value-shop-rule: modal');
    });
  };

  /**
   * 修改购物获取规则form信息
   */
  editFormData = (formData: IMap) => {
    this.dispatch('growth-value-shop-rule: editFormData', formData);
  };

  /**
   * 编辑购物获取规则
   */
  doEdit = async () => {
    const formData = this.state().get('formData');
    const result: any = await webapi.editCate(formData);

    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      this.refresh();
      // 关闭弹框
      this.modal();
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 刷新需要延迟一下
   */
  refresh = () => {
    setTimeout(() => {
      this.initCate();
    }, 1000);
  };

  /**
   * 展示富文本上传图片弹框
   */
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
      this.state()
        .get('introEditor')
        .execCommand('insertimage', (chooseImgs || fromJS([])).toJS());
    }
  };

  /**
   * 清除选中的图片集合
   */
  cleanChooseImgs = () => {
    this.dispatch('modal: cleanChooseImg');
  };
}
