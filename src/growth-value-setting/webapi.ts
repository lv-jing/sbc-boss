import { Fetch } from 'qmkit';
import {IMap} from "../../typings/globalType";

/**
 * 查询成长值购物获取规则
 */
export function getCateList() {
  return Fetch('/goods/goodsCates');
};

/**
 * 修改成长值购物获取规则
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
 * 查询成长值设置信息
 */
export function fetchGrowthValueConfig() {
  return Fetch('/boss/growthValueConfig');
};

/**
 * 修改成长值设置信息
 * @param info
 */
export function savePointsConfig(info) {
  return Fetch('/boss/growthValueConfig', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
};

/**
 * 开启成长值开关
 */
export function openGrowthValue(id) {
  return Fetch('/boss/growthValueConfig/open', {
    method: 'POST',
    body: JSON.stringify({
      growthValueConfigId: id
    })
  });
};

/**
 * 关闭成长值开关
 */
export function closeGrowthValue(id) {
  return Fetch('/boss/growthValueConfig/close', {
    method: 'POST',
    body: JSON.stringify({
      growthValueConfigId: id
    })
  });
};

/**
 * 查询成长值基础获取规则
 */
export function listBasicRules() {
  return Fetch('/growthValue/basicRules');
};

/**
 * 查询积分基础获取规则
 */
export function listPointsBasicRules() {
  return Fetch('/points/basicRules');
};

/**
 * 修改成长值基础获取规则
 */
export function editBasicRules(configs, rule) {
  return Fetch('/growthValue/basicRules', {
    method: 'PUT',
    body: JSON.stringify({
      growthValueBasicRuleDTOList: configs,
      rule: rule
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

