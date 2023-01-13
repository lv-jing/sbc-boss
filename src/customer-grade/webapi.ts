import { Fetch } from 'qmkit';
import { IMap } from 'typings/globalType';

/**
 * 获取等级列表
 */
export const getGradeList = () => {
  return Fetch('/customer/levellist');
};


/**
 * 添加等级
 */
export const addGrade = (formData: IMap) => {
  return Fetch('/customer/customerLevel', {
    method: 'POST',
    body: JSON.stringify({
      ...formData.toJS()
    })
  });
};

/**
 * 修改等级
 */
export const editGrade = (formData: IMap) => {
  return Fetch('/customer/customerLevel', {
    method: 'PUT',
    body: JSON.stringify({
      ...formData.toJS()
    })
  });
};


/**
 * 删除
 */
export const deleteGrade = (id) => {
  return Fetch(`/customer/customerLevel/${id}`, {
    method: 'DELETE'
  });
};


/**
 * 获取权益列表
 */
export const getEquitiesList = () => {
  return Fetch('/customer/customerLevelRights/valid/list');
};



