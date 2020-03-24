sap.ui.define([
  "UI5toLearn/controller/BaseController.controller",
  'sap/m/MessageToast',
  'sap/m/Dialog',
  'sap/m/ButtonType',
  'sap/ui/model/Filter'
], function (BaseController, MessageToast, Dialog, ButtonType, Filter) {
  "use strict";
  return BaseController.extend("UI5toLearn.controller.FundedSheet", {

    onInit: function () {
      var oController = BaseController;
      this.onRetrieveData(oController, "tenants");

      this.getView().byId("facetFilterTenant").setModel(this.getModel(),"Model");
      this.getView().byId("facetFilterCounter").setModel(this.getModel(),"Model");
      // this.getView().byId("facetFilter").setModel(this.getModel(),"Model");
    },

    onAfterRendering: function () {
      //sort data
      var oTable = this.getView().byId("tableFundedSheet");
      this.onSortTableData(oTable);
    },

    onOpenDialog: async function (oEvent) {
      var sParameter = oEvent.getParameter("id").split("-")[6];
      this.getView().byId("tableFundedSheet").setVisible(false);

      //update data in the Model
      var oController = BaseController;
      this.onRetrieveData(oController, "tenants");
      await new Promise(function(resolve){ setTimeout(resolve, 100) });
      var oData = this.getModel().getData().tenants;
      var that = this;

      var bundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
      var sDialogPlaceholder = "";
      if (sParameter == "oneCounterBtn") {
        sDialogPlaceholder = bundle.getText("fundedSheetPageCounterDialogPlaceholder");
      } else if (sParameter == "oneTenantBtn") {
        sDialogPlaceholder = bundle.getText("fundedSheetPageTenantDialogPlaceholder");
      }
      var sBeginButton = bundle.getText("fundedSheetPageBeginButton");
      var sEndButton = bundle.getText("fundedSheetPageEndButton");

      //create a dialog
      var dialog = new Dialog({
        title: 'Confirm',
        type: 'Message',
        content: [
          new sap.m.Input('submitDialogInput', {
            placeholder: sDialogPlaceholder,
            liveChange: function (oEvent) {
              var sText = oEvent.getParameter('value');
              var parent = oEvent.getSource().getParent();
              parent.getBeginButton().setEnabled(sText.length > 0);
            },
            width: '100%'
          })
        ],
        beginButton: new sap.m.Button({
          type: ButtonType.Emphasized,
          text: sBeginButton,
          enabled: false,
          press: function () {
            var sText = sap.ui.getCore().byId('submitDialogInput').getValue();
            var aChosenTenant = [];

            //check whether exists tenant with given parameter
            oData.forEach(tenant => {
              if (sParameter == "oneCounterBtn") {
                if (tenant.counter === sText) {
                  aChosenTenant.push(tenant);
                }
              } else if (sParameter == "oneTenantBtn") {
                if (tenant.name === sText) {
                  aChosenTenant.push(tenant);
                }
              }
            });

            //if does not exist, the message is shown, else onTableAllGivenTenantsShow() is called
            if (Object.entries(aChosenTenant).length == 0) {
              that.getView().byId("tableFundedSheet").setVisible(false);
              var sMessageDoesntExist = "";
              if (sParameter == "oneCounterBtn") {
                sMessageDoesntExist = bundle.getText("fundedSheetPageMessageCounterDoesntExist", [sText]);
              } else if (sParameter == "oneTenantBtn") {
                sMessageDoesntExist = bundle.getText("fundedSheetPageMessageTenantDoesntExist", [sText]);
              }
              MessageToast.show(sMessageDoesntExist);
            } else {
              that.onTableAllGivenTenantsShow(oEvent, aChosenTenant);
            }
            dialog.close();
          }
        }),
        endButton: new sap.m.Button({
          text: sEndButton,
          press: function () {
            dialog.close();
          }
        }),
        afterClose: function () {
          dialog.destroy();
        }
      });
      dialog.open();
    },

    handleConfirm: function (oEvent) {
      var aFacetFilter = [];
      aFacetFilter.push(this.getView().byId("facetFilterTenant"));
      aFacetFilter.push(this.getView().byId("facetFilterCounter"));

      var aFacetFilterLists = [];
      aFacetFilter.forEach(oFacetFilter => {
        oFacetFilter.getLists().filter(function(oList) {
          if (oList.getSelectedItems().length) {
            aFacetFilterLists.push(oList);
          }
        });
      })
      if (aFacetFilterLists.length) {
        var oFilter = new Filter(aFacetFilterLists.map(function(oList) {
          return new Filter(oList.getSelectedItems().map(function(oItem) {
            return new Filter(oList.getTitle(), "EQ", oItem.getText());
          }), false);
        }), true);
        this.getView().byId("tableFundedSheet").getBinding("items").filter(oFilter);
      }
    },

    onInputChange: function (oEvent) {

      //enable buttons
      // this.getView().byId("oneCounterBtn").setEnabled(true);
      // this.getView().byId("oneTenantBtn").setEnabled(true);
      this.getView().byId("allTenantsBtn").setEnabled(true);
    },

    onCheckEnter: function (nYear, nStartMonth, nEndMonth) {
      var bundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
      var bEnabled = false;
      if (!nYear) {
        MessageToast.show(bundle.getText("fundedSheetPageCheckEnterMessage1"));
      } else if (nYear < 2019 || nYear > 2025) {
        MessageToast.show(bundle.getText("fundedSheetPageCheckEnterMessage2"));
      } else if (!nStartMonth && !nEndMonth) {
        bEnabled = true;
      } else if (!nStartMonth && nEndMonth) {
        MessageToast.show(bundle.getText("fundedSheetPageCheckEnterMessage3"));
      } else if (nStartMonth && !nEndMonth) {
        MessageToast.show(bundle.getText("fundedSheetPageCheckEnterMessage4"));
      } else if (nStartMonth < 1) {
        MessageToast.show(bundle.getText("fundedSheetPageCheckEnterMessage5"));
      } else if (nEndMonth > 12) {
        MessageToast.show(bundle.getText("fundedSheetPageCheckEnterMessage6"));
      } else if (nStartMonth > nEndMonth) {
        MessageToast.show(bundle.getText("fundedSheetPageCheckEnterMessage7"));
      } else {
        bEnabled = true;
      }

      //in case entered data is valid, buttons will be enabled
      if (!bEnabled) {
        // this.getView().byId("oneCounterBtn").setEnabled(false);
        // this.getView().byId("oneTenantBtn").setEnabled(false);
        this.getView().byId("allTenantsBtn").setEnabled(false);
        return false;
      } else {
        // this.getView().byId("oneCounterBtn").setEnabled(true);
        // this.getView().byId("oneTenantBtn").setEnabled(true);
        this.getView().byId("allTenantsBtn").setEnabled(true);
        return true;
      }
    },

    onCreateDataForOneCounter: function(tenant, aAllCountNumbs, aAllDifferences, oSelectedCountNumbs, nYear, nStartMonth, nEndMonth) {
      var that = this;

      //if there is a data passing to given criteria
      if (aAllCountNumbs !== undefined && aAllCountNumbs !== null && Object.entries(aAllCountNumbs).length !== 0) {

        //create oData and pass it to the oSelectedCountNumbs
        var oData = {
          "room": tenant.room,
          "name": tenant.name,
          "counter": tenant.counter,
          "coefficient": tenant.coefficient,
          "counterNumbers": {},
          "differences": {}
        };
        oSelectedCountNumbs.tenants.push(oData);
        oSelectedCountNumbs.tenants[0].counterNumbers[nYear] = {};
        oSelectedCountNumbs.tenants[0].differences[nYear] = {};

        //for each month, if there is data for the month,
        // add it to the oSelectedCountNumbs and add the appropriate column to the table
        for (var i = nStartMonth; i <= nEndMonth; i++) {
          if (aAllCountNumbs[i] !== undefined) {
            var oData2 = {
              "counterNumber": aAllCountNumbs[i].counterNumber
            };
            oSelectedCountNumbs.tenants[0].counterNumbers[nYear][i] = oData2;
            var oData3 = {
              "difference": aAllDifferences[i].difference
            };
            oSelectedCountNumbs.tenants[0].differences[nYear][i] = oData3;

            that.onAddColumn(i, nYear);
          }
        }
      }
      return oSelectedCountNumbs;
    },

    onCreateDataForAllCounters: function (tenant, aAllCountNumbs, aAllDifferences, oSelectedCountNumbs, nYear, nStartMonth, nEndMonth, nIndex) {
      var that = this;

      //if there is a data passing to given criteria
      if (aAllCountNumbs !== undefined && aAllCountNumbs !== null && Object.entries(aAllCountNumbs).length !== 0) {

        //create oData and pass it to the oSelectedCountNumbs
        var oData = {
          "room": tenant.room,
          "name": tenant.name,
          "counter": tenant.counter,
          "coefficient": tenant.coefficient,
          "counterNumbers": {},
          "differences": {}
        };
        oSelectedCountNumbs.tenants[nIndex] = oData;
        oSelectedCountNumbs.tenants[nIndex].counterNumbers[nYear] = {};
        oSelectedCountNumbs.tenants[nIndex].differences[nYear] = {};

        //for each month, if there is data for the month, add it to the oSelectedCountNumbs and add the appropriate column to the table
        for (var i = nStartMonth; i <= nEndMonth; i++) {
          if (aAllCountNumbs[i] !== undefined) {
            var oData2 = {
              "counterNumber": aAllCountNumbs[i].counterNumber
            };
            oSelectedCountNumbs.tenants[nIndex].counterNumbers[nYear][i] = oData2;
            var oData3 = {
              "difference": aAllDifferences[i].difference
            };
            oSelectedCountNumbs.tenants[nIndex].differences[nYear][i] = oData3;

            that.onAddColumn(i, nYear);
          }
        }
        nIndex++;
      }
      return [oSelectedCountNumbs, nIndex];
    },

    onRemoveColumns: function() {

      //remove aggregation column
      while (this.getView().byId("tableFundedSheet").getColumns().length != 4) {
        this.getView().byId("tableFundedSheet").removeColumn(4);
      }

      //remove cell from the item binding template
      while (this.getView().byId("tableFundedSheet").getBindingInfo("items").template.getCells().length != 4) {
        this.getView().byId("tableFundedSheet").getBindingInfo("items").template.removeCell(4);
      }
    },

    onSetSelectedDataToTable: function(oSelectedCountNumbs) {
      var bundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
      var sSetSelectedDataMessage = bundle.getText("fundedSheetPageSetSelectedDataMessage");

      if (Object.entries(oSelectedCountNumbs.tenants).length === 0) {
        MessageToast.show(sSetSelectedDataMessage);
      } else {
        //set data to the model of the table
        var oTable = this.getView().byId("tableFundedSheet");
        oTable.getModel("Model").setData(oSelectedCountNumbs);

        //show the table
        this.onAfterRendering();
        this.getView().byId("tableFundedSheet").setVisible(true);
      }
    },

    onTableAllGivenTenantsShow: async function (oEvent, aTenants) {
      this.getView().byId("tableFundedSheet").setVisible(false);

      //update data in the Model
      var oController = BaseController;
      this.onRetrieveData(oController, "tenants");
      await new Promise(function(resolve){ setTimeout(resolve, 100) });
      this.onRemoveColumns();

      //get year, start and end months. Check whether they are valid
      var nYear = parseInt(this.getView().byId("year").getValue());
      var nStartMonth = parseInt(this.getView().byId("monthStart").getValue());
      var nEndMonth = parseInt(this.getView().byId("monthEnd").getValue());
      if (this.onCheckEnter(nYear, nStartMonth, nEndMonth)) {
        var that = this;
        if (aTenants == undefined) {
          var aDataFromModel = this.getModel().getData().tenants;
        } else {
          var aDataFromModel = aTenants;
        }
        var oSelectedCountNumbs = {
          "tenants": []
        };

        //for each tenant
        //in case start and end months were given, select data passing to given time slot
        //otherwise select data of the whole given year
        var nIndex = 0;
        if (aDataFromModel instanceof Array) {
          aDataFromModel.forEach(tenant => {
            if (nStartMonth && nEndMonth) {
              var aAllCountNumbs = [];
              var aAllDifferences = [];
              for (var i = nStartMonth; i <= nEndMonth; i++) {
                if (tenant.counterNumbers[nYear][i] != undefined) {
                  aAllCountNumbs[i] = tenant.counterNumbers[nYear][i];
                  aAllDifferences[i] = tenant.differences[nYear][i];
                }
              }
              var aResult = that.onCreateDataForAllCounters(tenant, aAllCountNumbs, aAllDifferences, oSelectedCountNumbs, nYear, nStartMonth, nEndMonth, nIndex);
              oSelectedCountNumbs = aResult[0];
              nIndex = aResult[1];
            } else {
              var aAllCountNumbs = tenant.counterNumbers[nYear];
              var aAllDifferences = tenant.differences[nYear];
              var aResult = that.onCreateDataForAllCounters(tenant, aAllCountNumbs, aAllDifferences, oSelectedCountNumbs, nYear, 1, 12, nIndex);
              oSelectedCountNumbs = aResult[0];
              nIndex = aResult[1];
            }
          });
        }

        //set data to the table
        this.onSetSelectedDataToTable(oSelectedCountNumbs);
      }
    },

    onAddColumn: function (month, year) {

      //get all columns and check whether the column with given month exists
      var aColumns = this.getView().byId("tableFundedSheet").getAggregation("columns");
      var bExists = false;
      aColumns.forEach(column => {
        if (column.getAggregation("header").getText() === month.toString()) {
          bExists = true;
        }
      });

      //if does not exist,
      // create and add the column of counterNumber and the column of difference with previous month
      if (!bExists) {
        var oColumn1 = new sap.m.Column({
          header: new sap.m.Text({text: month}),
          width: "100px"
        });
        oColumn1.setStyleClass("customTableHeaderText");
        this.getView().byId("tableFundedSheet").addColumn(oColumn1);

        var bundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        var sColumnText = bundle.getText("fundedSheetPageAddColumnText");
        var oColumn2 = new sap.m.Column({
          header: new sap.m.Text({text: sColumnText}),
          width: "100px",
          styleClass: "customTableHeaderText"
        });
        this.getView().byId("tableFundedSheet").addColumn(oColumn2);

        //create and add the cells with appropriate data
        var sPath1 = '{Model>counterNumbers/' + year + '/' + month + '/counterNumber}';
        var oCell1 = new sap.m.Text({text: sPath1});
        var sPath2 = '{Model>differences/' + year + '/' + month + '/difference}';
        var oCell2 = new sap.m.Text({text: sPath2});
        var oTemplate = this.getView().byId("tableFundedSheet").getBindingInfo("items").template;
        oTemplate.addCell(oCell1);
        oTemplate.addCell(oCell2);

        //update table binding
        this.getView().byId("tableFundedSheet").unbindItems();
        this.getView().byId("tableFundedSheet").bindItems({
          path: "Model>/tenants",
          template: oTemplate
        });
      }
    },

    onNavBackWithoutSaving: function (oEvent) {

      //clear input fields
      this.getView().byId("year").setValue(null);
      this.getView().byId("monthStart").setValue(null);
      this.getView().byId("monthEnd").setValue(null);

      //hide the table
      this.getView().byId("tableFundedSheet").setVisible(false);

      //navigate to the Main page
      this.getRouter().navTo("main");
    }
  });
});
