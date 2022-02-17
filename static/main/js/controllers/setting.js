var SettingController = BaseController.extend({
    init: function(e, t, i, n, a, o, s, l, c) {
        this._super(e),
        this._scope = e,
        e.showSetting = {opacity: "0"},
        n.loading(!0);
        o.get();
        e.validation = {};

        var d = e.data = {}, 
        u = function () {
            i.get("setting", !1, function (t) {
                e.generalInfo = t.data;
                var i = t.data;
                _.forEach(g, function (e) {e.load(i)}),
                p = _.cloneDeep(d), 
                n.loading(!1), 
                e.showSetting = {opacity: "1"}
            });
        };
        e.fSave = function () {
            var a = {}, o = !0;
            _.forEach(g, function (e) {
                if (!e.save(a)) return o = !1, !1
            }),
            o && (e.isSaving = !0, i.post("setting", a, function (i) {
                e.isSaving = !1, 
                200 == i.code ? ("2" == d.shopStatus && (d.shopPassword = a.password, d.shopPasswordNew = a.password), "1" == d.shopStatus && (d.closeStoreOrg = a.close_desc) , n.info({
                    text: "保存成功"
                }, !0), t.unsaved = !0, u()) : 201 == i.code && n.info({type: "danger",text: i.message}, !0)
            
            },{
                overrideError: !0,
                errorCallback: function () {
                    e.isSaving = !1
                }
            }))
        }, u();

        var m,g = [
        {
            value: "base",
            text: "基础设置",
            init: function () {
                function t(image_path) {
                    d.logoImageUrl = i.getAssetUrl(image_path, '118x118'), 
                    d.logo_image_path = image_path;
                }
                e.pwExpandConf = {
                    initStyle: {
                        "max-width": "160px",
                        "max-height": "50px",
                        background: "#fff"
                    },
                    expandStyle: {
                        "max-width": "460px",
                        "max-height": "50px",
                        background: "#f2f7fb"
                    }
                }, 
                e.offExpandConf = {
                    initStyle: {
                        "max-width": "160px",
                        "max-height": "50px",
                        background: "#fff"
                    },
                    expandStyle: {
                        "max-width": "702px",
                        "max-height": "274px",
                        background: "#f2f7fb"
                    },
                    extCss: {
                        "max-width": "100%"
                    }
                }, 
                e.$watch("data.shopStatus", function (t) {
                    switch (t) {
                    case "0":
                        e.offExpandConf.isExpand = !1, 
                        e.pwExpandConf.isExpand = !1, 
                        e.showStatusTxt = !1, 
                        e.validation.toggle("data.shopPasswordNew", !1);
                        break;
                    case "1":
                        d.closeStoreHtml = d.closeStoreOrg, 
                        e.offExpandConf.isExpand = !0, 
                        e.pwExpandConf.isExpand = !1, 
                        a(function () {
                            e.showStatusTxt = !0
                        }, 200), 
                        e.validation.toggle("data.shopPasswordNew", !1);
                        break;
                    case "2":
                        d.shopPasswordNew = d.shopPassword, 
                        e.offExpandConf.isExpand = !1, 
                        e.pwExpandConf.isExpand = !0, 
                        e.showStatusTxt = !1;
                    }
                }), 
                e.onLogoImgUpload = function (a) {
                    var o = a.files;
                    if (o.length > 1) return void n.modal({
                        title: "图片数量过多",
                        content: "只能上传一张图片",
                        btn: [{
                            type: "primary",
                            text: "确定",
                            click: "popConfirm"
                        }],
                        scope: {
                            popConfirm: function () {
                                n.close()
                            }
                        }
                    });
                    var s = o[0],
                        r = {
                            files: o,
                            evt: a,
                            scope: e,
                            arrayName: "uploadLogoImage",
                            onBeforeUpload: function () {
                                e.isSeoImgUploading = !0
                            }, onSucc: function (i) {
                                t(i.url), e.isSeoImgUploading = !1
                            }
                        },
                        l = new FileReader;
                        l.onload = function (e) {
                            var t = e.target.result,
                            a = new Image;
                            a.onload = function () {
                                var e = a.width,
                                    t = a.height;
                                if (e < 100 || t < 100) return void n.modal({
                                    title: "图片尺寸过小",
                                    content: "图片尺寸必须大于<b>100*100</b>",
                                    btn: [{
                                        type: "primary",
                                        text: "确定",
                                        click: "popConfirm"
                                    }],
                                    scope: {
                                        popConfirm: function () {
                                            n.close()
                                        }
                                    }
                                });
                                i.multiImgUpload(r)
                            }, 
                            a.src = t
                        }, 
                        l.readAsDataURL(s)
                }, 
                e.onLogoImgRemove = function () {
                    n.modal({
                        title: "删除店铺Logo",
                        content: "你确定要删除店铺Logo图吗？",
                        btn: [{
                            type: "loading",
                            hide: !0
                        }, {
                            type: "default",
                            text: "取消",
                            click: "popCancel"
                        }, {
                            type: "danger",
                            text: "确认删除",
                            click: "fDel"
                        }],
                        scope: {
                            popCancel: function () {
                                n.close()
                            }, 
                            fDel: function (e, t) {
                                d.logoImageUrl = "", 
                                d.logo_image_path = "", 
                                n.close()
                            }
                        }
                    })
                }
            }, 
            load: function (a) {
                d.shopName = s.htmlEnDeCode.htmlDecode(a.name); 
                if(a.logo_image_path) {
                    d.logo_image_path = a.logo_image_path, 
                    d.logoImageUrl = i.getAssetUrl(a.logo_image_path,'118x118')
                } 
                
                d.service_phone = s.htmlEnDeCode.htmlDecode(a.service_phone) || "", 
                d.announcement = s.htmlEnDeCode.htmlDecode(a.announcement) || "", 
            
                
                d.shopStatus = a.status + "", 
                d.shopStatusBak = a.status + "", 
                d.shopPassword = a.password, 
                d.shopPasswordNew = d.shopPassword, 
                d.closeStoreHtml = a.close_desc || "商铺维护中，请稍后……", 
                d.closeStoreOrg = a.close_desc || "商铺维护中，请稍后……"

            }, 
            save: function (t) {
                if ("2" != d.shopStatus || e.validation.validate(["data.shopPasswordNew"])) {
                    if (!this.fCheckShopStatus() && e.validation.validate(["data.shopName", "data.service_phone", "data.announcement"])) {
                        switch (d.shopName = s.escgtlt(d.shopName), 
                            t.name = d.shopName, 
                            t.service_phone = s.htmlEnDeCode.htmlEncode(d.service_phone), 
                            t.announcement = s.htmlEnDeCode.htmlEncode(d.announcement), 
                            t.logo_image_path = d.logo_image_path, 
                            t.close_desc = d.closeStoreOrg, 
                            t.password = d.shopPassword, 
                            t.status = d.shopStatus,
                            d.shopStatus) {
                        case "0":
                            break;
                        case "1":
                            t.close_desc = d.closeStoreHtml;
                            break;
                        case "2":
                            "" == d.shopPasswordNew ? t.password = d.shopPassword : t.password = d.shopPasswordNew
                        }
                        return  t
                    }
                }
            }, 
            fCheckShopStatus: function () {
                if (d.shopStatusBak == d.shopStatus) return !1;
                var t = d.shopStatus,
                    i = "切换店铺状态很危险,确认要继续吗？";
                switch (t) {
                case "0":
                    i = "你确定要切换店铺状态到“<strong>正常开放营业中</strong>”吗？<br/>这样您的网站将可以公开访问。";
                    break;
                case "1":
                    i = "你确定要切换店铺状态到“<strong>暂时关闭店铺</strong>”吗？<br/>设置后，店铺会显示关店说明，<br/>顾客将无法正常购物。";
                    break;
                case "2":
                    i = "你确定要切换店铺状态到“<strong>需要密码才可进入店铺</strong>”吗？<br/>设置后，顾客访问店铺需要输入密码。";
                    break;
                case "3":
                    i = "你的店铺处在于“欠费状态”。"
                }
                return n.modal({
                    title: "切换网站状态",
                    content: i,
                    scope: {
                        cancel: function () {
                            d.shopStatus = d.shopStatusBak, 
                            n.close()
                        }, confirm: function () {
                            d.shopStatusBak = d.shopStatus, 
                            n.close(), 
                            e.fSave()
                        }
                    },
                    btn: [{
                        text: "取消",
                        type: "default",
                        click: "cancel"
                    }, {
                        text: "确定",
                        type: "danger",
                        click: "confirm"
                    }],
                    onClose: function () {
                        this.scope.cancel()
                    }
                }), !0
            }
        },
        {
            value: "order",
            text: "订单设置",
            init: function () {
                e.activeRedirectConf = {
                    initStyle: {
                        "max-width": "200px",
                        "max-height": "50px",
                        background: "#fff"
                    },
                    expandStyle: {
                        "max-width": "702px",
                        "max-height": "274px",
                        background: "#f2f7fb"
                    },
                    extCss: {
                        "max-width": "100%"
                    }
                }, 
                
                e.autoRecivedDayConf = {
                    initStyle: {
                        "max-width": "130px",
                        background: "#fff"
                    },
                    expandStyle: {
                        "max-width": "330px",
                        background: "#f2f7fb"
                    }
                }, 
                e.$watch("data.autoRecivedDayOn", function (t) {
                    switch (d.autoRecivedDayOn) {
                    case "true":
                        e.autoRecivedDayConf.isExpand = !0;
                        break;
                    case "false":
                        e.autoRecivedDayConf.isExpand = !1
                    }
                }), e.autoRecivedDayRange = _.range(1, 29)
            }, 
            load: function (t) {
                e.onFocusTradeExpired = function (t) {
                    var i = "";
                    t && (i = "setting-tradeExpiredFocus"), 
                    e.tradeExpiredClass = i
                }, 
                e.onChangeTradeExpired = function () {

                    var t = d.trade_expired_after,
                        i = t % 60,
                        n = (t - i) / 60,
                        a = "";
                    n > 0 && (a = a + n + "小时"), 
                    i > 0 && (a = a + i + "分钟"), 
                    e.trade_expired_time = a;
                }, 
                d.trade_expired_after = t.trade_expired_after, 
                e.onChangeTradeExpired(), 
             
                d.bakCurrency = d.currency = t.currency, 
                d.autoDeliveredReceived = t.auto_delivered_received ? "true" : "false", 
                d.autoRecivedDayOn = t.auto_received_day ? "true" : "false", 
                d.autoRecivedDay = t.auto_received_day || YouPreset.AUTO_RECEIVED_DAY
            }, 
            save: function (t) {
                return  t.currency = d.currency, 
                t.trade_expired_after = d.trade_expired_after, 
                t.auto_delivered_received = "true" === d.autoDeliveredReceived, 
                "true" === d.autoRecivedDayOn ? t.auto_received_day = d.autoRecivedDay : t.auto_received_day = 0, 
                t
            }
        },
        {
            value:"coin",
            text:"积分设置",
            init: function () {
                e.setQueryProduct = function () {
                    i.setQuery("product")
                }
            },
            load: function (t) {
                e.originPointData = {
                    reward_point_enabled: t.reward_point_enabled,
                    exchange_ratio_yuan: t.exchange_ratio / 100,
                    initial_ratio: t.initial_ratio,
                    reward_point_limit: t.reward_point_limit
                }, 
                d.point = angular.copy(e.originPointData)
            },
            save: function (t) {
                var i, n = ["data.point.reward_point_enabled", "data.point.initial_ratio", "data.point.reward_point_limit", "data.point.exchange_ratio_yuan"],
                    a = d.point.reward_point_enabled;
                if (a) {
                    if (i = angular.copy(e.data.point), !e.validation.validate(n)) return
                } else i = angular.copy(e.originPointData);
                return t.reward_point_enabled = a, 
                t.initial_ratio = i.initial_ratio, 
                t.reward_point_limit = i.reward_point_limit, 
                t.exchange_ratio = 100 * i.exchange_ratio_yuan,
                t
            }

        }
        ];
        e.switchTab = function (n) {
            e.currentTab !== n && (m = function () {
                e.data = d = _.cloneDeep(p), 
                e.currentTab = n, 
                a(function () {
                    t.unsaved = !0
                })
            }, i.setQuery(null, {tab: n.value}))
        }, 
        e.$on("$locationChangeSuccess", function () {
            m && m(), m = null
        }), 
        e.tabData = [], 
        _.forEach(g, function (t) {
            t.init(), 
            e.tabData.push(_.pick(t, "value", "text"))
        });
        var f = c.search().tab;
        f && (e.currentTab = _.find(e.tabData, {value: f})), 
        e.currentTab = e.currentTab || e.tabData[0];
    },
    defineListeners: function() {
        this._super()
    },
    destroy: function() {}
});
SettingController.$inject = ["$scope", "$rootScope", "$Uri", "$Popup", "$timeout", "$Time", "$Util", "$parse", "$location"];
