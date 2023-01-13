import React from 'react';
import { Relax } from 'plume2';
import { Tree } from 'antd';
import { List, Map, fromJS } from 'immutable';

import { noop } from 'qmkit';
import OperateBtn from './operate-btn';
const TreeNode = Tree.TreeNode;
@Relax
export default class AuthorityManager extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      allMenus: List<any>;
      bossMenus: List<any>;
      objInfo: Map<any, any>;
      changeSelectedNode: Function;
    };
  };

  static relaxProps = {
    allMenus: 'allMenus',
    bossMenus: 'bossMenus',
    objInfo: 'objInfo',
    changeSelectedNode: noop
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { bossMenus, objInfo } = this.props.relaxProps;
    if (!bossMenus || bossMenus.size <= 0) {
      return null;
    }

    return (
      <div className="cardGery">
        {/*操作按钮*/}
        <OperateBtn />

        {/*菜单/功能/权限*/}
        <Tree
          selectedKeys={objInfo.get('id') ? [objInfo.get('id')] : []}
          onSelect={this._onSelect}
        >
          {this._loopMenu(bossMenus)}
        </Tree>
      </div>
    );
  }

  /**
   * 递归获取菜单权限信息
   * @param bossMenus
   * @private
   */
  _loopMenu = (bossMenus) =>
    bossMenus.map((item) => {
      if (item.get('children') && item.get('children').size > 0) {
        return (
          <TreeNode
            key={item.get('id')}
            value={item.get('id')}
            pid={item.get('pid')}
            title={item.get('title')}
          >
            {this._loopMenu(item.get('children'))}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.get('id')}
          value={item.get('id')}
          pid={item.get('pid')}
          title={item.get('title')}
        />
      );
    });

  /**
   * 选中某个节点(菜单/功能/权限)
   */
  _onSelect = (selectedKeys, param) => {
    const { node } = param;
    let objInfo = fromJS({});
    const { changeSelectedNode } = this.props.relaxProps;
    if (selectedKeys.length > 0) {
      const { allMenus } = this.props.relaxProps;
      objInfo = allMenus.find((menu) => menu.get('id') == node.props.value);
    }
    changeSelectedNode(objInfo);
  };
}
