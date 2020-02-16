sap.ui.define([
  "UI5toLearn/controller/BaseController.controller",
  'sap/m/MessageToast',
  'sap/ui/model/Filter'
], function (BaseController, MessageToast, Filter) {
  "use strict";
  return BaseController.extend("UI5toLearn.controller.EditTenant", {
    onInit: function () {
      var oController = BaseController;
      this.onRetrieveData(oController);
    },

    onItemSelected: function (oEvent) {
      //create array of ids
      var sInputId = oEvent.getParameter("id").split("-")[6];
      var aIds = ["counterComboBox"];
      if (sInputId == "roomComboBox") {
        aIds.push("nameComboBox");
      } else if (sInputId == "nameComboBox") {
        aIds.push("roomComboBox");
      }

      //filter the bindings of the comboboxes by selected value/s
      var oSelectedItem = oEvent.getParameters("selectedItem").selectedItem;
      if (oSelectedItem != null) {
        var sTerm = oSelectedItem.getText();
        var aFilters = [];
        if (sTerm) {
          sInputId = sInputId.substring(0, sInputId.length - 8);
          aFilters.push(new Filter(sInputId, sap.ui.model.FilterOperator.EQ, sTerm));
        }
        aIds.forEach(id => {
          this.getView().byId(id).getBinding("items").filter(aFilters);
        });
      } else {

        //if no value is selected, update bindings
        aIds.forEach(id => {
          var oTemplate = this.getView().byId(id).getBindingInfo("items").template;
          this.getView().byId(id).unbindItems();
          this.getView().byId(id).bindItems({
            path: "Model>/tenants",
            template: oTemplate
          });
        });
      }
    },

    onEditTenant: function (oEvent) {
      var bundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

      //get entered data from the input fields
      var sRoom = this.getView().byId("roomComboBox").getValue();
      var sName = this.getView().byId("nameComboBox").getValue();
      var sCounter = this.getView().byId("counterComboBox").getValue();
      var sCoefficient = this.getView().byId("coefficientInput").getValue();

      if (sRoom == "" || sName == "" || sCounter == "" || sCoefficient == "") {
        var sMessage = bundle.getText("editTenantPageMessageFields");
        MessageToast.show(sMessage);
      } else {

        // edit tenant in the Model
        var allStillExistingTenants = this.getModel().getProperty('/tenants');
        var nIndex = allStillExistingTenants.findIndex(tenant => tenant.counter === sCounter);
        if (nIndex == -1) {
          var sMessage = bundle.getText("editTenantPageMessageCounterDoesntExists");
          MessageToast.show(sMessage);
        } else {
          var oTenant = allStillExistingTenants[nIndex];
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
          this.onEditOneTenant(oController, sRoom, sName, sCounter, sCoefficient);

          var sMessageWasEdited = bundle.getText("editTenantPageMessageWasEdited");
          MessageToast.show(sMessageWasEdited);

          //clear input fields
          this.onClearFields();
        }
      }
    },

    onNavBackWithoutSaving: function (oEvent) {

      //clear input fields
      this.onClearFields();

      //navigate to the Main page
      this.getRouter().navTo("main");
    },

    onClearFields: function () {
      this.getView().byId("roomComboBox").setValue(null);
      this.getView().byId("nameComboBox").setValue(null);
      this.getView().byId("counterComboBox").setValue(null);
      this.getView().byId("coefficientInput").setValue(null);
    }
  });
});
