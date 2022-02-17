var youDateSummaryDirective = BaseController.extend({
    _format: "YYYY/MM/DD",
    init: function (e, t, i, n, a, o, s) {
        function r() {
            p.onChange && p.onChange(p.timeStart, p.timeEnd)
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
        this._scope = e, this._elm = t, this._super(e), this._$Time = s;
        var d = this;
        e.data || (e.data = {});
        var p = e.data;
        null == p.timeStart && (p.timeStart = s.getSearchStart()), null == p.timeEnd && (p.timeEnd = s.getSearchEnd()), e.getDateA = function () {
            return p.timeStart ? moment(p.timeStart).format(d._format) : ""
        }, 
        e.getDateB = function () {
            return p.timeEnd ? moment(p.timeEnd).format(d._format) : ""
        }, 
        e.dataCalendarA = {
            type: "date",
            time: p.timeStart,
            showCleanup: e.data.showCleanup,
            onSelected: function (t) {
                if (0 === t) p.timeStart = 0;
                else {
                    t = s.getLite(t), 
                    p.timeStart = t, 
                    p.timeEnd && t > p.timeEnd && (e.dataCalendarB.time = p.timeEnd = t);
                    var i = moment(t).add(44, "days").add("d", 1).subtract("ms", 1).toDate().getTime();
                    p.timeEnd && p.timeEnd > i && (e.dataCalendarB.time = p.timeEnd = i)
                }
                e.isShowA = !1, 
                o.off("click", l), 
                r()
            }, 
            limit: [66666, 0]
        }, 
        e.dataCalendarB = {
            type: "date",
            time: p.timeEnd,
            showCleanup: e.data.showCleanup,
            onSelected: function (t) {
                if (0 === t) p.timeEnd = 0;
                else {
                    t = s.getLite(t), 
                    p.timeEnd = moment(t).add("d", 1).subtract("ms", 1).toDate().getTime(), 
                    p.timeStart && t < p.timeStart && (e.dataCalendarA.time = p.timeStart = t);
                    var i = moment(t).subtract(44, "days").toDate().getTime();
                    p.timeStart && p.timeStart < i && (e.dataCalendarA.time = p.timeStart = i)
                }
                e.isShowB = !1, 
                o.off("click", c), r()
            }, 
            limit: [66666, 0]
        };
        var u = angular.element(t.find("div")[4]),
            m = angular.element(t.find("div")[8]);
        u.append(n('<you-calendar-with-limit data="dataCalendarA"></you-calendar-with-limit>')(e)), m.append(n('<you-calendar-with-limit data="dataCalendarB"></you-calendar-with-limit>')(e)), t.on("click", function (e) {
            angular.element(e.target).hasClass("t-value") || e.stopPropagation()
        }), 
        e.onClickShow = function (t) {
            1 == t ? (e.isShowB && c(), e.dataCalendarA.reset(), e.isShowA = !0, a(function () {
                o.on("click", l)
            })) : (e.isShowA && l(), e.dataCalendarB.reset(), e.isShowB = !0, a(function () {
                o.on("click", c)
            }))
        }, 
        p.cleanUp = function () {
            e.dataCalendarA.cleanUp(), e.dataCalendarB.cleanUp()
        }, 
        p.cleanUpA = function () {
            e.dataCalendarA.cleanUp()
        }, 
        p.cleanUpB = function () {
            e.dataCalendarB.cleanUp()
        }
    }
});
angular.module("directives.youDateSummary", []).directive("youDateSummary", ["$compile", "$timeout", "$document", "$Time",
    function (e, t, i, n) {
        return {
            restrict: "E",
            scope: {
                data: "="
            },
            link: function (a, o, s) {
                new youDateSummaryDirective(a, o, s, e, t, i, n)
            }, template: '<div class="input-group input-group-iai"><div class="calendar-wrap"> <div class="position: relative;" ng-click="onClickShow(1)">  <input type="text" class="input input-long input-left t-value" ng-value="getDateA()" ng-disabled="isShowA" placeholder="请选择日期">  <div style="position: absolute; top: 0; left: 0; bottom: 0; right: 0;z-index: 1;"></div> </div> <div ng-show="isShowA"></div></div><span class="input-group-addon">-</span><div class="calendar-wrap"> <div class="position: relative;" ng-click="onClickShow(2)">  <input type="text" class="input input-long t-value" ng-value="getDateB()" ng-disabled="isShowB" placeholder="请选择日期">  <div style="position: absolute; top: 0; left: 0; bottom: 0; right: 0;z-index: 1;"></div> </div> <div ng-show="isShowB"></div></div></div>'
        }
    }
]);