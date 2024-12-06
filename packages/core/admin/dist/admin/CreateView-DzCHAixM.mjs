import { jsx } from 'react/jsx-runtime';
import { b as useTypedSelector, P as Page } from './Theme-DQRUlj-X.mjs';
import { EditView } from './EditView-AdO6Xcay.mjs';

const ProtectedCreateView = () => {
  const permissions = useTypedSelector(
    (state) => state.admin_app.permissions.settings?.["transfer-tokens"].create
  );
  return /* @__PURE__ */ jsx(Page.Protect, { permissions, children: /* @__PURE__ */ jsx(EditView, {}) });
};

export { ProtectedCreateView };
//# sourceMappingURL=CreateView-DzCHAixM.mjs.map
