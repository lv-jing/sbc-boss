import React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Button, Select, Tree, Row, Col, TreeSelect, message } from 'antd';
import { noop, SelectGroup, TreeSelectGroup } from 'qmkit';
import { IList } from 'typings/globalType';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { fromJS, Map } from 'immutable';
import '../index.less';
import value from '*.json';

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

// @Relax
// class SearchForm extends React.Component<any, any> {
//   props: {
//     relaxProps?: {
//       likeGoodsName: string;
//       likeGoodsInfoNo: string;
//       likeGoodsNo: string;
//       storeCategoryIds: IList;
//       goodsCateId: string;
//       brandId: string;
//       addedFlag: string;
//       likeProductCategory: string;
//       onSearch: Function;
//       onEditSkuNo: Function;
//       onFormFieldChange: Function;
//       brandList: IList;
//       cateList: IList;
//       getGoodsCate: IList;
//       sourceGoodCateList: IList;
//     };
//   };
//
//   static relaxProps = {
//     // 模糊条件-商品名称
//     likeGoodsName: 'likeGoodsName',
//     // 模糊条件-SKU编码
//     likeGoodsInfoNo: 'likeGoodsInfoNo',
//     // 模糊条件-SPU编码
//     likeGoodsNo: 'likeGoodsNo',
//     // 商品分类
//     storeCategoryIds: 'storeCategoryIds',
//     goodsCateId: 'goodsCateId',
//     // 品牌编号
//     likeProductCategory: 'likeProductCategory',
//     brandId: 'brandId',
//     onSearch: noop,
//     onFormFieldChange: noop,
//     onEditSkuNo: noop,
//     //品牌列表
//     brandList: 'brandList',
//     //分类列表
//     cateList: 'cateList',
//     getGoodsCate: 'getGoodsCate',
//     sourceGoodCateList: 'sourceGoodCateList'
//   };
//
//   searchBackFun = () => {
//     const { likeGoodsName, likeGoodsNo, storeCategoryIds, goodsCateId } = this.props.relaxProps;
//     let from = {
//       goodsName: likeGoodsName,
//       goodsNo: likeGoodsNo,
//       storeCateIds: storeCategoryIds,
//       goodsCateId: goodsCateId
//     };
//
//     this.props.searchBackFun(from);
//   };
//
//   render() {
//     const { likeGoodsName, likeProductCategory, storeCategoryIds, likeGoodsNo, onFormFieldChange, brandList, cateList, getGoodsCate, sourceGoodCateList } = this.props.relaxProps;
//     //const { getFieldDecorator } = this.props.form;
//     const formItemLayout = {
//       labelCol: {
//         xs: { span: 24 },
//         sm: { span: 10 }
//       },
//       wrapperCol: {
//         xs: { span: 24 },
//         sm: { span: 14 }
//       }
//     };
//
//     //处理分类的树形图结构数据
//     const loop = (cateList) => {
//       return (
//         cateList &&
//         cateList.count() > 0 &&
//         cateList.map((item) => {
//           if (item.get('children') && item.get('children').count()) {
//             return (
//               <TreeNode key={item.get('cateId')} value={item.get('cateId')} title={item.get('cateName')} disabled={true}>
//                 {loop(item.get('children'))}
//               </TreeNode>
//             );
//           }
//           return <TreeNode key={item.get('cateId')} value={item.get('cateId')} title={item.get('cateName')} />;
//         })
//       );
//     };
//
//     const generateStoreCateTree = (storeCateList) => {
//       return (
//         storeCateList &&
//         storeCateList.count() > 0 &&
//         storeCateList.map((item) => {
//           if (item.get('children') && item.get('children').count()) {
//             return (
//               <TreeNode key={item.get('storeCateId')} value={item.get('storeCateId')} title={item.get('cateName')}>
//                 {generateStoreCateTree(item.get('children'))}
//               </TreeNode>
//             );
//           }
//           return <TreeNode key={item.get('storeCateId')} value={item.get('storeCateId')} title={item.get('cateName')} />;
//         })
//       );
//     };
//
//     const onSalesCategoryChange = (value) => {
//       if (!value) {
//         onFormFieldChange({ key: 'storeCategoryIds', value: null });
//         return;
//       }
//       let sourceCategories = sourceGoodCateList ? sourceGoodCateList.toJS() : [];
//       let childCategoryIds = [];
//
//       let children = sourceCategories.filter((x) => x.cateParentId === value);
//       if (children && children.length > 0) {
//         children.map((x) => {
//           let lastChildren = sourceCategories.filter((l) => l.cateParentId === x.storeCateId);
//           if (lastChildren && lastChildren.length > 0) {
//             lastChildren.map((l) => {
//               childCategoryIds.push(l.storeCateId);
//             });
//           } else {
//             childCategoryIds.push(x.storeCateId);
//           }
//         });
//       } else {
//         childCategoryIds.push(value);
//       }
//       onFormFieldChange({ key: 'storeCategoryIds', value: childCategoryIds });
//     };
//     const { getFieldDecorator } = this.props.form;
//     return (
//       <Form className="filter-content" layout="inline">
//         <Row>
//           <Col span={8}>
//             <FormItem>
//               {getFieldDecorator('likeGoodsName')(
//                 <Input
//                   addonBefore={
//                     <p style={styles.label}>
//                       <FormattedMessage id="product.productName" />
//                     </p>
//                   }
//                   value={likeGoodsName}
//                   style={{ width: 300 }}
//                   onChange={(e: any) => {
//                     onFormFieldChange({
//                       key: 'likeGoodsName',
//                       value: e.target.value
//                     });
//                   }}
//                 />
//               )}
//             </FormItem>
//           </Col>
//           <Col span={8}>
//             <FormItem>
//               {getFieldDecorator('likeGoodsNo')(
//                 <Input
//                   addonBefore={
//                     <p style={styles.label}>
//                       <FormattedMessage id="product.SPU" />
//                     </p>
//                   }
//                   value={likeGoodsNo}
//                   style={{ width: 300 }}
//                   onChange={(e: any) => {
//                     onFormFieldChange({
//                       key: 'likeGoodsNo',
//                       value: e.target.value
//                     });
//                   }}
//                 />
//               )}
//             </FormItem>
//           </Col>
//           <Col span={8}>
//             <FormItem>
//               {getFieldDecorator('goodsCateId')(
//                 <TreeSelectGroup
//                   allowClear
//                   getPopupContainer={() => document.getElementById('page-content')}
//                   label={<p style={styles.label}><FormattedMessage id="Product.Productcategory" /></p>}
//                   /* defaultValue="全部"*/
//                   // style={styles.wrapper}
//                   dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
//                   treeDefaultExpandAll
//                   onChange={(value) => {
//                     onFormFieldChange({ key: 'goodsCateId', value });
//                   }}
//                 >
//                   {loop(cateList)}
//                 </TreeSelectGroup>
//               )}
//             </FormItem>
//           </Col>
//           <Col span={8} id="salesCategory">
//             <FormItem>
//               {getFieldDecorator('salesCategory')(
//                 <TreeSelectGroup
//                   className="tree-group"
//                   allowClear
//                   getPopupContainer={() => document.getElementById('page-content')}
//                   label={<p style={styles.label}><FormattedMessage id="Product.Salescategory" /></p>}
//                   dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
//                   treeDefaultExpandAll
//                   onChange={(value) => {
//                     onSalesCategoryChange(value);
//                   }}
//                 >
//                   {generateStoreCateTree(getGoodsCate)}
//                 </TreeSelectGroup>
//               )}
//             </FormItem>
//           </Col>
//
//           <Col span={8}>
//             <FormItem>
//               {getFieldDecorator('brandId')(
//                 <SelectGroup
//                   allowClear
//                   getPopupContainer={() => document.getElementById('page-content')}
//                   style={styles.wrapper}
//                   label={
//                     <p style={styles.label}>
//                       <FormattedMessage id="product.brand" />
//                     </p>
//                   }
//                   // defaultValue="All"
//                   showSearch
//                   optionFilterProp="children"
//                   onChange={(value) => {
//                     onFormFieldChange({ key: 'brandId', value });
//                   }}
//                 >
//                   {brandList.map((v, i) => {
//                     return (
//                       <Option key={i} value={v.get('brandId') + ''}>
//                         {v.get('nickName')}
//                       </Option>
//                     );
//                   })}
//                 </SelectGroup>
//               )}
//             </FormItem>
//           </Col>
//
//           <Col span={24} style={{ textAlign: 'center' }}>
//             <FormItem>
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 icon="search"
//                 shape="round"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   this.searchBackFun();
//                 }}
//               >
//                 <span>
//                   <FormattedMessage id="product.search" />
//                 </span>
//               </Button>
//             </FormItem>
//           </Col>
//         </Row>
//       </Form>
//     );
//   }
// }


