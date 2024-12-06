"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const path$1 = require("node:path");
const CliTable3 = require("cli-table3");
const chalk = require("chalk");
const assert = require("node:assert");
const semver = require("semver");
const fse = require("fs-extra");
const fastglob = require("fast-glob");
const Runner = require("jscodeshift/src/Runner");
const fp = require("lodash/fp");
const node = require("esbuild-register/dist/node");
const utils = require("@strapi/utils");
const simpleGit = require("simple-git");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const path__default = /* @__PURE__ */ _interopDefault(path$1);
const CliTable3__default = /* @__PURE__ */ _interopDefault(CliTable3);
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const assert__default = /* @__PURE__ */ _interopDefault(assert);
const semver__default = /* @__PURE__ */ _interopDefault(semver);
const fse__default = /* @__PURE__ */ _interopDefault(fse);
const fastglob__default = /* @__PURE__ */ _interopDefault(fastglob);
const simpleGit__default = /* @__PURE__ */ _interopDefault(simpleGit);
class Timer {
  interval;
  constructor() {
    this.reset();
  }
  get elapsedMs() {
    const { start, end } = this.interval;
    return end ? end - start : Date.now() - start;
  }
  get end() {
    return this.interval.end;
  }
  get start() {
    return this.interval.start;
  }
  stop() {
    this.interval.end = Date.now();
    return this.elapsedMs;
  }
  reset() {
    this.interval = { start: Date.now(), end: null };
    return this;
  }
}
const timerFactory = () => new Timer();
const ONE_SECOND_MS = 1e3;
const constants$4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ONE_SECOND_MS
}, Symbol.toStringTag, { value: "Module" }));
const index$g = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  constants: constants$4,
  timerFactory
}, Symbol.toStringTag, { value: "Module" }));
const path = (path2) => chalk__default.default.blue(path2);
const version = (version2) => {
  return chalk__default.default.italic.yellow(`v${version2}`);
};
const codemodUID = (uid) => {
  return chalk__default.default.bold.cyan(uid);
};
const projectDetails = (project) => {
  return `Project: TYPE=${projectType(project.type)}; CWD=${path(project.cwd)}; PATHS=${project.paths.map(path)}`;
};
const projectType = (type) => chalk__default.default.cyan(type);
const versionRange = (range) => chalk__default.default.italic.yellow(range.raw);
const transform = (transformFilePath) => chalk__default.default.cyan(transformFilePath);
const highlight = (arg) => chalk__default.default.bold.underline(arg);
const upgradeStep = (text, step) => {
  return chalk__default.default.bold(`(${step[0]}/${step[1]}) ${text}...`);
};
const reports = (reports2) => {
  const rows = reports2.map(({ codemod, report }, i) => {
    const fIndex = chalk__default.default.grey(i);
    const fVersion = chalk__default.default.magenta(codemod.version);
    const fKind = chalk__default.default.yellow(codemod.kind);
    const fFormattedTransformPath = chalk__default.default.cyan(codemod.format());
    const fTimeElapsed = i === 0 ? `${report.timeElapsed}s ${chalk__default.default.dim.italic("(cold start)")}` : `${report.timeElapsed}s`;
    const fAffected = report.ok > 0 ? chalk__default.default.green(report.ok) : chalk__default.default.grey(0);
    const fUnchanged = report.ok === 0 ? chalk__default.default.red(report.nochange) : chalk__default.default.grey(report.nochange);
    return [fIndex, fVersion, fKind, fFormattedTransformPath, fAffected, fUnchanged, fTimeElapsed];
  });
  const table = new CliTable3__default.default({
    style: { compact: true },
    head: [
      chalk__default.default.bold.grey("N°"),
      chalk__default.default.bold.magenta("Version"),
      chalk__default.default.bold.yellow("Kind"),
      chalk__default.default.bold.cyan("Name"),
      chalk__default.default.bold.green("Affected"),
      chalk__default.default.bold.red("Unchanged"),
      chalk__default.default.bold.blue("Duration")
    ]
  });
  table.push(...rows);
  return table.toString();
};
const codemodList = (codemods) => {
  const rows = codemods.map((codemod, index2) => {
    const fIndex = chalk__default.default.grey(index2);
    const fVersion = chalk__default.default.magenta(codemod.version);
    const fKind = chalk__default.default.yellow(codemod.kind);
    const fName = chalk__default.default.blue(codemod.format());
    const fUID = codemodUID(codemod.uid);
    return [fIndex, fVersion, fKind, fName, fUID];
  });
  const table = new CliTable3__default.default({
    style: { compact: true },
    head: [
      chalk__default.default.bold.grey("N°"),
      chalk__default.default.bold.magenta("Version"),
      chalk__default.default.bold.yellow("Kind"),
      chalk__default.default.bold.blue("Name"),
      chalk__default.default.bold.cyan("UID")
    ]
  });
  table.push(...rows);
  return table.toString();
};
const durationMs = (elapsedMs) => {
  const elapsedSeconds = (elapsedMs / ONE_SECOND_MS).toFixed(3);
  return `${elapsedSeconds}s`;
};
const index$f = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  codemodList,
  codemodUID,
  durationMs,
  highlight,
  path,
  projectDetails,
  projectType,
  reports,
  transform,
  upgradeStep,
  version,
  versionRange
}, Symbol.toStringTag, { value: "Module" }));
const NPM_REGISTRY_URL = "https://registry.npmjs.org";
var ReleaseType = /* @__PURE__ */ ((ReleaseType2) => {
  ReleaseType2["Major"] = "major";
  ReleaseType2["Minor"] = "minor";
  ReleaseType2["Patch"] = "patch";
  ReleaseType2["Latest"] = "latest";
  return ReleaseType2;
})(ReleaseType || {});
const types = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ReleaseType
}, Symbol.toStringTag, { value: "Module" }));
const semVerFactory = (version2) => {
  return new semver__default.default.SemVer(version2);
};
const isLiteralSemVer = (str) => {
  const tokens = str.split(".");
  return tokens.length === 3 && tokens.every((token) => !Number.isNaN(+token) && Number.isInteger(+token));
};
const isValidSemVer = (str) => semver__default.default.valid(str) !== null;
const isSemverInstance = (value) => {
  return value instanceof semver__default.default.SemVer;
};
const isSemVerReleaseType = (str) => {
  return Object.values(ReleaseType).includes(str);
};
const rangeFactory = (range) => {
  return new semver__default.default.Range(range);
};
const rangeFromReleaseType = (current, identifier) => {
  switch (identifier) {
    case ReleaseType.Latest: {
      return rangeFactory(`>${current.raw}`);
    }
    case ReleaseType.Major: {
      const nextMajor = semVerFactory(current.raw).inc("major");
      return rangeFactory(`>${current.raw} <=${nextMajor.major}`);
    }
    case ReleaseType.Minor: {
      const nextMajor = semVerFactory(current.raw).inc("major");
      return rangeFactory(`>${current.raw} <${nextMajor.raw}`);
    }
    case ReleaseType.Patch: {
      const nextMinor = semVerFactory(current.raw).inc("minor");
      return rangeFactory(`>${current.raw} <${nextMinor.raw}`);
    }
    default: {
      throw new Error("Not implemented");
    }
  }
};
const rangeFromVersions = (currentVersion, target) => {
  if (isSemverInstance(target)) {
    return rangeFactory(`>${currentVersion.raw} <=${target.raw}`);
  }
  if (isSemVerReleaseType(target)) {
    return rangeFromReleaseType(currentVersion, target);
  }
  throw new Error(`Invalid target set: ${target}`);
};
const isValidStringifiedRange = (str) => semver__default.default.validRange(str) !== null;
const isRangeInstance = (range) => {
  return range instanceof semver__default.default.Range;
};
const index$e = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Version: types,
  isLiteralSemVer,
  isRangeInstance,
  isSemVerReleaseType,
  isSemverInstance,
  isValidSemVer,
  isValidStringifiedRange,
  rangeFactory,
  rangeFromReleaseType,
  rangeFromVersions,
  semVerFactory
}, Symbol.toStringTag, { value: "Module" }));
class Package {
  name;
  packageURL;
  npmPackage;
  constructor(name) {
    this.name = name;
    this.packageURL = `${NPM_REGISTRY_URL}/${name}`;
    this.npmPackage = null;
  }
  get isLoaded() {
    return this.npmPackage !== null;
  }
  assertPackageIsLoaded(npmPackage) {
    assert__default.default(this.isLoaded, "The package is not loaded yet");
  }
  getVersionsDict() {
    this.assertPackageIsLoaded(this.npmPackage);
    return this.npmPackage.versions;
  }
  getVersionsAsList() {
    this.assertPackageIsLoaded(this.npmPackage);
    return Object.values(this.npmPackage.versions);
  }
  findVersionsInRange(range) {
    const versions = this.getVersionsAsList();
    return versions.filter((v) => range.test(v.version)).filter((v) => isLiteralSemVer(v.version)).sort((v1, v2) => semver__default.default.compare(v1.version, v2.version));
  }
  findVersion(version2) {
    const versions = this.getVersionsAsList();
    return versions.find((npmVersion) => semver__default.default.eq(npmVersion.version, version2));
  }
  async refresh() {
    const response = await fetch(this.packageURL);
    assert__default.default(response.ok, `Request failed for ${this.packageURL}`);
    this.npmPackage = await response.json();
    return this;
  }
  versionExists(version2) {
    return this.findVersion(version2) !== void 0;
  }
}
const npmPackageFactory = (name) => new Package(name);
class FileScanner {
  cwd;
  constructor(cwd) {
    this.cwd = cwd;
  }
  scan(patterns) {
    const filenames = fastglob__default.default.sync(patterns, {
      cwd: this.cwd
    });
    return filenames.map((filename) => path__default.default.join(this.cwd, filename));
  }
}
const fileScannerFactory = (cwd) => new FileScanner(cwd);
const index$d = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  fileScannerFactory
}, Symbol.toStringTag, { value: "Module" }));
class AbstractRunner {
  paths;
  configuration;
  constructor(paths, configuration) {
    this.paths = paths;
    this.configuration = configuration;
  }
  async run(codemod, configuration) {
    const isValidCodemod = this.valid(codemod);
    if (!isValidCodemod) {
      throw new Error(`Invalid codemod provided to the runner: ${codemod.filename}`);
    }
    const runConfiguration = { ...this.configuration, ...configuration };
    return this.runner(codemod.path, this.paths, runConfiguration);
  }
}
class CodeRunner extends AbstractRunner {
  runner = Runner.run;
  valid(codemod) {
    return codemod.kind === "code";
  }
}
const codeRunnerFactory = (paths, configuration) => {
  return new CodeRunner(paths, configuration);
};
const index$c = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  codeRunnerFactory
}, Symbol.toStringTag, { value: "Module" }));
class JSONTransformAPI {
  json;
  constructor(json) {
    this.json = fp.cloneDeep(json);
  }
  get(path2, defaultValue) {
    if (!path2) {
      return this.root();
    }
    return fp.cloneDeep(fp.get(path2, this.json) ?? defaultValue);
  }
  has(path2) {
    return fp.has(path2, this.json);
  }
  merge(other) {
    this.json = fp.merge(other, this.json);
    return this;
  }
  root() {
    return fp.cloneDeep(this.json);
  }
  set(path2, value) {
    this.json = fp.set(path2, value, this.json);
    return this;
  }
  remove(path2) {
    this.json = fp.omit(path2, this.json);
    return this;
  }
}
const createJSONTransformAPI = (object) => new JSONTransformAPI(object);
const readJSON = async (path2) => {
  const buffer = await fse__default.default.readFile(path2);
  return JSON.parse(buffer.toString());
};
const saveJSON = async (path2, json) => {
  const jsonAsString = `${JSON.stringify(json, null, 2)}
`;
  await fse__default.default.writeFile(path2, jsonAsString);
};
const transformJSON = async (codemodPath, paths, config) => {
  const { dry } = config;
  const startTime = process.hrtime();
  const report = {
    ok: 0,
    nochange: 0,
    skip: 0,
    error: 0,
    timeElapsed: "",
    stats: {}
  };
  const esbuildOptions = {
    extensions: [".js", ".mjs", ".ts"],
    hookIgnoreNodeModules: false,
    hookMatcher: fp.isEqual(codemodPath)
  };
  const { unregister } = node.register(esbuildOptions);
  const module2 = require(codemodPath);
  unregister();
  const codemod = typeof module2.default === "function" ? module2.default : module2;
  assert__default.default(typeof codemod === "function", `Codemod must be a function. Found ${typeof codemod}`);
  for (const path2 of paths) {
    try {
      const json = await readJSON(path2);
      assert__default.default(typeof json === "object" && !Array.isArray(json) && json !== null);
      const file = { path: path2, json };
      const params = { cwd: config.cwd, json: createJSONTransformAPI };
      const out = await codemod(file, params);
      if (out === void 0) {
        report.error += 1;
      } else if (!fp.isEqual(json, out)) {
        if (!dry) {
          await saveJSON(path2, out);
        }
        report.ok += 1;
      } else {
        report.nochange += 1;
      }
    } catch {
      report.error += 1;
    }
  }
  const endTime = process.hrtime(startTime);
  report.timeElapsed = (endTime[0] + endTime[1] / 1e9).toFixed(3);
  return report;
};
class JSONRunner extends AbstractRunner {
  runner = transformJSON;
  valid(codemod) {
    return codemod.kind === "json";
  }
}
const jsonRunnerFactory = (paths, configuration) => {
  return new JSONRunner(paths, configuration);
};
const index$b = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  jsonRunnerFactory
}, Symbol.toStringTag, { value: "Module" }));
const PROJECT_PACKAGE_JSON = "package.json";
const PROJECT_APP_ALLOWED_ROOT_PATHS = ["src", "config", "public"];
const PROJECT_PLUGIN_ALLOWED_ROOT_PATHS = ["admin", "server"];
const PROJECT_PLUGIN_ROOT_FILES = ["strapi-admin.js", "strapi-server.js"];
const PROJECT_CODE_EXTENSIONS = [
  // Source files
  "js",
  "mjs",
  "ts",
  // React files
  "jsx",
  "tsx"
];
const PROJECT_JSON_EXTENSIONS = ["json"];
const PROJECT_ALLOWED_EXTENSIONS = [...PROJECT_CODE_EXTENSIONS, ...PROJECT_JSON_EXTENSIONS];
const SCOPED_STRAPI_PACKAGE_PREFIX = "@strapi/";
const STRAPI_DEPENDENCY_NAME = `${SCOPED_STRAPI_PACKAGE_PREFIX}strapi`;
const constants$3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PROJECT_ALLOWED_EXTENSIONS,
  PROJECT_APP_ALLOWED_ROOT_PATHS,
  PROJECT_CODE_EXTENSIONS,
  PROJECT_JSON_EXTENSIONS,
  PROJECT_PACKAGE_JSON,
  PROJECT_PLUGIN_ALLOWED_ROOT_PATHS,
  PROJECT_PLUGIN_ROOT_FILES,
  SCOPED_STRAPI_PACKAGE_PREFIX,
  STRAPI_DEPENDENCY_NAME
}, Symbol.toStringTag, { value: "Module" }));
class Project {
  cwd;
  // The following properties are assigned during the .refresh() call in the constructor.
  files;
  packageJSONPath;
  packageJSON;
  paths;
  constructor(cwd, config) {
    if (!fse__default.default.pathExistsSync(cwd)) {
      throw new Error(`ENOENT: no such file or directory, access '${cwd}'`);
    }
    this.cwd = cwd;
    this.paths = config.paths;
    this.refresh();
  }
  getFilesByExtensions(extensions) {
    return this.files.filter((filePath) => {
      const fileExtension = path__default.default.extname(filePath);
      return extensions.includes(fileExtension);
    });
  }
  refresh() {
    this.refreshPackageJSON();
    this.refreshProjectFiles();
    return this;
  }
  async runCodemods(codemods, options) {
    const runners = this.createProjectCodemodsRunners(options.dry);
    const reports2 = [];
    for (const codemod of codemods) {
      for (const runner of runners) {
        if (runner.valid(codemod)) {
          const report = await runner.run(codemod);
          reports2.push({ codemod, report });
        }
      }
    }
    return reports2;
  }
  createProjectCodemodsRunners(dry = false) {
    const jsonExtensions = PROJECT_JSON_EXTENSIONS.map((ext) => `.${ext}`);
    const codeExtensions = PROJECT_CODE_EXTENSIONS.map((ext) => `.${ext}`);
    const jsonFiles = this.getFilesByExtensions(jsonExtensions);
    const codeFiles = this.getFilesByExtensions(codeExtensions);
    const codeRunner = codeRunnerFactory(codeFiles, {
      dry,
      parser: "ts",
      runInBand: true,
      babel: true,
      extensions: PROJECT_CODE_EXTENSIONS.join(","),
      // Don't output any log coming from the runner
      print: false,
      silent: true,
      verbose: 0
    });
    const jsonRunner = jsonRunnerFactory(jsonFiles, { dry, cwd: this.cwd });
    return [codeRunner, jsonRunner];
  }
  refreshPackageJSON() {
    const packageJSONPath = path__default.default.join(this.cwd, PROJECT_PACKAGE_JSON);
    try {
      fse__default.default.accessSync(packageJSONPath);
    } catch {
      throw new Error(`Could not find a ${PROJECT_PACKAGE_JSON} file in ${this.cwd}`);
    }
    const packageJSONBuffer = fse__default.default.readFileSync(packageJSONPath);
    this.packageJSONPath = packageJSONPath;
    this.packageJSON = JSON.parse(packageJSONBuffer.toString());
  }
  refreshProjectFiles() {
    const scanner = fileScannerFactory(this.cwd);
    this.files = scanner.scan(this.paths);
  }
}
class AppProject extends Project {
  strapiVersion;
  type = "application";
  /**
   * Returns an array of allowed file paths for a Strapi application
   *
   * The resulting paths include app default files and the root package.json file.
   */
  static get paths() {
    const allowedRootPaths = formatGlobCollectionPattern(PROJECT_APP_ALLOWED_ROOT_PATHS);
    const allowedExtensions = formatGlobCollectionPattern(PROJECT_ALLOWED_EXTENSIONS);
    return [
      // App default files
      `./${allowedRootPaths}/**/*.${allowedExtensions}`,
      `!./**/node_modules/**/*`,
      `!./**/dist/**/*`,
      // Root package.json file
      PROJECT_PACKAGE_JSON
    ];
  }
  constructor(cwd) {
    super(cwd, { paths: AppProject.paths });
    this.refreshStrapiVersion();
  }
  refresh() {
    super.refresh();
    this.refreshStrapiVersion();
    return this;
  }
  refreshStrapiVersion() {
    this.strapiVersion = // First try to get the strapi version from the package.json dependencies
    this.findStrapiVersionFromProjectPackageJSON() ?? // If the version found is not a valid SemVer, get the Strapi version from the installed package
    this.findLocallyInstalledStrapiVersion();
  }
  findStrapiVersionFromProjectPackageJSON() {
    const projectName = this.packageJSON.name;
    const version2 = this.packageJSON.dependencies?.[STRAPI_DEPENDENCY_NAME];
    if (version2 === void 0) {
      throw new Error(
        `No version of ${STRAPI_DEPENDENCY_NAME} was found in ${projectName}. Are you in a valid Strapi project?`
      );
    }
    const isValidSemVer2 = isLiteralSemVer(version2) && semver__default.default.valid(version2) === version2;
    return isValidSemVer2 ? semVerFactory(version2) : void 0;
  }
  findLocallyInstalledStrapiVersion() {
    const packageSearchText = `${STRAPI_DEPENDENCY_NAME}/package.json`;
    let strapiPackageJSONPath;
    let strapiPackageJSON;
    try {
      strapiPackageJSONPath = require.resolve(packageSearchText, { paths: [this.cwd] });
      strapiPackageJSON = require(strapiPackageJSONPath);
      assert__default.default(typeof strapiPackageJSON === "object");
    } catch {
      throw new Error(
        `Cannot resolve module "${STRAPI_DEPENDENCY_NAME}" from paths [${this.cwd}]`
      );
    }
    const strapiVersion = strapiPackageJSON.version;
    if (!isValidSemVer(strapiVersion)) {
      throw new Error(
        `Invalid ${STRAPI_DEPENDENCY_NAME} version found in ${strapiPackageJSONPath} (${strapiVersion})`
      );
    }
    return semVerFactory(strapiVersion);
  }
}
const formatGlobCollectionPattern = (collection) => {
  assert__default.default(
    collection.length > 0,
    "Invalid pattern provided, the given collection needs at least 1 element"
  );
  return collection.length === 1 ? collection[0] : `{${collection}}`;
};
class PluginProject extends Project {
  type = "plugin";
  /**
   * Returns an array of allowed file paths for a Strapi plugin
   *
   * The resulting paths include plugin default files, the root package.json file, and plugin-specific files.
   */
  static get paths() {
    const allowedRootPaths = formatGlobCollectionPattern(
      PROJECT_PLUGIN_ALLOWED_ROOT_PATHS
    );
    const allowedExtensions = formatGlobCollectionPattern(PROJECT_ALLOWED_EXTENSIONS);
    return [
      // Plugin default files
      `./${allowedRootPaths}/**/*.${allowedExtensions}`,
      `!./**/node_modules/**/*`,
      `!./**/dist/**/*`,
      // Root package.json file
      PROJECT_PACKAGE_JSON,
      // Plugin root files
      ...PROJECT_PLUGIN_ROOT_FILES
    ];
  }
  constructor(cwd) {
    super(cwd, { paths: PluginProject.paths });
  }
}
const isPlugin = (cwd) => {
  const packageJSONPath = path__default.default.join(cwd, PROJECT_PACKAGE_JSON);
  try {
    fse__default.default.accessSync(packageJSONPath);
  } catch {
    throw new Error(`Could not find a ${PROJECT_PACKAGE_JSON} file in ${cwd}`);
  }
  const packageJSONBuffer = fse__default.default.readFileSync(packageJSONPath);
  const packageJSON = JSON.parse(packageJSONBuffer.toString());
  return packageJSON?.strapi?.kind === "plugin";
};
const projectFactory = (cwd) => {
  fse__default.default.accessSync(cwd);
  return isPlugin(cwd) ? new PluginProject(cwd) : new AppProject(cwd);
};
const isPluginProject = (project) => {
  return project instanceof PluginProject;
};
function assertPluginProject(project) {
  if (!isPluginProject(project)) {
    throw new Error("Project is not a plugin");
  }
}
const isApplicationProject = (project) => {
  return project instanceof AppProject;
};
function assertAppProject(project) {
  if (!isApplicationProject(project)) {
    throw new Error("Project is not an application");
  }
}
const index$a = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  assertAppProject,
  assertPluginProject,
  constants: constants$3,
  isApplicationProject,
  isPluginProject,
  projectFactory
}, Symbol.toStringTag, { value: "Module" }));
class UnexpectedError extends Error {
  constructor() {
    super("Unexpected Error");
  }
}
class NPMCandidateNotFoundError extends Error {
  target;
  constructor(target, message = `Couldn't find a valid NPM candidate for "${target}"`) {
    super(message);
    this.target = target;
  }
}
class AbortedError extends Error {
  constructor(message = "Upgrade aborted") {
    super(message);
  }
}
const unknownToError = (e) => {
  if (e instanceof Error) {
    return e;
  }
  if (typeof e === "string") {
    return new Error(e);
  }
  return new UnexpectedError();
};
const index$9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AbortedError,
  NPMCandidateNotFoundError,
  UnexpectedError,
  unknownToError
}, Symbol.toStringTag, { value: "Module" }));
const CODEMOD_CODE_SUFFIX = "code";
const CODEMOD_JSON_SUFFIX = "json";
const CODEMOD_ALLOWED_SUFFIXES = [CODEMOD_CODE_SUFFIX, CODEMOD_JSON_SUFFIX];
const CODEMOD_EXTENSION = "ts";
const CODEMOD_FILE_REGEXP = new RegExp(
  `^.+[.](${CODEMOD_ALLOWED_SUFFIXES.join("|")})[.]${CODEMOD_EXTENSION}$`
);
const constants$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CODEMOD_ALLOWED_SUFFIXES,
  CODEMOD_CODE_SUFFIX,
  CODEMOD_EXTENSION,
  CODEMOD_FILE_REGEXP,
  CODEMOD_JSON_SUFFIX
}, Symbol.toStringTag, { value: "Module" }));
class Codemod {
  uid;
  kind;
  version;
  baseDirectory;
  filename;
  path;
  constructor(options) {
    this.kind = options.kind;
    this.version = options.version;
    this.baseDirectory = options.baseDirectory;
    this.filename = options.filename;
    this.path = path__default.default.join(this.baseDirectory, this.version.raw, this.filename);
    this.uid = this.createUID();
  }
  createUID() {
    const name = this.format({ stripExtension: true, stripKind: true, stripHyphens: false });
    const kind = this.kind;
    const version2 = this.version.raw;
    return `${version2}-${name}-${kind}`;
  }
  format(options) {
    const { stripExtension = true, stripKind = true, stripHyphens = true } = options ?? {};
    let formatted = this.filename;
    if (stripExtension) {
      formatted = formatted.replace(new RegExp(`\\.${CODEMOD_EXTENSION}$`, "i"), "");
    }
    if (stripKind) {
      formatted = formatted.replace(`.${CODEMOD_CODE_SUFFIX}`, "").replace(`.${CODEMOD_JSON_SUFFIX}`, "");
    }
    if (stripHyphens) {
      formatted = formatted.replaceAll("-", " ");
    }
    return formatted;
  }
}
const codemodFactory = (options) => new Codemod(options);
const index$8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  codemodFactory,
  constants: constants$2
}, Symbol.toStringTag, { value: "Module" }));
const INTERNAL_CODEMODS_DIRECTORY = path__default.default.join(
  __dirname,
  // upgrade/dist
  "..",
  // upgrade
  "resources",
  // upgrade/resources
  "codemods"
  // upgrade/resources/codemods
);
const constants$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  INTERNAL_CODEMODS_DIRECTORY
}, Symbol.toStringTag, { value: "Module" }));
class CodemodRepository {
  groups;
  versions;
  cwd;
  constructor(cwd) {
    assert__default.default(fse__default.default.existsSync(cwd), `Invalid codemods directory provided "${cwd}"`);
    this.cwd = cwd;
    this.groups = {};
    this.versions = [];
  }
  refresh() {
    this.refreshAvailableVersions();
    this.refreshAvailableFiles();
    return this;
  }
  count(version2) {
    return this.findByVersion(version2).length;
  }
  versionExists(version2) {
    return version2.raw in this.groups;
  }
  has(uid) {
    const result = this.find({ uids: [uid] });
    if (result.length !== 1) {
      return false;
    }
    const { codemods } = result[0];
    return codemods.length === 1 && codemods[0].uid === uid;
  }
  find(q) {
    const entries = Object.entries(this.groups);
    return entries.filter(maybeFilterByRange).map(([version2, codemods]) => ({
      version: semVerFactory(version2),
      // Filter by UID if provided in the query
      codemods: codemods.filter(maybeFilterByUIDs)
    })).filter(({ codemods }) => codemods.length > 0);
    function maybeFilterByRange([version2]) {
      if (!isRangeInstance(q.range)) {
        return true;
      }
      return q.range.test(version2);
    }
    function maybeFilterByUIDs(codemod) {
      if (q.uids === void 0) {
        return true;
      }
      return q.uids.includes(codemod.uid);
    }
  }
  findByVersion(version2) {
    const literalVersion = version2.raw;
    const codemods = this.groups[literalVersion];
    return codemods ?? [];
  }
  findAll() {
    const entries = Object.entries(this.groups);
    return entries.map(([version2, codemods]) => ({
      version: semVerFactory(version2),
      codemods
    }));
  }
  refreshAvailableVersions() {
    this.versions = fse__default.default.readdirSync(this.cwd).filter((filename) => fse__default.default.statSync(path__default.default.join(this.cwd, filename)).isDirectory()).filter((filename) => semver__default.default.valid(filename) !== null).map((version2) => semVerFactory(version2)).sort(semver__default.default.compare);
    return this;
  }
  refreshAvailableFiles() {
    this.groups = {};
    for (const version2 of this.versions) {
      this.refreshAvailableFilesForVersion(version2);
    }
  }
  refreshAvailableFilesForVersion(version2) {
    const literalVersion = version2.raw;
    const versionDirectory = path__default.default.join(this.cwd, literalVersion);
    if (!fse__default.default.existsSync(versionDirectory)) {
      return;
    }
    this.groups[literalVersion] = fse__default.default.readdirSync(versionDirectory).filter((filename) => fse__default.default.statSync(path__default.default.join(versionDirectory, filename)).isFile()).filter((filename) => CODEMOD_FILE_REGEXP.test(filename)).map((filename) => {
      const kind = parseCodemodKindFromFilename(filename);
      const baseDirectory = this.cwd;
      return codemodFactory({ kind, baseDirectory, version: version2, filename });
    });
  }
}
const parseCodemodKindFromFilename = (filename) => {
  const kind = filename.split(".").at(-2);
  assert__default.default(kind !== void 0);
  assert__default.default(CODEMOD_ALLOWED_SUFFIXES.includes(kind));
  return kind;
};
const codemodRepositoryFactory = (cwd = INTERNAL_CODEMODS_DIRECTORY) => {
  return new CodemodRepository(cwd);
};
const index$7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  codemodRepositoryFactory,
  constants: constants$1
}, Symbol.toStringTag, { value: "Module" }));
class CodemodRunner {
  project;
  range;
  isDry;
  logger;
  selectCodemodsCallback;
  constructor(project, range) {
    this.project = project;
    this.range = range;
    this.isDry = false;
    this.logger = null;
    this.selectCodemodsCallback = null;
  }
  setRange(range) {
    this.range = range;
    return this;
  }
  setLogger(logger) {
    this.logger = logger;
    return this;
  }
  onSelectCodemods(callback) {
    this.selectCodemodsCallback = callback;
    return this;
  }
  dry(enabled = true) {
    this.isDry = enabled;
    return this;
  }
  createRepository(codemodsDirectory) {
    const repository = codemodRepositoryFactory(
      codemodsDirectory ?? INTERNAL_CODEMODS_DIRECTORY
    );
    repository.refresh();
    return repository;
  }
  async safeRunAndReport(codemods) {
    if (this.isDry) {
      this.logger?.warn?.(
        "Running the codemods in dry mode. No files will be modified during the process."
      );
    }
    try {
      const reports$1 = await this.project.runCodemods(codemods, { dry: this.isDry });
      this.logger?.raw?.(reports(reports$1));
      if (!this.isDry) {
        const nbAffectedTotal = reports$1.flatMap((report) => report.report.ok).reduce((acc, nb) => acc + nb, 0);
        this.logger?.debug?.(
          `Successfully ran ${highlight(codemods.length)} codemod(s), ${highlight(nbAffectedTotal)} change(s) have been detected`
        );
      }
      return successReport$1();
    } catch (e) {
      return erroredReport$1(unknownToError(e));
    }
  }
  async runByUID(uid, codemodsDirectory) {
    const repository = this.createRepository(codemodsDirectory);
    if (!repository.has(uid)) {
      throw new Error(`Unknown codemod UID provided: ${uid}`);
    }
    const codemods = repository.find({ uids: [uid] }).flatMap(({ codemods: codemods2 }) => codemods2);
    return this.safeRunAndReport(codemods);
  }
  async run(codemodsDirectory) {
    const repository = this.createRepository(codemodsDirectory);
    const codemodsInRange = repository.find({ range: this.range });
    const selectedCodemods = this.selectCodemodsCallback ? await this.selectCodemodsCallback(codemodsInRange) : codemodsInRange;
    if (selectedCodemods.length === 0) {
      this.logger?.debug?.(`Found no codemods to run for ${versionRange(this.range)}`);
      return successReport$1();
    }
    const codemods = selectedCodemods.flatMap(({ codemods: codemods2 }) => codemods2);
    const codemodsByVersion = fp.groupBy("version", codemods);
    const fRange = versionRange(this.range);
    this.logger?.debug?.(
      `Found ${highlight(codemods.length)} codemods for ${highlight(fp.size(codemodsByVersion))} version(s) using ${fRange}`
    );
    for (const [version$1, codemods2] of Object.entries(codemodsByVersion)) {
      this.logger?.debug?.(`- ${version(semVerFactory(version$1))} (${codemods2.length})`);
    }
    return this.safeRunAndReport(codemods);
  }
}
const codemodRunnerFactory = (project, range) => {
  return new CodemodRunner(project, range);
};
const successReport$1 = () => ({ success: true, error: null });
const erroredReport$1 = (error) => ({ success: false, error });
class Upgrader {
  project;
  npmPackage;
  target;
  codemodsTarget;
  isDry;
  logger;
  requirements;
  confirmationCallback;
  constructor(project, target, npmPackage) {
    this.project = project;
    this.npmPackage = npmPackage;
    this.target = target;
    this.syncCodemodsTarget();
    this.isDry = false;
    this.requirements = [];
    this.logger = null;
    this.confirmationCallback = null;
  }
  getNPMPackage() {
    return this.npmPackage;
  }
  getProject() {
    return this.project;
  }
  getTarget() {
    return semVerFactory(this.target.raw);
  }
  setRequirements(requirements) {
    this.requirements = requirements;
    return this;
  }
  setTarget(target) {
    this.target = target;
    return this;
  }
  syncCodemodsTarget() {
    this.codemodsTarget = semVerFactory(
      `${this.target.major}.${this.target.minor}.${this.target.patch}`
    );
    this.logger?.debug?.(
      `The codemods target has been synced with the upgrade target. The codemod runner will now look for ${version(
        this.codemodsTarget
      )}`
    );
    return this;
  }
  overrideCodemodsTarget(target) {
    this.codemodsTarget = target;
    this.logger?.debug?.(
      `Overriding the codemods target. The codemod runner will now look for ${version(target)}`
    );
    return this;
  }
  setLogger(logger) {
    this.logger = logger;
    return this;
  }
  onConfirm(callback) {
    this.confirmationCallback = callback;
    return this;
  }
  dry(enabled = true) {
    this.isDry = enabled;
    return this;
  }
  addRequirement(requirement) {
    this.requirements.push(requirement);
    const fRequired = requirement.isRequired ? "(required)" : "(optional)";
    this.logger?.debug?.(
      `Added a new requirement to the upgrade: ${highlight(requirement.name)} ${fRequired}`
    );
    return this;
  }
  async upgrade() {
    this.logger?.info?.(
      `Upgrading from ${version(this.project.strapiVersion)} to ${version(this.target)}`
    );
    if (this.isDry) {
      this.logger?.warn?.(
        "Running the upgrade in dry mode. No files will be modified during the process."
      );
    }
    const range = rangeFromVersions(this.project.strapiVersion, this.target);
    const codemodsRange = rangeFromVersions(this.project.strapiVersion, this.codemodsTarget);
    const npmVersionsMatches = this.npmPackage?.findVersionsInRange(range) ?? [];
    this.logger?.debug?.(
      `Found ${highlight(npmVersionsMatches.length)} versions satisfying ${versionRange(range)}`
    );
    try {
      this.logger?.info?.(upgradeStep("Checking requirement", [1, 4]));
      await this.checkRequirements(this.requirements, {
        npmVersionsMatches,
        project: this.project,
        target: this.target
      });
      this.logger?.info?.(upgradeStep("Applying the latest code modifications", [2, 4]));
      await this.runCodemods(codemodsRange);
      this.logger?.debug?.("Refreshing project information...");
      this.project.refresh();
      this.logger?.info?.(upgradeStep("Upgrading Strapi dependencies", [3, 4]));
      await this.updateDependencies();
      this.logger?.info?.(upgradeStep("Installing dependencies", [4, 4]));
      await this.installDependencies();
    } catch (e) {
      return erroredReport(unknownToError(e));
    }
    return successReport();
  }
  async confirm(message) {
    if (typeof this.confirmationCallback !== "function") {
      return true;
    }
    return this.confirmationCallback(message);
  }
  async checkRequirements(requirements, context) {
    for (const requirement of requirements) {
      const { pass, error } = await requirement.test(context);
      if (pass) {
        await this.onSuccessfulRequirement(requirement, context);
      } else {
        await this.onFailedRequirement(requirement, error);
      }
    }
  }
  async onSuccessfulRequirement(requirement, context) {
    const hasChildren = requirement.children.length > 0;
    if (hasChildren) {
      await this.checkRequirements(requirement.children, context);
    }
  }
  async onFailedRequirement(requirement, originalError) {
    const errorMessage = `Requirement failed: ${originalError.message} (${highlight(
      requirement.name
    )})`;
    const warningMessage = originalError.message;
    const confirmationMessage = `Ignore optional requirement "${highlight(requirement.name)}" ?`;
    const error = new Error(errorMessage);
    if (requirement.isRequired) {
      throw error;
    }
    this.logger?.warn?.(warningMessage);
    const response = await this.confirmationCallback?.(confirmationMessage);
    if (!response) {
      throw error;
    }
  }
  async updateDependencies() {
    const { packageJSON, packageJSONPath } = this.project;
    const json = createJSONTransformAPI(packageJSON);
    const dependencies = json.get("dependencies", {});
    const strapiDependencies = this.getScopedStrapiDependencies(dependencies);
    this.logger?.debug?.(
      `Found ${highlight(strapiDependencies.length)} dependency(ies) to update`
    );
    strapiDependencies.forEach(
      (dependency) => this.logger?.debug?.(`- ${dependency[0]} (${dependency[1]} -> ${this.target})`)
    );
    if (strapiDependencies.length === 0) {
      return;
    }
    strapiDependencies.forEach(([name]) => json.set(`dependencies.${name}`, this.target.raw));
    const updatedPackageJSON = json.root();
    if (this.isDry) {
      this.logger?.debug?.(`Skipping dependencies update (${chalk__default.default.italic("dry mode")})`);
      return;
    }
    await saveJSON(packageJSONPath, updatedPackageJSON);
  }
  getScopedStrapiDependencies(dependencies) {
    const { strapiVersion } = this.project;
    const strapiDependencies = [];
    for (const [name, version2] of Object.entries(dependencies)) {
      const isScopedStrapiPackage = name.startsWith(SCOPED_STRAPI_PACKAGE_PREFIX);
      const isOnCurrentStrapiVersion = isValidSemVer(version2) && version2 === strapiVersion.raw;
      if (isScopedStrapiPackage && isOnCurrentStrapiVersion) {
        strapiDependencies.push([name, semVerFactory(version2)]);
      }
    }
    return strapiDependencies;
  }
  async installDependencies() {
    const projectPath = this.project.cwd;
    const packageManagerName = await utils.packageManager.getPreferred(projectPath);
    this.logger?.debug?.(`Using ${highlight(packageManagerName)} as package manager`);
    if (this.isDry) {
      this.logger?.debug?.(`Skipping dependencies installation (${chalk__default.default.italic("dry mode")})`);
      return;
    }
    await utils.packageManager.installDependencies(projectPath, packageManagerName, {
      stdout: this.logger?.stdout,
      stderr: this.logger?.stderr
    });
  }
  async runCodemods(range) {
    const codemodRunner = codemodRunnerFactory(this.project, range);
    codemodRunner.dry(this.isDry);
    if (this.logger) {
      codemodRunner.setLogger(this.logger);
    }
    await codemodRunner.run();
  }
}
const resolveNPMTarget = (project, target, npmPackage) => {
  if (isSemverInstance(target)) {
    const version2 = npmPackage.findVersion(target);
    if (!version2) {
      throw new NPMCandidateNotFoundError(target);
    }
    return version2;
  }
  if (isSemVerReleaseType(target)) {
    const range = rangeFromVersions(project.strapiVersion, target);
    const npmVersionsMatches = npmPackage.findVersionsInRange(range);
    const version2 = npmVersionsMatches.at(-1);
    if (!version2) {
      throw new NPMCandidateNotFoundError(range, `The project is already up-to-date (${target})`);
    }
    return version2;
  }
  throw new NPMCandidateNotFoundError(target);
};
const upgraderFactory = (project, target, npmPackage) => {
  const npmTarget = resolveNPMTarget(project, target, npmPackage);
  const semverTarget = semVerFactory(npmTarget.version);
  if (semver__default.default.eq(semverTarget, project.strapiVersion)) {
    throw new Error(`The project is already using v${semverTarget}`);
  }
  return new Upgrader(project, semverTarget, npmPackage);
};
const successReport = () => ({ success: true, error: null });
const erroredReport = (error) => ({ success: false, error });
const STRAPI_PACKAGE_NAME = "@strapi/strapi";
const constants = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  STRAPI_PACKAGE_NAME
}, Symbol.toStringTag, { value: "Module" }));
const index$6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  constants,
  upgraderFactory
}, Symbol.toStringTag, { value: "Module" }));
class Requirement {
  isRequired;
  name;
  testCallback;
  children;
  constructor(name, testCallback, isRequired) {
    this.name = name;
    this.testCallback = testCallback;
    this.isRequired = isRequired ?? true;
    this.children = [];
  }
  setChildren(children) {
    this.children = children;
    return this;
  }
  addChild(child) {
    this.children.push(child);
    return this;
  }
  asOptional() {
    const newInstance = requirementFactory(this.name, this.testCallback, false);
    newInstance.setChildren(this.children);
    return newInstance;
  }
  asRequired() {
    const newInstance = requirementFactory(this.name, this.testCallback, true);
    newInstance.setChildren(this.children);
    return newInstance;
  }
  async test(context) {
    try {
      await this.testCallback?.(context);
      return ok();
    } catch (e) {
      if (e instanceof Error) {
        return errored(e);
      }
      if (typeof e === "string") {
        return errored(new Error(e));
      }
      return errored(new Error("Unknown error"));
    }
  }
}
const ok = () => ({ pass: true, error: null });
const errored = (error) => ({ pass: false, error });
const requirementFactory = (name, testCallback, isRequired) => new Requirement(name, testCallback, isRequired);
const index$5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  requirementFactory
}, Symbol.toStringTag, { value: "Module" }));
const REQUIRE_AVAILABLE_NEXT_MAJOR = requirementFactory(
  "REQUIRE_AVAILABLE_NEXT_MAJOR",
  (context) => {
    const { project, target } = context;
    const currentMajor = project.strapiVersion.major;
    const targetedMajor = target.major;
    if (targetedMajor === currentMajor) {
      throw new Error(`You're already on the latest major version (v${currentMajor})`);
    }
  }
);
const REQUIRE_LATEST_FOR_CURRENT_MAJOR = requirementFactory(
  "REQUIRE_LATEST_FOR_CURRENT_MAJOR",
  (context) => {
    const { project, target, npmVersionsMatches } = context;
    const { major: currentMajor } = project.strapiVersion;
    const invalidMatches = npmVersionsMatches.filter(
      (match) => semVerFactory(match.version).major === currentMajor
    );
    if (invalidMatches.length > 0) {
      const invalidVersions = invalidMatches.map((match) => match.version);
      const invalidVersionsCount = invalidVersions.length;
      throw new Error(
        `Doing a major upgrade requires to be on the latest v${currentMajor} version, but found ${invalidVersionsCount} versions between the current one and ${target}. Please upgrade to ${invalidVersions.at(-1)} and try again.`
      );
    }
  }
);
const REQUIRE_GIT_CLEAN_REPOSITORY = requirementFactory(
  "REQUIRE_GIT_CLEAN_REPOSITORY",
  async (context) => {
    const git = simpleGit__default.default({ baseDir: context.project.cwd });
    const status = await git.status();
    if (!status.isClean()) {
      throw new Error(
        "Repository is not clean. Please commit or stash any changes before upgrading"
      );
    }
  }
);
const REQUIRE_GIT_REPOSITORY = requirementFactory(
  "REQUIRE_GIT_REPOSITORY",
  async (context) => {
    const git = simpleGit__default.default({ baseDir: context.project.cwd });
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      throw new Error("Not a git repository (or any of the parent directories)");
    }
  }
).addChild(REQUIRE_GIT_CLEAN_REPOSITORY.asOptional());
const REQUIRE_GIT_INSTALLED = requirementFactory(
  "REQUIRE_GIT_INSTALLED",
  async (context) => {
    const git = simpleGit__default.default({ baseDir: context.project.cwd });
    try {
      await git.version();
    } catch {
      throw new Error("Git is not installed");
    }
  }
).addChild(REQUIRE_GIT_REPOSITORY.asOptional());
const REQUIRE_GIT = requirementFactory("REQUIRE_GIT", null).addChild(
  REQUIRE_GIT_INSTALLED.asOptional()
);
const latest = async (upgrader, options) => {
  if (options.target !== ReleaseType.Latest) {
    return;
  }
  const npmPackage = upgrader.getNPMPackage();
  const target = upgrader.getTarget();
  const project = upgrader.getProject();
  const { strapiVersion: current } = project;
  const fTargetMajor = highlight(`v${target.major}`);
  const fCurrentMajor = highlight(`v${current.major}`);
  const fTarget = version(target);
  const fCurrent = version(current);
  const isMajorUpgrade = target.major > current.major;
  if (isMajorUpgrade) {
    options.logger.warn(
      `Detected a major upgrade for the "${highlight(ReleaseType.Latest)}" tag: ${fCurrent} > ${fTarget}`
    );
    const newerPackageRelease = npmPackage.findVersionsInRange(rangeFactory(`>${current.raw} <${target.major}`)).at(-1);
    if (newerPackageRelease) {
      const fLatest = version(semVerFactory(newerPackageRelease.version));
      options.logger.warn(
        `It's recommended to first upgrade to the latest version of ${fCurrentMajor} (${fLatest}) before upgrading to ${fTargetMajor}.`
      );
    }
    const proceedAnyway = await upgrader.confirm(`I know what I'm doing. Proceed anyway!`);
    if (!proceedAnyway) {
      throw new AbortedError();
    }
  }
};
const upgrade = async (options) => {
  const timer = timerFactory();
  const { logger, codemodsTarget } = options;
  const cwd = path__default.default.resolve(options.cwd ?? process.cwd());
  const project = projectFactory(cwd);
  logger.debug(projectDetails(project));
  if (!isApplicationProject(project)) {
    throw new Error(
      `The "${options.target}" upgrade can only be run on a Strapi project; for plugins, please use "codemods".`
    );
  }
  logger.debug(
    `Application: VERSION=${version(project.packageJSON.version)}; STRAPI_VERSION=${version(project.strapiVersion)}`
  );
  const npmPackage = npmPackageFactory(STRAPI_PACKAGE_NAME);
  await npmPackage.refresh();
  const upgrader = upgraderFactory(project, options.target, npmPackage).dry(options.dry ?? false).onConfirm(options.confirm ?? null).setLogger(logger);
  if (codemodsTarget !== void 0) {
    upgrader.overrideCodemodsTarget(codemodsTarget);
  }
  await runUpgradePrompts(upgrader, options);
  addUpgradeRequirements(upgrader, options);
  const upgradeReport = await upgrader.upgrade();
  if (!upgradeReport.success) {
    throw upgradeReport.error;
  }
  timer.stop();
  logger.info(`Completed in ${durationMs(timer.elapsedMs)}ms`);
};
const runUpgradePrompts = async (upgrader, options) => {
  if (options.target === ReleaseType.Latest) {
    await latest(upgrader, options);
  }
};
const addUpgradeRequirements = (upgrader, options) => {
  if (options.target === ReleaseType.Major) {
    upgrader.addRequirement(REQUIRE_AVAILABLE_NEXT_MAJOR).addRequirement(REQUIRE_LATEST_FOR_CURRENT_MAJOR);
  }
  upgrader.addRequirement(REQUIRE_GIT.asOptional());
};
const resolvePath = (cwd) => path__default.default.resolve(cwd ?? process.cwd());
const getRangeFromTarget = (currentVersion, target) => {
  if (isSemverInstance(target)) {
    return rangeFactory(target);
  }
  const { major, minor, patch } = currentVersion;
  switch (target) {
    case ReleaseType.Latest:
      throw new Error("Can't use <latest> to create a codemods range: not implemented");
    case ReleaseType.Major:
      return rangeFactory(`${major}`);
    case ReleaseType.Minor:
      return rangeFactory(`${major}.${minor}`);
    case ReleaseType.Patch:
      return rangeFactory(`${major}.${minor}.${patch}`);
    default:
      throw new Error(`Invalid target set: ${target}`);
  }
};
const findRangeFromTarget = (project, target) => {
  if (isRangeInstance(target)) {
    return target;
  }
  if (isApplicationProject(project)) {
    return getRangeFromTarget(project.strapiVersion, target);
  }
  return rangeFactory("*");
};
const runCodemods = async (options) => {
  const timer = timerFactory();
  const { logger, uid } = options;
  const cwd = resolvePath(options.cwd);
  const project = projectFactory(cwd);
  const range = findRangeFromTarget(project, options.target);
  logger.debug(projectDetails(project));
  logger.debug(`Range: set to ${versionRange(range)}`);
  const codemodRunner = codemodRunnerFactory(project, range).dry(options.dry ?? false).onSelectCodemods(options.selectCodemods ?? null).setLogger(logger);
  let report;
  if (uid !== void 0) {
    logger.debug(`Running a single codemod: ${codemodUID(uid)}`);
    report = await codemodRunner.runByUID(uid);
  } else {
    report = await codemodRunner.run();
  }
  if (!report.success) {
    throw report.error;
  }
  timer.stop();
  logger.info(`Completed in ${timer.elapsedMs}`);
};
const listCodemods = async (options) => {
  const { logger, target } = options;
  const cwd = resolvePath(options.cwd);
  const project = projectFactory(cwd);
  const range = findRangeFromTarget(project, target);
  logger.debug(projectDetails(project));
  logger.debug(`Range: set to ${versionRange(range)}`);
  const repo = codemodRepositoryFactory();
  repo.refresh();
  const groups = repo.find({ range });
  const codemods = groups.flatMap((collection) => collection.codemods);
  logger.debug(`Found ${highlight(codemods.length)} codemods`);
  if (codemods.length === 0) {
    logger.info(`Found no codemods matching ${versionRange(range)}`);
    return;
  }
  const fCodemods = codemodList(codemods);
  logger.raw(fCodemods);
};
const index$4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  listCodemods,
  runCodemods,
  upgrade
}, Symbol.toStringTag, { value: "Module" }));
class Logger {
  isDebug;
  isSilent;
  nbErrorsCalls;
  nbWarningsCalls;
  constructor(options = {}) {
    this.isDebug = options.debug ?? false;
    this.isSilent = options.silent ?? false;
    this.nbErrorsCalls = 0;
    this.nbWarningsCalls = 0;
  }
  get isNotSilent() {
    return !this.isSilent;
  }
  get errors() {
    return this.nbErrorsCalls;
  }
  get warnings() {
    return this.nbWarningsCalls;
  }
  get stdout() {
    return this.isSilent ? void 0 : process.stdout;
  }
  get stderr() {
    return this.isSilent ? void 0 : process.stderr;
  }
  setDebug(debug) {
    this.isDebug = debug;
    return this;
  }
  setSilent(silent) {
    this.isSilent = silent;
    return this;
  }
  debug(...args) {
    const isDebugEnabled = this.isNotSilent && this.isDebug;
    if (isDebugEnabled) {
      console.log(chalk__default.default.cyan(`[DEBUG]	[${nowAsISO()}]`), ...args);
    }
    return this;
  }
  error(...args) {
    this.nbErrorsCalls += 1;
    if (this.isNotSilent) {
      console.error(chalk__default.default.red(`[ERROR]	[${nowAsISO()}]`), ...args);
    }
    return this;
  }
  info(...args) {
    if (this.isNotSilent) {
      console.info(chalk__default.default.blue(`[INFO]	[${(/* @__PURE__ */ new Date()).toISOString()}]`), ...args);
    }
    return this;
  }
  raw(...args) {
    if (this.isNotSilent) {
      console.log(...args);
    }
    return this;
  }
  warn(...args) {
    this.nbWarningsCalls += 1;
    if (this.isNotSilent) {
      console.warn(chalk__default.default.yellow(`[WARN]	[${(/* @__PURE__ */ new Date()).toISOString()}]`), ...args);
    }
    return this;
  }
}
const nowAsISO = () => (/* @__PURE__ */ new Date()).toISOString();
const loggerFactory = (options = {}) => new Logger(options);
const index$3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loggerFactory
}, Symbol.toStringTag, { value: "Module" }));
const codemodReportFactory = (codemod, report) => ({
  codemod,
  report
});
const reportFactory = (report) => ({ ...report });
const index$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  codemodReportFactory,
  reportFactory
}, Symbol.toStringTag, { value: "Module" }));
const index$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  code: index$c,
  json: index$b
}, Symbol.toStringTag, { value: "Module" }));
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  codemod: index$8,
  codemodRepository: index$7,
  error: index$9,
  f: index$f,
  fileScanner: index$d,
  logger: index$3,
  project: index$a,
  report: index$2,
  requirement: index$5,
  runner: index$1,
  timer: index$g,
  upgrader: index$6,
  version: index$e
}, Symbol.toStringTag, { value: "Module" }));
exports.modules = index;
exports.tasks = index$4;
//# sourceMappingURL=index.js.map
