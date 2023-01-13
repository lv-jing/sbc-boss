import React from 'react';
import { StoreProvider } from 'plume2';

import AppStore from './store';
import TodoItems from './component/todo-items';
import StatisticalReport from './component/statistical-report';
import Ranking from './component/ranking';

import QuickLinks from './quick-links';
import { history } from 'qmkit';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class HelloApp extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //this.store.init();
    history.push('/supplier-list');
  }

  render() {
    return (
      <div style={styles.container}>
        {/* <TodoItems />
        <StatisticalReport />
        <Ranking /> */}
        {/* <div style={{fontSize:16,margin:'20px 0'}}>Welcome to Admin Portal</div>
        <QuickLinks /> */}
      </div>
    );
  }
}

const styles = {
  container: {
    backgroundColor: '#f5f5f5',
    // 屏幕高度 - 头部高度 - 底部高度
    minHeight: 'calc(100vh - 64px - 78px)',
    padding:12
  }
};
