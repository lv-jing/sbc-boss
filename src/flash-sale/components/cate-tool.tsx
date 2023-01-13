import * as React from 'react';
import { Relax } from 'plume2';
import { Alert, Button } from 'antd';
import { noop, AuthWrapper } from 'qmkit';

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
                <p>
                  店铺参与整点秒杀可为商品选择相应分类，最多可维护16个，仅在移动端进行展示
                </p>
                <p>可进行拖拽排序，按照后台先后顺序展示至活动首页</p>
              </div>
            }
            type="info"
          />
        </div>
        <div className="handle-bar">
          <AuthWrapper functionName={'f_flash_sale_cate_add'}>
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
