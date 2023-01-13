import React from 'react';
import { Store, Relax } from 'plume2';
import PropTypes from 'prop-types';
import { Headline, noop } from 'qmkit';

@Relax
export default class TagInfo extends React.Component<any, any> {
  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  props: {
    relaxProps?: {
      customerTagList: any;
      groupNames: any;
      toggleTagModal: Function;
    };
  };

  static relaxProps = {
    customerTagList: 'customerTagList',
    groupNames: 'groupNames',
    toggleTagModal: noop
  };

  render() {
    const { customerTagList, groupNames } = this.props.relaxProps;
    return (
      <div className="tag-info">
        <div className="article-wrap">
          <div className="title">
            TA的标签{' '}
            <a
              href="javascript:;"
              className="link"
              onClick={() => {
                this.props.relaxProps.toggleTagModal();
              }}
            >
              编辑
            </a>
          </div>

          {customerTagList.length && (
            <div className="tags custom-detail-body">
              {customerTagList.map((tag) => (
                <span className="tag" key={tag.tagId}>
                  {tag.tagName}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="article-wrap">
          <Headline title="TA所属的会员群体" />
          {groupNames.length && (
            <div className="tags custom-detail-body">
              {groupNames.length &&
                groupNames.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}
