import React from 'react';
import {
  Form,
  Input,
} from 'antd';

const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
};

let flag = false;

export default class SettingForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      androidKeyId: '',
      androidMsgSecret: '',
      androidKeySecret: '',
      iosKeyId: '',
      iosKeySecret: '',
    };
  }

  componentDidMount() {
    this.props.setData('uPushForm', this.props.form);
  }

  componentWillReceiveProps() {
    const data = this.props.uPushForm;
    const androidKeyId = data.get('androidKeyId');
    const androidMsgSecret = data.get('androidMsgSecret');
    const androidKeySecret = data.get('androidKeySecret');
    const iosKeyId = data.get('iosKeyId');
    const iosKeySecret = data.get('iosKeySecret');
    if (!flag && androidKeyId) {
      this.setState({
        androidKeyId,
        androidMsgSecret,
        androidKeySecret,
        iosKeyId,
        iosKeySecret,
      });
      flag = true;
    }
  }


  componentWillUnmount(): void {
    flag = false;
  }


  render() {
    const {
      form: { getFieldDecorator }
    } = this.props;

    const { androidKeyId, androidMsgSecret, androidKeySecret, iosKeyId, iosKeySecret } = this.state;

    return (
      <div>
        <Form className="setting-form">
          <div className="sub-title" style={{marginTop: 24}}>Android端</div>
          <Form.Item
            label={'AccessKeyId'}
            required
            {...formItemLayout}
          >
            {getFieldDecorator('androidKeyId', {
              initialValue: androidKeyId,
              rules: [
                { required: true, whitespace: true, message: '请填写AccessKeyId' },
                // { min: 1, max: 100, message: '仅限1-30位字符' }
              ]
            })(
              <Input
                placeholder="请输入"
                onChange={(e) => {
                  this.setState({ androidKeyId: e.target.value });
                }}
              />
            )}
          </Form.Item>

          <Form.Item
            label={'Umeng Message Secret'}
            required
            {...formItemLayout}
          >
            {getFieldDecorator('androidMsgSecret', {
              initialValue: androidMsgSecret,
              rules: [
                { required: true, whitespace: true, message: '请填写Umeng Message Secret' },
                // { min: 1, max: 100, message: '仅限1-30位字符' }
              ]
            })(
              <Input
                placeholder="请输入"
                onChange={(e) => {
                  this.setState({ androidMsgSecret: e.target.value });
                }}
              />
            )}
          </Form.Item>

          <Form.Item
            label={'AccessKeySecret'}
            required
            {...formItemLayout}
          >
            {getFieldDecorator('androidKeySecret', {
              initialValue: androidKeySecret,
              rules: [
                { required: true, whitespace: true, message: '请填写AccessKeySecret' },
                // { min: 1, max: 100, message: '仅限1-30位字符' }
              ]
            })(
              <Input
                placeholder="请输入"
                onChange={(e) => {
                  this.setState({ androidKeySecret: e.target.value });
                }}
              />
            )}
          </Form.Item>

          <div className="sub-title">IOS端</div>

           <Form.Item
            label={'AccessKeyId'}
            required
            {...formItemLayout}
          >
            {getFieldDecorator('iosKeyId', {
              initialValue: iosKeyId,
              rules: [
                { required: true, whitespace: true, message: '请填写AccessKeyId' },
                // { min: 1, max: 100, message: '仅限1-30位字符' }
              ]
            })(
              <Input
                placeholder="请输入"
                onChange={(e) => {
                  this.setState({ iosKeyId: e.target.value });
                }}
              />
            )}
          </Form.Item>

          <Form.Item
            label={'AccessKeySecret'}
            required
            {...formItemLayout}
          >
            {getFieldDecorator('iosKeySecret', {
              initialValue: iosKeySecret,
              rules: [
                { required: true, whitespace: true, message: '请填写AccessKeySecret' },
                // { min: 1, max: 100, message: '仅限1-30位字符' }
              ]
            })(
              <Input
                placeholder="请输入"
                onChange={(e) => {
                  this.setState({ iosKeySecret: e.target.value });
                }}
              />
            )}
          </Form.Item>
        </Form>
      </div>
    );
  }
}
