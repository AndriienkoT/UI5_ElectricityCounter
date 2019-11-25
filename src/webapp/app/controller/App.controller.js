sap.ui.define([
  "UI5toLearn/controller/BaseController"
], function (BaseController) {
  "use strict";
  return BaseController.extend("UI5toLearn.controller.App", {

    onInit: function (oController) {
      jQuery.sap.log.setLevel(jQuery.sap.log.Level.INFO);
      var oRouter = this.getRouter();

      oRouter.attachBypassed(function (oEvent) {
        var sHash = oEvent.getParameter("hash");
        jQuery.sap.log.info("Sorry, but the hash '" + sHash + "' is invalid.", "The resource was not found.");
      });
      oRouter.attachRouteMatched(function (oEvent){
        var sRouteName = oEvent.getParameter("name");
        jQuery.sap.log.info("User accessed route " + sRouteName + ", timestamp = " + new Date().getTime());
      });

      // var createDBRequest = window.indexedDB.open("MyDB", 1);
      // createDBRequest.onupgradeneeded = function(event){
      //   var db = event.target.result;
      //   var objectStore = db.createObjectStore("tenants");
      // };
      // createDBRequest.onsuccess = function(event){
      //   oController.myDB = event.target.result;
      // };
      // createDBRequest.onerror = function(oError) {
      //   console.log("Something went wrong!");
      // };
    },

    goToCreateTenant: function (oEvent) {
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
