import * as React from 'react';
import { Modal, Switch } from 'antd';
import { Relax, IMap } from 'plume2';
import { noop } from 'qmkit';
import moment from 'moment';
import GoodsImage from '../../goods-detail/components/image';
import { FormattedMessage } from 'react-intl';

const defaultImg = require('../img/none.png');

@Relax
export default class See extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
  }

  props: {
    relaxProps?: {
      modalVisible: boolean;
      modal: Function;
      arrowVisible: boolean;
      arrow: Function;
      goodsEvaluate: IMap;
      onFormFieldChange: Function;
      goodsEditEvaluate: IMap;
      saveAnswer: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalVisible: 'modalVisible',
    arrowVisible: 'arrowVisible',
    // 关闭弹窗
    modal: noop,
    arrow: noop,
    goodsEvaluate: 'goodsEvaluate',
    onFormFieldChange: noop,
    goodsEditEvaluate: 'goodsEditEvaluate',
    saveAnswer: noop
  };

  render() {
    const {
      modalVisible,
      arrowVisible,
      goodsEvaluate,
      onFormFieldChange,
      goodsEditEvaluate
    } = this.props.relaxProps as any;
    if (!modalVisible) {
      return null;
    }

    const goodsImg = goodsEvaluate.goodsImg;
    return (
      <Modal maskClosable={false}
             title={<FormattedMessage id="Product.commentDetails" />}

             visible={modalVisible}
             width={920}
             onCancel={this._handleModelCancel}
             onOk={this._handleSubmit}
      >
        <div className="comment-Detail-box">
          <div className="left-container">
            <div className="product">
              {goodsImg ? (
                <img className="img" src={goodsImg} alt="" />
              ) : (
                <img src={defaultImg} className="img" alt=""/>
              )}
            </div>
            <div className="switch-box">
              <label><FormattedMessage id="Product.isShow" />：</label>
              <Switch
                checkedChildren="yes"
                unCheckedChildren="no"
                checked={goodsEditEvaluate.get('isShow') == 1}
                onChange={(e) => onFormFieldChange('isShow', e ? 1 : 0)}
              />
            </div>
          </div>
          <div className="right-container">
            <div className="compuctor-detail border-b">
              <label className="title"> {goodsEvaluate.goodsInfoName}</label>
              {goodsEvaluate.isEdit == 1 ? (
                <div className="compuctor-detail">
                  <img
                    className={arrowVisible ? 'up-arrow' : 'down-arrow'}
                    src={require('../img/down-arrow.png')}
                    onClick={this._clickArrow}
                    alt=""
                  />
                  <label className="title mar-top-12"><FormattedMessage id="Product.BeforeModification" /></label>
                  {arrowVisible && (
                    <div>
                      <div className="detail">
                        <span className="evaluate"><FormattedMessage id="Product.Evaluation" /></span>
                        <span className="text">
                          <FormattedMessage id="Product.PostedBy" />：{goodsEvaluate.customerName}
                        </span>
                        <span className="text mar-lr">
                          <FormattedMessage id="Product.Time" />：{goodsEvaluate.historyEvaluateTime}
                        </span>
                        <span className="text">
                          {goodsEvaluate.historyEvaluateScore}<FormattedMessage id="Product.Star" />
                        </span>
                      </div>
                      <div className="compuctor-content">
                        <FormattedMessage id="Product.Content" />：{goodsEvaluate.historyEvaluateContent}
                      </div>
                      <div className="compuctor-content">
                        <FormattedMessage id="Product.Reply" />：{goodsEvaluate.historyEvaluateAnswer}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
            <div className="compuctor-detail border-b">
              <div className="detail">
                <span className="evaluate"><FormattedMessage id="Product.evaluate" /></span>
                <span className="text">
                  <FormattedMessage id="Product.Publisher" />：{goodsEvaluate.customerName}
                </span>
                <span className="text mar-lr">
                  <FormattedMessage id="Product.time" />：{moment(goodsEvaluate.evaluateTime).format(
                  'YYYY-MM-DD HH:mm:ss'
                )}
                </span>
                <span className="text">{goodsEvaluate.evaluateScore}<FormattedMessage id="Product.Star" /></span>
              </div>
              <div className="compuctor-content">
                <FormattedMessage id="Product.content" />：{goodsEvaluate.evaluateContent}
              </div>
              {goodsEvaluate.evaluateAnswer ? (
                <div className="compuctor-content">
                  <FormattedMessage id="Product.reply" />：{goodsEvaluate.evaluateAnswer}
                </div>
              ) : null}
            </div>

            {goodsEvaluate.evaluateImageList &&
            goodsEvaluate.evaluateImageList.length ? (
              <div className="compuctor-detail mar-top-22">
                {
                  <ul className="drying-list">
                    <li className="dry-name"><FormattedMessage id="Product.dryingSheet" /></li>
                    <li className="dry-imgs">
                      {goodsEvaluate.evaluateImageList.map(
                        (v, k) =>
                          k < 5 ? (
                            <div key={k}>
                              <GoodsImage url={v.artworkUrl} />
                            </div>
                          ) : null
                      )}
                    </li>
                    <li className="dry-imgs">
                      {goodsEvaluate.evaluateImageList.map(
                        (v, k) =>
                          k >= 5 ? (
                            <div key={k}>
                              <GoodsImage url={v.artworkUrl} />
                            </div>
                          ) : null
                      )}
                    </li>
                  </ul>
                }
              </div>
            ) : null}
          </div>
        </div>
      </Modal>
    );
  }

  /**
   * 提交
   */
  _handleSubmit = () => {
    const { saveAnswer, goodsEditEvaluate } = this.props.relaxProps;
    saveAnswer(
      goodsEditEvaluate.get('evaluateId'),
      goodsEditEvaluate.get('evaluateAnswer'),
      goodsEditEvaluate.get('isShow'),
      goodsEditEvaluate.get('isAnswer')
    );
  };

  _clickArrow = () => {
    const { arrowVisible, arrow } = this.props.relaxProps;
    arrow(!arrowVisible);
  };

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { modal } = this.props.relaxProps;
    modal(false);
  };
}
