/**
 * 商城弹框链接相关API
 * getGoodList => 获取商品数据
 * getCateList => 获取弹框分类
 * 获取营销信息 =>getMarkingList
 */
const systemCodeZip = {
  d2cStore: 'H4sIAAAAAAAAA0sxSg4uyS9KBQDJOKt4CAAAAA==',
  d2p: 'H4sIAAAAAAAAA0sxKgAAo5/qDQMAAAA='
};
import {Const, Fetch} from 'qmkit';
const token = (window as any).token;

export function getRechargeableCardList(
  api_host,
  url = '',
  {
    pageNum = 0,
    pageSize = 6,
    rechargeableCardName
  }: { pageSize: number; pageNum: number; rechargeableCardName: string }
): Promise<any> {
  if (!api_host) throw new Error('check api_host');
  const getUrl = api_host + url;
  let sessionId;
  // sessionId = "Bearer " + sessionId;
  sessionId = 'Bearer ' + token;
  const storeId = (window as any).storeId;
  return fetch(getUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: sessionId
    },
    body: JSON.stringify({
      pageNum,
      pageSize,
      rechargeableCardName,
      storeId
    })
  })
    .then((res) => res.json())
    .then((data) => data.context.rechargeableCardVOPage)
    .catch((error) => {
      console.error(error);
    });
}


export const getPageList = ({
  includePageTypeList = [],
  excludePageTypeList = [],
  platform = 'pc',
  pageNo = -1,
  pageSize = 10,
  title = '',
  storeId = null,
  url = '/api/page/list?'
}) => {
  let exclude = '';
  let excludeTemp = excludePageTypeList && excludePageTypeList.length > 0 && encodeURI(excludePageTypeList);
  excludeTemp && excludeTemp.split(',').map((v, k) => {
    if (excludeTemp.split(',').length - 1 > k) {
      exclude += encodeURI(`"${v}"`) + ',';
    } else if (excludeTemp.split(',').length - 1 === k) {
      exclude += encodeURI(`"${v}"`);
    }
  });

  let include = '';
  let includeTemp = includePageTypeList && includePageTypeList.length > 0 && encodeURI(includePageTypeList);
  includeTemp && includeTemp.split(',').map((v, k) => {
    if (includeTemp.split(',').length - 1 > k) {
      include += encodeURI(`"${v}"`) + ',';
    } else if (includeTemp.split(',').length - 1 === k) {
      include += encodeURI(`"${v}"`);
    }
  });

  let endUrl = `${
    Const.X_XITE_OPEN_HOST
  }${url}includePageTypeList=[${include}]&excludePageTypeList=[${exclude}]&platform=${platform}&pageNo=${pageNo}&pageSize=${pageSize}&useful=${true}&title=${title}`;

  return fetch(endUrl, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token
    }
  }).then((res) => res.json())
    .then((data) => data.data)
    .catch((error) => {
      console.error(error);
    });
};

export function getTimgCardList(
  api_host,
  url = '',
  {
    pageNum = 0,
    pageSize = 6,
    timingCardName
  }: { pageSize: number; pageNum: number; timingCardName?: string }
): Promise<any> {
  if (!api_host) throw new Error('check api_host');
  const getUrl = api_host + url;
  let sessionId;
  // sessionId = "Bearer " + sessionId;
  sessionId = 'Bearer ' + token;
  const storeId = (window as any).storeId;
  return fetch(getUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: sessionId
    },
    body: JSON.stringify({
      pageNum,
      pageSize,
      timingCardName,
      storeId
    })
  })
    .then((res) => res.json())
    .then((data) => data.context.timingCardVOPage)
    .catch((error) => {
      console.error(error);
    });
}

