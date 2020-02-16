sap.ui.require([
    "sap/ui/test/opaQunit",
    "sap/ui/test/Opa5"],
  function(opaTest, Opa5) {

    QUnit.module(`"Create Tenant" Journey`);

    opaSkip("I should be able to create tenant providing all necessary data and when the tenant with given counter does not exist yet", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("createTenantLink");

      Then.onCreateTenantPage.iShouldSeeCreateTenantPage();
      Then.onCreateTenantPage.iShouldSeeInputWith("roomInput", '');
      Then.onCreateTenantPage.iShouldSeeInputWith("nameInput", '');
      Then.onCreateTenantPage.iShouldSeeInputWith("counterInput", '');
      Then.onCreateTenantPage.iShouldSeeInputWith("coefficientInput", "1");

      When.onCreateTenantPage.iTypeInInput("roomInput", '3');
      When.onCreateTenantPage.iTypeInInput("nameInput", '3');
      When.onCreateTenantPage.iTypeInInput("counterInput", '3');
      When.onCreateTenantPage.iTypeInInput("coefficientInput", '3');

      Then.onCreateTenantPage.tenantShouldNotBeInModel('3');

      When.onCreateTenantPage.iPressButton("saveButton");

      Then.onCreateTenantPage.tenantShouldBeInModel('3');
      Then.onCreateTenantPage.iShouldSeeTheMessage();
      Then.onCreateTenantPage.iShouldSeeInputWith("roomInput", '');
      Then.onCreateTenantPage.iShouldSeeInputWith("nameInput", '');
      Then.onCreateTenantPage.iShouldSeeInputWith("counterInput", '');
      Then.onCreateTenantPage.iShouldSeeInputWith("coefficientInput", "1");

      Then.iTeardownMyAppFrame();
    });

    opaSkip("When the tenant with given counter already exists, it should not be added to the Model", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("createTenantLink");

      Then.onCreateTenantPage.iShouldSeeCreateTenantPage();
      Then.onCreateTenantPage.iShouldSeeInputWith("roomInput", '');
      Then.onCreateTenantPage.iShouldSeeInputWith("nameInput", '');
      Then.onCreateTenantPage.iShouldSeeInputWith("counterInput", '');
      Then.onCreateTenantPage.iShouldSeeInputWith("coefficientInput", "1");

      When.onCreateTenantPage.iTypeInInput("roomInput", '2');
      When.onCreateTenantPage.iTypeInInput("nameInput", 'TenantName');
      When.onCreateTenantPage.iTypeInInput("counterInput", '14');
      When.onCreateTenantPage.iTypeInInput("coefficientInput", '2');

      Then.onCreateTenantPage.tenantShouldBeInModel('14');

      When.onCreateTenantPage.iPressButton("saveButton");

      Then.onCreateTenantPage.iShouldSeeTheMessage();
      Then.onCreateTenantPage.iShouldSeeInputWith("roomInput", "2");
      Then.onCreateTenantPage.iShouldSeeInputWith("nameInput", "TenantName");
      Then.onCreateTenantPage.iShouldSeeInputWith("counterInput", "14");
      Then.onCreateTenantPage.iShouldSeeInputWith("coefficientInput", "2");

      Then.iTeardownMyAppFrame();
    });

    opaSkip("When not all necessary data is given, tenant should not be added to the Model", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("createTenantLink");

      Then.onCreateTenantPage.iShouldSeeCreateTenantPage();
      Then.onCreateTenantPage.iShouldSeeInputWith("roomInput", '');
      Then.onCreateTenantPage.iShouldSeeInputWith("nameInput", '');
      Then.onCreateTenantPage.iShouldSeeInputWith("counterInput", '');
      Then.onCreateTenantPage.iShouldSeeInputWith("coefficientInput", "1");

      When.onCreateTenantPage.iTypeInInput("roomInput", '2');
      When.onCreateTenantPage.iTypeInInput("counterInput", '15');
      When.onCreateTenantPage.iTypeInInput("coefficientInput", '1');

      When.onCreateTenantPage.iPressButton("saveButton");

      Then.onCreateTenantPage.tenantShouldNotBeInModel('15');
      Then.onCreateTenantPage.iShouldSeeTheMessage();
      Then.onCreateTenantPage.iShouldSeeInputWith("roomInput", "2");
      Then.onCreateTenantPage.iShouldSeeInputWith("counterInput", "15");
      Then.onCreateTenantPage.iShouldSeeInputWith("coefficientInput", "1");

      Then.iTeardownMyAppFrame();
    });

    opaSkip("I should be able to come back to the Main page without saving entered data", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("createTenantLink");

      Then.onCreateTenantPage.iShouldSeeCreateTenantPage();
      Then.onCreateTenantPage.iShouldSeeInputWith("roomInput", '');
      Then.onCreateTenantPage.iShouldSeeInputWith("nameInput", '');
      Then.onCreateTenantPage.iShouldSeeInputWith("counterInput", '');
      Then.onCreateTenantPage.iShouldSeeInputWith("coefficientInput", "1");

      When.onCreateTenantPage.iTypeInInput("roomInput", '2');
      When.onCreateTenantPage.iTypeInInput("nameInput", '2');
      When.onCreateTenantPage.iTypeInInput("counterInput", '2');
      When.onCreateTenantPage.iTypeInInput("coefficientInput", '2');

      When.onCreateTenantPage.iPressButton("backButton");

      Then.onMainPage.iShouldSeeMainPage();

      When.onMainPage.iPressLink("createTenantLink");

      Then.onCreateTenantPage.iShouldSeeCreateTenantPage();
      Then.onCreateTenantPage.iShouldSeeInputWith("roomInput", '');
      Then.onCreateTenantPage.iShouldSeeInputWith("nameInput", '');
      Then.onCreateTenantPage.iShouldSeeInputWith("counterInput", '');
      Then.onCreateTenantPage.iShouldSeeInputWith("coefficientInput", "1");

      Then.iTeardownMyAppFrame();
    });
  });
