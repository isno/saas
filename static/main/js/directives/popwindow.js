(function(){
    var youPopWindowDirective = BaseController.extend({
        init: function (e, t, i, n, a, o, s) {
            function r(t) {
                switch (t.keyCode) {
                case 13:
                    m();
                    break;
                case 27:
                    e.close()
                }
            }
            this._super(e), this.$scope = e;
            var l = e.data.scope,
                c = null,
                d = t.children()[0],
                p = angular.element(t.children()[0]).children()[1];
            e.elm = t, e.close = function (t) {
                e.stopPro(t), e.closedisabled || (e.data.onClose ? e.data.onClose(c, e) : o.close())
            }, e.removePop = function () {
                angular.element(window).unbind("resize", y), t.off("keypress", r), s.find("body").unbind("mousewheel DOMMouseScroll", b), s.find("body").removeClass("hiddenScroll")
            }, e.fClick = function (t, i) {
                e[t] || (e[t] = !0, l[t](c, e, i))
            }, e.stopPro = function (t) {
                !e.data.notpreventDefault && t && (t.preventDefault(), t.stopPropagation())
            };
            var u = _.find(e.data.btn, {
                    enter: !0
                }),
                m = function () {
                    if (u) {
                        e.fClick(u.click);
                        try {
                            l.$digest()
                        } catch (e) {}
                    }
                };
            e.oMinConf = {}, e.bMax = !1, e.popupFullScreen = function (t) {
                e.bMax = void 0 === t ? !e.bMax : t, a(e.bMax ? function () {
                    angular.element(d).css({
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0
                    }), a(function () {
                        e.data.onAfterMax && e.data.onAfterMax(d, e)
                    }, 500)
                } : function () {
                    angular.element(d).css({
                        top: e.oMinConf.top,
                        left: e.oMinConf.left,
                        bottom: e.oMinConf.top,
                        right: e.oMinConf.left
                    }), a(function () {
                        e.data.onAfterMin && e.data.onAfterMin(d, e)
                    })
                })
            };
            var g, f, h, v;
            e.bPreventScroll = !0;
            var y = function () {
                angular.element(d).removeClass("transition"), a(function () {
                    var i, n, o, r = !1,
                        l = !1;
                    g = t[0].offsetHeight, f = t[0].offsetWidth;
                    var c = function (t) {
                            if (t) angular.element(d).css({
                                width: "auto"
                            }), i = "0px";
                            else {
                                angular.element(d).css({
                                    width: v + "px"
                                });
                                i = (f - v) / 2 + "px", e.oMinConf.left = i, e.oMinConf.right = i, angular.element(d).css({
                                    width: "auto"
                                })
                            }
                        },
                        u = function (t) {
                            if (t) n = g - 72 - 50 + "px", e.isFreePop && (n = g + 6 + "px"), angular.element(p).css({
                                height: n
                            }), angular.element(p).css({
                                overflow: "auto"
                            }), angular.element(d).css({
                                height: g + "px"
                            }), o = "0px";
                            else {
                                angular.element(p).css({
                                    height: "auto"
                                }), angular.element(d).css({
                                    height: "auto"
                                });
                                o = (g - h) / 2 + "px", e.oMinConf.top = o, e.oMinConf.bottom = o
                            }
                        };
                    f < v && (r = !0), g < h && (l = !0), r || l ? (s.find("body").addClass("hiddenScroll"), e.bPreventScroll = !1, c(r), u(l)) : (s.find("body").removeClass("hiddenScroll"), e.bPreventScroll = !0, c(!1), u(!1)), e.bMax ? e.popupFullScreen(!0) : (angular.element(d).css({
                        left: i
                    }), angular.element(d).css({
                        right: i
                    }), angular.element(d).css({
                        top: o
                    }), angular.element(d).css({
                        bottom: o
                    })), a(function () {
                        angular.element(d).addClass("transition")
                    }, 100)
                })
            };
            e.adjustPop = y, e.reAdjust = function () {
                angular.element(d).css({
                    opacity: "0"
                }), angular.element(d).css({
                    top: "auto",
                    bottom: "auto",
                    height: "auto"
                }), h = d.offsetHeight, v = d.offsetWidth, a(function () {
                    y(), angular.element(d).css({
                        opacity: "1"
                    })
                }, 100)
            }, a(function i() {
                if (c = e.data.bTemplate ? e.$$childHead.$$childHead : e.$$childHead, i.count = i.count || 0, !c && i.count++ < 100) return void a(i);
                _.forEach(e.data.initModel, function (e, t) {
                    c[t] = e
                }), l && l.contentStyle && (e.contentStyle = l.contentStyle), e.data.focus ? t.find(e.data.focus)[0].focus() : t[0].focus(), t.on("keyup", r), e.data.returnElm && (e.elm = t), angular.element(window).bind("resize", y), a(function () {
                    h = d.offsetHeight, v = d.offsetWidth, y(), a(function () {
                        t.css({
                            opacity: 1
                        }), a(function () {
                            e.data.showMaximize && (angular.element(d).addClass("transition"), angular.element(d).css({
                                width: "auto"
                            }))
                        }, 500)
                    })
                }, 0)
            });
            var b = function (t) {
                e.bPreventScroll && !e.data.notpreventScroll && t.preventDefault()
            };
            e.unBindBodyScroll = function () {
                s.find("body").unbind("mousewheel DOMMouseScroll", b)
            }, 
            s.find("body").bind("mousewheel DOMMouseScroll", b)
        }, 
        defineListeners: function () {
            this._super()
        }, 
        destroy: function () {
            this.$scope.removePop()
        }
    });
    angular.module("directives.youPopwindow", []).directive("youPopwindow", ["$compile", "$timeout", "$Popup", "$document", "$rootScope",
        function (e, t, i, n, a) {
            return {
                scope: {
                    data: "="
                },
                restrict: "E",
                link: function (o, s, r) {
                    new youPopWindowDirective(o, s, r, e, t, i, n, a)
                }, transclude: !0,
                replace: !0,
                template: '<div class="popup transition-quick fade_3d_wrap {{ popupExtCls }}" tabindex="-1" ng-click="stopPro($event)" style="opacity:0"><div class="popup-normal fade_3d" ng-style="data.popStyle"><div class="popup-normal-title" ng-hide="hideTitle"><h1 ng-hide="hideTitleText" title="{{ data.title }}">{{ data.title }}</h1><a ng-hide="data.noX" class="popup-normal-close" href="javascript:void(0);" ng-click="close($event)"></a><a ng-show="data.showMaximize" class="popup-normal-fullscreen" href="javascript:void(0);" ng-click="popupFullScreen()"></a></div><div class="popup-normal-content {{ data.contentextclass }}" ng-style="contentStyle" ng-transclude></div><div class="popup-normal-ctrl" ng-hide="hideCtrl" ng-class="{\'popup-normal-ctrl-cover\': data.addCtrlBg}"><label ng-if="data.checkbox" style="cursor: pointer;"><input type="checkbox" you-check ng-model="data.checkbox.checked" ng-click="data.checkbox.onchange && data.checkbox.onchange(data.checkbox.checked)"> {{data.checkbox.text}}</label><you-btn ng-repeat="i in data.btn" type="{{i.type}}" text="{{i.text}}" ng-click="fClick(i.click, $event)" ng-hide="i.hide" ng-disabled="i.disabled"></you-btn></div></div>'
            }
        }
    ]);

}());