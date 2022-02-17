var CouponController = BaseGridController.extend({
    _tag: "coupon",
    init: function (e, t, i, n, a, o, s) {
        var r = this;
        this._$Time = s, 
        this._super(e, t, i, n, a, o), 
        YouPreset.init("coupon"), 
        this.initCheckBtn("dataTypes", "ctype", YouPreset.COUPON_TYPES), 
        this.initCheckBtn("dataStatus", "status", YouPreset.COUPON_STATUS), 
        e.dataDate = {
            timeStart: null == e.param.order_earlier ? 0 : e.param.order_earlier,
            timeEnd: null == e.param.order_later ? 0 : e.param.order_later,
            onChange: function (t, i) {
                e.param.active_earlier = t, e.param.active_later = i
            }
        },
        
        e.getTypesText = function (t) {
            var i = _.find(YouPreset.COUPON_TYPES, function (e) {
                return e.value === t
            });
            return i ? i.text : e.getTypesText("normal")
        }, 
        e.getStatusText = function (e) {
            return _.find(YouPreset.COUPON_STATUS, function (t) {
                return t.value === e
            }).text
        }, 
        e.fNewCoupon = function () {
            n.modal({
                title: "请选择要新建的优惠券类型",
                content: '<div class="pop-path"><div class="pop-path-inline-block" ng-click="goCouponEdit($event);"><div class="pop-path-inline-block-inner">普通券<small>多张且只能单次使用</small></div></div><div class="pop-path-inline-block" ng-click="goCouponSingleEdit($event);"><div class="pop-path-inline-block-inner">复用券<small>仅一张并可重复使用</small></div></div></div>',
                contentextclass: "pop-path-horizontal",
                popStyle: {
                    width: "460px",
                    minWidth: "460px",
                    paddingBottom: "0px"
                },
                initModel: {
                    goCouponEdit: function (e) {
                        e.preventDefault(), 
                        t.gridParam = r._param,
                        n.close(), 
                        i.setQuery("couponedit", {id: "new"})
                    }, 
                    goCouponSingleEdit: function (e) {
                        e.preventDefault(), 
                        t.gridParam = r._param, 
                        n.close(), 
                        i.setQuery("couponsingleedit", {id: "new"})
                    }
                },
                scope: {
                    popCancel: function () {
                        n.close()
                    }
                }
            })
        }, 
        e.distributeCoupon = function (t) {
            var a = t.name;
            n.customers({
                title: "派发优惠券",
                customers: [],
                mode: "distribute",
                msg: {single: "single" === t.atype, id: t.id,atype: t.atype},
                onDone: function (o) {
                    var s = t.quantity_free,
                        r = 0,
                        l = _.map(o, function (e) {
                            return r += Number(e.listItemAmount), {id: e.id,quantity: e.listItemAmount}
                        });
                    if (r)
                        if (r > s) n.modalSimple({type: "msg",title: "提示",content: "优惠券不足以派发"});
                        else {
                            var c = {id: t.id,customers: JSON.stringify(l)};
                            e.isDistributing = !0, i.post("coupon_group_assign", c, function (t, i) {
                                200 == i ? (n.info({
                                    text: a + " 派发成功"
                                }), e.onRefresh()) : n.info({
                                    type: "danger",
                                    text: a + " 派发失败"
                                }), e.isDistributing = !1
                            })
                        }
                }
            })
        }, 
        e.discardCoupon = function (e) {
            var t = e.name;
            n.modalSimple({
                action: "作废优惠券",
                type: "danger",
                content: "确定要作废 " + t + " 优惠券吗？",
                onConfirm: function () {
                    i.post("coupon_group_cancel", {id: e.id}, function (i, a) {
                        200 == a ? (e.status = "expired", n.info({
                            text: t + "作废成功"
                        })) : n.info({
                            type: "danger",
                            text: t + " 作废失败"
                        }), n.close()
                    })
                }
            })
        };
        var l = function (e) {
            var t = function () {
                n.closeAll()
            };
            n.modal({
                title: "领取二维码",
                content: '<div id="popup-coupon-qrcode" style="margin: 15px 0 25px;"></div><input type="text" class="input input-long" readonly value="' + e + '">',
                onClose: t,
                btn: [{
                    type: "primary",
                    text: "下载二维码图片",
                    click: "onDownload"
                }, {
                    type: "primary",
                    text: "复制链接",
                    click: "onCopy"
                }, {
                    type: "default",
                    text: "关闭",
                    click: "onClose"
                }],
                popStyle: {
                    maxWidth: "460px"
                },
                scope: {
                    contentStyle: {
                        textAlign: "center"
                    },
                    onClose: t,
                    onDownload: function (e, t) {
                        delete t.onDownload, r.click()
                    }, onCopy: function (e, t) {
                        delete t.onCopy
                    }
                },
                initModel: {
                    export_url: e
                }
            });
         
            a(function () {
                o.setClipboard($(".popup-normal-ctrl button").get(1), {
                    text: e
                })
            })
        };
        e.getExportInfo = function (e) {
            var t = e.export_url;
            if (t) return void l(t);
            n.modal({
                title: "领取二维码",
                content: YouText.POPUP_MODAL_LOADING,
                popStyle: {
                    maxWidth: "460px"
                }
            }), i.get("coupon_group_getSingle", {
                id: e.id
            }, function (i) {
                t = e.export_url = i.data.coupon_group.export_url, 
                n.closeSp(), 
                l(t)
            })
        }
    }, 
    onInitDone: function (e) {}, initParam: function (e) {}, onGetAll: function (e) {
        e.active_earlier && (e.active_earlier = this._$Time.serverTimestamp(e.active_earlier)), e.active_later && (e.active_later = this._$Time.serverTimestamp(e.active_later))
    }, 
    onReset: function () {
        var e = this._$scope;
        e.dataStatus.reset(), 
        e.dataTypes.reset(),
        e.dataDate.timeStart = e.dataDate.timeEnd = 0
    }
});
CouponController.$inject = ["$scope", "$rootScope", "$Uri", "$Popup", "$timeout", "$Util", "$Time"];