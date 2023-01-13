import { outputGenerate } from 'qmkit';
//商品列表数据请求分类列表数据做层转换

const isEmpty = obj => JSON.stringify(obj) === "{}";

export function exchangeCateList(data) {
  if (!data || isEmpty(data)) return [];
  let id2NameMap = {};
  return data.map(cateItem => {
    let _cateItem = outputGenerate.extraLinkInfo({
      info: "",
      originObj: cateItem,
    });
    _cateItem.pid = cateItem.parentId || _cateItem.pid;
    //兼容ant design的 key排序
    //e.g: "0,1001" => [0,1001]
    let currentPath = !cateItem.path ? [] : cateItem.path.split(",");
    //e.g: [0,1001] => [0,1001,10011001]
    currentPath.push(cateItem.id);
    //e.g: [0,1001,10011001] => "0-1001-10011001"
    _cateItem.key = currentPath[currentPath.length - 1];
    id2NameMap[_cateItem.id] = _cateItem.name;
    if (_cateItem.path) {
      let _dd = _cateItem.path.split(",");
      let names = [];
      for (let i = 0, iLen = _dd.length; i < iLen; i++) {
        names.push(id2NameMap[_dd[i]]);
      }
      names.push(_cateItem.name);
      _cateItem.label = names.join(",");
    } else {
      _cateItem.label = cateItem.name;
    }
    _cateItem.depth = cateItem.depth;
    _cateItem.value = _cateItem.key;
    _cateItem.pinyin = cateItem.pinYin;
    _cateItem.simplePinyin = cateItem.simplePinYin;
    return _cateItem;
  });
}
