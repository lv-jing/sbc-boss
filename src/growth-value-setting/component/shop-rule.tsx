import * as React from 'react';
import { Relax } from 'plume2';
import { List, Map, fromJS } from 'immutable';
import { Table } from 'antd';
import { noop, QMFloat, AuthWrapper } from 'qmkit';

declare type IList = List<any>;

const styles = {
  edit: {
    paddingRight: 10
  }
};

@Relax
export default class ShopRule extends React.Component<any, any> {
  props: {
    relaxProps?: {
      cates: IList;
      allCates: IList;
      showEditModal: Function;
      setParentRate: Function;
      growthValueConfig: any;
    };
  };

  static relaxProps = {
    // 父子结构的分类
    cates: 'cates',
    // 平台全部分类集合
    allCates: 'allCates',
    // 展示修改框
    showEditModal: noop,
    // 设置父类目成长值比例
    setParentRate: noop,
    growthValueConfig: 'growthValueConfig'
  };

  render() {
    const { cates, growthValueConfig } = this.props.relaxProps;
    return (
      <Table
        rowKey="cateId"
        columns={growthValueConfig.get('rule') ? this._no_option_columns : this._columns}
        dataSource={cates.toJS()}
        pagination={false}
      />
    );
  }

  _columns = [
    {
      title: '类目名称',
      dataIndex: 'cateName',
      key: 'cateName',
      width: '30%',
      className: 'namerow'
    },
    {
      title: '成长值获取比例',
      dataIndex: 'growthValueRate',
      key: 'growthValueRate',
      render: (rate) => QMFloat.addZero(rate ? rate : '0.00') + '%'
    },
    {
      title: '操作',
      key: 'option',
      render: (rowInfo) => this._getOption(rowInfo)
    }
  ];

  _no_option_columns = [
    {
      title: '类目名称',
      dataIndex: 'cateName',
      key: 'cateName',
      width: '30%',
      className: 'namerow'
    },
    {
      title: '成长值获取比例',
      dataIndex: 'growthValueRate',
      key: 'growthValueRate',
      render: (rate) => QMFloat.addZero(rate ? rate : '0.00') + '%'
    }
  ];

  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    rowInfo = fromJS(rowInfo);
    return (
      <div>
        <AuthWrapper functionName={'f_growth_value_setting_edit'}>
          <a
            style={styles.edit}
            onClick={this._showEditModal.bind(
              this,
              rowInfo.get('cateId'),
              rowInfo.get('cateName'),
              rowInfo.get('cateParentId'),
              rowInfo.get('growthValueRate'),
              rowInfo.get('isParentGrowthValueRate')
            )}
          >
            编辑
          </a>
        </AuthWrapper>
      </div>
    );
  };

  /**
   * 显示修改弹窗
   */
  _showEditModal = (
    cateId: string,
    cateName: string,
    cateParentId: number,
    growthValueRate: boolean,
    isParentGrowthValueRate: number
  ) => {
    const { showEditModal, allCates, setParentRate } = this.props.relaxProps;
    let cateParentName = '';
    let cateParentGrowthValueRate = 0;
    let cateGrade = 0;
    if (cateParentId > 0) {
      const parent = allCates
        .filter((item) => item.get('cateId') === cateParentId)
        .get(0);
      cateParentName = parent.get('cateName');
      cateParentGrowthValueRate = parent.get('growthValueRate');
      cateGrade = parent.get('cateGrade');
    }
    let cateInfo = Map({
      cateId,
      cateName,
      cateParentName,
      cateParentId,
      growthValueRate ,
      cateGrade,
      isParentGrowthValueRate
    });
    setParentRate(cateParentGrowthValueRate);
    showEditModal(cateInfo);
  };
}
