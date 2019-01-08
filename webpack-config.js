var webpack = require( "webpack" );
var path = require("path");
var CommonsChunkPlugin = require( "webpack/lib/optimize/CommonsChunkPlugin" );
var HtmlWebpackPlugin = require( "html-webpack-plugin" );
var GlobalizePlugin = require( "globalize-webpack-plugin" );

var production = process.env.NODE_ENV === "production";
var globalizeCompiledDataRegex = new RegExp( /^(globalize\-compiled\-data)\-\S+$/ );

function subLocaleNames( name ) {
	return name.replace( globalizeCompiledDataRegex, "$1" );
}

module.exports = {
	entry: {
		main: "./src/index.js",
	},
	output: {
		path: path.join( __dirname, production ? "./dist" : "./tmp" ),
		publicPath: production ? "" : "http://localhost:9000/",
		chunkFilename: "[name].[chunkhash].js",
		filename: production ? "[name].[chunkhash].js" : "[name].js"
	},
	resolve: {
		extensions: [ "*", ".js" ]
	},
    devServer: {
        port: 9000,
        open: true
    },
	plugins: [
		new HtmlWebpackPlugin({
			template: "./public/index-template.html",
			// filter to a single compiled globalize language
			// change 'en' to language of choice or remove inject all languages
			// NOTE: last language will be set language
			chunks: [ "vendor", "globalize-compiled-data-en", "main" ],
			chunksSortMode: function ( c1, c2 ) {
				var orderedChunks = [ "vendor", "globalize-compiled-data", "main" ];
				var o1 = orderedChunks.indexOf( subLocaleNames( c1.names[ 0 ]));
				var o2 = orderedChunks.indexOf( subLocaleNames( c2.names[ 0 ]));
				return o1 - o2;
			},
		}),
		new GlobalizePlugin({
			production: true,
			developmentLocale: "en",
			supportedLocales: [ "ar", "de", "en", "es", "pt", "ru", "zh" ],
			messages: "messages/[locale].json",
			output: "i18n/[locale].[chunkhash].js"
		}),
        new CommonsChunkPlugin({
            name: "vendor",
            minChunks: function(module) {
                return (
                    module.context && module.context.indexOf("node_modules") !== -1
                );
            }
        })
	].concat( production ? [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		})
	] : [] )
};
