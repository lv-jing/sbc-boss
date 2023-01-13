import React from 'react';
import { Relax } from 'plume2';
import { noop } from 'qmkit';
import InterfaceSetting from './interface-setting';

@Relax
export default class SettingEntry extends React.Component<any, any> {
  props: {
    relaxProps?: { setData: Function; smsSettingList: any };
  };

  static relaxProps = {
    setData: noop,
    smsSettingList: 'smsSettingList'
  };

  render() {
    const { smsSettingList } = this.props.relaxProps;

    return (
      <div className="setting-entry">
        {smsSettingList.map((item) => {
          return (
            <div className="entry-item" key={item.get('id')}>
              <div className="top">
                <span className="title">
                  <img
                    src={require('../../../images/aliyun.png')}
                    className="sms-icon"
                  />
                  {+item.get('type') === 0 ? '阿里云短信' : '华信短信'}
                </span>
                <span className="state">
                  {+item.get('status') == 0 ? '未启用' : '已启用'}
                </span>
              </div>
              <div className="setting">
                <div
                  className="setting-btn"
                  onClick={() => {
                    this._openInterfaceModal(item);
                  }}
                >
                  设置
                </div>
              </div>
            </div>
          );
        })}
        <InterfaceSetting />
      </div>
    );
  }

  _openInterfaceModal = (item) => {
    const { setData } = this.props.relaxProps;
    setData('settingId', item.get('id'));
    setData('interfaceModalVisible', true);
    setData('settingForm', {
      accessKeyId: item.get('accessKeyId'),
      accessKeySecret: item.get('accessKeySecret'),
      status: item.get('status')
    });
  };
}
