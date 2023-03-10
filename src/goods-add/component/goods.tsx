import * as React from 'react';
import { Relax } from 'plume2';
import { Alert, Col, Form, Input, message, Modal, Radio, Row, Select, Tree, TreeSelect } from 'antd';
import { IList, IMap } from 'typings/globalType';
import { noop, QMMethod, Tips, ValidConst, SelectGroup } from 'qmkit';
import { fromJS, Map } from 'immutable';
import { RCi18n } from 'qmkit';
import ImageLibraryUpload from './image-library-upload';
import VideoLibraryUpload from './video-library-upload';
//import { makeCreateNormalizedMessageFromEsLintFailure } from 'fork-ts-checker-webpack-plugin/lib/NormalizedMessageFactories';
import { FormattedMessage } from 'react-intl';
//import { consoleTestResultHandler } from 'tslint/lib/test';

const { TextArea } = Input;
const { Option } = Select;
// const Option = Select.Option;
const RadioGroup = Radio.Group;
const TreeNode = Tree.TreeNode;

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 12 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 12 }
  }
};
const tProps = {
  treeCheckable: 'true'
};
export const errorMsg = <h1>Hello, world</h1>;

const FILE_MAX_SIZE = 2 * 1024 * 1024;
const confirm = Modal.confirm;
const { SHOW_PARENT } = TreeSelect;

@Relax
export default class Info extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      isEditGoods: boolean;
      goods: IMap;
      editGoods: Function;
      editGoodsItem: Function;
      onGoodsTaggingRelList: Function;
      onProductFilter: Function;
      statusHelpMap: IMap;
      cateList: IList;
      sourceCateList: IList;
      storeCateList: IList;
      sourceStoreCateList: IList;
      brandList: IList;
      images: IList;
      video: IMap;
      maxCount: number;
      goodsList: any;
      goodsSpecs: any;
      editImages: Function;
      showGoodsPropDetail: Function;
      changeStoreCategory: Function;
      updateGoodsForm: Function;
      showBrandModal: Function;
      showCateModal: Function;
      modalVisible: Function;
      clickImg: Function;
      removeImg: Function;
      removeVideo: Function;
      changeDescriptionTab: Function;
      cateDisabled: boolean;
      checkFlag: boolean;
      enterpriseFlag: boolean;
      flashsaleGoods: IList;
      getGoodsCate: IList;
      filtersTotal: IList;
      taggingTotal: IList;
      goodsTaggingRelList: IList;
      productFilter: IList;
      sourceGoodCateList: IList;
      purchaseTypeList: IList;
      frequencyList: IList;
    };
  };

  static relaxProps = {
    isEditGoods: 'isEditGoods',
    // ??????????????????
    goods: 'goods',
    // ????????????????????????
    editGoods: noop,
    editGoodsItem: noop,
    // ????????????????????????
    cateList: 'cateList',
    sourceCateList: 'sourceCateList',
    // ??????????????????
    storeCateList: 'storeCateList',
    sourceStoreCateList: 'sourceStoreCateList',
    // ????????????
    brandList: 'brandList',
    // ????????????
    images: 'images',
    // ??????
    video: 'video',
    maxCount: 'maxCount',

    // ????????????
    editImages: noop,
    showGoodsPropDetail: noop,
    changeStoreCategory: noop,
    updateGoodsForm: noop,
    changeDescriptionTab: noop,
    // ??????????????????
    showBrandModal: noop,
    showCateModal: noop,
    modalVisible: noop,
    imgVisible: 'imgVisible',
    clickImg: noop,
    removeImg: noop,
    removeVideo: noop,
    cateDisabled: 'cateDisabled',
    checkFlag: 'checkFlag',
    enterpriseFlag: 'enterpriseFlag',
    flashsaleGoods: 'flashsaleGoods',
    getGoodsCate: 'getGoodsCate',
    filtersTotal: 'filtersTotal',
    taggingTotal: 'taggingTotal',
    onGoodsTaggingRelList: noop,
    onProductFilter: noop,
    goodsTaggingRelList: 'goodsTaggingRelList',
    productFilter: 'productFilter',
    sourceGoodCateList: 'sourceGoodCateList',
    purchaseTypeList: 'purchaseTypeList',
    frequencyList: 'frequencyList',
    goodsList: 'goodsList',
    // ????????????
    goodsSpecs: 'goodsSpecs',
    updateSpecValues: noop
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(GoodsForm);
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const relaxProps = this.props.relaxProps;
    return (
      <div>
        <div
          style={{
            fontSize: 16,
            marginBottom: 10,
            marginTop: 10,
            fontWeight: 'bold'
          }}
        >
          <FormattedMessage id="Product.basicInformation" />
        </div>
        <div>
          <WrapperForm
            ref={(form) => (this['_form'] = form)}
            //ref={(form) => updateGoodsForm(form)}
            {...{ relaxProps: relaxProps }}
          />
        </div>
      </div>
    );
  }
}

