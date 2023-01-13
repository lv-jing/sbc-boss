import * as React from 'react';
import { Relax } from 'plume2';
import { IMap } from 'typings/globalType';
import { history, noop, UEditor } from 'qmkit';
import { List } from 'immutable';
import { Button } from 'antd';

@Relax
export default class Detail extends React.Component<any, any> {
  props: {
    relaxProps?: {
      goods: IMap;
      chooseImgs: List<any>;
      imgType: number;
      saveAll: Function;
      editGoods: Function;
      refDetailEditor: Function;
      modalVisible: Function;
    };
  };

  static relaxProps = {
    // 商品基本信息
    goods: 'goods',
    chooseImgs: 'chooseImgs',
    imgType: 'imgType',
    saveAll: noop,
    // 修改商品基本信息
    editGoods: noop,
    refDetailEditor: noop,
    modalVisible: noop
  };

  render() {
    const {
      goods,
      refDetailEditor,
      chooseImgs,
      imgType
    } = this.props.relaxProps;
    return (
      <div>
        <div className="detailTitle" style={{ marginBottom: 10 }}>
          商品详情
        </div>
        <UEditor
          ref={(UEditor) => {
            refDetailEditor((UEditor && UEditor.editor) || {});
          }}
          id="goods-detail"
          height="320"
          content={goods.get('goodsDetail')}
          insertImg={() => this._handleClick()}
          chooseImgs={chooseImgs.toJS()}
          imgType={imgType}
        />

        <div className="bar-button">
          <Button type="primary" onClick={this._save}>
            保存
          </Button>
        </div>
      </div>
    );
  }

  /**
   * 调用图片库弹框
   * @private
   */
  _handleClick = () => {
    this.props.relaxProps.modalVisible(10, 2);
  };

  _save = async () => {
    const { saveAll } = this.props.relaxProps;

    const result = await saveAll();
    if (result) {
      history.push('/goods-library-list');
    }
  };
}
