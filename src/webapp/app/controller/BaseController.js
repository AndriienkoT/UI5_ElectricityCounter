sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/routing/History",
  'sap/ui/model/Sorter'
], function (Controller, History, Sorter) {
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

    onUpdateData: function (oEvent) {
      //update data in the Model
      if (this.getStorage().get("myLocalData")) {
        var oDataFromStorage = this.getStorage().get("myLocalData");
        var oModel = new sap.ui.model.json.JSONModel(this.getModel());
        oModel.setData(oDataFromStorage);
        this.getView().setModel(oModel);
        this.getOwnerComponent().setModel(oModel, "Model");
      }
    },

    onSortData: function (oTable) {
      var oBinding = oTable.getBinding("items");
      var oSorter = new Sorter("housing", null);
      oSorter.fnCompare = function naturalSorter(as, bs){
        var a, b, a1, b1, i = 0, n, L, rx = /(\.\d+)|(\d+(\.\d+)?)|([^\d.]+)|(\.\D+)|(\.$)/g;
        if (as === bs) { return 0; }
        a = as.toLowerCase().match(rx);
        b = bs.toLowerCase().match(rx);
        L = a.length;
        while(i < L){
          if(!b[i]) { return 1; }
          a1 = a[i];
          b1 = b[i++];
          if(a1 !== b1){
            n = a1 - b1;
            if(!isNaN(n)) { return n; }
            return a1 > b1 ? 1 : -1;
          }
        }
        return b[i] ? -1 : 0;
      }
      if (oBinding) { oBinding.sort(oSorter); }
    }
  });
});
