import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form } from 'antd';
import { Const, noop } from 'qmkit';
import momnet from 'moment';

@Relax
export default class RefundViewModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      viewVisible: boolean;
      onViewHide: Function;
    };
  };

  static relaxProps = {
    viewVisible: 'viewVisible',
    onViewHide: noop
  };

  render() {
    const WrapperForm = Form.create()(RefundViewForm as any);
    const { viewVisible, onViewHide } = this.props.relaxProps;
    if (!viewVisible) {
      return null;
    }

    return (
       <Modal  maskClosable={false}
        title="退单退款记录"
        visible={viewVisible}
        footer={null}
        onCancel={() => onViewHide()}
      >
        <WrapperForm />
      </Modal>
    );
  }
}

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

const FormItem = Form.Item;

const refundOrderStatusDic = {
  0: '待退款',
  1: '拒绝退款',
  2: '已退款',
  3: '待退款'
};

const payTypeDic = {
  0: '在线支付',
  1: '线下支付'
};

@Relax
class RefundViewForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      refundView: any;
    };
  };

  static relaxProps = {
    refundView: 'refundView'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { refundView } = this.props.relaxProps;
    const actualReturnPrice = refundView.get('actualReturnPrice');
    const returnPrice = refundView.get('returnPrice');

    return (
      <Form>
        <FormItem {...formItemLayout} label="退款流水号">
          <label>{refundView.get('refundBillCode')}</label>
        </FormItem>
        <FormItem {...formItemLayout} label="退单时间">
          <label>
            {momnet(refundView.get('createTime'))
              .format(Const.TIME_FORMAT)
              .toString()}
          </label>
        </FormItem>
        <FormItem {...formItemLayout} label="退单编号">
          <label>{refundView.get('returnOrderCode')}</label>
        </FormItem>
        <FormItem {...formItemLayout} label="商家名称">
          <label>{refundView.get('supplierName')}</label>
        </FormItem>
        <FormItem {...formItemLayout} label="客户名称">
          <label>{refundView.get('customerName')}</label>
        </FormItem>
        <FormItem {...formItemLayout} label="退款时间">
          <label>
            {refundView.get('refundBillTime')
              ? momnet(refundView.get('refundBillTime'))
                  .format(refundView.get('payType') == 0 ? Const.TIME_FORMAT : Const.DAY_FORMAT)
                  .toString()
              : '-'}
          </label>
        </FormItem>
        <FormItem {...formItemLayout} label="退款方式">
          <label>{payTypeDic[refundView.get('payType')]}</label>
        </FormItem>
        <FormItem {...formItemLayout} label="应退金额">
          <label>
            {`￥${
              refundView.get('returnPrice')
                ? refundView.get('returnPrice').toFixed(2)
                : (0.0).toFixed(2)
            }`}
          </label>
        </FormItem>
        <FormItem {...formItemLayout} label="应退积分">
          <label>
            {refundView.get('returnPoints')
              ? refundView.get('returnPoints')
              : 0 }
          </label>
        </FormItem>
        <FormItem {...formItemLayout} label="退单改价">
          <label>
            {returnPrice !== actualReturnPrice
              ? actualReturnPrice || actualReturnPrice === 0
                ? `￥${actualReturnPrice.toFixed(2)}`
                : '-'
              : '-'}
          </label>
        </FormItem>
        <FormItem {...formItemLayout} label="退款账户">
          <label>{refundView.get('returnAccountName')}</label>
        </FormItem>
        <FormItem {...formItemLayout} label="客户收款账户">
          <label>{refundView.get('customerAccountName')}</label>
        </FormItem>
        <FormItem {...formItemLayout} label="退款状态">
          <label>{refundOrderStatusDic[refundView.get('refundStatus')]}</label>
        </FormItem>
        <FormItem {...formItemLayout} label="备注">
          <label>{refundView.get('comment')}</label>
        </FormItem>
      </Form>
    );
  }
}
