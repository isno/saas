var NoPermissionController = BaseController.extend({
    init: function (e, t, i) {
        this._super(e), this._scope = e;
        var n = i.path();
        "/" == n && (n = "/summary");
        var a = "nofound";
        n.indexOf("/") > -1 && (a = n.split("/")[1]);
        var o = window.YoudianConf.allNavigation[a];
        o ? (e.name = o.text, e.type = o.ico) : (e.name = "没有权限", e.type = "customer"), e.linklist = [];
        var s = ["m_feedback"];
        _.forEach(window.YoudianConf.allNavigation, function (t, i) {
            var n = _.find(window.YoudianConf.nowRoute, {
                name: t.module
            });
            if (!_.find(s, function (e) {
                return e == t.module
            }) && n && n.controller && -1 == n.controller.indexOf("NoPermission") && -1 == n.controller.indexOf("NotOwner") && -1 == n.controller.indexOf("NotInPlan")) {
                var a = {};
                a.name = t.text, a.link = t.url, e.linklist.push(a)
            }
        })
    }, defineListeners: function () {
        this._super()
    }, destroy: function () {}
});
NoPermissionController.$inject = ["$scope", "$rootScope", "$location"];