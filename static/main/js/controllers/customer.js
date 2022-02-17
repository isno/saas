var CustomerController = BaseGridController.extend({
    _tag: "customer",
    _initCount: 2,
    _watchValid: ["param.amount_smaller", "param.amount_greater", "param.count_smaller", "param.count_greater", "param.point_smaller", "param.point_greater"],
    _searchRangeFields: [
        ["param.amount_smaller", "param.amount_greater"],
        ["param.count_smaller", "param.count_greater"],
        ["param.point_smaller", "param.point_greater"]
    ],
    init: function (e, t, i, n, a, o, s, r, q) {
        YouPreset.init("customer");
        var l = this;
        this._$Time = o, 
        this._super(e, t, i, n, a, s), 
        this._$scope = e, 
        this._$uri = i, 
        this._$compile = r;
        var c = this.initCheckBtn("dataLevel", "customer_level_id", null, !1);

        i.get("customer_level_getAll", null, function (e) {
            if (200 == e.code) {
                var t = _.map(e.data.customer_levels, function (e) {
                    return {
                        value: e.id,
                        text: e.name,
                        icon: e.src
                    }
                });
                l.dataLevelList = t, c(t)
            }
        }), 
        e.dataDate = {
            showCleanup: !0,
            timeStart: null == e.param.order_earlier ? 0 : e.param.order_earlier,
            timeEnd: null == e.param.order_later ? 0 : e.param.order_later,
            onChange: function (t, i) {
                e.param.order_earlier = 0 === t ? null : t, e.param.order_later = 0 === i ? null : i
            }
        }, 
        e.dataCreateDate = {
            showCleanup: !0,
            timeStart: null == e.param.create_earlier ? 0 : e.param.create_earlier,
            timeEnd: null == e.param.create_later ? 0 : e.param.create_later,
            onChange: function (t, i) {
                e.param.create_earlier = 0 === t ? null : t, e.param.create_later = 0 === i ? null : i
            }
        }, 
        e.getCustomerAvatar = function (e) {
            return i.getAssetUrl(e.avatar_path, "42x42")
        }, 
        e.getLevelIcon = function (e) {
            console.log(e)
            var t, n = e.customer_level_id;
            if (t = _.result(_.find(l.dataLevelList, {
                value: n
            }), "icon")) e.getIconSrc = window.YoudianConf.assetHost + t;
            else {
                e.getIconSrc = i.getAssetUrl("/image/2021/7/90586d8ee4a2b45fbb3b61a330df243d.png", "16x16")
            }
            return e.getIconSrc
        }, 
        e.onClickItemTrade = function (n, a) {
            a.stopPropagation(), 
            t.gridParam = e.param, 
            i.setQuery("orderedit", {id: n.last_trade_no})
        },
        e.showFdropSearch = !1,
        e.param.search_type = 0,
        e.clickFdropSearchItem = function (t) {
            t != e.param.search_type && (e.param.search_type = t, e.showFdropSearch = !1, e.param.search = e.param.phone = null)
        }, 
        e.clickFdropSearch = function () {
            e.showFdropSearch || (e.showFdropSearch = !0, setTimeout(function () {
                q.one("click", function () {
                    e.showFdropSearch = !1, e.$digest()
                })
            }))
        }
    }, 
    initParam: function (e) {
        e.order = "desc", 
        e.order_by = "created_at"
    }, 
    onReset: function () {
        var e = this._$scope;
        e.param.search_type = 0,
        e.dataDate.timeStart = e.dataDate.timeEnd = null, 
        e.dataCreateDate.timeStart = e.dataCreateDate.timeEnd = null, 
        e.dataLevel.reset()
    }, 
    getPreset: function () {
        return YouPreset.CUSTOMER_REGIST_SOURCE
    }, 
    onGetAll: function (e) {
        e.order_earlier && (e.order_earlier = this._$Time.serverTimestamp(e.order_earlier)), 
        e.order_later && (e.order_later = this._$Time.serverTimestamp(e.order_later)), 
        e.create_earlier && (e.create_earlier = this._$Time.serverTimestamp(e.create_earlier)), 
        e.create_later && (e.create_later = this._$Time.serverTimestamp(e.create_later)), 
        e.amount_smaller && (e.amount_smaller *= 100), 
        e.amount_greater && (e.amount_greater *= 100)
    }
});
CustomerController.$inject = ["$scope", "$rootScope", "$Uri", "$Popup", "$timeout", "$Time", "$Util", "$compile", "$document"];

