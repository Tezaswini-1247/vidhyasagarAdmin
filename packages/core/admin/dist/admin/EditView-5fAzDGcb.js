'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');
const designSystem = require('@strapi/design-system');
const formik = require('formik');
const reactIntl = require('react-intl');
const reactRouterDom = require('react-router-dom');
const yup = require('yup');
const Theme = require('./Theme-B3Vl7PO-.js');
const index = require('./index-EeNFKp50.js');
const transferTokens = require('./transferTokens-CeXBOv8T.js');
const admin = require('./admin-CoWMk1La.js');
const constants = require('./constants-DF68OPrs.js');
const TokenTypeSelect = require('./TokenTypeSelect-Chmqi5KH.js');

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
const yup__namespace = /*#__PURE__*/_interopNamespace(yup);

const schema = yup__namespace.object().shape({
  name: yup__namespace.string().max(100).required(index.errorsTrads.required.id),
  description: yup__namespace.string().nullable(),
  lifespan: yup__namespace.number().integer().min(0).nullable().defined(index.errorsTrads.required.id),
  permissions: yup__namespace.string().required(index.errorsTrads.required.id)
});
const EditView = () => {
  const { formatMessage } = reactIntl.useIntl();
  const { toggleNotification } = Theme.useNotification();
  const navigate = reactRouterDom.useNavigate();
  const { state: locationState } = reactRouterDom.useLocation();
  const [transferToken, setTransferToken] = React__namespace.useState(
    locationState && "accessKey" in locationState.transferToken ? {
      ...locationState.transferToken
    } : null
  );
  const { trackUsage } = Theme.useTracking();
  Theme.useGuidedTour("EditView", (state) => state.setCurrentStep);
  const permissions = Theme.useTypedSelector(
    (state) => state.admin_app.permissions.settings?.["transfer-tokens"]
  );
  const {
    allowedActions: { canCreate, canUpdate, canRegenerate }
  } = Theme.useRBAC(permissions);
  const match = reactRouterDom.useMatch("/settings/transfer-tokens/:id");
  const id = match?.params?.id;
  const isCreating = id === "create";
  const {
    _unstableFormatAPIError: formatAPIError,
    _unstableFormatValidationErrors: formatValidationErrors
  } = Theme.useAPIErrorHandler();
  React__namespace.useEffect(() => {
    trackUsage(isCreating ? "didAddTokenFromList" : "didEditTokenFromList", {
      tokenType: constants.TRANSFER_TOKEN_TYPE
    });
  }, [isCreating, trackUsage]);
  const { data, error } = transferTokens.useGetTransferTokenQuery(id, {
    skip: isCreating || transferToken !== null || !id
  });
  React__namespace.useEffect(() => {
    if (error) {
      toggleNotification({
        type: "danger",
        message: formatAPIError(error)
      });
    }
  }, [error, formatAPIError, toggleNotification]);
  React__namespace.useEffect(() => {
    if (data) {
      setTransferToken(data);
    }
  }, [data]);
  const [createToken] = transferTokens.useCreateTransferTokenMutation();
  const [updateToken] = transferTokens.useUpdateTransferTokenMutation();
  const handleSubmit = async (body, formik) => {
    trackUsage(isCreating ? "willCreateToken" : "willEditToken", {
      tokenType: constants.TRANSFER_TOKEN_TYPE
    });
    const permissions2 = body.permissions.split("-");
    const isPermissionsTransferPermission = (permission) => {
      if (permission.length === 1) {
        return permission[0] === "push" || permission[0] === "pull";
      }
      return permission[0] === "push" && permission[1] === "pull";
    };
    if (isPermissionsTransferPermission(permissions2)) {
      try {
        if (isCreating) {
          const res = await createToken({
            ...body,
            // lifespan must be "null" for unlimited (0 would mean instantly expired and isn't accepted)
            lifespan: body?.lifespan && body.lifespan !== "0" ? parseInt(body.lifespan.toString(), 10) : null,
            permissions: permissions2
          });
          if ("error" in res) {
            if (admin.isBaseQueryError(res.error) && res.error.name === "ValidationError") {
              formik.setErrors(formatValidationErrors(res.error));
            } else {
              toggleNotification({
                type: "danger",
                message: formatAPIError(res.error)
              });
            }
            return;
          }
          setTransferToken(res.data);
          toggleNotification({
            type: "success",
            message: formatMessage({
              id: "notification.success.transfertokencreated",
              defaultMessage: "Transfer Token successfully created"
            })
          });
          trackUsage("didCreateToken", {
            type: transferToken?.permissions,
            tokenType: constants.TRANSFER_TOKEN_TYPE
          });
          navigate(`../transfer-tokens/${res.data.id.toString()}`, {
            replace: true,
            state: { transferToken: res.data }
          });
        } else {
          const res = await updateToken({
            id,
            name: body.name,
            description: body.description,
            permissions: permissions2
          });
          if ("error" in res) {
            if (admin.isBaseQueryError(res.error) && res.error.name === "ValidationError") {
              formik.setErrors(formatValidationErrors(res.error));
            } else {
              toggleNotification({
                type: "danger",
                message: formatAPIError(res.error)
              });
            }
            return;
          }
          setTransferToken(res.data);
          toggleNotification({
            type: "success",
            message: formatMessage({
              id: "notification.success.transfertokenedited",
              defaultMessage: "Transfer Token successfully edited"
            })
          });
          trackUsage("didEditToken", {
            type: transferToken?.permissions,
            tokenType: constants.TRANSFER_TOKEN_TYPE
          });
        }
      } catch (err) {
        toggleNotification({
          type: "danger",
          message: formatMessage({
            id: "notification.error",
            defaultMessage: "Something went wrong"
          })
        });
      }
    }
  };
  const canEditInputs = canUpdate && !isCreating || canCreate && isCreating;
  const isLoading = !isCreating && !transferToken;
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntime.jsx(Theme.Page.Loading, {});
  }
  return /* @__PURE__ */ jsxRuntime.jsxs(Theme.Page.Main, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(Theme.Page.Title, { children: formatMessage(
      { id: "Settings.PageTitle", defaultMessage: "Settings - {name}" },
      {
        name: "Transfer Tokens"
      }
    ) }),
    /* @__PURE__ */ jsxRuntime.jsx(
      formik.Formik,
      {
        validationSchema: schema,
        validateOnChange: false,
        initialValues: {
          name: transferToken?.name || "",
          description: transferToken?.description || "",
          lifespan: transferToken?.lifespan || null,
          /**
           * We need to cast the permissions to satisfy the type for `permissions`
           * in the request body incase we don't have a transferToken and instead
           * use an empty string.
           */
          permissions: transferToken?.permissions.join("-") ?? ""
        },
        enableReinitialize: true,
        onSubmit: (body, actions) => handleSubmit(body, actions),
        children: ({ errors, handleChange, isSubmitting, values }) => {
          return /* @__PURE__ */ jsxRuntime.jsxs(formik.Form, { children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              TokenTypeSelect.FormHead,
              {
                title: {
                  id: "Settings.transferTokens.createPage.title",
                  defaultMessage: "TokenCreate Transfer Token"
                },
                token: transferToken,
                setToken: setTransferToken,
                canEditInputs,
                canRegenerate,
                isSubmitting,
                regenerateUrl: "/admin/transfer/tokens/"
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(index.Layouts.Content, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", alignItems: "stretch", gap: 6, children: [
              transferToken && Boolean(transferToken?.name) && "accessKey" in transferToken && /* @__PURE__ */ jsxRuntime.jsx(TokenTypeSelect.TokenBox, { token: transferToken.accessKey, tokenType: constants.TRANSFER_TOKEN_TYPE }),
              /* @__PURE__ */ jsxRuntime.jsx(
                FormTransferTokenContainer,
                {
                  errors,
                  onChange: handleChange,
                  canEditInputs,
                  isCreating,
                  values,
                  transferToken
                }
              )
            ] }) })
          ] });
        }
      }
    )
  ] });
};
const ProtectedEditView = () => {
  const permissions = Theme.useTypedSelector(
    (state) => state.admin_app.permissions.settings?.["transfer-tokens"].read
  );
  return /* @__PURE__ */ jsxRuntime.jsx(Theme.Page.Protect, { permissions, children: /* @__PURE__ */ jsxRuntime.jsx(EditView, {}) });
};
const FormTransferTokenContainer = ({
  errors = {},
  onChange,
  canEditInputs,
  isCreating,
  values,
  transferToken = {}
}) => {
  const { formatMessage } = reactIntl.useIntl();
  const typeOptions = [
    {
      value: "push",
      label: {
        id: "Settings.transferTokens.types.push",
        defaultMessage: "Push"
      }
    },
    {
      value: "pull",
      label: {
        id: "Settings.transferTokens.types.pull",
        defaultMessage: "Pull"
      }
    },
    {
      value: "push-pull",
      label: {
        id: "Settings.transferTokens.types.push-pull",
        defaultMessage: "Full Access"
      }
    }
  ];
  return /* @__PURE__ */ jsxRuntime.jsx(
    designSystem.Box,
    {
      background: "neutral0",
      hasRadius: true,
      shadow: "filterShadow",
      paddingTop: 6,
      paddingBottom: 6,
      paddingLeft: 7,
      paddingRight: 7,
      children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", alignItems: "stretch", gap: 4, children: [
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "delta", tag: "h2", children: formatMessage({
          id: "global.details",
          defaultMessage: "Details"
        }) }),
        /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Grid.Root, { gap: 5, children: [
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 6, xs: 12, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsxRuntime.jsx(
            TokenTypeSelect.TokenName,
            {
              error: errors["name"],
              value: values["name"],
              canEditInputs,
              onChange
            }
          ) }, "name"),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 6, xs: 12, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsxRuntime.jsx(
            TokenTypeSelect.TokenDescription,
            {
              error: errors["description"],
              value: values["description"],
              canEditInputs,
              onChange
            }
          ) }, "description"),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 6, xs: 12, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsxRuntime.jsx(
            TokenTypeSelect.LifeSpanInput,
            {
              isCreating,
              error: errors["lifespan"],
              value: values["lifespan"],
              onChange,
              token: transferToken
            }
          ) }, "lifespan"),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 6, xs: 12, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsxRuntime.jsx(
            TokenTypeSelect.TokenTypeSelect,
            {
              name: "permissions",
              value: values["permissions"],
              error: errors["permissions"],
              label: {
                id: "Settings.tokens.form.type",
                defaultMessage: "Token type"
              },
              onChange: (value) => {
                onChange({ target: { name: "permissions", value } });
              },
              options: typeOptions,
              canEditInputs
            }
          ) }, "permissions")
        ] })
      ] })
    }
  );
};

exports.EditView = EditView;
exports.ProtectedEditView = ProtectedEditView;
//# sourceMappingURL=EditView-5fAzDGcb.js.map
