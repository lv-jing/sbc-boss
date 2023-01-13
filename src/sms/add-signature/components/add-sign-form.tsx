import React from 'react';
import Store from '../store';
import {
  Form,
  Input,
  Button,
  Radio,
  Icon,
  message,
  Popover,
  Select
} from 'antd';
const styles = {
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px',
    padding: '20px'
  },
  plus1: {
    color: '#999',
    fontSize: '28px',
    padding: '20px 20px 0 20px'
  }
};
import PropTypes from 'prop-types';
import { QMUpload, Const } from 'qmkit';
const img1 = require('./../img/img1.png');
const img2 = require('./../img/img2.png');
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const FILE_MAX_SIZE = 2 * 1024 * 1024;
const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 14
  }
};

const source = [
  {
    key: 0,
    value: '企事业单位的全称或简称'
  },
  {
    key: 1,
    value: '工信部备案网站的全称或简称'
  },
  {
    key: 2,
    value: 'APP应用的全称或简称'
  },
  {
    key: 3,
    value: '公众号或小程序的全称或简称'
  },
  {
    key: 4,
    value: '电商平台店铺名的全称或简称'
  },
  {
    key: 5,
    value: '商标名的全称或简称'
  }
];

export default class AddSignForm extends React.Component<any, any> {
  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
    this.state = {
      loading: false,
      loading2: false,
      flag: false,
      involveThirdInterest: 0
    };
  }

  componentWillReceiveProps() {
    if (!this.state.flag && this.props.smsSignName) {
      this.setState({
        involveThirdInterest: this.props.involveThirdInterest
      });
    }
  }

  render() {
    let {
      form: { getFieldDecorator },
      involveThirdInterest,
      remark,
      signSource,
      smsSignName,
      imageUrl,
      imageUrl2,
      ifEdit
    } = this.props;
    imageUrl = imageUrl ? imageUrl.toJS() : [];
    imageUrl2 = imageUrl2 ? imageUrl2.toJS() : [];

    const content = <img src={img1} className="img1" />;
    const content2 = <img src={img2} className="img2" />;

    return (
      <Form>
        <FormItem label="签名" {...formItemLayout}>
          {getFieldDecorator('smsSignName', {
            initialValue: smsSignName,
            rules: [
              {
                required: true,
                whitespace: true,
                message: '请输入签名名称，不超过12字符'
              },
              { min: 2, max: 12, message: '仅限2-12位字符' }
            ]
          })(
            <Input
              disabled={ifEdit}
              suffix={smsSignName.length + '/12'}
              placeholder="长度限2-12个字符，建议使用App应用名称或是网站名/公司名"
              onChange={(e) => {
                this.props.setData('smsSignName', e.target.value);
              }}
            />
          )}
        </FormItem>
        <FormItem label="签名来源" {...formItemLayout}>
          {getFieldDecorator('signSource', {
            initialValue: signSource,
            rules: [{ required: true, message: '请选择签名来源' }]
          })(
            <Select>
              <Option key={null} value={null}>
                请选择签名来源
              </Option>
              {source.map((item) => (
                <Option key={item.key} value={item.key}>
                  {item.value}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <div className="info">
          <p>
            签名来源选择工信部备案网站的全称或简称时，请在说明中添加网站域名，加快审核速度；
          </p>
          <p>
            如果选择APP应用的全称或简称或公众号或小程序的全称或简称，则网站、APP、小程序或公众号必须已上线；
          </p>
        </div>
        <FormItem label="是否涉及第三方利益" {...formItemLayout}>
          {getFieldDecorator('involveThirdInterest', {
            initialValue: +involveThirdInterest,
            rules: [{ required: true, message: '请选择是否涉及第三方利益' }]
          })(
            <Radio.Group onChange={(e) => this.onChange(e)}>
              <Radio key="0" value={0}>
                否
              </Radio>
              <Radio key="1" value={1}>
                是
              </Radio>
            </Radio.Group>
          )}
        </FormItem>
        <div className="info">
          若签名涉及的主体与阿里云短信账户主体一致，则为不涉及第三方利益，否则证明文件中需额外提供授权委托书；
        </div>
        <div className="inline">
          <div className="label">证明文件:</div>
          <FormItem>
            {getFieldDecorator('imageUrl', {
              initialValue: imageUrl,
              rules: [
                {
                  required: true,
                  message: '请上传三证合一营业执照'
                }
              ]
            })(
              <QMUpload
                style={styles.box}
                name="uploadFile"
                fileList={imageUrl}
                action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                listType="picture-card"
                accept={'.jpg,.jpeg,.png,.gif'}
                onChange={({ file, fileList }) => {
                  this._editImages({ file, fileList }, 1);
                }}
                beforeUpload={this._checkUploadFile}
              >
                {imageUrl.length < 1 && (
                  <Popover content={content}>
                    <Icon type="plus" style={styles.plus1} />
                    <div className="ant-upload-text">三证合一营业执照</div>
                  </Popover>
                )}
              </QMUpload>
            )}
          </FormItem>
          <FormItem className="imgurl2">
            {getFieldDecorator('imageUrl2', {
              initialValue: imageUrl2,
              rules: [
                {
                  required: +this.state.involveThirdInterest === 1,
                  message: ' 请上传授权委托书'
                }
              ]
            })(
              <QMUpload
                style={styles.box}
                name="uploadFile"
                fileList={imageUrl2}
                action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                listType="picture-card"
                accept={'.jpg,.jpeg,.png,.gif'}
                onChange={({ file, fileList }) => {
                  this._editImages({ file, fileList }, 2);
                }}
                beforeUpload={this._checkUploadFile}
              >
                {imageUrl2.length < 1 && (
                  <Popover content={content2}>
                    <Icon type="plus" style={styles.plus} />
                    <div className="ant-upload-text">授权委托书</div>
                  </Popover>
                )}
              </QMUpload>
            )}
          </FormItem>
        </div>
        <ul className="info">
          <li>
            ·
            请上传签名归属方的企事业单位的企业营业执照、组织机构代码证、税务登记证三证合一的证件及授权委托书
          </li>
          <li>
            · word模版下载：
            <a href="https://files.alicdn.com/tpsservice/da71622cd863004dd3a8d16466a20d12.doc?spm=5176.12212999.0.0.6a8f1cbe14Tejk&file=da71622cd863004dd3a8d16466a20d12.doc">
              授权委托书
            </a>
          </li>
          <li>· 支持jpg、png、gif、jpeg格式的图片，每张图片不大于2MB</li>
        </ul>
        <div className="remark">
          <FormItem label="申请说明" {...formItemLayout}>
            {getFieldDecorator('remark', {
              initialValue: remark,
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请描述您的业务使用场景'
                },
                { min: 1, max: 100, message: '仅限1-100位字符' }
              ]
            })(
              <TextArea
                rows={3}
                onChange={(e) => {
                  this.props.setData('remark', e.target.value);
                }}
                placeholder="请描述您的业务使用场景，不超过100字符；如：验证码、双十一大促营销"
              />
            )}
          </FormItem>
          <span className="remark-suffix">
            {remark ? remark.length : 0}/100
          </span>
        </div>
        <div className="info">
          <FormItem>
            <Button
              type="primary"
              className="save"
              onClick={() => {
                this._saveSign();
              }}
            >
              保 存
            </Button>
          </FormItem>
        </div>
      </Form>
    );
  }

  _saveSign = () => {
    const form = this.props.form;
    form.validateFields(null, async (errs, value) => {
      if (!errs) {
        // 验证通过，保存
        await this._store.saveSign(value);
        // form.resetFields();
        // this.setState({
        //   imageUrl: [],
        //   imageUrl2: []
        // });
      }
    });
  };

  onChange = (e) => {
    this.setState({
      involveThirdInterest: e.target.value
    });
  };

  /**
   * 改变图片
   */
  _editImages = ({ file, fileList }, index) => {
    if (file.status == 'error' || fileList == null) {
      message.error('上传失败');
      return;
    }
    //删除图片
    if (file.status == 'removed') {
      if (index === 1) {
        this.props.setState({
          imageUrl: []
        });
      } else {
        this.props.setState({
          imageUrl2: []
        });
      }
      return;
    }
    fileList = JSON.parse(JSON.stringify(fileList));
    if (index === 1) {
      this.props.setState({
        imageUrl: [...fileList]
      });
    } else {
      this.props.setState({
        imageUrl2: [...fileList]
      });
    }
    if (fileList[0].status == 'done') {
      let [
        {
          response: [url],
          name,
          uid,
          size
        }
      ] = fileList;
      if (index === 1) {
        this.props.setState({
          imageUrl: [{ url, name, uid, size }]
        });
      } else {
        this.props.setState({
          imageUrl2: [{ url, name, uid, size }]
        });
      }
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
