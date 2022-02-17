var NotInPlanController = BaseController.extend({
    init: function (e, t, i) {
        this._super(e), 
        this._scope = e, 
        e.YouPreset = YouPreset;
        var n = i.path();
        "/" == n && (n = "/summary");
        var a = "nofound";
        n.indexOf("/") > -1 && (a = n.split("/")[1]);
        var o = window.YoudianConf.allNavigation[a];
        o ? (e.name = o.text, e.type = o.ico) : (e.name = "没有权限", e.type = "customer"), "accountedit" != a && "account" != a || (e.type = "account")
    }, 
    defineListeners: function () {
        this._super()
    }, 
    destroy: function () {}
});
NotInPlanController.$inject = ["$scope", "$rootScope", "$location"];