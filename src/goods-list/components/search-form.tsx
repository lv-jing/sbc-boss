import React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Button, Select, Tree, Row, Col, TreeSelect } from 'antd';
import { noop, SelectGroup, TreeSelectGroup } from 'qmkit';
import { IList } from 'typings/globalType';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import StoreSelection from '../../common-components/store-selection';

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
      likeGoodsInfoNo: string;
      likeGoodsNo: string;
      storeCateId: string;
      brandId: string;
      addedFlag: string;
      onSearch: Function;
      onEditSkuNo: Function;
      onFormFieldChange: Function;
      brandList: IList;
      productCateList: IList;
      sourceGoodCateList: IList;
      allCateList: IList;
      cateList: IList;
      cateId: String;
      storeId: string;
    };
  };

  static relaxProps = {
    // 模糊条件-商品名称
    likeGoodsName: 'likeGoodsName',
    // 模糊条件-SKU编码
    likeGoodsInfoNo: 'likeGoodsInfoNo',
    // 模糊条件-SPU编码
    likeGoodsNo: 'likeGoodsNo',
    // 商品分类
    storeCateId: 'storeCateId',
    // 品牌编号
    brandId: 'brandId',
    cateId: 'cateId',
    storeId: 'storeId',
    onSearch: noop,
    onFormFieldChange: noop,
    onEditSkuNo: noop,
    //品牌列表
    brandList: 'brandList',
    //分类列表
    productCateList: 'productCateList',
    sourceGoodCateList: 'sourceGoodCateList',
    cateList: 'cateList',
    allCateList: 'allCateList',
  };

  render() {
    const {
      likeGoodsName,
      likeGoodsInfoNo,
      likeGoodsNo,
      onSearch,
      onFormFieldChange,
      brandList,
      cateList,
      onEditSkuNo,
      allCateList,
      productCateList,
    } = this.props.relaxProps;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };
    //处理分类的树形图结构数据
    const loop = (cateList) =>
      cateList.map((item) => {
        if (item.get('children') && item.get('children').count()) {
          return (
            <TreeNode
              key={item.get('storeCateId')}
              value={item.get('storeCateId')}
              title={item.get('cateName')}
            >
              {loop(item.get('children'))}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={item.get('storeCateId')}
            value={item.get('storeCateId')}
            title={item.get('cateName')}
          />
        );
      });

    const loopProductCateory = (productCateList) =>
      productCateList.map((item) => {
        if (item.get('children') && item.get('children').count()) {
          return (
            <TreeNode
              key={item.get('cateId')}
              value={item.get('cateId')}
              title={item.get('cateName')}
              disabled={true}
            >
              {loopProductCateory(item.get('children'))}
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
      <Form className="filter-content" layout="inline">
        <Row>
          <Col span={8}>
            <FormItem>
              <StoreSelection
                onChange={(value) => {
                  onFormFieldChange({ key: 'storeId', value });
                }}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              <Input
                addonBefore={
                  <p style={styles.label}>
                    <FormattedMessage id="Product.productName" />
                  </p>
                }
                value={likeGoodsName}
                style={styles.formItemStyle}
                onChange={(e: any) => {
                  onFormFieldChange({
                    key: 'likeGoodsName',
                    value: e.target.value
                  });
                }}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              <Input
                addonBefore={
                  <p style={styles.label}>
                    <FormattedMessage id="Product.SPU" />
                  </p>
                }
                value={likeGoodsNo}
                style={styles.formItemStyle}
                onChange={(e: any) => {
                  onFormFieldChange({
                    key: 'likeGoodsNo',
                    value: e.target.value
                  });
                }}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              <Input
                addonBefore={
                  <p style={styles.label}>
                    <FormattedMessage id="Product.SKU" />
                  </p>
                }
                style={styles.formItemStyle}
                value={likeGoodsInfoNo}
                onChange={(e: any) => {
                  onFormFieldChange({
                    key: 'likeGoodsInfoNo',
                    value: e.target.value
                  });
                  onEditSkuNo(e.target.value);
                }}
              />
            </FormItem>
          </Col>
          {/* <Col span={8}>
            <FormItem>
              <TreeSelectGroup
                allowClear
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label={
                  <p style={styles.label}>
                    <FormattedMessage id="Product.Salescategory" />
                  </p>
                }
                style={styles.wrapper}
                dropdownStyle={{
                  maxHeight: 400,
                  overflow: 'auto',
                  minWidth: 200
                }}
                treeDefaultExpandAll
                onChange={(value) => {
                  let sourceCategories = allCateList ? allCateList.toJS() : [];
                  let childCategoryIds = [];

                  let children = sourceCategories.filter(
                    (x) => x.cateParentId === value
                  );
                  if (children && children.length > 0) {
                    children.map((x) => {
                      let lastChildren = sourceCategories.filter(
                        (l) => l.cateParentId === x.storeCateId
                      );
                      if (lastChildren && lastChildren.length > 0) {
                        lastChildren.map((l) => {
                          childCategoryIds.push(l.storeCateId);
                        });
                      } else {
                        childCategoryIds.push(x.storeCateId);
                      }
                    });
                  } else {
                    childCategoryIds.push(value);
                  }
                  onFormFieldChange({
                    key: 'storeCateId',
                    value: childCategoryIds
                  });
                }}
              >
                {loop(cateList)}
              </TreeSelectGroup>
            </FormItem>
          </Col> */}

          {/* <Col span={8}>
            <FormItem>
              <TreeSelectGroup
                allowClear
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label={
                  <p style={styles.label}>
                    <FormattedMessage id="Product.Productcategory" />
                  </p>
                }
                style={styles.wrapper}
                dropdownStyle={{
                  maxHeight: 400,
                  overflow: 'auto',
                  minWidth: 200
                }}
                treeDefaultExpandAll
                onChange={(value) => {
                  onFormFieldChange({ key: 'cateId', value });
                }}
              >
                {loopProductCateory(productCateList)}
              </TreeSelectGroup>
            </FormItem>
          </Col> */}

          <Col span={8}>
            <FormItem>
              <SelectGroup
                allowClear
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                style={styles.wrapper}
                label={
                  <p style={styles.label}>
                    <FormattedMessage id="Product.brand" />
                  </p>
                }
                showSearch
                optionFilterProp="children"
                onChange={(value) => {
                  onFormFieldChange({ key: 'brandId', value });
                }}
              >
                {brandList.map((v, i) => {
                  return (
                    <Option key={i} value={v.get('brandId') + ''}>
                      {v.get('nickName')}
                    </Option>
                  );
                })}
              </SelectGroup>
            </FormItem>
          </Col>
          <Col span={24} style={{ textAlign: 'center' }}>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                icon="search"
                shape="round"
                onClick={(e) => {
                  e.preventDefault();
                  onSearch();
                }}
              >
                <span>
                  <FormattedMessage id="Product.search" />
                </span>
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

const styles = {
  formItemStyle: {
    width: 335
  },
  label: {
    width: 113,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.65)',
    backgroundColor: '#fff',
    cursor: 'text'
  },
  leftLabel: {
    width: 135,
    textAlign: 'left',
    color: 'rgba(0, 0, 0, 0.65)',
    backgroundColor: '#fff',
    cursor: 'default',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  wrapper: {
    width: 200
  }
} as any;
