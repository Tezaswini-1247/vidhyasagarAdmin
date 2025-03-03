'use strict';

const React = require('react');
const designSystem = require('@strapi/design-system');
const reactIntl = require('react-intl');
const index = require('./index-EeNFKp50.js');

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

const useAdminRoles = (params = {}, queryOptions) => {
  const { locale } = reactIntl.useIntl();
  const formatter = designSystem.useCollator(locale, {
    sensitivity: "base"
  });
  const { data, error, isError, isLoading, refetch } = index.useGetRolesQuery(params, queryOptions);
  const roles = React__namespace.useMemo(
    () => [...data ?? []].sort(
      (a, b) => formatter.compare(a.name, b.name)
    ),
    [data, formatter]
  );
  return {
    roles,
    error,
    isError,
    isLoading,
    refetch
  };
};

exports.useAdminRoles = useAdminRoles;
//# sourceMappingURL=useAdminRoles-CATv1LQ3.js.map
