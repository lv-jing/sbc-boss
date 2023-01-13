import { Fetch } from 'qmkit';
import {IMap} from "../../typings/globalType";

/**
 * 查询积分购物获取规则
 */
export function getCateList() {
  return Fetch('/goods/goodsCates');
};

/**
 * 修改积分购物获取规则
 */
export function editCate(formData: IMap) {
  return Fetch('/goods/goodsCate', {
    method: 'PUT',
    body: JSON.stringify({
      goodsCate: formData.toJS()
    })
  });
};

/**
 * 查询积分基础获取规则
 */
export function listBasicRules() {
  return Fetch('/points/basicRules');
};

/**
 * 修改积分基础获取规则
 */
export function editBasicRules(configs) {
  return Fetch('/points/basicRules', {
    method: 'PUT',
    body: JSON.stringify({
      pointsBasicRuleDTOList: configs
    })
  });
}

/**
 * 获取图片类目列表
 */
export function getImgCates() {
  return Fetch('/system/resourceCates');
};

/**
 * 分页获取图片列表
 */
export function fetchImages(params = {}) {
  return Fetch('/system/resources', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 查询积分设置信息
 */
export function fetchPointsConfig() {
  return Fetch('/boss/pointsConfig');
};

/**
 * 修改积分设置信息
 * @param info
 */
export function savePointsConfig(info) {
  return Fetch('/boss/pointsConfig', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
};

