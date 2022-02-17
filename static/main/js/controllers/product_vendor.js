var ProductVendorController = BaseGridController.extend({
    _tag: "vendor",
    _id: "vid",
    _cn: "品牌",
    init: function (e, t, i, n, a, o) {
        function s(e) {
            e || (e = {}), 
            e.onChange = function () {
                r._httpGetAll()
            }, n.vendor(e)
        }
        this._super(e, t, i, n, a, o), 
        this._uri = i;
        var r = this;
        this.initCheckBtn("dataUsed", "used", YouPreset.USED), 
        e.onClickNew = function () {
            s()
        }, 
        e.onClickMultiNew = function () {
            n.modal({
                title: "批量新增" + r._cn,
                content: '<h3 class="summit-h3">批量新增多个品牌，请用“回车”隔开。<span style="color:#999">（每个品牌名称不超过50个字符）</span></h3><textarea ng-model="multi_add" you-validation="requiredHtml" style="height:150px;resize:none;" class="input input-long" placeholder="请输入品牌名称"></textarea>',
                btn: [{
                    type: "loading",
                    hide: !0
                }, {
                    type: "default",
                    text: "取消",
                    click: "cancel"
                }, {
                    type: "primary",
                    text: "确定",
                    click: "add"
                }],
                scope: {
                    contentStyle: {
                        overflow: "visible"
                    },
                    cancel: function () {
                        n.close()
                    }, add: function (e, t) {
                        if (!e.validation.validate(["multi_add"])) return void(t.add = !1);
                        var a = e.multi_add.split(/\r?\n/),
                            s = [];
                        _.forEach(a, function (e) {
                            s.push(o.htmlEnDeCode.htmlEncode(e))
                        }), s = _.reject(s, function (e) {
                            return "" === e
                        }), s = _.uniq(s);
                        var l = _.find(s, function (e) {
                            return e.length > 50
                        });
                        if (l) return e.validation.toggle("multi_add", !0, "“" + l + "” 超过50个字符"), void(t.add = !1);
                        var c = {
                            names: JSON.stringify(s)
                        };
                        t.data.btn[0].hide = !1, 
                        t.data.btn[1].hide = !0, 
                        t.data.btn[2].hide = !0, 
                        i.post(r._tag + "_multiCreate", c, function (e) {
                            var t = [];
                            e.data && e.data.vendors && (t = e.data.vendors), n.close();
                            var i = r._cn + "已存在";
                            t.length > 0 && (r._httpGetAll(), i = "已添加 " + t.length + " 个" + r._cn), 
                            n.info({text: i}, !0)
                        })
                    }
                },
                notpreventDefault: !0,
                notpreventScroll: !0
            })
        }, 
        e.onClickMultiRemove = function () {
            var e = r.getCheckedIds();
            n.modalSimple({
                tag: r._cn,
                type: "remove",
                content: "确定要删除 <strong>选中的" + e.length + "个" + r._cn + "</strong> 吗?",
                onConfirm: function () {
                    i.post(r._tag + "_multiRemove", {
                        ids: e.toString()
                    }, function () {
                        r._httpGetAll(), n.close(), n.info({
                            text: "已删除 " + e.length + " 个" + r._cn
                        })
                    })
                }
            })
        }, 
        e.onClickItem = function (e) {
            e.stopPropagation()
        }, 
        e.onClickBack = function () {
            i.historyBackCached()
        }, 
        e.onCheckItem = function (e, t) {
            t.stopPropagation();
            var a = r._cn + "使用情况",
                o = n.modal({
                    title: a,
                    content: " <span>" + r._cn + "“<strong>" + e.name + '</strong>”正被以下 <span ng-bind="usedNum"></span> 个商品使用</span>。 <div class="imgmgr-pop-usage-block" ng-hide="products" style="height:135px">加载中，请稍候...</div> <div class="imgmgr-pop-usage-block" ng-show="products" style="height:135px">  <div class="imgmgr-pop-usage-block-item" ng-repeat="i in products">   <a target="_blank" href="#!/productedit?id={{i.id}}">{{i.name}}</a>  </div> </div>',
                    btn: [{
                        type: "primary",
                        text: "确定",
                        click: "cancel"
                    }],
                    initModel: {
                        usedNum: e.used
                    },
                    scope: {
                        cancel: function () {
                            n.close()
                        }
                    },
                    notpreventDefault: !0,
                    notpreventScroll: !0
                }),
                s = {};
            s.nopage = "Y", 
            s[r._id] = e.id, 
            s.output_format = "simple";
            var l = o.$$childTail.$$childHead;
            o.$$childHead;
            return i.get("product_getAll", s, function (e) {
                e.data && e.data.products ? (l.usedNum = e.data.item_count, l.products = e.data.products) : l.products = []
            }), !1
        }, 
        e.fDel = function (e, t) {
            t.stopPropagation();
            var a = r._cn + "“<strong>" + e.name + "</strong>”正被 " + e.used + " 个商品使用。删除后，关联的商品将自动去掉该分类。";
            0 === e.used && (a = "你确定要删除" + r._cn + "“<strong>" + e.name + "</strong>”吗？"), n.modal({
                title: "删除" + r._cn,
                content: a,
                btn: [{
                    type: "loading",
                    hide: !0
                }, {
                    type: "default",
                    text: "取消",
                    click: "cancel"
                }, {
                    type: "danger",
                    text: "确定",
                    click: "del"
                }],
                scope: {
                    cancel: function () {
                        n.close()
                    }, del: function (t, a) {
                        var o = {
                            id: e.id
                        };
                        a.data.btn[0].hide = !1, 
                        a.data.btn[1].hide = !0, 
                        a.data.btn[2].hide = !0, 
                        i.post(r._tag + "_remove", o, function (t) {
                            r._httpGetAll(), n.close(), n.info({
                                text: r._cn + " " + e.name + " 已删除"
                            }, !0)
                        })
                    }
                }
            })
        }, e.fEdit = function (e, t) {
            t.stopPropagation(), s({
                id: e.id
            })
        }
    }, onReset: function () {
        this._$scope.dataUsed.reset()
    }, onGetAll: function (e) {}, onInitDone: function (e) {
        var t = this._uri;
        _.forEach(e, function (e) {
            e.thumbnail = t.getAssetUrl(e.image_path)
        })
    }
});
ProductVendorController.$inject = ["$scope", "$rootScope", "$Uri", "$Popup", "$timeout", "$Util"];