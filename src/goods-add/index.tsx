import React from 'react';
import { Link } from 'react-router-dom';
import { Headline, AuthWrapper, BreadCrumb, Const } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const Reg = require('./image/Reg.png');
const Bur = require('./image/Bur.png');
const BlueReg = require('./image/Reg_blue.png');
const BlueBur = require('./image/Bur_blue.png');

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
          <Headline title={<FormattedMessage id="Product.postGoods" />} />
        </div>
        <div className="container">
          <div className="release-box">
            <h1>
              <FormattedMessage id="Product.ChooseProductCharacteristic" />
            </h1>

            <div className="release-content space-around">
              <Link to="/regular-product-add">
                <img src={Const.SITE_NAME === 'MYVETRECO' ? BlueReg : Reg} alt="" />
              </Link>

              <Link to="/goods-main">
                <img src={Const.SITE_NAME === 'MYVETRECO' ? BlueBur : Bur} alt="" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
