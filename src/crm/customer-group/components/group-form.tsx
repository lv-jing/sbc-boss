import React from 'react';
import { Form, Input, TreeSelect, Select } from 'antd';
import { FindArea, noop } from 'qmkit';
const FormItem = Form.Item;
const Option = Select.Option;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const opts = [1, 7, 30, 60, 90, 180, 365];
import { Relax } from 'plume2';

const formItemLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 19
  }
};

const smallItemLayout = {
  labelCol: {
    span: 12
  },
  wrapperCol: {
    span: 12
  }
};

const shortFormLayout = {
  labelCol: {
    span: 12
  },
  wrapperCol: {
    span: 12
  }
};

@Relax
export default class GroupForm extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      setArr: Function;
      form: any;
      selectedAreaIds: any;
      modalVisible: boolean;
      lastConsumption: string;
      tagList: any;
      areaIdsSave: Function;
      toggleModal: Function;
      onFormChange: Function;
      saveGroup: Function;
      areaIds: any;
      levalList: any;
      ifUpdate: any;
      arr: any;
      clearAreaIds: Function;
      setData: Function;
    };
  };
  static relaxProps = {
    selectedAreaIds: 'selectedAreaIds',
    modalVisible: 'modalVisible',
    lastConsumption: 'lastConsumption',
    tagList: 'tagList',
    toggleModal: noop,
    areaIdsSave: noop,
    onFormChange: noop,
    form: 'form',
    areaIds: 'areaIds',
    levalList: 'levalList',
    ifUpdate: 'ifUpdate',
    setArr: noop,
    arr: 'arr',
    clearAreaIds: noop,
    setData: noop
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.relaxProps.setData('formFunctions', this.props.form);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      relaxProps: {
        selectedAreaIds,
        onFormChange,
        tagList,
        areaIds,
        levalList,
        ifUpdate,
        form
      }
    } = this.props;

    let arr = this.props.relaxProps.arr.toJS();

    const treeData = FindArea.findProvinceCity(selectedAreaIds);
    const tProps = {
      treeData,
      onChange: this._changeArea,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '???????????????',
      dropdownStyle: { maxHeight: 400 }
    };

    let customerTag = form.get('customerTag').toJS();

    console.log(form.get('groupName'));
    return (
      <div className="group">
        <div className="hidden">{ifUpdate}</div>
        <div className="check">
          <div className="title">????????????</div>
          <div className="wrap">
            <div
              className={arr[20].ifChecked ? 'item item-checked' : 'item'}
              onClick={() => {
                this.toggleItem(20);
              }}
            >
              ??????
            </div>
            <div
              className={arr[21].ifChecked ? 'item item-checked' : 'item'}
              onClick={() => {
                this.toggleItem(21);
              }}
            >
              ??????
            </div>
            <div
              className={arr[22].ifChecked ? 'item item-checked' : 'item'}
              onClick={() => {
                this.toggleItem(22);
              }}
            >
              ????????????
            </div>
            <div
              className={arr[18].ifChecked ? 'item item-checked' : 'item'}
              onClick={() => {
                this.toggleItem(18);
              }}
            >
              ????????????
            </div>
          </div>

          <div className="title" style={{ marginTop: '24px' }}>
            ????????????
          </div>
          <div className="wrap">
            {arr.slice(0, 18).map((item, index) => (
              <div
                key={item.id}
                className={item.ifChecked ? 'item item-checked' : 'item'}
                onClick={() => {
                  this.toggleItem(index);
                }}
              >
                {item.name}
              </div>
            ))}
          </div>
          <div className="title" style={{ marginTop: '14px' }}>
            ????????????
          </div>
          <div
            className={arr[19].ifChecked ? 'item item-checked' : 'item'}
            onClick={() => {
              this.toggleItem(19);
            }}
          >
            ????????????
          </div>
        </div>
        <Form className="form">
          <FormItem label="????????????" {...formItemLayout}>
            {getFieldDecorator('groupName', {
              initialValue: form.get('groupName'),
              rules: [
                { required: true, message: '?????????????????????' },
                { min: 1, max: 20, message: '??????1-20?????????' }
              ]
            })(
              <Input
                placeholder="??????1-20?????????"
                onChange={(e) => {
                  onFormChange({
                    field: 'groupName',
                    value: e.target.value
                  });
                }}
              />
            )}
          </FormItem>
          {arr[20].ifChecked && (
            <div className="inline-form">
              <FormItem
                label="??????"
                {...smallItemLayout}
                className="ant-col-sm-10"
              >
                {getFieldDecorator('gender', {
                  initialValue: form.get('gender'),
                  rules: [{ required: true, message: '???????????????' }]
                })(
                  <Select
                    dropdownStyle={{ zIndex: 1053 }}
                    onChange={(value) =>
                      onFormChange({
                        field: 'gender',
                        value: value
                      })
                    }
                  >
                    {[
                      { key: 0, name: '???' },
                      { key: 1, name: '???' }
                    ].map((v) => (
                      <Option key={v.key} value={v.key}>
                        {v.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </div>
          )}
          {arr[21].ifChecked && (
            <div className="inline-form">
              <FormItem
                label="??????"
                {...smallItemLayout}
                className="ant-col-sm-10 point"
              >
                {getFieldDecorator('gtAge', {
                  initialValue: form.get('gtAge'),
                  rules: [
                    {
                      pattern: /^(0|[1-9][0-9]*)$/,
                      message: '???????????????0?????????'
                    }
                  ]
                })(
                  <Input
                    placeholder=">="
                    onChange={(e) => {
                      onFormChange({
                        field: 'gtAge',
                        value: e.target.value
                      });
                    }}
                  />
                )}
              </FormItem>
              <div className="unit">-</div>
              <FormItem className="ant-col-sm-5 point">
                {getFieldDecorator('ltAge', {
                  initialValue: form.get('ltAge'),
                  rules: [
                    {
                      pattern: /^(0|[1-9][0-9]*)$/,
                      message: '???????????????0?????????'
                    }
                  ]
                })(
                  <Input
                    placeholder="<"
                    onChange={(e) => {
                      onFormChange({
                        field: 'ltAge',
                        value: e.target.value
                      });
                    }}
                  />
                )}
              </FormItem>
              <div className="unit">???</div>
            </div>
          )}
          {arr[22].ifChecked && (
            <div className="inline-form">
              <FormItem
                label="????????????"
                {...smallItemLayout}
                className="ant-col-sm-10 point"
              >
                {getFieldDecorator('gtAdmissionTime', {
                  initialValue: form.get('gtAdmissionTime'),
                  rules: [
                    {
                      pattern: /^(0|[1-9][0-9]*)$/,
                      message: '???????????????0?????????'
                    }
                  ]
                })(
                  <Input
                    placeholder=">="
                    onChange={(e) => {
                      onFormChange({
                        field: 'gtAdmissionTime',
                        value: e.target.value
                      });
                    }}
                  />
                )}
              </FormItem>
              <div className="unit">-</div>
              <FormItem className="ant-col-sm-5 point">
                {getFieldDecorator('ltAdmissionTime', {
                  initialValue: form.get('ltAdmissionTime'),
                  rules: [
                    {
                      pattern: /^(0|[1-9][0-9]*)$/,
                      message: '???????????????0?????????'
                    }
                  ]
                })(
                  <Input
                    placeholder="<"
                    onChange={(e) => {
                      onFormChange({
                        field: 'ltAdmissionTime',
                        value: e.target.value
                      });
                    }}
                  />
                )}
              </FormItem>
              <div className="unit">???</div>
            </div>
          )}
          {arr[18].ifChecked && (
            <FormItem label="????????????" required={true} {...formItemLayout}>
              {getFieldDecorator('regionList', {
                initialValue: areaIds,
                rules: [
                  {
                    required: true,
                    message: '???????????????'
                  }
                ]
              })(
                <TreeSelect
                  className="tree"
                  {...tProps}
                  filterTreeNode={(input, treeNode) =>
                    treeNode.props.title
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                />
              )}
            </FormItem>
          )}
          {arr[0].ifChecked && (
            <div className="inline-form">
              <FormItem
                label="??????????????????"
                {...smallItemLayout}
                className="ant-col-sm-10"
              >
                {getFieldDecorator('lastTradeTime', {
                  initialValue: form.get('lastTradeTime'),
                  rules: [{ required: true, message: '???????????????????????????' }]
                })(
                  <Select
                    dropdownStyle={{ zIndex: 1053 }}
                    onChange={(value) =>
                      onFormChange({
                        field: 'lastTradeTime',
                        value: value
                      })
                    }
                  >
                    <Option value={null}>?????????</Option>
                    {opts.map((v) => (
                      <Option key={v} value={v}>
                        {v}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <div className="unit">??????</div>
            </div>
          )}

          {arr[1].ifChecked && (
            <div className="inline-form">
              <FormItem
                label="??????????????????"
                {...smallItemLayout}
                className="ant-col-sm-10"
              >
                {getFieldDecorator('tradeCountTime', {
                  initialValue: form.get('tradeCountTime'),
                  rules: [{ required: true, message: '???????????????????????????' }]
                })(
                  <Select
                    dropdownStyle={{ zIndex: 1053 }}
                    onChange={(value) => {
                      onFormChange({
                        field: 'tradeCountTime',
                        value: value
                      });
                    }}
                  >
                    <Option value={null}>?????????</Option>
                    {opts.map((v) => (
                      <Option key={v} value={v}>
                        {v}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <div className="unit">??????</div>
              <FormItem className="ant-col-sm-5">
                {getFieldDecorator('gtTradeCount', {
                  initialValue: form.get('gtTradeCount'),
                  rules: [
                    {
                      pattern: /^(0|[1-9][0-9]*)$/,
                      message: '???????????????0?????????'
                    }
                  ]
                })(
                  <Input
                    placeholder=">="
                    onChange={(e) => {
                      onFormChange({
                        field: 'gtTradeCount',
                        value: e.target.value
                      });
                    }}
                  />
                )}
              </FormItem>
              <div className="unit">-</div>
              <FormItem className="ant-col-sm-5">
                {getFieldDecorator('ltTradeCount', {
                  initialValue: form.get('ltTradeCount'),
                  rules: [
                    {
                      pattern: /^(0|[1-9][0-9]*)$/,
                      message: '???????????????0?????????'
                    }
                  ]
                })(
                  <Input
                    placeholder="<"
                    onChange={(e) => {
                      onFormChange({
                        field: 'ltTradeCount',
                        value: e.target.value
                      });
                    }}
                  />
                )}
              </FormItem>
              <div className="unit">???</div>
            </div>
          )}

          {arr[2].ifChecked && (
            <div className="inline-form">
              <FormItem
                label="??????????????????"
                {...smallItemLayout}
                className="ant-col-sm-10"
              >
                {getFieldDecorator('tradeAmountTime', {
                  initialValue: form.get('tradeAmountTime'),
                  rules: [{ required: true, message: '???????????????' }]
                })(
                  <Select
                    dropdownStyle={{ zIndex: 1053 }}
                    onChange={(value) => {
                      onFormChange({
                        field: 'tradeAmountTime',
                        value: value
                      });
                    }}
                  >
                    <Option value={null}>?????????</Option>
                    {opts.map((v) => (
                      <Option key={v} value={v}>
                        {v}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <div className="unit">??????</div>
              <FormItem className="ant-col-sm-5">
                {getFieldDecorator('gtTradeAmount', {
                  initialValue: form.get('gtTradeAmount'),
                  rules: [
                    {
                      pattern: /^(0|[1-9][0-9]*)$/,
                      message: '???????????????0?????????'
                    }
                  ]
                })(
                  <Input
                    placeholder=">="
                    onChange={(e) => {
                      onFormChange({
                        field: 'gtTradeAmount',
                        value: e.target.value
                      });
                    }}
                  />
                )}
              </FormItem>
              <div className="unit">-</div>
              <FormItem className="ant-col-sm-5">
                {getFieldDecorator('ltTradeAmount', {
                  initialValue: form.get('ltTradeAmount'),
                  rules: [
                    {
                      pattern: /^(0|[1-9][0-9]*)$/,
                      message: '???????????????0?????????'
                    }
                  ]
                })(
                  <Input
                    placeholder="<"
                    onChange={(e) => {
                      onFormChange({
                        field: 'ltTradeAmount',
                        value: e.target.value
                      });
                    }}
                  />
                )}
              </FormItem>
              <div className="unit">???</div>
            </div>
          )}

          {arr[3].ifChecked && (
            <div className="inline-form">
              <FormItem
                label="?????????"
                {...smallItemLayout}
                className="ant-col-sm-10"
              >
                {getFieldDecorator('avgTradeAmountTime', {
                  initialValue: form.get('avgTradeAmountTime'),
                  rules: [{ required: true, message: '???????????????' }]
                })(
                  <Select
                    dropdownStyle={{ zIndex: 1053 }}
                    onChange={(value) => {
                      onFormChange({
                        field: 'avgTradeAmountTime',
                        value: value
                      });
                    }}
                  >
                    <Option value={null}>?????????</Option>
                    {opts.map((v) => (
                      <Option key={v} value={v}>
                        {v}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <div className="unit">??????</div>
              <FormItem className="ant-col-sm-5">
                {getFieldDecorator('gtAvgTradeAmount', {
                  initialValue: form.get('gtAvgTradeAmount'),
                  rules: [
                    {
                      pattern: /^(0|[1-9][0-9]*)$/,
                      message: '???????????????0?????????'
                    }
                  ]
                })(
                  <Input
                    placeholder=">="
                    onChange={(e) => {
                      onFormChange({
                        field: 'gtAvgTradeAmount',
                        value: e.target.value
                      });
                    }}
                  />
                )}
              </FormItem>
              <div className="unit">-</div>
              <FormItem className="ant-col-sm-5">
                {getFieldDecorator('ltAvgTradeAmount', {
                  initialValue: form.get('ltAvgTradeAmount'),
                  rules: [
                    {
                      pattern: /^(0|[1-9][0-9]*)$/,
                      message: '???????????????0?????????'
                    }
                  ]
                })(
                  <Input
                    placeholder="<"
                    onChange={(e) => {
                      onFormChange({
                        field: 'ltAvgTradeAmount',
                        value: e.target.value
                      });
                    }}
                  />
                )}
              </FormItem>
              <div className="unit">???</div>
            </div>
          )}

          {arr[4].ifChecked && (
            <FormItem {...formItemLayout} label="????????????">
              {getFieldDecorator('customerLevel', {
                initialValue: form.get('customerLevel').toJS(),
                rules: [{ required: true, message: '?????????????????????' }]
              })(
                <Select
                  mode="multiple"
                  placeholder="?????????????????????"
                  onChange={(value) =>
                    onFormChange({
                      field: 'customerLevel',
                      value: value
                    })
                  }
                >
                  {levalList.map((cate) => {
                    return (
                      <Option
                        key={cate.customerLevelId}
                        value={cate.customerLevelId}
                      >
                        {cate.customerLevelName}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          )}
          {arr[5].ifChecked && (
            <div className="inline-form">
              <FormItem
                label="???????????????"
                {...smallItemLayout}
                className="ant-col-sm-10"
              >
                {getFieldDecorator('gtCustomerGrowth', {
                  initialValue: form.get('gtCustomerGrowth'),
                  rules: [
                    {
                      pattern: /^(0|[1-9][0-9]*)$/,
                      message: '???????????????0?????????'
                    }
                  ]
                })(
                  <Input
                    placeholder="<"
                    onChange={(e) => {
                      onFormChange({
                        field: 'gtCustomerGrowth',
                        value: e.target.value
                      });
                    }}
                  />
                )}
              </FormItem>
              <div className="unit">-</div>
              <FormItem className="ant-col-sm-5">
                {getFieldDecorator('ltCustomerGrowth', {
                  initialValue: form.get('ltCustomerGrowth'),
                  rules: [
                    {
                      pattern: /^(0|[1-9][0-9]*)$/,
                      message: '???????????????0?????????'
                    }
                  ]
                })(
                  <Input
                    placeholder="<"
                    onChange={(e) => {
                      onFormChange({
                        field: 'ltCustomerGrowth',
                        value: e.target.value
                      });
                    }}
                  />
                )}
              </FormItem>
            </div>
          )}
          {arr[6].ifChecked && (
            <div className="inline-form">
              <FormItem
                label="????????????"
                {...smallItemLayout}
                className="ant-col-sm-10 point"
              >
                {getFieldDecorator('gtPoint', {
                  initialValue: form.get('gtPoint'),
                  rules: [
                    {
                      pattern: /^(0|[1-9][0-9]*)$/,
                      message: '???????????????0?????????'
                    }
                  ]
                })(
                  <Input
                    placeholder=">="
                    onChange={(e) => {
                      onFormChange({
                        field: 'gtPoint',
                        value: e.target.value
                      });
                    }}
                  />
                )}
              </FormItem>
              <div className="unit">-</div>
              <FormItem className="ant-col-sm-5 point">
                {getFieldDecorator('ltPoint', {
                  initialValue: form.get('ltPoint'),
                  rules: [
                    {
                      pattern: /^(0|[1-9][0-9]*)$/,
                      message: '???????????????0?????????'
                    }
                  ]
                })(
                  <Input
                    placeholder="<"
                    onChange={(e) => {
                      onFormChange({
                        field: 'ltPoint',
                        value: e.target.value
                      });
                    }}
                  />
                )}
              </FormItem>
              <div className="unit">???</div>
            </div>
          )}

          {arr[7].ifChecked && (
            <div className="inline-form">
              <FormItem
                label="????????????"
                {...smallItemLayout}
                className="ant-col-sm-10"
              >
                {getFieldDecorator('gtBalance', {
                  initialValue: form.get('gtBalance'),
                  rules: [
                    {
                      pattern: /^(0|[1-9][0-9]*)$/,
                      message: '???????????????0?????????'
                    }
                  ]
                })(
                  <Input
                    placeholder=">="
                    onChange={(e) => {
                      onFormChange({
                        field: 'gtBalance',
                        value: e.target.value
                      });
                    }}
                  />
                )}
              </FormItem>
              <div className="unit">-</div>
              <FormItem className="ant-col-sm-5">
                {getFieldDecorator('ltBalance', {
                  initialValue: form.get('ltBalance'),
                  rules: [
                    {
                      pattern: /^(0|[1-9][0-9]*)$/,
                      message: '???????????????0?????????'
                    }
                  ]
                })(
                  <Input
                    placeholder="<"
                    onChange={(e) => {
                      onFormChange({
                        field: 'ltBalance',
                        value: e.target.value
                      });
                    }}
                  />
                )}
              </FormItem>
              <div className="unit">???</div>
            </div>
          )}

          {arr.slice(8, 18).map(
            (item) =>
              item.ifChecked && (
                <div className="inline-form">
                  <FormItem
                    label={item.name}
                    className="ant-col-10"
                    {...shortFormLayout}
                  >
                    {getFieldDecorator(item.field[0], {
                      initialValue: form.get(item.field[0]),
                      rules: [{ required: true, message: `?????????${item.name}` }]
                    })(
                      <Select
                        dropdownStyle={{ zIndex: 1053 }}
                        onChange={(value) => {
                          onFormChange({
                            field: item.field[0],
                            value: value
                          });
                        }}
                      >
                        <Option value={null}>?????????</Option>
                        {opts.map((v) => (
                          <Option key={v} value={v}>
                            {v}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                  <div className="unit">??????</div>
                </div>
              )
          )}
          {arr[19].ifChecked && (
            <FormItem {...formItemLayout} label="????????????">
              {getFieldDecorator('customerTag', {
                initialValue: customerTag,
                rules: [{ required: true, message: '?????????????????????' }]
              })(
                <Select
                  mode="multiple"
                  placeholder="?????????????????????"
                  onChange={(value) =>
                    onFormChange({
                      field: 'customerTag',
                      value: value
                    })
                  }
                >
                  {tagList.map((tag) => {
                    return (
                      <Option key={tag.id} value={tag.id}>
                        {tag.name}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          )}
        </Form>
      </div>
    );
  }

  /**
   * ????????????Id
   */
  _changeArea = (value, label) => {
    this.props.relaxProps.areaIdsSave(value, label);
  };

  toggleItem = (index) => {
    const { setArr, onFormChange, clearAreaIds } = this.props.relaxProps;
    let a = this.props.relaxProps.arr.toJS();
    if (a[index].ifChecked) {
      if ([4, 19].indexOf(index) > -1) {
        onFormChange({ field: a[index].field[0], value: [] });
      } else if (index === 18) {
        clearAreaIds();
      } else {
        a[index].field.map((item) => {
          onFormChange({ field: item, value: null });
        });
      }
    }
    a[index].ifChecked = !a[index].ifChecked;
    setArr({ field: 'arr', value: a });
  };

  clearCustomerTag = () => {
    console.log(this.props.form);
    this.props.form.setFieldsValue({ customerTag: [] });
  };
}
