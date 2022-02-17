(function(){
    var youMaskDirective = BaseController.extend({
        init: function(e, t, i, n) {
            this._scope = e,
            this._elm = t,
            this._super(e);
            var a = "";
            switch (i.type) {
            case "black":
                a = "mask-default"
            }
            e.type = a,
            n(function() {
                t.css({
                    opacity: 1
                }),
                t.css({
                    height: "100%"
                })
            },
            100)
        },
        defineListeners: function() {
            this._super()
        },
        destroy: function() {}
    });

    angular.module("directives.youMask", []).directive("youMask", ["$timeout",
        function(e) {
            return {
                restrict: "E",
                link: function(t, i, n) {
                    new youMaskDirective(t, i, n, e)
                },
                replace: !0,
                template: '<div class="mask {{ type }} transition-quick" style="opacity:0; height: 150%"></div>'
            }
    }]);
}());