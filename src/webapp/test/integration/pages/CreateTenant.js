sap.ui.require([
    'sap/ui/test/Opa5',
    'test/opa/base/Common'
  ],
  function(Opa5, Common) {

    Opa5.createPageObjects({
      onCreateTenantPage: {
        baseClass: Common,
        actions: {
          iTypeInInput: function (id, value) {
            return this.waitFor({
              id : "main-component---createTenant--" + id,
              success : (control) => {
                control.setValue(value);
              },
              errorMessage : "Did not find the " + id + " input"
            });
          },
          iPressButton: function (id) {
            return this.waitFor({
              id : "main-component---createTenant--" + id,
              success: (control) => {
                control.firePress();
              },
              errorMessage : "Did not find the button"
            });
          }
        },


        assertions: {
          iShouldSeeCreateTenantPage: function() {
            return this.waitFor({
              timeout: 30,
              controlType : "sap.tnt.ToolPage",
              id: "main-component---createTenant--createTenant",
              success: function(oControl) {
                Opa5.assert.ok(oControl, "Create Tenant page is found");
              },
              errorMessage: "Did not find Create Tenant page"
            });
          },
          iShouldSeeInputWith: function(id, value) {
            return this.waitFor({
              controlType: "sap.m.Input",
              matchers: [
                new sap.ui.test.matchers.PropertyStrictEquals({name: "value", value: value}),
                new sap.ui.test.matchers.PropertyStrictEquals({name: "id", value: 'main-component---createTenant--' + id})
              ],
              success: (aControls) => {
                Opa5.assert.ok(aControls.length > 0, "Input with wanted value is found");
              },
              errorMessage: "Input with wanted value is not found"
            });
          },
          tenantShouldNotBeInModel: function(value) {
            return this.waitFor({
              controlType: "sap.tnt.ToolPage",
              id: "main-component---createTenant--createTenant",
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
          tenantShouldBeInModel: function(value) {
            return this.waitFor({
              controlType: "sap.tnt.ToolPage",
              id: "main-component---createTenant--createTenant",
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
