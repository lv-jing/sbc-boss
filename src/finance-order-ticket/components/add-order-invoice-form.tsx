import React from 'react';
import { Store } from 'plume2';
import PropTypes from 'prop-types';
import { DatePicker, Form, Input, Select } from 'antd';
import { FindArea, QMMethod } from 'qmkit';

const Option = Select.Option;

const FormItem = Form.Item;
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

export default class AddOrderInvoiceForm extends React.Component<any, any> {
  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const store = this._store as any;

    const orderInvoiceDetail = store.state().get('orderInvoiceDetail');
    const orderInvoiceForm = store.state().get('orderInvoiceForm');

    const visible = store.state().get('visible');
    if (!visible) {
      return null;
    }

    //开票项
    const invoiceTime = {};

    const orderInvoiceType = {
      initialValue: orderInvoiceForm.get('orderInvoiceType')
    };

    const orderInvoiceProject = {
      initialValue: orderInvoiceForm.get('orderInvoiceProject')
    };

    const addressInfoId = {
      initialValue: orderInvoiceForm.get('addressInfoId')
    };

    const orderNo = {
      initialValue: orderInvoiceForm.get('orderNo')
    };

    const invoiceTitle = {
      initialValue: orderInvoiceForm.get('invoiceTitle')
    };

    return (
      <Form>
        <FormItem {...formItemLayout} label="订单号">
          {getFieldDecorator('orderNo', {
            ...orderNo,
            rules: [{ required: true, message: '请输入订单号' }]
          })(
            <Input
              onBlur={(e) => store.onSearchByOrderNo(e.currentTarget.value)}
            />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="客户名称">
          <label>{orderInvoiceDetail.get('customerName')}</label>
        </FormItem>
        <FormItem {...formItemLayout} label="订单金额">
          <label>
            {'￥ '}
            {orderInvoiceDetail.get('orderPrice') &&
              orderInvoiceDetail.get('orderPrice').toFixed(2)}
          </label>
        </FormItem>
        <FormItem {...formItemLayout} label="付款状态">
          <label>{orderInvoiceDetail.get('payState')}</label>
        </FormItem>
        <FormItem {...formItemLayout} label="发票类型">
          {getFieldDecorator('invoiceType', {
            ...orderInvoiceType,
            rules: [{ required: true, message: '请选择对应的发票类型' }]
          })(
            this._renderTicketType(orderInvoiceDetail.get('customerInvoiceId'))
          )}
        </FormItem>

        {orderInvoiceForm.get('orderInvoiceType') != '1' ? (
          <FormItem {...formItemLayout} label="发票抬头">
            {getFieldDecorator('invoiceTitle', {
              ...invoiceTitle,
              rules: [
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorMinAndMax(
                      rule,
                      value,
                      callback,
                      '发票抬头',
                      1,
                      50
                    );
                  }
                }
              ]
            })(
              <Input
                placeholder={
                  orderInvoiceForm.get('orderInvoiceType') === '0'
                    ? '个人发票请填写"个人"'
                    : ''
                }
                onBlur={(e) =>
                  store.onChangeOrderInvoiceForm({
                    propertyName: 'invoiceTitle',
                    propertyValue: e.currentTarget.value
                  })
                }
              />
            )}
          </FormItem>
        ) : null}

        {orderInvoiceForm.get('orderInvoiceType') == '1' ? (
          <div>
            <FormItem {...formItemLayout} label="发票抬头">
              <label>{orderInvoiceDetail.get('invoiceTitle')}</label>
            </FormItem>
            <FormItem {...formItemLayout} label="纳税人识别号">
              <label>{orderInvoiceDetail.get('taxpayerNumber')}</label>
            </FormItem>
            <FormItem {...formItemLayout} label="注册地址">
              <label>{orderInvoiceDetail.get('companyAddress')}</label>
            </FormItem>
            <FormItem {...formItemLayout} label="注册电话">
              <label>{orderInvoiceDetail.get('companyPhone')}</label>
            </FormItem>
            <FormItem {...formItemLayout} label="银行基本户号">
              <label>{orderInvoiceDetail.get('bankNo')}</label>
            </FormItem>
            <FormItem {...formItemLayout} label="开户银行">
              <label>{orderInvoiceDetail.get('bankName')}</label>
            </FormItem>
          </div>
        ) : null}
        <FormItem {...formItemLayout} label="开票项目">
          {getFieldDecorator('projectId', {
            ...orderInvoiceProject,
            rules: [{ required: true, message: '请选择开票项目' }]
          })(
            <Select
              onSelect={(v) =>
                store.onChangeOrderInvoiceForm({
                  propertyName: 'orderInvoiceProject',
                  propertyValue: v
                })
              }
            >
              {this._renderInvoiceOptions()}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="发票收件信息">
          {getFieldDecorator('addressInfoId', {
            ...addressInfoId,
            rules: [{ required: true, message: '请选择发票收件信息' }]
          })(
            <Select
              dropdownMatchSelectWidth={false}
              onSelect={(v) =>
                store.onChangeOrderInvoiceForm({
                  propertyName: 'addressInfoId',
                  propertyValue: v
                })
              }
            >
              {this._renderAddessInfos()}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="开票时间">
          {getFieldDecorator('invoiceTime', {
            ...invoiceTime,
            rules: [{ required: true, message: '请选择开票时间' }]
          })(
            <DatePicker
              format={'YYYY-MM-DD'}
              disabledDate={this.disabledDate}
            />
          )}
        </FormItem>
      </Form>
    );
  }

  /**
   * 发票类型
   * @private
   */
  _renderTicketType(customerInvoiceId: number) {
    const store = this._store as any;
    const config = store.state().getIn(['invoiceConfig', 'context', 'status']);

    if (customerInvoiceId != null && config == 1) {
      return (
        <Select
          onSelect={(v) =>
            store.onChangeOrderInvoiceForm({
              propertyName: 'orderInvoiceType',
              propertyValue: v
            })
          }
        >
          <Option value={'0'}>普通发票</Option>
          <Option value={'1'}>增值税发票</Option>
        </Select>
      );
    } else {
      return (
        <Select
          onSelect={(v) =>
            store.onChangeOrderInvoiceForm({
              propertyName: 'orderInvoiceType',
              propertyValue: v
            })
          }
        >
          <Option value={'0'}>普通发票</Option>
        </Select>
      );
    }
  }

  _renderInvoiceOptions() {
    const store = this._store as any;
    let invoiceProjects = store.state().get('invoiceProjects');

    return invoiceProjects.map((project) => {
      return (
        <Option value={project.get('projectId')} key={project.get('projectId')}>
          {project.get('projectName')}
        </Option>
      );
    });
  }

  _renderAddessInfos() {
    const store = this._store as any;
    const addresses = store.state().get('addressInfos');

    return addresses.map((address) => {
      return (
        <Option
          value={address.get('deliveryAddressId')}
          key={address.get('deliveryAddressId')}
        >
          {this._renderText(address)}
        </Option>
      );
    });
  }

  _renderText(address: any) {
    return (
      <span>
        {`${address.get('consigneeName')} ${address.get('consigneeNumber')}
      ${FindArea.addressInfo(
        address.get('provinceId').toString(),
        address.get('cityId') && address.get('cityId').toString(),
        address.get('areaId') && address.get('areaId').toString()
      )}
    `}
        {` ${address.get('deliveryAddress')}`}
      </span>
    );
  }

  fetchDefault() {
    const store = this._store as any;
    const invoiceProjects = store.state().get('invoiceProjects');
    const invoiceProject = invoiceProjects.find(
      (project) => project.get('projectName') == '明细'
    );

    return invoiceProject.get('projectId');
  }

  disabledDate(current) {
    // Can not select days before today and today
    return current && current.valueOf() > Date.now();
  }
}
