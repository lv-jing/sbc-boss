import React from 'react';
import { Relax, IMap } from 'plume2';

import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Icon,
  DatePicker,
  message,
  Popover
} from 'antd';
import styled from 'styled-components';
import { QMUpload, noop, ValidConst, QMMethod, Const } from 'qmkit';
import moment from 'moment';

const front = require('../img/front.png');
const back = require('../img/back.png');
const post = require('../img/post.png');
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
/*const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 14,
      offset: 6
    }
  }
};*/

const newtailFormItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 3 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 7 }
  }
};
const PicBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justifycontent: flex-start;
  width: 430px;

  + p {
    color: #999999;
    width: 430px;
  }
`;
const ExamplePic = styled.div`
  border: 1px solid #d9d9d9;
  width: 104px;
  height: 104px;
  border-radius: 4px;
  text-align: center;
  margin-right: 8px;
  display: inline-block;
  position: relative;
  p {
    color: #ffffff;
    width: 100%;
    height: 24px;
    line-height: 24px;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 1;
    text-align: center;
    background: rgba(0, 0, 0, 0.5);
  }
  img {
    border-radius: 4px;
  }
`;
const dateFormat = 'YYYY-MM-DD';
const FILE_MAX_SIZE = 2 * 1024 * 1024;

const content = (
  <div>
    <img src={post} alt="" height="400" />
  </div>
);

const person = (
  <div>
    <img src={front} alt="" height="400" />
  </div>
);

const personback = (
  <div>
    <img src={back} alt="" height="400" />
  </div>
);
@Relax
export default class StepTwo extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      company: IMap;

      mergeInfo: Function;
      saveCompanyInfo: Function;
    };
  };

  static relaxProps = {
    company: 'company',

    mergeInfo: noop,
    saveCompanyInfo: noop
  };

  render() {
    const { company, mergeInfo } = this.props.relaxProps;
    const info = company.get('info');
    const businessLicence = info.get('businessLicence')
      ? JSON.parse(info.get('businessLicence'))
      : [];
    const frontIDCard = info.get('frontIDCard')
      ? JSON.parse(info.get('frontIDCard'))
      : [];
    const backIDCard = info.get('backIDCard')
      ? JSON.parse(info.get('backIDCard'))
      : [];
    const { getFieldDecorator } = this.props.form;
    const foundDate = info.get('foundDate') && {
      initialValue: moment(info.get('foundDate'), dateFormat)
    };

    const businessTermStart = info.get('businessTermStart') && {
      initialValue: moment(info.get('businessTermStart'), dateFormat)
    };

    const businessTermEnd = info.get('businessTermEnd') && {
      initialValue: moment(info.get('businessTermEnd'), dateFormat)
    };

    return (
      <div style={{ padding: '20px 0' }}>
        <Form>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                required={true}
                label="统一社会信用代码"
              >
                {getFieldDecorator('socialCreditCode', {
                  initialValue: info.get('socialCreditCode'),
                  rules: [
                    { required: true, message: '请填写统一社会信用代码' },
                    {
                      pattern: ValidConst.socialCreditCode,
                      message: '请填写正确的统一社会信用代码且必须15-20字符'
                    }
                  ]
                })(
                  <Input
                    onChange={(e: any) =>
                      mergeInfo({
                        field: 'socialCreditCode',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} required={true} label="企业名称">
                {getFieldDecorator('companyName', {
                  initialValue: info.get('companyName'),
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        QMMethod.validatorTrimMinAndMax(
                          rule,
                          value,
                          callback,
                          '企业名称',
                          1,
                          50
                        );
                      }
                    }
                  ]
                })(
                  <Input
                    onChange={(e: any) =>
                      mergeInfo({
                        field: 'companyName',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="住所">
                {getFieldDecorator('address', {
                  initialValue: info.get('address'),
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        QMMethod.validatorMinAndMax(
                          rule,
                          value,
                          callback,
                          '住所',
                          0,
                          60
                        );
                      }
                    }
                  ]
                })(
                  <Input
                    onChange={(e: any) =>
                      mergeInfo({
                        field: 'address',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="法定代表人">
                {getFieldDecorator('legalRepresentative', {
                  initialValue: info.get('legalRepresentative'),
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        QMMethod.validatorMinAndMax(
                          rule,
                          value,
                          callback,
                          '法定代表人',
                          0,
                          10
                        );
                      }
                    }
                  ]
                })(
                  <Input
                    onChange={(e: any) =>
                      mergeInfo({
                        field: 'legalRepresentative',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="注册资本">
                {getFieldDecorator('registeredCapital', {
                  initialValue: info.get('registeredCapital'),
                  rules: [
                    {
                      pattern: ValidConst.zeroPrice,
                      message: '请输入正确的注册资本'
                    },
                    {
                      validator: (rule, value, callback) => {
                        QMMethod.validatorMinAndMax(
                          rule,
                          value,
                          callback,
                          '注册资本',
                          0,
                          9
                        );
                      }
                    }
                  ]
                })(
                  <Input
                    style={{ width: 142 }}
                    onChange={(e: any) =>
                      mergeInfo({
                        field: 'registeredCapital',
                        value: e.target.value
                      })
                    }
                  />
                )}
                &nbsp;万元
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="成立日期">
                {getFieldDecorator('foundDate', {
                  ...foundDate,
                  rules: [
                    {
                      validator: (rule, value, callback) =>
                        QMMethod.validatorMinAndMax(
                          rule,
                          value ? value.format(dateFormat) : '',
                          callback,
                          '成立日期',
                          0,
                          20
                        )
                    }
                  ]
                })(
                  <DatePicker
                    format={'YYYY-MM-DD'}
                    onChange={(_date, dateString) =>
                      mergeInfo({
                        field: 'foundDate',
                        value: dateString
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="营业期限自">
                {getFieldDecorator('businessTermStart', {
                  ...businessTermStart,
                  rules: [
                    {
                      validator: (rule, value, callback) =>
                        QMMethod.validatorMinAndMax(
                          rule,
                          value ? value.format(dateFormat) : '',
                          callback,
                          '营业期限',
                          0,
                          20
                        )
                    }
                  ]
                })(
                  <DatePicker
                    format={'YYYY-MM-DD'}
                    onChange={(_date, dateString) =>
                      mergeInfo({
                        field: 'businessTermStart',
                        value: dateString
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="营业期限至">
                {getFieldDecorator('businessTermEnd', {
                  ...businessTermEnd,
                  rules: [
                    {
                      validator: (rule, value, callback) =>
                        QMMethod.validatorMinAndMax(
                          rule,
                          value ? value.format(dateFormat) : '',
                          callback,
                          '营业期限',
                          0,
                          20
                        )
                    }
                  ]
                })(
                  <DatePicker
                    format={'YYYY-MM-DD'}
                    onChange={(_date, dateString) =>
                      mergeInfo({
                        field: 'businessTermEnd',
                        value: dateString
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem
                required={true}
                {...newtailFormItemLayout}
                label="经营范围"
              >
                {getFieldDecorator('businessScope', {
                  initialValue: info.get('businessScope'),
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        QMMethod.validatorTrimMinAndMax(
                          rule,
                          value,
                          callback,
                          '经营范围',
                          1,
                          500
                        );
                      }
                    }
                  ]
                })(
                  <Input.TextArea
                    style={{ height: 100 }}
                    onChange={(e: any) =>
                      mergeInfo({
                        field: 'businessScope',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                required={true}
                {...formItemLayout}
                label="营业执照副本电子版"
              >
                <PicBox>
                  <QMUpload
                    name="uploadFile"
                    style={styles.box}
                    fileList={businessLicence}
                    action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                    listType="picture-card"
                    accept={'.jpg,.jpeg,.png,.gif'}
                    onChange={(info) =>
                      this._editImages(info, 'businessLicence')
                    }
                    beforeUpload={this._checkUploadFile}
                  >
                    {businessLicence.length < 1 && (
                      <Icon type="plus" style={styles.plus} />
                    )}
                  </QMUpload>
                  {getFieldDecorator('businessLicence', {
                    initialValue: info.get('businessLicence'),
                    rules: [{ required: true, message: '请上传营业执照' }]
                  })(<Input type="hidden" />)}
                  <Popover content={content}>
                    <ExamplePic>
                      <img src={post} alt="" width="100%" />
                      <p>示例</p>
                    </ExamplePic>
                  </Popover>
                </PicBox>
                <p>仅限jpg、jpeg、gif、png，大小不超过2M，仅限上传1张</p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="法人身份证">
                <PicBox>
                  <QMUpload
                    name="uploadFile"
                    style={styles.box}
                    fileList={frontIDCard}
                    action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                    listType="picture-card"
                    accept={'.jpg,.jpeg,.png,.gif'}
                    onChange={(info) => this._editImages(info, 'frontIDCard')}
                    beforeUpload={this._checkUploadFile}
                  >
                    {frontIDCard.length < 1 && (
                      <Icon type="plus" style={styles.plus} />
                    )}
                  </QMUpload>
                  <Popover content={person}>
                    <ExamplePic>
                      <img src={front} alt="" width="100%" />
                      <p>正面示例</p>
                    </ExamplePic>
                  </Popover>
                  <QMUpload
                    style={styles.box}
                    name="uploadFile"
                    fileList={backIDCard}
                    action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                    listType="picture-card"
                    accept={'.jpg,.jpeg,.png,.gif'}
                    onChange={(info) => this._editImages(info, 'backIDCard')}
                    beforeUpload={this._checkUploadFile}
                  >
                    {backIDCard.length < 1 && (
                      <Icon type="plus" style={styles.plus} />
                    )}
                  </QMUpload>
                  <Popover content={personback}>
                    <ExamplePic>
                      <img src={back} alt="" width="100%" />
                      <p>反面示例</p>
                    </ExamplePic>
                  </Popover>
                </PicBox>
                <p>
                  请上传身份证正反面照片，仅限jpg、jpeg、gif、png，大小不超过2M，仅限上传2张
                </p>
              </FormItem>
            </Col>
          </Row>
          <div className="bar-button">
            <Button onClick={this._save} type="primary">
              保存
            </Button>
          </div>
        </Form>
      </div>
    );
  }

  /**
   * 保存
   */
  _save = () => {
    const form = this.props.form;
    const { company } = this.props.relaxProps;
    form.validateFields(null, (errs) => {
      //如果校验通过
      if (!errs) {
        this.props.relaxProps.saveCompanyInfo(company.get('info'));
      } else {
        this.setState({});
      }
    });
  };

  /**
   * 改变图片
   */
  _editImages = (info, field) => {
    const { file, fileList } = info;
    const { mergeInfo } = this.props.relaxProps;
    const status = file.status;
    if (status === 'done') {
      message.success(`${file.name} 上传成功！`);
    } else if (status === 'error') {
      message.error(`${file.name} 上传失败！`);
    }
    if (field == 'businessLicence') {
      this.props.form.setFieldsValue({
        businessLicence: fileList
      });
    }
    mergeInfo({ field, value: JSON.stringify(fileList) });
  };

  /**
   * 检查文件格式
   */
  _checkUploadFile = (file, fileList) => {
    if (fileList.length > 1) {
      message.error('只能上传一张图片');
      return false;
    }
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
