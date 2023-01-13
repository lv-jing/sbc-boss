import { Actor, Action } from 'plume2';
import { fromJS } from 'immutable';
import { util } from 'qmkit';

export default class PicActor extends Actor {
  defaultState() {
    return {
      cateIds: [],
      cateId: [],
      imgCates: [],
      expandedKeys: ['0'],
      //图库里面的图片列表
      imgs: fromJS([]),
      // 扁平的分类列表信息
      cateAllList: [],
      page: {},
      imageName: '',
      visible: false,
      total: 0,
      currentPage: 0,
      pageSize: 15,
      searchName: '',
      // 弹窗中选中的
      chooseImgs: fromJS([]),
      //拼团规则图片
      chooseRuleImgs: fromJS([]),
      imgVisible: false,
      previewImage: '',
      maxCount: 1,
      imgType: 0, // 0: spu图片  1: sku图片   2: 详情
      skuId: '', // spu中该字段无
      //设置的图片和添加的链接的映射
      posterImgs: fromJS([]),
      targetImg: fromJS({}),
      // 已经选择的图片
      images: fromJS([])
    };
  }

  /**
   * 图片分类选中
   * @param state
   * @param cateIds
   */
  @Action('modal: cateIds')
  editCateIds(state, cateIds) {
    return state.set('cateIds', cateIds);
  }

  /**
   * 图片分类选择
   * @param state
   * @param cateId
   */
  @Action('modal: cateId')
  editCateId(state, cateId) {
    return state.set('cateId', cateId);
  }
  /**
   * 图片分类
   * @param state
   * @param imgCates
   */
  @Action('modal: imgCates')
  cates(state, cateList) {
    // 改变数据形态，变为层级结构
    const newDataList = cateList
      .filter((item) => item.get('cateParentId') == 0)
      .map((data) => {
        const children = cateList
          .filter((item) => item.get('cateParentId') == data.get('cateId'))
          .map((childrenData) => {
            const lastChildren = cateList.filter(
              (item) => item.get('cateParentId') == childrenData.get('cateId')
            );
            if (!lastChildren.isEmpty()) {
              childrenData = childrenData.set('children', lastChildren);
            }
            return childrenData;
          });

        if (!children.isEmpty()) {
          data = data.set('children', children);
        }
        return data;
      });
    return state.set('imgCates', newDataList).set('cateAllList', cateList);
  }

  /**
   * 图片集合
   * @param state
   * @param imgs
   */
  @Action('modal: imgs')
  imgs(state, imgs) {
    const chooseImgs = state.get('chooseImgs');
    return state
      .set(
        'imgs',
        imgs.get('content')
          ? imgs.get('content').map((img) => {
              img = img
                .set(
                  'checked',
                  chooseImgs.findIndex(
                    (i) => i.get('resourceId') === img.get('resourceId')
                  ) >= 0
                )
                .set('ruleChecked', false);
              return img;
            })
          : []
      )
      .set('total', imgs.get('totalElements'));
  }

  /**
   * 分页
   * @param state
   * @param page
   */
  @Action('modal: page')
  page(state, page) {
    return state.set('currentPage', page.get('currentPage'));
  }

  /**
   * 名称
   * @param state
   * @param {string} imageName
   */
  @Action('modal: search')
  search(state, imageName: string) {
    return state.set('imageName', imageName);
  }

  /**
   * 搜索
   * @param state
   * @param {string} searchName
   */
  @Action('modal: searchName')
  searchName(state, searchName: string) {
    return state.set('searchName', searchName);
  }

  /**
   * 点击图片
   * @param state
   * @param {any} check
   * @param {any} img
   */
  @Action('modal: chooseImg')
  chooseImg(state, { check, img }) {
    let imgs = state.get('imgs');
    imgs = imgs.map((v) => {
      if (v.get('resourceId') == img.get('resourceId')) {
        v = v.set('checked', check);
      } else {
        v = v.set('checked', false);
      }
      return v;
    });
    return state.set('imgs', imgs);
  }

  /**
   *
   * @param state
   * @param param1
   */
  @Action('modal: chooseRuleImg')
  chooseRuleImg(state, { ruleChecked, img }) {
    let imgs = state.get('imgs');
    imgs = imgs.map((v) => {
      if (v.get('resourceId') == img.get('resourceId')) {
        v = v.set('ruleChecked', ruleChecked);
      }
      return v;
    });
    return state.set('imgs', imgs);
  }

  /**
   * 放大还原图片
   * @param state
   * @param imgUrl
   */
  @Action('modal: imgVisible')
  clickImg(state, imgUrl: string) {
    const imgVisible = state.get('imgVisible');
    return state.set('imgVisible', !imgVisible).set('previewImage', imgUrl);
  }

