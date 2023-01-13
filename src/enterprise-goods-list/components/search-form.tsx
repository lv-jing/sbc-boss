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
import { noop, SelectGroup, TreeSelectGroup, AutoCompleteGroup } from 'qmkit';
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
              addonBefore={'商品名称'}
              value={form.get('likeGoodsName')}
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
              addonBefore={'SKU编码'}
              value={form.get('likeGoodsInfoNo')}
              onChange={(e: any) => {
                onFormFieldChange({
                  key: 'likeGoodsInfoNo',
                  value: e.target.value
                });
              }}
            />
          </FormItem>
          <FormItem>
            <AutoCompleteGroup
              size="default"
              label="商家名称"
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
        {/*<AuthWrapper functionName={'f_enterprise_goods_audit'}>*/}
        {/*<div className="handle-bar">*/}
        {/*<Button type="primary" onClick={this._onBatchChecked}>*/}
        {/*批量审核*/}
        {/*</Button>*/}
        {/*</div>*/}
        {/*</AuthWrapper>*/}
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
   * 批量审核通过所选企业购商品
   * @private
   */
  _onBatchChecked = () => {
    const { selectedSkuKeys, onBatchChecked } = this.props.relaxProps;
    if (selectedSkuKeys.count() < 1) {
      message.warning('请先选择企业购商品');
      return;
    }
    confirm({
      title: '提示',
      content: '是否确定批量审核通过所选企业购商品？',
      onOk() {
        onBatchChecked(selectedSkuKeys);
      }
    });
  };
}
