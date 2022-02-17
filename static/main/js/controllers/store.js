var StoreController = BaseGridController.extend({
    _tag: "store",
    init: function(e, t, i, n, a, o) {
        this._super(e, t, i, n, a, o), 
        this._scope = e
    },
    defineListeners: function() {
        this._super()
    },
    destroy: function() {}
});
StoreController.$inject = ["$scope", "$rootScope", "$Uri", "$Popup", "$timeout", "$Util"];