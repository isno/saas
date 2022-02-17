var youMainFollowDirective = BaseController.extend({
    init: function (e, t, i, n, a, o) {
        function s() {
            1 == t.css("opacity") ? (
                r.fResize(), 
                e.mainFollowhideFirst && h(!1), 
                t.css({visibility: "visible"}), 
                r.timeoutMainbody = n(function () {_.showByMainBody = {opacity: 1}}, 300))
                 : r.timeoutFilterInit = n(function () {s()}, 100)
        }
        this._super(e), 
        this._scope = e, 
        this._elm = t;
        var r = this;
        r.timeout = n;
        var l, c, d, p = angular.element('<a href="javascript:void(0);" class="followFilter-btn" ng-click="fFold();"></a>');
        t.addClass("followFilter"), 
        t.addClass("transition-fast");
        var u = angular.element(t.children("section")[0]);
        u.addClass("followFilter-advance"), 
        t.append(o(p)(e));
        var m = angular.element(t.children("section")[1]);
        m.addClass("followFilter-simple");
        var g = 0;
        e.fFold = function () {
            w = !1, 
            h(p.hasClass("followFilter-btn-fold"))
        };
        var f = !0, 
        h = function (e) {

            if (!d) {
  
                if (l && l(e), c && m.css("height", e ? null : "102px"), 
                    f = e, 
                    u.css({height: "auto"}), 
                    window.impactMode) return u.removeClass("transition-fast"), 
                    u.removeClass("transition-height"), 
                void(e ? (
                    p[0].className = "followFilter-btn", 
                    u.css({"max-height": "1000px"}), 
                    u.css({height: "auto"}), 
                    u.css({overflow: "visible"})) : (
                            p[0].className = "followFilter-btn followFilter-btn-fold", 
                            u.css({"max-height": "0px"}), 
                            u.css({height: "0px"}), 
                            u.css({overflow: "hidden"})
                        ));
                    e ? (
                        r.youMainContent.removeClass("transition-normal"), 
                        u.removeClass("transition-fast"), 
                        r.youMainContent.addClass("transition-fast"), 
                        u.addClass("transition-height"), 
                        u.css({overflow: "visible"})) : (
                        r.youMainContent.removeClass("transition-fast"), 
                        u.removeClass("transition-height"), 
                        r.youMainContent.addClass("transition-normal"), 
                        u.addClass("transition-fast"), 
                        u.css({overflow: "hidden"})), 
                    r.timoutHandler = n(function () {
                        e ? (
                            p[0].className = "followFilter-btn", 
                            u.css({"max-height": "1000px"}),
                            r.youMainContent.css({top: g + 60 + "px"}), 
                            u.css({overflow: "visible"})) : 
                        (
                            p[0].className = "followFilter-btn followFilter-btn-fold", 
                            u.css({"max-height": "0px"}), 
                            r.youMainContent.css({top: (c ? 162 : 110) + "px"}), 
                            u.css({overflow: "hidden"}))
                    }), 
                    v && e && (
                        v = !1, 
                        r.timoutHandlerHeight = n(function () {
                            g = t[0].offsetHeight,
                            r.youMainContent.css({top: g + 60 + "px"})
                    }, 100))
                }
            };
           
        r.youMainContent = angular.element($(t).parent().children("[you-mainbody]")[0]);
        var _ = r.youMainContent.scope();
        _.showByMainBody = {opacity: 0};
        var v = !1;
        r.fResize = function () {
            r.timeoutResize = n(function () {
                window.impactMode && r.youMainContent.css({top: "0px"}), 
                v = !0, 
                h(f)
            }, 0)
        }, 
        $(window).on("resize", r.fResize), 
        e.$watch("data", function () {r.fResize()});
        var y = !1,b = !0, w = !0;
        
        r.youMainContent.on("mousewheel DOMMouseScroll", function (e) {

            if (!d && !window.impactMode && w) {
                var t = e.originalEvent.wheelDelta || -e.originalEvent.detail;
            
                y || e.preventDefault(), 
                t > 0 ? r.youMainContent[0].scrollTop < 50 && (h(!0), b = !0, y = !1) : b && (h(!1), b = !1, y = !1, n(function () {
                    y = !0
                }, 300))
            }
        }), 
        s(), 
        e.data && (c = e.data.withTab, c && (d = e.data.isTabOn,
            e.data.setTabOn = function () {
            h(!1), 
            d = !0, 
            p.css("display", "none")
        }, 
        e.data.setTabOff = function () {
            d = !1, 
            h(!0), 
            w = !0, 
            p.css("display", "block"), 
            b = !0
        }, 
        e.data.onTabChange = function () {
            r.youMainContent[0].scrollTop = 0
        }, 
        d && n(function () {
            m.css("height", "102px"), 
            r.youMainContent.css({top: "162px"}), 
            p.css("display", "none")
        })), 
        l = e.data.onStatusChange)
    }, 
    defineListeners: function () {
        this._super()
    }, 
    destroy: function () {
        var e = this;
        e.timeoutMainbody && e.timeout.cancel(e.timeoutMainbody), 
        e.timeoutFilterInit && e.timeout.cancel(e.timeoutFilterInit), 
        e.timoutHandler && e.timeout.cancel(e.timoutHandler), 
        e.timoutHandlerHeight && e.timeout.cancel(e.timoutHandlerHeight), 
        e.timeoutResize && e.timeout.cancel(e.timeoutResize), 
        e.youMainContent.off("mousewheel DOMMouseScroll"), 
        $(window).off("resize", e.fResize)
    }
});
angular.module("directives.youMainfollow", []).directive("youMainfollow", ["$timeout", "$Popup", "$compile", "$document",
    function (e, t, i, n) {
        return {
            restrict: "A",
            scope: {
                data: "="
            },
            link: function (a, o, s) {
                new youMainFollowDirective(a, o, s, e, t, i, n)
            }
        }
    }
]);