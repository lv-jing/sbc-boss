import { Actor, Action, IMap } from 'plume2';

export default class CustomerInvoiceEditActor extends Actor {
  //数据源
  defaultState() {
    return {
      invoiceForm: {
        // 增专资质ID
        customerInvoiceId: '',
        // 会员ID
        customerId: '',
        // 单位全称
        companyName: '',
        // 纳税人识别号
        taxpayerNumber: '',
        // 单位电话
        companyPhone: '',
        // 单位地址
        companyAddress: '',
        // 银行基本户号
        bankNo: '',
        // 开户行
        bankName: '',
        // 营业执照复印件
        businessLicenseImg: null,
        // 一般纳税人认证资格复印件
        taxpayerIdentificationImg: null
      },
      invoiceValidForm: {},
      // 是否显示代客新增按钮
      showSwitch: false,
      // 是否显示增票资质form
      showInvoiceForm: false,
      tabIndex: '-1'
    };
  }

  constructor() {
    super();
  }
  /**
   * 修改客户增专资质信息
   * @param state
   * @param data
   */
  @Action('customerInvoiceActor: init')
  init(state: IMap, customerInvoice) {
    if (customerInvoice.get('customerInvoiceId')) {
      state = state.set('showInvoiceForm', true);
    } else {
      state = state.set('showSwitch', true);
    }

    return state.mergeIn(['invoiceForm'], customerInvoice);
  }

  /**
   * 设置增票资质页面信息
   *
   * @param state
   * @param key
   * @param value
   * @returns {Map<K, V>}
   */
  @Action('customerInvoiceActor:setValue')
  setValue(state: IMap, { key, value }) {
    return state.set(key, value);
  }

  /**
   * 设置增票资质form field
   *
   * @param state
   * @param field
   * @param value
   * @returns {Map<K, V>}
   */
  @Action('invoiceForm:field')
  changeInvoiceFormField(state: IMap, { field, value }) {
    return state.setIn(['invoiceForm', field], value);
  }
}
