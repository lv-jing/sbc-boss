import React from 'react';
import { Relax } from 'plume2';
import { Button, Form, Input } from 'antd';
import { noop } from 'qmkit';

const FormItem = Form.Item;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      onFormChange: Function;
      onSearch: Function;
      pageSize: number;
      likeSensitiveWords: string;
    };
  };

  static relaxProps = {
    onFormChange: noop,
    onSearch: noop,
    pageSize: 'pageSize',
    likeSensitiveWords: 'likeSensitiveWords'
  };
  render() {
    const {
      onFormChange,
      onSearch,
      likeSensitiveWords
    } = this.props.relaxProps;

    return (
      <div style={{ marginTop: 16 }}>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore="敏感词"
              value={likeSensitiveWords}
              onChange={(e) => {
                const value = (e.target as any).value;
                onFormChange(value);
              }}
            />
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={() => onSearch()} htmlType="submit">
              搜索
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
