import React from 'react';
import { Store, Relax } from 'plume2';
import { Col, Row } from 'antd';
import { fromJS } from 'immutable';
import { Const, FindBusiness, QMUpload } from 'qmkit';
const noneImg = require('../img/none.png');

const colLayout = {
  xs: { span: 24 },
  sm: { span: 12 },
  md: { span: 8 }
};

@Relax
export default class EnterpriseInfo extends React.Component<any, any> {
  _store: Store;

  props: {
    relaxProps?: {
      baseInfo: any;
    };
  };

  static relaxProps = {
    baseInfo: 'baseInfo'
  };

  render() {
    const { enterpriseInfo } = this.props.relaxProps.baseInfo;
    const info = fromJS(enterpriseInfo || {});
    let businessLicenseUrl = info.get('businessLicenseUrl')
      ? info.get('businessLicenseUrl')
      : noneImg;
    businessLicenseUrl = JSON.parse(
      '[{"uid":"rc-upload-1561452887456-4","status":"done","url":"' +
        businessLicenseUrl +
        '"}]'
    );
    return (
      <div className="tag-info">
        <div className="article-wrap">
          <div className="title">公司信息 </div>
          <Row className="wrap custom-detail-body">
            <Col {...colLayout}>
              <p className="item">
                <span className="label">公司名称：</span>
                <span className="info">{info.get('enterpriseName')}</span>
              </p>
              <p className="item">
                <span className="label">统一社会信用代码：</span>
                <span className="info">{info.get('socialCreditCode')}</span>
              </p>
            </Col>
            <Col {...colLayout}>
              <p className="item">
                <span className="label">公司性质：</span>
                <span className="info">
                  {info.get('businessNatureType') != undefined &&
                    FindBusiness.findBusinessNatureName(
                      info.get('businessNatureType')
                    )}
                </span>
              </p>
              <p className="item">
                <span className="label">公司人数：</span>
                <span className="info">
                  {info.get('businessEmployeeNum') != undefined
                    ? FindBusiness.findBusinessEmployeeNumValue(
                        info.get('businessEmployeeNum')
                      )
                    : '-'}
                </span>
              </p>
              <p className="item">
                <span className="label">公司行业：</span>
                <span className="info">
                  {info.get('businessIndustryType') != undefined
                    ? FindBusiness.findBusinessIndustryName(
                        info.get('businessIndustryType')
                      )
                    : '-'}
                </span>
              </p>
            </Col>
            <Col {...colLayout}>
              <p className="item">
                <QMUpload
                  style={styles.box}
                  action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
                  listType="picture-card"
                  name="uploadFile"
                  onChange={null}
                  fileList={businessLicenseUrl}
                  accept={'.png'}
                  beforeUpload={null}
                  disabled={true}
                ></QMUpload>
              </p>
              <span>企业营业执照</span>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

const styles = {
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  },
  alertBox: {
    marginLeft: 10
  },
  toolBox: {
    marginLeft: 10,
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  } as any
};
