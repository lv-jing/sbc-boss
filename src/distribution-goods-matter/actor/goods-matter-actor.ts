import { Action, Actor } from 'plume2';
import { fromJS } from 'immutable';

export default class GoodsMatterActor extends Actor {
  defaultState() {
    return {
      data: {
        id: '',
        goodsInfoId: '',
        matterType:'',
        matter: '',
        recommend: ''
      },
      //原来的商品素材的图片
      images:fromJS([]) ,
      //新增的营销素材的图片
      marketingImages:fromJS([]),
      video: '',
      matterType:0,
      //添加链接弹框的显示隐藏
      linkVisible:false,
      marketingIndex:0,
      marketingLink:''
    };
  }

  @Action('set: head')
  setHeadInfo(state, goodsInfoId) {
    return state.setIn(['data', 'goodsInfoId'], goodsInfoId);
  }

  @Action('init')
  init(state, data) {
    
    // if (0 == data.get('matterType')) {
    //   state = state.set('images', fromJS(data.get('matter').split(',')));
    // } else {
    //   state = state.set('video', data.get('matter'));
    // }
    //是商品素材还是营销素材(0:商品素材  1:营销素材)
    let materialImages;
    let matterType = data.get('matterType');
    if(matterType==0){
      materialImages=data.get('matter')?fromJS(data.get('matter').split(',')):fromJS([])
    }else{
      materialImages=data.get('matter')&&JSON.parse(data.get('matter')).length>0?
      fromJS(JSON.parse(data.get('matter'))):fromJS([]);
    }    
    return state.set('matterType',data.get('matterType'))
    .set('images',
    matterType==0?materialImages:fromJS([]))
    .set('marketingImages',matterType==1?materialImages:fromJS([]))
    .set('data',data)
  }

  @Action('data: field: change')
  changeDataField(state, { key, value }) {
    if (key == 'matterType') {
      return state.set('matterType',value)
      // if (value == 0) {
      //   state = state.set('images', fromJS([])).setIn(['data', 'matter'], '');
      // } else {
      //   state = state.set('video', '').setIn(['data', 'matter'], '');
      // }
    }
    return state.setIn(['data', key], value);
  }

  // @Action('edit: images'）
  // setImages(state, images) { 
  //   if(state.get('matterType')==0){
  //     return state.set('images',images)
  //   }else{
  //     return state.set('marketingImages',images)
  //   }    
  //   // state = state.set('images', images);
  //   // let matter = '';
  //   // images.toJS().forEach((v) => (matter = matter + v + ','));
  //   // matter = matter.substring(0, matter.length - 1);
  //   // return state.setIn(['data', 'matter'], matter);
  // }

  @Action('edit: images')
  setImages(state,images){
    if(state.get('matterType')==0){
      return state.set('images',images)
    }else{
      return state.set('marketingImages',images)
    }
  }

  @Action('edit: video')
  setVideo(state, video) {
    state = state.set('video', video.artworkUrl);
    return state.setIn(['data', 'matter'], video.artworkUrl);
  }

  @Action('delete: images')
  deleteImages(state, index) {    
    let images;
    if(state.get('matterType')==0){
      images = state.get('images').delete(index);   
      state = state.set('images', images); 
    }else{
      images = state.get('marketingImages').delete(index);    
      state = state.set('marketingImages', images); 
    }       
    // let matter = '';
    // images.toJS().forEach((v) => (matter = matter + v + ','));
    // matter = matter.substring(0, matter.length - 1);
    return state;
  }

  @Action('toggle: linkModal')
  toggleLinkModal(state){
    return state.set('linkVisible',!state.get('linkVisible'))
  }

  @Action('save: marketingIndex')
  marketingIndex(state,index){
    return state.set('marketingIndex',index)
  }

  @Action('modal: setLink')
  setLink(state,value){
    return state.set('marketingLink',value);
    // let marketingImages = state.get('marketingImages')
    // return state.set('marketingImages',marketingImages.map((img,index)=>{
    //   if(index==state.get('marketingIndex')){
    //     img.link=value;        
    //   }
    //   return img;
    // }))
  }

  @Action('modal: addLinkByIndex')
  addLinkByIndex(state){    
    let marketingImages = state.get('marketingImages')
    let value = state.get('marketingLink')
    return state.set('marketingImages',marketingImages.map((img,index)=>{         
      if(index==state.get('marketingIndex')){
        img=img.set('link',value);        
      }
      return img;
    }))
  }
}
