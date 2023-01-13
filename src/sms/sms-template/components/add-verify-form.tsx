import React from 'react';
import { Form, Input, Button, Row, Col, Select } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    lg: { span: 2 }
  },
  wrapperCol: {
    lg: { span: 14 }
  }
};

const smallFormItemLayout = {
  labelCol: {
    lg: { span: 2 }
  },
  wrapperCol: {
    lg: { span: 4 }
  }
};

export default class AddVerifyForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      templateName: '',
      templateContent: '',
      remark: '',
      signId: null,
      businessType: null,
      flag: false
    };
  }
  componentWillReceiveProps() {
    const data = this.props.verifyFormData;
    const businessType = data.get('businessType');
    const templateName = data.get('templateName');
    const templateContent = data.get('templateContent');
    const remark = data.get('remark');
    const signId = data.get('signId');
    if (!this.state.flag && templateName) {
      this.setState({
        businessType,
        signId,
        remark: remark || '',
        templateName: templateName || '',
        templateContent: templateContent || '',
        flag: true
      });
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
      verifyFormData,
      smsPurposeList,
      passedSignList
    } = this.props;
    const data = verifyFormData;
    const businessType = data.get('businessType');
    const templateName = data.get('templateName');
    const templateContent = data.get('templateContent');
    const remark = data.get('remark');
    const signId = data.get('signId');

    return (
      <Form className="sms-form">
        <FormItem label="验证码用途" {...formItemLayout}>
          {getFieldDecorator('businessType', {
            initialValue: businessType,
            rules: [{ required: true, message: '请选择验证码用途' }]
          })(
            <Select dropdownStyle={{ zIndex: 1053 }}>
              <Option value={null}>请选择</Option>
              {smsPurposeList.toJS().map((item) => {
                return (
                  <Option key={item.businessType} value={item.businessType}>
                    {item.purpose}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem label="模板名称" {...formItemLayout}>
          {getFieldDecorator('templateName', {
            initialValue: templateName,
            rules: [
              { required: true, whitespace: true, message: '请输入模板名称' },
              { min: 1, max: 30, message: '仅限1-30位字符' }
            ]
          })(
            <Input
              placeholder="请输入模板名称，不超过30字符"
              onChange={(e) => {
                this.setState({ templateName: e.target.value });
              }}
              suffix={`${this.state.templateName.length}/30`}
            />
          )}
        </FormItem>
        <FormItem
          label="短信内容"
          {...smallFormItemLayout}
          className="choose-sign"
        >
          {getFieldDecorator('signId', {
            initialValue: signId ? signId : undefined,
            rules: [{ required: true, message: '请选择签名' }]
          })(
            <Select dropdownStyle={{ zIndex: 1053 }}>
              {passedSignList.toJS().map((item) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.smsSignName}
                  </Option>
                );
              })}
              <Option key="add-signature" disabled={true}>
                <a href={'/add-signature'} target="_blank" className="add-link">
                  新增签名
                </a>
              </Option>
            </Select>
          )}
        </FormItem>
        <Row>
          <Col lg={14} push={2}>
            <FormItem>
              {getFieldDecorator('templateContent', {
                initialValue: templateContent,
                rules: [
                  {
                    required: true,
                    message: '请输入短信内容'
                  },
                  { min: 1, max: 500, message: '仅限1-500位字符' },
                  {
                    pattern: /^[0-9a-zA-Z\u4E00-\u9FA5`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、\s]*$/,
                    message: '不支持【】、★、 ※、 →、 ●等特殊符号'
                  }
                ]
              })(
                <TextArea
                  rows={5}
                  maxLength={500}
                  onChange={(e) => {
                    this.setState({ templateContent: e.target.value });
                  }}
                  placeholder="请输入短信内容，不超过500字符，不支持【】、★、 ※、 →、 ●等特殊符号；"
                />
              )}
            </FormItem>
            <span className="suffix">
              {this.state.templateContent.length}/500
            </span>
          </Col>
        </Row>
        <Row>
          <Col lg={14} push={2}>
            <div className="inline-info">
              <p className="word-number">
                已输入 {this.state.templateContent.length} 字(含签名后缀)，按{' '}
                {this.getLength()}
                条计费
              </p>
            </div>
          </Col>
        </Row>
        <div className="remark">
          <FormItem label="申请说明" {...formItemLayout}>
            {getFieldDecorator('remark', {
              initialValue: remark,
              rules: [
                { required: true, whitespace: true, message: '请输入申请说明' },
                { min: 1, max: 100, message: '仅限1-100位字符' }
              ]
            })(
              <TextArea
                rows={3}
                onChange={(e) => {
                  this.setState({
                    remark: e.target.value
                  });
                }}
                placeholder="请描述您的业务使用场景，不超过100字符；如：用于双十一大促营销"
              />
            )}
          </FormItem>
          <span className="remark-suffix">
            {this.state.remark ? this.state.remark.length : 0}/100
          </span>
        </div>
        <Button
          className="save-btn"
          type="primary"
          onClick={() => {
            this._handleSave();
          }}
        >
          保存
        </Button>
      </Form>
    );
  }

  _handleSave = () => {
    const form = this.props.form;
    form.validateFields(null, async (errs, value) => {
      if (!errs) {
        // 验证通过，保存
        await this.props.saveTemplate(value);
        // form.resetFields();
        // this.setState({
        //   templateName: '',
        //   templateContent: '',
        //   remark: '',
        //   signId: null,
        //   businessType: null,
        //   flag: false
        // });
      }
    });
  };

  getLength = () => {
    let len = this.state.templateContent.length;
    if (len <= 70) {
      return 1;
    } else {
      return Math.ceil(len / 67);
    }
  };
}
