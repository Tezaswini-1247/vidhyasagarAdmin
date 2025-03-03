'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const designSystem = require('@strapi/design-system');
const icons = require('@strapi/icons');
const symbols = require('@strapi/icons/symbols');
const reactIntl = require('react-intl');
const index = require('./index-EeNFKp50.js');

const PurchaseAuditLogs = () => {
  const { formatMessage } = reactIntl.useIntl();
  return /* @__PURE__ */ jsxRuntime.jsx(index.Layouts.Root, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Main, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      index.Layouts.Header,
      {
        title: formatMessage({ id: "global.auditLogs", defaultMessage: "Audit Logs" }),
        subtitle: formatMessage({
          id: "Settings.permissions.auditLogs.listview.header.subtitle",
          defaultMessage: "Logs of all the activities that happened in your environment"
        })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingLeft: 10, paddingRight: 10, children: /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.EmptyStateLayout,
      {
        icon: /* @__PURE__ */ jsxRuntime.jsx(symbols.EmptyPermissions, { width: "16rem" }),
        content: formatMessage({
          id: "Settings.permissions.auditLogs.not-available",
          defaultMessage: "Audit Logs is only available as part of a paid plan. Upgrade to get a searchable and filterable display of all activities."
        }),
        action: /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.LinkButton,
          {
            variant: "default",
            endIcon: /* @__PURE__ */ jsxRuntime.jsx(icons.ExternalLink, {}),
            href: "https://strp.cc/45mbAdF",
            isExternal: true,
            target: "_blank",
            children: formatMessage({
              id: "global.learn-more",
              defaultMessage: "Learn more"
            })
          }
        )
      }
    ) })
  ] }) });
};

exports.PurchaseAuditLogs = PurchaseAuditLogs;
//# sourceMappingURL=PurchaseAuditLogs-BZOghVfD.js.map
