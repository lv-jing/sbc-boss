import React from 'react';
import { DataGrid, noop } from 'qmkit';
import { Relax, IMap } from 'plume2';
import { List } from 'immutable';
import { Popconfirm, Tooltip, Switch } from 'antd';
type TList = List<IMap>;

const { Column } = DataGrid;
const STATUS = ['待审核', '审核通过', '未通过', '待提交'];

@Relax
export default class TemplateList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      templateList: TList;
      deleteTemplate: Function;
      submitTemplate: Function;
      pageNum: number;
      pageSize: number;
      total: number;
      getTemplateList: Function;
      templateType: any;
      changeOpenFlag: Function;
    };
  };

  static relaxProps = {
    templateList: 'templateList',
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    total: 'total',
    templateType: 'templateType',
    deleteTemplate: noop,
    submitTemplate: noop,
    getTemplateList: noop,
    changeOpenFlag: noop
  };

  constructor(props) {
    super(props);
  }
  render() {
    const {
      templateList,
      deleteTemplate,
      submitTemplate,
      total,
      pageSize,
      pageNum,
      getTemplateList,
      templateType,
      changeOpenFlag
    } = this.props.relaxProps;
    return (
      <DataGrid
        dataSource={templateList.toJS()}
        pagination={{
          pageSize,
          total,
          current: pageNum,
          onChange: (pageNum, pageSize) => {
            getTemplateList(null, null, null, pageNum - 1, pageSize);
          }
        }}
      >
        <Column title="模板code" dataIndex="templateCode" />
        {+templateType === 0 && (
          <Column
            title="模板用途"
            dataIndex="purpose"
            render={(purpose) => {
              return purpose || '-';
            }}
          />
        )}
        {+templateType === 1 && (
          <Column
            title="通知节点"
            dataIndex="purpose"
            render={(purpose) => {
              return purpose || '-';
            }}
          />
        )}
        <Column title="模板名称" dataIndex="templateName" />
        <Column
          title="模板内容"
          dataIndex="templateContent"
          key="templateContent"
          width={'40%'}
          render={(content) => <div className="sms-content">{content}</div>}
        />
        <Column
          title="状态"
          dataIndex="reviewStatus"
          render={(value, record: any) => {
            return (
              <div>
                <p>{STATUS[value]}</p>
                {value === 2 && (
                  <Tooltip placement="topLeft" title={record.reviewReason}>
                    <a href="javascript:;">原因</a>
                  </Tooltip>
                )}
              </div>
            );
          }}
        />
        <Column
          title="操作"
          render={(record) => {
            const { id, reviewStatus, templateType, openFlag } = record;
            if (reviewStatus === 0) {
              return '-';
            }
            return (
              <div>
                {+templateType === 1 && (
                  <Switch
                    checked={openFlag}
                    onChange={() => {
                      changeOpenFlag(id, !openFlag);
                    }}
                  />
                )}
                {reviewStatus === 3 && (
                  <a
                    href="javascript:;"
                    onClick={() => {
                      submitTemplate(id);
                    }}
                  >
                    提交备案
                  </a>
                )}
                {'   '}
                {(reviewStatus === 2 || reviewStatus === 3) && (
                  <a href={`/sms-template/${templateType}/${id}`}>
                    编辑{'    '}
                  </a>
                )}
                <Popconfirm
                  title="删除后可能影响业务通知，确定要删除？"
                  onConfirm={() => {
                    deleteTemplate(id);
                  }}
                  okText="确定"
                  cancelText="取消"
                >
                  <a href="javascript:;">删除</a>
                </Popconfirm>
              </div>
            );
          }}
        />
      </DataGrid>
    );
  }
}
