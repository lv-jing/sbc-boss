import * as React from 'react';
import * as Immutable from 'immutable';
import {
  outputGenerate,
  SelectGroup,
  TreeSelectGroup,
  AutoCompleteGroup
} from 'qmkit';
import GoodListItem from './good-list-item';
import * as D2cLinkApi from '../../common/d2c-link-api';
import { exchangeCateList } from './util';
import {
  TreeSelect,
  Input,
  Pagination,
  Select,
  Spin,
  Button,
  Form
} from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
const { Option } = Select;
const FormItem = Form.Item;
export default class LinkPageProducts extends React.Component<any, any> {
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
      goodList: [],
      cateList: [],
      cateListAntd: [],
      value: undefined,
      dataRules: '',
      searchValue: '',
      chosenId: '',
      pageSize: 6,
      total: 1, //总页数
      data: [],
      storeValue: undefined,
      fetching: false,
      searchByStore: '',
      brandList: [],
      brandName: []
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
    this._fetchGoodsList({
      pageNum: 0,
      q: '',
      type: 1,
      pageSize: this.state.pageSize,
      systemCode: this.props.systemCode
    });
    // msg.on("clear:chosenId", this.chosenId);
    this._fetchCateList();
    this._getLinkInfo(); //获取老数据
    this.props.changeSelect(this.props.chooseData.toJS());
  }

  componentWillUnmount() {
    // msg.off("clear:chosenId", this.chosenId);
  }

  // componentWillReceiveProps(nextProps) {
  //   let { chosenId } = this.state;
  //   if (!nextProps.chooseData) return;
  //   let skuId = nextProps.chooseData.get("skuId");
  //   if (skuId !== chosenId) {
  //     this.setState({
  //       chosenId: skuId,
  //     });
  //   }
  // }
  /**
   * 渲染出所有的可选商品列表，若 ID 和之前用户所选的 ID 一致，则改商品默认显示勾选状态isChoose
   */

  render() {
    let {
      goodList,
      cateList,
      value,
      cateListAntd,
      total,
      searchValue,
      fetching,
      data,
      storeValue,
      brandList
    } = this.state;
    const storeId = (window as any).storeId;
    return (
      <div className="link-page-products">
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore="商品名称"
              placeholder="请输入商品名称"
              onChange={(e: any) => {
                this.setState({ searchValue: e.target.value });
              }}
            />
          </FormItem>

          <FormItem>
            <TreeSelectGroup
              getPopupContainer={() => document.getElementById('DialogChooseUnit')}
              label="类目"
              value={value}
              allowClear
              showSearch
              treeNodeFilterProp="title"
              placeholder="请选择类目"
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeDefaultExpandAll
              treeData={cateListAntd}
              onChange={(value, dataRules) => {
                this.setState({ value: dataRules, dataRules: value });
              }}
            ></TreeSelectGroup>
          </FormItem>

          {/*<FormItem>*/}
          {/*  <SelectGroup*/}
          {/*    getPopupContainer={() => document.getElementById('page-content')}*/}
          {/*    label="品牌"*/}
          {/*    defaultValue="全部"*/}
          {/*    showSearch*/}
          {/*    optionFilterProp="children"*/}
          {/*    onChange={(value) => {*/}
          {/*      this.setState({ brandName: value });*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    <Option key="-1" value="-1">*/}
          {/*      全部*/}
          {/*    </Option>*/}
          {/*    {brandList.map((v, i) => {*/}
          {/*      return (*/}
          {/*        <Option key={i} value={v.brandId}>*/}
          {/*          {v.brandName}*/}
          {/*        </Option>*/}
          {/*      );*/}
          {/*    })}*/}
          {/*  </SelectGroup>*/}
          {/*</FormItem>*/}

          {storeId ? null : (
            <FormItem>
              <AutoCompleteGroup
                allowClear
                showSearch
                label="所属商家"
                defaultActiveFirstOption={false}
                showArrow={false}
                placeholder="请输入所属商家"
                notFoundContent={fetching ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={this._fetchStore}
                onChange={this._handleChange}
              >
                {data &&
                  data.map((d) => (
                    <Option key={d.storeId}>{d.storeName}</Option>
                  ))}
              </AutoCompleteGroup>
            </FormItem>
          )}

          <FormItem>
            <Button
              type="primary"
              icon="search"
              onClick={() => {
                this.onSearch();
              }}
              htmlType="submit"
            >
              搜索
            </Button>
          </FormItem>
        </Form>

        {goodList.length > 0 ? (
          <Scrollbars autoHeight autoHeightMax={350}>
            <div className="products_list">
              <ul>
                {goodList.map((item, index) => {
                  return (
                    <GoodListItem
                      key={item.skuId}
                      item={item}
                      active={this.state.chosenId === item.skuId}
                      onSelect={() => this._chosen(index)}
                    />
                  );
                })}
              </ul>
            </div>
          </Scrollbars>
        ) : (
          <div className="noGoodsClassify">
            <i className="x-site-new-qIcon information" />
            暂无商品
          </div>
        )}
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
    );
  }
  /**
   * 商品数据转换成antd格式
   */
  treeUtils = (data: any[]) => {
    let pTree = data.reduce((prev, cur) => {
      if (cur.pid === '0') {
        return [...prev, this.sonsTree(cur, data)];
      }
      return prev;
    }, []);
    this.setState({ cateListAntd: pTree });
  };
  sonsTree = (obj, arr) => {
    let children = new Array();
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].pid == obj.key) {
        //pid===key等于加入数组
        this.sonsTree(arr[i], arr); //递归出子元素
        arr[i].pathName = obj.pathName;
        children.push(arr[i]);
      }
    }
    if (children.length > 0) {
      obj.children = children;
    }
    return obj;
  };

  _fetchStore = (value) => {
    value = value && value.trim();
    if (value) {
      this._fetchStoreByName(value);
    }
  };

  _handleChange = (value) => {
    this.setState({ storeValue: value });
  };

  onSearch = () => {
    let { dataRules, storeValue, searchValue } = this.state;
    let type = storeValue
      ? {
          pageNum: 0,
          q: searchValue,
          type: 1,
          catName: dataRules,
          pageSize: this.state.pageSize,
          searchByStore: storeValue
        }
      : {
          pageNum: 0,
          q: searchValue,
          type: 1,
          catName: dataRules,
          pageSize: this.state.pageSize
        };
    this._fetchGoodsList(type);
  };

  chosenId = () => {
    this.setState({ chosenId: 0 });
  };

  _getLinkInfo = () => {
    let { chooseData } = this.props;
    if (!chooseData) return;
    this.setState({ chosenId: chooseData.get('skuId') });
  };
  /**
   * 递归分类数据 获取单选后分类的所有父元素name，字符串拼接
   */
  getCateNames = (key: string): string => {
    if (key === undefined) return;
    let list = [];
    const getName = (key) => {
      const { parentId, name } = this.getCateInfo(key);
      list.unshift(name);
      if (parentId !== '0') getName(parentId);
    };
    getName(key);
    return list.join(',');
  };

  /**
   * 获取某个分类的详细信息
   */
  getCateInfo = (
    key: string
  ): { parentId: string; id: string; name: string } => {
    let { cateList } = this.state;
    let { parentId, id, name } = cateList.find((item) => item.id === key);
    return { parentId, id, name };
  };
  /**
   * 点击快速跳转某页面触发，重新调接口
   */
  onShowSizeChange = (current, pageSize) => {
    this.setState({ pageSize });
    let { dataRules, searchValue, storeValue } = this.state;
    this._fetchGoodsList(
      storeValue
        ? {
            pageNum: current - 1,
            q: searchValue,
            type: 1,
            catName: dataRules,
            pageSize: pageSize,
            searchByStore: storeValue
          }
        : {
            pageNum: current - 1,
            q: searchValue,
            type: 1,
            catName: dataRules,
            pageSize: pageSize
          }
    );
  };
  /**
   * 点击分页触发，重新调接口
   */
  onPageChange = (pageNumber) => {
    let { dataRules, searchValue, storeValue } = this.state;
    let type = storeValue
      ? {
          pageNum: pageNumber - 1,
          q: searchValue,
          type: '1',
          catName: dataRules,
          pageSize: this.state.pageSize,
          searchByStore: storeValue
        }
      : {
          pageNum: pageNumber - 1,
          q: searchValue,
          type: '1',
          catName: dataRules,
          pageSize: this.state.pageSize
        };
    this._fetchGoodsList(type);
  };
  /**
   * 选择某一商品时
   */
  _chosen = (index) => {
    this.setState({ index, chosenId: this.state.goodList[index].skuId });
    this.props.changeSelect(this.state.goodList[index]);
  };

  /**
   * 初始化获取分类列表
   */
  async _fetchCateList() {
    let api_host = this.props.apiHost;
    let url = '/xsite/goodsCatesForXsite';
    let data = await D2cLinkApi.getCateList({ api_host, url });
    let { res } = await D2cLinkApi.getBrandList();
    this.setState({ cateList: data, brandList: res.context });
    this.treeUtils(exchangeCateList(data));
  }
  // async _fetchCateList() {
  //   let api_host = this.props.apiHost;
  //   let systemCode = this.props.systemCode;

  //   let data;
  //   if (systemCode === "d2cStore") {
  //     let url = "/open_site_api/cate_list";
  //     data = await D2cLinkApi.getCateList({ api_host, url });
  //   } else if (systemCode === "d2p") {
  //     let url = "/sites/x-site/categories";
  //     data = await D2pLinkApi.getCateList({ api_host, url });
  //   }
  //   this.setState({ cateList: data });
  //   this.treeUtils(exchangeCateList(data));
  // }
  /**
   * 获取商品列表
   */
  async _fetchGoodsList(type) {
    let systemCode = 'd2cStore';
    let api_host = this.props.apiHost;

    let url = '/xsite/skusForXsite';
    let data = await D2cLinkApi.getGoodList(api_host, url, type);

    if (data) {
      // log("查询数据GoodsList返回值 ", data);
      let _rawData;
      let total = 0;
      if (data.dataList) {
        _rawData = data.dataList;
        total = data.totalCount;
      } else if (data.products && data.products.root) {
        //搜索引擎过来的原数据..
        _rawData = data.products.root;
        total = data.products.total;
      }
      const { info } = this.props;
      let goodsData = _rawData.map((item) => {
        //src处理..
        let specs = item.specs;
        if (systemCode === 'd2p') {
          specs.forEach((item, index) => {
            specs[index].valKey = item.specialValName;
          });
        }
        item = outputGenerate.extraLinkInfo({ info, originObj: item });
        // item.image = QMImg.src({ src: item.image || "" });
        item.specs = specs;
        //item.sellPoint=item.sellPoint
        return item;
      });
      this.setState({
        goodList: goodsData,
        total
      });
    }
  }

  async _fetchStoreByName(storeName) {
    this.setState({ data: [], fetching: true });
    let api_host = this.props.apiHost;
    let url = `/distribution/record/listStore`;
    const data = await D2cLinkApi.getStoreListByName({
      api_host,
      url,
      storeName
    });
    if (data) {
      this.setState({
        data: data,
        fetching: false
      });
    }
  }
}
