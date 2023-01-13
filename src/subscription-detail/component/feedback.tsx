import React from 'react';
import { Icon, Button, Form, Row, Col, Input, Select, Radio, message } from 'antd';
import { Headline } from 'qmkit';
import { getFeedbackBySubscriptionId, saveFeedback } from '../webapi';
import { FormComponentProps } from 'antd/lib/form';
import './feedback.less';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

interface Iprop extends FormComponentProps {
  subscriptionId: string;
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
    const { subscriptionId } = this.props;
    getFeedbackBySubscriptionId(subscriptionId).then((data) => {
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
          subscriptionId: this.props.subscriptionId
        })
          .then((data) => {
            message.success(<FormattedMessage id="Subscription.SaveFeedbackSuccessfully"/>);
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
        <div>
          <Headline
            title="Feedback"
            extra={
              <div>
                {showMore ? (
                  <Button type="primary" onClick={() => this.changeEditable(true)}>
                    <FormattedMessage id="Subscription.Edit"/>
                  </Button>
                ) : null}
              </div>
            }
          >
            <Button
              type="link"
              onClick={() => {
                this.showMore(!showMore);
              }}
            >
              <Icon type={showMore ? 'up' : 'down'} />
            </Button>
          </Headline>
        </div>
        <div style={{ display: showMore ? 'block' : 'none' }}>
        <Form labelAlign="left" className="petowner-feedback-form">
            <Row gutter={8}>
              <Col span={6}>
                <span className="text-strong"><FormattedMessage id="Subscription.After3rdDelivery"/></span>
              </Col>
              <Col span={18}>
                <Row gutter={8}>
                  <Col span={6}>
                    <div><FormattedMessage id="Subscription.NPS"/>:</div>
                    <div>(<FormattedMessage id="Subscription.scaleFrom10"/>)</div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator('nps3rd', {
                        initialValue: feedback.nps3rd
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
                  <Col span={6} offset={4}>
                    <div><FormattedMessage id="Subscription.ConsultationQuality"/>:</div>
                    <div>(<FormattedMessage id="Subscription.scaleFrom"/>)</div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator('ratePaConsultationQuality', {
                        initialValue: feedback.ratePaConsultationQuality
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
                <Row gutter={8} type="flex" align="middle">
                  <Col span={6}><FormattedMessage id="Subscription.UnnecessaryServices"/>:</Col>
                  <Col span={18}>
                    <FormItem>{getFieldDecorator('unnecessaryServices', { initialValue: feedback.unnecessaryServices })(<Input disabled={!editable} />)}</FormItem>
                  </Col>
                </Row>
                <Row gutter={8} type="flex" align="middle">
                  <Col span={6}><FormattedMessage id="Subscription.NecessaryServices"/>:</Col>
                  <Col span={18}>
                    <FormItem>{getFieldDecorator('necessaryServices', { initialValue: feedback.necessaryServices })(<Input disabled={!editable} />)}</FormItem>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col span={6}><FormattedMessage id="Subscription.Comments"/>:</Col>
                  <Col span={18}>
                    <FormItem>{getFieldDecorator('comments3rd', { initialValue: feedback.comments3rd })(<TextArea disabled={!editable} cols={6} />)}</FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={6}>
                <span className="text-strong"><FormattedMessage id="Subscription.Feedback"/></span>
              </Col>
              <Col span={18}>
                <Row gutter={8}>
                  <Col span={6}>
                    <div><FormattedMessage id="Subscription.NPS"/>:</div>
                    <div><FormattedMessage id="Subscription.scaleFrom10"/></div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator('nps4rd', {
                        initialValue: feedback.nps4rd
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
                  <Col span={6}><FormattedMessage id="Subscription.ReasonForCancellation"/>:</Col>
                  <Col span={18}>
                    <FormItem>{getFieldDecorator('reasonForCancellationOfMembership', { initialValue: feedback.reasonForCancellationOfMembership })(<Input disabled={!editable} />)}</FormItem>
                  </Col>
                </Row>
                <Row gutter={8} type="flex" align="middle">
                  <Col span={6}><FormattedMessage id="Subscription.SuggestionsForImprovement"/>:</Col>
                  <Col span={18}>
                    <FormItem>{getFieldDecorator('suggestionsForImprovement', { initialValue: feedback.suggestionsForImprovement })(<Input disabled={!editable} />)}</FormItem>
                  </Col>
                </Row>
                {/* <Row gutter={8}>
                  <Col span={6}><FormattedMessage id="Subscription.Comments"/>:</Col>
                  <Col span={18}>
                    <FormItem>{getFieldDecorator('comments4rd', { initialValue: feedback.comments4rd })(<TextArea disabled={!editable} cols={6} />)}</FormItem>
                  </Col>
                </Row> */}
              </Col>
            </Row>

          </Form>
          {editable && (
            <div>
              <Button loading={loading} type="primary" onClick={this.handleSave} style={{ marginRight: 10 }}>
                <FormattedMessage id="Subscription.Save"/>
              </Button>
              <Button onClick={() => this.changeEditable(false)}><FormattedMessage id="Subscription.Cancel"/></Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Form.create<Iprop>()(FeedBack);
