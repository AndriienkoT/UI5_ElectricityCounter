sap.ui.define([
  "UI5toLearn/controller/BaseController",
  'sap/ui/model/Sorter'
], function (BaseController, Sorter) {
  "use strict";
  return BaseController.extend("UI5toLearn.controller.CreatePDF", {
    onInit: function () {

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
            if(!isNaN(n)) { return n };
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

    onCreatePDF: function (oEvent) {
      //get data for a text
      var sMonth = (parseInt(this.getView().byId("MP").getProperty("month")) + 1).toString();
      var sYear = this.getView().byId("YP").getProperty("year");
      var sDate = "Year: " + sYear + ", month: " + sMonth;

      //get data for a table
      var columns = ["housing", "floor", "room", "name", "counter", "counterNumber"];
      var oData = this.getView().byId("tableEnterCounterNumber").getModel("Model").oData.tenants;
      var data = [];
      for(var i = 0; i < oData.length; i++) {
        data[i] = [oData[i].housing, oData[i].floor, oData[i].room, oData[i].name, oData[i].counter];
      }

      //create an instance of jsPDF and set there styles, the text and the table
      var doc = new jsPDF();
      doc.setFontSize(12);
      doc.addFont('ArialMS', 'Arial', 'normal');
      doc.setFont('Arial');
      doc.setFontStyle('bold');
      doc.setTextColor(63, 127, 191);
      // doc.text16(20, 20, "гдргржгружфа");
      doc.text(15, 15, sDate);
      doc.autoTable(columns, data, {
        startY: 20
      });

      doc.save("EnterCounterNumbers.pdf");

      // var doc = new jsPDF();
      // doc.addHTML($('#createPDF').first(), function() {
      //   doc.save("EnterCounterNumbers.pdf");
      // });
    },

    text16: function(x, y, text) {
      var pageHeight = 1024;
      if(pageFontSize != fontSize) {
        out('BT /F1 ' + parseInt(fontSize) + '.00 Tf ET');
        pageFontSize = fontSize;
      }
      var str = sprintf('BT %.2f %.2f Td <%s> Tj ET', x * k, (pageHeight - y) * k, pdfEscape16(text));
      out(str);
    }
  });
});
