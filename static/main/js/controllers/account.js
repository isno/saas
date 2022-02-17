var AccountController = BaseGridController.extend({
    _tag: "account",
    init: function(e, t, i, n, a, o) {
        this._super(e, t, i, n, a, o), 
        e.util = o
    },
    onInitDone: function(e) {
    }
});
AccountController.$inject = ["$scope", "$rootScope", "$Uri", "$Popup", "$timeout", "$Util"];
