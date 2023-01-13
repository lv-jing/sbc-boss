import React from 'react';
import { Relax, IMap } from 'plume2';
import { Modal, Form,Alert } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { noop } from 'qmkit';
import MiniForm from './mini-form';
const WrapperForm = Form.create()(MiniForm as any);

@Relax
export default class MiniModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      formVisible: boolean;
      miniFormCancel: Function;
      miniProgramSet: IMap;
      saveMiniProgram: Function;
    };
  };

  static relaxProps = {
    formVisible: 'formVisible',
    miniProgramSet: 'miniProgramSet',
    miniFormCancel: noop,
    saveMiniProgram: noop
  };
  render() {
    const { formVisible, miniFormCancel } = this.props.relaxProps;
    if (!formVisible) {
      return null;
    }
    return (
       <Modal  maskClosable={false}
        title="小程序参数配置"
        visible={formVisible}
        onOk={() => this.onSave()}
        width="620px"
        onCancel={() => miniFormCancel()}
      >
        <Alert
          message={
            <ul>
              <li>
                1、配置参数前请先通过微信公众平台注册并开通小程序；<a href="https://mp.weixin.qq.com/" target="_blank">立即开通，</a> 
                <a href="https://developers.weixin.qq.com/miniprogram/introduction/#产品定位及功能介绍" target="_blank">小程序注册帮助；</a> 
              </li>
              <li>
                2、小程序内访问商城并进行小程序码分享，需正确配置以下参数；
              </li>           
              <li>
                3、<a href="../../mini-interface-doc" target="_blank">参数设置帮助；</a>
              </li>
            </ul>
          }
          type="info"
        />
        {/* {miniProgramSet.size != 0 && (
          <WrapperForm ref={(form) => (this['_form'] = form)} />
        )} */}
        <WrapperForm ref={(form) => (this['_form'] = form)} />
      </Modal>
    );
  }

  onSave = () => {
    const { saveMiniProgram } = this.props.relaxProps;
    const form = this._form as WrappedFormUtils;     
    //启用的时候需要校验   
    // if(miniProgramSet.get('status')==1){
  
    // }else{
    //   //禁用配置
    //   //forbiddenMiniProgram();
    // }
    form.validateFields(null, { force: true }, (errs, values) => {            
      //启用的时候校验
      if (!errs) {
        saveMiniProgram(values);
      }
    });
  };
}
