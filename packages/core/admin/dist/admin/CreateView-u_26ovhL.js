'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const Theme = require('./Theme-B3Vl7PO-.js');
const EditViewPage = require('./EditViewPage-BYGUYLJ3.js');

const ProtectedCreateView = () => {
  const permissions = Theme.useTypedSelector(
    (state) => state.admin_app.permissions.settings?.["api-tokens"].create
  );
  return /* @__PURE__ */ jsxRuntime.jsx(Theme.Page.Protect, { permissions, children: /* @__PURE__ */ jsxRuntime.jsx(EditViewPage.EditView, {}) });
};

exports.ProtectedCreateView = ProtectedCreateView;
//# sourceMappingURL=CreateView-u_26ovhL.js.map
