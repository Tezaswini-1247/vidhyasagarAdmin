import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useEffect } from "react";
import { useQueryParams, useNotification, useStrapiApp, useAPIErrorHandler, useAuth, useGuidedTour, Page, Layouts } from "@strapi/admin/strapi-admin";
import { useIntl } from "react-intl";
import { NavLink, useMatch, useLocation, Navigate, Outlet } from "react-router-dom";
import { Box, Flex, Typography, IconButton, SubNavLink, useFilter, useCollator, SubNav, SubNavHeader, SubNavSections, SubNavSection, useNotifyAT } from "@strapi/design-system";
import { useDragLayer } from "react-dnd";
import { C as CardDragPreview } from "./CardDragPreview-DOxamsuj.mjs";
import { CaretDown, Trash, Drag, Cross } from "@strapi/icons";
import { styled } from "styled-components";
import { D as DocumentStatus, u as useContentTypeSchema, g as getTranslation, a as useGetInitialDataQuery, b as useGetAllContentTypeSettingsQuery, s as setInitialData, C as COLLECTION_TYPES, S as SINGLE_TYPES, H as HOOKS } from "./index-ByPZ754U.mjs";
import { F as FlexWrapper, L as LinkEllipsis, D as DisconnectButton } from "./Relations-Bvne4TvU.mjs";
import { stringify, parse } from "qs";
import { u as useTypedSelector, a as useTypedDispatch } from "./hooks-E5u1mcgM.mjs";
import { I as ItemTypes } from "./useDragAndDrop-DJ6jqvZN.mjs";
function getStyle(initialOffset, currentOffset, mouseOffset) {
  if (!initialOffset || !currentOffset || !mouseOffset) {
    return { display: "none" };
  }
  const { x, y } = mouseOffset;
  return {
    transform: `translate(${x}px, ${y}px)`
  };
}
const DragLayer = ({ renderItem }) => {
  const { itemType, isDragging, item, initialOffset, currentOffset, mouseOffset } = useDragLayer(
    (monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
      mouseOffset: monitor.getClientOffset()
    })
  );
  if (!isDragging) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    Box,
    {
      height: "100%",
      left: 0,
      position: "fixed",
      pointerEvents: "none",
      top: 0,
      zIndex: 100,
      width: "100%",
      children: /* @__PURE__ */ jsx(Box, { style: getStyle(initialOffset, currentOffset, mouseOffset), children: renderItem({ type: itemType, item }) })
    }
  );
};
const ComponentDragPreview = ({ displayedValue }) => {
  return /* @__PURE__ */ jsxs(
    Flex,
    {
      background: "neutral0",
      borderColor: "neutral200",
      justifyContent: "space-between",
      gap: 3,
      padding: 3,
      width: "30rem",
      children: [
        /* @__PURE__ */ jsx(ToggleButton, { type: "button", children: /* @__PURE__ */ jsxs(Flex, { gap: 6, children: [
          /* @__PURE__ */ jsx(
            DropdownIconWrapper,
            {
              alignItems: "center",
              justifyContent: "center",
              background: "neutral200",
              height: "3.2rem",
              width: "3.2rem",
              children: /* @__PURE__ */ jsx(CaretDown, {})
            }
          ),
          /* @__PURE__ */ jsx(Flex, { maxWidth: "15rem", children: /* @__PURE__ */ jsx(Typography, { textColor: "neutral700", ellipsis: true, children: displayedValue }) })
        ] }) }),
        /* @__PURE__ */ jsxs(Flex, { gap: 2, children: [
          /* @__PURE__ */ jsx(IconButton, { withTooltip: false, label: "", variant: "ghost", children: /* @__PURE__ */ jsx(Trash, {}) }),
          /* @__PURE__ */ jsx(IconButton, { withTooltip: false, label: "", variant: "ghost", children: /* @__PURE__ */ jsx(Drag, {}) })
        ] })
      ]
    }
  );
};
const DropdownIconWrapper = styled(Flex)`
  border-radius: 50%;

  svg {
    height: 0.6rem;
    width: 1.1rem;
    > path {
      fill: ${({ theme }) => theme.colors.neutral600};
    }
  }
`;
const ToggleButton = styled.button`
  border: none;
  background: transparent;
  display: block;
  width: 100%;
  text-align: unset;
  padding: 0;
`;
const RelationDragPreview = ({ status, displayedValue, width }) => {
  return /* @__PURE__ */ jsx(Box, { style: { width }, children: /* @__PURE__ */ jsxs(
    Flex,
    {
      paddingTop: 2,
      paddingBottom: 2,
      paddingLeft: 2,
      paddingRight: 4,
      hasRadius: true,
      borderWidth: 1,
      background: "neutral0",
      borderColor: "neutral200",
      justifyContent: "space-between",
      gap: 4,
      children: [
        /* @__PURE__ */ jsxs(FlexWrapper, { gap: 1, children: [
          /* @__PURE__ */ jsx(IconButton, { withTooltip: false, label: "", variant: "ghost", children: /* @__PURE__ */ jsx(Drag, {}) }),
          /* @__PURE__ */ jsxs(Flex, { width: "100%", minWidth: 0, justifyContent: "space-between", children: [
            /* @__PURE__ */ jsx(Box, { minWidth: 0, paddingTop: 1, paddingBottom: 1, paddingRight: 4, children: /* @__PURE__ */ jsx(LinkEllipsis, { href: "", children: /* @__PURE__ */ jsx(Typography, { textColor: "primary600", ellipsis: true, children: displayedValue }) }) }),
            status ? /* @__PURE__ */ jsx(DocumentStatus, { status }) : null
          ] })
        ] }),
        /* @__PURE__ */ jsx(DisconnectButton, { type: "button", children: /* @__PURE__ */ jsx(Cross, { width: "12px" }) })
      ]
    }
  ) });
};
const SubNavLinkCustom = styled(SubNavLink)`
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
const LeftMenu = () => {
  const [search, setSearch] = React.useState("");
  const [{ query }] = useQueryParams();
  const { formatMessage, locale } = useIntl();
  const collectionTypeLinks = useTypedSelector(
    (state) => state["content-manager"].app.collectionTypeLinks
  );
  const singleTypeLinks = useTypedSelector((state) => state["content-manager"].app.singleTypeLinks);
  const { schemas } = useContentTypeSchema();
  const { startsWith } = useFilter(locale, {
    sensitivity: "base"
  });
  const formatter = useCollator(locale, {
    sensitivity: "base"
  });
  const menu = React.useMemo(
    () => [
      {
        id: "collectionTypes",
        title: formatMessage({
          id: getTranslation("components.LeftMenu.collection-types"),
          defaultMessage: "Collection Types"
        }),
        searchable: true,
        links: collectionTypeLinks
      },
      {
        id: "singleTypes",
        title: formatMessage({
          id: getTranslation("components.LeftMenu.single-types"),
          defaultMessage: "Single Types"
        }),
        searchable: true,
        links: singleTypeLinks
      }
    ].map((section) => ({
      ...section,
      links: section.links.filter((link) => startsWith(link.title, search)).sort((a, b) => formatter.compare(a.title, b.title)).map((link) => {
        return {
          ...link,
          title: formatMessage({ id: link.title, defaultMessage: link.title })
        };
      })
    })),
    [collectionTypeLinks, search, singleTypeLinks, startsWith, formatMessage, formatter]
  );
  const handleClear = () => {
    setSearch("");
  };
  const handleChangeSearch = ({ target: { value } }) => {
    setSearch(value);
  };
  const label = formatMessage({
    id: getTranslation("header.name"),
    defaultMessage: "Content Manager"
  });
  const getPluginsParamsForLink = (link) => {
    const schema = schemas.find((schema2) => schema2.uid === link.uid);
    const isI18nEnabled = Boolean(schema?.pluginOptions?.i18n?.localized);
    if (query.plugins && "i18n" in query.plugins) {
      const { i18n, ...restPlugins } = query.plugins;
      if (!isI18nEnabled) {
        return restPlugins;
      }
      return { i18n, ...restPlugins };
    }
    return query.plugins;
  };
  return /* @__PURE__ */ jsxs(SubNav, { "aria-label": label, children: [
    /* @__PURE__ */ jsx(
      SubNavHeader,
      {
        label,
        searchable: true,
        value: search,
        onChange: handleChangeSearch,
        onClear: handleClear,
        searchLabel: formatMessage({
          id: "content-manager.components.LeftMenu.Search.label",
          defaultMessage: "Search for a content type"
        })
      }
    ),
    /* @__PURE__ */ jsx(SubNavSections, { children: menu.map((section) => {
      return /* @__PURE__ */ jsx(
        SubNavSection,
        {
          label: section.title,
          badgeLabel: section.links.length.toString(),
          children: section.links.map((link) => {
            return /* @__PURE__ */ jsx(
              SubNavLinkCustom,
              {
                tag: NavLink,
                to: {
                  pathname: link.to,
                  search: stringify({
                    ...parse(link.search ?? ""),
                    plugins: getPluginsParamsForLink(link)
                  })
                },
                width: "100%",
                children: link.title
              },
              link.uid
            );
          })
        },
        section.id
      );
    }) })
  ] });
};
const { MUTATE_COLLECTION_TYPES_LINKS, MUTATE_SINGLE_TYPES_LINKS } = HOOKS;
const useContentManagerInitData = () => {
  const { toggleNotification } = useNotification();
  const dispatch = useTypedDispatch();
  const runHookWaterfall = useStrapiApp(
    "useContentManagerInitData",
    (state2) => state2.runHookWaterfall
  );
  const { notifyStatus } = useNotifyAT();
  const { formatMessage } = useIntl();
  const { _unstableFormatAPIError: formatAPIError } = useAPIErrorHandler(getTranslation);
  const checkUserHasPermissions = useAuth(
    "useContentManagerInitData",
    (state2) => state2.checkUserHasPermissions
  );
  const state = useTypedSelector((state2) => state2["content-manager"].app);
  const initialDataQuery = useGetInitialDataQuery(void 0, {
    /**
     * TODO: remove this when the CTB has been refactored to use redux-toolkit-query
     * and it can invalidate the cache on mutation
     */
    refetchOnMountOrArgChange: true
  });
  useEffect(() => {
    if (initialDataQuery.data) {
      notifyStatus(
        formatMessage({
          id: getTranslation("App.schemas.data-loaded"),
          defaultMessage: "The schemas have been successfully loaded."
        })
      );
    }
  }, [formatMessage, initialDataQuery.data, notifyStatus]);
  useEffect(() => {
    if (initialDataQuery.error) {
      toggleNotification({ type: "danger", message: formatAPIError(initialDataQuery.error) });
    }
  }, [formatAPIError, initialDataQuery.error, toggleNotification]);
  const contentTypeSettingsQuery = useGetAllContentTypeSettingsQuery();
  useEffect(() => {
    if (contentTypeSettingsQuery.error) {
      toggleNotification({
        type: "danger",
        message: formatAPIError(contentTypeSettingsQuery.error)
      });
    }
  }, [formatAPIError, contentTypeSettingsQuery.error, toggleNotification]);
  const formatData = async (components, contentTypes, fieldSizes, contentTypeConfigurations) => {
    const { collectionType: collectionTypeLinks, singleType: singleTypeLinks } = contentTypes.reduce(
      (acc, model) => {
        acc[model.kind].push(model);
        return acc;
      },
      {
        collectionType: [],
        singleType: []
      }
    );
    const collectionTypeSectionLinks = generateLinks(
      collectionTypeLinks,
      "collectionTypes",
      contentTypeConfigurations
    );
    const singleTypeSectionLinks = generateLinks(singleTypeLinks, "singleTypes");
    const collectionTypeLinksPermissions = await Promise.all(
      collectionTypeSectionLinks.map(({ permissions }) => checkUserHasPermissions(permissions))
    );
    const authorizedCollectionTypeLinks = collectionTypeSectionLinks.filter(
      (_, index) => collectionTypeLinksPermissions[index].length > 0
    );
    const singleTypeLinksPermissions = await Promise.all(
      singleTypeSectionLinks.map(({ permissions }) => checkUserHasPermissions(permissions))
    );
    const authorizedSingleTypeLinks = singleTypeSectionLinks.filter(
      (_, index) => singleTypeLinksPermissions[index].length > 0
    );
    const { ctLinks } = runHookWaterfall(MUTATE_COLLECTION_TYPES_LINKS, {
      ctLinks: authorizedCollectionTypeLinks,
      models: contentTypes
    });
    const { stLinks } = runHookWaterfall(MUTATE_SINGLE_TYPES_LINKS, {
      stLinks: authorizedSingleTypeLinks,
      models: contentTypes
    });
    dispatch(
      setInitialData({
        authorizedCollectionTypeLinks: ctLinks,
        authorizedSingleTypeLinks: stLinks,
        components,
        contentTypeSchemas: contentTypes,
        fieldSizes
      })
    );
  };
  useEffect(() => {
    if (initialDataQuery.data && contentTypeSettingsQuery.data) {
      formatData(
        initialDataQuery.data.components,
        initialDataQuery.data.contentTypes,
        initialDataQuery.data.fieldSizes,
        contentTypeSettingsQuery.data
      );
    }
  }, [initialDataQuery.data, contentTypeSettingsQuery.data]);
  return { ...state };
};
const generateLinks = (links, type, configurations = []) => {
  return links.filter((link) => link.isDisplayed).map((link) => {
    const collectionTypesPermissions = [
      { action: "plugin::content-manager.explorer.create", subject: link.uid },
      { action: "plugin::content-manager.explorer.read", subject: link.uid }
    ];
    const singleTypesPermissions = [
      { action: "plugin::content-manager.explorer.read", subject: link.uid }
    ];
    const permissions = type === "collectionTypes" ? collectionTypesPermissions : singleTypesPermissions;
    const currentContentTypeConfig = configurations.find(({ uid }) => uid === link.uid);
    let search = null;
    if (currentContentTypeConfig) {
      const searchParams = {
        page: 1,
        pageSize: currentContentTypeConfig.settings.pageSize,
        sort: `${currentContentTypeConfig.settings.defaultSortBy}:${currentContentTypeConfig.settings.defaultSortOrder}`
      };
      search = stringify(searchParams, { encode: false });
    }
    return {
      permissions,
      search,
      kind: link.kind,
      title: link.info.displayName,
      to: `/content-manager/${link.kind === "collectionType" ? COLLECTION_TYPES : SINGLE_TYPES}/${link.uid}`,
      uid: link.uid,
      // Used for the list item key in the helper plugin
      name: link.uid,
      isDisplayed: link.isDisplayed
    };
  });
};
const Layout = () => {
  const contentTypeMatch = useMatch("/content-manager/:kind/:uid/*");
  const { isLoading, collectionTypeLinks, models, singleTypeLinks } = useContentManagerInitData();
  const authorisedModels = [...collectionTypeLinks, ...singleTypeLinks].sort(
    (a, b) => a.title.localeCompare(b.title)
  );
  const { pathname } = useLocation();
  const { formatMessage } = useIntl();
  const startSection = useGuidedTour("Layout", (state) => state.startSection);
  const startSectionRef = React.useRef(startSection);
  React.useEffect(() => {
    if (startSectionRef.current) {
      startSectionRef.current("contentManager");
    }
  }, []);
  if (isLoading) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Page.Title, { children: formatMessage({
        id: getTranslation("plugin.name"),
        defaultMessage: "Content Manager"
      }) }),
      /* @__PURE__ */ jsx(Page.Loading, {})
    ] });
  }
  const supportedModelsToDisplay = models.filter(({ isDisplayed }) => isDisplayed);
  if (authorisedModels.length === 0 && supportedModelsToDisplay.length > 0 && pathname !== "/content-manager/403") {
    return /* @__PURE__ */ jsx(Navigate, { to: "/403" });
  }
  if (supportedModelsToDisplay.length === 0 && pathname !== "/no-content-types") {
    return /* @__PURE__ */ jsx(Navigate, { to: "/no-content-types" });
  }
  if (!contentTypeMatch && authorisedModels.length > 0) {
    return /* @__PURE__ */ jsx(
      Navigate,
      {
        to: {
          pathname: authorisedModels[0].to,
          search: authorisedModels[0].search ?? ""
        },
        replace: true
      }
    );
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Page.Title, { children: formatMessage({
      id: getTranslation("plugin.name"),
      defaultMessage: "Content Manager"
    }) }),
    /* @__PURE__ */ jsxs(Layouts.Root, { sideNav: /* @__PURE__ */ jsx(LeftMenu, {}), children: [
      /* @__PURE__ */ jsx(DragLayer, { renderItem: renderDraglayerItem }),
      /* @__PURE__ */ jsx(Outlet, {})
    ] })
  ] });
};
function renderDraglayerItem({ type, item }) {
  if (!type || type && typeof type !== "string") {
    return null;
  }
  const [actualType] = type.split("_");
  switch (actualType) {
    case ItemTypes.EDIT_FIELD:
    case ItemTypes.FIELD:
      return /* @__PURE__ */ jsx(CardDragPreview, { label: item.label });
    case ItemTypes.COMPONENT:
    case ItemTypes.DYNAMIC_ZONE:
      return /* @__PURE__ */ jsx(ComponentDragPreview, { displayedValue: item.displayedValue });
    case ItemTypes.RELATION:
      return /* @__PURE__ */ jsx(RelationDragPreview, { ...item });
    default:
      return null;
  }
}
export {
  Layout
};
//# sourceMappingURL=layout-CUTOYU8I.mjs.map
