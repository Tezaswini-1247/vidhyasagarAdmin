import { createRoot } from 'react-dom/client';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { Link, Alert, Typography, Main, Flex, Button, Box, useCallbackRef, EmptyStateLayout, LinkButton, useComposedRefs, Dialog, Field, Toggle, Checkbox, DatePicker, DateTimePicker, TextInput, SingleSelect, SingleSelectOption, JSONInput, NumberInput, Textarea, TimePicker, Portal, IconButton, VisuallyHidden, Grid, lightTheme, darkTheme, Popover, Tag, Pagination as Pagination$1, PreviousLink, PageLink, Dots, NextLink, SearchForm, Searchbar, Table as Table$1, Thead, Tr, Th, Tooltip, Tbody, Td, Loader } from '@strapi/design-system';
import invariant from 'invariant';
import isFunction from 'lodash/isFunction';
import merge from 'lodash/merge';
import pick from 'lodash/pick';
import { useNavigate, NavLink, useLocation, Outlet, useRouteError, Link as Link$1, useBlocker, useMatch, Navigate, createMemoryRouter, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { w as createContext, S as StrapiAppProvider, x as AuthProvider, L as LanguageProvider, T as Theme, N as NotificationsProvider, y as TrackingProvider, G as GuidedTourProvider, C as ConfigurationProvider, z as LANGUAGE_LOCAL_STORAGE_KEY, P as Page, B as getIn, D as setIn, r as useConfiguration, b as useTypedSelector, d as useTypedDispatch, E as setLocale, u as useAuth, e as useAPIErrorHandler, F as useForgotPasswordMutation, a as useNotification, p as useAppInfo, c as useTracking, m as useGuidedTour, H as useGetRegistrationInfoQuery, I as useRegisterAdminMutation, J as useRegisterUserMutation, n as login, K as useResetPasswordMutation, M as reducer$2, O as logout, R as RBAC, Q as THEME_LOCAL_STORAGE_KEY, U as getStoredToken, o as useQueryParams, V as useTypedStore } from './Theme-DQRUlj-X.mjs';
import { Provider as Provider$1 } from 'react-redux';
import * as React from 'react';
import { useEffect, Suspense, useCallback, useMemo, useState, forwardRef, memo } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ArrowLeft, WarningCircle, Duplicate, ArrowRight, Eye, EyeStriked, Cross, Filter, Plus, Search, CaretDown } from '@strapi/icons';
import { produce } from 'immer';
import { useIntl } from 'react-intl';
import { styled } from 'styled-components';
import { EmptyPictures, EmptyDocuments } from '@strapi/icons/symbols';
import { u as useEnterprise } from './useEnterprise-BGzVPL4w.mjs';
import { i as isBaseQueryError, e as useInitQuery, a as adminApi, j as createAbsoluteUrl, k as getFetchClient } from './admin-CuE4OEl1.mjs';
import camelCase from 'lodash/camelCase';
import * as yup from 'yup';
import { ValidationError } from 'yup';
import { generateNKeysBetween } from 'fractional-indexing';
import isEqual from 'lodash/isEqual';
import { getLocalTimeZone, parseAbsolute, toCalendarDate } from '@internationalized/date';
import omit from 'lodash/omit';
import { Formik, Form as Form$1 } from 'formik';
import { configureStore, isRejected, combineReducers } from '@reduxjs/toolkit';
import throttle from 'lodash/throttle';
import { stringify } from 'qs';

const __variableDynamicImportRuntimeHelper = (glob, path, segs) => {
    const v = glob[path];
    if (v) {
        return typeof v === 'function' ? v() : Promise.resolve(v);
    }
    return new Promise((_, reject) => {
        (typeof queueMicrotask === 'function' ? queueMicrotask : setTimeout)(reject.bind(null, new Error('Unknown variable dynamic import: ' +
            path +
            (path.split('/').length !== segs
                ? '. Note that variables only represent file names one level deep.'
                : ''))));
    });
};

const ADMIN_PERMISSIONS_EE = {
  settings: {
    auditLogs: {
      main: [{ action: "admin::audit-logs.read", subject: null }],
      read: [{ action: "admin::audit-logs.read", subject: null }],
      update: [{ action: "admin::audit-logs.update", subject: null }]
    },
    "review-workflows": {
      main: [{ action: "admin::review-workflows.read", subject: null }],
      read: [{ action: "admin::review-workflows.read", subject: null }],
      create: [{ action: "admin::review-workflows.create", subject: null }],
      delete: [{ action: "admin::review-workflows.delete", subject: null }],
      update: [{ action: "admin::review-workflows.update", subject: null }]
    },
    sso: {
      main: [{ action: "admin::provider-login.read", subject: null }],
      read: [{ action: "admin::provider-login.read", subject: null }],
      update: [{ action: "admin::provider-login.update", subject: null }]
    },
    releases: {
      read: [
        {
          action: "plugin::content-releases.settings.read",
          subject: null
        }
      ],
      update: [
        {
          action: "plugin::content-releases.settings.update",
          subject: null
        }
      ]
    }
  }
};
const getEERoutes$1 = () => window.strapi.isEE ? [
  {
    path: "auth/login/:authResponse",
    lazy: async () => {
      const { AuthResponse } = await import('./AuthResponse-DPn9gip-.mjs');
      return {
        Component: AuthResponse
      };
    }
  }
] : [];
const SETTINGS_LINKS_EE = () => ({
  global: [
    ...window.strapi.features.isEnabled(window.strapi.features.SSO) ? [
      {
        intlLabel: { id: "Settings.sso.title", defaultMessage: "Single Sign-On" },
        to: "/settings/single-sign-on",
        id: "sso"
      }
    ] : []
  ],
  admin: [
    ...window.strapi.features.isEnabled(window.strapi.features.AUDIT_LOGS) ? [
      {
        intlLabel: { id: "global.auditLogs", defaultMessage: "Audit Logs" },
        to: "/settings/audit-logs?pageSize=50&page=1&sort=date:DESC",
        id: "auditLogs"
      }
    ] : []
  ]
});

const constants = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    ADMIN_PERMISSIONS_EE,
    SETTINGS_LINKS_EE,
    getEERoutes: getEERoutes$1
}, Symbol.toStringTag, { value: 'Module' }));

const StrapiLogo = "data:image/svg+xml,%3csvg%20width='800'%20height='800'%20viewBox='0%200%20800%20800'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M39%20282c0-118%200-176.9%2036.6-213.5C112.2%2032%20171.1%2032%20288.9%2032h221.2c117.8%200%20176.7%200%20213.3%2036.6C760%20105.2%20760%20164.1%20760%20281.9v221.2c0%20117.8%200%20176.7-36.6%20213.3C686.8%20753%20627.9%20753%20510.1%20753H288.9c-117.8%200-176.7%200-213.3-36.6C39%20679.8%2039%20620.9%2039%20503.1V281.9Z'%20fill='%234945FF'/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M536.4%20250.7H293.7v123.8h123.8v123.7h123.8V255.5c0-2.6-2.2-4.8-4.9-4.8Z'%20fill='%23fff'/%3e%3cpath%20fill='%23fff'%20d='M412.7%20374.5h4.8v4.8h-4.8z'/%3e%3cpath%20d='M293.8%20374.5h119c2.6%200%204.8%202.1%204.8%204.8v119h-119a4.8%204.8%200%200%201-4.8-4.9v-119Z'%20fill='%239593FF'/%3e%3cpath%20d='M417.5%20498.2h123.8L421.6%20618a2.4%202.4%200%200%201-4-1.7v-118ZM293.8%20374.5h-118a2.4%202.4%200%200%201-1.7-4.1l119.7-119.7v123.8Z'%20fill='%239593FF'/%3e%3c/svg%3e";

const ADMIN_PERMISSIONS_CE = {
  contentManager: {
    main: [],
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
  },
  marketplace: {
    main: [{ action: "admin::marketplace.read", subject: null }],
    read: [{ action: "admin::marketplace.read", subject: null }]
  },
  settings: {
    roles: {
      main: [
        { action: "admin::roles.create", subject: null },
        { action: "admin::roles.update", subject: null },
        { action: "admin::roles.read", subject: null },
        { action: "admin::roles.delete", subject: null }
      ],
      create: [{ action: "admin::roles.create", subject: null }],
      delete: [{ action: "admin::roles.delete", subject: null }],
      read: [{ action: "admin::roles.read", subject: null }],
      update: [{ action: "admin::roles.update", subject: null }]
    },
    users: {
      main: [
        { action: "admin::users.create", subject: null },
        { action: "admin::users.read", subject: null },
        { action: "admin::users.update", subject: null },
        { action: "admin::users.delete", subject: null }
      ],
      create: [{ action: "admin::users.create", subject: null }],
      delete: [{ action: "admin::users.delete", subject: null }],
      read: [{ action: "admin::users.read", subject: null }],
      update: [{ action: "admin::users.update", subject: null }]
    },
    webhooks: {
      main: [
        { action: "admin::webhooks.create", subject: null },
        { action: "admin::webhooks.read", subject: null },
        { action: "admin::webhooks.update", subject: null },
        { action: "admin::webhooks.delete", subject: null }
      ],
      create: [{ action: "admin::webhooks.create", subject: null }],
      delete: [{ action: "admin::webhooks.delete", subject: null }],
      read: [
        { action: "admin::webhooks.read", subject: null },
        // NOTE: We need to check with the API
        { action: "admin::webhooks.update", subject: null },
        { action: "admin::webhooks.delete", subject: null }
      ],
      update: [{ action: "admin::webhooks.update", subject: null }]
    },
    "api-tokens": {
      main: [{ action: "admin::api-tokens.access", subject: null }],
      create: [{ action: "admin::api-tokens.create", subject: null }],
      delete: [{ action: "admin::api-tokens.delete", subject: null }],
      read: [{ action: "admin::api-tokens.read", subject: null }],
      update: [{ action: "admin::api-tokens.update", subject: null }],
      regenerate: [{ action: "admin::api-tokens.regenerate", subject: null }]
    },
    "transfer-tokens": {
      main: [{ action: "admin::transfer.tokens.access", subject: null }],
      create: [{ action: "admin::transfer.tokens.create", subject: null }],
      delete: [{ action: "admin::transfer.tokens.delete", subject: null }],
      read: [{ action: "admin::transfer.tokens.read", subject: null }],
      update: [{ action: "admin::transfer.tokens.update", subject: null }],
      regenerate: [{ action: "admin::transfer.tokens.regenerate", subject: null }]
    },
    "project-settings": {
      read: [{ action: "admin::project-settings.read", subject: null }],
      update: [{ action: "admin::project-settings.update", subject: null }]
    },
    plugins: {
      main: [{ action: "admin::marketplace.read", subject: null }],
      read: [{ action: "admin::marketplace.read", subject: null }]
    }
  }
};
const HOOKS = {
  /**
   * Hook that allows to mutate the displayed headers of the list view table
   * @constant
   * @type {string}
   */
  INJECT_COLUMN_IN_TABLE: "Admin/CM/pages/ListView/inject-column-in-table",
  /**
   * Hook that allows to mutate the CM's collection types links pre-set filters
   * @constant
   * @type {string}
   */
  MUTATE_COLLECTION_TYPES_LINKS: "Admin/CM/pages/App/mutate-collection-types-links",
  /**
   * Hook that allows to mutate the CM's edit view layout
   * @constant
   * @type {string}
   */
  MUTATE_EDIT_VIEW_LAYOUT: "Admin/CM/pages/EditView/mutate-edit-view-layout",
  /**
   * Hook that allows to mutate the CM's single types links pre-set filters
   * @constant
   * @type {string}
   */
  MUTATE_SINGLE_TYPES_LINKS: "Admin/CM/pages/App/mutate-single-types-links"
};
const SETTINGS_LINKS_CE = () => ({
  global: [
    {
      intlLabel: { id: "Settings.application.title", defaultMessage: "Overview" },
      to: "/settings/application-infos",
      id: "000-application-infos"
    },
    {
      intlLabel: { id: "Settings.webhooks.title", defaultMessage: "Webhooks" },
      to: "/settings/webhooks",
      id: "webhooks"
    },
    {
      intlLabel: { id: "Settings.apiTokens.title", defaultMessage: "API Tokens" },
      to: "/settings/api-tokens?sort=name:ASC",
      id: "api-tokens"
    },
    {
      intlLabel: { id: "Settings.transferTokens.title", defaultMessage: "Transfer Tokens" },
      to: "/settings/transfer-tokens?sort=name:ASC",
      id: "transfer-tokens"
    },
    {
      intlLabel: {
        id: "global.plugins",
        defaultMessage: "Plugins"
      },
      to: "/settings/list-plugins",
      id: "plugins"
    },
    // If the Enterprise/Cloud feature is not enabled and if the config doesn't disable it, we promote the Enterprise/Cloud feature by displaying them in the settings menu.
    // Disable this by adding "promoteEE: false" to your `./config/admin.js` file
    ...!window.strapi.features.isEnabled(window.strapi.features.SSO) && window.strapi?.flags?.promoteEE ? [
      {
        intlLabel: { id: "Settings.sso.title", defaultMessage: "Single Sign-On" },
        to: "/settings/purchase-single-sign-on",
        id: "sso-purchase-page",
        licenseOnly: true
      }
    ] : []
  ],
  admin: [
    {
      intlLabel: { id: "global.roles", defaultMessage: "Roles" },
      to: "/settings/roles",
      id: "roles"
    },
    {
      intlLabel: { id: "global.users", defaultMessage: "Users" },
      // Init the search params directly
      to: "/settings/users?pageSize=10&page=1&sort=firstname",
      id: "users"
    },
    ...!window.strapi.features.isEnabled(window.strapi.features.AUDIT_LOGS) && window.strapi?.flags?.promoteEE ? [
      {
        intlLabel: { id: "global.auditLogs", defaultMessage: "Audit Logs" },
        to: "/settings/purchase-audit-logs",
        id: "auditLogs-purchase-page",
        licenseOnly: true
      }
    ] : []
  ]
});

const ALLOWED_TYPES = [
  "biginteger",
  "boolean",
  "date",
  "datetime",
  "decimal",
  "email",
  "enumeration",
  "float",
  "integer",
  "json",
  "password",
  "richtext",
  "string",
  "text",
  "time",
  "uid"
];
const ALLOWED_ROOT_LEVEL_OPTIONS = [
  "min",
  "minLength",
  "max",
  "maxLength",
  "required",
  "regex",
  "enum",
  "unique",
  "private",
  "default"
];
class CustomFields {
  customFields;
  constructor() {
    this.customFields = {};
  }
  register = (customFields) => {
    if (Array.isArray(customFields)) {
      customFields.forEach((customField) => {
        this.register(customField);
      });
    } else {
      const { name, pluginId, type, intlLabel, intlDescription, components, options } = customFields;
      invariant(name, "A name must be provided");
      invariant(type, "A type must be provided");
      invariant(intlLabel, "An intlLabel must be provided");
      invariant(intlDescription, "An intlDescription must be provided");
      invariant(components, "A components object must be provided");
      invariant(components.Input, "An Input component must be provided");
      invariant(
        ALLOWED_TYPES.includes(type),
        `Custom field type: '${type}' is not a valid Strapi type or it can't be used with a Custom Field`
      );
      const isValidObjectKey = /^(?![0-9])[a-zA-Z0-9$_-]+$/g;
      invariant(
        isValidObjectKey.test(name),
        `Custom field name: '${name}' is not a valid object key`
      );
      const allFormOptions = [...options?.base || [], ...options?.advanced || []];
      if (allFormOptions.length) {
        const optionPathValidations = allFormOptions.reduce(optionsValidationReducer, []);
        optionPathValidations.forEach(({ isValidOptionPath, errorMessage }) => {
          invariant(isValidOptionPath, errorMessage);
        });
      }
      const uid = pluginId ? `plugin::${pluginId}.${name}` : `global::${name}`;
      const uidAlreadyUsed = Object.prototype.hasOwnProperty.call(this.customFields, uid);
      invariant(!uidAlreadyUsed, `Custom field: '${uid}' has already been registered`);
      this.customFields[uid] = customFields;
    }
  };
  getAll = () => {
    return this.customFields;
  };
  get = (uid) => {
    return this.customFields[uid];
  };
}
const optionsValidationReducer = (acc, option) => {
  if ("items" in option) {
    return option.items.reduce(optionsValidationReducer, acc);
  }
  if (!option.name) {
    acc.push({
      isValidOptionPath: false,
      errorMessage: "The 'name' property is required on an options object"
    });
  } else {
    acc.push({
      isValidOptionPath: option.name.startsWith("options") || ALLOWED_ROOT_LEVEL_OPTIONS.includes(option.name),
      errorMessage: `'${option.name}' must be prefixed with 'options.'`
    });
  }
  return acc;
};

class Plugin {
  apis;
  initializer;
  injectionZones;
  isReady;
  name;
  pluginId;
  constructor(pluginConf) {
    this.apis = pluginConf.apis || {};
    this.initializer = pluginConf.initializer || null;
    this.injectionZones = pluginConf.injectionZones || {};
    this.isReady = pluginConf.isReady !== void 0 ? pluginConf.isReady : true;
    this.name = pluginConf.name;
    this.pluginId = pluginConf.id;
  }
  getInjectedComponents(containerName, blockName) {
    try {
      return this.injectionZones[containerName][blockName] || [];
    } catch (err) {
      console.error("Cannot get injected component", err);
      return [];
    }
  }
  injectComponent(containerName, blockName, component) {
    try {
      this.injectionZones[containerName][blockName].push(component);
    } catch (err) {
      console.error("Cannot inject component", err);
    }
  }
}

const [Provider, useHistory] = createContext("History", {
  history: [],
  currentLocationIndex: 0,
  currentLocation: "",
  canGoBack: false,
  pushState: () => {
    throw new Error("You must use the `HistoryProvider` to access the `pushState` function.");
  },
  goBack: () => {
    throw new Error("You must use the `HistoryProvider` to access the `goBack` function.");
  }
});
const HistoryProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [state, dispatch] = React.useReducer(reducer$1, {
    history: [],
    currentLocationIndex: 0,
    currentLocation: "",
    canGoBack: false
  });
  const isGoingBack = React.useRef(false);
  const pushState = React.useCallback((path) => {
    dispatch({
      type: "PUSH_STATE",
      payload: typeof path === "string" ? { to: path, search: "" } : path
    });
  }, []);
  const goBack = React.useCallback(() => {
    navigate(-1);
    dispatch({ type: "GO_BACK" });
    isGoingBack.current = true;
  }, [navigate]);
  const prevIndex = React.useRef(state.currentLocationIndex);
  React.useEffect(() => {
    if (state.currentLocationIndex !== prevIndex.current) {
      dispatch({
        type: "SET_CAN_GO_BACK",
        payload: state.currentLocationIndex > 1 && state.history.length > 1
      });
      prevIndex.current = state.currentLocationIndex;
    }
  }, [prevIndex, state.currentLocationIndex, state.history.length]);
  React.useLayoutEffect(() => {
    if (isGoingBack.current) {
      isGoingBack.current = false;
    } else {
      dispatch({
        type: "PUSH_STATE",
        payload: { to: location.pathname, search: location.search }
      });
    }
  }, [dispatch, location.pathname, location.search]);
  return /* @__PURE__ */ jsx(Provider, { pushState, goBack, ...state, children });
};
const reducer$1 = (state, action) => produce(state, (draft) => {
  switch (action.type) {
    case "PUSH_STATE": {
      const path = `${action.payload.to}${action.payload.search}`;
      if (state.currentLocationIndex === state.history.length) {
        draft.history = [...state.history, path];
      } else {
        draft.history = [...state.history.slice(0, state.currentLocationIndex), path];
      }
      draft.currentLocation = path;
      draft.currentLocationIndex += 1;
      break;
    }
    case "GO_BACK": {
      const newIndex = state.currentLocationIndex - 1;
      draft.currentLocation = state.history[newIndex - 1];
      draft.currentLocationIndex = newIndex;
      break;
    }
    case "SET_CAN_GO_BACK": {
      draft.canGoBack = action.payload;
      break;
    }
  }
});
const BackButton = React.forwardRef(
  ({ disabled, fallback = "" }, ref) => {
    const { formatMessage } = useIntl();
    const navigate = useNavigate();
    const canGoBack = useHistory("BackButton", (state) => state.canGoBack);
    const goBack = useHistory("BackButton", (state) => state.goBack);
    const history = useHistory("BackButton", (state) => state.history);
    const hasFallback = fallback !== "";
    const shouldBeDisabled = disabled || !canGoBack && !hasFallback;
    const handleClick = (e) => {
      e.preventDefault();
      if (canGoBack) {
        goBack();
      } else if (hasFallback) {
        navigate(fallback);
      }
    };
    const historyTo = canGoBack ? history.at(-1) : void 0;
    const toWithFallback = historyTo ?? fallback;
    return /* @__PURE__ */ jsx(
      Link,
      {
        ref,
        tag: NavLink,
        to: toWithFallback,
        onClick: handleClick,
        disabled: shouldBeDisabled,
        "aria-disabled": shouldBeDisabled,
        startIcon: /* @__PURE__ */ jsx(ArrowLeft, {}),
        children: formatMessage({
          id: "global.back",
          defaultMessage: "Back"
        })
      }
    );
  }
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});
const Providers = ({ children, strapi, store }) => {
  return /* @__PURE__ */ jsx(
    StrapiAppProvider,
    {
      components: strapi.library.components,
      customFields: strapi.customFields,
      fields: strapi.library.fields,
      menu: strapi.router.menu,
      getAdminInjectedComponents: strapi.getAdminInjectedComponents,
      getPlugin: strapi.getPlugin,
      plugins: strapi.plugins,
      rbac: strapi.rbac,
      runHookParallel: strapi.runHookParallel,
      runHookWaterfall: (name, initialValue) => strapi.runHookWaterfall(name, initialValue, store),
      runHookSeries: strapi.runHookSeries,
      settings: strapi.router.settings,
      children: /* @__PURE__ */ jsx(Provider$1, { store, children: /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsx(HistoryProvider, { children: /* @__PURE__ */ jsx(LanguageProvider, { messages: strapi.configurations.translations, children: /* @__PURE__ */ jsx(Theme, { themes: strapi.configurations.themes, children: /* @__PURE__ */ jsx(NotificationsProvider, { children: /* @__PURE__ */ jsx(TrackingProvider, { children: /* @__PURE__ */ jsx(GuidedTourProvider, { children: /* @__PURE__ */ jsx(
        ConfigurationProvider,
        {
          defaultAuthLogo: strapi.configurations.authLogo,
          defaultMenuLogo: strapi.configurations.menuLogo,
          showTutorials: strapi.configurations.tutorials,
          showReleaseNotification: strapi.configurations.notifications.releases,
          children
        }
      ) }) }) }) }) }) }) }) }) })
    }
  );
};

