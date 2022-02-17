var youGridDirective = BaseController.extend({
    init: function(e, t, i, n) {
        function a() {
            var e = g.attr("ng-model"),
            t = g.scope();
            t && e && (t[e] = d)
        }
        function o(e) {
            e && (g.prop("checked", !1), c = !1),
            r(),
            n(function() {
                f = [],
                angular.forEach(h.find("tr"),
                function(e, t) {
                    var i = angular.element(e);
                    f[t] = i.find("td").eq(0).find("input"),
                    i.off("click"),
                    i.on("click",
                    function() {
                        f[t].prop("checked", !f[t].prop("checked")),
                        f[t].triggerHandler("click")
                    })
                }),
                s(function(e) {
                    e.off("click"),
                    e.on("click",
                    function(e) {
                        e.stopPropagation(),
                        d = !0,
                        c = !1,
                        s(function(e) {
                            e.prop("checked") ? c = !0 : d = !1
                        }),
                        g.prop("checked", d),
                        a(),
                        r()
                    })
                }),
                a()
            },
            100)
        }
        function s(e) {
            angular.forEach(f,
            function(t, i) {
                e(t, i)
            })
        }
        function r() {
            n(function() {
                e.data.onCheckedChange && e.data.onCheckedChange(c)
            })
        }
        function l() {
            var e = [];
            return s(function(t, i) {
                t.prop("checked") && e.push(i)
            }),
            e
        }
        this._scope = e,
        this._elm = t,
        this._super(e),
        e.data || (e.data = {});
        var c = !1,
        d = !1;
        e.data.refresh = function() {
            o(!0)
        },
        e.data.refreshSoft = function() {
            o()
        },
        e.data.getChecked = function() {
            return l()
        };
        var p = t.find("table"),
        u = p.find("thead"),
        m = u.find("th").eq(0),
        g = m.find("input");
        this.checkAllInput = g;
        var f = [],
        h = p.find("tbody");
        this.tableBodyTbody = h,
        p.wrap('<div class="grid-list"></div>'),
        u.addClass("grid-list-header"),
        n(function() {
            u.css({
                "border-width": "1px"
            })
        },
        0),
        h.addClass("grid-list-body"),
        g.length > 0 && (m.addClass("t-th-cb"), g.on("click",
        function() {
            c = g.prop("checked"),
            s(function(e) {
                e.prop("checked", c)
            }),
            c && !l().length || r()
        }))
    },
    defineListeners: function() {
        this._super()
    },
    destroy: function() {
        this.checkAllInput.off(),
        this.tableBodyTbody.find("tr").off(),
        this.tableBodyTbody.find("tr").find("input").off()
    }
});
angular.module("directives.youGrid", []).directive("youGrid", ["$timeout",
function(e) {
    return {
        restrict: "E",
        scope: {
            data: "="
        },
        link: function(t, i, n) {
            new youGridDirective(t, i, n, e)
        }
    }
}]);