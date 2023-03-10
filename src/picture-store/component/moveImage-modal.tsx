import * as React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, TreeSelect, Tree } from 'antd';
import { Relax, Store } from 'plume2';
import { noop } from 'qmkit';
import { List } from 'immutable';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import {FormattedMessage} from 'react-intl';
declare type IList = List<any>;

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

@Relax
export default class MoveImageModal extends React.Component<any, any> {
  _form;
  WrapperForm: any;
  props: {
    relaxProps?: {
      moveVisible: boolean; // 弹框是否显示
      move: Function; // 移动图片
      cateList: IList; // 分类结构数据
      showMoveImageModal: Function; //初始化
    };
  };

  static relaxProps = {
    moveVisible: 'moveVisible',
    move: noop,
    showMoveImageModal: noop,
    cateList: 'cateList'
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(MoveImageForm as any);
  }

  render() {
    const { moveVisible } = this.props.relaxProps;
    if (!moveVisible) {
      return null;
    }
    const WrapperForm = this.WrapperForm;
    return (
       <Modal  maskClosable={false}
        title={<FormattedMessage id="Setting.MovingPicture" />}
         
        visible={moveVisible}
        onCancel={this._handleCancel}
        onOk={this._handleOk}
      >
        <WrapperForm ref={(form) => (this._form = form)} />
      </Modal>
    );
  }

  /**
   * 关闭弹窗
   * @private
   */
  _handleCancel = () => {
    const { showMoveImageModal } = this.props.relaxProps;
    showMoveImageModal(false);
  };

  /**
   * 提交
   * @param e
   * @private
   */
  _handleOk = () => {
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs, value) => {
      if (!errs) {
        //提交
        const { move } = this.props.relaxProps;
        move(value.cateId);
      }
    });
  };
}

class MoveImageForm extends React.Component<any, any> {
  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  props: {
    relaxProps?: {
      cateList: IList;
    };
    form;
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const cateList = this._store.state().get('cateList');
    //处理分类的树形图结构数据
    const loop = (cateList) =>
      cateList.map((item) => {
        if (item.get('children') && item.get('children').count()) {
          return (
            <TreeNode
              key={item.get('cateId')}
              value={item.get('cateId').toString()}
              title={item.get('cateName')}
            >
              {loop(item.get('children'))}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={item.get('cateId')}
            value={item.get('cateId').toString()}
            title={item.get('cateName')}
          />
        );
      });

    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="Setting.ChooseCategory" />}
          required={true}
          hasFeedback
        >
          {getFieldDecorator('cateId', {
            rules: [{ required: true, message: <FormattedMessage id="Setting.PleaseSelectAType" /> }]
          })(
            <TreeSelect
              showSearch
              filterTreeNode={(input, treeNode) =>
                treeNode.props.title
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              style={{ width: 300 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Please select a type"
              notFoundContent="No categories"
              allowClear
              treeDefaultExpandAll
            >
              {loop(cateList)}
            </TreeSelect>
          )}
        </FormItem>
      </Form>
    );
  }
}
