import React from 'react';
import { Breadcrumb, Alert } from 'antd';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import PropList from './components/prop-list';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsPropView extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { cid } = this.props.match.params;
    this.store.init(cid);
  }

  render() {
    const { cateName } = this.props.location.state || { cateName: '' };
    return (
      <div>
        <BreadCrumb>
          <Breadcrumb.Item>类目属性</Breadcrumb.Item>
        </BreadCrumb>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>商品</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>商品类目</Breadcrumb.Item>
          <Breadcrumb.Item>类目属性</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="类目属性" />
          {cateName && (
            <h4
              style={{ color: '#999', fontSize: '16px', marginBottom: '10px' }}
            >
              当前类目：{cateName}
            </h4>
          )}
          <div>
            <Alert
              message={
                <div>
                  <p>
                    末级类目可挂载属性模板，最多可关联20个属性，每个属性最多可设置100个属性值；
                  </p>
                  <p>属性的展示排序，请填写数字，值越小越靠前；</p>
                  <p>
                    开启索引后，用户将可以通过该属性筛选商品，索引开关不影响商详页的属性展示；
                  </p>
                </div>
              }
              type="info"
              showIcon={false}
            />
          </div>
          <PropList />
        </div>
      </div>
    );
  }
}
