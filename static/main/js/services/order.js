(function () {
    var e = Class.extend({
        _callbacks: [],
        init: function (e, t) {
            this._uri = e;
            var i = this,
                n = function () {
                    i._getOrderData(function () {
                        t(n, YouPreset.STAT_UPDATE_INTERVAL)
                    })
                };
            window.YoudianConf.accountModules.indexOf("m_order") > -1 && n()
        }, 
        _getOrderData: function (e) {
            var t = this;
            this._uri.get("stat_order", null, function (i) {
                200 === i.code && t._exec(i.data), angular.isFunction(e) && e()
            })
        }, 
        _exec: function (e) {
            this._callbacks.forEach(function (t) {
                angular.isFunction(t) && t(e)
            })
        }, 
        onMsg: function (e) {
            console.log(e)
            angular.isFunction(e) && this._callbacks.push(e)
        }
    });
    angular.module("services.$Order", []).service("$Order", ["$Uri", "$timeout", e])
})();