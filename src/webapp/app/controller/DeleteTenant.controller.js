sap.ui.define([
  "UI5toLearn/controller/BaseController",
  'sap/m/MessageToast'
], function (BaseController, MessageToast) {
  "use strict";
  return BaseController.extend("UI5toLearn.controller.DeleteTenant", {
    onInit: function () {
      var oController = BaseController;
      this.onRetrieveData(oController);
    },

    onDeleteTenant: function (oEvent) {
      var bundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

      //get entered value from the input field
      var sCounter = this.getView().byId("counter").getValue();
      if (sCounter == "") {
        var sMessageEnterCounter = bundle.getText("deleteTenantPageMessageEnterCounter");
        MessageToast.show(sMessageEnterCounter);
      } else {
        var allStillExistingTenants = this.getModel().getProperty('/tenants');

        // remove tenant
        var nIndex = allStillExistingTenants.findIndex(tenant => tenant.counter === sCounter);
        if (nIndex == -1) {
          var sMessageCounterDoesntExist = bundle.getText("deleteTenantPageMessageCounterDoesntExist");
          MessageToast.show(sMessageCounterDoesntExist);
        } else {
          allStillExistingTenants.splice(nIndex, 1);

          //delete tenant from IDB
          var oController = BaseController;
          this.onRemoveOneTenant(oController, sCounter);

          var sMessageWasRemoved = bundle.getText("deleteTenantPageMessageWasRemoved");
          MessageToast.show(sMessageWasRemoved);
        }

        //clear the input field
        this.getView().byId("counter").setValue(null);
      }
    },

    onNavBackWithoutSaving: function (oEvent) {

      //clear the input field
      this.getView().byId("counter").setValue(null);

      //navigate to the Main page
      this.getRouter().navTo("main");
    }
  });
});
