import React from 'react';
import { Relax } from 'plume2';
import { Form, Select, Input, Button, DatePicker, Row, Col } from 'antd';
import { SelectGroup, noop, Const } from 'qmkit';
import { FormattedMessage } from 'react-intl';
// import { fromJS } from 'immutable';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

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
        <Row>
          <Col span={8}>
            <FormItem>
              <Input
                addonBefore={<p style={{width:108}}><FormattedMessage id="Product.storeName" /></p>}
                style={{width:300}}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  onFormChange({
                    field: 'storeName',
                    value
                  });
                }}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              <Input
                addonBefore={<p style={{width:108}}><FormattedMessage id="Product.orderNo" /></p>}
                style={{width:300}}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  onFormChange({
                    field: 'orderNo',
                    value
                  });
                }}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              <Input
                addonBefore={<p style={{width:108}}><FormattedMessage id="Product.goodsInfoName" /></p>}
                style={{width:300}}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  onFormChange({
                    field: 'goodsInfoName',
                    value
                  });
                }}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              <RangePicker
                getCalendarContainer={() => document.getElementById('page-content')}
                style={{width:300}}
                onChange={(e) => {
                  let beginTime = null;
                  let endTime = null;
                  if (e.length > 0) {
                    beginTime = e[0].format(Const.DAY_FORMAT).toString();
                    endTime = e[1].format(Const.DAY_FORMAT).toString();
                  }
                  onFormChange({
                    field: 'beginTime',
                    value: beginTime
                  });
                  onFormChange({
                    field: 'endTime',
                    value: endTime
                  });
                }}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              <SelectGroup
                getPopupContainer={() => document.getElementById('page-content')}
                label={<p style={{width:108}}><FormattedMessage id="Product.isShow" /></p>}
                style={{ width: 170 }}
                value={form.get('isShow')}
                onChange={(value) => {
                  value = value === '' ? null : value;
                  onFormChange({
                    field: 'isShow',
                    value
                  });
                }}
              >
                <Option value="-1">all</Option>
                <Option value="1">yes</Option>
                <Option value="0">no</Option>
              </SelectGroup>
            </FormItem>
          </Col>
          <Col span={24} style={{textAlign:'center'}}>
            <FormItem>
              <Button
                icon="search"
                type="primary"
                onClick={() => onSearch()}
                htmlType="submit"
              >
                <FormattedMessage id="Product.search" />
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
