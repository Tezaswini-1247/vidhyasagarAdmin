import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import { useMemo, useCallback, useRef, useEffect } from 'react';
import { createContext as createContext$1 } from '@radix-ui/react-context';
import { useIntl, IntlProvider } from 'react-intl';
import { Flex, useCallbackRef, Alert, Link, Main, Loader, EmptyStateLayout, Box, DesignSystemProvider } from '@strapi/design-system';
import { WarningCircle } from '@strapi/icons';
import { EmptyPermissions, EmptyDocuments } from '@strapi/icons/symbols';
import { useLocation, useNavigate } from 'react-router-dom';
import { parse, stringify } from 'qs';
import { a as adminApi, e as useInitQuery, f as useTelemetryPropertiesQuery, g as useProjectSettingsQuery, h as useUpdateProjectSettingsMutation } from './admin-CuE4OEl1.mjs';
import clone from 'lodash/clone';
import toPath from 'lodash/toPath';
import isEqual from 'lodash/isEqual';
import axios from 'axios';
import { produce } from 'immer';
import get from 'lodash/get';
import set from 'lodash/set';
import * as ContextSelector from 'use-context-selector';
import defaultsDeep from 'lodash/defaultsDeep';
import { useStore, useDispatch, useSelector } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import { createSelector, createSlice } from '@reduxjs/toolkit';

class RBAC {
  middlewares = [];
  constructor() {
  }
  use(middleware) {
    if (Array.isArray(middleware)) {
      this.middlewares.push(...middleware);
    } else {
      this.middlewares.push(middleware);
    }
  }
  run = async (ctx, permissions) => {
    let index = 0;
    const middlewaresToRun = this.middlewares.map((middleware) => middleware(ctx));
    const next = async (permissions2) => {
      if (index < this.middlewares.length) {
        return middlewaresToRun[index++](next)(permissions2);
      }
      return permissions2;
    };
    return next(permissions);
  };
}

function createContext(rootComponentName, defaultContext) {
  const Context = ContextSelector.createContext(defaultContext);
  const Provider = (props) => {
    const { children, ...context } = props;
    const value = React.useMemo(() => context, Object.values(context));
    return /* @__PURE__ */ jsx(Context.Provider, { value, children });
  };
  const useContext = (consumerName, selector) => ContextSelector.useContextSelector(Context, (ctx) => {
    if (ctx)
      return selector(ctx);
    throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
  });
  Provider.displayName = rootComponentName + "Provider";
  return [Provider, useContext];
}

const useTypedDispatch = useDispatch;
const useTypedStore = useStore;
const useTypedSelector = useSelector;
const createTypedSelector = (selector) => createSelector((state) => state, selector);

const [StrapiAppProvider, useStrapiApp] = createContext("StrapiApp");

const useQueryParams = (initialParams) => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const query = useMemo(() => {
    const searchQuery = search.startsWith("?") ? search.slice(1) : search;
    if (!search && initialParams) {
      return initialParams;
    }
    return { ...initialParams, ...parse(searchQuery) };
  }, [search, initialParams]);
  const setQuery = useCallback(
    (nextParams, method = "push", replace = false) => {
      let nextQuery = { ...query };
      if (method === "remove") {
        Object.keys(nextParams).forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(nextQuery, key)) {
            delete nextQuery[key];
          }
        });
      } else {
        nextQuery = { ...query, ...nextParams };
      }
      navigate({ search: stringify(nextQuery, { encode: false }) }, { replace });
    },
    [navigate, query]
  );
  return [{ query, rawQuery: search }, setQuery];
};

