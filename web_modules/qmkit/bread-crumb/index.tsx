import React from 'react';
import { Breadcrumb } from 'antd';
import { cache } from '../index';
import { fromJS } from 'immutable';

export default class BreadCrumb extends React.Component<any, any> {
  props: {
    first?: string;
    second?: string;
    third?: string;
    children?: any;
    //自动化几个层级，默认3个，即3个层级的自动显示，最少应该是2个层级
    //自动显示2个层级的，传2，后面的层级由页面处理，作为children传递
    autoLevel?: number;
    //页面中添加层级
    thirdLevel?: boolean;
  };

  render() {
    //选中的一级菜单索引
    const firstIndex = sessionStorage.getItem(cache.FIRST_ACTIVE);
    //选中的二级菜单索引
    const secondIndex = sessionStorage.getItem(cache.SECOND_ACTIVE);
    //选中的三级菜单索引
    const thirdIndex = sessionStorage.getItem(cache.THIRD_ACTIVE);
    //所有菜单
    const allGradeMenus = fromJS(
      JSON.parse(sessionStorage.getItem(cache.LOGIN_MENUS))
    );
    let first = allGradeMenus.getIn([firstIndex, 'title']) || '';
    let firstUrl = allGradeMenus.getIn([
      firstIndex,
      'children',
      0,
      'children',
      0,
      'url'
    ]) || '';

    let third =
      allGradeMenus.getIn([
        firstIndex,
        'children',
        secondIndex,
        'children',
        thirdIndex,
        'title'
      ]) || '';
    let thirdUrl =
      allGradeMenus.getIn([
        firstIndex,
        'children',
        secondIndex,
        'children',
        thirdIndex,
        'url'
      ]) || '';
    return (
      <Breadcrumb >
        <Breadcrumb.Item><a href={firstUrl}>{first}</a></Breadcrumb.Item>
        <Breadcrumb.Item>{this.props.thirdLevel ? <a href={thirdUrl}>{third}</a> : third}</Breadcrumb.Item>
        {this.props.children}
      </Breadcrumb>
    );
  }
}
