const routes = [
  //首页
  { path: '/', exact: true, asyncComponent: () => import('./home') },
  {
    path: '/rmf-model',
    exact: true,
    asyncComponent: () => import('./crm/rmf-model')
  },
  {
    path: '/operational-planning/:planId',
    exact: true,
    asyncComponent: () => import('./crm/operational-planning')
  },
  //新增人群运行计划
  {
    path: '/add-crowd-operations/:id?/:ifModify?',
    exact: true,
    asyncComponent: () => System.import('./crm/add-crowd-operations')
  },
  {
    path: '/app-push',
    exact: true,
    asyncComponent: () => System.import('./sms/app-push')
  },
  {
    path: '/station-message',
    exact: true,
    asyncComponent: () => System.import('./sms/station-message')
  },
  //短信
  {
    path: '/sms-reach',
    exact: true,
    asyncComponent: () => import('./sms/sms-reach')
  },
  //短信
  {
    path: '/sms-template/:type/:id?',
    exact: true,
    asyncComponent: () => import('./sms/sms-template')
  },
  //短信
  {
    path: '/add-signature/:id?',
    exact: true,
    asyncComponent: () => import('./sms/add-signature')
  },
  //会员标签
  {
    path: '/custom-tag',
    exact: true,
    asyncComponent: () => import('./crm/custom-tag')
  },
  // RFM模型调参
  {
    path: '/rmf-config',
    exact: true,
    asyncComponent: () => import('./crm/rmf-config')
  },
  // 会员分群
  {
    path: '/customer-group',
    exact: true,
    asyncComponent: () => import('./crm/customer-group')
  },
  // 运营计划
  {
    path: '/customer-plan-list',
    exact: true,
    asyncComponent: () => System.import('./crm/customer-plan-list')
  },
  //分销记录
  {
    path: '/distribution-record/:customerId?/:customerAccount?',
    exact: true,
    asyncComponent: () => import('./distribution-record')
  },
  //订单列表
  {
    path: '/order-list',
    exact: true,
    asyncComponent: () => import('./order-list')
  },
  //订单-详情
  {
    path: '/order-detail/:tid',
    exact: true,
    asyncComponent: () => import('./order-detail')
  },
  //订单-退单列表
  {
    path: '/order-return-list',
    exact: true,
    asyncComponent: () => import('./order-return-list')
  },
  //订单-订单管理-退单详情
  {
    path: '/order-return-detail/:rid',
    exact: true,
    asyncComponent: () => import('./order-return-detail')
  },
  //订阅
  {
    path: '/subscription-list',
    exact: true,
    asyncComponent: () => import('./subscription')
  },
  {
    path: '/subscription-detail/:subId',
    exact: true,
    asyncComponent: () => import('./subscription-detail')
  },
  //财务-收款账户
  {
    path: '/finance-account-receivable',
    asyncComponent: () => import('./finance-account-receivable')
  },
  //订单收款
  {
    path: '/finance-order-receive',
    asyncComponent: () => import('./finance-order-receive')
  },
  //退单退款
  {
    path: '/finance-refund',
    asyncComponent: () => import('./finance-refund')
  },
  //收款详情
  {
    path: '/finance-receive-detail',
    asyncComponent: () => import('./finance-receive-detail')
  },
  //退款明细
  {
    path: '/finance-refund-detail',
    asyncComponent: () => import('./finance-refund-detail')
  },
  //增值税资质审核
  {
    path: '/finance-val-added-tax',
    asyncComponent: () => import('./finance-val-added-tax')
  },
  //订单开票
  {
    path: '/finance-order-ticket',
    asyncComponent: () => import('./finance-order-ticket')
  },
  // 员工列表
  {
    path: '/employee-list',
    asyncComponent: () => import('./employee-list')
  },
  // 员工导入
  {
    path: '/employee-import',
    asyncComponent: () => import('./employee-import')
  },
  // 部门管理
  {
    path: '/department-mangement',
    asyncComponent: () => import('./department-mangement')
  },
  // 部门导入
  {
    path: '/department-import',
    asyncComponent: () => import('./department-import')
  },
  // 角色列表
  {
    path: '/role-list',
    asyncComponent: () => import('./role-list')
  },
  // 权限管理
  {
    path: '/authority-manage',
    asyncComponent: () => import('./authority-manage')
  },
  // 权限分配
  {
    path: '/authority-allocating/:roleInfoId/:roleName',
    asyncComponent: () => import('./authority-allocating')
  },
  // 商品品牌
  {
    path: '/goods-brand',
    asyncComponent: () => import('./goods-brand')
  },
  // 商品分类
  { path: '/goods-cate', asyncComponent: () => import('./product-category') },
  //商品分类导入
  {
    path: '/goods-cate-import',
    asyncComponent: () => import('./goods-cate-import')
  }, // 商品属性
  {
    path: '/goods-prop/:cid',
    exact: true,
    asyncComponent: () => import('./goods-prop')
  },
  //商品列表
  { path: '/goods-list', asyncComponent: () => import('./goods-list') },
  // goods-regular-edit > 审核通过的商品编辑
  {
    path: '/goods-regular-edit/:gid',
    asyncComponent: () => import('./regular-product-add/main')
  },

  // goods-bundle-edit
  {
    path: '/goods-bundle-edit/:gid',
    asyncComponent: () => import('./goods-add/main')
  },
  // 客户列表
  {
    path: '/customer-list',
    asyncComponent: () => import('./customer-list')
  },
  {
    path: '/customer-details/:type/:id/:account',
    asyncComponent: () => import('./customer-details')
  },
  {
    path: '/petowner-details/:id/:account',
    asyncComponent: () => import('./customer-details/member-detail')
  },
  {
    path: '/edit-petowner/:id/:account',
    asyncComponent: () => import('./customer-details/edit-basic-information')
  },
  {
    path: '/edit-pet/:id/:account/:petid',
    asyncComponent: () => import('./customer-details/edit-pet-item')
  },
  // 客户导入
  {
    path: '/customer-import',
    asyncComponent: () => import('./customer-import')
  },
  // 客户成长值
  {
    path: '/customer-grow-value/:customerId/:enterpriseCustomer?',
    asyncComponent: () => import('./customer-grow-value')
  },
  // 客户等级
  {
    path: '/customer-grade',
    asyncComponent: () => import('./customer-grade')
  },
  {
    path: '/customer-equities',
    exact: true,
    asyncComponent: () => import('./customer-equities')
  },
  // 客户详情
  {
    path: '/customer-detail/:customerId',
    asyncComponent: () => import('./customer-detail')
  },
  // crm版客户详情
  {
    path: '/crm-customer-detail/:customerId',
    asyncComponent: () => System.import('./crm/customer-detail')
  },
  // 客户等级
  {
    path: '/customer-level',
    asyncComponent: () => import('./customer-level')
  },
  // 成长值设置
  {
    path: '/growth-value-setting',
    asyncComponent: () => import('./growth-value-setting')
  },
  // 积分设置
  {
    path: '/points-setting',
    asyncComponent: () => import('./points-setting')
  },
  // 基本设置
  {
    path: '/basic-setting',
    asyncComponent: () => import('./basic-setting')
  },
  // 招商页设置
  {
    path: '/business-setting',
    asyncComponent: () => import('./business-setting')
  },
  // 公司设置
  {
    path: '/company-information',
    asyncComponent: () => import('./company-information')
  },
  //页面管理
  {
    path: '/page-manage/weixin',
    asyncComponent: () => import('./page-manage')
  },
  //模板管理
  {
    path: '/template-manage/weixin',
    asyncComponent: () => import('./template-manage')
  },
  //页面管理
  {
    path: '/page-manage/pc',
    asyncComponent: () => import('./page-manage')
  },
  //模板管理
  {
    path: '/template-manage/pc',
    asyncComponent: () => import('./template-manage')
  },
  // 图片库
  {
    path: '/picture-store',
    asyncComponent: () => import('./picture-store')
  },
  // 视频库
  {
    path: '/video-store',
    asyncComponent: () => import('./video-store')
  },
  // 图片分类
  {
    path: '/picture-cate',
    asyncComponent: () => import('./picture-cate')
  },
  // 素材分类
  {
    path: '/resource-cate',
    asyncComponent: () => import('./resource-cate')
  },
  // 邮箱接口
  { path: '/mail-port', asyncComponent: () => import('./mail-port') },
  // ERP接口
  { path: '/erp-port', asyncComponent: () => import('./erp-port') },
  // 邮箱接口
  {
    path: '/picture-port',
    asyncComponent: () => import('./picture-port')
  },
  // 对象存储
  {
    path: '/resource-port',
    asyncComponent: () => import('./resource-port')
  },
  // 物流接口
  {
    path: '/express-port',
    asyncComponent: () => import('./express-port')
  },
  // 账号管理
  {
    path: '/account-manage',
    asyncComponent: () => import('./account-manage')
  },
  // 物流公司管理
  {
    path: '/logistics-manage',
    asyncComponent: () => import('./logistics-manage')
  },
  //商家列表
  {
    path: '/supplier-list',
    asyncComponent: () => import('./supplier-list')
  },
  //供应商列表
  {
    path: '/supplier-list-provider',
    asyncComponent: () => import('./supplier-list-provider')
  },
  //商家编辑
  {
    path: '/supplier-edit/:sid',
    asyncComponent: () => import('./supplier-edit')
  },
  //商家详情
  {
    path: '/supplier-detail/:sid',
    asyncComponent: () => import('./supplier-detail')
  },
  //订单设置
  {
    path: '/order-setting',
    asyncComponent: () => import('./order-setting')
  },
  //审核管理
  {
    path: '/check-manage',
    asyncComponent: () => import('./check-manage')
  },
  //操作日志
  {
    path: '/operation-log',
    asyncComponent: () => import('./operation-log')
  },
  //商品详情
  {
    path: '/goods-detail/:gid',
    asyncComponent: () => import('./goods-detail')
  },
  //供应商商品详情
  {
    path: '/goods-detail-provider/:gid',
    asyncComponent: () => import('./goods-detail-provider')
  },
  //商品SKU详情
  {
    path: '/goods-sku-detail/:pid',
    asyncComponent: () => import('./goods-sku-detail')
  },
  //供应商商品SKU详情
  {
    path: '/goods-sku-detail-provider/:pid',
    asyncComponent: () => import('./goods-sku-detail-provider')
  },
  //待审核商品列表对应的商品详情
  {
    path: '/goods-check-detail/:gid',
    asyncComponent: () => import('./goods-detail')
  },
  //供应商待审核商品列表对应的商品详情
  {
    path: '/goods-check-detail-provider/:gid',
    asyncComponent: () => import('./goods-detail-provider')
  },
  //待审核商品列表对应的商品SKU详情
  {
    path: '/goods-sku-check-detail/:pid',
    asyncComponent: () => import('./goods-sku-detail')
  },
  //供应商待审核商品列表对应的商品SKU详情
  {
    path: '/goods-sku-check-detail-provider/:pid',
    asyncComponent: () => import('./goods-sku-detail-provider')
  },
  //商家收款账户
  {
    path: '/supplier-account',
    asyncComponent: () => import('./supplier-account')
  },
  //商品审核
  {
    path: '/goods-check',
    asyncComponent: () => import('./goods-check')
  },
  //确认账号
  {
    path: '/confirm-account/:tid',
    asyncComponent: () => import('./confirm-account')
  },
  //查询明细
  {
    path: '/query-details',
    asyncComponent: () => import('./query-details')
  },
  //资金管理-财务对账
  {
    path: '/finance-manage-check',
    asyncComponent: () => import('./finance-manage-check')
  },
  //资金管理-会员提现管理
  {
    path: '/customer-draw-cash',
    asyncComponent: () => import('./customer-draw-cash')
  },
  //对账明细
  {
    path: '/reconciliation-details',
    asyncComponent: () => import('./reconciliation-details')
  },
  //财务结算
  {
    path: '/finance-manage-settle',
    asyncComponent: () => import('./finance-manage-settle')
  },
  //结算明细
  {
    path: '/billing-details/:settleId',
    asyncComponent: () => import('./billing-details')
  },
  //对账明细
  {
    path: '/finance-manage-refund/:sid/:kind',
    asyncComponent: () => import('./finance-manage-refund')
  },
  //流量统计
  {
    path: '/flow-statistics',
    asyncComponent: () => import('./flow-statistics')
  },
  //交易统计
  {
    path: '/trade-statistics',
    asyncComponent: () => import('./trade-statistics')
  },
  //商品统计
  {
    path: '/goods-statistics',
    asyncComponent: () => import('./goods-statistics')
  },
  //客户统计
  {
    path: '/customer-statistics',
    asyncComponent: () => import('./customer-statistics')
  },
  //业务员统计
  {
    path: '/employee-statistics',
    asyncComponent: () => import('./employee-statistics')
  },
  //报表下载
  {
    path: '/download-report',
    asyncComponent: () => import('./download-report')
  },
  //新增商品库商品
  {
    path: '/goods-library-add',
    asyncComponent: () => import('./goods-library-detail')
  },
  //编辑商品库商品
  {
    path: '/goods-library-detail/:goodsId',
    asyncComponent: () => import('./goods-library-detail')
  },
  //商品库列表
  {
    path: '/goods-library-list',
    asyncComponent: () => import('./goods-library-list')
  },
  //编辑商品库商品sku
  {
    path: '/goods-library-sku-editor/:goodsId',
    asyncComponent: () => import('./goods-library-sku-editor')
  },
  //商品库商品导入
  {
    path: '/goods-library-import',
    asyncComponent: () => import('./goods-library-import')
  },

  //在线客服
  {
    path: '/online-service',
    asyncComponent: () => import('./online-service')
  },
  //登录接口
  {
    path: '/login-interface',
    asyncComponent: () => import('./login-interface')
  },
  //分享接口
  {
    path: '/share-interface',
    asyncComponent: () => import('./share-interface')
  },
  //邮箱接口
  {
    path: '/email-interface',
    asyncComponent: () => import('./email-interface')
  },
  //小程序接口
  {
    path: '/mini-interface',
    asyncComponent: () => import('./mini-interface')
  },
  // 优惠券列表
  {
    path: '/coupon-list',
    asyncComponent: () => import('./coupon-list')
  },
  // 优惠券详情
  {
    path: '/coupon-detail/:cid',
    asyncComponent: () => import('./coupon-detail')
  },
  // 营销中心
  {
    path: '/marketing-center',
    asyncComponent: () => import('./marketing-center')
  },
  // 营销中心 - 创建优惠券
  {
    path: '/coupon-add',
    asyncComponent: () => import('./coupon')
  },
  // 营销中心 - 编辑优惠券
  {
    path: '/coupon-edit/:cid',
    asyncComponent: () => import('./coupon')
  },
  //优惠券分类
  {
    path: '/coupon-cate',
    asyncComponent: () => import('./coupon-cate')
  },
  // 优惠券活动
  {
    path: '/coupon-activity-list',
    asyncComponent: () => import('./coupon-activity-list')
  },
  // 优惠券活动详情
  {
    path: '/coupon-activity-detail/:id/:type',
    asyncComponent: () => import('./coupon-activity-detail')
  },
  // 创建/编辑全场赠券活动
  {
    path: '/coupon-activity-all-present/:activityId?',
    asyncComponent: () => import('./coupon-activity-add/all-present')
  },
  //创建/编辑注册赠券活动
  {
    path: '/coupon-activity-registered/:activityId?',
    asyncComponent: () => import('./coupon-activity-add/registered')
  },
  //创建/编辑企业购注册赠券活动
  {
    path: '/coupon-activity-registered-qyg/:activityId?',
    asyncComponent: () => import('./coupon-activity-add/registered-qyg')
  },
  //创建/编辑指定赠券活动
  {
    path: '/coupon-activity-specify/:activityId?',
    asyncComponent: () => import('./coupon-activity-add/specify')
  },
  // 整点秒杀
  {
    path: '/flash-sale',
    exact: true,
    asyncComponent: () => import('./flash-sale')
  },
  // 积分商品列表
  {
    path: '/points-goods-list',
    exact: true,
    asyncComponent: () => import('./points-goods-list')
  },
  // 添加积分商品
  {
    path: '/points-goods-add',
    exact: true,
    asyncComponent: () => import('./points-goods-add')
  },
  // 积分商品导入
  {
    path: '/points-goods-import',
    exact: true,
    asyncComponent: () => import('./points-goods-import')
  },
  // 添加积分优惠券
  {
    path: '/points-coupon-add',
    exact: true,
    asyncComponent: () => import('./points-coupon-add')
  },
  // 关于我们
  {
    path: '/about-us',
    asyncComponent: () => import('./about-us')
  },
  //APP分享
  {
    path: '/app-share',
    asyncComponent: () => import('./app-share')
  },
  // APP检测升级更新
  {
    path: '/upgrade-setting',
    asyncComponent: () => import('./upgrade-setting')
  },
  //会员资金
  {
    path: '/customer-funds',
    asyncComponent: () => import('./customer-funds')
  },
  //余额明细
  {
    path: '/customer-funds-detail/:customerId',
    exact: true,
    asyncComponent: () => import('./customer-funds-detail')
  },
  //新增编辑商品分销素材
  {
    path: '/distribution-goods-matter/:id?',
    asyncComponent: () => import('./distribution-goods-matter')
  },
  //商品分销素材列表
  {
    path: '/distribution-goods-matter-list',
    asyncComponent: () => import('./distribution-goods-matter-list')
  },
  {
    path: '/distribution-goods-matter-list-new',
    asyncComponent: () => import('./distribution-goods-matter-list-new')
  },
  {
    path: '/distribution-goods-matter-add',
    asyncComponent: () => import('./distribution-goods-matter-add')
  },
  //邀新记录
  {
    path: '/invite-new-record/:customerId?/:customerAccount?',
    asyncComponent: () => import('./invite-new-record')
  },
  // 分销设置
  {
    path: '/distribution-setting',
    asyncComponent: () => import('./distribution-setting')
  },
  //分销员
  {
    path: '/distribution-customer',
    asyncComponent: () => import('./distribution-customer')
  },
  //分销佣金
  {
    path: '/distribution-commission',
    asyncComponent: () => import('./distribution-commission')
  },
  //分销商品
  {
    path: '/distribution-goods-list',
    asyncComponent: () => import('./distribution-goods-list')
  },
  //佣金明细
  {
    path: '/commission-detail/:tid',
    exact: true,
    asyncComponent: () => import('./commission-detail')
  },
  //敏感词列表
  {
    path: '/sensitive-words',
    asyncComponent: () => import('./sensitive-words')
  },
  //商家评价列表
  {
    path: '/supplier-evaluate-list',
    asyncComponent: () => import('./store-evaluate-list')
  },
  //商品评价列表
  {
    path: '/goods-evaluate-list',
    asyncComponent: () => import('./goods-evaluate-list')
  },
  //积分列表
  {
    path: '/points-list',
    exact: true,
    asyncComponent: () => import('./points-list')
  },
  //积分详情
  {
    path: '/points-details/:cid',
    exact: true,
    asyncComponent: () => import('./points-detail')
  },
  //积分订单列表
  {
    path: '/points-order-list',
    exact: true,
    asyncComponent: () => import('./points-order-list')
  },
  //积分订单-详情
  {
    path: '/points-order-detail/:tid',
    exact: true,
    asyncComponent: () => import('./points-order-detail')
  },
  //拼团活动列表
  {
    path: '/groupon-activity-list',
    asyncComponent: () => import('./groupon-activity-list')
  },
  //拼团设置
  {
    path: '/groupon-setting',
    asyncComponent: () => import('./groupon-setting')
  },
  //拼团分类
  {
    path: '/groupon-cate',
    asyncComponent: () => import('./groupon-cate')
  },
  // 拼团活动详情
  {
    path: '/groupon-detail/:activityId',
    asyncComponent: () => import('./groupon-detail')
  },
  // 秒杀活动详情
  {
    path: '/flash-sale-detail/',
    asyncComponent: () => import('./flash-sale-goods-list')
  },
  //供应商商品待审核列表
  {
    path: '/goods-check-provider',
    asyncComponent: () => import('./goods-check-provider')
  },
  // 供应商商品列表
  {
    path: '/goods-list-provider',
    asyncComponent: () => import('./goods-list-provider')
  },
  // 企业会员列表
  {
    path: '/enterprise-customer-list',
    asyncComponent: () => import('./enterprise-customer-list')
  },
  //企业购商品列表
  {
    path: '/enterprise-goods-list',
    asyncComponent: () => import('./enterprise-goods-list')
  },
  // dictionary
  {
    path: '/dictionary',
    asyncComponent: () => import('./dictionary')
  },
  // dictionary-edit
  {
    path: '/dictionary-edit/:id',
    asyncComponent: () => import('./dictionary-update')
  },
  // dictionary-add
  {
    path: '/dictionary-add',
    asyncComponent: () => import('./dictionary-update')
  }
];

const homeRoutes = [
  { path: '/login', asyncComponent: () => import('./login') },
  {
    path: '/find-password',
    asyncComponent: () => import('./find-password')
  },
  {
    path: '/lackcompetence',
    asyncComponent: () => import('./lackcompetence')
  },
  {
    path: '/pay-help-doc',
    asyncComponent: () => import('./pay-help-doc')
  },
  {
    path: '/wechat-share-doc',
    asyncComponent: () => import('./wechat-share-doc')
  },
  {
    path: '/login-interface-doc',
    asyncComponent: () => import('./login-interface-doc')
  },
  //视频详情
  {
    path: '/video-detail',
    asyncComponent: () => import('./video-detail')
  },
  {
    path: '/mini-interface-doc',
    asyncComponent: () => import('./mini-interface-doc')
  },
  {
    path: '/mini-interface-doc',
    asyncComponent: () => import('./mini-interface-doc')
  }

  // //商家注册
  // {
  //   path: '/company-register',
  //   asyncComponent: () => System.import('./company-register')
  // },

  // //商家注册协议
  // {
  //   path: '/supplier-agreement',
  //   asyncComponent: () =>
  //     System.import('./company-register/component/agreement')
  // }
];

export { routes, homeRoutes };
