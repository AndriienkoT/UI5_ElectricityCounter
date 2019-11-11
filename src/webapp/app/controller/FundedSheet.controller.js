sap.ui.define([
  "UI5toLearn/controller/BaseController",
  'sap/m/MessageToast',
  'sap/m/Dialog',
  'sap/m/ButtonType'
], function (BaseController, MessageToast, Dialog, ButtonType) {
  "use strict";
  return BaseController.extend("UI5toLearn.controller.FundedSheet", {

    onInit: function () {
      this.onUpdateData();

      // var oTable = this.getView().byId("tableFundedSheet");
      // oTable.setModel(this.getModel(), "Model");
      //
      // var oColumnData = [
      //   new sap.m.Column({
      //     header: new sap.m.Text({text:"Корпус"})
      //   }),
      //   new sap.m.Column({
      //     header: new sap.m.Text({text:"Этаж"})
      //   }),
      //   new sap.m.Column({
      //     header: new sap.m.Text({text:"Помещение"})
      //   }),
      //   new sap.m.Column({
      //     header: new sap.m.Text({text:"Название арендатора"})
      //   }),
      //   new sap.m.Column({
      //     header: new sap.m.Text({text:"Номер счетчика"})
      //   })
      // ];
      // oColumnData.forEach(function(oColumn){
      //   oTable.addAggregation("columns", oColumn);
      // });
      //
      // var oColumnListItem = new sap.m.ColumnListItem(
      //   {cells: [
      //     new sap.m.Text({text : "{Model>housing}"}),
      //     new sap.m.Text({text : "{Model>floor}"}),
      //     new sap.m.Text({text : "{Model>room}"}),
      //     new sap.m.Text({text : "{Model>name}"}),
      //     new sap.m.Text({text : "{Model>counter}"})
      //     ]
      //   });
      // oTable.bindItems({
      //   path: "Model>/tenants",
      //   template: oColumnListItem
      // });
    },

    onUpdateData: function () {
      //update data in the Model
      if (this.getStorage().get("myLocalData")) {
        var oDataFromStorage = this.getStorage().get("myLocalData");
        var oModel = new sap.ui.model.json.JSONModel(this.getModel());
        oModel.setData(oDataFromStorage);
        this.getView().setModel(oModel);
        this.getOwnerComponent().setModel(oModel, "Model");
      }
    },

    onNavBackWithoutSaving: function (oEvent) {

      //clear input fields
      // this.getView().byId("housing").setValue(null);
      // this.getView().byId("floor").setValue(null);
      // this.getView().byId("room").setValue(null);
      // this.getView().byId("name").setValue(null);
      // this.getView().byId("counter").setValue(null);

      //navigate to the Main page
      this.getRouter().navTo("main");
    },

    onOpenTenantDialog: function (oEvent) {
      var oData = this.getModel().getData().tenants;
      var that = this;
      var dialog = new Dialog({
        title: 'Confirm',
        type: 'Message',
        content: [
          new sap.m.Input('submitDialogInput', {
            placeholder: "По какому арендатору?",
            liveChange: function(oEvent) {
              var sText = oEvent.getParameter('value');
              var parent = oEvent.getSource().getParent();
              parent.getBeginButton().setEnabled(sText.length > 0);
            },
            width: '100%'
          })
        ],
        beginButton: new sap.m.Button({
          type: ButtonType.Emphasized,
          text: 'Показать',
          enabled: false,
          press: function () {
            var sText = sap.ui.getCore().byId('submitDialogInput').getValue();
            var oChosenTenant = {};
            oData.forEach(function(tenant) {
              if (tenant.name === sText) { oChosenTenant = tenant; }
            });
            if (Object.entries(oChosenTenant).length == 0) {
              that.getView().byId("tableFundedSheet").setVisible(false);
              MessageToast.show("Арендатор " + sText + " не существует");
            } else {
              that.onTableOneTenantShow(oChosenTenant);
            }
            dialog.close();
          }
        }),
        endButton: new sap.m.Button({
          text: 'Отменить',
          press: function () {
            dialog.close();
          }
        }),
        afterClose: function() {
          dialog.destroy();
        }
      });
      dialog.open();
    },

    onInputChange: function (oEvent) {
      this.getView().byId("oneTenantBtn").setEnabled(true);
      this.getView().byId("allTenantsBtn").setEnabled(true);
    },

    onCheckEnter: function (nYear, nStartMonth, nEndMonth) {
      var bEnabled = false;
      if (nYear == "") {
        MessageToast.show("Выбери год");
      } else if (nYear < 2019 || nYear > 2025) {
        MessageToast.show("Год не может быть меньше 2019 и больше 2025");
      } else if (nStartMonth == "" && nEndMonth == "") {
        bEnabled = true;
      } else if (nStartMonth < 1) {
        MessageToast.show("Начальный месяц не может быть меньше 1");
      } else if (nEndMonth > 12) {
        MessageToast.show("Конечный месяц не может быть больше 12");
      } else if (nStartMonth == "" && nEndMonth) {
        MessageToast.show("Выбери начальный месяц");
      } else if (nStartMonth && nEndMonth == ""){
        MessageToast.show("Выбери конечный месяц");
      } else if (nStartMonth > nEndMonth) {
        MessageToast.show("Начальный месяц не может быть больше конечного");
      } else {bEnabled = true;}
      if (!bEnabled) {
        this.getView().byId("oneTenantBtn").setEnabled(false);
        this.getView().byId("allTenantsBtn").setEnabled(false);
        return false;
      } else {
        this.getView().byId("oneTenantBtn").setEnabled(true);
        this.getView().byId("allTenantsBtn").setEnabled(true);
        return true;
      }
    },

    onTableOneTenantShow: function(tenant) {
      this.getView().byId("tableFundedSheet").setVisible(false);
      this.onUpdateData();
      while(this.getView().byId("tableFundedSheet").getColumns().length != 5) {
        this.getView().byId("tableFundedSheet").removeColumn(5);
      }
      while(this.getView().byId("tableFundedSheet").getBindingInfo("items").template.getCells().length != 5) {
        this.getView().byId("tableFundedSheet").getBindingInfo("items").template.removeCell(5);
      }


      var nYear = this.getView().byId("year").getValue();
      var nStartMonth = this.getView().byId("monthStart").getValue();
      var nEndMonth = this.getView().byId("monthEnd").getValue();
      if (this.onCheckEnter(nYear, nStartMonth, nEndMonth)) {
        var that = this;

        var oSelectedCountNumbs = {
          "tenants": []
        };
        if (nStartMonth && nEndMonth) {
          var aAllCountNumbs = [];
          for (var i = nStartMonth; i <= nEndMonth; i++) {
            if (tenant.counterNumbers[nYear][i] != undefined) {
              aAllCountNumbs[i] = tenant.counterNumbers[nYear][i];
            }
          }
          if (aAllCountNumbs !== undefined && aAllCountNumbs !== null && Object.entries(aAllCountNumbs).length !== 0) {
            var oData = {
              "housing" : tenant.housing,
              "floor" : tenant.floor,
              "room" : tenant.room,
              "name" : tenant.name,
              "counter" : tenant.counter,
              "counterNumbers": { }
            };
            oSelectedCountNumbs.tenants.push(oData);
            oSelectedCountNumbs.tenants[0].counterNumbers[nYear] = {};

            for (var i = nStartMonth; i <= nEndMonth; i++) {
              if (aAllCountNumbs[i] !== undefined) {
                var oData2 = {
                  "counterNumber" : aAllCountNumbs[i].counterNumber
                };
                oSelectedCountNumbs.tenants[0].counterNumbers[nYear][i] = oData2;

                that.onAddColumn(i, nYear);
              }
            }
          }
        } else {
          var aAllCountNumbs = tenant.counterNumbers[nYear];
          if (aAllCountNumbs !== undefined && aAllCountNumbs !== null && Object.entries(aAllCountNumbs).length !== 0 && aAllCountNumbs.constructor === Object) {
            var oData = {
              "housing" : tenant.housing,
              "floor" : tenant.floor,
              "room" : tenant.room,
              "name" : tenant.name,
              "counter" : tenant.counter,
              "counterNumbers": { }
            };
            oSelectedCountNumbs.tenants.push(oData);
            oSelectedCountNumbs.tenants[0].counterNumbers[nYear] = {};
          }
          for (var i = 1; i <= 12; i++) {
            if (aAllCountNumbs[i] !== undefined) {
              var oData2 = {
                "counterNumber" : aAllCountNumbs[i].counterNumber
              };
              oSelectedCountNumbs.tenants[0].counterNumbers[nYear][i] = oData2;

              that.onAddColumn(i, nYear);
            }
          }
        }
      }

      if (Object.entries(oSelectedCountNumbs.tenants).length === 0) {
        MessageToast.show("Нет показателей за выбранный период");
      } else {
        var oTable = this.getView().byId("tableFundedSheet");
        oTable.getModel("Model").setData(oSelectedCountNumbs);

        this.getView().byId("tableFundedSheet").setVisible(true);
      }
    },

    onTableAllTenantsShow: function (oEvent) {
      this.getView().byId("tableFundedSheet").setVisible(false);
      this.onUpdateData();
      while(this.getView().byId("tableFundedSheet").getColumns().length != 5) {
        this.getView().byId("tableFundedSheet").removeColumn(5);
      }
      while(this.getView().byId("tableFundedSheet").getBindingInfo("items").template.getCells().length != 5) {
        this.getView().byId("tableFundedSheet").getBindingInfo("items").template.removeCell(5);
      }


      var nYear = this.getView().byId("year").getValue();
      var nStartMonth = this.getView().byId("monthStart").getValue();
      var nEndMonth = this.getView().byId("monthEnd").getValue();
      if (this.onCheckEnter(nYear, nStartMonth, nEndMonth)) {
        var that = this;
        var aDataFromModel = this.getModel().getData().tenants;

        var oSelectedCountNumbs = {
          "tenants": []
        };

        var nIndex = 0;
        if (aDataFromModel instanceof Array){
          aDataFromModel.forEach(function(tenant) {
            if (nStartMonth && nEndMonth) {
              var aAllCountNumbs = [];
              for (var i = nStartMonth; i <= nEndMonth; i++) {
                if (tenant.counterNumbers[nYear][i] != undefined) {
                  aAllCountNumbs[i] = tenant.counterNumbers[nYear][i];
                }
              }
              if (aAllCountNumbs !== undefined && aAllCountNumbs !== null && Object.entries(aAllCountNumbs).length !== 0) {
                var oData = {
                  "housing" : tenant.housing,
                  "floor" : tenant.floor,
                  "room" : tenant.room,
                  "name" : tenant.name,
                  "counter" : tenant.counter,
                  "counterNumbers": { }
                };
                oSelectedCountNumbs.tenants[nIndex] = oData;
                oSelectedCountNumbs.tenants[nIndex].counterNumbers[nYear] = {};

                for (var i = nStartMonth; i <= nEndMonth; i++) {
                  if (aAllCountNumbs[i] !== undefined) {
                    var oData2 = {
                      "counterNumber" : aAllCountNumbs[i].counterNumber
                    };
                    oSelectedCountNumbs.tenants[nIndex].counterNumbers[nYear][i] = oData2;

                    that.onAddColumn(i, nYear);
                  }
                }
                nIndex++;
              }

            } else {
              var aAllCountNumbs = tenant.counterNumbers[nYear];
              if (aAllCountNumbs !== undefined && aAllCountNumbs !== null && Object.entries(aAllCountNumbs).length !== 0 && aAllCountNumbs.constructor === Object) {
                var oData = {
                  "housing" : tenant.housing,
                  "floor" : tenant.floor,
                  "room" : tenant.room,
                  "name" : tenant.name,
                  "counter" : tenant.counter,
                  "counterNumbers": { }
                };
                oSelectedCountNumbs.tenants[nIndex] = oData;
                oSelectedCountNumbs.tenants[nIndex].counterNumbers[nYear] = {};
              }
              for (var i = 1; i <= 12; i++) {
                if (aAllCountNumbs[i] !== undefined) {
                  var oData2 = {
                    "counterNumber" : aAllCountNumbs[i].counterNumber
                  };
                  oSelectedCountNumbs.tenants[nIndex].counterNumbers[nYear][i] = oData2;

                  that.onAddColumn(i, nYear);
                }
              }
              nIndex++;
            }
          });
        }

        if (Object.entries(oSelectedCountNumbs.tenants).length === 0) {
          MessageToast.show("Нет показателей за выбранный период");
        } else {
          var oTable = this.getView().byId("tableFundedSheet");
          oTable.getModel("Model").setData(oSelectedCountNumbs);

          this.getView().byId("tableFundedSheet").setVisible(true);
        }
      }
    },

    onAddColumn: function (month, year) {
      var aColumns = this.getView().byId("tableFundedSheet").getAggregation("columns");
      var bExists = false;
      aColumns.forEach(function (column) {
        if (column.getAggregation("header").getText() === month.toString()){
          bExists = true;
        }
      });
      if (!bExists) {
        var oColumn = new sap.m.Column({
          header: new sap.m.Text({text: month}),
          width: "80px"
        });
        this.getView().byId("tableFundedSheet").addColumn(oColumn);

        var sPath = '{Model>counterNumbers/' + year + '/' + month + '/counterNumber}';
        var oCell = new sap.m.Text({text : sPath});
        var oTemplate = this.getView().byId("tableFundedSheet").getBindingInfo("items").template;
        oTemplate.addCell(oCell);
        this.getView().byId("tableFundedSheet").unbindItems();
        this.getView().byId("tableFundedSheet").bindItems({
          path: "Model>/tenants",
          template: oTemplate
        });
      }
    }
  });
});
