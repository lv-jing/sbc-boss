import React from 'react';
import { DataGrid, noop, util } from 'qmkit';
import { IMap, Relax } from 'plume2';
import { List } from 'immutable';
import { Button, Form, Input, Switch } from 'antd';

type TList = List<IMap>;
const { Column } = DataGrid;

@Relax
export default class NoticeList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      noticeList: TList;
      setData: Function;
      getNoticeList: Function;
      noticePage: IMap;
      initPushTaskForm: Function;
      initNodeForm: Function;
      changeSwitch: Function;
    };
  };

  static relaxProps = {
    setData: noop,
    noticePage: 'noticePage',
    noticeList: 'noticeList',
    getNoticeList: noop,
    initPushTaskForm: noop,
    initNodeForm: noop,
    changeSwitch: noop
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
      noticePage,
      changeSwitch
    } = this.props.relaxProps;

    const pageSize = noticePage.get('pageSize');
    const total = noticePage.get('total');
    const pageNum = noticePage.get('pageNum');
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
          dataSource={noticeList.toJS() ? noticeList.toJS() : []}
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
            key="nodeNameType"
            render={(nodeName) => nodeName}
          />

          <Column
            width="15%"
            title="通知标题"
            dataIndex="nodeTitle"
            key="nodeTitle"
          />

          <Column
            width="30%"
            title="通知内容"
            dataIndex="nodeContext"
            key="nodeContext"
          />

          <Column
            width="10%"
            title="预计发送 | 收到数"
            dataIndex="expectedSendCount"
            key="expectedSendCount"
            render={(expectedSendCount, record: any) => {
              return (
                <div>
                  {expectedSendCount}&nbsp;|&nbsp;{record.actuallySendCount}
                </div>
              );
            }}
          />

          <Column
            width="10%"
            title="打开数 | 打开率"
            dataIndex="openCount"
            key="openCount"
            render={(openCount, record: any) => {
              return (
                <div>
                  {openCount}&nbsp;|&nbsp;
                  {record.actuallySendCount == 0
                    ? '0%'
                    : util.devision(record.openCount, record.actuallySendCount)}
                </div>
              );
            }}
          />

          <Column
            width="10%"
            title="操作"
            dataIndex="id"
            key="recordId"
            render={(id, record: any, index) => {
              return (
                <div className="rowSwitchCenter">
                  <Switch
                    checkedChildren="开"
                    unCheckedChildren="关"
                    checked={record.status == 1}
                    onChange={(e) => {
                      changeSwitch({ id: id, index: index, flag: e });
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
