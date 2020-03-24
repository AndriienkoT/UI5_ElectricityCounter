sap.ui.define([
  "UI5toLearn/controller/BaseController.controller"
], function (BaseController) {
  "use strict";
  return BaseController.extend("UI5toLearn.controller.EnterCounterNumber", {
    onInit: function () {
      var oController = BaseController;
      this.onRetrieveData(oController, "tenants");

      //set current year and month as selected
      var nMonth = new Date().getMonth();
      var nYear = new Date().getYear();
      this.getView().byId("MP").setMonth(nMonth);
      this.getView().byId("YP").setYear(nYear - 100 + 2000);
    },

    onAfterRendering: function () {
      var aItems = this.getView().byId("tableEnterCounterNumber").getAggregation("items");
      var bError = false;
      aItems.forEach(item => {
        if(item.getAggregation("cells")[4].hasStyleClass("inputError")) { bError = true; }
      });
      if(bError) {
        this.getView().byId("enterCounterNumberSaveButton").setEnabled(false);
      } else {
        this.getView().byId("enterCounterNumberSaveButton").setEnabled(true);
      }

      //sort data
      var oTable = this.getView().byId("tableEnterCounterNumber");
      this.onSortTableData(oTable);
    },

    onEnterCounterNumber: function (oEvent) {
      //get entered value from the input field
      var nCurrentCounterNumber = oEvent.getParameter("value");

      //get id of current tenant in the Table
      var sItemIdInTable = oEvent.getParameter("id").split("-")[8];

      //get id of current tenant in the Model
      var aIndexes = this.getView().byId("tableEnterCounterNumber").getBindingInfo("items").binding.aIndices;
      var nItemIdInModel = aIndexes[sItemIdInTable];

      //get selected year and month
      var nMonth = parseInt(this.getView().byId("MP").getProperty("month")) + 1;
      var nYear = parseInt(this.getView().byId("YP").getProperty("year"));

      //get previous month. In case it is undefined, go to previous one
      var oPrevMonth;
      while (oPrevMonth == undefined) {
        if (nMonth > 0) {
          nMonth--;
        } else {
          nMonth = 12;
          nYear--;
        }
        oPrevMonth = this.getView().byId("tableEnterCounterNumber").getBinding("items").oList[nItemIdInModel].counterNumbers[nYear][nMonth];
      }

      //calculate the difference with previous month and set it to the text field
      var nPrevCountNumb = oPrevMonth.counterNumber;
      var nCoeffic = this.getView().byId("tableEnterCounterNumber").getBinding("items").oList[nItemIdInModel].coefficient;
      var nDifferenceWithPreviousMonth = (nCurrentCounterNumber - nPrevCountNumb) * nCoeffic;

      if (nDifferenceWithPreviousMonth >= 0) {
        this.getView().byId("tableEnterCounterNumber").getAggregation("items")[sItemIdInTable].getAggregation("cells")[4].removeStyleClass("inputError");
        this.getView().byId("tableEnterCounterNumber").getAggregation("items")[sItemIdInTable].getAggregation("cells")[5].setText(nDifferenceWithPreviousMonth);
      } else {
        this.getView().byId("tableEnterCounterNumber").getAggregation("items")[sItemIdInTable].getAggregation("cells")[4].addStyleClass("inputError");
        this.getView().byId("tableEnterCounterNumber").getAggregation("items")[sItemIdInTable].getAggregation("cells")[5].setText(null);
      }
      this.onAfterRendering();
    },

    onSaveCounterNumbers: function (oEvent) {
      //get selected year and month
      var nMonth = parseInt(this.getView().byId("MP").getProperty("month")) + 1;
      var nYear = parseInt(this.getView().byId("YP").getProperty("year"));

      //for each tenant get value from the input field and set it to the Model
      var aItems = this.getView().byId("tableEnterCounterNumber").getAggregation("items");
      var aIndexes = this.getView().byId("tableEnterCounterNumber").getBindingInfo("items").binding.aIndices;
      var nItemIndex = 0;
      aItems.forEach(item => {
        //get id of current tenant in the Model
        var nItemIdInModel = aIndexes[nItemIndex];

        var sCountNumb = item.getAggregation("cells")[4].getValue();
        var sDifference = item.getAggregation("cells")[5].getText();
        if (sCountNumb){
          var oData1 = {
            counterNumber : sCountNumb
          };
          var oData2 = {
            difference : sDifference
          };

          //update data in the Model
          var sPath1 = "/tenants/" + nItemIdInModel + "/counterNumbers/" + nYear + "/" + nMonth + "/";
          var sPath2 = "/tenants/" + nItemIdInModel + "/differences/" + nYear + "/" + nMonth + "/";
          this.getModel().setProperty(sPath1, oData1);
          this.getModel().setProperty(sPath2, oData2);

          //update data in the IDB
          var sCounter = this.getModel().getData().tenants[nItemIdInModel].counter;
          var oController = BaseController;
          this.onUpdateCounterNumberOfOneTenant(oController, sCounter, nYear, nMonth, oData1, oData2);

          ///////if there is a counter number of next month, change the difference with the counter number of the current month
          //get next month
          var nNextMonth = nMonth;
          var nNextYear = nYear;
          var oNextMonth;
          if (nNextMonth < 12) {
            nNextMonth++;
          } else {
            nNextMonth = 1;
            nNextYear++;
          }
          //calculate the difference of the next month with the current month
          oNextMonth = this.getModel().getData().tenants[nItemIdInModel].counterNumbers[nNextYear][nNextMonth];
          if (oNextMonth) {
            var nNextCountNumb = oNextMonth.counterNumber;
            var nCoeffic = this.getModel().getData().tenants[nItemIdInModel].coefficient;
            var nDifferenceNextWithCurrentMonth = (nNextCountNumb - sCountNumb) * nCoeffic;

            var oData3 = {
              difference : nDifferenceNextWithCurrentMonth
            };
            var sPath3 = "/tenants/" + nItemIdInModel + "/differences/" + nNextYear + "/" + nNextMonth + "/";
            this.getModel().setProperty(sPath3, oData3);
            this.onUpdateCounterNumberOfOneTenant(oController, sCounter, nNextYear, nNextMonth, null, oData3);
          }
        }

        //clear the input field and the text field
        item.getAggregation("cells")[4].setValue(null);
        item.getAggregation("cells")[5].setText(null);

        nItemIndex++;
      });

      //navigate to the Main page
      this.getRouter().navTo("main");
    },

    onNavBackWithoutSaving: function (oEvent) {
      //clear the input field and the text field
      var aItems = this.getView().byId("tableEnterCounterNumber").getAggregation("items");
      aItems.forEach(item => {
        item.getAggregation("cells")[4].setValue(null);
        item.getAggregation("cells")[5].setText(null);
      });

      //set current year and month as selected
      var nMonth = new Date().getMonth();
      var nYear = new Date().getYear();
      this.getView().byId("MP").setMonth(nMonth);
      this.getView().byId("YP").setYear(nYear - 100 + 2000);

      //navigate to the Main page
      this.getRouter().navTo("main");
    }
  });
});
