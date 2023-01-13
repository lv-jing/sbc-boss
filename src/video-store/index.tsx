import React from 'react';
import { Row, Col } from 'antd';

import { Headline,BreadCrumb } from 'qmkit';
import AppStore from './store';

import VedioList from './component/video-list';
import MoveVedioModal from './component/moveVideo-modal';
import UploadVedioModal from './component/uploadVedio-modal';
import CateModal from './component/cate-modal';
import CateList from './component/cate-list';
import Tool from './component/tool';
import { StoreProvider } from 'plume2';
import { AuthWrapper } from 'qmkit';
import {FormattedMessage} from 'react-intl';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class VideoStore extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <AuthWrapper functionName="f_videoStore_0">
        <div>
          <BreadCrumb/>
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>设置</Breadcrumb.Item>
            <Breadcrumb.Item>素材管理</Breadcrumb.Item>
            <Breadcrumb.Item>视频库</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container">
            <Headline title={<FormattedMessage id="videoAsset" />} />
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

                  {/*视频列表*/}
                  <VedioList />

                  {/*弹框*/}
                  <CateModal />
                  <MoveVedioModal />
                  <UploadVedioModal />
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
