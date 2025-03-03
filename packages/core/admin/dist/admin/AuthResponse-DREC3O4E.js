'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');
const reactIntl = require('react-intl');
const reactRouterDom = require('react-router-dom');
const Theme = require('./Theme-B3Vl7PO-.js');

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

const getCookieValue = (name) => {
  let result = null;
  const cookieArray = document.cookie.split(";");
  cookieArray.forEach((cookie) => {
    const [key, value] = cookie.split("=").map((item) => item.trim());
    if (key.trim() === name) {
      result = decodeURIComponent(value);
    }
  });
  return result;
};
const deleteCookie = (name) => {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

const AuthResponse = () => {
  const match = reactRouterDom.useMatch("/auth/login/:authResponse");
  const { formatMessage } = reactIntl.useIntl();
  const navigate = reactRouterDom.useNavigate();
  const dispatch = Theme.useTypedDispatch();
  const redirectToOops = React__namespace.useCallback(() => {
    navigate({
      pathname: "/auth/oops",
      search: `?info=${encodeURIComponent(
        formatMessage({
          id: "Auth.form.button.login.providers.error",
          defaultMessage: "We cannot connect you through the selected provider."
        })
      )}`
    });
  }, [navigate, formatMessage]);
  React__namespace.useEffect(() => {
    if (match?.params.authResponse === "error") {
      redirectToOops();
    }
    if (match?.params.authResponse === "success") {
      const jwtToken = getCookieValue("jwtToken");
      if (jwtToken) {
        dispatch(
          Theme.login({
            token: jwtToken
          })
        );
        deleteCookie("jwtToken");
        navigate("/auth/login");
      } else {
        redirectToOops();
      }
    }
  }, [dispatch, match, redirectToOops, navigate]);
  return /* @__PURE__ */ jsxRuntime.jsx(Theme.Page.Loading, {});
};

exports.AuthResponse = AuthResponse;
//# sourceMappingURL=AuthResponse-DREC3O4E.js.map
