import { Actor, Action } from 'plume2';
import { IList, IMap } from 'typings/globalType';
import { fromJS, Map, List } from 'immutable';
import { message } from 'antd';
import { Const } from 'qmkit';

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
      // 批量设置市场价开关
      marketPriceChecked: false
    };
  }

  // 缓存已经生成过的sku编码，避免同一批生成的编码重复
  generatedNo = Map();

  /**
   * 随机生成sku编码，同一个页面内判重
   * @returns {string}
   * @private
   */
  _randomGoodsInfoNo() {
    const skuNo =
      '8' +
      new Date()
        .getTime()
        .toString()
        .slice(4, 10) +
      Math.random()
        .toString()
        .slice(2, 5);

    // 如果已经生成过，重新生成
    if (this.generatedNo.get(skuNo)) {
      return this._randomGoodsInfoNo();
    }

    this.generatedNo = this.generatedNo.set(skuNo, 1);

    return skuNo;
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
            id: Math.random()
              .toString()
              .substring(2),
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
    if (goods.count() > Const.spuMaxSku) {
      // 只进行提示，但是不拦截，保存时拦截
      message.error(`SKU数量不超过${Const.spuMaxSku}个`);
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

    const goods = this._getGoods(goodsSpecs, state.get('goodsList'));
    if (goods.count() > Const.spuMaxSku) {
      // 只进行提示，但是不拦截，保存时拦截
      message.error(`SKU数量不超过${Const.spuMaxSku}个`);
    }

    state = state.set('goodsList', goods);

    return state;
  }

  /**
   * 同步市场价
   * @param state
   * @returns {any}
   * @private
   */
  @Action('goodsSpecActor: synchMarketPrice')
  synchMarketPrice(state) {
    let dataList = state.get('goodsList');
    dataList = dataList.map((item) =>
      item.set('marketPrice', dataList.get(0).get('marketPrice'))
    );
    return state.set('goodsList', dataList);
  }

  /**
   * 更新市场价选中状态
   * @param state
   */
  @Action('goodsSpecActor: updateMarketPriceChecked')
  updateMarketPriceChecked(state, checked: boolean) {
    return state.set('marketPriceChecked', checked);
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

  /**
   * 递归计算笛卡尔积
   *
   *  param :
   * [{ specId: '1111', specValues: ['红', '蓝'] },
   * { specId: '2222', specValues: ['大号', '小号'] }]
   *
   *  result:
   *  [{ '1111': '红', '2222': '大号' },
   *  { '1111': '红', '2222': '大号' },
   *  { '1111': '蓝', '2222': '小号' },
   *  { '1111': '蓝', '2222': '小号' }]
   */
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
