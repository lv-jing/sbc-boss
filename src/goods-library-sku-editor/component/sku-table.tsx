import * as React from 'react';
import { Relax } from 'plume2';
import { Button, Col, Form, Input, message, Row, Table } from 'antd';
import { IList, IMap } from 'typings/globalType';
import { fromJS, Map } from 'immutable';
import { history, noop, ValidConst } from 'qmkit';

import ImageLibraryUpload from './image-library-upload';

const FILE_MAX_SIZE = 2 * 1024 * 1024;
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
@Relax
export default class SkuTable extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      goodsSpecs: IList;
      goodsList: IList;
      goods: IMap;
      editGoods: Function;
      editGoodsItem: Function;
      updateSkuForm: Function;
      modalVisible: Function;
      clickImg: Function;
      removeImg: Function;
      saveMain: Function;
    };
  };

  static relaxProps = {
    goodsSpecs: 'goodsSpecs',
    goodsList: 'goodsList',
    goods: 'goods',
    editGoods: noop,
    editGoodsItem: noop,
    updateSkuForm: noop,
    modalVisible: noop,
    clickImg: noop,
    removeImg: noop,
    saveMain: noop
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
        relaxProps={this.props.relaxProps}
      />
    );
  }
}

class SkuForm extends React.Component<any, any> {
  render() {
    const { getFieldDecorator } = this.props.form;
    const { goodsList, goods } = this.props.relaxProps;
    const columns = this._getColumns();
    return (
      <div>
        <Form style={{ marginTop: 15 }}>
          <Row type="flex" justify="start">
            <Col span={8}>
              <FormItem {...formItemLayout} label="市场价">
                {getFieldDecorator('marketPrice', {
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
                  onChange: this._editGoods.bind(this, 'marketPrice'),
                  initialValue: goods.get('marketPrice')
                })(<Input placeholder="请填写该SKU市场价，单位“元”" />)}
              </FormItem>
            </Col>
          </Row>

          <div className="ant-form-inline">
            <Table
              rowKey="id"
              dataSource={goodsList.toJS()}
              columns={columns}
              pagination={false}
            />
          </div>
        </Form>

        <div style={{ marginTop: 20 }}>
          <Button
            type="primary"
            onClick={this._save}
            style={{ marginRight: 10 }}
          >
            保存
          </Button>
        </div>
      </div>
    );
  }

  _save = async () => {
    const { saveMain } = this.props.relaxProps;
    const result = await saveMain();
    if (result) {
      history.goBack();
    }
  };

  _getColumns = () => {
    const {
      goodsSpecs,
      modalVisible,
      clickImg,
      removeImg
    } = this.props.relaxProps;

    let columns: any = goodsSpecs
      .map((item) => {
        return {
          title: item.get('specName'),
          dataIndex: 'specId-' + item.get('specId'),
          key: item.get('specId')
        };
      })
      .toList();

    columns = columns.unshift({
      title: '图片',
      key: 'img',
      render: (rowInfo) => {
        const images = fromJS(rowInfo.images ? rowInfo.images : []);
        return (
          <div>
            <FormItem>
              <ImageLibraryUpload
                images={images}
                modalVisible={modalVisible}
                clickImg={clickImg}
                removeImg={removeImg}
                imgCount={1}
                imgType={1}
                skuId={rowInfo.id}
              />
            </FormItem>
          </div>
        );
      }
    });

    columns = columns.unshift({
      title: '',
      key: 'index',
      dataIndex: 'index'
    });

    return columns.toJS();
  };

  /**
   * 修改商品项
   */
  _editGoods = (key: string, e) => {
    const { editGoods } = this.props.relaxProps;
    if (e && e.target) {
      e = e.target.value;
    }
    const goods = Map({
      [key]: e
    });
    editGoods(goods);
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

  /**
   * 修改商品图片属性
   */
  _editGoodsImageItem = (id: string, key: string, { _file, fileList }) => {
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
