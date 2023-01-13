import React from 'react';
import { Headline, BreadCrumb } from 'qmkit';
import { StoreProvider } from 'plume2';
import SettingForms from './components/setting-forms';
import { GoodsModal } from 'biz';
import PicModal from './components/pic-modal';
import AppStore from './store';
import './style.less';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CompanyInformation extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.store.init();
  }

  render() {
    const store = this.store as any;
    const state = store.state();
    const recruit = state.get('recruit');

    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>营销</Breadcrumb.Item>
          <Breadcrumb.Item>社交分销管理</Breadcrumb.Item>
          <Breadcrumb.Item>分销设置</Breadcrumb.Item>
        </Breadcrumb> */}
        {!state.get('loading') && (
          <div className="container">
            <Headline title="分销设置" />
            <SettingForms
              fieldsValue={store.fieldsValue}
              openFlag={state.get('openFlag')}
              saveOpenFlag={store.saveOpenFlag}
              setRecruitForm={store.setRecruitForm}
            />
            <GoodsModal
              showValidGood={true}
              // 是否仅勾选上架商品
              checkAddedGood={true}
              visible={recruit.get('goodsModalVisible')}
              selectedSkuIds={recruit.get('goodsInfoIds').toJS()}
              selectedRows={recruit.get('goodsRows').toJS()}
              onOkBackFun={this._onOkBackFun}
              onCancelBackFun={store.onCancelBackFun}
              skuLimit={50}
              companyType={3}
            />
            <PicModal />
          </div>
        )}
      </div>
    );
  }

  /**
   *商品 点击确定之后的回调
   */
  _onOkBackFun = (skuIds, rows) => {
    this.store.onOkBackFun(skuIds, rows);
  };
}
