"use strict";
const JSDOMEnvironment = require("jest-environment-jsdom");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const JSDOMEnvironment__default = /* @__PURE__ */ _interopDefault(JSDOMEnvironment);
class CustomJSDOMEnvironment extends JSDOMEnvironment__default.default {
  constructor(...args) {
    super(...args);
    this.global.structuredClone = structuredClone;
  }
}
module.exports = CustomJSDOMEnvironment;
//# sourceMappingURL=environment.js.map
