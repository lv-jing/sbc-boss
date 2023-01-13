import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: {
    opLogPage: any;
  };
};

export const fetchOperateLogList = (filter = {}) => {
  return Fetch<TResult>('/systemBoss/operationLog/queryOpLogByCriteria', {
    method: 'POST',
    body: JSON.stringify(filter)
  });
};
