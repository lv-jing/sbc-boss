/**
 * 山寨redis的localStorage|sessionStorage操作
 * 目前只提供两层操作
 * storage('session').set('test','123432'); //sessionStorage
 * storage().set('test','123432'); //localStorage
 * todo 可以补充新的
 * @params storage: local(localStorage) | session(sessionStorage)
 */
export default (storage: string = 'local') => {
  let Storage = storage == 'session' ? sessionStorage : localStorage;
  return {
    /****** string *****/
    get: (key: string) => {
      return Storage.getItem(key);
    },
    set: (key: string, value: string | object) => {
      //类型判断
      value = typeof value == 'string' ? value : JSON.stringify(value);
      Storage.setItem(key, value);
    },

    /****** hash *****/
    /**
     * hset('name', 'key', value)
     */
    hset: (hash: string, key: string, value: string | object) => {
      let data = JSON.parse(Storage.getItem(hash));
      data[key] = value;
      Storage.setItem(hash, JSON.stringify(data));
    },
    /**
     * hget('name', 'key')
     *
     */
    hget: (hash: string, key: string) => {
      let jsonString = Storage.getItem(hash);
      if (jsonString) {
        let data = JSON.parse(jsonString);
        return data[key];
      }
      return null;
    },

    /****** list *****/
    //向列表压入一条数据
    lpush: (key: string, value: object) => {
      let list = JSON.parse(Storage.getItem(key)) || [];
      list.push(value);
      Storage.setItem(key, JSON.stringify(list));
    },
    //返回存储列表的结果
    lget: (key: string) => {
      return JSON.parse(Storage.getItem(key)) || [];
    },

    /**
     * 删除
     */
    del: (key) => {
      Storage.removeItem(key);
    }
  };
};
