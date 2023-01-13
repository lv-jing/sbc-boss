import { IOptions, Store } from 'plume2';
import GoodsMatterActor from './actor/goods-matter-actor';
import * as webApi from './webapi';
import { Const } from 'qmkit';
import { message } from 'antd';
import { fromJS } from 'immutable';
import { queryStoreByName, getCateList, getBrandList } from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new GoodsMatterActor()];
  }

  //初始化页面
  init = async ({ pageNum, pageSize }) => {
    this.checkSwapInputGroupCompact();
    const query = this.state()
      .get('form')
      .toJS();
    if (query.recommendNumMin != null && query.recommendNumMax != null) {
      if (query.recommendNumMin > query.recommendNumMax) {
        query.recommendNumMin = query.recommendNumMin + query.recommendNumMax;
        query.recommendNumMax = query.recommendNumMin - query.recommendNumMax;
        query.recommendNumMin = query.recommendNumMin - query.recommendNumMax;
      }
    }
    const { res } = await webApi.fetchGoodsMatterPage({
      ...query,
      pageNum,
      pageSize
    });

    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
      return;
    }
    const goodsMatterList = res.context.distributionGoodsMatterPage.content;
    this.dispatch('init', {
      goodsMatterList: fromJS(goodsMatterList),
      total: res.context.distributionGoodsMatterPage.totalElements,
      pageNum: pageNum + 1,
      goodsInfoSpecDetails: res.context.goodsInfoSpecDetails,
      companyInfoList: res.context.companyInfoList
    });
    this.onFormFieldChange({
      key: 'recommendNumMin',
      value: query.recommendNumMin
    });
    this.onFormFieldChange({
      key: 'recommendNumMax',
      value: query.recommendNumMax
    });

    const cates: any = await getCateList();
    const brands: any = await getBrandList();
    this.transaction(() => {
      this.dispatch('cateActor: init', fromJS(cates.res.context));
      this.dispatch('brandActor: init', fromJS(brands.res.context));
    });
  };

  /**
   * 验证InputGroupCompact控件数值大小，并进行大小值交换
   */
  checkSwapInputGroupCompact = () => {
    const params = this.state()
      .get('form')
      .toJS();
    const { optGoodsType } = params;

    // 商品模糊搜索条
    if (optGoodsType == 0) {
      this.onFormFieldChange({ key: 'goodsInfoNo', value: '' });
    } else {
      this.onFormFieldChange({ key: 'goodsInfoName', value: '' });
    }
  };

  dataSearch = (sort) => {
    this.dispatch('sort: set', sort);

    this.init({ pageNum: 0, pageSize: 10 });
  };

  onFormFieldChange = ({ key, value }) => {
    this.dispatch('form: field', { key, value });
  };

  fieldTitleChange = (key, value) => {
    this.dispatch('postTitle: change', { key, value });
  };

  /**
   * 查询账号
   */
  searchAccount = async (textValue) => {
    //根据选择的标题请求不同的后台接口
    const index = this.state().getIn(['postTitle', 'chooseTitle']);
    if (textValue) {
      let queryParams = { accountName: '', name: '' };
      if (index == '0') {
        queryParams.accountName = textValue;
      } else {
        queryParams.name = textValue;
      }
      const { res } = await webApi.likeByNameOrAccount(queryParams);
      if (res.code != Const.SUCCESS_CODE) {
        return;
      }
      const employee = res.context.content;

      this.fieldTitleChange('postTitleData', fromJS(employee));
      this.fieldTitleChange('text', textValue);
    } else {
      this.fieldTitleChange('postTitleData', fromJS([]));
      this.onFormFieldChange({ key: 'operatorId', value: null });
      this.fieldTitleChange('text', '');
    }
  };

  /**
   * 查看大图
   */
  clickImg = (url) => {
    this.dispatch('show: image', url);
  };

  deleteGoodsMatter = async (ids) => {
    const { res } = await webApi.deleteList(ids);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('删除商品分销素材成功!');
      this.init({ pageNum: 0, pageSize: 10 });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 根据店铺名称查询店铺
   * @param storeName
   * @returns {Promise<void>}
   */
  queryStoreByName = async (storeName) => {
    this.onFormFieldChange({ key: 'storeName', value: storeName });
    const { res } = (await queryStoreByName(storeName)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('form: store: info', res.context);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 根据选中的发布者账号信息过滤出其operatorId,并存放
   */
  saveOperatorIdFilter = (value) => {
    const postTitleData = this.state().getIn(['postTitle', 'postTitleData']);
    const operatorId = postTitleData
      .filter(
        (v) => v.get('accountName') + '  ' + v.get('employeeName') == value
      )
      .get(0)
      .get('employeeId');
    //存放最终检错所需的参数
    this.onFormFieldChange({ key: 'operatorId', value: operatorId });
  };
}
