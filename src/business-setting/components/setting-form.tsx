import React from 'react';
import { Row, Col, Icon, Button, Form } from 'antd';

import { Const, Tips, QMUpload, AuthWrapper, noop } from 'qmkit';
import { Relax } from 'plume2';
import { message } from 'antd';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 4,
    xs: { span: 4 },
    sm: { span: 4 }
  },
  wrapperCol: {
    span: 20,
    xs: { span: 20 },
    sm: { span: 20 }
  }
};

@Relax
export default class settingForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      businessBanner: string;
      setBusinessBanner: Function;
      onSubmit: Function;
    };
  };

  static relaxProps = {
    businessBanner: 'businessBanner',
    setBusinessBanner: noop,
    onSubmit: noop
  };

  render() {
    const { businessBanner } = this.props.relaxProps;

    const businessBannerImage = businessBanner
      ? JSON.parse(businessBanner)
      : [];
    return (
      <div>
        <Form>
          <Row>
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                required={false}
                label="供应商注册页banner"
                hasFeedback
              >
                <Row>
                  <Col span={24}>
                    <div className="clearfix bannerImg">
                      <QMUpload
                        style={styles.box}
                        action={
                          Const.HOST + '/uploadResource?resourceType=IMAGE'
                        }
                        listType="picture-card"
                        name="uploadFile"
                        onChange={this._editbusinessBanners}
                        fileList={businessBannerImage}
                        accept={'.jpg,.jpeg,.png,.gif'}
                        beforeUpload={this._checkUploadFile.bind(this, 2)}
                      >
                        {businessBannerImage.length >= 5 ? null : (
                          <div>
                            <Icon type="plus" style={styles.plus} />
                          </div>
                        )}
                      </QMUpload>
                    </div>
                  </Col>
                </Row>
                <Tips title="供应商登录页广告图，最多可添加5张，图片格式仅限jpg、jpeg、png、gif，建议尺寸1920*550px，大小不超过2M" />
              </FormItem>
            </Col>
          </Row>
          <AuthWrapper functionName="f_businessSetting_1">
            <div className="bar-button">
              <Button type="primary" onClick={this._handleSubmit}>
                保存
              </Button>
            </div>
          </AuthWrapper>
        </Form>
      </div>
    );
  }

  _handleSubmit = () => {
    this.props.relaxProps.onSubmit();
  };

  /**
   * businessBanner
   * @param file
   * @param fileList
   * @private
   */
  _editbusinessBanners = ({ file, fileList }) => {
    const { setBusinessBanner } = this.props.relaxProps;
    //当所有图片都被删除时
    if (JSON.stringify(fileList).length == 2) {
      setBusinessBanner('');
      return;
    }
    if (file.status == 'error') {
      message.error('上传失败');
      return;
    }
    setBusinessBanner(JSON.stringify(fileList));
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

  _buildFileList = (fileList: Array<any>): Array<any> => {
    return fileList
      .filter((file) => file.status === 'done')
      .map((file) => {
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
    height: 32,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  } as any
};
