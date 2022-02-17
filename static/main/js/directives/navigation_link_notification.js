var youNavigationLinkNotificationDirective = BaseController.extend({
    init: function (e, t, i, n, a, o) {
        var s = e;
        this._scope = s, 
        this._elm = t, 
        this._timeout = n, 
        this._order = o, 
        this._super(s), 
        this._initOrder();
    }, 
    _initOrder: function () {
        var e = this._scope,
            t = this._timeout,
            i = this._order;
        e.notifytext = 0, 
        e.notifytitle = e.notifytext + "笔待处理订单", 
        e.notifyclass = "", 
        e.notifyurl = "#/order?pending=true", 
        e.notifystyle = {
            display: "none"
        };
        var n = !1,
            a = 0,
            o = function (i) {
                if (a = i.pending) {
                    e.notifytitle = a + "笔待处理订单", n ? a > 0 && (e.notifyclass = "", t(function () {
                        e.notifyclass = "main-navigation-link-notifyAgain"
                    }, 100)) : (e.notifystyle = {
                        display: "block"
                    }, e.notifyclass = "main-navigation-link-notifyAnimation", n = !0);
                    var o = a;
                    a > 999 && (o = a + "+"), t(function () {
                        e.notifytext = o
                    }, 200)
                } else e.notifystyle = {
                    display: "none"
                }, 
                e.notifyclass = "", 
                n = !1
            };

        i.onMsg(function (e) {
            o(e)
        })
    },
    defineListeners: function () {
        this._super()
    }, 
    destroy: function () {}
});

angular.module("directives.youNavigationLinkNotification", []).directive("youNavigationLinkNotification", ["$timeout", "$state", "$Order",
    function (e, t, i) {
        return {
            restrict: "E",
            link: function (n, a, o) {
                new youNavigationLinkNotificationDirective(n, a, o, e, t, i)
            }, 
            scope: {}, 
            template: '<a class="main-navigation-link-notify {{ notifyclass }}" title="{{ notifytitle }}" ng-style="notifystyle" href="{{ notifyurl }}" ng-bind="notifytext" onclick="event.stopPropagation();"></a>'
        }
    }
]);