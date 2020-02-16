sap.ui.require([
    "UI5toLearn/controller/BaseController.controller",
    "UI5toLearn/controller/App.controller",
    "UI5toLearn/controller/DeleteTenant.controller",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit"
  ],
  function (BaseController, AppController, DeleteTenantController, Controller, JSONModel, sinon) {
    "use strict";

    var oBaseController;

    QUnit.module("Delete Tenant", {

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
        this.oController = new DeleteTenantController();
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
        var oFakeNameComboBox = new sap.m.ComboBox({id: "nameComboBox"});
        var oFakeCounterComboBox = new sap.m.ComboBox({id: "counterComboBox"});
        sinon.stub(this.oViewStub, "byId")
          .withArgs("nameComboBox").returns(oFakeNameComboBox)
          .withArgs("counterComboBox").returns(oFakeCounterComboBox);
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

    QUnit.test("Tenant should be removed when tenant with given counter exists", async function (assert) {

      // arrangement
      this.oViewStub.byId("nameComboBox").setValue("1");
      this.oViewStub.byId("counterComboBox").setValue("1");

      // action
      this.oController.onDeleteTenant();

      // assertions
      var oItems = await this.readDataInTest(oBaseController);
      assert.strictEqual(this.oJsonModelStub.getData().tenants.length, 0, "tenant was removed from the Model");
      assert.strictEqual(oItems.tenants.length, 0, "tenant was removed from the IDB");
    });
  }
);
