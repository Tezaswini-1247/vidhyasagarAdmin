"use strict";
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const strapiAdmin = require("@strapi/admin/strapi-admin");
const reactIntl = require("react-intl");
const reactRouterDom = require("react-router-dom");
const index$1 = require("./index-BKtm7tvi.js");
const designSystem = require("@strapi/design-system");
const Icons = require("@strapi/icons");
const upperFirst = require("lodash/upperFirst");
const styledComponents = require("styled-components");
const isEqual = require("lodash/isEqual");
const get = require("lodash/get");
const groupBy = require("lodash/groupBy");
const set = require("lodash/set");
const size = require("lodash/size");
const reactRedux = require("react-redux");
const has = require("lodash/has");
const toLower = require("lodash/toLower");
const Symbols = require("@strapi/icons/symbols");
const qs = require("qs");
const pluralize = require("pluralize");
const formatISO = require("date-fns/formatISO");
const truncate = require("lodash/truncate");
const uniq = require("lodash/uniq");
const yup = require("yup");
const slugify = require("@sindresorhus/slugify");
const fp = require("lodash/fp");
const toNumber = require("lodash/toNumber");
const toolkit = require("@reduxjs/toolkit");
const camelCase = require("lodash/camelCase");
const omit = require("lodash/omit");
const sortBy = require("lodash/sortBy");
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
const React__namespace = /* @__PURE__ */ _interopNamespace(React);
const Icons__namespace = /* @__PURE__ */ _interopNamespace(Icons);
const upperFirst__default = /* @__PURE__ */ _interopDefault(upperFirst);
const isEqual__default = /* @__PURE__ */ _interopDefault(isEqual);
const get__default = /* @__PURE__ */ _interopDefault(get);
const groupBy__default = /* @__PURE__ */ _interopDefault(groupBy);
const set__default = /* @__PURE__ */ _interopDefault(set);
const size__default = /* @__PURE__ */ _interopDefault(size);
const has__default = /* @__PURE__ */ _interopDefault(has);
const toLower__default = /* @__PURE__ */ _interopDefault(toLower);
const Symbols__namespace = /* @__PURE__ */ _interopNamespace(Symbols);
const qs__namespace = /* @__PURE__ */ _interopNamespace(qs);
const pluralize__default = /* @__PURE__ */ _interopDefault(pluralize);
const formatISO__default = /* @__PURE__ */ _interopDefault(formatISO);
const truncate__default = /* @__PURE__ */ _interopDefault(truncate);
const uniq__default = /* @__PURE__ */ _interopDefault(uniq);
const yup__namespace = /* @__PURE__ */ _interopNamespace(yup);
const slugify__default = /* @__PURE__ */ _interopDefault(slugify);
const toNumber__default = /* @__PURE__ */ _interopDefault(toNumber);
const camelCase__default = /* @__PURE__ */ _interopDefault(camelCase);
const omit__default = /* @__PURE__ */ _interopDefault(omit);
const sortBy__default = /* @__PURE__ */ _interopDefault(sortBy);
const getTrad = (id) => `${index$1.pluginId}.${id}`;
const DataManagerContext = React.createContext();
const useDataManager = () => React.useContext(DataManagerContext);
const FormModalNavigationContext = React__namespace.createContext();
const useFormModalNavigation = () => React.useContext(FormModalNavigationContext);
const useContentTypeBuilderMenu = () => {
  const {
    components,
    componentsGroupedByCategory,
    contentTypes,
    isInDevelopmentMode,
    sortedContentTypesList,
    modifiedData,
    initialData
  } = useDataManager();
  const { toggleNotification } = strapiAdmin.useNotification();
  const { formatMessage } = reactIntl.useIntl();
  const { trackUsage } = strapiAdmin.useTracking();
  const [search, setSearch] = React.useState("");
  const { onOpenModalCreateSchema, onOpenModalEditCategory } = useFormModalNavigation();
  const { locale } = reactIntl.useIntl();
  const { startsWith } = designSystem.useFilter(locale, {
    sensitivity: "base"
  });
  const formatter = designSystem.useCollator(locale, {
    sensitivity: "base"
  });
  const canOpenModalCreateCTorComponent = !Object.keys(contentTypes).some((ct) => contentTypes[ct].isTemporary === true) && !Object.keys(components).some(
    (component) => components[component].isTemporary === true
  ) && isEqual__default.default(modifiedData, initialData);
  const handleClickOpenModalCreateCollectionType = () => {
    if (canOpenModalCreateCTorComponent) {
      trackUsage(`willCreateContentType`);
      const nextState = {
        modalType: "contentType",
        kind: "collectionType",
        actionType: "create",
        forTarget: "contentType"
      };
      onOpenModalCreateSchema(nextState);
    } else {
      toggleNotificationCannotCreateSchema();
    }
  };
  const handleClickOpenModalCreateSingleType = () => {
    if (canOpenModalCreateCTorComponent) {
      trackUsage(`willCreateSingleType`);
      const nextState = {
        modalType: "contentType",
        kind: "singleType",
        actionType: "create",
        forTarget: "contentType"
      };
      onOpenModalCreateSchema(nextState);
    } else {
      toggleNotificationCannotCreateSchema();
    }
  };
  const handleClickOpenModalCreateComponent = () => {
    if (canOpenModalCreateCTorComponent) {
      trackUsage("willCreateComponent");
      const nextState = {
        modalType: "component",
        kind: null,
        actionType: "create",
        forTarget: "component"
      };
      onOpenModalCreateSchema(nextState);
    } else {
      toggleNotificationCannotCreateSchema();
    }
  };
  const toggleNotificationCannotCreateSchema = () => {
    toggleNotification({
      type: "info",
      message: formatMessage({
        id: getTrad("notification.info.creating.notSaved"),
        defaultMessage: "Please save your work before creating a new collection type or component"
      })
    });
  };
  const componentsData = Object.entries(componentsGroupedByCategory).map(([category, components2]) => ({
    name: category,
    title: category,
    isEditable: isInDevelopmentMode,
    onClickEdit(e, data2) {
      e.stopPropagation();
      if (canOpenModalCreateCTorComponent) {
        onOpenModalEditCategory(data2.name);
      } else {
        toggleNotificationCannotCreateSchema();
      }
    },
    links: components2.map((component) => ({
      name: component.uid,
      to: `/plugins/${index$1.pluginId}/component-categories/${category}/${component.uid}`,
      title: component.schema.displayName
    })).sort((a, b) => formatter.compare(a.title, b.title))
  })).sort((a, b) => formatter.compare(a.title, b.title));
  const displayedContentTypes = sortedContentTypesList.filter((obj) => obj.visible);
  const data = [
    {
      name: "models",
      title: {
        id: `${getTrad("menu.section.models.name")}`,
        defaultMessage: "Collection Types"
      },
      customLink: isInDevelopmentMode && {
        id: `${getTrad("button.model.create")}`,
        defaultMessage: "Create new collection type",
        onClick: handleClickOpenModalCreateCollectionType
      },
      links: displayedContentTypes.filter((contentType) => contentType.kind === "collectionType")
    },
    {
      name: "singleTypes",
      title: {
        id: `${getTrad("menu.section.single-types.name")}`,
        defaultMessage: "Single Types"
      },
      customLink: isInDevelopmentMode && {
        id: `${getTrad("button.single-types.create")}`,
        defaultMessage: "Create new single type",
        onClick: handleClickOpenModalCreateSingleType
      },
      links: displayedContentTypes.filter((singleType) => singleType.kind === "singleType")
    },
    {
      name: "components",
      title: {
        id: `${getTrad("menu.section.components.name")}`,
        defaultMessage: "Components"
      },
      customLink: isInDevelopmentMode && {
        id: `${getTrad("button.component.create")}`,
        defaultMessage: "Create a new component",
        onClick: handleClickOpenModalCreateComponent
      },
      links: componentsData
    }
  ].map((section) => {
    const hasChild = section.links.some((l) => Array.isArray(l.links));
    if (hasChild) {
      let filteredLinksCount = 0;
      return {
        ...section,
        links: section.links.map((link) => {
          const filteredLinks2 = link.links.filter((link2) => startsWith(link2.title, search));
          if (filteredLinks2.length === 0) {
            return null;
          }
          filteredLinksCount += filteredLinks2.length;
          return {
            ...link,
            links: filteredLinks2.sort((a, b) => formatter.compare(a.title, b.title))
          };
        }).filter(Boolean),
        linksCount: filteredLinksCount
      };
    }
    const filteredLinks = section.links.filter((link) => startsWith(link.title, search)).sort((a, b) => formatter.compare(a.title, b.title));
    return {
      ...section,
      links: filteredLinks,
      linksCount: filteredLinks.length
    };
  });
  return {
    menu: data,
    searchValue: search,
    onSearchChange: setSearch
  };
};
const SubNavLinkCustom = styledComponents.styled(designSystem.SubNavLink)`
  div {
    width: inherit;
    span:nth-child(2) {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: inherit;
    }
  }
`;
const ContentTypeBuilderNav = () => {
  const { menu, searchValue, onSearchChange } = useContentTypeBuilderMenu();
  const { formatMessage } = reactIntl.useIntl();
  const pluginName = formatMessage({
    id: getTrad("plugin.name"),
    defaultMessage: "Content-Type Builder"
  });
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.SubNav, { "aria-label": pluginName, children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.SubNavHeader,
      {
        searchable: true,
        value: searchValue,
        onClear: () => onSearchChange(""),
        onChange: (e) => onSearchChange(e.target.value),
        label: pluginName,
        searchLabel: formatMessage({
          id: "global.search",
          defaultMessage: "Search"
        })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.SubNavSections, { children: menu.map((section) => /* @__PURE__ */ jsxRuntime.jsxs(React.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.SubNavSection,
        {
          label: formatMessage({
            id: section.title.id,
            defaultMessage: section.title.defaultMessage
          }),
          collapsable: true,
          badgeLabel: section.linksCount.toString(),
          children: section.links.map((link) => {
            if (link.links) {
              return /* @__PURE__ */ jsxRuntime.jsx(designSystem.SubNavLinkSection, { label: upperFirst__default.default(link.title), children: link.links.map((subLink) => /* @__PURE__ */ jsxRuntime.jsx(
                designSystem.SubNavLink,
                {
                  tag: reactRouterDom.NavLink,
                  to: subLink.to,
                  active: subLink.active,
                  isSubSectionChild: true,
                  children: upperFirst__default.default(
                    formatMessage({ id: subLink.name, defaultMessage: subLink.title })
                  )
                },
                subLink.name
              )) }, link.name);
            }
            return /* @__PURE__ */ jsxRuntime.jsx(
              SubNavLinkCustom,
              {
                tag: reactRouterDom.NavLink,
                to: link.to,
                active: link.active,
                width: "100%",
                children: upperFirst__default.default(formatMessage({ id: link.name, defaultMessage: link.title }))
              },
              link.name
            );
          })
        }
      ),
      section.customLink && /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingLeft: 7, children: /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.TextButton,
        {
          onClick: section.customLink.onClick,
          startIcon: /* @__PURE__ */ jsxRuntime.jsx(Icons.Plus, { width: "0.8rem", height: "0.8rem" }),
          marginTop: 2,
          cursor: "pointer",
          children: formatMessage({
            id: section.customLink.id,
            defaultMessage: section.customLink.defaultMessage
          })
        }
      ) })
    ] }, section.name)) })
  ] });
};
const isAllowedContentTypesForRelations = (contentType) => {
  return contentType.kind === "collectionType" && (contentType.restrictRelationsTo === null || Array.isArray(contentType.restrictRelationsTo) && contentType.restrictRelationsTo.length > 0);
};
const findAttribute = (attributes, attributeToFind) => {
  return attributes.find(({ name }) => name === attributeToFind);
};
const extractValuesFromYupError = (errorType, errorParams) => {
  if (!errorType || !errorParams) {
    return {};
  }
  return {
    [errorType]: errorParams[errorType]
  };
};
const getYupInnerErrors = (error) => (error?.inner || []).reduce((acc, currentError) => {
  if (currentError.path) {
    acc[currentError.path.split("[").join(".").split("]").join("")] = {
      id: currentError.message,
      defaultMessage: currentError.message,
      values: extractValuesFromYupError(currentError?.type, currentError?.params)
    };
  }
  return acc;
}, {});
const options = [
  {
    label: "All",
    children: [
      { label: "images (JPEG, PNG, GIF, SVG, TIFF, ICO, DVU)", value: "images" },
      { label: "videos (MPEG, MP4, Quicktime, WMV, AVI, FLV)", value: "videos" },
      { label: "audios (MP3, WAV, OGG)", value: "audios" },
      { label: "files (CSV, ZIP, PDF, Excel, JSON, ...)", value: "files" }
    ]
  }
];
const AllowedTypesSelect = ({
  intlLabel,
  name,
  onChange,
  value = null
}) => {
  const { formatMessage } = reactIntl.useIntl();
  const displayedValue = value === null || value?.length === 0 ? formatMessage({ id: "global.none", defaultMessage: "None" }) : [...value].sort().map((v) => upperFirst__default.default(v)).join(", ");
  const label = intlLabel.id ? formatMessage({ id: intlLabel.id, defaultMessage: intlLabel.defaultMessage }) : name;
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { name, children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { children: label }),
    /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.MultiSelectNested,
      {
        customizeContent: () => displayedValue,
        onChange: (values) => {
          if (values.length > 0) {
            onChange({ target: { name, value: values, type: "allowed-types-select" } });
          } else {
            onChange({ target: { name, value: null, type: "allowed-types-select" } });
          }
        },
        options,
        value: value || []
      }
    )
  ] });
};
const iconByTypes = {
  biginteger: Symbols.NumberField,
  blocks: Symbols.BlocksField,
  boolean: Symbols.BooleanField,
  collectionType: Symbols.CollectionType,
  component: Symbols.ComponentField,
  contentType: Symbols.CollectionType,
  date: Symbols.DateField,
  datetime: Symbols.DateField,
  decimal: Symbols.NumberField,
  dynamiczone: Symbols.DynamicZoneField,
  email: Symbols.EmailField,
  enum: Symbols.EnumerationField,
  enumeration: Symbols.EnumerationField,
  file: Symbols.MediaField,
  files: Symbols.MediaField,
  float: Symbols.NumberField,
  integer: Symbols.NumberField,
  json: Symbols.JsonField,
  JSON: Symbols.JsonField,
  media: Symbols.MediaField,
  number: Symbols.NumberField,
  password: Symbols.PasswordField,
  relation: Symbols.RelationField,
  richtext: Symbols.MarkdownField,
  singleType: Symbols.SingleType,
  string: Symbols.TextField,
  text: Symbols.TextField,
  time: Symbols.DateField,
  timestamp: Symbols.DateField,
  uid: Symbols.UidField
};
const IconBox = styledComponents.styled(designSystem.Box)`
  svg {
    height: 100%;
    width: 100%;
  }
`;
const AttributeIcon = ({ type, customField = null, ...rest }) => {
  const getCustomField = strapiAdmin.useStrapiApp("AttributeIcon", (state) => state.customFields.get);
  let Compo = iconByTypes[type];
  if (customField) {
    const customFieldObject = getCustomField(customField);
    const icon = customFieldObject?.icon;
    if (icon) {
      Compo = icon;
    }
  }
  if (!iconByTypes[type]) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsx(IconBox, { width: "3.2rem", shrink: 0, ...rest, "aria-hidden": true, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { tag: Compo }) });
};
const OptionBoxWrapper = styledComponents.styled(designSystem.Box)`
  width: 100%;
  height: 100%;
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  text-align: left;
  &:hover {
    cursor: pointer;
    background: ${({ theme }) => theme.colors.primary100};
    border: 1px solid ${({ theme }) => theme.colors.primary200};
  }
`;
const newAttributes = [];
const NewBadge = () => /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { grow: 1, justifyContent: "flex-end", children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 1, hasRadius: true, background: "alternative100", padding: `0.2rem 0.4rem`, children: [
  /* @__PURE__ */ jsxRuntime.jsx(Icons.Sparkle, { width: `1rem`, height: `1rem`, fill: "alternative600" }),
  /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textColor: "alternative600", variant: "sigma", children: "New" })
] }) });
const AttributeOption = ({ type = "text" }) => {
  const { formatMessage } = reactIntl.useIntl();
  const { onClickSelectField } = useFormModalNavigation();
  const handleClick = () => {
    const step = type === "component" ? "1" : null;
    onClickSelectField({
      attributeType: type,
      step
    });
  };
  return /* @__PURE__ */ jsxRuntime.jsx(OptionBoxWrapper, { padding: 4, tag: "button", hasRadius: true, type: "button", onClick: handleClick, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(AttributeIcon, { type }),
    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { paddingLeft: 4, width: "100%", children: [
      /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { justifyContent: "space-between", children: [
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { fontWeight: "bold", textColor: "neutral800", children: formatMessage({ id: getTrad(`attribute.${type}`), defaultMessage: type }) }),
        newAttributes.includes(type) && /* @__PURE__ */ jsxRuntime.jsx(NewBadge, {})
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "pi", textColor: "neutral600", children: formatMessage({
        id: getTrad(`attribute.${type}.description`),
        defaultMessage: "A type for modeling data"
      }) }) })
    ] })
  ] }) });
};
const AttributeList = ({ attributes }) => /* @__PURE__ */ jsxRuntime.jsx(designSystem.KeyboardNavigable, { tagName: "button", children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { direction: "column", alignItems: "stretch", gap: 8, children: attributes.map((attributeRow, index2) => {
  return (
    // eslint-disable-next-line react/no-array-index-key
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Root, { gap: 3, children: attributeRow.map((attribute) => /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 6, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsxRuntime.jsx(AttributeOption, { type: attribute }) }, attribute)) }, index2)
  );
}) }) });
const CustomFieldOption = ({ customFieldUid, customField }) => {
  const { type, intlLabel, intlDescription } = customField;
  const { formatMessage } = reactIntl.useIntl();
  const { onClickSelectCustomField } = useFormModalNavigation();
  const handleClick = () => {
    onClickSelectCustomField({
      attributeType: type,
      customFieldUid
    });
  };
  return /* @__PURE__ */ jsxRuntime.jsx(OptionBoxWrapper, { padding: 4, tag: "button", hasRadius: true, type: "button", onClick: handleClick, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(AttributeIcon, { type, customField: customFieldUid }),
    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { paddingLeft: 4, children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { fontWeight: "bold", textColor: "neutral800", children: formatMessage(intlLabel) }) }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "pi", textColor: "neutral600", children: formatMessage(intlDescription) }) })
    ] })
  ] }) });
};
const EmptyCard = styledComponents.styled(designSystem.Box)`
  background: ${({ theme }) => `linear-gradient(180deg, rgba(234, 234, 239, 0) 0%, ${theme.colors.neutral150} 100%)`};
  opacity: 0.33;
`;
const EmptyCardGrid = () => {
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { wrap: "wrap", gap: 4, children: [...Array(4)].map((_, idx) => {
    return /* @__PURE__ */ jsxRuntime.jsx(
      EmptyCard,
      {
        height: "138px",
        width: "375px",
        hasRadius: true
      },
      `empty-card-${idx}`
    );
  }) });
};
const EmptyAttributes = () => {
  const { formatMessage } = reactIntl.useIntl();
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { position: "relative", children: [
    /* @__PURE__ */ jsxRuntime.jsx(EmptyCardGrid, {}),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { position: "absolute", top: 6, width: "100%", children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { alignItems: "center", justifyContent: "center", direction: "column", children: [
      /* @__PURE__ */ jsxRuntime.jsx(Symbols.EmptyDocuments, { width: "160px", height: "88px" }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingTop: 6, paddingBottom: 4, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { textAlign: "center", children: [
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "delta", tag: "p", textColor: "neutral600", children: formatMessage({
          id: getTrad("modalForm.empty.heading"),
          defaultMessage: "Nothing in here yet."
        }) }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingTop: 4, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "delta", tag: "p", textColor: "neutral600", children: formatMessage({
          id: getTrad("modalForm.empty.sub-heading"),
          defaultMessage: "Find what you are looking for through a wide range of extensions."
        }) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.LinkButton,
        {
          tag: reactRouterDom.Link,
          to: `/marketplace?${qs__namespace.stringify({ categories: ["Custom fields"] })}`,
          variant: "secondary",
          startIcon: /* @__PURE__ */ jsxRuntime.jsx(Icons.Plus, {}),
          children: formatMessage({
            id: getTrad("modalForm.empty.button"),
            defaultMessage: "Add custom fields"
          })
        }
      )
    ] }) })
  ] });
};
const CustomFieldsList = () => {
  const { formatMessage } = reactIntl.useIntl();
  const getAllCustomFields = strapiAdmin.useStrapiApp("CustomFieldsList", (state) => state.customFields.getAll);
  const registeredCustomFields = Object.entries(getAllCustomFields());
  if (!registeredCustomFields.length) {
    return /* @__PURE__ */ jsxRuntime.jsx(EmptyAttributes, {});
  }
  const sortedCustomFields = registeredCustomFields.sort(
    (a, b) => a[1].name > b[1].name ? 1 : -1
  );
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.KeyboardNavigable, { tagName: "button", children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", alignItems: "stretch", gap: 3, children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Root, { gap: 3, children: sortedCustomFields.map(([uid, customField]) => /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 6, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsxRuntime.jsx(CustomFieldOption, { customFieldUid: uid, customField }, uid) }, uid)) }),
    /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.Link,
      {
        href: "https://docs.strapi.io/developer-docs/latest/development/custom-fields.html",
        isExternal: true,
        children: formatMessage({
          id: getTrad("modalForm.tabs.custom.howToLink"),
          defaultMessage: "How to add custom fields"
        })
      }
    )
  ] }) });
};
const AttributeOptions = ({ attributes, forTarget, kind }) => {
  const { formatMessage } = reactIntl.useIntl();
  const defaultTabId = getTrad("modalForm.tabs.default");
  const customTabId = getTrad("modalForm.tabs.custom");
  const titleIdSuffix = forTarget.includes("component") ? "component" : kind;
  const titleId = getTrad(`modalForm.sub-header.chooseAttribute.${titleIdSuffix}`);
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Modal.Body, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Tabs.Root, { variant: "simple", defaultValue: "default", children: [
    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { justifyContent: "space-between", children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "beta", tag: "h2", children: formatMessage({ id: titleId, defaultMessage: "Select a field" }) }),
      /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Tabs.List, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tabs.Trigger, { value: "default", children: formatMessage({ id: defaultTabId, defaultMessage: "Default" }) }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tabs.Trigger, { value: "custom", children: formatMessage({ id: customTabId, defaultMessage: "Custom" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Divider, { marginBottom: 6 }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tabs.Content, { value: "default", children: /* @__PURE__ */ jsxRuntime.jsx(AttributeList, { attributes }) }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tabs.Content, { value: "custom", children: /* @__PURE__ */ jsxRuntime.jsx(CustomFieldsList, {}) })
  ] }) });
};
const BooleanDefaultValueSelect = ({
  intlLabel,
  name,
  options: options2,
  onChange,
  value = null
}) => {
  const { formatMessage } = reactIntl.useIntl();
  const label = intlLabel.id ? formatMessage(
    { id: intlLabel.id, defaultMessage: intlLabel.defaultMessage },
    { ...intlLabel.values }
  ) : name;
  const handleChange = (value2) => {
    let nextValue = "";
    if (value2 === "true") {
      nextValue = true;
    }
    if (value2 === "false") {
      nextValue = false;
    }
    onChange({ target: { name, value: nextValue, type: "select-default-boolean" } });
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { name, children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { children: label }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelect, { onChange: handleChange, value: (value === null ? "" : value).toString(), children: options2.map(({ metadatas: { intlLabel: intlLabel2, disabled, hidden }, key, value: value2 }) => {
      return /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelectOption, { value: value2, disabled, hidden, children: intlLabel2.defaultMessage }, key);
    }) })
  ] });
};
const Wrapper$1 = styledComponents.styled(designSystem.Flex)`
  position: relative;
  align-items: stretch;

  label {
    border-radius: 4px;
    max-width: 50%;
    cursor: pointer;
    user-select: none;
    flex: 1;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.colors.neutral200};

    ${designSystem.inputFocusStyle()}
  }

  input {
    position: absolute;
    opacity: 0;
  }

  .option {
    height: 100%;
    border-radius: 4px;
    will-change: transform, opacity;
    background: ${({ theme }) => theme.colors.neutral0};

    .checkmark {
      position: relative;
      display: block;
      will-change: transform;
      background: ${({ theme }) => theme.colors.neutral0};
      width: ${({ theme }) => theme.spaces[5]};
      height: ${({ theme }) => theme.spaces[5]};
      border: solid 1px ${({ theme }) => theme.colors.neutral300};
      border-radius: 50%;

      &:before,
      &:after {
        content: '';
        display: block;
        border-radius: 50%;
        width: ${({ theme }) => theme.spaces[3]};
        height: ${({ theme }) => theme.spaces[3]};
        position: absolute;
        top: 3px;
        left: 3px;
      }

      &:after {
        transform: scale(0);
        transition: inherit;
        will-change: transform;
      }
    }
  }

  .container input:checked ~ div {
    background: ${({ theme }) => theme.colors.primary100};
    color: ${({ theme }) => theme.colors.primary600};
    .checkmark {
      border: solid 1px ${({ theme }) => theme.colors.primary600};
      &::after {
        background: ${({ theme }) => theme.colors.primary600};
        transform: scale(1);
      }
    }
  }
`;
const CustomRadioGroup = ({
  intlLabel,
  name,
  onChange,
  radios = [],
  value
}) => {
  const { formatMessage } = reactIntl.useIntl();
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", alignItems: "stretch", gap: 2, children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "pi", fontWeight: "bold", textColor: "neutral800", htmlFor: name, tag: "label", children: formatMessage(intlLabel) }),
    /* @__PURE__ */ jsxRuntime.jsx(Wrapper$1, { gap: 4, alignItems: "stretch", children: radios.map((radio) => {
      return /* @__PURE__ */ jsxRuntime.jsxs("label", { htmlFor: radio.value.toString(), className: "container", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "input",
          {
            id: radio.value.toString(),
            name,
            className: "option-input",
            checked: radio.value === value,
            value: radio.value,
            onChange,
            type: "radio"
          },
          radio.value
        ),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { className: "option", padding: 4, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingRight: 4, children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "checkmark" }) }),
          /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", alignItems: "stretch", gap: 2, children: [
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { fontWeight: "bold", children: formatMessage(radio.title) }),
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "pi", textColor: "neutral600", children: formatMessage(radio.description) })
          ] })
        ] }) })
      ] }, radio.value);
    }) })
  ] });
};
const BooleanRadioGroup = ({
  onChange,
  name,
  intlLabel,
  ...rest
}) => {
  const handleChange = (e) => {
    const checked = e.target.value !== "false";
    onChange({ target: { name, value: checked, type: "boolean-radio-group" } });
  };
  return /* @__PURE__ */ jsxRuntime.jsx(CustomRadioGroup, { ...rest, name, onChange: handleChange, intlLabel });
};
const CheckboxWithNumberField = ({
  error,
  intlLabel,
  modifiedData,
  name,
  onChange,
  value = null
}) => {
  const { formatMessage } = reactIntl.useIntl();
  const label = intlLabel.id ? formatMessage(
    { id: intlLabel.id, defaultMessage: intlLabel.defaultMessage },
    { ...intlLabel.values }
  ) : name;
  const type = modifiedData.type === "biginteger" ? "text" : "number";
  const disabled = !modifiedData.type;
  const errorMessage = error ? formatMessage({ id: error, defaultMessage: error }) : "";
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", alignItems: "stretch", gap: 2, children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.Checkbox,
      {
        id: name,
        name,
        onCheckedChange: (value2) => {
          const initValue = type === "text" ? "0" : 0;
          const nextValue = value2 ? initValue : null;
          onChange({ target: { name, value: nextValue } });
        },
        checked: value !== null,
        children: label
      }
    ),
    value !== null && /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingLeft: 6, style: { maxWidth: "200px" }, children: type === "text" ? /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { error: errorMessage, name, children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.TextInput,
        {
          "aria-label": label,
          disabled,
          onChange,
          value: value === null ? "" : value
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Error, {})
    ] }) : /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { error: errorMessage, name, children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.NumberInput,
        {
          "aria-label": label,
          disabled,
          onValueChange: (value2) => {
            onChange({ target: { name, value: value2 ?? 0, type } });
          },
          value: value || 0
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Error, {})
    ] }) })
  ] });
};
const ContentTypeRadioGroup = ({ onChange, ...rest }) => {
  const { formatMessage } = reactIntl.useIntl();
  const { toggleNotification } = strapiAdmin.useNotification();
  const handleChange = (e) => {
    toggleNotification({
      type: "info",
      message: formatMessage({
        id: getTrad("contentType.kind.change.warning"),
        defaultMessage: "You just changed the kind of a content type: API will be reset (routes, controllers, and services will be overwritten)."
      })
    });
    onChange(e);
  };
  return /* @__PURE__ */ jsxRuntime.jsx(CustomRadioGroup, { ...rest, onChange: handleChange });
};
const DraftAndPublishToggle = ({
  description,
  disabled = false,
  intlLabel,
  isCreating,
  name,
  onChange,
  value = false
}) => {
  const { formatMessage } = reactIntl.useIntl();
  const [showWarning, setShowWarning] = React.useState(false);
  const label = intlLabel.id ? formatMessage(
    { id: intlLabel.id, defaultMessage: intlLabel.defaultMessage },
    { ...intlLabel.values }
  ) : name;
  const hint = description ? formatMessage(
    { id: description.id, defaultMessage: description.defaultMessage },
    { ...description.values }
  ) : "";
  const handleConfirm = () => {
    onChange({ target: { name, value: false } });
    setShowWarning(false);
  };
  const handleChange = (checked) => {
    if (!checked && !isCreating) {
      setShowWarning(true);
      return;
    }
    onChange({ target: { name, value: !!checked } });
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { hint, name, children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Checkbox, { checked: value, disabled, onCheckedChange: handleChange, children: label }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Hint, {})
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Dialog.Root, { open: showWarning, onOpenChange: (isOpen) => setShowWarning(isOpen), children: /* @__PURE__ */ jsxRuntime.jsx(
      strapiAdmin.ConfirmDialog,
      {
        endAction: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { onClick: handleConfirm, variant: "danger", width: "100%", justifyContent: "center", children: formatMessage({
          id: getTrad("popUpWarning.draft-publish.button.confirm"),
          defaultMessage: "Yes, disable"
        }) }),
        children: formatMessage({
          id: getTrad("popUpWarning.draft-publish.message"),
          defaultMessage: "If you disable the draft & publish, your drafts will be deleted."
        })
      }
    ) })
  ] });
};
const FormModalEndActions = ({
  categoryName,
  deleteCategory,
  deleteComponent,
  deleteContentType,
  isAttributeModal,
  isCustomFieldModal,
  isComponentAttribute,
  isComponentToDzModal,
  isContentTypeModal,
  isCreatingComponent,
  isCreatingComponentAttribute,
  isCreatingComponentInDz,
  isCreatingComponentWhileAddingAField,
  isCreatingContentType,
  isCreatingDz,
  isComponentModal,
  isDzAttribute,
  isEditingAttribute,
  isEditingCategory,
  isInFirstComponentStep,
  onSubmitAddComponentAttribute,
  onSubmitAddComponentToDz,
  onSubmitCreateContentType,
  onSubmitCreateComponent,
  onSubmitCreateDz,
  onSubmitEditAttribute,
  onSubmitEditCategory,
  onSubmitEditComponent,
  onSubmitEditContentType,
  onSubmitEditCustomFieldAttribute,
  onSubmitEditDz,
  onClickFinish
}) => {
  const { formatMessage } = reactIntl.useIntl();
  if (isComponentToDzModal) {
    if (isCreatingComponentInDz) {
      return /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Button,
        {
          variant: "secondary",
          type: "submit",
          onClick: (e) => {
            e.preventDefault();
            onSubmitAddComponentToDz(e, true);
          },
          startIcon: /* @__PURE__ */ jsxRuntime.jsx(Icons.Plus, {}),
          children: formatMessage({
            id: getTrad("form.button.add-first-field-to-created-component"),
            defaultMessage: "Add first field to the component"
          })
        }
      );
    }
    return /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.Button,
      {
        variant: "default",
        type: "submit",
        onClick: (e) => {
          e.preventDefault();
          onSubmitAddComponentToDz(e, false);
        },
        children: formatMessage({
          id: "global.finish",
          defaultMessage: "Finish"
        })
      }
    );
  }
  if (isAttributeModal && isDzAttribute && !isCreatingDz) {
    return /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.Button,
      {
        variant: "default",
        type: "submit",
        onClick: (e) => {
          e.preventDefault();
          onClickFinish();
          onSubmitEditDz(e, false);
        },
        children: formatMessage({
          id: "global.finish",
          defaultMessage: "Finish"
        })
      }
    );
  }
  if (isAttributeModal && isDzAttribute && isCreatingDz) {
    return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.Button,
      {
        variant: "secondary",
        type: "submit",
        onClick: (e) => {
          e.preventDefault();
          onSubmitCreateDz(e, true);
        },
        startIcon: /* @__PURE__ */ jsxRuntime.jsx(Icons.Plus, {}),
        children: formatMessage({
          id: getTrad("form.button.add-components-to-dynamiczone"),
          defaultMessage: "Add components to the zone"
        })
      }
    ) });
  }
  if (isAttributeModal && isComponentAttribute) {
    if (isInFirstComponentStep) {
      return /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Button,
        {
          variant: "secondary",
          type: "submit",
          onClick: (e) => {
            e.preventDefault();
            onSubmitAddComponentAttribute(e, true);
          },
          children: isCreatingComponentAttribute ? formatMessage({
            id: getTrad("form.button.configure-component"),
            defaultMessage: "Configure the component"
          }) : formatMessage({
            id: getTrad("form.button.select-component"),
            defaultMessage: "Configure the component"
          })
        }
      );
    }
    return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 2, children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Button,
        {
          variant: "secondary",
          type: "submit",
          onClick: (e) => {
            e.preventDefault();
            onSubmitAddComponentAttribute(e, true);
          },
          startIcon: /* @__PURE__ */ jsxRuntime.jsx(Icons.Plus, {}),
          children: isCreatingComponentWhileAddingAField ? formatMessage({
            id: getTrad("form.button.add-first-field-to-created-component"),
            defaultMessage: "Add first field to the component"
          }) : formatMessage({
            id: getTrad("form.button.add-field"),
            defaultMessage: "Add another field"
          })
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Button,
        {
          variant: "default",
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            onClickFinish();
            onSubmitAddComponentAttribute(e, false);
          },
          children: formatMessage({
            id: "global.finish",
            defaultMessage: "Finish"
          })
        }
      )
    ] });
  }
  if (isAttributeModal && !isComponentAttribute && !isDzAttribute) {
    return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 2, children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Button,
        {
          type: isEditingAttribute ? "button" : "submit",
          variant: "secondary",
          onClick: (e) => {
            e.preventDefault();
            onSubmitEditAttribute(e, true);
          },
          startIcon: /* @__PURE__ */ jsxRuntime.jsx(Icons.Plus, {}),
          children: formatMessage({
            id: getTrad("form.button.add-field"),
            defaultMessage: "Add another field"
          })
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Button,
        {
          type: isEditingAttribute ? "submit" : "button",
          variant: "default",
          onClick: (e) => {
            e.preventDefault();
            onClickFinish();
            onSubmitEditAttribute(e, false);
          },
          children: formatMessage({
            id: "global.finish",
            defaultMessage: "Finish"
          })
        }
      )
    ] });
  }
  if (isContentTypeModal) {
    return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 2, children: [
      !isCreatingContentType && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.Button,
          {
            type: "button",
            variant: "danger",
            onClick: (e) => {
              e.preventDefault();
              deleteContentType();
            },
            children: formatMessage({
              id: "global.delete",
              defaultMessage: "Delete"
            })
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.Button,
          {
            type: "submit",
            variant: "default",
            onClick: (e) => {
              e.preventDefault();
              onSubmitEditContentType(e, false);
            },
            children: formatMessage({
              id: "global.finish",
              defaultMessage: "Finish"
            })
          }
        )
      ] }),
      isCreatingContentType && /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Button,
        {
          type: "submit",
          variant: "secondary",
          onClick: (e) => {
            e.preventDefault();
            onSubmitCreateContentType(e, true);
          },
          children: formatMessage({
            id: "global.continue",
            defaultMessage: "Continue"
          })
        }
      )
    ] });
  }
  if (isComponentModal) {
    return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 2, children: [
      !isCreatingComponent && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.Button,
          {
            type: "button",
            variant: "danger",
            onClick: (e) => {
              e.preventDefault();
              deleteComponent();
            },
            children: formatMessage({
              id: "global.delete",
              defaultMessage: "Delete"
            })
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.Button,
          {
            type: "submit",
            variant: "default",
            onClick: (e) => {
              e.preventDefault();
              onSubmitEditComponent(e, false);
            },
            children: formatMessage({
              id: "global.finish",
              defaultMessage: "Finish"
            })
          }
        )
      ] }),
      isCreatingComponent && /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Button,
        {
          type: "submit",
          variant: "secondary",
          onClick: (e) => {
            e.preventDefault();
            onSubmitCreateComponent(e, true);
          },
          children: formatMessage({
            id: "global.continue",
            defaultMessage: "Continue"
          })
        }
      )
    ] });
  }
  if (isEditingCategory) {
    return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 2, children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Button,
        {
          type: "button",
          variant: "danger",
          onClick: (e) => {
            e.preventDefault();
            if (categoryName) {
              deleteCategory(categoryName);
            }
          },
          children: formatMessage({
            id: "global.delete",
            defaultMessage: "Delete"
          })
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Button,
        {
          type: "submit",
          variant: "default",
          onClick: (e) => {
            e.preventDefault();
            onSubmitEditCategory(e);
          },
          children: formatMessage({
            id: "global.finish",
            defaultMessage: "finish"
          })
        }
      )
    ] });
  }
  if (isCustomFieldModal) {
    return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 2, children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Button,
        {
          type: isEditingAttribute ? "button" : "submit",
          variant: "secondary",
          onClick: (e) => {
            e.preventDefault();
            onSubmitEditCustomFieldAttribute(e, true);
          },
          startIcon: /* @__PURE__ */ jsxRuntime.jsx(Icons.Plus, {}),
          children: formatMessage({
            id: getTrad("form.button.add-field"),
            defaultMessage: "Add another field"
          })
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Button,
        {
          type: isEditingAttribute ? "submit" : "button",
          variant: "default",
          onClick: (e) => {
            e.preventDefault();
            onClickFinish();
            onSubmitEditCustomFieldAttribute(e, false);
          },
          children: formatMessage({
            id: "global.finish",
            defaultMessage: "Finish"
          })
        }
      )
    ] });
  }
  return null;
};
const FormModalHeader = ({
  actionType = null,
  attributeName,
  attributeType,
  categoryName,
  contentTypeKind,
  dynamicZoneTarget,
  forTarget,
  modalType = null,
  targetUid,
  customFieldUid = null,
  showBackLink = false
}) => {
  const { formatMessage } = reactIntl.useIntl();
  const { modifiedData } = useDataManager();
  const { onOpenModalAddField } = useFormModalNavigation();
  let icon = "component";
  let headers = [];
  const schema = modifiedData?.[forTarget]?.[targetUid] || modifiedData?.[forTarget] || null;
  const displayName = schema?.schema.displayName;
  if (modalType === "contentType") {
    icon = contentTypeKind;
  }
  if (["component", "editCategory"].includes(modalType || "")) {
    icon = "component";
  }
  const isCreatingMainSchema = ["component", "contentType"].includes(modalType || "");
  if (isCreatingMainSchema) {
    let headerId = getTrad(`modalForm.component.header-${actionType}`);
    if (modalType === "contentType") {
      headerId = getTrad(`modalForm.${contentTypeKind}.header-create`);
    }
    if (actionType === "edit") {
      headerId = getTrad(`modalForm.header-edit`);
    }
    return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Modal.Header, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { children: /* @__PURE__ */ jsxRuntime.jsx(AttributeIcon, { type: icon }) }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingLeft: 3, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Modal.Title, { children: formatMessage({ id: headerId }, { name: displayName }) }) })
    ] }) });
  }
  headers = [
    {
      label: displayName,
      info: { category: schema?.category || null, name: schema?.schema.displayName }
    }
  ];
  if (modalType === "chooseAttribute") {
    icon = ["component", "components"].includes(forTarget) ? "component" : schema.schema.kind;
  }
  if (modalType === "addComponentToDynamicZone") {
    icon = "dynamiczone";
    headers.push({ label: dynamicZoneTarget });
  }
  if (modalType === "attribute" || modalType === "customField") {
    icon = attributeType;
    headers.push({ label: attributeName });
  }
  if (modalType === "editCategory") {
    const label = formatMessage({
      id: getTrad("modalForm.header.categories"),
      defaultMessage: "Categories"
    });
    headers = [{ label }, { label: categoryName }];
  }
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Modal.Header, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 3, children: [
    showBackLink && // This is a workaround and should use the LinkButton with a variant that currently doesn't exist
    /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.Link,
      {
        "aria-label": formatMessage({
          id: getTrad("modalForm.header.back"),
          defaultMessage: "Back"
        }),
        startIcon: /* @__PURE__ */ jsxRuntime.jsx(Icons.ArrowLeft, {}),
        onClick: () => onOpenModalAddField({ forTarget, targetUid }),
        href: "#back",
        isExternal: false
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(AttributeIcon, { type: icon, customField: customFieldUid }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Breadcrumbs, { label: headers.map(({ label }) => label).join(","), children: headers.map(({ label, info }, index2, arr) => {
      label = upperFirst__default.default(label);
      if (!label) {
        return null;
      }
      const key = `${label}.${index2}`;
      if (info?.category) {
        label = `${label} (${upperFirst__default.default(info.category)} - ${upperFirst__default.default(info.name)})`;
      }
      return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Crumb, { isCurrent: index2 === arr.length - 1, children: label }, key);
    }) })
  ] }) });
};
const getModalTitleSubHeader = ({
  modalType,
  forTarget,
  kind,
  actionType,
  step
}) => {
  switch (modalType) {
    case "chooseAttribute":
      return getTrad(
        `modalForm.sub-header.chooseAttribute.${forTarget?.includes("component") ? "component" : kind || "collectionType"}`
      );
    case "attribute": {
      return getTrad(
        `modalForm.sub-header.attribute.${actionType}${step !== "null" && step !== null && actionType !== "edit" ? ".step" : ""}`
      );
    }
    case "customField": {
      return getTrad(`modalForm.sub-header.attribute.${actionType}`);
    }
    case "addComponentToDynamicZone":
      return getTrad("modalForm.sub-header.addComponentToDynamicZone");
    default:
      return getTrad("configurations");
  }
};
const FormModalSubHeader = ({
  actionType,
  modalType,
  forTarget,
  kind,
  step,
  attributeType,
  attributeName,
  customField
}) => {
  const { formatMessage } = reactIntl.useIntl();
  const intlLabel = modalType === "customField" ? customField?.intlLabel : { id: getTrad(`attribute.${attributeType}`) };
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", alignItems: "flex-start", paddingBottom: 1, gap: 1, children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { tag: "h2", variant: "beta", children: formatMessage(
      {
        id: getModalTitleSubHeader({
          actionType,
          forTarget,
          kind,
          step,
          modalType
        }),
        defaultMessage: "Add new field"
      },
      {
        type: intlLabel ? upperFirst__default.default(formatMessage(intlLabel)) : "",
        name: upperFirst__default.default(attributeName),
        step
      }
    ) }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "pi", textColor: "neutral600", children: formatMessage({
      id: getTrad(`attribute.${attributeType}.description`),
      defaultMessage: "A type for modeling data"
    }) })
  ] });
};
const COMPONENT_ICONS = {
  alien: Icons__namespace.Alien,
  apps: Icons__namespace.GridNine,
  archive: Icons__namespace.Archive,
  arrowDown: Icons__namespace.ArrowDown,
  arrowLeft: Icons__namespace.ArrowLeft,
  arrowRight: Icons__namespace.ArrowRight,
  arrowUp: Icons__namespace.ArrowUp,
  attachment: Icons__namespace.Paperclip,
  bell: Icons__namespace.Bell,
  bold: Icons__namespace.Bold,
  book: Icons__namespace.Book,
  briefcase: Icons__namespace.Briefcase,
  brush: Icons__namespace.PaintBrush,
  bulletList: Icons__namespace.BulletList,
  calendar: Icons__namespace.Calendar,
  car: Icons__namespace.Car,
  cast: Icons__namespace.Cast,
  chartBubble: Icons__namespace.ChartBubble,
  chartCircle: Icons__namespace.ChartCircle,
  chartPie: Icons__namespace.ChartPie,
  check: Icons__namespace.Check,
  clock: Icons__namespace.Clock,
  cloud: Icons__namespace.Cloud,
  code: Icons__namespace.Code,
  cog: Icons__namespace.Cog,
  collapse: Icons__namespace.Collapse,
  command: Icons__namespace.Command,
  connector: Icons__namespace.Faders,
  crop: Icons__namespace.Crop,
  crown: Icons__namespace.Crown,
  cup: Icons__namespace.Coffee,
  cursor: Icons__namespace.Cursor,
  dashboard: Icons__namespace.SquaresFour,
  database: Icons__namespace.Database,
  discuss: Icons__namespace.Discuss,
  doctor: Icons__namespace.Stethoscope,
  earth: Icons__namespace.Earth,
  emotionHappy: Icons__namespace.EmotionHappy,
  emotionUnhappy: Icons__namespace.EmotionUnhappy,
  envelop: Icons__namespace.Mail,
  exit: Icons__namespace.SignOut,
  expand: Icons__namespace.Expand,
  eye: Icons__namespace.Eye,
  feather: Icons__namespace.Feather,
  file: Icons__namespace.File,
  fileError: Icons__namespace.FileError,
  filePdf: Icons__namespace.FilePdf,
  filter: Icons__namespace.Filter,
  folder: Icons__namespace.Folder,
  gate: Icons__namespace.CastleTurret,
  gift: Icons__namespace.Gift,
  globe: Icons__namespace.Globe,
  grid: Icons__namespace.GridFour,
  handHeart: Icons__namespace.HandHeart,
  hashtag: Icons__namespace.Hashtag,
  headphone: Icons__namespace.Headphones,
  heart: Icons__namespace.Heart,
  house: Icons__namespace.House,
  information: Icons__namespace.Information,
  italic: Icons__namespace.Italic,
  key: Icons__namespace.Key,
  landscape: Icons__namespace.Images,
  layer: Icons__namespace.ListPlus,
  layout: Icons__namespace.Layout,
  lightbulb: Icons__namespace.Lightbulb,
  link: Icons__namespace.Link,
  lock: Icons__namespace.Lock,
  magic: Icons__namespace.Magic,
  manyToMany: Icons__namespace.ManyToMany,
  manyToOne: Icons__namespace.ManyToOne,
  manyWays: Icons__namespace.ManyWays,
  medium: Symbols__namespace.Medium,
  message: Icons__namespace.Message,
  microphone: Icons__namespace.Microphone,
  monitor: Icons__namespace.Monitor,
  moon: Icons__namespace.Moon,
  music: Icons__namespace.MusicNotes,
  oneToMany: Icons__namespace.OneToMany,
  oneToOne: Icons__namespace.OneToOne,
  oneWay: Icons__namespace.OneWay,
  paint: Icons__namespace.PaintBrush,
  paintBrush: Icons__namespace.PaintBrush,
  paperPlane: Icons__namespace.PaperPlane,
  pencil: Icons__namespace.Pencil,
  phone: Icons__namespace.Phone,
  picture: Icons__namespace.Image,
  pin: Icons__namespace.Pin,
  pinMap: Icons__namespace.PinMap,
  plane: Icons__namespace.Plane,
  play: Icons__namespace.Play,
  plus: Icons__namespace.Plus,
  priceTag: Icons__namespace.PriceTag,
  puzzle: Icons__namespace.PuzzlePiece,
  question: Icons__namespace.Question,
  quote: Icons__namespace.Quotes,
  refresh: Icons__namespace.ArrowClockwise,
  restaurant: Icons__namespace.Restaurant,
  rocket: Icons__namespace.Rocket,
  rotate: Icons__namespace.ArrowsCounterClockwise,
  scissors: Icons__namespace.Scissors,
  search: Icons__namespace.Search,
  seed: Icons__namespace.Plant,
  server: Icons__namespace.Server,
  shield: Icons__namespace.Shield,
  shirt: Icons__namespace.Shirt,
  shoppingCart: Icons__namespace.ShoppingCart,
  slideshow: Icons__namespace.PresentationChart,
  stack: Icons__namespace.Stack,
  star: Icons__namespace.Star,
  store: Icons__namespace.Store,
  strikeThrough: Icons__namespace.StrikeThrough,
  sun: Icons__namespace.Sun,
  television: Icons__namespace.Television,
  thumbDown: Icons__namespace.ThumbDown,
  thumbUp: Icons__namespace.ThumbUp,
  train: Icons__namespace.Train,
  twitter: Symbols__namespace.X,
  typhoon: Icons__namespace.Typhoon,
  underline: Icons__namespace.Underline,
  user: Icons__namespace.User,
  volumeMute: Icons__namespace.VolumeMute,
  volumeUp: Icons__namespace.VolumeUp,
  walk: Icons__namespace.Walk,
  wheelchair: Icons__namespace.Wheelchair,
  write: Icons__namespace.Feather
};
const IconPickerWrapper = styledComponents.styled(designSystem.Flex)`
  label {
    ${designSystem.inputFocusStyle()}
    border-radius: ${({ theme }) => theme.borderRadius};
    border: 1px solid ${({ theme }) => theme.colors.neutral100};
  }
`;
const IconPick = ({ iconKey, name, onChange, isSelected, ariaLabel }) => {
  const Icon = COMPONENT_ICONS[iconKey];
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Root, { name, required: false, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Label, { children: [
    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.VisuallyHidden, { children: [
      ariaLabel,
      /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Field.Input,
        {
          type: "radio",
          checked: isSelected,
          onChange,
          value: iconKey,
          "aria-checked": isSelected
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.Flex,
      {
        padding: 2,
        cursor: "pointer",
        hasRadius: true,
        background: isSelected ? "primary200" : void 0,
        children: /* @__PURE__ */ jsxRuntime.jsx(Icon, { fill: isSelected ? "primary600" : "neutral300" })
      }
    )
  ] }) });
};
const IconPicker = ({ intlLabel, name, onChange, value = "" }) => {
  const { formatMessage } = reactIntl.useIntl();
  const [showSearch, setShowSearch] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const allIcons = Object.keys(COMPONENT_ICONS);
  const [icons, setIcons] = React.useState(allIcons);
  const searchIconRef = React.useRef(null);
  const searchBarRef = React.useRef(null);
  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };
  const onChangeSearch = ({ target: { value: value2 } }) => {
    setSearch(value2);
    setIcons(() => allIcons.filter((icon) => icon.toLowerCase().includes(value2.toLowerCase())));
  };
  const onClearSearch = () => {
    toggleSearch();
    setSearch("");
    setIcons(allIcons);
  };
  const removeIconSelected = () => {
    onChange({ target: { name, value: "" } });
  };
  React.useEffect(() => {
    if (showSearch) {
      searchBarRef.current?.focus();
    }
  }, [showSearch]);
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { justifyContent: "space-between", paddingBottom: 2, children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "pi", fontWeight: "bold", textColor: "neutral800", tag: "label", children: formatMessage(intlLabel) }),
      /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 1, children: [
        showSearch ? /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.Searchbar,
          {
            ref: searchBarRef,
            name: "searchbar",
            placeholder: formatMessage({
              id: getTrad("ComponentIconPicker.search.placeholder"),
              defaultMessage: "Search for an icon"
            }),
            onBlur: () => {
              if (!search) {
                toggleSearch();
              }
            },
            onChange: onChangeSearch,
            value: search,
            onClear: onClearSearch,
            clearLabel: formatMessage({
              id: getTrad("IconPicker.search.clear.label"),
              defaultMessage: "Clear the icon search"
            }),
            children: formatMessage({
              id: getTrad("IconPicker.search.placeholder.label"),
              defaultMessage: "Search for an icon"
            })
          }
        ) : /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.IconButton,
          {
            ref: searchIconRef,
            onClick: toggleSearch,
            withTooltip: false,
            label: formatMessage({
              id: getTrad("IconPicker.search.button.label"),
              defaultMessage: "Search icon button"
            }),
            variant: "ghost",
            children: /* @__PURE__ */ jsxRuntime.jsx(Icons.Search, {})
          }
        ),
        value && /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.Tooltip,
          {
            label: formatMessage({
              id: getTrad("IconPicker.remove.tooltip"),
              defaultMessage: "Remove the selected icon"
            }),
            children: /* @__PURE__ */ jsxRuntime.jsx(
              designSystem.IconButton,
              {
                onClick: removeIconSelected,
                withTooltip: false,
                label: formatMessage({
                  id: getTrad("IconPicker.remove.button"),
                  defaultMessage: "Remove the selected icon"
                }),
                variant: "ghost",
                children: /* @__PURE__ */ jsxRuntime.jsx(Icons.Trash, {})
              }
            )
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(
      IconPickerWrapper,
      {
        position: "relative",
        padding: 1,
        background: "neutral100",
        hasRadius: true,
        wrap: "wrap",
        gap: 2,
        maxHeight: "126px",
        overflow: "auto",
        textAlign: "center",
        children: icons.length > 0 ? icons.map((iconKey) => /* @__PURE__ */ jsxRuntime.jsx(
          IconPick,
          {
            iconKey,
            name,
            onChange,
            isSelected: iconKey === value,
            ariaLabel: formatMessage(
              {
                id: getTrad("IconPicker.icon.label"),
                defaultMessage: "Select {icon} icon"
              },
              { icon: iconKey }
            )
          },
          iconKey
        )) : /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { padding: 4, grow: 2, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "delta", textColor: "neutral600", textAlign: "center", children: formatMessage({
          id: getTrad("IconPicker.emptyState.label"),
          defaultMessage: "No icon found"
        }) }) })
      }
    )
  ] });
};
const PluralName = ({
  description,
  error,
  intlLabel,
  modifiedData,
  name,
  onChange,
  value
}) => {
  const { formatMessage } = reactIntl.useIntl();
  const onChangeRef = React.useRef(onChange);
  const displayName = modifiedData?.displayName || "";
  React.useEffect(() => {
    if (displayName) {
      const value2 = index$1.nameToSlug(displayName);
      try {
        const plural = pluralize__default.default(value2, 2);
        onChangeRef.current({ target: { name, value: plural } });
      } catch (err) {
        onChangeRef.current({ target: { name, value: value2 } });
      }
    } else {
      onChangeRef.current({ target: { name, value: "" } });
    }
  }, [displayName, name]);
  const errorMessage = error ? formatMessage({ id: error, defaultMessage: error }) : "";
  const hint = description ? formatMessage(
    { id: description.id, defaultMessage: description.defaultMessage },
    { ...description.values }
  ) : "";
  const label = formatMessage(intlLabel);
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { error: errorMessage, hint, name, children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { children: label }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.TextInput, { onChange, value: value || "" }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Error, {})
  ] });
};
const parseDateValue = (value) => {
  if (value instanceof Date && isValidDate(value)) {
    return value;
  }
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    if (isValidDate(date)) {
      return date;
    }
  }
};
const isValidDate = (date) => !isNaN(date.getTime());
const removeSeconds = (time) => {
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
};
const addSecondsAndMilliseconds = (time) => {
  return time.split(":").length === 2 ? `${time}:00.000` : time;
};
const formatTimeForInput = (value) => {
  if (!value) return;
  return value.split(":").length > 2 ? removeSeconds(value) : value;
};
const formatTimeForOutput = (value) => {
  if (!value) return void 0;
  return addSecondsAndMilliseconds(value);
};
const handleTimeChange = ({ value }) => {
  const formattedInputTime = formatTimeForInput(value);
  return formattedInputTime;
};
const handleTimeChangeEvent = (onChange, name, type, time) => {
  const formattedOutputTime = formatTimeForOutput(time);
  onChange({
    target: {
      name,
      value: formattedOutputTime,
      type
    }
  });
};
const GenericInput = ({
  autoComplete,
  customInputs,
  description,
  disabled,
  intlLabel,
  labelAction,
  error,
  name,
  onChange,
  options: options2 = [],
  placeholder,
  required,
  step,
  type,
  value: defaultValue,
  isNullable,
  attribute,
  ...rest
}) => {
  const { formatMessage } = reactIntl.useIntl();
  const getFieldHintValue = (attribute2, key) => {
    if (!attribute2) return;
    if (key === "minLength" && key in attribute2) {
      return attribute2[key];
    }
    if (key === "maxLength" && key in attribute2) {
      return attribute2[key];
    }
    if (key === "max" && key in attribute2) {
      return attribute2[key];
    }
    if (key === "min" && key in attribute2) {
      return attribute2[key];
    }
  };
  const { hint } = useFieldHint({
    description,
    fieldSchema: {
      minLength: getFieldHintValue(attribute, "minLength"),
      maxLength: getFieldHintValue(attribute, "maxLength"),
      max: getFieldHintValue(attribute, "max"),
      min: getFieldHintValue(attribute, "min")
    },
    type: attribute?.type || type
  });
  const [showPassword, setShowPassword] = React__namespace.useState(false);
  const CustomInput = customInputs ? customInputs[type] : null;
  const value = defaultValue ?? void 0;
  const valueWithEmptyStringFallback = value ?? "";
  function getErrorMessage(error2) {
    if (!error2) {
      return null;
    }
    if (typeof error2 === "string") {
      return formatMessage({ id: error2, defaultMessage: error2 });
    }
    const values = {
      ...error2.values
    };
    return formatMessage(
      {
        id: error2.id,
        defaultMessage: error2?.defaultMessage ?? error2.id
      },
      values
    );
  }
  const errorMessage = getErrorMessage(error) ?? void 0;
  if (CustomInput) {
    return /* @__PURE__ */ jsxRuntime.jsx(
      CustomInput,
      {
        ...rest,
        attribute,
        description,
        hint,
        disabled,
        intlLabel,
        labelAction,
        error: errorMessage || "",
        name,
        onChange,
        options: options2,
        required,
        placeholder,
        type,
        value
      }
    );
  }
  const label = intlLabel.id ? formatMessage(
    { id: intlLabel.id, defaultMessage: intlLabel.defaultMessage },
    { ...intlLabel.values }
  ) : name;
  const formattedPlaceholder = placeholder ? formatMessage(
    { id: placeholder.id, defaultMessage: placeholder.defaultMessage },
    { ...placeholder.values }
  ) : "";
  const getComponent = () => {
    switch (type) {
      case "json": {
        return /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.JSONInput,
          {
            value,
            disabled,
            onChange: (json) => {
              const value2 = attribute && "required" in attribute && !attribute?.required && !json.length ? null : json;
              onChange({ target: { name, value: value2 } }, false);
            },
            minHeight: "25.2rem",
            maxHeight: "50.4rem"
          }
        );
      }
      case "bool": {
        return /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.Toggle,
          {
            checked: defaultValue === null ? null : defaultValue || false,
            disabled,
            offLabel: formatMessage({
              id: "app.components.ToggleCheckbox.off-label",
              defaultMessage: "False"
            }),
            onLabel: formatMessage({
              id: "app.components.ToggleCheckbox.on-label",
              defaultMessage: "True"
            }),
            onChange: (e) => {
              onChange({ target: { name, value: e.target.checked } });
            }
          }
        );
      }
      case "checkbox": {
        return /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.Checkbox,
          {
            disabled,
            onCheckedChange: (value2) => {
              onChange({ target: { name, value: value2 } });
            },
            checked: Boolean(value),
            children: label
          }
        );
      }
      case "datetime": {
        const dateValue = parseDateValue(value);
        return /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.DateTimePicker,
          {
            clearLabel: formatMessage({ id: "clearLabel", defaultMessage: "Clear" }),
            disabled,
            onChange: (date) => {
              const formattedDate = date ? date.toISOString() : null;
              onChange({ target: { name, value: formattedDate, type } });
            },
            onClear: () => onChange({ target: { name, value: null, type } }),
            placeholder: formattedPlaceholder,
            value: dateValue
          }
        );
      }
      case "date": {
        const dateValue = parseDateValue(value);
        return /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.DatePicker,
          {
            clearLabel: formatMessage({ id: "clearLabel", defaultMessage: "Clear" }),
            disabled,
            onChange: (date) => {
              onChange({
                target: {
                  name,
                  value: date ? formatISO__default.default(date, { representation: "date" }) : null,
                  type
                }
              });
            },
            onClear: () => onChange({ target: { name, value: null, type } }),
            placeholder: formattedPlaceholder,
            value: dateValue
          }
        );
      }
      case "number": {
        return /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.NumberInput,
          {
            disabled,
            onValueChange: (value2) => {
              onChange({ target: { name, value: value2, type } });
            },
            placeholder: formattedPlaceholder,
            step,
            value
          }
        );
      }
      case "email": {
        return /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.TextInput,
          {
            autoComplete,
            disabled,
            onChange: (e) => {
              onChange({ target: { name, value: e.target.value, type } });
            },
            placeholder: formattedPlaceholder,
            type: "email",
            value: valueWithEmptyStringFallback
          }
        );
      }
      case "timestamp":
      case "text":
      case "string": {
        return /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.TextInput,
          {
            autoComplete,
            disabled,
            onChange: (e) => {
              onChange({ target: { name, value: e.target.value, type } });
            },
            placeholder: formattedPlaceholder,
            type: "text",
            value: valueWithEmptyStringFallback
          }
        );
      }
      case "password": {
        return /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.TextInput,
          {
            autoComplete,
            disabled,
            endAction: /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                "aria-label": formatMessage({
                  id: "Auth.form.password.show-password",
                  defaultMessage: "Show password"
                }),
                onClick: () => {
                  setShowPassword((prev) => !prev);
                },
                style: {
                  border: "none",
                  padding: 0,
                  background: "transparent"
                },
                type: "button",
                children: showPassword ? /* @__PURE__ */ jsxRuntime.jsx(Icons.Eye, { fill: "neutral500" }) : /* @__PURE__ */ jsxRuntime.jsx(Icons.EyeStriked, { fill: "neutral500" })
              }
            ),
            onChange: (e) => {
              onChange({ target: { name, value: e.target.value, type } });
            },
            placeholder: formattedPlaceholder,
            type: showPassword ? "text" : "password",
            value: valueWithEmptyStringFallback
          }
        );
      }
      case "select": {
        return /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.SingleSelect,
          {
            disabled,
            onChange: (value2) => {
              onChange({ target: { name, value: value2, type: "select" } });
            },
            placeholder: formattedPlaceholder,
            value,
            children: options2.map(({ metadatas: { intlLabel: intlLabel2, disabled: disabled2, hidden }, key, value: value2 }) => {
              return /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelectOption, { value: value2, disabled: disabled2, hidden, children: formatMessage(intlLabel2) }, key);
            })
          }
        );
      }
      case "textarea": {
        return /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.Textarea,
          {
            disabled,
            onChange: (event) => onChange({ target: { name, value: event.target.value, type } }),
            placeholder: formattedPlaceholder,
            value: valueWithEmptyStringFallback
          }
        );
      }
      case "time": {
        const formattedValue = handleTimeChange({ value, onChange, name, type });
        return /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.TimePicker,
          {
            clearLabel: formatMessage({ id: "clearLabel", defaultMessage: "Clear" }),
            disabled,
            onChange: (time) => handleTimeChangeEvent(onChange, name, type, time),
            onClear: () => handleTimeChangeEvent(onChange, name, type, void 0),
            value: formattedValue
          }
        );
      }
      default: {
        return /* @__PURE__ */ jsxRuntime.jsx(designSystem.TextInput, { disabled: true, placeholder: "Not supported", type: "text", value: "" });
      }
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { error: errorMessage, name, hint, required, children: [
    type !== "checkbox" ? /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { action: labelAction, children: label }) : null,
    getComponent(),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Error, {}),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Hint, {})
  ] });
};
const useFieldHint = ({ description, fieldSchema, type }) => {
  const { formatMessage } = reactIntl.useIntl();
  const buildDescription = () => description?.id ? formatMessage(
    { id: description.id, defaultMessage: description.defaultMessage },
    { ...description.values }
  ) : "";
  const buildHint = () => {
    const { maximum, minimum } = getMinMax(fieldSchema);
    const units = getFieldUnits({
      type,
      minimum,
      maximum
    });
    const minIsNumber = typeof minimum === "number";
    const maxIsNumber = typeof maximum === "number";
    const hasMinAndMax = maxIsNumber && minIsNumber;
    const hasMinOrMax = maxIsNumber || minIsNumber;
    if (!description?.id && !hasMinOrMax) {
      return "";
    }
    return formatMessage(
      {
        id: "content-manager.form.Input.hint.text",
        defaultMessage: "{min, select, undefined {} other {min. {min}}}{divider}{max, select, undefined {} other {max. {max}}}{unit}{br}{description}"
      },
      {
        min: minimum,
        max: maximum,
        description: buildDescription(),
        unit: units?.message && hasMinOrMax ? formatMessage(units.message, units.values) : null,
        divider: hasMinAndMax ? formatMessage({
          id: "content-manager.form.Input.hint.minMaxDivider",
          defaultMessage: " / "
        }) : null,
        br: hasMinOrMax ? /* @__PURE__ */ jsxRuntime.jsx("br", {}) : null
      }
    );
  };
  return { hint: buildHint() };
};
const getFieldUnits = ({
  type,
  minimum,
  maximum
}) => {
  if (type && ["biginteger", "integer", "number"].includes(type)) {
    return {};
  }
  const maxValue = Math.max(minimum || 0, maximum || 0);
  return {
    message: {
      id: "content-manager.form.Input.hint.character.unit",
      defaultMessage: "{maxValue, plural, one { character} other { characters}}"
    },
    values: {
      maxValue
    }
  };
};
const getMinMax = (fieldSchema) => {
  if (!fieldSchema) {
    return { maximum: void 0, minimum: void 0 };
  }
  const { minLength, maxLength, max, min } = fieldSchema;
  let minimum;
  let maximum;
  const parsedMin = Number(min);
  const parsedMinLength = Number(minLength);
  if (!Number.isNaN(parsedMin)) {
    minimum = parsedMin;
  } else if (!Number.isNaN(parsedMinLength)) {
    minimum = parsedMinLength;
  }
  const parsedMax = Number(max);
  const parsedMaxLength = Number(maxLength);
  if (!Number.isNaN(parsedMax)) {
    maximum = parsedMax;
  } else if (!Number.isNaN(parsedMaxLength)) {
    maximum = parsedMaxLength;
  }
  return { maximum, minimum };
};
const MemoizedGenericInput = React__namespace.memo(GenericInput, isEqual__default.default);
const RelationTargetPicker = ({
  oneThatIsCreatingARelationWithAnother,
  target
}) => {
  const { contentTypes, sortedContentTypesList } = useDataManager();
  const dispatch = reactRedux.useDispatch();
  const allowedContentTypesForRelation = sortedContentTypesList.filter(
    isAllowedContentTypesForRelations
  );
  const { plugin = null, schema: { displayName } = { displayName: "error" } } = contentTypes?.[target] ?? {};
  const handleSelect = ({
    uid,
    plugin: plugin2,
    title,
    restrictRelationsTo
  }) => () => {
    const selectedContentTypeFriendlyName = plugin2 ? `${plugin2}_${title}` : title;
    dispatch({
      type: index$1.ON_CHANGE_RELATION_TARGET,
      target: {
        value: uid,
        oneThatIsCreatingARelationWithAnother,
        selectedContentTypeFriendlyName,
        targetContentTypeAllowedRelations: restrictRelationsTo
      }
    });
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Menu.Root, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(MenuTrigger, { children: `${displayName} ${plugin ? `(from: ${plugin})` : ""}` }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Menu.Content, { zIndex: "popover", children: allowedContentTypesForRelation.map(({ uid, title, restrictRelationsTo, plugin: plugin2 }) => /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Menu.Item, { onSelect: handleSelect({ uid, plugin: plugin2, title, restrictRelationsTo }), children: [
      title,
      " ",
      plugin2 && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        "(from: ",
        plugin2,
        ")"
      ] })
    ] }, uid)) })
  ] });
};
const MenuTrigger = styledComponents.styled(designSystem.Menu.Trigger)`
  max-width: 16.8rem;
  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
const RelationFormBox = ({
  disabled = false,
  error,
  header,
  isMain = false,
  name,
  onChange,
  oneThatIsCreatingARelationWithAnother = "",
  target = "",
  value = ""
}) => {
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { background: "neutral100", hasRadius: true, borderColor: "neutral200", children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { paddingTop: isMain ? 4 : 1, paddingBottom: isMain ? 3 : 1, justifyContent: "center", children: isMain ? /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "pi", fontWeight: "bold", textColor: "neutral800", children: header }) : /* @__PURE__ */ jsxRuntime.jsx(
      RelationTargetPicker,
      {
        target,
        oneThatIsCreatingARelationWithAnother
      }
    ) }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Divider, { background: "neutral200" }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { padding: 4, children: /* @__PURE__ */ jsxRuntime.jsx(
      MemoizedGenericInput,
      {
        disabled,
        error: error?.id || null,
        intlLabel: {
          id: getTrad("form.attribute.item.defineRelation.fieldName"),
          defaultMessage: "Field name"
        },
        name,
        onChange,
        type: "text",
        value
      }
    ) })
  ] });
};
const Wrapper = styledComponents.styled(designSystem.Box)`
  position: relative;
  width: 100%;
  &::before {
    content: '';
    position: absolute;
    top: calc(50% - 0px);
    height: 2px;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.primary600};
    z-index: 0;
  }
