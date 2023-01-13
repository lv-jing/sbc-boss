import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS, List, Map } from 'immutable';
import { Const } from 'qmkit';
import * as webApi from './webapi';
import InfoActor from './actor/info-actor';
import moment from 'moment';
import TableKeyActor from './actor/table-key-actor';
import CateActor from './actor/cate-actor';
import { IMap } from '../../typings/globalType';
import update from 'immutability-helper';
import CouponActor from './actor/coupon-actor';

export default class AppStore extends Store {
  bindActor() {
    return [
      new InfoActor(),
      new TableKeyActor(),
      new CateActor(),
      new CouponActor()
    ];
  }

  /**
   * 初始化方法
   */
  init = async () => {
    // 积分商品分页查询
    await this.queryPage();
    // 积分商品分类查询
    const { res } = (await webApi.getCateList()) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('cate: init', fromJS(res.context.pointsGoodsCateVOList));
    } else {
      message.error(message);
    }
    // 积分兑换券分页查询
    await this.queryCouponPage();
  };

  /**
   * 积分商品查询分页数据
   */
  queryPage = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    // 设置loading开始状态
    this.dispatch('info:setLoading', true);
    const param = this.state()
      .get('searchData')
      .toJS();
    param.pageNum = pageNum;
    param.pageSize = pageSize;
    const { res: pageRes } = await webApi.getPage(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      // 3.格式化返回结构
      let pointsGoodsVOPage = pageRes.context.pointsGoodsVOPage;
      pointsGoodsVOPage.content.forEach((pointsGoodsVO) => {
        // 3.2.有效期
        // 按起止时间
        let startTime = moment(pointsGoodsVO.beginTime)
          .format(Const.TIME_FORMAT)
          .toString();
        let endTime = moment(pointsGoodsVO.endTime)
          .format(Const.TIME_FORMAT)
          .toString();
        pointsGoodsVO.validity = `${startTime} 至 ${endTime}`;
      });
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('info:setLoading', false);
        // 设置分页数据
        this.dispatch('info:setPageData', pointsGoodsVOPage);
        // 设置当前页码
        this.dispatch('info:setCurrent', pageNum + 1);
        // 清空勾选信息
        this.dispatch('info:setCheckedData', List());
      });
    } else {
      message.error(pageRes.message);
      this.dispatch('info:setLoading', false);
    }
  };

  /**
   * 设置积分商品搜索项信息并查询分页数据
   */
  onSearch = async (searchData) => {
    this.dispatch('info:setSearchData', fromJS(searchData));
    await this.queryPage();
  };

  /**
   * 单个删除积分商品
   */
  onDelete = async (id) => {
    const { res: delRes } = await webApi.deleteById(id);
    if (delRes.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      await this.queryPage();
    } else {
      message.error(delRes.message);
    }
  };

  /**
   * 打开积分商品编辑弹框
   */
  onEdit = async (id) => {
    const editData = this.state()
      .get('dataList')
      .find((v) => v.get('pointsGoodsId') == id);
    this.transaction(() => {
      this.dispatch('info:setFormData', editData);
      this.dispatch('info:setVisible', true);
    });
  };

  /**
   * 修改新增/编辑的表单信息
   */
  editFormData = (data) => {
    this.dispatch('info:editFormData', data);
  };

  /**
   * 关闭弹窗
   */
  closeModal = () => {
    this.dispatch('info:setVisible', false);
  };

  /**
   * 积分商品保存新增/编辑弹框的内容
   */
  onSave = async () => {
    const formData = this.state().get('formData');
    let result;
    if (formData.get('pointsGoodsId')) {
      result = await webApi.modify(formData);
    } else {
      result = await webApi.add(formData);
    }
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.closeModal();
      this.dispatch('info:setFormData', fromJS({}));
      await this.init();
    } else {
      message.error(result.res.message);
    }
  };

  //tab-list 切换
  onTabChange = (index: number) => {
    this.dispatch('change:key', index);
    this.init();
  };

  /**
   * 显示添加框
   */
  modal = (isAdd) => {
    this.transaction(() => {
      this.dispatch('cate: modal', isAdd);
      this.dispatch('cate: editFormData', Map({ cateName: null }));
    });
  };

  /**
   * 显示修改弹窗
   */
  showEditModal = (formData: IMap, isAdd: boolean) => {
    this.transaction(() => {
      this.dispatch('cate: editFormData', formData);
      this.dispatch('cate: modal', isAdd);
      this.dispatch('cate: filed: value', {
        field: 'context',
        value: formData.get('rightsDescription')
      });
    });
  };

  /**
   * 修改form信息
   */
  editCateFormData = (formData: IMap) => {
    this.dispatch('cate: editFormData', formData);
  };

  /**
   * 拖拽排序
   * @param dragIndex  拖拽排序源
   * @param hoverIndex 拖拽排序目标位置
   * @returns {Promise<void>}
   */
  cateSort = async (dragIndex, hoverIndex) => {
    let couponCateList = this.state()
      .get('cateList')
      .toJS();
    //拖拽排序
    const dragRow = couponCateList[dragIndex];
    //拖拽排序后的列表
    let sortList = update(couponCateList, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]]
    });
    let cateIdList = [];
    for (let index in sortList) {
      cateIdList.push(sortList[index].cateId);
    }
    const { res } = (await webApi.dragSort({ cateIdList: cateIdList })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.refresh();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 删除商品分类
   */
  deleteCate = async (couponCateId) => {
    let result: any = await webApi.deleteCate(couponCateId);
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      this.refresh();
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 积分商品状态 启用/停用
   */
  modifyStatus = async ({ pointsGoodsId, status }) => {
    const { res } = await webApi.modifyStatus({
      pointsGoodsId,
      status
    });
    if (res.code == Const.SUCCESS_CODE) {
      if (status == 0) {
        message.success('停用成功!');
      } else if (status == 1) {
        message.success('开启成功!');
      }
      this.init();
    } else {
      message.error(res.message);
    }
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
   * 添加积分商品分类
   */
  doAdd = async () => {
    let result: any;
    const formData = this.state().get('formData');
    let params = { ...formData.toJS() };
    if (this.state().get('isAdd')) {
      result = await webApi.addCate(params);
    } else {
      result = await webApi.modifyCate(params);
    }
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      this.refresh();
      this.modal(false);
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 查询积分优惠券分页数据
   */
  queryCouponPage = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 }
  ) => {
    // 设置loading开始状态
    this.dispatch('coupon:setLoading', true);
    const param = this.state()
      .get('couponSearchData')
      .toJS();
    param.pageNum = pageNum;
    param.pageSize = pageSize;
    const { res: pageRes } = await webApi.getCouponPage(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      // 格式化返回结构
      let pointsCouponVOPage = pageRes.context.pointsCouponVOPage;
      pointsCouponVOPage.content.forEach((pointsCouponVO) => {
        // 优惠券面值
        pointsCouponVO.denominationStr =
          pointsCouponVO.couponInfoVO.fullBuyType == 0
            ? `满0减${pointsCouponVO.couponInfoVO.denomination}`
            : `满${pointsCouponVO.couponInfoVO.fullBuyPrice}减${
                pointsCouponVO.couponInfoVO.denomination
              }`;
        // 优惠券有效期
        // 按起止时间
        if (pointsCouponVO.couponInfoVO.rangeDayType == 0) {
          let startTime = moment(pointsCouponVO.couponInfoVO.startTime)
            .format(Const.TIME_FORMAT)
            .toString();
          let endTime = moment(pointsCouponVO.couponInfoVO.endTime)
            .format(Const.TIME_FORMAT)
            .toString();
          pointsCouponVO.couponValidity = `${startTime} 至 ${endTime}`;
        } else {
          // 按N天有效
          pointsCouponVO.couponValidity = `领取当天${
            pointsCouponVO.couponInfoVO.effectiveDays
          }日内有效`;
        }
        // 积分优惠券兑换日期
        let startTime = moment(pointsCouponVO.beginTime)
          .format(Const.TIME_FORMAT)
          .toString();
        let endTime = moment(pointsCouponVO.endTime)
          .format(Const.TIME_FORMAT)
          .toString();
        pointsCouponVO.pointsCouponTime = `${startTime} 至 ${endTime}`;
        // 券数量
        pointsCouponVO.count = `${pointsCouponVO.totalCount -
          pointsCouponVO.exchangeCount}/${pointsCouponVO.totalCount}`;
      });
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('coupon:setLoading', false);
        // 设置分页数据
        this.dispatch('coupon:setPageData', pageRes.context.pointsCouponVOPage);
        // 设置当前页码
        this.dispatch('coupon:setCurrent', pageNum + 1);
        // 清空勾选信息
        this.dispatch('coupon:setCheckedData', List());
      });
    } else {
      message.error(pageRes.message);
      this.dispatch('coupon:setLoading', false);
    }
  };

  /**
   * 设置积分兑换券搜索项信息并查询分页数据
   */
  onCouponSearch = async (searchData) => {
    this.dispatch('coupon:setSearchData', fromJS(searchData));
    await this.queryCouponPage();
  };

  /**
   * 启用/停用
   */
  modifyCouponStatus = async ({ pointsCouponId, status }) => {
    const { res } = await webApi.modifyCouponStatus({
      pointsCouponId,
      status
    });
    if (res.code == Const.SUCCESS_CODE) {
      if (status == 0) {
        message.success('停用成功!');
      } else if (status == 1) {
        message.success('开启成功!');
      }
      this.init();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 单个删除积分兑换券
   */
  onCouponDelete = async (id) => {
    const { res: delRes } = await webApi.deleteCouponById(id);
    if (delRes.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      await this.queryCouponPage();
    } else {
      message.error(delRes.message);
    }
  };

  /**
   * 打开积分兑换券编辑弹框
   */
  onCouponEdit = async (id) => {
    const editData = this.state()
      .get('couponList')
      .find((v) => v.get('pointsCouponId') == id);
    this.transaction(() => {
      this.dispatch('coupon:setFormData', editData);
      this.dispatch('coupon:setVisible', true);
    });
  };

  /**
   * 积分兑换券修改新增/编辑的表单信息
   */
  editCouponFormData = (data) => {
    this.dispatch('coupon:editFormData', data);
  };

  /**
   * 关闭积分兑换券编辑弹窗
   */
  closeCouponModal = () => {
    this.dispatch('coupon:setVisible', false);
  };

  /**
   * 保存积分兑换券编辑弹框的内容
   */
  onCouponSave = async () => {
    const formData = this.state().get('formData');
    let result;
    if (formData.get('pointsCouponId')) {
      result = await webApi.modifyCoupon(formData);
    }
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.closeCouponModal();
      this.dispatch('coupon:setFormData', fromJS({}));
      await this.init();
    } else {
      message.error(result.res.message);
    }
  };
}
