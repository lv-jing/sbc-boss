import * as React from 'react';
import { Relax, IMap } from 'plume2';
import {
  Modal,
  Select,
  Form,
  DatePicker,
  Row,
  Col,
  Radio,
  message
} from 'antd';
import moment from 'moment';
import { fromJS } from 'immutable';
import styled from 'styled-components';
import { noop } from 'qmkit';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const GreyText = styled.span`
  color: #999999;
  font-size: 12px;
  margin-left: 5px;
`;
const RedPoint = styled.span`
  color: #e73333;
`;
const H2 = styled.h2`
  color: #333333;
  font-size: 14px;
  display: inline;
  font-weight: 400;
`;
const AddBox = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  h2 {
    color: #666666;
    font-size: 12px;
    font-weight: 400;
    margin-top: 12px;
  }
  .ant-col-21 {
    margin-left: 38px;
  }
`;

@Relax
export default class SupplierModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  props: {
    form: any;
    relaxProps?: {
      supplierVisible: boolean;
      supplierModal: Function;
      supplierCheckInfo: Function; //商家审核信息
      checkInfo: IMap;
      acceptSupplier: Function; //审核商家
      company: IMap; //商家信息
    };
  };

  static relaxProps = {
    // 弹框是否显示
    supplierVisible: 'supplierVisible',
    // 关闭弹框
    supplierModal: noop,
    supplierCheckInfo: noop,
    checkInfo: 'checkInfo',
    company: 'company',
    acceptSupplier: noop
  };

  render() {
    const { supplierVisible, checkInfo, company } = this.props.relaxProps;
    const rangeDate = checkInfo.get('contractStartDate')
      ? [
          moment(checkInfo.get('contractStartDate')),
          moment(checkInfo.get('contractEndDate'))
        ]
      : [];
    this.state = {
      rangeDate: rangeDate
    };
    const { getFieldDecorator } = this.props.form;
    if (!supplierVisible) {
      return null;
    }
    return (
      <Form>
        <Modal
          maskClosable={false}
          title={
            <div>
              商家审核<GreyText>请补充签约信息</GreyText>
            </div>
          }
          visible={supplierVisible}
          onCancel={this._handleModelCancel}
          onOk={this._handleOK}
          okText="保存"
        >
          <div>
            <div>
              <RedPoint>*</RedPoint>
              <H2>结算日</H2>
              <GreyText>
                已添加
                {checkInfo.get('countDays').size == 0
                  ? '0'
                  : checkInfo.get('countDays').length}
                个结算日，最多可添加5个结算日
              </GreyText>
            </div>
            <AddBox>
              <Row type="flex" align="top" justify="start">
                <Col span={2}>
                  <h2>每月：</h2>
                </Col>
                <Col span={20}>
                  <FormItem style={{ marginBottom: '0px' }}>
                    {getFieldDecorator('countDays', {
                      onChange: this._editSpecValue.bind(this),
                      initialValue:
                        checkInfo.get('countDays').size > 0 ||
                        checkInfo.get('countDays').length > 0
                          ? checkInfo.get('countDays')
                          : [],
                      rules: [
                        {
                          required: true,
                          message: '请输入结算日'
                        },
                        {
                          validator: this._checkDays
                        }
                      ]
                    })(
                      <Select
                        getPopupContainer={() =>
                          document.getElementById('page-content')
                        }
                        mode="tags"
                        style={{ width: '90%' }}
                        placeholder="请输入结算日"
                        notFoundContent="暂无数据"
                        tokenSeparators={[',']}
                      />
                    )}
                    &nbsp;日
                  </FormItem>
                </Col>
                <Col span={21}>
                  <GreyText style={{ marginTop: 5, marginLeft: 0 }}>
                    输入1-31间的数字，点击“enter回车键”添加，当月不包含所设日期时，将会顺延到下一个结算日
                  </GreyText>
                </Col>
              </Row>
            </AddBox>
            <div style={{ marginTop: 20 }}>
              <div style={{ marginBottom: 10 }}>
                <RedPoint>*</RedPoint>
                <H2>签约有效期</H2>
                <GreyText>商家店铺有效期</GreyText>
              </div>
              <DatePicker
                value={moment(
                  moment(new Date())
                    .format('YYYY-MM-DD 00:00:00')
                    .toString()
                )}
                format="YYYY-MM-DD HH:mm:ss"
                disabled={true}
              />
              ~
              <DatePicker
                defaultValue={
                  checkInfo.get('contractEndDate')
                    ? moment(checkInfo.get('contractEndDate'))
                    : null
                }
                format="YYYY-MM-DD 23:59:59"
                onChange={(param) => this._changeCalender(param)}
                disabledDate={this.disabledDate}
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
              />
              {/*<RangePicker*/}
              {/*value={this.state.rangeDate}*/}
              {/*onChange={(param) => this._changeCalender(param)}*/}
              {/*disabledDate={this.disabledDate}*/}
              {/*format="YYYY-MM-DD HH:mm:ss"*/}
              {/*/>*/}
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ marginBottom: 10 }}>
                <RedPoint>*</RedPoint>
                <H2>商家类型</H2>
              </div>
              <div>
                {company.get('storeInfo') &&
                company.get('storeInfo').get('storeType') == 0 ? (
                  <RadioGroup value={0}>
                    <Radio value={0} disabled>
                      供应商
                    </Radio>
                  </RadioGroup>
                ) : (
                  <RadioGroup
                    value={checkInfo.get('companyType')}
                    onChange={(e) => this._chooseType(e)}
                  >
                    <Radio value={0}>自营商家</Radio>
                    <Radio value={1}>第三方商家</Radio>
                  </RadioGroup>
                )}
              </div>
            </div>
          </div>
        </Modal>
      </Form>
    );
  }

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { supplierModal, supplierCheckInfo } = this.props.relaxProps;
    supplierCheckInfo({ field: 'contractStartDate', value: '' });
    supplierModal();
  };

  /**
   * 输入结算日
   * @param value
   * @private
   */
  _editSpecValue = (countDays) => {
    const { supplierCheckInfo } = this.props.relaxProps;
    supplierCheckInfo({ field: 'countDays', value: countDays });
  };

  /**
   * 校验输入
   * @param rule
   * @param value
   * @param callback
   * @private
   */
  _checkDays = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }
    if (value.length > 0) {
      value.map((v) => {
        if (
          parseInt(v) > 31 ||
          parseInt(v) < 1 ||
          isNaN(parseInt(v)) ||
          v % 1 != 0
        ) {
          callback(new Error('只能输入1-31之间的整数'));
          return;
        }
      });
      const valueList = fromJS(value);
      let overLen = false;
      let whitespace = false;
      let duplicated = false;

      valueList.forEach((v, k) => {
        const trimValue = v.trim();
        if (!trimValue) {
          whitespace = true;
          return false;
        }
        if (v.length > 20) {
          overLen = true;
          return false;
        }
        // 重复校验
        const duplicatedIndex = valueList.findIndex(
          (v1, index1) => index1 != k && v1.trim() === trimValue
        );
        if (duplicatedIndex > -1) {
          duplicated = true;
        }
      });

      if (whitespace) {
        callback(new Error('日期不能为空字符'));
        return;
      }
      if (overLen) {
        callback(new Error('每项值最多支持20个字符'));
        return;
      }
      if (duplicated) {
        callback(new Error('日期重复'));
        return;
      }
    }

    if (value.length > 5) {
      callback(new Error('最多只能添加5个结算日'));
      return;
    }

    callback();
  };

  /**
   * 选择商家类型
   * @param e
   * @private
   */
  _chooseType = (e) => {
    const { supplierCheckInfo } = this.props.relaxProps;
    supplierCheckInfo({ field: 'companyType', value: e.target.value });
  };

  /**
   * 选择签约有效期
   * @param params
   * @private
   */
  _changeCalender = (params) => {
    const { supplierCheckInfo } = this.props.relaxProps;
    let endTime;
    if (params) {
      endTime = params.format('YYYY-MM-DD 23:59:59');
    }
    supplierCheckInfo({ field: 'contractEndDate', value: endTime });
  };

  /**
   * 保存所选中的信息
   * @private
   */
  _handleOK = async () => {
    const {
      acceptSupplier,
      supplierCheckInfo,
      checkInfo,
      company
    } = this.props.relaxProps;
    const form = this.props.form;
    //校验决算日期的输入是否有误
    form.validateFields((errs) => {
      if (!errs) {
        //审核信息中的审核状态置为1
        supplierCheckInfo({ field: 'auditState', value: 1 });
        //非空校验
        if (!checkInfo.get('contractEndDate')) {
          message.error('请选择签约有效期');
          return;
        } else if (
          company.get('storeInfo').get('storeType') == 1 &&
          checkInfo.get('companyType') == null
        ) {
          message.error('请选择商家类型');
        } else {
          if (company.get('storeInfo').get('storeType') == 0) {
            supplierCheckInfo({ field: 'companyType', value: 1 });
          }
          //审核信息
          acceptSupplier();
        }
      } else {
        this.setState({});
      }
    });
  };

  /**
   * 禁选择的日期(昨天和昨天之前)
   * @param current
   * @returns {any|boolean}
   */
  disabledDate(current) {
    return (
      current && current <= moment(new Date().getTime() - 1000 * 60 * 60 * 24)
    );
  }
}
