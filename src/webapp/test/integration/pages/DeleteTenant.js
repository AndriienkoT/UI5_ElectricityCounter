sap.ui.require([
    'sap/ui/test/Opa5',
    'test/opa/base/Common',
    "sap/ui/test/actions/EnterText",
    "sap/ui/test/actions/Press"
  ],
  function(Opa5, Common, EnterText, Press) {

    Opa5.createPageObjects({
      onDeleteTenantPage: {
        baseClass: Common,
        actions: {
          iSelectItemInComboBox: function (id, text) {
            return this.waitFor({
              id : "main-component---deleteTenant--" + id,
              actions: [new EnterText({ text: text }), new Press()],
              errorMessage : "Did not find the" + id + " combobox"
            });
          },
          iPressButton: function (id) {
            return this.waitFor({
              timeout: 30,
              id : "main-component---deleteTenant--" + id,
              success: (control) => {
                control.firePress();
              },
              errorMessage : "Did not find the button"
            });
          }
        },


        assertions: {
          iShouldSeeDeleteTenantPage: function() {
            return this.waitFor({
              timeout: 30,
              controlType : "sap.tnt.ToolPage",
              id: "main-component---deleteTenant--deleteTenant",
              success: function(oControl) {
                Opa5.assert.ok(oControl, "Remove Tenant page is found");
              },
              errorMessage: "Did not find Remove Tenant page"
            });
          },
          iShouldSeeComboBoxWith: function(id, value) {
            return this.waitFor({
              controlType: "sap.m.ComboBox",
              matchers: [
                new sap.ui.test.matchers.PropertyStrictEquals({name: "value", value: value}),
                new sap.ui.test.matchers.PropertyStrictEquals({name: "id", value: 'main-component---deleteTenant--' + id})
              ],
              success: (aControls) => {
                Opa5.assert.ok(aControls.length > 0, "ComboBox with wanted value is found");
              },
              errorMessage: "ComboBox with wanted value is not found"
            });
          },
          listOfComboBoxShouldBeFiltered: function(id, aValues) {
            return this.waitFor({
              controlType: "sap.m.ComboBox",
              id: 'main-component---deleteTenant--' + id,
              check: (oComboBox) => {
                var aItemValues = [];
                oComboBox.getAggregation("items").forEach(item => {
                  aItemValues.push(item.getProperty("text"));
                });
                if (aItemValues.toString() == aValues.toString()) { return true; } else { return false; }
              },
              success: (aControls) => {
                Opa5.assert.ok(true, "List of the combobox was filtered correctly");
              },
              errorMessage: "List of the combobox was not filtered correctly"
            });
          },
          tenantShouldBeInModel: function(value) {
            return this.waitFor({
              controlType: "sap.tnt.ToolPage",
              id: "main-component---deleteTenant--deleteTenant",
              check: (oView) => {
                var aTenants = oView.getModel("Model").getProperty('/tenants');
                if (aTenants != null && aTenants.length > 0) {
                  if (aTenants.findIndex(tenant => tenant.counter === value) > -1) { return true; }
                }
                return false;
              },
              success : function () {
                Opa5.assert.ok(true, "Tenant is in the Model");
              },
              errorMessage : "Tenant is not in the Model"
            });
          },
          tenantShouldNotBeInModel: function(value) {
            return this.waitFor({
              controlType: "sap.tnt.ToolPage",
              id: "main-component---deleteTenant--deleteTenant",
              check: (oView) => {
                var aTenants = oView.getModel("Model").getProperty('/tenants');
                if (aTenants != null && aTenants.length > 0) {
                  if (aTenants.findIndex(tenant => tenant.counter === value) > -1) { return false; }
                }
                return true;
              },
              success : function () {
                Opa5.assert.ok(true, "Tenant is not in the Model");
              },
              errorMessage : "Tenant is in the Model"
            });
          },
          iShouldSeeTheMessage: function () {
            return this.waitFor({
              check : function () {
                return sap.ui.test.Opa5.getJQuery()(".sapMMessageToast").length > 0;
              },
              success : function () {
                Opa5.assert.ok(true, "Found a Message Toast");
              },
              errorMessage : "No Message Toast message is found!"
            });
          }
        }
      }
    });
  });
