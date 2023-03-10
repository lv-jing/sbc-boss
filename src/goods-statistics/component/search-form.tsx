import React from 'react';
import { Relax } from 'plume2';
import { Form, Select, Input, Button, Tree } from 'antd';
import { IList } from 'typings/globalType';
import { noop, SelectGroup, TreeSelectGroup } from 'qmkit';
import { IndicatorPopver, DownloadModal } from 'biz';
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
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
//自定义指标卡片显示的内容
const popContent = [
  {
    title: '下单指标',
    data: [
      { title: '下单笔数', key: 'orderCount' },
      { title: '下单金额', key: 'orderAmt' },
      { title: '下单件数', key: 'orderNum' },
      { title: '付款商品数', key: 'payNum' }
    ]
  },
  {
    title: '转化指标',
    data: [{ title: '单品转化率', key: 'orderConversion' }]
  },
  {
    title: '退单指标',
    data: [
      { title: '退单件数', key: 'returnOrderNum' },
      { title: '退单笔数', key: 'returnOrderCount' },
      { title: '退单金额', key: 'returnOrderAmt' }
    ]
  }
];

//自定义指标卡片显示的内容
const otherPopContent = [
  {
    title: '下单指标',
    data: [
      { title: '下单笔数', key: 'orderCount' },
      { title: '下单金额', key: 'orderAmt' },
      { title: '下单件数', key: 'orderNum' },
      { title: '付款商品数', key: 'payNum' }
    ]
  },
  {
    title: '退单指标',
    data: [
      { title: '退单笔数', key: 'returnOrderCount' },
      { title: '退单金额', key: 'returnOrderAmt' },
      { title: '退单件数', key: 'returnOrderNum' }
    ]
  }
];

const skuRecommend = [
  { title: '下单笔数', key: 'orderCount' },
  { title: '下单金额', key: 'orderAmt' },
  { title: '下单件数', key: 'orderNum' },
  { title: '付款商品数', key: 'payNum' },
  { title: '退单件数', key: 'returnOrderNum' },
  { title: '单品转化率', key: 'orderConversion' }
];