const App = ({ strapi, store }) => {
  useEffect(() => {
    const language = localStorage.getItem(LANGUAGE_LOCAL_STORAGE_KEY) || "en";
    if (language) {
      document.documentElement.lang = language;
    }
  }, []);
  return /* @__PURE__ */ jsx(Providers, { strapi, store, children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(Page.Loading, {}), children: /* @__PURE__ */ jsx(Outlet, {}) }) });
};

const useClipboard = () => {
  const copy = useCallback(async (value) => {
    try {
      if (typeof value !== "string" && typeof value !== "number") {
        throw new Error(
          `Cannot copy typeof ${typeof value} to clipboard, must be a string or number`
        );
      } else if (value === "") {
        throw new Error(`Cannot copy empty string to clipboard.`);
      }
      const stringifiedValue = value.toString();
      await navigator.clipboard.writeText(stringifiedValue);
      return true;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("Copy failed", error);
      }
      return false;
    }
  }, []);
  return { copy };
};

const ErrorElement = () => {
  const error = useRouteError();
  const { formatMessage } = useIntl();
  const { copy } = useClipboard();
  if (error instanceof Error) {
    console.error(error);
    const handleClick = async () => {
      await copy(`
\`\`\`
${error.stack}
\`\`\`
      `);
    };
    return /* @__PURE__ */ jsx(Main, { height: "100%", children: /* @__PURE__ */ jsx(Flex, { alignItems: "center", height: "100%", justifyContent: "center", children: /* @__PURE__ */ jsxs(
      Flex,
      {
        gap: 7,
        padding: 7,
        direction: "column",
        width: "35%",
        shadow: "tableShadow",
        borderColor: "neutral150",
        background: "neutral0",
        hasRadius: true,
        maxWidth: "512px",
        children: [
          /* @__PURE__ */ jsxs(Flex, { direction: "column", gap: 2, children: [
            /* @__PURE__ */ jsx(WarningCircle, { width: "32px", height: "32px", fill: "danger600" }),
            /* @__PURE__ */ jsx(Typography, { fontSize: 4, fontWeight: "bold", textAlign: "center", children: formatMessage({
              id: "app.error",
              defaultMessage: "Something went wrong"
            }) }),
            /* @__PURE__ */ jsx(Typography, { variant: "omega", textAlign: "center", children: formatMessage(
              {
                id: "app.error.message",
                defaultMessage: `It seems like there is a bug in your instance, but we've got you covered. Please notify your technical team so they can investigate the source of the problem and report the issue to us by opening a bug report on {link}.`
              },
              {
                link: /* @__PURE__ */ jsx(
                  Link,
                  {
                    isExternal: true,
                    endIcon: true,
                    href: "https://github.com/strapi/strapi/issues/new?assignees=&labels=&projects=&template=BUG_REPORT.md",
                    children: `Strapi's GitHub`
                  }
                )
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs(Flex, { gap: 4, direction: "column", width: "100%", children: [
            /* @__PURE__ */ jsx(StyledAlert, { onClose: () => {
            }, width: "100%", closeLabel: "", variant: "danger", children: /* @__PURE__ */ jsx(ErrorType, { children: error.message }) }),
            /* @__PURE__ */ jsx(Button, { onClick: handleClick, variant: "tertiary", startIcon: /* @__PURE__ */ jsx(Duplicate, {}), children: formatMessage({
              id: "app.error.copy",
              defaultMessage: "Copy to clipboard"
            }) })
          ] })
        ]
      }
    ) }) });
  }
  throw error;
};
const StyledAlert = styled(Alert)`
  & > div:first-child {
    display: none;
  }

  & > button {
    display: none;
  }
`;
const ErrorType = styled(Typography)`
  word-break: break-all;
  color: ${({ theme }) => theme.colors.danger600};
`;

const ActionLayout = ({ startActions, endActions }) => {
  if (!startActions && !endActions) {
    return null;
  }
  return /* @__PURE__ */ jsxs(
    Flex,
    {
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingBottom: 4,
      paddingLeft: 10,
      paddingRight: 10,
      children: [
        /* @__PURE__ */ jsx(Flex, { gap: 2, wrap: "wrap", children: startActions }),
        /* @__PURE__ */ jsx(Flex, { gap: 2, shrink: 0, wrap: "wrap", children: endActions })
      ]
    }
  );
};

const ContentLayout = ({ children }) => {
  return /* @__PURE__ */ jsx(Box, { paddingLeft: 10, paddingRight: 10, children });
};

const GridColSize = {
  S: 180,
  M: 250
};
const StyledGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(${({ $size }) => `${GridColSize[$size]}px`}, 1fr)
  );
  grid-gap: ${({ theme }) => theme.spaces[4]};
`;
const GridLayout = ({ size, children }) => {
  return /* @__PURE__ */ jsx(StyledGrid, { $size: size, children });
};

const BaseHeaderLayout = React.forwardRef(
  ({ navigationAction, primaryAction, secondaryAction, subtitle, title, sticky, width, ...props }, ref) => {
    const isSubtitleString = typeof subtitle === "string";
    if (sticky) {
      return /* @__PURE__ */ jsx(
        Box,
        {
          paddingLeft: 6,
          paddingRight: 6,
          paddingTop: 3,
          paddingBottom: 3,
          position: "fixed",
          top: 0,
          right: 0,
          background: "neutral0",
          shadow: "tableShadow",
          width: `${width}px`,
          zIndex: 1,
          "data-strapi-header-sticky": true,
          children: /* @__PURE__ */ jsxs(Flex, { justifyContent: "space-between", children: [
            /* @__PURE__ */ jsxs(Flex, { children: [
              navigationAction && /* @__PURE__ */ jsx(Box, { paddingRight: 3, children: navigationAction }),
              /* @__PURE__ */ jsxs(Box, { children: [
                /* @__PURE__ */ jsx(Typography, { variant: "beta", tag: "h1", ...props, children: title }),
                isSubtitleString ? /* @__PURE__ */ jsx(Typography, { variant: "pi", textColor: "neutral600", children: subtitle }) : subtitle
              ] }),
              secondaryAction ? /* @__PURE__ */ jsx(Box, { paddingLeft: 4, children: secondaryAction }) : null
            ] }),
            /* @__PURE__ */ jsx(Flex, { children: primaryAction ? /* @__PURE__ */ jsx(Box, { paddingLeft: 2, children: primaryAction }) : void 0 })
          ] })
        }
      );
    }
    return /* @__PURE__ */ jsxs(
      Box,
      {
        ref,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 8,
        paddingTop: navigationAction ? 6 : 8,
        background: "neutral100",
        "data-strapi-header": true,
        children: [
          navigationAction ? /* @__PURE__ */ jsx(Box, { paddingBottom: 2, children: navigationAction }) : null,
          /* @__PURE__ */ jsxs(Flex, { justifyContent: "space-between", children: [
            /* @__PURE__ */ jsxs(Flex, { minWidth: 0, children: [
              /* @__PURE__ */ jsx(Typography, { tag: "h1", variant: "alpha", ...props, children: title }),
              secondaryAction ? /* @__PURE__ */ jsx(Box, { paddingLeft: 4, children: secondaryAction }) : null
            ] }),
            primaryAction
          ] }),
          isSubtitleString ? /* @__PURE__ */ jsx(Typography, { variant: "epsilon", textColor: "neutral600", tag: "p", children: subtitle }) : subtitle
        ]
      }
    );
  }
);
const HeaderLayout = (props) => {
  const baseHeaderLayoutRef = React.useRef(null);
  const [headerSize, setHeaderSize] = React.useState(null);
  const [containerRef, isVisible] = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: 0
  });
  useResizeObserver(containerRef, () => {
    if (containerRef.current) {
      setHeaderSize(containerRef.current.getBoundingClientRect());
    }
  });
  React.useEffect(() => {
    if (baseHeaderLayoutRef.current) {
      setHeaderSize(baseHeaderLayoutRef.current.getBoundingClientRect());
    }
  }, [baseHeaderLayoutRef]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { style: { height: headerSize?.height }, ref: containerRef, children: isVisible && /* @__PURE__ */ jsx(BaseHeaderLayout, { ref: baseHeaderLayoutRef, ...props }) }),
    !isVisible && /* @__PURE__ */ jsx(BaseHeaderLayout, { ...props, sticky: true, width: headerSize?.width })
  ] });
};
HeaderLayout.displayName = "HeaderLayout";
const useElementOnScreen = (options) => {
  const containerRef = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(true);
  const callback = ([entry]) => {
    setIsVisible(entry.isIntersecting);
  };
  React.useEffect(() => {
    const containerEl = containerRef.current;
    const observer = new IntersectionObserver(callback, options);
    if (containerEl) {
      observer.observe(containerRef.current);
    }
    return () => {
      if (containerEl) {
        observer.disconnect();
      }
    };
  }, [containerRef, options]);
  return [containerRef, isVisible];
};
const useResizeObserver = (sources, onResize) => {
  const handleResize = useCallbackRef(onResize);
  React.useLayoutEffect(() => {
    const resizeObs = new ResizeObserver(handleResize);
    if (Array.isArray(sources)) {
      sources.forEach((source) => {
        if (source.current) {
          resizeObs.observe(source.current);
        }
      });
    } else if (sources.current) {
      resizeObs.observe(sources.current);
    }
    return () => {
      resizeObs.disconnect();
    };
  }, [sources, handleResize]);
};

const GridContainer = styled(Box)`
  display: grid;
  grid-template-columns: ${({ $hasSideNav }) => $hasSideNav ? `auto 1fr` : "1fr"};
`;
const OverflowingItem = styled(Box)`
  overflow-x: hidden;
`;
const RootLayout = ({ sideNav, children }) => {
  return /* @__PURE__ */ jsxs(GridContainer, { $hasSideNav: Boolean(sideNav), children: [
    sideNav,
    /* @__PURE__ */ jsx(OverflowingItem, { paddingBottom: 10, children })
  ] });
};
const Layouts = {
  Root: RootLayout,
  Header: HeaderLayout,
  BaseHeader: BaseHeaderLayout,
  Grid: GridLayout,
  Action: ActionLayout,
  Content: ContentLayout
};

const NotFoundPage = () => {
  const { formatMessage } = useIntl();
  return /* @__PURE__ */ jsxs(Page.Main, { labelledBy: "title", children: [
    /* @__PURE__ */ jsx(
      Layouts.Header,
      {
        id: "title",
        title: formatMessage({
          id: "content-manager.pageNotFound",
          defaultMessage: "Page not found"
        })
      }
    ),
    /* @__PURE__ */ jsx(Layouts.Content, { children: /* @__PURE__ */ jsx(
      EmptyStateLayout,
      {
        action: /* @__PURE__ */ jsx(LinkButton, { tag: Link$1, variant: "secondary", endIcon: /* @__PURE__ */ jsx(ArrowRight, {}), to: "/", children: formatMessage({
          id: "app.components.NotFoundPage.back",
          defaultMessage: "Back to homepage"
        }) }),
        content: formatMessage({
          id: "app.page.not.found",
          defaultMessage: "Oops! We can't seem to find the page you're looging for..."
        }),
        hasRadius: true,
        icon: /* @__PURE__ */ jsx(EmptyPictures, { width: "16rem" }),
        shadow: "tableShadow"
      }
    ) })
  ] });
};

const getEERoutes = () => [
  ...window.strapi.features.isEnabled(window.strapi.features.AUDIT_LOGS) ? [
    {
      path: "audit-logs",
      lazy: async () => {
        const { ProtectedListPage } = await import('./ListPage-CrumFDML.mjs');
        return {
          Component: ProtectedListPage
        };
      }
    }
  ] : [],
  ...window.strapi.features.isEnabled(window.strapi.features.SSO) ? [
    {
      path: "single-sign-on",
      lazy: async () => {
        const { ProtectedSSO } = await import('./SingleSignOnPage-D2mxN9wf.mjs');
        return {
          Component: ProtectedSSO
        };
      }
    }
  ] : []
];

const ERR_MSG = "The Form Component has not been initialised, ensure you are using this hook within a Form component";
const [FormProvider, useForm] = createContext("Form", {
  disabled: false,
  errors: {},
  initialValues: {},
  isSubmitting: false,
  modified: false,
  addFieldRow: () => {
    throw new Error(ERR_MSG);
  },
  moveFieldRow: () => {
    throw new Error(ERR_MSG);
  },
  onChange: () => {
    throw new Error(ERR_MSG);
  },
  removeFieldRow: () => {
    throw new Error(ERR_MSG);
  },
  resetForm: () => {
    throw new Error(ERR_MSG);
  },
  setErrors: () => {
    throw new Error(ERR_MSG);
  },
  setValues: () => {
    throw new Error(ERR_MSG);
  },
  setSubmitting: () => {
    throw new Error(ERR_MSG);
  },
  validate: async () => {
    throw new Error(ERR_MSG);
  },
  values: {}
});
const Form = React.forwardRef(
  ({ disabled = false, method, onSubmit, initialErrors, ...props }, ref) => {
    const formRef = React.useRef(null);
    const initialValues = React.useRef(props.initialValues ?? {});
    const [state, dispatch] = React.useReducer(reducer, {
      errors: initialErrors ?? {},
      isSubmitting: false,
      values: props.initialValues ?? {}
    });
    React.useEffect(() => {
      if (!isEqual(initialValues.current, props.initialValues)) {
        initialValues.current = props.initialValues ?? {};
        dispatch({
          type: "SET_INITIAL_VALUES",
          payload: props.initialValues ?? {}
        });
      }
    }, [props.initialValues]);
    const setErrors = React.useCallback((errors) => {
      dispatch({
        type: "SET_ERRORS",
        payload: errors
      });
    }, []);
    const setValues = React.useCallback((values) => {
      dispatch({
        type: "SET_VALUES",
        payload: values
      });
    }, []);
    React.useEffect(() => {
      if (Object.keys(state.errors).length === 0)
        return;
      const ref2 = setTimeout(() => {
        const [firstError] = formRef.current.querySelectorAll("[data-strapi-field-error]");
        if (firstError) {
          const errorId = firstError.getAttribute("id");
          const formElementInError = formRef.current.querySelector(
            `[aria-describedby="${errorId}"]`
          );
          if (formElementInError && formElementInError instanceof HTMLElement) {
            formElementInError.focus();
          }
        }
      });
      return () => clearTimeout(ref2);
    }, [state.errors]);
    const validate = React.useCallback(
      async (shouldSetErrors = true, options = {}) => {
        setErrors({});
        if (!props.validationSchema && !props.validate) {
          return { data: state.values };
        }
        try {
          let data;
          if (props.validationSchema) {
            data = await props.validationSchema.validate(state.values, { abortEarly: false });
          } else if (props.validate) {
            data = await props.validate(state.values, options);
          } else {
            throw new Error("No validation schema or validate function provided");
          }
          return { data };
        } catch (err) {
          if (isErrorYupValidationError(err)) {
            const errors = getYupValidationErrors(err);
            if (shouldSetErrors) {
              setErrors(errors);
            }
            return { errors };
          } else {
            if (process.env.NODE_ENV !== "production") {
              console.warn(
                `Warning: An unhandled error was caught during validation in <Form validationSchema />`,
                err
              );
            }
            throw err;
          }
        }
      },
      [props, setErrors, state.values]
    );
    const handleSubmit = async (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!onSubmit) {
        return;
      }
      dispatch({
        type: "SUBMIT_ATTEMPT"
      });
      try {
        const { data, errors } = await validate();
        if (errors) {
          setErrors(errors);
          throw new Error("Submission failed");
        }
        await onSubmit(data, {
          setErrors,
          setValues,
          resetForm
        });
        dispatch({
          type: "SUBMIT_SUCCESS"
        });
      } catch (err) {
        dispatch({
          type: "SUBMIT_FAILURE"
        });
        if (err instanceof Error && err.message === "Submission failed") {
          return;
        }
      }
    };
    const modified = React.useMemo(
      () => !isEqual(initialValues.current, state.values),
      [state.values]
    );
    const handleChange = useCallbackRef((eventOrPath, v) => {
      if (typeof eventOrPath === "string") {
        dispatch({
          type: "SET_FIELD_VALUE",
          payload: {
            field: eventOrPath,
            value: v
          }
        });
        return;
      }
      const target = eventOrPath.target || eventOrPath.currentTarget;
      const { type, name, id, value, options, multiple } = target;
      const field = name || id;
      if (!field && process.env.NODE_ENV !== "production") {
        console.warn(
          `\`onChange\` was called with an event, but you forgot to pass a \`name\` or \`id'\` attribute to your input. The field to update cannot be determined`
        );
      }
      let val;
      if (/number|range/.test(type)) {
        const parsed = parseFloat(value);
        val = isNaN(parsed) ? "" : parsed;
      } else if (/checkbox/.test(type)) {
        val = !getIn(state.values, field);
      } else if (options && multiple) {
        val = Array.from(options).filter((el) => el.selected).map((el) => el.value);
      } else {
        if (value === "") {
          val = null;
        } else {
          val = value;
        }
      }
      if (field) {
        dispatch({
          type: "SET_FIELD_VALUE",
          payload: {
            field,
            value: val
          }
        });
      }
    });
    const addFieldRow = React.useCallback(
      (field, value, addAtIndex) => {
        dispatch({
          type: "ADD_FIELD_ROW",
          payload: {
            field,
            value,
            addAtIndex
          }
        });
      },
      []
    );
    const removeFieldRow = React.useCallback(
      (field, removeAtIndex) => {
        dispatch({
          type: "REMOVE_FIELD_ROW",
          payload: {
            field,
            removeAtIndex
          }
        });
      },
      []
    );
    const moveFieldRow = React.useCallback(
      (field, fromIndex, toIndex) => {
        dispatch({
          type: "MOVE_FIELD_ROW",
          payload: {
            field,
            fromIndex,
            toIndex
          }
        });
      },
      []
    );
    const resetForm = React.useCallback(() => {
      dispatch({
        type: "RESET_FORM",
        payload: {
          errors: {},
          isSubmitting: false,
          values: initialValues.current
        }
      });
    }, []);
    const setSubmitting = React.useCallback((isSubmitting) => {
      dispatch({ type: "SET_ISSUBMITTING", payload: isSubmitting });
    }, []);
    const composedRefs = useComposedRefs(formRef, ref);
    return /* @__PURE__ */ jsx("form", { ref: composedRefs, method, noValidate: true, onSubmit: handleSubmit, children: /* @__PURE__ */ jsx(
      FormProvider,
      {
        disabled,
        onChange: handleChange,
        initialValues: initialValues.current,
        modified,
        addFieldRow,
        moveFieldRow,
        removeFieldRow,
        resetForm,
        setErrors,
        setValues,
        setSubmitting,
        validate,
        ...state,
        children: typeof props.children === "function" ? props.children({
          modified,
          disabled,
          onChange: handleChange,
          ...state,
          setErrors,
          resetForm
        }) : props.children
      }
    ) });
  }
);
const isErrorYupValidationError = (err) => typeof err === "object" && err !== null && "name" in err && typeof err.name === "string" && err.name === "ValidationError";
const getYupValidationErrors = (err) => {
  let errors = {};
  if (err.inner) {
    if (err.inner.length === 0) {
      return setIn(errors, err.path, err.message);
    }
    for (const error of err.inner) {
      if (!getIn(errors, error.path)) {
        errors = setIn(errors, error.path, error.message);
      }
    }
  }
  return errors;
};
const reducer = (state, action) => produce(state, (draft) => {
  switch (action.type) {
    case "SET_INITIAL_VALUES":
      draft.values = action.payload;
      break;
    case "SET_VALUES":
      draft.values = action.payload;
      break;
    case "SUBMIT_ATTEMPT":
      draft.isSubmitting = true;
      break;
    case "SUBMIT_FAILURE":
      draft.isSubmitting = false;
      break;
    case "SUBMIT_SUCCESS":
      draft.isSubmitting = false;
      break;
    case "SET_FIELD_VALUE":
      draft.values = setIn(state.values, action.payload.field, action.payload.value);
      break;
    case "ADD_FIELD_ROW": {
      const currentField = getIn(state.values, action.payload.field, []);
      let position = action.payload.addAtIndex;
      if (position === void 0) {
        position = currentField.length;
      } else if (position < 0) {
        position = 0;
      }
      const [key] = generateNKeysBetween(
        currentField.at(position - 1)?.__temp_key__,
        currentField.at(position)?.__temp_key__,
        1
      );
      draft.values = setIn(
        state.values,
        action.payload.field,
        setIn(currentField, position.toString(), { ...action.payload.value, __temp_key__: key })
      );
      break;
    }
    case "MOVE_FIELD_ROW": {
      const { field, fromIndex, toIndex } = action.payload;
      const currentField = [...getIn(state.values, field, [])];
      const currentRow = currentField[fromIndex];
      const startKey = fromIndex > toIndex ? currentField[toIndex - 1]?.__temp_key__ : currentField[toIndex]?.__temp_key__;
      const endKey = fromIndex > toIndex ? currentField[toIndex]?.__temp_key__ : currentField[toIndex + 1]?.__temp_key__;
      const [newKey] = generateNKeysBetween(startKey, endKey, 1);
      currentField.splice(fromIndex, 1);
      currentField.splice(toIndex, 0, { ...currentRow, __temp_key__: newKey });
      draft.values = setIn(state.values, field, currentField);
      break;
    }
    case "REMOVE_FIELD_ROW": {
      const currentField = getIn(state.values, action.payload.field, []);
      let position = action.payload.removeAtIndex;
      if (position === void 0) {
        position = currentField.length - 1;
      } else if (position < 0) {
        position = 0;
      }
      const newValue = setIn(currentField, position.toString(), void 0).filter(
        (val) => val
      );
      draft.values = setIn(
        state.values,
        action.payload.field,
        newValue.length > 0 ? newValue : []
      );
      break;
    }
    case "SET_ERRORS":
      if (!isEqual(state.errors, action.payload)) {
        draft.errors = action.payload;
      }
      break;
    case "SET_ISSUBMITTING":
      draft.isSubmitting = action.payload;
      break;
    case "RESET_FORM":
      draft.values = action.payload.values;
      draft.errors = action.payload.errors;
      draft.isSubmitting = action.payload.isSubmitting;
      break;
  }
});
const useField = (path) => {
  const { formatMessage } = useIntl();
  const initialValue = useForm(
    "useField",
    (state) => getIn(state.initialValues, path)
  );
  const value = useForm(
    "useField",
    (state) => getIn(state.values, path)
  );
  const handleChange = useForm("useField", (state) => state.onChange);
  const rawError = useForm("useField", (state) => getIn(state.errors, path));
  const error = useForm("useField", (state) => {
    const error2 = getIn(state.errors, path);
    if (isErrorMessageDescriptor(error2)) {
      const { values, ...message } = error2;
      return formatMessage(message, values);
    }
    return error2;
  });
  return {
    initialValue,
    /**
     * Errors can be a string, or a MessageDescriptor, so we need to handle both cases.
     * If it's anything else, we don't return it.
     */
    rawError,
    error: isErrorMessageDescriptor(error) ? formatMessage(
      {
        id: error.id,
        defaultMessage: error.defaultMessage
      },
      error.values
    ) : typeof error === "string" ? error : void 0,
    onChange: handleChange,
    value
  };
};
const isErrorMessageDescriptor = (object) => {
  return typeof object === "object" && object !== null && !Array.isArray(object) && "id" in object && "defaultMessage" in object;
};
const Blocker = ({ onProceed = () => {
}, onCancel = () => {
} }) => {
  const { formatMessage } = useIntl();
  const modified = useForm("Blocker", (state) => state.modified);
  const isSubmitting = useForm("Blocker", (state) => state.isSubmitting);
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    return !isSubmitting && modified && (currentLocation.pathname !== nextLocation.pathname || currentLocation.search !== nextLocation.search);
  });
  if (blocker.state === "blocked") {
    const handleCancel = (isOpen) => {
      if (!isOpen) {
        onCancel();
        blocker.reset();
      }
    };
    return /* @__PURE__ */ jsx(Dialog.Root, { open: true, onOpenChange: handleCancel, children: /* @__PURE__ */ jsxs(Dialog.Content, { children: [
      /* @__PURE__ */ jsx(Dialog.Header, { children: formatMessage({
        id: "app.components.ConfirmDialog.title",
        defaultMessage: "Confirmation"
      }) }),
      /* @__PURE__ */ jsx(Dialog.Body, { icon: /* @__PURE__ */ jsx(WarningCircle, { width: "24px", height: "24px", fill: "danger600" }), children: formatMessage({
        id: "global.prompt.unsaved",
        defaultMessage: "You have unsaved changes, are you sure you want to leave?"
      }) }),
      /* @__PURE__ */ jsxs(Dialog.Footer, { children: [
        /* @__PURE__ */ jsx(Dialog.Cancel, { children: /* @__PURE__ */ jsx(Button, { variant: "tertiary", children: formatMessage({
          id: "app.components.Button.cancel",
          defaultMessage: "Cancel"
        }) }) }),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: () => {
              onProceed();
              blocker.proceed();
            },
            variant: "danger",
            children: formatMessage({
              id: "app.components.Button.confirm",
              defaultMessage: "Confirm"
            })
          }
        )
      ] })
    ] }) });
  }
  return null;
};

