"use strict";
const assert = require("node:assert");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const assert__default = /* @__PURE__ */ _interopDefault(assert);
const formData__default = /* @__PURE__ */ _interopDefault(formData);
const Mailgun__default = /* @__PURE__ */ _interopDefault(Mailgun);
const DEFAULT_OPTIONS = {
  username: "api"
};
const index = {
  init(providerOptions, settings) {
    assert__default.default(providerOptions.key, "Mailgun API key is required");
    assert__default.default(providerOptions.domain, "Mailgun domain is required");
    const mailgun = new Mailgun__default.default(formData__default.default);
    const mg = mailgun.client({
      ...DEFAULT_OPTIONS,
      ...providerOptions
    });
    return {
      send(options) {
        const { from, to, cc, bcc, replyTo, subject, text, html, ...rest } = options;
        const data = {
          from: from || settings.defaultFrom,
          to,
          cc,
          bcc,
          "h:Reply-To": replyTo || settings.defaultReplyTo,
          subject,
          text,
          html,
          ...rest
        };
        return mg.messages.create(providerOptions.domain, data);
      }
    };
  }
};
module.exports = index;
//# sourceMappingURL=index.js.map
