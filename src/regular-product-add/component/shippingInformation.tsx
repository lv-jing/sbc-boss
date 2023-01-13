import * as React from 'react';
import { Relax } from 'plume2';
import { Select, Table, Row, Col, Form, InputNumber } from 'antd';
const { Option } = Select;
import { IList, IMap } from 'typings/globalType';
import { fromJS, List } from 'immutable';
import { noop, RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';

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
              {rowInfo.goodsInfoNo}
            </Col>
          </Row>
        );
      }
    });

    const col = [
      {
        title: RCi18n({id: 'Product.depth'}),
        key: 'depth',
        render: (rowInfo) => {
          return (
            <Row>
              <Col span={12}>
                <InputNumber disabled defaultValue={rowInfo.depth} min={0} max={9999999} onChange={e => this._editGoodsItem(rowInfo.id, 'depth', e)}/>
              </Col>
            </Row>
          )
        }
      },
      {
        title: RCi18n({id: 'Product.depthUnit'}),
        key: 'depthUnit',
        render: (rowInfo) => {
          return (
            <Row>
              <Col span={12}>
                <Select disabled defaultValue={rowInfo.depthUnit || "mm"} onChange={e => this._editGoodsItem(rowInfo.id, 'depthUnit', e)}>
                  <Option key="mm">mm</Option>
                  <Option key="cm">cm</Option>
                </Select>
              </Col>
            </Row>
          )
        }
      },
      {
        title: RCi18n({id: 'Product.width'}),
        key: 'width',
        render: (rowInfo) => {
          return (
            <Row>
              <Col span={12}>
                <InputNumber disabled defaultValue={rowInfo.width} min={0} max={9999999} onChange={e => this._editGoodsItem(rowInfo.id, 'width', e)}/>
              </Col>
            </Row>
          )
        }
      },
      {
        title: RCi18n({id: 'Product.widthUnit'}),
        key: 'widthUnit',
        render: (rowInfo) => {
          return (
            <Row>
              <Col span={12}>
                <Select disabled defaultValue={rowInfo.widthUnit || "mm"} onChange={e => this._editGoodsItem(rowInfo.id, 'widthUnit', e)}>
                  <Option key="mm">mm</Option>
                  <Option key="cm">cm</Option>
                </Select>
              </Col>
            </Row>
          )
        }
      },
      {
        title: RCi18n({id: 'Product.height'}),
        key: 'height',
        render: (rowInfo) => {
          return (
            <Row>
              <Col span={12}>
                <InputNumber disabled defaultValue={rowInfo.height} min={0} max={9999999} onChange={e => this._editGoodsItem(rowInfo.id, 'height', e)}/>
              </Col>
            </Row>
          )
        }
      },
      {
        title: RCi18n({id: 'Product.heightUnit'}),
        key: 'heightUnit',
        render: (rowInfo) => {
          return (
            <Row>
              <Col span={12}>
                <Select disabled defaultValue={rowInfo.heightUnit || "mm"} onChange={e => this._editGoodsItem(rowInfo.id, 'heightUnit', e)}>
                  <Option key="mm">mm</Option>
                  <Option key="cm">cm</Option>
                </Select>
              </Col>
            </Row>
          )
        }
      }
    ];

    columns = columns.concat(col);

    columns = columns.push({
      title: '',
      key: '1',
      width: '5%'
    });

    return columns.toJS();
  };

  /**
   * 修改商品属性
   */
  _editGoodsItem = (id: string, key: string, e: any) => {
    const { editGoodsItem } = this.props.relaxProps;
    if (e && e.target) {
      e = e.target.value;
    }

    editGoodsItem(id, key, e);
    
  };
}
