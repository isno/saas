var PromotionFreeshipController = BaseEditController.extend({
    _tag: "promotion",
    _tagEdit: "promotionfreeship",
    _tagCn: "满免邮活动",
    _watchChange: ["data.name", "data.range_type", "data.active_amount", "isActiveAmount"],
    _watchValid: ["data.name"],
    _isPreCreate: !0,
    init: function(e, t, i, n, a, o) {
        YouPreset.init("promotion"),
        this._super(e, t, n, i, a),
        this._$Util = o
    },
    _initRangeType: function() {
        var e = this._$scope,
        t = this._$Popup;
        e.rangeTypes = YouPreset.DISCOUNT_RANGE_TYPE,
        e.isRangeTypeChecked = function(t) {
            return t.value == e.data.range_type ? "checked": ""
        },
        e.selectProducts = function() {
            t.products({
                title: "参与活动",
                products: e.data.products,
                onDone: function(t) {
                    e.unSaved(),
                    e.data.products = t,
                    t.length > 0 && e.validation.toggle("products", !1)
                }
            })
        }
    },
    _initActiveType: function() {
        var e = this._$scope,
        t = this._$Popup;
        e.activeTypes = YouPreset.DISCOUNT_ACTIVE_TYPE,
        e.isActiveTypeChecked = function(t) {
            return t.value == e.data.active_type ? "checked": ""
        },
        e.selectCustomers = function() {
            t.customers({
                title: "参与活动",
                customers: e.data.customers,
                onDone: function(t) {
                    e.unSaved(),
                    e.data.customers = t,
                    t.length > 0 && e.validation.toggle("customers", !1)
                }
            })
        }
    },
    _initCustomerLevels: function() {
        var e = this._$scope;
        this._getAllCustomerLevel(function(t) {
            e.customer_levels = t,
            _.forEach(e.data.customer_levels,
            function(t) {
                var i = _.find(e.customer_levels,
                function(e) {
                    return t.id == e.id
                });
                i && (i.selected = !0)
            })
        }),
        e.CustomerLevelChange = function(t) {
            e.data.customer_levels = [],
            t.selected && e.validation.toggle("customer_levels", !1),
            _.forEach(e.customer_levels,
            function(t) {
                t.selected && e.data.customer_levels.push({
                    id: t.id
                })
            })
        }
    },
    _getAllCustomerLevel: function(e) {
        this._$Uri.get("customer_level_getAll", null,
        function(t) {
            200 == t.code && e(t.data.customer_levels)
        })
    },
    _initActiveAmount: function() {
        var e = this._$scope;
        e.isActiveAmountChecked = function(t) {
            return t == e.isActiveAmount ? "checked": ""
        }
    },
    _initArea: function() {
        var e = this._$scope,
        t = this._$Popup;
        e.setArea = function() {
            t.area({
                isInverse: !0,
                title: "设置不参与促销地区",
                checked: e.data.areas,
                onDone: function(t) {
                    e.data.areas = t,
                    e.areas = YouArea.format(t),
                    e.unSaved()
                }
            })
        },
        e.getCityNames = function(e) {
            var t = [],
            i = [];
            return _.forEach(YouArea.getCityNames(e),
            function(e, n) {
                0 !== n && n % 5 == 0 && (t.push(i.join("、")), i = []),
                i.push(e)
            }),
            t.push(i.join("、")),
            t.join("、<br>")
        }
    },
    _initShipment: function() {
        var e = this._$scope;
        e.clickShipment = function() {
            e.unSaved(),
            e.validation.toggle("deliveryType", !1)
        }
    },
    onInitDone: function(e) {
        var t = this._$scope,
        i = this._$Time;
        t.data = e,
        t.isActiveAmount = Boolean(e.active_amount) ? 1 : 0,
        e.active_amount /= 100,
        t.areas = e.areas ? YouArea.format(e.areas) : [],
        t.shipments = _.cloneDeep(YouPreset.DISCOUNT_SHIPMENT),
        e.delivery_type.length > 0 && _.forEach(t.shipments,function(t) {
            e.delivery_type.includes(t.value) && (t.isChecked = !0);
        });
        var n = 0;
        n = e.no_expires ? -1 : i.timestamp(e.expired_at);
        var a = t.dataDatetime.timeStart = i.timestamp(e.actived_at),
        o = t.dataDatetime.timeEnd = n;
        t.dataDatetime.onChange = function(e, i) {
            e && (a != e && t.unSaved(), t.validation && t.validation.toggle("begin_data", !1)),
            i && (o != i && t.unSaved(), t.validation && t.validation.toggle("expire_data", !1))
        },
        this.isNew() && (t.data.name = null),
        this._initCustomerLevels(),
        this._initRangeType(),
        this._initActiveType(),
        this._initActiveAmount(),
        this._initArea(),
        this._initShipment()
    },
    onPreCreate: function(e) {
        e.discount_type = "free_shipping"
    },
    onSaveBefore: function() {
        var e = this._$scope,
        t = !0,
        i = !1;
        "partial" == e.data.range_type && 0 === e.data.products.length && (e.validation.toggle("products", !0, "请选择商品", !i), t = !1, i = !0),
        "partial" == e.data.active_type && 0 === e.data.customers.length && (e.validation.toggle("customers", !0, "请选择顾客", !i), t = !1, i = !0),
        "customer_level" == e.data.active_type && 0 === e.data.customer_levels.length && (e.validation.toggle("customer_levels", !0, "请选择会员", !i), t = !1, i = !0),
        1 != e.isActiveAmount || e.validation.validate(["data.active_amount"]) || (t = !1, i = !0);
        var n = [];
        _.forEach(e.shipments,
        function(e) {
            e.isChecked && n.push(e.value)
        }),
        0 === n.length && (e.validation.toggle("deliveryType", !0, "请至少选择一种配送方式", !i), t = !1, i = !0);
        var a = e.dataDatetime.getTime();
        return a[0] || (e.validation.toggle("begin_data", !0, "请设置开始时间", !i), t = !1, i = !0),
        a[1] || (e.validation.toggle("expire_data", !0, "请设置结束时间", !i), t = !1, i = !0),
        t
    },
    onSave: function(e) {
        var t = this._$scope,
        i = this._$Time,
        n = this._$Util;
        if (e.id = t.data.id, e.name = t.data.name, e.introduce = t.data.introduce, e.active_type = t.data.active_type, e.range_type = t.data.range_type, e.discount_type = "free_shipping", "partial" == t.data.range_type && t.data.products.length > 0) {
            var a = [];
            _.forEach(t.data.products,
            function(e) {
                a.push({
                    id: e.id
                })
            }),
            e.products = JSON.stringify(a)
        }
        if ("partial" == e.active_type && t.data.customers.length > 0) {
            var o = [];
            _.forEach(t.data.customers,
            function(e) {
                o.push({
                    id: e.id
                })
            }),
            e.customers = JSON.stringify(o)
        } else "customer_level" == e.active_type && t.data.customer_levels.length > 0 && (e.customer_levels = JSON.stringify(t.data.customer_levels));
        1 == t.isActiveAmount && (e.active_amount = n.fen(t.data.active_amount)),
        t.data.areas && (e.areas = t.data.areas);
        var s = [];
        _.forEach(t.shipments,
        function(e) {
            e.isChecked && s.push(e.value)
        }),
        e.delivery_type = JSON.stringify(s);
        var r = t.dataDatetime.getTime();
        e.actived_at = i.serverTimestamp(r[0]),
        -1 == r[1] ? e.no_expires = !0 : e.expired_at = i.serverTimestamp(r[1])
    }
});
PromotionFreeshipController.$inject = ["$scope", "$rootScope", "$Popup", "$Uri", "$Time", "$Util"];