import React from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  message,
  Table,
  Row,
  Col,
  Radio,
  Menu,
  Card,
  Checkbox,
  Empty,
  Spin,
  DatePicker,
  Popconfirm,
  Tooltip
} from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './../webapi';
import { Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';
import axios from 'axios';
import moment from 'moment';
import { cache, Const, RCi18n } from 'qmkit';

const { TextArea } = Input;
const { MonthPicker } = DatePicker;

const { SubMenu } = Menu;
const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

const { Column } = Table;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

class PaymentInformation extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      customerAccount: '',
      title: '',
      isDefault: false,
      loading: false,
      cardList: []
    };
  }
  componentDidMount() {
    //  this.getList();
  }
  getList() {
    this.setState({
      loading: true
    });
    let { storeId } = JSON.parse(
      sessionStorage.getItem(cache.LOGIN_DATA || '{}')
    );
    webapi
      .getPaymentMethods({ customerId: this.props.customerId, storeId })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let dataList = res.context;
          let sortData = dataList.sort((a, b) => b.isDefault - a.isDefault);
          this.setState({
            cardList: sortData,
            loading: false
          });
        } else {
          this.setState({
            loading: false
          });
          message.error(RCi18n({ id: 'PetOwner.Unsuccessful' }));
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(RCi18n({ id: 'PetOwner.Unsuccessful' }));
      });
  }

  delCard = (id) => {
    webapi
      .deleteCard({ id })
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(
            <FormattedMessage id="PetOwner.OperateSuccessfully" />
          );
          this.getList();
        } else {
          message.error(RCi18n({ id: 'PetOwner.Unsuccessful' }));
        }
      })
      .catch((err) => {
        message.error(RCi18n({ id: 'PetOwner.Unsuccessful' }));
      });
  };
  clickDefault = () => {
    let isDefault = !this.state.isDefault;
    this.setState({
      isDefault: isDefault
    });
  };

  render() {
    const { cardList, loading } = this.state;
    return (
      <Spin spinning={loading}>
        <Row style={{ minHeight: 200 }}>
          {cardList && cardList.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <>
              {cardList.map((item, index) => (
                <Col span={6} offset={1} key={index}>
                  {item.paymentType === 'PAYU' ? (
                    <>
                      {item.payuPaymentMethod ? (
                        <Card>
                          <Row>
                            <Col span={16} offset={1}>
                              <p>{item.payuPaymentMethod.holder_name}</p>
                              <p>
                                {item.payuPaymentMethod.last_4_digits
                                  ? '**** **** **** ' +
                                    item.payuPaymentMethod.last_4_digits
                                  : ''}
                              </p>
                              <p>{item.payuPaymentMethod.card_type}</p>
                            </Col>
                            <Col span={5}>
                              {!item.isDefault ? (
                                <Popconfirm
                                  placement="topLeft"
                                  title={
                                    <FormattedMessage id="PetOwner.deleteThisCard" />
                                  }
                                  onConfirm={() => this.delCard(item.id)}
                                  okText={
                                    <FormattedMessage id="PetOwner.Confirm" />
                                  }
                                  cancelText={
                                    <FormattedMessage id="PetOwner.Cancel" />
                                  }
                                >
                                  <Tooltip
                                    placement="top"
                                    title={
                                      <FormattedMessage id="PetOwner.Delete" />
                                    }
                                  >
                                    <a
                                      className="iconfont iconDelete"
                                      style={{ float: 'right' }}
                                    ></a>
                                  </Tooltip>
                                </Popconfirm>
                              ) : null}
                            </Col>
                          </Row>
                        </Card>
                      ) : null}
                    </>
                  ) : (
                    <>
                      {item.adyenPaymentMethod ? (
                        <Card>
                          <Row>
                            <Col span={16} offset={1}>
                              <p>{item.adyenPaymentMethod.holder_name}</p>
                              <p>
                                {item.adyenPaymentMethod.lastFour
                                  ? '**** **** **** ' +
                                    item.adyenPaymentMethod.lastFour
                                  : ''}
                              </p>
                              <p>{item.adyenPaymentMethod.card_type}</p>
                            </Col>
                            <Col span={5}>
                              {!item.isDefault ? (
                                <Popconfirm
                                  placement="topLeft"
                                  title={
                                    <FormattedMessage id="PetOwner.deleteThisCard" />
                                  }
                                  onConfirm={() => this.delCard(item.id)}
                                  okText={
                                    <FormattedMessage id="PetOwner.Confirm" />
                                  }
                                  cancelText={
                                    <FormattedMessage id="PetOwner.Cancel" />
                                  }
                                >
                                  <Tooltip
                                    placement="top"
                                    title={
                                      <FormattedMessage id="PetOwner.Delete" />
                                    }
                                  >
                                    <a
                                      className="iconfont iconDelete"
                                      style={{ float: 'right' }}
                                    ></a>
                                  </Tooltip>
                                </Popconfirm>
                              ) : null}
                            </Col>
                          </Row>
                        </Card>
                      ) : null}
                    </>
                  )}
                </Col>
              ))}
            </>
          )}

          <div className="bar-button">
            <Button>
              <Link to="/customer-list">
                <FormattedMessage id="PetOwner.Cancel" />
              </Link>
            </Button>
          </div>
        </Row>
      </Spin>
    );
  }
}
export default Form.create()(PaymentInformation);
