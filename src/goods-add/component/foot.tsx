import * as React from 'react';
import { Relax } from 'plume2';
import { Button, message, Modal } from 'antd';
import { noop, history, AuthWrapper, RCi18n } from 'qmkit';
import { FormattedMessage, injectIntl } from 'react-intl';
import errorMsg from '@/goods-add/component/goods';
const confirm = Modal.confirm;
@Relax
class Foot extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      saveSuccessful: false
    };
  }

  props: {
    goodsFuncName: string;
    priceFuncName: string;
    tabType: string;
    onNext: Function;
    onPrev: Function;
    isLeave: boolean;
    relaxProps?: {
      saveMain: Function;
      saveAll: Function;
      saveLoading: boolean;
      activeTabKey: string;
      onMainTabChange: Function;
      saveSeoSetting: Function;
      saveSuccessful: string;
      getGoodsId: string;
      goodsList: any;
    };
    loading: any
  };

  static relaxProps = {
    saveMain: noop,
    saveAll: noop,
    saveLoading: 'saveLoading',
    activeTabKey: 'activeTabKey',
    onMainTabChange: noop,
    saveSeoSetting: noop,
    saveSuccessful: 'saveSuccessful',
    getGoodsId: 'getGoodsId',
    goodsList: 'goodsList'
  };
  _saveSeoSetting = () => {
    const { saveSeoSetting, getGoodsId } = this.props.relaxProps;
    saveSeoSetting(getGoodsId);
  };
  componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
    const { saveSuccessful } = this.props.relaxProps;
    if (prevProps.relaxProps.saveSuccessful != saveSuccessful) {
      /*this.setState({
        saveSuccessful: saveSuccessful
      });*/
      this._next('');
    }
  }

  render() {
    const { saveLoading } = this.props.relaxProps;
    return (
      <div className="bar-button" style={{marginLeft:'-20px'}}>
        {this.props.tabType == 'main' ? (
          <Button type="primary" onClick={() => this._next(this.props.tabType)} style={{ marginRight: 10 }}>
            <FormattedMessage id="Product.Next" />
          </Button>
        ) : this.props.tabType == 'price' ? (
          <>
            <Button type="primary" onClick={() => this._prev(this.props.tabType)} style={{ marginRight: 10 }}>
              <FormattedMessage id="Product.Prev" />
            </Button>
            <Button type="primary" onClick={() => this._next(this.props.tabType)} style={{ marginRight: 10 }}>
              <FormattedMessage id="Product.Next" />
            </Button>
          </>
        ) : this.props.tabType == 'inventory' ? (
          <>
            <Button type="primary" disabled={this.props.loading} onClick={() => this._prev(this.props.tabType)} style={{ marginRight: 10 }}>
              <FormattedMessage id="Product.Prev" />
            </Button>
            <Button type="primary" disabled={this.props.loading} onClick={() => this._next(this.props.tabType)} style={{ marginRight: 10 }} loading={saveLoading}>
            <FormattedMessage id="Product.Next" />
            </Button>
          </>
        ) : this.props.tabType == 'shipping' ? (
          <>
            <Button type="primary" disabled={this.props.loading} onClick={() => this._prev(this.props.tabType)} style={{ marginRight: 10 }} loading={saveLoading}>
            <FormattedMessage id="Product.Prev" />
            </Button>
            <Button type="primary" disabled={this.props.loading} onClick={() => this._next(this.props.tabType)} style={{ marginRight: 10 }}>
              <FormattedMessage id="Product.Next" />
            </Button>
          </>
        ) : this.props.tabType == 'related' ? (
          <>
            <Button type="primary" onClick={() => this._prev(this.props.tabType)} style={{ marginRight: 10 }}>
              <FormattedMessage id="Product.Prev" />
            </Button>
            <Button type="primary" onClick={() => this._next(this.props.tabType)} style={{ marginRight: 10 }}>
              <FormattedMessage id="Product.Next" />
            </Button>
          </>
        ) : (
          <>
            <Button type="primary" onClick={() => this._prev(this.props.tabType)} style={{ marginRight: 10 }}>
              <FormattedMessage id="Product.Prev" />
            </Button>
            {/* <Button type="primary" onClick={this._saveSeoSetting} style={{ marginRight: 10 }}>
              <FormattedMessage id="Product.Save" />
            </Button> */}
          </>
        )}
        {/*{activeTabKey === 'main' || activeTabKey === 'price' || activeTabKey === 'inventory' ? (
          [
            <AuthWrapper key="001" functionName={this.props.goodsFuncName}>
              <Button type="primary" onClick={this._next} style={{ marginRight: 10 }} loading={saveLoading}>
               Next
              </Button>
            </AuthWrapper>
            // <AuthWrapper key="002" functionName={this.props.priceFuncName}>
            //   <Button
            //     onClick={this._next}
            //     style={{ marginLeft: 10 }}
            //     loading={saveLoading}
            //   >
            //     <FormattedMessage id="product.next" />
            //   </Button>
            // </AuthWrapper>
          ]
        ) : (
          <AuthWrapper functionName={this.props.priceFuncName}>
            <Button type="primary" onClick={this._savePrice} style={{ marginRight: 10 }} loading={saveLoading}>
              Save
            </Button>
          </AuthWrapper>
        )}*/}
        {this.props.isLeave && (
          <Button type="primary" onClick={this._leavePage} style={{ marginRight: 10 }}>
            <FormattedMessage id="Product.BackToList" />
          </Button>
        )}
      </div>
    );
  }

  _save = async () => {
    const { saveMain } = this.props.relaxProps;
    const result = await saveMain();
    if (result) {
      history.push('/goods-list');
    }
  };

  _savePrice = async () => {
    const { saveAll, goodsList } = this.props.relaxProps;
    saveAll();
  };

  _prev = (res) => {
    this.props.onPrev(res);
  };

  _next = (res) => {
    // const errorMsg = <div>test <span className="icon iconfont iconOffShelves" style={{ fontSize: 20, color: "#E1021A" }}></span></div>
    // message.error(errorMsg);
    this.props.onNext(res);
    // const { activeTabKey, onNext} = this.props.relaxProps;
    /*const result = validMain();
    if (result) {
      this.props.relaxProps.onMainTabChange('price');
    }*/
  };
  _leavePage = () => {
    // this.props.onLeave();
    const title = RCi18n({id:'Product.Prompt'});
    const content = RCi18n({id:'Product.returnToTheListPage'});
    const okText = RCi18n({id:'Product.OK'});
    const cancelText = RCi18n({id:'Product.Cancel'});
    confirm({
      title: title,
      content: content,
      okText: okText,
      cancelText: cancelText,
      onOk() {
        history.push('/goods-list');
      }
    });
  }
}

export default injectIntl(Foot);
