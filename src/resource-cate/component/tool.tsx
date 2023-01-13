import * as React from 'react';
import { Relax } from 'plume2';
import { Button } from 'antd';
import { noop, AuthWrapper } from 'qmkit';
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
      <AuthWrapper functionName="f_resourceCate_2">
        <div className="handle-bar">
          <Button type="primary" onClick={this._showCateModal}>
            <FormattedMessage id="Setting.addFirstLeverCate" />
          </Button>
        </div>
      </AuthWrapper>
    );
  }

  /**
   * 显示分类弹框
   */
  _showCateModal = () => {
    const { showAddModal } = this.props.relaxProps;
    showAddModal();
  };
}
