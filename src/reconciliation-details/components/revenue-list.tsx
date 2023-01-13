import React from 'react';
import { Select, Form, Icon } from 'antd';
import { DataGrid, SelectGroup } from 'qmkit';
const { Option } = Select;
const FormItem = Form.Item;

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index'
  },
  {
    title: '下单时间',
    dataIndex: 'time',
    key: 'time',
    width: 95
  },
  {
    title: '订单编号',
    dataIndex: 'orderNum',
    key: 'orderNum'
  },
  {
    title: '客户昵称',
    dataIndex: 'customName',
    key: 'customName'
  },
  {
    title: '支付时间',
    dataIndex: 'payTime',
    key: 'payTime'
  },
  {
    title: '支付方式',
    dataIndex: 'payWay',
    key: 'payWay'
  },
  {
    title: '优惠金额',
    dataIndex: 'coupons',
    key: 'coupons'
  },
  {
    title: '支付金额',
    dataIndex: 'payMoney',
    key: 'payMoney'
  }
];

const data = [
  {
    key: 1,
    index: '1',
    time: '2017-03-01至2017-03-01',
    orderNum: 'Q2323235145',
    shopname: '提莫的蘑菇小店',
    customName: '提莫蘑菇',
    payTime: '2017-01-01 17:00',
    payWay: '现金',
    coupons: '100.00',
    payMoney: '1009900.00',
    account: (
      <div>
        张三（2362323）<p>（62270099000999000）</p>
      </div>
    )
  },
  {
    key: 2,
    index: '2',
    time: '2017-03-01至2017-03-01',
    orderNum: 'Q2323235145',
    shopname: '提莫的蘑菇小店',
    customName: '提莫蘑菇',
    payTime: '2017-01-01 17:00',
    payWay: '现金',
    coupons: '100.00',
    payMoney: '1009900.00',
    account: <div>张三（2362323)</div>
  }
];

export default class RevenueList extends React.Component<any, any> {
  render() {
    return (
      <div>
        <div style={styles.head}>
          <Form className="filter-content" layout="inline">
            <FormItem>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="支付方式"
                defaultValue="全部"
              >
                <Option key="1" value="部分">
                  部分
                </Option>
              </SelectGroup>
            </FormItem>
          </Form>
          <div>
            <Icon type="shop" style={styles.shopIcon} />
            提莫的蘑菇小店
          </div>
        </div>

        <DataGrid columns={columns} dataSource={data} />
      </div>
    );
  }
}

const styles = {
  head: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  } as any,
  shopIcon: {
    color: '#3d85cc',
    fontSize: 16,
    marginRight: 5
  }
};
