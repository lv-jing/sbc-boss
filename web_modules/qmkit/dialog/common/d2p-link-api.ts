/**
 * 分销弹框链接相关API
 * getGoodList => 获取商品数据
 * getCateList => 获取弹框分类
 * 获取营销信息 =>getMarkingList
 */
const systemCodeZip = {
  d2cStore: "H4sIAAAAAAAAA0sxSg4uyS9KBQDJOKt4CAAAAA==",
  d2p: "H4sIAAAAAAAAA0sxKgAAo5/qDQMAAAA=",
};
export function getGoodList(
  api_host,
  url = "",
  {
    pageNum = 0,
    pageSize = 6,
    type = 1,
    catName = "",
    q = "",
    systemCode = "",
  }: {
    pageSize: number;
    pageNum: number;
    type: number;
    catName: any;
    q: string;
    systemCode: string;
  },
): Promise<any> {
  if (!api_host) throw new Error("check api_host");
  let getUrl = api_host + url;
  let data = new FormData();
  data.append("pageNo", String(pageNum));
  data.append("pageSize", String(pageSize));
  data.append("type", String(type));
  data.append("cats", String(catName));
  data.append("keyword", String(q));
  data.append("sc", "H4sIAAAAAAAAA0sxKgAAo5/qDQMAAAA=");
  return fetch(getUrl, {
    method: "POST",
    credentials: "include",
    body: data,
  })
    .then(res => res.json())
    .then(data => data.data)
    .catch(error => {
      console.error(error);
    });
}
export function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
}
export function getCateList({ api_host, url = "" }): Promise<any> {
  if (!api_host) throw new Error("check api_host");
  let getUrl = api_host + url;
  let sessionId;
  sessionId = "Bearer " + sessionId;
  return fetch(getUrl, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: sessionId,
    },
  })
    .then(res => res.json())
    .then(data => data.context)
    .catch(error => {
      console.error(error);
    });
}
export function getArticleList(
  api_host,
  src,
  { iDisplayStart, iDisplayLength, title },
): Promise<any> {
  if (!api_host) throw new Error("check api_host");
  let getUrl = api_host + src;
  let data = new FormData();
  data.append("iDisplayStart", String(iDisplayStart));
  data.append("iDisplayLength", String(iDisplayLength));
  data.append("title", String(title));
  data.append("sc", "H4sIAAAAAAAAA0sxKgAAo5/qDQMAAAA=");
  return fetch(getUrl, {
    method: "POST",
    credentials: "include",
    body: data,
  })
    .then(res => res.json())
    .then(data => data)
    .catch(error => {
      console.error(error);
    });
}
