sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/routing/History"
], function (Controller, History) {
  "use strict";
  return Controller.extend("UI5toLearn.controller.BaseController", {
    getRouter : function (oEvent) {
      return sap.ui.core.UIComponent.getRouterFor(this);
    },

    onNavBack: function (oEvent) {
      var oHistory, sPreviousHash;
      oHistory = History.getInstance();
      sPreviousHash = oHistory.getPreviousHash();
      if (sPreviousHash !== undefined) {
        window.history.go(-1);
      } else {
        this.getRouter().navTo("main", {}, true /*no history*/);
      }
    },

    getModel: function (oEvent) {
      var oModel = this.getOwnerComponent().getModel("Model");
      return oModel;
    },

    getStorage: function (oEvent) {
      jQuery.sap.require("jquery.sap.storage");
      return jQuery.sap.storage(jQuery.sap.storage.Type.local);
    },

    getEventBus: function (oEvent) {
      return sap.ui.getCore().getEventBus();
    }
  });
});
