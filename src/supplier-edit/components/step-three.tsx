import React from 'react';
import { IMap, Relax } from 'plume2';

import { Modal, Button, DatePicker, Radio } from 'antd';
import styled from 'styled-components';
import { noop, DataGrid } from 'qmkit';
import moment from 'moment';

const RadioGroup = Radio.Group;
const { Column } = DataGrid;

const Content = styled.div`
  padding-bottom: 20px;
`;

const Red = styled.span`
  color: #e73333;
`;
const H2 = styled.h2`
  color: #333333;
  font-size: 14px;
  display: inline;
  font-weight: 400;
`;

const GreyText = styled.span`
  color: #999999;
  margin-left: 5px;
  margin-right: 20px;
  font-size: 12px;
`;
const TableBox = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table-self tbody td {
    text-align: left;
  }
`;
const PicBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;

  img {
    width: 60px;
    height: 60px;
    padding: 5px;
    border: 1px solid #ddd;
    margin-right: 10px;
    margin-bottom: 10px;
  }
`;

@Relax
export default class StepThree extends React.Component<any, any> {
  props: {
    relaxProps?: {
      brandModal: Function;
      sortModal: Function;
      company: IMap;
      onChange: Function;
      renewStore: Function;
      storeId: number;
      fetchSignInfo: Function;
    };
  };

  static relaxProps = {
    brandModal: noop,
    sortModal: noop,
    company: 'company',
    onChange: noop,
    renewStore: noop,
    storeId: 'storeId',
    fetchSignInfo: noop
  };

  componentWillMount() {
    this.setState({
      showImg: false,
      imgUrl: ''
    });
  }

