import * as React from 'react';
import { Relax } from 'plume2';
import { Table, Input, Row, Col, Checkbox, InputNumber, Form, Button, message, Tooltip, Icon, Select } from 'antd';
import { IList, IMap } from 'typings/globalType';
import { fromJS, List, Map } from 'immutable';
import { noop, ValidConst, cache } from 'qmkit';
import ImageLibraryUpload from './image-library-upload';
import { FormattedMessage } from 'react-intl';
import ProductTooltipSKU from './productTooltip-sku';
import * as _ from 'lodash';
import { RCi18n } from 'qmkit';
const FormItem = Form.Item;
const { Option } = Select;
const FILE_MAX_SIZE = 2 * 1024 * 1024;
const { TextArea } = Input;
const limitDecimals = (value: string | number): string => {

  const reg = /^(\-)*(\d+)\.(\d\d\d\d).*$/;
  if(typeof value === 'string') {
    if (!isNaN(Number(value))) {
      //value = Number(value).toFixed(2)
      return value.replace(reg, '$1$2.$3')
    } else {
      return ""
    }
    
  } else if (typeof value === 'number') {
    let a = !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
    return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''

  } else {
    return ''
  }
};
@Relax
export default class SkuTable extends React.Component<any, any> {
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(SkuForm);
    this.state = {
      visible: false,
      EANList: [],
      goodsInfoNo: [],
      specType: false,
    };
  }

  props: {
    relaxProps?: {
      goodsSpecs: IList;
      goodsList: IList;
      stockChecked: boolean;
      marketPriceChecked: boolean;
      specSingleFlag: boolean;
      spuMarketPrice: number;
      priceOpt: number;
      initStoreCateList: any;
      goodsInfos: any;
      goodsId: any;
      editGoodsItem: Function;
      deleteGoodsInfo: Function;
      updateSkuForm: Function;
      updateChecked: Function;
      synchValue: Function;
      clickImg: Function;
      removeImg: Function;
      modalVisible: Function;
      goods: IMap;
      baseSpecId: Number;
      onProductselectSku: Function;
      onEditSubSkuItem: Function;
      editGoods: Function;
    };
  };

  static relaxProps = {
    // 商品基本信息
    goods: 'goods',
    goodsSpecs: 'goodsSpecs',
    goodsList: 'goodsList',
    stockChecked: 'stockChecked',
    marketPriceChecked: 'marketPriceChecked',
    specSingleFlag: 'specSingleFlag',
    spuMarketPrice: ['goods', 'marketPrice'],
    priceOpt: 'priceOpt',
    baseSpecId: 'baseSpecId',
    initStoreCateList: 'initStoreCateList',
    goodsInfos: 'goodsInfos',
    goodsId: 'goodsId',
    editGoods: noop,
    editGoodsItem: noop,
    deleteGoodsInfo: noop,
    updateSkuForm: noop,
    updateChecked: noop,
    synchValue: noop,
    clickImg: noop,
    removeImg: noop,
    modalVisible: noop,
    onProductselectSku: noop,
    onEditSubSkuItem: noop
  };

  render() {
    const WrapperForm = this.WrapperForm;
    const { updateSkuForm } = this.props.relaxProps;
    return (
      <WrapperForm
        // ref={(form) => updateSkuForm(form)}
        {...{ relaxProps: this.props.relaxProps }}
      />
      // <SkuForm />
    );
  }
}

class SkuForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      visible: false,
      pid: '',
      id: ''
    };
  }

  /*static getDerivedStateFromProps(nextProps, prevState) {
    const { goodsList } = nextProps.relaxProps;
    // 当传入的type发生变化的时候，更新state
    goodsList.toJS().map((item,)=>{

      if (item.goodsInfoNo !== prevState.goodsInfoNo) {
        console.log(item.goodsInfoNo,1111);

        return {


        };
      }
    })


    // 否则，对于state不进行任何操作
    return null;
  }*/


  render() {
    const { goodsList } = this.props.relaxProps;
    const columns = this._getColumns();
    return (
      <div style={{ marginBottom: 20 }}>
        {this.state.visible && <ProductTooltipSKU id={this.state.id} pid={this.state.pid} visible={this.state.visible} showModal={this.showProduct} />}
        <Form>
          <Table size="small" rowKey="id" dataSource={goodsList.toJS()} columns={columns} pagination={false} />
        </Form>
      </div>
    );
  }

  showProduct = (res, e, id) => {
    let type = res.type == 1 ? true : false;
    if (e) {
      this.setState({
        pid: e,
        id: id
      });
    }
    this.setState({
      visible: type
    });
  };

  addEAN = (res, e) => {
    let EANList = [];
    this.setState({
      EANList: EANList
    });
  };

  edit = (e) => {}
  _getColumns = () => {
    const { getFieldDecorator } = this.props.form;
    const { goodsSpecs, goodsList, stockChecked, marketPriceChecked, modalVisible, clickImg, removeImg, specSingleFlag, spuMarketPrice, priceOpt, goods, baseSpecId } = this.props.relaxProps;

    let columns: any = List();

    // 未开启规格时，不需要展示默认规格
    if (!specSingleFlag) {
      columns = goodsSpecs
        .map((item) => {
          return {
            title: item.get('specName'),
            dataIndex: 'specId-' + item.get('specId'),
            key: item.get('specId'),
            render: (rowInfo) => {
              return rowInfo;
            }
          };
        })
        .toList();
    }
    columns = columns.unshift({
      title: (
        <div>
          {/* <span
            style={{
              color: 'red',
              fontFamily: 'SimSun',
              marginRight: '4px',
              fontSize: '12px'
            }}
          >
            *
          </span> */}
          <FormattedMessage id="product.image" />
        </div>
      ),
      key: 'img',
      className: 'goodsImg',
      render: (rowInfo) => {
        const images = fromJS(rowInfo.images ? rowInfo.images : []);
        return <ImageLibraryUpload images={images} modalVisible={modalVisible} clickImg={clickImg} removeImg={removeImg} imgCount={1} imgType={1} skuId={rowInfo.id} />;
      }
    });

    columns = columns.unshift({
      title: '',
      key: 'index',
      render: (_text, _rowInfo, index) => {
        return index + 1;
      }
    });

    columns = columns.push({
      title: (
        <div>
          <span
            style={{
              color: 'var(--primary-color)',
              fontFamily: 'SimSun',
              marginRight: '4px',
              fontSize: '12px'
            }}
          >
            *
          </span>
          <FormattedMessage id="product.SKU" />
        </div>
      ),
      key: 'goodsInfoNo',
      render: (rowInfo) => {
        return (
          <Row>
            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('goodsInfoNo_' + rowInfo.id, {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: RCi18n({id:'Product.PleaseInputSKU'})
                    },
                    {
                      min: 1,
                      max: 20,
                      message: RCi18n({id:'Product.Characters'})
                    }
                  ],
                  onChange: this._editGoodsItem.bind(this, rowInfo.id, 'goodsInfoNo'),
                  initialValue: rowInfo.goodsInfoNo
                })(<Input disabled title={rowInfo.goodsInfoNo} style={{ width: '115px' }} />)}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    //Sub-SKU
    columns = columns.push({
      title: (
        <div>
          <p><FormattedMessage id="Product.SubSKU" /></p>
          <p style={{ fontSize: '12px', color: '#ccc' }}><FormattedMessage id="Product.MaximumProducts" /></p>
        </div>
      ),
      key: 'goodsInfoBundleRels',
      render: (rowInfo, record, rowIndex) => {
        return (
          <Row>
            <Col span={16}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('goodsInfoBundleRels' + rowInfo.id, {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: RCi18n({id:'Product.PleaseInputSKU'})
                    },
                    {
                      pattern: ValidConst.number,
                      message: RCi18n({id:'Product.positiveInteger'})
                    }
                  ]
                })(
                  <div className="space-between-align">
                    <div style={{ paddingTop: 6 }}>
                      {' '}
                      {/* <Icon style={{ paddingRight: 8, fontSize: '24px', color: 'var(--primary-color)', cursor: 'pointer' }} type="plus-circle" onClick={(e) => this.showProduct({ type: 1 }, rowInfo.goodsInfoNo, rowInfo.id )} /> */}
                    </div>
                    <div style={{ lineHeight: 2 }}>
                      {record.goodsInfoBundleRels &&
                      record.goodsInfoBundleRels.map((item, index) => {
                        return (
                          <div className="space-between-align" key={item.subGoodsInfoId} style={{ paddingLeft: 5 }}>
                                <span style={{ paddingLeft: 5, paddingRight: 5 }}>{item.subGoodsInfoNo}</span>
                                <InputNumber
                                  disabled
                                  style={{ width: '60px', height: '28px', textAlign: 'center' }}
                                  defaultValue={item.bundleNum}
                                  key={item.subGoodsInfoId}
                                  min={1}
                                  onChange={(e) => this._editGoodsItem(rowInfo.id, 'goodsInfoBundleRels', e, rowIndex, item.subGoodsInfoId)}
                                  onFocus={() => this.onfocus()}
                                  onBlur={() => this.onblur()}
                                />
                                {/* <a style={{ paddingLeft: 5 }} className="iconfont iconDelete" onClick={() => this.onDel(record, item.subGoodsInfoId)}></a> */}
                              </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    //External SKU
    columns = columns.push({
      title: <FormattedMessage id="Product.ExternalSKU" />,
      key: 'externalSku',
      render: (rowInfo) => {
        return (
          <Row>
            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('externalSku' + rowInfo.id, {
                  rules: [
                    /*{
                      required: true,
                      message: 'Please input EAN code'
                    },*/
                    /*{
                      pattern: ValidConst.noMinus,
                      message: 'Please enter the correct value'
                    }*/
                  ],
                  onChange: this._editGoodsItem.bind(this, rowInfo.id, 'externalSku'),
                  initialValue: rowInfo.externalSku
                })(<Input disabled title={rowInfo.externalSku} style={{ width: '116px' }} maxLength={45} onFocus={() => this.onfocus()} onBlur={() => this.onblur()} />)}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    //EAN
    columns = columns.push({
      title: <FormattedMessage id="Product.EAN" />,
      key: 'goodsInfoBarcode',
      render: (rowInfo) => {
        return (
          <Row>
            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('goodsInfoBarcode' + rowInfo.id, {
                  rules: [
                    /*{
                      required: true,
                      message: 'Please input EAN code'
                    },*/
                    /*{
                      pattern: ValidConst.noMinus,
                      message: 'Please enter the correct value'
                    }*/
                  ],
                  onChange: this._editGoodsItem.bind(this, rowInfo.id, 'goodsInfoBarcode'),
                  initialValue: rowInfo.goodsInfoBarcode
                })(<Input disabled title={rowInfo.goodsInfoBarcode} style={{ width: '116px' }} onFocus={() => this.onfocus()} onBlur={() => this.onblur()} />)}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    columns = columns.push({
      title: <FormattedMessage id="Product.Weightvalue" />,
      key: 'goodsInfoWeight',
      render: (rowInfo) => {
        return (
          <Row>
            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('goodsInfoWeight' + rowInfo.id, {
                  rules: [
                    {
                      required: true,
                      message: RCi18n({id:'Product.Inputweightvalue'})
                    }
                    /*{
                      pattern: ValidConst.noMinus,
                      message: 'Please enter the correct value'
                    }*/
                  ],
                  onChange: this._editGoodsItem.bind(this, rowInfo.id, 'goodsInfoWeight'),
                  initialValue: rowInfo.goodsInfoWeight || 0
                })(<InputNumber disabled style={{ width: '121px' }} min={0} onFocus={() => this.onfocus()} onBlur={() => this.onblur()} onKeyUp={(e) => this.noMinus(e)} formatter={limitDecimals} parser={limitDecimals} />)}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    columns = columns.push({
      title: <FormattedMessage id="Product.Weightunit" />,
      key: 'goodsInfoUnit',
      render: (rowInfo) => {
        return (
          // <Select onChange = {(e) => this._editGoodsItem(rowInfo.id, 'goodsInfoUnit', e)}>
          //   <Option value="kg">kg</Option>
          //   <Option value="g">g</Option>
          //   <Option value="lb">lb</Option>
          // </Select>
         /* <select className="ant-input" value={rowInfo.goodsInfoUnit}  onChange = {(e) => this._editGoodsItem(rowInfo.id, 'goodsInfoUnit', e)}>
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="lb">lb</option>
          </select>*/

         /* <Row>
            <Col span={6}>
              <Select defaultValue={rowInfo.goodsInfoUnit ? rowInfo.goodsInfoUnit : 'kg'}
                      value={rowInfo.goodsInfoUnit}
                      onChange = {(e) => this._editGoodsItem(rowInfo.id, 'goodsInfoUnit', e)}
                      getPopupContainer={() => document.getElementById('page-content')} style={{ width: '81px' }} >
                <Option value="kg">kg</Option>
                <Option value="g">g</Option>
                <Option value="lb">lb</Option>
              </Select>


            </Col>
          </Row>*/
          <Row>
            <Col span={6}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('goodsInfoUnit' + rowInfo.id, {
                  onChange: (e) => this._editGoodsItem(rowInfo.id, 'goodsInfoUnit', e),
                  initialValue: rowInfo.goodsInfoUnit ? rowInfo.goodsInfoUnit : 'kg'
                })(
                  <Select disabled getPopupContainer={() => document.getElementById('page-content')} style={{ width: '81px' }}
                  onFocus={() => this.onfocus()} onBlur={() => this.onblur()}>
                    <Option value="kg">kg</Option>
                    <Option value="g">g</Option>
                    <Option value="lb">lb</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    /*columns = columns.push({
      title: 'Pack size',
      key: 'packSize',
      render: (rowInfo) => {
        return (
          <Row>
            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('packSize_' + rowInfo.id, {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: 'Please input packSize code'
                    },
                    {
                      min: 1,
                      max: 20,
                      message: '1-20 characters'
                    }
                  ],
                  onChange: this._editGoodsItem.bind(this, rowInfo.id, 'packSize'),
                  initialValue: rowInfo.packSize
                })(<Input style={{ width: '115px' }} />)}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });*/

    columns = columns.push({
      title: (
        <div>
         <FormattedMessage id="Product.Subscription" />
        </div>
      ),
      key: 'subscriptionStatus',
      render: (rowInfo) => {
        return (
          <Row>
            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                  <Select 
                    //disabled={goods.get('subscriptionStatus') == 0 ? true : false || goodsList.toJS().length == 1? true : false }
                    disabled
                    getPopupContainer={() => document.getElementById('page-content')}
                    style={{ width: '81px' }}
                    onFocus={() => this.onfocus()}
                    onBlur={() => this.onblur()}
                    value={rowInfo.subscriptionStatus}
                    onChange={(e) => this._editGoodsItem(rowInfo.id, 'subscriptionStatus', e)}
                  >
                    <Option value={1}>Y</Option>
                    <Option value={0}>N</Option>
                  </Select>
              </FormItem>
            </Col>
          </Row>
        );
      }
    });


    columns = columns.push({
      title:
        <div>
         <FormattedMessage id="Product.subscriptionType"/>
        </div>
      ,
      key: 'promotions',
      render: (rowInfo) => {
        return (
          <Row>
            <Col span={12} key={goods.get('promotions')}>
              <FormItem style={styles.tableFormItem}>
                <Select  onChange={ (e) => this._editGoodsItem(rowInfo.id, 'promotions', e)}
                         style={{ width: 100 }}
                         defaultValue={rowInfo.promotions}
                         getPopupContainer={() => document.getElementById('page-content')}
                         //disabled={goods.get('promotions') == 'autoship'}
                         disabled
                         onFocus={() => this.onfocus()}
                         onBlur={() => this.onblur()}
                >
                  <Option value='autoship'><FormattedMessage id="Product.Auto ship" /></Option>
                  <Option value='club'><FormattedMessage id="Product.Club" /></Option>
                  <Option value='individual'><FormattedMessage id="Product.Individual" /></Option>
                </Select>

              </FormItem>
            </Col>
            {/*<Col span={12} key={goods.get('promotions')}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('promotions' + rowInfo.id, {
                  onChange: (e) => this._editGoodsItem(rowInfo.id, 'promotions', e),
                  initialValue: rowInfo.promotions
                })(
                  <Select style={{ width: 100 }}  getPopupContainer={() => document.getElementById('page-content')}  placeholder="please select type" disabled={goods.get('promotions') == 'autoship'} >
                    <Option value='club'>Club</Option>
                    <Option value='autoship'>Auto ship</Option>
                  </Select>
                )}

              </FormItem>
            </Col>*/}
          </Row>
        );
      }
    });

    columns = columns.push({
      title: (
        <div style={{marginRight: '81px'}}><FormattedMessage id="Product.On/Off shelves" /></div>
      ),
      key: 'addedFlag',
      render: (rowInfo) => {

        return (
          <Col span={8}>
            <FormItem style={styles.tableFormItem}>
              {goodsList.toJS().length == 1 ? ( goods.get('addedFlag') == 0 ? ( <span className="icon iconfont iconOnShelves" style={{ fontSize: 20, color: "#cccccc" }}></span>) : (<div>
                <span className="icon iconfont iconOffShelves" style={{ fontSize: 20, color: "#cccccc" }}></span>
              </div>) ) : (<>
                  {goods.get('addedFlag') == 0 ? ( <span className="icon iconfont iconOnShelves" style={{ fontSize: 20, color: "#cccccc" }}></span>) : (
                    <>
                      {rowInfo.addedFlag == 1 ? (
                        <div 
                          //onClick={() => this._editGoodsItem(rowInfo.id, 'addedFlag', 0)}
                        >
                          <span className="icon iconfont iconOffShelves" style={{ fontSize: 20, color: "#E1021A" }}></span>
                        </div>
                      ) : null}
                      {rowInfo.addedFlag == 0? (
                        <div 
                          //onClick={() => this._editGoodsItem(rowInfo.id, 'addedFlag', 1)}
                        >
                          <span className="icon iconfont iconOnShelves" style={{ fontSize: 20, color: "#E1021A" }}></span>
                        </div>
                      ) : null}</>)}
                </>
              )}
            </FormItem>
          </Col>
        );
      }
    });

    return columns.toJS();
  };
  _handleChange = (value) => {
    sessionStorage.setItem('baseSpecId', value);
    this._editGoodsItem(null, 'baseSpecId', value);
  };
  _deleteGoodsInfo = (id: string) => {
    const { deleteGoodsInfo } = this.props.relaxProps;
    deleteGoodsInfo(id);
  };

  /**
   * 检查文件格式
   */
  _checkUploadFile = (file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (fileName.endsWith('.jpg') || fileName.endsWith('.png') || fileName.endsWith('.gif') || fileName.endsWith('.jpeg')) {
      if (file.size < FILE_MAX_SIZE) {
        return true;
      } else {
        message.error(RCi18n({id:'Product.lessThan2M'}));
        return false;
      }
    } else {
      message.error(RCi18n({id:'Product.FileFormatError'}));
      return false;
    }
  };

  /**
   * 修改商品属性
   */
  _editGoodsItem = (id: string, key: string, e: any, rowIndex?: number, subGoodsInfoId?: any) => {
    const { editGoodsItem, synchValue, editGoods, goodsList } = this.props.relaxProps;
    const checked = this.props.relaxProps[`${key}Checked`];
    if (e && e.target) {
      e = e.target.value;
    }


    if (key == "goodsInfoBundleRels") {
      if(rowIndex !== undefined) {
        let curRow = goodsList.toJS()[rowIndex];
        curRow.goodsInfoBundleRels?.forEach(item => {
          if(item.subGoodsInfoId === subGoodsInfoId) {
            item.bundleNum = e;
          }
        })
        this._calculatePrice(curRow);
        editGoodsItem(id, key, curRow.goodsInfoBundleRels);
      }
    }else {
      editGoodsItem(id, key, e);
    }


    if(key == "addedFlag") {
      if(goodsList.toJS().length >1) {
        let goods = Map({
          ['addedFlag']: fromJS(2)
        });
        editGoods(goods);
      }
    }

    if (key == 'promotions' || key == 'goodsInfoBundleRels' ) {
      // 是否同步库存
      if (checked) {
        // 修改store中的库存或市场价
        synchValue(key);
        // form表单initialValue方式赋值不成功，这里通过setFieldsValue方法赋值
        const fieldsValue = this.props.form.getFieldsValue();
        // 同步库存/市场价
        let values = {};
        Object.getOwnPropertyNames(fieldsValue).forEach((field) => {
          if (field.indexOf(`${key}_`) === 0) {
            values[field] = e;
          }
        });
        // update
        this.props.form.setFieldsValue(values);
      }
    }
  };

  /**
   * 修改某一行商品Sub-SKU个数及其bundle数量时，计算 marketPrice
   * @param row
   */

  _calculatePrice = (row) => {
    let {editGoodsItem} = this.props.relaxProps;
    let id = row.id
    let subGoods = row.goodsInfoBundleRels; 
    let subscriptionPrice = 0;
    let stockArr = [];
    let marketPrice = subGoods.reduce((sum, item) => {
      subscriptionPrice += item.subscriptionPrice * item.bundleNum;
      stockArr.push(Math.round(item.subStock / item.bundleNum));
      return sum + item.marketPrice * item.bundleNum;
    }, 0);
    // 如果是保存过的，就不修改价格，只修改库存
    if(row.goodsId) {
      editGoodsItem(id, 'stock', Math.min(...stockArr));
      return;
    }
    editGoodsItem(id, 'marketPrice', marketPrice);
    editGoodsItem(id, 'subscriptionPrice', subscriptionPrice);
    editGoodsItem(id, 'stock', Math.min(...stockArr));
  };

  _editSubSkuItem = (id: string, key: string, e: any) => {
    const { onEditSubSkuItem } = this.props.relaxProps;

    onEditSubSkuItem(e);
  };

  /**
   * 修改商品图片属性
   */
  _editGoodsImageItem = (id: string, key: string, { fileList }) => {
    let msg = null;
    if (fileList != null) {
      fileList.forEach((file) => {
        if (file.status == 'done' && file.response != null && file.response.message != null) {
          msg = file.response.message;
        }
      });

      if (msg != null) {
        //如果上传失败，只过滤成功的图片
        message.error(msg);
        fileList = fileList.filter((file) => file.status == 'done' && file.response != null && file.response.message == null);
      }
    }
    const { editGoodsItem } = this.props.relaxProps;
    editGoodsItem(id, key, fromJS(fileList));
  };

  /**
   * 同步库存
   */
  _synchValue = async (e, key) => {
    const { updateChecked, goodsList } = this.props.relaxProps;
    await updateChecked(key, e.target.checked);
    const goodsInfo = goodsList.get(0);
    if (goodsInfo) {
      this._editGoodsItem(goodsInfo.get('id'), key, goodsInfo.get(key));
    }
  };

  onDel = (row, subGoodsInfoId) => {
    const { editGoodsItem } = this.props.relaxProps;
    let goodsInfoBundleRels = row.goodsInfoBundleRels.filter(item => item.subGoodsInfoId !== subGoodsInfoId);
    row.goodsInfoBundleRels = goodsInfoBundleRels;
    this._calculatePrice(row);
    editGoodsItem(row.id, 'goodsInfoBundleRels', goodsInfoBundleRels);
  };

  noMinus = (e) => {
    let val = e.target.value;
    if (val.indexOf('.') != -1) {
      let str = val.substr(val.indexOf('.') + 1);
      if (str.indexOf('.') != -1) {
        val = val.substr(0, val.indexOf('.') + str.indexOf('.') + 1);
      }
    }
    e.target.value = val.replace(/[^\d^\.]+/g, '');
  };


  getArrDifference = (arr1, arr2) => {
    return arr1.concat(arr2).filter(function(v, i, arr) {
      return arr.indexOf(v) === arr.lastIndexOf(v);
    });
  }

  onfocus = () => {
    this.setState({
      specType: true
    })
  }

  onblur = () => {
    this.setState({
      specType: false
    })
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
  tableFormItem: {
    marginBottom: '0px',
    padding: '2px'
  }
};
