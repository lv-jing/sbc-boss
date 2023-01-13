import * as React from 'react';
import { fromJS } from 'immutable';

import { message, Modal, Form } from 'antd';
import RelatedForm from './related-form';
import ProductGrid from './product-grid';
import { IList } from '../../../typings/globalType';
import { Relax } from 'plume2';
import { noop } from 'qmkit';
import { FormattedMessage } from 'react-intl';
@Relax
class ProductTooltip extends React.Component<any, any> {
  props: {
    relaxProps?: {
      sharing: any;
      productForm: any;
      productList: IList;
      onProductselect: Function;
      onProductForm: Function;
      loading: boolean;
      createLink: any;
      getGoodsId: any;
      productTooltip: any;
    };
    showModal: Function;
    selectedSkuIds: IList;
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
  };

  static relaxProps = {
    sharing: 'sharing',
    productForm: 'productForm',
    onProductForm: noop,
    onProductselect: noop,
    loading: 'loading',
    productList: 'productList',
    createLink: 'createLink',
    getGoodsId: 'getGoodsId',
    productTooltip: 'productTooltip'
  };
  constructor(props) {
    super(props);
    this.state = {
      selectedSkuIds: props.selectedSkuIds ? props.selectedSkuIds : [],
      selectedRows: props.selectedRows ? props.selectedRows : fromJS([])
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      selectedRows: nextProps.selectedRows ? nextProps.selectedRows : fromJS([]),
      selectedSkuIds: nextProps.selectedSkuIds ? nextProps.selectedSkuIds : []
    });
  }

  render() {
    const { visible, onOkBackFun, onCancelBackFun, skuLimit, showValidGood, searchParams } = this.props;
    const { selectedSkuIds, selectedRows } = this.state;
    const { onProductselect, getGoodsId, productTooltip } = this.props.relaxProps;

    return (
      <Modal
        maskClosable={false}
        title={
          <div>
            <FormattedMessage id="Product.ChooseGoods" />
            &nbsp;
            <small>
              <span style={{ color: 'red' }}>{selectedSkuIds.length}</span> <FormattedMessage id="Product.itemsHaveBeenSelected" />
            </small>
          </div>
        }
        width={1100}
        visible={visible}
        onOk={() => {
          let targetGoodsIds = [];
          this.state.selectedRows.toJS().map((item) => targetGoodsIds.push(item.goodsId));
          let obj = {
            sourceGoodsId: getGoodsId,
            targetGoodsIds: targetGoodsIds
          };
          onProductselect(obj);
          this.props.showModal(false);
          this.props.form.resetFields();
        }}
        onCancel={() => {
          this.props.showModal(false);
          this.props.form.resetFields();
          //onCancelBackFun();
        }}
        okText={<FormattedMessage id="Product.Confirm" />}
        cancelText={<FormattedMessage id="Product.Cancel" />}
      >
        {<ProductGrid form={this.props.form} visible={visible} showValidGood={showValidGood} skuLimit={skuLimit} isScroll={false} selectedSkuIds={selectedSkuIds} selectedRows={selectedRows} rowChangeBackFun={this.rowChangeBackFun} searchParams={searchParams} />}
      </Modal>
    );
  }

  rowChangeBackFun = (selectedSkuIds, selectedRows) => {
    this.setState(
      {
        selectedSkuIds: selectedSkuIds,
        selectedRows: selectedRows
      },
      () => {}
    );
  };
}

export default Form.create()(ProductTooltip);
