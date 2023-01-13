import React from 'react';

import { Relax } from 'plume2';
import { Form, Input, Button } from 'antd';
import { noop } from 'qmkit';

const FormItem = Form.Item;
@Relax
export default class SearchHead extends React.Component<any, any> {
  props: {
    relaxProps?: {
      name: string;
      onFormFieldChange: Function;
      search: Function;
    };
  };

  static relaxProps = {
    name: 'name',
    onFormFieldChange: noop,
    search: noop
  };

  state = {
    startValue: null,
    endValue: null,
    endOpen: false
  };

  render() {
    const { name, onFormFieldChange, search } = this.props.relaxProps;
    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            addonBefore="标签名称"
            value={name}
            onChange={(e: any) => {
              onFormFieldChange('name', e.target.value);
            }}
          />
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            icon="search"
            onClick={() => {
              search();
            }}
          >
            搜索
          </Button>
        </FormItem>
      </Form>
    );
  }
}
