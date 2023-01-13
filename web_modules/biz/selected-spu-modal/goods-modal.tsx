import * as React from 'react';
import { fromJS } from 'immutable';

import { Modal, message } from 'antd';

import GoodsGrid from './goods-grid';

export default class GoodsSpuModal extends React.Component<any, any> {

  constructor(props) {
    super(props);
    this.state = {
      selectedSkuIds: props.selectedSkuIds
        ? props.selectedSkuIds
        : [],
      selectedRows: props.selectedRows
        ? props.selectedRows
        : fromJS([])
    };
  }

  componentWillReceiveProps(nextProps) {    
    this.setState({
      selectedRows: nextProps.selectedRows
        ? nextProps.selectedRows
        : fromJS([]),
      selectedSkuIds: nextProps.selectedSkuIds ? nextProps.selectedSkuIds : []
    });
  }

  render() {
    const {
      visible,
      onOkBackFun,
      onCancelBackFun,
      skuLimit,
      showValidGood
    } = this.props;
    const { selectedSkuIds, selectedRows } = this.state;
    return (
       <Modal  maskClosable={false}
        title={
          <div>
            选择商品&nbsp;
            <small>
              已选<span style={{ color: 'red' }}>{selectedSkuIds.length}</span>款商品，每次最多可选{skuLimit}款
            </small>
          </div>
        }
        width={1100}
        visible={visible}
        onOk={() => {
          if (skuLimit && selectedSkuIds.length > skuLimit) {
            message.error(`最多选择${skuLimit}种商品`);
          } else {
            onOkBackFun(this.state.selectedSkuIds, this.state.selectedRows);
          }
        }}
        onCancel={() => {
          onCancelBackFun();
        }}
        okText="确认"
        cancelText="取消"
      >
      <GoodsGrid
        visible={visible}
        showValidGood={showValidGood}
        skuLimit={skuLimit}
        selectedSkuIds={selectedSkuIds}
        selectedRows={selectedRows}
        rowChangeBackFun={this.rowChangeBackFun}
      />
      </Modal>
    );
  }

  rowChangeBackFun = (selectedSkuIds, selectedRows) => {    
    this.setState({
      selectedSkuIds: selectedSkuIds,
      selectedRows: selectedRows
    });
  };
}
