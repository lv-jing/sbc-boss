import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb, Const, RCi18n } from 'qmkit';
import {
  Form,
  Select,
  Input,
  Button,
  Table,
  Divider,
  message,
  Tooltip,
  Popconfirm,
  Spin
} from 'antd';
import * as webapi from './webapi';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;

export default class DitionaryList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      columns: [
        {
          title: <FormattedMessage id="Setting.Name" />,
          dataIndex: 'name',
          key: 'name',
          width: '20%'
        },
        {
          title: <FormattedMessage id="Setting.Type" />,
          dataIndex: 'type',
          key: 'type',
          width: '20%'
        },
        {
          title: <FormattedMessage id="Setting.Value" />,
          dataIndex: 'valueEn',
          key: 'value',
          width: '20%'
        },
        {
          title: <FormattedMessage id="Setting.Description" />,
          dataIndex: 'description',
          key: 'description',
          width: '20%'
        },
        {
          title: <FormattedMessage id="Setting.Priority" />,
          dataIndex: 'priority',
          key: 'priority',
          width: '10%'
        },
        // {
        //   title: <FormattedMessage id="Setting.Priority" />,
        //   dataIndex: 'operation',
        //   key: 'operation',
        //   width: '10%',
        //   render: (text, record) => (
        //     <span>
        //       <Tooltip
        //         placement="top"
        //         title={`${RCi18n({ id: 'Setting.Edit' })}`}
        //       >
        //         <Link
        //           to={'/dictionary-edit/' + record.id}
        //           className="iconfont iconEdit"
        //         />
        //       </Tooltip>
        //
        //       <Divider type="vertical" />
        //       <Popconfirm
        //         placement="topLeft"
        //         title={`${RCi18n({ id: 'Setting.Areyousuretodelete' })}`}
        //         onConfirm={() => this.deleteDictionary(record.id)}
        //         okText={RCi18n({ id: 'Setting.Confirm' })}
        //         cancelText={RCi18n({ id: 'Setting.Cancel' })}
        //       >
        //         <Tooltip
        //           placement="top"
        //           title={`${RCi18n({ id: 'Setting.Delete' })}`}
        //         >
        //           <a type="link" className="iconfont iconDelete" />
        //         </Tooltip>
        //       </Popconfirm>
        //     </span>
        //   )
        // }
      ],
      dictionaryData: [],
      dictionaryTypes: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      searchForm: {
        keywords: '',
        type: ''
      },
      loading: true
    };
    this.onSearch = this.onSearch.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.queryClinicsDictionary();
    this.getDictionary();
  }
  props: {
    intl: any;
  };
  getDictionary = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 }
  ) => {
    const query = this.state.searchForm;
    this.setState({
      loading: true
    });
    const { res } = await webapi.fetchDictionaryList({
      ...query,
      pageNum,
      pageSize
    });
    if (res.code === Const.SUCCESS_CODE) {
      let pagination = this.state.pagination;
      let dictionaryData = res.context.sysDictionaryPage.content;
      pagination.total = res.context.sysDictionaryPage.total;
      this.setState({
        pagination: pagination,
        dictionaryData: dictionaryData,
        loading: false
      });
    }
  };
  onFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };
  queryClinicsDictionary = async () => {
    const { res } = await webapi.getDictionaryTypes();
    if (res.code === Const.SUCCESS_CODE) {
      this.setState({
        dictionaryTypes: res.context
      });
    } else {
    }
  };
  onSearch = () => {
    const { pagination } = this.state;
    this.setState({
      pagination: {
        ...pagination,
        current: 1
      }
    });
    this.getDictionary({ pageNum: 0, pageSize: 10 });
  };
  handleTableChange(pagination: any) {
    this.setState({
      pagination: pagination
    });
    this.getDictionary({ pageNum: pagination.current - 1, pageSize: 10 });
  }
  deleteDictionary = async (id) => {
    const { res } = await webapi.deleteDictionary({
      id: id
    });
    if (res.code === Const.SUCCESS_CODE) {
      message.success('Operate successfully');
      this.getDictionary({
        pageNum: this.state.pagination.current - 1,
        pageSize: 10
      });
    }
  };
  render() {
    const { columns, dictionaryTypes } = this.state;
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline title={`${RCi18n({ id: 'Setting.Dictionary' })}`} />
          <Form className="filter-content" layout="inline">
            <FormItem>
              <Input
                addonBefore={`${RCi18n({ id: 'Setting.Keyword' })}`}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.onFormChange({
                    field: 'keywords',
                    value
                  });
                }}
                placeholder={RCi18n({
                  id: 'Setting.Pleaseinputnameordiscription'
                })}
                style={{ width: 300 }}
              />
            </FormItem>
            <FormItem>
              <SelectGroup
                defaultValue="All"
                label={RCi18n({ id: 'Setting.Type' })}
                showSearch
                onChange={(value) => {
                  value = value === '' ? null : value;
                  this.onFormChange({
                    field: 'type',
                    value
                  });
                }}
                style={{ width: 300 }}
              >
                <Option value="">{RCi18n({ id: 'Setting.All' })}</Option>
                {dictionaryTypes.map((item) => (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                ))}
              </SelectGroup>
            </FormItem>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon="search"
                shape="round"
                onClick={(e) => {
                  e.preventDefault();
                  this.onSearch();
                }}
              >
                <span>
                  <FormattedMessage id="Setting.search" />
                </span>
              </Button>
            </Form.Item>
          </Form>
          {/*<Button*/}
          {/*  type="primary"*/}
          {/*  htmlType="submit"*/}
          {/*  style={{ marginBottom: '10px' }}*/}
          {/*>*/}
          {/*  <Link to="/dictionary-add">*/}
          {/*    {' '}*/}
          {/*    <FormattedMessage id="Setting.Add" />*/}
          {/*  </Link>*/}
          {/*</Button>*/}
        </div>
        <div className="container">
          <Spin spinning={this.state.loading}>
            <Table
              rowKey={(record, index) => index}
              dataSource={this.state.dictionaryData}
              columns={columns}
              pagination={this.state.pagination}
              onChange={this.handleTableChange}
            />
          </Spin>
        </div>
      </div>
    );
  }
}
