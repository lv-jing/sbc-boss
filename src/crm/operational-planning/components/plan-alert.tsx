import React from 'react';
import { Alert } from 'antd';
import { Relax } from 'plume2';
import { IMap } from 'typings/globalType';
import moment from 'moment';

@Relax
export default class PlanAlert extends React.Component<any, any> {
  props: {
    relaxProps?: {
      customerPlan: IMap;
    };
  };

  static relaxProps = {
    customerPlan: 'customerPlan'
  };

  constructor(props) {
    super(props);
  }
  render() {
    const { customerPlan } = this.props.relaxProps;
    return (
      <Alert
        style={{
          marginBottom: 20
        }}
        message=""
        description={
          <div>
            <p style={{ fontWeight: 'bolder' }}>
              {customerPlan && customerPlan.get('planName')}
            </p>
            <p>
              {customerPlan && `${moment(customerPlan.get('startDate')).format('LL')}-${moment(customerPlan.get('endDate')).format('LL')}`}
            </p>
          </div>
        }
        type="info"
      />
    );
  }
}
