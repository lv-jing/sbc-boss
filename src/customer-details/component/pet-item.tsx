import React from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Select,
  Radio,
  Spin,
  DatePicker,
  Button,
  Popconfirm,
  Icon,
  message,
  Divider,
  Avatar
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Headline, history, AssetManagement, cache, RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import {
  petsById,
  editPets,
  delPets,
  getMixedBreedDisplayName,
  refreshPetLifeStage
} from '../webapi';
import { getPetsBreedListByType } from '../member-detail';
import { getTaggingList } from './webapi';
import { setTagging } from '../webapi';

const { Option } = Select;
const dogImg = require('../img/dog.png');
const catImg = require('../img/cat.png');
const stageKeyMapping = {
  firstLifeStageName: RCi18n({ id: 'PetOwner.firstStageName' }),
  secondLifeStageName: RCi18n({ id: 'PetOwner.secondStageName' }),
  thirdLifeStageName: RCi18n({ id: 'PetOwner.thirdStageName' }),
  fourthLifeStageName: RCi18n({ id: 'PetOwner.fourthStageName' })
};

interface Iprop extends FormComponentProps {
  petId?: string;
  petsInfo?: any;
}

const calcPetWeight = (jsonStr: string) => {
  try {
    const weightObj = JSON.parse(jsonStr);
    return `${weightObj['measure']} ${weightObj['measureUnit']}`;
  } catch (e) {
    return '';
  }
};

export async function getSpecialNeedsList() {
  // const storeId =
  //   JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}')['storeId'] ??
  //   '0';
  // const storeLan = (window as any).countryEnum[storeId] ?? 'mx';
  // if (storeLan === 'us') {
  //   return await Promise.all([
  //     getPetsBreedListByType('specialneeds_dog'),
  //     getPetsBreedListByType('specialneeds_cat')
  //   ]).then(([dogList, catList]) => ({
  //     dogSpecialNeeds: dogList,
  //     catSpecialNeeds: catList
  //   }));
  // } else if (storeLan === 'tr' || storeLan === 'ru' || storeLan === 'fr') {
  //   return await Promise.all([
  //     getPetsBreedListByType('sensitivity_dog'),
  //     getPetsBreedListByType('sensitivity_cat')
  //   ]).then(([dogList, catList]) => ({
  //     dogSpecialNeeds: dogList,
  //     catSpecialNeeds: catList
  //   }));
  // } else {
  //   return await getPetsBreedListByType('specialNeeds').then((specialList) => ({
  //     dogSpecialNeeds: specialList,
  //     catSpecialNeeds: specialList
  //   }));
  // }
  return await Promise.all([
    getPetsBreedListByType('specialneeds_dog'),
    getPetsBreedListByType('sensitivity_dog'),
    getPetsBreedListByType('specialneeds_cat'),
    getPetsBreedListByType('sensitivity_cat'),
    getPetsBreedListByType('specialNeeds')
  ]).then(([dogList1, dogList2, catList1, catList2, allList]) => ({
    dogSpecialNeeds: [].concat(dogList1, dogList2, allList),
    catSpecialNeeds: [].concat(catList1, catList2, allList)
  }));
}

