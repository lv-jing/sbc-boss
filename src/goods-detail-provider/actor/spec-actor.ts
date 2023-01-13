import { Actor, Action } from 'plume2';
import { IList, IMap } from 'typings/globalType';
import { fromJS, Map, List } from 'immutable';
import { message } from 'antd';

export default class GoodsSpecActor extends Actor {
  defaultState() {
    return {
      // 是否为单规格
      specSingleFlag: true,
      // 规格列表
      goodsSpecs: [
        {
          specId: this._getRandom(),
          isMock: true,
          specName: '规格1',
          specValues: []
        }
      ],
      goodsList: [
        {
          id: this._getRandom(),
          index: 1,
          goodsInfoNo: this._randomGoodsInfoNo()
        }
      ],
      stockChecked: false,
      stockDisable: false
    };
  }

  /**
   * 随机生成sku编码
   * @returns {string}
   * @private
   */
  _randomGoodsInfoNo() {
    return (
      '8' +
      new Date()
        .getTime()
        .toString()
        .slice(4, 10) +
      Math.random()
        .toString()
        .slice(2, 5)
    );
  }

  /**
   *  初始化规格及商品
   */
  @Action('goodsSpecActor: init')
  init(
    state,
    { goodsSpecs, goodsList }: { goodsSpecs: IList; goodsList: IList }
  ) {
    if (!goodsSpecs.isEmpty()) {
      state = state.set('goodsSpecs', goodsSpecs);
    }
    return state.set('goodsList', goodsList);
  }

  /**
   * 设置是否为单规格
   */
  @Action('goodsSpecActor: editSpecSingleFlag')
  editSpecSingleFlag(state, specSingleFlag: boolean) {
    if (specSingleFlag) {
      state = state.set(
        'goodsList',
        fromJS([
          {
            id: Math.random(),
            index: 1,
            goodsInfoNo: this._randomGoodsInfoNo()
          }
        ])
      );
      state = state.set(
        'goodsSpecs',
        fromJS([
          {
            specId: this._getRandom(),
            isMock: true,
            specName: '规格1',
            specValues: []
          }
        ])
      );
    }
    return state.set('specSingleFlag', specSingleFlag);
  }

  /**
   * 修改规格名称
   */
  @Action('goodsSpecActor: editSpecName')
  editSpecName(
    state,
    { specId, specName }: { specId: number; specName: string }
  ) {
    return state.update('goodsSpecs', (goodsSpecs) => {
      const index = goodsSpecs.findIndex(
        (item) => item.get('specId') == specId
      );
      return goodsSpecs.update(index, (item) => item.set('specName', specName));
    });
  }

  /**
   * 修改规格值
   */
  @Action('goodsSpecActor: editSpecValues')
  editSpecValues(
    state,
    { specId, specValues }: { specId: number; specValues: IList }
  ) {
    let goodsSpecs = state.get('goodsSpecs');
    const index = goodsSpecs.findIndex((item) => item.get('specId') == specId);
    goodsSpecs = goodsSpecs.update(index, (item) =>
      item.set('specValues', specValues)
    );
    const goods = this._getGoods(goodsSpecs, state.get('goodsList'));
    if (goods.count() > 50) {
      message.error('SKU数量不超过50个');
      return state.set('goodsSpecs', goodsSpecs);
    }

    return state.set('goodsSpecs', goodsSpecs).set('goodsList', goods);
  }

  /**
   * 修改商品属性
   */
  @Action('goodsSpecActor: editGoodsItem')
  editGoodsItem(
    state,
    { id, key, value }: { id: string; key: string; value: string }
  ) {
    return state.update('goodsList', (goodsList) => {
      const index = goodsList.findIndex((item) => item.get('id') == id);
      return goodsList.update(index, (item) => item.set(key, value));
    });
  }

  /**
   * 移除sku图片
   * @param state
   * @param skuId
   */
  @Action('goodsSpecActor: removeImg')
  removeImg(state, skuId: string) {
    return state.update('goodsList', (goodsList) => {
      const index = goodsList.findIndex((item) => item.get('id') == skuId);
      return goodsList.update(index, (item) => item.set('images', fromJS([])));
    });
  }

  /**
   * 修改商品属性
   */
  @Action('goodsSpecActor: deleteGoodsInfo')
  deleteGoodsInfo(state, id) {
    return state.update('goodsList', (goodsList) => {
      const index = goodsList.findIndex((item) => item.get('id') == id);
      return goodsList.delete(index);
    });
  }

  /**
   * 添加规格
   */
  @Action('goodsSpecActor: addSpec')
  addSpec(state) {
    let goodsSpecs = state.get('goodsSpecs');
    const spec = fromJS({
      specId: this._getRandom(),
      isMock: true,
      specName: '规格' + (goodsSpecs.count() + 1),
      specValues: []
    });
    return state.update('goodsSpecs', (goodsSpecs) => goodsSpecs.push(spec));
  }

