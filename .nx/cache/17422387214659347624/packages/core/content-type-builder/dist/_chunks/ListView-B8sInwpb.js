"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const strapiAdmin = require("@strapi/admin/strapi-admin");
const designSystem = require("@strapi/design-system");
const Icons = require("@strapi/icons");
const get = require("lodash/get");
const has = require("lodash/has");
const isEqual = require("lodash/isEqual");
const upperFirst = require("lodash/upperFirst");
const reactIntl = require("react-intl");
const reactRouterDom = require("react-router-dom");
const styledComponents = require("styled-components");
const React = require("react");
const Symbols = require("@strapi/icons/symbols");
const index = require("./index-CD3IaMB6.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const get__default = /* @__PURE__ */ _interopDefault(get);
const has__default = /* @__PURE__ */ _interopDefault(has);
const isEqual__default = /* @__PURE__ */ _interopDefault(isEqual);
const upperFirst__default = /* @__PURE__ */ _interopDefault(upperFirst);
const BoxWrapper$1 = styledComponents.styled(designSystem.Box)`
  table {
    width: 100%;
    white-space: nowrap;
  }

  thead {
    border-bottom: 1px solid ${({ theme }) => theme.colors.neutral150};

    tr {
      border-top: 0;
    }
  }

  tr {
    border-top: 1px solid ${({ theme }) => theme.colors.neutral150};

    & td,
    & th {
      padding: ${({ theme }) => theme.spaces[4]};
    }

    & td:first-of-type,
    & th:first-of-type {
      padding: 0 ${({ theme }) => theme.spaces[1]};
    }
  }

  th,
  td {
    vertical-align: middle;
    text-align: left;
    color: ${({ theme }) => theme.colors.neutral600};
    outline-offset: -4px;
  }
`;
const Tr = styledComponents.styled.tr`
  &.component-row,
  &.dynamiczone-row {
    position: relative;
    border-top: none !important;

    table tr:first-child {
      border-top: none;
    }

    > td:first-of-type {
      padding: 0 0 0 2rem;
      position: relative;

      &::before {
        content: '';
        width: 0.4rem;
        height: calc(100% - 40px);
        position: absolute;
        top: -7px;
        left: 2.6rem;
        border-radius: 4px;

        ${({ $isFromDynamicZone, $isChildOfDynamicZone, theme }) => {
  if ($isChildOfDynamicZone) {
    return `background-color: ${theme.colors.primary200};`;
  }
  if ($isFromDynamicZone) {
    return `background-color: ${theme.colors.primary200};`;
  }
  return `background: ${theme.colors.neutral150};`;
}}
      }
    }
  }

  &.dynamiczone-row > td:first-of-type {
    padding: 0;
  }
`;
const ComponentList = ({
  customRowComponent,
  component,
  isFromDynamicZone = false,
  isNestedInDZComponent = false,
  firstLoopComponentUid
}) => {
  const { modifiedData } = index.useDataManager();
  const {
    schema: { attributes }
  } = get__default.default(modifiedData, ["components", component], {
    schema: { attributes: [] }
  });
  return /* @__PURE__ */ jsxRuntime.jsx(Tr, { $isChildOfDynamicZone: isFromDynamicZone, className: "component-row", children: /* @__PURE__ */ jsxRuntime.jsx("td", { colSpan: 12, children: /* @__PURE__ */ jsxRuntime.jsx(
    List,
    {
      customRowComponent,
      items: attributes,
      targetUid: component,
      firstLoopComponentUid: firstLoopComponentUid || component,
      editTarget: "components",
      isFromDynamicZone,
      isNestedInDZComponent,
      isSub: true,
      secondLoopComponentUid: firstLoopComponentUid ? component : null
    }
  ) }) });
};
const ComponentIcon = ({ isActive = false, icon = "dashboard" }) => {
  const Icon = index.COMPONENT_ICONS[icon] || index.COMPONENT_ICONS.dashboard;
  return /* @__PURE__ */ jsxRuntime.jsx(
    designSystem.Flex,
    {
      alignItems: "center",
      background: isActive ? "primary200" : "neutral200",
      justifyContent: "center",
      height: 8,
      width: 8,
      borderRadius: "50%",
      children: /* @__PURE__ */ jsxRuntime.jsx(Icon, { height: "2rem", width: "2rem" })
    }
  );
};
const CloseButton = styledComponents.styled(designSystem.Box)`
  position: absolute;
  display: none;
  top: 5px;
  right: 0.8rem;

  svg {
    width: 1rem;
    height: 1rem;

    path {
      fill: ${({ theme }) => theme.colors.primary600};
    }
  }
`;
const ComponentBox = styledComponents.styled(designSystem.Flex)`
  width: 14rem;
  height: 8rem;
  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  background: ${({ theme }) => theme.colors.neutral100};
  border-radius: ${({ theme }) => theme.borderRadius};
  max-width: 100%;

  &.active,
  &:focus,
  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.primary200};
    background: ${({ theme }) => theme.colors.primary100};
    color: ${({ theme }) => theme.colors.primary600};

    ${CloseButton} {
      display: block;
    }

    /* > ComponentIcon */
    > div:first-child {
      background: ${({ theme }) => theme.colors.primary200};
      color: ${({ theme }) => theme.colors.primary600};

      svg {
        path {
          fill: ${({ theme }) => theme.colors.primary600};
        }
      }
    }
  }
`;
const ComponentCard = ({
  component,
  dzName,
  index: index$1,
  isActive = false,
  isInDevelopmentMode = false,
  onClick
}) => {
  const { modifiedData, removeComponentFromDynamicZone } = index.useDataManager();
  const {
    schema: { icon, displayName }
  } = get__default.default(modifiedData, ["components", component], { schema: {} });
  const onClose = (e) => {
    e.stopPropagation();
    removeComponentFromDynamicZone(dzName, index$1);
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(
    ComponentBox,
    {
      alignItems: "center",
      direction: "column",
      className: isActive ? "active" : "",
      borderRadius: "borderRadius",
      justifyContent: "center",
      paddingLeft: 4,
      paddingRight: 4,
      shrink: 0,
      onClick,
      role: "tab",
      tabIndex: isActive ? 0 : -1,
      cursor: "pointer",
      "aria-selected": isActive,
      "aria-controls": `dz-${dzName}-panel-${index$1}`,
      id: `dz-${dzName}-tab-${index$1}`,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(ComponentIcon, { icon, isActive }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { marginTop: 1, maxWidth: "100%", children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "pi", fontWeight: "bold", ellipsis: true, children: displayName }) }),
        isInDevelopmentMode && /* @__PURE__ */ jsxRuntime.jsx(CloseButton, { tag: "button", onClick: onClose, children: /* @__PURE__ */ jsxRuntime.jsx(Icons.Cross, {}) })
      ]
    }
  );
};
const StyledAddIcon = styledComponents.styled(Icons.Plus)`
  width: 3.2rem;
  height: 3.2rem;
  padding: 0.9rem;
  border-radius: 6.4rem;
  background: ${({ theme }) => theme.colors.primary100};
  path {
    fill: ${({ theme }) => theme.colors.primary600};
  }
`;
const FixedBox = styledComponents.styled(designSystem.Box)`
  height: 9rem;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
`;
const ScrollableStack = styledComponents.styled(designSystem.Flex)`
  width: 100%;
  overflow-x: auto;
`;
const ComponentContentBox = styledComponents.styled(designSystem.Box)`
  padding-top: 9rem;
`;
const ComponentStack = styledComponents.styled(designSystem.Flex)`
  flex-shrink: 0;
  width: 14rem;
  height: 8rem;
  justify-content: center;
  align-items: center;
`;
const DynamicZoneList = ({
  customRowComponent,
  components = [],
  addComponent,
  name,
  targetUid
}) => {
  const { isInDevelopmentMode } = index.useDataManager();
  const [activeTab, setActiveTab] = React.useState(0);
  const { formatMessage } = reactIntl.useIntl();
  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };
  const handleClickAdd = () => {
    addComponent(name);
  };
  return /* @__PURE__ */ jsxRuntime.jsx(Tr, { className: "dynamiczone-row", $isFromDynamicZone: true, children: /* @__PURE__ */ jsxRuntime.jsxs("td", { colSpan: 12, children: [
    /* @__PURE__ */ jsxRuntime.jsx(FixedBox, { paddingLeft: 8, children: /* @__PURE__ */ jsxRuntime.jsxs(ScrollableStack, { gap: 2, children: [
      isInDevelopmentMode && /* @__PURE__ */ jsxRuntime.jsx("button", { type: "button", onClick: handleClickAdd, children: /* @__PURE__ */ jsxRuntime.jsxs(ComponentStack, { direction: "column", alignItems: "stretch", gap: 1, children: [
        /* @__PURE__ */ jsxRuntime.jsx(StyledAddIcon, {}),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "pi", fontWeight: "bold", textColor: "primary600", children: formatMessage({
          id: index.getTrad("button.component.add"),
          defaultMessage: "Add a component"
        }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { role: "tablist", gap: 2, children: components.map((component, index2) => {
        return /* @__PURE__ */ jsxRuntime.jsx(
          ComponentCard,
          {
            dzName: name || "",
            index: index2,
            component,
            isActive: activeTab === index2,
            isInDevelopmentMode,
            onClick: () => toggle(index2)
          },
          component
        );
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsx(ComponentContentBox, { children: components.map((component, index2) => {
      const props = {
        customRowComponent,
        component
      };
      return /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Box,
        {
          id: `dz-${name}-panel-${index2}`,
          role: "tabpanel",
          "aria-labelledby": `dz-${name}-tab-${index2}`,
          style: { display: activeTab === index2 ? "block" : "none" },
          children: /* @__PURE__ */ jsxRuntime.jsx("table", { children: /* @__PURE__ */ jsxRuntime.jsx("tbody", { children: /* @__PURE__ */ React.createElement(
            ComponentList,
            {
              ...props,
              isFromDynamicZone: true,
              component: targetUid,
              key: component
            }
          ) }) })
        },
        component
      );
    }) })
  ] }) });
};
const IconBox = styledComponents.styled(designSystem.Box)`
  height: 2.4rem;
  width: 2.4rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    height: 1rem;
    width: 1rem;
  }

  svg path {
    fill: ${({ theme, color }) => theme.colors[`${color}600`]};
  }
`;
const ButtonBox = styledComponents.styled(designSystem.Box)`
  border-radius: 0 0 ${({ theme }) => theme.borderRadius} ${({ theme }) => theme.borderRadius};
  display: block;
  width: 100%;
  border: none;
  position: relative;
  left: -0.4rem;
`;
const NestedTFooter = ({ children, icon, color, ...props }) => {
  return /* @__PURE__ */ jsxRuntime.jsx(ButtonBox, { paddingBottom: 4, paddingTop: 4, tag: "button", type: "button", ...props, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(IconBox, { color, "aria-hidden": true, background: `${color}200`, children: icon }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingLeft: 3, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "pi", fontWeight: "bold", textColor: `${color}600`, children }) })
  ] }) });
};
const List = ({
  addComponentToDZ,
  customRowComponent,
  editTarget,
  firstLoopComponentUid,
  isFromDynamicZone = false,
  isMain = false,
  isNestedInDZComponent = false,
  isSub = false,
  items = [],
  secondLoopComponentUid,
  targetUid
}) => {
  const { formatMessage } = reactIntl.useIntl();
  const { trackUsage } = strapiAdmin.useTracking();
  const { isInDevelopmentMode, modifiedData, isInContentTypeView } = index.useDataManager();
  const { onOpenModalAddField } = index.useFormModalNavigation();
  const onClickAddField = () => {
    trackUsage("hasClickedCTBAddFieldBanner");
    onOpenModalAddField({ forTarget: editTarget, targetUid });
  };
  if (!targetUid) {
    return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Table, { colCount: 2, rowCount: 2, children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Thead, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Tr, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Th, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "sigma", textColor: "neutral600", children: formatMessage({ id: "global.name", defaultMessage: "Name" }) }) }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Th, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "sigma", textColor: "neutral600", children: formatMessage({ id: "global.type", defaultMessage: "Type" }) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tbody, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tr, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Td, { colSpan: 2, children: /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.EmptyStateLayout,
        {
          content: formatMessage({
            id: index.getTrad("table.content.create-first-content-type"),
            defaultMessage: "Create your first Collection-Type"
          }),
          hasRadius: true,
          icon: /* @__PURE__ */ jsxRuntime.jsx(Symbols.EmptyDocuments, { width: "16rem" })
        }
      ) }) }) })
    ] });
  }
  if (items.length === 0 && isMain) {
    return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Table, { colCount: 2, rowCount: 2, children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Thead, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Tr, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Th, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "sigma", textColor: "neutral600", children: formatMessage({ id: "global.name", defaultMessage: "Name" }) }) }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Th, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "sigma", textColor: "neutral600", children: formatMessage({ id: "global.type", defaultMessage: "Type" }) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tbody, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tr, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Td, { colSpan: 2, children: /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.EmptyStateLayout,
        {
          action: /* @__PURE__ */ jsxRuntime.jsx(
            designSystem.Button,
            {
              onClick: onClickAddField,
              size: "L",
              startIcon: /* @__PURE__ */ jsxRuntime.jsx(Icons.Plus, {}),
              variant: "secondary",
              children: formatMessage({
                id: index.getTrad("table.button.no-fields"),
                defaultMessage: "Add new field"
              })
            }
          ),
          content: formatMessage(
            isInContentTypeView ? {
              id: index.getTrad("table.content.no-fields.collection-type"),
              defaultMessage: "Add your first field to this Collection-Type"
            } : {
              id: index.getTrad("table.content.no-fields.component"),
              defaultMessage: "Add your first field to this component"
            }
          ),
          hasRadius: true,
          icon: /* @__PURE__ */ jsxRuntime.jsx(Symbols.EmptyDocuments, { width: "16rem" })
        }
      ) }) }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntime.jsxs(BoxWrapper$1, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.Box,
      {
        paddingLeft: 6,
        paddingRight: isMain ? 6 : 0,
        ...isMain && { style: { overflowX: "auto" } },
        children: /* @__PURE__ */ jsxRuntime.jsxs("table", { children: [
          isMain && /* @__PURE__ */ jsxRuntime.jsx("thead", { children: /* @__PURE__ */ jsxRuntime.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntime.jsx("th", { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "sigma", textColor: "neutral800", children: formatMessage({ id: "global.name", defaultMessage: "Name" }) }) }),
            /* @__PURE__ */ jsxRuntime.jsx("th", { colSpan: 2, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "sigma", textColor: "neutral800", children: formatMessage({ id: "global.type", defaultMessage: "Type" }) }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntime.jsx("tbody", { children: items.map((item) => {
            const { type } = item;
            const CustomRow = customRowComponent;
            return /* @__PURE__ */ jsxRuntime.jsxs(React.Fragment, { children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                CustomRow,
                {
                  ...item,
                  isNestedInDZComponent,
                  targetUid,
                  editTarget,
                  firstLoopComponentUid,
                  isFromDynamicZone,
                  secondLoopComponentUid
                }
              ),
              type === "component" && /* @__PURE__ */ jsxRuntime.jsx(
                ComponentList,
                {
                  ...item,
                  customRowComponent,
                  targetUid,
                  isNestedInDZComponent: isFromDynamicZone,
                  editTarget,
                  firstLoopComponentUid
                }
              ),
              type === "dynamiczone" && /* @__PURE__ */ jsxRuntime.jsx(
                DynamicZoneList,
                {
                  ...item,
                  customRowComponent,
                  addComponent: addComponentToDZ,
                  targetUid
                }
              )
            ] }, item.name);
          }) })
        ] })
      }
    ),
    isMain && isInDevelopmentMode && /* @__PURE__ */ jsxRuntime.jsx(designSystem.TFooter, { icon: /* @__PURE__ */ jsxRuntime.jsx(Icons.Plus, {}), onClick: onClickAddField, children: formatMessage({
      id: index.getTrad(
        `form.button.add.field.to.${modifiedData.contentType ? modifiedData.contentType.schema.kind : editTarget || "collectionType"}`
      ),
      defaultMessage: "Add another field"
    }) }),
    isSub && isInDevelopmentMode && !isFromDynamicZone && /* @__PURE__ */ jsxRuntime.jsx(
      NestedTFooter,
      {
        icon: /* @__PURE__ */ jsxRuntime.jsx(Icons.Plus, {}),
        onClick: onClickAddField,
        color: isFromDynamicZone ? "primary" : "neutral",
        children: formatMessage({
          id: index.getTrad(`form.button.add.field.to.component`),
          defaultMessage: "Add another field"
        })
      }
    )
  ] });
};
const StyledBox = styledComponents.styled(designSystem.Box)`
  position: absolute;
  left: -1.8rem;
  top: 0px;

  &:before {
    content: '';
    width: 0.4rem;
    height: 1.2rem;
    background: ${({ theme, color }) => theme.colors[color]};
    display: block;
  }
`;
const Svg = styledComponents.styled.svg`
  position: relative;
  flex-shrink: 0;
  transform: translate(-0.5px, -1px);

  * {
    fill: ${({ theme, color }) => theme.colors[color]};
  }
`;
const Curve = (props) => /* @__PURE__ */ jsxRuntime.jsx(StyledBox, { children: /* @__PURE__ */ jsxRuntime.jsx(
  Svg,
  {
    width: "20",
    height: "23",
    viewBox: "0 0 20 23",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: /* @__PURE__ */ jsxRuntime.jsx(
      "path",
      {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M7.02477 14.7513C8.65865 17.0594 11.6046 18.6059 17.5596 18.8856C18.6836 18.9384 19.5976 19.8435 19.5976 20.9688V20.9688C19.5976 22.0941 18.6841 23.0125 17.5599 22.9643C10.9409 22.6805 6.454 20.9387 3.75496 17.1258C0.937988 13.1464 0.486328 7.39309 0.486328 0.593262H4.50974C4.50974 7.54693 5.06394 11.9813 7.02477 14.7513Z"
      }
    )
  }
) });
const DisplayedType = ({
  type,
  customField = null,
  repeatable = false
}) => {
  const { formatMessage } = reactIntl.useIntl();
  let readableType = type;
  if (["integer", "biginteger", "float", "decimal"].includes(type)) {
    readableType = "number";
  } else if (["string"].includes(type)) {
    readableType = "text";
  }
  if (customField) {
    return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { children: formatMessage({
      id: index.getTrad("attribute.customField"),
      defaultMessage: "Custom field"
    }) });
  }
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Typography, { textColor: "neutral800", children: [
    formatMessage({
      id: index.getTrad(`attribute.${readableType}`),
      defaultMessage: type
    }),
    " ",
    repeatable && formatMessage({
      id: index.getTrad("component.repeatable"),
      defaultMessage: "(repeatable)"
    })
  ] });
};
const UpperFirst = ({ content }) => /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: upperFirst__default.default(content) });
const BoxWrapper = styledComponents.styled(designSystem.Box)`
  position: relative;
`;
const ListRow = React.memo(
  ({
    configurable = true,
    customField = null,
    editTarget,
    firstLoopComponentUid = null,
    isFromDynamicZone = false,
    name,
    onClick,
    relation = "",
    repeatable = false,
    secondLoopComponentUid = null,
    target = null,
    targetUid = null,
    type
  }) => {
    const { contentTypes, isInDevelopmentMode, removeAttribute } = index.useDataManager();
    const { formatMessage } = reactIntl.useIntl();
    const isMorph = type === "relation" && relation.includes("morph");
    const ico = ["integer", "biginteger", "float", "decimal"].includes(type) ? "number" : type;
    const contentType = get__default.default(contentTypes, [target], {});
    const contentTypeFriendlyName = get__default.default(contentType, ["schema", "displayName"], "");
    const isPluginContentType = get__default.default(contentType, "plugin");
    const src = target ? "relation" : ico;
    const handleClick = () => {
      if (isMorph) {
        return;
      }
      if (configurable !== false) {
        const attrType = type;
        onClick(
          // Tells where the attribute is located in the main modifiedData object : contentType, component or components
          editTarget,
          // main data type uid
          secondLoopComponentUid || firstLoopComponentUid || targetUid,
          // Name of the attribute
          name,
          // Type of the attribute
          attrType,
          customField
        );
      }
    };
    let loopNumber;
    if (secondLoopComponentUid && firstLoopComponentUid) {
      loopNumber = 2;
    } else if (firstLoopComponentUid) {
      loopNumber = 1;
    } else {
      loopNumber = 0;
    }
    return /* @__PURE__ */ jsxRuntime.jsxs(
      BoxWrapper,
      {
        tag: "tr",
        onClick: isInDevelopmentMode && configurable && !isMorph ? handleClick : void 0,
        children: [
          /* @__PURE__ */ jsxRuntime.jsxs("td", { style: { position: "relative" }, children: [
            loopNumber !== 0 && /* @__PURE__ */ jsxRuntime.jsx(Curve, { color: isFromDynamicZone ? "primary200" : "neutral150" }),
            /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { paddingLeft: 2, gap: 4, children: [
              /* @__PURE__ */ jsxRuntime.jsx(index.AttributeIcon, { type: src, customField }),
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textColor: "neutral800", fontWeight: "bold", children: name })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: target ? /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Typography, { textColor: "neutral800", children: [
            formatMessage({
              id: index.getTrad(
                `modelPage.attribute.${isMorph ? "relation-polymorphic" : "relationWith"}`
              ),
              defaultMessage: "Relation with"
            }),
            " ",
            /* @__PURE__ */ jsxRuntime.jsxs("span", { style: { fontStyle: "italic" }, children: [
              /* @__PURE__ */ jsxRuntime.jsx(UpperFirst, { content: contentTypeFriendlyName }),
              " ",
              isPluginContentType && `(${formatMessage({
                id: index.getTrad(`from`),
                defaultMessage: "from"
              })}: ${isPluginContentType})`
            ] })
          ] }) : /* @__PURE__ */ jsxRuntime.jsx(DisplayedType, { type, customField, repeatable }) }),
          /* @__PURE__ */ jsxRuntime.jsx("td", { children: isInDevelopmentMode ? /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { justifyContent: "flex-end", onClick: (e) => e.stopPropagation(), children: configurable ? /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 1, children: [
            !isMorph && /* @__PURE__ */ jsxRuntime.jsx(
              designSystem.IconButton,
              {
                onClick: handleClick,
                label: `${formatMessage({
                  id: "app.utils.edit",
                  defaultMessage: "Edit"
                })} ${name}`,
                variant: "ghost",
                children: /* @__PURE__ */ jsxRuntime.jsx(Icons.Pencil, {})
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              designSystem.IconButton,
              {
                onClick: (e) => {
                  e.stopPropagation();
                  removeAttribute(
                    editTarget,
                    name,
                    secondLoopComponentUid || firstLoopComponentUid || ""
                  );
                },
                label: `${formatMessage({
                  id: "global.delete",
                  defaultMessage: "Delete"
                })} ${name}`,
                variant: "ghost",
                children: /* @__PURE__ */ jsxRuntime.jsx(Icons.Trash, {})
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntime.jsx(Icons.Lock, {}) }) : (
            /*
              In production mode the edit icons aren't visible, therefore
              we need to reserve the same space, otherwise the height of the
              row might collapse, leading to bad positioned curve icons
            */
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { height: "3.2rem" })
          ) })
        ]
      }
    );
  }
);
const getAttributeDisplayedType = (type) => {
  let displayedType;
  switch (type) {
    case "date":
    case "datetime":
    case "time":
    case "timestamp":
      displayedType = "date";
      break;
    case "integer":
    case "biginteger":
    case "decimal":
    case "float":
      displayedType = "number";
      break;
    case "string":
    case "text":
      displayedType = "text";
      break;
    case "":
      displayedType = "relation";
      break;
    default:
      displayedType = type;
  }
  return displayedType;
};
const cmPermissions = {
  collectionTypesConfigurations: [
    {
      action: "plugin::content-manager.collection-types.configure-view",
      subject: null
    }
  ],
  componentsConfigurations: [
    {
      action: "plugin::content-manager.components.configure-layout",
      subject: null
    }
  ],
  singleTypesConfigurations: [
    {
      action: "plugin::content-manager.single-types.configure-view",
      subject: null
    }
  ]
};
const LinkToCMSettingsView = React.memo(
  ({
    disabled,
    isTemporary = false,
    isInContentTypeView = true,
    contentTypeKind = "collectionType",
    targetUid = ""
  }) => {
    const { formatMessage } = reactIntl.useIntl();
    const navigate = reactRouterDom.useNavigate();
    const { collectionTypesConfigurations, componentsConfigurations, singleTypesConfigurations } = cmPermissions;
    const label = formatMessage({
      id: "content-type-builder.form.button.configure-view",
      defaultMessage: "Configure the view"
    });
    let permissionsToApply = collectionTypesConfigurations;
    const handleClick = () => {
      if (isTemporary) {
        return false;
      }
      if (isInContentTypeView) {
        navigate(`/content-manager/collection-types/${targetUid}/configurations/edit`);
      } else {
        navigate(`/content-manager/components/${targetUid}/configurations/edit`);
      }
      return false;
    };
    if (isInContentTypeView && contentTypeKind === "singleType") {
      permissionsToApply = singleTypesConfigurations;
    }
    if (!isInContentTypeView) {
      permissionsToApply = componentsConfigurations;
    }
    const { isLoading, allowedActions } = strapiAdmin.useRBAC({
      viewConfig: permissionsToApply
    });
    if (isLoading) {
      return null;
    }
    if (!allowedActions.canConfigureView && !allowedActions.canConfigureLayout) {
      return null;
    }
    return /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.Button,
      {
        startIcon: /* @__PURE__ */ jsxRuntime.jsx(Icons.ListPlus, {}),
        variant: "tertiary",
        onClick: handleClick,
        disabled: isTemporary || disabled,
        children: label
      }
    );
  }
);
const LayoutsHeaderCustom = styledComponents.styled(strapiAdmin.Layouts.Header)`
  overflow-wrap: anywhere;
`;
const ListView = () => {
  const { initialData, modifiedData, isInDevelopmentMode, isInContentTypeView, submitData } = index.useDataManager();
  const { formatMessage } = reactIntl.useIntl();
  const { trackUsage } = strapiAdmin.useTracking();
  const match = reactRouterDom.useMatch("/plugins/content-type-builder/:kind/:currentUID");
  const {
    onOpenModalAddComponentsToDZ,
    onOpenModalAddField,
    onOpenModalEditField,
    onOpenModalEditSchema,
    onOpenModalEditCustomField
  } = index.useFormModalNavigation();
  const firstMainDataPath = isInContentTypeView ? "contentType" : "component";
  const mainDataTypeAttributesPath = [firstMainDataPath, "schema", "attributes"];
  const targetUid = get__default.default(modifiedData, [firstMainDataPath, "uid"]);
  const isTemporary = get__default.default(modifiedData, [firstMainDataPath, "isTemporary"], false);
  const contentTypeKind = get__default.default(modifiedData, [firstMainDataPath, "schema", "kind"], null);
  const attributes = get__default.default(modifiedData, mainDataTypeAttributesPath, []);
  const isFromPlugin = has__default.default(initialData, [firstMainDataPath, "plugin"]);
  const hasModelBeenModified = !isEqual__default.default(modifiedData, initialData);
  const forTarget = isInContentTypeView ? "contentType" : "component";
  const handleClickAddComponentToDZ = (dynamicZoneTarget) => {
    onOpenModalAddComponentsToDZ({ dynamicZoneTarget, targetUid });
  };
  const handleClickEditField = async (forTarget2, targetUid2, attributeName, type, customField) => {
    const attributeType = getAttributeDisplayedType(type);
    const step = type === "component" ? "2" : null;
    if (customField) {
      onOpenModalEditCustomField({
        forTarget: forTarget2,
        targetUid: targetUid2,
        attributeName,
        attributeType,
        customFieldUid: customField
      });
    } else {
      onOpenModalEditField({
        forTarget: forTarget2,
        targetUid: targetUid2,
        attributeName,
        attributeType,
        step
      });
    }
  };
  let label = get__default.default(modifiedData, [firstMainDataPath, "schema", "displayName"], "");
  const kind = get__default.default(modifiedData, [firstMainDataPath, "schema", "kind"], "");
  const isCreatingFirstContentType = match?.params.currentUID === "create-content-type";
  if (!label && isCreatingFirstContentType) {
    label = formatMessage({
      id: index.getTrad("button.model.create"),
      defaultMessage: "Create new collection type"
    });
  }
  const onEdit = () => {
    const contentType = kind || firstMainDataPath;
    if (contentType === "collectionType") {
      trackUsage("willEditNameOfContentType");
    }
    if (contentType === "singleType") {
      trackUsage("willEditNameOfSingleType");
    }
    onOpenModalEditSchema({
      modalType: firstMainDataPath,
      forTarget: firstMainDataPath,
      targetUid,
      kind: contentType
    });
  };
  reactRouterDom.unstable_usePrompt({
    when: hasModelBeenModified,
    message: formatMessage({ id: index.getTrad("prompt.unsaved"), defaultMessage: "Are you sure?" })
  });
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      LayoutsHeaderCustom,
      {
        id: "title",
        primaryAction: isInDevelopmentMode && /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 2, marginLeft: 2, children: [
          !isCreatingFirstContentType && /* @__PURE__ */ jsxRuntime.jsx(
            designSystem.Button,
            {
              startIcon: /* @__PURE__ */ jsxRuntime.jsx(Icons.Plus, {}),
              variant: "secondary",
              minWidth: "max-content",
              onClick: () => {
                onOpenModalAddField({ forTarget, targetUid });
              },
              children: formatMessage({
                id: index.getTrad("button.attributes.add.another"),
                defaultMessage: "Add another field"
              })
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            designSystem.Button,
            {
              startIcon: /* @__PURE__ */ jsxRuntime.jsx(Icons.Check, {}),
              onClick: async () => await submitData(),
              type: "submit",
              disabled: isEqual__default.default(modifiedData, initialData),
              children: formatMessage({
                id: "global.save",
                defaultMessage: "Save"
              })
            }
          )
        ] }),
        secondaryAction: isInDevelopmentMode && !isFromPlugin && !isCreatingFirstContentType && /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { startIcon: /* @__PURE__ */ jsxRuntime.jsx(Icons.Pencil, {}), variant: "tertiary", onClick: onEdit, children: formatMessage({
          id: "app.utils.edit",
          defaultMessage: "Edit"
        }) }),
        title: upperFirst__default.default(label),
        subtitle: formatMessage({
          id: index.getTrad("listView.headerLayout.description"),
          defaultMessage: "Build the data architecture of your content"
        }),
        navigationAction: /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.BackButton, {})
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Layouts.Content, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", alignItems: "stretch", gap: 4, children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { justifyContent: "flex-end", children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { gap: 2, children: /* @__PURE__ */ jsxRuntime.jsx(
        LinkToCMSettingsView,
        {
          targetUid,
          isTemporary,
          isInContentTypeView,
          contentTypeKind,
          disabled: isCreatingFirstContentType
        },
        "link-to-cm-settings-view"
      ) }) }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { background: "neutral0", shadow: "filterShadow", hasRadius: true, children: /* @__PURE__ */ jsxRuntime.jsx(
        List,
        {
          items: attributes,
          customRowComponent: (props) => /* @__PURE__ */ jsxRuntime.jsx(ListRow, { ...props, onClick: handleClickEditField }),
          addComponentToDZ: handleClickAddComponentToDZ,
          targetUid,
          editTarget: forTarget,
          isMain: true
        }
      ) })
    ] }) })
  ] });
};
exports.default = ListView;
//# sourceMappingURL=ListView-B8sInwpb.js.map
