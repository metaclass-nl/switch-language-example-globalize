"use strict";

const SkipAMDPlugin = require("skip-amd-webpack-plugin");

class DynamicWebpackPlugin {

    constructor(attributes) {
        this.production = attributes.production;
        this.initialLocale = attributes.initialLocale;
        this.supportedLocales = attributes.supportedLocales;
        this.messages = attributes.messages;
    }

    apply(compiler) {
        // Skip AMD part of Globalize Runtime UMD wrapper.
        var plugin = new SkipAMDPlugin(/(^|[\/\\])globalize($|[\/\\])/);
        plugin.apply(compiler);
    }

    getLocalizeDataCopyPatterns() {
        const basePath = 'node_modules/cldr-data/main/';
        const result = [ { from: this.messages, to: this.messages } ];
        for (let locale of this.supportedLocales) {
            if (locale != this.initialLocale) {
                result.push({from: basePath + locale, to: basePath + locale});
            } // else data for initial locale is expected to be included statically
        }
        return result;
    }
}

module.exports = DynamicWebpackPlugin;