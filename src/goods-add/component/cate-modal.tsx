import * as React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Tree, TreeSelect, message } from 'antd';
import { Relax } from 'plume2';
import { noop, QMMethod, Tips, ValidConst } from 'qmkit';
import { IList, IMap } from 'typings/globalType';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import ImageLibraryUpload from './image-library-upload';
import { fromJS, Map } from 'immutable';
const TreeNode = Tree.TreeNode;
const { TextArea } = Input;

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 12 }
  }
};

const Errorbox = styled.div`
  .has-error.has-feedback .ant-form-item-children:after,
  .has-success.has-feedback .ant-form-item-children:after,
  .has-warning.has-feedback .ant-form-item-children:after,
  .has-success.has-feedback .ant-form-item-children-icon,
  .is-validating.has-feedback .ant-form-item-children:after {
    right: -30px;
  }
`;

@Relax
export default class CateModal extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(CateModalForm);
  }

  props: {
    relaxProps?: {
      modalCateVisible: boolean;
      doCateAdd: Function;
      storeCateList: IList;
      closeCateModal: Function;
      cateList: IList;
      formData: IMap;
      closeModal: Function;
      editFormData: Function;
      sourceCateList: IList;
      goods: IMap;
      editGoods: Function;
      showBrandModal: Function;
      showCateModal: Function;
      checkFlag: boolean;
      enterpriseFlag: boolean;
      flashsaleGoods: IList;
      updateGoodsForm: Function;
      showGoodsPropDetail: Function;
      changeStoreCategory: Function;
      images: IList;
      clickImg: Function;
      removeImg: Function;
      modalVisibleFun: Function;
    };
  };

  static relaxProps = {
    // ??????????????????
    modalCateVisible: 'modalCateVisible',
    // ??????????????????
    doCateAdd: noop,
    // ??????????????????
    storeCateList: 'storeCateList',
    // ????????????
    closeCateModal: noop,
    // ??????????????????
    modalVisible: 'modalVisible',
    // ????????????
    doAdd: noop,
    // ????????????
    editFormData: noop,
    // ????????????
    formData: 'formData',
    // ????????????
    closeModal: noop,
    sourceCateList: 'sourceCateList',
    goods: 'goods',
    cateList: 'cateList',
    checkFlag: 'checkFlag',
    showGoodsPropDetail: noop,
    changeStoreCategory: noop,
    updateGoodsForm: noop,
    editGoods: noop,
    images: 'images',
    modalVisibleFun: noop,
    clickImg: noop,
    removeImg: noop
  };

  render() {
    const { modalCateVisible } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    if (!modalCateVisible) {
      return null;
    }
    return (
      <Modal maskClosable={false} title={<FormattedMessage id="add" />} visible={modalCateVisible} onCancel={this._handleModelCancel} onOk={this._handleSubmit}>
        <WrapperForm ref={(form) => (this._form = form)} relaxProps={this.props.relaxProps} />
      </Modal>
    );
  }

  /**
   * ??????
   */
  _handleSubmit = () => {
    const form = this._form as WrappedFormUtils;

    form.validateFields(null, (errs) => {
      if (!errs) {
        //??????
        const { doCateAdd } = this.props.relaxProps;
        if (form.getFieldValue('cateName')) {
          const cateName = form.getFieldValue('cateName');
          const cateParentId = form.getFieldValue('cateParentId') || 0;
          const sort = form.getFieldValue('sort') || 0;
          doCateAdd(cateName, cateParentId, sort);
        }
      }
    });
  };

  /**
   * ????????????
   */
  _handleModelCancel = () => {
    const { closeCateModal } = this.props.relaxProps;
    closeCateModal();
  };
}

class CateModalForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      closeCateModal: Function;
      storeCateList: IList;
      cateList: IList;
      formData: IMap;
      closeModal: Function;
      editFormData: Function;
      sourceCateList: IList;
      goods: IMap;
      editGoods: Function;
      showBrandModal: Function;
      showCateModal: Function;
      checkFlag: boolean;
      enterpriseFlag: boolean;
      flashsaleGoods: IList;
      updateGoodsForm: Function;
      showGoodsPropDetail: Function;
      changeStoreCategory: Function;
      images: IList;
      clickImg: Function;
      removeImg: Function;
      modalVisibleFun: Function;
    };
    form;
  };

  //?????????????????????
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props) {
    super(props);
  }
  static relaxProps = {
    // ??????????????????
    modalVisible: 'modalVisible',
    // ????????????
    doAdd: noop,
    // ????????????
    editFormData: noop,
    // ????????????
    formData: 'formData',
    // ????????????
    closeModal: noop,
    sourceCateList: 'sourceCateList',
    goods: 'goods',
    cateList: 'cateList',
    checkFlag: 'checkFlag',
    showGoodsPropDetail: noop,
    changeStoreCategory: noop,
    updateGoodsForm: noop,
    editGoods: noop,
    images: 'images',
    modalVisibleFun: noop,
    clickImg: noop,
    removeImg: noop
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    let storeCateList = this.props.relaxProps.storeCateList;
    const { sourceCateList, goods, cateList, images, modalVisibleFun, clickImg, removeImg } = this.props.relaxProps;
    // ????????????????????????
    const loop = (cateList) =>
      cateList
        .filter((item) => item.get('isDefault') != 1 && item.get('cateParentId') == 0)
        .map((item) => {
          return <TreeNode key={item.get('storeCateId')} value={item.get('storeCateId')} title={item.get('cateName')} />;
        });
    //????????????????????????????????????
    const loopCate = (cateList) =>
      cateList.map((item) => {
        if (item.get('children') && item.get('children').count()) {
          // ??????????????????????????????
          return (
            <TreeNode key={item.get('cateId')} disabled={true} value={item.get('cateId')} title={item.get('cateName')}>
              {loop(item.get('children'))}
            </TreeNode>
          );
        }
        return <TreeNode key={item.get('cateId')} value={item.get('cateId')} title={item.get('cateName')} />;
      });

    return (
      <Form className="login-form">
        <FormItem {...formItemLayout} label="Classification name" hasFeedback>
          {getFieldDecorator('cateName', {
            rules: [
              { required: true, whitespace: true, message: '?????????????????????' },
              { max: 10, message: '??????10??????' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '????????????');
                }
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Superior classification">
          {getFieldDecorator('cateParentId', {
            rules: [
              {
                required: true,
                message: 'please select superior classification'
              }
            ]
          })(
            <TreeSelect getPopupContainer={() => document.getElementById('root')} placeholder="please select superior classification" notFoundContent="????????????" dropdownStyle={{ maxHeight: 400, overflow: 'auto' }} treeDefaultExpandAll>
              <TreeNode key="0" value="0" title="Top level classification">
                {loop(storeCateList)}
              </TreeNode>
            </TreeSelect>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={<FormattedMessage id="product.platformCategory" />}>
          {getFieldDecorator('cateId', {
            rules: [
              {
                required: true,
                message: '???????????????????????????'
              },
              {
                validator: (_rule, value, callback) => {
                  if (!value) {
                    callback();
                    return;
                  }

                  let overLen = false;
                  sourceCateList.forEach((val) => {
                    if (val.get('cateParentId') + '' == value) overLen = true;
                    return;
                  });

                  if (overLen) {
                    callback(new Error('???????????????????????????'));
                    return;
                  }

                  callback();
                }
              }
            ],
            onChange: this._editGoods.bind(this, 'cateId'),
            initialValue: goods.get('cateId') && goods.get('cateId') != '' ? goods.get('cateId') : undefined
          })(
            <TreeSelect
              getPopupContainer={() => document.getElementById('page-content')}
              placeholder="Please select category"
              notFoundContent="????????????"
              // disabled={cateDisabled}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeDefaultExpandAll
            >
              {loopCate(cateList)}
            </TreeSelect>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={<FormattedMessage id="cateImage" />}>
          <div style={{ width: 550 }}>
            <ImageLibraryUpload images={images} modalVisible={modalVisibleFun} clickImg={clickImg} removeImg={removeImg} imgType={0} imgCount={10} skuId="" />
          </div>
          <Tips title={<FormattedMessage id="product.recommendedSizeImg" />} />
        </FormItem>
        <FormItem labelCol={2} {...formItemLayout} label={<FormattedMessage id="cateDsc" />}>
          {getFieldDecorator('goodsDescription', {
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '????????????');
                }
              }
            ],
            onChange: this._editGoods.bind(this, 'goodsDescription'),
            initialValue: goods.get('goodsDescription')
          })(<TextArea rows={4} placeholder="Please iwwwwwwwwwwwnput the sssssproduct description" />)}
        </FormItem>
        <Errorbox>
          <FormItem {...formItemLayout} label="Sort" hasFeedback>
            {getFieldDecorator('sort', {
              rules: [
                { required: true, message: '???????????????' },
                {
                  pattern: ValidConst.sortNum,
                  message: '?????????0-999???????????????'
                }
              ],
              initialValue: 0
            })(<Input style={{ width: '30%' }} placeholder="???????????????" />)}
            <Tips title="The smaller the value, the higher" />
          </FormItem>
        </Errorbox>
      </Form>
    );
  }

  /**
   * ???????????????
   */
  _editGoods = (key: string, e) => {
    const { editGoods, showBrandModal, showCateModal, checkFlag, enterpriseFlag, flashsaleGoods, updateGoodsForm } = this.props.relaxProps;
    const { setFieldsValue } = this.props.form;
    if (e && e.target) {
      e = e.target.value;
    }
    if (key === 'cateId') {
      this._onChange(e);
      if (e === '-1') {
        showCateModal();
      }
    } else if (key === 'brandId' && e === '0') {
      showBrandModal();
    }

    if (key === 'saleType' && e == 0) {
      if (!flashsaleGoods.isEmpty()) {
        message.error('???????????????????????????????????????????????????????????????', 3, () => {
          let goods = Map({
            [key]: fromJS(1)
          });
          editGoods(goods);
          setFieldsValue({ saleType: 1 });
        });
      } else {
        let message = '';
        //1:??????????????????????????????  2??????????????????  3???????????????  4???????????????
        if (checkFlag == 'true') {
          if (enterpriseFlag) {
            //??????????????????????????????
            message = '?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????';
          } else {
            //????????????
            message = '?????????????????????????????????????????????????????????????????????????????????????????????????????????';
          }
        } else {
          if (enterpriseFlag) {
            message = '???????????????????????????????????????????????????????????????????????????????????????????????????????????????';
          }
        }
        if (message != '') {
          // confirm({
          //   title: '??????',
          //   content: message,
          //   onOk() {
          let goods = Map({
            [key]: fromJS(e)
          });
          editGoods(goods);
          //   },
          //   onCancel() {
          //     let goods = Map({
          //       [key]: fromJS(1)
          //     });
          //     editGoods(goods);
          //     setFieldsValue({ saleType: 1 });
          //   },
          //   okText: '??????',
          //   cancelText: '??????'
          // });
        } else {
          let goods = Map({
            [key]: fromJS(e)
          });
          editGoods(goods);
        }
      }
    } else {
      let goods = Map({
        [key]: fromJS(e)
      });
      updateGoodsForm(this.props.form);
      editGoods(goods);
    }
  };
  // /**
  //  * ????????????????????????????????????????????????????????????????????????
  //  */
  // _onChange = (value) => {
  //   const { showGoodsPropDetail } = this.props.relaxProps;
  //   showGoodsPropDetail(value);
  //   // changeStoreCategory
  // };
}
