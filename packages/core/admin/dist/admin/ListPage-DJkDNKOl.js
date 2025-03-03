'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const designSystem = require('@strapi/design-system');
const icons = require('@strapi/icons');
const reactIntl = require('react-intl');
const index = require('./index-EeNFKp50.js');
const Theme = require('./Theme-B3Vl7PO-.js');
const React = require('react');
const styledComponents = require('styled-components');
const admin = require('./admin-CoWMk1La.js');
const parseISO = require('date-fns/parseISO');
const users = require('./users-DaPfjlwf.js');

const _interopDefault = e => e && e.__esModule ? e : { default: e };

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
  if (e) {
    for (const k in e) {
      if (k !== 'default') {
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

const React__namespace = /*#__PURE__*/_interopNamespace(React);
const parseISO__default = /*#__PURE__*/_interopDefault(parseISO);

const auditLogsService = admin.adminApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query({
      query: (params) => ({
        url: `/admin/audit-logs`,
        config: {
          params
        }
      })
    }),
    getAuditLog: builder.query({
      query: (id) => `/admin/audit-logs/${id}`
    })
  }),
  overrideExisting: false
});
const { useGetAuditLogsQuery, useGetAuditLogQuery } = auditLogsService;

const useFormatTimeStamp = () => {
  const { formatDate } = reactIntl.useIntl();
  const formatTimeStamp = (value) => {
    const date = parseISO__default.default(value);
    const formattedDate = formatDate(date, {
      dateStyle: "long"
    });
    const formattedTime = formatDate(date, {
      timeStyle: "medium",
      hourCycle: "h24"
    });
    return `${formattedDate}, ${formattedTime}`;
  };
  return formatTimeStamp;
};

const actionTypes = {
  "entry.create": "Create entry{model, select, undefined {} other { ({model})}}",
  "entry.update": "Update entry{model, select, undefined {} other { ({model})}}",
  "entry.delete": "Delete entry{model, select, undefined {} other { ({model})}}",
  "entry.publish": "Publish entry{model, select, undefined {} other { ({model})}}",
  "entry.unpublish": "Unpublish entry{model, select, undefined {} other { ({model})}}",
  "media.create": "Create media",
  "media.update": "Update media",
  "media.delete": "Delete media",
  "media-folder.create": "Create media folder",
  "media-folder.update": "Update media folder",
  "media-folder.delete": "Delete media folder",
  "user.create": "Create user",
  "user.update": "Update user",
  "user.delete": "Delete user",
  "admin.auth.success": "Admin login",
  "admin.logout": "Admin logout",
  "content-type.create": "Create content type",
  "content-type.update": "Update content type",
  "content-type.delete": "Delete content type",
  "component.create": "Create component",
  "component.update": "Update component",
  "component.delete": "Delete component",
  "role.create": "Create role",
  "role.update": "Update role",
  "role.delete": "Delete role",
  "permission.create": "Create permission",
  "permission.update": "Update permission",
  "permission.delete": "Delete permission"
};
const getDefaultMessage = (value) => {
  return actionTypes[value] || value;
};

