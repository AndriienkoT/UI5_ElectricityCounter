sap.ui.require([
    'sap/ui/test/Opa5',
    'test/opa/base/Common',
    "sap/ui/test/actions/EnterText"
  ],
  function (Opa5, Common, EnterText) {

    Opa5.createPageObjects({
      onEnterCounterNumberPage: {
        baseClass: Common,
        actions: {
          iSetNewYear: function (value) {
            return this.waitFor({
              id: "main-component---enterCounterNumber--YP",
              success: (oYearPicker) => {
                oYearPicker.setProperty("year", value);
              },
              errorMessage: "Did not set new value"
            });
          },
          iSetNewMonth: function (value) {
            return this.waitFor({
              id: "main-component---enterCounterNumber--MP",
              success: (oMonthPicker) => {
                oMonthPicker.setProperty("month", value);
              },
              errorMessage: "Did not set new value"
            });
          },
          iTypeInCurrentCounterNumberInRow: function (rowId, text) {
            var regexID = new RegExp("[a-z0-9__]+-main-component---enterCounterNumber--tableEnterCounterNumber-" + rowId);
            return this.waitFor({
              controlType: "sap.m.Input",
              id: regexID,
              actions: new EnterText({ text: text }),
              errorMessage: "Did not find the input in row #" + rowId
            });
          },
          iPressButton: function (id) {
            return this.waitFor({
              timeout: 30,
              id : "main-component---enterCounterNumber--" + id,
              success: (control) => {
                control.firePress();
              },
              errorMessage : "Did not find the button"
            });
          }
        },


        assertions: {
          iShouldSeeEnterCounterNumberPage: function () {
            return this.waitFor({
              timeout: 30,
              controlType: "sap.tnt.ToolPage",
              id: "main-component---enterCounterNumber--enterCounterNumber",
              success: function (oControl) {
                Opa5.assert.ok(oControl, "Enter Counter Number page is found");
              },
              errorMessage: "Did not find Enter Counter Number page"
            });
          },
          iShouldSeeYearPicker: function (year) {
            return this.waitFor({
              controlType: "sap.ui.unified.calendar.YearPicker",
              matchers: [
                new sap.ui.test.matchers.PropertyStrictEquals({name: "year", value: year}),
                new sap.ui.test.matchers.PropertyStrictEquals({
                  name: "id",
                  value: 'main-component---enterCounterNumber--YP'
                })
              ],
              success: (aControls) => {
                Opa5.assert.ok(aControls.length > 0, "YearPicker with right selected year is found");
              },
              errorMessage: "YearPicker with right selected year is not found"
            });
          },
          iShouldSeeMonthPicker: function (month) {
            return this.waitFor({
              controlType: "sap.ui.unified.calendar.MonthPicker",
              matchers: [
                new sap.ui.test.matchers.PropertyStrictEquals({name: "month", value: month}),
                new sap.ui.test.matchers.PropertyStrictEquals({
                  name: "id",
                  value: 'main-component---enterCounterNumber--MP'
                })
              ],
              success: (aControls) => {
                Opa5.assert.ok(aControls.length > 0, "MonthPicker with right selected year is found");
              },
              errorMessage: "MonthPicker with right selected year is not found"
            });
          },
          iShouldSeeTable: function () {
            return this.waitFor({
              controlType: "sap.m.Table",
              id: "main-component---enterCounterNumber--tableEnterCounterNumber",
              check: (oTable) => {
                var oModelData = oTable.getParent().getParent().getModel("Model").getData().tenants;
                var oTableData = oTable.getBinding("items").oList;
                if (oModelData.toString() == oTableData.toString()) {
                  return true;
                } else {
                  return false;
                }
              },
              success: (aControls) => {
                Opa5.assert.ok(true, "The table data is shown correctly");
              },
              errorMessage: "The table data is not shown correctly"
            });
          },
          iShouldSeeInDifferenceWithPrevMonthOfRow: function (rowId, text) {
            return this.waitFor({
              controlType: "sap.m.Text",
              matchers: [
                new sap.ui.test.matchers.PropertyStrictEquals({name: "text", value: text}),
                new sap.ui.test.matchers.PropertyStrictEquals({
                  name: "id",
                  value: "main-component---enterCounterNumber--difference-main-component---enterCounterNumber--tableEnterCounterNumber-" + rowId
                })
              ],
              success: (aControls) => {
                Opa5.assert.ok(aControls.length > 0, "Text is found");
              },
              errorMessage: "Did not find the the text in row #" + rowId
            });
          },
          inTheModelShouldBeNextData: function(tenantId, year, month, counterNumber, difference) {
            return this.waitFor({
              controlType: "sap.tnt.ToolPage",
              id: "main-component---enterCounterNumber--enterCounterNumber",
              check: (oView) => {
                var aTenants = oView.getModel("Model").getProperty('/tenants');
                var sCounterNumberInModel = aTenants[tenantId].counterNumbers[year][month + 1].counterNumber;
                var sDifferenceInModel = aTenants[tenantId].differences[year][month + 1].difference;
                if (sCounterNumberInModel == counterNumber && sDifferenceInModel == difference) { return true; } else { return false; }
              },
              success : function () {
                Opa5.assert.ok(true, "The data in the Model is correct");
              },
              errorMessage : "The data in the Model is not correct"
            });
          }
        }
      }
    });
  });
