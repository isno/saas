var AccountEditController = BaseEditController.extend({
    _tag: "account",
    _tagCn: "管理员",
    _watchChange: ["data.account"],
    _watchValid: [],
    _moduleShop: ["m_order", "m_product", "m_customer", "m_promotion", "m_coupon",  "m_refund"],
    _moduleConfig: ["m_setting","m_account","m_payment","m_store", "m_shipment"],
    init: function (e, t, i, n, a, o, s, r) {
        this._super(e, t, n, i, o, s);
        var l = this;
        this._$rootScope = t, 
        this._$Popup = i, 
        this._$Uri = n, 
        this._$Util = a, 
        this._$timeout = s, 
        this._$interval = r, 
        n.get("account_getModules", null, function (t) {
            e.modules = t.data, 
            l._init(), 
            l._initChecked()
        }), 
        e.free_change_owner = !0,
        e.tabData = [{
            value: "login",
            text: "最近登录"
        }, 
        {
            value: "log",
            text: "操作日志"
        }], 
        e.currentTab = e.currentTab || e.tabData[0], 
        e.switchTab = function (t) {
            e.currentTab !== t && (e.currentTab = t)
        }, 
        this._param = {
            account_id: l._id,
            page: 1
        }, 
        e.dataPagination = {
            onSwitch: function (e) {
                l._param.page = e, 
                l.loading(!0), 
                l._getOperateLog(function () {
                    l.loading(!1)
                })
            }
        }, 
        e.onRefresh = function () {
            l._param.page = 1, 
            e.isRefreshing = !0, 
            l._getOperateLog(function () {
                e.isRefreshing = !1
            })
        }


    }, 
    _getOperateLog: function (e) {
        var t = this,
            i = this._$scope,
            n = this._$Uri;
        this._$timeout;
        n.get("account_operateLog", t._param, function (n) {
            200 == n.code && (i.operateLogsCount = n.data.item_count, i.operateLogs = n.data.operate_logs, i.dataPagination.count = Math.ceil(n.data.item_count / 10), i.dataPagination.current = t._param.page, i.dataPagination.lock = !1), e && e(n)
        }, {
            errorCallback: function () {
                t.loading(!1);
            }, overrideError: !0
        })
    }, 
    onInitDone: function (e) {
        var t = this._$Popup,
            i = this._$Uri,
            n = this._$scope,
            a = (this._$timeout, this._$interval);
           e.remark = this._$Util.htmlDeCode(e.remark);
        this._$scope.data = e, 
        this._init(),
        this._initChecked(), 

        n.isNew || (n.avatar_url = i.getAssetUrl(e.image_path, "158x158")),
        this._param.page = 1, 
        this._getOperateLog();
        var o = e.logins && e.logins.length > 0;
        this._$scope.showLoginList = o, 
        o && (this._$scope.logins = e.logins), 
        this._$scope.isOwner = 0 === e.account_type,
        this._$scope.is_actived = e.is_actived,
        n.last_in = e.last_in, 
        n.onClickChangeOwner = function () {
            t.modal({
                title: "转让店铺拥有权",
                content: '<h3 class="summit-h3" style="margin-bottom:14px;">警告！此操作将会导致如下改变，请谨慎操作：</h3><div class="setting-transferOwner-warning" style="margin-bottom:12px;color: #333;border: 1px solid #333;">- 本品牌的所有权将转让给他人<br/>- 品牌的所有资源，包括短信、邮件、空间等资源额度将会被转让<br/>- 你的账户将降级为普通管理员</div><h3 class="summit-h3" style=";">验证码<span ng-show="modelData.showAuthcodeTips" style="color: #c32727;margin-left: 15px;">{{ modelData.tips }}</span></h3><input type="text" class="input" ng-model="code" you-validation="required" /><you-btn ng-show="modelData.showGetCodeBtn" style="vertical-align: top;margin-left:5px;" type="primary" text="获取验证码" ng-click="fSendAuthCode()"></you-btn><you-btn ng-hide="modelData.showGetCodeBtn" style="vertical-align: top;margin-left:5px;" type="primary" text="{{modelData.second}}s&nbsp;之后重新获取" ng-disabled="true"></you-btn>',
                scope: n,
                btn: [{
                    type: "loading",
                    hide: !0
                }, {
                    text: "取消",
                    type: "default",
                    click: "cancelTransferOwner",
                    hide: !1
                }, {
                    text: "确认转让此店铺的所有权",
                    type: "danger",
                    click: "submitTransferOwner",
                    hide: !1
                }],
                contentextclass: "setting-transferOwner-content",
                initModel: {
                    newOwner: e.account,
                    modelData: {
                        showGetCodeBtn: !0,
                        showAuthcodeTips: !1,
                        tips: "",
                        second: 60
                    },
                    fSendAuthCode: function () {
                        var e = this;
                        e.modelData.showGetCodeBtn = !1, 
                        i.post("account_sendChangeOwnerCode", {}, function (t) {
                            if (t && 200 == t.code) {
                                e.modelData.tips = t.message, 
                                e.modelData.showAuthcodeTips = !0;
                                var i = a(function () {
                                    0 === --e.modelData.second && (e.modelData.showGetCodeBtn = !0, e.modelData.second = 60, a.cancel(i))
                                }, 1e3)
                            }
                        })
                    }
                }
            })
        }, 
        n.cancelTransferOwner = function () {
            t.close()
        }, 
        n.submitTransferOwner = function (e, a) {
            if (!e.validation.validate(["newOwner", "code"])) return void(a.submitTransferOwner = !1);
            a.data.btn[0].hide = !1, 
            a.data.btn[1].hide = !0, 
            a.data.btn[2].hide = !0;
            var o = {
                new_owner_account: e.newOwner,
                code: e.code
            };
            i.post("account_changeOwner", o, function (i) {
                i && 200 == i.code && (t.close(), t.modal({
                    title: "转让店铺拥有权",
                    content: "店铺的拥有权已转给 " + e.newOwner + "，点击确定重新加载网站。",
                    scope: n,
                    noX: !0,
                    btn: [{
                        text: "重新加载",
                        type: "primary",
                        click: "goReload"
                    }]
                }))
            }, {
                errorCallback: function (t) {
                    if (t && 200 !== t.code) {
                        e.validation.toggle("code", !0, "验证码错误，请重新输入", !0), 
                        a.submitTransferOwner = !1, 
                        a.data.btn[0].hide = !0, 
                        a.data.btn[1].hide = !1, 
                        a.data.btn[2].hide = !1
                    }
                }, overrideError: !0
            })
        }, 
        this._$scope.goReload = function () {
            window.location.href = "/shop/"+window.YoudianConf.shop_id+"/console/#"
        }
    }, 
    _init: function () {
        var e = this,
            t = this._$scope;

        if (!t.modules) return void(t.modules = []);

        if (0 !== t.modules.length) {
            t.modules_shop = [], 
            t.modules_config = [];

            var i = [];
            _.forEach(t.modules, function (e, t) {
                i.push(e.code)
            });
            var n = function (t) {
                var n = [];
                _.forEach(e[t], function (e, t) {
                    -1 == i.indexOf(e) && n.push(e)
                }), 
                n.length > 0 && _.forEach(n, function (i, n) {
                    _.remove(e[t], function (e) {
                        return i === e
                    })
                })
            };
            n("_moduleShop"), 
            n("_moduleConfig");

            var a = function (i) {
                var n = e._moduleShop.indexOf(i.code);
                if (n > -1) return void(t.modules_shop[n] = i);
                var o = e._moduleConfig.indexOf(i.code);
                return o > -1 ? void(t.modules_config[o] = i) : void 0
            };
            t.modules && t.data && t.data.modules && _.forEach(t.modules, function (e) {
                for (var i = 0; i < t.data.modules.length; i++)
                    if (e.code == t.data.modules[i].code) {
                        e.checked = !0;
                        break
                    }
            }), _.forEach(t.modules, function (e) {
                a(e)
            })
        }
    }, 
    _initChecked: function () {
        var e = this._$scope,
            t = this._$rootScope;
        if (0 !== e.modules.length) {
            var i = function (t) {
                var i = !0,n = 0;
                _.forEach(e["modules_" + t], function (e) {
                    e && (e.checked ? n++ : i = !1)
                }), 
                e["isCheckAll_" + t] = Boolean(i && n)
            };
            i("shop"), 
            i("config"), 
            e.onChangeModule = function (e) {
                t.unsaved = !1, i(e)
            }, 
            e.imitateClickCheckAll = function () {
                e.showCancelAll = !0, 
                e.clickCheckAll("shop", !0), 
                e.clickCheckAll("config", !0)
            }, 
            e.imitateClickCancelAll = function () {
                e.showCancelAll = !1, 
                e.clickCheckAll("shop", !1), 
                e.clickCheckAll("config", !1)
            }, 
            e.clickCheckAll = function (i, n) {
                t.unsaved = !1, 
                _.forEach(e["modules_" + i], function (e) {
                    e.checked = n
                })
            }
        }
    }, 
    onSaveBefore: function () {
        var e = this._$scope;
        this._$Util;
        return !!e.validation.validate(["data.name"]) && !!e.validation.validate(["data.account"]) && (!(!YouPreset.VALIDATIONS.mobile.regexp.test(e.data.account)) || (e.validation.toggle("data.account", !0, "请输入正确的手机号码", !0), !1))
    }, 
    onSave: function (e) {
        var t = this._$scope;
        e.account_id = this.getId();
        var i = [];
        i = i.concat(t.modules_shop).concat(t.modules_config);
        var n = [];
        _.forEach(i, function (e) {
            e.checked && n.push(e.code)
        }),
        e.account = t.data.account, 
        e.name = t.data.name,
        e.module_codes = n.toString(), 
        e.remark = this._$Util.htmlEnCode(t.data.remark)
    }
});
AccountEditController.$inject = ["$scope", "$rootScope", "$Popup", "$Uri", "$Util", "$Time", "$timeout", "$interval"];