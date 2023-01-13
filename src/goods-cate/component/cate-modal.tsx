import * as React from 'react';
import { Modal, Form, Input, Icon, message, Checkbox } from 'antd';
import { Relax } from 'plume2';
import { noop, Tips, Const, QMUpload, ValidConst, QMMethod } from 'qmkit';
import { IMap } from 'typings/globalType';
import { Map, fromJS } from 'immutable';
import { WrappedFormUtils } from 'antd/lib/form/Form';

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

const FILE_MAX_SIZE = 50 * 1024;

@Relax
export default class CateModal extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(CateModalForm as any);
  }

  props: {
    relaxProps?: {
      modalVisible: boolean;
      formData: IMap;
      images: any;
      parentRate: number;
      useParentRate: boolean;
      isAdd: boolean;
      doAdd: Function;
      editFormData: Function;
      modal: Function;
      editImages: Function;
      useParentRateF: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalVisible: 'modalVisible',
    // 类目信息
    formData: 'formData',
    // 附件信息
    images: 'images',
    // 父级类目扣率
    parentRate: 'parentRate',
    // 是否使用上级类目扣率
    useParentRate: 'useParentRate',
    //是否是新增分类操作
    isAdd: 'isAdd',
    // 添加类目
    doAdd: noop,
    // 修改类目
    editFormData: noop,
    // 关闭弹窗
    modal: noop,
    // 修改图片
    editImages: noop,
    // 是否使用上级类目扣率方法
    useParentRateF: noop
  };

  render() {
    const { modalVisible, isAdd } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    if (!modalVisible) {
      return null;
    }
    return (
       <Modal  maskClosable={false}
        title={isAdd ? '新增' : '编辑'}
         
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
        const { doAdd, formData } = this.props.relaxProps;
        //提交
        if (formData.get('cateName')) {
          doAdd();
        }
      } else {
        this.setState({});
      }
    });
  };

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { modal } = this.props.relaxProps;
    modal();
  };
}

class CateModalForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      formData: IMap;
      images: any;
      parentRate: number;

      closeModal: Function;
      editFormData: Function;
      editImages: Function;
      useParentRateF: Function;
    };
    form;
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { formData } = this.props.relaxProps;
    const cateName = formData.get('cateName');
    const cateParentId = formData.get('cateParentId');
    const cateRate = formData.get('cateRate');
    const cateGrade = formData.get('cateGrade');
    const isParentCateRate = formData.get('isParentCateRate');
    const { getFieldDecorator } = this.props.form;
    let images = this.props.relaxProps.images;
    if (
      formData.get('cateId') != null &&
      formData.get('cateImg') != null &&
      formData.get('cateImg') != ''
    ) {
      images = fromJS([
        {
          uid: 1,
          name: formData.get('cateImg'),
          size: 1,
          status: 'done',
          url: formData.get('cateImg')
        }
      ]);
    }
    images = images.toJS();
    return (
      <Form className="login-form">
        <FormItem {...formItemLayout} label="类目名称" hasFeedback>
          {getFieldDecorator('cateName', {
            rules: [
              { required: true, whitespace: true, message: '请输入类目名称' },
              { max: 20, message: '最多20字符' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '类目名称');
                }
              }
            ],
            initialValue: cateName,
            onChange: this._changeCateName
          })(<Input placeholder="请输入类目名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="上级类目">
          {formData.get('cateParentName')
            ? formData.get('cateParentName')
            : '无'}
        </FormItem>
        {cateParentId == 0 || cateParentId == null ? (
          <FormItem {...formItemLayout} label="类目图标">
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
            <div>
              <Tips title="建议尺寸：78*78，图片采用透明底，最大50KB，支持的图片格式：jpg、png、jpeg、gif" />
            </div>
          </FormItem>
        ) : null}
        <FormItem {...formItemLayout} label="类目扣率" hasFeedback>
          {getFieldDecorator('cateRate', {
            rules: [
              { required: cateGrade == 2, message: '请填写扣率' },
              { pattern: ValidConst.discount, message: '请填写正确的扣率' }
            ],
            initialValue: cateRate,
            onChange: this._changeCateRate
          })(<Input style={{ width: '50%' }} placeholder="请输入类目扣率" />)}
          <span>
            &nbsp;%&nbsp;&nbsp;&nbsp;{cateParentId == 0 ||
            cateParentId == null ? null : (
              <Checkbox
                checked={isParentCateRate == 1}
                onChange={(e: any) => this._checkedHandle(e.target.checked)}
              >
                使用上级类目扣率
              </Checkbox>
            )}
          </span>
          <div>
            <Tips title="平台与商家结算的佣金比率，请填写0-100间的数字，精确到小数点后两位" />
          </div>
        </FormItem>
      </Form>
    );
  }

  /**
   * 修改分类名称
   */
  _changeCateName = (e) => {
    const { editFormData } = this.props.relaxProps;
    editFormData(Map({ cateName: e.target.value }));
  };

  /**
   * 修改类目扣率
   */
  _changeCateRate = (e) => {
    const { editFormData, useParentRateF, formData } = this.props.relaxProps;
    const isParentCateRate = formData.get('isParentCateRate');
    editFormData(Map({ cateRate: e.target.value ? e.target.value : 0 }));
    if (isParentCateRate == 1) {
      useParentRateF(0);
    }
  };

  /**
   * 改变图片
   */
  _editImages = ({ file, fileList }) => {
    if (file.status == 'error' || fileList == null) {
      message.error('上传失败');
      return;
    }
    const { editImages, editFormData } = this.props.relaxProps;

    //删除图片
    if (file.status == 'removed') {
      editFormData(Map({ cateImg: '' }));
      editImages(fromJS([]));
      return;
    }

    fileList = fileList.filter((item) => item != null);
    if (fileList[0].status == 'done') {
      editFormData(Map({ cateImg: fileList[0].response[0] }));
    }
    editImages(fromJS(fileList));
  };

  /**
   * 检查文件格式
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
        message.error('文件大小不能超过50KB');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };

  /**
   * 选中使用上级类目事件
   * @param checked
   */
  _checkedHandle(checked) {
    const { editFormData, parentRate, useParentRateF } = this.props.relaxProps;
    editFormData({ cateRate: checked ? parentRate : null });
    this.props.form.setFieldsValue({
      cateRate: checked ? parentRate : null
    });
    useParentRateF();
  }
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
