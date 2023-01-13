import React from 'react';
import PropTypes from 'prop-types';
import {
  QMUpload,
  Const,
  UEditor,
  ValidConst,
  AuthWrapper,
  checkAuth,
  isSystem
} from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import {
  Checkbox,
  Form,
  Switch,
  Input,
  Icon,
  Radio,
  InputNumber,
  Button,
  message
} from 'antd';
import styled from 'styled-components';
import { fromJS } from 'immutable';
import ShowExample from './show-example';
import Store from '../store';

import ChooseCoupons from '../../coupon-activity-add/common-components/choose-coupons';

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

export default class RewardSetting extends React.Component<any, any> {
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
    const reward = store.state().get('reward');
    const { getFieldDecorator } = this.props.form;
    const { fieldsValue } = store;
    const form = this.props.form;

    return (
      <Form
        className="login-form"
        style={{ paddingBottom: 50 }}
        onSubmit={isSystem((e) => this._handleSubmit(e))}
      >
        <div>
          {/* <FormItem {...formItemLayout} label="分销佣金" required>
            {getFieldDecorator('commissionFlag', {})(
              <Switch
                defaultChecked={reward.get('commissionFlag')}
                onChange={(val) => {
                  fieldsValue(['reward', 'commissionFlag'], val);
                  if (!val) {
                    fieldsValue(['reward', 'goodsAuditFlag'], val);
                  }
                }}
              />
            )}
            <GreyTextDiv>
              开启分销佣金，商家可自行设置参加分销的商品以及差价，分销员分享出去并产生有效订单后，即可获得佣金。
            </GreyTextDiv>
          </FormItem> */}

          <FormItem {...formItemLayout} label="邀新奖励" required>
            {getFieldDecorator(
              'inviteFlag',
              {}
            )(
              <Switch
                defaultChecked={reward.get('inviteFlag')}
                onChange={async (val) => {
                  await fieldsValue(['reward', 'inviteFlag'], val);
                  if (!val) {
                    const node = document.getElementById('invite-desc');
                    node.parentNode.removeChild(node);
                  }
                }}
              />
            )}
            <GreyTextDiv>
              开启邀新奖励，会员和分销员可使用自己的专属链接或者二维码邀请他人注册，受邀请注册成功后，分销员可获得奖励。可叠加赠送优惠券以及现金。
            </GreyTextDiv>
          </FormItem>
          {reward.get('inviteFlag') && (
            <div>
              <FormItem {...formItemLayout} label="邀新奖励设置" required>
                {getFieldDecorator(
                  'rewardCashFlag',
                  {}
                )(
                  <Checkbox
                    checked={reward.get('rewardCashFlag')}
                    onChange={(e) => {
                      fieldsValue(
                        ['reward', 'rewardCashFlag'],
                        (e.target as any).checked
                      );
                      this._validrewardSetting();
                    }}
                  >
                    奖励现金
                  </Checkbox>
                )}
              </FormItem>
              {reward.get('rewardCashFlag') && (
                <div>
                  <FormItem {...formTailLayout}>
                    <span style={styles.require}>*</span>
                    每位奖励：
                    {getFieldDecorator('rewardCash', {
                      rules: [
                        {
                          required: true,
                          message: '请填写每位奖励金额'
                        },
                        {
                          pattern: ValidConst.price,
                          message: '请填写两位小数的合法金额'
                        }
                      ],
                      initialValue: reward.get('rewardCash'),
                      onChange: (e) => {
                        fieldsValue(['reward', 'rewardCash'], e.target.value);
                      }
                    })(<Input style={{ maxWidth: 120, marginRight: 5 }} />)}
                    元
                    <GreyText>
                      请设置合理的金额，建议小于100元，注意控制成本。
                    </GreyText>
                  </FormItem>
                  <FormItem {...formTailLayout}>
                    <span style={styles.require}>*</span>
                    奖励上限：
                    <RadioGroup
                      defaultValue={reward.get('rewardCashType')}
                      onChange={async (e) => {
                        const val = (e as any).target.value;
                        await fieldsValue(['reward', 'rewardCashType'], val);
                        if (val == 0) {
                          this.props.form.setFieldsValue({
                            rewardCashCount: null
                          });
                          await fieldsValue(
                            ['reward', 'rewardCashCount'],
                            null
                          );
                        }
                        this.props.form.validateFields(['rewardCashCount'], {
                          force: true
                        });
                      }}
                    >
                      <Radio value={0}>不限</Radio>
                      <Radio value={1}>
                        {getFieldDecorator('rewardCashCount', {
                          initialValue: reward.get('rewardCashCount'),
                          rules: [
                            {
                              required: reward.get('rewardCashType') == 1,
                              message: '请填写奖励上限'
                            }
                          ]
                        })(
                          <InputNumber
                            disabled={reward.get('rewardCashType') == 0}
                            min={1}
                            precision={0}
                            onChange={(val) =>
                              fieldsValue(['reward', 'rewardCashCount'], val)
                            }
                          />
                        )}
                        人
                        <GreyText>
                          为避免分销员恶意获取注册量产生过多无效成本，您可设置该项奖励的上限。
                        </GreyText>
                      </Radio>
                    </RadioGroup>
                  </FormItem>
                </div>
              )}

              <FormItem {...formTailLayout}>
                {getFieldDecorator(
                  'rewardCouponFlag',
                  {}
                )(
                  <Checkbox
                    checked={reward.get('rewardCouponFlag')}
                    onChange={(e) => {
                      fieldsValue(
                        ['reward', 'rewardCouponFlag'],
                        (e.target as any).checked
                      );
                      this._validrewardSetting();
                    }}
                  >
                    奖励优惠券
                  </Checkbox>
                )}
              </FormItem>
              {reward.get('rewardCouponFlag') && (
                <div>
                  <FormItem {...formTailLayout} required={true}>
                    <span style={styles.require}>*</span>
                    {getFieldDecorator(
                      'coupons',
                      {}
                    )(
                      <ChooseCoupons
                        form={form}
                        coupons={reward.get('coupons').toJS()}
                        invalidCoupons={[]}
                        onChosenCoupons={(coupons) => {
                          store.onChosenCoupons(coupons);
                          this._validCoupons(fromJS(coupons), form);
                        }}
                        onDelCoupon={(couponId) => {
                          store.onDelCoupon(couponId);
                        }}
                        onChangeCouponTotalCount={(index, totalCount) =>
                          store.changeCouponTotalCount(index, totalCount)
                        }
                        type={1}
                        desc={
                          '最多可选10张，选择多张时成组发放，请选择有效期较长的或者领取后生效的优惠券。'
                        }
                      />
                    )}
                  </FormItem>
                  <FormItem {...formTailLayout}>
                    <span style={styles.require}>*</span>
                    奖励上限&nbsp;&nbsp;
                    {getFieldDecorator('rewardCouponCount', {
                      initialValue: reward.get('rewardCouponCount'),
                      rules: [
                        {
                          required: true,
                          message: '请设置奖励上限'
                        }
                      ]
                    })(
                      <InputNumber
                        min={1}
                        max={999999999}
                        precision={0}
                        onChange={(val) =>
                          fieldsValue(['reward', 'rewardCouponCount'], val)
                        }
                      />
                    )}
                    组{' '}
                    <GreyText>
                      为防止分销员恶意获取注册量产生过多无效成本，您可设置该项奖励的上限。
                    </GreyText>
                  </FormItem>
                </div>
              )}
              <FormItem {...formItemLayout} label="邀新入口海报" required>
                <div className="clearfix logoImg">
                  <QMUpload
                    style={styles.box}
                    action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                    listType="picture-card"
                    name="uploadFile"
                    onChange={(fileEntity) =>
                      this.onImgChange('inviteEnterImg', fileEntity)
                    }
                    accept={'.jpg,.jpeg,.png'}
                    fileList={reward.get('inviteEnterImg').toJS()}
                    beforeUpload={(file) => this._beforeUpload(file, 500)}
                  >
                    {reward.get('inviteEnterImg').size >= 1 ? null : (
                      <div>
                        <Icon type="plus" style={styles.plus} />
                      </div>
                    )}
                  </QMUpload>
                  {getFieldDecorator('inviteEnterImg', {
                    initialValue: reward.getIn(['inviteEnterImg', 0, 'url']),
                    rules: [
                      {
                        required: true,
                        message: '请上传邀新入口海报'
                      }
                    ]
                  })(<Input type="hidden" />)}
                  <ShowExample img={require('../imgs/recruit_register.png')} />
                </div>
                <GreyText>
                  建议：尺寸750*360px，图片格式jpg、png，大小不超过500k
                </GreyText>
              </FormItem>
              <FormItem {...formItemLayout} label="邀新落地页海报" required>
                <div className="clearfix logoImg">
                  <QMUpload
                    style={styles.box}
                    action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                    listType="picture-card"
                    name="uploadFile"
                    onChange={(fileEntity) =>
                      this.onImgChange('inviteImg', fileEntity)
                    }
                    accept={'.jpg,.jpeg,.png'}
                    fileList={reward.get('inviteImg').toJS()}
                    beforeUpload={(file) => this._beforeUpload(file, 500)}
                  >
                    {reward.get('inviteImg').size >= 1 ? null : (
                      <div>
                        <Icon type="plus" style={styles.plus} />
                      </div>
                    )}
                  </QMUpload>
                  {getFieldDecorator('inviteImg', {
                    initialValue: reward.getIn(['inviteImg', 0, 'url']),
                    rules: [
                      {
                        required: true,
                        message: '请上传邀新落地页海报'
                      }
                    ]
                  })(<Input type="hidden" />)}
                  <ShowExample img={require('../imgs/recruit_register.png')} />
                </div>
                <GreyText>
                  建议：尺寸750*360px，图片格式jpg、png，大小不超过500k
                </GreyText>
              </FormItem>
              <FormItem {...formItemLayout} label="邀新转发图片" required>
                <div className="clearfix logoImg">
                  <QMUpload
                    style={styles.box}
                    action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                    listType="picture-card"
                    name="uploadFile"
                    onChange={(fileEntity) =>
                      this.onImgChange('inviteShareImg', fileEntity)
                    }
                    accept={'.jpg,.jpeg,.png'}
                    fileList={reward.get('inviteShareImg').toJS()}
                    beforeUpload={(file) => this._beforeUpload(file, 500)}
                  >
                    {reward.get('inviteShareImg').size >= 1 ? null : (
                      <div>
                        <Icon type="plus" style={styles.plus} />
                      </div>
                    )}
                  </QMUpload>
                  {getFieldDecorator('inviteShareImg', {
                    initialValue: reward.getIn(['inviteShareImg', 0, 'url']),
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
              <FormItem {...formItemLayout} label="规则说明">
                <UEditor
                  ref={(UEditor) => {
                    store.setInviteEditor((UEditor && UEditor.editor) || {});
                  }}
                  id="invite-desc"
                  key="invite-desc"
                  height="320"
                  content={reward.get('inviteDesc')}
                  // onContentChange={(val) => {
                  //   fieldsValue(['reward', 'inviteDesc'], val);
                  // }}
                  insertImg={() => {
                    store.setVisible(1, 2);
                    store.setActiveEditor('invite');
                  }}
                  chooseImgs={[]}
                  imgType={store.state().get('imgType')}
                  maximumWords={500}
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
        this._store.fieldsValue(['reward', key], []);
        this.props.form.setFieldsValue({ [key]: null });
        break;
      default:
        let response = fileList[0].response;
        this.props.form.setFieldsValue({
          [key]: response ? response[0] : ''
        });
        this._store.fieldsValue(['reward', key], fileList);
    }
  };

  /**
   * 提交
   */
  _handleSubmit = (e) => {
    if (!checkAuth('f_distribution_setting_edit')) {
      return;
    }
    const form = this.props.form as WrappedFormUtils;
    const flag = this._validrewardSetting();
    const couponFlag = this._validCoupons(
      this._store.state().getIn(['reward', 'coupons']),
      form
    );
    e.preventDefault();
    form.validateFields(null, (errs) => {
      if (!errs && !flag && !couponFlag) {
        this._store.saveReward();
      }
    });
  };

  /**
   * 验证邀新奖励设置
   */
  _validrewardSetting = () => {
    const form = this.props.form as WrappedFormUtils;
    let flag = false;
    form.resetFields(['rewardCashFlag']);
    form.resetFields(['rewardCouponFlag']);
    const rewardCashFlag = this._store
      .state()
      .getIn(['reward', 'rewardCashFlag']);
    const rewardCouponFlag = this._store
      .state()
      .getIn(['reward', 'rewardCouponFlag']);
    let errorObject = {};
    if (!rewardCashFlag && !rewardCouponFlag) {
      errorObject['rewardCouponFlag'] = {
        value: null,
        errors: [new Error('请勾选邀新奖励设置')]
      };
      flag = true;
    }
    form.setFields(errorObject);
    return flag;
  };

  /**
   * 验证优惠券列表
   */
  _validCoupons = (coupons, form) => {
    let errorFlag = false;
    form.resetFields(['coupons']);
    let errorObject = {};
    const rewardCouponFlag = this._store
      .state()
      .getIn(['reward', 'rewardCouponFlag']);
    if (rewardCouponFlag && coupons.size == 0) {
      errorObject['coupons'] = {
        value: null,
        errors: [new Error('请选择优惠券')]
      };
      errorFlag = true;
    }
    form.setFields(errorObject);
    return errorFlag;
  };
}

const styles = {
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  },
  title: {
    fontSize: 14
  },
  grey: {
    color: '#666',
    fontSize: 12
  },
  darkColor: {
    fontSize: 14,
    color: '#333'
  },
  require: {
    color: 'red',
    float: 'left',
    marginRight: 5,
    fontFamily: 'SimSun'
  }
};