  render() {
    const { company } = this.props.relaxProps;
    const cateList = company.get('cateList').toJS();
    const brandList = company.get('brandList').toJS();
    const storeInfo = company.get('storeInfo');
    let endDate = storeInfo.get('contractEndDate')
      ? storeInfo.get('contractEndDate').split(' ')[0]
      : null;
    return (
      <div>
        <Content>
          <div>
            <Red>*</Red>
            <H2>????????????</H2>
            <GreyText>
              ?????????{cateList.length}????????? ???????????????200?????????
            </GreyText>
            <Button onClick={this._showSortsModal}>??????????????????</Button>
          </div>
          <TableBox>
            <DataGrid
              rowKey="contractCateId"
              dataSource={cateList.length > 0 ? cateList : []}
              scroll={{ y: 240 }}
              pagination={false}
            >
              <Column
                title="??????"
                dataIndex="cateName"
                key="cateName"
                width="15%"
              />
              <Column
                title="????????????"
                dataIndex="parentGoodCateNames"
                key="parentGoodCateNames"
                width="20%"
              />
              <Column
                title="????????????"
                dataIndex="cateRate"
                key="cateRate"
                width="15%"
                render={(text) => {
                  return (
                    <div>
                      <span style={{ width: 50 }}>{text}</span>&nbsp;%
                    </div>
                  );
                }}
              />
              <Column
                title="????????????"
                dataIndex="qualificationPics"
                key="qualificationPics"
                width="50%"
                render={(text) => {
                  let images = text ? text.split(',') : [];
                  return images.length > 0 ? (
                    <PicBox>
                      {images.map((v, k) => {
                        return (
                          <img
                            src={v}
                            key={k}
                            alt=""
                            onClick={() =>
                              this.setState({ showImg: true, imgUrl: v })
                            }
                          />
                        );
                      })}
                    </PicBox>
                  ) : (
                    <span>-</span>
                  );
                }}
              />
            </DataGrid>
          </TableBox>
        </Content>

        <Content>
          <div>
            <Red>*</Red>
            <H2>????????????</H2>
            <GreyText>
              ?????????{brandList.length}????????? ???????????????50?????????
            </GreyText>
            <Button onClick={this._showModal}>??????????????????</Button>
          </div>
          <TableBox>
            <DataGrid
              dataSource={brandList}
              rowKey="contractBrandId"
              scroll={{ y: 240 }}
              pagination={false}
            >
              <Column
                title="????????????"
                dataIndex="brandName"
                key="brandName"
                width="15%"
              />
              <Column
                title="????????????"
                dataIndex="nickName"
                key="nickName"
                width="20%"
              />
              <Column
                title="??????logo"
                dataIndex="logo"
                key="logo"
                width="15%"
                render={(text, _record, i) => {
                  return text ? (
                    <PicBox>
                      <img
                        src={text}
                        key={i}
                        alt=""
                        onClick={() =>
                          this.setState({ showImg: true, imgUrl: text })
                        }
                      />
                    </PicBox>
                  ) : (
                    <span>-</span>
                  );
                }}
              />
              <Column
                title="????????????"
                dataIndex="authorizePic"
                key="authorizePic"
                width="50%"
                render={(text) => {
                  let images = text ? text : [];
                  return (
                    <PicBox>
                      {images.map((v, k) => {
                        return (
                          <img
                            src={v.url}
                            key={k}
                            alt=""
                            onClick={() =>
                              this.setState({ showImg: true, imgUrl: v.url })
                            }
                          />
                        );
                      })}
                    </PicBox>
                  );
                }}
              />
            </DataGrid>
          </TableBox>
        </Content>

        <Content>
          <div style={{ marginBottom: 10 }}>
            <Red>*</Red>
            <H2>???????????????</H2>
            <GreyText>?????????????????????</GreyText>
          </div>
          <DatePicker
            value={moment(storeInfo.get('contractStartDate'))}
            format="YYYY-MM-DD HH:mm:ss"
            disabled={true}
          />
          ~
          <DatePicker
            //defaultValue ={moment(storeInfo.get('contractEndDate'))}
            defaultValue={endDate ? moment(moment(endDate).valueOf()) : null}
            format="YYYY-MM-DD 23:59:59"
            onChange={(param) => this._changeCalender(param)}
            disabledDate={this.disabledDate}
            getCalendarContainer={() => document.getElementById('page-content')}
          />
        </Content>

        <Content>
          <div style={{ marginBottom: 10 }}>
            <Red>*</Red>
            <H2>????????????</H2>
          </div>
          {storeInfo.get('storeType') == 1 ? (
            <RadioGroup value={storeInfo.get('companyType')}>
              <Radio value={0} disabled>
                ????????????
              </Radio>
              <Radio value={1} disabled>
                ???????????????
              </Radio>
            </RadioGroup>
          ) : (
            <RadioGroup value={storeInfo.get('storeType')}>
              <Radio value={0} disabled>
                ?????????
              </Radio>
            </RadioGroup>
          )}
        </Content>
        <div className="bar-button">
          <Button type="primary" onClick={this._saveAll}>
            ??????
          </Button>
        </div>
        <Modal
          maskClosable={false}
          visible={this.state.showImg}
          footer={null}
          onCancel={() => this._hideImgModal()}
        >
          <div>
            <div>
              <img
                style={{ width: '100%', height: '100%' }}
                src={this.state.imgUrl}
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  /**
   * ??????????????????
   */
  _showModal = () => {
    const { brandModal, fetchSignInfo, storeId } = this.props.relaxProps;
    fetchSignInfo(storeId);
    brandModal();
  };

  /**
   * ??????????????????
   */
  _showSortsModal = () => {
    const { sortModal } = this.props.relaxProps;
    sortModal();
  };

  /**
   * ?????????????????????
   * @param params
   * @private
   */
  _changeCalender = (params) => {
    const { onChange } = this.props.relaxProps;
    let endTime;
    if (params) {
      endTime = params.format('YYYY-MM-DD 23:59:59');
    }
    //????????????????????????
    onChange({ field: 'contractEndDate', value: endTime });
  };

  /**
   * ??????????????????
   * @param e
   * @private
   */
  _chooseType = (e) => {
    const { onChange } = this.props.relaxProps;
    //??????????????????
    onChange({ field: 'companyType', value: e.target.value });
  };

  /**
   * ?????????????????????????????????
   * @private
   */
  _saveAll = () => {
    const { renewStore } = this.props.relaxProps;
    renewStore();
  };

  //??????????????????
  _hideImgModal = () => {
    this.setState({
      showImg: false,
      imgUrl: ''
    });
  };

  /**
   * ??????????????????
   * @param current
   * @returns {any|boolean}
   */
  disabledDate(current) {
    return current && current <= new Date().getTime() - 1000 * 60 * 60 * 24;
  }
}
