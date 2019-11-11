sap.ui.define([
  "UI5toLearn/controller/BaseController",
  'sap/ui/model/Sorter'
], function (BaseController, Sorter) {
  "use strict";
  return BaseController.extend("UI5toLearn.controller.EnterCounterNumber", {
    onInit: function () {
      // this.getStorage().clear();
      // console.log(this.getModel());
      // console.log(this.getStorage().get("myLocalData"));

      //update data in the Model and in the table
      if (this.getStorage().get("myLocalData")) {
        var oDataFromStorage = this.getStorage().get("myLocalData");
        var oModel = new sap.ui.model.json.JSONModel(this.getModel());
        oModel.setData(oDataFromStorage);
        this.getView().setModel(oModel);
        this.getOwnerComponent().setModel(oModel, "Model");
      }
      this.getView().byId("tableEnterCounterNumber").setModel(oModel, "Model");


      //sort data
      var oTable = this.getView().byId("tableEnterCounterNumber"),
          oBinding = oTable.getBinding("items");
      var oSorter = new Sorter("housing", null);
      oSorter.fnCompare = function naturalSorter(as, bs){
        var a, b, a1, b1, i = 0, n, L,
            rx = /(\.\d+)|(\d+(\.\d+)?)|([^\d.]+)|(\.\D+)|(\.$)/g;
        if(as === bs) return 0;
        a = as.toLowerCase().match(rx);
        b = bs.toLowerCase().match(rx);
        L = a.length;
        while(i < L){
          if(!b[i]) return 1;
            a1 = a[i],
            b1 = b[i++];
          if(a1 !== b1){
            n = a1 - b1;
            if(!isNaN(n)) return n;
            return a1 > b1 ? 1 : -1;
          }
        }
        return b[i] ? -1 : 0;
      }
      oBinding.sort(oSorter);

      //set current year and month as selected
      var nMonth = new Date().getMonth();
      var nYear = new Date().getYear();
      this.getView().byId("MP").setMonth(nMonth);
      this.getView().byId("YP").setYear(nYear - 100 + 2000);
    },

    onEnterCounterNumber: function (oEvent) {
      //get entered value from the input field
      var nCurrentCounterNumber = oEvent.getParameter("value");

      //get id of current tenant
      var sItemId = oEvent.getParameter("id").split("-")[8];

      //get selected year and month
      var nMonth = parseInt(this.getView().byId("MP").getProperty("month"));
      var nYear = parseInt(this.getView().byId("YP").getProperty("year"));

      //get previous month. In case it is undefined, go to previous one
      var oPrevMonth;
      while (oPrevMonth == undefined) {
        if(nMonth >= 1) {
          nMonth--;
        } else {
          nMonth = 11;
          nYear--;
        }
        oPrevMonth = this.getView().byId("tableEnterCounterNumber").getBinding("items").oList[sItemId].counterNumbers[nYear][nMonth];
      }
      var nPrevCountNumb = oPrevMonth.counterNumber;

      //calculate the difference with previous month and set it to the text field
      var nDifferenceWithPreviousMonth = nCurrentCounterNumber - nPrevCountNumb;

      if (nDifferenceWithPreviousMonth >= 0) {
        this.getView().byId("tableEnterCounterNumber").getAggregation("items")[sItemId].getAggregation("cells")[5].removeStyleClass("inputError");
        this.getView().byId("tableEnterCounterNumber").getAggregation("items")[sItemId].getAggregation("cells")[6].setText(nDifferenceWithPreviousMonth);
      } else {
        this.getView().byId("tableEnterCounterNumber").getAggregation("items")[sItemId].getAggregation("cells")[5].addStyleClass("inputError");
        this.getView().byId("tableEnterCounterNumber").getAggregation("items")[sItemId].getAggregation("cells")[6].setText(null);
      }
    },

    onSaveCounterNumbers: function (oEvent) {
      //get selected year and month
      var sMonth = parseInt(this.getView().byId("MP").getProperty("month")) + 1;
      var sYear = this.getView().byId("YP").getProperty("year");

      //for each tenant get value from the input field and set it to the Model
      var aItems = this.getView().byId("tableEnterCounterNumber").getAggregation("items");
      for (var itemIndex = 0; itemIndex < aItems.length; itemIndex++) {
        var sCountNumb = aItems[itemIndex].getAggregation("cells")[5].getValue();
        if (sCountNumb){
          var oData = {
            counterNumber : sCountNumb
          };
          var sPath = "/tenants/" + itemIndex + "/counterNumbers/" + sYear + "/" + sMonth + "/";
          this.getModel().setProperty(sPath, oData);
        }

        //clear the input field and the text field
        aItems[itemIndex].getAggregation("cells")[5].setValue(null);
        aItems[itemIndex].getAggregation("cells")[6].setText(null);
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
        aItems[itemIndex].getAggregation("cells")[5].setValue(null);
        aItems[itemIndex].getAggregation("cells")[6].setText(null);
      }

      //navigate to the Main page
      this.getRouter().navTo("main");
    }
  });
});
