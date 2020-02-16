sap.ui.require([
    "sap/ui/test/opaQunit"],
  function(opaTest) {

    QUnit.module(`"Delete Tenant" Journey`);

    opaSkip("I should be able to see filtered data in the Counter combobox by given Name", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("deleteTenantLink");

      Then.onDeleteTenantPage.iShouldSeeDeleteTenantPage();
      Then.onDeleteTenantPage.iShouldSeeComboBoxWith("nameComboBox", '');
      Then.onDeleteTenantPage.iShouldSeeComboBoxWith("counterComboBox", '');

      When.onDeleteTenantPage.iSelectItemInComboBox("nameComboBox", "1st");

      Then.onDeleteTenantPage.listOfComboBoxShouldBeFiltered("counterComboBox", ["1"]);

      Then.iTeardownMyAppFrame();
    });

    opaSkip("I should be able to remove tenant when the tenant with given counter exists", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("deleteTenantLink");

      Then.onDeleteTenantPage.iShouldSeeDeleteTenantPage();
      Then.onDeleteTenantPage.iShouldSeeComboBoxWith("nameComboBox", '');
      Then.onDeleteTenantPage.iShouldSeeComboBoxWith("counterComboBox", '');

      // When.onDeleteTenantPage.iSelectItemInComboBox("nameComboBox", "1st");

      // Then.onDeleteTenantPage.listOfComboBoxShouldBeFiltered("counterComboBox", ["1"]);

      When.onDeleteTenantPage.iSelectItemInComboBox("counterComboBox", "1");

      Then.onDeleteTenantPage.tenantShouldBeInModel('1');

      When.onDeleteTenantPage.iPressButton("deleteButton");

      Then.onDeleteTenantPage.tenantShouldNotBeInModel('1');

      Then.onDeleteTenantPage.iShouldSeeTheMessage();
      Then.onDeleteTenantPage.iShouldSeeComboBoxWith("nameComboBox", '');
      Then.onDeleteTenantPage.iShouldSeeComboBoxWith("counterComboBox", '');

      Then.iTeardownMyAppFrame();
    });

    opaSkip("When a tenant with the given counter does not exist, tenant should cannot be deleted", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("deleteTenantLink");

      Then.onDeleteTenantPage.iShouldSeeDeleteTenantPage();
      Then.onDeleteTenantPage.iShouldSeeComboBoxWith("nameComboBox", '');
      Then.onDeleteTenantPage.iShouldSeeComboBoxWith("counterComboBox", '');

      When.onDeleteTenantPage.iSelectItemInComboBox("nameComboBox", "1st");
      When.onDeleteTenantPage.iSelectItemInComboBox("counterComboBox", "3");

      Then.onDeleteTenantPage.tenantShouldNotBeInModel('3');

      When.onDeleteTenantPage.iPressButton("deleteButton");

      Then.onDeleteTenantPage.iShouldSeeTheMessage();
      Then.onDeleteTenantPage.iShouldSeeComboBoxWith("nameComboBox", '1st');
      Then.onDeleteTenantPage.iShouldSeeComboBoxWith("counterComboBox", '3');

      Then.iTeardownMyAppFrame();
    });

    opaSkip("When counter is not given, tenant should not be removed", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("deleteTenantLink");

      Then.onDeleteTenantPage.iShouldSeeDeleteTenantPage();
      Then.onDeleteTenantPage.iShouldSeeComboBoxWith("nameComboBox", '');
      Then.onDeleteTenantPage.iShouldSeeComboBoxWith("counterComboBox", '');

      When.onDeleteTenantPage.iSelectItemInComboBox("nameComboBox", "1st");
      When.onDeleteTenantPage.iPressButton("deleteButton");

      Then.onDeleteTenantPage.iShouldSeeTheMessage();
      Then.onDeleteTenantPage.iShouldSeeComboBoxWith("nameComboBox", '1st');
      Then.onDeleteTenantPage.iShouldSeeComboBoxWith("counterComboBox", '');

      Then.iTeardownMyAppFrame();
    });

    opaSkip("I should be able to come back to the Main page without saving entered data", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("deleteTenantLink");

      Then.onDeleteTenantPage.iShouldSeeDeleteTenantPage();
      Then.onDeleteTenantPage.iShouldSeeComboBoxWith("nameComboBox", '');
      Then.onDeleteTenantPage.iShouldSeeComboBoxWith("counterComboBox", '');

      When.onDeleteTenantPage.iSelectItemInComboBox("nameComboBox", "1st");
      When.onDeleteTenantPage.iSelectItemInComboBox("counterComboBox", "1");
      When.onDeleteTenantPage.iPressButton("backButton");

      Then.onMainPage.iShouldSeeMainPage();

      When.onMainPage.iPressLink("deleteTenantLink");

      Then.onDeleteTenantPage.iShouldSeeDeleteTenantPage();
      Then.onDeleteTenantPage.iShouldSeeComboBoxWith("nameComboBox", '');
      Then.onDeleteTenantPage.iShouldSeeComboBoxWith("counterComboBox", '');

      Then.iTeardownMyAppFrame();
    });
  });
