sap.ui.require([
    'sap/ui/test/Opa5',
    'test/opa/base/Common',
    "sap/ui/test/actions/EnterText",
    "sap/ui/test/actions/Press"
  ],
  function (Opa5, Common, EnterText, Press) {

    Opa5.createPageObjects({
      onFundedSheetPage: {
        baseClass: Common,
        actions: {
          iTypeInInput: function (id, value) {
            return this.waitFor({
              id : "main-component---fundedSheet--" + id,
              success : (oInput) => {
                oInput.setValue(value);
              },
              errorMessage : "Did not find the " + id + " input"
            });
          },
          iPressButton: function (id) {
            return this.waitFor({
              timeout: 30,
              id : "main-component---fundedSheet--" + id,
              success: (oButton) => {
                oButton.firePress();
              },
              errorMessage : "Did not find the button"
            });
          },
          iClickOnFacetFilter: function (id) {
            return this.waitFor({
              controlType: "sap.m.FacetFilter",
              id: "main-component---fundedSheet--" + id,
              success: function (oFacetFilter) {
                oFacetFilter.getAggregation("buttons")[0].firePress();
              },
              errorMessage: "Did not find the oFacetFilter " + id
            });
          },
          iSelectItemInFilter: function (id, aItemTexts) {
            return this.waitFor({
              controlType: "sap.m.FacetFilter",
              id : "main-component---fundedSheet--" + id,
              success: function (oFacetFilter) {
                var aItems = oFacetFilter.getAggregation("lists")[0].getAggregation("items");
                var aItemKeys = {};
                aItemTexts.forEach(text => {
                  aItems.forEach(item => {
                    if (item.getProperty("text") === text) {
                      var sKey = item.getKey();
                      aItemKeys[sKey] = text;
                    }
                  });
                });
                oFacetFilter.getAggregation("lists")[0].setSelectedKeys(aItemKeys);
              },
              errorMessage : "Did not find the" + id + " facetFilter"
            });
          },
          iPressOnTheScreen: function () {
            return this.waitFor({
              controlType: "sap.m.Table",
              id: "main-component---fundedSheet--tableFundedSheet",
              actions: new Press(),
              errorMessage: "Did not press on screen"
            });
          }
        },


        assertions: {
          iShouldSeeFundedSheetPage: function () {
            return this.waitFor({
              timeout: 30,
              controlType: "sap.tnt.ToolPage",
              id: "main-component---fundedSheet--fundedSheet",
              success: function (oControl) {
                Opa5.assert.ok(oControl, "Funded Sheet page is found");
              },
              errorMessage: "Did not find Funded Sheet page"
            });
          },
          iShouldSeeTheMessage: function () {
            return this.waitFor({
              check : function () {
                return sap.ui.test.Opa5.getJQuery()(".sapMMessageToast").length > 0;
              },
              success : function () {
                Opa5.assert.ok(true, "Found a Message Toast");
              },
              errorMessage : "No Message Toast message is found!"
            });
          },
          iShouldSeeTable: function () {
            return this.waitFor({
              controlType: "sap.m.Table",
              id: "main-component---fundedSheet--tableFundedSheet",
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
          iShouldSeeTableWithAmountOfColumns: function (amountOfColumns) {
            return this.waitFor({
              controlType: "sap.m.Table",
              id: "main-component---fundedSheet--tableFundedSheet",
              check: (oTable) => {
                var aColumns = oTable.getColumns();
                if (aColumns.length == amountOfColumns) {
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
          iShouldSeeTableWithTenantNames: function (aTenantNames) {
            return this.waitFor({
              controlType: "sap.m.Table",
              id: "main-component---fundedSheet--tableFundedSheet",
              check: (oTable) => {
                var oItems = oTable.getAggregation("items");
                var aTenantNamesInTable = [];
                oItems.forEach(item => {
                  aTenantNamesInTable.push(item.getAggregation("cells")[1].getProperty("text"));
                });
                if (aTenantNamesInTable.sort == aTenantNames.sort) {
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
          iShouldSeeTableWithCounters: function (aCounters) {
            return this.waitFor({
              controlType: "sap.m.Table",
              id: "main-component---fundedSheet--tableFundedSheet",
              check: (oTable) => {
                var oItems = oTable.getAggregation("items");
                var aCountersInTable = [];
                oItems.forEach(item => {
                  aCountersInTable.push(item.getAggregation("cells")[2].getProperty("text"));
                });
                if (aCountersInTable.sort == aCounters.sort) {
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
          iShouldSeeFacetFilterWithTitle: function (id, title) {
            return this.waitFor({
              controlType: "sap.m.FacetFilter",
              id: "main-component---fundedSheet--" + id,
              check: function (oFacetFilter) {
                var sButtonText = oFacetFilter.getAggregation("buttons")[0].getProperty("text");
                if (sButtonText === title) { return true; } else { return false; }
              },
              success: () => {
                Opa5.assert.ok(true, "The title is shown correctly");
              },
              // matchers: [
              //   new sap.ui.test.matchers.Properties({
              //     text: new RegExp(text + "[a-zA-Z0-9() -_]*")
              //   })
              // ],
              errorMessage : "Did not find the button"
            });
          }
        }
      }
    });
  });
