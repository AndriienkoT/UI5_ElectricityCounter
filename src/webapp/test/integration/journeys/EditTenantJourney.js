sap.ui.require([
    "sap/ui/test/opaQunit"],
  function(opaTest) {

    QUnit.module(`"Edit Tenant" Journey`);

    opaSkip("I should be able to see filtered data in the Tenant Name combobox by given Room and in Counter combobox by given Name", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("editTenantLink");

      Then.onEditTenantPage.iShouldSeeEditTenantPage();
      Then.onEditTenantPage.iShouldSeeComboBoxWith("roomComboBox", '');
      Then.onEditTenantPage.iShouldSeeComboBoxWith("nameComboBox", '');
      Then.onEditTenantPage.iShouldSeeComboBoxWith("counterComboBox", '');
      Then.onEditTenantPage.iShouldSeeInputWith("coefficientInput", '');

      When.onEditTenantPage.iSelectItemInComboBox("roomComboBox", "1");

      Then.onEditTenantPage.listOfComboBoxShouldBeFiltered("nameComboBox", ["1st"]);

      When.onEditTenantPage.iSelectItemInComboBox("nameComboBox", "1st");

      Then.onEditTenantPage.listOfComboBoxShouldBeFiltered("counterComboBox", ["1"]);

      Then.iTeardownMyAppFrame();
    });

    opaSkip("I should be able to edit tenant providing all necessary data and when the tenant with given counter exists", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("editTenantLink");

      Then.onEditTenantPage.iShouldSeeEditTenantPage();
      Then.onEditTenantPage.iShouldSeeComboBoxWith("roomComboBox", '');
      Then.onEditTenantPage.iShouldSeeComboBoxWith("nameComboBox", '');
      Then.onEditTenantPage.iShouldSeeComboBoxWith("counterComboBox", '');
      Then.onEditTenantPage.iShouldSeeInputWith("coefficientInput", '');

      When.onEditTenantPage.iSelectItemInComboBox("roomComboBox", "1");

      Then.onEditTenantPage.listOfComboBoxShouldBeFiltered("nameComboBox", ["1st"]);

      When.onEditTenantPage.iSelectItemInComboBox("nameComboBox", "1st");

      Then.onEditTenantPage.listOfComboBoxShouldBeFiltered("counterComboBox", ["1"]);

      When.onEditTenantPage.iSelectItemInComboBox("counterComboBox", "1");
      When.onEditTenantPage.iTypeInInput("coefficientInput", "2");

      Then.onEditTenantPage.tenantShouldBeInModel('1');

      When.onEditTenantPage.iPressButton("editButton");

      Then.onEditTenantPage.inModelShouldBeNextData("1", "1st", "1", "2");

      Then.onEditTenantPage.iShouldSeeTheMessage();
      Then.onEditTenantPage.iShouldSeeComboBoxWith("roomComboBox", '');
      Then.onEditTenantPage.iShouldSeeComboBoxWith("nameComboBox", '');
      Then.onEditTenantPage.iShouldSeeComboBoxWith("counterComboBox", '');
      Then.onEditTenantPage.iShouldSeeInputWith("coefficientInput", '');

      Then.iTeardownMyAppFrame();
    });

    opaSkip("When a tenant with the given counter does not exist, tenant should not be changed", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("editTenantLink");

      Then.onEditTenantPage.iShouldSeeEditTenantPage();
      Then.onEditTenantPage.iShouldSeeComboBoxWith("roomComboBox", '');
      Then.onEditTenantPage.iShouldSeeComboBoxWith("nameComboBox", '');
      Then.onEditTenantPage.iShouldSeeComboBoxWith("counterComboBox", '');
      Then.onEditTenantPage.iShouldSeeInputWith("coefficientInput", '');

      When.onEditTenantPage.iSelectItemInComboBox("roomComboBox", "1");

      Then.onEditTenantPage.listOfComboBoxShouldBeFiltered("nameComboBox", ["1st"]);

      When.onEditTenantPage.iSelectItemInComboBox("nameComboBox", "1st");
      When.onEditTenantPage.iSelectItemInComboBox("counterComboBox", "3");
      When.onEditTenantPage.iTypeInInput("coefficientInput", "1");

      Then.onEditTenantPage.tenantShouldNotBeInModel('3');

      When.onEditTenantPage.iPressButton("editButton");

      Then.onEditTenantPage.iShouldSeeTheMessage();
      Then.onEditTenantPage.iShouldSeeComboBoxWith("roomComboBox", "1");
      Then.onEditTenantPage.iShouldSeeComboBoxWith("nameComboBox", "1st");
      Then.onEditTenantPage.iShouldSeeComboBoxWith("counterComboBox", "3");
      Then.onEditTenantPage.iShouldSeeInputWith("coefficientInput", "1");

      Then.iTeardownMyAppFrame();
    });

    opaSkip("When not all necessary data is given, tenant should not be changed", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("editTenantLink");

      Then.onEditTenantPage.iShouldSeeEditTenantPage();
      Then.onEditTenantPage.iShouldSeeComboBoxWith("roomComboBox", '');
      Then.onEditTenantPage.iShouldSeeComboBoxWith("nameComboBox", '');
      Then.onEditTenantPage.iShouldSeeComboBoxWith("counterComboBox", '');
      Then.onEditTenantPage.iShouldSeeInputWith("coefficientInput", '');

      When.onEditTenantPage.iSelectItemInComboBox("roomComboBox", "1");

      Then.onEditTenantPage.listOfComboBoxShouldBeFiltered("nameComboBox", ["1st"]);

      When.onEditTenantPage.iSelectItemInComboBox("nameComboBox", "1st");

      Then.onEditTenantPage.listOfComboBoxShouldBeFiltered("counterComboBox", ["1"]);

      When.onEditTenantPage.iSelectItemInComboBox("counterComboBox", "1");

      Then.onEditTenantPage.tenantShouldBeInModel('1');

      When.onEditTenantPage.iPressButton("editButton");

      Then.onEditTenantPage.iShouldSeeTheMessage();
      Then.onEditTenantPage.iShouldSeeComboBoxWith("roomComboBox", "1");
      Then.onEditTenantPage.iShouldSeeComboBoxWith("nameComboBox", "1st");
      Then.onEditTenantPage.iShouldSeeComboBoxWith("counterComboBox", "1");
      Then.onEditTenantPage.iShouldSeeInputWith("coefficientInput", "");

      Then.iTeardownMyAppFrame();
    });

    opaSkip("I should be able to come back to the Main page without saving entered data", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("editTenantLink");

      Then.onEditTenantPage.iShouldSeeEditTenantPage();
      Then.onEditTenantPage.iShouldSeeComboBoxWith("roomComboBox", '');
      Then.onEditTenantPage.iShouldSeeComboBoxWith("nameComboBox", '');
      Then.onEditTenantPage.iShouldSeeComboBoxWith("counterComboBox", '');
      Then.onEditTenantPage.iShouldSeeInputWith("coefficientInput", '');

      When.onEditTenantPage.iSelectItemInComboBox("roomComboBox", "1");

      Then.onEditTenantPage.listOfComboBoxShouldBeFiltered("nameComboBox", ["1st"]);

      When.onEditTenantPage.iSelectItemInComboBox("nameComboBox", "1st");

      Then.onEditTenantPage.listOfComboBoxShouldBeFiltered("counterComboBox", ["1"]);

      When.onEditTenantPage.iSelectItemInComboBox("counterComboBox", "3");
      When.onEditTenantPage.iTypeInInput("coefficientInput", "1");
      When.onEditTenantPage.iPressButton("backButton");

      Then.onMainPage.iShouldSeeMainPage();

      When.onMainPage.iPressLink("editTenantLink");

      Then.onEditTenantPage.iShouldSeeEditTenantPage();
      Then.onEditTenantPage.iShouldSeeComboBoxWith("roomComboBox", '');
      Then.onEditTenantPage.iShouldSeeComboBoxWith("nameComboBox", '');
      Then.onEditTenantPage.iShouldSeeComboBoxWith("counterComboBox", '');
      Then.onEditTenantPage.iShouldSeeInputWith("coefficientInput", '');

      Then.iTeardownMyAppFrame();
    });
  });
