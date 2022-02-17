/** app init */
(function(){
    'use strict';
    var e = "/";
    window.Youdian = angular.module('Youdian',[
        'ui.router',
        'ngSanitize', 
        'ui.router.stateHelper',
        'Youdian.directives',
        'Youdian.services',
        "ui.tinymce"
        ]).run([
        "$rootScope","$Util",function(e, t){
            e.YoudianConf = window.YoudianConf;
            e.getShopName = function () {
                return t.htmlEnDeCode.htmlDecode(window.YoudianConf.shopName)
            }

        }]);
    window.Youdian.config(["$controllerProvider", function(e) {
        e.allowGlobals()
    }]).constant("defaultUrl", e);
}());



(function () {
    window.Youdian.config(["$compileProvider",
        function (e) {
            e.aHrefSanitizationWhitelist(/^\s*(http(s)?:|data:image|javascript:void\(0\))/)
        }
    ])
}());


(function(){
    window.Youdian.config(["$provide",
    function(e) {
        e.decorator("$rootScope", ["$delegate",
        function(e) {
            return Object.defineProperty(e.constructor.prototype, "$onRootScope", {
                value: function(t, i) {
                    var n = e.$on(t, i);
                    return this.$on("$destroy", n),n
                },
                enumerable: !1
            }),
            e
        }])
    }])

}());


(function(){
    'use strict';
    var dependency = [
        'directives.youNavigation',
        'directives.youNavigationlink',
        'directives.youIco',
        'directives.youDropdown',
        'directives.youMainbody',
        'directives.youAppentry',
        'directives.youFadein',
        'directives.youBtn',
        'directives.youBtminfo',
        'directives.youMask',
        'directives.youPopwindow',
        'directives.youCheck',
        'directives.youChkexpand',
        'directives.youValidation',
        'directives.youHelp',
        'directives.youGrid',
        'directives.youAreaselector',
        'directives.youHint3',
        'directives.youHint2',
        'directives.youPopVendor',
        'directives.youCheckBtn',
        'directives.youCalendarWithLimit',
        'directives.youCalendar',
        'directives.youDate',
        'directives.youTagselector',
        'directives.youMainfollow',
        'directives.youCover',
        'directives.youDatetimeCur',
        'directives.youPopProduct',
        'directives.youDatetime',
        'directives.youPopCustomer',
        'directives.youPagination',
        "directives.youNavigationLinkNotification"

    ];
    angular.module('Youdian.directives', dependency) 
}());


(function(){
    'use strict';
    var dependency = [
        'services.$Uri',
        'services.$Popup',
        'services.$Util',
        'services.$Time',
        'services.$Order'
    ];
    angular.module('Youdian.services', dependency) 
}());

/** ui router */
(function() {
   window.Youdian.config(["stateHelperProvider","$urlRouterProvider", "defaultUrl", function($statehelper, $urlRouterProvider,i){
        var a = function(e) {
                var uri = URI("/static/main/html/").filename(e)
                uri.addQuery("_v",window.YoudianConf.version)
                return uri.toString()
            },
            o = function(e) {
                angular.isObject(e) && _.forEach(e, function(value, key) {
                    "templateUrl" === key && angular.isString(value) ? e[key] = a(value) : o(value)
                })
            };
        _.forEach(window.YoudianConf.nowRoute,function(route) {
            o(route),
            $statehelper.state(route);

            $urlRouterProvider.rule(function(e, t) {
                var i = t.path();
                if ("/" === i[i.length - 1]) return i.slice(0, -1)
            }).
            when("", i).otherwise("/404"),
                window.setTimeout(function () {
                if (!window.YoudianInitDone)
                    if (window.YoudianInitDone = !0, window.$) $(".main").css({
                        opacity: "1"
                    });
                    else try {
                        document.querySelector(".main").style.opacity = "1"
                    } catch (e) {
                        console.log("init main opacity 1 err")
                    }
            }, 1e3);

        });

   }]);
}());

var BaseController = Class.extend({
    $scope: null,
    init: function(e) {
        this.$scope = e,
        this.defineListeners(),
        this.defineScope(),
        e.YouText = YouText,
        e.YouPreset = YouPreset;
        e.YouLevel = YouLevel;

    },
    defineListeners: function() {
        this.$scope.$on("$destroy", this.destroy.bind(this))
    },
    defineScope: function() {},
    destroy: function() {}
});
BaseController.$inject = ["$scope"];

var youPaginationDirective = BaseController.extend({
    init: function (e, t, i, n) {
        function a() {
            s.onSwitch && s.onSwitch(s.current)
        }

        function o() {
            s.count = s.count - 0, e.hasSelect && (e.list = new Array(s.count).fill(0).map(function (e, t) {
                return {
                    value: t + 1,
                    text: t + 1 + "/" + s.count
                }
            }), e.currentSelect = s.current)
        }
        this._super(e), e.data || (e.data = {});
        var s = e.data;
        switch (s.current || (s.current = 1), s.count || (s.count = 1), s.lock = !1, this.watchDataCount = e.$watch("data.count", function (e) {
            s.count = Number(s.count), o()
        }), this.watchDataCurrent = e.$watch("data.current", function () {
            s.current = Number(s.current), o()
        }), this.watchDataCurrent = e.$watch("data.lock", function () {
            o()
        }), e.hasSelect = !0, i.type) {
        case "simple":
            e.hasSelect = !1
        }
        o(), 
        e.onClickPrev = function () {
            s.current--, o(), a()
        }, 
        e.onClickNext = function () {
            s.current++, o(), a()
        }, 
        e.onSelectChange = function () {
            s.current !== e.currentSelect && (s.current = e.currentSelect, o(), a())
        }
    }, defineListeners: function () {
        this._super()
    }, destroy: function () {
        this.watchDataCount(), this.watchDataCurrent()
    }
});

angular.module("directives.youPagination", []).directive("youPagination", ["$timeout",
    function (e) {
        var uri = URI("/static/main/html/").filename("pagination.htm"),
            uri = uri.addQuery("_v",window.YoudianConf.version).toString()

        return {
            restrict: "E",
            scope: {
                data: "="
            },
            link: function (t, i, n) {
                new youPaginationDirective(t, i, n, e)
            }, 
            templateUrl:uri
        }
    }
]);