const useFocusInputField = (name) => {
  const { search: searchString } = useLocation();
  const search = useMemo(() => new URLSearchParams(searchString), [searchString]);
  const [field, setField] = useState(null);
  useEffect(() => {
    if (search.has("field") && search.get("field") === name && field) {
      field.focus();
      field.scrollIntoView({
        block: "center"
      });
    }
  }, [search, name, field]);
  return setField;
};

const BooleanInput = forwardRef(
  ({ name, required, label, hint, labelAction, ...props }, ref) => {
    const { formatMessage } = useIntl();
    const field = useField(name);
    const fieldRef = useFocusInputField(name);
    const composedRefs = useComposedRefs(ref, fieldRef);
    return /* @__PURE__ */ jsxs(Field.Root, { error: field.error, name, hint, required, maxWidth: "320px", children: [
      /* @__PURE__ */ jsx(Field.Label, { action: labelAction, children: label }),
      /* @__PURE__ */ jsx(
        Toggle,
        {
          ref: composedRefs,
          checked: field.value === null ? null : field.value || false,
          offLabel: formatMessage({
            id: "app.components.ToggleCheckbox.off-label",
            defaultMessage: "False"
          }),
          onLabel: formatMessage({
            id: "app.components.ToggleCheckbox.on-label",
            defaultMessage: "True"
          }),
          onChange: field.onChange,
          ...props
        }
      ),
      /* @__PURE__ */ jsx(Field.Hint, {}),
      /* @__PURE__ */ jsx(Field.Error, {})
    ] });
  }
);
const MemoizedBooleanInput = memo(BooleanInput);

const CheckboxInput = forwardRef(
  ({ name, required, label, hint, type: _type, ...props }, ref) => {
    const field = useField(name);
    const fieldRef = useFocusInputField(name);
    const composedRefs = useComposedRefs(ref, fieldRef);
    return /* @__PURE__ */ jsxs(Field.Root, { error: field.error, name, hint, required, children: [
      /* @__PURE__ */ jsx(
        Checkbox,
        {
          onCheckedChange: (checked) => field.onChange(name, !!checked),
          ref: composedRefs,
          checked: field.value,
          ...props,
          children: label || props["aria-label"]
        }
      ),
      /* @__PURE__ */ jsx(Field.Hint, {}),
      /* @__PURE__ */ jsx(Field.Error, {})
    ] });
  }
);
const MemoizedCheckboxInput = memo(CheckboxInput);

const DateInput = forwardRef(
  ({ name, required, label, hint, labelAction, type: _type, ...props }, ref) => {
    const { formatMessage } = useIntl();
    const field = useField(name);
    const fieldRef = useFocusInputField(name);
    const composedRefs = useComposedRefs(ref, fieldRef);
    const value = typeof field.value === "string" ? new Date(field.value) : field.value;
    return /* @__PURE__ */ jsxs(Field.Root, { error: field.error, name, hint, required, children: [
      /* @__PURE__ */ jsx(Field.Label, { action: labelAction, children: label }),
      /* @__PURE__ */ jsx(
        DatePicker,
        {
          ref: composedRefs,
          clearLabel: formatMessage({ id: "clearLabel", defaultMessage: "Clear" }),
          onChange: (date) => {
            field.onChange(name, date ? convertLocalDateToUTCDate(date).toISOString() : null);
          },
          onClear: () => field.onChange(name, null),
          value: value ? convertLocalDateToUTCDate(value) : value,
          ...props
        }
      ),
      /* @__PURE__ */ jsx(Field.Hint, {}),
      /* @__PURE__ */ jsx(Field.Error, {})
    ] });
  }
);
const convertLocalDateToUTCDate = (date) => {
  const utcDateString = date.toISOString();
  const timeZone = getLocalTimeZone();
  const zonedDateTime = parseAbsolute(utcDateString, timeZone);
  return toCalendarDate(zonedDateTime).toDate("UTC");
};
const MemoizedDateInput = memo(DateInput);

const DateTimeInput = forwardRef(
  ({ name, required, label, hint, labelAction, ...props }, ref) => {
    const { formatMessage } = useIntl();
    const field = useField(name);
    const fieldRef = useFocusInputField(name);
    const composedRefs = useComposedRefs(ref, fieldRef);
    const value = typeof field.value === "string" ? new Date(field.value) : field.value;
    return /* @__PURE__ */ jsxs(Field.Root, { error: field.error, name, hint, required, children: [
      /* @__PURE__ */ jsx(Field.Label, { action: labelAction, children: label }),
      /* @__PURE__ */ jsx(
        DateTimePicker,
        {
          ref: composedRefs,
          clearLabel: formatMessage({ id: "clearLabel", defaultMessage: "Clear" }),
          onChange: (date) => {
            field.onChange(name, date ? date.toISOString() : null);
          },
          onClear: () => field.onChange(name, null),
          value,
          ...props
        }
      ),
      /* @__PURE__ */ jsx(Field.Hint, {}),
      /* @__PURE__ */ jsx(Field.Error, {})
    ] });
  }
);
const MemoizedDateTimeInput = memo(DateTimeInput);

const EmailInput = forwardRef(
  ({ name, required, label, hint, labelAction, ...props }, ref) => {
    const field = useField(name);
    const fieldRef = useFocusInputField(name);
    const composedRefs = useComposedRefs(ref, fieldRef);
    return /* @__PURE__ */ jsxs(Field.Root, { error: field.error, name, hint, required, children: [
      /* @__PURE__ */ jsx(Field.Label, { action: labelAction, children: label }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          ref: composedRefs,
          autoComplete: "email",
          onChange: field.onChange,
          value: field.value,
          ...props,
          type: "email"
        }
      ),
      /* @__PURE__ */ jsx(Field.Hint, {}),
      /* @__PURE__ */ jsx(Field.Error, {})
    ] });
  }
);
const MemoizedEmailInput = memo(EmailInput);

const EnumerationInput = forwardRef(
  ({ name, required, label, hint, labelAction, options = [], ...props }, ref) => {
    const { formatMessage } = useIntl();
    const field = useField(name);
    const fieldRef = useFocusInputField(name);
    const composedRefs = useComposedRefs(ref, fieldRef);
    return /* @__PURE__ */ jsxs(Field.Root, { error: field.error, name, hint, required, children: [
      /* @__PURE__ */ jsx(Field.Label, { action: labelAction, children: label }),
      /* @__PURE__ */ jsxs(
        SingleSelect,
        {
          ref: composedRefs,
          onChange: (value) => {
            field.onChange(name, value);
          },
          value: field.value,
          ...props,
          children: [
            /* @__PURE__ */ jsx(SingleSelectOption, { value: "", disabled: required, hidden: required, children: formatMessage({
              id: "components.InputSelect.option.placeholder",
              defaultMessage: "Choose here"
            }) }),
            options.map(({ value, label: label2, disabled, hidden }) => {
              return /* @__PURE__ */ jsx(SingleSelectOption, { value, disabled, hidden, children: label2 ?? value }, value);
            })
          ]
        }
      ),
      /* @__PURE__ */ jsx(Field.Hint, {}),
      /* @__PURE__ */ jsx(Field.Error, {})
    ] });
  }
);
const MemoizedEnumerationInput = memo(EnumerationInput);

const JsonInput = React.forwardRef(
  ({ name, required, label, hint, labelAction, ...props }, ref) => {
    const field = useField(name);
    const fieldRef = useFocusInputField(name);
    const composedRefs = useComposedRefs(ref, fieldRef);
    return /* @__PURE__ */ jsxs(Field.Root, { error: field.error, name, hint, required, children: [
      /* @__PURE__ */ jsx(Field.Label, { action: labelAction, children: label }),
      /* @__PURE__ */ jsx(
        JSONInput,
        {
          ref: composedRefs,
          value: typeof field.value == "object" ? JSON.stringify(field.value, null, 2) : field.value,
          onChange: (json) => {
            const value = required && !json.length ? null : json;
            field.onChange(name, value);
          },
          minHeight: `25.2rem`,
          maxHeight: `50.4rem`,
          ...props
        }
      ),
      /* @__PURE__ */ jsx(Field.Hint, {}),
      /* @__PURE__ */ jsx(Field.Error, {})
    ] });
  }
);
const MemoizedJsonInput = React.memo(JsonInput);

const NumberInputImpl = forwardRef(
  ({ name, required, label, hint, labelAction, type, ...props }, ref) => {
    const field = useField(name);
    const fieldRef = useFocusInputField(name);
    const composedRefs = useComposedRefs(ref, fieldRef);
    return /* @__PURE__ */ jsxs(Field.Root, { error: field.error, name, hint, required, children: [
      /* @__PURE__ */ jsx(Field.Label, { action: labelAction, children: label }),
      /* @__PURE__ */ jsx(
        NumberInput,
        {
          ref: composedRefs,
          onValueChange: (value) => {
            field.onChange(name, value);
          },
          step: type === "float" || type == "decimal" ? 0.01 : 1,
          value: field.value,
          ...props
        }
      ),
      /* @__PURE__ */ jsx(Field.Hint, {}),
      /* @__PURE__ */ jsx(Field.Error, {})
    ] });
  }
);
const MemoizedNumberInput = memo(NumberInputImpl);

const PasswordInput = forwardRef(
  ({ name, required, label, hint, labelAction, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const { formatMessage } = useIntl();
    const field = useField(name);
    const fieldRef = useFocusInputField(name);
    const composedRefs = useComposedRefs(ref, fieldRef);
    return /* @__PURE__ */ jsxs(Field.Root, { error: field.error, name, hint, required, children: [
      /* @__PURE__ */ jsx(Field.Label, { action: labelAction, children: label }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          ref: composedRefs,
          autoComplete: "password",
          endAction: /* @__PURE__ */ jsx(
            Field.Action,
            {
              label: formatMessage({
                id: "Auth.form.password.show-password",
                defaultMessage: "Show password"
              }),
              onClick: () => {
                setShowPassword((prev) => !prev);
              },
              children: showPassword ? /* @__PURE__ */ jsx(Eye, { fill: "neutral500" }) : /* @__PURE__ */ jsx(EyeStriked, { fill: "neutral500" })
            }
          ),
          onChange: field.onChange,
          value: field.value,
          ...props,
          type: showPassword ? "text" : "password"
        }
      ),
      /* @__PURE__ */ jsx(Field.Hint, {}),
      /* @__PURE__ */ jsx(Field.Error, {})
    ] });
  }
);
const MemoizedPasswordInput = memo(PasswordInput);

const StringInput = forwardRef(
  ({ name, required, label, hint, labelAction, ...props }, ref) => {
    const field = useField(name);
    const fieldRef = useFocusInputField(name);
    const composedRefs = useComposedRefs(ref, fieldRef);
    return /* @__PURE__ */ jsxs(Field.Root, { error: field.error, name, hint, required, children: [
      /* @__PURE__ */ jsx(Field.Label, { action: labelAction, children: label }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          ref: composedRefs,
          onChange: field.onChange,
          value: field.value ?? "",
          ...props
        }
      ),
      /* @__PURE__ */ jsx(Field.Hint, {}),
      /* @__PURE__ */ jsx(Field.Error, {})
    ] });
  }
);
const MemoizedStringInput = memo(StringInput);

const TextareaInput = forwardRef(
  ({ name, required, label, hint, labelAction, ...props }, ref) => {
    const field = useField(name);
    const fieldRef = useFocusInputField(name);
    const composedRefs = useComposedRefs(ref, fieldRef);
    return /* @__PURE__ */ jsxs(Field.Root, { error: field.error, name, hint, required, children: [
      /* @__PURE__ */ jsx(Field.Label, { action: labelAction, children: label }),
      /* @__PURE__ */ jsx(
        Textarea,
        {
          ref: composedRefs,
          onChange: field.onChange,
          value: field.value ?? "",
          ...props
        }
      ),
      /* @__PURE__ */ jsx(Field.Hint, {}),
      /* @__PURE__ */ jsx(Field.Error, {})
    ] });
  }
);
const MemoizedTextareaInput = memo(TextareaInput);

const TimeInput = forwardRef(
  ({ name, required, label, hint, labelAction, ...props }, ref) => {
    const { formatMessage } = useIntl();
    const field = useField(name);
    const fieldRef = useFocusInputField(name);
    const composedRefs = useComposedRefs(ref, fieldRef);
    return /* @__PURE__ */ jsxs(Field.Root, { error: field.error, name, hint, required, children: [
      /* @__PURE__ */ jsx(Field.Label, { action: labelAction, children: label }),
      /* @__PURE__ */ jsx(
        TimePicker,
        {
          ref: composedRefs,
          clearLabel: formatMessage({ id: "clearLabel", defaultMessage: "Clear" }),
          onChange: (time) => {
            field.onChange(name, `${time}:00.000`);
          },
          onClear: () => field.onChange(name, void 0),
          value: field.value ?? "",
          ...props
        }
      ),
      /* @__PURE__ */ jsx(Field.Hint, {}),
      /* @__PURE__ */ jsx(Field.Error, {})
    ] });
  }
);
const MemoizedTimeInput = memo(TimeInput);

const InputRenderer = memo(
  forwardRef((props, forwardRef2) => {
    switch (props.type) {
      case "biginteger":
      case "timestamp":
      case "string":
      case "uid":
        return /* @__PURE__ */ jsx(MemoizedStringInput, { ref: forwardRef2, ...props });
      case "boolean":
        return /* @__PURE__ */ jsx(MemoizedBooleanInput, { ref: forwardRef2, ...props });
      case "checkbox":
        return /* @__PURE__ */ jsx(MemoizedCheckboxInput, { ref: forwardRef2, ...props });
      case "datetime":
        return /* @__PURE__ */ jsx(MemoizedDateTimeInput, { ref: forwardRef2, ...props });
      case "date":
        return /* @__PURE__ */ jsx(MemoizedDateInput, { ref: forwardRef2, ...props });
      case "decimal":
      case "float":
      case "integer":
        return /* @__PURE__ */ jsx(MemoizedNumberInput, { ref: forwardRef2, ...props });
      case "json":
        return /* @__PURE__ */ jsx(MemoizedJsonInput, { ref: forwardRef2, ...props });
      case "email":
        return /* @__PURE__ */ jsx(MemoizedEmailInput, { ref: forwardRef2, ...props });
      case "enumeration":
        return /* @__PURE__ */ jsx(MemoizedEnumerationInput, { ref: forwardRef2, ...props });
      case "password":
        return /* @__PURE__ */ jsx(MemoizedPasswordInput, { ref: forwardRef2, ...props });
      case "text":
        return /* @__PURE__ */ jsx(MemoizedTextareaInput, { ref: forwardRef2, ...props });
      case "time":
        return /* @__PURE__ */ jsx(MemoizedTimeInput, { ref: forwardRef2, ...props });
      default:
        return /* @__PURE__ */ jsx(NotSupportedField, { ref: forwardRef2, ...props });
    }
  })
);
const NotSupportedField = forwardRef(
  ({ label, hint, name, required, type, labelAction }, ref) => {
    const { error } = useField(name);
    const fieldRef = useFocusInputField(name);
    const composedRefs = useComposedRefs(ref, fieldRef);
    return /* @__PURE__ */ jsxs(Field.Root, { error, name, hint, required, children: [
      /* @__PURE__ */ jsx(Field.Label, { action: labelAction, children: label }),
      /* @__PURE__ */ jsx(
        TextInput,
        {
          ref: composedRefs,
          disabled: true,
          placeholder: `Unsupported field type: ${type}`,
          required,
          type: "text",
          value: ""
        }
      ),
      /* @__PURE__ */ jsx(Field.Hint, {}),
      /* @__PURE__ */ jsx(Field.Error, {})
    ] });
  }
);
const MemoizedInputRenderer = memo(InputRenderer);

const Img = styled.img`
  height: 7.2rem;
`;
const Logo = () => {
  const {
    logos: { auth }
  } = useConfiguration("UnauthenticatedLogo");
  return /* @__PURE__ */ jsx(Img, { src: auth?.custom?.url || auth.default, "aria-hidden": true, alt: "" });
};

const Wrapper = styled(Box)`
  margin: 0 auto;
  width: 552px;
`;
const Column = styled(Flex)`
  flex-direction: column;
`;
const LocaleToggle = () => {
  const localeNames = useTypedSelector((state) => state.admin_app.language.localeNames);
  const dispatch = useTypedDispatch();
  const { formatMessage, locale } = useIntl();
  return /* @__PURE__ */ jsx(
    SingleSelect,
    {
      "aria-label": formatMessage({
        id: "global.localeToggle.label",
        defaultMessage: "Select interface language"
      }),
      value: locale,
      onChange: (language) => {
        dispatch(setLocale(language));
      },
      children: Object.entries(localeNames).map(([language, name]) => /* @__PURE__ */ jsx(SingleSelectOption, { value: language, children: name }, language))
    }
  );
};
const LayoutContent = ({ children }) => /* @__PURE__ */ jsx(
  Wrapper,
  {
    shadow: "tableShadow",
    hasRadius: true,
    paddingTop: 9,
    paddingBottom: 9,
    paddingLeft: 10,
    paddingRight: 10,
    background: "neutral0",
    children
  }
);
const UnauthenticatedLayout = ({ children }) => {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(Flex, { tag: "header", justifyContent: "flex-end", children: /* @__PURE__ */ jsx(Box, { paddingTop: 6, paddingRight: 8, children: /* @__PURE__ */ jsx(LocaleToggle, {}) }) }),
    /* @__PURE__ */ jsx(Box, { paddingTop: 2, paddingBottom: 11, children })
  ] });
};

const errorsTrads = {
  email: {
    id: "components.Input.error.validation.email",
    defaultMessage: "This is not a valid email."
  },
  json: {
    id: "components.Input.error.validation.json",
    defaultMessage: "This doesn't match the JSON format"
  },
  lowercase: {
    id: "components.Input.error.validation.lowercase",
    defaultMessage: "The value must be a lowercase string"
  },
  max: {
    id: "components.Input.error.validation.max",
    defaultMessage: "The value is too high (max: {max})."
  },
  maxLength: {
    id: "components.Input.error.validation.maxLength",
    defaultMessage: "The value is too long (max: {max})."
  },
  min: {
    id: "components.Input.error.validation.min",
    defaultMessage: "The value is too low (min: {min})."
  },
  minLength: {
    id: "components.Input.error.validation.minLength",
    defaultMessage: "The value is too short (min: {min})."
  },
  regex: {
    id: "components.Input.error.validation.regex",
    defaultMessage: "The value does not match the regex."
  },
  required: {
    id: "components.Input.error.validation.required",
    defaultMessage: "This value is required."
  },
  string: {
    id: "components.Input.error.validation.string",
    defaultMessage: "This is not a valid string."
  },
  unique: {
    id: "components.Input.error.validation.unique",
    defaultMessage: "This value is already used."
  },
  integer: {
    id: "component.Input.error.validation.integer",
    defaultMessage: "The value must be an integer"
  }
};

