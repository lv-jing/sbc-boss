import React from 'react';
import { Form, Alert } from 'antd';
import { StoreProvider } from 'plume2';
import { Headline,BreadCrumb } from 'qmkit';
import ShareForm from './components/share-form';
import AppStore from './store';

const ShareFormWrapper = Form.create()(ShareForm);
@StoreProvider(AppStore, { debug: __DEV__ })
export default class AppShare extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <div>
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>设置</Breadcrumb.Item>
          <Breadcrumb.Item>App设置</Breadcrumb.Item>
          <Breadcrumb.Item>分享App</Breadcrumb.Item>
        </Breadcrumb> */}

        <div className="container">
          <Headline title="分享App" />
          <Alert
            message={
              <div>
                该模块仅适用于移动端App“个人中心-设置”模块中分享App功能-图片分享内容展示
              </div>              
            }
            type="info"            
          />
          <br />
          <ShareFormWrapper />
        </div>
      </div>
    );
  }
}
