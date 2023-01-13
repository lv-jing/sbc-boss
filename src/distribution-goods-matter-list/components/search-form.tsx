import React from 'react';
import { IMap, Relax } from 'plume2';
import { List } from 'immutable';
import { AutoComplete, Button, Form, Select, Input } from 'antd';
import { history, InputGroupCompact, noop, AuthWrapper } from 'qmkit';

const FormItem = Form.Item;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      // chooseTitle: string;
      postTitleData: List<any>;
      postTitleSource: List<any>;
      form: IMap;
      text: string;
      head: IMap;
      onFormFieldChange: Function;
      fieldTitleChange: Function;
      searchAccount: Function;
      init: Function;
        saveOperatorIdFilter:Function;
    };
  };

  static relaxProps = {
    // chooseTitle: ['postTitle', 'chooseTitle'],
    postTitleData: ['postTitle', 'postTitleData'],
    postTitleSource: 'postTitleSource',
    form: 'form',
    head: 'head',
    text: ['postTitle', 'text'],
    onFormFieldChange: noop,
    fieldTitleChange: noop,
    searchAccount: noop,
    init: noop,
      saveOperatorIdFilter:noop,
  };

  render() {
    const {
      postTitleData,
      form,
      postTitleSource,
      text,
      onFormFieldChange,
      init,
      searchAccount,
      fieldTitleChange,
      head,
        saveOperatorIdFilter,
    } = this.props.relaxProps;

    const option = postTitleData.map((item) => {
      return (
        <AutoComplete.Option
          key={item.get('employeeId')}
          value={item.get('accountName') + '  ' + item.get('employeeName')}
        >
          {item.get('accountName') + '  ' + item.get('employeeName')}
        </AutoComplete.Option>
      );
    });
    return (
      <div>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input.Group compact>
              <Select
                defaultValue={postTitleSource.get(0).get('title')}
                onChange={(value) => fieldTitleChange('chooseTitle', value)}
              >
                {postTitleSource.map((item, index) => {
                  return (
                    <Select.Option value={index} key={index}>
                      {item.get('title')}
                    </Select.Option>
                  );
                })}
              </Select>
              <AutoComplete
                dataSource={[]}
                value={text}
                onChange={(value) => searchAccount(value)}
                onSelect={(val) => {
                    saveOperatorIdFilter(val);
                }}
                allowClear={true}
              >
                {option as any}
              </AutoComplete>
            </Input.Group>
          </FormItem>

          <FormItem>
            <InputGroupCompact
              title={'分享次数'}
              start={form.get('recommendNumMin')}
              startMin={0}
              end={form.get('recommendNumMax')}
              endMin={0}
              onStartChange={(val) =>
                onFormFieldChange({ key: 'recommendNumMin', value: val })
              }
              onEndChange={(val) =>
                onFormFieldChange({ key: 'recommendNumMax', value: val })
              }
            />
          </FormItem>

          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => init({ pageNum: 0, pageSize: 10, headInfo: null })}
            >
              搜索
            </Button>
          </FormItem>
        </Form>
        <AuthWrapper functionName="f_distribution_matter_add">
          <div className="handle-bar">
            <Button
              type="primary"
              onClick={() => {
                history.push({
                  pathname: '/distribution-goods-matter',
                  state: {
                    ...head.toJS()
                  }
                });
              }}
            >
              新增分销素材
            </Button>
          </div>
        </AuthWrapper>
      </div>
    );
  }
}
