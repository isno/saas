var MembershipController = BaseController.extend({
    init: function(e) {
        this._super(e),
        this._scope = e
    },
    defineListeners: function() {
        this._super()
    },
    destroy: function() {}
});
MembershipController.$inject = ["$scope", "$rootScope"];