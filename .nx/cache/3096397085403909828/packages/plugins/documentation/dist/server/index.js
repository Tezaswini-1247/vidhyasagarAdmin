"use strict";
const path = require("path");
const koaStatic = require("koa-static");
const swaggerUi = require("swagger-ui-dist");
const fs = require("fs-extra");
const immer = require("immer");
const _ = require("lodash");
const pathToRegexp = require("path-to-regexp");
const bcrypt = require("bcryptjs");
const utils = require("@strapi/utils");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
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
const path__default = /* @__PURE__ */ _interopDefault(path);
const koaStatic__default = /* @__PURE__ */ _interopDefault(koaStatic);
const swaggerUi__default = /* @__PURE__ */ _interopDefault(swaggerUi);
const fs__default = /* @__PURE__ */ _interopDefault(fs);
const ___default = /* @__PURE__ */ _interopDefault(_);
const pathToRegexp__namespace = /* @__PURE__ */ _interopNamespace(pathToRegexp);
const bcrypt__default = /* @__PURE__ */ _interopDefault(bcrypt);
const getService = (name, { strapi: strapi2 } = { strapi: global.strapi }) => {
  return strapi2.plugin("documentation").service(name);
};
const RBAC_ACTIONS = [
  {
    section: "plugins",
    displayName: "Access the Documentation",
    uid: "read",
    pluginName: "documentation"
  },
  {
    section: "plugins",
    displayName: "Update and delete",
    uid: "settings.update",
    pluginName: "documentation"
  },
  {
    section: "plugins",
    displayName: "Regenerate",
    uid: "settings.regenerate",
    pluginName: "documentation"
  },
  {
    section: "settings",
    displayName: "Access the documentation settings page",
    uid: "settings.read",
    pluginName: "documentation",
    category: "documentation"
  }
];
async function bootstrap({ strapi: strapi2 }) {
  await strapi2.service("admin::permission").actionProvider.registerMany(RBAC_ACTIONS);
  const pluginStore = strapi2.store({
    environment: "",
    type: "plugin",
    name: "documentation"
  });
  const config2 = await pluginStore.get({ key: "config" });
  if (!config2) {
    pluginStore.set({ key: "config", value: { restrictedAccess: false } });
  }
  await getService("documentation").generateFullDoc();
}
const addDocumentMiddlewares = async ({ strapi: strapi2 }) => {
  strapi2.server.routes([
    {
      method: "GET",
      path: "/plugins/documentation/(.*)",
      async handler(ctx, next) {
        ctx.url = path__default.default.basename(ctx.url);
        return koaStatic__default.default(swaggerUi__default.default.getAbsoluteFSPath(), {
          maxage: 864e5,
          defer: true
        })(ctx, next);
      },
      config: {
        auth: false
      }
    }
  ]);
};
async function register({ strapi: strapi2 }) {
  await addDocumentMiddlewares({ strapi: strapi2 });
}
const pascalCase = (string) => {
  return ___default.default.upperFirst(___default.default.camelCase(string));
};
const params = [
  {
    name: "sort",
    in: "query",
    description: "Sort by attributes ascending (asc) or descending (desc)",
    deprecated: false,
    required: false,
    schema: {
      type: "string"
    }
  },
  {
    name: "pagination[withCount]",
    in: "query",
    description: "Return page/pageSize (default: true)",
    deprecated: false,
    required: false,
    schema: {
      type: "boolean"
    }
  },
  {
    name: "pagination[page]",
    in: "query",
    description: "Page number (default: 0)",
    deprecated: false,
    required: false,
    schema: {
      type: "integer"
    }
  },
  {
    name: "pagination[pageSize]",
    in: "query",
    description: "Page size (default: 25)",
    deprecated: false,
    required: false,
    schema: {
      type: "integer"
    }
  },
  {
    name: "pagination[start]",
    in: "query",
    description: "Offset value (default: 0)",
    deprecated: false,
    required: false,
    schema: {
      type: "integer"
    }
  },
  {
    name: "pagination[limit]",
    in: "query",
    description: "Number of entities to return (default: 25)",
    deprecated: false,
    required: false,
    schema: {
      type: "integer"
    }
  },
  {
    name: "fields",
    in: "query",
    description: "Fields to return (ex: title,author)",
    deprecated: false,
    required: false,
    schema: {
      type: "string"
    }
  },
  {
    name: "populate",
    in: "query",
    description: "Relations to return",
    deprecated: false,
    required: false,
    schema: {
      type: "string"
    }
  },
  {
    name: "filters",
    in: "query",
    description: "Filters to apply",
    deprecated: false,
    required: false,
    schema: {
      type: "object",
      additionalProperties: true
    },
    style: "deepObject"
  },
  {
    name: "locale",
    in: "query",
    description: "Locale to apply",
    deprecated: false,
    required: false,
    schema: {
      type: "string"
    }
  }
];
const loopContentTypeNames = (api, callback) => {
  let result = {};
  for (const contentTypeName of api.ctNames) {
    const uid = `${api.getter}::${api.name}.${contentTypeName}`;
    const { attributes, info: contentTypeInfo, kind } = strapi.contentType(uid);
    const routeInfo = api.getter === "plugin" ? (
      // @ts-expect-error – TODO: fix this
      strapi.plugin(api.name).routes["content-api"]
    ) : strapi.api(api.name).routes[contentTypeName];
    if (!routeInfo) {
      continue;
    }
    const apiName = ___default.default.upperFirst(api.name);
    const uniqueName = api.name === contentTypeName ? apiName : `${apiName} - ${___default.default.upperFirst(contentTypeName)}`;
    const apiInfo = {
      ...api,
      routeInfo,
      attributes,
      uniqueName,
      contentTypeInfo,
      kind
    };
    result = {
      ...result,
      ...callback(apiInfo)
    };
  }
  return result;
};
const getApiResponse = ({
  uniqueName,
  route,
  isListOfEntities = false
}) => {
  const getSchema = () => {
    if (route.method === "DELETE") {
      return {
        type: "integer",
        format: "int64"
      };
    }
    if (isListOfEntities) {
      return { $ref: `#/components/schemas/${pascalCase(uniqueName)}ListResponse` };
    }
    return { $ref: `#/components/schemas/${pascalCase(uniqueName)}Response` };
  };
  const schema = getSchema();
  return {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema
        }
      }
    },
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Error"
          }
        }
      }
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Error"
          }
        }
      }
    },
    403: {
      description: "Forbidden",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Error"
          }
        }
      }
    },
    404: {
      description: "Not Found",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Error"
          }
        }
      }
    },
    500: {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Error"
          }
        }
      }
    }
  };
};
const hasFindMethod = (handler) => {
  if (typeof handler === "string") {
    return handler.split(".").pop() === "find";
  }
  return false;
};
const parsePathWithVariables = (routePath) => {
  return pathToRegexp__namespace.parse(routePath).map((token) => {
    if (___default.default.isObject(token)) {
      return `${token.prefix}{${token.name}}`;
    }
    return token;
  }).join("");
};
const getPathParams = (routePath) => {
  return pathToRegexp__namespace.parse(routePath).reduce((acc, param) => {
    if (!(typeof param === "object")) {
      return acc;
    }
    acc.push({
      name: `${param.name}`,
      in: "path",
      description: "",
      deprecated: false,
      required: true,
      schema: { type: "number" }
    });
    return acc;
  }, []);
};
const getPathWithPrefix = (prefix, route) => {
  if (prefix && !___default.default.has(route.config, "prefix")) {
    return prefix.concat(route.path);
  }
  return route.path;
};
const getPaths = ({ routeInfo, uniqueName, contentTypeInfo, kind }) => {
  const contentTypeRoutes = routeInfo.routes.filter((route) => {
    return route.path.includes(contentTypeInfo.pluralName) || route.path.includes(contentTypeInfo.singularName);
  });
  const paths = contentTypeRoutes.reduce((acc, route) => {
    const isListOfEntities = hasFindMethod(route.handler);
    const methodVerb = route.method.toLowerCase();
    const hasPathParams = route.path.includes("/:");
    const pathWithPrefix = getPathWithPrefix(routeInfo.prefix, route);
    const routePath = hasPathParams ? parsePathWithVariables(pathWithPrefix) : pathWithPrefix;
    const responses = getApiResponse({
      uniqueName,
      route,
      isListOfEntities: kind !== "singleType" && isListOfEntities
    });
    const swaggerConfig = {
      responses,
      tags: [___default.default.upperFirst(uniqueName)],
      parameters: [],
      operationId: `${methodVerb}${routePath}`
    };
    if (isListOfEntities) {
      swaggerConfig.parameters?.push(...params);
    }
    if (hasPathParams) {
      const pathParams = getPathParams(route.path);
      swaggerConfig.parameters?.push(...pathParams);
    }
    if (["post", "put"].includes(methodVerb)) {
      const refName = "Request";
      const requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: `#/components/schemas/${pascalCase(uniqueName)}${refName}`
            }
          }
        }
      };
      swaggerConfig.requestBody = requestBody;
    }
    ___default.default.set(acc, `${routePath}.${methodVerb}`, swaggerConfig);
    return acc;
  }, {});
  return paths;
};
const buildApiEndpointPath = (api) => {
  return loopContentTypeNames(api, getPaths);
};
const getSchemaData = (isListOfEntities, attributes) => {
  if (isListOfEntities) {
    return {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number" },
          documentId: { type: "string" },
          ...attributes
        }
      }
    };
  }
  return {
    type: "object",
    properties: {
      id: { type: "number" },
      documentId: { type: "string" },
      ...attributes
    }
  };
};
const convertComponentName = (component, isRef = false) => {
  const cleanComponentName = `${pascalCase(component)}Component`;
  if (isRef) {
    return `#/components/schemas/${cleanComponentName}`;
  }
  return cleanComponentName;
};
const cleanSchemaAttributes = (attributes, { typeMap = /* @__PURE__ */ new Map(), isRequest = false, didAddStrapiComponentsToSchemas }) => {
  const schemaAttributes = {};
  for (const prop of Object.keys(attributes)) {
    const attribute = attributes[prop];
    switch (attribute.type) {
      case "password": {
        if (!isRequest) {
          break;
        }
        schemaAttributes[prop] = { type: "string", format: "password", example: "*******" };
        break;
      }
      case "email": {
        schemaAttributes[prop] = { type: "string", format: "email" };
        break;
      }
      case "string":
      case "text":
      case "richtext": {
        schemaAttributes[prop] = { type: "string" };
        break;
      }
      case "timestamp": {
        schemaAttributes[prop] = { type: "string", format: "timestamp", example: Date.now() };
        break;
      }
      case "time": {
        schemaAttributes[prop] = { type: "string", format: "time", example: "12:54.000" };
        break;
      }
      case "date": {
        schemaAttributes[prop] = { type: "string", format: "date" };
        break;
      }
      case "datetime": {
        schemaAttributes[prop] = { type: "string", format: "date-time" };
        break;
      }
      case "boolean": {
        schemaAttributes[prop] = { type: "boolean" };
        break;
      }
      case "enumeration": {
        schemaAttributes[prop] = { type: "string", enum: [...attribute.enum] };
        break;
      }
      case "decimal":
      case "float": {
        schemaAttributes[prop] = { type: "number", format: "float" };
        break;
      }
      case "integer": {
        schemaAttributes[prop] = { type: "integer" };
        break;
      }
      case "biginteger": {
        schemaAttributes[prop] = { type: "string", pattern: "^\\d*$", example: "123456789" };
        break;
      }
      case "json":
      case "blocks": {
        schemaAttributes[prop] = {};
        break;
      }
      case "uid": {
        schemaAttributes[prop] = { type: "string" };
        break;
      }
      case "component": {
        const componentAttributes = strapi.components[attribute.component].attributes;
        const rawComponentSchema = {
          type: "object",
          properties: {
            ...isRequest ? {} : { id: { type: "number" } },
            ...cleanSchemaAttributes(componentAttributes, {
              typeMap,
              isRequest,
              didAddStrapiComponentsToSchemas
            })
          }
        };
        const refComponentSchema = {
          $ref: convertComponentName(attribute.component, true)
        };
        const componentExists = didAddStrapiComponentsToSchemas(
          convertComponentName(attribute.component),
          rawComponentSchema
        );
        const finalComponentSchema = componentExists ? refComponentSchema : rawComponentSchema;
        if (attribute.repeatable) {
          schemaAttributes[prop] = {
            type: "array",
            items: finalComponentSchema
          };
        } else {
          schemaAttributes[prop] = finalComponentSchema;
        }
        break;
      }
      case "dynamiczone": {
        const components = attribute.components.map((component) => {
          const componentAttributes = strapi.components[component].attributes;
          const rawComponentSchema = {
            type: "object",
            properties: {
              ...isRequest ? {} : { id: { type: "number" } },
              __component: { type: "string", enum: [component] },
              ...cleanSchemaAttributes(componentAttributes, {
                typeMap,
                isRequest,
                didAddStrapiComponentsToSchemas
              })
            }
          };
          const refComponentSchema = {
            $ref: convertComponentName(component, true)
          };
          const componentExists = didAddStrapiComponentsToSchemas(
            convertComponentName(component),
            rawComponentSchema
          );
          const finalComponentSchema = componentExists ? refComponentSchema : rawComponentSchema;
          return finalComponentSchema;
        });
        let discriminator;
        if (components.every((component) => Object.hasOwn(component, "$ref"))) {
          discriminator = {
            propertyName: "__component",
            mapping: attribute.components.reduce(
              (acc, component) => {
                acc[component] = convertComponentName(component, true);
                return acc;
              },
              {}
            )
          };
        }
        schemaAttributes[prop] = {
          type: "array",
          items: {
            anyOf: components
          },
          discriminator
        };
        break;
      }
      case "media": {
        const imageAttributes = strapi.contentType("plugin::upload.file").attributes;
        const isListOfEntities = attribute.multiple ?? false;
        if (isRequest) {
          const oneOfType = {
            oneOf: [{ type: "integer" }, { type: "string" }],
            example: "string or id"
          };
          schemaAttributes[prop] = isListOfEntities ? { type: "array", items: oneOfType } : oneOfType;
          break;
        }
        schemaAttributes[prop] = getSchemaData(
          isListOfEntities,
          cleanSchemaAttributes(imageAttributes, { typeMap, didAddStrapiComponentsToSchemas })
        );
        break;
      }
      case "relation": {
        const isListOfEntities = attribute.relation.includes("ToMany");
        if (isRequest) {
          const oneOfType = {
            oneOf: [{ type: "integer" }, { type: "string" }],
            example: "string or id"
          };
          schemaAttributes[prop] = isListOfEntities ? { type: "array", items: oneOfType } : oneOfType;
          break;
        }
        if (!("target" in attribute) || !attribute.target || typeMap.has(attribute.target)) {
          schemaAttributes[prop] = getSchemaData(isListOfEntities, {});
          break;
        }
        typeMap.set(attribute.target, true);
        const targetAttributes = strapi.contentType(attribute.target).attributes;
        schemaAttributes[prop] = getSchemaData(
          isListOfEntities,
          cleanSchemaAttributes(targetAttributes, {
            typeMap,
            isRequest,
            didAddStrapiComponentsToSchemas
          })
        );
        break;
      }
      default: {
        throw new Error(`Invalid type ${attribute.type} while generating open api schema.`);
      }
    }
  }
  return schemaAttributes;
};
const getRequiredAttributes = (allAttributes) => {
  const requiredAttributes = [];
  for (const key in allAttributes) {
    if (allAttributes[key].required) {
      requiredAttributes.push(key);
    }
  }
  return requiredAttributes;
};
const getAllSchemasForContentType = ({ routeInfo, attributes, uniqueName }) => {
  let strapiComponentSchemas = {};
  const schemas = {};
  const typeName = pascalCase(uniqueName);
  const didAddStrapiComponentsToSchemas = (schemaName, schema) => {
    if (!Object.keys(schema) || !Object.keys(schema.properties)) return false;
    strapiComponentSchemas = {
      ...strapiComponentSchemas,
      [schemaName]: schema
    };
    return true;
  };
  const routeMethods = routeInfo.routes.map((route) => route.method);
  const attributesToOmit = [
    "createdAt",
    "updatedAt",
    "publishedAt",
    "publishedBy",
    "updatedBy",
    "createdBy"
  ];
  const attributesForRequest = ___default.default.omit(attributes, attributesToOmit);
  const requiredRequestAttributes = getRequiredAttributes(attributesForRequest);
  if (routeMethods.includes("POST") || routeMethods.includes("PUT")) {
    Object.assign(schemas, {
      [`${typeName}Request`]: {
        type: "object",
        required: ["data"],
        properties: {
          data: {
            ...requiredRequestAttributes.length && { required: requiredRequestAttributes },
            type: "object",
            properties: cleanSchemaAttributes(attributesForRequest, {
              isRequest: true,
              didAddStrapiComponentsToSchemas
            })
          }
        }
      }
    });
  }
  const hasListOfEntities = routeInfo.routes.filter(
    (route) => hasFindMethod(route.handler)
  ).length;
  if (hasListOfEntities) {
    Object.assign(schemas, {
      [`${typeName}ListResponse`]: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: {
              $ref: `#/components/schemas/${typeName}`
            }
          },
          meta: {
            type: "object",
            properties: {
              pagination: {
                type: "object",
                properties: {
                  page: { type: "integer" },
                  pageSize: { type: "integer", minimum: 25 },
                  pageCount: { type: "integer", maximum: 1 },
                  total: { type: "integer" }
                }
              }
            }
          }
        }
      }
    });
  }
  const requiredAttributes = getRequiredAttributes(attributes);
  Object.assign(schemas, {
    [`${typeName}`]: {
      type: "object",
      ...requiredAttributes.length && { required: requiredAttributes },
      properties: {
        id: { type: "number" },
        documentId: { type: "string" },
        ...cleanSchemaAttributes(attributes, { didAddStrapiComponentsToSchemas })
      }
    },
    [`${typeName}Response`]: {
      type: "object",
      properties: {
        data: {
          $ref: `#/components/schemas/${typeName}`
        },
        meta: { type: "object" }
      }
    }
  });
  return { ...schemas, ...strapiComponentSchemas };
};
const buildComponentSchema = (api) => {
  return loopContentTypeNames(api, getAllSchemasForContentType);
};
const getPluginsThatNeedDocumentation = (config2) => {
  const defaultPlugins = ["upload", "users-permissions"];
  const userPluginsConfig = config2["x-strapi-config"].plugins;
  if (userPluginsConfig === null) {
    return defaultPlugins;
  }
  if (userPluginsConfig.length) {
    return userPluginsConfig;
  }
  return [];
};
const createService$1 = ({ strapi: strapi2 }) => {
  const config2 = strapi2.config.get("plugin::documentation");
  const pluginsThatNeedDocumentation = getPluginsThatNeedDocumentation(config2);
  const overrideService = getService("override");
  return {
    getDocumentationVersion() {
      return config2.info.version;
    },
    getFullDocumentationPath() {
      return path__default.default.join(strapi2.dirs.app.extensions, "documentation", "documentation");
    },
    getDocumentationVersions() {
      return fs__default.default.readdirSync(this.getFullDocumentationPath()).map((version) => {
        try {
          const filePath = path__default.default.resolve(
            this.getFullDocumentationPath(),
            version,
            "full_documentation.json"
          );
          const doc = JSON.parse(fs__default.default.readFileSync(filePath).toString());
          const generatedDate = doc.info["x-generation-date"];
          return { version, generatedDate, url: "" };
        } catch (err) {
          return null;
        }
      }).filter((x) => x);
    },
    /**
     * Returns settings stored in core-store
     */
    async getDocumentationAccess() {
      const { restrictedAccess } = await strapi2.store({
        environment: "",
        type: "plugin",
        name: "documentation",
        key: "config"
      }).get();
      return { restrictedAccess };
    },
    getApiDocumentationPath(api) {
      if (api.getter === "plugin") {
        return path__default.default.join(strapi2.dirs.app.extensions, api.name, "documentation");
      }
      return path__default.default.join(strapi2.dirs.app.api, api.name, "documentation");
    },
    async deleteDocumentation(version) {
      const apis = this.getPluginAndApiInfo();
      for (const api of apis) {
        await fs__default.default.remove(path__default.default.join(this.getApiDocumentationPath(api), version));
      }
      await fs__default.default.remove(path__default.default.join(this.getFullDocumentationPath(), version));
    },
    getPluginAndApiInfo() {
      const pluginsToDocument = pluginsThatNeedDocumentation.map((plugin) => {
        return {
          name: plugin,
          getter: "plugin",
          ctNames: Object.keys(strapi2.plugin(plugin).contentTypes)
        };
      });
      const apisToDocument = Object.keys(strapi2.apis).map((api) => {
        return {
          name: api,
          getter: "api",
          ctNames: Object.keys(strapi2.api(api).contentTypes)
        };
      });
      return [...apisToDocument, ...pluginsToDocument];
    },
    /**
     * @description - Creates the Swagger json files
     */
    async generateFullDoc(versionOpt) {
      const version = versionOpt ?? this.getDocumentationVersion();
      const apis = this.getPluginAndApiInfo();
      const apisThatNeedGeneratedDocumentation = apis.filter(
        ({ name }) => !overrideService.isEnabled(name)
      );
      const generatedDocumentation = await immer.produce(config2, async (draft) => {
        if (draft.servers?.length === 0) {
          const serverUrl = strapi2.config.get("server.absoluteUrl");
          const apiPath = strapi2.config.get("api.rest.prefix");
          draft.servers = [
            {
              url: `${serverUrl}${apiPath}`,
              description: "Development server"
            }
          ];
        }
        if (!draft.components) {
          draft.components = {};
        }
        draft.info["x-generation-date"] = (/* @__PURE__ */ new Date()).toISOString();
        draft["x-strapi-config"].plugins = pluginsThatNeedDocumentation;
        delete draft["x-strapi-config"].mutateDocumentation;
        for (const api of apisThatNeedGeneratedDocumentation) {
          const newApiPath = buildApiEndpointPath(api);
          const generatedSchemas = buildComponentSchema(api);
          if (generatedSchemas) {
            draft.components.schemas = { ...draft.components.schemas, ...generatedSchemas };
          }
          if (newApiPath) {
            draft.paths = { ...draft.paths, ...newApiPath };
          }
        }
        if (overrideService.registeredOverrides.length > 0) {
          overrideService.registeredOverrides.forEach((override) => {
            if (!override?.info?.version || override.info.version === version) {
              if (override.tags) {
                draft.tags = draft.tags || [];
                draft.tags.push(...override.tags);
              }
              if (override.paths) {
                draft.paths = { ...draft.paths, ...override.paths };
              }
              if (override.components) {
                const keys = Object.keys(override.components);
                keys.forEach((overrideKey) => {
                  draft.components = draft.components || {};
                  const overrideValue = override.components?.[overrideKey];
                  const originalValue = draft.components?.[overrideKey];
                  Object.assign(draft.components, {
                    [overrideKey]: {
                      ...originalValue,
                      ...overrideValue
                    }
                  });
                });
              }
            }
          });
        }
      });
      const userMutatesDocumentation = config2["x-strapi-config"].mutateDocumentation;
      const finalDocumentation = userMutatesDocumentation ? immer.produce(generatedDocumentation, userMutatesDocumentation) : generatedDocumentation;
      const fullDocJsonPath = path__default.default.join(
        this.getFullDocumentationPath(),
        version,
        "full_documentation.json"
      );
      await fs__default.default.ensureFile(fullDocJsonPath);
      await fs__default.default.writeJson(fullDocJsonPath, finalDocumentation, { spaces: 2 });
    }
  };
};
const createService = ({ strapi: strapi2 }) => {
  const registeredOverrides = [];
  const excludedFromGeneration = [];
  return {
    registeredOverrides,
    excludedFromGeneration,
    /**
     *
     * @param {(string | string[])} api - The name of the api or and array of apis to exclude from generation
     */
    excludeFromGeneration(api) {
      if (Array.isArray(api)) {
        excludedFromGeneration.push(...api);
        return;
      }
      excludedFromGeneration.push(api);
    },
    isEnabled(name) {
      return excludedFromGeneration.includes(name);
    },
    registerOverride(override, opts) {
      const { pluginOrigin, excludeFromGeneration = [] } = opts ?? {};
      const pluginsThatNeedDocumentation = getPluginsThatNeedDocumentation(
        strapi2.config.get("plugin::documentation")
      );
      if (pluginOrigin && !pluginsThatNeedDocumentation.includes(pluginOrigin)) return;
      if (excludeFromGeneration.length) {
        this.excludeFromGeneration(excludeFromGeneration);
      }
      let overrideToRegister = override;
      if (typeof override === "string") {
        overrideToRegister = require("yaml").parse(overrideToRegister);
      }
      registeredOverrides.push(overrideToRegister);
    }
  };
};
const services = {
  documentation: createService$1,
  override: createService
};
const restrictAccess = async (ctx, next) => {
  const pluginStore = strapi.store({ type: "plugin", name: "documentation" });
  const config2 = await pluginStore.get({ key: "config" });
  if (!config2.restrictedAccess) {
    return next();
  }
  if (!ctx.session || !ctx.session.documentation || !ctx.session.documentation.logged) {
    const querystring = ctx.querystring ? `?${ctx.querystring}` : "";
    return ctx.redirect(`${strapi.config.server.url}/documentation/login${querystring}`);
  }
  return next();
};
const routes = [
  {
    method: "GET",
    path: "/",
    handler: "documentation.index",
    config: {
      auth: false,
      middlewares: [restrictAccess]
    }
  },
  {
    method: "GET",
    path: "/v:major(\\d+).:minor(\\d+).:patch(\\d+)",
    handler: "documentation.index",
    config: {
      auth: false,
      middlewares: [restrictAccess]
    }
  },
  {
    method: "GET",
    path: "/login",
    handler: "documentation.loginView",
    config: {
      auth: false
    }
  },
  {
    method: "POST",
    path: "/login",
    handler: "documentation.login",
    config: {
      auth: false
    }
  },
  {
    method: "GET",
    path: "/getInfos",
    handler: "documentation.getInfos",
    config: {
      policies: [
        { name: "admin::hasPermissions", config: { actions: ["plugin::documentation.read"] } }
      ]
    }
  },
  {
    method: "POST",
    path: "/regenerateDoc",
    handler: "documentation.regenerateDoc",
    config: {
      policies: [
        {
          name: "admin::hasPermissions",
          config: { actions: ["plugin::documentation.settings.regenerate"] }
        }
      ]
    }
  },
  {
    method: "PUT",
    path: "/updateSettings",
    handler: "documentation.updateSettings",
    config: {
      policies: [
        {
          name: "admin::hasPermissions",
          config: { actions: ["plugin::documentation.settings.update"] }
        }
      ]
    }
  },
  {
    method: "DELETE",
    path: "/deleteDoc/:version",
    handler: "documentation.deleteDoc",
    config: {
      policies: []
    }
  }
];
const validation = {
  validateSettings: utils.validateYupSchema(
    utils.yup.object().shape({
      restrictedAccess: utils.yup.boolean(),
      password: utils.yup.string().min(8).matches(/[a-z]/, "${path} must contain at least one lowercase character").matches(/[A-Z]/, "${path} must contain at least one uppercase character").matches(/\d/, "${path} must contain at least one number").when("restrictedAccess", (value, initSchema) => {
        return value ? initSchema.required("password is required") : initSchema;
      })
    })
  )
};
const documentation = {
  async getInfos(ctx) {
    try {
      const docService = getService("documentation");
      const docVersions = docService.getDocumentationVersions();
      const documentationAccess = await docService.getDocumentationAccess();
      ctx.send({
        docVersions,
        currentVersion: docService.getDocumentationVersion(),
        prefix: "/documentation",
        documentationAccess
      });
    } catch (err) {
      strapi.log.error(err);
      ctx.badRequest();
    }
  },
  async index(ctx, next) {
    try {
      const { major, minor, patch } = ctx.params;
      const version = major && minor && patch ? `${major}.${minor}.${patch}` : getService("documentation").getDocumentationVersion();
      const openAPISpecsPath = path__default.default.join(
        strapi.dirs.app.extensions,
        "documentation",
        "documentation",
        version,
        "full_documentation.json"
      );
      try {
        const documentation2 = fs__default.default.readFileSync(openAPISpecsPath, "utf8");
        const layout = (await Promise.resolve().then(() => require("../_chunks/index-DsqKQmU8.js"))).default;
        const filledLayout = ___default.default.template(layout)({
          backendUrl: strapi.config.server.url,
          spec: JSON.stringify(JSON.parse(documentation2))
        });
        try {
          const layoutPath = path__default.default.resolve(
            strapi.dirs.app.extensions,
            "documentation",
            "public",
            "index.html"
          );
          await fs__default.default.ensureFile(layoutPath);
          await fs__default.default.writeFile(layoutPath, filledLayout);
          ctx.url = path__default.default.basename(`${ctx.url}/index.html`);
          try {
            const staticFolder = path__default.default.resolve(
              strapi.dirs.app.extensions,
              "documentation",
              "public"
            );
            return koaStatic__default.default(staticFolder)(ctx, next);
          } catch (e) {
            strapi.log.error(e);
          }
        } catch (e) {
          strapi.log.error(e);
        }
      } catch (e) {
        strapi.log.error(e);
      }
    } catch (e) {
      strapi.log.error(e);
    }
  },
  async loginView(ctx, next) {
    const cheerio = require("cheerio");
    const { error } = ctx.query;
    try {
      const layout = (await Promise.resolve().then(() => require("../_chunks/login-Dox9npve.js"))).default;
      const filledLayout = ___default.default.template(layout.toString())({
        actionUrl: `${strapi.config.server.url}/documentation/login`
      });
      const $ = cheerio.load(filledLayout);
      $(".error").text(___default.default.isEmpty(error) ? "" : "Wrong password...");
      try {
        const layoutPath = path__default.default.resolve(
          strapi.dirs.app.extensions,
          "documentation",
          "public",
          "login.html"
        );
        await fs__default.default.ensureFile(layoutPath);
        await fs__default.default.writeFile(layoutPath, $.html());
        ctx.url = path__default.default.basename(`${ctx.url}/login.html`);
        try {
          const staticFolder = path__default.default.resolve(strapi.dirs.app.extensions, "documentation", "public");
          return koaStatic__default.default(staticFolder)(ctx, next);
        } catch (e) {
          strapi.log.error(e);
        }
      } catch (e) {
        strapi.log.error(e);
      }
    } catch (e) {
      strapi.log.error(e);
    }
  },
  async login(ctx) {
    const {
      body: { password }
    } = ctx.request;
    const { password: hash } = await strapi.store({ type: "plugin", name: "documentation", key: "config" }).get();
    const isValid = await bcrypt__default.default.compare(password, hash);
    let querystring = "?error=password";
    if (isValid && ctx.session) {
      ctx.session.documentation = {
        logged: true
      };
      querystring = "";
    }
    ctx.redirect(`${strapi.config.server.url}/documentation${querystring}`);
  },
  async regenerateDoc(ctx) {
    const { version } = ctx.request.body;
    const service = getService("documentation");
    const documentationVersions = service.getDocumentationVersions().map((el) => el.version);
    if (___default.default.isEmpty(version)) {
      return ctx.badRequest("Please provide a version.");
    }
    if (!documentationVersions.includes(version)) {
      return ctx.badRequest("The version you are trying to generate does not exist.");
    }
    try {
      strapi.reload.isWatching = false;
      await service.generateFullDoc(version);
      ctx.send({ ok: true });
    } finally {
      strapi.reload.isWatching = true;
    }
  },
  async deleteDoc(ctx) {
    const { version } = ctx.params;
    const service = getService("documentation");
    const documentationVersions = service.getDocumentationVersions().map((el) => el.version);
    if (___default.default.isEmpty(version)) {
      return ctx.badRequest("Please provide a version.");
    }
    if (!documentationVersions.includes(version)) {
      return ctx.badRequest("The version you are trying to delete does not exist.");
    }
    try {
      strapi.reload.isWatching = false;
      await service.deleteDocumentation(version);
      ctx.send({ ok: true });
    } finally {
      strapi.reload.isWatching = true;
    }
  },
  async updateSettings(ctx) {
    const pluginStore = strapi.store({ type: "plugin", name: "documentation" });
    const data = await validation.validateSettings(ctx.request.body);
    const config2 = {
      restrictedAccess: Boolean(data.restrictedAccess)
    };
    if (data.password) {
      config2.password = await bcrypt__default.default.hash(data.password, 10);
    }
    await pluginStore.set({ key: "config", value: config2 });
    return ctx.send({ ok: true });
  }
};
const controllers = {
  documentation
};
const defaultConfig = {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "DOCUMENTATION",
    description: "",
    termsOfService: "YOUR_TERMS_OF_SERVICE_URL",
    contact: {
      name: "TEAM",
      email: "contact-email@something.io",
      url: "mywebsite.io"
    },
    license: {
      name: "Apache 2.0",
      url: "https://www.apache.org/licenses/LICENSE-2.0.html"
    }
  },
  "x-strapi-config": {
    plugins: null,
    mutateDocumentation: null
  },
  servers: [],
  externalDocs: {
    description: "Find out more",
    url: "https://docs.strapi.io/developer-docs/latest/getting-started/introduction.html"
  },
  security: [
    {
      bearerAuth: []
    }
  ],
  paths: {},
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      Error: {
        type: "object",
        required: ["error"],
        properties: {
          data: {
            nullable: true,
            oneOf: [{ type: "object" }, { type: "array", items: { type: "object" } }]
          },
          error: {
            type: "object",
            properties: {
              status: {
                type: "integer"
              },
              name: {
                type: "string"
              },
              message: {
                type: "string"
              },
              details: {
                type: "object"
              }
            }
          }
        }
      }
    }
  }
};
const config = {
  default: defaultConfig
};
const index = {
  bootstrap,
  config,
  routes,
  controllers,
  register,
  services
};
module.exports = index;
