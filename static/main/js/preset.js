(function() {
  window.YouText = {
    SEARCH: "搜索",
    RESET: "重置",
    CREATE: "新增",
    SEARCH_HOLDER: "请输入",
    ADD_TO_LIST: "加入",
    REMOVE_FROM_LIST: "移出",
    LIST_ITEM_COUNT_P1: "共 ",
    LIST_ITEM_COUNT_P2: " 条记录",
    INPUT_PLACEHOLDER: "请输入",
    CHECK_BTN_MULTI: "(多选)",
    GRID_SEARCH_NONE: "查找不到相关记录",
    GRID_SEARCH_LOADING: "检索中，请耐心等待",
    GRID_EMPTY: "暂无数据",
    EDIT: "编辑",
    MOBILE: "手机号码",
    VISIBILITY_STATUS: "上架状态",
    VISIBILITY_TRUE: "上架",
    VISIBILITY_FALSE: "下架",
    SELECTOR_BTN_NONE: "请选择",
    POPUP_MODAL_LOADING: "加载中...",
    POPUP_MODAL_BTN_CONFIRM: "确认",
    POPUP_MODAL_BTN_CONFIRM_INPUT: "确定",
    POPUP_MODAL_BTN_CONFIRM_REMOVE: "确认删除",
    POPUP_MODAL_BTN_CANCEL: "取消",
    POPUP_MODAL_BTN_SAVE: "保存",
    POPUP_MODAL_ACTION_REMOVE: "删除",
    POPUP_MODAL_CONTENT_CONFIRM: "确定要{a} <strong>{x}</strong> 吗？",
    POPUP_MODAL_CONTENT_CONFIRM_TAG: "确定要{a}{t} <strong>{x}</strong> 吗？",
    POPUP_MODAL_CONTENT_REMOVE_DOMAIN: "确定要删除 <strong>{x}</strong> 这个域名吗？删除后将无法通过此域名进行访问。",
    POPUP_UNSAVED_TITLE: "确认离开",
    POPUP_UNSAVED_CONTENT: "当前页面还有未保存的内容，确认要离开吗？",
    POPUP_UNSAVED_CONFIRM: "不保存并离开",
    POPUP_INFO_SAVE_SUCCESS: "已保存 {x}",
    POPUP_INFO_SAVE_FAIL: "保存 {x} 失败",
    POPUP_INFO_REMOVE_SUCCESS: "已删除 {x}",
    POPUP_INFO_REMOVE_FROM_LIST: "{x} 已移出列表",
    POPUP_MODAL_ALT_SPEC: "编写简洁的文字描述图片内容：<br/>1、有利于搜索引擎优化。<br/>2、当图片加载缓慢或失败时，将显示 alt 文字，以增强用户体验。",
    TRADE: "订单",
    TRADE_NO: "订单号",
    TRADE_STATUS: "订单状态",
    TRADE_CREATED_TIME: "下单时间",
    TRADE_PAID_TIME: "付款时间",
    TRADE_TOTAL_AMOUNT: "订单总额",
    PRODUCT: "商品",
    PRODUCT_NAME: "商品名",
    PRODUCT_STOCK: "库存",
    PRODUCT_TYPE: "分类",
    PRODUCT_VENDOR: "品牌",
    CASHIER_TOTAL_AMOUNT: "收款总额",
    CASHIER_NO: "收款编号",
    CASHIER_TRADE_CODE: "支付确认码",
    CUSTOMER: "顾客",
    CUSTOMER_NAME: "顾客昵称",
    CUSTOMER_PHONE: "顾客手机号",
    CUSTOMER_AVATAR: "头像",
    CUSTOMER_LEVEL: "会员等级",
    CUSTOMER_CREATED_TIME: "注册时间",
    CUSTOMER_TRADE_COUNT: "成交单数",
    CUSTOMER_TRADE_TOTAL_AMOUNT: "消费总额",
    CUSTOMER_TRADE_AVAIL_POINT: "可用积分",
    CUSTOMER_TRADE_EXP: "经验值",
    CUSTOMER_LAST_TRADE: "最新订单",
    CUSTOMER_LAST_TRADE_DATE: "最新下单时间",
    CUSTOMER_REGIST_SOURCE: "账号类型",
    CUSTOMER_POINT: "积分",
    PAYMENT_METHOD: "收款方式",
    PAYMENT_GATEWAY: "支付方式",
    PAYMENT_STATUS: "支付状态",
    SHIPMENT: "物流",
    SHIPMENT_NAME: "物流名称",
    SHIPMENT_STATUS: "物流状态",
    SHIPMENT_SUPPLIER_OTHER: "其他物流",
    SHIPMENT_SUPPLIER_NONE: "无需物流",
    CUSTOMER_CREDITS_DISABLED: "未启用经验值关联顾客消费"
  };
  window.YouText.init = function(e) {
    if (!YouText[e]) {
      YouText[e] = !0;
      var t = YouText;
      switch (e) {
        case "product":
          t.PRODUCT_MULTI_VISIBILITY_TRUE = "已上架 {x} 个商品",
            t.PRODUCT_MULTI_VISIBILITY_FALSE = "已下架 {x} 个商品",
            t.PRODUCT_VARRIANT_DUPLICATED = "'{x}'的价格已存在",
            t.PRODUCT_VARRIANT_DUPLICATED_NORMAL = "同属性的价格已存在",
            t.PRODUCT_VARRIANT_DUPLICATED_REMOVE = "删除后会导致'{x}'的价格重复",
            t.PRODUCT_VARRIANT_DUPLICATED_REMOVE_NORMAL = "删除后会导致同属性的价格重复",
            t.PRODUCT_BATCH_SETTING_REJECT_DESC = "批量操作商品数量上限为200个，可通过添加条件筛选缩小商品数量，再进行批量操作。";
          break;
        case "payment":
          t.PAYMENT_SETTING_MODAL_TITLE = "{x}",
            t.PAYMENT_CONFIG_HOW_TO_APPLY = "如何配置？",
            t.PAYMENT_CONFIG_SAVE = "保存并进入下一步",
            t.PAYMENT_TEST_FAIL_STATE = "验证未通过",
            t.PAYMENT_TEST_FAIL_DESC = "点击“立即验证”按钮，跳转到支付页面，支付<b>" + YouPreset.$() + "0.01</b>到配置的收款账号中，系统在确认支付成功后，才可启用该收款方式。",
            t.PAYMENT_TEST_ALIPAY_FOREX_FAIL_DESC = "测试中您可能需要跳转到支付页面，支付1元钱到该收款账号中，系统会自动识别支付是否成功。测试成功后，确认填写账号可收费，才可启用该收费方式。",
            t.PAYMENT_TEST_FAIL_SELECT_BANK = "选择银行",
            t.PAYMENT_TEST_SUCCESS_STATE = "已测试收费成功",
            t.PAYMENT_TEST_SUCCESS_DESC = "测试成功！可以进入下一步启用该收费功能。",
            t.PAYMENT_TEST_GO = "立即验证",
            t.PAYMENT_TEST_BACK = "上一步",
            t.PAYMENT_TEST_NEXT = "支付完成，下一步",
            t.PAYMENT_RESET = "重新配置",
            t.PAYMENT_RESET_DESC = "注意：停用后才可重新配置，重新配置后需要重新测试。",
            t.PAYMENT_ACTIVE = "已启用",
            t.PAYMENT_INACTIVE = "已停用",
            t.PAYMENT_MAKE_ACTIVE = "启用",
            t.PAYMENT_MAKE_INACTIVE = "停用",
            t.PAYMENT_TESTYHSD_FAIL_STATE = "未验证登录",
            t.PAYMENT_TESTYHSD_FAIL_DESC = "测试中您需要跳转到支付宝登录页面验证填入的卖家支付宝账号。登录完成后，系统会自动识别是否成功。测试成功后，才可启用该收款方式。",
            t.PAYMENT_TESTYHSD_SUCCESS_STATE = "已验证登录成功",
            t.PAYMENT_TESTYHSD_SUCCESS_DESC = "验证成功！可以进入下一步启用该收费功能。",
            t.PAYMENT_TESTYHSD_GO = "立即登录",
            t.PAYMENT_TESTYHSD_NEXT = "登录成功进入下一步",
            t.PAYMENT_DESC_ALIPAY = "<div>需要网站域名通过ICP备案，且有企业支付宝账号才能配置启用</div><ul><li><i></i>货款直接进入你配置的企业支付宝账号</li><li><i></i>支付宝将收取每笔0.6%~1.2%的交易手续费</li></ul>",
            t.PAYMENT_DESC_ALIPAY_YHSD = '<div>提交实名认证后，将自动开启代收</div><ul><li><i></i>货款可在<a class="text-link" href="' + YouPreset.OFFICIAL_WEBSITE_BUY_BALANCE + '" target="_blank">账户资金</a>中查看与提现</li><li><i></i>将收取代收总额的2%用做第三方支付的交易手续费</li><li><i></i>代收款的结算周期为T+3，提现周期为1~3个工作日</li></ul>',
            t.PAYMENT_DESC_ALIPAY_WAP_USER = "<div>需要网站域名通过ICP备案，且有企业支付宝账号才能配置启用</div><ul><li><i></i>货款直接进入你配置的企业支付宝账号</li><li><i></i>支付宝将收取每笔0.6%~1.2%的交易手续费</li></ul>",
            t.PAYMENT_DESC_ALIPAY_WAP_USER_YHSD = '<div>提交实名认证后，将自动开启代收</div><ul><li><i></i>货款可在<a class="text-link" href="' + YouPreset.OFFICIAL_WEBSITE_BUY_BALANCE + '" target="_blank">账户资金</a>中查看与提现</li><li><i></i>将收取代收总额的2%用做第三方支付的交易手续费</li><li><i></i>代收款的结算周期为T+3，提现周期为1~3个工作日</li></ul>',
            t.PAYMENT_DESC_WPPAY = "<div>需要网站已绑定“认证服务号”，且已向微信申请开通“微信支付”</div><ul><li><i></i>货款直接进入你微信支付对应的微信商城平台账号</li><li><i></i>按照协议微信将收取每笔0.6%-2.0%的交易手续费，提现周期为 T+(1-7)</li></ul>",
            t.PAYMENT_DESC_WPPAY_YHSD = '<div>无需绑定微信公众号，提交实名认证后，将自动开启代收（<a class="text-link" href="' + YouPreset.DOCS_HELP_WEIXIN_NOTICE + '" target="_blank">订阅号使用须知</a>）</div><ul><li><i></i>货款可在<a class="text-link" href="' + YouPreset.OFFICIAL_WEBSITE_BUY_BALANCE + '" target="_blank">账户资金</a>中查看与提现</li><li><i></i>将收取代收总额的2%用做第三方支付的交易手续费</li><li><i></i>代收款的结算周期为T+3，提现周期为1~3个工作日</li></ul>',
            t.PAYMENT_DESC_BANKCARD_ALIPAY = "<div>需要网站域名通过ICP备案，且有企业支付宝账号才能配置启用</div><ul><li><i></i>货款直接进入你配置的企业支付宝账号</li><li><i></i>支付宝收取每笔0.6%~1.2%的交易手续费</li><li><i></i>支持18家主流银行的储蓄卡和信用卡付款</li></ul>",
            t.PAYMENT_DESC_BANKCARD_WPPAY = "<div>需要网站域名通过ICP备案，且有企业财付通账号才能配置启用</div><ul><li><i></i>货款直接进入你配置的企业财付通账号</li><li><i></i>财付通将收取每笔1%的交易手续费</li><li><i></i>支持16家主流银行的储蓄卡和信用卡付款</li></ul>",
            t.PAYMENT_DESC_BANKCARD_ALIPAY_YHSD = '<div>提交实名认证后，将自动开启代收</div><ul><li><i></i>货款可在<a class="text-link" href="' + YouPreset.OFFICIAL_WEBSITE_BUY_BALANCE + '" target="_blank">账户资金</a>中查看与提现</li><li><i></i>将收取代收总额的2%用做第三方支付的交易手续费</li><li><i></i>代收款的结算周期为T+3，提现周期为1~3个工作日</li><li><i></i>支持18家主流银行的储蓄卡和信用卡付款</li></ul>',
            t.PAYMENT_DESC_BAIFUBAO = "<div>需要网站域名通过ICP备案，且有企业百度钱包账号才能配置启用</div><ul><li><i></i>货款直接进入你配置的百度钱包账号</li><li><i></i>百度钱包将收取每笔0.6%的交易手续费</li><li><i></i>支持49家主流银行的储蓄卡和信用卡付款</li></ul>",
            t.PAYMENT_DESC_BAIFUBAO_YHSD = '<div>提交实名认证后，将自动开启代收</div><ul><li><i></i>货款可在<a class="text-link" href="' + YouPreset.OFFICIAL_WEBSITE_BUY_BALANCE + '" target="_blank">账户资金</a>中查看与提现</li><li><i></i>将收取代收总额的2%用做第三方支付的交易手续费</li><li><i></i>代收款的结算周期为T+3，提现周期为1~3个工作日</li></ul>';
          break;

        case "promotion":
          t.DISCOUNT_STATUS = [{
              value: "expired",
              text: "过期"
            }, {
              value: "actived",
              text: "进行中"
            }, {
              value: "pending",
              text: "未开始"
            }],
            t.DISCOUNT_TYPE = [{
              value: "amount_off",
              text: "满减",
              path: "promotionoff"
            }, {
              value: "percent_off",
              text: "满折",
              path: "promotiondiscount"
            }, {
              value: "free_shipping",
              text: "满免邮",
              path: "promotionfreeship"
            }, {
              value: "coupon",
              text: "满赠券",
              path: "promotioncoupon"
            }],
            t.DISCOUNT_RANGE_TYPE = [{
              value: "entire",
              text: "全场所有商品"
            }, {
              value: "partial",
              text: "部分商品"
            }],
            t.DISCOUNT_ACTIVE_TYPE = [{
              value: "entire",
              text: "全员可用"
            }, {
              value: "customer_level",
              text: "指定会员"
            }, {
              value: "partial",
              text: "指定顾客"
            }, {
              value: "first_trade",
              text: "首单顾客"
            }],
            t.DISCOUNT_SHIPMENT = [{
              value: 0,
              text: "快递"
            }, {
              value: 1,
              text: "顺丰"
            }, {
              value: 2,
              text: "EMS"
            }, {
              value: 3,
              text: "平邮"
            }, {
              value: 4,
              text: "商家自送"
            }];
          break;
      }
    }
  }

}());

