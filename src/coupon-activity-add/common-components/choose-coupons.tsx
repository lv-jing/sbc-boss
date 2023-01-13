import * as React from 'react';
import { Button, InputNumber, Form } from 'antd';
import { AuthWrapper, DataGrid, ValidConst } from 'qmkit';
const { Column } = DataGrid;
const FormItem = Form.Item;

import CouponsModal from './coupons-modal';

import styled from 'styled-components';
const TableRow = styled.div`
  margin-top: 20px;
  .red {
    background-color: #eee;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
`;

/**
 * 选择优惠券组件
 */
export default class ChooseCoupons extends React.Component<any, any> {
  props: {
    coupons: any; // 选择的优惠券
    invalidCoupons?: any; // 失效的优惠券
    form?: any; // 组件所在表单
    type?: number; // 类型
    onChosenCoupons?: Function; // 选择优惠券回调
    onDelCoupon?: Function; // 删除优惠券回调
    onChangeCouponTotalCount?: Function; // 改变优惠券数量回调
    desc?: String; // 描述信息
    mode?: number;
    disable?: boolean;
  };

  constructor(props) {
    super(props);
    this.state = {
      // 弹出框可见性
      modalVisible: false
    };
  }

  render() {
    const { coupons, invalidCoupons, form, type, desc } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div>
        <Button
          type="primary"
          icon="plus"
          onClick={() => this.changeModalVisible(true)}
          style={this.props.mode === 1 ? { marginLeft: '100px' } : {}}
          disabled={this.props.disable}
        >
          选择优惠券
        </Button>
        &nbsp;&nbsp;
        <span style={{ color: '#999', fontSize: 12 }}>
          {desc
            ? desc
            : '最多可选10张' + (type == 3 ? '，选择多张时成组发放' : '')}
        </span>
        <TableRow>
          <DataGrid
            scroll={{ y: 500 }}
            size="small"
            rowKey={(record) => record.couponId}
            dataSource={coupons}
            pagination={false}
            rowClassName={(record) => {
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
              width="15%"
            />

            <Column
              title="优惠券面值（元）"
              dataIndex="denominationStr"
              key="denominationStr"
              width="15%"
            />

            <Column
              title="有效期"
              dataIndex="validity"
              key="validity"
              width="30%"
              render={(value) => {
                if (value) {
                  return value;
                } else {
                  return '-';
                }
              }}
            />

            <Column
              title={
                <div style={{ minWidth: 140 }}>
                  <p>
                    <span style={{ color: 'red' }}>*</span>
                    {type == 0 ? '总张数' : '每组赠送张数'}
                  </p>
                  <p style={{ color: '#999' }}>
                    {type == 0 ? '（1-999999999张）' : '(1-10张)'}
                  </p>
                </div>
              }
              key="totalCount"
              dataIndex="totalCount"
              width="20%"
              render={(value, rowData, index) => {
                const message =
                  type == 0 ? '请输入1-999999999的整数' : '请输入1-10的整数';
                return (
                  <FormItem>
                    {getFieldDecorator(
                      'couponId_' + (rowData as any).couponId,
                      {
                        rules: [
                          {
                            pattern: ValidConst.noZeroNineNumber,
                            message: message
                          },
                          {
                            validator: (_rule, value, callback) => {
                              if (!value) {
                                callback('请填写赠送张数');
                                return;
                              }
                              if (type != 0 && value > 10) {
                                callback('请输入1-10的整数');
                                return;
                              }
                              callback();
                            }
                          }
                        ],
                        onChange: (val) => {
                          this.props.onChangeCouponTotalCount(index, val);
                        },
                        initialValue: value
                      }
                    )(
                      <InputNumber
                        disabled={this.props.disable}
                        min={1}
                        max={999999999}
                      />
                    )}
                  </FormItem>
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
                    {!this.props.disable && (
                      <a onClick={() => this.props.onDelCoupon(row.couponId)}>
                        删除
                      </a>
                    )}
                  </div>
                );
              }}
            />
          </DataGrid>
        </TableRow>
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

  /**
   * 设置优惠券弹窗可见性
   */
  changeModalVisible = (flag) => {
    this.setState({
      modalVisible: flag
    });
  };
}
