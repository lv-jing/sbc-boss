import * as React from 'react';
import { Input, Form } from 'antd';
const FormItem = Form.Item;

export default class DetailCell extends React.Component<any, any> {
  _handleChange = (e) => {
    const value = e.target.value;
    this.setState({});
    this._check(value);
  };

  _check = (value) => {
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  render() {
    const { value, column } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="editable-cell">
        <div className="editable-cell-input-wrapper">
          {column == 'sort' ? (
            <FormItem>
              {getFieldDecorator(this.props.detaiId + 'sort', {
                initialValue: value,
                rules: [
                  { required: true, message: '请填写排序' },
                  {
                    pattern: /^(0|([1-9]\d{0,2}))$/,
                    message: '限0-999整数'
                  }
                ]
              })(<Input onChange={this._handleChange} />)}
            </FormItem>
          ) : null}
          {column == 'detailName' ? (
            <FormItem>
              {getFieldDecorator(this.props.detaiId + 'detailName', {
                initialValue: value,
                rules: [
                  { required: true, whitespace: true, message: '请填写属性值' },
                  { max: 225, message: '属性值仅限1-20位字符' }
                ]
              })(<Input onChange={this._handleChange} />)}
            </FormItem>
          ) : null}
        </div>
      </div>
    );
  }
}
