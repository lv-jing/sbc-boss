import * as React from 'react';
import { IMap, Relax } from 'plume2';
import PropTypes from 'prop-types';
import { Alert, Form, Modal, Switch } from 'antd';
import { noop } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import Store from '../store';

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
    sm: { span: 18 }
  }
};

@Relax
export default class BalanceModal extends React.Component<any, any> {
  _form;
  GateWaysForm: any;

  constructor(props) {
    super(props);
    this.GateWaysForm = Form.create()(GateWaysForm as any);
  }

  props: {
    relaxProps?: {
      balance_visible: boolean;
      onSaveChannel: Function;
      onCancelBalance: Function;
      channelJson: IMap;
      onFormValueChange: Function;
    };
  };

  static relaxProps = {
    balance_visible: 'balance_visible',
    onSaveChannel: noop,
    onCancelBalance: noop,
    channelJson: 'channelJson',
    onFormValueChange: noop
  };

  render() {
    const { balance_visible, onCancelBalance } = this.props.relaxProps;

    const GateWaysForm = this.GateWaysForm;

    if (!balance_visible) {
      return null;
    }
    return (
       <Modal  maskClosable={false}
        width={1100}
        title={'配置余额支付'}
        visible={true}
        onOk={() => this._handleOk()}
        onCancel={() => onCancelBalance()}
      >
        <div>
          <Alert
            message={
              <ul>
                <li>
                  风险提示
                </li>
                <li>
                  2017年11月13日，央行下发了《关于进一步加强无证经营支付业务整治工作的通知》(银办发[2017]217号文)， 文中对无证经营支付业务筛查要点、认定标准及持证机构违规情形的说明，是否开启余额支付功能， 请参考相应的政策法规，一旦开启，将承担相关法律责任。
                </li>
              </ul>
            }
            type="info"
          />
          <div>
            <div style={{ width: 640, marginTop: 20 }}>
              <GateWaysForm ref={(form) => (this._form = form)} />
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  _handleOk() {
    const gatewayForm = this._form as WrappedFormUtils;
    const { onSaveChannel } = this.props.relaxProps;
    gatewayForm.validateFields(null, (errs) => {
      if (!errs) {
        onSaveChannel();
      }
    });
  }
}

class GateWaysForm extends React.Component<any, any> {
  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const channelJson = this._store.state().get('channelJson');
    if (!channelJson) return;
    const onFormValueChange = this._store.onFormValueChange;
    return (
      <Form>
        <FormItem {...formItemLayout} label="是否启用" required={true}>
          <Switch
            checkedChildren="开"
            unCheckedChildren="关"
            onChange={(e) => {
              onFormValueChange('isOpen', e ? 1 : 0);
            }}
            defaultChecked={channelJson.get('isOpen') == 1}
          />
        </FormItem>
      </Form>
    );
  }
  checkWebsite = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }

    const pcWebsiteReg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
    if (!pcWebsiteReg.test(value)) {
      callback(new Error('请输入正确的网址'));
      return;
    }

    callback();
  };
}