@Relax
export default class RelateForm extends React.Component<any, any>{
  props: {
    relaxProps?: {
      brandList: IList;
      cateList: IList;
      getGoodsCate: IList;
      sourceGoodCateList: IList;
    };
  };

  static relaxProps = {
    //品牌列表
    brandList: 'brandList',
    //分类列表
    cateList: 'cateList',
    getGoodsCate: 'getGoodsCate',
    sourceGoodCateList: 'sourceGoodCateList',
  };

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): boolean {
    return false
  }

  render() {
    const WrapperForm = Form.create({})(RelatedSearchForm);
    return (
      <WrapperForm
        ref={(form) => (this['_form'] = form)}
        {...this.props.relaxProps}
        searchBackFun={(res) => this.props.searchBackFun(res)}
      />
    );
  }
}

class RelatedSearchForm extends React.Component<any, any>{
  constructor(props) {
    super(props);
  }

  onSubmit = (e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let storeCateIds = values.salesCategory ? this.onSalesCategoryChange(values.salesCategory) : undefined
        let from = {
          goodsName: values.likeGoodsName,
          goodsNo: values.likeGoodsNo,
          storeCateIds: storeCateIds,
          goodsCateId: values.goodsCateId
        };
        this.props.searchBackFun(from)
      }
    });
  }
  onSalesCategoryChange = (value) => {
    if (!value) {
      return;
    }
    let sourceCategories = this.props.sourceGoodCateList ? this.props.sourceGoodCateList.toJS() : [];
    let childCategoryIds = [];

    let children = sourceCategories.filter((x) => x.cateParentId === value);
    if (children && children.length > 0) {
      children.map((x) => {
        let lastChildren = sourceCategories.filter((l) => l.cateParentId === x.storeCateId);
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
    return childCategoryIds;
  };
  render() {
    const { brandList, cateList, getGoodsCate } = this.props;
    const { getFieldDecorator } = this.props.form;

    //处理分类的树形图结构数据
    const loop = (cateList) => {
      return (
        cateList &&
        cateList.count() > 0 &&
        cateList.map((item) => {
          if (item.get('children') && item.get('children').count()) {
            return (
              <TreeNode key={item.get('cateId')} value={item.get('cateId')} title={item.get('cateName')} disabled={true}>
                {loop(item.get('children'))}
              </TreeNode>
            );
          }
          return <TreeNode key={item.get('cateId')} value={item.get('cateId')} title={item.get('cateName')} />;
        })
      );
    };

    const generateStoreCateTree = (storeCateList) => {
      return (
        storeCateList &&
        storeCateList.count() > 0 &&
        storeCateList.map((item) => {
          if (item.get('children') && item.get('children').count()) {
            return (
              <TreeNode key={item.get('storeCateId')} value={item.get('storeCateId')} title={item.get('cateName')}>
                {generateStoreCateTree(item.get('children'))}
              </TreeNode>
            );
          }
          return <TreeNode key={item.get('storeCateId')} value={item.get('storeCateId')} title={item.get('cateName')} />;
        })
      );
    };

    return (
      <Form className="filter-content" layout="inline" onSubmit={this.onSubmit}>
        <Row>
          <Col span={8}>
            <FormItem>
              {getFieldDecorator('likeGoodsName')(
                <Input
                  addonBefore={
                    <p style={styles.label}>
                      <FormattedMessage id="product.productName" />
                    </p>
                  }
                  style={{ width: 300 }}
                />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              {getFieldDecorator('likeGoodsNo')(
                <Input
                  addonBefore={
                    <p style={styles.label}>
                      <FormattedMessage id="product.SPU" />
                    </p>
                  }
                  style={{ width: 300 }}
                />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              {getFieldDecorator('goodsCateId')(
                <TreeSelectGroup
                  allowClear
                  getPopupContainer={() => document.getElementById('page-content')}
                  label={<p style={styles.label}><FormattedMessage id="Product.Productcategory" /></p>}
                  /* defaultValue="全部"*/
                  // style={styles.wrapper}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeDefaultExpandAll
                >
                  {loop(cateList)}
                </TreeSelectGroup>
              )}
            </FormItem>
          </Col>
          <Col span={8} id="salesCategory">
            <FormItem>
              {getFieldDecorator('salesCategory')(
                <TreeSelectGroup
                  className="tree-group"
                  allowClear
                  getPopupContainer={() => document.getElementById('page-content')}
                  label={<p style={styles.label}><FormattedMessage id="Product.Salescategory" /></p>}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeDefaultExpandAll
                >
                  {generateStoreCateTree(getGoodsCate)}
                </TreeSelectGroup>
              )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem>
              {getFieldDecorator('brandId')(
                <SelectGroup
                  allowClear
                  getPopupContainer={() => document.getElementById('page-content')}
                  style={styles.wrapper}
                  label={
                    <p style={styles.label}>
                      <FormattedMessage id="product.brand" />
                    </p>
                  }
                  // defaultValue="All"
                  showSearch
                  optionFilterProp="children"
                >
                  {brandList.map((v, i) => {
                    return (
                      <Option key={i} value={v.get('brandId') + ''}>
                        {v.get('nickName')}
                      </Option>
                    );
                  })}
                </SelectGroup>
              )}
            </FormItem>
          </Col>

          <Col span={24} style={{ textAlign: 'center' }}>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                icon="search"
                shape="round"
              >
                <span>
                  <FormattedMessage id="product.search" />
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
  label: {
    width: 100,
    textAlign: 'center'
  },
  wrapper: {
    width: 177
  }
} as any;
