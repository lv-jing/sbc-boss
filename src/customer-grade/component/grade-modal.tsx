import * as React from 'react';
import {Form, Icon, Input, message, Modal, Select} from 'antd';
import {Relax} from 'plume2';
import {Const, noop, QMMethod, QMUpload, Tips, ValidConst} from 'qmkit';
import {IMap} from 'typings/globalType';
import {fromJS, Map} from 'immutable';
import {WrappedFormUtils} from 'antd/lib/form/Form';
import {IList} from '../../../typings/globalType';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FormItem = Form.Item;
const rightsTypeName = {0:'等级徽章',1:'专属客服',2:'会员折扣',3:'券礼包',4:'返积分',5:'自定义'};
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
const Option = Select.Option;


const TableRow = styled.div`
  .ant-select-selection__choice__content{
    .rightsName{
       display:none
    }
  }
`;


const FILE_MAX_SIZE = 10 * 1024;

@Relax
export default class GradeModal extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(CateModalForm as any);
  }

  props: {
    relaxProps?: {
      modalVisible: boolean;
      isAdd: boolean;
      modal: Function;
      formData: IMap;
      editFormData: Function;
      images: any;
      // 修改图片
      editImages: Function;
      onSave: Function;
      equities: IList;
      firstData:any;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalVisible: 'modalVisible',
    //是否是新增分类操作
    isAdd: 'isAdd',
    formData: 'formData',
    // 关闭弹窗
    modal: noop,
    editFormData: noop,//修改from表单数据
    // 附件信息
    images: 'images',
    editImages: noop,
    onSave:noop,
    equities:'equities',
    firstData:'firstData'

  };

  render() {
    const { modalVisible ,isAdd} = this.props.relaxProps;
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
        width={900}
      >
        <WrapperForm
          ref={(form) => (this._form = form)}
          relaxProps={this.props.relaxProps}
        />
      </Modal>
    );
  }

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { modal } = this.props.relaxProps;
    modal();
  };


  /**
   * 提交
   */
  _handleSubmit = () => {
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs) => {
      if (!errs) {
        const {  onSave,formData } = this.props.relaxProps;
        //提交
        if (formData.get('rankBadgeImg')=='' || formData.get('rankBadgeImg')==undefined) {
          message.error('请上传等级图标');
          return
        }
        onSave();
      } else {
        this.setState({});
      }
    });
  };



}

class CateModalForm extends React.Component<any, any> {

  props: {
    relaxProps?: {
      formData: IMap;
      images: any;

      editFormData: Function;
      editImages: Function;
      useParentRateF: Function;
      equities:IList;
      firstData:any
    };
    form;
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { formData,editFormData,firstData,equities } = this.props.relaxProps;
    const customerLevelName = formData.get('customerLevelName');
    const growthValue = formData.get('growthValue')|| formData.get('growthValue') === 0   ?formData.get('growthValue')+'' :null;
    const customerLevelDiscount = formData.get('customerLevelDiscount') ? formData.get('customerLevelDiscount').toString() :null;
    const { getFieldDecorator } = this.props.form;
    let images = this.props.relaxProps.images;
    if (formData && formData.get('rankBadgeImg') != null && formData.get('rankBadgeImg') != ''
    ) {
      images = fromJS([
        {
          uid: 1,
          name: formData.get('rankBadgeImg'),
          size: 1,
          status: 'done',
          url: formData.get('rankBadgeImg')
        }
      ]);
    }
    images = images.toJS();

    return (
      <Form className="login-form">
        <FormItem {...formItemLayout} label="等级名称" hasFeedback>
          {getFieldDecorator('customerLevelName', {
            rules: [
              { required: true, whitespace: true, message: '请输入等级名称' },
              { max: 10, message: '最多10字符' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '等级名称');
                }
              }
            ],
            initialValue: customerLevelName,
            onChange: (e) =>   editFormData(Map({ customerLevelName: e.target.value }))
          })(<Input placeholder="请输入等级名称" />)}
        </FormItem>


        <FormItem {...formItemLayout} label="等级徽章" required={true} >
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
            <Tips title="等级会员身份标识，展示在前端个人中心-会员名称 右侧，仅限png，建议尺寸32*32 px，大小不超过10kb" />
          </div>
        </FormItem>

