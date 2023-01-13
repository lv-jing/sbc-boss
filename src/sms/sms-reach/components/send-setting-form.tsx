import React from 'react';
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Radio,
  Checkbox,
  DatePicker,
  Button,
  Icon
} from 'antd';
import Search from 'antd/lib/input/Search';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const types = [
  { key: 0, value: '全部会员' },
  { key: 1, value: '会员等级' },
  { key: 2, value: '会员人群' },
  { key: 3, value: '自定义选择' }
];

const formItemLayout = {
  labelCol: {
    span: 10
  },
  wrapperCol: {
    span: 14
  }
};

const timeItemLayout = {
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
      rfmGroupList,
      levelList,
      customerList,
      setState,
      ifManualAdd,
      onFormFieldChange,
      selectedCustomerList,
      salePassedTemplateList,
      rfmGroup,
      customerLevel,
      ifModify,
      getSalePassedTemplateList
    } = this.props;

    const {
      signId,
      templateCode,
      context,
      manualAdd,
      receiveType,
      sendTime,
      sendType
    } = this.props.sendForm.toJS();

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
                          context: option.props['data-templatecontent']
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
              <FormItem>
                {getFieldDecorator('context', {
                  initialValue: context.replace(/(.*】)(.*)/, '$2')
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

          <Row className="receive">
            <Col span={4} className="label">
              接收人
            </Col>
            <Col span={20}>
              已选
              <span className="num">
                {this.props.customerTotal + this.props.manualCustomer}
              </span>
              人 预计消耗短信
              <span className="num">
                {(this.props.customerTotal + this.props.manualCustomer) *
                  this.props.smsNum}
              </span>
              条
            </Col>
          </Row>
          <Row>
            <Col span={20} push={4}>
              <FormItem>
                {getFieldDecorator('receiveType', {
                  initialValue: receiveType,
                  rules: [{ required: true, message: '请选择会员类型' }]
                })(
                  <Radio.Group
                    disabled={!ifModify}
                    onChange={(e) => {
                      onFormFieldChange({
                        field: 'receiveType',
                        value: e.target.value
                      });
                      this.props.getCustomerTotal();
                    }}
                  >
                    {types.map((item) => (
                      <Radio key={item.key} value={item.key}>
                        {item.value}
                      </Radio>
                    ))}
                  </Radio.Group>
                )}
              </FormItem>
              {receiveType === 1 && (
                <FormItem>
                  {getFieldDecorator('customerLevel', {
                    initialValue: customerLevel.toJS(),
                    rules: [{ required: true, message: '请选择会员等级' }]
                  })(
                    <Select
                      disabled={!ifModify}
                      mode="multiple"
                      placeholder="请选择会员等级"
                      onChange={(value) => {
                        this.props.getCustomerTotal({ customerLevel: value });
                      }}
                    >
                      {levelList.map((cate) => {
                        return (
                          <Option
                            key={'' + cate.get('customerLevelId')}
                            value={'' + cate.get('customerLevelId')}
                          >
                            {cate.get('customerLevelName')}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>
              )}
              {receiveType === 2 && (
                <FormItem>
                  {getFieldDecorator('rfmGroup', {
                    initialValue: rfmGroup.toJS(),
                    rules: [{ required: true, message: '请选择会员人群' }]
                  })(
                    <Select
                      disabled={!ifModify}
                      mode="multiple"
                      placeholder="请选择会员人群"
                      onChange={(value) => {
                        this.props.getCustomerTotal({ rfmGroup: value });
                      }}
                    >
                      {rfmGroupList.map((cate) => {
                        return (
                          <Option
                            key={cate.get('groupId')}
                            value={cate.get('groupId')}
                          >
                            {cate.get('groupName')}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>
              )}
              {+receiveType === 3 && (
                <div className="choose-user">
                  <div className="input-wrap">
                    <Search
                      disabled={!ifModify}
                      placeholder="输入手机号搜索"
                      onChange={(e) => {
                        this._searchCustomer(e.target.value);
                      }}
                      style={{ width: 240 }}
                    />
                    <ul className="customer-list">
                      {customerList.toJS().map((item) => {
                        const { customerAccount, customerName } = item;
                        const flag = this._ifSelected(customerAccount);
                        return (
                          <li className="item" key={customerAccount}>
                            <Button
                              disabled={!ifModify}
                              type={flag ? 'primary' : 'dashed'}
                              className="customer-btn"
                              onClick={() => {
                                if (!flag) {
                                  this._addCustomer(item);
                                }
                              }}
                            >
                              {customerAccount} {'  '}
                              {customerName}
                            </Button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="selected-wrap">
                    <ul>
                      {selectedCustomerList.toJS().map((item, index) => (
                        <li className="item" key={item.customerAccount}>
                          {item.customerAccount}
                          {'  '}
                          {item.customerName}
                          <Icon
                            type="close"
                            className="close-icon"
                            onClick={() => {
                              this._deleteCustomer(index);
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </Col>
          </Row>
          <Row>
            <Col span={20} push={4}>
              <FormItem>
                {getFieldDecorator('ifManualAdd', {
                  initialValue: ifManualAdd,
                  rules: [{ required: true, message: '请添加手机号' }]
                })(
                  <Checkbox
                    checked={ifManualAdd}
                    disabled={!ifModify}
                    onChange={(e) => {
                      setState({ ifManualAdd: e.target.checked });
                    }}
                  >
                    手动添加
                  </Checkbox>
                )}
              </FormItem>
              {ifManualAdd && (
                <FormItem>
                  {getFieldDecorator('manualAdd', {
                    initialValue: manualAdd,
                    rules: [{ required: true, message: '请添加手机号' }]
                  })(
                    <TextArea
                      disabled={!ifModify}
                      rows={3}
                      placeholder="请输入您想发送的手机号，多个手机号请用“；”隔开"
                      onChange={this._manualCustomer}
                    />
                  )}
                </FormItem>
              )}
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <FormItem
                label="发送时间"
                {...timeItemLayout}
                className="choose-sign"
              >
                {getFieldDecorator('sendType', {
                  initialValue: sendType,
                  rules: [{ required: true, message: '请选择发送时间类型' }]
                })(
                  <Radio.Group
                    disabled={!ifModify}
                    onChange={(e) => {
                      onFormFieldChange({
                        field: 'sendType',
                        value: e.target.value
                      });
                    }}
                  >
                    <Radio value={0}>立即</Radio>
                    <Radio value={1}>定时</Radio>
                  </Radio.Group>
                )}
              </FormItem>
            </Col>
            <Col span={14}>
              {+sendType === 1 && (
                <FormItem>
                  {getFieldDecorator('sendTime', {
                    initialValue: moment(
                      moment(sendTime || new Date())
                        .format('YYYY-MM-DD HH:mm:ss')
                        .toString()
                    ),
                    rules: [{ required: true, message: '请选择发送时间' }]
                  })(
                    <DatePicker
                      disabled={!ifModify}
                      showTime
                      disabledDate={(current) => {
                        return (
                          current &&
                          current.valueOf() <
                            Date.parse(new Date().toLocaleDateString())
                        );
                      }}
                      format="YYYY-MM-DD HH:mm:ss"
                      disabledTime={() => {
                        return {
                          disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 7, 22, 23]
                        };
                      }}
                    />
                  )}
                </FormItem>
              )}
            </Col>
          </Row>
          <Row>
            <Col span={20} push={4}>
              <p className="rember">如需撤销或编辑，请在发送时间30分钟前操作</p>
              <p className="rember">
                国内消息只能设置每天上午8:00到晚上22:00点的发送任务
              </p>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  _manualCustomer = (e) => {
    if (e.target.value) {
      this.props.setState({
        manualCustomer: e.target.value.match(/([0-9]+;?)/g)
          ? e.target.value.match(/([0-9]+;?)/g).length
          : 0
      });
    }
  };

  _addCustomer = (item) => {
    let { customerAccount, customerName } = item;
    this.props.setState({
      selectedCustomerList: [
        ...this.props.selectedCustomerList.toJS(),
        { customerAccount, customerName }
      ],
      customerTotal: this.props.customerTotal + 1
    });
  };
  _deleteCustomer = (index) => {
    if (!this.props.ifModify) {
      return;
    }
    let arr = this.props.selectedCustomerList.toJS();
    arr.splice(index, 1);
    this.props.setState({
      selectedCustomerList: arr,
      customerTotal: this.props.customerTotal - 1
    });
  };

  _ifSelected = (customerAccount) => {
    return (
      this.props.selectedCustomerList &&
      this.props.selectedCustomerList.toJS().some((customer) => {
        return customerAccount === customer.customerAccount;
      })
    );
  };

  _searchCustomer = (customerAccount) => {
    this.props.getCustomerList(customerAccount);
  };

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