const LOGIN_SCHEMA = yup.object().shape({
  email: yup.string().nullable().email({
    id: errorsTrads.email.id,
    defaultMessage: "Not a valid email"
  }).required(errorsTrads.required),
  password: yup.string().required(errorsTrads.required).nullable(),
  rememberMe: yup.bool().nullable()
});
const Login = ({ children }) => {
  const [apiError, setApiError] = React.useState();
  const { formatMessage } = useIntl();
  const { search: searchString } = useLocation();
  const query = React.useMemo(() => new URLSearchParams(searchString), [searchString]);
  const navigate = useNavigate();
  const { login } = useAuth("Login", (auth) => auth);
  const handleLogin = async (body) => {
    setApiError(void 0);
    const res = await login(body);
    if ("error" in res) {
      const message = res.error.message ?? "Something went wrong";
      if (camelCase(message).toLowerCase() === "usernotactive") {
        navigate("/auth/oops");
        return;
      }
      setApiError(message);
    } else {
      const redirectTo = query.get("redirectTo");
      const redirectUrl = redirectTo ? decodeURIComponent(redirectTo) : "/";
      navigate(redirectUrl);
    }
  };
  return /* @__PURE__ */ jsx(UnauthenticatedLayout, { children: /* @__PURE__ */ jsxs(Main, { children: [
    /* @__PURE__ */ jsxs(LayoutContent, { children: [
      /* @__PURE__ */ jsxs(Column, { children: [
        /* @__PURE__ */ jsx(Logo, {}),
        /* @__PURE__ */ jsx(Box, { paddingTop: 6, paddingBottom: 1, children: /* @__PURE__ */ jsx(Typography, { variant: "alpha", tag: "h1", children: formatMessage({
          id: "Auth.form.welcome.title",
          defaultMessage: "Welcome!"
        }) }) }),
        /* @__PURE__ */ jsx(Box, { paddingBottom: 7, children: /* @__PURE__ */ jsx(Typography, { variant: "epsilon", textColor: "neutral600", children: formatMessage({
          id: "Auth.form.welcome.subtitle",
          defaultMessage: "Log in to your Strapi account"
        }) }) }),
        apiError ? /* @__PURE__ */ jsx(Typography, { id: "global-form-error", role: "alert", tabIndex: -1, textColor: "danger600", children: apiError }) : null
      ] }),
      /* @__PURE__ */ jsx(
        Form,
        {
          method: "PUT",
          initialValues: {
            email: "",
            password: "",
            rememberMe: false
          },
          onSubmit: (values) => {
            handleLogin(values);
          },
          validationSchema: LOGIN_SCHEMA,
          children: /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "stretch", gap: 6, children: [
            [
              {
                label: formatMessage({ id: "Auth.form.email.label", defaultMessage: "Email" }),
                name: "email",
                placeholder: formatMessage({
                  id: "Auth.form.email.placeholder",
                  defaultMessage: "kai@doe.com"
                }),
                required: true,
                type: "string"
              },
              {
                label: formatMessage({
                  id: "global.password",
                  defaultMessage: "Password"
                }),
                name: "password",
                required: true,
                type: "password"
              },
              {
                label: formatMessage({
                  id: "Auth.form.rememberMe.label",
                  defaultMessage: "Remember me"
                }),
                name: "rememberMe",
                type: "checkbox"
              }
            ].map((field) => /* @__PURE__ */ jsx(MemoizedInputRenderer, { ...field }, field.name)),
            /* @__PURE__ */ jsx(Button, { fullWidth: true, type: "submit", children: formatMessage({ id: "Auth.form.button.login", defaultMessage: "Login" }) })
          ] })
        }
      ),
      children
    ] }),
    /* @__PURE__ */ jsx(Flex, { justifyContent: "center", children: /* @__PURE__ */ jsx(Box, { paddingTop: 4, children: /* @__PURE__ */ jsx(Link, { isExternal: false, tag: NavLink, to: "/auth/forgot-password", children: formatMessage({
      id: "Auth.link.forgot-password",
      defaultMessage: "Forgot your password?"
    }) }) }) })
  ] }) });
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { _unstableFormatAPIError: formatAPIError } = useAPIErrorHandler();
  const [forgotPassword, { error }] = useForgotPasswordMutation();
  return /* @__PURE__ */ jsx(UnauthenticatedLayout, { children: /* @__PURE__ */ jsxs(Main, { children: [
    /* @__PURE__ */ jsxs(LayoutContent, { children: [
      /* @__PURE__ */ jsxs(Column, { children: [
        /* @__PURE__ */ jsx(Logo, {}),
        /* @__PURE__ */ jsx(Box, { paddingTop: 6, paddingBottom: 7, children: /* @__PURE__ */ jsx(Typography, { tag: "h1", variant: "alpha", children: formatMessage({
          id: "Auth.form.button.password-recovery",
          defaultMessage: "Password Recovery"
        }) }) }),
        error ? /* @__PURE__ */ jsx(Typography, { id: "global-form-error", role: "alert", tabIndex: -1, textColor: "danger600", children: isBaseQueryError(error) ? formatAPIError(error) : formatMessage({
          id: "notification.error",
          defaultMessage: "An error occurred"
        }) }) : null
      ] }),
      /* @__PURE__ */ jsx(
        Form,
        {
          method: "POST",
          initialValues: {
            email: ""
          },
          onSubmit: async (body) => {
            const res = await forgotPassword(body);
            if (!("error" in res)) {
              navigate("/auth/forgot-password-success");
            }
          },
          validationSchema: yup.object().shape({
            email: yup.string().email(errorsTrads.email).required({
              id: errorsTrads.required.id,
              defaultMessage: "This field is required."
            }).nullable()
          }),
          children: /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "stretch", gap: 6, children: [
            [
              {
                label: formatMessage({ id: "Auth.form.email.label", defaultMessage: "Email" }),
                name: "email",
                placeholder: formatMessage({
                  id: "Auth.form.email.placeholder",
                  defaultMessage: "kai@doe.com"
                }),
                required: true,
                type: "string"
              }
            ].map((field) => /* @__PURE__ */ jsx(MemoizedInputRenderer, { ...field }, field.name)),
            /* @__PURE__ */ jsx(Button, { type: "submit", fullWidth: true, children: formatMessage({
              id: "Auth.form.button.forgot-password",
              defaultMessage: "Send Email"
            }) })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Flex, { justifyContent: "center", children: /* @__PURE__ */ jsx(Box, { paddingTop: 4, children: /* @__PURE__ */ jsx(Link, { tag: NavLink, to: "/auth/login", children: formatMessage({ id: "Auth.link.ready", defaultMessage: "Ready to sign in?" }) }) }) })
  ] }) });
};

const ForgotPasswordSuccess = () => {
  const { formatMessage } = useIntl();
  return /* @__PURE__ */ jsx(UnauthenticatedLayout, { children: /* @__PURE__ */ jsxs(Main, { children: [
    /* @__PURE__ */ jsx(LayoutContent, { children: /* @__PURE__ */ jsxs(Column, { children: [
      /* @__PURE__ */ jsx(Logo, {}),
      /* @__PURE__ */ jsx(Box, { paddingTop: 6, paddingBottom: 7, children: /* @__PURE__ */ jsx(Typography, { tag: "h1", variant: "alpha", children: formatMessage({
        id: "app.containers.AuthPage.ForgotPasswordSuccess.title",
        defaultMessage: "Email sent"
      }) }) }),
      /* @__PURE__ */ jsx(Typography, { children: formatMessage({
        id: "app.containers.AuthPage.ForgotPasswordSuccess.text.email",
        defaultMessage: "It can take a few minutes to receive your password recovery link."
      }) }),
      /* @__PURE__ */ jsx(Box, { paddingTop: 4, children: /* @__PURE__ */ jsx(Typography, { children: formatMessage({
        id: "app.containers.AuthPage.ForgotPasswordSuccess.text.contact-admin",
        defaultMessage: "If you do not receive this link, please contact your administrator."
      }) }) })
    ] }) }),
    /* @__PURE__ */ jsx(Flex, { justifyContent: "center", children: /* @__PURE__ */ jsx(Box, { paddingTop: 4, children: /* @__PURE__ */ jsx(Link, { tag: NavLink, to: "/auth/login", children: formatMessage({ id: "Auth.link.signin", defaultMessage: "Sign in" }) }) }) })
  ] }) });
};

const Oops = () => {
  const { formatMessage } = useIntl();
  const { search: searchString } = useLocation();
  const query = React.useMemo(() => new URLSearchParams(searchString), [searchString]);
  const message = query.get("info") || formatMessage({
    id: "Auth.components.Oops.text",
    defaultMessage: "Your account has been suspended."
  });
  return /* @__PURE__ */ jsx(UnauthenticatedLayout, { children: /* @__PURE__ */ jsxs(Main, { children: [
    /* @__PURE__ */ jsx(LayoutContent, { children: /* @__PURE__ */ jsxs(Column, { children: [
      /* @__PURE__ */ jsx(Logo, {}),
      /* @__PURE__ */ jsx(Box, { paddingTop: 6, paddingBottom: 7, children: /* @__PURE__ */ jsx(Typography, { tag: "h1", variant: "alpha", children: formatMessage({ id: "Auth.components.Oops.title", defaultMessage: "Oops..." }) }) }),
      /* @__PURE__ */ jsx(Typography, { children: message }),
      /* @__PURE__ */ jsx(Box, { paddingTop: 4, children: /* @__PURE__ */ jsx(Typography, { children: formatMessage({
        id: "Auth.components.Oops.text.admin",
        defaultMessage: "If this is a mistake, please contact your administrator."
      }) }) })
    ] }) }),
    /* @__PURE__ */ jsx(Flex, { justifyContent: "center", children: /* @__PURE__ */ jsx(Box, { paddingTop: 4, children: /* @__PURE__ */ jsx(Link, { tag: NavLink, to: "/auth/login", children: formatMessage({ id: "Auth.link.signin", defaultMessage: "Sign in" }) }) }) })
  ] }) });
};

const usePersistentState = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    if (stickyValue !== null) {
      try {
        return JSON.parse(stickyValue);
      } catch {
        return stickyValue;
      }
    }
    return defaultValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
};

const FieldWrapper = styled(Field.Root)`
  height: 3.2rem;
  width: 3.2rem;

  > label,
  ~ input {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  > label {
    color: inherit;
    cursor: pointer;
    padding: ${({ theme }) => theme.spaces[2]};
    text-align: center;
    vertical-align: middle;
  }

  &:hover,
  &:focus-within {
    background-color: ${({ theme }) => theme.colors.neutral0};
  }

  &:active,
  &.selected {
    color: ${({ theme }) => theme.colors.primary700};
    background-color: ${({ theme }) => theme.colors.neutral0};
    border-color: ${({ theme }) => theme.colors.primary700};
  }
`;
const delays = {
  postResponse: 90 * 24 * 60 * 60 * 1e3,
  // 90 days in ms
  postFirstDismissal: 14 * 24 * 60 * 60 * 1e3,
  // 14 days in ms
  postSubsequentDismissal: 90 * 24 * 60 * 60 * 1e3,
  // 90 days in ms
  display: 30 * 60 * 1e3
  // 30 minutes in ms
};
const ratingArray = [...Array(11).keys()];
const checkIfShouldShowSurvey = (settings) => {
  const { enabled, lastResponseDate, firstDismissalDate, lastDismissalDate } = settings;
  if (window.strapi.flags.nps === false) {
    return false;
  }
  if (enabled === false) {
    return false;
  }
  if (lastResponseDate) {
    const timeSinceLastResponse = Date.now() - new Date(lastResponseDate).getTime();
    if (timeSinceLastResponse >= delays.postResponse) {
      return true;
    }
    return false;
  }
  if (lastDismissalDate) {
    const timeSinceLastDismissal = Date.now() - new Date(lastDismissalDate).getTime();
    if (timeSinceLastDismissal >= delays.postSubsequentDismissal) {
      return true;
    }
    return false;
  }
  if (firstDismissalDate) {
    const timeSinceFirstDismissal = Date.now() - new Date(firstDismissalDate).getTime();
    if (timeSinceFirstDismissal >= delays.postFirstDismissal) {
      return true;
    }
    return false;
  }
  return true;
};
const NpsSurvey = () => {
  const { formatMessage } = useIntl();
  const { npsSurveySettings, setNpsSurveySettings } = useNpsSurveySettings();
  const [isFeedbackResponse, setIsFeedbackResponse] = React.useState(false);
  const { toggleNotification } = useNotification();
  const currentEnvironment = useAppInfo("NpsSurvey", (state) => state.currentEnvironment);
  const strapiVersion = useAppInfo("NpsSurvey", (state) => state.strapiVersion);
  const [surveyIsShown, setSurveyIsShown] = React.useState(
    checkIfShouldShowSurvey(npsSurveySettings)
  );
  const [displaySurvey, setDisplaySurvey] = React.useState(false);
  React.useEffect(() => {
    const displayTime = setTimeout(() => {
      setDisplaySurvey(true);
    }, delays.display);
    return () => {
      clearTimeout(displayTime);
    };
  }, []);
  const { user } = useAuth("NpsSurvey", (auth) => auth);
  if (!displaySurvey) {
    return null;
  }
  if (!surveyIsShown) {
    return null;
  }
  const handleSubmitResponse = async ({
    npsSurveyRating,
    npsSurveyFeedback
  }) => {
    try {
      const body = {
        email: typeof user === "object" && user.email ? user.email : "",
        rating: npsSurveyRating,
        comment: npsSurveyFeedback,
        environment: currentEnvironment,
        version: strapiVersion ?? void 0,
        license: window.strapi.projectType,
        isHostedOnStrapiCloud: process.env.STRAPI_HOSTING === "strapi.cloud"
      };
      const res = await fetch("https://analytics.strapi.io/submit-nps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        throw new Error("Failed to submit NPS survey");
      }
      setNpsSurveySettings((settings) => ({
        ...settings,
        lastResponseDate: (/* @__PURE__ */ new Date()).toString(),
        firstDismissalDate: null,
        lastDismissalDate: null
      }));
      setIsFeedbackResponse(true);
      setTimeout(() => {
        setSurveyIsShown(false);
      }, 3e3);
    } catch (err) {
      toggleNotification({
        type: "danger",
        message: formatMessage({ id: "notification.error", defaultMessage: "An error occurred" })
      });
    }
  };
  const handleDismiss = () => {
    setNpsSurveySettings((settings) => {
      const nextSettings = {
        ...settings,
        lastResponseDate: null
      };
      if (settings.firstDismissalDate) {
        nextSettings.lastDismissalDate = (/* @__PURE__ */ new Date()).toString();
      } else {
        nextSettings.firstDismissalDate = (/* @__PURE__ */ new Date()).toString();
      }
      return nextSettings;
    });
    setSurveyIsShown(false);
  };
  return /* @__PURE__ */ jsx(Portal, { children: /* @__PURE__ */ jsx(
    Formik,
    {
      initialValues: { npsSurveyFeedback: "", npsSurveyRating: null },
      onSubmit: handleSubmitResponse,
      validationSchema: yup.object({
        npsSurveyFeedback: yup.string(),
        npsSurveyRating: yup.number().required()
      }),
      children: ({ values, handleChange, setFieldValue, isSubmitting }) => /* @__PURE__ */ jsx(Form$1, { name: "npsSurveyForm", children: /* @__PURE__ */ jsx(
        Flex,
        {
          hasRadius: true,
          direction: "column",
          padding: 4,
          borderColor: "primary200",
          background: "neutral0",
          shadow: "popupShadow",
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: "200",
          width: "50%",
          children: isFeedbackResponse ? /* @__PURE__ */ jsx(Typography, { fontWeight: "semiBold", children: formatMessage({
            id: "app.components.NpsSurvey.feedback-response",
            defaultMessage: "Thank you very much for your feedback!"
          }) }) : /* @__PURE__ */ jsxs(Box, { tag: "fieldset", width: "100%", borderWidth: 0, children: [
            /* @__PURE__ */ jsxs(Flex, { justifyContent: "space-between", width: "100%", children: [
              /* @__PURE__ */ jsx(Box, { marginLeft: "auto", marginRight: "auto", children: /* @__PURE__ */ jsx(Typography, { fontWeight: "semiBold", tag: "legend", children: formatMessage({
                id: "app.components.NpsSurvey.banner-title",
                defaultMessage: "How likely are you to recommend Strapi to a friend or colleague?"
              }) }) }),
              /* @__PURE__ */ jsx(
                IconButton,
                {
                  onClick: handleDismiss,
                  withTooltip: false,
                  label: formatMessage({
                    id: "app.components.NpsSurvey.dismiss-survey-label",
                    defaultMessage: "Dismiss survey"
                  }),
                  children: /* @__PURE__ */ jsx(Cross, {})
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(Flex, { gap: 2, marginTop: 2, marginBottom: 2, justifyContent: "center", children: [
              /* @__PURE__ */ jsx(Typography, { variant: "pi", textColor: "neutral600", children: formatMessage({
                id: "app.components.NpsSurvey.no-recommendation",
                defaultMessage: "Not at all likely"
              }) }),
              ratingArray.map((number) => {
                return /* @__PURE__ */ jsx(
                  FieldWrapper,
                  {
                    name: "npsSurveyRating",
                    className: values.npsSurveyRating === number ? "selected" : void 0,
                    hasRadius: true,
                    background: "primary100",
                    borderColor: "primary200",
                    color: "primary600",
                    position: "relative",
                    cursor: "pointer",
                    children: /* @__PURE__ */ jsxs(Field.Label, { children: [
                      /* @__PURE__ */ jsx(VisuallyHidden, { children: /* @__PURE__ */ jsx(
                        Field.Input,
                        {
                          type: "radio",
                          checked: values.npsSurveyRating === number,
                          onChange: (e) => setFieldValue("npsSurveyRating", parseInt(e.target.value, 10)),
                          value: number
                        }
                      ) }),
                      number
                    ] })
                  },
                  number
                );
              }),
              /* @__PURE__ */ jsx(Typography, { variant: "pi", textColor: "neutral600", children: formatMessage({
                id: "app.components.NpsSurvey.happy-to-recommend",
                defaultMessage: "Extremely likely"
              }) })
            ] }),
            values.npsSurveyRating !== null && /* @__PURE__ */ jsxs(Flex, { direction: "column", children: [
              /* @__PURE__ */ jsx(Box, { marginTop: 2, children: /* @__PURE__ */ jsx(Field.Label, { fontWeight: "semiBold", fontSize: 2, children: formatMessage({
                id: "app.components.NpsSurvey.feedback-question",
                defaultMessage: "Do you have any suggestion for improvements?"
              }) }) }),
              /* @__PURE__ */ jsx(Box, { width: "62%", marginTop: 3, marginBottom: 4, children: /* @__PURE__ */ jsx(
                Textarea,
                {
                  id: "npsSurveyFeedback",
                  width: "100%",
                  onChange: handleChange,
                  value: values.npsSurveyFeedback
                }
              ) }),
              /* @__PURE__ */ jsx(Button, { marginBottom: 2, type: "submit", loading: isSubmitting, children: formatMessage({
                id: "app.components.NpsSurvey.submit-feedback",
                defaultMessage: "Submit Feedback"
              }) })
            ] })
          ] })
        }
      ) })
    }
  ) });
};
function useNpsSurveySettings() {
  const [npsSurveySettings, setNpsSurveySettings] = usePersistentState(
    "STRAPI_NPS_SURVEY_SETTINGS",
    {
      enabled: true,
      lastResponseDate: null,
      firstDismissalDate: null,
      lastDismissalDate: null
    }
  );
  return { npsSurveySettings, setNpsSurveySettings };
}

const REGISTER_USER_SCHEMA = yup.object().shape({
  firstname: yup.string().trim().required(errorsTrads.required).nullable(),
  lastname: yup.string().nullable(),
  password: yup.string().min(8, {
    id: errorsTrads.minLength.id,
    defaultMessage: "Password must be at least 8 characters",
    values: { min: 8 }
  }).matches(/[a-z]/, {
    message: {
      id: "components.Input.error.contain.lowercase",
      defaultMessage: "Password must contain at least 1 lowercase letter"
    }
  }).matches(/[A-Z]/, {
    message: {
      id: "components.Input.error.contain.uppercase",
      defaultMessage: "Password must contain at least 1 uppercase letter"
    }
  }).matches(/\d/, {
    message: {
      id: "components.Input.error.contain.number",
      defaultMessage: "Password must contain at least 1 number"
    }
  }).required({
    id: errorsTrads.required.id,
    defaultMessage: "Password is required"
  }).nullable(),
  confirmPassword: yup.string().required({
    id: errorsTrads.required.id,
    defaultMessage: "Confirm password is required"
  }).oneOf([yup.ref("password"), null], {
    id: "components.Input.error.password.noMatch",
    defaultMessage: "Passwords must match"
  }).nullable(),
  registrationToken: yup.string().required({
    id: errorsTrads.required.id,
    defaultMessage: "Registration token is required"
  })
});
const REGISTER_ADMIN_SCHEMA = yup.object().shape({
  firstname: yup.string().trim().required({
    id: errorsTrads.required.id,
    defaultMessage: "Firstname is required"
  }).nullable(),
  lastname: yup.string().nullable(),
  password: yup.string().min(8, {
    id: errorsTrads.minLength.id,
    defaultMessage: "Password must be at least 8 characters",
    values: { min: 8 }
  }).matches(/[a-z]/, {
    message: {
      id: "components.Input.error.contain.lowercase",
      defaultMessage: "Password must contain at least 1 lowercase letter"
    }
  }).matches(/[A-Z]/, {
    message: {
      id: "components.Input.error.contain.uppercase",
      defaultMessage: "Password must contain at least 1 uppercase letter"
    }
  }).matches(/\d/, {
    message: {
      id: "components.Input.error.contain.number",
      defaultMessage: "Password must contain at least 1 number"
    }
  }).required({
    id: errorsTrads.required.id,
    defaultMessage: "Password is required"
  }).nullable(),
  confirmPassword: yup.string().required({
    id: errorsTrads.required,
    defaultMessage: "Confirm password is required"
  }).nullable().oneOf([yup.ref("password"), null], {
    id: "components.Input.error.password.noMatch",
    defaultMessage: "Passwords must match"
  }),
  email: yup.string().email({
    id: errorsTrads.email.id,
    defaultMessage: "Not a valid email"
  }).strict().lowercase({
    id: errorsTrads.lowercase.id,
    defaultMessage: "Email must be lowercase"
  }).required({
    id: errorsTrads.required.id,
    defaultMessage: "Email is required"
  }).nullable()
});
const Register = ({ hasAdmin }) => {
  const { toggleNotification } = useNotification();
  const navigate = useNavigate();
  const [submitCount, setSubmitCount] = React.useState(0);
  const [apiError, setApiError] = React.useState();
  const { trackUsage } = useTracking();
  const { formatMessage } = useIntl();
  const setSkipped = useGuidedTour("Register", (state) => state.setSkipped);
  const { search: searchString } = useLocation();
  const query = React.useMemo(() => new URLSearchParams(searchString), [searchString]);
  const match = useMatch("/auth/:authType");
  const {
    _unstableFormatAPIError: formatAPIError,
    _unstableFormatValidationErrors: formatValidationErrors
  } = useAPIErrorHandler();
  const { setNpsSurveySettings } = useNpsSurveySettings();
  const registrationToken = query.get("registrationToken");
  const { data: userInfo, error } = useGetRegistrationInfoQuery(registrationToken, {
    skip: !registrationToken
  });
  React.useEffect(() => {
    if (error) {
      const message = isBaseQueryError(error) ? formatAPIError(error) : error.message ?? "";
      toggleNotification({
        type: "danger",
        message
      });
      navigate(`/auth/oops?info=${encodeURIComponent(message)}`);
    }
  }, [error, formatAPIError, navigate, toggleNotification]);
  const [registerAdmin] = useRegisterAdminMutation();
  const [registerUser] = useRegisterUserMutation();
  const dispatch = useTypedDispatch();
  const handleRegisterAdmin = async ({ news, ...body }, setFormErrors) => {
    const res = await registerAdmin(body);
    if ("data" in res) {
      dispatch(login({ token: res.data.token }));
      const { roles } = res.data.user;
      if (roles) {
        const isUserSuperAdmin = roles.find(({ code }) => code === "strapi-super-admin");
        if (isUserSuperAdmin) {
          localStorage.setItem("GUIDED_TOUR_SKIPPED", JSON.stringify(false));
          setSkipped(false);
          trackUsage("didLaunchGuidedtour");
        }
      }
      if (news) {
        setNpsSurveySettings((s) => ({ ...s, enabled: true }));
        navigate({
          pathname: "/usecase",
          search: `?hasAdmin=${true}`
        });
      } else {
        navigate("/");
      }
    } else {
      if (isBaseQueryError(res.error)) {
        trackUsage("didNotCreateFirstAdmin");
        if (res.error.name === "ValidationError") {
          setFormErrors(formatValidationErrors(res.error));
          return;
        }
        setApiError(formatAPIError(res.error));
      }
    }
  };
  const handleRegisterUser = async ({ news, ...body }, setFormErrors) => {
    const res = await registerUser(body);
    if ("data" in res) {
      dispatch(login({ token: res.data.token }));
      if (news) {
        setNpsSurveySettings((s) => ({ ...s, enabled: true }));
        navigate({
          pathname: "/usecase",
          search: `?hasAdmin=${hasAdmin}`
        });
      } else {
        navigate("/");
      }
    } else {
      if (isBaseQueryError(res.error)) {
        trackUsage("didNotCreateFirstAdmin");
        if (res.error.name === "ValidationError") {
          setFormErrors(formatValidationErrors(res.error));
          return;
        }
        setApiError(formatAPIError(res.error));
      }
    }
  };
  if (!match || match.params.authType !== "register" && match.params.authType !== "register-admin") {
    return /* @__PURE__ */ jsx(Navigate, { to: "/" });
  }
  const isAdminRegistration = match.params.authType === "register-admin";
  const schema = isAdminRegistration ? REGISTER_ADMIN_SCHEMA : REGISTER_USER_SCHEMA;
  return /* @__PURE__ */ jsx(UnauthenticatedLayout, { children: /* @__PURE__ */ jsxs(LayoutContent, { children: [
    /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "center", gap: 3, children: [
      /* @__PURE__ */ jsx(Logo, {}),
      /* @__PURE__ */ jsx(Typography, { tag: "h1", variant: "alpha", textAlign: "center", children: formatMessage({
        id: "Auth.form.welcome.title",
        defaultMessage: "Welcome to Strapi!"
      }) }),
      /* @__PURE__ */ jsx(Typography, { variant: "epsilon", textColor: "neutral600", textAlign: "center", children: formatMessage({
        id: "Auth.form.register.subtitle",
        defaultMessage: "Credentials are only used to authenticate in Strapi. All saved data will be stored in your database."
      }) }),
      apiError ? /* @__PURE__ */ jsx(Typography, { id: "global-form-error", role: "alert", tabIndex: -1, textColor: "danger600", children: apiError }) : null
    ] }),
    /* @__PURE__ */ jsx(
      Form,
      {
        method: "POST",
        initialValues: {
          firstname: userInfo?.firstname || "",
          lastname: userInfo?.lastname || "",
          email: userInfo?.email || "",
          password: "",
          confirmPassword: "",
          registrationToken: registrationToken || void 0,
          news: false
        },
        onSubmit: async (data, helpers) => {
          const normalizedData = normalizeData(data);
          try {
            await schema.validate(normalizedData, { abortEarly: false });
            if (submitCount > 0 && isAdminRegistration) {
              trackUsage("didSubmitWithErrorsFirstAdmin", { count: submitCount.toString() });
            }
            if (normalizedData.registrationToken) {
              handleRegisterUser(
                {
                  userInfo: omit(normalizedData, [
                    "registrationToken",
                    "confirmPassword",
                    "email",
                    "news"
                  ]),
                  registrationToken: normalizedData.registrationToken,
                  news: normalizedData.news
                },
                helpers.setErrors
              );
            } else {
              await handleRegisterAdmin(
                omit(normalizedData, ["registrationToken", "confirmPassword"]),
                helpers.setErrors
              );
            }
          } catch (err) {
            if (err instanceof ValidationError) {
              helpers.setErrors(
                err.inner.reduce((acc, { message, path }) => {
                  if (path && typeof message === "object") {
                    acc[path] = formatMessage(message);
                  }
                  return acc;
                }, {})
              );
            }
            setSubmitCount(submitCount + 1);
          }
        },
        children: /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "stretch", gap: 6, marginTop: 7, children: [
          /* @__PURE__ */ jsx(Grid.Root, { gap: 4, children: [
            {
              label: formatMessage({
                id: "Auth.form.firstname.label",
                defaultMessage: "Firstname"
              }),
              name: "firstname",
              required: true,
              size: 6,
              type: "string"
            },
            {
              label: formatMessage({
                id: "Auth.form.lastname.label",
                defaultMessage: "Lastname"
              }),
              name: "lastname",
              size: 6,
              type: "string"
            },
            {
              disabled: !isAdminRegistration,
              label: formatMessage({
                id: "Auth.form.email.label",
                defaultMessage: "Email"
              }),
              name: "email",
              required: true,
              size: 12,
              type: "email"
            },
            {
              hint: formatMessage({
                id: "Auth.form.password.hint",
                defaultMessage: "Must be at least 8 characters, 1 uppercase, 1 lowercase & 1 number"
              }),
              label: formatMessage({
                id: "global.password",
                defaultMessage: "Password"
              }),
              name: "password",
              required: true,
              size: 12,
              type: "password"
            },
            {
              label: formatMessage({
                id: "Auth.form.confirmPassword.label",
                defaultMessage: "Confirm Password"
              }),
              name: "confirmPassword",
              required: true,
              size: 12,
              type: "password"
            },
            {
              label: formatMessage(
                {
                  id: "Auth.form.register.news.label",
                  defaultMessage: "Keep me updated about new features & upcoming improvements (by doing this you accept the {terms} and the {policy})."
                },
                {
                  terms: /* @__PURE__ */ jsx(A, { target: "_blank", href: "https://strapi.io/terms", rel: "noreferrer", children: formatMessage({
                    id: "Auth.privacy-policy-agreement.terms",
                    defaultMessage: "terms"
                  }) }),
                  policy: /* @__PURE__ */ jsx(A, { target: "_blank", href: "https://strapi.io/privacy", rel: "noreferrer", children: formatMessage({
                    id: "Auth.privacy-policy-agreement.policy",
                    defaultMessage: "policy"
                  }) })
                }
              ),
              name: "news",
              size: 12,
              type: "checkbox"
            }
          ].map(({ size, ...field }) => /* @__PURE__ */ jsx(Grid.Item, { col: size, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsx(MemoizedInputRenderer, { ...field }) }, field.name)) }),
          /* @__PURE__ */ jsx(Button, { fullWidth: true, size: "L", type: "submit", children: formatMessage({
            id: "Auth.form.button.register",
            defaultMessage: "Let's start"
          }) })
        ] })
      }
    ),
    match?.params.authType === "register" && /* @__PURE__ */ jsx(Box, { paddingTop: 4, children: /* @__PURE__ */ jsx(Flex, { justifyContent: "center", children: /* @__PURE__ */ jsx(Link, { tag: NavLink, to: "/auth/login", children: formatMessage({
      id: "Auth.link.signin.account",
      defaultMessage: "Already have an account?"
    }) }) }) })
  ] }) });
};
function normalizeData(data) {
  return Object.entries(data).reduce(
    (acc, [key, value]) => {
      if (!["password", "confirmPassword"].includes(key) && typeof value === "string") {
        acc[key] = value.trim();
        if (key === "lastname") {
          acc[key] = value || void 0;
        }
      } else {
        acc[key] = value;
      }
      return acc;
    },
    {}
  );
}
const A = styled.a`
  color: ${({ theme }) => theme.colors.primary600};
`;

const RESET_PASSWORD_SCHEMA = yup.object().shape({
  password: yup.string().min(8, {
    id: errorsTrads.minLength.id,
    defaultMessage: "Password must be at least 8 characters",
    values: { min: 8 }
  }).matches(/[a-z]/, {
    message: {
      id: "components.Input.error.contain.lowercase",
      defaultMessage: "Password must contain at least 1 lowercase letter"
    }
  }).matches(/[A-Z]/, {
    message: {
      id: "components.Input.error.contain.uppercase",
      defaultMessage: "Password must contain at least 1 uppercase letter"
    }
  }).matches(/\d/, {
    message: {
      id: "components.Input.error.contain.number",
      defaultMessage: "Password must contain at least 1 number"
    }
  }).required({
    id: errorsTrads.required.id,
    defaultMessage: "Password is required"
  }).nullable(),
  confirmPassword: yup.string().required({
    id: errorsTrads.required.id,
    defaultMessage: "Confirm password is required"
  }).oneOf([yup.ref("password"), null], {
    id: "components.Input.error.password.noMatch",
    defaultMessage: "Passwords must match"
  }).nullable()
});
const ResetPassword = () => {
  const { formatMessage } = useIntl();
  const dispatch = useTypedDispatch();
  const navigate = useNavigate();
  const { search: searchString } = useLocation();
  const query = React.useMemo(() => new URLSearchParams(searchString), [searchString]);
  const { _unstableFormatAPIError: formatAPIError } = useAPIErrorHandler();
  const [resetPassword, { error }] = useResetPasswordMutation();
  const handleSubmit = async (body) => {
    const res = await resetPassword(body);
    if ("data" in res) {
      dispatch(login({ token: res.data.token }));
      navigate("/");
    }
  };
  if (!query.get("code")) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/auth/login" });
  }
  return /* @__PURE__ */ jsx(UnauthenticatedLayout, { children: /* @__PURE__ */ jsxs(Main, { children: [
    /* @__PURE__ */ jsxs(LayoutContent, { children: [
      /* @__PURE__ */ jsxs(Column, { children: [
        /* @__PURE__ */ jsx(Logo, {}),
        /* @__PURE__ */ jsx(Box, { paddingTop: 6, paddingBottom: 7, children: /* @__PURE__ */ jsx(Typography, { tag: "h1", variant: "alpha", children: formatMessage({
          id: "global.reset-password",
          defaultMessage: "Reset password"
        }) }) }),
        error ? /* @__PURE__ */ jsx(Typography, { id: "global-form-error", role: "alert", tabIndex: -1, textColor: "danger600", children: isBaseQueryError(error) ? formatAPIError(error) : formatMessage({
          id: "notification.error",
          defaultMessage: "An error occurred"
        }) }) : null
      ] }),
      /* @__PURE__ */ jsx(
        Form,
        {
          method: "POST",
          initialValues: {
            password: "",
            confirmPassword: ""
          },
          onSubmit: (values) => {
            handleSubmit({ password: values.password, resetPasswordToken: query.get("code") });
          },
          validationSchema: RESET_PASSWORD_SCHEMA,
          children: /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "stretch", gap: 6, children: [
            [
              {
                hint: formatMessage({
                  id: "Auth.form.password.hint",
                  defaultMessage: "Password must contain at least 8 characters, 1 uppercase, 1 lowercase and 1 number"
                }),
                label: formatMessage({
                  id: "global.password",
                  defaultMessage: "Password"
                }),
                name: "password",
                required: true,
                type: "password"
              },
              {
                label: formatMessage({
                  id: "Auth.form.confirmPassword.label",
                  defaultMessage: "Confirm Password"
                }),
                name: "confirmPassword",
                required: true,
                type: "password"
              }
            ].map((field) => /* @__PURE__ */ jsx(MemoizedInputRenderer, { ...field }, field.name)),
            /* @__PURE__ */ jsx(Button, { fullWidth: true, type: "submit", children: formatMessage({
              id: "global.change-password",
              defaultMessage: "Change password"
            }) })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Flex, { justifyContent: "center", children: /* @__PURE__ */ jsx(Box, { paddingTop: 4, children: /* @__PURE__ */ jsx(Link, { tag: NavLink, to: "/auth/login", children: formatMessage({ id: "Auth.link.ready", defaultMessage: "Ready to sign in?" }) }) }) })
  ] }) });
};

const FORMS = {
  "forgot-password": ForgotPassword,
  "forgot-password-success": ForgotPasswordSuccess,
  // the `Component` attribute is set after all forms and CE/EE components are loaded, but since we
  // are here outside of a React component we can not use the hook directly
  login: () => null,
  oops: Oops,
  register: Register,
  "register-admin": Register,
  "reset-password": ResetPassword,
  providers: () => null
};

const AuthPage = () => {
  const { search } = useLocation();
  const match = useMatch("/auth/:authType");
  const authType = match?.params.authType;
  const { data } = useInitQuery();
  const { hasAdmin } = data ?? {};
  const Login$1 = useEnterprise(
    Login,
    async () => (await import('./Login-C2Mw7cam.mjs')).LoginEE
  );
  const forms = useEnterprise(
    FORMS,
    async () => (await import('./constants-CiZXJ_5W.mjs')).FORMS,
    {
      combine(ceForms, eeForms) {
        return {
          ...ceForms,
          ...eeForms
        };
      },
      defaultValue: FORMS
    }
  );
  const { token } = useAuth("AuthPage", (auth) => auth);
  if (!authType || !forms) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/" });
  }
  const Component = forms[authType];
  if (!Component) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/" });
  }
  if (authType !== "register-admin" && authType !== "register" && token) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/" });
  }
  if (hasAdmin && authType === "register-admin" && token) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/" });
  }
  if (!hasAdmin && authType !== "register-admin") {
    return /* @__PURE__ */ jsx(
      Navigate,
      {
        to: {
          pathname: "/auth/register-admin",
          // Forward the `?redirectTo` from /auth/login
          // /abc => /auth/login?redirectTo=%2Fabc => /auth/register-admin?redirectTo=%2Fabc
          search
        }
      }
    );
  }
  if (Login$1 && authType === "login") {
    return /* @__PURE__ */ jsx(Login$1, {});
  } else if (authType === "login" && !Login$1) {
    return null;
  }
  return /* @__PURE__ */ jsx(Component, { hasAdmin });
};

const ROUTES_CE = [
  {
    lazy: async () => {
      const { ProtectedListPage } = await import('./ListPage-DjwNl39M.mjs');
      return {
        Component: ProtectedListPage
      };
    },
    path: "roles"
  },
  {
    lazy: async () => {
      const { ProtectedCreatePage } = await import('./CreatePage-mgccyGeS.mjs');
      return {
        Component: ProtectedCreatePage
      };
    },
    path: "roles/duplicate/:id"
  },
  {
    lazy: async () => {
      const { ProtectedCreatePage } = await import('./CreatePage-mgccyGeS.mjs');
      return {
        Component: ProtectedCreatePage
      };
    },
    path: "roles/new"
  },
  {
    lazy: async () => {
      const { ProtectedEditPage } = await import('./EditPage-vRIzIivk.mjs');
      return {
        Component: ProtectedEditPage
      };
    },
    path: "roles/:id"
  },
  {
    lazy: async () => {
      const { ProtectedListPage } = await import('./ListPage-TSypU5NS.mjs');
      return {
        Component: ProtectedListPage
      };
    },
    path: "users"
  },
  {
    lazy: async () => {
      const { ProtectedEditPage } = await import('./EditPage-B0gVp6ZA.mjs');
      return {
        Component: ProtectedEditPage
      };
    },
    path: "users/:id"
  },
  {
    lazy: async () => {
      const { ProtectedCreatePage } = await import('./CreatePage-BRD18XNu.mjs');
      return {
        Component: ProtectedCreatePage
      };
    },
    path: "webhooks/create"
  },
  {
    lazy: async () => {
      const { ProtectedEditPage } = await import('./EditPage-BE4qD3mi.mjs').then(n => n.b);
      return {
        Component: ProtectedEditPage
      };
    },
    path: "webhooks/:id"
  },
  {
    lazy: async () => {
      const { ProtectedListPage } = await import('./ListPage-Cx1jFY18.mjs');
      return {
        Component: ProtectedListPage
      };
    },
    path: "webhooks"
  },
  {
    lazy: async () => {
      const { ProtectedListView } = await import('./ListView-DV860ejj.mjs');
      return {
        Component: ProtectedListView
      };
    },
    path: "api-tokens"
  },
  {
    lazy: async () => {
      const { ProtectedCreateView } = await import('./CreateView-BW4atUvI.mjs');
      return {
        Component: ProtectedCreateView
      };
    },
    path: "api-tokens/create"
  },
  {
    lazy: async () => {
      const { ProtectedEditView } = await import('./EditViewPage-Ch2Vfp6q.mjs');
      return {
        Component: ProtectedEditView
      };
    },
    path: "api-tokens/:id"
  },
  {
    lazy: async () => {
      const { ProtectedCreateView } = await import('./CreateView-DzCHAixM.mjs');
      return {
        Component: ProtectedCreateView
      };
    },
    path: "transfer-tokens/create"
  },
  {
    lazy: async () => {
      const { ProtectedListView } = await import('./ListView-DvU5a2gt.mjs');
      return {
        Component: ProtectedListView
      };
    },
    path: "transfer-tokens"
  },
  {
    lazy: async () => {
      const { ProtectedEditView } = await import('./EditView-AdO6Xcay.mjs');
      return {
        Component: ProtectedEditView
      };
    },
    path: "transfer-tokens/:id"
  },
  {
    lazy: async () => {
      const { ProtectedInstalledPlugins } = await import('./InstalledPlugins-CiBTObSY.mjs');
      return {
        Component: ProtectedInstalledPlugins
      };
    },
    path: "list-plugins"
  },
  {
    lazy: async () => {
      const { PurchaseAuditLogs } = await import('./PurchaseAuditLogs-DvxRk7RI.mjs');
      return {
        Component: PurchaseAuditLogs
      };
    },
    path: "purchase-audit-logs"
  },
  {
    lazy: async () => {
      const { PurchaseSingleSignOn } = await import('./PurchaseSingleSignOn-D0S9FHMv.mjs');
      return {
        Component: PurchaseSingleSignOn
      };
    },
    path: "purchase-single-sign-on"
  }
];

const getImmutableRoutes = () => [
  {
    path: "usecase",
    lazy: async () => {
      const { PrivateUseCasePage } = await import('./UseCasePage-Y-mdM2Wr.mjs');
      return {
        Component: PrivateUseCasePage
      };
    }
  },
  // this needs to go before auth/:authType because otherwise it won't match the route
  ...getEERoutes$1(),
  {
    path: "auth/:authType",
    element: /* @__PURE__ */ jsx(AuthPage, {})
  }
];
const getInitialRoutes = () => [
  {
    index: true,
    lazy: async () => {
      const { HomePage } = await import('./HomePage-l0sNRNKZ.mjs');
      return {
        Component: HomePage
      };
    }
  },
  {
    path: "me",
    lazy: async () => {
      const { ProfilePage } = await import('./ProfilePage-DwE98A3Q.mjs');
      return {
        Component: ProfilePage
      };
    }
  },
  {
    path: "marketplace",
    lazy: async () => {
      const { ProtectedMarketplacePage } = await import('./MarketplacePage-BkiSxGiK.mjs');
      return {
        Component: ProtectedMarketplacePage
      };
    }
  },
  {
    path: "settings/*",
    lazy: async () => {
      const { Layout } = await import('./Layout-D4-M-Plf.mjs');
      return {
        Component: Layout
      };
    },
    children: [
      {
        path: "application-infos",
        lazy: async () => {
          const { ApplicationInfoPage } = await import('./ApplicationInfoPage-R0Vuk0R-.mjs');
          return {
            Component: ApplicationInfoPage
          };
        }
      },
      // ...Object.values(this.settings).flatMap(({ links }) =>
      //   links.map(({ to, Component }) => ({
      //     path: `${to}/*`,
      //     element: (
      //       <React.Suspense fallback={<Page.Loading />}>
      //         <Component />
      //       </React.Suspense>
      //     ),
      //   }))
      // ),
      ...[...getEERoutes(), ...ROUTES_CE].filter(
        (route, index, refArray) => refArray.findIndex((obj) => obj.path === route.path) === index
      )
    ]
  }
];

class Router {
  _routes = [];
  router = null;
  _menu = [];
  _settings = {
    global: {
      id: "global",
      intlLabel: {
        id: "Settings.global",
        defaultMessage: "Global Settings"
      },
      links: []
    }
  };
  constructor(initialRoutes) {
    this._routes = initialRoutes;
  }
  get routes() {
    return this._routes;
  }
  get menu() {
    return this._menu;
  }
  get settings() {
    return this._settings;
  }
  /**
   * @internal This method is used internally by Strapi to create the router.
   * It should not be used by plugins, doing so will likely break the application.
   */
  createRouter(strapi, { memory, ...opts } = {}) {
    const routes = [
      {
        path: "/*",
        errorElement: /* @__PURE__ */ jsx(Provider$1, { store: strapi.store, children: /* @__PURE__ */ jsx(LanguageProvider, { messages: strapi.configurations.translations, children: /* @__PURE__ */ jsx(Theme, { themes: strapi.configurations.themes, children: /* @__PURE__ */ jsx(ErrorElement, {}) }) }) }),
        element: /* @__PURE__ */ jsx(App, { strapi, store: strapi.store }),
        children: [
          ...getImmutableRoutes(),
          {
            path: "/*",
            lazy: async () => {
              const { PrivateAdminLayout } = await import('./AuthenticatedLayout-pPdBhoMx.mjs');
              return {
                Component: PrivateAdminLayout
              };
            },
            children: [
              ...this.routes,
              {
                path: "*",
                element: /* @__PURE__ */ jsx(NotFoundPage, {})
              }
            ]
          }
        ]
      }
    ];
    if (memory) {
      this.router = createMemoryRouter(routes, opts);
    } else {
      this.router = createBrowserRouter(routes, opts);
    }
    return this.router;
  }
  addMenuLink = (link) => {
    invariant(link.to, `[${link.intlLabel.defaultMessage}]: link.to should be defined`);
    invariant(
      typeof link.to === "string",
      `[${link.intlLabel.defaultMessage}]: Expected link.to to be a string instead received ${typeof link.to}`
    );
    invariant(
      link.intlLabel?.id && link.intlLabel?.defaultMessage,
      `[${link.intlLabel.defaultMessage}]: link.intlLabel.id & link.intlLabel.defaultMessage should be defined`
    );
    invariant(
      !link.Component || link.Component && typeof link.Component === "function",
      `[${link.intlLabel.defaultMessage}]: link.Component must be a function returning a Promise that returns a default component. Please use: \`Component: () => import(path)\` instead.`
    );
    if (!link.Component || link.Component && typeof link.Component === "function" && // @ts-expect-error – shh
    link.Component[Symbol.toStringTag] === "AsyncFunction") {
      console.warn(
        `
      [${link.intlLabel.defaultMessage}]: [deprecated] addMenuLink() was called with an async Component from the plugin "${link.intlLabel.defaultMessage}". This will be removed in the future. Please use: \`Component: () => import(path)\` ensuring you return a default export instead.
      `.trim()
      );
    }
    if (link.to.startsWith("/")) {
      console.warn(
        `[${link.intlLabel.defaultMessage}]: the \`to\` property of your menu link is an absolute path, it should be relative to the root of the application. This has been corrected for you but will be removed in a future version of Strapi.`
      );
      link.to = link.to.slice(1);
    }
    const { Component, ...restLink } = link;
    if (Component) {
      this._routes.push({
        path: `${link.to}/*`,
        lazy: async () => {
          const mod = await Component();
          if ("default" in mod) {
            return { Component: mod.default };
          } else {
            return { Component: mod };
          }
        }
      });
    }
    this.menu.push(restLink);
  };
  addSettingsLink(section, link) {
    if (typeof section === "object" && "links" in section) {
      invariant(section.id, "section.id should be defined");
      invariant(
        section.intlLabel?.id && section.intlLabel?.defaultMessage,
        "section.intlLabel should be defined"
      );
      invariant(this.settings[section.id] === void 0, "A similar section already exists");
      invariant(Array.isArray(section.links), "TypeError expected links to be an array");
      this.settings[section.id] = { ...section, links: [] };
      section.links.forEach((link2) => {
        this.createSettingsLink(section.id, link2);
      });
    } else if (typeof section === "object" && link) {
      invariant(section.id, "section.id should be defined");
      invariant(
        section.intlLabel?.id && section.intlLabel?.defaultMessage,
        "section.intlLabel should be defined"
      );
      invariant(this.settings[section.id] === void 0, "A similar section already exists");
      this.settings[section.id] = { ...section, links: [] };
      if (Array.isArray(link)) {
        link.forEach((l) => this.createSettingsLink(section.id, l));
      } else {
        this.createSettingsLink(section.id, link);
      }
    } else if (typeof section === "string" && link) {
      if (Array.isArray(link)) {
        link.forEach((l) => this.createSettingsLink(section, l));
      } else {
        this.createSettingsLink(section, link);
      }
    } else {
      throw new Error(
        "Invalid arguments provided to addSettingsLink, at minimum a sectionId and link are required."
      );
    }
  }
  createSettingsLink = (sectionId, link) => {
    invariant(this._settings[sectionId], "The section does not exist");
    invariant(link.id, `[${link.intlLabel.defaultMessage}]: link.id should be defined`);
    invariant(
      link.intlLabel?.id && link.intlLabel?.defaultMessage,
      `[${link.intlLabel.defaultMessage}]: link.intlLabel.id & link.intlLabel.defaultMessage`
    );
    invariant(link.to, `[${link.intlLabel.defaultMessage}]: link.to should be defined`);
    invariant(
      !link.Component || link.Component && typeof link.Component === "function",
      `[${link.intlLabel.defaultMessage}]: link.Component must be a function returning a Promise. Please use: \`Component: () => import(path)\` instead.`
    );
    if (!link.Component || link.Component && typeof link.Component === "function" && // @ts-expect-error – shh
    link.Component[Symbol.toStringTag] === "AsyncFunction") {
      console.warn(
        `
      [${link.intlLabel.defaultMessage}]: [deprecated] addSettingsLink() was called with an async Component from the plugin "${link.intlLabel.defaultMessage}". This will be removed in the future. Please use: \`Component: () => import(path)\` ensuring you return a default export instead.
      `.trim()
      );
    }
    if (link.to.startsWith("/")) {
      console.warn(
        `[${link.intlLabel.defaultMessage}]: the \`to\` property of your settings link is an absolute path. It should be relative to \`/settings\`. This has been corrected for you but will be removed in a future version of Strapi.`
      );
      link.to = link.to.slice(1);
    }
    if (link.to.split("/")[0] === "settings") {
      console.warn(
        `[${link.intlLabel.defaultMessage}]: the \`to\` property of your settings link has \`settings\` as the first part of it's path. It should be relative to \`settings\` and therefore, not include it. This has been corrected for you but will be removed in a future version of Strapi.`
      );
      link.to = link.to.split("/").slice(1).join("/");
    }
    const { Component, ...restLink } = link;
    const settingsIndex = this._routes.findIndex((route) => route.path === "settings/*");
    if (!settingsIndex) {
      console.warn(
        "A third party plugin has removed the settings section, the settings link cannot be added."
      );
      return;
    } else if (!this._routes[settingsIndex].children) {
      this._routes[settingsIndex].children = [];
    }
    if (Component) {
      this._routes[settingsIndex].children.push({
        path: `${link.to}/*`,
        lazy: async () => {
          const mod = await Component();
          if ("default" in mod) {
            return { Component: mod.default };
          } else {
            return { Component: mod };
          }
        }
      });
    }
    this._settings[sectionId].links.push(restLink);
  };
  /**
   * @alpha
   * @description Adds a route or an array of routes to the router.
   * Otherwise, pass a function that receives the current routes and
   * returns the new routes in a reducer like fashion.
   */
  addRoute(route) {
    if (Array.isArray(route)) {
      this._routes = [...this._routes, ...route];
    } else if (typeof route === "object" && route !== null) {
      this._routes.push(route);
    } else if (typeof route === "function") {
      this._routes = route(this._routes);
    } else {
      throw new Error(
        `Expected the \`route\` passed to \`addRoute\` to be an array or a function, but received ${getPrintableType(
          route
        )}`
      );
    }
  }
}
const getPrintableType = (value) => {
  const nativeType = typeof value;
  if (nativeType === "object") {
    if (value === null)
      return "null";
    if (Array.isArray(value))
      return "array";
    if (value instanceof Object && value.constructor.name !== "Object") {
      return value.constructor.name;
    }
  }
  return nativeType;
};

const staticReducers = {
  [adminApi.reducerPath]: adminApi.reducer,
  admin_app: reducer$2
};
const injectReducerStoreEnhancer = (appReducers) => (next) => (...args) => {
  const store = next(...args);
  const asyncReducers = {};
  return {
    ...store,
    asyncReducers,
    injectReducer: (key, asyncReducer) => {
      asyncReducers[key] = asyncReducer;
      store.replaceReducer(
        // @ts-expect-error we dynamically add reducers which makes the types uncomfortable.
        combineReducers({
          ...appReducers,
          ...asyncReducers
        })
      );
    }
  };
};
const configureStoreImpl = (preloadedState = {}, appMiddlewares = [], injectedReducers = {}) => {
  const coreReducers = { ...staticReducers, ...injectedReducers };
  const defaultMiddlewareOptions = {};
  if (process.env.NODE_ENV === "test") {
    defaultMiddlewareOptions.serializableCheck = false;
    defaultMiddlewareOptions.immutableCheck = false;
  }
  const store = configureStore({
    preloadedState: {
      admin_app: preloadedState.admin_app
    },
    reducer: coreReducers,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware(defaultMiddlewareOptions),
      rtkQueryUnauthorizedMiddleware,
      adminApi.middleware,
      ...appMiddlewares.map((m) => m())
    ],
    enhancers: [injectReducerStoreEnhancer(coreReducers)]
  });
  return store;
};
const rtkQueryUnauthorizedMiddleware = ({ dispatch }) => (next) => (action) => {
  if (isRejected(action) && action.payload?.status === 401) {
    dispatch(logout());
    window.location.href = "/admin/auth/login";
    return;
  }
  return next(action);
};

const getBasename = () => (process.env.ADMIN_PATH ?? "").replace(window.location.origin, "");

const createHook = () => {
  const _handlers = [];
  return {
    register(fn) {
      _handlers.push(fn);
    },
    delete(handler) {
      _handlers.splice(_handlers.indexOf(handler), 1);
    },
    runWaterfall(args, store) {
      return _handlers.reduce((acc, fn) => fn(acc, store), args);
    },
    async runWaterfallAsync(args, store) {
      let result = args;
      for (const fn of _handlers) {
        result = await fn(result, store);
      }
      return result;
    },
    runSeries(...args) {
      return _handlers.map((fn) => fn(...args));
    },
    async runSeriesAsync(...args) {
      const result = [];
      for (const fn of _handlers) {
        result.push(await fn(...args));
      }
      return result;
    },
    runParallel(...args) {
      return Promise.all(
        _handlers.map((fn) => {
          return fn(...args);
        })
      );
    }
  };
};

const languageNativeNames = {
  ar: "العربية",
  ca: "Català",
  cs: "Čeština",
  de: "Deutsch",
  dk: "Dansk",
  en: "English",
  "en-GB": "English (United Kingdom)",
  es: "Español",
  eu: "Euskara",
  uz: "O`zbekcha",
  ro: "Română",
  fr: "Français",
  gu: "Gujarati",
  he: "עברית",
  hu: "Magyar",
  id: "Indonesian",
  it: "Italiano",
  ja: "日本語",
  ko: "한국어",
  ml: "Malayalam",
  ms: "Melayu",
  nl: "Nederlands",
  no: "Norwegian",
  pl: "Polski",
  "pt-BR": "Português (Brasil)",
  pt: "Português (Portugal)",
  ru: "Русский",
  sk: "Slovenčina",
  sv: "Swedish",
  th: "ไทย",
  tr: "Türkçe",
  uk: "Українська",
  vi: "Tiếng Việt",
  "zh-Hans": "中文 (简体)",
  zh: "中文 (繁體)",
  sa: "संस्कृत",
  hi: "हिन्दी"
};

const {
  INJECT_COLUMN_IN_TABLE,
  MUTATE_COLLECTION_TYPES_LINKS,
  MUTATE_EDIT_VIEW_LAYOUT,
  MUTATE_SINGLE_TYPES_LINKS
} = HOOKS;
class StrapiApp {
  appPlugins;
  plugins = {};
  hooksDict = {};
  admin = {
    injectionZones: {}
  };
  translations = {};
  configurations = {
    authLogo: StrapiLogo,
    head: { favicon: "" },
    locales: ["en"],
    menuLogo: StrapiLogo,
    notifications: { releases: true },
    themes: { light: lightTheme, dark: darkTheme },
    translations: {},
    tutorials: true
  };
  /**
   * APIs
   */
  rbac = new RBAC();
  router;
  library = {
    components: {},
    fields: {}
  };
  middlewares = [];
  reducers = {};
  store = null;
  customFields = new CustomFields();
  constructor({ config, appPlugins } = {}) {
    this.appPlugins = appPlugins || {};
    this.createCustomConfigurations(config ?? {});
    this.createHook(INJECT_COLUMN_IN_TABLE);
    this.createHook(MUTATE_COLLECTION_TYPES_LINKS);
    this.createHook(MUTATE_SINGLE_TYPES_LINKS);
    this.createHook(MUTATE_EDIT_VIEW_LAYOUT);
    this.router = new Router(getInitialRoutes());
  }
  addComponents = (components) => {
    if (Array.isArray(components)) {
      components.map((comp) => {
        invariant(comp.Component, "A Component must be provided");
        invariant(comp.name, "A type must be provided");
        this.library.components[comp.name] = comp.Component;
      });
    } else {
      invariant(components.Component, "A Component must be provided");
      invariant(components.name, "A type must be provided");
      this.library.components[components.name] = components.Component;
    }
  };
  addFields = (fields) => {
    if (Array.isArray(fields)) {
      fields.map((field) => {
        invariant(field.Component, "A Component must be provided");
        invariant(field.type, "A type must be provided");
        this.library.fields[field.type] = field.Component;
      });
    } else {
      invariant(fields.Component, "A Component must be provided");
      invariant(fields.type, "A type must be provided");
      this.library.fields[fields.type] = fields.Component;
    }
  };
  addMiddlewares = (middlewares) => {
    middlewares.forEach((middleware) => {
      this.middlewares.push(middleware);
    });
  };
  addRBACMiddleware = (m) => {
    if (Array.isArray(m)) {
      this.rbac.use(m);
    } else {
      this.rbac.use(m);
    }
  };
  addReducers = (reducers) => {
    Object.entries(reducers).forEach(([name, reducer]) => {
      this.reducers[name] = reducer;
    });
  };
  addMenuLink = (link) => this.router.addMenuLink(link);
  /**
   * @deprecated use `addSettingsLink` instead, it internally supports
   * adding multiple links at once.
   */
  addSettingsLinks = (sectionId, links) => {
    invariant(Array.isArray(links), "TypeError expected links to be an array");
    this.router.addSettingsLink(sectionId, links);
  };
  /**
   * @deprecated use `addSettingsLink` instead, you can pass a section object to
   * create the section and links at the same time.
   */
  createSettingSection = (section, links) => this.router.addSettingsLink(section, links);
  addSettingsLink = (sectionId, link) => {
    this.router.addSettingsLink(sectionId, link);
  };
  async bootstrap(customBootstrap) {
    Object.keys(this.appPlugins).forEach((plugin) => {
      const bootstrap = this.appPlugins[plugin].bootstrap;
      if (bootstrap) {
        bootstrap({
          addSettingsLink: this.addSettingsLink,
          addSettingsLinks: this.addSettingsLinks,
          getPlugin: this.getPlugin,
          registerHook: this.registerHook
        });
      }
    });
    if (isFunction(customBootstrap)) {
      customBootstrap({
        addComponents: this.addComponents,
        addFields: this.addFields,
        addMenuLink: this.addMenuLink,
        addReducers: this.addReducers,
        addSettingsLink: this.addSettingsLink,
        addSettingsLinks: this.addSettingsLinks,
        getPlugin: this.getPlugin,
        registerHook: this.registerHook
      });
    }
  }
  createCustomConfigurations = (customConfig) => {
    if (customConfig.locales) {
      this.configurations.locales = [
        "en",
        ...customConfig.locales?.filter((loc) => loc !== "en") || []
      ];
    }
    if (customConfig.auth?.logo) {
      this.configurations.authLogo = customConfig.auth.logo;
    }
    if (customConfig.menu?.logo) {
      this.configurations.menuLogo = customConfig.menu.logo;
    }
    if (customConfig.head?.favicon) {
      this.configurations.head.favicon = customConfig.head.favicon;
    }
    if (customConfig.theme) {
      const darkTheme2 = customConfig.theme.dark;
      const lightTheme2 = customConfig.theme.light;
      if (!darkTheme2 && !lightTheme2) {
        console.warn(
          `[deprecated] In future versions, Strapi will stop supporting this theme customization syntax. The theme configuration accepts a light and a dark key to customize each theme separately. See https://docs.strapi.io/developer-docs/latest/development/admin-customization.html#theme-extension.`.trim()
        );
        merge(this.configurations.themes.light, customConfig.theme);
      }
      if (lightTheme2)
        merge(this.configurations.themes.light, lightTheme2);
      if (darkTheme2)
        merge(this.configurations.themes.dark, darkTheme2);
    }
    if (customConfig.notifications?.releases !== void 0) {
      this.configurations.notifications.releases = customConfig.notifications.releases;
    }
    if (customConfig.tutorials !== void 0) {
      this.configurations.tutorials = customConfig.tutorials;
    }
  };
  createHook = (name) => {
    this.hooksDict[name] = createHook();
  };
  getAdminInjectedComponents = (moduleName, containerName, blockName) => {
    try {
      return this.admin.injectionZones[moduleName][containerName][blockName] || [];
    } catch (err) {
      console.error("Cannot get injected component", err);
      return [];
    }
  };
  getPlugin = (pluginId) => this.plugins[pluginId];
  async register(customRegister) {
    Object.keys(this.appPlugins).forEach((plugin) => {
      this.appPlugins[plugin].register(this);
    });
    if (isFunction(customRegister)) {
      customRegister(this);
    }
  }
  async loadAdminTrads() {
    const adminLocales = await Promise.all(
      this.configurations.locales.map(async (locale) => {
        try {
          const { default: data } = await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"./translations/en-GB.js": () => import('./en-GB-O6Z7xiyi.mjs')})), `./translations/${locale}.js`, 3);
          return { data, locale };
        } catch {
          try {
            const { default: data } = await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"./translations/ar.json": () => import('./ar-7vbwrPth.mjs'),"./translations/ca.json": () => import('./ca-f06Q0InB.mjs'),"./translations/cs.json": () => import('./cs-DrRkodPD.mjs'),"./translations/de.json": () => import('./de-D0NA2abW.mjs'),"./translations/dk.json": () => import('./dk-Cv0jDfcZ.mjs'),"./translations/en.json": () => import('./en-BXrZ-rxH.mjs'),"./translations/es.json": () => import('./es-t8XFZqIM.mjs'),"./translations/eu.json": () => import('./eu-CDMMTSys.mjs'),"./translations/fr.json": () => import('./fr-CKlZ-5Zr.mjs'),"./translations/gu.json": () => import('./gu-CSS25C49.mjs'),"./translations/he.json": () => import('./he-C3w9omDw.mjs'),"./translations/hi.json": () => import('./hi-DW2CutdA.mjs'),"./translations/hu.json": () => import('./hu-DaDd6FHR.mjs'),"./translations/id.json": () => import('./id-cH3Ovozx.mjs'),"./translations/it.json": () => import('./it-T1rZP3NX.mjs'),"./translations/ja.json": () => import('./ja-Cc9Dg_QK.mjs'),"./translations/ko.json": () => import('./ko-D1e-SMHS.mjs'),"./translations/ml.json": () => import('./ml-FLft_QIc.mjs'),"./translations/ms.json": () => import('./ms-eMDSLvhl.mjs'),"./translations/nl.json": () => import('./nl-CubaFTJw.mjs'),"./translations/no.json": () => import('./no-9TbSG07o.mjs'),"./translations/pl.json": () => import('./pl-B0hZgHvQ.mjs'),"./translations/pt-BR.json": () => import('./pt-BR-BDpWvCrQ.mjs'),"./translations/pt.json": () => import('./pt-8dwKSOn3.mjs'),"./translations/ru.json": () => import('./ru-C34i9wJx.mjs'),"./translations/sa.json": () => import('./sa-CHD-r_h-.mjs'),"./translations/sk.json": () => import('./sk-DQ2qpsG2.mjs'),"./translations/sv.json": () => import('./sv-D0vPVUAT.mjs'),"./translations/th.json": () => import('./th-BG3IOCqV.mjs'),"./translations/tr.json": () => import('./tr-Dq45DRRZ.mjs'),"./translations/uk.json": () => import('./uk-Ud9QNfkB.mjs'),"./translations/vi.json": () => import('./vi-CGrr4ioy.mjs'),"./translations/zh-Hans.json": () => import('./zh-Hans-C44LvcXE.mjs'),"./translations/zh.json": () => import('./zh-LqPg8hbL.mjs')})), `./translations/${locale}.json`, 3);
            return { data, locale };
          } catch {
            return { data: null, locale };
          }
        }
      })
    );
    return adminLocales.reduce((acc, current) => {
      if (current.data) {
        acc[current.locale] = current.data;
      }
      return acc;
    }, {});
  }
  /**
   * Load the application's translations and merged the custom translations
   * with the default ones.
   */
  async loadTrads(customTranslations = {}) {
    const adminTranslations = await this.loadAdminTrads();
    const arrayOfPromises = Object.keys(this.appPlugins).map((plugin) => {
      const registerTrads = this.appPlugins[plugin].registerTrads;
      if (registerTrads) {
        return registerTrads({ locales: this.configurations.locales });
      }
      return null;
    }).filter((a) => a);
    const pluginsTrads = await Promise.all(arrayOfPromises);
    const mergedTrads = pluginsTrads.reduce(
      (acc, currentPluginTrads) => {
        const pluginTrads = currentPluginTrads.reduce(
          (acc1, current) => {
            acc1[current.locale] = current.data;
            return acc1;
          },
          {}
        );
        Object.keys(pluginTrads).forEach((locale) => {
          acc[locale] = { ...acc[locale], ...pluginTrads[locale] };
        });
        return acc;
      },
      {}
    );
    const translations = this.configurations.locales.reduce((acc, current) => {
      acc[current] = {
        ...adminTranslations[current],
        ...mergedTrads[current] || {},
        ...customTranslations[current] ?? {}
      };
      return acc;
    }, {});
    this.configurations.translations = translations;
    return Promise.resolve();
  }
  registerHook = (name, fn) => {
    invariant(
      this.hooksDict[name],
      `The hook ${name} is not defined. You are trying to register a hook that does not exist in the application.`
    );
    this.hooksDict[name].register(fn);
  };
  registerPlugin = (pluginConf) => {
    const plugin = new Plugin(pluginConf);
    this.plugins[plugin.pluginId] = plugin;
  };
  runHookSeries = (name, asynchronous = false) => asynchronous ? this.hooksDict[name].runSeriesAsync() : this.hooksDict[name].runSeries();
  runHookWaterfall = (name, initialValue, store) => {
    return this.hooksDict[name].runWaterfall(initialValue, store);
  };
  runHookParallel = (name) => this.hooksDict[name].runParallel();
  render() {
    const localeNames = pick(languageNativeNames, this.configurations.locales || []);
    const locale = localStorage.getItem(LANGUAGE_LOCAL_STORAGE_KEY) || "en";
    this.store = configureStoreImpl(
      {
        admin_app: {
          permissions: merge({}, ADMIN_PERMISSIONS_CE, ADMIN_PERMISSIONS_EE),
          theme: {
            availableThemes: [],
            currentTheme: localStorage.getItem(THEME_LOCAL_STORAGE_KEY) || "system"
          },
          language: {
            locale: localeNames[locale] ? locale : "en",
            localeNames
          },
          token: getStoredToken()
        }
      },
      this.middlewares,
      this.reducers
    );
    const router = this.router.createRouter(this, {
      basename: getBasename()
    });
    return /* @__PURE__ */ jsx(RouterProvider, { router });
  }
}

