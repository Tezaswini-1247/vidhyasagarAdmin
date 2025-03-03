"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const strapiAdmin = require("@strapi/admin/strapi-admin");
const ee = require("@strapi/admin/strapi-admin/ee");
const designSystem = require("@strapi/design-system");
const icons = require("@strapi/icons");
const reactIntl = require("react-intl");
const reactRouterDom = require("react-router-dom");
const index = require("./index-Nf1qO5tM.js");
const Layout = require("./Layout-DcZnQxp9.js");
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
const ReviewWorkflowsListView = () => {
  const { formatMessage } = reactIntl.useIntl();
  const navigate = reactRouterDom.useNavigate();
  const { trackUsage } = strapiAdmin.useTracking();
  const [workflowToDelete, setWorkflowToDelete] = React__namespace.useState(null);
  const [showLimitModal, setShowLimitModal] = React__namespace.useState(false);
  const { data, isLoading: isLoadingModels } = index.useGetContentTypesQuery();
  const { meta, workflows, isLoading, delete: deleteAction } = Layout.useReviewWorkflows();
  const { getFeature, isLoading: isLicenseLoading } = ee.useLicenseLimits();
  const permissions = index.useTypedSelector(
    (state) => state.admin_app.permissions.settings?.["review-workflows"]
  );
  const {
    allowedActions: { canCreate, canRead, canUpdate, canDelete }
  } = strapiAdmin.useRBAC(permissions);
  const limits = getFeature("review-workflows");
  const numberOfWorkflows = limits?.[index.CHARGEBEE_WORKFLOW_ENTITLEMENT_NAME];
  const handleDeleteWorkflow = (workflowId) => {
    setWorkflowToDelete(workflowId);
  };
  const toggleConfirmDeleteDialog = () => {
    setWorkflowToDelete(null);
  };
  const handleConfirmDeleteDialog = async () => {
    if (!workflowToDelete) return;
    await deleteAction(workflowToDelete);
    setWorkflowToDelete(null);
  };
  const handleCreateClick = (event) => {
    event.preventDefault();
    if (numberOfWorkflows && meta && meta?.workflowCount >= parseInt(numberOfWorkflows, 10)) {
      event.preventDefault();
      setShowLimitModal(true);
    } else {
      navigate("create");
      trackUsage("willCreateWorkflow");
    }
  };
  React__namespace.useEffect(() => {
    if (!isLoading && !isLicenseLoading) {
      if (numberOfWorkflows && meta && meta?.workflowCount > parseInt(numberOfWorkflows, 10)) {
        setShowLimitModal(true);
      }
    }
  }, [isLicenseLoading, isLoading, meta, meta?.workflowCount, numberOfWorkflows]);
  const headers = [
    {
      label: formatMessage({
        id: "Settings.review-workflows.list.page.list.column.name.title",
        defaultMessage: "Name"
      }),
      name: "name"
    },
    {
      label: formatMessage({
        id: "Settings.review-workflows.list.page.list.column.stages.title",
        defaultMessage: "Stages"
      }),
      name: "stages"
    },
    {
      label: formatMessage({
        id: "Settings.review-workflows.list.page.list.column.contentTypes.title",
        defaultMessage: "Content Types"
      }),
      name: "content-types"
    }
  ];
  if (isLoading || isLoadingModels) {
    return /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Page.Loading, {});
  }
  const contentTypes = Object.values(data ?? {}).reduce((acc, curr) => {
    acc.push(...curr);
    return acc;
  }, []);
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      Layout.Header,
      {
        primaryAction: canCreate ? /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.LinkButton,
          {
            startIcon: /* @__PURE__ */ jsxRuntime.jsx(icons.Plus, {}),
            size: "S",
            tag: reactRouterDom.NavLink,
            to: "create",
            onClick: handleCreateClick,
            children: formatMessage({
              id: "Settings.review-workflows.list.page.create",
              defaultMessage: "Create new workflow"
            })
          }
        ) : null,
        subtitle: formatMessage({
          id: "Settings.review-workflows.list.page.subtitle",
          defaultMessage: "Manage your content review process"
        }),
        title: formatMessage({
          id: "Settings.review-workflows.list.page.title",
          defaultMessage: "Review Workflows"
        })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsxs(Layout.Root, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        strapiAdmin.Table.Root,
        {
          isLoading,
          rows: workflows,
          footer: canCreate ? /* @__PURE__ */ jsxRuntime.jsx(designSystem.TFooter, { cursor: "pointer", icon: /* @__PURE__ */ jsxRuntime.jsx(icons.Plus, {}), onClick: handleCreateClick, children: formatMessage({
            id: "Settings.review-workflows.list.page.create",
            defaultMessage: "Create new workflow"
          }) }) : null,
          headers,
          children: /* @__PURE__ */ jsxRuntime.jsxs(strapiAdmin.Table.Content, { children: [
            /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Table.Head, { children: headers.map((head) => /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Table.HeaderCell, { ...head }, head.name)) }),
            /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Table.Body, { children: workflows.map((workflow) => /* @__PURE__ */ jsxRuntime.jsxs(
              strapiAdmin.Table.Row,
              {
                onClick: () => {
                  navigate(`${workflow.id}`);
                },
                children: [
                  /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Table.Cell, { width: "25rem", children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textColor: "neutral800", fontWeight: "bold", ellipsis: true, children: workflow.name }) }),
                  /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Table.Cell, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textColor: "neutral800", children: workflow.stages.length }) }),
                  /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Table.Cell, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textColor: "neutral800", children: workflow.contentTypes.map((uid) => {
                    const contentType = contentTypes.find(
                      (contentType2) => contentType2.uid === uid
                    );
                    return contentType?.info.displayName ?? "";
                  }).join(", ") }) }),
                  /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Table.Cell, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { alignItems: "center", justifyContent: "end", children: [
                    canRead || canUpdate ? /* @__PURE__ */ jsxRuntime.jsx(
                      designSystem.IconButton,
                      {
                        tag: reactRouterDom.Link,
                        to: workflow.id.toString(),
                        label: formatMessage(
                          {
                            id: "Settings.review-workflows.list.page.list.column.actions.edit.label",
                            defaultMessage: "Edit {name}"
                          },
                          { name: workflow.name }
                        ),
                        variant: "ghost",
                        children: /* @__PURE__ */ jsxRuntime.jsx(icons.Pencil, {})
                      }
                    ) : null,
                    workflows.length > 1 && canDelete ? /* @__PURE__ */ jsxRuntime.jsx(
                      designSystem.IconButton,
                      {
                        withTooltip: false,
                        label: formatMessage(
                          {
                            id: "Settings.review-workflows.list.page.list.column.actions.delete.label",
                            defaultMessage: "Delete {name}"
                          },
                          { name: "Default workflow" }
                        ),
                        variant: "ghost",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleDeleteWorkflow(String(workflow.id));
                        },
                        children: /* @__PURE__ */ jsxRuntime.jsx(icons.Trash, {})
                      }
                    ) : null
                  ] }) })
                ]
              },
              workflow.id
            )) })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Dialog.Root, { open: !!workflowToDelete, onOpenChange: toggleConfirmDeleteDialog, children: /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.ConfirmDialog, { onConfirm: handleConfirmDeleteDialog, children: formatMessage({
        id: "Settings.review-workflows.list.page.delete.confirm.body",
        defaultMessage: "If you remove this worfklow, all stage-related information will be removed for this content-type. Are you sure you want to remove it?"
      }) }) }),
      /* @__PURE__ */ jsxRuntime.jsxs(index.LimitsModal.Root, { open: showLimitModal, onOpenChange: () => setShowLimitModal(false), children: [
        /* @__PURE__ */ jsxRuntime.jsx(index.LimitsModal.Title, { children: formatMessage({
          id: "Settings.review-workflows.list.page.workflows.limit.title",
          defaultMessage: "You’ve reached the limit of workflows in your plan"
        }) }),
        /* @__PURE__ */ jsxRuntime.jsx(index.LimitsModal.Body, { children: formatMessage({
          id: "Settings.review-workflows.list.page.workflows.limit.body",
          defaultMessage: "Delete a workflow or contact Sales to enable more workflows."
        }) })
      ] })
    ] })
  ] });
};
const ProtectedListPage = () => {
  const permissions = index.useTypedSelector(
    (state) => state.admin_app.permissions.settings?.["review-workflows"]?.main
  );
  return /* @__PURE__ */ jsxRuntime.jsx(strapiAdmin.Page.Protect, { permissions, children: /* @__PURE__ */ jsxRuntime.jsx(ReviewWorkflowsListView, {}) });
};
exports.ProtectedListPage = ProtectedListPage;
exports.ReviewWorkflowsListView = ReviewWorkflowsListView;
//# sourceMappingURL=index-B05ot-RJ.js.map
