var youDateDirective = BaseController.extend({
    _format: "YYYY/MM/DD",
    init: function(e, t, i, n, a, o, s) {
        function r() {
            p.onChange && p.onChange(p.timeStart, p.timeEnd)
        }
        function l() {
            a(function() {
                e.isShowA = !1
            }),
            o.off("click", l)
        }
        function c() {
            a(function() {
                e.isShowB = !1
            }),
            o.off("click", c)
        }
        this._scope = e,
        this._elm = t,
        this._super(e),
        this._$Time = s;
        var d = this;
        e.data || (e.data = {});
        var p = e.data;
        null == p.timeStart && (p.timeStart = s.getSearchStart()),
        null == p.timeEnd && (p.timeEnd = s.getSearchEnd()),
        "datetime" == p.type ? e.style = {
            width: "130px"
        }: e.style = {
            width: "121px"
        },
        e.getDateA = function() {
            return p.timeStart ? "datetime" == p.type ? moment(p.timeStart).format("YYYY/MM/DD HH:mm") : moment(p.timeStart).format(d._format) : ""
        },
        e.getDateB = function() {
            return p.timeEnd ? "datetime" == p.type ? moment(p.timeEnd).format("YYYY/MM/DD HH:mm") : moment(p.timeEnd).format(d._format) : ""
        },
        e.dataCalendarA = {
            type: p.type ? p.type: "date",
            time: p.timeStart,
            showCleanup: e.data.showCleanup,
            onSelected: function(t) {
                0 === t ? p.timeStart = 0 : "datetime" == p.type ? (p.timeStart = t, p.timeEnd && t > p.timeEnd && (e.dataCalendarB.time = p.timeEnd = t)) : (t = s.getLite(t), p.timeStart = t, p.timeEnd && t > p.timeEnd && (e.dataCalendarB.time = p.timeEnd = moment(t).add("d", 1).subtract("ms", 1).toDate().getTime())),
                e.isShowA = !1,
                o.off("click", l),
                r()
            }
        },
        e.dataCalendarB = {
            type: p.type ? p.type: "date",
            time: p.timeEnd,
            showCleanup: e.data.showCleanup,
            onSelected: function(t) {
                0 === t ? p.timeEnd = 0 : "datetime" == p.type ? (p.timeEnd = t, p.timeStart && t < p.timeStart && (e.dataCalendarA.time = p.timeStart = t)) : (t = s.getLite(t), p.timeEnd = moment(t).add("d", 1).subtract("ms", 1).toDate().getTime(), p.timeStart && t < p.timeStart && (e.dataCalendarA.time = p.timeStart = t)),
                e.isShowB = !1,
                o.off("click", c),
                r()
            }
        };
        var u = angular.element(t.find("div")[4]),
        m = angular.element(t.find("div")[8]);
        u.append(n('<you-calendar data="dataCalendarA"></you-calendar>')(e)),
        m.append(n('<you-calendar data="dataCalendarB"></you-calendar>')(e)),
        t.on("click",
        function(e) {
            angular.element(e.target).hasClass("t-value") || e.stopPropagation()
        }),
        e.onClickShow = function(t) {
            1 == t ? (e.isShowB && c(), e.dataCalendarA.reset(), e.isShowA = !0, a(function() {
                o.on("click", l)
            })) : (e.isShowA && l(), e.dataCalendarB.reset(), e.isShowB = !0, a(function() {
                o.on("click", c)
            }))
        },
        p.cleanUp = function() {
            e.dataCalendarA.cleanUp(),
            e.dataCalendarB.cleanUp()
        },
        p.cleanUpA = function() {
            e.dataCalendarA.cleanUp()
        },
        p.cleanUpB = function() {
            e.dataCalendarB.cleanUp()
        }
    }
});
angular.module("directives.youDate", []).directive("youDate", ["$compile", "$timeout", "$document", "$Time",
function(e, t, i, n) {
    return {
        restrict: "E",
        scope: {
            data: "="
        },
        link: function(a, o, s) {
            new youDateDirective(a, o, s, e, t, i, n)
        },
        template: '<div class="input-group input-group-iai"><div class="calendar-wrap" style="height: 30px;" ng-style="style"> <div class="position: relative;" ng-click="onClickShow(1)">  <input type="text" class="input input-long input-left t-value" ng-value="getDateA()" ng-disabled="isShowA" placeholder="请选择日期">  <div style="position: absolute; top: 0; left: 0; bottom: 0; right: 0;z-index: 1;"></div> </div> <div ng-show="isShowA"></div></div><span class="input-group-addon">-</span><div class="calendar-wrap" style="height: 30px;" ng-style="style"> <div class="position: relative;" ng-click="onClickShow(2)">  <input type="text" class="input input-long t-value" ng-value="getDateB()" ng-disabled="isShowB" placeholder="请选择日期">  <div style="position: absolute; top: 0; left: 0; bottom: 0; right: 0;z-index: 1;"></div> </div> <div ng-show="isShowB"></div></div></div>'
    }
}]);

