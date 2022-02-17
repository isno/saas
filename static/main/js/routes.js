(function(){
    var routes = {
        m_notinplan: {
            url: "/notinplan",
            templateUrl: "not_in_plan.htm",
            controller: "NotInPlanController"
        },
        m_nopermission: {
            url: "/nopermission",
            templateUrl: "no_permission.htm",
            controller: "NoPermissionController"
        },
        m_notowner: {
            url: "/notowner",
            templateUrl: "not_owner.htm",
            controller: "NotOwnerController"
        },

        m_promotion: {
            url: "/promotion",
            templateUrl: "promotion.htm",
            controller: "PromotionController",
            mode: "promotion"
        },
        m_membership: {
            url:"/membership",
            templateUrl:"membership.htm",
            controller:"MembershipController"
        },

        m_payment: {
            url: "/payment",
            templateUrl: "payment.htm",
            controller: "PaymentController",
            mode: "payment"
        },
        m_promotionoff: {
            url: "/promotionoff?id",
            templateUrl: "promotionoff.htm",
            controller: "PromotionOffController",
            module: "m_promotion",
            mode: "promotion_edit_off"
        },
        m_promotiondiscount: {
            url: "/promotiondiscount?id",
            templateUrl: "promotiondiscount.htm",
            controller: "PromotionDiscountController",
            module: "m_promotion",
            mode: "promotion_edit_discount"
        },
        m_promotionfreeship: {
            url: "/promotionfreeship?id",
            templateUrl: "promotionfreeship.htm",
            controller: "PromotionFreeshipController",
            module: "m_promotion",
            mode: "promotion_edit_freeship"
        },
        m_promotioncoupon: {
            url: "/promotioncoupon?id",
            templateUrl: "promotioncoupon.htm",
            controller: "PromotionCouponController",
            module: "m_promotion",
            mode: "promotion_edit_coupon"
        },

        m_coupon: {
            url: "/coupon",
            templateUrl: "coupon.htm",
            controller: "CouponController",
            mode: "coupon"
        },
        m_couponedit: {
            url: "/couponedit?id",
            templateUrl: "couponedit.htm",
            controller: "CouponEditController",
            module: "m_coupon",
            mode: "coupon_edit_normal"
        },
        m_couponsingleedit: {
            url: "/couponsingleedit?id",
            templateUrl: "couponsingleedit.htm",
            controller: "CouponSingleEditController",
            module: "m_coupon",
            mode: "coupon_edit_single"
        },

        m_orderedit: {
            url: "/orderedit?id",
            templateUrl: "order_edit.htm",
            controller: "OrderEditController",
            module: "m_order",
        },

        m_setting:{
            url:"/setting",
            templateUrl:"setting.htm",
            controller: "SettingController"
        },

        m_shipment:{
            url:"/shipment",
            templateUrl:"shipment.htm",
            controller: "ShipmentController"
        },
        m_store: {
            url: "/store",
            templateUrl: "store.htm",
            controller: "StoreController"
        },
        m_storeedit: {
            url: "/storeedit",
            templateUrl: "store_edit.htm",
            controller: "StoreEditController",
            module: "m_store",
        },
        m_page404: {
            url: "/404",
            templateUrl: "404.htm",
            controller: "Page404Controller"
        },
        m_shipmentedit: {
            url: "/shipmentedit",
            templateUrl: "shipment_edit.htm",
            controller: "ShipmentEditController",
            module: "m_shipment",
        },

        m_product:{
            url:"/product",
            templateUrl:"product.htm",
            controller: "ProductController"
        },
        m_customer:{
            url:"/customer",
            templateUrl:"customer.htm",
            controller: "CustomerController"
        },
        m_customeredit: {
            url: "/customeredit?id&tab",
            templateUrl: "customer_edit.htm",
            controller: "CustomerEditController",
            module: "m_customer",
            mode: "customer_edit"
        },

        m_customer_level:{
            url:"/customer_level",
            templateUrl:"customer_level.htm",
            controller: "CustomerLevelController",
            module: "m_customer",
        },
        m_productedit: {
            url: "/productedit?id",
            templateUrl: "productedit.htm",
            controller: "ProductEditController",
            module: "m_product",
            mode: "product_edit"
        },
        m_producttype: {
            url: "/product/type",
            templateUrl: "producttype.htm",
            controller: "ProductTypeController",
            module: "m_product",
            mode: "product_type"
        },
        m_productvendor: {
            url: "/product/vendor",
            templateUrl: "productvendor.htm",
            controller: "ProductVendorController",
            module: "m_product",
            mode: "product_vendor"
        },
        m_order:{
            url:"/order",
            templateUrl:"order.htm",
            controller: "OrderController"
        },
        m_summary: {
            url: "/",
            templateUrl: "stat.htm",
            controller: "StatController",
            mode: "m_summary"
        },

        m_account: {
            url: "/account",
            templateUrl: "account.htm",
            controller: "AccountController",
            mode: "account"
        },
        m_accountedit: {
            url: "/accountedit?id",
            templateUrl: "account_edit.htm",
            controller: "AccountEditController",
            module: "m_account",
            mode: "account_edit"
        }
    };
    var t = window.YoudianConf.accountModules,
        t = _.reject(t, function (e) {
        return "m_account" == e
    });
    t.push("m_page404");
    t.push("m_notinplan", "m_nopermission", "m_notowner");
     window.YoudianConf.isOwner && t.push("m_account");

    var i = window.YoudianConf.storeModules;
    i = _.reject(i, function (e) {
        return "m_account" == e
    });
    i.push("m_notinplan", "m_nopermission", "m_notowner", "m_page404");
    window.YoudianConf.isOwner && i.push("m_account");
    var n = [];
    _.forEach(routes, function(a, o) {
        var s = _.indexOf(t, o); - 1 == s && a.module && (s = _.indexOf(t, a.module));
        var r = _.indexOf(i, o); - 1 == r && a.module && (r = _.indexOf(i, a.module));
        var l;
        return s > -1 && r > -1 ? (l = a, l.name = o, void n.push(l)) : s > -1 && -1 == r ? void alert("not in plan") : -1 == s && r > -1 ? (l = a, l.name = o, "m_account" == l.name ? (l.templateUrl = routes.m_notowner.templateUrl, l.controller = routes.m_notowner.controller) : (l.templateUrl = routes.m_nopermission.templateUrl, l.controller = routes.m_nopermission.controller), void n.push(l)) : -1 == s && -1 == r ? (l = a, l.name = o, l.templateUrl = routes.m_notinplan.templateUrl, l.controller = routes.m_notinplan.controller, void n.push(l)) : void alert("route get err")

    });
    window.YoudianConf.nowRoute = n;

    window.YoudianConf.navigationConfig_shangcheng = [
        ["stat","order","product", "customer", "store"],
        ["coupon", "promotion", "membership"],
        ["settingGroup"],
    ],
    window.YoudianConf.allNavigation = {
        stat:{
            text:"概况", 
            ico:"home", 
            module:"m_summary"
        },
        order:{
            text:"订单", 
            ico:"order", 
            module:"m_order",
            notification:!0,
        },
        product:{
            text:"商品", 
            ico:"product", 
            module:"m_product",
        },
        customer:{
            text:"顾客", 
            ico:"customer", 
            module:"m_customer"
        },
      
        setting:{
            text:"设置", 
            ico:"basesetting", 
            module:"m_setting"
        },
        shipment:{
            text:"运费模板",
            module:"m_shipment",
            ico:"shipment"
        },
        promotion: {
            text: "营销",
            ico: "promotion",
            module: "m_promotion"
        },
        account: {
            text: "管理员",
            ico: "admin",
            module: "m_account"
        },
        payment: {
            text: "支付",
            ico: "payment",
            module: "m_payment"
        },
        coupon: {
            text: "优惠券",
            ico: "coupon",
            module: "m_coupon"
        },
        membership: {
            text: "会员卡",
            ico: "membership",
            module: "m_membership"
        },
        store: {
            text: "门店",
            ico: "store",
            module: "m_store"
        },
        settingGroup: {
            type: "group",
            text: "系统",
            ico: "setting",
            sub: ["setting","account","payment","shipment"]
        }

    };
}());