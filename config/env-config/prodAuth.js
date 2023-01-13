const  onlineConfig = require('./prod')
module.exports = {
  // 是否限制非system账号的系统操作权限
  systemAuth: true,
  ...onlineConfig
};
