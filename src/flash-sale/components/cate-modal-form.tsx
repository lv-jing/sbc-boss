import * as React from 'react';
import { Form, Input } from 'antd';
import { QMMethod } from 'qmkit';
import { Map } from 'immutable';
import { IMap } from 'typings/globalType';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

export default class CateModalForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      formData: IMap;
      modalVisible: boolean;
      editCateFormData: Function;
    };
    form;
  };

  render() {
    const { formData } = this.props.relaxProps;
    const cateName = formData.get('cateName'); //分类名称
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form">
        <FormItem {...formItemLayout} label="分类名称" hasFeedback>
          {getFieldDecorator('cateName', {
            rules: [
              { required: true, whitespace: true, message: '请输入分类名称' },
              { max: 5, message: '最多5字符' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '分类名称');
                }
              }
            ],
            initialValue: cateName,
            onChange: this._changeCateName
          })(<Input placeholder="请输入分类名称" />)}
        </FormItem>
      </Form>
    );
  }

  /**
   * 修改分类名称
   */
  _changeCateName = (e) => {
    const { editCateFormData } = this.props.relaxProps;
    editCateFormData(Map({ cateName: e.target.value }));
  };
}
