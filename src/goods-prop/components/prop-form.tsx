import React from 'react';
import { Form, Input } from 'antd';
import { IMap, IList } from 'typings/globalType';
import DetailList from './detail-list';
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
};

export default class propForm extends React.Component<any, any> {
  props: {
    form?: any;
    history?: any;
    onFormFieldChange?: Function;
    propName?: string;
    oneProp: IMap;
    deleteList: IList;
    initDetailList: Function;
    deleteDetail: Function;
  };

  render() {
    const { propName } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form className="filter-content" layout="horizontal">
          <FormItem
            label="属性名称"
            labelCol={formItemLayout.labelCol}
            wrapperCol={formItemLayout.wrapperCol}
          >
            {getFieldDecorator('propName', {
              initialValue: propName,
              onChange: this._changePropName,
              rules: [
                { required: true, whitespace: true, message: '请填写属性名称' },
                { max: 225, message: '属性名称仅限1-225位字符' }
              ]
            })(<Input placeholder="请输入属性名称" />)}
          </FormItem>
          <FormItem
            label="属性值"
            labelCol={formItemLayout.labelCol}
            wrapperCol={formItemLayout.wrapperCol}
          >
            <DetailList {...this.props} />
          </FormItem>
        </Form>
      </div>
    );
  }
  _changePropName = (e) => {
    const { onFormFieldChange } = this.props;
    onFormFieldChange({ key: 'propName', value: e.target.value });
  };
}
