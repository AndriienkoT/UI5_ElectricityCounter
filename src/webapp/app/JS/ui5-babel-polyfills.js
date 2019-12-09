/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "polyfill" }]*/
import polyfill from "./lib/polyfill"; // Here is where are imported the babel polyfills resources.

let oLibrary = sap.ui.getCore().initLibrary({
  name: "custom.libs.external.polyfill",
  noLibraryCSS: true
});

export default oLibrary;
