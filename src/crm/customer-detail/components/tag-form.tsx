import React from 'react';
import { Store, Relax } from 'plume2';
import PropTypes from 'prop-types';
import { Form, Select } from 'antd';
import { noop } from 'qmkit';

const FormItem = Form.Item;
const Option = Select.Option;
@Relax
export default class TagForm extends React.Component<any, any> {
  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  props: {
    form;
    relaxProps?: {
      tagList: any;
      groupNames: any;
      customerTagList: any;
      onFormChange: Function;
    };
  };

  static relaxProps = {
    tagList: 'tagList',
    groupNames: 'groupNames',
    customerTagList: 'customerTagList',
    onFormChange: noop
  };

  render() {
    const {
      form: { getFieldDecorator },
      relaxProps: { onFormChange, tagList, customerTagList }
    } = this.props;
    const list = [];
    customerTagList.map((item) => {
      list.push(item.tagId);
    });

    return (
      <Form>
        <FormItem label="会员标签">
          {getFieldDecorator('customerTagList', {
            initialValue: list,
            rules: [{ required: true, message: '请选择会员标签' }]
          })(
            <Select
              mode="multiple"
              placeholder="请选择会员标签"
              onChange={(value) =>
                onFormChange({
                  field: 'customerTagList',
                  value: value
                })
              }
            >
              {tagList.map((tag) => {
                return (
                  <Option key={tag.id} value={tag.id}>
                    {tag.name}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
      </Form>
    );
  }
}
