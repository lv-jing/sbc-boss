import { IOptions, Store } from 'plume2';
import { message } from 'antd';
import { fromJS, List } from 'immutable';
import { Const } from 'qmkit';
import SettingActor from './actor/setting-actor';
import ModalActor from './actor/modal-actor';
import {
  getImgCates,
  fetchImages,
  getConfig,
  setConfig,
  editConfig
} from './webapi';
import PicActor from './actor/pic-actor';
import { IList } from '../../typings/globalType';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    // debug
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new SettingActor(), new ModalActor(), new PicActor()];
  }
  /**
   * 初始化
   */
  init = async () => {
    const config = await getConfig();
    const { res } = config as any;
    if (res.code == Const.SUCCESS_CODE) {
      const {
        businessConfigId,
        businessRegister,
        businessEnter,
        businessCustom,
        businessBanner,
        supplierRegister,
        supplierEnter,
        supplierCustom,
        supplierBanner
      } = res.context;
      this.setbusinessConfigId(businessConfigId);
      this.setRegisterContent(businessRegister);
      this.setSupplierRegisterContent(supplierRegister);
      this.setEnterContent(businessEnter);
      this.setSupplierEnterContent(supplierEnter);
      this.setBusinessBanner(businessBanner);
      this.setSupplierBanner(supplierBanner);
      this.dispatch('FormActor: businessContent', businessCustom);
      this.dispatch('FormActor: supplierContent', supplierCustom);
    } else {
      message.error(config.err);
    }
  };

  setBusinessBanner = (businessBanner) => {
    this.dispatch('FormActor: businessBanner', businessBanner);
  };

  setSupplierBanner = (supplierBanner) => {
    this.dispatch('FormActor: supplierBanner', supplierBanner);
  };

  setbusinessConfigId = (businessConfigId: number) => {
    this.dispatch('FormActor: businessConfigId', businessConfigId);
  };

  refDetailEditor = (businessEditor) => {
    this.dispatch('FormActor: businessEditor', businessEditor);
  };

  refRegisterEditor = (registerEditor) => {
    this.dispatch('ModalActor: registerEditor', registerEditor);
  };

  refEnterEditor = (enterEditor) => {
    this.dispatch('ModalActor: enterEditor', enterEditor);
  };

  /**
   * 商家自定义区富文本编辑器
   */
  refSupDetailEditor = (supplierEditor) => {
    this.dispatch('FormActor: supplierEditor', supplierEditor);
  };

  /**
   * 商家注册协议富文本编辑器
   */
  refSupRegisterEditor = (registerSupEditor) => {
    this.dispatch('ModalActor: registerSupEditor', registerSupEditor);
  };

  /**
   * 商家入驻协议富文本编辑器
   */
  refSupEnterEditor = (enterSupEditor) => {
    this.dispatch('ModalActor: enterSupEditor', enterSupEditor);
  };

  /**
   * 新增或编辑供应商provider招商设置信息
   */
  onSubmit = async () => {
    let data = this.state();    
    let businessConfigId = data.get('businessConfigId');
    //banner图
    let businessBanner = data.get('businessBanner');
    let supplierBanner = data.get('supplierBanner');
    //自定义区
    const businessEditor = data.get('businessEditor');
    const supplierEditor = data.get('supplierEditor'); 
    let businessCustom = businessEditor.getContent
    ? businessEditor.getContent()
    : '';
    let supplierCustom = supplierEditor.getContent
    ? supplierEditor.getContent()
    : '';
    //注册协议区
    const registerEditor = data.get('registerEditor') || {};
    const registerSupEditor = data.get('registerSupEditor') || {};
    let businessRegister = registerEditor.getContent
      ? registerEditor.getContent()
      : '';
    let supplierRegister = registerSupEditor.getContent
      ? registerSupEditor.getContent()
      : '';
    //入驻协议区
    const enterEditor = data.get('enterEditor') || {};
    const enterSupEditor = data.get('enterSupEditor') || {};
    let businessEnter = enterEditor.getContent ? enterEditor.getContent() : '';
    let supplierEnter = enterSupEditor.getContent ? enterSupEditor.getContent() : '';
    let result = {}; 
    //id存在，视为修改,统一保存
    let param ; 
    if (businessConfigId) {    
      //当前选中的是供应商provider标签页
      param = {
        businessConfigId: businessConfigId,
        businessBanner: businessBanner,
        businessCustom: businessCustom,
        businessRegister: businessRegister,
        businessEnter: businessEnter,
        supplierBanner: supplierBanner,
        supplierCustom: supplierCustom,
        supplierRegister: supplierRegister,
        supplierEnter: supplierEnter
      };
      result = await editConfig(param);
    } else {    
      //新增设置      
         param = {
          businessBanner: businessBanner,
          businessCustom: businessCustom,
          businessRegister: businessRegister,
          businessEnter: businessEnter,
          supplierBanner: supplierBanner,
          supplierCustom: supplierCustom,
          supplierRegister: supplierRegister,
          supplierEnter: supplierEnter
        };
      result = await setConfig(param);
    }
    let { res } = result as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('保存成功');      
        this.dispatch('FormActor: businessContent', businessCustom);
        this.setRegisterContent(businessRegister);
        this.setEnterContent(businessEnter);    
        this.dispatch('FormActor: supplierContent', supplierCustom);
        this.setSupplierRegisterContent(supplierRegister);
        this.setSupplierEnterContent(supplierEnter);      
    } else {
      message.error('保存失败');
    }
    this.init();
 }

  openModal = (title) => {
    let data = this.state();
    this.setModalTitle(title);
    this.setModalVisible(true);
    const businessEditor = data.get('businessEditor');
    let busseditor = businessEditor.getContent
      ? businessEditor.getContent()
      : '';
    this.dispatch('FormActor: businessContent', busseditor);
  };

  setModalTitle = (title: string) => {
    this.dispatch('ModalActor: modalTitle', title);
  };

  setModalVisible = (visible: boolean) => {
    this.dispatch('ModalActor: modalVisible', visible);
  };

  setRegisterContent = (businessRegister: string) => {
    this.dispatch('ModalActor: registerContent', businessRegister);
  };

  setSupplierRegisterContent = (supplierRegisterContent: string) => {
    this.dispatch(
      'ModalActor: supplierRegisterContent',
      supplierRegisterContent
    );
  };

  setEnterContent = (content: string) => {
    this.dispatch('ModalActor: enterContent', content);
  };

  setSupplierEnterContent = (content: string) => {
    this.dispatch('ModalActor: supplierEnterContent', content);
  };

  setModalSubmit = (title: string) => {
    if (title === Const.REGISTER_TITLE) {
      let data = this.state();
      const regEditor = data.get('registerEditor') || {};
      let editor = regEditor.getContent ? regEditor.getContent() : '';
      this.setRegisterContent(editor);
    } else {
      let data = this.state();
      const enterEditor = data.get('enterEditor') || {};
      let editor = enterEditor.getContent ? enterEditor.getContent() : '';
      this.setEnterContent(editor);
    }
  };

  setModalCancel = (title) => {
    this.setModalTitle(title);
    this.setModalVisible(false);
  };

  /**
   * 初始化
   */
  initImg = async (
    { pageNum, cateId, successCount } = {
      pageNum: 0,
      cateId: null,
      successCount: 0
    }
  ) => {
    const cateList: any = await getImgCates();
    const cateListIm = this.state().get('cateAllList');
    if (cateId == -1) {
      cateId = fromJS(cateList.res)
        .filter((item) => item.get('isDefault') == 1)
        .get(0)
        .get('cateId');
    }
    cateId = cateId ? cateId : this.state().get('cateId');
    const imageList: any = await fetchImages({
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

  setVisible = async (maxCount: number, imgType: number, skuId: string) => {
    if (this.state().get('visible')) {
      this.initImg({ pageNum: 0, cateId: '', successCount: 0 });
    }
    if (maxCount) {
      //取消时候, 该值为0, 不重置, 防止页面渲染太快, 看到数量变化不友好
      this.dispatch('modal: maxCount', maxCount);
    }
    this.dispatch('modal: visible', { imgType, skuId });
  };

  search = async (imageName: string) => {
    this.dispatch('modal: search', imageName);
  };

  /**
   * 点击搜索保存搜索内容
   * @param {string} searchName
   * @returns {Promise<void>}
   */
  saveSearchName = async (searchName: string) => {
    this.dispatch('modal: searchName', searchName);
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
  beSureImages = (editor) => {
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
      if (editor == 'business') {
        this.state()
          .get('businessEditor')
          .execCommand('insertimage', (chooseImgs || fromJS([])).toJS());
      }
      if (editor == 'registerEditor') {
        this.state()
          .get('registerEditor')
          .execCommand('insertimage', (chooseImgs || fromJS([])).toJS());
      }
      if (editor == 'enterEditor') {
        this.state()
          .get('enterEditor')
          .execCommand('insertimage', (chooseImgs || fromJS([])).toJS());
      }
      if (editor == 'supplier') {
        this.state()
          .get('supplierEditor')
          .execCommand('insertimage', (chooseImgs || fromJS([])).toJS());
      }
      if (editor == 'registerSupEditor') {
        this.state()
          .get('registerSupEditor')
          .execCommand('insertimage', (chooseImgs || fromJS([])).toJS());
      }
      if (editor == 'enterSupEditor') {
        this.state()
          .get('enterSupEditor')
          .execCommand('insertimage', (chooseImgs || fromJS([])).toJS());
      }
    }
  };

  /**
   * 清除选中的图片集合
   */
  cleanChooseImgs = () => {
    this.dispatch('modal: cleanChooseImg');
  };

  editEditor = (editor) => {
    this.dispatch('modal: editor', editor);
  };

  changeTab=(key)=>{
    this.dispatch('setting: changeTab', key);
  }
}
