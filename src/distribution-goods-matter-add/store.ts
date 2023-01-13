import { IOptions, Store } from 'plume2';
import GoodsMatterActor from './actor/goods-matter-actor';
import * as webApi from './webapi';
import { Const, history,checkAuth } from 'qmkit';
import { message } from 'antd';
import { fromJS, List } from 'immutable';
import ModalActor from './actor/modal-actor';
import { IList } from '../../typings/globalType';
import VideoActor from './actor/video-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new GoodsMatterActor(), new ModalActor(), new VideoActor()];
  }

  /**
   * 校验权限
   */
  checkAuth=()=>{
   // 校验是否有导出权限
   const haveAuth = checkAuth('f_distribution_matter_add');
   this.dispatch('auth: checkAuth', haveAuth);
  }

  init = async (data, id?) => {
    this.dispatch('set: head', data.goodsInfoId);
    if (id) {
      //查询素材
      const { res } = await webApi.queryGoodsMatter(id);
      if (res.code != Const.SUCCESS_CODE) {
        message.error(res.message);
        return;
      }
      this.dispatch('init', fromJS(res.context));
    }
  };

  fieldsValue = (key, value) => {
    this.dispatch('data: field: change', { key, value });
  };

  save = async () => {
    const params = this.state().get('data').toJS();
    params.matterType=this.state().get('matterType');
    let images = this.state().get('images');
    let marketingImages = this.state().get('marketingImages');       
    //商品素材，要关联商品
    if(this.state().get('matterType')==0){
      if( this.state().get('chooseGoodsInfos').toJS().length==0){
        message.error('请添加商品');
        return;
      }else{
        params.goodsInfoId=this.state().get('chooseGoodsInfos').get(0).get('goodsInfoId');
        params.matter= images.count()>0?images.toJS().join():'';
      }     
    }else{
      params.matter= marketingImages.count()>0?JSON.stringify(marketingImages):'';      
    }
    const { res } = await webApi.add(params);
    if (res.code == Const.SUCCESS_CODE) {      
      message.success('新增分销素材成功!');
      history.goBack();
    } else {
      message.error(res.message);
    }
  };

  //--------------------------图片素材选择弹框-----------start-------------------

  /**
   * 移除图片
   * @param id
   */
  removeImg = (id) => {
    this.dispatch('delete: images', id);
  };

  /**
   * 清除选中的图片集合
   */
  cleanChooseImgs = () => {
    this.dispatch('modal: cleanChooseImg');
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
    const cateList: any = await webApi.getMatterCates();
    if (cateId == -1 && cateList.res.length > 0) {
      const cateIdList = fromJS(cateList.res).filter(
        (item) => item.get('isDefault') == 1
      );
      if (cateIdList.size > 0) {
        cateId = cateIdList.get(0).get('cateId');
      }
    }
    cateId = cateId ? cateId : this.state().get('cateId');
    const imageList: any = await webApi.fetchResource({
      pageNum,
      pageSize: 10,
      imageName: this.state().get('searchName'),
      cateId,
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
        this.dispatch(
          'modal: page',
          fromJS({ currentPage: pageNum + 1, resourceType: 0 })
        );
      });
    } else {
      message.error(imageList.res.message);
    }
  };

  /**
   * 放大还原图片
   */
  clickImg = (imgUrl: string) => {
    this.dispatch('modal: imgVisible', imgUrl);
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
    //const imgType = this.state().get('imgType');
    let matters;
    //素材类型，0：商品素材 1：营销素材  
    if(this.state().get('matterType')==0){
       matters = this.state().get('images');
    }else{
      matters = this.state().get('marketingImages');
    }
    
    // this.dispatch('edit: images',matters.push(chooseImgs.map(item=>{
    //   return {
    //     imgSrc:item.get('artworkUrl')
    //   }
    // })))   
    if(this.state().get('matterType')==1) {
      chooseImgs.map((item)=>{
        matters=matters.push(
            fromJS({imgSrc:item.get('artworkUrl')})
          )
       })
    }else{
      chooseImgs.map((item)=>{
        matters=matters.push(item.get('artworkUrl'))
       })
    }
   this.dispatch('edit: images', matters);
  };

  //--------------------------图片素材选择弹框--------end----------------------

  /**
   * 点击搜索保存搜索内容
   * @param {string} searchName
   * @returns {Promise<void>}
   */
  saveVideoSearchName = async (videoSearchName: string) => {
    this.dispatch('modal: videoSearchName', videoSearchName);
  };

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

  //--------------------------视频素材选择弹框-------------start-----------------

  videoSearch = async (videoName: string) => {
    this.dispatch('modal: videoSearch', videoName);
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

  /**
   * 移除视频
   * @param id
   */
  removeVideo = () => {
    this.dispatch('edit: video', '');
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
    const cateList: any = await webApi.getMatterCates();
    if (cateId == -1 && cateList.res.length > 0) {
      cateId = fromJS(cateList.res)
        .find((item) => item.get('isDefault') == 1)
        .get('cateId');
    }
    cateId = cateId
      ? cateId
      : this.state()
          .get('videoCateId')
          .toJS();

    //查询视频分页信息
    const videoList: any = await webApi.fetchResource({
      pageNum,
      pageSize: 10,
      resourceName: this.state().get('videoSearchName'),
      cateIds: [cateId],
      resourceType: 1
    });

    if (videoList.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        if (cateId) {
          this.selectVideoCate(cateId);
        }
        this.dispatch('cateActor: init', fromJS(cateList.res));
        if (successCount > 0) {
          //表示上传成功之后需要选中这些图片
          this.dispatch(
            'modal: chooseVideos',
            fromJS(videoList.res.context)
              .get('content')
              .slice(0, successCount)
          );
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
   * 确定选择以上视频
   */
  beSureVideos = () => {
    const chooseVideo = this.state().get('chooseVideos');
    this.dispatch(
      'edit: video',
      List.isList(chooseVideo) ? chooseVideo.get(0) : chooseVideo
    );
  };

  /**
   * 清除选中的视频
   */
  cleanChooseVideo = () => {
    this.dispatch('modal: cleanChooseVideo');
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
   * 给营销素材添加链接
   */
  addLink=(index)=>{
    //存储索引
    this.dispatch('save: marketingIndex',index)
    //弹出链接弹框    
    this.dispatch('toggle: linkModal')
    //带出当前index的link文案
    let marketingImages = this.state().get('marketingImages')
    let marketingIndex = this.state().get('marketingIndex')    
    let value = marketingImages.get(marketingIndex)?marketingImages.get(marketingIndex).get('link'):'';    
    this.dispatch('modal: setLink',value)    
  }

  setLink=(value)=>{
     this.dispatch('modal: setLink',value)
  }

  toggleModal=()=>{
    this.dispatch('toggle: linkModal')
  }

  /**
   * 给指定索引的商品素材添加链接地址
   */
  addLinkByIndex=()=>{
    this.dispatch('modal: addLinkByIndex')
    this.dispatch('toggle: linkModal')
  }

  toggleGoodsModal=()=>{
    this.dispatch('modal: toggleGoodsModal')
  }

  onOkBackFun=(skuIds,rows)=>{    
     //选中商品后的回调
     this.dispatch('modal: saveSkuIds',skuIds);
     this.dispatch('modal: saveRows',rows);
     //关闭弹框
     this.toggleGoodsModal();
  }  
   
  deleteSku=(skuId)=>{
     this.dispatch('chooseGoodsInfos :deleteSku',skuId)
  }
}
