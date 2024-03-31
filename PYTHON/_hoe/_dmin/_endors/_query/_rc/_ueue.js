#!/usr/bin/env node
/* Based on webpack/bin/webpack.js */
/* eslint-disable no-console */

"use strict";

/**
 * @param {string} command process to run
 * @param {string[]} args command line arguments
 * @returns {Promise<void>} promise
 */
const runCommand = (command, args) => {
  const cp = require("child_process");
  return new Promise((resolve, reject) => {
    const executedCommand = cp.spawn(command, args, {
      stdio: "inherit",
      shell: true,
    });

    executedCommand.on("error", (error) => {
      reject(error);
    });

    executedCommand.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

/**
 * @param {string} packageName name of the package
 * @returns {boolean} is the package installed?
 */
const isInstalled = (packageName) => {
  if (process.versions.pnp) {
    return true;
  }

  const path = require("path");
  const fs = require("graceful-fs");

  let dir = __dirname;

  do {
    try {
      if (
        fs.statSync(path.join(dir, "node_modules", packageName)).isDirectory()
      ) {
        return true;
      }
    } catch (_error) {
      // Nothing
    }
    // eslint-disable-next-line no-cond-assign
  } while (dir !== (dir = path.dirname(dir)));

  // https://github.com/nodejs/node/blob/v18.9.1/lib/internal/modules/cjs/loader.js#L1274
  // @ts-ignore
  for (const internalPath of require("module").globalPaths) {
    try {
      if (fs.statSync(path.join(internalPath, packageName)).isDirectory()) {
        return true;
      }
    } catch (_error) {
      // Nothing
    }
  }

  return false;
};

/**
 * @param {CliOption} cli options
 * @returns {void}
 */
const runCli = (cli) => {
  if (cli.preprocess) {
    cli.preprocess();
  }
  const path = require("path");
  const pkgPath = require.resolve(`${cli.package}/package.json`);
  // eslint-disable-next-line import/no-dynamic-require
  const pkg = require(pkgPath);

  if (pkg.type === "module" || /\.mjs/i.test(pkg.bin[cli.binName])) {
    import(path.resolve(path.dirname(pkgPath), pkg.bin[cli.binName])).catch(
      (error) => {
        console.error(error);
        process.exitCode = 1;
      }
    );
  } else {
    // eslint-disable-next-line import/no-dynamic-require
    require(path.resolve(path.dirname(pkgPath), pkg.bin[cli.binName]));
  }
};

/**
 * @typedef {Object} CliOption
 * @property {string} name display name
 * @property {string} package npm package name
 * @property {string} binName name of the executable file
 * @property {boolean} installed currently installed?
 * @property {string} url homepage
 * @property {function} preprocess preprocessor
 */

/** @type {CliOption} */
const cli = {
  name: "webpack-cli",
  package: "webpack-cli",
  binName: "webpack-cli",
  installed: isInstalled("webpack-cli"),
  url: "https://github.com/webpack/webpack-cli",
  preprocess() {
    process.argv.splice(2, 0, "serve");
  },
};

if (!cli.installed) {
  const path = require("path");
  const fs = require("graceful-fs");
  const readLine = require("readline");

  const notify 