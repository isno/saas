(function(){
    var youMainBodyDirective = BaseController.extend({
    init: function (e, t, i, n, a, o) {
        this._scope = e, 
        this._elm = t, 
        this._doc = o, 
        this._super(e);
        var s = this;
        e.scrollHeight = 0, 
        a.showGoTop(!1), 
        t.addClass("main-body");
        
        var r = o.find("body")[0],l = !1;
        s.bindScrollEventTimeout = function () {
            s.eventTimeout = n(function () {
                l || (l = !0, 
                    s.bindScrollEvent(), 
                    s.resizingTimeout = n(function () {l = !1}, 500))
            }, 100)
        }, 
        s.bindScrollEvent = function () {
            s.destroyFunc(), 
            window.impactMode ? (s.docScrollHandler = function () {
                e.docScrollHeight = r.scrollTop, e.$apply()
            }, 
            s._doc.on("scroll", s.docScrollHandler), 
            s.docScrollHeight = e.$watch("docScrollHeight", function () {
                e.docScrollHeight > 1 ? a.showGoTop(!0) : a.showGoTop(!1)
            })) : (s.scrollHandler = function () {
                e.scrollHeight = t[0].scrollTop, e.$apply()
            }, 
            s._elm.on("scroll", s.scrollHandler), 
            s.watchScrollHeight = e.$watch("scrollHeight", function () {
                e.scrollHeight > 1 ? a.showGoTop(!0) : a.showGoTop(!1)
            }))
        }, 
        s.destroyFunc = function () {
            s._elm && s.watchScrollHeight && (s._elm.off("scroll", s.scrollHandler), s.watchScrollHeight()), 
            s._doc && s.docScrollHeight && s._doc.off("scroll", s.docScrollHandler), 
            n.cancel(s.eventTimeout), 
            s.resizingTimeout && n.cancel(s.resizingTimeout)
        }, 
        s.bindScrollEventTimeout(), 
        $(window).on("resize", s.bindScrollEventTimeout)
    }, 
    defineListeners: function () {
        this._super()
    }, 
    destroy: function () {
        var e = this;
        e.destroyFunc(), 
        $(window).off("resize", e.bindScrollEventTimeout)
    }
});
angular.module("directives.youMainbody", []).directive("youMainbody", ["$timeout", "$Popup", "$document",
    function (e, t, i) {
        return {
            restrict: "A",
            link: function (n, a, o) {
                new youMainBodyDirective(n, a, o, e, t, i)
            }
        }
    }
]);

}());