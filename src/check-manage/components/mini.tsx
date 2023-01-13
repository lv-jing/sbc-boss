import React from 'react';
import {Form} from 'antd';
import SettingForm from '../form/setting-form';

// @StoreProvider(AppStore, {debug: __DEV__})
export default class AppletShareSetting extends React.Component<any, any> {
  // store;

  constructor(props) {
    super(props);
  }


  componentDidMount() {
  }

  render() {
    const SettingFormDetail = Form.create()(SettingForm);
    return (
      <div>
        <div className="container">
          <SettingFormDetail/>
        </div>
      </div>
    );
  }


}