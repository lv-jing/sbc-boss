import * as React from 'react';
import * as Immutable from 'immutable';
import * as D2cLinkApi from '../../common/d2c-link-api';
import { Button, Form, Input, Pagination, Select } from 'antd';
import { Const, SelectGroup } from 'qmkit';
import moment from 'moment';
const FormItem = Form.Item;
// 自定义生成key规则:
const createGrouponKey = ({ goodsInfoId, grouponActivityId }) =>
  goodsInfoId + '/' + grouponActivityId;
const createFlashKey = ({ goodsInfoId, id }) => goodsInfoId + '/' + id;
const createFullKey = ({ marketingId }) => marketingId;
let defaultImg = require('../img/defaultImg.png');

export default class LinkPagePromotion extends React.Component<any, any> {
  props: {
    apiHost: string;
    chooseData: any;
    info: string;
    src: string;
    systemCode: string;
    changeSelect: Function;
  };

  constructor(props) {
    super(props);
    this.state = {
      activeGrouponKey: createGrouponKey(props.chooseData.toJS()) || '',
      activeFlashKey: createFlashKey(props.chooseData.toJS()) || '',
      activeFullKey: createFullKey(props.chooseData.toJS()) || '',
      cateKey: props.chooseData.toJS().cateKey || 'groupon',
      grouponList: [], //拼团列表
      flashList: [], //秒杀列表
      fullList: [], //满系列表,
      value: undefined,
      pageSize: 6,
      total: 1, //总页数

      goodsInfoName: '',
      grouponCateList: [], //拼团分类列表
      grouponCateId: null, //拼团分类id
      grouponStatus: 3, //拼团状态

      goodsName: '',
      flashCateList: [], //秒杀分类列表
      flashCateId: null, //秒杀分类id
      flashStatus: 3, //秒杀状态

      activityName: '', //活动名称
      activityType: null, //活动类型
      activityStatus: 5 //活动状态
    };
  }

  static defaultProps = {
    chooseData: Immutable.Map(), //选择的对象
    textValPath: [], //req 对应组件配置的属性路径，由用户配置
    placeholder: '',
    textVal: '', //由用户配置自动生成的．
    info: '', //需要提取的信息...关键字以逗号间隔..
    src: '',
    apiHost: '',
    systemCode: '',
    changeSelect: () => {}
  };

  componentDidMount() {
    this._fetchGoodsList({ cateKey: this.state.cateKey || 'groupon' });
    this._fetchCateList({ cateKey: this.state.cateKey || 'groupon' });
    this.props.changeSelect(this.props.chooseData.toJS());
  }