const Modal = ({ handleClose, logId }) => {
  const { toggleNotification } = Theme.useNotification();
  const { _unstableFormatAPIError: formatAPIError } = Theme.useAPIErrorHandler();
  const { data, error, isLoading } = useGetAuditLogQuery(logId);
  React__namespace.useEffect(() => {
    if (error) {
      toggleNotification({
        type: "danger",
        message: formatAPIError(error)
      });
      handleClose();
    }
  }, [error, formatAPIError, handleClose, toggleNotification]);
  const formatTimeStamp = useFormatTimeStamp();
  const formattedDate = data && "date" in data ? formatTimeStamp(data.date) : "";
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Modal.Root, { defaultOpen: true, onOpenChange: handleClose, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Modal.Content, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Modal.Header, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Breadcrumbs, { label: formattedDate, id: "title", children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Crumb, { isCurrent: true, children: formattedDate }) }) }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Modal.Body, { children: /* @__PURE__ */ jsxRuntime.jsx(ActionBody, { isLoading, data, formattedDate }) })
  ] }) });
};
const ActionBody = ({ isLoading, data, formattedDate }) => {
  const { formatMessage } = reactIntl.useIntl();
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { padding: 7, justifyContent: "center", alignItems: "center", children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Loader, { children: "Loading content..." }) });
  }
  const { action, user, payload } = data;
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { marginBottom: 3, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "delta", id: "title", children: formatMessage({
      id: "Settings.permissions.auditLogs.details",
      defaultMessage: "Log Details"
    }) }) }),
    /* @__PURE__ */ jsxRuntime.jsxs(
      designSystem.Grid.Root,
      {
        gap: 4,
        gridCols: 2,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 6,
        paddingRight: 6,
        marginBottom: 4,
        background: "neutral100",
        hasRadius: true,
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            ActionItem,
            {
              actionLabel: formatMessage({
                id: "Settings.permissions.auditLogs.action",
                defaultMessage: "Action"
              }),
              actionName: formatMessage(
                {
                  id: `Settings.permissions.auditLogs.${action}`,
                  defaultMessage: getDefaultMessage(action)
                },
                // @ts-expect-error - any
                { model: payload?.model }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            ActionItem,
            {
              actionLabel: formatMessage({
                id: "Settings.permissions.auditLogs.date",
                defaultMessage: "Date"
              }),
              actionName: formattedDate
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            ActionItem,
            {
              actionLabel: formatMessage({
                id: "Settings.permissions.auditLogs.user",
                defaultMessage: "User"
              }),
              actionName: user?.displayName || "-"
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            ActionItem,
            {
              actionLabel: formatMessage({
                id: "Settings.permissions.auditLogs.userId",
                defaultMessage: "User ID"
              }),
              actionName: user?.id.toString() || "-"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { children: formatMessage({
        id: "Settings.permissions.auditLogs.payload",
        defaultMessage: "Payload"
      }) }),
      /* @__PURE__ */ jsxRuntime.jsx(Payload, { value: JSON.stringify(payload, null, 2), disabled: true })
    ] })
  ] });
};
const Payload = styledComponents.styled(designSystem.JSONInput)`
  max-width: 100%;
  overflow: scroll;
`;
const ActionItem = ({ actionLabel, actionName }) => {
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", alignItems: "baseline", gap: 1, children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textColor: "neutral600", variant: "sigma", children: actionLabel }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textColor: "neutral600", children: actionName })
  ] });
};

const useAuditLogsData = ({
  canReadAuditLogs,
  canReadUsers
}) => {
  const { toggleNotification } = Theme.useNotification();
  const { _unstableFormatAPIError: formatAPIError } = Theme.useAPIErrorHandler();
  const [{ query }] = Theme.useQueryParams();
  const {
    data,
    error,
    isError: isUsersError,
    isLoading: isLoadingUsers
  } = index.useAdminUsers(
    {},
    {
      skip: !canReadUsers,
      refetchOnMountOrArgChange: true
    }
  );
  React__namespace.useEffect(() => {
    if (error) {
      toggleNotification({ type: "danger", message: formatAPIError(error) });
    }
  }, [error, toggleNotification, formatAPIError]);
  const {
    data: auditLogs,
    isLoading: isLoadingAuditLogs,
    isError: isAuditLogsError,
    error: auditLogsError
  } = useGetAuditLogsQuery(query, {
    refetchOnMountOrArgChange: true,
    skip: !canReadAuditLogs
  });
  React__namespace.useEffect(() => {
    if (auditLogsError) {
      toggleNotification({ type: "danger", message: formatAPIError(auditLogsError) });
    }
  }, [auditLogsError, toggleNotification, formatAPIError]);
  return {
    auditLogs,
    users: data?.users ?? [],
    isLoading: isLoadingUsers || isLoadingAuditLogs,
    hasError: isAuditLogsError || isUsersError
  };
};

const ComboboxFilter = (props) => {
  const { formatMessage } = reactIntl.useIntl();
  const field = index.useField(props.name);
  const ariaLabel = formatMessage({
    id: "Settings.permissions.auditLogs.filter.aria-label",
    defaultMessage: "Search and select an option to filter"
  });
  const handleChange = (value) => {
    field.onChange(props.name, value);
  };
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Combobox, { "aria-label": ariaLabel, value: field.value, onChange: handleChange, children: props.options?.map((opt) => {
    const value = typeof opt === "string" ? opt : opt.value;
    const label = typeof opt === "string" ? opt : opt.label;
    return /* @__PURE__ */ jsxRuntime.jsx(designSystem.ComboboxOption, { value, children: label }, value);
  }) });
};

