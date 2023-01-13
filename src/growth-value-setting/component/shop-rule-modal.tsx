import * as React from 'react';
import { Modal, Form, Input, Checkbox } from 'antd';
import { Relax } from 'plume2';
import { noop, Tips, ValidConst, isSystem } from 'qmkit';
import { IMap } from 'typings/globalType';
import { Map } from 'immutable';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

@Relax
export default class ShopRuleModal extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(ShopRuleModalForm as any);
  }

  props: {
    relaxProps?: {
      modalVisible: boolean;
      formData: IMap;
      parentRate: number;
      useParentRate: boolean;
      doEdit: Function;
      editFormData: Function;
      modal: Function;
      useParentRateF: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalVisible: 'modalVisible',
    // 类目信息
    formData: 'formData',
    // 父级类目成长值获取比例
    parentRate: 'parentRate',
    // 是否使用上级类目成长值获取比例
    useParentRate: 'useParentRate',
    // 编辑类目
    doEdit: noop,
    // 保存编辑类目数据
    editFormData: noop,
    // 关闭弹窗
    modal: noop,
    // 是否使用上级类目成长值获取比例方法
    useParentRateF: noop
  };

  render() {
    const { modalVisible } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    if (!modalVisible) {
      return null;
    }
    return (
       <Modal  maskClosable={false}
        title={'编辑比例'}
         
        visible={modalVisible}
        onCancel={this._handleModelCancel}
        onOk={isSystem(this._handleSubmit)}
      >
        <WrapperForm
          ref={(form) => (this._form = form)}
          relaxProps={this.props.relaxProps}
        />
      </Modal>
    );
  }

  /**
   * 提交
   */
  _handleSubmit = () => {
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs) => {
      if (!errs) {
        const { doEdit, formData } = this.props.relaxProps;
        //提交
        if (formData.get('cateName')) {
          doEdit();
        }
      } else {
        this.setState({});
      }
    });
  };

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { modal } = this.props.relaxProps;
    modal();
  };
}

class ShopRuleModalForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      formData: IMap;
      parentRate: number;

      closeModal: Function;
      editFormData: Function;
      useParentRateF: Function;
    };
    form;
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { formData } = this.props.relaxProps;
    const cateParentId = formData.get('cateParentId');
    const growthValueRate = formData.get('growthValueRate');
    const isParentGrowthValueRate = formData.get('isParentGrowthValueRate');
    const { getFieldDecorator } = this.props.form;

    return (
      <Form className="login-form">
        <FormItem {...formItemLayout} label="类目名称">
          {formData.get('cateName')
            ? formData.get('cateName')
            : '无'}
        </FormItem>
        <FormItem {...formItemLayout} label="上级类目">
          {formData.get('cateParentName')
            ? formData.get('cateParentName')
            : '无'}
        </FormItem>
        <FormItem {...formItemLayout} label="成长值获取比例" hasFeedback>
          {getFieldDecorator('growthValueRate', {
            rules: [
              { required: true, message: '请填写获取比例' },
              { pattern: ValidConst.discount, message: '请填写正确的获取比例' }
            ],
            initialValue: growthValueRate,
            onChange: this._changeCateRate
          })(<Input style={{ width: '60%' }} placeholder="请输入类目获取比例" />)}
          <span>
            &nbsp;%&nbsp;&nbsp;&nbsp;{cateParentId == 0 ||
            cateParentId == null ? null : (
              <Checkbox
                checked={isParentGrowthValueRate == 1}
                onChange={(e: any) => this._checkedHandle(e.target.checked)}
              >
                使用上级类目比例
              </Checkbox>
            )}
          </span>
          <div>
            <Tips title="请填写0-100间的数字，精确到小数点后两位" />
          </div>
        </FormItem>
      </Form>
    );
  }

  /**
   * 修改类目成长值获取比例
   */
  _changeCateRate = (e) => {
    const { editFormData, useParentRateF, formData } = this.props.relaxProps;
    const isParentGrowthValueRate = formData.get('isParentGrowthValueRate');
    editFormData(Map({ growthValueRate: e.target.value ? e.target.value : 0 }));
    if (isParentGrowthValueRate == 1) {
      useParentRateF(0);
    }
  };

  /**
   * 选中使用上级类目事件
   * @param checked
   */
  _checkedHandle(checked) {
    const { editFormData, parentRate, useParentRateF } = this.props.relaxProps;
    editFormData({ growthValueRate: checked ? parentRate : null });
    this.props.form.setFieldsValue({
      growthValueRate: checked ? parentRate : null
    });
    useParentRateF(checked ? 1 : 0);
  }
}