export function getStoreList(
  api_host,
  url = '',
  {
    pageNum = 0,
    pageSize = 6,
    keywords = ''
  }: { pageSize: number; pageNum: number; keywords?: string }
): Promise<any> {
  if (!api_host) throw new Error('check api_host');
  const getUrl = api_host + url;
  let sessionId;
  // sessionId = "Bearer " + sessionId;
  sessionId = 'Bearer ' + token;
  return fetch(getUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: sessionId
    },
    body: JSON.stringify({
      pageNum,
      pageSize,
      keywords
    })
  })
    .then((res) => res.json())
    .then((data) => data.context)
    .catch((error) => {
      console.error(error);
    });
}
export function getGoodList(
  api_host,
  url = '',
  {
    pageNum = 0,
    pageSize = 6,
    type = 1,
    catName = '',
    q = '',
    searchByStore
  }: {
    pageSize: number;
    pageNum: number;
    type: number;
    catName: any;
    q: string;
    searchByStore?: number;
  }
): Promise<any> {
  if (!api_host) throw new Error('check api_host');
  let getUrl = api_host + url;
  let sessionId;
  // sessionId = "Bearer " + sessionId;
  sessionId = 'Bearer ' + token;
  const storeId = (window as any).storeId;
  return fetch(getUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: sessionId
    },
    body: JSON.stringify(
      storeId
        ? {
            pageNum,
            pageSize,
            type,
            q,
            catName,
            storeId
          }
        : searchByStore
        ? { pageNum, pageSize, type, q, catName, searchByStore }
        : {
            pageNum,
            pageSize,
            type,
            q,
            catName
          }
    )
  })
    .then((res) => res.json())
    .then((data) => data.data)
    .catch((error) => {
      console.error(error);
    });
}

/**
 * 查询促销列表
 */
export function getPromotionList(
  {
    cateKey,
    pageNum = 0,
    pageSize = 6,
    goodsName,
    goodsInfoName,
    marketingSubType,
    grouponCateId,
    queryTab = 5,
    cateId,
    marketingName,
    status = 3,
    queryDataType = 3,
  }: {
    pageSize: number;
    pageNum: number;
    cateKey: string,
    goodsName: string;
    goodsInfoName: string;
    marketingName: string;
    marketingSubType: number;
    queryTab: string;
    cateId: string;
    status: number;
    queryDataType: number;
  }
): Promise<any> {
  let url
  let params = {}
  if(cateKey && cateKey === 'groupon'){
    url = '/pushpage/page';
    params = {
      pageNum,
      pageSize,
      goodsInfoName,
      status,
      grouponCateId
    };
  } else if(cateKey === 'flash'){
    url = '/pushpage/flashSalePage';
    params = {
      pageNum,
      pageSize,
      goodsName,
      cateId,
      queryDataType
    };
  } else if(cateKey === 'full') {
    url = '/pushpage/marketingPage';
    params = {
      pageNum,
      pageSize,
      marketingSubType,
      queryTab,
      marketingName,
    };
  }
  let getUrl = Const.HOST + url;
  let sessionId = 'Bearer ' + token;
  return fetch(getUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: sessionId
    },
    body: JSON.stringify(params)
  })
    .then((res) => res.json())
    .then((data) => {
      if(cateKey && cateKey === 'groupon'){
        return data.context.grouponGoodsInfoVOPage
      } else if(cateKey && cateKey === 'flash'){
        return data.context.flashSaleGoodsVOPage
      } else if (cateKey && cateKey === 'full') {
        return data.context
      }
    })
    .catch((error) => {
      console.error(error);
    });
}


/**
 * 获取拼团商品分类列表
 */
export const getGrouponCateList = () => {
  return Fetch<TResult>('/groupon/cate/list');
};

/**
 * 获取秒杀商品分类列表
 */
export const getFlashCateList = () => {
  return Fetch('/flashsalecate/list', {
    method: 'POST',
    body: JSON.stringify({})
  });
};

/**
 * 查询全部品牌
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getBrandList = () => {
  return Fetch('/goods/allGoodsBrands', {
    method: 'GET'
  });
};

/**
 * 查询服务列表
 */