const getDisplayedFilters = ({
  formatMessage,
  users: users$1,
  canReadUsers
}) => {
  const operators = [
    {
      label: formatMessage({
        id: "components.FilterOptions.FILTER_TYPES.$eq",
        defaultMessage: "is"
      }),
      value: "$eq"
    },
    {
      label: formatMessage({
        id: "components.FilterOptions.FILTER_TYPES.$ne",
        defaultMessage: "is not"
      }),
      value: "$ne"
    }
  ];
  const filters = [
    {
      input: ComboboxFilter,
      label: formatMessage({
        id: "Settings.permissions.auditLogs.action",
        defaultMessage: "Action"
      }),
      name: "action",
      operators,
      options: Object.keys(actionTypes).map((action) => ({
        label: formatMessage(
          {
            id: `Settings.permissions.auditLogs.${action}`,
            defaultMessage: getDefaultMessage(action)
          },
          { model: void 0 }
        ),
        value: action
      })),
      type: "enumeration"
    },
    {
      label: formatMessage({
        id: "Settings.permissions.auditLogs.date",
        defaultMessage: "Date"
      }),
      name: "date",
      type: "datetime"
    }
  ];
  if (canReadUsers && users$1) {
    return [
      ...filters,
      {
        input: ComboboxFilter,
        label: formatMessage({
          id: "Settings.permissions.auditLogs.user",
          defaultMessage: "User"
        }),
        mainField: { name: "id", type: "integer" },
        name: "user",
        operators,
        options: users$1.map((user) => ({
          label: users.getDisplayName(user),
          value: user.id.toString()
        })),
        type: "relation"
      }
    ];
  }
  return filters;
};

