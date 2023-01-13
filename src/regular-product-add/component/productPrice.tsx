import * as React from 'react';
import { Relax } from 'plume2';
import { Table, Input, Row, Col, Checkbox, InputNumber, Form, Button, message, Tooltip, Icon, Select } from 'antd';
import { IList, IMap } from 'typings/globalType';
import { fromJS, List } from 'immutable';
import { noop, ValidConst, cache } from 'qmkit';
import ImageLibraryUpload from './image-library-upload';
import { FormattedMessage } from 'react-intl';
import { RCi18n } from 'qmkit';

const FormItem = Form.Item;
const { Option } = Select;
const FILE_MAX_SIZE = 2 * 1024 * 1024;

const limitDecimals = (value: string | number): string => {
  const reg = /^(\-)*(\d+)\.(\d\d\d\d\d).*$/;
  if(typeof value === 'string') {
    return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
  } else if (typeof value === 'number') {
    return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
  } else {
    return ''
  }
};

@Relax
export default class ProductPrice extends React.Component<any, any> {
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
      getGoodsId: any;
      selectedBasePrice: any;
      setSelectedBasePrice: Function;
      editGoodsItem: Function;
      deleteGoodsInfo: Function;
      updateSkuForm: Function;
      updateChecked: Function;
      synchValue: Function;
      addSkUProduct: any;
      clickImg: Function;
      removeImg: Function;
      modalVisible: Function;
      goods: IMap;
      baseSpecId: Number;
      subscriptionStatus: any;
      updateBasePrice: Function;
      updateAllBasePrice: Function;
      setDefaultBaseSpecId: Function;
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
    subscriptionStatus: 'subscriptionStatus',
    getGoodsId: 'getGoodsId',
    selectedBasePrice: 'selectedBasePrice',
    addSkUProduct: 'addSkUProduct',
    editGoodsItem: noop,
    deleteGoodsInfo: noop,
    updateSkuForm: noop,
    updateChecked: noop,
    synchValue: noop,
    clickImg: noop,
    removeImg: noop,
    modalVisible: noop,
    updateBasePrice: noop,
    updateAllBasePrice: noop,
    setDefaultBaseSpecId: noop,
    setSelectedBasePrice: noop
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(SkuForm);
    this.state = {};
  }
  componentDidMount() {
    const { setDefaultBaseSpecId, getGoodsId } = this.props.relaxProps;
    // if (!getGoodsId) {
    //   setDefaultBaseSpecId();
    // }
  }
  render() {
    const WrapperForm = this.WrapperForm;
    const { goods } = this.props.relaxProps;

    return (
      <WrapperForm
        // ref={(form) => updateSkuForm(form)}
        {...{ relaxProps: this.props.relaxProps }}
      />
      // <SkuForm />
    );
  }
}
let precisions = 2
class SkuForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      priceType: ''
    };
  }

  onPriceType = (res) => {
    this.setState({
      priceType: res
    });
  };

  componentDidMount() {
    //this._handleBasePriceChange
    const { goodsList } = this.props.relaxProps;
  }

  render() {
    const { goodsList, goods, goodsSpecs, baseSpecId, addSkUProduct } = this.props.relaxProps;
    // const {  } = this.state


    const columns = this._getColumns();
    return (
      <div style={{ marginBottom: 20 }}>
        <Form>
          <Table size="small" rowKey="id" dataSource={goodsList.toJS()} columns={columns} pagination={false} />
        </Form>
      </div>
    );
  }

  _getColumns = () => {
    const { getFieldDecorator } = this.props.form;
    const { goodsSpecs, addSkUProduct, marketPriceChecked, specSingleFlag, spuMarketPrice, priceOpt, goods, baseSpecId } = this.props.relaxProps;
    let columns: any = List();

    // 未开启规格时，不需要展示默认规格
    if (!specSingleFlag) {
      if (baseSpecId) {
        const _goodsSpecs = goodsSpecs.toJS();
        let selectedItem;
        _goodsSpecs.forEach((item) => {
          if (item.mockSpecId === baseSpecId) {
            selectedItem = item;
          }
        });
        if (selectedItem) {
          columns = columns.push({
            title: sessionStorage.getItem(cache.SYSTEM_GET_WEIGHT),
            dataIndex: 'specId-' + selectedItem.specId,
            key: selectedItem.specId,
            render: (rowInfo) => {
              return (
                <Row>
                  <Col span={12}>
                    <FormItem style={{ paddingTop: 28 }}>{rowInfo}</FormItem>
                  </Col>
                </Row>
              );
            }
          });
        }
      }
      // else {
      //   columns = goodsSpecs
      //     .map((item) => {
      //       return {
      //         title: item.get('specName'),
      //         dataIndex: 'specId-' + item.get('specId'),
      //         key: item.get('specId')
      //       };
      //     })
      //     .toList();
      // }
    }

    columns = columns.unshift({
      title: '',
      key: 'index' + 1,
      render: (_text, _rowInfo, index) => {
        return index + 1;
      }
    });

    columns = columns.push({
      title: <FormattedMessage id="product.SKU" />,
      key: 'goodsInfoNo' + 'index',
      render: (rowInfo) => {
        return (
          <Row>
            <Col span={12}>
              <FormItem style={{ paddingTop: 28 }}>{rowInfo.goodsInfoNo}</FormItem>
            </Col>
          </Row>
        );
      }
    });
    columns = columns.push({
      title: <FormattedMessage id="Product.Purchasetype" />,
      key: 'index',
      render: (rowInfo) => (
        <Row>
          <Col span={12}>
            <FormItem style={styles.tableFormItem}>
              <div>
                {goods.get('subscriptionStatus') == 1 ? (
                  <div>
                      <span>
                        <FormattedMessage id="Product.OneOff" />
                      </span>
                    {rowInfo.subscriptionStatus != 0 || rowInfo.subscriptionStatus != null ? (
                      <p>
                        <span><FormattedMessage id="Product.Subscription" /></span>
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <div>
                    <span><FormattedMessage id="Product.OneOff" /></span>
                  </div>
                )}
              </div>
            </FormItem>
          </Col>
        </Row>
      )
    });

    columns = columns.push({
      title: (
        <div>
          <FormattedMessage id="product.purchasePrice" />
        </div>
      ),
      key: 'linePrice',
      render: (rowInfo) => (
        <Row>
          <Col span={12}>
            <div className="flex-start-align">
              <span style={{paddingRight:'3px'}}>{sessionStorage.getItem('s2b-supplier@systemGetConfig:')}</span>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('linePrice_' + rowInfo.id, {
                  // rules: [
                  //   {
                  //     pattern: ValidConst.number,
                  //     message: 'Please enter the correct value'
                  //   }
                  // ],
                  onChange: this._editGoodsItem.bind(this, rowInfo.id, 'linePrice'),
                  initialValue: rowInfo.linePrice || 0
                })(<InputNumber disabled min={0} max={9999999.99} precision={2}
                                // step={0.01}
                                //formatter={(value) => `${sessionStorage.getItem('s2b-supplier@systemGetConfig:') ? sessionStorage.getItem('s2b-supplier@systemGetConfig:') : ''} ${value}`}
                />)}
              </FormItem>
            </div>
          </Col>
        </Row>
      )
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
          <FormattedMessage id="product.marketPrice" />
          <br />
          {/*<Checkbox disabled={priceOpt === 0} checked={marketPriceChecked} onChange={(e) => this._synchValue(e, 'marketPrice')}>
            <FormattedMessage id="allTheSame" />
            &nbsp;
            <Tooltip placement="top" title={'After checking, all SKUs use the same market price'}>
              <a style={{ fontSize: 14 }}>
                <Icon type="question-circle-o" />
              </a>
            </Tooltip>
          </Checkbox>*/}
        </div>
      ),
      key: 'marketPrice',
      render: (rowInfo) => {

        let marketPrice =  rowInfo.marketPrice ? rowInfo.marketPrice : 0
        let subscriptionPrice =  rowInfo.subscriptionPrice ? rowInfo.subscriptionPrice : 0


        //let marketPrice = rowInfo.marketPrice
        //var len = ("" + marketPrice).replace(/^\d+\./, '').length;
        //marketPrice = Number(this.formatNum(marketPrice))
       /* if(String(marketPrice).indexOf(".") == -1){
            marketPrice = (marketPrice * addSkUProduct[0].targetGoodsIds[0].bundleNum).toFixed(2)
        }*/
        /*if ( rowInfo.marketPrice.toString().split(".")[1].length <= 4) {
          marketPrice = marketPrice.toFixed(rowInfo.marketPrice.toString().split(".")[1].length)
        }else {
          marketPrice = marketPrice.toFixed(4)
        }*/

        //marketPrice = Number(marketPrice.toString().match(/^\d+(?:\.\d{0,2})?/))
       // console.log(marketPrice,11111);

        return (
          <Row>
            <Col span={12}>
              {goods.get('subscriptionStatus') == 1 ? (
                <div>
                  <div className="flex-start-align">
                    <span style={{paddingRight:'3px'}}>{sessionStorage.getItem('s2b-supplier@systemGetConfig:')}</span>
                    <FormItem style={styles.tableFormItem}>
                      {getFieldDecorator('marketPrice_' + rowInfo.id, {
                        rules: [
                          {
                            required: true,
                            message: RCi18n({id:'Product.inputMarketPrice'})
                          }
                        ],

                        onChange: (e) => this._editGoodsItem(rowInfo.id, 'marketPrice', e, rowInfo.subscriptionStatus === 0 ? false : true),
                        initialValue: marketPrice
                      })(
                        <InputNumber
                          min={0}
                          max={9999999.99}
                          //disabled={(rowInfo.index > 1 && marketPriceChecked) || (!rowInfo.aloneFlag && priceOpt == 0 && spuMarketPrice)}
                          disabled
                          formatter={limitDecimals}
                          parser={limitDecimals}
                          // step={0.01}
                        />
                      )}
                    </FormItem>
                  </div>
                  {rowInfo.subscriptionStatus != 0 || rowInfo.subscriptionStatus != null ? (
                    <div className="flex-start-align">
                      <span style={{paddingRight:'3px'}}>{sessionStorage.getItem('s2b-supplier@systemGetConfig:')}</span>
                      <FormItem style={styles.tableFormItem}>
                        {getFieldDecorator('subscriptionPrice_' + rowInfo.id, {
                          rules: [
                            {
                              required: true,
                              message: RCi18n({id:'Product.subscriptionPrice'})
                            },
                            /*{
                              validator: (_rule, value, callback) => {
                                if (rowInfo.subscriptionStatus === 1) {
                                  if (value === 0) {
                                    callback('Subscription price cannot be zero');
                                  }
                                }

                              }
                            }*/
                          ],
                          onChange: this._editGoodsItem.bind(this, rowInfo.id, 'subscriptionPrice'),
                          initialValue: subscriptionPrice
                        })(
                          <InputNumber
                            min={0}
                            max={9999999.99}
                            //precision={2}
                            //disabled={rowInfo.subscriptionStatus === 0}
                            disabled
                            formatter={limitDecimals}
                            parser={limitDecimals}
                            // step={0.01}
                            //formatter={(value) => `${sessionStorage.getItem('s2b-supplier@systemGetConfig:') ? sessionStorage.getItem('s2b-supplier@systemGetConfig:') : ''} ${value}`}
                          />
                        )}
                      </FormItem>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="flex-start-align">
                  <span style={{paddingRight:'3px'}}>{sessionStorage.getItem('s2b-supplier@systemGetConfig:')}</span>
                  <FormItem style={styles.tableFormItem}>
                    {getFieldDecorator('marketPrice_' + rowInfo.id, {
                      rules: [
                        {
                          required: true,
                          message: RCi18n({id:'Product.inputMarketPrice'})
                        }
                      ],

                      onChange: (e) => this._editGoodsItem(rowInfo.id, 'marketPrice', e, false),
                      initialValue: marketPrice
                    })(
                      <InputNumber
                        min={0}
                        max={9999999.99}
                        //disabled={(rowInfo.index > 1 && marketPriceChecked) || (!rowInfo.aloneFlag && priceOpt == 0 && spuMarketPrice)}
                        disabled
                        formatter={limitDecimals}
                        parser={limitDecimals}
                        // step={0.01}
                      />
                    )}
                  </FormItem>
                </div>
              )}
            </Col>
          </Row>
        );
      }
    });
    columns = columns.push({
      title: (
        <div>
         <FormattedMessage id="Product.Baseprice" />
          {/*<Select value={selectedBasePrice} onChange={this._handleBasePriceChange} allowClear>
            {goodsSpecs.map((item, i) =>
              item.get('specName') === sessionStorage.getItem(cache.SYSTEM_GET_WEIGHT) && item.get('specValues').size > 0 ? (
                <Option key={i} value={item.get('mockSpecId')}>
                  {sessionStorage.getItem(cache.SYSTEM_GET_WEIGHT)}
                </Option>
              ) : null
            )}
            <Option value={'weightValue'}>Weight value</Option>
            <Option value={'None'}>None</Option>
          </Select>*/}
        </div>
      ),
      key: 'basePrice',
      render: (rowInfo, a, b) => {
        const { goodsList, goods } = this.props.relaxProps;
        if (goodsList.toJS()[b].goodsInfoWeight) {
          this._handleBasePriceChange(goodsList.toJS()[b].goodsInfoWeight);
        } else {
          this._handleBasePriceChange('None');
        }

        return (
          <Row>
            <Col span={12}>
              {goods.get('subscriptionStatus') == 1 ? (
                <FormItem style={styles.tableFormItem}>
                  {getFieldDecorator('basePrice_' + rowInfo.id, {
                    rules: [
                      {
                        pattern: ValidConst.number,
                        message: RCi18n({id:'Product.PleaseEnterTheCorrect'})
                      }
                    ],
                    onChange: this._editGoodsItem.bind(this, rowInfo.id, 'basePrice'),
                    initialValue: rowInfo.basePrice || 0
                  })(
                    goodsList.toJS()[b].goodsInfoWeight != 0 ? (
                      <div>
                        <p>{rowInfo.basePrice ? sessionStorage.getItem('s2b-supplier@systemGetConfig:') + rowInfo.basePrice : ''}</p>
                        <p>{rowInfo.subscriptionBasePrice ? sessionStorage.getItem('s2b-supplier@systemGetConfig:') + ' ' + rowInfo.subscriptionBasePrice : ''}</p>
                      </div>
                    ) : (
                      <p/>
                    )
                  )}
                </FormItem>
              ) : (
                <FormItem style={styles.tableFormItem}>
                  {getFieldDecorator('basePrice_' + rowInfo.id, {
                    rules: [
                      {
                        pattern: ValidConst.number,
                        message: RCi18n({id:'Product.PleaseEnterTheCorrect'})
                      }
                    ],
                    onChange: this._editGoodsItem.bind(this, rowInfo.id, 'basePrice'),
                    initialValue: rowInfo.basePrice || 0
                  })(
                    <div>
                      <p>{rowInfo.basePrice ? sessionStorage.getItem('s2b-supplier@systemGetConfig:') + ' ' + rowInfo.basePrice : ''}</p>
                    </div>
                  )}
                </FormItem>
              )}
            </Col>
          </Row>
        );
      }
    });
    columns = columns.push({
      title: '',
      key: 'goodsNo',
      width: '5%'
    });

    return columns.toJS();
  };
  _getBasePrice = (id, price, spec) => {
    if (isNaN(parseFloat(price) / parseFloat(spec))) {
      return '0';
    } else {
      const { editGoodsItem } = this.props.relaxProps;
      const value = (parseFloat(price) / parseFloat(spec)).toFixed(2);
      editGoodsItem(id, 'basePrice', value);
      return value;
    }
  };
  _getSubscriptionBasePrice = (id, price, spec) => {
    if (isNaN(parseFloat(price) / parseFloat(spec))) {
      return '0';
    } else {
      const { editGoodsItem } = this.props.relaxProps;
      const value = (parseFloat(price) / parseFloat(spec)).toFixed(2);
      editGoodsItem(id, ' subscriptionBasePrice', value);
      return value;
    }
  };
  _handleChange = (value) => {
    const { updateAllBasePrice } = this.props.relaxProps;
    sessionStorage.setItem('baseSpecId', value);
    this._editGoodsItem(null, 'baseSpecId', value);
    updateAllBasePrice(value);
  };
  _deleteGoodsInfo = (id: string) => {
    const { deleteGoodsInfo } = this.props.relaxProps;
    deleteGoodsInfo(id);
  };

  _handleBasePriceChange = (e) => {
    const { setSelectedBasePrice } = this.props.relaxProps;
    setSelectedBasePrice(e);
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
  _editGoodsItem = (id: string, key: string, e: any, flag?: any) => {
    const { editGoodsItem, synchValue, updateBasePrice } = this.props.relaxProps;
    const checked = this.props.relaxProps[`${key}Checked`];
    if (e && e.target) {
      e = e.target.value;
    }

    editGoodsItem(id, key, e);

    if (key == 'marketPrice') {
      editGoodsItem(id, 'flag', flag);
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
    updateBasePrice(id, key, e);
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

  formatNum = (num) =>{
    let numMatch = String(num).match(/\d*(\.\d{0,4})?/);
    return (numMatch[0] += numMatch[1] ? '0000'.substr(0, 5 - numMatch[1].length) : '.0000');
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
