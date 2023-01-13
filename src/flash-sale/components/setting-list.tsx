import * as React from 'react';
import { Relax } from 'plume2';
import { List } from 'immutable';
import { Alert, Button, Col, Modal, Row } from 'antd';
import { AuthWrapper, noop } from 'qmkit';

declare type IList = List<any>;

const confirm = Modal.confirm;

@Relax
export default class SettingList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      settingList: IList;
      saveSetting: Function;
      modifyStatus: Function;
      getSettingListById: Function;
      flashSaleStatus: boolean;
    };
  };

  static relaxProps = {
    // 秒杀设置
    settingList: 'settingList',
    saveSetting: noop,
    modifyStatus: noop,
    getSettingListById: noop,
    flashSaleStatus: 'flashSaleStatus'
  };

  render() {
    const { settingList, saveSetting } = this.props.relaxProps;
    return (
      <div>
        <div>
          <Alert
            message="操作提示:"
            description={
              <div>
                <p>
                  每日开展多场秒杀多活动，场次由平台进行设置，以整点为场次开始时间，每日最多设置12场
                </p>
                <p>商家可自由选择参加场次</p>
                <p>每场秒杀活动固定2小时结束</p>
              </div>
            }
            type="info"
          />
        </div>
        <div>
          <div>
            <Row>
              <Col span={2}>每日场次设置：</Col>
              <Col span={22}>
                <div style={styles.parent}>
                  {settingList.map((v, i) => {
                    return (
                      <div
                        style={
                          v.get('status') ? styles.checked : styles.unchecked
                        }
                        key={v.get('id')}
                        onClick={async () =>
                          await this._modifyStatus(
                            v.get('id'),
                            i,
                            v.get('isFlashSale'),
                            v.get('status') ? 0 : 1
                          )
                        }
                      >
                        {v.get('time')}
                      </div>
                    );
                  })}
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <AuthWrapper functionName={'f_flash_sale_setting_edit'}>
          <div className="bar-button">
            <Button type="primary" onClick={() => saveSetting()}>
              保存
            </Button>
          </div>
        </AuthWrapper>
      </div>
    );
  }

  _modifyStatus = async (flashSaleId, id, isFlashSale, status) => {
    const {
      modifyStatus,
      getSettingListById,
      flashSaleStatus
    } = this.props.relaxProps;
    await getSettingListById(flashSaleId);
    if (status == 0 && isFlashSale) {
      confirm({
        title: '确定要关闭该场次吗？',
        content:
          '该场次已有商家参与，若关闭则商家对应的秒杀活动将失效，请谨慎操作！',
        onOk() {
          modifyStatus(id, status);
        },
        onCancel() {}
      });
    } else if (status == 0 && flashSaleStatus) {
      confirm({
        title: '确定要关闭该场次吗？',
        content:
          '该场次已有商家参与，若关闭则商家对应的秒杀活动将失效，请谨慎操作！',
        onOk() {
          modifyStatus(id, status);
        },
        onCancel() {}
      });
    } else {
      modifyStatus(id, status);
    }
  };
}

const styles = {
  parent: {
    display: 'flex',
    flexFlow: 'row wrap',
    alignContent: 'flex-start'
  },
  unchecked: {
    flex: '0 0 12.5%',
    width: '100px',
    border: '1px solid #ddd',
    height: '50px',
    lineHeight: '50px',
    textAlign: 'center',
    display: 'inline-block'
  },
  checked: {
    flex: '0 0 12.5%',
    width: '100px',
    border: '1px solid #ddd',
    height: '50px',
    lineHeight: '50px',
    textAlign: 'center',
    display: 'inline-block',
    color: 'white',
    background: '#F56C1D'
  }
} as any;
