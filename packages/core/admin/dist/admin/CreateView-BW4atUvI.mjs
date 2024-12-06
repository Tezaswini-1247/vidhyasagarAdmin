import { jsx } from 'react/jsx-runtime';
import { b as useTypedSelector, P as Page } from './Theme-DQRUlj-X.mjs';
import { EditView } from './EditViewPage-Ch2Vfp6q.mjs';

const ProtectedCreateView = () => {
  const permissions = useTypedSelector(
    (state) => state.admin_app.permissions.settings?.["api-tokens"].create
  );
  return /* @__PURE__ */ jsx(Page.Protect, { permissions, children: /* @__PURE__ */ jsx(EditView, {}) });
};

export { ProtectedCreateView };
//# sourceMappingURL=CreateView-BW4atUvI.mjs.map
