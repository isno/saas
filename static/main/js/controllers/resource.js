var ResourceController = BaseController.extend({
    init: function (e, t, i, n, a, o, s, r) {
        this._super(e), this._scope = e, n.loading(!0), e.YeeLevel = window.YeeLevel, e.showSetting = {
            opacity: "0"
        }, 
        e.YeePreset = YeePreset, 
        e.isOwner = t.YeeshopManagerConf.isOwner, 
        e.shop = {
            name: t.YeeshopManagerConf.shopName,
            hostname: URI(t.YeeshopManagerConf.shopUrl).hostname(),
            certStatus: t.YeeshopManagerConf.store_cert_status,
            certType: t.YeeshopManagerConf.store_cert_type - 0 == 0 ? "个人认证" : "企业认证",
        },
        o.get();
        e.tabData = [{
            value: "source",
            text: "资源详情"
        }, {
            value: "expense",
            text: "消费明细"
        }], 
        e.currentTab = e.tabData[0], 
        e.switchTab = function (t) {
            e.currentTab = t
        };
        var l = function () {
                return i.get("version_infoNew", !1, function (t) {
                    e.generalInfo = t.msg;
                    var i = t.msg,
                        a = t.msg.order,
                        o = t.msg.email,
                        s = t.msg.service,
                        r = t.msg.sms;
                    i.order = a, 
                    i.email = o, 
                    i.service = s, 
                    i.sms = r, 
                    c(i), 
                    n.loading(!1), 
                    e.showSetting = {
                        opacity: "1"
                    }
                })
            },
            c = function (t) {
                var i = new Date(t.service.expired_at.replace(/-/g, "/"));
                i = moment(i).format("YYYY-MM-DD");
                var n = i.split("-");
                e.startDay = n[n.length - 1], 
                e.levelname = t.level_name, 
                e.level_code = t.level_code, 
                e.expires_at = i, 
                e.bInvoiceRight = t.invoice, 
                e.success_trades = t.success_trades;
                var o = (t.service.module_level, t.service.remaining_date),
                    r = "";
                e.YeeLevel.LEVEL_GRADE > 0 && (o >= 1 && o <= 15 ? r = "将于" + o + "天后到期" : 0 === o ? r = "网站将于明天到期" : o < 0 && (r = "网站已过期")), e.expire_text = r;
                var l = {
                        width: "0"
                    },
                    c = function (e) {
                        var t = e + "B",
                            i = e / 1024,
                            n = i / 1024,
                            a = n / 1024;
                        return i > 1 && (t = Math.floor(100 * i) / 100 + "KB", n > 1 && (t = Math.floor(100 * n) / 100 + "M", a > 1 && (t = Math.floor(100 * a) / 100 + "G"))), t
                    };
                e.storageStatus = "", 
                e.storageLimit = c(t.storage.limit), 
                e.storageUsed = c(t.storage.used), 
                e.storagePercent = Math.floor(t.storage.used / t.storage.limit * 100);
                var d = {
                    width: e.storagePercent + "%"
                };
                if (e.storagePercentStyle = l, e.storagePercent > 80 && (e.storageStatus = "setting-limit-warn", e.storagePercent > 99 && (e.storageStatus = "setting-limit-err")), a(function () {
                    e.storagePercentStyle = d
                }, 300), e.stats2 = _.clone(YeePreset.STAT_TOP_2_VERSION), _.forEach(e.stats2, function (t) {
                    t.data = e.generalInfo[t.tag], t.data.remainingDaysForecast = t.data.daily_recommended_email_count > 0 ? "每天大约使用" + t.data.daily_recommended_email_count + t.unit + ", 当前剩余大约还能支撑" + Math.floor(t.data.avail / t.data.daily_recommended_email_count) + "天" : ""
                }), 
                e.YeeLevel.MULTIMEDIA_ENABLE) {
                    var p = {
                        CN: {
                            flow: "流量",
                            space: "空间"
                        },
                        tip: {
                            flow: "价格：#{cost} 元/GB，月底结算后，流量和费用将清零重计",
                            space: "价格：#{cost} 元/GB，月底结算后，多媒体空间费用将清零重计"
                        }
                    };
                    if (t.qiniu = t.qiniu || {}, e.media_not_applied = void 0 === t.qiniu.status || [0, 1, 3].some(function (e) {
                        return t.qiniu.status === e
                    }), e.media_is_applying = [0, 1].indexOf(t.qiniu.status) > -1, e.stats_media = ["flow", "space"].map(function (e) {
                        var i = YeePreset["MULTIMEDIA_" + e.toUpperCase() + "_COST_FEN_PER_GB"];
                        return {
                            tag: e,
                            tagCn: p.CN[e],
                            GB: "number" == typeof t.qiniu[e] ? s.getStorageGB(t.qiniu[e]) : "--",
                            cost: i,
                            amount: "number" == typeof t.qiniu[e] ? s.yuan(Math.round(t.qiniu[e] / 1024 / 1024 / 1024 * i)) : " --",
                            tip: p.tip[e].replace(/#{cost}/, s.yuan(i))
                        }
                    }), 4 === t.qiniu.status) e.media_warning_stat = 2;
                    else if (2 === t.qiniu.status && "number" == typeof t.qiniu.flow && "number" == typeof t.qiniu.space) {
                        var u = ["flow", "space"].map(function (e) {
                            return Math.round(t.qiniu[e] / 1024 / 1024 / 1024 * YeePreset["MULTIMEDIA_" + e.toUpperCase() + "_COST_FEN_PER_GB"])
                        }).reduce(function (e, t) {
                            return e + t
                        });
                        u > t.qiniu.finance && (e.media_warning_stat = 1)
                    }
                }
                var m = [];
                e.YeeLevel.MULTIMEDIA_ENABLE || m.push({
                    tag: "space",
                    tagCn: "多媒体服务",
                    desc: "对视频/音频资源进行管理和设置，当前版本不支持该服务"
                }), ["product", "page", "page_block", "blog", "post"].forEach(function (e) {
                    if (t[e]) {
                        var i = angular.copy(YeePreset.STAT_TOP_2.filter(function (t) {
                            if (t.tag === e) return !0
                        })[0]);
                        i.data = t[e], m.push(i)
                    }
                }), e.limitedStat = m
            };
        e.buyOES = function () {
            n.modal({
                title: "购买提示",
                content: e.levelname + "不可购买订单、短信、邮件额度。 网站升级为正式版或起航版才可购买。",
                btn: [{
                    text: "取消",
                    type: "default",
                    click: "cancelBuy"
                }, {
                    text: "升级网站",
                    type: "primary",
                    click: "updateShop"
                }],
                scope: e
            })
        }, 
        e.cancelBuy = function () {
            n.close()
        }, 
        e.updateShop = function () {
            window.open(YeePreset.OFFICIAL_WEBSITE_BUY_UPGRADE, "_blank"), n.close()
        }, 
        e.goBack = function () {
            i.historyBackCached()
        }, 
        l(), 
        e.onSetLimitBound = function (e) {
            n.modal({
                title: "预警设置",
                content: '当通知{{tagCn}} < <input class="input" style="width: 70px;" ng-model="alarm_bound" ys-validation="required|integer"> {{unit}}时，发送短信和邮件通知管理员充值。',
                initModel: {
                    alarm_bound: e.data.alarm_bound,
                    unit: e.unit,
                    tagCn: e.tagCn
                },
                btn: [{
                    type: "loading",
                    hide: !0
                }, {
                    text: "取消",
                    type: "default",
                    click: "onClickClose"
                }, {
                    text: "确定",
                    type: "primary",
                    click: "onConfirm"
                }],
                scope: {
                    onClickClose: function () {
                        n.close()
                    }, onConfirm: function (t, a) {
                        if (!t.validation.validate(["alarm_bound"])) return void(a.onConfirm = !1);
                        a.data.btn[0].hide = !1, a.data.btn[1].hide = !0, a.data.btn[2].hide = !0, i.post("statistics_setAlarmBound", {
                            resource: e.tag,
                            alarm_bound: t.alarm_bound
                        }, function () {
                            n.close(), n.info({
                                text: "保存" + e.tagCn + "提醒额度成功"
                            }), l()
                        })
                    }, contentStyle: {
                        overflow: "visible"
                    }
                }
            })
        };
        var d = new Date(o.get());
        e.date = {
            last_month: d.getMonth(),
            month: d.getMonth() + 1,
            date: d.getDate()
        };
        var p = !1;
        switch (e.YeeLevel.MULTIMEDIA_ENABLE && e.date.date < 6 && e.isOwner && i.get("qiniu_resource_monthlyRecharge", !1, function (t) {
            e.monthly_recharge = t.msg.info, p = !0
        }), e.showRecharge = function () {
            if (e.generalInfo)
                if (e.date.date > 5) n.modal({
                    title: e.date.month + "月份账单",
                    content: "本月的账单需次月1号结算产生",
                    btn: [{
                        text: "关闭",
                        type: "default",
                        click: "onClickClose"
                    }],
                    scope: {
                        onClickClose: function () {
                            n.close()
                        }
                    }
                });
                else {
                    var t = e.monthly_recharge;
                    if (!p) return void a(function () {
                        e.showRecharge()
                    }, 200);
                    if (!t) return void n.modal({
                        title: e.date.month + "月份账单",
                        content: "本月的账单需次月1号结算产生",
                        btn: [{
                            text: "关闭",
                            type: "default",
                            click: "onClickClose"
                        }],
                        scope: {
                            onClickClose: function () {
                                n.close()
                            }
                        }
                    });
                    var i = {
                            flow: "流量",
                            space: "空间"
                        },
                        o = ["flow", "space"].map(function (e, n) {
                            return {
                                tag: e,
                                tagCn: i[e],
                                GB: s.getStorageGB(t[e]),
                                fee: s.yuan(YeePreset["MULTIMEDIA_" + e.toUpperCase() + "_COST_FEN_PER_GB"]),
                                cost: t[e + "_amount"] || 0 === t[e + "_amount"] ? s.yuan(t[e + "_amount"]) : "--",
                                total: s.yuan(t.total_amount),
                                index: n
                            }
                        });
                    n.modal({
                        title: e.date.last_month + "月份账单",
                        content: '<ys-grid data="dataGrid"><table style="font-size:12px"><colgroup><col width="80"><col width="140"><col width="80"><col width="80"><col></colgroup><thead><tr><th style="padding:0 6px">费用类型</th><th style="padding:0 6px">费用价格</th><th style="padding:0 6px">本月使用</th><th style="padding:0 6px">费用</th><th style="padding:0 6px">合计</th></tr></thead><tbody><tr ng-repeat="item in info"><td style="padding:0 6px">多媒体{{ item.tagCn }}</td><td style="padding:0 6px">￥{{ item.fee }}/月<small class="text-muted">（一月一{{ item.tag == \'flow\' ? "付" : "清" }}）</small></td><td style="padding:0 6px">{{ item.GB }}GB</td><td style="padding:0 6px">￥{{ item.cost }}</td><td style="padding:0 6px" ng-style="spanStyle" rowspan="2" ng-if="item.index == 0"><b style="coloe:#333;font-size:16px;">￥{{ item.total }}</b><br><span>系统将于本月<span style="color:#333;">5号</span>从您的账号余额中自动扣款</span></td></tr></tbody></table></ys-grid>',
                        btn: [{
                            text: "关闭",
                            type: "default",
                            click: "onClickClose"
                        }],
                        initModel: {
                            info: o,
                            YeePreset: YeePreset,
                            spanStyle: {
                                "line-height": "1.5",
                                "vertical-align": "middle",
                                "text-align": "center",
                                padding: "0 15px",
                                "white-space": "normal",
                                "border-left": "1px solid #ddd",
                                "pointer-events": "none",
                                background: "#fff"
                            }
                        },
                        scope: {
                            onClickClose: function () {
                                n.close()
                            }
                        }
                    })
                }
        }, e.notAllowedTips = "管理员无法进行此操作，请<br>联系网站拥有者完成。", YeeLevel.LEVEL) {
        case "devel":
            e.storageNotAllowedTips = "开发版不支持空间扩容";
            break;
        case "free":
            e.storageNotAllowedTips = "免费版不支持空间扩容";
            break;
        default:
            e.storageNotAllowedTips = e.notAllowedTips
        }
        e.onRowSpanMouseEnter = function () {
            e.trKeepWhite = {
                "background-color": "#fff"
            }
        }, e.onRowSpanMouseLeave = function () {
            e.trKeepWhite = {}
        }
    }, 
    defineListeners: function () {
        this._super()
    }, 
    destroy: function () {}
});
ResourceController.$inject = ["$scope", "$rootScope", "$Uri", "$Popup", "$timeout", "$Time", "$Util", "$sce"];