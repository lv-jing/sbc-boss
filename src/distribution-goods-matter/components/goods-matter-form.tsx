import React from 'react';
import { IMap, Relax } from 'plume2';
import { Button, Col, Form, Input, Radio, Row } from 'antd';
import { history, noop, Tips, checkAuth,QMMethod } from 'qmkit';
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
  // componentWillReceiveProps(nextProps) {
  //   if (
  //     nextProps.relaxProps.data.get('matter') !=
  //     this.props.relaxProps.data.get('matter')
  //   ) {
  //     this.props.form.setFields({
  //       images: { value: nextProps.relaxProps.data.get('matter') }
  //     });
  //   }
  // }

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
      images:IList;
      marketingImages:IList;
      matterType:number;    
      //给营销素材添加链接
      addLink:Function  
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
    images:'images',
    marketingImages:'marketingImages',
    matterType:'matterType',
    addLink:noop
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
      addLink
    } = this.props.relaxProps;

    let goodsMaterials = {
      initialValue: images.count()>0?JSON.stringify(images):''
    };

    let marketingMaterials = {
      initialValue: marketingImages.count()>0?JSON.stringify(marketingImages):''      
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
            <Radio value={0} disabled={matterType==1}>
              <span style={styles.darkColor}>商品素材</span>
            </Radio>
            <Radio value={1} disabled={matterType==0}>
            <span style={styles.darkColor}>营销素材</span>
            </Radio>
          </Radio.Group>
        </Form.Item>
        <div className="detailTitle">图片</div>
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
                  images={
                    images.toJS()
                  }
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
                  images={
                    marketingImages
                  }
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
        <div className="detailTitle" style={{ marginBottom: 15 }}>
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
    // if (matterType == 0 && data.get('matter') == '') {
    //   form.setFields({ images: { errors: [new Error('请选择图片')] } });
    // } else {
    //   form.setFields({ images: { errors: [] } });
    // }
    // if (matterType == 1 && data.get('matter') == '') {
    //   form.setFields({ video: { errors: [new Error('请选择视频')] } });
    // } else {
    //   form.setFields({ video: { errors: [] } });
    // }
    form.validateFields(null, (errs) => {      
      if (!errs) {
        // 验证通过，保存
        save();
      } else {
        this.setState({});
      }
    });
  };
}

const styles = {
  darkColor: {
    fontSize: 12,
    color: '#333'
  }
} as any;
