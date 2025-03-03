"use strict";
const globalAgent = require("global-agent");
const path = require("path");
const _ = require("lodash");
const fp = require("lodash/fp");
const logger = require("@strapi/logger");
const database = require("@strapi/database");
const tsUtils = require("@strapi/typescript-utils");
const index = require("./configuration/index.js");
const factories = require("./factories.js");
const openBrowser = require("./utils/open-browser.js");
const isInitialized = require("./utils/is-initialized.js");
const index$2 = require("./ee/index.js");
require("./utils/update-notifier/index.js");
const fetch = require("./utils/fetch.js");
const convertCustomFieldType = require("./utils/convert-custom-field-type.js");
const startupLogger = require("./utils/startup-logger.js");
const transformContentTypesToModels = require("./utils/transform-content-types-to-models.js");
const lifecycles = require("./utils/lifecycles.js");
require("node:path");
const container = require("./container.js");
const fs = require("./services/fs.js");
const eventHub = require("./services/event-hub.js");
const index$5 = require("./services/server/index.js");
const reloader = require("./services/reloader.js");
const index$1 = require("./providers/index.js");
const index$7 = require("./services/entity-service/index.js");
const queryParams = require("./services/query-params.js");
const index$6 = require("./services/entity-validator/index.js");
const requestContext = require("./services/request-context.js");
const index$4 = require("./services/auth/index.js");
const customFields = require("./services/custom-fields.js");
const index$3 = require("./services/content-api/index.js");
const dynamicZones = require("./services/utils/dynamic-zones.js");
const features = require("./services/features.js");
const index$8 = require("./services/document-service/index.js");
const coreStore = require("./services/core-store.js");
const config = require("./services/config.js");
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
const globalAgent__namespace = /* @__PURE__ */ _interopNamespace(globalAgent);
const path__default = /* @__PURE__ */ _interopDefault(path);
const ___default = /* @__PURE__ */ _interopDefault(_);
const tsUtils__default = /* @__PURE__ */ _interopDefault(tsUtils);
class Strapi extends container.Container {
  app;
  isLoaded = false;
  internal_config = {};
  constructor(opts) {
    super();
    this.internal_config = index.loadConfiguration(opts);
    this.registerInternalServices();
    for (const provider of index$1.providers) {
      provider.init?.(this);
    }
  }
  get admin() {
    return this.get("admin");
  }
  get EE() {
    return index$2.isEE;
  }
  get ee() {
    return index$2;
  }
  get dirs() {
    return this.config.get("dirs");
  }
  get reload() {
    return this.get("reload");
  }
  get db() {
    return this.get("db");
  }
  get requestContext() {
    return this.get("requestContext");
  }
  get customFields() {
    return this.get("customFields");
  }
  get entityValidator() {
    return this.get("entityValidator");
  }
  /**
   * @deprecated `strapi.entityService` will be removed in the next major version
   */
  get entityService() {
    return this.get("entityService");
  }
  get documents() {
    return this.get("documents");
  }
  get features() {
    return this.get("features");
  }
  get fetch() {
    return this.get("fetch");
  }
  get cron() {
    return this.get("cron");
  }
  get log() {
    return this.get("logger");
  }
  get startupLogger() {
    return this.get("startupLogger");
  }
  get eventHub() {
    return this.get("eventHub");
  }
  get fs() {
    return this.get("fs");
  }
  get server() {
    return this.get("server");
  }
  get telemetry() {
    return this.get("telemetry");
  }
  get store() {
    return this.get("coreStore");
  }
  get config() {
    return this.get("config");
  }
  get services() {
    return this.get("services").getAll();
  }
  service(uid) {
    return this.get("services").get(uid);
  }
  get controllers() {
    return this.get("controllers").getAll();
  }
  controller(uid) {
    return this.get("controllers").get(uid);
  }
  get contentTypes() {
    return this.get("content-types").getAll();
  }
  contentType(name) {
    return this.get("content-types").get(name);
  }
  get components() {
    return this.get("components").getAll();
  }
  get policies() {
    return this.get("policies").getAll();
  }
  policy(name) {
    return this.get("policies").get(name);
  }
  get middlewares() {
    return this.get("middlewares").getAll();
  }
  middleware(name) {
    return this.get("middlewares").get(name);
  }
  get plugins() {
    return this.get("plugins").getAll();
  }
  plugin(name) {
    return this.get("plugins").get(name);
  }
  get hooks() {
    return this.get("hooks").getAll();
  }
  hook(name) {
    return this.get("hooks").get(name);
  }
  get apis() {
    return this.get("apis").getAll();
  }
  api(name) {
    return this.get("apis").get(name);
  }
  get auth() {
    return this.get("auth");
  }
  get contentAPI() {
    return this.get("content-api");
  }
  get sanitizers() {
    return this.get("sanitizers");
  }
  get validators() {
    return this.get("validators");
  }
  async start() {
    try {
      if (!this.isLoaded) {
        await this.load();
      }
      await this.listen();
      return this;
    } catch (error) {
      return this.stopWithError(error);
    }
  }
  // TODO: split into more providers
  registerInternalServices() {
    const config$1 = config.createConfigProvider(this.internal_config, this);
    const logger$1 = logger.createLogger({
      level: "http",
      // Strapi defaults to level 'http'
      ...config$1.get("logger"),
      // DEPRECATED
      ...config$1.get("server.logger.config")
    });
    this.add("config", () => config$1).add("query-params", queryParams(this)).add("content-api", index$3(this)).add("auth", index$4()).add("server", () => index$5.createServer(this)).add("fs", () => fs(this)).add("eventHub", () => eventHub()).add("startupLogger", () => startupLogger.createStartupLogger(this)).add("logger", () => logger$1).add("fetch", () => fetch.createStrapiFetch(this)).add("features", () => features.createFeaturesService(this)).add("requestContext", requestContext).add("customFields", customFields(this)).add("entityValidator", index$6).add("entityService", () => index$7({ strapi: this, db: this.db })).add("documents", () => index$8.createDocumentService(this)).add("db", () => {
      const tsDir = tsUtils__default.default.resolveOutDirSync(this.dirs.app.root);
      const tsMigrationsEnabled = this.config.get("database.settings.useTypescriptMigrations") === true && tsDir;
      const projectDir = tsMigrationsEnabled ? tsDir : this.dirs.app.root;
      return new database.Database(
        ___default.default.merge(this.config.get("database"), {
          logger: logger$1,
          settings: {
            migrations: {
              dir: path__default.default.join(projectDir, "database/migrations")
            }
          }
        })
      );
    }).add("reload", () => reloader.createReloader(this));
  }
  sendStartupTelemetry() {
    this.telemetry.send("didStartServer", {
      groupProperties: {
        database: this.config.get("database.connection.client"),
        plugins: Object.keys(this.plugins),
        numberOfAllContentTypes: ___default.default.size(this.contentTypes),
        // TODO: V5: This event should be renamed numberOfContentTypes in V5 as the name is already taken to describe the number of content types using i18n.
        numberOfComponents: ___default.default.size(this.components),
        numberOfDynamicZones: dynamicZones(),
        numberOfCustomControllers: Object.values(this.controllers).filter(
          // TODO: Fix this at the content API loader level to prevent future types issues
          (controller) => controller !== void 0 && factories.isCustomController(controller)
        ).length,
        environment: this.config.environment
        // TODO: to add back
        // providers: this.config.installedProviders,
      }
    }).catch(this.log.error);
  }
  async openAdmin({ isInitialized: isInitialized2 }) {
    const shouldOpenAdmin = this.config.get("environment") === "development" && this.config.get("admin.autoOpen", true) !== false;
    if (shouldOpenAdmin && !isInitialized2) {
      try {
        await openBrowser.openBrowser(this.config);
        this.telemetry.send("didOpenTab");
      } catch (e) {
        this.telemetry.send("didNotOpenTab");
      }
    }
  }
  async postListen() {
    const isInitialized$1 = await isInitialized.isInitialized(this);
    this.startupLogger.logStartupMessage({ isInitialized: isInitialized$1 });
    this.log.info("started successfully");
    this.sendStartupTelemetry();
    this.openAdmin({ isInitialized: isInitialized$1 });
  }
  /**
   * Add behaviors to the server
   */
  async listen() {
    return new Promise((resolve, reject) => {
      const onListen = async () => {
        try {
          await this.postListen();
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      const listenSocket = this.config.get("server.socket");
      if (listenSocket) {
        this.server.listen(listenSocket, onListen);
      } else {
        const { host, port } = this.config.get("server");
        this.server.listen(port, host, onListen);
      }
    });
  }
  stopWithError(err, customMessage) {
    this.log.debug(`⛔️ Server wasn't able to start properly.`);
    if (customMessage) {
      this.log.error(customMessage);
    }
    this.log.error(err);
    return this.stop();
  }
  stop(exitCode = 1) {
    this.destroy();
    if (this.config.get("autoReload")) {
      process.send?.("stop");
    }
    process.exit(exitCode);
  }
  async load() {
    await this.register();
    await this.bootstrap();
    this.isLoaded = true;
    return this;
  }
  async register() {
    this.ee.init(this.dirs.app.root, this.log);
    for (const provider of index$1.providers) {
      await provider.register?.(this);
    }
    await this.runPluginsLifecycles(lifecycles.LIFECYCLES.REGISTER);
    await this.runUserLifecycles(lifecycles.LIFECYCLES.REGISTER);
    convertCustomFieldType.convertCustomFieldType(this);
    return this;
  }
  async bootstrap() {
    this.configureGlobalProxy();
    const models = [
      ...transformContentTypesToModels.transformContentTypesToModels(
        [...Object.values(this.contentTypes), ...Object.values(this.components)],
        this.db.metadata.identifiers
      ),
      ...this.get("models").get()
    ];
    await this.db.init({ models });
    let oldContentTypes;
    if (await this.db.getSchemaConnection().hasTable(coreStore.coreStoreModel.tableName)) {
      oldContentTypes = await this.store.get({
        type: "strapi",
        name: "content_types",
        key: "schema"
      });
    }
    await this.hook("strapi::content-types.beforeSync").call({
      oldContentTypes,
      contentTypes: this.contentTypes
    });
    await this.db.schema.sync();
    if (this.EE) {
      await index$2.checkLicense({ strapi: this });
    }
    await this.hook("strapi::content-types.afterSync").call({
      oldContentTypes,
      contentTypes: this.contentTypes
    });
    await this.store.set({
      type: "strapi",
      name: "content_types",
      key: "schema",
      value: this.contentTypes
    });
    await this.server.initMiddlewares();
    this.server.initRouting();
    await this.contentAPI.permissions.registerActions();
    await this.runPluginsLifecycles(lifecycles.LIFECYCLES.BOOTSTRAP);
    for (const provider of index$1.providers) {
      await provider.bootstrap?.(this);
    }
    await this.runUserLifecycles(lifecycles.LIFECYCLES.BOOTSTRAP);
    return this;
  }
  configureGlobalProxy() {
    const globalProxy = this.config.get("server.proxy.global");
    const httpProxy = this.config.get("server.proxy.http") || globalProxy;
    const httpsProxy = this.config.get("server.proxy.https") || globalProxy;
    if (!httpProxy && !httpsProxy) {
      return;
    }
    globalAgent__namespace.bootstrap();
    if (httpProxy) {
      this.log.info(`Using HTTP proxy: ${httpProxy}`);
      global.GLOBAL_AGENT.HTTP_PROXY = httpProxy;
    }
    if (httpsProxy) {
      this.log.info(`Using HTTPS proxy: ${httpsProxy}`);
      global.GLOBAL_AGENT.HTTPS_PROXY = httpsProxy;
    }
  }
  async destroy() {
    this.log.info("Shutting down");
    await this.runPluginsLifecycles(lifecycles.LIFECYCLES.DESTROY);
    for (const provider of index$1.providers) {
      await provider.destroy?.(this);
    }
    await this.runUserLifecycles(lifecycles.LIFECYCLES.DESTROY);
    await this.server.destroy();
    this.eventHub.destroy();
    await this.db?.destroy();
    process.removeAllListeners();
    delete global.strapi;
    this.log.info("poratl has been shut down");
  }
  async runPluginsLifecycles(lifecycleName) {
    await this.get("modules")[lifecycleName]();
  }
  async runUserLifecycles(lifecycleName) {
    const userLifecycleFunction = this.app && this.app[lifecycleName];
    if (fp.isFunction(userLifecycleFunction)) {
      await userLifecycleFunction({ strapi: this });
    }
  }
  getModel(uid) {
    if (uid in this.contentTypes) {
      return this.contentTypes[uid];
    }
    if (uid in this.components) {
      return this.components[uid];
    }
  }
  /**
   * @deprecated Use `strapi.db.query` instead
   */
  query(uid) {
    return this.db.query(uid);
  }
}
module.exports = Strapi;
//# sourceMappingURL=Strapi.js.map
