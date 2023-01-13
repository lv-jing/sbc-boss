import React from 'react';
import { Button, Form, Input, Select } from 'antd';
import { Relax } from 'plume2';
import { InputGroupCompact, noop, SelectGroup } from 'qmkit';
import { IList } from 'typings/globalType';

const FormItem = Form.Item;
const Option = Select.Option;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      onSearch: Function;
      cateList: IList;
    };
  };

  static relaxProps = {
    onSearch: noop,
    cateList: 'cateList'
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { cateList } = this.props.relaxProps;

    return (
      <div style={{ marginTop: 10 }}>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore={'商品名称'}
              onChange={(e) => {
                this.setState({
                  goodsName: e.target.value
                });
              }}
            />
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              defaultValue="全部"
              label="是否推荐"
              onChange={(e) => {
                this.setState({
                  recommendFlag: e
                });
              }}
            >
              <Option value="">全部</Option>
              <Option value="0">否</Option>
              <Option value="1">是</Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <InputGroupCompact
              title="积分区间"
              precision={0}
              startMin={0}
              startMax={999999999}
              start={this.state.pointsSectionStart}
              onStartChange={(val) =>
                this.setState({
                  pointsSectionStart: val
                })
              }
              endMin={0}
              endMax={999999999}
              end={this.state.pointsSectionEnd}
              onEndChange={(val) =>
                this.setState({
                  pointsSectionEnd: val
                })
              }
            />
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              defaultValue="全部"
              label="状态"
              onChange={(value) => {
                value = value === '' ? null : value;
                this.setState({
                  status: value
                });
              }}
            >
              <Option value="">全部</Option>
              <Option value="0">停用</Option>
              <Option value="1">启用</Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="分类"
              defaultValue="全部"
              showSearch
              optionFilterProp="children"
              onChange={(e) => {
                this.setState({
                  cateId: e
                });
              }}
            >
              <Option key="-1" value="null">
                全部
              </Option>
              {cateList.map((v) => {
                return (
                  <Option value={v.get('cateId')} key={v.get('cateName')}>
                    {v.get('cateName')}
                  </Option>
                );
              })}
            </SelectGroup>
          </FormItem>
          <FormItem>
            <Input
              addonBefore={'SKU编码'}
              onChange={(e) => {
                this.setState({
                  goodsInfoNo: e.target.value
                });
              }}
            />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              icon="search"
              htmlType="submit"
              onClick={() => {
                const params = this.state;
                this._onSearch(params);
              }}
            >
              搜索
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }

  /**
   * 搜索
   * @private
   */
  _onSearch = (params) => {
    params = this._onCheckRegion(params);
    const { onSearch } = this.props.relaxProps;
    // 验证表单信息
    this.props.form.validateFields(null, (errs) => {
      if (!errs) {
        onSearch(params);
      }
    });
  };

  /**
   * 检查积分区间筛选条件
   */
  _onCheckRegion = (params: any) => {
    if (parseInt(params.pointsSectionStart) > parseInt(params.pointsSectionEnd)){
      this.setState({
        pointsSectionStart: params.pointsSectionEnd,
        pointsSectionEnd: params.pointsSectionStart
      });
      params.pointsSectionStart = params.pointsSectionEnd;
      params.pointsSectionEnd = params.pointsSectionStart;
    }
    return params;
  }
}
