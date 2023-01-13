import React from 'react';
import { Button, DatePicker } from 'antd';
import { Relax } from 'plume2';
import { noop, Const } from 'qmkit';

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      onSearch: Function;
      changeStartTime: Function;
      timeValue: any;
    };
  };

  static relaxProps = {
    onSearch: noop,
    changeStartTime: noop,
    timeValue: 'timeValue'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { onSearch, timeValue } = this.props.relaxProps;
    return (
      <div style={{ marginTop: 10 }}>
        <DatePicker
          allowClear={true}
          format={Const.DAY_FORMAT}
          value={timeValue}
          onChange={this.onStartChange}
          showToday={false}
          style={{ marginRight: 15 }}
        />
        <Button
          type="primary"
          icon="search"
          htmlType="submit"
          onClick={() => {
            onSearch();
          }}
        >
          搜索
        </Button>
      </div>
    );
  }

  onStartChange = (value) => {
    const { changeStartTime } = this.props.relaxProps;

    let time = value;
    if (time != null) {
      time = time.format(Const.DAY_FORMAT) + ' 00:00:00';
    }
    changeStartTime(
      {
        fullTimeBegin: time
      },
      value
    );
  };
}
