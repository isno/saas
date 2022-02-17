var ShipmentController = BaseGridController.extend({
    _tag: "shipment",
    init: function (e, t, i, n, a, o) {
        YouPreset.init("shipment"), this._super(e, t, i, n, a, o)
    }, 
    getPreset: function () {
        return YouPreset.SHIPMENT_TEMPLATE_CALCULATE
    }
});
ShipmentController.$inject = ["$scope", "$rootScope", "$Uri", "$Popup", "$timeout", "$Util"];