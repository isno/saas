var StatController = BaseController.extend({
    init: function(e, t, i, n) {
        this._super(e),
        this._scope = e;
        n.loading(!0);
        i.get("stat", !1, function (t) {
            e.data = t.data;
            e.shop = t.data.shop;
            
            n.loading(!1), 
            e.showSetting = {opacity: "1"}
        });
      
    },
    defineListeners: function() {
        this._super()
    },
    destroy: function() {}
});
StatController.$inject = ["$scope", "$rootScope", "$Uri", "$Popup"];