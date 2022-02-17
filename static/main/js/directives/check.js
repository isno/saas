(function(){
    var youCheckDirective = BaseController.extend({
        init: function (e, t, i) {
            this._scope = e, this._elm = t, this._super(e);
            var n = $('<label class="check"></label>');
            t.wrap(n), n = t.parent();
            var a = $('<span class="check-fake"></span>');
            switch (n.append(a), i.type) {
            case "radio":
                ! function () {
                    t.addClass("check-radio")
                }();
                break;
            case "checkbox":
                ! function () {
                    t.addClass("check-checkbox")
                }()
            }
        }
    });
    angular.module("directives.youCheck", []).directive("youCheck", [
        function () {
            return {
                restrict: "A",
                link: function (e, t, i) {
                    new youCheckDirective(e, t, i)
                }
            }
        }
    ]);
}());