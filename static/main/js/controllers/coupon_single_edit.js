var CouponSingleEditController = BaseEditController.extend({
    _tag: "couponsingle",
    _tagUrl: "coupon_group",
    _tagData: "coupon_group",
    _tagCn: "优惠券",
    _watchChange: ["data.name", "data.range_type"],
    _watchValid: ["data.name", "data.prefix", "data.discount_amount"],
    _isPreCreate: !1,
    init: function (e, t, i, n, a, o, s, r, l) {
        var c = this;
        YouPreset.init("coupon"), 
        this.$interval = s, 
        this._super(e, t, i, n, a, o, l), 
        this._$Util = r, 
        this._param = {
            id: c._id,
            page: 1,
            size: YouPreset.LIST_PAGE_SIZE
        }, 
        
        e.getStatusText = function (e) {
            return _.find(YeePreset.COUPON_STATUS, function (t) {
                return t.value === e
            }).text
        }, 
        e.dataPagination = {
            onSwitch: function (e) {
                c._param.page = e, c.loading(!0), c._getDistributedCoupon(function () {
                    c.loading(!1)
                })
            }
        }, 
        e.onRefresh = function () {
            c._param.page = 1, e.isRefreshing = !0, c._getDistributedCoupon(function () {
                e.isRefreshing = !1
            })
        }, 
        e.dataGrid = {
            onCheckedChange: function (t) {
                e.opDisabled = !t
            }
        }, 
        e.blurOff = function () {
            parseFloat(e.data.discount_amount) > parseFloat(e.data.active_amount) && o(function () {
                e.validation.toggle("data.active_amount", !0, "购物金额应不小于优惠券金额")
            }, 200)
        }
    }, 
    _initNewCoupon: function () {
        var e = this._$scope;
        e.data.name = e.data.discount_amount = e.data.active_amount = e.data.discount_percentage = null
    }, 
    _initExsitCoupon: function () {
        var e = this,
            t = this._$scope,
            i = this._$Uri,
            n = this._$Popup,
            a = this.$interval,
            o = t.data.name,
            s = !t.data.is_available,
            r = "expired" == t.data.status;
        t.isExpired = r, t.canDiscard = !s && !r, t.canDistribute = !s && !r, t.data.dealing && (e.loopRequest = a(function () {
            i.get(e._tagUrl + "_getSingle", {
                id: e._id
            }, function (t) {
                t.data[e._tagData].dealing || (a.cancel(e.loopRequest), e._getDistributedCoupon())
            })
        }, 2e3)), 
        t.discardCoupon = function () {
            n.modalSimple({
                action: "作废优惠券",
                type: "danger",
                content: "确定要作废 " + o + " 优惠券吗？",
                onConfirm: function () {
                    i.post("coupon_group_cancel", {
                        id: e._id
                    }, function (e, i) {
                        200 == i ? (t.canDiscard = t.canDistribute = !1, t.isExpired = !0, n.info({
                            text: o + "作废成功"
                        })) : n.info({
                            type: "danger",
                            text: o + " 作废失败"
                        }), n.close()
                    })
                }
            })
        }, 
        t.fExpandDetail = function () {
            t.advanceExpandArrow = !t.advanceExpandArrow, t.advanceExpandArrow ? t.gridStyle = {
                display: "none"
            } : t.gridStyle = {
                display: "block"
            }
        }, 
        t.getCustomerAvatar = function (e) {
           return i.getAssetUrl(e.avatar_path, "42x42")
        }, 
        this.isNew() || (this._originalData = {}, 
        t.toggleCouponEditalbe = function () {
                t.baseAvailable ? e._originalData = JSON.stringify(t.data) : t.data = JSON.parse(e._originalData), 
                t.baseAvailable = !t.baseAvailable
        })
    }, 
    _getDistributedCoupon: function (e) {
        var t = this,
            i = this._$scope,
            n = this._$Uri;
        this._$timeout;
        n.get("coupon_group_getCoupons", t._param, function (n, a) {
            200 == a && (i.distributedCoupon = n.data, 
                i.dataPagination.count = n.data.page_count, 
                i.dataPagination.current = t._param.page, 
                i.dataPagination.lock = !1), 
            e && e(n, a)
        }, {
            errorCallback: function () {
                t.loading(!1)
            }, overrideError: !0
        })
    }, 
    onInitDone: function (e) {
        var t = this._$scope,
            i = this._$Time,
            n = this._$timeout,
            a = this,
            o = this.isNew();
        o && (e = {
            atype: "normal",
            utype: "amount",
            active_amount: 0,
            discount_amount: 0,
            quantity_provided: "",
            quantity_type: !1,
            discount_percentage: 100,
            no_expires: !1,
            actived_at: null,
            expired_at: null,
            is_saved: !1,
            is_available: !0,
            dealing: !1,
            coupons: []
        }), 
        t.data = e, e.active_amount /= 100, 
        e.discount_amount /= 100, 
        e.discount_percentage /= 10, 
        e.isTypeAmount = "amount" === e.utype, 
        t.$watch("data.isTypeAmount", function (t) {
            !0 === t ? (e.utype = "amount", a._watchValid[2] = "data.discount_amount") : (e.utype = "percentage", a._watchValid[2] = "data.discount_percentage")
        }), 
        e.isActiveAmount = 0 !== e.active_amount, e.isSingleAtype = "single" === e.atype, t.$watch("data.isSingleAtype", function (t) {
            e.atype = !0 === t ? "single" : "normal"
        }), 
        e.isQuantityType = e.quantity_type, t.$watch("data.isQuantityType", function (t) {
            e.quantity_type = !0 === t
        }), 
        n(function () {
            var n = 0;
            n = e.no_expires ? -1 : i.timestamp(e.expired_at);
            var a = t.dataDatetime.timeStart = i.timestamp(e.actived_at),
                o = t.dataDatetime.timeEnd = n;
            t.dataDatetime.onChange = function (e, i) {
                e && (a != e && t.unSaved(), t.validation && t.validation.toggle("begin_data", !1)), i && (o != i && t.unSaved(), t.validation && t.validation.toggle("expire_data", !1))
            }
        }), o ? this._initNewCoupon() : (this._initExsitCoupon(), this._getDistributedCoupon())
    }, 
    onSaveBefore: function () {
        var e = this,
            t = this._$scope,
            i = this._$timeout,
            n = !0,
            a = !1;
        t.data.isActiveAmount && (t.validation.validate(["data.active_amount"]) || (n = !1, a = !0), parseFloat(t.data.discount_amount) > 0 && parseFloat(t.data.active_amount) > 0 && parseFloat(t.data.discount_amount) > parseFloat(t.data.active_amount) && (t.validation.toggle("data.active_amount", !0, "购物金额应不小于优惠券金额", !a), n = !1, a = !0));
        var o = t.dataDatetime.getTime();
        if (o[0] || (t.validation.toggle("begin_data", !0, "请设置开始时间", !a), n = !1, a = !0), o[1] || (t.validation.toggle("expire_data", !0, "请设置结束时间", !a), n = !1, a = !0), t.isNew && (t.data.isQuantityType || t.validation.validate(["data.quantity_provided"]) || (n = !1, a = !0)), !t.isNew) {
            var s = JSON.parse(e._originalData);
            t.data.isQuantityType || t.data.quantity_provided - 0 < s.quantity_provided - 0 && (i(function () {
                t.validation.toggle("data.quantity_provided", !0, "优惠券使用总次数不可小于初始值", !0)
            }), n = !1, a = !0)
        }
        return n
    }, 
    onSave: function (e) {
        var t = this._$scope,
            i = this._$Time,
            n = this._$Util;
        e.ctype = "single", 
        e.utype = t.data.utype, 
        e.atype = t.data.atype, 
        e.name = t.data.name, 
        e.atype = t.data.atype, 
        t.isNew || (e.id = this._id), 
        "amount" === e.utype ? e.discount_amount = n.fen(t.data.discount_amount) : e.discount_percentage = 10 * t.data.discount_percentage, t.data.isActiveAmount ? e.active_amount = n.fen(t.data.active_amount) : e.active_amount = 0, t.data.isQuantityType ? e.quantity_type = !0 : (e.quantity_type = !1, e.quantity_provided = t.data.quantity_provided);
        var a = t.dataDatetime.getTime();
        e.actived_at = i.serverTimestamp(a[0]), -1 == a[1] ? e.no_expires = !0 : e.expired_at = i.serverTimestamp(a[1]), t.data.prefix && (e.prefix = t.data.prefix)
    }, 
    loading: function (e) {
        var t = this;
        e ? t._$Popup.loading(++t._loadingCount) : t._$Popup.loading(--t._loadingCount)
    }, 
    destroy: function () {
        this.$interval.cancel(this.loopRequest)
    }
});
CouponSingleEditController.$inject = ["$scope", "$rootScope", "$Uri", "$Popup", "$Time", "$timeout", "$interval", "$Util", "$state"];