import * as React from 'react';
import { Relax } from 'plume2';
import { Table, Input, Row, Col, Checkbox, InputNumber, Form, Button, message, Tooltip, Icon, Select } from 'antd';
import { IList, IMap } from 'typings/globalType';
import { fromJS, List } from 'immutable';
import { cache, noop, RCi18n, ValidConst } from 'qmkit';
import ImageLibraryUpload from './image-library-upload';
import { any } from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

const FormItem = Form.Item;
const { Option } = Select;
const FILE_MAX_SIZE = 2 * 1024 * 1024;

@Relax
export default class ProductInventory extends React.Component<any, any> {
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
      addSkUProduct: any;
      selectedBasePrice: any;
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
      subscriptionStatus: any;
      updateBasePrice: Function;
      updateAllBasePrice: Function;
      setDefaultBaseSpecId: Function;
      setSelectedBasePrice: Function;
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
    addSkUProduct: 'addSkUProduct',
    selectedBasePrice: 'selectedBasePrice',
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

class SkuForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      priceType: ''
    };
  }

  render() {
    const { goodsList } = this.props.relaxProps;
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
    const { goodsSpecs, addSkUProduct, specSingleFlag, goods, goodsList, baseSpecId } = this.props.relaxProps;

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
      title: '',
      key: 'index',
      render: (_text, _rowInfo, index) => {
        return index + 1;
      }
    });

    columns = columns.push({
      title: <FormattedMessage id="product.SKU" />,
      key: 'goodsInfoNo',
      render: (rowInfo) => {
        //let a = addSkUProduct[rowInfo.index-1]?addSkUProduct[rowInfo.index-1].pid:''
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
          <FormattedMessage id="product.inventory" />
        </div>
      ),
      key: 'stock',
      render: (rowInfo,index) => {
        let a = null;
        let b = null;
        let c = rowInfo.stock || 0;
        let d = true
        if (rowInfo.goodsInfoBundleRels.length != 0) {
          d = true
        } else {
          d = false
        }


        /*a = (addSkUProduct && addSkUProduct.filter((i) => i.pid == rowInfo.goodsInfoNo)[0]) || null;
        a = a ? a : { minStock: '' };
        c = rowInfo.stock || 0
        if (a && a.minStock && rowInfo.maxStock) {
          b = a.minStock - rowInfo.maxStock >= 0 ? a.minStock : rowInfo.maxStock;
        } else if (a && a.minStock) {
          b = a.minStock;
        } else if (a && a.maxStock) {
          b = a.maxStock;
        } else {
          b = 999999;
        }*/

        /*let targetGoodsIds = addSkUProduct[0]&&addSkUProduct[0].targetGoodsIds[0]
        c = Number(String(c / targetGoodsIds.bundleNum).replace(/\.\d+/g, ''))*/

        /* if(addSkUProduct.length == 1 && addSkUProduct[0].targetGoodsIds.length == 1) {
          console.log(c);
          console.log(addSkUProduct[0].targetGoodsIds[0].bundleNum);
          c = Number(String(c / addSkUProduct[0].targetGoodsIds[0].bundleNum).replace(/\.\d+/g, ''))
        }*/
        /*if (goods.get('goodsId') == null) {
          if (goodsList.toJS().length == 1) {
            let targetGoodsIds = addSkUProduct[0]&&addSkUProduct[0].targetGoodsIds[0]
            console.log(addSkUProduct.length,11111);
            console.log(addSkUProduct[0]&&addSkUProduct[0].targetGoodsIds.length,2222222);
            console.log(c,333333);
            if(addSkUProduct.length == 1 && addSkUProduct[0].targetGoodsIds.length == 1 ) {
              //c = c * targetGoodsIds.bundleNum
              console.log(c,666666);
              c = Number(String(c / targetGoodsIds.bundleNum).replace(/\.\d+/g, ''))

            }else if (addSkUProduct.length == 1 && addSkUProduct[0].targetGoodsIds.length == 0 ){
              c = 0
              console.log(c,77777);
            }else if (addSkUProduct.length == 0 || addSkUProduct.length == undefined ){

              c = 0
              console.log(c,88888);
            }
          }else {
            //c = 0
            console.log(c,9999999);
          }

        }*/

        return (
          <Row>
            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                {/*getFieldDecorator('stock_' + rowInfo.id, {
                  rules: [
                    {
                      required: true,
                      message: RCi18n({id:'Product.PleaseInputInventory'})
                    },
                    {
                      validator: (_rule, value, callback) => {
                        if (!ValidConst.zeroNumber.test(value)) {
                          callback(RCi18n({id:'Product.enterthecorrectvalue'}));
                        }
                        callback();
                      }
                    }
                  ],
                  onChange: this._editGoodsItem.bind(this, rowInfo.id, 'stock'),
                  initialValue: c
                })(
                  <InputNumber
                    style={{ width: '121px' }}
                    min={0}
                    max={999999999}
                    disabled={d}
                    //max={b}
                    //onBlur={this.onInputNumber.bind(this, rowInfo.id, 'stock')}
                  />
                )*/}
                <InputNumber
                  style={{ width: '121px' }}
                  min={0}
                  max={999999999}
                  //disabled={d}
                  disabled
                  value={c}
                  onChange={this._editGoodsItem.bind(this, rowInfo.id, 'stock')}
                  //max={b}
                  //onBlur={this.onInputNumber.bind(this, rowInfo.id, 'stock')}
                />
              </FormItem>
            </Col>
          </Row>
        );
      }
    });
    columns = columns.push({
      title: <FormattedMessage id="Product.VirtualInventory" />,
      key: 'virtualInventory',
      render: (rowInfo) => (
        <Row>
          <Col span={12}>
            <FormItem style={styles.tableFormItem}>
              {getFieldDecorator('virtualInventory_' + rowInfo.id, {
                rules: [
                  // {
                  //   required: true,
                  //   message: 'Please input inventory'
                  // },
                  {
                    pattern: ValidConst.number,
                    message: RCi18n({id:'Product.enterthecorrectvalue'})
                  }
                ],
                onChange: this._editGoodsItem.bind(this, rowInfo.id, 'virtualInventory'),
                initialValue: rowInfo.virtualInventory
              })(<InputNumber disabled style={{ width: '121px' }} min={0} max={999999999} />)}
            </FormItem>
          </Col>
        </Row>
      )
    });
    columns = columns.push({
      title: <FormattedMessage id="Product.UOM" />,
      key: 'goodsMeasureUnit',
      render: (rowInfo) => {
        return (
          <Row>
            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('goodsMeasureUnit_' + rowInfo.id, {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: RCi18n({id:'Product.PleaseInputUOM'})
                    }
                  ],
                  onChange: this._editGoodsItem.bind(this, rowInfo.id, 'goodsMeasureUnit'),
                  initialValue: rowInfo.goodsMeasureUnit
                })(<Input disabled style={{ width: '115px' }} />)}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    columns = columns.push({
      title: RCi18n({id: 'Product.Inventory Alert'}),
      key: 'virtualAlert',
      render: (rowInfo) => (
        <Row>
          <Col span={12}>
            <FormItem style={styles.tableFormItem}>
              {getFieldDecorator('virtualAlert_' + rowInfo.id, {
                rules: [
                  // {
                  //   required: true,
                  //   message: 'Please input inventory'
                  // },
                  {
                    pattern: ValidConst.number,
                    message: RCi18n({id:'Product.enterthecorrectvalue'})
                  }
                ],
                onChange: this._editGoodsItem.bind(this, rowInfo.id, 'virtualAlert'),
                initialValue: rowInfo.virtualAlert
              })(<InputNumber disabled style={{ width: '121px' }} min={0} max={999999999} />)}
            </FormItem>
          </Col>
        </Row>
      )
    });

    columns = columns.push({
      title: '',
      key: 'id',
      width: '5%'
    });

    return columns.toJS();
  };

  /**
   * 修改商品属性
   */
  _editGoodsItem = (id: string, key: string, e: any, flag?: any) => {
    const { editGoodsItem, synchValue, updateBasePrice, addSkUProduct } = this.props.relaxProps;
    const checked = this.props.relaxProps[`${key}Checked`];
    if (e && e.target) {
      e = e.target.value;
    }
    editGoodsItem(id, key, e);
  };

  onInputNumber = (id: string, key: string, e: any, flag?: any) => {
    const { editGoodsItem,} = this.props.relaxProps;
    if (e && e.target) {
      e = e.target.value;
    }
    if (e == "") {
      editGoodsItem(id, key, 0);
    }

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
