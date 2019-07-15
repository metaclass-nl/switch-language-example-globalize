"use strict";

const SkipAMDPlugin = require("skip-amd-webpack-plugin");
const NormalModuleReplacementPlugin = require("webpack/lib/NormalModuleReplacementPlugin");

class DynamicWebpackPlugin {

    constructor(attributes) {
        this.production = attributes.production;
        this.developmentLocale = attributes.developmentLocale;
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
        const result = [ { from: 'messages', to: 'messages' } ];
        for (let locale of this.supportedLocales) {
            result.push({ from: basePath + locale, to: basePath + locale });
        }
        return result;
    }
}

module.exports = DynamicWebpackPlugin;