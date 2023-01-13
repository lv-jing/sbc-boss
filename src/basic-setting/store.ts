import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import { fromJS, List } from 'immutable';
import { message } from 'antd';
import { cache, Const } from 'qmkit';

import SettingActor from './actor/setting-actor';
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
    return [new SettingActor(), new PicActor()];
  }

  init = async () => {
    const { res } = (await webapi.fetchSetting()) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('setting:init', fromJS(res.context));
    } else {
      message.error(res.message);
    }
  };

  /**
   * 点击按钮---新增/修改  基本信息
   * @param settings
   * @returns {Promise<void>}
   */
  editSetting = async (settings) => {
    settings.baseConfigId = this.state().getIn(['settings', 'baseConfigId']);
    let editor = this.state().get('regEditor');
    settings.registerContent = editor.getContent ? editor.getContent() : '';
    if (settings.baseConfigId) {
      const response = await webapi.editSetting(settings);
      if (!response) return;
      const { res } = response;
      if (res.code == Const.SUCCESS_CODE) {
        this.dispatch('setting:editSetting', fromJS(res).get('context'));
        sessionStorage.setItem(
          cache.SITE_LOGO,
          settings.pcLogo ? JSON.parse(settings.pcLogo)[0].url : ''
        );
        const ico = settings.pcIco ? JSON.parse(settings.pcIco)[0].url : '';
        const linkEle = document.getElementById('icoLink') as any;
        linkEle.href = ico;
        linkEle.type = 'image/x-icon';
        message.success('修改成功!');
      } else {
        message.error('修改失败!');
      }
    } else {
      const response = await webapi.saveSetting(settings);
      if (!response) return;
      const { res } = response;
      if (res.code == Const.SUCCESS_CODE) {
        this.dispatch('setting:saveSetting', fromJS(res).get('context'));
        message.success('保存成功!');
      } else {
        message.error('保存失败!');
      }
    }
  };

  /**
   * 基本配置form属性变更
   */
  settingFormChange = (key, value) => {
    this.dispatch('setting:editSetting', fromJS({ [key]: value }));
  };

  /**
   * 将editor ref对象存储到actor中
   */
  refEditor = (editor) => {
    this.dispatch('setting: regEditor', editor);
  };

  initImg = async (
    { pageNum, cateId, successCount } = {
      pageNum: 0,
      cateId: null,
      successCount: 0
    }
  ) => {
    console.log('cateId----1--->', cateId);
    const cateList: any = await webapi.getImgCates();
    const cateListIm = this.state().get('cateAllList');
    if (cateId == -1) {
      cateId = fromJS(cateList.res)
        .filter((item) => item.get('isDefault') == 1)
        .get(0)
        .get('cateId');
    }
    console.log('cateId----2--->', cateId);
    cateId = cateId ? cateId : this.state().get('cateId');
    console.log('cateId----3--->', cateId);
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
    console.log('visible----<>', this.state().get('visible'));
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
        .get('regEditor')
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
