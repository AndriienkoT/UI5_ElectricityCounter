sap.ui.require([
    "UI5toLearn/controller/BaseController.controller",
    "UI5toLearn/controller/App.controller",
    "UI5toLearn/controller/EnterCounterNumber.controller",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit"
  ],
  function (BaseController, AppController, EnterCounterNumberController, Controller, JSONModel, sinon) {
    "use strict";

    var oBaseController;

    QUnit.module("Enter Counter Number", {

      readDataInApp: async function (oBaseController, done) {
        await new Promise(function(resolve){setTimeout(resolve, 2000)});
        done();
        oBaseController.onRetrieveData(oBaseController);
      },

      readDataInTest: async function (oBaseController) {
        var objectStore = oBaseController.myDB.transaction("tenants").objectStore("tenants");
        var oItems = {
          "tenants": []
        };
        objectStore.openCursor().onsuccess = function(oEvent) {
          var cursor = oEvent.target.result;
          if (cursor) {
            oItems.tenants.push(cursor.value);
            cursor.continue();
          }
        };
        await new Promise(function(resolve){setTimeout(resolve, 2000)});
        return oItems;
      },

      beforeEach : function (assert) {
        this.oController = new EnterCounterNumberController();
        oBaseController = new BaseController();

        //IDB
        var request = indexedDB.open("MyIDB", 1);
        request.onupgradeneeded = function () {
          var db = request.target.result;
          db.createObjectStore("tenants", {keyPath: "counter"});
        }
        request.onsuccess = function (oEvent) {
          oBaseController.myDB = oEvent.target.result;
          oBaseController.myDB.transaction(["tenants"], "readwrite");
        };

        //open IDB and read data
        var done = assert.async();
        var oAppController = new AppController();
        oAppController.onInit();
        this.readDataInApp(oBaseController, done);

        //stubbing
        this.oViewStub = new sap.ui.core.mvc.View({});
        this.oGetViewStub = sinon.stub(Controller.prototype, "getView").returns(this.oViewStub);
        var oFakeMonthPicker = new sap.ui.unified.calendar.MonthPicker({id: "MP"});
        var oFakeYearPicker = new sap.ui.unified.calendar.YearPicker({id: "YP"});
        var oFakeTable = new sap.m.Table({id: "tableEnterCounterNumber"});
        sinon.stub(this.oViewStub, "byId")
          .withArgs("MP").returns(oFakeMonthPicker)
          .withArgs("YP").returns(oFakeYearPicker)
          .withArgs("tableEnterCounterNumber").returns(oFakeTable);
        this.oJsonModelStub = new JSONModel({"tenants": []});
        this.oViewStub.setModel(this.oJsonModelStub);
        var oOwnerComponent = new sap.ui.core.Component();
        sinon.stub(Controller.prototype, "getOwnerComponent").returns(oOwnerComponent);
        var oResourceModel = new sap.ui.model.resource.ResourceModel({
          bundleUrl : jQuery.sap.getModulePath("UI5toLearn", "/i18n/i18n.properties")
        });
        sinon.stub(oOwnerComponent, 'getModel')
          .withArgs('Model').returns(this.oJsonModelStub)
          .withArgs('i18n').returns(oResourceModel);
      },

      afterEach : function () {
        this.oController.destroy();
        this.oViewStub.destroy();
        this.oJsonModelStub.destroy();
        this.oGetViewStub.restore();
      }
    });

    QUnit.test("Given counter numbers and differences should be stored", async function (assert) {

      // arrangement
      this.oViewStub.byId("MP").setMonth(1);
      this.oViewStub.byId("YP").setYear(2020);
      var oData = {
        "tenants": [{
          "room": "1",
          "name": "1",
          "counter": "1",
          "coefficient": "1",
          "counterNumbers": {
            "2019": {
              "0": {
                "counterNumber": "0"
              }
            },
            "2020": {},
            "2021": {},
            "2022": {},
            "2023": {}
          },
          "differences": {
            "2019": {
              "0": {
                "difference": "0"
              }
            },
            "2020": {},
            "2021": {},
            "2022": {},
            "2023": {}
          }
        }]
      };
      this.oJsonModelStub.setData(oData, true);
      var oTable = this.oViewStub.byId("tableEnterCounterNumber");
      oTable.setModel(this.oJsonModelStub);
      oTable.bindAggregation("items", "/tenants", new sap.m.ColumnListItem({
        cells:[
          new sap.m.Text({
            text:"{room}"
          }),
          new sap.m.Text({
            text:"{name}"
          }),
          new sap.m.Text({
            text:"{counter}"
          }),
          new sap.m.Text({
            text:"{coefficient}"
          }),
          new sap.m.Input({
            value:"{counterNumbers/counterNumber}",
            type:"Number"
            // liveChange:this.oController.onEnterCounterNumber()
          }),
          new sap.m.Text({
            id:"difference"
          })
        ]
      }));
      var oItems = this.oViewStub.byId("tableEnterCounterNumber").getAggregation("items");
      oItems[0].getAggregation("cells")[4].setValue(1);
      oItems[0].getAggregation("cells")[4].fireLiveChange();

      // action
      // this.oController.onEnterCounterNumber();
      this.oController.onSaveCounterNumbers();

      // assertions
      var oItems = await this.readDataInTest(oBaseController);
      assert.strictEqual(this.oJsonModelStub.getData().tenants.length, 0, "tenant was removed from the Model");
      assert.strictEqual(oItems.tenants.length, 0, "tenant was removed from the IDB");
    });
  }
);
