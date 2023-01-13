/**
 * 链接的一些配置
 * TODO: 移除不必要的配置
 */

type systemType = "d2cStore" | "d2p";

export interface platformConfig { }
export interface systemConfig {
  [platform: string]: platformConfig;
}
export interface ConfigMap {
  [system: string]: systemConfig;
}

export interface MarketingTypeItem {
  name: string;
  specs: "single" | "more";
  color: string;
  icon: string;
  interfaceUrl: string; // 接口
  pageType: string; // 返回的页面类型
}

export interface ILinkEditConfig {
  linkKey: string;
  title: string;
  type: string;
  info: string;
  outputLink: string;
  [prop: string]: any;
}

export interface IPageItem {
  title: string;
  path: string;
  icon: string;
  key: string;
  type: string;
  link: string;
}
const businessCode = (window as any).businessCode;
const storeId = (window as any).storeId;
const catePath = `/store-goods-list/${storeId}`;
const cateLink = storeId
  ? '{"app":{"routeName": "StoreGoodsList", "params": {"storeCateId":"${cataId}","cateName":"${name}","storeId":"' +
  storeId +
  '"}},"wechat":{"pathname": "' +
  catePath +
  '", "params":{"search":"?cid=${cataId}&cname=${name}"}}}'
  : '{"app":{"routeName": "GoodsList", "params": {"cateId":"${cataId}","cateName":"${name}" }},"wechat":{"pathname": "/goodsList", "params":{"search":"?cid=${cataId}&cname=${name}"}}}';

