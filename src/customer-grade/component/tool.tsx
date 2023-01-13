import * as React from 'react';
import {Relax} from 'plume2';
import {Button, message} from 'antd';
import {AuthWrapper, noop} from 'qmkit';
import {IList} from "../../../typings/globalType";

@Relax
export default class Tool extends React.Component<any, any> {
  props: {
    relaxProps?: {
      gradeList: IList;
      modal: Function;
    };
  };

  static relaxProps = {
    // 展示关闭弹框
    modal: noop,
    gradeList: "gradeList",
  };


  render() {
    const {gradeList} = this.props.relaxProps;
    return (
      <div className="handle-bar">
        <AuthWrapper functionName={'f_customer_level_1'}>
          <Button type="primary" onClick={this._showCateModal} disabled={gradeList.count() == 10}>
            新增等级
          </Button>
        </AuthWrapper>
      </div>
    );
  }


  /**
   * 显示一级分类弹框
   */
  _showCateModal = () => {
    const {modal, gradeList} = this.props.relaxProps;
    if (gradeList.count() >= 10) {
      message.error('最多添加10条客户等级!');
    } else {
      modal(true);
    }
  };

}
