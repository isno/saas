var NotOwnerController = BaseController.extend({
    init: function (e, t, i) {
        this._super(e), 
        this._scope = e;
        var n = i.path();
        "/" == n && (n = "/summary");
        var a = "nofound";
        n.indexOf("/") > -1 && (a = n.split("/")[1]);
        var o = window.YoudianConf.allNavigation[a];
        o ? (e.name = o.text, e.type = o.ico) : (e.name = "没有权限", e.type = "customer")
    }, 
    defineListeners: function () {
        this._super()
    }, 
    destroy: function () {}
});
NotOwnerController.$inject = ["$scope", "$rootScope", "$location"];