import React from 'react';
import { StoreProvider } from 'plume2';

import { Headline } from 'qmkit';

import AppStore from './store';
import AboutUsContext from './components/about-us-context';
import PicModal from './components/pic-modal';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class AboutUs extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.store.initImg({ pageNum: 0, cateId: -1, successCount: 0 });
    this.store.fetchAboutUs();
  }

  render() {
    return (
      <div className="container">
        <Headline title="关于我们" />
        <AboutUsContext />
        <PicModal />
      </div>
    );
  }
}