export function getProjectList(
  api_host,
  url = '',
  {
    pageNum = 0,
    pageSize = 6,
    projectCateId,
    projectName
  }: {
    pageSize: number;
    pageNum: number;
    projectCateId: string;
    projectName: string;
  }
): Promise<any> {

  let getUrl = api_host + url;
  let sessionId = 'Bearer ' + token;
  const storeId = (window as any).storeId;

  const params = {
    pageNum,
    pageSize,
    storeId,
    projectCateId,
    projectName
  };

  return fetch(getUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: sessionId
    },
    body: JSON.stringify(params)
  })
    .then((res) => res.json())
    .then((data) => data.context.projectVOPage)
    .catch((error) => {
      console.error(error);
    });
}

/**
 * 查询服务分类列表
 */
export function getProjectCateList({ api_host, url = '' }): Promise<any> {
  if (!api_host) throw new Error('check api_host');
  let getUrl = api_host + url;
  let sessionId;
  // sessionId = "Bearer " + sessionId;
  sessionId = 'Bearer ' + token;
  const storeId = (window as any).storeId;

  return fetch(getUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: sessionId
    },
    body: JSON.stringify({
      storeId
    })
  })
    .then((res) => res.json())
    .then((data) => data.context.projectCateList)
    .catch((error) => {
      console.error(error);
    });
}

export function getCookie(cname) {
  var name = cname + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return '';
}
export function getStoreListByName({
  api_host,
  url = '',
  storeName
}): Promise<any> {
  if (!api_host) throw new Error('check api_host');
  const getUrl = api_host + url;
  let sessionId;
  // sessionId = "Bearer " + sessionId;
  sessionId = 'Bearer ' + token;
  return fetch(getUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: sessionId
    },
    body: JSON.stringify({ storeName })
  })
    .then((res) => res.json())
    .then((data) => data.context.storeSimpleInfos)
    .catch((error) => {
      console.error(error);
    });
}

export function getCateList({ api_host, url = '' }): Promise<any> {
  if (!api_host) throw new Error('check api_host');
  let getUrl = api_host + url;
  let sessionId;
  // sessionId = "Bearer " + sessionId;
  sessionId = 'Bearer ' + token;
  const storeId = (window as any).storeId;
  getUrl = storeId ? getUrl + `?storeId=${storeId}` : getUrl;
  return fetch(getUrl, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: sessionId
    }
  })
    .then((res) => res.json())
    .then((data) => data.context)
    .catch((error) => {
      console.error(error);
    });
  // return fetch(getUrl, {
  //   method: "POST",
  //   credentials: "include",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ sc: "H4sIAAAAAAAAA0sxSg4uyS9KBQDJOKt4CAAAAA==" }),
  // })
  //   .then(res => res.json())
  //   .then(data => data.data)
  //   .catch(error => {
  //     console.error(error);
  //   });
}

export function getMarkingList({
  api_host,
  url = 'discount/list',
  typeEnum,
  pageNum = 0,
  pageSize = 10
}): Promise<any> {
  if (!api_host) throw new Error('check api_host');
  let getUrl = api_host + url;
  return fetch(getUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
      typeEnum !== 'SALESMAN'
        ? {
            typeEnum: typeEnum,
            pageNum, //0
            pageSize //10
          }
        : { typeEnum: typeEnum }
    )
  })
    .then((res) => res.json())
    .then((data) => data.data)
    .catch((error) => {
      console.error(error);
    });
}
// declare let $CONST_HOST: any;
// const MC_HOST = $CONST_HOST.v_admin_mc_api_url;
const MC_HOST = '//mc-api4.qianmi4.com:8080';
export function getIsOpenGroup({ url = '' }): Promise<any> {
  let getUrl = MC_HOST + url;
  return fetch(getUrl, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domainType: '0032' })
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((error) => {
      console.error(error);
    });
}