const cateOrBrandRecommend = [
  { title: '下单笔数', key: 'orderCount' },
  { title: '下单金额', key: 'orderAmt' },
  { title: '下单件数', key: 'orderNum' },
  { title: '付款商品数', key: 'payNum' },
  { title: '退单笔数', key: 'returnOrderCount' },
  { title: '退单件数', key: 'returnOrderNum' }
];

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      tableFlag: number;
      changeTableFlag: Function;
      changeSkuName: Function;
      searchSkuName: Function;
      skuName: string;
      cateReportList: any;
      searchByCateName: Function;
      searchByBrandName: Function;
      brandReportList: any;
      changeColumns: Function;
      skuColumns: IList;
      cateColumns: IList;
      brandColumns: IList;
      cateList: IList;
      brandList: IList;
      visible: boolean;
      showModal: Function;
      hideModal: Function;
      cateName: string;
      brandName: string;
      companyInfoId: string;
    };
  };

  static relaxProps = {
    tableFlag: 'tableFlag',
    changeTableFlag: noop,
    changeSkuName: noop,
    searchSkuName: noop,
    cateReportList: 'cateReportList',
    searchByCateName: noop,
    searchByBrandName: noop,
    brandReportList: 'brandReportList',
    changeColumns: noop,
    skuColumns: 'skuColumns',
    cateColumns: 'cateColumns',
    brandColumns: 'brandColumns',
    cateList: 'cateList',
    brandList: 'brandList',
    skuName: 'skuName',
    visible: 'visible',
    showModal: noop,
    hideModal: noop,
    dateFlag: 'dateFlag',
    cateName: 'cateName',
    brandName: 'brandName',
    companyInfoId: 'companyInfoId'
  };

  render() {
    const {
      tableFlag,
      changeTableFlag,
      changeSkuName,
      searchSkuName,
      searchByCateName,
      searchByBrandName,
      skuColumns,
      cateColumns,
      brandColumns,
      changeColumns,
      cateList,
      brandList,
      skuName,
      cateName,
      brandName,
      companyInfoId
    } = this.props.relaxProps;

    //处理分类的树形图结构数据
    const loop = (cateList) =>
      cateList.map((item) => {
        if (item.get('children') && item.get('children').count()) {
          return (
            <TreeNode
              key={companyInfoId ? item.get('storeCateId') : item.get('cateId')}
              value={
                companyInfoId ? item.get('storeCateId') : item.get('cateId')
              }
              title={item.get('cateName')}
            >
              {loop(item.get('children'))}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={companyInfoId ? item.get('storeCateId') : item.get('cateId')}
            value={companyInfoId ? item.get('storeCateId') : item.get('cateId')}
            title={item.get('cateName')}
          />
        );
      });

    return (
      <div style={styles.timeBox}>
        <ul style={styles.box}>
          <li>
            <a
              onClick={() => changeTableFlag(0)}
              style={tableFlag == 0 ? styles.itemCur : styles.item}
            >
              商品报表
            </a>
          </li>
          <li>
            <a
              onClick={() => changeTableFlag(1)}
              style={tableFlag == 1 ? styles.itemCur : styles.item}
            >
              分类报表
            </a>
          </li>
          <li>
            <a
              onClick={() => changeTableFlag(2)}
              style={tableFlag == 2 ? styles.itemCur : styles.item}
            >
              品牌报表
            </a>
          </li>
        </ul>
        <Form style={{ display: 'flex', alignItems: 'center' }} layout="inline">
          {tableFlag == 0 ? (
            <FormItem>
              <Input
                style={{ width: '260px' }}
                placeholder="输入商品名称或SKU编码"
                addonBefore="单品查看"
                value={skuName}
                onChange={(e) => changeSkuName((e.target as any).value)}
              />
            </FormItem>
          ) : tableFlag == 1 ? (
            <FormItem>
              <TreeSelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="分类"
                value={cateName}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeDefaultExpandAll
                onChange={(key, value) => searchByCateName(key, value)}
              >
                <TreeNode key="0" value="0" title="全部分类">
                  {loop(cateList)}
                </TreeNode>
              </TreeSelectGroup>
            </FormItem>
          ) : (
            <FormItem>
              <SelectBox>
                <SelectGroup
                  getPopupContainer={() =>
                    document.getElementById('page-content')
                  }
                  label="品牌"
                  value={brandName}
                  onChange={(value) => searchByBrandName(value)}
                >
                  <Option key="-1" value="-1">
                    全部品牌
                  </Option>
                  {brandList.map((v, i) => {
                    return (
                      <Option
                        key={i}
                        value={v.get('brandId') + '_' + v.get('brandName')}
                      >
                        {v.get('brandName')}
                      </Option>
                    );
                  })}
                </SelectGroup>
              </SelectBox>
            </FormItem>
          )}
          {tableFlag == 0 ? (
            <Button
              style={{ marginRight: 10 }}
              type="primary"
              icon="search"
              onClick={() => searchSkuName()}
              htmlType="submit"
            >
              搜索
            </Button>
          ) : null}
          <IndicatorPopver
            popContent={tableFlag == 0 ? popContent : otherPopContent}
            maxCheckedCount={6}
            selfIndicators={
              tableFlag == 0 ? skuRecommend : cateOrBrandRecommend
            }
            onSubmit={(value) => changeColumns(tableFlag, value)}
            checkedArray={
              tableFlag == 0
                ? skuColumns
                : tableFlag == 1
                ? cateColumns
                : brandColumns
            }
          />
          <DownloadModal
            visible={false}
            reportType={
              tableFlag == 0 ? 2 : tableFlag == 1 ? (companyInfoId ? 11 : 3) : 4
            }
            companyId={companyInfoId}
          />
        </Form>
      </div>
    );
  }
}

const styles = {
  timeBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  } as any,
  box: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  } as any,
  itemCur: {
    color: '#F56C1D',
    fontSize: 14,
    borderBottom: '2px solid #F56C1D',
    padding: 5,
    marginRight: 20
  },
  item: {
    color: '#666',
    fontSize: 14,
    display: 'block',
    padding: 5,
    marginRight: 20
  }
};
