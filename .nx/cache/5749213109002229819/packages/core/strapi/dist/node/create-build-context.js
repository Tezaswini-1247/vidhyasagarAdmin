"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const os = require("node:os");
const path = require("node:path");
const fs = require("node:fs/promises");
const browserslist = require("browserslist");
const core = require("@strapi/core");
const env = require("./core/env.js");
const plugins = require("./core/plugins.js");
const adminCustomisations = require("./core/admin-customisations.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const os__default = /* @__PURE__ */ _interopDefault(os);
const path__default = /* @__PURE__ */ _interopDefault(path);
const fs__default = /* @__PURE__ */ _interopDefault(fs);
const browserslist__default = /* @__PURE__ */ _interopDefault(browserslist);
const DEFAULT_BROWSERSLIST = [
  "last 3 major versions",
  "Firefox ESR",
  "last 2 Opera versions",
  "not dead"
];
const createBuildContext = async ({
  cwd,
  logger,
  tsconfig,
  strapi,
  options = {}
}) => {
  const strapiInstance = strapi ?? core.createStrapi({
    // Directories
    appDir: cwd,
    distDir: tsconfig?.config.options.outDir ?? "",
    // Options
    autoReload: true,
    serveAdminPanel: false
  });
  const serverUrl = strapiInstance.config.get("server.url");
  const adminPath = strapiInstance.config.get("admin.path");
  const appDir = strapiInstance.dirs.app.root;
  await env.loadEnv(cwd);
  const env$1 = env.getStrapiAdminEnvVars({
    ADMIN_PATH: adminPath,
    ADMIN_BACKEND_URL: serverUrl,
    TELEMETRY_DISABLED: String(strapiInstance.telemetry.isDisabled)
  });
  const envKeys = Object.keys(env$1);
  if (envKeys.length > 0) {
    logger.info(
      [
        "Including the following ENV variables as part of the JS bundle:",
        ...envKeys.map((key) => `    - ${key}`)
      ].join(os__default.default.EOL)
    );
  }
  const distPath = path__default.default.join(strapiInstance.dirs.dist.root, "build");
  const distDir = path__default.default.relative(cwd, distPath);
  try {
    logger.debug(`Cleaning dist folder: ${distPath}`);
    await fs__default.default.rm(distPath, { recursive: true, force: true });
    logger.debug("Cleaned dist folder");
  } catch {
    logger.debug("There was no dist folder to clean");
  }
  const runtimeDir = path__default.default.join(cwd, ".strapi", "client");
  const entry = path__default.default.relative(cwd, path__default.default.join(runtimeDir, "app.js"));
  const plugins$1 = await plugins.getEnabledPlugins({ cwd, logger, runtimeDir, strapi: strapiInstance });
  logger.debug("Enabled plugins", os__default.default.EOL, plugins$1);
  const pluginsWithFront = plugins.getMapOfPluginsWithAdmin(plugins$1);
  logger.debug("Enabled plugins with FE", os__default.default.EOL, pluginsWithFront);
  const target = browserslist__default.default.loadConfig({ path: cwd }) ?? DEFAULT_BROWSERSLIST;
  const customisations = await adminCustomisations.loadUserAppFile({ appDir, runtimeDir });
  const features = strapiInstance.config.get("features", void 0);
  const { bundler = "vite", ...restOptions } = options;
  const buildContext = {
    appDir,
    basePath: `${adminPath}/`,
    bundler,
    customisations,
    cwd,
    distDir,
    distPath,
    entry,
    env: env$1,
    features,
    logger,
    options: restOptions,
    plugins: pluginsWithFront,
    runtimeDir,
    strapi: strapiInstance,
    target,
    tsconfig
  };
  return buildContext;
};
exports.createBuildContext = createBuildContext;
//# sourceMappingURL=create-build-context.js.map
