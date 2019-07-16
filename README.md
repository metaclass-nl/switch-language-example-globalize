# Switch language example with globalize.js and react-widgets 

This is a modified version of [examples/app-npm-webpack](https://github.com/globalizejs/globalize/tree/master/examples/app-npm-webpack) 
from globalize 1.4.0 that allows the user to change the locale, then dynamically loads aditional localize converters and messages. 

This version uses webpack 4, React.js and also includes examples with [react-widgets](https://github.com/jquense/react-widgets). 
It does not use [globalize-webpack-plugin](https://github.com/rxaviers/globalize-webpack-plugin) but
instead, uses [skip-amd-webpack-plugin](https://github.com/rxaviers/skip-amd-webpack-plugin) 
and loads localization data through cldr. 

Dynamic loading is done by `src/globalize/LocalDataLoader.js`. You may need to adapt it so suit the needs of your own application.

## Requirements

**1. Install the app**

```
git clone https://github.com/metaclass-nl/switch-language-example-globalize.git
git checkout react-webpack4
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
command that is used. See `webpack-config.js` for how the plugins are confgured.

Dynamic loading of localization data is done directly from node_modules subfolders and the messages folder.

### Production build

```
npm run build
```

1. Generate the compiled bundles by running `npm run build`, which will be
created at `./build`. The localization data is copied by [copy-webpack-plugin](https://github.com/webpack-contrib/copy-webpack-plugin). 
See `package.json` to understand the actual shell command that is used. 
See `webpack-config.js` for how the plugins are confgured.
1. Point your browser at `./build/index.html` to run the application using the
generated production files. Edit this file to display the application using a
different initial locale (source code has instructions). Change App const initialLocale accordingly.

### Limitations

- For reasons of security you are advised to **Keep
'npm start' behind a firewall that only allows local access from the same machine!**
- Because of the webpack plugins it does not run on create react app, but instead it
uses HtmlWebpackPlugin to mimic the behavior of create react app. Advantage: no eject
function that creates many dependencies - only direct dependencies are in package.json,
indirect dependencies are left to be managed inderectly.
- If you change the initialLocale you need to modify the static includes of 
  the locale data in App.js accordingly.
