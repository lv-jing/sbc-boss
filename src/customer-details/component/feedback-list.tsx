import React from 'react';
import {
  Icon,
  Button,
  Form,
  Row,
  Col,
  Input,
  Select,
  Radio,
  message
} from 'antd';
import { Headline } from 'qmkit';
import { getByCustomerId, saveFeedback } from '../webapi';
import { FormComponentProps } from 'antd/lib/form';
import './feedback.less';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

interface Iprop extends FormComponentProps {
  customerId: string;
}

class FeedBack extends React.Component<Iprop, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      showMore: false,
      editable: false,
      feedback: {}
    };
  }

  componentDidMount() {
    this.getFeedback();
  }

  getFeedback = () => {
    const petOwnerId = this.props.customerId;
    getByCustomerId(petOwnerId).then((data) => {
      this.setState({
        feedback: data.res.context
      });
    });
  };

  showMore = (stat: boolean) => {
    this.setState({
      showMore: stat
    });
  };

  changeEditable = (editable: boolean) => {
    this.setState({
      editable: editable
    });
  };

  handleSave = () => {
    this.props.form.validateFields((err, fields) => {
      if (!err) {
        this.setState({ loading: true });
        saveFeedback({
          ...fields,
          petOwnerId: this.props.customerId
        })
          .then((data) => {
            message.success(
              <FormattedMessage id="Subscription.SaveFeedbackSuccessfully" />
            );
            this.setState({
              loading: false,
              editable: false
            });
          })
          .catch(() => {
            this.setState({
              loading: false
            });
          });
      }
    });
  };

  render() {
    const { showMore, editable, feedback, loading } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="container-search feedback-container">
        {/* <div>
          <Headline
            extra={
              <div>
                <Button
                  type="primary"
                  onClick={() => this.changeEditable(true)}
                >
                  <FormattedMessage id="Subscription.Edit" />
                </Button>
              </div>
            }
          ></Headline>
        </div> */}
        <div>
          <Form labelAlign="left" className="petowner-feedback-form">
            <Row gutter={8}>
              <Col span={6}>
                <span className="text-strong">
                  <FormattedMessage id="Subscription.AfterWelcomePackReceived" />
                </span>
              </Col>
              <Col span={18}>
                <Row gutter={8}>
                  <Col span={6}>
                    <div>
                      <FormattedMessage id="Subscription.RateDelivery" />:
                    </div>
                    <div>
                      (<FormattedMessage id="Subscription.scaleFrom" />)
                    </div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator('rateDelivery', {
                        initialValue: feedback.rateDelivery
                      })(
                        <Select disabled={!editable}>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Option key={n} value={n}>
                              {n}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6} offset={4}>
                    <div>
                      <FormattedMessage id="Subscription.RateThePack" />:
                    </div>
                    <div>
                      (<FormattedMessage id="Subscription.scaleFrom" />)
                    </div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator('ratePack', {
                        initialValue: feedback.ratePack
                      })(
                        <Select disabled={!editable}>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Option key={n} value={n}>
                              {n}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col span={6}>
                    <div>
                      <FormattedMessage id="Subscription.Comments" />:
                    </div>
                  </Col>
                  <Col span={18}>
                    <FormItem>
                      {getFieldDecorator('rateComments', {
                        initialValue: feedback.rateComments
                      })(<TextArea disabled={!editable} cols={6} />)}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={6}>
                <span className="text-strong">
                  <FormattedMessage id="Subscription.deliveryConfirmation" />
                </span>
              </Col>
              <Col span={18}>
                <Row gutter={8}>
                  <Col span={6}>
                    <div>
                      <FormattedMessage id="Subscription.NPS" />:
                    </div>
                    <div>
                      (<FormattedMessage id="Subscription.scaleFrom10" />)
                    </div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator('nps2rd', {
                        initialValue: feedback.nps2rd
                      })(
                        <Select disabled={!editable}>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                            <Option key={n} value={n}>
                              {n}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={8} type="flex" align="middle">
                  <Col span={6}>
                    <FormattedMessage id="Subscription.DeliveryScheduleFit" />:
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator('deliveryScheduleFit_2rd', {
                        initialValue: feedback.deliveryScheduleFit_2rd
                      })(
                        <Radio.Group disabled={!editable}>
                          <Radio value={1}>
                            <FormattedMessage id="Subscription.Yes" />
                          </Radio>
                          <Radio value={0}>
                            <FormattedMessage id="Subscription.No" />
                          </Radio>
                        </Radio.Group>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8} offset={6}>
                    <FormItem>
                      {getFieldDecorator('delivery_schedule_fit_reason_2rd', {
                        initialValue: feedback.delivery_schedule_fit_reason_2rd
                      })(<Input disabled={!editable} />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={8} type="flex" align="middle">
                  <Col span={6}>
                    <FormattedMessage id="Subscription.ReasonOfInterest" />:
                  </Col>
                  <Col span={18}>
                    <FormItem>
                      {getFieldDecorator('interestReason2rd', {
                        initialValue: feedback.interestReason2rd
                      })(<Input disabled={!editable} />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col span={6}>
                    <FormattedMessage id="Subscription.Comments" />:
                  </Col>
                  <Col span={18}>
                    <FormItem>
                      {getFieldDecorator('comments2rd', {
                        initialValue: feedback.comments2rd
                      })(<TextArea disabled={!editable} cols={6} />)}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={8} style={{ marginTop: 25 }}>
              <Col span={6}>
                <span className="text-strong">
                  <FormattedMessage id="Subscription.FeedbackForClinics" />
                </span>
                <div>
                  (<FormattedMessage id="Subscription.scaleFrom" />)
                </div>
              </Col>
              <Col span={18}>
                <Row gutter={8}>
                  <Col span={12}>
                    <div className="text-align-center text-strong">
                      <FormattedMessage id="Subscription.Visit" /> 1
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="text-align-center text-strong">
                      <FormattedMessage id="Subscription.Visit" /> 2
                    </div>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col span={7}>
                    <div>
                      <FormattedMessage id="Subscription.QualityOfService" /> 1:
                    </div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator('qualityOfService1', {
                        initialValue: feedback.qualityOfService1
                      })(
                        <Select disabled={!editable}>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Option key={n} value={n}>
                              {n}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={7} offset={2}>
                    <div>
                      <FormattedMessage id="Subscription.QualityOfService" /> 2:
                    </div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator('qualityOfService2', {
                        initialValue: feedback.qualityOfService2
                      })(
                        <Select disabled={!editable}>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Option key={n} value={n}>
                              {n}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col span={7}>
                    <div>
                      <FormattedMessage id="Subscription.VeterinarianQualification" />{' '}
                      1:
                    </div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator('veterinarianQualification1', {
                        initialValue: feedback.veterinarianQualification1
                      })(
                        <Select disabled={!editable}>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Option key={n} value={n}>
                              {n}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={7} offset={2}>
                    <div>
                      <FormattedMessage id="Subscription.VeterinarianQualification" />{' '}
                      2:
                    </div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator('veterinarianQualification2', {
                        initialValue: feedback.veterinarianQualification2
                      })(
                        <Select disabled={!editable}>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Option key={n} value={n}>
                              {n}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col span={7}>
                    <div>
                      <FormattedMessage id="Subscription.Clinics1" />:
                    </div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator('clinicsRating1', {
                        initialValue: feedback.clinicsRating1
                      })(
                        <Select disabled={!editable}>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Option key={n} value={n}>
                              {n}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={7} offset={2}>
                    <div>
                      <FormattedMessage id="Subscription.Clinics2" />:
                    </div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator('clinicsRating2', {
                        initialValue: feedback.clinicsRating2
                      })(
                        <Select disabled={!editable}>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Option key={n} value={n}>
                              {n}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col span={7}>
                    <div>
                      <FormattedMessage id="Subscription.Vet" /> 1:
                    </div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator('vetClinicCheckup1', {
                        initialValue: feedback.vetClinicCheckup1
                      })(
                        <Select disabled={!editable}>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Option key={n} value={n}>
                              {n}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={7} offset={2}>
                    <div>
                      <FormattedMessage id="Subscription.Vet" /> 2:
                    </div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator('vetClinicCheckup2', {
                        initialValue: feedback.vetClinicCheckup1
                      })(
                        <Select disabled={!editable}>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Option key={n} value={n}>
                              {n}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
          {editable && (
            <div>
              <Button
                loading={loading}
                type="primary"
                onClick={this.handleSave}
                style={{ marginRight: 10 }}
              >
                <FormattedMessage id="Subscription.Save" />
              </Button>
              <Button onClick={() => this.changeEditable(false)}>
                <FormattedMessage id="Subscription.Cancel" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Form.create<Iprop>()(FeedBack);
