import * as React from 'react';
import { fromJS } from 'immutable';

import { message, Modal, Form } from 'antd';
//import RelatedForm from './related-form';
import ProductGridSKU from './product-grid-sku';
import { IList } from '../../../typings/globalType';
import { Relax } from 'plume2';
import { noop } from 'qmkit';
import * as _ from 'lodash';

let targetGoodsList = [];
let targetGoodsIds = [];

@Relax
class ProductTooltipSKU extends React.Component<any, any> {
  props: {
    relaxProps?: {
      sharing: any;
      productForm: any;
      productList: IList;
      onProductselectSku: Function;
      loading: boolean;
      createLink: any;
      getGoodsId: any;
      onFormFieldChange: Function;
      editGoodsItem: Function;
      goodsList: IList;
      setSubSkuSelectdRows: Function;

    };
    showModal: Function;
    selectedRows: IList;
    visible: boolean;
    onOkBackFun: Function;
    onCancelBackFun: Function;
    skuLimit?: number;
    showValidGood?: boolean;
    companyType?: number;
    //搜索参数
    searchParams?: Object;
    //应用标示。如添加秒杀商品：saleType
    application?: string;
    pid: any;
    initCateList: any;
    id: any

  };

  static relaxProps = {
    sharing: 'sharing',
    productForm: 'productForm',
    onProductselectSku: noop,
    loading: 'loading',
    productList: 'productList',
    createLink: 'createLink',
    getGoodsId: 'getGoodsId',
    initCateList: 'initCateList',
    goodsList: 'goodsList',
    onFormFieldChange: noop,
    editGoodsItem: noop,
    setSubSkuSelectdRows: noop

  };
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: []
    };
  }

  componentDidMount = () => {
    this.init();
  };

  init = () => {
    const { goodsList, setSubSkuSelectdRows } = this.props.relaxProps;

    let curGoodsItem = goodsList.toJS().find(item => item.id === this.props.id);
    let goodsInfoBundleRels = curGoodsItem.goodsInfoBundleRels || [];
    setSubSkuSelectdRows(goodsInfoBundleRels);
    this.setState({
      selectedRows: goodsInfoBundleRels
    });
  };

  row2Bundle = (selectedRows) => {
    if (Array.isArray(selectedRows)) {
      return selectedRows.map((item) => {
        return {
          subGoodsInfoId: item.subGoodsInfoId || item.goodsInfoId,
          bundleNum: item.bundleNum || 1,
          subStock: item.subStock || item.stock,
          stock: item.stock,
          saleableFlag: item.saleableFlag,
          marketPrice: item.marketPrice,
          subMarketPrice: item.subMarketPrice,
          subscriptionPrice: item.subscriptionPrice,
          goodsInfoNo: item.goodsInfoNo,
          subGoodsInfoNo: item.subGoodsInfoNo || item.goodsInfoNo
        };
      })
    } else {
      return [];
    }
  }

  handleOK = () => {
    const { selectedRows } = this.state
    const { goodsList, editGoodsItem } = this.props.relaxProps;

    let goodsInfoBundleRels = this.row2Bundle(selectedRows);

    let curGoodsItem = goodsList.toJS().filter(item => item.id === this.props.id)[0];
    if (goodsInfoBundleRels.length <= 10) {
      if (goodsInfoBundleRels.length !== 0) {
        // 设置Market Price
        let subscriptionPrice = 0;
        let stockArr = [];
        let marketPrice = goodsInfoBundleRels.reduce((sum, item) => {
          subscriptionPrice += item.subscriptionPrice * item.bundleNum;
          stockArr.push(Math.round(item.subStock / item.bundleNum));
          return sum + item.marketPrice * item.bundleNum;
        }, 0);
        if (curGoodsItem && !curGoodsItem.goodsId) {
          editGoodsItem(curGoodsItem.id, 'marketPrice', marketPrice);
          editGoodsItem(curGoodsItem.id, 'subscriptionPrice', subscriptionPrice);

        }
        editGoodsItem(curGoodsItem.id, 'stock', Math.min(...stockArr));
      }
      this.props.showModal({ type: 0 }, this.props.pid);
      editGoodsItem(curGoodsItem.id, 'goodsInfoBundleRels', goodsInfoBundleRels);
    } else {
      message.info('Maximum 10 products!');
    }
    //this.props.form.resetFields();
    this.clearSearchForm()
  }
  clearSearchForm = () => {
    const { onFormFieldChange } = this.props.relaxProps
    onFormFieldChange({ key: 'likeGoodsName', value: '' });
    onFormFieldChange({ key: 'likeGoodsNo', value: '' });
    onFormFieldChange({ key: 'goodsCateId', value: '' });
    onFormFieldChange({ key: 'storeCategoryIds', value: null });
    onFormFieldChange({ key: 'brandId', value: '' });
  }

  render() {
    const { visible, skuLimit, showValidGood, searchParams } = this.props;
    const { selectedRows } = this.state;


    return (
      <Modal
        maskClosable={false}
        title={
          <div>
            Choose goods&nbsp;
            <small>
              <span style={{ color: 'red' }}>{selectedRows.length}</span> items have been selected
            </small>
          </div>
        }
        width={1100}
        visible={visible}
        onOk={() => {
          this.handleOK()
        }

        }
        onCancel={() => {
          this.props.showModal({ type: 0 }, this.props.pid);
          this.props.form.resetFields();
          this.clearSearchForm()
          //onCancelBackFun();
        }}
        okText="Confirm"
        cancelText="Cancel"
      >
        {
          <ProductGridSKU
            form={this.props.form}
            pid={this.props.pid}
            visible={visible}
            skuLimit={skuLimit}
            isScroll={false}
            // selectedRows={selectedRows}
            rowChangeBackFun={this.rowChangeBackFun}
            searchParams={searchParams}
          />
        }
      </Modal>
    );
  }
  arrayFilter = (arrKey, arrList) => {
    let tempList = [];
    arrKey.map((item) => {
      tempList.push(arrList.find((el) => el && el.goodsInfoNo === item));
    });
    return tempList;
  };

  rowChangeBackFun = (selectedRows) => {
    this.setState({
      selectedRows
    });
  };
}

export default Form.create()(ProductTooltipSKU);
