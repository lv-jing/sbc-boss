import React from 'react';
import { Form, Input, Row, Col } from 'antd';

const normalItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
};

export default class SendNodeForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      nodeContent: []
    };
  }

  componentDidMount() {
    this.props.setData('uPushNodeForm', this.props.form);
    let nodeContent = this.props.uPushNodeForm.toJS().nodeContent;
    if (nodeContent) {
      this.setState({
        nodeContent: nodeContent && nodeContent.split(/({.*?})/)
      });
    }
  }

  render() {
    let {
      form: { getFieldDecorator },
      onFormNodeChange
    } = this.props;

    const {
      // 通知内容
      nodeContent,
      // 节点名称
      nodeName,
      // 节点标题
      nodeTitle
    } = this.props.uPushNodeForm.toJS();
    let msgImg = null;

    return (
      <div className="send-setting-common">
        <div className="left-show">
          <div className="sms">站内信预览</div>
          <div className="send-preview send-preview-row">
            <img
              src={msgImg ? msgImg : require('../img/default-img.png')}
              alt=""
              width="40"
              height="40"
            />
            <div className="mes-prew-box">
              <div className="se-title">
                {nodeTitle ? nodeTitle : '消息标题'}
              </div>
              <div className="se-spec">
                {nodeContent ? nodeContent : '消息内容'}
              </div>
            </div>
          </div>
        </div>
        <Form className="send-form">
          <Form.Item label={'通知节点'} required {...normalItemLayout}>
            {getFieldDecorator('nodeName', {
              initialValue: nodeName,
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请填写任务名称'
                },
                { min: 1, max: 20, message: '仅限1-20位字符' }
              ]
            })(
              <Input
                disabled={true}
                placeholder="请填写任务名称"
                onChange={(e) => {
                  onFormNodeChange({
                    field: 'nodeName',
                    value: e.target.value
                  });
                }}
              />
            )}
          </Form.Item>
          <Form.Item label={'消息标题'} required {...normalItemLayout}>
            {getFieldDecorator('nodeTitle', {
              initialValue: nodeTitle,
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请填写消息标题'
                },
                { min: 1, max: 40, message: '仅限1-40位字符' }
              ]
            })(
              <Input
                placeholder="请填写消息标题"
                onChange={(e) => {
                  onFormNodeChange({
                    field: 'nodeTitle',
                    value: e.target.value
                  });
                }}
              />
            )}
          </Form.Item>
          {this._renderNodeContent()}
          {/*<Form.Item style={{visibility: 'hidden'}} label={'消息内容'} required {...normalItemLayout}>*/}
          {/*  {getFieldDecorator('nodeContent', {*/}
          {/*    initialValue: nodeContent,*/}
          {/*    rules: [*/}
          {/*      {*/}
          {/*        required: true,*/}
          {/*        whitespace: true,*/}
          {/*        message: '请填写消息内容'*/}
          {/*      }*/}
          {/*      // { min: 1, max: 100, message: '仅限1-30位字符' }*/}
          {/*    ]*/}
          {/*  })(*/}
          {/*    <Input*/}
          {/*      disabled={true}*/}
          {/*      placeholder="请填写消息内容"*/}
          {/*      onChange={(e) => {*/}
          {/*        onFormNodeChange({*/}
          {/*          field: 'nodeContent',*/}
          {/*          value: this.state.nodeContent*/}
          {/*        });*/}
          {/*        // this.setState({ spec: e.target.value });*/}
          {/*      }}*/}
          {/*    />*/}
          {/*  )}*/}
          {/*</Form.Item>*/}
        </Form>
      </div>
    );
  }

  _renderNodeContent = () => {
    let {
      form: { getFieldDecorator },
      setData
    } = this.props;

    let pushText = this.state.nodeContent;

    return (
      <Row>
        <Col span={4} className="ant-form-item-label">
          <label
            htmlFor="nodeTitle"
            className="ant-form-item-required"
            title="消息标题"
          >
            消息内容
          </label>
        </Col>
        <Col span={20}>
          {pushText &&
            pushText.length > 0 &&
            pushText.map((v, k) => {
              return (
                <div key={k}>
                  {/({.*?})/.test(v) ? (
                    <div
                      style={{ fontSize: 12, color: '#999', marginBottom: 5 }}
                    >
                      {v}
                    </div>
                  ) : (
                    <Form.Item required>
                      {getFieldDecorator(`nodeContent${k}`, {
                        initialValue: v,
                        rules: [
                          {
                            required: true,
                            message: '请填写消息内容'
                          },
                          {
                            pattern: /^[0-9a-zA-Z\u4E00-\u9FA5`~!@#$%^&*()_\-+=<>?:"|,.\/;'\\[\]·~！@#￥%……&*（）【】「」～——\-+=|《》？：“”、；‘’，。、\s]*$/,
                            message: '消息内容不允许输入特殊字符{}'
                          }
                        ]
                      })(
                        <Input
                          placeholder={v}
                          onChange={(e) => {
                            let data = e.target.value.replace(/[\{}\?]/g, '');
                            this.setState((state) => {
                              const nodeContent = state.nodeContent;
                              nodeContent[k] = data;
                              setData('nodeContent', nodeContent);
                              return { nodeContent };
                            });
                          }}
                        />
                      )}
                    </Form.Item>
                  )}
                </div>
              );
            })}
        </Col>
      </Row>
    );
  };
}