export const d2cConfig = {
  pc: {
    linkEdit: storeId ? [
      //编辑数据定义接口  type : custom image link tree
      {
        linkKey: "goodsList",
        title: "商品",
        type: "imageList",
        src: "/xsite/skusForXsite",
        reqContentType: "application/json",
        reqKeyPageNum: "pageNum",
        reqKeyKeyword: "q",
        info:
          "id::skuId,name::spuName,nameWithSku::skuName,ownerId::owenId,shopName,spuId::productId,skuId,minOrderQuantity,salePoint,image::images.0,images,brandName,brandId,price,price::salePrice,stock",
        outputLink: "/goods-detail/${skuId}",
      },
      {
        linkKey: "categoryList",
        title: "类目",
        type: "treeList",
        src: "/xsite/goodsCatesForXsite",
        info:
          "id,parentId,pinYin,simplePinYin,cataId::id,name,description,depth,img,isLeaf",
        outputLink: storeId
          ? `/store-goods-list-cate/${storeId}?cid=` + "${cataId}"
          : "/goods-list?cid=${cataId}",
      },
      {
        linkKey: "pageList",
        title: "页面",
        type: "webpage",
        excludePageTypes: ["index", "goodsList", "goodsInfo"],
        info: "platForm,pageType,pageCode,title,isDoublePlatformTpl",
        src: "",
        outputLink: storeId ? "/${pageType}/${pageCode}" + `/${storeId}` : "/${pageType}/${pageCode}",
      },
      {
        linkKey: "userpageList",
        title: "常用功能",
        type: "userpage",
        info: "type,title,link,path,key",
        outputLink: "/${path}/${type}",
      },
      {
        linkKey: "custom",
        title: "自定义",
        type: "custom",
        info: "content",
        outputLink: "${content}",
        options: {
          encodeURIComponent: false,
        },
      },
    ] : [
        {
          linkKey: "storeList",
          title: "店铺",
          info:
            "storeId,storeName,supplierName,storeSign",
          type: "imageList",
          src: "/xsite/storeList",
          reqContentType: "application/json",
          reqKeyPageNum: "pageNum",
          reqKeyKeyword: "keywords",
          outputLink: "/store-main/${storeId}"
        },
        //编辑数据定义接口  type : custom image link tree
        {
          linkKey: "goodsList",
          title: "商品",
          type: "imageList",
          src: "/xsite/skusForXsite",
          reqContentType: "application/json",
          reqKeyPageNum: "pageNum",
          reqKeyKeyword: "q",
          info:
            "id::skuId,name::spuName,nameWithSku::skuName,ownerId::owenId,shopName,spuId::productId,skuId,minOrderQuantity,salePoint,image::images.0,images,brandName,brandId,price,price::salePrice,stock",
          outputLink: "/goods-detail/${skuId}",
        },
        {
          linkKey: "categoryList",
          title: "类目",
          type: "treeList",
          src: "/xsite/goodsCatesForXsite",
          info:
            "id,parentId,pinYin,simplePinYin,cataId::id,name,description,depth,img,isLeaf",
          outputLink: storeId
            ? `/store-goods-list-cate/${storeId}?cid=` + "${cataId}"
            : "/goods-list?cid=${cataId}",
        },
        {
          linkKey: "pageList",
          title: "页面",
          type: "webpage",
          excludePageTypes: ["index", "goodsList", "goodsInfo"],
          info: "platForm,pageType,pageCode,title,isDoublePlatformTpl",
          src: "",
          outputLink: storeId ? "/${pageType}/${pageCode}" + `/${storeId}` : "/${pageType}/${pageCode}",
        },
        {
          linkKey: "userpageList",
          title: "常用功能",
          type: "userpage",
          info: "type,title,link,path,key",
          outputLink: "/${path}/${type}",
        },
        {
          linkKey: "custom",
          title: "自定义",
          type: "custom",
          info: "content",
          outputLink: "${content}",
          options: {
            encodeURIComponent: false,
          },
        },
      ],
    userPageList: storeId
      ? [
        {
          title: "店铺首页",
          path: `store-main/${storeId}`,
          icon: "my-home",
          key: "storeHome",
          type: "",
          link: `/store-main/${storeId}`,
        },
        {
          title: "全部商品",
          path: `store-goods-list-cate/${storeId}`,
          icon: "all-the-goods",
          key: "storeCate",
          type: "",
          link: `/store-goods-list-cate/${storeId}`,
        },
        {
          title: "店铺档案",
          path: `store-file/${storeId}`,
          icon: "xSite-zhanghu",
          key: "storeFile",
          type: "",
          link: `/store-file/${storeId}`,
        },
        {
          title: "店铺会员",
          path: `store-member/${storeId}`,
          icon: "huiyuan",
          key: "storeMember",
          type: "",
          link: `/store-member/${storeId}`,
        },
      ]
      : [
        // 编辑链接的用户页面
        {
          title: "首页",
          path: "",
          icon: "my-home",
          key: "myHome",
          type: "",
          link: "/",
        },
        {
          title: "全部商品",
          path: "goods-list",
          icon: "all-the-goods",
          key: "allProduct",
          type: "",
          link: "/goods-list",
        },
        {
          title: "购物车",
          path: "purchase-order",
          icon: "shopping-cart",
          key: "cart",
          type: "",
          link: "/purchase-order",
        },
        {
          title: "我的订单",
          path: "order-list",
          icon: "my-order",
          key: "order",
          type: "",
          link: "/order-list",
        },
        {
          title: "我的退单",
          path: "order-refunds-list",
          icon: "my-return-order",
          key: "myReturnOrder",
          type: "",
          link: "/order-refunds-list",
        },
        {
          title: "个人中心",
          path: "user-center",
          icon: "personal-center",
          key: "UserCenter",
          type: "",
          link: "/user-center",
        },
        {
          title: "收藏商品",
          path: "user-shelf",
          icon: "my-attention",
          key: "follow",
          type: "",
          link: "/user-shelf",
        },
        {
          title: "关注店铺",
          path: "user-store",
          icon: "like-store",
          key: "likeStore",
          type: "",
          link: "/user-store",
        },
        {
          title: "招商页",
          path: "company-register",
          icon: "attract-investment",
          key: "attract",
          type: "",
          link: "/company-register",
        },
        {
          title: "领券中心",
          path: "coupon-center",
          icon: "coupon-center",
          key: "couponCenter",
          type: "",
          link: "/coupon-center",
        },
      ],
  },
  weixin: {
    linkEdit:
      businessCode == 1
        ? [
          //编辑数据定义接口  type : custom image link tree
          {
            linkKey: "goodsList",
            title: "商品",
            info:
              "id::skuId,name::spuName,nameWithSku::skuName,ownerId::owenId,shopName,spuId,pid::spuId,skuId,minOrderQuantity,image::images.0,images,brandName,brandId,price,price::salePrice,stock,salePoint::sellPoint",
            type: "imageList",
            catagory: "spuLink", //货品链接,
            src: "/xsite/skusForXsite",
            reqContentType: "application/json",
            reqKeyPageNum: "pageNum",
            reqKeyKeyword: "q",
            outputLink:
              '{"app":{"routeName": "", "params": ""},"wechat":{"pathname": "/pages/goods/detail/index?skuId=${skuId}" }}',
            goodsType: { "1": "自营", "2": "店铺" }, //商品种类 自营商品 店铺商品 0 全部
          },
          {
            linkKey: "rechargeableCardList",
            title: "充值卡",
            info:
              "rechargeableCardId,storeId,rechargeableCardName,totalPrice,price,presentPrice,validityFlag,validityDays,remark,salesVolume",
            type: "imageList",
            catagory: "spuLink", //货品链接,
            src: "/xsite/rechargeable-card-page",
            reqContentType: "application/json",
            reqKeyPageNum: "pageNum",
            reqKeyKeyword: "rechargeableCardName",
            outputLink:
              '{"app":{"routeName": "", "params": ""},"wechat":{"pathname": "/pages/packageA/pages/rechargeCard/info/index?rechargeableCardId=${rechargeableCardId}" }}',
          },
          {
            linkKey: "timingCardList",
            title: "计次卡",
            info:
              "timingCardId,storeId,timingCardName,price,validityFlag,validityDays,remark,salesVolume",
            type: "imageList",
            catagory: "spuLink", //货品链接,
            src: "/xsite/timing-card-page",
            reqContentType: "application/json",
            reqKeyPageNum: "pageNum",
            reqKeyKeyword: "timingCardName",
            outputLink:
              '{"app":{"routeName": "", "params": ""},"wechat":{"pathname": "/pages/packageA/pages/timingCard/info/index?timingCardId=${timingCardId}" }}',
          },
          {
            linkKey: "projectList",
            title: "服务",
            info: "projectId,minPrice,maxPrice,projectName,projectImg",
            type: "imageList",
            catagory: "spuLink", //货品链接,
            src: "/xsite/project-page",
            reqContentType: "application/json",
            reqKeyPageNum: "pageNum",
            reqKeyKeyword: "projectName",
            outputLink:
              '{"app":{"routeName": "", "params": ""},"wechat":{"pathname": "/pages/goods/projectInfo/index?projectId=${projectId}" }}',
          },
          // {
          //   linkKey: "projectCategoryList",
          //   title: "服务分类",
          //   info: "projectCateId,projectCateName",
          //   type: "imageList",
          //   catagory: "spuLink", //货品链接,
          //   src: "/xsite/simple-project-cate",
          //   reqContentType: "application/json",
          //   reqKeyPageNum: "pageNum",
          //   reqKeyKeyword: "projectCateName",
          //   outputLink:
          //     '{"app":{"routeName": "", "params": ""},"wechat":{"pathname": "/pages/goods/list/index?type=2&cate=${projectCateId}" }}',
          // },
          {
            linkKey: "pageList",
            title: "页面",
            type: "webpage",
            excludePageTypes: ["index", "goodsList", "goodsInfo", "roulette"],
            info: "platForm,pageType,pageCode,title,isDoublePlatformTpl",
            src: "",
            outputLink:
              '{"app":{"routeName": "PageLink", "params":{"pageType": "${pageType}","pageCode": "${pageCode}"}},"wechat":{"pathname": "/pages/xsite/pagelink/index?pageType=${pageType}&pageCode=${pageCode}"}}',
          },
          /*{
      linkKey: "marketingList",
      title: "营销",
      type: "marketing",
      info: "platForm,pageType,pageCode,title,isDoublePlatformTpl",
      src: "",
      outputLink: "#/${pageType}/${pageCode}",
    },*/
          {
            linkKey: "userpageList",
            title: "常用功能",
            type: "userpage",
            info: "type,title,link,appPath,wechatPath,key",
            outputLink:
              '{"app":{"routeName": "${appPath}"},"wechat":{"pathname": "${wechatPath}"}}',
          },
          /*ios webview跳转自定义链接会报错,暂时注释{
      linkKey: "custom",
      title: "自定义",
      type: "custom",
      info: "content",
      outputLink:
        '{"app":{"routeName": "CustomLink", "params":{"url": "${content}"}},"wechat":{"isHref":true,"pathname": "${content}"}}',
      options: {
        encodeURIComponent: false,
      },
    },*/
        ]
        : storeId ? [
          //编辑数据定义接口  type : custom image link tree
          {
            linkKey: "goodsList",
            title: "商品",
            info:
              "id::skuId,name::spuName,nameWithSku::skuName,ownerId::owenId,shopName,spuId,pid::spuId,skuId,minOrderQuantity,image::images.0,images,brandName,brandId,price,price::salePrice,stock,salePoint::sellPoint",
            type: "imageList",
            catagory: "spuLink", //货品链接,
            src: "/xsite/skusForXsite",
            reqContentType: "application/json",
            reqKeyPageNum: "pageNum",
            reqKeyKeyword: "q",
            outputLink:
              '{"app":{"routeName": "GoodsDetail", "params": {"skuId":"${skuId}" }},"wechat":{"pathname": "/goods-detail/${skuId}" }}',
            goodsType: { "1": "自营", "2": "店铺" }, //商品种类 自营商品 店铺商品 0 全部
          },
          {
            linkKey: "categoryList",
            title: "类目",
            info: "id,cataId::id,parentId,name,description,depth,img,isLeaf",
            type: "treeList",
            catagory: "displayCataLink", //展示类目链接
            src: "/xsite/goodsCatesForXsite",
            outputLink: cateLink,
          },
          {
            linkKey: "pageList",
            title: "页面",
            type: "webpage",
            excludePageTypes: ["index", "goodsList", "goodsInfo", "roulette"],
            info: "platForm,pageType,pageCode,title,isDoublePlatformTpl",
            src: "",
            outputLink:
              storeId ? '{"app":{"routeName": "PageLink", "params":{"pageType": "${pageType}","pageCode": "${pageCode}","storeId":"' +
                storeId +
                '"}},"wechat":{"pathname": "/page/${pageType}/${pageCode}/' + storeId + '"}}' : '{"app":{"routeName": "PageLink", "params":{"pageType": "${pageType}","pageCode": "${pageCode}"}},"wechat":{"pathname": "/page/${pageType}/${pageCode}"}}',
          },
          /*{
      linkKey: "marketingList",
      title: "营销",
      type: "marketing",
      info: "platForm,pageType,pageCode,title,isDoublePlatformTpl",
      src: "",
      outputLink: "#/${pageType}/${pageCode}",
    },*/
          {
            linkKey: "userpageList",
            title: "常用功能",
            type: "userpage",
            info: "type,title,link,appPath,wechatPath,key",
            outputLink:
              '{"app":{"routeName": "${appPath}"},"wechat":{"pathname": "${wechatPath}"}}',
          },
          /*ios webview跳转自定义链接会报错,暂时注释{
      linkKey: "custom",
      title: "自定义",
      type: "custom",
      info: "content",
      outputLink:
        '{"app":{"routeName": "CustomLink", "params":{"url": "${content}"}},"wechat":{"isHref":true,"pathname": "${content}"}}',
      options: {
        encodeURIComponent: false,
      },
    },*/
        ] : [
            //编辑数据定义接口  type : custom image link tree
            {
              linkKey: "goodsList",
              title: "商品",
              info:
                "id::skuId,name::spuName,nameWithSku::skuName,ownerId::owenId,shopName,spuId,pid::spuId,skuId,minOrderQuantity,image::images.0,images,brandName,brandId,price,price::salePrice,stock,salePoint::sellPoint",
              type: "imageList",
              catagory: "spuLink", //货品链接,
              src: "/xsite/skusForXsite",
              reqContentType: "application/json",
              reqKeyPageNum: "pageNum",
              reqKeyKeyword: "q",
              outputLink:
                '{"app":{"routeName": "GoodsDetail", "params": {"skuId":"${skuId}" }},"wechat":{"pathname": "/goods-detail/${skuId}" }}',
              goodsType: { "1": "自营", "2": "店铺" }, //商品种类 自营商品 店铺商品 0 全部
            },
            {
              linkKey: "storeList",
              title: "店铺",
              info:
                "storeId,storeName,supplierName,storeSign",
              type: "imageList",
              catagory: "spuLink", //货品链接,
              src: "/xsite/storeList",
              reqContentType: "application/json",
              reqKeyPageNum: "pageNum",
              reqKeyKeyword: "keywords",
              outputLink:
                '{"app":{"routeName": "StoreMain", "params": {"storeId":"${storeId}" }},"wechat":{"pathname": "/store-main/${storeId}" }}',
            },
            {
              linkKey: "categoryList",
              title: "类目",
              info: "id,cataId::id,parentId,name,description,depth,img,isLeaf",
              type: "treeList",
              catagory: "displayCataLink", //展示类目链接
              src: "/xsite/goodsCatesForXsite",
              outputLink: cateLink,
            },
            {
              linkKey: "promotionList",
              title: "营销",
              icon: "integral",
              key: "petTimingCard",
              type: "",
              link: "/pages/packageA/pages/timingCard/list/index",
            },
            {
              linkKey: "pageList",
              title: "页面",
              type: "webpage",
              excludePageTypes: ["index", "goodsList", "goodsInfo", "roulette"],
              info: "platForm,pageType,pageCode,title,isDoublePlatformTpl",
              src: "",
              outputLink:
                storeId ? '{"app":{"routeName": "PageLink", "params":{"pageType": "${pageType}","pageCode": "${pageCode}","storeId":"' +
                  storeId +
                  '"}},"wechat":{"pathname": "/page/${pageType}/${pageCode}/' + storeId + '"}}' : '{"app":{"routeName": "PageLink", "params":{"pageType": "${pageType}","pageCode": "${pageCode}"}},"wechat":{"pathname": "/page/${pageType}/${pageCode}"}}',
            },
            {
              linkKey: "userpageList",
              title: "常用功能",
              type: "userpage",
              info: "type,title,link,appPath,wechatPath,key",
              outputLink:
                '{"app":{"routeName": "${appPath}"},"wechat":{"pathname": "${wechatPath}"}}',
            }
          ],
    userPageList: storeId
      ? businessCode == 1
        ? [
          {
            title: "首页",
            wechatPath: `/pages/index/index`,
            appPath: "/pages/index/index",
            icon: "my-home",
            key: "petHome",
            type: "",
            link: `/pages/index/index`,
          },
          {
            title: "分类",
            wechatPath: "/pages/goods/list/index",
            appPath: "/pages/goods/list/index",
            icon: "xSite-kefu",
            key: "petService",
            type: "",
            link: "/pages/goods/list/index",
          },
          {
            title: "充值卡",
            wechatPath: "/pages/packageA/pages/rechargeCard/list/index",
            appPath: "/pages/packageA/pages/rechargeCard/list/index",
            icon: "gift-card",
            key: "petRechargeCard",
            type: "",
            link: "/pages/packageA/pages/rechargeCard/list/index",
          },
          {
            title: "计次卡",
            wechatPath: "/pages/packageA/pages/timingCard/list/index",
            appPath: "/pages/packageA/pages/timingCard/list/index",
            icon: "integral",
            key: "petTimingCard",
            type: "",
            link: "/pages/packageA/pages/timingCard/list/index",
          },
          {
            title: "领券中心",
            wechatPath: "/pages/coupon/list/index",
            appPath: "/pages/coupon/list/index",
            icon: "coupon-center",
            key: "petCouponCenter",
            type: "",
            link: "/pages/coupon/list/index",
          },
          {
            title: "购物车",
            wechatPath: "/pages/goods/shopCart/index",
            appPath: "/pages/goods/shopCart/index",
            icon: "shopping-cart",
            key: "petCart",
            type: "",
            link: "/pages/goods/shopCart/index",
          },
          {
            title: "个人中心",
            wechatPath: "/pages/customer/personalCenter/index",
            appPath: "/pages/customer/personalCenter/index",
            icon: "personal-center",
            key: "petUserCenter",
            type: "",
            link: "/pages/customer/personalCenter/index",
          },
          {
            title: "我的预约",
            wechatPath: "/pages/customer/mySubscribe/index",
            appPath: "/pages/customer/mySubscribe/index",
            icon: "jihuo",
            key: "petmySubscribe",
            type: "",
            link: "/pages/customer/mySubscribe/index",
          },
          {
            title: "店铺档案",
            wechatPath: "/pages/packageA/pages/store/storeFile/index",
            appPath: "/pages/packageA/pages/store/storeFile/index",
            icon: "xSite-zhanghu",
            key: "petStoreFile",
            type: "",
            link: "/pages/packageA/pages/store/storeFile/index",
          },
          {
            title: "我的订单",
            wechatPath: "/pages/order/order-list/index",
            appPath: "/pages/order/order-list/index",
            icon: "my-order",
            key: "petOrder",
            type: "",
            link: "/pages/order/order-list/index",
          },
          {
            title: "我的优惠券",
            wechatPath: "/pages/customer/myCoupon/index",
            appPath: "/pages/customer/myCoupon/index",
            icon: "my-coupon",
            key: "petMyCoupon",
            type: "",
            link: "/pages/customer/myCoupon/index",
          },
          {
            title: "添加宠物",
            wechatPath: "/pages/order/add-pet/index",
            appPath: "/pages/order/add-pet/index",
            icon: "xSite-add",
            key: "petAdd",
            type: "",
            link: "/pages/order/add-pet/index",
          },
        ]
        : [
          {
            title: "店铺首页",
            wechatPath: `/store-main/${storeId}`,
            appPath: "StoreMain",
            icon: "my-home",
            key: "storeHome",
            type: "",
            link: `/store-main/${storeId}`,
          },
          {
            title: "全部商品",
            wechatPath: `/store-goods-list/${storeId}`,
            appPath: "StoreGoodsList",
            icon: "all-the-goods",
            key: "storeGoods",
            type: "",
            link: `/store-goods-list/${storeId}`,
          },
          {
            title: "店铺分类",
            wechatPath: `/store-goods-cates/${storeId}`,
            appPath: "StoreCateList",
            icon: "good-cate",
            key: "storeGoodsCate",
            type: "",
            link: `/store-goods-cates/${storeId}`,
          },
          {
            title: "店铺档案",
            wechatPath: `/store-profile/${storeId}`,
            appPath: "StoreFile",
            icon: "xSite-zhanghu",
            key: "storeFile",
            type: "",
            link: `/store-profile/${storeId}`,
          },
          {
            title: "店铺会员",
            wechatPath: `/member-shop/${storeId}`,
            appPath: "StoreMember",
            icon: "huiyuan",
            key: "StoreMember",
            type: "",
            link: `/member-shop/${storeId}`,
          },
          {
            title: "店铺客服",
            wechatPath: `/chose-service/${storeId}`,
            appPath: "ChoseService",
            icon: "kefu",
            key: "StoreChose",
            type: "",
            link: `/chose-service/${storeId}`,
          },
        ]
      : [
        // 编辑链接的用户页面
        {
          title: "首页",
          wechatPath: "/",
          appPath: "Main",
          icon: "my-home",
          key: "myHome",
          type: "",
          link: "/",
        },
        {
          title: "类目",
          wechatPath: "/goods-cate",
          appPath: "AllList",
          icon: "my-classification",
          key: "category",
          type: "",
          link: "/goods-cate",
        },
        {
          title: "全部商品",
          wechatPath: "/goodsList",
          appPath: "GoodsList",
          icon: "all-the-goods",
          key: "allProduct",
          type: "",
          link: "/goodsList",
        },
        {
          title: "购物车",
          wechatPath: "/purchase-order",
          appPath: "PurchaseOrder",
          icon: "shopping-cart",
          key: "cart",
          type: "",
          link: "/purchase-order",
        },
        {
          title: "我的订单",
          wechatPath: "/order-list",
          appPath: "OrderList",
          icon: "my-order",
          key: "order",
          type: "",
          link: "/order-list",
        },
        {
          title: "我的退单",
          wechatPath: "/refund-list",
          appPath: "RefundList",
          icon: "my-return-order",
          key: "myReturnOrder",
          type: "",
          link: "/refund-list",
        },
        {
          title: "个人中心",
          wechatPath: "/user-center",
          appPath: "UserCenter",
          icon: "personal-center",
          key: "UserCenter",
          type: "",
          link: "/user-center",
        },
        {
          title: "收藏商品",
          wechatPath: "/user-collection",
          appPath: "UserStore",
          icon: "my-attention",
          key: "follow",
          type: "",
          link: "/user-collection",
        },
        {
          title: "关注店铺",
          wechatPath: "/store-attention",
          appPath: "StoreAttention",
          icon: "like-store",
          key: "likeStore",
          type: "",
          link: "/store-attention",
        },
        {
          title: "领券中心",
          wechatPath: "/coupon-center",
          appPath: "CouponCenter",
          icon: "coupon-center",
          key: "couponCenter",
          type: "",
          link: "/coupon-center",
        },
        {
          title: "拼团频道",
          wechatPath: "/groupon-center",
          appPath: "GrouponCenter",
          icon: "group",
          key: "grouponCenter",
          type: "",
          link: "/groupon-center",
        },
        {
          title: "秒杀频道",
          wechatPath: "/flash-sale",
          appPath: "FlashSale",
          icon: "xSite-gouwudai",
          key: "xSiteGouWuDai",
          type: "",
          link: "/flash-sale",
        },
        {
          title: "积分商城",
          wechatPath: "/points-mall",
          appPath: "PointsMall",
          icon: "integral",
          key: "integral-mall",
          type: "",
          link: "/points-mall",
        },
        {
          title: "会员中心",
          wechatPath: "/member-center",
          appPath: "MemberCenter",
          icon: "huiyuan",
          key: "member-center",
          type: "",
          link: "/member-center",
        },
        {
          title: "平台客服",
          wechatPath: "/chose-service/0",
          appPath: "ChoseService",
          icon: "kefu",
          key: "chose-service",
          type: "",
          link: "/chose-service/0",
        },
      ],
    marketingType: [
      {
        name: "推广达人",
        specs: "more",
        color: "#00C284",
        icon: "salesman",
        interfaceUrl: "SALESMAN",
        pageType: "salesman",
      },
      {
        name: "多人拼团",
        specs: "single",
        color: "#00C284",
        icon: "group",
        pageType: "group-buy-center",
      },
      {
        name: "领券中心",
        specs: "single",
        color: "#FF675B",
        icon: "coupon-redemption",
        pageType: "getcoupon",
      },
      {
        name: "限时折扣",
        specs: "more",
        color: "#FF675B",
        icon: "clock",
        interfaceUrl: "TIME_LIMITED_DISCOUNT",
        pageType: "time-sale-center",
      },
      {
        name: "积分商城",
        specs: "single",
        color: "#9387DA",
        icon: "lock",
        pageType: "integral-goods",
      },
      {
        name: "礼品卡专区",
        specs: "single",
        color: "#9387DA",
        icon: "gift-card",
        pageType: "gift-card-center",
      },
      {
        name: "幸运大转盘",
        specs: "more",
        color: "#FFA700",
        icon: "wheel",
        interfaceUrl: "WHEEL",
        pageType: "roulette",
      },
      {
        name: "欢乐砸金蛋",
        specs: "more",
        color: "#FFA700",
        icon: "egg",
        interfaceUrl: "GOLDEN_EGGS",
        pageType: "hit-egg",
      },
    ],
  },
  pad: {
    linkEdit: [
      //编辑数据定义接口  type : custom image link tree
      {
        linkKey: "goodsList",
        title: "商品",
        info:
          "id::skuId,name::spuName,nameWithSku::skuName,ownerId::owenId,shopName,spuId,pid::spuId,skuId,minOrderQuantity,salePoint::sellPoint,image::images.0,images,brandName,brandId,price,price::salePrice,stock",
        type: "imageList",
        catagory: "spuLink", //货品链接,
        src: "/xsite/skusForXsite",
        reqContentType: "application/json",
        reqKeyPageNum: "pageNum",
        reqKeyKeyword: "q",
        outputLink: "#/goodsDetail/${skuId}&&${spuId}",
        goodsType: { "1": "自营", "2": "店铺" }, //商品种类 自营商品 店铺商品 0 全部
      },
      {
        linkKey: "categoryList",
        title: "类目",
        info: "id,cataId::id,parentId,name,description,depth,img,isLeaf",
        type: "treeList",
        catagory: "displayCataLink", //展示类目链接
        src: "/xsite/goodsCatesForXsite",
        outputLink: "#/goods/${cataId}/attrValue/",
      },
      {
        linkKey: "pageList",
        title: "页面",
        type: "webpage",
        excludePageTypes: ["index"],
        info: "platForm,pageType,pageCode,title,isDoublePlatformTpl",
        src: "",
        outputLink: "#/${pageType}/${pageCode}",
      },
      {
        linkKey: "userpageList",
        title: "常用功能",
        type: "userpage",
        info: "type,title,link,path,key",
        outputLink: "#/${path}/${type}",
      },
      {
        linkKey: "custom",
        title: "自定义",
        type: "custom",
        info: "content",
        outputLink: "${content}",
        options: {
          encodeURIComponent: false,
        },
      },
    ],
    userPageList: [
      {
        //用户页面
        title: "领券中心",
        path: "getcoupon",
        icon: "coupon-redemption",
        key: "coupon",
        type: "",
        link: "/coupon",
      },
    ],
  },
};

