import * as React from 'react';
import { Relax } from 'plume2';
import { Alert, Button } from 'antd';
import {AuthWrapper, noop} from 'qmkit';

@Relax
export default class CateTool extends React.Component<any, any> {
  props: {
    relaxProps?: {
      modal: Function;
    };
  };

  static relaxProps = {
    // 展示关闭弹框
    modal: noop
  };

  render() {
    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          <Alert
            message="操作提示:"
            description={
              <div>
                <p>积分商品分类为积分商品在积分商城中的展示分类，最多可维护30个；</p>
                <p>您可拖拽跑徐改变分类的展示顺序；</p>
              </div>
            }
            type="info"
          />
        </div>
        <div className="handle-bar">
          <AuthWrapper functionName={'f_points_goods_cate_add'}>
            <Button type="primary" onClick={this._showCateModal}>
              新增分类
            </Button>
          </AuthWrapper>
        </div>
      </div>
    );
  }

  /**
   * 显示弹框
   */
  _showCateModal = () => {
    const { modal } = this.props.relaxProps;
    modal(true);
  };
}
