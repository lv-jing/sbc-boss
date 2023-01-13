import { IOptions, Store } from 'plume2';
import { IList, IMap } from 'typings/globalType';
import { fromJS, List, Map } from 'immutable';
import { message } from 'antd';

import GoodsActor from './actor/goods-actor';
import SpecActor from './actor/spec-actor';
import FormActor from './actor/form-actor';
import ModalActor from './actor/modal-actor';
import { Const } from 'qmkit';
import { edit, fetchImages, getGoodsDetail, getImgCates } from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [
      new GoodsActor(),
      new SpecActor(),
      new FormActor(),
      new ModalActor()
    ];
  }

  /**
   * 初始化
   */
  init = async (goodsId?: string) => {
    if (goodsId) {
      // 编辑时获取商品详情，转换数据
      let goodsDetail: any = await getGoodsDetail(goodsId);
      this.transaction(() => {
        goodsDetail = fromJS(goodsDetail.res.context);
        // 商品基本信息
        let goodsInfo = goodsDetail.get('goodsInfo');
        let goods = goodsDetail.get('goods');

        this.dispatch('goodsActor: editGoods', goodsInfo);
        this.dispatch('goodsActor: spu', goods);

        // 规格
        let goodsSpecs = goodsDetail.get('goodsSpecs') || List();
        const goodsSpecDetails = goodsDetail.get('goodsSpecDetails');
        goodsSpecs = goodsSpecs.map((item) => {
          const specValues = goodsSpecDetails.filter(
            (detailItem) => detailItem.get('specId') == item.get('specId')
          );
          return item.set('specValues', specValues);
        });

        // 商品列表
        goodsInfo = goodsInfo.set('id', goodsInfo.get('goodsInfoId'));

        // 图片
        const images = goodsInfo.get('goodsInfoImg')
          ? [
              {
                uid: -1,
                name: 'sku',
                status: 'done',
                size: 10000,
                url: goodsInfo.get('goodsInfoImg'),
                artworkUrl: goodsInfo.get('goodsInfoImg')
              }
            ]
          : [];
        goodsInfo = goodsInfo.set('images', fromJS(images));

        const mockSpecDetailIds = goodsInfo.get('mockSpecDetailIds');
        const mockSpecIds = goodsInfo.get('mockSpecIds') || List();
        mockSpecIds.forEach((specId, index) => {
          const detailId = mockSpecDetailIds.get(index);
          const goodsSpecDetail = goodsSpecDetails.find(
            (item) => item.get('specDetailId') == detailId
          );
          goodsInfo = goodsInfo.set(
            'specId-' + specId,
            goodsSpecDetail.get('detailName')
          );
          goodsInfo = goodsInfo.set('specDetailId-' + specId, detailId);
        });
        let goodsList = List();
        goodsList = goodsList.push(goodsInfo);
        this.dispatch('goodsSpecActor: init', {
          goodsSpecs: goodsSpecs,
          goodsList
        });
      });
    }
  };

  /**
   * 修改商品基本信息
   */
  editGoods = (goods: IMap) => {
    this.dispatch('goodsActor: editGoods', goods);
  };

  /**
   * 修改商品属性
   */
  editGoodsItem = (id: string, key: string, value: any) => {
    this.dispatch('goodsSpecActor: editGoodsItem', { id, key, value });
  };

  updateSkuForm = (skuForm) => {
    this.dispatch('formActor:sku', skuForm);
  };

  updateAddedFlagForm = (addedFlagForm) => {
    this.dispatch('formActor:addedFlag', addedFlagForm);
  };

  /**
   * 对基本信息表单进行校验
   * @returns {boolean}
   * @private
   */
  _validMainForms() {
    let valid = true;
    // 校验表单
    this.state()
      .get('skuForm')
      .validateFieldsAndScroll(null, (errs) => {
        valid = valid && !errs;
        if (!errs) {
        }
      });
    return valid;
  }

  /**
   * 保存基本信息
   */
  saveMain = async () => {
    if (!this._validMainForms()) {
      return false;
    }

    const data = this.state();
    let param = Map();

    // -----商品信息-------
    let goodsInfo = data.get('goodsList').first();
    // 上下架
    goodsInfo = goodsInfo.set('addedFlag', data.getIn(['goods', 'addedFlag']));
    // 图片
    let imageUrl = null;
    if (
      goodsInfo.get('images') != null &&
      goodsInfo.get('images').count() > 0
    ) {
      imageUrl = goodsInfo.get('images').toJS()[0].artworkUrl;
    }
    goodsInfo = goodsInfo.set('goodsInfoImg', imageUrl);
    goodsInfo = goodsInfo.set(
      'marketPrice',
      data.getIn(['goods', 'marketPrice'])
    );
    goodsInfo = goodsInfo.set('costPrice', data.getIn(['goods', 'costPrice']));
    param = param.set('goodsInfo', goodsInfo);

    this.dispatch('goodsActor: saveLoading', true);

    let result: any;
    result = await edit(param.toJS());

    this.dispatch('goodsActor: saveLoading', false);

    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      return true;
    } else {
      message.error(result.res.message);
    }
    return false;
  };

  modalVisible = async (maxCount: number, imgType: number, skuId: string) => {
    if (this.state().get('visible')) {
      this.initImg({ pageNum: 0, cateId: '', successCount: 0 });
    }
    if (maxCount) {
      //取消时候, 该值为0, 不重置, 防止页面渲染太快, 看到数量变化不友好
      this.dispatch('modal: maxCount', maxCount);
    }
    this.dispatch('modal: visible', { imgType, skuId });
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

  /**
   * 放大还原图片
   */
  clickImg = (imgUrl: string) => {
    this.dispatch('modal: imgVisible', imgUrl);
  };

  /**
   * 移除图片
   * @param id
   */
  removeImg = ({ type, id }) => {
    if (type === 0) {
      this.dispatch('imageActor: remove', id);
    } else {
      this.dispatch('goodsSpecActor: removeImg', id);
    }
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
    const skuId = this.state().get('skuId');
    this.dispatch('goodsSpecActor: editGoodsItem', {
      id: skuId,
      key: 'images',
      value: chooseImgs
    });
  };

  /**
   * 清除选中的图片集合
   */
  cleanChooseImgs = () => {
    this.dispatch('modal: cleanChooseImg');
  };
}
