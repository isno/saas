var youChkExpandDirective = BaseController.extend({
    init: function (e, t, i, n, a, o, s, r, l) {
        this._super(e);
        var c = (t.children()[0], 
            e.expandconf),
            d = angular.element("<div></div");
        d.css({
            width: "2000px"
        }), 
        c.extCss && d.css(c.extCss), 
        a(function () {
            t.addClass("transition-quick"),
            t.children().wrap(d)
        }), 
        c.manualStyle = function (e) {
            t.css(e)
        }, 
        e.$watch("expandconf.isExpand", function (e) {
            "function" == typeof c.onbeforeChange && c.onbeforeChange(), 
            t.css({
                overflow: "hidden"
            }), 
            e ? (t.css(c.expandStyle), a(function () {
                t.css({ overflow: "visible"})
            }, 200)) : t.css(c.initStyle)
        })
    }, 
    defineListeners: function () {
        this._super()
    }, 
    destroy: function () {}
});
angular.module("directives.youChkexpand", []).directive("youChkexpand", ["$compile", "$timeout", "$Popup", "$document", "$rootScope", "$Uri",
    function (e, t, i, n, a, o) {
        return {
            scope: {
                expandconf: "="
            },
            restrict: "A",
            link: function (s, r, l) {
                new youChkExpandDirective(s, r, l, e, t, i, n, a, o)
            }
        }
    }
]);