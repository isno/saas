var BaseEditController = BaseController.extend({
    init: function(e, t, i, n, a, o, s) {
        var r = this;
        this._super(e),
        this._$scope = e,
        this._$rootScope = t,
        this._$Uri = i,
        this._$Popup = n,
        this._$Time = a,
        this._$timeout = o,
        this._$state = s,
        this._baseData = null,
        e.unSaved = function() {
            r._$rootScope.unsaved = !1
        },
        this._tagEdit || (this._tagEdit = this._tag + "edit"),
        this._tagUrl || (this._tagUrl = this._tag),
        this._tagData || (this._tagData = this._tag),
        this._id = function() {
            var e = i.getQuery().id,
            t = s && s.params && s.params.id;
            return e || t
        } (),
        e.isNew = this._isNew = !this._id || "new" == this._id,
        this._loadingCount = 0,
        e.showGrid = {
            display: "none",
            opacity: "0"
        },
        this.loading(!0),
        e.isBaseLoading = !0;
        var l = {
            finallyCallback: (this.onInitFinally || angular.noop).bind(this),
            errorCallback: (this.onInitError || angular.noop).bind(this)
        },
        c = function() {
            if (r._isNew) if (r._isPreCreate) {
                var e = {};
                r.onPreCreate && r.onPreCreate(e),
                i.post(r._tagUrl + "_preCreate", e,function(e) {
                    r._id = e.data[r._tagData].id,
                    r._beforeInitDone(e.data[r._tagData])
                },l)
            } else o(function() {
                r._beforeInitDone({}),
                l.finallyCallback()
            });
            else !function(e, t, n) {
                r._useRESTful ? (l.urlParams = t, i.get(e, null, n, l)) : i.get(e, t, n, l)
            } (r._tagUrl + "_getSingle", {id: r._id}, function(e) {
                r._beforeInitDone(e.data[r._tagData])
            })
        };
        this._httpBaseGet = c,
        c(),
        e.baseAvailable = !this._isNew,
        r.isNew() ? (e.titleAction = "新增", e.btnAction = "确认新增") : (e.titleAction = "编辑", e.btnAction = "保存"),
        e.onClickBaseBack = function() {
            "new" == i.getQuery().from ? i.historyBackCached(2) : i.historyBackCached()
        },
        e.onClickBaseSave = function(t) {
            var a = !0;
            if (t || (r.onSaveBefore && !r.onSaveBefore() && (a = !1), e.validation.validate(r._watchValid) || (a = !1)), !a) {
                var o = !1;
                return void(o && e.clickAdvanced && e.clickAdvanced(!0))
            }
            var s = {};
            s.v = e.baseV || "";
            var l = "";
            r.onSave && r.onSave(s),
            s.name ? l = s.name: s.title && (l = s.title),
            e.isBaseSaving = !0;

            var c = function(t, n) {
                if (e.isBaseSaving = !1, 200 == n) {
                    r._$rootScope.unsaved = !0,
                    t.data.id && (r._id = t.data.id),
                    t.data.data && t.data.data.id && (r._id = t.data.data.id);
                    if (!1 === (r.onSaveSuccess && r.onSaveSuccess(t))) return ! 1;
                    switch (r._tag) {
                    case "account":
                        r.isNew() ? r._$Popup.info({text: "已新增管理员 " + l},!0) : r._$Popup.info({text: "已保存权限"},!0);
                        break;
                    default:
                        r._$Popup.info({text:YouText.POPUP_INFO_SAVE_SUCCESS.replace("{x}", '"' + l + '"')},!0)
                    }
                    r.isNew() && i.setQuery(null, {id: r._id,from: "new"})
                }
            },
            d = function(t, i) {
                if (t && 201 == t.code && t.data && t.message) {
                    var o = "promotion" == r._tag || "product" == r._tag;
                    if (o && "partial" == s.range_type && t.message.indexOf("已有至少一个商品") > -1) return void(r._checkPromotionAvail && r._checkPromotionAvail(s.products))
                }
                if (e.isBaseSaving = !1, !1 === (r.onSaveError && r.onSaveError(t))) return ! 1;

                var c = t ? t.message: "保存失败，请重新操作";
                t && 208 !== t.code && n.info({type: "danger",text: c})
            },
            p = [s, c, {
                errorCallback: d,
                overrideError: !0,
                sendType: r._dataSaveType,
                urlParams: {id: r._id},
                tag: r._tag,
                forceSave: function() {
                    delete s.v,
                    r._$Uri[u].apply(r._$Uri, p)
                }
            }],
            u = "post"; !r._isPreCreate && r._isNew ? p.unshift(r._tagUrl + "_create") : (s.id = r._id, p.unshift(r._tagUrl + "_save"), r._useRESTful && (p.unshift("PUT"), u = "request")),
            r._$Uri[u].apply(r._$Uri, p)
        },
        e.onClickBaseUpdate = function(t) {
            var i = !0;
            if (t || (r.onSaveBefore && !r.onSaveBefore() && (i = !1), e.validation.validate(r._watchValid) || (i = !1)), !i) {
                var a = !1;
                return void(a && e.clickAdvanced && e.clickAdvanced(!0))
            }
            var o = {};
            o.v = e.baseV || "";
            var l = "";
            r.onSave && r.onSave(o),
            o.name ? l = o.name: o.title && (l = o.title),
            e.isBaseSaving = !0;
            var c = function(t, i) {
                if (e.isBaseSaving = !1, 200 == i) {
                    r._$rootScope.unsaved = !0,
                    t.data.id && (r._id = t.data.id),
                    t.data.data && t.data.data.id && (r._id = t.data.data.id);
                    if (!1 === (r.onSaveSuccess && r.onSaveSuccess(t))) return ! 1;
                    r._$Popup.info({text: YouText.POPUP_INFO_SAVE_SUCCESS.replace("{x}", '"' + l + '"')},!0),
                    s.reload()
                }
            },
            d = function(t, i) {
                if (t && 201 == t.code && t.data && t.message) {
                    var s = "promotion" == r._tag || "product" == r._tag;
                    if (s && "partial" == o.range_type && t.message.indexOf("已有至少一个商品") > -1) return void(r._checkPromotionAvail && r._checkPromotionAvail(o.products))
                }
                if (e.isBaseSaving = !1, !1 === (r.onSaveError && r.onSaveError(t))) return ! 1;
                var c = t ? t.message: "保存失败，请重新操作";
                t && 208 !== t.code && n.info({type: "danger",text: c})
            },
            p = [o, c, {
                errorCallback: d,
                overrideError: !0,
                sendType: r._dataSaveType,
                urlParams: {id: r._id},
                tag: r._tag,
                forceSave: function() {
                    delete o.v,
                    r._$Uri.post.apply(r._$Uri, p)
                }
            }];
            p.unshift(r._tagUrl + "_update"),
            r._$Uri.post.apply(r._$Uri, p);
        },
        e.onClickBaseDelete = function() {
            n.modalSimple({
                type: "remove",
                name: r._baseData.name,
                tag: r._tagCn,
                onConfirm: function() {
                    var t = function(t, i) {
                        200 == i && (r._$rootScope.unsaved = !0, e.onClickBaseBack(), n.closeAll(), n.info({
                            text: YouText.POPUP_INFO_REMOVE_SUCCESS.replace("{x}", r._baseData.name)
                        }));
                    };
                    r._useRESTful ? i.request("DELETE", r._tagUrl + "_remove", null, t, {urlParams: {id: r._id}}) : i.post(r._tagUrl + "_remove", {id: r._id},t)
                },
                onClose: function() {
                    n.closeAll()
                },
                onCancel: function() {
                    n.closeAll()
                }
            })
        },
        e.onClickBaseDuplicate = function() {
            var t, a, s = {
                tag: r._tag,
                tagUrl: r._tagUrl,
                tagCn: r._tagCn,
                tagData: r._tagData
            };
            switch (r._tag) {
            case "product":
                s.visibilityTips = "以此添加的新" + r._tagCn + "默认是下架的",
                t = "复制_" + e.baseName,
                a = "复制商品";
                break;
            case "shipment":
                t = "复制_" + e.data.name,
                a = "复制运费模板"
            }
            n.modal({
                title: a,
                content: '<h3 class="summit-h3">新{{data.tagCn}}名称</h3><div><input class="input input-long" ng-model="duplicateName" you-validation="required" maxlength="255" /></div><div ng-if="data.visibilityTips"><span style="color:#aaa;">{{data.visibilityTips}}</span></div><br><br>',
                btn: [{
                    type: "loading",
                    hide: !0
                },
                {
                    type: "default",
                    text: YouText.POPUP_MODAL_BTN_CANCEL,
                    click: "cancel"
                },
                {
                    type: "primary",
                    text: YouText.POPUP_MODAL_BTN_CONFIRM,
                    click: "confirm",
                    enter: !0
                }],
                scope: {
                    confirm: function(e, t) {
                        if (!e.validation.validate(["duplicateName"])) return void(t.confirm = !1);
                        t.data.btn[0].hide = !1,
                        t.data.btn[1].hide = !0,
                        t.data.btn[2].hide = !0,
                        i.post(s.tagUrl + "_duplicate", {
                            id: r._id,
                            name: e.duplicateName
                        },
                        function(t) {
                            var i = t.data[s.tagData].id;
                            n.closeSp(),
                            n.modal({
                                title: "页面跳转",
                                popStyle: {
                                    width: "620px",
                                    height: "300px"
                                },
                                content: '<div class="pop-path"><div class="pop-path-block" ng-click="duplicateStay()">留在当前{{data.tagCn}}页</div> <div class="pop-path-block" ><a href="#/{{data.tagUrl}}edit?id={{id}}" ng-click="duplicateGoNew($event)" class="pop-path-block-a">去复制的新{{data.tagCn}}页</a></div></div>',
                                initModel: {
                                    data: s,
                                    id: i,
                                    duplicateStay: function() {
                                        n.closeAll()
                                    },
                                    duplicateGoNew: function(e) {
                                        return e.preventDefault(),
                                        history.back(),
                                        n.closeAll(),
                                        o(function() {r._$Uri.setQuery(s.tag + "edit", {id: i})},100),
                                        !1
                                    }
                                },
                                onClose: function() {
                                    n.closeAll()
                                }
                            }),
                            n.info({text: "已复制" + s.tagCn + " " + e.duplicateName})
                        })
                    },
                    cancel: function() {
                        n.close()
                    }
                },
                focus: "input",
                initModel: {
                    duplicateName: t,
                    data: s
                }
            })
        }
    },
    isNew: function() {
        return this._isNew
    },
    getId: function() {
        return this._id
    },
    _beforeInitDone: function(e) {
        var t = this;
        angular.isFunction(this.onBeforeInitDone) ? this.onBeforeInitDone(e,
        function() {
            t._initDone(e)
        }) : this._initDone(e)
    },
    _initDone: function(e) {
        var t = this;
        this._baseData = e,
        this.onInitDone(e);
        var i = this._$scope;
        if (this.loading(!1), i.isBaseLoading = !1, i.showGrid = {
            display: "block",
            opacity: "100"
        },
        this._watchChange) {
            var n = function(e, i) {
                "" === e && null == i || e != i && (t._$rootScope.unsaved = !1)
            };
            _.forEach(this._watchChange, function(e) {
                i.$watch(e, n)
            })
        }
    },
    loading: function(e) {
        var t = this;
        e ? ++t._loadingCount: --t._loadingCount,
        t._loadingCount < 0 && (t._loadingCount = 0),
        t._$Popup.loading(t._loadingCount)
    }
});
BaseEditController.$inject = [];

