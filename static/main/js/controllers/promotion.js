var PromotionController = BaseGridController.extend({
    _tag: "promotion",
    init: function (e, t, i, n, a, o, s) {
        var r = this;
        this._$Time = o, 
        this._super(e, t, i, n, a, s), 
        YouPreset.init("promotion"), 
        e.levelCode = window.YoudianConf.levelCode, 
        this.initCheckBtn("dataType", "discount_type", 
            YouPreset.DISCOUNT_TYPE), 
        this.initCheckBtn("dataStatus", "status", YouPreset.DISCOUNT_STATUS), 
        e.dataDate = {
            timeStart: null == e.param.order_earlier ? 0 : e.param.order_earlier,
            timeEnd: null == e.param.order_later ? 0 : e.param.order_later,
            onChange: function (t, i) {
                e.param.active_earlier = t, e.param.active_later = i
            }
        }, 
        e.getTypeText = function (e) {
            return _.find(YouPreset.DISCOUNT_TYPE, function (t) {
                return t.value === e
            }).text
        }, 
        e.getTypePath = function (e) {
            return _.find(YouPreset.DISCOUNT_TYPE, function (t) {
                return t.value === e
            }).path
        }, 
        e.getStatusText = function (e) {
            return _.find(YouPreset.DISCOUNT_STATUS, function (t) {
                return t.value === e
            }).text
        }, 
        e.onClickItem = function (n, a) {
            var o = e.getTypePath(n.discount_type);
            a.preventDefault(), t.gridParam = r._param, o && i.setQuery(o, {
                id: n.id
            })
        }, 
        e.addPromotion = function () {
            n.modal({
                title: "选择需要新增的营销活动类型",
                content: '<div class="pop-path"><div class="pop-path-inline-block" ng-click="goPromotionOff($event);"><div class="pop-path-inline-block-inner">满减</div></div><div class="pop-path-inline-block" ng-click="goPromotionDiscount($event);"><div class="pop-path-inline-block-inner">满折</div></div><div class="pop-path-inline-block" ng-click="goPromotionFreeship($event);"><div class="pop-path-inline-block-inner">满免邮</div></div><div class="pop-path-inline-block" ng-click="goPromotionCoupon($event);"><div class="pop-path-inline-block-inner">满赠券</div></div></div>',
                contentextclass: "pop-path-horizontal",
                popStyle: {
                    width: "760px",
                    minWidth: "760px",
                    paddingBottom: "0px"
                },
                initModel: {
                    goPromotionOff: function (e) {
                        e.preventDefault(), t.gridParam = r._param, n.close(), i.setQuery("promotionoff", {
                            id: "new"
                        })
                    }, goPromotionDiscount: function (e) {
                        e.preventDefault(), t.gridParam = r._param, n.close(), i.setQuery("promotiondiscount", {
                            id: "new"
                        })
                    }, goPromotionFreeship: function (e) {
                        e.preventDefault(), t.gridParam = r._param, n.close(), i.setQuery("promotionfreeship", {
                            id: "new"
                        })
                    }, goPromotionCoupon: function (e) {
                        e.preventDefault(), t.gridParam = r._param, n.close(), i.setQuery("promotioncoupon", {
                            id: "new"
                        })
                    }
                },
                scope: {
                    popCancel: function () {
                        n.close()
                    }
                }
            })
        }
    }, initParam: function (e) {}, onGetAll: function (e) {
        e.active_earlier && (e.active_earlier = this._$Time.serverTimestamp(e.active_earlier)), e.active_later && (e.active_later = this._$Time.serverTimestamp(e.active_later))
    }, onReset: function () {
        var e = this._$scope;
        e.dataType.reset(), e.dataStatus.reset(), e.dataDate.timeStart = e.dataDate.timeEnd = 0
    }
});
PromotionController.$inject = ["$scope", "$rootScope", "$Uri", "$Popup", "$timeout", "$Time", "$Util"];