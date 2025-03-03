import { jsx } from 'react/jsx-runtime';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useMatch, useNavigate } from 'react-router-dom';
import { d as useTypedDispatch, P as Page, n as login } from './Theme-DQRUlj-X.mjs';

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
  const match = useMatch("/auth/login/:authResponse");
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const dispatch = useTypedDispatch();
  const redirectToOops = React.useCallback(() => {
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
  React.useEffect(() => {
    if (match?.params.authResponse === "error") {
      redirectToOops();
    }
    if (match?.params.authResponse === "success") {
      const jwtToken = getCookieValue("jwtToken");
      if (jwtToken) {
        dispatch(
          login({
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
  return /* @__PURE__ */ jsx(Page.Loading, {});
};

export { AuthResponse };
//# sourceMappingURL=AuthResponse-DPn9gip-.mjs.map
