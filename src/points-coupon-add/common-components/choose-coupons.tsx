import * as React from 'react';
import { Button, Form, Input } from 'antd';
import { AuthWrapper, DataGrid, ValidConst } from 'qmkit';
import CouponsModal from './coupons-modal';

import styled from 'styled-components';
import Table from 'antd/es/table/Table';
import { Relax } from 'plume2';

const { Column } = DataGrid;
const FormItem = Form.Item;

const TableSet = styled.div`
  @media screen and (max-width: 1440px) {
    .ant-select {
      max-width: 220px;
    }
  }
  @media screen and (min-width: 1440px) and (max-width: 1680px) {
    .ant-select {
      max-width: 320px;
    }
  }
  @media screen and (min-width: 1680px) {
    .ant-select {
      max-width: 400px;
    }
  }
`;

/**
 * 选择优惠券组件
 */
@Relax
export default class ChooseCoupons extends React.Component<any, any> {
  props: {
    coupons: any; // 选择的优惠券
    invalidCoupons?: any; // 失效的优惠券
    form?: any; // 组件所在表单
    onChosenCoupons?: Function; // 选择优惠券回调
    onDelCoupon?: Function; // 删除优惠券回调
    onCouponChange?: Function;
  };

  constructor(props) {
    super(props);
    this.state = {
      // 弹出框可见性
      modalVisible: false
    };
  }

  render() {
    const { coupons, invalidCoupons, form, onCouponChange } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div>
        <TableSet className="resetTable">
          <Button
            type="primary"
            icon="plus"
            onClick={() => this.changeModalVisible(true)}
          >
            选择优惠券
          </Button>
          &nbsp;&nbsp;
          <Table
            style={{ width: '100%' }}
            rowKey={(record: any) => record.couponId}
            dataSource={coupons}
            pagination={false}
            rowClassName={(record: any) => {
              if (invalidCoupons.includes(record.couponId)) {
                return 'red';
              }
              return '';
            }}
          >
            <Column
              title="优惠券名称"
              dataIndex="couponName"
              key="couponName"
              width="18%"
            />

            <Column
              title="优惠券面值（元）"
              dataIndex="denominationStr"
              key="denominationStr"
              width="18%"
            />

            <Column
              title="券有效期"
              dataIndex="validity"
              key="validity"
              width="20%"
            />

            <Column
              title="兑换数量"
              width={80}
              key="convertStock"
              render={(_text, record: any) => {
                return (
                  <div>
                    <FormItem>
                      {getFieldDecorator(record.couponId + '_convertStock', {
                        initialValue: null,
                        rules: [
                          { required: true, message: '请填写兑换数量' },
                          {
                            pattern: ValidConst.noZeroNineNumber,
                            message: '请输入1-999999999的整数'
                          }
                        ]
                      })(
                        <Input
                          onChange={(e) =>
                            onCouponChange({
                              couponId: record.couponId,
                              field: 'convertStock',
                              value: (e.target as any).value
                            })
                          }
                          style={{ width: '80px' }}
                        />
                      )}
                    </FormItem>
                  </div>
                );
              }}
            />

            <Column
              title="兑换积分"
              width={80}
              key="convertPoints"
              render={(_text, record: any) => {
                return (
                  <div>
                    <FormItem>
                      {getFieldDecorator(record.couponId + '_convertPoints', {
                        initialValue: null,
                        rules: [
                          { required: true, message: '请填写兑换积分' },
                          {
                            pattern: ValidConst.noZeroNineNumber,
                            message: '请输入1-999999999的整数'
                          }
                        ]
                      })(
                        <Input
                          onChange={(e) =>
                            onCouponChange({
                              couponId: record.couponId,
                              field: 'convertPoints',
                              value: (e.target as any).value
                            })
                          }
                          style={{ width: '80px' }}
                        />
                      )}
                    </FormItem>
                  </div>
                );
              }}
            />

            <Column
              title="操作"
              key="operate"
              width="10%"
              render={(row) => {
                return (
                  <div>
                    <AuthWrapper functionName={'f_coupon_detail'}>
                      <a
                        style={{ textDecoration: 'none' }}
                        href={`/coupon-detail/${row.couponId}`}
                        target="_blank"
                      >
                        详情
                      </a>
                    </AuthWrapper>
                    &nbsp;&nbsp;
                    <a onClick={() => this._deleteSelectedSku(row.couponId)}>
                      删除
                    </a>
                  </div>
                );
              }}
            />
          </Table>
        </TableSet>
        {this.state.modalVisible && (
          <CouponsModal
            selectedRows={coupons}
            onOk={(coupons) => {
              this.changeModalVisible(false);
              this.props.onChosenCoupons(coupons);
            }}
            onCancel={() => this.changeModalVisible(false)}
          />
        )}
      </div>
    );
  }

  _deleteSelectedSku(couponId) {
    this.props.form.resetFields([
      couponId + '_convertStock',
      couponId + '_convertPoints',
      'coupons'
    ]);
    this.props.onDelCoupon(couponId);
  }

  /**
   * 设置优惠券弹窗可见性
   */
  changeModalVisible = (flag) => {
    this.setState({
      modalVisible: flag
    });
    this.props.form.resetFields(['coupons']);
  };
}