/** preset start */
(function() {
  var e = function(e, t) {
      return this > Number(e) && this < Number(t)
    },
    t = window.YouPreset = {
      LIST_PAGE_SIZE: 30,
      STAT_UPDATE_INTERVAL: 1e4,
      VALIDATIONS: {
        trim: {
          regexp: /^.*$/,
          text: ""
        },
        required: {
          regexp: /^.+$/,
          defaultText: "不能为空"
        },
        requiredHtml: {
          regexp: /[\r\n\s]*.+[\r\n\s]*/,
          text: "不能为空"
        },
        number: {
          regexp: /^(\d*\.)?\d+$/,
          text: "请输入数值"
        },
        allNumber: {
          regexp: /^-?(\d*\.)?\d+$/,
          text: "请输入数值"
        },
        noZero: {
          regexp: /[^0\.]+/,
          text: "不能为零"
        },
        nonNegativeNumber: {
          regexp: /^(([0-9]+[\.]?[0-9]+)|[0-9])$/,
          text: "请输入大于等于0的数值"
        },
        positiveNumber: {
          regexp: /^(([0-9]+[\.]?[0-9]+)|[1-9])$/,
          text: "请输入大于0的数值"
        },
        percentNumber: {
          regexp: /^(\d{1,2}|100)$/,
          text: "只能输入大于等于0小于等于100的整数"
        },
        oneToAHundred: {
          regexp: /^(\d{2}|[1-9]|100)$/,
          text: "只能输入大于0小于等于100的整数"
        },
        zeroToNinetyNine: {
          regexp: /^(\d{1,2})$/,
          text: "只能输入大于等于0小于100的整数"
        },
        oneToNinetyNine: {
          regexp: /^(\d{2}|[1-9])$/,
          text: "只能输入大于0小于100的整数"
        },
        positiveInteger: {
          regexp: /^(\d{2,}|[1-9])$/,
          text: "请输入大于0的整数"
        },
        integer: {
          regexp: /^\d+$/,
          text: "请输入大于等于0的整数"
        },
        length: {
          regexp: "^.{{x},{y}}$",
          text: "请输入{x}-{y}个字符"
        },
        minlength: {
          regexp: "^.{{x},}$",
          text: "最少{x}个字符"
        },
        maxlength: {
          regexp: "^.{0,{x}}$",
          text: "最多{x}个字符"
        },
        maxlengthSpecial: {
          regexp: "^[\\s\\S]{0,{x}}$",
          text: "最多{x}个字符"
        },
        urisnippet: {
          regexp: /^[a-zA-z0-9_-]+$/,
          text: "只允许字母、数字、下划线和中横线"
        },
        email: {
          regexp: /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/,
          text: "邮箱格式不正确"
        },
        float2: {
          regexp: /^\d+(\.\d{0,2})?$/,
          text: "小数点后只能保留两位数"
        },
        floatNoZero: {
          regexp: /[^0\.]+/,
          text: "请输入大于0的数值"
        },
        maxNumber: {
          regexp: /^\d(\d{1,6})?(\.\d{1,2})?$/,
          text: "请输入小于10000000(1千万)的数值"
        },
        maxTotal: {
          regexp: /^\d(\d{1,12})?(\.\d{1,2})?$/,
          text: "数值过大，请修正"
        },
        mobile: {
          regexp: /^(13|14|15|17|18)\d{9}$/,
          text: "手机号码格式不正确"
        },
        zipcode: {
          regexp: /^[0-9]{0,10}$/,
          text: "请输入正确邮编"
        },
        phone: {
          regexp: /(^\+*(\d+(-|\s)*\d)*$)|(^\d{11}$)/i,
          text: "请正确填写联系电话"
        },
        shipmentNameCheck: {
          regexp: /^[A-Za-z0-9\-\u4e00-\u9fa5_]*$/,
          text: "只可以使用中文、字母、数字、中横线、下划线。"
        },
        shopPassword: {
          regexp: /^.{4,40}$/,
          text: "网站访问密码需要4~40个字符"
        },
        discount: {
          regexp: /^([1-9](\.\d)?|0\.\d)$/,
          text: "请输入有效的折扣，如9.5"
        },
        url: {
          regexp: /^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=#\(\)]*)?$/,
          text: "请输入正确的网址"
        },
        couponCode: {
          regexp: /^[A-Za-z0-9]*$/,
          text: "只可以使用英文字母或数字"
        },
        range: {
          expectTrue: e,
          defaultText: "必须大于{x}小于{y}"
        }
      },
      AREA_SELECTOR: ["选择省份或直辖市", "选择城市", "选择县区"],
      VISIBILITY: [{
        value: !0,
        text: "是"
      }, {
        value: !1,
        text: "否"
      }],
      USED: [{
        value: !0,
        text: "已使用"
      }, {
        value: !1,
        text: "未使用"
      }],

    };
  t.AUTO_RECEIVED_DAY = 14,

    t.CURRENCY = [ {
      ISO: "CNY",
      text: "人民币",
      symbol: "￥"
    }],

    t.CURRENCY = [{
      ISO: "CNY",
      text: "人民币",
      symbol: "￥"
    }];
  t.SHOP_OWNER = window.YoudianConf.isOwner,
    t.$ = function() {
      return (_.find(t.CURRENCY, {
        ISO: YoudianConf.currency
      }) || _.find(t.CURRENCY, {
        ISO: "CNY"
      })).symbol
    }


  t.TRADE_PAYMENT_TYPE = {
      offline: "货到付款",
      wppay: "微信支付",
      wppay_app: "微信支付（App支付）"
    };

  window.YouPreset.init = function(e) {
    if (!YouPreset[e]) {
      YouPreset[e] = !0;
      var t = YouPreset;
      switch (e) {
        case "coupon":
          t.COUPON_STATUS = [{
              value: "unactived",
              text: "未开始"
            }, {
              value: "actived",
              text: "进行中"
            }, {
              value: "expired",
              text: "已结束"
            }], t.COUPON_USE_STATUS = [{
              value: "pending",
              text: "未使用"
            }, {
              value: "used",
              text: "已使用"
            }],
            t.COUPON_TYPES = [{
              value: "normal",
              text: "普通券"
            }, {
              value: "single",
              text: "复用券"
            }];
          break;
        case "shipment":
          t.SHIPMENT_SUPPLIER_OTHER_VALUE = 0,
            t.SHIPMENT_SUPPLIER_NONE_VALUE = 1,
            t.SHIPMENT_SUPPLIER_SP = [{
              value: t.SHIPMENT_SUPPLIER_OTHER_VALUE,
              text: YouText.SHIPMENT_SUPPLIER_OTHER
            }, {
              value: t.SHIPMENT_SUPPLIER_NONE_VALUE,
              text: YouText.SHIPMENT_SUPPLIER_NONE
            }],
            t.SHIPMENT_TEMPLATE_CALCULATE = [{
              value: 0,
              text: "重量",
              unit: "kg",
              desc: "重"
            }, {
              value: 1,
              text: "体积",
              unit: "m³",
              desc: "体积"
            }, {
              value: 2,
              text: "件数",
              unit: "件",
              desc: "件"
            }],
            t.SHIPMENT_TEMPLATE_RULE = [{
              value: 0,
              text: "快递"
            }, {
              value: 1,
              text: "顺丰"
            }, {
              value: 2,
              text: "EMS"
            }, {
              value: 3,
              text: "平邮"
            }, {
              value: 4,
              text: "商家自送"
            }, {
              value: 5,
              text: "自提"
            }], 
            t.SHIPMENT_TEMPLATE_RULE_OFFLINE = [{
              value: 0,
              text: "快递"
            }, {
              value: 1,
              text: "顺丰"
            }, {
              value: 2,
              text: "EMS"
            }, {
              value: 4,
              text: "商家自送"
            }, {
              value: 5,
              text: "自提"
            }];
          break;
        case "promotion":
          t.DISCOUNT_STATUS = [{
              value: "expired",
              text: "过期"
            }, {
              value: "actived",
              text: "进行中"
            }, {
              value: "pending",
              text: "未开始"
            }], 
            t.DISCOUNT_TYPE = [{
              value: "amount_off",
              text: "满减",
              path: "promotionoff"
            }, {
              value: "percent_off",
              text: "满折",
              path: "promotiondiscount"
            }, {
              value: "free_shipping",
              text: "满免邮",
              path: "promotionfreeship"
            }, {
              value: "coupon",
              text: "满赠券",
              path: "promotioncoupon"
            }], t.DISCOUNT_RANGE_TYPE = [{
              value: "entire",
              text: "全场所有商品"
            }, {
              value: "partial",
              text: "部分商品"
            }], t.DISCOUNT_ACTIVE_TYPE = [{
              value: "entire",
              text: "全员可用"
            }, {
              value: "customer_level",
              text: "指定会员"
            }, {
              value: "partial",
              text: "指定顾客"
            }, {
              value: "first_trade",
              text: "首单顾客"
            }],
            t.DISCOUNT_SHIPMENT = [{
              value: 0,
              text: "快递"
            }, {
              value: 1,
              text: "顺丰"
            }, {
              value: 2,
              text: "EMS"
            }, {
              value: 3,
              text: "平邮"
            }, {
              value: 4,
              text: "商家自送"
            }];
          break;

        case "product":
          t.PRODUCT_ORDER = [{
            value: "name",
            text: "名称 ↑",
            order: "asc"
          }, {
            value: "name",
            text: "名称 ↓",
            order: "desc"
          }, {
            value: "vendors",
            text: "品牌 ↑",
            order: "asc"
          }, {
            value: "vendors",
            text: "品牌 ↓",
            order: "desc"
          }, {
            value: "price_min",
            text: "价格 ↑",
            order: "asc"
          }, {
            value: "price_min",
            text: "价格 ↓",
            order: "desc"
          }, {
            value: "types",
            text: "分类 ↑",
            order: "asc"
          }, {
            value: "types",
            text: "分类 ↓",
            order: "desc"
          }];
          break;
          
        case "customer":
          t.CUSTOMER_REGIST_SOURCE = [{
            value: 6,
            text: "微信"
          }];
          break;

        case "order":
          t.ORDER_DEVICE = [{
              value: "mobile",
              text: "手机"
            }, {
              value: "tablet",
              text: "平板"
            }, {
              value: "pc",
              text: "电脑"
            }],
            t.ORDER_STATUS = [{
              value: "0_0",
              text: "未付款"
            }, {
              value: "0_1",
              text: "已付款"
            }, {
              value: 3,
              text: "退单申请"
            }, {
              value: 4,
              text: "退单完成"
            }, {
              value: 2,
              text: "交易成功"
            }, {
              value: 1,
              text: "无效"
            }],
            t.PAYMENT_STATUS = [{
              value: "0",
              text: "未付款"
            }, {
              value: "2",
              text: "付款成功"
            }, {
              value: "3",
              text: "付款超时"
            }],
            t.SHIPMENT_STATUS = [{
              value: "0",
              text: "未发货"
            }, {
              value: "3",
              text: "部分发货"
            }, {
              value: "1",
              text: "已发货"
            }, {
              value: "2",
              text: "已签收"
            }],
            t.UNAVAIL_REASON = [{
              value: "price_change",
              text: "订单改价"
            }, {
              value: "payment_method_change",
              text: "更改支付方式"
            }, {
              value: "admin_change",
              text: "更改支付信息"
            }],
            t.ORDER_HEADER_TABS = [{
              text: "近三个月",
              value: 1
            }, {
              text: "待付款",
              value: 2
            }, {
              text: "待发货",
              value: 3
            }, {
              text: "已发货",
              value: 4
            }, {
              text: "退单申请",
              value: 5
            }, {
              text: "交易成功",
              value: 6
            }, {
              text: "三个月前",
              value: 8
            }, {
              isSep: !0
            }, {
              text: "高级搜索",
              value: 100,
              isSearch: !0
            }],
            t.REFUND_STATUS_TEXT = [{
              value: "pending",
              text: "退款中"
            }, {
              value: "success",
              text: "退款成功"
            }, {
              value: "fail",
              text: "退款失败"
            }, {
              value: "expired",
              text: "退款超时"
            }], 
            t.REFUNDABLE_GATEWAYS = [{
              value: "alipay",
              collect_by_yhsd: !0
            }, {
              value: "alipay",
              collect_by_yhsd: !1
            }, {
              value: "wppay",
              collect_by_yhsd: !0
            }, {
              value: "wppay",
              collect_by_yhsd: !1
            }, {
              value: "wppay_app",
              collect_by_yhsd: !1
            }],
            t.GATEWAY_STATUS = [{
              value: "alipay",
              text: "支付宝"
            }, {
              value: "wppay",
              text: "微信支付"
            }, {
              value: "offline",
              text: "货到付款"
            }],
            t.REFUND_MONEY_POP_SPEC = [
            "退款有效期：两个月", 
            "代收退款必须保证账户资金充足", 
            "顾客将收到全额退款，第三方支付工具将不会退还商家交易手续费"];
          break;
      }
    }
  }
}());
/** preset end */
