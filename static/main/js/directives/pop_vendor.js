var youPopVendor = BaseController.extend({
    init: function (e, t, i, n, a, o, s, r, l) {
        function c() {
            o.closeVendor()
        }
        function d(t) {
            u.image_path = t,
            e.imageUrl = s.getAssetUrl(t, "118x118")
        }
        var p = this;
        this._super(e), 
        this._scope = e, 
        this._util = r, 
        this._uri = s, 
        this._timeout = a;
        var u = this.data = e.data,
            m = this.isNew = !u.id,
            g = this.isNew ? "vendor_fullCreate" : "vendor_update";
        e.modalTitle = (this.isNew ? "新增" : "修改") + "品牌";
        var f = !1;
        e.unSaved = function () {
            f = !0
        }, 
        e.styleWin = {}, 
        this.isNew ? this._initDone() : s.get("vendor_getSingle", {id: u.id}, function (t) {
            t && 200 === t.code && ($.extend(!0, e.data, t.data.vendor), p._initDone())
        }), 
        e.save = function () {
            var t = !0;
            e.isSaving = !0;
            if (m || (e.clickAdvanced(!0), t = !1), e.validation.validate(["data.name", "data.sub_name", "data.introduce"]) || (t = !1), !t) return void(e.isSaving = !1);
            var n = {
                name: e.HTMLENCODE(u.name),
                sub_name: e.HTMLENCODE(u.sub_name),
                introduce: e.HTMLENCODE(u.introduce),
                image_path: u.image_path ? u.image_path : ""
            };
            m || (n.id = u.id);
            var a = function (t) {
                    switch (e.isSaving = !1, t.code) {
                    case 200:
                        e.data.onChange && e.data.onChange(), 
                        c(), 
                        o.info({text: "品牌 " + n.name + " 已保存"}, !0);
                        break;
                    default:
                        if (t.data && "该URL已被使用" === t.data.message) return void e.validation.toggle("baseHandle", !0, t.data.message);
                        var i = "保存失败";
                        t.data && t.data.message && (i = t.data.message), 
                        o.info({text: i,type: "danger"}, !0);
                    }
                },
                r = {
                    errorCallback: function (t) {
                        e.isSaving = !1
                    }, overrideError: !0,
                    tag: "vendor",
                    forceSave: function () {
                        delete n.v, s.post.apply(s, l)
                    }
                },
                l = [g, n, a, r];
            s.post.apply(s, l)
        }, 
        e.close = function () {
            c()
        }, 
        e.onImgUpload = function (t) {
            var i = t.files;
            if (i.length > 1) return void o.modal({
                title: "图片数量过多",
                content: "只能上传一张图片",
                btn: [{
                    type: "primary",
                    text: "确定",
                    click: "popConfirm"
                }],
                scope: {
                    popConfirm: function () {
                        o.close()
                    }
                }
            });
            var n = i[0],
                a = {
                    files: i,
                    evt: t,
                    scope: e,
                    arrayName: "uploadVendorImage",
                    onBeforeUpload: function () {
                    }, onSucc: function (t) {
                        d(t.url), 
                        e.unSaved()
                    }
                },
                r = new FileReader;
            r.onload = function (c) {
                var t = c.target.result,
                    i = new Image;
                i.onload = function () {
                    var e = i.width,
                        t = i.height;
                    if (e < 200 || t < 200) return void o.modal({
                        title: "图片尺寸过小",
                        content: "分享图片尺寸必须大于<b>200*200</b>",
                        btn: [{
                            type: "primary",
                            text: "确定",
                            click: "popConfirm"
                        }],
                        scope: {
                            popConfirm: function () {
                                o.close()
                            }
                        }
                    });
                    s.multiImgUpload(a)
                }, i.src = t
            }, r.readAsDataURL(n)
        }, e.onImgRemove = function () {
            o.modal({
                title: "删除品牌图片",
                content: "你确定要删除品牌图片吗？",
                btn: [{
                    type: "loading",
                    hide: !0
                }, {
                    type: "default",
                    text: "取消",
                    click: "popCancel"
                }, {
                    type: "danger",
                    text: "确认删除",
                    click: "fDel"
                }],
                scope: {
                    popCancel: function () {
                        o.close()
                    }, fDel: function (t, i) {
                        u.image_asset_id = null, 
                        e.imageUrl = "", 
                        o.close(), 
                        e.unSaved()
                    }
                }
            })
        }
    }, 
    _initDone: function () {
        var e = this._scope,
            t = this._util,
            i = this._uri,
            n = this._timeout,
            a = (this.isNew, this.data);
        e.UTF8LEN = t.getUTF8Length, 
        e.HTMLENCODE = t.htmlEnDeCode.htmlEncode;
        var o = t.htmlEnDeCode.htmlDecode;
        n(function () {
            e.styleWin.visibility = "visible", 
            e.styleWin.opacity = 1
        }, 200), 
        e.data.name = o(a.name), 
        e.data.sub_name = o(a.sub_name), 
        e.data.introduce = o(a.introduce), 
        a.image_path && (e.imageUrl = i.getAssetUrl(a.image_path, "118x118"));
    }
});
angular.module("directives.youPopVendor", []).directive("youPopVendor", ["$compile", "$timeout", "$Popup", "$Uri", "$Util", "$Time",
    function (e, t, i, n, a, o) {
        return {
            scope: {
                data: "="
            },
            restrict: "E",
            link: function (s, r, l) {
                new youPopVendor(s, r, l, e, t, i, n, a, o)
            }, transclude: !0,
            replace: !0,
            templateUrl: '/static/main/html/popups/vendor.htm'
        }
    }
]);