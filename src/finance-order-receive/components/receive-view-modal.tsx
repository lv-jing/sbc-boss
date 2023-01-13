import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form, Popover } from 'antd';
import { Const, noop } from 'qmkit';
import momnet from 'moment';

const payOrderStatusDic = {
  0: '已付款',
  1: '未付款',
  2: '待确认'
};

const payTypeDic = {
  0: '线上支付',
  1: '线下支付'
};

@Relax
export default class ReceiveViewModal extends React.Component<any, any> {
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
    const WrapperForm = Form.create()(ReceiveViewForm as any);
    const { viewVisible, onViewHide } = this.props.relaxProps;
    if (!viewVisible) {
      return null;
    }

    return (
       <Modal  maskClosable={false}
        title="订单收款记录"
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

@Relax
class ReceiveViewForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      receiveView: any;
    };
  };

  static relaxProps = {
    receiveView: 'receiveView'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { receiveView } = this.props.relaxProps;

    return (
      <Form>
        <FormItem {...formItemLayout} label="收款流水号">
          <label>{receiveView.get('receivableNo')}</label>
        </FormItem>
        <FormItem {...formItemLayout} label="下单时间">
          <label>
            {momnet(receiveView.get('createTime'))
              .format(Const.TIME_FORMAT)
              .toString()}
          </label>
        </FormItem>
        <FormItem {...formItemLayout} label="订单编号">
          <label>{receiveView.get('orderCode')}</label>
        </FormItem>
        <FormItem {...formItemLayout} label="支付时间">
          <label>
            {receiveView.get('receiveTime')
              ? momnet(receiveView.get('receiveTime'))
                  .format(Const.TIME_FORMAT)
                  .toString()
              : '-'}{' '}
          </label>
        </FormItem>
        <FormItem {...formItemLayout} label="商家名称">
          <label>{receiveView.get('supplierName')}</label>
        </FormItem>
        <FormItem {...formItemLayout} label="客户名称">
          <label>{receiveView.get('customerName')}</label>
        </FormItem>
        <FormItem {...formItemLayout} label="支付方式">
          <label>
            {receiveView.get('payOrderPrice') == null && receiveView.get('payOrderPoints') != null
              ? '积分兑换'
              : payTypeDic[receiveView.get('payType')]}
          </label>
        </FormItem>
        <FormItem {...formItemLayout} label="应收金额">
          <label>
            {receiveView.get('payOrderPoints') != null && receiveView.get('payOrderPoints') + '积分  '}
            {receiveView.get('payOrderPrice') != null && `￥${receiveView.get('payOrderPrice')
                ? receiveView.get('payOrderPrice').toFixed(2)
                : (0.0).toFixed(2)}`}
          </label>
        </FormItem>
        <FormItem {...formItemLayout} label="收款账户">
          <label>{receiveView.get('receivableAccount')}</label>
        </FormItem>
        <FormItem {...formItemLayout} label="付款状态">
          <label>{payOrderStatusDic[receiveView.get('payOrderStatus')]}</label>
        </FormItem>
        <FormItem {...formItemLayout} label="附件">
          <label>
            {receiveView.get('encloses') ? (
              <Popover
                key={'encloses'}
                placement="topRight"
                title={''}
                trigger="click"
                content={
                  <img
                    style={styles.attachmentView}
                    src={receiveView.get('encloses')}
                  />
                }
              >
                <a href="javascript:;">
                  <img
                    style={styles.attachment}
                    src={receiveView.get('encloses')}
                  />
                </a>
              </Popover>
            ) : (
              '-'
            )}
          </label>
        </FormItem>
        <FormItem {...formItemLayout} label="备注">
          <label>{receiveView.get('comment')}</label>
        </FormItem>
      </Form>
    );
  }
}

const styles = {
  attachment: {
    width: 30,
    height: 30
  },
  attachmentView: {
    width: 400,
    height: 400
  }
} as any;