/** end */
BaseEditPageController = BaseEditController.extend({
    _watchChange: ["baseName", "baseDesc", "baseVisibility"],
    _watchValid: ["baseName"],
    init: function(e, t, i, n, a, o, s) {
        YouText.init("product"),
        this._super(e, t, i, n, null, a, s),
        this._$timeout = a,
        this._$util = o,
        e.HTMLENCODE = o.htmlEnDeCode.htmlEncode;
        var r = this;
        o.initTinyMce(e),
        r._previewUrl = null,
       
        e.onClickBaseViewQrcode = function(t) {
            
        }
    },
    onInitDone: function(e) {
        var t = this,
        i = this._$scope;
        i.$watch("baseName",
        function(e, t) {
            i.basePageTitle == t && (!e || e.length <= 100) && (i.basePageTitle = e)
        }),
        this.isNew() ? i.baseVisibility = "false": (i.baseName = t._$util.htmlEnDeCode.htmlDecode(e.name), i.baseDesc = e.desc, i.baseVisibility = String(e.visibility)),
        i.baseHandlePrefix = URI("/" + this._tag + "s/").toString(),
        this.isNew()
    },
    onSave: function(e) {
        var t = this,
        i = this._$scope;
        e.name = t._$util.htmlEnDeCode.htmlEncode(i.baseName),
        e.desc = i.baseDesc,
        e.visibility = i.baseVisibility,
        t.onChildSave && t.onChildSave(e)
    },
    onSaveSuccess: function() {
    }
});
BaseEditPageController.$inject = [];