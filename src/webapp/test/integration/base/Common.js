sap.ui.define([
    "sap/ui/test/Opa5"
  ],
  function (Opa5) {
    "use strict";

    function getFrameUrl(sHash, sUrlParameters) {
      sHash = sHash || "";
      var sUrl = jQuery.sap.getResourcePath("index", ".html");

      if (sUrlParameters) {
        sUrlParameters = "?" + sUrlParameters;
      }

      return sUrl + sUrlParameters + "#" + sHash;
    }

    return Opa5.extend("test.opa.base.Common", {

      constructor: function (oConfig) {
        Opa5.apply(this, arguments);

        this._oConfig = oConfig;
      },

      iStartMyApp: function (oOptions) {
        // var sUrlParameters;
        // oOptions = oOptions || { delay: 1000 };
        //
        // sUrlParameters = "serverDelay=" + oOptions.delay;
        //
        // this.iStartMyAppInAFrame(getFrameUrl(oOptions.hash, sUrlParameters));
        return this.iStartMyAppInAFrame("../../index.html");

        // var oOptions = oOptionsParameter || {};

        // this._clearSharedData();

        // start the app with a minimal delay to make tests fast but still async to discover basic timing issues
        // oOptions.delay = oOptions.delay || 50;

        // configure mock server with the current options
        // var oMockserverInitialized = mockserver.init(oOptions);

        // this.iWaitForPromise(oMockserverInitialized);
        // start the app UI component
        // this.iStartMyUIComponent({
        //   componentConfig: {
        //     name: "UI5toLearn",
        //     async: true
        //   },
        //   hash: oOptions.hash,
        //   autoWait: oOptions.autoWait
        // });
      },

      iLookAtTheScreen: function () {
        return this;
      }
    });
  });