`;
const IconWrapper = styledComponents.styled(designSystem.Box)`
  background: ${({ theme, $isSelected }) => theme.colors[$isSelected ? "primary100" : "neutral0"]};
  border: 1px solid
    ${({ theme, $isSelected }) => theme.colors[$isSelected ? "primary700" : "neutral200"]};
  border-radius: ${({ theme }) => theme.borderRadius};
  z-index: 1;
  flex: 0 0 2.4rem;
  svg {
    width: 2.4rem;
    height: 2.4rem;
    max-width: unset;
    path {
      fill: ${({ theme, $isSelected }) => theme.colors[$isSelected ? "primary700" : "neutral500"]};
    }
  }
  &:disabled {
    cursor: not-allowed;
  }
`;
const InfosWrapper = styledComponents.styled(designSystem.Flex)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;
const relations = {
  oneWay: Icons.OneWay,
  oneToOne: Icons.OneToOne,
  oneToMany: Icons.OneToMany,
  manyToOne: Icons.ManyToOne,
  manyToMany: Icons.ManyToMany,
  manyWay: Icons.ManyWays
};
const RelationNaturePicker = ({
  naturePickerType,
  oneThatIsCreatingARelationWithAnother,
  relationType,
  target
}) => {
  const dispatch = reactRedux.useDispatch();
  const { formatMessage } = reactIntl.useIntl();
  const { contentTypes, modifiedData } = useDataManager();
  const ctRelations = ["oneWay", "oneToOne", "oneToMany", "manyToOne", "manyToMany", "manyWay"];
  const componentRelations = ["oneWay", "manyWay"];
  const dataType = naturePickerType === "contentType" ? get__default.default(modifiedData, [naturePickerType, "schema", "kind"], "") : naturePickerType;
  const relationsType = dataType === "collectionType" ? ctRelations : componentRelations;
  const areDisplayedNamesInverted = relationType === "manyToOne";
  const targetLabel = get__default.default(contentTypes, [target, "schema", "displayName"], "unknown");
  const leftTarget = areDisplayedNamesInverted ? targetLabel : oneThatIsCreatingARelationWithAnother;
  const rightTarget = areDisplayedNamesInverted ? oneThatIsCreatingARelationWithAnother : targetLabel;
  const leftDisplayedValue = pluralize__default.default(leftTarget, relationType === "manyToMany" ? 2 : 1);
  const restrictedRelations = get__default.default(contentTypes, [target, "schema", "restrictRelationsTo"], null);
  const rightDisplayedValue = pluralize__default.default(
    rightTarget,
    ["manyToMany", "oneToMany", "manyToOne", "manyWay"].includes(relationType) ? 2 : 1
  );
  if (!relationType) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { style: { flex: 1 }, children: [
    /* @__PURE__ */ jsxRuntime.jsx(Wrapper, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { paddingLeft: 9, paddingRight: 9, paddingTop: 1, justifyContent: "center", children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.KeyboardNavigable, { tagName: "button", children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { gap: 3, children: relationsType.map((relation) => {
      const Asset = relations[relation];
      const isEnabled = restrictedRelations === null || restrictedRelations.includes(relation);
      return /* @__PURE__ */ jsxRuntime.jsx(
        IconWrapper,
        {
          tag: "button",
          $isSelected: relationType === relation,
          disabled: !isEnabled,
          onClick: () => {
            if (isEnabled) {
              dispatch({
                type: index$1.ON_CHANGE_RELATION_TYPE,
                target: {
                  oneThatIsCreatingARelationWithAnother,
                  targetContentType: target,
                  value: relation
                }
              });
            }
          },
          padding: 2,
          type: "button",
          children: /* @__PURE__ */ jsxRuntime.jsx(Asset, {}, relation)
        },
        relation
      );
    }) }) }) }) }),
    /* @__PURE__ */ jsxRuntime.jsxs(InfosWrapper, { justifyContent: "center", children: [
      /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Typography, { children: [
        truncate__default.default(leftDisplayedValue, { length: 24 }),
        " "
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Typography, { textColor: "primary600", children: [
        formatMessage({ id: getTrad(`relation.${relationType}`) }),
        " "
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { children: truncate__default.default(rightDisplayedValue, { length: 24 }) })
    ] })
  ] });
};
const Relation = ({
  formErrors,
  mainBoxHeader,
  modifiedData,
  naturePickerType,
  onChange
}) => {
  const relationType = index$1.getRelationType(modifiedData.relation, modifiedData.targetAttribute);
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { style: { position: "relative" }, children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      RelationFormBox,
      {
        isMain: true,
        header: mainBoxHeader,
        error: formErrors?.name || null,
        name: "name",
        onChange,
        value: modifiedData?.name || ""
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      RelationNaturePicker,
      {
        naturePickerType,
        oneThatIsCreatingARelationWithAnother: mainBoxHeader,
        relationType,
        target: modifiedData.target
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      RelationFormBox,
      {
        disabled: ["oneWay", "manyWay"].includes(relationType),
        error: formErrors?.targetAttribute || null,
        name: "targetAttribute",
        onChange,
        oneThatIsCreatingARelationWithAnother: mainBoxHeader,
        target: modifiedData.target,
        value: modifiedData?.targetAttribute || ""
      }
    )
  ] });
};
const SelectCategory = ({
  error = null,
  intlLabel,
  name,
  onChange,
  value = void 0,
  isCreating,
  dynamicZoneTarget
}) => {
  const { formatMessage } = reactIntl.useIntl();
  const { allComponentsCategories } = useDataManager();
  const [categories, setCategories] = React.useState(allComponentsCategories);
  const errorMessage = error ? formatMessage({ id: error, defaultMessage: error }) : "";
  const label = formatMessage(intlLabel);
  const handleChange = (value2) => {
    onChange({ target: { name, value: value2, type: "select-category" } });
  };
  const handleCreateOption = (value2) => {
    setCategories((prev) => [...prev, value2]);
    handleChange(value2);
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { error: errorMessage, name, children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { children: label }),
    /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.Combobox,
      {
        disabled: !isCreating && !dynamicZoneTarget,
        onChange: handleChange,
        onCreateOption: handleCreateOption,
        value,
        creatable: true,
        children: categories.map((category) => /* @__PURE__ */ jsxRuntime.jsx(designSystem.ComboboxOption, { value: category, children: category }, category))
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Error, {})
  ] });
};
const findComponent = (componentUid, components) => {
  return components.find((c) => c.component === componentUid);
};
const getChildrenMaxDepth = (componentUid, components, currentDepth = 0) => {
  const component = findComponent(componentUid, components);
  if (!component || !component.childComponents || component.childComponents.length === 0) {
    return currentDepth;
  }
  let maxDepth = currentDepth;
  component.childComponents.forEach((child) => {
    const depth = getChildrenMaxDepth(child.component, components, currentDepth + 1);
    if (depth > maxDepth) {
      maxDepth = depth;
    }
  });
  return maxDepth;
};
const getComponentDepth = (component, components) => {
  const getDepth = (currentComponent, currentLevel) => {
    const levels = [];
    levels.push(currentLevel);
    if (!currentComponent.uidsOfAllParents) {
      return levels;
    }
    for (const parentUid of currentComponent.uidsOfAllParents) {
      const parentComponent = findComponent(parentUid, components);
      if (parentComponent) {
        levels.push(...getDepth(parentComponent, currentLevel + 1));
      }
    }
    return levels;
  };
  const nestedCompo = findComponent(component, components);
  if (!nestedCompo) {
    return 0;
  }
  const compoDepth = Math.max(...getDepth(nestedCompo, 1));
  return compoDepth;
};
const SelectComponent = ({
  error = null,
  intlLabel,
  isAddingAComponentToAnotherComponent,
  isCreating,
  isCreatingComponentWhileAddingAField,
  componentToCreate,
  name,
  onChange,
  targetUid,
  forTarget,
  value
}) => {
  const { formatMessage } = reactIntl.useIntl();
  const errorMessage = error ? formatMessage({ id: error, defaultMessage: error }) : "";
  const label = formatMessage(intlLabel);
  const {
    componentsGroupedByCategory,
    componentsThatHaveOtherComponentInTheirAttributes,
    nestedComponents
  } = useDataManager();
  const isTargetAComponent = ["component", "components"].includes(forTarget);
  let options2 = Object.entries(componentsGroupedByCategory).reduce(
    (acc, current) => {
      const [categoryName, components] = current;
      const compos = components.map((component) => {
        return {
          uid: component.uid,
          label: component.schema.displayName,
          categoryName
        };
      });
      return [...acc, ...compos];
    },
    []
  );
  if (isAddingAComponentToAnotherComponent) {
    options2 = options2.filter(({ uid }) => {
      const maxDepth = getChildrenMaxDepth(uid, componentsThatHaveOtherComponentInTheirAttributes);
      const componentDepth = getComponentDepth(targetUid, nestedComponents);
      const totalDepth = maxDepth + componentDepth;
      return totalDepth <= index$1.MAX_COMPONENT_DEPTH;
    });
  }
  if (isTargetAComponent) {
    options2 = options2.filter((option) => {
      return option.uid !== targetUid;
    });
  }
  if (isCreatingComponentWhileAddingAField) {
    options2 = [
      {
        uid: value,
        label: componentToCreate?.displayName,
        categoryName: componentToCreate?.category
      }
    ];
  }
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { error: errorMessage, name, children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { children: label }),
    /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.SingleSelect,
      {
        disabled: isCreatingComponentWhileAddingAField || !isCreating,
        onChange: (value2) => {
          onChange({ target: { name, value: value2, type: "select-category" } });
        },
        value: value || "",
        children: options2.map((option) => {
          return /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelectOption, { value: option.uid, children: `${option.categoryName} - ${option.label}` }, option.uid);
        })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Error, {})
  ] });
};
const SelectComponents = ({
  dynamicZoneTarget,
  intlLabel,
  name,
  onChange,
  value
}) => {
  const { formatMessage } = reactIntl.useIntl();
  const { componentsGroupedByCategory, modifiedData } = useDataManager();
  const dzSchema = findAttribute(modifiedData.contentType.schema.attributes, dynamicZoneTarget);
  const alreadyUsedComponents = dzSchema?.components || [];
  const filteredComponentsGroupedByCategory = Object.keys(componentsGroupedByCategory).reduce(
    (acc, current) => {
      const filteredComponents = componentsGroupedByCategory[current].filter(({ uid }) => {
        return !alreadyUsedComponents.includes(uid);
      });
      if (filteredComponents.length > 0) {
        acc[current] = filteredComponents;
      }
      return acc;
    },
    {}
  );
  const options2 = Object.entries(filteredComponentsGroupedByCategory).reduce(
    (acc, current) => {
      const [categoryName, components] = current;
      const section = {
        label: categoryName,
        children: components.map(({ uid, schema: { displayName } }) => {
          return { label: displayName, value: uid };
        })
      };
      acc.push(section);
      return acc;
    },
    []
  );
  const displayedValue = formatMessage(
    {
      id: getTrad("components.SelectComponents.displayed-value"),
      defaultMessage: "{number, plural, =0 {# components} one {# component} other {# components}} selected"
    },
    { number: value?.length ?? 0 }
  );
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { name, children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { children: formatMessage(intlLabel) }),
    /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.MultiSelectNested,
      {
        id: "select1",
        customizeContent: () => displayedValue,
        onChange: (values) => {
          onChange({ target: { name, value: values, type: "select-components" } });
        },
        options: options2,
        value: value || []
      }
    )
  ] });
};
const SelectDateType = ({
  intlLabel,
  error = void 0,
  modifiedData,
  name,
  onChange,
  options: options2,
  value = ""
}) => {
  const { formatMessage } = reactIntl.useIntl();
  const label = formatMessage(intlLabel);
  const errorMessage = error ? formatMessage({ id: error, defaultMessage: error }) : "";
  const handleChange = (nextValue) => {
    onChange({ target: { name, value: nextValue, type: "select" } });
    if (!value) {
      return;
    }
    if (modifiedData.default !== void 0 && modifiedData.default !== null) {
      onChange({ target: { name: "default", value: null } });
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { error: errorMessage, name, children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { children: label }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelect, { onChange: handleChange, value: value || "", children: options2.map(({ metadatas: { intlLabel: intlLabel2, disabled, hidden }, key, value: value2 }) => {
      return /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelectOption, { value: value2, disabled, hidden, children: formatMessage(
        { id: intlLabel2.id, defaultMessage: intlLabel2.defaultMessage },
        intlLabel2.values
      ) }, key);
    }) }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Error, {})
  ] });
};
const SelectNumber = ({
  intlLabel,
  error = void 0,
  modifiedData,
  name,
  onChange,
  options: options2,
  value = ""
}) => {
  const { formatMessage } = reactIntl.useIntl();
  const label = formatMessage(intlLabel);
  const errorMessage = error ? formatMessage({ id: error, defaultMessage: error }) : "";
  const handleChange = (nextValue) => {
    onChange({ target: { name, value: nextValue, type: "select" } });
    if (!value) {
      return;
    }
    if (nextValue === "biginteger" && value !== "biginteger") {
      if (modifiedData.default !== void 0 && modifiedData.default !== null) {
        onChange({ target: { name: "default", value: null } });
      }
      if (modifiedData.max !== void 0 && modifiedData.max !== null) {
        onChange({ target: { name: "max", value: null } });
      }
      if (modifiedData.min !== void 0 && modifiedData.min !== null) {
        onChange({ target: { name: "min", value: null } });
      }
    }
    if (typeof nextValue === "string" && ["decimal", "float", "integer"].includes(nextValue) && value === "biginteger") {
      if (modifiedData.default !== void 0 && modifiedData.default !== null) {
        onChange({ target: { name: "default", value: null } });
      }
      if (modifiedData.max !== void 0 && modifiedData.max !== null) {
        onChange({ target: { name: "max", value: null } });
      }
      if (modifiedData.min !== void 0 && modifiedData.min !== null) {
        onChange({ target: { name: "min", value: null } });
      }
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { error: errorMessage, name, children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { children: label }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelect, { onChange: handleChange, value: value || "", children: options2.map(({ metadatas: { intlLabel: intlLabel2, disabled, hidden }, key, value: value2 }) => {
      return /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelectOption, { value: value2, disabled, hidden, children: formatMessage(intlLabel2) }, key);
    }) }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Error, {})
  ] });
};
SelectNumber.defaultProps = {
  error: void 0,
  value: ""
};
const SingularName = ({
  description = null,
  error = null,
  intlLabel,
  modifiedData,
  name,
  onChange,
  value = null
}) => {
  const { formatMessage } = reactIntl.useIntl();
  const onChangeRef = React.useRef(onChange);
  const displayName = modifiedData?.displayName || "";
  React.useEffect(() => {
    if (displayName) {
      onChangeRef.current({ target: { name, value: index$1.nameToSlug(displayName) } });
    } else {
      onChangeRef.current({ target: { name, value: "" } });
    }
  }, [displayName, name]);
  const errorMessage = error ? formatMessage({ id: error, defaultMessage: error }) : "";
  const hint = description ? formatMessage(
    { id: description.id, defaultMessage: description.defaultMessage },
    { ...description.values }
  ) : "";
  const label = formatMessage(intlLabel);
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { error: errorMessage, hint, name, children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { children: label }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.TextInput, { onChange, value: value || "" }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Error, {}),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Hint, {})
  ] });
};
const TabForm = ({
  form,
  formErrors,
  genericInputProps,
  modifiedData,
  onChange
}) => {
  const { formatMessage } = reactIntl.useIntl();
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: form.map((section, sectionIndex) => {
    if (section.items.length === 0) {
      return null;
    }
    return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { children: [
      section.sectionTitle && /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingBottom: 4, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "delta", tag: "h3", children: formatMessage(section.sectionTitle) }) }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Root, { gap: 4, children: section.items.map((input, i) => {
        const key = `${sectionIndex}.${i}`;
        const value = get__default.default(modifiedData, input.name, void 0);
        const pluginOptionError = Object.keys(formErrors).find((key2) => key2 === input.name);
        const errorId = pluginOptionError ? formErrors[pluginOptionError].id : get__default.default(
          formErrors,
          [
            ...input.name.split(".").filter((key2) => key2 !== "componentToCreate"),
            "id"
          ],
          null
        );
        if (input.type === "pushRight") {
          return /* @__PURE__ */ jsxRuntime.jsx(
            designSystem.Grid.Item,
            {
              col: input.size || 6,
              direction: "column",
              alignItems: "stretch",
              children: /* @__PURE__ */ jsxRuntime.jsx("div", {})
            },
            input.name || key
          );
        }
        return /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.Grid.Item,
          {
            col: input.size || 6,
            direction: "column",
            alignItems: "stretch",
            children: /* @__PURE__ */ jsxRuntime.jsx(
              MemoizedGenericInput,
              {
                ...input,
                ...genericInputProps,
                error: errorId,
                onChange,
                value
              }
            )
          },
          input.name || key
        );
      }) })
    ] }, sectionIndex);
  }) });
};
const TextareaEnum = ({
  description = null,
  disabled = false,
  error = "",
  intlLabel,
  labelAction,
  name,
  onChange,
  placeholder = null,
  value = ""
}) => {
  const { formatMessage } = reactIntl.useIntl();
  const errorMessage = error ? formatMessage({ id: error, defaultMessage: error }) : "";
  const hint = description ? formatMessage(
    { id: description.id, defaultMessage: description.defaultMessage },
    { ...description.values }
  ) : "";
  const label = formatMessage(intlLabel);
  const formattedPlaceholder = placeholder ? formatMessage(
    { id: placeholder.id, defaultMessage: placeholder.defaultMessage },
    { ...placeholder.values }
  ) : "";
  const inputValue = Array.isArray(value) ? value.join("\n") : "";
  const handleChange = (e) => {
    const arrayValue = e.target.value.split("\n");
    onChange({ target: { name, value: arrayValue } });
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { error: errorMessage, hint, name, children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { action: labelAction, children: label }),
    /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.Textarea,
      {
        disabled,
        onChange: handleChange,
        placeholder: formattedPlaceholder,
        value: inputValue
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Error, {}),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Hint, {})
  ] });
};
const nameField$1 = {
  name: "name",
  type: "text",
  intlLabel: {
    id: "global.name",
    defaultMessage: "Name"
  },
  description: {
    id: getTrad("modalForm.attribute.form.base.name.description"),
    defaultMessage: "No space is allowed for the name of the attribute"
  }
  // validations: {
  //   required: true,
  // },
};
const commonBaseForm = {
  sections: [{ sectionTitle: null, items: [nameField$1] }]
};
const componentForm = {
  base(prefix = "") {
    const sections = [
      {
        sectionTitle: null,
        items: [
          {
            name: `${prefix}displayName`,
            type: "text",
            intlLabel: {
              id: getTrad("contentType.displayName.label"),
              defaultMessage: "Display Name"
            }
          },
          {
            name: `${prefix}category`,
            type: "select-category",
            intlLabel: {
              id: getTrad("modalForm.components.create-component.category.label"),
              defaultMessage: "Select a category or enter a name to create a new one"
            }
          }
        ]
      },
      {
        sectionTitle: null,
        items: [
          {
            name: `${prefix}icon`,
            type: "icon-picker",
            size: 12,
            intlLabel: {
              id: getTrad("modalForm.components.icon.label"),
              defaultMessage: "Icon"
            }
          }
        ]
      }
    ];
    return sections;
  },
  advanced() {
    const sections = [];
    return sections;
  }
};
const attributeOptions = {
  default: {
    name: "default",
    type: "text",
    intlLabel: {
      id: getTrad("form.attribute.settings.default"),
      defaultMessage: "Default value"
    }
  },
  max: {
    name: "max",
    type: "checkbox-with-number-field",
    intlLabel: {
      id: getTrad("form.attribute.item.maximum"),
      defaultMessage: "Maximum value"
    }
  },
  maxLength: {
    name: "maxLength",
    type: "checkbox-with-number-field",
    intlLabel: {
      id: getTrad("form.attribute.item.maximumLength"),
      defaultMessage: "Maximum length"
    }
  },
  min: {
    name: "min",
    type: "checkbox-with-number-field",
    intlLabel: {
      id: getTrad("form.attribute.item.minimum"),
      defaultMessage: "Minimum value"
    }
  },
  minLength: {
    name: "minLength",
    type: "checkbox-with-number-field",
    intlLabel: {
      id: getTrad("form.attribute.item.minimumLength"),
      defaultMessage: "Minimum length"
    }
  },
  private: {
    name: "private",
    type: "checkbox",
    intlLabel: {
      id: getTrad("form.attribute.item.privateField"),
      defaultMessage: "Private field"
    },
    description: {
      id: getTrad("form.attribute.item.privateField.description"),
      defaultMessage: "This field will not show up in the API response"
    }
  },
  regex: {
    intlLabel: {
      id: getTrad("form.attribute.item.text.regex"),
      defaultMessage: "RegExp pattern"
    },
    name: "regex",
    type: "text",
    description: {
      id: getTrad("form.attribute.item.text.regex.description"),
      defaultMessage: "The text of the regular expression"
    }
  },
  required: {
    name: "required",
    type: "checkbox",
    intlLabel: {
      id: getTrad("form.attribute.item.requiredField"),
      defaultMessage: "Required field"
    },
    description: {
      id: getTrad("form.attribute.item.requiredField.description"),
      defaultMessage: "You won't be able to create an entry if this field is empty"
    }
  },
  unique: {
    name: "unique",
    type: "checkbox",
    intlLabel: {
      id: getTrad("form.attribute.item.uniqueField"),
      defaultMessage: "Unique field"
    },
    description: {
      id: getTrad("form.attribute.item.uniqueField.description"),
      defaultMessage: "You won't be able to create an entry if there is an existing entry with identical content"
    }
  }
};
const advancedForm = {
  blocks() {
    return {
      sections: [
        {
          sectionTitle: {
            id: "global.settings",
            defaultMessage: "Settings"
          },
          items: [attributeOptions.required, attributeOptions.private]
        }
      ]
    };
  },
  boolean() {
    return {
      sections: [
        {
          sectionTitle: null,
          items: [
            {
              autoFocus: true,
              type: "select-default-boolean",
              intlLabel: {
                id: getTrad("form.attribute.settings.default"),
                defaultMessage: "Default value"
              },
              name: "default",
              options: [
                {
                  value: "true",
                  key: "true",
                  metadatas: { intlLabel: { id: "true", defaultMessage: "true" } }
                },
                {
                  value: "",
                  key: "null",
                  metadatas: { intlLabel: { id: "null", defaultMessage: "null" } }
                },
                {
                  value: "false",
                  key: "false",
                  metadatas: { intlLabel: { id: "false", defaultMessage: "false" } }
                }
              ]
            }
          ]
        },
        {
          sectionTitle: {
            id: "global.settings",
            defaultMessage: "Settings"
          },
          items: [attributeOptions.required, attributeOptions.private]
        }
      ]
    };
  },
  component({ repeatable }, step) {
    if (step === "1") {
      return { sections: componentForm.advanced() };
    }
    if (repeatable) {
      return {
        sections: [
          {
            sectionTitle: {
              id: "global.settings",
              defaultMessage: "Settings"
            },
            items: [
              attributeOptions.required,
              attributeOptions.private,
              attributeOptions.max,
              attributeOptions.min
            ]
          }
        ]
      };
    }
    return {
      sections: [
        {
          sectionTitle: {
            id: "global.settings",
            defaultMessage: "Settings"
          },
          items: [attributeOptions.required, attributeOptions.private]
        }
      ]
    };
  },
  date({ type }) {
    return {
      sections: [
        {
          sectionTitle: null,
          items: [
            {
              ...attributeOptions.default,
              type: type || "date",
              value: null,
              withDefaultValue: false,
              disabled: !type,
              autoFocus: false
            }
          ]
        },
        {
          sectionTitle: {
            id: "global.settings",
            defaultMessage: "Settings"
          },
          items: [attributeOptions.required, attributeOptions.unique, attributeOptions.private]
        }
      ]
    };
  },
  dynamiczone() {
    return {
      sections: [
        {
          sectionTitle: {
            id: "global.settings",
            defaultMessage: "Settings"
          },
          items: [attributeOptions.required, attributeOptions.max, attributeOptions.min]
        }
      ]
    };
  },
  email() {
    return {
      sections: [
        {
          sectionTitle: null,
          items: [
            {
              ...attributeOptions.default,
              type: "email"
            }
          ]
        },
        {
          sectionTitle: {
            id: "global.settings",
            defaultMessage: "Settings"
          },
          items: [
            attributeOptions.required,
            attributeOptions.unique,
            attributeOptions.maxLength,
            attributeOptions.minLength,
            attributeOptions.private
          ]
        }
      ]
    };
  },
  enumeration(data) {
    return {
      sections: [
        {
          sectionTitle: null,
          items: [
            {
              name: "default",
              type: "select",
              intlLabel: {
                id: getTrad("form.attribute.settings.default"),
                defaultMessage: "Default value"
              },
              validations: {},
              options: [
                {
                  key: "__null_reset_value__",
                  value: "",
                  metadatas: {
                    intlLabel: {
                      id: "components.InputSelect.option.placeholder",
                      defaultMessage: "Choose here"
                    }
                  }
                },
                ...(data.enum || []).filter((value, index2) => data.enum.indexOf(value) === index2 && value).map((value) => {
                  return {
                    key: value,
                    value,
                    metadatas: {
                      intlLabel: { id: `${value}.no-override`, defaultMessage: value }
                    }
                  };
                })
              ]
            },
            {
              intlLabel: {
                id: getTrad("form.attribute.item.enumeration.graphql"),
                defaultMessage: "Name override for GraphQL"
              },
              name: "enumName",
              type: "text",
              validations: {},
              description: {
                id: getTrad("form.attribute.item.enumeration.graphql.description"),
                defaultMessage: "Allows you to override the default generated name for GraphQL"
              }
            }
          ]
        },
        {
          sectionTitle: {
            id: "global.settings",
            defaultMessage: "Settings"
          },
          items: [attributeOptions.required, attributeOptions.private]
        }
      ]
    };
  },
  json() {
    return {
      sections: [
        {
          sectionTitle: {
            id: "global.settings",
            defaultMessage: "Settings"
          },
          items: [attributeOptions.required, attributeOptions.private]
        }
      ]
    };
  },
  media() {
    return {
      sections: [
        {
          sectionTitle: null,
          items: [
            {
              intlLabel: {
                id: getTrad("form.attribute.media.allowed-types"),
                defaultMessage: "Select allowed types of media"
              },
              name: "allowedTypes",
              type: "allowed-types-select",
              size: 7,
              value: "",
              validations: {}
            }
          ]
        },
        {
          sectionTitle: {
            id: "global.settings",
            defaultMessage: "Settings"
          },
          items: [attributeOptions.required, attributeOptions.private]
        }
      ]
    };
  },
  number(data) {
    const inputStep = data.type === "decimal" || data.type === "float" ? "any" : 1;
    return {
      sections: [
        {
          sectionTitle: null,
          items: [
            {
              autoFocus: true,
              name: "default",
              type: data.type === "biginteger" ? "text" : "number",
              step: inputStep,
              intlLabel: {
                id: getTrad("form.attribute.settings.default"),
                defaultMessage: "Default value"
              },
              validations: {}
            }
          ]
        },
        {
          sectionTitle: {
            id: "global.settings",
            defaultMessage: "Settings"
          },
          items: [
            attributeOptions.required,
            attributeOptions.unique,
            attributeOptions.max,
            attributeOptions.min,
            attributeOptions.private
          ]
        }
      ]
    };
  },
  password() {
    return {
      sections: [
        { sectionTitle: null, items: [attributeOptions.default] },
        {
          sectionTitle: {
            id: "global.settings",
            defaultMessage: "Settings"
          },
          items: [
            attributeOptions.required,
            attributeOptions.maxLength,
            attributeOptions.minLength,
            attributeOptions.private
          ]
        }
      ]
    };
  },
  relation() {
    return {
      sections: [
        {
          sectionTitle: {
            id: "global.settings",
            defaultMessage: "Settings"
          },
          items: [attributeOptions.private]
        }
      ]
    };
  },
  richtext() {
    return {
      sections: [
        { sectionTitle: null, items: [attributeOptions.default] },
        {
          sectionTitle: {
            id: "global.settings",
            defaultMessage: "Settings"
          },
          items: [
            attributeOptions.required,
            attributeOptions.maxLength,
            attributeOptions.minLength,
            attributeOptions.private
          ]
        }
      ]
    };
  },
  text() {
    return {
      sections: [
        { sectionTitle: null, items: [attributeOptions.default, attributeOptions.regex] },
        {
          sectionTitle: {
            id: "global.settings",
            defaultMessage: "Settings"
          },
          items: [
            attributeOptions.required,
            attributeOptions.unique,
            attributeOptions.maxLength,
            attributeOptions.minLength,
            attributeOptions.private
          ]
        }
      ]
    };
  },
  uid(data) {
    return {
      sections: [
        {
          sectionTitle: null,
          items: [
            { ...attributeOptions.default, disabled: Boolean(data.targetField), type: "text" }
          ]
        },
        {
          sectionTitle: {
            id: "global.settings",
            defaultMessage: "Settings"
          },
          items: [
            attributeOptions.required,
            attributeOptions.maxLength,
            attributeOptions.minLength,
            attributeOptions.private
          ]
        }
      ]
    };
  }
};
const componentField = {
  intlLabel: {
    id: "global.type",
    defaultMessage: "Type"
  },
  name: "createComponent",
  type: "boolean-radio-group",
  size: 12,
  radios: [
    {
      title: {
        id: getTrad("form.attribute.component.option.create"),
        defaultMessage: "Create a new component"
      },
      description: {
        id: getTrad("form.attribute.component.option.create.description"),
        defaultMessage: "A component is shared across types and components, it will be available and accessible everywhere."
      },
      value: true
    },
    {
      title: {
        id: getTrad("form.attribute.component.option.reuse-existing"),
        defaultMessage: "Use an existing component"
      },
      description: {
        id: getTrad("form.attribute.component.option.reuse-existing.description"),
        defaultMessage: "Reuse a component already created to keep your data consistent across content-types."
      },
      value: false
    }
  ]
};
const baseForm = {
  component(data, step) {
    if (step === "1") {
      const itemsToConcat = data.createComponent === true ? componentForm.base("componentToCreate.") : [];
      return {
        sections: [{ sectionTitle: null, items: [componentField] }, ...itemsToConcat]
      };
    }
    return {
      sections: [
        {
          sectionTitle: null,
          items: [
            nameField$1,
            {
              name: "component",
              type: "select-component",
              intlLabel: {
                id: getTrad("modalForm.attributes.select-component"),
                defaultMessage: "Select a component"
              },
              isMultiple: false
            }
          ]
        },
        {
          sectionTitle: null,
          items: [
            {
              intlLabel: {
                id: "global.type",
                defaultMessage: "Type"
              },
              name: "repeatable",
              type: "boolean-radio-group",
              size: 12,
              radios: [
                {
                  title: {
                    id: getTrad("form.attribute.component.option.repeatable"),
                    defaultMessage: "Repeatable component"
                  },
                  description: {
                    id: getTrad("form.attribute.component.option.repeatable.description"),
                    defaultMessage: "Best for multiple instances (array) of ingredients, meta tags, etc.."
                  },
                  value: true
                },
                {
                  title: {
                    id: getTrad("form.attribute.component.option.single"),
                    defaultMessage: "Single component"
                  },
                  description: {
                    id: getTrad("form.attribute.component.option.single.description"),
                    defaultMessage: "Best for grouping fields like full address, main information, etc..."
                  },
                  value: false
                }
              ]
            }
          ]
        }
      ]
    };
  },
  date() {
    return {
      sections: [
        {
          sectionTitle: null,
          items: [
            nameField$1,
            {
              intlLabel: {
                id: "global.type",
                defaultMessage: "Type"
              },
              name: "type",
              type: "select-date",
              options: [
                {
                  key: "__null_reset_value__",
                  value: "",
                  metadatas: {
                    intlLabel: {
                      id: "components.InputSelect.option.placeholder",
                      defaultMessage: "Choose here"
                    },
                    hidden: true
                  }
                },
                {
                  key: "date",
                  value: "date",
                  metadatas: {
                    intlLabel: {
                      id: getTrad("form.attribute.item.date.type.date"),
                      defaultMessage: "date (ex: 01/01/{currentYear})",
                      values: { currentYear: (/* @__PURE__ */ new Date()).getFullYear() }
                    }
                  }
                },
                {
                  key: "datetime",
                  value: "datetime",
                  metadatas: {
                    intlLabel: {
                      id: getTrad("form.attribute.item.date.type.datetime"),
                      defaultMessage: "datetime (ex: 01/01/{currentYear} 00:00 AM)",
                      values: { currentYear: (/* @__PURE__ */ new Date()).getFullYear() }
                    }
                  }
                },
                {
                  key: "time",
                  value: "time",
                  metadatas: {
                    intlLabel: {
                      id: getTrad("form.attribute.item.date.type.time"),
                      defaultMessage: "time (ex: 00:00 AM)"
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    };
  },
  enumeration() {
    return {
      sections: [
        { sectionTitle: null, items: [nameField$1] },
        {
          sectionTitle: null,
          items: [
            {
              name: "enum",
              type: "textarea-enum",
              size: 6,
              intlLabel: {
                id: getTrad("form.attribute.item.enumeration.rules"),
                defaultMessage: "Values (one line per value)"
              },
              placeholder: {
                id: getTrad("form.attribute.item.enumeration.placeholder"),
                defaultMessage: "Ex:\nmorning\nnoon\nevening"
              },
              validations: {
                required: true
              }
            }
          ]
        }
      ]
    };
  },
  media() {
    return {
      sections: [
        { sectionTitle: null, items: [nameField$1] },
        {
          sectionTitle: null,
          items: [
            {
              intlLabel: {
                id: "global.type",
                defaultMessage: "Type"
              },
              name: "multiple",
              size: 12,
              type: "boolean-radio-group",
              radios: [
                {
                  title: {
                    id: getTrad("form.attribute.media.option.multiple"),
                    defaultMessage: "Multiple media"
                  },
                  description: {
                    id: getTrad("form.attribute.media.option.multiple.description"),
                    defaultMessage: "Best for sliders, carousels or multiple files download"
                  },
                  value: true
                },
                {
                  title: {
                    id: getTrad("form.attribute.media.option.single"),
                    defaultMessage: "Single media"
                  },
                  description: {
                    id: getTrad("form.attribute.media.option.single.description"),
                    defaultMessage: "Best for avatar, profile picture or cover"
                  },
                  value: false
                }
              ]
            }
          ]
        }
      ]
    };
  },
  number() {
    return {
      sections: [
        {
          sectionTitle: null,
          items: [
            nameField$1,
            {
              intlLabel: {
                id: getTrad("form.attribute.item.number.type"),
                defaultMessage: "Number format"
              },
              name: "type",
              type: "select-number",
              options: [
                {
                  key: "__null_reset_value__",
                  value: "",
                  metadatas: {
                    intlLabel: {
                      id: "components.InputSelect.option.placeholder",
                      defaultMessage: "Choose here"
                    },
                    hidden: true
                  }
                },
                {
                  key: "integer",
                  value: "integer",
                  metadatas: {
                    intlLabel: {
                      id: getTrad("form.attribute.item.number.type.integer"),
                      defaultMessage: "integer (ex: 10)"
                    }
                  }
                },
                {
                  key: "biginteger",
                  value: "biginteger",
                  metadatas: {
                    intlLabel: {
                      id: getTrad("form.attribute.item.number.type.biginteger"),
                      defaultMessage: "biginteger (ex: 123456789)"
                    }
                  }
                },
                {
                  key: "decimal",
                  value: "decimal",
                  metadatas: {
                    intlLabel: {
                      id: getTrad("form.attribute.item.number.type.decimal"),
                      defaultMessage: "decimal (ex: 2.22)"
                    }
                  }
                },
                {
                  key: "float",
                  value: "float",
                  metadatas: {
                    intlLabel: {
                      id: getTrad("form.attribute.item.number.type.float"),
                      defaultMessage: "decimal (ex: 3.3333333)"
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    };
  },
  relation() {
    return {
      sections: [
        {
          sectionTitle: null,
          items: [
            {
              intlLabel: { id: "FIXME", defaultMessage: "FIXME" },
              name: "relation",
              size: 12,
              type: "relation"
            }
          ]
        }
      ]
    };
  },
  string() {
    return {
      sections: [
        { sectionTitle: null, items: [nameField$1] },
        {
          sectionTitle: null,
          items: [
            {
              intlLabel: {
                id: "global.type",
                defaultMessage: "Type"
              },
              name: "type",
              size: 12,
              type: "radio-group",
              radios: [
                {
                  title: {
                    id: getTrad("form.attribute.text.option.short-text"),
                    defaultMessage: "Sort text"
                  },
                  description: {
                    id: getTrad("form.attribute.text.option.short-text.description"),
                    defaultMessage: "Best for titles, names, links (URL). It also enables exact search on the field."
                  },
                  value: "string"
                },
                {
                  title: {
                    id: getTrad("form.attribute.text.option.long-text"),
                    defaultMessage: "Long text"
                  },
                  description: {
                    id: getTrad("form.attribute.text.option.long-text.description"),
                    defaultMessage: "Best for descriptions, biography. Exact search is disabled."
                  },
                  value: "text"
                }
              ]
            }
          ]
        }
      ]
    };
  },
  text() {
    return {
      sections: [
        { sectionTitle: null, items: [nameField$1] },
        {
          sectionTitle: null,
          items: [
            {
              intlLabel: {
                id: "global.type",
                defaultMessage: "Type"
              },
              name: "type",
              size: 12,
              type: "radio-group",
              radios: [
                {
                  title: {
                    id: getTrad("form.attribute.text.option.short-text"),
                    defaultMessage: "Sort text"
                  },
                  description: {
                    id: getTrad("form.attribute.text.option.short-text.description"),
                    defaultMessage: "Best for titles, names, links (URL). It also enables exact search on the field."
                  },
                  value: "string"
                },
                {
                  title: {
                    id: getTrad("form.attribute.text.option.long-text"),
                    defaultMessage: "Long text"
                  },
                  description: {
                    id: getTrad("form.attribute.text.option.long-text.description"),
                    defaultMessage: "Best for descriptions, biography. Exact search is disabled."
                  },
                  value: "text"
                }
              ]
            }
          ]
        }
      ]
    };
  },
  uid(_data, step, attributes) {
    const options2 = attributes.filter(({ type }) => ["string", "text"].includes(type)).map(({ name }) => ({
      key: name,
      value: name,
      metadatas: {
        intlLabel: { id: `${name}.no-override`, defaultMessage: name }
      }
    }));
    return {
      sections: [
        {
          sectionTitle: null,
          items: [
            {
              ...nameField$1,
              placeholder: {
                id: getTrad("modalForm.attribute.form.base.name.placeholder"),
                defaultMessage: "e.g. slug, seoUrl, canonicalUrl"
              }
            },
            {
              intlLabel: {
                id: getTrad("modalForm.attribute.target-field"),
                defaultMessage: "Attached field"
              },
              name: "targetField",
              type: "select",
              options: [
                {
                  key: "__null_reset_value__",
                  value: "",
                  metadatas: { intlLabel: { id: "global.none", defaultMessage: "None" } }
                },
                ...options2
              ]
            }
          ]
        }
      ]
    };
  }
};
const attributesForm = {
  advanced: advancedForm,
  base: baseForm
};
const toRegressedEnumValue = (value) => {
  if (!value) {
    return "";
  }
  return slugify__default.default(value, {
    decamelize: false,
    lowercase: false,
    separator: "_"
  });
};
const NAME_REGEX = /^[A-Za-z][_0-9A-Za-z]*$/;
const alreadyUsedAttributeNames = (usedNames) => {
  return {
    name: "attributeNameAlreadyUsed",
    message: strapiAdmin.translatedErrors.unique.id,
    test(value) {
      if (!value) {
        return false;
      }
      const snakeCaseKey = fp.snakeCase(value);
      return !usedNames.some((existingKey) => {
        return fp.snakeCase(existingKey) === snakeCaseKey;
      });
    }
  };
};
const isNameAllowed = (reservedNames) => {
  return {
    name: "forbiddenAttributeName",
    message: getTrad("error.attributeName.reserved-name"),
    test(value) {
      if (!value) {
        return false;
      }
      const snakeCaseKey = fp.snakeCase(value);
      return !reservedNames.some((existingKey) => {
        return fp.snakeCase(existingKey) === snakeCaseKey;
      });
    }
  };
};
const validators = {
  default: () => yup__namespace.string().nullable(),
  max: () => yup__namespace.number().integer().nullable(),
  min: () => yup__namespace.number().integer().when("max", (max, schema) => {
    if (max) {
      return schema.max(max, getTrad("error.validation.minSupMax"));
    }
    return schema;
  }).nullable(),
  maxLength: () => yup__namespace.number().integer().positive(getTrad("error.validation.positive")).nullable(),
  minLength: () => yup__namespace.number().integer().min(1).when("maxLength", (maxLength, schema) => {
    if (maxLength) {
      return schema.max(maxLength, getTrad("error.validation.minSupMax"));
    }
    return schema;
  }).nullable(),
  name(usedNames, reservedNames) {
    return yup__namespace.string().test(alreadyUsedAttributeNames(usedNames)).test(isNameAllowed(reservedNames)).matches(NAME_REGEX, strapiAdmin.translatedErrors.regex.id).required(strapiAdmin.translatedErrors.required.id);
  },
  required: () => yup__namespace.boolean(),
  type: () => yup__namespace.string().required(strapiAdmin.translatedErrors.required.id),
  unique: () => yup__namespace.boolean().nullable()
};
const createTextShape = (usedAttributeNames, reservedNames) => {
  const shape = {
    name: validators.name(usedAttributeNames, reservedNames),
    type: validators.type(),
    default: validators.default(),
    unique: validators.unique(),
    required: validators.required(),
    maxLength: validators.maxLength(),
    minLength: validators.minLength(),
    regex: yup__namespace.string().test({
      name: "isValidRegExpPattern",
      message: getTrad("error.validation.regex"),
      test(value) {
        try {
          return new RegExp(value || "") !== null;
        } catch (e) {
          return false;
        }
      }
    }).nullable()
  };
  return shape;
};
const isMinSuperiorThanMax = () => ({
  name: "isMinSuperiorThanMax",
  message: getTrad("error.validation.minSupMax"),
  test(min) {
    if (!min) {
      return true;
    }
    const { max } = this.parent;
    if (!max) {
      return true;
    }
    if (Number.isNaN(toNumber__default.default(min))) {
      return true;
    }
    return toNumber__default.default(max) >= toNumber__default.default(min);
  }
});
const attributeTypes = {
  date(usedAttributeNames, reservedNames) {
    const shape = {
      name: validators.name(usedAttributeNames, reservedNames),
      type: validators.type()
    };
    return yup__namespace.object(shape);
  },
  datetime(usedAttributeNames, reservedNames) {
    const shape = {
      name: validators.name(usedAttributeNames, reservedNames),
      type: validators.type()
    };
    return yup__namespace.object(shape);
  },
  time(usedAttributeNames, reservedNames) {
    const shape = {
      name: validators.name(usedAttributeNames, reservedNames),
      type: validators.type()
    };
    return yup__namespace.object(shape);
  },
  default(usedAttributeNames, reservedNames) {
    const shape = {
      name: validators.name(usedAttributeNames, reservedNames),
      type: validators.type()
    };
    return yup__namespace.object(shape);
  },
  biginteger(usedAttributeNames, reservedNames) {
    const shape = {
      name: validators.name(usedAttributeNames, reservedNames),
      type: validators.type(),
      default: yup__namespace.string().nullable().matches(/^-?\d*$/),
      unique: validators.unique(),
      required: validators.required(),
      max: yup__namespace.string().nullable().matches(/^-?\d*$/, strapiAdmin.translatedErrors.regex.id),
      min: yup__namespace.string().nullable().test(isMinSuperiorThanMax()).matches(/^-?\d*$/, strapiAdmin.translatedErrors.regex.id)
    };
    return yup__namespace.object(shape);
  },
  boolean(usedAttributeNames, reservedNames) {
    const shape = {
      name: validators.name(usedAttributeNames, reservedNames),
      default: yup__namespace.boolean().nullable(),
      required: validators.required(),
      unique: validators.unique()
    };
    return yup__namespace.object(shape);
  },
  component(usedAttributeNames, reservedNames) {
    const shape = {
      name: validators.name(usedAttributeNames, reservedNames),
      type: validators.type(),
      required: validators.required(),
      max: validators.max(),
      min: validators.min(),
      component: yup__namespace.string().required(strapiAdmin.translatedErrors.required.id)
    };
    return yup__namespace.object(shape);
  },
  decimal(usedAttributeNames, reservedNames) {
    const shape = {
      name: validators.name(usedAttributeNames, reservedNames),
      type: validators.type(),
      default: yup__namespace.number(),
      required: validators.required(),
      max: yup__namespace.number(),
      min: yup__namespace.number().test(isMinSuperiorThanMax())
    };
    return yup__namespace.object(shape);
  },
  dynamiczone(usedAttributeNames, reservedNames) {
    const shape = {
      name: validators.name(usedAttributeNames, reservedNames),
      type: validators.type(),
      required: validators.required(),
      max: validators.max(),
      min: validators.min()
    };
    return yup__namespace.object(shape);
  },
  email(usedAttributeNames, reservedNames) {
    const shape = {
      name: validators.name(usedAttributeNames, reservedNames),
      type: validators.type(),
      default: yup__namespace.string().email().nullable(),
      unique: validators.unique(),
      required: validators.required(),
      maxLength: validators.maxLength(),
      minLength: validators.minLength()
    };
    return yup__namespace.object(shape);
  },
  enumeration(usedAttributeNames, reservedNames) {
    const GRAPHQL_ENUM_REGEX = /^[_A-Za-z][_0-9A-Za-z]*$/;
    const shape = {
      name: yup__namespace.string().test(alreadyUsedAttributeNames(usedAttributeNames)).test(isNameAllowed(reservedNames)).matches(GRAPHQL_ENUM_REGEX, strapiAdmin.translatedErrors.regex.id).required(strapiAdmin.translatedErrors.required.id),
      type: validators.type(),
      default: validators.default(),
      unique: validators.unique(),
      required: validators.required(),
      enum: yup__namespace.array().of(yup__namespace.string()).min(1, strapiAdmin.translatedErrors.min.id).test({
        name: "areEnumValuesUnique",
        message: getTrad("error.validation.enum-duplicate"),
        test(values) {
          if (!values) {
            return false;
          }
          const duplicates = uniq__default.default(
            values.map(toRegressedEnumValue).filter((value, index2, values2) => values2.indexOf(value) !== index2)
          );
          return !duplicates.length;
        }
      }).test({
        name: "doesNotHaveEmptyValues",
        message: getTrad("error.validation.enum-empty-string"),
        test: (values) => {
          if (!values) {
            return false;
          }
          return !values.map(toRegressedEnumValue).some((val) => val === "");
        }
      }).test({
        name: "doesMatchRegex",
        message: getTrad("error.validation.enum-regex"),
        test: (values) => {
          if (!values) {
            return false;
          }
          return values.map(toRegressedEnumValue).every((value) => GRAPHQL_ENUM_REGEX.test(value));
        }
      }),
      enumName: yup__namespace.string().nullable()
    };
    return yup__namespace.object(shape);
  },
  float(usedAttributeNames, reservedNames) {
    const shape = {
      name: validators.name(usedAttributeNames, reservedNames),
      type: validators.type(),
      required: validators.required(),
      default: yup__namespace.number(),
      max: yup__namespace.number(),
      min: yup__namespace.number().test(isMinSuperiorThanMax())
    };
    return yup__namespace.object(shape);
  },
  integer(usedAttributeNames, reservedNames) {
    const shape = {
      name: validators.name(usedAttributeNames, reservedNames),
      type: validators.type(),
      default: yup__namespace.number().integer(),
      unique: validators.unique(),
      required: validators.required(),
      max: validators.max(),
      min: validators.min()
    };
    return yup__namespace.object(shape);
  },
  json(usedAttributeNames, reservedNames) {
    const shape = {
      name: validators.name(usedAttributeNames, reservedNames),
      type: validators.type(),
      required: validators.required(),
      unique: validators.unique()
    };
    return yup__namespace.object(shape);
  },
  media(usedAttributeNames, reservedNames) {
    const shape = {
      name: validators.name(usedAttributeNames, reservedNames),
      type: validators.type(),
      multiple: yup__namespace.boolean(),
      required: validators.required(),
      allowedTypes: yup__namespace.array().of(yup__namespace.string().oneOf(["images", "videos", "files", "audios"])).min(1).nullable()
    };
    return yup__namespace.object(shape);
  },
  password(usedAttributeNames, reservedNames) {
    const shape = {
      name: validators.name(usedAttributeNames, reservedNames),
      type: validators.type(),
      default: validators.default(),
      unique: validators.unique(),
      required: validators.required(),
      maxLength: validators.maxLength(),
      minLength: validators.minLength()
    };
    return yup__namespace.object(shape);
  },
  relation(usedAttributeNames, reservedNames, alreadyTakenTargetAttributes, {
    initialData,
    modifiedData
  }) {
    const shape = {
      name: validators.name(usedAttributeNames, reservedNames),
      target: yup__namespace.string().required(strapiAdmin.translatedErrors.required.id),
      relation: yup__namespace.string().required(),
      type: yup__namespace.string().required(),
      targetAttribute: yup__namespace.lazy(() => {
        const relationType = index$1.getRelationType(modifiedData.relation, modifiedData.targetAttribute);
        if (relationType === "oneWay" || relationType === "manyWay") {
          return yup__namespace.string().nullable();
        }
        const schema = yup__namespace.string().test(isNameAllowed(reservedNames));
        const initialForbiddenName = [
          ...alreadyTakenTargetAttributes.map(({ name }) => name),
          modifiedData.name
        ];
        const forbiddenTargetAttributeName = initialForbiddenName.filter(
          (val) => val !== initialData.targetAttribute
        );
        return schema.matches(NAME_REGEX, strapiAdmin.translatedErrors.regex.id).test({
          name: "forbiddenTargetAttributeName",
          message: getTrad("error.validation.relation.targetAttribute-taken"),
          test(value) {
            if (!value) {
              return false;
            }
            return !forbiddenTargetAttributeName.includes(value);
          }
        }).required(strapiAdmin.translatedErrors.required.id);
      })
    };
    return yup__namespace.object(shape);
  },
  richtext(usedAttributeNames, reservedNames) {
    const shape = {
      name: validators.name(usedAttributeNames, reservedNames),
      type: validators.type(),
      default: validators.default(),
      unique: validators.unique(),
      required: validators.required(),
      maxLength: validators.maxLength(),
      minLength: validators.minLength()
    };
    return yup__namespace.object(shape);
  },
  blocks(usedAttributeNames, reservedNames) {
    const shape = {
      name: validators.name(usedAttributeNames, reservedNames),
      type: validators.type(),
      default: validators.default(),
      unique: validators.unique(),
      required: validators.required(),
      maxLength: validators.maxLength(),
      minLength: validators.minLength()
    };
    return yup__namespace.object(shape);
  },
  string(usedAttributeNames, reservedNames) {
    const shape = createTextShape(usedAttributeNames, reservedNames);
    return yup__namespace.object(shape);
  },
  text(usedAttributeNames, reservedNames) {
    const shape = createTextShape(usedAttributeNames, reservedNames);
    return yup__namespace.object(shape);
  },
  uid(usedAttributeNames, reservedNames) {
    const shape = createTextShape(usedAttributeNames, reservedNames);
    return yup__namespace.object(shape);
  }
};
const CATEGORY_NAME_REGEX = /^[A-Za-z][-_0-9A-Za-z]*$/;
const createCategorySchema = (usedCategoryNames) => {
  const shape = {
    name: yup__namespace.string().matches(CATEGORY_NAME_REGEX, strapiAdmin.translatedErrors.regex.id).test({
      name: "nameNotAllowed",
      message: strapiAdmin.translatedErrors.unique.id,
      test(value) {
        if (!value) {
          return false;
        }
        return !usedCategoryNames.includes(value?.toLowerCase());
      }
    }).required(strapiAdmin.translatedErrors.required.id)
  };
  return yup__namespace.object(shape);
};
const categoryForm = {
  base: {
    sections: [
      {
        sectionTitle: null,
        items: [
          {
            autoFocus: true,
            name: "name",
            type: "text",
            intlLabel: {
              id: "global.name",
              defaultMessage: "Name"
            },
            // validations: {
            //   required: true,
            // },
            description: {
              id: getTrad("modalForm.editCategory.base.name.description"),
              defaultMessage: "No space is allowed for the name of the category"
            }
          }
        ]
      }
    ]
  }
};
const createComponentSchema = (usedComponentNames, reservedNames, category, takenCollectionNames, currentCollectionName) => {
  const shape = {
    displayName: yup__namespace.string().test({
      name: "nameAlreadyUsed",
      message: strapiAdmin.translatedErrors.unique.id,
      test(value) {
        if (!value) {
          return false;
        }
        const name = index$1.createComponentUid(value, category);
        const snakeCaseKey = fp.snakeCase(name);
        const snakeCaseCollectionName = fp.snakeCase(currentCollectionName);
        return usedComponentNames.every((reserved) => {
          return fp.snakeCase(reserved) !== snakeCaseKey;
        }) && takenCollectionNames.every(
          (collectionName) => fp.snakeCase(collectionName) !== snakeCaseCollectionName
        );
      }
    }).test({
      name: "nameNotAllowed",
      message: getTrad("error.contentTypeName.reserved-name"),
      test(value) {
        if (!value) {
          return false;
        }
        const snakeCaseKey = fp.snakeCase(value);
        return reservedNames.every((reserved) => {
          return fp.snakeCase(reserved) !== snakeCaseKey;
        });
      }
    }).required(strapiAdmin.translatedErrors.required.id),
    category: yup__namespace.string().matches(CATEGORY_NAME_REGEX, strapiAdmin.translatedErrors.regex.id).required(strapiAdmin.translatedErrors.required.id),
    icon: yup__namespace.string()
  };
  return yup__namespace.object(shape);
};
const nameField = {
  name: "displayName",
  type: "text",
  intlLabel: {
    id: getTrad("contentType.displayName.label"),
    defaultMessage: "Display name"
  }
};
const contentTypeForm = {
  advanced: {
    default() {
      return {
        sections: [
          {
            items: [
              {
                intlLabel: {
                  id: getTrad("contentType.draftAndPublish.label"),
                  defaultMessage: "Draft & publish"
                },
                description: {
                  id: getTrad("contentType.draftAndPublish.description"),
                  defaultMessage: "Allows writing a draft version of an entry, before it is published"
                },
                name: "draftAndPublish",
                type: "toggle-draft-publish",
                validations: {}
              }
            ]
          }
        ]
      };
    }
  },
  base: {
    create() {
      return {
        sections: [
          {
            sectionTitle: null,
            items: [
              nameField,
              {
                description: {
                  id: getTrad("contentType.apiId-singular.description"),
                  defaultMessage: "Used to generate the API routes and databases tables/collections"
                },
                intlLabel: {
                  id: getTrad("contentType.apiId-singular.label"),
                  defaultMessage: "API ID (Singular)"
                },
                name: "singularName",
                type: "text-singular"
              },
              {
                type: "pushRight",
                size: 6,
                intlLabel: { id: "", defaultMessage: "" },
                name: "pushRight"
              },
              {
                description: {
                  id: getTrad("contentType.apiId-plural.description"),
                  defaultMessage: "Pluralized API ID"
                },
                intlLabel: {
                  id: getTrad("contentType.apiId-plural.label"),
                  defaultMessage: "API ID (Plural)"
                },
                name: "pluralName",
                type: "text-plural"
              }
            ]
          }
        ]
      };
    },
    edit() {
      return {
        sections: [
          {
            sectionTitle: null,
            items: [
              nameField,
              {
                disabled: true,
                description: {
                  id: getTrad("contentType.apiId-singular.description"),
                  defaultMessage: "Used to generate the API routes and databases tables/collections"
                },
                intlLabel: {
                  id: getTrad("contentType.apiId-singular.label"),
                  defaultMessage: "API ID (Singular)"
                },
                name: "singularName",
                type: "text"
              },
              {
                type: "pushRight",
                size: 6,
                intlLabel: { id: "", defaultMessage: "" },
                name: "pushRight"
              },
              {
                disabled: true,
                description: {
                  id: getTrad("contentType.apiId-plural.description"),
                  defaultMessage: "Pluralized API ID"
                },
                intlLabel: {
                  id: getTrad("contentType.apiId-plural.label"),
                  defaultMessage: "API ID (Plural)"
                },
                name: "pluralName",
                type: "text"
              },
              {
                intlLabel: {
                  id: "global.type",
                  defaultMessage: "Type"
                },
                name: "kind",
                type: "content-type-radio-group",
                size: 12,
                radios: [
                  {
                    title: {
                      id: getTrad("form.button.collection-type.name"),
                      defaultMessage: "Collection Type"
                    },
                    description: {
                      id: getTrad("form.button.collection-type.description"),
                      defaultMessage: "Best for multiple instances like articles, products, comments, etc."
                    },
                    value: "collectionType"
                  },
                  {
                    title: {
                      id: getTrad("form.button.single-type.name"),
                      defaultMessage: "Single Type"
                    },
                    description: {
                      id: getTrad("form.button.single-type.description"),
                      defaultMessage: "Best for single instance like about us, homepage, etc."
                    },
                    value: "singleType"
                  }
                ]
              }
            ]
          }
        ]
      };
    }
  }
};
const createContentTypeSchema = ({
  usedContentTypeNames = [],
  reservedModels = [],
  singularNames = [],
  pluralNames = [],
  collectionNames = []
}) => {
  const shape = {
    displayName: yup__namespace.string().test({
      name: "nameAlreadyUsed",
      message: strapiAdmin.translatedErrors.unique.id,
      test(value) {
        if (!value) {
          return false;
        }
        const name = index$1.createUid(value);
        const snakeCaseKey = fp.snakeCase(name);
        return !usedContentTypeNames.some((value2) => {
          return fp.snakeCase(value2) === snakeCaseKey;
        });
      }
    }).test({
      name: "nameNotAllowed",
      message: getTrad("error.contentTypeName.reserved-name"),
      test(value) {
        if (!value) {
          return false;
        }
        const snakeCaseKey = fp.snakeCase(value);
        return !reservedModels.some((key) => {
          return fp.snakeCase(key) === snakeCaseKey;
        });
      }
    }).required(strapiAdmin.translatedErrors.required.id),
    pluralName: yup__namespace.string().test({
      name: "pluralNameAlreadyUsed",
      message: strapiAdmin.translatedErrors.unique.id,
      test(value) {
        if (!value) {
          return false;
        }
        const snakeCaseKey = fp.snakeCase(value);
        return !pluralNames.some((key) => {
          return fp.snakeCase(key) === snakeCaseKey;
        });
      }
    }).test({
      name: "pluralNameAlreadyUsedAsSingular",
      message: getTrad("error.contentType.pluralName-equals-singularName"),
      test(value) {
        if (!value) {
          return false;
        }
        const snakeCaseKey = fp.snakeCase(value);
        return !singularNames.some((key) => {
          return fp.snakeCase(key) === snakeCaseKey;
        });
      }
    }).test({
      name: "pluralAndSingularAreUnique",
      message: getTrad("error.contentType.pluralName-used"),
      test(value, context) {
        if (!value) {
          return false;
        }
        return fp.snakeCase(context.parent.singularName) !== fp.snakeCase(value);
      }
    }).test({
      name: "pluralNameNotAllowed",
      message: getTrad("error.contentTypeName.reserved-name"),
      test(value) {
        if (!value) {
          return false;
        }
        const snakeCaseKey = fp.snakeCase(value);
        return !reservedModels.some((key) => {
          return fp.snakeCase(key) === snakeCaseKey;
        });
      }
    }).test({
      name: "pluralNameNotAlreadyUsedInCollectionName",
      message: getTrad("error.contentType.pluralName-equals-collectionName"),
      test(value) {
        if (!value) {
          return false;
        }
        const snakeCaseKey = fp.snakeCase(value);
        return !collectionNames.some((key) => {
          return fp.snakeCase(key) === snakeCaseKey;
        });
      }
    }).required(strapiAdmin.translatedErrors.required.id),
    singularName: yup__namespace.string().test({
      name: "singularNameAlreadyUsed",
      message: strapiAdmin.translatedErrors.unique.id,
      test(value) {
        if (!value) {
          return false;
        }
        const snakeCaseKey = fp.snakeCase(value);
        return !singularNames.some((key) => {
          return fp.snakeCase(key) === snakeCaseKey;
        });
      }
    }).test({
      name: "singularNameAlreadyUsedAsPlural",
      message: getTrad("error.contentType.singularName-equals-pluralName"),
      test(value) {
        if (!value) {
          return false;
        }
        const snakeCaseKey = fp.snakeCase(value);
        return !pluralNames.some((key) => {
          return fp.snakeCase(key) === snakeCaseKey;
        });
      }
    }).test({
      name: "pluralAndSingularAreUnique",
      message: getTrad("error.contentType.singularName-used"),
      test(value, context) {
        if (!value) {
          return false;
        }
        return fp.snakeCase(context.parent.pluralName) !== fp.snakeCase(value);
      }
    }).test({
      name: "singularNameNotAllowed",
      message: getTrad("error.contentTypeName.reserved-name"),
      test(value) {
        if (!value) {
          return false;
        }
        const snakeCaseKey = fp.snakeCase(value);
        return !reservedModels.some((key) => {
          return fp.snakeCase(key) === snakeCaseKey;
        });
      }
    }).required(strapiAdmin.translatedErrors.required.id),
    draftAndPublish: yup__namespace.boolean(),
    kind: yup__namespace.string().oneOf(["singleType", "collectionType"])
  };
  return yup__namespace.object(shape);
};
const dynamiczoneForm = {
  advanced: {
    default() {
      return {
        sections: componentForm.advanced()
      };
    }
  },
  base: {
    createComponent() {
      return {
        sections: [
          { sectionTitle: null, items: [componentField] },
          ...componentForm.base("componentToCreate.")
        ]
      };
    },
    default() {
      return {
        sections: [
          { sectionTitle: null, items: [componentField] },
          {
            sectionTitle: null,
            items: [
              {
                type: "pushRight",
                size: 6,
                intlLabel: { id: "", defaultMessage: "" },
                name: "pushRight"
              },
              {
                name: "components",
                type: "select-components",
                intlLabel: {
                  id: getTrad("modalForm.attributes.select-components"),
                  defaultMessage: "Select the components"
                },
                isMultiple: true
              }
            ]
          }
        ]
      };
    }
  }
};
const addItemsToFormSection = (formTypeOptions, sections) => {
  formTypeOptions.forEach((item) => {
    if (!("sectionTitle" in item)) {
      sections[0].items?.push(item);
      return;
    }
    sections.push(item);
  });
};
const createComponentCollectionName = (name, category) => {
  return `components_${fp.snakeCase(category)}_${pluralize__default.default(fp.snakeCase(name))}`;
};
const getUsedAttributeNames = (attributes, schemaData) => {
  return attributes.filter(({ name }) => {
    return name !== schemaData.initialData.name;
  }).map(({ name }) => name);
};
const forms = {
  customField: {
    schema({
      schemaAttributes,
      attributeType,
      customFieldValidator,
      reservedNames,
      schemaData,
      ctbFormsAPI
    }) {
      const usedAttributeNames = getUsedAttributeNames(schemaAttributes, schemaData);
      let attributeShape;
      if (attributeType === "relation") {
        attributeShape = attributeTypes[attributeType](
          usedAttributeNames,
          reservedNames.attributes,
          [],
          { initialData: {}, modifiedData: {} }
        );
      } else {
        attributeShape = attributeTypes[attributeType](
          usedAttributeNames,
          reservedNames.attributes
        );
      }
      return ctbFormsAPI.makeCustomFieldValidator(
        attributeShape,
        customFieldValidator,
        usedAttributeNames,
        reservedNames.attributes,
        schemaData
      );
    },
    form: {
      base({ customField }) {
        const sections = [{ sectionTitle: null, items: [nameField$1] }];
        if (customField.options?.base) {
          addItemsToFormSection(customField.options.base, sections);
        }
        return { sections };
      },
      advanced({ customField, data, step, extensions, ...rest }) {
        const sections = [{ sectionTitle: null, items: [] }];
        const injectedInputs = extensions.getAdvancedForm(["attribute", customField.type], {
          data,
          type: customField.type,
          step,
          ...rest
        });
        if (customField.options?.advanced) {
          addItemsToFormSection(customField.options.advanced, sections);
        }
        if (injectedInputs) {
          const extendedSettings = {
            sectionTitle: {
              id: getTrad("modalForm.custom-fields.advanced.settings.extended"),
              defaultMessage: "Extended settings"
            },
            items: injectedInputs
          };
          sections.push(extendedSettings);
        }
        return { sections };
      }
    }
  },
  attribute: {
    schema(currentSchema, attributeType, reservedNames, alreadyTakenTargetContentTypeAttributes, options2, extensions) {
      const attributes = currentSchema?.schema?.attributes ?? [];
      const usedAttributeNames = getUsedAttributeNames(attributes, options2);
      try {
        const attributeShape = attributeTypes[attributeType](
          usedAttributeNames,
          reservedNames.attributes,
          alreadyTakenTargetContentTypeAttributes,
          options2
        );
        return extensions.makeValidator(
          ["attribute", attributeType],
          attributeShape,
          usedAttributeNames,
          reservedNames.attributes,
          alreadyTakenTargetContentTypeAttributes,
          options2
        );
      } catch (err) {
        console.error("Error yup build schema", err);
        return attributeTypes.default(usedAttributeNames, reservedNames.attributes);
      }
    },
    form: {
      advanced({ data, type, step, extensions, ...rest }) {
        try {
          const baseForm2 = attributesForm.advanced[type](data, step).sections;
          const itemsToAdd = extensions.getAdvancedForm(["attribute", type], {
            data,
            type,
            step,
            ...rest
          });
          const sections = baseForm2.reduce((acc, current) => {
            if (current.sectionTitle === null) {
              acc.push(current);
            } else {
              acc.push({ ...current, items: [...current.items, ...itemsToAdd] });
            }
            return acc;
          }, []);
          return { sections };
        } catch (err) {
          console.error(err);
          return { sections: [] };
        }
      },
      base({ data, type, step, attributes }) {
        try {
          return attributesForm.base[type](data, step, attributes);
        } catch (err) {
          return commonBaseForm;
        }
      }
    }
  },
  contentType: {
    schema(alreadyTakenNames, isEditing, ctUid, reservedNames, extensions, contentTypes) {
      const singularNames = Object.values(contentTypes).map((contentType) => {
        return contentType.schema.singularName;
      });
      const pluralNames = Object.values(contentTypes).map((contentType) => {
        return contentType?.schema?.pluralName ?? "";
      });
      const takenNames = isEditing ? alreadyTakenNames.filter((uid) => uid !== ctUid) : alreadyTakenNames;
      const takenSingularNames = isEditing ? singularNames.filter((singName) => {
        const { schema } = contentTypes[ctUid];
        return schema.singularName !== singName;
      }) : singularNames;
      const takenPluralNames = isEditing ? pluralNames.filter((pluralName) => {
        const { schema } = contentTypes[ctUid];
        return schema.pluralName !== pluralName;
      }) : pluralNames;
      const collectionNames = Object.values(contentTypes).map((contentType) => {
        return contentType?.schema?.collectionName ?? "";
      });
      const takenCollectionNames = isEditing ? collectionNames.filter((collectionName) => {
        const { schema } = contentTypes[ctUid];
        const currentCollectionName = schema.collectionName;
        return collectionName !== currentCollectionName;
      }) : collectionNames;
      const contentTypeShape = createContentTypeSchema({
        usedContentTypeNames: takenNames,
        reservedModels: reservedNames.models,
        singularNames: takenSingularNames,
        pluralNames: takenPluralNames,
        collectionNames: takenCollectionNames
      });
      return extensions.makeValidator(
        ["contentType"],
        contentTypeShape,
        takenNames,
        reservedNames.models,
        takenSingularNames,
        takenPluralNames
      );
    },
    form: {
      base({ actionType }) {
        if (actionType === "create") {
          return contentTypeForm.base.create();
        }
        return contentTypeForm.base.edit();
      },
      advanced({ extensions }) {
        const baseForm2 = contentTypeForm.advanced.default().sections.map((section) => section.items).flat();
        const itemsToAdd = extensions.getAdvancedForm(["contentType"]);
        return {
          sections: [
            {
              items: [...baseForm2, ...itemsToAdd]
            }
          ]
        };
      }
    }
  },
  component: {
    schema(alreadyTakenAttributes, componentCategory, reservedNames, isEditing = false, components, componentDisplayName, compoUid = null) {
      const takenNames = isEditing ? alreadyTakenAttributes.filter((uid) => uid !== compoUid) : alreadyTakenAttributes;
      const collectionNames = Object.values(components).map((component) => {
        return component?.schema?.collectionName;
      });
      const currentCollectionName = createComponentCollectionName(
        componentDisplayName,
        componentCategory
      );
      const takenCollectionNames = isEditing ? collectionNames.filter((collectionName) => collectionName !== currentCollectionName) : collectionNames;
      return createComponentSchema(
        takenNames,
        reservedNames.models,
        componentCategory,
        takenCollectionNames,
        currentCollectionName
      );
    },
    form: {
      advanced() {
        return {
          sections: componentForm.advanced()
        };
      },
      base() {
        return {
          sections: componentForm.base()
        };
      }
    }
  },
  addComponentToDynamicZone: {
    form: {
      advanced() {
        return dynamiczoneForm.advanced.default();
      },
      base({ data }) {
        const isCreatingComponent = data?.createComponent ?? false;
        if (isCreatingComponent) {
          return dynamiczoneForm.base.createComponent();
        }
        return dynamiczoneForm.base.default();
      }
    }
  },
  editCategory: {
    schema(allCategories, initialData) {
      const allowedCategories = allCategories.filter((cat) => cat !== initialData.name).map((cat) => cat.toLowerCase());
      return createCategorySchema(allowedCategories);
    },
    form: {
      advanced: () => ({ sections: [] }),
      base() {
        return categoryForm.base;
      }
    }
  }
};
const formModalDomain = () => (state) => state[`${index$1.pluginId}_formModal`] || index$1.initialState;
const makeSelectFormModal = () => toolkit.createSelector(formModalDomain(), (substate) => {
  return substate;
});
const canEditContentType = (data, modifiedData) => {
  const kind = get__default.default(data, ["contentType", "schema", "kind"], "");
  if (kind === "singleType" || kind === modifiedData.kind) {
    return true;
  }
  const contentTypeAttributes = get__default.default(
    data,
    ["contentType", "schema", "attributes"],
    []
  );
  const relationAttributes = contentTypeAttributes.filter(({ relation, type, targetAttribute }) => {
    const relationType = index$1.getRelationType(relation, targetAttribute);
    return type === "relation" && !["oneWay", "manyWay"].includes(relationType || "");
  });
  return relationAttributes.length === 0;
};
const getAttributesToDisplay = (dataTarget = "", targetUid, nestedComponents) => {
  const defaultAttributes = [
    "text",
    "boolean",
    "blocks",
    "json",
    "number",
    "email",
    "date",
    "password",
    "media",
    "enumeration",
    "relation",
    "richtext"
  ];
  const isPickingAttributeForAContentType = dataTarget === "contentType";
  if (isPickingAttributeForAContentType) {
    return [
      // Insert UID before the last item (richtext)
      [...defaultAttributes.slice(0, -1), "uid", ...defaultAttributes.slice(-1)],
      ["component", "dynamiczone"]
    ];
  }
  if (dataTarget) {
    const componentDepth = getComponentDepth(targetUid, nestedComponents);
    const isNestedInAnotherComponent = componentDepth >= index$1.MAX_COMPONENT_DEPTH;
    const canAddComponentInAnotherComponent = !isPickingAttributeForAContentType && !isNestedInAnotherComponent;
    if (canAddComponentInAnotherComponent) {
      return [defaultAttributes, ["component"]];
    }
  }
  return [defaultAttributes];
};
const getFormInputNames = (form) => form.reduce((acc, current) => {
  const names = current.items.reduce((acc2, current2) => {
    if (current2.name) {
      acc2.push(current2.name);
    }
    return acc2;
  }, []);
  return [...acc, ...names];
}, []);
const FormComponent = styledComponents.styled.form`
  overflow: auto;
