import { Actor, Action, IMap } from 'plume2';

export default class CustomerEditActor extends Actor {
  //数据源
  defaultState() {
    return {
      customerForm: {
        // 会员详细信息标识
        customerDetailId: '',
        // 会员ID
        customerId: '',
        //客户名称
        customerName: '',
        // 省
        provinceId: '',
        // 市
        cityId: '',
        // 区
        areaId: '',
        //详细地址
        customerAddress: '',
        //联系人姓名
        contactName: '',
        //联系方式
        contactPhone: '',
        //账户名
        customerAccount: '',
        //会员等级
        customerLevelId: '',
        //负责业务员
        employeeId: '',
        //企业信息
        enterpriseInfo: {}
      },
      customerId: '',
      customerBean: {
        //审核状态
        checkState: '',
        //驳回理由
        rejectReason: '',
        //客户状态
        customerStatus: '',
        //禁用理由
        forbidReason: '',
        //客户类型
        customerType: '',
        //商家名称
        supplierName: '',
        //企业信息
        enterpriseInfo: {}
      }
    };
  }

  constructor() {
    super();
  }

  /**
   * 修改客户信息
   * @param state
   * @param data
   */
  @Action('customerActor: init')
  init(state: IMap, customer) {
    return state
      .setIn(['customerId'], customer.getIn(['customerId']))
      .setIn(['customerBean', 'checkState'], customer.getIn(['checkState']))
      .setIn(
        ['customerBean', 'rejectReason'],
        customer.getIn(['customerDetail', 'rejectReason'])
      )
      .setIn(
        ['customerBean', 'customerStatus'],
        customer.getIn(['customerDetail', 'customerStatus'])
      )
      .setIn(
        ['customerBean', 'forbidReason'],
        customer.getIn(['customerDetail', 'forbidReason'])
      )
      .setIn(['customerBean', 'customerType'], customer.getIn(['customerType']))
      .setIn(['customerBean', 'supplierName'], customer.getIn(['supplierName']))
      .setIn(
        ['customerBean', 'isDistributor'],
        customer.getIn(['customerDetail', 'isDistributor'])
      )
      .setIn(
        ['customerForm', 'customerDetailId'],
        customer.getIn(['customerDetail', 'customerDetailId'])
      )
      .setIn(
        ['customerForm', 'customerId'],
        customer.getIn(['customerDetail', 'customerId'])
      )
      .setIn(
        ['customerForm', 'customerName'],
        customer.getIn(['customerDetail', 'customerName'])
      )
      .setIn(
        ['customerForm', 'provinceId'],
        customer.getIn(['customerDetail', 'provinceId'])
      )
      .setIn(
        ['customerForm', 'cityId'],
        customer.getIn(['customerDetail', 'cityId'])
      )
      .setIn(
        ['customerForm', 'areaId'],
        customer.getIn(['customerDetail', 'areaId'])
      )
      .setIn(
        ['customerForm', 'customerAddress'],
        customer.getIn(['customerDetail', 'customerAddress'])
      )
      .setIn(
        ['customerForm', 'contactName'],
        customer.getIn(['customerDetail', 'contactName'])
      )
      .setIn(
        ['customerForm', 'contactPhone'],
        customer.getIn(['customerDetail', 'contactPhone'])
      )
      .setIn(
        ['customerForm', 'customerAccount'],
        customer.getIn(['customerAccount'])
      )
      .setIn(
        ['customerForm', 'customerLevelId'],
        customer.getIn(['customerLevelId'])
      )
      .setIn(
        ['customerForm', 'employeeId'],
        customer.getIn(['customerDetail', 'employeeId'])
      )
      .setIn(
        ['customerForm', 'enterpriseCheckState'],
        customer.getIn(['enterpriseCheckState'])
      )
      .setIn(
        ['customerForm', 'enterpriseInfo'],
        customer.getIn(['enterpriseInfo'])
      );
  }

  @Action('form:field')
  changeField(state: IMap, { field, value }) {
    return state.setIn(['customerForm', field], value);
  }

  @Action('form:updateEnterpriseInfo')
  updateEnterpriseInfo(state: IMap, { field, value }) {
    return state.setIn(['customerForm', 'enterpriseInfo', field], value);
  }
}
