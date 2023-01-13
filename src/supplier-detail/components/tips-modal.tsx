import * as React from 'react';
import { Relax } from 'plume2';
import { Modal, Alert } from 'antd';
import styled from 'styled-components';

import { noop, DataGrid } from 'qmkit';

const { Column } = DataGrid;

const PicBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;

  img {
    width: 60px;
    height: 60px;
    padding: 5px;
    border: 1px solid #ddd;
    margin-right: 10px;
    margin-bottom: 10px;
  }
`;

@Relax
export default class TipsModal extends React.Component<any, any> {
  props: {
    relaxProps?: {
      sameBrands: any;
      tipsVisible: boolean;
      tipsModal: Function;
      supplierCheckInfo: Function;
      closeTipsModal: Function;
      acceptSupplier: Function;
      brandRelevance: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    tipsVisible: 'tipsVisible',
    tipsModal: noop,
    supplierCheckInfo: noop,
    sameBrands: 'sameBrands',
    closeTipsModal: noop,
    acceptSupplier: noop,
    brandRelevance: noop
  };

  render() {
    const { tipsVisible, sameBrands } = this.props.relaxProps;
    return (
       <Modal  maskClosable={false}
        title={<div>审核提示</div>}
         
        visible={tipsVisible}
        closable={false}
        onCancel={this._handleModelCancel}
        onOk={this._handleOk}
        okText="直接关联"
        cancelText="驳回"
        width="900"
      >
        <div>
          <Alert
            message="发现以下商家自传品牌与平台品牌品牌重复，您可以直接关联为平台已有品牌或是驳回申请"
            type="warning"
            showIcon
          />
          <DataGrid dataSource={sameBrands.toJS()} pagination={false}>
            <Column
              title="来源"
              dataIndex="source"
              key="source"
              width="12%"
              render={(text) => {
                return text == '平台' ? (
                  <span style={{ color: '#f04134' }}>{text}</span>
                ) : (
                  <span>{text}</span>
                );
              }}
            />
            <Column
              title="品牌名称"
              dataIndex="brandName"
              key="brandName"
              width="12%"
              render={(text, record: any) => {
                return record.source == '平台' ? (
                  <span style={{ color: '#f04134' }}>{text}</span>
                ) : (
                  <span>{text}</span>
                );
              }}
            />
            <Column
              title="品牌别名"
              dataIndex="nickName"
              key="nickName"
              width="12%"
            />
            <Column
              title="品牌logo"
              dataIndex="logo"
              key="logo"
              render={(text) => {
                return text ? (
                  <img src={text} alt="" height="50" />
                ) : (
                  <span>-</span>
                );
              }}
            />
            <Column
              title="授权文件"
              dataIndex="authorizePic"
              key="authorizePic"
              width="50%"
              render={(text) => {
                let images = text ? text.split(',') : [];
                return images.length > 0 ? (
                  <PicBox>
                    {images.map((v, k) => {
                      return <img src={v} key={k} alt="" />;
                    })}
                  </PicBox>
                ) : (
                  <span>-</span>
                );
              }}
            />
          </DataGrid>
        </div>
      </Modal>
    );
  }

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { tipsModal, supplierCheckInfo } = this.props.relaxProps;
    //点击驳回，auditState置为2
    supplierCheckInfo({ field: 'auditState', value: 2 });
    //关闭弹框
    tipsModal();
  };

  /**
   * 直接关联，进行审核动作
   * @private
   */
  _handleOk = () => {
    const {
      supplierCheckInfo,
      closeTipsModal,
      brandRelevance
    } = this.props.relaxProps;
    //关闭弹框
    closeTipsModal();
    //审核状态置为1
    supplierCheckInfo({ field: 'auditState', value: 1 });
    //关联
    brandRelevance();
  };
}
