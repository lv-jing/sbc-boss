import React from 'react';
import { AuthWrapper, DataGrid, noop } from 'qmkit';
import { Relax, IMap } from 'plume2';
import { List } from 'immutable';
type TList = List<IMap>;

const { Column } = DataGrid;

@Relax
export default class Recommend extends React.Component<any, any> {
  props: {
    relaxProps?: {
      topList: TList;
      setSmsModal: Function;
      setGroupSmsInfo: Function;
    };
  };

  static relaxProps = {
    topList: 'topList',
    setSmsModal: noop,
    setGroupSmsInfo: noop
  };

  constructor(props) {
    super(props);
  }
  render() {
    const { topList } = this.props.relaxProps;
    return (
      <DataGrid dataSource={topList.toJS()} pagination={false}>
        <Column title="人群名称" dataIndex="groupName" key="groupName" />
        <Column
          title="人群定义"
          dataIndex="groupDefinition"
          key="groupDefinition"
        />
        <Column title="运营建议" dataIndex="groupAdvise" key="groupAdvise" />
        <Column title="会员人数" dataIndex="customerNum" key="customerNum" />
        <Column
          title="操作"
          render={(data) => (
            <AuthWrapper functionName={'f-group-sms'}>
              <div>
                <a
                  href="javascript:;"
                  onClick={() => {
                    this._sendSms(data);
                  }}
                >
                  短信群发
                </a>
              </div>
            </AuthWrapper>
          )}
        />
      </DataGrid>
    );
  }

  _sendSms = async (groupData) => {
    const { setSmsModal, setGroupSmsInfo } = this.props.relaxProps;
    await setGroupSmsInfo({
      groupId: groupData.groupId,
      groupName: groupData.groupName,
      customerNum: groupData.customerNum,
      sendGroupType: 0
    });
    await setSmsModal();
  };
}
