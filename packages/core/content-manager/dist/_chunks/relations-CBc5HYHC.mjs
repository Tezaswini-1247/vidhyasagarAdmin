import { generateNKeysBetween } from "fractional-indexing";
import { e as contentManagerApi } from "./index-ByPZ754U.mjs";
const relationsApi = contentManagerApi.injectEndpoints({
  endpoints: (build) => ({
    getRelations: build.query({
      query: ({ model, id, targetField, params }) => {
        return {
          url: `/content-manager/relations/${model}/${id}/${targetField}`,
          method: "GET",
          config: {
            params
          }
        };
      },
      serializeQueryArgs: (args) => {
        const { endpointName, queryArgs } = args;
        return {
          endpointName,
          model: queryArgs.model,
          id: queryArgs.id,
          targetField: queryArgs.targetField,
          locale: queryArgs.params?.locale,
          status: queryArgs.params?.status
        };
      },
      merge: (currentCache, newItems) => {
        if (currentCache.pagination && newItems.pagination) {
          if (currentCache.pagination.page < newItems.pagination.page) {
            currentCache.results = [
              ...prepareTempKeys(newItems.results, currentCache.results),
              ...currentCache.results
            ];
            currentCache.pagination = newItems.pagination;
          } else if (newItems.pagination.page === 1) {
            currentCache.results = prepareTempKeys(newItems.results);
            currentCache.pagination = newItems.pagination;
          }
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        if (!currentArg?.params && !previousArg?.params) {
          return false;
        }
        return currentArg?.params?.page !== previousArg?.params?.page || currentArg?.params?.pageSize !== previousArg?.params?.pageSize;
      },
      transformResponse: (response) => {
        if ("results" in response && response.results) {
          return {
            ...response,
            results: prepareTempKeys(response.results.toReversed())
          };
        } else {
          return response;
        }
      },
      providesTags: ["Relations"]
    }),
    searchRelations: build.query({
      query: ({ model, targetField, params }) => {
        return {
          url: `/content-manager/relations/${model}/${targetField}`,
          method: "GET",
          config: {
            params
          }
        };
      },
      serializeQueryArgs: (args) => {
        const { endpointName, queryArgs } = args;
        return {
          endpointName,
          model: queryArgs.model,
          targetField: queryArgs.targetField,
          _q: queryArgs.params?._q,
          idsToOmit: queryArgs.params?.idsToOmit,
          idsToInclude: queryArgs.params?.idsToInclude
        };
      },
      merge: (currentCache, newItems) => {
        if (currentCache.pagination && newItems.pagination) {
          if (currentCache.pagination.page < newItems.pagination.page) {
            const existingIds = currentCache.results.map((item) => item.documentId);
            const uniqueNewItems = newItems.results.filter(
              (item) => !existingIds.includes(item.documentId)
            );
            currentCache.results.push(...uniqueNewItems);
            currentCache.pagination = newItems.pagination;
          } else if (newItems.pagination.page === 1) {
            currentCache.results = newItems.results;
            currentCache.pagination = newItems.pagination;
          }
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        if (!currentArg?.params && !previousArg?.params) {
          return false;
        }
        return currentArg?.params?.page !== previousArg?.params?.page || currentArg?.params?.pageSize !== previousArg?.params?.pageSize;
      },
      transformResponse: (response) => {
        if (response.results) {
          return {
            ...response,
            results: response.results
          };
        } else {
          return response;
        }
      }
    })
  })
});
const prepareTempKeys = (relations, existingRelations = []) => {
  const [firstItem] = existingRelations.slice(0);
  const keys = generateNKeysBetween(null, firstItem?.__temp_key__ ?? null, relations.length);
  return relations.map((datum, index) => ({
    ...datum,
    __temp_key__: keys[index]
  }));
};
const { useGetRelationsQuery, useLazySearchRelationsQuery } = relationsApi;
const getRelationLabel = (relation, mainField) => {
  const label = mainField && relation[mainField.name] ? relation[mainField.name] : null;
  if (typeof label === "string") {
    return label;
  }
  return relation.documentId;
};
export {
  useLazySearchRelationsQuery as a,
  getRelationLabel as g,
  useGetRelationsQuery as u
};
//# sourceMappingURL=relations-CBc5HYHC.mjs.map
