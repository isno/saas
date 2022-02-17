var CustomerEditController = BaseEditController.extend({
    _tag: "customer",
    init: function(e, t, i, n, a, o, s) {
        YouPreset.init("order"),this._super(e, t, i, n, a);
        var r = this;
        e.getCustomerAvatar = function (e) {
            return i.getAssetUrl(e.avatar_path, "100x100")
        }
        e.dataTabs = [{
                text: "购买记录",
                tag: "trade"
            }, {
                text: "积分明细",
                tag: "point"
            }, {
                text: "经验值明细",
                tag: "credit"
            }, {
                text: "优惠码列表",
                tag: "coupon"
            }, {
                text: "地址列表",
                tag: "address"
            }, {
                text: "附加信息",
                tag: "meta_field",
                initDone: !0,
                doc: YouPreset.DOCS_METAFIELDS
            }],

            /*
            e.editInfo = function() 
            {
                var e = c.default.cloneDeep(t.customer);
                c.default.cloneDeep(t.datatime);

                i.modal({ 
                    title: "编辑备注", 
                    content: '<div style="margin-top:10px;"><textarea class="input input-long" placeholder="请输入备注，最多不超过200字" maxlength="200" style="height:120px;" ng-model="customer.note"></textarea></div>', 
                    btn: [
                        { type: "loading", hide: !0 }, 
                        { type: "default", text: "取消", click: "cancel" }, 
                        { type: "primary", text: "保存", click: "confirm" }], 
                    scope: { 
                        cancel: function() { i.closeAll() }, 
                        confirm: function(t, a) {
                            var r = {};
                            r.id = e.id, 
                            r.note = e.note;
                            var s = JSON.stringify(r);
                                
                            n.put("customer_updateInfo", { data: s }, function(t) 
                            { 
                                200 == t.code && ( i.closeAll(), i.info({ text: "修改备注成功" }, !0),d._httpGetSingle()) }) 
                            }
                        }
                    })
          


                 },
            */

            e.currentTab = e.dataTabs[0],
            e.setCurrentTab = function(t) {
                e.currentTab = t,
                    s.go(s.current, { tab: e.currentTab.tag }, { location: "replace", notify: !1 }),
                    r.httpGetGrid()
            },
            this._tradePage = 1,
            this._pointPage = 1,
            this._creditPage = 1,
            this._couponPage = 1,

            s.params.tab && (e.currentTab = _.find(e.dataTabs, function(e) {
                return e.tag === s.params.tab
            })),

            this.httpGetGrid(),
            e.tradePagination = {
                onSwitch: function(e) {
                    r.loading(!0), 
                    r._tradePage = e, 
                    r._httpGet_trade(function() {
                        r.loading(!1)
                    })
                }
            },
            e.pointPagination = {
                onSwitch: function(e) {
                    r.loading(!0), 
                    r._pointPage = e, 
                    r._httpGet_point(function() {
                        r.loading(!1)
                    })
                }
            },
            e.creditPagination = {
                onSwitch: function(e) {
                    r.loading(!0), 
                    r._creditPage = e, 
                    r._httpGet_credit(function() {
                        r.loading(!1)
                    })
                }
            },
            e.couponsPagination = {
                onSwitch: function(e) {
                    r.loading(!0), 
                    r._couponPage = e, 
                    r._httpGet_coupon(function() {
                        r.loading(!1)
                    })
                }
            };
        var l = new Date(this._$Time.get());
        e.thisYearEnd = new Date(l.getFullYear() + 1, 0, 0), 

        e.youDropdownConfig = {
            appendTo: "[you-mainbody]",
            init: function(t) {
                angular.extend(t, {
                    labelBlocks: [{
                        text: "增加",
                        value: "increase"
                    }, {
                        text: "减少",
                        value: "minus"
                    }],
                    data: {
                        adjust_type: "increase"
                    },
                    validation: {},
                    saveEditPoint: function() {
                        var n = e.customer.id,
                            a = {
                                customer_id: n
                            },
                            o = t.validation.validate(["data.point", "data.admin_memo", "data.desc"]),
                            s = function() {
                                t.$dropdown.$toggleDropdown(!1), t.isSaving = !1, t.data = {
                                    adjust_type: "increase"
                                }
                            };
                        if (o) {
                            var l = t.data;
                            a.adjust_type = l.adjust_type, 
                            a.point = l.point, 
                            a.admin_memo = l.admin_memo, 
                            a.desc = l.desc, 
                            t.isSaving = !0, 
                            i.post("customer_setPoint", a, function(t) {
                                s(), 
                                e.onPointRefresh(), 
                                r._httpGetSingle()
                            }, {
                                errorCallback: s
                            })
                        }
                    }
                }), 
                t.$watch("data.adjust_type", function() {
                    t.data.point = null
                })
            }
        }, 
        e.youDropdownExpConfig = {
            appendTo: "[you-mainbody]",
            init: function(t) {
                var a = function(e, t) {
                    i.get("customer_level_getAll", null, function(t) {
                        e(t.data.customer_levels)
                    }, {
                        errorCallback: t
                    })
                };
                angular.extend(t, {
                    labelBlocks: [{
                        text: "增加",
                        value: "increase"
                    }, {
                        text: "减少",
                        value: "minus"
                    }],
                    data: {
                        adjust_type: "increase"
                    },
                    validation: {},
                    popCustomerLevel: function() {
                        var e = function(e) {
                            t.$dropdown.$closeOnClick = !e
                        };
                        e(!0), 
                        n.modal({
                            title: "会员等级参考",
                            content: YouText.POPUP_MODAL_LOADING
                        }), 
                        a(function(t) {
                            var a = {
                                list: t,
                                HTMLDECODE: o.htmlEnDeCode.htmlDecode,
                                data: {}
                            };
                            i.get("customer_level_credit", null, function(e) {
                                a.data.enable = e.msg.credit_enabled, 
                                a.data.ratio = e.msg.credit_exchange_ratio
                            }), 
                            n.close(), 
                            n.modal({
                                title: "会员等级参考",
                                content: '<div class="grid-body"><you-grid data="dataGrid"><table><colgroup><col ><col width="25%"><col ></colgroup><thead><tr><th>等级名称</th><th>所需经验值<span class="you-help-position" you-help you-need-compile="true" you-help-dir="bottom" you-width="auto">{{ data.enable ? \'消费\' + YouPreset.$() + \'1累计\' + data.ratio + \'经验值\' : YouText.CUSTOMER_CREDITS_DISABLED }}</span></th><th>全场折扣</th></tr></thead><tbody ng-show="list.length >0"><tr ng-repeat="item in list"><td><a class="t-title" href="javascript:void(0);" title="{{item.name}}"><span class="text-status text-status-invalid" ng-if="!item.deletable">默认</span><span class="penname-txtcls">{{ HTMLDECODE(item.name) }}</span></a></td><td><span>{{ item.credits }}</span></td>' + "<td><span>{{ item.discount == 100 ? '无折扣' : item.discount/10 + '折' }}</span></td></tr></tbody></table></you-grid></div>",
                                btn: [{
                                    type: "default",
                                    text: "关闭",
                                    click: "closePop"
                                }],
                                scope: {
                                    closePop: function() {
                                        n.close(), setTimeout(function() {
                                            e(!1)
                                        })
                                    }
                                },
                                onClose: function() {
                                    this.scope.closePop()
                                },
                                initModel: a,
                                contentextclass: "pop-grid-list"
                            })
                        }, 
                        function() {
                            e(!1)
                        })
                    },
                    saveEditCredit: function() {
                        var n = e.customer.id,
                            a = {
                                customer_id: n
                            },
                            o = t.validation.validate(["data.credit", "data.admin_memo", "data.desc"]),
                            s = function() {
                                t.$dropdown.$toggleDropdown(!1), 
                                t.isSaving = !1, 
                                t.data = {
                                    adjust_type: "increase"
                                }
                            };
                        if (o) {
                            var l = t.data;
                            a.adjust_type = l.adjust_type, 
                            a.credit = l.credit, 
                            a.admin_memo = l.admin_memo, 
                            a.desc = l.desc, 
                            t.isSaving = !0, 
                            i.post("customer_setCredit", a, function(t) {
                                s(), e.onCreditRefresh(), r._httpGetSingle()
                            }, 
                            {
                                errorCallback: s
                            })
                        }
                    }
                }), 
                t.$watch("data.adjust_type", function() {
                    t.data.credit = null
                })
            }
        }, 
        e.getRegistName = function(e) {
            if (e) switch (e.regist_source) {
                case 101:
                    return e.email;
                case 102:
                    return e.mobile;
                case 103:
                    return e.uname;
                default:
                    return e.social_name
            }
        }, 
        e.getStatusText = function(e, t) {
            return "expired" === e ? "已过期" : "pending" === t ? "未使用" : "已使用"
        }, 
        e.onTradeRefresh = function() {
            e.tradePagination.current = r._tradePage = 1, 
            e.tradePagination.count = 0, 
            e.isTradeRefreshing = !0, 
            r._httpGet_trade(function() {
                e.isTradeRefreshing = !1
            })
        }, 
        e.onPointRefresh = function() {
            e.pointPagination.current = r._pointPage = 1, 
            e.pointPagination.count = 0, 
            e.isPointRefreshing = !0, 
            r._httpGet_point(function() {
                e.isPointRefreshing = !1
            })
        }, 
        e.onCreditRefresh = function() {
            e.creditPagination.current = r._creditPage = 1, 
            e.creditPagination.count = 0, 
            e.isCreditRefreshing = !0, 
            r._httpGet_credit(function() {
                e.isCreditRefreshing = !1
            })
        }, 
        e.onCouponRefresh = function() {
            e.couponsPagination.current = r._couponPage = 1, 
            e.couponsPagination.count = 0, 
            e.isCouponRefreshing = !0, 
            r._httpGet_coupon(function() {
                e.isCouponRefreshing = !1
            })
        }, 
        e.getOrderStatusText = function(e) {
            for (var t = 0, i = YouPreset.ORDER_STATUS.length; t < i; t++)
                if (YouPreset.ORDER_STATUS[t].value == e) return YouPreset.ORDER_STATUS[t].text
        }, 
        e.getPaymentStatusText = function(e) {
            for (var t = 0, i = YouPreset.PAYMENT_STATUS.length; t < i; t++)
                if (YouPreset.PAYMENT_STATUS[t].value == e) return YouPreset.PAYMENT_STATUS[t].text
        }, 
        e.getShipmentStatusText = function(e) {
            for (var t = 0, i = YouPreset.SHIPMENT_STATUS.length; t < i; t++)
                if (YouPreset.SHIPMENT_STATUS[t].value == e) return YouPreset.SHIPMENT_STATUS[t].text
        }, 
        e.getPresetText = function(e, t) {
            var i = _.find(YouPreset.ORDER_STATUS, function(t) {
                return t.value == e
            });
            return i ? i.text : ""
        }
        , e.onClickSaveMetaField = function() {
            e.isSavingMetaField = !0, r.loading(!0), i.post("customer_updateAttributeMetaField", {
                id: e.attributeMetaField.id,
                owner_id: e.attributeMetaField.owner_id,
                fields: JSON.stringify(e.attributeMetaField.fields)
            }, function() {
                r.loading(!1), r._httpGetSingle(function() {
                    n.info({
                        text: "已保存附加信息"
                    }, !0), e.isSavingMetaField = !1
                })
            })
        }
    },
    _httpGetSingle: function(e) {
        var t = this;
        t.$scope;
        t.loading(!0), 
        this._$Uri.get("customer_getSingle", {id: this.getId()}, function(i) {
            t.onInitDone(i.data.customer), 
            t.loading(!1), 
            e && e()
        })
    },
    onInitDone: function(e) {
        var t = this._$scope;
        this._$Uri;
        e.point = e.point || 0, 
        e.last_year_point = e.last_year_point || 0, 
        e.total_point = e.point + e.last_year_point, 
        e.birthday_formatted = e.birthday, 
        t.customer = e, 
        t.attributeMetaField = e.attribute_meta_field
    },
    httpGetGrid: function() {
        var e = this.$scope,
            t = e.currentTab.tag;
        e.currentTab.initDone || (e.loadingGridData = !0, this["_httpGet_" + t](function() {
            e.currentTab.initDone = !0, e.loadingGridData = !1
        }))
    },
    _httpGet_trade: function(e) {
        var t = this._$scope,
            i = this._$Uri;
        i.get("trade_getAll", {
            page: this._tradePage,
            size: YouPreset.LIST_PAGE_SIZE,
            cid: this.getId()
        }, function(n) {
            _.forEach(n.data.trades, function(e) {
                _.forEach(e.items, function(e) {
                    e.image = i.getAssetUrl(e.image_path, "42x42")
                })
            }), 
            t.tradeList = n.data.trades, 
            t.tradeItemCount = n.data.item_count, 
            t.tradePagination.count = n.data.page_count, 
            t.dataTradeGrid.refresh(), e && e()
        })
    },
    _httpGet_point: function(e) {
        var t = this._$scope;
        this._$Uri.get("customer_getPointDetails", {
            page: this._pointPage,
            size: YouPreset.LIST_PAGE_SIZE,
            customer_id: this.getId()
        }, 
        function(i) {
            var n = i.data;
            t.pointTotalCount = n.item_count, 
            t.pointList = n.reward_point_details, 
            t.pointPagination.count = n.page_count, 
            t.dataPointGrid.refresh(), 
            e && e()
        })
    },
    _httpGet_credit: function(e) {
        var t = this._$scope;
        this._$Uri.get("customer_getCreditDetails", {
            page: this._creditPage,
            size: YouPreset.LIST_PAGE_SIZE,
            customer_id: this.getId()
        }, 
        function(i) {
            var n = i.data;
            t.creditTotalCount = n.item_count, 
            t.creditList = n.credit_record_details, 
            t.creditPagination.count = n.page_count, 
            t.dataCreditGrid.refresh(), 
            e && e()
        })
    },
    _httpGet_address: function(e) {
        var t = this._$scope;
        this._$Uri.get("customer_getAddresses", {
            customer_id: this.getId()
        }, 
        function(i) {
            t.addresses = i.data.addresses, 
            t.dataAddressesGrid.refresh(), 
            e && e()
        })
    },
    _httpGet_coupon: function(e) {
        var t = this._$scope;
        this._$Uri.get("customer_getCoupons", {
            page: this._couponPage,
            size: YouPreset.LIST_PAGE_SIZE,
            customer_id: this.getId()
        }, 
        function(i) {
            t.coupons = i.data.coupons, 
            t.couponsCount = i.data.item_count, 
            t.couponsPagination.count = i.data.page_count, 
            t.dataCouponsGrid.refresh(), 
            e && e()
        })
    }
});
CustomerEditController.$inject = ["$scope", "$rootScope", "$Uri", "$Popup", "$Time", "$Util", "$state"];
