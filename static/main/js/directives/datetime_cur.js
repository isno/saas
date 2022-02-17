var youDatetimeCurDirective = BaseController.extend({
    _format: "YYYY/MM/DD HH:mm",
    init: function(e, t, i, n, a, o, s) {
        function r() {
            m.onChange && m.onChange(m.time),
            m.time ? -1 == m.time ? e.date = "当前时间": e.date = moment(m.time).format(p._format) : e.date = "",
            m.onChange && m.onChange(m.time)
        }
        function l() {
            a(function() {
                e.isShow = !1
            }),
            d()
        }
        function c() {
            o.on("click", l),
            u && angular.element(window).on("blur", l)
        }
        function d() {
            o.off("click", l),
            u && angular.element(window).off("blur", l)
        }
        this._scope = e,
        this._elm = t,
        this._super(e),
        this._$Time = s;
        var p = this,
        u = i.windowblur;
        e.data || (e.data = {});
        var m = e.data;
        m.time || (m.time = -1),
        e.data.getTime = function() {
            return m.time
        },
        e.$watch("data.time",
        function() {
            r()
        }),
        e.withbtn = i.withbtn,
        e.placeholder = i.placeholder || "请选择日期",
        e.btnstyle = i.btnstyle || "primary",
        e.timewidth = i.timewidth || "120px",
        e.dataCalendar = {
            type: "datetime",
            showCur: !0,
            format: p._format,
            time: m.time,
            direction: i.direction ? i.direction: "up",
            onSelected: function(t) {
                m.time = t,
                e.isShow = !1,
                d(),
                r()
            }
        },
        angular.element(t.find("div")[4]).append(n('<you-calendar data="dataCalendar"></you-calendar>')(e)),
        t.on("click", function(e) {
            angular.element(e.target).hasClass("t-value") || e.stopPropagation()
        }),
        e.onClickShow = function() {
            if (e.isShow) return void l();
            e.dataCalendar.reset(),
            e.isShow = !0,
            a(function() {
                c()
            })
        }
    }
});
angular.module("directives.youDatetimeCur", []).directive("youDatetimeCur", ["$compile", "$timeout", "$document", "$Time",
function(e, t, i, n) {
    return {
        restrict: "E",
        scope: {
            data: "="
        },
        link: function(a, o, s) {
            new youDatetimeCurDirective(a, o, s, e, t, i, n)
        },
        template: '<div class="calendar-wrap"> <div class="position: relative;" ng-click="onClickShow()" ng-hide="withbtn">  <input type="text" class="input input-long t-value" ng-value="date" ng-disabled="isShow" placeholder="{{placeholder}}">  <div style="position: absolute; top: 0; left: 0; bottom: 0; right: 0"></div> </div> <div class="datetime-wrap" ng-show="withbtn">  <you-btn type="{{btnstyle}}" text="{{placeholder}}" class="t-value" ng-click="onClickShow()" style="float: left;"></you-btn><span style="width: {{timewidth}};text-align: center;" class="datetime-output">{{date}}</span> </div> <div ng-show="isShow"></div></div>'
    }
}]);