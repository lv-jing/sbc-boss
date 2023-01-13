/**
 * @desc
 *
 * @使用场景
 *
 * @company qianmi.com
 * @Date    2017/9/6
 **/
export function getLinkItem({ linkItems, linkKey }) {
  const list = linkItems.linkEdit; // 链接分类列表
  return list.find(item => item.linkKey === linkKey) || null;
}
/**
 *
 * @param {any} linkKey
 * @param {any} info
 * @param {string} platForm
 * @param {any} linkConfigItem
 *
 */
export function evalLinkOutPut({
  info,
  linkConfigItem,
}: {
  info: any;
  linkConfigItem: any;
}) {
  if (!info) return {};

  let linkItem = linkConfigItem;

  if (linkItem.outputType === 'JSON') {
    let output = linkItem.outputLink
      .split("'")
      .join('')
      .split('"')
      .join('');
    let objItems = output.split(','); //

    let result = {};
    for (let i = 0, iLen = objItems.length; i < iLen; i++) {
      let objItemArray = objItems[i].trim().split(':');
      let _name = objItemArray[0],
        _value = objItemArray[1];

      if (_value.indexOf('${') >= 0) {
        //从对像中取值填充进来
        linkItem.info.split(',').forEach(item => {
          let key = item.trim();
          if (key.indexOf('::') >= 0) {
            key = key.split('::')[0].trim();
          }
          _value = _value.split('${' + key + '}').join(info[key]);
        });
      }
      result[_name] = _value;
    }
    return result;
  } else {
    let output = linkItem.outputLink;
    linkItem.info.split(',').forEach(item => {
      let key = item.trim();
      if (key.indexOf('::') >= 0) {
        key = key.split('::')[0].trim();
      }

      let value = info[key] ? info[key] : '';
      if (linkItem.options && linkItem.options.encodeURIComponent) {
        value = info[key] ? encodeURIComponent(info[key]) : '';
      }
      output = output.split('${' + key + '}').join(value);
    });
    let spstr = output.split('');
    if (spstr[spstr.length - 1] === '/') {
      output = output.substring(0, output.length - 1);
    }
    return output;
  }
}

/**
 * 从原始对象中,抽取出指定属性,返回一个新的对像
 * @param info  id,name,spuId::productId,skuId::cid,minOrderQuantity,sellPoint,image,brandName,brandId,price
 * @param originObj  {}
 */
export function extraLinkInfo({
  info,
  originObj,
}: {
  info: string;
  originObj: object;
}): any {
  let result = {};
  let _keyInfo = info.trim().split(',');
  let _noFindKey = [];
  for (let i = 0, iLen = _keyInfo.length; i < iLen; i++) {
    //原对象属性,   复制到属性
    let key = _keyInfo[i],
      toKey = _keyInfo[i];

    if (_keyInfo[i].indexOf('::') > 0) {
      let __temp = _keyInfo[i].split('::');
      toKey = __temp[0].trim();
      key = __temp[1].trim();
    }

    if (key.indexOf('.') >= 0) {
      let keysArray = key.split('.');
      let _temp = originObj;
      for (let i = 0, iLen = keysArray.length; i < iLen; i++) {
        _temp = _temp[keysArray[i]];
      }
      result[toKey] = _temp;
    } else if (originObj.hasOwnProperty(key)) {
      result[toKey] = originObj[key];
    } else {
      _noFindKey.push(key);
    }
  }

  if (_noFindKey.length > 0) {
  }
  return result;
}
