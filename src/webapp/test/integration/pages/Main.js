sap.ui.require([
    'sap/ui/test/Opa5',
    'test/opa/base/Common'
  ],
  function(Opa5, Common) {

    Opa5.createPageObjects({
      onMainPage: {
        baseClass: Common,
        actions: {
          iPressLink: function (id) {
            return this.waitFor({
              id : "main-component---main--" + id,
              success: (control) => {
                control.firePress();
              },
              errorMessage : "did not find the link"
            });
          }
        },
        assertions: {
          iShouldSeeMainPage: function() {
            return this.waitFor({
              timeout: 30,
              controlType : "sap.tnt.ToolPage",
              id: "main-component---main--main",
              success: function(oControl) {
                Opa5.assert.ok(oControl, "Main page is not here");
              },
              errorMessage: "Did not find Main page"
            });
          }
        }
      }
    });
  });
