var youTagselectorDirective = BaseController.extend({
    init: function (e, t, i, n, a, o, s, r, l, c) {
        function d(t) {
            switch (t.keyCode) {
            case 13:
                if (e.isSearching) return;
                if (!e.inputIsFocus) return;
                e.fCreate();
                break;
            case 27:
                Y()
            }
        }
        var p = '<a href="javascript:void(0);">#{text}</a>';
        e.placeholder = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", 
        e.HTMLENCODE = l.htmlEnDeCode.htmlEncode, 
        e.HTMLDECODE = l.htmlEnDeCode.htmlDecode, 
        e.bEmpty = !0, 
        e.data || (e.data = {});
        var u, m, g, f, h, v, y, b, w, x, k, C, S = function () {
            u = e.data, m = u.cnname ? u.cnname : "内容", 
            e.cnname = m, 
            g = "搜索中...", 
            f = "正在添加...", 
            h = "search" == u.mode ? "搜索不到相关" + m : "搜索不到相关" + m + "，可点击创建", 
            v = "search" == u.mode ? "" : ",请在上方输入框创建新的{x}!", 
            y = u.cnname ? u.cnname + v : "相关内容", b = "你的店铺还没有" + y, 
            w = "请输入新的" + m + "名称，点击“创建”。", 
            x = "创建" + m, 
            "品牌" != u.cnname && "分类" != u.cnname || (b = "暂无" + u.cnname + "，请创建"), 
            "优惠券" == u.cnname && (b = "你还未创建优惠券，请先新增优惠券"), 
            k = u.inputMaxLength ? u.inputMaxLength : "255", 
            C = c.trustAsHtml(u.noResultExtHTML), 
            e.btnname = e.data.btnname, 
            e.btnnameUniq = e.data.btnnameUniq, 
            e.btnnameBeforeText = e.data.btnnameBeforeText || "", 
            e.inputMaxLength = k, 
            e.btnnameUniq && (e.btnnameUniqStyle = {
                position: "relative",
                right: "0",
                top: "12px"
            }), 
            e.isSearchingMode = "search" == e.data.mode, 
            e.isUniq = !!e.data.isUniq, 
            e.listStyle = e.data.listStyle ? e.data.listStyle : {
                display: e.data.notshowlist ? "none" : "table-cell"
            }, 
            e.staticMode = e.data.staticMode && !0, 
            e.forbiddenDel = e.data.forbiddenDel || !1, 
            e.inputplaceholder = u.inputplaceholder, 
            e.isUniq ? e.itemclass = "uniq-sel" : e.itemclass = "tag-select-selected-tag", 
            e.isSearchingMode && (e.searchinput = "314px"), 
            e.data.searchinput && (e.searchinput = e.data.searchinput), 
            e.impactStyle = {}, 
            e.data.impactshow && (e.impactStyle = {
                "max-width": "88px",
                "white-space": "nowrap"
            })
        };
        S(), 
        e.$watch("data.reConfig", function () {
            e.data.reConfig && S()
        }), 
        e.$watch("data.url", function (t) {
            t && (u.list = t[0], u.create = t[1], u.remove = t[2], "notPost" == t[1] && e.data.urlCreate && (u.create = e.data.urlCreate, u.remove = e.data.urlCreate))
        }, !0), e.$watchCollection("data.orgData", function () {
            e.active = e.data.orgData, e.active && e.active[0] && e.btnnameUniq && (e.data.btnname = e.btnnameBeforeText + (e.active[0].name || e.active[0].desc || e.active[0].title))
        }), e.$watch("data.cnname", function (e) {
            e && (u.cnname = e, m = u.cnname ? u.cnname : "内容", y = u.cnname ? u.cnname + v : "相关内容", b = "你的网站还没有" + y, "品牌" != u.cnname && "分类" != u.cnname || (b = "暂无" + u.cnname + "，请创建"), "优惠券" == u.cnname && (b = "你还未创建优惠券，请先新增优惠券"), h = "search" == u.mode ? "搜索不到相关" + m : "搜索不到相关" + m + "，可点击创建")
        }, !0), e.$watch("active", function (t, i) {
            var n = t || [],
                a = i || [];
            e.data.sync && e.data.sync(n, a, e), u.btnautostatus && (e.bEmpty = 0 === n.length)
        }, !0), e.$watch("data.uid", function () {
            e.uid = e.data.uid
        }, !0), e.bShowBtn = !0, e.$watchCollection("data.addPicBtn", function () {
            e.bShowBtn = !(e.data.addPicBtn || e.data.addPicBtnBig || e.data.addTextBtn)
        }), 
        e.$watchCollection("data.addPicBtnBig", function () {

            e.bShowBtn = !(e.data.addPicBtn || e.data.addPicBtnBig || e.data.addTextBtn);
        }), 
        e.$watchCollection("data.addTextBtn", function () {
            e.bShowBtn = !(e.data.addPicBtn || e.data.addPicBtnBig || e.data.addTextBtn)
        });
        var P = angular.element(t.children()[6]);
        e.bShowing = !1, 
        e.fShow = function (t) {
            e.bShowing || (e.bShowing = !0, B(!0), e.searchTxt = "", T(), L(t))
        }, 
        e.popManager = function () {
            switch (e.data.uniparam) {
            case "types":
                n.setQuery("product/type", !1);
                break;
            case "vendors":
                n.setQuery("product/vendor", !1);
            }
            Y()
        };
        var T = function (t) {
            var i = {};
            if (i.page = e.dataPagination.current, e.searchTxt ? i.search = e.HTMLENCODE(e.searchTxt) : i.search = null, i = D(i, e.data.queryparam), "types" == e.data.uniparam || "vendors" == e.data.uniparam || "tags" == e.data.uniparam || "post_tags" == e.data.uniparam) switch (e.showmanager = !0, e.data.uniparam) {
            case "types":
                e.managerId = "tid";
                break;
            case "vendors":
                e.managerId = "vid"
            }
            if ("coupon_groups" == e.data.uniparam && (i.active_earlier = e.data.dataDatetime.timeStart ? moment(e.data.dataDatetime.timeStart).format() : "", i.active_later = "9999-12-30T00:00:00+00:00"), t) {
                var a = {};
                a[e.data.uniparam] = e.allData, 
                A(a)
            } else n.get(u.list, i, function (e) {
                A(e.data)
            })
        };
        e.getList = T;
        var   A = function (t) {
                var i = [];
                if (_.forEach(t[e.data.uniparam], function (t) {
                    var n = {};
                    n[e.data.queryname] = t[e.data.queryname];
                    var a = _.find(e.active, n);
                    t.classname = "", a && (t.classname = "selected"), e.data.prefixParam = e.data.prefixParam || "visibility", e.data.prefixActiveValue = e.data.prefixActiveValue || !1;
                    var o = "";
                    if (void 0 !== t[e.data.prefixParam]) {
                        var s = "",
                            r = !1;
                        switch (e.data.uniparam && e.data.uniparam[0] && (o = "string" == typeof e.data.uniparam ? e.data.uniparam : e.data.uniparam[0]), o) {
                        case "products":
                            s = "[已下架]";
                            break;
                        case "coupon_groups":
                            s = "[未开始]";
                        }
                        t.nameprefix = t[e.data.prefixParam] === e.data.prefixActiveValue || r ? s : ""
                    }
                    "function" == typeof e.data.suffix && (t.suffix = e.data.suffix(t)), "coupon_groups" === o ? (Date.parse(t.expired_at) - e.data.dataDatetime.timeEnd >= 0 || !t.expired_at) && i.push(t) : i.push(t)
                }), 0 === i.length) {
                    e.isSearching = !1, 
                    e.showTips = !0;
                    var n = [];
                    0 === e.searchTxt.length ? "商品分类" == u.cnname ? b.indexOf("{x}") > -1 ? e.tips = b.replace("{x}", "分类").split(",") : (n[0] = b, e.tips = n) : "商品品牌" == u.cnname ? b.indexOf("{x}") > -1 ? e.tips = b.replace("{x}", "品牌").split(",") : (n[0] = b, e.tips = n) : "轻博客标签" == u.cnname ? b.indexOf("{x}") > -1 ? e.tips = b.replace("{x}", "标签").split(",") : (n[0] = b, e.tips = n) : "文章标签" == u.cnname ? b.indexOf("{x}") > -1 ? e.tips = b.replace("{x}", "标签").split(",") : (n[0] = b, e.tips = n) : e.tips = b.split("|") : e.tips = h.split("|"), e.noResultExtHTML = C
                } else B(!1);
                e.dataPagination.count = t.page_count, 
                e.allData = i
            },
            D = function (e, t) {
                var i = _.clone(e);
                return t && (i = _.assign(t, e)), i
            },
            I = function (t, i) {
                if (e.isSubmiting = !0, e.data.lengthlimit) {
                    var a = e.data.lengthlimit;
                    if (e.active.length >= a) return e.data.lengthlimitCall ? e.data.lengthlimitCall() : alert("超过限制了"), Y(), void(e.isSubmiting = !1)
                }
                var o = O(t);
                o = D(o, e.data.addparam), 
                e.isUniq ? 0 === e.active.length ? n.post(u.create, o, function (t) {
                    e.isSubmiting = !1, i(t)
                }, {
                    errorCallback: function () {
                        e.isSubmiting = !1
                    }
                }) : 1 == e.active.length ? M(e.active[0], function () {
                    n.post(u.create, o, function (t) {
                        e.isSubmiting = !1, i(t)
                    }, {
                        errorCallback: function () {
                            e.isSubmiting = !1
                        }
                    })
                }) : (e.isSubmiting = !1, alert("uniq tag has many result?")) : n.post(u.create, o, function (t) {
                    e.isSubmiting = !1, 
                    i(t)
                }, {
                    errorCallback: function () {
                        e.isSubmiting = !1
                    }
                })
            };
        e.fCreate = function () {
            if (!e.isSearchingMode && e.validation.validate(["searchTxt"])) {
                if ("" == e.searchTxt) return void r.modal({
                    title: x,
                    content: w,
                    btn: [{
                        type: "primary",
                        text: "确定",
                        click: "cancelPop"
                    }],
                    scope: {
                        cancelPop: function () {
                            r.close()
                        }
                    },
                    forceMask: !0
                });
                var t = {};
                t[e.data.queryname] = e.searchTxt;
                var i = _.find(e.active, t);
                e.searchTxt = "", i || (e.isSearching = !0, e.tips = f.split("|"), I(t, function (i) {
                    if (T(), e.isUniq) {
                        Y();
                        var n = [];
                        i.data && i.data.id && (t.id = i.data.id), 
                        n.push(t), 
                        e.active = n, 
                        e.btnnameUniq && (e.data.btnname = e.btnnameBeforeText + (t.name || t.desc || t.title))
                    } else i.data && i.data.id && (t.id = i.data.id), e.active.push(t)
                }))
            }
        }, 
        e.fClick = function (t) {
            if (!e.isSubmiting) {
                var i = e.allData[t],
                    n = {};
                n[e.data.queryname] = i[e.data.queryname];
                var a = _.find(e.active, n);
                if (!a || !e.forbiddenDel)
                    if (e.allData[t].classname = "loading", a) {
                        e.willDeleteIndex = t;
                        var o = {};
                        o[e.data.queryname] = a[e.data.queryname], e.staticMode ? (e.active = _.reject(e.active, o), T(!1), e.btnnameUniq && (e.data.btnname = e.btnname)) : M(a, function () {
                            T(), 
                            e.active = _.reject(e.active, o), 
                            e.btnnameUniq && (e.data.btnname = e.btnname)
                        })
                    } else if (e.staticMode)
                    if (T(!1), e.isUniq) {
                        Y();
                        var s = [],
                            r = _.find(e.allData, n);
                        s.push(r), e.active = s, 
                        e.btnnameUniq && (e.data.btnname = e.btnnameBeforeText + (i.name || i.desc || i.title))
                    } else {
                        var l = _.find(e.allData, n);
                        l && e.active.push(l)
                    } else I(i, function () {
                    if (T(), e.isUniq) {
                        var t = [];
                        t.push(n), 
                        e.active = t, 
                        e.active.name || void 0 !== i.name && (e.active[0].name = i.name), 
                        e.btnnameUniq && (e.data.btnname = e.btnnameBeforeText + (i.name || i.desc || i.title)), 
                        Y()
                    } else {
                        var a = _.find(e.allData, n);
                        a && e.active.push(a)
                    }
                })
            }
        }, e.fDelCancel = function () {
            a(function () {
                e.allData[e.willDeleteIndex].classname = "selected", 
                r.close()
            })
        };
        var M = function (t, i, a) {
            if (e.isSubmiting = !0, e.data.delConfirmFn && !a) return void e.data.delConfirmFn(t, i, e);
            var o = O(t);
            if (o = D(o, e.data.delparam), u.create == u.remove) return e.isSubmiting = !1, void i();
            n.post(u.remove, o, function () {
                e.isSubmiting = !1, i()
            }, {
                errorCallback: function () {
                    e.isSubmiting = !1
                }
            })
        };
        e.removeObj = M;
        var O = function (t) {
            var i = {};
            i[e.data.uname] = e.uid;
            var n = {};
            n[e.data.queryname] = e.HTMLENCODE(t[e.data.queryname]);
            var a = D(i, n);
            return e.data.mapper && _.forEach(e.data.mapper, function (e, t) {
                a[e] = a[t], delete a[t]
            }), a
        };
        e.buildParam = O, 
        e.fDel = function (t) {
            var i = {};
            i[e.data.queryname] = e.active[t][e.data.queryname], 
            e.staticMode ? (T(!1), e.active = _.reject(e.active, i)) : M(i, function () {
                T(), e.active = _.reject(e.active, i)
            })
        }, 
        e.fDelUniq = function (t) {
            e.isUniq && e.fDel(t)
        };
        var U, N = !0;
        e.fTextChange = function () {
            N || U || (U = a(function () {
                a.cancel(U), B(!0), 
                e.dataPagination.current = 1, 
                U = null, 
                T()
            }, 200))
        }, e.stopProp = function (e) {
            e.preventDefault(), 
            e.stopPropagation()
        };
        var L = function (i) {
                var n = i.toElement || i.target;
                e.data.directionUp ? (e.arrowStyle = {
                    top: "auto",
                    bottom: "-10px"
                }, e.arrowDownStyle = "ico-box-arrow-down", P.css({
                    position: "absolute",
                    top: "-260px",
                    left: n.offsetLeft + "px",
                    display: "block"
                })) : P.css({
                    position: "absolute",
                    top: n.offsetTop + n.offsetHeight + 10 + "px",
                    left: n.offsetLeft + "px",
                    display: "block"
                }), 
                e.data.themeSettingStyle && (e.data.themeSettingStyle.panel && P.css(e.data.themeSettingStyle.panel), 
                    e.data.themeSettingStyle.arr && (e.arrowStyle = e.data.themeSettingStyle.arr)), 
                a(function () {
                    P.css({
                        opacity: "1",
                        "pointer-events": "all"
                    })
                }), 
                a(function () {
                    angular.element(o.find("body")[0]).on("click", Y).on("keyup", d)
                }, 100), 
                e.data.windowBlur && a(function () {
                    angular.element(window).on("blur", Y)
                }, 100), 
                e.inputIsFocus = !1, 
                a(function () {
                    angular.element(t.find("input")[0]).on("focus", R).on("blur", R), 
                    t.find("input")[0].focus()
                }, 200)
            },
            Y = function () {
                e.bShowing = !1, e.validation.toggle("searchTxt", !1), P.css({
                    opacity: "0"
                }), a(function () {
                    P.css({
                        display: "none",
                        "pointer-events": "none"
                    })
                }, 100), 
                angular.element(o.find("body")[0]).off("click", Y).off("keyup", d), 
                angular.element(t.find("input")[0]).off("focus", R).off("blur", R), 
                e.data.windowBlur && angular.element(window).off("blur", Y), 
                e.dataPagination.current = 1
            };
        e.close = Y, 
        e.dataPagination = {
            current: 1,
            onSwitch: function () {
                B(!0),
                T()
            }
        };
        var B = function (t) {
                e.allData = [], 
                e.showTips = t, 
                e.isSearching = t, 
                e.tips = g.split("|"), 
                e.noResultExtHTML = ""
            },
            R = function () {
                e.inputIsFocus = !e.inputIsFocus
            };
        e.noResultExtHTMLClick = function () {
            e.data.noResultExtHTMLClick(e), Y()
        }, 
        a(function () {
            angular.element($(t).find(".tag-select-box-footer")).append(s('<you-pagination data="dataPagination" type="simple"></you-pagination>')(e));
            var i = $(t).find(".tag-select-box-footer-left");
            e.data.footerLinks && _.forEach(e.data.footerLinks, function (t, n, a) {
                var o = angular.element(p.replace("#{text}", t.text));
                o.on("click", function () {
                    t.isNotOverrideBtn || (e.data.btnname = t.text), 
                    t.click(), 
                    t.isAutoRefresh && T(), 
                    t.isNotAutoCloase || Y()
                }), 
                i.append(o), 
                n !== a.length - 1 && i.append(angular.element('<span class="tag-select-box-footer-left-split text-muted">|</span>'))
            }), 
            N = !1
        })
    }, defineListeners: function () {
        this._super()
    }, destroy: function () {}
});
angular.module("directives.youTagselector", []).directive("youTagselector", ["$Uri", "$timeout", "$document", "$compile", "$Popup", "$Util", "$sce",
    function (e, t, i, n, a, o, s) {
        return {
            restrict: "E",
            scope: {
                data: "="
            },
            link: function (r, l, c) {
                new youTagselectorDirective(r, l, c, e, t, i, n, a, o, s)
            }, replace: !0,
            templateUrl:'/static/main/html/_tag_selector.htm'
        }
    }
]);