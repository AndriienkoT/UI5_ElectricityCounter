sap.ui.define([
  "UI5toLearn/controller/BaseController"
], function (BaseController) {
  "use strict";
  return BaseController.extend("UI5toLearn.controller.DeleteTenant", {
    onInit: function () {
      var oController = BaseController;
      this.onRetrieveData(oController);
    },

    onDeleteTenant: function (oEvent) {

      //get entered value from the input field
      var sCounter = this.getView().byId("counter").getValue();

      var allStillExistingTenants = this.getModel().getProperty('/tenants');

      // remove tenant
      for (var i = 0; i < allStillExistingTenants.length; i++) {
        if (allStillExistingTenants[i].counter === sCounter) {
          allStillExistingTenants.splice(i, 1);
          break;
        }
      }

      //delete tenant from IDB
      var oController = BaseController;
      this.onRemoveOneTenant(oController, sCounter);

      //clear the input field
      this.getView().byId("counter").setValue(null);
    },

    onNavBackWithoutSaving: function (oEvent) {

      //clear the input field
      this.getView().byId("counter").setValue(null);

      //navigate to the Main page
      this.getRouter().navTo("main");
    }
  });
});
