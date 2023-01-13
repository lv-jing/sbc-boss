import React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Button, Select, Tree } from 'antd';
import { noop, SelectGroup, TreeSelectGroup } from 'qmkit';
import { IList } from 'typings/globalType';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

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

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      likeGoodsName: string;
      likeSupplierName: string;
      likeGoodsInfoNo: string;
      likeGoodsNo: string;
      cateId: string;
      brandId: string;
      addedFlag: string;
      onSearch: Function;
      onEditSkuNo: Function;
      onFormFieldChange: Function;
      brandList: IList;
      cateList: IList;
      optType: string;
    };
  };

  static relaxProps = {
    // 模糊条件-商品名称
    likeGoodsName: 'likeGoodsName',
    // 模糊条件-商家名称
    likeSupplierName: 'likeSupplierName',
    // 模糊条件-SKU编码
    likeGoodsInfoNo: 'likeGoodsInfoNo',
    // 模糊条件-SPU编码
    likeGoodsNo: 'likeGoodsNo',
    // 商品分类
    cateId: 'cateId',
    // 品牌编号
    brandId: 'brandId',
    // 上下架状态
    addedFlag: 'addedFlag',
    onSearch: noop,
    onFormFieldChange: noop,
    onEditSkuNo: noop,
    //品牌列表
    brandList: 'brandList',
    //分类列表
    cateList: 'cateList',
    optType: 'optType'
  };

  render() {
    const {
      likeGoodsName,
      likeSupplierName,
      likeGoodsInfoNo,
      likeGoodsNo,
      onSearch,
      onFormFieldChange,
      brandList,
      cateList,
      onEditSkuNo,
      optType
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
    const searchVal = optType == '0' ? likeGoodsNo : likeGoodsInfoNo;
    const searchText = optType == '0' ? 'likeGoodsNo' : 'likeGoodsInfoNo';
    return (
      <div>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore="商品名称"
              value={likeGoodsName}
              onChange={(e: any) => {
                onFormFieldChange({
                  key: 'likeGoodsName',
                  value: e.target.value
                });
              }}
            />
          </FormItem>
          <FormItem>
            <Input
              addonBefore="供应商"
              value={likeSupplierName}
              onChange={(e: any) => {
                onFormFieldChange({
                  key: 'likeSupplierName',
                  value: e.target.value
                });
              }}
            />
          </FormItem>
          <FormItem>
            <Input
              addonBefore={this._buildOptions()}
              value={searchVal}
              onChange={(e: any) => {
                onFormFieldChange({
                  key: searchText,
                  value: e.target.value
                });
                if (optType == '1') {
                  onEditSkuNo(e.target.value);
                }
              }}
            />
          </FormItem>
          <FormItem>
            <TreeSelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="类目"
              defaultValue={-1}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeDefaultExpandAll
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
              <Option key="-1" value="-1">
                全部
              </Option>
              <Option key="0" value="0">
                下架
              </Option>
              <Option key="1" value="1">
                上架
              </Option>
              <Option key="2" value="2">
                部分上架
              </Option>
            </SelectGroup>
          </FormItem>
          {/* <FormItem>
            <SelectBox>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="销售类型"
                defaultValue="全部"
                onChange={(value) => {
                  onFormFieldChange({ key: 'saleType', value });
                }}
              >
                <Option value="-1">全部</Option>
                <Option value="0">批发</Option>
                <Option value="1">零售</Option>
              </SelectGroup>
            </SelectBox>
          </FormItem>*/}
          <FormItem>
            <SelectBox>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="商品类型"
                defaultValue="全部"
                showSearch
                onChange={(value) => {
                  onFormFieldChange({ key: 'goodsType', value });
                }}
              >
                <Option value="-1">全部</Option>
                <Option value="0">实物商品</Option>
                <Option value="1">虚拟商品</Option>
              </SelectGroup>
            </SelectBox>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              onClick={() => {
                onSearch();
              }}
              htmlType="submit"
            >
              <FormattedMessage id="Product.Search" />
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }

  /**
   * 构建Option结构
   */
  _buildOptions = () => {
    const { optType, onFormFieldChange } = this.props.relaxProps;
    return (
      <Select
        value={optType}
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => {
          onFormFieldChange({ key: 'optType', value: val });
          onFormFieldChange({ key: 'likeGoodsNo', value: '' });
          onFormFieldChange({ key: 'likeGoodsInfoNo', value: '' });
        }}
      >
        <Option value="0">SPU编码</Option>
        <Option value="1">SKU编码</Option>
      </Select>
    );
  };
}
