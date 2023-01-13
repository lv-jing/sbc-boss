import React from 'react';
import PropTypes from 'prop-types';
import {
  QMUpload,
  Const,
  AuthWrapper,
  checkAuth,
  UEditor,
  isSystem
} from 'qmkit';
import { Form, Switch, Input, Icon, message, Button, Radio } from 'antd';
import ShowExample from './show-example';
import styled from 'styled-components';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import Store from '../store';

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
  display: block;
  line-height: 24px;
  color: #999999;
  margin-left: 5px;
`;

export default class BasicSetting extends React.Component<any, any> {
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
    const basic = store.state().get('basic');
    const { fieldsValue } = store;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form
        className="login-form"
        style={{ paddingBottom: 50 }}
        onSubmit={isSystem((e) => this._handleSubmit(e))}
      >
        <div>
          <FormItem {...formItemLayout} label="分销员名称" required>
            {getFieldDecorator('distributorName', {
              initialValue: basic.get('distributorName'),
              rules: [
                { required: true, message: '请填写分销员名称' },
                { max: 5, message: '最多5个字' }
              ]
            })(
              <Input
                style={{ width: 160 }}
                onChange={(e) =>
                  fieldsValue(
                    ['basic', 'distributorName'],
                    (e as any).target.value
                  )
                }
              />
            )}
            <ShowExample img={require('../imgs/distributor_name.png')} />
            <br />
            <GreyText>
              如设置为“分销员”，则分销员在前台将展示为“分销员”。
            </GreyText>
          </FormItem>
          <FormItem {...formItemLayout} label="分销小店" required>
            {getFieldDecorator(
              'shopOpenFlag',
              {}
            )(
              <Switch
                defaultChecked={basic.get('shopOpenFlag')}
                onChange={(val) => fieldsValue(['basic', 'shopOpenFlag'], val)}
              />
            )}
            <ShowExample img={require('../imgs/shop_flag.png')} />
            <br />
            <GreyText>
              开启分销小店，每个分销员可拥有自己的店铺，可自行选品上架并推广自己的店铺。关闭后，所有分享出去的小店链接都将失效。
            </GreyText>
          </FormItem>
          {basic.get('shopOpenFlag') && (
            <div>
              <FormItem {...formItemLayout} label="小店名称" required>
                {getFieldDecorator('shopName', {
                  initialValue: basic.get('shopName'),
                  rules: [
                    { required: true, message: '请填写小店名称' },
                    { max: 5, message: '最多5个字' }
                  ]
                })(
                  <Input
                    style={{ width: 160 }}
                    onChange={(e) =>
                      fieldsValue(
                        ['basic', 'shopName'],
                        (e as any).target.value
                      )
                    }
                  />
                )}
                <ShowExample img={require('../imgs/shop_name.png')} />
                <br />
                <GreyText>
                  如设置为“小店”，则用户小明的小店将展示为“小明的小店”。
                </GreyText>
              </FormItem>

              <FormItem {...formItemLayout} label="店铺分享图片" required>
                <div className="clearfix logoImg">
                  <QMUpload
                    style={styles.box}
                    action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                    listType="picture-card"
                    name="uploadFile"
                    onChange={(fileEntity) =>
                      this.onImgChange('shopShareImg', fileEntity)
                    }
                    accept={'.jpg,.jpeg,.png'}
                    fileList={basic.get('shopShareImg').toJS()}
                    beforeUpload={(file) => this._beforeUpload(file, 500)}
                  >
                    {basic.get('shopShareImg').size >= 1 ? null : (
                      <div>
                        <Icon type="plus" style={styles.plus} />
                      </div>
                    )}
                  </QMUpload>
                  {getFieldDecorator('shopShareImg', {
                    initialValue: basic.getIn(['shopShareImg', 0, 'url']),
                    rules: [
                      {
                        required: true,
                        message: '请上传店铺分享图片'
                      }
                    ]
                  })(<Input type="hidden" />)}
                  <ShowExample img={require('../imgs/shop_share.jpg')} />
                </div>
                <GreyText>
                  建议：尺寸750*1334px，图片格式jpg、png，大小不超过500k
                </GreyText>
              </FormItem>
            </div>
          )}
          <FormItem {...formItemLayout} label="注册限制" required>
            {getFieldDecorator('registerLimitType', {
              initialValue: basic.get('registerLimitType')
            })(
              <RadioGroup
                onChange={(e) =>
                  fieldsValue(
                    ['basic', 'registerLimitType'],
                    (e as any).target.value
                  )
                }
              >
                <Radio value={0}>
                  <span>不限</span>
                </Radio>
                <Radio value={1}>
                  <span>仅限邀请注册</span>
                </Radio>
              </RadioGroup>
            )}
            <GreyText>
              仅限邀请注册即注册时必填邀请码或通过邀请链接注册，注册后绑定邀请关系
            </GreyText>
          </FormItem>

          <FormItem {...formItemLayout} label="邀新奖励限制" required>
            {getFieldDecorator('baseLimitType', {
              initialValue: basic.get('baseLimitType')
            })(
              <RadioGroup
                onChange={(e) =>
                  fieldsValue(
                    ['basic', 'baseLimitType'],
                    (e as any).target.value
                  )
                }
              >
                <Radio value={0}>
                  <span>不限</span>
                </Radio>
                <Radio value={1}>
                  <span>仅限有效邀新</span>
                </Radio>
              </RadioGroup>
            )}
            <GreyText>
              邀请到完成一笔订单并且未产生退货的客户被视为有效邀新
            </GreyText>
          </FormItem>

          <FormItem {...formItemLayout} label="佣金返利优先级" required>
            {getFieldDecorator('commissionPriorityType', {
              initialValue: basic.get('commissionPriorityType')
            })(
              <RadioGroup
                onChange={(e) =>
                  fieldsValue(
                    ['basic', 'commissionPriorityType'],
                    (e as any).target.value
                  )
                }
              >
                <Radio value={0}>
                  <span>邀请人优先</span>
                </Radio>
                <Radio value={1}>
                  <span>店铺优先</span>
                </Radio>
              </RadioGroup>
            )}
            <GreyText>
              邀请人优先即佣金返给下单客户的邀请人，无邀请人时或邀请人为普通客户时佣金返给当前下单店铺的分销员
              <br />
              店铺优先即佣金返给当前下单店铺的分销员，未在店铺内购买时佣金返利给邀请人（邀请人为普通客户时不返利）
            </GreyText>
          </FormItem>

          <FormItem {...formItemLayout} label="商品审核" required>
            {getFieldDecorator(
              'goodsAuditFlag',
              {}
            )(
              <Switch
                checked={basic.get('goodsAuditFlag')}
                onChange={(val) =>
                  fieldsValue(['basic', 'goodsAuditFlag'], val)
                }
              />
            )}
            <GreyText>
              开启分销商品审核，商家设置了分销商品后，需经过平台审核同意才可正常分销。
            </GreyText>
          </FormItem>
          <FormItem {...formItemLayout} label="分销业绩规则说明">
            <UEditor
              ref={(UEditor) => {
                store.setPerformanceEditor((UEditor && UEditor.editor) || {});
              }}
              id="performance-desc"
              key="performance-desc"
              height="320"
              content={basic.get('performanceDesc')}
              insertImg={() => {
                store.setVisible(1, 2);
                store.setActiveEditor('performance');
              }}
              chooseImgs={[]}
              imgType={store.state().get('imgType')}
              maximumWords={1000}
            />
          </FormItem>

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
        this._store.fieldsValue(['basic', key], []);
        this.props.form.setFieldsValue({ [key]: null });
        break;
      default:
        let response = fileList[0].response;
        this.props.form.setFieldsValue({
          [key]: response ? response[0] : ''
        });
        this._store.fieldsValue(['basic', key], fileList);
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
        this._store.saveBasic();
      }
    });
  };
}

const styles = {
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 300
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  }
};
