var webpack = require( "webpack" );
var path = require("path");
var production = process.env.NODE_ENV === "production";
// var ManifestPlugin = require('webpack-manifest-plugin');

var HtmlWebpackPlugin = require( "html-webpack-plugin" );
var CopyWebpackPlugin = require('copy-webpack-plugin');

var DynamicGlobalizeWebpackPlugin = require( "./src/globalize/DynamicWebpackPlugin.js" );
var dgwPluginInstance = new DynamicGlobalizeWebpackPlugin(
    require('./localeSettings.json') // if you change initialLocale you need to adapt static locale data loading in App.js
)

var globalizeCompiledDataRegex = new RegExp( /^(globalize\-compiled\-data)\-\S+$/ );
function subLocaleNames( name ) {
	return name.replace( globalizeCompiledDataRegex, "$1" );
}

module.exports = {
	entry: {
		main: "./src/index.js",
	},
	output: {
		path: path.join( __dirname, production ? "./build" : "./tmp" ),
		publicPath: production ? "" : "http://localhost:3000/",
		chunkFilename: "[name].[hash].js",
		filename: production ? "[name].[hash].js" : "[name].js"
	},
	resolve: {
		extensions: [ "*", ".js" ]
	},
    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            // images and fonts
            {
                test: /\.(gif|ttf|eot|svg|jpg|woff2?)$/,
                use: 'url-loader?name=[name].[ext]',
            },
        ]
    },
    devServer: {
        port: 3000,
        open: true,
        disableHostCheck: true,
        historyApiFallback: true
    },
	plugins: [
		new HtmlWebpackPlugin({
			template: "./public/index-template.html",
			// filter to a single compiled globalize language
			// change 'en' to language of choice or remove inject all languages
			// NOTE: last language will be set language
			chunks: [ "vendors", "main" ],
			chunksSortMode: function ( c1, c2 ) {
				var orderedChunks = [ "vendors", "main" ];
				var o1 = orderedChunks.indexOf( subLocaleNames( c1.names[ 0 ]));
				var o2 = orderedChunks.indexOf( subLocaleNames( c2.names[ 0 ]));
				return o1 - o2;
			},
		}),
        dgwPluginInstance,
        new CopyWebpackPlugin(
            dgwPluginInstance.getLocalizeDataCopyPatterns()
        )
        //, new ManifestPlugin({writeToFileEmit: true})
	].concat( production ? [
		// removed from webpack 4
		// new webpack.optimize.UglifyJsPlugin({
		// 	compress: {
		// 		warnings: false
		// 	}
		// })
	] : [] ),
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        },
        minimize: false
    }
};
