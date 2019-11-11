sap.ui.getCore().attachInit(() => {
  sap.ui.require([
    "sap/ui/core/ComponentContainer"
  ], (ComponentContainer) => {

    $.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-core");
    $.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-widget");
    $.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-mouse");
    $.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-draggable");

    let mainComponent = sap.ui.component({
      id: "main-component",
      name: "UI5toLearn"
    });

    let mainContainer = new ComponentContainer("main-component-container", {
      component: mainComponent,
      height: "100%",
      width: "100%"
    });

    mainContainer.placeAt("content");
  });
});
