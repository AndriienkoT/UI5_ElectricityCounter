sap.ui.define([
  "UI5toLearn/controller/BaseController",
  'sap/m/MessageToast'
], function (BaseController, MessageToast) {
  "use strict";
  return BaseController.extend("UI5toLearn.controller.EditTenant", {
    onInit: function () {
      var oController = BaseController;
      this.onRetrieveData(oController);
    },

    onEditTenant: function (oEvent) {
      var bundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

      //get entered data from the input fields
      var sHousing = this.getView().byId("housing").getValue();
      var sFloor = this.getView().byId("floor").getValue();
      var sRoom = this.getView().byId("room").getValue();
      var sName = this.getView().byId("name").getValue();
      var sCounter = this.getView().byId("counter").getValue();
      var sCoefficient = this.getView().byId("coefficient").getValue();

      if (sHousing == "" || sFloor == "" || sRoom == "" || sName == "" || sCounter == "" || sCoefficient == "") {
        var sMessage = bundle.getText("editTenantPageMessageFields");
        MessageToast.show(sMessage);
      } else {

        // edit tenant in the Model
        var allStillExistingTenants = this.getModel().getProperty('/tenants');
        var nIndex = 0;
        for (nIndex = 0; nIndex < allStillExistingTenants.length; nIndex++) {
          if (allStillExistingTenants[nIndex].counter === sCounter) {
            break;
          }
        }
        var oTenant = allStillExistingTenants[nIndex];
        if(oTenant.housing !== sHousing){
          oTenant.housing = sHousing;
        }
        if(oTenant.floor !== sFloor){
          oTenant.floor = sFloor;
        }
        if(oTenant.room !== sRoom){
          oTenant.room = sRoom;
        }
        if(oTenant.name !== sName){
          oTenant.name = sName;
        }
        if(oTenant.coefficient !== sCoefficient){

          oTenant.coefficient = sCoefficient;
        }
        allStillExistingTenants.splice(nIndex, 1, oTenant);

        //update data in IDB
        var oController = BaseController;
        this.onEditOneTenant(oController, sHousing, sFloor, sRoom, sName, sCounter, sCoefficient);

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
