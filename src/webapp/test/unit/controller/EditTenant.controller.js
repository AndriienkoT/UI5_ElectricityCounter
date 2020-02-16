sap.ui.require([
    "UI5toLearn/controller/BaseController.controller",
    "UI5toLearn/controller/App.controller",
    "UI5toLearn/controller/EditTenant.controller",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit"
  ],
  function (BaseController, AppController, EditTenantController, Controller, JSONModel, sinon) {
    "use strict";

    var oBaseController;

    QUnit.module("Edit Tenant", {

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
        this.oController = new EditTenantController();
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
        var oFakeRoomComboBox = new sap.m.ComboBox({id: "roomComboBox"});
        var oFakeNameComboBox = new sap.m.ComboBox({id: "nameComboBox"});
        var oFakeCounterComboBox = new sap.m.ComboBox({id: "counterComboBox"});
        var oFakeCoefficientInput = new sap.m.Input({id: "coefficientInput"});
        sinon.stub(this.oViewStub, "byId")
          .withArgs("roomComboBox").returns(oFakeRoomComboBox)
          .withArgs("nameComboBox").returns(oFakeNameComboBox)
          .withArgs("counterComboBox").returns(oFakeCounterComboBox)
          .withArgs("coefficientInput").returns(oFakeCoefficientInput);
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

    QUnit.test("Tenant should be edited when tenant with given counter exists and when all fields are filled", async function (assert) {

      // arrangement
      this.oViewStub.byId("roomComboBox").setValue("1");
      this.oViewStub.byId("nameComboBox").setValue("1");
      this.oViewStub.byId("counterComboBox").setValue("1");
      this.oViewStub.byId("coefficientInput").setValue("2");

      // action
      this.oController.onEditTenant();

      // assertions
      var oItems = await this.readDataInTest(oBaseController);
      assert.strictEqual(this.oJsonModelStub.getData().tenants[0].coefficient, "2", "tenant was changed in the Model");
      assert.strictEqual(oItems.tenants[0].coefficient, "2", "tenant was changed in the IDB");

    });
  }
);
