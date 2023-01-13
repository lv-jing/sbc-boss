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
    this.props.setData('formFunctions', this.props.form);
  }

  componentWillReceiveProps() {
    let context = this.props.sendForm.get('context');
    if (!this.state.flag && context) {
      this.setState(
        {
          context: context,
          flag: true
        },
        () => {
          this._smsList();
        }
      );
    }
  }

  render() {
    const {
      form: { getFieldDecorator, setFieldsValue },
      getPassedSignList,
      passedSignList,
      salePassedTemplateList,
      getSalePassedTemplateList,
      sendGroupCustomerNum
    } = this.props;

    const { signId, templateCode, context } = this.props.sendForm.toJS();
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
                  dropdownStyle={{ zIndex: 1053 }}
                  onFocus={() => {
                    getPassedSignList();
                  }}
                  //@ts-ignore
                  onSelect={(value, option: any) => {
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
                  {passedSignList.map((item) => {
                    return (
                      <Option
                        key={item.get('id')}
                        value={item.get('id')}
                        title={'【' + item.get('smsSignName') + '】'}
                      >
                        【{item.get('smsSignName')}】
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem className="ant-col-14 choose-modal">
              {getFieldDecorator('templateCode', {
                initialValue: templateCode ? templateCode : undefined,
                rules: [{ required: true, message: '请选择模板' }]
              })(
                <Select
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
                          context: option.props['data-templatecontent']
                        });
                      }
                    );
                  }}
                >
                  {salePassedTemplateList.map((item) => {
                    return (
                      <Option
                        key={item.get('templateCode')}
                        value={item.get('templateCode')}
                        data-templatecontent={item.get('templateContent')}
                      >
                        {item.get('templateName')}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </div>
          <Row>
            <Col span={20} push={4}>
              <FormItem>
                {getFieldDecorator('context', {
                  initialValue: context.replace(/(.*】)(.*)/, '$2')
                })(<TextArea rows={4} readOnly={true} />)}
              </FormItem>
              <div className="info">
                <p className="word-number">
                  已输入 {this.state.context.length} 字(含签名后缀)，按
                  {this.props.smsNum} 条计费
                </p>
              </div>
            </Col>
          </Row>

          <Row className="receive">
            <Col span={4} className="label">
              接收人
            </Col>
            <Col span={20}>
              已选
              <span className="num">{sendGroupCustomerNum}</span>人 预计消耗短信
              <span className="num">
                {sendGroupCustomerNum * this.props.smsNum}
              </span>
              条
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  _smsList = () => {
    let sms = this.state.context;
    if (sms.length <= 70) {
      this.props.setState({
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
      this.props.setState({
        smsNum: Math.ceil(len / 67)
      });
      this.setState({
        smsList: arr
      });
    }
  };

  getLength = (context) => {
    return context.length <= 70 ? 1 : Math.ceil(context.length / 67);
  };
}
