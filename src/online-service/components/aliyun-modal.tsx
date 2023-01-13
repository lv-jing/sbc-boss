import React from 'react';
import { IMap, Relax } from 'plume2';
import { Form, Input, Modal, Radio } from 'antd';
import { noop, QMMethod } from 'qmkit';

const RadioGroup = Radio.Group;
// const CheckboxGroup = Checkbox.Group;

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
};

/**
 * 生效终端
 * @type {{label: string; value: string}[]}
 */
// const plainOptions = [
//   { label: 'PC', value: '1' },
//   { label: 'APP', value: '2' },
//   { label: '移动端', value: '3' }
// ];

@Relax
export default class AliyunModal extends React.Component<any, any> {
  _form: any;

  constructor(props) {
    super(props);
  }

  props: {
    form: any;
    relaxProps?: {
      aliSmsVisible: boolean;
      aliYunCancel: Function;
      aliyunServer: IMap;
      onAliYunChange: Function;
      saveAliCof: Function;
    };
  };

  static relaxProps = {
    aliSmsVisible: 'aliSmsVisible',
    aliYunCancel: noop,
    aliyunServer: 'aliyunServer',
    onAliYunChange: noop,
    saveAliCof: noop
  };

  render() {
    const {
      aliSmsVisible,
      aliYunCancel,
      aliyunServer,
      onAliYunChange
    } = this.props.relaxProps;

    if (!aliSmsVisible) {
      return null;
    }

    const { getFieldDecorator } = this.props.form;

    return (
       <Modal  maskClosable={false}
        title="编辑阿里云客服"
        visible={aliSmsVisible}
        onOk={this._handleOK}
        onCancel={() => aliYunCancel()}
        width="600px"
      >
        <Form className="login-form">
          <FormItem {...formItemLayout} label="启用开关">
            <RadioGroup
              value={aliyunServer.get('enableFlag')}
              onChange={this._handleChange}
            >
              <Radio value={1}>启用</Radio>
              <Radio value={0}>禁用</Radio>
            </RadioGroup>
          </FormItem>

          {/*<FormItem {...formItemLayout} label="生效终端">*/}
          {/*  {getFieldDecorator('effectTerminal', {*/}
          {/*    initialValue: aliyunServer.get('effectTerminal'),*/}
          {/*    rules: [{ required: aliyunServer.get('enableFlag') != 0, message: '启用时请选择生效终端' }]*/}
          {/*  })(*/}
          {/*    <CheckboxGroup*/}
          {/*      options={plainOptions}*/}
          {/*      onChange={(val)=>onAliYunChange({field:'effectTerminal', value: val})}*/}
          {/*    />*/}
          {/*  )}*/}
          {/*</FormItem>*/}

          <FormItem {...formItemLayout} label="客服标题">
            {getFieldDecorator('serviceTitle', {
              initialValue: aliyunServer.get('serviceTitle'),
              rules: [
                { required: true, message: '请填写客服标题' },
                { max: 5, message: '不可超过5个字' },
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorEmoji(rule, value, callback, '客服标题');
                  }
                }
              ]
            })(
              <Input
                style={{ width: '96%' }}
                placeholder="请填写客服标题，最多5个字"
                onChange={(e) =>
                  onAliYunChange({ field: 'serviceTitle', value: e.target.value })
                }
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="客服链接">
            {getFieldDecorator('aliyunChat', {
              initialValue: aliyunServer.get('aliyunChat'),
              rules: [
                { required: true, message: '请填写客服链接' },
              ]
            })(
              <Input
                style={{ width: '96%' }}
                placeholder="请填写客服链接"
                onChange={(e) =>
                  onAliYunChange({ field: 'aliyunChat', value: e.target.value })
                }
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="客服key">
            {getFieldDecorator('aliKey', {
              initialValue: aliyunServer.get('key'),
              rules: [
                { required: true, message: '客服key' },
              ]
            })(
              <Input
                style={{ width: '96%' }}
                placeholder="请填写客服key"
                onChange={(e) =>
                  onAliYunChange({ field: 'key', value: e.target.value })
                }
              />
            )}
          </FormItem>

        </Form>
      </Modal>
    );
  }

  /**
   * 启用时请选择生效终端
   * @param _rule
   * @param value
   * @param callback
   */
  _handleChange = async (e) => {
    const { onAliYunChange } = this.props.relaxProps;
    await onAliYunChange({field:'enableFlag', value: (e as any).target.value})
    this.setState({enableFlag: (e as any).target.value})
  };



  /**
   * 保存弹框编辑
   * @private
   */
  _handleOK = () => {
    const form = this.props.form;
    const {
      saveAliCof
    } = this.props.relaxProps;

    form.validateFields(null, (errs) => {
    // if (values.effectTerminal.length < 1 && this.state.enableFlag == 1 ) {
    //   this.props.form.setFields({
    //     effectTerminal: {
    //       value: [],
    //       errors: [new Error('启用时请选择生效终端')]
    //     }
    //   });
    //   return;
    // }

      // console.log('handle ok =========>', errs, values);
      //如果校验通过
      if (!errs) {
        saveAliCof();
      } else {
        this.setState({});
      }
    });
  };
}
