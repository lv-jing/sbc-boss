import * as React from 'react';
import { Relax } from 'plume2';
import { noop } from 'qmkit';
import {  
  Input,  
  Modal,
} from 'antd';

@Relax
export default class LinkModal extends React.Component<any, any> {

  constructor(props) {
    super(props);
  }

  props: {
    relaxProps?: { 
      //给营销素材添加链接
      setLink:Function,
      linkVisible:boolean,            
      addLinkByIndex:Function;
      toggleModal:Function;
      marketingLink:String;
    };
  };

  static relaxProps={
    setLink:noop,
    linkVisible:'linkVisible',        
    addLinkByIndex:noop,
    toggleModal:noop,
    marketingLink:'marketingLink'
  }
  
  render(){
    const { setLink,linkVisible,marketingLink } = this.props.relaxProps;    
    return  <Modal  maskClosable={false} visible={linkVisible}
            onCancel={()=>this._handleCancel()}
            onOk={() => this._handleOk()}>
          <Input
            value={marketingLink}
            placeholder="请输入链接地址"
            onChange={(e) => setLink((e as any).target.value)}
          />
         </Modal>
  }

  _handleCancel=()=>{
     const { toggleModal } = this.props.relaxProps;
     toggleModal();
  }

  _handleOk=()=>{
    const { addLinkByIndex } = this.props.relaxProps;
    addLinkByIndex();
  }
}
