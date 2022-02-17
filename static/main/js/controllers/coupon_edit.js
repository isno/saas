var CouponEditController = BaseEditController.extend({
    _tag: "coupon",
    _tagUrl: "coupon_group",
    _tagData: "coupon_group",
    _tagCn: "优惠券",
    _watchChange: ["data.name"],
    _watchValid: ["data.name", "csvFile.name", "placeholder", "data.discount_amount", "test_field"],
    _isPreCreate: !1,
    _colors: [{
        color: "#ff356e",
        text: "玫红"
    }, {
        color: "#f43921",
        text: "红色"
    }, {
        color: "#ff8c11",
        text: "橙色"
    }, {
        color: "#ffc700",
        text: "黄色"
    }, {
        color: "#02c12f",
        text: "绿色"
    }, {
        color: "#007aff",
        text: "蓝色"
    }, {
        color: "#a32cf6",
        text: "紫色"
    }, {
        color: "#353535",
        text: "黑色"
    }],
    init: function (e, t, i, n, a, o, s, r, l) {
        var c = this;
        YouPreset.init("coupon"), 
        this.$interval = s, 
        this.$Util = r, 
        this._super(e, t, i, n, a, o, l), 
        this._param = {
            id: c._id,
            page: 1,
            size: YouPreset.LIST_PAGE_SIZE
        }, 
        e.getStatusText = function (e) {
            return _.find(YouPreset.COUPON_STATUS, function (t) {
                return t.value === e
            }).text
        }, 
        e.dataPagination = {
            onSwitch: function (e) {
                c._param.page = e, c.loading(!0), c._getDistributedCoupon(function () {
                    c.loading(!1)
                })
            }
        }, 
        e.onRefresh = function () {
            c._param.page = 1, e.isRefreshing = !0, c._getDistributedCoupon(function () {
                e.isRefreshing = !1
            })
        }, 
        e.onClickBaseBack = function () {
            i.setQuery("coupon")
        },
        e.exportCoupon = function() {
            n.modal({
                title: "请选择要导出的优惠券类型",
                content: '<div class="pop-path"><div class="pop-path-inline-block" ng-click="export(0)"><div class="pop-path-inline-block-inner">全部</div></div><div class="pop-path-inline-block" ng-click="export(i.type);" ng-repeat="i in couponTypes"><div class="pop-path-inline-block-inner">{{ i.text }}</div></div></div>',
                contentextclass: "pop-path-horizontal",
                popStyle: {
                    width: "780px",
                    minWidth: "780px",
                    paddingBottom: "0px"
                },
                initModel: {
                    couponTypes: e.dataTabs,
                    export: function(j) {
                        window.open("/main/api/coupon_group/export?id="+c._id+"&type="+j+"&shop_id="+window.YoudianConf.shop_id),
                        n.close()
                    }
                },
                scope: {
                    popCancel: function() {
                        n.close()
                    }
                }
            })
        },
        e.dataGrid = {
            onCheckedChange: function (t) {
                e.opDisabled = !t
            }
        };
        var d = URI(window.YoudianConf.assetHost).path("/csv/").filename("优惠券导入模版.csv").toString();
        e.uploadCouponFiles = function () {
            n.modal({
                title: "优惠券导入",
                content: '<div><span class="order-num">1</span>下载优惠券导入模板&nbsp;<a class="text-link" target="_blank" href="' + d + '">下载</a></div><div><span class="order-num">2</span>上传优惠券文件&nbsp;<input type="text" class="input" style="width: 300px;" readonly ng-model="csvFile.name">&nbsp;<div class="coupon-upload-btn-wrap"><you-btn text="浏览"></you-btn>&nbsp;<input type="file" onchange="angular.element(this).scope().selectFile(this);" accept=".csv"/></div><you-btn type="primary" text="上传" ng-click="confirm()" ng-disabled="!csvFile"></you-btn></div><ul class="text-muted popup-tip-list"><li>最大支持1MB CSV文件，最多支持导入9999个优惠券；</li><li>默认读取第一列为优惠码进行导入；</li><li>优惠券编号格式可由6~15位数字和字母组成，不合格和重复的编号则直接跳过；</li><li>将该文件保存为CSV格式的文件（*.CSV）再上传。</li></ul>',
                notpreventDefault: !0,
                popStyle: {
                    height: "275px",
                    width: "630px"
                },
                contentextclass: "coupon-upload-popup",
                initModel: {
                    csvFile: e.csvFile,
                    selectFile: function (e) {
                        var t = e.files[0];
                        t && ("application/vnd.ms-excel" === t.type || "text/csv" === t.type ? (this.csvFile = t, this.$apply()) : n.modalSimple({
                            type: "msg",
                            title: "提示",
                            content: "将该文件保存为CSV格式的文件（*.CSV）再上传。",
                            forceMask: !0
                        }))
                    }, confirm: function () {
                        e.csvFile = this.csvFile, 
                        n.closeAll()
                    }
                }
            })
        }, e.blurOff = function () {
            parseFloat(e.data.discount_amount) > parseFloat(e.data.active_amount) && o(function () {
                e.validation.toggle("data.active_amount", !0, "购物金额应不小于优惠券金额")
            }, 200)
        };
        var p = this._colors;
        e.exportColor = p[5], 
        e.colors = this._colors, 
        e.setColor = function (t) {
            e.exportColor = t
        }
    }, 
    _initNewCoupon: function () {
        var e = this._$scope;
        e.data.name = e.data.discount_amount = e.data.active_amount = e.data.discount_percentage = e.data.quantity_provided = null
    }, 
    _initExsitCoupon: function () {
        var e = this,
            t = this._$scope,
            i = this._$Uri,
            n = this._$Popup,
            a = (this.$interval, t.data.name),
            o = {
                checkAssigning: function () {
                    var i = e._getSingleLoopRequest(function (e) {
                        e.assigning || (i(), t.data.assigning = !1, n.info({
                            text: a + " 派发成功"
                        }), t.onRefresh())
                    })
                }, checkDealing: function () {
                    var i = e._getSingleLoopRequest(function (n) {
                        n.dealing || (i(), e._getDistributedCoupon(function () {
                            t.data = e._formatData(n)
                        }))
                    })
                }
            };
        if (t.data.assigning ? o.checkAssigning() : t.data.dealing && o.checkDealing(), t.discardCoupon = function () {
            n.modalSimple({
                action: "作废优惠券",
                type: "danger",
                content: "确定要作废 " + a + " 优惠券吗？",
                onConfirm: function () {
                    i.post("coupon_group_cancel", {
                        id: e._id
                    }, function (e, i) {
                        200 == i ? (t.data.is_available = !1, t.isExpired = !0, n.info({
                            text: a + "作废成功"
                        })) : n.info({
                            type: "danger",
                            text: a + " 作废失败"
                        }), n.close()
                    })
                }
            })
        }, 
        t.distributeCoupon = function () {
            var a = t.data.name;
            n.customers({
                title: "派发优惠券",
                customers: [],
                mode: "distribute",
                msg: {
                    single: "single" === t.data.atype,
                    id: t.data.id,
                    atype: t.data.atype
                },
                onDone: function (s) {
                    var r = t.data.quantity_free,
                        l = 0,
                        c = _.map(s, function (e) {
                            return l += Number(e.listItemAmount), {
                                id: e.id,
                                quantity: e.listItemAmount
                            }
                        });
                    if (l)
                        if (l > r) n.modalSimple({
                            type: "msg",
                            title: "提示",
                            content: "优惠券不足以派发"
                        });
                        else {
                            var d = {
                                id: e._id,
                                customers: JSON.stringify(c)
                            };
                            t.data.assigning = !0, i.post("coupon_group_assign", d, function (e, i) {
                                200 == i ? (n.info({
                                    text: "正在派发" + a
                                }), o.checkAssigning()) : (n.info({
                                    type: "danger",
                                    text: a + " 派发失败"
                                }), t.data.assigning = !1)
                            }, {
                                errorCallback: function () {
                                    t.data.assigning = !1
                                }
                            })
                        }
                }
            })
        }, 
        t.getCouponStatusText = function (e) {
            return _.find(YouPreset.COUPON_USE_STATUS, function (t) {
                return t.value === e
            }).text
        }, 
        t.fExpandDetail = function () {
            t.advanceExpandArrow = !t.advanceExpandArrow, t.advanceExpandArrow ? t.gridStyle = {
                display: "none"
            } : t.gridStyle = {
                display: "block"
            }
        }, 
        t.getCustomerAvatar = function (e) {
            return i.getAssetUrl(e.avatar_path, "42x42")
        },
        t.dataTabs = [{
                    text: "未领取优惠券",
                    tag: "unuse",
                    type: "1"
                },
                {
                    text: "已领取未使用优惠券",
                    tag: "distributed",
                    type: "2"
                },
                {
                    text: "已使用优惠券",
                    tag: "used",
                    type: "3"
                }],
                t.currentTab = t.dataTabs[0],
                   t.setCurrentTab = function(n) {
                    n !== t.currentTab && (t.currentTab = n, a.go(a.current, {
                        tab: t.currentTab.tag
                    },
                    {
                        location: "replace",
                        notify: !1
                    }), 
                    t._param.page = 1, 
                    t.loading(!0), 
                    t.loadingGridData = !0, 
                    t._getDistributedCoupon(function() {
                        t.loading(!1),
                        t.loadingGridData = !1
                    }))
                },

        !this.isNew()) {
            var s = {};
            t.toggleCouponEditalbe = function () {
                t.baseAvailable ? s = JSON.stringify(t.data) : t.data = JSON.parse(s), t.baseAvailable = !t.baseAvailable
            }
        }
    }, 
    _getDistributedCoupon: function (e) {
        var t = this,
            i = this._$scope,
            n = this._$Uri;
        this._$timeout;
        n.get("coupon_group_getCoupons", t._param, function (n, a) {
            200 == a && (i.distributedCoupon = n.data, i.dataPagination.count = n.data.page_count, i.dataPagination.current = t._param.page, i.dataPagination.lock = !1), e && e(n, a)
        }, {
            errorCallback: function () {
                t.loading(!1)
            }, overrideError: !0
        })
    }, 
    _formatData: function (e) {
        return e.active_amount /= 100, 
        e.discount_amount /= 100, 
        e.discount_percentage /= 10, 
        e.isTypeAmount = "amount" === e.utype, 
        e.isActiveAmount = 0 !== e.active_amount,
         e.isSingleAtype = "single" === e.atype, e
    }, 
    onInitDone: function (e) {
        var t = this._$scope,
            i = this._$Time,
            n = this._$timeout,
            a = this.$Util,
            o = this,
            s = this.isNew();
        s && (e = {
            atype: "normal",
            utype: "amount",
            active_amount: 0,
            discount_amount: 0,
            quantity_provided: 0,
            discount_percentage: 100,
            no_expires: !1,
            actived_at: null,
            expired_at: null,
            is_saved: !1,
            is_available: !0,
            dealing: !1,
            coupons: [],
            imported: !1,
            exported: !0
        }), 
        t.data = o._formatData(e), 
        t.isExpired = "expired" === t.data.status, 
        t.canDistribute = function () {
            return "expired" != t.data.status && t.data.is_available && !t.data.dealing && !t.data.assigning
        }, 
        t.canDiscard = function () {
            return "expired" != t.data.status && t.data.is_available && !t.data.dealing
        }, 
        t.$watch("data.isTypeAmount", function (t) {
            !0 === t ? (e.utype = "amount", o._watchValid[3] = "data.discount_amount") : (e.utype = "percentage", o._watchValid[3] = "data.discount_percentage")
        }), 
        t.$watch("data.imported", function (e) {
            !0 === e ? (o._watchValid[1] = "csvFile.name", o._watchValid[2] = "placeholder") : (o._watchValid[1] = "data.prefix", o._watchValid[2] = "data.quantity_provided")
        }), 
        t.$watch("data.isSingleAtype", function (t) {
            e.atype = !0 === t ? "single" : "normal"
        }), n(function () {
            var n = 0;
            n = e.no_expires ? -1 : i.timestamp(e.expired_at);
            var a = t.dataDatetime.timeStart = i.timestamp(e.actived_at),
                o = t.dataDatetime.timeEnd = n;
            t.dataDatetime.onChange = function (e, i) {
                e && (a != e && t.unSaved(), t.validation && t.validation.toggle("begin_data", !1)), i && (o != i && t.unSaved(), t.validation && t.validation.toggle("expire_data", !1))
            }
        }), s ? this._initNewCoupon() : (this._initExsitCoupon(), this._getDistributedCoupon(), t.exportCouponUrl = URI(window.YoudianConf.adminUrl + "coupon_group/export").search({
            id: o._id
        }).toString(), 
        e.exported && n(function () {
        
            a.setClipboard("#copy-coupon-info-link", {
                scope: t,
                text: e.export_url
            })
        })), console.log(e)
    }, 
    _getSingleLoopRequest: function (e, t) {
        var i = this,
            n = this.$interval,
            a = this._$Uri,
            o = n(function () {
                a.get(i._tagUrl + "_getSingle", {
                    id: i._id
                }, function (t) {
                    var n = t.data[i._tagData];

                    e && e(n)
                })
            }, t || 2e3),
            s = function () {
                n.cancel(o)
            };
        return this.loopRequestList = this.loopRequestList || [], this.loopRequestList.push(s), s
    }, 
    onSaveBefore: function () {
        var e = this._$scope,
            t = !0,
            i = !1;
        e.data.isActiveAmount && (e.validation.validate(["data.active_amount"]) || (t = !1, i = !0), parseFloat(e.data.discount_amount) > 0 && parseFloat(e.data.active_amount) > 0 && parseFloat(e.data.discount_amount) > parseFloat(e.data.active_amount) && (e.validation.toggle("data.active_amount", !0, "购物金额应不小于优惠券金额", !i), t = !1, i = !0));
        var n = e.dataDatetime.getTime();
        return n[0] || (e.validation.toggle("begin_data", !0, "请设置开始时间", !i), t = !1, i = !0), n[1] || (e.validation.toggle("expire_data", !0, "请设置结束时间", !i), t = !1, i = !0), e.data.exported && (e.validation.validate("data.export_text") || (t = !1, i = !0)), e.isNew || (this._watchValid[1] = null), t
    }, 
    onSave: function (e) {
        var t = this._$scope,
            i = this._$Time,
            n = this.$Util;
        e.ctype = "normal", 
        e.utype = t.data.utype, 
        e.atype = t.data.atype, 
        e.name = t.data.name, 
        e.quantity_provided = t.data.quantity_provided, 
        e.imported = t.data.imported, 
        e.exported = t.data.exported, 
        t.isNew || (e.id = this._id), 
        "amount" === e.utype ? e.discount_amount = n.fen(t.data.discount_amount) : e.discount_percentage = 10 * t.data.discount_percentage, 
        t.data.isActiveAmount ? e.active_amount = n.fen(t.data.active_amount) : e.active_amount = 0, 
        t.data.imported ? (this._dataSaveType = "formData", e.import_file = t.csvFile) : this._dataSaveType = "", 
        t.data.exported && (e.export_text = t.data.export_text || "", e.export_color = t.exportColor.color);
        var a = t.dataDatetime.getTime();
        e.actived_at = i.serverTimestamp(a[0]), 
        -1 == a[1] ? e.no_expires = !0 : e.expired_at = i.serverTimestamp(a[1]), 
        t.data.prefix && (e.prefix = t.data.prefix)
    }, 
    loading: function (e) {
        var t = this;
        e ? t._$Popup.loading(++t._loadingCount) : t._$Popup.loading(--t._loadingCount)
    }, 
    destroy: function () {
        _.forEach(this.loopRequestList, function (e) {
            e()
        })
    }
});
CouponEditController.$inject = ["$scope", "$rootScope", "$Uri", "$Popup", "$Time", "$timeout", "$interval", "$Util", "$state"];