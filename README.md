# Switch language example with globalize.js and webpack 4 

This is a modified version of [examples/app-npm-webpack](https://github.com/globalizejs/globalize/tree/master/examples/app-npm-webpack) 
from globalize 1.4.0 that allows the user to change the locale, then dynamically loads aditional localize converters and messages. 
[Click here to try it out](https://metaclass.nl/globalize/master)

This version uses webpack 4. 
It does not use [globalize-webpack-plugin](https://github.com/rxaviers/globalize-webpack-plugin) but
instead, uses [skip-amd-webpack-plugin](https://github.com/rxaviers/skip-amd-webpack-plugin) 
and loads localization data through cldr. 

Dynamic loading is done by `src/globalize/LocalDataLoader.js`. You may need to adapt it so suit the needs of your own application.

Other versions of this example are available that combine globalize.js with react.js and [react-widgets](https://github.com/jquense/react-widgets):
- [for webpack 4](https://github.com/metaclass-nl/switch-language-example-globalize/tree/react-webpack4) using cldr
- [for webpack 3](https://github.com/metaclass-nl/switch-language-example-globalize/tree/react-webpack-plugin2) using globalize-webpack-plugin 2

The [version for webpack 4 using globalize-webpack-plugin 3](https://github.com/metaclass-nl/switch-language-example-globalize/tree/react-webpack-plugin3) currently does not work due to a bug in globalize-webpack-plugin

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
- If you change the initialLocale you need to modify the static includes of 
  the locale data in App.js accordingly.
- globalization data files are not versioned (do not have the hash in their path) 
  so caching may cause errors in the application if they are updated. You may need to 
  clear the cache of your webserver. Theoretically they may also be cached elsewhere
  between your server and the clients, but if that would really happen any api call
  using json could be cached so most single page applications would not work properly.
