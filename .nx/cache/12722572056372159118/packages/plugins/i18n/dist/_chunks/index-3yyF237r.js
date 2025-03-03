"use strict";
const get = require("lodash/get");
const yup = require("yup");
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const designSystem = require("@strapi/design-system");
const icons = require("@strapi/icons");
const reactIntl = require("react-intl");
const styledComponents = require("styled-components");
const query = require("@reduxjs/toolkit/query");
const strapiAdmin = require("@strapi/admin/strapi-admin");
const strapiAdmin$1 = require("@strapi/content-manager/strapi-admin");
const reactRouterDom = require("react-router-dom");
const qs = require("qs");
const omit = require("lodash/omit");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
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
const get__default = /* @__PURE__ */ _interopDefault(get);
const yup__namespace = /* @__PURE__ */ _interopNamespace(yup);
const React__namespace = /* @__PURE__ */ _interopNamespace(React);
const qs__namespace = /* @__PURE__ */ _interopNamespace(qs);
const omit__default = /* @__PURE__ */ _interopDefault(omit);
const __variableDynamicImportRuntimeHelper = (glob, path, segs) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(
      reject.bind(
        null,
        new Error(
          "Unknown variable dynamic import: " + path + (path.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : "")
        )
      )
    );
  });
};
const pluginId = "i18n";
const getTranslation = (id) => `${pluginId}.${id}`;
const TextAlignTypography = styledComponents.styled(designSystem.Typography)`
  text-align: center;
`;
const CheckboxConfirmation = ({
  description,
  isCreating = false,
  intlLabel,
  name,
  onChange,
  value
}) => {
  const { formatMessage } = reactIntl.useIntl();
  const [isOpen, setIsOpen] = React__namespace.useState(false);
  const handleChange = (value2) => {
    if (isCreating || value2) {
      return onChange({ target: { name, value: value2, type: "checkbox" } });
    }
    if (!value2) {
      return setIsOpen(true);
    }
    return null;
  };
  const handleConfirm = () => {
    onChange({ target: { name, value: false, type: "checkbox" } });
  };
  const label = intlLabel.id ? formatMessage(
    { id: intlLabel.id, defaultMessage: intlLabel.defaultMessage },
    { ...intlLabel.values }
  ) : name;
  const hint = description ? formatMessage(
    { id: description.id, defaultMessage: description.defaultMessage },
    { ...description.values }
  ) : "";
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Dialog.Root, { open: isOpen, onOpenChange: setIsOpen, children: [
    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { hint, name, children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Checkbox, { onCheckedChange: handleChange, checked: value, children: label }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Hint, {})
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Dialog.Content, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Dialog.Header, { children: formatMessage({
        id: getTranslation("CheckboxConfirmation.Modal.title"),
        defaultMessage: "Disable localization"
      }) }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Dialog.Body, { icon: /* @__PURE__ */ jsxRuntime.jsx(icons.WarningCircle, {}), children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", alignItems: "stretch", gap: 2, children: [
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { justifyContent: "center", children: /* @__PURE__ */ jsxRuntime.jsx(TextAlignTypography, { children: formatMessage({
          id: getTranslation("CheckboxConfirmation.Modal.content"),
          defaultMessage: "Disabling localization will engender the deletion of all your content but the one associated to your default locale (if existing)."
        }) }) }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { justifyContent: "center", children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { fontWeight: "semiBold", children: formatMessage({
          id: getTranslation("CheckboxConfirmation.Modal.body"),
          defaultMessage: "Do you want to disable it?"
        }) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Dialog.Footer, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Dialog.Cancel, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { variant: "tertiary", children: formatMessage({
          id: "components.popUpWarning.button.cancel",
          defaultMessage: "No, cancel"
        }) }) }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Dialog.Action, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { variant: "danger-light", onClick: handleConfirm, children: formatMessage({
          id: getTranslation("CheckboxConfirmation.Modal.button-confirm"),
          defaultMessage: "Yes, disable"
        }) }) })
      ] })
    ] })
  ] });
};
const LOCALIZED_FIELDS = [
  "biginteger",
  "boolean",
  "component",
  "date",
  "datetime",
  "decimal",
  "dynamiczone",
  "email",
  "enumeration",
  "float",
  "integer",
  "json",
  "media",
  "number",
  "password",
  "richtext",
  "blocks",
  "string",
  "text",
  "time"
];
const doesPluginOptionsHaveI18nLocalized = (opts) => typeof opts === "object" && opts !== null && "i18n" in opts && typeof opts.i18n === "object" && opts.i18n !== null && "localized" in opts.i18n && typeof opts.i18n.localized === "boolean";
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const useI18n = () => {
  const params = reactRouterDom.useParams();
  const userPermissions = strapiAdmin.useAuth("useI18n", (state) => state.permissions);
  const actions = React__namespace.useMemo(() => {
    const permissions = userPermissions.filter((permission) => permission.subject === params.slug);
    return permissions.reduce(
      (acc, permission) => {
        const [actionShorthand] = permission.action.split(".").slice(-1);
        return {
          ...acc,
          [`can${capitalize(actionShorthand)}`]: permission.properties?.locales ?? []
        };
      },
      { canCreate: [], canRead: [], canUpdate: [], canDelete: [], canPublish: [] }
    );
  }, [params.slug, userPermissions]);
  const { schema } = strapiAdmin$1.unstable_useDocument(
    {
      // We can non-null assert these because below we skip the query if they are not present
      collectionType: params.collectionType,
      model: params.slug
    },
    {
      skip: true
    }
  );
  if (doesPluginOptionsHaveI18nLocalized(schema?.pluginOptions)) {
    return {
      hasI18n: schema.pluginOptions.i18n.localized,
      ...actions
    };
  }
  return {
    hasI18n: false,
    ...actions
  };
};
const i18nApi = strapiAdmin.adminApi.enhanceEndpoints({
  addTagTypes: ["Locale"]
});
const localesApi = i18nApi.injectEndpoints({
  endpoints: (builder) => ({
    createLocale: builder.mutation({
      query: (data) => ({
        url: "/i18n/locales",
        method: "POST",
        data
      }),
      invalidatesTags: [{ type: "Locale", id: "LIST" }]
    }),
    deleteLocale: builder.mutation({
      query: (id) => ({
        url: `/i18n/locales/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: (result, error, id) => [{ type: "Locale", id }]
    }),
    getLocales: builder.query({
      query: () => "/i18n/locales",
      providesTags: (res) => [
        { type: "Locale", id: "LIST" },
        ...Array.isArray(res) ? res.map((locale) => ({
          type: "Locale",
          id: locale.id
        })) : []
      ]
    }),
    getDefaultLocales: builder.query({
      query: () => "/i18n/iso-locales"
    }),
    updateLocale: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/i18n/locales/${id}`,
        method: "PUT",
        data
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Locale", id }]
    })
  })
});
const {
  useCreateLocaleMutation,
  useDeleteLocaleMutation,
  useGetLocalesQuery,
  useGetDefaultLocalesQuery,
  useUpdateLocaleMutation
} = localesApi;
const relationsApi = i18nApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getManyDraftRelationCount: builder.query({
      query: ({ model, ...params }) => ({
        url: `/content-manager/collection-types/${model}/actions/countManyEntriesDraftRelations`,
        method: "GET",
        config: {
          params
        }
      }),
      transformResponse: (response) => response.data
    })
  })
});
const { useGetManyDraftRelationCountQuery } = relationsApi;
const cleanData = (data, schema, components) => {
  const cleanedData = removeFields(data, [
    "createdAt",
    "createdBy",
    "updatedAt",
    "updatedBy",
    "id",
    "documentId",
    "publishedAt",
    "strapi_stage",
    "strapi_assignee",
    "locale",
    "status"
  ]);
  const cleanedDataWithoutPasswordAndRelation = recursiveRemoveFieldTypes(
    cleanedData,
    schema,
    components,
    ["relation", "password"]
  );
  return cleanedDataWithoutPasswordAndRelation;
};
const removeFields = (data, fields) => {
  return Object.keys(data).reduce((acc, current) => {
    if (fields.includes(current)) {
      return acc;
    }
    acc[current] = data[current];
    return acc;
  }, {});
};
const recursiveRemoveFieldTypes = (data, schema, components, fields) => {
  return Object.keys(data).reduce((acc, current) => {
    const attribute = schema.attributes[current] ?? { type: void 0 };
    if (fields.includes(attribute.type)) {
      return acc;
    }
    if (attribute.type === "dynamiczone") {
      acc[current] = data[current].map((componentValue, index2) => {
        const { id: _, ...rest } = recursiveRemoveFieldTypes(
          componentValue,
          components[componentValue.__component],
          components,
          fields
        );
        return {
          ...rest,
          __temp_key__: index2 + 1
        };
      });
    } else if (attribute.type === "component") {
      const { repeatable, component } = attribute;
      if (repeatable) {
        acc[current] = (data[current] ?? []).map((compoData, index2) => {
          const { id: _, ...rest } = recursiveRemoveFieldTypes(
            compoData,
            components[component],
            components,
            fields
          );
          return {
            ...rest,
            __temp_key__: index2 + 1
          };
        });
      } else {
        const { id: _, ...rest } = recursiveRemoveFieldTypes(
          data[current] ?? {},
          components[component],
          components,
          fields
        );
        acc[current] = rest;
      }
    } else {
      acc[current] = data[current];
    }
    return acc;
  }, {});
};
const isErrorMessageDescriptor = (object) => {
  return typeof object === "object" && object !== null && "id" in object && "defaultMessage" in object;
};
const EntryValidationText = ({
  status = "draft",
  validationErrors,
  action
}) => {
  const { formatMessage } = reactIntl.useIntl();
  const getErrorStr = (key, value) => {
    if (typeof value === "string") {
      return `${key}: ${value}`;
    } else if (isErrorMessageDescriptor(value)) {
      return `${key}: ${formatMessage(value)}`;
    } else if (Array.isArray(value)) {
      return value.map((v) => getErrorStr(key, v)).join(" ");
    } else if (typeof value === "object" && !Array.isArray(value)) {
      return Object.entries(value).map(([k, v]) => getErrorStr(k, v)).join(" ");
    } else {
      return "";
    }
  };
  if (validationErrors) {
    const validationErrorsMessages = Object.entries(validationErrors).map(([key, value]) => {
      return getErrorStr(key, value);
    }).join(" ");
    return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 2, children: [
      /* @__PURE__ */ jsxRuntime.jsx(icons.CrossCircle, { fill: "danger600" }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tooltip, { label: validationErrorsMessages, children: /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Typography,
        {
          maxWidth: "30rem",
          textColor: "danger600",
          variant: "omega",
          fontWeight: "semiBold",
          ellipsis: true,
          children: validationErrorsMessages
        }
      ) })
    ] });
  }
  const getStatusMessage = () => {
    if (action === "bulk-publish") {
      if (status === "published") {
        return {
          icon: /* @__PURE__ */ jsxRuntime.jsx(icons.CheckCircle, { fill: "success600" }),
          text: formatMessage({
            id: "content-manager.bulk-publish.already-published",
            defaultMessage: "Already Published"
          }),
          textColor: "success600",
          fontWeight: "bold"
        };
      } else if (status === "modified") {
        return {
          icon: /* @__PURE__ */ jsxRuntime.jsx(icons.ArrowsCounterClockwise, { fill: "alternative600" }),
          text: formatMessage({
            id: "app.utils.ready-to-publish-changes",
            defaultMessage: "Ready to publish changes"
          })
        };
      } else {
        return {
          icon: /* @__PURE__ */ jsxRuntime.jsx(icons.CheckCircle, { fill: "success600" }),
          text: formatMessage({
            id: "app.utils.ready-to-publish",
            defaultMessage: "Ready to publish"
          })
        };
      }
    } else {
      if (status === "draft") {
        return {
          icon: /* @__PURE__ */ jsxRuntime.jsx(icons.CheckCircle, { fill: "success600" }),
          text: formatMessage({
            id: "content-manager.bulk-unpublish.already-unpublished",
            defaultMessage: "Already Unpublished"
          }),
          textColor: "success600",
          fontWeight: "bold"
        };
      } else {
        return {
          icon: /* @__PURE__ */ jsxRuntime.jsx(icons.CheckCircle, { fill: "success600" }),
          text: formatMessage({
            id: "app.utils.ready-to-unpublish-changes",
            defaultMessage: "Ready to unpublish"
          }),
          textColor: "success600",
          fontWeight: "bold"
        };
      }
    }
  };
  const { icon, text, textColor = "success600", fontWeight = "normal" } = getStatusMessage();
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 2, children: [
    icon,
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textColor, fontWeight, children: text })
  ] });
};
const BoldChunk = (chunks) => /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { fontWeight: "bold", children: chunks });
const BulkLocaleActionModal = ({
  headers,
  rows,
  localesMetadata,
  validationErrors = {},
  action
}) => {
  const { formatMessage } = reactIntl.useIntl();
  const selectedRows = strapiAdmin.useTable(
    "BulkLocaleActionModal",
    (state) => state.selectedRows
  );
  const getFormattedCountMessage = () => {
    const currentStatusByLocale = rows.reduce((acc, { locale, status }) => {
      acc[locale] = status;
      return acc;
    }, {});
    const localesWithErrors = Object.keys(validationErrors);
    const publishedCount = selectedRows.filter(
      ({ locale }) => currentStatusByLocale[locale] === "published"
    ).length;
    const draftCount = selectedRows.filter(
      ({ locale }) => (currentStatusByLocale[locale] === "draft" || currentStatusByLocale[locale] === "modified") && !localesWithErrors.includes(locale)
    ).length;
    const withErrorsCount = localesWithErrors.length;
    const messageId = action === "bulk-publish" ? "content-manager.containers.list.selectedEntriesModal.selectedCount.publish" : "content-manager.containers.list.selectedEntriesModal.selectedCount.unpublish";
    const defaultMessage = action === "bulk-publish" ? "<b>{publishedCount}</b> {publishedCount, plural, =0 {entries} one {entry} other {entries}} already published. <b>{draftCount}</b> {draftCount, plural, =0 {entries} one {entry} other {entries}} ready to publish. <b>{withErrorsCount}</b> {withErrorsCount, plural, =0 {entries} one {entry} other {entries}} waiting for action." : "<b>{draftCount}</b> {draftCount, plural, =0 {entries} one {entry} other {entries}} already unpublished. <b>{publishedCount}</b> {publishedCount, plural, =0 {entries} one {entry} other {entries}} ready to unpublish.";
    return formatMessage(
      {
        id: messageId,
        defaultMessage
      },
      {
        withErrorsCount,
        draftCount,
        publishedCount,
        b: BoldChunk
      }
    );
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Modal.Body, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { children: getFormattedCountMessage() }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { marginTop: 5, children: /* @__PURE__ */ jsxRuntime.jsxs(strapiAdmin.Table.Content, { children: [
      /* @__PURE__ */ jsxRuntime.jsxs(strapiAdmin.Table.Head, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Table.HeaderCheckboxCell, {}),
        headers.map((head) => /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Table.HeaderCell, { ...head }, head.name))
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Table.Body, { children: rows.map(({ locale, status }, index2) => {
        const error = validationErrors?.[locale] ?? null;
        const statusVariant = status === "draft" ? "primary" : status === "published" ? "success" : "alternative";
        return /* @__PURE__ */ jsxRuntime.jsxs(strapiAdmin.Table.Row, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Table.CheckboxCell, { id: locale, "aria-label": `Select ${locale}` }),
          /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Table.Cell, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "sigma", textColor: "neutral600", children: Array.isArray(localesMetadata) ? localesMetadata.find((localeEntry) => localeEntry.code === locale)?.name : locale }) }),
          /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Table.Cell, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { display: "flex", children: /* @__PURE__ */ jsxRuntime.jsx(
            designSystem.Status,
            {
              display: "flex",
              paddingLeft: "6px",
              paddingRight: "6px",
              paddingTop: "2px",
              paddingBottom: "2px",
              size: "S",
              variant: statusVariant,
              children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { tag: "span", variant: "pi", fontWeight: "bold", children: capitalize(status) })
            }
          ) }) }),
          /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Table.Cell, { children: /* @__PURE__ */ jsxRuntime.jsx(EntryValidationText, { validationErrors: error, status, action }) }),
          /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Table.Cell, { children: /* @__PURE__ */ jsxRuntime.jsx(
            designSystem.IconButton,
            {
              tag: reactRouterDom.Link,
              to: {
                search: qs.stringify({ plugins: { i18n: { locale } } })
              },
              label: formatMessage(
                {
                  id: getTranslation("Settings.list.actions.edit"),
                  defaultMessage: "Edit {name} locale"
                },
                {
                  name: locale
                }
              ),
              variant: "ghost",
              children: /* @__PURE__ */ jsxRuntime.jsx(icons.Pencil, {})
            }
          ) })
        ] }, index2);
      }) })
    ] }) })
  ] });
};
const statusVariants = {
  draft: "secondary",
  published: "success",
  modified: "alternative"
};
const LocaleOption = ({
  isDraftAndPublishEnabled,
  locale,
  status,
  entryExists
}) => {
  const { formatMessage } = reactIntl.useIntl();
  if (!entryExists) {
    return formatMessage(
      {
        id: getTranslation("CMEditViewLocalePicker.locale.create"),
        defaultMessage: "Create <bold>{locale}</bold> locale"
      },
      {
        bold: (locale2) => /* @__PURE__ */ jsxRuntime.jsx("b", { children: locale2 }),
        locale: locale.name
      }
    );
  }
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { width: "100%", gap: 1, justifyContent: "space-between", children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { children: locale.name }),
    isDraftAndPublishEnabled ? /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.Status,
      {
        display: "flex",
        paddingLeft: "6px",
        paddingRight: "6px",
        paddingTop: "2px",
        paddingBottom: "2px",
        size: "S",
        variant: statusVariants[status],
        children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { tag: "span", variant: "pi", fontWeight: "bold", children: capitalize(status) })
      }
    ) : null
  ] });
};
const LocalePickerAction = ({
  document,
  meta,
  model,
  collectionType,
  documentId
}) => {
  const { formatMessage } = reactIntl.useIntl();
  const [{ query: query2 }, setQuery] = strapiAdmin.useQueryParams();
  const { hasI18n, canCreate, canRead } = useI18n();
  const { data: locales = [] } = useGetLocalesQuery();
  const currentDesiredLocale = query2.plugins?.i18n?.locale;
  const { schema } = strapiAdmin$1.unstable_useDocument({
    model,
    collectionType,
    documentId,
    params: { locale: currentDesiredLocale }
  });
  const handleSelect = React__namespace.useCallback(
    (value) => {
      setQuery({
        plugins: {
          ...query2.plugins,
          i18n: {
            locale: value
          }
        }
      });
    },
    [query2.plugins, setQuery]
  );
  React__namespace.useEffect(() => {
    if (!Array.isArray(locales) || !hasI18n) {
      return;
    }
    const doesLocaleExist = locales.find((loc) => loc.code === currentDesiredLocale);
    const defaultLocale = locales.find((locale) => locale.isDefault);
    if (!doesLocaleExist && defaultLocale?.code) {
      handleSelect(defaultLocale.code);
    }
  }, [handleSelect, hasI18n, locales, currentDesiredLocale]);
  const currentLocale = Array.isArray(locales) ? locales.find((locale) => locale.code === currentDesiredLocale) : void 0;
  const allCurrentLocales = [
    { status: getDocumentStatus(document, meta), locale: currentLocale?.code },
    ...meta?.availableLocales ?? []
  ];
  if (!hasI18n || !Array.isArray(locales) || locales.length === 0) {
    return null;
  }
  const displayedLocales = locales.filter((locale) => {
    return canRead.includes(locale.code);
  });
  return {
    label: formatMessage({
      id: getTranslation("Settings.locales.modal.locales.label"),
      defaultMessage: "Locales"
    }),
    options: displayedLocales.map((locale) => {
      const entryWithLocaleExists = allCurrentLocales.some((doc) => doc.locale === locale.code);
      const currentLocaleDoc = allCurrentLocales.find(
        (doc) => "locale" in doc ? doc.locale === locale.code : false
      );
      const permissionsToCheck = currentLocaleDoc ? canRead : canCreate;
      return {
        disabled: !permissionsToCheck.includes(locale.code),
        value: locale.code,
        label: /* @__PURE__ */ jsxRuntime.jsx(
          LocaleOption,
          {
            isDraftAndPublishEnabled: !!schema?.options?.draftAndPublish,
            locale,
            status: currentLocaleDoc?.status,
            entryExists: entryWithLocaleExists
          }
        ),
        startIcon: !entryWithLocaleExists ? /* @__PURE__ */ jsxRuntime.jsx(icons.Plus, {}) : null
      };
    }),
    customizeContent: () => currentLocale?.name,
    onSelect: handleSelect,
    value: currentLocale
  };
};
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
const FillFromAnotherLocaleAction = ({
  documentId,
  meta,
  model,
  collectionType
}) => {
  const { formatMessage } = reactIntl.useIntl();
  const [{ query: query2 }] = strapiAdmin.useQueryParams();
  const { hasI18n } = useI18n();
  const currentDesiredLocale = query2.plugins?.i18n?.locale;
  const [localeSelected, setLocaleSelected] = React__namespace.useState(null);
  const setValues = strapiAdmin.useForm("FillFromAnotherLocale", (state) => state.setValues);
  const { getDocument } = strapiAdmin$1.unstable_useDocumentActions();
  const { schema, components } = strapiAdmin$1.unstable_useDocument({
    model,
    documentId,
    collectionType,
    params: { locale: currentDesiredLocale }
  });
  const { data: locales = [] } = useGetLocalesQuery();
  const availableLocales = Array.isArray(locales) ? locales.filter((locale) => meta?.availableLocales.some((l) => l.locale === locale.code)) : [];
  const fillFromLocale = (onClose) => async () => {
    const response = await getDocument({
      collectionType,
      model,
      documentId,
      params: { locale: localeSelected }
    });
    if (!response || !schema) {
      return;
    }
    const { data } = response;
    const cleanedData = cleanData(data, schema, components);
    setValues(cleanedData);
    onClose();
  };
  if (!hasI18n) {
    return null;
  }
  return {
    type: "icon",
    icon: /* @__PURE__ */ jsxRuntime.jsx(icons.Download, {}),
    disabled: availableLocales.length === 0,
    label: formatMessage({
      id: getTranslation("CMEditViewCopyLocale.copy-text"),
      defaultMessage: "Fill in from another locale"
    }),
    dialog: {
      type: "dialog",
      title: formatMessage({
        id: getTranslation("CMEditViewCopyLocale.dialog.title"),
        defaultMessage: "Confirmation"
      }),
      content: ({ onClose }) => /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Dialog.Body, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", gap: 3, children: [
          /* @__PURE__ */ jsxRuntime.jsx(icons.WarningCircle, { width: "24px", height: "24px", fill: "danger600" }),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textAlign: "center", children: formatMessage({
            id: getTranslation("CMEditViewCopyLocale.dialog.body"),
            defaultMessage: "Your current content will be erased and filled by the content of the selected locale:"
          }) }),
          /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { width: "100%", children: [
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { children: formatMessage({
              id: getTranslation("CMEditViewCopyLocale.dialog.field.label"),
              defaultMessage: "Locale"
            }) }),
            /* @__PURE__ */ jsxRuntime.jsx(
              designSystem.SingleSelect,
              {
                value: localeSelected,
                placeholder: formatMessage({
                  id: getTranslation("CMEditViewCopyLocale.dialog.field.placeholder"),
                  defaultMessage: "Select one locale..."
                }),
                onChange: (value) => setLocaleSelected(value),
                children: availableLocales.map((locale) => /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelectOption, { value: locale.code, children: locale.name }, locale.code))
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Dialog.Footer, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 2, width: "100%", children: [
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { flex: "auto", variant: "tertiary", onClick: onClose, children: formatMessage({
            id: getTranslation("CMEditViewCopyLocale.cancel-text"),
            defaultMessage: "No, cancel"
          }) }),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { flex: "auto", variant: "success", onClick: fillFromLocale(onClose), children: formatMessage({
            id: getTranslation("CMEditViewCopyLocale.submit-text"),
            defaultMessage: "Yes, fill in"
          }) })
        ] }) })
      ] })
    }
  };
};
const DeleteLocaleAction = ({
  document,
  documentId,
  model,
  collectionType
}) => {
  const { formatMessage } = reactIntl.useIntl();
  const navigate = reactRouterDom.useNavigate();
  const { toggleNotification } = strapiAdmin.useNotification();
  const { delete: deleteAction } = strapiAdmin$1.unstable_useDocumentActions();
  const { hasI18n, canDelete } = useI18n();
  const [{ query: query2 }] = strapiAdmin.useQueryParams();
  const { data: locales = [] } = useGetLocalesQuery();
  const currentDesiredLocale = query2.plugins?.i18n?.locale;
  const locale = !("error" in locales) && locales.find((loc) => loc.code === currentDesiredLocale);
  if (!hasI18n) {
    return null;
  }
  return {
    disabled: document?.locale && !canDelete.includes(document.locale) || !document || !document.id,
    position: ["header", "table-row"],
    label: formatMessage(
      {
        id: getTranslation("actions.delete.label"),
        defaultMessage: "Delete entry ({locale})"
      },
      { locale: locale && locale.name }
    ),
    icon: /* @__PURE__ */ jsxRuntime.jsx(StyledTrash, {}),
    variant: "danger",
    dialog: {
      type: "dialog",
      title: formatMessage({
        id: getTranslation("actions.delete.dialog.title"),
        defaultMessage: "Confirmation"
      }),
      content: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", gap: 2, children: [
        /* @__PURE__ */ jsxRuntime.jsx(icons.WarningCircle, { width: "24px", height: "24px", fill: "danger600" }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { tag: "p", variant: "omega", textAlign: "center", children: formatMessage({
          id: getTranslation("actions.delete.dialog.body"),
          defaultMessage: "Are you sure?"
        }) })
      ] }),
      onConfirm: async () => {
        const unableToDelete = (
          // We are unable to delete a collection type without a document ID
          // & unable to delete generally if there is no document locale
          collectionType !== "single-types" && !documentId || !document?.locale
        );
        if (unableToDelete) {
          console.error(
            "You're trying to delete a document without an id or locale, this is likely a bug with Strapi. Please open an issue."
          );
          toggleNotification({
            message: formatMessage({
              id: getTranslation("actions.delete.error"),
              defaultMessage: "An error occurred while trying to delete the document locale."
            }),
            type: "danger"
          });
          return;
        }
        const res = await deleteAction({
          documentId,
          model,
          collectionType,
          params: { locale: document.locale }
        });
        if (!("error" in res)) {
          navigate({ pathname: `../${collectionType}/${model}` }, { replace: true });
        }
      }
    }
  };
};
const BulkLocaleAction = ({
  document: baseDocument,
  documentId,
  model,
  collectionType,
  action
}) => {
  const baseLocale = baseDocument?.locale ?? null;
  const [{ query: query$1 }] = strapiAdmin.useQueryParams();
  const params = React__namespace.useMemo(() => strapiAdmin$1.buildValidParams(query$1), [query$1]);
  const isOnPublishedTab = query$1.status === "published";
  const { formatMessage } = reactIntl.useIntl();
  const { hasI18n, canPublish } = useI18n();
  const { toggleNotification } = strapiAdmin.useNotification();
  const { _unstableFormatAPIError: formatAPIError } = strapiAdmin.useAPIErrorHandler();
  const [selectedRows, setSelectedRows] = React__namespace.useState([]);
  const [isDraftRelationConfirmationOpen, setIsDraftRelationConfirmationOpen] = React__namespace.useState(false);
  const { publishMany: publishManyAction, unpublishMany: unpublishManyAction } = strapiAdmin$1.unstable_useDocumentActions();
  const {
    document,
    meta: documentMeta,
    schema,
    validate
  } = strapiAdmin$1.unstable_useDocument(
    {
      model,
      collectionType,
      documentId,
      params: {
        locale: baseLocale
      }
    },
    {
      skip: !hasI18n || !baseLocale
    }
  );
  const { data: localesMetadata = [] } = useGetLocalesQuery(hasI18n ? void 0 : query.skipToken);
  const headers = [
    {
      label: formatMessage({
        id: "global.name",
        defaultMessage: "Name"
      }),
      name: "name"
    },
    {
      label: formatMessage({
        id: getTranslation("CMEditViewBulkLocale.status"),
        defaultMessage: "Status"
      }),
      name: "status"
    },
    {
      label: formatMessage({
        id: getTranslation("CMEditViewBulkLocale.publication-status"),
        defaultMessage: "Publication Status"
      }),
      name: "publication-status"
    }
  ];
  const [rows, validationErrors] = React__namespace.useMemo(() => {
    if (!document || !documentMeta?.availableLocales) {
      return [[], {}];
    }
    const rowsFromMeta = documentMeta?.availableLocales.map((doc) => {
      const { locale, status } = doc;
      return { locale, status };
    });
    rowsFromMeta.unshift({
      locale: document.locale,
      status: document.status
    });
    const allDocuments = [document, ...documentMeta?.availableLocales ?? []];
    const errors = allDocuments.reduce((errs, document2) => {
      if (!document2) {
        return errs;
      }
      const validation = validate(document2);
      if (validation !== null) {
        errs[document2.locale] = validation;
      }
      return errs;
    }, {});
    return [rowsFromMeta, errors];
  }, [document, documentMeta?.availableLocales, validate]);
  const isBulkPublish = action === "bulk-publish";
  const localesForAction = selectedRows.reduce((acc, selectedRow) => {
    const isValidLocale = (
      // Validation errors are irrelevant if we are trying to unpublish
      !isBulkPublish || !Object.keys(validationErrors).includes(selectedRow.locale)
    );
    const shouldAddLocale = isBulkPublish ? selectedRow.status !== "published" && isValidLocale : selectedRow.status !== "draft" && isValidLocale;
    if (shouldAddLocale) {
      acc.push(selectedRow.locale);
    }
    return acc;
  }, []);
  const enableDraftRelationsCount = false;
  const {
    data: draftRelationsCount = 0,
    isLoading: isDraftRelationsLoading,
    error: isDraftRelationsError
  } = useGetManyDraftRelationCountQuery(
    {
      model,
      documentIds: [documentId],
      locale: localesForAction
    },
    {
      skip: !enableDraftRelationsCount
    }
  );
  React__namespace.useEffect(() => {
    if (isDraftRelationsError) {
      toggleNotification({
        type: "danger",
        message: formatAPIError(isDraftRelationsError)
      });
    }
  }, [isDraftRelationsError, toggleNotification, formatAPIError]);
  if (!schema?.options?.draftAndPublish) {
    return null;
  }
  if (!hasI18n) {
    return null;
  }
  if (!documentId) {
    return null;
  }
  const publish = async () => {
    await publishManyAction({
      model,
      documentIds: [documentId],
      params: {
        ...params,
        locale: localesForAction
      }
    });
    setSelectedRows([]);
  };
  const unpublish = async () => {
    await unpublishManyAction({
      model,
      documentIds: [documentId],
      params: {
        ...params,
        locale: localesForAction
      }
    });
    setSelectedRows([]);
  };
  const handleAction = async () => {
    if (draftRelationsCount > 0) {
      setIsDraftRelationConfirmationOpen(true);
    } else if (isBulkPublish) {
      await publish();
    } else {
      await unpublish();
    }
  };
  if (isDraftRelationConfirmationOpen) {
    return {
      label: formatMessage({
        id: "app.components.ConfirmDialog.title",
        defaultMessage: "Confirmation"
      }),
      variant: "danger",
      dialog: {
        onCancel: () => {
          setIsDraftRelationConfirmationOpen(false);
        },
        onConfirm: async () => {
          await publish();
          setIsDraftRelationConfirmationOpen(false);
        },
        type: "dialog",
        title: formatMessage({
          id: getTranslation("actions.publish.dialog.title"),
          defaultMessage: "Confirmation"
        }),
        content: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", alignItems: "center", gap: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsx(icons.WarningCircle, { width: "2.4rem", height: "2.4rem", fill: "danger600" }),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textAlign: "center", children: formatMessage({
            id: getTranslation("CMEditViewBulkLocale.draft-relation-warning"),
            defaultMessage: "Some locales are related to draft entries. Publishing them could leave broken links in your app."
          }) }),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textAlign: "center", children: formatMessage({
            id: getTranslation("CMEditViewBulkLocale.continue-confirmation"),
            defaultMessage: "Are you sure you want to continue?"
          }) })
        ] })
      }
    };
  }
  const hasPermission = selectedRows.map(({ locale }) => locale).every((locale) => canPublish.includes(locale));
  return {
    label: formatMessage({
      id: getTranslation(`CMEditViewBulkLocale.${isBulkPublish ? "publish" : "unpublish"}-title`),
      defaultMessage: `${isBulkPublish ? "Publish" : "Unpublish"} Multiple Locales`
    }),
    variant: isBulkPublish ? "secondary" : "danger",
    icon: isBulkPublish ? /* @__PURE__ */ jsxRuntime.jsx(icons.ListPlus, {}) : /* @__PURE__ */ jsxRuntime.jsx(icons.Cross, {}),
    disabled: isOnPublishedTab || canPublish.length === 0,
    position: ["panel"],
    dialog: {
      type: "modal",
      title: formatMessage({
        id: getTranslation(`CMEditViewBulkLocale.${isBulkPublish ? "publish" : "unpublish"}-title`),
        defaultMessage: `${isBulkPublish ? "Publish" : "Unpublish"} Multiple Locales`
      }),
      content: () => {
        return /* @__PURE__ */ jsxRuntime.jsx(
          strapiAdmin.Table.Root,
          {
            headers,
            rows: rows.map((row) => ({
              ...row,
              id: row.locale
            })),
            selectedRows,
            onSelectedRowsChange: (tableSelectedRows) => setSelectedRows(tableSelectedRows),
            children: /* @__PURE__ */ jsxRuntime.jsx(
              BulkLocaleActionModal,
              {
                validationErrors,
                headers,
                rows,
                localesMetadata,
                action: action ?? "bulk-publish"
              }
            )
          }
        );
      },
      footer: () => /* @__PURE__ */ jsxRuntime.jsx(designSystem.Modal.Footer, { justifyContent: "flex-end", children: /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Button,
        {
          loading: isDraftRelationsLoading,
          disabled: !hasPermission || localesForAction.length === 0,
          variant: "default",
          onClick: handleAction,
          children: formatMessage({
            id: isBulkPublish ? "app.utils.publish" : "app.utils.unpublish",
            defaultMessage: isBulkPublish ? "Publish" : "Unpublish"
          })
        }
      ) })
    }
  };
};
const BulkLocalePublishAction = (props) => {
  return BulkLocaleAction({ action: "bulk-publish", ...props });
};
const BulkLocaleUnpublishAction = (props) => {
  return BulkLocaleAction({ action: "bulk-unpublish", ...props });
};
const StyledTrash = styledComponents.styled(icons.Trash)`
  path {
    fill: currentColor;
  }
`;
const Emphasis = (chunks) => {
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { fontWeight: "semiBold", textColor: "danger500", children: chunks });
};
const DeleteModalAdditionalInfo = () => {
  const { hasI18n } = useI18n();
  const { formatMessage } = reactIntl.useIntl();
  if (!hasI18n) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textColor: "danger500", children: formatMessage(
    {
      id: getTranslation("Settings.list.actions.deleteAdditionalInfos"),
      defaultMessage: "This will delete the active locale versions <em>(from Internationalization)</em>"
    },
    {
      em: Emphasis
    }
  ) });
};
const PublishModalAdditionalInfo = () => {
  const { hasI18n } = useI18n();
  const { formatMessage } = reactIntl.useIntl();
  if (!hasI18n) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textColor: "danger500", children: formatMessage(
    {
      id: getTranslation("Settings.list.actions.publishAdditionalInfos"),
      defaultMessage: "This will publish the active locale versions <em>(from Internationalization)</em>"
    },
    {
      em: Emphasis
    }
  ) });
};
const UnpublishModalAdditionalInfo = () => {
  const { hasI18n } = useI18n();
  const { formatMessage } = reactIntl.useIntl();
  if (!hasI18n) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textColor: "danger500", children: formatMessage(
    {
      id: getTranslation("Settings.list.actions.unpublishAdditionalInfos"),
      defaultMessage: "This will unpublish the active locale versions <em>(from Internationalization)</em>"
    },
    {
      em: Emphasis
    }
  ) });
};
const LocalePicker = () => {
  const { formatMessage } = reactIntl.useIntl();
  const [{ query: query2 }, setQuery] = strapiAdmin.useQueryParams();
  const { hasI18n, canRead, canCreate } = useI18n();
  const { data: locales = [] } = useGetLocalesQuery(void 0, {
    skip: !hasI18n
  });
  const handleChange = React__namespace.useCallback(
    (code, replace = false) => {
      setQuery(
        {
          page: 1,
          plugins: { ...query2.plugins, i18n: { locale: code } }
        },
        "push",
        replace
      );
    },
    [query2.plugins, setQuery]
  );
  React__namespace.useEffect(() => {
    if (!Array.isArray(locales) || !hasI18n) {
      return;
    }
    const currentDesiredLocale = query2.plugins?.i18n?.locale;
    const doesLocaleExist = locales.find((loc) => loc.code === currentDesiredLocale);
    const defaultLocale = locales.find((locale) => locale.isDefault);
    if (!doesLocaleExist && defaultLocale?.code) {
      handleChange(defaultLocale.code, true);
    }
  }, [hasI18n, handleChange, locales, query2.plugins?.i18n?.locale]);
  if (!hasI18n || !Array.isArray(locales) || locales.length === 0) {
    return null;
  }
  const displayedLocales = locales.filter((locale) => {
    return canCreate.includes(locale.code) || canRead.includes(locale.code);
  });
  return /* @__PURE__ */ jsxRuntime.jsx(
    designSystem.SingleSelect,
    {
      size: "S",
      "aria-label": formatMessage({
        id: getTranslation("actions.select-locale"),
        defaultMessage: "Select locale"
      }),
      value: query2.plugins?.i18n?.locale || locales.find((locale) => locale.isDefault)?.code,
      onChange: handleChange,
      children: displayedLocales.map((locale) => /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelectOption, { value: locale.code, children: locale.name }, locale.id))
    }
  );
};
const PERMISSIONS = {
  accessMain: [{ action: "plugin::i18n.locale.read", subject: null }],
  create: [{ action: "plugin::i18n.locale.create", subject: null }],
  delete: [{ action: "plugin::i18n.locale.delete", subject: null }],
  update: [{ action: "plugin::i18n.locale.update", subject: null }],
  read: [{ action: "plugin::i18n.locale.read", subject: null }]
};
const mutateEditViewHook = ({ layout }) => {
  if (!("i18n" in layout.options) || typeof layout.options.i18n === "object" && layout.options.i18n !== null && "localized" in layout.options.i18n && !layout.options.i18n.localized) {
    return { layout };
  }
  const components = Object.entries(layout.components).reduce(
    (acc, [key, componentLayout]) => {
      return {
        ...acc,
        [key]: {
          ...componentLayout,
          layout: componentLayout.layout.map((row) => row.map(addLabelActionToField))
        }
      };
    },
    {}
  );
  return {
    layout: {
      ...layout,
      components,
      layout: layout.layout.map((panel) => panel.map((row) => row.map(addLabelActionToField)))
    }
  };
};
const addLabelActionToField = (field) => {
  const isFieldLocalized = doesFieldHaveI18nPluginOpt(field.attribute.pluginOptions) ? field.attribute.pluginOptions.i18n.localized : true;
  const labelActionProps = {
    title: {
      id: isFieldLocalized ? getTranslation("Field.localized") : getTranslation("Field.not-localized"),
      defaultMessage: isFieldLocalized ? "This value is unique for the selected locale" : "This value is the same across all locales"
    },
    icon: isFieldLocalized ? /* @__PURE__ */ jsxRuntime.jsx(icons.Earth, {}) : /* @__PURE__ */ jsxRuntime.jsx(icons.EarthStriked, {})
  };
  return {
    ...field,
    labelAction: /* @__PURE__ */ jsxRuntime.jsx(LabelAction, { ...labelActionProps })
  };
};
const doesFieldHaveI18nPluginOpt = (pluginOpts) => {
  if (!pluginOpts) {
    return false;
  }
  return "i18n" in pluginOpts && typeof pluginOpts.i18n === "object" && pluginOpts.i18n !== null && "localized" in pluginOpts.i18n;
};
const LabelAction = ({ title, icon }) => {
  const { formatMessage } = reactIntl.useIntl();
  return /* @__PURE__ */ jsxRuntime.jsxs(Span, { tag: "span", children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.VisuallyHidden, { tag: "span", children: formatMessage(title) }),
    React__namespace.cloneElement(icon, {
      "aria-hidden": true,
      focusable: false
      // See: https://allyjs.io/tutorials/focusing-in-svg.html#making-svg-elements-focusable
    })
  ] });
};
const Span = styledComponents.styled(designSystem.Flex)`
  svg {
    width: 12px;
    height: 12px;

    fill: ${({ theme }) => theme.colors.neutral500};

    path {
      fill: ${({ theme }) => theme.colors.neutral500};
    }
  }
`;
const LocaleListCell = ({
  documentId,
  locale: currentLocale,
  collectionType,
  model
}) => {
  const { meta, isLoading } = strapiAdmin$1.unstable_useDocument({
    documentId,
    collectionType,
    model,
    params: {
      locale: currentLocale
    }
  });
  const { locale: language } = reactIntl.useIntl();
  const { data: locales = [] } = useGetLocalesQuery();
  const formatter = designSystem.useCollator(language, {
    sensitivity: "base"
  });
  if (!Array.isArray(locales) || isLoading) {
    return null;
  }
  const availableLocales = meta?.availableLocales.map((doc) => doc.locale) ?? [];
  const localesForDocument = locales.reduce((acc, locale) => {
    const createdLocale = [currentLocale, ...availableLocales].find((loc) => {
      return loc === locale.code;
    });
    if (createdLocale) {
      acc.push(locale);
    }
    return acc;
  }, []).map((locale) => {
    if (locale.isDefault) {
      return `${locale.name} (default)`;
    }
    return locale.name;
  }).toSorted((a, b) => formatter.compare(a, b));
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Popover.Root, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Popover.Trigger, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { variant: "ghost", type: "button", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { minWidth: "100%", alignItems: "center", justifyContent: "center", fontWeight: "regular", children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textColor: "neutral800", ellipsis: true, marginRight: 2, children: localesForDocument.join(", ") }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { children: /* @__PURE__ */ jsxRuntime.jsx(icons.CaretDown, { width: "1.2rem", height: "1.2rem" }) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Popover.Content, { sideOffset: 16, children: /* @__PURE__ */ jsxRuntime.jsx("ul", { children: localesForDocument.map((name) => /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { padding: 3, tag: "li", children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { children: name }) }, name)) }) })
  ] });
};
const addColumnToTableHook = ({ displayedHeaders, layout }) => {
  const { options } = layout;
  const isFieldLocalized = doesPluginOptionsHaveI18nLocalized(options) ? options.i18n.localized : false;
  if (!isFieldLocalized) {
    return { displayedHeaders, layout };
  }
  return {
    displayedHeaders: [
      ...displayedHeaders,
      {
        attribute: { type: "string" },
        label: {
          id: getTranslation("list-view.table.header.label"),
          defaultMessage: "Available in"
        },
        searchable: false,
        sortable: false,
        name: "locales",
        // @ts-expect-error – ID is seen as number | string; this will change when we move the type over.
        cellFormatter: (props, _header, meta) => /* @__PURE__ */ jsxRuntime.jsx(LocaleListCell, { ...props, ...meta })
      }
    ],
    layout
  };
};
const addLocaleToReleasesHook = ({ displayedHeaders = [] }) => {
  return {
    displayedHeaders: [
      ...displayedHeaders,
      {
        label: {
          id: "content-releases.page.ReleaseDetails.table.header.label.locale",
          defaultMessage: "locale"
        },
        name: "locale"
      }
    ],
    hasI18nEnabled: true
  };
};
const extendCTBAttributeInitialDataMiddleware = () => {
  return ({ getState }) => (next) => (action) => {
    const enhanceAction = () => {
      try {
        const store = getState();
        const hasi18nEnabled = get__default.default(
          store,
          [
            "content-type-builder_dataManagerProvider",
            "modifiedData",
            "contentType",
            "schema",
            "pluginOptions",
            "i18n",
            "localized"
          ],
          false
        );
        if (hasi18nEnabled) {
          const pluginOptions = action.options ? { ...action.options.pluginOptions, i18n: { localized: true } } : { i18n: { localized: true } };
          return next({
            ...action,
            options: {
              pluginOptions
            }
          });
        }
        return next(action);
      } catch (err) {
        return next(action);
      }
    };
    if (action.type === "ContentTypeBuilder/FormModal/SET_ATTRIBUTE_DATA_SCHEMA" && action.forTarget === "contentType" && !["relation", "component"].includes(action.attributeType) && !action.isEditing) {
      return enhanceAction();
    }
    if (action.type === "ContentTypeBuilder/FormModal/SET_CUSTOM_FIELD_DATA_SCHEMA" && action.forTarget === "contentType" && !action.isEditing) {
      return enhanceAction();
    }
    if ((action.type === "ContentTypeBuilder/FormModal/RESET_PROPS_AND_SET_FORM_FOR_ADDING_AN_EXISTING_COMPO" || action.type === "ContentTypeBuilder/FormModal/RESET_PROPS_AND_SAVE_CURRENT_DATA") && action.forTarget === "contentType") {
      return enhanceAction();
    }
    return next(action);
  };
};
const extendCTBInitialDataMiddleware = () => {
  return () => (next) => (action) => {
    if (action.type === "ContentTypeBuilder/FormModal/SET_DATA_TO_EDIT" && action.modalType === "contentType") {
      const i18n = { localized: false };
      const pluginOptions = action.data.pluginOptions ? { ...action.data.pluginOptions, i18n } : { i18n };
      const data = { ...action.data, pluginOptions };
      if (action.actionType === "create") {
        return next({ ...action, data });
      }
      if (!action.data.pluginOptions?.i18n?.localized) {
        return next({ ...action, data });
      }
    }
    return next(action);
  };
};
const localeMiddleware = (ctx) => (next) => (permissions) => {
  const match = reactRouterDom.matchPath("/content-manager/:collectionType/:model?/:id", ctx.pathname);
  if (!match) {
    return next(permissions);
  }
  const search = qs__namespace.parse(ctx.search);
  if (typeof search !== "object") {
    return next(permissions);
  }
  if (!("plugins" in search && typeof search.plugins === "object")) {
    return next(permissions);
  }
  if (!("i18n" in search.plugins && typeof search.plugins.i18n === "object" && !Array.isArray(search.plugins.i18n))) {
    return next(permissions);
  }
  const { locale } = search.plugins.i18n;
  if (typeof locale !== "string") {
    return next(permissions);
  }
  const revisedPermissions = permissions.filter(
    (permission) => !permission.properties?.locales || permission.properties.locales.includes(locale)
  );
  return next(revisedPermissions);
};
const prefixPluginTranslations = (trad, pluginId2) => {
  return Object.keys(trad).reduce((acc, current) => {
    acc[`${pluginId2}.${current}`] = trad[current];
    return acc;
  }, {});
};
const mutateCTBContentTypeSchema = (nextSchema, prevSchema) => {
  if (!doesPluginOptionsHaveI18nLocalized(nextSchema.pluginOptions)) {
    return nextSchema;
  }
  const isNextSchemaLocalized = nextSchema.pluginOptions.i18n.localized;
  const isPrevSchemaLocalized = doesPluginOptionsHaveI18nLocalized(
    prevSchema?.schema?.pluginOptions
  ) ? prevSchema?.schema?.pluginOptions.i18n.localized : false;
  if (isNextSchemaLocalized && isPrevSchemaLocalized) {
    return nextSchema;
  }
  if (isNextSchemaLocalized) {
    const attributes = addLocalisationToFields(nextSchema.attributes);
    return { ...nextSchema, attributes };
  }
  if (!isNextSchemaLocalized) {
    const pluginOptions = omit__default.default(nextSchema.pluginOptions, "i18n");
    const attributes = disableAttributesLocalisation(nextSchema.attributes);
    return { ...nextSchema, pluginOptions, attributes };
  }
  return nextSchema;
};
const addLocalisationToFields = (attributes) => Object.keys(attributes).reduce((acc, current) => {
  const currentAttribute = attributes[current];
  if (LOCALIZED_FIELDS.includes(currentAttribute.type)) {
    const i18n = { localized: true };
    const pluginOptions = currentAttribute.pluginOptions ? { ...currentAttribute.pluginOptions, i18n } : { i18n };
    acc[current] = { ...currentAttribute, pluginOptions };
    return acc;
  }
  acc[current] = currentAttribute;
  return acc;
}, {});
const disableAttributesLocalisation = (attributes) => Object.keys(attributes).reduce((acc, current) => {
  acc[current] = omit__default.default(attributes[current], "pluginOptions.i18n");
  return acc;
}, {});
const index = {
  register(app) {
    app.addMiddlewares([extendCTBAttributeInitialDataMiddleware, extendCTBInitialDataMiddleware]);
    app.addMiddlewares([() => i18nApi.middleware]);
    app.addReducers({
      [i18nApi.reducerPath]: i18nApi.reducer
    });
    app.addRBACMiddleware([localeMiddleware]);
    app.registerPlugin({
      id: pluginId,
      name: pluginId
    });
  },
  bootstrap(app) {
    app.registerHook("Admin/CM/pages/ListView/inject-column-in-table", addColumnToTableHook);
    app.registerHook("Admin/CM/pages/EditView/mutate-edit-view-layout", mutateEditViewHook);
    app.registerHook(
      "ContentReleases/pages/ReleaseDetails/add-locale-in-releases",
      addLocaleToReleasesHook
    );
    app.addSettingsLink("global", {
      intlLabel: {
        id: getTranslation("plugin.name"),
        defaultMessage: "Internationalization"
      },
      id: "internationalization",
      to: "internationalization",
      Component: () => Promise.resolve().then(() => require("./SettingsPage-BTgjb2KS.js")).then((mod) => ({ default: mod.ProtectedSettingsPage })),
      permissions: PERMISSIONS.accessMain
    });
    const contentManager = app.getPlugin("content-manager");
    contentManager.apis.addDocumentHeaderAction([LocalePickerAction, FillFromAnotherLocaleAction]);
    contentManager.apis.addDocumentAction((actions) => {
      const indexOfDeleteAction = actions.findIndex((action) => action.type === "delete");
      actions.splice(indexOfDeleteAction, 0, DeleteLocaleAction);
      return actions;
    });
    contentManager.apis.addDocumentAction((actions) => {
      actions.splice(2, 0, BulkLocalePublishAction);
      actions.splice(5, 0, BulkLocaleUnpublishAction);
      return actions;
    });
    contentManager.injectComponent("listView", "actions", {
      name: "i18n-locale-filter",
      Component: LocalePicker
    });
    contentManager.injectComponent("listView", "publishModalAdditionalInfos", {
      name: "i18n-publish-bullets-in-modal",
      Component: PublishModalAdditionalInfo
    });
    contentManager.injectComponent("listView", "unpublishModalAdditionalInfos", {
      name: "i18n-unpublish-bullets-in-modal",
      Component: UnpublishModalAdditionalInfo
    });
    contentManager.injectComponent("listView", "deleteModalAdditionalInfos", {
      name: "i18n-delete-bullets-in-modal",
      Component: DeleteModalAdditionalInfo
    });
    const ctbPlugin = app.getPlugin("content-type-builder");
    if (ctbPlugin) {
      const ctbFormsAPI = ctbPlugin.apis.forms;
      ctbFormsAPI.addContentTypeSchemaMutation(mutateCTBContentTypeSchema);
      ctbFormsAPI.components.add({ id: "checkboxConfirmation", component: CheckboxConfirmation });
      ctbFormsAPI.extendContentType({
        validator: () => ({
          i18n: yup__namespace.object().shape({
            localized: yup__namespace.bool()
          })
        }),
        form: {
          advanced() {
            return [
              {
                name: "pluginOptions.i18n.localized",
                description: {
                  id: getTranslation("plugin.schema.i18n.localized.description-content-type"),
                  defaultMessage: "Allows translating an entry into different languages"
                },
                type: "checkboxConfirmation",
                intlLabel: {
                  id: getTranslation("plugin.schema.i18n.localized.label-content-type"),
                  defaultMessage: "Localization"
                }
              }
            ];
          }
        }
      });
      ctbFormsAPI.extendFields(LOCALIZED_FIELDS, {
        validator: (args) => ({
          i18n: yup__namespace.object().shape({
            localized: yup__namespace.bool().test({
              name: "ensure-unique-localization",
              message: getTranslation("plugin.schema.i18n.ensure-unique-localization"),
              test(value) {
                if (value === void 0 || value) {
                  return true;
                }
                const unique = get__default.default(args, ["3", "modifiedData", "unique"], null);
                if (unique && !value) {
                  return false;
                }
                return true;
              }
            })
          })
        }),
        form: {
          advanced({ contentTypeSchema, forTarget, type, step }) {
            if (forTarget !== "contentType") {
              return [];
            }
            const hasI18nEnabled = get__default.default(
              contentTypeSchema,
              ["schema", "pluginOptions", "i18n", "localized"],
              false
            );
            if (!hasI18nEnabled) {
              return [];
            }
            if (type === "component" && step === "1") {
              return [];
            }
            return [
              {
                name: "pluginOptions.i18n.localized",
                description: {
                  id: getTranslation("plugin.schema.i18n.localized.description-field"),
                  defaultMessage: "The field can have different values in each locale"
                },
                type: "checkbox",
                intlLabel: {
                  id: getTranslation("plugin.schema.i18n.localized.label-field"),
                  defaultMessage: "Enable localization for this field"
                }
              }
            ];
          }
        }
      });
    }
  },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/de.json": () => Promise.resolve().then(() => require("./de-DtWiGdHl.js")), "./translations/dk.json": () => Promise.resolve().then(() => require("./dk-D8C-casx.js")), "./translations/en.json": () => Promise.resolve().then(() => require("./en-BKBz3tro.js")), "./translations/es.json": () => Promise.resolve().then(() => require("./es-DS-XFGSw.js")), "./translations/fr.json": () => Promise.resolve().then(() => require("./fr-BTjekDpq.js")), "./translations/ko.json": () => Promise.resolve().then(() => require("./ko-DmcGUBQ3.js")), "./translations/pl.json": () => Promise.resolve().then(() => require("./pl-Cn5RYonZ.js")), "./translations/ru.json": () => Promise.resolve().then(() => require("./ru-BMBgVL3s.js")), "./translations/tr.json": () => Promise.resolve().then(() => require("./tr-CarUU76c.js")), "./translations/zh-Hans.json": () => Promise.resolve().then(() => require("./zh-Hans-DSHIXAa3.js")), "./translations/zh.json": () => Promise.resolve().then(() => require("./zh-CukOviB0.js")) }), `./translations/${locale}.json`, 3).then(({ default: data }) => {
          return {
            data: prefixPluginTranslations(data, pluginId),
            locale
          };
        }).catch(() => {
          return {
            data: {},
            locale
          };
        });
      })
    );
    return Promise.resolve(importedTrads);
  }
};
exports.PERMISSIONS = PERMISSIONS;
exports.getTranslation = getTranslation;
exports.index = index;
exports.useCreateLocaleMutation = useCreateLocaleMutation;
exports.useDeleteLocaleMutation = useDeleteLocaleMutation;
exports.useGetDefaultLocalesQuery = useGetDefaultLocalesQuery;
exports.useGetLocalesQuery = useGetLocalesQuery;
exports.useUpdateLocaleMutation = useUpdateLocaleMutation;
//# sourceMappingURL=index-3yyF237r.js.map
