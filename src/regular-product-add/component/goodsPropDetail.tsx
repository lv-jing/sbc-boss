import { IList } from 'typings/globalType';
import * as React from 'react';
import { Relax } from 'plume2';
import { noop } from 'qmkit';
import { Form, Row, Col, Select, Tree, TreeSelect } from 'antd';
import { FormattedMessage } from 'react-intl';
import '../index.less'
import { RCi18n } from 'qmkit';

const { Option } = Select;
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;

const formItemLayout = {
  labelCol: {
    span: 12,
    xs: { span: 24 },
    sm: { span: 12 }
  },
  wrapperCol: {
    span: 12,
    xs: { span: 24 },
    sm: { span: 12 }
  }
};

@Relax
export default class GoodsPropDetail extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      changePropVal: Function;
      propList: IList;
      propDetail: IList;
      updateAttributeForm: Function;
    };
  };

  static relaxProps = {
    changePropVal: noop,
    propList: 'propList',
    propDetail: 'propDetail',
    updateAttributeForm: noop
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(AttributeForm);
  }

  componentDidMount() {
    // const { updateGoodsForm } = this.props.relaxProps;
    // updateGoodsForm(this.props.form);
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const relaxProps = this.props.relaxProps;
    return (
      <div>
        <WrapperForm
          ref={(form) => (this['_form'] = form)}
          {...{ relaxProps: relaxProps }}
        />
      </div>
    );
  }
}
class AttributeForm extends React.Component<any, any> {
  componentDidMount() {
    const { updateAttributeForm } = this.props.relaxProps;
    updateAttributeForm(this.props.form);
  }
  render() {
    const { propList } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        {/* attributeInformation title */}
        <div
          style={{
            fontSize: 16,
            marginBottom: 10,
            marginTop: 10,
            fontWeight: 'bold'
          }}
        >
          <FormattedMessage id="product.attributeInformation" />
          <span style={{ marginLeft: 10, fontSize: 10, color: '#86877F' }}>
            <FormattedMessage id="product.attributeInformationDetail" />
          </span>
        </div>
        {/* attributeForm */}
        <div>
          <Form id="attributeForm">
            {propList.size>0 &&
              propList.toJS().map((detList) => {
                
                return (
                  <Row type="flex" justify="start" key={detList[0].propId}>
                    {detList.map((det) => (
                      
                      <Col span={10} key={det.propId + det.cateId}>
                        <FormItem {...formItemLayout} label={det.propName}>
                          {getFieldDecorator(`${det.propName}`, {
                            rules: [
                              {
                                required: false,
                                message: `Please select the ${det.propName}`
                              }
                            ],
                            initialValue:
                            det.goodsPropDetails && (det.goodsPropDetails.filter((item) => item.select === 'select')).length
                             ? (det.goodsPropDetails.filter((item) => item.select === 'select')).map((item) => {
                              return {
                                label: item.detailName,
                                value: item.detailId
                              }
                            }) : []
                          })(this._getPropTree(det))}
                        </FormItem>
                      </Col>
                    ))}
                  </Row>
                );
              })}
          </Form>
        </div>
      </div>
    );
  }

  /**
   * 获取属性值下拉框
   */
  _getPropSelect = (propValues, propId) => {
    const propVal = propValues.find((item) => item.get('select') === 'select');
    const selected = propVal ? propVal.get('detailId') : '0';
    return (
      <Select getPopupContainer={() => document.getElementById('page-content')} defaultValue={selected} onChange={(value) => this._onChange(propId, value)}>
        {propValues.map((item) => {
          return (
            <Option key={item.get('detailId')} value={item.get('detailId')}>
              {item.get('detailName')}
            </Option>
          );
        })}
      </Select>
    );
  };

  _getPropTree = (det) => {
    let propValues = det.goodsPropDetails;
    let propId = det.propId;
    let isSingle = det.isSingle;
    return (
      <TreeSelect
        disabled
        getPopupContainer={() => document.getElementById('page-content')}
        treeCheckable={true}
        showCheckedStrategy={(TreeSelect as any).SHOW_ALL}
        treeCheckStrictly={true}
        notFoundContent="No Data"
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeDefaultExpandAll
        showSearch={false}
        onChange={(value) => this._onChange(propId, value)}
      >
        {this.generateStoreCateTree(propValues, isSingle)}
      </TreeSelect>
    );
  };

  /**
   * 店铺分类树形下拉框
   * @param propValues
   */
  generateStoreCateTree = (propValues, isSingle) => {
    const { propDetail } = this.props.relaxProps;
    const propDetails = propDetail ? propDetail.toJS() : [];
    const selectList = [];
    propDetails.map((p) => {
      p.goodsPropDetails &&
        p.goodsPropDetails.map((x) => {
          if (x.select === 'select') {
            selectList.push(x.detailId);
          }
        });
    });
    const values = propValues ? propValues.map((x) => x.detailId) : [];
    let intersection = values.filter((v) => selectList.includes(v));
    return propValues.map((item) => {
      const singleDisabled = isSingle && intersection.length > 0 && item.detailId != intersection[0];
      return <TreeNode key={item.detailId} value={item.detailId} title={item.detailName} disabled={singleDisabled} />;
    });
  };

  /**
   *
   */
  _onChange = (propId, detailIds) => {
    const { changePropVal } = this.props.relaxProps;
    changePropVal({ propId, detailIds: detailIds.map((d) => d.value) });
  };
}
