import { Fetch, cache } from 'qmkit';
import { querySysDictionary } from '../webapi';
import { Const } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 *
 * @returns 获取地址输入类型
 */
export async function getAddressInputTypeSetting(customerId: string) {
  return await Fetch<TResult>('/systemBoss/config/listSystemConfigByStoreId', {
    method: 'POST',
    body: JSON.stringify({
      configType: 'address_input_type',
      customerId
    })
  })
    .then((data) => {
      if (
        data.res.code === Const.SUCCESS_CODE &&
        data.res.context &&
        data.res.context.length > 0
      ) {
        return data.res.context.findIndex(
          (ad) =>
            ad.configKey === 'address_input_type_manually' && ad.context === '1'
        ) > -1
          ? 'MANUALLY'
          : 'AUTOMATICALLY';
      } else {
        return '';
      }
    })
    .catch(() => {
      return '';
    });
}

/**
 * 获取地址form的排列设置
 * @returns
 */
export async function getAddressFieldList(type: string = 'MANUALLY', customerId: string = '') {
  return await Fetch<TResult>('/addressDisplaySettingBoss/queryByStoreId/' + type + '/' + customerId, {
    method: 'GET'
  })
    .then((data) => {
      if (data.res.code === Const.SUCCESS_CODE) {
        return data.res.context.addressDisplaySettings
          .filter((field) => field.enableFlag === 1 && field.occupancyNum > 0)
          .sort((a, b) => a.sequence - b.sequence);
      } else {
        return [];
      }
    })
    .catch(() => {
      return [];
    });
}

/**
 * 获取是否进行地址验证的设置
 * @returns
 */
export async function getIsAddressValidation() {
  return await Fetch<TResult>('/addressApiSetting/queryByStoreId', {
    method: 'POST',
    body: JSON.stringify({})
  })
    .then((data) => {
      if (data.res.code === Const.SUCCESS_CODE) {
        return (
          data.res.context.addressApiSettings.findIndex(
            (item) => item.isCustom === 0 && item.isOpen === 1
          ) > -1
        );
      } else {
        return false;
      }
    })
    .catch(() => {
      return false;
    });
}

/**
 * 获取地址验证的结果
 * @param params
 * @returns
 */
export function validateAddress(params = {}) {
  return Fetch<TResult>('/addressValidation/validation', {
    method: 'POST',
    body: JSON.stringify({
      ...params,
      storeId:
        JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).storeId || ''
    })
  });
}

/**
 * 获取国家列表
 */
export async function getCountryList() {
  let countryList = JSON.parse(sessionStorage.getItem('dict-country'));
  if (countryList && countryList.length > 0) {
    return countryList;
  } else {
    return await querySysDictionary({ type: 'country' })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          sessionStorage.setItem(
            'dict-country',
            JSON.stringify(res.context.sysDictionaryVOS)
          );
          return res.context.sysDictionaryVOS;
        } else {
          return [];
        }
      })
      .catch((err) => {
        return [];
      });
  }
}

/**
 * 获取州或省列表
 */
export async function getStateList() {
  let stateList = JSON.parse(sessionStorage.getItem('dict-state'));
  if (stateList && stateList.length > 0) {
    return stateList;
  } else {
    return await Fetch<TResult>('/systemState/queryByStoreId', {
      method: 'POST',
      body: JSON.stringify({
        storeId:
          JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).storeId || ''
      })
    })
      .then((data) => {
        if (data.res.code === Const.SUCCESS_CODE) {
          sessionStorage.setItem(
            'dict-state',
            JSON.stringify(data.res.context.systemStates)
          );
          return data.res.context.systemStates;
        } else {
          return [];
        }
      })
      .catch(() => {
        return [];
      });
  }
}

/**
 * 获取城市列表
 */
export async function getCityList() {
  let cityList = JSON.parse(sessionStorage.getItem('dict-city'));
  if (cityList && cityList.length > 0) {
    return cityList;
  } else {
    return await Fetch<TResult>('/system-city/queryPageView', {
      method: 'POST',
      body: JSON.stringify({
        pageNum: 0,
        pageSize: 99999
      })
    })
      .then((data) => {
        if (data.res.code === Const.SUCCESS_CODE) {
          sessionStorage.setItem(
            'dict-city',
            JSON.stringify(data.res.context?.systemCitys?.content ?? [])
          );
          return data.res.context?.systemCitys?.content ?? [];
        } else {
          return [];
        }
      })
      .catch(() => {
        return [];
      });
  }
}

/**
 * 根据searchTxt搜索城市列表
 * @param searchTxt
 */
export function searchCity(searchTxt: string) {
  return Fetch<TResult>('/system-city/query-system-city-by-name', {
    method: 'POST',
    body: JSON.stringify({
      cityName: searchTxt,
      pageNum: 0,
      pageSize: 30
    })
  });
}

/**
 * 根据city id查询region list
 * @param id
 * @returns
 */
export function getRegionListByCityId(id: number) {
  return Fetch<TResult>(`/systemRegion/queryByStoreId/${id}`, {
    method: 'GET'
  });
}

/**
 * 搜索地址 Dadata
 * @param txt
 * @returns
 */
export function getAddressListByDadata(txt: string) {
  return Fetch<TResult>(`/address-input-auto/list?keyword=${txt}`, {
    method: 'GET'
  });
}

/**
 * 俄罗斯验证地址是不是在配送范围
 * @param addressFias
 * @returns
 */
export async function validateAddressScope(addressFias = {}) {
  return await Fetch<TResult>('/tempoline', {
    method: 'POST',
    body: JSON.stringify(addressFias)
  })
    .then((data) => {
      if (data.res.code === Const.SUCCESS_CODE) {
        return data.res.context.success;
      } else {
        return false;
      }
    })
    .catch(() => {
      return false;
    });
}

/**
 * 获取候选tagging
 */
export function getTaggingList() {
  return Fetch<TResult>('/customer/segment/segment/query', {
    method: 'POST',
    body: JSON.stringify({
      pageNum: 0,
      pageSize: 1000,
      isPublished: 1
    })
  });
}
