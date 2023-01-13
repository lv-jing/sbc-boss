import React from 'react';
import { Link } from 'react-router-dom';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const Reg = require('./image/Reg.png');
const Bur = require('./image/Bur.png');
export default class ReleaseProducts extends React.Component<any, any> {
  render() {
    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>商品</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>发布商品</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container-search">
          <Headline title={<FormattedMessage id="product.postGoods" />} />
        </div>
        <div className="container">
          <div className="release-box">
            <h1><FormattedMessage id="Product.Chooseaproductcharacteristic" /></h1>

            <div className="release-content space-around">
              <AuthWrapper functionName="f_goods_add_1">
                <Link to="/goods-main">
                  <img src={Reg} alt="" />
                </Link>
              </AuthWrapper>

              <AuthWrapper functionName="f_goods_import_2">
                <Link to="/goods-library">
                  <img src={Bur} alt="" />
                </Link>
              </AuthWrapper>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