const renderAdmin = async (mountNode, { plugins, customisations, features }) => {
  if (!mountNode) {
    throw new Error("[@strapi/admin]: Could not find the root element to mount the admin app");
  }
  window.strapi = {
    /**
     * This ENV variable is passed from the strapi instance, by default no url is set
     * in the config and therefore the instance returns you an empty string so URLs are relative.
     *
     * To ensure that the backendURL is always set, we use the window.location.origin as a fallback.
     */
    backendURL: createAbsoluteUrl(process.env.ADMIN_BACKEND_URL),
    isEE: false,
    telemetryDisabled: process.env.TELEMETRY_DISABLED === "true",
    future: {
      isEnabled: (name) => {
        return features?.future?.[name] === true;
      }
    },
    // @ts-expect-error – there's pollution from the global scope of Node.
    features: {
      SSO: "sso",
      AUDIT_LOGS: "audit-logs",
      REVIEW_WORKFLOWS: "review-workflows",
      /**
       * If we don't get the license then we know it's not EE
       * so no feature is enabled.
       */
      isEnabled: () => false
    },
    projectType: "Community",
    flags: {
      nps: false,
      promoteEE: true
    }
  };
  const { get } = getFetchClient();
  try {
    const {
      data: {
        data: { isEE, features: features2, flags }
      }
    } = await get("/admin/project-type");
    window.strapi.isEE = isEE;
    window.strapi.flags = flags;
    window.strapi.features = {
      ...window.strapi.features,
      isEnabled: (featureName) => features2.some((feature) => feature.name === featureName)
    };
    window.strapi.projectType = isEE ? "Enterprise" : "Community";
  } catch (err) {
    console.error(err);
  }
  const app = new StrapiApp({
    config: customisations?.config,
    appPlugins: plugins
  });
  await app.register(customisations?.register);
  await app.bootstrap(customisations?.bootstrap);
  await app.loadTrads(customisations?.config?.translations);
  createRoot(mountNode).render(app.render());
  if (typeof module !== "undefined" && module && "hot" in module && typeof module.hot === "object" && module.hot !== null && "accept" in module.hot && typeof module.hot.accept === "function") {
    module.hot.accept();
  }
};