export const d2pConfig = {
  pc: {
    linkEdit: [
      // 编辑数据定义接口  type : custom image link tree
      {
        linkKey: "goodsList",
        title: "商品",
        info:
          "id::skuId,name::title,nameWithSku::title,productName,specName,spuId,skuId,minOrderQuantity,salePoint,sellPoint::salePoint,image::images.0,brandName::brand,brandId::brandId,price::salePrice,ownerId",
        type: "imageList",
        catagory: "spuLink", //货品链接,
        reqKeyPageNum: "pageNo",
        reqKeyKeyword: "keyword",
        src: "/sites/x-site/goods_list",
        outputLink: "#/goods-detail/${spuId}?skuId=${skuId}",
      },
      {
        linkKey: "categoryList",
        title: "类目",
        info:
          "id,parentId,pinYin,simplePinYin,cataId::id,name,description,depth,img,path,pathName,isLeaf",
        type: "treeList",
        catagory: "displayCataLink", //展示类目链接
        src: "/sites/x-site/categories",
        options: {
          encodeURIComponent: true,
        },
        outputLink: "#/goods-list?catName=${pathName}",
      },
      // {
      //   linkKey: "articlesList",
      //   title: "文章",
      //   type: "articles",
      //   info: "id,articlesId::id,author,title,typeId,typeName",
      //   src: "/sites/x-site/article_list",
      //   outputLink: "#/article-detail?id=${articlesId}",
      // },
      {
        linkKey: "pageList",
        title: "页面",
        type: "webpage",
        excludePageTypes: ["index"],
        info: "platform,pageType,pageCode,title",
        src: "",
        outputLink: "#/${pageType}/${pageCode}",
      },
      {
        linkKey: "userpageList",
        title: "常用功能",
        type: "userpage",
        info: "type,title,link,path,key",
        outputLink: "#/${path}/${type}",
      },
      {
        title: "自定义",
        type: "custom",
        linkKey: "custom",
        info: "content",
        outputLink: "${content}",
        options: {
          encodeURIComponent: false,
        },
      },
    ],

    userPageList: [
      {
        title: "首页",
        path: "",
        icon: "my-home",
        key: "home",
        type: "",
        link: "#/",
      },
      {
        title: "所有商品",
        path: "goods-list",
        icon: "my-classification",
        key: "goods-all",
        type: "",
        link: "#/goods-list",
      },
      {
        title: "个人中心",
        path: "user",
        icon: "personal-center",
        key: "user",
        type: "",
        link: "#/user",
      },
      {
        title: "购物车",
        path: "shopping-cart",
        icon: "shopping-cart",
        key: "cart",
        type: "",
        link: "#/shopping-cart",
      },
      {
        title: "我的订单",
        path: "order-list",
        icon: "my-order",
        key: "order-list",
        type: "",
        link: "#/order-list",
      },
      {
        title: "我的优惠券",
        path: "user-coupon",
        icon: "my-coupon",
        key: "center-coupon",
        type: "",
        link: "#/user-coupon",
      },
      {
        title: "我的积分",
        path: "user-integral",
        icon: "my-points",
        key: "integral",
        type: "",
        link: "#/user-integral",
      },
      {
        title: "我的额度",
        path: "user-limit",
        icon: "remaining-money",
        key: "limit",
        type: "",
        link: "#/user-limit",
      },
      {
        title: "我的预存款",
        path: "user-balance",
        icon: "remaining-money",
        key: "balance",
        type: "",
        link: "#/user-balance",
      },
      {
        title: "收藏商品",
        path: "goods-favorite",
        icon: "my-attention",
        key: "favorite",
        type: "",
        link: "#/goods-favorite",
      },
    ],
  },
  weixin: {
    linkEdit: [
      //编辑数据定义接口  type : custom image link tree
      {
        linkKey: "goodsList",
        title: "商品",
        info:
          "id::skuId,name::productName,nameWithSku::title,productName,specName,spuId,pid::spuId,skuId,minOrderQuantity,salePoint,image::images.0,brandName::brand,brandId::brandId,price::salePrice,ownerId,salePoint",
        type: "imageList",
        catagory: "spuLink", //货品链接,
        src: "/sites/x-site/goods_list",
        reqKeyPageNum: "pageNo",
        reqKeyKeyword: "keyword",
        outputLink:
          "#/detail?skuId=${skuId}&spuId=${spuId}&productName=${productName}&img=${image}&mktPrice=${price}&ownerId=${ownerId}&specName=${specName}",
        options: {
          encodeURIComponent: true,
        },
      },
      {
        linkKey: "categoryList",
        title: "类目",
        info:
          "id,parentId,pinYin,simplePinYin,cataId::id,name,description,depth,img,path,pathName,isLeaf",
        type: "treeList",
        catagory: "displayCataLink", //展示类目链接
        src: "/sites/x-site/categories",
        options: {
          encodeURIComponent: true,
        },
        outputLink: "#/search?cats=${pathName}",
      },
      // {
      //   linkKey: "articlesList",
      //   title: "文章",
      //   type: "articles",
      //   info: "id,articlesId::id,author,title,typeId,typeName",
      //   src: "/sites/x-site/article_list",
      //   outputLink: "#/notice-detail?id=${articlesId}",
      // },
      {
        linkKey: "pageList",
        title: "页面",
        type: "webpage",
        excludePageTypes: ["index"],
        info: "platform,pageType,pageCode,title",
        src: "",
        outputLink: "#/${pageType}/${pageCode}",
      },
      {
        linkKey: "userpageList",
        title: "常用功能",
        type: "userpage",
        info: "type,title,link,path,key",
        outputLink: "#/${path}/${type}",
      },
      {
        linkKey: "custom",
        title: "自定义",
        type: "custom",
        info: "content",
        outputLink: "${content}",
        options: {
          encodeURIComponent: false,
        },
      },
    ],
    userPageList: [
      {
        title: "首页",
        path: "/",
        icon: "my-home",
        key: "home",
        type: "",
        link: "#/",
      },
      {
        title: "类目",
        path: "category",
        icon: "my-classification",
        key: "goods-all",
        type: "",
        link: "#/category",
      },
      {
        title: "个人中心",
        path: "user",
        icon: "personal-center",
        key: "user",
        type: "",
        link: "#/user",
      },
      {
        title: "购物车",
        path: "cart",
        icon: "shopping-cart",
        key: "cart",
        type: "",
        link: "#/cart",
      },
      {
        title: "我的订单",
        path: "order-list",
        icon: "my-order",
        key: "order-list",
        type: "",
        link: "#/order-list",
      },
      {
        title: "收藏商品",
        path: "userShelfList",
        icon: "my-attention",
        key: "favorite",
        type: "",
        link: "#/userShelfList",
      },
      {
        title: "账户安全",
        path: "user-security",
        icon: "suoding",
        key: "security",
        type: "",
        link: "#/user-security",
      },
    ],
  },

  app: {
    linkEdit: [
      //编辑数据定义接口  type : custom image link tree
      {
        linkKey: "goodsList",
        title: "商品",
        info:
          "id::skuId,name::productName,nameWithSku::title,productName,specName,spuId,pid::spuId,skuId,minOrderQuantity,salePoint,image::images.0,brandName::brand,brandId::brandId,price::salePrice,ownerId,salePoint::subTitle",
        type: "imageList",
        catagory: "spuLink", //货品链接,
        src: "/sites/x-site/goods_list",
        reqKeyPageNum: "pageNo",
        reqKeyKeyword: "keyword",
        outputType: "JSON",
        outputLink:
          'linkKey:"goodsList","type":"1","skuId":"${skuId}","fromOwner":"${fromOwner}","spuId":"${spuId}","name":"${productName}","img":"${image}","mktPrice":"${price}","ownerId":"${ownerId}","specName":"${specName}"',
        options: {
          encodeURIComponent: true,
        },
      },
      {
        linkKey: "categoryList",
        title: "类目",
        info:
          "id,parentId,pinYin,simplePinYin,cataId::id,name,description,depth,img,path,pathName,isLeaf",
        type: "treeList",
        catagory: "displayCataLink", //展示类目链接
        src: "/sites/x-site/categories",
        reqKeyPageNum: "pageNo",
        reqKeyKeyword: "keyword",
        outputType: "JSON",
        outputLink: 'linkKey:"categoryList","type":"2","name":"${pathName}"',
      },

      {
        linkKey: "articlesList",
        title: "文章",
        type: "articles",
        info:
          "id,articlesId::id,author,title,typeId,typeName,content,createdAT",
        src: "/sites/x-site/article_list",
        outputType: "JSON",
        outputLink:
          'linkKey:"articlesList","type":"3","id":"${articlesId}","title":"${title}","date":"${createdAT}"',
      },
    ],
  },
};

export const linkConfigList = {
  d2cStore: d2cConfig,
  d2p: d2pConfig,
};

// 获取链接相关配置
const getLinkConfig = ({
  systemCode,
  platform,
}): {
    linkEdit: ILinkEditConfig[];
    userPageList?: IPageItem[];
    marketingType?: MarketingTypeItem[];
  } => {
  try {
    return linkConfigList[systemCode][platform] || { linkEdit: [] };
  } catch (error) {
    console.warn("systemCode,platform下无配置.请重新配置！！！");
    return { linkEdit: [] };
  }
};

export default getLinkConfig;
