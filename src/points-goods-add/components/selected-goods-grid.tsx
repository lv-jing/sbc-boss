import * as React from 'react';
import { DataGrid, ValidConst } from 'qmkit';
import styled from 'styled-components';
import { Relax } from 'plume2';
import { IList, IMap } from '../../../typings/globalType';
import noop from '../../../web_modules/qmkit/noop';
import { Button, Form, Input } from 'antd';
import Table from 'antd/es/table/Table';
import Select from 'antd/lib/select';

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

const { Column } = DataGrid;

const FormItem = Form.Item;

const Option = Select.Option;

/**
 * 商品添加
 */
@Relax
export default class SelectedGoodsGrid extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      goodsRows: IList;
      cateList: IMap;
      deleteSelectedSku: Function;
      fieldsValue: Function;
      onGoodsChange: Function;
      onCateInputChange: Function;
    };
  };

  static relaxProps = {
    goodsRows: 'goodsRows',
    cateList: 'cateList',
    deleteSelectedSku: noop,
    fieldsValue: noop,
    onGoodsChange: noop,
    onCateInputChange: noop
  };

  render() {
    const {
      goodsRows,
      onGoodsChange,
      onCateInputChange
    } = this.props.relaxProps;

    const { getFieldDecorator } = this.props.form;

    return (
      <TableSet className="resetTable">
        <Button type="primary" icon="plus" onClick={() => this.onAdd()}>
          添加商品
        </Button>&nbsp;&nbsp;
        <Table
          rowKey={(record: any) => record.goodsInfoId}
          dataSource={goodsRows ? goodsRows.toJS() : []}
          pagination={false}
          style={{ width: '100%' }}
        >
          <Column
            title="商品名称"
            dataIndex="goodsInfoName"
            key="goodsInfoName"
            width={100}
          />

          <Column
            title="SKU编码"
            dataIndex="goodsInfoNo"
            key="goodsInfoNo"
            width={100}
          />

          <Column
            title="店铺名称"
            dataIndex="storeName"
            key="storeName"
            width={100}
          />

          <Column title="现有库存" dataIndex="stock" key="stock" width={80} />

          <Column
            title="市场价"
            key="marketPrice"
            dataIndex="marketPrice"
            width={100}
            render={(data) => {
              return `¥${data == null ? 0 : data}`;
            }}
          />

          <Column
            title="结算价"
            width={80}
            key="settlementPrice"
            render={(_text, record: any) => {
              return (
                <div>
                  <FormItem>
                    {getFieldDecorator(
                      record.goodsInfoId + '_settlementPrice',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请填写结算价'
                          },
                          {
                            pattern: ValidConst.zeroPrice,
                            message: '请填写两位小数的合法金额'
                          },
                          {
                            type: 'number',
                            max: 9999999.99,
                            message: '最大值为9999999.99',
                            transform: function(value) {
                              return isNaN(parseFloat(value))
                                ? 0
                                : parseFloat(value);
                            }
                          }
                        ],
                        initialValue: null
                      }
                    )(
                      <Input
                        onChange={(e) =>
                          onGoodsChange({
                            goodsInfoId: record.goodsInfoId,
                            field: 'settlementPrice',
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
            title="分类"
            width={120}
            key="cateName"
            render={(_text, record: any) => {
              return (
                <div>
                  <FormItem>
                    {getFieldDecorator(record.goodsInfoId + '_cateName', {
                      initialValue: null,
                      rules: [{ required: true, message: '请选择分类' }]
                    })(
                      <Select
                        showSearch
                        style={{ width: 120 }}
                        placeholder="选择分类名称"
                        optionFilterProp="children"
                        onChange={(value) =>
                          onCateInputChange({
                            goodsInfoId: record.goodsInfoId,
                            field: 'cateId',
                            value: value
                          })
                        }
                      >
                        {this._renderOption()}
                      </Select>
                    )}
                  </FormItem>
                </div>
              );
            }}
          />

          <Column
            title="兑换数量"
            width={80}
            key="convertStock"
            render={(_text, record: any) => {
              return (
                <div>
                  <FormItem>
                    {getFieldDecorator(record.goodsInfoId + '_convertStock', {
                      initialValue: null,
                      rules: [
                        { required: true, message: '请填写兑换数量' },
                        {
                          pattern: ValidConst.noZeroNineNumber,
                          message: '请输入1-999999999的整数'
                        },
                        {
                          validator: (_rule, value, callback) => {
                            let stock = record.stock;
                            if (stock < value) {
                              callback('兑换数量不可大于剩余库存');
                              return;
                            }
                            callback();
                          }
                        }
                      ]
                    })(
                      <Input
                        onChange={(e) =>
                          onGoodsChange({
                            goodsInfoId: record.goodsInfoId,
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
                    {getFieldDecorator(record.goodsInfoId + '_convertPoints', {
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
                          onGoodsChange({
                            goodsInfoId: record.goodsInfoId,
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
            title="是否推荐"
            key="isRecommend"
            width={80}
            render={(_text, record: any) => {
              return (
                <div>
                  <FormItem>
                    <Select
                      getPopupContainer={() =>
                        document.getElementById('page-content')
                      }
                      defaultValue="否"
                      onChange={(value) => {
                        onGoodsChange({
                          goodsInfoId: record.goodsInfoId,
                          field: 'recommendFlag',
                          value: value
                        });
                      }}
                    >
                      <Option value="0">否</Option>
                      <Option value="1">是</Option>
                    </Select>
                  </FormItem>
                </div>
              );
            }}
          />

          <Column
            title="操作"
            key="operate"
            width={60}
            render={(row) => {
              return (
                <a onClick={() => this._deleteSelectedSku(row.goodsInfoId)}>
                  删除
                </a>
              );
            }}
          />
        </Table>
      </TableSet>
    );
  }

  _deleteSelectedSku(goodsInfoId) {
    this.props.form.resetFields([
      goodsInfoId + '_settlementPrice',
      goodsInfoId + '_cateName',
      goodsInfoId + '_convertStock',
      goodsInfoId + '_convertPoints'
    ]);
    this.props.relaxProps.deleteSelectedSku(goodsInfoId);
  }

  /**
   *下拉栏里内容填充
   * @private
   */
  _renderOption = () => {
    const { cateList } = this.props.relaxProps;
    return cateList.map((v) => {
      return (
        <Option value={v.get('cateName')} key={v.get('cateId')}>
          {v.get('cateName')}
        </Option>
      );
    });
  };

  onAdd() {
    const { fieldsValue } = this.props.relaxProps;
    fieldsValue({ field: 'goodsModalVisible', value: true });
  }
}
