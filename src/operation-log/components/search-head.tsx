import React, { Component } from 'react';
import { Relax } from 'plume2';
import { Button, DatePicker, Form, Input, Select, Row, Col } from 'antd';
import moment from 'moment';

import { Const, noop, SelectGroup, AuthWrapper } from 'qmkit';
import { IList } from 'typings/globalType';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

/**
 * 订单查询头
 */
@Relax
export default class SearchHead extends Component<any, any> {
  props: {
    relaxProps?: {
      onSearch: Function;
      onExportByParams: Function;
      dataList: IList;
    };
  };

  static relaxProps = {
    onSearch: noop,
    onExportByParams: noop,
    dataList: 'dataList'
  };

  constructor(props) {
    super(props);

    this.state = {
      search: {
        opAccount: '',
        opName: '',
        opCode: '',
        opContext: '',
        opModule: '',
        beginTime: moment().subtract(3, 'months'),
        endTime: moment()
      },
      export: {
        opAccount: '',
        opName: '',
        opCode: '',
        opContext: '',
        opModule: '',
        beginTime: moment().subtract(3, 'months'),
        endTime: moment()
      },
      pickOpen: false,
      pickErrorInfo: ''
    };
  }

  render() {
    const { onSearch, onExportByParams } = this.props.relaxProps;
    const { search, pickOpen, pickErrorInfo } = this.state;
    const options = {
      onFocus: () => {
        this.setState({ pickOpen: true });
      },
      onBlur: () => {
        this.setState({ pickOpen: false });
      }
    };
    return (
      <div>
        <div>
          <Form className="filter-content" layout="inline">
            <Row>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={<p style={{width:108}}><FormattedMessage id="Setting.OperatorAccount" /></p>}
                    style={{width:300}}
                    onChange={(e) => {
                      search.opAccount = (e.target as any).value;
                      this.setState({ search: search });
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={<p style={{width:108}}><FormattedMessage id="Setting.OperatorName" /></p>}
                    style={{width:300}}
                    onChange={(e) => {
                      search.opName = (e.target as any).value;
                      this.setState({ search: search });
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <SelectGroup
                    getPopupContainer={() =>
                      document.getElementById('page-content')
                    }
                    defaultValue=""
                    label={<p style={{width:108}}><FormattedMessage id="Setting.modular" /></p>}
                    style={{width:170}}
                    onChange={(value) => {
                      search.opModule = value;
                      this.setState({ search: search });
                    }}
                  >
                    <Option value="">All</Option>
                    <Option value="登录">Sign in</Option>
                    <Option value="商家">business</Option>
                    <Option value="商品">commodity</Option>
                    <Option value="订单">order</Option>
                    <Option value="客户">customer</Option>
                    <Option value="营销">Marketing</Option>
                    <Option value="财务">Finance</Option>
                    <Option value="设置">set up</Option>
                    <Option value="账户管理">Account management</Option>
                  </SelectGroup>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={<p style={{width:108}}><FormattedMessage id="Setting.OperationType" /></p>}
                    style={{width:300}}
                    onChange={(e) => {
                      search.opCode = (e.target as any).value;
                      this.setState({ search: search });
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={<p style={{width:108}}><FormattedMessage id="Setting.OperationContent" /></p>}
                    style={{width:300}}
                    onChange={(e) => {
                      search.opContext = (e.target as any).value;
                      this.setState({ search: search });
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <RangePicker
                    getCalendarContainer={() =>
                      document.getElementById('page-content')
                    }
                    defaultValue={[search.beginTime, search.endTime]}
                    value={[search.beginTime, search.endTime]}
                    format={Const.DATE_FORMAT}
                    style={{width:300}}
                    showTime={{ format: 'HH:mm' }}
                    open={pickOpen}
                    allowClear={false}
                    renderExtraFooter={() =>
                      pickErrorInfo != '' && (
                        <span style={{ color: 'red' }}>{pickErrorInfo}</span>
                      )
                    }
                    onChange={this._handleDateParams}
                    onOk={this._dateOkBtn}
                    {...options}
                  />
                </FormItem>
              </Col>
              <Col span={24} style={{textAlign:'center'}}>
                <FormItem>
                  <Button
                    type="primary"
                    icon="search"
                    htmlType="submit"
                    onClick={() => {
                      //将搜索条件复制到导出条件
                      const {
                        opAccount,
                        opName,
                        opCode,
                        opModule,
                        opContext,
                        beginTime,
                        endTime
                      } = this.state.search;

                      this.setState({
                        export: {
                          opAccount,
                          opName,
                          opCode,
                          opModule,
                          opContext,
                          beginTime,
                          endTime
                        }
                      });

                      const params = {
                        opAccount,
                        opName,
                        opCode,
                        opModule,
                        opContext,
                        beginTime,
                        endTime
                      };

                      onSearch(params);
                    }}
                  >
                    {<FormattedMessage id="Setting.search" />}
                  </Button>
                </FormItem>
                <AuthWrapper functionName="f_operation_log_export">
                  <FormItem>
                    <Button
                      type="primary"
                      icon="download"
                      onClick={() => {
                        const {
                          opAccount,
                          opName,
                          opCode,
                          opModule,
                          opContext,
                          beginTime,
                          endTime
                        } = this.state.export;

                        const params = {
                          opAccount,
                          opName,
                          opCode,
                          opModule,
                          opContext,
                          beginTime,
                          endTime
                        };
                        onExportByParams(params);
                      }}
                    >
                      {<FormattedMessage id="Setting.export" />}
                    </Button>
                  </FormItem>
                </AuthWrapper>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }

  /**
   * 操作时间段的选择
   * @param date
   * @param dateString
   * @private
   */
  _handleDateParams = (date) => {
    let beginTime = date[0];
    let endTime = date[1];
    let endTimeClone = endTime.clone().subtract(3, 'months');
    //时间相差3个月以内
    const search = this.state.search;
    if (moment(beginTime).isSameOrAfter(moment(endTimeClone))) {
      search.beginTime = beginTime;
      search.endTime = endTime;
      this.setState({ pickErrorInfo: '', search: search });
    } else {
      search.beginTime = beginTime;
      search.endTime = beginTime.clone().add(3, 'months');
      this.setState({
        pickErrorInfo: 'The start time and end time shall be within three months',
        search: search
      });
    }
  };

  _dateOkBtn = () => {
    const { pickErrorInfo } = this.state;
    if (pickErrorInfo === '') {
      this.setState({ pickOpen: false });
    } else {
      this.setState({ pickOpen: true });
    }
  };
}
