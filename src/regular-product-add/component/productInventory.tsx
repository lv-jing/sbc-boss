import * as React from 'react';
import { Relax } from 'plume2';
import { Select, Table, Input, Row, Col, Form, message, Checkbox, Tooltip, Icon, InputNumber } from 'antd';
const { Option } = Select;
import { IList, IMap } from 'typings/globalType';
import { fromJS, List } from 'immutable';
import { cache, noop, ValidConst, RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
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
      count: 0
    };
  }
  handleChange(value) {
  }
  render() {
    const { goodsList, goods, goodsSpecs, baseSpecId } = this.props.relaxProps;
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
    const { goodsSpecs, stockChecked, marketPriceChecked, modalVisible, clickImg, removeImg, specSingleFlag, spuMarketPrice, priceOpt, goods, baseSpecId } = this.props.relaxProps;

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
              return rowInfo;
            }
          };
        })
        .toList();
    }
    columns = columns.unshift({
      title: '',
      key: 'index' + 2,
      render: (_text, _rowInfo, index) => {
        return index + 1;
      }
    });

    columns = columns.push({
      title: <FormattedMessage id="product.SKU" />,
      key: 'goodsInfoNo' + 'subscriptionPrice',
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
          <br />
          {/*<Checkbox checked={stockChecked} onChange={(e) => this._synchValue(e, 'stock')}>
            <FormattedMessage id="allTheSame" />
            &nbsp;
            <Tooltip placement="top" title={'After checking, all SKUs use the same inventory'}>
              <a style={{ fontSize: 14 }}>
                <Icon type="question-circle-o" />
              </a>
            </Tooltip>
          </Checkbox>*/}
        </div>
      ),
      key: 'stock',
      render: (rowInfo) => (
        <Row>
          <Col span={12}>
            <FormItem style={styles.tableFormItem}>
              {getFieldDecorator('stock_' + rowInfo.id, {
                rules: [
                  {
                    validator: (_rule, value, callback) => {
                      if (!value && value !== 0) {
                        callback(RCi18n({id:'Product.PleaseInputInventory'}));
                      }
                      if (!ValidConst.zeroNumber.test(value)) {
                        callback(RCi18n({id:'Product.PleaseEnterTheCorrect'}));
                      }
                      callback();
                    }
                  }
                ],
                onChange: this._editGoodsItem.bind(this, rowInfo.id, 'stock'),
                initialValue: rowInfo.stock
              })(<InputNumber style={{ width: '121px' }} min={0} max={999999999} disabled />)}
            </FormItem>
          </Col>
        </Row>
      )
    });
    columns = columns.push({
      title: <FormattedMessage id="Product.Virtualinventory" />,
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
                    message: RCi18n({id:'Product.PleaseEnterTheCorrect'})
                  }
                ],
                onChange: this._editGoodsItem.bind(this, rowInfo.id, 'virtualInventory'),
                initialValue: rowInfo.virtualInventory
              })(<InputNumber style={{ width: '121px' }} min={0} max={999999999} disabled />)}
            </FormItem>
          </Col>
        </Row>
      )
    });
    columns = columns.push({
      title: <FormattedMessage id="Product.UOM"/>,
      key: 'goodsMeasureUnit + stock',
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
                    message: RCi18n({id:'Product.PleaseEnterTheCorrect'})
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
      key: '1',
      width: '5%'
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
  _editGoodsItem = (id: string, key: string, e: any) => {
    const { editGoodsItem, synchValue } = this.props.relaxProps;
    const checked = this.props.relaxProps[`${key}Checked`];
    if (e && e.target) {
      e = e.target.value;
    }

    editGoodsItem(id, key, e);

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
