jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
  "sap/ui/test/Opa5",
  "test/opa/base/Common",
  /* Page Objects */
  "test/opa/pages/Main",
  "test/opa/pages/CreateTenant",
  "test/opa/pages/EditTenant",
  "test/opa/pages/DeleteTenant",
  "test/opa/pages/CreatePDF",
  "test/opa/pages/EnterCounterNumber",
  "test/opa/pages/FundedSheet"
], function (Opa5, Common) {
  "use strict";
  Opa5.extendConfig({
    arrangements: new Common()
  });

  sap.ui.require([
    "test/opa/journeys/CreateTenantJourney",
    "test/opa/journeys/EditTenantJourney",
    "test/opa/journeys/DeleteTenantJourney",
    "test/opa/journeys/CreatePDFJourney",
    "test/opa/journeys/EnterCounterNumberJourney",
    "test/opa/journeys/FundedSheetJourney"
  ], function () {
    QUnit.start();
  });
});
