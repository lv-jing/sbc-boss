import React from 'react';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import EvaluateList from './components/list';
import SeeRecord from './components/see-record';
import { FormattedMessage } from 'react-intl';
import SearchForm from './components/search-form';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class StoreEvaluateList extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <div>
        {/*导航面包屑*/}
        <BreadCrumb />
        <div className="container storeEvaluate">
          <Headline
            title={<FormattedMessage id="Store.EvaluationList" />}
          />
          {/*tab的商家评价*/}
          <SearchForm />
          <EvaluateList />
          <SeeRecord />
        </div>
      </div>
    );
  }
}
