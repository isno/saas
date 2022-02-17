var youCheckbtnDirective = BaseController.extend({
    init: function(e, t, i) {
        this._scope = e,
        this._elm = t,
        this._super(e),
        e.data || (e.data = {});
        var n = e.data,
        a = angular.copy(e.data);
        if (n.isMulti && n.hasCheckAll ? n.selected || (n.selected = [0]) : (!n.isMulti && n.hasCheckAll, n.selected || (n.selected = 0)), angular.isFunction(n.list)) { (0, n.list)(function(e) {
                n.list = e
            }),
            delete n.list
        }
        if (n.list = n.list || [], n.reset = function() {
            n.isMulti ? n.selected = [0] : n.selected = 0
        },
        n.restore = function(e) {
            if (void 0 !== e && null !== e && "" !== e) if (n.isMulti) {
                e = String(e).split(",");
                var t = [];
                _.forEach(n.list,
                function(i, a) {
                    _.contains(e, String(i.value)) && (n.hasCheckAll ? t.push(a + 1) : t.push(a))
                }),
                n.selected = t
            } else n.selected = _.findIndex(n.list,
            function(t) {
                return t.value == e
            }),
            n.hasCheckAll && n.selected++
        },
        this.watchDataList = e.$watch("data.list",
        function() {
            n.hasCheckAll ? e.list = [{
                value: "",
                text: "全部"
            }].concat(n.list) : e.list = n.list
        }), e.onClick = function(t, i) {
            if (n.isMulti) { - 1 != _.findIndex(n.selected,
                function(e) {
                    return e == i
                }) ? _.remove(n.selected,
                function(e) {
                    return e == i
                }) : n.selected.push(i),
                n.hasCheckAll && (0 !== i ? (_.remove(n.selected,
                function(e) {
                    return 0 === e
                }), n.selected.length != e.list.length - 1 && 0 !== n.selected.length || (n.selected = [0])) : n.selected = [0]);
                var a = [];
                _.forEach(n.selected,
                function(t) {
                    a.push(e.list[t].value)
                }),
                n.onSelected && n.onSelected(a.toString(), n.selected)
            } else n.selected = i,
            n.onSelected && n.onSelected(t.value, n.selected)
        },
        e.getClass = function(e) {
            if (n.isMulti) {
                if ( - 1 != _.findIndex(n.selected,
                function(t) {
                    return t == e
                })) return "checked"
            } else if (n.selected == e) return "checked"
        },
        e.setFolder) {
            var o = 0,
            s = 0,
            r = i(function() {
                if (s += 50, "list" in a) if (++o < 99) {
                    var n = t.children()[0],
                    l = n.scrollHeight;
                    e.setFolder = !(l <= 35)
                } else i.cancel(r);
                else s > 6e4 && i.cancel(r)
            },
            50);
            e.foldSwitcher = function() {
                e.isFold = !e.isFold,
                n.onFoldSwitch && n.onFoldSwitch(e.isFold)
            }
        }
    },
    defineListeners: function() {
        this._super()
    },
    destroy: function() {
        this.watchDataList()
    }
});
angular.module("directives.youCheckBtn", []).directive("youCheckBtn", ["$interval",
function(e) {
    return {
        restrict: "E",
        scope: {
            data: "=",
            setFolder: "@",
            isFold: "@setFolder"
        },
        link: function(t, i) {
            new youCheckbtnDirective(t, i, e)
        },
        template: '<div class="check-btn-group" ng-class="{\'check-btn-group-fold\':isFold}"> <span class="check-btn" ng-repeat="item in list" ng-class="getClass($index)" ng-click="onClick(item, $index)" >{{item.text}}</span></div><div class="check-btn-group-folder main-item-sublink" ng-if="setFolder"> <a href="javascript:;" ng-click="foldSwitcher()"> {{ isFold ? "展开更多" : "收起更多" }}<i class="ico ico-expand-arrow" ng-show="isFold"></i><i class="ico ico-expand-arrow-down" ng-hide="isFold"></i> </a></div>'
    }
}]);