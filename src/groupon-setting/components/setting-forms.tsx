import React from 'react';
import { Tabs, Form, Modal } from 'antd';
import { Relax } from 'plume2';
import { noop } from 'qmkit';
import GoodsSetting from './goods-setting';
import PosterSetting from './poster-setting';
import RuleSetting from './rule-setting';
import styled from 'styled-components';
import {checkAuth } from 'qmkit';

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

const PosterWapper = Form.create()(PosterSetting);
const RuleWapper = Form.create()(RuleSetting);

@Relax
export default class SettingForms extends React.Component<any, any> {
  static relaxProps={
    activeKey:'activeKey',
    changeActiveKey:noop
  }
  render() {
    const { activeKey,changeActiveKey } =this.props.relaxProps;
    return (
      <InfoBox>
        {checkAuth('f_fetch_groupon_setting') && (
          <Tabs defaultActiveKey={activeKey} onChange={(key) =>changeActiveKey(key)}>
            <TabPane tab="拼团设置" key="1">
              <GoodsSetting />              
            </TabPane>
            <TabPane tab="拼团广告" key="2">
              <PosterWapper
                ref={(form) => this.props.setRecruitForm(form)}
              />
            </TabPane>
            <TabPane tab="拼团规则" key="3">
              <RuleWapper />
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
