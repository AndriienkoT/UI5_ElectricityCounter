sap.ui.define([
  "UI5toLearn/controller/BaseController.controller"
], function (BaseController) {
  "use strict";
  return BaseController.extend("UI5toLearn.controller.CreatePDF", {
    onInit: function () {
      var oController = BaseController;
      this.onRetrieveData(oController, "tenants");

      //set current year and month as selected
      var nMonth = new Date().getMonth();
      var nYear = new Date().getYear();
      this.getView().byId("createPDFMP").setMonth(nMonth);
      this.getView().byId("createPDFYP").setYear(nYear - 100 + 2000);
    },

    onAfterRendering: function () {
      //remove not needed cells from the table
      while(this.getView().byId("tableCreatePDF").getBindingInfo("items").template.getCells().length != 3) {
        this.getView().byId("tableCreatePDF").getBindingInfo("items").template.removeCell(3);
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
      this.onSortTableData(oTable);
    },

    onSetCountNumbPrevMonth: function (oEvent) {
      this.onAfterRendering();
    },

    onCreatePDF: function (oEvent) {
      var bundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

      //get data for a text
      var nMonth = parseInt(this.getView().byId("createPDFMP").getProperty("month")) + 1;
      var nYear = parseInt(this.getView().byId("createPDFYP").getProperty("year"));
      var sYear = bundle.getText("year");
      var sMonth = bundle.getText("month");
      var sDate = sYear + ": " + nYear + ", " + sMonth + ": " + nMonth;

      //get data for a table
      var columns = [
        bundle.getText("PDFtenantLabel3"),
        bundle.getText("PDFtenantLabel4"),
        bundle.getText("PDFtenantLabel5"),
        bundle.getText("PDFtenantLabel7"),
        bundle.getText("PDFtenantLabel8")
      ];


      var oData = this.getView().byId("tableCreatePDF").getModel("Model").getData().tenants;
      oData.sort(this.onSortData());
      var data = [];
      oData.forEach(tenant => {
        var nMonthCalc = nMonth;
        var nYearCalc = nYear;
        var bPrevMonth = false;
        while (!bPrevMonth) {
          if (nMonthCalc > 1) {
            nMonthCalc--;
          } else {
            nMonthCalc = 12;
            nYearCalc--;
          }
          if (nYearCalc < 2019) {
            nMonthCalc = 0;
            nYearCalc = 2019;
          }
          if (tenant.counterNumbers[nYearCalc][nMonthCalc] != undefined) { bPrevMonth = true; }
        }
        data.push([tenant.room, tenant.name, tenant.counter, tenant.counterNumbers[nYearCalc][nMonthCalc].counterNumber]);
      });

      //create an instance of jsPDF and set there styles, the text and the table
      var doc = new jsPDF();
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
