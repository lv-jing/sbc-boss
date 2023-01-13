import React from 'react';
import { IMap, Relax } from 'plume2';
import { Row, Col, Form, Select, Button } from 'antd';
import styled from 'styled-components';
import { noop, DataGrid, QMMethod } from 'qmkit';

const { Column } = DataGrid;
const FormItem = Form.Item;

const Content = styled.div`
  padding-bottom: 20px;
`;

const Red = styled.span`
  color: #e73333;
`;
const H2 = styled.h2`
  color: #333333;
  font-size: 14px;
  display: inline;
  font-weight: 400;
`;
const GreyText = styled.span`
  color: #999999;
  margin-left: 5px;
  margin-right: 20px;
  font-size: 12px;
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
    margin-top: 13px;
  }

  > div {
    width: 600px;
  }
`;

@Relax
export default class StepFour extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      company: IMap;
      setAccountDays: Function;
      saveAccountDays: Function;
    };
  };

  static relaxProps = {
    company: 'company',
    setAccountDays: noop,
    saveAccountDays: noop
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { company, setAccountDays } = this.props.relaxProps;
    const offlineAccount = company.get('offlineAccount');
    const accountDays = company.get('accountDays').toJS();

    return (
      <div>
        <Content>
          <div>
            <Red>*</Red>
            <H2>结算日</H2>
            <GreyText>
              已添加{accountDays ? accountDays.length : 0}个结算日，最多可添加5个结算日
            </GreyText>
          </div>

          <AddBox>
            <h2>每月：</h2>
            <div>
              <Row type="flex" align="middle">
                <Col span={9}>
                  <FormItem>
                    {getFieldDecorator('accountDays', {
                      initialValue: accountDays,
                      rules: [
                        { required: true, message: '请输入结算日' },
                        {
                          validator: (rule, value, callback) => {
                            QMMethod.validatorAccountDays(
                              rule,
                              value,
                              callback
                            );
                          }
                        }
                      ]
                    })(
                      <Select
                        getPopupContainer={() =>
                          document.getElementById('page-content')
                        }
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="请输入结算日"
                        tokenSeparators={[',']}
                        onChange={(value) => setAccountDays(value)}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={24}>
                  <GreyText>
                    输入1-31间的数字，点击“enter回车键”添加，当月不包含所设日期时，将会顺延到下一个结算日
                  </GreyText>
                </Col>
              </Row>
            </div>
          </AddBox>
        </Content>

        <Content>
          <div style={{ marginBottom: 20 }}>
            <Red>*</Red>
            <H2>结算银行账户 </H2>
            <GreyText>
              已添加{offlineAccount ? offlineAccount.count() : 0}个结算账户，最多可添加5个结算账户
            </GreyText>
          </div>

          <DataGrid
            dataSource={offlineAccount.toJS()}
            pagination={false}
            rowKey="accountId"
          >
            <Column
              title="序号"
              dataIndex="accountId"
              key="accountId"
              render={(_text, _rowData, index) => {
                return index + 1;
              }}
            />
            <Column title="银行" dataIndex="bankName" key="bankName" />
            <Column title="账户名" dataIndex="accountName" key="accountName" />
            <Column title="账号" dataIndex="bankNo" key="bankNo" />
            <Column title="支行" dataIndex="bankBranch" key="bankBranch" />
            <Column
              title="收到平台打款"
              dataIndex="isReceived"
              key="isReceived"
              render={(isReceived) => (isReceived == 1 ? '已验证' : '未验证')}
            />
            <Column
              title="主账号"
              dataIndex="isDefaultAccount"
              key="isDefaultAccount"
              render={(isDefaultAccount) =>
                isDefaultAccount == 1 ? '是' : '否'
              }
            />
          </DataGrid>
        </Content>
        <div className="bar-button">
          <Button onClick={this._save} type="primary">
            保存
          </Button>
        </div>
      </div>
    );
  }

  /**
   * 保存
   */
  _save = () => {
    const form = this.props.form;
    const { saveAccountDays, company } = this.props.relaxProps;
    form.validateFields(null, (errs) => {
      //如果校验通过
      if (!errs) {
        saveAccountDays(company.get('accountDays'));
      } else {
        this.setState({});
      }
    });
  };
}
