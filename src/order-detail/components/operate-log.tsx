import React from 'react';
import { Relax } from 'plume2';
import { withRouter } from 'react-router-dom';
import { Table, Row, Col, Button, Collapse } from 'antd';
import moment from 'moment';
import { Const } from 'qmkit';
import { FormattedMessage } from 'react-intl';

enum operatorDic {
  BOSS = 'Boss',
  PLATFORM = 'Platform',
  CUSTOMER = 'Customer',
  THIRD = 'Third',
  SUPPLIER = 'Supplier',
  INTEGRATION = 'Integration'
}

const columns = [
  {
    title: <FormattedMessage id="Order.OperatorType" />,
    dataIndex: 'operator.platform',
    key: 'operator.platform',
    render: (val) => operatorDic[val] || val
  },
  {
    title: <FormattedMessage id="Order.Operator" />,
    dataIndex: 'operator.name',
    key: 'operator.name'
  },
  {
    title: <FormattedMessage id="Order.Time" />,
    dataIndex: 'eventTime',
    key: 'eventTime',
    render: (time) => time && moment(time).format(Const.TIME_FORMAT).toString()
  },
  {
    title: <FormattedMessage id="Order.OperationCategory" />,
    dataIndex: 'eventType',
    key: 'eventType'
  },
  {
    title: <FormattedMessage id="Order.OperationLog" />,
    dataIndex: 'eventDetail',
    key: 'eventDetail',
    width: '50%'
  }
];

const customPanelStyle = {
  paddingRight: 10
};
/**
 * 操作日志
 */
@withRouter
@Relax
export default class OperateLog extends React.Component<any, any> {
  static relaxProps = {
    log: ['detail', 'tradeEventLogs']
  };

  render() {
    const { log } = this.props.relaxProps;
    const Panel = Collapse.Panel;
    return (
      <div>
        <div style={styles.backItem}>
          <Collapse>
            <Panel
              header={<FormattedMessage id="Order.operationLog" />}
              key="1"
              style={customPanelStyle}
            >
              <Row>
                <Col span={24}>
                  <Table
                    rowKey={(_record, index) => index.toString()}
                    columns={columns}
                    dataSource={log ? log.toJS() : []}
                    pagination={false}
                    bordered
                  />
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </div>
      </div>
    );
  }
}

const styles = {
  backItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 20
  }
} as any;
