import React from 'react';
import { Icon, Select, Tooltip } from 'antd';
import { Const, noop, util } from 'qmkit';
import moment from 'moment';
import * as webapi from './webpai';

const Option = Select.Option;

interface HeaderProps {
  //气泡说明文字，可直接传文字，也可自定义渲染
  // title?: string,
  // renderTitle?: Function,
  menuList?: any;
  onClick: Function; //选项卡点击
  todayDisabled?: boolean; // 去除今天选项// ，用于客户统计页面
  noTitle?: boolean; // 没有统计说明，用于客户统计页面
  selectShop?: Function; //选中店铺
}

export default class StatisticsHeader extends React.Component<
  HeaderProps,
  any
> {
  constructor(props) {
    super(props);
  }

  state = {
    menuList: this.props.menuList ? this.props.menuList : [],
    clickKey: 0,
    menuName: '自然月',
    selectDate: '0',
    data: []
  };

  //初始化menu下拉菜单内容
  async componentWillMount() {
    this._renderMenu();
    let storeList = new Array();
    const { res } = await webapi.fetchStoreList();
    if (res.code == Const.SUCCESS_CODE) {
      res.context.map((v) => {
        storeList.push(v);
      });
    }
    if (this.props.todayDisabled) {
      this.setState({
        data: storeList,
        clickKey: -1 //被点击的项目的key值
      });
    } else {
      this.setState({
        data: storeList,
        clickKey: 0 //被点击的项目的key值
      });
    }
  }

  static defaultProps = {
    onClick: noop,
    selectShop: noop
  };

  render() {
    const { clickKey } = this.state;

    return (
      <div style={styles.headerBar}>
        <div style={styles.timeBox}>
          <ul style={styles.box}>
            {!this.props.todayDisabled && (
              <li>
                <a
                  onClick={() => this._change(0)}
                  style={clickKey == 0 ? styles.itemCur : styles.item}
                  href="javascript:;"
                >
                  今天
                </a>
              </li>
            )}
            <li>
              <a
                onClick={() => this._change(-1)}
                style={clickKey == -1 ? styles.itemCur : styles.item}
                href="javascript:;"
              >
                昨天
              </a>
            </li>
            <li>
              <a
                onClick={() => this._change(1)}
                style={clickKey == 1 ? styles.itemCur : styles.item}
                href="javascript:;"
              >
                最近7天
              </a>
            </li>
            <li>
              <a
                onClick={() => this._change(2)}
                style={clickKey == 2 ? styles.itemCur : styles.item}
                href="javascript:;"
              >
                最近30天
              </a>
            </li>
          </ul>
          <Select
            dropdownMatchSelectWidth={false}
            defaultValue="自然月"
            value={clickKey != 3 ? '0' : this.state.selectDate}
            onChange={(value) => this._selectOnChange(value)}
          >
            <Option key={0}>自然月</Option>
            {this.state.menuList.map((menu) => (
              <Option key={menu}>{menu}</Option>
            ))}
          </Select>
        </div>

        {!this.props.noTitle && (
          <div
            style={{
              textAlign: 'right',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Select
              showSearch
              allowClear={true}
              style={{ width: 300, marginRight: 20 }}
              placeholder="请选择店铺"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option.props.children as any)
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              onChange={(value) => this.props.selectShop(value)}
            >
              {this._renderOption(this.state.data)}
            </Select>
            <Tooltip placement="left" title={this._renderTitle}>
              <a style={{ fontSize: 14 }}>
                <Icon type="question-circle-o" />
                &nbsp;&nbsp;统计说明
              </a>
            </Tooltip>
          </div>
        )}
      </div>
    );
  }

  _renderTitle = () => {
    return (
      <div>
        <p>
          <span>1、当前统计不区分PC/H5/APP端；</span>
        </p>
        <p>
          <span>2、当前统计不区分订货端和管理端；</span>
        </p>
        <p>
          <span>
            3、订单在提交成功后纳入统计，订单金额以订单提交成功时为准；
          </span>
        </p>
        <p>
          <span>4、退单在完成后纳入统计，退货金额以退单完成时为准；</span>
        </p>
        <p>
          <span>
            5、统计时间内商品没有销售/退货，客户没有订单/退单，则不在报表中体现；
          </span>
        </p>
      </div>
    );
  };

  _selectOnChange = (value) => {
    if (value === '0') return;
    const { onClick } = this.props;
    const thisMonth = moment(value, 'YYYY年MM月');
    this.setState({ clickKey: 3, selectDate: value });
    const rangeDate = new Array();
    rangeDate.push(
      util.formateDate(thisMonth.startOf('month').toDate()),
      util.formateDate(thisMonth.endOf('month').toDate())
    );
    //拼接
    const yearMonth =
      util.formateDate(thisMonth.startOf('month').toDate()).split('-')[0] +
      '-' +
      util.formateDate(thisMonth.startOf('month').toDate()).split('-')[1];
    rangeDate.push(yearMonth);
    onClick(rangeDate);
  };

  /**
   * 选项卡切换返回指定的日期，用数组来存储范围
   * @param key
   * @returns {any[]}
   * @private
   */
  _change = (key) => {
    this.setState({
      clickKey: key
    });
    const { onClick } = this.props;
    const rangeDate = new Array();
    //获取昨天的日期
    const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    //获取7天前的日期
    const sevenago = new Date(new Date().getTime() - 24 * 7 * 60 * 60 * 1000);
    //获取30天前的日期
    const monthago = new Date(new Date().getTime() - 24 * 30 * 60 * 60 * 1000);
    if (key == '-1') {
      //获取昨天的日期,再加一个索引标识，方便兼容各个模块的接口调用入参
      rangeDate.push(
        util.formateDate(yesterday),
        util.formateDate(yesterday),
        1
      );
    } else if (key == '0') {
      //获取当天的日期
      rangeDate.push(
        util.formateDate(new Date()),
        util.formateDate(new Date()),
        0
      );
    } else if (key == '1') {
      //获取七天前的日期范围
      rangeDate.push(
        util.formateDate(sevenago),
        util.formateDate(yesterday),
        2
      );
    } else {
      //最近30天的日期范围
      rangeDate.push(
        util.formateDate(monthago),
        util.formateDate(yesterday),
        3
      );
    }
    //将返回日期的返回通过外部的onClick事件获取
    onClick(rangeDate);
  };

  _renderMenu = () => {
    let date = new Date();
    let menu = new Array();
    for (let i = 0; i < 6; i++) {
      date.setMonth(date.getMonth() - 1, 1);
      menu.push(this._formateDate(date));
    }
    this.setState({
      menuList: menu
    });
  };

  //格式化日期
  _formateDate(date) {
    if (date instanceof Date) {
      return date.getFullYear() + '年' + (date.getMonth() + 1) + '月';
    }
  }

  _renderOption = (data: any) => {
    return data.map((v) => {
      return (
        <Option key={v.companyInfoId} value={v.companyInfoId + '_' + v.storeId}>
          {v.storeName}
        </Option>
      );
    });
  };
}

const styles = {
  headerBar: {
    background: '#ffffff',
    padding: '10px 20px',
    marginTop: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  } as any,
  timeBox: {
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  } as any,
  item: {
    color: '#666',
    fontSize: 14,
    display: 'block',
    padding: 5,
    marginRight: 20
  },
  box: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  } as any,
  itemCur: {
    color: '#F56C1D',
    fontSize: 14,
    borderBottom: '2px solid #F56C1D',
    padding: 5,
    marginRight: 20
  }
};
