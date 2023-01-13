import { IOptions, Store } from 'plume2';
import { IList, IMap } from 'typings/globalType';
import { fromJS, List, Map, OrderedMap } from 'immutable';
import { message } from 'antd';
import { Const, history, util, cache, ValidConst } from 'qmkit';

import GoodsActor from './actor/goods-actor';
import ImageActor from './actor/image-actor';
import SpecActor from './actor/spec-actor';
import PriceActor from './actor/price-actor';
import UserActor from './actor/user-actor';
import FormActor from './actor/form-actor';
import BrandActor from './actor/brand-actor';
import CateActor from './actor/cate-actor';
import ModalActor from './actor/modal-actor';
import PropActor from './actor/prop-actor';
import FreightActor from './actor/freight-actor';
import relatedActor from './actor/related';
import LoadingActor from './actor/loading-actor';
import { RCi18n } from 'qmkit';
import {
  addAll,
  addBrand,
  addCate,
  checkSalesType,
  edit,
  editAll,
  fetchImages,
  fetchResource,
  freightList,
  getBossUserLevelList,
  getBossUserList,
  getBossUserListByName,
  getBrandList,
  getCateIdsPropDetail,
  getCateList,
  getGoodsDetail,
  getImgCates,
  getResourceCates,
  getStoreCateList,
  getStoreGoodsTab,
  getUserLevelList,
  getUserList,
  goodsFreight,
  goodsFreightExpress,
  isFlashsele,
  save,
  toGeneralgoods,
  fetchBossCustomerList,
  fetchCustomerList,
  checkEnterpriseType,
  enterpriseToGeneralgoods,
  getDetailTab,
  getStoreCode,
  getRelatedList,
  fetchPropSort,
  fetchConsentDelete,
  fetchAdd,
  fetchproductTooltip,
  fetchFiltersTotal,
  getSeo,
  editSeo,
  fetchTaggingTotal,
  getDescriptionTab
} from './webapi';
import config from '../../web_modules/qmkit/config';
import * as webApi from '@/shop/webapi';
import { getEditProductResource, getPreEditProductResource } from '../goods-add/webapi';
let _tempGoodsDescriptionDetailList:any={}
export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [new GoodsActor(), new ImageActor(), new SpecActor(), new PriceActor(), new UserActor(), new FormActor(), new BrandActor(), new CateActor(), new ModalActor(), new PropActor(), new FreightActor(), new relatedActor(), new LoadingActor()];
  }

  /**
   * 初始化
   */
  init = async (goodsId?: string, storeId?: any) => {
    // 保证品牌分类等信息先加载完
    this.dispatch('loading:start');
    let loginInfo = JSON.parse(sessionStorage.getItem('s2b-supplier@login'));
    let params = {
      flashSaleGoodsListRequest: {
        goodsId: goodsId,
        queryDataType: 3
      },
      sysDictionaryQueryRequest: {
        storeId: storeId,
        type: 'goodsDetailTab'
      },
      storeGoodsFilterListRequest: {
        filterStatus: '1',
        storeId: storeId
      }
    };
    let resource = {
      enterpriseCheck: { goodsId },
      storeCateByCondition: {}
    };

    let editResource: any;
    let editProductResource: any;
    await Promise.all([getPreEditProductResource(params), getEditProductResource(resource)]).then((results) => {
      if ((results[0].res as any).code === Const.SUCCESS_CODE) {
        this.transaction(() => {
          this.dispatch('goodsActor: initCateList', fromJS((results[0].res as any).context.cateList));
          this.dispatch('goodsActor:getGoodsCate', fromJS((results[0].res as any).context.storeCateByCondition.storeCateResponseVOList));
          this.dispatch('goodsActor: initBrandList', fromJS((results[0].res as any).context.brandList));
          this.dispatch('formActor:check', fromJS((results[0].res as any).context.distributionCheck));
          this.dispatch('goodsActor:flashsaleGoods', fromJS((results[0].res as any).context.flashsalegoodsList.flashSaleGoodsVOList));
          this.dispatch('goodsActor: setGoodsDetailTab', fromJS((results[0].res as any).context.querySysDictionary));

          this.dispatch('goodsActor:purchaseTypeList', (results[0].res as any).context.purchase_type.sysDictionaryPage.content);
          this.dispatch('goodsActor:frequencyList', {
            autoShip: {
              dayList: (results[0].res as any).context.frequency_day ? (results[0].res as any).context.frequency_day.sysDictionaryPage.content : [],
              weekList: (results[0].res as any).context.frequency_week ? (results[0].res as any).context.frequency_week.sysDictionaryPage.content : [],
              monthList: (results[0].res as any).context.frequency_month ? (results[0].res as any).context.frequency_month.sysDictionaryPage.content : [],
            },
            club: {
              dayClubList: (results[0].res as any).context.frequency_day_club ? (results[0].res as any).context.frequency_day_club.sysDictionaryPage.content : [],
              weekClubList: (results[0].res as any).context.frequency_week_club ? (results[0].res as any).context.frequency_week_club.sysDictionaryPage.content : [],
              monthClubList: (results[0].res as any).context.frequency_month_club ? (results[0].res as any).context.frequency_month_club.sysDictionaryPage.content : []
            },
            individual: {
              dayIndividualList: (results[0].res as any).context.frequency_day_individual ? (results[0].res as any).context.frequency_day_individual.sysDictionaryPage.content : [],
              weekIndividualList: (results[0].res as any).context.frequency_week_individual ? (results[0].res as any).context.frequency_week_individual.sysDictionaryPage.content : [],
              monthIndividualList: (results[0].res as any).context.frequency_month_individual ? (results[0].res as any).context.frequency_month_individual.sysDictionaryPage.content : []
            }
          });

          this.dispatch('related:relatedList', fromJS((results[0].res as any).context.goodsRelation.relationGoods ? (results[0].res as any).context.goodsRelation.relationGoods : []));
          this.dispatch('goodsActor:filtersTotal', fromJS((results[0].res as any).context.filtersTotal));
          this.dispatch('goodsActor:taggingTotal', fromJS((results[0].res as any).context.taggingTotal));
          this.dispatch('goodsActor:resourceCates', (results[0].res as any).context.resourceCates);

          this.dispatch('related:goodsId', goodsId);
          this.dispatch('goodsActor:getGoodsId', goodsId);
        });
      } else {
        this.dispatch('loading:end');
      }
      editProductResource = results[1].res as any;
    });

    editResource = editProductResource.context;
    // 如果是编辑则判断是否有企业购商品
    if (goodsId) {
      this.dispatch('formActor:enterpriseFlag', fromJS(editResource.enterpriseCheck).get('checkFlag'));
    } else {
      this.dispatch('formActor:enterpriseFlag', false);
    }

    let userList: any;
    if (util.isThirdStore()) {
      userList = editResource.allCustomers || [];
    } else {
      userList = editResource.allBossCustomers || [];
    }

    const sourceUserList = fromJS(userList);
    this.dispatch('userActor: setUserList', sourceUserList);
    this.dispatch('userActor: setSourceUserList', sourceUserList);

    let newLevelList = [];
    if (util.isThirdStore()) {
      const userLevelList: any = await getUserLevelList();
      userLevelList.res.context.storeLevelVOList.map((v) => {
        newLevelList.push({
          customerLevelId: v.storeLevelId,
          customerLevelName: v.levelName,
          customerLevelDiscount: v.discountRate
        });
      });
    } else {
      newLevelList = editResource.listBoss.customerLevelVOList;
    }

    const userLevel = {
      customerLevelId: 0,
      customerLevelName: 'Platform wide customers',
      customerLevelDiscount: 1
    };
    newLevelList.unshift(userLevel);
    this.dispatch('userActor: setUserLevelList', fromJS(newLevelList));
    this.dispatch('priceActor: setUserLevelList', fromJS(newLevelList));
    if (goodsId) {
      this.dispatch('goodsActor: isEditGoods', true);
      await this._getGoodsDetail(editProductResource);
    } else {
      // 新增商品，可以选择平台类目
      localStorage.setItem('storeCode', editResource.getStoreCode);
      this.dispatch('goodsActor: disableCate', false);
      this.dispatch('goodsActor:randomGoodsNo', editResource.getStoreCode);
      this.dispatch('loading:end');
      const storeGoodsTab = editResource.storeGoodsTab;
      const tabs = [];
      storeGoodsTab.forEach((info) => {
        if (info.isDefault !== 1) {
          tabs.push({
            tabId: info.tabId,
            tabName: info.tabName,
            tabDetail: ''
          });
        }
      });
      this.dispatch('goodsActor: goodsTabs', tabs);
    
      //新增产品，初始化价格为0
      const goodsList = this.state().get('goodsList');
      if (goodsList) {
        goodsList.forEach((item) => {
          this.editGoodsItem(item.id, 'marketPrice', '0');
          this.editGoodsItem(item.id, 'subscriptionPrice', '0');
        });
      }
    }
    //初始化素材
    this.initImg({
      pageNum: 0,
      cateId: -1,
      successCount: 0
    });
    this.initVideo({
      pageNum: 0,
      cateId: -1,
      successCount: 0
    });
  };

  /**
   * 初始化
   */
  initVideo = async (
    { pageNum, cateId, successCount } = {
      pageNum: 0,
      cateId: null,
      successCount: 0
    }
  ) => {
    const cateList: any = this.state().get('resourceCates');
    const cateListIm = this.state().get('resCateAllList');
    if (cateId == -1 && cateList.length > 0) {
      cateId = fromJS(cateList)
        .find((item) => item.get('isDefault') == 1)
        .get('cateId');
    }
    cateId = cateId ? cateId : this.state().get('videoCateId').toJS();

    //查询视频分页信息
    const videoList: any = await fetchResource({
      pageNum,
      pageSize: 10,
      resourceName: this.state().get('videoSearchName'),
      cateIds: this._getCateIdsList(cateListIm, cateId),
      resourceType: 1
    });

    if (videoList.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        if (cateId) {
          this.selectVideoCate(cateId);
        }
        this.dispatch('cateActor: init', fromJS(cateList));
        if (successCount > 0) {
          //表示上传成功之后需要选中这些图片
          this.dispatch('modal: chooseVideos', fromJS(videoList.res.context).get('content').slice(0, successCount));
        }
        this.dispatch('modal: videos', fromJS(videoList.res.context)); //初始化视频分页列表
        this.dispatch('modal: page', fromJS({ currentPage: pageNum + 1, resourceType: 1 }));
      });
    } else {
      message.error(videoList.res.message);
    }
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
    const cateList: any = this.state().get('resourceCates');
    const cateListIm = this.state().get('resCateAllList');
    if (cateId == -1 && cateList.length > 0) {
      const cateIdList = fromJS(cateList).filter((item) => item.get('isDefault') == 1);
      if (cateIdList.size > 0) {
        cateId = cateIdList.get(0).get('cateId');
      }
    }
    cateId = cateId ? cateId : this.state().get('cateId');
    const imageList: any = await fetchImages({
      pageNum,
      pageSize: 10,
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
        this.dispatch('modal: imgCates', fromJS(cateList));
        if (successCount > 0) {
          //表示上传成功之后需要选中这些图片
          this.dispatch('modal: chooseImgs', fromJS(imageList.res.context).get('content').slice(0, successCount));
        }
        this.dispatch('modal: imgs', fromJS(imageList.res.context));
        this.dispatch('modal: page', fromJS({ currentPage: pageNum + 1, resourceType: 0 }));
      });
    } else {
      message.error(imageList.res.message);
    }
  };

  /**
   *  编辑时获取商品详情，转换数据
   */
  _getGoodsDetail = async (resource) => {
    let resource1 = {};
    resource1 = Object.assign({}, resource, { context: resource.context.spu });
    let goodsDetail = resource1 as any;
    localStorage.setItem('storeCode', resource.context.getStoreCode);
    // let storeCateList: any;
    let tmpContext = goodsDetail.context;
    let storeCateList: any = resource.context.storeCateByCondition;
    this.dispatch('loading:end');
    this.dispatch('goodsActor: initStoreCateList', fromJS(storeCateList.storeCateResponseVOList));
    this.dispatch('goodsSpecActor: selectedBasePrice', tmpContext.weightValue || '');

    // 合并多属性字段
    let goodsPropDetailRelsOrigin = [];

    if (tmpContext.goodsAttributesValueRelList) {
      tmpContext.goodsAttributesValueRelList.map((x) => {
        goodsPropDetailRelsOrigin.push({
          propId: x.goodsAttributeId,
          detailId: x.goodsAttributeValueId
        });
      });
    }

    if (goodsPropDetailRelsOrigin) {
      let tmpGoodsPropDetailRels = [];
      goodsPropDetailRelsOrigin.forEach((item) => {
        let tmpItem = tmpGoodsPropDetailRels.find((t) => t.propId === item.propId);
        if (tmpItem) {
          tmpItem.detailIds.push(item.detailId);
        } else {
          item.detailIds = [item.detailId];
          tmpGoodsPropDetailRels.push(item);
        }
      });
      tmpContext.goodsPropDetailRels = tmpGoodsPropDetailRels;
    }
    let productFilter = tmpContext.filterList
      ? tmpContext.filterList.map((x) => {
        return {
          filterId: x.filterId,
          filterValueId: x.id
        };
      })
      : [];
    this.onProductFilter(productFilter);

    let taggingIds = tmpContext.taggingList
      ? tmpContext.taggingList.map((x) => {
        return { taggingId: x.id };
      })
      : [];

    this.onGoodsTaggingRelList(taggingIds);

    goodsDetail = fromJS(tmpContext);
    if (tmpContext && tmpContext.goodsInfos && tmpContext.goodsInfos.length > 0) {
      let addSkUProduct = tmpContext.goodsInfos.map((item) => {
        return {
          pid: item.goodsInfoNo,
          targetGoodsIds: item.goodsInfoBundleRels,
          minStock: item.stock
        };
      });
      this.dispatch('sku:addSkUProduct', addSkUProduct);
    }
    // let addSkUProduct =
    //   tmpContext.goodsInfos &&
    //   tmpContext.goodsInfos.map((item) => {
    //     return {
    //       pid: item.goodsInfoNo,
    //       targetGoodsIds: item.goodsInfoBundleRels,
    //       minStock: item.stock
    //     };
    //   });
    this.transaction(() => {
      // 可能只保存了基本信息没有设价方式，价格tab中由需要默认选中按客户设价
      // 这里给一个默认值2，保存基本信息的时候不能传这个值，要过滤掉 priceType-mark
      if (goodsDetail.getIn(['goods', 'priceType']) == null) {
        goodsDetail = goodsDetail.setIn(['goods', 'priceType'], 2);
      }

      // 商品基本信息
      let goods = goodsDetail.get('goods');
      //设置编辑器是否为空数组，是空数组，根据cateId去查找，不为空，直接展示
      if (!tmpContext.goodsDescriptionDetailList || tmpContext.goodsDescriptionDetailList.length === 0) {
        const cateId = goods.get('cateId');
        this.changeDescriptionTab(cateId);
      } else {
        _tempGoodsDescriptionDetailList={
          _cateId:goods.get('cateId'),
          _list:tmpContext.goodsDescriptionDetailList
        }
        this.editEditorContent(tmpContext.goodsDescriptionDetailList);
      }

      // 如果不是已审核状态，都可以编辑平台类目
      this.dispatch('goodsActor: disableCate', goods.get('auditStatus') == 1);

      let id = goods.get('goodsNo');
      goods = goods.set('internalGoodsNo', resource.context.getStoreCode + '_' + id);

      // 商品可能没有品牌，后面取值有toString等操作，空字符串方便处理
      if (!goods.get('brandId')) {
        goods = goods.set('brandId', '');
      }
      if (goods.get('freightTempId')) {
        this.setGoodsFreight(goods.get('freightTempId'), true);
      }

      goods.set('resource', tmpContext.goods.resource);

      this.dispatch('goodsActor: editGoods', goods);

      //this.dispatch('goodsActor: goodsDetailTabContentOld', goods.get('goodsDetail'));
      this.dispatch('goodsSpecActor: editSpecSingleFlag', goodsDetail.getIn(['goods', 'moreSpecFlag']) == 0);

      // 商品图片
      let images = goodsDetail.get('images').map((image, index) => {
        return Map({
          uid: index,
          name: index,
          size: 1,
          status: 'done',
          imageId: image.get('imageId'),
          imageType: image.get('imageType'),
          artworkUrl: image.get('artworkUrl')
        });
      });
      this.editImages(images);

      let videoObj = Map({
        uid: 0,
        size: 1,
        status: 'done',
        artworkUrl: goods.get('goodsVideo')
      });
      this.dispatch('imageActor: editVideo', videoObj);

      // const tabs = [];
      // if (goodsDetail.get('storeGoodsTabs')) {
      //   goodsDetail.get('storeGoodsTabs').forEach((info) => {
      //     tabs.push({
      //       tabId: info.get('tabId'),
      //       tabName: info.get('tabName'),
      //       tabDetail:
      //         goodsDetail.get('goodsTabRelas').find((tabInfo) => tabInfo.get('tabId') === info.get('tabId')) &&
      //         goodsDetail
      //           .get('goodsTabRelas')
      //           .find((tabInfo) => tabInfo.get('tabId') === info.get('tabId'))
      //           .get('tabDetail')
      //     });
      //   });
      // }

      // this.dispatch('goodsActor: goodsTabs', tabs);
      // 属性信息
      this.showGoodsPropDetail(goodsDetail.getIn(['goods', 'cateId']), goodsDetail.get('goodsPropDetailRels'), goodsDetail.getIn(['goods', 'storeId']));
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
            .filter((detailItem) => detailItem.get('specId') == item.get('specId'))
            .map((detailItem) => detailItem.set('isMock', false).set('goodsPromotions', goods.get('promotions') || 'autoship'))
            .sort((o1, o2) => {
              return o1.get('specDetailId') - o2.get('specDetailId');
            });
          return item.set('specValues', specValues);
        });

        // 商品列表
        let basePriceType;
        
        let goodsList = goodsDetail.get('goodsInfos').map((item, index) => {
          // 获取规格值并排序
          const mockSpecDetailIds = item.get('mockSpecDetailIds').sort();
          basePriceType = item.get('basePriceType') ? Number(item.get('basePriceType')) : 0;
          item.get('mockSpecIds').forEach((specId) => {
            // 规格值保存的顺序可能不是按照规格id的顺序，多个sku的规格值列表顺序是乱序，因此此处不能按照顺序获取规格值。只能从规格规格值对应关系里面去捞一遍。
            const detail = goodsSpecDetails.find((detail) => detail.get('specId') == specId && item.get('mockSpecDetailIds').contains(detail.get('specDetailId')));

            if(detail) {
              const detailId = detail.get('specDetailId');
              const goodsSpecDetail = goodsSpecDetails.find((d) => d.get('specDetailId') == detailId);
              item = item.set('specId-' + specId, goodsSpecDetail.get('detailName'));
              item = item.set('specDetailId-' + specId, goodsSpecDetail.get('mockSpecDetailId'));
            }

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
          item = item.set('skuSvIds', mockSpecDetailIds);
          item = item.set('index', index + 1);
          return item;
        });
        this.dispatch('goodsSpecActor: init', {
          goodsSpecs,
          goodsList,
          baseSpecId: basePriceType || 0
        });
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
          goodsList,
          baseSpecId: goods.get('baseSpec') || 0
        });
      }

      // 解析价格数据
      this._getPriceInfo(goodsDetail);
    });
  };

  /**
   * 解析设价信息
   * @param {any} goodsDetail
   * @returns {Promise<void>}
   * @private
   */
  _getPriceInfo = async (goodsDetail) => {
    // 价格
    const priceOpt = goodsDetail.getIn(['goods', 'saleType']) === 1 && goodsDetail.getIn(['goods', 'priceType']) === 1 ? 2 : goodsDetail.getIn(['goods', 'priceType']);
    const openUserPrice = goodsDetail.getIn(['goods', 'customFlag']) == 1;
    const levelDiscountFlag = goodsDetail.getIn(['goods', 'levelDiscountFlag']) == 1;
    this.dispatch('priceActor: editPriceSetting', {
      key: 'priceOpt',
      value: priceOpt
    });
    this.dispatch('priceActor: editPriceSetting', {
      key: 'mtkPrice',
      value: goodsDetail.getIn(['goods', 'marketPrice'])
    });
    this.dispatch('priceActor: editPriceSetting', {
      key: 'costPrice',
      value: goodsDetail.getIn(['goods', 'costPrice'])
    });
    this.dispatch('priceActor: editPriceSetting', {
      key: 'openUserPrice',
      value: openUserPrice
    });
    this.dispatch('priceActor: editPriceSetting', {
      key: 'levelDiscountFlag',
      value: levelDiscountFlag
    });

    // 级别价
    let levelPriceMap = Map();
    if (goodsDetail.get('goodsLevelPrices') != null) {
      goodsDetail.get('goodsLevelPrices').forEach((item) => {
        levelPriceMap = levelPriceMap.set(item.get('levelId') + '', item);
      });
    }
    this.dispatch('priceActor: initPrice', {
      key: 'userLevelPrice',
      priceMap: levelPriceMap
    });

    if (priceOpt == 0) {
      // 密价
      if (openUserPrice) {
        let customerList: any;
        const customerIds = goodsDetail.get('goodsCustomerPrices').map((item) => {
          return item.get('customerId');
        });
        if (util.isThirdStore()) {
          const list: any = await fetchCustomerList(customerIds);
          customerList = fromJS(list.res.context.detailResponseList);
        } else {
          const list: any = await fetchBossCustomerList(customerIds);
          customerList = fromJS(list.res.context.detailResponseList);
        }

        let userPriceMap = OrderedMap();
        goodsDetail.get('goodsCustomerPrices').forEach((item) => {
          const user = customerList.find((userItem) => userItem.get('customerId') == item.get('customerId'));
          if (user != null) {
            item = item.set('userLevelName', user.get('customerLevelName'));
            item = item.set('userName', user.get('customerName'));
            userPriceMap = userPriceMap.set(item.get('customerId') + '', item);
          }
        });
        this.dispatch('priceActor: initPrice', {
          key: 'userPrice',
          priceMap: userPriceMap
        });
      }
    } else if (priceOpt == 1) {
      // 区间价
      let areaPriceMap = Map();
      goodsDetail.get('goodsIntervalPrices').forEach((item) => {
        areaPriceMap = areaPriceMap.set(item.get('intervalPriceId') + '', item);
      });
      this.dispatch('priceActor: initPrice', {
        key: 'areaPrice',
        priceMap: areaPriceMap
      });
    }
  };

  /**
   * 修改商品基本信息
   */
  editGoods = async (goods: IMap) => {
    if (goods.get('saleType') !== undefined && goods.get('saleType') === 1 && this.state().getIn(['goods', 'priceType']) === 1) {
      this.editPriceSetting('priceOpt', 2);
    }
    if (goods.get('goodsNo')) {
      goods = goods.set('internalGoodsNo', localStorage.getItem('storeCode') + '_' + goods.get('goodsNo'));
    }

    if (Number(goods.get('subscriptionStatus')) === 0) {
      goods = goods.set('defaultPurchaseType', null);
      goods = goods.set('defaultFrequencyId', null);
    }
    this.dispatch('goodsActor: editGoods', goods);
  };

  // 产品规格
  updateAllBasePrice = (mockSpecId) => {
    if (!mockSpecId) {
      return;
    }
    const goodsSpecs = this.state().get('goodsSpecs').toJS();
    let specId;
    goodsSpecs.forEach((item) => {
      if (item.mockSpecId === mockSpecId) {
        specId = item.specId;
      }
    });
    const goodsInfos = this.state().get('goodsList').toJS();
    let specValue;
    goodsInfos.forEach((item) => {
      specValue = item['specId-' + specId];
      if (specValue) {
        const basePrice = isNaN(parseFloat(item.marketPrice) / parseFloat(specValue)) ? '0' : (parseFloat(item.marketPrice) / parseFloat(specValue)).toFixed(2);
        const subscriptionBasePrice = isNaN(parseFloat(item.subscriptionPrice) / parseFloat(specValue)) ? '0' : (parseFloat(item.subscriptionPrice) / parseFloat(specValue)).toFixed(2);
        this.editGoodsItem(item.id, 'basePrice', basePrice);
        this.editGoodsItem(item.id, 'subscriptionBasePrice', subscriptionBasePrice);
      } else {
        this.editGoodsItem(item.id, 'basePrice', null);
        this.editGoodsItem(item.id, 'subscriptionBasePrice', null);
      }
    });
    this.dispatch('');
  };

  updateBasePrice = (id, key, e) => {
    if (key !== 'marketPrice' && key !== 'subscriptionPrice') {
      return;
    }
    const value = e;
    if (key === 'marketPrice') {
      this.editGoodsItem(id, 'basePrice', value);
    } else if (key === 'subscriptionPrice') {
      this.editGoodsItem(id, 'subscriptionBasePrice', value);
    }
    this.computedBasePrice();
  };
  updateBasePrice2 = (id, key, e) => {
    // type === 'basePrice' || subscriptionBasePrice
    const mockSpecId = this.state().get('baseSpecId');
    if (!mockSpecId || (key !== 'marketPrice' && key !== 'subscriptionPrice')) {
      return;
    }
    const goodsSpecs = this.state().get('goodsSpecs').toJS();
    let specId;
    goodsSpecs.forEach((item) => {
      if (item.mockSpecId === mockSpecId) {
        specId = item.specId;
      }
    });
    let specValue;
    const goodsInfos = this.state().get('goodsList').toJS();
    goodsInfos.forEach((item) => {
      if (item.id === id) {
        specValue = item['specId-' + specId];
      }
    });
    const value = specValue ? (parseFloat(e) / parseFloat(specValue)).toFixed(2) : null;
    if (key === 'marketPrice') {
      this.editGoodsItem(id, 'basePrice', value);
    } else if (key === 'subscriptionPrice') {
      this.editGoodsItem(id, 'subscriptionBasePrice', value);
    }
  };
  /**
   *
   * 设置选中的Base Price
   */
  setSelectedBasePrice = (value) => {
    this.dispatch('goodsSpecActor: selectedBasePrice', value);
    if (value === 'None') {
      return;
    }
    this.computedBasePrice();
  };

  computedBasePrice = () => {
    const goodsInfo = this.state().get('goodsList').toJS();
    goodsInfo.forEach((item) => {
      const specValue = item.goodsInfoWeight;
      if (specValue) {
        const basePrice = isNaN(parseFloat(item.marketPrice) / parseFloat(specValue)) ? '0' : (parseFloat(item.marketPrice) / parseFloat(specValue)).toFixed(2);
        const subscriptionBasePrice = isNaN(parseFloat(item.subscriptionPrice) / parseFloat(specValue)) ? '0' : (parseFloat(item.subscriptionPrice) / parseFloat(specValue)).toFixed(2);
        this.editGoodsItem(item.id, 'basePrice', basePrice);
        this.editGoodsItem(item.id, 'subscriptionBasePrice', subscriptionBasePrice);
      } else {
        this.editGoodsItem(item.id, 'basePrice', null);
        this.editGoodsItem(item.id, 'subscriptionBasePrice', null);
      }
    });
  };
  /**
   * 修改商品图片
   */
  editImages = (images: IList) => {
    this.dispatch('imageActor: editImages', images);
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
  editSpecValues = (specItem) => {
    const priceOpt = this.state().get('priceOpt');
    const mtkPrice = this.state().get('mtkPrice') || 0;
    this.dispatch('goodsSpecActor: editSpecValues', {
      priceOpt,
      mtkPrice,
      ...specItem
    });
  };

  /**
   * 添加规格
   */
  addSpec = () => {
    console.log(this.state().get('goods')&&this.state().get('goods').toJS(),112);
    this.dispatch('goodsSpecActor: addSpec', this.state().get('goods'));
  };
  
  updateSpecValues = (specId, key, value) => {
    this.dispatch('goodsSpecActor: updateSpecValues', { specId, key, value });
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

  changePriceDisabled = (disabled: boolean) => {
    this.dispatch('priceActor: priceDisabled', disabled);
  };

  deleteGoodsInfo = (id: string) => {
    this.dispatch('goodsSpecActor: deleteGoodsInfo', id);
  };

  /**
   * 移除视频
   * @param id
   */
  removeVideo = () => {
    this.dispatch('imageActor: deleteVideo');
    let goods = this.state().get('goods');
    goods = goods.set('goodsVideo', '');
    this.dispatch('goodsActor: editGoods', goods);
  };

  /**
   * 清除选中的视频
   */
  cleanChooseVideo = () => {
    this.dispatch('modal: cleanChooseVideo');
  };

  /**
   * 选中某个分类
   * @param cateId
   */
  selectVideoCate = (cateId) => {
    if (cateId) {
      this.dispatch('cateActor: cateIds', List.of(cateId.toString())); //选中的分类id List
      this.dispatch('cateActor: cateId', cateId.toString()); //选中的分类id
    } else {
      this.dispatch('cateActor: cateIds', List()); //全部
      this.dispatch('cateActor: cateId', ''); //全部
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
   * 更改设价方式
   * @param state
   * @param priceOpt
   */
  editPriceSetting = (key: string, value: any) => {
    this.dispatch('priceActor: editPriceSetting', { key, value });
  };

  /**
   * 修改级别价单个属性
   * @param state
   * @param param1
   */
  editUserLevelPriceItem = (userLevelId: string, key: string, value: string) => {
    this.dispatch('priceActor: editUserLevelPriceItem', {
      userLevelId,
      key,
      value
    });
  };

  /**
   * 修改用户价
   */
  editUserPrice = (userId: string, userName: string, userLevelName: string) => {
    this.dispatch('priceActor: editUserPrice', {
      userId,
      userName,
      userLevelName
    });
  };

  /**
   * 删除级别价
   */
  deleteUserPrice = (userId: string) => {
    this.dispatch('priceActor: deleteUserPrice', userId);
  };

  /**
   * 修改客户价单个属性
   */
  editUserPriceItem = (userId: string, key: string, value: string) => {
    this.dispatch('priceActor: editUserPriceItem', { userId, key, value });
  };

  /**
   * 修改客户价单个属性
   */
  editAreaPriceItem = (id: string, key: string, value: string) => {
    this.dispatch('priceActor: editAreaPriceItem', { id, key, value });
  };

  /**
   * 删除区间价
   */
  deleteAreaPrice = (id: string) => {
    this.dispatch('priceActor: deleteAreaPrice', id);
  };

  /**
   * 新增区间价
   */
  addAreaPrice = () => {
    this.dispatch('priceActor: addAreaPrice');
  };

  updateGoodsForm = (goodsForm) => {
    this.dispatch('formActor:goods', goodsForm);
  };
  updateLogisticsForm = (logisticsForm) => {
    this.dispatch('formActor:logistics', logisticsForm);
  };
  updateSkuForm = (skuForm) => {
    this.dispatch('formActor:sku', skuForm);
  };

  updateSpecForm = (specForm) => {
    this.dispatch('formActor:spec', specForm);
  };

  updateAttributeForm = (goodsForm) => {
    this.dispatch('formActor:attributes', goodsForm);
  };

  updateLevelPriceForm = (levelPriceForm) => {
    this.dispatch('formActor:levelprice', levelPriceForm);
  };

  updateUserPriceForm = (userPriceForm) => {
    this.dispatch('formActor:userprice', userPriceForm);
  };

  updateAreaPriceForm = (areaPriceForm) => {
    this.dispatch('formActor:areaprice', areaPriceForm);
  };

  refDetailEditor = (detailEditorObj) => {
    this.dispatch('goodsActor: detailEditor', detailEditorObj);
  };

  reftabDetailEditor = (obj) => {
    this.dispatch('goodsActor: tabDetailEditor', obj);
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
          if (!errs) {
          }
        });
    // this.state()
    //   .get('skuForm')
    //   .validateFieldsAndScroll(null, (errs) => {
    //     valid = valid && !errs;
    //     if (!errs) {
    //     }
    //   });
    if (this.state().get('specForm') && this.state().get('specForm').validateFieldsAndScroll) {
      this.state()
          .get('specForm')
          .validateFieldsAndScroll(null, (errs) => {
            valid = valid && !errs;
            if (!errs) {
            }
          });
    }
    if (this.state().get('logisticsForm') && this.state().get('logisticsForm').validateFieldsAndScroll) {
      this.state()
          .get('logisticsForm')
          .validateFieldsAndScroll(null, (errs) => {
            valid = valid && !errs;
            if (!errs) {
            }
          });
    }
    if (this.state().get('attributesForm') && this.state().get('attributesForm').validateFieldsAndScroll) {
      this.state()
          .get('attributesForm')
          .validateFieldsAndScroll(null, (errs) => {
            valid = valid && !errs;
            if (!errs) {
            }
          });
    }

    // let a = this.state().get('goodsList').filter((item)=>item.get('subscriptionStatus') == 0)
    // if ( this.state().get('goodsList').toJS().length>1 && (this.state().get('goodsList').toJS().length === a.toJS().length) &&
    //   this.state().get('goods').get('subscriptionStatus') == 1 ) {
    //   message.error(RCi18n({id:'Product.subscriptionstatusinSPUisY'}));
    //   valid = false;
    //   return;
    // }

    // let b = this.state().get('goodsList').filter((item)=>item.get('addedFlag') == 0)
    // if ( this.state().get('goodsList').toJS().length>1 && (this.state().get('goodsList').toJS().length === b.toJS().length) &&
    //   (this.state().get('goods').get('addedFlag') == 1 || this.state().get('goods').get('addedFlag') == 2) ) {
    //   message.error(RCi18n({id:'Product.shelvesstatusinSPUisY'}));
    //   valid = false;
    //   return;
    // }


    // let c = this.state().get('goodsList').filter((item)=>item.get('promotions') == 'autoship')
    // if ( this.state().get('goodsList').toJS().length>0 && (this.state().get('goodsList').toJS().length === c.toJS().length) &&
    //   this.state().get('goods').get('promotions') == 'club' ) {
    //   message.error(RCi18n({id:'Product.subscriptiontypeinSPUisclub'}));
    //   valid = false;
    //   return;
    // }

    valid = valid && this.checkGoodsStatus();

    return valid;
  }

  checkGoodsStatus() {
    const { subscriptionStatus, addedFlag, promotions} = this.state().get('goods').toJS();
    const goodsList = this.state().get('goodsList').toJS();

    //至少要有一个上架状态的sku为Y
    if(subscriptionStatus === 1) {
      if(!goodsList.some(item => item.subscriptionStatus === 1) || goodsList.every(item => item.subscriptionStatus === 0)) {
        message.error(RCi18n({id:'Product.subscriptionstatusinSPUisY'}));
        return false;
      }
    }

    if ((addedFlag == 1 || addedFlag == 2) && goodsList.every(item => item.addedFlag == 0)){
      message.error(RCi18n({id:'Product.shelvesstatusinSPUisY'}));
      return false;
    }

    if(promotions === 'club' && goodsList.every(item => item.promotions === 'autoship')) {
      message.error(RCi18n({id:'Product.subscriptiontypeinSPUisclub'}));
      return false;
    }

    return true;
  }

  /**
   * 确定选择以上视频
   */
  beSureVideos = () => {
    const chooseVideo = this.state().get('chooseVideos');
    this.dispatch('imageActor: editVideo', List.isList(chooseVideo) ? chooseVideo.get(0) : chooseVideo);
  };

  /**
   * 对价格表单进行校验
   * @returns {boolean}
   * @private
   */
  _validPriceForms() {
    let valid = true;
    // 校验表单
    if (this.state().get('levelPriceForm') && this.state().get('levelPriceForm').validateFieldsAndScroll) {
      this.state()
          .get('levelPriceForm')
          .validateFieldsAndScroll(null, (errs) => {
            valid = valid && !errs;
            if (!errs) {
            }
          });
    }
    if (this.state().get('userPriceForm') && this.state().get('userPriceForm').validateFieldsAndScroll) {
      this.state()
          .get('userPriceForm')
          .validateFieldsAndScroll(null, (errs) => {
            valid = valid && !errs;
            if (!errs) {
            }
          });
    }
    if (this.state().get('areaPriceForm') && this.state().get('areaPriceForm').validateFieldsAndScroll) {
      this.state()
          .get('areaPriceForm')
          .validateFieldsAndScroll(null, (errs) => {
            valid = valid && !errs;
            if (!errs) {
            }
          });
    }

    return valid;
  }
  _validPriceFormsNew() {
    let valid = true;
    let tip = 0;
    let goodsList = this.state().get('goodsList');
    const saleableFlag = this.state().get('goods').get('saleableFlag') != 0;
    if (goodsList) {
      // goodsList.forEach((item) => {
      //   if (this.state().get('goods').get('saleableFlag') != 0) {
      //     if(item.get('marketPrice') == undefined) {
      //       tip = 1;
      //       valid = false;
      //       return;
      //     }else {
      //       if ( item.get('marketPrice') == 0 ) {
      //         tip = 1;
      //         valid = false;
      //         return;
      //       }
      //     }
      //   }


      //   if (this.state().get('goods').get('saleableFlag') != 0) {
      //     if(item.get('subscriptionPrice') == undefined && item.get('subscriptionStatus') != 0) {
      //       tip = 2;
      //       valid = false;
      //       return;
      //     }else {
      //       if ( item.get('subscriptionPrice') == 0 && item.get('subscriptionStatus') != 0) {
      //         tip = 2;
      //         valid = false;
      //         return;
      //       }
      //     }
      //   }


      //   /*if (!(item.get('marketPrice') || item.get('marketPrice') == 0)) {
      //     valid = false;
      //     tip = 1;
      //     return;
      //   }

      //   if (this.state().get('goods').get('subscriptionStatus') == 1 && item.get('subscriptionStatus') !=0) {
      //     if( item.get('subscriptionPrice') == 0 || item.get('subscriptionPrice') == null) {
      //       tip = 4;
      //       valid = false;
      //       return;
      //     }
      //   }

      //   if ((item.get('flag') && !(item.get('subscriptionPrice') || item.get('subscriptionPrice') == 0))) {
      //     tip = 2;
      //     valid = false;
      //     return;
      //   }

      //   if (this.state().get('goods').get('saleableFlag') == 1 && item.get('marketPrice') == 0) {
      //     tip = 3;
      //     valid = false;
      //     return;
      //   }*/

      //   /* if (!(item.get('subscriptionStatus') || item.get('subscriptionStatus') == 0)) {
      //      tip = 4;
      //      valid = false;
      //      return;
      //    }*/
      // });
      goodsList.forEach((item) => {
        if (item.get('marketPrice') === '' || item.get('marketPrice') === null || item.get('marketPrice') === undefined) {
          tip = 1;
          valid = false;
          return;
        }
        if (item.get('subscriptionStatus') === 1 && (item.get('subscriptionPrice') === '' || item.get('subscriptionPrice') === null || item.get('subscriptionPrice') === undefined)) {
          tip = 2;
          valid = false;
          return;
        }
        if (saleableFlag && item.get('marketPrice') == 0) {
          tip = 3;
          valid = false;
          return;
        }
        if (saleableFlag && item.get('subscriptionStatus') === 1 && item.get('subscriptionPrice') == 0) {
          tip = 4;
          valid = false;
          return;
        }
      });
    }
    if (tip === 1) {
      message.error(RCi18n({id:'Product.inputMarketPrice'}));
    } else if (tip === 2) {
      message.error(RCi18n({id:'Product.subscriptionPrice'}));
    } else if (tip === 3) {
      message.error(RCi18n({id:'Product.Marketpricecannotbezero'}));
    } else if (tip === 4) {
      message.error(RCi18n({id:'Product.Subscriptionpricecannotbezero'}));
    }
    return valid;
  }
  _validInventoryFormsNew() {
    let valid = true;
    let goodsList = this.state().get('goodsList');
    let reg=/^[1-9]\d*$|^0$/;
    if (goodsList) {
      goodsList.forEach((item) => {
        if (!reg.test(item.get('stock'))) {
          valid = false;
          return;
        }
      });
    }
    if (!valid) {
      message.error(RCi18n({id:'Product.PleaseInputInventory'}));
    }
    return valid;
    /*let valid = true;
    let flag = 0
    let goodsList = this.state().get('goodsList');
    let reg=/^[1-9]\d*$|^0$/;

    if (goodsList) {
      goodsList.forEach((item) => {
        if (reg.test(item.get('stock')) === false) {
          flag = 1
          valid = false;
          return;
        }/!* else if (!ValidConst.zeroNumber.test((item.get('stock')))) {
          flag = 2
          valid = false;
          return;
        }*!/
      });
    }
    if (flag === 1) {
      message.error('Please input Inventory');
    } else if(flag === 2){
      message.error('Please enter the correct value');
    }
    return valid;*/
  }
  validMain = () => {
    return this._validMainForms();
  };

  /**
   * 保存基本信息和价格
   */
  saveAll = async (nextTab = null) => {
    if (!this._validMainForms() || !this._validPriceFormsNew() || !this._validInventoryFormsNew()) {
      return false;
    }
    const data = this.state();
    let param = Map();

    // -----商品信息-------
    let goods = data.get('goods');

    if (goods.get('cateId') === '-1') {
      message.error('请选择平台类目');
      return false;
    }

    // if (!goods.get('storeCateIds')) {
    //   message.error('请选择店铺分类');
    //   return false;
    // }

    if (goods.get('brandId') === '0') {
      message.error('请选择品牌');
      return false;
    }

    // 是否多规格标记
    goods = goods.set('moreSpecFlag', data.get('specSingleFlag') ? 0 : 1);
    // 详情
    const detailEditor = data.get('detailEditor') || {};

    // goods = goods.set('goodsDescription', detailEditor.getContent ? detailEditor.getContent() : '');
    goods = goods.set('goodsDetail', data.get('goods').get('goodsDetail'));
    const tabs = [];
    /* if (data.get('detailEditor_0') && data.get('detailEditor_0').val && data.get('detailEditor_0').val.getContent) {
      tabs.push({
        goodsId: goods.get('goodsId'),
        tabId: data.get('detailEditor_0').tabId,
        tabDetail: data.get('detailEditor_0').val.getContent()
      });
    }
    if (data.get('detailEditor_1') && data.get('detailEditor_1').val && data.get('detailEditor_1').val.getContent) {
      tabs.push({
        goodsId: goods.get('goodsId'),
        tabId: data.get('detailEditor_1').tabId,
        tabDetail: data.get('detailEditor_1').val.getContent()
      });
    }
    if (data.get('detailEditor_2') && data.get('detailEditor_2').val && data.get('detailEditor_2').val.getContent) {
      tabs.push({
        goodsId: goods.get('goodsId'),
        tabId: data.get('detailEditor_2').tabId,
        tabDetail: data.get('detailEditor_2').val.getContent()
      });
    }*/
    if (data.get('video') && JSON.stringify(data.get('video')) !== '{}') {
      goods = goods.set('goodsVideo', data.get('video').get('artworkUrl'));
    }
    /*
    let goodsDetailTab = data.get('goodsDetailTab');
    let goodsDetailTabTemplate = {};
    goodsDetailTab = goodsDetailTab.sort((a, b) => a.get('priority') - b.get('priority'));
    goodsDetailTab.map((item, i) => {
      const contect = data.get('detailEditor_' + i).getContent();
      const contectTxt = data.get('detailEditor_' + i).getContentTxt();
      if (contectTxt.substring(0, 1) === '[' && contectTxt.substring(contectTxt.length - 1, contectTxt.length) === ']') {
        goodsDetailTabTemplate[item.get('name')] = contectTxt;
      } else {
        goodsDetailTabTemplate[item.get('name')] = contect;
      }
    });
*/
    let loginInfo = JSON.parse(sessionStorage.getItem('s2b-supplier@login'));
    let storeId = loginInfo ? loginInfo.storeId : '';
    let oldGoodsDetailTabContent = data.get('oldGoodsDetailTabContent');
    //如果是法国，不改变goodsDetail
    if (storeId === 123457909 && oldGoodsDetailTabContent) {
      goods = goods.set('goodsDetail', oldGoodsDetailTabContent);
    }
    // else {
    //   goods = goods.set('goodsDetail', JSON.stringify(goodsDetailTabTemplate));
    // }

    param = param.set('goodsTabRelas', tabs);
    goods = goods.set('goodsType', goods.get('goodsType') == 3 ? goods.get('goodsType') : 0);
    goods = goods.set('goodsSource', 1);
    goods = goods.set('freightTempId', '62');
    goods = goods.set('goodsWeight', '1');
    goods = goods.set('goodsCubage', '1'); // for hide 物流表单
    param = param.set('goods', goods);

    // -----商品相关图片-------
    const images = data.get('images').map((item) => {
        return Map({
          artworkUrl: item.get('artworkUrl'),
          imageId: item.get('imageId'),
          imageType: item.get('imageType'),
        })
    }

    );

    param = param.set('images', images);
    // -----商品属性列表-------
    let goodsPropDatil = List();
    let list = data.get('propDetail');
    if (list) {
      list.forEach((item) => {
        let { propId, goodsPropDetails } = item.toJS();
        goodsPropDetails = fromJS(goodsPropDetails);
        const propValues = goodsPropDetails.filter((i) => i.get('select') == 'select');
        let detailIds = propValues.map((p) => p.get('detailId'));
        detailIds.forEach((dItem) => {
          goodsPropDatil = goodsPropDatil.push(
            Map({
              goodsAttributeId: propId,
              goodsAttributeValueId: dItem
            })
          );
        });
      });
      param = param.set('goodsAttrbutesValueRelList', goodsPropDatil);
    }
    // -----商品规格列表-------
    let goodsSpecs = data.get('goodsSpecs').map((item) => {
      return Map({
        // specId: item.get('isMock') == true ? null : item.get('specId'),
        specId: item.get('isMock') == true ? null : item.get('specId'),
        mockSpecId: item.get('mockSpecId'),
        specName: item.get('specName').trim()
      });
    });
    param = param.set('goodsSpecs', goodsSpecs);

    // -----商品规格值列表-------
    let goodsSpecDetails = List();
    data.get('goodsSpecs').forEach((item) => {
      item.get('specValues').forEach((specValueItem) => {
        goodsSpecDetails = goodsSpecDetails.push(
          Map({
            specId: item.get('isMock') == true ? null : item.get('specId'),
            mockSpecId: item.get('mockSpecId'),
            specName: item.get('specName').trim(),
            specDetailId: specValueItem.get('isMock') ? null : specValueItem.get('specDetailId'),
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
    data.get('goodsList').forEach((item) => {
      if (skuNoMap.has(item.get('goodsInfoNo') + '')) {
        existedSkuNo = item.get('goodsInfoNo') + '';
        return false;
      } else {
        skuNoMap = skuNoMap.set(item.get('goodsInfoNo') + '', '1');
      }

      // 规格id集合
      let mockSpecIds = List();
      // 规格值id集合
      let mockSpecDetailIds = List();
      item.forEach((value, key: string) => {
        if (key && key.indexOf('specId-') != -1) {
          mockSpecIds = mockSpecIds.push(parseInt(key.split('-')[1]));
        }
        if (key && key.indexOf('specDetailId-') != -1) {//specDetailId
          mockSpecDetailIds = mockSpecDetailIds.push(value);
        }
      });

      let imageUrl = null;

      if (item.get('images') != null && item.get('images').count() > 0) {
        imageUrl = item.get('images').toJS()[0].artworkUrl;
        if (!imageUrl) {
          message.error('Spec is required');
          return false;
        }
      }
      goodsList = goodsList.push(
        Map({
          goodsInfoId: item.get('goodsInfoId') ? item.get('goodsInfoId') : null,
          goodsInfoNo: item.get('goodsInfoNo'),
          goodsInfoBarcode: item.get('goodsInfoBarcode'),
          externalSku: item.get('externalSku'),
          stock: item.get('stock'),
          marketPrice: item.get('marketPrice') || 0,
          mockSpecIds,
          mockSpecDetailIds,
          goodsInfoImg: imageUrl,
          goodsInfoWeight: item.get('goodsInfoWeight') || 0,
          goodsInfoUnit: item.get('goodsInfoUnit') || 'kg',
          linePrice: item.get('linePrice') || 0,
          packSize: item.get('packSize') || '',
          promotions: item.get('promotions'),
          goodsMeasureUnit: item.get('goodsMeasureUnit') || '',
          subscriptionPrice: item.get('subscriptionPrice') || 0,
          addedFlag: item.get('addedFlag'),
          subscriptionStatus: item.get('subscriptionStatus') != undefined ? (goods.get('subscriptionStatus') == 0 ? 0 : item.get('subscriptionStatus')) : goods.get('subscriptionStatus') == 0 ? 0 : 1,
          description: item.get('description'),
          basePriceType: data.get('baseSpecId') ? data.get('baseSpecId') : '',
          basePrice: data.get('selectedBasePrice') !== 'None' && item.get('basePrice') ? item.get('basePrice') : null,
          subscriptionBasePrice: data.get('selectedBasePrice') !== 'None' && item.get('subscriptionBasePrice') ? item.get('subscriptionBasePrice') : null,
          virtualInventory: item.get('virtualInventory') ? item.get('virtualInventory') : null,
          virtualAlert: item.get('virtualAlert') ? item.get('virtualAlert') : null,
          depth: item.get('depth') || 0,
          depthUnit: item.get('depthUnit') || 'mm',
          width: item.get('width') || 0,
          widthUnit: item.get('widthUnit') || 'mm',
          height: item.get('height') || 0,
          heightUnit: item.get('heightUnit') || 'mm',
        })
      );
    });
    if (goodsList.count() === 0) {
      message.error('SKU不能为空');
      return false;
    }

    if (existedSkuNo) {
      message.error(`SKU编码[${existedSkuNo}]重复`);
      return false;
    }

    if (goodsList.count() > Const.spuMaxSku) {
      message.error(`SKU数量不超过${Const.spuMaxSku}个`);
      return false;
    }

    param = param.set('goodsInfos', goodsList);

    //---价格信息
    let priceType = data.get('priceOpt');
    // 设价类型 0:客户,1:区间
    goods = goods.set('priceType', priceType);
    // 如果不是按客户设价，则删除SPU统一市场价字段
    if (priceType != 0) {
      goods = goods.delete('marketPrice');
    }
    // 是否按客户单独定价
    goods = goods.set('customFlag', data.get('openUserPrice') ? 1 : 0);
    // 是否叠加客户等级折扣
    goods = goods.set('levelDiscountFlag', data.get('levelDiscountFlag') ? 1 : 0);
    param = param.set('goods', goods);

    // -----商品等级价格列表-------
    let isErr = false;
    data.get('userLevelPrice').forEach((value) => {
      if (value.get('count') != null && value.get('maxCount') != null && value.get('count') > value.get('maxCount')) {
        isErr = true;
      }
    });
    if (isErr) {
      message.error('起订量不允许超过限订量');
      return false;
    }

    const goodsLevelPrices = data.get('userLevelPrice').valueSeq().toList();
    param = param.set('goodsLevelPrices', goodsLevelPrices);

    // -----商品客户价格列表-------
    data.get('userPrice').forEach((value) => {
      if (value.get('count') != null && value.get('maxCount') != null && value.get('count') > value.get('maxCount')) {
        isErr = true;
      }
    });
    if (isErr) {
      message.error('起订量不允许超过限订量');
      return false;
    }
    const userPrice = data.get('userPrice').valueSeq().toList();
    param = param.set('goodsCustomerPrices', userPrice);

    // -----商品订货区间价格列表-------
    const areaPrice = data.get('areaPrice').valueSeq().toList();
    //验证订货区间是否重复
    if (priceType == 1 && areaPrice != null && areaPrice.count() > 0) {
      let cmap = Map();
      let isExist = false;
      areaPrice.forEach((value) => {
        if (cmap.has(value.get('count') + '')) {
          isExist = true;
        } else {
          cmap = cmap.set(value.get('count') + '', '1');
        }
      });

      if (isExist) {
        message.error('订货区间不允许重复');
        return false;
      }
    }
    let detailsList=this.state().get('goodsDescriptionDetailList');
    param = param.set('goodsIntervalPrices', areaPrice);
    param = param.set('goodsTaggingRelList', this.state().get('goodsTaggingRelList'));
    param = param.set('goodsFilterRelList', this.state().get('productFilter'));
    param = param.set('weightValue', this.state().get('selectedBasePrice'));
    param = param.set('goodsDescriptionDetailList', detailsList);
    //console.log(this.state().get('productFilter'), 2222);

    //添加参数，是否允许独立设价
    //param = param.set('allowAlonePrice', this.state().get('allowAlonePrice') ? 1 : 0)
    // this.dispatch('goodsActor: saveLoading', true);
    this.dispatch('loading:start');
    let result: any;
    let result2: any;
    let result3: any;
    const i = this.state().get('checkFlag');
    const enterpriseFlag = this.state().get('enterpriseFlag');
    if (this.state().get('getGoodsId')) {
      if (goods.get('saleType') == 0) {
        const goodsId = goods.get('goodsId');
        if (i == 'true') {
          if (enterpriseFlag) {
            result2 = await toGeneralgoods(goodsId);
            result3 = await enterpriseToGeneralgoods(goodsId);
          } else {
            result2 = await toGeneralgoods(goodsId);
          }
        } else if (enterpriseFlag) {
          result3 = await enterpriseToGeneralgoods(goodsId);
        }
      }
      result = await edit(param.toJS());
    } else {
      result = await save(param.toJS());
    }

    // this.dispatch('goodsActor: saveLoading', false);
    this.dispatch('loading:end');
    if (result.res.code === Const.SUCCESS_CODE) {
      this.dispatch('goodsActor:getGoodsId', result.res.context);
      this.dispatch('priceActor:goodsId', result.res.context);
      if (i == 'true' && goods.get('saleType') == 0) {
        if (result2 != undefined && result2.res.code !== Const.SUCCESS_CODE) {
          //
          return false;
        }
        if (result3 != undefined && result3.res.code !== Const.SUCCESS_CODE) {
          //
          return false;
        }
      }
      message.success('Operate successfully');
      this.dispatch('goodsActor:saveSuccessful', true);
      if (!nextTab) {
        this.onMainTabChange('related');
      } else {
        this.onMainTabChange('seo');
      }
      //history.push('/goods-list');
    } else {
      return false;
    }
  };
  /**
   * 客户搜索
   */
  searchUserList = async (customerName?: string) => {
    //判断是否是自营店铺 自营店铺根据用户名查询 非自营店铺前台过滤查询
    if (util.isThirdStore()) {
      const userList = this.state()
                           .get('sourceUserList')
                           .filter((user) => user.get('customerName').indexOf(customerName) > -1);
      this.dispatch('userActor: setUserList', userList);
    } else {
      if (customerName) {
        const userList: any = await getBossUserListByName(customerName);
        this.dispatch('userActor: setUserList', fromJS(userList.res.context));
      } else {
        const userList: any = await getBossUserList();
        this.dispatch('userActor: setUserList', fromJS(userList.res.context));
      }
    }
  };

  /**
   * 更新库存或市场价选中状态
   * @param key 取值为stock | marketPrice
   * @param checked 选中状态
   */
  updateChecked = async (key: string, checked?: boolean) => {
    this.dispatch('goodsSpecActor: updateChecked', { key, checked });
  };

  /**
   * 同步库存或市场价的值
   * @param key 取值为stock | marketPrice
   */
  synchValue = async (key: string) => {
    this.dispatch('goodsSpecActor: synchValue', key);
  };

  /**
   * 显示品牌弹窗
   */
  showBrandModal = () => {
    this.transaction(() => {
      this.dispatch('brandActor: showModal');
    });
  };

  /**
   * 修改品牌名称
   */
  editBrandInfo = (formData: IMap) => {
    this.dispatch('brandActor: editBrandInfo', formData);
  };

  /**
   * 关闭品牌弹窗
   */
  closeBrandModal = () => {
    this.dispatch('brandActor: closeModal');
  };

  onGoodsTaggingRelList = (res) => {
    this.dispatch('product:goodsTaggingRelList', res);
  };

  onProductFilter = (res) => {
    this.dispatch('product:productFilter', res);
  };
  /**
   * 添加品牌
   */
  doBrandAdd = async () => {
    const formData = this.state().get('brandData');
    let result: any = await addBrand(formData);

    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('Operate successfully');
      this.dispatch('brandActor: closeModal');

      // 刷新
      const brandList: any = await getBrandList();
      this.dispatch('goodsActor: initBrandList', fromJS(brandList.res));

      this.state()
          .get('goodsForm')
          .setFieldsValue({ brandId: result.res.context + '' });
      this.dispatch('goodsActor: editGoods', Map({ ['brandId']: result.res.context + '' }));
    }
  };

  /**
   * 显示分类弹窗
   */
  showCateModal = (_formData: IMap) => {
    this.dispatch('cateActor: showModal');
  };

  /**
   * 关闭分类弹窗
   */
  closeCateModal = () => {
    this.dispatch('cateActor: closeModal');
  };

  /**
   * 修改form信息
   */
  editCateData = (formData: IMap) => {
    this.dispatch('cateActor: editFormData', formData);
  };

  /**
   * 添加品牌
   */
  doCateAdd = async (cateName, cateParentId, sort) => {
    let result: any = await addCate({ cateName, cateParentId, sort });
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('Operate successfully');
      this.dispatch('cateActor: closeModal');
      // 刷新
      const cateList = await getStoreCateList();
      this.dispatch('goodsActor: initStoreCateList', fromJS((cateList.res as any).context));
    }
  };

  /**
   * 修改商品图片
   */
  editCateImages = (images: IList) => {
    this.dispatch('cateActor: editImages', images);
  };

  /**
   * 更新等级起订量选中状态
   */
  updateLevelCountChecked = async (levelCountChecked?: boolean) => {
    this.dispatch('priceActor: editLevelCountChecked', levelCountChecked);
  };

  /**
   * 同步等级起订量
   */
  synchLevelCount = async () => {
    this.dispatch('priceActor: synchLevelCount');
  };

  /**
   * 更新等级限订量选中状态
   */
  updateLevelMaxCountChecked = async (levelMaxCountChecked?: boolean) => {
    this.dispatch('priceActor: editLevelMaxCountChecked', levelMaxCountChecked);
  };

  /**
   * 同步等级限订量
   */
  synchLevelMaxCount = async () => {
    this.dispatch('priceActor: synchLevelMaxCount');
  };

  /**
   * 更新客户起订量选中状态
   */
  updateUserCountChecked = async (userCountChecked?: boolean) => {
    this.dispatch('priceActor: editUserCountChecked', userCountChecked);
  };

  /**
   * 同步客户起订量
   */
  synchUserCount = async () => {
    this.dispatch('priceActor: synchUserCount');
  };

  /**
   * 更新客户限订量选中状态
   */
  updateUserMaxCountChecked = async (userCountChecked?: boolean) => {
    this.dispatch('priceActor: editUserMaxCountChecked', userCountChecked);
  };

  /**
   * 同步客户限订量
   */
  synchUserMaxCount = async () => {
    this.dispatch('priceActor: synchUserMaxCount');
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

  editVideoCateId = async (value: string) => {
    this.dispatch('cateActor: cateId', value);
  };

  /**
   * 修改选中分类
   * @param value
   * @returns {Promise<void>}
   */
  editVideoDefaultCateId = async (value: string) => {
    this.dispatch('cateActor: cateIds', List.of(value));
  };

  // modalVisible = async (maxCount: number, imgType: number, skuId: string) => {
  //   if (this.state().get('visible')) {
  //     this.initImg({ pageNum: 0, cateId: '', successCount: 0 });
  //   }
  //   if (maxCount) {
  //     //取消时候, 该值为0, 不重置, 防止页面渲染太快, 看到数量变化不友好
  //     this.dispatch('modal: maxCount', maxCount);
  //   }
  //   this.dispatch('modal: visible', { imgType, skuId });
  // };

  modalVisible = async (maxCount: number, imgType: number, skuId: string) => {
    if (this.state().get('visible')) {
      this.initImg({
        pageNum: 0,
        cateId: '',
        successCount: 0
      });
    }
    if (this.state().get('videoVisible')) {
      this.initVideo({
        pageNum: 0,
        cateId: '',
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
   * 点击搜索保存搜索内容
   * @param {string} searchName
   * @returns {Promise<void>}
   */
  saveSearchName = async (searchName: string) => {
    this.dispatch('modal: searchName', searchName);
  };

  /**
   * 点击搜索保存搜索内容
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
      if (this.state().get('editor') === 'detail') {
        this.state()
            .get('detailEditor')
            .execCommand('insertimage', (chooseImgs || fromJS([])).toJS());
      } else {
        const name = this.state().get('editor');
        this.state()
            .get(name)
            .val.execCommand('insertimage', (chooseImgs || fromJS([])).toJS());
      }
    }
  };
  goodsDescriptionSort(data){
    return data.sort((a,b)=>a.sort-b.sort)
  }
  /**
   * 设置富文本框的值
   * @param
   */
  editEditorContent = (value) => {
    this.dispatch('goodsActor:descriptionTab', this.goodsDescriptionSort(value));
  };
  editEditor = (editor) => {
    this.dispatch('goodsActor: editor', editor);
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
   * 清除选中的图片集合
   */
  cleanChooseImgs = () => {
    this.dispatch('modal: cleanChooseImg');
  };

  /**
   * 切换 基础信息 与 价格及订货量 tab
   * @param activeKey
   * @param executeValid 是否执行基本信息校验
   */
  onMainTabChange = (activeKey, executeValid: boolean = true) => {
    if (executeValid) {
      // 基本信息校验不通过，不允许进行切换
      if ('related' === activeKey && !this._validMainForms()) {
        return;
      }
      this.dispatch('goodsActor: tabChange', activeKey);
    }
  };

  onTabChanges = (nextKey) => {
    // if (nextKey === 'price') {
    //   if (!this._validMainForms()) {
    //     return;
    //   }
    // } else if (nextKey === 'inventory') {
    //   if (!this._validMainForms() || !this._validPriceFormsNew()) {
    //     return;
    //   }
    // } else if (nextKey === 'related' || nextKey === 'shipping') {
    //   if (!this._validMainForms() || !this._validPriceFormsNew() || !this._validInventoryFormsNew()) {
    //     return;
    //   } else if (nextKey === 'related') {
    //     //this.saveAll();
    //   }
    // } else if (nextKey === 'seo') {
    //   if (!this._validMainForms() || !this._validPriceFormsNew() || !this._validInventoryFormsNew() || !this.state().get('getGoodsId')) {
    //     return;
    //   } else {
    //     //this.saveAll('seo');
    //   }
    // }
    //if (nextKey !== 'related') {
      this.dispatch('goodsActor: tabChange', nextKey);
    //}
  };

  /**
   * 对应类目、商品下的所有属性信息
   */
  attributesToProp(attributesList) {
    if (attributesList) {
      let propList = [];
      attributesList.map((a) => {
        propList.push({
          propId: a.id,
          propName: a.attributeName,
          isSingle: a.attributeType === 'Single choice',
          goodsPropDetails: a.attributesValuesVOList
            ? a.attributesValuesVOList.map((v) => {
              return {
                detailId: v.id,
                propId: v.attributeId,
                detailName: v.attributeDetailName
              };
            })
            : []
        });
      });
      return propList;
    }
    return [];
  }

  showGoodsPropDetail = async (cateId, goodsPropList, storeId) => {
    this.dispatch('propActor: setPropList', []);
    if (!cateId) {
      this.dispatch('propActor: clear');
    } else {
      const result: any = await getCateIdsPropDetail(cateId, storeId);
      if (result.res.code === Const.SUCCESS_CODE) {
        let catePropDetailList = this.attributesToProp(result.res.context);
        //类目属性中的属性值没有其他，拼接一个其他选项
        let catePropDetail = fromJS(catePropDetailList);

        catePropDetail = catePropDetail.map((prop) => {
          let goodsPropDetails = prop.get('goodsPropDetails');
          return prop.set('goodsPropDetails', goodsPropDetails);
        });
        //将商品中的属性与属性值信息映射到类目属性里
        if (goodsPropList && catePropDetail.size > 0 && goodsPropList.size > 0) {
          goodsPropList.forEach((item) => {
            const { detailIds, propId } = item.toJS();
            const index = catePropDetail.findIndex((p) => p.get('propId') === propId);
            if (index > -1) {
              let detailList = catePropDetail.getIn([index, 'goodsPropDetails']).map((d) => {
                let detailId = detailIds.find((tmpId) => tmpId === d.get('detailId'));
                if (d.get('detailId') == detailId) {
                  return d.set('select', 'select');
                }
                // else if (d.get('detailId') === '0' && detailIds.length === 0) {
                //   return d.set('select', 'select');
                // }
                return d.set('select', '');
              });
              catePropDetail = catePropDetail.setIn([index, 'goodsPropDetails'], detailList);
            }
          });
        }
        this.dispatch('propActor: setPropList', this._changeList(catePropDetail));
        this.dispatch('propActor: goodsPropDetails', catePropDetail);
      }
    }
  };
  /**
   * 对应类目、商品下的所有属性信息
   */
  changeStoreCategory = async (goodsCateId) => {
    const result: any = await getStoreCateList();
    if (result.res.code === Const.SUCCESS_CODE) {
      this.dispatch('goodsActor: initStoreCateList', fromJS((result.res as any).context.storeCateResponseVOList));
    }
  };
  /**
   * 对应类目、商品下的所有属性信息
   */
  changeDescriptionTab = async (cateId) => {
    // const {_cateId,_list}=_tempGoodsDescriptionDetailList
    if (!cateId) return;
    // if(_cateId===cateId){
    //   this.editEditorContent(_list);
    //   return
    // }
    const result: any = await getDescriptionTab(cateId);
    if (result.res.code === Const.SUCCESS_CODE) {
      let content = result.res.context;
      let res = content.map((item) => {
        return {
          key: +new Date(),
          goodsCateId: cateId,
          descriptionId: item.id,
          descriptionName: item.descriptionName,
          contentType: item?.contentType??'text',
          content: '',
          sort: item?.sort??1,
          editable: true,
          created:false
        };
      });
      this.editEditorContent(res);
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
   * 所有运费模板
   */
  setFreightList = async () => {
    const { res, err } = await freightList();
    if (!err && res.code === Const.SUCCESS_CODE) {
      this.dispatch('freight:freightList', fromJS(res.context));
    }
  };
  /**
   * 运费模板首重，续重信息
   */
  setGoodsFreight = async (freightTempId: number, isSelect: boolean) => {
    // const { res, err } = await goodsFreight(freightTempId);
    // if (!err && res.code === Const.SUCCESS_CODE) {
    //   if (isSelect) {
    //     this.dispatch('freight:selectTemp', fromJS(res.context));
    //     const result = (await goodsFreightExpress(freightTempId)) as any;
    //     if (result.res.code === Const.SUCCESS_CODE) {
    //       this.dispatch('freight:selectTempExpress', fromJS(result.res.context));
    //     } else {
    //
    //     }
    //   } else {
    //     this.dispatch('freight:freightTemp', fromJS(res.context));
    //   }
    // } else {
    //
    // }
  };

  /**
   * 切换独立设价
   */
  toggleSetAlonePrice = (result) => {
    this.dispatch('priceActor:setAlonePrice', result);
  };

  /**
   * 根据分类id,找寻自己+所有子类List
   */
  _getCateIdsList = (cateListIm, cateId) => {
    let cateIdList = new Array();
    if (cateId) {
      if (Array.isArray(cateId)) {
        cateIdList = cateIdList.concat(cateId);
      } else {
        cateIdList.push(cateId);
      }

      const secondCateList = cateListIm.filter((item) => item.get('cateParentId') == cateId); //找第二层子节点
      if (secondCateList && secondCateList.size > 0) {
        cateIdList = cateIdList.concat(secondCateList.map((item) => item.get('cateId')).toJS());
        const thirdCateList = cateListIm.filter((item) => secondCateList.filter((sec) => item.get('cateParentId') == sec.get('cateId')).size > 0); //找第三层子节点
        if (thirdCateList && thirdCateList.size > 0) {
          cateIdList = cateIdList.concat(thirdCateList.map((item) => item.get('cateId')).toJS());
        }
      }
    }
    return cateIdList;
  };

  onRelatedList = async (param?: any) => {
    const { res } = await getRelatedList(param);
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('related:relatedList', fromJS(res.context != null ? res.context.relationGoods : []));
      });
    }
  };

  propSort = async (param?: any) => {
    const { res } = await fetchPropSort(param);
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.onRelatedList(this.state().get('goodsId'));
      });
    }
  };

  //删除
  getConsentDelete = async (param?: any) => {
    const { res } = await fetchConsentDelete(param);
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.onRelatedList(this.state().get('getGoodsId'));
      });
    }
  };

  //productselect
  onProductselect = async (addProduct) => {
    const { res } = await fetchAdd(addProduct);
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('related:addRelated', fromJS(res.context != null ? res.context.relationGoods : []));
        this.onRelatedList(this.state().get('getGoodsId'));
      });
    }
  };

  onSPU = (res) => {
    this.dispatch('related:SPU', res);
  };

  onProductName = (res) => {
    this.dispatch('related:productName', res);
  };

  onSignedClassification = (res) => {
    this.dispatch('related:signedClassification', res);
  };

  onBrand = (res) => {
    this.dispatch('related:Brand', res);
  };

  productInit = async () => {
    let request: any = {
      goodsName: this.state().get('likeGoodsName'),
      goodsNo: this.state().get('likeGoodsNo'),
      goodsCateName: this.state().get('storeCateId'),
      brandName: this.state().get('brandId')
    };
    const { res } = await fetchproductTooltip(request);
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('related:productTooltip', res.context.goods);
      this.dispatch('related:searchType', true);
    }
  };

  onSearch = async () => {
    let request: any = {
      goodsName: this.state().get('likeGoodsName'),
      goodsNo: this.state().get('likeGoodsNo'),
      goodsCateName: this.state().get('storeCateId'),
      brandName: this.state().get('brandId')
    };

    const { res } = await fetchproductTooltip(request);
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('related:productTooltip', res.context.goods);
      this.dispatch('related:searchType', true);
    }

    //this.onPageSearch();
  };
  onFormFieldChange = ({ key, value }) => {
    this.dispatch('form:field', { key, value });
  };
  updateSeoForm = ({ field, value }) => {
    this.dispatch('formActor:seo', { field, value });
  };

  getSeo = async (goodsId, type = 1) => {
    this.dispatch('loading:start');
    const { res } = (await getSeo(goodsId, type)) as any;
    this.dispatch('loading:end');
    if (res.code === Const.SUCCESS_CODE && res.context && res.context.seoSettingVO) {
      let title = null;
      let description = null;
      let keywords = null;
      const loginInfo = JSON.parse(sessionStorage.getItem('s2b-supplier@login'));
      if (loginInfo) {
        switch (loginInfo.storeId) {
          case 123457910: //"美国"
            title = '{name} | Royal Canin Shop';
            break;
          case 123457911: //"土耳其"
            title = '{name} {subtitle} | Royal Canin Türkiye';
            description = '{name} {subtitle} Royal Canin resmi mağazasında. "X" TL üzeri siparişlerinizde ücretsiz kargo. Sipariş verin veya mama aboneliğinizi başlatın!';
            keywords = '{name}, {subtitle}, {sales category}, {tagging}';
            break;
          case 123457907: //"俄罗斯"
            title = 'Купить {technology} корм Royal Canin {name} в официальном интернет-магазине';
            description = 'Купить {technology} корм Royal Canin {name} со скидкой 10% при оформлении подписки. Сделайте заказ в интернет-магазине Royal Canin уже сегодня!';
            keywords = '{name}, {subtitle}, {sales category}, {tagging}';
            break;
          case 123456858: //墨西哥
            title = RCi18n({id:'Product.MEXICO'});
            description = null
            keywords = null
            break;
          default:
            title = '{name} | Royal Canin Shop';
            description = '{description}';
            keywords = '{name}, {subtitle}, {sales category}, {tagging}';
        }
      }
      this.dispatch(
        'seoActor: setSeoForm',
        fromJS({
          titleSource: res.context.seoSettingVO.updateNumbers && res.context.seoSettingVO.updateNumbers > 0 ? res.context.seoSettingVO.titleSource : title,
          metaKeywordsSource: res.context.seoSettingVO.updateNumbers && res.context.seoSettingVO.updateNumbers > 0 ? res.context.seoSettingVO.metaKeywordsSource : keywords, //{name}, {subtitle}, {sales category}, {tagging}
          metaDescriptionSource: res.context.seoSettingVO.updateNumbers && res.context.seoSettingVO.updateNumbers > 0 ? res.context.seoSettingVO.metaDescriptionSource : description, //{description}
          headingTag: res.context.seoSettingVO.headingTag ? res.context.seoSettingVO.headingTag : ''
        })
      );
      this.dispatch('seoActor: updateNumbers', res.context.seoSettingVO.updateNumbers);
    }
  };
  saveSeoSetting = async (goodsId) => {
    const seoObj = this.state().get('seoForm').toJS();
    this.dispatch('loading:start');
    let params = {};
    const updateNumbers = this.state().get('updateNumbers') + 1;
    const loginInfo = JSON.parse(sessionStorage.getItem('s2b-supplier@login')); //{storeId: 123457910}
    if (loginInfo) {
      switch (loginInfo.storeId) {
        case 123457910: //"美国"
          params = {
            type: 1,
            goodsId,
            metaDescriptionSource: null,
            metaKeywordsSource: null,
            titleSource: seoObj.titleSource,
            headingTag: null,
            updateNumbers
          };
          break;
        // case 123457911: //"土耳其"
        //
        //   break;
        // case 123457907: //"俄罗斯"
        //
        //   break;
        default:
          params = {
            type: 1,
            goodsId,
            metaDescriptionSource: seoObj.metaDescriptionSource,
            metaKeywordsSource: seoObj.metaKeywordsSource,
            titleSource: seoObj.titleSource,
            headingTag: seoObj.headingTag,
            updateNumbers
          };
      }
    }

    const { res } = (await editSeo(params)) as any;
    this.dispatch('loading:end');
    if (res.code === Const.SUCCESS_CODE) {
      // history.push('./goods-list');
      message.success('Save successfully.');
      history.replace('/goods-list');
    }
    //调接口
  };
  setDefaultBaseSpecId = () => {
    const item = this.state()
                     .get('goodsSpecs')
                     .find((item) => {
                       return item.get('specName') === sessionStorage.getItem(cache.SYSTEM_GET_WEIGHT);
                     });
    this.dispatch('goodsSpecActor: baseSpecId', item.get('mockSpecId'));
  };

  showEditModal = ({ key, value }) => {};
  onSwitch = ({ key, value }) => {};
  pageChange = ({ key, value }) => {};
  doAdd = ({ key, value }) => {};
  editFormData = ({ key, value }) => {};
  closeModal = ({ key, value }) => {};
  modalVisibleFun = ({ key, value }) => {};
  onProductForm = ({ key, value }) => {};
  onEditSkuNo = ({ key, value }) => {};
  saveMain = ({ key, value }) => {};
}
