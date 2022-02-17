var youIcoDirective = BaseController.extend({
    init: function(e, t, i) {
        this._scope = e,
        this._elm = t,
        this._super(e),
        e.ext = i.ext,
        e.type = i.type
    },
    defineListeners: function() {
        this._super()
    },
    destroy: function() {}
});
angular.module("directives.youIco", []).directive("youIco", [function() {
    return {
        restrict: "E",
        scope: !0,
        link: function(e, t, i) {
            new youIcoDirective(e, t, i)
        },
        replace: !0,
        template: '<i class="iconfont icon-{{type}} {{ext}}"></i>'
    }
}]);