const STORAGE_KEYS$1 = {
  TOKEN: "jwtToken",
  USER: "userInfo"
};
const THEME_LOCAL_STORAGE_KEY = "STRAPI_THEME";
const LANGUAGE_LOCAL_STORAGE_KEY = "strapi-admin-language";
const getStoredToken = () => {
  const token = localStorage.getItem(STORAGE_KEYS$1.TOKEN) ?? sessionStorage.getItem(STORAGE_KEYS$1.TOKEN);
  if (typeof token === "string") {
    return JSON.parse(token);
  }
  return null;
};
const adminSlice = createSlice({
  name: "admin",
  initialState: () => {
    return {
      language: {
        locale: "en",
        localeNames: { en: "English" }
      },
      permissions: {},
      theme: {
        availableThemes: [],
        currentTheme: localStorage.getItem(THEME_LOCAL_STORAGE_KEY) || "system"
      },
      token: null
    };
  },
  reducers: {
    setAppTheme(state, action) {
      state.theme.currentTheme = action.payload;
      window.localStorage.setItem(THEME_LOCAL_STORAGE_KEY, action.payload);
    },
    setAvailableThemes(state, action) {
      state.theme.availableThemes = action.payload;
    },
    setLocale(state, action) {
      state.language.locale = action.payload;
      window.localStorage.setItem(LANGUAGE_LOCAL_STORAGE_KEY, action.payload);
      document.documentElement.setAttribute("lang", action.payload);
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    login(state, action) {
      const { token, persist } = action.payload;
      if (!persist) {
        window.sessionStorage.setItem(STORAGE_KEYS$1.TOKEN, JSON.stringify(token));
      } else {
        window.localStorage.setItem(STORAGE_KEYS$1.TOKEN, JSON.stringify(token));
      }
      state.token = token;
    },
    logout(state) {
      state.token = null;
      window.localStorage.removeItem(STORAGE_KEYS$1.TOKEN);
      window.localStorage.removeItem(STORAGE_KEYS$1.USER);
      window.sessionStorage.removeItem(STORAGE_KEYS$1.TOKEN);
      window.sessionStorage.removeItem(STORAGE_KEYS$1.USER);
    }
  }
});
const reducer$1 = adminSlice.reducer;
const { setAppTheme, setAvailableThemes, setLocale, setToken, logout, login } = adminSlice.actions;

const authService = adminApi.enhanceEndpoints({
  addTagTypes: ["User", "Me", "ProvidersOptions"]
}).injectEndpoints({
  endpoints: (builder) => ({
    /**
     * ME
     */
    getMe: builder.query({
      query: () => ({
        method: "GET",
        url: "/admin/users/me"
      }),
      transformResponse(res) {
        return res.data;
      },
      providesTags: (res) => res ? ["Me", { type: "User", id: res.id }] : ["Me"]
    }),
    getMyPermissions: builder.query({
      query: () => ({
        method: "GET",
        url: "/admin/users/me/permissions"
      }),
      transformResponse(res) {
        return res.data;
      }
    }),
    updateMe: builder.mutation({
      query: (body) => ({
        method: "PUT",
        url: "/admin/users/me",
        data: body
      }),
      transformResponse(res) {
        return res.data;
      },
      invalidatesTags: ["Me"]
    }),
    /**
     * Permissions
     */
    checkPermissions: builder.query({
      query: (permissions) => ({
        method: "POST",
        url: "/admin/permissions/check",
        data: permissions
      })
    }),
    /**
     * Auth methods
     */
    login: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: "/admin/login",
        data: body
      }),
      transformResponse(res) {
        return res.data;
      },
      invalidatesTags: ["Me"]
    }),
    logout: builder.mutation({
      query: () => ({
        method: "POST",
        url: "/admin/logout"
      })
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: "/admin/reset-password",
        data: body
      }),
      transformResponse(res) {
        return res.data;
      }
    }),
    renewToken: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: "/admin/renew-token",
        data: body
      }),
      transformResponse(res) {
        return res.data;
      }
    }),
    getRegistrationInfo: builder.query({
      query: (registrationToken) => ({
        url: "/admin/registration-info",
        method: "GET",
        config: {
          params: {
            registrationToken
          }
        }
      }),
      transformResponse(res) {
        return res.data;
      }
    }),
    registerAdmin: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: "/admin/register-admin",
        data: body
      }),
      transformResponse(res) {
        return res.data;
      }
    }),
    registerUser: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: "/admin/register",
        data: body
      }),
      transformResponse(res) {
        return res.data;
      }
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: "/admin/forgot-password",
        method: "POST",
        data: body
      })
    }),
    isSSOLocked: builder.query({
      query: () => ({
        url: "/admin/providers/isSSOLocked",
        method: "GET"
      }),
      transformResponse(res) {
        return res.data;
      }
    }),
    getProviders: builder.query({
      query: () => ({
        url: "/admin/providers",
        method: "GET"
      })
    }),
    getProviderOptions: builder.query({
      query: () => ({
        url: "/admin/providers/options",
        method: "GET"
      }),
      transformResponse(res) {
        return res.data;
      },
      providesTags: ["ProvidersOptions"]
    }),
    updateProviderOptions: builder.mutation({
      query: (body) => ({
        url: "/admin/providers/options",
        method: "PUT",
        data: body
      }),
      transformResponse(res) {
        return res.data;
      },
      invalidatesTags: ["ProvidersOptions"]
    })
  }),
  overrideExisting: false
});
const {
  useCheckPermissionsQuery,
  useLazyCheckPermissionsQuery,
  useGetMeQuery,
  useLoginMutation,
  useRenewTokenMutation,
  useLogoutMutation,
  useUpdateMeMutation,
  useResetPasswordMutation,
  useRegisterAdminMutation,
  useRegisterUserMutation,
  useGetRegistrationInfoQuery,
  useForgotPasswordMutation,
  useGetMyPermissionsQuery,
  useIsSSOLockedQuery,
  useGetProvidersQuery,
  useGetProviderOptionsQuery,
  useUpdateProviderOptionsMutation
} = authService;

