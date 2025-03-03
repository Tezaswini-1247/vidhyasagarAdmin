'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const designSystem = require('@strapi/design-system');
const icons = require('@strapi/icons');
const reactIntl = require('react-intl');
const reactRedux = require('react-redux');
const Theme = require('./Theme-B3Vl7PO-.js');
const selectors = require('./selectors-DfiZULhE.js');
const useLicenseLimits = require('./useLicenseLimits-JFp6koHQ.js');

const BILLING_STRAPI_CLOUD_URL = "https://cloud.strapi.io/profile/billing";
const BILLING_SELF_HOSTED_URL = "https://strapi.io/billing/request-seats";
const AdminSeatInfoEE = () => {
  const { formatMessage } = reactIntl.useIntl();
  const { settings } = reactRedux.useSelector(selectors.selectAdminPermissions);
  const {
    isLoading: isRBACLoading,
    allowedActions: { canRead, canCreate, canUpdate, canDelete }
  } = Theme.useRBAC(settings?.users ?? {});
  const {
    license,
    isError,
    isLoading: isLicenseLoading
  } = useLicenseLimits.useLicenseLimits({
    // TODO: this creates a waterfall which we should avoid to render earlier, but for that
    // we will have to move away from data-fetching hooks to query functions.
    // Short-term we could at least implement a loader, for the user to have visual feedback
    // in case the requests take a while
    enabled: !isRBACLoading && canRead && canCreate && canUpdate && canDelete
  });
  const isLoading = isRBACLoading || isLicenseLoading;
  if (isError || isLoading || !license) {
    return null;
  }
  const { licenseLimitStatus, enforcementUserCount, permittedSeats, isHostedOnStrapiCloud } = license;
  if (!permittedSeats) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Grid.Item, { col: 6, s: 12, direction: "column", alignItems: "stretch", children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "sigma", textColor: "neutral600", children: formatMessage({
      id: "Settings.application.admin-seats",
      defaultMessage: "Admin seats"
    }) }),
    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 2, children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { tag: "p", children: formatMessage(
        {
          id: "Settings.application.ee.admin-seats.count",
          defaultMessage: "<text>{enforcementUserCount}</text>/{permittedSeats}"
        },
        {
          permittedSeats,
          enforcementUserCount,
          text: (chunks) => /* @__PURE__ */ jsxRuntime.jsx(
            designSystem.Typography,
            {
              fontWeight: "semiBold",
              textColor: enforcementUserCount > permittedSeats ? "danger500" : void 0,
              children: chunks
            }
          )
        }
      ) }) }),
      licenseLimitStatus === "OVER_LIMIT" && /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Tooltip,
        {
          label: formatMessage({
            id: "Settings.application.ee.admin-seats.at-limit-tooltip",
            defaultMessage: "At limit: add seats to invite more users"
          }),
          children: /* @__PURE__ */ jsxRuntime.jsx(icons.WarningCircle, { width: "1.4rem", height: "1.4rem", fill: "danger500" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.Link,
      {
        href: isHostedOnStrapiCloud ? BILLING_STRAPI_CLOUD_URL : BILLING_SELF_HOSTED_URL,
        isExternal: true,
        endIcon: /* @__PURE__ */ jsxRuntime.jsx(icons.ExternalLink, {}),
        children: formatMessage(
          {
            id: "Settings.application.ee.admin-seats.add-seats",
            defaultMessage: "{isHostedOnStrapiCloud, select, true {Add seats} other {Contact sales}}"
          },
          { isHostedOnStrapiCloud }
        )
      }
    )
  ] });
};

exports.AdminSeatInfoEE = AdminSeatInfoEE;
//# sourceMappingURL=AdminSeatInfo-BiRsi5oc.js.map
