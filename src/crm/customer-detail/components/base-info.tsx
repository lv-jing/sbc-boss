import React from 'react';

import { Relax, Store } from 'plume2';
import { Row, Col } from 'antd';
import { Const, noop } from 'qmkit';
import { FindArea } from 'qmkit';
import moment from 'moment';
const defaultImg = require('../img/default-img.png');

const colLayout = {
  xs: { span: 24 },
  sm: { span: 12 },
  md: { span: 6 }
};

@Relax
export default class BaseInfo extends React.Component<any, any> {
  _store: Store;
  props: {
    relaxProps?: {
      onTabChange: Function;
      toggleModal: Function;
      modalVisible: boolean;
      baseInfo: any;
      customerId: string;
    };
  };

  static relaxProps = {
    modalVisible: 'modalVisible',
    onTabChange: noop,
    toggleModal: noop,
    baseInfo: 'baseInfo',
    customerId: 'customerId'
  };

  render() {
    const {
      baseInfo: {
        accountBalance,
        areaId,
        cityId,
        contactName,
        contactPhone,
        customerAccount,
        customerLevelName,
        customerName,
        customerStatus,
        employeeMobile,
        employeeName,
        headImg,
        pointsAvailable,
        inviteCount,
        rewardCash,
        inviteAvailableCount,
        rewardCashNotRecorded,
        growthValue,
        isDistributor,
        provinceId,
        forbidReason,
        distributorLevelName,
        customerAddress,
        checkState,
        birthDay,
        gender,
        createTime,
        enterpriseCheckState,
        enterpriseCheckReason,
        enterpriseCustomerName
      },
      customerId
    } = this.props.relaxProps;

    let status = '';
    if (+checkState === 0) {
      status = '待审核';
    } else if (+checkState === 2) {
      status = '审核未通过';
    } else if (+checkState === 1) {
      if (+customerStatus === 0) {
        status = '启用中';
      } else if (+customerStatus === 1) {
        status = '禁用中';
      }
    }
    let birthDayContent = '';
    if (birthDay) {
      birthDayContent = moment(birthDay).format(Const.DAY_FORMAT);
      birthDayContent += ' ' + this._jsGetAge(birthDay);
    } else {
      birthDayContent = '保密';
    }
    let genderContent = '';
    if (gender == 0 || gender == 1) {
      genderContent = gender == 0 ? '女' : gender == 1 ? '男' : '';
    } else {
      genderContent = '保密';
    }
    //是否企业会员
    const isIep = enterpriseCheckState ? enterpriseCheckState != 0 : false;
    let enterpriseCheckStatus = '';
    if (isIep) {
      if (+enterpriseCheckState === 1) {
        enterpriseCheckStatus = '待审核';
      } else if (+enterpriseCheckState === 2) {
        if (+customerStatus === 0) {
          enterpriseCheckStatus = '启用中';
        } else if (+customerStatus === 1) {
          enterpriseCheckStatus = '禁用中';
        }
      } else if (+enterpriseCheckState === 3) {
        enterpriseCheckStatus = '审核未通过';
      }
    }

    return (
      <div className="base-info article-wrap">
        <div className="title">
          基本信息{' '}
          <a
            href="javascript:;"
            className="link"
            onClick={() => {
              this.props.relaxProps.toggleModal();
            }}
          >
            编辑
          </a>
        </div>
        <Row className="wrap custom-detail-body">
          <Col {...colLayout} className="head">
            <img src={headImg || defaultImg} className="head-img" />
            <div className="info">
              <p className="name">
                {customerName}
                {+isDistributor === 1 && (
                  <span className="distribute">分销员</span>
                )}
                {isIep && (
                  <span className="distribute">{enterpriseCustomerName}</span>
                )}
              </p>
              <p className="phone">{customerAccount}</p>
              <p className="phone">
                {moment(createTime).format(Const.DAY_FORMAT)}注册
              </p>
              <p className="status">
                ● {isIep ? enterpriseCheckStatus : status}
              </p>
              {isIep
                ? enterpriseCheckReason && (
                    <div className="reason">{enterpriseCheckReason}</div>
                  )
                : forbidReason && <div className="reason">{forbidReason}</div>}
            </div>
          </Col>

          <Col {...colLayout}>
            <p className="item">
              <span className="label">性别：</span>
              <span className="info">{genderContent}</span>
            </p>
            <p className="item">
              <span className="label">生日：</span>
              <span className="info">{birthDayContent}</span>
            </p>
            <p className="item">
              <span className="label">联系人：</span>
              <span className="info">{contactName}</span>
            </p>
            <p className="item">
              <span className="label">联系方式：</span>
              <span className="info">{contactPhone}</span>
            </p>
            <div className="item">
              <span className="label">地区：</span>
              <div className="info">
                <p>{FindArea.addressInfo(provinceId, cityId, areaId)}</p>
                <p>{customerAddress}</p>
              </div>
            </div>
            <p className="item">
              <span className="label">业务员：</span>
              <span className="info">
                {employeeName} &nbsp;&nbsp;
                {employeeMobile}
              </span>
            </p>
          </Col>

          <Col {...colLayout}>
            <p className="item">
              <span className="label">等级：</span>
              <span className="info">{customerLevelName}</span>
            </p>
            <p className="item">
              <span className="label">成长值：</span>
              <span className="info">{growthValue}</span>
            </p>
            <p className="item">
              <span className="label">积分：</span>
              <span className="info">{pointsAvailable}</span>
            </p>
            <p className="item">
              <span className="label">余额：</span>
              <span className="info">￥{accountBalance || 0}</span>
            </p>
          </Col>

          <Col {...colLayout}>
            {+isDistributor === 1 && (
              <p className="item">
                <span className="label">分销员等级：</span>
                <span className="info">{distributorLevelName}</span>
              </p>
            )}
            <p className="item">
              <span className="label">邀新人数：</span>
              <span className="info">{inviteCount || 0}</span>
              <a
                className="link"
                target="_blank"
                href={`/invite-new-record/${customerId}/${customerAccount}`}
              >
                查看邀新记录
              </a>
            </p>
            <p className="item">
              <span className="label">有效邀新数：</span>
              <span className="info">{inviteAvailableCount || 0}</span>
            </p>
            <p className="item">
              <span className="label">已入账邀新奖金：</span>
              <span className="info">￥{rewardCash || 0}</span>
              {/* <a
                className="link"
                target="_blank"
                href={`/distribution-record/${customerId}/${customerAccount}`}
              >
                查看分销记录
              </a> */}
            </p>
            <p className="item">
              <span className="label">未入账邀新奖金：</span>
              <span className="info">￥{rewardCashNotRecorded || 0}</span>
            </p>
          </Col>
        </Row>
      </div>
    );
  }

  //根据出生日期计算年龄
  _jsGetAge = (strBirthday) => {
    let returnAge;
    let strBirthdayArr = strBirthday.split('-');
    let birthYear = strBirthdayArr[0];
    let birthMonth = strBirthdayArr[1];
    let birthDay = strBirthdayArr[2];
    let d = new Date();
    let nowYear = d.getFullYear();
    let nowMonth = d.getMonth() + 1;
    let nowDay = d.getDate();

    if (nowYear == birthYear) {
      returnAge = 0; //同年 则为0岁
    } else {
      let ageDiff = nowYear - birthYear; //年之差
      if (ageDiff > 0) {
        if (nowMonth == birthMonth) {
          let dayDiff = nowDay - birthDay; //日之差
          if (dayDiff < 0) {
            returnAge = ageDiff - 1;
          } else {
            returnAge = ageDiff;
          }
        } else {
          let monthDiff = nowMonth - birthMonth; //月之差
          if (monthDiff < 0) {
            returnAge = ageDiff - 1;
          } else {
            returnAge = ageDiff;
          }
        }
      } else {
        returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天
      }
    }
    return returnAge + '岁'; //返回周岁年龄
  };
}
