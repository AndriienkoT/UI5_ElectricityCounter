sap.ui.require([
    "sap/ui/test/opaQunit"],
  function(opaTest) {

    QUnit.module(`"Funded Sheet" Journey`);

    opaSkip("I should not be able to see the data of all tenants when a year is not given", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("fundedSheetLink");

      Then.onFundedSheetPage.iShouldSeeFundedSheetPage();

      When.onFundedSheetPage.iPressButton("allTenantsBtn");

      Then.onFundedSheetPage.iShouldSeeTheMessage();

      Then.iTeardownMyAppFrame();
    });

    opaSkip("I should be able to see the data of all tenants when a year is smaller than 2019 or greater than 2025", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("fundedSheetLink");

      Then.onFundedSheetPage.iShouldSeeFundedSheetPage();

      When.onFundedSheetPage.iTypeInInput("year", 2030);
      When.onFundedSheetPage.iPressButton("allTenantsBtn");

      Then.onFundedSheetPage.iShouldSeeTheMessage();

      Then.iTeardownMyAppFrame();
    });

    opaSkip("I should be able to see the data of all tenants when a year is given", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("fundedSheetLink");

      Then.onFundedSheetPage.iShouldSeeFundedSheetPage();

      When.onFundedSheetPage.iTypeInInput("year", 2020);
      When.onFundedSheetPage.iPressButton("allTenantsBtn");

      Then.onFundedSheetPage.iShouldSeeTable();

      Then.iTeardownMyAppFrame();
    });

    opaSkip("I should not be able to see the data of all tenants when only start or only end month is given", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("fundedSheetLink");

      Then.onFundedSheetPage.iShouldSeeFundedSheetPage();

      When.onFundedSheetPage.iTypeInInput("year", 2020);
      When.onFundedSheetPage.iTypeInInput("monthStart", 2);
      When.onFundedSheetPage.iPressButton("allTenantsBtn");

      Then.onFundedSheetPage.iShouldSeeTheMessage();

      Then.iTeardownMyAppFrame();
    });

    opaSkip("I should not be able to see the data of all tenants when start month is greater than end month given", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("fundedSheetLink");

      Then.onFundedSheetPage.iShouldSeeFundedSheetPage();

      When.onFundedSheetPage.iTypeInInput("year", 2020);
      When.onFundedSheetPage.iTypeInInput("monthStart", 2);
      When.onFundedSheetPage.iTypeInInput("monthEnd", 1);
      When.onFundedSheetPage.iPressButton("allTenantsBtn");

      Then.onFundedSheetPage.iShouldSeeTheMessage();

      Then.iTeardownMyAppFrame();
    });

    opaSkip("I should not be able to see the data of all tenants when start month is smaller than 1 or/and end month greater than 12", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("fundedSheetLink");

      Then.onFundedSheetPage.iShouldSeeFundedSheetPage();

      When.onFundedSheetPage.iTypeInInput("year", 2020);
      When.onFundedSheetPage.iTypeInInput("monthStart", 0);
      When.onFundedSheetPage.iTypeInInput("monthEnd", 15);
      When.onFundedSheetPage.iPressButton("allTenantsBtn");

      Then.onFundedSheetPage.iShouldSeeTheMessage();

      Then.iTeardownMyAppFrame();
    });

    opaSkip("I should not be able to see the data of all tenants when there is no counter numbers in a given time slot", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("fundedSheetLink");

      Then.onFundedSheetPage.iShouldSeeFundedSheetPage();

      When.onFundedSheetPage.iTypeInInput("year", 2020);
      When.onFundedSheetPage.iTypeInInput("monthStart", 2);
      When.onFundedSheetPage.iTypeInInput("monthEnd", 10);
      When.onFundedSheetPage.iPressButton("allTenantsBtn");

      Then.onFundedSheetPage.iShouldSeeTheMessage();

      Then.iTeardownMyAppFrame();
    });


    opaSkip("I should be able to see the data of tenants for the months, which belong to selected time slot", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("fundedSheetLink");

      Then.onFundedSheetPage.iShouldSeeFundedSheetPage();

      When.onFundedSheetPage.iTypeInInput("year", 2020);
      When.onFundedSheetPage.iTypeInInput("monthStart", 1);
      When.onFundedSheetPage.iTypeInInput("monthEnd", 2);
      When.onFundedSheetPage.iPressButton("allTenantsBtn");

      Then.onFundedSheetPage.iShouldSeeTableWithAmountOfColumns(6);

      Then.iTeardownMyAppFrame();
    });

    opaSkip("I should be able to filter the data by Tenant name", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("fundedSheetLink");

      Then.onFundedSheetPage.iShouldSeeFundedSheetPage();

      When.onFundedSheetPage.iTypeInInput("year", 2020);
      When.onFundedSheetPage.iPressButton("allTenantsBtn");

      Then.onFundedSheetPage.iShouldSeeTable();

      When.onFundedSheetPage.iClickOnFacetFilter("facetFilterTenant");
      When.onFundedSheetPage.iSelectItemInFilter("facetFilterTenant", ["1st", "2"]);
      When.onFundedSheetPage.iPressOnTheScreen();

      Then.onFundedSheetPage.iShouldSeeFacetFilterWithTitle("facetFilterTenant", "name (2)");
      Then.onFundedSheetPage.iShouldSeeTableWithTenantNames(["2", "1st"]);

      Then.iTeardownMyAppFrame();
    });

    opaSkip("I should be able to filter the data by Counter", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("fundedSheetLink");

      Then.onFundedSheetPage.iShouldSeeFundedSheetPage();

      When.onFundedSheetPage.iTypeInInput("year", 2020);
      When.onFundedSheetPage.iPressButton("allTenantsBtn");

      Then.onFundedSheetPage.iShouldSeeTable();

      When.onFundedSheetPage.iClickOnFacetFilter("facetFilterCounter");
      When.onFundedSheetPage.iSelectItemInFilter("facetFilterCounter", ["1", "3"]);
      When.onFundedSheetPage.iPressOnTheScreen();

      Then.onFundedSheetPage.iShouldSeeFacetFilterWithTitle("facetFilterCounter", "counter (2)");
      Then.onFundedSheetPage.iShouldSeeTableWithCounters(["1", "3"]);

      Then.iTeardownMyAppFrame();
    });

    opaSkip("I should be able to filter the data by both Tenant name and Counter", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("fundedSheetLink");

      Then.onFundedSheetPage.iShouldSeeFundedSheetPage();

      When.onFundedSheetPage.iTypeInInput("year", 2020);
      When.onFundedSheetPage.iPressButton("allTenantsBtn");

      Then.onFundedSheetPage.iShouldSeeTable();

      When.onFundedSheetPage.iClickOnFacetFilter("facetFilterTenant");
      When.onFundedSheetPage.iSelectItemInFilter("facetFilterTenant", ["1st", "2"]);
      When.onFundedSheetPage.iPressOnTheScreen();

      Then.onFundedSheetPage.iShouldSeeFacetFilterWithTitle("facetFilterTenant", "name (2)");

      When.onFundedSheetPage.iClickOnFacetFilter("facetFilterCounter");
      When.onFundedSheetPage.iSelectItemInFilter("facetFilterCounter", ["1", "3"]);
      When.onFundedSheetPage.iPressOnTheScreen();

      Then.onFundedSheetPage.iShouldSeeFacetFilterWithTitle("facetFilterCounter", "counter (2)");
      Then.onFundedSheetPage.iShouldSeeTableWithCounters(["1"]);

      Then.iTeardownMyAppFrame();
    });

    opaSkip("I should be able to come back to the Main page without saving entered data", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("fundedSheetLink");

      Then.onFundedSheetPage.iShouldSeeFundedSheetPage();

      When.onFundedSheetPage.iTypeInInput("year", 2020);
      When.onFundedSheetPage.iPressButton("allTenantsBtn");

      Then.onFundedSheetPage.iShouldSeeTable();

      When.onFundedSheetPage.iClickOnFacetFilter("facetFilterCounter");
      When.onFundedSheetPage.iSelectItemInFilter("facetFilterCounter", ["1", "3"]);
      When.onFundedSheetPage.iPressOnTheScreen();

      Then.onFundedSheetPage.iShouldSeeFacetFilterWithTitle("facetFilterCounter", "counter (2)");
      Then.onFundedSheetPage.iShouldSeeTableWithCounters(["1", "3"]);

      When.onFundedSheetPage.iPressButton("backButton");

      Then.onMainPage.iShouldSeeMainPage();

      When.onMainPage.iPressLink("fundedSheetLink");

      Then.onFundedSheetPage.iShouldSeeFundedSheetPage();

      Then.iTeardownMyAppFrame();
    });
  });
