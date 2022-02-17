var Page404Controller = BaseController.extend({
    init: function(e) {
        this._super(e),
        this._scope = e
    },
    defineListeners: function() {
        this._super()
    },
    destroy: function() {}
});
Page404Controller.$inject = ["$scope", "$rootScope"];