  /**
   * 渲染出所有的可选商品列表，若 ID 和之前用户所选的 ID 一致，则改商品默认显示勾选状态isChoose
   */
  render() {
    let {
      grouponList,
      flashList,
      fullList,
      total,
      cateKey,
      activeGrouponKey,
      activeFlashKey,
      activeFullKey,

      goodsInfoName,
      grouponCateId,
      grouponCateList,
      grouponStatus,

      goodsName,
      flashCateList,
      flashStatus,

      activityType,
      activityStatus
    } = this.state;
    let groupon = cateKey === 'groupon';
    let flash = cateKey === 'flash';
    let full = cateKey === 'full';
    return (
      <div className="promotion-page-content webpages">
        <div className="promotion-cate">
          {promotionCate.map((v) => {
            return (
              <div
                className={v.key === cateKey ? 'cate-item active' : 'cate-item'}
                key={v.key}
                onClick={() => {
                  this._changeCateKey(v.key);
                }}
              >
                <img src={v.img} alt="" width={24} height={24} />
                <span>{v.name}</span>
              </div>
            );
          })}
        </div>

        <div className="page-content">
          {groupon && (
            <Form className="filter-content" layout="inline">
              <FormItem>
                <Input
                  addonBefore="商品名称"
                  placeholder="请输入商品名称"
                  onChange={(e: any) => {
                    this.setState({ goodsInfoName: e.target.value });
                  }}
                />
              </FormItem>
              <FormItem>
                <SelectGroup
                  getPopupContainer={() =>
                    document.getElementById('DialogChooseUnit')
                  }
                  label="拼团分类"
                  defaultValue={'全部'}
                  onChange={(value) => {
                    this.setState({ grouponCateId: value });
                  }}
                >
                  <Select.Option key={'全部'} value={null}>
                    全部
                  </Select.Option>
                  {grouponCateList.map((item) => (
                    <Select.Option
                      key={item.grouponCateId}
                      value={item.grouponCateId}
                    >
                      {item.grouponCateName}
                    </Select.Option>
                  ))}
                </SelectGroup>
              </FormItem>

              <FormItem>
                <SelectGroup
                  getPopupContainer={() =>
                    document.getElementById('DialogChooseUnit')
                  }
                  label="拼团状态"
                  defaultValue={grouponStatus}
                  onChange={(value) => {
                    this.setState({ grouponStatus: value });
                  }}
                >
                  {statusList.map((item) => (
                    <Select.Option key={item.status} value={item.status}>
                      {item.name}
                    </Select.Option>
                  ))}
                </SelectGroup>
              </FormItem>
              <FormItem>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon="search"
                  onClick={() => {
                    this._onSearch();
                  }}
                >
                  搜索
                </Button>
              </FormItem>
            </Form>
          )}

          {flash && (
            <Form className="filter-content" layout="inline">
              <FormItem>
                <Input
                  addonBefore="商品名称"
                  placeholder="请输入商品名称"
                  onChange={(e: any) => {
                    this.setState({ goodsName: e.target.value });
                  }}
                />
              </FormItem>
              <FormItem>
                <SelectGroup
                  getPopupContainer={() =>
                    document.getElementById('DialogChooseUnit')
                  }
                  label="秒杀分类"
                  defaultValue={'全部'}
                  onChange={(value) => {
                    this.setState({ flashCateId: value });
                  }}
                >
                  <Select.Option key={'全部'} value={null}>
                    全部
                  </Select.Option>
                  {flashCateList.map((item) => (
                    <Select.Option key={item.cateId} value={item.cateId}>
                      {item.cateName}
                    </Select.Option>
                  ))}
                </SelectGroup>
              </FormItem>

              <FormItem>
                <SelectGroup
                  getPopupContainer={() =>
                    document.getElementById('DialogChooseUnit')
                  }
                  label="秒杀状态"
                  defaultValue={flashStatus}
                  onChange={(value) => {
                    this.setState({ flashStatus: value });
                  }}
                >
                  {statusList.map((item) => (
                    <Select.Option key={item.status} value={item.status}>
                      {item.name}
                    </Select.Option>
                  ))}
                </SelectGroup>
              </FormItem>
              <FormItem>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon="search"
                  onClick={() => {
                    this._onSearch();
                  }}
                >
                  搜索
                </Button>
              </FormItem>
            </Form>
          )}

          {full && (
            <Form className="filter-content" layout="inline">
              <FormItem>
                <Input
                  addonBefore="活动名称"
                  placeholder="请输入活动名称"
                  onChange={(e: any) => {
                    this.setState({ activityName: e.target.value });
                  }}
                />
              </FormItem>
              <FormItem>
                <SelectGroup
                  getPopupContainer={() =>
                    document.getElementById('DialogChooseUnit')
                  }
                  label="活动类型"
                  defaultValue={activityType}
                  onChange={(value) => {
                    this.setState({ activityType: value });
                  }}
                >
                  {activityTypeList.map((item) => (
                    <Select.Option key={item.type} value={item.type}>
                      {item.name}
                    </Select.Option>
                  ))}
                </SelectGroup>
              </FormItem>
              <FormItem>
                <SelectGroup
                  getPopupContainer={() =>
                    document.getElementById('DialogChooseUnit')
                  }
                  label="活动状态"
                  defaultValue={activityStatus}
                  onChange={(value) => {
                    this.setState({ activityStatus: value });
                  }}
                >
                  {activityStatusList.map((item) => (
                    <Select.Option key={item.status} value={item.status}>
                      {item.name}
                    </Select.Option>
                  ))}
                </SelectGroup>
              </FormItem>
              <FormItem>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon="search"
                  onClick={() => {
                    this._onSearch();
                  }}
                >
                  搜索
                </Button>
              </FormItem>
            </Form>
          )}

          <div className="page-table">
            {groupon && (
              <p className="table-header">
                <span className="flex-1" />
                <span className="flex-3">拼团商品</span>
                <span className="flex-2">拼团分类</span>
                <span className="flex-2">开始时间</span>
                <span className="flex-2">结束时间</span>
                <span className="flex-2">拼团状态</span>
              </p>
            )}
            {flash && (
              <p className="table-header">
                <span className="flex-1" />
                <span className="flex-3">秒杀商品</span>
                <span className="flex-2">秒杀分类</span>
                <span className="flex-2">场次</span>
                <span className="flex-2">结束时间</span>
                <span className="flex-2">秒杀状态</span>
              </p>
            )}
            {full && (
              <p className="table-header">
                <span className="flex-1" />
                <span className="flex-2">活动名称</span>
                <span className="flex-2">活动类型</span>
                <span className="flex-2">目标会员</span>
                <span className="flex-2">开始时间</span>
                <span className="flex-2">结束时间</span>
                <span className="flex-2">活动状态</span>
              </p>
            )}
            <ul className="table-main">
              {// 拼团列表
              grouponList.length > 0 &&
                grouponList.map((item, index) => {
                  let {
                    goodsInfo,
                    startTime,
                    endTime,
                    cateName,
                    status,
                    goodsInfoId,
                    grouponActivityId
                  } = item;
                  let isActiveKey =
                    goodsInfoId + '/' + grouponActivityId === activeGrouponKey;
                  return (
                    <li key={index}>
                      <label>
                        <span
                          className="flex-1"
                          style={{ textAlign: 'center' }}
                        >
                          <input
                            type="radio"
                            checked={isActiveKey}
                            name="webpage"
                            value={grouponActivityId}
                            onChange={this.changeGrouponVal.bind(this, item)}
                          />
                        </span>
                        <span className="flex-3">
                          <div className="xsite-goods-box">
                            <img
                              src={goodsInfo.goodsInfoImg || defaultImg}
                              alt=""
                            />
                            <div className="xsite-content">
                              <p>{goodsInfo.goodsInfoName}</p>
                              <p>{goodsInfo.specText || '-'}</p>
                            </div>
                          </div>
                        </span>
                        <span className="flex-2">{cateName}</span>
                        <span className="flex-2">{startTime.slice(0, 19)}</span>
                        <span className="flex-2">{endTime.slice(0, 19)}</span>
                        <span className="flex-2">
                          {getGrouponStatus(status)}
                        </span>
                      </label>
                    </li>
                  );
                })}

              {// 秒杀列表
              flashList.length > 0 &&
                flashList.map((item, index) => {
                  let {
                    id,
                    goodsInfo,
                    activityTime,
                    flashSaleCateVO,
                    activityFullTime,
                    flashSaleGoodsStatus,
                    goodsInfoId
                  } = item;
                  let isActiveKey = goodsInfoId + '/' + id === activeFlashKey;
                  return (
                    <li key={index}>
                      <label>
                        <span
                          className="flex-1"
                          style={{ textAlign: 'center' }}
                        >
                          <input
                            type="radio"
                            checked={isActiveKey}
                            name="webpage"
                            value={goodsInfoId}
                            onChange={this.changeFlashVal.bind(this, item)}
                          />
                        </span>
                        <span className="flex-3">
                          <div className="xsite-goods-box">
                            <img
                              src={goodsInfo.goodsInfoImg || defaultImg}
                              alt=""
                            />
                            <div className="xsite-content">
                              <p>{goodsInfo.goodsInfoName}</p>
                              <p>{goodsInfo.specText || '-'}</p>
                            </div>
                          </div>
                        </span>
                        <span className="flex-2">
                          {flashSaleCateVO.cateName}
                        </span>
                        <span className="flex-2">{activityTime}</span>
                        <span className="flex-2">
                          {moment(activityFullTime)
                            .add(2, 'h')
                            .format('YYYY-MM-DD HH:mm')}
                        </span>
                        <span className="flex-2">
                          {getFlashStatus(flashSaleGoodsStatus)}
                        </span>
                      </label>
                    </li>
                  );
                })}

              {// 满系列表
              fullList.length > 0 &&
                fullList.map((item, index) => {
                  let {
                    marketingName,
                    marketingId,
                    marketingJoinLevel,
                    beginTime,
                    endTime,
                    marketingStatus,
                    subType
                  } = item;
                  let isActiveKey = marketingId === activeFullKey;
                  return (
                    <li key={index}>
                      <label>
                        <span
                          className="flex-1"
                          style={{ textAlign: 'center' }}
                        >
                          <input
                            type="radio"
                            checked={isActiveKey}
                            name="webpage"
                            value={marketingId}
                            onChange={this.changeFullVal.bind(this, item)}
                          />
                        </span>
                        <span className="flex-2">{marketingName}</span>
                        <span className="flex-2">{getFullType(subType)}</span>
                        <span className="flex-2">{getJoinLevel(marketingJoinLevel)}</span>
                        <span className="flex-2">
                          {beginTime && beginTime.slice(0, 19)}
                        </span>
                        <span className="flex-2">
                          {endTime && endTime.slice(0, 19)}
                        </span>
                        <span className="flex-2">
                          {getMarketStatus(marketingStatus)}
                        </span>
                      </label>
                    </li>
                  );
                })}
              {grouponList.length === 0 &&
                flashList.length === 0 &&
                fullList.length === 0 && (
                  <li className="no-data-panel">暂无营销商品</li>
                )}
            </ul>
          </div>
          <div className="link-pagination">
            <Pagination
              showQuickJumper
              defaultCurrent={1}
              total={total}
              pageSizeOptions={['6', '10', '20']}
              showTotal={() => `共${total} 条`}
              defaultPageSize={this.state.pageSize}
              onShowSizeChange={this.onShowSizeChange}
              showSizeChanger
              onChange={this.onPageChange}
            />
          </div>
        </div>
      </div>
    );
  }

