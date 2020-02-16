sap.ui.define([
  "UI5toLearn/controller/BaseController.controller"
], function (BaseController) {
  "use strict";

  return BaseController.extend("UI5toLearn.controller.App", {

    onInit: async function () {

      // jQuery.sap.log.setLevel(jQuery.sap.log.Level.INFO);
      // var oRouter = this.getRouter();
      //
      // oRouter.attachBypassed(function (oEvent) {
      //   var sHash = oEvent.getParameter("hash");
      //   jQuery.sap.log.info("Sorry, but the hash '" + sHash + "' is invalid.", "The resource was not found.");
      // });
      // oRouter.attachRouteMatched(function (oEvent) {
      //   var sRouteName = oEvent.getParameter("name");
      //   jQuery.sap.log.info("User accessed route " + sRouteName + ", timestamp = " + new Date().getTime());
      // });

      var oController = BaseController;
      this.onPrepareIDB(oController);
    },

    goToCreateTenant: function (oEvent) {
      // var oController = BaseController;
      // this.onRemoveAllData(oController);
      this.getRouter().navTo("createTenant");
    },

    goToEditTenant: function (oEvent) {
      this.getRouter().navTo("editTenant");
    },

    goToDeleteTenant: function (oEvent) {
      this.getRouter().navTo("deleteTenant");
    },

    goToEnterCounterNumber: function (oEvent) {
      this.getRouter().navTo("enterCounterNumber");
    },

    goToCreatePDF: function (oEvent) {
      this.getRouter().navTo("createPDF");
    },

    goToFundedSheet: function (oEvent) {
      this.getRouter().navTo("fundedSheet");
    }
  });
});
