
var youDatetimeDirective = BaseController.extend({
    _format: "YYYY/MM/DD HH:mm",
    init: function (e, t, i, n, a, o, s) {
        function r() {
            u.onChange && u.onChange(u.timeStart, u.timeEnd), 
            u.timeStart ? e.dateA = moment(u.timeStart).format(d._format) : e.dateA = "", 
            u.timeEnd ? -1 == u.timeEnd ? e.dateB = "永久" : e.dateB = moment(u.timeEnd).format(d._format) : e.dateB = "", 
            u.onChange && u.onChange(u.timeStart, u.timeEnd)
        }

        function l() {
            a(function () {
                e.isShowA = !1
            }), o.off("click", l)
        }

        function c() {
            a(function () {
                e.isShowB = !1
            }), o.off("click", c)
        }
        this._scope = e, 
        this._elm = t, 
        this._super(e), 
        this._$Time = s;
        var d = this,
            p = i.youDatetimeDir || "up";
        "true" == i.disabled && a(function () {
            t.find("button").prop("disabled", !0)
        }), e.data || (e.data = {});
        var u = e.data;
        d._format = u.format || d._format;

        !isNaN(u.timeStart) || (u.timeStart = moment(moment(s.get()).format("YYYY/MM/DD HH:mm"), "YYYY/MM/DD HH:mm").toDate().getTime()), 
        !isNaN(u.timeEnd) || (u.timeEnd = u.timeStart), 


        e.data.getTime = function () {
            return [u.timeStart, u.timeEnd]
        }, 
        e.$watch("data.timeStart", function () {
            r()
        }), 
        e.$watch("data.timeEnd", function () {
            r()
        }), 
        e.dataCalendarA = {
            type: "datetime",
            format: d._format,
            time: u.timeStart,
            isHour:u.isHour,
            direction: p,
            onSelected: function (t) {
                u.timeStart = t, 
                u.timeEnd && -1 != u.timeEnd && t > u.timeEnd && (e.dataCalendarB.time = u.timeEnd = t), 
                e.isShowA = !1, 
                o.off("click", l), 
                r()
            }
        }, 
        e.dataCalendarB = {
            type: "datetime",
            showUnlimited: u.showUnlimited==0?u.showUnlimited:!0,
            format: d._format,
            isHour:u.isHour,
            time: u.timeEnd,
            direction: p,
            onSelected: function (t) {
                u.timeEnd = t, 
                u.timeStart && -1 != t && t < u.timeStart && (e.dataCalendarA.time = u.timeStart = t), 
                e.isShowB = !1, 
                o.off("click", c), 
                r()
            }
        };
        var m = angular.element(t.find("div")[1]),
            g = angular.element(t.find("div")[3]);
        m.append(n('<you-calendar data="dataCalendarA"></you-calendar>')(e)), g.append(n('<you-calendar data="dataCalendarB"></you-calendar>')(e)), e.onClickShow = function (t, i) {
            i.preventDefault(), 
            i.stopPropagation(), 
            e.isShowA && l(), 
            e.isShowB && c(), 
            1 == t ? (e.dataCalendarA.reset(), e.isShowA = !0, a(function () {
                o.on("click", l)
            })) : (e.dataCalendarB.reset(), e.isShowB = !0, a(function () {
                o.on("click", c)
            }))
        }, 
        e.prevent = function (e) {
            e.preventDefault(), e.stopPropagation()
        }
    }, 
    defineListeners: function () {
        this._super()
    }, 
    destroy: function () {}
});

angular.module("directives.youDatetime", []).directive("youDatetime", ["$compile", "$timeout", "$document", "$Time",
    function (e, t, i, n) {
        return {
            restrict: "E",
            scope: {
                data: "="
            },
            link: function (a, o, s) {
                new youDatetimeDirective(a, o, s, e, t, i, n)
            }, template: '<div class="datetime-wrap" ng-hide="data.hideStart"><you-btn text="设置开始时间" class="t-value" ng-disabled="isShowA" ng-click="onClickShow(1, $event)" style="float: left;"></you-btn><span class="datetime-output" ng-click="prevent($event)">{{dateA}}</span><div ng-show="isShowA" ng-click="prevent($event)"></div></div><div class="datetime-wrap" ng-hide="data.hideEnd"><you-btn text="设置结束时间" class="t-value" ng-disabled="isShowB" ng-click="onClickShow(2, $event)" style="float: left;"></you-btn><span class="datetime-output" ng-click="prevent($event)">{{dateB}}</span><div ng-show="isShowB" ng-click="prevent($event)"></div></div>'
        }
    }
]);