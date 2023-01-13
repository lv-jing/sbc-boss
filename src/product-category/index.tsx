import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history } from 'qmkit';
import { Icon, Table, Tooltip, Divider, Switch, Modal, Button, Form, Input, Row, Col, Breadcrumb, Tag, message, Select, Radio, DatePicker, Spin, Alert, InputNumber, Tabs } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

//import BindDescription from './components/bind-description';

const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

class PeoductCategory extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: <FormattedMessage id="Product.ProductCategory" />,
      currentId: '',
      visible: false,
      productCategoryList: [],
      selectedRowKeys: [],
      attributeList: [],
      confirmLoading: false,
      pagination: {
        current: 1,
        pageSize: 8,
        total: 0
      },
      searchForm: {
        attributeName: '',
        attributeValue: ''
      },
      loading: true,
      bindId: 0,
      bindVisible: false,
      bindDescriptionIds: []
    };
  }
  componentDidMount() {
    this.getGoodsCates();
  }
  removeChildrenIsNull = (objArr) => {
    let tempString = JSON.stringify(objArr);
    let returnString = tempString.replaceAll(',"children":[]', '');
    return JSON.parse(returnString);
  };
  openBindAttribute = (id) => {
    this.setState(
      {
        currentId: id,
        pagination: {
          current: 1,
          pageSize: 8,
          total: 0
        },
        searchForm: {
          attributeName: '',
          attributeValue: ''
        },
        loading: false
      },
      () => this.getAttributes()
    );
    this.getSelectedListById(id);
  };
  handleOk = () => {
    this.setState({
      confirmLoading: true
    });
    this.relationAttributes();
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  getAttributes = () => {
    const { pagination, searchForm } = this.state;
    let params = {
      attributeName: searchForm.attributeName,
      attributeValue: searchForm.attributeValue,
      attributeStatus: true,
      pageSize: pagination.pageSize,
      pageNum: pagination.current - 1
    };
    webapi
      .getAttributes(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          pagination.total = res.context.total;
          const attributeList = res.context.attributesList;
          this.setState({ attributeList, pagination });
        }
      })
      .catch((err) => {});
  };

  getGoodsCates = () => {
    webapi.getGoodsCates().then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        this.init(res.context);
      }
    });
  };
  init(cates) {
    const newDataList = cates
      .filter((item) => item && item.cateParentId == 0)
      .map((data) => {
        const children = cates
          .filter((item) => item && item.cateParentId == data.cateId)
          .map((childrenData) => {
            const lastChildren = cates
              .filter((item) => item && item.cateParentId == childrenData.cateId)
              .sort((c1, c2) => {
                return c1.sort - c2.sort;
              });
            if (lastChildren.length > 0) {
              childrenData.children = lastChildren;
            }
            return childrenData;
          })
          .sort((c1, c2) => {
            return c1.sort - c2.sort;
          });
        if (children.length > 0) {
          data.children = children;
        }
        return data;
      })
      .sort((c1, c2) => {
        return c1.sort - c2.sort;
      });
    setTimeout(() => {
      this.setState({
        productCategoryList: newDataList,
        loading: false
      });
    }, 100);
  }

  start = () => {
    this.setState({
      selectedRowKeys: []
    });
  };
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  getSelectedListById = (id) => {
    webapi.getSelectedListById(id).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        let selectedRows = res.context;
        let selectedRowKeys = [];
        for (let i = 0; i < selectedRows.length; i++) {
          selectedRowKeys.push(selectedRows[i].id);
        }
        this.setState({
          selectedRowKeys,
          visible: true
        });
      }
    });
  };
  relationAttributes = () => {
    const { currentId, selectedRowKeys } = this.state;
    let params = {
      attributesIdList: selectedRowKeys,
      goodsCateId: currentId
    };
    webapi
      .relationAttributes(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(<FormattedMessage id="Product.OperateSuccessfully" />);
          this.setState({
            visible: false,
            confirmLoading: false,
            loading: false
          });
        } else {
          this.setState({
            confirmLoading: false,
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          confirmLoading: false
        });
      });
  };
  getAttributeValue = (attributeValueList) => {
    let attributeValue = [];
    for (let i = 0; i < attributeValueList.length; i++) {
      attributeValue.push(attributeValueList[i].attributeDetailName);
    }
    return attributeValue.join(';');
  };
  onFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data,
      loading: false
    });
  };
  onSearch = () => {
    this.setState(
      {
        pagination: {
          current: 1,
          pageSize: 8,
          total: 0,
          loading: false
        }
      },
      () => this.getAttributes()
    );
  };
  handleTableChange = (pagination: any) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getAttributes()
    );
  };

  openBindModal = (id) => {
    this.setState({ loading: true });
    webapi
      .getBindDescription(id)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            loading: false,
            bindId: id,
            bindVisible: true,
            bindDescriptionIds: res.context.map((item) => item.id)
          });
        } else {
          message.error(res.message || (window as any).RCi18n({id:'Public.GetDataFailed'}));
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        message.error(err || (window as any).RCi18n({id:'Public.GetDataFailed'}));
        this.setState({
          loading: false
        });
      });
  };

  onCloseBindingModal = (status: boolean) => {
    this.setState({
      bindVisible: status
    });
  };

  render() {
    const { title, productCategoryList, selectedRowKeys, confirmLoading, attributeList, searchForm, pagination, bindId, bindVisible, bindDescriptionIds } = this.state;
    const columns = [
      {
        title: <FormattedMessage id="Product.CategoryName" />,
        dataIndex: 'cateName',
        key: 'cateName'
      },
      {
        title: <FormattedMessage id="Product.CategoryImages" />,
        dataIndex: 'cateImg',
        key: 'cateImg',
        render: (text) => <div>{text ? <img src={text} alt="" style={{ width: 30 }} /> : '-'}</div>
      },
      {
        title: <FormattedMessage id="Product.Operation" />,
        dataIndex: '',
        key: 'x',
        render: (text, record) => (
          <div>
            {/* {record.cateGrade === 3 ? (
              <div>
                <Tooltip placement="topLeft" title={<FormattedMessage id="Product.BindAttribute" />}>
                  <a style={styles.edit} className="iconfont iconbtn-addsubvisionsaddcategory" onClick={() => this.openBindAttribute(record.cateId)}></a>
                </Tooltip>
                <Tooltip placement="topLeft" title={<FormattedMessage id="Product.BindDescription" />}>
                  <a className="iconfont iconbangding" onClick={() => this.openBindModal(record.cateId)}></a>
                </Tooltip>
              </div>
            ) : (
              '-'
            )} */}
          </div>
        )
      }
    ];
    const columns_attribute = [
      {
        title: <FormattedMessage id="Product.AttributeName" />,
        dataIndex: 'attributeName',
        key: 'attributeName'
      },
      {
        title: <FormattedMessage id="Product.DisplayName" />,
        dataIndex: 'attributeNameEn',
        key: 'attributeNameEn'
      },
      {
        title: <FormattedMessage id="Product.AttributeValue" />,
        dataIndex: 'attributeValue',
        key: 'attributeValue',
        width: '30%',
        render: (text, record) => <p>{record.attributesValuesVOList ? this.getAttributeValue(record.attributesValuesVOList) : ''}</p>
      }
    ];
    const description = (
      <div>
        <p>
          <FormattedMessage id="Product.associateAttribute" />
        </p>
      </div>
    );

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const hasSelected = selectedRowKeys.length > 0;

    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}

        <div className="container-search">
          <Spin style={{ position: 'fixed', top: '30%', left: '100px' }} spinning={this.state.loading}>
            <Headline title={title} />
            <Alert message={description} type="info" />

            <Table rowKey="cateId" columns={columns} dataSource={this.removeChildrenIsNull(productCategoryList)} style={{ marginRight: 10 }} />
          </Spin>
        </div>
        <Modal title={<FormattedMessage id="Product.BindAttribute" />} width="800px" visible={this.state.visible} confirmLoading={confirmLoading} onOk={this.handleOk} onCancel={this.handleCancel}>
          <div>
            <div style={{ marginBottom: 16 }}>
              <Form className="filter-content" layout="inline">
                <Row>
                  <Col span={10}>
                    <FormItem>
                      <Input
                        addonBefore={
                          <p style={styles.label}>
                            <FormattedMessage id="Product.AttributeName" />
                          </p>
                        }
                        value={searchForm.attributeName}
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          this.onFormChange({
                            field: 'attributeName',
                            value
                          });
                        }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={10}>
                    <FormItem>
                      <Input
                        addonBefore={
                          <p style={styles.label}>
                            <FormattedMessage id="Product.AttributeValue" />
                          </p>
                        }
                        value={searchForm.attributeValue}
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          this.onFormChange({
                            field: 'attributeValue',
                            value
                          });
                        }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={4} style={{ textAlign: 'center' }}>
                    <FormItem>
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
                          <FormattedMessage id="Product.search" />
                        </span>
                      </Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>

              <Button type="primary" onClick={this.start} disabled={!hasSelected}>
                <FormattedMessage id="Product.Reload" />
              </Button>
              <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
            </div>
            <Table rowKey="id" onChange={this.handleTableChange} rowSelection={rowSelection} columns={columns_attribute} dataSource={attributeList} pagination={pagination} />
          </div>
        </Modal>
        {/* {bindVisible && (
          <BindDescription
            id={bindId}
            visible={bindVisible}
            defaultIds={bindDescriptionIds}
            onCloseModal={() => {
              this.onCloseBindingModal(false);
            }}
          />
        )} */}
      </div>
    );
  }
}
const styles = {
  edit: {
    paddingRight: 10
  }
} as any;

export default Form.create()(PeoductCategory);