  _changeCateKey = (key) => {
    let { cateKey, pageSize } = this.state;
    // 重复点击tab不生效
    if (cateKey === key) {
      return;
    }
    // 切换tab时同时清空其他tab的state
    this.setState({
      cateKey: key,
      goodsName: '',
      goodsInfoName: '',
      grouponStatus: 3,
      flashStatus: 3,
      activityName: '',
      activityType: null,
      activityStatus: 5,
      pageNum: 0,
      pageSize: pageSize
    });
    this._fetchGoodsList({ cateKey: key, pageSize: pageSize });
    this._fetchCateList({ cateKey: key });
  };

  _onSearch = () => {
    let {
      cateKey,
      //拼团参数
      goodsInfoName,
      grouponCateId,
      grouponStatus,
      //秒杀参数
      goodsName,
      flashCateId,
      flashStatus,
      // 满系参数
      activityName,
      activityType,
      activityStatus
    } = this.state;
    this._fetchGoodsList({
      cateKey: cateKey,
      //拼团参数
      goodsInfoName: goodsInfoName,
      grouponCateId: grouponCateId,
      status: grouponStatus,
      //秒杀参数
      goodsName: goodsName,
      cateId: flashCateId,
      queryDataType: flashStatus,
      // 满系参数
      marketingSubType: activityType,
      marketingName: activityName,
      queryTab: activityStatus,
      pageSize: this.state.pageSize
    });
  };

