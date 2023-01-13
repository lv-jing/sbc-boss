import * as React from 'react';
import { Link } from 'react-router-dom';
import { Relax, IMap } from 'plume2';
import { Map } from 'immutable';
import { Button } from 'antd';
import { AuthWrapper, noop } from 'qmkit';
import { FormattedMessage } from 'react-intl';

@Relax
export default class Tool extends React.Component<any, any> {
  props: {
    relaxProps?: {
      departments: IMap;

      modal: Function;
      showEditModal: Function;
    };
  };

  static relaxProps = {
    // 父子结构的平台分类
    departments: 'departments',

    // 展示关闭弹框
    modal: noop,
    showEditModal: noop
  };

  render() {
    const { departments } = this.props.relaxProps;
    return (
      <div className="handle-bar">
        <Button type="primary" onClick={this._showCateModal}>
          <FormattedMessage id="Setting.New1" />
        </Button>
        {departments.count() === 0 ? (
          <Link to="/department-import">
            <Button type="primary">
              <FormattedMessage id="Setting.BatchDepartment" />
            </Button>
          </Link>
        ) : (
          <Button disabled={true} type="primary">
            <FormattedMessage id="Setting.BatchDepartment" />
          </Button>
        )}
      </div>
    );
  }

  /**
   * 显示一级分类弹框
   */
  _showCateModal = () => {
    const { showEditModal } = this.props.relaxProps;
    let departmentName = '';
    let parentDepartmentId = '';
    let departmentId = '';
    let department = Map({
      departmentId,
      departmentName,
      parentDepartmentId
    });
    showEditModal(department, true);
  };
}