  /**
   * 添加规格
   */
  @Action('goodsSpecActor: deleteSpec')
  deleteSpec(state, specId) {
    state = state.update('goodsSpecs', (goodsSpecs) =>
      goodsSpecs.delete(
        goodsSpecs.findIndex((spec) => spec.get('specId') == specId)
      )
    );

    // 规格都删掉了
    let goodsSpecs = state.get('goodsSpecs');
    //if (goodsSpecs.count() === 0) {
    const goods = this._getGoods(goodsSpecs, state.get('goodsList'));
    state = state.set('goodsList', goods);
    //}
    return state;
  }

  /**
   * 同步库存
   * @param state
   * @returns {any}
   * @private
   */
  @Action('goodsSpecActor: synchStockNum')
  synchStockNum(state) {
    if (state.get('stockChecked')) {
      let datasList = state.get('goodsList');
      datasList.forEach((value, key) => {
        datasList = datasList.set(
          key,
          value.setIn(['stock'], datasList.get(0).get('stock'))
        );
      });
      return state.set('stockDisable', true).set('goodsList', datasList);
    }
    return state.set('stockDisable', false);
  }

  /**
   * 更新库存选中状态
   * @param state
   * @param stockChecked
   * @returns {any}
   * @private
   */
  @Action('goodsSpecActor: editStockChecked')
  updateStockChecked(state, stockChecked: boolean) {
    return state.set('stockChecked', stockChecked);
  }

  /**
   * 获取表格数据
   */
  _getGoods = (goodsSpecs: IList, goodsList: IList) => {
    if (goodsSpecs.isEmpty()) {
      return fromJS([]);
    }

    let resultArray = this._convertSpev(goodsSpecs.first());
    if (goodsSpecs.count() > 1) {
      resultArray = this._convertSpecValues(
        this._convertSpev(goodsSpecs.first()),
        0,
        goodsSpecs.slice(1).toList()
      );
    }

    // 生成的sku列表和现有的匹配，规格值一致的话，使用现有的sku覆盖生成的
    resultArray = resultArray.map((o) => {
      const skuSvIds = o
        .filter((_v, k) => k.indexOf('specDetailId-') === 0)
        .valueSeq()
        .sort((a, b) => a - b)
        .join();

      const sku = goodsList.find((sku) => sku.get('skuSvIds') == skuSvIds);
      return sku ? o.mergeDeep(sku) : o;
    });
    return resultArray;
  };

  _convertSpecValues = (
    specValuesArray: IList,
    index: number,
    goodsSpecs: IList
  ) => {
    let resultArray = List();
    let resultIndex = 1;
    const spec = goodsSpecs.get(index);

    specValuesArray.forEach((item1) => {
      spec.get('specValues').forEach((item2) => {
        const specId = 'specId-' + spec.get('specId');
        let goodsItem = item1.set(specId, item2.get('detailName'));
        const goodsInfoNo = this._randomGoodsInfoNo();
        goodsItem = goodsItem.set(
          'specDetailId-' + spec.get('specId'),
          item2.get('specDetailId')
        );
        goodsItem = goodsItem.set('id', this._getRandom());
        goodsItem = goodsItem.set('index', resultIndex++);
        goodsItem = goodsItem.set('goodsInfoNo', goodsInfoNo);
        let skuSvIds = fromJS(item1.get('skuSvIds')).toJS();
        skuSvIds.push(item2.get('specDetailId'));
        skuSvIds.sort((a, b) => a - b);
        goodsItem = goodsItem.set('skuSvIds', skuSvIds);
        resultArray = resultArray.push(goodsItem);
      });
    });
    if (index == goodsSpecs.count() - 1) {
      return resultArray;
    }
    return this._convertSpecValues(resultArray, ++index, goodsSpecs);
  };

  /**
   * 转换规格为数组
   */
  _convertSpev = (spec: IMap) => {
    return spec.get('specValues').map((item, index) => {
      const specId = 'specId-' + spec.get('specId');
      const specDetailId = 'specDetailId-' + spec.get('specId');
      const goodsInfoNo = this._randomGoodsInfoNo();
      return Map({
        [specId]: item.get('detailName'),
        [specDetailId]: item.get('specDetailId'),
        id: this._getRandom(),
        index: index + 1,
        goodsInfoNo: goodsInfoNo,
        skuSvIds: [item.get('specDetailId')]
      });
    });
  };

  /**
   *  获取整数随机数
   */
  _getRandom = () => {
    return parseInt(
      Math.random()
        .toString()
        .substring(2, 18)
    );
  };
}
