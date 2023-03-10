import * as React from 'react';
import { Relax } from 'plume2';
import { DataGrid, noop } from 'qmkit';
import { List, Map, fromJS } from 'immutable';
import { Modal } from 'antd';

declare type IList = List<any>;
const { Column } = DataGrid;
const confirm = Modal.confirm;

const styles = {
  edit: {
    paddingRight: 10
  }
};

@Relax
export default class CateList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      childFlag: boolean; //是否有子类
      imageFlag: boolean; //该分类下是否有图片
      dataList: IList; //分类列表
      doDelete: Function; //删除
      showEditModal: Function; //编辑弹窗
      validChild: Function; //校验是否有子分类
      validImage: Function; //校验是否有图片
    };
  };

  static relaxProps = {
    childFlag: 'childFlag',
    imageFlag: 'imageFlag',
    dataList: 'dataList',
    doDelete: noop,
    showEditModal: noop,
    validChild: noop,
    validImage: noop
  };

  render() {
    const { dataList } = this.props.relaxProps;
    return (
      <DataGrid rowKey="cateId" dataSource={dataList.toJS()}>
        <Column
          title="分类名称"
          dataIndex="cateName"
          key="cateName"
          className="namerow"
          width="50%"
        />
        <Column title="操作" key="option" render={this._getOption} />
      </DataGrid>
    );
  }

  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    rowInfo = fromJS(rowInfo);
    return (
      <div>
        {rowInfo.get('cateGrade') != 3 && rowInfo.get('isDefault') != 1 ? (
          <a
            style={styles.edit}
            onClick={this._addChildrenCate.bind(
              this,
              rowInfo.get('cateId'),
              rowInfo.get('cateName')
            )}
          >
            新增子分类
          </a>
        ) : null}
        {rowInfo.get('isDefault') != 1 ? (
          <a
            style={styles.edit}
            onClick={this._showEditModal.bind(
              this,
              rowInfo.get('cateId'),
              rowInfo.get('cateName'),
              rowInfo.get('cateParentId')
            )}
          >
            编辑
          </a>
        ) : null}
        {rowInfo.get('isDefault') != 1 ? (
          <a onClick={this._delete.bind(this, rowInfo.get('cateId'))}>删除</a>
        ) : null}
      </div>
    );
  };

  /**
   * 显示修改弹窗
   */
  _showEditModal = (cateId: string, cateName: string, cateParentId: number) => {
    const { showEditModal, dataList } = this.props.relaxProps;
    let cateParentName = '';

    if (cateParentId > 0) {
      // 定义方法，循环查询父分类名称
      // 是否还未找到父分类
      let searching = true;
      const findCateName = (dataList) =>
        searching &&
        dataList &&
        dataList.forEach((item) => {
          if (item.get('cateId') === cateParentId) {
            cateParentName = item.get('cateName');
            searching = false;
          } else {
            findCateName(item.get('children'));
          }
        });

      // 开始查询
      findCateName(dataList);
    }

    let cateInfo = Map({ cateId, cateName, cateParentName, cateParentId });
    showEditModal(cateInfo, true);
  };

  /**
   * 删除
   */
  _delete = async (cateId: string) => {
    const { validChild, validImage } = this.props.relaxProps;

    //先判断有无分类，后判断有分类下有无图片
    await validChild(cateId);
    await validImage(cateId);

    this._confirm(cateId);
  };

  _confirm = (cateId: string) => {
    const { doDelete, childFlag, imageFlag } = this.props.relaxProps;

    if (childFlag) {
      //有子分类
      confirm({
        title: '提示',
        content:
          '删除当前分类，该分类下的所有分类也会删除，您确认删除这个分类吗？',
        onOk() {
          if (imageFlag) {
            //该分类下有图片
            confirm({
              title: '提示',
              content:
                '当前分类已关联了图片，建议修改后再删除，点击继续删除 ，相关图片将会归类到默认分类!',
              onOk() {
                doDelete(cateId);
              },
              okText: '继续删除',
              cancelText: '取消'
            });
          } else {
            doDelete(cateId);
          }
        }
      });
    } else if (imageFlag) {
      //该分类下有图片
      confirm({
        title: '提示',
        content:
          '当前分类已关联了图片，建议修改后再删除，点击继续删除 ，相关图片将会归类到默认分类!',
        onOk() {
          doDelete(cateId);
        },
        okText: '继续删除',
        cancelText: '取消'
      });
    } else {
      //没有子分类
      confirm({
        title: '提示',
        content: '您确认要删除这个分类吗？',
        onOk() {
          doDelete(cateId);
        }
      });
    }
  };

  /**
   * 添加子类目
   */
  _addChildrenCate = (cateParentId: string, cateParentName: string) => {
    const { showEditModal } = this.props.relaxProps;
    showEditModal(Map({ cateParentId, cateParentName }), false);
  };
}
