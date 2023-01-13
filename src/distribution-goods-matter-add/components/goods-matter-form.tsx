import React from 'react';
import { IMap, Relax } from 'plume2';
import { Button, Col, Form, Input, Radio, Row, Table } from 'antd';
import { fromJS } from 'immutable';
import { history, noop, Tips, checkAuth, QMMethod } from 'qmkit';
import ImageList from './image-list';
import MarketingImageList from './marketing-image-list';
import { IList } from 'typings/globalType';

const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xl: { span: 0 }
  },
  wrapperCol: {
    xl: { span: 20 }
  }
};

@Relax
export default class GoodsMatterForm extends React.Component<any, any> {
  props: {
    form: any;
    location: any;
    relaxProps?: {
      data: IMap;
      clickImg: Function;
      removeImg: Function;
      modalVisible: Function;
      removeVideo: Function;
      save: Function;
      fieldsValue: Function;
      images: IList;
      marketingImages: IList;
      matterType: number;
      //给营销素材添加链接
      addLink: Function;
      toggleGoodsModal: Function;
      chooseGoodsInfos: IList;
      deleteSku: Function;
    };
  };

  static relaxProps = {
    data: 'data',
    clickImg: noop,
    removeImg: noop,
    modalVisible: noop,
    removeVideo: noop,
    save: noop,
    fieldsValue: noop,
    images: 'images',
    marketingImages: 'marketingImages',
    matterType: 'matterType',
    addLink: noop,
    toggleGoodsModal: noop,
    chooseGoodsInfos: 'chooseGoodsInfos',
    deleteSku: noop
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const {
      data,
      fieldsValue,
      removeImg,
      clickImg,
      modalVisible,
      images,
      marketingImages,
      matterType,
      addLink,
      toggleGoodsModal,
      chooseGoodsInfos
    } = this.props.relaxProps;

    let goodsMaterials = {
      initialValue: images.count() > 0 ? JSON.stringify(images) : ''
    };

    let marketingMaterials = {
      initialValue:
        marketingImages.count() > 0 ? JSON.stringify(marketingImages) : ''
    };

    return (
      <Form>
        <Form.Item {...formItemLayout}>
          <p className="detailTitle">素材类型</p>
          <Radio.Group
            value={matterType}
            onChange={(e) => {
              fieldsValue('matterType', (e as any).target.value);
            }}
          >
            <Radio value={0}>
              <span style={styles.darkColor}>商品素材</span>
            </Radio>
            <Radio value={1}>
              <span style={styles.darkColor}>营销素材</span>
            </Radio>
          </Radio.Group>
        </Form.Item>
        {matterType == 0 && (
          <Button
            onClick={() => toggleGoodsModal()}
            type="primary"
            htmlType="submit"
          >
            添加商品
          </Button>
        )}
        {matterType == 0 && chooseGoodsInfos.toJS().length > 0 && (
          <Table
            rowKey="goodsInfoId"
            columns={this._columns as any}
            dataSource={chooseGoodsInfos.toJS()}
            pagination={false}
          />
        )}

        <div className="detailTitle" style={{ margin: '24px 0' }}>
          图片
        </div>
        <Form.Item {...formItemLayout}>
          {/* <Radio.Group
            value={data.get('matterType')}
            onChange={(e) => {
              fieldsValue('matterType', (e as any).target.value);
            }}
          >
            <Radio value={0}>
              <span style={styles.darkColor}>图片素材</span>
            </Radio>
            <Radio value={1}>
            <span style={styles.darkColor}>营销素材</span>
            </Radio>
          </Radio.Group> */}

          {matterType == 0 &&
            getFieldDecorator('images', {
              ...goodsMaterials,
              rules: [
                {
                  required: true,
                  message: '请选择图片'
                }
              ]
            })(
              <div>
                <ImageList
                  //  matterType={data.get('matterType')}
                  images={images.toJS()}
                  modalVisible={modalVisible}
                  clickImg={clickImg}
                  removeImg={removeImg}
                  imgType={0}
                  imgCount={8}
                  skuId=""
                />
                <div>
                  <Tips title="建议：800*800px,单张大小不超过2M" />
                </div>
              </div>
            )}
          {matterType == 1 &&
            getFieldDecorator('marketingImages', {
              ...marketingMaterials,
              rules: [
                {
                  required: true,
                  message: '请选择图片'
                }
              ]
            })(
              <div>
                <MarketingImageList
                  //  matterType={data.get('matterType')}
                  addLink={addLink}
                  images={marketingImages}
                  modalVisible={modalVisible}
                  clickImg={clickImg}
                  removeImg={removeImg}
                  imgType={0}
                  imgCount={8}
                  skuId=""
                />
                <div>
                  <Tips title="建议：800*800px,单张大小不超过2M" />
                </div>
              </div>
            )}
          {/* {data.get('matterType') == 1 &&
            getFieldDecorator('video', {})(
              <div>
                <VideoList
                  modalVisible={modalVisible}
                  video={data.get('matter')}
                  removeVideo={removeVideo}
                  imgType={3}
                  skuId=""
                />
                <div>
                  <Tips title="视频必传，仅限1条，视频格式mp4，大小不超过50M" />
                </div>
              </div>
            )} */}
        </Form.Item>
        <div className="detailTitle" style={{ marginBottom: 24 }}>
          推荐语
        </div>
        <Form.Item {...formItemLayout}>
          {getFieldDecorator('recommend', {
            rules: [
              // {
              //   required: true,
              //    message: '请填写推荐语'
              // },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorTrimMinAndMax(
                    rule,
                    value,
                    callback,
                    '推荐语',
                    1,
                    200
                  );
                }
              }
            ],
            initialValue: data.get('recommend')
          })(
            <TextArea
              placeholder="请填写推荐语，不超过200字"
              maxLength={200}
              onChange={(e) => {
                fieldsValue('recommend', e.target.value);
              }}
            />
          )}
        </Form.Item>
        <div className="bar-button">
          <Row type="flex" justify="start">
            <Col span={20}>
              {(checkAuth('f_distribution_goods_matter_edit') ||
                checkAuth('f_distribution_goods_matter_new_edit')) && (
                <Button
                  onClick={() => this._onSave()}
                  type="primary"
                  htmlType="submit"
                >
                  保存
                </Button>
              )}
              &nbsp;&nbsp;
              <Button onClick={() => history.goBack()}>返回</Button>
            </Col>
          </Row>
        </div>
      </Form>
    );
  }

  /**
   * 保存
   */
  _onSave = () => {
    const form = this.props.form;
    const { save } = this.props.relaxProps;
    form.resetFields();
    form.validateFields(null, (errs) => {
      if (!errs) {
        // 验证通过，保存
        save();
      } else {
        this.setState({});
      }
    });
  };

  _columns = [
    {
      title: 'SKU编码',
      dataIndex: 'goodsInfoNo',
      key: 'goodsInfoNo',
      width: '20%',
      className: 'namerow'
    },
    {
      title: '商品名称',
      dataIndex: 'goodsInfoName',
      key: 'goodsInfoName',
      width: '20%',
      className: 'namerow'
    },
    {
      title: '规格',
      dataIndex: 'specText',
      key: 'specText',
      className: 'namerow',
      render: (text) => (text ? text : '-')
    },
    {
      title: '分类',
      dataIndex: 'cateName',
      key: 'cateName',
      className: 'namerow',
      render: (text) => (text ? text : '-')
    },
    {
      title: '操作',
      key: 'option',
      render: (rowInfo) => this._getOption(rowInfo)
    }
  ];

  _getOption = (rowInfo) => {
    rowInfo = fromJS(rowInfo);
    const { deleteSku } = this.props.relaxProps;
    return (
      <div>
        <a onClick={() => deleteSku(rowInfo.get('goodsInfoId'))}>删除</a>
      </div>
    );
  };
}

const styles = {
  darkColor: {
    fontSize: 12,
    color: '#333'
  }
} as any;