const ListPage = () => {
  const { formatMessage } = reactIntl.useIntl();
  const permissions = Theme.useTypedSelector((state) => state.admin_app.permissions.settings);
  const {
    allowedActions: { canRead: canReadAuditLogs, canReadUsers },
    isLoading: isLoadingRBAC
  } = Theme.useRBAC({
    ...permissions?.auditLogs,
    readUsers: permissions?.users.read || []
  });
  const [{ query }, setQuery] = Theme.useQueryParams();
  const {
    auditLogs,
    users,
    isLoading: isLoadingData,
    hasError
  } = useAuditLogsData({
    canReadAuditLogs,
    canReadUsers
  });
  const formatTimeStamp = useFormatTimeStamp();
  const displayedFilters = getDisplayedFilters({ formatMessage, users, canReadUsers });
  const headers = [
    {
      name: "action",
      label: formatMessage({
        id: "Settings.permissions.auditLogs.action",
        defaultMessage: "Action"
      }),
      sortable: true
    },
    {
      name: "date",
      label: formatMessage({
        id: "Settings.permissions.auditLogs.date",
        defaultMessage: "Date"
      }),
      sortable: true
    },
    {
      name: "user",
      label: formatMessage({
        id: "Settings.permissions.auditLogs.user",
        defaultMessage: "User"
      }),
      sortable: false,
      // In this case, the passed parameter cannot and shouldn't be something else than User
      cellFormatter: ({ user }) => user ? user.displayName : ""
    }
  ];
  if (hasError) {
    return /* @__PURE__ */ jsxRuntime.jsx(Theme.Page.Error, {});
  }
  const isLoading = isLoadingData || isLoadingRBAC;
  const { results = [] } = auditLogs ?? {};
  return /* @__PURE__ */ jsxRuntime.jsxs(Theme.Page.Main, { "aria-busy": isLoading, children: [
    /* @__PURE__ */ jsxRuntime.jsx(Theme.Page.Title, { children: formatMessage(
      { id: "Settings.PageTitle", defaultMessage: "Settings - {name}" },
      {
        name: formatMessage({
          id: "global.auditLogs",
          defaultMessage: "Audit Logs"
        })
      }
    ) }),
    /* @__PURE__ */ jsxRuntime.jsx(
      index.Layouts.Header,
      {
        title: formatMessage({
          id: "global.auditLogs",
          defaultMessage: "Audit Logs"
        }),
        subtitle: formatMessage({
          id: "Settings.permissions.auditLogs.listview.header.subtitle",
          defaultMessage: "Logs of all the activities that happened in your environment"
        })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      index.Layouts.Action,
      {
        startActions: /* @__PURE__ */ jsxRuntime.jsxs(index.Filters.Root, { options: displayedFilters, children: [
          /* @__PURE__ */ jsxRuntime.jsx(index.Filters.Trigger, {}),
          /* @__PURE__ */ jsxRuntime.jsx(index.Filters.Popover, {}),
          /* @__PURE__ */ jsxRuntime.jsx(index.Filters.List, {})
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsxs(index.Layouts.Content, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(index.Table.Root, { rows: results, headers, isLoading, children: /* @__PURE__ */ jsxRuntime.jsxs(index.Table.Content, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(index.Table.Head, { children: headers.map((header) => /* @__PURE__ */ jsxRuntime.jsx(index.Table.HeaderCell, { ...header }, header.name)) }),
        /* @__PURE__ */ jsxRuntime.jsx(index.Table.Empty, {}),
        /* @__PURE__ */ jsxRuntime.jsx(index.Table.Loading, {}),
        /* @__PURE__ */ jsxRuntime.jsx(index.Table.Body, { children: results.map((log) => /* @__PURE__ */ jsxRuntime.jsxs(index.Table.Row, { onClick: () => setQuery({ id: log.id }), children: [
          headers.map((header) => {
            const { name, cellFormatter } = header;
            switch (name) {
              case "action":
                return /* @__PURE__ */ jsxRuntime.jsx(index.Table.Cell, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textColor: "neutral800", children: formatMessage(
                  {
                    id: `Settings.permissions.auditLogs.${log.action}`,
                    // @ts-expect-error – getDefaultMessage probably doesn't benefit from being so strongly typed unless we just add string at the end.
                    defaultMessage: getDefaultMessage(log.action)
                  },
                  { model: log.payload?.model ?? "" }
                ) }) }, name);
              case "date":
                return /* @__PURE__ */ jsxRuntime.jsx(index.Table.Cell, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textColor: "neutral800", children: formatTimeStamp(log.date) }) }, name);
              case "user":
                return /* @__PURE__ */ jsxRuntime.jsx(index.Table.Cell, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textColor: "neutral800", children: cellFormatter ? cellFormatter(log, header) : "-" }) }, name);
              default:
                return /* @__PURE__ */ jsxRuntime.jsx(index.Table.Cell, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textColor: "neutral800", children: log[name] || "-" }) }, name);
            }
          }),
          /* @__PURE__ */ jsxRuntime.jsx(index.Table.Cell, { onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { justifyContent: "end", children: /* @__PURE__ */ jsxRuntime.jsx(
            designSystem.IconButton,
            {
              onClick: () => setQuery({ id: log.id }),
              withTooltip: false,
              label: formatMessage(
                { id: "app.component.table.view", defaultMessage: "{target} details" },
                { target: `${log.action} action` }
              ),
              variant: "ghost",
              children: /* @__PURE__ */ jsxRuntime.jsx(icons.Eye, {})
            }
          ) }) })
        ] }, log.id)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsxs(index.Pagination.Root, { ...auditLogs?.pagination, children: [
        /* @__PURE__ */ jsxRuntime.jsx(index.Pagination.PageSize, {}),
        /* @__PURE__ */ jsxRuntime.jsx(index.Pagination.Links, {})
      ] })
    ] }),
    query?.id && /* @__PURE__ */ jsxRuntime.jsx(Modal, { handleClose: () => setQuery({ id: "" }, "remove"), logId: query.id.toString() })
  ] });
};
const ProtectedListPage = () => {
  const permissions = Theme.useTypedSelector(
    (state) => state.admin_app.permissions.settings?.auditLogs?.main
  );
  return /* @__PURE__ */ jsxRuntime.jsx(Theme.Page.Protect, { permissions, children: /* @__PURE__ */ jsxRuntime.jsx(ListPage, {}) });
};

exports.ListPage = ListPage;
exports.ProtectedListPage = ProtectedListPage;
//# sourceMappingURL=ListPage-DJkDNKOl.js.map
