sap.ui.require([
    "UI5toLearn/controller/BaseController.controller",
    "UI5toLearn/controller/App.controller",
    "UI5toLearn/controller/CreateTenant.controller",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit"
  ],
  function (BaseController, AppController, CreateTenantController, Controller, JSONModel, sinon) {
    "use strict";

    var oBaseController;

		QUnit.module("Create Tenant", {

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
        this.oController = new CreateTenantController();
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
        var oFakeRoomInput = new sap.m.ComboBox({id: "roomInput"});
        var oFakeNameInput = new sap.m.ComboBox({id: "nameInput"});
        var oFakeCounterInput = new sap.m.ComboBox({id: "counterInput"});
        var oFakeCoefficientInput = new sap.m.Input({id: "coefficientInput"});
        sinon.stub(this.oViewStub, "byId")
          .withArgs("roomInput").returns(oFakeRoomInput)
          .withArgs("nameInput").returns(oFakeNameInput)
          .withArgs("counterComboBox").returns(oFakeCounterInput)
          .withArgs("counterInput").returns(oFakeCoefficientInput);
        this.oJsonModelStub = new JSONModel({
          "tenants": []
        });
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

    QUnit.test("Tenant should be created when tenant with given counter does not exist and when all fields are filled", async function (assert) {

      // arrangement
      this.oViewStub.byId("roomInput").setValue("1");
      this.oViewStub.byId("nameInput").setValue("1");
      this.oViewStub.byId("counterInput").setValue("1");
      this.oViewStub.byId("coefficientInput").setValue("1");

      // action
      this.oController.onCreateTenant();

      // assertions
      var oItems = await this.readDataInTest(oBaseController);
      assert.strictEqual(this.oJsonModelStub.getData().tenants.length, 1, "tenant was saved in the Model");
      assert.strictEqual(oItems.tenants.length, 1, "tenant was saved in the IDB");

    });
  }
);