const ConfirmDialog = ({
  children,
  icon = /* @__PURE__ */ jsx(StyledWarning, {}),
  onConfirm,
  variant = "danger-light",
  startAction,
  endAction,
  title
}) => {
  const { formatMessage } = useIntl();
  const [isConfirming, setIsConfirming] = React.useState(false);
  const content = children || formatMessage({
    id: "app.confirm.body",
    defaultMessage: "Are you sure?"
  });
  const handleConfirm = async (e) => {
    if (!onConfirm) {
      return;
    }
    try {
      setIsConfirming(true);
      await onConfirm(e);
    } finally {
      setIsConfirming(false);
    }
  };
  return /* @__PURE__ */ jsxs(Dialog.Content, { children: [
    /* @__PURE__ */ jsx(Dialog.Header, { children: title || formatMessage({
      id: "app.components.ConfirmDialog.title",
      defaultMessage: "Confirmation"
    }) }),
    /* @__PURE__ */ jsx(Dialog.Body, { icon, children: content }),
    /* @__PURE__ */ jsxs(Dialog.Footer, { children: [
      startAction || /* @__PURE__ */ jsx(Dialog.Cancel, { children: /* @__PURE__ */ jsx(
        Button,
        {
          fullWidth: true,
          variant: "tertiary",
          onClick: (e) => {
            e.stopPropagation();
          },
          children: formatMessage({
            id: "app.components.Button.cancel",
            defaultMessage: "Cancel"
          })
        }
      ) }),
      endAction || /* @__PURE__ */ jsx(Dialog.Action, { children: /* @__PURE__ */ jsx(Button, { fullWidth: true, onClick: handleConfirm, variant, loading: isConfirming, children: formatMessage({
        id: "app.components.Button.confirm",
        defaultMessage: "Confirm"
      }) }) })
    ] })
  ] });
};
const StyledWarning = styled(WarningCircle)`
  width: 24px;
  height: 24px;

  path {
    fill: ${({ theme }) => theme.colors.danger600};
  }
`;

