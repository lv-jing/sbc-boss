import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form } from 'antd';
import { noop } from 'qmkit';
import CompanyForm from './company-form';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import AppStore from '../store';

const WrapperForm = Form.create()(CompanyForm as any);

@Relax
export default class CompanyModal extends React.Component<any, any> {
  _store: AppStore;
  _form: any;
  props: {
    relaxProps?: {
      expVisible: boolean;
      onCancel: Function;
      /*      changeName:Function,
            changeId:Function,*/
      confirmAdd: Function;
      expressId: any;
      expressName: any;
    };
  };

  static relaxProps = {
    expVisible: 'expVisible',
    onCancel: noop,
    /*    changeName:noop,
        changeId:noop,*/
    confirmAdd: noop,
    expressId: 'expressId',
    expressName: 'expressName'
  };

  /**
   * change事件监听文本框里值的变化，将实际的值传递给store
   * 并重新setState更改子组件的数据源,通过变量传递
   * 子组件的prpos修改以后可以向store里传递参数
   * store去调api
   * 添加成功后页面重新渲染*/
  /*  _changeId=(event)=>{
      return this.props.relaxProps.changeId(event.target.value)
    }
  
    _changeName=(event)=>{
      return this.props.relaxProps.changeName(event.target.value)
    }*/

  _handleOk = () => {
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      //如果校验通过
      if (!errs) {
        return this.props.relaxProps.confirmAdd(values);
      }
    });
  };

  render() {
    const { expVisible, onCancel } = this.props.relaxProps;
    const excelUrl = window.location.origin + '/wuliuyulan.xlsx';
    if (!expVisible) {
      return null;
    }
    return (
       <Modal  maskClosable={false}
        title="新增物流公司"
        visible={expVisible}
        onCancel={() => onCancel()}
        onOk={this._handleOk}
      >
        <p style={{ marginBottom: 20 }}>
          本系统已为您接入50家常用物流公司快递查询接口，
          如您需要接入更多物流公司，请在此输入对应公司的名称与代码&nbsp;&nbsp;<a
            href={excelUrl}
            download
          >
            点击下载快递100物流公司代码文档
          </a>
        </p>
        <WrapperForm ref={(form) => (this._form = form)} />
      </Modal>
    );
  }
}
