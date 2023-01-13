import React from 'react';
import { Relax } from 'plume2';
import { noop, history, SelectGroup } from 'qmkit';
import { createForm } from 'rc-form';
import { Tabs, Form, Button, Select, Input } from 'antd';
import TemplateList from './template-list';
const { TabPane } = Tabs;
const FormItem = Form.Item;
const { Option } = Select;
const OPTS = [
  {
    key: 0,
    value: '待审核'
  },
  {
    key: 1,
    value: '审核通过'
  },
  {
    key: 2,
    value: '审核未通过'
  },
  {
    key: 3,
    value: '待提交'
  }
];

class TemplateForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      templateCode: '',
      templateName: '',
      reviewStatus: null
    };
  }
  render() {
    return (
      <Form layout="inline">
        <FormItem>
          <Input
            addonBefore="模板code"
            value={this.state.templateCode}
            onChange={(e) => {
              this.setState({
                templateCode: e.target.value
              });
            }}
          />
        </FormItem>
        <FormItem>
          <Input
            addonBefore="模板名称"
            value={this.state.templateName}
            onChange={(e) => {
              this.setState({
                templateName: e.target.value
              });
            }}
          />
        </FormItem>
        <FormItem>
          <SelectGroup
            label="模板状态"
            defaultValue={null}
            dropdownStyle={{ zIndex: 1053 }}
            onChange={(value) => {
              this.setState({
                reviewStatus: value
              });
            }}
          >
            <Option value={null}>全部</Option>
            {OPTS.map((v) => (
              <Option key={v.key} value={v.key}>
                {v.value}
              </Option>
            ))}
          </SelectGroup>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            icon="search"
            className="btn"
            onClick={this._searchTemplate}
          >
            搜索
          </Button>
        </FormItem>
        <FormItem>
          <Button
            className="btn"
            onClick={() => {
              this.props.syncTemplate();
            }}
          >
            同步模板状态
          </Button>
        </FormItem>
        <FormItem>
          <Button className="btn" onClick={this._showSyncModal}>
            同步历史模板
          </Button>
        </FormItem>
      </Form>
    );
  }

  _showSyncModal = () => {
    this.props.setData('syncType', 1);
    this.props.setData('syncModalVisible', true);
  };

  _searchTemplate = () => {
    const { templateCode, templateName, reviewStatus } = this.state;
    this.props.getTemplateList(templateCode, templateName, reviewStatus);
  };
}

const WrappedTemplateForm = createForm()(TemplateForm);

@Relax
export default class SMSTemplate extends React.Component<any, any> {
  _form;
  props: {
    type: string;
    relaxProps?: {
      total: number;
      pageNum: number;
      pageSize: number;
      setData: Function;
      getTemplateList: Function;
      changeTab: Function;
      syncTemplate: Function;
    };
  };

  static relaxProps = {
    total: 'total',
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    templateType: 'templateType',
    setData: noop,
    getTemplateList: noop,
    changeTab: noop,
    syncTemplate: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      flag: false
    };
  }

  componentWillReceiveProps() {
    if (!this.state.flag && this.props.type) {
      this.props.relaxProps.changeTab(+this.props.type);
      this.setState({
        flag: true
      });
    }
  }

  render() {
    const { changeTab } = this.props.relaxProps;
    return (
      <div className="sms-template">
        <div className="form">
          <WrappedTemplateForm
            wrappedComponentRef={(inst) => (this._form = inst)}
            {...this.props.relaxProps}
          />
        </div>
        <Tabs
          defaultActiveKey={'' + this.props.type}
          onChange={(value) => {
            changeTab(value);
            this._form.setState({
              templateCode: '',
              templateName: '',
              reviewStatus: null
            });
          }}
        >
          <TabPane tab="营销类" key="2">
            <Button
              type="primary"
              className="margin-btn"
              onClick={() => {
                history.push({
                  pathname: '/sms-template/2'
                });
              }}
            >
              新增营销模板
            </Button>
            <TemplateList />
          </TabPane>
          <TabPane tab="通知类" key="1">
            {/*<Button*/}
            {/*type="primary"*/}
            {/*className="margin-btn"*/}
            {/*onClick={() => {*/}
            {/*history.push({*/}
            {/*pathname: '/sms-template/1'*/}
            {/*});*/}
            {/*}}*/}
            {/*>*/}
            {/*新增通知模板*/}
            {/*</Button>*/}
            {/*<Button*/}
            {/*className="btn mag-left"*/}
            {/*onClick={() => {*/}
            {/*this.props.relaxProps.syncTemplate();*/}
            {/*}}*/}
            {/*>*/}
            {/*同步模板状态*/}
            {/*</Button>*/}
            <TemplateList />
          </TabPane>
          <TabPane tab="验证码类" key="0">
            <Button
              type="primary"
              className="margin-btn"
              onClick={() => {
                history.push({
                  pathname: '/sms-template/0'
                });
              }}
            >
              新增验证码模板
            </Button>
            <TemplateList />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
