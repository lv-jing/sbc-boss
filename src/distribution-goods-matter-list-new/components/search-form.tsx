import React from 'react';
import { Relax } from 'plume2';
import { List } from 'immutable';
import { AutoComplete, Button, Form, Select, Input, Tree } from 'antd';
import { InputGroupCompact, noop, TreeSelectGroup, SelectGroup } from 'qmkit';
import styled from 'styled-components';
import { IList } from 'typings/globalType';
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
const TreeNode = Tree.TreeNode;
const { Option } = Select;
const AutoOption = AutoComplete.Option;

/**
 * 商品搜索项
 * @type {{"0": string; "1": string}}
 */
const GOODS_OPTION_TYPE = {
  0: 'goodsInfoName',
  1: 'goodsInfoNo'
};

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      postTitleData: List<any>;
      postTitleSource: List<any>;
      form: IMap;
      text: string;
      onFormFieldChange: Function;
      fieldTitleChange: Function;
      searchAccount: Function;
      init: Function;
      cateList: IList;
      brandList: IList;
      queryStoreByName: Function;
      storeMap: IMap;
      saveOperatorIdFilter: Function;
    };
  };

  static relaxProps = {
    // chooseTitle: ['postTitle', 'chooseTitle'],
    postTitleData: ['postTitle', 'postTitleData'],
    postTitleSource: 'postTitleSource',
    form: 'form',
    text: ['postTitle', 'text'],
    onFormFieldChange: noop,
    fieldTitleChange: noop,
    searchAccount: noop,
    init: noop,
    //品牌列表
    brandList: 'brandList',
    //分类列表
    cateList: 'cateList',
    queryStoreByName: noop,
    storeMap: 'storeMap',
    saveOperatorIdFilter: noop
  };

  render() {
    const {
      postTitleData,
      form,
      postTitleSource,
      text,
      onFormFieldChange,
      init,
      searchAccount,
      fieldTitleChange,
      brandList,
      cateList,
      saveOperatorIdFilter
    } = this.props.relaxProps;

    const option = postTitleData.map((item) => {
      return (
        <AutoComplete.Option
          key={item.get('employeeId')}
          value={item.get('accountName') + '  ' + item.get('employeeName')}
        >
          {item.get('accountName') + '  ' + item.get('employeeName')}
        </AutoComplete.Option>
      );
    });

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
                  ? form.get('goodsInfoName')
                  : form.get('goodsInfoNo')
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
            <TreeSelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="平台类目"
              defaultValue="全部"
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
            <Input.Group compact>
              <Select
                defaultValue={postTitleSource.get(0).get('title')}
                onChange={(value) => fieldTitleChange('chooseTitle', value)}
              >
                {postTitleSource.map((item, index) => {
                  return (
                    <Select.Option value={index} key={index}>
                      {item.get('title')}
                    </Select.Option>
                  );
                })}
              </Select>
              <AutoComplete
                dataSource={[]}
                value={text}
                onChange={(value) => searchAccount(value)}
                onSelect={(val) => {
                  saveOperatorIdFilter(val);
                }}
                allowClear={true}
              >
                {option as any}
              </AutoComplete>
            </Input.Group>
          </FormItem>

          <FormItem>
            <InputGroupCompact
              title={'分享次数'}
              start={form.get('recommendNumMin')}
              startMin={0}
              end={form.get('recommendNumMax')}
              endMin={0}
              onStartChange={(val) =>
                onFormFieldChange({ key: 'recommendNumMin', value: val })
              }
              onEndChange={(val) =>
                onFormFieldChange({ key: 'recommendNumMax', value: val })
              }
            />
          </FormItem>
          <FormItem>
            <SelectBox>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="素材类型"
                defaultValue="全部"
                showSearch
                optionFilterProp="children"
                onChange={(value) => {
                  onFormFieldChange({ key: 'matterType', value });
                }}
              >
                <Option key="-1" value={null}>
                  全部
                </Option>
                <Option key="0" value="0">
                  商品素材
                </Option>
                <Option key="1" value="1">
                  营销素材
                </Option>
              </SelectGroup>
            </SelectBox>
          </FormItem>

          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => init({ pageNum: 0, pageSize: 10, headInfo: null })}
            >
              搜索
            </Button>
          </FormItem>
        </Form>
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
