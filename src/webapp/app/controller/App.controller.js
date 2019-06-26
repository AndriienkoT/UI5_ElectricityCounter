sap.ui.define([
  "UI5toLearn/controller/BaseController"
], function (BaseController) {
  "use strict";
  return BaseController.extend("UI5toLearn.controller.App", {

    onInit: function () {
      jQuery.sap.log.setLevel(jQuery.sap.log.Level.INFO);
      var oRouter = this.getRouter();

      oRouter.attachBypassed(function (oEvent) {
        var sHash = oEvent.getParameter("hash");
        jQuery.sap.log.info("Sorry, but the hash '" + sHash + "' is invalid.", "The resource was not found.");
      });
      oRouter.attachRouteMatched(function (oEvent){
        var sRouteName = oEvent.getParameter("name");
        jQuery.sap.log.info("User accessed route " + sRouteName + ", timestamp = " + new Date().getTime());
      });
    },

    //press menu button
    onMenuButtonPress : function (oEvent) {
      var viewId = this.getView().getId();
      var mainPage = sap.ui.getCore().byId(viewId + "--main");
      mainPage.setSideExpanded(!mainPage.getSideExpanded());
    }
  });
});
