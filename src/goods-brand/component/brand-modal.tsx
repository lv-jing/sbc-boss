import * as React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Icon, message } from 'antd';
import { Relax } from 'plume2';
import { Map, fromJS } from 'immutable';
import { IMap } from 'typings/globalType';
import { noop, Tips, Const, QMUpload } from 'qmkit';
import Store from '../store';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { FormattedMessage } from 'react-intl';

const FILE_MAX_SIZE = 50 * 1024;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

@Relax
export default class BrandModal extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(BrandModalForm as any);
  }

  props: {
    relaxProps?: {
      modalVisible: boolean;
      closeModal: Function;
      formData: IMap;
      images: any;
      editFormData: Function;
      doAdd: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalVisible: 'modalVisible',
    // 添加品牌
    doAdd: noop,
    // 修改form数据
    editFormData: noop,
    // form数据
    formData: 'formData',
    // 关闭弹框
    closeModal: noop,
    // 附件信息
    images: 'images'
  };

  render() {
    const { modalVisible, formData } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    if (!modalVisible) {
      return null;
    }
    return (
       <Modal  maskClosable={false}
        title={formData.get('brandId') ? <FormattedMessage id="Product.edit" /> : <FormattedMessage id="Product.addBrand" />}

        visible={modalVisible}
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
      >
        <WrapperForm
          ref={(form) => (this._form = form)}
          relaxProps={this.props.relaxProps}
        />
      </Modal>
    );
  }

  /**
   * 提交
   */
  _handleSubmit = () => {
    const form = this._form as WrappedFormUtils;

    form.validateFields(null, (errs) => {
      if (!errs) {
        //提交
        const { doAdd, formData } = this.props.relaxProps;
        if (formData.get('brandName')) {
          doAdd();
        }
      }
    });
  };

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { closeModal } = this.props.relaxProps;
    closeModal();
  };
}

class BrandModalForm extends React.Component<any, any> {
  _store: Store;

  props: {
    relaxProps?: {
      modalVisible: boolean;
      images: any;
      closeModal: Function;
      formData: IMap;
      editFormData: Function;
    };
    form;
  };

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const { brandName, nickName, logo } = this.props.relaxProps.formData.toJS();
    let images = this.props.relaxProps.images;
    if (logo) {
      images = fromJS([
        { uid: 1, name: logo, size: 1, status: 'done', url: logo }
      ]);
    }
    images = images.toJS();
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form">
        <FormItem {...formItemLayout} label={<FormattedMessage id="Product.brandName" />} hasFeedback>
          {getFieldDecorator('brandName', {
            rules: [
              { required: true, whitespace: true, message: 'Please enter brand name' },
              {
                max: 30,
                message: 'Up to 30 characters'
              }
            ],
            onChange: this._changeBrandName,
            initialValue: brandName
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label={<FormattedMessage id="Product.brandAlias" />} hasFeedback>
          {getFieldDecorator('nickName', {
            rules: [
              { whitespace: true, message: 'Please enter a brand alias' },
              {
                max: 30,
                message: 'Up to 30 characters'
              }
            ],
            onChange: this._changeNickName,
            initialValue: nickName
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label={<FormattedMessage id="Product.BrandLogo" />}>
          <div className="clearfix goodsBrandLogo">
            <QMUpload
              style={styles.box}
              name="uploadFile"
              fileList={images}
              action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
              listType="picture-card"
              accept={'.jpg,.jpeg,.png,.gif'}
              onChange={this._editImages}
              beforeUpload={this._checkUploadFile}
            >
              {images.length < 1 ? (
                <Icon type="plus" style={styles.plus} />
              ) : null}
            </QMUpload>
          </div>
          <div>
            <Tips title="Size 120px * 50px, support formats JPG, JPEG, PNG and GIF, and file size is within 50kb" />
          </div>
        </FormItem>
      </Form>
    );
  }

  /**
   * 修改品牌名称
   */
  _changeBrandName = (e) => {
    const { editFormData } = this.props.relaxProps;
    editFormData(Map({ brandName: e.target.value }));
  };

  /**
   * 修改品牌昵称
   */
  _changeNickName = (e) => {
    const { editFormData } = this.props.relaxProps;
    editFormData(Map({ nickName: e.target.value }));
  };

  /**
   * 改变图片
   */
  _editImages = ({ file, fileList }) => {
    if (file.status == 'error' || fileList == null) {
      message.error('Upload failed');
      return;
    }
    const store = this._store as any;
    //删除图片
    if (file.status == 'removed') {
      store.editFormData(Map({ logo: '' }));
      store.editImages(fromJS([]));
      return;
    }

    fileList = fileList.filter((item) => item != null);
    if (fileList[0].status == 'done') {
      store.editFormData(Map({ logo: fileList[0].response[0] }));
    }
    store.editImages(fromJS(fileList));
  };

  /**
   * 检查文件格式以及文件大小
   */
  _checkUploadFile = (file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= FILE_MAX_SIZE) {
        return true;
      } else {
        message.error('The file size cannot exceed 50kb');
        return false;
      }
    } else {
      message.error('File format error');
      return false;
    }
  };
}

const styles = {
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  }
};
