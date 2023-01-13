import React from 'react';
import { Select, Input } from 'antd';
import { RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { getStoreList } from './webapi';

const InputGroup = Input.Group;
const Option = Select.Option;

export default class StoreSelection extends React.Component<any, any> {

  constructor(props) {
    super(props);
    this.state = {
      storeList: [],
      selectedType: 1
    };
  }

  componentDidMount() {
    this.init();
  }

  init = () => {
    getStoreList().then(data => {
      this.setState({
        storeList: data.res.context?.content ?? []
      });
    });
  }

  _renderTypeSelect = () => {
    const labelStyle = this.props.labelStyle ?? {};
    return (
      <Select
        onChange={(val) =>
          this.setState({
            selectedType: val
          })
        }
        getPopupContainer={(trigger: any) => trigger.parentNode}
        value={this.state.selectedType}
        style={{ ...styles.label, ...labelStyle }}
      >
        <Option title={RCi18n({ id: 'Store.StoreName' })} value={1}>
          <FormattedMessage id="Store.StoreName" />
        </Option>
        <Option title={RCi18n({ id: 'Store.StoreId' })} value={2}>
          <FormattedMessage id="Store.StoreId" />
        </Option>
      </Select>
    );
  }

  render () {
    const { onChange } = this.props;
    const { selectedType, storeList } = this.state;
    const wrapperStyle = this.props.wrapperStyle ?? {};
    const formItemStyle = this.props.formItemStyle ?? {};
    return (
      <InputGroup compact style={{...styles.formItemStyle,...formItemStyle}}>
        {this._renderTypeSelect()}
        <Select
          style={{...styles.wrapper,...wrapperStyle}}
          allowClear
          getPopupContainer={() =>
            document.getElementById('page-content')
          }
          showSearch
          optionFilterProp="children"
          onChange={onChange}
        >
          {storeList.map((v, i) => {
            return (
              <Option key={i} value={v['storeId'] + ''}>
                {selectedType === 1 ? v['storeName'] : v['storeId']}
              </Option>
            );
          })}
        </Select>
      </InputGroup>
    );
  }
}

const styles = {
  formItemStyle: {
    width: 335
  },
  label: {
    width: 135,
    cursor: 'text'
  },
  leftLabel: {
    width: 135,
    textAlign: 'left',
    color: 'rgba(0, 0, 0, 0.65)',
    backgroundColor: '#fff',
    cursor: 'default',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  wrapper: {
    width: 200
  }
} as any;
