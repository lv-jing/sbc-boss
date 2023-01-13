import React, { Component } from 'react';
import { Headline, BreadCrumb } from 'qmkit';
import { Breadcrumb } from 'antd';
import DictionaryForm from './components/dictionary-form';

export default class updateDictionary extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      id: this.props.match.params.id ? this.props.match.params.id : '',
      pageType: this.props.match.params.id ? 'edit' : 'create'
    };
  }

  render() {
    return (
      <div>
        {this.props.match.params.id ? (
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>Edit Dictionary</Breadcrumb.Item>
          </BreadCrumb>
        ) : (
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>New Dictionary</Breadcrumb.Item>
          </BreadCrumb>
        )}
        <div className="container">
          <DictionaryForm pageType={this.state.pageType} id={this.state.id} />
        </div>
      </div>
    );
  }
}
