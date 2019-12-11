sap.ui.define([
  "UI5toLearn/controller/BaseController",
  'sap/m/MessageToast'
], function (BaseController, MessageToast) {
  "use strict";
  return BaseController.extend("UI5toLearn.controller.CreateTenant", {
    onInit: function () {
      var oController = BaseController;
      this.onRetrieveData(oController);

      this.getView().byId("coefficient").setValue("1");
    },

    onCreateTenant: function (oEvent) {
      var bundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

      //get entered data from the input fields
      var sHousing = this.getView().byId("housing").getValue();
      var sFloor = this.getView().byId("floor").getValue();
      var sRoom = this.getView().byId("room").getValue();
      var sName = this.getView().byId("name").getValue();
      var sCounter = this.getView().byId("counter").getValue();
      var sCoefficient = this.getView().byId("coefficient").getValue();

      //check whether tenant with current counter already exists
      var allExistingTenants = null;
      var bCounterExists = false;
      if (this.getModel() != undefined) {
        allExistingTenants = this.getModel().getProperty('/tenants');
      }
      if (allExistingTenants != null) {
        if (allExistingTenants.length > 0) {
          for (var i = 0; i < allExistingTenants.length; i++) {
            if (allExistingTenants[i].counter === sCounter) {
              bCounterExists = true;
            }
          }
        }
      }
      if (bCounterExists) {
        var sMessage1 = bundle.getText("createTenantPageMessageCounterExists");
        MessageToast.show(sMessage1);
      } else if (sHousing == "" || sFloor == "" || sRoom == "" || sName == "" || sCounter == "" || sCoefficient == "") {
        var sMessage2 = bundle.getText("createTenantPageMessageFields");
        MessageToast.show(sMessage2);
      } else {

        //create oData
        var oData = {
          "housing" : sHousing,
          "floor" : sFloor,
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
        var oDataFromModel = null;
        if (this.getModel() != undefined) {
          oDataFromModel = this.getModel().getData();
        }
        oDataFromModel.tenants.push(oData);
        this.getModel().refresh(true);

        //set oData to the IDB
        var oController = BaseController;
        this.onWriteOneTenantToIDB(oController, oData);

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
      this.getView().byId("housing").setValue(null);
      this.getView().byId("floor").setValue(null);
      this.getView().byId("room").setValue(null);
      this.getView().byId("name").setValue(null);
      this.getView().byId("counter").setValue(null);
      this.getView().byId("coefficient").setValue("1");
    }
  });
});
