import * as React from 'react';
import { Relax } from 'plume2';
import {
  Table,
  Form,
  Button,
  message,
  Checkbox,
  Row,
  Col,
  Input,
  Tooltip,
  Icon
} from 'antd';
import { IList } from 'typings/globalType';
import { fromJS, List } from 'immutable';
import { noop, ValidConst } from 'qmkit';
import ImageLibraryUpload from './image-library-upload';

const FormItem = Form.Item;
const FILE_MAX_SIZE = 2 * 1024 * 1024;

@Relax
export default class SkuTable extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      goodsSpecs: IList;
      goodsList: IList;
      // 批量设置市场价开关
      marketPriceChecked: boolean;
      specSingleFlag: boolean;
      editGoodsItem: Function;
      deleteGoodsInfo: Function;
      updateSkuForm: Function;
      updateMarketPriceChecked: Function;
      synchMarketPrice: Function;
      clickImg: Function;
      removeImg: Function;
      modalVisible: Function;
    };
  };

  static relaxProps = {
    goodsSpecs: 'goodsSpecs',
    goodsList: 'goodsList',
    marketPriceChecked: 'marketPriceChecked',
    specSingleFlag: 'specSingleFlag',
    editGoodsItem: noop,
    deleteGoodsInfo: noop,
    updateSkuForm: noop,
    updateMarketPriceChecked: noop,
    synchMarketPrice: noop,
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
        ref={(form) => updateSkuForm(form)}
        {...{ relaxProps: this.props.relaxProps }}
      />
    );
  }
}

class SkuForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    const { goodsList } = this.props.relaxProps;
    const columns = this._getColumns();

    return (
      <div style={{ marginBottom: 20 }}>
        <Form>
          <Table
            rowKey="id"
            dataSource={goodsList.toJS()}
            columns={columns}
            pagination={false}
          />
        </Form>
      </div>
    );
  }

  _getColumns = () => {
    const {
      goodsSpecs,
      modalVisible,
      clickImg,
      removeImg,
      specSingleFlag,
      marketPriceChecked
    } = this.props.relaxProps;

    let columns: any = List();
    const { getFieldDecorator } = this.props.form;

    // 未开启规格时，不需要展示默认规格
    if (!specSingleFlag) {
      columns = goodsSpecs
        .map((item) => {
          return {
            title: item.get('specName'),
            dataIndex: 'specId-' + item.get('specId'),
            key: item.get('specId')
          };
        })
        .toList();
    }

    columns = columns.unshift({
      title: '图片',
      key: 'img',
      className: 'goodsImg',
      render: (rowInfo) => {
        const images = fromJS(rowInfo.images ? rowInfo.images : []);
        return (
          <ImageLibraryUpload
            images={images}
            modalVisible={modalVisible}
            clickImg={clickImg}
            removeImg={removeImg}
            imgCount={1}
            imgType={1}
            skuId={rowInfo.id}
          />
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
          </span>市场价<br />
          <Checkbox
            checked={marketPriceChecked}
            onChange={(e) => this._checkMarketPrice(e)}
          >
            全部相同&nbsp;
            <Tooltip placement="top" title={'勾选后所有SKU都使用相同的市场价'}>
              <a style={{ fontSize: 14 }}>
                <Icon type="question-circle-o" />
              </a>
            </Tooltip>
          </Checkbox>
        </div>
      ),
      key: 'marketPrice',
      render: (rowInfo) => (
        <Row>
          <Col span={12}>
            <FormItem style={{ marginBottom: '0px' }}>
              {getFieldDecorator('marketPrice_' + rowInfo.id, {
                rules: [
                  {
                    required: true,
                    message: '请填写市场价'
                  },
                  {
                    pattern: ValidConst.zeroPrice,
                    message: '请填写两位小数的合法金额'
                  },
                  {
                    type: 'number',
                    max: 9999999.99,
                    message: '最大值为9999999.99',
                    transform: function(value) {
                      return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
                    }
                  }
                ],
                onChange: this._editGoodsItem.bind(
                  this,
                  rowInfo.id,
                  'marketPrice'
                ),
                initialValue: rowInfo.marketPrice
              })(<Input disabled={rowInfo.index > 1 && marketPriceChecked} />)}
            </FormItem>
          </Col>
        </Row>
      )
    });

    columns = columns.push({
      title: '操作',
      key: 'opt',
      render: (rowInfo) =>
        specSingleFlag ? null : (
          <Button onClick={() => this._deleteGoodsInfo(rowInfo.id)}>
            删除
          </Button>
        )
    });

    return columns.toJS();
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
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif') ||
      fileName.endsWith('.jpeg')
    ) {
      if (file.size < FILE_MAX_SIZE) {
        return true;
      } else {
        message.error('文件大小必须小于2M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };

  /**
   * 修改商品属性
   */
  _editGoodsItem = (id: string, key: string, e: any) => {
    const {
      editGoodsItem,
      synchMarketPrice,
      marketPriceChecked
    } = this.props.relaxProps;
    if (e && e.target) {
      e = e.target.value;
    }
    // 1.编辑字段值
    editGoodsItem(id, key, e);

    // 2.如果是市场价
    if (key == 'marketPrice' && marketPriceChecked) {
      // 2.1.同store中的市场价
      synchMarketPrice();
      // 2.2.同步form中的市场价
      const fieldsValue = this.props.form.getFieldsValue();
      let values = {};
      Object.getOwnPropertyNames(fieldsValue).forEach((field) => {
        if (field.indexOf(`marketPrice_`) === 0) {
          values[field] = e;
        }
      });
      this.props.form.setFieldsValue(values);
    }
  };

  /**
   * 勾选是否批量设置市场价
   */
  _checkMarketPrice = async (e) => {
    const { updateMarketPriceChecked, goodsList } = this.props.relaxProps;
    await updateMarketPriceChecked(e.target.checked);
    const goodsInfo = goodsList.get(0);
    if (goodsInfo) {
      this._editGoodsItem(
        goodsInfo.get('id'),
        'marketPrice',
        goodsInfo.get('marketPrice')
      );
    }
  };

  /**
   * 修改商品图片属性
   */
  _editGoodsImageItem = (id: string, key: string, { fileList }) => {
    let msg = null;
    if (fileList != null) {
      fileList.forEach((file) => {
        if (
          file.status == 'done' &&
          file.response != null &&
          file.response.message != null
        ) {
          msg = file.response.message;
        }
      });

      if (msg != null) {
        //如果上传失败，只过滤成功的图片
        message.error(msg);
        fileList = fileList.filter(
          (file) =>
            file.status == 'done' &&
            file.response != null &&
            file.response.message == null
        );
      }
    }
    const { editGoodsItem } = this.props.relaxProps;
    editGoodsItem(id, key, fromJS(fileList));
  };
}
