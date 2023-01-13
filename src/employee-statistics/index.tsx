import React from 'react';
import { StoreProvider } from 'plume2';
import AchieveStatistics from './component/list';
import GetCustomerStatistics from './component/get-customer';
import ClientSearch from './component/client-form';
import AchieveSearch from './component/achieve-form';
import AppStore from './store';
import { StatisticsHeader } from 'biz';
import { DataModal, BreadCrumb } from 'qmkit';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class EmployeeStatistics extends React.Component<any, any> {
  store: AppStore;

  componentWillMount() {    
    this.store.init();
  }

  render() {
    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>数谋</Breadcrumb.Item>
          <Breadcrumb.Item>统计报表</Breadcrumb.Item>
          <Breadcrumb.Item>业务员统计</Breadcrumb.Item>
        </Breadcrumb> */}
        <div style={{ margin: '12px 12px 0 12px' }}>

          <StatisticsHeader
            onClick={(params) => this.store.employeeStatistics(params)}
            selectShop={(value) => this._changeStore(value)}
          />

          <div style={styles.content}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20
              }}
            >
              <h4 style={styles.title}>业务员业绩报表</h4>
              <AchieveSearch />
            </div>
            <AchieveStatistics />
          </div>

          <div style={styles.content}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20
              }}
            >
              <h4 style={styles.title}>业务员获客报表</h4>
              <ClientSearch />
            </div>
            <GetCustomerStatistics />
          </div>

          <DataModal />
        </div>
      </div>
    );
  }

  /**
   * 选择店铺
   * @param value
   * @private
   */
  _changeStore = (value) => {
    if (value) {
      this.store.setCompanyInfoId(value.split('_')[0]);
    } else {
      //清空,companyId置为0，表示平台的
      this.store.setCompanyInfoId('0');
    }
  };
}

const styles = {
  content: {
    background: '#ffffff',
    padding: 20,
    marginTop: 10
  },
  title: {
    fontSize: 14,
    // display: 'block',
    color: '#333333',
    // marginBottom: 20
  } as any,
  h4: {
    fontSize: 14,
    color: '#333333'
  },
  nav: {
    fontSize: 14,
    color: '#666666',
    padding: 5
  },
  num: {
    color: '#333333',
    fontSize: 16,
    padding: 5
  },
  static: {
    background: '#fafafa',
    padding: 10,
    marginTop: 10,
    flex: 1
  },
  filter: {
    width: '23%',
    borderLeft: '3px solid #f5f5f5'
  }
};
