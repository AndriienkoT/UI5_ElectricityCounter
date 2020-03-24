sap.ui.define([
  "UI5toLearn/controller/BaseController.controller",
  'sap/m/MessageToast',
  'sap/ui/model/Filter'
], function (BaseController, MessageToast, Filter) {
  "use strict";
  return BaseController.extend("UI5toLearn.controller.DeleteTenant", {
    onInit: function () {
      var oController = BaseController;
      this.onRetrieveData(oController, "tenants");
    },

    onItemSelected: function (oEvent) {

      //filter the counter numbers by selected tenant name
      var oSelectedItem = oEvent.getParameters("selectedItem").selectedItem;
      if (oSelectedItem != null) {
        var sTerm = oSelectedItem.getText();
        var aFilters = [];
        if (sTerm) {
          aFilters.push(new Filter("name", sap.ui.model.FilterOperator.EQ, sTerm));
        }
        this.getView().byId("counterComboBox").getBinding("items").filter(aFilters);
      } else {

        //if no tenant name is selected, update bindings
        var oTemplate = this.getView().byId("counterComboBox").getBindingInfo("items").template;
        this.getView().byId("counterComboBox").unbindItems();
        this.getView().byId("counterComboBox").bindItems({
          path: "Model>/tenants",
          template: oTemplate
        });
      }
    },

    onDeleteTenant: function (oEvent) {
      var bundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

      //get entered value from the input field
      var sCounter = this.getView().byId("counterComboBox").getValue();
      if (sCounter == "") {
        var sMessageEnterCounter = bundle.getText("deleteTenantPageMessageEnterCounter");
        MessageToast.show(sMessageEnterCounter);
      } else {
        var allStillExistingTenants = this.getModel().getProperty('/tenants');

        // remove tenant
        var nIndex = allStillExistingTenants.findIndex(tenant => tenant.counter === sCounter);
        if (nIndex == -1) {
          var sMessageCounterDoesntExist = bundle.getText("deleteTenantPageMessageCounterDoesntExist");
          MessageToast.show(sMessageCounterDoesntExist);
        } else {
          allStillExistingTenants.splice(nIndex, 1);

          //delete tenant from IDB
          var oController = BaseController;
          this.onRemoveOneObject(oController, "tenants", sCounter);

          var sMessageWasRemoved = bundle.getText("deleteTenantPageMessageWasRemoved");
          MessageToast.show(sMessageWasRemoved);

          //clear the input field
          this.getView().byId("nameComboBox").setValue(null);
          this.getView().byId("counterComboBox").setValue(null);
        }
      }
    },

    onNavBackWithoutSaving: function (oEvent) {

      //clear the input field
      this.getView().byId("nameComboBox").setValue(null);
      this.getView().byId("counterComboBox").setValue(null);

      //navigate to the Main page
      this.getRouter().navTo("main");

      //reload Main page
      this.onReloadMainPage();
    }
  });
});
