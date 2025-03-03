import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import browserslist from "browserslist";
import { createStrapi } from "@strapi/core";
import { loadEnv, getStrapiAdminEnvVars } from "./core/env.mjs";
import { getEnabledPlugins, getMapOfPluginsWithAdmin } from "./core/plugins.mjs";
import { loadUserAppFile } from "./core/admin-customisations.mjs";
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
  const strapiInstance = strapi ?? createStrapi({
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
  await loadEnv(cwd);
  const env = getStrapiAdminEnvVars({
    ADMIN_PATH: adminPath,
    ADMIN_BACKEND_URL: serverUrl,
    TELEMETRY_DISABLED: String(strapiInstance.telemetry.isDisabled)
  });
  const envKeys = Object.keys(env);
  if (envKeys.length > 0) {
    logger.info(
      [
        "Including the following ENV variables as part of the JS bundle:",
        ...envKeys.map((key) => `    - ${key}`)
      ].join(os.EOL)
    );
  }
  const distPath = path.join(strapiInstance.dirs.dist.root, "build");
  const distDir = path.relative(cwd, distPath);
  try {
    logger.debug(`Cleaning dist folder: ${distPath}`);
    await fs.rm(distPath, { recursive: true, force: true });
    logger.debug("Cleaned dist folder");
  } catch {
    logger.debug("There was no dist folder to clean");
  }
  const runtimeDir = path.join(cwd, ".strapi", "client");
  const entry = path.relative(cwd, path.join(runtimeDir, "app.js"));
  const plugins = await getEnabledPlugins({ cwd, logger, runtimeDir, strapi: strapiInstance });
  logger.debug("Enabled plugins", os.EOL, plugins);
  const pluginsWithFront = getMapOfPluginsWithAdmin(plugins);
  logger.debug("Enabled plugins with FE", os.EOL, pluginsWithFront);
  const target = browserslist.loadConfig({ path: cwd }) ?? DEFAULT_BROWSERSLIST;
  const customisations = await loadUserAppFile({ appDir, runtimeDir });
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
    env,
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
export {
  createBuildContext
};
//# sourceMappingURL=create-build-context.mjs.map
