import React from 'react';
import { Tabs, Form, Switch, Modal } from 'antd';
import BasicSetting from './basic-setting';
import RecruitSetting from './recruit-setting';
import RewordSetting from './reward-setting';
import MultistageSetting from './multistage-setting';
import styled from 'styled-components';
import { checkAuth } from 'qmkit';
import '../style.less';

const InfoBox = styled.div`
  .edui-editor {
    line-height: 1.15;
  }
  .ant-form-item {
    margin-bottom: 10px;
  }
  .ant-form-item-with-help {
    margin-bottom: 5;
  }
`;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

const BasicSettingWapper = Form.create()(BasicSetting);
const RecruitSettingWapper = Form.create()(RecruitSetting);
const RewordSettingWapper = Form.create()(RewordSetting);
const MultistageWapper = Form.create()(MultistageSetting);

export default class SettingForms extends React.Component<any, any> {
  render() {
    return (
      <InfoBox>
        {checkAuth('f_distribution_setting_view') && (
          <div className="distribution-msg">
            <span style={{ color: '#000' }}>社交分销</span>&nbsp;&nbsp;<Switch
              checked={this.props.openFlag}
              disabled={!checkAuth('f_distribution_setting_edit')}
              onChange={(val) => this.onConfirm(val)}
            />&nbsp;开启社交分销，你的社交分销应用将即时生效，关闭后，前端所有相关入口都会关闭，请勿随意关闭开关
            <br />（社交分销生效终端为小程序端，设置完成后，可扫描左上方预览-小程序码体验）
          </div>
        )}
        {checkAuth('f_distribution_setting_view') && (
          <Tabs defaultActiveKey="1" onChange={() => {}}>
            <TabPane tab="基础设置" key="1">
              <BasicSettingWapper />
            </TabPane>
            <TabPane tab="分销员招募" key="2">
              <RecruitSettingWapper
                ref={(form) => this.props.setRecruitForm(form)}
              />
            </TabPane>
            <TabPane tab="奖励模式" key="3">
              <RewordSettingWapper />
            </TabPane>
            <TabPane tab="多级分销" key="4">
              <MultistageWapper />
            </TabPane>
          </Tabs>
        )}
      </InfoBox>
    );
  }

  onConfirm(val) {
    confirm({
      title: !val ? '确定要关闭社交分销吗？' : '确定要开启社交分销吗？',
      content: !val
        ? '关闭后社交分销功能均失效，请谨慎操作！'
        : '开启后社交分销应用立即生效，开启后再关闭会影响前端页面数据展示，请谨慎操作！',
      onOk: () => {
        this.props.fieldsValue(['openFlag'], val);
        this.props.saveOpenFlag(val);
      },
      onCancel: () => {
        this.setState(this.state);
      }
    });
  }
}
