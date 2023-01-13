import React from 'react';
import { Relax } from 'plume2';
import { Button, Menu } from 'antd';
import { AuthWrapper, history } from 'qmkit';

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {};
  };

  static relaxProps = {};

  render() {
    return (
      <div className="handle-bar">
        <AuthWrapper functionName={'f_create_coupon'}>
          <Button
            type="primary"
            onClick={() =>
              history.push({
                pathname: 'coupon-add',
                state: {
                  couponType: '0',
                  source: 'list'
                }
              })
            }
          >
            创建优惠券
          </Button>
          {/* <Dropdown
            overlay={this._menu()}
            getPopupContainer={() => document.getElementById('page-content')}
          >
            <Button
              onClick={() =>
                history.push({
                  pathname: 'coupon-add',
                  state: {
                    couponType: '0',
                    source: 'list'
                  }
                })
              }
            >
              创建优惠券<Icon type="down" />
            </Button>
          </Dropdown> */}
        </AuthWrapper>
      </div>
    );
  }
  _menu = () => {
    return (
      <Menu>
        <Menu.Item>
          <a
            href="javascript:;"
            onClick={() =>
              history.push({
                pathname: 'coupon-add',
                state: {
                  couponType: '2',
                  source: 'list'
                }
              })
            }
          >
            创建运费券
          </a>
        </Menu.Item>
      </Menu>
    );
  };
}
