import * as React from 'react';
import { Relax } from 'plume2';

import { Tree } from 'antd';
import styled from 'styled-components';
import { noop } from 'qmkit';
import { IList } from 'typings/globalType';

const TreeNode = Tree.TreeNode;

const TreeBox = styled.div`
  height: 468px;
  overflow-y: auto;
`;

@Relax
export default class CateTree extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  props: {
    relaxProps?: {
      allCates: IList;
      cates: IList;

      addCate: Function;
      delCate: Function;
    };
  };

  static relaxProps = {
    // 平台全部分类
    allCates: 'allCates',
    // 弹框中的签约分类
    cates: 'cates',

    // 新增分类
    addCate: noop,
    // 删除分类
    delCate: noop
  };

  render() {
    const { cates, allCates } = this.props.relaxProps;
    const chooseIds = cates
      .toJS()
      .map((c) => c.cateId.toString())
      .filter((f) => f);
    return (
      <TreeBox>
        <Tree
          showLine
          checkable
          defaultCheckedKeys={chooseIds}
          checkedKeys={chooseIds}
          onCheck={this._handleCheck}
        >
          {this._loop(allCates)}
        </Tree>
      </TreeBox>
    );
  }

  /**
   * 分类循环方法  使用tree-select组件,把扁平化数据转换成适应TreeSelect的数据
   */
  _loop = (cateList) =>
    cateList.map((item) => {
      const childCates = item.get('goodsCateList');
      if (childCates && childCates.count()) {
        return (
          <TreeNode
            disableCheckbox={item.get('cateGrade') != 3}
            key={item.get('cateId').toString()}
            value={item.get('cateId').toString()}
            title={
              item.get('cateName').toString() +
              ' ' +
              `${
                item.get('cateRate')
                  ? item.get('cateRate').toString() + '%'
                  : ''
              }`
            }
          >
            {this._loop(childCates)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          disableCheckbox={item.get('cateGrade') != 3}
          key={item.get('cateId').toString()}
          value={item.get('cateId').toString()}
          title={
            item.get('cateName').toString() +
            ' ' +
            `${
              item.get('cateRate') ? item.get('cateRate').toString() + '%' : ''
            }`
          }
        />
      );
    });

  /**
   * 选中/取消 分类
   */
  _handleCheck = (_checkedKeys, e) => {
    const { addCate, delCate } = this.props.relaxProps;
    // 选中, 进行新增
    if (e.checked) {
      addCate(e.node.props.value);
    } else {
      // 反选, 进行删除
      delCate(e.node.props.value);
    }
  };
}
