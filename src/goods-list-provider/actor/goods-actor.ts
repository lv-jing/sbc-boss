import { Actor, Action, IMap } from 'plume2';
import { List } from 'immutable';

declare type IList = List<any>;

export default class GoodsActor extends Actor {
  defaultState() {
    return {
      // 商品分页数据
      goodsPage: {
        content: []
      },
      // 商品SKU全部数据
      goodsInfoList: [],
      // 商品SKU的规格值全部数据
      goodsInfoSpecDetails: [],
      // 分类列表
      goodsCateList: [],
      // 品牌列表
      goodsBrandList: [],
      // 禁售理由弹出框是否显示
      modalVisible: false,
      // 商品标识(禁售单个商品时使用)
      forbidGoodsId: '',
      // 禁售原因
      forbidReason: '',
      // 展开显示的spuIdList
      expandedRowKeys: [],
      // 模糊条件-SKU编码(搜索出来直接展开显示这个sku对应的spu)
      likeGoodsInfoNo1: '',
      //存放已经导入商品库的商品
      importStandard: []
    };
  }

  @Action('goodsActor: init')
  init(state: IMap, data) {
    let exp = List();
    if (
      state.get('likeGoodsInfoNo1') != '' &&
      data
        .get('goodsPage')
        .get('content')
        .count() > 0
    ) {
      exp = data
        .get('goodsPage')
        .get('content')
        .map((value) => value.get('goodsId'));
    }
    return state
      .merge(data)
      .set('expandedRowKeys', exp)
      .set('modalVisible', false)
      .set('forbidGoodsId', '')
      .set('forbidReason', '');
  }

  @Action('goodsActor:editLikeGoodsInfoNo1')
  editLikeGoodsInfoNo1(state: IMap, value) {
    return state.set('likeGoodsInfoNo1', value);
  }

  @Action('goodsActor:editExpandedRowKeys')
  editExpandedRowKeys(state: IMap, expandedRowKeys: IList) {
    return state.set('expandedRowKeys', expandedRowKeys);
  }

  @Action('goodsActor:changeForbidGoodsId')
  changeForbidGoodsId(state: IMap, forbidGoodsId) {
    return state.set('forbidGoodsId', forbidGoodsId);
  }

  @Action('goodsActor:changeForbidReason')
  changeForbidReason(state: IMap, forbidReason) {
    return state.set('forbidReason', forbidReason);
  }

  /**
   * 显示/关闭弹窗
   */
  @Action('goodsActor: switchShowModal')
  switchShow(state, flag: boolean) {
    if (flag) {
      return state.set('modalVisible', flag);
    } else {
      return state
        .set('modalVisible', flag)
        .set('forbidGoodsId', '')
        .set('forbidReason', '');
    }
  }

  /**
   * 更新已加入商品库的数据
   * @param state
   * @param {string} goodsId
   */
  @Action('goodsActor: updateGoodsLibrary')
  updateGoodsLibrary(state, goodsId: string) {
    const importStandard = state.get('importStandard');
    state = state.set('importStandard', importStandard);
    let content = state.getIn(['goodsPage', 'content']);
    content = content.map((value) => {
      if (value.get('goodsId') == goodsId) {
        return value.set('addToGoodsLibrary', false);
      }
      return value;
    });
    return state.setIn(['goodsPage', 'content'], content);
  }
}
