import { IOptions, Store } from 'plume2';
import { IList } from 'typings/globalType';
import { fromJS, List, Map, OrderedMap } from 'immutable';
import { message } from 'antd';

import { history, Const } from 'qmkit';

import GoodsActor from './actor/goods-actor';
import ImageActor from './actor/image-actor';
import SpecActor from './actor/spec-actor';
import PriceActor from './actor/price-actor';
import UserActor from './actor/user-actor';
import FormActor from './actor/form-actor';
import BrandActor from './actor/brand-actor';
import CateActor from './actor/cate-actor';
import ModalActor from './actor/modal-actor';

import {
  getBrandList,
  getCateList,
  getGoodsDetail,
  getStoreCateList,
  getStoreInfo,
  getUserLevelList,
  getUserList,
  auditPass,
  auditReject,
  auditForbid,
  getPropsByCateId,
  fetchBossCustomerList
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
      new PriceActor(),
      new UserActor(),
      new FormActor(),
      new BrandActor(),
      new CateActor(),
      new ModalActor()
    ];
  }

  /**
   * 初始化
   */
  init = async (goodsId?: string) => {
    if (goodsId) {
      this.dispatch('goodsActor: isEditGoods', true);
      const goodsDetail = await this._getGoodsDetail(goodsId);

      if (!goodsDetail) {
        return false;
      }

      const storeId = goodsDetail.getIn(['goods', 'storeId']);

      Promise.all([
        getCateList(storeId),
        getStoreCateList(storeId),
        getBrandList(storeId),
        getStoreInfo(storeId)
      ]).then((results) => {
        this.dispatch(
          'goodsActor: initCateList',
          fromJS((results[0].res as any).context)
        );
        this.dispatch(
          'goodsActor: initStoreCateList',
          fromJS((results[1].res as any).context)
        );
        this.dispatch(
          'goodsActor: initBrandList',
          fromJS((results[2].res as any).context)
        );
        this.dispatch(
          'goodsActor: initStoreInfo',
          fromJS((results[3].res as any).context)
        );
      });

      const userList: any = await getUserList(storeId);
      this.dispatch('userActor: setUserList', fromJS(userList.res.context));

      const userLevelList: any = await getUserLevelList(storeId);
      const userLevel = {
        customerLevelId: 0,
        customerLevelName: '全平台客户',
        customerLevelDiscount: 1
      };
      let newLevelList = userLevelList.res.context;
      newLevelList.unshift(userLevel);
      this.dispatch(
        'userActor: setUserLevelList',
        fromJS(userLevelList.res.context)
      );
      this.dispatch(
        'priceActor: setUserLevelList',
        fromJS(userLevelList.res.context)
      );

      // 解析价格数据，依赖与用户级别以及用户列表，这里等上面查询完成以后再处理
      this._getPriceInfo(goodsDetail);

      const propDetails = (await getPropsByCateId(
        goodsDetail.getIn(['goods', 'cateId'])
      )) as any;
      this._setGoodsPropDetail(
        goodsDetail.get('goodsPropDetailRels'),
        fromJS(propDetails.res.context)
      );
    }
  };

  /**
   * 设置商品属性
   */
  _setGoodsPropDetail = (propDetailRels, propDetails) => {
    const goodsPropDetails = propDetails.map((prop) => {
      const detail = prop
        .get('goodsPropDetails')
        .find((detail) =>
          propDetailRels.find(
            (rel) =>
              rel.get('propId') == detail.get('propId') &&
              rel.get('detailId') == detail.get('detailId')
          )
        );
      if (detail) {
        return prop
          .set('detailName', detail.get('detailName'))
          .set('detailId', detail.get('detailId'));
      }
      return prop.set('detailName', '其他').set('detailId', 0);
    });

    const newGoodsProps = new Array();
    let propArr = new Array();
    for (let i = 0; i < goodsPropDetails.size; i++) {
      if (i % 2 == 0) {
        propArr = new Array();
        newGoodsProps.push(propArr);
      }
      propArr.push(goodsPropDetails.get(i));
    }
    this.dispatch('goodsActor: setGoodsPropDetails', fromJS(newGoodsProps));
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

      // 复制一个tempMarketPrice和tempCostPrice，作为页面编辑时展示的值，和实际生效的值区别。
      // 对应场景：编辑商品 - 在基础信息中修改了市场价不点击保存，直接点击第二个tab标签 - 第二个标签中的市场价需要展示为实际生效的值
      goods = goods.set('tempMarketPrice', goods.get('marketPrice'));
      goods = goods.set('tempCostPrice', goods.get('costPrice'));

      this.dispatch('goodsActor: editGoods', goods);
      this.dispatch(
        'goodsSpecActor: editSpecSingleFlag',
        goodsDetail.getIn(['goods', 'moreSpecFlag']) == 0
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
      this.editImages(images);
      const tabs = [];
      if (goodsDetail.get('storeGoodsTabs')) {
        goodsDetail.get('storeGoodsTabs').forEach((info) => {
          tabs.push({
            tabName: info.get('tabName'),
            tabDetail:
              goodsDetail
                .get('goodsTabRelas')
                .find(
                  (tabInfo) => tabInfo.get('tabId') === info.get('tabId')
                ) &&
              goodsDetail
                .get('goodsTabRelas')
                .find((tabInfo) => tabInfo.get('tabId') === info.get('tabId'))
                .get('tabDetail')
          });
        });
      }
      this.dispatch('goodsActor: goodsTabs', tabs);

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
          const mockSpecIds = item.get('mockSpecIds').sort();
          mockSpecIds.forEach((specId) => {
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
        let goodsList = goodsDetail.get('goodsInfos').map((item) => {
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
                  url: item.get('goodsInfoImg')
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

    return goodsDetail;
  };

  /**
   * 解析设价信息
   * @param {any} goodsDetail
   * @returns {Promise<void>}
   * @private
   */
  _getPriceInfo = async (goodsDetail) => {
    // 价格
    const priceOpt = goodsDetail.getIn(['goods', 'priceType']);
    const openUserPrice = goodsDetail.getIn(['goods', 'customFlag']) == 1;
    const levelDiscountFlag =
      goodsDetail.getIn(['goods', 'levelDiscountFlag']) == 1;
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
        const customerIds = goodsDetail
          .get('goodsCustomerPrices')
          .map((item) => {
            return item.get('customerId');
          });
        // if (util.isThirdStore()) {
        //   const list: any = (await fetchCustomerList(customerIds));
        //   customerList = fromJS(list.res.context.detailResponseList);
        // } else {
        const list: any = await fetchBossCustomerList(customerIds);
        customerList = fromJS(list.res.context.detailResponseList);
        // }
        let userPriceMap = OrderedMap();
        goodsDetail.get('goodsCustomerPrices').forEach((item) => {
          const user = customerList.find(
            (userItem) => userItem.get('customerId') == item.get('customerId')
          );
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
   * 修改商品图片
   */
  editImages = (images: IList) => {
    this.dispatch('imageActor: editImages', images);
  };

  /**
   * 切换 基础信息 与 价格及订货量 tab
   * @param activeKey
   */
  onMainTabChange = (activeKey) => {
    this.dispatch('goodsActor: tabChange', activeKey);
  };

  /**
   * 审核通过
   * @returns {Promise<void>}
   */
  handleAuditPass = async () => {
    this.dispatch('goodsActor: saveLoading', true);
    const storeId = this.state().getIn(['goods', 'storeId']);
    const goodsId = this.state().getIn(['goods', 'goodsId']);
    const result: any = await auditPass(storeId, goodsId);
    if (result.res.code == Const.SUCCESS_CODE) {
      message.success('审核成功');
      history.goBack();
    }
    this.dispatch('goodsActor: saveLoading', false);
  };

  /**
   * 审核驳回
   * @returns {Promise<void>}
   */
  handleAuditReject = async (reason: string) => {
    this.dispatch('goodsActor: saveLoading', true);
    const storeId = this.state().getIn(['goods', 'storeId']);
    const goodsId = this.state().getIn(['goods', 'goodsId']);
    const result: any = await auditReject(storeId, goodsId, reason);
    if (result.res.code == Const.SUCCESS_CODE) {
      message.success('驳回成功');
      history.goBack();
    }
    this.dispatch('goodsActor: saveLoading', false);
  };

  /**
   * 商品禁用
   * @returns {Promise<void>}
   */
  handleAuditForbid = async (reason: string) => {
    this.dispatch('goodsActor: saveLoading', true);
    const storeId = this.state().getIn(['goods', 'storeId']);
    const goodsId = this.state().getIn(['goods', 'goodsId']);
    const result: any = await auditForbid(storeId, goodsId, reason);
    if (result.res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      history.goBack();
    }
    this.dispatch('goodsActor: saveLoading', false);
  };

  modalRejectShow = () => {
    this.dispatch('modal: reject-visible', true);
  };

  modalRejectHide = () => {
    this.dispatch('modal: reject-visible', false);
  };

  modalRejectConfirm = async (reason: string) => {
    await this.handleAuditReject(reason);
    this.dispatch('modal: reject-visible', false);
  };

  modalForbidShow = () => {
    this.dispatch('modal: forbid-visible', true);
  };

  modalForbidHide = () => {
    this.dispatch('modal: forbid-visible', false);
  };

  modalForbidConfirm = async (reason: string) => {
    await this.handleAuditForbid(reason);
    this.dispatch('modal: forbid-visible', false);
  };
}
