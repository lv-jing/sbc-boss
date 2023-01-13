import React from 'react';
import { DataGrid, noop, SelectGroup } from 'qmkit';
import { Relax, IMap } from 'plume2';
import { List } from 'immutable';
import { Form, Button, Select, Tooltip } from 'antd';
import moment from 'moment';

type TList = List<IMap>;
const { Option } = Select;
const { Column } = DataGrid;
const opts = [
  {
    key: 0,
    value: '未开始'
  },
  {
    key: 1,
    value: '进行中'
  },
  {
    key: 2,
    value: '已结束'
  },
  {
    key: 3,
    value: '任务失败'
  }
];

const STATUS = ['未开始', '进行中', '已结束', '任务失败'];

@Relax
export default class TaskList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      taskList: TList;
      setData: Function;
      getTaskList: Function;
      initSendSettingForm: Function;
      pageNum: number;
      pageSize: number;
      total: number;
      deleteTask: Function;
    };
  };

  static relaxProps = {
    taskList: 'taskList',
    getTaskList: noop,
    setData: noop,
    initSendSettingForm: noop,
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    total: 'total',
    deleteTask: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      status: null
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
              <SelectGroup
                label="任务状态"
                defaultValue={null}
                dropdownStyle={{ zIndex: 1053 }}
                onChange={(value) => {
                  this.setState({
                    status: value
                  });
                }}
              >
                <Option value={null}>全部</Option>
                {opts.map((v) => (
                  <Option key={v.key} value={v.key}>
                    {v.value}
                  </Option>
                ))}
              </SelectGroup>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                icon="search"
                htmlType="submit"
                onClick={() => {
                  getTaskList({ status: this.state.status });
                }}
              >
                搜索
              </Button>
            </Form.Item>
          </Form>
          <Button
            type="primary"
            className="send-btn"
            onClick={() => {
              this._showModal();
            }}
          >
            发送短信
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
            dataIndex="createTime"
            key="createTime"
            render={(time) => time && time.slice(0, 19)}
          />
          <Column
            title="内容"
            dataIndex="context"
            key="context"
            width={'30%'}
            render={(content) => <div className="sms-content">{content}</div>}
          />
          <Column
            title="接收人"
            render={(record: any) => this._renderReceiver(record)}
          />
          <Column title="预计发送条数" dataIndex="rowCount" key="rowCount" />
          <Column
            title="发送时间"
            dataIndex="sendTime"
            key="sendTime"
            render={(sendTime) =>
              sendTime !== null
                ? moment(sendTime).format('YYYY-MM-DD HH:mm:ss')
                : ''
            }
          />
          <Column
            title="状态"
            dataIndex="status"
            key="status"
            render={(value, record: any) => {
              return (
                <div>
                  <p>{STATUS[value]}</p>
                  {value === 3 && (
                    <Tooltip placement="topLeft" title={record.message}>
                      <a href="javascript:;">原因</a>
                    </Tooltip>
                  )}
                </div>
              );
            }}
          />
          <Column
            title="操作"
            dataIndex="id"
            key="id"
            render={(id, record: any) => {
              let now = moment(new Date()).add(30, 'minute');
              let send = moment(record.sendTime);
              let flag = now.isAfter(send, 'minute');
              const ifModify = +record.status === 0 && !flag;
              return (
                <div>
                  <a
                    href="javascript:;"
                    onClick={() => {
                      this._showModal(id, false);
                    }}
                  >
                    查看
                  </a>
                  {'  '}
                  {ifModify && (
                    <a
                      href="javascript:;"
                      onClick={() => {
                        this._showModal(id, ifModify);
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
                        deleteTask(id);
                      }}
                    >
                      删除
                    </a>
                  )}
                  {'  '}
                  {record.status === 3 && record.resendType === 1 ? (
                    <a href="javascript:;">重新发送</a>
                  ) : (
                    ''
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
    const { initSendSettingForm, setData } = this.props.relaxProps;
    initSendSettingForm(id);
    if (ifModify === false) {
      setData('ifModify', ifModify);
    } else {
      setData('ifModify', true);
    }
    setData('sendModalVisible', true);
  };

  _renderReceiver = (record) => {
    const { receiveNames, receiveType, manualAdd } = record;
    let p = null;
    if (receiveType === 0) {
      p = <p>全部会员</p>;
    } else if (receiveType === 3) {
      p = <p>自定义选择</p>;
    } else {
      p = <p>{receiveNames && receiveNames.join(';')}</p>;
    }
    let add = manualAdd && <p>以上；{manualAdd}</p>;
    return (
      <div>
        {p}
        {add}
      </div>
    );
  };
}