  /**
   * 选中拼团某一项item
   */
  changeGrouponVal = (item) => {
    let { goodsInfoId, grouponActivityId } = item;
    let { cateKey } = this.state;
    this.setState({
      activeGrouponKey: createGrouponKey({ goodsInfoId, grouponActivityId })
    });
    this.props.changeSelect({ ...item, cateKey });
  };

  /**
   * 选中秒杀某一项item
   */
  changeFlashVal = (item) => {
    let { goodsInfoId, id } = item;
    let { cateKey } = this.state;
    this.setState({ activeFlashKey: createFlashKey({ goodsInfoId, id }) });
    this.props.changeSelect({ ...item, cateKey });
  };

  /**
   * 选中满系某一项item
   */
  changeFullVal = (item) => {
    let { marketingId } = item;
    let { cateKey } = this.state;
    this.setState({ activeFullKey: createFullKey({ marketingId }) });
    this.props.changeSelect({ ...item, cateKey });
  };

  onChange = (value) => {
    let { goodsName } = this.state;
    this.setState({ value });
    this._fetchGoodsList({ projectCateId: value, goodsName: goodsName });
  };

  /**
   * 点击快速跳转某页面触发，重新调接口
   */
  onShowSizeChange = (current, pageSize) => {
    this.setState({ pageSize });
    let {
      cateKey,
      //拼团参数
      goodsInfoName,
      grouponCateId,
      grouponStatus,
      //秒杀参数
      goodsName,
      flashCateId,
      flashStatus,
      // 满系参数
      activityName,
      activityType,
      activityStatus
    } = this.state;
    let type = {
      cateKey: cateKey,
      //拼团参数
      goodsInfoName: goodsInfoName,
      grouponCateId: grouponCateId,
      status: grouponStatus,
      //秒杀参数
      goodsName: goodsName,
      cateId: flashCateId,
      queryDataType: flashStatus,
      // 满系参数
      marketingSubType: activityType,
      marketingName: activityName,
      queryTab: activityStatus,
      pageNum: current - 1,
      pageSize: this.state.pageSize
    };
    this._fetchGoodsList(type);
  };
  /**
   * 点击分页触发，重新调接口
   */
  onPageChange = (pageNumber) => {
    let {
      cateKey,
      //拼团参数
      goodsInfoName,
      grouponCateId,
      grouponStatus,
      //秒杀参数
      goodsName,
      flashCateId,
      flashStatus,
      // 满系参数
      activityName,
      activityType,
      activityStatus
    } = this.state;
    let type = {
      cateKey: cateKey,
      //拼团参数
      goodsInfoName: goodsInfoName,
      grouponCateId: grouponCateId,
      status: grouponStatus,
      //秒杀参数
      goodsName: goodsName,
      cateId: flashCateId,
      queryDataType: flashStatus,
      // 满系参数
      marketingSubType: activityType,
      marketingName: activityName,
      queryTab: activityStatus,
      pageNum: pageNumber - 1,
      pageSize: this.state.pageSize
    };
    this._fetchGoodsList(type);
  };

