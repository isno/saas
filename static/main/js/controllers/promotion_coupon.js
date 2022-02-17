var PromotionCouponController = BaseEditController.extend({
    _tag: "promotion",
    _tagEdit: "promotioncoupon",
    _tagCn: "满赠券活动",
    _watchChange: ["data.name", "data.range_type"],
    _watchValid: ["data.name", "data.active_amount"],
    _isPreCreate: !0,
    init: function (e, t, i, n, a, o, s) {
        YouPreset.init("promotion"), 
        this._super(e, t, n, i, o), 
        this._$timeout = a, 
        this._$Util = s
    }, 
    _initRangeType: function () {
        var e = this,
            t = this._$scope,
            i = this._$Popup;
        t.rangeTypes = YouPreset.DISCOUNT_RANGE_TYPE, t.isRangeTypeChecked = function (e) {
            return e.value == t.data.range_type ? "checked" : ""
        }, t.selectProducts = function () {
            i.products({
                title: "参与活动",
                products: t.data.products,
                onDone: function (i) {
                    t.unSaved(), 
                    t.data.products = i, 
                    i.length > 0 && (t.validation.toggle("products", !1), 
                        e._checkPromotionAvail(JSON.stringify(i)))
                }
            })
        }
    }, _initActiveType: function () {
        var e = this._$scope,
            t = this._$Popup;
        e.activeTypes = YouPreset.DISCOUNT_ACTIVE_TYPE, e.isActiveTypeChecked = function (t) {
            return t.value == e.data.active_type ? "checked" : ""
        }, e.selectCustomers = function () {
            t.customers({
                title: "参与活动",
                customers: e.data.customers,
                onDone: function (t) {
                    e.unSaved(), e.data.customers = t, t.length > 0 && e.validation.toggle("customers", !1)
                }
            })
        }
    }, _initCoupons: function () {
        var e = this._$scope,
            t = (this._$rootScope, this._$Uri);
        e.addOff = function () {
            e.unSaved(), e.data.promotion_offs.push({
                active_amount: 0
            })
        }, e.removeOff = function (t) {
            e.unSaved(), _.remove(e.data.promotion_offs, function (e) {
                return e == t
            })
        }, 
        e.showCouponSelector = !1, 
        this.isNew() ? t.get("coupon_group_getAll", {
            status: "actived",
            ctype: "normal"
        }, function (t) {
            t.data.coupon_groups.length && (e.showCouponSelector = !0)
        }) : e.showCouponSelector = !0, e.getDataCouponSeletor = function (t, i) {
            var n = {
                cnname: "普通优惠券",
                btnname: "选择普通优惠券",
                url: ["coupon_group_getAll", "notPost", "notPost"],
                uniparam: "coupon_groups",
                mode: "search",
                queryname: "id",
                dataDatetime: e.dataDatetime,
                queryparam: {
                    status: "dispatch",
                    ctype: "normal"
                },
                staticMode: !0,
                btnautostatus: !0,
                isUniq: !0,
                inputplaceholder: "搜索普通优惠券",
                inputMaxLength: 50,
                footerLinks: [{
                    text: "刷新",
                    click: angular.noop,
                    isNotOverrideBtn: !0,
                    isNotAutoCloase: !0,
                    isAutoRefresh: !0
                }, {
                    text: "新增",
                    click: e.goAddCoupon,
                    isNotOverrideBtn: !0,
                    isNotAutoCloase: !0
                }],
                prefixParam: "status",
                prefixActiveValue: "unactived",
                sync: function (n, a) {
                    n.length ? (t.coupon_group_id = n[0].id, e.validation && e.validation.toggle("couponId_" + i, !1)) : t.coupon_group_id = ""
                }
            };
            return t.coupon_group_id && (n.orgData = [{
                id: t.coupon_group_id,
                name: t.name
            }]), n
        }, e.goAddCoupon = function () {
            window.open("#/couponedit?id=new")
        }
    }, _initCustomerLevels: function () {
        var e = this._$scope;
        this._getAllCustomerLevel(function (t) {
            e.customer_levels = t, _.forEach(e.data.customer_levels, function (t) {
                var i = _.find(e.customer_levels, function (e) {
                    return t.id == e.id
                });
                i && (i.selected = !0)
            })
        }), e.CustomerLevelChange = function (t) {
            e.data.customer_levels = [], t.selected && e.validation.toggle("customer_levels", !1), _.forEach(e.customer_levels, function (t) {
                t.selected && e.data.customer_levels.push({
                    id: t.id
                })
            })
        }
    }, _checkPromotionAvail: function (e) {
        var t = this,
            i = this._$scope,
            n = this._$Uri,
            a = this._$Popup,
            o = this._$Time;
        n.post("promotion_avail", {
            actived_at: o.serverTimestamp(i.dataDatetime.timeStart),
            expired_at: o.serverTimestamp(i.dataDatetime.timeEnd),
            id: t._id,
            range_type: "partial",
            products: e
        }, function (e) {
            !1 === e.data.avail && a.modal({
                title: "商品添加违规",
                popStyle: {
                    height: "327px"
                },
                contentextclass: "promotion-unvail-product-pop",
                btn: [{
                    text: "返回修改",
                    type: "primary",
                    click: "reedit"
                }],
                scope: {
                    reedit: function () {
                        a.close(), i.selectProducts()
                    }
                },
                initModel: {
                    products: e.data.unavail_products
                },
                content: '同件商品不能参与多个有效的营销活动（满免邮除外），共{{products.length}}个商品已违反该规则，敬请修改！<ul><li ng-repeat="item in products"><span style="color:#434343;">{{item.name}}</span></li></ul>'
            })
        })
    }, _checkPromotionCoupon: function (e) {
        var t = (this._$scope, this._$Uri, this._$Popup);
        t.modal({
            title: "提示",
            popStyle: {
                height: "150px"
            },
            contentextclass: "promotion-unvail-product-pop",
            btn: [{
                text: "确定",
                type: "primary",
                click: "reedit"
            }],
            scope: {
                reedit: function () {
                    t.close()
                }
            },
            initModel: {
                desc: e
            },
            content: "{{ desc }}"
        })
    }, _getAllCustomerLevel: function (e) {
        this._$Uri.get("customer_level_getAll", null, function (t) {
            200 == t.code && e(t.data.customer_levels)
        })
    }, onInitDone: function (e) {
        var t = this._$scope,
            i = this._$Time;
        t.data = e, e.promotion_offs && 0 !== e.promotion_offs.length || (e.promotion_offs = [{
            active_amount: 0
        }]), _.forEach(e.promotion_offs, function (e, t) {
            e.active_amount /= 100
        });
        var n = 0;
        n = e.no_expires ? -1 : i.timestamp(e.expired_at);
        var a = t.dataDatetime.timeStart = i.timestamp(e.actived_at),
            o = t.dataDatetime.timeEnd = n;
        t.dataDatetime.onChange = function (e, i) {
            e && (a != e && t.unSaved(), t.validation && t.validation.toggle("begin_data", !1)), i && (o != i && t.unSaved(), t.validation && t.validation.toggle("expire_data", !1))
        }, this.isNew() && (t.data.name = null), this._initCoupons(), this._initCustomerLevels(), this._initRangeType(), this._initActiveType()
    }, onPreCreate: function (e) {
        e.discount_type = "coupon"
    }, checkRule: function () {
        var e = this._$scope,
            t = {},
            i = !0;
        return function (t) {
            _.forEach(e.data.promotion_offs, t)
        }(function (e, i) {
            if (!isNaN(e.active_amount)) {
                (t[e.active_amount] = t[e.active_amount] || []).push(i)
            }
        }), _.forEach(t, function (t, n) {
            t.shift(), _.forEach(t, function (t, a) {
                i = !1, e.validation.toggle("activeAmount_" + t, !0, '已存在"满' + n + '"门槛的规则')
            })
        }), i
    }, onSaveBefore: function () {
        var e = this._$scope,
            t = !0,
            i = !1;
        "partial" == e.data.range_type && 0 === e.data.products.length && (e.validation.toggle("products", !0, "请选择商品", !i), t = !1, i = !0), "partial" == e.data.active_type && 0 === e.data.customers.length && (e.validation.toggle("customers", !0, "请选择顾客", !i), t = !1, i = !0), "customer_level" == e.data.active_type && 0 === e.data.customer_levels.length && (e.validation.toggle("customer_levels", !0, "请选择会员", !i), t = !1, i = !0), _.forEach(e.data.promotion_offs, function (n, a) {
            e.validation.validate(["activeAmount_" + a]) || (t = !1, i = !0), e.validation.validate(["couponId_" + a]) || (e.validation.toggle("couponId_" + a, !0, "请选择优惠券"), t = !1, i = !0)
        }), this.checkRule() || (t = !1);
        var n = e.dataDatetime.getTime();
        return n[0] || (e.validation.toggle("begin_data", !0, "请设置开始时间", !i), t = !1, i = !0), n[1] || (e.validation.toggle("expire_data", !0, "请设置结束时间", !i), t = !1, i = !0), t
    }, onSave: function (e) {
        var t = this._$scope,
            i = this._$Time,
            n = this._$Util;
        if (e.id = t.data.id, e.name = t.data.name, e.introduce = t.data.introduce, e.active_type = t.data.active_type, e.range_type = t.data.range_type, e.discount_type = "coupon", "partial" == t.data.range_type && t.data.products.length > 0) {
            var a = [];
            _.forEach(t.data.products, function (e) {
                a.push({
                    id: e.id
                })
            }), e.products = JSON.stringify(a)
        }
        if ("partial" == e.active_type && t.data.customers.length > 0) {
            var o = [];
            _.forEach(t.data.customers, function (e) {
                o.push({
                    id: e.id
                })
            }), e.customers = JSON.stringify(o)
        } else "customer_level" == e.active_type && t.data.customer_levels.length > 0 && (e.customer_levels = JSON.stringify(t.data.customer_levels));
        var s = [];
        _.forEach(t.data.promotion_offs, function (e) {
            s.push({
                active_amount: n.fen(e.active_amount),
                coupon_group_id: e.coupon_group_id
            })
        }), e.promotion_offs = JSON.stringify(s);
        var r = t.dataDatetime.getTime();
        e.actived_at = i.serverTimestamp(r[0]), -1 == r[1] ? e.no_expires = !0 : e.expired_at = i.serverTimestamp(r[1])
    }
});
PromotionCouponController.$inject = ["$scope", "$rootScope", "$Popup", "$Uri", "$timeout", "$Time", "$Util"];