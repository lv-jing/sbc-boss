import React from 'react';
import { Row, Col, Modal } from 'antd';
import { Relax } from 'plume2';
import { List } from 'immutable';
import { noop } from 'qmkit';
import AppStore from '../store';
const confirm = Modal.confirm;
@Relax
export default class CompanyList extends React.Component<any, any> {
  _store: AppStore;
  props: {
    relaxProps?: {
      allExpressList: List<any>;
      onDelete: Function;
      onAdd: Function;
    };
  };

  static relaxProps = {
    allExpressList: 'allExpressList',
    onDelete: noop,
    onAdd: noop
  };

  _Delete = (id) => {
    const { onDelete } = this.props.relaxProps;
    confirm({
      title: '提示',
      content: '您确认要删除该公司吗？',
      onOk() {
        onDelete(id);
      }
    });
  };

  render() {
    const { allExpressList, onAdd } = this.props.relaxProps;
    return (
      <div>
        <div style={styles.title}>
          已接入物流公司&nbsp;&nbsp;&nbsp;&nbsp;<a
            href="javascript:void(0)"
            onClick={() => onAdd()}
          >
            新增物流公司
          </a>
        </div>
        <Row type="flex" justify="start" style={styles.box}>
          {allExpressList.toJS().map((v) => {
            return (
              <Col span={3} key={v.expressCompanyId}>
                <p style={styles.item}>
                  {v.expressName}
                  <a
                    style={{ marginLeft: 10 }}
                    href="javascript:void(0)"
                    onClick={() => this._Delete(v.expressCompanyId)}
                  >
                    删除
                  </a>
                </p>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  }
}

const styles = {
  title: {
    background: '#f7f7f7',
    height: 32,
    paddingLeft: 20,
    paddingRight: 20,
    display: 'flex',
    alignItems: 'center',
    color: '#333'
  } as any,
  box: {
    padding: 20,
    paddingBottom: 0
  },
  item: {
    height: 40
  }
};
