sap.ui.define([
  "UI5toLearn/controller/BaseController.controller",
  'sap/m/MessageToast'
], function (BaseController, MessageToast) {
  "use strict";
  return BaseController.extend("UI5toLearn.controller.CreateTenant", {
    onInit: function () {
      var oController = BaseController;
      this.onRetrieveData(oController);

      this.getView().byId("coefficientInput").setValue("1");
    },

    onCreateTenant: function (oEvent) {
      var bundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

      //get entered data from the input fields
      var sRoom = this.getView().byId("roomInput").getValue();
      var sName = this.getView().byId("nameInput").getValue();
      var sCounter = this.getView().byId("counterInput").getValue();
      var sCoefficient = this.getView().byId("coefficientInput").getValue();

      //check whether tenant with current counter already exists
      var allExistingTenants = null;
      if (this.getModel() != undefined) {
        allExistingTenants = this.getModel().getProperty('/tenants');
      }
      var nIndex;
      if (allExistingTenants != null && allExistingTenants.length > 0) {
          nIndex = allExistingTenants.findIndex(tenant => tenant.counter === sCounter);
      }
      if (nIndex != -1 && nIndex != undefined) {
        var sMessage1 = bundle.getText("createTenantPageMessageCounterExists");
        MessageToast.show(sMessage1);
      } else if (sRoom == "" || sName == "" || sCounter == "" || sCoefficient == "") {
        var sMessage2 = bundle.getText("createTenantPageMessageFields");
        MessageToast.show(sMessage2);
      } else {

        //create oData
        var oData = {
          "room" : sRoom,
          "name" : sName,
          "counter" : sCounter,
          "coefficient" : sCoefficient,
          "counterNumbers": {
            "2019": {
              "0": {
                "counterNumber": "0"
              }
            },
            "2020": {},
            "2021": {},
            "2022": {},
            "2023": {}
          },
          "differences": {
            "2019": {
              "0": {
                "difference": "0"
              }
            },
            "2020": {},
            "2021": {},
            "2022": {},
            "2023": {}
          }
        };

        //set oData to the Model
        var oDataFromModel = {
          "tenants": []
        };
        if (this.getModel() != undefined) {
          oDataFromModel = this.getModel().getData();
        }
        oDataFromModel.tenants.push(oData);
        this.getModel().refresh(true);

        //set oData to the IDB
        var oController = BaseController;
        this.onWriteOneTenantToIDB(oController, oData);

        var sMessageWasAdded = bundle.getText("createTenantPageMessageWasAdded");
        MessageToast.show(sMessageWasAdded);

        //clear input fields
        this.onClearFields();
      }
    },

    onNavBackWithoutSaving: function (oEvent) {
      //clear input fields
      this.onClearFields();

      //navigate to the Main page
      this.getRouter().navTo("main");
    },

    onClearFields: function () {
      this.getView().byId("roomInput").setValue(null);
      this.getView().byId("nameInput").setValue(null);
      this.getView().byId("counterInput").setValue(null);
      this.getView().byId("coefficientInput").setValue("1");
    }
  });
});
