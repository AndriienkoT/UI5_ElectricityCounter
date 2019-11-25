sap.ui.define([
  "UI5toLearn/controller/BaseController"
], function (BaseController) {
  "use strict";
  return BaseController.extend("UI5toLearn.controller.EnterCounterNumber", {
    onInit: function () {
      // this.getStorage().clear();
      // console.log(this.getModel());
      // console.log(this.getStorage().get("myLocalData"));

      this.onUpdateData();
      this.getView().byId("tableEnterCounterNumber").setModel(this.getModel(), "Model");


      // var oObjects = this.getModel().getData();
      // for (var key in oObjects) {
      //   if (oObjects.hasOwnProperty(key)) {
      //     var oObject = oObjects[key];
      //     var oRecord = {name: oObject.name, counter: oObject.counter};
      //
      //     var oTransaction = oController.myDB.transaction(["tenants"], "readwrite");
      //     var oDataStore = oTransaction.objectStore("tenants");
      //     oDataStore.add(oRecord);
      //   }
      // }
      //
      // var objectStore = oController.myDB.transaction("tenants").objectStore("tenants");
      // var items = [];
      // objectStore.openCursor().onsuccess = function(event) {
      //   var cursor = event.target.result;
      //   if (cursor) {
      //     items.push(cursor.value);
      //     cursor.continue();
      //   } else {
      //     console.log("Done Processing");
      //     // Logic to bind the obtained data in “items” array to your UI control
      //   }
      // }
      // console.log(items);


      //sort data
      var oTable = this.getView().byId("tableEnterCounterNumber");
      this.onSortData(oTable);

      //set current year and month as selected
      var nMonth = new Date().getMonth();
      var nYear = new Date().getYear();
      this.getView().byId("MP").setMonth(nMonth);
      this.getView().byId("YP").setYear(nYear - 100 + 2000);
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
        // if (nYear < 2019) {
        //   oPrevMonth = "";
        // } else {
          oPrevMonth = this.getView().byId("tableEnterCounterNumber").getBinding("items").oList[nItemIdInModel].counterNumbers[nYear][nMonth];
        // }
      }
      var nPrevCountNumb = oPrevMonth.counterNumber;

      var nCoeffic = this.getView().byId("tableEnterCounterNumber").getBinding("items").oList[nItemIdInModel].coefficient;

      //calculate the difference with previous month and set it to the text field
      var nDifferenceWithPreviousMonth = (nCurrentCounterNumber - nPrevCountNumb) * nCoeffic;

      if (nDifferenceWithPreviousMonth >= 0) {
        this.getView().byId("tableEnterCounterNumber").getAggregation("items")[sItemIdInTable].getAggregation("cells")[6].removeStyleClass("inputError");
        this.getView().byId("tableEnterCounterNumber").getAggregation("items")[sItemIdInTable].getAggregation("cells")[7].setText(nDifferenceWithPreviousMonth);
      } else {
        this.getView().byId("tableEnterCounterNumber").getAggregation("items")[sItemIdInTable].getAggregation("cells")[6].addStyleClass("inputError");
        this.getView().byId("tableEnterCounterNumber").getAggregation("items")[sItemIdInTable].getAggregation("cells")[7].setText(null);
      }
    },

    onSaveCounterNumbers: function (oEvent) {
      //get selected year and month
      var sMonth = parseInt(this.getView().byId("MP").getProperty("month")) + 1;
      var sYear = this.getView().byId("YP").getProperty("year");

      //for each tenant get value from the input field and set it to the Model
      var aItems = this.getView().byId("tableEnterCounterNumber").getAggregation("items");
      var aIndexes = this.getView().byId("tableEnterCounterNumber").getBindingInfo("items").binding.aIndices;
      for (var itemIndex = 0; itemIndex < aItems.length; itemIndex++) {
        //get id of current tenant in the Model
        var nItemIdInModel = aIndexes[itemIndex];

        var sCountNumb = aItems[itemIndex].getAggregation("cells")[6].getValue();
        var sDifference = aItems[itemIndex].getAggregation("cells")[7].getText();
        if (sCountNumb){
          var oData1 = {
            counterNumber : sCountNumb
          };
          var oData2 = {
            difference : sDifference
          };
          var sPath1 = "/tenants/" + nItemIdInModel + "/counterNumbers/" + sYear + "/" + sMonth + "/";
          var sPath2 = "/tenants/" + nItemIdInModel + "/differences/" + sYear + "/" + sMonth + "/";
          this.getModel().setProperty(sPath1, oData1);
          this.getModel().setProperty(sPath2, oData2);
        }

        //clear the input field and the text field
        aItems[itemIndex].getAggregation("cells")[6].setValue(null);
        aItems[itemIndex].getAggregation("cells")[7].setText(null);
      }

      //set data to the Storage
      this.getStorage().put('myLocalData', this.getModel().getData());

      //navigate to the Main page
      this.getRouter().navTo("main");
    },

    onNavBackWithoutSaving: function (oEvent) {
      //clear the input field and the text field
      var aItems = this.getView().byId("tableEnterCounterNumber").getAggregation("items");
      for (var itemIndex = 0; itemIndex < aItems.length; itemIndex++) {
        aItems[itemIndex].getAggregation("cells")[6].setValue(null);
        aItems[itemIndex].getAggregation("cells")[7].setText(null);
      }

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