const useIsMounted = () => {
  const isMounted = React.useRef(false);
  React.useLayoutEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return isMounted;
};

const useForceUpdate = () => {
  const [tick, update] = React.useState();
  const isMounted = useIsMounted();
  const forceUpdate = React.useCallback(() => {
    if (isMounted.current) {
      update(Math.random());
    }
  }, [isMounted, update]);
  return [tick, forceUpdate];
};

const useThrottledCallback = (callback, wait, options) => {
  const throttledCallback = useMemo(
    () => throttle(callback, wait, options),
    [callback, options, wait]
  );
  return throttledCallback;
};

const requestIdleCallbackShim = (callback) => {
  const start = Date.now();
  return setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining() {
        return Math.max(0, Date.now() - start);
      }
    });
  }, 1);
};
const _requestIdleCallback = typeof requestIdleCallback === "undefined" ? requestIdleCallbackShim : requestIdleCallback;
const cancelIdleCallbackShim = (handle) => {
  return clearTimeout(handle);
};
const _cancelIdleCallback = typeof cancelIdleCallback === "undefined" ? cancelIdleCallbackShim : cancelIdleCallback;

const DescriptionComponentRenderer = ({
  children,
  props,
  descriptions
}) => {
  const statesRef = React.useRef({});
  const [tick, forceUpdate] = useForceUpdate();
  const requestHandle = React.useRef(null);
  const requestUpdate = React.useCallback(() => {
    if (requestHandle.current) {
      _cancelIdleCallback(requestHandle.current);
    }
    requestHandle.current = _requestIdleCallback(() => {
      requestHandle.current = null;
      forceUpdate();
    });
  }, [forceUpdate]);
  const throttledRequestUpdate = useThrottledCallback(requestUpdate, 60, { trailing: true });
  const update = React.useCallback(
    (id, description) => {
      if (description === null) {
        delete statesRef.current[id];
      } else {
        const current = statesRef.current[id];
        statesRef.current[id] = { ...current, value: { ...description, id } };
      }
      throttledRequestUpdate();
    },
    [throttledRequestUpdate]
  );
  const ids2 = React.useMemo(
    () => descriptions.map((description) => getCompId(description)),
    [descriptions]
  );
  const states = React.useMemo(
    () => ids2.map((id) => statesRef.current[id]?.value).filter((state) => state !== null && state !== void 0),
    /**
     * we leave tick in the deps to ensure the memo is recalculated when the `update` function  is called.
     * the `ids` will most likely be stable unless we get new actions, but we can't respond to the Description
     * Component changing the ref data in any other way.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ids2, tick]
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    descriptions.map((description) => {
      const key = getCompId(description);
      return /* @__PURE__ */ jsx(Description, { id: key, description, props, update }, key);
    }),
    children(states)
  ] });
};
const Description = React.memo(
  ({ description, id, props, update }) => {
    const comp = description(props);
    useShallowCompareEffect(() => {
      update(id, comp);
      return () => {
        update(id, null);
      };
    }, comp);
    return null;
  },
  (prev, next) => isEqual(prev.props, next.props)
);
const ids = /* @__PURE__ */ new WeakMap();
let counter = 0;
function getCompId(comp) {
  const cachedId = ids.get(comp);
  if (cachedId)
    return cachedId;
  const id = `${comp.name || comp.displayName || "<anonymous>"}-${counter++}`;
  ids.set(comp, id);
  return id;
}
const useShallowCompareMemoize = (value) => {
  const ref = React.useRef(void 0);
  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }
  return [ref.current];
};
const useShallowCompareEffect = (callback, dependencies) => {
  React.useEffect(callback, useShallowCompareMemoize(dependencies));
};

const BASE_FILTERS = [
  {
    label: { id: "components.FilterOptions.FILTER_TYPES.$eq", defaultMessage: "is" },
    value: "$eq"
  },
  {
    label: { id: "components.FilterOptions.FILTER_TYPES.$ne", defaultMessage: "is not" },
    value: "$ne"
  },
  {
    label: {
      id: "components.FilterOptions.FILTER_TYPES.$null",
      defaultMessage: "is null"
    },
    value: "$null"
  },
  {
    label: {
      id: "components.FilterOptions.FILTER_TYPES.$notNull",
      defaultMessage: "is not null"
    },
    value: "$notNull"
  }
];
const NUMERIC_FILTERS = [
  {
    label: {
      id: "components.FilterOptions.FILTER_TYPES.$gt",
      defaultMessage: "is greater than"
    },
    value: "$gt"
  },
  {
    label: {
      id: "components.FilterOptions.FILTER_TYPES.$gte",
      defaultMessage: "is greater than or equal to"
    },
    value: "$gte"
  },
  {
    label: {
      id: "components.FilterOptions.FILTER_TYPES.$lt",
      defaultMessage: "is less than"
    },
    value: "$lt"
  },
  {
    label: {
      id: "components.FilterOptions.FILTER_TYPES.$lte",
      defaultMessage: "is less than or equal to"
    },
    value: "$lte"
  }
];
const IS_SENSITIVE_FILTERS = [
  {
    label: {
      id: "components.FilterOptions.FILTER_TYPES.$eqi",
      defaultMessage: "is (case insensitive)"
    },
    value: "$eqi"
  },
  {
    label: {
      id: "components.FilterOptions.FILTER_TYPES.$nei",
      defaultMessage: "is not (case insensitive)"
    },
    value: "$nei"
  }
];
const CONTAINS_FILTERS = [
  {
    label: {
      id: "components.FilterOptions.FILTER_TYPES.$contains",
      defaultMessage: "contains"
    },
    value: "$contains"
  },
  {
    label: {
      id: "components.FilterOptions.FILTER_TYPES.$containsi",
      defaultMessage: "contains (case insensitive)"
    },
    value: "$containsi"
  },
  {
    label: {
      id: "components.FilterOptions.FILTER_TYPES.$notContains",
      defaultMessage: "not contains"
    },
    value: "$notContains"
  },
  {
    label: {
      id: "components.FilterOptions.FILTER_TYPES.$notContainsi",
      defaultMessage: "not contains (case insensitive)"
    },
    value: "$notContainsi"
  }
];
const STRING_PARSE_FILTERS = [
  {
    label: {
      id: "components.FilterOptions.FILTER_TYPES.$startsWith",
      defaultMessage: "starts with"
    },
    value: "$startsWith"
  },
  {
    label: {
      id: "components.FilterOptions.FILTER_TYPES.$startsWithi",
      defaultMessage: "starts with (case insensitive)"
    },
    value: "$startsWithi"
  },
  {
    label: {
      id: "components.FilterOptions.FILTER_TYPES.$endsWith",
      defaultMessage: "ends with"
    },
    value: "$endsWith"
  },
  {
    label: {
      id: "components.FilterOptions.FILTER_TYPES.$endsWithi",
      defaultMessage: "ends with (case insensitive)"
    },
    value: "$endsWithi"
  }
];
const FILTERS_WITH_NO_VALUE = ["$null", "$notNull"];

function useControllableState({
  prop,
  defaultProp,
  onChange = () => {
  }
}) {
  const [uncontrolledProp, setUncontrolledProp] = useUncontrolledState({ defaultProp, onChange });
  const isControlled = prop !== void 0;
  const value = isControlled ? prop : uncontrolledProp;
  const handleChange = useCallbackRef(onChange);
  const setValue = React.useCallback(
    (nextValue) => {
      if (isControlled) {
        const setter = nextValue;
        const value2 = typeof nextValue === "function" ? setter(prop) : nextValue;
        if (value2 !== prop)
          handleChange(value2);
      } else {
        setUncontrolledProp(nextValue);
      }
    },
    [isControlled, prop, setUncontrolledProp, handleChange]
  );
  return [value, setValue];
}
function useUncontrolledState({
  defaultProp,
  onChange
}) {
  const uncontrolledState = React.useState(defaultProp);
  const [value] = uncontrolledState;
  const prevValueRef = React.useRef(value);
  const handleChange = useCallbackRef(onChange);
  React.useEffect(() => {
    if (prevValueRef.current !== value) {
      handleChange(value);
      prevValueRef.current = value;
    }
  }, [value, prevValueRef, handleChange]);
  return uncontrolledState;
}

const [FiltersProvider, useFilters] = createContext("Filters");
const Root$2 = ({
  children,
  disabled = false,
  onChange,
  options = [],
  onOpenChange,
  open: openProp,
  defaultOpen,
  ...restProps
}) => {
  const handleChange = (data) => {
    if (onChange) {
      onChange(data);
    }
  };
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange
  });
  return /* @__PURE__ */ jsx(Popover.Root, { open, onOpenChange: setOpen, ...restProps, children: /* @__PURE__ */ jsx(
    FiltersProvider,
    {
      setOpen,
      disabled,
      onChange: handleChange,
      options,
      children
    }
  ) });
};
const Trigger = React.forwardRef(
  ({ label }, forwardedRef) => {
    const { formatMessage } = useIntl();
    const disabled = useFilters("Trigger", ({ disabled: disabled2 }) => disabled2);
    return /* @__PURE__ */ jsx(Popover.Trigger, { children: /* @__PURE__ */ jsx(
      Button,
      {
        variant: "tertiary",
        ref: forwardedRef,
        startIcon: /* @__PURE__ */ jsx(Filter, {}),
        size: "S",
        disabled,
        children: label || formatMessage({ id: "app.utils.filters", defaultMessage: "Filters" })
      }
    ) });
  }
);
const PopoverImpl = () => {
  const [{ query }, setQuery] = useQueryParams();
  const { formatMessage } = useIntl();
  const options = useFilters("Popover", ({ options: options2 }) => options2);
  const onChange = useFilters("Popover", ({ onChange: onChange2 }) => onChange2);
  const setOpen = useFilters("Popover", ({ setOpen: setOpen2 }) => setOpen2);
  if (options.length === 0) {
    return null;
  }
  const handleSubmit = (data) => {
    const value = FILTERS_WITH_NO_VALUE.includes(data.filter) ? "true" : encodeURIComponent(data.value ?? "");
    if (!value) {
      return;
    }
    if (onChange) {
      onChange(data);
    }
    const fieldOptions = options.find((filter) => filter.name === data.name);
    const operatorValuePairing = {
      [data.filter]: value
    };
    const newFilterQuery = {
      ...query.filters,
      $and: [
        ...query.filters?.$and ?? [],
        {
          [data.name]: fieldOptions.type === "relation" ? {
            [fieldOptions.mainField?.name ?? "id"]: operatorValuePairing
          } : operatorValuePairing
        }
      ]
    };
    setQuery({ filters: newFilterQuery, page: 1 });
    setOpen(false);
  };
  return /* @__PURE__ */ jsx(Popover.Content, { children: /* @__PURE__ */ jsx(Box, { padding: 3, children: /* @__PURE__ */ jsx(
    Form,
    {
      method: "POST",
      initialValues: {
        name: options[0]?.name,
        filter: BASE_FILTERS[0].value
      },
      onSubmit: handleSubmit,
      children: ({ values: formValues, modified, isSubmitting }) => {
        const filter = options.find((filter2) => filter2.name === formValues.name);
        const Input = filter?.input || MemoizedInputRenderer;
        return /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "stretch", gap: 2, style: { minWidth: 184 }, children: [
          [
            {
              ["aria-label"]: formatMessage({
                id: "app.utils.select-field",
                defaultMessage: "Select field"
              }),
              name: "name",
              options: options.map((filter2) => ({
                label: filter2.label,
                value: filter2.name
              })),
              placholder: formatMessage({
                id: "app.utils.select-field",
                defaultMessage: "Select field"
              }),
              type: "enumeration"
            },
            {
              ["aria-label"]: formatMessage({
                id: "app.utils.select-filter",
                defaultMessage: "Select filter"
              }),
              name: "filter",
              options: filter?.operators || getFilterList(filter).map((opt) => ({
                label: formatMessage(opt.label),
                value: opt.value
              })),
              placeholder: formatMessage({
                id: "app.utils.select-filter",
                defaultMessage: "Select filter"
              }),
              type: "enumeration"
            }
          ].map((field) => /* @__PURE__ */ jsx(MemoizedInputRenderer, { ...field }, field.name)),
          filter && formValues.filter && formValues.filter !== "$null" && formValues.filter !== "$notNull" ? /* @__PURE__ */ jsx(
            Input,
            {
              ...filter,
              label: null,
              "aria-label": filter.label,
              name: "value",
              type: filter.mainField?.type ?? filter.type
            }
          ) : null,
          /* @__PURE__ */ jsx(
            Button,
            {
              disabled: !modified || isSubmitting,
              size: "L",
              variant: "secondary",
              startIcon: /* @__PURE__ */ jsx(Plus, {}),
              type: "submit",
              fullWidth: true,
              children: formatMessage({ id: "app.utils.add-filter", defaultMessage: "Add filter" })
            }
          )
        ] });
      }
    }
  ) }) });
};
const getFilterList = (filter) => {
  if (!filter) {
    return [];
  }
  const type = filter.mainField?.type ? filter.mainField.type : filter.type;
  switch (type) {
    case "email":
    case "text":
    case "string": {
      return [
        ...BASE_FILTERS,
        ...IS_SENSITIVE_FILTERS,
        ...CONTAINS_FILTERS,
        ...STRING_PARSE_FILTERS
      ];
    }
    case "float":
    case "integer":
    case "biginteger":
    case "decimal": {
      return [...BASE_FILTERS, ...NUMERIC_FILTERS];
    }
    case "time":
    case "date": {
      return [...BASE_FILTERS, ...NUMERIC_FILTERS, ...CONTAINS_FILTERS];
    }
    case "datetime": {
      return [...BASE_FILTERS, ...NUMERIC_FILTERS];
    }
    case "enumeration": {
      return BASE_FILTERS;
    }
    default:
      return [...BASE_FILTERS, ...IS_SENSITIVE_FILTERS];
  }
};
const List = () => {
  const [{ query }, setQuery] = useQueryParams();
  const options = useFilters("List", ({ options: options2 }) => options2);
  const handleClick = (data) => {
    const nextFilters = (query?.filters?.$and ?? []).filter((filter) => {
      const [attributeName] = Object.keys(filter);
      if (attributeName !== data.name) {
        return true;
      }
      const { type, mainField } = options.find(({ name }) => name === attributeName);
      if (type === "relation") {
        const filterObj = filter[attributeName][mainField?.name ?? "id"];
        if (typeof filterObj === "object") {
          const [operator] = Object.keys(filterObj);
          const value = filterObj[operator];
          return !(operator === data.filter && value === data.value);
        }
        return true;
      } else {
        const filterObj = filter[attributeName];
        const [operator] = Object.keys(filterObj);
        const value = filterObj[operator];
        return !(operator === data.filter && value === data.value);
      }
    });
    setQuery({ filters: { $and: nextFilters }, page: 1 });
  };
  if (!query?.filters?.$and?.length) {
    return null;
  }
  return /* @__PURE__ */ jsx(Fragment, { children: query?.filters?.$and?.map((queryFilter) => {
    const [attributeName] = Object.keys(queryFilter);
    const filter = options.find(({ name }) => name === attributeName);
    const filterObj = queryFilter[attributeName];
    if (!filter || typeof filterObj !== "object" || filterObj === null) {
      return null;
    }
    if (filter.type === "relation") {
      const modelFilter = filterObj[filter.mainField?.name ?? "id"];
      if (typeof modelFilter === "object") {
        const [operator] = Object.keys(modelFilter);
        const value = modelFilter[operator];
        return /* @__PURE__ */ jsx(
          AttributeTag,
          {
            ...filter,
            onClick: handleClick,
            operator,
            value
          },
          `${attributeName}-${operator}-${value}`
        );
      }
      return null;
    } else {
      const [operator] = Object.keys(filterObj);
      const value = filterObj[operator];
      if (typeof value === "object") {
        return null;
      }
      return /* @__PURE__ */ jsx(
        AttributeTag,
        {
          ...filter,
          onClick: handleClick,
          operator,
          value
        },
        `${attributeName}-${operator}-${value}`
      );
    }
  }) });
};
const AttributeTag = ({
  input,
  label,
  mainField,
  name,
  onClick,
  operator,
  options,
  value,
  ...filter
}) => {
  const { formatMessage, formatDate, formatTime, formatNumber } = useIntl();
  const handleClick = () => {
    onClick({ name, value, filter: operator });
  };
  const type = mainField?.type ? mainField.type : filter.type;
  let formattedValue = value;
  switch (type) {
    case "date":
      formattedValue = formatDate(value, { dateStyle: "full" });
      break;
    case "datetime":
      formattedValue = formatDate(value, { dateStyle: "full", timeStyle: "short" });
      break;
    case "time":
      const [hour, minute] = value.split(":");
      const date = /* @__PURE__ */ new Date();
      date.setHours(Number(hour));
      date.setMinutes(Number(minute));
      formattedValue = formatTime(date, {
        hour: "numeric",
        minute: "numeric"
      });
      break;
    case "float":
    case "integer":
    case "biginteger":
    case "decimal":
      formattedValue = formatNumber(Number(value));
      break;
  }
  if (input && options) {
    const selectedOption = options.find((option) => {
      return (typeof option === "string" ? option : option.value) === value;
    });
    formattedValue = selectedOption ? typeof selectedOption === "string" ? selectedOption : selectedOption.label ?? selectedOption.value : value;
  }
  const content = `${label} ${formatMessage({
    id: `components.FilterOptions.FILTER_TYPES.${operator}`,
    defaultMessage: operator
  })} ${operator !== "$null" && operator !== "$notNull" ? formattedValue : ""}`;
  return /* @__PURE__ */ jsx(Tag, { padding: 1, onClick: handleClick, icon: /* @__PURE__ */ jsx(Cross, {}), children: content });
};
const Filters = {
  List,
  Popover: PopoverImpl,
  Root: Root$2,
  Trigger
};

