import { curry, assoc, omit, merge } from "lodash/fp";
import { contentTypes, async, validate } from "@strapi/utils";
import { wrapInTransaction } from "./common.mjs";
import { defaultToDraft as defaultToDraftCurry, statusToLookup as statusToLookupCurry, filterDataPublishedAt as filterDataPublishedAtCurry, setStatusToDraft as setStatusToDraftCurry, statusToData as statusToDataCurry, defaultStatus as defaultStatusCurry } from "./draft-and-publish.mjs";
import { defaultLocale as defaultLocaleCurry, multiLocaleToLookup as multiLocaleToLookupCurry, localeToLookup as localeToLookupCurry, localeToData as localeToDataCurry } from "./internationalization.mjs";
import { updateComponents, omitComponentData } from "./components.mjs";
import { createEntriesService } from "./entries.mjs";
import { pickSelectionParams } from "./params.mjs";
import { createDocumentId } from "../../utils/transform-content-types-to-models.mjs";
import { getDeepPopulate } from "./utils/populate.mjs";
import { transformParamsToQuery } from "./transform/query.mjs";
import { transformParamsDocumentId as curriedTransformParamsDocumentId } from "./transform/id-transform.mjs";
import { createEventManager } from "./events.mjs";
import { load, sync } from "./utils/unidirectional-relations.mjs";
import entityValidator from "../entity-validator/index.mjs";
const { validators } = validate;
const getModel = (schema) => strapi.getModel(schema);
const createContentTypeRepository = (uid, validator = entityValidator) => {
  const contentType = strapi.contentType(uid);
  const hasDraftAndPublish = contentTypes.hasDraftAndPublish(contentType);
  const sortValidations = ["nonAttributesOperators", "dynamicZones", "morphRelations"];
  const fieldValidations = ["scalarAttributes"];
  const filtersValidations = ["nonAttributesOperators", "dynamicZones", "morphRelations"];
  const populateValidations = {
    sort: sortValidations,
    field: fieldValidations,
    filters: filtersValidations,
    populate: ["nonAttributesOperators"]
  };
  const validateParams = async (params) => {
    const ctx = { schema: contentType, getModel };
    await validators.validateFilters(ctx, params.filters, filtersValidations);
    await validators.validateSort(ctx, params.sort, sortValidations);
    await validators.validateFields(ctx, params.fields, fieldValidations);
    await validators.validatePopulate(ctx, params.populate, populateValidations);
    return params;
  };
  const entries = createEntriesService(uid, validator);
  const eventManager = createEventManager(strapi, uid);
  const emitEvent = curry(eventManager.emitEvent);
  async function findMany(params = {}) {
    const query = await async.pipe(
      validateParams,
      defaultToDraftCurry,
      statusToLookupCurry(contentType),
      defaultLocaleCurry(contentType),
      multiLocaleToLookupCurry(contentType),
      curriedTransformParamsDocumentId(uid),
      transformParamsToQuery(uid)
    )(params || {});
    return strapi.db.query(uid).findMany(query);
  }
  async function findFirst(params = {}) {
    const query = await async.pipe(
      validateParams,
      defaultToDraftCurry,
      statusToLookupCurry(contentType),
      defaultLocaleCurry(contentType),
      localeToLookupCurry(contentType),
      curriedTransformParamsDocumentId(uid),
      transformParamsToQuery(uid)
    )(params);
    return strapi.db.query(uid).findOne(query);
  }
  async function findOne(opts = {}) {
    const { documentId, ...params } = opts;
    const query = await async.pipe(
      validateParams,
      defaultToDraftCurry,
      statusToLookupCurry(contentType),
      defaultLocaleCurry(contentType),
      localeToLookupCurry(contentType),
      curriedTransformParamsDocumentId(uid),
      transformParamsToQuery(uid),
      (query2) => assoc("where", { ...query2.where, documentId }, query2)
    )(params);
    return strapi.db.query(uid).findOne(query);
  }
  async function deleteDocument(opts = {}) {
    const { documentId, ...params } = opts;
    const query = await async.pipe(
      validateParams,
      omit("status"),
      defaultLocaleCurry(contentType),
      multiLocaleToLookupCurry(contentType),
      transformParamsToQuery(uid),
      (query2) => assoc("where", { ...query2.where, documentId }, query2)
    )(params);
    if (params.status === "draft") {
      throw new Error("Cannot delete a draft document");
    }
    const entriesToDelete = await strapi.db.query(uid).findMany(query);
    const deletedEntries = await async.map(
      entriesToDelete,
      (entryToDelete) => entries.delete(entryToDelete.id)
    );
    entriesToDelete.forEach(emitEvent("entry.delete"));
    return { documentId, entries: deletedEntries };
  }
  async function create(opts = {}) {
    const { documentId, ...params } = opts;
    const queryParams = await async.pipe(
      validateParams,
      filterDataPublishedAtCurry,
      setStatusToDraftCurry(contentType),
      statusToDataCurry(contentType),
      defaultLocaleCurry(contentType),
      localeToDataCurry(contentType)
    )(params);
    const doc = await entries.create(queryParams);
    emitEvent("entry.create", doc);
    if (hasDraftAndPublish && params.status === "published") {
      return publish({
        ...params,
        documentId: doc.documentId
      }).then((doc2) => doc2.entries[0]);
    }
    return doc;
  }
  async function clone(opts = {}) {
    const { documentId, ...params } = opts;
    const queryParams = await async.pipe(
      validateParams,
      filterDataPublishedAtCurry,
      defaultLocaleCurry(contentType),
      multiLocaleToLookupCurry(contentType)
    )(params);
    const entriesToClone = await strapi.db.query(uid).findMany({
      where: {
        ...queryParams?.lookup,
        documentId,
        // DP Enabled: Clone drafts
        // DP Disabled: Clone only the existing version (published)
        publishedAt: { $null: hasDraftAndPublish }
      },
      populate: getDeepPopulate(uid, { relationalFields: ["id"] })
    });
    const clonedEntries = await async.map(
      entriesToClone,
      async.pipe(
        validateParams,
        omit(["id", "createdAt", "updatedAt"]),
        // assign new documentId
        assoc("documentId", createDocumentId()),
        // Merge new data into it
        (data) => merge(data, queryParams.data),
        (data) => entries.create({ ...queryParams, data, status: "draft" })
      )
    );
    clonedEntries.forEach(emitEvent("entry.create"));
    return { documentId: clonedEntries.at(0)?.documentId, entries: clonedEntries };
  }
  async function update(opts = {}) {
    const { documentId, ...params } = opts;
    const queryParams = await async.pipe(
      validateParams,
      filterDataPublishedAtCurry,
      setStatusToDraftCurry(contentType),
      statusToLookupCurry(contentType),
      statusToDataCurry(contentType),
      // Default locale will be set if not provided
      defaultLocaleCurry(contentType),
      localeToLookupCurry(contentType),
      localeToDataCurry(contentType)
    )(params);
    const { data, ...restParams } = await curriedTransformParamsDocumentId(uid, queryParams || {});
    const query = transformParamsToQuery(uid, pickSelectionParams(restParams || {}));
    const entryToUpdate = await strapi.db.query(uid).findOne({ ...query, where: { ...queryParams?.lookup, ...query?.where, documentId } });
    let updatedDraft = null;
    if (entryToUpdate) {
      updatedDraft = await entries.update(entryToUpdate, queryParams);
      emitEvent("entry.update", updatedDraft);
    }
    if (!updatedDraft) {
      const documentExists = await strapi.db.query(contentType.uid).findOne({ where: { documentId } });
      if (documentExists) {
        updatedDraft = await entries.create({
          ...queryParams,
          data: { ...queryParams.data, documentId }
        });
        emitEvent("entry.create", updatedDraft);
      }
    }
    if (hasDraftAndPublish && updatedDraft && params.status === "published") {
      return publish({
        ...params,
        documentId
      }).then((doc) => doc.entries[0]);
    }
    return updatedDraft;
  }
  async function count(params = {}) {
    const query = await async.pipe(
      validateParams,
      defaultStatusCurry(contentType),
      statusToLookupCurry(contentType),
      defaultLocaleCurry(contentType),
      localeToLookupCurry(contentType),
      transformParamsToQuery(uid)
    )(params);
    return strapi.db.query(uid).count(query);
  }
  async function publish(opts = {}) {
    const { documentId, ...params } = opts;
    const queryParams = await async.pipe(
      validateParams,
      defaultLocaleCurry(contentType),
      multiLocaleToLookupCurry(contentType)
    )(params);
    const [draftsToPublish, oldPublishedVersions] = await Promise.all([
      strapi.db.query(uid).findMany({
        where: {
          ...queryParams?.lookup,
          documentId,
          publishedAt: null
          // Ignore lookup
        },
        // Populate relations, media, compos and dz
        populate: getDeepPopulate(uid, { relationalFields: ["documentId", "locale"] })
      }),
      strapi.db.query(uid).findMany({
        where: {
          ...queryParams?.lookup,
          documentId,
          publishedAt: { $ne: null }
        },
        select: ["id", "locale"]
      })
    ]);
    const relationsToSync = await load(uid, {
      newVersions: draftsToPublish,
      oldVersions: oldPublishedVersions
    });
    await async.map(oldPublishedVersions, (entry) => entries.delete(entry.id));
    const publishedEntries = await async.map(
      draftsToPublish,
      (draft) => entries.publish(draft, queryParams)
    );
    await sync(
      [...oldPublishedVersions, ...draftsToPublish],
      publishedEntries,
      relationsToSync
    );
    publishedEntries.forEach(emitEvent("entry.publish"));
    return { documentId, entries: publishedEntries };
  }
  async function unpublish(opts = {}) {
    const { documentId, ...params } = opts;
    const query = await async.pipe(
      validateParams,
      defaultLocaleCurry(contentType),
      multiLocaleToLookupCurry(contentType),
      transformParamsToQuery(uid),
      (query2) => assoc("where", { ...query2.where, documentId, publishedAt: { $ne: null } }, query2)
    )(params);
    const versionsToDelete = await strapi.db.query(uid).findMany(query);
    await async.map(versionsToDelete, (entry) => entries.delete(entry.id));
    versionsToDelete.forEach(emitEvent("entry.unpublish"));
    return { documentId, entries: versionsToDelete };
  }
  async function discardDraft(opts = {}) {
    const { documentId, ...params } = opts;
    const queryParams = await async.pipe(
      validateParams,
      defaultLocaleCurry(contentType),
      multiLocaleToLookupCurry(contentType)
    )(params);
    const [versionsToDraft, oldDrafts] = await Promise.all([
      strapi.db.query(uid).findMany({
        where: {
          ...queryParams?.lookup,
          documentId,
          publishedAt: { $ne: null }
        },
        // Populate relations, media, compos and dz
        populate: getDeepPopulate(uid, { relationalFields: ["documentId", "locale"] })
      }),
      strapi.db.query(uid).findMany({
        where: {
          ...queryParams?.lookup,
          documentId,
          publishedAt: null
        },
        select: ["id", "locale"]
      })
    ]);
    const relationsToSync = await load(uid, {
      newVersions: versionsToDraft,
      oldVersions: oldDrafts
    });
    await async.map(oldDrafts, (entry) => entries.delete(entry.id));
    const draftEntries = await async.map(
      versionsToDraft,
      (entry) => entries.discardDraft(entry, queryParams)
    );
    await sync(
      [...oldDrafts, ...versionsToDraft],
      draftEntries,
      relationsToSync
    );
    draftEntries.forEach(emitEvent("entry.draft-discard"));
    return { documentId, entries: draftEntries };
  }
  async function updateComponents$1(entry, data) {
    return updateComponents(uid, entry, data);
  }
  function omitComponentData$1(data) {
    return omitComponentData(contentType, data);
  }
  return {
    findMany: wrapInTransaction(findMany),
    findFirst: wrapInTransaction(findFirst),
    findOne: wrapInTransaction(findOne),
    delete: wrapInTransaction(deleteDocument),
    create: wrapInTransaction(create),
    clone: wrapInTransaction(clone),
    update: wrapInTransaction(update),
    count: wrapInTransaction(count),
    publish: hasDraftAndPublish ? wrapInTransaction(publish) : void 0,
    unpublish: hasDraftAndPublish ? wrapInTransaction(unpublish) : void 0,
    discardDraft: hasDraftAndPublish ? wrapInTransaction(discardDraft) : void 0,
    updateComponents: updateComponents$1,
    omitComponentData: omitComponentData$1
  };
};
export {
  createContentTypeRepository
};
//# sourceMappingURL=repository.mjs.map
