import * as React from 'react';
import { Relax } from 'plume2';
import { Alert } from 'antd';

@Relax
export default class Tips extends React.Component<any, any> {
  render() {
    return (
      <Alert
        message="操作说明："
        description={
          <ul>
            <li>
              1、请先下载客户导入模板，按照批注中的要求填写数据，未按要求填写将会导致导入失败
            </li>
            <li>
              2、请选择.xlsx或.xls文件，文件大小≤2M，每次只能导入一个文件，建议每次导入不超过500条客户数据
            </li>
            <li>
              3、导入失败后可导出错误表格，进行修改，修改成功后重新进行上传
            </li>
            <li>
              4、导入成功后，可选择是否发送手机短信通知客户，客户可使用动态验证码进行登录，系统默认密码为客户手机号后6位
            </li>
          </ul>
        }
      />
    );
  }
}
