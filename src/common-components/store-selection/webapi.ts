import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

const getStoreList = () => {
  return Fetch<TResult>('/company/list', {
    method: 'POST',
    body: JSON.stringify({
      accountName: "",
      accountState: "-1",
      auditState: "-1",
      companyCode: "",
      contractEndDate: "",
      optType: "1",
      storeName: "",
      storeState: "-1",
      storeType: 1,
      supplierName: "",
      pageNum: 0,
      pageSize: 99999
    })
  });
};

export { getStoreList };
