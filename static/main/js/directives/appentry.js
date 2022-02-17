(function(){
var youAppentryDirective = BaseController.extend({
    init: function (e, t, i, n, a, o) {
        this._scope = e, 
        this._elm = t, 
        this._super(e);
        var s = i.type;
        e.showApp = !1;
        var r = [], l = "";
        s.indexOf("_detail") > -1 && (l = n.getQuery().id), 
        e.showAppList = function () {
            e.showApp || ($(".followFilter").css({"z-index": 0}), 
            e.showApp = !0, 
            setTimeout(function () {
                $(document).one("click", function () {
                    e.showApp = !1, 
                    $(".followFilter").css({"z-index": 2}), 
                    e.$apply()
                })
            }))
        }, 
        e.goApp = function (e) {
            if (e.app.embedded) {
                var t;
                t = e.isPrivate ? {
                    key: e.app.key,
                    pid: e.position_id
                } : {
                    handle: e.app.handle,
                    pid: e.position_id
                }, 
                l && (t.id = l), n.setQuery("apps/embedded", t)
            } else {
                var i, a;
                e.isPrivate ? (i = {
                    key: e.app.key,
                    pid: e.position_id
                }, a = "app_private_redirect") : (i = {
                    key: e.app.key,
                    pid: e.position_id
                }, 
                a = "app_public_redirect"), 
                l && (i.id = l), 
                window.open(n.getUrl(a, i), "_blank")
            }
        }, 
        a.loading(!0), 
        o.authenticate("m_apps") && n.get("app_positions", {
            position: s
        }, 
        function (t) {
            a.loading(!1), 
            t.data && t.data.public_app_positions && _.forEach(t.data.public_app_positions, function (e, t) {
                _.forEach(e.positions, function (t, i) {
                    if (t.page == s) {
                        var a = t.link_name,
                            o = a;
                        a.length >= 15 && (a = a.substr(0, 11) + "..."), 
                        r.push({
                            app: e,
                            position: t,
                            name: a,
                            fullname: o,
                            image: n.getAssetUrl(e.icon_path, "50x50"),
                            position_id: t.id
                        })
                    }
                })
            }), 
            t.data && t.data.private_app_positions && _.forEach(t.data.private_app_positions, function (e, t) {
                _.forEach(e.positions, function (t, i) {
                    if (t.page == s) {
                        var n = t.link_name,
                            a = n;
                        n.length >= 15 && (n = n.substr(0, 11) + "..."), r.push({
                            app: e,
                            position: t,
                            name: n,
                            fullname: a,
                            image: new URI("/static/img/app_default_logo.png").normalize().toString(),
                            position_id: t.id,
                            isPrivate: !0
                        })
                    }
                })
            }), 
            r.length > 0 && (e.applist = r, e.showEntry = !0), e.listclass = "appentry-item-", r.length >= 3 ? e.listclass = e.listclass + "3" : e.listclass = e.listclass + r.length
        })
    }, 
    defineListeners: function () {
        this._super()
    }, 
    destroy: function () {}
});
angular.module("directives.youAppentry", []).directive("youAppentry", ["$Uri", "$Popup", "$Util",
    function (e, t, i) {
        return {
            restrict: "E",
            scope: !0,
            link: function (n, a, o) {
                new youAppentryDirective(n, a, o, e, t, i)
            }, 
            template: '<div class="appentry" ng-show="showEntry"><you-btn type="appentry" ng-click="showAppList();"></you-btn><div class="btn-drop-ls {{ listclass }}" ng-show="showApp"><div class="appentry-item" ng-repeat="i in applist" ng-click="goApp(i)" title="{{i.app.title}}"><div class="appentry-item-logo"><img ng-src="{{i.image}}" alt="{{i.app.title}}"><you-cover></you-cover></div><div class="appentry-item-name" title="{{ i.fullname }}">{{ i.name }}</div></div><i class="ico ico-arrow-6"></i></div></div>',
            replace: !0
        }
    }
]);
}());