import { IMap } from 'typings/globalType';
import * as React from 'react';
import { Relax } from 'plume2';
import { noop } from 'qmkit';
import { Col, Form, Row, Input } from 'antd';
import { Map, fromJS } from 'immutable';
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
    sm: { span: 18 }
  }
};

@Relax
export default class Freight extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    form?: any;
    relaxProps?: {
      goods: IMap;
      editGoods: Function;
      updateFreightForm: Function;
    };
  };

  static relaxProps = {
    // 商品基本信息
    goods: 'goods',
    // 修改商品基本信息
    editGoods: noop,
    updateFreightForm: noop
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(FreightForm);
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const relaxProps = this.props.relaxProps;
    const { updateFreightForm } = relaxProps;
    return (
      <div style={{ marginBottom: 20 }}>
        <div
          className="detailTitle"
          style={{ marginBottom: 10, marginTop: 10 }}
        >
          物流信息
        </div>
        <div>
          <WrapperForm
            ref={(form) => updateFreightForm(form)}
            {...{ relaxProps: relaxProps }}
          />
        </div>
      </div>
    );
  }
}

class FreightForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { goods } = this.props.relaxProps;

    return (
      <Form>
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label="物流重量">
              {getFieldDecorator('goodsWeight', {
                rules: [
                  {
                    required: true,
                    message: '请填写物流重量'
                  },
                  {
                    pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,3})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9]{1,2})?$)/,
                    message: '请填写三位小数的合法数字'
                  },
                  {
                    type: 'number',
                    min: 0.001,
                    message: '最小值为0.001',
                    transform: function(value) {
                      return isNaN(parseFloat(value))
                        ? 0.001
                        : parseFloat(value);
                    }
                  },
                  {
                    type: 'number',
                    max: 9999.999,
                    message: '最大值为9999.999',
                    transform: function(value) {
                      return isNaN(parseFloat(value))
                        ? 0.001
                        : parseFloat(value);
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'goodsWeight'),
                initialValue: goods.get('goodsWeight')
              })(<Input placeholder="不可小于0.001" />)}
            </FormItem>
          </Col>
          <Col span={2}>
            <div style={{ padding: 10 }}>kg</div>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label="物流体积">
              {getFieldDecorator('goodsCubage', {
                rules: [
                  {
                    required: true,
                    message: '请填写物流体积'
                  },
                  {
                    pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,6})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9]{1,5})?$)/,
                    message: '请填写六位小数的合法数字'
                  },
                  {
                    type: 'number',
                    min: 0.000001,
                    message: '最小值为0.000001',
                    transform: function(value) {
                      return isNaN(parseFloat(value))
                        ? 0.000001
                        : parseFloat(value);
                    }
                  },
                  {
                    type: 'number',
                    max: 999.999999,
                    message: '最大值为999.999999',
                    transform: function(value) {
                      return isNaN(parseFloat(value))
                        ? 0.000001
                        : parseFloat(value);
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'goodsCubage'),
                initialValue: goods.get('goodsCubage')
              })(<Input placeholder="不可小于0.000001" />)}
            </FormItem>
          </Col>
          <Col span={2}>
            <div style={{ padding: 10 }}>m³</div>
          </Col>
        </Row>
      </Form>
    );
  }

  /**
   * 修改商品项
   */
  _editGoods = (key: string, e) => {
    const { editGoods } = this.props.relaxProps;
    if (e && e.target) {
      e = e.target.value;
    }

    let goods = Map({
      [key]: fromJS(e)
    });

    editGoods(goods);
  };
}
