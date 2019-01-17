# Switch language example with globalize.js and react-widgets 

This is a modified version of examples/app-npm-webpack from globalize 1.4.0.
It has been adapted for compatibility with start-react-app but with
support for Globalize.js and react-widgets. 

Furthermore it has been extended to allow the user to change the locale.

This version is under development. 

## Requirements

**1. Install the app**

```
git clone https://github.com/metaclass-nl/switch-language-example-globalize.git
```
Or download the zip file from github and extract all.

**2. Install app development dependencies**

This example uses `npm` to download the app development dependencies (i.e.,
Globalize, CLDR data, Cldrjs, Webpack, [Globalize Webpack Plugin][], and
others).

```
npm install
```

## Running the app

### Development server

```
npm start
```

1. Start a server by running `npm start`, which uses webpack's live reload HMR
(Hot Module Replacement). See `package.json` to understand the actual shell
command that is used.

### Production build

```
npm run build
```

1. Generate the compiled bundles by running `npm run build`, which will be
created at `./build`. Note that all the production code is already minified using UglifyJS. 
See `package.json` to understand the actual shell command that is used.
1. Point your browser at `./build/index.html` to run the application using the
generated production files. Edit this file to display the application using a
different locale (source code has instructions).

### Limitations

Uses webpack-dev-server for development, which has a security issues. Keep
'npm start' behind a firewall that only allows local access from the same machine!

- If Globalize.js does not have a required number formatter (for the specified format and locale) 
  you may get the following error:
  TypeError: Globalize\[runtimeKey\] is undefined
- If Globalize.js does not have a required date formatter (for the specified format and locale) 
  you may get the following error: TypeError: locale(...).formatDate is not a function
To prevent these errors: 
- Don't use formats on react widgets that you did not include formatters and parsers for. 
  The formatters and parsers supplied in src/converters are only those used by default
  by react widgets. If you need other formats you need to define more formatter and parser
  functions and include the file you defined them in so that Globalize Webpack Plugin will
  precompile them and include them in each of the locale chunks.
- Don't use locales whose chunk with cldr data, formatters and parsers are not loaded. 
  Either include them through a script tag in you single html page or include them dynamically like 
  App.changeLocale does. The names of the files are in manifest.json

## Globalize Webpack Plugin modes

### Production mode

This version uses Globalize runtime mode for both development and production.
This is for two reasons:
- In development mode Globalize Webpack Plugin includes all localization data for the
  development locale. This does not only result in a big bundle, it also prevents
  bundling errors to surface in development. But they will occur in productions,
  whick is too late and hard to debug.
- In development mode Globalize Webpack Plugin only includes localization data for the
  development locale, so changing the locale a runtime will allways cause errors.

The price you pay for using production mode is slower compilation, especially if you
include many supportedLocales. But (re)loading in the browser will be faster 
because of the bundles to be loaded will be much smaller.  

Furthermore, if you change your messages or formatters after 'npm start' 
you may need to stop and restart.

1. Note the production bundles are split into three chunks:
(a) vendor, which holds third-party libraries, which in this case means
Globalize Runtime modules, (b) i18n precompiled data, which means the minimum
yet sufficient set of precompiled i18n data that your application needs (one
file for each supported locale), and (c) app, which means your application code.
1. Note that your formatters are already precompiled. This is
obvious, but worth emphasizing. It means your formatters are prebuilt, so no client
CPU clock is wasted to generate them and no CLDR or messages data needs to be
dynamically loaded. It means fast to load code (small code) and fast to run
code.
1. Understand the demo by reading the source code. We have comments there for
you.

Problem: it is not clear how to dynamcally load the required chunk for a locale
(requires the chunkhash...) 

### Development mode

1. Note that for faster page reload, formatters are created
dynamically and automatically by the [Globalize Webpack Plugin][].
1. Note you can specify the development locale of your choice by setting the
`developmentLocale` property of the Globalize Webpack Plugin on the Webpack
config file.
1. Note that CLDR data and your messages data are automatically loaded by the
[Globalize Webpack Plugin][].
1. Understand the demo by reading the source code. We have comments there for
you.

### Setting the mode

In webpack-config.js we have set the the mode to allways be production by
```
production: true,
```
You can enable development mode for 'npm start' by changing it to:
```
production: production,
```
We also moved CommonsChunkPlugin from concat( production ? [ 
to the main module.exports so that is is allways included. You can move it back
to only have one single chunk for 'npm start'. 

Finally we changed output.production from 
```
? "[name].[chunkhash].js" : "app.js" 
```
to
```
? "[name].[chunkhash].js" : "[name].js"
```
You may have to change it back for using one single chunk for 'npm start'. 


For more information about the plugin, see the [Globalize Webpack Plugin][]
documentation.

[Globalize Webpack Plugin]: https://github.com/rxaviers/globalize-webpack-plugin
