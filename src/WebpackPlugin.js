"use strict";

//const CommonJsRequireDependency = require("webpack/lib/dependencies/CommonJsRequireDependency");
//const fs = require("fs");
//const path = require("path");
const SkipAMDPlugin = require("skip-amd-webpack-plugin");
//const util = require("./util");

/**
 * Development Mode:
 * - Automatically loads CLDR data (i.e., injects `Globalize.load(<necessary CLDR data>)`).
 * - Automatically define default locale (i.e., injects `Globalize.locale(<defaultLocale>)`).
 */
class WebpackPlugin {
    constructor(attributes) {

    }

    apply(compiler) {
        // Skip AMD part of Globalize Runtime UMD wrapper.
        compiler.apply(new SkipAMDPlugin(/(^|[\/\\])globalize($|[\/\\])/));

    }
}

module.exports = WebpackPlugin;