import * as React from 'react';
import { List } from 'immutable';
import { Table, Switch, Button, Form, InputNumber } from 'antd';
import { noop, AuthWrapper, ValidConst, isSystem } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';

declare type IList = List<any>;

const FormItem = Form.Item;

export default class BasicRule extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      basicRules: IList;
      saveBasicRules: Function;
      editStatusByConfigType: Function;
      editContextByConfigType: Function;
    };
  };

  static relaxProps = {
    basicRules: 'basicRules',
    saveBasicRules: noop,
    editStatusByConfigType: noop,
    editContextByConfigType: noop
  };

  render() {
    const { basicRules } = this.props.relaxProps;

    return (
      <div className="resetSmallTable noBorderTable">
        <Form layout="inline" onSubmit={isSystem(this._handleSubmit)}>
          <Table
            rowKey="basicRuleId"
            columns={this._columns}
            dataSource={basicRules.toJS()}
            pagination={false}
          />

          <AuthWrapper functionName={'f_points_setting_edit'}>
            <div className="bar-button">
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </div>
          </AuthWrapper>
        </Form>
      </div>
    );
  }

  _columns = [
    {
      title: '类型',
      dataIndex: 'configName',
      key: 'configName',
      width: '10%',
      render: (_text, record) => (
        <div style={{ textAlign: 'right' }}>
          {record.configName + '：'}
        </div>
      )
    },
    {
      title: '说明',
      key: 'configContext',
      dataIndex: 'configContext',
      render: (_text, record, index) => (
        <div style={{ textAlign: 'left' }}>
          <FormItem required={record.status == 1} label={record.valueName}>
            {this.props.form.getFieldDecorator('value' + record.id + record.status, {
              initialValue: this._parseContext(record.context,'value'),
              rules: [
                { pattern: ValidConst.number, message: '正整数' },
                { required: record.status == 1, message: '请输入获得积分' },
                {
                  configId: record.id + '' + record.status,
                  validator: (_rule, value, callback) => {
                    let limit = this._parseContext(record.context,'limit');

                    // form表单initialValue方式赋值不成功，这里通过setFieldsValue方法赋值
                    const fieldsValue = this.props.form.getFieldsValue();
                    // 同步值
                    let limitFields = {};
                    Object.getOwnPropertyNames(fieldsValue).forEach(
                      (field) => {
                        if (field === 'limit' + _rule.configId) {
                          limitFields[field] = limit;
                        }
                      }
                    );
                    // update
                    this.props.form.setFieldsValue(limitFields);

                    if (value) {
                      if (value > parseInt(limit)) {
                        callback('获得积分数不可大于限额');
                        return;
                      }
                    }
                    callback();
                  }
                }
              ]
            })(
              <InputNumber
                max={99999999}
                min={1}
                className="resetInputWidth"
                onChange={async (val) => {
                  const {
                    editContextByConfigType
                  } = this.props.relaxProps;
                  editContextByConfigType(index, 'value', val);
                }}
              />
            )}
          </FormItem>

          {JSON.parse(record.context).hasOwnProperty('continue') ? (
            <FormItem required={record.status == 1} label="连续">
              {this.props.form.getFieldDecorator('continue' + record.id + record.status, {
                initialValue: this._parseContext(record.context,'continue'),
                rules: [
                  { pattern: ValidConst.number, message: '正整数' },
                  {
                    required: record.status == 1,
                    message: '请输入连续天数'
                  }
                ]
              })(
                <InputNumber
                  max={99999999}
                  min={1}
                  className="resetInputWidth"
                  onChange={async (val) => {
                    const {
                      editContextByConfigType
                    } = this.props.relaxProps;
                    editContextByConfigType(index, 'continue', val);
                  }}
                />
              )}
              <span className="ant-form-text"> 天</span>
            </FormItem>
          ) : null}

          {JSON.parse(record.context).hasOwnProperty('extra') ? (
            <FormItem required={record.status == 1} label="额外获得积分数">
              {this.props.form.getFieldDecorator('extra' + record.id + record.status, {
                initialValue: this._parseContext(record.context,'extra'),
                rules: [
                  { pattern: ValidConst.number, message: '正整数' },
                  {
                    required: record.status == 1,
                    message: '请输入额外获得积分数'
                  }
                ]
              })(
                <InputNumber
                  max={99999999}
                  min={1}
                  className="resetInputWidth"
                  onChange={async (val) => {
                    const {
                      editContextByConfigType
                    } = this.props.relaxProps;
                    editContextByConfigType(index, 'extra', val);
                  }}
                />
              )}
            </FormItem>
          ) : null}

          {JSON.parse(record.context).hasOwnProperty('limit') ? (
            <FormItem required={record.status == 1} label="可获得积分限额">
              {this.props.form.getFieldDecorator('limit' + record.id + record.status, {
                initialValue: this._parseContext(record.context,'limit'),
                rules: [
                  { pattern: ValidConst.number, message: '正整数' },
                  {
                    required: record.status == 1,
                    message: '请输入可获得积分限额'
                  },
                  {
                    configId: record.id + '' + record.status,
                    validator: (_rule, value, callback) => {
                      let growthValue = this._parseContext(record.context,'value');

                      // form表单initialValue方式赋值不成功，这里通过setFieldsValue方法赋值
                      const fieldsValue = this.props.form.getFieldsValue();
                      // 同步值
                      let valueFields = {};
                      Object.getOwnPropertyNames(fieldsValue).forEach(
                        (field) => {
                          if (field === 'value' + _rule.configId) {
                            valueFields[field] = growthValue;
                          }
                        }
                      );
                      // update
                      this.props.form.setFieldsValue(valueFields);

                      if (value) {
                        if (value < parseInt(growthValue)) {
                          callback('限额不得小于获得积分数');
                          return;
                        }
                      }
                      callback();
                    }
                  }
                ]
              })(
                <InputNumber
                  max={99999999}
                  min={1}
                  className="resetInputWidth"
                  onChange={async (val) => {
                    const {
                      editContextByConfigType
                    } = this.props.relaxProps;
                    editContextByConfigType(index, 'limit', val);
                  }}
                />
              )}
            </FormItem>
          ) : null}

          <p style={{ color: '#999999'}}>{record.remark}</p>
        </div>
      )
    },
    {
      title: '操作',
      key: 'option',
      render: (_text, record, index) => (
        <div>
          <Switch
            checkedChildren="开"
            unCheckedChildren="关"
            onChange={(checked) => {
              const { editStatusByConfigType } = this.props.relaxProps;
              editStatusByConfigType(index, checked);
            }}
            defaultChecked={record.status == 1}
          />
        </div>
      )
    }
  ];

  /**
   * 表单提交
   */
  _handleSubmit = (e) => {
    e.preventDefault();
    const form = this.props.form as WrappedFormUtils;
    const { saveBasicRules } = this.props.relaxProps;
    form.validateFields(null, (errs) => {
      if (!errs) {
        saveBasicRules();
      }
    });
  };

  /**
   * 解析积分数据
   * @param context
   */
  _parseContext(context: string, type: string) {
    try {
      if (context) return JSON.parse(context)[type];
    } catch (e) {
      if (e instanceof Error) {
        console.error('解析积分数据'+type+'错误');
      }
    }
  }

}

