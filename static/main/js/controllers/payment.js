var PaymentController = BaseController.extend({
    init: function(t, e, n, i, a, r, s) {
        YouText.init("payment"), 
        YouPreset.init("payment"), 
            this._super(t),
            this._$scope = t,
            this._$Uri = i,
            this._$Popup = n,
            this._$sce = a,
            this._$timeout = r,
            this._$util = s;
        var l = this;
        t.showGrid = {display: "none",opacity: "0"},
        this._paymentBanks = null,
        l._httpGetAll(function() {
            n.loading(!1),
            t.showGrid = {display: "block",opacity: "100"}
        }),
        t.getCurrencyText = function(t) {
            return (_.find(YouPreset.CURRENCY, {ISO: t}) || _.find(YouPreset.CURRENCY, {ISO: "CNY"})).text
        };
        var d = {
            dir: "top",
            addClass: "currency-list-dropdown",
            stopPropagation: !0,
            afterClose: function(t) {
                t.hideToolTips = !1,
                    t.status = "fold"
            },
            beforeOpen: function(t) {
                t.hideToolTips = !0,
                    t.status = "unfold"
            },
            init: function(t) {
                t.status = "fold"
            }
        };
        t.currencyDropdown =  angular.extend({appendTo: ".main-content"},d),
        t.supportsCurrencyDropdown = angular.copy(d),
            t.showPanel = function(e) {
                t.isThirdParty = "thirdParty" === e
            },
            t.reduceSecurity = function() {
                t.data.security_deposit_charged ? n.modal({
                    initModel: {
                        YouPreset: t
                    },
                    title: "保证金",
                    content: "交易费率已降低，如有疑问，欢迎点击后台右上角的工单与我们取得联系。",
                    btn: [{
                        type: "default",
                        text: "取消",
                        click: "fCancelPop"
                    }],
                    scope: {
                        fCancelPop: function() {
                            n.close()
                        }
                    }
                }) : n.modal({
                    initModel: {
                        YouPreset:t
                    },
                    notpreventDefault: !0,
                    title: "保证金",
                    content: '<p>爱优店提供代收服务，其中包括了第三方交易手续费和友好速搭自身带来的服务费用，详细请见<a href="{{ YouPreset.DOCS_HELP_WEIXIN_AGREEMENT }}" target="_blank" style="color: #4499dd;text-decoration: none;">《爱优店代收服务协议》</a></p><p>为网站缴纳保证金，提高网站信用度，爱优店将免除部分代收服务费用，代收费率将 5% 降到 3% 。</p><p>如有疑问，欢迎点击后台右上角的工单与我们取得联系</p>',
                    btn: [{
                        type: "default",
                        text: "取消",
                        click: "fCancelPop"
                    }, {
                        type: "primary",
                        text: "去支付（专业版及以上）",
                        click: "fConfirmPop",
                        disabled: !t.YouLevel.SECURITY_DEPOSIT_ENABLE
                    }],
                    scope: {
                        fCancelPop: function() {
                            n.close()
                        },
                        fConfirmPop: function() {
                            if (!YouPreset.SHOP_OWNER) return void n.modal({
                                title: "权限不足",
                                content: "管理员无法进行此操作，请联系网站拥有者进行操作。",
                                noX: !0,
                                btn: [{
                                    type: "primary",
                                    text: "确定",
                                    click: "fConfirmPop"
                                }],
                                scope: {
                                    fConfirmPop: function() {
                                        n.closeAll()
                                    }
                                }
                            });
                            n.close(),
                                n.modal({
                                    title: "提示",
                                    content: "请前往跳转的支付页面进行付款。",
                                    btn: [{
                                        type: "default",
                                        text: "支付遇到问题",
                                        click: "fCancelPop"
                                    }, {
                                        type: "primary",
                                        text: "已完成支付",
                                        click: "fConfirmPop"
                                    }],
                                    scope: {
                                        fConfirmPop: function() {
                                            l._httpGetAll(function() {
                                                n.closeAll()
                                            })
                                        },
                                        fCancelPop: function() {
                                            n.closeAll(),
                                                window.open(YouPreset.DOCS_SECURITY_PAYMENT, "_blank")
                                        }
                                    }
                                }),
                                window.open(YouPreset.OFFICIAL_WEBSITE_BUY_SECURITY, "_blank")
                        }
                    }
                })
            },
            t.paymentIntroduce = function(e) {
                var i = [];
                e.client_side_transaction_flow && (i = e.client_side_transaction_flow.split("\n").map(function(t) {
                        return t.slice(7)
                    })),
                    n.modal({
                        contentextclass: "payment-modal",
                        initModel: {
                            YouPreset: YouPreset,
                            item: e,
                            aBusinessProcess: i,
                            doc_domain: t.data.doc_domain
                        },
                        notpreventDefault: !0,
                        title: "介绍",
                        content: '<span class="payment-modal-title-link" style="top: -38px;right: 63px;"> <a href="{{doc_domain}}/{{item.api_url}}" class="text-link" target="_blank">帮助文档</a></span><h4 class="patment-introduce-name">{{ item.name }}:</h4><p class="patment-introduce-details">{{ item.details }}</p><div class="payment-introduce-content" style="padding-bottom: 20px; padding-top: 25px;"><ul><li><span class="title">应用场景：</span><span class="des payment-item-scene" ng-bind-html="item.browser_scene_icon"></span></li><li><span class="title">费率：</span><span class="des">{{ item.fee_ratio  ? item.fee_ratio : "-"  }}</span></li><li><span class="title">币种：</span><span class="des" title="人民币" ng-show="item.currency.length == 1 && item.currency[0] == \'CNY\'">人民币</span><span class="des" title="多币种" ng-hide="item.currency.length == 1 && item.currency[0] == \'CNY\'">多币种</span></li><li><span class="title">C端交易流程：</span><span class="des"> <span ng-if="aBusinessProcess.length === 0">-</span><ul class="business-process" ng-if="aBusinessProcess.length > 0">  <li ng-repeat=" i in aBusinessProcess" > {{ i }}</li></ul></li><li><span class="title">结算：</span><span class="des">{{ item.settlement_description || "-"}}</span></li></ul></div>',
                        btn: [{
                            type: "primary",
                            text: "知道了",
                            click: "fCancelPop"
                        }],
                        scope: {
                            fCancelPop: function() {
                                n.close()
                            }
                        }
                    })
            },
            t.paymentUse = function(e) {
                if ("free" == t.YouLevel.LEVEL || "level1" == t.YouLevel.LEVEL) {
                    var i = t.YouLevel.FUNCTION_LIMIT_WARNING_PAID.replace(/{LEVEL_TEXT}/, t.YouLevel.LEVEL_TEXT).replace(/{nameCN}/g, e.name + "自主配置");
                    return void n.modal({
                        title: "提示",
                        content: i,
                        btn: [{
                            type: "default",
                            text: "确定",
                            click: "cancelPop"
                        }, {
                            type: "primary",
                            text: "升级版本",
                            click: "upgrade"
                        }],
                        scope: {
                            cancelPop: function() {
                                n.closeAll()
                            },
                            upgrade: function() {
                                n.upgradePlan()
                            }
                        }
                    })
                }
                l._modalSingleOption(e)
            },
            t.setActive = function(t, e) {
                e ? l.setActive(e, t.id, t.name,
                    function() {
                        t.is_actived = e
                    },
                    function() {}) : n.modal({
                    notpreventDefault: !0,
                    forceMask: !0,
                    title: "提示",
                    content: "确定停用【" + t.name + "】收款方式？停用后网站将无法使用该支付方式进行收款。",
                    btn: [{
                        text: "取消",
                        click: "cancel"
                    }, {
                        type: "danger",
                        text: "停用",
                        click: "confirm"
                    }],
                    scope: {
                        cancel: function() {
                            n.close()
                        },
                        confirm: function() {
                            l.setActive(e, t.id, t.name,
                                function() {
                                    t.is_actived = e
                                },
                                function() {})
                        }
                    }
                })
            },
            t.setCertification = function() {
                i.setQuery("certification")
            },
            t.dataGlobalGuideEmpty = {
                type: "payment",
                tittle: "收款方式",
                des: "让网站开始收款，支付宝 / 微信支付等20多个第三方支付平台随意开启",
                showbtn: !0,
                btnname: "去实名认证，才能开通",
                btnfunction: t.setCertification
            }
    },
    reformData: function(t) {
        var e = {
            active: [],
            noactive: []
        };
        return _.forEach(t,
                function(t, n) {
                    var i = "active";
                    t.is_actived || (i = "noactive"),
                        e[i].push(t)
                }),
            e
    },
    _httpGetAll: function(t) {
        var e = this,
            n = this._$Uri,
            i = this._$scope,
            a = this._$sce;
        n.get("paymentMethod_getAll", {},
            function(r) {
                if (200 == r.code) {
                    var s = r.data.payment_methods;
                    _.forEach(s,
                            function(t) {
                                t.browser_scene_desc = "";
                                var e = -1 != t.browser_scene.indexOf("pc"),
                                    n = -1 != t.browser_scene.indexOf("mobile"),
                                    i = -1 != t.browser_scene.indexOf("weixin");
                                t.browser_scene_icon = a.trustAsHtml('<span class="iconfont icon-pay-pc' + (e ? "" : " disabled") + '"></span><span class="iconfont icon-pay-phone' + (n ? "" : " disabled") + '"></span><span class="iconfont icon-pay-weixin' + (i ? "" : " disabled") + '"></span>');
                                var r = [],
                                    s = [];
                                (e ? r : s).push("PC端"),
                                    (n ? r : s).push("移动端"),
                                    (i ? r : s).push("微信端"),
                                    t.browser_scene_desc = "支持" + r.join("、") + (s.length ? "，不支持" : "") + s.join("、")
                            }),
                        i.data = {
                            security_deposit_charged: r.data.security_deposit_charged,
                            doc_domain: r.data.doc_domain,
                            payment_method: e.reformData(s)
                        },
                        n.get("store_certification_check", {},
                            function(e) {
                                200 === e.code && (i.certification = e.data.store_certification, t && t())
                            })
                }
            })
    },
    _httpGetSingle: function(t, e) {
        this._$Uri.get("paymentMethod_getSingle", {
                id: t.id
            },
            function(t) {
                200 == t.code && e(t.data.payment_method)
            })
    },
    _httpGetBanks: function(t, e) {
        this._$Uri.get("backCode_getAll", {
                pay_type: t.pay_type
            },
            function(t) {
                200 == t.code && e && e(t.data.bank_codes)
            })
    },
    onCloseMultiOptionChildren: function() {
        this._$Popup.closeAll()
    },
    _modalSingleOption: function(t, e) {
        e = e || 0;
        var n = this,
            i = this._$Popup;
        i.modal({
                title: YouText.PAYMENT_SETTING_MODAL_TITLE.replace("{x}", t.name),
                content: YouText.POPUP_MODAL_LOADING
            }),
            n._httpGetSingle(t,
                function(e) {
                    n.paymentItemApiUrl = t.api_url,
                        n.paymentItemWebsite = _.find(YouPreset.PAYMENT_METHODS_WEBSITE, {
                        type: t.pay_type.split("_")[0]
                    });
                    var a = function() {
                        i.closeSp(),
                            e.is_config ? e.pass_test ? n._modalActive(e) : n._modalTestFail(e) : n._modalConfig(e)
                    };
                    "alipay_bank" == e.pay_type || "tenpay_bank" == e.pay_type ? n._httpGetBanks(e,
                        function(t) {n._paymentBanks = t,a()}) : (n._paymentBanks = null, a())
                })
    },
    _formatSettings: function(t) {
        if (null == t.setting_keys) return [];
        null !== t.setting_keys && null === t.setting_values && (t.setting_values = "");
        var e = [],
            n = t.setting_keys.split("|"),
            i = t.setting_chs_keys.split("|"),
            a = t.setting_values.split("|");
        return _.forEach(n,
                function(n, r) {
                    var s = {
                        name: n,
                        label: i[r],
                        value: a[r]
                    };
                    "wppay" !== t.pay_type && "wppay_app" !== t.pay_type || ("wp_pk12" === n && (s.value = t.wp_pk12, s.isFile = !0, s.saveField = "wppay_key_file"), "wppay_key_secret" === n && (s.value = t.wppay_key_secret, s.saveField = "password")),
                        "unionpay" === t.pay_type && ("privatePfx" === n && (s.isFile = !0, s.saveField = "private_key_file"), "publicCer" === n && (s.isFile = !0, s.saveField = "public_key_file"), "merId" === n && (s.saveField = "mer_id"), "privatePassword" === n && (s.saveField = "private_password")),
                        "dinpay" === t.pay_type && ("merchant_code" === n && (s.saveField = "merchant_code"), "dinpay_public_key" === n && (s.saveField = "dinpay_public_key"), "public_key" === n && (s.noPost = !0)),
                        e.push(s)
                }),
            e
    },
    _modalConfig: function(t) {
        var e = this,
            n = this._$Uri,
            i = this._$Popup,
            a = (this._$timeout, this._$util, this._$scope),
            r = this._formatSettings(t),
            s = "";
        "wppay" == t.pay_type || "wppay_app" == t.pay_type ? s += '<div ng-repeat="i in settings" ng-switch="i.name"><div style="margin: 5px 0;">{{i.label}}</div><div ng-switch-when="wp_pk12" class="payment-modal-certificate"><span>状态：{{i.value === false ? "未上传" : "已上传"}}</span><div class="btn-upload-wrap"><a class="text-link">{{i.value === false ? "上传证书" : "重新上传证书"}}</a><input type="file" accept="application/x-pkcs12" onchange="angular.element(this).scope().uploadCertificate(this)"></div></div><input ng-switch-when="wppay_key_secret" type="text" class="input input-long" placeholder="请输入{{i.label}}，证书默认密码为商户号" ng-model="i.value"><input ng-switch-default type="text" class="input input-long" placeholder="请输入{{i.label}}" ng-model="i.value" name="input_{{$index}}" you-validation="required"></div><div class="text-muted" style="margin-top: 10px;">备注：API证书和证书密码是微信退款必不可少的两大信息，若不配置，则在退单后无法进行在线退款。商家可根据自身情况选择配置。</div>' : "unionpay" == t.pay_type ? s += '<div ng-repeat="i in settings"><div style="margin: 5px 0;">{{i.label}}</div><div ng-if="i.name == \'privatePfx\' || i.name == \'publicCer\'" class="payment-modal-certificate"><span>{{checkIsFile(i.value) ? "已上传" : "未上传"}}</span><div class="btn-upload-wrap"><a class="text-link">{{checkIsFile(i.value) ? "重新上传" : "上传"}}</a><input type="file" accept="{{i.name == \'privatePfx\' ? \'.pfx\' : \'.cer\'}}" onchange="angular.element(this).scope().uploadCertificate(this, true)"></div><div style="position: relative; left: 70px; top: -5px;"><input style="display: none" name="{{i.name}}" you-validation/></div></div><input ng-if="i.name != \'privatePfx\' && i.name != \'publicCer\'" type="text" class="input input-long" placeholder="请输入{{i.label}}" ng-model="i.value" name="input_{{$index}}" you-validation="required"></div>' : "dinpay" == t.pay_type ? s += '<div ng-repeat="i in settings" ng-switch="i.name"><div style="margin: 5px 0;">{{i.label}}</div><input ng-if="i.name != \'public_key\'" type="text" class="input input-long" placeholder="请输入{{i.label}}" ng-model="i.value" name="input_{{$index}}" you-validation="required"/><textarea ng-if="i.name == \'public_key\'" class="input input-long" readonly>{{ i.value }} </textarea></div>' : "tenpay" == t.pay_type ? s += '<div ng-repeat="i in settings"><div style="margin: 5px 0;">{{i.label}}</div><input ng-if="i.name != \'key\'" type="text" class="input input-long" placeholder="请输入{{i.label}}" ng-model="i.value" name="input_{{$index}}" you-validation="required"><input ng-if="i.name == \'key\'" type="text" class="input input-long" placeholder="请输入32位密钥" ng-model="i.value" name="input_{{$index}}" you-validation="required|lengthExact(32)"></div>' : s += '<div ng-repeat="i in settings"><div style="margin: 5px 0;">{{i.label}}</div><input type="text" class="input input-long" placeholder="请输入{{i.label}}" ng-model="i.value" name="input_{{$index}}" you-validation="required"></div>';
        i.modal({
            contentextclass: "payment-modal",
            notpreventDefault: !0,
            title: YouText.PAYMENT_SETTING_MODAL_TITLE.replace("{x}", t.name),
            content: '<span class="payment-modal-title-link"><a href="' + a.data.doc_domain + "/" + e.paymentItemApiUrl + '" class="text-link" target="_blank">如何配置并启用</a>' + (e.paymentItemWebsite ? '<a href="' + e.paymentItemWebsite.url + '" class="text-link" target="_blank">登录' + e.paymentItemWebsite.name + "</a>" : "") + '</span><div style="padding-bottom: 20px">' + s + "</div>",
            btn: [{
                type: "loading",
                hide: !0
            }, {
                type: "default",
                text: YouText.POPUP_MODAL_BTN_CANCEL,
                click: "cancel"
            }, {
                type: "primary",
                text: YouText.PAYMENT_CONFIG_SAVE,
                click: "save"
            }],
            onClose: function() {
                e.onCloseMultiOptionChildren()
            },
            scope: {
                cancel: function() {
                    e.onCloseMultiOptionChildren()
                },
                save: function(a, s) {
                    var o = {
                            id: t.id,
                            pay_type: t.pay_type
                        },
                        l = !1,
                        d = [];
                    _.forEach(r,
                        function(t, e) {
                            d.push("input_" + e)
                        });
                    var u = a.validation.validate(d);
                    if ("unionpay" === t.pay_type && _.forEach(r,
                            function(t) {
                                "privatePfx" !== t.name && "publicCer" !== t.name || a.checkIsFile(t.value) || (a.validation.toggle(t.name, !0, "请上传文件"), u = !1)
                            }), !u) return void(s.save = !1);
                    s.data.btn[0].hide = !1,
                        s.data.btn[1].hide = !0,
                        s.data.btn[2].hide = !0;
                    var m = [];
                    _.forEach(r,
                            function(t) {
                                t.saveField ? (t.isFile ? a.checkIsFile(t.value) && (o[t.saveField] = t.value, l = !0) : o[t.saveField] = t.value, m.push("")) : t.noPost ? m.push("") : m.push(t.value)
                            }),
                        o.setting_values = m.join("|");
                    var h = l ? "formData" : "";
                    n.post("paymentMethod_saveConfig", o,
                        function(n) {
                            200 == n.code && e._httpGetSingle(t,
                                function(t) {
                                    i.closeSp(),
                                        i.info({
                                            text: YouText.POPUP_INFO_SAVE_SUCCESS.replace("{x}", t.name)
                                        }),
                                        e._modalTestBefore(t)
                                })
                        }, {
                            sendType: h,
                            errorCallback: function(t) {
                                if (201 == t.code && t.msg.desc && t.msg.desc.indexOf("API证书和证书密码不匹配") > -1) {
                                    this.preventDefaultCall = !0;
                                    var e = p.
                                    default.DOCS_HELP_PAYMENT_WEIXIN_API_CERT;
                                    i.closeAll(),
                                        i.modal({
                                            title: "校验失败",
                                            content: 'API证书和证书密码不匹配，请参照<a href="' + e + '" target="_blank" class="text-link">使用手册</a>重新修改。',
                                            btn: [{
                                                type: "primary",
                                                text: "确定",
                                                click: "closePop"
                                            }],
                                            scope: {
                                                closePop: function() {
                                                    i.close()
                                                }
                                            },
                                            forceMask: !0,
                                            notpreventDefault: !0
                                        })
                                }
                            }
                        })
                }
            },
            initModel: {
                validation: {},
                settings: r,
                checkIsFile: function(t) {
                    return t instanceof File
                },
                uploadCertificate: function(t, e) {
                    var n = this.$parent;
                    if (e) {
                        var i = n.i.name;
                        n.validation.toggle(i, !1)
                    }
                    n.i.value = t.files[0],
                        n.$apply()
                }
            }
        })
    },
    _modalTestBefore: function(t) {
        var e = this,
            n = this._$scope,
            i = this._$Popup,
            a = this._$util,
            s = this._$timeout,
            o = function(t) {
                return /^(http|https):\/\/(.+)/g.exec(t)[2]
            };
        if (t.pass_test) e._modalActive(t);
        else if (t.collect_by_yhsd || "wppay" != t.pay_type) e._modalTestFail(t);
        else {
            var l = i.modal({
                notpreventDefault: !0,
                title: t.name,
                content: '<div><div>接下来，请参照<a class="text-link" href="' + n.data.doc_domain + "/" + e.paymentItemApiUrl + '" target="_blank">《微信支付配置文档》</a>，前往 <a class="text-link" href="https://pay.weixin.qq.com/" target="_blank">微信商户平台</a>，配置以下信息：</div><div style="margin-top: 10px;margin-bottom: 5px;">公众号支付 - 支付授权目录：</div><div class="input-group"><span class="input-group-addon" style="border-color: #ddd;">https://</span><input class="input input-long" style="line-height: 25px;border-radius: 0;" type="text" ng-model="wp_js_url_show" readonly="readonly" /><span class="input-group-addon input-group-addon-end" style="border-color: #ddd;"><you-btn type="simple2" text="复制" data-role="copy-btn" data-copy-model="wp_js_url_show"></you-btn></span></div><div style="margin-top: 10px;margin-bottom: 5px;">扫码支付 - 支付回调URL：</div><div class="input-group"><span class="input-group-addon" style="border-color: #ddd;">https://</span><input class="input input-long" style="line-height: 25px;border-radius: 0;" type="text" ng-model="wp_native_url_show" readonly="readonly" /><span class="input-group-addon input-group-addon-end" style="border-color: #ddd;"><you-btn type="simple2" text="复制" data-role="copy-btn" data-copy-model="wp_native_url_show"></you-btn></span></div><div style="margin-top: 10px;"><span class="ico ico-status-warn-s"></span> 支付授权目录必须选择https</div><div class="payment-multi-item-tips"></div></div>',
                btn: [{
                    text: "上一步",
                    click: "prev"
                }, {
                    type: "primary",
                    text: "已填好，进入下一步",
                    click: "next"
                }],
                initModel: {
                    item: t,
                    wp_js_url_show: o(t.wp_js_url),
                    wp_native_url_show: o(t.wp_native_url)
                },
                onClose: function() {
                    e.onCloseMultiOptionChildren()
                },
                scope: {
                    prev: function() {
                        i.closeSp(),
                            e._modalConfig(t)
                    },
                    next: function() {
                        i.closeSp(),
                            e._modalTestFail(t)
                    }
                }
            });
            s(function() {
                (0, r.default)('[data-role="copy-btn"]').each(function() {
                    var t = (0, r.default)(this).data("copy-model");
                    a.setClipboard(this, {
                        scope: l.$$childHead.$$childHead,
                        text: function() {
                            return t.split(".").reduce(function(t, e) {
                                    return t[e]
                                },
                                l.$$childHead.$$childHead)
                        }
                    })
                })
            })
        }
    },
    _modalTestFail: function(t) {
        var e = this,
            n = this._$Uri,
            i = this._$Popup,
            a = this._$scope,
            r = t.collect_by_youdian ? "payment_method_check_ali_validate" : "paymentMethod_checkTest",
            s = t.collect_by_youdian ? "payment_method_go_ali_validate" : "paymentMethod_goTest",
            o = t.collect_by_youdian ? YouText.PAYMENT_TESTYHSD_FAIL_DESC:YouText.PAYMENT_TEST_FAIL_DESC,
            l = t.collect_by_youdian ? YouText.PAYMENT_TESTYHSD_FAIL_STATE:YouText.PAYMENT_TEST_FAIL_STATE,
            c = t.collect_by_youdian ? YouText.PAYMENT_TESTYHSD_GO:YouText.PAYMENT_TEST_GO,
            d = t.collect_by_youdian ? YouText.PAYMENT_TESTYHSD_NEXT:
            YouText.PAYMENT_TEST_NEXT;
        "alipay_forex" !== t.pay_type && "alipay_mforex" !== t.pay_type || (o = YouText.PAYMENT_TEST_ALIPAY_FOREX_FAIL_DESC);
        var u, p = !1,
            m = function a() {
                p || n.post(r, {id: t.id},
                    function(n) {
                        200 == n.code && (n.data.done ? (i.closeSp(), e._modalTestSuccess(t)) : setTimeout(a, 1e3))
                    })
            },
            h = e._paymentBanks ? e._paymentBanks[0].id : null,
            g = {
                contentextclass: "payment-modal",
                notpreventDefault: !0,
                title: YouText.PAYMENT_SETTING_MODAL_TITLE.replace("{x}", t.name),
                content: '<span class="payment-modal-title-link"><a href="' + a.data.doc_domain + "/" + e.paymentItemApiUrl + '" class="text-link" target="_blank">如何配置并启用</a>' + (e.paymentItemWebsite ? '<a href="' + e.paymentItemWebsite.url + '" class="text-link" target="_blank">登录' + e.paymentItemWebsite.name + "</a>" : "") + '</span><div class="payment-setting"><div class="payment-test-fail-desc">' + o + '</div><div class="payment-test-state payment-test-fail-state">' + l + '</div><div ng-if="banks && !youdianPay"><div class="payment-test-select-bank"><div class="t-type"><span class="ico ico-payment-method ico-payment-method-small ico-payment-' + t.pay_type + '"></span></div><div class="t-select"><select class="input-select" ng-model="bank" ng-change="onChangeBank(bank)"><option ng-repeat="i in banks" ng-value="{{i.id}}">{{i.name}}</option></select></div></div></div></div>',
                btn: [{
                    type: "loading"
                }, {
                    type: "primary",
                    text: c,
                    click: "test",
                    hide: !0
                }, {
                    type: "default",
                    text: YouText.PAYMENT_TEST_BACK,
                    click: "pre"
                }, {
                    type: "primary",
                    text: d,
                    disabled: !0
                }],
                scope: {
                    test: function(t, e) {
                        e.test = !1,
                            window.open(u),
                            m()
                    },
                    pre: function() {
                        p = !0,
                            i.closeSp(),
                            e._modalConfig(t)
                    }
                },
                initModel: {
                    banks: e._paymentBanks,
                    bank: h,
                    youdianPay: t.collect_by_youdian,
                    onChangeBank: function(e) {
                        g.btn[0].hide = !1,
                            g.btn[1].hide = !0,
                            h = e,
                            n.post(s, {id: t.id,bank_code_id: h}, function(t) {
                                    g.btn[0].hide = !0,
                                    g.btn[1].hide = !1,
                                    u = t.data.url
                            })
                    }
                },
                onClose: function() {
                    p = !0,e.onCloseMultiOptionChildren()
                }
            };
        i.modal(g),
            n.post(s, {id: t.id,bank_code_id: h},function(n) {
                    n.data.url || ("配置成功" === n.message ? (i.closeAll(), e._modalActive(t)) : g.btn[1].disabled = !0),
                        g.btn[0].hide = !0,
                        g.btn[1].hide = !1,
                        u = n.data.url
                })
    },
    _modalTestSuccess: function(t) {
        var e = this,
            n = this._$Popup,
            i = t.collect_by_youdian ? YouText.PAYMENT_TESTYHSD_NEXT:YouText.PAYMENT_TEST_NEXT,
            a = t.collect_by_youdian ? YouText.PAYMENT_TESTYHSD_SUCCESS_STATE:YouText.PAYMENT_TEST_SUCCESS_STATE,
            r = t.collect_by_youdian ? YouText.PAYMENT_TESTYHSD_SUCCESS_DESC:YouText.PAYMENT_TEST_SUCCESS_DESC;
        n.modal({
            title: YouText.PAYMENT_SETTING_MODAL_TITLE.replace("{x}", t.name),
            content: '<div class="payment-setting"><div class="payment-test-state payment-test-success-state">' + a + '</div><div class="payment-test-success-desc">' + r + "</div></div>",
            btn: [{
                type: "default",
                text: YouText.PAYMENT_TEST_BACK,
                disabled: !0
            }, {
                type: "primary",
                text: i,
                click: "next"
            }],
            onClose: function() {
                e.onCloseMultiOptionChildren()
            },
            scope: {
                next: function() {
                    n.closeSp(),
                    e._modalActive(t)
                }
            }
        })
    },
    setActive: function(t, e, n, i, a) {
        function r() {
            var r, c;
            t ? (r = "paymentMethod_active", c = YouText.PAYMENT_ACTIVE) :
                (r = "paymentMethod_unactive", c = YouText.PAYMENT_ACTIVE),
                l.post(r, {
                        id: e
                    },
                    function(t) {
                        200 == t.code ? s._httpGetAll(function() {
                            i && i(),
                                a && a(),
                                o.closeAll(),
                                o.info({text: c + " " + n}, !0)
                        }) : a && a()
                    })
        }
        var s = this,
            o = this._$Popup,
            l = (this.$scope, this._$Uri);
        t ? l.post("paymentMethod_checkActive", {
                id: e
            },
            function(t) {
                t && 200 == t.code && (t.msg.err_content ? o.modal({
                    forceMask: !0,
                    title: t.msg.err_title,
                    content: t.msg.err_content,
                    btn: [{
                        type: "primary",
                        text: "知道了",
                        click: "confirm"
                    }],
                    scope: {
                        confirm: function() {
                            o.close(),
                                a && a()
                        }
                    }
                }) : r())
            }) : r()
    },
    _modalActive: function(t) {
        var e, n = this,
            i = this._$Uri,
            a = this._$Popup,
            r = this.$scope,
            s = this._formatSettings(t),
            o = function(e, i, a) {
                i.data.btn[0].hide = !1,
                    i.data.btn[1].hide = !0,
                    i.data.btn[2].hide = !0,
                    n.setActive(e, t.id, t.name,
                        function() {
                            a.item.is_actived = e,
                                n.multiOptionDataSub && (n.multiOptionDataSub.is_actived = e),
                                i.data.btn[1].disabled = !0,
                                i.data.btn[2].disabled = !0,
                                e ? i.data.btn[1].disabled = !1 : i.data.btn[2].disabled = !1
                        },
                        function() {
                            i.inactive = !1,
                                i.active = !1,
                                i.data.btn[0].hide = !0,
                                i.data.btn[1].hide = !1,
                                i.data.btn[2].hide = !1
                        })
            };
        "wppay" != t.pay_type && "wppay_app" != t.pay_type || (e = _.find(s, {
                name: "wp_pk12"
            })) && (e.value = e.value ? "已上传" : "未上传"),
            "unionpay" == t.pay_type && _.forEach(s,
                function(t) {
                    "privatePfx" !== t.name && "publicCer" !== t.name || (t.value = "true" === t.value ? "已上传" : "未上传")
                }),
            "dinpay" == t.pay_type && (e =_.find(s, {
                name: "public_key"
            })) && (e.canCopy = !0),
            function() {
                a.modal({
                    contentextclass: "payment-modal",
                    notpreventDefault: !0,
                    title: YouText.PAYMENT_SETTING_MODAL_TITLE.replace("{x}", t.name),
                    content: '<span class="payment-modal-title-link"><a href="' + r.data.doc_domain + "/" + n.paymentItemApiUrl + '" class="text-link" target="_blank">如何配置并启用</a>' + (n.paymentItemWebsite ? '<a href="' + n.paymentItemWebsite.url + '" class="text-link" target="_blank">登录' + n.paymentItemWebsite.name + "</a>" : "") + '</span><div class="payment-setting"><div class="payment-active-account"><div ng-class="{\'payment-active-account-item\': true, \'payment-active-account-long-item\': (item.name == \'Paypal\')}" ng-repeat="i in settings"><div class="t-k">{{i.label}}：</div><div class="t-v"><span title="{{i.value}}" ng-hide="i.canCopy">{{i.value}}</span><div ng-show="i.canCopy" style="padding-right: 20px;"><textarea class="input input-long" readonly>{{ i.value }}</textarea></div></div></div><div class="clearfix"></div><div class="t-mark" ng-show="item.is_actived"><svg width="55" height="55"><polygon points="0,0 55,0 0,55" style="fill:#4499dd;"/></svg><span class="t-text">' 
                    +
                    YouText.PAYMENT_ACTIVE + '</span></div><div style="text-align: center" ng-if="item.pay_type == \'offline\'"><span class="ico ico-payment-method ico-payment-{{ item.pay_type }}"></span></div></div><div class="payment-active-reset" ng-if="item.pay_type != \'offline\'"><you-btn text="' 
                    + YouText.PAYMENT_RESET + '" ng-disabled="item.is_actived" ng-click="onReset()"></you-btn><span>' + YouText.default.PAYMENT_RESET_DESC + '</span></div><div ng-if="item.pay_type == \'offline\'" class="text-muted" style="padding-top: 10px;"><div>1. 需要和支持货到付款的运费模板配合使用；</div><div>2. 收款方式可用于物流公司货到付款、商家配送和顾客到店消费的情况。</div></div></div>',
                    btn: [{
                        type: "loading",
                        hide: !0
                    }, {
                        type: "danger",
                        text: YouText.PAYMENT_MAKE_INACTIVE,
                        click: "inactive",
                        disabled: !t.is_actived
                    }, {
                        type: "primary",
                        text: YouText.PAYMENT_MAKE_ACTIVE,
                        click: "active",
                        disabled: t.is_actived
                    }],
                    onClose: function() {
                        n.onCloseMultiOptionChildren()
                    },
                    scope: {
                        inactive: function(t, e) {
                            o(!1, e, t)
                        },
                        active: function(t, e) {
                            o(!0, e, t)
                        }
                    },
                    initModel: {
                        item: t,
                        settings: s,
                        onReset: function() {
                            a.closeSp(),
                                a.modalSimple({
                                    type: "danger",
                                    action: YouText.PAYMENT_RESET,
                                    name: t.name,
                                    onConfirm: function() {
                                        i.post("paymentMethod_resetConfig", {
                                                id: t.id
                                            },
                                            function(e) {
                                                200 == e.code && n._httpGetAll(function() {
                                                    n._httpGetSingle(t,
                                                        function(t) {
                                                            a.closeSp(),
                                                                n._modalConfig(t)
                                                        })
                                                })
                                            })
                                    },
                                    onCancel: function() {
                                        a.closeSp(),
                                            n._modalActive(t)
                                    },
                                    onClose: function() {
                                        a.closeSp(),
                                            n._modalActive(t)
                                    }
                                })
                        }
                    }
                })
            }()
    },
    checkIdentityCard: function(t) {
        function e(t) {
            var e = 0;
            "x" == t[17].toLowerCase() && (t[17] = 10);
            for (var n = 0; n < 17; n++) e += r[n] * t[n];
            var i = e % 11;
            return t[17] == s[i]
        }

        function n(t) {
            var e = t.substring(6, 10),
                n = t.substring(10, 12),
                i = t.substring(12, 14),
                a = new Date(e, parseFloat(n) - 1, parseFloat(i));
            return a.getFullYear() == parseFloat(e) && a.getMonth() == parseFloat(n) - 1 && a.getDate() == parseFloat(i)
        }

        function i(t) {
            var e = t.substring(6, 8),
                n = t.substring(8, 10),
                i = t.substring(10, 12),
                a = new Date(e, parseFloat(n) - 1, parseFloat(i));
            return a.getYear() == parseFloat(e) && a.getMonth() == parseFloat(n) - 1 && a.getDate() == parseFloat(i)
        }

        function a(t) {
            return t.replace(/(^\s*)|(\s*$)/g, "")
        }
        var r = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1],
            s = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
        return function(t) {
            if (t = a(t.replace(/ /g, "")), 15 == t.length) return i(t);
            if (18 == t.length) {
                var r = t.split("");
                return !(!n(t) || !e(r))
            }
            return !1
        }(t)
    }
});

PaymentController.$inject = ["$scope", "$rootScope", "$Popup", "$Uri", "$sce", "$timeout", "$Util"];
