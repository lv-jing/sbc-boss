import React from 'react';
import { Relax } from 'plume2';
import { Form, Radio, Switch } from 'antd';
import { noop } from 'qmkit';
import { IList } from 'typings/globalType';
import styled from 'styled-components';
import { checkAuth } from 'qmkit';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 24 },
    xl: { span: 5 },
    xxl: { span: 4 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 24 },
    xl: { span: 19 },
    xxl: { span: 20 }
  }
};

enum IMGTYPE {
  SMALL = 0,
  BIG = 1
}

enum SPECTYPE {
  SKU = 0,
  SPU = 1
}

const ItemBox = styled.div`
  margin-left: 10px;
`;

@Relax
export default class GoodsListSetting extends React.Component<any, any> {
  props: {
    relaxProps?: {
      goodsListConfigs: IList;
      goodsEvaluateConfig: any;
      switchChange: Function;
      editGoodsEvaluateSetting: Function;
    };
  };

  static relaxProps = {
    goodsListConfigs: 'goodsListConfigs',
    goodsEvaluateConfig: 'goodsEvaluateConfig',
    switchChange: noop,
    editGoodsEvaluateSetting: noop
  };

  render() {
    const {
      goodsListConfigs,
      goodsEvaluateConfig,
      switchChange,
      editGoodsEvaluateSetting
    } = this.props.relaxProps;
    return (
      <div style={{ margin: '30px 0 40px 0' }}>
        <Form>
          {goodsListConfigs.map((good) => {
            let info = good.toJS();
            return (
              <FormItem
                label={info.checkSorts}
                {...formItemLayout}
                key={info.configType}
              >
                {(info.configType == 'pc_goods_image_switch' ||
                  info.configType == 'mobile_goods_image_switch') && (
                  <RadioGroup
                    style={{ marginLeft: 10 }}
                    value={info.status}
                    onChange={(e) =>
                      switchChange(
                        'goodsListConfigs',
                        info.configType,
                        (e as any).target.value
                      )
                    }
                  >
                    <Radio disabled={!checkAuth('f_checkManage_edit')} value={IMGTYPE.SMALL}>小图列表</Radio>
                    <Radio disabled={!checkAuth('f_checkManage_edit')} value={IMGTYPE.BIG}>大图列表</Radio>
                    <p style={{ fontSize: 12, color: '#999', lineHeight: 1.5 }}>
                      {info.explain}
                    </p>
                  </RadioGroup>
                )}
                {(info.configType == 'pc_goods_spec_switch' ||
                  info.configType == 'mobile_goods_spec_switch') && (
                  <RadioGroup
                    style={{ marginLeft: 10 }}
                    value={info.status}
                    onChange={(e) =>
                      switchChange(
                        'goodsListConfigs',
                        info.configType,
                        (e as any).target.value
                      )
                    }
                  >
                    <Radio disabled={!checkAuth('f_checkManage_edit')}  value={SPECTYPE.SKU}>SKU维度</Radio>
                    <Radio disabled={!checkAuth('f_checkManage_edit')}  value={SPECTYPE.SPU}>SPU维度</Radio>
                    <p style={{ fontSize: 12, color: '#999', lineHeight: 1.5 }}>
                      {info.explain}
                    </p>
                  </RadioGroup>
                )}
              </FormItem>
            );
          })}
          <FormItem
            label={goodsEvaluateConfig.get('checkSorts')}
            {...formItemLayout}
          >
            <ItemBox>
              <Switch
                disabled={!checkAuth('f_checkManage_edit')} 
                checkedChildren="开"
                unCheckedChildren="关"
                checked={goodsEvaluateConfig.get('status') == 1}
                onChange={(val) => editGoodsEvaluateSetting(val)}
              />
              <p style={{ fontSize: 12, color: '#999', lineHeight: 1.5 }}>
                {goodsEvaluateConfig.get('explain')}
              </p>
            </ItemBox>
          </FormItem>
        </Form>
      </div>
    );
  }
}
