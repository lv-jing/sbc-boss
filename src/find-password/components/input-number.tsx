import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { Relax } from 'plume2';
import { noop } from 'qmkit';

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
export default class InputNumber extends React.Component<any, any> {
  props: {
    relaxProps?: {
      phoneInputDisable: boolean;
      phone: string;
      fetchPhoneExist: Function;
      onInputPhone: Function;
    };
  };

  static relaxProps = {
    phoneInputDisable: 'phoneInputDisable',
    phone: 'phone',
    fetchPhoneExist: noop,
    onInputPhone: noop
  };

  render() {
    const {
      fetchPhoneExist,
      onInputPhone,
      phoneInputDisable,
      phone
    } = this.props.relaxProps;

    return (
      <Form>
        <FormItem {...formItemLayout} label="Email">
          <Input
            placeholder="Email address"
            onChange={(e) => onInputPhone(e.currentTarget.value)}
            value={phone ? phone : null}
            disabled={phoneInputDisable}
          />
        </FormItem>
        <Row>
          <Col span={6}>&nbsp;</Col>
          <Col span={8}>
            <Button type="primary" onClick={() => fetchPhoneExist()}>
              Next
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
