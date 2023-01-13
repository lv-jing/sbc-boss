import React from 'react';
import { Alert } from 'antd';
import {Link} from 'react-router-dom';
export default class Tips extends React.Component<any, any> {
  render() {
    return (
      <div style={{ marginBottom: 20 }}>
        <Alert
          message="操作提示:"
          description={
            <div>
              <p>1、平台可设置客户等级，成长值达到升级条件可自动等级，需开启成长值开关，<Link  to={{pathname: '/growth-value-setting'}}><span style={{color:'#F56C1D'}}>去开启</span></Link>; </p>
              <p>2、后台添加的会员，以添加时设置的等级为准，满足下一等级升级条件时自动升级; </p>
              <p>3、升级后享受高等级对应的会员权益，若未设置会员权益，<Link  to={{pathname: '/customer-equities'}}><span style={{color:'#F56C1D'}}>去设置</span></Link>; </p>
              <p>4、最多支持新增10个等级，删除等级或更改所需成长值会影响会员权益，请谨慎操作;</p>
            </div>
          }
          type="info"
        />
      </div>
    );
  }
}
