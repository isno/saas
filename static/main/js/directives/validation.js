var youValidtionDirective = BaseController.extend({
    init: function (e, t, i, n, a) {
        this._$scope = e, 
        this._$elm = t, 
        this._$timeout = n, 
        this._super(e);
        var o = this;
        o._$util = a, 
        this.validationRules = YouPreset.VALIDATIONS, 
        this._wrap = null, 
        this._tipsWrap = null, 
        this._tipsText = null, 
        this._validation = null, 
        this._validationArgs = null, 
        this._name = i.name ? i.name : i.ngModel, 
        this._trim = "false" !== i.youValidationTrim, 
        this._encodehtml = "true" === i.youValidationEncodehtml;
        
        var s = function () {
            o._validation = i.youValidation.split("|"), 
            o._validationArgs = [], 
            _.forEach(o._validation, function (e, t) {
                var i = e.indexOf("("); 
                - 1 != i && (o._validation[t] = e.slice(0, i), o._validationArgs[t] = e.slice(i + 1, e.length - 1).split(","))
            })
        };
        i.$observe("youValidation", s);
        var r;
        (r = void 0 === e.$index ? e.validation : e.$parent.validation) || (r = {});
        var l = function (e, t) {
            "none" == e.element.style.display || "hidden" == e.element.style.visibility ? (o._executeOnce(function () {
                "none" == e.element.style.display ? (e.element.style.display = "block", e.element.focus(), e.element.style.display = "none") : (e.element.style.visibility = "visible", e.element.focus(), e.element.style.visibility = "hidden")
            }), t && n(function () {
                e.toggle.apply(e, t)
            }, 100)) : (o._executeOnce(function () {
                e.element.focus()
            }), 
            t && e.toggle.apply(e, t))
        };
        _.isEmpty(r) && (angular.extend(r, {
            toggle: function (t, i, n, a) {
                var o = e.validation.list[t];
                o && (a ? l(o, [i, n]) : o.toggle(i, n))
            }, 
            validate: function (t) {
                var i = !0,
                    n = !1;
                return _.forEach(t, function (t) {
                    var a = e.validation.list[t];
                    a && !a.validate() && (i = !1, n || (n = !0, l(a)))
                }), i
            }, list: {}
        }), void 0 === e.$index ? e.validation = r : e.$parent.validation = r), r.list[o._name] = {
            toggle: function (e, t) {
                e ? o._showTips(t) : o._hideTips()
            }, 
            validate: function () {
                return o._validate()
            }, 
            element: t[0]
        }, 
        o._wrap = $('<div class="validation"></div>'), 
        t.wrap(o._wrap), 
        o._wrap = t.parent(), 
        o._tipsWrap = $('<div class="validation-tips-wrap"></div>'), 
        o._tipsWrap.addClass("hide"), 
        o._wrap.append(o._tipsWrap);

        var c = $('<div class="validation-tips"></div>');
        o._tipsWrap.append(c), 
        c.append('<span class="ico ico-invalid-arrow"></span>'), 
        o._tipsText = $("<span></span>"), 
        c.append(o._tipsText), 
        t.on("blur", function () {
            o._validate()
        }), 
        t.on("keyup", function () {
            o._hideTips()
        }), 
        t.attr("type") && "file" == t.attr("type") && t.on("change", function () {
            o._validate()
        })
    }, 
    _executeOnce: function (e) {
        var t = this._$timeout;
        t.cancel(this._executeOnceTimer), 
        this._executeOnceTimer = t(e)
    }, 
    _showTips: function (e) {
        var t = this;
        this._tipsText.html(e), 
        this._tipsWrap.removeClass("hide").addClass("show"), 
        this._wrap.addClass("invalid"), 
        t._tipsWrap.css({
            "margin-left": t._tipsWrap[0].offsetWidth / 2 * -1 + "px"
        })
    }, 
    _hideTips: function () {
        this._tipsWrap.removeClass("show").addClass("hide"), 
        this._wrap.removeClass("invalid")
    }, 
    _validate: function () {
        var e = this;
        this._hideTips();
        var t = this._$elm[0].value;
        "checkbox" === this._$elm[0].type && (t = this._$elm[0].checked ? "checked" : ""), this._trim && this._$elm[0].type && "password" !== this._$elm[0].type.toLowerCase() && "file" !== this._$elm[0].type.toLowerCase() && (t = $.trim(t), this._$elm[0].value = t);
        for (var i = 0, n = this._validation.length; i < n; i++)
            if (("requiredHtml" == this._validation[i] || "required" == this._validation[i] || 0 !== t.length) && "" !== this._validation[i]) {
                var a = this.validationRules[this._validation[i]];
                if (!a) return;
                var o = angular.copy(this._validationArgs[i]) || [],
                    s = a.regexp,
                    r = a.expectTrue,
                    l = a.text;
                switch ("defaultText" in a && (angular.isFunction(r) ? o.length > r.length && (l = o.pop()) : l = a.textIndex ? o[a.textIndex] : o.pop(), l = l || a.defaultText), this._validation[i]) {
                case "length":
                    s = s.replace("{x}", o[0]).replace("{y}", o[1]), l = l.replace("{x}", o[0]).replace("{y}", o[1]);
                    break;
                case "minlength":
                case "maxlength":
                case "maxlengthSpecial":
                    s = s.replace("{x}", o[0]), l = l.replace("{x}", o[0]);
                    break;
                case "range":
                    l = l.replace("{x}", o[0]).replace("{y}", o[1])
                }
                if (angular.isString(s) && (s = new RegExp(s), e._encodehtml && "maxlength" === this._validation[i])) {
                    var c = t;
                    c = e._$util.htmlEnDeCode.htmlEncode(c), 
                    c.length != t.length && (t = c, l = l + "，当前" + t.length + '字，转义将占用额外长度。<a class="text-link" href="' + YouPreset.DOCS_HELP_CHARACTER + '" target="_blank">转义字符列表</a>', l = l.replace(/个字符/g, "字"))
                }
                if (s instanceof RegExp && (r = function () {
                    return s.test(t)
                }), !r.apply(t, o)) return this._showTips(l), !1
            }
        return !0
    }, 
    destroy: function () {
        this._$elm.off()
    }
});
angular.module("directives.youValidation", []).directive("youValidation", ["$timeout", "$Util",
    function (e, t) {
        return {
            restrict: "A",
            link: function (i, n, a, o) {
                new youValidtionDirective(i, n, a, e, t)
            }
        }
    }
]);