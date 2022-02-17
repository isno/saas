var youCalendarWithLimitDirective = BaseController.extend({
    _tempMoment: null,
    _tempTime: null,
    _format: null,
    init: function(e, t, i, n) {
        this._scope = e,
        this._elm = t,
        this._super(e),
        this._$scope = e;
        var a = this;
        e.data || (e.data = {});
        var o = e.data;
        o.format || (o.format = "YYYY/MM/DD"),
        null == o.time && (o.time = n.getLite()),
        o.direction = o.direction || "down",
        o.limit = o.limit || [89, 0],
        "up" == o.direction && (e.calendarExtClass = "calendar-up"),
        o.limitBegin = moment(n.getLite()).subtract("d", o.limit[0]),
        o.limitEnd = moment(n.getLite()).add("d", o.limit[1]),
        o.reset = function() {
            a._reset()
        },
        e.weeks = ["一", "二", "三", "四", "五", "六", "日"],
        this._format = o.format,
        this.watchDataTime = e.$watch("data.time",
        function() {
            a._updateDates()
        }),
        e.monthSub = function() {
            return a._tempMoment.subtract("M", 1),
            a._tempMoment.year() < o.limitBegin.year() ? void a._tempMoment.add("M", 1) : a._tempMoment.year() == o.limitBegin.year() && a._tempMoment.month() < o.limitBegin.month() ? void a._tempMoment.add("M", 1) : void a._updateDates()
        },
        e.monthAdd = function() {
            return a._tempMoment.add("M", 1),
            a._tempMoment.year() > o.limitEnd.year() ? void a._tempMoment.subtract("M", 1) : a._tempMoment.year() == o.limitEnd.year() && a._tempMoment.month() > o.limitEnd.month() ? void a._tempMoment.subtract("M", 1) : void a._updateDates()
        },
        e.yearSub = function() {
            if (a._tempMoment.subtract("y", 1), a._tempMoment.year() < o.limitBegin.year()) return void a._tempMoment.add("y", 1);
            a._tempMoment.year() == o.limitBegin.year() && a._tempMoment.month() < o.limitBegin.month() && a._tempMoment.month(o.limitBegin.month()),
            a._updateDates()
        },
        e.yearAdd = function() {
            if (a._tempMoment.add("y", 1), a._tempMoment.year() > o.limitEnd.year()) return void a._tempMoment.subtract("y", 1);
            a._tempMoment.year() == o.limitEnd.year() && a._tempMoment.month() > o.limitEnd.month() && a._tempMoment.month(o.limitEnd.month()),
            a._updateDates()
        },
        e.dateClass = function(e, t) {
            var i = "";
            return (e + 1) % 7 == 0 && (i += " sunday"),
            t.disabled || t.selected && (i += " selected"),
            i
        },
        e.onDateSelected = function(t) {
            if (!t.disabled && !t.selected) {
                if (a._tempMoment.date(t.date), a._tempTime = a._tempMoment.toDate().getTime(), "datetime" == e.data.type) return void a._updateDates();
                var i = a._tempMoment.toDate().getTime();
                o.time = i,
                o.onSelected && o.onSelected(i)
            }
        },
        e.onSave = function() {
            a._tempMoment.hour(e.hour),
            a._tempMoment.minute(e.min),
            a._tempMoment.second(0),
            a._tempMoment.millisecond(0);
            var t = a._tempMoment.toDate().getTime();
            o.time = t,
            o.onSelected && o.onSelected(t)
        },
        e.onSaveUnlimited = function() {
            a._tempMoment = moment( - 1);
            var e = a._tempMoment.toDate().getTime();
            o.time = e,
            o.onSelected && o.onSelected(e)
        },
        e.onSaveCur = function() {
            e.onSaveUnlimited()
        },
        o.cleanUp = e.onClickCleanup = function() {
            a._tempMoment = moment(0);
            var e = a._tempMoment.toDate().getTime();
            o.time = e,
            o.onSelected && o.onSelected(e)
        },
        this._reset(),
        "date" == e.data.type ? e.showCleanup = e.data.showCleanup: "datetime" == e.data.type && (e.hasTime = !0, e.showUnlimited = e.data.showUnlimited, e.showCur = e.data.showCur, e.showCleanup = e.data.showCleanup)
    },
    _reset: function() {
        var e = this._$scope;
        this._tempTime = e.data.time,
        this._tempMoment = moment(e.data.time),
        (this._tempMoment.year() >= 3e3 || this._tempMoment.year() < 2e3) && (this._tempMoment = moment()),
        this._updateDates(),
        "datetime" == e.data.type && (e.hour = this._tempMoment.hour(), parseInt(e.hour) < 10 && (e.hour = "0" + e.hour), e.min = this._tempMoment.minute(), parseInt(e.min) < 10 && (e.min = "0" + e.min), this._initTime())
    },
    _updateDates: function() {
        var e = this,
        t = [],
        i = this._scope,
        n = moment(e._tempTime).format("YYYY/MM/DD"),
        a = moment(moment().format("YYYY/MM/DD"));
        for (a.year(this._tempMoment.year()), a.month(this._tempMoment.month()), a.date(1);;) if (a.format("YYYY/MM/DD") == n ? t.push({
            date: a.date(),
            selected: !0
        }) : a.isBefore(i.data.limitBegin) ? t.push({
            date: a.date(),
            disabled: !0
        }) : a.isAfter(i.data.limitEnd) ? t.push({
            date: a.date(),
            disabled: !0
        }) : t.push({
            date: a.date()
        }), a.add("d", 1), 1 == a.date()) break;
        for (a.subtract("M", 1), a.date(1);;) {
            if (a.subtract("d", 1), 0 === a.day()) break;
            t.unshift({
                date: a.date(),
                disabled: !0
            })
        }
        a.add("M", 2),
        a.date(1);
        for (var o = t.length; o < 42; o++) t.push({
            date: a.date(),
            disabled: !0
        }),
        a.add("d", 1);
        i.dates = t,
        i.title = e._tempMoment.format("YYYY 年 MM 月")
    },
    _initTime: function() {
        var e = this._$scope;
        e.hour || (e.hour = "00"),
        e.min || (e.min = "00"),
        e.hourSub = function() {
            var t = parseInt(e.hour);
            t--,
            t < 0 && (t = 23),
            t < 10 && (t = "0" + t),
            e.hour = t
        },
        e.hourAdd = function() {
            var t = parseInt(e.hour);
            t++,
            t > 23 && (t = 0),
            t < 10 && (t = "0" + t),
            e.hour = t
        },
        e.minSub = function() {
            var t = parseInt(e.min);
            t--,
            t < 0 && (t = 59),
            t < 10 && (t = "0" + t),
            e.min = t
        },
        e.minAdd = function() {
            var t = parseInt(e.min);
            t++,
            t > 59 && (t = 0),
            t < 10 && (t = "0" + t),
            e.min = t
        }
    },
    defineListeners: function() {
        this._super()
    },
    destroy: function() {
        this.watchDataTime()
    }
});
angular.module("directives.youCalendarWithLimit", []).directive("youCalendarWithLimit", ["$Time",
function(e) {
    return {
        restrict: "E",
        scope: {
            data: "="
        },
        link: function(t, i, n) {
            new youCalendarWithLimitDirective(t, i, n, e)
        },
        template: "<div class=\"calendar {{ calendarExtClass }} {{ showUnlimited ? 'calendar-widthUnlimit' : '' }} {{ showCur ? 'calendar-widthCur' : '' }}\">" + '<span class="ico ico-box-arrow"></span><span class="ico ico-box-arrow-down"></span><div class="calendar-switch"><button class="btn-none t-year" ng-click="yearSub()"><i class="ico ico-arrow-bb-left"></i></button><button class="btn-none t-month" ng-click="monthSub()"><i class="ico ico-arrow-b-left"></i></button><div class="t-title">{{title}}</div><button class="btn-none t-month" ng-click="monthAdd()"><i class="ico ico-arrow-b-right"></i></button><button class="btn-none t-year" ng-click="yearAdd()"><i class="ico ico-arrow-bb-right"></i></button></div><div class="calendar-weeks"><span class="t-item" ng-repeat="item in weeks">{{item}}</span></div><div class="calendar-dates"><span class="t-item" ng-repeat="item in dates" ng-disabled="item.disabled" ng-class="dateClass($index, item)" ng-click="onDateSelected(item)">{{item.date}}</span></div><div class="calendar-time" ng-show="hasTime"><input type="text" class="input input-time" ng-model="hour"><span class="t-sep">:</span><input type="text" class="input input-time" ng-model="min"><you-btn type="primary" text="确定" ng-click="onSave()"></you-btn><button class="btn-none t-hour-sub" ng-click="hourSub()"><i class="ico ico-arrow-b-up"></i></button><button class="btn-none t-hour-add" ng-click="hourAdd()"><i class="ico ico-arrow-b-down"></i></button><button class="btn-none t-min-sub" ng-click="minSub()"><i class="ico ico-arrow-b-up"></i></button><button class="btn-none t-min-add" ng-click="minAdd()"><i class="ico ico-arrow-b-down"></i></button></div><div class="calendar-unlimited" ng-show="showUnlimited"><button class="btn-none" ng-click="onSaveUnlimited()">设为永久</button></div><div class="calendar-unlimited" ng-show="showCur"><button class="btn-none" ng-click="onSaveCur()">设为当前时间</button></div><div class="calendar-cleanup" ng-show="showCleanup"><button class="btn-none" ng-click="onClickCleanup()">清空</button></div></div>'
    }
}]);