sap.ui.require([
    "sap/ui/test/opaQunit"],
  function(opaTest) {

    QUnit.module(`"Enter Counter Number" Journey`);

    opaSkip("I should be able to select year and month", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("enterCounterNumberLink");

      Then.onEnterCounterNumberPage.iShouldSeeEnterCounterNumberPage();
      Then.onEnterCounterNumberPage.iShouldSeeYearPicker(2020);
      Then.onEnterCounterNumberPage.iShouldSeeMonthPicker(0);

      When.onEnterCounterNumberPage.iSetNewYear(2021);
      When.onEnterCounterNumberPage.iSetNewMonth(1);

      Then.onEnterCounterNumberPage.iShouldSeeYearPicker(2021);
      Then.onEnterCounterNumberPage.iShouldSeeMonthPicker(1);

      Then.iTeardownMyAppFrame();
    });

    opaSkip("I should be able to see Difference with previous month when Current counter number is entered", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("enterCounterNumberLink");

      Then.onEnterCounterNumberPage.iShouldSeeEnterCounterNumberPage();
      Then.onEnterCounterNumberPage.iShouldSeeTable();

      When.onEnterCounterNumberPage.iTypeInCurrentCounterNumberInRow(0, "1");

      Then.onEnterCounterNumberPage.iShouldSeeInDifferenceWithPrevMonthOfRow(0, "1");

      Then.iTeardownMyAppFrame();
    });

    opaSkip("I should be able to save entered data in the Model", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("enterCounterNumberLink");

      Then.onEnterCounterNumberPage.iShouldSeeEnterCounterNumberPage();
      Then.onEnterCounterNumberPage.iShouldSeeYearPicker(2020);
      Then.onEnterCounterNumberPage.iShouldSeeMonthPicker(0);
      Then.onEnterCounterNumberPage.iShouldSeeTable();

      When.onEnterCounterNumberPage.iTypeInCurrentCounterNumberInRow(2, "2");
      When.onEnterCounterNumberPage.iPressButton("enterCounterNumberSaveButton");

      Then.onEnterCounterNumberPage.inTheModelShouldBeNextData(2, 2020, 0, 2, 6);

      Then.iTeardownMyAppFrame();
    });

    opaSkip("I should be able to come back to the Main page without saving entered data", function(Given, When, Then) {

      Given.iStartMyApp();

      When.onMainPage.iPressLink("enterCounterNumberLink");

      Then.onEnterCounterNumberPage.iShouldSeeEnterCounterNumberPage();
      Then.onEnterCounterNumberPage.iShouldSeeYearPicker(2020);
      Then.onEnterCounterNumberPage.iShouldSeeMonthPicker(0);
      Then.onEnterCounterNumberPage.iShouldSeeTable();

      When.onEnterCounterNumberPage.iSetNewYear(2021);
      When.onEnterCounterNumberPage.iSetNewMonth(1);
      When.onEnterCounterNumberPage.iTypeInCurrentCounterNumberInRow(0, "1");
      When.onEnterCounterNumberPage.iPressButton("backButton");

      Then.onMainPage.iShouldSeeMainPage();

      When.onMainPage.iPressLink("enterCounterNumberLink");

      Then.onEnterCounterNumberPage.iShouldSeeEnterCounterNumberPage();
      Then.onEnterCounterNumberPage.iShouldSeeYearPicker(2020);
      Then.onEnterCounterNumberPage.iShouldSeeMonthPicker(0);
      Then.onEnterCounterNumberPage.iShouldSeeTable();

      Then.iTeardownMyAppFrame();
    });
  });
