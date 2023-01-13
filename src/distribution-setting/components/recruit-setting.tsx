import React from 'react';
import PropTypes from 'prop-types';
import {
  Const,
  QMUpload,
  UEditor,
  AuthWrapper,
  checkAuth,
  isSystem
} from 'qmkit';
import styled from 'styled-components';
import {
  Form,
  Switch,
  Input,
  Icon,
  Radio,
  message,
  Button,
  InputNumber
} from 'antd';
import Store from '../store';
import GoodsGrid from './recruit-setting-goods-grid';
import ShowExample from './show-example';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 21
  }
};

const formTailLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21, offset: 3 }
};

const GreyText = styled.span`
  font-size: 12px;
  color: #999999;
  margin-left: 5px;
`;

const GreyTextDiv = styled.div`
  font-size: 12px;
  line-height: 24px;
  color: #999999;
  margin-left: 5px;
`;

export default class RecruitSetting extends React.Component<any, any> {
  _store: Store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const store = this._store as any;
    const recruit = store.state().get('recruit');
    const { getFieldDecorator } = this.props.form;
    const { fieldsValue } = store;

    return (
      <Form
        className="login-form"
        style={{ paddingBottom: 50 }}
        onSubmit={isSystem((e) => this._handleSubmit(e))}
      >
        <div>
          <FormItem {...formItemLayout} label="申请入口" required>
            {getFieldDecorator(
              'applyFlag',
              {}
            )(
              <Switch
                defaultChecked={recruit.get('applyFlag')}
                onChange={async (val) => {
                  await fieldsValue(['recruit', 'applyFlag'], val);
                  if (!val) {
                    const node = document.getElementById('recruit-desc');
                    node.parentNode.removeChild(node);
                  }
                }}
              />
            )}
            <ShowExample img={require('../imgs/apply_flag.png')} />
            <GreyTextDiv>
              开启申请入口，用户的个人中心将会出现分销员的申请入口，在达到您设置的申请条件后，用户将获得分销员资格
            </GreyTextDiv>
          </FormItem>
          {recruit.get('applyFlag') && (
            <div>
              <FormItem {...formItemLayout} label="申请条件" required>
                {getFieldDecorator('applyType', {
                  initialValue: recruit.get('applyType')
                })(
                  <RadioGroup
                    onChange={(e) =>
                      fieldsValue(
                        ['recruit', 'applyType'],
                        (e as any).target.value
                      )
                    }
                  >
                    <Radio value={0}>
                      <span style={styles.darkColor}>购买商品</span>
                    </Radio>
                    <Radio value={1}>
                      <span style={styles.darkColor}>邀请注册</span>
                    </Radio>
                  </RadioGroup>
                )}
              </FormItem>
              {recruit.get('applyType') == 0 && (
                <FormItem {...formItemLayout} label=" 选择商品" required>
                  {getFieldDecorator('goodsInfoIds', {
                    initialValue: recruit.get('goodsInfoIds').toJS(),
                    rules: [{ required: true, message: '请选择商品' }]
                  })(<GoodsGrid />)}
                </FormItem>
              )}
              {recruit.get('applyType') == 1 && (
                <FormItem {...formItemLayout} label="邀请人数" required>
                  {getFieldDecorator('inviteCount', {
                    initialValue: recruit.get('inviteCount'),
                    rules: [{ required: true, message: '请填写邀请人数' }],
                    onChange: (val) =>
                      fieldsValue(['recruit', 'inviteCount'], val)
                  })(<InputNumber min={1} style={{ width: 60 }} />)}{' '}
                  人 <GreyText>邀请一定数量的新用户，获得分销员资格</GreyText>
                </FormItem>
              )}
              {recruit.get('applyType') == 0 && (
                <div>
                  <FormItem {...formItemLayout} label="招募入口海报" required>
                    <div className="clearfix logoImg">
                      <QMUpload
                        style={styles.box}
                        action={
                          Const.HOST + '/uploadResource?resourceType=IMAGE'
                        }
                        listType="picture-card"
                        name="uploadFile"
                        onChange={(fileEntity) =>
                          this.onImgChange('buyRecruitEnterImg', fileEntity)
                        }
                        accept={'.jpg,.jpeg,.png'}
                        fileList={recruit.get('buyRecruitEnterImg').toJS()}
                        beforeUpload={(file) => this._beforeUpload(file, 500)}
                      >
                        {recruit.get('buyRecruitEnterImg').size >= 1 ? null : (
                          <div>
                            <Icon type="plus" style={styles.plus} />
                          </div>
                        )}
                      </QMUpload>
                      {getFieldDecorator('buyRecruitEnterImg', {
                        initialValue: recruit.getIn([
                          'buyRecruitEnterImg',
                          0,
                          'url'
                        ]),
                        rules: [
                          {
                            required: true,
                            message: '请上传招募入口海报'
                          }
                        ]
                      })(<Input type="hidden" />)}
                      <ShowExample
                        img={require('../imgs/recruit_register.png')}
                      />
                    </div>
                    <GreyTextDiv>
                      建议：尺寸750*160px，图片格式jpg、png，大小不超过500k
                    </GreyTextDiv>
                  </FormItem>
                  <FormItem {...formItemLayout} label="招募落地页海报" required>
                    <div className="clearfix logoImg">
                      <QMUpload
                        style={styles.box}
                        action={
                          Const.HOST + '/uploadResource?resourceType=IMAGE'
                        }
                        listType="picture-card"
                        name="uploadFile"
                        onChange={(fileEntity) =>
                          this.onImgChange('recruitImg', fileEntity)
                        }
                        accept={'.jpg,.jpeg,.png'}
                        fileList={recruit.get('recruitImg').toJS()}
                        beforeUpload={(file) => this._beforeUpload(file, 500)}
                      >
                        {recruit.get('recruitImg').size >= 1 ? null : (
                          <div>
                            <Icon type="plus" style={styles.plus} />
                          </div>
                        )}
                      </QMUpload>
                      {getFieldDecorator('recruitImg', {
                        initialValue: recruit.getIn(['recruitImg', 0, 'url']),
                        rules: [
                          {
                            required: true,
                            message: '请上传招募落地页海报'
                          }
                        ]
                      })(<Input type="hidden" />)}
                      <ShowExample
                        img={require('../imgs/recruit_register.png')}
                      />
                    </div>
                    <GreyTextDiv>
                      建议：尺寸750*360px，图片格式jpg、png，大小不超过500k
                    </GreyTextDiv>
                  </FormItem>
                </div>
              )}
              {recruit.get('applyType') == 1 && (
                <div>
                  <FormItem {...formItemLayout} label="招募入口海报" required>
                    <div className="clearfix logoImg">
                      <QMUpload
                        style={styles.box}
                        action={
                          Const.HOST + '/uploadResource?resourceType=IMAGE'
                        }
                        listType="picture-card"
                        name="uploadFile"
                        onChange={(fileEntity) =>
                          this.onImgChange('inviteRecruitEnterImg', fileEntity)
                        }
                        accept={'.jpg,.jpeg,.png'}
                        fileList={recruit.get('inviteRecruitEnterImg').toJS()}
                        beforeUpload={(file) => this._beforeUpload(file, 500)}
                      >
                        {recruit.get('inviteRecruitEnterImg').size >=
                        1 ? null : (
                          <div>
                            <Icon type="plus" style={styles.plus} />
                          </div>
                        )}
                      </QMUpload>
                      {getFieldDecorator('inviteRecruitEnterImg', {
                        initialValue: recruit.getIn([
                          'inviteRecruitEnterImg',
                          0,
                          'url'
                        ]),
                        rules: [
                          {
                            required: true,
                            message: '请上传招募入口海报'
                          }
                        ]
                      })(<Input type="hidden" />)}
                      <ShowExample
                        img={require('../imgs/recruit_register.png')}
                      />
                    </div>
                    <GreyTextDiv>
                      建议：尺寸750*160px，图片格式jpg、png，大小不超过500k
                    </GreyTextDiv>
                  </FormItem>
                  <FormItem {...formItemLayout} label="招募落地页海报" required>
                    <div className="clearfix logoImg">
                      <QMUpload
                        style={styles.box}
                        action={
                          Const.HOST + '/uploadResource?resourceType=IMAGE'
                        }
                        listType="picture-card"
                        name="uploadFile"
                        onChange={(fileEntity) =>
                          this.onImgChange('inviteRecruitImg', fileEntity)
                        }
                        accept={'.jpg,.jpeg,.png'}
                        fileList={recruit.get('inviteRecruitImg').toJS()}
                        beforeUpload={(file) => this._beforeUpload(file, 500)}
                      >
                        {recruit.get('inviteRecruitImg').size >= 1 ? null : (
                          <div>
                            <Icon type="plus" style={styles.plus} />
                          </div>
                        )}
                      </QMUpload>
                      {getFieldDecorator('inviteRecruitImg', {
                        initialValue: recruit.getIn([
                          'inviteRecruitImg',
                          0,
                          'url'
                        ]),
                        rules: [
                          {
                            required: true,
                            message: '请上传招募落地页海报'
                          }
                        ]
                      })(<Input type="hidden" />)}
                      <ShowExample
                        img={require('../imgs/recruit_register.png')}
                      />
                    </div>
                    <GreyTextDiv>
                      建议：尺寸750*360px，图片格式jpg、png，大小不超过500k
                    </GreyTextDiv>
                  </FormItem>
                </div>
              )}
              {recruit.get('applyType') == 1 && (
                <FormItem {...formItemLayout} label="邀新转发图片" required>
                  <div className="clearfix logoImg">
                    <QMUpload
                      style={styles.box}
                      action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                      listType="picture-card"
                      name="uploadFile"
                      onChange={(fileEntity) =>
                        this.onImgChange('recruitShareImg', fileEntity)
                      }
                      accept={'.jpg,.jpeg,.png'}
                      fileList={recruit.get('recruitShareImg').toJS()}
                      beforeUpload={(file) => this._beforeUpload(file, 500)}
                    >
                      {recruit.get('recruitShareImg').size >= 1 ? null : (
                        <div>
                          <Icon type="plus" style={styles.plus} />
                        </div>
                      )}
                    </QMUpload>
                    {getFieldDecorator('recruitShareImg', {
                      initialValue: recruit.getIn([
                        'recruitShareImg',
                        0,
                        'url'
                      ]),
                      rules: [
                        {
                          required: true,
                          message: '请上传邀新转发图片'
                        }
                      ]
                    })(<Input type="hidden" />)}
                    <ShowExample img={require('../imgs/invite_img.png')} />
                  </div>
                  <GreyTextDiv>
                    建议：尺寸750*1334px，图片格式jpg、png，大小不超过500k
                  </GreyTextDiv>
                </FormItem>
              )}

              <FormItem {...formItemLayout} label="规则说明">
                <UEditor
                  ref={(UEditor) => {
                    store.setRecruitEditor((UEditor && UEditor.editor) || {});
                  }}
                  id="recruit-desc"
                  key="recruit-desc"
                  height="320"
                  content={recruit.get('recruitDesc')}
                  // onContentChange={(val) => {
                  //   fieldsValue(['recruit', 'recruitDesc'], val);
                  // }}
                  insertImg={() => {
                    store.setVisible(1, 2);
                    store.setActiveEditor('recruit');
                  }}
                  chooseImgs={[]}
                  imgType={store.state().get('imgType')}
                  maximumWords={1000}
                />
              </FormItem>
            </div>
          )}

          <div className="bar-button-type-one">
            <AuthWrapper functionName="f_distribution_setting_edit">
              <FormItem {...formTailLayout} style={{ marginTop: 10 }}>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
              </FormItem>
            </AuthWrapper>
          </div>
        </div>
      </Form>
    );
  }

  /**
   * 检查文件格式
   */
  _beforeUpload(file, size) {
    const isSupportImage =
      file.type === 'image/jpeg' ||
      file.type === 'image/gif' ||
      file.type == 'image/png';
    if (!isSupportImage) {
      message.error('只能上传jpg, png, gif类型的图片');
    }
    const isLt = file.size / 1024 < size;
    if (!isLt) {
      message.error(`图片大小不能超过${size}KB!`);
    }
    return isSupportImage && isLt;
  }

  /**
   * 改变图片
   */
  onImgChange = (key, { file, fileList }) => {
    switch (file.status) {
      case 'error':
        message.error('上传失败');
        break;
      case 'removed':
        this._store.fieldsValue(['recruit', key], []);
        this.props.form.setFieldsValue({ [key]: null });
        break;
      default:
        let response = fileList[0].response;
        this.props.form.setFieldsValue({
          [key]: response ? response[0] : ''
        });
        this._store.fieldsValue(['recruit', key], fileList);
    }
  };

  /**
   * 提交
   */
  _handleSubmit = (e) => {
    if (!checkAuth('f_distribution_setting_edit')) {
      return;
    }
    e.preventDefault();
    const form = this.props.form as WrappedFormUtils;
    form.validateFields(null, (errs) => {
      if (!errs) {
        this._store.saveRecruit();
      }
    });
  };
}

const styles = {
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  darkColor: {
    fontSize: 14,
    color: '#333'
  },
  plus: {
    color: '#999',
    fontSize: '28px'
  }
};
