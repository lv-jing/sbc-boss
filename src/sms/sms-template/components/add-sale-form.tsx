import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    span: 2
  },
  wrapperCol: {
    span: 14
  }
};

export default class AddSaleForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      templateName: '',
      templateContent: '',
      remark: '',
      flag: false
    };
  }
  componentWillReceiveProps() {
    const data = this.props.saleFormData;
    const templateName = data.get('templateName');
    const templateContent = data.get('templateContent');
    const remark = data.get('remark');
    if (!this.state.flag && templateName) {
      this.setState({
        templateName: templateName || '',
        templateContent: templateContent || '',
        remark: remark || '',
        flag: true
      });
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
      saleFormData
    } = this.props;

    return (
      <Form className="sms-form">
        <FormItem label="模板名称" {...formItemLayout}>
          {getFieldDecorator('templateName', {
            initialValue: saleFormData.get('templateName'),
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
        <Row>
          <Col span={2}>
            <div className="label">短信内容</div>
          </Col>
          <Col span={14}>
            <div>【短信签名】</div>
          </Col>
        </Row>
        <Row>
          <Col span={14} push={2}>
            <FormItem>
              {getFieldDecorator('templateContent', {
                initialValue: saleFormData.get('templateContent'),
                rules: [
                  {
                    required: true,
                    message: '请输入短信内容'
                  },
                  { min: 1, max: 500, message: '仅限1-500位字符' },
                  {
                    pattern: /^[0-9a-zA-Z\u4E00-\u9FA5`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”、；‘’，。、\s]*$/,
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
              {this.state.templateContent.length}/496
            </span>
          </Col>
        </Row>
        <Row>
          <Col span={14} push={2}>
            <div className="inline-info">
              <p>回T退订</p>
              <p className="word-number">
                已输入 {this.state.templateContent.length + 4}{' '}
                字(含签名后缀)，按
                {this.getLength()}
                条计费
              </p>
            </div>
          </Col>
        </Row>
        <div className="remark">
          <FormItem label="申请说明" {...formItemLayout}>
            {getFieldDecorator('remark', {
              initialValue: saleFormData.get('remark'),
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
        if (!this.props.ifEdit) {
          value.templateContent = value.templateContent + '回T退订';
        }
        await this.props.saveTemplate(value);
        // form.resetFields();
        // this.setState({
        //   templateName: '',
        //   templateContent: '',
        //   remark: ''
        // });
      }
    });
  };

  getLength = () => {
    let len = this.state.templateContent.length + 4;
    if (len <= 70) {
      return 1;
    } else {
      return Math.ceil(len / 67);
    }
  };
}
