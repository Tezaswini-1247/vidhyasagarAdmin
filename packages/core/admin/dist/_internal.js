"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const styles = `
.strapi--root {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #fff;
}

.strapi--no-js {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-family: helvetica, arial, sans-serif;
}
`;
const NoJavascript = () => {
  return /* @__PURE__ */ jsxRuntime.jsx("noscript", { children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "strapi--root", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "strapi--no-js", children: [
    /* @__PURE__ */ jsxRuntime.jsx("style", { type: "text/css", children: styles }),
    /* @__PURE__ */ jsxRuntime.jsx("h1", { children: "JavaScript disabled" }),
    /* @__PURE__ */ jsxRuntime.jsxs("p", { children: [
      "Please ",
      /* @__PURE__ */ jsxRuntime.jsx("a", { href: "https://www.enable-javascript.com/", children: "enable JavaScript" }),
      " in your browser and reload the page to proceed."
    ] })
  ] }) }) });
};
const globalStyles = `
  html,
  body,
  #strapi {
    height: 100%;
  }
  body {
    margin: 0;
    -webkit-font-smoothing: antialiased;
  }
`;
const DefaultDocument = ({ entryPath }) => {
  return /* @__PURE__ */ jsxRuntime.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("head", { children: [
      /* @__PURE__ */ jsxRuntime.jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsxRuntime.jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" }),
      /* @__PURE__ */ jsxRuntime.jsx("meta", { name: "robots", content: "noindex" }),
      /* @__PURE__ */ jsxRuntime.jsx("meta", { name: "referrer", content: "same-origin" }),
      /* @__PURE__ */ jsxRuntime.jsx("title", { children: "AI4Mahila Admin" }),
      /* @__PURE__ */ jsxRuntime.jsx("style", { children: globalStyles })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("body", { children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { id: "strapi" }),
      /* @__PURE__ */ jsxRuntime.jsx(NoJavascript, {}),
      entryPath ? /* @__PURE__ */ jsxRuntime.jsx("script", { type: "module", src: entryPath }) : null
    ] })
  ] });
};
exports.DefaultDocument = DefaultDocument;
//# sourceMappingURL=_internal.js.map
