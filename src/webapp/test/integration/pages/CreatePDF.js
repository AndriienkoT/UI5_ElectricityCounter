sap.ui.require([
    'sap/ui/test/Opa5',
    'test/opa/base/Common'
  ],
  function (Opa5, Common) {

    Opa5.createPageObjects({
      onCreatePDFPage: {
        baseClass: Common,
        actions: {
          iSetNewYear: function (year) {
            this.waitFor({
              controlType: "sap.ui.unified.calendar.YearPicker",
              id: "main-component---createPDF--createPDFYP",
              actions: function (oYP) {
                oYP.setProperty("year", year);
              },
              errorMessage: "Did not set new year"
            });
            return this.waitFor({
              controlType: "sap.ui.unified.calendar.YearPicker",
              id: "main-component---createPDF--createPDFYP",
              success : function (oControl) {
                oControl.fireSelect();
              },
              errorMessage: "Did not select new year"
            });
          },
          iSetNewMonth: function (monthId) {
            this.waitFor({
              controlType: "sap.ui.unified.calendar.MonthPicker",
              id: "main-component---createPDF--createPDFMP",
              actions: function (oMP) {
                oMP.setProperty("month", monthId);
              },
              errorMessage: "Did not set new month"
            });
            return this.waitFor({
              controlType: "sap.ui.unified.calendar.MonthPicker",
              id: "main-component---createPDF--createPDFMP",
              success : function (oControl) {
                oControl.fireSelect();
              },
              errorMessage: "Did not select new month"
            });
          },
          iPressButton: function (id) {
            return this.waitFor({
              timeout: 30,
              id : "main-component---createPDF--" + id,
              success: (control) => {
                control.firePress();
              },
              errorMessage : "Did not find the button"
            });
          }
        },


        assertions: {
          iShouldSeeCreatePDFPage: function () {
            return this.waitFor({
              timeout: 30,
              controlType: "sap.tnt.ToolPage",
              id: "main-component---createPDF--createPDF",
              success: function (oControl) {
                Opa5.assert.ok(oControl, "Create PDF page is found");
              },
              errorMessage: "Did not find Create PDF page"
            });
          },
          iShouldSeeYearPicker: function (year) {
            return this.waitFor({
              controlType: "sap.ui.unified.calendar.YearPicker",
              matchers: [
                new sap.ui.test.matchers.PropertyStrictEquals({name: "year", value: year}),
                new sap.ui.test.matchers.PropertyStrictEquals({
                  name: "id",
                  value: 'main-component---createPDF--createPDFYP'
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
                  value: 'main-component---createPDF--createPDFMP'
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
              id: "main-component---createPDF--tableCreatePDF",
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
          iShouldSeeNoCounterNumberOfPrevMonthOfRow: function (rowId) {
            var regexID = new RegExp("[a-z0-9__]+-main-component---createPDF--tableCreatePDF-" + rowId);
            return this.waitFor({
              controlType: "sap.m.Text",
              id: regexID,
              matchers: [
                new sap.ui.test.matchers.PropertyStrictEquals({name: "text", value: ""})
              ],
              success: (aControls) => {
                Opa5.assert.ok(aControls.length > 0, "No text is found");
              },
              errorMessage: "There is a text in row #" + rowId
            });
          },
          iShouldSeeCounterNumberOfPrevMonthOfRow: function (rowId, text) {
            var regexID = new RegExp("[a-z0-9__]+-main-component---createPDF--tableCreatePDF-" + rowId);
            return this.waitFor({
              controlType: "sap.m.Text",
              id: regexID,
              matchers: [
                new sap.ui.test.matchers.PropertyStrictEquals({name: "text", value: text})
              ],
              success: (aControls) => {
                Opa5.assert.ok(aControls.length > 0, "Text is found");
              },
              errorMessage: "Did not find the the text in row #" + rowId
            });
          }
        }
      }
    });
  });
