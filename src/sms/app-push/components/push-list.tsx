import React from 'react';
import { DataGrid, noop } from 'qmkit';
import { IMap, Relax } from 'plume2';
import { List } from 'immutable';
import { Button, Form, Input, Popconfirm } from 'antd';
import moment from 'moment';

type TList = List<IMap>;
const { Column } = DataGrid;

// const STATUS = ['未开始', '进行中', '已结束', '任务失败'];
// 需求地址：https://next.modao.cc/app/e04b6b936fd3657cfdf57c40f1ac71814dd5e1aa#screen=sk40vn2jogx79o1
const STATUS = {
  NULL: null,
  QUEUE: 0, //排队中
  SEND: 1, //发送中
  SEND_END: 2, //发送完成
  SEND_FAIL: 3, //发送失败
  CANCEL: 4, //消息被撤销
  OVERDUE: 5, //消息过期
  RESULT_IS_NULL: 6, //筛选结果为空
  JOB_NOT_START: 7 //定时任务尚未开始处理
};

@Relax
export default class PushList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      pushList: TList;
      setData: Function;
      getPushList: Function;
      pushPage: IMap;
      deleteTask: Function;
      initPushTaskForm: Function;
    };
  };

  static relaxProps = {
    setData: noop,
    pushPage: 'pushPage',
    deleteTask: noop,

    pushList: 'pushList',
    getPushList: noop,
    initPushTaskForm: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      msgName: null
    };
  }
  render() {
    const { pushList, getPushList, pushPage } = this.props.relaxProps;
    const pageSize = pushPage.get('pageSize');
    const total = pushPage.get('total');
    const pageNum = pushPage.get('pageNum');
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
                    msgName: e.target.value
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
                  getPushList({ msgName: this.state.msgName });
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
            创建推送任务
          </Button>
        </div>
        <DataGrid
          dataSource={pushList.toJS()}
          pagination={{
            pageSize,
            total,
            current: pageNum,
            onChange: (pageNum, pageSize) => {
              getPushList({
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
            dataIndex="msgName"
            key="msgName"
            render={(msgName, record: any) => (
              <div>
                <div>{msgName}</div>
                {/*{record.pushFlag === 0 && <div className="pushTags">push消息</div>}*/}
                {record.pushFlag === 1 && (
                  <div className="pushTags">运营计划</div>
                )}
              </div>
            )}
          />
          <Column
            title="消息内容"
            width={250}
            dataIndex="msgContext"
            key="msgContext"
            render={(msgContext) => (
              <div className="sms-content">{msgContext}</div>
            )}
          />
          <Column
            title="接收人"
            width={200}
            key="renderReceiver"
            render={(record: any) => this._renderReceiver(record)}
          />
          <Column
            title="发送时间"
            width={118}
            dataIndex="pushTime"
            key="pushTime"
            render={(pushTime, record: any) =>
              pushTime !== null
                ? moment(pushTime).format('YYYY-MM-DD HH:mm:ss')
                : moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')
            }
          />
          <Column
            title="预计发送"
            dataIndex="expectedSendCount"
            key="expectedSendCount"
          />

          <Column
            title="收到数 | 打开数 | 打开率"
            key="rowCount1"
            render={(record: any) => this._statistical(record)}
          />

          <Column
            title="状态"
            key="status"
            render={(record: any) => this._status(record)}
          />

          <Column
            title="操作"
            key="id"
            render={(record: any) => this._operation(record)}
          />
        </DataGrid>
      </div>
    );
  }

  _showModal = async (id?, ifModify?) => {
    const { initPushTaskForm, setData } = this.props.relaxProps;
    await initPushTaskForm(id);
    if (ifModify === false) {
      setData('ifModify', ifModify);
    } else {
      setData('ifModify', true);
    }
    setData('sendModalVisible', true);
  };

  _renderReceiver = (record) => {
    const { msgRecipientNames, msgRecipient } = record;
    let p = null;
    if (msgRecipient === 0) {
      p = <p>全部会员</p>;
    } else if (msgRecipient === 4) {
      p = <p>自定义选择</p>;
    } else {
      p = <p>{msgRecipientNames && msgRecipientNames.join(';')}</p>;
    }
    return <div>{p}</div>;
  };

  /**
   * 收到数｜打开数｜打开率
   * @param record
   * @private
   */
  _statistical = (record) => {
    let iosHtml = null;
    let androidHtml = null;

    if (record.iosPushDetail) {
      iosHtml = (
        <div>
          <img
            width={16}
            height={16}
            src={require('../img/apple.png')}
            alt=""
          />
          &nbsp;
          {record.iosPushDetail.sendSum +
            ' | ' +
            record.iosPushDetail.openSum +
            ' | ' +
            ((record.iosPushDetail.openSum
              ? (
                  (record.iosPushDetail.openSum /
                    record.iosPushDetail.sendSum) *
                  100
                ).toFixed(2)
              : '0') +
              '%')}
        </div>
      );
    } else {
      iosHtml = (
        <div>
          <img
            width={16}
            height={16}
            src={require('../img/apple.png')}
            alt=""
          />
          &nbsp; - | - | -
        </div>
      );
    }

    const html = <div style={{ height: 5 }}>&nbsp;</div>;

    if (record.androidPushDetail) {
      androidHtml = (
        <div>
          <img
            width={16}
            height={16}
            src={require('../img/android.png')}
            alt=""
          />
          &nbsp;
          {record.androidPushDetail.sendSum +
            ' | ' +
            record.androidPushDetail.openSum +
            ' | ' +
            ((record.androidPushDetail.openSum
              ? (
                  (record.androidPushDetail.openSum /
                    record.androidPushDetail.sendSum) *
                  100
                ).toFixed(2)
              : '0') +
              '%')}
        </div>
      );
    } else {
      androidHtml = (
        <div>
          <img
            width={16}
            height={16}
            src={require('../img/android.png')}
            alt=""
          />
          &nbsp; - | - | -
        </div>
      );
    }

    return (
      <div>
        {iosHtml}
        {html}
        {androidHtml}
      </div>
    );
  };

  /**
   * 状态
   * @private
   */
  _status = (record) => {
    let iosHtml = null;
    let androidHtml = null;
    if (record.iosPushDetail) {
      if (
        record.iosPushDetail.sendStatus ==
        (STATUS.QUEUE || STATUS.SEND || STATUS.JOB_NOT_START)
      ) {
        iosHtml = '进行中';
      } else if (record.iosPushDetail.sendStatus == STATUS.SEND_END) {
        iosHtml = '已结束';
      } else if (record.iosPushDetail.sendStatus == STATUS.SEND_FAIL) {
        iosHtml = '任务失败';
      } else if (record.iosPushDetail.sendStatus == STATUS.NULL) {
        iosHtml = '未开始';
      }
    } else {
      iosHtml = '-';
    }

    const html = <div style={{ height: 5 }}>&nbsp;</div>;

    if (record.androidPushDetail) {
      if (
        record.androidPushDetail.sendStatus ==
        (STATUS.QUEUE || STATUS.SEND || STATUS.JOB_NOT_START)
      ) {
        androidHtml = '进行中';
      } else if (record.androidPushDetail.sendStatus == STATUS.SEND_END) {
        androidHtml = '已结束';
      } else if (record.androidPushDetail.sendStatus == STATUS.SEND_FAIL) {
        androidHtml = '任务失败';
      } else if (record.androidPushDetail.sendStatus == STATUS.NULL) {
        androidHtml = '未开始';
      }
    } else {
      androidHtml = '-';
    }
    return (
      <div>
        {iosHtml}
        {html}
        {androidHtml}
      </div>
    );
  };

  _operation = (record) => {
    let ifModify = false;
    if (record.iosPushDetail && !record.androidPushDetail) {
      ifModify = record.iosPushDetail.sendStatus == STATUS.NULL;
    }

    if (!record.iosPushDetail && record.androidPushDetail) {
      ifModify = record.androidPushDetail.sendStatus == STATUS.NULL;
    }

    if (record.iosPushDetail && record.androidPushDetail) {
      ifModify =
        record.iosPushDetail.sendStatus == STATUS.NULL &&
        record.androidPushDetail.sendStatus == STATUS.NULL;
    }

    return (
      <div>
        <a
          href="javascript:;"
          onClick={() => {
            this._showModal(record.id, false);
          }}
        >
          查看
        </a>
        {'  '}
        {ifModify && (
          <a
            href="javascript:;"
            onClick={() => {
              this._showModal(record.id, ifModify);
            }}
          >
            编辑
          </a>
        )}
        {'  '}
        {ifModify && (
          <Popconfirm
            title="确定删除?"
            onConfirm={() => this.props.relaxProps.deleteTask(record.id)}
          >
            <a href="javascript:;">删除</a>
          </Popconfirm>
        )}
      </div>
    );
  };
}
