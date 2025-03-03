"use strict";
const React = require("react");
const strapiAdmin = require("@strapi/admin/strapi-admin");
const reactIntl = require("react-intl");
const index = require("./index-Nf1qO5tM.js");
const jsxRuntime = require("react/jsx-runtime");
const designSystem = require("@strapi/design-system");
const reactDnd = require("react-dnd");
const icons = require("@strapi/icons");
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
const DEFAULT_UNEXPECTED_ERROR_MSG = {
  id: "notification.error",
  defaultMessage: "An error occurred, please try again"
};
const useReviewWorkflows = (params = {}) => {
  const { toggleNotification } = strapiAdmin.useNotification();
  const { formatMessage } = reactIntl.useIntl();
  const { _unstableFormatAPIError: formatAPIError } = strapiAdmin.useAPIErrorHandler();
  const { skip = false, ...queryParams } = params;
  const { data, isLoading, error } = index.useGetWorkflowsQuery(
    {
      populate: ["stages", "stageRequiredToPublish"],
      ...queryParams
    },
    {
      skip
    }
  );
  React__namespace.useEffect(() => {
    if (error) {
      toggleNotification({
        type: "danger",
        message: formatAPIError(error)
      });
    }
  }, [error, formatAPIError, toggleNotification]);
  const [createWorkflow] = index.useCreateWorkflowMutation();
  const create = React__namespace.useCallback(
    async (data2) => {
      try {
        const res = await createWorkflow({ data: data2 });
        if ("error" in res) {
          toggleNotification({
            type: "danger",
            message: formatAPIError(res.error)
          });
          return res;
        }
        toggleNotification({
          type: "success",
          message: formatMessage({ id: "actions.created", defaultMessage: "Created workflow" })
        });
        return res;
      } catch (err) {
        toggleNotification({
          type: "danger",
          message: formatMessage(DEFAULT_UNEXPECTED_ERROR_MSG)
        });
        throw err;
      }
    },
    [createWorkflow, formatAPIError, formatMessage, toggleNotification]
  );
  const [updateWorkflow] = index.useUpdateWorkflowMutation();
  const update = React__namespace.useCallback(
    async (id, data2) => {
      try {
        const res = await updateWorkflow({ id, data: data2 });
        if ("error" in res) {
          toggleNotification({
            type: "danger",
            message: formatAPIError(res.error)
          });
          return res;
        }
        toggleNotification({
          type: "success",
          message: formatMessage({ id: "actions.updated", defaultMessage: "Updated workflow" })
        });
        return res;
      } catch (err) {
        toggleNotification({
          type: "danger",
          message: formatMessage(DEFAULT_UNEXPECTED_ERROR_MSG)
        });
        throw err;
      }
    },
    [formatAPIError, formatMessage, toggleNotification, updateWorkflow]
  );
  const [deleteWorkflow] = index.useDeleteWorkflowMutation();
  const deleteAction = React__namespace.useCallback(
    async (id) => {
      try {
        const res = await deleteWorkflow({ id });
        if ("error" in res) {
          toggleNotification({
            type: "danger",
            message: formatAPIError(res.error)
          });
          return;
        }
        toggleNotification({
          type: "success",
          message: formatMessage({ id: "actions.deleted", defaultMessage: "Deleted workflow" })
        });
        return res.data;
      } catch (err) {
        toggleNotification({
          type: "danger",
          message: formatMessage(DEFAULT_UNEXPECTED_ERROR_MSG)
        });
        throw err;
      }
    },
    [deleteWorkflow, formatAPIError, formatMessage, toggleNotification]
  );
  const { workflows = [], meta } = data ?? {};
  return {
    // meta contains e.g. the total of all workflows. we can not use
    // the pagination object here, because the list is not paginated.
    meta,
    workflows,
    isLoading,
    error,
    create,
    delete: deleteAction,
    update
  };
};
const DRAG_DROP_TYPES = {
  STAGE: "stage"
};
const StageDragPreview = ({ name }) => {
  return /* @__PURE__ */ jsxRuntime.jsxs(
    designSystem.Flex,
    {
      background: "primary100",
      borderStyle: "dashed",
      borderColor: "primary600",
      borderWidth: "1px",
      gap: 3,
      hasRadius: true,
      padding: 3,
      shadow: "tableShadow",
      width: "30rem",
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.Flex,
          {
            alignItems: "center",
            background: "neutral200",
            borderRadius: "50%",
            height: 6,
            justifyContent: "center",
            width: 6,
            children: /* @__PURE__ */ jsxRuntime.jsx(icons.CaretDown, { width: "0.8rem", fill: "neutral600" })
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { fontWeight: "bold", children: name })
      ]
    }
  );
};
function getStyle(initialOffset, currentOffset, mouseOffset) {
  if (!initialOffset || !currentOffset || !mouseOffset) {
    return { display: "none" };
  }
  const { x, y } = mouseOffset;
  return {
    transform: `translate(${x}px, ${y}px)`
  };
}
const DragLayerRendered = () => {
  const { itemType, isDragging, item, initialOffset, currentOffset, mouseOffset } = reactDnd.useDragLayer(
    (monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
      mouseOffset: monitor.getClientOffset()
    })
  );
  if (!isDragging || itemType !== DRAG_DROP_TYPES.STAGE) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
    designSystem.Box,
    {
      height: "100%",
      left: 0,
      position: "fixed",
      pointerEvents: "none",
      top: 0,
      zIndex: 100,
      width: "100%",
      children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { style: getStyle(initialOffset, currentOffset, mouseOffset), children: [
        /* @__PURE__ */ jsxRuntime.jsx(StageDragPreview, { name: typeof item.item === "string" ? item.item : null }),
        ";"
      ] })
    }
  );
};
const Root = ({ children }) => {
  return /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Page.Main, { children: /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Layouts.Content, { children }) });
};
const Header = ({ title, subtitle, navigationAction, primaryAction }) => {
  const { formatMessage } = reactIntl.useIntl();
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Page.Title, { children: formatMessage(
      { id: "Settings.PageTitle", defaultMessage: "Settings - {name}" },
      {
        name: title
      }
    ) }),
    /* @__PURE__ */ jsxRuntime.jsx(
      strapiAdmin.Layouts.BaseHeader,
      {
        navigationAction,
        primaryAction,
        title,
        subtitle
      }
    )
  ] });
};
exports.DRAG_DROP_TYPES = DRAG_DROP_TYPES;
exports.DragLayerRendered = DragLayerRendered;
exports.Header = Header;
exports.Root = Root;
exports.useReviewWorkflows = useReviewWorkflows;
//# sourceMappingURL=Layout-DcZnQxp9.js.map
