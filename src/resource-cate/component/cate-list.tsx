import * as React from 'react';
import { Relax } from 'plume2';
import { DataGrid, noop, AuthWrapper, RCi18n } from 'qmkit';
import { List, Map, fromJS } from 'immutable';
import { Modal } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

declare type IList = List<any>;
import { Table, Tooltip } from 'antd';

const Column = Table.Column;
const confirm = Modal.confirm;

const styles = {
  edit: {
    paddingRight: 10
  }
};

@Relax
class CateList extends React.Component<any, any> {
  props: {
    intl?:any;
    relaxProps?: {
      childFlag: boolean; //是否有子类
      resourceFlag: boolean; //该分类下是否有素材
      dataList: IList; //分类列表
      doDelete: Function; //删除
      showEditModal: Function; //编辑弹窗
      validChild: Function; //校验是否有子分类
      validResource: Function; //校验是否有素材
    };
  };

  static relaxProps = {
    childFlag: 'childFlag',
    resourceFlag: 'resourceFlag',
    dataList: 'dataList',
    doDelete: noop,
    showEditModal: noop,
    validChild: noop,
    validResource: noop
  };

  render() {
    const { dataList } = this.props.relaxProps;
    return (
      <DataGrid rowKey="cateId" dataSource={dataList.toJS()}>
        <Column title={<FormattedMessage id="Setting.categoryName" />} dataIndex="cateName" key="cateName" className="namerow" width="50%" />
        <Column title={<FormattedMessage id="Setting.operation" />} key="option" render={this._getOption} />
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
          <AuthWrapper functionName="f_resourceCate_2">
            <Tooltip placement="top" title={<FormattedMessage id="Setting.AddSubcategory" />}>
              <a style={styles.edit} onClick={this._addChildrenCate.bind(this, rowInfo.get('cateId'), rowInfo.get('cateName'))} className="iconfont iconbtn-addsubvisionsaddcategory">
                {/*<FormattedMessage id="addSubcategory" />*/}
              </a>
            </Tooltip>
          </AuthWrapper>
        ) : null}
        {rowInfo.get('isDefault') != 1 ? (
          <AuthWrapper functionName="f_resourceCate_2">
            <Tooltip placement="top" title={<FormattedMessage id="Setting.Edit" />}>
              <a style={styles.edit} onClick={this._showEditModal.bind(this, rowInfo.get('cateId'), rowInfo.get('cateName'), rowInfo.get('cateParentId'))} className="iconfont iconEdit">
                {/*<FormattedMessage id="edit" />*/}
              </a>
            </Tooltip>
          </AuthWrapper>
        ) : null}
        {rowInfo.get('isDefault') != 1 ? (
          <AuthWrapper functionName="f_resourceCate_1">
            <Tooltip placement="top" title={<FormattedMessage id="Setting.Delete" />}>
              <a onClick={this._delete.bind(this, rowInfo.get('cateId'))} className="iconfont iconDelete">
                {/*<FormattedMessage id="delete" />*/}
              </a>
            </Tooltip>
          </AuthWrapper>
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
    const { validChild, validResource } = this.props.relaxProps;

    //先判断有无分类，后判断有分类下有无素材
    await validChild(cateId);
    await validResource(cateId);

    this._confirm(cateId);
  };

  _confirm = (cateId: string) => {
    const { doDelete, childFlag, resourceFlag } = this.props.relaxProps;
    const Prompt = RCi18n({id:'Setting.Prompt'});
    const DeleteTheCurrentCategory = RCi18n({id:'Setting.DeleteTheCurrentCategory'});
    const TheCurrentClassification = RCi18n({id:'Setting.TheCurrentClassification'});
    const ContinueToDelete = RCi18n({id:'Setting.ContinueToDelete'});
    const Cancel = RCi18n({id:'Setting.Cancel'});
    const deleteThisCategory = RCi18n({id:'Setting.deleteThisCategory'});

    if (childFlag) {
      //有子分类
      confirm({
        title: Prompt,
        content: DeleteTheCurrentCategory,
        onOk() {
          if (resourceFlag) {
            //该分类下有素材
            confirm({
              title: Prompt,
              content: TheCurrentClassification,
              onOk() {
                doDelete(cateId);
              },
              okText: ContinueToDelete,
              cancelText: Cancel
            });
          } else {
            doDelete(cateId);
          }
        }
      });
    } else if (resourceFlag) {
      //该分类下有素材
      confirm({
        title: Prompt,
        content: TheCurrentClassification,
        onOk() {
          doDelete(cateId);
        },
        okText: ContinueToDelete,
        cancelText: Cancel
      });
    } else {
      //没有子分类
      confirm({
        title: Prompt,
        content: deleteThisCategory,
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

export default injectIntl(CateList);
