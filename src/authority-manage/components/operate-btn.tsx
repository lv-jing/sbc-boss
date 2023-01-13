import React from 'react';
import { Relax, IMap } from 'plume2';
import { Button, Modal } from 'antd';
import { noop } from 'qmkit';

const confirm = Modal.confirm;
@Relax
export default class OperateBtn extends React.Component<any, any> {
  props: {
    relaxProps?: {
      objInfo: IMap;
      showModel: Function;
      deleteIt: Function;
    };
  };

  static relaxProps = {
    objInfo: 'objInfo', // 当前选中的节点(菜单/功能/权限)
    showModel: noop, // 弹出新增/编辑框(菜单/功能/权限)
    deleteIt: noop // 删除菜单/功能/权限
  };

  render() {
    const { showModel } = this.props.relaxProps;
    const {
      insertMenuFlag,
      insertFuncFlag,
      insertAuthFlag,
      updateModel,
      id
    } = this._getRenderDate();
    return (
      <div>
        <div className="handle-bar">
          {insertMenuFlag && (
            <Button
              type="primary"
              onClick={() => showModel('menuVisible', false)}
            >
              新增菜单
            </Button>
          )}
          {insertFuncFlag && (
            <Button
              type="primary"
              onClick={() => showModel('funcVisible', false)}
            >
              新增功能
            </Button>
          )}
          {insertAuthFlag && (
            <Button
              type="primary"
              onClick={() => showModel('authVisible', false)}
            >
              新增权限
            </Button>
          )}
          {updateModel && (
            <Button type="primary" onClick={() => showModel(updateModel, true)}>
              编辑
            </Button>
          )}
          {updateModel && (
            <Button
              type="danger"
              onClick={() => this._deleteIt(updateModel, id)}
            >
              删除
            </Button>
          )}
        </div>
      </div>
    );
  }

  /**
   * 根据当前选中节点获取可用的操作按钮数据
   * @returns {{insertMenuFlag: boolean, insertFuncFlag: boolean, insertAuthFlag: boolean, updateModel: null}}
   */
  _getRenderDate = () => {
    const { objInfo } = this.props.relaxProps;
    // 1.1.默认新增操作按钮都不可见(false代表不可见)
    let insertMenuFlag = false;
    let insertFuncFlag = false;
    let insertAuthFlag = false;
    // 1.2.默认编辑弹出框为空(也用于判断是否展示编辑/删除操作按钮)
    let updateModel = null;

    if (objInfo && objInfo.get('id')) {
      const val = objInfo.get('id');
      if (val.indexOf('menu_') > -1) {
        // 2.1.若选中菜单,则'新增功能'按钮都可用
        insertFuncFlag = true;
        // 2.2.编辑弹出框设为'菜单',删除按钮可用
        updateModel = 'menuVisible';
        if (objInfo.get('grade') < 3) {
          // 2.3.若小于3级的菜单,'新增菜单'按钮可用
          insertMenuFlag = true;
        }
      } else if (val.indexOf('func_') > -1) {
        // 3.1.若选中功能,则'新增权限'可用
        insertAuthFlag = true;
        // 3.2.编辑弹出框设为'功能',删除按钮可用
        updateModel = 'funcVisible';
      } else if (val.indexOf('auth_') > -1) {
        // 4.1.若选中权限,编辑弹出框设为'权限',删除可用
        updateModel = 'authVisible';
      }
    } else {
      // 5.若未选中任何节点,则'新增菜单'可用
      insertMenuFlag = true;
    }

    return {
      insertMenuFlag,
      insertFuncFlag,
      insertAuthFlag,
      updateModel,
      id: objInfo.get('realId')
    };
  };

  /**
   * 删除某个节点(菜单/功能/权限)
   * @private
   */
  _deleteIt = (updateModel, id) => {
    let nodeNm = '菜单';
    if (updateModel == 'funcVisible') {
      nodeNm = '功能';
    } else if (updateModel == 'authVisible') {
      nodeNm = '权限';
    }

    const deleteIt = this.props.relaxProps.deleteIt;
    confirm({
      title: '提示',
      content: `您确认要删除选择的【${nodeNm}】吗？`,
      onOk() {
        deleteIt(updateModel, id);
      }
    });
  };
}