`;
const FormModal = () => {
  const {
    onCloseModal,
    onNavigateToChooseAttributeModal,
    onNavigateToAddCompoToDZModal,
    onNavigateToCreateComponentStep2,
    actionType,
    attributeName,
    attributeType,
    customFieldUid,
    categoryName,
    dynamicZoneTarget,
    forTarget,
    modalType,
    isOpen,
    kind,
    step,
    targetUid,
    showBackLink,
    activeTab,
    setActiveTab
  } = useFormModalNavigation();
  const getPlugin = strapiAdmin.useStrapiApp("FormModal", (state) => state.getPlugin);
  const getCustomField = strapiAdmin.useStrapiApp("FormModal", (state) => state.customFields.get);
  const customField = getCustomField(customFieldUid);
  const formModalSelector = React__namespace.useMemo(makeSelectFormModal, []);
  const dispatch = reactRedux.useDispatch();
  const { toggleNotification } = strapiAdmin.useNotification();
  const reducerState = reactRedux.useSelector((state) => formModalSelector(state), reactRedux.shallowEqual);
  const navigate = reactRouterDom.useNavigate();
  const { trackUsage } = strapiAdmin.useTracking();
  const { formatMessage } = reactIntl.useIntl();
  const ctbPlugin = getPlugin(index$1.pluginId);
  const ctbFormsAPI = ctbPlugin?.apis.forms;
  const inputsFromPlugins = ctbFormsAPI.components.inputs;
  const {
    addAttribute,
    addCustomFieldAttribute,
    addCreatedComponentToDynamicZone,
    allComponentsCategories,
    changeDynamicZoneComponents,
    contentTypes,
    components,
    createSchema,
    deleteCategory,
    deleteData,
    editCategory,
    editCustomFieldAttribute,
    submitData,
    modifiedData: allDataSchema,
    nestedComponents,
    setModifiedData,
    sortedContentTypesList,
    updateSchema,
    reservedNames
  } = useDataManager();
  const {
    componentToCreate,
    formErrors,
    initialData,
    isCreatingComponentWhileAddingAField,
    modifiedData
  } = reducerState;
  const pathToSchema = forTarget === "contentType" || forTarget === "component" ? [forTarget] : [forTarget, targetUid];
  React__namespace.useEffect(() => {
    if (isOpen) {
      const collectionTypesForRelation = sortedContentTypesList.filter(
        isAllowedContentTypesForRelations
      );
      if (modalType === "editCategory") {
        setModifiedData();
      }
      if (actionType === "edit" && modalType === "attribute" && forTarget === "contentType") {
        trackUsage("willEditFieldOfContentType");
      }
      const pathToAttributes = [...pathToSchema, "schema", "attributes"];
      const foundDynamicZoneTarget = findAttribute(get__default.default(allDataSchema, pathToAttributes, []), dynamicZoneTarget) || null;
      if (modalType === "editCategory" && actionType === "edit") {
        dispatch({
          type: index$1.SET_DATA_TO_EDIT,
          modalType,
          actionType,
          data: {
            name: categoryName
          }
        });
      }
      if (modalType === "contentType" && actionType === "create") {
        dispatch({
          type: index$1.SET_DATA_TO_EDIT,
          modalType,
          actionType,
          data: {
            draftAndPublish: true
          },
          pluginOptions: {}
        });
      }
      if (modalType === "contentType" && actionType === "edit") {
        const { displayName, draftAndPublish, kind: kind2, pluginOptions, pluralName, singularName } = get__default.default(
          allDataSchema,
          [...pathToSchema, "schema"],
          {
            displayName: null,
            pluginOptions: {},
            singularName: null,
            pluralName: null
          }
        );
        dispatch({
          type: index$1.SET_DATA_TO_EDIT,
          actionType,
          modalType,
          data: {
            displayName,
            draftAndPublish,
            kind: kind2,
            pluginOptions,
            pluralName,
            singularName
          }
        });
      }
      if (modalType === "component" && actionType === "edit") {
        const data = get__default.default(allDataSchema, pathToSchema, {});
        dispatch({
          type: index$1.SET_DATA_TO_EDIT,
          actionType,
          modalType,
          data: {
            displayName: data.schema.displayName,
            category: data.category,
            icon: data.schema.icon
          }
        });
      }
      if (modalType === "addComponentToDynamicZone" && actionType === "edit") {
        const attributeToEdit = {
          ...foundDynamicZoneTarget,
          // We filter the available components
          // Because this modal is only used for adding components
          components: [],
          name: dynamicZoneTarget,
          createComponent: false,
          componentToCreate: { type: "component" }
        };
        dispatch({
          type: index$1.SET_DYNAMIC_ZONE_DATA_SCHEMA,
          attributeToEdit
        });
      }
      if (attributeType) {
        const attributeToEditNotFormatted = findAttribute(
          get__default.default(allDataSchema, pathToAttributes, []),
          attributeName
        );
        const attributeToEdit = {
          ...attributeToEditNotFormatted,
          name: attributeName
        };
        if (attributeType === "component" && actionType === "edit") {
          if (!attributeToEdit.repeatable) {
            set__default.default(attributeToEdit, "repeatable", false);
          }
        }
        if (modalType === "customField") {
          dispatch({
            type: index$1.SET_CUSTOM_FIELD_DATA_SCHEMA,
            customField,
            isEditing: actionType === "edit",
            modifiedDataToSetForEditing: attributeToEdit,
            // NOTE: forTarget is used in the i18n middleware
            forTarget
          });
        } else {
          dispatch({
            type: index$1.SET_ATTRIBUTE_DATA_SCHEMA,
            attributeType,
            nameToSetForRelation: get__default.default(collectionTypesForRelation, ["0", "title"], "error"),
            targetUid: get__default.default(collectionTypesForRelation, ["0", "uid"], "error"),
            isEditing: actionType === "edit",
            modifiedDataToSetForEditing: attributeToEdit,
            step,
            forTarget
          });
        }
      }
    } else {
      dispatch({ type: index$1.RESET_PROPS });
    }
  }, [
    actionType,
    attributeName,
    attributeType,
    categoryName,
    dynamicZoneTarget,
    forTarget,
    isOpen,
    modalType
  ]);
  const isCreatingContentType = modalType === "contentType";
  const isCreatingComponent = modalType === "component";
  const isCreatingAttribute = modalType === "attribute";
  const isCreatingCustomFieldAttribute = modalType === "customField";
  const isComponentAttribute = attributeType === "component" && isCreatingAttribute;
  const isCreating = actionType === "create";
  const isCreatingComponentFromAView = get__default.default(modifiedData, "createComponent", false) || isCreatingComponentWhileAddingAField;
  const isInFirstComponentStep = step === "1";
  const isEditingCategory = modalType === "editCategory";
  const isPickingAttribute = modalType === "chooseAttribute";
  const uid = index$1.createUid(modifiedData.displayName || "");
  const attributes = get__default.default(allDataSchema, [...pathToSchema, "schema", "attributes"], null);
  const checkFormValidity = async () => {
    let schema;
    const dataToValidate = isCreatingComponentFromAView && step === "1" ? get__default.default(modifiedData, "componentToCreate", {}) : modifiedData;
    if (isCreatingContentType) {
      schema = forms.contentType.schema(
        Object.keys(contentTypes),
        actionType === "edit",
        // currentUID
        get__default.default(allDataSchema, [...pathToSchema, "uid"], null),
        reservedNames,
        ctbFormsAPI,
        contentTypes
      );
    } else if (isCreatingComponent) {
      schema = forms.component.schema(
        Object.keys(components),
        modifiedData.category || "",
        reservedNames,
        actionType === "edit",
        components,
        modifiedData.displayName || "",
        get__default.default(allDataSchema, [...pathToSchema, "uid"], null)
        // ctbFormsAPI
      );
    } else if (isCreatingCustomFieldAttribute) {
      schema = forms.customField.schema({
        schemaAttributes: get__default.default(allDataSchema, [...pathToSchema, "schema", "attributes"], []),
        attributeType: customField.type,
        reservedNames,
        schemaData: { modifiedData, initialData },
        ctbFormsAPI,
        customFieldValidator: customField.options?.validator
      });
    } else if (isComponentAttribute && isCreatingComponentFromAView && isInFirstComponentStep) {
      schema = forms.component.schema(
        Object.keys(components),
        get__default.default(modifiedData, "componentToCreate.category", ""),
        reservedNames,
        actionType === "edit",
        components,
        modifiedData.componentToCreate.displayName || ""
      );
    } else if (isCreatingAttribute && !isInFirstComponentStep) {
      const type = attributeType === "relation" ? "relation" : modifiedData.type;
      let alreadyTakenTargetContentTypeAttributes = [];
      if (type === "relation") {
        const targetContentTypeUID = get__default.default(modifiedData, ["target"], null);
        const targetContentTypeAttributes = get__default.default(
          contentTypes,
          [targetContentTypeUID, "schema", "attributes"],
          []
        );
        alreadyTakenTargetContentTypeAttributes = targetContentTypeAttributes.filter(
          ({ name: attrName }) => {
            if (actionType !== "edit") {
              return true;
            }
            return attrName !== initialData.targetAttribute;
          }
        );
      }
      schema = forms.attribute.schema(
        get__default.default(allDataSchema, pathToSchema, {}),
        type,
        reservedNames,
        alreadyTakenTargetContentTypeAttributes,
        { modifiedData, initialData },
        ctbFormsAPI
      );
    } else if (isEditingCategory) {
      schema = forms.editCategory.schema(allComponentsCategories, initialData);
    } else {
      if (isInFirstComponentStep && isCreatingComponentFromAView) {
        schema = forms.component.schema(
          Object.keys(components),
          get__default.default(modifiedData, "componentToCreate.category", ""),
          reservedNames,
          actionType === "edit",
          components,
          modifiedData.componentToCreate.displayName || ""
        );
      } else {
        return;
      }
    }
    await schema.validate(dataToValidate, { abortEarly: false });
  };
  const handleChange = React__namespace.useCallback(
    ({
      target: { name, value, type, ...rest }
    }) => {
      const namesThatCanResetToNullValue = [
        "enumName",
        "max",
        "min",
        "maxLength",
        "minLength",
        "regex",
        "default"
      ];
      let val;
      if (namesThatCanResetToNullValue.includes(name) && value === "") {
        val = null;
      } else {
        val = value;
      }
      const clonedErrors = Object.assign({}, formErrors);
      if (name === "max") {
        delete clonedErrors.min;
      }
      if (name === "maxLength") {
        delete clonedErrors.minLength;
      }
      delete clonedErrors[name];
      dispatch({
        type: index$1.SET_ERRORS,
        errors: clonedErrors
      });
      dispatch({
        type: index$1.ON_CHANGE,
        keys: name.split("."),
        value: val,
        ...rest
      });
    },
    [dispatch, formErrors]
  );
  const handleSubmit = async (e, shouldContinue = isCreating) => {
    e.preventDefault();
    try {
      await checkFormValidity();
      sendButtonAddMoreFieldEvent(shouldContinue);
      const ctTargetUid = forTarget === "components" ? targetUid : uid;
      if (isCreatingContentType) {
        if (isCreating) {
          createSchema({ ...modifiedData, kind }, modalType, uid);
          navigate({ pathname: `/plugins/${index$1.pluginId}/content-types/${uid}` });
          onNavigateToChooseAttributeModal({
            forTarget,
            targetUid: ctTargetUid
          });
        } else {
          if (canEditContentType(allDataSchema, modifiedData)) {
            onCloseModal();
            await submitData(modifiedData);
          } else {
            toggleNotification({
              type: "danger",
              message: formatMessage({ id: "notification.contentType.relations.conflict" })
            });
          }
          return;
        }
      } else if (modalType === "component") {
        if (isCreating) {
          const componentUid = index$1.createComponentUid(modifiedData.displayName, modifiedData.category);
          const { category, ...rest } = modifiedData;
          createSchema(rest, "component", componentUid, category);
          navigate({
            pathname: `/plugins/${index$1.pluginId}/component-categories/${category}/${componentUid}`
          });
          onNavigateToChooseAttributeModal({
            forTarget,
            targetUid: componentUid
          });
        } else {
          updateSchema(modifiedData, modalType, targetUid);
          onCloseModal();
          return;
        }
      } else if (isEditingCategory) {
        if (toLower__default.default(initialData.name) === toLower__default.default(modifiedData.name)) {
          onCloseModal();
          return;
        }
        editCategory(initialData.name, modifiedData);
        return;
      } else if (isCreatingCustomFieldAttribute) {
        const customFieldAttributeUpdate = {
          attributeToSet: { ...modifiedData, customField: customFieldUid },
          forTarget,
          targetUid,
          initialAttribute: initialData
        };
        if (actionType === "edit") {
          editCustomFieldAttribute(customFieldAttributeUpdate);
        } else {
          addCustomFieldAttribute(customFieldAttributeUpdate);
        }
        if (shouldContinue) {
          onNavigateToChooseAttributeModal({
            forTarget,
            targetUid: ctTargetUid
          });
        } else {
          onCloseModal();
        }
        return;
      } else if (isCreatingAttribute && !isCreatingComponentFromAView) {
        const isDynamicZoneAttribute = attributeType === "dynamiczone";
        if (isDynamicZoneAttribute) {
          addAttribute(modifiedData, forTarget, targetUid, actionType === "edit", initialData);
          if (isCreating) {
            dispatch({
              type: index$1.RESET_PROPS_AND_SET_THE_FORM_FOR_ADDING_A_COMPO_TO_A_DZ
            });
            setActiveTab("basic");
            onNavigateToAddCompoToDZModal({ dynamicZoneTarget: modifiedData.name });
          } else {
            onCloseModal();
          }
          return;
        }
        if (!isComponentAttribute) {
          addAttribute(modifiedData, forTarget, targetUid, actionType === "edit", initialData);
          if (shouldContinue) {
            onNavigateToChooseAttributeModal({
              forTarget,
              targetUid: ctTargetUid
            });
          } else {
            onCloseModal();
          }
          return;
        }
        if (isInFirstComponentStep) {
          onNavigateToCreateComponentStep2();
          dispatch({
            type: index$1.RESET_PROPS_AND_SET_FORM_FOR_ADDING_AN_EXISTING_COMPO,
            forTarget
          });
          return;
        }
        addAttribute(
          modifiedData,
          forTarget,
          targetUid,
          // This change the dispatched type
          // either 'EDIT_ATTRIBUTE' or 'ADD_ATTRIBUTE' in the DataManagerProvider
          actionType === "edit",
          // This is for the edit part
          initialData,
          // Passing true will add the component to the components object
          // This way we can add fields to the added component (if it wasn't there already)
          true
        );
        if (shouldContinue) {
          onNavigateToChooseAttributeModal({
            forTarget,
            targetUid
          });
        } else {
          onCloseModal();
        }
      } else if (isCreatingAttribute && isCreatingComponentFromAView) {
        if (isInFirstComponentStep) {
          trackUsage("willCreateComponentFromAttributesModal");
          dispatch({
            type: index$1.RESET_PROPS_AND_SAVE_CURRENT_DATA,
            forTarget
          });
          onNavigateToCreateComponentStep2();
          return;
        }
        const { category, type, ...rest } = componentToCreate;
        const componentUid = index$1.createComponentUid(componentToCreate.displayName, category);
        createSchema(
          // Component data
          rest,
          // Type will always be component
          // It will dispatch the CREATE_COMPONENT_SCHEMA action
          // So the component will be added in the main components object
          // This might not be needed if we don't allow navigation between entries while editing
          type,
          componentUid,
          category,
          // This will add the created component in the datamanager modifiedData components key
          // Like explained above we will be able to modify the created component structure
          isCreatingComponentFromAView
        );
        addAttribute(modifiedData, forTarget, targetUid, false);
        dispatch({ type: index$1.RESET_PROPS });
        if (shouldContinue) {
          onNavigateToChooseAttributeModal({ forTarget: "components", targetUid: componentUid });
        } else {
          onCloseModal();
        }
        return;
      } else {
        if (isInFirstComponentStep) {
          if (isCreatingComponentFromAView) {
            const { category, type, ...rest } = modifiedData.componentToCreate;
            const componentUid = index$1.createComponentUid(
              modifiedData.componentToCreate.displayName,
              category
            );
            createSchema(
              // Component data
              rest,
              // Type will always be component
              // It will dispatch the CREATE_COMPONENT_SCHEMA action
              // So the component will be added in the main components object
              // This might not be needed if we don't allow navigation between entries while editing
              type,
              componentUid,
              category,
              // This will add the created component in the datamanager modifiedData components key
              // Like explained above we will be able to modify the created component structure
              isCreatingComponentFromAView
            );
            addCreatedComponentToDynamicZone(dynamicZoneTarget, [componentUid]);
            onNavigateToChooseAttributeModal({ forTarget: "components", targetUid: componentUid });
          } else {
            changeDynamicZoneComponents(dynamicZoneTarget, modifiedData.components);
            onCloseModal();
          }
        } else {
          console.error("This case is not handled");
        }
        return;
      }
      dispatch({
        type: index$1.RESET_PROPS
      });
    } catch (err) {
      const errors = getYupInnerErrors(err);
      dispatch({
        type: index$1.SET_ERRORS,
        errors
      });
    }
  };
  const handleConfirmClose = () => {
    const confirm = window.confirm(
      formatMessage({
        id: "window.confirm.close-modal.file",
        defaultMessage: "Are you sure? Your changes will be lost."
      })
    );
    if (confirm) {
      onCloseModal();
      dispatch({
        type: index$1.RESET_PROPS
      });
    }
  };
  const handleClosed = () => {
    if (!isEqual__default.default(modifiedData, initialData)) {
      handleConfirmClose();
    } else {
      onCloseModal();
      dispatch({
        type: index$1.RESET_PROPS
      });
    }
  };
  const sendAdvancedTabEvent = (tab) => {
    if (tab !== "advanced") {
      return;
    }
    if (isCreatingContentType) {
      trackUsage("didSelectContentTypeSettings");
      return;
    }
    if (forTarget === "contentType") {
      trackUsage("didSelectContentTypeFieldSettings");
    }
  };
  const sendButtonAddMoreFieldEvent = (shouldContinue) => {
    if (modalType === "attribute" && forTarget === "contentType" && attributeType !== "dynamiczone" && shouldContinue) {
      trackUsage("willAddMoreFieldToContentType");
    }
  };
  const shouldDisableAdvancedTab = () => {
    if (modalType === "editCategory") {
      return true;
    }
    if (modalType === "component") {
      return true;
    }
    if (has__default.default(modifiedData, "createComponent")) {
      return true;
    }
    return false;
  };
  const displayedAttributes = getAttributesToDisplay(
    forTarget,
    targetUid,
    // We need the nested components so we know when to remove the component option
    nestedComponents
  );
  if (!modalType) {
    return null;
  }
  const formToDisplay = get__default.default(forms, [modalType, "form"], {
    advanced: () => ({
      sections: []
    }),
    base: () => ({
      sections: []
    })
  });
  const isAddingAComponentToAnotherComponent = forTarget === "components" || forTarget === "component";
  const genericInputProps = {
    customInputs: {
      "allowed-types-select": AllowedTypesSelect,
      "boolean-radio-group": BooleanRadioGroup,
      "checkbox-with-number-field": CheckboxWithNumberField,
      "icon-picker": IconPicker,
      "content-type-radio-group": ContentTypeRadioGroup,
      "radio-group": CustomRadioGroup,
      relation: Relation,
      "select-category": SelectCategory,
      "select-component": SelectComponent,
      "select-components": SelectComponents,
      "select-default-boolean": BooleanDefaultValueSelect,
      "select-number": SelectNumber,
      "select-date": SelectDateType,
      "toggle-draft-publish": DraftAndPublishToggle,
      "text-plural": PluralName,
      "text-singular": SingularName,
      "textarea-enum": TextareaEnum,
      ...inputsFromPlugins
    },
    componentToCreate,
    dynamicZoneTarget,
    formErrors,
    isAddingAComponentToAnotherComponent,
    isCreatingComponentWhileAddingAField,
    mainBoxHeader: get__default.default(allDataSchema, [...pathToSchema, "schema", "displayName"], ""),
    modifiedData,
    naturePickerType: forTarget,
    isCreating,
    targetUid,
    forTarget
  };
  const advancedForm2 = formToDisplay.advanced({
    data: modifiedData,
    type: attributeType,
    step,
    actionType,
    attributes,
    extensions: ctbFormsAPI,
    forTarget,
    contentTypeSchema: allDataSchema.contentType || {},
    customField
  }).sections;
  const baseForm2 = formToDisplay.base({
    data: modifiedData,
    type: attributeType,
    step,
    actionType,
    attributes,
    extensions: ctbFormsAPI,
    forTarget,
    contentTypeSchema: allDataSchema.contentType || {},
    customField
  }).sections;
  const baseFormInputNames = getFormInputNames(baseForm2);
  const advancedFormInputNames = getFormInputNames(advancedForm2);
  const doesBaseFormHasError = Object.keys(formErrors).some(
    (key) => baseFormInputNames.includes(key)
  );
  const doesAdvancedFormHasError = Object.keys(formErrors).some(
    (key) => advancedFormInputNames.includes(key)
  );
  const schemaKind = get__default.default(contentTypes, [targetUid, "schema", "kind"]);
  const checkIsEditingFieldName = () => actionType === "edit" && attributes.every(({ name }) => name !== modifiedData?.name);
  const handleClickFinish = () => {
    if (checkIsEditingFieldName()) {
      trackUsage("didEditFieldNameOnContentType");
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Modal.Root, { open: isOpen, onOpenChange: handleClosed, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Modal.Content, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      FormModalHeader,
      {
        actionType,
        attributeName,
        categoryName,
        contentTypeKind: kind,
        dynamicZoneTarget,
        modalType,
        forTarget,
        targetUid,
        attributeType,
        customFieldUid,
        showBackLink
      }
    ),
    isPickingAttribute && /* @__PURE__ */ jsxRuntime.jsx(
      AttributeOptions,
      {
        attributes: displayedAttributes,
        forTarget,
        kind: schemaKind || "collectionType"
      }
    ),
    !isPickingAttribute && /* @__PURE__ */ jsxRuntime.jsxs(FormComponent, { onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Modal.Body, { children: /* @__PURE__ */ jsxRuntime.jsxs(
        designSystem.Tabs.Root,
        {
          variant: "simple",
          value: activeTab,
          onValueChange: (value) => {
            setActiveTab(value);
            sendAdvancedTabEvent(value);
          },
          hasError: doesBaseFormHasError ? "basic" : doesAdvancedFormHasError ? "advanced" : void 0,
          children: [
            /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { justifyContent: "space-between", children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                FormModalSubHeader,
                {
                  actionType,
                  forTarget,
                  kind,
                  step,
                  modalType,
                  attributeType,
                  attributeName,
                  customField
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Tabs.List, { children: [
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tabs.Trigger, { value: "basic", children: formatMessage({
                  id: getTrad("popUpForm.navContainer.base"),
                  defaultMessage: "Basic settings"
                }) }),
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tabs.Trigger, { value: "advanced", disabled: shouldDisableAdvancedTab(), children: formatMessage({
                  id: getTrad("popUpForm.navContainer.advanced"),
                  defaultMessage: "Advanced settings"
                }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Divider, { marginBottom: 6 }),
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tabs.Content, { value: "basic", children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { direction: "column", alignItems: "stretch", gap: 6, children: /* @__PURE__ */ jsxRuntime.jsx(
              TabForm,
              {
                form: baseForm2,
                formErrors,
                genericInputProps,
                modifiedData,
                onChange: handleChange
              }
            ) }) }),
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tabs.Content, { value: "advanced", children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { direction: "column", alignItems: "stretch", gap: 6, children: /* @__PURE__ */ jsxRuntime.jsx(
              TabForm,
              {
                form: advancedForm2,
                formErrors,
                genericInputProps,
                modifiedData,
                onChange: handleChange
              }
            ) }) })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Modal.Footer, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { variant: "tertiary", onClick: handleClosed, children: formatMessage({ id: "app.components.Button.cancel", defaultMessage: "Cancel" }) }),
        /* @__PURE__ */ jsxRuntime.jsx(
          FormModalEndActions,
          {
            deleteCategory,
            deleteContentType: deleteData,
            deleteComponent: deleteData,
            categoryName: initialData.name,
            isAttributeModal: modalType === "attribute",
            isCustomFieldModal: modalType === "customField",
            isComponentToDzModal: modalType === "addComponentToDynamicZone",
            isComponentAttribute: attributeType === "component",
            isComponentModal: modalType === "component",
            isContentTypeModal: modalType === "contentType",
            isCreatingComponent: actionType === "create",
            isCreatingDz: actionType === "create",
            isCreatingComponentAttribute: modifiedData.createComponent || false,
            isCreatingComponentInDz: modifiedData.createComponent || false,
            isCreatingComponentWhileAddingAField,
            isCreatingContentType: actionType === "create",
            isEditingAttribute: actionType === "edit",
            isDzAttribute: attributeType === "dynamiczone",
            isEditingCategory: modalType === "editCategory",
            isInFirstComponentStep: step === "1",
            onSubmitAddComponentAttribute: handleSubmit,
            onSubmitAddComponentToDz: handleSubmit,
            onSubmitCreateComponent: handleSubmit,
            onSubmitCreateContentType: handleSubmit,
            onSubmitCreateDz: handleSubmit,
            onSubmitEditAttribute: handleSubmit,
            onSubmitEditCategory: handleSubmit,
            onSubmitEditComponent: handleSubmit,
            onSubmitEditContentType: handleSubmit,
            onSubmitEditCustomFieldAttribute: handleSubmit,
            onSubmitEditDz: handleSubmit,
            onClickFinish: handleClickFinish
          }
        )
      ] })
    ] })
  ] }) });
};
const dataManagerProviderDomain = () => (state) => state[`${index$1.pluginId}_dataManagerProvider`] || index$1.initialState$1;
const makeSelectDataManagerProvider = () => toolkit.createSelector(dataManagerProviderDomain(), (substate) => {
  return substate;
});
const getCreatedAndModifiedComponents = (allComponents, initialComponents) => {
  const componentUIDsToReturn = Object.keys(allComponents).filter((compoUid) => {
    const currentCompo = get__default.default(allComponents, compoUid, {});
    const initialCompo = get__default.default(initialComponents, compoUid, {});
    const hasComponentBeenCreated = get__default.default(currentCompo, ["isTemporary"], false);
    const hasComponentBeenModified = !isEqual__default.default(currentCompo, initialCompo);
    return hasComponentBeenCreated || hasComponentBeenModified;
  });
  return index$1.makeUnique(componentUIDsToReturn);
};
const formatComponent = (component, mainDataUID) => {
  const formattedAttributes = formatAttributes(
    get__default.default(component, "schema.attributes", []),
    mainDataUID
  );
  const compoUID = get__default.default(component, "isTemporary", false) ? { tmpUID: component.uid } : { uid: component.uid };
  const formattedComponent = Object.assign(
    {},
    compoUID,
    { category: component.category },
    // Omit the attributes since we want to format them
    omit__default.default(component.schema, "attributes"),
    // Add the formatted attributes
    { attributes: formattedAttributes }
  );
  return formattedComponent;
};
const formatMainDataType = (data, isComponent = false) => {
  const mainDataUID = get__default.default(data, "uid", null);
  const formattedAttributes = formatAttributes(get__default.default(data, "schema.attributes", []), mainDataUID);
  const initObj = isComponent ? { category: get__default.default(data, "category", "") } : {};
  const formattedContentType = Object.assign(initObj, omit__default.default(data.schema, "attributes"), {
    attributes: formattedAttributes
  });
  delete formattedContentType.uid;
  delete formattedContentType.isTemporary;
  delete formattedContentType.visible;
  delete formattedContentType.restrictRelationsTo;
  return formattedContentType;
};
const formatAttributes = (attributes, mainDataUID) => {
  return attributes.reduce((acc, { name, ...rest }) => {
    const currentAttribute = rest;
    const hasARelationWithMainDataUID = currentAttribute.target === mainDataUID;
    const isRelationType = currentAttribute.type === "relation";
    const currentTargetAttribute = get__default.default(currentAttribute, "targetAttribute", null);
    if (!hasARelationWithMainDataUID) {
      if (isRelationType) {
        const relationAttr = Object.assign({}, currentAttribute, {
          targetAttribute: formatRelationTargetAttribute(currentTargetAttribute)
        });
        acc[name] = removeNullKeys(relationAttr);
      } else {
        acc[name] = removeNullKeys(currentAttribute);
      }
    }
    if (hasARelationWithMainDataUID) {
      const target = currentAttribute.target;
      const formattedRelationAttribute = Object.assign({}, currentAttribute, {
        target,
        targetAttribute: formatRelationTargetAttribute(currentTargetAttribute)
      });
      acc[name] = removeNullKeys(formattedRelationAttribute);
    }
    if (currentAttribute.customField) {
      const customFieldAttribute = { ...currentAttribute, type: "customField" };
      acc[name] = removeNullKeys(customFieldAttribute);
    }
    return acc;
  }, {});
};
const formatRelationTargetAttribute = (targetAttribute) => targetAttribute === "-" ? null : targetAttribute;
const removeNullKeys = (obj) => Object.keys(obj).reduce((acc, current) => {
  if (obj[current] !== null && current !== "plugin") {
    acc[current] = obj[current];
  }
  return acc;
}, {});
const getComponentsToPost = (allComponents, initialComponents, mainDataUID) => {
  const componentsToFormat = getCreatedAndModifiedComponents(allComponents, initialComponents);
  const formattedComponents = componentsToFormat.map((compoUID) => {
    const currentCompo = get__default.default(allComponents, compoUID, {});
    const formattedComponent = formatComponent(currentCompo, mainDataUID);
    return formattedComponent;
  });
  return formattedComponents;
};
const sortContentType = (types) => sortBy__default.default(
  Object.keys(types).map((uid) => ({
    visible: types[uid].schema.visible,
    name: uid,
    title: types[uid].schema.displayName,
    plugin: types[uid].plugin || null,
    uid,
    to: `/plugins/${index$1.pluginId}/content-types/${uid}`,
    kind: types[uid].schema.kind,
    restrictRelationsTo: types[uid].schema.restrictRelationsTo
  })).filter((obj) => obj !== null),
  (obj) => camelCase__default.default(obj.title)
);
const createDataObject = (arr) => arr.reduce((acc, current) => {
  acc[current.uid] = current;
  return acc;
}, {});
const createModifiedDataSchema = (contentTypeSchema, retrievedComponents, allComponentsSchema, isInContentTypeView) => {
  const componentsAssociatedToContentType = retrievedComponents.reduce((acc, current) => {
    const componentSchema = get__default.default(allComponentsSchema, current, {});
    acc[current] = componentSchema;
    return acc;
  }, {});
  const keyName = isInContentTypeView ? "contentType" : "component";
  const schema = {
    [keyName]: contentTypeSchema,
    components: componentsAssociatedToContentType
  };
  return schema;
};
const formatSchemas = (schemas) => {
  return Object.keys(schemas).reduce((acc, current) => {
    const schema = schemas[current].schema;
    acc[current] = {
      ...schemas[current],
      schema: { ...schema, attributes: toAttributesArray(schema.attributes) }
    };
    return acc;
  }, {});
};
const toAttributesArray = (attributes) => {
  return Object.keys(attributes).reduce((acc, current) => {
    acc.push({ ...attributes[current], name: current });
    return acc;
  }, []);
};
const retrieveComponentsThatHaveComponents = (allComponents) => {
  const componentsThatHaveNestedComponents = Object.keys(allComponents).reduce(
    (acc, current) => {
      const currentComponent = get__default.default(allComponents, [current]);
      const compoWithChildren = getComponentWithChildComponents(currentComponent);
      if (compoWithChildren.childComponents.length > 0) {
        acc.push(compoWithChildren);
      }
      return acc;
    },
    []
  );
  return componentsThatHaveNestedComponents;
};
const getComponentWithChildComponents = (component) => {
  const attributes = get__default.default(component, ["schema", "attributes"], []);
  return {
    component: component.uid,
    childComponents: attributes.filter((attribute) => {
      const { type } = attribute;
      return type === "component";
    }).map((attribute) => {
      return {
        component: attribute.component
      };
    })
  };
};
const retrieveNestedComponents = (appComponents) => {
  const nestedComponents = Object.keys(appComponents).reduce((acc, current) => {
    const componentAttributes = appComponents?.[current]?.schema?.attributes ?? [];
    const currentComponentNestedCompos = getComponentsNestedWithinComponent(
      componentAttributes,
      current
    );
    return [...acc, ...currentComponentNestedCompos];
  }, []);
  return mergeComponents(nestedComponents);
};
const getComponentsNestedWithinComponent = (componentAttributes, parentCompoUid) => {
  return componentAttributes.reduce((acc, current) => {
    const { type, component } = current;
    if (type === "component") {
      acc.push({
        component,
        parentCompoUid
      });
    }
    return acc;
  }, []);
};
const mergeComponents = (originalComponents) => {
  const componentMap = /* @__PURE__ */ new Map();
  originalComponents.forEach(({ component, parentCompoUid }) => {
    if (!componentMap.has(component)) {
      componentMap.set(component, /* @__PURE__ */ new Set());
    }
    componentMap.get(component).add(parentCompoUid);
  });
  const transformedComponents = Array.from(componentMap.entries()).map(
    ([component, parentCompoUidSet]) => ({
      component,
      uidsOfAllParents: Array.from(parentCompoUidSet)
    })
  );
  return transformedComponents;
};
const retrieveSpecificInfoFromComponents = (allComponents, keysToRetrieve) => {
  const allData = Object.keys(allComponents).map((compo) => {
    return get__default.default(allComponents, [compo, ...keysToRetrieve], "");
  });
  return index$1.makeUnique(allData);
};
const SERVER_HAS_NOT_BEEN_KILLED_MESSAGE = "did-not-kill-server";
const SERVER_HAS_BEEN_KILLED_MESSAGE = "server is down";
function serverRestartWatcher(response, didShutDownServer) {
  return new Promise((resolve) => {
    fetch(`${window.strapi.backendURL}/_health`, {
      method: "HEAD",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
        "Keep-Alive": "false"
      }
    }).then((res) => {
      if (res.status >= 400) {
        throw new Error(SERVER_HAS_BEEN_KILLED_MESSAGE);
      }
      if (!didShutDownServer) {
        throw new Error(SERVER_HAS_NOT_BEEN_KILLED_MESSAGE);
      }
      resolve(response);
    }).catch((err) => {
      setTimeout(() => {
        return serverRestartWatcher(
          response,
          err.message !== SERVER_HAS_NOT_BEEN_KILLED_MESSAGE
        ).then(resolve);
      }, 100);
    });
  });
}
const validateSchema = (schema) => {
  const dynamicZoneAttributes = Object.values(schema.attributes).filter(
    (attribute) => attribute.type === "dynamiczone"
  );
  return dynamicZoneAttributes.every(
    (attribute) => Array.isArray(attribute.components) && attribute.components.length > 0
  );
};
const DataManagerProvider = ({ children }) => {
  const dispatch = reactRedux.useDispatch();
  const {
    components,
    contentTypes,
    isLoading,
    isLoadingForDataToBeSet,
    initialData,
    modifiedData,
    reservedNames
  } = reactRedux.useSelector(makeSelectDataManagerProvider());
  const { toggleNotification } = strapiAdmin.useNotification();
  const { lockAppWithAutoreload, unlockAppWithAutoreload } = index$1.useAutoReloadOverlayBlocker();
  const { setCurrentStep, setStepState } = strapiAdmin.useGuidedTour("DataManagerProvider", (state) => state);
  const getPlugin = strapiAdmin.useStrapiApp("DataManagerProvider", (state) => state.getPlugin);
  const plugin = getPlugin(index$1.pluginId);
  const autoReload = strapiAdmin.useAppInfo("DataManagerProvider", (state) => state.autoReload);
  const { formatMessage } = reactIntl.useIntl();
  const { trackUsage } = strapiAdmin.useTracking();
  const refetchPermissions = strapiAdmin.useAuth("DataManagerProvider", (state) => state.refetchPermissions);
  const { pathname } = reactRouterDom.useLocation();
  const { onCloseModal } = useFormModalNavigation();
  const contentTypeMatch = reactRouterDom.useMatch(`/plugins/${index$1.pluginId}/content-types/:uid`);
  const componentMatch = reactRouterDom.useMatch(
    `/plugins/${index$1.pluginId}/component-categories/:categoryUid/:componentUid`
  );
  const fetchClient = strapiAdmin.useFetchClient();
  const { put, post, del } = fetchClient;
  const formatMessageRef = React.useRef();
  formatMessageRef.current = formatMessage;
  const isInDevelopmentMode = autoReload;
  const isInContentTypeView = contentTypeMatch !== null;
  const firstKeyToMainSchema = isInContentTypeView ? "contentType" : "component";
  const currentUid = isInContentTypeView ? get__default.default(contentTypeMatch, "params.uid", null) : get__default.default(componentMatch, "params.componentUid", null);
  const getDataRef = React.useRef();
  const endPoint = isInContentTypeView ? "content-types" : "components";
  getDataRef.current = async () => {
    try {
      const [
        {
          data: { data: componentsArray }
        },
        {
          data: { data: contentTypesArray }
        },
        { data: reservedNames2 }
      ] = await Promise.all(
        ["components", "content-types", "reserved-names"].map((endPoint2) => {
          return fetchClient.get(`/${index$1.pluginId}/${endPoint2}`);
        })
      );
      const components2 = createDataObject(componentsArray);
      const formattedComponents = formatSchemas(components2);
      const contentTypes2 = createDataObject(contentTypesArray);
      const formattedContentTypes = formatSchemas(contentTypes2);
      dispatch({
        type: index$1.GET_DATA_SUCCEEDED,
        components: formattedComponents,
        contentTypes: formattedContentTypes,
        reservedNames: reservedNames2
      });
    } catch (err) {
      console.error({ err });
      toggleNotification({
        type: "danger",
        message: formatMessage({ id: "notification.error", defaultMessage: "An error occurred" })
      });
    }
  };
  React.useEffect(() => {
    getDataRef.current();
    return () => {
      dispatch({ type: index$1.RELOAD_PLUGIN });
    };
  }, []);
  React.useEffect(() => {
    if (!isLoading && currentUid) {
      setModifiedData();
    }
  }, [isLoading, pathname, currentUid]);
  React.useEffect(() => {
    if (!autoReload) {
      toggleNotification({
        type: "info",
        message: formatMessage({ id: getTrad("notification.info.autoreaload-disable") })
      });
    }
  }, [autoReload, toggleNotification]);
  const addAttribute = (attributeToSet, forTarget, targetUid, isEditing = false, initialAttribute, shouldAddComponentToData = false) => {
    const actionType = isEditing ? index$1.EDIT_ATTRIBUTE : index$1.ADD_ATTRIBUTE;
    dispatch({
      type: actionType,
      attributeToSet,
      forTarget,
      targetUid,
      initialAttribute,
      shouldAddComponentToData
    });
  };
  const addCustomFieldAttribute = ({
    attributeToSet,
    forTarget,
    targetUid,
    initialAttribute
  }) => {
    dispatch({
      type: index$1.ADD_CUSTOM_FIELD_ATTRIBUTE,
      attributeToSet,
      forTarget,
      targetUid,
      initialAttribute
    });
  };
  const editCustomFieldAttribute = ({
    attributeToSet,
    forTarget,
    targetUid,
    initialAttribute
  }) => {
    dispatch({
      type: index$1.EDIT_CUSTOM_FIELD_ATTRIBUTE,
      attributeToSet,
      forTarget,
      targetUid,
      initialAttribute
    });
  };
  const addCreatedComponentToDynamicZone = (dynamicZoneTarget, componentsToAdd) => {
    dispatch({
      type: index$1.ADD_CREATED_COMPONENT_TO_DYNAMIC_ZONE,
      dynamicZoneTarget,
      componentsToAdd
    });
  };
  const createSchema = (data, schemaType, uid, componentCategory, shouldAddComponentToData = false) => {
    const type = schemaType === "contentType" ? index$1.CREATE_SCHEMA : index$1.CREATE_COMPONENT_SCHEMA;
    dispatch({
      type,
      data,
      componentCategory,
      schemaType,
      uid,
      shouldAddComponentToData
    });
  };
  const changeDynamicZoneComponents = (dynamicZoneTarget, newComponents) => {
    dispatch({
      type: index$1.CHANGE_DYNAMIC_ZONE_COMPONENTS,
      dynamicZoneTarget,
      newComponents
    });
  };
  const removeAttribute = (mainDataKey, attributeToRemoveName, componentUid = "") => {
    const type = mainDataKey === "components" ? index$1.REMOVE_FIELD_FROM_DISPLAYED_COMPONENT : index$1.REMOVE_FIELD;
    if (mainDataKey === "contentType") {
      trackUsage("willDeleteFieldOfContentType");
    }
    dispatch({
      type,
      mainDataKey,
      attributeToRemoveName,
      componentUid
    });
  };
  const deleteCategory = async (categoryUid) => {
    try {
      const requestURL = `/${index$1.pluginId}/component-categories/${categoryUid}`;
      const userConfirm = window.confirm(
        formatMessage({
          id: getTrad("popUpWarning.bodyMessage.category.delete")
        })
      );
      onCloseModal();
      if (userConfirm) {
        lockAppWithAutoreload?.();
        await del(requestURL);
        await serverRestartWatcher(true);
        unlockAppWithAutoreload?.();
        await updatePermissions();
      }
    } catch (err) {
      console.error({ err });
      toggleNotification({
        type: "danger",
        message: formatMessage({ id: "notification.error", defaultMessage: "An error occurred" })
      });
    } finally {
      unlockAppWithAutoreload?.();
    }
  };
  const deleteData = async () => {
    try {
      const requestURL = `/${index$1.pluginId}/${endPoint}/${currentUid}`;
      const isTemporary = get__default.default(modifiedData, [firstKeyToMainSchema, "isTemporary"], false);
      const userConfirm = window.confirm(
        formatMessage({
          id: getTrad(
            `popUpWarning.bodyMessage.${isInContentTypeView ? "contentType" : "component"}.delete`
          )
        })
      );
      onCloseModal();
      if (userConfirm) {
        if (isTemporary) {
          dispatch({ type: index$1.DELETE_NOT_SAVED_TYPE });
          return;
        }
        lockAppWithAutoreload?.();
        await del(requestURL);
        await serverRestartWatcher(true);
        await unlockAppWithAutoreload?.();
        await updatePermissions();
      }
    } catch (err) {
      console.error({ err });
      toggleNotification({
        type: "danger",
        message: formatMessage({ id: "notification.error", defaultMessage: "An error occurred" })
      });
    } finally {
      unlockAppWithAutoreload?.();
    }
  };
  const editCategory = async (categoryUid, body) => {
    try {
      const requestURL = `/${index$1.pluginId}/component-categories/${categoryUid}`;
      onCloseModal();
      lockAppWithAutoreload?.();
      await put(requestURL, body);
      await serverRestartWatcher(true);
      await unlockAppWithAutoreload?.();
      await updatePermissions();
    } catch (err) {
      console.error({ err });
      toggleNotification({
        type: "danger",
        message: formatMessage({ id: "notification.error", defaultMessage: "An error occurred" })
      });
    } finally {
      unlockAppWithAutoreload?.();
    }
  };
  const getAllComponentsThatHaveAComponentInTheirAttributes = () => {
    const allCompos = Object.assign({}, components, modifiedData.components);
    if (!isInContentTypeView) {
      const currentEditedCompo = get__default.default(modifiedData, "component", {});
      set__default.default(allCompos, get__default.default(currentEditedCompo, ["uid"], ""), currentEditedCompo);
    }
    const composWithCompos = retrieveComponentsThatHaveComponents(allCompos);
    return composWithCompos;
  };
  const getAllNestedComponents = () => {
    const appNestedCompo = retrieveNestedComponents(components);
    return appNestedCompo;
  };
  const removeComponentFromDynamicZone = (dzName, componentToRemoveIndex) => {
    dispatch({
      type: index$1.REMOVE_COMPONENT_FROM_DYNAMIC_ZONE,
      dzName,
      componentToRemoveIndex
    });
  };
  const setModifiedData = () => {
    const currentSchemas = isInContentTypeView ? contentTypes : components;
    const schemaToSet = get__default.default(currentSchemas, currentUid ?? "", {
      schema: { attributes: [] }
    });
    const retrievedComponents = index$1.retrieveComponentsFromSchema(
      schemaToSet.schema.attributes,
      components
    );
    const newSchemaToSet = createModifiedDataSchema(
      schemaToSet,
      retrievedComponents,
      components,
      isInContentTypeView
    );
    const hasJustCreatedSchema = get__default.default(schemaToSet, "isTemporary", false) && size__default.default(get__default.default(schemaToSet, "schema.attributes", [])) === 0;
    dispatch({
      type: index$1.SET_MODIFIED_DATA,
      schemaToSet: newSchemaToSet,
      hasJustCreatedSchema
    });
  };
  const shouldRedirect = React.useMemo(() => {
    const dataSet = isInContentTypeView ? contentTypes : components;
    if (currentUid === "create-content-type") {
      return false;
    }
    return !Object.keys(dataSet).includes(currentUid || "") && !isLoading;
  }, [components, contentTypes, currentUid, isInContentTypeView, isLoading]);
  const redirectEndpoint = React.useMemo(() => {
    const allowedEndpoints = Object.keys(contentTypes).filter((uid) => get__default.default(contentTypes, [uid, "schema", "visible"], true)).sort();
    return get__default.default(allowedEndpoints, "0", "create-content-type");
  }, [contentTypes]);
  if (shouldRedirect) {
    return /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Navigate, { to: `/plugins/${index$1.pluginId}/content-types/${redirectEndpoint}` });
  }
  const submitData = async (additionalContentTypeData) => {
    try {
      const isCreating = get__default.default(modifiedData, [firstKeyToMainSchema, "isTemporary"], false);
      const body = {
        components: getComponentsToPost(
          modifiedData.components,
          components,
          currentUid
        )
      };
      if (isInContentTypeView) {
        const PluginForms = plugin?.apis?.forms;
        const contentType = PluginForms.mutateContentTypeSchema(
          {
            ...formatMainDataType(modifiedData.contentType),
            ...additionalContentTypeData
          },
          initialData.contentType
        );
        const isValidSchema = validateSchema(contentType);
        if (!isValidSchema) {
          toggleNotification({
            type: "danger",
            message: formatMessage({
              id: getTrad("notification.error.dynamiczone-min.validation"),
              defaultMessage: "At least one component is required in a dynamic zone to be able to save a content type"
            })
          });
          return;
        }
        body.contentType = contentType;
        trackUsage("willSaveContentType");
      } else {
        body.component = formatMainDataType(modifiedData.component, true);
        trackUsage("willSaveComponent");
      }
      lockAppWithAutoreload?.();
      const baseURL = `/${index$1.pluginId}/${endPoint}`;
      const requestURL = isCreating ? baseURL : `${baseURL}/${currentUid}`;
      if (isCreating) {
        await post(requestURL, body);
      } else {
        await put(requestURL, body);
      }
      if (isCreating && (initialData.contentType?.schema.kind === "collectionType" || initialData.contentType?.schema.kind === "singleType")) {
        setStepState("contentTypeBuilder.success", true);
        trackUsage("didCreateGuidedTourCollectionType");
        setCurrentStep(null);
      }
      if (isInContentTypeView) {
        trackUsage("didSaveContentType");
        const oldName = get__default.default(body, ["contentType", "schema", "name"], "");
        const newName = get__default.default(initialData, ["contentType", "schema", "name"], "");
        if (!isCreating && oldName !== newName) {
          trackUsage("didEditNameOfContentType");
        }
      } else {
        trackUsage("didSaveComponent");
      }
      await serverRestartWatcher(true);
      unlockAppWithAutoreload?.();
      await getDataRef.current();
      dispatch({ type: index$1.UPDATE_INITIAL_STATE });
      await updatePermissions();
    } catch (err) {
      if (!isInContentTypeView) {
        trackUsage("didNotSaveComponent");
      }
      console.error({ err: err.response });
      toggleNotification({
        type: "danger",
        message: formatMessage({ id: "notification.error", defaultMessage: "An error occurred" })
      });
    } finally {
      unlockAppWithAutoreload?.();
    }
  };
  const updatePermissions = async () => {
    await refetchPermissions();
  };
  const updateSchema = (data, schemaType, componentUID) => {
    dispatch({
      type: index$1.UPDATE_SCHEMA,
      data,
      schemaType,
      uid: componentUID
    });
  };
  return /* @__PURE__ */ jsxRuntime.jsx(
    DataManagerContext.Provider,
    {
      value: {
        addAttribute,
        addCustomFieldAttribute,
        addCreatedComponentToDynamicZone,
        allComponentsCategories: retrieveSpecificInfoFromComponents(components, ["category"]),
        changeDynamicZoneComponents,
        components,
        componentsGroupedByCategory: groupBy__default.default(components, "category"),
        componentsThatHaveOtherComponentInTheirAttributes: getAllComponentsThatHaveAComponentInTheirAttributes(),
        contentTypes,
        createSchema,
        deleteCategory,
        deleteData,
        editCategory,
        editCustomFieldAttribute,
        isInDevelopmentMode,
        initialData,
        isInContentTypeView,
        modifiedData,
        nestedComponents: getAllNestedComponents(),
        removeAttribute,
        removeComponentFromDynamicZone,
        reservedNames,
        setModifiedData,
        sortedContentTypesList: sortContentType(contentTypes),
        submitData,
        updateSchema
      },
      children: isLoadingForDataToBeSet ? /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Page.Loading, {}) : /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        children,
        isInDevelopmentMode && /* @__PURE__ */ jsxRuntime.jsx(FormModal, {})
      ] })
    }
  );
};
const DataManagerProvider$1 = React.memo(DataManagerProvider);
const INITIAL_STATE_DATA = {
  actionType: null,
  attributeName: null,
  attributeType: null,
  categoryName: null,
  dynamicZoneTarget: null,
  forTarget: null,
  modalType: null,
  isOpen: false,
  showBackLink: false,
  kind: null,
  step: null,
  targetUid: null,
  customFieldUid: null,
  activeTab: "basic"
};
const FormModalNavigationProvider = ({ children }) => {
  const [state, setFormModalNavigationState] = React__namespace.useState(INITIAL_STATE_DATA);
  const { trackUsage } = strapiAdmin.useTracking();
  const onClickSelectCustomField = ({ attributeType, customFieldUid }) => {
    setFormModalNavigationState((prevState) => {
      return {
        ...prevState,
        actionType: "create",
        modalType: "customField",
        attributeType,
        customFieldUid,
        activeTab: "basic"
      };
    });
  };
  const onClickSelectField = ({ attributeType, step }) => {
    if (state.forTarget === "contentType") {
      trackUsage("didSelectContentTypeFieldType", { type: attributeType });
    }
    setFormModalNavigationState((prevState) => {
      return {
        ...prevState,
        actionType: "create",
        modalType: "attribute",
        step,
        attributeType,
        showBackLink: true,
        activeTab: "basic"
      };
    });
  };
  const onOpenModalAddComponentsToDZ = ({ dynamicZoneTarget, targetUid }) => {
    setFormModalNavigationState((prevState) => {
      return {
        ...prevState,
        dynamicZoneTarget,
        targetUid,
        modalType: "addComponentToDynamicZone",
        forTarget: "contentType",
        step: "1",
        actionType: "edit",
        isOpen: true
      };
    });
  };
  const onOpenModalAddField = ({ forTarget, targetUid }) => {
    setFormModalNavigationState((prevState) => {
      return {
        ...prevState,
        actionType: "create",
        forTarget,
        targetUid,
        modalType: "chooseAttribute",
        isOpen: true,
        showBackLink: false,
        activeTab: "basic"
      };
    });
  };
  const onOpenModalCreateSchema = (nextState) => {
    setFormModalNavigationState((prevState) => {
      return { ...prevState, ...nextState, isOpen: true, activeTab: "basic" };
    });
  };
  const onOpenModalEditCategory = (categoryName) => {
    setFormModalNavigationState((prevState) => {
      return {
        ...prevState,
        categoryName,
        actionType: "edit",
        modalType: "editCategory",
        isOpen: true,
        activeTab: "basic"
      };
    });
  };
  const onOpenModalEditCustomField = ({
    forTarget,
    targetUid,
    attributeName,
    attributeType,
    customFieldUid
  }) => {
    setFormModalNavigationState((prevState) => {
      return {
        ...prevState,
        modalType: "customField",
        customFieldUid,
        actionType: "edit",
        forTarget,
        targetUid,
        attributeName,
        attributeType,
        isOpen: true,
        activeTab: "basic"
      };
    });
  };
  const onOpenModalEditField = ({
    forTarget,
    targetUid,
    attributeName,
    attributeType,
    step
  }) => {
    setFormModalNavigationState((prevState) => {
      return {
        ...prevState,
        modalType: "attribute",
        actionType: "edit",
        forTarget,
        targetUid,
        attributeName,
        attributeType,
        step,
        isOpen: true
      };
    });
  };
  const onOpenModalEditSchema = ({ modalType, forTarget, targetUid, kind }) => {
    setFormModalNavigationState((prevState) => {
      return {
        ...prevState,
        modalType,
        actionType: "edit",
        forTarget,
        targetUid,
        kind,
        isOpen: true,
        activeTab: "basic"
      };
    });
  };
  const onCloseModal = () => {
    setFormModalNavigationState(INITIAL_STATE_DATA);
  };
  const onNavigateToChooseAttributeModal = ({ forTarget, targetUid }) => {
    setFormModalNavigationState((prev) => {
      return {
        ...prev,
        forTarget,
        targetUid,
        modalType: "chooseAttribute",
        activeTab: "basic"
      };
    });
  };
  const onNavigateToCreateComponentStep2 = () => {
    setFormModalNavigationState((prev) => {
      return {
        ...prev,
        attributeType: "component",
        modalType: "attribute",
        step: "2",
        activeTab: "basic"
      };
    });
  };
  const onNavigateToAddCompoToDZModal = ({ dynamicZoneTarget }) => {
    setFormModalNavigationState((prev) => {
      return {
        ...prev,
        dynamicZoneTarget,
        modalType: "addComponentToDynamicZone",
        actionType: "create",
        step: "1",
        attributeType: null,
        attributeName: null,
        activeTab: "basic"
      };
    });
  };
  const setActiveTab = (value) => {
    setFormModalNavigationState((prev) => {
      return {
        ...prev,
        activeTab: value
      };
    });
  };
  return /* @__PURE__ */ jsxRuntime.jsx(
    FormModalNavigationContext.Provider,
    {
      value: {
        ...state,
        onClickSelectField,
        onClickSelectCustomField,
        onCloseModal,
        onNavigateToChooseAttributeModal,
        onNavigateToAddCompoToDZModal,
        onOpenModalAddComponentsToDZ,
        onNavigateToCreateComponentStep2,
        onOpenModalAddField,
        onOpenModalCreateSchema,
        onOpenModalEditCategory,
        onOpenModalEditField,
        onOpenModalEditCustomField,
        onOpenModalEditSchema,
        setFormModalNavigationState,
        setActiveTab
      },
      children
    }
  );
};
const ListView$1 = React.lazy(() => Promise.resolve().then(() => require("./ListView-B8sInwpb.js")));
const RecursivePath = () => {
  return /* @__PURE__ */ jsxRuntime.jsx(React.Suspense, { fallback: /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Page.Loading, {}), children: /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Routes, { children: /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { path: `/:componentUid`, element: /* @__PURE__ */ jsxRuntime.jsx(ListView$1, {}) }) }) });
};
const ListView = React.lazy(() => Promise.resolve().then(() => require("./ListView-B8sInwpb.js")));
const App = () => {
  const { formatMessage } = reactIntl.useIntl();
  const title = formatMessage({
    id: `${index$1.pluginId}.plugin.name`,
    defaultMessage: "Content Types Builder"
  });
  const startSection = strapiAdmin.useGuidedTour("App", (state) => state.startSection);
  const startSectionRef = React.useRef(startSection);
  React.useEffect(() => {
    if (startSectionRef.current) {
      startSectionRef.current("contentTypeBuilder");
    }
  }, []);
  return /* @__PURE__ */ jsxRuntime.jsxs(strapiAdmin.Page.Protect, { permissions: index$1.PERMISSIONS.main, children: [
    /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Page.Title, { children: title }),
    /* @__PURE__ */ jsxRuntime.jsx(index$1.AutoReloadOverlayBlockerProvider, { children: /* @__PURE__ */ jsxRuntime.jsx(FormModalNavigationProvider, { children: /* @__PURE__ */ jsxRuntime.jsx(DataManagerProvider$1, { children: /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Layouts.Root, { sideNav: /* @__PURE__ */ jsxRuntime.jsx(ContentTypeBuilderNav, {}), children: /* @__PURE__ */ jsxRuntime.jsx(React.Suspense, { fallback: /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Page.Loading, {}), children: /* @__PURE__ */ jsxRuntime.jsxs(reactRouterDom.Routes, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { path: "content-types/:uid", element: /* @__PURE__ */ jsxRuntime.jsx(ListView, {}) }),
      /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { path: `component-categories/:categoryUid/*`, element: /* @__PURE__ */ jsxRuntime.jsx(RecursivePath, {}) })
    ] }) }) }) }) }) })
  ] });
};
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App
}, Symbol.toStringTag, { value: "Module" }));
exports.AttributeIcon = AttributeIcon;
exports.COMPONENT_ICONS = COMPONENT_ICONS;
exports.getTrad = getTrad;
exports.index = index;
exports.useDataManager = useDataManager;
exports.useFormModalNavigation = useFormModalNavigation;
//# sourceMappingURL=index-CD3IaMB6.js.map