        <FormItem {...formItemLayout} label="所需成长值" hasFeedback>
          {getFieldDecorator('growthValue', {
            rules: [
              { required: true, whitespace: true, message: '请输入所需成长值' },
              // { max: 10, message: '最多10字符' },
              {
                pattern: ValidConst.number,
                message: '请输入正确成长值'
              },
            ],
            initialValue: growthValue,
            onChange: (e) =>   editFormData(Map({ growthValue: e.target.value }))
          })(<Input placeholder="所需成长值" disabled={formData.get('customerLevelId') == firstData } />)}

        </FormItem>
        <FormItem {...formItemLayout} label="折扣率" hasFeedback>
          {getFieldDecorator('customerLevelDiscount', {
            rules: [
              { required: true, whitespace: true, message: '请输入折扣率' },
              {
                pattern: ValidConst.zeroOne,
                message: '请输入0-1（不包含0）之间的数字，精确到小数点后两位'
              },
              // { max: 10, message: '最多10字符' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '折扣率');
                }
              }
            ],
            initialValue: customerLevelDiscount,
            onChange:(e) =>   editFormData(Map({ customerLevelDiscount: e.target.value }))
          })(<Input placeholder="请输入0-1之间的数字，精确到小数点后两位" />)}
        </FormItem>

        <TableRow>
        <FormItem {...formItemLayout} label="会员权益" id={'page-content'}>
          {  equities.size > 0 ? this.chooseGoods().dom : <div>
            <span>会员权益未设置,</span><Link  to={{pathname: '/customer-equities'}}><span style={{color:'#F56C1D'}}>去设置</span></Link> </div>}
        </FormItem>
        </TableRow>
      </Form>
    );
  }


  /**
   * 已选商品结构
   */
  chooseGoods = () => {
    const { formData } = this.props.relaxProps;
    const equitiesIds = formData.get('rightsIds') || fromJS([]);
    const { getFieldDecorator } = this.props.form;
      return {
        dom: getFieldDecorator('rightsIds', {
          initialValue:equitiesIds.toJS()
        })(this._getBrandSelect())
      };
    }


/**
 * 权益选择结构
 */
_getBrandSelect = () => {
  const {  editFormData,equities ,formData} = this.props.relaxProps;
  const equitiesIds = formData.get('rightsIds') || fromJS([]);
  return (
  <div>
    <Select
      value={equitiesIds.toJS()}
      showSearch
      getPopupContainer={() => document.getElementById('page-content')}
      placeholder="请选择会员权益"
      notFoundContent="暂无会员权益"
      mode="multiple"

      optionFilterProp="children"
      filterOption={(input, option: any) => {
        return typeof option.props.children == 'string'
          ? option.props.children
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
          : true;
      }}
      onChange={(value) => {
        editFormData(fromJS({ rightsIds: value }))
      }}
    >
      <Option disabled={true}  value={''} >
        <div style={{display: 'flex',justifyContent: 'space-between'}}>
          <span>权益名称</span> <span className="rightsName" style={{paddingRight:20}}>权益类型</span>
        </div>
      </Option>
      {equities.map((item) => {
        return (
          <Option key={item.get('rightsId')} value={`${item.get('rightsId')}`} title={item.get('rightsName')}>
            <div style={{display: 'flex',justifyContent: 'space-between'}} >
              <span>{item.get('rightsName')}</span> <span className="rightsName" style={{paddingRight:20}}>{rightsTypeName[item.get('rightsType')]}</span>
            </div>
          </Option>
        );
      })}
    </Select>
  </div>
  );
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
        message.error('文件大小不能超过10KB');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
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
      editFormData(Map({ rankBadgeImg: '' }));
      editImages(fromJS([]));
      return;
    }

    fileList = fileList.filter((item) => item != null);
    if (fileList[0].status == 'done') {
      editFormData(Map({ rankBadgeImg: fileList[0].response[0] }));
    }
    editImages(fromJS(fileList));
  };



  /**
   * 修改分类名称
   */
  _changeCateName = (e) => {
    const { editFormData } = this.props.relaxProps;
    editFormData(Map({ cateName: e.target.value }));
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
