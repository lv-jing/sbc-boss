import { IOptions, Store } from 'plume2';
import { fromJS } from 'immutable';
import CateActor from './actor/cate-actor';
import BrandActor from './actor/brand-actor';
import GoodsLibraryActor from './actor/goods-library-actor';
import FormActor from './actor/form-actor';
import { message } from 'antd';
import { Const } from 'qmkit';
import { getBrandList, getCateList, goodsList, spuDelete } from './webapi';

import { IList } from 'typings/globalType';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [
      new CateActor(),
      new BrandActor(),
      new GoodsLibraryActor(),
      new FormActor()
    ];
  }

  /**
   * 初始化
   */
  init = async (
    { pageNum, pageSize, flushSelected } = {
      pageNum: 0,
      pageSize: 10,
      flushSelected: true
    }
  ) => {
    const { res, err } = (await goodsList({ pageNum, pageSize })) as any;
    if (!err && res.code === Const.SUCCESS_CODE) {
      res.context.standardGoodsPage.content.forEach((v, i) => {
        v.key = i;
      });
      this.dispatch('goodsActor: init', fromJS(res.context));
      this.dispatch('form:field', { key: 'pageNum', value: pageNum });
    } else {
      message.error(res.message);
    }

    const categoryList: any = await getCateList();
    const brands: any = await getBrandList();
    this.transaction(() => {
      this.dispatch('cateActor: init', fromJS(categoryList.res.context));
      this.dispatch('brandActor: init', fromJS(brands.res.context));
    });
    if (flushSelected) {
      this.dispatch('goodsActor:clearSelectedSpuKeys');
    }
  };

  /**
   * 条件搜索,回到第一页
   */
  onSearch = async () => {
    this.dispatch('form:field', { key: 'pageNum', value: 0 });
    this.onPageSearch(1, 10);
  };

  /**
   * 带着搜索条件的分页点击查询
   */
  onPageSearch = async (pageNum, pageSize) => {
    let request: any = {
      likeGoodsName: this.state().get('likeGoodsName'),
      pageNum: pageNum - 1,
      pageSize: pageSize
    };
    if (this.state().get('cateId') != '-1') {
      request.cateId = this.state().get('cateId');
    }
    if (this.state().get('brandId') != '-1') {
      request.brandId = this.state().get('brandId');
    }
    const { res, err } = (await goodsList(request)) as any;
    if (!err) {
      res.context.standardGoodsPage.content.forEach((v, i) => {
        v.key = i;
      });
      this.dispatch('goodsActor: init', fromJS(res.context));
      this.dispatch('goodsActor:clearSelectedSpuKeys');
      this.onFormFieldChange({ key: 'pageNum', value: pageNum });
      this.onFormFieldChange({ key: 'pageSize', value: pageSize });
    }
  };

  onFormFieldChange = ({ key, value }) => {
    this.dispatch('form:field', { key, value });
  };

  onShowSku = (value) => {
    this.dispatch('goodsActor:editExpandedRowKeys', value);
  };

  onSelectChange = (selectedRowKeys: number[]) => {
    this.dispatch('goodsActor: onSelectChange', fromJS(selectedRowKeys));
  };

  /**
   * 刪除商品spu
   * @param {string[]} ids
   * @returns {Promise<void>}
   */
  spuDelete = async (ids: string[]) => {
    if (!ids) {
      const selectedSpuKeys: IList = this.state().get('selectedSpuKeys');
      ids = selectedSpuKeys.toJS();
    }
    const { res, err } = (await spuDelete({ goodsIds: ids })) as any;
    if (!err && res.code === Const.SUCCESS_CODE) {
      this.onSearch();
    } else {
      message.error(res.message);
    }
  };

  /**
   * tip
   */
  message = (data: any) => {
    if (data.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
    } else {
      message.error(data.res.message);
    }
  };
}
