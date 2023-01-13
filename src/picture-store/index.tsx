import React from 'react';
import { Row, Col } from 'antd';

import { Headline,BreadCrumb, RCi18n } from 'qmkit';
import AppStore from './store';

import ImageList from './component/image-list';
import MoveImageModal from './component/moveImage-modal';
import UploadImageModal from './component/uploadImage-modal';
import CateModal from './component/cate-modal';
import CateList from './component/cate-list';
import Tool from './component/tool';
import { StoreProvider } from 'plume2';
import { AuthWrapper } from 'qmkit';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class PictureStore extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <AuthWrapper functionName="f_pictureStore_0">
        <div>
          <BreadCrumb/>
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>设置</Breadcrumb.Item>
            <Breadcrumb.Item>素材管理</Breadcrumb.Item>
            <Breadcrumb.Item>图片库</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container">
            <Headline title={RCi18n({id: 'Setting.Picture library'})} />
            <div>
              <Row>
                <Col span={4}>
                  {/*分类列表*/}
                  <CateList />
                </Col>
                <Col span={1} />
                <Col span={19}>
                  {/*工具条*/}
                  <Tool />

                  {/*图片列表*/}
                  <ImageList />

                  {/*弹框*/}
                  <CateModal />
                  <MoveImageModal />
                  <UploadImageModal />
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
