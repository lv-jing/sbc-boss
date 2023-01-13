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
                1、该模块设置成长值获取规则：可同步积分获取规则，仅可查看不可编辑；或自定义获取规则，可自定义成长值的获取规则；
              </p>
              <p>
                2、购物获取成长值规则需根据商品分类设置返还比例，下级分类优先继承上级分类返还规则，存在特殊分类需单独进行设置；
              </p>
              <p>
                3、成长值开启后，关闭会影响用户等级和用户权益，若已有会员获取成长值，不允许关闭，请谨慎操作；
              </p>
            </div>
          }
          type="info"
        />
      </div>
    );
  }
}
