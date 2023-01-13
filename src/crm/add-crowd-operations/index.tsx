import React from 'react';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import './style.less';
import AddOperations from './components/add-operations';
import SendSettingModal from './components/send-setting-modal';
import AppPushModal from './components/app-push-modal';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class AddCrowdOperations extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { id, ifModify } = this.props.match.params;
    this.store.init({ id, ifModify });
  }

  render() {
    return (
      <div className="add-crowd-operations">
        <BreadCrumb />
        <div className="container">
          {/* <Head /> */}
          <Headline title="新建人群运营计划" />
          <AddOperations />
          <SendSettingModal />
          <AppPushModal />
        </div>
      </div>
    );
  }
}
