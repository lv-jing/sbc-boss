import React from 'react';

import { Relax } from 'plume2';
import { Row, Col } from 'antd';
import moment from 'moment';
import styled from 'styled-components';
import { IMap } from 'typings/globalType';
import { Const } from 'qmkit';
import CouponList from './coupon-list';

const GreyBg = styled.div`
  color: #333333;
  margin-left: 0px;
  span {
    width: 130px;
    text-align: right;
    color: #666666;
    display: inline-block;
    margin: 5px 0;
  }
`;

@Relax
export default class ActivityInfo extends React.Component<any, any> {
  props: {
    relaxProps?: {
      activityInfo: IMap;
    };
  };

  static relaxProps = {
    activityInfo: 'activityInfo'
  };

  render() {
    const { activityInfo } = this.props.relaxProps;
    const couponActivity = activityInfo.get('couponActivity');
    const customerLevelList = activityInfo.get('customerLevelList');
    const customerDetailVOS = activityInfo.get('customerDetailVOS');
    return (
      <div>
        <GreyBg>
          <Row>
            <Col span={24}>
              <span>活动名称：</span>
              {couponActivity.get('activityName')}
            </Col>
          </Row>

          {(couponActivity.get('couponActivityType') == 3 ||
            couponActivity.get('couponActivityType') == 7) && (
            <div>
              <Row>
                <Col span={24}>
                  <span>参与成功通知标题：</span>
                  {couponActivity.get('activityTitle')}
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <span>参与成功通知描述：</span>
                  {couponActivity.get('activityDesc')}
                </Col>
              </Row>
            </div>
          )}

          <Row>
            <Col span={24}>
              {couponActivity.get('couponActivityType') == 1 ? (
                <span>发放时间：</span>
              ) : (
                <span>活动时间：</span>
              )}
              {couponActivity.get('couponActivityType') == 1
                ? moment(couponActivity.get('startTime'))
                    .format(Const.TIME_FORMAT)
                    .toString()
                : moment(couponActivity.get('startTime'))
                    .format(Const.TIME_FORMAT)
                    .toString() +
                  ' ~ ' +
                  moment(couponActivity.get('endTime'))
                    .format(Const.TIME_FORMAT)
                    .toString()}
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <span>优惠券：</span>
            </Col>
          </Row>
        </GreyBg>
        <CouponList />
        <GreyBg>
          {couponActivity.get('couponActivityType') != 1 && (
            <Row>
              <Col span={24}>
                <span>
                  {couponActivity.get('couponActivityType') == 2 ||
                  couponActivity.get('couponActivityType') == 3 ||
                  couponActivity.get('couponActivityType') == 7
                    ? '优惠券总组数：'
                    : '每人限领次数：'}
                </span>
                {couponActivity.get('receiveType') == '0'
                  ? '不限'
                  : couponActivity.get('receiveCount')}
                {couponActivity.get('couponActivityType') == 2 ||
                couponActivity.get('couponActivityType') == 3 ||
                couponActivity.get('couponActivityType') == 7
                  ? '组'
                  : '次'}
              </Col>
            </Row>
          )}
        </GreyBg>
        <GreyBg>
          {couponActivity.get('couponActivityType') != 2 && (
            <Row>
              <Col span={24}>
                {couponActivity.get('joinLevel') != -2 && (
                  <div>
                    <span>目标客户：</span>
                    {couponActivity.get('joinLevel') == -1
                      ? '全平台客户'
                      : this._showLevel(
                          couponActivity.get('joinLevel'),
                          customerLevelList
                        )}
                  </div>
                )}

                {couponActivity.get('joinLevel') == -2 && customerDetailVOS && (
                  <div>
                    <span style={styles.lableSpan}>目标客户：</span>
                    <div style={styles.lableBox}>
                      {customerDetailVOS.toJS().map((record) => {
                        return (
                          <span style={styles.item}>
                            {record.customerAccount}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          )}
        </GreyBg>
      </div>
    );
  }

  /**
   *展示等级
   */
  _showLevel(text, customerLevelList) {
    if (null == text) {
      return '';
    } else if (-2 == text) {
      return '';
    } else if (-1 == text) {
      return '全平台客户';
    } else if (-4 == text) {
      return '企业会员';
    } else if (0 == text) {
      return '全部等级';
    } else {
      let str = '';
      text.split(',').forEach((item) => {
        const level = customerLevelList.find(
          (i) => i.get('customerLevelId') == item
        );
        if (level) {
          str += level.get('customerLevelName') + '，';
        }
      });
      str = str.substring(0, str.length - 1);
      if (str == '') {
        str = '-';
      }
      return str;
    }
  }
}

const styles = {
  title: {
    background: '#f7f7f7',
    height: 32,
    paddingLeft: 20,
    paddingRight: 20,
    display: 'flex',
    alignItems: 'center',
    color: '#333'
  } as any,
  box: {
    paddingTop: 4,
    paddingBottom: 0
  },
  item: {
    textAlign: 'left'
  },
  lableSpan: {
    verticalAlign: 'top'
  },
  lableBox: {
    width: 'calc(100% - 130px)',
    display: 'inline-block'
  }
};
