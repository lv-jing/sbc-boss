import { IOptions, Store } from 'plume2';
import SMSActor from './actor/sms-template';
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
    return [new SMSActor()];
  }

  setData = (field, value) => {
    this.dispatch('set:state', { field, value });
  };

  init = async (type, id?) => {
    this.setData('type', type);

    this.getSMSPurposeList();
    this.getPassedSignList();
    this.getNotices();

    if (id) {
      this.setData('ifEdit', true);
      this.setData('templateId', id);
      const { res } = (await webapi.SMSTemplate(id)) as any;
      if (res.code === Const.SUCCESS_CODE) {
        const {
          remark,
          templateContent,
          templateName,
          templateCode
        } = res.context.smsTemplateVO;
        console.log('res>>>>>', res);
        this.setData('templateCode', templateCode);
        if (+type === 0 || +type === 1) {
          const { businessType, signId } = res.context.smsTemplateVO;
          let params = {
            remark,
            templateContent,
            templateName,
            businessType,
            signId
          };
          this.setData(
            +type === 1 ? 'noticeFormData' : 'verifyFormData',
            params
          );
        } else if (+type === 2) {
          this.setData('saleFormData', {
            remark,
            templateContent,
            templateName
          });
        }
      }
    }
  };

  saveTemplate = async (value) => {
    const ifEdit = this.state().get('ifEdit');
    const templateId = this.state().get('templateId');
    const type = this.state().get('type');
    if (!ifEdit) {
      const { res } = (await webapi.SMSTemplateAdd({
        ...value,
        templateContent: value.templateContent,
        templateType: +type
      })) as any;
      if (res.code === Const.SUCCESS_CODE) {
        message.success('新增成功');
        history.push({
          pathname: '/sms-reach',
          state: { tab: 'template', type }
        });
      } else if (res.code === 'K-300304' && +type === 1) {
        message.error('通知节点已被使用');
      } else {
        message.error(res.message);
      }
    } else {
      const templateCode = this.state().get('templateCode');
      const { res } = (await webapi.SMSTemplateModify({
        ...value,
        id: templateId,
        templateType: +type,
        templateCode
      })) as any;
      if (res.code === Const.SUCCESS_CODE) {
        message.success('修改成功');
        history.push({
          pathname: '/sms-reach',
          state: { tab: 'template', type }
        });
      } else if (res.code === 'K-300304' && +type === 1) {
        message.error('通知节点已被使用');
      } else {
        message.error(res.message);
      }
    }
  };

  getSMSPurposeList = async () => {
    const { res } = (await webapi.smsTemplatePurposes({
      pageNum: 0,
      pageSize: 100
    })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.setData('smsPurposeList', res.context.smsPurposeList);
    }
  };

  getPassedSignList = async () => {
    const { res } = (await webapi.smsSignPage({
      reviewStatus: 1,
      pageNum: 0,
      pageSize: 100
    })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('set:state', {
        field: 'passedSignList',
        value: res.context.smsSignVOPage.content
      });
    }
  };

  getNotices = async () => {
    const { res } = (await webapi.notices()) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.setData('notices', res.context.smsPurposeList);
    }
  };
}
