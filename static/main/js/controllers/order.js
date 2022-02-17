var OrderController = BaseGridController.extend({
    _tag: "order",
    _watchValid: ["param.amount_smaller", "param.amount_greater"],
    _searchRangeFields: [
        ["param.amount_smaller", "param.amount_greater"]
    ],
    init: function (e, t, i, n, a, o, s, r) {
        YouPreset.init("order"), 
        this._$Time = o, 
        this._$timeout = a, 
        this._super(e, t, i, n, a, r), 
        this._$Util = r;
        var l = this;
        e.YouPreset = YouPreset, 
        this.initCheckBtn("dataOrderStatus", "status", YouPreset.ORDER_STATUS, !0), 
        this.initCheckBtn("dataGatewayStatus", "gateway", function (e) {
            i.get("paymentMethod_filter", null, function (t) {
                if (200 == t.code) {
                    var i = _.map(t.data.payment_methods, function (e) {
                        return {
                            text: e.name,
                            value: e.value
                        }
                    });
                    e(i)
                }
            })
        }, !0), 
        this.initCheckBtn("dataShipmentStatus", "shipment_status", YouPreset.SHIPMENT_STATUS, !0),  
        e.dataDate = {
            type: "datetime",
            showCleanup: !0,
            timeStart: e.param.created_earlier,
            timeEnd: e.param.created_later,
            onChange: function (t, i) {
                e.param.created_earlier = t, e.param.created_later = i
            }
        }, 
        e.showFdropSearch = !1,
        e.clickFdropSearch = function () {
            e.showFdropSearch || (e.showFdropSearch = !0, setTimeout(function () {
                s.one("click", function () {
                    e.showFdropSearch = !1, e.$digest()
                })
            }))
        }, 
        e.clickFdropSearchItem = function (t) {
            t != e.param.searchType && (e.param.searchType = t, e.showFdropSearch = !1, e.param.search = e.param.phone = null)
        }, 
        e.getDeviceName = function (e) {
            return (_.find(YouPreset.ORDER_DEVICE, function (t) {
                return t.value === e
            }) || {}).text
        }, 
        e.isShowReport = window.YoudianConf.showReport, 
        e.onReport = function () {
            var t = "生成导出Excel",
                o = _.cloneDeep(e.param);
            l.onGetAll(o), n.modal({
                title: t,
                content: "查询中..."
            }), i.get("trade_buildReport", o, function (e) {
                if (n.close(), 200 == e.code)
                    if (e.msg.success) {
                        n.modal({
                            title: t,
                            content: "请耐心等待，报表正在生成中..."
                        });
                        var s = function () {
                            i.get("trade_checkReport", o, function (e) {
                                if (200 != e.code || !e.msg.success) return void a(s, 1e3);
                                n.close(), n.modal({
                                    notpreventDefault: !0,
                                    title: t,
                                    content: '<a target="_blank" class="text-link" href="/center/trade/download_report">' + e.msg.file_name + "</a>",
                                    btn: [{
                                        type: "primary",
                                        text: "关闭",
                                        click: "confirm"
                                    }],
                                    scope: {
                                        confirm: function () {
                                            n.close()
                                        }
                                    }
                                })
                            })
                        };
                        s()
                    } else n.modal({
                        title: t,
                        content: e.msg.reason,
                        btn: [{
                            type: "primary",
                            text: "关闭",
                            click: "confirm"
                        }],
                        scope: {
                            confirm: function () {
                                n.close()
                            }
                        }
                    })
            })
        }, 
        e.getGatewayTips = function (e) {
            var t = "",
                i = _.filter(YouPreset.GATEWAY_STATUS, function (t) {
                    return t.value == e.gateway
                });
            return i[0] && (t = i[0].text), e.collect_by_yhsd && (t += " - 爱优店代收"), t
        }, 
        e.isHeaderTabShowWarning = function (e) {
            if (YeeStat.DATA.trade) switch (e.value) {
            case 3:
                return Boolean(YeeStat.DATA.trade.need_shipping);
            case 5:
                return Boolean(YeeStat.DATA.trade.refunding)
            }
        }, 
        e.dataMainFollow = {
            withTab: !0,
            isTabOn: !0,
            onStatusChange: function (t) {
                e.showFilter = t
            }
        }, 
        e.headerTabs = _.cloneDeep(YouPreset.ORDER_HEADER_TABS), 
        e.showFilter = !1, 
        l.curHeaderTab = null, 
        e.onClickHeaderTab = function (t, i, n) {
            if (l.curHeaderTab != t) {
                switch (l.curHeaderTab && (
                    l.curHeaderTab.isActive = !1, 
                    100 == l.curHeaderTab.value && e.dataMainFollow.setTabOn()), 
                l.curHeaderTab = t, 
                e.onReset({
                    notRequest: !0
                }), 
                e.param.created_earlier = e.param.created_later = null, 
                e.param.tab = t.value, 
                l.curHeaderTab.value) {
                case 1:
                    e.param.created_earlier = o.getLite() - 7776e6;
                    break;
                case 2:
                    e.param.status = "0", 
                    e.param.payment_status = "0";
                    break;
                case 3:
                    e.param.status = "0", 
                    e.param.shipment_status = "0,3", 
                    e.param.payment_status = "2";
                    break;
                case 4:
                    e.param.status = "0",
                    e.param.shipment_status = "1", 
                    e.param.payment_status = "2";
                    break;
                case 5:
                    e.param.status = "3";
                    break;
                case 6:
                    e.param.status = "2";
                    break;
                case 8:
                    e.param.created_later = o.getLite() - 7776e6;
                    break;
                case 100:
                    e.dataDate.cleanUp(), 
                    e.dataMainFollow.setTabOff()
                }
                n && n(), 
                l.curHeaderTab.isActive = !0, 
                e.dataMainFollow.onTabChange(), 
                i || e.onSearch()
            }
        };
        var c, d, p, u = function (e, t) {
            var n = '<div class="order-list-tr-shipment-items clearfix">',
                a = e.length,
                o = a % 2 == 0;
            return _.forEach(e, function (e, t) {
                n += '<div class="order-list-tr-shipment-item"><div class="order-list-tr-shipment-item-inner ' + (o && t == a - 2 ? "t-1" : "") + '"><div class="order-list-tr-shipment-item-name"><a target="_blank" class="text-link" href="' + e.page_url + '" title="' + r.htmlEnDeCode.htmlEncode(e.name) + '">' + r.htmlEnDeCode.htmlEncode(e.name) + '</a></div><div class="order-list-tr-shipment-item-desc"><span title="' + (r.htmlEnDeCode.htmlEncode(e.options_desc) || "") + '">' + (r.htmlEnDeCode.htmlEncode(e.options_desc) || "") + '</span></div><div class="order-list-tr-shipment-item-img grid-list-thumbnail"><img src="' + i.getAssetUrl(e.image_path,"42x42") + '"><div class="imgcover"></div></div><div class="order-list-tr-shipment-item-price text-muted">' + YouPreset.$() + r.yuan(e.price) + '</div><div class="order-list-tr-shipment-item-quantity"><span class="order-list-tr-shipment-item-quantity-tag text-muted">x</span> <span class="order-list-tr-shipment-item-quantity-txt">' + e.quantity + "</span></div></div></div>"
            }), n += "</div>"
        };
        $(window).on("keydown", function (e) {
            if (!p && c) {
                switch (e.keyCode) {
                case 38:
                    var t = c.prev().prev();
                    t.is(".grid-tr-expending") && (t = t.prev());
                    break;
                case 40:
                    t = c.next()
                }
                t && t.length && (p = !0, t.find(".order-list-arrow").trigger("click", "keydown"))
            }
        })
        
    }, 
    initParam: function (e) {
        e.order = "desc", 
        e.order_by = "created_at", 
        e.created_earlier = this._$Time.getLite() - 7776e6, 
        e.searchType = 0
    }, 
    initQuery: function (e) {
        var t = this._$scope,
            i = this._$timeout,
            n = this._$Uri,
            a = n.getQuery();
        i("{}" == JSON.stringify(a) ? function () {
            t.onClickHeaderTab(_.find(t.headerTabs, {value: 1}))
        } : a.pending ? function () {
            t.onClickHeaderTab(_.find(t.headerTabs, {value: 3}))
        } : a.refunding? function () {
            t.onClickHeaderTab(_.find(t.headerTabs, {value: 5}))
        }:function () {
            var e = {
                status: t.dataOrderStatus,
                gateway: t.dataGatewayStatus,
                shipment_status: t.dataShipmentStatus
            };
            t.onClickHeaderTab(_.find(t.headerTabs, {
                isSearch: !0
            }), !1, function () {
                _.forEach(a, function (i, n) {
                    switch (n) {
                    case "date":
                        var o = moment(a.date, "YYYYMMDD").toDate().getTime();
                        t.dataDate.timeStart = t.param.created_earlier = o, 
                        t.dataDate.timeEnd = t.param.created_later = o + 86399999;
                        break;
                    case "status":
                    case "gateway":
                    case "shipment_status":
                        var s = i.split(","),
                            r = [];
                        _.forEach(s, function (t) {
                            var i = _.findIndex(e[n].list, function (e) {
                                return String(e.value) === String(t)
                            });
                            r.push(i + 1)
                        }), e[n].selected = r, t.param[n] = i;
                        break;
                    case "amount_smaller":
                    case "amount_greater":
                    case "searchType":
                    case "mobile":
                    case "search":
                    case "consignee_name":
                        t.param[n] = i
                    }
                })
            })
        })
    }, 
    onCache: function (e) {
        var t = this,
            i = this._$scope,
            n = this._$timeout;
        e.created_earlier || n(function () {
            i.dataDate.cleanUpA()
        }), e.created_later || n(function () {
            i.dataDate.cleanUpB()
        }), n(function () {
            t.curHeaderTab = _.find(i.headerTabs, {
                value: e.tab
            }), t.curHeaderTab.isActive = !0, 100 == e.tab && n(function () {
                i.dataMainFollow.setTabOff()
            })
        }), 
        t.loading(!0), 
        t._httpGetAll(function () {
            n(function () {
                t.loading(!1)
            })
        }, !0)
    },
    onReset: function () {
        var e = this._$scope;
        e.dataDate.timeStart = e.dataDate.timeEnd = null, 
        e.dataOrderStatus.reset(), 
        e.dataShipmentStatus.reset(), 
        e.dataGatewayStatus.reset(), 
        e.param.searchType = 0;
    }, 
    getPreset: function (e) {
        switch (e) {
        case "order":
            return YouPreset.ORDER_STATUS;
        case "payment":
            return YouPreset.PAYMENT_STATUS;
        case "shipment":
            return YouPreset.SHIPMENT_STATUS
        }
    }, 
    onGetAll: function (e) {
        e.created_earlier && (e.created_earlier = this._$Time.serverTimestamp(e.created_earlier)), 
        e.created_earlier || (e.created_earlier = null), 
        e.created_later && (e.created_later = this._$Time.serverTimestamp(e.created_later)), 
        e.created_later || (e.created_later = null), 
        e.amount_smaller && (e.amount_smaller *= 100), 
        e.amount_greater && (e.amount_greater *= 100)
    }
});
OrderController.$inject = ["$scope", "$rootScope", "$Uri", "$Popup", "$timeout", "$Time", "$document", "$Util"];