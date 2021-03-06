angular.module("ui.router.stateHelper", ["ui.router"]).provider("stateHelper", ["$stateProvider",
function(e) {
    function t(e) {
        e.parent && (e.name = (angular.isObject(e.parent) ? e.parent.name: e.parent) + "." + e.name)
    }
    function a(e) {
        e.children.forEach(function(e, t, a) {
            a[t + 1] && (e.nextSibling = a[t + 1].name),
            a[t - 1] && (e.previousSibling = a[t - 1].name)
        })
    }
    var n = this;
    this.state = function(r) {
        var i = Array.prototype.slice.apply(arguments),
        l = {
            keepOriginalNames: !1,
            siblingTraversal: !1
        };
        return "boolean" == typeof i[1] ? l.keepOriginalNames = i[1] : "object" == typeof i[1] && angular.extend(l, i[1]),
        l.keepOriginalNames || t(r),
        e.state(r),
        r.children && r.children.length && (r.children.forEach(function(e) {
            e.parent = r,
            n.state(e, l)
        }), l.siblingTraversal && a(r)),
        n
    },
    this.setNestedState = this.state,
    n.$get = angular.noop
}]);