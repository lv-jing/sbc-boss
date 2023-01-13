import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
};

/**
 * 查询所有的菜单/功能/权限
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchBossMenus(currPlatform) {
  return Fetch(`/menuAuth/${currPlatform}`);
}

/**
 * 新增菜单
 */
export function insertMenu(menu) {
  return Fetch<TResult>('/menuAuth/menu', {
    method: 'POST',
    body: JSON.stringify(menu)
  });
}

/**
 * 修改菜单
 */
export function updateMenu(menu) {
  return Fetch<TResult>('/menuAuth/menu', {
    method: 'PUT',
    body: JSON.stringify(menu)
  });
}

/**
 * 删除菜单
 */
export function deleteMenu(menuId) {
  return Fetch<TResult>(`/menuAuth/menu/${menuId}`, { method: 'DELETE' });
}

/**
 * 新增功能
 */
export function insertFunc(func) {
  return Fetch<TResult>('/menuAuth/func', {
    method: 'POST',
    body: JSON.stringify(func)
  });
}

/**
 * 修改功能
 */
export function updateFunc(func) {
  return Fetch<TResult>('/menuAuth/func', {
    method: 'PUT',
    body: JSON.stringify(func)
  });
}

/**
 * 删除功能
 */
export function deleteFunc(funcId) {
  return Fetch<TResult>(`/menuAuth/func/${funcId}`, { method: 'DELETE' });
}

/**
 * 新增权限
 */
export function insertAuth(auth) {
  return Fetch<TResult>('/menuAuth/auth', {
    method: 'POST',
    body: JSON.stringify(auth)
  });
}

/**
 * 修改权限
 */
export function updateAuth(auth) {
  return Fetch<TResult>('/menuAuth/auth', {
    method: 'PUT',
    body: JSON.stringify(auth)
  });
}

/**
 * 删除权限
 */
export function deleteAuth(authId) {
  return Fetch<TResult>(`/menuAuth/auth/${authId}`, { method: 'DELETE' });
}
