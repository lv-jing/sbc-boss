import React from 'react';
import { Form, InputNumber, Switch, Radio } from 'antd';
import styled from 'styled-components';
import { Relax } from 'plume2';

import { noop } from 'qmkit';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 20 }
  }
};

const ItemBox = styled.div`
  display: flex;
  flex-direciton: row;
  align-items: center;
  justify-content: flex-start;
  height: 39px;
  > div {
    margin-left: 30px;
  }
`;
@Relax
export default class SettingForm extends React.Component<any, any> {
  static relaxProps = {
    configs: 'configs',
    editStatusByConigType: noop,
    editDaysByConfigType: noop
  };

  render() {
    const {
      configs,
      editStatusByConigType,
      editDaysByConfigType
    } = this.props.relaxProps;

    const order_setting_payment_order_status = configs
      .toSeq()
      .filter(
        (config) => config.get('configType') == 'order_setting_payment_order'
      )
      .some((val) => val.get('status') == 1);
    const order_setting_timeout_cancel_status = configs
      .toSeq()
      .filter(
        (config) => config.get('configType') == 'order_setting_timeout_cancel'
      )
      .some((val) => val.get('status') == 1);
    const order_setting_auto_receive_status = configs
      .toSeq()
      .filter(
        (config) => config.get('configType') == 'order_setting_auto_receive'
      )
      .some((val) => val.get('status') == 1);
    const order_setting_apply_refund_status = configs
      .toSeq()
      .filter(
        (config) => config.get('configType') == 'order_setting_apply_refund'
      )
      .some((val) => val.get('status') == 1);
    const order_setting_refund_auto_audit_status = configs
      .toSeq()
      .filter(
        (config) =>
          config.get('configType') == 'order_setting_refund_auto_audit'
      )
      .some((val) => val.get('status') == 1);
    const order_setting_refund_auto_receive_status = configs
      .toSeq()
      .filter(
        (config) =>
          config.get('configType') == 'order_setting_refund_auto_receive'
      )
      .some((val) => val.get('status') == 1);

    return (
      <div style={{ margin: '30px 0 40px 0' }}>
        <Form>
          <FormItem label="订单支付顺序" {...formItemLayout}>
            <RadioGroup
              onChange={(val) =>
                editStatusByConigType(
                  'order_setting_payment_order',
                  val.target.value
                )
              }
              value={order_setting_payment_order_status ? 1 : 0}
            >
              <Radio value={1}>先款后货</Radio>
              <Radio value={0}>不限</Radio>
            </RadioGroup>
            <p style={{ color: '#999' }}>
              选择“先款后货”，客户必须支付订单后商家才可发货，选择“不限”，无论客户是否支付都可发货
            </p>
          </FormItem>
          <FormItem label="订单失效时间" {...formItemLayout}>
            <ItemBox>
              <Switch
                checkedChildren="开"
                unCheckedChildren="关"
                checked={
                  order_setting_payment_order_status
                    ? order_setting_timeout_cancel_status
                    : false
                }
                onChange={(val) =>
                  editStatusByConigType('order_setting_timeout_cancel', val)
                }
                disabled={!order_setting_payment_order_status}
              />
              {order_setting_payment_order_status &&
                order_setting_timeout_cancel_status && (
                  <InputNumber
                    max={9999}
                    min={1}
                    precision={0}
                    value={this._parseHour(
                      configs
                        .toSeq()
                        .filter(
                          (config) =>
                            config.get('configType') ==
                            'order_setting_timeout_cancel'
                        )
                        .getIn([0, 'context'])
                    )}
                    onChange={(val) =>
                      editDaysByConfigType(
                        'order_setting_timeout_cancel',
                        'hour',
                        val
                      )
                    }
                    disabled={!order_setting_payment_order_status}
                  />
                )}
              {order_setting_payment_order_status &&
                order_setting_timeout_cancel_status &&
                <span className="order-setting-span">小时后，客户逾期未支付，将会自动作废订单。</span>}
            </ItemBox>
          </FormItem>
          <FormItem label="订单自动确认收货" {...formItemLayout}>
            <ItemBox>
              <Switch
                checkedChildren="开"
                unCheckedChildren="关"
                checked={order_setting_auto_receive_status}
                onChange={(val) =>
                  editStatusByConigType('order_setting_auto_receive', val)
                }
              />
              {order_setting_auto_receive_status && (
                <InputNumber
                  max={9999}
                  min={1}
                  precision={0}
                  value={this._parseDay(
                    configs
                      .toSeq()
                      .filter(
                        (config) =>
                          config.get('configType') ==
                          'order_setting_auto_receive'
                      )
                      .getIn([0, 'context'])
                  )}
                  onChange={(val) =>
                    editDaysByConfigType(
                      'order_setting_auto_receive',
                      'day',
                      val
                    )
                  }
                />
              )}
              {order_setting_auto_receive_status &&
                <span className="order-setting-span">天后,客户逾期未处理的待收货订单，将会自动确认收货。</span>}
            </ItemBox>
          </FormItem>
          <FormItem label="已完成订单允许申请退单" {...formItemLayout}>
            <ItemBox>
              <Switch
                checkedChildren="开"
                unCheckedChildren="关"
                checked={order_setting_apply_refund_status}
                onChange={(val) =>
                  editStatusByConigType('order_setting_apply_refund', val)
                }
              />
              {order_setting_apply_refund_status && (
                <InputNumber
                  max={9999}
                  min={1}
                  precision={0}
                  value={this._parseDay(
                    configs
                      .toSeq()
                      .filter(
                        (config) =>
                          config.get('configType') ==
                          'order_setting_apply_refund'
                      )
                      .getIn([0, 'context'])
                  )}
                  onChange={(val) =>
                    editDaysByConfigType(
                      'order_setting_apply_refund',
                      'day',
                      val
                    )
                  }
                />
              )}
              {order_setting_apply_refund_status &&
                <span className="order-setting-span">天内,允许客户发起退货退款申请，未发货订单随时可退。</span>}
            </ItemBox>
          </FormItem>
          <FormItem label="待审核退单自动审核" {...formItemLayout}>
            <ItemBox>
              <Switch
                checkedChildren="开"
                unCheckedChildren="关"
                checked={order_setting_refund_auto_audit_status}
                onChange={(val) =>
                  editStatusByConigType('order_setting_refund_auto_audit', val)
                }
              />
              {order_setting_refund_auto_audit_status && (
                <InputNumber
                  max={9999}
                  min={1}
                  precision={0}
                  value={this._parseDay(
                    configs
                      .toSeq()
                      .filter(
                        (config) =>
                          config.get('configType') ==
                          'order_setting_refund_auto_audit'
                      )
                      .getIn([0, 'context'])
                  )}
                  onChange={(val) =>
                    editDaysByConfigType(
                      'order_setting_refund_auto_audit',
                      'day',
                      val
                    )
                  }
                />
              )}
              {order_setting_refund_auto_audit_status &&
                <span className="order-setting-span">天后,商家逾期未处理的待审核退单，将会自动审核通过。</span>
              }
            </ItemBox>
          </FormItem>
          <FormItem label="退单自动确认收货" {...formItemLayout}>
            <ItemBox>
              <Switch
                checkedChildren="开"
                unCheckedChildren="关"
                checked={order_setting_refund_auto_receive_status}
                onChange={(val) =>
                  editStatusByConigType(
                    'order_setting_refund_auto_receive',
                    val
                  )
                }
              />
              {order_setting_refund_auto_receive_status && (
                <InputNumber
                  max={9999}
                  min={1}
                  value={this._parseDay(
                    configs
                      .toSeq()
                      .filter(
                        (config) =>
                          config.get('configType') ==
                          'order_setting_refund_auto_receive'
                      )
                      .getIn([0, 'context'])
                  )}
                  onChange={(val) =>
                    editDaysByConfigType(
                      'order_setting_refund_auto_receive',
                      'day',
                      val
                    )
                  }
                />
              )}
              {order_setting_refund_auto_receive_status &&
                <span className="order-setting-span"> 天后,商家逾期未处理的待收货退单，将会自动确认收货，非快递退回的退单，在审核通过后开始计时。</span>}
            </ItemBox>
          </FormItem>
        </Form>
      </div>
    );
  }

  /**
   * 解析天数据
   * @param context
   */
  _parseDay(context: string) {
    try {
      if (context) return JSON.parse(context).day;
    } catch (e) {
      if (e instanceof Error) {
        console.error('解析天数据错误');
      }
    }
  }

  /**
   * 解析小时数据
   * @param context
   */
  _parseHour(context: string) {
    try {
      if (context) return JSON.parse(context).hour;
    } catch (e) {
      if (e instanceof Error) {
        console.error('解析小时数据错误');
      }
    }
  }
}
