var youDropdownDirective = BaseController.extend({
    init: function(e, t, i, n, a, o, s) {
        this._scope = e,
        this._elem = $(t),
        this._trigger = $(n),
        this._dropdown = $(i),
        this._arrow = $(a),
        this._dropdownParent = $(o),
        this._q = s,
        this._super(e),
        this.bindEvent(),
        this.bindWatch(),
        this.exposeApi(["setPosition", "toggleDropdown"]),
        e.$dropdown.isOpen && this.toggleDropdown(!0)
    },
    bindWatch: function() {
        var e = this._dropdown;
        this._scope.$watch("$dropdown.$display",
        function(t) {
            t ? (e.css("visibility", "hidden").css("visibility"), e.show(), this.setPosition(function() {
                e.css("visibility", "visible")
            })) : e.hide()
        }.bind(this))
    },
    bindEvent: function() {
        var e, t, i, n = this,
        a = this._scope,
        o = this._trigger,
        s = this._dropdown,
        r = this.throttle,
        l = "hover" == a.$dropdown.action,
        c = a.$dropdown.stopPropagation,
        d = !1,
        p = null,
        u = r(n.setPosition).bind(this),
        m = {
            resize: r(n.setPosition, 50, 50).bind(this)
        },
        g = {
            click: function(e) {
                var t = e.target,
                i = t === s[0] || $.contains(s[0], t),
                r = t === o[0] || $.contains(o[0], t);
                a.$dropdown.$display && a.$dropdown.$closeOnClick && !i && !r && n.toggleDropdown(!1),
                i && !p && (p = a.$on("$stateChangeSuccess",
                function(e) {
                    a.$dropdown.$display && n.toggleDropdown(!1),
                    p(),
                    p = null
                }))
            }
        };
        l ? (t = {
            mouseenter: function() {
                n.toggleDropdown(!0),
                d = !0
            },
            mouseleave: function() {
                e = setTimeout(n.toggleDropdown.bind(n, !1), 100)
            }
        },
        i = {
            mouseenter: function() {
                clearTimeout(e)
            },
            mouseleave: function() {
                d && n.toggleDropdown(!1)
            }
        }) : t = {
            click: function(e) {
                c && e.stopPropagation(),
                n.toggleDropdown()
            }
        },
        o.on(t),
        s.on(i),
        $(window).on(m).get(0).addEventListener("scroll", u, !0),
        this.bindDocumentClick = function() {
            document.addEventListener("click", g.click, !0)
        },
        this.unbindDocumentClick = function() {
            document.removeEventListener("click", g.click, !0)
        },
        this.unbindEvent = function() {
            this.unbindDocumentClick(),
            o.off(t),
            s.off(i),
            $(window).off(m).get(0).removeEventListener("scroll", u, !0)
        }
    },
    exposeApi: function(e) {
        var t = this,
        i = this._scope;
        _.forEach(e,
        function(e) {
            i.$dropdown["$" + e] = t[e].bind(t)
        })
    },
    throttle: function(e, t, i) {
        var n, a = null;
        return i = i || 0,
        function() {
            var o = this,
            s = +new Date;
            n = n || s,
            clearTimeout(a),
            t && s - n > t ? (e.apply(o, arguments), n = s) : a = setTimeout(function() {
                e.apply(o, arguments)
            },
            i)
        }
    },
    getVisualOffsetToParent: function(e, t) {
        for (var i = this._dropdownParent,
        n = 0,
        a = 0; e;) n += e.offsetLeft,
        a += e.offsetTop,
        e !== i[0] && (n -= e.scrollLeft, a -= e.scrollTop),
        (e = e.offsetParent) === t && (e = null);
        return {
            left: n,
            top: a
        }
    },
    getTriggerBounding: function() {
        var e = this._trigger,
        t = this._dropdownParent,
        i = this.getVisualOffsetToParent(e[0], t[0]),
        n = i.left,
        a = i.top,
        o = e.outerWidth(),
        s = e.outerHeight();
        return {
            left: n,
            top: a,
            right: t.outerWidth() - o - n,
            bottom: t.outerHeight() - s - a,
            width: o,
            height: s
        }
    },
    getDropdownSize: function() {
        var e = this._dropdown;
        return {
            width: e.outerWidth(),
            height: e.outerHeight()
        }
    },
    setPosition: function(e) {
        var t = this._scope,
        i = {
            top: "bottom",
            bottom: "top",
            left: "right",
            right: "left"
        },
        n = i[t.$dropdown.dir];
        t.$dropdown.$display && setTimeout(function() {
            var i = this._dropdown,
            a = this._arrow,
            o = this.getTriggerBounding(),
            s = this.getDropdownSize(),
            r = a.get(0).offsetWidth / 2,
            l = t.$dropdown.gap,
            c = t.$dropdown.align,
            d = {},
            p = {},
            u = function(e) {
                var t = "top" === e ? "height": "width";
                "start" == c ? (d[e] = o[e], p[e] = o[t] / 2) : "end" == c ? (d[e] = o[e] + o[t] - s[t], p[e] = s[t] - o[t] / 2) : (d[e] = o[e] + (o[t] - s[t]) / 2, p[e] = s[t] / 2)
            };
            switch (t.$dropdown.dir) {
            case "left":
            case "right":
                d[n] = o[n] + o.width + l + r,
                u("top");
                break;
            case "top":
            case "bottom":
                d[n] = o[n] + o.height + l + r,
                u("left")
            }
            angular.isNumber(t.$dropdown.position) && (d[n] = t.$dropdown.position + r),
            i.css(d),
            a.css(p),
            angular.isFunction(e) && e()
        }.bind(this))
    },
    toggleDropdown: function(e) {
        var t = this,
        i = this._scope,
        n = this._q,
        a = (this._dropdown, i.$dropdown),
        o = arguments.length ? !!e: !i.$dropdown.$display,
        s = o ? "Open": "Close",
        r = a["before" + s],
        l = a["after" + s];
        r = angular.isFunction(r) ? r: angular.noop,
        l = angular.isFunction(l) ? l: angular.noop,
        n.when(r(i),
        function(e) { ! 1 !== e && (o ? t.bindDocumentClick() : t.unbindDocumentClick(), i.$dropdown.$display = o, l(i))
        })
    },
    destroy: function() {
        this._dropdown.remove(),
        this.unbindEvent()
    }
});
angular.module("directives.youDropdown", []).directive("youDropdown", ["$timeout", "$compile", "$q",
function(e, t, i) {
    var n = {
        dir: "bottom",
        gap: 2,
        addClass: [],
        $closeOnClick: !0
    };
    return {
        restrict: "AE",
        scope: !0,
        terminal: !0,
        compile: function() {
            return function(a, o, s) {
                function r(e) {
                    if (e = e || document.body, g = t(g)(a), h) {
                        var n = t(c.html())(a);
                        c.empty(),
                        c.append(n)
                    } else c = t(c)(a),
                    o.append(c);
                    $(e).append(g),
                    new youDropdownDirective(a, o, g, c, f, e, i)
                }
                o = $(o);
                var l = s.youDropdown || s.data,
                c = o.find("[you-dropdown-trigger]"),
                d = o.find("[you-dropdown-content]"),
                p = d.attr("you-dropdown-content"),
                u = angular.extend({},
                n, a[l]),
                m = ["dropdown-wrap", "dropdown-wrap-" + u.dir],
                g = $('<div ng-class="$dropdown.$className" ng-style="$dropdown.style"></div>'),
                f = $('<span class="dropdown-arrow" ng-hide="$dropdown.hideArr"></span>'),
                h = !c.length;
                if (h ? (c = o, d.remove()) : o.empty(), ["isOpen", "dir", "align", "hideArr", "gap", "position", "appendTo", "action", "stopPropagation", "addClass", "replaceClass"].forEach(function(e) {
                    var t = "you" + e[0].toUpperCase() + e.slice(1);
                    if (t in s) {
                        var i = s[t];
                        switch (e) {
                        case "gap":
                        case "position":
                            i = +i;
                            break;
                        case "isOpen":
                        case "hideArr":
                        case "stopPropagation":
                            i = "true" === i
                        }
                        u[e] = i
                    }
                }), u.$className = u.replaceClass || m.concat(u.addClass), angular.isFunction(u.init)) {
                    var _ = u.init(a);
                    a = _ && _.$id ? _: a
                }
                a.$dropdown = u,
                g.append(f),
                g.append(d),
                p && a.$watch(p,
                function(e) {
                    d.html(e),
                    d.replaceWith(t(d)(a))
                }),
                u.appendTo ? r($(u.appendTo)) : e(function() {
                    r(o[0].offsetParent)
                })
            }
        }
    }
}]);