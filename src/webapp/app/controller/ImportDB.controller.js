sap.ui.define([
  "UI5toLearn/controller/BaseController.controller",
  'sap/m/MessageToast'
], function (BaseController, MessageToast) {
  "use strict";
  return BaseController.extend("UI5toLearn.controller.ImportDB", {

    onClearDB: function () {
      //remove all data except the last date of a made copy
      var oController = BaseController;
      this.onRemoveAllData(oController, "tenants");

      //show message
      var bundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
      var sMessage = bundle.getText("importDBPageMessageDBCleared");
      MessageToast.show(sMessage);
    },

    handleUploadPress: function (oEvent) {
      var that = this;
      var oController = BaseController;

      //get selected in FileUploader file
      var oFile = this.getView().byId("importDBfileUploader").oFileUpload.files[0];
      if (oFile) {
        //if there is some, read it
        var oReader = new FileReader();
        oReader.onload = function(e) {
          var fileContent = e.target.result;

          //import read content
          that.onImportFromJson(oController, fileContent);
        };
        oReader.readAsText(oFile);
      }
    },

    onNavBackWithoutSaving: function (oEvent) {
      //clear selected file
      this.getView().byId("importDBfileUploader").clear();

      //navigate to the Main page
      this.getRouter().navTo("main");

      //reload Main page
      this.onReloadMainPage();
    }
  });
});
