'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');
const designSystem = require('@strapi/design-system');
const icons = require('@strapi/icons');
const dateFns = require('date-fns');
const formik = require('formik');
const reactIntl = require('react-intl');
const reactRouterDom = require('react-router-dom');
const styledComponents = require('styled-components');
const yup = require('yup');
const index = require('./index-EeNFKp50.js');
const Theme = require('./Theme-B3Vl7PO-.js');
const admin = require('./admin-CoWMk1La.js');
const Permissions = require('./Permissions-CFMbSqfB.js');

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

const CREATE_SCHEMA = yup__namespace.object().shape({
  name: yup__namespace.string().required(index.errorsTrads.required.id),
  description: yup__namespace.string().required(index.errorsTrads.required.id)
});
const CreatePage = () => {
  const { id } = reactRouterDom.useParams();
  const { toggleNotification } = Theme.useNotification();
  const { formatMessage } = reactIntl.useIntl();
  const navigate = reactRouterDom.useNavigate();
  const permissionsRef = React__namespace.useRef(null);
  const { trackUsage } = Theme.useTracking();
  const {
    _unstableFormatAPIError: formatAPIError,
    _unstableFormatValidationErrors: formatValidationErrors
  } = Theme.useAPIErrorHandler();
  const { isLoading: isLoadingPermissionsLayout, currentData: permissionsLayout } = index.useGetRolePermissionLayoutQuery({
    /**
     * Role here is a query param so if there's no role we pass an empty string
     * which returns us a default layout.
     */
    role: id ?? ""
  });
  const { currentData: rolePermissions, isLoading: isLoadingRole } = index.useGetRolePermissionsQuery(
    {
      id
    },
    {
      skip: !id,
      refetchOnMountOrArgChange: true
    }
  );
  const [createRole] = index.useCreateRoleMutation();
  const [updateRolePermissions] = index.useUpdateRolePermissionsMutation();
  const handleCreateRoleSubmit = async (data, formik) => {
    try {
      if (id) {
        trackUsage("willDuplicateRole");
      } else {
        trackUsage("willCreateNewRole");
      }
      const res = await createRole(data);
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
      const { permissionsToSend } = permissionsRef.current?.getPermissions() ?? {};
      if (res.data.id && Array.isArray(permissionsToSend) && permissionsToSend.length > 0) {
        const updateRes = await updateRolePermissions({
          id: res.data.id,
          permissions: permissionsToSend
        });
        if ("error" in updateRes) {
          if (admin.isBaseQueryError(updateRes.error) && updateRes.error.name === "ValidationError") {
            formik.setErrors(formatValidationErrors(updateRes.error));
          } else {
            toggleNotification({
              type: "danger",
              message: formatAPIError(updateRes.error)
            });
          }
          return;
        }
      }
      toggleNotification({
        type: "success",
        message: formatMessage({ id: "Settings.roles.created", defaultMessage: "created" })
      });
      navigate(`../roles/${res.data.id.toString()}`, { replace: true });
    } catch (err) {
      toggleNotification({
        type: "danger",
        message: formatMessage({ id: "notification.error", defaultMessage: "An error occurred" })
      });
    }
  };
  if (isLoadingPermissionsLayout && isLoadingRole || !permissionsLayout) {
    return /* @__PURE__ */ jsxRuntime.jsx(Theme.Page.Loading, {});
  }
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Main, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(Theme.Page.Title, { children: formatMessage(
      { id: "Settings.PageTitle", defaultMessage: "Settings - {name}" },
      {
        name: "Roles"
      }
    ) }),
    /* @__PURE__ */ jsxRuntime.jsx(
      formik.Formik,
      {
        initialValues: {
          name: "",
          description: `${formatMessage({
            id: "Settings.roles.form.created",
            defaultMessage: "Created"
          })} ${dateFns.format(/* @__PURE__ */ new Date(), "PPP")}`
        },
        onSubmit: handleCreateRoleSubmit,
        validationSchema: CREATE_SCHEMA,
        validateOnChange: false,
        children: ({ values, errors, handleReset, handleChange, isSubmitting }) => /* @__PURE__ */ jsxRuntime.jsx(formik.Form, { children: /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            index.Layouts.Header,
            {
              primaryAction: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 2, children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  designSystem.Button,
                  {
                    variant: "secondary",
                    onClick: () => {
                      handleReset();
                      permissionsRef.current?.resetForm();
                    },
                    children: formatMessage({
                      id: "app.components.Button.reset",
                      defaultMessage: "Reset"
                    })
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { type: "submit", loading: isSubmitting, startIcon: /* @__PURE__ */ jsxRuntime.jsx(icons.Check, {}), children: formatMessage({
                  id: "global.save",
                  defaultMessage: "Save"
                }) })
              ] }),
              title: formatMessage({
                id: "Settings.roles.create.title",
                defaultMessage: "Create a role"
              }),
              subtitle: formatMessage({
                id: "Settings.roles.create.description",
                defaultMessage: "Define the rights given to the role"
              }),
              navigationAction: /* @__PURE__ */ jsxRuntime.jsx(index.BackButton, { fallback: "../roles" })
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(index.Layouts.Content, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", alignItems: "stretch", gap: 6, children: [
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { background: "neutral0", padding: 6, shadow: "filterShadow", hasRadius: true, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", alignItems: "stretch", gap: 4, children: [
              /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { justifyContent: "space-between", children: [
                /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { children: [
                  /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { fontWeight: "bold", children: formatMessage({
                    id: "global.details",
                    defaultMessage: "Details"
                  }) }) }),
                  /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "pi", textColor: "neutral600", children: formatMessage({
                    id: "Settings.roles.form.description",
                    defaultMessage: "Name and description of the role"
                  }) }) })
                ] }),
                /* @__PURE__ */ jsxRuntime.jsx(UsersRoleNumber, { children: formatMessage(
                  {
                    id: "Settings.roles.form.button.users-with-role",
                    defaultMessage: "{number, plural, =0 {# users} one {# user} other {# users}} with this role"
                  },
                  { number: 0 }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Grid.Root, { gap: 4, children: [
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 6, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsxRuntime.jsxs(
                  designSystem.Field.Root,
                  {
                    name: "name",
                    error: errors.name && formatMessage({ id: errors.name }),
                    required: true,
                    children: [
                      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { children: formatMessage({
                        id: "global.name",
                        defaultMessage: "Name"
                      }) }),
                      /* @__PURE__ */ jsxRuntime.jsx(designSystem.TextInput, { onChange: handleChange, value: values.name }),
                      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Error, {})
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 6, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsxRuntime.jsxs(
                  designSystem.Field.Root,
                  {
                    name: "description",
                    error: errors.description && formatMessage({ id: errors.description }),
                    children: [
                      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { children: formatMessage({
                        id: "global.description",
                        defaultMessage: "Description"
                      }) }),
                      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Textarea, { onChange: handleChange, value: values.description })
                    ]
                  }
                ) })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { shadow: "filterShadow", hasRadius: true, children: /* @__PURE__ */ jsxRuntime.jsx(
              Permissions.Permissions,
              {
                isFormDisabled: false,
                ref: permissionsRef,
                permissions: rolePermissions,
                layout: permissionsLayout
              }
            ) })
          ] }) })
        ] }) })
      }
    )
  ] });
};
const UsersRoleNumber = styledComponents.styled.div`
  border: 1px solid ${({ theme }) => theme.colors.primary200};
  background: ${({ theme }) => theme.colors.primary100};
  padding: ${({ theme }) => `${theme.spaces[2]} ${theme.spaces[4]}`};
  color: ${({ theme }) => theme.colors.primary600};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1.2rem;
  font-weight: bold;
`;
const ProtectedCreatePage = () => {
  const permissions = Theme.useTypedSelector(
    (state) => state.admin_app.permissions.settings?.roles.create
  );
  return /* @__PURE__ */ jsxRuntime.jsx(Theme.Page.Protect, { permissions, children: /* @__PURE__ */ jsxRuntime.jsx(CreatePage, {}) });
};

exports.CreatePage = CreatePage;
exports.ProtectedCreatePage = ProtectedCreatePage;
//# sourceMappingURL=CreatePage-CinCu6jj.js.map
