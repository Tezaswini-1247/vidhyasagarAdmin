import { More, Cross, WarningCircle, ListPlus, Pencil, Trash, Check, CrossCircle, CheckCircle, ArrowsCounterClockwise, ChevronRight, Duplicate, ClockCounterClockwise, Feather } from "@strapi/icons";
import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import { useStrapiApp, createContext, useQueryParams, useAuth, useRBAC, Page, adminApi, translatedErrors, useNotification, useAPIErrorHandler, getYupValidationErrors, useForm, useTracking, useGuidedTour, BackButton, DescriptionComponentRenderer, useTable, Table } from "@strapi/admin/strapi-admin";
import * as React from "react";
import { lazy } from "react";
import { Menu, Button, VisuallyHidden, Flex, Dialog, Modal, Typography, Radio, Status, Box, SingleSelect, SingleSelectOption, IconButton, Loader, Tooltip, LinkButton } from "@strapi/design-system";
import mapValues from "lodash/fp/mapValues";
import { useIntl } from "react-intl";
import { useParams, useNavigate, Navigate, useMatch, useLocation, Link, NavLink } from "react-router-dom";
import { styled } from "styled-components";
import * as yup from "yup";
import { ValidationError } from "yup";
import { stringify } from "qs";
import pipe from "lodash/fp/pipe";
import { intervalToDuration, isPast } from "date-fns";
import { createSlice, combineReducers } from "@reduxjs/toolkit";
const __variableDynamicImportRuntimeHelper = (glob, path, segs) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(
      reject.bind(
        null,
        new Error(
          "Unknown variable dynamic import: " + path + (path.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : "")
        )
      )
    );
  });
};
const PLUGIN_ID = "content-manager";
const PERMISSIONS = [
  "plugin::content-manager.explorer.create",
  "plugin::content-manager.explorer.read",
  "plugin::content-manager.explorer.update",
  "plugin::content-manager.explorer.delete",
  "plugin::content-manager.explorer.publish"
];
const INJECTION_ZONES = {
  editView: { informations: [], "right-links": [] },
  listView: {
    actions: [],
    deleteModalAdditionalInfos: [],
    publishModalAdditionalInfos: [],
    unpublishModalAdditionalInfos: []
  }
};
const InjectionZone = ({ area, ...props }) => {
  const components = useInjectionZone(area);
  return /* @__PURE__ */ jsx(Fragment, { children: components.map((component) => /* @__PURE__ */ jsx(component.Component, { ...props }, component.name)) });
};
const useInjectionZone = (area) => {
  const getPlugin = useStrapiApp("useInjectionZone", (state) => state.getPlugin);
  const contentManagerPlugin = getPlugin(PLUGIN_ID);
  const [page, position] = area.split(".");
  return contentManagerPlugin.getInjectedComponents(page, position);
};
const ID = "id";
const CREATED_BY_ATTRIBUTE_NAME = "createdBy";
const UPDATED_BY_ATTRIBUTE_NAME = "updatedBy";
const CREATOR_FIELDS = [CREATED_BY_ATTRIBUTE_NAME, UPDATED_BY_ATTRIBUTE_NAME];
const PUBLISHED_BY_ATTRIBUTE_NAME = "publishedBy";
const CREATED_AT_ATTRIBUTE_NAME = "createdAt";
const UPDATED_AT_ATTRIBUTE_NAME = "updatedAt";
const PUBLISHED_AT_ATTRIBUTE_NAME = "publishedAt";
const DOCUMENT_META_FIELDS = [
  ID,
  ...CREATOR_FIELDS,
  PUBLISHED_BY_ATTRIBUTE_NAME,
  CREATED_AT_ATTRIBUTE_NAME,
  UPDATED_AT_ATTRIBUTE_NAME,
  PUBLISHED_AT_ATTRIBUTE_NAME
];
const ATTRIBUTE_TYPES_THAT_CANNOT_BE_MAIN_FIELD = [
  "dynamiczone",
  "json",
  "text",
  "relation",
  "component",
  "boolean",
  "media",
  "password",
  "richtext",
  "timestamp",
  "blocks"
];
const SINGLE_TYPES = "single-types";
const COLLECTION_TYPES = "collection-types";
const [DocumentRBACProvider, useDocumentRBAC] = createContext(
  "DocumentRBAC",
  {
    canCreate: false,
    canCreateFields: [],
    canDelete: false,
    canPublish: false,
    canRead: false,
    canReadFields: [],
    canUpdate: false,
    canUpdateFields: [],
    canUserAction: () => false,
    isLoading: false
  }
);
const DocumentRBAC = ({ children, permissions }) => {
  const { slug } = useParams();
  if (!slug) {
    throw new Error("Cannot find the slug param in the URL");
  }
  const [{ rawQuery }] = useQueryParams();
  const userPermissions = useAuth("DocumentRBAC", (state) => state.permissions);
  const contentTypePermissions = React.useMemo(() => {
    const contentTypePermissions2 = userPermissions.filter(
      (permission) => permission.subject === slug
    );
    return contentTypePermissions2.reduce((acc, permission) => {
      const [action] = permission.action.split(".").slice(-1);
      return { ...acc, [action]: [permission] };
    }, {});
  }, [slug, userPermissions]);
  const { isLoading, allowedActions } = useRBAC(
    contentTypePermissions,
    permissions ?? void 0,
    // TODO: useRBAC context should be typed and built differently
    // We are passing raw query as context to the hook so that it can
    // rely on the locale provided from DocumentRBAC for its permission calculations.
    rawQuery
  );
  const canCreateFields = !isLoading && allowedActions.canCreate ? extractAndDedupeFields(contentTypePermissions.create) : [];
  const canReadFields = !isLoading && allowedActions.canRead ? extractAndDedupeFields(contentTypePermissions.read) : [];
  const canUpdateFields = !isLoading && allowedActions.canUpdate ? extractAndDedupeFields(contentTypePermissions.update) : [];
  const canUserAction = React.useCallback(
    (fieldName, fieldsUserCanAction, fieldType) => {
      const name = removeNumericalStrings(fieldName.split("."));
      const componentFieldNames = fieldsUserCanAction.filter((field) => field.split(".").length > 1);
      if (fieldType === "component") {
        return componentFieldNames.some((field) => {
          return field.includes(name.join("."));
        });
      }
      if (name.length > 1) {
        return componentFieldNames.includes(name.join("."));
      }
      return fieldsUserCanAction.includes(fieldName);
    },
    []
  );
  if (isLoading) {
    return /* @__PURE__ */ jsx(Page.Loading, {});
  }
  return /* @__PURE__ */ jsx(
    DocumentRBACProvider,
    {
      isLoading,
      canCreateFields,
      canReadFields,
      canUpdateFields,
      canUserAction,
      ...allowedActions,
      children
    }
  );
};
const extractAndDedupeFields = (permissions = []) => permissions.flatMap((permission) => permission.properties?.fields).filter(
  (field, index2, arr) => arr.indexOf(field) === index2 && typeof field === "string"
);
const removeNumericalStrings = (arr) => arr.filter((item) => isNaN(Number(item)));
const contentManagerApi = adminApi.enhanceEndpoints({
  addTagTypes: [
    "ComponentConfiguration",
    "ContentTypesConfiguration",
    "ContentTypeSettings",
    "Document",
    "InitialData",
    "HistoryVersion",
    "Relations",
    "UidAvailability"
  ]
});
const documentApi = contentManagerApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    autoCloneDocument: builder.mutation({
      query: ({ model, sourceId, query }) => ({
        url: `/content-manager/collection-types/${model}/auto-clone/${sourceId}`,
        method: "POST",
        config: {
          params: query
        }
      }),
      invalidatesTags: (_result, error, { model }) => {
        if (error) {
          return [];
        }
        return [{ type: "Document", id: `${model}_LIST` }];
      }
    }),
    cloneDocument: builder.mutation({
      query: ({ model, sourceId, data, params }) => ({
        url: `/content-manager/collection-types/${model}/clone/${sourceId}`,
        method: "POST",
        data,
        config: {
          params
        }
      }),
      invalidatesTags: (_result, _error, { model }) => [
        { type: "Document", id: `${model}_LIST` },
        { type: "UidAvailability", id: model }
      ]
    }),
    /**
     * Creates a new collection-type document. This should ONLY be used for collection-types.
     * single-types should always be using `updateDocument` since they always exist.
     */
    createDocument: builder.mutation({
      query: ({ model, data, params }) => ({
        url: `/content-manager/collection-types/${model}`,
        method: "POST",
        data,
        config: {
          params
        }
      }),
      invalidatesTags: (result, _error, { model }) => [
        { type: "Document", id: `${model}_LIST` },
        "Relations",
        { type: "UidAvailability", id: model }
      ]
    }),
    deleteDocument: builder.mutation({
      query: ({ collectionType, model, documentId, params }) => ({
        url: `/content-manager/${collectionType}/${model}${collectionType !== SINGLE_TYPES && documentId ? `/${documentId}` : ""}`,
        method: "DELETE",
        config: {
          params
        }
      }),
      invalidatesTags: (_result, _error, { collectionType, model }) => [
        { type: "Document", id: collectionType !== SINGLE_TYPES ? `${model}_LIST` : model }
      ]
    }),
    deleteManyDocuments: builder.mutation({
      query: ({ model, params, ...body }) => ({
        url: `/content-manager/collection-types/${model}/actions/bulkDelete`,
        method: "POST",
        data: body,
        config: {
          params
        }
      }),
      invalidatesTags: (_res, _error, { model }) => [{ type: "Document", id: `${model}_LIST` }]
    }),
    discardDocument: builder.mutation({
      query: ({ collectionType, model, documentId, params }) => ({
        url: documentId ? `/content-manager/${collectionType}/${model}/${documentId}/actions/discard` : `/content-manager/${collectionType}/${model}/actions/discard`,
        method: "POST",
        config: {
          params
        }
      }),
      invalidatesTags: (_result, _error, { collectionType, model, documentId }) => {
        return [
          {
            type: "Document",
            id: collectionType !== SINGLE_TYPES ? `${model}_${documentId}` : model
          },
          { type: "Document", id: `${model}_LIST` },
          "Relations",
          { type: "UidAvailability", id: model }
        ];
      }
    }),
    /**
     * Gets all documents of a collection type or single type.
     * By passing different params you can get different results e.g. only published documents or 'es' documents.
     */
    getAllDocuments: builder.query({
      query: ({ model, params }) => ({
        url: `/content-manager/collection-types/${model}`,
        method: "GET",
        config: {
          params: stringify(params, { encode: true })
        }
      }),
      providesTags: (result, _error, arg) => {
        return [
          { type: "Document", id: `ALL_LIST` },
          { type: "Document", id: `${arg.model}_LIST` },
          ...result?.results.map(({ documentId }) => ({
            type: "Document",
            id: `${arg.model}_${documentId}`
          })) ?? []
        ];
      }
    }),
    getDraftRelationCount: builder.query({
      query: ({ collectionType, model, documentId, params }) => ({
        url: documentId ? `/content-manager/${collectionType}/${model}/${documentId}/actions/countDraftRelations` : `/content-manager/${collectionType}/${model}/actions/countDraftRelations`,
        method: "GET",
        config: {
          params
        }
      })
    }),
    getDocument: builder.query({
      // @ts-expect-error – TODO: fix ts error where data unknown doesn't work with response via an assertion?
      queryFn: async ({ collectionType, model, documentId, params }, _api, _extraOpts, baseQuery) => {
        const res = await baseQuery({
          url: `/content-manager/${collectionType}/${model}${documentId ? `/${documentId}` : ""}`,
          method: "GET",
          config: {
            params
          }
        });
        if (res.error && res.error.name === "NotFoundError" && collectionType === SINGLE_TYPES) {
          return { data: { document: void 0 }, error: void 0 };
        }
        return res;
      },
      providesTags: (result, _error, { collectionType, model, documentId }) => {
        return [
          // we prefer the result's id because we don't fetch single-types with an ID.
          {
            type: "Document",
            id: collectionType !== SINGLE_TYPES ? `${model}_${result && "documentId" in result ? result.documentId : documentId}` : model
          },
          // Make it easy to invalidate all individual documents queries for a model
          {
            type: "Document",
            id: `${model}_ALL_ITEMS`
          }
        ];
      }
    }),
    getManyDraftRelationCount: builder.query({
      query: ({ model, ...params }) => ({
        url: `/content-manager/collection-types/${model}/actions/countManyEntriesDraftRelations`,
        method: "GET",
        config: {
          params
        }
      }),
      transformResponse: (response) => response.data
    }),
    /**
     * This endpoint will either create or update documents at the same time as publishing.
     */
    publishDocument: builder.mutation({
      query: ({ collectionType, model, documentId, params, data }) => ({
        url: documentId ? `/content-manager/${collectionType}/${model}/${documentId}/actions/publish` : `/content-manager/${collectionType}/${model}/actions/publish`,
        method: "POST",
        data,
        config: {
          params
        }
      }),
      invalidatesTags: (_result, _error, { collectionType, model, documentId }) => {
        return [
          {
            type: "Document",
            id: collectionType !== SINGLE_TYPES ? `${model}_${documentId}` : model
          },
          { type: "Document", id: `${model}_LIST` },
          "Relations"
        ];
      }
    }),
    publishManyDocuments: builder.mutation({
      query: ({ model, params, ...body }) => ({
        url: `/content-manager/collection-types/${model}/actions/bulkPublish`,
        method: "POST",
        data: body,
        config: {
          params
        }
      }),
      invalidatesTags: (_res, _error, { model, documentIds }) => documentIds.map((id) => ({ type: "Document", id: `${model}_${id}` }))
    }),
    updateDocument: builder.mutation({
      query: ({ collectionType, model, documentId, data, params }) => ({
        url: `/content-manager/${collectionType}/${model}${documentId ? `/${documentId}` : ""}`,
        method: "PUT",
        data,
        config: {
          params
        }
      }),
      invalidatesTags: (_result, _error, { collectionType, model, documentId }) => {
        return [
          {
            type: "Document",
            id: collectionType !== SINGLE_TYPES ? `${model}_${documentId}` : model
          },
          "Relations",
          { type: "UidAvailability", id: model }
        ];
      },
      async onQueryStarted({ data, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          documentApi.util.updateQueryData("getDocument", patch, (draft) => {
            Object.assign(draft.data, data);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    }),
    unpublishDocument: builder.mutation({
      query: ({ collectionType, model, documentId, params, data }) => ({
        url: documentId ? `/content-manager/${collectionType}/${model}/${documentId}/actions/unpublish` : `/content-manager/${collectionType}/${model}/actions/unpublish`,
        method: "POST",
        data,
        config: {
          params
        }
      }),
      invalidatesTags: (_result, _error, { collectionType, model, documentId }) => {
        return [
          {
            type: "Document",
            id: collectionType !== SINGLE_TYPES ? `${model}_${documentId}` : model
          }
        ];
      }
    }),
    unpublishManyDocuments: builder.mutation({
      query: ({ model, params, ...body }) => ({
        url: `/content-manager/collection-types/${model}/actions/bulkUnpublish`,
        method: "POST",
        data: body,
        config: {
          params
        }
      }),
      invalidatesTags: (_res, _error, { model, documentIds }) => documentIds.map((id) => ({ type: "Document", id: `${model}_${id}` }))
    })
  })
});
const {
  useAutoCloneDocumentMutation,
  useCloneDocumentMutation,
  useCreateDocumentMutation,
  useDeleteDocumentMutation,
  useDeleteManyDocumentsMutation,
  useDiscardDocumentMutation,
  useGetAllDocumentsQuery,
  useLazyGetDocumentQuery,
  useGetDocumentQuery,
  useLazyGetDraftRelationCountQuery,
  useGetManyDraftRelationCountQuery,
  usePublishDocumentMutation,
  usePublishManyDocumentsMutation,
  useUpdateDocumentMutation,
  useUnpublishDocumentMutation,
  useUnpublishManyDocumentsMutation
} = documentApi;
const buildValidParams = (query) => {
  if (!query) return query;
  const { plugins: _, ...validQueryParams } = {
    ...query,
    ...Object.values(query?.plugins ?? {}).reduce(
      (acc, current) => Object.assign(acc, current),
      {}
    )
  };
  return validQueryParams;
};
const isBaseQueryError = (error) => {
  return error.name !== void 0;
};
const arrayValidator = (attribute, options) => ({
  message: translatedErrors.required,
  test(value) {
    if (options.status === "draft") {
      return true;
    }
    if (!attribute.required) {
      return true;
    }
    if (!value) {
      return false;
    }
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }
    return true;
  }
});
const createYupSchema = (attributes = {}, components = {}, options = { status: null }) => {
  const createModelSchema = (attributes2) => yup.object().shape(
    Object.entries(attributes2).reduce((acc, [name, attribute]) => {
      if (DOCUMENT_META_FIELDS.includes(name)) {
        return acc;
      }
      const validations = [
        addNullableValidation,
        addRequiredValidation,
        addMinLengthValidation,
        addMaxLengthValidation,
        addMinValidation,
        addMaxValidation,
        addRegexValidation
      ].map((fn) => fn(attribute, options));
      const transformSchema = pipe(...validations);
      switch (attribute.type) {
        case "component": {
          const { attributes: attributes3 } = components[attribute.component];
          if (attribute.repeatable) {
            return {
              ...acc,
              [name]: transformSchema(
                yup.array().of(createModelSchema(attributes3).nullable(false))
              ).test(arrayValidator(attribute, options))
            };
          } else {
            return {
              ...acc,
              [name]: transformSchema(createModelSchema(attributes3).nullable())
            };
          }
        }
        case "dynamiczone":
          return {
            ...acc,
            [name]: transformSchema(
              yup.array().of(
                yup.lazy(
                  (data) => {
                    const attributes3 = components?.[data?.__component]?.attributes;
                    const validation = yup.object().shape({
                      __component: yup.string().required().oneOf(Object.keys(components))
                    }).nullable(false);
                    if (!attributes3) {
                      return validation;
                    }
                    return validation.concat(createModelSchema(attributes3));
                  }
                )
              )
            ).test(arrayValidator(attribute, options))
          };
        case "relation":
          return {
            ...acc,
            [name]: transformSchema(
              yup.lazy((value) => {
                if (!value) {
                  return yup.mixed().nullable(true);
                } else if (Array.isArray(value)) {
                  return yup.array().of(
                    yup.object().shape({
                      id: yup.number().required()
                    })
                  );
                } else if (typeof value === "object") {
                  return yup.object();
                } else {
                  return yup.mixed().test(
                    "type-error",
                    "Relation values must be either null, an array of objects with {id} or an object.",
                    () => false
                  );
                }
              })
            )
          };
        default:
          return {
            ...acc,
            [name]: transformSchema(createAttributeSchema(attribute))
          };
      }
    }, {})
  ).default(null);
  return createModelSchema(attributes);
};
const createAttributeSchema = (attribute) => {
  switch (attribute.type) {
    case "biginteger":
      return yup.string().matches(/^-?\d*$/);
    case "boolean":
      return yup.boolean();
    case "blocks":
      return yup.mixed().test("isBlocks", translatedErrors.json, (value) => {
        if (!value || Array.isArray(value)) {
          return true;
        } else {
          return false;
        }
      });
    case "decimal":
    case "float":
    case "integer":
      return yup.number();
    case "email":
      return yup.string().email(translatedErrors.email);
    case "enumeration":
      return yup.string().oneOf([...attribute.enum, null]);
    case "json":
      return yup.mixed().test("isJSON", translatedErrors.json, (value) => {
        if (!value || typeof value === "string" && value.length === 0) {
          return true;
        }
        if (typeof value === "object") {
          try {
            JSON.stringify(value);
            return true;
          } catch (err) {
            return false;
          }
        }
        try {
          JSON.parse(value);
          return true;
        } catch (err) {
          return false;
        }
      });
    case "password":
    case "richtext":
    case "string":
    case "text":
      return yup.string();
    case "uid":
      return yup.string().matches(/^[A-Za-z0-9-_.~]*$/);
    default:
      return yup.mixed();
  }
};
const nullableSchema = (schema) => {
  return schema?.nullable ? schema.nullable() : (
    // In some cases '.nullable' will not be available on the schema.
    // e.g. when the schema has been built using yup.lazy (e.g. for relations).
    // In these cases we should just return the schema as it is.
    schema
  );
};
const addNullableValidation = () => (schema) => {
  return nullableSchema(schema);
};
const addRequiredValidation = (attribute, options) => (schema) => {
  if (options.status === "draft" || !attribute.required) {
    return schema;
  }
  if (attribute.required && "required" in schema) {
    return schema.required(translatedErrors.required);
  }
  return schema;
};
const addMinLengthValidation = (attribute, options) => (schema) => {
  if (options.status === "draft") {
    return schema;
  }
  if ("minLength" in attribute && attribute.minLength && Number.isInteger(attribute.minLength) && "min" in schema) {
    return schema.min(attribute.minLength, {
      ...translatedErrors.minLength,
      values: {
        min: attribute.minLength
      }
    });
  }
  return schema;
};
const addMaxLengthValidation = (attribute) => (schema) => {
  if ("maxLength" in attribute && attribute.maxLength && Number.isInteger(attribute.maxLength) && "max" in schema) {
    return schema.max(attribute.maxLength, {
      ...translatedErrors.maxLength,
      values: {
        max: attribute.maxLength
      }
    });
  }
  return schema;
};
const addMinValidation = (attribute, options) => (schema) => {
  if (options.status === "draft") {
    return schema;
  }
  if ("min" in attribute && "min" in schema) {
    const min = toInteger(attribute.min);
    if (min) {
      return schema.min(min, {
        ...translatedErrors.min,
        values: {
          min
        }
      });
    }
  }
  return schema;
};
const addMaxValidation = (attribute) => (schema) => {
  if ("max" in attribute) {
    const max = toInteger(attribute.max);
    if ("max" in schema && max) {
      return schema.max(max, {
        ...translatedErrors.max,
        values: {
          max
        }
      });
    }
  }
  return schema;
};
const toInteger = (val) => {
  if (typeof val === "number" || val === void 0) {
    return val;
  } else {
    const num = Number(val);
    return isNaN(num) ? void 0 : num;
  }
};
const addRegexValidation = (attribute) => (schema) => {
  if ("regex" in attribute && attribute.regex && "matches" in schema) {
    return schema.matches(new RegExp(attribute.regex), {
      message: {
        id: translatedErrors.regex.id,
        defaultMessage: "The value does not match the defined pattern."
      },
      excludeEmptyString: !attribute.required
    });
  }
  return schema;
};
const initApi = contentManagerApi.injectEndpoints({
  endpoints: (builder) => ({
    getInitialData: builder.query({
      query: () => "/content-manager/init",
      transformResponse: (response) => response.data,
      providesTags: ["InitialData"]
    })
  })
});
const { useGetInitialDataQuery } = initApi;
const useContentTypeSchema = (model) => {
  const { toggleNotification } = useNotification();
  const { _unstableFormatAPIError: formatAPIError } = useAPIErrorHandler();
  const { data, error, isLoading, isFetching } = useGetInitialDataQuery(void 0);
  const { components, contentType, contentTypes } = React.useMemo(() => {
    const contentType2 = data?.contentTypes.find((ct) => ct.uid === model);
    const componentsByKey = data?.components.reduce((acc, component) => {
      acc[component.uid] = component;
      return acc;
    }, {});
    const components2 = extractContentTypeComponents(contentType2?.attributes, componentsByKey);
    return {
      components: Object.keys(components2).length === 0 ? void 0 : components2,
      contentType: contentType2,
      contentTypes: data?.contentTypes ?? []
    };
  }, [model, data]);
  React.useEffect(() => {
    if (error) {
      toggleNotification({
        type: "danger",
        message: formatAPIError(error)
      });
    }
  }, [toggleNotification, error, formatAPIError]);
  return {
    // This must be memoized to avoid inifiinite re-renders where the empty object is different everytime.
    components: React.useMemo(() => components ?? {}, [components]),
    schema: contentType,
    schemas: contentTypes,
    isLoading: isLoading || isFetching
  };
};
const extractContentTypeComponents = (attributes = {}, allComponents = {}) => {
  const getComponents = (attributes2) => {
    return attributes2.reduce((acc, attribute) => {
      if (attribute.type === "component") {
        const componentAttributes = Object.values(
          allComponents[attribute.component]?.attributes ?? {}
        );
        acc.push(attribute.component, ...getComponents(componentAttributes));
      } else if (attribute.type === "dynamiczone") {
        acc.push(
          ...attribute.components,
          ...attribute.components.flatMap((componentUid) => {
            const componentAttributes = Object.values(
              allComponents[componentUid]?.attributes ?? {}
            );
            return getComponents(componentAttributes);
          })
        );
      }
      return acc;
    }, []);
  };
  const componentUids = getComponents(Object.values(attributes));
  const uniqueComponentUids = [...new Set(componentUids)];
  const componentsByKey = uniqueComponentUids.reduce((acc, uid) => {
    acc[uid] = allComponents[uid];
    return acc;
  }, {});
  return componentsByKey;
};
const HOOKS = {
  /**
   * Hook that allows to mutate the displayed headers of the list view table
   * @constant
   * @type {string}
   */
  INJECT_COLUMN_IN_TABLE: "Admin/CM/pages/ListView/inject-column-in-table",
  /**
   * Hook that allows to mutate the CM's collection types links pre-set filters
   * @constant
   * @type {string}
   */
  MUTATE_COLLECTION_TYPES_LINKS: "Admin/CM/pages/App/mutate-collection-types-links",
  /**
   * Hook that allows to mutate the CM's edit view layout
   * @constant
   * @type {string}
   */
  MUTATE_EDIT_VIEW_LAYOUT: "Admin/CM/pages/EditView/mutate-edit-view-layout",
  /**
   * Hook that allows to mutate the CM's single types links pre-set filters
   * @constant
   * @type {string}
   */
  MUTATE_SINGLE_TYPES_LINKS: "Admin/CM/pages/App/mutate-single-types-links"
};
const contentTypesApi = contentManagerApi.injectEndpoints({
  endpoints: (builder) => ({
    getContentTypeConfiguration: builder.query({
      query: (uid) => ({
        url: `/content-manager/content-types/${uid}/configuration`,
        method: "GET"
      }),
      transformResponse: (response) => response.data,
      providesTags: (_result, _error, uid) => [
        { type: "ContentTypesConfiguration", id: uid },
        { type: "ContentTypeSettings", id: "LIST" }
      ]
    }),
    getAllContentTypeSettings: builder.query({
      query: () => "/content-manager/content-types-settings",
      transformResponse: (response) => response.data,
      providesTags: [{ type: "ContentTypeSettings", id: "LIST" }]
    }),
    updateContentTypeConfiguration: builder.mutation({
      query: ({ uid, ...body }) => ({
        url: `/content-manager/content-types/${uid}/configuration`,
        method: "PUT",
        data: body
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (_result, _error, { uid }) => [
        { type: "ContentTypesConfiguration", id: uid },
        { type: "ContentTypeSettings", id: "LIST" },
        // Is this necessary?
        { type: "InitialData" }
      ]
    })
  })
});
const {
  useGetContentTypeConfigurationQuery,
  useGetAllContentTypeSettingsQuery,
  useUpdateContentTypeConfigurationMutation
} = contentTypesApi;
const checkIfAttributeIsDisplayable = (attribute) => {
  const { type } = attribute;
  if (type === "relation") {
    return !attribute.relation.toLowerCase().includes("morph");
  }
  return !["json", "dynamiczone", "richtext", "password", "blocks"].includes(type) && !!type;
};
const getMainField = (attribute, mainFieldName, { schemas, components }) => {
  if (!mainFieldName) {
    return void 0;
  }
  const mainFieldType = attribute.type === "component" ? components[attribute.component].attributes[mainFieldName].type : (
    // @ts-expect-error – `targetModel` does exist on the attribute for a relation.
    schemas.find((schema) => schema.uid === attribute.targetModel)?.attributes[mainFieldName].type
  );
  return {
    name: mainFieldName,
    type: mainFieldType ?? "string"
  };
};
const DEFAULT_SETTINGS = {
  bulkable: false,
  filterable: false,
  searchable: false,
  pagination: false,
  defaultSortBy: "",
  defaultSortOrder: "asc",
  mainField: "id",
  pageSize: 10
};
const useDocumentLayout = (model) => {
  const { schema, components } = useDocument({ model, collectionType: "" }, { skip: true });
  const [{ query }] = useQueryParams();
  const runHookWaterfall = useStrapiApp("useDocumentLayout", (state) => state.runHookWaterfall);
  const { toggleNotification } = useNotification();
  const { _unstableFormatAPIError: formatAPIError } = useAPIErrorHandler();
  const { isLoading: isLoadingSchemas, schemas } = useContentTypeSchema();
  const {
    data,
    isLoading: isLoadingConfigs,
    error,
    isFetching: isFetchingConfigs
  } = useGetContentTypeConfigurationQuery(model);
  const isLoading = isLoadingSchemas || isFetchingConfigs || isLoadingConfigs;
  React.useEffect(() => {
    if (error) {
      toggleNotification({
        type: "danger",
        message: formatAPIError(error)
      });
    }
  }, [error, formatAPIError, toggleNotification]);
  const editLayout = React.useMemo(
    () => data && !isLoading ? formatEditLayout(data, { schemas, schema, components }) : {
      layout: [],
      components: {},
      metadatas: {},
      options: {},
      settings: DEFAULT_SETTINGS
    },
    [data, isLoading, schemas, schema, components]
  );
  const listLayout = React.useMemo(() => {
    return data && !isLoading ? formatListLayout(data, { schemas, schema, components }) : {
      layout: [],
      metadatas: {},
      options: {},
      settings: DEFAULT_SETTINGS
    };
  }, [data, isLoading, schemas, schema, components]);
  const { layout: edit } = React.useMemo(
    () => runHookWaterfall(HOOKS.MUTATE_EDIT_VIEW_LAYOUT, {
      layout: editLayout,
      query
    }),
    [editLayout, query, runHookWaterfall]
  );
  return {
    error,
    isLoading,
    edit,
    list: listLayout
  };
};
const useDocLayout = () => {
  const { model } = useDoc();
  return useDocumentLayout(model);
};
const formatEditLayout = (data, {
  schemas,
  schema,
  components
}) => {
  let currentPanelIndex = 0;
  const panelledEditAttributes = convertEditLayoutToFieldLayouts(
    data.contentType.layouts.edit,
    schema?.attributes,
    data.contentType.metadatas,
    { configurations: data.components, schemas: components },
    schemas
  ).reduce((panels, row) => {
    if (row.some((field) => field.type === "dynamiczone")) {
      panels.push([row]);
      currentPanelIndex += 2;
    } else {
      if (!panels[currentPanelIndex]) {
        panels.push([row]);
      } else {
        panels[currentPanelIndex].push(row);
      }
    }
    return panels;
  }, []);
  const componentEditAttributes = Object.entries(data.components).reduce(
    (acc, [uid, configuration]) => {
      acc[uid] = {
        layout: convertEditLayoutToFieldLayouts(
          configuration.layouts.edit,
          components[uid].attributes,
          configuration.metadatas,
          { configurations: data.components, schemas: components }
        ),
        settings: {
          ...configuration.settings,
          icon: components[uid].info.icon,
          displayName: components[uid].info.displayName
        }
      };
      return acc;
    },
    {}
  );
  const editMetadatas = Object.entries(data.contentType.metadatas).reduce(
    (acc, [attribute, metadata]) => {
      return {
        ...acc,
        [attribute]: metadata.edit
      };
    },
    {}
  );
  return {
    layout: panelledEditAttributes,
    components: componentEditAttributes,
    metadatas: editMetadatas,
    settings: {
      ...data.contentType.settings,
      displayName: schema?.info.displayName
    },
    options: {
      ...schema?.options,
      ...schema?.pluginOptions,
      ...data.contentType.options
    }
  };
};
const convertEditLayoutToFieldLayouts = (rows, attributes = {}, metadatas, components, schemas = []) => {
  return rows.map(
    (row) => row.map((field) => {
      const attribute = attributes[field.name];
      if (!attribute) {
        return null;
      }
      const { edit: metadata } = metadatas[field.name];
      const settings = attribute.type === "component" && components ? components.configurations[attribute.component].settings : {};
      return {
        attribute,
        disabled: !metadata.editable,
        hint: metadata.description,
        label: metadata.label ?? "",
        name: field.name,
        // @ts-expect-error – mainField does exist on the metadata for a relation.
        mainField: getMainField(attribute, metadata.mainField || settings.mainField, {
          schemas,
          components: components?.schemas ?? {}
        }),
        placeholder: metadata.placeholder ?? "",
        required: attribute.required ?? false,
        size: field.size,
        unique: "unique" in attribute ? attribute.unique : false,
        visible: metadata.visible ?? true,
        type: attribute.type
      };
    }).filter((field) => field !== null)
  );
};
const formatListLayout = (data, {
  schemas,
  schema,
  components
}) => {
  const listMetadatas = Object.entries(data.contentType.metadatas).reduce(
    (acc, [attribute, metadata]) => {
      return {
        ...acc,
        [attribute]: metadata.list
      };
    },
    {}
  );
  const listAttributes = convertListLayoutToFieldLayouts(
    data.contentType.layouts.list,
    schema?.attributes,
    listMetadatas,
    { configurations: data.components, schemas: components },
    schemas
  );
  return {
    layout: listAttributes,
    settings: { ...data.contentType.settings, displayName: schema?.info.displayName },
    metadatas: listMetadatas,
    options: {
      ...schema?.options,
      ...schema?.pluginOptions,
      ...data.contentType.options
    }
  };
};
const convertListLayoutToFieldLayouts = (columns, attributes = {}, metadatas, components, schemas = []) => {
  return columns.map((name) => {
    const attribute = attributes[name];
    if (!attribute) {
      return null;
    }
    const metadata = metadatas[name];
    const settings = attribute.type === "component" && components ? components.configurations[attribute.component].settings : {};
    return {
      attribute,
      label: metadata.label ?? "",
      mainField: getMainField(attribute, metadata.mainField || settings.mainField, {
        schemas,
        components: components?.schemas ?? {}
      }),
      name,
      searchable: metadata.searchable ?? true,
      sortable: metadata.sortable ?? true
    };
  }).filter((field) => field !== null);
};
const useDocument = (args, opts) => {
  const { toggleNotification } = useNotification();
  const { _unstableFormatAPIError: formatAPIError } = useAPIErrorHandler();
  const {
    currentData: data,
    isLoading: isLoadingDocument,
    isFetching: isFetchingDocument,
    error
  } = useGetDocumentQuery(args, {
    ...opts,
    skip: !args.documentId && args.collectionType !== SINGLE_TYPES || opts?.skip
  });
  const {
    components,
    schema,
    schemas,
    isLoading: isLoadingSchema
  } = useContentTypeSchema(args.model);
  React.useEffect(() => {
    if (error) {
      toggleNotification({
        type: "danger",
        message: formatAPIError(error)
      });
    }
  }, [toggleNotification, error, formatAPIError, args.collectionType]);
  const validationSchema = React.useMemo(() => {
    if (!schema) {
      return null;
    }
    return createYupSchema(schema.attributes, components);
  }, [schema, components]);
  const validate = React.useCallback(
    (document) => {
      if (!validationSchema) {
        throw new Error(
          "There is no validation schema generated, this is likely due to the schema not being loaded yet."
        );
      }
      try {
        validationSchema.validateSync(document, { abortEarly: false, strict: true });
        return null;
      } catch (error2) {
        if (error2 instanceof ValidationError) {
          return getYupValidationErrors(error2);
        }
        throw error2;
      }
    },
    [validationSchema]
  );
  const isLoading = isLoadingDocument || isFetchingDocument || isLoadingSchema;
  const hasError = !!error;
  return {
    components,
    document: data?.data,
    meta: data?.meta,
    isLoading,
    hasError,
    schema,
    schemas,
    validate
  };
};
const useDoc = () => {
  const { id, slug, collectionType, origin } = useParams();
  const [{ query }] = useQueryParams();
  const params = React.useMemo(() => buildValidParams(query), [query]);
  if (!collectionType) {
    throw new Error("Could not find collectionType in url params");
  }
  if (!slug) {
    throw new Error("Could not find model in url params");
  }
  const document = useDocument(
    { documentId: origin || id, model: slug, collectionType, params },
    {
      skip: id === "create" || !origin && !id && collectionType !== SINGLE_TYPES
    }
  );
  const returnId = origin || id === "create" ? void 0 : id;
  return {
    collectionType,
    model: slug,
    id: returnId,
    ...document
  };
};
const useContentManagerContext = () => {
  const {
    collectionType,
    model,
    id,
    components,
    isLoading: isLoadingDoc,
    schema,
    schemas
  } = useDoc();
  const layout = useDocumentLayout(model);
  const form = useForm("useContentManagerContext", (state) => state);
  const isSingleType = collectionType === SINGLE_TYPES;
  const slug = model;
  const isCreatingEntry = id === "create";
  useContentTypeSchema();
  const isLoading = isLoadingDoc || layout.isLoading;
  const error = layout.error;
  return {
    error,
    isLoading,
    // Base metadata
    model,
    collectionType,
    id,
    slug,
    isCreatingEntry,
    isSingleType,
    hasDraftAndPublish: schema?.options?.draftAndPublish ?? false,
    // All schema infos
    components,
    contentType: schema,
    contentTypes: schemas,
    // Form state
    form,
    // layout infos
    layout
  };
};
const prefixPluginTranslations = (trad, pluginId) => {
  return Object.keys(trad).reduce((acc, current) => {
    acc[`${pluginId}.${current}`] = trad[current];
    return acc;
  }, {});
};
const getTranslation = (id) => `content-manager.${id}`;
const DEFAULT_UNEXPECTED_ERROR_MSG = {
  id: "notification.error",
  defaultMessage: "An error occurred, please try again"
};
const useDocumentActions = () => {
  const { toggleNotification } = useNotification();
  const { formatMessage } = useIntl();
  const { trackUsage } = useTracking();
  const { _unstableFormatAPIError: formatAPIError } = useAPIErrorHandler();
  const navigate = useNavigate();
  const setCurrentStep = useGuidedTour("useDocumentActions", (state) => state.setCurrentStep);
  const [deleteDocument] = useDeleteDocumentMutation();
  const _delete = React.useCallback(
    async ({ collectionType, model, documentId, params }, trackerProperty) => {
      try {
        trackUsage("willDeleteEntry", trackerProperty);
        const res = await deleteDocument({
          collectionType,
          model,
          documentId,
          params
        });
        if ("error" in res) {
          toggleNotification({
            type: "danger",
            message: formatAPIError(res.error)
          });
          return { error: res.error };
        }
        toggleNotification({
          type: "success",
          message: formatMessage({
            id: getTranslation("success.record.delete"),
            defaultMessage: "Deleted document"
          })
        });
        trackUsage("didDeleteEntry", trackerProperty);
        return res.data;
      } catch (err) {
        toggleNotification({
          type: "danger",
          message: formatMessage(DEFAULT_UNEXPECTED_ERROR_MSG)
        });
        trackUsage("didNotDeleteEntry", { error: err, ...trackerProperty });
        throw err;
      }
    },
    [trackUsage, deleteDocument, toggleNotification, formatMessage, formatAPIError]
  );
  const [deleteManyDocuments] = useDeleteManyDocumentsMutation();
  const deleteMany = React.useCallback(
    async ({ model, documentIds, params }) => {
      try {
        trackUsage("willBulkDeleteEntries");
        const res = await deleteManyDocuments({
          model,
          documentIds,
          params
        });
        if ("error" in res) {
          toggleNotification({
            type: "danger",
            message: formatAPIError(res.error)
          });
          return { error: res.error };
        }
        toggleNotification({
          type: "success",
          title: formatMessage({
            id: getTranslation("success.records.delete"),
            defaultMessage: "Successfully deleted."
          }),
          message: ""
        });
        trackUsage("didBulkDeleteEntries");
        return res.data;
      } catch (err) {
        toggleNotification({
          type: "danger",
          message: formatMessage(DEFAULT_UNEXPECTED_ERROR_MSG)
        });
        trackUsage("didNotBulkDeleteEntries");
        throw err;
      }
    },
    [trackUsage, deleteManyDocuments, toggleNotification, formatMessage, formatAPIError]
  );
  const [discardDocument] = useDiscardDocumentMutation();
  const discard = React.useCallback(
    async ({ collectionType, model, documentId, params }) => {
      try {
        const res = await discardDocument({
          collectionType,
          model,
          documentId,
          params
        });
        if ("error" in res) {
          toggleNotification({
            type: "danger",
            message: formatAPIError(res.error)
          });
          return { error: res.error };
        }
        toggleNotification({
          type: "success",
          message: formatMessage({
            id: "content-manager.success.record.discard",
            defaultMessage: "Changes discarded"
          })
        });
        return res.data;
      } catch (err) {
        toggleNotification({
          type: "danger",
          message: formatMessage(DEFAULT_UNEXPECTED_ERROR_MSG)
        });
        throw err;
      }
    },
    [discardDocument, formatAPIError, formatMessage, toggleNotification]
  );
  const [publishDocument] = usePublishDocumentMutation();
  const publish = React.useCallback(
    async ({ collectionType, model, documentId, params }, data) => {
      try {
        trackUsage("willPublishEntry");
        const res = await publishDocument({
          collectionType,
          model,
          documentId,
          data,
          params
        });
        if ("error" in res) {
          toggleNotification({ type: "danger", message: formatAPIError(res.error) });
          return { error: res.error };
        }
        trackUsage("didPublishEntry");
        toggleNotification({
          type: "success",
          message: formatMessage({
            id: getTranslation("success.record.publish"),
            defaultMessage: "Published document"
          })
        });
        return res.data;
      } catch (err) {
        toggleNotification({
          type: "danger",
          message: formatMessage(DEFAULT_UNEXPECTED_ERROR_MSG)
        });
        throw err;
      }
    },
    [trackUsage, publishDocument, toggleNotification, formatMessage, formatAPIError]
  );
  const [publishManyDocuments] = usePublishManyDocumentsMutation();
  const publishMany = React.useCallback(
    async ({ model, documentIds, params }) => {
      try {
        const res = await publishManyDocuments({
          model,
          documentIds,
          params
        });
        if ("error" in res) {
          toggleNotification({ type: "danger", message: formatAPIError(res.error) });
          return { error: res.error };
        }
        toggleNotification({
          type: "success",
          message: formatMessage({
            id: getTranslation("success.record.publish"),
            defaultMessage: "Published document"
          })
        });
        return res.data;
      } catch (err) {
        toggleNotification({
          type: "danger",
          message: formatMessage(DEFAULT_UNEXPECTED_ERROR_MSG)
        });
        throw err;
      }
    },
    [
      // trackUsage,
      publishManyDocuments,
      toggleNotification,
      formatMessage,
      formatAPIError
    ]
  );
  const [updateDocument] = useUpdateDocumentMutation();
  const update = React.useCallback(
    async ({ collectionType, model, documentId, params }, data, trackerProperty) => {
      try {
        trackUsage("willEditEntry", trackerProperty);
        const res = await updateDocument({
          collectionType,
          model,
          documentId,
          data,
          params
        });
        if ("error" in res) {
          toggleNotification({ type: "danger", message: formatAPIError(res.error) });
          trackUsage("didNotEditEntry", { error: res.error, ...trackerProperty });
          return { error: res.error };
        }
        trackUsage("didEditEntry", trackerProperty);
        toggleNotification({
          type: "success",
          message: formatMessage({
            id: getTranslation("success.record.save"),
            defaultMessage: "Saved document"
          })
        });
        return res.data;
      } catch (err) {
        trackUsage("didNotEditEntry", { error: err, ...trackerProperty });
        toggleNotification({
          type: "danger",
          message: formatMessage(DEFAULT_UNEXPECTED_ERROR_MSG)
        });
        throw err;
      }
    },
    [trackUsage, updateDocument, toggleNotification, formatMessage, formatAPIError]
  );
  const [unpublishDocument] = useUnpublishDocumentMutation();
  const unpublish = React.useCallback(
    async ({ collectionType, model, documentId, params }, discardDraft = false) => {
      try {
        trackUsage("willUnpublishEntry");
        const res = await unpublishDocument({
          collectionType,
          model,
          documentId,
          params,
          data: {
            discardDraft
          }
        });
        if ("error" in res) {
          toggleNotification({ type: "danger", message: formatAPIError(res.error) });
          return { error: res.error };
        }
        trackUsage("didUnpublishEntry");
        toggleNotification({
          type: "success",
          message: formatMessage({
            id: getTranslation("success.record.unpublish"),
            defaultMessage: "Unpublished document"
          })
        });
        return res.data;
      } catch (err) {
        toggleNotification({
          type: "danger",
          message: formatMessage(DEFAULT_UNEXPECTED_ERROR_MSG)
        });
        throw err;
      }
    },
    [trackUsage, unpublishDocument, toggleNotification, formatMessage, formatAPIError]
  );
  const [unpublishManyDocuments] = useUnpublishManyDocumentsMutation();
  const unpublishMany = React.useCallback(
    async ({ model, documentIds, params }) => {
      try {
        trackUsage("willBulkUnpublishEntries");
        const res = await unpublishManyDocuments({
          model,
          documentIds,
          params
        });
        if ("error" in res) {
          toggleNotification({ type: "danger", message: formatAPIError(res.error) });
          return { error: res.error };
        }
        trackUsage("didBulkUnpublishEntries");
        toggleNotification({
          type: "success",
          title: formatMessage({
            id: getTranslation("success.records.unpublish"),
            defaultMessage: "Successfully unpublished."
          }),
          message: ""
        });
        return res.data;
      } catch (err) {
        toggleNotification({
          type: "danger",
          message: formatMessage(DEFAULT_UNEXPECTED_ERROR_MSG)
        });
        trackUsage("didNotBulkUnpublishEntries");
        throw err;
      }
    },
    [trackUsage, unpublishManyDocuments, toggleNotification, formatMessage, formatAPIError]
  );
  const [createDocument] = useCreateDocumentMutation();
  const create = React.useCallback(
    async ({ model, params }, data, trackerProperty) => {
      try {
        const res = await createDocument({
          model,
          data,
          params
        });
        if ("error" in res) {
          toggleNotification({ type: "danger", message: formatAPIError(res.error) });
          trackUsage("didNotCreateEntry", { error: res.error, ...trackerProperty });
          return { error: res.error };
        }
        trackUsage("didCreateEntry", trackerProperty);
        toggleNotification({
          type: "success",
          message: formatMessage({
            id: getTranslation("success.record.save"),
            defaultMessage: "Saved document"
          })
        });
        setCurrentStep("contentManager.success");
        return res.data;
      } catch (err) {
        toggleNotification({
          type: "danger",
          message: formatMessage(DEFAULT_UNEXPECTED_ERROR_MSG)
        });
        trackUsage("didNotCreateEntry", { error: err, ...trackerProperty });
        throw err;
      }
    },
    [createDocument, formatAPIError, formatMessage, toggleNotification, trackUsage]
  );
  const [autoCloneDocument] = useAutoCloneDocumentMutation();
  const autoClone = React.useCallback(
    async ({ model, sourceId }) => {
      try {
        const res = await autoCloneDocument({
          model,
          sourceId
        });
        if ("error" in res) {
          return { error: res.error };
        }
        toggleNotification({
          type: "success",
          message: formatMessage({
            id: getTranslation("success.record.clone"),
            defaultMessage: "Cloned document"
          })
        });
        return res.data;
      } catch (err) {
        toggleNotification({
          type: "danger",
          message: formatMessage(DEFAULT_UNEXPECTED_ERROR_MSG)
        });
        throw err;
      }
    },
    [autoCloneDocument, formatMessage, toggleNotification]
  );
  const [cloneDocument] = useCloneDocumentMutation();
  const clone = React.useCallback(
    async ({ model, documentId, params }, body, trackerProperty) => {
      try {
        const { id: _id, ...restBody } = body;
        const res = await cloneDocument({
          model,
          sourceId: documentId,
          data: restBody,
          params
        });
        if ("error" in res) {
          toggleNotification({ type: "danger", message: formatAPIError(res.error) });
          trackUsage("didNotCreateEntry", { error: res.error, ...trackerProperty });
          return { error: res.error };
        }
        trackUsage("didCreateEntry", trackerProperty);
        toggleNotification({
          type: "success",
          message: formatMessage({
            id: getTranslation("success.record.clone"),
            defaultMessage: "Cloned document"
          })
        });
        navigate(`../../${res.data.data.documentId}`, { relative: "path" });
        return res.data;
      } catch (err) {
        toggleNotification({
          type: "danger",
          message: formatMessage(DEFAULT_UNEXPECTED_ERROR_MSG)
        });
        trackUsage("didNotCreateEntry", { error: err, ...trackerProperty });
        throw err;
      }
    },
    [cloneDocument, trackUsage, toggleNotification, formatMessage, formatAPIError, navigate]
  );
  const [getDoc] = useLazyGetDocumentQuery();
  const getDocument = React.useCallback(
    async (args) => {
      const { data } = await getDoc(args);
      return data;
    },
    [getDoc]
  );
  return {
    autoClone,
    clone,
    create,
    delete: _delete,
    deleteMany,
    discard,
    getDocument,
    publish,
    publishMany,
    unpublish,
    unpublishMany,
    update
  };
};
const ProtectedHistoryPage = React.lazy(
  () => import("./History-tU567_hc.mjs").then((mod) => ({ default: mod.ProtectedHistoryPage }))
);
const routes$2 = [
  {
    path: ":collectionType/:slug/:id/history",
    Component: ProtectedHistoryPage
  },
  {
    path: ":collectionType/:slug/history",
    Component: ProtectedHistoryPage
  }
];
const ProtectedPreviewPage = React.lazy(
  () => import("./Preview-C1dBkhXf.mjs").then((mod) => ({ default: mod.ProtectedPreviewPage }))
);
const routes$1 = [
  {
    path: ":collectionType/:slug/:id/preview",
    Component: ProtectedPreviewPage
  },
  {
    path: ":collectionType/:slug/preview",
    Component: ProtectedPreviewPage
  }
];
const ProtectedEditViewPage = lazy(
  () => import("./EditViewPage-COVXj9bh.mjs").then((mod) => ({ default: mod.ProtectedEditViewPage }))
);
const ProtectedListViewPage = lazy(
  () => import("./ListViewPage-B50esy_x.mjs").then((mod) => ({ default: mod.ProtectedListViewPage }))
);
const ProtectedListConfiguration = lazy(
  () => import("./ListConfigurationPage-DQryo_4i.mjs").then((mod) => ({
    default: mod.ProtectedListConfiguration
  }))
);
const ProtectedEditConfigurationPage = lazy(
  () => import("./EditConfigurationPage-DMnf8orh.mjs").then((mod) => ({
    default: mod.ProtectedEditConfigurationPage
  }))
);
const ProtectedComponentConfigurationPage = lazy(
  () => import("./ComponentConfigurationPage-D4J64ny7.mjs").then((mod) => ({
    default: mod.ProtectedComponentConfigurationPage
  }))
);
const NoPermissions = lazy(
  () => import("./NoPermissionsPage-0-CW106p.mjs").then((mod) => ({ default: mod.NoPermissions }))
);
const NoContentType = lazy(
  () => import("./NoContentTypePage-CiPP8cLx.mjs").then((mod) => ({ default: mod.NoContentType }))
);
const CollectionTypePages = () => {
  const { collectionType } = useParams();
  if (collectionType !== COLLECTION_TYPES && collectionType !== SINGLE_TYPES) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/404" });
  }
  return collectionType === COLLECTION_TYPES ? /* @__PURE__ */ jsx(ProtectedListViewPage, {}) : /* @__PURE__ */ jsx(ProtectedEditViewPage, {});
};
const CLONE_RELATIVE_PATH = ":collectionType/:slug/clone/:origin";
const CLONE_PATH = `/content-manager/${CLONE_RELATIVE_PATH}`;
const LIST_RELATIVE_PATH = ":collectionType/:slug";
const LIST_PATH = `/content-manager/collection-types/:slug`;
const routes = [
  {
    path: LIST_RELATIVE_PATH,
    element: /* @__PURE__ */ jsx(CollectionTypePages, {})
  },
  {
    path: ":collectionType/:slug/:id",
    Component: ProtectedEditViewPage
  },
  {
    path: CLONE_RELATIVE_PATH,
    Component: ProtectedEditViewPage
  },
  {
    path: ":collectionType/:slug/configurations/list",
    Component: ProtectedListConfiguration
  },
  {
    path: "components/:slug/configurations/edit",
    Component: ProtectedComponentConfigurationPage
  },
  {
    path: ":collectionType/:slug/configurations/edit",
    Component: ProtectedEditConfigurationPage
  },
  {
    path: "403",
    Component: NoPermissions
  },
  {
    path: "no-content-types",
    Component: NoContentType
  },
  ...routes$2,
  ...routes$1
];
const DocumentActions = ({ actions: actions2 }) => {
  const { formatMessage } = useIntl();
  const [primaryAction, secondaryAction, ...restActions] = actions2.filter((action) => {
    if (action.position === void 0) {
      return true;
    }
    const positions = Array.isArray(action.position) ? action.position : [action.position];
    return positions.includes("panel");
  });
  if (!primaryAction) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Flex, { direction: "column", gap: 2, alignItems: "stretch", width: "100%", children: [
    /* @__PURE__ */ jsxs(Flex, { gap: 2, children: [
      /* @__PURE__ */ jsx(DocumentActionButton, { ...primaryAction, variant: primaryAction.variant || "default" }),
      restActions.length > 0 ? /* @__PURE__ */ jsx(
        DocumentActionsMenu,
        {
          actions: restActions,
          label: formatMessage({
            id: "content-manager.containers.edit.panels.default.more-actions",
            defaultMessage: "More document actions"
          })
        }
      ) : null
    ] }),
    secondaryAction ? /* @__PURE__ */ jsx(
      DocumentActionButton,
      {
        ...secondaryAction,
        variant: secondaryAction.variant || "secondary"
      }
    ) : null
  ] });
};
const DocumentActionButton = (action) => {
  const [dialogId, setDialogId] = React.useState(null);
  const { toggleNotification } = useNotification();
  const handleClick = (action2) => async (e) => {
    const { onClick = () => false, dialog, id } = action2;
    const muteDialog = await onClick(e);
    if (dialog && !muteDialog) {
      switch (dialog.type) {
        case "notification":
          toggleNotification({
            title: dialog.title,
            message: dialog.content,
            type: dialog.status,
            timeout: dialog.timeout,
            onClose: dialog.onClose
          });
          break;
        case "dialog":
        case "modal":
          e.preventDefault();
          setDialogId(id);
      }
    }
  };
  const handleClose = () => {
    setDialogId(null);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Button,
      {
        flex: "auto",
        startIcon: action.icon,
        disabled: action.disabled,
        onClick: handleClick(action),
        justifyContent: "center",
        variant: action.variant || "default",
        paddingTop: "7px",
        paddingBottom: "7px",
        children: action.label
      }
    ),
    action.dialog?.type === "dialog" ? /* @__PURE__ */ jsx(
      DocumentActionConfirmDialog,
      {
        ...action.dialog,
        variant: action.dialog?.variant ?? action.variant,
        isOpen: dialogId === action.id,
        onClose: handleClose
      }
    ) : null,
    action.dialog?.type === "modal" ? /* @__PURE__ */ jsx(
      DocumentActionModal,
      {
        ...action.dialog,
        onModalClose: handleClose,
        isOpen: dialogId === action.id
      }
    ) : null
  ] });
};
const MenuItem = styled(Menu.Item)`
  &:hover {
    background: ${({ theme, isVariantDanger, isDisabled }) => isVariantDanger && !isDisabled ? theme.colors.danger100 : "neutral"};
  }
`;
const DocumentActionsMenu = ({
  actions: actions2,
  children,
  label,
  variant = "tertiary"
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dialogId, setDialogId] = React.useState(null);
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();
  const isDisabled = actions2.every((action) => action.disabled) || actions2.length === 0;
  const handleClick = (action) => async (e) => {
    const { onClick = () => false, dialog, id } = action;
    const muteDialog = await onClick(e);
    if (dialog && !muteDialog) {
      switch (dialog.type) {
        case "notification":
          toggleNotification({
            title: dialog.title,
            message: dialog.content,
            type: dialog.status,
            timeout: dialog.timeout,
            onClose: dialog.onClose
          });
          break;
        case "dialog":
        case "modal":
          setDialogId(id);
      }
    }
  };
  const handleClose = () => {
    setDialogId(null);
    setIsOpen(false);
  };
  return /* @__PURE__ */ jsxs(Menu.Root, { open: isOpen, onOpenChange: setIsOpen, children: [
    /* @__PURE__ */ jsxs(
      Menu.Trigger,
      {
        disabled: isDisabled,
        size: "S",
        endIcon: null,
        paddingTop: "4px",
        paddingLeft: "7px",
        paddingRight: "7px",
        variant,
        children: [
          /* @__PURE__ */ jsx(More, { "aria-hidden": true, focusable: false }),
          /* @__PURE__ */ jsx(VisuallyHidden, { tag: "span", children: label || formatMessage({
            id: "content-manager.containers.edit.panels.default.more-actions",
            defaultMessage: "More document actions"
          }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(Menu.Content, { maxHeight: void 0, popoverPlacement: "bottom-end", children: [
      actions2.map((action) => {
        return /* @__PURE__ */ jsx(
          MenuItem,
          {
            disabled: action.disabled,
            onSelect: handleClick(action),
            display: "block",
            isVariantDanger: action.variant === "danger",
            isDisabled: action.disabled,
            children: /* @__PURE__ */ jsx(Flex, { justifyContent: "space-between", gap: 4, children: /* @__PURE__ */ jsxs(
              Flex,
              {
                color: !action.disabled ? convertActionVariantToColor(action.variant) : "inherit",
                gap: 2,
                tag: "span",
                children: [
                  /* @__PURE__ */ jsx(
                    Flex,
                    {
                      tag: "span",
                      color: !action.disabled ? convertActionVariantToIconColor(action.variant) : "inherit",
                      children: action.icon
                    }
                  ),
                  action.label
                ]
              }
            ) })
          },
          action.id
        );
      }),
      children
    ] }),
    actions2.map((action) => {
      return /* @__PURE__ */ jsxs(React.Fragment, { children: [
        action.dialog?.type === "dialog" ? /* @__PURE__ */ jsx(
          DocumentActionConfirmDialog,
          {
            ...action.dialog,
            variant: action.variant,
            isOpen: dialogId === action.id,
            onClose: handleClose
          }
        ) : null,
        action.dialog?.type === "modal" ? /* @__PURE__ */ jsx(
          DocumentActionModal,
          {
            ...action.dialog,
            onModalClose: handleClose,
            isOpen: dialogId === action.id
          }
        ) : null
      ] }, action.id);
    })
  ] });
};
const convertActionVariantToColor = (variant = "secondary") => {
  switch (variant) {
    case "danger":
      return "danger600";
    case "secondary":
      return void 0;
    case "success":
      return "success600";
    default:
      return "primary600";
  }
};
const convertActionVariantToIconColor = (variant = "secondary") => {
  switch (variant) {
    case "danger":
      return "danger600";
    case "secondary":
      return "neutral500";
    case "success":
      return "success600";
    default:
      return "primary600";
  }
};
const DocumentActionConfirmDialog = ({
  onClose,
  onCancel,
  onConfirm,
  title,
  content,
  isOpen,
  variant = "secondary"
}) => {
  const { formatMessage } = useIntl();
  const handleClose = async () => {
    if (onCancel) {
      await onCancel();
    }
    onClose();
  };
  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    onClose();
  };
  return /* @__PURE__ */ jsx(Dialog.Root, { open: isOpen, onOpenChange: handleClose, children: /* @__PURE__ */ jsxs(Dialog.Content, { children: [
    /* @__PURE__ */ jsx(Dialog.Header, { children: title }),
    /* @__PURE__ */ jsx(Dialog.Body, { children: content }),
    /* @__PURE__ */ jsxs(Dialog.Footer, { children: [
      /* @__PURE__ */ jsx(Dialog.Cancel, { children: /* @__PURE__ */ jsx(Button, { variant: "tertiary", fullWidth: true, children: formatMessage({
        id: "app.components.Button.cancel",
        defaultMessage: "Cancel"
      }) }) }),
      /* @__PURE__ */ jsx(Button, { onClick: handleConfirm, variant, fullWidth: true, children: formatMessage({
        id: "app.components.Button.confirm",
        defaultMessage: "Confirm"
      }) })
    ] })
  ] }) });
};
const DocumentActionModal = ({
  isOpen,
  title,
  onClose,
  footer: Footer,
  content: Content,
  onModalClose
}) => {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    onModalClose();
  };
  return /* @__PURE__ */ jsx(Modal.Root, { open: isOpen, onOpenChange: handleClose, children: /* @__PURE__ */ jsxs(Modal.Content, { children: [
    /* @__PURE__ */ jsx(Modal.Header, { children: /* @__PURE__ */ jsx(Modal.Title, { children: title }) }),
    typeof Content === "function" ? /* @__PURE__ */ jsx(Content, { onClose: handleClose }) : /* @__PURE__ */ jsx(Modal.Body, { children: Content }),
    typeof Footer === "function" ? /* @__PURE__ */ jsx(Footer, { onClose: handleClose }) : Footer
  ] }) });
};
const transformData = (data) => {
  if (Array.isArray(data)) {
    return data.map(transformData);
  }
  if (typeof data === "object" && data !== null) {
    if ("apiData" in data) {
      return data.apiData;
    }
    return mapValues(transformData)(data);
  }
  return data;
};
const PublishAction$1 = ({
  activeTab,
  documentId,
  model,
  collectionType,
  meta,
  document
}) => {
  const { schema } = useDoc();
  const navigate = useNavigate();
  const { toggleNotification } = useNotification();
  const { _unstableFormatValidationErrors: formatValidationErrors } = useAPIErrorHandler();
  const isListView = useMatch(LIST_PATH) !== null;
  const isCloning = useMatch(CLONE_PATH) !== null;
  const { id } = useParams();
  const { formatMessage } = useIntl();
  const canPublish = useDocumentRBAC("PublishAction", ({ canPublish: canPublish2 }) => canPublish2);
  const { publish } = useDocumentActions();
  const [
    countDraftRelations,
    { isLoading: isLoadingDraftRelations, isError: isErrorDraftRelations }
  ] = useLazyGetDraftRelationCountQuery();
  const [localCountOfDraftRelations, setLocalCountOfDraftRelations] = React.useState(0);
  const [serverCountOfDraftRelations, setServerCountOfDraftRelations] = React.useState(0);
  const [{ query, rawQuery }] = useQueryParams();
  const params = React.useMemo(() => buildValidParams(query), [query]);
  const modified = useForm("PublishAction", ({ modified: modified2 }) => modified2);
  const setSubmitting = useForm("PublishAction", ({ setSubmitting: setSubmitting2 }) => setSubmitting2);
  const isSubmitting = useForm("PublishAction", ({ isSubmitting: isSubmitting2 }) => isSubmitting2);
  const validate = useForm("PublishAction", (state) => state.validate);
  const setErrors = useForm("PublishAction", (state) => state.setErrors);
  const formValues = useForm("PublishAction", ({ values }) => values);
  React.useEffect(() => {
    if (isErrorDraftRelations) {
      toggleNotification({
        type: "danger",
        message: formatMessage({
          id: getTranslation("error.records.fetch-draft-relatons"),
          defaultMessage: "An error occurred while fetching draft relations on this document."
        })
      });
    }
  }, [isErrorDraftRelations, toggleNotification, formatMessage]);
  React.useEffect(() => {
    const localDraftRelations = /* @__PURE__ */ new Set();
    const extractDraftRelations = (data) => {
      const relations = data.connect || [];
      relations.forEach((relation) => {
        if (relation.status === "draft") {
          localDraftRelations.add(relation.id);
        }
      });
    };
    const traverseAndExtract = (data) => {
      Object.entries(data).forEach(([key, value]) => {
        if (key === "connect" && Array.isArray(value)) {
          extractDraftRelations({ connect: value });
        } else if (typeof value === "object" && value !== null) {
          traverseAndExtract(value);
        }
      });
    };
    if (!documentId || modified) {
      traverseAndExtract(formValues);
      setLocalCountOfDraftRelations(localDraftRelations.size);
    }
  }, [documentId, modified, formValues, setLocalCountOfDraftRelations]);
  React.useEffect(() => {
    if (!document || !document.documentId || isListView) {
      return;
    }
    const fetchDraftRelationsCount = async () => {
      const { data, error } = await countDraftRelations({
        collectionType,
        model,
        documentId,
        params
      });
      if (error) {
        throw error;
      }
      if (data) {
        setServerCountOfDraftRelations(data.data);
      }
    };
    fetchDraftRelationsCount();
  }, [isListView, document, documentId, countDraftRelations, collectionType, model, params]);
  const isDocumentPublished = (document?.[PUBLISHED_AT_ATTRIBUTE_NAME] || meta?.availableStatus.some((doc) => doc[PUBLISHED_AT_ATTRIBUTE_NAME] !== null)) && document?.status !== "modified";
  if (!schema?.options?.draftAndPublish) {
    return null;
  }
  const performPublish = async () => {
    setSubmitting(true);
    try {
      const { errors } = await validate(true, {
        status: "published"
      });
      if (errors) {
        toggleNotification({
          type: "danger",
          message: formatMessage({
            id: "content-manager.validation.error",
            defaultMessage: "There are validation errors in your document. Please fix them before saving."
          })
        });
        return;
      }
      const res = await publish(
        {
          collectionType,
          model,
          documentId,
          params
        },
        transformData(formValues)
      );
      if ("data" in res && collectionType !== SINGLE_TYPES) {
        if (id === "create") {
          navigate({
            pathname: `../${collectionType}/${model}/${res.data.documentId}`,
            search: rawQuery
          });
        }
      } else if ("error" in res && isBaseQueryError(res.error) && res.error.name === "ValidationError") {
        setErrors(formatValidationErrors(res.error));
      }
    } finally {
      setSubmitting(false);
    }
  };
  const totalDraftRelations = localCountOfDraftRelations + serverCountOfDraftRelations;
  const enableDraftRelationsCount = false;
  const hasDraftRelations = enableDraftRelationsCount;
  return {
    /**
     * Disabled when:
     *  - currently if you're cloning a document we don't support publish & clone at the same time.
     *  - the form is submitting
     *  - the active tab is the published tab
     *  - the document is already published & not modified
     *  - the document is being created & not modified
     *  - the user doesn't have the permission to publish
     */
    disabled: isCloning || isSubmitting || isLoadingDraftRelations || activeTab === "published" || !modified && isDocumentPublished || !modified && !document?.documentId || !canPublish,
    label: formatMessage({
      id: "app.utils.publish",
      defaultMessage: "Publish"
    }),
    onClick: async () => {
      await performPublish();
    },
    dialog: hasDraftRelations ? {
      type: "dialog",
      variant: "danger",
      footer: null,
      title: formatMessage({
        id: getTranslation(`popUpwarning.warning.bulk-has-draft-relations.title`),
        defaultMessage: "Confirmation"
      }),
      content: formatMessage(
        {
          id: getTranslation(`popUpwarning.warning.bulk-has-draft-relations.message`),
          defaultMessage: "This entry is related to {count, plural, one {# draft entry} other {# draft entries}}. Publishing it could leave broken links in your app."
        },
        {
          count: totalDraftRelations
        }
      ),
      onConfirm: async () => {
        await performPublish();
      }
    } : void 0
  };
};
PublishAction$1.type = "publish";
PublishAction$1.position = "panel";
const UpdateAction = ({
  activeTab,
  documentId,
  model,
  collectionType
}) => {
  const navigate = useNavigate();
  const { toggleNotification } = useNotification();
  const { _unstableFormatValidationErrors: formatValidationErrors } = useAPIErrorHandler();
  const cloneMatch = useMatch(CLONE_PATH);
  const isCloning = cloneMatch !== null;
  const { formatMessage } = useIntl();
  const { create, update, clone } = useDocumentActions();
  const [{ query, rawQuery }] = useQueryParams();
  const params = React.useMemo(() => buildValidParams(query), [query]);
  const isSubmitting = useForm("UpdateAction", ({ isSubmitting: isSubmitting2 }) => isSubmitting2);
  const modified = useForm("UpdateAction", ({ modified: modified2 }) => modified2);
  const setSubmitting = useForm("UpdateAction", ({ setSubmitting: setSubmitting2 }) => setSubmitting2);
  const document = useForm("UpdateAction", ({ values }) => values);
  const validate = useForm("UpdateAction", (state) => state.validate);
  const setErrors = useForm("UpdateAction", (state) => state.setErrors);
  const resetForm = useForm("PublishAction", ({ resetForm: resetForm2 }) => resetForm2);
  return {
    /**
     * Disabled when:
     * - the form is submitting
     * - the document is not modified & we're not cloning (you can save a clone entity straight away)
     * - the active tab is the published tab
     */
    disabled: isSubmitting || !modified && !isCloning || activeTab === "published",
    label: formatMessage({
      id: "global.save",
      defaultMessage: "Save"
    }),
    onClick: async () => {
      setSubmitting(true);
      try {
        const { errors } = await validate(true, {
          status: "draft"
        });
        if (errors) {
          toggleNotification({
            type: "danger",
            message: formatMessage({
              id: "content-manager.validation.error",
              defaultMessage: "There are validation errors in your document. Please fix them before saving."
            })
          });
          return;
        }
        if (isCloning) {
          const res = await clone(
            {
              model,
              documentId: cloneMatch.params.origin,
              params
            },
            transformData(document)
          );
          if ("data" in res) {
            navigate(
              {
                pathname: `../${res.data.documentId}`,
                search: rawQuery
              },
              { relative: "path" }
            );
          } else if ("error" in res && isBaseQueryError(res.error) && res.error.name === "ValidationError") {
            setErrors(formatValidationErrors(res.error));
          }
        } else if (documentId || collectionType === SINGLE_TYPES) {
          const res = await update(
            {
              collectionType,
              model,
              documentId,
              params
            },
            transformData(document)
          );
          if ("error" in res && isBaseQueryError(res.error) && res.error.name === "ValidationError") {
            setErrors(formatValidationErrors(res.error));
          } else {
            resetForm();
          }
        } else {
          const res = await create(
            {
              model,
              params
            },
            transformData(document)
          );
          if ("data" in res && collectionType !== SINGLE_TYPES) {
            navigate(
              {
                pathname: `../${res.data.documentId}`,
                search: rawQuery
              },
              { replace: true, relative: "path" }
            );
          } else if ("error" in res && isBaseQueryError(res.error) && res.error.name === "ValidationError") {
            setErrors(formatValidationErrors(res.error));
          }
        }
      } finally {
        setSubmitting(false);
      }
    }
  };
};
UpdateAction.type = "update";
UpdateAction.position = "panel";
const UNPUBLISH_DRAFT_OPTIONS = {
  KEEP: "keep",
  DISCARD: "discard"
};
const UnpublishAction$1 = ({
  activeTab,
  documentId,
  model,
  collectionType,
  document
}) => {
  const { formatMessage } = useIntl();
  const { schema } = useDoc();
  const canPublish = useDocumentRBAC("UnpublishAction", ({ canPublish: canPublish2 }) => canPublish2);
  const { unpublish } = useDocumentActions();
  const [{ query }] = useQueryParams();
  const params = React.useMemo(() => buildValidParams(query), [query]);
  const { toggleNotification } = useNotification();
  const [shouldKeepDraft, setShouldKeepDraft] = React.useState(true);
  const isDocumentModified = document?.status === "modified";
  const handleChange = (value) => {
    setShouldKeepDraft(value === UNPUBLISH_DRAFT_OPTIONS.KEEP);
  };
  if (!schema?.options?.draftAndPublish) {
    return null;
  }
  return {
    disabled: !canPublish || activeTab === "published" || document?.status !== "published" && document?.status !== "modified",
    label: formatMessage({
      id: "app.utils.unpublish",
      defaultMessage: "Unpublish"
    }),
    icon: /* @__PURE__ */ jsx(Cross, {}),
    onClick: async () => {
      if (!documentId && collectionType !== SINGLE_TYPES || isDocumentModified) {
        if (!documentId) {
          console.error(
            "You're trying to unpublish a document without an id, this is likely a bug with Strapi. Please open an issue."
          );
          toggleNotification({
            message: formatMessage({
              id: "content-manager.actions.unpublish.error",
              defaultMessage: "An error occurred while trying to unpublish the document."
            }),
            type: "danger"
          });
        }
        return;
      }
      await unpublish({
        collectionType,
        model,
        documentId,
        params
      });
    },
    dialog: isDocumentModified ? {
      type: "dialog",
      title: formatMessage({
        id: "app.components.ConfirmDialog.title",
        defaultMessage: "Confirmation"
      }),
      content: /* @__PURE__ */ jsxs(Flex, { alignItems: "flex-start", direction: "column", gap: 6, children: [
        /* @__PURE__ */ jsxs(Flex, { width: "100%", direction: "column", gap: 2, children: [
          /* @__PURE__ */ jsx(WarningCircle, { width: "24px", height: "24px", fill: "danger600" }),
          /* @__PURE__ */ jsx(Typography, { tag: "p", variant: "omega", textAlign: "center", children: formatMessage({
            id: "content-manager.actions.unpublish.dialog.body",
            defaultMessage: "Are you sure?"
          }) })
        ] }),
        /* @__PURE__ */ jsxs(
          Radio.Group,
          {
            defaultValue: UNPUBLISH_DRAFT_OPTIONS.KEEP,
            name: "discard-options",
            "aria-label": formatMessage({
              id: "content-manager.actions.unpublish.dialog.radio-label",
              defaultMessage: "Choose an option to unpublish the document."
            }),
            onValueChange: handleChange,
            children: [
              /* @__PURE__ */ jsx(Radio.Item, { checked: shouldKeepDraft, value: UNPUBLISH_DRAFT_OPTIONS.KEEP, children: formatMessage({
                id: "content-manager.actions.unpublish.dialog.option.keep-draft",
                defaultMessage: "Keep draft"
              }) }),
              /* @__PURE__ */ jsx(Radio.Item, { checked: !shouldKeepDraft, value: UNPUBLISH_DRAFT_OPTIONS.DISCARD, children: formatMessage({
                id: "content-manager.actions.unpublish.dialog.option.replace-draft",
                defaultMessage: "Replace draft"
              }) })
            ]
          }
        )
      ] }),
      onConfirm: async () => {
        if (!documentId && collectionType !== SINGLE_TYPES) {
          console.error(
            "You're trying to unpublish a document without an id, this is likely a bug with Strapi. Please open an issue."
          );
          toggleNotification({
            message: formatMessage({
              id: "content-manager.actions.unpublish.error",
              defaultMessage: "An error occurred while trying to unpublish the document."
            }),
            type: "danger"
          });
        }
        await unpublish(
          {
            collectionType,
            model,
            documentId,
            params
          },
          !shouldKeepDraft
        );
      }
    } : void 0,
    variant: "danger",
    position: ["panel", "table-row"]
  };
};
UnpublishAction$1.type = "unpublish";
UnpublishAction$1.position = "panel";
const DiscardAction = ({
  activeTab,
  documentId,
  model,
  collectionType,
  document
}) => {
  const { formatMessage } = useIntl();
  const { schema } = useDoc();
  const canUpdate = useDocumentRBAC("DiscardAction", ({ canUpdate: canUpdate2 }) => canUpdate2);
  const { discard } = useDocumentActions();
  const [{ query }] = useQueryParams();
  const params = React.useMemo(() => buildValidParams(query), [query]);
  if (!schema?.options?.draftAndPublish) {
    return null;
  }
  return {
    disabled: !canUpdate || activeTab === "published" || document?.status !== "modified",
    label: formatMessage({
      id: "content-manager.actions.discard.label",
      defaultMessage: "Discard changes"
    }),
    icon: /* @__PURE__ */ jsx(Cross, {}),
    position: ["panel", "table-row"],
    variant: "danger",
    dialog: {
      type: "dialog",
      title: formatMessage({
        id: "app.components.ConfirmDialog.title",
        defaultMessage: "Confirmation"
      }),
      content: /* @__PURE__ */ jsxs(Flex, { direction: "column", gap: 2, children: [
        /* @__PURE__ */ jsx(WarningCircle, { width: "24px", height: "24px", fill: "danger600" }),
        /* @__PURE__ */ jsx(Typography, { tag: "p", variant: "omega", textAlign: "center", children: formatMessage({
          id: "content-manager.actions.discard.dialog.body",
          defaultMessage: "Are you sure?"
        }) })
      ] }),
      onConfirm: async () => {
        await discard({
          collectionType,
          model,
          documentId,
          params
        });
      }
    }
  };
};
DiscardAction.type = "discard";
DiscardAction.position = "panel";
const DEFAULT_ACTIONS = [PublishAction$1, UpdateAction, UnpublishAction$1, DiscardAction];
const intervals = ["years", "months", "days", "hours", "minutes", "seconds"];
const RelativeTime = React.forwardRef(
  ({ timestamp, customIntervals = [], ...restProps }, forwardedRef) => {
    const { formatRelativeTime, formatDate, formatTime } = useIntl();
    const interval = intervalToDuration({
      start: timestamp,
      end: Date.now()
      // see https://github.com/date-fns/date-fns/issues/2891 – No idea why it's all partial it returns it every time.
    });
    const unit = intervals.find((intervalUnit) => {
      return interval[intervalUnit] > 0 && Object.keys(interval).includes(intervalUnit);
    }) ?? "seconds";
    const relativeTime = isPast(timestamp) ? -interval[unit] : interval[unit];
    const customInterval = customIntervals.find(
      (custom) => interval[custom.unit] < custom.threshold
    );
    const displayText = customInterval ? customInterval.text : formatRelativeTime(relativeTime, unit, { numeric: "auto" });
    return /* @__PURE__ */ jsx(
      "time",
      {
        ref: forwardedRef,
        dateTime: timestamp.toISOString(),
        role: "time",
        title: `${formatDate(timestamp)} ${formatTime(timestamp)}`,
        ...restProps,
        children: displayText
      }
    );
  }
);
const getDisplayName = ({
  firstname,
  lastname,
  username,
  email
} = {}) => {
  if (username) {
    return username;
  }
  if (firstname) {
    return `${firstname} ${lastname ?? ""}`.trim();
  }
  return email ?? "";
};
const capitalise = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const DocumentStatus = ({ status = "draft", size = "S", ...restProps }) => {
  const statusVariant = status === "draft" ? "secondary" : status === "published" ? "success" : "alternative";
  const { formatMessage } = useIntl();
  return /* @__PURE__ */ jsx(Status, { ...restProps, size, variant: statusVariant, children: /* @__PURE__ */ jsx(Typography, { tag: "span", variant: "omega", fontWeight: "bold", children: formatMessage({
    id: `content-manager.containers.List.${status}`,
    defaultMessage: capitalise(status)
  }) }) });
};
const Header = ({ isCreating, status, title: documentTitle = "Untitled" }) => {
  const { formatMessage } = useIntl();
  const isCloning = useMatch(CLONE_PATH) !== null;
  const params = useParams();
  const title = isCreating ? formatMessage({
    id: "content-manager.containers.edit.title.new",
    defaultMessage: "Create an entry"
  }) : documentTitle;
  return /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "flex-start", paddingTop: 6, paddingBottom: 4, gap: 2, children: [
    /* @__PURE__ */ jsx(
      BackButton,
      {
        fallback: params.collectionType === SINGLE_TYPES ? void 0 : `../${COLLECTION_TYPES}/${params.slug}`
      }
    ),
    /* @__PURE__ */ jsxs(Flex, { width: "100%", justifyContent: "space-between", gap: "80px", alignItems: "flex-start", children: [
      /* @__PURE__ */ jsx(Typography, { variant: "alpha", tag: "h1", children: title }),
      /* @__PURE__ */ jsx(HeaderToolbar, {})
    ] }),
    status ? /* @__PURE__ */ jsx(Box, { marginTop: 1, children: /* @__PURE__ */ jsx(DocumentStatus, { status: isCloning ? "draft" : status }) }) : null
  ] });
};
const HeaderToolbar = () => {
  const { formatMessage } = useIntl();
  const isCloning = useMatch(CLONE_PATH) !== null;
  const [
    {
      query: { status = "draft" }
    }
  ] = useQueryParams();
  const { model, id, document, meta, collectionType } = useDoc();
  const plugins = useStrapiApp("HeaderToolbar", (state) => state.plugins);
  return /* @__PURE__ */ jsxs(Flex, { gap: 2, children: [
    /* @__PURE__ */ jsx(
      DescriptionComponentRenderer,
      {
        props: {
          activeTab: status,
          model,
          documentId: id,
          document: isCloning ? void 0 : document,
          meta: isCloning ? void 0 : meta,
          collectionType
        },
        descriptions: plugins["content-manager"].apis.getHeaderActions(),
        children: (actions2) => {
          if (actions2.length > 0) {
            return /* @__PURE__ */ jsx(HeaderActions, { actions: actions2 });
          } else {
            return null;
          }
        }
      }
    ),
    /* @__PURE__ */ jsx(
      DescriptionComponentRenderer,
      {
        props: {
          activeTab: status,
          model,
          documentId: id,
          document: isCloning ? void 0 : document,
          meta: isCloning ? void 0 : meta,
          collectionType
        },
        descriptions: plugins["content-manager"].apis.getDocumentActions("header"),
        children: (actions2) => {
          const headerActions = actions2.filter((action) => {
            const positions = Array.isArray(action.position) ? action.position : [action.position];
            return positions.includes("header");
          });
          return /* @__PURE__ */ jsx(
            DocumentActionsMenu,
            {
              actions: headerActions,
              label: formatMessage({
                id: "content-manager.containers.edit.header.more-actions",
                defaultMessage: "More actions"
              }),
              children: /* @__PURE__ */ jsx(Information, { activeTab: status })
            }
          );
        }
      }
    )
  ] });
};
const Information = ({ activeTab }) => {
  const { formatMessage } = useIntl();
  const { document, meta } = useDoc();
  if (!document || !document.id) {
    return null;
  }
  const createAndUpdateDocument = activeTab === "draft" ? document : meta?.availableStatus.find((status) => status.publishedAt === null);
  const publishDocument = activeTab === "published" ? document : meta?.availableStatus.find((status) => status.publishedAt !== null);
  const creator = createAndUpdateDocument?.[CREATED_BY_ATTRIBUTE_NAME] ? getDisplayName(createAndUpdateDocument[CREATED_BY_ATTRIBUTE_NAME]) : null;
  const updator = createAndUpdateDocument?.[UPDATED_BY_ATTRIBUTE_NAME] ? getDisplayName(createAndUpdateDocument[UPDATED_BY_ATTRIBUTE_NAME]) : null;
  const information = [
    {
      isDisplayed: !!publishDocument?.[PUBLISHED_AT_ATTRIBUTE_NAME],
      label: formatMessage({
        id: "content-manager.containers.edit.information.last-published.label",
        defaultMessage: "Published"
      }),
      value: formatMessage(
        {
          id: "content-manager.containers.edit.information.last-published.value",
          defaultMessage: `{time}{isAnonymous, select, true {} other { by {author}}}`
        },
        {
          time: /* @__PURE__ */ jsx(RelativeTime, { timestamp: new Date(publishDocument?.[PUBLISHED_AT_ATTRIBUTE_NAME]) }),
          isAnonymous: !publishDocument?.[PUBLISHED_BY_ATTRIBUTE_NAME],
          author: publishDocument?.[PUBLISHED_BY_ATTRIBUTE_NAME] ? getDisplayName(publishDocument?.[PUBLISHED_BY_ATTRIBUTE_NAME]) : null
        }
      )
    },
    {
      isDisplayed: !!createAndUpdateDocument?.[UPDATED_AT_ATTRIBUTE_NAME],
      label: formatMessage({
        id: "content-manager.containers.edit.information.last-draft.label",
        defaultMessage: "Updated"
      }),
      value: formatMessage(
        {
          id: "content-manager.containers.edit.information.last-draft.value",
          defaultMessage: `{time}{isAnonymous, select, true {} other { by {author}}}`
        },
        {
          time: /* @__PURE__ */ jsx(
            RelativeTime,
            {
              timestamp: new Date(createAndUpdateDocument?.[UPDATED_AT_ATTRIBUTE_NAME])
            }
          ),
          isAnonymous: !updator,
          author: updator
        }
      )
    },
    {
      isDisplayed: !!createAndUpdateDocument?.[CREATED_AT_ATTRIBUTE_NAME],
      label: formatMessage({
        id: "content-manager.containers.edit.information.document.label",
        defaultMessage: "Created"
      }),
      value: formatMessage(
        {
          id: "content-manager.containers.edit.information.document.value",
          defaultMessage: `{time}{isAnonymous, select, true {} other { by {author}}}`
        },
        {
          time: /* @__PURE__ */ jsx(
            RelativeTime,
            {
              timestamp: new Date(createAndUpdateDocument?.[CREATED_AT_ATTRIBUTE_NAME])
            }
          ),
          isAnonymous: !creator,
          author: creator
        }
      )
    }
  ].filter((info) => info.isDisplayed);
  return /* @__PURE__ */ jsx(
    Flex,
    {
      borderWidth: "1px 0 0 0",
      borderStyle: "solid",
      borderColor: "neutral150",
      direction: "column",
      marginTop: 2,
      tag: "dl",
      padding: 5,
      gap: 3,
      alignItems: "flex-start",
      marginLeft: "-0.4rem",
      marginRight: "-0.4rem",
      width: "calc(100% + 8px)",
      children: information.map((info) => /* @__PURE__ */ jsxs(Flex, { gap: 1, direction: "column", alignItems: "flex-start", children: [
        /* @__PURE__ */ jsx(Typography, { tag: "dt", variant: "pi", fontWeight: "bold", children: info.label }),
        /* @__PURE__ */ jsx(Typography, { tag: "dd", variant: "pi", textColor: "neutral600", children: info.value })
      ] }, info.label))
    }
  );
};
const HeaderActions = ({ actions: actions2 }) => {
  const [dialogId, setDialogId] = React.useState(null);
  const handleClick = (action) => async (e) => {
    if (!("options" in action)) {
      const { onClick = () => false, dialog, id } = action;
      const muteDialog = await onClick(e);
      if (dialog && !muteDialog) {
        e.preventDefault();
        setDialogId(id);
      }
    }
  };
  const handleClose = () => {
    setDialogId(null);
  };
  return /* @__PURE__ */ jsx(Flex, { gap: 1, children: actions2.map((action) => {
    if (action.options) {
      return /* @__PURE__ */ jsx(
        SingleSelect,
        {
          size: "S",
          onChange: action.onSelect,
          "aria-label": action.label,
          ...action,
          children: action.options.map(({ label, ...option }) => /* @__PURE__ */ jsx(SingleSelectOption, { ...option, children: label }, option.value))
        },
        action.id
      );
    } else {
      if (action.type === "icon") {
        return /* @__PURE__ */ jsxs(React.Fragment, { children: [
          /* @__PURE__ */ jsx(
            IconButton,
            {
              disabled: action.disabled,
              label: action.label,
              size: "S",
              onClick: handleClick(action),
              children: action.icon
            }
          ),
          action.dialog ? /* @__PURE__ */ jsx(
            HeaderActionDialog,
            {
              ...action.dialog,
              isOpen: dialogId === action.id,
              onClose: handleClose
            }
          ) : null
        ] }, action.id);
      }
    }
  }) });
};
const HeaderActionDialog = ({
  onClose,
  onCancel,
  title,
  content: Content,
  isOpen
}) => {
  const handleClose = async () => {
    if (onCancel) {
      await onCancel();
    }
    onClose();
  };
  return /* @__PURE__ */ jsx(Dialog.Root, { open: isOpen, onOpenChange: handleClose, children: /* @__PURE__ */ jsxs(Dialog.Content, { children: [
    /* @__PURE__ */ jsx(Dialog.Header, { children: title }),
    typeof Content === "function" ? /* @__PURE__ */ jsx(Content, { onClose: handleClose }) : Content
  ] }) });
};
const ConfigureTheViewAction = ({ collectionType, model }) => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  return {
    label: formatMessage({
      id: "app.links.configure-view",
      defaultMessage: "Configure the view"
    }),
    icon: /* @__PURE__ */ jsx(ListPlus, {}),
    onClick: () => {
      navigate(`../${collectionType}/${model}/configurations/edit`);
    },
    position: "header"
  };
};
ConfigureTheViewAction.type = "configure-the-view";
ConfigureTheViewAction.position = "header";
const EditTheModelAction = ({ model }) => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  return {
    label: formatMessage({
      id: "content-manager.link-to-ctb",
      defaultMessage: "Edit the model"
    }),
    icon: /* @__PURE__ */ jsx(Pencil, {}),
    onClick: () => {
      navigate(`/plugins/content-type-builder/content-types/${model}`);
    },
    position: "header"
  };
};
EditTheModelAction.type = "edit-the-model";
EditTheModelAction.position = "header";
const DeleteAction$1 = ({ documentId, model, collectionType, document }) => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const listViewPathMatch = useMatch(LIST_PATH);
  const canDelete = useDocumentRBAC("DeleteAction", (state) => state.canDelete);
  const { delete: deleteAction } = useDocumentActions();
  const { toggleNotification } = useNotification();
  const setSubmitting = useForm("DeleteAction", (state) => state.setSubmitting);
  const isLocalized = document?.locale != null;
  return {
    disabled: !canDelete || !document,
    label: formatMessage(
      {
        id: "content-manager.actions.delete.label",
        defaultMessage: "Delete entry{isLocalized, select, true { (all locales)} other {}}"
      },
      { isLocalized }
    ),
    icon: /* @__PURE__ */ jsx(Trash, {}),
    dialog: {
      type: "dialog",
      title: formatMessage({
        id: "app.components.ConfirmDialog.title",
        defaultMessage: "Confirmation"
      }),
      content: /* @__PURE__ */ jsxs(Flex, { direction: "column", gap: 2, children: [
        /* @__PURE__ */ jsx(WarningCircle, { width: "24px", height: "24px", fill: "danger600" }),
        /* @__PURE__ */ jsx(Typography, { tag: "p", variant: "omega", textAlign: "center", children: formatMessage({
          id: "content-manager.actions.delete.dialog.body",
          defaultMessage: "Are you sure?"
        }) })
      ] }),
      onConfirm: async () => {
        if (!listViewPathMatch) {
          setSubmitting(true);
        }
        try {
          if (!documentId && collectionType !== SINGLE_TYPES) {
            console.error(
              "You're trying to delete a document without an id, this is likely a bug with Strapi. Please open an issue."
            );
            toggleNotification({
              message: formatMessage({
                id: "content-manager.actions.delete.error",
                defaultMessage: "An error occurred while trying to delete the document."
              }),
              type: "danger"
            });
            return;
          }
          const res = await deleteAction({
            documentId,
            model,
            collectionType,
            params: {
              locale: "*"
            }
          });
          if (!("error" in res)) {
            navigate({ pathname: `../${collectionType}/${model}` }, { replace: true });
          }
        } finally {
          if (!listViewPathMatch) {
            setSubmitting(false);
          }
        }
      }
    },
    variant: "danger",
    position: ["header", "table-row"]
  };
};
DeleteAction$1.type = "delete";
DeleteAction$1.position = ["header", "table-row"];
const DEFAULT_HEADER_ACTIONS = [EditTheModelAction, ConfigureTheViewAction, DeleteAction$1];
const Panels = () => {
  const isCloning = useMatch(CLONE_PATH) !== null;
  const [
    {
      query: { status }
    }
  ] = useQueryParams({
    status: "draft"
  });
  const { model, id, document, meta, collectionType } = useDoc();
  const plugins = useStrapiApp("Panels", (state) => state.plugins);
  const props = {
    activeTab: status,
    model,
    documentId: id,
    document: isCloning ? void 0 : document,
    meta: isCloning ? void 0 : meta,
    collectionType
  };
  return /* @__PURE__ */ jsx(Flex, { direction: "column", alignItems: "stretch", gap: 2, children: /* @__PURE__ */ jsx(
    DescriptionComponentRenderer,
    {
      props,
      descriptions: plugins["content-manager"].apis.getEditViewSidePanels(),
      children: (panels) => panels.map(({ content, id: id2, ...description }) => /* @__PURE__ */ jsx(Panel, { ...description, children: content }, id2))
    }
  ) });
};
const ActionsPanel = () => {
  const { formatMessage } = useIntl();
  return {
    title: formatMessage({
      id: "content-manager.containers.edit.panels.default.title",
      defaultMessage: "Entry"
    }),
    content: /* @__PURE__ */ jsx(ActionsPanelContent, {})
  };
};
ActionsPanel.type = "actions";
const ActionsPanelContent = () => {
  const isCloning = useMatch(CLONE_PATH) !== null;
  const [
    {
      query: { status = "draft" }
    }
  ] = useQueryParams();
  const { model, id, document, meta, collectionType } = useDoc();
  const plugins = useStrapiApp("ActionsPanel", (state) => state.plugins);
  const props = {
    activeTab: status,
    model,
    documentId: id,
    document: isCloning ? void 0 : document,
    meta: isCloning ? void 0 : meta,
    collectionType
  };
  return /* @__PURE__ */ jsxs(Flex, { direction: "column", gap: 2, width: "100%", children: [
    /* @__PURE__ */ jsx(
      DescriptionComponentRenderer,
      {
        props,
        descriptions: plugins["content-manager"].apis.getDocumentActions("panel"),
        children: (actions2) => /* @__PURE__ */ jsx(DocumentActions, { actions: actions2 })
      }
    ),
    /* @__PURE__ */ jsx(InjectionZone, { area: "editView.right-links", slug: model })
  ] });
};
const Panel = React.forwardRef(({ children, title }, ref) => {
  return /* @__PURE__ */ jsxs(
    Flex,
    {
      ref,
      tag: "aside",
      "aria-labelledby": "additional-information",
      background: "neutral0",
      borderColor: "neutral150",
      hasRadius: true,
      paddingBottom: 4,
      paddingLeft: 4,
      paddingRight: 4,
      paddingTop: 4,
      shadow: "tableShadow",
      gap: 3,
      direction: "column",
      justifyContent: "stretch",
      alignItems: "flex-start",
      children: [
        /* @__PURE__ */ jsx(Typography, { tag: "h2", variant: "sigma", textTransform: "uppercase", textColor: "neutral600", children: title }),
        children
      ]
    }
  );
});
const ConfirmBulkActionDialog = ({
  onToggleDialog,
  isOpen = false,
  dialogBody,
  endAction
}) => {
  const { formatMessage } = useIntl();
  return /* @__PURE__ */ jsx(Dialog.Root, { open: isOpen, children: /* @__PURE__ */ jsxs(Dialog.Content, { children: [
    /* @__PURE__ */ jsx(Dialog.Header, { children: formatMessage({
      id: "app.components.ConfirmDialog.title",
      defaultMessage: "Confirmation"
    }) }),
    /* @__PURE__ */ jsx(Dialog.Body, { children: /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "stretch", gap: 2, children: [
      /* @__PURE__ */ jsx(Flex, { justifyContent: "center", children: /* @__PURE__ */ jsx(WarningCircle, { width: "24px", height: "24px", fill: "danger600" }) }),
      dialogBody
    ] }) }),
    /* @__PURE__ */ jsxs(Dialog.Footer, { children: [
      /* @__PURE__ */ jsx(Dialog.Cancel, { children: /* @__PURE__ */ jsx(Button, { fullWidth: true, onClick: onToggleDialog, variant: "tertiary", children: formatMessage({
        id: "app.components.Button.cancel",
        defaultMessage: "Cancel"
      }) }) }),
      endAction
    ] })
  ] }) });
};
const BoldChunk$1 = (chunks) => /* @__PURE__ */ jsx(Typography, { fontWeight: "bold", children: chunks });
const ConfirmDialogPublishAll = ({
  isOpen,
  onToggleDialog,
  isConfirmButtonLoading = false,
  onConfirm
}) => {
  const { formatMessage } = useIntl();
  const selectedEntries = useTable("ConfirmDialogPublishAll", (state) => state.selectedRows);
  const { toggleNotification } = useNotification();
  const { _unstableFormatAPIError: formatAPIError } = useAPIErrorHandler(getTranslation);
  const { model, schema } = useDoc();
  const [{ query }] = useQueryParams();
  const enableDraftRelationsCount = false;
  const {
    data: countDraftRelations = 0,
    isLoading,
    error
  } = useGetManyDraftRelationCountQuery(
    {
      model,
      documentIds: selectedEntries.map((entry) => entry.documentId),
      locale: query?.plugins?.i18n?.locale
    },
    {
      skip: !enableDraftRelationsCount
    }
  );
  React.useEffect(() => {
    if (error) {
      toggleNotification({ type: "danger", message: formatAPIError(error) });
    }
  }, [error, formatAPIError, toggleNotification]);
  if (error) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    ConfirmBulkActionDialog,
    {
      isOpen: isOpen && !isLoading,
      onToggleDialog,
      dialogBody: /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(Typography, { id: "confirm-description", textAlign: "center", children: [
          countDraftRelations > 0 && formatMessage(
            {
              id: getTranslation(`popUpwarning.warning.bulk-has-draft-relations.message`),
              defaultMessage: "<b>{count} {count, plural, one { relation } other { relations } } out of {entities} { entities, plural, one { entry } other { entries } } {count, plural, one { is } other { are } }</b> not published yet and might lead to unexpected behavior. "
            },
            {
              b: BoldChunk$1,
              count: countDraftRelations,
              entities: selectedEntries.length
            }
          ),
          formatMessage({
            id: getTranslation("popUpWarning.bodyMessage.contentType.publish.all"),
            defaultMessage: "Are you sure you want to publish these entries?"
          })
        ] }),
        schema?.pluginOptions && "i18n" in schema.pluginOptions && schema?.pluginOptions.i18n && /* @__PURE__ */ jsx(Typography, { textColor: "danger500", textAlign: "center", children: formatMessage(
          {
            id: getTranslation("Settings.list.actions.publishAdditionalInfos"),
            defaultMessage: "This will publish the active locale versions <em>(from Internationalization)</em>"
          },
          {
            em: Emphasis
          }
        ) })
      ] }),
      endAction: /* @__PURE__ */ jsx(
        Button,
        {
          onClick: onConfirm,
          variant: "secondary",
          startIcon: /* @__PURE__ */ jsx(Check, {}),
          loading: isConfirmButtonLoading,
          children: formatMessage({
            id: "app.utils.publish",
            defaultMessage: "Publish"
          })
        }
      )
    }
  );
};
const TypographyMaxWidth = styled(Typography)`
  max-width: 300px;
`;
const formatErrorMessages = (errors, parentKey, formatMessage) => {
  const messages = [];
  Object.entries(errors).forEach(([key, value]) => {
    const currentKey = parentKey ? `${parentKey}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      if ("id" in value && "defaultMessage" in value) {
        messages.push(
          formatMessage(
            {
              id: `${value.id}.withField`,
              defaultMessage: value.defaultMessage
            },
            { field: currentKey }
          )
        );
      } else {
        messages.push(
          ...formatErrorMessages(
            // @ts-expect-error TODO: check why value is not compatible with FormErrors
            value,
            currentKey,
            formatMessage
          )
        );
      }
    } else {
      messages.push(
        formatMessage(
          {
            id: `${value}.withField`,
            defaultMessage: value
          },
          { field: currentKey }
        )
      );
    }
  });
  return messages;
};
const EntryValidationText = ({ validationErrors, status }) => {
  const { formatMessage } = useIntl();
  if (validationErrors) {
    const validationErrorsMessages = formatErrorMessages(validationErrors, "", formatMessage).join(
      " "
    );
    return /* @__PURE__ */ jsxs(Flex, { gap: 2, children: [
      /* @__PURE__ */ jsx(CrossCircle, { fill: "danger600" }),
      /* @__PURE__ */ jsx(Tooltip, { description: validationErrorsMessages, children: /* @__PURE__ */ jsx(TypographyMaxWidth, { textColor: "danger600", variant: "omega", fontWeight: "semiBold", ellipsis: true, children: validationErrorsMessages }) })
    ] });
  }
  if (status === "published") {
    return /* @__PURE__ */ jsxs(Flex, { gap: 2, children: [
      /* @__PURE__ */ jsx(CheckCircle, { fill: "success600" }),
      /* @__PURE__ */ jsx(Typography, { textColor: "success600", fontWeight: "bold", children: formatMessage({
        id: "content-manager.bulk-publish.already-published",
        defaultMessage: "Already Published"
      }) })
    ] });
  }
  if (status === "modified") {
    return /* @__PURE__ */ jsxs(Flex, { gap: 2, children: [
      /* @__PURE__ */ jsx(ArrowsCounterClockwise, { fill: "alternative600" }),
      /* @__PURE__ */ jsx(Typography, { children: formatMessage({
        id: "content-manager.bulk-publish.modified",
        defaultMessage: "Ready to publish changes"
      }) })
    ] });
  }
  return /* @__PURE__ */ jsxs(Flex, { gap: 2, children: [
    /* @__PURE__ */ jsx(CheckCircle, { fill: "success600" }),
    /* @__PURE__ */ jsx(Typography, { children: formatMessage({
      id: "app.utils.ready-to-publish",
      defaultMessage: "Ready to publish"
    }) })
  ] });
};
const TABLE_HEADERS = [
  { name: "id", label: "id" },
  { name: "name", label: "name" },
  { name: "status", label: "status" },
  { name: "publicationStatus", label: "Publication status" }
];
const SelectedEntriesTableContent = ({
  isPublishing,
  rowsToDisplay = [],
  entriesToPublish = [],
  validationErrors = {}
}) => {
  const { pathname } = useLocation();
  const { formatMessage } = useIntl();
  const {
    list: {
      settings: { mainField }
    }
  } = useDocLayout();
  const shouldDisplayMainField = mainField != null && mainField !== "id";
  return /* @__PURE__ */ jsxs(Table.Content, { children: [
    /* @__PURE__ */ jsxs(Table.Head, { children: [
      /* @__PURE__ */ jsx(Table.HeaderCheckboxCell, {}),
      TABLE_HEADERS.filter((head) => head.name !== "name" || shouldDisplayMainField).map(
        (head) => /* @__PURE__ */ jsx(Table.HeaderCell, { ...head }, head.name)
      )
    ] }),
    /* @__PURE__ */ jsx(Table.Loading, {}),
    /* @__PURE__ */ jsx(Table.Body, { children: rowsToDisplay.map((row, index2) => /* @__PURE__ */ jsxs(Table.Row, { children: [
      /* @__PURE__ */ jsx(Table.CheckboxCell, { id: row.id }),
      /* @__PURE__ */ jsx(Table.Cell, { children: /* @__PURE__ */ jsx(Typography, { children: row.id }) }),
      shouldDisplayMainField && /* @__PURE__ */ jsx(Table.Cell, { children: /* @__PURE__ */ jsx(Typography, { children: row[mainField] }) }),
      /* @__PURE__ */ jsx(Table.Cell, { children: /* @__PURE__ */ jsx(DocumentStatus, { status: row.status, maxWidth: "min-content" }) }),
      /* @__PURE__ */ jsx(Table.Cell, { children: isPublishing && entriesToPublish.includes(row.documentId) ? /* @__PURE__ */ jsxs(Flex, { gap: 2, children: [
        /* @__PURE__ */ jsx(Typography, { children: formatMessage({
          id: "content-manager.success.record.publishing",
          defaultMessage: "Publishing..."
        }) }),
        /* @__PURE__ */ jsx(Loader, { small: true })
      ] }) : /* @__PURE__ */ jsx(
        EntryValidationText,
        {
          validationErrors: validationErrors[row.documentId],
          status: row.status
        }
      ) }),
      /* @__PURE__ */ jsx(Table.Cell, { children: /* @__PURE__ */ jsx(Flex, { children: /* @__PURE__ */ jsx(
        IconButton,
        {
          tag: Link,
          to: {
            pathname: `${pathname}/${row.documentId}`,
            search: row.locale && `?plugins[i18n][locale]=${row.locale}`
          },
          state: { from: pathname },
          label: formatMessage({
            id: "content-manager.bulk-publish.edit",
            defaultMessage: "Edit"
          }),
          target: "_blank",
          marginLeft: "auto",
          variant: "ghost",
          children: /* @__PURE__ */ jsx(Pencil, { width: "1.6rem", height: "1.6rem" })
        }
      ) }) })
    ] }, row.id)) })
  ] });
};
const BoldChunk = (chunks) => /* @__PURE__ */ jsx(Typography, { fontWeight: "bold", children: chunks });
const SelectedEntriesModalContent = ({
  listViewSelectedEntries,
  toggleModal,
  setListViewSelectedDocuments,
  model
}) => {
  const { formatMessage } = useIntl();
  const { schema, components } = useContentTypeSchema(model);
  const documentIds = listViewSelectedEntries.map(({ documentId }) => documentId);
  const [{ query }] = useQueryParams();
  const params = React.useMemo(() => buildValidParams(query), [query]);
  const { data, isLoading, isFetching, refetch } = useGetAllDocumentsQuery(
    {
      model,
      params: {
        page: "1",
        pageSize: documentIds.length.toString(),
        sort: query.sort,
        filters: {
          documentId: {
            $in: documentIds
          }
        },
        locale: query.plugins?.i18n?.locale
      }
    },
    {
      selectFromResult: ({ data: data2, ...restRes }) => ({ data: data2?.results ?? [], ...restRes })
    }
  );
  const { rows, validationErrors } = React.useMemo(() => {
    if (data.length > 0 && schema) {
      const validate = createYupSchema(
        schema.attributes,
        components,
        // Since this is the "Publish" action, the validation
        // schema must enforce the rules for published entities
        { status: "published" }
      );
      const validationErrors2 = {};
      const rows2 = data.map((entry) => {
        try {
          validate.validateSync(entry, { abortEarly: false });
          return entry;
        } catch (e) {
          if (e instanceof ValidationError) {
            validationErrors2[entry.documentId] = getYupValidationErrors(e);
          }
          return entry;
        }
      });
      return { rows: rows2, validationErrors: validationErrors2 };
    }
    return {
      rows: [],
      validationErrors: {}
    };
  }, [components, data, schema]);
  const [publishedCount, setPublishedCount] = React.useState(0);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { publishMany: bulkPublishAction } = useDocumentActions();
  const [, { isLoading: isSubmittingForm }] = usePublishManyDocumentsMutation();
  const selectedRows = useTable("publishAction", (state) => state.selectedRows);
  const selectedEntries = rows.filter(
    (entry) => selectedRows.some((selectedEntry) => selectedEntry.documentId === entry.documentId)
  );
  const entriesToPublish = selectedEntries.filter((entry) => !validationErrors[entry.documentId]).map((entry) => entry.documentId);
  const selectedEntriesWithErrorsCount = selectedEntries.filter(
    ({ documentId }) => validationErrors[documentId]
  ).length;
  const selectedEntriesPublished = selectedEntries.filter(
    ({ status }) => status === "published"
  ).length;
  const selectedEntriesWithNoErrorsCount = selectedEntries.length - selectedEntriesWithErrorsCount - selectedEntriesPublished;
  const toggleDialog = () => setIsDialogOpen((prev) => !prev);
  const handleConfirmBulkPublish = async () => {
    toggleDialog();
    const res = await bulkPublishAction({ model, documentIds: entriesToPublish, params });
    if (!("error" in res)) {
      setPublishedCount(res.count);
      const unpublishedEntries = rows.filter((row) => {
        return !entriesToPublish.includes(row.documentId);
      });
      setListViewSelectedDocuments(unpublishedEntries);
    }
  };
  const getFormattedCountMessage = () => {
    if (publishedCount) {
      return formatMessage(
        {
          id: getTranslation("containers.list.selectedEntriesModal.publishedCount"),
          defaultMessage: "<b>{publishedCount}</b> {publishedCount, plural, =0 {entries} one {entry} other {entries}} published. <b>{withErrorsCount}</b> {withErrorsCount, plural, =0 {entries} one {entry} other {entries}} waiting for action."
        },
        {
          publishedCount,
          withErrorsCount: selectedEntriesWithErrorsCount,
          b: BoldChunk
        }
      );
    }
    return formatMessage(
      {
        id: getTranslation("containers.list.selectedEntriesModal.selectedCount"),
        defaultMessage: "<b>{alreadyPublishedCount}</b> {alreadyPublishedCount, plural, =0 {entries} one {entry} other {entries}} already published. <b>{readyToPublishCount}</b> {readyToPublishCount, plural, =0 {entries} one {entry} other {entries}} ready to publish. <b>{withErrorsCount}</b> {withErrorsCount, plural, =0 {entries} one {entry} other {entries}} waiting for action."
      },
      {
        readyToPublishCount: selectedEntriesWithNoErrorsCount,
        withErrorsCount: selectedEntriesWithErrorsCount,
        alreadyPublishedCount: selectedEntriesPublished,
        b: BoldChunk
      }
    );
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Modal.Body, { children: [
      /* @__PURE__ */ jsx(Typography, { children: getFormattedCountMessage() }),
      /* @__PURE__ */ jsx(Box, { marginTop: 5, children: /* @__PURE__ */ jsx(
        SelectedEntriesTableContent,
        {
          isPublishing: isSubmittingForm,
          rowsToDisplay: rows,
          entriesToPublish,
          validationErrors
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs(Modal.Footer, { children: [
      /* @__PURE__ */ jsx(Button, { onClick: toggleModal, variant: "tertiary", children: formatMessage({
        id: "app.components.Button.cancel",
        defaultMessage: "Cancel"
      }) }),
      /* @__PURE__ */ jsxs(Flex, { gap: 2, children: [
        /* @__PURE__ */ jsx(Button, { onClick: refetch, variant: "tertiary", loading: isFetching, children: formatMessage({ id: "app.utils.refresh", defaultMessage: "Refresh" }) }),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: toggleDialog,
            disabled: selectedEntries.length === 0 || selectedEntries.length === selectedEntriesWithErrorsCount || selectedEntriesPublished === selectedEntries.length || isLoading,
            loading: isSubmittingForm,
            children: formatMessage({ id: "app.utils.publish", defaultMessage: "Publish" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      ConfirmDialogPublishAll,
      {
        isOpen: isDialogOpen,
        onToggleDialog: toggleDialog,
        isConfirmButtonLoading: isSubmittingForm,
        onConfirm: handleConfirmBulkPublish
      }
    )
  ] });
};
const PublishAction = ({ documents, model }) => {
  const { formatMessage } = useIntl();
  const hasPublishPermission = useDocumentRBAC("unpublishAction", (state) => state.canPublish);
  const showPublishButton = hasPublishPermission && documents.some(({ status }) => status !== "published");
  const setListViewSelectedDocuments = useTable("publishAction", (state) => state.selectRow);
  const refetchList = () => {
    contentManagerApi.util.invalidateTags([{ type: "Document", id: `${model}_LIST` }]);
  };
  if (!showPublishButton) return null;
  return {
    actionType: "publish",
    variant: "tertiary",
    label: formatMessage({ id: "app.utils.publish", defaultMessage: "Publish" }),
    dialog: {
      type: "modal",
      title: formatMessage({
        id: getTranslation("containers.ListPage.selectedEntriesModal.title"),
        defaultMessage: "Publish entries"
      }),
      content: ({ onClose }) => {
        return /* @__PURE__ */ jsx(Table.Root, { rows: documents, defaultSelectedRows: documents, headers: TABLE_HEADERS, children: /* @__PURE__ */ jsx(
          SelectedEntriesModalContent,
          {
            listViewSelectedEntries: documents,
            toggleModal: () => {
              onClose();
              refetchList();
            },
            setListViewSelectedDocuments,
            model
          }
        ) });
      },
      onClose: () => {
        refetchList();
      }
    }
  };
};
const BulkActionsRenderer = () => {
  const plugins = useStrapiApp("BulkActionsRenderer", (state) => state.plugins);
  const { model, collectionType } = useDoc();
  const { selectedRows } = useTable("BulkActionsRenderer", (state) => state);
  return /* @__PURE__ */ jsx(Flex, { gap: 2, children: /* @__PURE__ */ jsx(
    DescriptionComponentRenderer,
    {
      props: {
        model,
        collectionType,
        documents: selectedRows
      },
      descriptions: plugins["content-manager"].apis.getBulkActions(),
      children: (actions2) => actions2.map((action) => /* @__PURE__ */ jsx(DocumentActionButton, { ...action }, action.id))
    }
  ) });
};
const DeleteAction = ({ documents, model }) => {
  const { formatMessage } = useIntl();
  const { schema: contentType } = useDoc();
  const selectRow = useTable("DeleteAction", (state) => state.selectRow);
  const hasI18nEnabled = Boolean(contentType?.pluginOptions?.i18n);
  const [{ query }] = useQueryParams();
  const params = React.useMemo(() => buildValidParams(query), [query]);
  const hasDeletePermission = useDocumentRBAC("deleteAction", (state) => state.canDelete);
  const { deleteMany: bulkDeleteAction } = useDocumentActions();
  const documentIds = documents.map(({ documentId }) => documentId);
  const handleConfirmBulkDelete = async () => {
    const res = await bulkDeleteAction({
      documentIds,
      model,
      params
    });
    if (!("error" in res)) {
      selectRow([]);
    }
  };
  if (!hasDeletePermission) return null;
  return {
    variant: "danger-light",
    label: formatMessage({ id: "global.delete", defaultMessage: "Delete" }),
    dialog: {
      type: "dialog",
      title: formatMessage({
        id: "app.components.ConfirmDialog.title",
        defaultMessage: "Confirmation"
      }),
      content: /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "stretch", gap: 2, children: [
        /* @__PURE__ */ jsx(Flex, { justifyContent: "center", children: /* @__PURE__ */ jsx(WarningCircle, { width: "24px", height: "24px", fill: "danger600" }) }),
        /* @__PURE__ */ jsx(Typography, { id: "confirm-description", textAlign: "center", children: formatMessage({
          id: "popUpWarning.bodyMessage.contentType.delete.all",
          defaultMessage: "Are you sure you want to delete these entries?"
        }) }),
        hasI18nEnabled && /* @__PURE__ */ jsx(Box, { textAlign: "center", padding: 3, children: /* @__PURE__ */ jsx(Typography, { textColor: "danger500", children: formatMessage(
          {
            id: getTranslation("Settings.list.actions.deleteAdditionalInfos"),
            defaultMessage: "This will delete the active locale versions <em>(from Internationalization)</em>"
          },
          {
            em: Emphasis
          }
        ) }) })
      ] }),
      onConfirm: handleConfirmBulkDelete
    }
  };
};
DeleteAction.type = "delete";
const UnpublishAction = ({ documents, model }) => {
  const { formatMessage } = useIntl();
  const { schema } = useDoc();
  const selectRow = useTable("UnpublishAction", (state) => state.selectRow);
  const hasPublishPermission = useDocumentRBAC("unpublishAction", (state) => state.canPublish);
  const hasI18nEnabled = Boolean(schema?.pluginOptions?.i18n);
  const hasDraftAndPublishEnabled = Boolean(schema?.options?.draftAndPublish);
  const { unpublishMany: bulkUnpublishAction } = useDocumentActions();
  const documentIds = documents.map(({ documentId }) => documentId);
  const [{ query }] = useQueryParams();
  const params = React.useMemo(() => buildValidParams(query), [query]);
  const handleConfirmBulkUnpublish = async () => {
    const data = await bulkUnpublishAction({ documentIds, model, params });
    if (!("error" in data)) {
      selectRow([]);
    }
  };
  const showUnpublishButton = hasDraftAndPublishEnabled && hasPublishPermission && documents.some((entry) => entry.status === "published" || entry.status === "modified");
  if (!showUnpublishButton) return null;
  return {
    variant: "tertiary",
    label: formatMessage({ id: "app.utils.unpublish", defaultMessage: "Unpublish" }),
    dialog: {
      type: "dialog",
      title: formatMessage({
        id: "app.components.ConfirmDialog.title",
        defaultMessage: "Confirmation"
      }),
      content: /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "stretch", gap: 2, children: [
        /* @__PURE__ */ jsx(Flex, { justifyContent: "center", children: /* @__PURE__ */ jsx(WarningCircle, { width: "24px", height: "24px", fill: "danger600" }) }),
        /* @__PURE__ */ jsx(Typography, { id: "confirm-description", textAlign: "center", children: formatMessage({
          id: "popUpWarning.bodyMessage.contentType.unpublish.all",
          defaultMessage: "Are you sure you want to unpublish these entries?"
        }) }),
        hasI18nEnabled && /* @__PURE__ */ jsx(Box, { textAlign: "center", padding: 3, children: /* @__PURE__ */ jsx(Typography, { textColor: "danger500", children: formatMessage(
          {
            id: getTranslation("Settings.list.actions.unpublishAdditionalInfos"),
            defaultMessage: "This will unpublish the active locale versions <em>(from Internationalization)</em>"
          },
          {
            em: Emphasis
          }
        ) }) })
      ] }),
      confirmButton: formatMessage({
        id: "app.utils.unpublish",
        defaultMessage: "Unpublish"
      }),
      onConfirm: handleConfirmBulkUnpublish
    }
  };
};
UnpublishAction.type = "unpublish";
const Emphasis = (chunks) => /* @__PURE__ */ jsx(Typography, { fontWeight: "semiBold", textColor: "danger500", children: chunks });
const DEFAULT_BULK_ACTIONS = [PublishAction, UnpublishAction, DeleteAction];
const AutoCloneFailureModalBody = ({ prohibitedFields }) => {
  const { formatMessage } = useIntl();
  const getDefaultErrorMessage = (reason) => {
    switch (reason) {
      case "relation":
        return "Duplicating the relation could remove it from the original entry.";
      case "unique":
        return "Identical values in a unique field are not allowed";
      default:
        return reason;
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Typography, { variant: "beta", children: formatMessage({
      id: getTranslation("containers.list.autoCloneModal.title"),
      defaultMessage: "This entry can't be duplicated directly."
    }) }),
    /* @__PURE__ */ jsx(Box, { marginTop: 2, children: /* @__PURE__ */ jsx(Typography, { textColor: "neutral600", children: formatMessage({
      id: getTranslation("containers.list.autoCloneModal.description"),
      defaultMessage: "A new entry will be created with the same content, but you'll have to change the following fields to save it."
    }) }) }),
    /* @__PURE__ */ jsx(Flex, { marginTop: 6, gap: 2, direction: "column", alignItems: "stretch", children: prohibitedFields.map(([fieldPath, reason]) => /* @__PURE__ */ jsxs(
      Flex,
      {
        direction: "column",
        gap: 2,
        alignItems: "flex-start",
        borderColor: "neutral200",
        hasRadius: true,
        padding: 6,
        children: [
          /* @__PURE__ */ jsx(Flex, { direction: "row", tag: "ol", children: fieldPath.map((pathSegment, index2) => /* @__PURE__ */ jsxs(Typography, { fontWeight: "semiBold", tag: "li", children: [
            pathSegment,
            index2 !== fieldPath.length - 1 && /* @__PURE__ */ jsx(
              ChevronRight,
              {
                fill: "neutral500",
                height: "0.8rem",
                width: "0.8rem",
                style: { margin: "0 0.8rem" }
              }
            )
          ] }, index2)) }),
          /* @__PURE__ */ jsx(Typography, { tag: "p", textColor: "neutral600", children: formatMessage({
            id: getTranslation(`containers.list.autoCloneModal.error.${reason}`),
            defaultMessage: getDefaultErrorMessage(reason)
          }) })
        ]
      },
      fieldPath.join()
    )) })
  ] });
};
const TableActions = ({ document }) => {
  const { formatMessage } = useIntl();
  const { model, collectionType } = useDoc();
  const plugins = useStrapiApp("TableActions", (state) => state.plugins);
  const props = {
    activeTab: null,
    model,
    documentId: document.documentId,
    collectionType,
    document
  };
  return /* @__PURE__ */ jsx(
    DescriptionComponentRenderer,
    {
      props,
      descriptions: plugins["content-manager"].apis.getDocumentActions("table-row").filter((action) => action.name !== "PublishAction"),
      children: (actions2) => {
        const tableRowActions = actions2.filter((action) => {
          const positions = Array.isArray(action.position) ? action.position : [action.position];
          return positions.includes("table-row");
        });
        return /* @__PURE__ */ jsx(
          DocumentActionsMenu,
          {
            actions: tableRowActions,
            label: formatMessage({
              id: "content-manager.containers.list.table.row-actions",
              defaultMessage: "Row action"
            }),
            variant: "ghost"
          }
        );
      }
    }
  );
};
const EditAction = ({ documentId }) => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { canRead } = useDocumentRBAC("EditAction", ({ canRead: canRead2 }) => ({ canRead: canRead2 }));
  const { toggleNotification } = useNotification();
  const [{ query }] = useQueryParams();
  return {
    disabled: !canRead,
    icon: /* @__PURE__ */ jsx(StyledPencil, {}),
    label: formatMessage({
      id: "content-manager.actions.edit.label",
      defaultMessage: "Edit"
    }),
    position: "table-row",
    onClick: async () => {
      if (!documentId) {
        console.error(
          "You're trying to edit a document without an id, this is likely a bug with Strapi. Please open an issue."
        );
        toggleNotification({
          message: formatMessage({
            id: "content-manager.actions.edit.error",
            defaultMessage: "An error occurred while trying to edit the document."
          }),
          type: "danger"
        });
        return;
      }
      navigate({
        pathname: documentId,
        search: stringify({
          plugins: query.plugins
        })
      });
    }
  };
};
EditAction.type = "edit";
EditAction.position = "table-row";
const StyledPencil = styled(Pencil)`
  path {
    fill: currentColor;
  }
`;
const CloneAction = ({ model, documentId }) => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { canCreate } = useDocumentRBAC("CloneAction", ({ canCreate: canCreate2 }) => ({ canCreate: canCreate2 }));
  const { toggleNotification } = useNotification();
  const { autoClone } = useDocumentActions();
  const [prohibitedFields, setProhibitedFields] = React.useState([]);
  return {
    disabled: !canCreate,
    icon: /* @__PURE__ */ jsx(StyledDuplicate, {}),
    label: formatMessage({
      id: "content-manager.actions.clone.label",
      defaultMessage: "Duplicate"
    }),
    position: "table-row",
    onClick: async () => {
      if (!documentId) {
        console.error(
          "You're trying to clone a document in the table without an id, this is likely a bug with Strapi. Please open an issue."
        );
        toggleNotification({
          message: formatMessage({
            id: "content-manager.actions.clone.error",
            defaultMessage: "An error occurred while trying to clone the document."
          }),
          type: "danger"
        });
        return;
      }
      const res = await autoClone({ model, sourceId: documentId });
      if ("data" in res) {
        navigate(res.data.documentId);
        return true;
      }
      if (isBaseQueryError(res.error) && res.error.details && typeof res.error.details === "object" && "prohibitedFields" in res.error.details && Array.isArray(res.error.details.prohibitedFields)) {
        const prohibitedFields2 = res.error.details.prohibitedFields;
        setProhibitedFields(prohibitedFields2);
      }
    },
    dialog: {
      type: "modal",
      title: formatMessage({
        id: "content-manager.containers.list.autoCloneModal.header",
        defaultMessage: "Duplicate"
      }),
      content: /* @__PURE__ */ jsx(AutoCloneFailureModalBody, { prohibitedFields }),
      footer: ({ onClose }) => {
        return /* @__PURE__ */ jsxs(Modal.Footer, { children: [
          /* @__PURE__ */ jsx(Button, { onClick: onClose, variant: "tertiary", children: formatMessage({
            id: "cancel",
            defaultMessage: "Cancel"
          }) }),
          /* @__PURE__ */ jsx(
            LinkButton,
            {
              tag: NavLink,
              to: {
                pathname: `clone/${documentId}`
              },
              children: formatMessage({
                id: "content-manager.containers.list.autoCloneModal.create",
                defaultMessage: "Create"
              })
            }
          )
        ] });
      }
    }
  };
};
CloneAction.type = "clone";
CloneAction.position = "table-row";
const StyledDuplicate = styled(Duplicate)`
  path {
    fill: currentColor;
  }
`;
const DEFAULT_TABLE_ROW_ACTIONS = [EditAction, CloneAction];
class ContentManagerPlugin {
  /**
   * The following properties are the stored ones provided by any plugins registering with
   * the content-manager. The function calls however, need to be called at runtime in the
   * application, so instead we collate them and run them later with the complete list incl.
   * ones already registered & the context of the view.
   */
  bulkActions = [...DEFAULT_BULK_ACTIONS];
  documentActions = [
    ...DEFAULT_ACTIONS,
    ...DEFAULT_TABLE_ROW_ACTIONS,
    ...DEFAULT_HEADER_ACTIONS
  ];
  editViewSidePanels = [ActionsPanel];
  headerActions = [];
  constructor() {
  }
  addEditViewSidePanel(panels) {
    if (Array.isArray(panels)) {
      this.editViewSidePanels = [...this.editViewSidePanels, ...panels];
    } else if (typeof panels === "function") {
      this.editViewSidePanels = panels(this.editViewSidePanels);
    } else {
      throw new Error(
        `Expected the \`panels\` passed to \`addEditViewSidePanel\` to be an array or a function, but received ${getPrintableType(
          panels
        )}`
      );
    }
  }
  addDocumentAction(actions2) {
    if (Array.isArray(actions2)) {
      this.documentActions = [...this.documentActions, ...actions2];
    } else if (typeof actions2 === "function") {
      this.documentActions = actions2(this.documentActions);
    } else {
      throw new Error(
        `Expected the \`actions\` passed to \`addDocumentAction\` to be an array or a function, but received ${getPrintableType(
          actions2
        )}`
      );
    }
  }
  addDocumentHeaderAction(actions2) {
    if (Array.isArray(actions2)) {
      this.headerActions = [...this.headerActions, ...actions2];
    } else if (typeof actions2 === "function") {
      this.headerActions = actions2(this.headerActions);
    } else {
      throw new Error(
        `Expected the \`actions\` passed to \`addDocumentHeaderAction\` to be an array or a function, but received ${getPrintableType(
          actions2
        )}`
      );
    }
  }
  addBulkAction(actions2) {
    if (Array.isArray(actions2)) {
      this.bulkActions = [...this.bulkActions, ...actions2];
    } else if (typeof actions2 === "function") {
      this.bulkActions = actions2(this.bulkActions);
    } else {
      throw new Error(
        `Expected the \`actions\` passed to \`addBulkAction\` to be an array or a function, but received ${getPrintableType(
          actions2
        )}`
      );
    }
  }
  get config() {
    return {
      id: PLUGIN_ID,
      name: "Content Manager",
      injectionZones: INJECTION_ZONES,
      apis: {
        addBulkAction: this.addBulkAction.bind(this),
        addDocumentAction: this.addDocumentAction.bind(this),
        addDocumentHeaderAction: this.addDocumentHeaderAction.bind(this),
        addEditViewSidePanel: this.addEditViewSidePanel.bind(this),
        getBulkActions: () => this.bulkActions,
        getDocumentActions: (position) => {
          if (position) {
            return this.documentActions.filter(
              (action) => action.position == void 0 || [action.position].flat().includes(position)
            );
          }
          return this.documentActions;
        },
        getEditViewSidePanels: () => this.editViewSidePanels,
        getHeaderActions: () => this.headerActions
      }
    };
  }
}
const getPrintableType = (value) => {
  const nativeType = typeof value;
  if (nativeType === "object") {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    if (value instanceof Object && value.constructor.name !== "Object") {
      return value.constructor.name;
    }
  }
  return nativeType;
};
const HistoryAction = ({ model, document }) => {
  const { formatMessage } = useIntl();
  const [{ query }] = useQueryParams();
  const navigate = useNavigate();
  const { trackUsage } = useTracking();
  const { pathname } = useLocation();
  const pluginsQueryParams = stringify({ plugins: query.plugins }, { encode: false });
  if (!window.strapi.features.isEnabled("cms-content-history")) {
    return null;
  }
  const handleOnClick = () => {
    const destination = { pathname: "history", search: pluginsQueryParams };
    trackUsage("willNavigate", {
      from: pathname,
      to: `${pathname}/${destination.pathname}`
    });
    navigate(destination);
  };
  return {
    icon: /* @__PURE__ */ jsx(ClockCounterClockwise, {}),
    label: formatMessage({
      id: "content-manager.history.document-action",
      defaultMessage: "Content History"
    }),
    onClick: handleOnClick,
    disabled: (
      /**
       * The user is creating a new document.
       * It hasn't been saved yet, so there's no history to go to
       */
      !document || /**
      * The document has been created but the current dimension has never been saved.
      * For example, the user is creating a new locale in an existing document,
      * so there's no history for the document in that locale
      */
      !document.id || /**
      * History is only available for content types created by the user.
      * These have the `api::` prefix, as opposed to the ones created by Strapi or plugins,
      * which start with `admin::` or `plugin::`
      */
      !model.startsWith("api::")
    ),
    position: "header"
  };
};
HistoryAction.type = "history";
HistoryAction.position = "header";
const historyAdmin = {
  bootstrap(app) {
    const { addDocumentAction } = app.getPlugin("content-manager").apis;
    addDocumentAction((actions2) => {
      const indexOfDeleteAction = actions2.findIndex((action) => action.type === "delete");
      actions2.splice(indexOfDeleteAction, 0, HistoryAction);
      return actions2;
    });
  }
};
const initialState = {
  collectionTypeLinks: [],
  components: [],
  fieldSizes: {},
  models: [],
  singleTypeLinks: [],
  isLoading: true
};
const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setInitialData(state, action) {
      const {
        authorizedCollectionTypeLinks,
        authorizedSingleTypeLinks,
        components,
        contentTypeSchemas,
        fieldSizes
      } = action.payload;
      state.collectionTypeLinks = authorizedCollectionTypeLinks.filter(
        ({ isDisplayed }) => isDisplayed
      );
      state.singleTypeLinks = authorizedSingleTypeLinks.filter(({ isDisplayed }) => isDisplayed);
      state.components = components;
      state.models = contentTypeSchemas;
      state.fieldSizes = fieldSizes;
      state.isLoading = false;
    }
  }
});
const { actions, reducer: reducer$1 } = appSlice;
const { setInitialData } = actions;
const reducer = combineReducers({
  app: reducer$1
});
const previewApi = contentManagerApi.injectEndpoints({
  endpoints: (builder) => ({
    getPreviewUrl: builder.query({
      query({ query, params }) {
        return {
          url: `/content-manager/preview/url/${params.contentType}`,
          method: "GET",
          config: {
            params: query
          }
        };
      }
    })
  })
});
const { useGetPreviewUrlQuery } = previewApi;
const ConditionalTooltip = ({ isShown, label, children }) => {
  if (isShown) {
    return /* @__PURE__ */ jsx(Tooltip, { label, children });
  }
  return children;
};
const PreviewSidePanel = ({ model, documentId, document }) => {
  const { formatMessage } = useIntl();
  const { trackUsage } = useTracking();
  const { pathname } = useLocation();
  const [{ query }] = useQueryParams();
  const isModified = useForm("PreviewSidePanel", (state) => state.modified);
  const { data, error } = useGetPreviewUrlQuery({
    params: {
      contentType: model
    },
    query: {
      documentId,
      locale: document?.locale,
      status: document?.status
    }
  });
  if (!data?.data?.url || error) {
    return null;
  }
  const trackNavigation = () => {
    const destinationPathname = pathname.replace(/\/$/, "") + "/preview";
    trackUsage("willNavigate", { from: pathname, to: destinationPathname });
  };
  return {
    title: formatMessage({ id: "content-manager.preview.panel.title", defaultMessage: "Preview" }),
    content: /* @__PURE__ */ jsx(Flex, { gap: 2, width: "100%", children: /* @__PURE__ */ jsx(
      ConditionalTooltip,
      {
        label: formatMessage({
          id: "content-manager.preview.panel.button-disabled-tooltip",
          defaultMessage: "Please save to open the preview"
        }),
        isShown: isModified,
        children: /* @__PURE__ */ jsx(
          Button,
          {
            variant: "tertiary",
            tag: Link,
            to: { pathname: "preview", search: stringify(query, { encode: false }) },
            onClick: trackNavigation,
            flex: "auto",
            disabled: isModified,
            children: formatMessage({
              id: "content-manager.preview.panel.button",
              defaultMessage: "Open preview"
            })
          }
        )
      }
    ) })
  };
};
const FEATURE_ID = "preview";
const previewAdmin = {
  bootstrap(app) {
    if (!window.strapi.future.isEnabled(FEATURE_ID)) {
      return;
    }
    const contentManagerPluginApis = app.getPlugin("content-manager").apis;
    contentManagerPluginApis.addEditViewSidePanel([PreviewSidePanel]);
  }
};
const index = {
  register(app) {
    const cm = new ContentManagerPlugin();
    app.addReducers({
      [PLUGIN_ID]: reducer
    });
    app.addMenuLink({
      to: PLUGIN_ID,
      icon: Feather,
      intlLabel: {
        id: `content-manager.plugin.name`,
        defaultMessage: "Content Manager"
      },
      permissions: [],
      position: 1
    });
    app.router.addRoute({
      path: "content-manager/*",
      lazy: async () => {
        const { Layout } = await import("./layout-CUTOYU8I.mjs");
        return {
          Component: Layout
        };
      },
      children: routes
    });
    app.registerPlugin(cm.config);
  },
  bootstrap(app) {
    if (typeof historyAdmin.bootstrap === "function") {
      historyAdmin.bootstrap(app);
    }
    if (typeof previewAdmin.bootstrap === "function") {
      previewAdmin.bootstrap(app);
    }
  },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/ar.json": () => import("./ar-CCEVvqGG.mjs"), "./translations/ca.json": () => import("./ca-5U32ON2v.mjs"), "./translations/cs.json": () => import("./cs-CM2aBUar.mjs"), "./translations/de.json": () => import("./de-C72KDNOl.mjs"), "./translations/en.json": () => import("./en-Dtk_ot79.mjs"), "./translations/es.json": () => import("./es-D34tqjMw.mjs"), "./translations/eu.json": () => import("./eu-CdALomew.mjs"), "./translations/fr.json": () => import("./fr--pg5jUbt.mjs"), "./translations/gu.json": () => import("./gu-CNpaMDpH.mjs"), "./translations/hi.json": () => import("./hi-Dwvd04m3.mjs"), "./translations/hu.json": () => import("./hu-CeYvaaO0.mjs"), "./translations/id.json": () => import("./id-BtwA9WJT.mjs"), "./translations/it.json": () => import("./it-BrVPqaf1.mjs"), "./translations/ja.json": () => import("./ja-BHqhDq4V.mjs"), "./translations/ko.json": () => import("./ko-HVQRlfUI.mjs"), "./translations/ml.json": () => import("./ml-BihZwQit.mjs"), "./translations/ms.json": () => import("./ms-m_WjyWx7.mjs"), "./translations/nl.json": () => import("./nl-D4R9gHx5.mjs"), "./translations/pl.json": () => import("./pl-sbx9mSt_.mjs"), "./translations/pt-BR.json": () => import("./pt-BR-C71iDxnh.mjs"), "./translations/pt.json": () => import("./pt-BsaFvS8-.mjs"), "./translations/ru.json": () => import("./ru-BE6A4Exp.mjs"), "./translations/sa.json": () => import("./sa-Dag0k-Z8.mjs"), "./translations/sk.json": () => import("./sk-BFg-R8qJ.mjs"), "./translations/sv.json": () => import("./sv-CUnfWGsh.mjs"), "./translations/th.json": () => import("./th-BqbI8lIT.mjs"), "./translations/tr.json": () => import("./tr-CgeK3wJM.mjs"), "./translations/uk.json": () => import("./uk-CR-zDhAY.mjs"), "./translations/vi.json": () => import("./vi-DUXIk_fw.mjs"), "./translations/zh-Hans.json": () => import("./zh-Hans-BPQcRIyH.mjs"), "./translations/zh.json": () => import("./zh-BWZspA60.mjs") }), `./translations/${locale}.json`, 3).then(({ default: data }) => {
          return {
            data: prefixPluginTranslations(data, PLUGIN_ID),
            locale
          };
        }).catch(() => {
          return {
            data: {},
            locale
          };
        });
      })
    );
    return Promise.resolve(importedTrads);
  }
};
export {
  ATTRIBUTE_TYPES_THAT_CANNOT_BE_MAIN_FIELD as A,
  BulkActionsRenderer as B,
  COLLECTION_TYPES as C,
  DocumentStatus as D,
  extractContentTypeComponents as E,
  DEFAULT_SETTINGS as F,
  convertEditLayoutToFieldLayouts as G,
  HOOKS as H,
  InjectionZone as I,
  useDocument as J,
  useGetPreviewUrlQuery as K,
  index as L,
  useContentManagerContext as M,
  useDocumentActions as N,
  Panels as P,
  RelativeTime as R,
  SINGLE_TYPES as S,
  TableActions as T,
  useGetInitialDataQuery as a,
  useGetAllContentTypeSettingsQuery as b,
  useDoc as c,
  buildValidParams as d,
  contentManagerApi as e,
  useDocumentRBAC as f,
  getTranslation as g,
  useDocumentLayout as h,
  createYupSchema as i,
  Header as j,
  PERMISSIONS as k,
  DocumentRBAC as l,
  DOCUMENT_META_FIELDS as m,
  CLONE_PATH as n,
  useDocLayout as o,
  useGetContentTypeConfigurationQuery as p,
  CREATOR_FIELDS as q,
  getMainField as r,
  setInitialData as s,
  getDisplayName as t,
  useContentTypeSchema as u,
  checkIfAttributeIsDisplayable as v,
  useGetAllDocumentsQuery as w,
  convertListLayoutToFieldLayouts as x,
  capitalise as y,
  useUpdateContentTypeConfigurationMutation as z
};
//# sourceMappingURL=index-ByPZ754U.mjs.map
