import React from 'react';
import { Alert } from 'antd';

export default class Tips extends React.Component<any, any> {
  render() {
    return (
      <div>
        <Alert
          message="操作提示"
          description={
            <div>
              <p>
                商城积分体系一经开启，请谨慎进行关闭操作，若关闭会引起已领取积分会员用户体验
              </p>
              <p>该模块设置积分获取规则，可针对各个用户行为设置是否开启</p>
              <p>-基础获取规则针对用户行为操作</p>
              <p>
                -购物获取规则需根据商品分类分别设置各个分类返还比例，下级分类优先继承上级分类返还规则，存在特殊分类需单独进行设置
              </p>
            </div>
          }
          type="info"
        />
      </div>
    );
  }
}
