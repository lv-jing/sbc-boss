import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';
import AppStore from '../store';
import '../index.less';
import { fromJS, Map } from 'immutable';
import { AuthWrapper, BreadCrumb, Headline, noop, SelectGroup } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Form, Select, Input, Button, Table, Divider, message, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { IMap } from '../../../typings/globalType';
const { TextArea } = Input;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 4,
    xs: { span: 4 },
    sm: { span: 4 }
  },
  wrapperCol: {
    span: 10,
    xs: { span: 10 },
    sm: { span: 10 }
  }
};
@Relax
export default class SeoForm extends Component<any, any> {
  _rejectForm;

  WrapperForm: any;

  state: {
    operation: 'new'; //edit
    isEdit: false;
  };
  props: {
    form: any;
    relaxProps?: {
      seoForm: any;
      getGoodsId: any;
      updateNumbers: any;
      updateSeoForm: Function;
      getSeo: Function;
    };
  };

  static relaxProps = {
    updateSeoForm: noop,
    getSeo: noop,
    seoForm: 'seoForm',
    getGoodsId: 'getGoodsId',
    updateNumbers: 'updateNumbers'
  };
  componentDidMount() {
    const { getSeo, getGoodsId, updateNumbers } = this.props.relaxProps;
    if (getGoodsId) {
      getSeo(getGoodsId);
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { seoForm, updateSeoForm } = this.props.relaxProps;
    const seoObj = seoForm.toJS();
    const arr = [
      { name: 'H1', id: 'H1' },
      { name: 'H2', id: 'H2' },
      { name: 'H3', id: 'H3' },
      { name: 'H4', id: 'H4' },
      { name: 'H5', id: 'H5' }
    ];
    const loginInfo = JSON.parse(sessionStorage.getItem('s2b-supplier@login'));
    return (
      <Form {...formItemLayout} className="login-form">
        {/*<Form.Item>*/}
        {/*  {getFieldDecorator('title', {*/}
        {/*    rules: [{ required: true, message: 'Please input your username!' }],*/}
        {/*  })*/}
        {/*  (*/}
        {/*    <Input*/}
        {/*      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}*/}
        {/*      placeholder="Username"*/}
        {/*    />,*/}
        {/*  )}*/}
        {/*</Form.Item>*/}
        <Form.Item label="Title">
          {getFieldDecorator('titleSource', {
            initialValue: '' //seoObj.titleSource
          })(
            <Input
              disabled
              onChange={(e) =>
                updateSeoForm({
                  field: 'titleSource',
                  value: e.target.value
                })
              }
            />
          )}
        </Form.Item>
        {/*<Form.Item label="Heading Tag">*/}
        {/*  {getFieldDecorator('headingTag', {*/}
        {/*    initialValue: seoObj.headingTag*/}
        {/*  })(*/}
        {/*    <Select*/}
        {/*      onChange={(e) =>*/}
        {/*        updateSeoForm({*/}
        {/*          field: 'headingTag',*/}
        {/*          value: e*/}
        {/*        })*/}
        {/*      }*/}
        {/*    >*/}
        {/*      {arr.map((item) => (*/}
        {/*        <option key={item.id} value={item.id}>*/}
        {/*          {item.name}*/}
        {/*        </option>*/}
        {/*      ))}*/}
        {/*    </Select>*/}
        {/*  )}*/}
        {/*</Form.Item>*/}

        {loginInfo && loginInfo.storeId !== 123457910 && loginInfo.storeId !== 123456858  && (
          <>
            <Form.Item label="Meta Keywords">
              {getFieldDecorator('metaKeywordsSource', {
                initialValue: '' // seoObj.metaKeywordsSource
              })(
                <TextArea
                  disabled
                  rows={4}
                  onChange={(e) =>
                    updateSeoForm({
                      field: 'metaKeywordsSource',
                      value: e.target.value
                    })
                  }
                />
              )}
            </Form.Item>
            <Form.Item label="Meta Description">
              {getFieldDecorator('metaDescriptionSource', {
                initialValue: '' // seoObj.metaDescriptionSource
              })(
                <TextArea
                  disabled
                  rows={4}
                  onChange={(e) =>
                    updateSeoForm({
                      field: 'metaDescriptionSource',
                      value: e.target.value
                    })
                  }
                />
              )}
            </Form.Item>
            <Form.Item label="H1">
              {getFieldDecorator('h1', {
                initialValue: '{ name }'
              })(<Input style={{ width: 300 }} disabled />)}
            </Form.Item>
            <Form.Item label="H2">
              {getFieldDecorator('h2', {
                initialValue: '{ subtitle }'
              })(<Input style={{ width: 300 }} disabled />)}
            </Form.Item>
          </>
        )}
      </Form>
    );
  }
}
