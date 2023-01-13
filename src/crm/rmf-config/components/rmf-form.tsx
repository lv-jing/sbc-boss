import React from 'react';
import { Button, Form, InputNumber, Radio } from 'antd';
import '../style.less';
import { Relax } from 'plume2';
import { noop } from 'qmkit';

@Relax
export default class RmfForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      period: number;
      r: any;
      f: any;
      m: any;
      changeFormValue: Function;
      changePeriod: Function;
      save: Function;
      delItem: Function;
      addItem: Function;
    };
  };

  static relaxProps = {
    period: 'period',
    r: 'r',
    f: 'f',
    m: 'm',
    changeFormValue: noop,
    changePeriod: noop,
    save: noop,
    delItem: noop,
    addItem: noop
  };

  render() {
    const { r, f, m, period, changePeriod, save } = this.props.relaxProps;
    return (
      <Form className="login-form" style={{ paddingBottom: 50 }}>
        <div>
          <div className="rmf-config-msg">
            <div>您可在下方设置消费频次、消费金额数据的统计范围</div>
            <div style={{ marginTop: 10 }}>
              统计范围：
              <Radio.Group
                onChange={(val) => {
                  changePeriod(val.target.value);
                }}
                value={period}
              >
                <Radio value={0}>近1个月</Radio>
                <Radio value={1}>近3个月</Radio>
                <Radio value={2}>近6个月</Radio>
                <Radio value={3}>近1年</Radio>
              </Radio.Group>
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div className="item-box">
              <div className="txt">
                <span>R分（最近一次消费时间）</span>
                <span>
                  最近一次消费时间间隔越大，得分应越低，最大不超过365天
                </span>
                <span>R分用于指导决定接触策略、频次、刺激力度</span>
              </div>
              <div>{this.renderRFMItem('r', r)}</div>
            </div>
            <div className="item-box">
              <div className="txt">
                <span>F分（消费频次）</span>
                <span>统计时间内，消费频次越高，得分应越高</span>
                <span>F分用于指导决定资源投入、营销优先级、活动方案</span>
              </div>
              <div>{this.renderRFMItem('f', f)}</div>
            </div>
            <div className="item-box" style={{ marginRight: 0 }}>
              <div className="txt">
                <span>M分（消费金额）</span>
                <span>统计时间内，消费金额越高，得分应越高</span>
                <span>M分用于指导决定推荐商品、折扣门槛、活动方案</span>
              </div>

              <div>{this.renderRFMItem('m', m)}</div>
            </div>
          </div>
        </div>
        <div className="bar-button">
          <Button type="primary" htmlType="submit" onClick={() => save()}>
            保存
          </Button>
        </div>
      </Form>
    );
  }

  renderRFMItem = (key: 'r' | 'f' | 'm', items) => {
    const { changeFormValue, delItem, addItem } = this.props.relaxProps;
    const unitMap = {
      r: '天',
      f: '次',
      m: '元'
    };
    const maxParam = {} as any;
    if (key === 'r') maxParam.max = 365;
    return (
      <div>
        {items.map((item, idx) => {
          return (
            <div className="item">
              <span>≥</span>
              <InputNumber
                disabled={idx == 0}
                style={{ width: 150, margin: 5 }}
                value={item.get('param')}
                min={0}
                max={1000000000}
                {...maxParam}
                onChange={(val) => changeFormValue([key, idx, 'param'], val)}
              />
              <span>{unitMap[key]}，得分</span>
              <InputNumber
                style={{ width: 80, margin: 5 }}
                value={item.get('score')}
                min={0}
                max={1000000000}
                onChange={(val) => changeFormValue([key, idx, 'score'], val)}
              />
              &nbsp;
              {idx != 0 && (
                <a
                  className={items.size <= 5 ? 'disable' : ''}
                  href="javascript:;"
                  onClick={() => {
                    if (items.size <= 5) {
                      return;
                    }
                    delItem([key, idx]);
                  }}
                >
                  删除
                </a>
              )}
              &nbsp;&nbsp;
              {idx == items.size - 1 && (
                <a href="javascript:;" onClick={() => addItem(key)}>
                  添加
                </a>
              )}
            </div>
          );
        })}
      </div>
    );
  };
}
