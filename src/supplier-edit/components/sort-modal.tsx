import * as React from 'react';
import { Relax } from 'plume2';

import { Modal, Form, Input, Row, Col, Icon, Tooltip, message } from 'antd';
import styled from 'styled-components';
import { noop, DataGrid, QMUpload, ValidConst, Const } from 'qmkit';
import { IList } from 'typings/globalType';

import CateTree from './cate-tree';

const { Column } = DataGrid;
const FILE_MAX_SIZE = 2 * 1024 * 1024;
const GreyText = styled.span`
  color: #999999;
  font-size: 12px;
  strong {
    color: #666666;
  }
`;

const TableBox = styled.div`
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table-self tbody td {
    text-align: left;
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 16px 6px;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
`;
const FormItem = Form.Item;

@Relax
export default class SortModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  props: {
    form: any;
    relaxProps?: {
      sortsVisible: boolean;
      cates: IList;
      cateSize: number;

      sortModal: Function;
      delCate: Function;
      changeRate: Function;
      changeImg: Function;
      save: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    sortsVisible: 'sortsVisible',
    // 弹框中的签约分类
    cates: 'cates',
    // 签约数量
    cateSize: 'cateSize',

    // 关闭弹框
    sortModal: noop,
    // 删除签约分类
    delCate: noop,
    // 修改扣率
    changeRate: noop,
    // 修改图片
    changeImg: noop,
    // 保存
    save: noop
  };

  render() {
    const { sortsVisible, cates, cateSize, delCate } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    if (!sortsVisible) {
      return null;
    }
    return (
      <Form>
         <Modal  maskClosable={false}
          title={
            <div>
              编辑签约类目<GreyText>
                请选择末级类目签约，已签约<strong>{cateSize}</strong>个类目，最多可签约<strong
                >
                  200
                </strong>个类目
              </GreyText>
            </div>
          }
           
          visible={sortsVisible}
          onCancel={this._handleModelCancel}
          onOk={this._handleOk}
          width={980}
        >
          <Row>
            <Col span={6}>
              <CateTree />
            </Col>
            <Col span={18}>
              <TableBox>
                <DataGrid
                  dataSource={cates.toJS()}
                  scroll={{ y: 400 }}
                  pagination={false}
                  rowKey={(record) => record.cateId}
                >
                  <Column
                    title="类目"
                    dataIndex="cateName"
                    key="cateName"
                    width="13%"
                  />
                  <Column
                    title="上级类目"
                    dataIndex="parentGoodCateNames"
                    key="parentGoodCateNames"
                    width="15%"
                  />
                  <Column
                    title={
                      <div>
                        平台类目扣率<Tooltip title="如不填写自定义扣率，该签约类目扣率将使用平台扣率">
                          &nbsp;<Icon
                            type="question-circle-o"
                            style={{ color: '#108ee9' }}
                          />
                        </Tooltip>
                      </div>
                    }
                    dataIndex="platformCateRate"
                    key="platformCateRate"
                    width="17%"
                    render={(text) => text + '%'}
                  />
                  <Column
                    title={
                      <div>
                        自定义类目扣率<Tooltip title="填写后该签约类目扣率不会跟随平台扣率的调整变化">
                          &nbsp;<Icon
                            type="question-circle-o"
                            style={{ color: '#108ee9' }}
                          />
                        </Tooltip>
                      </div>
                    }
                    dataIndex="cateRate"
                    key="cateRate"
                    width="20%"
                    render={(text, record: any) => {
                      return (
                        <div>
                          <FormItem>
                            {getFieldDecorator(`${record.cateId}_cateRate`, {
                              initialValue: text,
                              rules: [
                                {
                                  pattern: ValidConst.discount,
                                  message: '请填写正确的扣率'
                                }
                              ]
                            })(
                              <Input
                                style={{ width: 50 }}
                                onChange={(e: any) =>
                                  this._changeCateRate(
                                    e.target.value,
                                    record.cateId
                                  )
                                }
                              />
                            )}
                            &nbsp;%
                          </FormItem>
                        </div>
                      );
                    }}
                  />
                  <Column
                    title={
                      <div>
                        <p>
                          经营资质&nbsp;<Tooltip title="支持jpg、jpeg、png、gif，单张不超过2M，最多上传10张">
                            <Icon
                              style={{ color: '#108ee9' }}
                              type="question-circle-o"
                            />
                          </Tooltip>
                        </p>
                        <GreyText>签约类目相关的行业经营许可证</GreyText>
                      </div>
                    }
                    dataIndex="qualificationPics"
                    key="qualificationPics"
                    width="27%"
                    render={(text, record: any) => {
                      return (
                        <QMUpload
                          name="uploadFile"
                          style={styles.box}
                          fileList={text ? JSON.parse(text) : []}
                          action={
                            Const.HOST + '/uploadResource?resourceType=IMAGE'
                          }
                          listType="picture-card"
                          accept={'.jpg,.jpeg,.png,.gif'}
                          onChange={(info) =>
                            this._editImages(info, record.cateId)
                          }
                          beforeUpload={this._checkUploadFile}
                        >
                          {(text ? JSON.parse(text) : []).length < 10 && (
                            <Icon type="plus" style={styles.plus} />
                          )}
                        </QMUpload>
                      );
                    }}
                  />
                  <Column
                    title="操作"
                    dataIndex="operation"
                    key="operation"
                    width="8%"
                    render={(_text, record: any) => (
                      <a
                        href="javascript:;"
                        onClick={() => delCate(record.cateId)}
                      >
                        删除
                      </a>
                    )}
                  />
                </DataGrid>
              </TableBox>
            </Col>
          </Row>
        </Modal>
      </Form>
    );
  }

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { sortModal } = this.props.relaxProps;
    sortModal();
  };

  /**
   * 输入折扣率
   */
  _changeCateRate = (value, cateId) => {
    this.props.relaxProps.changeRate({ rate: value, cateId });
  };

  /**
   * 保存
   */
  _handleOk = () => {
    const form = this.props.form;
    form.validateFields(null, (errs) => {
      //如果校验通过
      if (!errs) {
        this.props.relaxProps.save();
      } else {
        this.setState({});
      }
    });
  };

  /**
   * 改变图片
   */
  _editImages = (info, cateId) => {
    const { file, fileList } = info;
    if (fileList.length > 10) {
      message.error('最多只能上传10张图片');
      return;
    }
    const { changeImg } = this.props.relaxProps;
    const status = file.status;
    if (status === 'done') {
      message.success(`${file.name} 上传成功！`);
    } else if (status === 'error') {
      message.error(`${file.name} 上传失败！`);
    }
    changeImg({ cateId, imgs: JSON.stringify(fileList) });
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
  }
};
