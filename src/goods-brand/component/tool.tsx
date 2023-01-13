import * as React from 'react';
import { Relax } from 'plume2';
import { Button } from 'antd';
import { AuthWrapper, noop } from 'qmkit';
import { FormattedMessage } from 'react-intl';

@Relax
export default class Tool extends React.Component<any, any> {
  props: {
    relaxProps?: {
      showAddModal: Function;
    };
  };

  static relaxProps = {
    showAddModal: noop
  };

  render() {
    return (
      <AuthWrapper functionName={'f_goods_brand_1'}>
        <div className="handle-bar">
          <Button type="primary" onClick={this._showBrandModal}>
            <FormattedMessage id="Product.addBrand" />
          </Button>
        </div>
      </AuthWrapper>
    );
  }

  /**
   * 显示品牌弹框
   */
  _showBrandModal = () => {
    const { showAddModal } = this.props.relaxProps;
    showAddModal();
  };
}
