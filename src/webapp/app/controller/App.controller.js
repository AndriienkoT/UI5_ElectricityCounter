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
      await new Promise(function(resolve){setTimeout(resolve, 200)});
      this.onBackupDataIfNeeded(oController);
    },

    onBackupDataIfNeeded: async function (oController) {
      var sDayOfLastDataStoring;
      var nDataStoringMonth;

      var objectStore = oController.myDB.transaction("DBcopies").objectStore("DBcopies");
      var objectStoreRequest = objectStore.get(0);
      objectStoreRequest.onsuccess = function(event) {
        sDayOfLastDataStoring = objectStoreRequest.result;
      };
      await new Promise(function(resolve){setTimeout(resolve, 100)});

      if(sDayOfLastDataStoring != undefined) {
        nDataStoringMonth = parseInt(sDayOfLastDataStoring.split(".")[1]);
      }
      var nCurrentDay = new Date().getDate();
      if(nCurrentDay >= 10) {
        if(sDayOfLastDataStoring == undefined || (nCurrentMonth == nDataStoringMonth + 1) || (nDataStoringMonth == 12 && nCurrentMonth == 1)) {
          var nCurrentMonth = new Date().getMonth() + 1;
          var nCurrentYear = new Date().getYear() - 100 + 2000;
          var sDate = nCurrentDay + "." + nCurrentMonth + "." + nCurrentYear;
          this.exportToJson(oController, sDate);
        }
      }
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
    },

    goToImportDB: function (oEvent) {
      this.getRouter().navTo("importDB");
    }
  });
});
