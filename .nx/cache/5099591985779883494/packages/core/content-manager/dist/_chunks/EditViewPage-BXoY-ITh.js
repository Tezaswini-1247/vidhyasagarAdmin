"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const strapiAdmin = require("@strapi/admin/strapi-admin");
const designSystem = require("@strapi/design-system");
const reactIntl = require("react-intl");
const reactRouterDom = require("react-router-dom");
const styledComponents = require("styled-components");
const index = require("./index-BN1pPa5v.js");
const Field = require("./Field-Dj1nOvt8.js");
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
const useOnce = (effect) => React__namespace.useEffect(effect, emptyDeps);
const emptyDeps = [];
const FormLayout = ({ layout }) => {
  const { formatMessage } = reactIntl.useIntl();
  const { model } = index.useDoc();
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { direction: "column", alignItems: "stretch", gap: 6, children: layout.map((panel, index2) => {
    if (panel.some((row) => row.some((field) => field.type === "dynamiczone"))) {
      const [row] = panel;
      const [field] = row;
      const fieldWithTranslatedLabel = {
        ...field,
        label: formatMessage({
          id: `content-manager.content-types.${model}.${field.name}`,
          defaultMessage: field.label
        })
      };
      return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Root, { gap: 4, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 12, s: 12, xs: 12, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsxRuntime.jsx(Field.MemoizedInputRenderer, { ...fieldWithTranslatedLabel }) }) }, field.name);
    }
    return /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.Box,
      {
        hasRadius: true,
        background: "neutral0",
        shadow: "tableShadow",
        paddingLeft: 6,
        paddingRight: 6,
        paddingTop: 6,
        paddingBottom: 6,
        borderColor: "neutral150",
        children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { direction: "column", alignItems: "stretch", gap: 6, children: panel.map((row, gridRowIndex) => /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Root, { gap: 4, children: row.map(({ size, ...field }) => {
          const fieldWithTranslatedLabel = {
            ...field,
            label: formatMessage({
              id: `content-manager.content-types.${model}.${field.name}`,
              defaultMessage: field.label
            })
          };
          return /* @__PURE__ */ jsxRuntime.jsx(
            designSystem.Grid.Item,
            {
              col: size,
              s: 12,
              xs: 12,
              direction: "column",
              alignItems: "stretch",
              children: /* @__PURE__ */ jsxRuntime.jsx(Field.MemoizedInputRenderer, { ...fieldWithTranslatedLabel })
            },
            field.name
          );
        }) }, gridRowIndex)) })
      },
      index2
    );
  }) });
};
const EditViewPage = () => {
  const location = reactRouterDom.useLocation();
  const [
    {
      query: { status }
    },
    setQuery
  ] = strapiAdmin.useQueryParams({
    status: "draft"
  });
  const { formatMessage } = reactIntl.useIntl();
  const { toggleNotification } = strapiAdmin.useNotification();
  const {
    document,
    meta,
    isLoading: isLoadingDocument,
    schema,
    components,
    collectionType,
    id,
    model,
    hasError
  } = index.useDoc();
  const hasDraftAndPublished = schema?.options?.draftAndPublish ?? false;
  useOnce(() => {
    if (location?.state && "error" in location.state) {
      toggleNotification({
        type: "danger",
        message: location.state.error,
        timeout: 5e3
      });
    }
  });
  const isLoadingActionsRBAC = index.useDocumentRBAC("EditViewPage", (state) => state.isLoading);
  const isSingleType = collectionType === index.SINGLE_TYPES;
  const isCreatingDocument = !id && !isSingleType;
  const {
    isLoading: isLoadingLayout,
    edit: {
      layout,
      settings: { mainField }
    }
  } = index.useDocumentLayout(model);
  const { isLazyLoading } = Field.useLazyComponents([]);
  const isLoading = isLoadingActionsRBAC || isLoadingDocument || isLoadingLayout || isLazyLoading;
  const initialValues = React__namespace.useMemo(() => {
    if (!document && !isCreatingDocument && !isSingleType || !schema) {
      return void 0;
    }
    const form = document?.id ? document : Field.createDefaultForm(schema, components);
    return Field.transformDocument(schema, components)(form);
  }, [document, isCreatingDocument, isSingleType, schema, components]);
  if (hasError) {
    return /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Page.Error, {});
  }
  if (isLoading && !document?.documentId) {
    return /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Page.Loading, {});
  }
  if (!initialValues) {
    return /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Page.Error, {});
  }
  const handleTabChange = (status2) => {
    if (status2 === "published" || status2 === "draft") {
      setQuery({ status: status2 }, "push", true);
    }
  };
  let documentTitle = "Untitled";
  if (mainField !== "id" && document?.[mainField]) {
    documentTitle = document[mainField];
  } else if (isSingleType && schema?.info.displayName) {
    documentTitle = schema.info.displayName;
  }
  const validateSync = (values, options) => {
    const yupSchema = index.createYupSchema(schema?.attributes, components, {
      status,
      ...options
    });
    return yupSchema.validateSync(values, { abortEarly: false });
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Main, { paddingLeft: 10, paddingRight: 10, children: [
    /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Page.Title, { children: documentTitle }),
    /* @__PURE__ */ jsxRuntime.jsx(
      strapiAdmin.Form,
      {
        disabled: hasDraftAndPublished && status === "published",
        initialValues,
        method: isCreatingDocument ? "POST" : "PUT",
        validate: (values, options) => {
          const yupSchema = index.createYupSchema(schema?.attributes, components, {
            status,
            ...options
          });
          return yupSchema.validate(values, { abortEarly: false });
        },
        initialErrors: location?.state?.forceValidation ? validateSync(initialValues, {}) : {},
        children: ({ resetForm }) => /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            index.Header,
            {
              isCreating: isCreatingDocument,
              status: hasDraftAndPublished ? getDocumentStatus(document, meta) : void 0,
              title: documentTitle
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Tabs.Root, { variant: "simple", value: status, onValueChange: handleTabChange, children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              designSystem.Tabs.List,
              {
                "aria-label": formatMessage({
                  id: index.getTranslation("containers.edit.tabs.label"),
                  defaultMessage: "Document status"
                }),
                children: hasDraftAndPublished ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntime.jsx(StatusTab, { value: "draft", children: formatMessage({
                    id: index.getTranslation("containers.edit.tabs.draft"),
                    defaultMessage: "draft"
                  }) }),
                  /* @__PURE__ */ jsxRuntime.jsx(
                    StatusTab,
                    {
                      disabled: !meta || meta.availableStatus.length === 0,
                      value: "published",
                      children: formatMessage({
                        id: index.getTranslation("containers.edit.tabs.published"),
                        defaultMessage: "published"
                      })
                    }
                  )
                ] }) : null
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Grid.Root, { paddingTop: 8, gap: 4, children: [
              /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Grid.Item, { col: 9, s: 12, direction: "column", alignItems: "stretch", children: [
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tabs.Content, { value: "draft", children: /* @__PURE__ */ jsxRuntime.jsx(FormLayout, { layout }) }),
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tabs.Content, { value: "published", children: /* @__PURE__ */ jsxRuntime.jsx(FormLayout, { layout }) })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 3, s: 12, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsxRuntime.jsx(index.Panels, {}) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx(
            strapiAdmin.Blocker,
            {
              onProceed: resetForm
            }
          )
        ] })
      }
    )
  ] });
};
const StatusTab = styledComponents.styled(designSystem.Tabs.Trigger)`
  text-transform: uppercase;
`;
const getDocumentStatus = (document, meta) => {
  const docStatus = document?.status;
  const statuses = meta?.availableStatus ?? [];
  if (!docStatus) {
    return "draft";
  }
  if (docStatus === "draft" && statuses.find((doc) => doc.publishedAt !== null)) {
    return "published";
  }
  return docStatus;
};
const ProtectedEditViewPage = () => {
  const { slug = "" } = reactRouterDom.useParams();
  const {
    permissions = [],
    isLoading,
    error
  } = strapiAdmin.useRBAC(
    index.PERMISSIONS.map((action) => ({
      action,
      subject: slug
    }))
  );
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Page.Loading, {});
  }
  if (error || !slug) {
    return /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Page.Error, {});
  }
  return /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Page.Protect, { permissions, children: ({ permissions: permissions2 }) => /* @__PURE__ */ jsxRuntime.jsx(index.DocumentRBAC, { permissions: permissions2, children: /* @__PURE__ */ jsxRuntime.jsx(EditViewPage, {}) }) });
};
exports.EditViewPage = EditViewPage;
exports.ProtectedEditViewPage = ProtectedEditViewPage;
exports.getDocumentStatus = getDocumentStatus;
//# sourceMappingURL=EditViewPage-BXoY-ITh.js.map