class PetItem extends React.Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      loading: false,
      stageLoading: false,
      show: false,
      editable: false,
      pet: {},
      petImg: '',
      catBreed: [],
      dogBreed: [],
      dogSpecialNeeds: [],
      catSpecialNeeds: [],
      tagList: [],
      stageList: [],
      customerPetsPropRelationList: [
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
      ]
    };
  }

  componentDidMount() {
    this.getPet();
    this.getPetLifeStage();
    //this.getTaggingList();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { petsInfo } = nextProps;
    if (petsInfo) {
      const pet = petsInfo;
      const newPetInfo = {
        ...pet,
        petsBreedName: pet.isPurebred
          ? (pet.petsType === 'dog'
              ? prevState.dogBreed
              : prevState.catBreed
            ).find(
              (b) => b.value === pet.petsBreed || b.valueEn === pet.petsBreed
            )?.name ?? pet.petsBreed
          : getMixedBreedDisplayName(),
        needs: pet.needs
          ? pet.needs
              .split(',')
              .map(
                (need) =>
                  (pet.petsType === 'dog'
                    ? prevState.dogSpecialNeeds
                    : prevState.catSpecialNeeds
                  ).find((n) => n.value === need || n.valueEn === need)?.name ??
                  need
              )
              .join(',')
          : ''
      };
      if (petsInfo !== prevState.pet) {
        return {
          pet: newPetInfo,
          petImg: newPetInfo && newPetInfo.petsImg ? newPetInfo.petsImg : '',
          loading: false
        };
      }
    }
    return null;
  }

  getPet = async () => {
    this.setState({ loading: true });
    let { dogBreed, catBreed, dogSpecialNeeds, catSpecialNeeds } = this.state;
    let specialNeeds = { dogSpecialNeeds: [], catSpecialNeeds: [] };
    if (
      dogBreed.length === 0 &&
      catBreed.length === 0 &&
      dogSpecialNeeds.length === 0 &&
      catSpecialNeeds.length === 0
    ) {
      [dogBreed, catBreed, specialNeeds] = await Promise.all([
        getPetsBreedListByType('dogBreed'),
        getPetsBreedListByType('catBreed'),
        getSpecialNeedsList()
      ]);
      this.setState({
        dogBreed,
        catBreed,
        dogSpecialNeeds: specialNeeds.dogSpecialNeeds,
        catSpecialNeeds: specialNeeds.catSpecialNeeds
      });
    }
    if (this.props.petId) {
      petsById({ petsId: this.props.petId })
        .then((data) => {
          const pet = data.res.context?.context ?? {};
          this.setState({
            pet: {
              ...pet,
              petsBreedName: pet.isPurebred
                ? (pet.petsType === 'dog' ? dogBreed : catBreed).find(
                    (b) =>
                      b.value === pet.petsBreed || b.valueEn === pet.petsBreed
                  )?.name ?? pet.petsBreed
                : getMixedBreedDisplayName(),
              needs: pet.needs
                ? pet.needs
                    .split(',')
                    .map(
                      (need) =>
                        (pet.petsType === 'dog'
                          ? specialNeeds.dogSpecialNeeds
                          : specialNeeds.catSpecialNeeds
                        ).find((n) => n.value === need || n.valueEn === need)
                          ?.name ?? need
                    )
                    .join(',')
                : ''
            },
            petImg: pet.petsImg || '',
            loading: false
          });
        })
        .catch(() => {
          this.setState({
            loading: false
          });
        });
    }
  };

  getPetLifeStage = () => {
    if (this.props.petId || this.props.petsInfo) {
      this.setState({ stageLoading: true });
      refreshPetLifeStage(this.props.petId || this.props.petsInfo?.petsId)
        .then((data) => {
          this.setState({
            stageLoading: false,
            stageList: data.res.context ?? []
          });
        })
        .catch(() => {
          this.setState({
            stageLoading: false
          });
        });
    }
  };

  savePet = () => {
    this.props.form.validateFields((err, fields) => {
      if (!err) {
        this.setState({ loading: true });
        const customerPetsPropRelations =
          fields.customerPetsPropRelations.reduce((prev, curr, idx) => {
            prev.push({
              delFlag: 0,
              detailId: 0,
              indexFlag: 0,
              petsId: this.props.petId,
              propId: 100 + idx,
              propName: curr,
              relationId: '10086',
              sort: 0
            });
            return prev;
          }, []);
        const params = {
          customerPets: {
            ...fields,
            petsId: this.props.petId,
            petsImg: this.state.petImg,
            birthOfPets: fields.birthOfPets.format('YYYY-MM-DD'),
            customerPetsPropRelations: customerPetsPropRelations,
            petsSizeValueId: '0',
            storeId: 123456858
          },
          customerPetsPropRelations: customerPetsPropRelations,
          segmentIdList: fields.segmentIdList,
          storeId: 123456858,
          userId: this.state.pet.consumerAccount
        };
        editPets(params)
          .then((data) => {
            message.success(data.res.message);
            history.go(-1);
          })
          .catch(() => {
            this.setState({
              loading: false
            });
          });
      }
    });
  };

  deletePet = () => {
    this.setState({
      loading: true
    });
    delPets({
      petsIds: [this.props.petId]
    })
      .then((data) => {
        message.success(data.res.message);
        history.go(-1);
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  };

  onChangePetType = (petType: string) => {
    this.setState({
      petType: petType
    });
  };

  getTaggingList = () => {
    getTaggingList().then((data) => {
      this.setState({
        tagList: data.res.context.segmentList
      });
    });
  };

  onChooseImg = (images) => {
    this.setState({
      petImg: images && images.length > 0 ? images[0] : ''
    });
  };

  onDeleteImg = () => {
    this.setState({
      petImg: ''
    });
  };

  onShowOrHide = (show: boolean) => {
    this.setState({
      show: show
    });
  };

  onSelectPetTagging = (tagNames) => {
    const { tagList } = this.state;
    this.setState({
      pet: {
        ...this.state.pet,
        segmentList: tagNames.map((tagName) => ({ name: tagName }))
      }
    });
    setTagging({
      relationId: this.state.pet.petsId,
      segmentType: 1,
      segmentIdList: tagList
        .filter(
          (tag) => tagNames.indexOf(tag.name) > -1 && tag.segmentType == 1
        )
        .map((tag) => tag.id)
    }).then(() => {});
  };

  render() {
    const { loading, show, pet, petImg, editable } = this.state;
    const { getFieldDecorator } = this.props.form;
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
    const breedOptions =
      pet.petType === 'dog' ? this.state.dogBreed : this.state.catBreed;
    return (
      <Spin spinning={loading}>
        <div className="container petowner-noedit-form">
          {this.props.petsInfo ? null : (
            <Headline title={RCi18n({ id: 'PetOwner.PetInformation' })} />
          )}
          <Form {...formItemLayout}>
            <Row gutter={16}>
              <Col span={4} style={{ paddingLeft: '30px' }}>
                <div style={{ margin: 40 }}>
                  {editable ? (
                    <AssetManagement
                      images={
                        petImg && petImg.startsWith('http') ? [petImg] : []
                      }
                      choosedImgCount={1}
                      selectImgFunction={this.onChooseImg}
                      deleteImgFunction={this.onDeleteImg}
                    />
                  ) : (
                    <Avatar
                      size={70}
                      src={
                        petImg && petImg.startsWith('http')
                          ? petImg
                          : pet.petsType === 'dog'
                          ? dogImg
                          : catImg
                      }
                    />
                  )}
                </div>
              </Col>
              <Col span={20}>
                {this.props.petsInfo ? null : (
                  <Row gutter={16}>
                    <Col span={24}>
                      <div style={{ fontSize: 16, color: '#666' }}>
                        <FormattedMessage id="PetOwner.BasicInformation" />
                      </div>
                    </Col>
                  </Row>
                )}
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label={RCi18n({ id: 'PetOwner.PetCategory' })}>
                      {editable ? (
                        getFieldDecorator('petsType', {
                          initialValue: pet.petsType,
                          rules: [
                            {
                              required: true,
                              message: 'Pet category is required'
                            }
                          ]
                        })(
                          <Select onChange={this.onChangePetType}>
                            <Option value="dog" key="dog">
                              Dog
                            </Option>
                            <Option value="cat" key="cat">
                              Cat
                            </Option>
                          </Select>
                        )
                      ) : (
                        <span>{pet.petsType}</span>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={RCi18n({ id: 'PetOwner.Name' })}>
                      {editable ? (
                        getFieldDecorator('petsName', {
                          initialValue: pet.petsName,
                          rules: [
                            { required: true, message: 'Pet name is required' }
                          ]
                        })(<Input />)
                      ) : (
                        <span>{pet.petsName}</span>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={RCi18n({ id: 'PetOwner.Gender' })}>
                      {editable ? (
                        getFieldDecorator('petsSex', {
                          initialValue: pet.petsSex,
                          rules: [
                            { required: true, message: 'Gender is required' }
                          ]
                        })(
                          <Select>
                            <Option value={0} key="0">
                              male
                            </Option>
                            <Option value={1} key="1">
                              female
                            </Option>
                          </Select>
                        )
                      ) : (
                        <span>
                          {pet.petsSex == 0
                            ? 'male'
                            : pet.petsSex == 1
                            ? 'female'
                            : ''}
                        </span>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={RCi18n({ id: 'PetOwner.Breed' })}>
                      {editable ? (
                        getFieldDecorator('petsBreed', {
                          initialValue: pet.petsBreed,
                          rules: [
                            {
                              required: true,
                              message: 'Breeder code is required'
                            }
                          ]
                        })(
                          <Select showSearch>
                            {breedOptions.map((breedItem) => (
                              <Option
                                value={breedItem.value}
                                key={breedItem.id}
                              >
                                {breedItem.name}
                              </Option>
                            ))}
                          </Select>
                        )
                      ) : (
                        <span>{pet.petsBreedName}</span>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={RCi18n({ id: 'PetOwner.AdultSize' })}>
                      {editable ? (
                        getFieldDecorator('petsSizeValueName', {
                          initialValue: pet.petsSizeValueName,
                          rules: [
                            { required: true, message: 'Weight is required' }
                          ]
                        })(
                          <Select>
                            {['Xsmall', 'Mini', 'Medium', 'Maxi', 'Giant'].map(
                              (size, idx) => (
                                <Option value={size} key={idx}>
                                  {size}
                                </Option>
                              )
                            )}
                          </Select>
                        )
                      ) : (
                        <span>{pet.petsSizeValueName}</span>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={RCi18n({ id: 'PetOwner.SterilizedStatus' })}
                    >
                      {editable ? (
                        getFieldDecorator('sterilized', {
                          initialValue: pet.sterilized,
                          rules: [
                            {
                              required: true,
                              message: 'Sterilized status is required'
                            }
                          ]
                        })(
                          <Radio.Group>
                            <Radio value={1}>Yes</Radio>
                            <Radio value={0}>No</Radio>
                          </Radio.Group>
                        )
                      ) : (
                        <span>
                          {pet.sterilized == 1
                            ? 'Yes'
                            : pet.sterilized == 0
                            ? 'No'
                            : ''}
                        </span>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={RCi18n({ id: 'PetOwner.isPureBreed' })}>
                      {editable ? (
                        getFieldDecorator('isPurebred', {
                          initialValue: pet.isPurebred,
                          rules: [
                            {
                              required: true,
                              message: 'Pure-breed is required'
                            }
                          ]
                        })(
                          <Radio.Group>
                            <Radio value={1}>Yes</Radio>
                            <Radio value={0}>No</Radio>
                          </Radio.Group>
                        )
                      ) : (
                        <span>
                          {pet.isPurebred == 1
                            ? 'Yes'
                            : pet.isPurebred == 0
                            ? 'No'
                            : ''}
                        </span>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={RCi18n({ id: 'PetOwner.BirthDate' })}>
                      {editable ? (
                        getFieldDecorator('birthOfPets', {
                          initialValue: moment(pet.birthOfPets, 'YYYY-MM-DD'),
                          rules: [
                            { required: true, message: 'Birth is required' }
                          ]
                        })(
                          <DatePicker
                            style={{ width: '100%' }}
                            format="YYYY-MM-DD"
                            disabledDate={(current) => {
                              return current && current > moment().endOf('day');
                            }}
                          />
                        )
                      ) : (
                        <span>
                          {pet.birthOfPets
                            ? moment(pet.birthOfPets, 'YYYY-MM-DD').format(
                                'YYYY-MM-DD'
                              )
                            : ''}
                        </span>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={RCi18n({ id: 'PetOwner.Weight' })}>
                      <span>{pet.weight ? calcPetWeight(pet.weight) : ''}</span>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={RCi18n({ id: 'PetOwner.Activity' })}>
                      <span>{pet.activity}</span>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={RCi18n({ id: 'PetOwner.lifeStyle' })}>
                      <span>{pet.lifestyle}</span>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={RCi18n({ id: 'PetOwner.SpecialNeeds' })}>
                      {editable ? (
                        getFieldDecorator('customerPetsPropRelations', {
                          initialValue: pet.customerPetsPropRelations
                            ? pet.customerPetsPropRelations.map(
                                (v) => v.propName
                              )
                            : null,
                          rules: [
                            {
                              required: true,
                              message: 'Special needs is required'
                            }
                          ]
                        })(
                          <Select mode="tags">
                            {this.state.customerPetsPropRelationList.map(
                              (p, i) => (
                                <Option value={p} key={i}>
                                  {p}
                                </Option>
                              )
                            )}
                          </Select>
                        )
                      ) : (
                        <span>{pet.needs}</span>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    {this.props.petsInfo ? (
                      <Form.Item label={RCi18n({ id: 'PetOwner.petTagging' })}>
                        {pet.segmentList && pet.segmentList.length > 0
                          ? pet.segmentList.map((v) => v.name).join(',')
                          : null}
                      </Form.Item>
                    ) : (
                      <Form.Item label={RCi18n({ id: 'PetOwner.petTagging' })}>
                        {editable ? (
                          getFieldDecorator('segmentIdList', {
                            initialValue: pet.segmentList
                              ? pet.segmentList.map((v) => v.id)
                              : []
                          })(
                            <Select
                              mode="multiple"
                              getPopupContainer={(trigger: any) =>
                                trigger.parentNode
                              }
                            >
                              {this.state.tagList
                                .filter((t) => t.segmentType == 1)
                                .map((v, idx) => (
                                  <Option value={v.id} key={idx}>
                                    {v.name}
                                  </Option>
                                ))}
                            </Select>
                          )
                        ) : (
                          <span>{pet.segmentList ? pet.segmentList.map((v) => v.name).join(', ') : ''}</span>
                          // <Select
                          //   mode="multiple"
                          //   value={
                          //     pet.segmentList
                          //       ? pet.segmentList.map((v) => v.name)
                          //       : []
                          //   }
                          //   onChange={this.onSelectPetTagging}
                          //   getPopupContainer={(trigger: any) =>
                          //     trigger.parentNode
                          //   }
                          // >
                          //   {this.state.tagList
                          //     .filter((t) => t.segmentType == 1)
                          //     .map((v, idx) => (
                          //       <Option value={v.name} key={idx}>
                          //         {v.name}
                          //       </Option>
                          //     ))}
                          // </Select>
                        )}
                      </Form.Item>
                    )}
                  </Col>
                </Row>
                <Divider />
                <Row gutter={16} type="flex" align="middle">
                  <Col span={16}>
                    <div style={{ fontSize: 16, color: '#666' }}>
                      {RCi18n({ id: 'PetOwner.lifeStageInformation' })}
                    </div>
                  </Col>
                  <Col span={8} style={{ textAlign: 'right' }}>
                    <Button
                      type="link"
                      size="small"
                      disabled={this.state.stageLoading}
                      onClick={this.getPetLifeStage}
                    >
                      <Icon type="sync" spin={this.state.stageLoading} />
                      {this.state.stageLoading
                        ? RCi18n({ id: 'PetOwner.Loading' })
                        : RCi18n({ id: 'PetOwner.Refresh' })}
                    </Button>
                  </Col>
                </Row>
                <Row gutter={16}>
                  {this.state.stageList.map((stage, idx) => (
                    <Col key={idx} span={12}>
                      <Form.Item
                        label={
                          stageKeyMapping[stage.propType] ??
                          RCi18n({ id: 'PetOwner.stageEnding' })
                        }
                      >
                        {stage.propName}
                      </Form.Item>
                    </Col>
                  ))}
                </Row>
                <Divider />
                <div>
                  <a
                    style={{ fontSize: 16 }}
                    className="ant-btn-link"
                    onClick={(e) => {
                      e.preventDefault();
                      this.onShowOrHide(!show);
                    }}
                  >
                    {show
                      ? RCi18n({ id: 'PetOwner.hideMoreFields' })
                      : RCi18n({ id: 'PetOwner.showMoreFields' })}{' '}
                    <Icon type={show ? 'up' : 'down'} />
                  </a>
                  <div style={{ display: show ? 'block' : 'none' }}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'PetOwner.petID' })}>
                          {pet.petSourceId}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({ id: 'PetOwner.petOwnerID' })}
                        >
                          {pet.ownerId}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'PetOwner.breederID' })}>
                          {pet.breederId}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'PetOwner.vetID' })}>
                          {pet.vetId}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({ id: 'PetOwner.deathReason' })}
                        >
                          {pet.reasonOfDeath}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'PetOwner.Weight' })}>
                          {pet.weightAdded == 1
                            ? 'Yes'
                            : pet.weightAdded == 0
                            ? 'No'
                            : ''}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({ id: 'PetOwner.reproductionStatus' })}
                        >
                          {pet.reproductionStatusCode == 1
                            ? 'Yes'
                            : pet.reproductionStatusCode == 0
                            ? 'No'
                            : ''}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'PetOwner.ICD' })}>
                          {pet.icd}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({ id: 'PetOwner.petCertificateID' })}
                        >
                          {pet.certificateId}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({
                            id: 'PetOwner.certificateInformation'
                          })}
                        >
                          {pet.certificateInfo}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'PetOwner.coatColor' })}>
                          {pet.coatColour}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({
                            id: 'PetOwner.ComplementaryInformation'
                          })}
                        >
                          {pet.complementaryInformation}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'PetOwner.deathDate' })}>
                          {pet.deathDate
                            ? moment(pet.deathDate).format('DD/MM/YYYY')
                            : ''}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({ id: 'PetOwner.description' })}
                        >
                          {pet.description}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({ id: 'PetOwner.distinctivesSigns' })}
                        >
                          {pet.distinctiveSigns}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'PetOwner.hairColor' })}>
                          {pet.hair}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({ id: 'PetOwner.reproducer' })}
                        >
                          {pet.isReproducer == 1
                            ? 'Yes'
                            : pet.isReproducer
                            ? 'No'
                            : ''}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'PetOwner.reason' })}>
                          {pet.reason}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({ id: 'PetOwner.microshipID' })}
                        >
                          {pet.microchipId}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({ id: 'PetOwner.geneticCode' })}
                        >
                          {pet.geneticCode}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({ id: 'PetOwner.pathologies' })}
                        >
                          {pet.pathologies}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({ id: 'PetOwner.pedigreeName' })}
                        >
                          {pet.pedigreeName}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'PetOwner.value' })}>
                          {pet.value}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({ id: 'PetOwner.weightCategory' })}
                        >
                          {pet.weightCategory}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'PetOwner.species' })}>
                          {pet.speciesCode}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({ id: 'PetOwner.sterilisationStatus' })}
                        >
                          {pet.sterilisation == 1
                            ? 'Yes'
                            : pet.sterilisation
                            ? 'No'
                            : ''}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'PetOwner.status' })}>
                          {pet.status}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'PetOwner.tags' })}>
                          {pet.tags}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'PetOwner.tatooID' })}>
                          {pet.tattooId}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'PetOwner.birthTime' })}>
                          {pet.timeOfBirth}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'PetOwner.deathTime' })}>
                          {pet.timeOfDeath}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({ id: 'PetOwner.treatments' })}
                        >
                          {pet.treatments}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({ id: 'PetOwner.vaccinations' })}
                        >
                          {pet.vaccinations}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({ id: 'PetOwner.breederPrescription' })}
                        >
                          {pet.breederPrescription}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({ id: 'PetOwner.idealBodyWeight' })}
                        >
                          {pet.idealBodyWeight}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({ id: 'PetOwner.targetWeight' })}
                        >
                          {pet.adultTargetWeight}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({ id: 'PetOwner.lastPetStatus' })}
                        >
                          {pet.lastPetStatus}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({ id: 'PetOwner.currentRisk' })}
                        >
                          {pet.currentRisk}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({ id: 'PetOwner.lastWeight' })}
                        >
                          {pet.lastWeight}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({ id: 'PetOwner.birthWeight' })}
                        >
                          {pet.birthWeight}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({ id: 'PetOwner.after48hWeight' })}
                        >
                          {pet.weight48h}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'PetOwner.lofNumber' })}>
                          {pet.lofNumber}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({ id: 'PetOwner.motherLofNumber' })}
                        >
                          {pet.motherLofNumber}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={RCi18n({ id: 'PetOwner.fatherLofNumber' })}
                        >
                          {pet.fatherLofNumber}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'PetOwner.size' })}>
                          {pet.size}
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        {this.props.petsInfo ? null : (
          <div className="bar-button">
            {editable && (
              <Button
                type="primary"
                onClick={this.savePet}
                style={{ marginRight: '20px' }}
              >
                {RCi18n({ id: 'PetOwner.Save' })}
              </Button>
            )}
            <Button
              onClick={() => {
                history.go(-1);
              }}
            >
              {RCi18n({ id: 'PetOwner.Cancel' })}
            </Button>
          </div>
        )}
      </Spin>
    );
  }
}

export default Form.create<Iprop>()(PetItem);