const [Provider, useAuth] = createContext("Auth");
const STORAGE_KEYS = {
  TOKEN: "jwtToken",
  USER: "userInfo"
};
const AuthProvider = ({
  children,
  _defaultPermissions = [],
  _disableRenewToken = false
}) => {
  const dispatch = useTypedDispatch();
  const runRbacMiddleware = useStrapiApp("AuthProvider", (state) => state.rbac.run);
  const location = useLocation();
  const [{ rawQuery }] = useQueryParams();
  const token = useTypedSelector((state) => state.admin_app.token ?? null);
  const { data: user, isLoading: isLoadingUser } = useGetMeQuery(void 0, {
    /**
     * If there's no token, we don't try to fetch
     * the user data because it will fail.
     */
    skip: !token
  });
  const {
    data: userPermissions = _defaultPermissions,
    refetch,
    isUninitialized,
    isLoading: isLoadingPermissions
  } = useGetMyPermissionsQuery(void 0, {
    skip: !token
  });
  const navigate = useNavigate();
  const [loginMutation] = useLoginMutation();
  const [renewTokenMutation] = useRenewTokenMutation();
  const [logoutMutation] = useLogoutMutation();
  const clearStateAndLogout = React.useCallback(() => {
    dispatch(adminApi.util.resetApiState());
    dispatch(logout());
    navigate("/auth/login");
  }, [dispatch, navigate]);
  React.useEffect(() => {
    if (token && !_disableRenewToken) {
      renewTokenMutation({ token }).then((res) => {
        if ("data" in res) {
          dispatch(
            login({
              token: res.data.token
            })
          );
        } else {
          clearStateAndLogout();
        }
      });
    }
  }, [token, dispatch, renewTokenMutation, clearStateAndLogout, _disableRenewToken]);
  React.useEffect(() => {
    if (user) {
      if (user.preferedLanguage) {
        dispatch(setLocale(user.preferedLanguage));
      }
    }
  }, [dispatch, user]);
  React.useEffect(() => {
    const handleUserStorageChange = (event) => {
      if (event.key === STORAGE_KEYS.USER && event.newValue === null) {
        clearStateAndLogout();
      }
    };
    window.addEventListener("storage", handleUserStorageChange);
    return () => {
      window.removeEventListener("storage", handleUserStorageChange);
    };
  });
  const login$1 = React.useCallback(
    async ({ rememberMe, ...body }) => {
      const res = await loginMutation(body);
      if ("data" in res) {
        const { token: token2 } = res.data;
        dispatch(
          login({
            token: token2,
            persist: rememberMe
          })
        );
      }
      return res;
    },
    [dispatch, loginMutation]
  );
  const logout$1 = React.useCallback(async () => {
    await logoutMutation();
    clearStateAndLogout();
  }, [clearStateAndLogout, logoutMutation]);
  const refetchPermissions = React.useCallback(async () => {
    if (!isUninitialized) {
      await refetch();
    }
  }, [isUninitialized, refetch]);
  const [checkPermissions] = useLazyCheckPermissionsQuery();
  const checkUserHasPermissions = React.useCallback(
    async (permissions, passedPermissions, rawQueryContext) => {
      if (!permissions || permissions.length === 0) {
        return [{ action: "", subject: "" }];
      }
      const actualUserPermissions = passedPermissions ?? userPermissions;
      const matchingPermissions = actualUserPermissions.filter(
        (permission) => permissions.findIndex(
          (perm) => perm.action === permission.action && perm.subject === permission.subject
        ) >= 0
      );
      const middlewaredPermissions = await runRbacMiddleware(
        {
          user,
          permissions: userPermissions,
          pathname: location.pathname,
          search: (rawQueryContext || rawQuery).split("?")[1] ?? ""
        },
        matchingPermissions
      );
      const shouldCheckConditions = middlewaredPermissions.some(
        (perm) => Array.isArray(perm.conditions) && perm.conditions.length > 0
      );
      if (!shouldCheckConditions) {
        return middlewaredPermissions;
      }
      const { data, error } = await checkPermissions({
        permissions: middlewaredPermissions.map((perm) => ({
          action: perm.action,
          subject: perm.subject
        }))
      });
      if (error) {
        throw error;
      } else {
        return middlewaredPermissions.filter((_, index) => data?.data[index] === true);
      }
    },
    [checkPermissions, location.pathname, rawQuery, runRbacMiddleware, user, userPermissions]
  );
  const isLoading = isLoadingUser || isLoadingPermissions;
  return /* @__PURE__ */ jsx(
    Provider,
    {
      token,
      user,
      login: login$1,
      logout: logout$1,
      permissions: userPermissions,
      checkUserHasPermissions,
      refetchPermissions,
      isLoading,
      children
    }
  );
};

const NotificationsContext = React.createContext({
  toggleNotification: () => {
  }
});
const NotificationsProvider = ({ children }) => {
  const notificationIdRef = React.useRef(0);
  const [notifications, setNotifications] = React.useState([]);
  const toggleNotification = React.useCallback(
    ({ type, message, link, timeout, blockTransition, onClose, title }) => {
      setNotifications((s) => [
        ...s,
        {
          id: notificationIdRef.current++,
          type,
          message,
          link,
          timeout,
          blockTransition,
          onClose,
          title
        }
      ]);
    },
    []
  );
  const clearNotification = React.useCallback((id) => {
    setNotifications((s) => s.filter((n) => n.id !== id));
  }, []);
  const value = React.useMemo(() => ({ toggleNotification }), [toggleNotification]);
  return /* @__PURE__ */ jsxs(NotificationsContext.Provider, { value, children: [
    /* @__PURE__ */ jsx(
      Flex,
      {
        left: "50%",
        marginLeft: "-250px",
        position: "fixed",
        direction: "column",
        alignItems: "stretch",
        gap: 2,
        top: `4.6rem`,
        width: `50rem`,
        zIndex: "notification",
        children: notifications.map((notification) => {
          return /* @__PURE__ */ jsx(
            Notification,
            {
              ...notification,
              clearNotification
            },
            notification.id
          );
        })
      }
    ),
    children
  ] });
};
const Notification = ({
  clearNotification,
  blockTransition = false,
  id,
  link,
  message,
  onClose,
  timeout = 2500,
  title,
  type
}) => {
  const { formatMessage } = useIntl();
  const onCloseCallback = useCallbackRef(onClose);
  const handleClose = React.useCallback(() => {
    onCloseCallback();
    clearNotification(id);
  }, [clearNotification, id, onCloseCallback]);
  React.useEffect(() => {
    if (!blockTransition) {
      const timeoutReference = setTimeout(() => {
        handleClose();
      }, timeout);
      return () => {
        clearTimeout(timeoutReference);
      };
    }
  }, [blockTransition, handleClose, timeout]);
  let variant;
  let alertTitle;
  if (type === "info") {
    variant = "default";
    alertTitle = formatMessage({
      id: "notification.default.title",
      defaultMessage: "Information:"
    });
  } else if (type === "danger") {
    variant = "danger";
    alertTitle = formatMessage({
      id: "notification.warning.title",
      defaultMessage: "Warning:"
    });
  } else if (type === "warning") {
    variant = "warning";
    alertTitle = formatMessage({
      id: "notification.warning.title",
      defaultMessage: "Warning:"
    });
  } else {
    variant = "success";
    alertTitle = formatMessage({
      id: "notification.success.title",
      defaultMessage: "Success:"
    });
  }
  if (title) {
    alertTitle = title;
  }
  return /* @__PURE__ */ jsx(
    Alert,
    {
      action: link ? /* @__PURE__ */ jsx(Link, { href: link.url, isExternal: true, children: link.label }) : void 0,
      onClose: handleClose,
      closeLabel: formatMessage({
        id: "global.close",
        defaultMessage: "Close"
      }),
      title: alertTitle,
      variant,
      children: message
    }
  );
};
/**
 * @preserve
 * @description Returns an object to interact with the notification
 * system. The callbacks are wrapped in `useCallback` for a stable
 * identity.
 *
 * @example
 * ```tsx
 * import { useNotification } from '@strapi/strapi/admin';
 *
 * const MyComponent = () => {
 *  const { toggleNotification } = useNotification();
 *
 *  return <button onClick={() => toggleNotification({ message: 'Hello world!' })}>Click me</button>;
 */
