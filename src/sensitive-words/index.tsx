import React from 'react';

import { StoreProvider } from 'plume2';
import { message } from 'antd';
import { Headline,BreadCrumb,checkAuth,AuthWrapper } from 'qmkit';
import List from './components/list';
import SearchForm from './components/search-form';
import ButtonGroup from './components/button-group';
import SensitiveWordsModal from'./components/sensitive-words-modal'
import AppStore from './store';
import Form from 'antd/lib/form/Form';
import Tips from './components/tips';


const WrapperForm = Form.create()(SearchForm as any);

@StoreProvider(AppStore, { debug: __DEV__ })
export default class SensitiveWordsList extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    //有查看权限，方能查询
    if(checkAuth('f_sensitive_words_0')){
      this.store.init();
    }else{
      message.error('此功能您没有权限访问');
    }
  }

  render() {
    return (
      <div>
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>设置</Breadcrumb.Item>
          <Breadcrumb.Item>站点设置</Breadcrumb.Item>
          <Breadcrumb.Item>敏感词库</Breadcrumb.Item>
        </Breadcrumb> */} 
        <AuthWrapper functionName="f_sensitive_words_0">
        <div className="container">
          <Headline title="敏感词列表" />
          <Tips/>

          <WrapperForm ref={(form) => (window['_form'] = form)} />

          <ButtonGroup />

          <List />

          <SensitiveWordsModal />

          {/* 禁用弹框 */}
          {/* <Modal  maskClosable={false}Form />*/}
        </div>
        </AuthWrapper>
      </div>
    );
  }
}
