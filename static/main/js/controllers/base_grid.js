var BaseGridController = BaseController.extend({
    init: function(e, t, i, n, a, o) {
        var s = this;
        switch (this._super(e), 
            this._$scope = e, 
            this._$rootScope = t, 
            this._$Uri = i, 
            this._$Popup = n, 
            this._$timeout = a, 
            this._$util = o, 
            e.HTMLDECODE = o.htmlEnDeCode.htmlDecode, 
            this._loadingCount = 0, 
            this._tagUrl = this._tagData = this._tag, 
            this._tag) 
        {
        case "order":
            this._tagUrl = this._tagData = "trade";
            break;
        case "shipment":
            this._tagUrl = "shipmentTemplate",
            this._tagData = "shipment_template";
            break;
        case "mailHistory":
            this._tagUrl = "notify_emailHistory",
            this._tagData = "email_hi";
            break;
        case "smsHistory":
            this._tagUrl = "notify_smsHistory",
            this._tagData = "sms_hi";
            break;
        case "coupon":
            this._tagUrl = this._tagData = "coupon_group";
            break;
        case "cashier":
            this._tagData = "open_trade";
            break;
        case "customer_for_coupon":
            this._tagUrl = "customer_customerForCoupon",
            this._tagData = "customer";
            break;
        case "operate_log":
            this._tagUrl = "account_operateLog"
        }
        switch (this._tag) {
        case "mailHistory":
        case "smsHistory":
        case "cashier":
        case "customer_for_coupon":
        case "operate_log":
            break;
        default:
            this._tagUrl += "_getAll"
        }
        var r = function() {
            s._param = {
                page: 1,
                size: YouPreset.LIST_PAGE_SIZE
            },
            s.initParam && s.initParam(s._param),
            e.param = _.cloneDeep(s._param)
        },
        l = t.gridParam;
        switch (l && l.isCache ? (l.isCache = !1, this._param = l, e.param = _.cloneDeep(this._param), s.onCache && s.onCache(this._param)) : (r(), s.initQuery && (s.initQuery(s._param), e.param = _.cloneDeep(this._param))), e.opDisabled = !0, this._tag) {
        case "order":
        case "cashier":
        case "notice":
            e.showGrid = {
                opacity: "1"
            };
            break;
        default:
            e.showGrid = {opacity: "0"},
            s.loading(!0),
            this._httpGetAll(function() {
                a(function() {
                    s.loading(!1),
                    e.showGrid = {opacity: "1"}
                })
            },
            !0)
        }
        e.dataGrid = {
            onCheckedChange: function(t) {
                e.opDisabled = !t
            }
        },
        e.dataPagination = {
            onSwitch: function(e) {
                s._param.page = e,
                s.loading(!0),
                s._httpGetAll(function() {
                    s.loading(!1)
                })
            }
        },
        e.onSearch = function(t) {
            t && 13 != t.keyCode || e.validation && !e.validation.validate(s._watchValid) || (s._sortSearchRangeFields(), s.onSearch && s.onSearch(), s._param = _.cloneDeep(e.param), s._param.search && (s._param.search = s._$util.htmlEnDeCode.htmlEncode(s._param.search)), s._param.page = 1, s.loading(!0), s._httpGetAll(function() {
                s.loading(!1)
            }))
        },
        e.onReset = function(t) {
            s.onReset && s.onReset(),
            r(),
            t && t.notRequest || a(function() {
                e.onSearch()
            })
        },
        e.onRefresh = function() {
            s._param.page = 1,
            e.isRefreshing = !0,
            s.loading(!0),
            s._httpGetAll(function() {
                e.isRefreshing = !1,
                s.loading(!1)
            })
        },
        e.setOrder = function(e) {
            s._param.order_by == e ? s._param.order = "desc" == s._param.order ? "asc": "desc": s._param.order = "desc",
            s._param.order_by = e,
            s._param.page = 1,
            s.loading(!0),
            s._httpGetAll(function() {
                s.loading(!1)
            })
        },
        e.getOrderClass = function(e) {
            return e != s._param.order_by ? "ico ico-grid-order": "desc" == s._param.order ? "ico ico-grid-order-desc": "ico ico-grid-order-asc"
        },
        e.onClickNew = function(e) {
            var a = function() {
                t.gridParam = s._param,
                i.setQuery(s._tag + "edit", {id: "new"})
            };
            switch (s._tag) {
            case "product":
                n.loading(!0),
                i.get("product_checkLimit", null, function() {a()});
                break;
            case "account":
                n.loading(!0),
                i.get("account_checkLimit", null,function() {a()});
                break;
            default:
                e && e.preventDefault(),
                a()
            }
        },
        e.onClickItem = function(e, n) {
            n.preventDefault(),
            n.stopPropagation(),
            t.gridParam = s._param,
            i.setQuery(s._tag + "edit", {id: e.id})
        },
        e.getPresetText = function(e, t) {
            var i = _.find(s.getPreset(t),
            function(t) {
                return t.value == e
            });
            return i ? i.text: ""
        }
    },
    _getParam: function() {
        var e = _.cloneDeep(this._param);
        return this.onGetAll && this.onGetAll(e),
        _.forEach(e, function(t, i) {
            "" !== t && null !== t && void 0 !== t || delete e[i]
        }), e
    },
    _httpGet: function(e, t) {
        var i = (this._$scope, this._$Uri),n = this;
        angular.isFunction(e) && void 0 === t && (t = e, e = this._getParam()),
        i.get(n._tagUrl, e, function(e) {
            var i = n._replaceDataField || n._tagData + "s",
            a = e.data[i];
            t && t(a, e)
        },
        {
            errorCallback: function() {
                n.loading(!1)
            },
            overrideError: !0,
            canceler: !0
        })
    },
    _httpGetInitModule: function(t) {
        var e = (this._$scope, this._$Uri),
        n = this;
        e.get("main_checkInitModule", {
            module: "init_" + n._tag
        },
        function(e) {
            200 === e.code && t(e.data.init)
        })
    },
    _httpGetAll: function(e, t) {

        var i = this._$scope,
        n = (this._$Uri, this._getParam()),
        a = this;
        switch (i.list && i.list.length > 0 && (i.list = []), i.dataPagination && (i.dataPagination.lock = !0), a._tag) {
            case "coupon":
            case "product":
            case "promotion":
            case "customer":
            case "order":
            case "cashier":
                a._httpGetInitModule(function(t) {
                    i.initModule = t
                })
            }

 
        this._httpGet(n, function(n, o) {

            i.isAllEmpty = o.data.is_empty,
            n || (n = []),
            a.onInitDone && a.onInitDone(n, o.data),
            t && i.isAllEmpty && (i.mainFollowhideFirst = !0),
            i.isEmpty = 0 === n.length,
            i.baseItemCount = o.data.item_count,
            i.list = n,
            i.dataGrid.refresh && i.dataGrid.refresh(),
            o.data.page_count ? i.dataPagination.count = o.data.page_count: i.dataPagination.count = Math.ceil(o.data.item_count / 10),
            i.dataPagination.current = a._param.page,
            i.dataPagination.lock = !1,
            e && e()
        });
    },
    getCheckedIds: function() {
        var e = this._$scope,
        t = [];
        return _.forEach(e.dataGrid.getChecked(),
        function(i) {
            var n = e.list[i];
            n && t.push(n.id)
        }),
        t
    },
    initCheckBtn: function(e, t, i, n) {
        var a = this._$scope,
        o = this._$timeout,
        s = this._$Uri,
        r = a.param[t],
        l = this;
        return a[e] = {isMulti: n,hasCheckAll: !0,list: i,onSelected: function(e) {
                s.abort(l._tagUrl),
                a.param[t] = e,
                a.onSearch()
            }
        },
        o(function() {
            a[e].restore(r)
        }),
        function(t) {
            a[e].list = t
        }
    },
    loading: function(e) {
        var t = this,
        i = this._$scope;
        e ? ++t._loadingCount: --t._loadingCount,
        t._loadingCount < 0 && (t._loadingCount = 0),
        t._$Popup.loading(t._loadingCount),
        i.isGridLoading = !!t._loadingCount
    },
    _sortSearchRangeFields: function() {
        var e = this._$scope,
        t = function(e, t) {
            return t.split(".").reduce(function(e, t) {
                return e[t]
            },
            e)
        },
        i = function(e, t, i) {
            var n, a = t.split("."),
            o = e;
            for (n = 0; n < a.length; n++) n === a.length - 1 ? o[a[n]] = i: o = o[a[n]]
        };
        angular.isArray(this._searchRangeFields) && this._searchRangeFields.forEach(function(n) {
            var a = parseFloat(t(e, n[0])),
            o = parseFloat(t(e, n[1]));
            isNaN(a) || isNaN(o) || a > o && (i(e, n[0], String(o)), i(e, n[1], String(a)))
        })
    }
});
BaseGridController.$inject = [];