import React from 'react';
import { Relax } from 'plume2';
import { Button, Form, Input, Select, Row, Col } from 'antd';
import { noop, SelectGroup } from 'qmkit';
import { List } from 'immutable';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      onFormChange: Function;
      onSearch: Function;
      roles: List<any>;
      // searchForm: Map<string, any>
    };
  };

  static relaxProps = {
    onFormChange: noop,
    onSearch: noop,
    roles: 'roles'
    // searchForm: 'searchForm'
  };

  render() {
    const { onFormChange, onSearch, roles } = this.props.relaxProps;

    return (
      <Form className='filter-content' layout='inline'>
        <Row>
          <Col span={8}>
            <FormItem>
              <Input
                addonBefore={<p style={{width:108}}><FormattedMessage id="Setting.EmployeeName" /></p>}
                style={{width:300}}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  onFormChange({
                    field: 'userName',
                    value
                  });
                }}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              <Input
                addonBefore={<p style={{width:108}}><FormattedMessage id="Setting.EmployeePhone" /></p>}
                style={{width:300}}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  onFormChange({
                    field: 'userPhone',
                    value
                  });
                }}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              <Input
                addonBefore={<p style={{width:108}}><FormattedMessage id="Setting.JobNumber" /></p>}
                style={{width:300}}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  onFormChange({
                    field: 'jobNo',
                    value
                  });
                }}
              />
            </FormItem>
          </Col>

        {/* <FormItem>
          <Input
            addonBefore="部门"
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'departmentIds',
                value
              });
            }}
          />
        </FormItem> */}

        {/* <FormItem>
          <Input
            addonBefore="账户名称"
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'accountName',
                value
              });
            }}
          />
        </FormItem> */}
          <Col span={8}>
            <FormItem>
              <SelectGroup
                label={<p style={{width:108}}><FormattedMessage id="Setting.Role" /></p>}
                mode='multiple'
                showSearch
                getPopupContainer={() => document.getElementById('page-content')}
                style={{ width: 170 }}
                onChange={(e) => {
                  onFormChange({
                    field: 'roleIds',
                    value: e
                  });
                }}
              >
                {this._renderOption(roles)}
              </SelectGroup>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              <SelectGroup
                getPopupContainer={() => document.getElementById('page-content')}
                label={<p style={{width:108}}><FormattedMessage id="Setting.state" /></p>}
                style={{ width: 170 }}
                defaultValue={null}
                onChange={(e) => {
                  onFormChange({
                    field: 'accountState',
                    value: e
                  });
                }}
              >
                <Option value={null} key={null}>
                  {'All'}
                </Option>
                <Option value={'0'}>Normal</Option>
                <Option value={'1'}>Deactivate</Option>
                <Option value={'2'}>Quit</Option>
              </SelectGroup>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              <SelectGroup
                getPopupContainer={() => document.getElementById('page-content')}
                label={<p style={{width:108}}><FormattedMessage id="Setting.Supervisor" /></p>}
                style={{ width: 170 }}
                defaultValue={''}
                onChange={(value) => {
                  onFormChange({
                    field: 'isLeader',
                    value
                  });
                }}
              >
                <Option value=''>All</Option>
                <Option value='1'>Yes</Option>
                <Option value='0'>No</Option>
              </SelectGroup>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              <SelectGroup
                getPopupContainer={() => document.getElementById('page-content')}
                label={<p style={{width:108}}><FormattedMessage id="Setting.isEmployee" /></p>}
                style={{ width: 170 }}
                defaultValue={''}
                onChange={(value) => {
                  onFormChange({
                    field: 'isEmployee',
                    value
                  });
                }}
              >
                <Option value=''>All</Option>
                <Option value='0'>Yes</Option>
                <Option value='1'>No</Option>
              </SelectGroup>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              <SelectGroup
                getPopupContainer={() => document.getElementById('page-content')}
                label={<p style={{width:108}}><FormattedMessage id="Setting.becomeMember" /></p>}
                style={{ width: 170 }}
                defaultValue={''}
                onChange={(value) => {
                  onFormChange({
                    field: 'becomeMember',
                    value
                  });
                }}
              >
                <Option value=''>All</Option>
                <Option value='1'>Yes</Option>
                <Option value='0'>No</Option>
              </SelectGroup>
            </FormItem>
          </Col>
          <Col span={24} style={{textAlign:'center'}}>
            <FormItem>
              <Button
                icon="search"
                type='primary'
                onClick={() => onSearch()}
                htmlType='submit'
              >
                {<FormattedMessage id="Setting.search" />}
              </Button>
            </FormItem>
          </Col>
        </Row>
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
        <Option value={option.get('roleInfoId')} key={option.get('roleInfoId')}>
          {option.get('roleName')}
        </Option>
      );
    });
  }
}
