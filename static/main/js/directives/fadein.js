(function(){
    var youFadeInDirective = BaseController.extend({
    init: function (e, t, i, n) {
        this._scope = e, 
        this._elm = t, 
        this._super(e);
        var a = "transition-opacity";
        t.css({opacity: "0"}), 
        t.addClass(a), 
        this.timeoutOpacity = n(function () {
            t.css({opacity: "1"})
        }, 0), 
        this.timeoutClass = n(function () {
            t.removeClass(a)
        }, 500), 
        this._timeout = n
    }, 
    defineListeners: function () {
        this._super()
    }, 
    destroy: function () {
        this._timeout.cancel(this.timeoutOpacity), this._timeout.cancel(this.timeoutClass)
    }
});
angular.module("directives.youFadein", []).directive("youFadein", ["$timeout",
    function (e) {
        return {
            restrict: "A",
            link: function (t, i, n) {
                new youFadeInDirective(t, i, n, e)
            }
        }
    }
]);

}());