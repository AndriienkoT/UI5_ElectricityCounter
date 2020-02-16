sap.ui.require([
    "sap/ui/test/opaQunit"],
  function(opaTest) {

    QUnit.module(`"Create PDF" Journey`);

    opaSkip("I should be able to select year and month", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("createPDFLink");

      Then.onCreatePDFPage.iShouldSeeCreatePDFPage();
      Then.onCreatePDFPage.iShouldSeeYearPicker(2020);
      Then.onCreatePDFPage.iShouldSeeMonthPicker(0);

      When.onCreatePDFPage.iSetNewYear(2021);
      When.onCreatePDFPage.iSetNewMonth(1);

      Then.onCreatePDFPage.iShouldSeeYearPicker(2021);
      Then.onCreatePDFPage.iShouldSeeMonthPicker(1);

      Then.iTeardownMyAppFrame();
    });

    opaSkip("I should be able to see Current counter number of previous month", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("createPDFLink");

      Then.onCreatePDFPage.iShouldSeeCreatePDFPage();
      Then.onCreatePDFPage.iShouldSeeYearPicker(2020);
      Then.onCreatePDFPage.iShouldSeeMonthPicker(0);
      Then.onCreatePDFPage.iShouldSeeTable();
      Then.onCreatePDFPage.iShouldSeeNoCounterNumberOfPrevMonthOfRow(0);

      When.onCreatePDFPage.iSetNewMonth(1);

      Then.onCreatePDFPage.iShouldSeeCounterNumberOfPrevMonthOfRow(0, "1");

      Then.iTeardownMyAppFrame();
    });

    opaSkip("I should be able to come back to the Main page without saving changed data", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("createPDFLink");

      Then.onCreatePDFPage.iShouldSeeCreatePDFPage();
      Then.onCreatePDFPage.iShouldSeeYearPicker(2020);
      Then.onCreatePDFPage.iShouldSeeMonthPicker(0);

      When.onCreatePDFPage.iSetNewYear(2021);
      When.onCreatePDFPage.iSetNewMonth(1);
      When.onCreatePDFPage.iPressButton("backButton");

      Then.onMainPage.iShouldSeeMainPage();

      When.onMainPage.iPressLink("createPDFLink");

      Then.onCreatePDFPage.iShouldSeeCreatePDFPage();
      Then.onCreatePDFPage.iShouldSeeYearPicker(2020);
      Then.onCreatePDFPage.iShouldSeeMonthPicker(0);

      Then.iTeardownMyAppFrame();
    });
  });