class GoodsForm extends React.Component<any, any> {
  componentDidMount() {
    const { updateGoodsForm } = this.props.relaxProps;
    updateGoodsForm(this.props.form);
  }

  constructor(props) {
    super(props);
    this.state = {
      storeCateIds: props.relaxProps.goods.get('storeCateIds'), // ????????????id??????
      filterList: [],
      selectFilters: [],
      saleableType: null
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.relaxProps.goods.get('saleableFlag') == 0) {
      this.setState({
        saleableType: true
      });
    } else {
      this.setState({
        saleableType: false
      });
    }
    const storeCateIds = nextProps.relaxProps.goods.get('storeCateIds');
    const filtersTotal = nextProps.relaxProps.filtersTotal;
    if (this.state.storeCateIds != storeCateIds) {
      this.setState({ storeCateIds: storeCateIds });
    }
    let filterList = [];
    if (filtersTotal) {
      let sourceFilter = filtersTotal.toJS();
      sourceFilter.map((item) => {
        let childrenNodes = [];
        let hasCustmerAttribute = item.storeGoodsFilterValueVOList && item.storeGoodsFilterValueVOList.length > 0;
        let hasAttribute = item.attributesValueList && item.attributesValueList.length > 0;
        if (hasCustmerAttribute || hasAttribute) {
          let valuesList = hasCustmerAttribute ? item.storeGoodsFilterValueVOList : hasAttribute ? item.attributesValueList : [];
          childrenNodes = valuesList.map((child) => {
            return {
              title: child.attributeDetailName,
              value: child.id,
              key: child.id,
              isSingle: item.choiceStatus === 'Single choice',
              filterType: item.filterType, // 1 is Custmered
              parentId: hasAttribute ? item.attributeId : item.id
            };
          });
          filterList.push({
            title: item.attributeName,
            value: hasAttribute ? item.attributeId : item.id,
            key: hasAttribute ? item.attributeId : item.id,
            children: childrenNodes
          });
        }
        return item;
      });
    }
    this.setState({
      filterList
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { goods, images, sourceGoodCateList, cateList, getGoodsCate, taggingTotal, modalVisible, clickImg, removeImg, brandList, removeVideo, video, goodsTaggingRelList, productFilter, purchaseTypeList, frequencyList } = this.props.relaxProps;
    const storeCateIds = this.state.storeCateIds;
    let parentIds = sourceGoodCateList ? sourceGoodCateList.toJS().map((x) => x.cateParentId) : [];
    const storeCateValues = [];
    if (storeCateIds) {
      storeCateIds.toJS().map((id) => {
        if (!parentIds.includes(id)) {
          storeCateValues.push({ value: id });
        }
      });
    }

    const taggingRelListValues =
      (goodsTaggingRelList &&
        goodsTaggingRelList.map((x) => {
          return { value: x.taggingId };
        })) ||
      [];
    const filterValues =
      (productFilter &&
        productFilter.map((x) => {
          return { value: x.filterValueId };
        })) ||
      [];

    const loop = (cateList) =>
      cateList &&
      cateList.map((item) => {
        if (item.get('children') && item.get('children').count()) {
          // ??????????????????????????????
          return (
            <TreeNode key={item.get('cateId')} disabled={true} value={item.get('cateId')} title={item.get('cateName')}>
              {loop(item.get('children'))}
            </TreeNode>
          );
        }
        return <TreeNode key={item.get('cateId')} value={item.get('cateId')} title={item.get('cateName')} />;
      });
    let brandExists = false;
    if (goods.get('brandId') != null) {
      brandList.map((item) => {
        if (item.get('brandId') + '' == goods.get('brandId').toString()) {
          brandExists = true;
        }
      });
    }

    let getFrequencyList = []


    if (frequencyList && frequencyList.autoShip) {
      
      if (goods.get('promotions') == "autoship") {
        getFrequencyList = [...frequencyList.autoShip.dayList, ...frequencyList.autoShip.weekList, ...frequencyList.autoShip.monthList]
      }else if (goods.get('promotions') == "club"){
        getFrequencyList = [...frequencyList.club.dayClubList, ...frequencyList.club.weekClubList, ...frequencyList.club.monthClubList]
      }else if (goods.get('promotions') == 'individual'){
        getFrequencyList = [...frequencyList.individual.dayIndividualList, ...frequencyList.individual.weekIndividualList, ...frequencyList.individual.monthIndividualList]
      }
    }

    return (
      <Form>
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="Product.SPU" />}>
              {getFieldDecorator('goodsNo', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: 'Please fill in the SPU code'
                  },
                  {
                    min: 1,
                    max: 20,
                    message: '1-20 characters'
                  },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorEmoji(rule, value, callback, 'SPU encoding');
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'goodsNo'),
                initialValue: goods.get('goodsNo')
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="Product.InternalSPU" />}>
              {getFieldDecorator('internalGoodsNo', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: 'Please fill in the SPU code'
                  },
                  {
                    min: 1,
                    max: 20,
                    message: '1-20 characters'
                  },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorEmoji(rule, value, callback, 'SPU encoding');
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'goodsNo'),
                initialValue: goods.get('internalGoodsNo')
              })(<Input disabled />)}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="Product.productName" />}>
              {getFieldDecorator('goodsName', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: RCi18n({id:'Product.PleaseInputProductName'})
                  },
                  {
                    min: 1,
                    max: 225,
                    message: RCi18n({id:'Product.characters5'})
                  },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorEmoji(rule, value, callback, 'product name');
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'goodsName'),
                initialValue: goods.get('goodsName')
              })(<Input disabled title={goods.get('goodsName')} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="Product.onOrOffShelves" />}>
              {getFieldDecorator('addedFlag', {
                rules: [
                  {
                    required: true,
                    message: RCi18n({id:'Product.PleaseSelect'})
                  }
                ],
                onChange: this._editGoods.bind(this, 'addedFlag'),
                initialValue: goods.get('addedFlag') != 0? 1:0
              })(
                <RadioGroup disabled>
                  <Radio value={1}>
                    <FormattedMessage id="Product.onShelves" />
                  </Radio>
                  <Radio value={0}>
                    <FormattedMessage id="Product.offShelves" />
                  </Radio>
                  {/* {isEditGoods && (
                    <Radio value={2} disabled={true}>
                      <FormattedMessage id="Product.partialOnShelves" />
                    </Radio>
                  )} */}
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="Product.subscriptionStatus" />}>
              {getFieldDecorator('subscriptionStatus', {
                rules: [],
                onChange: this._editGoods.bind(this, 'subscriptionStatus'),
                // initialValue: 'Y'
                initialValue: goods.get('subscriptionStatus') || goods.get('subscriptionStatus') === 0 ? goods.get('subscriptionStatus') : 1
              })(
                <Select disabled getPopupContainer={() => document.getElementById('page-content')}>
                  <Option value={1}>Y</Option>
                  <Option value={0}>N</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={RCi18n({id:'Product.subscriptionType'})}>
              {getFieldDecorator('promotions', {
                rules: [],
                onChange: this._editGoods.bind(this, 'promotions'),
                // initialValue: 'Y'
                initialValue: goods.get('promotions')
              })(
                <Select 
                  getPopupContainer={() => document.getElementById('page-content')}  
                  //disabled={Number(goods.get('subscriptionStatus')) === 0} 
                  disabled
                >
                  <Option value='autoship'><FormattedMessage id="Product.Auto ship" /></Option>
                  <Option value='club'><FormattedMessage id="Product.Club" /></Option>
                  <Option value='individual'><FormattedMessage id="Product.Individual" /></Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        {/*??????*/}
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="Product.defaultPurchaseType" />}>
              {getFieldDecorator('defaultPurchaseType', {
                rules: [],
                onChange: this._editGoods.bind(this, 'defaultPurchaseType'),
                // initialValue: 'Y'
                initialValue: goods.get('defaultPurchaseType')
              })(
                <Select 
                  getPopupContainer={() => document.getElementById('page-content')} 
                  //disabled={Number(goods.get('subscriptionStatus')) === 0}
                  disabled
                >
                  {purchaseTypeList&&purchaseTypeList.map((option) => (
                    <Option value={option.id} key={option.id}>
                      {option.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="Product.defaultFrequency" />}>
              {getFieldDecorator('defaultFrequencyId', {
                // rules: [
                //   {
                //     required: false,
                //     message: 'Please select product tagging'
                //   }
                // ],
                initialValue: goods.get('defaultFrequencyId'),
                onChange: this._editGoods.bind(this, 'defaultFrequencyId')
              })(
                <Select 
                  getPopupContainer={() => document.getElementById('page-content')} 
                  //disabled={Number(goods.get('subscriptionStatus')) === 0}
                  disabled
                >
                  {getFrequencyList&&getFrequencyList.map((option) => (
                    <Option value={option.id} key={option.id}>
                      {option.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label={RCi18n({id:'Product.Productcategory'})}>
              {getFieldDecorator('cateId', {
                rules: [
                  {
                    required: true,
                    message: RCi18n({id:'Product.platformProductCategory'})
                  },
                  {
                    validator: (_rule, value, callback) => {
                      if (!value) {
                        callback();
                        return;
                      }

                      let overLen = false;
                      sourceGoodCateList.forEach((val) => {
                        if (val.get('cateParentId') + '' == value) overLen = true;
                        return;
                      });

                      if (overLen) {
                        callback(new Error(RCi18n({id:'Product.selectthelastcategory'})));
                        return;
                      }

                      callback();
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'cateId'),
                initialValue: goods.get('cateId') && goods.get('cateId') != '' ? parseInt(goods.get('cateId')) : undefined
              })(
                <TreeSelect
                  getPopupContainer={() => document.getElementById('page-content')}
                  notFoundContent="No classification"
                  // disabled={cateDisabled}
                  disabled
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeDefaultExpandAll
                >
                  {loop(cateList)}
                </TreeSelect>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={RCi18n({id:'Product.SalesCategory'})}>
              {getFieldDecorator('storeCateIds', {
                rules: [
                  // {
                  //   required: true,
                  //   message: 'Please select sales category'
                  // }
                ],

                initialValue: storeCateValues
              })(
                <TreeSelect
                  getPopupContainer={() => document.getElementById('page-content')}
                  treeCheckable={true}
                  showCheckedStrategy={(TreeSelect as any).SHOW_ALL}
                  treeCheckStrictly={true}
                  //treeData ={getGoodsCate}
                  // showCheckedStrategy = {SHOW_PARENT}
                  disabled
                  notFoundContent="No classification"
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  onChange={this.storeCateChange}
                  treeDefaultExpandAll
                >
                  {this.generateStoreCateTree(getGoodsCate)}
                </TreeSelect>
              )}
            </FormItem>
          </Col>
          {/* <Col span={8}>
            <a
              href="#"
              onClick={showCateModal}
              style={{ marginLeft: 10, lineHeight: '40px' }}
            >
              Add store classification
            </a>
          </Col> */}
        </Row>
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="Product.brand" />}>
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
            <FormItem {...formItemLayout} label={RCi18n({id:'Product.ProductTagging'})}>
              {getFieldDecorator('tagging', {
                rules: [
                  {
                    required: false,
                    message: RCi18n({id:'Product.PleaseSelectProductTagging'})
                  }
                ],
                initialValue: taggingRelListValues
              })(
                <TreeSelect
                  getPopupContainer={() => document.getElementById('page-content')}
                  treeCheckable={true}
                  showCheckedStrategy={(TreeSelect as any).SHOW_ALL}
                  treeCheckStrictly={true}
                  notFoundContent="No classification"
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  showSearch={false}
                  onChange={this.taggingChange}
                  disabled
                >
                  {this.loopTagging(taggingTotal)}
                </TreeSelect>
              )}
            </FormItem>
          </Col>
          {/*<Col span={8}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="Product.unitMeasurement" />}>
              {getFieldDecorator('goodsUnit', {
                rules: [
                  {
                    required: true,
                    min: 1,
                    max: 10,
                    message: '1-10 character'
                  }
                ],
                onChange: this._editGoods.bind(this, 'goodsUnit'),
                initialValue: goods.get('goodsUnit')
              })(<Input placeholder="Please fill in the unit of measurement???no more than 10 words" />)}
            </FormItem>
          </Col>*/}
        </Row>
        <Row>
          <Col span={16}>
            <FormItem
              // {...formItemLayout}
              labelCol={{
                span: 2,
                xs: { span: 24 },
                sm: { span: 6 }
              }}
              wrapperCol={{
                span: 24,
                xs: { span: 24 },
                sm: { span: 18 }
              }}
              label={RCi18n({id:'Product.Productcardintro'})}
            >
              {getFieldDecorator('goodsNewSubtitle', {
                rules: [
                  {
                    min: 1,
                    max: 5000,
                    message: '1-5000 characters'
                  },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorEmoji(rule, value, callback, 'Product card intro.');
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'goodsNewSubtitle'),
                initialValue: goods.get('goodsNewSubtitle')
              })(<Input disabled title={goods.get('goodsNewSubtitle')} />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={16}>
            <FormItem
              // {...formItemLayout}
              labelCol={{
                span: 2,
                xs: { span: 24 },
                sm: { span: 6 }
              }}
              wrapperCol={{
                span: 24,
                xs: { span: 24 },
                sm: { span: 18 }
              }}
              label={<FormattedMessage id="Product.productSubtitle" />}
            >
              {getFieldDecorator('goodsSubtitle', {
                rules: [
                  {
                    min: 1,
                    max: 5000,
                    message: RCi18n({id:'Product.1-5000characters'})
                  },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorEmoji(rule, value, callback, 'Product Subtitle');
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'goodsSubtitle'),
                initialValue: goods.get('goodsSubtitle')
              })(<Input disabled title={goods.get('goodsSubtitle')} />)}
            </FormItem>
          </Col>
        </Row>
        {/*<Row>
          <Col span={16}>
            <FormItem
              labelCol={{
                span: 2,
                xs: { span: 24 },
                sm: { span: 6 }
              }}
              wrapperCol={{
                span: 24,
                xs: { span: 24 },
                sm: { span: 18 }
              }}
              // {...formItemLayout}
              label={<FormattedMessage id="Product.productDescription" />}
            >
              {getFieldDecorator('goodsDescription', {
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorEmoji(rule, value, callback, 'product description');
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'goodsDescription'),
                initialValue: goods.get('goodsDescription')
              })(<TextArea rows={4} placeholder="Please fill in the description of the item" />)}
            </FormItem>
          </Col>
        </Row>*/}
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label={RCi18n({id:'Product.Salesstatus'})}>
              {getFieldDecorator('saleableFlag', {
                rules: [
                  {
                    required: true,
                    message: RCi18n({id:'Product.PleaseSelect'})
                  }
                ],
                onChange: this._editGoods.bind(this, 'saleableFlag'),
                initialValue: goods.get('saleableFlag')
              })(
                <RadioGroup disabled>
                  <span>
                    <Radio value={1}><FormattedMessage id="Product.Saleable" /></Radio>
                  </span>
                  <span>
                    <Radio value={0}><FormattedMessage id="Product.Not???Saleable" /></Radio>
                  </span>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={RCi18n({id:'Product.Displayonshop'})}>
              {getFieldDecorator('displayFlag', {
                rules: [
                  {
                    required: true,
                    message: RCi18n({id:'Product.PleaseSelect'})
                  }
                ],
                onChange: this._editGoods.bind(this, 'displayFlag'),
                initialValue: goods.get('displayFlag')
              })(
                <RadioGroup disabled>
                  <Radio value={1}><FormattedMessage id="Product.Yes" /></Radio>
                  <Radio value={0}><FormattedMessage id="Product.No" /></Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>
        {/* <Row>
          <Col span={8}>
            <FormItem {...formItemLayout} label="Customized filter">
              {getFieldDecorator('productFilter', {
                initialValue: filterValues
              })(
                <TreeSelect
                  getPopupContainer={() => document.getElementById('page-content')}
                  treeCheckable={true}
                  showCheckedStrategy={(TreeSelect as any).SHOW_ALL}
                  treeCheckStrictly={true}
                  //treeData ={filtersTotal}
                  // showCheckedStrategy = {SHOW_PARENT}
                  placeholder="Please select customized filter"
                  notFoundContent="No classification"
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  showSearch={false}
                  onChange={(value: any) => {
                    this.filterChange(value);
                  }}
                  treeDefaultExpandAll
                >
                  {this.filtersTotalTree(this.state.filterList)}
                </TreeSelect>
              )}
            </FormItem>
          </Col>
        </Row> */}
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  <FormattedMessage id="Product.productImage" />
                </span>
              }
            >
              <div style={{ width: 550 }}>
                <ImageLibraryUpload images={images} modalVisible={modalVisible} clickImg={clickImg} removeImg={removeImg} imgType={0} imgCount={10} skuId="" />
              </div>
              {/* <Tips title={<FormattedMessage id="Product.recommendedSizeImg" />} /> */}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="Product.productVideo" />}>
              <div style={{ width: 550 }}>
                <VideoLibraryUpload modalVisible={modalVisible} video={video} removeVideo={removeVideo} imgType={3} skuId="" />
              </div>
              {/* <Tips title={<FormattedMessage id="Product.recommendedSizeVideo" />} /> */}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  /**
   * ????????????????????????????????????????????????????????????????????????
   */
  _onChange = (value) => {
    const { showGoodsPropDetail, changeStoreCategory, changeDescriptionTab } = this.props.relaxProps;
    //showGoodsPropDetail(value);
    //changeStoreCategory(value);
    //changeDescriptionTab(value);
  };
  /**
   * ???????????????
   */
  _editGoods = (key: string, e) => {
    const { editGoods, editGoodsItem, showBrandModal, showCateModal, checkFlag, enterpriseFlag, flashsaleGoods, updateGoodsForm, goodsList, goodsSpecs, updateSpecValues } = this.props.relaxProps;
    const { setFieldsValue } = this.props.form;


    if (e && e.target) {
      e = e.target.value;
    }

    if (key === 'saleableFlag') {
      if (e == 0) {
        let goods = Map({
          [key]: fromJS(0),
        });
        editGoods(goods);
      } else {
        let goods = Map({
          [key]: fromJS(1),
          displayFlag: fromJS(1)
        });
        editGoods(goods);
      }
    }
    else if (key === 'addedFlag') {
      if (e == 0) {
        this.setState({
          saleableType: true
        });
        let goods = Map({
          [key]: fromJS(0)
        });
        editGoods(goods);
        // editGoodsItem(goods);
        setFieldsValue({ addedFlag: 0 });
      } else {
        this.setState({
          saleableType: false
        });
        let goods = Map({
          [key]: fromJS(1)
        });
        editGoods(goods);
        // editGoodsItem(goods);
        setFieldsValue({ addedFlag: 1 });
      }

      goodsList.toJS()&&goodsList.toJS().map(item=>{
        editGoodsItem(item.id,'addedFlag',fromJS(e));
      })
    }

    else if (key === 'saleableFlag') {
      if (e == 0) {
        this.setState({
          saleableType: true

        });
        let goods = Map({
          [key]: fromJS(0),
        });
        editGoods(goods);
        setFieldsValue({ saleableType: 0 });

      } else {
        this.setState({
          saleableType: false
        });
        let goods = Map({
          [key]: fromJS(1),
        });
        editGoods(goods);
        setFieldsValue({ saleableType: 1 });
      }
    }

    else if (key === 'displayFlag') {
      if (e == 0) {
        let goods = Map({
          [key]: fromJS(0),
        });
        editGoods(goods);
        editGoodsItem(goods);
        setFieldsValue({ displayFlag: 0 });
      } else {
        let goods = Map({
          [key]: fromJS(1),
        });
        editGoods(goods);
        editGoodsItem(goods);
        setFieldsValue({ displayFlag: 1 });
      }
    }

    else if (key === 'promotions') {
      let goods = Map({
        promotions: fromJS(e)
      });
      setFieldsValue({ promotions: e });
      editGoods(goods);
      goodsList.toJS()&&goodsList.toJS().map(item=>{
        editGoodsItem(item.id,'promotions',fromJS(e));
      })
      goodsSpecs.toJS() && goodsSpecs.toJS().forEach(item => {
        let newItem = item.specValues.map(specValuesItem => {
          return {
            ...specValuesItem,
            goodsPromotions: e
          }
        })
        updateSpecValues(item.specId, 'specValues', fromJS(newItem))
      })
    }

    else if (key === 'cateId') {
      this._onChange(e);
      if (e === '-1') {
        showCateModal();
      }
      let goods = Map({
        [key]: fromJS(e)
      });
      editGoods(goods);
    }

    else if (key === 'brandId' && e === '0') {
      showBrandModal();
      let goods = Map({
        [key]: fromJS(e)
      });
      editGoods(goods);
    }

    else if (key === 'saleType' && e == 0) {
      if (!flashsaleGoods.isEmpty()) {
        message.error('This product is participating in a spike event, and the sales type cannot be changed!', 3, () => {
          let goods = Map({
            [key]: fromJS(1)
          });
          editGoods(goods);
          setFieldsValue({ saleType: 1 });
        });
      } else {
        let message = '';
        //1:??????????????????????????????  2??????????????????  3???????????????  4???????????????
        if (checkFlag == 'true') {
          if (enterpriseFlag) {
            //??????????????????????????????
            message = RCi18n({id:'Product.suretoswitch'});
          } else {
            //????????????
            message = RCi18n({id:'Product.thedistributionactivity'});
          }
        } else {
          if (enterpriseFlag) {
            message = RCi18n({id:'Product.corporatepurchaseactivity'});;
          }
        }
        if (message != '') {
          confirm({
            title: '??????',
            content: message,
            onOk() {
              let goods = Map({
                [key]: fromJS(e)
              });
              editGoods(goods);
            },
            onCancel() {
              let goods = Map({
                [key]: fromJS(1)
              });
              editGoods(goods);
              setFieldsValue({ saleType: 1 });
            },
            okText: 'OK',
            cancelText: 'Cancel'
          });
        } else {
          let goods = Map({
            [key]: fromJS(e)
          });
          editGoods(goods);
        }
      }
    }

    else if (key === 'subscriptionStatus') {
      if( e == 0) {
        goodsList.toJS()&&goodsList.toJS().map(item=>{
          editGoodsItem(item.id,'subscriptionStatus',0);
        })
      }else {
        goodsList.toJS()&&goodsList.toJS().map(item=>{
          editGoodsItem(item.id,'subscriptionStatus',1);
        })
      }
      let goods = Map({
        [key]: fromJS(e)
      });
      editGoods(goods);
      this.props.form.setFieldsValue({
        defaultPurchaseType: null
      });
      this.props.form.setFieldsValue({
        defaultFrequencyId: null
      });
    }
    else {
      let goods = Map({
        [key]: fromJS(e)
      });
      updateGoodsForm(this.props.form);
      editGoods(goods);
    }
  };

  /**
   * ??????????????????
   */
  storeCateChange = (value, _label, extra) => {
    const { editGoods, sourceGoodCateList } = this.props.relaxProps;
    // ???????????????????????? [{value: 1, label: xx},{value: 2, label: yy}]
    // ??????????????????

    // ???????????????????????????
    let originValues = fromJS(value.map((v) => v.value));

    // ????????????x????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    if (extra.clear || !extra.checked) {
      sourceGoodCateList.forEach((cate) => {
        // ????????????????????????
        if (extra.triggerValue == cate.get('storeCateId') && cate.get('cateParentId') == 0) {
          // ???????????????????????????????????????
          const children = sourceGoodCateList.filter((ss) => ss.get('cateParentId') == extra.triggerValue);
          // ?????????????????????????????????
          originValues = originValues.filter((v) => children.findIndex((c) => c.get('storeCateId') == v) == -1);
        }
      });
    }

    // ??????????????????????????????????????????????????????
    // ????????????extra??????????????????api????????????????????????????????????????????????????????????????????????else???
    originValues.forEach((v) => {
      sourceGoodCateList.forEach((cate) => {
        // ?????????????????????????????????????????????r
        if (v == cate.get('storeCateId') && cate.get('cateParentId') != 0) {
          // ???????????????????????????????????????????????????????????????
          let secondLevel = sourceGoodCateList.find((x) => x.get('storeCateId') === cate.get('cateParentId'));
          if (secondLevel && secondLevel.get('cateParentId') !== 0) {
            let exsit = originValues.toJS().includes(secondLevel.get('cateParentId'));
            if (!exsit) {
              originValues = originValues.push(secondLevel.get('cateParentId')); // first level
            }
          }

          let exsit = originValues.toJS().includes(cate.get('cateParentId'));
          if (!exsit) {
            originValues = originValues.push(cate.get('cateParentId')); // second level
          }
        }
      });
    });
    const storeCateIds = originValues;

    const goods = Map({
      ['storeCateIds']: storeCateIds
    });

    editGoods(goods);
  };

  taggingChange = (taggingValues, _label, extra) => {
    const { onGoodsTaggingRelList } = this.props.relaxProps;
    let originValues = taggingValues.map((v) => v.value);
    const goodsTaggingRelList = [];
    originValues.map((x) => {
      goodsTaggingRelList.push({ taggingId: x });
    });

    // ???????????????????????????????????????
    this.setState({ goodsTaggingRelList }, () => {});

    onGoodsTaggingRelList(goodsTaggingRelList);
  };

  filterChange = (values) => {
    const { onProductFilter } = this.props.relaxProps;
    let allChildrenList = [];
    this.state.filterList.map((x) => {
      x.children.map((c) => allChildrenList.push(c));
    });
    let selectFilters = values.map((x) => x.value);
    let selectChildren = allChildrenList.filter((x) => selectFilters.includes(x.value));

    let productFilter = [];

    selectChildren.map((child) => {
      productFilter.push({
        filterId: child.parentId,
        filterValueId: child.value
      });
    });
    // ???????????????????????????????????????
    this.setState({ productFilter, selectFilters }, () => {
      this.filtersTotalTree(this.state.filterList);
    });

    onProductFilter(productFilter);
  };

  /**
   * ?????????????????????
   */
  _getBrandSelect = () => {
    const { brandList } = this.props.relaxProps;
    return (
      <Select
        showSearch
        getPopupContainer={() => document.getElementById('page-content')}
        notFoundContent="No brand"
        allowClear={true}
        optionFilterProp="children"
        disabled
        filterOption={(input, option: any) => {
          return typeof option.props.children == 'string' ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : true;
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
   * ??????????????????
   */
  _checkUploadFile = (file) => {
    let fileName = file.name.toLowerCase();
    // ????????????????????????jpg???jpeg???png???gif
    if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.gif')) {
      if (file.size <= FILE_MAX_SIZE) {
        return true;
      } else {
        message.error(RCi18n({id:'Product.exceed2M'}));
        return false;
      }
    } else {
      message.error(RCi18n({id:'Product.FileFormatError'}));
      return false;
    }
  };

  /**
   * ???????????????????????????
   * @param storeCateList
   */
  generateStoreCateTree = (storeCateList) => {
    return (
      storeCateList &&
      storeCateList.map((item) => {
        if (item.get('children') && item.get('children').count()) {
          return (
            <TreeNode key={item.get('storeCateId')} value={item.get('storeCateId')} title={item.get('cateName')} disabled checkable={false}>
              {this.generateStoreCateTree(item.get('children'))}
            </TreeNode>
          );
        }
        return <TreeNode key={item.get('storeCateId')} value={item.get('storeCateId')} title={item.get('cateName')} />;
      })
    );
  };

  filtersTotalTree = (filterList) => {
    return (
      filterList &&
      filterList.map((item) => {
        let parentItem = this.state.filterList.find((x) => x.value === item.parentId);
        let childrenIds = parentItem ? parentItem.children.map((x) => x.value) : [];
        let selectedFilters = this.state.selectFilters;
        let intersection = childrenIds.filter((v) => selectedFilters.includes(v));
        let singleDisabled = item.isSingle && intersection.length > 0 && item.value != intersection[0];
        if (item.children && item.children.length > 0) {
          return (
            <TreeNode key={'parent' + item.key} value={'partent' + item.value} title={item.title} disabled checkable={false}>
              {this.filtersTotalTree(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} value={item.value} title={item.title} disabled={singleDisabled} />;
      })
    );
  };

  loopTagging = (taggingTotalTree) => {
    return (
      taggingTotalTree &&
      taggingTotalTree.map((item) => {
        return <TreeNode key={item.get('id')} value={item.get('id')} title={item.get('taggingName')} />;
      })
    );
  };
}
