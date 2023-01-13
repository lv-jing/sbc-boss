import React from 'react';
import { DataGrid, noop } from 'qmkit';
import { Relax, IMap } from 'plume2';
import { List } from 'immutable';
import { Form, Button, Input } from 'antd';
import moment from 'moment';

type TList = List<IMap>;
const { Column } = DataGrid;

const STATUS = ['未开始', '进行中', '已结束', '任务失败'];

@Relax
export default class TaskList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      taskList: TList;
      getTaskList: Function;
      setData: Function;
      pageNum: number;
      pageSize: number;
      total: number;

      initPushTaskForm: Function;
      deleteTask: Function;
    };
  };

  static relaxProps = {
    taskList: 'taskList',
    getTaskList: noop,
    setData: noop,
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    total: 'total',

    initPushTaskForm: noop,
    deleteTask: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      name: null
    };
  }
  render() {
    const {
      taskList,
      getTaskList,
      total,
      pageSize,
      pageNum,
      deleteTask
    } = this.props.relaxProps;
    return (
      <div className="task-list">
        <div className="top-wrap">
          <Form layout="inline">
            <Form.Item>
              <Input
                addonBefore={'任务名称'}
                placeholder="请输入"
                onChange={(e) => {
                  this.setState({
                    name: e.target.value
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
                  getTaskList({ name: this.state.name });
                }}
              >
                搜索
              </Button>
            </Form.Item>
          </Form>
          <Button
            type="primary"
            icon="plus"
            ghost
            className="send-btn"
            onClick={() => {
              this._showModal();
            }}
          >
            发送站内信
          </Button>
        </div>
        <DataGrid
          dataSource={taskList.toJS()}
          pagination={{
            pageSize,
            total,
            current: pageNum,
            onChange: (pageNum, pageSize) => {
              getTaskList({
                pageNum: pageNum - 1,
                pageSize: pageSize
              });
            }
          }}
        >
          <Column
            title="创建时间"
            width={118}
            dataIndex="createTime"
            key="createTime"
            render={(time) => time && time.slice(0, 19)}
          />

          <Column
            title="任务名称"
            width={250}
            key="name"
            render={(record) => (
              <div>
                <div>{record.name}</div>
                {record.pushFlag === 0 && (
                  <div className="pushTags">push消息</div>
                )}
                {record.pushFlag === 1 && (
                  <div className="pushTags">运营计划</div>
                )}
              </div>
            )}
          />

          <Column
            title="消息内容"
            width={300}
            dataIndex="content"
            key="content"
            render={(content) => <div className="sms-content">{content}</div>}
          />

          <Column
            title="接收人"
            width={200}
            key="context1"
            render={(record: any) => this._renderReceiver(record)}
          />

          <Column
            title="发送数 | 打开数 | 打开率"
            key="openKey"
            render={(record: any) => (
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
            title="发送时间"
            width={118}
            dataIndex="sendTime"
            key="sendTime"
            render={(sendTime) =>
              sendTime !== null
                ? moment(sendTime).format('YYYY-MM-DD HH:mm:ss')
                : '-'
            }
          />

          <Column
            title="状态"
            dataIndex="sendStatus"
            key="sendStatus"
            render={(sendStatus) => {
              return <div>{STATUS[sendStatus]}</div>;
            }}
          />

          <Column
            title="操作"
            dataIndex="messageId"
            key="messageId"
            render={(messageId, record: any) => {
              let now = moment(new Date());
              let sendTime = moment(record.sendTime);
              let flag = now.isAfter(sendTime, 'minute');
              const ifModify =
                +record.sendStatus === 0 && !flag && record.pushFlag == null;
              return (
                <div>
                  <a
                    href="javascript:;"
                    onClick={() => {
                      this._showModal(messageId, false);
                    }}
                  >
                    查看
                  </a>
                  {'  '}
                  {ifModify && (
                    <a
                      href="javascript:;"
                      onClick={() => {
                        this._showModal(messageId, ifModify);
                      }}
                    >
                      编辑
                    </a>
                  )}
                  {'  '}
                  {ifModify && (
                    <a
                      href="javascript:;"
                      onClick={() => {
                        deleteTask(messageId, this.state.name);
                      }}
                    >
                      删除
                    </a>
                  )}
                </div>
              );
            }}
          />
        </DataGrid>
      </div>
    );
  }

  _showModal = (id?, ifModify?) => {
    const { initPushTaskForm, setData } = this.props.relaxProps;
    initPushTaskForm(id);
    if (ifModify === false) {
      setData('ifModify', ifModify);
    } else {
      setData('ifModify', true);
    }
    setData('sendModalVisible', true);
  };

  _renderReceiver = (record) => {
    const { sendType, scopeVOList } = record;
    // scopeVOList  推送人列表
    let p = null;
    if (sendType === 0) {
      p = <p>全部会员</p>;
    } else if (sendType === 4) {
      p = <p>自定义选择</p>;
    } else {
      let receiveNames = scopeVOList.map((vo) => vo.receiveName);
      p = <p>{receiveNames && receiveNames.join(';')}</p>;
    }
    return <div>{p}</div>;
  };
}
