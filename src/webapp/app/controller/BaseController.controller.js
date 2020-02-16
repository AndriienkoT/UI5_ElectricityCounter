sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/routing/History",
  'sap/ui/model/Sorter',
  "sap/ui/model/resource/ResourceModel"
], function (Controller, History, Sorter, ResourceModel) {
  "use strict";
  return Controller.extend("UI5toLearn.controller.BaseController", {
    onInit: function () {
      var i18nModel = new ResourceModel({
        bundleName: "UI5toLearn.i18n.i18n"
      });
      this.getView().setModel(i18nModel, "i18n");
    },

    getModel: function (oEvent) {
      return this.getOwnerComponent().getModel("Model");
    },

    getStorage: function (oEvent) {
      jQuery.sap.require("jquery.sap.storage");
      return jQuery.sap.storage(jQuery.sap.storage.Type.local);
    },

    getRouter: function (oEvent) {
      return sap.ui.core.UIComponent.getRouterFor(this);
    },

    onNavBack: function (oEvent) {
      var oHistory, sPreviousHash;
      oHistory = History.getInstance();
      sPreviousHash = oHistory.getPreviousHash();
      if (sPreviousHash !== undefined) {
        window.history.go(-1);
      } else {
        this.getRouter().navTo("main", {}, true /*no history*/);
      }
    },

    onSortTableData: function (oTable) {
      var oBinding = oTable.getBinding("items");
      var oSorter = new Sorter("room", null);
      oSorter.fnCompare = function naturalSorter(as, bs) {
        var a, b, a1, b1, i = 0, n, L, rx = /(\.\d+)|(\d+(\.\d+)?)|([^\d.]+)|(\.\D+)|(\.$)/g;
        if (as === bs) {
          return 0;
        }
        a = as.toLowerCase().match(rx);
        b = bs.toLowerCase().match(rx);
        L = a.length;
        while (i < L) {
          if (!b[i]) {
            return 1;
          }
          a1 = a[i];
          b1 = b[i++];
          if (a1 !== b1) {
            n = a1 - b1;
            if (!isNaN(n)) {
              return n;
            }
            return a1 > b1 ? 1 : -1;
          }
        }
        return b[i] ? -1 : 0;
      }
      if (oBinding) {
        oBinding.sort(oSorter);
      }
    },

    onSortData: function () {
      var oSorter = function naturalSorter(tenantA, tenantB) {
        var a, b, a1, b1, i = 0, n, L, rx = /(\.\d+)|(\d+(\.\d+)?)|([^\d.]+)|(\.\D+)|(\.$)/g;
        if (tenantA.room === tenantB.room) {
          return 0;
        }
        a = tenantA.room.toLowerCase().match(rx);
        b = tenantB.room.toLowerCase().match(rx);
        L = a.length;
        while (i < L) {
          if (!b[i]) {
            return 1;
          }
          a1 = a[i];
          b1 = b[i++];
          if (a1 !== b1) {
            n = a1 - b1;
            if (!isNaN(n)) {
              return n;
            }
            return a1 > b1 ? 1 : -1;
          }
        }
        return b[i] ? -1 : 0;
      }
      return oSorter;
    },

    /////////////////////////////////////////////IDB
    onPrepareIDB: function (oController) {

      //check weather offline store is supported
      if (indexedDB == null) {
        return null;
      } else {
        //open DB
        var request = indexedDB.open("MyIDB", 1);

        //creating or upgrading DB
        request.onupgradeneeded = function (oEvent) {
          var db = oEvent.target.result;
          // create an objectStore for this database
          db.createObjectStore("tenants", { keyPath: "counter" });
          console.log("onupgradeneeded success");
        };

        request.onsuccess = function (oEvent) {
          oController.myDB = oEvent.target.result;
          console.log("open success");
        };

        request.onerror = function (oEvent) {
          console.error("openDb:", oEvent.target.errorCode);
          console.log("open error");
        };

        request.oncomplete = function () {
          console.log("All done!");
          return true;
        };
      }
    },

    onWriteAllDataToIDB: function (oController) {
      var oObjects = this.getModel().getData().tenants;

      //open the transaction
      var transaction = oController.myDB.transaction(["tenants"], "readwrite");

      transaction.oncomplete = function (oEvent) {
        console.log("write success");
      };
      transaction.onerror = function (oEvent) {
        console.log("Error", oEvent.target.error.name);
        console.log("write error");
      };

      //write to DB
      var objectStore = transaction.objectStore("tenants");
      oObjects.forEach(tenant => {
        var request = objectStore.add(tenant);
        request.onsuccess = function (oEvent) { };
      });
    },

    onWriteOneTenantToIDB: function (oController, tenant) {
      //open the transaction
      var transaction = oController.myDB.transaction(["tenants"], "readwrite");
      transaction.oncomplete = function (oEvent) {
        console.log("transaction is open");
      };

      transaction.onerror = function (oEvent) {
        console.log("Error", oEvent.target.error.name);
        console.log("write error");
      };

      //write to DB
      var objectStore = transaction.objectStore("tenants");
      var request = objectStore.add(tenant);
      request.onsuccess = function (oEvent) {
        console.log("write success");
      };
    },

    onEditOneTenant: function (oController, sRoom, sName, sCounter, sCoefficient) {

      //get the object store
      var objectStore = oController.myDB.transaction(["tenants"], "readwrite").objectStore("tenants");

      //open cursor
      objectStore.openCursor().onsuccess = function(oEvent) {
        var cursor = oEvent.target.result;
        if (cursor) {

          //if there is a tenant with given key, change teh data of it
          if (cursor.value.counter === sCounter) {
            var tenant = cursor.value;
            if (tenant.room !== sRoom) {
              tenant.room = sRoom;
            }
            if (tenant.name !== sName) {
              tenant.name = sName;
            }
            if (tenant.coefficient !== sCoefficient) {
              tenant.coefficient = sCoefficient;
            }
            cursor.update(tenant);
          }
          cursor.continue();
        } else {
          console.log("rewrite one tenant success");
        }
      };
    },

    onUpdateCounterNumberOfOneTenant: function (oController, sCounter, sYear, sMonth, oCountNumb, oDifference) {

      //get the object store
      var objectStore = oController.myDB.transaction(["tenants"], "readwrite").objectStore("tenants");

      //get tenant by key
      var request = objectStore.get(sCounter);
      request.onerror = function(event) {
      };
      request.onsuccess = function(oEvent) {
        var tenant = oEvent.target.result;

        // update the values of the tenant
        if (oCountNumb != null) {
          tenant.counterNumbers[sYear][sMonth] = oCountNumb;
        }
        tenant.differences[sYear][sMonth] = oDifference;

        //put the updated object back into the IDB
        var requestUpdate = objectStore.put(tenant);
        requestUpdate.onerror = function(event) { };
        requestUpdate.onsuccess = function(event) {
          console.log("counter numbers are updated");
        };
      };
    },

    onRemoveOneTenant: function (oController, sCounter) {
      var request = oController.myDB.transaction(["tenants"], "readwrite").objectStore("tenants").delete(sCounter);
      request.onsuccess = function(oEvent) {
        console.log("remove one tenant success");
      };
    },

    onRemoveAllData: function (oController) {
      var objectStore = oController.myDB.transaction(["tenants"], "readwrite").objectStore("tenants");
      objectStore.openCursor().onsuccess = function(oEvent) {
        var cursor = oEvent.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          console.log("remove all data success");
        }
      };
    },

    onRetrieveData: function (oController) {

      //get the object store
      var objectStore = oController.myDB.transaction("tenants").objectStore("tenants");
      var oItems = {
        "tenants": []
      };

      //pushing data to the item array
      var that = this;
      objectStore.openCursor().onsuccess = function(oEvent) {
        var cursor = oEvent.target.result;
        if (cursor) {
          oItems.tenants.push(cursor.value);
          cursor.continue();
        } else {
          console.log("read success");
          that.getModel().setData(oItems);
        }
      };
    }
  });
});
