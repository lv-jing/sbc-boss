import React from 'react';
import { noop } from 'qmkit';
import { Relax } from 'plume2';
import { Form, Alert } from 'antd';
import AddSaleForm from './add-sale-form';

const WrappedTemplateForm = Form.create({})(AddSaleForm);

@Relax
export default class AddSale extends React.Component<any, any> {
  _form: any;

  static relaxProps = {
    saleFormData: 'saleFormData',
    ifEdit: 'ifEdit',
    saveTemplate: noop,
    smsPurposeList: 'smsPurposeList',
    passedSignList: 'passedSignList'
  };

  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="add-sale">
        <Alert
          className="alert-info"
          message={
            <div>
              <p>营销短信模板规则</p>
              <p>
                1、审核工作时间为:9:00-23:00
                （法定节日顺延），建议在18:00前提交，预计在2小时内完成审核；
              </p>
              <p>
                2、短信模版规范详情见：https://help.aliyun.com/document_detail/108253.html?spm=a2c4g.11186623.4.3.7dbeb87bMMpz3i；
              </p>
              <p>
                3、短信内容中“【短信签名】、回T退订”是运营商确保短信发送成功的必填项，需计入短信字符内；
              </p>
            </div>
          }
          type="info"
        />

        <WrappedTemplateForm
          ref={(form) => (this._form = form)}
          {...this.props.relaxProps}
        />
      </div>
    );
  }
}
