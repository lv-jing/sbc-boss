import * as React from 'react';
import { Relax, IMap } from 'plume2';
import { Modal, Input, Form } from 'antd';
import { noop, QMMethod } from 'qmkit';

const FormItem = Form.Item;

@Relax
export default class DismissedModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  props: {
    form: any;
    relaxProps?: {
      dismissedVisible: boolean;
      dismissedModal: Function;
      supplierCheckInfo: Function; //商家审核信息
      checkInfo: IMap;
      dissMissSupplier: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    dismissedVisible: 'dismissedVisible',
    // 关闭弹框
    dismissedModal: noop,
    supplierCheckInfo: noop,
    checkInfo: 'checkInfo',
    dissMissSupplier: noop
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { dismissedVisible, supplierCheckInfo } = this.props.relaxProps;

    if (!dismissedVisible) {
      return null;
    }
    return (
       <Modal  maskClosable={false}
        title={<div>请填写驳回原因</div>}
         
        visible={dismissedVisible}
        onCancel={this._handleModelCancel}
        onOk={this._handleOk}
        okText="保存"
      >
        <Form>
          <FormItem>
            {getFieldDecorator('rejectReason', {
              initialValue: '',
              rules: [
                // {required: true, message: '请填写驳回原因'},
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorTrimMinAndMax(
                      rule,
                      value,
                      callback,
                      '驳回原因',
                      1,
                      100
                    );
                  }
                }
                //{max: 100, message: '最多100字符'}
              ]
            })(
              <Input.TextArea
                onChange={(e) =>
                  supplierCheckInfo({
                    field: 'auditReason',
                    value: (e.target as any).value
                  })
                }
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { dismissedModal } = this.props.relaxProps;
    dismissedModal();
  };

  /**
   *保存驳回输入
   * @private
   */
  _handleOk = () => {
    const form = this.props.form;
    const { supplierCheckInfo, dissMissSupplier } = this.props.relaxProps;
    //对非空的进行校验
    form.validateFields(null, (errs) => {
      //如果校验通过
      if (!errs) {
        //审核信息中的审核状态置为2(未通过)
        supplierCheckInfo({ field: 'auditState', value: 2 });
        //关闭弹框
        this._handleModelCancel();
        //驳回
        dissMissSupplier();
      } else {
        this.setState({});
      }
    });
  };
}
