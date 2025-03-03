"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const crypto$1 = require("crypto");
const fse = require("fs-extra");
const inquirer = require("inquirer");
const boxen = require("boxen");
const path = require("path");
const chalk = require("chalk");
const axios = require("axios");
const crypto = require("node:crypto");
const utils = require("@strapi/utils");
const tar = require("tar");
const minimatch = require("minimatch");
const fp = require("lodash/fp");
const os = require("os");
const XDGAppPaths = require("xdg-app-paths");
const lodash = require("lodash");
const jwksClient = require("jwks-rsa");
const jwt = require("jsonwebtoken");
const stringify = require("fast-safe-stringify");
const ora = require("ora");
const cliProgress = require("cli-progress");
const pkgUp = require("pkg-up");
const yup = require("yup");
const EventSource = require("eventsource");
const commander = require("commander");
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
const crypto__default = /* @__PURE__ */ _interopDefault(crypto$1);
const fse__namespace = /* @__PURE__ */ _interopNamespace(fse);
const inquirer__default = /* @__PURE__ */ _interopDefault(inquirer);
const boxen__default = /* @__PURE__ */ _interopDefault(boxen);
const path__namespace = /* @__PURE__ */ _interopNamespace(path);
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const axios__default = /* @__PURE__ */ _interopDefault(axios);
const crypto__namespace = /* @__PURE__ */ _interopNamespace(crypto);
const tar__namespace = /* @__PURE__ */ _interopNamespace(tar);
const os__default = /* @__PURE__ */ _interopDefault(os);
const XDGAppPaths__default = /* @__PURE__ */ _interopDefault(XDGAppPaths);
const jwksClient__default = /* @__PURE__ */ _interopDefault(jwksClient);
const jwt__default = /* @__PURE__ */ _interopDefault(jwt);
const stringify__default = /* @__PURE__ */ _interopDefault(stringify);
const ora__default = /* @__PURE__ */ _interopDefault(ora);
const cliProgress__namespace = /* @__PURE__ */ _interopNamespace(cliProgress);
const pkgUp__default = /* @__PURE__ */ _interopDefault(pkgUp);
const yup__namespace = /* @__PURE__ */ _interopNamespace(yup);
const EventSource__default = /* @__PURE__ */ _interopDefault(EventSource);
const apiConfig = {
  apiBaseUrl: utils.env("STRAPI_CLI_CLOUD_API", "https://cloud-cli-api.strapi.io"),
  dashboardBaseUrl: utils.env("STRAPI_CLI_CLOUD_DASHBOARD", "https://cloud.strapi.io")
};
const IGNORED_PATTERNS = [
  "**/.git/**",
  "**/node_modules/**",
  "**/build/**",
  "**/dist/**",
  "**/.cache/**",
  "**/.circleci/**",
  "**/.github/**",
  "**/.gitignore",
  "**/.gitkeep",
  "**/.gitlab-ci.yml",
  "**/.idea/**",
  "**/.vscode/**"
];
const isIgnoredFile = (folderPath, file, ignorePatterns) => {
  ignorePatterns.push(...IGNORED_PATTERNS);
  const relativeFilePath = path__namespace.join(folderPath, file);
  let isIgnored = false;
  for (const pattern of ignorePatterns) {
    if (pattern.startsWith("!")) {
      if (minimatch.minimatch(relativeFilePath, pattern.slice(1), { matchBase: true, dot: true })) {
        return false;
      }
    } else if (minimatch.minimatch(relativeFilePath, pattern, { matchBase: true, dot: true })) {
      if (path__namespace.basename(file) !== ".gitkeep") {
        isIgnored = true;
      }
    }
  }
  return isIgnored;
};
const getFiles = async (dirPath, ignorePatterns = [], subfolder = "") => {
  const arrayOfFiles = [];
  const entries = await fse__namespace.readdir(path__namespace.join(dirPath, subfolder));
  for (const entry of entries) {
    const entryPathFromRoot = path__namespace.join(subfolder, entry);
    const entryPath = path__namespace.relative(dirPath, entryPathFromRoot);
    const isIgnored = isIgnoredFile(dirPath, entryPathFromRoot, ignorePatterns);
    if (!isIgnored) {
      if (fse__namespace.statSync(entryPath).isDirectory()) {
        const subFiles = await getFiles(dirPath, ignorePatterns, entryPathFromRoot);
        arrayOfFiles.push(...subFiles);
      } else {
        arrayOfFiles.push(entryPath);
      }
    }
  }
  return arrayOfFiles;
};
const readGitignore = async (folderPath) => {
  const gitignorePath = path__namespace.resolve(folderPath, ".gitignore");
  const pathExist = await fse__namespace.pathExists(gitignorePath);
  if (!pathExist) return [];
  const gitignoreContent = await fse__namespace.readFile(gitignorePath, "utf8");
  return gitignoreContent.split(/\r?\n/).filter((line) => Boolean(line.trim()) && !line.startsWith("#"));
};
const compressFilesToTar = async (storagePath, folderToCompress, filename) => {
  const ignorePatterns = await readGitignore(folderToCompress);
  const filesToCompress = await getFiles(folderToCompress, ignorePatterns);
  return tar__namespace.c(
    {
      gzip: true,
      file: path__namespace.resolve(storagePath, filename)
    },
    filesToCompress
  );
};
const APP_FOLDER_NAME = "com.strapi.cli";
const CONFIG_FILENAME = "config.json";
async function checkDirectoryExists(directoryPath) {
  try {
    const fsStat = await fse__namespace.default.lstat(directoryPath);
    return fsStat.isDirectory();
  } catch (e) {
    return false;
  }
}
async function getTmpStoragePath() {
  const storagePath = path__namespace.default.join(os__default.default.tmpdir(), APP_FOLDER_NAME);
  await fse__namespace.default.ensureDir(storagePath);
  return storagePath;
}
async function getConfigPath() {
  const configDirs = XDGAppPaths__default.default(APP_FOLDER_NAME).configDirs();
  const configPath = configDirs.find(checkDirectoryExists);
  if (!configPath) {
    await fse__namespace.default.ensureDir(configDirs[0]);
    return configDirs[0];
  }
  return configPath;
}
async function getLocalConfig$1() {
  const configPath = await getConfigPath();
  const configFilePath = path__namespace.default.join(configPath, CONFIG_FILENAME);
  await fse__namespace.default.ensureFile(configFilePath);
  try {
    return await fse__namespace.default.readJSON(configFilePath, { encoding: "utf8", throws: true });
  } catch (e) {
    return {};
  }
}
async function saveLocalConfig(data) {
  const configPath = await getConfigPath();
  const configFilePath = path__namespace.default.join(configPath, CONFIG_FILENAME);
  await fse__namespace.default.writeJson(configFilePath, data, { encoding: "utf8", spaces: 2, mode: 384 });
}
const name = "@strapi/cloud-cli";
const version = "5.4.2";
const description = "Commands to interact with the Strapi Cloud";
const keywords = [
  "strapi",
  "cloud",
  "cli"
];
const homepage = "https://strapi.io";
const bugs = {
  url: "https://github.com/strapi/strapi/issues"
};
const repository = {
  type: "git",
  url: "git://github.com/strapi/strapi.git"
};
const license = "SEE LICENSE IN LICENSE";
const author = {
  name: "Strapi Solutions SAS",
  email: "hi@strapi.io",
  url: "https://strapi.io"
};
const maintainers = [
  {
    name: "Strapi Solutions SAS",
    email: "hi@strapi.io",
    url: "https://strapi.io"
  }
];
const main = "./dist/index.js";
const module$1 = "./dist/index.mjs";
const source = "./src/index.ts";
const types = "./dist/src/index.d.ts";
const bin = "./bin/index.js";
const files = [
  "./dist",
  "./bin"
];
const scripts = {
  build: "pack-up build",
  clean: "run -T rimraf ./dist",
  lint: "run -T eslint .",
  "test:unit": "run -T jest",
  watch: "pack-up watch"
};
const dependencies = {
  "@strapi/utils": "5.4.2",
  axios: "1.7.4",
  boxen: "5.1.2",
  chalk: "4.1.2",
  "cli-progress": "3.12.0",
  commander: "8.3.0",
  eventsource: "2.0.2",
  "fast-safe-stringify": "2.1.1",
  "fs-extra": "11.2.0",
  inquirer: "8.2.5",
  jsonwebtoken: "9.0.0",
  "jwks-rsa": "3.1.0",
  lodash: "4.17.21",
  minimatch: "9.0.3",
  open: "8.4.0",
  ora: "5.4.1",
  "pkg-up": "3.1.0",
  tar: "6.2.1",
  "xdg-app-paths": "8.3.0",
  yup: "0.32.9"
};
const devDependencies = {
  "@strapi/pack-up": "5.0.2",
  "@types/cli-progress": "3.11.5",
  "@types/eventsource": "1.1.15",
  "@types/lodash": "^4.14.191",
  "eslint-config-custom": "5.4.2",
  tsconfig: "5.4.2"
};
const engines = {
  node: ">=18.0.0 <=22.x.x",
  npm: ">=6.0.0"
};
const gitHead = "7d785703f52464577d077c4618cbe68b44f8a9cd";
const packageJson = {
  name,
  version,
  description,
  keywords,
  homepage,
  bugs,
  repository,
  license,
  author,
  maintainers,
  main,
  module: module$1,
  source,
  types,
  bin,
  files,
  scripts,
  dependencies,
  devDependencies,
  engines,
  gitHead
};
const VERSION = "v1";
async function cloudApiFactory({ logger }, token) {
  const localConfig = await getLocalConfig$1();
  const customHeaders = {
    "x-device-id": localConfig.deviceId,
    "x-app-version": packageJson.version,
    "x-os-name": os__default.default.type(),
    "x-os-version": os__default.default.version(),
    "x-language": Intl.DateTimeFormat().resolvedOptions().locale,
    "x-node-version": process.versions.node
  };
  const axiosCloudAPI = axios__default.default.create({
    baseURL: `${apiConfig.apiBaseUrl}/${VERSION}`,
    headers: {
      "Content-Type": "application/json",
      ...customHeaders
    }
  });
  if (token) {
    axiosCloudAPI.defaults.headers.Authorization = `Bearer ${token}`;
  }
  return {
    deploy({ filePath, project }, { onUploadProgress }) {
      return axiosCloudAPI.post(
        `/deploy/${project.name}`,
        { file: fse__namespace.default.createReadStream(filePath), targetEnvironment: project.targetEnvironment },
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress
        }
      );
    },
    async createProject({ name: name2, nodeVersion, region, plan }) {
      const response = await axiosCloudAPI.post("/project", {
        projectName: name2,
        region,
        nodeVersion,
        plan
      });
      return {
        data: {
          id: response.data.id,
          name: response.data.name,
          nodeVersion: response.data.nodeVersion,
          region: response.data.region
        },
        status: response.status
      };
    },
    getUserInfo() {
      return axiosCloudAPI.get("/user");
    },
    async config() {
      try {
        const response = await axiosCloudAPI.get("/config");
        if (response.status !== 200) {
          throw new Error("Error fetching cloud CLI config from the server.");
        }
        return response;
      } catch (error) {
        logger.debug(
          "🥲 Oops! Couldn't retrieve the cloud CLI config from the server. Please try again."
        );
        throw error;
      }
    },
    async listProjects() {
      try {
        const response = await axiosCloudAPI.get("/projects");
        if (response.status !== 200) {
          throw new Error("Error fetching cloud projects from the server.");
        }
        return response;
      } catch (error) {
        logger.debug(
          "🥲 Oops! Couldn't retrieve your project's list from the server. Please try again."
        );
        throw error;
      }
    },
    async listLinkProjects() {
      try {
        const response = await axiosCloudAPI.get("/projects-linkable");
        if (response.status !== 200) {
          throw new Error("Error fetching cloud projects from the server.");
        }
        return response;
      } catch (error) {
        logger.debug(
          "🥲 Oops! Couldn't retrieve your project's list from the server. Please try again."
        );
        throw error;
      }
    },
    async listEnvironments({ name: name2 }) {
      try {
        const response = await axiosCloudAPI.get(`/projects/${name2}/environments`);
        if (response.status !== 200) {
          throw new Error("Error fetching cloud environments from the server.");
        }
        return response;
      } catch (error) {
        logger.debug(
          "🥲 Oops! Couldn't retrieve your project's environments from the server. Please try again."
        );
        throw error;
      }
    },
    async listLinkEnvironments({ name: name2 }) {
      try {
        const response = await axiosCloudAPI.get(`/projects/${name2}/environments-linkable`);
        if (response.status !== 200) {
          throw new Error("Error fetching cloud environments from the server.");
        }
        return response;
      } catch (error) {
        logger.debug(
          "🥲 Oops! Couldn't retrieve your project's environments from the server. Please try again."
        );
        throw error;
      }
    },
    async getProject({ name: name2 }) {
      try {
        const response = await axiosCloudAPI.get(`/projects/${name2}`);
        if (response.status !== 200) {
          throw new Error("Error fetching project's details.");
        }
        return response;
      } catch (error) {
        logger.debug(
          "🥲 Oops! There was a problem retrieving your project's details. Please try again."
        );
        throw error;
      }
    },
    track(event, payload = {}) {
      return axiosCloudAPI.post("/track", {
        event,
        payload
      });
    }
  };
}
const LOCAL_SAVE_FILENAME = ".strapi-cloud.json";
const getFilePath = (directoryPath) => path__namespace.default.join(directoryPath || process.cwd(), LOCAL_SAVE_FILENAME);
async function save(data, { directoryPath } = {}) {
  const pathToFile = getFilePath(directoryPath);
  await fse__namespace.default.ensureDir(path__namespace.default.dirname(pathToFile));
  await fse__namespace.default.writeJson(pathToFile, data, { encoding: "utf8" });
}
async function retrieve({
  directoryPath
} = {}) {
  const pathToFile = getFilePath(directoryPath);
  const pathExists = await fse__namespace.default.pathExists(pathToFile);
  if (!pathExists) {
    return {};
  }
  return fse__namespace.default.readJSON(pathToFile, { encoding: "utf8" });
}
async function patch(patchData, { directoryPath } = {}) {
  const pathToFile = getFilePath(directoryPath);
  const existingData = await retrieve({ directoryPath });
  if (!existingData) {
    throw new Error("No configuration data found to patch.");
  }
  const newData = lodash.merge(existingData, patchData);
  await fse__namespace.default.writeJson(pathToFile, newData, { encoding: "utf8" });
}
async function deleteConfig({ directoryPath } = {}) {
  const pathToFile = getFilePath(directoryPath);
  const pathExists = await fse__namespace.default.pathExists(pathToFile);
  if (pathExists) {
    await fse__namespace.default.remove(pathToFile);
  }
}
const strapiInfoSave = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  LOCAL_SAVE_FILENAME,
  deleteConfig,
  patch,
  retrieve,
  save
}, Symbol.toStringTag, { value: "Module" }));
let cliConfig;
async function tokenServiceFactory({ logger }) {
  const cloudApiService = await cloudApiFactory({ logger });
  async function saveToken(str) {
    const appConfig = await getLocalConfig$1();
    if (!appConfig) {
      logger.error("There was a problem saving your token. Please try again.");
      return;
    }
    appConfig.token = str;
    try {
      await saveLocalConfig(appConfig);
    } catch (e) {
      logger.debug(e);
      logger.error("There was a problem saving your token. Please try again.");
    }
  }
  async function retrieveToken() {
    const appConfig = await getLocalConfig$1();
    if (appConfig.token) {
      if (await isTokenValid(appConfig.token)) {
        return appConfig.token;
      }
    }
    return void 0;
  }
  async function validateToken(idToken, jwksUrl) {
    const client = jwksClient__default.default({
      jwksUri: jwksUrl
    });
    const getKey = (header, callback) => {
      client.getSigningKey(header.kid, (e, key) => {
        if (e) {
          callback(e);
        } else if (key) {
          const publicKey = "publicKey" in key ? key.publicKey : key.rsaPublicKey;
          callback(null, publicKey);
        } else {
          callback(new Error("Key not found"));
        }
      });
    };
    const decodedToken = jwt__default.default.decode(idToken, { complete: true });
    if (!decodedToken) {
      if (typeof idToken === "undefined" || idToken === "") {
        logger.warn("You need to be logged in to use this feature. Please log in and try again.");
      } else {
        logger.error(
          "There seems to be a problem with your login information. Please try logging in again."
        );
      }
      return Promise.reject(new Error("Invalid token"));
    }
    return new Promise((resolve, reject) => {
      jwt__default.default.verify(idToken, getKey, (err) => {
        if (err) {
          reject(err);
        }
        if (decodedToken.payload.exp < Math.floor(Date.now() / 1e3)) {
          reject(new Error("Token is expired"));
        }
        resolve();
      });
    });
  }
  async function isTokenValid(token) {
    try {
      const config = await cloudApiService.config();
      cliConfig = config.data;
      if (token) {
        await validateToken(token, cliConfig.jwksUrl);
        return true;
      }
      return false;
    } catch (e) {
      logger.debug(e);
      return false;
    }
  }
  async function eraseToken() {
    const appConfig = await getLocalConfig$1();
    if (!appConfig) {
      return;
    }
    delete appConfig.token;
    try {
      await saveLocalConfig(appConfig);
    } catch (e) {
      logger.debug(e);
      logger.error(
        "There was an issue removing your login information. Please try logging out again."
      );
      throw e;
    }
  }
  async function getValidToken(ctx, loginAction2) {
    let token = await retrieveToken();
    while (!token || !await isTokenValid(token)) {
      logger.log(
        token ? "Oops! Your token seems expired or invalid. Please login again." : "We couldn't find a valid token. You need to be logged in to use this feature."
      );
      if (!await loginAction2(ctx)) return null;
      token = await retrieveToken();
    }
    return token;
  }
  return {
    saveToken,
    retrieveToken,
    validateToken,
    isTokenValid,
    eraseToken,
    getValidToken
  };
}
const stringifyArg = (arg) => {
  return typeof arg === "object" ? stringify__default.default(arg) : arg;
};
const createLogger = (options = {}) => {
  const { silent = false, debug = false, timestamp = true } = options;
  const state = { errors: 0, warning: 0 };
  return {
    get warnings() {
      return state.warning;
    },
    get errors() {
      return state.errors;
    },
    async debug(...args) {
      if (silent || !debug) {
        return;
      }
      console.log(
        chalk__default.default.cyan(`[DEBUG]${timestamp ? `	[${(/* @__PURE__ */ new Date()).toISOString()}]` : ""}`),
        ...args.map(stringifyArg)
      );
    },
    info(...args) {
      if (silent) {
        return;
      }
      console.info(
        chalk__default.default.blue(`[INFO]${timestamp ? `	[${(/* @__PURE__ */ new Date()).toISOString()}]` : ""}`),
        ...args.map(stringifyArg)
      );
    },
    log(...args) {
      if (silent) {
        return;
      }
      console.info(
        chalk__default.default.blue(`${timestamp ? `	[${(/* @__PURE__ */ new Date()).toISOString()}]` : ""}`),
        ...args.map(stringifyArg)
      );
    },
    success(...args) {
      if (silent) {
        return;
      }
      console.info(
        chalk__default.default.green(`[SUCCESS]${timestamp ? `	[${(/* @__PURE__ */ new Date()).toISOString()}]` : ""}`),
        ...args.map(stringifyArg)
      );
    },
    warn(...args) {
      state.warning += 1;
      if (silent) {
        return;
      }
      console.warn(
        chalk__default.default.yellow(`[WARN]${timestamp ? `	[${(/* @__PURE__ */ new Date()).toISOString()}]` : ""}`),
        ...args.map(stringifyArg)
      );
    },
    error(...args) {
      state.errors += 1;
      if (silent) {
        return;
      }
      console.error(
        chalk__default.default.red(`[ERROR]${timestamp ? `	[${(/* @__PURE__ */ new Date()).toISOString()}]` : ""}`),
        ...args.map(stringifyArg)
      );
    },
    // @ts-expect-error – returning a subpart of ora is fine because the types tell us what is what.
    spinner(text) {
      if (silent) {
        return {
          succeed() {
            return this;
          },
          fail() {
            return this;
          },
          start() {
            return this;
          },
          text: "",
          isSpinning: false
        };
      }
      return ora__default.default(text);
    },
    progressBar(totalSize, text) {
      if (silent) {
        return {
          start() {
            return this;
          },
          stop() {
            return this;
          },
          update() {
            return this;
          }
        };
      }
      const progressBar = new cliProgress__namespace.SingleBar({
        format: `${text ? `${text} |` : ""}${chalk__default.default.green("{bar}")}| {percentage}%`,
        barCompleteChar: "█",
        barIncompleteChar: "░",
        hideCursor: true,
        forceRedraw: true
      });
      progressBar.start(totalSize, 0);
      return progressBar;
    }
  };
};
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cloudApiFactory,
  createLogger,
  local: strapiInfoSave,
  tokenServiceFactory
}, Symbol.toStringTag, { value: "Module" }));
yup__namespace.object({
  name: yup__namespace.string().required(),
  exports: yup__namespace.lazy(
    (value) => yup__namespace.object(
      typeof value === "object" ? Object.entries(value).reduce(
        (acc, [key, value2]) => {
          if (typeof value2 === "object") {
            acc[key] = yup__namespace.object({
              types: yup__namespace.string().optional(),
              source: yup__namespace.string().required(),
              module: yup__namespace.string().optional(),
              import: yup__namespace.string().required(),
              require: yup__namespace.string().required(),
              default: yup__namespace.string().required()
            }).noUnknown(true);
          } else {
            acc[key] = yup__namespace.string().matches(/^\.\/.*\.json$/).required();
          }
          return acc;
        },
        {}
      ) : void 0
    ).optional()
  )
});
const loadPkg = async ({ cwd, logger }) => {
  const pkgPath = await pkgUp__default.default({ cwd });
  if (!pkgPath) {
    throw new Error("Could not find a package.json in the current directory");
  }
  const buffer = await fse__namespace.readFile(pkgPath);
  const pkg = JSON.parse(buffer.toString());
  logger.debug("Loaded package.json:", os__default.default.EOL, pkg);
  return pkg;
};
async function getProjectNameFromPackageJson(ctx) {
  try {
    const packageJson2 = await loadPkg(ctx);
    return packageJson2.name || "my-strapi-project";
  } catch (e) {
    return "my-strapi-project";
  }
}
const trackEvent = async (ctx, cloudApiService, eventName, eventData) => {
  try {
    await cloudApiService.track(eventName, eventData);
  } catch (e) {
    ctx.logger.debug(`Failed to track ${eventName}`, e);
  }
};
const openModule$1 = import("open");
async function promptLogin(ctx) {
  const response = await inquirer__default.default.prompt([
    {
      type: "confirm",
      name: "login",
      message: "Would you like to login?"
    }
  ]);
  if (response.login) {
    const loginSuccessful = await loginAction(ctx);
    return loginSuccessful;
  }
  return false;
}
async function loginAction(ctx) {
  const { logger } = ctx;
  const tokenService = await tokenServiceFactory(ctx);
  const existingToken = await tokenService.retrieveToken();
  const cloudApiService = await cloudApiFactory(ctx, existingToken || void 0);
  if (existingToken) {
    const isTokenValid = await tokenService.isTokenValid(existingToken);
    if (isTokenValid) {
      try {
        const userInfo = await cloudApiService.getUserInfo();
        const { email } = userInfo.data.data;
        if (email) {
          logger.log(`You are already logged into your account (${email}).`);
        } else {
          logger.log("You are already logged in.");
        }
        logger.log(
          "To access your dashboard, please copy and paste the following URL into your web browser:"
        );
        logger.log(chalk__default.default.underline(`${apiConfig.dashboardBaseUrl}/projects`));
        return true;
      } catch (e) {
        logger.debug("Failed to fetch user info", e);
      }
    }
  }
  let cliConfig2;
  try {
    logger.info("🔌 Connecting to the Strapi Cloud API...");
    const config = await cloudApiService.config();
    cliConfig2 = config.data;
  } catch (e) {
    logger.error("🥲 Oops! Something went wrong while logging you in. Please try again.");
    logger.debug(e);
    return false;
  }
  await trackEvent(ctx, cloudApiService, "willLoginAttempt", {});
  logger.debug("🔐 Creating device authentication request...", {
    client_id: cliConfig2.clientId,
    scope: cliConfig2.scope,
    audience: cliConfig2.audience
  });
  const deviceAuthResponse = await axios__default.default.post(cliConfig2.deviceCodeAuthUrl, {
    client_id: cliConfig2.clientId,
    scope: cliConfig2.scope,
    audience: cliConfig2.audience
  }).catch((e) => {
    logger.error("There was an issue with the authentication process. Please try again.");
    if (e.message) {
      logger.debug(e.message, e);
    } else {
      logger.debug(e);
    }
  });
  openModule$1.then((open) => {
    open.default(deviceAuthResponse.data.verification_uri_complete).catch((e) => {
      logger.error("We encountered an issue opening the browser. Please try again later.");
      logger.debug(e.message, e);
    });
  });
  logger.log("If a browser tab does not open automatically, please follow the next steps:");
  logger.log(
    `1. Open this url in your device: ${deviceAuthResponse.data.verification_uri_complete}`
  );
  logger.log(
    `2. Enter the following code: ${deviceAuthResponse.data.user_code} and confirm to login.
`
  );
  const tokenPayload = {
    grant_type: "urn:ietf:params:oauth:grant-type:device_code",
    device_code: deviceAuthResponse.data.device_code,
    client_id: cliConfig2.clientId
  };
  let isAuthenticated = false;
  const authenticate = async () => {
    const spinner = logger.spinner("Waiting for authentication");
    spinner.start();
    const spinnerFail = () => spinner.fail("Authentication failed!");
    while (!isAuthenticated) {
      try {
        const tokenResponse = await axios__default.default.post(cliConfig2.tokenUrl, tokenPayload);
        const authTokenData = tokenResponse.data;
        if (tokenResponse.status === 200) {
          try {
            logger.debug("🔐 Validating token...");
            await tokenService.validateToken(authTokenData.id_token, cliConfig2.jwksUrl);
            logger.debug("🔐 Token validation successful!");
          } catch (e) {
            logger.debug(e);
            spinnerFail();
            throw new Error("Unable to proceed: Token validation failed");
          }
          logger.debug("🔍 Fetching user information...");
          const cloudApiServiceWithToken = await cloudApiFactory(ctx, authTokenData.access_token);
          await cloudApiServiceWithToken.getUserInfo();
          logger.debug("🔍 User information fetched successfully!");
          try {
            logger.debug("📝 Saving login information...");
            await tokenService.saveToken(authTokenData.access_token);
            logger.debug("📝 Login information saved successfully!");
            isAuthenticated = true;
          } catch (e) {
            logger.error(
              "There was a problem saving your login information. Please try logging in again."
            );
            logger.debug(e);
            spinnerFail();
            return false;
          }
        }
      } catch (e) {
        if (e.message === "Unable to proceed: Token validation failed") {
          logger.error(
            "There seems to be a problem with your login information. Please try logging in again."
          );
          spinnerFail();
          await trackEvent(ctx, cloudApiService, "didNotLogin", { loginMethod: "cli" });
          return false;
        }
        if (e.response?.data.error && !["authorization_pending", "slow_down"].includes(e.response.data.error)) {
          logger.debug(e);
          spinnerFail();
          await trackEvent(ctx, cloudApiService, "didNotLogin", { loginMethod: "cli" });
          return false;
        }
        await new Promise((resolve) => {
          setTimeout(resolve, deviceAuthResponse.data.interval * 1e3);
        });
      }
    }
    spinner.succeed("Authentication successful!");
    logger.log("You are now logged into Strapi Cloud.");
    logger.log(
      "To access your dashboard, please copy and paste the following URL into your web browser:"
    );
    logger.log(chalk__default.default.underline(`${apiConfig.dashboardBaseUrl}/projects`));
    await trackEvent(ctx, cloudApiService, "didLogin", { loginMethod: "cli" });
  };
  await authenticate();
  return isAuthenticated;
}
function questionDefaultValuesMapper(questionsMap) {
  return (questions) => {
    return questions.map((question) => {
      const questionName = question.name;
      if (questionName in questionsMap) {
        const questionDefault = questionsMap[questionName];
        if (typeof questionDefault === "function") {
          return {
            ...question,
            default: questionDefault(question)
          };
        }
        return {
          ...question,
          default: questionDefault
        };
      }
      return question;
    });
  };
}
function getDefaultsFromQuestions(questions) {
  return questions.reduce((acc, question) => {
    if (question.default && question.name) {
      return { ...acc, [question.name]: question.default };
    }
    return acc;
  }, {});
}
function getProjectNodeVersionDefault(question) {
  const currentNodeVersion = process.versions.node.split(".")[0];
  if (question.type === "list" && Array.isArray(question.choices)) {
    const choice = question.choices.find((choice2) => choice2.value === currentNodeVersion);
    if (choice) {
      return choice.value;
    }
  }
  return question.default;
}
async function handleError(ctx, error) {
  const { logger } = ctx;
  logger.debug(error);
  if (error instanceof axios.AxiosError) {
    const errorMessage = typeof error.response?.data === "string" ? error.response.data : null;
    switch (error.response?.status) {
      case 403:
        logger.error(
          errorMessage || "You do not have permission to create a project. Please contact support for assistance."
        );
        return;
      case 400:
        logger.error(errorMessage || "Invalid input. Please check your inputs and try again.");
        return;
      case 503:
        logger.error(
          "Strapi Cloud project creation is currently unavailable. Please try again later."
        );
        return;
      default:
        if (errorMessage) {
          logger.error(errorMessage);
          return;
        }
        break;
    }
  }
  logger.error(
    "We encountered an issue while creating your project. Please try again in a moment. If the problem persists, contact support for assistance."
  );
}
async function createProject$1(ctx, cloudApi, projectInput) {
  const { logger } = ctx;
  const spinner = logger.spinner("Setting up your project...").start();
  try {
    const { data } = await cloudApi.createProject(projectInput);
    await save({ project: data });
    spinner.succeed("Project created successfully!");
    return data;
  } catch (e) {
    spinner.fail("An error occurred while creating the project on Strapi Cloud.");
    throw e;
  }
}
const action$6 = async (ctx) => {
  const { logger } = ctx;
  const { getValidToken, eraseToken } = await tokenServiceFactory(ctx);
  const token = await getValidToken(ctx, promptLogin);
  if (!token) {
    return;
  }
  const cloudApi = await cloudApiFactory(ctx, token);
  const { data: config } = await cloudApi.config();
  const projectName = await getProjectNameFromPackageJson(ctx);
  const defaultAnswersMapper = questionDefaultValuesMapper({
    name: projectName,
    nodeVersion: getProjectNodeVersionDefault
  });
  const questions = defaultAnswersMapper(config.projectCreation.questions);
  const defaultValues = {
    ...config.projectCreation.defaults,
    ...getDefaultsFromQuestions(questions)
  };
  const projectAnswersDefaulted = fp.defaults(defaultValues);
  const projectAnswers = await inquirer__default.default.prompt(questions);
  const projectInput = projectAnswersDefaulted(projectAnswers);
  try {
    return await createProject$1(ctx, cloudApi, projectInput);
  } catch (e) {
    if (e instanceof axios.AxiosError && e.response?.status === 401) {
      logger.warn("Oops! Your session has expired. Please log in again to retry.");
      await eraseToken();
      if (await promptLogin(ctx)) {
        return await createProject$1(ctx, cloudApi, projectInput);
      }
    } else {
      await handleError(ctx, e);
    }
  }
};
function notificationServiceFactory({ logger }) {
  return (url, token, cliConfig2) => {
    const CONN_TIMEOUT = Number(cliConfig2.notificationsConnectionTimeout);
    const es = new EventSource__default.default(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    let timeoutId;
    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logger.log(
          "We were unable to connect to the server at this time. This could be due to a temporary issue. Please try again in a moment."
        );
        es.close();
      }, CONN_TIMEOUT);
    };
    es.onopen = resetTimeout;
    es.onmessage = (event) => {
      resetTimeout();
      const data = JSON.parse(event.data);
      if (data.message) {
        logger.log(data.message);
      }
      if (data.event === "deploymentFinished" || data.event === "deploymentFailed") {
        es.close();
      }
    };
  };
}
const buildLogsServiceFactory = ({ logger }) => {
  return async (url, token, cliConfig2) => {
    const CONN_TIMEOUT = Number(cliConfig2.buildLogsConnectionTimeout);
    const MAX_RETRIES = Number(cliConfig2.buildLogsMaxRetries);
    return new Promise((resolve, reject) => {
      let timeoutId = null;
      let retries = 0;
      const connect = (url2) => {
        const spinner = logger.spinner("Connecting to server to get build logs");
        spinner.start();
        const es = new EventSource__default.default(`${url2}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const clearExistingTimeout = () => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
        };
        const resetTimeout = () => {
          clearExistingTimeout();
          timeoutId = setTimeout(() => {
            if (spinner.isSpinning) {
              spinner.fail(
                "We were unable to connect to the server to get build logs at this time. This could be due to a temporary issue."
              );
            }
            es.close();
            reject(new Error("Connection timed out"));
          }, CONN_TIMEOUT);
        };
        es.onopen = resetTimeout;
        es.addEventListener("finished", (event) => {
          const data = JSON.parse(event.data);
          logger.log(data.msg);
          es.close();
          clearExistingTimeout();
          resolve(null);
        });
        es.addEventListener("log", (event) => {
          if (spinner.isSpinning) {
            spinner.succeed();
          }
          resetTimeout();
          const data = JSON.parse(event.data);
          logger.log(data.msg);
        });
        es.onerror = async () => {
          retries += 1;
          if (retries > MAX_RETRIES) {
            spinner.fail("We were unable to connect to the server to get build logs at this time.");
            es.close();
            clearExistingTimeout();
            reject(new Error("Max retries reached"));
          }
        };
      };
      connect(url);
    });
  };
};
const boxenOptions = {
  padding: 1,
  margin: 1,
  align: "center",
  borderColor: "yellow",
  borderStyle: "round"
};
const QUIT_OPTION$2 = "Quit";
async function promptForEnvironment(environments) {
  const choices = environments.map((env) => ({ name: env, value: env }));
  const { selectedEnvironment } = await inquirer__default.default.prompt([
    {
      type: "list",
      name: "selectedEnvironment",
      message: "Select the environment to deploy:",
      choices: [...choices, { name: chalk__default.default.grey(`(${QUIT_OPTION$2})`), value: null }]
    }
  ]);
  if (selectedEnvironment === null) {
    process.exit(1);
  }
  return selectedEnvironment;
}
async function upload(ctx, project, token, maxProjectFileSize) {
  const cloudApi = await cloudApiFactory(ctx, token);
  try {
    const storagePath = await getTmpStoragePath();
    const projectFolder = path__namespace.default.resolve(process.cwd());
    const packageJson2 = await loadPkg(ctx);
    if (!packageJson2) {
      ctx.logger.error(
        "Unable to deploy the project. Please make sure the package.json file is correctly formatted."
      );
      return;
    }
    ctx.logger.log("📦 Compressing project...");
    const hashname = crypto__namespace.createHash("sha512").update(packageJson2.name).digest("hex");
    const compressedFilename = `${hashname}.tar.gz`;
    try {
      ctx.logger.debug(
        "Compression parameters\n",
        `Storage path: ${storagePath}
`,
        `Project folder: ${projectFolder}
`,
        `Compressed filename: ${compressedFilename}`
      );
      await compressFilesToTar(storagePath, projectFolder, compressedFilename);
      ctx.logger.log("📦 Project compressed successfully!");
    } catch (e) {
      ctx.logger.error(
        "⚠️ Project compression failed. Try again later or check for large/incompatible files."
      );
      ctx.logger.debug(e);
      process.exit(1);
    }
    const tarFilePath = path__namespace.default.resolve(storagePath, compressedFilename);
    const fileStats = await fse__namespace.default.stat(tarFilePath);
    if (fileStats.size > maxProjectFileSize) {
      ctx.logger.log(
        "Unable to proceed: Your project is too big to be transferred, please use a git repo instead."
      );
      try {
        await fse__namespace.default.remove(tarFilePath);
      } catch (e) {
        ctx.logger.log("Unable to remove file: ", tarFilePath);
        ctx.logger.debug(e);
      }
      return;
    }
    ctx.logger.info("🚀 Uploading project...");
    const progressBar = ctx.logger.progressBar(100, "Upload Progress");
    try {
      const { data } = await cloudApi.deploy(
        { filePath: tarFilePath, project },
        {
          onUploadProgress(progressEvent) {
            const total = progressEvent.total || fileStats.size;
            const percentage = Math.round(progressEvent.loaded * 100 / total);
            progressBar.update(percentage);
          }
        }
      );
      progressBar.update(100);
      progressBar.stop();
      ctx.logger.success("✨ Upload finished!");
      return data.build_id;
    } catch (e) {
      progressBar.stop();
      ctx.logger.error("An error occurred while deploying the project. Please try again later.");
      ctx.logger.debug(e);
    } finally {
      await fse__namespace.default.remove(tarFilePath);
    }
    process.exit(0);
  } catch (e) {
    ctx.logger.error("An error occurred while deploying the project. Please try again later.");
    ctx.logger.debug(e);
    process.exit(1);
  }
}
async function getProject(ctx) {
  const { project } = await retrieve();
  if (!project) {
    try {
      return await action$6(ctx);
    } catch (e) {
      ctx.logger.error("An error occurred while deploying the project. Please try again later.");
      ctx.logger.debug(e);
      process.exit(1);
    }
  }
  return project;
}
async function getConfig({
  ctx,
  cloudApiService
}) {
  try {
    const { data: cliConfig2 } = await cloudApiService.config();
    return cliConfig2;
  } catch (e) {
    ctx.logger.debug("Failed to get cli config", e);
    return null;
  }
}
function validateEnvironment(ctx, environment, environments) {
  if (!environments.includes(environment)) {
    ctx.logger.error(`Environment ${environment} does not exist.`);
    process.exit(1);
  }
}
async function getTargetEnvironment(ctx, opts, project, environments) {
  if (opts.env) {
    validateEnvironment(ctx, opts.env, environments);
    return opts.env;
  }
  if (project.targetEnvironment) {
    return project.targetEnvironment;
  }
  if (environments.length > 1) {
    return promptForEnvironment(environments);
  }
  return environments[0];
}
function hasPendingOrLiveDeployment(environments, targetEnvironment) {
  const environment = environments.find((env) => env.name === targetEnvironment);
  if (!environment) {
    throw new Error(`Environment details ${targetEnvironment} not found.`);
  }
  return environment.hasPendingDeployment || environment.hasLiveDeployment || false;
}
const action$5 = async (ctx, opts) => {
  const { getValidToken } = await tokenServiceFactory(ctx);
  const token = await getValidToken(ctx, promptLogin);
  if (!token) {
    return;
  }
  const project = await getProject(ctx);
  if (!project) {
    return;
  }
  const cloudApiService = await cloudApiFactory(ctx, token);
  let projectData;
  let environments;
  let environmentsDetails;
  try {
    const {
      data: { data, metadata }
    } = await cloudApiService.getProject({ name: project.name });
    projectData = data;
    environments = projectData.environments;
    environmentsDetails = projectData.environmentsDetails;
    const isProjectSuspended = projectData.suspendedAt;
    if (isProjectSuspended) {
      ctx.logger.log(
        "\n Oops! This project has been suspended. \n\n Please reactivate it from the dashboard to continue deploying: "
      );
      ctx.logger.log(chalk__default.default.underline(`${metadata.dashboardUrls.project}`));
      return;
    }
  } catch (e) {
    if (e instanceof axios.AxiosError && e.response?.data) {
      if (e.response.status === 404) {
        ctx.logger.warn(
          `The project associated with this folder does not exist in Strapi Cloud. 
Please link your local project to an existing Strapi Cloud project using the ${chalk__default.default.cyan(
            "link"
          )} command before deploying.`
        );
      } else {
        ctx.logger.error(e.response.data);
      }
    } else {
      ctx.logger.error(
        "An error occurred while retrieving the project's information. Please try again later."
      );
    }
    ctx.logger.debug(e);
    return;
  }
  await trackEvent(ctx, cloudApiService, "willDeployWithCLI", {
    projectInternalName: project.name
  });
  const notificationService = notificationServiceFactory(ctx);
  const buildLogsService = buildLogsServiceFactory(ctx);
  const cliConfig2 = await getConfig({ ctx, cloudApiService });
  if (!cliConfig2) {
    ctx.logger.error(
      "An error occurred while retrieving data from Strapi Cloud. Please check your network or try again later."
    );
    return;
  }
  let maxSize = parseInt(cliConfig2.maxProjectFileSize, 10);
  if (Number.isNaN(maxSize)) {
    ctx.logger.debug(
      "An error occurred while parsing the maxProjectFileSize. Using default value."
    );
    maxSize = 1e8;
  }
  project.targetEnvironment = await getTargetEnvironment(ctx, opts, project, environments);
  if (!opts.force) {
    const shouldDisplayWarning = hasPendingOrLiveDeployment(
      environmentsDetails,
      project.targetEnvironment
    );
    if (shouldDisplayWarning) {
      ctx.logger.log(boxen__default.default(cliConfig2.projectDeployment.confirmationText, boxenOptions));
      const { confirm } = await inquirer__default.default.prompt([
        {
          type: "confirm",
          name: "confirm",
          message: `Do you want to proceed with deployment to ${chalk__default.default.cyan(projectData.displayName)} on ${chalk__default.default.cyan(project.targetEnvironment)} environment?`
        }
      ]);
      if (!confirm) {
        process.exit(1);
      }
    }
  }
  const buildId = await upload(ctx, project, token, maxSize);
  if (!buildId) {
    return;
  }
  try {
    ctx.logger.log(
      `🚀 Deploying project to ${chalk__default.default.cyan(project.targetEnvironment ?? `production`)} environment...`
    );
    notificationService(`${apiConfig.apiBaseUrl}/notifications`, token, cliConfig2);
    await buildLogsService(`${apiConfig.apiBaseUrl}/v1/logs/${buildId}`, token, cliConfig2);
    ctx.logger.log(
      "Visit the following URL for deployment logs. Your deployment will be available here shortly."
    );
    ctx.logger.log(
      chalk__default.default.underline(`${apiConfig.dashboardBaseUrl}/projects/${project.name}/deployments`)
    );
  } catch (e) {
    ctx.logger.debug(e);
    if (e instanceof Error) {
      ctx.logger.error(e.message);
    } else {
      ctx.logger.error("An error occurred while deploying the project. Please try again later.");
    }
  }
};
const assertCwdContainsStrapiProject = (name2) => {
  const logErrorAndExit = () => {
    console.log(
      `You need to run ${chalk__default.default.yellow(
        `strapi ${name2}`
      )} in a Strapi project. Make sure you are in the right directory.`
    );
    process.exit(1);
  };
  try {
    const pkgJSON = require(`${process.cwd()}/package.json`);
    if (!fp.has("dependencies.@strapi/strapi", pkgJSON) && !fp.has("devDependencies.@strapi/strapi", pkgJSON)) {
      logErrorAndExit();
    }
  } catch (err) {
    logErrorAndExit();
  }
};
const runAction = (name2, action2) => (...args) => {
  assertCwdContainsStrapiProject(name2);
  Promise.resolve().then(() => {
    return action2(...args);
  }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
};
const command$7 = ({ ctx }) => {
  return commander.createCommand("cloud:deploy").alias("deploy").description("Deploy a Strapi Cloud project").option("-d, --debug", "Enable debugging mode with verbose logs").option("-s, --silent", "Don't log anything").option("-f, --force", "Skip confirmation to deploy").option("-e, --env <name>", "Specify the environment to deploy").action((opts) => runAction("deploy", action$5)(ctx, opts));
};
const deployProject = {
  name: "deploy-project",
  description: "Deploy a Strapi Cloud project",
  action: action$5,
  command: command$7
};
async function getLocalConfig(ctx) {
  try {
    return await retrieve();
  } catch (e) {
    ctx.logger.debug("Failed to get project config", e);
    ctx.logger.error("An error occurred while retrieving config data from your local project.");
    return null;
  }
}
async function getLocalProject(ctx) {
  const localConfig = await getLocalConfig(ctx);
  if (!localConfig || !localConfig.project) {
    ctx.logger.warn(
      `
We couldn't find a valid local project config.
Please link your local project to an existing Strapi Cloud project using the ${chalk__default.default.cyan(
        "link"
      )} command.`
    );
    process.exit(1);
  }
  return localConfig.project;
}
const QUIT_OPTION$1 = "Quit";
async function promptForRelink(ctx, cloudApiService, existingConfig) {
  if (existingConfig && existingConfig.project) {
    const { shouldRelink } = await inquirer__default.default.prompt([
      {
        type: "confirm",
        name: "shouldRelink",
        message: `A project named ${chalk__default.default.cyan(
          existingConfig.project.displayName ? existingConfig.project.displayName : existingConfig.project.name
        )} is already linked to this local folder. Do you want to update the link?`,
        default: false
      }
    ]);
    if (!shouldRelink) {
      await trackEvent(ctx, cloudApiService, "didNotLinkProject", {
        currentProjectName: existingConfig.project?.name
      });
      return false;
    }
  }
  return true;
}
async function getProjectsList(ctx, cloudApiService, existingConfig) {
  const spinner = ctx.logger.spinner("Fetching your projects...\n").start();
  try {
    const {
      data: { data: projectList }
    } = await cloudApiService.listLinkProjects();
    spinner.succeed();
    if (!Array.isArray(projectList)) {
      ctx.logger.log("We couldn't find any projects available for linking in Strapi Cloud.");
      return null;
    }
    const projects = projectList.filter(
      (project) => !(project.isMaintainer || project.name === existingConfig?.project?.name)
    ).map((project) => {
      return {
        name: project.displayName,
        value: { name: project.name, displayName: project.displayName }
      };
    });
    if (projects.length === 0) {
      ctx.logger.log("We couldn't find any projects available for linking in Strapi Cloud.");
      return null;
    }
    return projects;
  } catch (e) {
    spinner.fail("An error occurred while fetching your projects from Strapi Cloud.");
    ctx.logger.debug("Failed to list projects", e);
    return null;
  }
}
async function getUserSelection(ctx, projects) {
  const { logger } = ctx;
  try {
    const answer = await inquirer__default.default.prompt([
      {
        type: "list",
        name: "linkProject",
        message: "Which project do you want to link?",
        choices: [...projects, { name: chalk__default.default.grey(`(${QUIT_OPTION$1})`), value: null }]
      }
    ]);
    if (!answer.linkProject) {
      return null;
    }
    return answer;
  } catch (e) {
    logger.debug("Failed to get user input", e);
    logger.error("An error occurred while trying to get your input.");
    return null;
  }
}
const action$4 = async (ctx) => {
  const { getValidToken } = await tokenServiceFactory(ctx);
  const token = await getValidToken(ctx, promptLogin);
  const { logger } = ctx;
  if (!token) {
    return;
  }
  const cloudApiService = await cloudApiFactory(ctx, token);
  const existingConfig = await getLocalConfig(ctx);
  const shouldRelink = await promptForRelink(ctx, cloudApiService, existingConfig);
  if (!shouldRelink) {
    return;
  }
  await trackEvent(ctx, cloudApiService, "willLinkProject", {});
  const projects = await getProjectsList(
    ctx,
    cloudApiService,
    existingConfig
  );
  if (!projects) {
    return;
  }
  const answer = await getUserSelection(ctx, projects);
  if (!answer) {
    return;
  }
  try {
    const { confirmAction } = await inquirer__default.default.prompt([
      {
        type: "confirm",
        name: "confirmAction",
        message: "Warning: Once linked, deploying from CLI will replace the existing project and its data. Confirm to proceed:",
        default: false
      }
    ]);
    if (!confirmAction) {
      await trackEvent(ctx, cloudApiService, "didNotLinkProject", {
        cancelledProjectName: answer.linkProject.name,
        currentProjectName: existingConfig ? existingConfig.project?.name : null
      });
      return;
    }
    await save({ project: answer.linkProject });
    logger.log(
      ` You have successfully linked your project to ${chalk__default.default.cyan(answer.linkProject.displayName)}. You are now able to deploy your project.`
    );
    await trackEvent(ctx, cloudApiService, "didLinkProject", {
      projectInternalName: answer.linkProject
    });
  } catch (e) {
    logger.debug("Failed to link project", e);
    logger.error("An error occurred while linking the project.");
    await trackEvent(ctx, cloudApiService, "didNotLinkProject", {
      projectInternalName: answer.linkProject
    });
  }
};
const command$6 = ({ command: command2, ctx }) => {
  command2.command("cloud:link").alias("link").description("Link a local directory to a Strapi Cloud project").option("-d, --debug", "Enable debugging mode with verbose logs").option("-s, --silent", "Don't log anything").action(() => runAction("link", action$4)(ctx));
};
const link = {
  name: "link-project",
  description: "Link a local directory to a Strapi Cloud project",
  action: action$4,
  command: command$6
};
const command$5 = ({ ctx }) => {
  return commander.createCommand("cloud:login").alias("login").description("Strapi Cloud Login").addHelpText(
    "after",
    "\nAfter running this command, you will be prompted to enter your authentication information."
  ).option("-d, --debug", "Enable debugging mode with verbose logs").option("-s, --silent", "Don't log anything").action(() => runAction("login", loginAction)(ctx));
};
const login = {
  name: "login",
  description: "Strapi Cloud Login",
  action: loginAction,
  command: command$5
};
const openModule = import("open");
const action$3 = async (ctx) => {
  const { logger } = ctx;
  const { retrieveToken, eraseToken } = await tokenServiceFactory(ctx);
  const token = await retrieveToken();
  if (!token) {
    logger.log("You're already logged out.");
    return;
  }
  const cloudApiService = await cloudApiFactory(ctx, token);
  const config = await cloudApiService.config();
  const cliConfig2 = config.data;
  try {
    await eraseToken();
    openModule.then((open) => {
      open.default(
        `${cliConfig2.baseUrl}/oidc/logout?client_id=${encodeURIComponent(
          cliConfig2.clientId
        )}&logout_hint=${encodeURIComponent(token)}
          `
      ).catch((e) => {
        logger.debug(e.message, e);
      });
    });
    logger.log(
      "🔌 You have been logged out from the CLI. If you are on a shared computer, please make sure to log out from the Strapi Cloud Dashboard as well."
    );
  } catch (e) {
    logger.error("🥲 Oops! Something went wrong while logging you out. Please try again.");
    logger.debug(e);
  }
  await trackEvent(ctx, cloudApiService, "didLogout", { loginMethod: "cli" });
};
const command$4 = ({ ctx }) => {
  return commander.createCommand("cloud:logout").alias("logout").description("Strapi Cloud Logout").option("-d, --debug", "Enable debugging mode with verbose logs").option("-s, --silent", "Don't log anything").action(() => runAction("logout", action$3)(ctx));
};
const logout = {
  name: "logout",
  description: "Strapi Cloud Logout",
  action: action$3,
  command: command$4
};
const command$3 = ({ ctx }) => {
  return commander.createCommand("cloud:create-project").description("Create a Strapi Cloud project").option("-d, --debug", "Enable debugging mode with verbose logs").option("-s, --silent", "Don't log anything").action(() => runAction("cloud:create-project", action$6)(ctx));
};
const createProject = {
  name: "create-project",
  description: "Create a new project",
  action: action$6,
  command: command$3
};
const action$2 = async (ctx) => {
  const { getValidToken } = await tokenServiceFactory(ctx);
  const token = await getValidToken(ctx, promptLogin);
  const { logger } = ctx;
  if (!token) {
    return;
  }
  const cloudApiService = await cloudApiFactory(ctx, token);
  const spinner = logger.spinner("Fetching your projects...").start();
  try {
    const {
      data: { data: projectList }
    } = await cloudApiService.listProjects();
    spinner.succeed();
    logger.log(projectList);
  } catch (e) {
    ctx.logger.debug("Failed to list projects", e);
    spinner.fail("An error occurred while fetching your projects from Strapi Cloud.");
  }
};
const command$2 = ({ command: command2, ctx }) => {
  command2.command("cloud:projects").alias("projects").description("List Strapi Cloud projects").option("-d, --debug", "Enable debugging mode with verbose logs").option("-s, --silent", "Don't log anything").action(() => runAction("projects", action$2)(ctx));
};
const listProjects = {
  name: "list-projects",
  description: "List Strapi Cloud projects",
  action: action$2,
  command: command$2
};
const action$1 = async (ctx) => {
  const { getValidToken } = await tokenServiceFactory(ctx);
  const token = await getValidToken(ctx, promptLogin);
  const { logger } = ctx;
  if (!token) {
    return;
  }
  const project = await getLocalProject(ctx);
  if (!project) {
    ctx.logger.debug(`No valid local project configuration was found.`);
    return;
  }
  const cloudApiService = await cloudApiFactory(ctx, token);
  const spinner = logger.spinner("Fetching environments...").start();
  await trackEvent(ctx, cloudApiService, "willListEnvironment", {
    projectInternalName: project.name
  });
  try {
    const {
      data: { data: environmentsList }
    } = await cloudApiService.listEnvironments({ name: project.name });
    spinner.succeed();
    logger.log(environmentsList);
    await trackEvent(ctx, cloudApiService, "didListEnvironment", {
      projectInternalName: project.name
    });
  } catch (e) {
    if (e.response && e.response.status === 404) {
      spinner.succeed();
      logger.warn(
        `
The project associated with this folder does not exist in Strapi Cloud. 
Please link your local project to an existing Strapi Cloud project using the ${chalk__default.default.cyan(
          "link"
        )} command`
      );
    } else {
      spinner.fail("An error occurred while fetching environments data from Strapi Cloud.");
      logger.debug("Failed to list environments", e);
    }
    await trackEvent(ctx, cloudApiService, "didNotListEnvironment", {
      projectInternalName: project.name
    });
  }
};
function defineCloudNamespace(command2, ctx) {
  const cloud = command2.command("cloud").description("Manage Strapi Cloud projects");
  cloud.command("environments").description("Alias for cloud environment list").action(() => runAction("list", action$1)(ctx));
  return cloud;
}
let environmentCmd = null;
const initializeEnvironmentCommand = (command2, ctx) => {
  if (!environmentCmd) {
    const cloud = defineCloudNamespace(command2, ctx);
    environmentCmd = cloud.command("environment").description("Manage environments");
  }
  return environmentCmd;
};
const command$1 = ({ command: command2, ctx }) => {
  const environmentCmd2 = initializeEnvironmentCommand(command2, ctx);
  environmentCmd2.command("list").description("List Strapi Cloud project environments").option("-d, --debug", "Enable debugging mode with verbose logs").option("-s, --silent", "Don't log anything").action(() => runAction("list", action$1)(ctx));
};
const listEnvironments = {
  name: "list-environments",
  description: "List Strapi Cloud environments",
  action: action$1,
  command: command$1
};
const QUIT_OPTION = "Quit";
const action = async (ctx) => {
  const { getValidToken } = await tokenServiceFactory(ctx);
  const token = await getValidToken(ctx, promptLogin);
  const { logger } = ctx;
  if (!token) {
    return;
  }
  const project = await getLocalProject(ctx);
  if (!project) {
    logger.debug(`No valid local project configuration was found.`);
    return;
  }
  const cloudApiService = await cloudApiFactory(ctx, token);
  const environments = await getEnvironmentsList(ctx, cloudApiService, project);
  if (!environments) {
    logger.debug(`Fetching environments failed.`);
    return;
  }
  if (environments.length === 0) {
    logger.log(
      `The only available environment is already linked. You can add a new one from your project settings on the Strapi Cloud dashboard.`
    );
    return;
  }
  const answer = await promptUserForEnvironment(ctx, environments);
  if (!answer) {
    return;
  }
  await trackEvent(ctx, cloudApiService, "willLinkEnvironment", {
    projectName: project.name,
    environmentName: answer.targetEnvironment
  });
  try {
    await patch({ project: { targetEnvironment: answer.targetEnvironment } });
  } catch (e) {
    await trackEvent(ctx, cloudApiService, "didNotLinkEnvironment", {
      projectName: project.name,
      environmentName: answer.targetEnvironment
    });
    logger.debug("Failed to link environment", e);
    logger.error(
      "Failed to link the environment. If this issue persists, try re-linking your project or contact support."
    );
    process.exit(1);
  }
  logger.log(
    ` You have successfully linked your project to ${chalk__default.default.cyan(answer.targetEnvironment)}, on ${chalk__default.default.cyan(project.displayName)}. You are now able to deploy your project.`
  );
  await trackEvent(ctx, cloudApiService, "didLinkEnvironment", {
    projectName: project.name,
    environmentName: answer.targetEnvironment
  });
};
async function promptUserForEnvironment(ctx, environments) {
  const { logger } = ctx;
  try {
    const answer = await inquirer__default.default.prompt([
      {
        type: "list",
        name: "targetEnvironment",
        message: "Which environment do you want to link?",
        choices: [...environments, { name: chalk__default.default.grey(`(${QUIT_OPTION})`), value: null }]
      }
    ]);
    if (!answer.targetEnvironment) {
      return null;
    }
    return answer;
  } catch (e) {
    logger.debug("Failed to get user input", e);
    logger.error("An error occurred while trying to get your environment selection.");
    return null;
  }
}
async function getEnvironmentsList(ctx, cloudApiService, project) {
  const spinner = ctx.logger.spinner("Fetching environments...\n").start();
  try {
    const {
      data: { data: environmentsList }
    } = await cloudApiService.listLinkEnvironments({ name: project.name });
    if (!Array.isArray(environmentsList) || environmentsList.length === 0) {
      throw new Error("Environments not found in server response");
    }
    spinner.succeed();
    return environmentsList.filter(
      (environment) => environment.name !== project.targetEnvironment
    );
  } catch (e) {
    if (e.response && e.response.status === 404) {
      spinner.succeed();
      ctx.logger.warn(
        `
The project associated with this folder does not exist in Strapi Cloud. 
Please link your local project to an existing Strapi Cloud project using the ${chalk__default.default.cyan(
          "link"
        )} command.`
      );
    } else {
      spinner.fail("An error occurred while fetching environments data from Strapi Cloud.");
      ctx.logger.debug("Failed to list environments", e);
    }
  }
}
const command = ({ command: command2, ctx }) => {
  const environmentCmd2 = initializeEnvironmentCommand(command2, ctx);
  environmentCmd2.command("link").description("Link project to a specific Strapi Cloud project environment").option("-d, --debug", "Enable debugging mode with verbose logs").option("-s, --silent", "Don't log anything").action(() => runAction("link", action)(ctx));
};
const linkEnvironment = {
  name: "link-environment",
  description: "Link Strapi Cloud environment to a local project",
  action,
  command
};
const cli = {
  deployProject,
  link,
  login,
  logout,
  createProject,
  linkEnvironment,
  listProjects,
  listEnvironments
};
const cloudCommands = [
  deployProject,
  link,
  login,
  logout,
  linkEnvironment,
  listProjects,
  listEnvironments
];
async function initCloudCLIConfig() {
  const localConfig = await getLocalConfig$1();
  if (!localConfig.deviceId) {
    localConfig.deviceId = crypto__default.default.randomUUID();
  }
  await saveLocalConfig(localConfig);
}
async function buildStrapiCloudCommands({
  command: command2,
  ctx,
  argv
}) {
  await initCloudCLIConfig();
  for (const cloudCommand of cloudCommands) {
    try {
      const subCommand = await cloudCommand.command({ command: command2, ctx, argv });
      if (subCommand) {
        command2.addCommand(subCommand);
      }
    } catch (e) {
      console.error(`Failed to load command ${cloudCommand.name}`, e);
    }
  }
}
exports.buildStrapiCloudCommands = buildStrapiCloudCommands;
exports.cli = cli;
exports.services = index;
//# sourceMappingURL=index.js.map
