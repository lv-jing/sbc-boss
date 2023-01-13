import React from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  message,
  Table,
  Row,
  Col,
  Radio,
  Menu,
  Card,
  DatePicker,
  Empty,
  Spin,
  Popconfirm,
  TreeSelect
} from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './../webapi';
import { Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { Const } from 'qmkit';

const { SubMenu } = Menu;
const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

const { Column } = Table;
const { TreeNode } = TreeSelect;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

class PetInfomation extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      petForm: {
        petsId: '',
        petsType: '',
        petsName: '',
        petsSex: '',
        petsBreed: '',
        petsSizeValueName: '',
        sterilized: 0,
        birthOfPets: '',
        customerPetsPropRelations: [],
        selectedBind: []
      },
      taggingList: [],
      petList: [],
      petsType: [
        {
          value: 'dog',
          id: 1
        },
        {
          value: 'cat',
          id: 2
        }
      ],
      petGender: [
        {
          value: 'male',
          id: 0
        },
        {
          value: 'female',
          id: 1
        }
      ],
      sizeArr: ['Xsmall', 'Mini', 'Medium', 'Maxi', 'Giant'],
      customerPetsPropRelations: [
        'Age support',
        'Cardiac support',
        'Diabetes support',
        'Digestive support',
        'Joint support',
        'Oral/Dental hygiene',
        'Food sensitivities',
        'Kidney support',
        'Liver support',
        'Skin and Coat support',
        'Urinary support',
        'Weight management',
        'Convalescence',
        'Skin sensitivity',
        'Digestive sensitivity',
        'Joint sensitivity'
      ],
      catBreed: [],
      dogBreed: [],
      currentBirthDay: '2020-01-01',
      currentPet: {},
      loading: true,
      storeId: ''
    };
  }
  componentDidMount() {
    let loginInfo = JSON.parse(sessionStorage.getItem('s2b-supplier@login'));
    let storeId = loginInfo ? loginInfo.storeId : '';
    if (storeId) {
      this.setState({ storeId });
    }

    this.petsByConsumer();
    this.querySysDictionary('dogBreed');
    this.querySysDictionary('catBreed');
    this.getTaggingList();
  }
  handleChange = (value) => {};
  onOpenChange = (value) => {};
  onFormChange = ({ field, value }) => {
    let data = this.state.petForm;
    data[field] = value;
    this.setState({
      petForm: data
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        this.editPets();
        this.bindTagging();
      }
    });
  };

  querySysDictionary = (type: String) => {
    let params = {
      delFlag: 0,
      storeId: this.state.storeId,
      type: type
    };
    webapi
      .querySysDictionary(params)
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          if (type === 'dogBreed') {
            let dogBreed = res.context.sysDictionaryVOS;
            this.setState({
              dogBreed: dogBreed
            });
          }

          if (type === 'catBreed') {
            let catBreed = res.context.sysDictionaryVOS;
            this.setState({
              catBreed: catBreed
            });
          }
        } else {
          message.error(res.message || 'Unsuccessful');
        }
      })
      .catch((err) => {
        message.error(err.message || 'Unsuccessful');
      });
  };
  getSpecialNeeds = (array) => {
    let needs = [];
    if (array && array.length > 0) {
      for (let index = 0; index < array.length; index++) {
        needs.push(array[index].propName);
      }
    }
    return needs;
  };

  petsByConsumer = () => {
    let params = {
      consumerAccount: this.props.customerAccount
    };
    webapi
      .petsByConsumer(params)
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          let petList = res.context.context;
          if (petList.length > 0) {
            let currentPet = petList[0];

            let selectedBind = [];
            if (currentPet.segmentList) {
              for (let i = 0; i < currentPet.segmentList.length; i++) {
                const element = currentPet.segmentList[i].id;
                selectedBind.push(element);
              }
            }
            currentPet.selectedBind = selectedBind;
            currentPet.customerPetsPropRelations = this.getSpecialNeeds(
              currentPet.customerPetsPropRelations
            );

            if (currentPet.petsType === 'dog') {
              this.props.form.setFieldsValue({
                petsType: currentPet.petsType,
                petsName: currentPet.petsName,
                petsSex: currentPet.petsSex,
                petsBreed: currentPet.petsBreed,
                sterilized: +currentPet.sterilized,
                petsSizeValueName: currentPet.petsSizeValueName,
                customerPetsPropRelations: currentPet.customerPetsPropRelations,
                selectedBind: currentPet.selectedBind
              });
            } else {
              this.props.form.setFieldsValue({
                petsType: currentPet.petsType,
                petsName: currentPet.petsName,
                petsSex: currentPet.petsSex,
                petsBreed: currentPet.petsBreed,

                sterilized: +currentPet.sterilized,
                customerPetsPropRelations: currentPet.customerPetsPropRelations,
                selectedBind: currentPet.segmentList
              });
            }
            this.setState({
              loading: false,
              petList: petList,
              petForm: currentPet,
              currentBirthDay: currentPet.birthOfPets
            });
          } else {
            this.setState({
              loading: false
            });
          }
        } else {
          this.setState({
            loading: false
          });
          message.error(res.message || 'Unsuccessful');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.message || 'Unsuccessful');
      });
  };
  editPets = () => {
    this.setState({
      loading: false
    });
    const { petForm } = this.state;
    let customerPetsPropRelations = [];
    let propId = 100;
    for (let i = 0; i < petForm.customerPetsPropRelations.length; i++) {
      let prop = {
        delFlag: 0,
        detailId: 0,
        indexFlag: 0,
        petsId: this.state.currentPetId,
        propId: propId,
        propName: petForm.customerPetsPropRelations[i],
        relationId: '10086',
        sort: 0
      };
      customerPetsPropRelations.push(prop);
      propId += 1;
    }

    let pets = {
      birthOfPets: petForm.birthOfPets,
      petsBreed: petForm.petsBreed,
      petsId: petForm.petsId,
      petsName: petForm.petsName,
      petsSex: petForm.petsSex,
      petsSizeValueId: '0',
      petsSizeValueName:
        petForm.petsType === 'dog' ? petForm.petsSizeValueName : '',
      petsType: petForm.petsType,
      sterilized: +petForm.sterilized,
      storeId: this.state.storeId
    };
    let params = {
      customerPets: pets,
      customerPetsPropRelations: customerPetsPropRelations,
      storeId: this.state.storeId,
      userId: this.props.customerAccount
    };
    webapi
      .editPets(params)
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          message.success('Operate successfully');
          this.petsByConsumer();
        } else {
          message.error(res.message || 'Unsuccessful');
        }
      })
      .catch((err) => {
        message.error(err.message || 'Unsuccessful');
      });
  };

  petsById = (id) => {
    let params = {
      petsId: id
    };
    webapi
      .petsById(params)
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          let currentPet = res.context.context;
          let selectedBind = [];
          if (currentPet.segmentList) {
            for (let i = 0; i < currentPet.segmentList.length; i++) {
              const element = currentPet.segmentList[i].id;
              selectedBind.push(element);
            }
          }
          currentPet.selectedBind = selectedBind;
          currentPet.customerPetsPropRelations = this.getSpecialNeeds(
            currentPet.customerPetsPropRelations
          );
          if (currentPet.petsType === 'dog') {
            this.props.form.setFieldsValue({
              petsType: currentPet.petsType,
              petsName: currentPet.petsName,
              petsSex: currentPet.petsSex,
              petsBreed: currentPet.petsBreed,
              sterilized: +currentPet.sterilized,
              petsSizeValueName: currentPet.petsSizeValueName,
              customerPetsPropRelations: currentPet.customerPetsPropRelations,
              selectedBind: currentPet.selectedBind
            });
          } else {
            this.props.form.setFieldsValue({
              petsType: currentPet.petsType,
              petsName: currentPet.petsName,
              petsSex: currentPet.petsSex,
              petsBreed: currentPet.petsBreed,

              sterilized: +currentPet.sterilized,
              customerPetsPropRelations: currentPet.customerPetsPropRelations,
              selectedBind: currentPet.selectedBind
            });
          }

          this.setState({
            petForm: currentPet,
            currentBirthDay: currentPet.birthOfPets
          });
        } else {
          message.error(res.message || 'Unsuccessful');
        }
      })
      .catch((err) => {
        message.error(err.message || 'Unsuccessful');
      });
  };

  delPets = (id) => {
    let params = {
      petsIds: [id]
    };
    this.setState({
      loading: true
    });
    webapi
      .delPets(params)
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          message.success('Operate successfully');
          this.petsByConsumer();
        } else {
          this.setState({
            loading: false
          });
          message.error(res.message || 'Unsuccessful');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.message || 'Unsuccessful');
      });
    // const res = await delPets(params)
    // if (res.code === 'K-000000') {
    //   this.getPetList()
    // }
  };

  loopTagging = (taggingTotalTree) => {
    return (
      taggingTotalTree &&
      taggingTotalTree.map((item) => {
        return <TreeNode key={item.id} value={item.id} title={item.name} />;
      })
    );
  };
  getTaggingList = () => {
    let params = {
      pageNum: 0,
      pageSize: 1000,
      segmentType: 1,
      isPublished: 1
    };
    webapi
      .getTaggingList(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let taggingList = res.context.segmentList;
          this.setState({
            taggingList
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.toString() || 'Operation failure');
      });
  };
  bindTagging = () => {
    const { petForm } = this.state;
    let params = {
      relationId: petForm.petsId,
      segmentType: 1,
      segmentIdList: petForm.selectedBind
    };
    webapi
      .bindTagging(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.toString() || 'Operation failure');
      });
  };

  render() {
    const {
      petsType,
      petGender,
      sizeArr,
      customerPetsPropRelations,
      catBreed,
      dogBreed,
      petForm,
      taggingList
    } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Row>
        <Spin spinning={this.state.loading}>
          <Col span={3}>
            <h3>All Pets( {this.state.petList.length} )</h3>
            <ul>
              {this.state.petList
                ? this.state.petList.map((item) => (
                    <li
                      key={item.petsId}
                      style={{
                        cursor: 'pointer',
                        color: item.petsId === petForm.petsId ? '#e2001a' : ''
                      }}
                      onClick={() => this.petsById(item.petsId)}
                    >
                      {item.petsName}
                    </li>
                  ))
                : null}
            </ul>
          </Col>
          <Col span={20}>
            {this.state.petList.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : null}
            <Card
              title={this.state.title}
              style={{
                display: this.state.petList.length === 0 ? 'none' : 'block'
              }}
            >
              <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Row gutter={16}>
                  <Col span={12}>
                    <FormItem label="Pet Category">
                      {getFieldDecorator('petsType', {
                        rules: [
                          {
                            required: true,
                            message: 'Please select Pet Category!'
                          }
                        ]
                      })(
                        <Select
                          onChange={(value) => {
                            value = value === '' ? null : value;
                            this.onFormChange({
                              field: 'petsType',
                              value
                            });
                          }}
                        >
                          {petsType
                            ? petsType.map((item) => (
                                <Option value={item.value} key={item.id}>
                                  {item.value}
                                </Option>
                              ))
                            : null}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="Pet Name">
                      {getFieldDecorator('petsName', {
                        rules: [
                          { required: true, message: 'Please input Pet Name!' },

                          {
                            max: 50,
                            message: 'Exceed maximum length!'
                          }
                        ]
                      })(
                        <Input
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onFormChange({
                              field: 'petsName',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="Gender">
                      {getFieldDecorator('petsSex', {
                        rules: [
                          { required: true, message: 'Please select Gender!' }
                        ]
                      })(
                        <Select
                          onChange={(value) => {
                            value = value === '' ? null : value;
                            this.onFormChange({
                              field: 'petsSex',
                              value
                            });
                          }}
                        >
                          {petGender
                            ? petGender.map((item) => (
                                <Option value={item.id} key={item.id}>
                                  {item.value}
                                </Option>
                              ))
                            : null}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  {petForm.petsType === 'dog' ? (
                    <Col span={12}>
                      <FormItem label="Breed">
                        {getFieldDecorator('petsBreed', {
                          rules: [
                            {
                              required: true,
                              message: 'Please select Breed!'
                            }
                          ]
                        })(
                          <Select
                            showSearch
                            onChange={(value) => {
                              value = value === '' ? null : value;
                              this.onFormChange({
                                field: 'petsBreed',
                                value
                              });
                            }}
                          >
                            {dogBreed
                              ? dogBreed.map((item) => (
                                  <Option value={item.name} key={item.id}>
                                    {item.name}
                                  </Option>
                                ))
                              : null}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  ) : (
                    <Col span={12}>
                      <FormItem label="Breed">
                        {getFieldDecorator('petsBreed', {
                          rules: [
                            {
                              required: true,
                              message: 'Please select Breed!'
                            }
                          ]
                        })(
                          <Select
                            showSearch
                            onChange={(value) => {
                              value = value === '' ? null : value;
                              this.onFormChange({
                                field: 'petsBreed',
                                value
                              });
                            }}
                          >
                            {catBreed
                              ? catBreed.map((item) => (
                                  <Option value={item.name} key={item.id}>
                                    {item.name}
                                  </Option>
                                ))
                              : null}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  )}
                  {petForm.petsType === 'dog' ? (
                    <Col
                      span={12}
                      style={{
                        display: petForm.petsType === 'cat' ? 'none' : 'block'
                      }}
                    >
                      <FormItem label="Weight">
                        {getFieldDecorator('petsSizeValueName', {
                          rules: [
                            { required: true, message: 'Please input Weight!' }
                          ],
                          initialValue: petForm.petsSizeValueName
                        })(
                          <Select
                            onChange={(value) => {
                              value = value === '' ? null : value;
                              this.onFormChange({
                                field: 'petsSizeValueName',
                                value
                              });
                            }}
                          >
                            {sizeArr
                              ? sizeArr.map((item) => (
                                  <Option value={item} key={item}>
                                    {item}
                                  </Option>
                                ))
                              : null}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  ) : null}

                  <Col span={12}>
                    <FormItem label="Sterilized status">
                      {getFieldDecorator('sterilized', {
                        rules: [
                          {
                            required: true,
                            message: 'Please Select Sterilized status!'
                          }
                        ]
                      })(
                        <Radio.Group
                          onChange={(e) => {
                            let value = e.target.value;
                            this.onFormChange({
                              field: 'sterilized',
                              value
                            });
                          }}
                        >
                          <Radio value={1}>Yes</Radio>
                          <Radio value={0}>No</Radio>
                        </Radio.Group>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="Birthday">
                      {getFieldDecorator('birthOfPets', {
                        rules: [
                          {
                            required: true,
                            message: 'Please input Birth Date!'
                          }
                        ],
                        initialValue: moment(
                          new Date(this.state.currentBirthDay),
                          'DD/MM/YYYY'
                        )
                      })(
                        <DatePicker
                          style={{ width: '100%' }}
                          format="DD/MM/YYYY"
                          disabledDate={(current) => {
                            return current && current > moment().endOf('day');
                          }}
                          onChange={(date, dateString) => {
                            const value = dateString;
                            this.onFormChange({
                              field: 'birthOfPets',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="Special needs">
                      {getFieldDecorator('customerPetsPropRelations', {
                        rules: [
                          {
                            required: true,
                            message: 'Please Select Special needs!'
                          }
                        ]
                      })(
                        <Select
                          mode="tags"
                          placeholder="Please select"
                          style={{ width: '100%' }}
                          onChange={(value) => {
                            value = value === '' ? null : value;
                            this.onFormChange({
                              field: 'customerPetsPropRelations',
                              value
                            });
                          }}
                        >
                          {customerPetsPropRelations
                            ? customerPetsPropRelations.map((item) => (
                                <Option value={item} key={item}>
                                  {item}
                                </Option>
                              ))
                            : null}
                        </Select>
                      )}
                    </FormItem>
                  </Col>

                  <Col span={12}>
                    <FormItem {...formItemLayout} label="Pet owner tagging">
                      {getFieldDecorator('selectedBind', {
                        rules: [
                          {
                            required: false,
                            message: 'Please select product tagging'
                          }
                        ]
                      })(
                        <TreeSelect
                          getPopupContainer={(trigger: any) =>
                            trigger.parentNode
                          }
                          treeCheckable={true}
                          showCheckedStrategy={(TreeSelect as any).SHOW_ALL}
                          // treeCheckStrictly={true}
                          placeholder="Please select product tagging"
                          notFoundContent="No classification"
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                          showSearch={false}
                          onChange={(value) =>
                            this.onFormChange({
                              field: 'selectedBind',
                              value
                            })
                          }
                        >
                          {this.loopTagging(taggingList)}
                        </TreeSelect>
                      )}
                    </FormItem>
                  </Col>

                  <Col span={24}>
                    <FormItem>
                      {/* <Button type="primary" htmlType="submit">
                        Save
                      </Button> */}

                      {/* <Popconfirm
                        placement="topRight"
                        title="Are you sure to delete this item?"
                        onConfirm={() => this.delPets(petForm.petsId)}
                        okText="Confirm"
                        cancelText="Cancel"
                      >
                        <Button
                          style={{
                            marginLeft: '20px',
                            display:
                              this.props.customerType === 'Guest'
                                ? 'none'
                                : null
                          }}
                        >
                          <FormattedMessage id="delete" />
                        </Button>
                      </Popconfirm> */}

                      <Button style={{ marginLeft: '20px' }}>
                        <Link to="/customer-list">Cancel</Link>
                      </Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Spin>
      </Row>
    );
  }
}
export default Form.create()(PetInfomation);
