sap.ui.define([
  'jquery.sap.global',
  "sap/ui/core/UIComponent",
  "sap/ui/model/json/JSONModel",
  "sap/ui/Device"
], function (Query, UIComponent, JSONModel, Device) {
  "use strict";

  return UIComponent.extend("UI5toLearn.Component", {
    metadata: {
      manifest: "json"
    },
    init: function () {
      UIComponent.prototype.init.apply(this, arguments);

      // set device model
      var oDeviceModel = new sap.ui.model.json.JSONModel(Device);
      oDeviceModel.setDefaultBindingMode("OneWay");
      this.setModel(oDeviceModel, "device");

      // create the views based on the url/hash
      this.getRouter().initialize();
    }
  });
});
