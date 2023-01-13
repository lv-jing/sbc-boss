import * as React from 'react';
import { Relax } from 'plume2';
import { Modal, Form, Input, Row, Col, Icon, Tooltip, message } from 'antd';

import styled from 'styled-components';
import { noop, DataGrid, QMUpload, Const } from 'qmkit';
import { IList } from 'typings/globalType';

const FormItem = Form.Item;
const Search = Input.Search;
const { Column } = DataGrid;

interface TableBoxProps {
  primary?: boolean;
}

const GreyText = styled.span`
  color: #999999;
  font-size: 12px;
`;
const RedPoint = styled.span`
  color: #e73333;
`;

const TableBox = styled.div`
  padding-top: ${(props: TableBoxProps) => (props.primary ? '10px' : 0)};

  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table-self tbody td {
    text-align: left;
  }
`;

const FILE_MAX_SIZE = 2 * 1024 * 1024;

@Relax
export default class BrandModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
    if (__DEV__) {
      (window as any)._props = this;
    }
  }

  props: {
    form: any;
    relaxProps?: {
      brandVisible: boolean;
      brandModal: Function;
      company: any;
      allBrands: any;
      addBrand: Function; //添加品牌
      deleteBrand: Function; //删除品牌
      otherBrands: IList;
      addNewOtherBrand: Function; //新增自定义品牌
      deleteOtherBrand: Function; //删除自定义品牌
      onBrandInputChange: Function; //编辑品牌输入框
      renewBrands: Function; //保存品牌编辑
      changeBrandImg: Function; //编辑授权文件
      storeId: number;
      fetchSignInfo: Function;
      filterBrandName: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    brandVisible: 'brandVisible',
    // 关闭弹框
    brandModal: noop,
    company: 'company',
    allBrands: 'allBrands',
    addBrand: noop,
    deleteBrand: noop,
    otherBrands: 'otherBrands',
    addNewOtherBrand: noop,
    deleteOtherBrand: noop,
    onBrandInputChange: noop,
    renewBrands: noop,
    changeBrandImg: noop,
    storeId: 'storeId',
    fetchSignInfo: noop,
    filterBrandName: noop //根据名称检索
  };

  render() {
    const {
      brandVisible,
      company,
      allBrands,
      filterBrandName
    } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    const brandList = company.get('brandList').toJS();
    let brandIdArray = new Array();
    //brandList扁平化处理
    if (brandList.length > 0) {
      brandList.map((v) => {
        brandIdArray.push(v.brandId);
      });
    }
    if (!brandVisible) {
      return null;
    }
    return (
      <Modal
        maskClosable={false}
        title={
          <div>
            编辑签约品牌
            <GreyText>
              已签约{brandList.length}
              个品牌，最多可签约50个品牌，上传授权文件申请通过率更高噢
            </GreyText>
          </div>
        }
        visible={brandVisible}
        onCancel={this._handleModelCancel}
        onOk={this._handleOK}
        width={980}
      >
        <Form>
          <Row>
            <Col span={6} style={styles.selectBrand}>
              <h3 style={{ marginBottom: 5 }}>选择平台品牌</h3>
              <div style={{ paddingRight: 10 }}>
                <Search
                  placeholder=" 请输入品牌名称"
                  onChange={(e) => filterBrandName(e.target.value)}
                />
                <div
                  style={{
                    height: 470,
                    overflowY: 'scroll',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    background: '#fff',
                    paddingBottom: 10,
                    paddingTop: 10
                  }}
                >
                  <ul>
                    {allBrands.toJS().map((v) => (
                      <li
                        style={
                          brandIdArray.indexOf(v.brandId) == -1
                            ? styles.li
                            : styles.liBlue
                        }
                        key={v.brandId}
                        onClick={() => this._addBrand(v.brandId, v.brandName)}
                      >
                        <div>{v.brandName}</div>
                        {//判断是否要显示勾号
                        brandIdArray.indexOf(v.brandId) == -1 ? null : (
                          <div style={{ marginRight: '10px' }}>
                            <i className="anticon anticon-check" />
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Col>
            <Col span={18}>
              <TableBox>
                <DataGrid
                  dataSource={brandList}
                  rowKey={(record) => record.brandId}
                  scroll={{ y: 400 }}
                  pagination={false}
                >
                  <Column
                    title={
                      <div>
                        <RedPoint>*</RedPoint>品牌名称
                      </div>
                    }
                    dataIndex="brandName"
                    key="brandName"
                    width="12%"
                  />
                  <Column
                    title={
                      <div>
                        <p>品牌别名</p>
                        <GreyText>别名或者英文名</GreyText>
                      </div>
                    }
                    dataIndex="nickName"
                    key="nickName"
                    width="20%"
                    render={(text) => {
                      return text ? <span>{text}</span> : <span>-</span>;
                    }}
                  />
                  <Column
                    title={
                      <div>
                        <RedPoint>*</RedPoint>品牌Logo
                        <Tooltip title="尺寸120px*50px,支持jpg、jpeg、png、gif，不超过50kb">
                          &nbsp;
                          <Icon
                            type="question-circle-o"
                            style={{ color: '#108ee9' }}
                          />
                        </Tooltip>
                      </div>
                    }
                    dataIndex="logo"
                    key="logo"
                    width="20%"
                    render={(text, record) => {
                      return text ? (
                        <img
                          src={(record as any).logo}
                          width="140"
                          height="50"
                          alt=""
                        />
                      ) : (
                        <span>-</span>
                      );
                    }}
                  />
                  <Column
                    title={
                      <div>
                        <p>
                          <RedPoint>*</RedPoint>授权文件
                          <Tooltip title="支持jpg、jpeg、png、gif，单张不超过2M，最多上传2张">
                            &nbsp;
                            <Icon
                              type="question-circle-o"
                              style={{ color: '#108ee9' }}
                            />
                          </Tooltip>
                        </p>
                        <GreyText>商标注册证/受理书/品牌授权书</GreyText>
                      </div>
                    }
                    dataIndex="authorizePic"
                    key="authorizePic"
                    width="30%"
                    render={(text, record: any) => {
                      return (
                        <div>
                          <FormItem>
                            {getFieldDecorator(
                              `${record.brandId}_brand_authorizePic`,
                              {
                                initialValue: text,
                                rules: [{ validator: this.checkAuthImg }]
                              }
                            )(
                              <QMUpload
                                beforeUpload={this._checkUploadFile}
                                name="uploadFile"
                                style={styles.box}
                                listType="picture-card"
                                action={
                                  Const.HOST +
                                  '/uploadResource?resourceType=IMAGE'
                                }
                                fileList={text ? text : []}
                                accept={'.jpg,.jpeg,.png,.gif'}
                                onChange={(info) =>
                                  this._editImages(
                                    info,
                                    record.contractBrandId,
                                    record.brandId
                                  )
                                }
                              >
                                {(text ? text : []).length < 2 && (
                                  <Icon type="plus" style={styles.plus} />
                                )}
                              </QMUpload>
                            )}
                          </FormItem>
                        </div>
                      );
                    }}
                  />
                  <Column
                    title="操作"
                    dataIndex="operation"
                    key="operation"
                    width="13%"
                    render={(_text, record: any) => {
                      return (
                        <a
                          href="javascript:;"
                          onClick={() =>
                            this._deleteBrand(
                              record.contractBrandId,
                              record.brandId
                            )
                          }
                        >
                          删除
                        </a>
                      );
                    }}
                  />
                </DataGrid>
              </TableBox>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { brandModal, fetchSignInfo, storeId } = this.props.relaxProps;
    //还原数据
    this.props.form.resetFields();
    fetchSignInfo(storeId);
    brandModal();
  };

  _addBrand = (id, name) => {
    this.props.form.resetFields();
    this.props.relaxProps.addBrand(id, name);
  };

  /**
   * 上传授权文件
   * @param info
   * @param brandId
   * @private
   */
  _editImages = (info, contractBrandId, brandId) => {
    const { file, fileList } = info;
    if (file.status == 'error' || fileList == null) {
      message.error('上传失败');
      return;
    }
    if (
      file.status == 'removed' ||
      fileList.length == 0 ||
      (fileList.length > 0 && this._checkUploadFile(file))
    ) {
      const { changeBrandImg } = this.props.relaxProps;
      changeBrandImg({
        brandId: brandId,
        contractBrandId: contractBrandId,
        imgs: JSON.stringify(fileList)
      });
    }
  };

  /**
   * 检查文件格式
   */
  _checkUploadFile = (file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= FILE_MAX_SIZE) {
        return true;
      } else {
        message.error('文件大小不能超过2M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };

  /**
   * 保存弹框编辑
   * @private
   */
  _handleOK = () => {
    const form = this.props.form;
    const { renewBrands, company } = this.props.relaxProps;
    const brandList = company.get('brandList').toJS();
    if (brandList.length < 1) {
      //非空自定义品牌和选中的平台品牌加起来小于1时
      message.error('请至少添加一种签约品牌');
    } else {
      //对非空的进行校验
      form.validateFields(null, (errs) => {
        //如果校验通过
        if (!errs) {
          renewBrands();
        } else {
          this.setState({});
        }
      });
    }
  };

  //检查授权文件
  checkAuthImg = (_rule, value, callback) => {
    if (!value || !value[0] || !value[0].url) {
      if (!value.fileList || value.fileList.length == 0) {
        if (!value.length) {
          callback(new Error('请上传品牌授权文件'));
          return;
        }
      }
    }
    callback();
  };

  _deleteBrand = (contractId, brandId) => {
    this.props.form.resetFields();
    const { deleteBrand } = this.props.relaxProps;
    deleteBrand(contractId, brandId);
  };
}

const styles = {
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  },
  li: {
    paddingTop: '5px',
    paddingBottom: '5px',
    marginBottom: '3px',
    paddingLeft: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer'
  } as any,
  liBlue: {
    marginBottom: '3px',
    paddingTop: '5px',
    paddingBottom: '5px',
    paddingLeft: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'rgb(232, 242, 249)',
    cursor: 'pointer'
  },
  selectBrand: {
    borderRight: '1px solid #e9e9e9',
    paddingTop: 24,
    marginTop: -24,
    paddingBottom: 24,
    marginBottom: -24,
    marginRight: 10,
    marginLeft: -10
  }
};