  /**
   * 清除选中的图片集合
   * @param state
   */
  @Action('modal: cleanChooseImg')
  cleanChooseImg(state) {
    let imgs = state.get('imgs');
    return state.set('chooseImgs', fromJS([])).set(
      'imgs',
      imgs.map((i) => {
        i = i.set('checked', false);
        return i;
      })
    );
  }

  /**
   * 最大图片数量
   * @param state
   * @param maxCount
   */
  @Action('modal: maxCount')
  setMaxCount(state, maxCount) {
    return state.set('maxCount', maxCount);
  }

  /**
   * 选中上传成功的图片
   * @param state
   * @param successImgs
   */
  @Action('modal: chooseImgs')
  chooseImgs(state, successImgs) {
    let imgs = state.get('imgs');
    return state.set('chooseImgs', successImgs).set(
      'imgs',
      imgs.map((img) => {
        img = img.set(
          'checked',
          successImgs.findIndex(
            (i) => i.get('resourceId') === img.get('resourceId')
          ) >= 0
        );
        return img;
      })
    );
  }

  @Action('modal:toggleVisible')
  toggleVisible(state) {
    return state.set('visible', !state.get('visible'));
  }

  @Action('setting:targetImg')
  targetImg(state, img) {
    return state.set('targetImg', img);
  }

  @Action('setting: chooseImgs')
  posterImgs(state, chooseImgs) {
    return state.set('chooseImgs', chooseImgs);
  }

  @Action('setting :confirmChoose')
  confirmChoose(state) {
    let imgs = state.get('imgs');
    let confirmImg = imgs
      .filter((f) => f.get('checked') == true)
      .get(0)
      .set('resourceId', util.getRandom());
    return state.set('chooseImgs', state.get('chooseImgs').push(confirmImg));
  }

  @Action('setting :deleteImg')
  deleteImg(state, img) {
    const imgs = state.get('imgs');
    return state
      .set(
        'imgs',
        imgs.map((v) => {
          if (v.get('resourceId') == img.get('resourceId')) {
            v = v.set('checked', false);
          }
          return v;
        })
      )
      .set(
        'chooseImgs',
        state
          .get('chooseImgs')
          .filter((v) => v.get('resourceId') != img.get('resourceId'))
          .map((f) => {
            f = f.set('hover', false);
            return f;
          })
      );
  }

  @Action('settting :poster')
  initPoster(state, result: any) {
    //转JSON对象
    let posterImgs = fromJS(JSON.parse(result));
    return state.set('chooseImgs', posterImgs);
  }

  /**
   * 拖拽排序
   * @param state
   * @param param1
   */
  @Action('setting :imgSort')
  imgSort(state, { dragIndex, hoverIndex }) {
    let chooseImgs = state.get('chooseImgs');
    //交换位置
    let dragImg = chooseImgs.get(dragIndex);
    let hoverImg = chooseImgs.get(hoverIndex);
    chooseImgs = chooseImgs.set(hoverIndex, dragImg);
    chooseImgs = chooseImgs.set(dragIndex, hoverImg);
    return state.set('chooseImgs', chooseImgs);
  }

  /**
   * 关闭拼团广告图片库弹窗
   * @param state
   * @returns {any}
   */
  @Action('setting: cancelImgChoose')
  cancelImgChoose(state) {
    let chooseImgs = state.get('chooseImgs');
    let imgs = state.get('imgs');
    return state.set(
      'imgs',
      imgs.map((img) => {
        img = img.set(
          'checked',
          chooseImgs.findIndex(
            (i) => i.get('resourceId') === img.get('resourceId')
          ) >= 0
        );
        return img;
      })
    );
  }

  @Action('setting :chooseRuleImgs')
  confirmChooseRule(state) {
    return state.set(
      'imgs',
      state.get('imgs').map((img) => {
        img = img.set('ruleChecked', false);
        return img;
      })
    );
  }

  @Action('setting :clearChecked')
  clearChecked(state) {
    return state.set(
      'imgs',
      state.get('imgs').map((img) => {
        img = img.set('checked', false);
        return img;
      })
    );
  }

  @Action('modal: visible')
  visible(state, { imgType, skuId }: { imgType: number; skuId: string }) {
    let imgs = state.get('imgs');

    return state
      .set('visible', !state.get('visible'))
      .set('imageName', '')
      .set('searchName', '')
      .set('chooseImgs', fromJS([]))
      .set(
        'imgs',
        imgs.map((img) => {
          img = img.set('checked', false);
          return img;
        })
      )
      .set('imgType', imgType)
      .set('skuId', skuId);
  }
}