  /**
   * 获取各个活动分类
   */
  _fetchCateList = async (type) => {
    if (type && type.cateKey === 'groupon') {
      const { res } = await D2cLinkApi.getGrouponCateList();
      if (res.code === Const.SUCCESS_CODE) {
        this.setState({
          grouponCateList: res.context.grouponCateVOList
        });
      }
    } else if (type && type.cateKey === 'flash') {
      const { res } = (await D2cLinkApi.getFlashCateList()) as any;
      if (res.code == Const.SUCCESS_CODE) {
        this.setState({
          flashCateList: res.context.flashSaleCateVOList
        });
      } else {
      }
    } else {
      return;
    }
  };

  /**
   * 获取服务列表
   */
  async _fetchGoodsList(type) {
    let data = await D2cLinkApi.getPromotionList(type);
    if (data) {
      let total = data.total;
      let promotionList = data.content.map((item) => {
        return item;
      });
      if (type && type.cateKey === 'groupon') {
        this.setState({
          grouponList: promotionList,
          flashList: [],
          fullList: [],
          total
        });
      } else if (type && type.cateKey === 'flash') {
        this.setState({
          grouponList: [],
          flashList: promotionList,
          fullList: [],
          total
        });
      } else {
        this.setState({
          grouponList: [],
          flashList: [],
          fullList: promotionList,
          total
        });
      }
    }
  }
}

const promotionCate = [
  {
    key: 'groupon',
    img: require('../img/tuan.png'),
    name: '拼团'
  },
  {
    key: 'flash',
    img: require('../img/miao.png'),
    name: '秒杀'
  },
  {
    key: 'full',
    img: require('../img/zhe.png'),
    name: '满减/折/赠'
  }
];

const activityTypeList = [
  {
    type: null,
    name: '全部'
  },
  {
    type: 0,
    name: '满金额减'
  },
  {
    type: 1,
    name: '满数量减'
  },
  {
    type: 2,
    name: '满金额折'
  },
  {
    type: 3,
    name: '满数量折'
  },
  {
    type: 4,
    name: '满金额赠'
  },
  {
    type: 5,
    name: '满数量赠'
  }
];

// 秒杀：queryDataType 0：未开始 1：正在进行 2：已结束 3：未开始与正在进行
// 活动状态 0：即将开始 1：进行中 2：已结束 3: 1&2
const statusList = [
  {
    status: 3,
    name: '全部'
  },
  {
    status: 0,
    name: '未开始'
  },
  {
    status: 1,
    name: '进行中'
  }
];

// 0：全部，1：进行中，2：暂停中，3：未开始，4：已结束 5：进行中&暂停中&未开始
// 活动状态
const activityStatusList = [
  {
    status: 5,
    name: '全部'
  },
  {
    status: 1,
    name: '进行中'
  },
  // {
  //   status: 2,
  //   name: '暂停中'
  // },
  {
    status: 3,
    name: '未开始'
  }
];

function getMarketStatus(status) {
  if (status === 1) {
    return '进行中';
  } else if (status === 2) {
    return '暂停中';
  } else if (status === 3) {
    return '未开始';
  } else if (status === 4) {
    return '已结束';
  } else if (status === 5) {
    return '进行中&暂停中&未开始';
  }
}

function getFlashStatus(status) {
  if (status === 1) {
    return '进行中';
  } else if (status === 3) {
    return '未开始';
  }
}

function getGrouponStatus(status) {
  if (status === 0) {
    return '未开始';
  } else if (status === 1) {
    return '进行中';
  }
}

function getFullType(type) {
  if (type === 0) {
    return '满金额减';
  } else if (type === 1) {
    return '满数量减';
  } else if (type === 2) {
    return '满金额折';
  } else if (type === 3) {
    return '满数量折';
  } else if (type === 4) {
    return '满金额赠';
  } else if (type === 5) {
    return '满数量赠';
  }
}

function getJoinLevel(type) {
  if (type === -3) {
    return '指定人群';
  } else if (type === -2) {
    return '指定客户';
  } else if (type === -1) {
    return '所有客户';
  } else if (type === 0) {
    return '所有等级';
  } else if (type === 1) {
    return '其他等级';
  }
}