const useNotification = () => React.useContext(NotificationsContext);

function getPrefixedId(message, callback) {
  const prefixedMessage = `apiError.${message}`;
  if (typeof callback === "function") {
    return callback(prefixedMessage);
  }
  return prefixedMessage;
}

function normalizeError(error, { name, intlMessagePrefixCallback }) {
  const { message } = error;
  const normalizedError = {
    id: getPrefixedId(message, intlMessagePrefixCallback),
    defaultMessage: message,
    name: error.name ?? name,
    values: {}
  };
  if ("path" in error) {
    normalizedError.values = { path: error.path.join(".") };
  }
  return normalizedError;
}
const validateErrorIsYupValidationError = (err) => typeof err.details === "object" && err.details !== null && "errors" in err.details;
function normalizeAPIError(apiError, intlMessagePrefixCallback) {
  const error = apiError.response?.data?.error;
  if (error) {
    if (validateErrorIsYupValidationError(error)) {
      return {
        name: error.name,
        message: error?.message || null,
        errors: error.details.errors.map(
          (err) => normalizeError(err, { name: error.name, intlMessagePrefixCallback })
        )
      };
    }
    return normalizeError(error, { intlMessagePrefixCallback });
  }
  return null;
}

function getIn(obj, key, def, pathStartIndex = 0) {
  const path = toPath(key);
  while (obj && pathStartIndex < path.length) {
    obj = obj[path[pathStartIndex++]];
  }
  if (pathStartIndex !== path.length && !obj) {
    return def;
  }
  return obj === void 0 ? def : obj;
}
const isObject = (obj) => obj !== null && typeof obj === "object" && !Array.isArray(obj);
const isInteger = (obj) => String(Math.floor(Number(obj))) === obj;
function setIn(obj, path, value) {
  const res = clone(obj);
  let resVal = res;
  let i = 0;
  const pathArray = toPath(path);
  for (; i < pathArray.length - 1; i++) {
    const currentPath = pathArray[i];
    const currentObj = getIn(obj, pathArray.slice(0, i + 1));
    if (currentObj && (isObject(currentObj) || Array.isArray(currentObj))) {
      resVal = resVal[currentPath] = clone(currentObj);
    } else {
      const nextPath = pathArray[i + 1];
      resVal = resVal[currentPath] = isInteger(nextPath) && Number(nextPath) >= 0 ? [] : {};
    }
  }
  if ((i === 0 ? obj : resVal)[pathArray[i]] === value) {
    return obj;
  }
  if (value === void 0) {
    delete resVal[pathArray[i]];
  } else {
    resVal[pathArray[i]] = value;
  }
  if (i === 0 && value === void 0) {
    delete res[pathArray[i]];
  }
  return res;
}

function useAPIErrorHandler(intlMessagePrefixCallback) {
  const { formatMessage } = useIntl();
  const formatError = React.useCallback(
    (error) => {
      try {
        const formattedErr = formatAPIError(error, { intlMessagePrefixCallback, formatMessage });
        if (!formattedErr) {
          return formatFetchError(error, { intlMessagePrefixCallback, formatMessage });
        }
        return formattedErr;
      } catch (_) {
        throw new Error("formatAPIError: Unknown error:", error);
      }
    },
    [formatMessage, intlMessagePrefixCallback]
  );
  return {
    /**
     * @alpha
     * Convert ValidationErrors from the API into an object that can be used by forms.
     */
    _unstableFormatValidationErrors: React.useCallback(
      (error) => {
        if (typeof error.details === "object" && error.details !== null) {
          if ("errors" in error.details && Array.isArray(error.details.errors)) {
            const validationErrors = error.details.errors;
            return validationErrors.reduce((acc, err) => {
              const { path, message } = err;
              return setIn(acc, path.join("."), message);
            }, {});
          } else {
            const details = error.details;
            return Object.keys(details).reduce((acc, key) => {
              const messages = details[key];
              return {
                ...acc,
                [key]: messages.join(", ")
              };
            }, {});
          }
        } else {
          return {};
        }
      },
      []
    ),
    /**
     * @alpha
     * This handles the errors given from `redux-toolkit`'s axios based baseQuery function.
     */
    _unstableFormatAPIError: React.useCallback(
      (error) => {
        const err = {
          response: {
            data: {
              error
            }
          }
        };
        if (!error.message) {
          return "Unknown error occured.";
        }
        return formatError(err);
      },
      [formatError]
    ),
    formatAPIError: formatError
  };
}
function formatFetchError(error, { intlMessagePrefixCallback, formatMessage }) {
  const { code, message } = error;
  return formatMessage(
    {
      id: getPrefixedId(message, intlMessagePrefixCallback),
      defaultMessage: message
    },
    {
      code
    }
  );
}
function formatAPIError(error, { formatMessage, intlMessagePrefixCallback }) {
  if (!formatMessage) {
    throw new Error("The formatMessage callback is a mandatory argument.");
  }
  const normalizedError = normalizeAPIError(error, intlMessagePrefixCallback);
  if (!normalizedError) {
    return null;
  }
  if ("message" in normalizedError && normalizedError.message !== null) {
    return normalizedError.message;
  }
  if ("errors" in normalizedError) {
    return normalizedError.errors.map(({ id, defaultMessage, values }) => formatMessage({ id, defaultMessage }, values)).join("\n");
  }
  return formatMessage(normalizedError);
}

