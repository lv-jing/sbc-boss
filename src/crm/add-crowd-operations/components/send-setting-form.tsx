import React from 'react';
import { Form, Input, Select, Row, Col } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    span: 10
  },
  wrapperCol: {
    span: 14
  }
};

export default class SendSettingForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      sign: '',
      template: '',
      context: '',
      smsList: ['效果预览'],
      flag: false
    };
  }

  componentDidMount() {
    this.props.setData({ formFunctions: this.props.form });
  }

  componentWillReceiveProps() {
    let planSms = this.props.planSms;
    if (!this.state.flag && planSms) {
      if (this.props.planSms.get('signName')) {
        this.setState(
          {
            context:
              '【' +
              this.props.planSms.get('signName') +
              '】' +
              this.props.planSms.get('templateContent'),
            flag: true
          },
          () => {
            this._smsList();
          }
        );
      }
    }
  }

  render() {
    const {
      form: { getFieldDecorator, setFieldsValue },
      getPassedSignList,
      passedSignList,
      salePassedTemplateList,
      getSalePassedTemplateList
    } = this.props;

    const ifModify = +this.props.ifModify;
    let signId = null;
    let templateCode = null;
    let templateContent = null;
    let signName = null;
    if (this.props.planSms !== null) {
      let planSms = this.props.planSms.toJS();
      signId = planSms.signId;
      templateCode = planSms.templateCode;
      templateContent = planSms.templateContent;
      signName = planSms.signName;
    }

    return (
      <div className="send-setting">
        <div className="left-show">
          {this.state.smsList.map((item, index) => (
            <div className="sms" key={item + index}>
              {item}
            </div>
          ))}
        </div>
        <Form className="send-form">
          <div className="inline-item">
            <FormItem
              label="短信内容"
              {...formItemLayout}
              className="choose-sign"
            >
              {getFieldDecorator('signId', {
                initialValue: signId ? signId : undefined,
                rules: [{ required: true, message: '请选择签名' }]
              })(
                <Select
                  placeholder="请选择签名"
                  disabled={!ifModify}
                  dropdownStyle={{ zIndex: 1053 }}
                  onFocus={() => {
                    getPassedSignList();
                  }}
                  //@ts-ignore
                  onSelect={(value, option: any) => {
                    this.props.form.setFieldsValue({
                      signName: option.props.title
                    });
                    this.setState(
                      {
                        sign: option.props.title,
                        context: option.props.title + this.state.template
                      },
                      () => {
                        this._smsList();
                      }
                    );
                  }}
                >
                  {passedSignList.toJS().map((item) => {
                    return (
                      <Option
                        key={item.id}
                        value={item.id}
                        title={'【' + item.smsSignName + '】'}
                      >
                        【{item.smsSignName}】
                      </Option>
                    );
                  })}
                  <Option key="add-signature" disabled={true}>
                    <a
                      href={'/add-signature'}
                      target="_blank"
                      className="add-link"
                    >
                      新增签名
                    </a>
                  </Option>
                </Select>
              )}
            </FormItem>
            <FormItem className="ant-col-14 choose-modal">
              {getFieldDecorator('templateCode', {
                initialValue: templateCode ? templateCode : undefined,
                rules: [{ required: true, message: '请选择模板' }]
              })(
                <Select
                  placeholder="请选择模板"
                  disabled={!ifModify}
                  dropdownStyle={{ zIndex: 1053 }}
                  onFocus={() => {
                    getSalePassedTemplateList();
                  }}
                  //@ts-ignore
                  onSelect={(value, option: any) => {
                    this.setState(
                      {
                        template: option.props['data-templatecontent'],
                        context:
                          this.state.sign + option.props['data-templatecontent']
                      },
                      () => {
                        this._smsList();
                        setFieldsValue({
                          templateContent: option.props['data-templatecontent']
                        });
                      }
                    );
                  }}
                >
                  {salePassedTemplateList.toJS().map((item) => {
                    return (
                      <Option
                        key={item.templateCode}
                        value={item.templateCode}
                        data-templatecontent={item.templateContent}
                      >
                        {item.templateName}
                      </Option>
                    );
                  })}
                  <Option key="add-template" disabled={true}>
                    <a
                      className="add-link"
                      href={'/sms-template/2'}
                      target="_blank"
                    >
                      新增模板
                    </a>
                  </Option>
                </Select>
              )}
            </FormItem>
          </div>
          <Row>
            <Col span={20} push={4}>
              <FormItem style={{ visibility: 'hidden', width: 0, height: 0 }}>
                {getFieldDecorator('signName', {
                  initialValue: signName
                })(<TextArea />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('templateContent', {
                  initialValue: templateContent
                })(<TextArea disabled={!ifModify} rows={4} readOnly={true} />)}
              </FormItem>
              <div className="info">
                <p className="word-number">
                  已输入 {this.state.context.length} 字(含签名后缀)，按
                  {this.props.smsNum} 条计费
                </p>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  _smsList = () => {
    let sms = this.state.context;
    if (sms.length <= 70) {
      this.props.setData({
        smsNum: 1
      });
      this.setState({
        smsList: [sms]
      });
    } else {
      let arr = [];
      let len = sms.length;
      for (let i = 0; i < Math.ceil(len / 67); i++) {
        arr.push(sms.slice(0, 67));
        sms = sms.slice(67);
      }
      this.props.setData({
        smsNum: Math.ceil(len / 67)
      });
      this.setState({
        smsList: arr
      });
    }
  };
}
