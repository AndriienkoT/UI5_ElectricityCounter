sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/routing/History",
  'sap/ui/model/Sorter',
  "sap/ui/model/resource/ResourceModel",
  "sap/ui/core/util/File",
  'sap/m/MessageToast'
], function (Controller, History, Sorter, ResourceModel, File, MessageToast ) {
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

    onReloadMainPage: function () {
      var aPages = this.getView().oParent.getAggregation("pages");
      var oView;
      aPages.forEach(page => {
        if (page.getProperty("viewName") == "UI5toLearn.view.Main") {
          oView = page;
        }
      });
      if(oView != undefined) {
        window.location.reload();
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
    onPrepareIDB: function (oController, sObjectStoreName, sKey) {

      //check weather offline store is supported
      if (indexedDB == null) {
        return null;
      } else {
        //open DB
        var request = indexedDB.open("MyIDB", 2);

        //creating or upgrading DB
        request.onupgradeneeded = function (oEvent) {
          var db = oEvent.target.result;
          // create an objectStore for this database
          db.createObjectStore(sObjectStoreName, { keyPath: sKey });
          db.createObjectStore("DBcopies", { });
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
        };
      }
    },

    // onWriteAllDataToIDB: function (oController, sObjectStoreName) {
    //   var oObjects = this.getModel().getData()[sObjectStoreName];
    //
    //   //open the transaction
    //   var transaction = oController.myDB.transaction([sObjectStoreName], "readwrite");
    //
    //   transaction.oncomplete = function (oEvent) {
    //     console.log("write success");
    //   };
    //   transaction.onerror = function (oEvent) {
    //     console.log("Error", oEvent.target.error.name);
    //   };
    //
    //   //write to DB
    //   var objectStore = transaction.objectStore(sObjectStoreName);
    //   oObjects.forEach(object => {
    //     var request = objectStore.add(object);
    //     request.onsuccess = function (oEvent) { };
    //   });
    // },

    onWriteOneObjectToIDB: function (oController, sObjectStoreName, object) {
      //open the transaction
      var transaction = oController.myDB.transaction([sObjectStoreName], "readwrite");
      transaction.oncomplete = function (oEvent) {
        console.log("transaction is open");
      };

      transaction.onerror = function (oEvent) {
        console.log("Error", oEvent.target.error.name);
      };

      //write to DB
      var objectStore = transaction.objectStore(sObjectStoreName);
      var request = objectStore.add(object);
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
      request.onerror = function(event) { };
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

    onRemoveOneObject: function (oController, sObjectStoreName, sKey) {
      var request = oController.myDB.transaction([sObjectStoreName], "readwrite").objectStore(sObjectStoreName).delete(sKey);
      request.onsuccess = function(oEvent) {
        console.log("remove one object success");
      };
    },

    onRemoveAllData: function (oController, sObjectStoreName) {
      var oMainObjectStore = oController.myDB.transaction([sObjectStoreName], "readwrite").objectStore(sObjectStoreName);
      var oDBCopiesObjectStore = oController.myDB.transaction(["DBcopies"], "readwrite").objectStore("DBcopies");

      //clear all tenants
      oMainObjectStore.clear().onsuccess = function(oEvent) {
        console.log("remove all main data successfully");
      };

      //clear all dates of made copies except last one
      oDBCopiesObjectStore.delete(IDBKeyRange.lowerBound(0, true)).onsuccess = function(oEvent) {
          console.log("remove all copies successfully");
        };
    },

    onRetrieveData: function (oController, sObjectStoreName) {

      //get the object store
      var objectStore = oController.myDB.transaction(sObjectStoreName).objectStore(sObjectStoreName);
      var oItems = {};
      oItems[sObjectStoreName] = [];

      //pushing data to the item array
      var that = this;
      objectStore.openCursor().onsuccess = function(oEvent) {
        var cursor = oEvent.target.result;
        if (cursor) {
          // oItems.tenants.push(cursor.value);
          oItems[sObjectStoreName].push(cursor.value);
          cursor.continue();
        } else {
          that.getModel().setData(oItems);
        }
      };
    },

    onExportToJson: function(oController, sDate) {
      return new Promise((resolve, reject) => {
        const exportObject = {};
        if (oController.myDB.objectStoreNames.length === 0) {
          //if there is some ObjectStore, change content to JSON format
          resolve(JSON.stringify(exportObject));
        } else {
          const transaction = oController.myDB.transaction(oController.myDB.objectStoreNames, 'readonly');
          transaction.addEventListener('error', reject);

          //for each ObjectStore add objects from IDB to allObjects array
          for (const storeName of oController.myDB.objectStoreNames) {
            const allObjects = [];
            transaction.objectStore(storeName).openCursor().addEventListener('success', event => {
              const cursor = event.target.result;
              if (cursor) {
                allObjects.push(cursor.value);
                cursor.continue();
              } else {
                //if no more values, store is done
                exportObject[storeName] = allObjects;

                //last store was handled
                if (oController.myDB.objectStoreNames.length === Object.keys(exportObject).length) {
                  resolve(JSON.stringify(exportObject));
                }
              }
            });
          }
        }
      })
      .then(result => {
        //save result to the file
        File.save(result, ("Backup" + sDate), "json", "application/json", "UTF-8");
        console.log('Backup was saved');

        //and add the date of last copy to the IDB
        var objectStore = oController.myDB.transaction(["DBcopies"], "readwrite").objectStore("DBcopies");
        objectStore.put(sDate, 0).onsuccess = function (oEvent) { };
      })
      .catch(error => {
        console.error('Something went wrong during export:', error);
      });
    },

    onImportFromJson: function (oController, json) {
      return new Promise((resolve, reject) => {
        const transaction = oController.myDB.transaction(oController.myDB.objectStoreNames, 'readwrite');
        transaction.addEventListener('error', reject);

        //parse content as JSON
        var importObject = JSON.parse(json);

        //for each ObjectStore add objects from parsed JSON to the IDB
        for (const storeName of oController.myDB.objectStoreNames) {
          let count = 0;
          for (const toAdd of importObject[storeName]) {
            const request = transaction.objectStore(storeName).put(toAdd);
            request.addEventListener('success', () => {
              count++;
              if (count === importObject[storeName].length) {
                // Added all objects for this store
                delete importObject[storeName];
                if (Object.keys(importObject).length === 0) {
                  // Added all object stores
                  resolve();
                }
              }
            });
          }
        }
      })
      .then(() => {
        console.log('Successfully imported data');

        //show a message
        var bundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        var sMessage = bundle.getText("importDBPageMessageDBLoaded");
        MessageToast.show(sMessage);
      })
      .catch(error => {
        console.error('Something went wrong during import:', error);
      });
    }
  });
});
