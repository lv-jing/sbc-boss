import React from 'react';
import { Relax } from 'plume2';
import { List } from 'immutable';
import {
  Button,
  Input,
  Form,
  Switch,
  InputNumber,
  Modal,
  Cascader
} from 'antd';
import { noop, ValidConst, AuthWrapper, isSystem } from 'qmkit';
import UEditor from '../../../web_modules/qmkit/ueditor/Ueditor';
import styled from 'styled-components';
import { datePickerOptions } from '../date-picker';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 2 },
    sm: { span: 2 }
  },
  wrapperCol: {
    span: 14,
    xs: { span: 14 },
    sm: { span: 19 }
  }
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 14, offset: 0 },
    sm: { span: 19, offset: 2 }
  }
};

const GreyText = styled.p`
  color: #999999;
`;

const TableRow = styled.div`
  .ant-form-item-control {
    line-height: 1.15;
  }
`;

@Relax
export default class Setting extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      pointsConfig: any;
      onChange: Function;
      onSaveSetting: Function;
      refDetailEditor: Function;
      setVisible: Function;
      chooseImgs: List<any>;
      imgType: number;
    };
  };

  static relaxProps = {
    pointsConfig: 'pointsConfig',
    onChange: noop,
    onSaveSetting: noop,
    refDetailEditor: noop,
    setVisible: noop,
    chooseImgs: 'chooseImgs',
    imgType: 'imgType'
  };

  componentDidMount() {
    this.setState({});
  }

  render() {
    const { pointsConfig, onChange } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;

    const pointsExpireDate = pointsConfig.get('pointsExpireMonth')
      ? [
          pointsConfig.get('pointsExpireMonth').toString(),
          pointsConfig.get('pointsExpireDay')
            ? pointsConfig.get('pointsExpireDay').toString()
            : null
        ]
      : [];

    return (
      <Form onSubmit={isSystem(this._handleSubmit)}>
        <FormItem {...formItemLayout} label="商城积分体系：">
          {getFieldDecorator('status')(
            <Switch
              checkedChildren="开"
              unCheckedChildren="关"
              checked={pointsConfig.get('status') == 1}
              onChange={(e) =>
                onChange({
                  field: 'status',
                  value: e.valueOf() ? 1 : 0
                })
              }
            />
          )}
          <GreyText>
            商城积分体系是否可用，关闭时，隐藏前端会员积分模块、积分抵扣、任务模块、积分商城入口，如需关闭请谨慎操作
          </GreyText>
        </FormItem>

        <FormItem {...formItemLayout} label="积分抵扣比例：">
          <span className="ant-form-text">100积分：1元</span>
          <GreyText>如需进行调整请联系系统工程师</GreyText>
        </FormItem>

        <FormItem {...formItemLayout} label="积分抵扣规则：">
          <span className="ant-form-text">积分抵扣使用限额：满 </span>
          {getFieldDecorator('overPointsAvailable', {
            initialValue: pointsConfig.get('overPointsAvailable'),
            rules: [{ pattern: ValidConst.number, message: '正整数' }]
          })(
            <InputNumber
              max={99999999}
              min={1}
              onChange={(val) => {
                onChange({
                  field: 'overPointsAvailable',
                  value: val
                });
              }}
            />
          )}
          <span className="ant-form-text"> 积分，可进行抵扣</span>
          <GreyText>会员积分值满足该条件时可进行抵扣</GreyText>
        </FormItem>

        <FormItem {...formItemLayoutWithOutLabel} label="">
          <span className="ant-form-text">
            积分抵扣限额：最高可抵扣订单支付金额{' '}
          </span>
          {getFieldDecorator('maxDeductionRate', {
            initialValue: pointsConfig.get('maxDeductionRate'),
            rules: [
              {
                pattern: ValidConst.discount,
                message: '请填写正确的积分抵扣比例'
              }
            ]
          })(
            <Input
              style={{ width: '90px', marginRight: 8 }}
              onChange={(e: any) =>
                onChange({
                  field: 'maxDeductionRate',
                  value: e.target.value
                })
              }
            />
          )}
          <span className="ant-form-text"> %</span>
          <GreyText>积分抵扣金额最高可抵扣限制</GreyText>
        </FormItem>

        <FormItem {...formItemLayout} label="积分失效时间：">
          <span className="ant-form-text">次年</span>
          {getFieldDecorator('pointsExpireDate', {
            initialValue: pointsExpireDate
          })(
            <Cascader
              style={{ width: '120px' }}
              placeholder={'请选择'}
              options={datePickerOptions}
              defaultValue={[
                pointsConfig.get('pointsExpireMonth'),
                pointsConfig.get('pointsExpireDay')
              ]}
              displayRender={(label) => label.join('  ')}
              onChange={(e: any) => {
                this._changeExpireDate(e);
              }}
            />
          )}
          <GreyText>
            到次年日期时，上一年次获得积分数进行清空，若积分不进行清空，请维护为0月0日
          </GreyText>
        </FormItem>

        <TableRow>
          <FormItem {...formItemLayout} label="积分说明">
            <UEditor
              ref={(UEditor) => {
                this.props.relaxProps.refDetailEditor(
                  (UEditor && UEditor.editor) || {}
                );
              }}
              id="intro"
              height="520"
              content={pointsConfig.get('remark')}
              insertImg={() => this._handleClick()}
              chooseImgs={this.props.relaxProps.chooseImgs.toJS()}
              imgType={this.props.relaxProps.imgType}
            />
          </FormItem>
        </TableRow>

        <AuthWrapper functionName={'f_points_setting_edit'}>
          <div className="bar-button">
            <Button type="primary" onClick={isSystem(this._handleSubmit)}>
              保存
            </Button>
          </div>
        </AuthWrapper>
      </Form>
    );
  }

  _changeExpireDate = (date) => {
    const { onChange } = this.props.relaxProps;
    const pointsExpireMonth = date[0];
    onChange({
      field: 'pointsExpireMonth',
      value: pointsExpireMonth
    });
    const pointsExpireDay = date[1];
    onChange({
      field: 'pointsExpireDay',
      value: pointsExpireDay
    });
  };

  /**
   * 提交
   * @param e
   * @private
   */
  _handleSubmit = () => {
    const form = this.props.form;
    const status = this.props.relaxProps.pointsConfig.get('status');
    const { onSaveSetting } = this.props.relaxProps;
    form.validateFields(null, (errs) => {
      //如果校验通过
      if (!errs) {
        if (!status) {
          Modal.confirm({
            title: '确定要关闭积分嘛？',
            content: '关闭后已获得积分将不可使用，积分将不再发放',
            onOk() {
              onSaveSetting();
            }
          });

          return;
        }

        onSaveSetting();
      }
    });
  };

  /**
   * 调用图片库弹框
   * @private
   */
  _handleClick = () => {
    this.props.relaxProps.setVisible(10, 2);
  };
}
