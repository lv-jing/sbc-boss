import * as React from 'react';
import { Relax } from 'plume2';
import {Table, Input, Row, Col, Checkbox, InputNumber, Form, Button, message, Tooltip, Icon, Select, Popconfirm} from 'antd';
import { IList, IMap } from 'typings/globalType';
import {fromJS, List, Map} from 'immutable';
import {AuthWrapper, cache, noop, ValidConst} from 'qmkit';
import ImageLibraryUpload from './image-library-upload';
import { FormattedMessage } from 'react-intl';
import ProductTooltip from './productTooltip';
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

  props: {
    relaxProps?: {
      goodsSpecs: IList;
      goodsList: IList;
      stockChecked: boolean;
      marketPriceChecked: boolean;
      specSingleFlag: boolean;
      spuMarketPrice: number;
      priceOpt: number;
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
    editGoods: noop,
    editGoodsItem: noop,
    deleteGoodsInfo: noop,
    updateSkuForm: noop,
    updateChecked: noop,
    synchValue: noop,
    clickImg: noop,
    removeImg: noop,
    modalVisible: noop
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(SkuForm);
    this.state = {
      visible: false
    };
  }

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
      visible: false
    };
  }

  render() {
    const { goodsList, goods, goodsSpecs, baseSpecId } = this.props.relaxProps;
    // const {  } = this.state
    const columns = this._getColumns();
    return (
      <div style={{ marginBottom: 20 }}>
        {this.state.visible == true ? <ProductTooltip visible={this.state.visible} showModal={this.showProduct} /> : <React.Fragment />}
        <Form>
          <Table size="small" rowKey="id" dataSource={goodsList.toJS()} columns={columns} pagination={false} />
        </Form>
      </div>
    );
  }

  showProduct = (res) => {
    this.setState({
      visible: res
    });
  };
  _getColumns = () => {
    const { getFieldDecorator } = this.props.form;
    const { goodsSpecs, stockChecked, marketPriceChecked, modalVisible, clickImg, removeImg, specSingleFlag, spuMarketPrice, priceOpt, goods, baseSpecId, goodsList } = this.props.relaxProps;
    let columns: any = List();

    // 未开启规格时，不需要展示默认规格
    if (!specSingleFlag) {

      columns = goodsSpecs
        .map((item, i) => {
          return {
            title: item.get('specName'),
            dataIndex: 'specId-' + item.get('specId'),
            key: item.get('specId'),
            render: (rowInfo) => {
              return rowInfo
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
              color: 'red',
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
            <Col span={8}>
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
                      message: '1-20 characters'
                    }
                  ],
                  onChange: this._editGoodsItem.bind(this, rowInfo.id, 'goodsInfoNo'),
                  initialValue: rowInfo.goodsInfoNo
                })(<Input disabled title={rowInfo.goodsInfoNo} style={{ width: '116px' }} />)}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    //External SKU
    columns = columns.push({
      title: RCi18n({id:'Product.ExternalSKU'}),
      key: 'externalSku',
      render: (rowInfo) => {
        return (
          <Row>
            <Col span={8}>
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
                })(<Input disabled title={rowInfo.externalSku} style={{ width: '116px' }} maxLength={45}/>)}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    //EAN
    columns = columns.push({
      title: RCi18n({id:'Product.EAN'}),
      key: 'goodsInfoBarcode',
      render: (rowInfo) => {
        return (
          <Row>
            <Col span={8}>
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
                })(<Input disabled title={rowInfo.goodsInfoBarcode} style={{ width: '116px' }} />)}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    columns = columns.push({
      title: RCi18n({id:'Product.Weightvalue'}),
      key: 'goodsInfoWeight',
      render: (rowInfo) => {
        return (
          <Row>
            <Col span={8}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('goodsInfoWeight' + rowInfo.id, {
                  rules: [
                    {
                      required: true,
                      message: RCi18n({id:'Product.Inputweightvalue'})
                    }
                    /*{
                      pattern: ValidConst.number,
                      message: 'Please enter the correct value'
                    }*/
                  ],
                  onChange: this._editGoodsItem.bind(this, rowInfo.id, 'goodsInfoWeight'),
                  initialValue: rowInfo.goodsInfoWeight || 0
                })(<InputNumber disabled formatter={limitDecimals} parser={limitDecimals} style={{ width: '116px' }} min={0} onKeyUp={(e) => this.noMinus(e)} />)}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    columns = columns.push({
      title: RCi18n({id:'Product.Weightunit'}),
      key: 'goodsInfoUnit',
      render: (rowInfo) => {
        return (
          <Row>
            <Col span={6}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('goodsInfoUnit' + rowInfo.id, {
                  onChange: (e) => this._editGoodsItem(rowInfo.id, 'goodsInfoUnit', e),
                  initialValue: rowInfo.goodsInfoUnit !== null ? rowInfo.goodsInfoUnit : 'kg'
                })(
                  <Select disabled getPopupContainer={() => document.getElementById('page-content')} style={{ width: '60px' }} >
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

    /*columns = columns.push({
      title: <div>Description</div>,
      key: 'description',
      render: (rowInfo) => (
        <Row>
          <Col span={12}>
            <FormItem style={styles.tableFormItem}>
              {getFieldDecorator('description_' + rowInfo.id, {
                rules: [
                  // {
                  //   pattern: ValidConst.number,
                  //   message: 'Please enter the correct value'
                  // }
                ],
                onChange: this._editGoodsItem.bind(this, rowInfo.id, 'description'),
                initialValue: rowInfo.description
              })(<TextArea rows={2} style={{ width: '300px' }} disabled={rowInfo.description === 0} />)}
            </FormItem>
          </Col>
        </Row>
      )
    });*/

    columns = columns.push({
      title: (
        <div style={{
          marginRight: '81px',
        }}>
          <FormattedMessage id="Product.Subscription" />
        </div>
      ),
      key: 'subscriptionStatus',
      render: (rowInfo) => {
        return (
          <Row>
            <Col span={8}>
              <FormItem style={styles.tableFormItem}>
                  <Select 
                    value={rowInfo.subscriptionStatus}
                    onChange = {(e) => this._editGoodsItem(rowInfo.id, 'subscriptionStatus', e)}
                    //disabled={goods.get('subscriptionStatus') === 0 || goodsList.toJS().length == 1} 
                    disabled
                    getPopupContainer={() => document.getElementById('page-content')} 
                    style={{ width: '81px' }} 
                  >
                    <Option value={1}>Y</Option>
                    <Option value={0}>N</Option>
                  </Select>
              </FormItem>
            </Col>
          </Row>
        )}
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
                        // disabled={goods.get('promotions') == 'autoship'} 
                        disabled
                >
                  <Option value='autoship'><FormattedMessage id="Product.Auto ship" /></Option>
                  <Option value='club'><FormattedMessage id="Product.Club" /></Option>
                  <Option value='individual'><FormattedMessage id="Product.Individual" /></Option>
                </Select>

              </FormItem>
            </Col>
            {/*<Col span={12}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('promotions' + rowInfo.id, {
                  onChange: (e) => this._editGoodsItem(rowInfo.id, 'promotions', e),
                  initialValue:  rowInfo.promotions || "club"
                })(
                  <Select style={{ width: 100 }} getPopupContainer={() => document.getElementById('page-content')}  placeholder="please select type" disabled={goods.get('promotions') == 'autoship'} >
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
          <Row style={{marginRight: '81px'}}>
            <Col span={8}>
              <FormItem style={styles.tableFormItem}>
                {goodsList.toJS().length == 1 ? ( goods.get('addedFlag') == 0 ? ( <span className="icon iconfont iconOnShelves" style={{ fontSize: 20, color: "#cccccc" }}></span>): (<div>
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
          </Row>
        );
      }
    });


    /* let a = columns.toJS();
    let b = a.splice(a.length - 4, 1);
    a.splice(3, 0, b[0]);*/
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

  onAddedFlag = (id: string) => {
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
  _editGoodsItem = (id: string, key: string, e: any) => {
    const { editGoodsItem, synchValue, editGoods, goodsList } = this.props.relaxProps;
    const checked = this.props.relaxProps[`${key}Checked`];
    if (e && e.target) {
      e = e.target.value;
    }

    editGoodsItem(id, key, e);

    if(key == "addedFlag") {
      if(goodsList.toJS().length >1) {
        let goods = Map({
          ['addedFlag']: fromJS(2)
        });
        editGoods(goods);
      }
    }

    if (key == 'stock' || key == 'marketPrice' || key == 'subscriptionPrice') {
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

  noMinus = (e) => {
    let val = e.target.value;
    //限制只能输入一个小数点
    if (val.indexOf('.') != -1) {
      let str = val.substr(val.indexOf('.') + 1);
      if (str.indexOf('.') != -1) {
        val = val.substr(0, val.indexOf('.') + str.indexOf('.') + 1);
      }
    }
    e.target.value = val.replace(/[^\d^\.]+/g, '');
  };
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
