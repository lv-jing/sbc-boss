import React from 'react';
import PropTypes from 'prop-types';
import { Store } from 'plume2';
import { Form, Input, Select, Radio, Switch, DatePicker, TreeSelect } from 'antd';
import { List } from 'immutable';
import { Const } from 'qmkit';
import moment from 'moment';
import Checkbox from 'antd/lib/checkbox/Checkbox';

import { QMMethod, ValidConst } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const RadioGroup = Radio.Group;
const { TreeNode } = TreeSelect;
const FormItem = Form.Item;

const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    span: 4,
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    span: 20,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

export default class EditForm extends React.Component<any, any> {
  state = {
    changePassword: false,
    value: undefined
  };

  _store: Store;

  accountPassword;

  accountPasswordConfirm;
  accountName;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const _state = this._store.state();
    const roles = _state.get('roles');
    //管理部门的账号集合
    const manageDepartmentIdList = _state.get('manageDepartmentIdList');
    const isMaster = _state.get('isMaster');
    //扁平化roles,获取roleIds集合
    const roleIds = roles.map(role => {
      return role.get('roleInfoId');
    });
    const employeeForm = _state.get('employeeForm');
    //部门树
    const departTree = _state.get('departTree');
    let employeeName = {};
    let employeeMobile = {};
    //邮箱
    let email = {};
    let jobNo = {};
    let position = {};
    let birthday = {};
    let sex = {
      initialValue: 0
    };
    let departmentIdList = {};

    let roleIdList = {};
    let isEmployee = {};
    //表单控件是否禁用
    const editDisable = _state.get('editDisable') && _state.get('edit');

