import React from 'react';
import { Form, Input, Icon, message } from 'antd';

import { Const, QMUpload } from 'qmkit';
const FILE_MAX_SIZE = 2 * 1024 * 1024;

const FormItem = Form.Item;

const normalItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
};

export default class AppPushForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      title: '消息标题',
      spec: '消息内容',
      img: require('../img/default-img.png')
    };
  }

  render() {
    let {
      form: { getFieldDecorator },
      ifModify,
      imageUrl
    } = this.props;
    imageUrl = imageUrl ? imageUrl.toJS() : [];

    let name = null;
    let noticeContext = null;
    let noticeTitle = null;

    if (this.props.planAppPush) {
      let planAppPush = this.props.planAppPush.toJS();
      name = planAppPush.name;
      noticeContext = planAppPush.noticeContext;
      noticeTitle = planAppPush.noticeTitle;
    }

    return (
      <div className="app-push-form">
        <div className="left-show">
          <div className="sms">IOS Push预览</div>
          <div className="send-preview">
            <div className="se-header">
              <div className="se-header">
                <img
                  src={require('../img/default-img.png')}
                  alt=""
                  width="16"
                  height="16"
                />
                <span>应用名称</span>
              </div>

              <span>10分钟前</span>
            </div>
            <div className="se-content">
              <div className="se-left">
                <div className="se-title">
                  {noticeTitle ? noticeTitle : '消息标题'}
                </div>
                <div className="se-spec">
                  {noticeContext ? noticeContext : '消息内容'}
                </div>
              </div>
              <img
                src={
                  imageUrl && imageUrl[0] && imageUrl[0].url
                    ? imageUrl[0].url
                    : require('../img/default-img.png')
                }
                alt=""
                width="40"
                height="40"
              />
            </div>
          </div>

          <div className="sms">Android Push预览</div>
          <div className="send-preview send-preview-row">
            <img
              src={
                imageUrl && imageUrl[0] && imageUrl[0].url
                  ? imageUrl[0].url
                  : require('../img/default-img.png')
              }
              alt=""
              width="40"
              height="40"
            />
            <div>
              <div className="se-title">
                {noticeTitle ? noticeTitle : '消息标题'}
              </div>
              <div className="se-spec">
                {noticeContext ? noticeContext : '消息内容'}
              </div>
            </div>
          </div>

          <div className="sms">站内信预览</div>
          <div className="send-preview send-preview-row">
            <img
              src={
                imageUrl && imageUrl[0] && imageUrl[0].url
                  ? imageUrl[0].url
                  : require('../img/default-img.png')
              }
              alt=""
              width="40"
              height="40"
            />
            <div>
              <div className="se-title">
                {noticeTitle ? noticeTitle : '消息标题'}
              </div>
              <div className="se-spec">
                {noticeContext ? noticeContext : '消息内容'}
              </div>
            </div>
          </div>
        </div>
        <Form className="send-form">
          <Form.Item label={'任务名称'} required {...normalItemLayout}>
            {getFieldDecorator('name', {
              initialValue: name,
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请填写任务名称'
                },
                { min: 1, max: 20, message: '仅限1-20位字符' }
              ]
            })(<Input disabled={!ifModify} placeholder="请填写任务名称" />)}
          </Form.Item>
          <Form.Item label={'消息标题'} required {...normalItemLayout}>
            {getFieldDecorator('noticeTitle', {
              initialValue: noticeTitle,
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请填写消息标题'
                },
                { min: 1, max: 40, message: '仅限1-40位字符' }
              ]
            })(
              <Input
                disabled={!ifModify}
                placeholder="请填写消息标题"
                onChange={(e) => {
                  this.props.setInnerData(
                    ['planAppPush', 'noticeTitle'],
                    e.target.value
                  );
                }}
              />
            )}
          </Form.Item>

          <Form.Item label={'消息内容'} required {...normalItemLayout}>
            {getFieldDecorator('noticeContext', {
              initialValue: noticeContext,
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请填写消息内容'
                },
                { min: 1, max: 100, message: '仅限1-100位字符' }
              ]
            })(
              <Input
                disabled={!ifModify}
                placeholder="请填写消息内容"
                onChange={(e) => {
                  this.props.setInnerData(
                    ['planAppPush', 'noticeContext'],
                    e.target.value
                  );
                }}
              />
            )}
          </Form.Item>

          <FormItem label={'封面图'} {...normalItemLayout}>
            {getFieldDecorator('imageUrl', {
              initialValue: imageUrl
            })(
              <QMUpload
                disabled={!ifModify}
                name="uploadFile"
                fileList={imageUrl}
                action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                listType="picture-card"
                accept={'.jpg,.jpeg,.png,.gif'}
                onChange={({ file, fileList }) => {
                  this._editImages({ file, fileList });
                }}
                beforeUpload={this._checkUploadFile}
              >
                {imageUrl && imageUrl.length < 1 && <Icon type="plus" />}
              </QMUpload>
            )}
            <p style={{ fontSize: 12, color: '#999' }}>
              仅限jpg,jpeg,png,gif，建议尺寸64*64px
            </p>
          </FormItem>
        </Form>
      </div>
    );
  }

  /**
   * 改变图片
   */
  _editImages = ({ file, fileList }) => {
    if (file.status == 'error' || fileList == null) {
      message.error('上传失败');
      return;
    }
    //删除图片
    if (file.status == 'removed') {
      this.props.setData({
        imageUrl: []
      });
      return;
    }
    fileList = JSON.parse(JSON.stringify(fileList));
    this.props.setData({
      imageUrl: [...fileList]
    });
    if (fileList[0].status == 'done') {
      let [
        {
          response: [url],
          name,
          uid,
          size
        }
      ] = fileList;
      this.props.setData({
        imageUrl: [{ url, name, uid, size }]
      });
    }
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
        message.error('文件大小不能超过2M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };
}
