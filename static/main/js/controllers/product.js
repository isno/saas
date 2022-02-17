var ProductController = BaseGridController.extend({
    _tag: "product",
    _watchValid: ["param.amount_smaller", "param.amount_greater", "param.point_smaller", "param.point_greater", "param.stock_smaller", "param.stock_greater"],
    _searchRangeFields: [
        ["param.amount_smaller", "param.amount_greater"],
        ["param.point_smaller", "param.point_greater"],
        ["param.stock_smaller", "param.stock_greater"]
    ],
    init: function (e, t, i, n, a, o) {
        YouText.init("product"), 
        this._super(e, t, i, n, a, o), 
        this._$uri = i, 
        this._$timeout = a;
        var s = this;
        this.getBatchProcessLoopRequest(), 
        this.initCheckBtn("dataTypes", "tid", null, !0), 
        i.get("type_getAll", { show_all: "N", nopage: "Y"}, function (t) {
            var i = [];
            _.forEach(t.data.types, function (t) {
                i.push({
                    value: t.id,
                    text: e.HTMLDECODE(t.name)
                })
            }), 
            e.dataTypes.list = i, 
            e.dataTypes.restore(e.param.tid), 
            e.dataTypes.onFoldSwitch = function (t) {
                e.mainfollowResize = !e.mainfollowResize
            }
        }), 
        this.initCheckBtn("dataVendors", "vid", null, !0), 
        i.get("vendor_getAll", {show_all: "N",nopage: "Y"}, function (t) {
            var i = [];
            _.forEach(t.data.vendors, function (t) {
                i.push({
                    value: t.id,
                    text: e.HTMLDECODE(t.name)
                })
            }), e.dataVendors.list = i, e.dataVendors.restore(e.param.vid), e.dataVendors.onFoldSwitch = function (t) {
                e.mainfollowResize = !e.mainfollowResize
            }
        }), 
        e.dataDate = {
            type: "datetime",
            showCleanup: !0,
            timeStart: e.param.created_earlier || 0,
            timeEnd: e.param.created_later || 0,
            onChange: function (t, i) {
                e.param.created_earlier = moment(t).format(), e.param.created_later = moment(i).format()
            }
        }, 
        this.initCheckBtn("dataVisibility", "visibility", YouPreset.VISIBILITY), 
        this.initBatchSetting(), 
        e.onClickMultiVisibility = function (t) {
            var a = (s.getCheckedIds(), {
                visibility: t
            });
            s.getCheckedIds().length;
            if (e.isBatchManageAll) {
                if (a.update = "all", a.product_filter = JSON.stringify(e.param), e.baseItemCount > 200) return void n.modalSimple({
                    type: "msg",
                    title: "提示",
                    content: YouText.PRODUCT_BATCH_SETTING_REJECT_DESC
                })
            } else a.pids = s.getCheckedIds().toString();
            s.loading(!0), i.post("product_multiChangeVisibility", a, function () {
                e.isBatchManageAll = !1, s.loading(!1), s.getBatchProcessLoopRequest(!0)
            })
        }, 
        e.onClickMultiRemove = function () {
            var t = s.getCheckedIds(),
                a = {
                    pids: t.toString()
                },
                o = t.length;
            if (e.isBatchManageAll && (a = {
                update: "all",
                product_filter: JSON.stringify(e.param)
            }, o = e.baseItemCount, e.baseItemCount > 200)) return void n.modalSimple({
                type: "msg",
                title: "提示",
                content: YouText.PRODUCT_BATCH_SETTING_REJECT_DESC
            });
            n.modalSimple({
                tag: "商品",
                type: "remove",
                content: "确定要删除 <strong>选中的" + o + "个商品</strong> 吗?",
                onConfirm: function () {
                    i.post("product_multiRemove", a, function () {
                        n.close(), s.getBatchProcessLoopRequest(!0), e.isBatchManageAll = !1
                    }, {
                        noTimeout: !0
                    })
                }
            })
        }, e.getStock = function (e) {
            return e.stock_sum + "件/" + e.variant_count + "个SKU"
        };
        var r;
        e.quickStock = function (e, t) {
            e.stopPropagation(), r && r.id === t.id || (r && void 0 !== r.loading && delete r.loading, r = t, t.loading = !0, i.get("variant_getAllOfProduct", {
                product_id: t.id
            }, function (a) {
                if (r && r.id != t.id) return void delete t.loading;
                delete t.loading, n.quickStock(e, a, t, function (e, n) {
                    i.post("variant_multiSave", {
                        data: JSON.stringify(e)
                    }, function () {
                        r = null;
                        var i = 0;
                        _.forEach(e.variants, function (e) {
                            i += Number(e.stock)
                        }), t.stock_sum = i;
                        var o = 0;
                        _.forEach(a.data.variants, function (t, i) {
                            var n = _.find(e.variants, function (e) {
                                return t.id == e.id
                            });
                            t.is_alarmed && t.alarm_num > n.stock && (o += n.stock - t.alarm_num)
                        }), t.stock_debt = o, n && n()
                    })
                }, function () {
                    r = null
                })
            }, {
                errorCallback: function () {
                    delete t.loading
                }, overrideError: !0
            }))
        }, e.gridEventDelegateData = {
            quickStock: e.quickStock,
            onClickItem: e.onClickItem
        }
    }, onSearch: function () {
        var e = this._$scope;
        e.isBatchManageAll = !1, e.opDisabled = !0
    }, getBatchProcessLoopRequest: function (e) {
        var t, i = this._$uri,
            n = this._$timeout,
            a = this._$Popup,
            o = this._$scope,
            s = function (e) {
                e = e || {
                    processed: 0,
                    total_count: ""
                };
                var i = 1 === e.process ? null : "transition-slow";
                t = a.modal({
                    title: "商品批量操作",
                    content: '<div><h3 class="summit-h3" style="text-align: right;">已处理完成：<span>{{process.processed}}</span> / 总共：<span>{{process.total_count}}</span></h3><div class="setting-limit-content-bar imgmgr-imgname-bar"><div class="setting-limit-content-bar-process" ng-class="barclass.className" style="width:0%" ng-style="uploadPercentStyle"></div></div></div>',
                    noX: !0,
                    btn: [{
                        type: "loading",
                        hide: !1
                    }],
                    initModel: {
                        uploadPercentStyle: {
                            width: "0%"
                        },
                        process: $.extend({}, e),
                        barclass: {
                            className: i
                        }
                    }
                }), s = function (e) {
                    e.processed === e.total_count && (t.PopupModalData.initModel.barclass.className = "transition-fast"), n(function () {
                        t.PopupModalData.initModel.process.processed = e.processed, t.PopupModalData.initModel.process.total_count = e.total_count, t.PopupModalData.initModel.uploadPercentStyle.width = (e.processed / e.total_count * 100).toFixed() + "%"
                    })
                }
            };
        e && s();
        var r = n(function e() {
                i.get("product_checkBatchProcess", null, function (i) {
                    "done" === i.data.status ? t ? (s(i.data), n(function () {
                        a.closeAll(), o.onRefresh()
                    }, 200)) : (a.closeAll(), o.onRefresh()) : (s(i.data), r = n(e, 500))
                })
            }),
            l = function () {
                n.cancel(r)
            };
        return this.loopRequestList = this.loopRequestList || [], this.loopRequestList.push(l), l
    }, 
    initBatchSetting: function () {
        var e = this,
            t = this._$scope,
            i = this._$Popup,
            n = this._$Uri,
            a = this._$util;
        this._$timeout;
        t.isBatchManageAll = !1, 
        t.batchSettings = [{
            text: "售价",
            value: "price"
        }, {
            text: "库存",
            value: "stock"
        }, {
            text: "积分",
            value: "point"
        }, {
            text: "分类",
            value: "types"
        }, {
            text: "品牌",
            value: "vendor"
        }, {
            text: "运费模板",
            value: "shipment_template"
        }];
        var o = t.dataGrid.onCheckedChange;
        t.dataGrid.onCheckedChange = function (i) {
            o(i), 
            t.selectedTotalCount = e.getCheckedIds().length
        }, 
        t.popBatchSetting = function (o) {
            var s = o.value,
                r = o.text,
                l = e.getCheckedIds(),
                c = {
                    data: {
                        column: s
                    },
                    state: {},
                    validation: {},
                    batchText: r,
                    isActiveType: function (e) {
                        return this.data.type === e
                    }
                };
            if (t.isBatchManageAll) {
                if (c.data.update = "all", 
                    c.data.product_filter = t.param, 
                    c.batchCount = t.baseItemCount, 
                    t.baseItemCount > 200) return void i.modalSimple({
                    type: "msg",
                    title: "提示",
                    content: YouText.PRODUCT_BATCH_SETTING_REJECT_DESC
                })
            } else c.data.product_ids = l, c.batchCount = l.length;
            switch (s) {
            case "price":
            case "stock":
            case "point":
                c.data.type = "reset";
                break;
            case "types":
                c.data.type = "add", 
                c.dataSelector = {
                    btnname: "设置分类",
                    inputplaceholder: "搜索或创建分类",
                    btnautostatus: !0,
                    cnname: "商品分类",
                    inputMaxLength: 20,
                    staticMode: !0,
                    url: ["type_getAll", "notPost", "notPost"],
                    urlCreate: "type_create",
                    uname: "pid",
                    queryname: "name",
                    uniparam: "types",
                    orgData: [],
                    sync: function (e, t) {
                        if (g(), e.length > 10) e.pop(), i.modal({
                            title: "提示",
                            content: "一个商品只能设置最多 <strong>10</strong> 个分类",
                            btn: [{
                                type: "primary",
                                text: "确定",
                                click: "fDelCancel"
                            }],
                            forceMask: !0,
                            scope: {
                                fDelCancel: function () {
                                    i.close()
                                }
                            },
                            notpreventDefault: !0
                        });
                        else {
                            if ("add" === c.data.type && e[0]) {
                                angular.element($("#types_ids")).scope().validation.toggle("types_ids", !1)
                            }
                            var n = _.map(e, "id");
                            c.data.ids = n.length ? n : void 0
                        }
                    }
                };
                break;
            case "vendor":
                c.dataSelector = {
                    btnname: "选择品牌",
                    isUniq: !0,
                    orgData: [],
                    inputplaceholder: "搜索或创建品牌",
                    btnautostatus: !0,
                    cnname: "商品品牌",
                    inputMaxLength: 50,
                    staticMode: !0,
                    url: ["vendor_getAll", "notPost", "notPost"],
                    urlCreate: "vendor_create",
                    uname: "pid",
                    queryname: "name",
                    uniparam: "vendors",
                    sync: function (e, t) {
                        c.data.ids = e[0] ? e[0].id : void 0
                    }
                };
                break;
            case "shipment_template":
                var d = [];
                c.dataSelector = {
                    btnname: "选择运费模板",
                    isUniq: !0,
                    inputplaceholder: "搜索运费模板",
                    btnautostatus: !0,
                    cnname: "运费模板",
                    inputMaxLength: 100,
                    mode: "search",
                    orgData: d,
                    forbiddenDel: !0,
                    staticMode: !0,
                    url: ["shipmentTemplate_getAll", "notPost", "notPost"],
                    uniparam: "shipment_templates",
                    uname: "pid",
                    queryname: "id",
                    mapper: {
                        id: "shipment_template_id"
                    },
                    sync: function (e, t) {
                        if (e[0]) {
                            angular.element($("#shipment_template_ids")).scope().validation.toggle("shipment_template_ids", !1), c.data.ids = e[0].id
                        }
                    }
                }
            }
            var p = function (a) {
                    n.post("product_batchManagement", {
                        data: JSON.stringify(a)
                    }, function (n) {
                        t.isBatchManageAll = !1, 
                        i.closeAll(), 
                        e.getBatchProcessLoopRequest(!0)
                    })
                },
                u = {
                    title: "批量设置" + r,
                    templateUrl: "product_batch_setting.htm",
                    btn: [{
                        type: "loading",
                        hide: !0
                    }, {
                        text: "取消",
                        type: "default",
                        click: "cancel",
                        hide: !1
                    }, {
                        text: "确定",
                        type: "primary",
                        click: "confirm",
                        hide: !1
                    }],
                    scope: {
                        contentStyle: {
                            overflow: "visible"
                        },
                        cancel: function () {
                            i.close()
                        }, confirm: function (e) {
                            var t = !0,
                                n = angular.copy(e.data);
                            if ("vendor" === s || "types" === s && "reset" === n.type) void 0 === n.ids && (i.modalSimple({
                                action: "提示",
                                type: "danger",
                                content: "当前未选择任何{text}，将会清空所选商品的{text}信息，确定吗？".replace(/{text}/g, r),
                                onConfirm: function () {
                                    p(n)
                                }, onClose: function () {
                                    i.close()
                                }, forceMask: !0
                            }), t = !1);
                            else if ("types" === s) void 0 === n.ids && (e.validation.toggle("types_ids", !0, "请至少选择一个分类", !1), t = !1);
                            else if ("shipment_template" === s) void 0 === n.ids && (e.validation.toggle("shipment_template_ids", !0, "请至少选择一个运费模板", !1), t = !1);
                            else {
                                var o = ["data.amount"];
                                "price" === s ? e.isActiveType("reset") || "true" !== e.state.isAdjustRatio ? n.amount = a.fen(n.amount) : (o = ["data.adjust_ratio"], delete n.amount) : "point" === s && e.isActiveType("reset") && (o = ["data.point_ratio"]), t = e.validation.validate(o)
                            }
                            t ? p(n) : m.$$childHead.confirm = !1
                        }
                    },
                    notpreventDefault: !0,
                    contentextclass: "popup-batch"
                };
            u.initModel = c;
            var m = i.modal(u);
            switch (s) {
            case "price":
                m.$watch("PopupModalData.initModel.state.isAdjustRatio", function (e) {
                    "true" == e ? (m.PopupModalData.initModel.data.adjust_ratio = m.PopupModalData.initModel.data.amount, delete m.PopupModalData.initModel.data.amount) : (m.PopupModalData.initModel.data.amount = m.PopupModalData.initModel.data.adjust_ratio, delete m.PopupModalData.initModel.data.adjust_ratio)
                });
            case "point":
            case "stock":
            case "types":
                m.$watch("PopupModalData.initModel.data.type", function (e) {
                    delete m.PopupModalData.initModel.data.amount, delete m.PopupModalData.initModel.data.adjust_ratio, m.PopupModalData.initModel.dataSelector && (m.PopupModalData.initModel.dataSelector.orgData = [])
                })
            }
            var g = function () {
                var e, t, i = function () {
                    t = $(".popup-normal-content").outerHeight()
                };
                return setTimeout(function () {
                        e = $(".popup-normal").first(), i()
                    }, 100),
                    function () {
                        setTimeout(function () {
                            var n = parseInt(e.css("bottom")),
                                a = e.find(".popup-normal-content").outerHeight(),
                                o = n - (a - t);
                            e.css("bottom", o), i()
                        }, 100)
                    }
            }()
        };
        var s = function (e) {
            e.stopPropagation();
            var t = $(this).parent().find(".btn-drop-ls");
            if (t.is(":visible")) return void t.hide();
            t.show(), setTimeout(function () {
                $(document).one("click", function () {
                    t.hide()
                })
            }, 100)
        };
        $(".btn-drop-one > .btn").on("click", s)
    }, 
    onReset: function () {
        var e = this._$scope;
        e.dataTypes.reset(), e.dataVendors.reset(), e.dataVisibility.reset(), e.dataDate.timeStart = e.dataDate.timeEnd = null
    }, 
    onGetAll: function (e) {
        e.amount_smaller && (e.amount_smaller *= 100), e.amount_greater && (e.amount_greater *= 100)
    }, 
    onInitDone: function (e) {
        var t = this._$Uri;
        _.forEach(e, function (e) {
            e.image = t.getAssetUrl(e.image_path, "100x100")
        })
    }, 
    destroy: function () {
        _.forEach(this.loopRequestList, function (e) {
            e()
        })
    }
});
ProductController.$inject = ["$scope", "$rootScope", "$Uri", "$Popup", "$timeout", "$Util"];