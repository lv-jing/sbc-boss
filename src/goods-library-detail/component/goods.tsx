import * as React from 'react';
import { Relax } from 'plume2';
import { Col, Form, Input, message, Row, Select, Tree, TreeSelect } from 'antd';
import { IList, IMap } from 'typings/globalType';
import { noop, QMMethod, Tips, ValidConst } from 'qmkit';
import { fromJS, Map } from 'immutable';

import ImageLibraryUpload from './image-library-upload';
import VideoLibraryUpload from './video-library-upload';

const { Option } = Select;
const TreeNode = Tree.TreeNode;

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 18 }
  }
};

const FILE_MAX_SIZE = 2 * 1024 * 1024;

@Relax
export default class Info extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      isEditGoods: boolean;
      goods: IMap;
      editGoods: Function;
      statusHelpMap: IMap;
      cateList: IList;
      sourceCateList: IList;
      storeCateList: IList;
      sourceStoreCateList: IList;
      brandList: IList;
      images: IList;
      maxCount: number;

      editImages: Function;
      showGoodsPropDetail: Function;
      updateGoodsForm: Function;
      modalVisible: Function;
      clickImg: Function;
      removeImg: Function;
      removeVideo: Function;
      cateDisabled: boolean;
    };
  };

  static relaxProps = {
    isEditGoods: 'isEditGoods',
    // 商品基本信息
    goods: 'goods',
    // 修改商品基本信息
    editGoods: noop,
    // 签约平台类目信息
    cateList: 'cateList',
    sourceCateList: 'sourceCateList',
    // 店铺分类信息
    storeCateList: 'storeCateList',
    sourceStoreCateList: 'sourceStoreCateList',
    // 品牌信息
    brandList: 'brandList',
    // 商品图片
    images: 'images',

    maxCount: 'maxCount',

    // 修改图片
    editImages: noop,
    showGoodsPropDetail: noop,
    updateGoodsForm: noop,
    modalVisible: noop,
    imgVisible: 'imgVisible',
    clickImg: noop,
    removeImg: noop,
    removeVideo: noop,
    cateDisabled: 'cateDisabled'
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(GoodsForm);
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const relaxProps = this.props.relaxProps;
    //const { updateGoodsForm } = relaxProps;
    return (
      <div style={{ marginBottom: 20 }}>
        <div
          className="detailTitle"
          style={{ marginBottom: 10, marginTop: 10 }}
        >
          基本信息
        </div>
        <div>
          <WrapperForm
            //ref={(form) => updateGoodsForm(form)}
            {...{ relaxProps: relaxProps }}
          />
        </div>
      </div>
    );
  }
}

class GoodsForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      storeCateIds: props.relaxProps.goods.get('storeCateIds') // 店铺分类id列表
    };
  }

  componentDidMount() {
    const { updateGoodsForm } = this.props.relaxProps;
    updateGoodsForm(this.props.form);
  }

  componentWillReceiveProps(nextProps) {
    const storeCateIds = nextProps.relaxProps.goods.get('storeCateIds');
    if (this.state.storeCateIds != storeCateIds) {
      this.setState({ storeCateIds: storeCateIds });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      goods,
      images,
      cateList,
      modalVisible,
      clickImg,
      removeImg,
      brandList,
      cateDisabled,
      removeVideo,
      isEditGoods
    } = this.props.relaxProps;

    //处理分类的树形图结构数据
    const loop = (cateList) =>
      cateList.map((item) => {
        if (item.get('goodsCateList') && item.get('goodsCateList').count()) {
          // 一二级类目不允许选择
          return (
            <TreeNode
              key={item.get('cateId')}
              value={item.get('cateId')}
              disabled={true}
              title={item.get('cateName')}
            >
              {loop(item.get('goodsCateList'))}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={item.get('cateId')}
            value={item.get('cateId')}
            title={item.get('cateName')}
          />
        );
      });

    let brandExists = false;
    if (goods.get('brandId') != null) {
      brandList.map((item) => {
        if (item.get('brandId') + '' == goods.get('brandId').toString()) {
          brandExists = true;
        }
      });
    }

    return (
      <Form>
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label="商品名称">
              {getFieldDecorator('goodsName', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请填写商品名称'
                  },
                  {
                    min: 1,
                    max: 40,
                    message: '1-40字符'
                  },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorEmoji(
                        rule,
                        value,
                        callback,
                        '商品名称'
                      );
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'goodsName'),
                initialValue: goods.get('goodsName')
              })(<Input placeholder="请填写商品名称，不超过40字" />)}
            </FormItem>
          </Col>

          <Col span={8}>
            {isEditGoods ? (
              <FormItem {...formItemLayout} required={true} label="平台类目">
                {getFieldDecorator('cateName', {
                  initialValue: goods.get('cateName')
                })(<Input disabled={true} />)}
              </FormItem>
            ) : (
              <FormItem {...formItemLayout} label="平台类目">
                {getFieldDecorator('cateId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择平台商品类目'
                    },
                    {
                      validator: (_rule, value, callback) => {
                        if (!value) {
                          callback();
                          return;
                        }
                        callback();
                      }
                    }
                  ],
                  onChange: this._editGoods.bind(this, 'cateId'),
                  initialValue:
                    goods.get('cateId') && goods.get('cateId') != ''
                      ? goods.get('cateId')
                      : undefined
                })(
                  <TreeSelect
                    getPopupContainer={() =>
                      document.getElementById('page-content')
                    }
                    treeCheckable={false}
                    placeholder="请选择平台商品类目"
                    notFoundContent="暂无平台商品类目"
                    disabled={cateDisabled}
                   // showCheckedStrategy={(TreeSelect as any).SHOW_PARENT}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeDefaultExpandAll
                  >
                    {loop(cateList)}
                  </TreeSelect>
                )}
              </FormItem>
            )}
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label="商品品牌">
              {getFieldDecorator(
                'brandId',
                brandExists
                  ? {
                      rules: [],
                      onChange: this._editGoods.bind(this, 'brandId'),
                      initialValue: goods.get('brandId').toString()
                    }
                  : {
                      rules: [],
                      onChange: this._editGoods.bind(this, 'brandId')
                    }
              )(this._getBrandSelect())}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="计量单位">
              {getFieldDecorator('goodsUnit', {
                rules: [
                  {
                    required: true,
                    min: 1,
                    max: 10,
                    message: '1-10字符'
                  },
                  {
                    pattern: ValidConst.noNumber,
                    message: '只能输入中文或英文'
                  }
                ],
                onChange: this._editGoods.bind(this, 'goodsUnit'),
                initialValue: goods.get('goodsUnit')
              })(<Input placeholder="请填写计量单位，不超过10字" />)}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label="商品图片">
              <div style={{ width: 550 }}>
                <ImageLibraryUpload
                  images={images}
                  modalVisible={modalVisible}
                  clickImg={clickImg}
                  removeImg={removeImg}
                  imgType={0}
                  imgCount={10}
                  skuId=""
                />
              </div>
              <Tips title="建议尺寸:800*800px,单张大小不超过2M,最多可上传10张" />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label="商品视频">
              <div style={{ width: 550 }}>
                <VideoLibraryUpload
                  modalVisible={modalVisible}
                  video={goods.get('goodsVideo')}
                  removeVideo={removeVideo}
                  imgType={3}
                  skuId=""
                />
              </div>
              <Tips title="商品视频大小推荐30M，最大限制50M，支持文件类型：mp4，推荐时长小于等于90s，大于等于6s，推荐视频比例7：9" />
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  /**
   * 选中平台类目时，实时显示对应类目下的所有属性信息
   */
  _onChange = (value) => {
    const { showGoodsPropDetail } = this.props.relaxProps;
    showGoodsPropDetail(value);
  };
  /**
   * 修改商品项
   */
  _editGoods = (key: string, e) => {
    const { editGoods,updateGoodsForm } = this.props.relaxProps;
    if (e && e.target) {
      e = e.target.value;
    }
    if (key === 'cateId') {
      this._onChange(e);
    }

    let goods = Map({
      [key]: fromJS(e)
    });
    updateGoodsForm(this.props.form);
    editGoods(goods);
  };

  /**
   * 获取品牌下拉框
   */
  _getBrandSelect = () => {
    const { brandList } = this.props.relaxProps;
    return (
      <Select
        showSearch
        getPopupContainer={() => document.getElementById('page-content')}
        placeholder="请选择品牌"
        notFoundContent="暂无品牌"
        allowClear={true}
        optionFilterProp="children"
        filterOption={(input, option: any) => {
          return typeof option.props.children == 'string'
            ? option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            : true;
        }}
      >
        {brandList.map((item) => {
          return (
            <Option key={item.get('brandId')} value={item.get('brandId') + ''}>
              {item.get('brandName')}
            </Option>
          );
        })}
      </Select>
    );
  };

  /**
   * 检查文件格式
   */
  _checkUploadFile = (file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= FILE_MAX_SIZE) {
        return true;
      } else {
        message.error('文件大小不能超过2M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };
}
