import React from 'react';
import { Headline,BreadCrumb } from 'qmkit';
import { StoreProvider } from 'plume2';
import SettingForms from './components/setting-forms';
import { GoodsSpuModal } from 'biz';
import PicModal from './components/pic-modal';
import AppStore from './store';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GrouponSetting extends React.Component<any, any> {
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
    return (
      <div>
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>营销</Breadcrumb.Item>
          <Breadcrumb.Item>拼团活动</Breadcrumb.Item>
          <Breadcrumb.Item>拼团设置</Breadcrumb.Item>
        </Breadcrumb> */}
        {!state.get('loading') && (
          <div className="container">
            <Headline title="拼团设置" />
            <SettingForms
              fieldsValue={store.fieldsValue}
              openFlag={state.get('openFlag')}
              saveOpenFlag={store.saveOpenFlag}
              setRecruitForm={store.setRecruitForm}
            />
            <PicModal/>

            <GoodsSpuModal
              showValidGood={true}
              visible={store.state().get('spuModal')}
              selectedSkuIds={
                store.state().get('targetImg').get('linkGoodsInfoId') ?store.state().get('targetImg').get('linkGoodsInfoId').split(',') : []
              }
              //selectedRows={recruit.get('goodsRows').toJS()}
              onOkBackFun={this._onOkBackFun}
              onCancelBackFun={()=>store.toggleSpuModal()}
              skuLimit={1}
            />            
          </div>
        )}
      </div>
    );
  }

  /**
   *商品 点击确定之后的回调
   */
  _onOkBackFun = (skuIds, rows) => {    
    this.store.onOkBackFun(skuIds, rows.get(0));
  };
}
