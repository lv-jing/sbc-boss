import * as React from 'react';
import { Relax } from 'plume2';
import { Input, Button, Form, Select } from 'antd';
import { fromJS } from 'immutable';
import { noop } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;
@Relax
export default class Search extends React.Component<any, any> {
  props: {
    relaxProps?: {
      editSearchData: Function;
      pageSize: number;
    };
  };

  static relaxProps = {
    editSearchData: noop,
    pageSize: 'pageSize'
  };

  constructor(props) {
    super(props);

    this.state = {
      brandOptions: 'likeBrandName',
      brandOptionsValue: ''
    };
  }

  render() {
    return (
      <Form className="filter-content" layout="inline">
        {/*品牌名称、品牌别名搜索*/}
        <FormItem>
          <Input
            addonBefore={this._renderBrandOptionSelect()}
            onChange={(e) => {
              this.setState({
                brandOptionsValue: (e.target as any).value
              });
            }}
          />
        </FormItem>
        <FormItem>
          <Button
            icon="search"
            type="primary"
            onClick={this._search}
            htmlType="submit"
          >
            <FormattedMessage id="Product.search" />
          </Button>
        </FormItem>
      </Form>
    );
  }

  _renderBrandOptionSelect = () => {
    return (
      <Select
        onChange={(val) => {
          this.setState({
            brandOptions: val
          });
        }}
        value={this.state.brandOptions}
        style={{ width: 130 }}
      >
        <Option value="likeBrandName"><FormattedMessage id="Product.brandName" /></Option>
        <Option value="likeNickName"><FormattedMessage id="Product.brandAlias" /></Option>
      </Select>
    );
  };

  /**
   * 查询
   */
  _search = () => {
    const { editSearchData, pageSize } = this.props.relaxProps;
    const { brandOptions, brandOptionsValue } = this.state;
    editSearchData(
      fromJS({ [brandOptions]: brandOptionsValue, pageSize: pageSize })
    );
  };
}