const PageMain = ({ children, ...restProps }) => {
  return /* @__PURE__ */ jsx(Main, { ...restProps, children });
};
const Loading = ({ children = "Loading content." }) => {
  return /* @__PURE__ */ jsx(PageMain, { height: "100vh", "aria-busy": true, children: /* @__PURE__ */ jsx(Flex, { alignItems: "center", height: "100%", justifyContent: "center", children: /* @__PURE__ */ jsx(Loader, { children }) }) });
};
const Error$1 = (props) => {
  const { formatMessage } = useIntl();
  return /* @__PURE__ */ jsx(PageMain, { height: "100%", children: /* @__PURE__ */ jsx(Flex, { alignItems: "center", height: "100%", justifyContent: "center", children: /* @__PURE__ */ jsx(
    EmptyStateLayout,
    {
      icon: /* @__PURE__ */ jsx(WarningCircle, { width: "16rem" }),
      content: formatMessage({
        id: "anErrorOccurred",
        defaultMessage: "Woops! Something went wrong. Please, try again."
      }),
      ...props
    }
  ) }) });
};
const NoPermissions = (props) => {
  const { formatMessage } = useIntl();
  return /* @__PURE__ */ jsx(PageMain, { height: "100%", children: /* @__PURE__ */ jsx(Flex, { alignItems: "center", height: "100%", justifyContent: "center", children: /* @__PURE__ */ jsx(Box, { minWidth: "50%", children: /* @__PURE__ */ jsx(
    EmptyStateLayout,
    {
      icon: /* @__PURE__ */ jsx(EmptyPermissions, { width: "16rem" }),
      content: formatMessage({
        id: "app.components.EmptyStateLayout.content-permissions",
        defaultMessage: "You don't have the permissions to access that content"
      }),
      ...props
    }
  ) }) }) });
};
const NoData = (props) => {
  const { formatMessage } = useIntl();
  return /* @__PURE__ */ jsx(PageMain, { height: "100%", background: "neutral100", children: /* @__PURE__ */ jsx(Flex, { alignItems: "center", height: "100%", width: "100%", justifyContent: "center", children: /* @__PURE__ */ jsx(Box, { minWidth: "50%", children: /* @__PURE__ */ jsx(
    EmptyStateLayout,
    {
      icon: /* @__PURE__ */ jsx(EmptyDocuments, { width: "16rem" }),
      action: props.action,
      content: formatMessage({
        id: "app.components.EmptyStateLayout.content-document",
        defaultMessage: "No content found"
      }),
      ...props
    }
  ) }) }) });
};
const Protect = ({ permissions = [], children }) => {
  const userPermissions = useAuth("Protect", (state) => state.permissions);
  const { toggleNotification } = useNotification();
  const { _unstableFormatAPIError: formatAPIError } = useAPIErrorHandler();
  const matchingPermissions = userPermissions.filter(
    (permission) => permissions.findIndex(
      (perm) => perm.action === permission.action && perm.subject === permission.subject
    ) >= 0
  );
  const shouldCheckConditions = matchingPermissions.some(
    (perm) => Array.isArray(perm.conditions) && perm.conditions.length > 0
  );
  const { isLoading, error, data } = useCheckPermissionsQuery(
    {
      permissions: matchingPermissions.map((perm) => ({
        action: perm.action,
        subject: perm.subject
      }))
    },
    {
      skip: !shouldCheckConditions
    }
  );
  React.useEffect(() => {
    if (error) {
      toggleNotification({
        type: "danger",
        message: formatAPIError(error)
      });
    }
  }, [error, formatAPIError, toggleNotification]);
  if (isLoading) {
    return /* @__PURE__ */ jsx(Loading, {});
  }
  if (error) {
    return /* @__PURE__ */ jsx(Error$1, {});
  }
  const { data: permissionsData } = data || {};
  const canAccess = shouldCheckConditions && permissionsData ? !permissionsData.includes(false) : matchingPermissions.length > 0;
  if (!canAccess) {
    return /* @__PURE__ */ jsx(NoPermissions, {});
  }
  return /* @__PURE__ */ jsx(Fragment, { children: typeof children === "function" ? children({ permissions: matchingPermissions }) : children });
};
const Title = ({ children: title }) => {
  React.useEffect(() => {
    document.title = `${title} | AI4Mahila`;
  }, [title]);
  return null;
};
const Page = {
  Error: Error$1,
  Loading,
  NoPermissions,
  Protect,
  NoData,
  Main: PageMain,
  Title
};

