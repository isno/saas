/** popup start */
(function(){
    var e = Class.extend({
        _tplMask: "<you-mask></you-mask>",
        _tplblackMask: '<you-mask type="black"></you-mask>',
        _tplBtminfo: '<you-btminfo data="PopupBtmData"></you-btminfo>',
        _tplModal: '<you-popwindow data="PopupModalData">#{content}</you-popwindow>',
        _tplModalVendor: '<you-pop-vendor data="PopVendorData"></you-pop-vendor>',
        _tplModalProduct: '<you-pop-product data="PopProductData"></you-pop-product>',
        _tplModalCustomer: '<you-pop-customer data="PopCustomerData"></you-pop-customer>',

        _modalArr:[],
        _mask: null,
        _modal: null,
        _gotop: null,
        _rootScope:null,
        _timeout:null,
        
        loading: function (e) {
            var t = this;
            e ? t._rootScope.$emit("popuploading.true") : t._rootScope.$emit("popuploading.false")
        },

        products: function (e) {
            var t = this,i = t._rootScope.$new(!0);
            i.PopProductData = {
                title: e.title,
                footerTip: e.footerTip,
                products: e.products,
                onDone: e.onDone
            };
            var n = t._tplModalProduct;
            return t._modalProduct = t._compile(n)(i), 
            t._body.append(t._modalProduct),
            i
        }, 
        closeProducts: function () {
            if (this._modalProduct) {
                angular.element(this._modalProduct).scope().$destroy(), 
                this._modalProduct.remove(), 
                delete this._modalProduct
            }
        },

        closeVendor: function () {
            if ($("body").css("padding-right", "0"), $("body").css("overflow", "auto"), this._modalVendor) {
                angular.element(this._modalVendor).scope().$destroy(), 
                this._modalVendor.remove(), 
                delete this._modalVendor
            }
        },
        vendor: function (e) {
            e || (e = {});
            var t = this,
                i = $("body").width(),
                n = 0;
            $("body").css("overflow", "hidden"), n = $("body").width();
            var a = n - i;
            a > 0 && $("body").css("padding-right", a + "px");
            var o = t._rootScope.$new(!0);
            o.PopVendorData = e;
            var s = t._tplModalVendor;
            return t._modalVendor = t._compile(s)(o), 
            t._body.append(t._modalVendor),
            o
        },

        mask: function (e) {
            var t = this,
            i = t._rootScope.$new(!0), 
            n = t._tplblackMask;

            "white" == e && (n = t._tplMask), 
            t._mask = t._compile(n)(i), 
            t._timeout(function () {
                t._body.append(t._mask)
            })
        },
        modal: function (e) {
            function t() {
                i._modalScope = s;
                var e = {
                    modal: i._modal,
                    modalScope: i._modalScope
                };
                o && (e.mask = i._mask), 
                i._modalArr.push(e);

                var t = i._modalArr.length,
                    a = i._modalZindex + t,
                    r = i._maskZindex + t;
                i._mask.css("zIndex", r), 
                i._modal.css("zIndex", a), 
                i._body.append(i._modal), 
                n.addClass(i._noScroll)
            }
            var i = this,
                n = i._html,
                a = !1,
                o = !1;
            i._mask && (a = !0), a && !e.forceMask || (i.mask(), o = !0);
            var s = i._rootScope.$new(!0),
                r = !1;
            e.templateUrl && (r = !0, 
                s.onTemplateLoaded = t, 
                s.templateUrl = URI("/static/main/html/popups/").filename(e.templateUrl).toString(), 
                e.content = '<div ng-include="templateUrl" onload="onTemplateLoaded()"></div>'),

                s.PopupModalData = {
                    title: e.title,
                    scope: e.scope,
                    btn: e.btn,
                    checkbox: e.checkbox,
                    focus: e.focus,
                    noX: e.noX,
                    showMaximize: e.showMaximize,
                    contentextclass: e.contentextclass,
                    initModel: e.initModel,
                    notpreventDefault: e.notpreventDefault,
                    notpreventScroll: e.notpreventScroll,
                    returnElm: e.returnElm,
                    onClose: e.onClose,
                    popStyle: e.popStyle,
                    onAfterMin: e.onAfterMin,
                    onAfterMax: e.onAfterMax,
                    addCtrlBg: e.addCtrlBg,
                    bTemplate: r
                };
                var l = i._tplModal.replace("#{content}", e.content);
                return i._modal = i._compile(l)(s), 
                r || t(), 
                s
        },
        modalSimple: function (e) {
            var t = {},
            i = this;
            if ("danger" == e.type) t.forceMask = e.forceMask, 
                "管理员" === e.tag ? t.title = "提示" : t.title = e.action + (e.tag ? e.tag : ""), 
            e.content ? t.content = e.content : e.tag ? t.content = YouText.POPUP_MODAL_CONTENT_CONFIRM_TAG.replace("{a}", e.action).replace("{t}", e.tag).replace("{x}", e.name) : t.content = YouText.POPUP_MODAL_CONTENT_CONFIRM.replace("{a}", e.action).replace("{x}", e.name), 
            t.btn = [{
                type: "loading",
                hide: !0
            }, 
            {
                type: "default",
                text: YouText.POPUP_MODAL_BTN_CANCEL,
                click: "cancel"
            }, 
            {
                type: "danger",
                text: YouText.POPUP_MODAL_BTN_CONFIRM,
                click: "confirm",
                enter: !0
            }],
            e.isRemove && (t.btn[2].text = YouText.POPUP_MODAL_BTN_CONFIRM_REMOVE), 
            t.scope = {
                confirm: function (t, i) {
                    i.data.btn[0].hide = !1, 
                    i.data.btn[1].hide = !0, 
                    i.data.btn[2].hide = !0, 
                    e.onConfirm && e.onConfirm()
                }, cancel: function () {
                    e.onCancel ? e.onCancel() : i.close()
                }
            }, e.onClose && (t.onClose = function () {
                e.onClose()
            });
            else {
                if ("remove" == e.type) return e.type = "danger", e.action = YouText.POPUP_MODAL_ACTION_REMOVE, e.isRemove = !0, "管理员" === e.tag && (e.content = '<div style="padding-top:5px;">删除管理员<strong>"' + e.name + '"</strong>后，管理员将无法继续登录网站后台进行管理，确认是否删除？</div>'), void i.modalSimple(e);
                "msg" == e.type ? (t.forceMask = e.forceMask, t.title = e.title, t.content = e.content, t.btn = [{
                        type: "primary",
                        text: YouText.POPUP_MODAL_BTN_CONFIRM,
                        click: "confirm",
                        enter: !0
                    }], t.scope = {
                        confirm: function () {
                            i.close()
                        }
                    }) : "confirm" === e.type && (t.forceMask = e.forceMask, t.title = e.title || "确认", t.content = e.content, t.btn = [{
                        type: "loading",
                        hide: !0
                    }, {
                        type: "default",
                        text: YouText.POPUP_MODAL_BTN_CANCEL,
                        click: "cancel"
                    }, {
                        type: "primary",
                        text: YouText.POPUP_MODAL_BTN_CONFIRM,
                        click: "confirm",
                        enter: !0
                    }], e.isRemove && (t.btn[2].text = YouText.POPUP_MODAL_BTN_CONFIRM_REMOVE), t.scope = {
                        confirm: function (t, i) {
                            i.data.btn[0].hide = !1, 
                            i.data.btn[1].hide = !0, 
                            i.data.btn[2].hide = !0, 
                            e.onConfirm && e.onConfirm()
                        }, cancel: function () {
                            e.onCancel ? e.onCancel() : i.close()
                        }
                    }, e.onClose && (t.onClose = function () {
                        e.onClose()
                    }))
                }
                this.modal(t)
            },

        close: function (e, t, i) {
            var n, a = this,
                o = a._html,
                s = e,
                r = !1;
            if (!s) {
                if (s = "modal", i && 1 == a._modalArr.length ? (n = a._modalArr[0], r = !0) : n = a._modalArr.pop(), !n) return;
                a._modal = n.modal, 
                a._modalScope = n.modalScope, 
                n.mask && (a._mask = n.mask)
            }
            a["_" + s] && (a["_" + s].remove(), 
                a["_" + s] = null, 
                a._modalScope.$destroy(), 
                a._modalScope = null), 
            r || n.mask && a.removeMask(), 
            o.removeClass(a._noScroll), 
            t && t()
        },
        removeMask: function() {
            var e = this;
            e._mask && (e._mask.remove(), e._mask = null)
        },

        closeAll: function (e) {
            var t = this;
            _.forEach(t._modalArr, function () {
                t.close()
            }), e && e()
        },

        closeSp: function () {
                this.close("", null, !0)
            },
        info: function (e, t) {
            var i = this;
            i.infoRemove();
            var n = i._rootScope.$new(!0);
   
            e.text || (e.text = "lost text"), e.type || (e.type = ""), 
            e.timeout || (e.timeout = 4e3), 
            n.PopupBtmData = {
                type: e.type,
                text: e.text
            };
            var a = function () {
                i._btminfo = i._compile(i._tplBtminfo)(n), 
                i._body.append(i._btminfo)
            };
            t ? i._timeout(function () {a()}, 500) : a(), 
            i._btminfoTimeout = i._timeout(function () {
                i._btminfoTimeout = null, i.infoRemove()
            }, e.timeout)
        }, 
        infoRemove: function () {
            var e = this;
            e._btminfo && (e._btminfoTimeout && e._timeout.cancel(e._btminfoTimeout), 
                e._btminfo.remove(), 
                e._btminfo = null)
        }, 

        showGoTop: function (e) {
            var t = this;
            if (e)
                if (t._gotop);
                else {
                    var i = t._rootScope.$new(!0);
                    t._gotop = t._compile(t._tplGotop)(i), t._body.append(t._gotop)
                } 
                else t.domRemove("_gotop")
        },
        domRemove: function (e) {
            var t = this;
            t[e] && (t[e].remove(), t[e] = null)
        },
        customers: function (e) {
                var t = this,
                    i = t._tplModalCustomer,
                    n = t._rootScope.$new(!0);
                n.PopCustomerData = {
                    title: e.title,
                    customers: e.customers,
                    onDone: e.onDone,
                    mode: e.mode,
                    msg: e.msg
                }, t._modalCustomer = t._compile(i)(n), t._body.append(t._modalCustomer)
            }, closeCustomers: function () {
                if (this._modalCustomer) {
                    angular.element(this._modalCustomer).scope().$destroy(), this._modalCustomer.remove(), delete this._modalCustomer
                }
            },

         area: function (e) {
                var t = this;
                e || (e = {});
                var i = window.YouArea.get(),
                    n = e.checked,
                    a = e.checkedLimit,
                    o = e.excluded,
                    s = e.isInverse;
                _.forEach(i, function (e) {
                    e.canSelect = !1, e.selected = !0, e.isBan = !0, _.forEach(e.province, function (t) {
                        t.isExpanded = !1, 
                        t.canSelect = !1, 
                        t.selected = !0, 
                        t.isBan = !0, 
                        _.forEach(t.cities, function (i) {
                            a && -1 != a.indexOf(i.post) ? (i.selected = !0, i.canSelect = !1, e.isBan = !1, t.isBan = !1) : n && -1 != n.indexOf(i.post) ? (i.selected = !0, i.canSelect = !0, t.canSelect = !0, e.canSelect = !0, e.isBan = !1, t.isBan = !1) : o && -1 != o.indexOf(i.post) ? (i.selected = !0, i.canSelect = !1, i.isBan = !0) : (i.selected = !1, t.selected = !1, e.selected = !1, i.canSelect = !0, t.canSelect = !0, e.canSelect = !0, e.isBan = !1, t.isBan = !1)
                        })
                    })
                });
                var r = function (e, t) {
                        var i = !0;
                        _.forEach(t.cities, function (e) {
                            e.selected || (i = !1)
                        }), 
                        t.selected = i, 
                        l(e)
                    },
                    l = function (e) {
                        var t = !0;
                        _.forEach(e.province, function (e) {
                            e.selected || (t = !1)
                        }), 
                        e.selected = t
                    };
                this.modal({
                    contentextclass: "pop-area-win",
                    notpreventDefault: !0,
                    popStyle: {
                        width: "888px",
                        height: "700px"
                    },
                    title: e.title,
                    btn: [{
                        text: YouText.POPUP_MODAL_BTN_CANCEL,
                        click: "cancel"
                    }, {
                        type: e.btnType ? e.btnType : "primary",
                        text: e.btnText ? e.btnText : YouText.POPUP_MODAL_BTN_CONFIRM,
                        click: "confirm"
                    }],
                    content: '<div class="pop-area" ng-class="isInverse ? \'check-inverse\':\'\'"><div class="pop-area-row" ng-repeat="a in areas"> <div class="pop-area-provinces">  <div class="pop-area-region">   <label ng-disabled="!a.canSelect">    <input type="checkbox" you-check ng-model="a.selected" ng-disabled="!a.canSelect" ng-change="changeCheck(a)">{{a.region}}    <span ng-if="a.isBan" class="pop-area-checkbox-warning" ng-click="noClick($event)"><span you-hint3>已被设为 “不出售地区”</span></span>   </label><i class="ico ico-arrow-1"></i>  </div>  <div class="pop-area-province" ng-repeat="p in a.province">   <label ng-disabled="!p.canSelect">    <input type="checkbox" you-check ng-model="p.selected" ng-disabled="!p.canSelect" ng-change="changeCheck(a, p)">{{p.name}}    <span ng-if="p.isBan" class="pop-area-checkbox-warning" ng-click="noClick($event)"><span you-hint3>已被设为 “不出售地区”</span></span>   </label>   <span class="pop-area-cities-count">{{getCitiesCount(p)}}</span>   <div class="pop-area-province-arrow" ng-click="toggleProvince(p)">    <i class="ico ico-arrow-3" ng-if="!p.isExpanded"></i><i class="ico ico-arrow-4" ng-if="p.isExpanded"></i>   </div>  </div> </div> <div class="pop-area-cities" ng-if="p.isExpanded" ng-repeat="p in a.province">  <i class="ico ico-arrow-5" class="pop-area-cities-arrow" ng-style="citiesArrowStyle($index)"></i>  <div class="pop-area-city" ng-repeat="c in p.cities">   <label ng-disabled="!c.canSelect">    <input type="checkbox" you-check ng-model="c.selected" ng-disabled="!c.canSelect" ng-change="changeCheck(a, p, c)">{{c.name}}    <span ng-if="c.isBan" class="pop-area-checkbox-warning" ng-click="noClick($event)"><span you-hint3>已被设为 “不出售地区”</span></span>   </label>  </div> </div></div></div><br>',
                    initModel: {
                        areas: i,
                        isInverse: s,
                        noClick: function (e) {
                            e.preventDefault()
                        }, 
                        getCitiesCount: function (e) {
                            var t = 0;
                            return _.forEach(e.cities, function (e) {
                                e.selected && e.canSelect && t++
                            }), 
                            t ? "(" + t + ")" : ""
                        }, 
                        toggleProvince: function (e) {
                            var t = e.isExpanded;
                            _.forEach(this.areas, function (e) {
                                _.forEach(e.province, function (e) {
                                    e.isExpanded = !1
                                })
                            }),
                            e.isExpanded = !t
                        }, 
                        citiesArrowStyle: function (e) {
                            return {
                                left: [135, 250, 370, 490, 610, 725][e] + "px"
                            }
                        }, 
                        changeCheck: function (e, t, i) {
                            var n;
                            i ? r(e, t) : t ? (n = t.selected, _.forEach(t.cities, function (e) {
                                e.canSelect && (e.selected = n)
                            }), l(e)) : (n = e.selected, _.forEach(e.province, function (e) {
                                e.canSelect && (e.selected = n, _.forEach(e.cities, function (e) {
                                    e.canSelect && (e.selected = n)
                                }))
                            }))
                        }
                    },
                    scope: {
                        cancel: function () {
                            t.close()
                        }, confirm: function (n) {
                            var a = [];
                            _.forEach(i, function (e) {
                                _.forEach(e.province, function (e) {
                                    _.forEach(e.cities, function (e) {
                                        e.selected && e.canSelect && a.push(e.post)
                                    })
                                })
                            }), 
                            e && e.onDone(a.toString()), 
                            t.close()
                        }
                    }
                })
            },
            

    });

    t = Class.extend({
        instance: new e,
        $get: ["$document", "$compile", "$rootScope", "$timeout",
            function (e, t, i, n, a) {
                return this.instance._document = e, 
                this.instance._compile = t, 
                this.instance._rootScope = i, 
                this.instance._timeout = n,  
                this.instance._body = e.find("body").eq(0), 
                this.instance._html = e.find("html").eq(0), 
                this.instance
            }
        ]
    });
    angular.module("services.$Popup", []).provider("$Popup", t)

}());