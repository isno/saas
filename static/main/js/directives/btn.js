var youBtnDirective = BaseController.extend({
    init: function (e, t, i) {
        this._scope = e, 
        this._elm = t, 
        this._super(e), 
        e.hasIcon = !1, 
        e.type = i.type, 
        e.type || (e.type = "default");
        
        var n = function () {
            switch (e.type) {
            case "search":
                e.type = "primary", 
                e.hasIcon = !0, 
                e.ico = "search", 
                e.textAfterIcon = "查 找";
                break;
            case "switch":
                e.type = "primary", 
                e.hasIcon = !0, 
                e.ico = "switch", 
                e.textAfterIcon = "测试新版本";
                break;
            case "refresh":
                e.type = "default", 
                e.hasIcon = !0, 
                e.ico = "refresh";
                break;
            case "refreshing":
                e.type = "default disabled", 
                e.hasIcon = !0, 
                e.ico = "refreshing";
                break;
            case "light-refresh":
                e.type = "light-ico", 
                e.hasIcon = !0, 
                e.ico = "refresh-light";
                break;
            case "light-refreshing":
                e.type = "light-ico disabled", 
                e.hasIcon = !0, 
                e.ico = "refreshing-light";
                break;
            case "simple-refresh":
                e.type = "simple", 
                e.hasIcon = !0, 
                e.ico = "refresh";
                break;
            case "simple-refreshing":
                e.type = "simple disabled", 
                e.hasIcon = !0, 
                e.ico = "refreshing-light";
                break;
            case "loading":
                e.type = "default disabled",
                 e.hasIcon = !0, 
                 e.ico = "loading";
                break;
            case "loading-smspreview":
                e.type = "default disabled", 
                e.hasIcon = !0, 
                e.ico = "loading", 
                e.addclass = "btn-loading-smspreview";
                break;
            case "simple-loading":
                e.type = "simple disabled", 
                e.hasIcon = !0, 
                e.ico = "loading";
                break;
            case "simple-expand":
                e.type = "simple", 
                e.hasIcon = !0, 
                e.ico = "expandCross";
                break;
            case "simple-shrink":
                e.type = "simple", 
                e.hasIcon = !0, 
                e.ico = "shrinkCross";
                break;
            case "delete":
            case "light-delete":
                e.type = "light-ico", 
                e.hasIcon = !0, 
                e.ico = "delete";
                break;
            case "simple-delete":
                e.type = "simple", 
                e.hasIcon = !0, 
                e.ico = "delete";
                break;
            case "simple-edit":
                e.type = "simple", 
                e.hasIcon = !0, 
                e.ico = "edit";
                break;
            case "simple-qrcode":
                e.type = "simple", 
                e.hasIcon = !0, 
                e.ico = "qrcode";
                break;

            case "simple-preview":
                e.type = "simple", 
                e.hasIcon = !0, 
                e.ico = "preview";
                break;
            case "dark-delete":
                e.type = "default", 
                e.hasIcon = !0, 
                e.ico = "delete";
                break;
            case "down":
                e.type = "default", 
                e.hasIcon = !0, 
                e.ico = "arrow-b-down", 
                e.addclass = "tag-darr";
                break;
          
            case "product":
                e.type = "primary", 
                e.hasPrevIcon = !0, 
                e.ico = "product", 
                e.addclass = "btn-valign", 
                e.icoclass = "inverse";
                break;
          
            case "simple-manager":
                e.type = "simple", 
                e.hasIcon = !0, 
                e.ico = "tagmanager";
                break;
            case "drop-menu":
                e.type = "primary", e.hasIcon = !0, e.ico = "menu-uarr";
                break;
            case "drop":
                e.hasIcon = !0, e.ico = "menu-uarr";
                break;
            case "drop-inverse":
                e.hasIcon = !0, e.ico = "menu-uarr-inverse";
                break;
            case "simple-copy":
                e.type = "simple", 
                e.hasIcon = !0, 
                e.ico = "copy";
                break;
            case "appentry":
                e.type = "default", 
                e.hasIcon = !0, 
                e.ico = "appentry", 
                e.addclass = "btn-appentry";
                break;
            case "phone":
                e.type = "default", 
                e.hasIcon = !0, 
                e.ico = "phone", 
                e.addclass = "btn-phone";
                break;
            case "hidden":
                e.type = "hidden", 
                e.hasIcon = !1;
                break;
            case "big-primary":
                e.type = "primary", 
                e.addclass = "btn-big";
                break;
            case "upgrade-primary":
                e.type = "primary", 
                e.hasIcon = !0, 
                e.ico = "upgrade", 
                e.addclass = "btn-withupgrade";
                break;
            case "upgrade-default":
                e.type = "default", 
                e.hasIcon = !0, 
                e.ico = "upgrade", 
                e.addclass = "btn-withupgrade";
                break;
            case "upgrade-danger":
                e.type = "danger",
                e.hasIcon = !0, 
                e.ico = "upgrade", 
                e.addclass = "btn-withupgrade";
                break;
            case "white":
                e.type = "white", 
                e.hasPrevIcon = !0, 
                e.ico = "themehome", 
                e.addclass = "btn-themehome";
                break;
            case "new":
                e.type = "default", 
                e.hasIcon = !0, 
                e.ico = "new";
            }
        };
        n(), 
        e.text = i.text, 
        this.observeText = i.$observe("text", function (t) {
            t && (e.text = t)
        }), 
        this.observeType = i.$observe("type", function (t) {
            t && (e.type = t, n())
        })
    }, 
    defineListeners: function () {
        this._super()
    }, 
    destroy: function () {
        this.observeText(), 
        this.observeType()
    }
});
angular.module("directives.youBtn", []).directive("youBtn", [
    function () {
        return {
            restrict: "E",
            scope: !0,
            link: function (e, t, i) {
                new youBtnDirective(e, t, i)
            }, 
            template: '<button class="btn btn-{{type}} {{ addclass }}"><span class="ico ico-{{ico}} {{ icoclass }}" ng-if="hasPrevIcon"></span>{{text}}<span class="ico ico-{{ico}}" ng-if="hasIcon"></span>{{textAfterIcon}}</button>',
            replace: !0
        }
    }
]);