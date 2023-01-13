import React from 'react';
import { Relax } from 'plume2';
import {
  Form,
  Input,
  Button,
  Select,
  Tree,
  message,
  Modal,
  AutoComplete
} from 'antd';
import {
  noop,
  SelectGroup,
  TreeSelectGroup,
  InputGroupCompact,
  AutoCompleteGroup,
  AuthWrapper
} from 'qmkit';
import { IList } from 'typings/globalType';
import styled from 'styled-components';
import { IMap } from '../../../typings/globalType';

const SelectBox = styled.div`
  .ant-select-dropdown-menu-item,
  .ant-select-selection-selected-value {
    max-width: 142px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const FormItem = Form.Item;
const { Option } = Select;
const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm;
const AutoOption = AutoComplete.Option;

/**
 * 商品搜索项
 * @type {{"0": string; "1": string}}
 */
const GOODS_OPTION_TYPE = {
  0: 'likeGoodsName',
  1: 'likeGoodsInfoNo'
};

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      form: any;
      onSearch: Function;
      onFormFieldChange: Function;
      brandList: IList;
      cateList: IList;
      storeMap: IMap;
      selectedSkuKeys: IList;
      onBatchChecked: Function;
      queryStoreByName: Function;
    };
  };

  state = {
    cateTitle: '全部'
  };

  static relaxProps = {
    // 查询条件form
    form: 'form',
    onSearch: noop,
    onFormFieldChange: noop,
    //品牌列表
    brandList: 'brandList',
    //分类列表
    cateList: 'cateList',
    storeMap: 'storeMap',
    selectedSkuKeys: 'selectedSkuKeys',
    queryStoreByName: noop,
    onBatchChecked: noop
  };

  render() {
    const {
      form,
      onSearch,
      onFormFieldChange,
      brandList,
      cateList,
      storeMap
    } = this.props.relaxProps;

    //处理分类的树形图结构数据
    const loop = (cateList) =>
      cateList.map((item) => {
        if (item.get('goodsCateList') && item.get('goodsCateList').count()) {
          return (
            <TreeNode
              key={item.get('cateId')}
              value={item.get('cateId')}
              title={item.get('cateName')}
            >
              {loop(item.get('goodsCateList'))}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={item.get('cateId')}
            value={item.get('cateId')}
            title={item.get('cateName')}
          />
        );
      });

    return (
      <div>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore={this._buildGoodsOptions()}
              value={
                form.get('optGoodsType') == 0
                  ? form.get('likeGoodsName')
                  : form.get('likeGoodsInfoNo')
              }
              onChange={(e: any) => {
                onFormFieldChange({
                  key: GOODS_OPTION_TYPE[form.get('optGoodsType')],
                  value: e.target.value
                });
              }}
            />
          </FormItem>
          <FormItem>
            <AutoCompleteGroup
              size="default"
              label="店铺名称"
              style={{ width: 180 }}
              dataSource={this._renderOption(storeMap.toJS())}
              onSelect={(value) =>
                onFormFieldChange({ key: 'storeId', value: value })
              }
              onChange={(value) => this._handleOnStoreNameChange(value)}
              allowClear={true}
              placeholder=""
            />
          </FormItem>
          <FormItem>
            <TreeSelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="平台类目"
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeDefaultExpandAll
              defaultValue={-1}
              onChange={(value) => {
                onFormFieldChange({ key: 'cateId', value });
              }}
            >
              <TreeNode key="-1" value="-1" title="全部">
                {loop(cateList)}
              </TreeNode>
            </TreeSelectGroup>
          </FormItem>
          <FormItem>
            <SelectBox>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="品牌"
                defaultValue="全部"
                showSearch
                optionFilterProp="children"
                onChange={(value) => {
                  onFormFieldChange({ key: 'brandId', value });
                }}
              >
                <Option key="-1" value="-1">
                  全部
                </Option>
                {brandList.map((v, i) => {
                  return (
                    <Option key={i} value={v.get('brandId') + ''}>
                      {v.get('brandName')}
                    </Option>
                  );
                })}
              </SelectGroup>
            </SelectBox>
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="上下架"
              defaultValue="全部"
              onChange={(value) => {
                onFormFieldChange({ key: 'addedFlag', value });
              }}
            >
              <Option key="" value="">
                全部
              </Option>
              <Option key="0" value="0">
                下架
              </Option>
              <Option key="1" value="1">
                上架
              </Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <InputGroupCompact
              title="市场价"
              precision={2}
              startMin={0}
              start={form.get('salePriceFirst')}
              onStartChange={(val) =>
                onFormFieldChange({ key: 'salePriceFirst', value: val })
              }
              endMin={0}
              end={form.get('salePriceLast')}
              onEndChange={(val) =>
                onFormFieldChange({ key: 'salePriceLast', value: val })
              }
            />
          </FormItem>
          <FormItem>
            <InputGroupCompact
              title="佣金比例"
              startMin={0}
              startMax={99}
              start={form.get('commissionRateFirst')}
              onStartChange={(val) =>
                onFormFieldChange({
                  key: 'commissionRateFirst',
                  value: val
                })
              }
              endMin={0}
              endMax={99}
              end={form.get('commissionRateLast')}
              onEndChange={(val) =>
                onFormFieldChange({
                  key: 'commissionRateLast',
                  value: val
                })
              }
            />
          </FormItem>
          <FormItem>
            <InputGroupCompact
              title="预估佣金"
              precision={2}
              startMin={0}
              start={form.get('distributionCommissionFirst')}
              onStartChange={(val) =>
                onFormFieldChange({
                  key: 'distributionCommissionFirst',
                  value: val
                })
              }
              endMin={0}
              end={form.get('distributionCommissionLast')}
              onEndChange={(val) =>
                onFormFieldChange({
                  key: 'distributionCommissionLast',
                  value: val
                })
              }
            />
          </FormItem>
          <FormItem>
            {/*<InputGroupCompact
              title="分销销量"
              startMin={0}
              start={form.get('distributionSalesCountFirst')}
              onStartChange={(val) =>
                onFormFieldChange({
                  key: 'distributionSalesCountFirst',
                  value: val
                })
              }
              endMin={0}
              end={form.get('distributionSalesCountLast')}
              onEndChange={(val) =>
                onFormFieldChange({
                  key: 'distributionSalesCountLast',
                  value: val
                })
              }
            />*/}
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                onSearch();
              }}
            >
              搜索
            </Button>
          </FormItem>
        </Form>
        <AuthWrapper functionName={'f_distribution_goods_audit'}>
          <div className="handle-bar">
            <Button type="primary" onClick={this._onBatchChecked}>
              批量审核
            </Button>
          </div>
        </AuthWrapper>
      </div>
    );
  }

  /**
   * autoComplete中选项
   * @param item
   * @returns {any}
   */
  _renderOption = (storeMap) => {
    let optionArray = [];
    for (let store in storeMap) {
      optionArray.push(<AutoOption key={store}>{storeMap[store]}</AutoOption>);
    }
    return optionArray;
  };

  /**
   * 根据商铺名称模糊查询
   * @param value
   * @private
   */
  _handleOnStoreNameChange = (value) => {
    const { queryStoreByName, onFormFieldChange } = this.props.relaxProps;
    if (value) {
      queryStoreByName(value);
    } else {
      onFormFieldChange({ key: 'storeId', value: null });
      onFormFieldChange({ key: 'storeName', value: null });
    }
  };

  /**
   * 批量审核通过所选分销商品
   * @private
   */
  _onBatchChecked = () => {
    const { selectedSkuKeys, onBatchChecked } = this.props.relaxProps;
    if (selectedSkuKeys.count() < 1) {
      message.error('请先选择分销商品');
      return;
    }
    confirm({
      title: '提示',
      content: '是否确定批量审核通过所选分销商品？',
      onOk() {
        onBatchChecked(selectedSkuKeys);
      }
    });
  };

  /**
   * 构建商品Option结构
   */
  _buildGoodsOptions = () => {
    const { form, onFormFieldChange } = this.props.relaxProps;
    return (
      <Select
        value={form.get('optGoodsType')}
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => {
          onFormFieldChange({ key: 'optGoodsType', value: val });
        }}
      >
        <Option value="0">商品名称</Option>
        <Option value="1">SKU编码</Option>
      </Select>
    );
  };
}
