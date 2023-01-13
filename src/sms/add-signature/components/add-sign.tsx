import React from 'react';
import { noop } from 'qmkit';
import { Relax } from 'plume2';
import { Form, Alert } from 'antd';
import AddSignForm from './add-sign-form';

const WrappedTemplateForm = Form.create({})(AddSignForm);

@Relax
export default class AddSign extends React.Component<any, any> {
  _form: any;
  props: {
    relaxProps?: {
      setData: Function;
      involveThirdInterest: string;
      remark: string;
      signSource: string;
      smsSignName: string;
      smsSignFileInfoList: any;
      setState: Function;
      imageUrl: any;
      imageUrl2: any;
      ifEdit: boolean;
    };
  };

  static relaxProps = {
    setData: noop,
    involveThirdInterest: 'involveThirdInterest',
    remark: 'remark',
    signSource: 'signSource',
    smsSignName: 'smsSignName',
    smsSignFileInfoList: 'smsSignFileInfoList',
    setState: noop,
    imageUrl: 'imageUrl',
    imageUrl2: 'imageUrl2',
    ifEdit: 'ifEdit'
  };

  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="add-sign">
        <Alert
          message={
            <div>
              <p>签名规则</p>
              <p>
                1、签名在通过运营商审核后可以被使用，新提交的签名预计在1工作日内完成审核；
              </p>
              <p>
                2、签名规范详情见：
                <a
                  href="https://help.aliyun.com/document_detail/108077.html?spm=a2c4g.11186623.6.581.14235b02LXnvb4"
                  target="_blank"
                >
                  https://help.aliyun.com/document_detail/108077.html?spm=a2c4g.11186623.6.581.14235b02LXnvb4
                </a>
              </p>
            </div>
          }
          type="info"
          className="alert-info"
        />

        <WrappedTemplateForm
          ref={(form) => (this._form = form)}
          {...this.props.relaxProps}
        />
      </div>
    );
  }
}
