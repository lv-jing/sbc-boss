import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  message,
  Switch,
  Table,
  Row,
  Col
} from 'antd';

import * as webapi from './../webapi';
import { history, Const } from 'qmkit';

const FormItem = Form.Item;
const Option = Select.Option;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

class DictionaryForm extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      dictionaryForm: {
        id: '',
        name: '',
        type: '',
        description: '',
        value: '',
        valueEn: '',
        enabled: 0,
        priority: 0,
        parentId: ''
      },
      countryArr: [],
      isCity: false
    };
    this.getDetail = this.getDetail.bind(this);

    if (this.props.id) {
      this.getDetail(this.props.id);
    }
  }
  componentDidMount() {
    if (!this.props.id) {
      this.props.form.setFieldsValue({
        priority: 0
      });
    }
    this.querySysDictionary('country');
  }
  getDetail = async (id) => {
    const { res } = await webapi.getDictionaryDetails({
      id: id
    });
    if (res.code === Const.SUCCESS_CODE) {
      let response = res.context.sysDictionaryVO;
      let dictionaryForm = {
        id: response.id,
        name: response.name,
        type: response.type,
        description: response.description,
        value: response.value,
        valueEn: response.valueEn,
        priority: response.priority,
        enabled: response.enabled,
        parentId: response.parentId
      };
      let isCity = false;
      if (dictionaryForm.type.toLowerCase() === 'city') {
        isCity = true;
      }
      this.setState({
        dictionaryForm: dictionaryForm,
        isCity: isCity
      });
      this.props.form.setFieldsValue({
        id: response.id,
        name: response.name,
        type: response.type,
        description: response.description,
        value: response.value,
        valueEn: response.valueEn,
        priority: response.priority,
        enabled: response.enabled === 0 ? true : false,
        parentId: response.parentId
      });
    }
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        if (this.props.pageType === 'create') {
          this.onCreate();
        }
        if (this.props.pageType === 'edit') {
          this.onUpdate();
        }
      }
    });
  };
  onFormChange = ({ field, value }) => {
    let { isCity } = this.state;
    let data = this.state.dictionaryForm;
    if (field === 'enabled') {
      value = value ? 0 : 1;
    }
    if (field === 'type') {
      if (value.toLowerCase() === 'city') {
        isCity = true;
      } else {
        isCity = false;
      }
    }
    data[field] = value;
    this.setState({
      dictionaryForm: data,
      isCity: isCity
    });
  };
  onCreate = async () => {
    const dictionaryForm = this.state.dictionaryForm;
    const { res } = await webapi.addDictionary({
      ...dictionaryForm
    });
    if (res.code === Const.SUCCESS_CODE) {
      message.success('Operate successfully');
      history.push('/dictionary');
    }
  };
  onUpdate = async () => {
    let dictionaryForm = this.state.dictionaryForm;
    dictionaryForm.id = this.props.id;
    const { res } = await webapi.updateDictionary({
      ...dictionaryForm
    });
    if (res.code === Const.SUCCESS_CODE) {
      message.success('Operate successfully');
      history.push('/dictionary');
    }
  };

  querySysDictionary = (type: String) => {
    webapi
      .querySysDictionary({
        type: type
      })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            countryArr: res.context.sysDictionaryVOS
          });
        }
      })
      .catch((err) => {});
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form {...layout} style={{ width: '600px' }} onSubmit={this.handleSubmit}>
        <FormItem label="Name">
          {getFieldDecorator('name', {
            rules: [
              { required: true, message: 'Please input Dictionary Name!' },
              { max: 200, message: 'Exceed maximum length!' }
            ]
          })(
            <Input
              onChange={(e) => {
                const value = (e.target as any).value;
                this.onFormChange({
                  field: 'name',
                  value
                });
              }}
            />
          )}
        </FormItem>
        <FormItem label="Type">
          {getFieldDecorator('type', {
            rules: [
              { required: true, message: 'Please select Dictionary Type' },
              { max: 200, message: 'Exceed maximum length!' }
            ]
          })(
            <Input
              onChange={(e) => {
                const value = (e.target as any).value;
                this.onFormChange({
                  field: 'type',
                  value
                });
              }}
            />
          )}
        </FormItem>
        <FormItem label="Value">
          {getFieldDecorator('valueEn', {
            rules: [
              {
                required: true,
                message: 'Please input Value!'
              },
              { max: 200, message: 'Exceed maximum length!' }
            ]
          })(
            <Input
              onChange={(e) => {
                const value = (e.target as any).value;
                this.onFormChange({
                  field: 'valueEn',
                  value
                });
              }}
            />
          )}
        </FormItem>
        {this.state.isCity ? (
          <FormItem label="Country">
            {getFieldDecorator(
              'parentId',
              {}
            )(
              <Select
                onChange={(value) => {
                  value = value === '' ? null : value;
                  this.onFormChange({
                    field: 'parentId',
                    value
                  });
                }}
              >
                {this.state.countryArr
                  ? this.state.countryArr.map((item) => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))
                  : null}
              </Select>
            )}
          </FormItem>
        ) : null}

        <FormItem label="Description">
          {getFieldDecorator('description', {
            rules: [{ max: 200, message: 'Exceed maximum length!' }]
          })(
            <Input.TextArea
              onChange={(e) => {
                const value = (e.target as any).value;
                this.onFormChange({
                  field: 'description',
                  value
                });
              }}
            />
          )}
        </FormItem>
        <FormItem label="Priority">
          {getFieldDecorator(
            'priority',
            {}
          )(
            <InputNumber
              min={0}
              onChange={(value) => {
                this.onFormChange({
                  field: 'priority',
                  value
                });
              }}
            />
          )}
        </FormItem>
        <FormItem label="Enabled">
          {getFieldDecorator(
            'enabled',
            {}
          )(
            // <InputNumber
            //   min={0}
            //   onChange={(value) => {
            //     this.onFormChange({
            //       field: 'priority',
            //       value
            //     });
            //   }}
            // />
            <Switch
              checked={this.state.dictionaryForm.enabled === 0 ? true : false}
              onChange={(value) => {
                this.onFormChange({
                  field: 'enabled',
                  value
                });
              }}
            />
          )}
        </FormItem>
        <FormItem wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          {this.props.pageType === 'edit' ? (
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          ) : (
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          )}
          <Button style={{ marginLeft: '20px' }}>
            <Link to="/dictionary">Back List</Link>
          </Button>
        </FormItem>
      </Form>
    );
  }
}
export default Form.create()(DictionaryForm);
