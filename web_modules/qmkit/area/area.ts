import { fromJS } from 'immutable';
import provinces from './provinces.json';
import areas from './areas.json';
import cities from './cities.json';

/**
 * 获取省份与地市的层级结构数据
 */
export function findProvinceCity(ids) {
  return fromJS(provinces || [])
    .map(p => {
      let pChx = false,
        cChx = false,
        pChx2 = false;
      if (fromJS(ids).find(id => id == p.get('code'))) {
        pChx = true;
      }
      let children = p.get('children').map(c => {
        cChx = pChx;
        if (!cChx && fromJS(ids).find(id => id == c.get('value'))) {
          cChx = true;
          pChx2 = true;
        }
        return fromJS({
          label: c.get('label'),
          value: c.get('value'),
          key: c.get('value'),
          disabled: cChx
        });
      });
      return fromJS({
        label: p.get('name'),
        value: p.get('code'),
        key: p.get('code'),
        children: children,
        disabled: pChx || pChx2
      });
    })
    .toJS();
}

/**
 * 查询省
 * @param code
 * @returns {string}
 */
export function findProviceName(code: string) {
  for (let p of provinces) {
    if (p.code == code) {
      return p.name;
    }
  }
  return '';
}

export function findArea(code: string) {
  for (let a of areas) {
    if (code == a.code) {
      return a.name;
    }
  }
  return '';
}

export function findCity(code: string) {
  for (let c of cities) {
    if (code == c.code) {
      return c.name;
    }
  }
  return '';
}

export function findCityAndParentId(code: string) {
  for (let c of cities) {
    if (code == c.code) {
      return { name: c.name, parent_code: c.parent_code };
    }
  }
  return { name: null, parent_code: null };
}


/**
 *  省市区字符串 返回 `江苏省/南京市/雨花台区`
 * @param provinceCode
 * @param cityCode
 * @param areaCode
 * @param splitter 分隔符
 * @returns {string}
 */
export function addressInfo(provinceCode, cityCode, areaCode, splitter = '') {
  if (provinceCode) {
    if (cityCode) {
      let proviceName = `${findProviceName(provinceCode)}`;
      let cityName = `${findCity(cityCode)}`;

      if (proviceName === cityName) {
        return `${cityName}${splitter}${findArea(areaCode)}`;
      } else {
        return `${proviceName}${cityName}${findArea(areaCode)}`;
      }
    } else {
      return `${findProviceName(provinceCode)}`;
    }
  }

  return '请选择所在地区';
}
