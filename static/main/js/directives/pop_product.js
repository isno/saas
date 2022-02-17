var youPopProduct = BaseController.extend({
    init: function (e, t, i, n, a, o, s, r, l, c) {
        this._super(e), 
        this._$scope = e, 
        this._$Uri = l, 
        this._$timeout = a, 
        this._$Popup = o, 
        this._$document = s, 
        e.HTMLDECODE = c.htmlEnDeCode.htmlDecode, 
        YouPreset.init("product"), 
        YouPreset.init("promotion"), 
        this.loading = 0, 
        e.listProducts = _.cloneDeep(e.data.products),
        e.listProducts || (e.listProducts = []), 
        _.forEach(e.listProducts, function (e) {
            e.img = l.getAssetUrl(e.image_path, "100x100")
        }), 
        this._init(), 
        this._initList(), 
        this._initTabs(), 
        this._initGrid(), 
        this._initFolders(), 
        this._httpGetAllProduct(), 
        e.stopPropagation = function (e) {
            e.stopPropagation()
        }, a(function () {
            e.popWinClass = "pop-product-win-in"
        })
    }, 
    _init: function () {
        var e = this._$scope,
            t = this._$Popup,
            i = this._$timeout,
            n = function () {
                i(function () {
                    t.closeProducts()
                }, 500), e.popWinClass = "pop-product-win-out"
            };
        e.clickWin = function (t) {
            e.showListOrder && (e.showListOrder = !1), t.stopPropagation()
        }, e.popSave = function () {
            n(), e.data.onDone(e.listProducts)
        }, e.popCancel = function () {
            n()
        }
    }, 
    _initTabs: function () {
        var e = this,
            t = this._$scope;
        t.tabs = [{
            value: 0,
            text: "全部商品"
        }, {
            value: 1,
            text: "分类",
            name: "分类",
            tag: "type"
        }, {
            value: 2,
            text: "品牌",
            name: "品牌",
            tag: "vendor"
        }/*, {
            value: 3,
            text: "营销活动",
            name: "营销活动",
            tag: "promotion"
        }*/], 
        t.tab = t.tabs[0], 
        t.isTabSelected = function (e) {
            return e.value == t.tab.value ? "selected" : ""
        }, 
        t.changeTab = function (i) {
            t.tab.value != i.value && (e._resetContent(), t.tab = i, 0 === i.value ? (e._resetGridParam(), e._httpGetAllProduct()) : (e._resetGridParam(), e._resetFolderParam(), e._httpGetAllFolder()))
        }
    }, 
    _initGrid: function () {
        var e = this,
            t = this._$timeout,
            i = this._$scope;
        i.clickGridGoFolder = function () {
            e._resetContent(), 
            e._httpGetAllFolder()
        }, 
        i.gridIncludeAll = function () {
            e._httpGetProductIncludeExclude(!0, function (e) {
                i.gridProductData.item_selected_count = i.gridProductData.item_count;
                var t = [];
                _.forEach(e, function (e) {
                    _.find(i.listProducts, function (t) {
                        return e.id == t.id
                    }) || t.push(e)
                }), i.listProducts = t.concat(i.listProducts)
            })
        }, 
        i.gridExcludeAll = function () {
            e._httpGetProductIncludeExclude(!1, function (e) {
                i.gridProductData.item_selected_count = 0, _.remove(i.listProducts, function (t) {
                    return Boolean(_.find(e, function (e) {
                        return e.id == t.id
                    }))
                })
            })
        }, 
        i.gridSearch = null, i.changeGridSearch = function () {
            e._httpGetAllProduct({
                resetPage: !0
            })
        }, 
        i.clickGridSearchRemove = function () {
            i.gridSearch = null, i.changeGridSearch()
        }, 
        i.gridShowSelected = function () {
            t(function () {
                e._httpGetAllProduct({
                    resetPage: !0
                })
            })
        }, 
        i.gridOrderBy = null, i.gridOrder = null, i.getGridOrderClass = function (e) {
            return e != i.gridOrderBy ? "ico ico-grid-order" : "desc" == i.gridOrder ? "ico ico-grid-order-desc" : "ico ico-grid-order-asc"
        }, 
        i.setGridOrder = function (t) {
            i.gridOrderBy == t ? i.gridOrder = "desc" == i.gridOrder ? "asc" : "desc" : i.gridOrder = "desc", i.gridOrderBy = t, e._httpGetAllProduct({
                resetPage: !0
            })
        }, 
        t(function () {
            console.log(i)
            i.gridPagination.onSwitch = function () {
                e._httpGetAllProduct()
            }
        }), 
        i.isGridProductSelected = function (e) {
            return e.selected ? "selected" : ""
        }, 
        i.clickGridProduct = function (t) {
            t.selected = !t.selected, t.selected ? (i.gridProductData.item_selected_count++, i.listProducts.unshift(t)) : (i.gridProductData.item_selected_count--, _.remove(i.listProducts, function (e) {
                return e.id == t.id
            })), e._resetListSearch()
        }, 
        i.getGridStockText = function (e) {
            return e.stock_sum + "件 / " + e.variant_count + "种种类"
        }, 
        i.getGridDiscountRuleText = function () {
            var e = i.folder;
            if (e) {
                var t = "";
                switch (e.discount_type) {
                case "amount_off":
                    e.offs && _.forEach(e.offs, function (e, i) {
                        0 !== i && (t += "、"), t += "满" + YouPreset.$() + e.active_amount / 100 + "减" + e.discount_amount / 100
                    });
                    break;
                case "free_shipping":
                    t = e.active_amount ? "买满" + YouPreset.$() + e.active_amount / 100 + "免邮" : "买任一商品均免邮";
                    break;
                case "coupon":
                    e.offs && _.forEach(e.offs, function (e, i) {
                        0 !== i && (t += "、"), t += "满" + YouPreset.$() + e.active_amount / 100 + "赠券"
                    });
                    break;
                case "percent_off":
                    e.offs && _.forEach(e.offs, function (e, i) {
                        0 !== i && (t += "、"), t += "满" + YouPreset.$() + e.active_amount / 100 + "打" + e.discount_percent / 10 + "折"
                    })
                }
                return t
            }
        }
    }, _updateGridProductsSelected: function () {
        var e = this._$scope;
        _.forEach(e.gridProducts, function (t) {
            _.find(e.listProducts, function (e) {
                return e.id == t.id
            }) ? t.selected = !0 : t.selected = !1
        })
    }, _initFolders: function () {
        var e = this,
            t = this._$scope,
            i = this._$timeout;
        t.folderOrder = null, t.folderOrders = [{
            value: "name",
            text: "名称 ↑",
            order: "asc"
        }, {
            value: "name",
            text: "名称 ↓",
            order: "desc"
        }, {
            value: "selected",
            text: "已选商品数 ↑",
            order: "asc"
        }, {
            value: "selected",
            text: "已选商品数 ↓",
            order: "desc"
        }], t.changeFolderOrder = function () {
            e._httpGetAllFolder({
                resetPage: !0
            })
        }, t.folderSearch = null, t.changeFolderSearch = function () {
            0 !== t.folders.length || t.folderSearch || (t.showFolder = !1), 
            e._httpGetAllFolder({
                resetPage: !0
            })
        }, t.clickFolderSearchRemove = function () {
            t.folderSearch = null, t.changeFolderSearch()
        }, i(function () {
            t.folderPagination.onSwitch = function () {
                e._httpGetAllFolder()
            }
        }), t.clickFolder = function (i) {
            e._resetContent(), t.folder = i, e._httpGetAllProduct()
        }, t.getDiscountTypeText = function (e) {
            return _.find(YouPreset.DISCOUNT_TYPE, function (t) {
                return t.value == e
            }).text
        }
    }, _resetContent: function () {
        var e = this._$scope,
            t = this._$timeout;
        e.folders = [], e.showFolder = !1, t(function () {
            e.showFolder = !1
        }), e.gridProducts = [], e.showGrid = !1, t(function () {
            e.showGrid = !1
        })
    }, 
    _resetGridParam: function () {
        var e = this._$scope;
        e.gridPagination.current = 1, e.gridOrderBy = null, e.gridOrder = null, e.gridSearch = null, e.isGridShowSelected = !1
    }, 
    _resetFolderParam: function () {
        var e = this._$scope;
        e.folderPagination.current = 1, e.folderOrder = null, e.folderSearch = null
    }, 
    _httpGetAllProduct: function (e) {
        var t = this,
            i = this._$scope,
            n = this._$Uri,
            a = this._$Popup,
            o = i.gridPagination ? i.gridPagination.current : 1,
            s = i.gridSearch;
        i.gridOrderBy || (i.gridOrderBy = "name");
        var r = i.gridOrderBy;
        i.gridOrder || (i.gridOrder = "desc");
        var l, c = i.gridOrder;
        i.isGridShowSelected && (l = !0);
        var d, p, u, m, g = t._getListProductIds(),
            f = i.tab;
        switch (f.value) {
        case 1:
            d = i.folder.id;
            break;
        case 2:
            p = i.folder.id;
            break;
        case 3:
            u = i.folder.id;
            break;
        case 4:
            m = i.folder.id
        }
        var h = {
            size: 30,
            page: o,
            order_by: r,
            order: c,
            search: s,
            only_selected: l,
            products: JSON.stringify(g),
            tid: d,
            vid: p,
            did: u,
            pid: m
        };
        e && e.resetPage && (h.page = 1), 
        a.loading(++t.loading), 
        n.post("product_getAllPanel", h, function (d) {
            a.loading(--t.loading),
            o == i.gridPagination.current && r == i.gridOrderBy && c == i.gridOrder && s == i.gridSearch && l == l && f == i.tab && (_.forEach(d.data.products, function (e) {
                e.img = n.getAssetUrl(e.image_path, "42x42")
            }), 
            i.gridProductData = d.data, 
            i.gridProducts = d.data.products, 
            i.gridPagination.count = d.data.page_count, 
            i.showGrid = !0, 
            t._updateGridProductsSelected(), 
            e && e.resetPage && (i.gridPagination.current = 1))
        })
    }, _httpGetAllFolder: function (e) {
        var t = this,
            i = this._$scope,
            n = this._$Uri,
            a = this._$Popup,
            o = i.folderPagination ? i.folderPagination.current : 1,
            s = i.folderSearch;
        i.folderOrder || (i.folderOrder = i.folderOrders[0]);
        var r = i.folderOrder,
            l = t._getListProductIds(),
            c = {
                size: 20,
                page: o,
                order_by: r.value,
                order: r.order,
                search: s,
                products: JSON.stringify(l)
            };
        e && e.resetPage && (c.page = 1);
        var d = i.tab;
        a.loading(++t.loading), 
        n.post(d.tag + "_getAllPanel", c, function (c) {
            a.loading(--t.loading), 
            o == i.folderPagination.current && r.value == i.folderOrder.value && r.order == i.folderOrder.order && s == i.folderSearch && l.length == i.listProducts.length && d == i.tab && (i.folders = c.data[d.tag + "s"], _.forEach(i.folders, function (e) {
                e.imgs = [], 
                _.forEach(e.feature_images.split(","), function (t) {

                    t && e.imgs.push({
                        url: n.getAssetUrl(t, "56x56")
                    })
                })
            }), 
            i.folderPagination.count = c.data.page_count, 
            i.showFolder = !0, 
            e && e.resetPage && (i.folderPagination.current = 1))
        })
    }, 
    _httpResortProduct: function (e) {
        var t = this,
            i = this._$scope,
            n = this._$Uri,
            a = this._$Popup,
            o = t._getListProductIds();
        a.loading(++t.loading), n.post("product_resort", {
            order_by: e.value,
            order: e.order,
            products: JSON.stringify(o)
        }, function (e) {
            a.loading(--t.loading), 
            _.forEach(e.data.products, function (e) {
                e.img = n.getAssetUrl(e.image_path, "42x42")
            }), 
            i.listProducts = e.data.products
        })
    }, 
    _httpGetProductIncludeExclude: function (e, t) {
        var i = this,
            n = this._$scope,
            a = this._$Uri,
            o = this._$Popup,
            s = e ? "_getAllExclude" : "_getAllInclude",
            r = n.tab,
            l = {
                products: JSON.stringify(i._getListProductIds())
            };
        switch (r.tag) {
        case "type":
            l.tid = n.folder.id;
            break;
        case "vendor":
            l.vid = n.folder.id;
            break;
        case "promotion":
            l.did = n.folder.id;
            break;
        case "page":
            l.pid = n.folder.id
        }
        o.loading(++i.loading), 
        a.post(r.tag + s, l, function (e) {
            o.loading(--i.loading), 
            _.forEach(e.data.products, function (e) {
                e.img = a.getAssetUrl(e.image_path, "42x42")
            }), 
            t(e.data.products), 
            i._updateGridProductsSelected()
        })
    }, 
    _getListProductIds: function () {
        var e = this._$scope,
            t = [];
        return _.forEach(e.listProducts, function (e) {
            t.push({
                id: e.id
            })
        }), t
    }, 
    _resetListSearch: function () {
        var e = this._$scope;
        e.listSearch = null, e.changeListSearch()
    }, 
    _initList: function () {
        function e() {
            o.showGrid ? a._httpGetAllProduct() : o.showFolder && a._httpGetAllFolder()
        }
        function t(e) {
            for (var t = 0, i = 0, n = o.listProducts.length; i < n; i++) {
                var a = o.listProducts[i];
                if (!a.isHidden) {
                    if (a === e) return t;
                    t++
                }
            }
        }

        function i() {
            var e = 0;
            return _.forEach(o.listProducts, function (t) {
                t.isHidden || e++
            }), e
        }

        function n(e) {
            for (var t = 0, i = 0, n = o.listProducts.length; i < n; i++) {
                var a = o.listProducts[i];
                if (!a.isHidden) {
                    if (t === e) return a;
                    t++
                }
            }
        }
        var a = this,
            o = this._$scope,
            s = this._$document;
        this._$timeout;
        this.resetListProducts = function () {
            _.forEach(o.listProducts, function (e) {
                delete e.isHidden
            })
        }, 
        this.resetListProducts(), 
        o.listOrders = YouPreset.PRODUCT_ORDER, 
        o.showListOrder = !1, 
        o.clickListOrderBtn = function (e) {
            o.showListOrder = !o.showListOrder, 
            e.stopPropagation()
        }, 
        o.changeListOrder = function (e) {
            a._httpResortProduct(e)
        }, 
        o.listSearch = "", 
        o.changeListSearch = function () {
            if (a.resetListProducts(), o.listSearch) {
                var e = new RegExp(o.listSearch);
                _.forEach(o.listProducts, function (t) {
                    e.test(t.name) || (t.isHidden = !0)
                })
            }
        }, 
        o.clickListSearchRemove = function () {
            o.listSearch = "", o.changeListSearch()
        }, 
        o.moveListProductTop = function (e) {
            _.remove(o.listProducts, function (t) {
                return t === e
            }), o.listProducts.unshift(e)
        }, 
        o.moveListProductBottom = function (e) {
            _.remove(o.listProducts, function (t) {
                return t === e
            }), o.listProducts.push(e)
        }, 
        o.removeListProducts = function () {
            o.listSearch = "", o.listProducts = [], e()
        }, 
        o.clickRemoveListProduct = function (t) {
            _.remove(o.listProducts, function (e) {
                return e === t
            }), e()
        }, 
        o.canDragList = function () {
            return !Boolean(o.listSearch)
        };
        var r;
        o.dragList = function (e, a, l) {
            if (o.canDragList()) {
                o.listSearch && (a = t(l), r = i());
                var c = o.listProducts,
                    d = a;
                o.listSearch ? l.isDragOverDown = !0 : c[a].isDragOverDown = !0;
                for (var p = e.target;
                    "pop-product-list-item" != p.className;) p = p.parentNode;
                var u = p.offsetLeft,
                    m = p.offsetTop,
                    g = p.clientHeight,
                    f = e.pageY,
                    h = e.pageX;
                p = angular.element(p), p.addClass("mousemove"), p.css({
                    position: "absolute",
                    top: 58 * a + "px",
                    left: "0px",
                    "z-index": 2,
                    borderBottom: "none"
                });
                var v = function (e) {
                        e.preventDefault();
                        var t, i;
                        i = e.pageY - f, t = e.pageX - h, p.css({
                            top: m + i + "px",
                            left: u + t + "px"
                        });
                        var s = parseInt((m + i) / g);
                        if (s < 0 && (s = 0), o.listSearch ? s >= r && (s = r - 1) : s >= c.length && (s = c.length - 1), s != d) {
                            var l;
                            o.listSearch ? (l = n(d), l.isDragOverUp = !1, l.isDragOverDown = !1, d = s, l = n(d)) : (l = c[d], l.isDragOverUp = !1, l.isDragOverDown = !1, d = s, l = c[d]), s > a ? l.isDragOverDown = !0 : l.isDragOverUp = !0, o.$apply()
                        }
                    },
                    y = function (e) {
                        if (s.off("mousemove", v), s.off("mouseup", y), o.listSearch) {
                            var t, i, n = 0;
                            _.forEach(o.listProducts, function (e, o) {
                                n == a && (t = o), n == d && (i = o), e.isHidden || n++
                            }), c.splice(i, 0, c.splice(t, 1)[0])
                        } else c.splice(d, 0, c.splice(a, 1)[0]);
                        _.forEach(c, function (e) {
                            e.isDragOverDown = !1, 
                            e.isDragOverUp = !1
                        }), 
                        p.removeClass("mousemove"), 
                        p.css({
                            position: "relative",
                            top: "0",
                            left: "0",
                            "z-index": 1,
                            borderBottom: "1px solid #F5F5F5"
                        }), o.$apply()
                    };
                s.on("mousemove", v), s.on("mouseup", y)
            }
        }
    }
});
angular.module("directives.youPopProduct", []).directive("youPopProduct", ["$compile", "$timeout", "$Popup", "$document", "$rootScope", "$Uri", "$Util",
    function (e, t, i, n, a, o, s) {
        return {
            scope: {
                data: "="
            },
            restrict: "E",
            link: function (r, l, c) {
                new youPopProduct(r, l, c, e, t, i, n, a, o, s)
            }, transclude: !0,
            replace: !0,
            templateUrl: '/static/main/html/popups/product.htm'
        }
    }
]);