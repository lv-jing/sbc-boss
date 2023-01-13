import React from 'react';
import { Relax } from 'plume2';

@Relax
export default class OrderStatusHead extends React.Component<any, any> {
  props: {
    relaxProps?: {
      customerInfo: any;
      isEnterpriseCustomer: boolean;
    };
  };

  static relaxProps = {
    customerInfo: 'customerInfo',
    isEnterpriseCustomer: 'isEnterpriseCustomer'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { customerInfo, isEnterpriseCustomer } = this.props.relaxProps;
    return (
      <div style={styles.container as any}>
        <div style={styles.headBox as any}>
          <div style={styles.head}>
            <span>
              {isEnterpriseCustomer ? '会员名称' : '客户名称'}:
              {customerInfo.getIn(['customerDetail', 'customerName']) || ''}
            </span>
            <span style={{ paddingLeft: 20 }}>
              成长值:{customerInfo.get('growthValue') || 0}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginTop: 15
  },
  orderEnd: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'flex-end'
  } as any,
  pr20: {
    paddingRight: 20
  },
  headBox: {},
  greenText: {
    color: '#339966',
    display: 'block',
    marginBottom: 5
  },
  darkText: {
    color: '#333333',
    lineHeight: '24px'
  },
  platform: {
    fontSize: 12,
    color: '#fff',
    padding: '1px 3px',
    background: '#F56C1D',
    display: 'inline-block',
    marginLeft: 5
  },
  head: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
    // justifyContent: 'space-between'
  } as any
};
