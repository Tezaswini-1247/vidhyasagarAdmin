"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const strapiAdmin = require("@strapi/admin/strapi-admin");
const reactIntl = require("react-intl");
const Form = require("./Form-aTchNxab.js");
const index = require("./index-BN1pPa5v.js");
const hooks = require("./hooks-BAaaKPS_.js");
const objects = require("./objects-BcXOv6_9.js");
function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const React__namespace = /* @__PURE__ */ _interopNamespace(React);
const EditConfigurationPage = () => {
  const { trackUsage } = strapiAdmin.useTracking();
  const { formatMessage } = reactIntl.useIntl();
  const { toggleNotification } = strapiAdmin.useNotification();
  const { _unstableFormatAPIError: formatAPIError } = strapiAdmin.useAPIErrorHandler();
  const { isLoading: isLoadingSchema, schema, model } = index.useDoc();
  const { isLoading: isLoadingLayout, error, list, edit } = index.useDocLayout();
  const {
    fieldSizes,
    error: errorFieldSizes,
    isLoading: isLoadingFieldSizes,
    isFetching: isFetchingFieldSizes
  } = index.useGetInitialDataQuery(void 0, {
    selectFromResult: (res) => {
      const fieldSizes2 = Object.entries(res.data?.fieldSizes ?? {}).reduce((acc, [attributeName, { default: size }]) => {
        acc[attributeName] = size;
        return acc;
      }, {});
      return {
        isFetching: res.isFetching,
        isLoading: res.isLoading,
        error: res.error,
        fieldSizes: fieldSizes2
      };
    }
  });
  React__namespace.useEffect(() => {
    if (errorFieldSizes) {
      toggleNotification({
        type: "danger",
        message: formatAPIError(errorFieldSizes)
      });
    }
  }, [errorFieldSizes, formatAPIError, toggleNotification]);
  const isLoading = isLoadingSchema || isLoadingLayout || isLoadingFieldSizes || isFetchingFieldSizes;
  const [updateConfiguration] = index.useUpdateContentTypeConfigurationMutation();
  const handleSubmit = async (data) => {
    try {
      trackUsage("willSaveContentTypeLayout");
      const meta = Object.entries(list.metadatas).reduce(
        (acc, [name, { mainField: _mainField, ...listMeta }]) => {
          const existingEditMeta = edit.metadatas[name];
          const {
            __temp_key__,
            size: _size,
            name: _name,
            ...editedMetadata
          } = data.layout.flatMap((row) => row.children).find((field) => field.name === name) ?? {};
          acc[name] = {
            edit: {
              ...existingEditMeta,
              ...editedMetadata
            },
            list: listMeta
          };
          return acc;
        },
        {}
      );
      const res = await updateConfiguration({
        layouts: {
          edit: data.layout.map(
            (row) => row.children.reduce((acc, { name, size }) => {
              if (name !== Form.TEMP_FIELD_NAME) {
                return [...acc, { name, size }];
              }
              return acc;
            }, [])
          ),
          list: list.layout.map((field) => field.name)
        },
        settings: objects.setIn(data.settings, "displayName", void 0),
        metadatas: meta,
        uid: model
      });
      if ("data" in res) {
        trackUsage("didEditEditSettings");
        toggleNotification({
          type: "success",
          message: formatMessage({ id: "notification.success.saved", defaultMessage: "Saved" })
        });
      } else {
        toggleNotification({
          type: "danger",
          message: formatAPIError(res.error)
        });
      }
    } catch {
      toggleNotification({
        type: "danger",
        message: formatMessage({ id: "notification.error", defaultMessage: "An error occurred" })
      });
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Page.Loading, {});
  }
  if (errorFieldSizes || error || !schema) {
    return /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Page.Error, {});
  }
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Page.Title, { children: `Configure ${edit.settings.displayName} Edit View` }),
    /* @__PURE__ */ jsxRuntime.jsx(
      Form.ConfigurationForm,
      {
        onSubmit: handleSubmit,
        attributes: schema.attributes,
        fieldSizes,
        layout: edit
      }
    )
  ] });
};
const ProtectedEditConfigurationPage = () => {
  const permissions = hooks.useTypedSelector(
    (state) => state.admin_app.permissions.contentManager?.collectionTypesConfigurations
  );
  return /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Page.Protect, { permissions, children: /* @__PURE__ */ jsxRuntime.jsx(EditConfigurationPage, {}) });
};
exports.EditConfigurationPage = EditConfigurationPage;
exports.ProtectedEditConfigurationPage = ProtectedEditConfigurationPage;
//# sourceMappingURL=EditConfigurationPage-q76oeVU1.js.map
