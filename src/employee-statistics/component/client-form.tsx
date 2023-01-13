import React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Button } from 'antd';
import { noop } from 'qmkit';
import { DownloadModal } from 'biz';

const FormItem = Form.Item;

@Relax
export default class ClientSearch extends React.Component<any, any> {
  props: {
    relaxProps?: {
      searchKeyWords: Function;
      clientEmployeeName: string;
      changeClientEmployeeName: Function;
      clientVisible: boolean;
      hideClientModal: Function;
      showClientModal: Function;
      companyId: string;
    };
  };

  static relaxProps = {
    searchKeyWords: noop,
    clientEmployeeName: 'clientEmployeeName',
    changeClientEmployeeName: noop,
    clientVisible: 'clientVisible',
    hideClientModal: noop,
    showClientModal: noop,
    companyId: 'companyId'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      searchKeyWords,
      clientEmployeeName,
      changeClientEmployeeName,
      companyId
    } = this.props.relaxProps;
    return (
      <Form layout="inline">
        <FormItem>
          <Input
            placeholder="输入业务员姓名查看"
            addonBefore="业务员查看"
            onChange={(e) => changeClientEmployeeName((e.target as any).value)}
            value={clientEmployeeName}
          />
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            icon="search"
            onClick={() => searchKeyWords(2)}
            htmlType="submit"
          >
            搜索
          </Button>
        </FormItem>
        <FormItem>
          <DownloadModal
            visible={false}
            reportType={10}
            companyId={companyId}
          />
        </FormItem>
      </Form>
    );
  }
}
