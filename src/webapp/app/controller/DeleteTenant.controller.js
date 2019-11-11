sap.ui.define([
  "UI5toLearn/controller/BaseController"
], function (BaseController) {
  "use strict";
  return BaseController.extend("UI5toLearn.controller.DeleteTenant", {

    onDeleteTenant: function (oEvent) {

      //get entered value from the input field
      var sCounter = this.getView().byId("counter").getValue();

      var allStillExistingTenants = this.getModel().getProperty('/tenants');

      // remove tenant from the Storage
      for (var i = 0; i < allStillExistingTenants.length; i++) {
        if (allStillExistingTenants[i].counter === sCounter) {
          allStillExistingTenants.splice(i, 1);
          break;
        }
      }

      //update data in the Storage
      this.getStorage().put('myLocalData', this.getModel().getData());
      this.getModel().refresh(true);

      this.getView().byId("counter").setValue(null);

      // console.log(this.getModel());
      // console.log(this.getStorage().get("myLocalData"));
    },

    onNavBackWithoutSaving: function (oEvent) {

      //clear the input field
      this.getView().byId("counter").setValue(null);

      //navigate to the Main page
      this.getRouter().navTo("main");
    }
  });
});
