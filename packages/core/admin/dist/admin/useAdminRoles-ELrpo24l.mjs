import * as React from 'react';
import { useCollator } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { c as useGetRolesQuery } from './index-DdAmwxFa.mjs';

const useAdminRoles = (params = {}, queryOptions) => {
  const { locale } = useIntl();
  const formatter = useCollator(locale, {
    sensitivity: "base"
  });
  const { data, error, isError, isLoading, refetch } = useGetRolesQuery(params, queryOptions);
  const roles = React.useMemo(
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

export { useAdminRoles as u };
//# sourceMappingURL=useAdminRoles-ELrpo24l.mjs.map
