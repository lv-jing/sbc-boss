import { IOptions, Store } from 'plume2';
import { IList, IMap } from 'typings/globalType';
import { fromJS, List, Map } from 'immutable';
import { message } from 'antd';
import { Const } from 'qmkit';
import GoodsActor from './actor/goods-actor';
import ImageActor from './actor/image-actor';
import SpecActor from './actor/spec-actor';
import FormActor from './actor/form-actor';
import ModalImageActor from './actor/modal-actor';

import PropActor from './actor/prop-actor';
import CateResourceActor from './actor/cate-resource-actor';

import {
  edit,
  getBrandList,
  getCateIdsPropDetail,
  getCateList,
  getGoodsDetail,
  getResourceCates,
  fetchResource,
  save
} from './webapi';

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
      new ImageActor(),
      new SpecActor(),
      new FormActor(),
      new ModalImageActor(),
      new PropActor(),
      new CateResourceActor()
    ];
  }

  /**
   * 初始化
   */
  init = async (goodsId?: string) => {
    if (goodsId) {
      this.dispatch('goodsActor: isEditGoods', true);
      this._getGoodsDetail(goodsId);
      // 保证品牌分类等信息先加载完
      await Promise.all([getBrandList()]).then((results) => {
        this.dispatch(
          'goodsActor: initBrandList',
          fromJS((results[0].res as any).context)
        );
      });
    } else {
      // 新增商品，可以选择平台类目
      this.dispatch('goodsActor: disableCate', false);
      this.dispatch('goodsActor:randomGoodsNo');
      // 保证品牌分类等信息先加载完
      await Promise.all([getCateList(), getBrandList()]).then((results) => {
        this.dispatch(
          'goodsActor: initCateList',
          fromJS((results[0].res as any).context)
        );
        this.dispatch(
          'goodsActor: initBrandList',
          fromJS((results[1].res as any).context)
        );
      });
    }
  };

  /**
   *  编辑时获取商品详情，转换数据
   */
  _getGoodsDetail = async (goodsId?: string) => {
    let goodsDetail: any = await getGoodsDetail(goodsId);
    if (goodsDetail.res.code == Const.SUCCESS_CODE) {
      goodsDetail = fromJS(goodsDetail.res.context);
    } else {
      message.error('查询商品信息失败');
      return false;
    }
    this.transaction(() => {
      // 商品基本信息
      let goods = goodsDetail.get('goods');

      // 商品可能没有品牌，后面取值有toString等操作，空字符串方便处理
      if (!goods.get('brandId')) {
        goods = goods.set('brandId', '');
      }

      this.dispatch('goodsActor: editGoods', goods);
      this.dispatch(
        'goodsSpecActor: editSpecSingleFlag',
        goods.get('moreSpecFlag') == 0
      );

      // 商品图片
      let images = goodsDetail.get('images').map((image, index) => {
        return Map({
          uid: index,
          name: index,
          size: 1,
          status: 'done',
          artworkUrl: image.get('artworkUrl')
        });
      });
      //初始化图片和视频显示
      this.editImages(images);
      this.editVideo(goods.get('goodsVideo'));
      // 属性信息
      this.showGoodsPropDetail(
        goodsDetail.getIn(['goods', 'cateId']),
        goodsDetail.get('goodsPropDetailRels')
      );
      // 是否为多规格
      if (goodsDetail.getIn(['goods', 'moreSpecFlag']) == 1) {
        // 规格，按照id升序排列
        let goodsSpecs = goodsDetail.get('goodsSpecs').sort((o1, o2) => {
          return o1.get('specId') - o2.get('specId');
        });

        const goodsSpecDetails = goodsDetail.get('goodsSpecDetails');
        goodsSpecs = goodsSpecs.map((item) => {
          // 规格值列表，按照id升序排列
          const specValues = goodsSpecDetails
            .filter(
              (detailItem) => detailItem.get('specId') == item.get('specId')
            )
            .map((detailItem) => detailItem.set('isMock', false))
            .sort((o1, o2) => {
              return o1.get('specDetailId') - o2.get('specDetailId');
            });
          return item.set('specValues', specValues);
        });

        // 商品列表
        let goodsList = goodsDetail.get('goodsInfos').map((item, index) => {
          // 获取规格值并排序
          const mockSpecDetailIds = item.get('mockSpecDetailIds').sort();
          item.get('mockSpecIds').forEach((specId) => {
            // 规格值保存的顺序可能不是按照规格id的顺序，多个sku的规格值列表顺序是乱序，因此此处不能按照顺序获取规格值。只能从规格规格值对应关系里面去捞一遍。
            const detail = goodsSpecDetails.find(
              (detail) =>
                detail.get('specId') == specId &&
                item
                  .get('mockSpecDetailIds')
                  .contains(detail.get('specDetailId'))
            );
            const detailId = detail.get('specDetailId');

            const goodsSpecDetail = goodsSpecDetails.find(
              (d) => d.get('specDetailId') == detailId
            );
            item = item.set(
              'specId-' + specId,
              goodsSpecDetail.get('detailName')
            );
            item = item.set('specDetailId-' + specId, detailId);
            if (item.get('goodsInfoImg')) {
              item = item.set(
                'images',
                List([
                  Map({
                    uid: item.get('goodsInfoId'),
                    name: item.get('goodsInfoId'),
                    size: 1,
                    status: 'done',
                    artworkUrl: item.get('goodsInfoImg')
                  })
                ])
              );
            }
          });
          item = item.set('id', item.get('goodsInfoId'));
          item = item.set('skuSvIds', mockSpecDetailIds.join());
          item = item.set('index', index + 1);
          return item;
        });
        this.dispatch('goodsSpecActor: init', { goodsSpecs, goodsList });
      } else {
        // 商品列表
        let goodsList = List();
        goodsList = goodsDetail.get('goodsInfos').map((item) => {
          item = item.set('id', item.get('goodsInfoId'));
          if (item.get('goodsInfoImg')) {
            item = item.set(
              'images',
              List([
                Map({
                  uid: item.get('goodsInfoId'),
                  name: item.get('goodsInfoId'),
                  size: 1,
                  status: 'done',
                  artworkUrl: item.get('goodsInfoImg')
                })
              ])
            );
          }
          return item;
        });
        this.dispatch('goodsSpecActor: init', {
          goodsSpecs: List(),
          goodsList
        });
      }
    });
  };

  /**
   * 修改商品基本信息
   */
  editGoods = (goods: IMap) => {
    this.dispatch('goodsActor: editGoods', goods);
  };

  deleteGoodsInfo = (id: string) => {
    this.dispatch('goodsSpecActor: deleteGoodsInfo', id);
  };

  /**
   * 修改商品图片
   */
  editImages = (images: IList) => {
    this.dispatch('imageActor: editImages', images);
  };

  /**
   * 修改商品图片
   */
  editVideo = (video: String) => {
    this.dispatch('goodsActor: editVideo', video);
  };

  /**
   * 设置是否为单规格
   */
  editSpecSingleFlag = (specSingleFlag: boolean) => {
    this.dispatch('goodsSpecActor: editSpecSingleFlag', specSingleFlag);
  };

  /**
   * 修改规格名称
   */
  editSpecName = (specItem: { specId: number; specName: string }) => {
    this.dispatch('goodsSpecActor: editSpecName', specItem);
  };

  /**
   * 修改规格值
   */
  editSpecValues = (specItem: { specId: number; specValues: IList }) => {
    this.dispatch('goodsSpecActor: editSpecValues', specItem);
  };

  /**
   * 添加规格
   */
  addSpec = () => {
    this.dispatch('goodsSpecActor: addSpec');
  };

  /**
   * 添加规格
   */
  deleteSpec = (specId: number) => {
    this.dispatch('goodsSpecActor: deleteSpec', specId);
  };

  /**
   * 修改商品属性
   */
  editGoodsItem = (id: string, key: string, value: string) => {
    this.dispatch('goodsSpecActor: editGoodsItem', { id, key, value });
  };

  updateGoodsForm = (goodsForm) => {
    this.dispatch('formActor:goods', goodsForm);
  };

  /**
   * 更新运费模板表单
   */
  updateFreightForm = (freightForm) => {
    this.dispatch('formActor:freight', freightForm);
  };

  updateSkuForm = (skuForm) => {
    this.dispatch('formActor:sku', skuForm);
  };

  updateSpecForm = (specForm) => {
    this.dispatch('formActor:spec', specForm);
  };

  refDetailEditor = (detailEditor) => {
    this.dispatch('goodsActor: detailEditor', detailEditor);
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
      .get('goodsForm')
      .validateFieldsAndScroll(null, (errs) => {
        valid = valid && !errs;
      });
    this.state()
      .get('freightForm')
      .validateFieldsAndScroll(null, (errs) => {
        valid = valid && !errs;
      });
    this.state()
      .get('skuForm')
      .validateFieldsAndScroll(null, (errs) => {
        valid = valid && !errs;
      });
    if (
      this.state().get('specForm') &&
      this.state().get('specForm').validateFieldsAndScroll
    ) {
      this.state()
        .get('specForm')
        .validateFieldsAndScroll(null, (errs) => {
          valid = valid && !errs;
        });
    }

    return valid;
  }

  /**
   * 保存商品基本信息
   */
  saveAll = async () => {
    if (!this._validMainForms()) {
      return false;
    }

    const data = this.state();
    let param = Map();

    // -----商品信息-------
    let goods = data.get('goods');
    // 所有品牌列表
    const brandList = data.get('brandList');

    if (goods.get('cateId') === '-1') {
      message.error('请选择平台类目');
      return false;
    }

    if (goods.get('brandId') === '0') {
      message.error('请选择品牌');
      return false;
    }
    if (brandList && !brandList.find((b) => b === goods.get('brandId'))) {
      goods = goods.remove('brandId');
    }

    // 是否多规格标记
    goods = goods.set('moreSpecFlag', data.get('specSingleFlag') ? 0 : 1);
    // 详情
    const detailEditor = data.get('detailEditor') || {};
    goods = goods.set(
      'goodsDetail',
      detailEditor.getContent ? detailEditor.getContent() : ''
    );

    param = param.set('goods', goods);
    // 基本信息保存参数中要把priceType去掉 priceType-mark
    param = param.removeIn(['goods', 'priceType']);

    // -----商品相关图片-------
    const images = data.get('images').map((item) =>
      Map({
        artworkUrl: item.get('artworkUrl')
      })
    );

    param = param.set('images', images);

    // -----商品规格列表-------
    let goodsSpecs = data.get('goodsSpecs').map((item) => {
      return Map({
        specId: item.get('isMock') == true ? null : item.get('specId'),
        mockSpecId: item.get('specId'),
        specName: item.get('specName').trim()
      });
    });
    param = param.set('goodsSpecs', goodsSpecs);

    // -----商品属性列表-------
    let goodsPropDatil = List();
    let list = data.get('propDetail');
    if (list) {
      list.forEach((item) => {
        let { propId, goodsPropDetails } = item.toJS();
        goodsPropDetails = fromJS(goodsPropDetails);
        let goodsId = goods.get('goodsId');
        const propValue = goodsPropDetails.find(
          (i) => i.get('select') == 'select'
        );
        let detailId = propValue.get('detailId');
        goodsPropDatil = goodsPropDatil.push(
          Map({
            propId: propId,
            goodsId: goodsId,
            detailId: detailId
          })
        );
      });
      param = param.set('goodsPropDetailRels', goodsPropDatil);
    }
    // -----商品规格值列表-------
    let goodsSpecDetails = List();
    data.get('goodsSpecs').forEach((item) => {
      item.get('specValues').forEach((specValueItem) => {
        goodsSpecDetails = goodsSpecDetails.push(
          Map({
            specId: item.get('isMock') == true ? null : item.get('specId'),
            mockSpecId: item.get('specId'),
            specName: item.get('specName').trim(),
            specDetailId: specValueItem.get('isMock')
              ? null
              : specValueItem.get('specDetailId'),
            mockSpecDetailId: specValueItem.get('specDetailId'),
            detailName: specValueItem.get('detailName').trim()
          })
        );
      });
    });
    param = param.set('goodsSpecDetails', goodsSpecDetails);

    // -----商品SKU列表-------
    let skuNoMap = Map();
    let existedSkuNo = '';
    let goodsList = List();
    data.get('goodsSpecs').forEach((item) => {
      if (skuNoMap.has(item.get('specName') + '')) {
        existedSkuNo = item.get('specName') + '';
        return false;
      } else {
        skuNoMap = skuNoMap.set(item.get('specName') + '', '1');
      }
    });
    data.get('goodsList').forEach((item) => {
      // 规格id集合
      let mockSpecIds = List();
      // 规格值id集合
      let mockSpecDetailIds = List();
      item.forEach((value, key: string) => {
        if (key.indexOf('specId-') != -1) {
          mockSpecIds = mockSpecIds.push(parseInt(key.split('-')[1]));
        }
        if (key.indexOf('specDetailId') != -1) {
          mockSpecDetailIds = mockSpecDetailIds.push(value);
        }
      });
      let imageUrl = null;
      if (item.get('images') != null && item.get('images').count() > 0) {
        imageUrl = item.get('images').toJS()[0].artworkUrl;
      }
      goodsList = goodsList.push(
        Map({
          goodsInfoId: item.get('goodsInfoId') ? item.get('goodsInfoId') : null,
          goodsInfoBarcode: item.get('goodsInfoBarcode'),
          marketPrice: item.get('marketPrice'),
          mockSpecIds,
          mockSpecDetailIds,
          goodsInfoImg: imageUrl
        })
      );
    });
    if (goodsList.count() === 0) {
      message.error('SKU不能为空');
      return false;
    }
    if (existedSkuNo) {
      message.error('规格名称重复');
      return false;
    }
    if (goodsList.count() > Const.spuMaxSku) {
      message.error(`SKU数量不超过${Const.spuMaxSku}个`);
      return false;
    }
    param = param.set('goodsInfos', goodsList);

    this.dispatch('goodsActor: saveLoading', true);

    let result: any;
    if (goods.get('goodsId')) {
      result = await edit(param.toJS());
    } else {
      result = await save(param.toJS());
    }

    this.dispatch('goodsActor: saveLoading', false);

    if (result.res.code === Const.SUCCESS_CODE) {
      // 新增商品后得到保存后的商品编号
      if (!goods.get('goodsId')) {
        goods = goods.set('goodsId', result.res.context);
      }

      this.dispatch('goodsActor: editGoods', goods);

      message.success('操作成功');

      return true;
    } else {
      message.error(result.res.message);
    }
    return false;
  };

  /**
   * 更新是否批量设置市场价
   */
  updateMarketPriceChecked = async (checked?: boolean) => {
    this.dispatch('goodsSpecActor: updateMarketPriceChecked', checked);
  };

  /**
   * 同步市场价
   */
  synchMarketPrice = async () => {
    this.dispatch('goodsSpecActor: synchMarketPrice');
  };

  /**
   * 初始化
   */
  initResource = async (
    { pageNum, pageSize, cateId } = {
      pageNum: 0,
      pageSize: 10,
      cateId: null
    }
  ) => {
    const cateList: any = await getResourceCates();
    const cateListIm = fromJS(cateList.res);
    if (cateId == -1) {
      cateId = cateListIm
        .find((item) => item.get('isDefault') == 1)
        .get('cateId');
    }
    cateId = cateId ? cateId : this.state().get('cateId');
    const imageList: any = await fetchResource({
      pageNum,
      pageSize,
      resourceName: this.state().get('searchName'),
      cateId: cateId,
      resourceType: 0
    });
    //2.查询视频分页信息
    const videoList: any = await fetchResource({
      pageNum,
      pageSize,
      resourceName: this.state().get('videoSearchName'),
      cateId: cateId,
      resourceType: 1
    });
    //选择图片弹框分类信息
    if (imageList.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        if (cateId) {
          this.dispatch('cateActor: cateIds', List.of(cateId.toString()));
          this.dispatch('cateActor: cateId', cateId.toString());
        }
        this.dispatch('cateActor: init', fromJS(cateList.res));
        this.dispatch('modal: imgs', fromJS(imageList.res.context));
        this.dispatch(
          'modal: page',
          fromJS({ currentPage: pageNum + 1, resourceType: 0 })
        );
      });
    } else {
      message.error(imageList.res.message);
    }

    if (videoList.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        if (cateId) {
          this.selectVideoCate(cateId);
        }
        this.dispatch('modal: videos', fromJS(videoList.res.context)); //初始化视频分页列表
        this.dispatch(
          'modal: page',
          fromJS({ currentPage: pageNum + 1, resourceType: 1 })
        );
      });
    } else {
      message.error(videoList.res.message);
    }
  };

  editCateId = async (value: string) => {
    this.dispatch('cateActor: cateId', value);
  };

  /**
   * 修改选中分类
   * @param value
   * @returns {Promise<void>}
   */
  editDefaultCateId = async (value: string) => {
    this.dispatch('cateActor: cateIds', List.of(value));
  };

  editVideoCateId = async (value: string) => {
    this.dispatch('cateActor: videoCateId', value);
  };

  /**
   * 修改选中视频分类
   * @param value
   * @returns {Promise<void>}
   */
  editVideoDefaultCateId = async (value: string) => {
    this.dispatch('cateActor: videoCateIds', List.of(value));
  };

  modalVisible = async (maxCount: number, imgType: number, skuId: string) => {
    if (this.state().get('visible') || this.state().get('tvisible')) {
      let resourceType = this.state().get('visible')
        ? 0
        : this.state().get('tvisible')
        ? 1
        : null;
      this.queryResourcePage({
        pageNum: 0,
        pageSize: 10,
        resourceType: resourceType,
        successCount: 0
      });
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

  videoSearch = async (videoName: string) => {
    this.dispatch('modal: videoSearch', videoName);
  };

  /**
   * 图片弹框,点击搜索保存搜索内容
   * @param {string} searchName
   * @returns {Promise<void>}
   */
  saveSearchName = async (searchName: string) => {
    this.dispatch('modal: searchName', searchName);
  };

  /**
   * 视频弹框,点击搜索保存搜索内容
   * @param {string} searchName
   * @returns {Promise<void>}
   */
  saveVideoSearchName = async (videoSearchName: string) => {
    this.dispatch('modal: videoSearchName', videoSearchName);
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
        .get('detailEditor')
        .execCommand('insertimage', (chooseImgs || fromJS([])).toJS());
    }
  };

  /**
   * 确定选择以上视频
   */
  beSureVideos = () => {
    const chooseVideo = this.state().get('chooseVideos');
    if (!chooseVideo.isEmpty()) {
      this.dispatch(
        'goodsActor: editVideo',
        chooseVideo.get(0).get('artworkUrl')
      );
    }
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

  /**
   * 移除视频
   * @param id
   */
  removeVideo = () => {
    this.dispatch('goodsActor: deleteVideo');
  };

  /**
   * 清除选中的图片集合
   */
  cleanChooseImgs = () => {
    this.dispatch('modal: cleanChooseImg');
  };

  /**
   * 清除选中的视频
   */
  cleanChooseVideo = () => {
    this.dispatch('modal: cleanChooseVideo');
  };
  /**
   * 对应类目、商品下的所有属性信息
   */
  showGoodsPropDetail = async (cateId, goodsPropList) => {
    if (!cateId) {
      this.dispatch('propActor: clear');
    } else {
      const result: any = await getCateIdsPropDetail(cateId);
      if (result.res.code === Const.SUCCESS_CODE) {
        let catePropDetail = fromJS(result.res.context);
        //类目属性中的属性值没有其他，拼接一个其他选项
        catePropDetail = catePropDetail.map((prop) => {
          let goodsPropDetails = prop.get('goodsPropDetails').push(
            fromJS({
              detailId: '0',
              detailName: '其他',
              select: 'select'
            })
          );
          return prop.set('goodsPropDetails', goodsPropDetails);
        });
        //将商品中的属性与属性值信息映射到类目属性里
        if (
          goodsPropList &&
          catePropDetail.size > 0 &&
          goodsPropList.size > 0
        ) {
          goodsPropList.forEach((item) => {
            const { detailId, propId } = item.toJS();
            const index = catePropDetail.findIndex(
              (p) => p.get('propId') === propId
            );
            if (index > -1) {
              let detailList = catePropDetail
                .getIn([index, 'goodsPropDetails'])
                .map((d) => {
                  if (d.get('detailId') == detailId) {
                    return d.set('select', 'select');
                  }
                  return d.set('select', '');
                });
              catePropDetail = catePropDetail.setIn(
                [index, 'goodsPropDetails'],
                detailList
              );
            }
          });
        }
        this.dispatch(
          'propActor: setPropList',
          this._changeList(catePropDetail)
        );
        this.dispatch('propActor: goodsPropDetails', catePropDetail);
      }
    }
  };

  /**
   * 将数组切为每两个元素为一个对象的新数组
   * @param propDetail
   * @private
   */
  _changeList(propDetail) {
    const newGoodsProps = new Array();
    let propArr = new Array();
    for (let i = 0; i < propDetail.size; i++) {
      if (i % 2 == 0) {
        propArr = new Array();
        newGoodsProps.push(propArr);
      }
      propArr.push(propDetail.get(i));
    }
    return fromJS(newGoodsProps);
  }

  changePropVal = (val) => {
    this.dispatch('propActor: change', val);
  };

  /**
   * 选中某个分类
   * @param cateId
   */
  selectVideoCate = (cateId) => {
    if (cateId) {
      this.dispatch('cateActor: videoCateIds', List.of(cateId.toString())); //选中的分类id List
      this.dispatch('cateActor: videoCateId', cateId.toString()); //选中的分类id
    } else {
      this.dispatch('cateActor: videoCateIds', List()); //全部
      this.dispatch('cateActor: videoCateId', ''); //全部
    }
  };

  /**
   * 单选
   * @param index
   * @param checked
   */
  onCheckedVideo = ({ video, checked }) => {
    this.dispatch('modal: checkVideo', { video, checked });
  };
  /**
   * 查询视频信息分页列表
   */
  queryResourcePage = async (
    { pageNum, pageSize, resourceType, successCount } = {
      pageNum: 0,
      pageSize: 10,
      resourceType: 0,
      successCount: 0
    }
  ) => {
    const cateListIm = this.state().get('resCateAllList');
    let cateId;
    if (resourceType == 0) {
      cateId = this.state().get('cateId'); //之前选中的图片分类
    } else if (resourceType == 1) {
      cateId = this.state().get('videoCateId'); //之前选中视频分类
    }

    //查询视频分页信息
    const resourceList: any = await fetchResource({
      pageNum,
      pageSize,
      resourceName: this.state().get('searchName'),
      cateIds: this._getCateIdsList(cateListIm, cateId),
      resourceType: resourceType
    });
    if (resourceList.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        if (successCount > 0) {
          this.dispatch(
            'modal: chooseFiles',
            fromJS({
              successImgs: fromJS(resourceList.res.context)
                .get('content')
                .slice(0, successCount),
              resourceType: resourceType
            })
          );
        }
        if (resourceType == 0) {
          this.dispatch('modal: imgs', fromJS(resourceList.res.context));
        } else {
          this.dispatch('modal: videos', fromJS(resourceList.res.context));
        }
        this.dispatch(
          'modal: page',
          fromJS({ currentPage: pageNum + 1, resourceType: resourceType })
        );
      });
    } else {
      message.error(resourceList.res.message);
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
}
