(function(){
    var youBtmInfoDirective = BaseController.extend({
        init: function (e, t, i, n) {
            if (this._scope = e, this._elm = t, this._super(e), e.data.type) {
                var a = "";
                switch (e.data.type) {
                    case "danger":
                    a = "info-danger"
                }
                e.type = a
            }
            e.text = e.data.text, 
            t.css({opacity: "0"}), 
            t.css({bottom: "-100px"}), 
            n(function () {
                t && (t.css({opacity: "1"}), 
                t.css({bottom: "0"}), 
                n(function () {
                    t && (t.css({opacity: "0"}), t.css({bottom: "-100px"}))
                }, 1400))
            }, 100)
        }, 
        defineListeners: function () {
            this._super()
        }, 
        destroy: function () {}
    });
    angular.module("directives.youBtminfo", []).directive("youBtminfo", ["$timeout",
        function (e) {
            return {
                scope: {
                    data: "="
                },
                restrict: "E",
                link: function (t, i, n) {
                    new youBtmInfoDirective(t, i, n, e)
                }, replace: !0,
                template: '<div class="info transition-btminfo {{ type }}"><div class="info-inner"><div>{{ text }}</div></div></div>'
            }
        }
    ]);
}());