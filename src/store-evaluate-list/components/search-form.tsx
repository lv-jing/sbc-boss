import React from 'react';
import { Relax } from 'plume2';
import { Form, Select, Input, Button, Row, Col } from 'antd';
import { SelectGroup, noop } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      onFormChange: Function;
      onSearch: Function;
      form: any;
    };
  };

  static relaxProps = {
    onFormChange: noop,
    onSearch: noop,
    form: 'form'
  };

  render() {
    const { onFormChange, onSearch, form } = this.props.relaxProps;

    return (
      <Form className="filter-content" layout="inline">
        
            <FormItem>
              <Input
                addonBefore={<p style={{width:108}}><FormattedMessage id="Store.StoreName" /></p>}
                style={{width: 300}}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  onFormChange({
                    field: 'storeName',
                    value
                  });
                }}
              />
            </FormItem>
            
            <FormItem>
              <SelectGroup
                getPopupContainer={() => document.getElementById('page-content')}
                label={<p style={{width:108}}><FormattedMessage id="Store.TimeLimit" /></p>}
                style={{ width: 170 }}
                value={form.get('scoreCycle')}
                onChange={(value) => {
                  value = value === '' ? null : value;
                  onFormChange({
                    field: 'scoreCycle',
                    value
                  });
                }}
              >
                <Option value="2">Nearly 180 days</Option>
                <Option value="1">Nearly 90 days</Option>
                <Option value="0">Nearly 30 days</Option>
              </SelectGroup>
            </FormItem>
          
          
            <FormItem>
              <Button
                icon="search"
                type="primary"
                onClick={() => onSearch()}
                htmlType="submit"
              >
                {<FormattedMessage id="Store.Search" />}
              </Button>
            </FormItem>
          
      </Form>
    );
  }
}
