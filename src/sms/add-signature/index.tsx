import React from 'react';
import { StoreProvider } from 'plume2';

import { Headline, BreadCrumb } from 'qmkit';

import AppStore from './store';

import './index.less';
import AddSign from './components/add-sign';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class AddSignature extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { id } = this.props.match.params;
    this.store.init(id);
  }

  render() {
    const { id } = this.props.match.params;
    return (
      <div>
        <BreadCrumb />
        <div className="container">
          <Headline
            title={
              id !== null && id !== undefined && id !== ''
                ? '编辑签名'
                : '新增签名'
            }
          />
          <AddSign />
        </div>
      </div>
    );
  }
}
