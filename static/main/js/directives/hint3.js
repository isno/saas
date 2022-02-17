var youHint3Directive = BaseController.extend({
    init: function (e, t) {
        this._$scope = e, this._$elm = t, this._super(e);
        var i = t.html();
        t.addClass("you-hint3"), t.html('<span class="ico ico-help"></span>');
        var n = angular.element('<div class="you-hint3-content">' + i + "</div>");
        t.append(n);
        var a = angular.element('<span class="ico ico-help-arrow t-arrow"></span>');
        n.prepend(a);
        var o = !1;
        t.on("mouseenter", function () {
            o ? n.css({
                display: "block"
            }) : (o = !0, n.css({
                display: "block",
                visibility: "hidden"
            }), n.css({
                left: n[0].offsetWidth / 2 * -1 + 7 + "px",
                visibility: "visible"
            }), a.css({
                left: n[0].offsetWidth / 2 - 4 + "px"
            }))
        }), t.on("mouseleave", function () {
            n.css({
                display: "none"
            })
        })
    }
});
angular.module("directives.youHint3", []).directive("youHint3", [
    function () {
        return {
            restrict: "A",
            link: function (e, t, i) {
                new youHint3Directive(e, t, i)
            }
        }
    }
]);


var youHint2Directive = BaseController.extend({
    init: function (e, t, i, n) {
        this._$scope = e, this._$elm = t, this._super(e), this._wrap = angular.element('<div class="you-hint2"></div>'), t.wrap(this._wrap), this._wrap = t.parent(), this._tipsWrap = angular.element('<div class="you-hint2-wrap"></div>'), this._tipsWrap.addClass("hide"), this._wrap.append(this._tipsWrap);
        var a = angular.element('<div class="you-hint2-tips"></div>');
        this._tipsWrap.append(a), a.append('<span class="ico ico-invalid-arrow"></span>'), this._tipsText = angular.element("<span></span>"), a.append(this._tipsText);
        var o = this;
        t.on("mouseenter", function () {
            o._tipsText.text(t.attr("you-hint2")), o._tipsWrap.removeClass("hide").addClass("show"), o._tipsWrap.css({
                "margin-left": o._tipsWrap[0].offsetWidth / 2 * -1 + "px",
                "margin-top": t[0].offsetHeight + 5 + "px"
            })
        }), t.on("mouseleave", function () {
            o._tipsWrap.removeClass("show").addClass("hide")
        })
    }, destroy: function () {
        this._$elm.off()
    }
});
angular.module("directives.youHint2", []).directive("youHint2", ["$timeout",
    function (e) {
        return {
            restrict: "A",
            link: function (t, i, n) {
                new youHint2Directive(t, i, n, e)
            }
        }
    }
]);