var youHelpDirective = BaseController.extend({
    init: function(e, t, i, n, a, o) {
        this._$scope = e,
        this._$elm = t,
        this._$timeout = n,
        this._super(e);
        var s = i.youWidth,
        r = i.youAlignright,
        l = i.youHelpContent,
        c = i.youNeedCompile,
        d = i.youHelpClick,
        p = i.youHelpContentTranslateY,
        u = '<div class="you-help-content" ng-click="$youHelpContentClick($event)">${tmpl}</div>',
        m = i.youHelpDir;
        m || (m = "top"),
        t.addClass("you-help-dir-" + m);
        var g = t.html(),
        f = "";
        if (void 0 !== l) g = l,
        i.$observe("youHelpContent",
        function(t) {
            return function(i) {
                if (t) {
                    if ("true" == c) {
                        var n = a(angular.element(u.replace("${tmpl}", i)))(e);
                        f.replaceWith(n),
                        f = n
                    } else f.html(i);
                    f.prepend(_)
                }
                t = !0
            }
        } (!1));
        else switch (f = g, i.type) {
        case "warn":
            t.html('<span class="iconfont icon-warn"></span>');
            break;
        case "authed":
            t.html('<span class="ico ico-authed"></span>');
            break;
        default:
            t.html('<span class="ico ico-help"></span>')
        }
        if ("eye" == i.type ? t.addClass("you-help2") : t.addClass("you-help"), f = "true" == c ? a(angular.element(u.replace("${tmpl}", g)))(e) : angular.element('<div class="you-help-content">' + g + "</div>"), p || "0" == p) {
            var h = {};
            "top" === m ? h.bottom = p + "px": h.top = p + "px",
            f.css(h)
        }
        var _ = angular.element('<span class="b64-you-help you-help-arrow"></span>');
        f.prepend(_),
        t.append(f);
        var v = !1,
        y = !1,
        b = !1,
        w = function() {
            return o(i.youHelpDisabled)(e)
        };
        e.$youHelpContentClick = function(t) {
            d && o(d)(e, {
                $event: t
            })
        },
        t.on("mouseenter",
        function() {
            w() || (v = !0, b ? f.css({
                display: "block"
            }) : (b = !0, f.css({
                display: "block",
                visibility: "hidden"
            }), s ? f.css({
                left: f[0].offsetWidth / 2 * -1 + Number(s) / 2 + "px",
                visibility: "visible"
            }) : f.css({
                left: f[0].offsetWidth / 2 * -1 + 8 + "px",
                visibility: "visible"
            }), r && (f.css({
                left: "auto",
                right: "-5px",
                visibility: "visible"
            }), f.find("span").css({
                left: "auto",
                right: "5px"
            }))), "auto" === s && f.css({
                left: f[0].offsetWidth / 2 * -1 + Number(t[0].offsetWidth) / 2 + "px",
                visibility: "visible"
            }))
        }),
        t.on("mouseleave",
        function() {
            v = !1,
            n(function() {
                y || v || f.css({
                    display: "none"
                })
            },
            100)
        }),
        f.on("mouseenter",
        function() {
            y = !0,
            f.css({
                display: "block"
            })
        }),
        f.on("mouseleave",
        function() {
            y = !1,
            v || f.css({
                display: "none"
            })
        }),
        e.$on("$stateChangeSuccess",
        function() {
            y && $(f).hide()
        })
    }
});
angular.module("directives.youHelp", []).directive("youHelp", ["$timeout", "$compile", "$parse",
function(e, t, i) {
    return {
        restrict: "A",
        link: function(n, a, o) {
            new youHelpDirective(n, a, o, e, t, i)
        }
    }
}]);