import { Store, IOptions } from 'plume2';
import { IMap, IList } from 'typings/globalType';
import { message } from 'antd';
import { fromJS } from 'immutable';

import { Const } from 'qmkit';
import BrandActor from './actor/brand-actor';
import { getBrandList, addBrand, deleteBrand, editBrand } from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [new BrandActor()];
  }

  /**
   * 初始化
   */
  init = async (pageParams = {}) => {
    this.dispatch('info:setLoading',true)
    //将搜索条件与传入的分页条件合并,作为最终的查询参数
    let searchData = this.state()
      .get('searchData')
      .merge(fromJS(pageParams))
      .toJS();
    const brandList: any = await getBrandList(searchData);
    if (brandList?.res?.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('brandActor: init', brandList.res.context);
        this.dispatch('brandActor: closeModal');
      });
      this.dispatch('info:setLoading',false)
    } else {
      message.error(brandList.res.message);
      this.dispatch('info:setLoading',false)
    }
  };

  /**
   * 修改搜索项信息
   */
  editSearchData = (searchData: IMap) => {
    this.dispatch('brandActor: editSearchData', searchData);
    this.init();
  };

  /**
   * 刷新需要延迟一下
   */
  refresh = () => {
    setTimeout(() => {
      this.init();
    }, 1000);
  };

  /**
   * 显示添加弹窗
   */
  showAddModal = () => {
    this.dispatch('brandActor: showModal', true);
  };

  /**
   * 显示修改弹窗
   */
  showEditModal = (formData: IMap) => {
    this.transaction(() => {
      this.dispatch('brandActor: editFormData', formData);
      this.dispatch('brandActor: showModal');
    });
  };

  /**
   * 关闭弹窗
   */
  closeModal = () => {
    this.dispatch('brandActor: closeModal');
  };

  /**
   * 修改添加/编辑的表单信息
   */
  editFormData = (formData: IMap) => {
    this.dispatch('brandActor: editFormData', formData);
  };

  /**
   * 修改品牌logo图片
   */
  editImages = (images: IList) => {
    this.dispatch('brandActor: editImages', images);
  };

  /**
   * 添加品牌
   */
  doAdd = async () => {
    const formData = this.state().get('formData');
    let result: any;
    if (formData.get('brandId')) {
      result = await editBrand(formData);
    } else {
      result = await addBrand(formData);
    }
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('Operation succeeded');
      // 刷新
      this.refresh();
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 删除品牌
   */
  doDelete = async (brandId: string) => {
    deleteBrand(brandId);

    // 刷新
    this.refresh();
  };
}
