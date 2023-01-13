import React from 'react';
import {Button, Col, Form, Icon, Input, message, Row, Tooltip} from 'antd';
import Store from "plume2/es6/typings/store";
import PropTypes from 'prop-types';
import QMUpload from "../../../web_modules/qmkit/upload";
import Const from "../../../web_modules/qmkit/config";
import Tips from "../../../web_modules/qmkit/tips";
import {AuthWrapper, isSystem} from "qmkit";
import {WrappedFormUtils} from "antd/lib/form/Form";


const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
    xs: {span: 6},
    sm: {span: 6}
  },
  wrapperCol: {
    span: 14,
    xs: {span: 14},
    sm: {span: 18}
  }
};

export default class settingForm extends React.Component<any, any> {
  form;
  _store: Store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
    let imgUrl = this._store.state().getIn(['settings', 'imgUrl']);
    this.state = {
      //用于pcLogo图片展示
      LogoImage: imgUrl ? imgUrl.toJS() : [],
      //用于pcLogo图片校验
      imgUrl:  imgUrl
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const _state = this._store.state();
    const settingForm = _state.get('settings');
    let title = {
      initialValue: settingForm.get('title')
    };
    return (
      <Form
        style={{paddingBottom: 50, maxWidth: 900}}
        onSubmit={isSystem(this._handleSubmit)}
      >
        {/*分享标题*/}
        <Row>
          <Col span={18}>
            <FormItem
              {...formItemLayout}
              label="站点分享推荐语"
              hasFeedback
              required={false}
            >
              {getFieldDecorator('title', {
                ...title,
                rules: [
                  {required: true, message: '请填写站点分享推荐语'},
                  {max: 25, message: '站点分享推荐语仅限1-25位字符'},
                  { validator: this.checkTitle }
                ]
              })(<Input size="large"/>)}
            </FormItem>
          </Col>
          <Col span={6}>
            <div style={styles.toolBox}>
              <Tooltip placement="right" title="站点分享推荐语">
                <Icon style={{color: '#999'}} type="exclamation-circle"/>
              </Tooltip>
            </div>
          </Col>
        </Row>

        {/*上传分享图片*/}
        <Row>
          <Col span={18}>
            <FormItem
              required={false}
              {...formItemLayout}
              label="站点分享推荐图"
              hasFeedback
            >
              <div className="clearfix logoImg">
                <QMUpload
                  style={styles.box}
                  action={Const.HOST + '/uploadImage'}
                  listType="picture-card"
                  name="uploadFile"
                  onChange={this._editPcLogo}
                  fileList={this.state.LogoImage}
                  accept={'.jpg,.jpeg,.png,.gif'}
                  beforeUpload={this._checkUploadFile.bind(this, 1)}
                >
                  {this.state.LogoImage.length >= 1 ? null : (
                    <div>
                      <Icon type="plus" style={styles.plus} />
                    </div>
                  )}
                </QMUpload>
                {getFieldDecorator('imgUrl', {
                  initialValue: this.state.imgUrl,
                  rules: [
                    {required: true, message: '请上传站点分享推荐图'},
                  ]
                })(<Input type="hidden" />)}
              </div>
              <Tips title="小程序内分享页面的默认推荐图，仅限jpg、jpeg、png、gif，建议尺寸800*800px，大小不超过1M" />
            </FormItem>
          </Col>
        </Row>
        {/*保存*/}
        <AuthWrapper functionName="f_checkManage_edit">
          <div className="bar-button">
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </div>
        </AuthWrapper>

      </Form>
    )
  }



  /**
   * 校验网址
   * @param rule
   * @param value
   * @param callback
   */
  checkTitle = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }
    if (value.trim() == "") {
      callback(new Error('站点分享推荐语不能为空'));
      return;
    }

    callback();
  };

  _handleSubmit = (e) => {
    e.preventDefault();
    const form = this.props.form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      if (!errs) {
        (this._store as any).editShareSetting({title:values.title,imgUrl:values.imgUrl.toJS ? values.imgUrl.toJS() : JSON.parse(values.imgUrl)});
      }
    });
  };

  /**
   * 检查文件格式
   */
  _checkUploadFile = (size: number, file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= size * 1024 * 1024) {
        return true;
      } else {
        message.error('文件大小不能超过' + size + 'M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };

  /**
   * 编辑pcLogo
   * @param file
   * @param fileList
   * @private
   */
  _editPcLogo = ({ file, fileList }) => {
    //当所有图片都被删除时
    if (JSON.stringify(fileList).length == 2) {
      this.setState({ LogoImage: fileList });
      this.setState({ imgUrl: '' });
      this.props.form.setFieldsValue({ imgUrl: null });
      return;
    }

    if (file.status == 'error') {
      message.error('上传失败');
      return;
    }

    this.setState({ LogoImage: fileList });

    fileList = this._buildFileList(fileList);

    //当上传完成的时候设置
    this.setState({
      imgUrl: JSON.stringify(fileList.filter((item) => item.status == 'done'))
    });
    this.props.form.setFieldsValue({ imgUrl: this.state.imgUrl });
  };


  _buildFileList = (fileList: Array<any>): Array<any> => {
    return fileList.filter((file) => file.status === 'done').map((file) => {
      return {
        uid: file.uid,
        status: file.status,
        url: file.response ? file.response[0] : file.url
      };
    });
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
  },
  alertBox: {
    marginLeft: 10
  },
  toolBox: {
    marginLeft: 10,
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  } as any
};
