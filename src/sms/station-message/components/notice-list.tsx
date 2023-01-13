import React from 'react';
import { DataGrid, noop } from 'qmkit';
import { Relax, IMap } from 'plume2';
import { List } from 'immutable';
import { Form, Button, Input, Switch } from 'antd';
// import moment from 'moment';

type TList = List<IMap>;
const { Column } = DataGrid;

@Relax
export default class NoticeList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      noticeList: TList;
      getNoticeList: Function;
      changeSwitch: Function;
      setData: Function;
      pageNum: number;
      pageSize: number;
      total: number;

      initNodeForm: Function;
    };
  };

  static relaxProps = {
    noticeList: 'noticeList',
    getNoticeList: noop,
    changeSwitch: noop,
    setData: noop,
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    total: 'total',
    initNodeForm: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      nodeName: null
    };
  }
  render() {
    const {
      noticeList,
      getNoticeList,
      changeSwitch,
      total,
      pageSize,
      pageNum
    } = this.props.relaxProps;
    return (
      <div className="task-list">
        <div className="top-wrap" style={{ marginBottom: 12 }}>
          <Form layout="inline">
            <Form.Item>
              <Input
                addonBefore={'通知节点'}
                placeholder="请输入"
                onChange={(e) => {
                  this.setState({
                    nodeName: e.target.value
                  });
                }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                icon="search"
                htmlType="submit"
                onClick={() => {
                  getNoticeList({ nodeName: this.state.nodeName });
                }}
              >
                搜索
              </Button>
            </Form.Item>
          </Form>
        </div>
        <DataGrid
          dataSource={noticeList.toJS()}
          pagination={{
            pageSize,
            total,
            current: pageNum,
            onChange: (pageNum, pageSize) => {
              getNoticeList({
                pageNum: pageNum - 1,
                pageSize: pageSize
              });
            }
          }}
        >
          <Column
            width="15%"
            title="通知节点"
            dataIndex="nodeName"
            key="nodeName"
          />
          <Column
            width="20%"
            title="通知标题"
            dataIndex="nodeTitle"
            key="nodeTitle"
          />
          <Column
            width="35%"
            title="通知内容"
            dataIndex="nodeContent"
            key="nodeContent"
            render={(nodeContent) => (
              <div className="sms-content">{nodeContent}</div>
            )}
          />

          <Column
            width="20%"
            title="收到数 | 打开数 | 打开率"
            key="openKey"
            render={(record) => (
              <div>
                {record.sendSum +
                  ' | ' +
                  record.openSum +
                  ' | ' +
                  ((record.openSum
                    ? ((record.openSum / record.sendSum) * 100).toFixed(2)
                    : '0') +
                    '%')}
              </div>
            )}
          />

          <Column
            width="10%"
            title="操作"
            dataIndex="id"
            key="id"
            render={(id, record: any) => {
              return (
                <div className="rowSwitchCenter">
                  <Switch
                    key={record.id}
                    checkedChildren="开"
                    unCheckedChildren="关"
                    defaultChecked={record.status == 1}
                    onChange={(e) => {
                      console.log(e);
                      changeSwitch(id, this.state.nodeName);
                    }}
                  />
                  &nbsp;
                  <a
                    href="javascript:;"
                    onClick={() => {
                      this._showModal(id);
                    }}
                  >
                    编辑
                  </a>
                </div>
              );
            }}
          />
        </DataGrid>
      </div>
    );
  }

  _showModal = async (id) => {
    const { initNodeForm, setData } = this.props.relaxProps;
    await initNodeForm(id);
    setData('nodeModalVisible', true);
  };
}
