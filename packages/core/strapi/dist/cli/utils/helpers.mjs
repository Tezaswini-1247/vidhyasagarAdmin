import chalk from "chalk";
import { isString, isArray, has } from "lodash/fp";
import "inquirer";
import "boxen";
const bytesPerKb = 1024;
const sizes = ["B ", "KB", "MB", "GB", "TB", "PB"];
const readableBytes = (bytes, decimals = 1, padStart = 0) => {
  if (!bytes) {
    return "0";
  }
  const i = Math.floor(Math.log(bytes) / Math.log(bytesPerKb));
  const result = `${parseFloat((bytes / bytesPerKb ** i).toFixed(decimals))} ${sizes[i].padStart(
    2
  )}`;
  return result.padStart(padStart);
};
const exitWith = (code, message, options = {}) => {
  const { logger = console, prc = process } = options;
  const log = (message2) => {
    if (code === 0) {
      logger.log(chalk.green(message2));
    } else {
      logger.error(chalk.red(message2));
    }
  };
  if (isString(message)) {
    log(message);
  } else if (isArray(message)) {
    message.forEach((msg) => log(msg));
  }
  prc.exit(code);
};
const assertUrlHasProtocol = (url, protocol) => {
  if (!url.protocol) {
    exitWith(1, `${url.toString()} does not have a protocol`);
  }
  if (!protocol) {
    return;
  }
  if (isString(protocol)) {
    if (protocol !== url.protocol) {
      exitWith(1, `${url.toString()} must have the protocol ${protocol}`);
    }
    return;
  }
  if (!protocol.some((protocol2) => url.protocol === protocol2)) {
    return exitWith(
      1,
      `${url.toString()} must have one of the following protocols: ${protocol.join(",")}`
    );
  }
};
const ifOptions = (conditionCallback, isMetCallback = async () => {
}, isNotMetCallback = async () => {
}) => {
  return async (command) => {
    const opts = command.opts();
    if (await conditionCallback(opts)) {
      await isMetCallback(command);
    } else {
      await isNotMetCallback(command);
    }
  };
};
const assertCwdContainsStrapiProject = (name) => {
  const logErrorAndExit = () => {
    console.log(
      `You need to run ${chalk.yellow(
        `strapi ${name}`
      )} in a Strapi project. Make sure you are in the right directory.`
    );
    process.exit(1);
  };
  try {
    const pkgJSON = require(`${process.cwd()}/package.json`);
    if (!has("dependencies.@strapi/strapi", pkgJSON) && !has("devDependencies.@strapi/strapi", pkgJSON)) {
      logErrorAndExit();
    }
  } catch (err) {
    logErrorAndExit();
  }
};
const runAction = (name, action) => (...args) => {
  assertCwdContainsStrapiProject(name);
  Promise.resolve().then(() => {
    return action(...args);
  }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
};
export {
  assertCwdContainsStrapiProject,
  assertUrlHasProtocol,
  exitWith,
  ifOptions,
  readableBytes,
  runAction
};
//# sourceMappingURL=helpers.mjs.map
