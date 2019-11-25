sap.ui.define([
  "UI5toLearn/controller/BaseController",
  'sap/m/MessageToast'
], function (BaseController, MessageToast) {
  "use strict";
  return BaseController.extend("UI5toLearn.controller.EditTenant", {

    onEditTenant: function (oEvent) {

      //get entered data from the input fields
      var sHousing = this.getView().byId("housing").getValue();
      var sFloor = this.getView().byId("floor").getValue();
      var sRoom = this.getView().byId("room").getValue();
      var sName = this.getView().byId("name").getValue();
      var sCounter = this.getView().byId("counter").getValue();
      var sCoefficient = this.getView().byId("coefficient").getValue();

      if (sHousing == "" || sFloor == "" || sRoom == "" || sName == "" || sCounter == "" || sCoefficient == "") {
        MessageToast.show("Все поля должны быть заполнены");
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

        var allStillExistingTenants = this.getModel().getProperty('/tenants');

        // edit tenant in the Storage
        for (var i = 0; i < allStillExistingTenants.length; i++) {
          if (allStillExistingTenants[i].counter === sCounter) {
            allStillExistingTenants.splice(i, 1, oData);
            break;
          }
        }

        //update data in the Storage
        this.getStorage().put('myLocalData', this.getModel().getData());
        this.getModel().refresh(true);

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
