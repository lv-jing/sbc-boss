import React from 'react';
import {Form, Modal, Radio, Switch} from 'antd';
import styled from 'styled-components';
import {Relax} from 'plume2';

import {noop, isSystem} from 'qmkit';

const GreyText = styled.p`
  color: #999999;
`;

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: {
    span: 3,
    xs: { span: 3 },
    sm: { span: 3 }
  },
  wrapperCol: {
    span: 20,
    xs: { span: 20 },
    sm: { span: 20 }
  }
};

@Relax
export default class Setting extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      growthValueConfig: any;
      switchChange: Function;
      onChange: Function;
      synchronizePointsRule: Function;
      userDefinedRule: Function;
    };
  };

  static relaxProps = {
    growthValueConfig: 'growthValueConfig',
    switchChange: noop,
    onChange: noop,
    synchronizePointsRule: noop,
    userDefinedRule: noop
  };

  render() {
    const { growthValueConfig } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label="成长值开关"
        >
          <Switch
            checkedChildren="开"
            unCheckedChildren="关"
            checked={growthValueConfig.get('status') == 1}
            onChange={isSystem((e) => {this._changeSwitch(e)})}
          />
          <GreyText>成长值体系关闭时，隐藏前端成长值入口，成长值明细，平台会员等级无法晋升，自营店铺不显示店铺会员tab页</GreyText>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="成长值获取规则"
        >
          {getFieldDecorator('rule', {
            onChange: this._changeRule.bind(this),
            initialValue: growthValueConfig.get('rule')
          })(
            <RadioGroup>
              <Radio value={1}>同步积分获取规则</Radio>
              <Radio value={0}>自定义获取规则</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Form>
    );
  }

  _changeSwitch = (checked) => {
    const { switchChange } = this.props.relaxProps;

    //开启时弹框提示：开启后不允许关闭
    if(checked){
      Modal.confirm({
        title: '确定要开启成长值吗？',
        content: '开启后不允许关闭',
        onOk() {
          switchChange(checked);
        }
      });
    }else{
      switchChange(checked);
    }
  };

  /**
   * 修改成长值规则
   */
  _changeRule = (e) => {
    const { onChange, synchronizePointsRule, userDefinedRule } = this.props.relaxProps;
    onChange({
      field: 'rule',
      value: e.target.value
    })
    if(e.target.value == 1){
      synchronizePointsRule();
    }else{
      userDefinedRule();
    }
  };
}