    //如果是编辑状态
    if (_state.get('edit')) {
      employeeName = {
        initialValue: employeeForm.get('employeeName')
      };

      employeeMobile = {
        initialValue: employeeForm.get('employeeMobile')
      };

      email = {
        initialValue: employeeForm.get('email')
      };

      jobNo = {
        initialValue: employeeForm.get('jobNo')
      };

      position = {
        initialValue: employeeForm.get('position')
      };

      birthday = {
        initialValue: employeeForm.get('birthday') ? moment(employeeForm.get('birthday')) : null
      };

      departmentIdList = {
        initialValue: employeeForm.get('departmentIds') ?
          isMaster == 0 ?
            employeeForm.get('departmentIds').split(',').filter(v => manageDepartmentIdList.toJS().includes(v)) :
            employeeForm.get('departmentIds').split(',') : []
      };

      sex = {
        initialValue: employeeForm.get('sex') || 0
      };

      isEmployee = {
        initialValue: employeeForm.get('isEmployee')
      };

      //取最新的roleIds集合与该员工下面挂的roleIds的交集，防止有的角色已经删除仍然显示的情况
      roleIdList = {
        initialValue: employeeForm.get('roleIds')
          ? employeeForm.get('roleIds').split(',').reduce((pre, cur) => {
            let current = Number(cur);
            if (roleIds.toJS().includes(current)) {
              pre.push(cur);
            }
            return pre;
          }, [])
          : []
      };
    }

    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id='Setting.EmployeeName' />}
          hasFeedback
        >
          {getFieldDecorator('employeeName', {
            ...employeeName,
            rules: [
              {
                required: true,
                whitespace: true,
                message: 'Please fill in the employee\'s name'
              },
              {
                min: 1,
                max: 20,
                message: '1-20 characters'
              }
              // {
              //   validator: (rule, value, callback) => {
              //     QMMethod.validatorTrimMinAndMax(
              //       rule,
              //       value,
              //       callback,
              //       '员工姓名',
              //       1,
              //       20
              //     );
              //   }
              // }
            ]
          })(<Input disabled={editDisable} placeholder='1-20 characters only' />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id='Setting.Mailbox' />}
          hasFeedback
          required={true}
        >
          {getFieldDecorator('email', {
            ...email,
            rules: [
              { required: true, message: 'Mainbox cannot be empty' },
              { pattern: ValidConst.email, message: 'Please enter the correct mailbox' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorMinAndMax(
                    rule,
                    value,
                    callback,
                    'Mailbox',
                    0,
                    50
                  );
                }
              }
            ]
          })(<Input disabled={editDisable} placeholder='0-50 characters only' />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id='Setting.EmployeePhone' />}
        >
          {getFieldDecorator('employeeMobile', {
            ...employeeMobile,
            rules: [
              //{ pattern: ValidConst.phone, message: 'Please enter the correct mobile phone number' }
            ]
          })(<Input disabled={editDisable} placeholder='Employee phone' />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id='Setting.JobNumber' />}
        >
          {getFieldDecorator('jobNo', {
            ...jobNo,
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorMinAndMax(
                    rule,
                    value,
                    callback,
                    'JobNumber',
                    0,
                    20
                  );
                }
              }
            ]
          })(<Input disabled={editDisable} placeholder='0-20 characters only' />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id='Setting.Post' />}
        >
          {getFieldDecorator('position', {
            ...position,
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorMinAndMax(
                    rule,
                    value,
                    callback,
                    'Post',
                    0,
                    20
                  );
                }
              }
            ]
          })(<Input disabled={editDisable} placeholder='0-20 characters only' />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id='Setting.birthday' />}
        >
          {getFieldDecorator('birthday', {
            ...birthday
          })(
            <DatePicker
              disabled={editDisable}
              getCalendarContainer={() =>
                document.getElementById('page-content')
              }
              allowClear={true}
              format={Const.DAY_FORMAT}
              placeholder={'birthday'}
            />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id='Setting.sex' />}
        >
          {getFieldDecorator('sex', {
            ...sex
          })(
            <RadioGroup
              disabled={editDisable}
              //onChange={(e) => console.log(e.target.value)}
            >
              <Radio value={0}>
                <span style={styles.darkColor}>secrecy</span>
              </Radio>
              <Radio value={1}>
                <span style={styles.darkColor}>male</span>
              </Radio>
              <Radio value={2}>
                <span style={styles.darkColor}>women</span>
              </Radio>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id='Setting.BelongingDepartment' />}
        >
          {getFieldDecorator('departmentIdList', {
            ...departmentIdList
          })(
            <TreeSelect
              disabled={editDisable || (isMaster == 0 && manageDepartmentIdList.size == 0)}
              showSearch
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 550, overflow: 'auto' }}
              placeholder='Please select more than one'
              allowClear
              multiple
              treeDefaultExpandAll
              onChange={this.onChange}
            >
              {this._loop(departTree)}
            </TreeSelect>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label={<FormattedMessage id='Setting.SystemRole' />} hasFeedback>
          {getFieldDecorator('roleIdList', {
            ...roleIdList
          })(
            <Select
              placeholder='Please select more than one'
              disabled={editDisable}
              mode='multiple'
              showSearch
              filterOption={(input, option: { props }) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {this._renderOption(roles)}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={<FormattedMessage id='Setting.isEmployee' />}>
          {getFieldDecorator('isEmployee', {
            ...isEmployee,
            rules: [{ required: true, message: 'Please select whether you are a salesman' }]
          })(
            <RadioGroup disabled={editDisable}>
              <Radio value={0}>Yes</Radio>
              <Radio value={1}>No</Radio>
            </RadioGroup>
          )}
        </FormItem>
        {
          _state.get('edit') ?
            null :
            <FormItem {...formItemLayout} colon={false} label=' '>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                {getFieldDecorator('isSendPassword', {
                  valuePropName: 'checked'
                })(
                  <Checkbox>{<FormattedMessage id='Setting.NotifySMS' />}</Checkbox>
                )}
              </div>
            </FormItem>
        }

      </Form>
    );
  }

  /**
   * 系统角色
   * @param roles
   * @returns {Iterable<number, any>}
   * @private
   */
  _renderOption(roles: List<any>) {
    return roles.map((option) => {
      return (
        <Option
          value={option.get('roleInfoId').toString()}
          key={option.get('roleInfoId')}
        >
          {option.get('roleName')}
        </Option>
      );
    });
  }

  checkConfirmPassword = (_rule, value, callback) => {
    if (value != this.props.form.getFieldValue('accountPassword')) {
      callback(new Error('Duplicate passwords are inconsistent'));
      return;
    }

    callback();
  };

  onChange = (ids, value) => {
    this.setState({ value: value });
    //存放目标部门IDlist
    // const { setTargetDeparts } = this.props.relaxProps;
    // setTargetDeparts(ids)
  };


  _loop = (allDeparts) => {
    const _state = this._store.state();
    const manageDepartmentIdList = _state.get('manageDepartmentIdList');
    //是否为主账号
    const isMaster = _state.get('isMaster');
    return allDeparts.map((dep) => {
      //子部门
      if (dep.get('children') && dep.get('children').size > 0) {
        const childDeparts = dep.get('children');
        return (
          <TreeNode
            key={dep.get('departmentId')}
            disabled={isMaster == 0 && !manageDepartmentIdList.toJS().includes(dep.get('departmentId'))}
            value={dep.get('departmentId')}
            title={dep.get('departmentName')}
          >
            {this._loop(childDeparts)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={dep.get('departmentId')}
          disabled={isMaster == 0 && !manageDepartmentIdList.toJS().includes(dep.get('departmentId'))}
          value={dep.get('departmentId')}
          title={dep.get('departmentName')}
        />
      );
    });
  };
}

const styles = {
  darkColor: {
    fontSize: 12,
    color: '#333'
  }
};

