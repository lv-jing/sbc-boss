import { IOptions, Store } from 'plume2';
import SMSReachActor from './actor/add-signature';
import * as webapi from './webapi';
import { Const, history } from 'qmkit';
import { message } from 'antd';
export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new SMSReachActor()];
  }

  onFormFieldChange = (key, value) => {
    this.dispatch('form:field', { key, value });
  };

  setData = (field, value) => {
    this.dispatch('set:state', { field, value });
  };

  init = async (id?) => {
    if (id) {
      const { res } = (await webapi.smsSign(id)) as any;
      if (res.code === Const.SUCCESS_CODE) {
        const {
          involveThirdInterest,
          remark,
          signSource,
          smsSignName,
          smsSignFileInfoList
        } = res.context.smsSignVO;
        const [file1, file2] = smsSignFileInfoList;
        let imageUrl, imageUrl2;
        if (file1 && file1.fileName && file1.fileUrl) {
          imageUrl = [
            {
              uid: 1,
              name: file1.fileName,
              size: 1,
              status: 'done',
              url: file1.fileUrl
            }
          ];
        }

        if (file2 && file2.fileName && file2.fileUrl) {
          imageUrl2 = [
            {
              uid: 2,
              name: file2.fileName,
              size: 1,
              status: 'done',
              url: file2.fileUrl
            }
          ];
        }
        this.dispatch('init:form', {
          involveThirdInterest,
          remark,
          signSource,
          smsSignName,
          smsSignFileInfoList
        });
        this.setState({
          ifEdit: true,
          smsSignName,
          imageUrl,
          imageUrl2,
          signDetail: res.context.smsSignVO
        });
      }
    }
  };

  saveSign = async (value) => {
    const ifEdit = this.state().get('ifEdit');
    const { involveThirdInterest, remark, signSource, smsSignName } = value;
    let imageUrl = this.state().get('imageUrl');
    if (!imageUrl) {
      message.error('请上传三证合一营业执照');
      return;
    }
    imageUrl = imageUrl.toJS();

    if (imageUrl && imageUrl.length <= 0) {
      message.error('请上传三证合一营业执照');
      return;
    }

    const param = {
      involveThirdInterest,
      remark,
      signSource,
      smsSignName,
      smsSignFileInfoList: [
        { fileName: imageUrl[0].name, fileUrl: imageUrl[0].url }
      ]
    };

    if (+involveThirdInterest === 1) {
      let imageUrl2 = this.state().get('imageUrl2');
      if (!imageUrl2) {
        message.error('请上传授权委托书');
        return;
      }
      imageUrl2 = imageUrl2.toJS();
      if (imageUrl2 && imageUrl2.length <= 0) {
        message.error('请上传授权委托书');
        return;
      } else {
        param.smsSignFileInfoList.push({
          fileName: imageUrl2[0].name,
          fileUrl: imageUrl2[0].url
        });
      }
    }

    if (!ifEdit) {
      const { res } = (await webapi.smsSignAdd(param)) as any;
      if (res.code === Const.SUCCESS_CODE) {
        message.success('新增成功');
        history.push({ pathname: '/sms-reach', state: { tab: 'sign' } });
      } else {
        message.error(res.message);
      }
    } else {
      const signDetail = this.state()
        .get('signDetail')
        .toJS();
      const { res } = (await webapi.smsSignModify({
        ...signDetail,
        ...param
      })) as any;
      if (res.code === Const.SUCCESS_CODE) {
        message.success('修改成功');
        history.push({ pathname: '/sms-reach', state: { tab: 'sign' } });
      } else {
        message.error(res.message);
      }
    }
  };

  //@ts-ignore
  setState = (params) => {
    const keys = Object.keys(params);
    for (let key of keys) {
      this.setData(key, params[key]);
    }
  };
}
