'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const EditPage = require('./EditPage-o11xwcnG.js');

const eeTables = {
  "review-workflows": {
    "review-workflows": ["review-workflows.updateEntryStage"]
  },
  releases: {
    releases: ["releases.publish"]
  }
};
const getHeaders = (table) => {
  switch (table) {
    case "review-workflows":
      return () => [{ id: "review-workflows.updateEntryStage", defaultMessage: "Stage Change" }];
    case "releases":
      return () => [{ id: "releases.publish", defaultMessage: "Publish" }];
  }
};
const EventsTableEE = () => {
  return /* @__PURE__ */ jsxRuntime.jsxs(EditPage.Events.Root, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(EditPage.Events.Headers, {}),
    /* @__PURE__ */ jsxRuntime.jsx(EditPage.Events.Body, {}),
    Object.keys(eeTables).map((table) => /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(EditPage.Events.Headers, { getHeaders: getHeaders(table) }),
      /* @__PURE__ */ jsxRuntime.jsx(EditPage.Events.Body, { providedEvents: eeTables[table] })
    ] }))
  ] });
};

exports.EventsTableEE = EventsTableEE;
//# sourceMappingURL=EventsTable-CpekozX5.js.map
