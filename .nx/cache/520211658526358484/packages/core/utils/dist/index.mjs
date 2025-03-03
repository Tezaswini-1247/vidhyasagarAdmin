import * as _ from "lodash";
import ___default, { kebabCase } from "lodash";
import * as dates$1 from "date-fns";
import { has, union, getOr, assoc, assign, cloneDeep, remove, eq, curry, isObject, isNil, clone, isArray, isEmpty, toPath, defaults, isString, toNumber, get, isInteger, isBoolean, pick, omit, trim, pipe as pipe$1, split, map as map$1, flatten, first, identity, constant, join, merge, trimChars, trimCharsEnd, trimCharsStart, isNumber } from "lodash/fp";
import { randomUUID } from "crypto";
import { machineIdSync } from "node-machine-id";
import * as yup$1 from "yup";
import { HttpError } from "http-errors";
import pMap from "p-map";
import execa from "execa";
import preferredPM from "preferred-pm";
import { Writable } from "node:stream";
import slugify from "@sindresorhus/slugify";
import { z } from "zod";
function _mergeNamespaces(n, m) {
  for (var i = 0; i < m.length; i++) {
    const e = m[i];
    if (typeof e !== "string" && !Array.isArray(e)) {
      for (const k in e) {
        if (k !== "default" && !(k in n)) {
          const d = Object.getOwnPropertyDescriptor(e, k);
          if (d) {
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: () => e[k]
            });
          }
        }
      }
    }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }));
}
const timeRegex = /^(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]{1,3})?$/;
const isDate = (v) => {
  return dates$1.isDate(v);
};
const parseTime = (value) => {
  if (isDate(value)) {
    return dates$1.format(value, "HH:mm:ss.SSS");
  }
  if (typeof value !== "string") {
    throw new Error(`Expected a string, got a ${typeof value}`);
  }
  const result = value.match(timeRegex);
  if (result === null) {
    throw new Error("Invalid time format, expected HH:mm:ss.SSS");
  }
  const [, hours, minutes, seconds, fraction = ".000"] = result;
  const fractionPart = _.padEnd(fraction.slice(1), 3, "0");
  return `${hours}:${minutes}:${seconds}.${fractionPart}`;
};
const parseDate = (value) => {
  if (isDate(value)) {
    return dates$1.format(value, "yyyy-MM-dd");
  }
  if (typeof value !== "string") {
    throw new Error(`Expected a string, got a ${typeof value}`);
  }
  try {
    const date = dates$1.parseISO(value);
    if (dates$1.isValid(date)) return dates$1.format(date, "yyyy-MM-dd");
    throw new Error(`Invalid format, expected an ISO compatible date`);
  } catch (error) {
    throw new Error(`Invalid format, expected an ISO compatible date`);
  }
};
const parseDateTimeOrTimestamp = (value) => {
  if (isDate(value)) {
    return value;
  }
  if (typeof value !== "string") {
    throw new Error(`Expected a string, got a ${typeof value}`);
  }
  try {
    const date = dates$1.parseISO(value);
    if (dates$1.isValid(date)) return date;
    const milliUnixDate = dates$1.parse(value, "T", /* @__PURE__ */ new Date());
    if (dates$1.isValid(milliUnixDate)) return milliUnixDate;
    throw new Error(`Invalid format, expected a timestamp or an ISO date`);
  } catch (error) {
    throw new Error(`Invalid format, expected a timestamp or an ISO date`);
  }
};
const parseBoolean = (value, options) => {
  const { forceCast = false } = options;
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string" || typeof value === "number") {
    if (["true", "t", "1", 1].includes(value)) {
      return true;
    }
    if (["false", "f", "0", 0].includes(value)) {
      return false;
    }
  }
  if (forceCast) {
    return Boolean(value);
  }
  throw new Error('Invalid boolean input. Expected "t","1","true","false","0","f"');
};
const parseType = (options) => {
  const { type, value, forceCast } = options;
  switch (type) {
    case "boolean":
      return parseBoolean(value, { forceCast });
    case "integer":
    case "biginteger":
    case "float":
    case "decimal": {
      return _.toNumber(value);
    }
    case "time": {
      return parseTime(value);
    }
    case "date": {
      return parseDate(value);
    }
    case "timestamp":
    case "datetime": {
      return parseDateTimeOrTimestamp(value);
    }
    default:
      return value;
  }
};
function envFn(key, defaultValue) {
  return ___default.has(process.env, key) ? process.env[key] : defaultValue;
}
function getKey(key) {
  return process.env[key] ?? "";
}
const utils = {
  int(key, defaultValue) {
    if (!___default.has(process.env, key)) {
      return defaultValue;
    }
    return parseInt(getKey(key), 10);
  },
  float(key, defaultValue) {
    if (!___default.has(process.env, key)) {
      return defaultValue;
    }
    return parseFloat(getKey(key));
  },
  bool(key, defaultValue) {
    if (!___default.has(process.env, key)) {
      return defaultValue;
    }
    return getKey(key) === "true";
  },
  json(key, defaultValue) {
    if (!___default.has(process.env, key)) {
      return defaultValue;
    }
    try {
      return JSON.parse(getKey(key));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Invalid json environment variable ${key}: ${error.message}`);
      }
      throw error;
    }
  },
  array(key, defaultValue) {
    if (!___default.has(process.env, key)) {
      return defaultValue;
    }
    let value = getKey(key);
    if (value.startsWith("[") && value.endsWith("]")) {
      value = value.substring(1, value.length - 1);
    }
    return value.split(",").map((v) => {
      return ___default.trim(___default.trim(v, " "), '"');
    });
  },
  date(key, defaultValue) {
    if (!___default.has(process.env, key)) {
      return defaultValue;
    }
    return new Date(getKey(key));
  },
  /**
   * Gets a value from env that matches oneOf provided values
   * @param {string} key
   * @param {string[]} expectedValues
   * @param {string|undefined} defaultValue
   * @returns {string|undefined}
   */
  oneOf(key, expectedValues, defaultValue) {
    if (!expectedValues) {
      throw new Error(`env.oneOf requires expectedValues`);
    }
    if (defaultValue && !expectedValues.includes(defaultValue)) {
      throw new Error(`env.oneOf requires defaultValue to be included in expectedValues`);
    }
    const rawValue = env(key, defaultValue);
    return expectedValues.includes(rawValue) ? rawValue : defaultValue;
  }
};
const env = Object.assign(envFn, utils);
const SINGLE_TYPE = "singleType";
const COLLECTION_TYPE = "collectionType";
const ID_ATTRIBUTE$4 = "id";
const DOC_ID_ATTRIBUTE$4 = "documentId";
const PUBLISHED_AT_ATTRIBUTE$1 = "publishedAt";
const CREATED_BY_ATTRIBUTE$3 = "createdBy";
const UPDATED_BY_ATTRIBUTE$3 = "updatedBy";
const CREATED_AT_ATTRIBUTE = "createdAt";
const UPDATED_AT_ATTRIBUTE = "updatedAt";
const constants$1 = {
  ID_ATTRIBUTE: ID_ATTRIBUTE$4,
  DOC_ID_ATTRIBUTE: DOC_ID_ATTRIBUTE$4,
  PUBLISHED_AT_ATTRIBUTE: PUBLISHED_AT_ATTRIBUTE$1,
  CREATED_BY_ATTRIBUTE: CREATED_BY_ATTRIBUTE$3,
  UPDATED_BY_ATTRIBUTE: UPDATED_BY_ATTRIBUTE$3,
  CREATED_AT_ATTRIBUTE,
  UPDATED_AT_ATTRIBUTE,
  SINGLE_TYPE,
  COLLECTION_TYPE
};
const getTimestamps = (model) => {
  const attributes = [];
  if (has(CREATED_AT_ATTRIBUTE, model.attributes)) {
    attributes.push(CREATED_AT_ATTRIBUTE);
  }
  if (has(UPDATED_AT_ATTRIBUTE, model.attributes)) {
    attributes.push(UPDATED_AT_ATTRIBUTE);
  }
  return attributes;
};
const getCreatorFields = (model) => {
  const attributes = [];
  if (has(CREATED_BY_ATTRIBUTE$3, model.attributes)) {
    attributes.push(CREATED_BY_ATTRIBUTE$3);
  }
  if (has(UPDATED_BY_ATTRIBUTE$3, model.attributes)) {
    attributes.push(UPDATED_BY_ATTRIBUTE$3);
  }
  return attributes;
};
const getNonWritableAttributes = (model) => {
  if (!model) return [];
  const nonWritableAttributes = ___default.reduce(
    model.attributes,
    (acc, attr, attrName) => attr.writable === false ? acc.concat(attrName) : acc,
    []
  );
  return ___default.uniq([
    ID_ATTRIBUTE$4,
    DOC_ID_ATTRIBUTE$4,
    ...getTimestamps(model),
    ...nonWritableAttributes
  ]);
};
const getWritableAttributes = (model) => {
  if (!model) return [];
  return ___default.difference(Object.keys(model.attributes), getNonWritableAttributes(model));
};
const isWritableAttribute = (model, attributeName) => {
  return getWritableAttributes(model).includes(attributeName);
};
const getNonVisibleAttributes = (model) => {
  const nonVisibleAttributes = ___default.reduce(
    model.attributes,
    (acc, attr, attrName) => attr.visible === false ? acc.concat(attrName) : acc,
    []
  );
  return ___default.uniq([ID_ATTRIBUTE$4, DOC_ID_ATTRIBUTE$4, ...getTimestamps(model), ...nonVisibleAttributes]);
};
const getVisibleAttributes = (model) => {
  return ___default.difference(___default.keys(model.attributes), getNonVisibleAttributes(model));
};
const isVisibleAttribute = (model, attributeName) => {
  return getVisibleAttributes(model).includes(attributeName);
};
const getOptions = (model) => ___default.assign({ draftAndPublish: false }, ___default.get(model, "options", {}));
const hasDraftAndPublish = (model) => ___default.get(model, "options.draftAndPublish", false) === true;
const isDraft = (data, model) => hasDraftAndPublish(model) && ___default.get(data, PUBLISHED_AT_ATTRIBUTE$1) === null;
const isSchema = (data) => {
  return typeof data === "object" && data !== null && "modelType" in data && typeof data.modelType === "string" && ["component", "contentType"].includes(data.modelType);
};
const isComponentSchema = (data) => {
  return isSchema(data) && data.modelType === "component";
};
const isContentTypeSchema = (data) => {
  return isSchema(data) && data.modelType === "contentType";
};
const isSingleType = ({ kind = COLLECTION_TYPE }) => kind === SINGLE_TYPE;
const isCollectionType = ({ kind = COLLECTION_TYPE }) => kind === COLLECTION_TYPE;
const isKind = (kind) => (model) => model.kind === kind;
const getStoredPrivateAttributes = (model) => union(
  strapi?.config?.get("api.responses.privateAttributes", []) ?? [],
  getOr([], "options.privateAttributes", model)
);
const getPrivateAttributes = (model) => {
  return ___default.union(
    getStoredPrivateAttributes(model),
    ___default.keys(___default.pickBy(model.attributes, (attr) => !!attr.private))
  );
};
const isPrivateAttribute = (model, attributeName) => {
  if (model?.attributes?.[attributeName]?.private === true) {
    return true;
  }
  return getStoredPrivateAttributes(model).includes(attributeName);
};
const isScalarAttribute = (attribute) => {
  return attribute && !["media", "component", "relation", "dynamiczone"].includes(attribute.type);
};
const getDoesAttributeRequireValidation = (attribute) => {
  return attribute.required || attribute.unique || Object.prototype.hasOwnProperty.call(attribute, "max") || Object.prototype.hasOwnProperty.call(attribute, "min") || Object.prototype.hasOwnProperty.call(attribute, "maxLength") || Object.prototype.hasOwnProperty.call(attribute, "minLength");
};
const isMediaAttribute = (attribute) => attribute?.type === "media";
const isRelationalAttribute = (attribute) => attribute?.type === "relation";
const HAS_RELATION_REORDERING = ["manyToMany", "manyToOne", "oneToMany"];
const hasRelationReordering = (attribute) => isRelationalAttribute(attribute) && HAS_RELATION_REORDERING.includes(attribute.relation);
const isComponentAttribute = (attribute) => ["component", "dynamiczone"].includes(attribute?.type);
const isDynamicZoneAttribute = (attribute) => !!attribute && attribute.type === "dynamiczone";
const isMorphToRelationalAttribute = (attribute) => {
  return !!attribute && isRelationalAttribute(attribute) && attribute.relation?.startsWith?.("morphTo");
};
const getComponentAttributes = (schema) => {
  return ___default.reduce(
    schema.attributes,
    (acc, attr, attrName) => {
      if (isComponentAttribute(attr)) acc.push(attrName);
      return acc;
    },
    []
  );
};
const getScalarAttributes = (schema) => {
  return ___default.reduce(
    schema.attributes,
    (acc, attr, attrName) => {
      if (isScalarAttribute(attr)) acc.push(attrName);
      return acc;
    },
    []
  );
};
const getRelationalAttributes = (schema) => {
  return ___default.reduce(
    schema.attributes,
    (acc, attr, attrName) => {
      if (isRelationalAttribute(attr)) acc.push(attrName);
      return acc;
    },
    []
  );
};
const isTypedAttribute = (attribute, type) => {
  return ___default.has(attribute, "type") && attribute.type === type;
};
const getContentTypeRoutePrefix = (contentType) => {
  return isSingleType(contentType) ? ___default.kebabCase(contentType.info.singularName) : ___default.kebabCase(contentType.info.pluralName);
};
const contentTypes = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  constants: constants$1,
  getComponentAttributes,
  getContentTypeRoutePrefix,
  getCreatorFields,
  getDoesAttributeRequireValidation,
  getNonVisibleAttributes,
  getNonWritableAttributes,
  getOptions,
  getPrivateAttributes,
  getRelationalAttributes,
  getScalarAttributes,
  getTimestamps,
  getVisibleAttributes,
  getWritableAttributes,
  hasDraftAndPublish,
  hasRelationReordering,
  isCollectionType,
  isComponentAttribute,
  isComponentSchema,
  isContentTypeSchema,
  isDraft,
  isDynamicZoneAttribute,
  isKind,
  isMediaAttribute,
  isMorphToRelationalAttribute,
  isPrivateAttribute,
  isRelationalAttribute,
  isScalarAttribute,
  isSchema,
  isSingleType,
  isTypedAttribute,
  isVisibleAttribute,
  isWritableAttribute
}, Symbol.toStringTag, { value: "Module" }));
const { CREATED_BY_ATTRIBUTE: CREATED_BY_ATTRIBUTE$2, UPDATED_BY_ATTRIBUTE: UPDATED_BY_ATTRIBUTE$2 } = constants$1;
const setCreatorFields = ({ user, isEdition = false }) => (data) => {
  if (isEdition) {
    return assoc(UPDATED_BY_ATTRIBUTE$2, user.id, data);
  }
  return assign(data, {
    [CREATED_BY_ATTRIBUTE$2]: user.id,
    [UPDATED_BY_ATTRIBUTE$2]: user.id
  });
};
const createHook = () => {
  const state = {
    handlers: []
  };
  return {
    getHandlers() {
      return state.handlers;
    },
    register(handler) {
      state.handlers.push(handler);
      return this;
    },
    delete(handler) {
      state.handlers = remove(eq(handler), state.handlers);
      return this;
    },
    call() {
      throw new Error("Method not implemented");
    }
  };
};
const createAsyncSeriesHook = () => ({
  ...createHook(),
  async call(context) {
    for (const handler of this.getHandlers()) {
      await handler(context);
    }
  }
});
const createAsyncSeriesWaterfallHook = () => ({
  ...createHook(),
  async call(param) {
    let res = param;
    for (const handler of this.getHandlers()) {
      res = await handler(res);
    }
    return res;
  }
});
const createAsyncParallelHook = () => ({
  ...createHook(),
  async call(context) {
    const promises = this.getHandlers().map((handler) => handler(cloneDeep(context)));
    return Promise.all(promises);
  }
});
const createAsyncBailHook = () => ({
  ...createHook(),
  async call(context) {
    for (const handler of this.getHandlers()) {
      const result = await handler(context);
      if (result !== void 0) {
        return result;
      }
    }
  }
});
const internals = {
  // Internal utils
  createHook
};
const hooks = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createAsyncBailHook,
  createAsyncParallelHook,
  createAsyncSeriesHook,
  createAsyncSeriesWaterfallHook,
  internals
}, Symbol.toStringTag, { value: "Module" }));
const createProviderHooksMap = () => ({
  // Register events
  willRegister: createAsyncSeriesHook(),
  didRegister: createAsyncParallelHook(),
  // Delete events
  willDelete: createAsyncParallelHook(),
  didDelete: createAsyncParallelHook()
});
const providerFactory = (options = {}) => {
  const { throwOnDuplicates = true } = options;
  const state = {
    hooks: createProviderHooksMap(),
    registry: /* @__PURE__ */ new Map()
  };
  return {
    hooks: state.hooks,
    async register(key, item) {
      if (throwOnDuplicates && this.has(key)) {
        throw new Error(`Duplicated item key: ${key}`);
      }
      await state.hooks.willRegister.call({ key, value: item });
      state.registry.set(key, item);
      await state.hooks.didRegister.call({ key, value: cloneDeep(item) });
      return this;
    },
    async delete(key) {
      if (this.has(key)) {
        const item = this.get(key);
        await state.hooks.willDelete.call({ key, value: cloneDeep(item) });
        state.registry.delete(key);
        await state.hooks.didDelete.call({ key, value: cloneDeep(item) });
      }
      return this;
    },
    get(key) {
      return state.registry.get(key);
    },
    values() {
      return Array.from(state.registry.values());
    },
    keys() {
      return Array.from(state.registry.keys());
    },
    has(key) {
      return state.registry.has(key);
    },
    size() {
      return state.registry.size;
    },
    async clear() {
      const keys = this.keys();
      for (const key of keys) {
        await this.delete(key);
      }
      return this;
    }
  };
};
const traverseEntity = async (visitor2, options, entity) => {
  const { path = { raw: null, attribute: null }, schema, getModel } = options;
  let parent = options.parent;
  const traverseMorphRelationTarget = async (visitor22, path2, entry) => {
    const targetSchema = getModel(entry.__type);
    const traverseOptions = { schema: targetSchema, path: path2, getModel, parent };
    return traverseEntity(visitor22, traverseOptions, entry);
  };
  const traverseRelationTarget = (schema2) => async (visitor22, path2, entry) => {
    const traverseOptions = { schema: schema2, path: path2, getModel, parent };
    return traverseEntity(visitor22, traverseOptions, entry);
  };
  const traverseMediaTarget = async (visitor22, path2, entry) => {
    const targetSchemaUID = "plugin::upload.file";
    const targetSchema = getModel(targetSchemaUID);
    const traverseOptions = { schema: targetSchema, path: path2, getModel, parent };
    return traverseEntity(visitor22, traverseOptions, entry);
  };
  const traverseComponent = async (visitor22, path2, schema2, entry) => {
    const traverseOptions = { schema: schema2, path: path2, getModel, parent };
    return traverseEntity(visitor22, traverseOptions, entry);
  };
  const visitDynamicZoneEntry = async (visitor22, path2, entry) => {
    const targetSchema = getModel(entry.__component);
    const traverseOptions = { schema: targetSchema, path: path2, getModel, parent };
    return traverseEntity(visitor22, traverseOptions, entry);
  };
  if (!isObject(entity) || isNil(schema)) {
    return entity;
  }
  const copy = clone(entity);
  const visitorUtils = createVisitorUtils({ data: copy });
  const keys = Object.keys(copy);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const attribute = schema.attributes[key];
    const newPath = { ...path };
    newPath.raw = isNil(path.raw) ? key : `${path.raw}.${key}`;
    if (!isNil(attribute)) {
      newPath.attribute = isNil(path.attribute) ? key : `${path.attribute}.${key}`;
    }
    const visitorOptions = {
      data: copy,
      schema,
      key,
      value: copy[key],
      attribute,
      path: newPath,
      getModel,
      parent
    };
    await visitor2(visitorOptions, visitorUtils);
    const value = copy[key];
    if (isNil(value) || isNil(attribute)) {
      continue;
    }
    parent = { schema, key, attribute, path: newPath };
    if (isRelationalAttribute(attribute)) {
      const isMorphRelation = attribute.relation.toLowerCase().startsWith("morph");
      const method = isMorphRelation ? traverseMorphRelationTarget : traverseRelationTarget(getModel(attribute.target));
      if (isArray(value)) {
        const res = new Array(value.length);
        for (let i2 = 0; i2 < value.length; i2 += 1) {
          res[i2] = await method(visitor2, newPath, value[i2]);
        }
        copy[key] = res;
      } else {
        copy[key] = await method(visitor2, newPath, value);
      }
      continue;
    }
    if (isMediaAttribute(attribute)) {
      if (isArray(value)) {
        const res = new Array(value.length);
        for (let i2 = 0; i2 < value.length; i2 += 1) {
          res[i2] = await traverseMediaTarget(visitor2, newPath, value[i2]);
        }
        copy[key] = res;
      } else {
        copy[key] = await traverseMediaTarget(visitor2, newPath, value);
      }
      continue;
    }
    if (attribute.type === "component") {
      const targetSchema = getModel(attribute.component);
      if (isArray(value)) {
        const res = new Array(value.length);
        for (let i2 = 0; i2 < value.length; i2 += 1) {
          res[i2] = await traverseComponent(visitor2, newPath, targetSchema, value[i2]);
        }
        copy[key] = res;
      } else {
        copy[key] = await traverseComponent(visitor2, newPath, targetSchema, value);
      }
      continue;
    }
    if (attribute.type === "dynamiczone" && isArray(value)) {
      const res = new Array(value.length);
      for (let i2 = 0; i2 < value.length; i2 += 1) {
        res[i2] = await visitDynamicZoneEntry(visitor2, newPath, value[i2]);
      }
      copy[key] = res;
      continue;
    }
  }
  return copy;
};
const createVisitorUtils = ({ data }) => ({
  remove(key) {
    delete data[key];
  },
  set(key, value) {
    data[key] = value;
  }
});
const traverseEntity$1 = curry(traverseEntity);
function importDefault(modName) {
  const mod = require(modName);
  return mod && mod.__esModule ? mod.default : mod;
}
const machineId = () => {
  try {
    const deviceId = machineIdSync();
    return deviceId;
  } catch (error) {
    const deviceId = randomUUID();
    return deviceId;
  }
};
const formatYupInnerError = (yupError) => ({
  path: toPath(yupError.path),
  message: yupError.message,
  name: yupError.name
});
const formatYupErrors = (yupError) => ({
  errors: isEmpty(yupError.inner) ? [formatYupInnerError(yupError)] : yupError.inner.map(formatYupInnerError),
  message: yupError.message
});
class ApplicationError extends Error {
  name;
  details;
  message;
  constructor(message = "An application error occured", details = {}) {
    super();
    this.name = "ApplicationError";
    this.message = message;
    this.details = details;
  }
}
class ValidationError extends ApplicationError {
  constructor(message, details) {
    super(message, details);
    this.name = "ValidationError";
  }
}
class YupValidationError extends ValidationError {
  constructor(yupError, message) {
    super("Validation");
    const { errors: errors2, message: yupMessage } = formatYupErrors(yupError);
    this.message = message || yupMessage;
    this.details = { errors: errors2 };
  }
}
class PaginationError extends ApplicationError {
  constructor(message = "Invalid pagination", details) {
    super(message, details);
    this.name = "PaginationError";
    this.message = message;
  }
}
class NotFoundError extends ApplicationError {
  constructor(message = "Entity not found", details) {
    super(message, details);
    this.name = "NotFoundError";
    this.message = message;
  }
}
class ForbiddenError extends ApplicationError {
  constructor(message = "Forbidden access", details) {
    super(message, details);
    this.name = "ForbiddenError";
    this.message = message;
  }
}
class UnauthorizedError extends ApplicationError {
  constructor(message = "Unauthorized", details) {
    super(message, details);
    this.name = "UnauthorizedError";
    this.message = message;
  }
}
class RateLimitError extends ApplicationError {
  constructor(message = "Too many requests, please try again later.", details) {
    super(message, details);
    this.name = "RateLimitError";
    this.message = message;
    this.details = details || {};
  }
}
class PayloadTooLargeError extends ApplicationError {
  constructor(message = "Entity too large", details) {
    super(message, details);
    this.name = "PayloadTooLargeError";
    this.message = message;
  }
}
class PolicyError extends ForbiddenError {
  constructor(message = "Policy Failed", details) {
    super(message, details);
    this.name = "PolicyError";
    this.message = message;
    this.details = details || {};
  }
}
class NotImplementedError extends ApplicationError {
  constructor(message = "This feature is not implemented yet", details) {
    super(message, details);
    this.name = "NotImplementedError";
    this.message = message;
  }
}
const errors = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ApplicationError,
  ForbiddenError,
  HttpError,
  NotFoundError,
  NotImplementedError,
  PaginationError,
  PayloadTooLargeError,
  PolicyError,
  RateLimitError,
  UnauthorizedError,
  ValidationError,
  YupValidationError
}, Symbol.toStringTag, { value: "Module" }));
const handleYupError = (error, errorMessage) => {
  throw new YupValidationError(error, errorMessage);
};
const defaultValidationParam = { strict: true, abortEarly: false };
const validateYupSchema = (schema, options = {}) => async (body, errorMessage) => {
  try {
    const optionsWithDefaults = defaults(defaultValidationParam, options);
    const result = await schema.validate(body, optionsWithDefaults);
    return result;
  } catch (e) {
    if (e instanceof yup$1.ValidationError) {
      handleYupError(e, errorMessage);
    }
    throw e;
  }
};
const validateYupSchemaSync = (schema, options = {}) => (body, errorMessage) => {
  try {
    const optionsWithDefaults = defaults(defaultValidationParam, options);
    return schema.validateSync(body, optionsWithDefaults);
  } catch (e) {
    if (e instanceof yup$1.ValidationError) {
      handleYupError(e, errorMessage);
    }
    throw e;
  }
};
const GROUP_OPERATORS = ["$and", "$or"];
const WHERE_OPERATORS = [
  "$not",
  "$in",
  "$notIn",
  "$eq",
  "$eqi",
  "$ne",
  "$nei",
  "$gt",
  "$gte",
  "$lt",
  "$lte",
  "$null",
  "$notNull",
  "$between",
  "$startsWith",
  "$endsWith",
  "$startsWithi",
  "$endsWithi",
  "$contains",
  "$notContains",
  "$containsi",
  "$notContainsi",
  // Experimental, only for internal use
  "$jsonSupersetOf"
];
const CAST_OPERATORS = [
  "$not",
  "$in",
  "$notIn",
  "$eq",
  "$ne",
  "$gt",
  "$gte",
  "$lt",
  "$lte",
  "$between"
];
const ARRAY_OPERATORS = ["$in", "$notIn", "$between"];
const OPERATORS = {
  where: WHERE_OPERATORS,
  cast: CAST_OPERATORS,
  group: GROUP_OPERATORS,
  array: ARRAY_OPERATORS
};
const OPERATORS_LOWERCASE = Object.fromEntries(
  Object.entries(OPERATORS).map(([key, values]) => [
    key,
    values.map((value) => value.toLowerCase())
  ])
);
const isObjKey = (key, obj) => {
  return key in obj;
};
const isOperatorOfType = (type, key, ignoreCase = false) => {
  if (ignoreCase) {
    return OPERATORS_LOWERCASE[type]?.includes(key.toLowerCase()) ?? false;
  }
  if (isObjKey(type, OPERATORS)) {
    return OPERATORS[type]?.includes(key) ?? false;
  }
  return false;
};
const isOperator = (key, ignoreCase = false) => {
  return Object.keys(OPERATORS).some((type) => isOperatorOfType(type, key, ignoreCase));
};
const { ID_ATTRIBUTE: ID_ATTRIBUTE$3, DOC_ID_ATTRIBUTE: DOC_ID_ATTRIBUTE$3, PUBLISHED_AT_ATTRIBUTE } = constants$1;
class InvalidOrderError extends Error {
  constructor() {
    super();
    this.message = "Invalid order. order can only be one of asc|desc|ASC|DESC";
  }
}
class InvalidSortError extends Error {
  constructor() {
    super();
    this.message = "Invalid sort parameter. Expected a string, an array of strings, a sort object or an array of sort objects";
  }
}
function validateOrder(order) {
  if (!isString(order) || !["asc", "desc"].includes(order.toLocaleLowerCase())) {
    throw new InvalidOrderError();
  }
}
const convertCountQueryParams = (countQuery) => {
  return parseType({ type: "boolean", value: countQuery });
};
const convertOrderingQueryParams = (ordering) => {
  return ordering;
};
const isPlainObject = (value) => ___default.isPlainObject(value);
const isStringArray$3 = (value) => isArray(value) && value.every(isString);
const createTransformer = ({ getModel }) => {
  const convertSortQueryParams = (sortQuery) => {
    if (typeof sortQuery === "string") {
      return convertStringSortQueryParam(sortQuery);
    }
    if (isStringArray$3(sortQuery)) {
      return sortQuery.flatMap((sortValue) => convertStringSortQueryParam(sortValue));
    }
    if (Array.isArray(sortQuery)) {
      return sortQuery.map((sortValue) => convertNestedSortQueryParam(sortValue));
    }
    if (isPlainObject(sortQuery)) {
      return convertNestedSortQueryParam(sortQuery);
    }
    throw new InvalidSortError();
  };
  const convertStringSortQueryParam = (sortQuery) => {
    return sortQuery.split(",").map((value) => convertSingleSortQueryParam(value));
  };
  const convertSingleSortQueryParam = (sortQuery) => {
    if (!sortQuery) {
      return {};
    }
    if (!isString(sortQuery)) {
      throw new Error("Invalid sort query");
    }
    const [field, order = "asc"] = sortQuery.split(":");
    if (field.length === 0) {
      throw new Error("Field cannot be empty");
    }
    validateOrder(order);
    return ___default.set({}, field, order);
  };
  const convertNestedSortQueryParam = (sortQuery) => {
    const transformedSort = {};
    for (const field of Object.keys(sortQuery)) {
      const order = sortQuery[field];
      if (isPlainObject(order)) {
        transformedSort[field] = convertNestedSortQueryParam(order);
      } else if (typeof order === "string") {
        validateOrder(order);
        transformedSort[field] = order;
      } else {
        throw Error(`Invalid sort type expected object or string got ${typeof order}`);
      }
    }
    return transformedSort;
  };
  const convertStartQueryParams = (startQuery) => {
    const startAsANumber = toNumber(startQuery);
    if (!___default.isInteger(startAsANumber) || startAsANumber < 0) {
      throw new Error(`convertStartQueryParams expected a positive integer got ${startAsANumber}`);
    }
    return startAsANumber;
  };
  const convertLimitQueryParams = (limitQuery) => {
    const limitAsANumber = toNumber(limitQuery);
    if (!___default.isInteger(limitAsANumber) || limitAsANumber !== -1 && limitAsANumber < 0) {
      throw new Error(`convertLimitQueryParams expected a positive integer got ${limitAsANumber}`);
    }
    if (limitAsANumber === -1) {
      return void 0;
    }
    return limitAsANumber;
  };
  const convertPageQueryParams = (page) => {
    const pageVal = toNumber(page);
    if (!isInteger(pageVal) || pageVal <= 0) {
      throw new PaginationError(
        `Invalid 'page' parameter. Expected an integer > 0, received: ${page}`
      );
    }
    return pageVal;
  };
  const convertPageSizeQueryParams = (pageSize, page) => {
    const pageSizeVal = toNumber(pageSize);
    if (!isInteger(pageSizeVal) || pageSizeVal <= 0) {
      throw new PaginationError(
        `Invalid 'pageSize' parameter. Expected an integer > 0, received: ${page}`
      );
    }
    return pageSizeVal;
  };
  const validatePaginationParams = (page, pageSize, start, limit) => {
    const isPagePagination = !isNil(page) || !isNil(pageSize);
    const isOffsetPagination = !isNil(start) || !isNil(limit);
    if (isPagePagination && isOffsetPagination) {
      throw new PaginationError(
        "Invalid pagination attributes. You cannot use page and offset pagination in the same query"
      );
    }
  };
  class InvalidPopulateError extends Error {
    constructor() {
      super();
      this.message = "Invalid populate parameter. Expected a string, an array of strings, a populate object";
    }
  }
  const convertPopulateQueryParams = (populate2, schema, depth = 0) => {
    if (depth === 0 && populate2 === "*") {
      return true;
    }
    if (typeof populate2 === "string") {
      return populate2.split(",").map((value) => ___default.trim(value));
    }
    if (Array.isArray(populate2)) {
      return ___default.uniq(
        populate2.flatMap((value) => {
          if (typeof value !== "string") {
            throw new InvalidPopulateError();
          }
          return value.split(",").map((value2) => ___default.trim(value2));
        })
      );
    }
    if (___default.isPlainObject(populate2)) {
      return convertPopulateObject(populate2, schema);
    }
    throw new InvalidPopulateError();
  };
  const hasPopulateFragmentDefined = (populate2) => {
    return typeof populate2 === "object" && "on" in populate2 && !isNil(populate2.on);
  };
  const hasCountDefined = (populate2) => {
    return typeof populate2 === "object" && "count" in populate2 && typeof populate2.count === "boolean";
  };
  const convertPopulateObject = (populate2, schema) => {
    if (!schema) {
      return {};
    }
    const { attributes } = schema;
    return Object.entries(populate2).reduce((acc, [key, subPopulate]) => {
      if (___default.isString(subPopulate)) {
        try {
          const subPopulateAsBoolean = parseType({ type: "boolean", value: subPopulate });
          return subPopulateAsBoolean ? { ...acc, [key]: true } : acc;
        } catch {
        }
      }
      if (___default.isBoolean(subPopulate)) {
        return subPopulate === true ? { ...acc, [key]: true } : acc;
      }
      const attribute = attributes[key];
      if (!attribute) {
        return acc;
      }
      const isMorphLikeRelationalAttribute = isDynamicZoneAttribute(attribute) || isMorphToRelationalAttribute(attribute);
      if (isMorphLikeRelationalAttribute) {
        const hasInvalidProperties = Object.keys(subPopulate).some(
          (key2) => !["populate", "on", "count"].includes(key2)
        );
        if (hasInvalidProperties) {
          throw new Error(
            `Invalid nested populate for ${schema.info?.singularName}.${key} (${schema.uid}). Expected a fragment ("on") or "count" but found ${JSON.stringify(subPopulate)}`
          );
        }
        if ("populate" in subPopulate && subPopulate.populate !== "*") {
          throw new Error(
            `Invalid nested population query detected. When using 'populate' within polymorphic structures, its value must be '*' to indicate all second level links. Specific field targeting is not supported here. Consider using the fragment API for more granular population control.`
          );
        }
        const newSubPopulate = {};
        if ("populate" in subPopulate) {
          Object.assign(newSubPopulate, { populate: true });
        }
        if (hasPopulateFragmentDefined(subPopulate)) {
          Object.assign(newSubPopulate, {
            on: Object.entries(subPopulate.on).reduce(
              (acc2, [type, typeSubPopulate]) => ({
                ...acc2,
                [type]: convertNestedPopulate(typeSubPopulate, getModel(type))
              }),
              {}
            )
          });
        }
        if (hasCountDefined(subPopulate)) {
          Object.assign(newSubPopulate, { count: subPopulate.count });
        }
        return { ...acc, [key]: newSubPopulate };
      }
      if (!isMorphLikeRelationalAttribute && hasPopulateFragmentDefined(subPopulate)) {
        throw new Error(`Using fragments is not permitted to populate "${key}" in "${schema.uid}"`);
      }
      let targetSchemaUID;
      if (attribute.type === "relation") {
        targetSchemaUID = attribute.target;
      } else if (attribute.type === "component") {
        targetSchemaUID = attribute.component;
      } else if (attribute.type === "media") {
        targetSchemaUID = "plugin::upload.file";
      } else {
        return acc;
      }
      const targetSchema = getModel(targetSchemaUID);
      if (!targetSchema) {
        return acc;
      }
      const populateObject = convertNestedPopulate(subPopulate, targetSchema);
      if (!populateObject) {
        return acc;
      }
      return {
        ...acc,
        [key]: populateObject
      };
    }, {});
  };
  const convertNestedPopulate = (subPopulate, schema) => {
    if (___default.isString(subPopulate)) {
      return parseType({ type: "boolean", value: subPopulate, forceCast: true });
    }
    if (___default.isBoolean(subPopulate)) {
      return subPopulate;
    }
    if (!isPlainObject(subPopulate)) {
      throw new Error(`Invalid nested populate. Expected '*' or an object`);
    }
    const { sort: sort2, filters: filters2, fields: fields2, populate: populate2, count, ordering, page, pageSize, start, limit } = subPopulate;
    const query = {};
    if (sort2) {
      query.orderBy = convertSortQueryParams(sort2);
    }
    if (filters2) {
      query.where = convertFiltersQueryParams(filters2, schema);
    }
    if (fields2) {
      query.select = convertFieldsQueryParams(fields2);
    }
    if (populate2) {
      query.populate = convertPopulateQueryParams(populate2, schema);
    }
    if (count) {
      query.count = convertCountQueryParams(count);
    }
    if (ordering) {
      query.ordering = convertOrderingQueryParams(ordering);
    }
    validatePaginationParams(page, pageSize, start, limit);
    if (!isNil(page)) {
      query.page = convertPageQueryParams(page);
    }
    if (!isNil(pageSize)) {
      query.pageSize = convertPageSizeQueryParams(pageSize, page);
    }
    if (!isNil(start)) {
      query.offset = convertStartQueryParams(start);
    }
    if (!isNil(limit)) {
      query.limit = convertLimitQueryParams(limit);
    }
    return query;
  };
  const convertFieldsQueryParams = (fields2, depth = 0) => {
    if (depth === 0 && fields2 === "*") {
      return void 0;
    }
    if (typeof fields2 === "string") {
      const fieldsValues = fields2.split(",").map((value) => ___default.trim(value));
      return ___default.uniq([ID_ATTRIBUTE$3, DOC_ID_ATTRIBUTE$3, ...fieldsValues]);
    }
    if (isStringArray$3(fields2)) {
      const fieldsValues = fields2.flatMap((value) => convertFieldsQueryParams(value, depth + 1)).filter((v) => !isNil(v));
      return ___default.uniq([ID_ATTRIBUTE$3, DOC_ID_ATTRIBUTE$3, ...fieldsValues]);
    }
    throw new Error("Invalid fields parameter. Expected a string or an array of strings");
  };
  const isValidSchemaAttribute = (key, schema) => {
    if ([DOC_ID_ATTRIBUTE$3, ID_ATTRIBUTE$3].includes(key)) {
      return true;
    }
    if (!schema) {
      return false;
    }
    return Object.keys(schema.attributes).includes(key);
  };
  const convertFiltersQueryParams = (filters2, schema) => {
    if (!isObject(filters2)) {
      throw new Error("The filters parameter must be an object or an array");
    }
    const filtersCopy = cloneDeep(filters2);
    return convertAndSanitizeFilters(filtersCopy, schema);
  };
  const convertAndSanitizeFilters = (filters2, schema) => {
    if (Array.isArray(filters2)) {
      return filters2.map((filter) => convertAndSanitizeFilters(filter, schema)).filter((filter) => !isPlainObject(filter) || !isEmpty(filter));
    }
    if (!isPlainObject(filters2)) {
      return filters2;
    }
    const removeOperator = (operator) => delete filters2[operator];
    for (const [key, value] of Object.entries(filters2)) {
      const attribute = get(key, schema?.attributes);
      const validKey = isOperator(key) || isValidSchemaAttribute(key, schema);
      if (!validKey) {
        removeOperator(key);
      } else if (attribute) {
        if (attribute.type === "relation") {
          filters2[key] = convertAndSanitizeFilters(value, getModel(attribute.target));
        } else if (attribute.type === "component") {
          filters2[key] = convertAndSanitizeFilters(value, getModel(attribute.component));
        } else if (attribute.type === "media") {
          filters2[key] = convertAndSanitizeFilters(value, getModel("plugin::upload.file"));
        } else if (attribute.type === "dynamiczone") {
          removeOperator(key);
        } else if (attribute.type === "password") {
          removeOperator(key);
        } else {
          filters2[key] = convertAndSanitizeFilters(value, schema);
        }
      } else if (["$null", "$notNull"].includes(key)) {
        filters2[key] = parseType({ type: "boolean", value: filters2[key], forceCast: true });
      } else if (isObject(value)) {
        filters2[key] = convertAndSanitizeFilters(value, schema);
      }
      if (isPlainObject(filters2[key]) && isEmpty(filters2[key])) {
        removeOperator(key);
      }
    }
    return filters2;
  };
  const convertStatusParams = (status, query = {}) => {
    query.filters = ({ meta }) => {
      const contentType = getModel(meta.uid);
      if (!contentType || !hasDraftAndPublish(contentType)) {
        return {};
      }
      return { [PUBLISHED_AT_ATTRIBUTE]: { $null: status === "draft" } };
    };
  };
  const transformQueryParams = (uid, params) => {
    const schema = getModel(uid);
    const query = {};
    const { _q, sort: sort2, filters: filters2, fields: fields2, populate: populate2, page, pageSize, start, limit, status, ...rest } = params;
    if (!isNil(status)) {
      convertStatusParams(status, query);
    }
    if (!isNil(_q)) {
      query._q = _q;
    }
    if (!isNil(sort2)) {
      query.orderBy = convertSortQueryParams(sort2);
    }
    if (!isNil(filters2)) {
      query.where = convertFiltersQueryParams(filters2, schema);
    }
    if (!isNil(fields2)) {
      query.select = convertFieldsQueryParams(fields2);
    }
    if (!isNil(populate2)) {
      query.populate = convertPopulateQueryParams(populate2, schema);
    }
    validatePaginationParams(page, pageSize, start, limit);
    if (!isNil(page)) {
      query.page = convertPageQueryParams(page);
    }
    if (!isNil(pageSize)) {
      query.pageSize = convertPageSizeQueryParams(pageSize, page);
    }
    if (!isNil(start)) {
      query.offset = convertStartQueryParams(start);
    }
    if (!isNil(limit)) {
      query.limit = convertLimitQueryParams(limit);
    }
    return {
      ...rest,
      ...query
    };
  };
  return {
    private_convertSortQueryParams: convertSortQueryParams,
    private_convertStartQueryParams: convertStartQueryParams,
    private_convertLimitQueryParams: convertLimitQueryParams,
    private_convertPopulateQueryParams: convertPopulateQueryParams,
    private_convertFiltersQueryParams: convertFiltersQueryParams,
    private_convertFieldsQueryParams: convertFieldsQueryParams,
    transformQueryParams
  };
};
const convertQueryParams = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createTransformer
}, Symbol.toStringTag, { value: "Module" }));
function pipe(...fns) {
  const [firstFn, ...fnRest] = fns;
  return async (...args) => {
    let res = await firstFn.apply(firstFn, args);
    for (let i = 0; i < fnRest.length; i += 1) {
      res = await fnRest[i](res);
    }
    return res;
  };
}
const map = curry(pMap);
const reduce = (mixedArray) => async (iteratee, initialValue) => {
  let acc = initialValue;
  for (let i = 0; i < mixedArray.length; i += 1) {
    acc = await iteratee(acc, await mixedArray[i], i);
  }
  return acc;
};
const async = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  map,
  pipe,
  reduce
}, Symbol.toStringTag, { value: "Module" }));
const visitor$8 = ({ key, attribute }, { remove: remove2 }) => {
  if (attribute?.type === "password") {
    remove2(key);
  }
};
const visitor$7 = ({ schema, key, attribute }, { remove: remove2 }) => {
  if (!attribute) {
    return;
  }
  const isPrivate = attribute.private === true || isPrivateAttribute(schema, key);
  if (isPrivate) {
    remove2(key);
  }
};
const MANY_RELATIONS = ["oneToMany", "manyToMany"];
const getRelationalFields = (contentType) => {
  return Object.keys(contentType.attributes).filter((attributeName) => {
    return contentType.attributes[attributeName].type === "relation";
  });
};
const isOneToAny = (attribute) => isRelationalAttribute(attribute) && ["oneToOne", "oneToMany"].includes(attribute.relation);
const isManyToAny = (attribute) => isRelationalAttribute(attribute) && ["manyToMany", "manyToOne"].includes(attribute.relation);
const isAnyToOne = (attribute) => isRelationalAttribute(attribute) && ["oneToOne", "manyToOne"].includes(attribute.relation);
const isAnyToMany = (attribute) => isRelationalAttribute(attribute) && ["oneToMany", "manyToMany"].includes(attribute.relation);
const isPolymorphic = (attribute) => ["morphOne", "morphMany", "morphToOne", "morphToMany"].includes(attribute.relation);
const constants = {
  MANY_RELATIONS
};
const VALID_RELATION_ORDERING_KEYS = {
  strict: isBoolean
};
const relations = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  VALID_RELATION_ORDERING_KEYS,
  constants,
  getRelationalFields,
  isAnyToMany,
  isAnyToOne,
  isManyToAny,
  isOneToAny,
  isPolymorphic
}, Symbol.toStringTag, { value: "Module" }));
const ACTIONS_TO_VERIFY$1 = ["find"];
const { CREATED_BY_ATTRIBUTE: CREATED_BY_ATTRIBUTE$1, UPDATED_BY_ATTRIBUTE: UPDATED_BY_ATTRIBUTE$1 } = constants$1;
const removeRestrictedRelations = (auth) => async ({ data, key, attribute, schema }, { remove: remove2, set }) => {
  if (!attribute) {
    return;
  }
  const isRelation = attribute.type === "relation";
  if (!isRelation) {
    return;
  }
  const handleMorphRelation = async () => {
    const elements = data[key];
    if ("connect" in elements || "set" in elements || "disconnect" in elements) {
      const newValue = {};
      const connect = await handleMorphElements(elements.connect || []);
      const relSet = await handleMorphElements(elements.set || []);
      const disconnect = await handleMorphElements(elements.disconnect || []);
      if (connect.length > 0) {
        newValue.connect = connect;
      }
      if (relSet.length > 0) {
        newValue.set = relSet;
      }
      if (disconnect.length > 0) {
        newValue.disconnect = disconnect;
      }
      if ("options" in elements && typeof elements.options === "object" && elements.options !== null) {
        const filteredOptions = {};
        Object.keys(elements.options).forEach((key2) => {
          const validator = VALID_RELATION_ORDERING_KEYS[key2];
          if (validator && validator(elements.options[key2])) {
            filteredOptions[key2] = elements.options[key2];
          }
        });
        newValue.options = filteredOptions;
      } else {
        newValue.options = {};
      }
      set(key, newValue);
    } else {
      const newMorphValue = await handleMorphElements(elements);
      if (newMorphValue.length) {
        set(key, newMorphValue);
      }
    }
  };
  const handleMorphElements = async (elements) => {
    const allowedElements = [];
    if (!isArray(elements)) {
      return allowedElements;
    }
    for (const element of elements) {
      if (!isObject(element) || !("__type" in element)) {
        continue;
      }
      const scopes = ACTIONS_TO_VERIFY$1.map((action) => `${element.__type}.${action}`);
      const isAllowed = await hasAccessToSomeScopes$1(scopes, auth);
      if (isAllowed) {
        allowedElements.push(element);
      }
    }
    return allowedElements;
  };
  const handleRegularRelation = async () => {
    const scopes = ACTIONS_TO_VERIFY$1.map((action) => `${attribute.target}.${action}`);
    const isAllowed = await hasAccessToSomeScopes$1(scopes, auth);
    if (!isAllowed) {
      remove2(key);
    }
  };
  const isCreatorRelation = [CREATED_BY_ATTRIBUTE$1, UPDATED_BY_ATTRIBUTE$1].includes(key);
  if (isMorphToRelationalAttribute(attribute)) {
    await handleMorphRelation();
    return;
  }
  if (isCreatorRelation && schema.options?.populateCreatorFields) {
    return;
  }
  await handleRegularRelation();
};
const hasAccessToSomeScopes$1 = async (scopes, auth) => {
  for (const scope of scopes) {
    try {
      await strapi.auth.verify(auth, { scope });
      return true;
    } catch {
      continue;
    }
  }
  return false;
};
const visitor$6 = ({ key, attribute }, { remove: remove2 }) => {
  if (isMorphToRelationalAttribute(attribute)) {
    remove2(key);
  }
};
const visitor$5 = ({ key, attribute }, { remove: remove2 }) => {
  if (isDynamicZoneAttribute(attribute)) {
    remove2(key);
  }
};
const removeDisallowedFields = (allowedFields = null) => ({ key, path: { attribute: path } }, { remove: remove2 }) => {
  if (allowedFields === null) {
    return;
  }
  if (!(isArray(allowedFields) && allowedFields.every(isString))) {
    throw new TypeError(
      `Expected array of strings for allowedFields but got "${typeof allowedFields}"`
    );
  }
  if (isNil(path)) {
    return;
  }
  const containedPaths = getContainedPaths$1(path);
  const isPathAllowed = allowedFields.some(
    (p) => containedPaths.includes(p) || p.startsWith(`${path}.`)
  );
  if (isPathAllowed) {
    return;
  }
  remove2(key);
};
const getContainedPaths$1 = (path) => {
  const parts = toPath(path);
  return parts.reduce((acc, value, index2, list) => {
    return [...acc, list.slice(0, index2 + 1).join(".")];
  }, []);
};
const removeRestrictedFields = (restrictedFields = null) => ({ key, path: { attribute: path } }, { remove: remove2 }) => {
  if (restrictedFields === null) {
    remove2(key);
    return;
  }
  if (!(isArray(restrictedFields) && restrictedFields.every(isString))) {
    throw new TypeError(
      `Expected array of strings for restrictedFields but got "${typeof restrictedFields}"`
    );
  }
  if (restrictedFields.includes(path)) {
    remove2(key);
    return;
  }
  const isRestrictedNested = restrictedFields.some(
    (allowedPath) => path?.toString().startsWith(`${allowedPath}.`)
  );
  if (isRestrictedNested) {
    remove2(key);
  }
};
const visitor$4 = ({ schema, key, value }, { set }) => {
  if (key === "" && value === "*") {
    const { attributes } = schema;
    const newPopulateQuery = Object.entries(attributes).filter(
      ([, attribute]) => ["relation", "component", "media", "dynamiczone"].includes(attribute.type)
    ).reduce((acc, [key2]) => ({ ...acc, [key2]: true }), {});
    set("", newPopulateQuery);
  }
};
const index$4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  expandWildcardPopulate: visitor$4,
  removeDisallowedFields,
  removeDynamicZones: visitor$5,
  removeMorphToRelations: visitor$6,
  removePassword: visitor$8,
  removePrivate: visitor$7,
  removeRestrictedFields,
  removeRestrictedRelations
}, Symbol.toStringTag, { value: "Module" }));
const DEFAULT_PATH = { raw: null, attribute: null };
const traverseFactory = () => {
  const state = {
    parsers: [],
    interceptors: [],
    ignore: [],
    handlers: {
      attributes: [],
      common: []
    }
  };
  const traverse = async (visitor2, options, data) => {
    const { path = DEFAULT_PATH, parent, schema, getModel } = options ?? {};
    for (const { predicate, handler } of state.interceptors) {
      if (predicate(data)) {
        return handler(visitor2, options, data, { recurse: traverse });
      }
    }
    const parser = state.parsers.find((parser2) => parser2.predicate(data))?.parser;
    const utils2 = parser?.(data);
    if (!utils2) {
      return data;
    }
    let out = utils2.transform(data);
    const keys = utils2.keys(out);
    for (const key of keys) {
      const attribute = schema?.attributes?.[key];
      const newPath = { ...path };
      newPath.raw = isNil(path.raw) ? key : `${path.raw}.${key}`;
      if (!isNil(attribute)) {
        newPath.attribute = isNil(path.attribute) ? key : `${path.attribute}.${key}`;
      }
      const visitorOptions = {
        key,
        value: utils2.get(key, out),
        attribute,
        schema,
        path: newPath,
        data: out,
        getModel,
        parent
      };
      const transformUtils = {
        remove(key2) {
          out = utils2.remove(key2, out);
        },
        set(key2, value2) {
          out = utils2.set(key2, value2, out);
        },
        recurse: traverse
      };
      await visitor2(visitorOptions, pick(["remove", "set"], transformUtils));
      const value = utils2.get(key, out);
      const createContext = () => ({
        key,
        value,
        attribute,
        schema,
        path: newPath,
        data: out,
        visitor: visitor2,
        getModel,
        parent
      });
      const ignoreCtx = createContext();
      const shouldIgnore = state.ignore.some((predicate) => predicate(ignoreCtx));
      if (shouldIgnore) {
        continue;
      }
      const handlers = [...state.handlers.common, ...state.handlers.attributes];
      for await (const handler of handlers) {
        const ctx = createContext();
        const pass = await handler.predicate(ctx);
        if (pass) {
          await handler.handler(ctx, pick(["recurse", "set"], transformUtils));
        }
      }
    }
    return out;
  };
  return {
    traverse,
    intercept(predicate, handler) {
      state.interceptors.push({ predicate, handler });
      return this;
    },
    parse(predicate, parser) {
      state.parsers.push({ predicate, parser });
      return this;
    },
    ignore(predicate) {
      state.ignore.push(predicate);
      return this;
    },
    on(predicate, handler) {
      state.handlers.common.push({ predicate, handler });
      return this;
    },
    onAttribute(predicate, handler) {
      state.handlers.attributes.push({ predicate, handler });
      return this;
    },
    onRelation(handler) {
      return this.onAttribute(({ attribute }) => attribute?.type === "relation", handler);
    },
    onMedia(handler) {
      return this.onAttribute(({ attribute }) => attribute?.type === "media", handler);
    },
    onComponent(handler) {
      return this.onAttribute(({ attribute }) => attribute?.type === "component", handler);
    },
    onDynamicZone(handler) {
      return this.onAttribute(({ attribute }) => attribute?.type === "dynamiczone", handler);
    }
  };
};
const isObj$2 = (value) => isObject(value);
const filters = traverseFactory().intercept(
  // Intercept filters arrays and apply the traversal to each one individually
  isArray,
  async (visitor2, options, filters2, { recurse }) => {
    return Promise.all(
      filters2.map((filter, i) => {
        const newPath = options.path ? { ...options.path, raw: `${options.path.raw}[${i}]` } : options.path;
        return recurse(visitor2, { ...options, path: newPath }, filter);
      })
      // todo: move that to the visitors
    ).then((res) => res.filter((val) => !(isObject(val) && isEmpty(val))));
  }
).intercept(
  // Ignore non object filters and return the value as-is
  (filters2) => !isObject(filters2),
  (_2, __, filters2) => {
    return filters2;
  }
).parse(isObj$2, () => ({
  transform: cloneDeep,
  remove(key, data) {
    return omit(key, data);
  },
  set(key, value, data) {
    return { ...data, [key]: value };
  },
  keys(data) {
    return Object.keys(data);
  },
  get(key, data) {
    return data[key];
  }
})).ignore(({ value }) => isNil(value)).on(
  ({ attribute }) => isNil(attribute),
  async ({ key, visitor: visitor2, path, value, schema, getModel, attribute }, { set, recurse }) => {
    const parent = { key, path, schema, attribute };
    set(key, await recurse(visitor2, { schema, path, getModel, parent }, value));
  }
).onRelation(
  async ({ key, attribute, visitor: visitor2, path, value, schema, getModel }, { set, recurse }) => {
    const isMorphRelation = attribute.relation.toLowerCase().startsWith("morph");
    if (isMorphRelation) {
      return;
    }
    const parent = { key, path, schema, attribute };
    const targetSchemaUID = attribute.target;
    const targetSchema = getModel(targetSchemaUID);
    const newValue = await recurse(
      visitor2,
      { schema: targetSchema, path, getModel, parent },
      value
    );
    set(key, newValue);
  }
).onComponent(
  async ({ key, attribute, visitor: visitor2, path, schema, value, getModel }, { set, recurse }) => {
    const parent = { key, path, schema, attribute };
    const targetSchema = getModel(attribute.component);
    const newValue = await recurse(
      visitor2,
      { schema: targetSchema, path, getModel, parent },
      value
    );
    set(key, newValue);
  }
).onMedia(async ({ key, visitor: visitor2, path, schema, attribute, value, getModel }, { set, recurse }) => {
  const parent = { key, path, schema, attribute };
  const targetSchemaUID = "plugin::upload.file";
  const targetSchema = getModel(targetSchemaUID);
  const newValue = await recurse(
    visitor2,
    { schema: targetSchema, path, getModel, parent },
    value
  );
  set(key, newValue);
});
const traverseQueryFilters = curry(filters.traverse);
const ORDERS = { asc: "asc", desc: "desc" };
const ORDER_VALUES = Object.values(ORDERS);
const isSortOrder = (value) => ORDER_VALUES.includes(value.toLowerCase());
const isStringArray$2 = (value) => Array.isArray(value) && value.every(isString);
const isObjectArray = (value) => Array.isArray(value) && value.every(isObject);
const isNestedSorts = (value) => isString(value) && value.split(",").length > 1;
const isObj$1 = (value) => isObject(value);
const sort = traverseFactory().intercept(
  // String with chained sorts (foo,bar,foobar) => split, map(recurse), then recompose
  isNestedSorts,
  async (visitor2, options, sort2, { recurse }) => {
    return Promise.all(
      sort2.split(",").map(trim).map((nestedSort) => recurse(visitor2, options, nestedSort))
    ).then((res) => res.filter((part) => !isEmpty(part)).join(","));
  }
).intercept(
  // Array of strings ['foo', 'foo,bar'] => map(recurse), then filter out empty items
  isStringArray$2,
  async (visitor2, options, sort2, { recurse }) => {
    return Promise.all(sort2.map((nestedSort) => recurse(visitor2, options, nestedSort))).then(
      (res) => res.filter((nestedSort) => !isEmpty(nestedSort))
    );
  }
).intercept(
  // Array of objects [{ foo: 'asc' }, { bar: 'desc', baz: 'asc' }] => map(recurse), then filter out empty items
  isObjectArray,
  async (visitor2, options, sort2, { recurse }) => {
    return Promise.all(sort2.map((nestedSort) => recurse(visitor2, options, nestedSort))).then(
      (res) => res.filter((nestedSort) => !isEmpty(nestedSort))
    );
  }
).parse(isString, () => {
  const tokenize = pipe$1(split("."), map$1(split(":")), flatten);
  const recompose = (parts) => {
    if (parts.length === 0) {
      return void 0;
    }
    return parts.reduce((acc, part) => {
      if (isEmpty(part)) {
        return acc;
      }
      if (acc === "") {
        return part;
      }
      return isSortOrder(part) ? `${acc}:${part}` : `${acc}.${part}`;
    }, "");
  };
  return {
    transform: trim,
    remove(key, data) {
      const [root] = tokenize(data);
      return root === key ? void 0 : data;
    },
    set(key, value, data) {
      const [root] = tokenize(data);
      if (root !== key) {
        return data;
      }
      return isNil(value) ? root : `${root}.${value}`;
    },
    keys(data) {
      const v = first(tokenize(data));
      return v ? [v] : [];
    },
    get(key, data) {
      const [root, ...rest] = tokenize(data);
      return key === root ? recompose(rest) : void 0;
    }
  };
}).parse(isObj$1, () => ({
  transform: cloneDeep,
  remove(key, data) {
    const { [key]: ignored, ...rest } = data;
    return rest;
  },
  set(key, value, data) {
    return { ...data, [key]: value };
  },
  keys(data) {
    return Object.keys(data);
  },
  get(key, data) {
    return data[key];
  }
})).onRelation(
  async ({ key, value, attribute, visitor: visitor2, path, getModel, schema }, { set, recurse }) => {
    const isMorphRelation = attribute.relation.toLowerCase().startsWith("morph");
    if (isMorphRelation) {
      return;
    }
    const parent = { key, path, schema, attribute };
    const targetSchemaUID = attribute.target;
    const targetSchema = getModel(targetSchemaUID);
    const newValue = await recurse(
      visitor2,
      { schema: targetSchema, path, getModel, parent },
      value
    );
    set(key, newValue);
  }
).onMedia(async ({ key, path, schema, attribute, visitor: visitor2, value, getModel }, { recurse, set }) => {
  const parent = { key, path, schema, attribute };
  const targetSchemaUID = "plugin::upload.file";
  const targetSchema = getModel(targetSchemaUID);
  const newValue = await recurse(
    visitor2,
    { schema: targetSchema, path, getModel, parent },
    value
  );
  set(key, newValue);
}).onComponent(
  async ({ key, value, visitor: visitor2, path, schema, attribute, getModel }, { recurse, set }) => {
    const parent = { key, path, schema, attribute };
    const targetSchema = getModel(attribute.component);
    const newValue = await recurse(
      visitor2,
      { schema: targetSchema, path, getModel, parent },
      value
    );
    set(key, newValue);
  }
);
const traverseQuerySort = curry(sort.traverse);
const isKeyword = (keyword) => {
  return ({ key, attribute }) => {
    return !attribute && keyword === key;
  };
};
const isWildcard = (value) => value === "*";
const isPopulateString = (value) => {
  return isString(value) && !isWildcard(value);
};
const isStringArray$1 = (value) => isArray(value) && value.every(isString);
const isObj = (value) => isObject(value);
const populate = traverseFactory().intercept(isPopulateString, async (visitor2, options, populate2, { recurse }) => {
  const populateObject = pathsToObjectPopulate([populate2]);
  const traversedPopulate = await recurse(visitor2, options, populateObject);
  const [result] = objectPopulateToPaths(traversedPopulate);
  return result;
}).intercept(isStringArray$1, async (visitor2, options, populate2, { recurse }) => {
  const paths = await Promise.all(
    populate2.map((subClause) => recurse(visitor2, options, subClause))
  );
  return paths.filter((item) => !isNil(item));
}).parse(isWildcard, () => ({
  /**
   * Since value is '*', we don't need to transform it
   */
  transform: identity,
  /**
   * '*' isn't a key/value structure, so regardless
   *  of the given key, it returns the data ('*')
   */
  get: (_key, data) => data,
  /**
   * '*' isn't a key/value structure, so regardless
   * of the given `key`, use `value` as the new `data`
   */
  set: (_key, value) => value,
  /**
   * '*' isn't a key/value structure, but we need to simulate at least one to enable
   * the data traversal. We're using '' since it represents a falsy string value
   */
  keys: constant([""]),
  /**
   * Removing '*' means setting it to undefined, regardless of the given key
   */
  remove: constant(void 0)
})).parse(isString, () => {
  const tokenize = split(".");
  const recompose = join(".");
  return {
    transform: trim,
    remove(key, data) {
      const [root] = tokenize(data);
      return root === key ? void 0 : data;
    },
    set(key, value, data) {
      const [root] = tokenize(data);
      if (root !== key) {
        return data;
      }
      return isNil(value) || isEmpty(value) ? root : `${root}.${value}`;
    },
    keys(data) {
      const v = first(tokenize(data));
      return v ? [v] : [];
    },
    get(key, data) {
      const [root, ...rest] = tokenize(data);
      return key === root ? recompose(rest) : void 0;
    }
  };
}).parse(isObj, () => ({
  transform: cloneDeep,
  remove(key, data) {
    const { [key]: ignored, ...rest } = data;
    return rest;
  },
  set(key, value, data) {
    return { ...data, [key]: value };
  },
  keys(data) {
    return Object.keys(data);
  },
  get(key, data) {
    return data[key];
  }
})).ignore(({ key, attribute }) => {
  return ["sort", "filters", "fields"].includes(key) && !attribute;
}).on(
  // Handle recursion on populate."populate"
  isKeyword("populate"),
  async ({ key, visitor: visitor2, path, value, schema, getModel, attribute }, { set, recurse }) => {
    const parent = { key, path, schema, attribute };
    const newValue = await recurse(visitor2, { schema, path, getModel, parent }, value);
    set(key, newValue);
  }
).on(
  isKeyword("on"),
  async ({ key, visitor: visitor2, path, value, getModel, parent }, { set, recurse }) => {
    const newOn = {};
    if (!isObj(value)) {
      return;
    }
    for (const [uid, subPopulate] of Object.entries(value)) {
      const model = getModel(uid);
      const newPath = { ...path, raw: `${path.raw}[${uid}]` };
      newOn[uid] = await recurse(
        visitor2,
        { schema: model, path: newPath, getModel, parent },
        subPopulate
      );
    }
    set(key, newOn);
  }
).onRelation(
  async ({ key, value, attribute, visitor: visitor2, path, schema, getModel }, { set, recurse }) => {
    if (isNil(value)) {
      return;
    }
    const parent = { key, path, schema, attribute };
    if (isMorphToRelationalAttribute(attribute)) {
      if (!isObject(value) || !("on" in value && isObject(value?.on))) {
        return;
      }
      const newValue2 = await recurse(
        visitor2,
        { schema, path, getModel, parent },
        { on: value?.on }
      );
      set(key, newValue2);
      return;
    }
    const targetSchemaUID = attribute.target;
    const targetSchema = getModel(targetSchemaUID);
    const newValue = await recurse(
      visitor2,
      { schema: targetSchema, path, getModel, parent },
      value
    );
    set(key, newValue);
  }
).onMedia(async ({ key, path, schema, attribute, visitor: visitor2, value, getModel }, { recurse, set }) => {
  if (isNil(value)) {
    return;
  }
  const parent = { key, path, schema, attribute };
  const targetSchemaUID = "plugin::upload.file";
  const targetSchema = getModel(targetSchemaUID);
  const newValue = await recurse(
    visitor2,
    { schema: targetSchema, path, getModel, parent },
    value
  );
  set(key, newValue);
}).onComponent(
  async ({ key, value, schema, visitor: visitor2, path, attribute, getModel }, { recurse, set }) => {
    if (isNil(value)) {
      return;
    }
    const parent = { key, path, schema, attribute };
    const targetSchema = getModel(attribute.component);
    const newValue = await recurse(
      visitor2,
      { schema: targetSchema, path, getModel, parent },
      value
    );
    set(key, newValue);
  }
).onDynamicZone(
  async ({ key, value, schema, visitor: visitor2, path, attribute, getModel }, { set, recurse }) => {
    if (isNil(value) || !isObject(value)) {
      return;
    }
    const parent = { key, path, schema, attribute };
    if ("on" in value && value.on) {
      const newOn = await recurse(visitor2, { schema, path, getModel, parent }, { on: value.on });
      set(key, newOn);
    }
  }
);
const traverseQueryPopulate = curry(populate.traverse);
const objectPopulateToPaths = (input) => {
  const paths = [];
  function traverse(currentObj, parentPath) {
    for (const [key, value] of Object.entries(currentObj)) {
      const currentPath = parentPath ? `${parentPath}.${key}` : key;
      if (value === true) {
        paths.push(currentPath);
      } else {
        traverse(value.populate, currentPath);
      }
    }
  }
  traverse(input, "");
  return paths;
};
const pathsToObjectPopulate = (input) => {
  const result = {};
  function traverse(object, keys) {
    const [first2, ...rest] = keys;
    if (rest.length === 0) {
      object[first2] = true;
    } else {
      if (!object[first2] || typeof object[first2] === "boolean") {
        object[first2] = { populate: {} };
      }
      traverse(object[first2].populate, rest);
    }
  }
  input.forEach((clause) => traverse(result, clause.split(".")));
  return result;
};
const isStringArray = (value) => {
  return isArray(value) && value.every(isString);
};
const fields = traverseFactory().intercept(isStringArray, async (visitor2, options, fields2, { recurse }) => {
  return Promise.all(fields2.map((field) => recurse(visitor2, options, field)));
}).intercept(
  (value) => isString(value) && value.includes(","),
  (visitor2, options, fields2, { recurse }) => {
    return Promise.all(fields2.split(",").map((field) => recurse(visitor2, options, field)));
  }
).intercept((value) => eq("*", value), constant("*")).parse(isString, () => ({
  transform: trim,
  remove(key, data) {
    return data === key ? void 0 : data;
  },
  set(_key, _value, data) {
    return data;
  },
  keys(data) {
    return [data];
  },
  get(key, data) {
    return key === data ? data : void 0;
  }
}));
const traverseQueryFields = curry(fields.traverse);
const index$3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  traverseQueryFields,
  traverseQueryFilters,
  traverseQueryPopulate,
  traverseQuerySort
}, Symbol.toStringTag, { value: "Module" }));
const { ID_ATTRIBUTE: ID_ATTRIBUTE$2, DOC_ID_ATTRIBUTE: DOC_ID_ATTRIBUTE$2 } = constants$1;
const sanitizePasswords = (ctx) => async (entity) => {
  if (!ctx.schema) {
    throw new Error("Missing schema in sanitizePasswords");
  }
  return traverseEntity$1(visitor$8, ctx, entity);
};
const defaultSanitizeOutput = async (ctx, entity) => {
  if (!ctx.schema) {
    throw new Error("Missing schema in defaultSanitizeOutput");
  }
  return traverseEntity$1(
    (...args) => {
      visitor$8(...args);
      visitor$7(...args);
    },
    ctx,
    entity
  );
};
const defaultSanitizeFilters = curry((ctx, filters2) => {
  if (!ctx.schema) {
    throw new Error("Missing schema in defaultSanitizeFilters");
  }
  return pipe(
    // Remove keys that are not attributes or valid operators
    traverseQueryFilters(({ key, attribute }, { remove: remove2 }) => {
      const isAttribute = !!attribute;
      if ([ID_ATTRIBUTE$2, DOC_ID_ATTRIBUTE$2].includes(key)) {
        return;
      }
      if (!isAttribute && !isOperator(key)) {
        remove2(key);
      }
    }, ctx),
    // Remove dynamic zones from filters
    traverseQueryFilters(visitor$5, ctx),
    // Remove morpTo relations from filters
    traverseQueryFilters(visitor$6, ctx),
    // Remove passwords from filters
    traverseQueryFilters(visitor$8, ctx),
    // Remove private from filters
    traverseQueryFilters(visitor$7, ctx),
    // Remove empty objects
    traverseQueryFilters(({ key, value }, { remove: remove2 }) => {
      if (isObject(value) && isEmpty(value)) {
        remove2(key);
      }
    }, ctx)
  )(filters2);
});
const defaultSanitizeSort = curry((ctx, sort2) => {
  if (!ctx.schema) {
    throw new Error("Missing schema in defaultSanitizeSort");
  }
  return pipe(
    // Remove non attribute keys
    traverseQuerySort(({ key, attribute }, { remove: remove2 }) => {
      if ([ID_ATTRIBUTE$2, DOC_ID_ATTRIBUTE$2].includes(key)) {
        return;
      }
      if (!attribute) {
        remove2(key);
      }
    }, ctx),
    // Remove dynamic zones from sort
    traverseQuerySort(visitor$5, ctx),
    // Remove morpTo relations from sort
    traverseQuerySort(visitor$6, ctx),
    // Remove private from sort
    traverseQuerySort(visitor$7, ctx),
    // Remove passwords from filters
    traverseQuerySort(visitor$8, ctx),
    // Remove keys for empty non-scalar values
    traverseQuerySort(({ key, attribute, value }, { remove: remove2 }) => {
      if ([ID_ATTRIBUTE$2, DOC_ID_ATTRIBUTE$2].includes(key)) {
        return;
      }
      if (!isScalarAttribute(attribute) && isEmpty(value)) {
        remove2(key);
      }
    }, ctx)
  )(sort2);
});
const defaultSanitizeFields = curry((ctx, fields2) => {
  if (!ctx.schema) {
    throw new Error("Missing schema in defaultSanitizeFields");
  }
  return pipe(
    // Only keep scalar attributes
    traverseQueryFields(({ key, attribute }, { remove: remove2 }) => {
      if ([ID_ATTRIBUTE$2, DOC_ID_ATTRIBUTE$2].includes(key)) {
        return;
      }
      if (isNil(attribute) || !isScalarAttribute(attribute)) {
        remove2(key);
      }
    }, ctx),
    // Remove private fields
    traverseQueryFields(visitor$7, ctx),
    // Remove password fields
    traverseQueryFields(visitor$8, ctx),
    // Remove nil values from fields array
    (value) => isArray(value) ? value.filter((field) => !isNil(field)) : value
  )(fields2);
});
const defaultSanitizePopulate = curry((ctx, populate2) => {
  if (!ctx.schema) {
    throw new Error("Missing schema in defaultSanitizePopulate");
  }
  return pipe(
    traverseQueryPopulate(visitor$4, ctx),
    traverseQueryPopulate(async ({ key, value, schema, attribute, getModel, path }, { set }) => {
      if (attribute) {
        return;
      }
      const parent = { key, path, schema, attribute };
      if (key === "sort") {
        set(key, await defaultSanitizeSort({ schema, getModel, parent }, value));
      }
      if (key === "filters") {
        set(key, await defaultSanitizeFilters({ schema, getModel, parent }, value));
      }
      if (key === "fields") {
        set(key, await defaultSanitizeFields({ schema, getModel, parent }, value));
      }
      if (key === "populate") {
        set(key, await defaultSanitizePopulate({ schema, getModel, parent }, value));
      }
    }, ctx),
    // Remove private fields
    traverseQueryPopulate(visitor$7, ctx)
  )(populate2);
});
const sanitizers = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  defaultSanitizeFields,
  defaultSanitizeFilters,
  defaultSanitizeOutput,
  defaultSanitizePopulate,
  defaultSanitizeSort,
  sanitizePasswords
}, Symbol.toStringTag, { value: "Module" }));
const createAPISanitizers = (opts) => {
  const { getModel } = opts;
  const sanitizeInput = (data, schema, { auth } = {}) => {
    if (!schema) {
      throw new Error("Missing schema in sanitizeInput");
    }
    if (isArray(data)) {
      return Promise.all(data.map((entry) => sanitizeInput(entry, schema, { auth })));
    }
    const nonWritableAttributes = getNonWritableAttributes(schema);
    const transforms = [
      // Remove first level ID in inputs
      omit(constants$1.ID_ATTRIBUTE),
      omit(constants$1.DOC_ID_ATTRIBUTE),
      // Remove non-writable attributes
      traverseEntity$1(removeRestrictedFields(nonWritableAttributes), { schema, getModel })
    ];
    if (auth) {
      transforms.push(
        traverseEntity$1(removeRestrictedRelations(auth), { schema, getModel })
      );
    }
    opts?.sanitizers?.input?.forEach((sanitizer) => transforms.push(sanitizer(schema)));
    return pipe(...transforms)(data);
  };
  const sanitizeOutput = async (data, schema, { auth } = {}) => {
    if (!schema) {
      throw new Error("Missing schema in sanitizeOutput");
    }
    if (isArray(data)) {
      const res = new Array(data.length);
      for (let i = 0; i < data.length; i += 1) {
        res[i] = await sanitizeOutput(data[i], schema, { auth });
      }
      return res;
    }
    const transforms = [
      (data2) => defaultSanitizeOutput({ schema, getModel }, data2)
    ];
    if (auth) {
      transforms.push(
        traverseEntity$1(removeRestrictedRelations(auth), { schema, getModel })
      );
    }
    opts?.sanitizers?.output?.forEach((sanitizer) => transforms.push(sanitizer(schema)));
    return pipe(...transforms)(data);
  };
  const sanitizeQuery = async (query, schema, { auth } = {}) => {
    if (!schema) {
      throw new Error("Missing schema in sanitizeQuery");
    }
    const { filters: filters2, sort: sort2, fields: fields2, populate: populate2 } = query;
    const sanitizedQuery = cloneDeep(query);
    if (filters2) {
      Object.assign(sanitizedQuery, { filters: await sanitizeFilters(filters2, schema, { auth }) });
    }
    if (sort2) {
      Object.assign(sanitizedQuery, { sort: await sanitizeSort(sort2, schema, { auth }) });
    }
    if (fields2) {
      Object.assign(sanitizedQuery, { fields: await sanitizeFields(fields2, schema) });
    }
    if (populate2) {
      Object.assign(sanitizedQuery, { populate: await sanitizePopulate(populate2, schema) });
    }
    return sanitizedQuery;
  };
  const sanitizeFilters = (filters2, schema, { auth } = {}) => {
    if (!schema) {
      throw new Error("Missing schema in sanitizeFilters");
    }
    if (isArray(filters2)) {
      return Promise.all(filters2.map((filter) => sanitizeFilters(filter, schema, { auth })));
    }
    const transforms = [defaultSanitizeFilters({ schema, getModel })];
    if (auth) {
      transforms.push(
        traverseQueryFilters(removeRestrictedRelations(auth), { schema, getModel })
      );
    }
    return pipe(...transforms)(filters2);
  };
  const sanitizeSort = (sort2, schema, { auth } = {}) => {
    if (!schema) {
      throw new Error("Missing schema in sanitizeSort");
    }
    const transforms = [defaultSanitizeSort({ schema, getModel })];
    if (auth) {
      transforms.push(
        traverseQuerySort(removeRestrictedRelations(auth), { schema, getModel })
      );
    }
    return pipe(...transforms)(sort2);
  };
  const sanitizeFields = (fields2, schema) => {
    if (!schema) {
      throw new Error("Missing schema in sanitizeFields");
    }
    const transforms = [defaultSanitizeFields({ schema, getModel })];
    return pipe(...transforms)(fields2);
  };
  const sanitizePopulate = (populate2, schema, { auth } = {}) => {
    if (!schema) {
      throw new Error("Missing schema in sanitizePopulate");
    }
    const transforms = [defaultSanitizePopulate({ schema, getModel })];
    if (auth) {
      transforms.push(
        traverseQueryPopulate(removeRestrictedRelations(auth), { schema, getModel })
      );
    }
    return pipe(...transforms)(populate2);
  };
  return {
    input: sanitizeInput,
    output: sanitizeOutput,
    query: sanitizeQuery,
    filters: sanitizeFilters,
    sort: sanitizeSort,
    fields: sanitizeFields,
    populate: sanitizePopulate
  };
};
const index$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createAPISanitizers,
  sanitizers,
  visitors: index$4
}, Symbol.toStringTag, { value: "Module" }));
const throwInvalidKey = ({ key, path }) => {
  const msg = path && path !== key ? `Invalid key ${key} at ${path}` : `Invalid key ${key}`;
  throw new ValidationError(msg, {
    key,
    path
  });
};
const asyncCurry = (fn) => {
  const curried = (...args) => {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...moreArgs) => curried(...args, ...moreArgs);
  };
  return curried;
};
const visitor$3 = ({ key, attribute, path }) => {
  if (attribute?.type === "password") {
    throwInvalidKey({ key, path: path.attribute });
  }
};
const visitor$2 = ({ schema, key, attribute, path }) => {
  if (!attribute) {
    return;
  }
  const isPrivate = attribute.private === true || isPrivateAttribute(schema, key);
  if (isPrivate) {
    throwInvalidKey({ key, path: path.attribute });
  }
};
const ACTIONS_TO_VERIFY = ["find"];
const { CREATED_BY_ATTRIBUTE, UPDATED_BY_ATTRIBUTE } = constants$1;
const throwRestrictedRelations = (auth) => async ({ data, key, attribute, schema, path }) => {
  if (!attribute) {
    return;
  }
  const isRelation = attribute.type === "relation";
  if (!isRelation) {
    return;
  }
  const handleMorphRelation = async () => {
    const elements = data[key];
    if ("connect" in elements || "set" in elements || "disconnect" in elements || "options" in elements) {
      await handleMorphElements(elements.connect || []);
      await handleMorphElements(elements.set || []);
      await handleMorphElements(elements.disconnect || []);
      if ("options" in elements) {
        if (elements.options === null || elements.options === void 0) {
          return;
        }
        if (typeof elements.options !== "object") {
          throwInvalidKey({ key, path: path.attribute });
        }
        const optionKeys = Object.keys(elements.options);
        for (const key2 of optionKeys) {
          if (!(key2 in VALID_RELATION_ORDERING_KEYS)) {
            throwInvalidKey({ key: key2, path: path.attribute });
          }
          if (!VALID_RELATION_ORDERING_KEYS[key2](elements.options[key2])) {
            throwInvalidKey({ key: key2, path: path.attribute });
          }
        }
      }
    } else {
      await handleMorphElements(elements);
    }
  };
  const handleMorphElements = async (elements) => {
    if (!isArray(elements)) {
      throwInvalidKey({ key, path: path.attribute });
    }
    for (const element of elements) {
      if (!isObject(element) || !("__type" in element)) {
        throwInvalidKey({ key, path: path.attribute });
      }
      const scopes = ACTIONS_TO_VERIFY.map((action) => `${element.__type}.${action}`);
      const isAllowed = await hasAccessToSomeScopes(scopes, auth);
      if (!isAllowed) {
        throwInvalidKey({ key, path: path.attribute });
      }
    }
  };
  const handleRegularRelation = async () => {
    const scopes = ACTIONS_TO_VERIFY.map((action) => `${attribute.target}.${action}`);
    const isAllowed = await hasAccessToSomeScopes(scopes, auth);
    if (!isAllowed) {
      throwInvalidKey({ key, path: path.attribute });
    }
  };
  const isCreatorRelation = [CREATED_BY_ATTRIBUTE, UPDATED_BY_ATTRIBUTE].includes(key);
  if (isMorphToRelationalAttribute(attribute)) {
    await handleMorphRelation();
    return;
  }
  if (isCreatorRelation && schema.options?.populateCreatorFields) {
    return;
  }
  await handleRegularRelation();
};
const hasAccessToSomeScopes = async (scopes, auth) => {
  for (const scope of scopes) {
    try {
      await strapi.auth.verify(auth, { scope });
      return true;
    } catch {
      continue;
    }
  }
  return false;
};
const visitor$1 = ({ key, attribute, path }) => {
  if (isMorphToRelationalAttribute(attribute)) {
    throwInvalidKey({ key, path: path.attribute });
  }
};
const visitor = ({ key, attribute, path }) => {
  if (isDynamicZoneAttribute(attribute)) {
    throwInvalidKey({ key, path: path.attribute });
  }
};
const throwDisallowedFields = (allowedFields = null) => ({ key, path: { attribute: path } }) => {
  if (allowedFields === null) {
    return;
  }
  if (!(isArray(allowedFields) && allowedFields.every(isString))) {
    throw new TypeError(
      `Expected array of strings for allowedFields but got "${typeof allowedFields}"`
    );
  }
  if (isNil(path)) {
    return;
  }
  const containedPaths = getContainedPaths(path);
  const isPathAllowed = allowedFields.some(
    (p) => containedPaths.includes(p) || p.startsWith(`${path}.`)
  );
  if (isPathAllowed) {
    return;
  }
  throwInvalidKey({ key, path });
};
const getContainedPaths = (path) => {
  const parts = toPath(path);
  return parts.reduce((acc, value, index2, list) => {
    return [...acc, list.slice(0, index2 + 1).join(".")];
  }, []);
};
const throwRestrictedFields = (restrictedFields = null) => ({ key, path: { attribute: path } }) => {
  if (restrictedFields === null) {
    throwInvalidKey({ key, path });
  }
  if (!(isArray(restrictedFields) && restrictedFields.every(isString))) {
    throw new TypeError(
      `Expected array of strings for restrictedFields but got "${typeof restrictedFields}"`
    );
  }
  if (restrictedFields.includes(path)) {
    throwInvalidKey({ key, path });
  }
  const isRestrictedNested = restrictedFields.some(
    (allowedPath) => path?.toString().startsWith(`${allowedPath}.`)
  );
  if (isRestrictedNested) {
    throwInvalidKey({ key, path });
  }
};
const ID_FIELDS = [constants$1.DOC_ID_ATTRIBUTE, constants$1.DOC_ID_ATTRIBUTE];
const ALLOWED_ROOT_LEVEL_FIELDS = [...ID_FIELDS];
const MORPH_TO_ALLOWED_FIELDS = ["__type"];
const DYNAMIC_ZONE_ALLOWED_FIELDS = ["__component"];
const RELATION_REORDERING_FIELDS = ["connect", "disconnect", "set", "options"];
const throwUnrecognizedFields = ({ key, attribute, path, schema, parent }) => {
  if (attribute) {
    return;
  }
  if (path.attribute === null) {
    if (ALLOWED_ROOT_LEVEL_FIELDS.includes(key)) {
      return;
    }
    return throwInvalidKey({ key, path: attribute });
  }
  if (isMorphToRelationalAttribute(parent?.attribute) && MORPH_TO_ALLOWED_FIELDS.includes(key)) {
    return;
  }
  if (isComponentSchema(schema) && isDynamicZoneAttribute(parent?.attribute) && DYNAMIC_ZONE_ALLOWED_FIELDS.includes(key)) {
    return;
  }
  if (hasRelationReordering(parent?.attribute) && RELATION_REORDERING_FIELDS.includes(key)) {
    return;
  }
  const canUseID = isRelationalAttribute(parent?.attribute) || isMediaAttribute(parent?.attribute);
  if (canUseID && !ID_FIELDS.includes(key)) {
    return;
  }
  throwInvalidKey({ key, path: attribute });
};
const index$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  throwDisallowedFields,
  throwDynamicZones: visitor,
  throwMorphToRelations: visitor$1,
  throwPassword: visitor$3,
  throwPrivate: visitor$2,
  throwRestrictedFields,
  throwRestrictedRelations,
  throwUnrecognizedFields
}, Symbol.toStringTag, { value: "Module" }));
const { ID_ATTRIBUTE: ID_ATTRIBUTE$1, DOC_ID_ATTRIBUTE: DOC_ID_ATTRIBUTE$1 } = constants$1;
const FILTER_TRAVERSALS = [
  "nonAttributesOperators",
  "dynamicZones",
  "morphRelations",
  "passwords",
  "private"
];
const validateFilters = asyncCurry(
  async (ctx, filters2, include) => {
    if (!ctx.schema) {
      throw new Error("Missing schema in defaultValidateFilters");
    }
    const functionsToApply = [];
    if (include.includes("nonAttributesOperators")) {
      functionsToApply.push(
        traverseQueryFilters(({ key, attribute, path }) => {
          if ([ID_ATTRIBUTE$1, DOC_ID_ATTRIBUTE$1].includes(key)) {
            return;
          }
          const isAttribute = !!attribute;
          if (!isAttribute && !isOperator(key)) {
            throwInvalidKey({ key, path: path.attribute });
          }
        }, ctx)
      );
    }
    if (include.includes("dynamicZones")) {
      functionsToApply.push(traverseQueryFilters(visitor, ctx));
    }
    if (include.includes("morphRelations")) {
      functionsToApply.push(traverseQueryFilters(visitor$1, ctx));
    }
    if (include.includes("passwords")) {
      functionsToApply.push(traverseQueryFilters(visitor$3, ctx));
    }
    if (include.includes("private")) {
      functionsToApply.push(traverseQueryFilters(visitor$2, ctx));
    }
    if (functionsToApply.length === 0) {
      return filters2;
    }
    return pipe(...functionsToApply)(filters2);
  }
);
const defaultValidateFilters = asyncCurry(async (ctx, filters2) => {
  return validateFilters(ctx, filters2, FILTER_TRAVERSALS);
});
const SORT_TRAVERSALS = [
  "nonAttributesOperators",
  "dynamicZones",
  "morphRelations",
  "passwords",
  "private",
  "nonScalarEmptyKeys"
];
const validateSort = asyncCurry(
  async (ctx, sort2, include) => {
    if (!ctx.schema) {
      throw new Error("Missing schema in defaultValidateSort");
    }
    const functionsToApply = [];
    if (include.includes("nonAttributesOperators")) {
      functionsToApply.push(
        traverseQuerySort(({ key, attribute, path }) => {
          if ([ID_ATTRIBUTE$1, DOC_ID_ATTRIBUTE$1].includes(key)) {
            return;
          }
          if (!attribute) {
            throwInvalidKey({ key, path: path.attribute });
          }
        }, ctx)
      );
    }
    if (include.includes("dynamicZones")) {
      functionsToApply.push(traverseQuerySort(visitor, ctx));
    }
    if (include.includes("morphRelations")) {
      functionsToApply.push(traverseQuerySort(visitor$1, ctx));
    }
    if (include.includes("passwords")) {
      functionsToApply.push(traverseQuerySort(visitor$3, ctx));
    }
    if (include.includes("private")) {
      functionsToApply.push(traverseQuerySort(visitor$2, ctx));
    }
    if (include.includes("nonScalarEmptyKeys")) {
      functionsToApply.push(
        traverseQuerySort(({ key, attribute, value, path }) => {
          if ([ID_ATTRIBUTE$1, DOC_ID_ATTRIBUTE$1].includes(key)) {
            return;
          }
          if (!isScalarAttribute(attribute) && isEmpty(value)) {
            throwInvalidKey({ key, path: path.attribute });
          }
        }, ctx)
      );
    }
    if (functionsToApply.length === 0) {
      return sort2;
    }
    return pipe(...functionsToApply)(sort2);
  }
);
const defaultValidateSort = asyncCurry(async (ctx, sort2) => {
  return validateSort(ctx, sort2, SORT_TRAVERSALS);
});
const FIELDS_TRAVERSALS = ["scalarAttributes", "privateFields", "passwordFields"];
const validateFields = asyncCurry(
  async (ctx, fields2, include) => {
    if (!ctx.schema) {
      throw new Error("Missing schema in defaultValidateFields");
    }
    const functionsToApply = [];
    if (include.includes("scalarAttributes")) {
      functionsToApply.push(
        traverseQueryFields(({ key, attribute, path }) => {
          if ([ID_ATTRIBUTE$1, DOC_ID_ATTRIBUTE$1].includes(key)) {
            return;
          }
          if (isNil(attribute) || !isScalarAttribute(attribute)) {
            throwInvalidKey({ key, path: path.attribute });
          }
        }, ctx)
      );
    }
    if (include.includes("privateFields")) {
      functionsToApply.push(traverseQueryFields(visitor$2, ctx));
    }
    if (include.includes("passwordFields")) {
      functionsToApply.push(traverseQueryFields(visitor$3, ctx));
    }
    if (functionsToApply.length === 0) {
      return fields2;
    }
    return pipe(...functionsToApply)(fields2);
  }
);
const defaultValidateFields = asyncCurry(async (ctx, fields2) => {
  return validateFields(ctx, fields2, FIELDS_TRAVERSALS);
});
const POPULATE_TRAVERSALS = ["nonAttributesOperators", "private"];
const validatePopulate = asyncCurry(
  async (ctx, populate2, includes) => {
    if (!ctx.schema) {
      throw new Error("Missing schema in defaultValidatePopulate");
    }
    const functionsToApply = [];
    functionsToApply.push(
      traverseQueryPopulate(
        async ({ key, path, value, schema, attribute, getModel, parent }, { set }) => {
          if (!parent?.attribute && attribute) {
            const isPopulatableAttribute = [
              "relation",
              "dynamiczone",
              "component",
              "media"
            ].includes(attribute.type);
            if (!isPopulatableAttribute) {
              throwInvalidKey({ key, path: path.raw });
            }
            return;
          }
          if (key === "on") {
            if (!isObject(value)) {
              return throwInvalidKey({ key, path: path.raw });
            }
            const targets = Object.keys(value);
            for (const target of targets) {
              const model = getModel(target);
              if (!model) {
                throwInvalidKey({ key: target, path: `${path.raw}.${target}` });
              }
            }
            return;
          }
          if (key === "" && value === "*") {
            return;
          }
          if (key === "count") {
            try {
              parseType({ type: "boolean", value });
              return;
            } catch {
              throwInvalidKey({ key, path: path.attribute });
            }
          }
          try {
            parseType({ type: "boolean", value: key });
            return;
          } catch {
          }
          if (key === "sort") {
            set(
              key,
              await validateSort(
                {
                  schema,
                  getModel
                },
                value,
                // pass the sort value
                includes?.sort || SORT_TRAVERSALS
              )
            );
            return;
          }
          if (key === "filters") {
            set(
              key,
              await validateFilters(
                {
                  schema,
                  getModel
                },
                value,
                // pass the filters value
                includes?.filters || FILTER_TRAVERSALS
              )
            );
            return;
          }
          if (key === "fields") {
            set(
              key,
              await validateFields(
                {
                  schema,
                  getModel
                },
                value,
                // pass the fields value
                includes?.fields || FIELDS_TRAVERSALS
              )
            );
            return;
          }
          if (key === "populate") {
            set(
              key,
              await validatePopulate(
                {
                  schema,
                  getModel,
                  parent: { key, path, schema, attribute },
                  path
                },
                value,
                // pass the nested populate value
                includes
                // pass down the same includes object
              )
            );
            return;
          }
          if (includes?.populate?.includes("nonAttributesOperators")) {
            throwInvalidKey({ key, path: path.attribute });
          }
        },
        ctx
      )
    );
    if (includes?.populate?.includes("private")) {
      functionsToApply.push(traverseQueryPopulate(visitor$2, ctx));
    }
    if (functionsToApply.length === 0) {
      return populate2;
    }
    return pipe(...functionsToApply)(populate2);
  }
);
const defaultValidatePopulate = asyncCurry(async (ctx, populate2) => {
  if (!ctx.schema) {
    throw new Error("Missing schema in defaultValidatePopulate");
  }
  return validatePopulate(ctx, populate2, {
    filters: FILTER_TRAVERSALS,
    sort: SORT_TRAVERSALS,
    fields: FIELDS_TRAVERSALS,
    populate: POPULATE_TRAVERSALS
  });
});
const validators = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  FIELDS_TRAVERSALS,
  FILTER_TRAVERSALS,
  POPULATE_TRAVERSALS,
  SORT_TRAVERSALS,
  defaultValidateFields,
  defaultValidateFilters,
  defaultValidatePopulate,
  defaultValidateSort,
  validateFields,
  validateFilters,
  validatePopulate,
  validateSort
}, Symbol.toStringTag, { value: "Module" }));
const { ID_ATTRIBUTE, DOC_ID_ATTRIBUTE } = constants$1;
const createAPIValidators = (opts) => {
  const { getModel } = opts || {};
  const validateInput = async (data, schema, { auth } = {}) => {
    if (!schema) {
      throw new Error("Missing schema in validateInput");
    }
    if (isArray(data)) {
      await Promise.all(data.map((entry) => validateInput(entry, schema, { auth })));
      return;
    }
    const nonWritableAttributes = getNonWritableAttributes(schema);
    const transforms = [
      (data2) => {
        if (isObject(data2)) {
          if (ID_ATTRIBUTE in data2) {
            throwInvalidKey({ key: ID_ATTRIBUTE });
          }
          if (DOC_ID_ATTRIBUTE in data2) {
            throwInvalidKey({ key: DOC_ID_ATTRIBUTE });
          }
        }
        return data2;
      },
      // non-writable attributes
      traverseEntity$1(throwRestrictedFields(nonWritableAttributes), { schema, getModel }),
      // unrecognized attributes
      traverseEntity$1(throwUnrecognizedFields, { schema, getModel })
    ];
    if (auth) {
      transforms.push(
        traverseEntity$1(throwRestrictedRelations(auth), {
          schema,
          getModel
        })
      );
    }
    opts?.validators?.input?.forEach((validator) => transforms.push(validator(schema)));
    try {
      await pipe(...transforms)(data);
    } catch (e) {
      if (e instanceof ValidationError) {
        e.details.source = "body";
      }
      throw e;
    }
  };
  const validateQuery = async (query, schema, { auth } = {}) => {
    if (!schema) {
      throw new Error("Missing schema in validateQuery");
    }
    const { filters: filters2, sort: sort2, fields: fields2, populate: populate2 } = query;
    if (filters2) {
      await validateFilters2(filters2, schema, { auth });
    }
    if (sort2) {
      await validateSort2(sort2, schema, { auth });
    }
    if (fields2) {
      await validateFields2(fields2, schema);
    }
    if (populate2 && populate2 !== "*") {
      await validatePopulate2(populate2, schema);
    }
  };
  const validateFilters2 = async (filters2, schema, { auth } = {}) => {
    if (!schema) {
      throw new Error("Missing schema in validateFilters");
    }
    if (isArray(filters2)) {
      await Promise.all(filters2.map((filter) => validateFilters2(filter, schema, { auth })));
      return;
    }
    const transforms = [defaultValidateFilters({ schema, getModel })];
    if (auth) {
      transforms.push(
        traverseQueryFilters(throwRestrictedRelations(auth), {
          schema,
          getModel
        })
      );
    }
    try {
      await pipe(...transforms)(filters2);
    } catch (e) {
      if (e instanceof ValidationError) {
        e.details.source = "query";
        e.details.param = "filters";
      }
      throw e;
    }
  };
  const validateSort2 = async (sort2, schema, { auth } = {}) => {
    if (!schema) {
      throw new Error("Missing schema in validateSort");
    }
    const transforms = [defaultValidateSort({ schema, getModel })];
    if (auth) {
      transforms.push(
        traverseQuerySort(throwRestrictedRelations(auth), {
          schema,
          getModel
        })
      );
    }
    try {
      await pipe(...transforms)(sort2);
    } catch (e) {
      if (e instanceof ValidationError) {
        e.details.source = "query";
        e.details.param = "sort";
      }
      throw e;
    }
  };
  const validateFields2 = async (fields2, schema) => {
    if (!schema) {
      throw new Error("Missing schema in validateFields");
    }
    const transforms = [defaultValidateFields({ schema, getModel })];
    try {
      await pipe(...transforms)(fields2);
    } catch (e) {
      if (e instanceof ValidationError) {
        e.details.source = "query";
        e.details.param = "fields";
      }
      throw e;
    }
  };
  const validatePopulate2 = async (populate2, schema, { auth } = {}) => {
    if (!schema) {
      throw new Error("Missing schema in sanitizePopulate");
    }
    const transforms = [defaultValidatePopulate({ schema, getModel })];
    if (auth) {
      transforms.push(
        traverseQueryPopulate(throwRestrictedRelations(auth), {
          schema,
          getModel
        })
      );
    }
    try {
      await pipe(...transforms)(populate2);
    } catch (e) {
      if (e instanceof ValidationError) {
        e.details.source = "query";
        e.details.param = "populate";
      }
      throw e;
    }
  };
  return {
    input: validateInput,
    query: validateQuery,
    filters: validateFilters2,
    sort: validateSort2,
    fields: validateFields2,
    populate: validatePopulate2
  };
};
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createAPIValidators,
  validators,
  visitors: index$1
}, Symbol.toStringTag, { value: "Module" }));
const STRAPI_DEFAULTS = {
  offset: {
    start: 0,
    limit: 10
  },
  page: {
    page: 1,
    pageSize: 10
  }
};
const paginationAttributes = ["start", "limit", "page", "pageSize"];
const withMaxLimit = (limit, maxLimit = -1) => {
  if (maxLimit === -1 || limit < maxLimit) {
    return limit;
  }
  return maxLimit;
};
const ensureMinValues = ({ start, limit }) => ({
  start: Math.max(start, 0),
  limit: limit === -1 ? limit : Math.max(limit, 1)
});
const ensureMaxValues = (maxLimit = -1) => ({ start, limit }) => ({
  start,
  limit: withMaxLimit(limit, maxLimit)
});
const withNoLimit = (pagination2, maxLimit = -1) => ({
  ...pagination2,
  limit: pagination2.limit === -1 ? maxLimit : pagination2.limit
});
const withDefaultPagination = (args, { defaults: defaults2 = {}, maxLimit = -1 } = {}) => {
  const defaultValues = merge(STRAPI_DEFAULTS, defaults2);
  const usePagePagination = !isNil(args.page) || !isNil(args.pageSize);
  const useOffsetPagination = !isNil(args.start) || !isNil(args.limit);
  const ensureValidValues = pipe$1(ensureMinValues, ensureMaxValues(maxLimit));
  if (!usePagePagination && !useOffsetPagination) {
    return merge(args, ensureValidValues(defaultValues.offset));
  }
  if (usePagePagination && useOffsetPagination) {
    throw new PaginationError("Cannot use both page & offset pagination in the same query");
  }
  const pagination2 = {
    start: 0,
    limit: 0
  };
  if (useOffsetPagination) {
    const { start, limit } = merge(defaultValues.offset, args);
    Object.assign(pagination2, { start, limit });
  }
  if (usePagePagination) {
    const { page, pageSize } = merge(defaultValues.page, {
      ...args,
      pageSize: Math.max(1, args.pageSize ?? 0)
    });
    Object.assign(pagination2, {
      start: (page - 1) * pageSize,
      limit: pageSize
    });
  }
  Object.assign(pagination2, withNoLimit(pagination2, maxLimit));
  const replacePaginationAttributes = pipe$1(
    // Remove pagination attributes
    omit(paginationAttributes),
    // Merge the object with the new pagination + ensure minimum & maximum values
    merge(ensureValidValues(pagination2))
  );
  return replacePaginationAttributes(args);
};
const transformPagedPaginationInfo = (paginationInfo, total) => {
  if (!isNil(paginationInfo.page)) {
    const page = paginationInfo.page;
    const pageSize = paginationInfo.pageSize ?? total;
    return {
      page,
      pageSize,
      pageCount: pageSize > 0 ? Math.ceil(total / pageSize) : 0,
      total
    };
  }
  if (!isNil(paginationInfo.start)) {
    const start = paginationInfo.start;
    const limit = paginationInfo.limit ?? total;
    return {
      page: Math.floor(start / limit) + 1,
      pageSize: limit,
      pageCount: limit > 0 ? Math.ceil(total / limit) : 0,
      total
    };
  }
  return {
    ...paginationInfo,
    page: 1,
    pageSize: 10,
    pageCount: 1,
    total
  };
};
const transformOffsetPaginationInfo = (paginationInfo, total) => {
  if (!isNil(paginationInfo.page)) {
    const limit = paginationInfo.pageSize ?? total;
    const start = (paginationInfo.page - 1) * limit;
    return { start, limit, total };
  }
  if (!isNil(paginationInfo.start)) {
    const start = paginationInfo.start;
    const limit = paginationInfo.limit ?? total;
    return { start, limit, total };
  }
  return {
    ...paginationInfo,
    start: 0,
    limit: 10,
    total
  };
};
const pagination = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  transformOffsetPaginationInfo,
  transformPagedPaginationInfo,
  withDefaultPagination
}, Symbol.toStringTag, { value: "Module" }));
const SUPPORTED_PACKAGE_MANAGERS = ["npm", "yarn"];
const DEFAULT_PACKAGE_MANAGER = "npm";
const getPreferred = async (pkgPath) => {
  const pm = await preferredPM(pkgPath);
  const hasPackageManager = pm !== void 0;
  if (!hasPackageManager) {
    throw new Error(`Couldn't find a package manager in your project.`);
  }
  const isPackageManagerSupported = SUPPORTED_PACKAGE_MANAGERS.includes(pm.name);
  if (!isPackageManagerSupported) {
    process.emitWarning(
      `We detected your package manager (${pm.name} v${pm.version}), but it's not officially supported by Strapi yet. Defaulting to npm instead.`
    );
    return DEFAULT_PACKAGE_MANAGER;
  }
  return pm.name;
};
const installDependencies = (path, packageManager2, options = {}) => {
  return execa(packageManager2, ["install"], { ...options, cwd: path, stdin: "ignore" });
};
const packageManager = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getPreferred,
  installDependencies
}, Symbol.toStringTag, { value: "Module" }));
const createStrictInterpolationRegExp = (allowedVariableNames, flags) => {
  const oneOfVariables = allowedVariableNames.join("|");
  return new RegExp(`<%=\\s*(${oneOfVariables})\\s*%>`, flags);
};
const createLooseInterpolationRegExp = (flags) => new RegExp(/<%=([\s\S]+?)%>/, flags);
const template = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createLooseInterpolationRegExp,
  createStrictInterpolationRegExp
}, Symbol.toStringTag, { value: "Module" }));
const kbytesToBytes = (kbytes) => kbytes * 1e3;
const bytesToKbytes = (bytes) => Math.round(bytes / 1e3 * 100) / 100;
const bytesToHumanReadable = (bytes) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  if (bytes === 0) return "0 Bytes";
  const i = parseInt(`${Math.floor(Math.log(bytes) / Math.log(1e3))}`, 10);
  return `${Math.round(bytes / 1e3 ** i)} ${sizes[i]}`;
};
const streamToBuffer = (stream) => new Promise((resolve, reject) => {
  const chunks = [];
  stream.on("data", (chunk) => {
    chunks.push(chunk);
  });
  stream.on("end", () => {
    resolve(Buffer.concat(chunks));
  });
  stream.on("error", reject);
});
const getStreamSize = (stream) => new Promise((resolve, reject) => {
  let size = 0;
  stream.on("data", (chunk) => {
    size += Buffer.byteLength(chunk);
  });
  stream.on("close", () => resolve(size));
  stream.on("error", reject);
  stream.resume();
});
function writableDiscardStream(options) {
  return new Writable({
    ...options,
    write(chunk, encding, callback) {
      setImmediate(callback);
    }
  });
}
const file = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bytesToHumanReadable,
  bytesToKbytes,
  getStreamSize,
  kbytesToBytes,
  streamToBuffer,
  writableDiscardStream
}, Symbol.toStringTag, { value: "Module" }));
const createPolicy = (options) => {
  const { name = "unnamed", validator, handler } = options;
  const wrappedValidator = (config) => {
    if (validator) {
      try {
        validator(config);
      } catch (e) {
        throw new Error(`Invalid config passed to "${name}" policy.`);
      }
    }
  };
  return {
    name,
    validator: wrappedValidator,
    handler
  };
};
const createPolicyContext = (type, ctx) => {
  return Object.assign(
    {
      is: eq(type),
      get type() {
        return type;
      }
    },
    ctx
  );
};
const policy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createPolicy,
  createPolicyContext
}, Symbol.toStringTag, { value: "Module" }));
const nameToSlug = (name, options = { separator: "-" }) => slugify(name, options);
const nameToCollectionName = (name) => slugify(name, { separator: "_" });
const toRegressedEnumValue = (value) => slugify(value, {
  decamelize: false,
  lowercase: false,
  separator: "_"
});
const getCommonPath = (...paths) => {
  const [segments, ...otherSegments] = paths.map((it) => ___default.split(it, "/"));
  return ___default.join(
    ___default.takeWhile(segments, (str, index2) => otherSegments.every((it) => it[index2] === str)),
    "/"
  );
};
const isEqual = (a, b) => String(a) === String(b);
const isCamelCase = (value) => /^[a-z][a-zA-Z0-9]+$/.test(value);
const isKebabCase = (value) => /^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/.test(value);
const startsWithANumber = (value) => /^[0-9]/.test(value);
const joinBy = (joint, ...args) => {
  const trim2 = trimChars(joint);
  const trimEnd = trimCharsEnd(joint);
  const trimStart = trimCharsStart(joint);
  return args.reduce((url, path, index2) => {
    if (args.length === 1) return path;
    if (index2 === 0) return trimEnd(path);
    if (index2 === args.length - 1) return url + joint + trimStart(path);
    return url + joint + trim2(path);
  }, "");
};
const toKebabCase = (value) => kebabCase(value);
const strings = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getCommonPath,
  isCamelCase,
  isEqual,
  isKebabCase,
  joinBy,
  nameToCollectionName,
  nameToSlug,
  startsWithANumber,
  toKebabCase,
  toRegressedEnumValue
}, Symbol.toStringTag, { value: "Module" }));
const castIncludes = (arr, val, cast) => arr.map((val2) => cast(val2)).includes(cast(val));
const includesString = (arr, val) => castIncludes(arr, val, String);
const arrays = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  includesString
}, Symbol.toStringTag, { value: "Module" }));
const keysDeep = (obj, path = []) => !___default.isObject(obj) ? [path.join(".")] : ___default.reduce(
  obj,
  (acc, next, key) => ___default.concat(acc, keysDeep(next, [...path, key])),
  []
);
const objects = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  keysDeep
}, Symbol.toStringTag, { value: "Module" }));
const timestampCode = (date) => {
  const referDate = date ?? /* @__PURE__ */ new Date();
  return referDate.getTime().toString(36);
};
const dates = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  timestampCode
}, Symbol.toStringTag, { value: "Module" }));
const { toString } = Object.prototype;
const errorToString = Error.prototype.toString;
const regExpToString = RegExp.prototype.toString;
const symbolToString = typeof Symbol !== "undefined" ? Symbol.prototype.toString : () => "";
const SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;
function printNumber(val) {
  if (val != +val) return "NaN";
  const isNegativeZero = val === 0 && 1 / val < 0;
  return isNegativeZero ? "-0" : `${val}`;
}
function printSimpleValue(val, quoteStrings = false) {
  if (val == null || val === true || val === false) return `${val}`;
  if (typeof val === "number") return printNumber(val);
  if (typeof val === "string") return quoteStrings ? `"${val}"` : val;
  if (typeof val === "function") return `[Function ${val.name || "anonymous"}]`;
  if (typeof val === "symbol") return symbolToString.call(val).replace(SYMBOL_REGEXP, "Symbol($1)");
  const tag = toString.call(val).slice(8, -1);
  if (tag === "Date") {
    const v = val;
    return Number.isNaN(v.getTime()) ? `${v}` : v.toISOString();
  }
  if (tag === "Error" || val instanceof Error) return `[${errorToString.call(val)}]`;
  if (tag === "RegExp") return regExpToString.call(val);
  return null;
}
function printValue(value, quoteStrings) {
  const result = printSimpleValue(value, quoteStrings);
  if (result !== null) return result;
  return JSON.stringify(
    value,
    function replacer(key, value2) {
      const result2 = printSimpleValue(this[key], quoteStrings);
      if (result2 !== null) return result2;
      return value2;
    },
    2
  );
}
const strapiID = () => new StrapiIDSchema();
const isNotNilTest = (value) => !___default.isNil(value);
const isNotNullTest = (value) => !___default.isNull(value);
yup$1.addMethod(yup$1.mixed, "notNil", function isNotNill(msg = "${path} must be defined.") {
  return this.test("defined", msg, isNotNilTest);
});
yup$1.addMethod(yup$1.mixed, "notNull", function isNotNull(msg = "${path} cannot be null.") {
  return this.test("defined", msg, isNotNullTest);
});
yup$1.addMethod(yup$1.mixed, "isFunction", function isFunction(message = "${path} is not a function") {
  return this.test(
    "is a function",
    message,
    (value) => ___default.isUndefined(value) || ___default.isFunction(value)
  );
});
yup$1.addMethod(
  yup$1.string,
  "isCamelCase",
  function isCamelCase$1(message = "${path} is not in camel case (anExampleOfCamelCase)") {
    return this.test(
      "is in camelCase",
      message,
      (value) => value ? isCamelCase(value) : true
    );
  }
);
yup$1.addMethod(
  yup$1.string,
  "isKebabCase",
  function isKebabCase$1(message = "${path} is not in kebab case (an-example-of-kebab-case)") {
    return this.test(
      "is in kebab-case",
      message,
      (value) => value ? isKebabCase(value) : true
    );
  }
);
yup$1.addMethod(
  yup$1.object,
  "onlyContainsFunctions",
  function onlyContainsFunctions(message = "${path} contains values that are not functions") {
    return this.test(
      "only contains functions",
      message,
      (value) => ___default.isUndefined(value) || value && Object.values(value).every(___default.isFunction)
    );
  }
);
yup$1.addMethod(
  yup$1.array,
  "uniqueProperty",
  function uniqueProperty(propertyName, message) {
    return this.test("unique", message, function unique(list) {
      const errors2 = [];
      list?.forEach((element, index2) => {
        const sameElements = list.filter(
          (e) => get(propertyName, e) === get(propertyName, element)
        );
        if (sameElements.length > 1) {
          errors2.push(
            this.createError({
              path: `${this.path}[${index2}].${propertyName}`,
              message
            })
          );
        }
      });
      if (errors2.length) {
        throw new yup$1.ValidationError(errors2);
      }
      return true;
    });
  }
);
class StrapiIDSchema extends yup$1.MixedSchema {
  constructor() {
    super({ type: "strapiID" });
  }
  _typeCheck(value) {
    return typeof value === "string" || isNumber(value) && isInteger(value) && value >= 0;
  }
}
yup$1.setLocale({
  mixed: {
    notType(options) {
      const { path, type, value, originalValue } = options;
      const isCast = originalValue != null && originalValue !== value;
      const msg = `${path} must be a \`${type}\` type, but the final value was: \`${printValue(value, true)}\`${isCast ? ` (cast from the value \`${printValue(originalValue, true)}\`).` : "."}`;
      return msg;
    }
  }
});
const yup = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  StrapiIDSchema,
  strapiID
}, [yup$1]);
const validateZod = (schema) => (data) => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const { message, errors: errors2 } = formatZodErrors(error);
      throw new ValidationError(message, { errors: errors2 });
    }
    throw error;
  }
};
const formatZodErrors = (zodError) => ({
  errors: zodError.errors.map((error) => {
    return {
      path: error.path,
      message: error.message,
      name: "ValidationError"
    };
  }),
  message: "Validation error"
});
export {
  arrays,
  async,
  contentTypes,
  dates,
  env,
  errors,
  file,
  hooks,
  importDefault,
  isOperator,
  isOperatorOfType,
  machineId as machineID,
  objects,
  packageManager,
  pagination,
  parseType,
  policy,
  providerFactory,
  convertQueryParams as queryParams,
  relations,
  index$2 as sanitize,
  setCreatorFields,
  strings,
  template,
  index$3 as traverse,
  traverseEntity$1 as traverseEntity,
  index as validate,
  validateYupSchema,
  validateYupSchemaSync,
  validateZod,
  yup
};
//# sourceMappingURL=index.mjs.map
