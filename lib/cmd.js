/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

var utils = require("../lib/utils");
var console = utils.console;

var DEBUG_VALUES = ["binary", "verbose", "binaryArgs", "overload", "profile"];

function prepare(mode, program, actionCallback) {
  return function(commanderOptions) {
    return utils.getManifest({
      addonDir: program.addonDir
    }).then(function(manifest) {
      validateProgram(program);
      console.log("Starting jpm " + mode + " on " +
                  (manifest.title || manifest.name));
      return actionCallback(manifest, commanderOptions);
    });
  };
}
exports.prepare = prepare;

function isEmptyCommand(program) {
  if (!program.args.length) {
    return true;
  }
  if (!program.args.filter(function(a) {
    return typeof a === "object";
  }).length) {
    return true;
  }
  return false;
}
exports.isEmptyCommand = isEmptyCommand;

function validateProgram(program) {
  Object.keys(program).filter(function(option) {
    return ~DEBUG_VALUES.indexOf(option);
  }).forEach(function(option) {
    if (program.verbose) {
      console.log(typeof program[option] !== "boolean" ?
        (option + " set to " + program[option]) :
        (option + " set"));
    }
    if (program.overload && (!process.env.JETPACK_ROOT &&
                             typeof program.overload === "boolean")) {
      console.warn(
        "`overload` flag specified, but no `JETPACK_ROOT` environment " +
          "variable set. Using built in Firefox SDK instead.");
    }
  });
}
exports.validateProgram = validateProgram;
