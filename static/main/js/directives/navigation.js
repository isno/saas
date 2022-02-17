var youNavigationDirective = BaseController.extend({
    init: function (e, t, i, n, a, o, s, r, l) {
        function c(e, t) {
            e.preventDefault(), "group" === t.type ? d(t.name) : a.setQuery(t.url.slice(2), !1)
        }

        function d(e) {
            f[e];
            "" === m.currentGroup && (m.currentGroup = e), 
            e === m.currentGroup ? m.isExpand = !0 : m.isExpand ? (m.isExpand = !1, s(function () {
                m.currentGroup = e, m.isExpand = !0
            }, 500)) : (m.currentGroup = e, m.isExpand = !0)
        }

        function p() {
            m.isExpand = !1
        }

        function u() {
            window.YoudianInitDone ? (s.cancel(h), e.initDone = !0) : h = s(function () {
                u()
            }, 50)
        }
        this._scope = e, 
        this._elm = t, 
        this._super(e);

        $(".logo").hover(function() {
            $(".shopinfos").show();
        }, function() {
            $(".shopinfos").hide();
        })

        var m = e.data = {};
        m.currentGroup = "", 
        m.shop_name = window.YoudianConf.shopName,
        m.shop_id = window.YoudianConf.shop_id,
        m.isExpand = !1;

        var g = $(t[0]),
        f = (g.find(".main-navigation-slide-main"), e.YoudianConf.allNavigation);
    
        !function (t) {
            var i;
            i = e.YoudianConf.navigationConfig_shangcheng;
            m.navList = i.map(function (e) {
                return e.filter(function (e) {
                    return angular.copy(f[e])
                }).map(function (e) {
                    var t = f[e];
                    return t.selected = !1, t.name = e, t
                })
            }).filter(function (e) {
                return e.length > 0
            }), m.subNavLists = _.filter(_.flatten(m.navList), {
                type: "group"
            }).map(function (e) {
                return {
                    group: e,
                    sub: e.sub.map(function (e) {
                        return angular.copy(f[e])
                    }).filter(function (e) {
                        return e
                    }).map(function (t) {
                        return t.groupBy = e.name, t.selected = !1, t
                    })
                }
            })
        }(1), 
        e.fClickLink = c, 
        e.fUnExpand = p, 
        e.$on("$stateChangeSuccess", function () {

            var t = l.current.module || l.current.name;

            _.flatten(m.navList).forEach(function (e) {
                e.module === t ? (e.selected = !0, p()) : e.selected = !1
            }), 
            e.data.subNavLists.forEach(function (e) {
      
                e.sub.forEach(function (i) {
                    i.module === t ? (i.selected = !0, e.group.selected = !0, d(e.group.name)) : i.selected = !1
                })
            }), s(function () {
                window.fFrameworkAdjust()
            }, 100)
        }); 
        //window.YoudianConf.hideGuide || o.guideEntry();
        var h;
        e.$on("$stateChangeError", function () {
            o.modal({
                title: "Oops~",
                content: "你的网络似乎出了点故障了，请检查后再次尝试。",
                btn: [{
                    type: "primary",
                    text: "确定",
                    click: "fCancelAdd"
                }],
                scope: {
                    fCancelAdd: function () {
                        o.close()
                    }
                },
                forcePop: !0,
                noX: !0
            }), o.loading(!1)
        }), 
        s(function () {
            u()
        }, 100)
    }, 
    defineListeners: function () {
        this._super()
    }, 
    destroy: function () {}
});
angular.module("directives.youNavigation", []).directive("youNavigation",
    ["$rootScope", "$compile", "$Uri", "$Popup", "$timeout", "$q", "$state",
    function(e, t, i, n, a, o, s) {
        return {
            restrict: "E",
            link: function(r, l) {
                new youNavigationDirective(r, l, e, t, i, n, a, o, s)
            },
            templateUrl: '/static/main/html/_navigation.htm'
        }
}]);



/** link */
(function(){
    var youNavigationLinkDirective = BaseController.extend({
        init: function(e, t, i, n, a, o) {
             var s = e;
            this._scope = s, this._elm = t, this._super(s);
            var r = s.data;
            r.route = _.find(i.YoudianConf.nowRoute, function (e) {
                return e.name == r.module
            }), r.route && r.route.url ? r.url = "#" + r.route.url : r.url = "javascript:void(0)"
        },
        defineListeners: function() {
            this._super()
        },
        destroy: function() {}
    });

    angular.module("directives.youNavigationlink", []).directive("youNavigationlink", ["$rootScope", "$location", "$timeout", "$state",
        function(e, t, i, n) {
            return {
                restrict: "E",
                link: function(a, o) {
                new youNavigationLinkDirective(a, o, e, t, i, n)
            },
            scope: {
                data: "=",
                clickLink: "&"
            },
            templateUrl: '/static/main/html/_navigation_link.htm'
        }
    }]);
}());