const [PaginationProvider, usePagination] = createContext("Pagination");
const Root$1 = React.forwardRef(
  ({ children, defaultPageSize = 10, pageCount = 0, defaultPage = 1, onPageSizeChange, total = 0 }, forwardedRef) => {
    const [{ query }, setQuery] = useQueryParams(
      {
        pageSize: defaultPageSize.toString(),
        page: defaultPage.toString()
      }
    );
    const setPageSize = (pageSize) => {
      setQuery({ pageSize, page: "1" });
      if (onPageSizeChange) {
        onPageSizeChange(pageSize);
      }
    };
    return /* @__PURE__ */ jsx(
      Flex,
      {
        ref: forwardedRef,
        paddingTop: 4,
        paddingBottom: 4,
        alignItems: "flex-end",
        justifyContent: "space-between",
        children: /* @__PURE__ */ jsx(
          PaginationProvider,
          {
            currentQuery: query,
            page: query.page,
            pageSize: query.pageSize,
            pageCount: pageCount.toString(),
            setPageSize,
            total,
            children
          }
        )
      }
    );
  }
);
const PageSize = ({ options = ["10", "20", "50", "100"] }) => {
  const { formatMessage } = useIntl();
  const pageSize = usePagination("PageSize", (state) => state.pageSize);
  const totalCount = usePagination("PageSize", (state) => state.total);
  const setPageSize = usePagination("PageSize", (state) => state.setPageSize);
  const handleChange = (value) => {
    setPageSize(value);
  };
  const minimumOption = parseInt(options[0], 10);
  if (minimumOption >= totalCount) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Flex, { gap: 2, children: [
    /* @__PURE__ */ jsx(
      SingleSelect,
      {
        size: "S",
        "aria-label": formatMessage({
          id: "components.PageFooter.select",
          defaultMessage: "Entries per page"
        }),
        onChange: handleChange,
        value: pageSize,
        children: options.map((option) => /* @__PURE__ */ jsx(SingleSelectOption, { value: option, children: option }, option))
      }
    ),
    /* @__PURE__ */ jsx(Typography, { textColor: "neutral600", tag: "span", children: formatMessage({
      id: "components.PageFooter.select",
      defaultMessage: "Entries per page"
    }) })
  ] });
};
const Links = ({ boundaryCount = 1, siblingCount = 1 }) => {
  const { formatMessage } = useIntl();
  const query = usePagination("Links", (state) => state.currentQuery);
  const currentPage = usePagination("Links", (state) => state.page);
  const totalPages = usePagination("Links", (state) => state.pageCount);
  const pageCount = parseInt(totalPages, 10);
  const activePage = parseInt(currentPage, 10);
  const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };
  const startPages = range(1, Math.min(boundaryCount, pageCount));
  const endPages = range(Math.max(pageCount - boundaryCount + 1, boundaryCount + 1), pageCount);
  const siblingsStart = Math.max(
    Math.min(
      // Natural start
      activePage - siblingCount,
      // Lower boundary when page is high
      pageCount - boundaryCount - siblingCount * 2 - 1
    ),
    // Greater than startPages
    boundaryCount + 2
  );
  const siblingsEnd = Math.min(
    Math.max(
      // Natural end
      activePage + siblingCount,
      // Upper boundary when page is low
      boundaryCount + siblingCount * 2 + 2
    ),
    // Less than endPages
    endPages.length > 0 ? endPages[0] - 2 : pageCount - 1
  );
  const items = [
    ...startPages,
    // Start ellipsis
    // eslint-disable-next-line no-nested-ternary
    ...siblingsStart > boundaryCount + 2 ? ["start-ellipsis"] : boundaryCount + 1 < pageCount - boundaryCount ? [boundaryCount + 1] : [],
    // Sibling pages
    ...range(siblingsStart, siblingsEnd),
    // End ellipsis
    // eslint-disable-next-line no-nested-ternary
    ...siblingsEnd < pageCount - boundaryCount - 1 ? ["end-ellipsis"] : pageCount - boundaryCount > boundaryCount ? [pageCount - boundaryCount] : [],
    ...endPages
  ];
  if (pageCount <= 1) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Pagination$1, { activePage, pageCount, children: [
    /* @__PURE__ */ jsx(PreviousLink, { tag: Link$1, to: { search: stringify({ ...query, page: activePage - 1 }) }, children: formatMessage({
      id: "components.pagination.go-to-previous",
      defaultMessage: "Go to previous page"
    }) }),
    items.map((item) => {
      if (typeof item === "number") {
        return /* @__PURE__ */ jsx(
          PageLink,
          {
            tag: Link$1,
            number: item,
            to: { search: stringify({ ...query, page: item }) },
            children: formatMessage(
              { id: "components.pagination.go-to", defaultMessage: "Go to page {page}" },
              { page: item }
            )
          },
          item
        );
      }
      return /* @__PURE__ */ jsx(Dots, {}, item);
    }),
    /* @__PURE__ */ jsx(NextLink, { tag: Link$1, to: { search: stringify({ ...query, page: activePage + 1 }) }, children: formatMessage({
      id: "components.pagination.go-to-next",
      defaultMessage: "Go to next page"
    }) })
  ] });
};
const Pagination = {
  Root: Root$1,
  Links,
  PageSize
};

const SearchInput = ({
  disabled,
  label,
  placeholder,
  trackedEvent,
  trackedEventDetails
}) => {
  const inputRef = React.useRef(null);
  const iconButtonRef = React.useRef(null);
  const [{ query }, setQuery] = useQueryParams();
  const [value, setValue] = React.useState(query?._q || "");
  const [isOpen, setIsOpen] = React.useState(!!value);
  const { formatMessage } = useIntl();
  const { trackUsage } = useTracking();
  const handleToggle = () => setIsOpen((prev) => !prev);
  React.useLayoutEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  const handleClear = () => {
    setValue("");
    setQuery({ _q: "" }, "remove");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value) {
      if (trackedEvent) {
        trackUsage(trackedEvent, trackedEventDetails);
      }
      setQuery({ _q: encodeURIComponent(value), page: 1 });
    } else {
      handleToggle();
      setQuery({ _q: "" }, "remove");
    }
  };
  if (isOpen) {
    return /* @__PURE__ */ jsx(SearchForm, { onSubmit: handleSubmit, children: /* @__PURE__ */ jsx(
      Searchbar,
      {
        ref: inputRef,
        name: "search",
        onChange: (e) => setValue(e.target.value),
        value,
        clearLabel: formatMessage({ id: "clearLabel", defaultMessage: "Clear" }),
        onClear: handleClear,
        placeholder,
        children: label
      }
    ) });
  }
  return /* @__PURE__ */ jsx(
    IconButton,
    {
      ref: iconButtonRef,
      disabled,
      label: formatMessage({ id: "global.search", defaultMessage: "Search" }),
      onClick: handleToggle,
      children: /* @__PURE__ */ jsx(Search, {})
    }
  );
};

const [TableProvider, useTable] = createContext("Table");
const Root = ({
  children,
  defaultSelectedRows,
  footer,
  headers = [],
  isLoading = false,
  onSelectedRowsChange,
  rows = [],
  selectedRows: selectedRowsProps
}) => {
  const [selectedRows = [], setSelectedRows] = useControllableState({
    prop: selectedRowsProps,
    defaultProp: defaultSelectedRows,
    onChange: onSelectedRowsChange
  });
  const [hasHeaderCheckbox, setHasHeaderCheckbox] = React.useState(false);
  const rowCount = rows.length + 1;
  const colCount = hasHeaderCheckbox ? headers.length + 1 : headers.length;
  const selectRow = (row) => {
    if (Array.isArray(row)) {
      setSelectedRows(row);
    } else {
      setSelectedRows((prev = []) => {
        const currentRowIndex = prev.findIndex((r) => r.id === row.id);
        if (currentRowIndex > -1) {
          return prev.toSpliced(currentRowIndex, 1);
        }
        return [...prev, row];
      });
    }
  };
  return /* @__PURE__ */ jsx(
    TableProvider,
    {
      colCount,
      hasHeaderCheckbox,
      setHasHeaderCheckbox,
      footer,
      headers,
      isLoading,
      rowCount,
      rows,
      selectedRows,
      selectRow,
      children
    }
  );
};
const Content = ({ children }) => {
  const rowCount = useTable("Content", (state) => state.rowCount);
  const colCount = useTable("Content", (state) => state.colCount);
  const footer = useTable("Content", (state) => state.footer);
  return /* @__PURE__ */ jsx(Table$1, { rowCount, colCount, footer, children });
};
const Head = ({ children }) => {
  return /* @__PURE__ */ jsx(Thead, { children: /* @__PURE__ */ jsx(Tr, { children }) });
};
const HeaderCell = ({ name, label, sortable }) => {
  const [{ query }, setQuery] = useQueryParams();
  const sort = query?.sort ?? "";
  const [sortBy, sortOrder] = sort.split(":");
  const { formatMessage } = useIntl();
  const isSorted = sortBy === name;
  const sortLabel = formatMessage(
    { id: "components.TableHeader.sort", defaultMessage: "Sort on {label}" },
    { label }
  );
  const handleClickSort = () => {
    if (sortable) {
      setQuery({
        sort: `${name}:${isSorted && sortOrder === "ASC" ? "DESC" : "ASC"}`
      });
    }
  };
  return /* @__PURE__ */ jsx(
    Th,
    {
      action: isSorted && sortable && /* @__PURE__ */ jsx(IconButton, { label: sortLabel, onClick: handleClickSort, variant: "ghost", children: /* @__PURE__ */ jsx(SortIcon, { $isUp: sortOrder === "ASC" }) }),
      children: /* @__PURE__ */ jsx(Tooltip, { label: sortable ? sortLabel : label, children: /* @__PURE__ */ jsx(
        Typography,
        {
          textColor: "neutral600",
          tag: !isSorted && sortable ? "button" : "span",
          onClick: handleClickSort,
          variant: "sigma",
          children: label
        }
      ) })
    }
  );
};
const SortIcon = styled(CaretDown)`
  transform: ${({ $isUp }) => `rotate(${$isUp ? "180" : "0"}deg)`};
`;
const ActionBar = ({ children }) => {
  const { formatMessage } = useIntl();
  const selectedRows = useTable("ActionBar", (state) => state.selectedRows);
  if (selectedRows.length === 0)
    return null;
  return /* @__PURE__ */ jsxs(Flex, { gap: 2, children: [
    /* @__PURE__ */ jsx(Typography, { variant: "omega", textColor: "neutral500", children: formatMessage(
      {
        id: "content-manager.components.TableDelete.label",
        defaultMessage: "{number, plural, one {# row} other {# rows}} selected"
      },
      { number: selectedRows.length }
    ) }),
    children
  ] });
};
const HeaderCheckboxCell = () => {
  const rows = useTable("HeaderCheckboxCell", (state) => state.rows);
  const selectedRows = useTable("HeaderCheckboxCell", (state) => state.selectedRows);
  const selectRow = useTable("HeaderCheckboxCell", (state) => state.selectRow);
  const setHasHeaderCheckbox = useTable(
    "HeaderCheckboxCell",
    (state) => state.setHasHeaderCheckbox
  );
  const { formatMessage } = useIntl();
  const areAllEntriesSelected = selectedRows.length === rows.length && rows.length > 0;
  const isIndeterminate = !areAllEntriesSelected && selectedRows.length > 0;
  React.useEffect(() => {
    setHasHeaderCheckbox(true);
    return () => setHasHeaderCheckbox(false);
  }, [setHasHeaderCheckbox]);
  const handleSelectAll = () => {
    if (!areAllEntriesSelected) {
      selectRow(rows);
    } else {
      selectRow([]);
    }
  };
  return /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(
    Checkbox,
    {
      "aria-label": formatMessage({
        id: "global.select-all-entries",
        defaultMessage: "Select all entries"
      }),
      disabled: rows.length === 0,
      checked: isIndeterminate ? "indeterminate" : areAllEntriesSelected,
      onCheckedChange: handleSelectAll
    }
  ) });
};
const Empty = (props) => {
  const { formatMessage } = useIntl();
  const rows = useTable("Empty", (state) => state.rows);
  const isLoading = useTable("Empty", (state) => state.isLoading);
  const colCount = useTable("Empty", (state) => state.colCount);
  if (rows.length > 0 || isLoading) {
    return null;
  }
  return /* @__PURE__ */ jsx(Tbody, { children: /* @__PURE__ */ jsx(Tr, { children: /* @__PURE__ */ jsx(Td, { colSpan: colCount, children: /* @__PURE__ */ jsx(
    EmptyStateLayout,
    {
      content: formatMessage({
        id: "app.components.EmptyStateLayout.content-document",
        defaultMessage: "No content found"
      }),
      hasRadius: true,
      icon: /* @__PURE__ */ jsx(EmptyDocuments, { width: "16rem" }),
      ...props
    }
  ) }) }) });
};
const Loading = ({ children = "Loading content" }) => {
  const isLoading = useTable("Loading", (state) => state.isLoading);
  const colCount = useTable("Loading", (state) => state.colCount);
  if (!isLoading) {
    return null;
  }
  return /* @__PURE__ */ jsx(Tbody, { children: /* @__PURE__ */ jsx(Tr, { children: /* @__PURE__ */ jsx(Td, { colSpan: colCount, children: /* @__PURE__ */ jsx(Flex, { justifyContent: "center", padding: 11, background: "neutral0", children: /* @__PURE__ */ jsx(Loader, { children }) }) }) }) });
};
const Body = ({ children }) => {
  const isLoading = useTable("Body", (state) => state.isLoading);
  const rows = useTable("Body", (state) => state.rows);
  if (isLoading || rows.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsx(Tbody, { children });
};
const Row = (props) => {
  return /* @__PURE__ */ jsx(Tr, { ...props });
};
const Cell = (props) => {
  return /* @__PURE__ */ jsx(Td, { ...props });
};
const CheckboxCell = ({ id, ...props }) => {
  const rows = useTable("CheckboxCell", (state) => state.rows);
  const selectedRows = useTable("CheckboxCell", (state) => state.selectedRows);
  const selectRow = useTable("CheckboxCell", (state) => state.selectRow);
  const { formatMessage } = useIntl();
  const handleSelectRow = () => {
    selectRow(rows.find((row) => row.id === id));
  };
  const isChecked = selectedRows.findIndex((row) => row.id === id) > -1;
  return /* @__PURE__ */ jsx(Cell, { ...props, onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsx(
    Checkbox,
    {
      "aria-label": formatMessage(
        {
          id: "app.component.table.select.one-entry",
          defaultMessage: `Select {target}`
        },
        { target: id }
      ),
      disabled: rows.length === 0,
      checked: isChecked,
      onCheckedChange: handleSelectRow
    }
  ) });
};
const Table = {
  Root,
  Content,
  ActionBar,
  Head,
  HeaderCell,
  HeaderCheckboxCell,
  Body,
  CheckboxCell,
  Cell,
  Row,
  Loading,
  Empty
};

const ContentBox = ({
  title,
  subtitle,
  icon,
  iconBackground,
  endAction,
  titleEllipsis = false
}) => {
  if (title && title.length > 70 && titleEllipsis) {
    title = `${title.substring(0, 70)}...`;
  }
  return /* @__PURE__ */ jsxs(Flex, { shadow: "tableShadow", hasRadius: true, padding: 6, background: "neutral0", children: [
    /* @__PURE__ */ jsx(IconWrapper, { background: iconBackground, hasRadius: true, padding: 3, children: icon }),
    /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "stretch", gap: endAction ? 0 : 1, children: [
      /* @__PURE__ */ jsxs(Flex, { children: [
        /* @__PURE__ */ jsx(TypographyWordBreak, { fontWeight: "semiBold", variant: "pi", children: title }),
        endAction
      ] }),
      /* @__PURE__ */ jsx(Typography, { textColor: "neutral600", children: subtitle })
    ] })
  ] });
};
const IconWrapper = styled(Flex)`
  margin-right: ${({ theme }) => theme.spaces[6]};

  svg {
    width: 3.2rem;
    height: 3.2rem;
  }
`;
const TypographyWordBreak = styled(Typography)`
  color: ${({ theme }) => theme.colors.neutral800};
  word-break: break-all;
`;

function useInjectReducer(namespace, reducer) {
  const store = useTypedStore();
  useEffect(() => {
    store.injectReducer(namespace, reducer);
  }, [store, namespace, reducer]);
}

const useFetchClient = () => {
  const controller = React.useRef(null);
  if (controller.current === null) {
    controller.current = new AbortController();
  }
  React.useEffect(() => {
    return () => {
      controller.current.abort();
    };
  }, []);
  return React.useMemo(
    () => getFetchClient({
      signal: controller.current.signal
    }),
    []
  );
};

const usersService = adminApi.enhanceEndpoints({
  addTagTypes: ["LicenseLimits", "User", "Role", "RolePermissions"]
}).injectEndpoints({
  endpoints: (builder) => ({
    /**
     * users
     */
    createUser: builder.mutation({
      query: (body) => ({
        url: "/admin/users",
        method: "POST",
        data: body
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["LicenseLimits", { type: "User", id: "LIST" }]
    }),
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/users/${id}`,
        method: "PUT",
        data: body
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" }
      ]
    }),
    getUsers: builder.query({
      query: ({ id, ...params } = {}) => ({
        url: `/admin/users/${id ?? ""}`,
        method: "GET",
        config: {
          params
        }
      }),
      transformResponse: (res) => {
        let users = [];
        if (res.data) {
          if ("results" in res.data) {
            if (Array.isArray(res.data.results)) {
              users = res.data.results;
            }
          } else {
            users = [res.data];
          }
        }
        return {
          users,
          pagination: "pagination" in res.data ? res.data.pagination : null
        };
      },
      providesTags: (res, _err, arg) => {
        if (typeof arg === "object" && "id" in arg) {
          return [{ type: "User", id: arg.id }];
        } else {
          return [
            ...res?.users.map(({ id }) => ({ type: "User", id })) ?? [],
            { type: "User", id: "LIST" }
          ];
        }
      }
    }),
    deleteManyUsers: builder.mutation({
      query: (body) => ({
        url: "/admin/users/batch-delete",
        method: "POST",
        data: body
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: ["LicenseLimits", { type: "User", id: "LIST" }]
    }),
    /**
     * roles
     */
    createRole: builder.mutation({
      query: (body) => ({
        url: "/admin/roles",
        method: "POST",
        data: body
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: [{ type: "Role", id: "LIST" }]
    }),
    getRoles: builder.query({
      query: ({ id, ...params } = {}) => ({
        url: `/admin/roles/${id ?? ""}`,
        method: "GET",
        config: {
          params
        }
      }),
      transformResponse: (res) => {
        let roles = [];
        if (res.data) {
          if (Array.isArray(res.data)) {
            roles = res.data;
          } else {
            roles = [res.data];
          }
        }
        return roles;
      },
      providesTags: (res, _err, arg) => {
        if (typeof arg === "object" && "id" in arg) {
          return [{ type: "Role", id: arg.id }];
        } else {
          return [
            ...res?.map(({ id }) => ({ type: "Role", id })) ?? [],
            { type: "Role", id: "LIST" }
          ];
        }
      }
    }),
    updateRole: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/roles/${id}`,
        method: "PUT",
        data: body
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: (_res, _err, { id }) => [{ type: "Role", id }]
    }),
    getRolePermissions: builder.query({
      query: ({ id, ...params }) => ({
        url: `/admin/roles/${id}/permissions`,
        method: "GET",
        config: {
          params
        }
      }),
      transformResponse: (res) => res.data,
      providesTags: (_res, _err, { id }) => [{ type: "RolePermissions", id }]
    }),
    updateRolePermissions: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/roles/${id}/permissions`,
        method: "PUT",
        data: body
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: (_res, _err, { id }) => [{ type: "RolePermissions", id }]
    }),
    /**
     * Permissions
     */
    getRolePermissionLayout: builder.query({
      query: (params) => ({
        url: "/admin/permissions",
        method: "GET",
        config: {
          params
        }
      }),
      transformResponse: (res) => res.data
    })
  }),
  overrideExisting: false
});
const {
  useCreateUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteManyUsersMutation,
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useGetRolePermissionsQuery,
  useGetRolePermissionLayoutQuery,
  useUpdateRolePermissionsMutation
} = usersService;
const useAdminUsers = useGetUsersQuery;

export { useInjectReducer as A, BackButton as B, ConfirmDialog as C, useFocusInputField as D, renderAdmin as E, Form as F, DescriptionComponentRenderer as G, Blocker as H, getYupValidationErrors as I, useTable as J, constants as K, LayoutContent as L, MemoizedInputRenderer as M, NpsSurvey as N, Pagination as P, SearchInput as S, Table as T, UnauthenticatedLayout as U, Logo as a, Layouts as b, useGetRolesQuery as c, Login as d, errorsTrads as e, useGetRolePermissionLayoutQuery as f, useGetRolePermissionsQuery as g, useCreateRoleMutation as h, useUpdateRolePermissionsMutation as i, useUpdateUserMutation as j, useAdminUsers as k, getBasename as l, Column as m, useFetchClient as n, useUpdateRoleMutation as o, SETTINGS_LINKS_CE as p, useCreateUserMutation as q, useDeleteManyUsersMutation as r, Filters as s, useClipboard as t, useField as u, ContentBox as v, useForm as w, MemoizedStringInput as x, StrapiLogo as y, useHistory as z };
//# sourceMappingURL=index-DdAmwxFa.mjs.map
