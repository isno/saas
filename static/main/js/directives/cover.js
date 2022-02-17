var youCoverDirective = BaseController.extend({
    init: function(e, t, i) {
        this._scope = e,
        this._elm = t,
        this._super(e),
        i.coverwidth && t.css({
            width: coverwidth
        }),
        i.coverheight && t.css({
            height: coverheight
        })
    },
    defineListeners: function() {
        this._super()
    },
    destroy: function() {}
});
angular.module("directives.youCover", []).directive("youCover", [function() {
    return {
        restrict: "E",
        link: function(e, t, i) {
            new youCoverDirective(e, t, i)
        },
        replace: !0,
        template: '<div class="imgcover"></div>'
    }
}]);