const once = (fn) => {
  const func = fn;
  let called = false;
  if (typeof func !== "function") {
    throw new TypeError(`once requires a function parameter`);
  }
  return (...args) => {
    if (!called && process.env.NODE_ENV === "development") {
      func(...args);
      called = true;
    }
  };
};

const capitalise = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const usePrev = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

const useRBAC = (permissionsToCheck = [], passedPermissions, rawQueryContext) => {
  const isLoadingAuth = useAuth("useRBAC", (state) => state.isLoading);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState();
  const [data, setData] = React.useState();
  const warnOnce = React.useMemo(() => once(console.warn), []);
  const actualPermissionsToCheck = React.useMemo(() => {
    if (Array.isArray(permissionsToCheck)) {
      return permissionsToCheck;
    } else {
      warnOnce(
        "useRBAC: The first argument should be an array of permissions, not an object. This will be deprecated in the future."
      );
      return Object.values(permissionsToCheck).flat();
    }
  }, [permissionsToCheck, warnOnce]);
  const defaultAllowedActions = React.useMemo(() => {
    return actualPermissionsToCheck.reduce((acc, permission) => {
      return {
        ...acc,
        [getActionName(permission)]: false
      };
    }, {});
  }, [actualPermissionsToCheck]);
  const checkUserHasPermissions = useAuth("useRBAC", (state) => state.checkUserHasPermissions);
  const permssionsChecked = usePrev(actualPermissionsToCheck);
  const contextChecked = usePrev(rawQueryContext);
  React.useEffect(() => {
    if (!isEqual(permssionsChecked, actualPermissionsToCheck) || // TODO: also run this when the query context changes
    contextChecked !== rawQueryContext) {
      setIsLoading(true);
      setData(void 0);
      setError(void 0);
      checkUserHasPermissions(actualPermissionsToCheck, passedPermissions, rawQueryContext).then((res) => {
        if (res) {
          setData(
            res.reduce((acc, permission) => {
              return {
                ...acc,
                [getActionName(permission)]: true
              };
            }, {})
          );
        }
      }).catch((err) => {
        setError(err);
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [
    actualPermissionsToCheck,
    checkUserHasPermissions,
    passedPermissions,
    permissionsToCheck,
    permssionsChecked,
    contextChecked,
    rawQueryContext
  ]);
  const allowedActions = Object.entries({
    ...defaultAllowedActions,
    ...data
  }).reduce((acc, [name, allowed]) => {
    acc[`can${capitalise(name)}`] = allowed;
    return acc;
  }, {});
  return {
    allowedActions,
    permissions: actualPermissionsToCheck,
    isLoading: isLoading || isLoadingAuth,
    error
  };
};
const getActionName = (permission) => {
  const [action = ""] = permission.action.split(".").slice(-1);
  return action.split("-").map(capitalise).join("");
};

const [AppInfoProvider, useAppInfo] = createContext("AppInfo", {});

const TrackingContext = React.createContext({
  uuid: false
});
const TrackingProvider = ({ children }) => {
  const token = useAuth("App", (state) => state.token);
  const { data: initData } = useInitQuery();
  const { uuid } = initData ?? {};
  const { data } = useTelemetryPropertiesQuery(void 0, {
    skip: !initData?.uuid || !token
  });
  React.useEffect(() => {
    if (uuid && data) {
      const event = "didInitializeAdministration";
      try {
        fetch("https://analytics.strapi.io/api/v2/track", {
          method: "POST",
          body: JSON.stringify({
            // This event is anonymous
            event,
            userId: "",
            eventPropeties: {},
            groupProperties: { ...data, projectId: uuid }
          }),
          headers: {
            "Content-Type": "application/json",
            "X-Strapi-Event": event
          }
        });
      } catch {
      }
    }
  }, [data, uuid]);
  const value = React.useMemo(
    () => ({
      uuid,
      telemetryProperties: data
    }),
    [uuid, data]
  );
  return /* @__PURE__ */ jsx(TrackingContext.Provider, { value, children });
};
const useTracking = () => {
  const { uuid, telemetryProperties } = React.useContext(TrackingContext);
  const userId = useAppInfo("useTracking", (state) => state.userId);
  const trackUsage = React.useCallback(
    async (event, properties) => {
      try {
        if (uuid && !window.strapi.telemetryDisabled) {
          const res = await axios.post(
            "https://analytics.strapi.io/api/v2/track",
            {
              event,
              userId,
              eventProperties: { ...properties },
              userProperties: {},
              groupProperties: {
                ...telemetryProperties,
                projectId: uuid,
                projectType: window.strapi.projectType
              }
            },
            {
              headers: {
                "Content-Type": "application/json",
                "X-Strapi-Event": event
              }
            }
          );
          return res;
        }
      } catch (err) {
      }
      return null;
    },
    [telemetryProperties, userId, uuid]
  );
  return { trackUsage };
};

const [ConfigurationContextProvider, useConfiguration] = createContext$1("ConfigurationContext");
const ConfigurationProvider = ({
  children,
  defaultAuthLogo,
  defaultMenuLogo,
  showReleaseNotification = false,
  showTutorials = false
}) => {
  const { trackUsage } = useTracking();
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();
  const { _unstableFormatAPIError: formatAPIError } = useAPIErrorHandler();
  const permissions = useTypedSelector(
    (state) => state.admin_app.permissions.settings?.["project-settings"]
  );
  const token = useAuth("ConfigurationProvider", (state) => state.token);
  const {
    allowedActions: { canRead }
  } = useRBAC(permissions);
  const {
    data: { authLogo: customAuthLogo, menuLogo: customMenuLogo } = {},
    error,
    isLoading
  } = useInitQuery();
  React.useEffect(() => {
    if (error) {
      toggleNotification({
        type: "danger",
        message: formatMessage({ id: "app.containers.App.notification.error.init" })
      });
    }
  }, [error, formatMessage, toggleNotification]);
  const { data, isSuccess } = useProjectSettingsQuery(void 0, {
    skip: !token || !canRead
  });
  const [updateProjectSettingsMutation] = useUpdateProjectSettingsMutation();
  const updateProjectSettings = React.useCallback(
    async (body) => {
      const formData = new FormData();
      Object.entries(body).forEach(([key, value]) => {
        if (value?.rawFile) {
          formData.append(key, value.rawFile);
        } else if (value === null) {
          formData.append(key, JSON.stringify(value));
        }
      });
      const res = await updateProjectSettingsMutation(formData);
      if ("data" in res) {
        const updatedMenuLogo = !!res.data.menuLogo && !!body.menuLogo?.rawFile;
        const updatedAuthLogo = !!res.data.authLogo && !!body.authLogo?.rawFile;
        if (updatedMenuLogo) {
          trackUsage("didChangeLogo", {
            logo: "menu"
          });
        }
        if (updatedAuthLogo) {
          trackUsage("didChangeLogo", {
            logo: "auth"
          });
        }
        toggleNotification({
          type: "success",
          message: formatMessage({ id: "app", defaultMessage: "Saved" })
        });
      } else {
        toggleNotification({
          type: "danger",
          message: formatAPIError(res.error)
        });
      }
    },
    [formatAPIError, formatMessage, toggleNotification, trackUsage, updateProjectSettingsMutation]
  );
  if (isLoading) {
    return /* @__PURE__ */ jsx(Page.Loading, {});
  }
  return /* @__PURE__ */ jsx(
    ConfigurationContextProvider,
    {
      showReleaseNotification,
      showTutorials,
      logos: {
        menu: {
          custom: isSuccess ? data?.menuLogo : {
            url: customMenuLogo ?? ""
          },
          default: defaultMenuLogo
        },
        auth: {
          custom: isSuccess ? data?.authLogo : {
            url: customAuthLogo ?? ""
          },
          default: defaultAuthLogo
        }
      },
      updateProjectSettings,
      children
    }
  );
};

const GUIDED_TOUR_COMPLETED_STEPS = "GUIDED_TOUR_COMPLETED_STEPS";
const GUIDED_TOUR_CURRENT_STEP = "GUIDED_TOUR_CURRENT_STEP";
const GUIDED_TOUR_SKIPPED = "GUIDED_TOUR_SKIPPED";
const [GuidedTourProviderImpl, useGuidedTour] = createContext("GuidedTour");
const GuidedTourProvider = ({ children }) => {
  const [{ currentStep, guidedTourState, isGuidedTourVisible, isSkipped }, dispatch] = React.useReducer(reducer, initialState, initialiseState);
  const setCurrentStep = (step) => {
    if (step !== null) {
      const isStepAlreadyDone = get(guidedTourState, step);
      const [sectionName, stepName] = step.split(".");
      const sectionArray = Object.entries(guidedTourState[sectionName]);
      const currentStepIndex = sectionArray.findIndex(([key]) => key === stepName);
      const previousSteps = sectionArray.slice(0, currentStepIndex);
      const isStepToShow = previousSteps.every(([, sectionValue]) => sectionValue);
      if (isStepAlreadyDone || isSkipped || !isStepToShow) {
        return null;
      }
    }
    window.localStorage.setItem(GUIDED_TOUR_CURRENT_STEP, JSON.stringify(null));
    return dispatch({
      type: "SET_CURRENT_STEP",
      step
    });
  };
  const setGuidedTourVisibility = (value) => {
    dispatch({
      type: "SET_GUIDED_TOUR_VISIBILITY",
      value
    });
  };
  const setStepState = (currentStep2, value) => {
    addCompletedStep(currentStep2);
    dispatch({
      type: "SET_STEP_STATE",
      currentStep: currentStep2,
      value
    });
  };
  const startSection = (sectionName) => {
    const sectionSteps = guidedTourState[sectionName];
    if (sectionSteps) {
      const guidedTourArray = Object.entries(guidedTourState);
      const currentSectionIndex = guidedTourArray.findIndex(([key]) => key === sectionName);
      const previousSections = guidedTourArray.slice(0, currentSectionIndex);
      const isSectionToShow = previousSections.every(
        ([, sectionValue]) => Object.values(sectionValue).every(Boolean)
      );
      const [firstStep] = Object.keys(sectionSteps);
      const isFirstStepDone = sectionSteps[firstStep];
      if (isSectionToShow && !currentStep && !isFirstStepDone) {
        setCurrentStep(`${sectionName}.${firstStep}`);
      }
    }
  };
  const setSkipped = (value) => {
    window.localStorage.setItem(GUIDED_TOUR_SKIPPED, JSON.stringify(value));
    dispatch({
      type: "SET_SKIPPED",
      value
    });
  };
  return /* @__PURE__ */ jsx(
    GuidedTourProviderImpl,
    {
      guidedTourState,
      currentStep,
      setCurrentStep,
      setGuidedTourVisibility,
      setSkipped,
      setStepState,
      startSection,
      isGuidedTourVisible,
      isSkipped,
      children
    }
  );
};
const initialState = {
  currentStep: null,
  guidedTourState: {
    contentTypeBuilder: {
      create: false,
      success: false
    },
    contentManager: {
      create: false,
      success: false
    },
    apiTokens: {
      create: false,
      success: false
    }
  },
  isGuidedTourVisible: false,
  isSkipped: false
};
const reducer = (state = initialState, action) => produce(state, (draftState) => {
  switch (action.type) {
    case "SET_CURRENT_STEP": {
      draftState.currentStep = action.step;
      break;
    }
    case "SET_STEP_STATE": {
      const [section, step] = action.currentStep.split(".");
      draftState.guidedTourState[section][step] = action.value;
      break;
    }
    case "SET_SKIPPED": {
      draftState.isSkipped = action.value;
      break;
    }
    case "SET_GUIDED_TOUR_VISIBILITY": {
      draftState.isGuidedTourVisible = action.value;
      break;
    }
    default: {
      return draftState;
    }
  }
});
const initialiseState = (initialState2) => {
  const copyInitialState = { ...initialState2 };
  const guidedTourLocaleStorage = JSON.parse(
    window.localStorage.getItem(GUIDED_TOUR_COMPLETED_STEPS) ?? "[]"
  );
  const currentStepLocaleStorage = JSON.parse(
    window.localStorage.getItem(GUIDED_TOUR_CURRENT_STEP) ?? "null"
  );
  const skippedLocaleStorage = JSON.parse(
    window.localStorage.getItem(GUIDED_TOUR_SKIPPED) ?? "null"
  );
  if (Array.isArray(guidedTourLocaleStorage)) {
    guidedTourLocaleStorage.forEach((step) => {
      const [sectionName, stepName] = step.split(".");
      set(copyInitialState, ["guidedTourState", sectionName, stepName], true);
    });
  }
  if (currentStepLocaleStorage) {
    const [sectionName, stepName] = currentStepLocaleStorage.split(".");
    set(copyInitialState, ["guidedTourState", sectionName, stepName], true);
    addCompletedStep(currentStepLocaleStorage);
    window.localStorage.setItem(GUIDED_TOUR_CURRENT_STEP, JSON.stringify(null));
  }
  if (skippedLocaleStorage !== null) {
    set(copyInitialState, "isSkipped", skippedLocaleStorage);
  }
  return copyInitialState;
};
const addCompletedStep = (completedStep) => {
  const currentSteps = JSON.parse(window.localStorage.getItem(GUIDED_TOUR_COMPLETED_STEPS) ?? "[]");
  if (!Array.isArray(currentSteps)) {
    return;
  }
  const isAlreadyStored = currentSteps.includes(completedStep);
  if (isAlreadyStored) {
    return;
  }
  window.localStorage.setItem(
    GUIDED_TOUR_COMPLETED_STEPS,
    JSON.stringify([...currentSteps, completedStep])
  );
};

const LanguageProvider = ({ children, messages }) => {
  const locale = useTypedSelector((state) => state.admin_app.language.locale);
  const appMessages = defaultsDeep(messages[locale], messages.en);
  return /* @__PURE__ */ jsx(IntlProvider, { locale, defaultLocale: "en", messages: appMessages, textComponent: "span", children });
};

const Theme = ({ children, themes }) => {
  const { currentTheme } = useTypedSelector((state) => state.admin_app.theme);
  const [systemTheme, setSystemTheme] = React.useState();
  const { locale } = useIntl();
  const dispatch = useDispatch();
  React.useEffect(() => {
    const themeWatcher = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemTheme(themeWatcher.matches ? "dark" : "light");
    const listener = (event) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };
    themeWatcher.addEventListener("change", listener);
    return () => {
      themeWatcher.removeEventListener("change", listener);
    };
  }, []);
  React.useEffect(() => {
    dispatch(setAvailableThemes(Object.keys(themes)));
  }, [dispatch, themes]);
  const computedThemeName = currentTheme === "system" ? systemTheme : currentTheme;
  return /* @__PURE__ */ jsxs(
    DesignSystemProvider,
    {
      locale,
      theme: themes?.[computedThemeName || "light"],
      children: [
        children,
        /* @__PURE__ */ jsx(GlobalStyle, {})
      ]
    }
  );
};
const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.colors.neutral100};
  }
`;

export { AppInfoProvider as A, getIn as B, ConfigurationProvider as C, setIn as D, setLocale as E, useForgotPasswordMutation as F, GuidedTourProvider as G, useGetRegistrationInfoQuery as H, useRegisterAdminMutation as I, useRegisterUserMutation as J, useResetPasswordMutation as K, LanguageProvider as L, reducer$1 as M, NotificationsProvider as N, logout as O, Page as P, THEME_LOCAL_STORAGE_KEY as Q, RBAC as R, StrapiAppProvider as S, Theme as T, getStoredToken as U, useTypedStore as V, ConfigurationContextProvider as W, useNotification as a, useTypedSelector as b, useTracking as c, useTypedDispatch as d, useAPIErrorHandler as e, useUpdateMeMutation as f, useIsSSOLockedQuery as g, createTypedSelector as h, useGetProviderOptionsQuery as i, useUpdateProviderOptionsMutation as j, useRBAC as k, useGetProvidersQuery as l, useGuidedTour as m, login as n, useQueryParams as o, useAppInfo as p, useStrapiApp as q, useConfiguration as r, setAppTheme as s, isObject as t, useAuth as u, capitalise as v, createContext as w, AuthProvider as x, TrackingProvider as y, LANGUAGE_LOCAL_STORAGE_KEY as z };
//# sourceMappingURL=Theme-DQRUlj-X.mjs.map
