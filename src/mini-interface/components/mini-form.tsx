import React from 'react';
import { Form, Input,Radio } from 'antd';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Store } from 'plume2';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};
const FormDiv = styled.div`
  font-size: 12px;
  .title {
    font-size: 14px;
    color: #333;
    margin-bottom: 15px;
    margin-top:15px;
  }
  .upload-tip {
    position: absolute;
    top: 0;
    right: 34px;
    color: #999;
  }
  .app-main {
    font-size: 14px;
    color: #999;
  }
`;

export default class MiniForm extends React.Component<any, any> {
  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const store = this._store;
    const miniProgramSet = store.state().get('miniProgramSet');
    const changeWxFormValue = (this._store as any).changeWxFormValue;
    const { getFieldDecorator } = this.props.form;    
    //const mobileRequired = miniProgramSet.get('mobileServerStatus') == 1;
    //const pcRequired = miniProgramSet.get('pcServerStatus') == 1;

    return (
      <FormDiv>
        <Form className="login-form">
          <p className="title">小程序参数</p>
          <FormItem
            {...formItemLayout}
            label="小程序App ID:"
            required={true}
          >
            {getFieldDecorator('appId', {
              initialValue: miniProgramSet.get('appId'),
              rules: [
                { required: true, message: '请填写小程序App ID' },
                { max: 50, message: '最多50个字符' }
              ]
            })(
              <Input
                onChange={(e) =>
                  changeWxFormValue('appId', (e as any).target.value)
                }
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="小程序App Secret"
            required={true}
          >
            {getFieldDecorator('appSecret', {
              initialValue: miniProgramSet.get('appSecret'),
              rules: [
                {
                  required: true,
                  message: '请填写AppSecret'
                },
                { max: 50, message: '最多50个字符' }
              ]
            })(
              <Input
                onChange={(e) =>
                  changeWxFormValue('appSecret', (e as any).target.value)
                }
              />
            )}
          </FormItem>      
          <FormItem {...formItemLayout} label="是否开启" required>
          {getFieldDecorator('status', {
            initialValue:miniProgramSet.size>0? miniProgramSet.get('status'):0,            
          })(
            <RadioGroup 
            onChange={(e)=>changeWxFormValue('status', (e as any).target.value)} >
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </RadioGroup>
          )}
        </FormItem>    
        </Form>
      </FormDiv>
    );
  }
}
