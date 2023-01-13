import * as React from 'react';
import { Link } from 'react-router-dom';
import { Relax, IMap } from 'plume2';
import { Button, message } from 'antd';
import { AuthWrapper, noop } from 'qmkit';

@Relax
export default class Tool extends React.Component<any, any> {
  props: {
    relaxProps?: {
      cates: IMap;

      modal: Function;
    };
  };

  static relaxProps = {
    // 父子结构的平台分类
    cates: 'cates',

    // 展示关闭弹框
    modal: noop
  };

  render() {
    const { cates } = this.props.relaxProps;
    return (
      <div className="handle-bar">
        <AuthWrapper functionName={'f_goods_cate_1'}>
          <Button type="primary" onClick={this._showCateModal}>
            新增一级类目
          </Button>
          {cates.count() === 0 ? (
            <Link to="/goods-cate-import">
              <Button type="primary">批量导入</Button>
            </Link>
          ) : (
            <Button disabled={true} type="primary">
              批量导入
            </Button>
          )}
        </AuthWrapper>
      </div>
    );
  }

  /**
   * 显示一级分类弹框
   */
  _showCateModal = () => {
    const { modal, cates } = this.props.relaxProps;
    if (cates.count() >= 20) {
      message.error('您只能添加20个一级类目');
    } else {
      modal(true);
    }
  };
}
