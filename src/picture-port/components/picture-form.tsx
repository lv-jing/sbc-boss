import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import { Store } from 'plume2';
import { QMMethod } from 'qmkit';

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

export default class PictureForm extends React.Component<any, any> {
  _store: Store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const _state = this._store.state();
    const pictureForm = _state.get('pictureForm');

    let endPoint = {
      initialValue: pictureForm.get('endPoint')
    };
    let accessKeyId = {
      initialValue: pictureForm.get('accessKeyId')
    };
    let accessKeySecret = {
      initialValue: pictureForm.get('accessKeySecret')
    };
    let bucketName = {
      initialValue: pictureForm.get('bucketName')
    };

    /* 请求路径：必填，1-50字
     用户名：必填，1-50字
     秘钥：必填，1-50字
     存储空间名：必填，1-50字
     是否开启：必选，默认选中是*/

    return (
      <Form>
        <FormItem {...formItemLayout} label="请求路径" required>
          {getFieldDecorator('endPoint', {
            ...endPoint,
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorTrimMinAndMax(
                    rule,
                    value,
                    callback,
                    '请求路径',
                    1,
                    50
                  );
                }
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="用户名" required>
          {getFieldDecorator('accessKeyId', {
            ...accessKeyId,
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorTrimMinAndMax(
                    rule,
                    value,
                    callback,
                    '用户名',
                    1,
                    50
                  );
                }
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="秘钥" required>
          {getFieldDecorator('accessKeySecret', {
            ...accessKeySecret,
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorTrimMinAndMax(
                    rule,
                    value,
                    callback,
                    '秘钥',
                    1,
                    50
                  );
                }
              }
            ]
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label="存储空间名" required>
          {getFieldDecorator('bucketName', {
            ...bucketName,
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorTrimMinAndMax(
                    rule,
                    value,
                    callback,
                    '存储空间名',
                    1,
                    50
                  );
                }
              }
            ]
          })(<Input />)}
        </FormItem>
        {/*去除开关,默认开启,无法修改 -- 原因:强制使用阿里云,因为目前上传本地环境有拦截器问题,以及app需要使用https的方式访问*/}
        {/*<FormItem {...formItemLayout} label="是否开启" required>
          {
            getFieldDecorator('status', {
              ...status,
              rules: [
                {required: true, message: '请选择是否开启'}]
            })(
                <RadioGroup>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>
            )
          }
        </FormItem>*/}
      </Form>
    );
  }
}
