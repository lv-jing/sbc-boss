import React, { Component } from 'react';
import { StoreProvider } from 'plume2';
import { Alert, Breadcrumb, Form } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';
import RegisteredAddForm from './components/add-form';

import Appstore from './store';

const WrappedForm = Form.create()(RegisteredAddForm);

@StoreProvider(Appstore, { debug: __DEV__ })
export default class CouponInfo extends Component<any, any> {
  store: Appstore;
  _form;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { activityId } = this.props.match.params;
    this.store.init(activityId);
  }

  render() {
    const id = this.store.state().getIn(['activity', 'activityId']);
    const state = this.props.location.state;
    const { source } = (state || {}) as any;
    return [
      <BreadCrumb thirdLevel={true}>
        <Breadcrumb.Item>
          {id ? '编辑' : '创建'}企业注册赠券活动
        </Breadcrumb.Item>
      </BreadCrumb>,
      <div className="container" key="container">
        <Headline
          title={id ? '编辑企业注册赠券活动' : '创建企业注册赠券活动'}
        />
        <Alert
          message={
            <div>
              <p>操作说明：</p>
              <p>优惠券将在用户注册成功后直接发放至用户账户；</p>
              <p>
                一组优惠券中每张优惠券的赠送张数最多支持10张，活动在领取组数达到上限后停止；
              </p>
              <p>
                同一时间只能生效一个企业注册赠券活动，已创建企业注册赠券活动的日期不可被再次选择；
              </p>
            </div>
          }
          type="info"
        />
        <WrappedForm ref={(form) => (this._form = form)} />
      </div>
    ];
  }
}
