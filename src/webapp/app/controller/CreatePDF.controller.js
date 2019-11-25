sap.ui.define([
  "UI5toLearn/controller/BaseController"
], function (BaseController) {
  "use strict";
  return BaseController.extend("UI5toLearn.controller.CreatePDF", {
    onInit: function () {

      this.onUpdateData();

      //set current year and month as selected
      var nMonth = new Date().getMonth();
      var nYear = new Date().getYear();
      this.getView().byId("createPDFMP").setMonth(nMonth);
      this.getView().byId("createPDFYP").setYear(nYear - 100 + 2000);
    },

    onAfterRendering: function () {
      //remove not needed cells from the table
      while(this.getView().byId("tableCreatePDF").getBindingInfo("items").template.getCells().length != 6) {
        this.getView().byId("tableCreatePDF").getBindingInfo("items").template.removeCell(6);
      }

      //get previous month
      var nMonth = parseInt(this.getView().byId("createPDFMP").getProperty("month") + 1);
      var nYear = parseInt(this.getView().byId("createPDFYP").getProperty("year"));
      if (nMonth > 1) {
        nMonth--;
      } else {
        nMonth = 12;
        nYear--;
      }

      //create a cell of counter number of previous month
      var sPath = '{Model>counterNumbers/' + nYear + '/' + nMonth + '/counterNumber}';
      var oCell = new sap.m.Text({text : sPath});

      //set it to the table items template
      var oTemplate = this.getView().byId("tableCreatePDF").getBindingInfo("items").template;
      oTemplate.addCell(oCell);

      //bind items to the table
      this.getView().byId("tableCreatePDF").unbindItems();
      this.getView().byId("tableCreatePDF").bindItems({
        path: "Model>/tenants",
        template: oTemplate
      });

      //sort data
      var oTable = this.getView().byId("tableCreatePDF");
      this.onSortData(oTable);
    },

    onSetCountNumbPrevMonth: function (oEvent) {
      this.onAfterRendering();
    },

    onCreatePDF: function (oEvent) {
      //get data for a text
      var nMonth = parseInt(this.getView().byId("createPDFMP").getProperty("month")) + 1;
      var nYear = parseInt(this.getView().byId("createPDFYP").getProperty("year"));
      // var sDate = "год: " + sYear + " ,месяц: " + sMonth;
      var sDate = "God: " + nYear + ", mesjac: " + nMonth;

      //get data for a table
      var columns = ["korpus", "etazh", "pomeshcheniye", "arendator", "nomer schetchika", "koeficient", "pokazatel predyduschhiy", "pokazatel tekuschhiy"];
      var oData = this.getView().byId("tableCreatePDF").getModel("Model").oData.tenants;
      var data = [];
      for(var i = 0; i < oData.length; i++) {
        var nMonthCalc = nMonth;
        var nYearCalc = nYear;
        var oPrevMonth;
        while (oPrevMonth == undefined) {
          if (nMonthCalc > 1) {
            nMonthCalc--;
          } else {
            nMonthCalc = 12;
            nYearCalc--;
          }
          if (nYearCalc < 2019) {
            oPrevMonth = "";
          } else {
            oPrevMonth = oData[i].counterNumbers[nYearCalc][nMonthCalc];
          }
        }
        data[i] = [oData[i].housing, oData[i].floor, oData[i].room, oData[i].name, oData[i].counter, oData[i].coefficient, oPrevMonth.counterNumber];
      }

      //create an instance of jsPDF and set there styles, the text and the table
      var doc = new jsPDF();
      // doc.addFont("cyrillic-normal.ttf", "cyrillic", "bold");
      // doc.setFont('cyrillic_');
      // doc.setFontType('normal');
      doc.addFont('ArialMS', 'Arial', 'normal');
      doc.setFont('Arial');
      doc.setFontStyle('bold');
      doc.setFontSize(12);
      doc.setTextColor(63, 127, 191);
      doc.text(3, 15, sDate);
      doc.autoTable(columns, data, {
        margin: {horizontal: 2, top: 20},
        startY: 20,
        styles: {overflow: 'linebreak'}
      });

      //save to pdf
      doc.save("EnterCounterNumbers.pdf");
    },

    onNavBackWithoutSaving: function () {

      //set current year and month as selected
      var nMonth = new Date().getMonth();
      var nYear = new Date().getYear();
      this.getView().byId("createPDFMP").setMonth(nMonth);
      this.getView().byId("createPDFYP").setYear(nYear - 100 + 2000);

      //update the table
      this.onAfterRendering();

      //navigate to the Main page
      this.getRouter().navTo("main");
    }
  });
});
