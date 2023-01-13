import React from 'react';
import PropTypes from 'prop-types';
import { AuthWrapper, DataGrid, UEditor, isSystem } from 'qmkit';
import { Button, Checkbox, Form, Input, InputNumber, Modal, Radio } from 'antd';
import styled from 'styled-components';
import Store from '../store';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const { Column } = DataGrid;

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
  display: block;
`;

const GridDiv = styled.div`
  margin-bottom: 15px;
  .ant-table-tbody > tr > td .ant-row {
    margin-bottom: 0px;
  }
`;

export default class MultistageSetting extends React.Component<any, any> {
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
    const multistage = store.state().get('multistage');
    const form = this.props.form as WrappedFormUtils;
    const { getFieldDecorator } = form;
    const {
      fieldsValue,
      changeDistributorLevelValue,
      addDistributorLevel,
      removeDistributorLevel,
      deleteDistributorLevel
    } = store;

    return (
      <Form
        className="login-form"
        style={{ paddingBottom: 50 }}
        onSubmit={isSystem((e) => this._handleSubmit(e))}
      >
        <div>
          <div className="distribution-msg" style={{ marginBottom: 15 }}>
            业务说明：
            <br />
            1、平台设置不同级别分销员在商品佣金中的占比，即佣金比例和佣金提成比例都是以商品佣金为基数；
            <br />
            为保证实际返利不会超过商家设置的商品佣金，某一等级的佣金比例+任一等级的佣金提成比例需小于等于100%
            <br />
            2、设置升级规则和返利数据会影响分销员等级和佣金返利金额，请谨慎设置
            <br />
          </div>

          <FormItem {...formItemLayout} label="佣金提成脱钩" required>
            {getFieldDecorator('commissionUnhookType', {
              initialValue: multistage.get('commissionUnhookType')
            })(
              <RadioGroup
                onChange={(e) =>
                  fieldsValue(
                    ['multistage', 'commissionUnhookType'],
                    (e as any).target.value
                  )
                }
              >
                <Radio value={0}>
                  <span style={styles.darkColor}>不限</span>
                </Radio>
                <Radio value={1}>
                  <span style={styles.darkColor}>分销员和邀请人平级时脱钩</span>
                </Radio>
                <Radio value={2}>
                  <span style={styles.darkColor}>
                    分销员高于邀请人等级时脱钩
                  </span>
                </Radio>
              </RadioGroup>
            )}
            <GreyText>
              脱钩即分销员获得佣金返利后，分销员的邀请人不可获得佣金提成
            </GreyText>
          </FormItem>

          <FormItem {...formItemLayout} label="分销员等级">
            <GridDiv>
              <GreyText>最多支持5个分销员等级</GreyText>
              <DataGrid
                size="small"
                rowKey={(record) => {
                  return record.mockId;
                }}
                dataSource={multistage.get('distributorLevels').toJS()}
                pagination={false}
              >
                <Column
                  title="等级值"
                  dataIndex="sort"
                  key="sort"
                  width="10%"
                />

                <Column
                  title="分销员等级名称"
                  key="distributorLevelName"
                  width="15%"
                  render={(row) => {
                    return (
                      <FormItem>
                        {getFieldDecorator(
                          'distributorLevelName' + row.mockId,
                          {
                            initialValue: row.distributorLevelName,
                            rules: [
                              {
                                required: true,
                                whitespace: true,
                                message: '请填写分销员等级名称'
                              },
                              {
                                validator: (_rule, value, callback) => {
                                  let levelNames = store
                                    .state()
                                    .getIn(['multistage', 'distributorLevels'])
                                    .toJS()
                                    .filter((item) => item.sort != row.sort)
                                    .map((item) =>
                                      item.distributorLevelName
                                        ? item.distributorLevelName.trim()
                                        : ''
                                    );
                                  if (
                                    levelNames.includes(value && value.trim())
                                  ) {
                                    callback('分销员等级名称不能重复');
                                    return;
                                  }
                                  callback();
                                }
                              }
                            ]
                          }
                        )(
                          <Input
                            disabled={row.sort == 1}
                            onChange={async (e) => {
                              await changeDistributorLevelValue(
                                row.sort,
                                'distributorLevelName',
                                e.target.value
                              );
                              form.validateFields(
                                null,
                                { force: true },
                                () => {}
                              );
                            }}
                          />
                        )}
                      </FormItem>
                    );
                  }}
                />

                <Column
                  title="升级规则"
                  key="salesThreshold"
                  width="35%"
                  render={(row) => {
                    if (row.sort == 1) {
                      return <span>默认成为分销员后即是该等级</span>;
                    }
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <FormItem>
                          <span style={styles.ruleLeft}>
                            <Checkbox
                              checked={row.salesFlag}
                              onChange={async (e) => {
                                await changeDistributorLevelValue(
                                  row.sort,
                                  'salesFlag',
                                  e.target.checked
                                );
                                form.validateFields(
                                  ['recordFlag' + row.mockId],
                                  { force: true },
                                  null
                                );
                              }}
                            >
                              销售额达到
                            </Checkbox>
                          </span>
                          <span style={styles.ruleRight}>
                            {getFieldDecorator('recordFlag' + row.mockId, {
                              rules: [
                                {
                                  required: row.salesFlag,
                                  message: '销售额不能为空'
                                }
                              ],
                              initialValue: row.salesThreshold
                            })(
                              <InputNumber
                                min={1}
                                max={99999999}
                                precision={0}
                                style={{ width: 100, margin: 5 }}
                                value={row.salesThreshold}
                                onChange={(val) => {
                                  changeDistributorLevelValue(
                                    row.sort,
                                    'salesThreshold',
                                    val
                                  );
                                }}
                              />
                            )}
                            元
                          </span>
                        </FormItem>
                        <FormItem>
                          <span style={styles.ruleLeft}>
                            <Checkbox
                              checked={row.recordFlag}
                              onChange={async (e) => {
                                await changeDistributorLevelValue(
                                  row.sort,
                                  'recordFlag',
                                  e.target.checked
                                );
                                form.validateFields(
                                  ['recordThreshold' + row.mockId],
                                  { force: true },
                                  null
                                );
                              }}
                            >
                              到账收益额达到
                            </Checkbox>
                          </span>
                          <span style={styles.ruleRight}>
                            {getFieldDecorator('recordThreshold' + row.mockId, {
                              rules: [
                                {
                                  required: row.recordFlag,
                                  message: '到账收益额不能为空'
                                }
                              ],
                              initialValue: row.recordThreshold
                            })(
                              <InputNumber
                                min={1}
                                max={99999999}
                                precision={0}
                                style={{ width: 100, margin: 5 }}
                                onChange={(val) => {
                                  changeDistributorLevelValue(
                                    row.sort,
                                    'recordThreshold',
                                    val
                                  );
                                }}
                              />
                            )}
                            元
                          </span>
                        </FormItem>
                        <FormItem>
                          <span style={styles.ruleLeft}>
                            <Checkbox
                              checked={row.inviteFlag}
                              onChange={async (e) => {
                                await changeDistributorLevelValue(
                                  row.sort,
                                  'inviteFlag',
                                  e.target.checked
                                );
                                form.validateFields(
                                  ['inviteThreshold' + row.mockId],
                                  { force: true },
                                  null
                                );
                              }}
                            >
                              邀请人数达到
                            </Checkbox>
                          </span>
                          <span style={styles.ruleRight}>
                            {getFieldDecorator('inviteThreshold' + row.mockId, {
                              rules: [
                                {
                                  required: row.inviteFlag,
                                  message: '邀请人数不能为空'
                                }
                              ],
                              initialValue: row.inviteThreshold
                            })(
                              <InputNumber
                                min={1}
                                max={99999999}
                                precision={0}
                                style={{ width: 100, margin: 5 }}
                                onChange={(val) => {
                                  changeDistributorLevelValue(
                                    row.sort,
                                    'inviteThreshold',
                                    val
                                  );
                                }}
                              />
                            )}
                            人
                          </span>
                        </FormItem>
                      </div>
                    );
                  }}
                />

                <Column
                  title="佣金返利"
                  key="commissionRate"
                  width="30%"
                  render={(row, _, index) => {
                    const levelSize = multistage.get('distributorLevels').size;
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <FormItem>
                          <span style={styles.ruleLeft}>佣金比例</span>
                          <span style={styles.ruleRight}>
                            {getFieldDecorator('commissionRate' + row.mockId, {
                              rules: [
                                {
                                  required: true,
                                  message: '佣金比例不能为空'
                                }
                              ],
                              initialValue: row.commissionRate
                            })(
                              <InputNumber
                                min={0}
                                max={100}
                                precision={0}
                                style={{ width: 70, margin: 5 }}
                                onChange={(val) => {
                                  changeDistributorLevelValue(
                                    row.sort,
                                    'commissionRate',
                                    val
                                  );
                                }}
                              />
                            )}
                            %
                          </span>
                        </FormItem>
                        <FormItem>
                          <span style={styles.ruleLeft}>佣金提成比例</span>
                          <span style={styles.ruleRight}>
                            {getFieldDecorator('percentageRate' + row.mockId, {
                              rules: [
                                {
                                  required: true,
                                  message: '佣金提成比例不能为空'
                                }
                              ],
                              initialValue: row.percentageRate
                            })(
                              <InputNumber
                                min={0}
                                max={100}
                                precision={0}
                                style={{ width: 70, margin: 5 }}
                                onChange={(val) => {
                                  changeDistributorLevelValue(
                                    row.sort,
                                    'percentageRate',
                                    val
                                  );
                                }}
                              />
                            )}
                            %
                          </span>
                        </FormItem>
                        {levelSize == index + 1 && (
                          <div>
                            {levelSize < 5 && (
                              <a onClick={() => addDistributorLevel()}>添加</a>
                            )}
                            &nbsp;
                            {levelSize != 1 && (
                              <a
                                onClick={() => {
                                  if (!row.distributorLevelId) {
                                    removeDistributorLevel();
                                  } else {
                                    const confirm = Modal.confirm;
                                    confirm({
                                      title: '删除分销员等级',
                                      content: '是否删除当前分销员等级？',
                                      onOk() {
                                        deleteDistributorLevel(
                                          row.distributorLevelId
                                        );
                                      }
                                    });
                                  }
                                }}
                              >
                                删除
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }}
                />
              </DataGrid>
            </GridDiv>
          </FormItem>

          <FormItem {...formItemLayout} label="分销员等级规则">
            <LevelDescEditor store={store} multistage={multistage} />
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

  _handleSubmit = (e) => {
    e.preventDefault();
    const form = this.props.form as WrappedFormUtils;
    form.validateFields(
      null,
      {
        force: true
      },
      (errs) => {
        if (!errs) {
          this._store.saveMultistageFunc();
        }
      }
    );
  };
}

class LevelDescEditor extends React.Component<any, any> {
  shouldComponentUpdate(_nextProps) {
    const multistage = this.props.multistage;
    if (multistage && multistage.get('distributorLevelDesc')) {
      return false;
    }
    return true;
  }

  render() {
    const { store, multistage } = this.props;
    return (
      <UEditor
        ref={(UEditor) => {
          store.setLevelEditor((UEditor && UEditor.editor) || {});
        }}
        id="level-desc"
        key="level-desc"
        height="320"
        content={multistage.get('distributorLevelDesc')}
        insertImg={() => {
          store.setVisible(1, 2);
          store.setActiveEditor('level');
        }}
        chooseImgs={[]}
        imgType={store.state().get('imgType')}
        maximumWords={500}
      />
    );
  }
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
  },
  ruleRight: {
    display: 'inline-block',
    width: '50%',
    textAlign: 'left'
  },
  ruleLeft: {
    display: 'inline-block',
    width: '50%',
    textAlign: 'right'
  }
};
